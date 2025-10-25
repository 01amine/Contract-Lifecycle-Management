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
    if user_prompt:
        prompt = f"""
        **PRIORITY TASK: ADDRESS THE USER'S REQUEST**
        The user has provided a specific instruction for reviewing the contract.

        **User Instruction:** {user_prompt}

        You must review the Contract Clauses below **in light of the User Instruction** and check for compliance with company policies, assuming the change requested by the user is implemented or considered. 

        **Your task is now:**
        1. **Assess Compliance:** Determine if the contract, considering the user's requested change, introduces any new policy violations, or if the change itself is non-compliant with company policies found in your knowledge base.
        2. **Focus on Risks:** Identify any risks created by or related to the user's instruction and the existing clauses.
        3. **Generate Output:** Fill the ComplianceCheckResult output with the identified risks and an overall compliance score reflecting the safety of the user's requested change, based on company policies.

        Contract ID: {contract_id}
        Total Clauses: {len(clauses)}

        Contract Clauses:
        {clauses_text}
        """
    else:
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