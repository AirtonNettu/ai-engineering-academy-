# Plataforma pública IA Engineer Academy

O repositório tinha somente README e licença. Esta branch entrega a aplicação estática React/TypeScript com seis capítulos originais aprofundados, busca local em conteúdo/metadados, leitor com progresso e fonte, três trilhas, três diagramas, glossário, 17 recursos/skills e explorador dos arquivos reais de um exemplo FastAPI/Ollama.

O exemplo Python inclui validação, configuração por ambiente, timeout, tratamento de falhas e testes sem modelo online. Conteúdo é versionado e validado por schema e AST Markdown. Inclui tema claro/escuro, CSS responsivo, acessibilidade, CI de qualidade, ADRs e contrato de propostas editoriais futuras com revisão humana.

Validação local: npm ci e npm run check (18 Vitest, lint, formato, TypeScript, schema e build); 16 Playwright desktop/móvel com Chromium instalado, incluindo axe e links sob rede lenta; 19 pytest (uma depreciação Starlette/AnyIO); npm audit sem vulnerabilidades conhecidas. Servidores Vite e Uvicorn iniciados e respostas representativas verificadas. Sitemap/canonical/robots e CLI de propostas exercitados.

Revisão independente encontrou e motivou correções para navegação por hash e links Markdown; regressões agora cobertas. Nenhum merge ou deploy realizado. CI remoto, Cloudflare/headers efetivos, modelo Ollama real e n8n operacional não foram testados. SSR completo e sincronização de progresso não fazem parte da implementação; lacunas editoriais estão sinalizadas.

Rastreabilidade: docs/requirements.md, docs/architecture.md, docs/testing.md e docs/progress.md. Objetivo operacional de R$ 0, sem API paga, login, backend público ou telemetria.
