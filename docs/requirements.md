# Requisitos e critérios de aceite

Fonte: prompt mestre IA Engineer Academy, recebido em 20/10/2026. Escopo sem planos artificiais de versões. Implementação organizada por tarefas no plano e commits da branch.

| Critério                    | Entrega                                          | Evidência executável                |
| --------------------------- | ------------------------------------------------ | ----------------------------------- |
| 1. Iniciar localmente       | npm ci / npm run dev                             | smoke HTTP e README                 |
| 2. Compilar                 | Vite + TS estrito                                | npm run build                       |
| 3. Desktop e smartphone     | CSS mobile, menu e layout                        | Playwright desktop/mobile, overflow |
| 4. Capítulos reais          | seis textos pt-BR com fontes                     | validate:content + testes do leitor |
| 5. Busca funcional          | índice local de sete tipos                       | content.test.ts + jornada E2E       |
| 6. Roadmaps                 | três trilhas e etapas selecionáveis              | E2E de competência e capítulos      |
| 7. Diagramas                | RAG, LLM, FastAPI                                | ui.test.tsx + E2E de seleção        |
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
- Git: branch feat/academy-platform, commits por tarefa, nenhum merge/deploy/force push. Push e PR dependem das permissões efetivas.
- Qualidade: CI Linux único com cache, permissões mínimas, timeout e cancelamento. Sem deploy automático.

## Cobertura editorial explícita

HTTP/APIs e Python cobrem fundamentos; LLM/inferência cobre fundamentos de IA; RAG e FastAPI/Ollama cobrem aplicações; segurança/avaliação cobre operação. SQL, Linux, Docker, treinamento, PyTorch e outros tópicos do mapa ainda não possuem capítulos dedicados. Não são publicados títulos vazios.

## Condições externas

Publicação Cloudflare, domínio real, Ollama real e n8n real não são critérios de funcionamento da leitura pública. Requerem configuração e, para deploy, aprovação explícita. O orçamento R$ 0 é uma restrição de projeto, não uma garantia permanente das franquias de terceiros.
