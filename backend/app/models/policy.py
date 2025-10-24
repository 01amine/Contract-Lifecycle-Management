from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional

from beanie import Document
from pydantic import BaseModel, Field

class PoStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    ARCHIVED = "archived"
    DELETED = "deleted"


class Clause(BaseModel):
    clause_id: Optional[str] = None 
    title: str
    text: str
    numeric_limits: Optional[Dict[str, float]] = None  #  i ahev to check this 
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