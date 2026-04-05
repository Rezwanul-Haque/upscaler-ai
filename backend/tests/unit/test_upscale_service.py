from __future__ import annotations

import io

import pytest
from PIL import Image

from src.core.exceptions import ConflictError, NotFoundError, UpscaleError
from src.features.upload.service import UploadService
from src.features.upscale.service import UpscaleService
from src.infra.db.models import ImageRecord
from tests.conftest import FakeStorageProvider, FakeUpscaler


def _png_bytes() -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", (4, 4)).save(buf, format="PNG")
    return buf.getvalue()


def _make_upload_file(content: bytes, filename: str = "img.png"):
    from unittest.mock import MagicMock
    mock = MagicMock()
    mock.filename = filename
    mock.content_type = "image/png"
    mock.file = io.BytesIO(content)
    return mock


def _seed_image(db_session, upload_dir) -> ImageRecord:
    upload_dir.mkdir(parents=True, exist_ok=True)
    storage = FakeStorageProvider(upload_dir)
    svc = UploadService(db=db_session, storage=storage)
    return svc.upload_image(_make_upload_file(_png_bytes()))


class TestUpscaleService:
    def test_create_job_success(self, db_session, tmp_path):
        img = _seed_image(db_session, tmp_path / "uploads")
        svc = UpscaleService(db=db_session, upscaler=FakeUpscaler())
        job = svc.create_job(image_id=img.id, model="realesrgan-x2plus", scale=2, output_format="PNG")

        assert job.id is not None
        assert job.status == "pending"
        assert job.image_id == img.id

    def test_create_job_unknown_image_raises(self, db_session):
        svc = UpscaleService(db=db_session, upscaler=FakeUpscaler())
        with pytest.raises(NotFoundError):
            svc.create_job(image_id=9999, model="realesrgan-x2plus", scale=2, output_format="PNG")

    def test_create_job_unknown_model_raises(self, db_session, tmp_path):
        img = _seed_image(db_session, tmp_path / "uploads")
        svc = UpscaleService(db=db_session, upscaler=FakeUpscaler())
        with pytest.raises(UpscaleError, match="Unknown model"):
            svc.create_job(image_id=img.id, model="not-a-model", scale=2, output_format="PNG")

    def test_run_job_completes(self, db_session, tmp_path, monkeypatch):
        img = _seed_image(db_session, tmp_path / "uploads")
        monkeypatch.setattr("src.core.config.settings.output_dir", tmp_path / "outputs")
        (tmp_path / "outputs").mkdir(exist_ok=True)

        svc = UpscaleService(db=db_session, upscaler=FakeUpscaler())
        job = svc.create_job(image_id=img.id, model="realesrgan-x2plus", scale=2, output_format="PNG")
        completed = svc.run_job(job.id)

        assert completed.status == "completed"
        assert completed.progress == 100.0
        assert completed.output_path is not None

    def test_run_job_not_found(self, db_session):
        svc = UpscaleService(db=db_session, upscaler=FakeUpscaler())
        with pytest.raises(NotFoundError):
            svc.run_job(9999)

    def test_cancel_pending_job(self, db_session, tmp_path):
        img = _seed_image(db_session, tmp_path / "uploads")
        svc = UpscaleService(db=db_session, upscaler=FakeUpscaler())
        job = svc.create_job(image_id=img.id, model="realesrgan-x2plus", scale=2, output_format="PNG")

        cancelled = svc.cancel_job(job.id)
        assert cancelled.status == "cancelled"

    def test_cancel_completed_job_raises(self, db_session, tmp_path, monkeypatch):
        img = _seed_image(db_session, tmp_path / "uploads")
        monkeypatch.setattr("src.core.config.settings.output_dir", tmp_path / "outputs")
        (tmp_path / "outputs").mkdir(exist_ok=True)

        svc = UpscaleService(db=db_session, upscaler=FakeUpscaler())
        job = svc.create_job(image_id=img.id, model="realesrgan-x2plus", scale=2, output_format="PNG")
        svc.run_job(job.id)

        with pytest.raises(ConflictError):
            svc.cancel_job(job.id)

    def test_list_jobs(self, db_session, tmp_path):
        img = _seed_image(db_session, tmp_path / "uploads")
        svc = UpscaleService(db=db_session, upscaler=FakeUpscaler())
        svc.create_job(image_id=img.id, model="realesrgan-x2plus", scale=2, output_format="PNG")
        svc.create_job(image_id=img.id, model="lanczos", scale=2, output_format="PNG")

        jobs, total = svc.list_jobs()
        assert total == 2
        assert len(jobs) == 2
