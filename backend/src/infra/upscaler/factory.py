from __future__ import annotations

from src.core.config import settings
from src.core.exceptions import AppError
from src.infra.upscaler.base import BaseUpscaler

# Registry maps the ENV value to a lazy import so unused providers
# are never imported (avoids hard deps on unavailable libraries).
_PROVIDERS: dict[str, str] = {
    "pillow": "src.infra.upscaler.providers.pillow_upscaler.PillowUpscaler",
}


def _load(dotted_path: str) -> type[BaseUpscaler]:
    module_path, class_name = dotted_path.rsplit(".", 1)
    import importlib
    module = importlib.import_module(module_path)
    return getattr(module, class_name)


def get_upscaler_provider() -> BaseUpscaler:
    """
    Resolve and instantiate the upscaler provider configured via
    the UPSCALER_PROVIDER environment variable (default: pillow).

    To add a new provider:
      1. Implement BaseUpscaler in src/infra/upscaler/providers/<name>.py
      2. Add an entry to _PROVIDERS above
      3. Set UPSCALER_PROVIDER=<name> in your .env
    """
    name = settings.upscaler_provider.lower().strip()

    if name not in _PROVIDERS:
        available = ", ".join(sorted(_PROVIDERS))
        raise AppError(
            f"Unknown upscaler provider '{name}'. Available: {available}",
            status_code=500,
        )

    cls = _load(_PROVIDERS[name])
    return cls()
