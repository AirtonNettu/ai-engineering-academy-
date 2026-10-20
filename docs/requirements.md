# Requisitos e critérios de aceite

Fonte: prompt mestre IA Engineer Academy, recebido em 20/10/2026. Escopo sem planos artificiais de versões. Implementação organizada por tarefas no plano e commits da branch.

| Critério                    | Entrega                                          | Evidência executável                |
| --------------------------- | ------------------------------------------------ | ----------------------------------- |
| 1. Iniciar localmente       | npm ci / npm run dev                             | smoke HTTP e README                 |
| 2. Compilar                 | Vite + TS estrito                                | npm run build                       |
| 3. Desktop e smartphone     | CSS mobile, menu e layout                        | Playwright desktop/mobile, overflow |
| 4. Capítulos reais          | 15 textos pt-BR com três profundidades e fontes  | validate:content + testes do leitor |
| 5. Busca funcional          | índice local de sete tipos                       | content.test.ts + jornada E2E       |
| 6. Roadmaps                 | quatro trilhas e níveis contextualizados         | E2E de competência e capítulos      |
| 7. Diagramas                | RAG, LLM, FastAPI, agentes e treino              | ui.test.tsx + E2E de seleção        |
| 8. Árvore e código          | arquivos reais, pastas expansíveis               | E2E do explorador                   |
| 9. Responsabilidades        | metadados por arquivo, símbolos, imports e fluxo | catálogo validado e explorador      |
| 10. Skills e recursos       | 17 referências; dez categorias; skills.sh        | filtros E2E e schema                |
| 11. Sem login               | rotas públicas                                   | teste de todas as rotas             |
| 12. Sem Ollama/n8n para ler | hospedagem estática, sem conexão administrativa  | E2E sem modelos/serviços            |
| 13. Testes                  | Vitest, Playwright, axe, pytest                  | docs/testing.md                     |
| 14. Documentação            | README, AGENTS, docs e ADRs                      | repositório e formatação            |
| 15. Sem serviços pagos      | sem dependência de API/infra paga                | revisão arquitetural                |

## Requisitos adicionais

- Conteúdo: taxonomia completa de quatro áreas, disponibilidade declarada, schema, metadados e links internos validados.
- Leitura: índice, tempo, revisão, fontes, conceitos relacionados, fonte, cópia e progresso local.
- Projeto: validação, ambiente, timeout, separação de responsabilidades e testes com mocks. Inferência real opcional e não validada sem Ollama.
- Segurança: HTML editorial não executável, URLs HTTPS nas fontes, sem segredos, links externos seguros, CSP estática.
- Automação: contrato JSON estrito, atualização de capítulo existente, base commit e fontes; revisão humana obrigatória. Sem automação operacional configurada.
- Git: branch feat/advanced-learning-experience (Issue #2), commits por tarefa, nenhum merge/deploy/force push. Push e PR dependem das permissões efetivas.
- Qualidade: CI Linux único com cache, permissões mínimas, timeout e cancelamento. Sem deploy automático.

## Cobertura editorial explícita

HTTP/APIs e Python cobrem fundamentos; LLM/inferência cobre fundamentos de IA; RAG e FastAPI/Ollama cobrem aplicações; segurança/avaliação cobre operação. Treinamento, attention, embeddings, MCP/agentes, produção e carreira receberam capítulos dedicados na Issue #2. SQL, Linux, Docker e PyTorch ainda não possuem cursos completos dedicados. Não são publicados títulos vazios.

## Condições externas

Publicação Cloudflare, domínio real, Ollama real e n8n real não são critérios de funcionamento da leitura pública. Requerem configuração e, para deploy, aprovação explícita. O orçamento R$ 0 é uma restrição de projeto, não uma garantia permanente das franquias de terceiros.

## Ampliação aprovada: Issue #2

A evolução mantém os critérios anteriores e acrescenta biblioteca em três profundidades, quatro roadmaps especializados, cartões e revisão, percurso, laboratórios reais e Atlas. A matriz detalhada e as evidências estão em docs/issue-2-acceptance.md; a especificação integral está em docs/issues/2.md. Contagens anteriores descrevem a base inicial; cobertura atual é 15 capítulos, 45 cartões, quatro trilhas, três labs e cinco diagramas.
