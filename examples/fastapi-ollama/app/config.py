import os
from pydantic import BaseModel, Field, HttpUrl, field_validator


class Settings(BaseModel):
    base_url: HttpUrl = HttpUrl("http://127.0.0.1:11434")
    model: str = Field(default="llama3.2:3b", min_length=1, max_length=200)
    timeout_seconds: float = Field(default=60, gt=0, le=300)

    @field_validator("model")
    @classmethod
    def nonblank_model(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("model não pode ser vazio")
        return value.strip()

    @classmethod
    def from_env(cls) -> "Settings":
        return cls(
            base_url=os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434"),
            model=os.getenv("OLLAMA_MODEL", "llama3.2:3b"),
            timeout_seconds=os.getenv("OLLAMA_TIMEOUT_SECONDS", "60"),
        )
