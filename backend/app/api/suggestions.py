from fastapi import APIRouter, HTTPException
from app.services.suggestions import generate_suggestions
from pydantic import BaseModel, Field
from typing import Optional

router = APIRouter(prefix="/suggestions", tags=["Suggestions"])


class SuggestionsRequest(BaseModel):
    content: str = Field(..., description="The contract text to analyze")
    query: Optional[str] = Field(None, description="Optional user query to guide suggestions")


@router.post("/generate")
async def generate_clause_suggestions(request: SuggestionsRequest):
    """
    Generate AI-powered contract clause suggestions.
    
    This endpoint analyzes contract text and optionally a user query to provide
    intelligent suggestions for clauses, improvements, or missing provisions.
    
    Args:
        request: Contains the contract content and optional query
        
    Returns:
        JSON response with suggestions including title, tags, body, and relevance_score
    """
    try:
        if not request.content or not request.content.strip():
            raise HTTPException(
                status_code=400,
                detail="Contract content is required"
            )
        
        result = generate_suggestions(
            content=request.content,
            query=request.query
        )
        
        return result.model_dump()
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate suggestions: {str(e)}"
        )

