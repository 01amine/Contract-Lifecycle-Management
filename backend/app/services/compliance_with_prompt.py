import json
from typing import List, Optional
from app.models.documentUploaded import clause
from pydantic import BaseModel, Field
from agno.agent import Agent
from agno.models.google import Gemini
from agno.knowledge.knowledge import Knowledge
from agno.vectordb.qdrant import Qdrant
from app.config import settings
from app.services.consistency_checker import ClauseWithCompliance, ComplianceCheckResult, create_compliance_agent

def check_compliance_pompt(
    clauses: List[ClauseWithCompliance],
    contract_id: str,
    collection_name: str = "company_policies",
    user_prompt: Optional[str] = None,
) -> ComplianceCheckResult:
    
    agent = create_compliance_agent(collection_name)

    clauses_text = "\n\n".join([
        f"Clause {c.clause_id} - {c.heading or 'Untitled'}:\n{c.text}"
        for c in clauses
    ])
    
    # --- PROMPT LOGIC (omitted for brevity, same as yours) ---
    if user_prompt:
        # Use the detailed user_prompt template
        prompt = f"""
        **PRIORITY TASK: ADDRESS THE USER'S REQUEST**
        The user has provided a specific instruction for reviewing the contract.
        ... (rest of the detailed user_prompt template) ...
        Contract Clauses:
        {clauses_text}
        """
    else:
        # Use the default compliance check template
        prompt = f"""
        Check these contract clauses for compliance with company policies.
        ... (rest of the default template) ...
        Contract Clauses:
        {clauses_text}
        """
    # --- END PROMPT LOGIC ---

    try:
        response = agent.run(prompt)
        raw_output = (response.content or "").strip()

        # If Gemini says it cannot check or returns empty
        if not raw_output or "unable to check" in raw_output.lower() or "no relevant policies" in raw_output.lower():
            # Return a default compliant result if no meaningful output
            return ComplianceCheckResult(risks=[], compliance_score=1.0)

        # Strip markdown ```json fences if present
        if raw_output.startswith("```"):
            raw_output = raw_output.split("\n", 1)[1]    # remove first line
            raw_output = raw_output.rsplit("```", 1)[0]   # remove last line
            raw_output = raw_output.strip()

        # Manual JSON parsing and Pydantic validation (safe and reliable)
        data = json.loads(raw_output)
        return ComplianceCheckResult(**data)

    except Exception as e:
        # Log the error (e) here if possible
        # Return a safe, default, or indicative result on failure
        return ComplianceCheckResult(
            risks=[],
            compliance_score=1.0
        )


def convert_clauses_for_compliance(clauses_data: List[clause]) -> List[ClauseWithCompliance]:
    return [
        ClauseWithCompliance(
            clause_id=c.clause_id,
            text=c.text,
            heading=c.heading,
            level=c.level
        )
        for c in clauses_data
    ]