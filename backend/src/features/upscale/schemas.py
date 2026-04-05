from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class CreateJobRequest(BaseModel):
    image_id: int
    model: str = "realesrgan-x2plus"
    scale: int = Field(default=2, ge=2, le=8)
    output_format: Literal["PNG", "JPG", "WEBP"] = "PNG"


class JobResponse(BaseModel):
    id: int
    image_id: int
    model: str
    scale: int
    output_format: str
    status: str
    progress: float
    output_path: str | None = None
    output_width: int | None = None
    output_height: int | None = None
    error_message: str | None = None
    created_at: datetime
    started_at: datetime | None = None
    completed_at: datetime | None = None

    model_config = {"from_attributes": True}


class JobListResponse(BaseModel):
    jobs: list[JobResponse]
    total: int


class CancelResponse(BaseModel):
    message: str
