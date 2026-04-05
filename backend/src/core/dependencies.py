from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.infra.storage.base import BaseStorageProvider
from src.infra.storage.factory import get_storage_provider
from src.infra.upscaler.base import BaseUpscaler
from src.infra.upscaler.factory import get_upscaler_provider

DbSession = Annotated[Session, Depends(get_db)]


def get_upscaler() -> BaseUpscaler:
    return get_upscaler_provider()


def get_storage() -> BaseStorageProvider:
    return get_storage_provider()


UpscalerDep = Annotated[BaseUpscaler, Depends(get_upscaler)]
StorageDep = Annotated[BaseStorageProvider, Depends(get_storage)]
