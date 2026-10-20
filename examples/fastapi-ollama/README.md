# API educacional — FastAPI + Ollama

Integração executável independente do site. Python 3.12+. Nenhuma chave de API necessária. O site apenas exibe os arquivos; não executa este backend.

## Instalação e testes sem Ollama

A partir de `examples/fastapi-ollama`:

```bash
python -m venv .venv
. .venv/bin/activate
python -m pip install -r requirements.txt
python -m pytest -q
```

Os testes executam a API real com MockTransport na fronteira do Ollama. Nenhum modelo é baixado. Dependências transitivas da sessão de validação estão em requirements.lock.txt; para reproduzir exatamente, use esse arquivo em vez de requirements.txt. Starlette é fixado para manter o contrato TestClient/HTTPX desta implementação.

## Servidor local

```bash
python -m uvicorn app.main:create_app --factory --host 127.0.0.1 --port 8000
curl --fail http://127.0.0.1:8000/health
```

`/health` só verifica liveness. `/docs` contém OpenAPI interativo. Não prova que Ollama está online.

## Inferência real (opcional, não necessária para leitura/testes)

Instale Ollama pela documentação oficial https://docs.ollama.com/ e verifique os requisitos de hardware e licença. Com Ollama instalado localmente:

```bash
ollama pull llama3.2:3b
# Em um terminal separado, se Ollama não estiver como serviço:
ollama serve
# Inicie a API em outro terminal e chame:
curl --fail-with-body http://127.0.0.1:8000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"Explique inferência em uma frase."}'
```

Configuração por variáveis exportadas antes de iniciar Uvicorn: `OLLAMA_BASE_URL` (padrão http://127.0.0.1:11434), `OLLAMA_MODEL` (llama3.2:3b), `OLLAMA_TIMEOUT_SECONDS` (60, maior que 0 e até 300). `.env.example` é referência; não há carregamento automático. Use somente hosts confiáveis sob seu controle. Nunca exponha Ollama ou serviços administrativos ao público.

## Contrato e limites

POST `/api/chat`: JSON com `message` string não vazia de até 4.000 caracteres; espaços externos removidos, campos extras proibidos. Resposta: `answer` e `model`. 422 entrada inválida; 503 falha de conexão; 504 timeout; 502 status/corpo upstream inválido. Sem streaming, retry, histórico, persistência, ferramentas ou autenticação. Timeout não garante cancelamento da inferência no servidor.

`main.py` compõe e fecha conexões; `config.py` valida ambiente; `models.py` define contratos; `routes/chat.py` traduz HTTP; `integrations/ollama.py` conhece o protocolo externo; `tests/test_chat.py` testa integração com mocks.

Este exemplo não é um serviço público endurecido. Exposição real requer revisão de limites de tráfego/concorrência, TLS, proteção de dados e política de autorização. Os testes mockados não medem qualidade do modelo nem validam hardware real.

Referências: https://fastapi.tiangolo.com/ ; https://www.python-httpx.org/ ; https://docs.ollama.com/api/chat
