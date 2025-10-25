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
    clauses: str,
    collection_name: str = "company_policies",
    user_prompt: Optional[str] = None,
) -> ComplianceCheckResult:
    
    agent = create_compliance_agent(collection_name)
    
    
    if user_prompt:
        
        prompt = f"""
        **PRIORITY TASK: ADDRESS THE USER'S REQUEST**
        The user has provided a specific instruction for reviewing the contract.
        ... (rest of the detailed user_prompt template) ...
        Contract Clauses:
        {clauses}
        """
    else:
        
        prompt = f"""
        Check these contract clauses for compliance with company policies.
        ... (rest of the default template) ...
        Contract Clauses:
        {clauses}
        """
    

    try:
        response = agent.run(prompt)
        raw_output = (response.content or "").strip()

        
        if not raw_output or "unable to check" in raw_output.lower() or "no relevant policies" in raw_output.lower():
           
            return ComplianceCheckResult(risks=[], compliance_score=1.0)

        
        if raw_output.startswith("```"):
            raw_output = raw_output.split("\n", 1)[1]    # remove first line
            raw_output = raw_output.rsplit("```", 1)[0]   # remove last line
            raw_output = raw_output.strip()

        data = json.loads(raw_output)
        return ComplianceCheckResult(**data)

    except Exception as e:
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