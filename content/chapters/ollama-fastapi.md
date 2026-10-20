## O que este projeto realmente executa

O projeto em `examples/fastapi-ollama` expõe uma API Python que encaminha uma mensagem para `/api/chat` do Ollama e devolve um texto. Ele é executável localmente, mas não está hospedado como serviço público da Academy. O explorador permite estudar todos os arquivos mesmo com o Ollama desligado.

Os testes substituem somente o transporte externo. Eles comprovam o contrato HTTP e o tratamento de falhas, não a qualidade de respostas de um modelo. Para geração real, é preciso instalar Ollama e disponibilizar um modelo adequado ao hardware e à licença desejada.

## Contrato público mínimo

O endpoint aceita `message` não vazio com até 4.000 caracteres e recusa campos extras. A resposta tem `answer` e `model`. Não há histórico implícito: duas chamadas são independentes. O modelo é configuração do servidor, não uma entrada controlada pelo visitante.

```bash
curl --fail-with-body http://127.0.0.1:8000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"Qual é a diferença entre RAG e fine-tuning?"}'
```

Esse comando só retorna uma resposta de geração se a API e o Ollama estiverem em execução. `/health` responde independentemente do Ollama e deve ser entendido como liveness do backend.

## Composição da aplicação

`create_app` recebe configurações e, opcionalmente, um transporte HTTP. Em produção local usa o transporte padrão; nos testes recebe `MockTransport`. O lifespan cria e fecha o `AsyncClient`. A rota consulta o serviço conectado à aplicação, mantendo uma única política de conexão e timeout.

A injeção fica na borda de composição. Isso evita flags de teste dentro do adaptador e permite verificar o corpo realmente enviado ao upstream. Não há necessidade de um contêiner de dependências complexo para esse escopo.

## Adaptador do protocolo

O adaptador envia `model`, `messages` e `stream: false`. Desativar streaming é uma decisão de contrato: a API entrega uma resposta JSON completa. Suportar streaming requer tratar eventos, desconexão do cliente e falhas após parte da resposta já ter sido enviada.

O cliente valida status e corpo da resposta. JSON quebrado, ausência de `message.content`, tipo diferente de string ou resposta vazia se tornam falha de upstream. O backend não entrega uma mensagem falsa de sucesso para esconder a falha.

## Falhas previsíveis

Timeout gera 504; erro de conexão gera 503; erro HTTP ou schema upstream gera 502. As mensagens públicas são estáveis e não incluem detalhes internos. O exemplo não faz retry porque não pode assumir que uma chamada de geração interrompida não foi processada.

Em um sistema maior, você pode adicionar circuit breaker, fila e limite de concorrência depois de medir a carga. Um timeout longo por si só não resolve saturação e pode aumentar o número de pedidos presos em memória.

## Configuração local

Crie um ambiente virtual, instale `requirements.txt` e rode pytest. Em seguida configure `OLLAMA_BASE_URL`, `OLLAMA_MODEL` e `OLLAMA_TIMEOUT_SECONDS` se precisar de valores diferentes dos padrões. Execute Uvicorn a partir da pasta do exemplo, conforme o README.

Não exponha a porta administrativa do Ollama à internet para usar este projeto. Coloque a aplicação e o modelo em uma rede apropriada. Permitir URLs de destino arbitrários no payload seria uma alteração de segurança importante e não faz parte do contrato.

## Percurso de estudo

Comece pelos testes: observe qual corpo a aplicação aceita e quais falhas mapeia. Abra `app/models.py`, depois a rota e finalmente o adaptador. Use o diagrama para retornar da integração ao contrato de entrada. A árvore exibe os arquivos reais do exemplo, incluindo configurações e testes.

Para estender o projeto com histórico, primeiro defina limite de mensagens, política de truncamento e proteção de dados. Para adicionar ferramentas, defina quais ações podem ocorrer, quem autoriza e como limitar argumentos. Um LLM sugerir uma ação nunca deve equivaler automaticamente a permissão para executá-la.
