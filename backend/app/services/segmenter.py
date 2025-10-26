
from typing import List, Optional
from pydantic import BaseModel, Field
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from app.config import settings


class ExtractedClause(BaseModel):
    """Single extracted clause"""
    clause_id: str = Field(description="Unique ID like '1', '1.1', '2.3.4'")
    text: str = Field(description="Full clause text")
    heading: Optional[str] = Field(default=None, description="Clause heading/title")
    level: int = Field(description="Hierarchy level: 0=root, 1=section, 2=subsection")


class ClauseExtractionResult(BaseModel):
    """Complete extraction result"""
    clauses: List[ExtractedClause]
    total_clauses: int


def extract_clauses(contract_text: str) -> ClauseExtractionResult:
    print("---------------------------------")
    print(contract_text)
    agent = Agent(
        name="ClauseExtractor",
        model=OpenAIChat(
            id=settings.GROQ_MODEL,
            api_key=settings.GROQ_API_KEY,
            base_url=settings.GROQ_BASE_URL,
        ),
        instructions=[
            "Given a legal contract Extract ALL its clauses with hierarchical structure, regardless of language (English or Arabic).",
            "Things such as titles, headers, footers, signatures, and other non-content elements should be ignored.",
            "Handle both Left-to-Right (LTR) and Right-to-Left (RTL) document structures.",
            "Identify clause IDs based on the following numbering formats:",
            "  - **Standard English/Western:** 1, 1.1, 2.3.4, (a), (i), A.",
            "  - **Arabic/Legal:** **Arabic Numerals (١, ٢, ٣)**, **Hindi-Arabic Numerals (1, 2, 3)**, and standard Roman numerals.",
            "Detect headings and titles for each clause.",
            "Determine hierarchical level (0=root, 1=main section, 2=subsection, etc.) based on the numbering depth.",
            "Maintain the original text exactly as written in the `text` field.",
            "If no explicit numbering exists, deduce and create a logical structural hierarchy and use sequential IDs.",
            "Don't skip any clauses or sections.",
            "Each clause in a contract is a standalone statement or a group of statements that are related to a single topic or a single action.",
            "Trim whitespaces or extra punctuation, focus on the main content of the clause.",
        ],
        stream=False,
        output_schema=ClauseExtractionResult,
    )
    
    prompt = f"""
    
    {contract_text}
    """
    
    response = agent.run(prompt)
    return response.content