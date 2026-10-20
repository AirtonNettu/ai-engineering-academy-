## Por que separar arquivos

Separação de responsabilidades não é criar muitas pastas. É permitir que uma mudança em um protocolo externo não obrigue a reescrever o contrato público e que testes controlem as fronteiras instáveis. No exemplo, a rota HTTP conhece o modelo de entrada e o serviço de geração; o adaptador conhece o formato de `/api/chat` do Ollama; a configuração conhece variáveis de ambiente.

`main.py` é a raiz de composição: cria o cliente HTTP, conecta o serviço às rotas e controla o fechamento de conexões pelo lifespan do FastAPI. Essa é uma dependência explícita. Nenhum import inicia um servidor remoto ou baixa um modelo.

## Tipos ajudam, validação protege fronteiras

Anotações de tipo são verificadas por ferramentas, mas Python não rejeita toda entrada errada em tempo de execução. Pydantic valida dados da API; HTTPX trata transporte; testes verificam comportamento. Cada mecanismo responde a uma pergunta diferente. Não confunda um type check verde com a garantia de que um servidor respondeu conforme o schema.

```python
async def generate(self, message: str) -> str:
    response = await self.client.post(
        "/api/chat",
        json={"model": self.model, "stream": False,
              "messages": [{"role": "user", "content": message}]},
    )
```

O método retorna uma string porque o protocolo upstream já foi traduzido nessa camada. A rota não precisa saber onde `message.content` vive no JSON. Isso diminui o acoplamento à implementação do Ollama.

## Async é cooperação, não magia

`async def` permite suspender a tarefa enquanto aguarda I/O. O event loop executa outras tarefas nesse intervalo. Uma função síncrona pesada chamada dentro de `async def` ainda pode bloquear o processo. A inferência acontece no serviço Ollama; o backend aguarda a resposta HTTP. Se você colocar um cálculo pesado de CPU na rota, precisa de outra estratégia, como processos de trabalho.

Um `AsyncClient` compartilhado pelo lifespan reutiliza conexões. Criar um cliente por token ou por função intermediária desperdiça conexões e dificulta encerramento. O exemplo mantém um cliente por aplicação, fecha-o ao terminar e usa injeção de transporte nos testes.

## Testar sem rede real

Um mock útil substitui uma fronteira externa, não a lógica que queremos provar. Os testes usam `httpx.MockTransport` para responder a pedidos ao Ollama e `TestClient` para chamar a aplicação. Assim, validação, serialização, rota, serviço e mapeamento de erros executam de verdade.

Testamos sucesso, conteúdo vazio, campos extras, timeout, conexão recusada, status HTTP de erro e JSON incompatível. Não testamos qualidade semântica da resposta de um modelo: o mock não tem essa capacidade. Essa distinção evita apresentar uma integração determinística como avaliação de IA.

## Configuração e ciclo de vida

`OLLAMA_BASE_URL`, `OLLAMA_MODEL` e `OLLAMA_TIMEOUT_SECONDS` são lidos no servidor. O URL precisa ter esquema HTTP/HTTPS válido e o timeout deve ser positivo e limitado. Os valores padrão servem ao estudo local. Variáveis são configuradas antes de iniciar Uvicorn; o navegador não recebe esses valores.

O exemplo não depende de dotenv implicitamente. O README mostra como exportar variáveis ou usar os padrões. Isso torna a ordem de configuração visível e evita que um arquivo secreto seja carregado por acidente.

## Navegue pelo código

No explorador, selecione `app/models.py` para o contrato; `app/routes/chat.py` para o endpoint; `app/integrations/ollama.py` para o protocolo externo; e `tests/test_chat.py` para as expectativas executáveis. O conteúdo exibido é importado dos mesmos arquivos que são testados. Não há uma segunda cópia de exemplo que possa divergir.

## Limitações deliberadas

Não há histórico de conversa, ferramentas, persistência, autenticação ou streaming. Isso mantém o caminho de dados auditável. Adicionar histórico exige política de contexto e retenção; adicionar ferramentas exige autorização por ação; adicionar streaming exige contrato de eventos, cancelamento e tratamento de falhas parciais.

Ao evoluir o projeto, mantenha os testes da fronteira pública e altere primeiro o contrato quando o comportamento precisar mudar. Abstrações só justificam sua existência quando isolam uma variação real.
