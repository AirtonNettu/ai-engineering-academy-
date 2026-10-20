import httpx


class ServiceError(Exception):
    def __init__(self, status: int, detail: str):
        self.status = status
        self.detail = detail
        super().__init__(detail)


class OllamaService:
    def __init__(self, client: httpx.AsyncClient, model: str):
        self.client = client
        self.model = model

    async def generate(self, message: str) -> str:
        try:
            response = await self.client.post(
                "/api/chat",
                json={"model": self.model, "stream": False,
                      "messages": [{"role": "user", "content": message}]},
            )
            response.raise_for_status()
            answer = response.json()["message"]["content"]
            if not isinstance(answer, str) or not answer.strip():
                raise ValueError("Conteúdo ausente")
            return answer
        except httpx.TimeoutException as exc:
            raise ServiceError(504, "Tempo limite do serviço de modelo excedido.") from exc
        except httpx.RequestError as exc:
            raise ServiceError(503, "Serviço de modelo indisponível.") from exc
        except (httpx.HTTPStatusError, ValueError, KeyError, TypeError) as exc:
            raise ServiceError(502, "Resposta inválida do serviço de modelo.") from exc
