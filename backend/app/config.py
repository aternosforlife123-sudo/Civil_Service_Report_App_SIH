from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "civic_reporter"
    
    # JWT
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    
    # File upload
    upload_directory: str = "static/uploads"
    max_file_size: int = 5 * 1024 * 1024  # 5MB
    allowed_file_types: list = [".jpg", ".jpeg", ".png", ".gif"]
    
    # Email (configure for production)
    smtp_server: Optional[str] = None
    smtp_port: Optional[int] = None
    smtp_username: Optional[str] = None
    smtp_password: Optional[str] = None
    
    # API Keys (for mapping services, etc.)
    google_maps_api_key: Optional[str] = None
    
    class Config:
        env_file = ".env"

settings = Settings()

# Create upload directory if it doesn't exist
os.makedirs(settings.upload_directory, exist_ok=True)