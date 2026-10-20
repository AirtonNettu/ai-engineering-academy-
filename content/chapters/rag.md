## O problema que RAG resolve

Retrieval-Augmented Generation combina recuperação de informações com geração condicionada a essas informações. O modelo recebe trechos relevantes junto à pergunta. A arquitetura permite atualizar a base documental sem treinar novamente o modelo e apresentar fontes rastreáveis. Isso não elimina alucinações: um sistema pode recuperar o documento errado, ignorar o correto ou produzir uma conclusão que a fonte não sustenta.

Comece com um domínio delimitado e perguntas reais. Uma base de manuais internos tem requisitos diferentes de um buscador aberto na web. Defina quem pode ver cada documento antes de indexar; permissões devem participar da recuperação, não ser adicionadas depois que o texto já chegou ao modelo.

## Duas fases distintas

A ingestão prepara documentos: coleta autorizada, extração, normalização, divisão e indexação. A consulta recebe uma pergunta, recupera candidatos, seleciona evidências e constrói um prompt com orçamento limitado. Confundir as fases leva a refazer embeddings de toda a base em cada pergunta ou a retornar conteúdo removido.

Cada trecho deve carregar identificador estável, documento de origem, versão, seção, data e permissões. Um vetor sozinho não permite citar nem apagar corretamente o conteúdo. Documentos atualizados precisam invalidar versões antigas de forma previsível.

## Dividir sem destruir o significado

Chunks muito curtos perdem contexto; muito longos diluem sinais e gastam tokens. Dividir por títulos e parágrafos costuma preservar fronteiras semânticas melhor que cortar cegamente por caracteres. Sobreposição pode ajudar na continuidade, mas também cria duplicatas na recuperação.

O tamanho deve ser avaliado com o tokenizer e perguntas do domínio. Inclua no teste perguntas cuja resposta cruza duas seções, perguntas com siglas e termos exatos e perguntas sem resposta na base. O sistema deve poder declarar insuficiência de evidência.

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
