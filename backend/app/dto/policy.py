from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.policy import PoStatus

class ClauseSchema(BaseModel):
    clause_id: Optional[str] = None
    title: str
    text: str
    numeric_limits: Optional[dict] = None
    mandatory: bool = True


class TemplateCreateSchema(BaseModel):
    name: str
    country: str
    policy_type: str
    description: Optional[str] = None
    clauses: List[ClauseSchema] = []
    created_by: str
    status: Optional[PoStatus] = PoStatus.DRAFT


class TemplateUpdateSchema(BaseModel):
    name: Optional[str]
    description: Optional[str]
    clauses: Optional[List[ClauseSchema]]
    status: Optional[PoStatus]
    version: Optional[int]  
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TemplateReadSchema(BaseModel):
    id: Optional[str] 
    name: str
    country: str
    policy_type: str
    description: Optional[str]
    version: int
    clauses: List[ClauseSchema]
    created_by: str
    created_at: datetime
    updated_at: datetime
    status: PoStatus
