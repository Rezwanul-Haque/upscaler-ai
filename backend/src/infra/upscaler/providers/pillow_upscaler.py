from __future__ import annotations

from pathlib import Path

from PIL import Image

from src.core.config import settings
from src.core.exceptions import UpscaleError
from src.infra.upscaler.base import BaseUpscaler, UpscaleResult

_SUPPORTED_MODELS = [
    "pillow-lanczos",
]

_FORMAT_MAP = {
    "PNG": "PNG",
    "JPG": "JPEG",
    "JPEG": "JPEG",
    "WEBP": "WEBP",
}


class PillowUpscaler(BaseUpscaler):
    """
    Pillow-based upscaler using LANCZOS resampling.

    This is the default implementation that works without any GPU or
    binary dependencies. It can be swapped for an NCNN-based upscaler
    by replacing the dependency in src/core/dependencies.py.
    """

    @property
    def supported_models(self) -> list[str]:
        return _SUPPORTED_MODELS

    def upscale(
        self,
        input_path: Path,
        output_path: Path,
        model: str,
        scale: int,
        output_format: str,
    ) -> UpscaleResult:
        if model not in _SUPPORTED_MODELS:
            raise UpscaleError(f"Model '{model}' is not supported by PillowUpscaler.")

        pil_format = _FORMAT_MAP.get(output_format.upper(), "PNG")

        try:
            with Image.open(input_path) as img:
                # Convert to RGB for JPEG compatibility
                if pil_format == "JPEG" and img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")

                new_w = img.width * scale
                new_h = img.height * scale
                upscaled = img.resize((new_w, new_h), Image.LANCZOS)

                output_path.parent.mkdir(parents=True, exist_ok=True)
                save_kwargs: dict = {}
                if pil_format == "JPEG":
                    save_kwargs["quality"] = 95
                upscaled.save(output_path, format=pil_format, **save_kwargs)

                return UpscaleResult(output_path=output_path, width=new_w, height=new_h)
        except OSError as exc:
            raise UpscaleError(f"Failed to process image: {exc}") from exc
