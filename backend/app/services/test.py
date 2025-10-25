import unittest
from unittest.mock import AsyncMock, MagicMock, call, patch
from dataclasses import dataclass, field
from typing import List, Optional, Any
from app.services.llm_client import LLMSuggestion, LLMVerdict 



# --- Test-Specific Mock DTOs for external dependencies ---
# We must mock DTOs that are imported from other parts of your app (e.g., 'app.dto.risk').
@dataclass
class MockClassifiedClause:
    """Mock for the ClassifiedClause DTO (or similar input clause)."""
    clause_id: str
    content: str
    
@dataclass
class MockRetrievalResponse:
    """Mock for the ClauseResponse DTO (or similar retrieval output)."""
    success: bool
    data: Any # List of similar templates
    message: Optional[str] = None

# --- Hypothetical LLMWorker class (for the test to be runnable) ---
# Assuming the core worker logic you provided is a method on a class like this.
# You will need to ensure your actual llm_client.py file defines a similar class 
# for the patching to work correctly, or replace 'LLMWorker' with the actual class name.

class LLMWorker:
    def __init__(self, llm_service, retrieval_service):
        self.llm_service = llm_service
        self.retrieval_service = retrieval_service

    async def run_analysis(self, clauses: List[MockClassifiedClause], all_clause_types: List[str]):
        """The core worker logic from your snippet, wrapped in a testable method."""
        results = []
        for clause in clauses:
            # print(f"[LLM WORKER] Starting analysis for {clause.clause_id}") # Test prints suppressed
            
            # --- Retrieval ---
            try:
                retrieval_response = await self.retrieval_service.retrieve_similar_templates(clause.clause_id)
            except Exception as e:
                retrieval_response = MockRetrievalResponse(success=False, data=[], message=str(e))

            retrieved_clauses = retrieval_response.data if retrieval_response.success else []
            
            if not retrieval_response.success:
                pass # print(f"[WARNING] Template retrieval failed...") # Test prints suppressed
            else:
                pass # print(f"[LLM WORKER] Retrieved {len(retrieved_clauses)} similar templates") # Test prints suppressed
            
            # --- LLM Analysis ---
            verdict = await self.llm_service.analyze_clause(clause, retrieved_clauses, all_clause_types)
            results.append(verdict)
            
            # Log high-risk findings (logic to test)
            if verdict.llm_verdict_score > 0.7:
                pass # print(f"[ALERT] High-risk clause detected...") # Test prints suppressed
        
        # --- Summary statistics (logic to test) ---
        high_risk_count = sum(1 for v in results if v.llm_verdict_score > 0.7)
        critical_suggestions = sum(
            1 for v in results 
            for s in v.suggestions 
            if s.priority == "CRITICAL"
        )
        total_compliance_issues = sum(len(v.compliance_issues) for v in results)

        # In a real scenario, you might check stdout/logging, 
        # but for simplicity, we return the counts for direct assertion.
        return {
            "results": results,
            "high_risk_count": high_risk_count,
            "critical_suggestions": critical_suggestions,
            "total_compliance_issues": total_compliance_issues
        }


# --- Test Data Setup ---

CLAUSES_TO_ANALYZE = [
    MockClassifiedClause(clause_id="CLAUSE_1_HIGH", content="Clause text with high risk"),
    MockClassifiedClause(clause_id="CLAUSE_2_LOW", content="Safe clause text"),
    MockClassifiedClause(clause_id="CLAUSE_3_FAIL", content="Clause text for retrieval failure scenario"),
]

MOCK_TEMPLATES = ["Template A", "Template B"]

# Mock 1: High Risk Verdict
VERDICT_HIGH_RISK = LLMVerdict(
    clause_id="CLAUSE_1_HIGH",
    llm_analysis="High risk of non-compliance.",
    llm_verdict_score=0.90,
    suggestions=[
        LLMSuggestion(suggestion_type="ComplianceNote", detail="Critical legal issue.", priority="CRITICAL"),
    ],
    compliance_issues=["GDPR Violation Risk"],
)

# Mock 2: Low Risk Verdict
VERDICT_LOW_RISK = LLMVerdict(
    clause_id="CLAUSE_2_LOW",
    llm_analysis="Standard language, low risk.",
    llm_verdict_score=0.25,
    suggestions=[],
    compliance_issues=[],
)

# Mock 3: Retrieval Success
RETRIEVAL_SUCCESS = MockRetrievalResponse(
    success=True, 
    data=MOCK_TEMPLATES, 
    message="Success"
)

# Mock 4: Retrieval Failure
RETRIEVAL_FAILURE = MockRetrievalResponse(
    success=False, 
    data=[], 
    message="Database connection timed out"
)


# --- The Test Case ---

class TestLLMWorker(unittest.IsolatedAsyncioTestCase):
    
    async def test_run_analysis_full_pipeline(self):
        """Tests the orchestration, mocking both success and failure paths."""

        # 1. Arrange: Set up mock services
        
        # Setup mock for llm_service.analyze_clause
        # Side effect maps to the three clauses in CLAUSES_TO_ANALYZE
        mock_llm_service = MagicMock()
        mock_llm_service.analyze_clause = AsyncMock(side_effect=[
            VERDICT_HIGH_RISK,  # For CLAUSE_1_HIGH (High Risk, CRITICAL Suggestion)
            VERDICT_LOW_RISK,   # For CLAUSE_2_LOW (Low Risk)
            VERDICT_LOW_RISK    # For CLAUSE_3_FAIL (Retrieval Fails, but LLM still runs)
        ])
        
        # Setup mock for retrieval_service.retrieve_similar_templates
        mock_retrieval_service = MagicMock()
        mock_retrieval_service.retrieve_similar_templates = AsyncMock(side_effect=[
            RETRIEVAL_SUCCESS,  # For CLAUSE_1_HIGH
            RETRIEVAL_SUCCESS,  # For CLAUSE_2_LOW
            RETRIEVAL_FAILURE   # For CLAUSE_3_FAIL
        ])
        
        # Instantiate the worker with mock services
        worker = LLMWorker(
            llm_service=mock_llm_service, 
            retrieval_service=mock_retrieval_service
        )

        all_clause_types = ["Termination", "Indemnification", "Payment"]
        
        # 2. Act: Run the function under test
        summary = await worker.run_analysis(CLAUSES_TO_ANALYZE, all_clause_types)

        # 3. Assert: Verify service calls and their inputs

        # A. Check Retrieval Service calls
        expected_retrieval_calls = [
            call("CLAUSE_1_HIGH"),
            call("CLAUSE_2_LOW"),
            call("CLAUSE_3_FAIL"),
        ]
        mock_retrieval_service.retrieve_similar_templates.assert_has_calls(expected_retrieval_calls)
        self.assertEqual(mock_retrieval_service.retrieve_similar_templates.await_count, 3)

        # B. Check LLM Analysis Service calls
        # CLAUSE_1 & 2 should receive templates, CLAUSE_3 should receive an empty list
        expected_llm_calls = [
            call(CLAUSES_TO_ANALYZE[0], MOCK_TEMPLATES, all_clause_types), 
            call(CLAUSES_TO_ANALYZE[1], MOCK_TEMPLATES, all_clause_types), 
            call(CLAUSES_TO_ANALYZE[2], [], all_clause_types),                
        ]
        mock_llm_service.analyze_clause.assert_has_calls(expected_llm_calls)
        self.assertEqual(mock_llm_service.analyze_clause.await_count, 3)

        # C. Assert final summary statistics logic
        self.assertEqual(summary["high_risk_count"], 1, 
                         "Should count one high-risk clause (Score > 0.7).")
        self.assertEqual(summary["critical_suggestions"], 1, 
                         "Should count one CRITICAL suggestion (from the high-risk clause).")
        self.assertEqual(summary["total_compliance_issues"], 1, 
                         "Should count one total compliance issue (from the high-risk clause).")


if __name__ == '__main__':
    # To run this test from the command line: 
    # python -m unittest test_llm_client.py
    unittest.main()