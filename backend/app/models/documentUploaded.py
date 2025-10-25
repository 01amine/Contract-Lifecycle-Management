from datetime import datetime
from typing import Optional

from beanie import Document
from pydantic import Field


class ContractDocument(Document):
    file_name: str
    file_id:str
    content :Optional[str]
    created_at:datetime = Field(default_factory=datetime.utcnow)
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)