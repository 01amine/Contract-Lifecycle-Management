from dataclasses import dataclass
import os
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

dotenv_path = Path(__file__).parent.parent.parent / ".env"
if dotenv_path.exists():
    print(f"Loading environment variables from: {dotenv_path}")
    load_dotenv(dotenv_path)
else:
    print("Warning: .env file not found at expected path.")


@dataclass
class OCRConfig:
    """Configuration for OCR processing."""
    tesseract_path: Optional[str] = None
    dpi: int = 300
    psm_mode: int = 6  
    language: str = 'eng+ara'
    min_text_length: int = 50 


@dataclass
class LLMConfig:
    """Configuration for LLM services."""
    # Updated Gemini model to Gemini 1.5 Pro
    gemini_api_key: Optional[str] = None
    gemini_model: str = "gemini-1.5-pro"
    
    
    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-4o"
    
    
    anthropic_api_key: Optional[str] = None
    anthropic_model: str = "claude-3-haiku-20240307"
    
    
    groq_api_key: Optional[str] = None
    groq_model: str = "openai/gpt-oss-120b"
    
    
    temperature: float = 0.2
    max_output_tokens: int = 2048
    top_p: float = 0.95
    top_k: int = 40


@dataclass
class ExtractionConfig:
    """Configuration for document extraction."""
    output_dir: Path = Path("./extracted_data")
    supported_formats: tuple = ('.pdf', '.docx', '.doc')
    save_intermediate: bool = False

class Config:
    """Main configuration class."""
    
    def __init__(self):
        self.ocr = OCRConfig()
        self.llm = LLMConfig()
        self.extraction = ExtractionConfig()
        self._load_from_env()
    
    def _load_from_env(self):
        """Load configuration from environment variables."""
        self.llm.gemini_api_key = os.getenv('GEMINI_API_KEY')
        self.llm.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.llm.anthropic_api_key = os.getenv('ANTHROPIC_API_KEY')
        self.llm.groq_api_key = os.getenv('GROQ_API_KEY')
        
        output_dir = os.getenv('OUTPUT_DIR')
        if output_dir:
            self.extraction.output_dir = Path(output_dir)
    
    def validate(self) -> bool:
        """Validate configuration."""
        has_llm_key = any([
            self.llm.gemini_api_key,
            self.llm.openai_api_key,
            self.llm.anthropic_api_key,
            self.llm.groq_api_key
        ])
        
        if not has_llm_key:
            print("Warning: No LLM API key configured. Set GEMINI_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, or GROQ_API_KEY")
        
        return True
    
    @classmethod
    def from_dict(cls, config_dict: dict) -> 'Config':
        """Create config from dictionary."""
        config = cls()
        
        if 'ocr' in config_dict:
            for key, value in config_dict['ocr'].items():
                if hasattr(config.ocr, key):
                    setattr(config.ocr, key, value)
        
        if 'llm' in config_dict:
            for key, value in config_dict['llm'].items():
                if hasattr(config.llm, key):
                    setattr(config.llm, key, value)
        
        if 'extraction' in config_dict:
            for key, value in config_dict['extraction'].items():
                if hasattr(config.extraction, key):
                    setattr(config.extraction, key, value)
        
        return config


_config_instance: Optional[Config] = None


def get_config() -> Config:
    """Get or create global config instance."""
    global _config_instance
    if _config_instance is None:
        _config_instance = Config()
        _config_instance.validate()
    return _config_instance


def set_config(config: Config):
    """Set global config instance."""
    global _config_instance
    _config_instance = config

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
    OCR_LANGUAGE: str = "eng+ara" 
    OCR_DPI: int = 300 
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_EXTENSIONS: list = [".pdf", ".docx", ".doc"]
    UPLOAD_TEMP_DIR: str = "/tmp/contract_uploads"
    CHROMA_PERSIST_DIR: str = "./data/chroma"
    CHROMA_COLLECTION_NAME: str = "contract_templates"
    LLM_PROVIDER: str = "groq"  
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    GOOGLE_API_KEY: Optional[str] = None
    GROQ_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    ANTHROPIC_MODEL: str = "claude-sonnet-4-5-20250929"
    GOOGLE_MODEL: str = "gemini-pro"
    GROQ_MODEL: str = "openai/gpt-oss-120b"
    GROQ_BASE_URL: str = "https://api.groq.com/openai/v1"
    LLM_TEMPERATURE: float = 0.1  
    LLM_MAX_TOKENS: int = 2000
    LLM_TIMEOUT: int = 60
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
    
    def model_post_init(self, __context) -> None:
        """Post-initialization to set up API keys based on provider."""
        # If using Groq provider, use GROQ_API_KEY for OpenAI client compatibility
        if self.LLM_PROVIDER == "groq" and self.GROQ_API_KEY:
            # Set OPENAI_API_KEY to GROQ_API_KEY for OpenAI-compatible clients
            if not self.OPENAI_API_KEY:
                self.OPENAI_API_KEY = self.GROQ_API_KEY
            # Also set in environment for clients that read from env
            os.environ['OPENAI_API_KEY'] = self.GROQ_API_KEY
        return super().model_post_init(__context) if hasattr(super(), 'model_post_init') else None


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