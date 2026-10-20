## Fundamentação

Um contrato HTTP organiza a relação entre componentes que podem falhar independentemente. Método, caminho, headers, corpo e status formam partes desse contrato; JSON é apenas uma representação possível. Uma resposta 200 com um campo inesperado pode ser inválida para o consumidor, enquanto um erro 422 bem definido pode representar funcionamento correto da validação. O objetivo é tornar sucesso e falha interpretáveis sem expor detalhes internos.

No exemplo da Academy, o navegador público não chama a API Python. O projeto é um artefato de estudo executável separadamente. Essa fronteira evita confundir site estático com serviço online e permite ler todo conteúdo sem instalar Ollama. Ao estudar, siga um campo desde o modelo de entrada até o adaptador e observe quais restrições pertencem à aplicação e quais pertencem ao upstream.

## Uma fronteira entre processos

Uma chamada de função dentro de um processo compartilha memória e falhas com seu chamador. Uma API HTTP atravessa uma fronteira: há serialização, latência, autenticação quando necessária e possibilidade de perder a conexão depois de o servidor ter executado o pedido. Não trate uma API como uma função remota infalível. Defina um contrato de entrada, saída e erro antes de conectar componentes.

No exemplo da Academy, o navegador público **não chama o Ollama**. Ele apenas mostra o código. Se você executar o projeto Python localmente, um cliente chama `POST /api/chat`; o backend valida a pergunta e conversa com um endereço de Ollama definido pelo operador. Essa separação preserva a autonomia do site e permite testar o backend sem um modelo.

## Anatomia de uma requisição

Uma requisição combina método, caminho, cabeçalhos e eventualmente corpo. `Content-Type: application/json` informa o formato do corpo; não significa que os dados sejam confiáveis. O servidor ainda precisa interpretar o JSON e validar seus campos. A resposta tem um status e um corpo com esquema conhecido.

```http
POST /api/chat HTTP/1.1
Content-Type: application/json

{"message":"Explique o que é inferência."}
```

O método comunica semântica. `GET` deve recuperar uma representação sem criar efeitos solicitados pelo cliente. `POST` aceita uma operação que não é necessariamente idempotente. Repetir um pedido de geração pode produzir outra resposta e consumir novamente recursos. Não implemente retry automático indiscriminado: avalie idempotência e orçamento.

## JSON não é um schema

JSON define objetos, listas, strings, números, booleanos e null. Não define que `message` é obrigatório, que deve ter de 1 a 4.000 caracteres ou que campos extras devem ser recusados. No exemplo usamos Pydantic para estabelecer esses limites. Espaços externos são removidos e uma mensagem apenas com espaços é inválida. Campos desconhecidos retornam 422 para detectar clientes incompatíveis cedo.

```python
class ChatRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    message: str = Field(min_length=1, max_length=4000)
```

O limite por caracteres não é um limite exato de tokens. Para uma aplicação real, o orçamento final também deve considerar o tokenizer do modelo, instruções do sistema e resposta reservada. Validar entrada é necessário, mas não substitui política de uso, limite de concorrência ou defesa contra prompt injection.

## Funcionamento intermediário

A arquitetura possui duas fronteiras distintas: cliente para FastAPI e FastAPI para Ollama. O schema público não deve copiar indiscriminadamente todos os campos do fornecedor. Um adaptador traduz o contrato e permite que a aplicação mantenha respostas estáveis quando o upstream muda. Essa tradução também inclui erros, tamanho máximo e política de timeout; não basta renomear funções.

Para reproduzir a análise, abra app/models.py, app/routes/chat.py e app/integrations/ollama.py no explorador. Construa uma tabela com entrada inválida, falha de conexão, timeout e corpo upstream inesperado. Para cada caso, identifique a camada responsável e a resposta pública pretendida. O teste de contrato deve verificar esse comportamento observável, sem exigir que o modelo produza uma frase específica.

## Erros que o cliente consegue interpretar

Há três domínios de falha: entrada inválida, dependência indisponível e defeito interno. O exemplo usa 422 para o contrato de entrada, 503 para conexão recusada, 504 para timeout e 502 para status ou resposta incompatível do upstream. O cliente não recebe stack trace, host interno ou corpo bruto de erro do modelo.

Um timeout significa que o cliente deixou de esperar; não prova que a inferência parou no servidor. Dimensione timeouts junto ao tamanho das respostas e à capacidade do hardware. O exemplo não faz retry automático, porque repetir uma geração pode dobrar trabalho durante sobrecarga.

## Rastreamento do fluxo

Abra o diagrama HTTP e selecione cada etapa. O caminho real do código é `app/main.py` → `app/routes/chat.py` → `app/integrations/ollama.py`. A configuração é carregada pelo servidor, não pelo usuário da rota. Permitir que o visitante escolha um URL arbitrário de modelo criaria uma superfície de SSRF; este projeto não aceita esse parâmetro.

A validação do payload upstream também importa: um servidor responder 200 não garante que o corpo tenha o campo esperado. O adaptador verifica que `message.content` seja uma string não vazia antes de formar a resposta pública.

## Exercício reproduzível

Execute os testes do exemplo antes de iniciar o servidor. Depois, rode Uvicorn e consulte `/health`. Essa rota confirma que o processo responde; ela não consulta o Ollama. Para testar geração real, configure o Ollama, baixe um modelo licenciado e envie uma pergunta com curl conforme o README do projeto.

Experimente enviar uma string vazia, um campo extra e um corpo acima do limite. Compare os erros com uma falha de conexão do Ollama. Observe por que um teste que apenas verifica uma porta aberta não prova que a integração funciona.

## Quando usar e o que falta em produção

Esse contrato é adequado para estudar uma integração HTTP pequena e explícita. Exposição pública requer limites de tráfego, autorização quando aplicável, observabilidade com cuidado com dados pessoais e controle do custo computacional. TLS termina em infraestrutura apropriada. Nada disso exige que a biblioteca estática da Academy tenha um backend.

## Análise avançada

Idempotência é uma propriedade da semântica da operação, não um efeito de usar JSON. Repetir uma requisição que dispara uma ação pode duplicar efeitos se a conexão caiu depois da execução. Mesmo inferência sem escrita pode duplicar consumo de recursos. Uma política de retry precisa considerar prazo restante, classificação da falha e suporte do destino a identificadores de operação.

Autenticar identifica uma entidade; autorizar decide se ela pode executar a ação sobre aquele recurso. Validação de tipo não faz nenhuma das duas coisas. O exemplo Python não implementa autenticação e não deve ser anunciado como uma API pública pronta para dados privados. Restringir tamanho de mensagem tampouco limita automaticamente filas, memória de modelo ou número de requisições simultâneas.

O código real está no [contrato público](/projetos/fastapi-ollama?file=app/models.py) e nos [testes HTTP](/projetos/fastapi-ollama?file=tests/test_chat.py). Compare com [produção e evals](/capitulos/producao-evals) para transformar limites do exemplo em requisitos. Um teste com MockTransport verifica tradução de protocolo; não comprova conectividade, capacidade ou qualidade de um servidor Ollama real.
