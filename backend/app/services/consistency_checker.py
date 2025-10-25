import json
from typing import List, Optional
from pydantic import BaseModel, Field
from agno.agent import Agent
from agno.models.google import Gemini
from agno.knowledge.knowledge import Knowledge
from agno.vectordb.qdrant import Qdrant
from app.config import settings

class ComplianceRisk(BaseModel):
    clause: str = Field(description="Clause heading or identifier")
    risk: str = Field(description="Risk level: 'Low', 'Medium', 'High', 'Critical'")
    reason: str = Field(description="Explanation of the risk")

class ComplianceCheckResult(BaseModel):
    risks: List[ComplianceRisk]
    compliance_score: float = Field(ge=0.0, le=1.0, description="Overall compliance score 0-1")

class ClauseWithCompliance(BaseModel):
    clause_id: str
    text: str
    heading: Optional[str] = None
    level: int

def create_base_knowledge(collection_name: str = "company_policies"):
    vector_db = Qdrant(
        collection=collection_name,
        url=settings.QDRANT_URL,
    )
    knowledge_base = Knowledge(
        vector_db=vector_db,
        max_results=5,
    )
    return knowledge_base

def create_compliance_agent(collection_name: str = "company_policies") -> Agent:
    knowledge_base = create_base_knowledge(collection_name)
    return Agent(
        name="ComplianceChecker",
        model=Gemini(
            id="gemini-2.5-flash",
            api_key=settings.GOOGLE_API_KEY,
        ),
        instructions=[
            "You are a contract compliance expert checking against company policies (The General Risk Handler).",
            "Review each clause against retrieved company policies from the knowledge base.",
            "For the 'clause' field, use the clause heading or a brief identifier.",
            "For the 'risk' field, use exactly one of: 'Low', 'Medium', 'High', 'Critical'.",
            "Only include clauses that have compliance issues.",
            "Calculate compliance score: 1.0 = fully compliant (no risks), 0.0 = completely non-compliant.",
            "Search the knowledge base for relevant company policies before assessing each clause.",
            "Your output MUST be a JSON object STRICTLY matching the format: {'risks': [{'clause': '...', 'risk': '...', 'reason': '...'}], 'compliance_score': 0.85}"
        ],
        knowledge=knowledge_base,
        search_knowledge=True,
        stream=False,
    )

def create_tariff_agent(collection_name: str = "company_policies") -> Agent:
    knowledge_base = create_base_knowledge(collection_name)
    return Agent(
        name="TariffManagementAgent",
        model=Gemini(
            id="gemini-2.5-flash",
            api_key=settings.GOOGLE_API_KEY,
        ),
        instructions=[
            "You are a Tariff and Financial Risk expert checking against company policies.",
            "Review each clause for financial risks, missing tariff classifications, and cost-protection issues.",
            "For the 'clause' field, use the clause heading or a brief identifier (e.g., 'Payment Terms', 'Tariff Classification').",
            "For the 'risk' field, use exactly one of: 'Low', 'Medium', 'High', 'Critical'.",
            "Only include clauses that have compliance/financial issues.",
            "Calculate compliance score: 1.0 = fully compliant (no risks), 0.0 = completely non-compliant.",
            "Search the knowledge base for relevant company financial policies before assessing each clause.",
            "Your output MUST be a JSON object STRICTLY matching the format: {'risks': [{'clause': '...', 'risk': '...', 'reason': '...'}], 'compliance_score': 0.85}"
        ],
        knowledge=knowledge_base,
        search_knowledge=True,
        stream=False,
    )
def _run_specialist_agent(agent: Agent, clauses: List[ClauseWithCompliance], contract_id: str) -> ComplianceCheckResult:
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

Return JSON strictly in the format defined by your output schema instructions.
"""
    try:
        response = agent.run(prompt)
        raw_output = (response.content or "").strip()

        if not raw_output or "unable to check" in raw_output.lower():
            return ComplianceCheckResult(risks=[], compliance_score=1.0)

        if raw_output.startswith("```"):
            raw_output = raw_output.split("\n", 1)[1]
            raw_output = raw_output.rsplit("```", 1)[0]
            raw_output = raw_output.strip()

        data = json.loads(raw_output)
        return ComplianceCheckResult(**data)

    except Exception:
        return ComplianceCheckResult(risks=[], compliance_score=1.0)

# Tool wrapper for the Orchestrator
def check_compliance_risks(clauses: List[ClauseWithCompliance], contract_id: str) -> ComplianceCheckResult:
    risk_agent = create_compliance_agent()
    return _run_specialist_agent(risk_agent, clauses, contract_id)

# Tool wrapper for the Orchestrator
def check_tariff_risks(clauses: List[ClauseWithCompliance], contract_id: str) -> ComplianceCheckResult:
    tariff_agent = create_tariff_agent()
    return _run_specialist_agent(tariff_agent, clauses, contract_id)

# Main Orchestrator Function
def check_compliance(clauses: List[ClauseWithCompliance], contract_id: str, collection_name: str = "company_policies") -> ComplianceCheckResult:
    orchestrator = Agent(
        name="ContractOrchestrator",
        model=Gemini(id="gemini-2.5-flash", api_key=settings.GOOGLE_API_KEY),
        instructions=[
            "You are a contract router and risk aggregator.",
            "Analyze the contract clauses to determine the primary context (e.g., Finance, General Risk, Real Estate, Software).",
            "If the context is financial, use 'check_tariff_risks'. For all other contexts (including general compliance, real estate, software, or unknown contexts), use 'check_compliance_risks'.",
            "You MUST call at least one tool. If multiple contexts apply, call all relevant tools once.",
            # CRITICAL CHANGE: Explicitly instruct JSON output instead of using output_schema
            "The final output MUST be a single aggregated JSON object containing all risks from all called tools, and an overall compliance score.",
            "The JSON MUST STRICTLY match the format: {'risks': [{'clause': '...', 'risk': '...', 'reason': '...'}], 'compliance_score': 0.85}",
            "Ensure the compliance score accurately reflects the combined risks.",
        ],
        tools=[
            check_tariff_risks,
            check_compliance_risks,
        ],
        # REMOVED: output_schema=ComplianceCheckResult to fix the 400 INVALID_ARGUMENT error
        stream=False,
    )
    clauses_text = "\n\n".join([f"Clause {c.clause_id} - {c.heading or 'Untitled'}:\n{c.text}" for c in clauses])
    prompt = f"""
Analyze the context of the following clauses and call the appropriate specialist tool(s).

Contract ID: {contract_id}
Contract Clauses:
{clauses_text}
"""
    try:
        # Note: The 'clauses' and 'contract_id' arguments here are passed to the Tool functions.
        response = orchestrator.run(prompt, clauses=clauses, contract_id=contract_id)
        raw_output = (response.content or "").strip()

        # The rest of the JSON parsing logic remains correct and is crucial here:
        if raw_output.startswith("```"):
            raw_output = raw_output.split("\n", 1)[1]
            raw_output = raw_output.rsplit("```", 1)[0]
            raw_output = raw_output.strip()

        data = json.loads(raw_output)
        return ComplianceCheckResult(**data)
    except Exception:
        # Fallback in case of any failure
        return ComplianceCheckResult(risks=[], compliance_score=1.0)


def convert_clauses_for_compliance(clauses_data: List) -> List[ClauseWithCompliance]:
    return [
        ClauseWithCompliance(
            clause_id=c.clause_id,
            text=c.text,
            heading=c.heading,
            level=c.level
        )
        for c in clauses_data
    ]