from __future__ import annotations

from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Branding
    brand_name: str = "Upscaler AI"

    # App
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    app_debug: bool = False

    # Storage
    upload_dir: Path = Path("./data/uploads")
    output_dir: Path = Path("./data/outputs")
    max_upload_size_mb: int = 50

    # Database
    database_url: str = "sqlite:///./data/upscaler.db"

    # Upscaler provider — options: "pillow" (more coming soon)
    upscaler_provider: str = "pillow"

    # Storage provider — options: "local" | future: "s3", "r2", "gcs"
    storage_provider: str = "local"

    # CORS — stored as comma-separated string to avoid pydantic-settings JSON parse issues
    allowed_origins: str = "http://localhost:3000,http://localhost:1420"

    @property
    def allowed_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

    @field_validator("upload_dir", "output_dir", mode="before")
    @classmethod
    def ensure_path(cls, v: str | Path) -> Path:
        p = Path(v)
        p.mkdir(parents=True, exist_ok=True)
        return p

    @property
    def max_upload_bytes(self) -> int:
        return self.max_upload_size_mb * 1024 * 1024


settings = Settings()
