from __future__ import annotations

import uuid
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy.orm import Session

from src.core.config import settings
from src.core.exceptions import ConflictError, NotFoundError, UpscaleError
from src.features.upscale.repository import UpscaleJobRepository
from src.infra.db.models import ImageRecord, UpscaleJob
from src.infra.upscaler.base import BaseUpscaler
from src.infra.upscaler.registry import get_model

_TERMINAL_STATUSES = {"completed", "failed", "cancelled"}


class UpscaleService:
    def __init__(self, db: Session, upscaler: BaseUpscaler) -> None:
        self._db = db
        self._upscaler = upscaler
        self._repo = UpscaleJobRepository(db)

    def create_job(
        self,
        image_id: int,
        model: str,
        scale: int,
        output_format: str,
    ) -> UpscaleJob:
        # Verify image exists
        image = self._db.get(ImageRecord, image_id)
        if not image:
            raise NotFoundError("Image", image_id)

        # Validate model
        if get_model(model) is None:
            raise UpscaleError(f"Unknown model '{model}'.")

        return self._repo.create(
            image_id=image_id,
            model=model,
            scale=scale,
            output_format=output_format,
        )

    def get_job(self, job_id: int) -> UpscaleJob:
        job = self._repo.get(job_id)
        if not job:
            raise NotFoundError("UpscaleJob", job_id)
        return job

    def list_jobs(self, skip: int = 0, limit: int = 50, status: str | None = None) -> tuple[list[UpscaleJob], int]:
        return self._repo.list_all(skip=skip, limit=limit, status=status)

    def cancel_job(self, job_id: int) -> UpscaleJob:
        job = self.get_job(job_id)
        if job.status in _TERMINAL_STATUSES:
            raise ConflictError(f"Job {job_id} is already '{job.status}' and cannot be cancelled.")
        return self._repo.update(job, status="cancelled")

    def run_job(self, job_id: int) -> UpscaleJob:
        """Execute the upscale synchronously (background tasks call this)."""
        job = self.get_job(job_id)

        if job.status == "cancelled":
            return job
        if job.status in ("processing", "completed"):
            raise ConflictError(f"Job {job_id} is already '{job.status}'.")

        self._repo.update(job, status="processing", started_at=datetime.now(timezone.utc), progress=0.0)

        try:
            image = self._db.get(ImageRecord, job.image_id)
            if not image:
                raise NotFoundError("Image", job.image_id)

            input_path = Path(image.file_path)
            if not input_path.exists():
                raise UpscaleError(f"Input file not found: {input_path}")

            ext_map = {"PNG": ".png", "JPG": ".jpg", "JPEG": ".jpg", "WEBP": ".webp"}
            ext = ext_map.get(job.output_format.upper(), ".png")
            output_filename = f"{uuid.uuid4().hex}_x{job.scale}{ext}"
            output_path = settings.output_dir / output_filename

            result = self._upscaler.upscale(
                input_path=input_path,
                output_path=output_path,
                model=job.model,
                scale=job.scale,
                output_format=job.output_format,
            )

            return self._repo.update(
                job,
                status="completed",
                progress=100.0,
                output_path=str(result.output_path),
                output_width=result.width,
                output_height=result.height,
                completed_at=datetime.now(timezone.utc),
            )
        except Exception as exc:
            self._repo.update(
                job,
                status="failed",
                error_message=str(exc),
                completed_at=datetime.now(timezone.utc),
            )
            raise
