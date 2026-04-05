from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class UploadResponse(BaseModel):
    id: int
    filename: str
    original_filename: str
    content_type: str
    file_size: int
    width: int | None
    height: int | None
    created_at: datetime

    model_config = {"from_attributes": True}
