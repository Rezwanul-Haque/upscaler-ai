from __future__ import annotations

from abc import ABC, abstractmethod
from pathlib import Path
from typing import Protocol


class UpscaleResult:
    def __init__(self, output_path: Path, width: int, height: int) -> None:
        self.output_path = output_path
        self.width = width
        self.height = height


class BaseUpscaler(ABC):
    """Contract every upscaler implementation must fulfil."""

    @abstractmethod
    def upscale(
        self,
        input_path: Path,
        output_path: Path,
        model: str,
        scale: int,
        output_format: str,
    ) -> UpscaleResult:
        """Upscale the image and return result metadata."""
        ...

    @property
    @abstractmethod
    def supported_models(self) -> list[str]:
        """Return list of model IDs this upscaler can handle."""
        ...
