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
    content: Optional[str] = None
    heading: Optional[str] = None
    level: int
    type: Optional[str] = None
    confidence: Optional[float] = None


class Risk(BaseModel):
    clause: str
    risk: str
    reason: str


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
    risks: Optional[list[dict]] = None
    compliance_score: Optional[float] = None
    
    class Settings:
        name = "contracts"
        
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
        populate_by_name = True