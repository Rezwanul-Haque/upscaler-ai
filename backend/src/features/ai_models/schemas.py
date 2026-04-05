from pydantic import BaseModel


class ModelResponse(BaseModel):
    id: str
    name: str
    description: str
    scale: int
    category: str


class ModelListResponse(BaseModel):
    models: list[ModelResponse]
