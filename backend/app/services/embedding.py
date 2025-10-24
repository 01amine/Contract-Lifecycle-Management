from qdrant_client import AsyncQdrantClient
import google.generativeai as genai
from app.config import settings

genai.configure(api_key=settings.GOOGLE_EMBEDDING_API_KEY)

class TextDocumentProcessor:
    qdrant: AsyncQdrantClient
    gemini_client: genai
    @staticmethod
    def init(qdrant_host: str, qdrant_port: int = 6333):
        TextDocumentProcessor.qdrant = AsyncQdrantClient(
            host=qdrant_host, port=qdrant_port
        )
        genai.configure(api_key=settings.GOOGLE_EMBEDDING_API_KEY)
        TextDocumentProcessor.gemini_client = genai
    
    @staticmethod
    async def embedPolicy():
        pass

    @staticmethod
    async def retirve_policy():
        pass

    


    
