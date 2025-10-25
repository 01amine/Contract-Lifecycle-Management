
from typing import List, Optional
from pydantic import BaseModel, Field
from agno.agent import Agent
from agno.models.google import Gemini
from app.config import settings


class ExtractedClause(BaseModel):
    """Single extracted clause"""
    clause_id: str = Field(description="Unique ID like '1', '1.1', '2.3.4'")
    text: str = Field(description="Full clause text")
    heading: Optional[str] = Field(default=None, description="Clause heading/title")
    level: int = Field(description="Hierarchy level: 0=root, 1=section, 2=subsection")
    start_pos: int = Field(description="Character position in original text")


class ClauseExtractionResult(BaseModel):
    """Complete extraction result"""
    clauses: List[ExtractedClause]
    total_clauses: int


def extract_clauses(contract_text: str) -> ClauseExtractionResult:
    print("---------------------------------")
    print(contract_text)
    agent = Agent(
        name="ClauseExtractor",
        model=Gemini(
            id="gemini-2.5-flash",
            api_key=settings.GOOGLE_API_KEY,
        ),
        instructions=[
            "Extract ALL clauses from contracts with hierarchical structure.",
            "Identify clause IDs based on numbering (1, 1.1, 2.3.4, etc.).",
            "Detect headings and titles for each clause.",
            "Determine hierarchical level (0=root, 1=main, 2=sub, etc.).",
            "Track starting character position of each clause.",
            "Maintain original text exactly as written.",
            "If no numbering exists, create logical structure.",
            "Don't skip any clauses.",
        ],
        stream=False,
        output_schema=ClauseExtractionResult,
    )
    
    prompt = f"""
    
    {contract_text}
    """
    
    response = agent.run(prompt)
    return response.content