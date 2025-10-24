from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_serializer
from bson import ObjectId


class NotificationResponse(BaseModel):
    id: str = Field(...)   # always expose as string
    issent: bool = False
    message: str 
    user_id: Optional[str] = None
    created_at: datetime
    
    @field_serializer("id", when_used="always")
    def serialize_id(self, v: ObjectId) -> str:
        return str(v)
    
    @field_serializer("user_id", when_used="always")
    def serialize_user_id(self, v) -> Optional[str]:
        if v is None:
            return None
        return str(v)
