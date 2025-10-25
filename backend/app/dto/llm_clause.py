from typing import List, Optional
from pydantic import BaseModel, Field

class LLMClauseDTO(BaseModel):
    """A single clause object returned by the LLM."""
    text: str = Field(..., description="The exact text content of the extracted clause, trimmed of whitespace.")
    clause_id: str = Field(..., description="The standardized ID (e.g., '1.1', '2.3.a').")
    level: int = Field(..., description="The hierarchical level of the clause (e.g., 1 for a main article, 2 for a section).")
    heading: Optional[str] = Field(None, description="The heading or title of the section this clause belongs to, if applicable.")

class LLMClauseListDTO(BaseModel):
    """The root model for the structured LLM response."""
    clauses: List[LLMClauseDTO] = Field(..., description="A list of all extracted contractual clauses.")


ClauseListPydantic = LLMClauseListDTO