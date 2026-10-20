## Fundamentação

Integrar um modelo é construir uma fronteira de software, não apenas fazer uma chamada de rede. O consumidor precisa saber o formato aceito, os limites, os erros possíveis e o significado da resposta. O projeto usa FastAPI para validar entrada e Ollama como destino configurado pelo operador. A Academy pública não hospeda esse backend nem envia suas leituras a um modelo.

Ollama permite executar modelos conforme ambiente, hardware e licença de cada artefato. Isso não implica que todo computador tenha memória suficiente nem que toda licença permita qualquer uso. O exemplo evita presumir um modelo universal: configuração fica no servidor e é validada. A aplicação não aceita uma URL de upstream arbitrária fornecida no corpo da mensagem.

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

## Funcionamento intermediário

Uma requisição atravessa modelos de entrada, rota, serviço e transporte. O adaptador conhece o payload do Ollama e verifica o corpo recebido. A rota traduz erros conhecidos para respostas públicas. Essa divisão permite testar o contrato sem iniciar um modelo e impede que detalhes do fornecedor vazem por todas as camadas.

Ao ler o código, acompanhe stream: false e o prazo de timeout. O projeto espera uma resposta completa; não possui streaming implementado por apenas usar um endpoint que o suportaria. O cliente HTTP também precisa ser encerrado no ciclo de vida da aplicação. Reutilização de conexão e validação de saída são partes da integração, não otimizações cosméticas.

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

## Análise avançada

Timeout não elimina a possibilidade de trabalho continuar no upstream. Se a conexão se perde, a aplicação pode não saber se o servidor concluiu a geração. Retry precisa de orçamento e classificação de falhas para não multiplicar custo e latência. O exemplo não implementa fila distribuída ou cancelamento garantido do servidor; essas seriam decisões adicionais de operação.

Configuração merece revisão de segurança. Não grave segredos no frontend, não permita redirects arbitrários e não exponha diagnósticos internos como resposta ao usuário. Se a API se tornar pública, autenticação, autorização, limites de concorrência e proteção de logs precisam ser projetados conforme o domínio. Uma demonstração local bem testada ainda não é um serviço público pronto.

A [implementação do adaptador](/projetos/fastapi-ollama?file=app/integrations/ollama.py) e os [testes com mocks](/projetos/fastapi-ollama?file=tests/test_chat.py) são artefatos reais. Siga o README para execução local; este texto não afirma ter executado Ollama nesta revisão. Continue em [inferência eficiente](/capitulos/inferencia-eficiente) e [produção e evals](/capitulos/producao-evals) para transformar os limites em um plano verificável de evolução.
