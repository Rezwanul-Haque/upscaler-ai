from __future__ import annotations

from pathlib import Path

from fastapi import UploadFile
from PIL import Image
from sqlalchemy.orm import Session

from src.core.exceptions import ValidationError
from src.infra.db.models import ImageRecord
from src.infra.storage.base import BaseStorageProvider

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/bmp",
    "image/tiff",
}


class UploadService:
    def __init__(self, db: Session, storage: BaseStorageProvider) -> None:
        self._db = db
        self._storage = storage

    def upload_image(self, file: UploadFile) -> ImageRecord:
        self._validate(file)
        data = file.file.read()
        result = self._storage.save(data, file.filename or "upload")
        width, height = self._dimensions(result.stored_key)

        record = ImageRecord(
            filename=Path(result.stored_key).name,
            original_filename=file.filename or Path(result.stored_key).name,
            content_type=file.content_type or "application/octet-stream",
            file_path=result.stored_key,
            file_size=result.file_size,
            width=width,
            height=height,
        )
        self._db.add(record)
        self._db.commit()
        self._db.refresh(record)
        return record

    def get_image(self, image_id: int) -> ImageRecord | None:
        return self._db.get(ImageRecord, image_id)

    # ------------------------------------------------------------------ helpers

    def _validate(self, file: UploadFile) -> None:
        if file.content_type not in ALLOWED_CONTENT_TYPES:
            raise ValidationError(
                f"Unsupported file type '{file.content_type}'. "
                f"Allowed: {sorted(ALLOWED_CONTENT_TYPES)}"
            )

    def _dimensions(self, stored_key: str) -> tuple[int | None, int | None]:
        local_path = self._storage.get_local_path(stored_key)
        if local_path is None or not local_path.exists():
            return None, None
        try:
            with Image.open(local_path) as img:
                return img.width, img.height
        except Exception:
            return None, None
