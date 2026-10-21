# Checklist de publicação — execução humana autorizada

Esta branch prepara revisão. Não realizou merge, deploy, renomeação, tag ou release.

## Antes de aprovar

- [ ] Revisar PR desta consolidação e decidir a ordem com PR #8 (governança reaproveitada, sem duplicação).
- [ ] Conferir SHA, CI remoto, cobertura, testes, auditorias, screenshots e changelog. Evidências locais não substituem status do GitHub.
- [ ] Confirmar plano gratuito e limites de GitHub/Cloudflare; nenhuma cobrança ou serviço pago necessário.
- [ ] Confirmar configuração real do projeto Pages: repositório, branch de produção, Node 24, `npm ci && npm run build`, saída `dist`.
- [ ] Definir `SITE_URL=https://ai-engineering-academy-3cy.pages.dev` apenas no ambiente de produção aprovado (ou domínio HTTPS autorizado). Não definir origem de produção em previews que não devem indexar.
- [ ] Confirmar Private vulnerability reporting, proteção de main, revisões obrigatórias e labels conforme docs/maintenance.md.
- [ ] Conferir manualmente com leitor de tela e aparelho físico. A emulação e axe não são certificação de acessibilidade.

## Somente após autorização de merge/deploy

- [ ] Fazer merge pelo fluxo aprovado; acompanhar publicação no provedor sem criar workflow de deploy GitHub.
- [ ] Verificar respostas HTTP reais: `_headers`, CSP, cache de assets, MIME, redirects e URLs diretas de capítulos/projetos/labs.
- [ ] Conferir canonical e OG por capítulo, imagem social absoluta PNG, sitemap com origem correta e robots permitindo apenas o desejado.
- [ ] Abrir capítulo com JavaScript desligado e depois a experiência interativa, incluindo âncoras e progresso legado.
- [ ] Validar tela 320 px, teclado, tema escuro e backup/importação; confirmar ausência de chamadas administrativas/telemetria.
- [ ] Guardar SHA e publicação anterior para reversão pelo Pages. Não usar force push.
- [ ] Aprovar separadamente eventual tag/release e renomeação administrativa, seguindo a checklist própria.

O proxy deste ambiente bloqueou o domínio Pages com 403; nenhuma etapa remota acima foi marcada como executada. A criação do PR depende da permissão efetiva da API; o relatório registra seu resultado.
