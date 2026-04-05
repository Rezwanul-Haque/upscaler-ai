from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.core.database import Base


class ImageRecord(Base):
    """Stores metadata for an uploaded image."""

    __tablename__ = "images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    content_type: Mapped[str] = mapped_column(String(100), nullable=False)
    file_path: Mapped[str] = mapped_column(String(1024), nullable=False)
    file_size: Mapped[int] = mapped_column(Integer, nullable=False)
    width: Mapped[int | None] = mapped_column(Integer, nullable=True)
    height: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    jobs: Mapped[list[UpscaleJob]] = relationship("UpscaleJob", back_populates="image", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<ImageRecord id={self.id} filename='{self.filename}'>"


class UpscaleJob(Base):
    """Tracks the lifecycle of a single upscale job."""

    __tablename__ = "upscale_jobs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    image_id: Mapped[int] = mapped_column(Integer, ForeignKey("images.id"), nullable=False)
    model: Mapped[str] = mapped_column(String(100), nullable=False)
    scale: Mapped[int] = mapped_column(Integer, nullable=False, default=2)
    output_format: Mapped[str] = mapped_column(String(10), nullable=False, default="PNG")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    progress: Mapped[float] = mapped_column(Float, default=0.0)
    output_path: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    output_width: Mapped[int | None] = mapped_column(Integer, nullable=True)
    output_height: Mapped[int | None] = mapped_column(Integer, nullable=True)
    error_message: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    started_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    image: Mapped[ImageRecord] = relationship("ImageRecord", back_populates="jobs")

    def __repr__(self) -> str:
        return f"<UpscaleJob id={self.id} status='{self.status}'>"


class WaitlistEntry(Base):
    """Stores emails from the waitlist / join-queue form."""

    __tablename__ = "waitlist"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(320), nullable=False, unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<WaitlistEntry id={self.id} email='{self.email}'>"
