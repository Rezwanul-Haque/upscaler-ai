from __future__ import annotations

import asyncio
from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse

from src.core.database import SessionLocal
from src.core.dependencies import DbSession, UpscalerDep
from src.core.exceptions import AppError
from src.infra.upscaler.factory import get_upscaler_provider
from src.features.upscale.schemas import (
    CancelResponse,
    CreateJobRequest,
    JobListResponse,
    JobResponse,
)
from src.features.upscale.service import UpscaleService

router = APIRouter(prefix="/api/v1/upscale", tags=["upscale"])


def _svc(db: DbSession, upscaler: UpscalerDep) -> UpscaleService:
    return UpscaleService(db=db, upscaler=upscaler)


@router.post("/jobs", response_model=JobResponse, status_code=201)
def create_job(
    body: CreateJobRequest,
    background_tasks: BackgroundTasks,
    db: DbSession,
    upscaler: UpscalerDep,
) -> JobResponse:
    """
    Create and immediately queue an upscale job.
    The job runs in a background task; poll /jobs/{id} for status.
    """
    svc = _svc(db, upscaler)
    try:
        job = svc.create_job(
            image_id=body.image_id,
            model=body.model,
            scale=body.scale,
            output_format=body.output_format,
        )
    except AppError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc

    background_tasks.add_task(_run_job_bg, job.id)
    return JobResponse.model_validate(job)


def _run_job_bg(job_id: int) -> None:
    """Run upscale in background with its own DB session."""
    db = SessionLocal()
    try:
        svc = UpscaleService(db=db, upscaler=get_upscaler_provider())
        svc.run_job(job_id)
    except Exception:
        pass  # errors are persisted on the job record by the service
    finally:
        db.close()


@router.get("/jobs", response_model=JobListResponse)
def list_jobs(
    db: DbSession,
    upscaler: UpscalerDep,
    skip: int = 0,
    limit: int = 50,
    status: str | None = None,
) -> JobListResponse:
    """List upscale jobs, newest first. Optionally filter by status."""
    svc = _svc(db, upscaler)
    jobs, total = svc.list_jobs(skip=skip, limit=limit, status=status)
    return JobListResponse(
        jobs=[JobResponse.model_validate(j) for j in jobs],
        total=total,
    )


@router.get("/jobs/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: DbSession, upscaler: UpscalerDep) -> JobResponse:
    """Get status and metadata for a single job."""
    svc = _svc(db, upscaler)
    try:
        job = svc.get_job(job_id)
    except AppError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
    return JobResponse.model_validate(job)


@router.delete("/jobs/{job_id}", response_model=CancelResponse)
def cancel_job(job_id: int, db: DbSession, upscaler: UpscalerDep) -> CancelResponse:
    """Cancel a pending or processing job."""
    svc = _svc(db, upscaler)
    try:
        svc.cancel_job(job_id)
    except AppError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
    return CancelResponse(message=f"Job {job_id} has been cancelled.")


_FORMAT_CONFIG = {
    "png":  {"pil_format": "PNG",  "media_type": "image/png",  "ext": ".png"},
    "jpg":  {"pil_format": "JPEG", "media_type": "image/jpeg", "ext": ".jpg"},
    "jpeg": {"pil_format": "JPEG", "media_type": "image/jpeg", "ext": ".jpg"},
    "webp": {"pil_format": "WEBP", "media_type": "image/webp", "ext": ".webp"},
}


@router.get("/jobs/{job_id}/download")
def download_output(
    job_id: int,
    db: DbSession,
    upscaler: UpscalerDep,
    format: str | None = None,
) -> FileResponse:
    """Download the upscaled output image. Optionally convert to png/jpg/webp."""
    svc = _svc(db, upscaler)
    try:
        job = svc.get_job(job_id)
    except AppError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc

    if job.status != "completed" or not job.output_path:
        raise HTTPException(status_code=409, detail="Job output is not ready yet.")

    output_path = Path(job.output_path)
    if not output_path.exists():
        raise HTTPException(status_code=404, detail="Output file not found on disk.")

    # No conversion needed — serve original
    if not format or format.lower() not in _FORMAT_CONFIG:
        return FileResponse(
            path=str(output_path),
            filename=output_path.name,
            media_type="image/png",
        )

    # Convert on the fly
    from PIL import Image
    import tempfile

    cfg = _FORMAT_CONFIG[format.lower()]
    with Image.open(output_path) as img:
        if cfg["pil_format"] == "JPEG" and img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        tmp = tempfile.NamedTemporaryFile(suffix=cfg["ext"], delete=False)
        save_kwargs = {"quality": 95} if cfg["pil_format"] == "JPEG" else {}
        img.save(tmp.name, format=cfg["pil_format"], **save_kwargs)

    stem = output_path.stem
    return FileResponse(
        path=tmp.name,
        filename=f"{stem}{cfg['ext']}",
        media_type=cfg["media_type"],
    )
