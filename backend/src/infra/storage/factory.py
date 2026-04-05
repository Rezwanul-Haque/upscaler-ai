from __future__ import annotations

import importlib

from src.core.config import settings
from src.core.exceptions import AppError
from src.infra.storage.base import BaseStorageProvider

# Maps the STORAGE_PROVIDER env value to a dotted class path.
# Add new providers here — they are lazy-imported so missing deps
# (e.g. boto3, cloudflare) don't break the default local setup.
_PROVIDERS: dict[str, str] = {
    "local": "src.infra.storage.providers.local_storage.LocalStorageProvider",
    # Future providers — implement BaseStorageProvider and register here:
    # "s3":  "src.infra.storage.providers.s3_storage.S3StorageProvider",
    # "r2":  "src.infra.storage.providers.r2_storage.R2StorageProvider",
    # "gcs": "src.infra.storage.providers.gcs_storage.GCSStorageProvider",
}


def _load(dotted_path: str) -> type[BaseStorageProvider]:
    module_path, class_name = dotted_path.rsplit(".", 1)
    module = importlib.import_module(module_path)
    return getattr(module, class_name)


def get_storage_provider() -> BaseStorageProvider:
    """
    Resolve and instantiate the storage provider configured via
    the STORAGE_PROVIDER environment variable (default: local).

    To add a new provider:
      1. Implement BaseStorageProvider in providers/<name>_storage.py
      2. Add an entry to _PROVIDERS above
      3. Set STORAGE_PROVIDER=<name> in your .env
    """
    name = settings.storage_provider.lower().strip()

    if name not in _PROVIDERS:
        available = ", ".join(sorted(_PROVIDERS))
        raise AppError(
            f"Unknown storage provider '{name}'. Available: {available}",
            status_code=500,
        )

    cls = _load(_PROVIDERS[name])
    return cls()
