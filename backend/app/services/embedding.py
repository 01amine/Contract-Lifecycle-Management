from typing import Any, List, Optional
import uuid
from qdrant_client import AsyncQdrantClient
import google.generativeai as genai
from app.config import settings
from qdrant_client.models import PointStruct
from pydantic import BaseModel
from app.dto.policy import ClauseResponse
from app.models.policy import Template
from qdrant_client.models import VectorParams,Distance


genai.configure(api_key=settings.GOOGLE_EMBEDDING_API_KEY)


class ResponseSchema(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None


class TextDocumentProcessor:
    qdrant: Optional[AsyncQdrantClient] = None
    gemini_client: Optional[Any] = None
    collection_name: Optional[str] = None

    @staticmethod
    async def init(client: AsyncQdrantClient, collection_name: str = "template_clauses_1", vector_size: int = 1536) -> None:
        TextDocumentProcessor.qdrant = client
        TextDocumentProcessor.gemini_client = genai
        TextDocumentProcessor.collection_name = collection_name
        print("[DEBUG] TextDocumentProcessor initialized")

        existing_collections = await TextDocumentProcessor.qdrant.get_collections()
        if collection_name not in [c.name for c in existing_collections.collections]:
            print(f"[DEBUG] Collection '{collection_name}' not found, creating...")
            await TextDocumentProcessor.qdrant.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(
                    size=3072,       
                    distance=Distance.COSINE
                )
            )
            print(f"[DEBUG] Collection '{collection_name}' created")
        else:
            print(f"[DEBUG] Collection '{collection_name}' already exists")
    @staticmethod
    async def embed_template(template: Template) -> ResponseSchema:
        if TextDocumentProcessor.qdrant is None or TextDocumentProcessor.gemini_client is None:
            print("[DEBUG] Clients not initialized")
            return ResponseSchema(success=False, message="Clients not initialized", data=None)

        try:
            texts: List[str] = []
            metadata: List[dict] = []

            for clause in template.clauses:
                text = f"{clause.title}\n{clause.text}"
                texts.append(text)
                metadata.append({
                    "template_id": str(template.id),
                    "clause_id": clause.clause_id or str(uuid.uuid4()),
                    "title": clause.title,
                    "text": clause.text,
                    "country": template.country,
                    "policy_type": template.policy_type,
                    "version": template.version,
                    "status": template.status.value
                })

            print(f"[DEBUG] texts prepared: {texts}")
            print(f"[DEBUG] metadata prepared: {metadata}")

            vectors: List[List[float]] = []
            for t in texts:
                response = TextDocumentProcessor.gemini_client.embed_content(
                    model=settings.EMBEDDING_MODEL,
                    content=t
                )
                print(f"[DEBUG] embedding response: {response}")
                vectors.append(response["embedding"])

            print(f"[DEBUG] vectors computed: {vectors}")

            points: List[PointStruct] = [
                PointStruct(
                    id=str(uuid.uuid4()),  
                    vector=vectors[i],
                    payload=metadata[i]   
                )
                for i in range(len(vectors))
            ]

            print(f"[DEBUG] points to upsert: {points}")

            await TextDocumentProcessor.qdrant.upsert(
                collection_name=TextDocumentProcessor.collection_name,
                points=points
            )

            print("[DEBUG] Qdrant upsert successful")
            return ResponseSchema(success=True, message="Template embedded successfully", data={"clauses_count": len(points)})

        except Exception as e:
            print(f"[ERROR] Exception during embedding: {str(e)}")
            return ResponseSchema(success=False, message=f"Failed to embed template: {str(e)}", data=None)
    @staticmethod
    async def retrieve_policies(document_text: str, top_k: int = 5) -> ResponseSchema:
        """Search Qdrant for clauses similar to the input text."""
        if TextDocumentProcessor.qdrant is None or TextDocumentProcessor.gemini_client is None:
            return ResponseSchema(success=False, message="Clients not initialized", data=None)

        try:
            query_vector: List[float] = TextDocumentProcessor.gemini_client.embed_content(
                model=settings.EMBEDDING_MODEL,
                content=document_text
            )["embedding"]

            results = await TextDocumentProcessor.qdrant.search(
                collection_name=TextDocumentProcessor.collection_name,
                query_vector=query_vector,
                limit=top_k
            )

            formatted: List[ClauseResponse] = [
                ClauseResponse(
                    clause_id=str(r.id),
                    template_id=str(r.payload.get("template_id", "")),
                    title=str(r.payload.get("title", "")),
                    text=str(r.payload.get("text", "")),
                    score=str(r.score),
                    country=str(r.payload.get("country", "")),
                    policy_type=str(r.payload.get("policy_type", "")),
                    version=str(r.payload.get("version", "")),
                )
                for r in results
            ]

            return ResponseSchema(success=True, message="Policies retrieved successfully", data=formatted)

        except Exception as e:
            return ResponseSchema(success=False, message=f"Failed to retrieve policies: {str(e)}", data=None)
