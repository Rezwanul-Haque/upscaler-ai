from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from pathlib import Path


@dataclass
class StorageResult:
    """Returned by every provider after a successful save."""
    stored_key: str        # filesystem path for local; object key for S3/R2
    file_size: int         # bytes written
    public_url: str | None = None  # pre-signed or CDN URL; None for local


class BaseStorageProvider(ABC):
    """
    Contract every storage backend must fulfil.

    Providers live in src/infra/storage/providers/.
    The active provider is selected via the STORAGE_PROVIDER env var.
    """

    @abstractmethod
    def save(self, data: bytes, filename: str) -> StorageResult:
        """Persist raw bytes under the given filename and return a StorageResult."""
        ...

    @abstractmethod
    def delete(self, stored_key: str) -> None:
        """Remove a previously stored object by its key."""
        ...

    @abstractmethod
    def get_local_path(self, stored_key: str) -> Path | None:
        """
        Return a local filesystem Path if the provider stores files locally,
        otherwise None (e.g. S3 objects have no local path).
        Used by the upscaler to read input files directly.
        """
        ...

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Human-readable provider name for logging."""
        ...
