import os
from pathlib import Path
from typing import List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Base Directory (Project Root)
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "House Price Prediction API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Model and Locations configuration
    MODEL_PATH: str = Field(default="models/house_price.pkl")
    LOCATIONS_PATH: str = Field(default="locations.json")
    
    # CORS Configuration
    CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ]
    
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
        
    @property
    def resolved_model_path(self) -> Path:
        p = Path(self.MODEL_PATH)
        if p.is_absolute():
            return p
        # Check relative to BASE_DIR
        candidate = BASE_DIR / self.MODEL_PATH
        if candidate.exists():
            return candidate
        return p

    @property
    def resolved_locations_path(self) -> Path:
        p = Path(self.LOCATIONS_PATH)
        if p.is_absolute():
            return p
        candidate = BASE_DIR / self.LOCATIONS_PATH
        if candidate.exists():
            return candidate
        return p

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
