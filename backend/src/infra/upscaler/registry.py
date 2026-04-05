from __future__ import annotations

from dataclasses import dataclass
from enum import StrEnum


class ModelCategory(StrEnum):
    GENERAL = "general"
    ANIME = "anime"


@dataclass(frozen=True)
class AIModelInfo:
    id: str
    name: str
    description: str
    scale: int
    category: ModelCategory


AI_MODEL_REGISTRY: dict[str, AIModelInfo] = {
    "pillow-lanczos": AIModelInfo(
        id="pillow-lanczos",
        name="Pillow Lanczos",
        description="High-quality Lanczos resampling — fast, no GPU required",
        scale=2,
        category=ModelCategory.GENERAL,
    ),
}


def list_models() -> list[AIModelInfo]:
    return list(AI_MODEL_REGISTRY.values())


def get_model(model_id: str) -> AIModelInfo | None:
    return AI_MODEL_REGISTRY.get(model_id)
