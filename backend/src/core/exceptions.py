from __future__ import annotations


class AppError(Exception):
    """Base application error."""
    def __init__(self, message: str, status_code: int = 500) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class NotFoundError(AppError):
    def __init__(self, resource: str, resource_id: int | str) -> None:
        super().__init__(f"{resource} with id '{resource_id}' not found.", status_code=404)


class ValidationError(AppError):
    def __init__(self, message: str) -> None:
        super().__init__(message, status_code=422)


class ConflictError(AppError):
    def __init__(self, message: str) -> None:
        super().__init__(message, status_code=409)


class StorageError(AppError):
    def __init__(self, message: str) -> None:
        super().__init__(message, status_code=500)


class UpscaleError(AppError):
    def __init__(self, message: str) -> None:
        super().__init__(message, status_code=500)
