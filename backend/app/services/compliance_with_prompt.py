import json
from typing import List, Optional
from app.models.documentUploaded import clause
from pydantic import BaseModel
from agno.agent import Agent
from agno.models.google import Gemini
from agno.knowledge.knowledge import Knowledge
from agno.vectordb.qdrant import Qdrant
from app.config import settings


class ClauseWithCompliance(BaseModel):
    clause_id: str
    text: str
    heading: Optional[str] = None
    level: int


def create_compliance_agent(collection_name: str = "company_policies") -> Agent:
    vector_db = Qdrant(
        collection=collection_name,
        url=settings.QDRANT_URL,
    )
    
    knowledge_base = Knowledge(
        vector_db=vector_db,
        max_results=5,
    )
    
    return Agent(
        name="ContractDraftingExpert",
        model=Gemini(
            id="gemini-2.5-flash",
            api_key=settings.GOOGLE_API_KEY,
        ),
        instructions=[
            "You are a contract drafting expert who revises contracts based on user instructions while ensuring compliance with company policies.",
            "Search the knowledge base for relevant company policies before drafting the revision.",
            "Your output must be the final, revised contract text only.",
        ],
        knowledge=knowledge_base,
        search_knowledge=True,
        stream=False,
    )


def modify_contract_text(
    clauses: str,
    collection_name: str = "company_policies",
    user_prompt: str = None,
) -> str:
    agent = create_compliance_agent(collection_name)

    # --- STRICTLY REVISED PROMPT TEMPLATE ---
    prompt = f"""
    You are a contract drafting expert. Your single task is to **REVISE** the text provided in the 
    <CONTRACT_TEXT> section below according to the instruction in the <USER_INSTRUCTION> section.
    
    You **MUST** ensure the entire resulting text maintains strict compliance with all company policies 
    found in your knowledge base.
    
    ---
    
    <USER_INSTRUCTION>
    {user_prompt}
    </USER_INSTRUCTION>
    
    <CONTRACT_TEXT>
    {clauses}
    </CONTRACT_TEXT>
    
    ---
    
    **CRITICAL INSTRUCTION:**
    1.  Apply the user's requested change to the contract text.
    2.  Check for and correct any policy violations introduced by the change or existing in the text.
    3.  **REPLACE AND RETURN ONLY THE ENTIRE FINAL MODIFIED CONTRACT TEXT.** Do not include any XML tags, explanations, preambles, or extra text.
    """
    
    try:
        response = agent.run(prompt)
        # We strip any surrounding quotes or backticks that the LLM might add due to the strict instruction
        raw_output = (response.content or "").strip()
        
        # Clean up common artifacts (like leading/trailing quotes often added by LLMs when strictly constrained)
        if raw_output.startswith('"') and raw_output.endswith('"'):
            raw_output = raw_output.strip('"')

        return raw_output
        
    except Exception as e:
        return f"Error: Failed to modify text. Original text returned. Details: {str(e)}\n\n{clauses}"


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