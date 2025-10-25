from agno.models.openai import OpenAIChat
from app.config import settings


gpt = OpenAIChat(
	id=settings.GROQ_MODEL,
	api_key=settings.GROQ_API_KEY,
	base_url=settings.GROQ_BASE_URL,
	temperature=0.4,
)

AGENT_RESPONSE_KEYS = {
    "agent": ["answer"],
}