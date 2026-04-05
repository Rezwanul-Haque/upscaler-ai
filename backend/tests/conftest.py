from __future__ import annotations

import io
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from PIL import Image
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from src.core.database import Base, get_db
from src.core.dependencies import get_storage, get_upscaler
from src.infra.storage.base import BaseStorageProvider, StorageResult
from src.infra.upscaler.base import BaseUpscaler, UpscaleResult
from src.main import create_app

# ── In-memory SQLite ─────────────────────────────────────────────────────────

TEST_DATABASE_URL = "sqlite://"

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(autouse=True)
def setup_db():
    from src.infra.db import models  # noqa: F401
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture()
def db_session():
    session = TestSessionLocal()
    try:
        yield session
    finally:
        session.close()


# ── Fake upscaler ────────────────────────────────────────────────────────────

class FakeUpscaler(BaseUpscaler):
    @property
    def supported_models(self) -> list[str]:
        return ["realesrgan-x2plus", "realesrgan-x4plus", "realesrgan-x4-anime", "lanczos"]

    def upscale(self, input_path, output_path, model, scale, output_format):
        output_path.parent.mkdir(parents=True, exist_ok=True)
        img = Image.new("RGB", (4 * scale, 4 * scale), color=(100, 149, 237))
        img.save(output_path, format="PNG")
        return UpscaleResult(output_path=output_path, width=4 * scale, height=4 * scale)


# ── Fake storage provider ────────────────────────────────────────────────────

class FakeStorageProvider(BaseStorageProvider):
    """Writes files to tmp_path so tests stay isolated from real storage."""

    def __init__(self, base_dir: Path) -> None:
        self._base_dir = base_dir
        self._base_dir.mkdir(parents=True, exist_ok=True)

    @property
    def provider_name(self) -> str:
        return "fake"

    def save(self, data: bytes, filename: str) -> StorageResult:
        import uuid
        ext = Path(filename).suffix or ".bin"
        key = self._base_dir / f"{uuid.uuid4().hex}{ext}"
        key.write_bytes(data)
        return StorageResult(stored_key=str(key), file_size=len(data))

    def delete(self, stored_key: str) -> None:
        Path(stored_key).unlink(missing_ok=True)

    def get_local_path(self, stored_key: str) -> Path | None:
        return Path(stored_key)


# ── TestClient with overridden deps ─────────────────────────────────────────

@pytest.fixture()
def client(db_session, tmp_path, monkeypatch):
    monkeypatch.setattr("src.core.config.settings.upload_dir", tmp_path / "uploads")
    monkeypatch.setattr("src.core.config.settings.output_dir", tmp_path / "outputs")
    (tmp_path / "uploads").mkdir()
    (tmp_path / "outputs").mkdir()

    fake_storage = FakeStorageProvider(tmp_path / "uploads")

    app = create_app()

    def override_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_db
    app.dependency_overrides[get_upscaler] = lambda: FakeUpscaler()
    app.dependency_overrides[get_storage] = lambda: fake_storage

    with TestClient(app, raise_server_exceptions=True) as c:
        yield c


# ── Helpers ──────────────────────────────────────────────────────────────────

@pytest.fixture()
def sample_png_bytes() -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", (8, 8), color=(255, 0, 0)).save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture()
def uploaded_image_id(client, sample_png_bytes) -> int:
    resp = client.post(
        "/api/v1/upload",
        files={"file": ("test.png", sample_png_bytes, "image/png")},
    )
    assert resp.status_code == 201, resp.text
    return resp.json()["id"]
