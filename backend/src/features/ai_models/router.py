from fastapi import APIRouter

from src.features.ai_models.schemas import ModelListResponse
from src.features.ai_models.service import AIModelsService

router = APIRouter(prefix="/api/v1/models", tags=["models"])


@router.get("", response_model=ModelListResponse)
def list_models() -> ModelListResponse:
    """List all available AI upscaling models."""
    svc = AIModelsService()
    return ModelListResponse(models=svc.list_models())
