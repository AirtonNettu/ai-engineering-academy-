# Cobertura editorial da Issue #2

Revisão editorial: 2026-10-20. Conteúdo autoral em pt-BR, 15 capítulos publicados, sem títulos vazios. A profundidade de leitura não corresponde à senioridade profissional.

## Preservação e camadas

Os seis slugs anteriores permanecem, assim como todos os seus headings e textos. Foram acrescentadas explicações às três camadas: `fundamentacao`, `funcionamento-intermediario`, `analise-avancada`. Verificação contra HEAD confirmou 7 headings antigos em HTTP, Python, RAG e Ollama; 8 em LLM e segurança. O catálogo fornece `depths`, `labs` e `implementation` para todas as leituras. Os nove capítulos novos têm aproximadamente 790–835 palavras cada; os seis ampliados, aproximadamente 1.000–1.115 palavras. Contagens não substituem revisão semântica.

| Capítulo               | Cobertura principal                                                                          | Implementação real relacionada                          | Arquitetura                 |
| ---------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------- | --------------------------- |
| http-apis              | HTTP, JSON, contratos, erros, idempotência, autorização                                      | modelos e testes FastAPI                                | HTTP                        |
| python-backend         | Python, async, composição, dependências, testes                                              | create_app e adaptador                                  | HTTP                        |
| llm-inferencia         | tokens, tokenizer, embeddings, contexto, logits, amostragem                                  | laboratório attention                                   | LLM                         |
| rag                    | evidência, ingestão, consulta, chunking, avaliação                                           | cosseno/ranking didáticos                               | RAG                         |
| ollama-fastapi         | Ollama, FastAPI, timeout, validação, configuração                                            | adaptador e testes Python                               | HTTP                        |
| seguranca-avaliacao    | limites, privacidade, prompt injection, automação editorial                                  | testes de contrato Python                               | RAG                         |
| redes-neurais          | neurônio, pesos, vieses, ativações, loss, gradientes, backprop                               | rede pequena JS/TS                                      | Treinamento da rede pequena |
| treinamento-avaliacao  | datasets, splits, batches, epochs, PyTorch, SGD/Adam, overfitting                            | rede pequena JS/TS e trecho PyTorch explicado           | Treinamento da rede pequena |
| attention-transformers | Q/K/V, self/cross-attention, softmax, máscara, cabeças, posição                              | attention JS/TS                                         | LLM                         |
| embeddings-busca       | cosseno, vector DB, índices, chunking, busca híbrida, reranking                              | embeddings JS/TS                                        | RAG                         |
| inferencia-eficiente   | prefill, decode, temperatura, top-p, contexto, KV cache, quantização, batching               | adaptador de inferência HTTP                            | LLM, HTTP                   |
| mcp-agentes            | host/client/server MCP, tools, estado, orquestração, auth, observabilidade                   | adaptador como exemplo de fronteira; não implementa MCP | MCP/agentes, HTTP           |
| rag-finetuning         | API versus treinamento, RAG versus fine-tuning, LoRA, custo e privacidade                    | cosseno/ranking; não executa fine-tuning                | RAG, LLM                    |
| producao-evals         | evals não determinísticos, hallucinations, logs, custo, filas, rollback, backend/dados/cloud | testes e adaptador; não é plataforma distribuída        | HTTP, RAG, agentes          |
| carreira-ai-engineer   | Software/Application/ML/Research/Operations, autonomia, impacto, mentoria e contexto         | contrato de API como entregável analisável              | HTTP, LLM                   |

Linux, SQL, Docker, cloud, kernels de atenção, serving distribuído e treinamento de grande porte aparecem como contexto e limites de projeto; não são cursos completos nem recursos operacionais implementados. Novos capítulos remetem aos laboratórios ou ao exemplo de código existente com explicação precisa do que essa implementação demonstra. As fórmulas usam notação textual acessível, com variáveis e hipóteses explicadas; não exigem renderizador matemático externo.

## Flashcards e trilhas

`content/flashcards.json` contém 45 cartões autorais: um básico, um intermediário e um avançado para cada capítulo. Frente, resposta, capítulo, dificuldade, fonte HTTPS e data de revisão são explícitos. Não são apresentados como cartões gerados por IA ou evidência de retenção. O catálogo/glossário inclui termos adicionais e tags pesquisáveis para as novas leituras.

Quatro roadmaps preservam os ids `application`, `operations`, `models` e acrescentam `research`. As posições e títulos de todas as etapas anteriores permanecem, preservando queries `trilha`/`etapa`; `nivel` acrescenta senioridade sem apagar a etapa. Todas as etapas têm leituras. Cada especialidade possui níveis júnior/pleno/sênior com pré-requisitos, responsabilidades, entregáveis, capítulos e labs. As descrições declaram que contexto organizacional e autonomia prevalecem sobre checklists de tecnologias.

## Fontes e limites de validação

Referências principais: documentação oficial PyTorch, Transformers/PEFT, FastAPI, Ollama, MCP, OWASP GenAI; artigos originais de Attention (arXiv 1706.03762) e RAG (arXiv 2005.11401); Sentence Transformers. URLs individuais ficam nos metadados dos capítulos e em links contextuais. Fontes anteriores foram preservadas.

Validação nesta tarefa: URLs com esquema HTTPS, estrutura do catálogo e links internos/âncoras foram verificados localmente. Tentativas de consulta via curl às páginas de otimização PyTorch, tutorial LLM Hugging Face, arquitetura MCP e prompt injection OWASP falharam no ambiente (exit 56). Portanto disponibilidade, conteúdo remoto atual e redirects dessas fontes não foram validados online nesta revisão. Não há alegação de leitura remota bem-sucedida nem benchmark de produção ou treino de LLM executado nesta tarefa. As referências são identificadores técnicos conhecidos e devem ser revisitadas em revisões editoriais futuras.

## Evidências locais

- Testes de cobertura escritos antes dos dados: três falhas observadas por apenas seis capítulos, ausência de flashcards e ausência de research.
- `npx vitest run src/test/advanced-content.test.ts`: cinco testes aprovados após implementação, incluindo seleção de senioridade preservando a etapa e seleção da trilha de pesquisa com link funcional de laboratório.
- `npm run validate:content`: 15 capítulos, quatro trilhas e 17 recursos válidos.
- `npx tsc -b` e lint dos arquivos TypeScript desta tarefa: aprovados.
- Formatação restrita aos arquivos de propriedade desta tarefa. A integração raiz executa check global e Playwright, necessários antes de declarar a entrega completa da Issue #2.
