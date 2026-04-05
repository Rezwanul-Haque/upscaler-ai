from __future__ import annotations

from sqlalchemy.orm import Session

from src.infra.db.models import UpscaleJob


class UpscaleJobRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def create(
        self,
        image_id: int,
        model: str,
        scale: int,
        output_format: str,
    ) -> UpscaleJob:
        job = UpscaleJob(
            image_id=image_id,
            model=model,
            scale=scale,
            output_format=output_format,
            status="pending",
            progress=0.0,
        )
        self._db.add(job)
        self._db.commit()
        self._db.refresh(job)
        return job

    def get(self, job_id: int) -> UpscaleJob | None:
        return self._db.get(UpscaleJob, job_id)

    def list_all(self, skip: int = 0, limit: int = 50, status: str | None = None) -> tuple[list[UpscaleJob], int]:
        query = self._db.query(UpscaleJob)
        if status:
            query = query.filter(UpscaleJob.status == status)
        total = query.count()
        jobs = (
            query
            .order_by(UpscaleJob.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
        return jobs, total

    def update(self, job: UpscaleJob, **kwargs) -> UpscaleJob:
        for key, value in kwargs.items():
            setattr(job, key, value)
        self._db.commit()
        self._db.refresh(job)
        return job
