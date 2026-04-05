from src.features.ai_models.service import AIModelsService


class TestAIModelsService:
    def test_list_returns_all_models(self):
        svc = AIModelsService()
        models = svc.list_models()
        assert len(models) >= 3

    def test_models_have_required_fields(self):
        svc = AIModelsService()
        for model in svc.list_models():
            assert model.id
            assert model.name
            assert model.scale >= 2
            assert model.category in ("general", "anime")

    def test_known_model_present(self):
        svc = AIModelsService()
        ids = [m.id for m in svc.list_models()]
        assert "realesrgan-x2plus" in ids
        assert "lanczos" in ids
