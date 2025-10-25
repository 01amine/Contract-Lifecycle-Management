from datetime import datetime
from enum import Enum
from typing import Optional
from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field


class ContractStatus(str, Enum):
    DRAFT = "draft"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    SIGNED = "signed"


class clause(BaseModel):
    clause_id: str
    text: str
    heading: Optional[str] = None
    level: int
    start_pos: int


class ContractDocument(Document):
    file_name: str
    file_id: str
    category: Optional[str] = None
    clauses: Optional[list[clause]] = None
    content: Optional[str] = None
    status: ContractStatus = ContractStatus.DRAFT
    created_at: datetime = Field(default_factory=datetime.utcnow)
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    version: int = 1
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "contracts"
        
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
        populate_by_name = True