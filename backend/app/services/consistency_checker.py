
from typing import List, Optional
from pydantic import BaseModel, Field
from agno.agent import Agent
from agno.models.google import Gemini
from agno.knowledge.knowledge import Knowledge 
from agno.vectordb.qdrant import Qdrant
from app.config import settings




class ComplianceRisk(BaseModel):
    """Single compliance risk - matches your expected format"""
    clause: str = Field(description="Clause heading or identifier")
    risk: str = Field(description="Risk level: 'Low', 'Medium', 'High', 'Critical'")
    reason: str = Field(description="Explanation of the risk")


class ComplianceCheckResult(BaseModel):
    """Complete compliance check result"""
    risks: List[ComplianceRisk]
    compliance_score: float = Field(ge=0.0, le=1.0, description="Overall compliance score 0-1")


class ClauseWithCompliance(BaseModel):
    """Clause data for compliance checking"""
    clause_id: str
    text: str
    heading: Optional[str] = None
    level: int




def create_compliance_agent(collection_name: str = "company_policies") -> Agent:
    """
    Create compliance checking agent with access to company policies from Qdrant.
    
    Args:
        collection_name: Qdrant collection name with policies
        
    Returns:
        Configured Agent for compliance checking
    """
    
    vector_db = Qdrant(
        collection=collection_name,
        url=settings.QDRANT_URL,
    )
    
    knowledge_base = Knowledge(
        vector_db=vector_db,
        max_results=5, 
    )
    
    return Agent(
        name="ComplianceChecker",
        model=Gemini(
            id="gemini-2.5-flash",
            api_key=settings.GOOGLE_API_KEY,
        ),
        instructions=[
            "You are a contract compliance expert checking against company policies.",
            "Review each clause against retrieved company policies from the knowledge base.",
            "For the 'clause' field, use the clause heading or a brief identifier (e.g., 'Termination', 'Payment Terms', 'Liability').",
            "For the 'risk' field, use exactly one of: 'Low', 'Medium', 'High', 'Critical'.",
            "For the 'reason' field, provide a clear, concise explanation of why this is a risk.",
            "Only include clauses that have compliance issues - compliant clauses should not be in the risks list.",
            "Calculate compliance score: 1.0 = fully compliant (no risks), 0.0 = completely non-compliant.",
            "Search the knowledge base for relevant company policies before assessing each clause.",
        ],
        knowledge=knowledge_base,
        search_knowledge=True,  
        output_schema=ComplianceCheckResult,
        stream=False,
    )


def check_compliance(
    clauses: List[ClauseWithCompliance],
    contract_id: str,
    collection_name: str = "company_policies"
) -> ComplianceCheckResult:
    """
    Check contract clauses for compliance against company policies.
    
    Args:
        clauses: List of extracted clauses to check
        contract_id: Contract identifier for logging
        collection_name: Qdrant collection with policies
        
    Returns:
        ComplianceCheckResult with risks list and compliance score
    """
    
    # Create agent with policy knowledge from Qdrant
    agent = create_compliance_agent(collection_name)
    
    # Prepare clauses text for analysis
    clauses_text = "\n\n".join([
        f"Clause {c.clause_id} - {c.heading or 'Untitled'}:\n{c.text}"
        for c in clauses
    ])
    
    prompt = f"""
    Check these contract clauses for compliance with company policies.
    
    Contract ID: {contract_id}
    Total Clauses: {len(clauses)}
    
    Contract Clauses:
    {clauses_text}
    
    For each clause, search the company policy knowledge base and identify:
    - Policy violations or compliance risks
    - Risk level: Low, Medium, High, or Critical
    - Clear reason explaining the risk
    
    Return only clauses with compliance issues in the risks list.
    Calculate an overall compliance score based on the number and severity of risks found.
    """
    
    response = agent.run(prompt)
    return response.content




def convert_clauses_for_compliance(clauses_data: List[dict]) -> List[ClauseWithCompliance]:
    """
    Convert stored clause dicts to ClauseWithCompliance objects.
    
    Args:
        clauses_data: List of clause dictionaries from MongoDB
        
    Returns:
        List of ClauseWithCompliance objects
    """
    return [
        ClauseWithCompliance(
            clause_id=c["clause_id"],
            text=c["text"],
            heading=c.get("heading"),
            level=c["level"]
        )
        for c in clauses_data
    ]