from datetime import datetime
from enum import Enum
from typing import Optional
from beanie import Document
from pydantic import Field


class ContractStatus(str, Enum):
    DRAFT = "draft"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    SIGNED = "signed"


class ContractDocument(Document):
    file_name: str                     
    file_id: str                       
    content: Optional[str] = None      
    status: ContractStatus = ContractStatus.DRAFT 
    created_at: datetime = Field(default_factory=datetime.utcnow)
    uploaded_at: datetime = Field(default_factory=datetime.utcnow) 
    version: int = 1               
    last_updated: datetime = Field(default_factory=datetime.utcnow)
