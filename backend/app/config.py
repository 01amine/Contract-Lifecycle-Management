import os
from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
# from fastapi_mail import ConnectionConfig


class Settings(BaseSettings):
    ALLOWED_ORIGINS: str = "*"
    QDRANT_URL:str
    QDRANT_GRPC_PORT:int
    QDRANT_STORAGE_PATH:str="/qdrant/storage"
    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]
    MINIO_HOST: str 
    MINIO_PORT: int 
    MINIO_ROOT_USER: str 
    MINIO_ROOT_PASSWORD: str 
    SECRET_KEY: str = "your-very-secret-key"
    PASSWORD_RESET_TOKEN_EXPIRES: int = 3600  # 1 hour
    BASE_URL: str 
    notificationMessage: str = "You have a new notification."
    GOOGLE_CLIENT_ID: str = "1054139531486-amoevmmhnalq2s33lnhuk89qju7430i5.apps.googleusercontent.com"
    TESSERACT_PATH: Optional[str] = None 
    OCR_LANGUAGE: str = "eng" 
    OCR_DPI: int = 300 
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_EXTENSIONS: list = [".pdf", ".docx", ".doc"]
    UPLOAD_TEMP_DIR: str = "/tmp/contract_uploads"
    CHROMA_PERSIST_DIR: str = "./data/chroma"
    CHROMA_COLLECTION_NAME: str = "contract_templates"
    LLM_PROVIDER: str = "gemini"  
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    GOOGLE_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    ANTHROPIC_MODEL: str = "claude-sonnet-4-5-20250929"
    GOOGLE_MODEL: str = "gemini-pro"
    LLM_TEMPERATURE: float = 0.1  
    LLM_MAX_TOKENS: int = 2000
    LLM_TIMEOUT: int = 60  
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    EMBEDDING_DIMENSION: int = 384
    MONGO_URI: str = Field(default=...)
    MONGO_DB: str = Field(default=...)
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_ALGORITHM: str = "HS256"
    JWT_SECRET: str = Field(default=...)
    ENV: str = Field(default="development")
    MAILJET_API_KEY: str
    MAILJET_SECRET_KEY: str
    MAIL_FROM_ADDRESS: str
    ZR_EXPRESS_TOKEN: str
    ZR_EXPRESS_KEY: str
    GOOGLE_EMBEDDING_API_KEY:str
    EMBEDDING_MODEL:str="gemini-embedding-001"
    model_config = SettingsConfigDict(
        case_sensitive=True,
        extra="allow",  
    )


settings = Settings()

# conf = ConnectionConfig(
#     MAIL_USERNAME=settings.MAILJET_API_KEY,
#     MAIL_PASSWORD=settings.MAILJET_SECRET_KEY,
#     MAIL_FROM=settings.MAIL_FROM_ADDRESS,
#     MAIL_PORT=587,
#     MAIL_SERVER="in-v3.mailjet.com",
#     MAIL_STARTTLS=True,
#     MAIL_SSL_TLS=False,
#     USE_CREDENTIALS=True,
# )
