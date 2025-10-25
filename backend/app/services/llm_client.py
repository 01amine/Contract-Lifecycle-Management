import json
import time
from typing import Dict, Any, Type
from httpx import AsyncClient, HTTPStatusError
from app.config import settings 
from app.dto.llm_clause import LLMClauseListDTO

GEMINI_API_URL = settings.GOOGLE_API_KEY
MAX_RETRIES = 10
class LLMClient:
    """Handles communication with the Gemini API for structured text generation."""

    def __init__(self):
        self.api_key = settings.GOOGLE_API_KEY
        self.client = AsyncClient(timeout=30.0) 

    async def _make_api_call(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Handles the API call with exponential backoff."""
        
        url_with_key = f"{GEMINI_API_URL}?key={self.api_key}"
        
        for attempt in range(MAX_RETRIES):
            try:
                response = await self.client.post(
                    url_with_key,
                    headers={"Content-Type": "application/json"},
                    content=json.dumps(payload)
                )
                response.raise_for_status()
                return response.json()
            except HTTPStatusError as e:
                if response.status_code in (429, 500, 503) and attempt < MAX_RETRIES - 1:
                    print(f"LLM API call failed (Status: {response.status_code}). Retrying in {2**attempt}s...")
                    await time.sleep(2 ** attempt)
                    continue
                raise e
            except Exception as e:
                if attempt < MAX_RETRIES - 1:
                    print(f"LLM API call failed. Retrying in {2**attempt}s...")
                    await time.sleep(2 ** attempt)
                    continue
                raise e
        
        raise ConnectionError("LLM API call failed after multiple retries.")


    async def segment_document_structured(self, raw_text: str) -> LLMClauseListDTO:
        """
        Calls the LLM to perform document segmentation and returns a structured object.
        """
        system_prompt = (
            "You are an expert contract segmentation engine. Your task is to analyze the provided raw "
            "legal text and split it into discrete, logically self-contained clauses. For each clause, "
            "provide the exact text, a standardized hierarchical ID (e.g., '1.1', '2.3.a'), its numerical "
            "hierarchy level (1 for main, 2 for sub-section, etc.), and the heading of the section if known. "
            "Do not add any text or formatting outside the JSON object."
        )

        user_query = f"Please segment the following legal document text into clauses:\n\n---\n{raw_text}\n---"
        
        payload = {
            "contents": [{ "parts": [{ "text": user_query }] }],
            "systemInstruction": { "parts": [{ "text": system_prompt }] },
            "generationConfig": {
                "responseMimeType": "application/json",
                "responseSchema": LLMClauseListDTO.model_json_schema() 
            },
        }

        api_response = await self._make_api_call(payload)
        
        # Extract the JSON string from the response
        try:
            json_text = api_response["candidates"][0]["content"]["parts"][0]["text"]
            
            # The LLM might return a JSON string, so we parse it and validate with Pydantic
            parsed_json = json.loads(json_text)
            return LLMClauseListDTO.model_validate(parsed_json)
        
        except Exception as e:
            print(f"Error parsing or validating LLM response: {e}")
            print(f"Raw API response: {api_response}")
            raise ValueError("Failed to obtain structured clause list from LLM.")