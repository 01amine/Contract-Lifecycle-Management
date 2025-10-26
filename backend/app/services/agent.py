from agno.agent import Agent
from app.config import settings
from typing import List, Dict, Any, Generator
from agno.models.google import Gemini

def gemini_pro_connector(messages: List[Dict[str, Any]], model_kwargs: Dict[str, Any], **kwargs) -> Any:
    """
    Connects the agno Agent framework to the Gemini 1.5 Pro API.

    Thi function uses settings.GOOGLE_API_KEY and forces the model to
    'gemini-1.5-pro' for consistent worker behavior.

    Args:
        messages: The conversation history passed by the Agent framework.
        model_kwargs: Parameters like temperature, max_output_tokens, etc.

    Returns:
        The API response object or a stream generator, depending on the call.
    """

    API_KEY = settings.GOOGLE_API_KEY
    MODEL_NAME = "gemini-1.5-pro"

    if not API_KEY:
        raise ValueError("GOOGLE_API_KEY is not set in app.config.settings.")

    config_params = {
        "temperature": settings.LLM_TEMPERATURE,
        "max_output_tokens": settings.LLM_MAX_TOKENS,
    }

    final_config = {**config_params, **model_kwargs}
    print(f"--- [STUB: {MODEL_NAME} Connector Called] ---")
    print(f"API Key used: {API_KEY[:4]}...{API_KEY[-4:] if API_KEY and len(API_KEY) > 8 else ''}")
    print(f"Final Configuration: {final_config}")
    if kwargs.get('stream', False):
        def stub_stream() -> Generator[str, None, None]:
            yield "This is a streaming "
            yield "response from the "
            yield f"{MODEL_NAME} stub."
        return stub_stream()
    return f"Response from {MODEL_NAME} stub."


gemini_pro = gemini_pro_connector

agent = Agent(
    name="abstract_worker_agent",
    model=Gemini(
        id="gemini-2.5-flash",
        api_key=settings.GOOGLE_API_KEY,
    ),
    stream=False)