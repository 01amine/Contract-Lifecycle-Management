from datetime import datetime
from typing import List, Optional
from beanie import PydanticObjectId
from bson import ObjectId
from pydantic import BaseModel, Field
from app.models.policy import PoStatus

class ClauseSchema(BaseModel):
    clause_id: Optional[str] = Field(default_factory=lambda: str(ObjectId()))
    title: str
    text: str
    numeric_limits: Optional[dict] = None
    mandatory: bool = True

class ClauseSchemaReponse(BaseModel):
    clause_id: Optional[str] = Field(default_factory=lambda: str(ObjectId()))
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
    id: Optional[PydanticObjectId]  
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


  # Example of numeric_limits:
    # {
    #     "cap": 250000,            # maximum liability amount (QAR)
    #     "min_fee": 1000,          # minimum fee required
    #     "penalty_percent": 2.0    # late payment interest rate in %
    # }
    # Notes:
    # - All keys are optional depending on the clause type
    # - Used for validation, AI auto-correction, and enforcing policy rules


class ClauseResponse(BaseModel):
    clause_id: str
    template_id: str
    title: str
    text: str
    score: float
    country: str
    policy_type: str
    version: int