from fastapi import APIRouter

from src.core.config import settings
from src.features.health.schemas import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    return HealthResponse(
        status="ok",
        version="1.0.0",
        environment=settings.app_env,
    )
