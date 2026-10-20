# Registro de execução

Spec: docs/superpowers/specs/2026-10-20-academy-design.md
Plano: docs/superpowers/plans/2026-10-20-academy.md

Inspeção: apenas README/LICENSE no commit 947587b. Branch feat/academy-platform criada.
Decisão: execução contínua autorizada pelo prompt mestre; especificação e plano registrados sem interromper para aprovações intermediárias.
Pré-verificação: interface → catálogo validado; explorador → arquivos reais do exemplo; diagramas → ids de arquivo validados.

## Entregas e evidências

- Tarefa 1: concluída em cf80530; cinco testes iniciais passaram, catálogo validado. Busca ampliada para corpo completo com teste prefill RED→GREEN.
- Tarefa 2: concluída em f184d89; 19 testes Python passaram sem Ollama; Uvicorn iniciou, /health=200 e entrada vazia=422 em requisições reais.
- Tarefa 3: leitor, busca, catálogo, três trilhas, três diagramas e explorador entregues; suíte Vitest e E2E cobrindo interações.
- Tarefa 4: documentação, ADRs, contrato editorial, qualidade e metadados implementados. Revisão final em andamento.
- Decisão: engine Shiki JavaScript e importação sob demanda; sem gramáticas HTTP/TypeScript não utilizadas, reduzindo download inicial.
- Decisão: Vitest atualizado para 5.0.5 e ESLint para 10 após auditoria; npm audit retornou zero vulnerabilidades conhecidas na nova instalação.
- Rede: CDN Playwright bloqueada; usado Chromium já instalado. Nenhum controle de rede ou TLS desabilitado.
- Acessibilidade: nome acessível da busca móvel, sidebar fechada inert, foco contido no menu aberto e contrastes auxiliares corrigidos com evidência E2E.
- Catálogo: três skills reais consultadas no SKILL.md do repositório Anthropic; links e limites de compatibilidade documentados, sem instalação.
- Limitações: sem Ollama real, n8n operacional, deploy ou domínio aprovado; testes automatizados não substituem revisão com leitor de tela nem especialista editorial.

## Revisão final

Revisor independente somente leitura encontrou dois problemas P2: scroll por hash antes de conteúdo lazy e regex incompleta de links editoriais. Ambos foram reproduzidos por testes que falharam antes das correções.

- Corrigido: useHashScroll nas páginas destinatárias, aguardando Markdown quando necessário. E2E com atraso de 120ms em chunks: RED→GREEN em desktop/móvel.
- Corrigido: AST Markdown cobre links titulados/referenciais e ignora exemplos de código; relativos ambíguos/protocolos perigosos são recusados. Testes negativos: RED→GREEN.
- Nenhum outro problema importante reportado pelo revisor. Sem segunda revisão independente das correções; verificadas por testes de regressão e suíte completa.
- Resultado final: npm run check passou com 18 testes; Playwright passou 16 testes; pytest passou 19 testes com uma depreciação conhecida; npm audit sem vulnerabilidades conhecidas.
- Reprodutibilidade: npm ci reexecutado; Vite dev renderizou página no Chromium; sitemap/canonical/robots testados com origem reservada e saída local sem domínio restaurada; CLI de proposta exercitado sem modificar arquivos editoriais.
- Configuração de nuvem: install_script e start_skill salvos em rascunho; não executam/publicam por esse salvamento. Nenhum domínio/segredo adicionado.
- GitHub: leitura Git funciona. API /user retornou Forbidden apesar de GH_TOKEN presente; sem extração/substituição de credenciais. PR depende de acesso efetivo à API.
