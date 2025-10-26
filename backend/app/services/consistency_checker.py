import json
from typing import List, Optional
from pydantic import BaseModel, Field
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.knowledge.knowledge import Knowledge 
from agno.vectordb.qdrant import Qdrant
from app.config import settings
from duckduckgo_search import DDGS 


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
        model=OpenAIChat(
            id=settings.GROQ_MODEL,
            api_key=settings.GROQ_API_KEY,
            base_url=settings.GROQ_BASE_URL,
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
        model=OpenAIChat(
            id=settings.GROQ_MODEL,
            api_key=settings.GROQ_API_KEY,
            base_url=settings.GROQ_BASE_URL,
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


def create_risk_review_agent() -> Agent:
    return Agent(
        name="ExternalRiskReviewAgent",
        model=OpenAIChat(
            id=settings.GROQ_MODEL,
            api_key=settings.GROQ_API_KEY,
            base_url=settings.GROQ_BASE_URL,
        ),
        instructions=[
            "You are an independent risk auditor. Your job is to identify risks and missing provisions BEYOND company policies.",
            "Focus on market standards, legal gaps, missing clauses (e.g., indemnification, data privacy), and commercially unfavorable terms.",
            "Use the 'check_external_web_data' tool to verify external data, standard industry terms, or public compliance information if needed.",
            "For the 'clause' field, use the clause heading or 'Missing Provision'.",
            "For the 'risk' field, use exactly one of: 'Low', 'Medium', 'High', 'Critical'.",
            "Only include clauses that have commercial, legal, or missing provision risks.",
            "Calculate compliance score: 1.0 = fully compliant (no risks), 0.0 = completely non-compliant.",
            "Your output MUST be a JSON object STRICTLY matching the format: {'risks': [{'clause': '...', 'risk': '...', 'reason': '...'}], 'compliance_score': 0.85}"
        ],
        
        tools=[check_external_web_data], 
        stream=False,
    )

def check_external_web_data(query: str) -> str:
    """Uses DuckDuckGo search to provide external context to the agent."""
    try:
        results = DDGS().text(keywords=query, max_results=5)
        
        formatted_results = "\n---\n".join([
            f"Title: {r['title']}\nSnippet: {r['snippet']}\nURL: {r['href']}"
            for r in results
        ])
        
        return f"External search results for '{query}':\n{formatted_results}"
    except Exception as e:
        return f"External search failed: {str(e)}. No external data found for '{query}'."


def _run_specialist_agent(agent: Agent, clauses: List[ClauseWithCompliance], contract_id: str) -> ComplianceCheckResult:
    clauses_text = "\n\n".join([
        f"Clause {c.clause_id} - {c.heading or 'Untitled'}:\n{c.text}"
        for c in clauses
    ])
    prompt = f"""
Check these contract clauses for compliance/risks.

Contract ID: {contract_id}
Total Clauses: {len(clauses)}

Contract Clauses:
{clauses_text}

Return JSON strictly in the format defined by your instructions.
"""
    try:
        response = agent.run(prompt, contract_id=contract_id) 
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


def check_compliance_risks(clauses: List[ClauseWithCompliance], contract_id: str) -> ComplianceCheckResult:
    risk_agent = create_compliance_agent()
    return _run_specialist_agent(risk_agent, clauses, contract_id)


def check_tariff_risks(clauses: List[ClauseWithCompliance], contract_id: str) -> ComplianceCheckResult:
    tariff_agent = create_tariff_agent()
    return _run_specialist_agent(tariff_agent, clauses, contract_id)


def check_external_context_risks(clauses: List[ClauseWithCompliance], contract_id: str) -> ComplianceCheckResult:
    risk_review_agent = create_risk_review_agent()
    return _run_specialist_agent(risk_review_agent, clauses, contract_id)


def check_compliance(clauses: List[ClauseWithCompliance], contract_id: str, collection_name: str = "company_policies") -> ComplianceCheckResult:
    orchestrator = Agent(
        name="ContractOrchestrator",
        model=OpenAIChat(
            id=settings.GROQ_MODEL,
            api_key=settings.GROQ_API_KEY,
            base_url=settings.GROQ_BASE_URL,
        ),
        instructions=[
            "You are a contract router and risk aggregator.",
            "Analyze the contract clauses to determine the primary context (e.g., Finance, General Risk, External Context).",
            "Use 'check_tariff_risks' for clauses clearly related to finance or tariffs.",
            "Use 'check_external_context_risks' for complex or missing clauses that require external validation, industry standard checks, or external searching (e.g., market rate validation, compliance with non-policy law, or identifying missing clauses like data privacy or indemnification).",
            "Use 'check_compliance_risks' for all other contexts, serving as the baseline check against internal policies (General Risk).",
            "You MUST call at least one tool. If multiple contexts apply, call all relevant tools once.",
            "The final output MUST be a single aggregated JSON object containing all risks from all called tools, and an overall compliance score.",
            "The JSON MUST STRICTLY match the format: {'risks': [{'clause': '...', 'risk': '...', 'reason': '...'}], 'compliance_score': 0.85}",
            "Ensure the compliance score accurately reflects the combined risks from all three specialized checks.",
        ],
        tools=[
            check_tariff_risks,
            check_compliance_risks,
            check_external_context_risks, 
        ],
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
        response = orchestrator.run(prompt, clauses=clauses, contract_id=contract_id)
        raw_output = (response.content or "").strip()

        if raw_output.startswith("```"):
            raw_output = raw_output.split("\n", 1)[1]
            raw_output = raw_output.rsplit("```", 1)[0]
            raw_output = raw_output.strip()

        data = json.loads(raw_output)
        return ComplianceCheckResult(**data)
    except Exception:
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