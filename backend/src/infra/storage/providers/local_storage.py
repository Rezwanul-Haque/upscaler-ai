from __future__ import annotations

import uuid
from pathlib import Path

from src.core.config import settings
from src.core.exceptions import StorageError, ValidationError
from src.infra.storage.base import BaseStorageProvider, StorageResult


class LocalStorageProvider(BaseStorageProvider):
    """
    Stores files on the local filesystem under settings.upload_dir.
    Default provider — works with no extra configuration.
    """

    @property
    def provider_name(self) -> str:
        return "local"

    def save(self, data: bytes, filename: str) -> StorageResult:
        if len(data) > settings.max_upload_bytes:
            raise ValidationError(
                f"File exceeds maximum size of {settings.max_upload_size_mb} MB."
            )

        ext = Path(filename).suffix or ".bin"
        stored_key = f"{uuid.uuid4().hex}{ext}"
        dest = settings.upload_dir / stored_key

        try:
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(data)
        except OSError as exc:
            raise StorageError(f"Failed to write file to disk: {exc}") from exc

        return StorageResult(
            stored_key=str(dest),
            file_size=dest.stat().st_size,
            public_url=None,  # served via the /upload/{id} API endpoint
        )

    def delete(self, stored_key: str) -> None:
        path = Path(stored_key)
        if path.exists():
            path.unlink(missing_ok=True)

    def get_local_path(self, stored_key: str) -> Path | None:
        return Path(stored_key)
