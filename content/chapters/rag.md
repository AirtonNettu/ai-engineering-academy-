## Fundamentação

RAG é uma arquitetura que recupera informações e as fornece ao modelo durante geração. O componente de busca encontra candidatos; a aplicação escolhe evidências e monta contexto; o modelo produz uma resposta. Cada etapa tem falhas próprias. Recuperar um trecho parecido com a pergunta não prova que ele contém a resposta, está atualizado ou pode ser mostrado ao usuário.

Pense em uma política interna com condições e exceções. Um chunk que contém apenas a condição pode produzir uma resposta incompleta; outro documento pode ter sido substituído por uma versão recente. Manter origem, versão e escopo de acesso é tão importante quanto escolher embeddings. Uma arquitetura de RAG útil inclui abstenção e mecanismos de correção, em vez de prometer ausência de hallucinations.

## O problema que RAG resolve

Retrieval-Augmented Generation combina recuperação de informações com geração condicionada a essas informações. O modelo recebe trechos relevantes junto à pergunta. A arquitetura permite atualizar a base documental sem treinar novamente o modelo e apresentar fontes rastreáveis. Isso não elimina alucinações: um sistema pode recuperar o documento errado, ignorar o correto ou produzir uma conclusão que a fonte não sustenta.

Comece com um domínio delimitado e perguntas reais. Uma base de manuais internos tem requisitos diferentes de um buscador aberto na web. Defina quem pode ver cada documento antes de indexar; permissões devem participar da recuperação, não ser adicionadas depois que o texto já chegou ao modelo.

## Duas fases distintas

A ingestão prepara documentos: coleta autorizada, extração, normalização, divisão e indexação. A consulta recebe uma pergunta, recupera candidatos, seleciona evidências e constrói um prompt com orçamento limitado. Confundir as fases leva a refazer embeddings de toda a base em cada pergunta ou a retornar conteúdo removido.

Cada trecho deve carregar identificador estável, documento de origem, versão, seção, data e permissões. Um vetor sozinho não permite citar nem apagar corretamente o conteúdo. Documentos atualizados precisam invalidar versões antigas de forma previsível.

## Dividir sem destruir o significado

Chunks muito curtos perdem contexto; muito longos diluem sinais e gastam tokens. Dividir por títulos e parágrafos costuma preservar fronteiras semânticas melhor que cortar cegamente por caracteres. Sobreposição pode ajudar na continuidade, mas também cria duplicatas na recuperação.

O tamanho deve ser avaliado com o tokenizer e perguntas do domínio. Inclua no teste perguntas cuja resposta cruza duas seções, perguntas com siglas e termos exatos e perguntas sem resposta na base. O sistema deve poder declarar insuficiência de evidência.

## Funcionamento intermediário

O pipeline tem ingestão e consulta, com frequências diferentes. Na ingestão, extraia estrutura, divida documentos, mantenha metadados e produza representações compatíveis com o índice. Na consulta, aplique escopo autorizado, recupere candidatos e selecione contexto dentro do orçamento. Reranking pode melhorar a ordem, mas aumenta custo por candidato; busca híbrida ajuda quando nomes e códigos exatos escapam à similaridade semântica.

Use recall@k para investigar recuperação e uma rubrica separada para fidelidade da resposta. Se a evidência correta não foi recuperada, melhorar o prompt pode apenas mascarar o problema. Se estava presente e foi ignorada, examine seleção, ordem e instruções. Versione corpus, chunker, modelo de embeddings e configuração de busca para tornar comparações interpretáveis.

## Recuperação e ranking

Busca vetorial aproxima relevância semântica por distância no espaço de embeddings. Busca lexical preserva nomes exatos, códigos e siglas. Uma estratégia híbrida pode combinar sinais; um reranker pode refinar uma lista curta. Cada etapa tem custo e deve melhorar uma métrica observável.

```python
# Pseudocódigo arquitetural: não é uma implementação executável.
candidates = retrieve(question, filters=user_permissions)
selected = rerank(question, deduplicate(candidates))
context = fit_budget(selected, reserved_output_tokens=800)
answer = generate(question, context)
```

Esse pseudocódigo explicita responsabilidades; a Academy não afirma executar uma base vetorial. O diagrama é uma simulação didática dos estágios, não uma busca real.

## Montagem de contexto

Reserve espaço para instruções, pergunta e saída. Delimite documentos como dados, atribua ids de citação e oriente o modelo a sinalizar ausência de evidência. Nunca trate instruções encontradas em um PDF como comandos do sistema. Um documento malicioso pode tentar mudar a tarefa ou pedir exfiltração.

Citações também precisam ser verificadas: um id de fonte existente não garante que o trecho citado apoie a frase. Para domínios críticos, associe afirmações a passagens e faça revisão humana proporcional ao risco.

## Avaliar cada fronteira

Use um conjunto versionado com pergunta, documentos esperados e critérios de resposta. Recall@k mede se evidências relevantes chegaram aos candidatos. Precisão de contexto mede quanto ruído é enviado. Fidelidade da resposta considera apoio nas fontes; correção final considera a tarefa do usuário. Uma resposta boa por conhecimento prévio pode esconder recuperação ruim.

Mantenha casos sem resposta. Se toda pergunta de teste tem solução na base, você não mede a capacidade de abster-se. Registre latência e orçamento de tokens ao lado das métricas de qualidade; melhorias que multiplicam custo podem ser inadequadas.

## Limitações e operação

Índices ficam desatualizados, embeddings mudam e permissões evoluem. Trocar o modelo de embeddings geralmente exige reindexar o corpus, mesmo quando a dimensão permanece igual. Exclusão e retenção devem ser testadas. Dados pessoais podem aparecer tanto nos vetores quanto nos textos e logs.

Uma implementação pequena pode começar com busca lexical local antes de adotar um banco vetorial. Use complexidade adicional quando testes demonstrarem benefício. Nesta plataforma, a pesquisa de leitura é lexical e local; ela não envia suas consultas a um LLM.

## Análise avançada

Autorização deve limitar evidências antes de entrar no contexto. Filtrar somente a resposta final permite que o modelo veja conteúdo indevido e não constitui isolamento. Resultados recuperados também podem conter instruções maliciosas; trate-os como dados, sem conceder capacidade de alterar políticas ou chamar ferramentas. A aplicação mantém autoridade sobre permissões e ações.

Atualização de corpus exige lidar com exclusões, duplicatas, índices antigos e caches. Uma fonte removida da interface pode continuar em chunks derivados se o pipeline não propagar a exclusão. Registre ids de origem e versões para auditar esse percurso. Esses controles não aparecem automaticamente ao instalar um banco vetorial.

No [Embedding Explorer](/laboratorios/embeddings?codigo=1), a implementação real cobre cosseno e ranking de vetores didáticos, sem afirmar ingestão de um corpus de produção. Relacione-a ao [atlas RAG](/arquiteturas?diagrama=rag), depois leia [embeddings e busca](/capitulos/embeddings-busca) e [RAG versus fine-tuning](/capitulos/rag-finetuning). Um plano de avaliação deve incluir consultas sem resposta e documentos adversariais, não apenas demonstrações escolhidas para dar certo.
