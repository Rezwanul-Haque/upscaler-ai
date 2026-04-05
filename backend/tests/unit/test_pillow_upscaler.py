from __future__ import annotations

import io
from pathlib import Path

import pytest
from PIL import Image

from src.core.exceptions import UpscaleError
from src.infra.upscaler.providers.pillow_upscaler import PillowUpscaler


def _write_png(path: Path, w: int = 4, h: int = 4) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.new("RGB", (w, h), color=(128, 64, 32)).save(path, format="PNG")


class TestPillowUpscaler:
    def test_upscale_doubles_dimensions(self, tmp_path):
        inp = tmp_path / "input.png"
        out = tmp_path / "output.png"
        _write_png(inp, w=10, h=8)

        upscaler = PillowUpscaler()
        result = upscaler.upscale(inp, out, model="lanczos", scale=2, output_format="PNG")

        assert result.width == 20
        assert result.height == 16
        assert out.exists()

    def test_upscale_4x(self, tmp_path):
        inp = tmp_path / "input.png"
        out = tmp_path / "output.png"
        _write_png(inp, w=5, h=5)

        upscaler = PillowUpscaler()
        result = upscaler.upscale(inp, out, model="realesrgan-x4plus", scale=4, output_format="PNG")

        assert result.width == 20
        assert result.height == 20

    def test_upscale_to_jpeg(self, tmp_path):
        inp = tmp_path / "input.png"
        out = tmp_path / "output.jpg"
        _write_png(inp, w=4, h=4)

        upscaler = PillowUpscaler()
        result = upscaler.upscale(inp, out, model="lanczos", scale=2, output_format="JPG")

        assert out.exists()
        with Image.open(out) as img:
            assert img.format == "JPEG"

    def test_upscale_unsupported_model_raises(self, tmp_path):
        inp = tmp_path / "input.png"
        out = tmp_path / "output.png"
        _write_png(inp)

        upscaler = PillowUpscaler()
        with pytest.raises(UpscaleError, match="not supported"):
            upscaler.upscale(inp, out, model="unknown-model", scale=2, output_format="PNG")

    def test_upscale_missing_input_raises(self, tmp_path):
        inp = tmp_path / "nonexistent.png"
        out = tmp_path / "output.png"

        upscaler = PillowUpscaler()
        with pytest.raises(UpscaleError):
            upscaler.upscale(inp, out, model="lanczos", scale=2, output_format="PNG")

    def test_supported_models_list(self):
        upscaler = PillowUpscaler()
        assert "lanczos" in upscaler.supported_models
        assert "realesrgan-x2plus" in upscaler.supported_models
