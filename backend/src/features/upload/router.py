from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from src.core.dependencies import DbSession, StorageDep
from src.core.exceptions import AppError
from src.features.upload.schemas import UploadResponse
from src.features.upload.service import UploadService

router = APIRouter(prefix="/api/v1/upload", tags=["upload"])


@router.post("", response_model=UploadResponse, status_code=201)
def upload_image(
    db: DbSession,
    storage: StorageDep,
    file: UploadFile = File(...),
) -> UploadResponse:
    """Upload an image to be upscaled. Returns image metadata and ID."""
    service = UploadService(db=db, storage=storage)
    try:
        record = service.upload_image(file)
    except AppError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
    return UploadResponse.model_validate(record)


@router.get("/{image_id}", response_model=UploadResponse)
def get_image(image_id: int, db: DbSession, storage: StorageDep) -> UploadResponse:
    """Retrieve uploaded image metadata by ID."""
    service = UploadService(db=db, storage=storage)
    record = service.get_image(image_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Image {image_id} not found.")
    return UploadResponse.model_validate(record)


@router.get("/{image_id}/file")
def get_image_file(image_id: int, db: DbSession, storage: StorageDep) -> FileResponse:
    """Serve the original uploaded image file."""
    service = UploadService(db=db, storage=storage)
    record = service.get_image(image_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Image {image_id} not found.")

    local_path = storage.get_local_path(record.file_path)
    if not local_path or not local_path.exists():
        raise HTTPException(status_code=404, detail="Image file not found on disk.")

    return FileResponse(
        path=str(local_path),
        filename=record.original_filename,
        media_type=record.content_type,
    )
