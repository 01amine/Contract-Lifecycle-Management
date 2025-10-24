from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional
import uuid

from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field

class PoStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    ARCHIVED = "archived"
    DELETED = "deleted"



class Clause(BaseModel):
    clause_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    text: str
    numeric_limits: Optional[Dict[str, float]] = None
    mandatory: bool = True


class Template(Document):
    # template_id: Optional[str] = None 
    name: str
    country: str
    policy_type: str
    description: Optional[str] = None
    version: int = 1
    clauses: List[Clause] = []
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    status: PoStatus = PoStatus.DRAFT

    class Settings:
        name = "templates"                                                                                           