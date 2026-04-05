from __future__ import annotations

from src.features.ai_models.schemas import ModelResponse
from src.infra.upscaler.registry import list_models


class AIModelsService:
    def list_models(self) -> list[ModelResponse]:
        return [
            ModelResponse(
                id=m.id,
                name=m.name,
                description=m.description,
                scale=m.scale,
                category=m.category.value,
            )
            for m in list_models()
        ]
