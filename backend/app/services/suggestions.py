from typing import List, Optional
from pydantic import BaseModel, Field
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from app.config import settings


class SuggestionTag(BaseModel):
    """Tag for categorizing suggestions"""
    name: str = Field(description="Tag name (e.g., 'payment-terms', 'data-privacy', 'termination')")


class ClauseSuggestion(BaseModel):
    """AI-generated clause suggestion"""
    title: str = Field(description="Short, descriptive title for the suggestion")
    action: str = Field(description="Action type: 'add', 'modify', 'clarify', 'strengthen', or 'remove'")
    tags: List[SuggestionTag] = Field(default_factory=list, description="Categorization tags")
    body: str = Field(description="Full text of the suggested clause or modification. keep within 400 characters")
    relevance_score: float = Field(ge=0.0, le=1.0, description="How relevant this suggestion is (0-1)")


class SuggestionsResponse(BaseModel):
    """Response containing multiple suggestions"""
    suggestions: List[ClauseSuggestion]


def create_suggestions_agent() -> Agent:
    """Create an AI agent for generating contract clause suggestions"""
    return Agent(
        name="ClauseSuggestionsAgent",
        model=OpenAIChat(
            id=settings.GROQ_MODEL,
            api_key=settings.GROQ_API_KEY,
            base_url=settings.GROQ_BASE_URL,
        ),
        instructions=[
            "You are an expert legal contract advisor and clause writer.",
            "Your role is to analyze contract text and provide intelligent, actionable suggestions.",
            "",
            "CRITICAL: Provide a VARIETY of suggestion types:",
            "1. ADD missing clauses (e.g., 'Add Data Privacy Clause', 'Add Indemnification Clause')",
            "2. MODIFY existing clauses (e.g., 'Strengthen Liability Limits', 'Clarify Payment Terms', 'Enhance Termination Rights')",
            "3. IMPROVE clause language (e.g., 'Specify Force Majeure Exclusions', 'Add Arbitration Details', 'Define Confidentiality Scope')",
            "4. CONSOLIDATE redundant clauses",
            "5. SPLIT overly complex clauses into clear sections",
            "",
            "When analyzing contract text:",
            "- First, identify what clauses EXIST and what's MISSING",
            "- For existing clauses: suggest improvements, clarifications, or strengthen weak language",
            "- For missing clauses: suggest critical additions needed for legal protection",
            "- Consider both parties' interests and standard legal protections",
            "- Focus on commercially reasonable and commonly accepted terms",
            "",
            "Title Guidelines:",
            "- For NEW clauses: 'Add [Clause Name]' or 'Include [Clause Name]'",
            "- For MODIFICATIONS: 'Strengthen [Existing Clause]', 'Clarify [Issue]', 'Enhance [Aspect]', 'Specify [Detail]', 'Define [Term]'",
            "- For IMPROVEMENTS: 'Improve [Clause]', 'Refine [Language]', 'Expand [Section]'",
            "- Make titles specific and actionable (e.g., 'Strengthen Termination Rights', 'Clarify Payment Penalties', 'Add GDPR Compliance Clause')",
            "",
            "When a user query is provided:",
            "- Use it to guide your suggestions and answer specific questions",
            "- If the query asks for a specific type of clause, prioritize that",
            "- Provide context and reasoning for why the suggestion is valuable",
            "",
            "For each suggestion:",
            "- title: A concise, action-oriented title showing the SUGGESTION TYPE (Add/Modify/Clarify/Strengthen/Improve/etc.)",
            "- tags: 1-3 relevant tags from: 'payment-terms', 'data-privacy', 'liability', 'termination', 'dispute-resolution', 'compliance', 'intellectual-property', 'confidentiality', 'indemnification', 'force-majeure', 'insurance', 'default', 'amendment'",
            "- body: The complete suggested clause text, improvement, or modification. keep within 400 characters",
            "- relevance_score: A score 0.0-1.0 indicating how relevant the suggestion is to the contract content",
            "",
            "Guidelines:",
            "- Return 3-5 high-quality suggestions with VARIETY in suggestion types",
            "- Mix additions, modifications, and improvements - don't just suggest additions",
            "- Prioritize suggestions with higher relevance scores",
            "- Be specific and actionable, not generic",
            "- Ensure suggested clauses are legally sound and practically implementable",
            "- Consider the industry context when applicable",
            "",
            "Your output MUST be a JSON object with this exact structure:",
            "{",
            '  "suggestions": [',
            "    {",
            '      "title": "Suggestion title",',
            '      "action": "add",',
            '      "tags": [{"name": "tag-name"}],',
            '      "body": "Full suggested clause text",',
            '      "relevance_score": 0.85',
            "    }",
            "  ]",
            "}"
        ],
        stream=False,
    )


def generate_suggestions(content: str, query: Optional[str] = None) -> SuggestionsResponse:
    """
    Generate AI-powered contract clause suggestions.
    
    Args:
        content: The contract text to analyze
        query: Optional user query to guide suggestions
        
    Returns:
        SuggestionsResponse containing a list of suggestions
    """
    agent = create_suggestions_agent()
    
    # Build the prompt
    prompt = f"""Analyze the following contract text and provide intelligent clause suggestions.

Contracts in this application must be compliant with company policies and include basic required clauses such as liability, indemnification, confidentiality, and termination.

Your Task:
1. Read through the contract carefully
2. Identify existing clauses and their strengths/weaknesses
3. Identify missing critical clauses
4. Provide a MIXTURE of suggestions:
   - Adding missing clauses
   - Improving existing clauses
   - Clarifying vague language
   - Strengthening weak provisions

Contract Content:
{content}
"""
    
    if query:
        prompt += f"\n\nUser Query: {query}\n"
    
    prompt += """
IMPORTANT: Provide variety in your suggestions. Don't just suggest additions. Consider:
- Modifying existing clauses for clarity
- Adding missing protections
- Strengthening weak language
- Specifying vague terms
- Enhancing incomplete provisions

Provide your suggestions as a JSON object matching the specified format with variety in suggestion types."""
    
    try:
        response = agent.run(prompt)
        raw_output = (response.content or "").strip()
        
        # Clean up markdown code blocks if present
        if raw_output.startswith("```"):
            raw_output = raw_output.split("\n", 1)[1]
            raw_output = raw_output.rsplit("```", 1)[0]
            raw_output = raw_output.strip()
        
        # Parse JSON response
        import json
        data = json.loads(raw_output)
        return SuggestionsResponse(**data)
        
    except Exception as e:
        # Return empty suggestions on error
        print(f"Error generating suggestions: {e}")
        return SuggestionsResponse(suggestions=[])

