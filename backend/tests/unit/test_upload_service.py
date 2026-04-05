from __future__ import annotations

import io

import pytest
from PIL import Image

from src.core.exceptions import ValidationError
from src.features.upload.service import UploadService
from tests.conftest import FakeStorageProvider


def _make_upload_file(content: bytes, filename: str = "img.png", content_type: str = "image/png"):
    from unittest.mock import MagicMock
    mock = MagicMock()
    mock.filename = filename
    mock.content_type = content_type
    mock.file = io.BytesIO(content)
    return mock


def _png_bytes(w: int = 4, h: int = 4) -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", (w, h)).save(buf, format="PNG")
    return buf.getvalue()


class TestUploadService:
    def test_upload_valid_image(self, db_session, tmp_path):
        storage = FakeStorageProvider(tmp_path / "uploads")
        svc = UploadService(db=db_session, storage=storage)

        record = svc.upload_image(_make_upload_file(_png_bytes(), "photo.png"))

        assert record.id is not None
        assert record.original_filename == "photo.png"
        assert record.width == 4
        assert record.height == 4
        assert record.file_size > 0

    def test_rejects_unsupported_mime(self, db_session, tmp_path):
        storage = FakeStorageProvider(tmp_path / "uploads")
        svc = UploadService(db=db_session, storage=storage)

        with pytest.raises(ValidationError, match="Unsupported file type"):
            svc.upload_image(_make_upload_file(b"data", "doc.pdf", "application/pdf"))

    def test_rejects_oversized_file(self, db_session, tmp_path, monkeypatch):
        # Patch max_upload_bytes to 1 so any real image exceeds it
        monkeypatch.setattr("src.core.config.settings.max_upload_size_mb", 0)
        monkeypatch.setattr(
            "src.infra.storage.providers.local_storage.settings",
            type("S", (), {"max_upload_bytes": 1, "upload_dir": tmp_path / "uploads"})(),
        )
        storage = FakeStorageProvider(tmp_path / "uploads")
        # Override save directly to simulate the size check
        from src.core.exceptions import ValidationError as VE
        original_save = storage.save
        def save_raising(data, filename):
            if len(data) > 1:
                raise VE("File exceeds maximum size of 0 MB.")
            return original_save(data, filename)
        storage.save = save_raising  # type: ignore[method-assign]

        svc = UploadService(db=db_session, storage=storage)
        with pytest.raises(VE, match="maximum size"):
            svc.upload_image(_make_upload_file(_png_bytes(100, 100)))

    def test_get_image_returns_none_when_missing(self, db_session, tmp_path):
        storage = FakeStorageProvider(tmp_path / "uploads")
        svc = UploadService(db=db_session, storage=storage)
        assert svc.get_image(9999) is None

    def test_get_image_returns_record(self, db_session, tmp_path):
        storage = FakeStorageProvider(tmp_path / "uploads")
        svc = UploadService(db=db_session, storage=storage)
        record = svc.upload_image(_make_upload_file(_png_bytes()))

        fetched = svc.get_image(record.id)
        assert fetched is not None
        assert fetched.id == record.id
