import json
from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.knowledge.knowledge import Knowledge 
from agno.vectordb.qdrant import Qdrant
from app.config import settings
from duckduckgo_search import DDGS
from datetime import datetime
from enum import Enum
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FutureTimeoutError


# ============= ENUMS =============

class FindingType(str, Enum):
    """Type of compliance finding"""
    POLICY_VIOLATION = "policy_violation"
    MISSING_CLAUSE = "missing_clause"
    WEAK_PROVISION = "weak_provision"
    LEGAL_RISK = "legal_risk"
    FINANCIAL_RISK = "financial_risk"
    RED_FLAG = "red_flag"

class ComplianceDomain(str, Enum):
    """Domain/category of compliance"""
    POLICY_COMPLIANCE = "policy_compliance"
    FINANCIAL = "financial"
    LEGAL = "legal"
    DATA_PRIVACY = "data_privacy"
    PAYMENT_TERMS = "payment_terms"
    DISPUTE_RESOLUTION = "dispute_resolution"
    INDEMNIFICATION = "indemnification"
    CONFIDENTIALITY = "confidentiality"

class Severity(str, Enum):
    """Severity of the finding"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"

class ImpactLevel(str, Enum):
    """Business impact if not addressed"""
    SEVERE = "severe"
    SIGNIFICANT = "significant"
    MODERATE = "moderate"
    MINIMAL = "minimal"

class AnalysisSource(str, Enum):
    """Which agent/system identified this finding"""
    COMPLIANCE_AGENT = "compliance_agent"
    TARIFF_AGENT = "tariff_agent"
    EXTERNAL_REVIEW_AGENT = "external_review_agent"
    ORCHESTRATOR = "orchestrator"

# ============= MODELS =============

class PolicyReference(BaseModel):
    """Reference to specific company policy"""
    policy_name: str
    requirement: str
    section: Optional[str] = None

class AffectedClause(BaseModel):
    """Clause(s) affected by this finding"""
    clause_id: str
    heading: Optional[str] = None
    excerpt: Optional[str] = Field(None, max_length=200)

class RemediationAction(BaseModel):
    """Recommended action to address the finding"""
    action_type: str
    description: str
    priority: int = Field(1, ge=1, le=5)

class ComplianceFinding(BaseModel):
    """A single compliance finding"""
    finding_id: str
    finding_type: FindingType
    domain: ComplianceDomain
    severity: Severity
    impact: ImpactLevel
    confidence_score: float = Field(ge=0.0, le=1.0)
    title: str
    description: str
    affected_clauses: List[AffectedClause]
    policy_violations: List[PolicyReference] = Field(default_factory=list)
    remediation_actions: List[RemediationAction] = Field(default_factory=list)
    business_consequence: Optional[str] = None
    source: AnalysisSource

class ComplianceMetrics(BaseModel):
    """Detailed metrics about the compliance check"""
    overall_score: float = Field(ge=0.0, le=1.0)
    completeness_score: float = Field(ge=0.0, le=1.0)
    total_findings: int
    critical_count: int
    high_count: int
    medium_count: int
    low_count: int
    domains_analyzed: List[ComplianceDomain]
    missing_critical_clauses: List[str] = Field(default_factory=list)

class ComplianceCheckResult(BaseModel):
    """Complete compliance check result"""
    findings: List[ComplianceFinding] = Field(default_factory=list)
    metrics: ComplianceMetrics
    contract_id: str
    analysis_timestamp: datetime = Field(default_factory=datetime.now)
    agents_used: List[AnalysisSource]
    executive_summary: str
    recommendation: str
    required_actions: List[str] = Field(default_factory=list)

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
            "You are a contract compliance expert checking against company policies.",
            "Review each clause against retrieved company policies from the knowledge base.",
            "For each issue found, create a detailed finding with:",
            "- finding_id: unique ID like 'COMP-001'",
            "- finding_type: policy_violation, missing_clause, weak_provision, etc.",
            "- domain: policy_compliance, legal, financial, etc.",
            "- severity: critical, high, medium, low, info",
            "- impact: severe, significant, moderate, minimal",
            "- confidence_score: 0.0-1.0",
            "- title: short descriptive title",
            "- description: detailed explanation",
            "- affected_clauses: list with clause_id, heading, excerpt",
            "- policy_violations: list of violated policies with policy_name, requirement",
            "- remediation_actions: list of actions with action_type, description, priority",
            "- business_consequence: what could happen if not fixed",
            "- source: 'compliance_agent'",
            "",
            "Calculate compliance score: 1.0 = fully compliant, 0.0 = completely non-compliant.",
            "Search the knowledge base for relevant company policies before assessing each clause.",
            "Your output MUST be a JSON object: {'findings': [...], 'compliance_score': 0.85}"
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
            "For each issue found, create a detailed finding with:",
            "- finding_id: unique ID like 'TAR-001'",
            "- finding_type: financial_risk, missing_clause, weak_provision, etc.",
            "- domain: financial, payment_terms, regulatory",
            "- severity: critical, high, medium, low, info",
            "- impact: severe, significant, moderate, minimal",
            "- confidence_score: 0.0-1.0",
            "- title: short descriptive title",
            "- description: detailed explanation",
            "- affected_clauses: list with clause_id, heading, excerpt",
            "- policy_violations: list of violated policies with policy_name, requirement",
            "- remediation_actions: list of actions with action_type, description, priority",
            "- business_consequence: financial impact if not fixed",
            "- source: 'tariff_agent'",
            "",
            "Calculate compliance score: 1.0 = fully compliant, 0.0 = completely non-compliant.",
            "Search the knowledge base for relevant financial policies before assessing.",
            "Your output MUST be a JSON object: {'findings': [...], 'compliance_score': 0.85}"
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
            "You are an independent risk auditor identifying risks and missing provisions BEYOND company policies.",
            "Focus on market standards, legal gaps, missing clauses, and commercially unfavorable terms.",
            "Use the 'check_external_web_data' tool to verify external data and industry standards.",
            "For each issue found, create a detailed finding with:",
            "- finding_id: unique ID like 'EXT-001'",
            "- finding_type: legal_risk, missing_clause, red_flag, recommendation",
            "- domain: legal, data_privacy, intellectual_property, etc.",
            "- severity: critical, high, medium, low, info",
            "- impact: severe, significant, moderate, minimal",
            "- confidence_score: 0.0-1.0",
            "- title: short descriptive title",
            "- description: detailed explanation",
            "- affected_clauses: list with clause_id, heading, excerpt (or 'Missing Provision')",
            "- industry_standard: reference to market standard if applicable",
            "- remediation_actions: list of actions with action_type, description, priority",
            "- business_consequence: what could happen if not fixed",
            "- source: 'external_review_agent'",
            "- external_references: list of web sources used",
            "",
            "Calculate compliance score: 1.0 = fully compliant, 0.0 = completely non-compliant.",
            "Your output MUST be a JSON object: {'findings': [...], 'compliance_score': 0.85}"
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


def _run_specialist_agent(agent: Agent, clauses: List[ClauseWithCompliance], contract_id: str, source: AnalysisSource) -> Dict:
    """Run a specialist agent and return partial findings"""
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
            return {"findings": [], "compliance_score": 1.0}

        if raw_output.startswith("```"):
            raw_output = raw_output.split("\n", 1)[1]
            raw_output = raw_output.rsplit("```", 1)[0]
            raw_output = raw_output.strip()

        data = json.loads(raw_output)
        return data

    except Exception as e:
        print(f"Error in specialist agent: {e}")
        return {"findings": [], "compliance_score": 1.0}


def check_compliance_risks(clauses: List[ClauseWithCompliance], contract_id: str) -> Dict:
    risk_agent = create_compliance_agent()
    return _run_specialist_agent(risk_agent, clauses, contract_id, AnalysisSource.COMPLIANCE_AGENT)


def check_tariff_risks(clauses: List[ClauseWithCompliance], contract_id: str) -> Dict:
    tariff_agent = create_tariff_agent()
    return _run_specialist_agent(tariff_agent, clauses, contract_id, AnalysisSource.TARIFF_AGENT)


def check_external_context_risks(clauses: List[ClauseWithCompliance], contract_id: str) -> Dict:
    risk_review_agent = create_risk_review_agent()
    return _run_specialist_agent(risk_review_agent, clauses, contract_id, AnalysisSource.EXTERNAL_REVIEW_AGENT)


def check_compliance(clauses: List[ClauseWithCompliance], contract_id: str, collection_name: str = "company_policies") -> ComplianceCheckResult:
    """
    Main compliance checking function that orchestrates multiple specialist agents in parallel
    """
    agents_used = []
    all_findings = []
    scores = []
    
    # Run all three agents in parallel using ThreadPoolExecutor
    with ThreadPoolExecutor(max_workers=3) as executor:
        # Submit all agents at once
        compliance_future = executor.submit(check_compliance_risks, clauses, contract_id)
        tariff_future = executor.submit(check_tariff_risks, clauses, contract_id)
        external_future = executor.submit(check_external_context_risks, clauses, contract_id)
        
        # Collect results with timeout (30 seconds per agent)
        for future, source, name in [
            (compliance_future, AnalysisSource.COMPLIANCE_AGENT, "Compliance"),
            (tariff_future, AnalysisSource.TARIFF_AGENT, "Tariff"),
            (external_future, AnalysisSource.EXTERNAL_REVIEW_AGENT, "External Review")
        ]:
            try:
                result = future.result(timeout=30)
                if result.get("findings"):
                    all_findings.extend(result["findings"])
                scores.append(result.get("compliance_score", 1.0))
                agents_used.append(source)
            except FutureTimeoutError:
                print(f"{name} agent timed out after 30 seconds")
            except Exception as e:
                print(f"{name} agent error: {e}")
    
    # Convert raw findings to ComplianceFinding objects
    findings_objects = []
    for finding_data in all_findings:
        try:
            # Ensure all required fields have defaults
            finding = ComplianceFinding(**finding_data)
            findings_objects.append(finding)
        except Exception as e:
            print(f"Error parsing finding: {e}")
    
    # Calculate metrics
    critical_count = sum(1 for f in findings_objects if f.severity == Severity.CRITICAL)
    high_count = sum(1 for f in findings_objects if f.severity == Severity.HIGH)
    medium_count = sum(1 for f in findings_objects if f.severity == Severity.MEDIUM)
    low_count = sum(1 for f in findings_objects if f.severity == Severity.LOW)
    
    # Calculate overall score (weighted average)
    overall_score = sum(scores) / len(scores) if scores else 1.0
    
    # Calculate completeness score
    completeness_score = 1.0 - (sum(1 for f in findings_objects if f.finding_type == FindingType.MISSING_CLAUSE) * 0.15)
    
    # Ensure scores are between 0 and 1
    completeness_score = max(0.0, min(1.0, completeness_score))
    overall_score = max(0.0, min(1.0, overall_score))
    
    # Get domains analyzed
    domains_analyzed = list(set(f.domain for f in findings_objects))
    
    # Get missing critical clauses
    missing_critical = [f.title for f in findings_objects if f.finding_type == FindingType.MISSING_CLAUSE and f.severity == Severity.CRITICAL]
    
    metrics = ComplianceMetrics(
        overall_score=overall_score,
        completeness_score=completeness_score,
        total_findings=len(findings_objects),
        critical_count=critical_count,
        high_count=high_count,
        medium_count=medium_count,
        low_count=low_count,
        domains_analyzed=domains_analyzed,
        missing_critical_clauses=missing_critical
    )
    
    # Generate executive summary
    if overall_score >= 0.9:
        summary = f"Contract is highly compliant with {len(findings_objects)} findings identified. Minimal risk detected."
        recommendation = "APPROVE"
    elif overall_score >= 0.7:
        summary = f"Contract has moderate compliance with {len(findings_objects)} findings, including {critical_count} critical issues."
        recommendation = "REVIEW_REQUIRED"
    else:
        summary = f"Contract has significant compliance issues with {len(findings_objects)} findings, including {critical_count} critical and {high_count} high severity issues."
        recommendation = "REVIEW_REQUIRED"
    
    # Required actions only
    required_actions = [f.title for f in findings_objects if f.severity in [Severity.CRITICAL, Severity.HIGH]]
    
    return ComplianceCheckResult(
        findings=findings_objects,
        metrics=metrics,
        contract_id=contract_id,
        analysis_timestamp=datetime.now(),
        agents_used=agents_used,
        executive_summary=summary,
        recommendation=recommendation,
        required_actions=required_actions[:10]  # Top 10 required actions
    )

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

