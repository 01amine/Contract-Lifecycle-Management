from datetime import datetime
from typing import Optional
from beanie import Document, Link
from app.models.user import User


class notification (Document):
    issent: bool = False
    message : str 
    created_at : datetime
    
    class Settings:
        name = "notifications"