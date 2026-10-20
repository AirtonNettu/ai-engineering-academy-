from contextlib import asynccontextmanager
import httpx
from fastapi import FastAPI
from app.config import Settings
from app.integrations.ollama import OllamaService
from app.routes.chat import router


def create_app(settings: Settings | None = None,
               transport: httpx.AsyncBaseTransport | None = None) -> FastAPI:
    config = settings if settings is not None else Settings.from_env()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        async with httpx.AsyncClient(base_url=str(config.base_url),
                                    timeout=config.timeout_seconds,
                                    transport=transport,
                                    follow_redirects=False) as client:
            app.state.ollama = OllamaService(client, config.model)
            yield

    app = FastAPI(title="Academy — FastAPI + Ollama", lifespan=lifespan)
    app.include_router(router)

    @app.get("/health")
    async def health() -> dict[str, str]:
        return {"status": "ok"}

    return app
