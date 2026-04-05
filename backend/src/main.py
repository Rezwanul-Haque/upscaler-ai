from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.core.config import settings
from src.core.database import init_db
from src.core.exceptions import AppError
from src.features.ai_models.router import router as models_router
from src.features.health.router import router as health_router
from src.features.upload.router import router as upload_router
from src.features.upscale.router import router as upscale_router
from src.features.waitlist.router import router as waitlist_router

logging.basicConfig(
    level=logging.DEBUG if settings.app_debug else logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    init_db()
    logger.info("Database initialised.")
    logger.info("Upload dir: %s", settings.upload_dir)
    logger.info("Output dir: %s", settings.output_dir)
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title=f"{settings.brand_name} — Upscale API",
        description="Image upscaling API using AI models",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.exception_handler(AppError)
    async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})

    app.include_router(health_router)
    app.include_router(upload_router)
    app.include_router(upscale_router)
    app.include_router(models_router)
    app.include_router(waitlist_router)

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.main:app",
        host=settings.app_host,
        port=settings.app_port,
        reload=settings.app_debug,
    )
