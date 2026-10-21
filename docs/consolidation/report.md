# Relatório de consolidação — IA Engineer Academy

Data da revisão: 21/10/2026. Branch `chore/platform-consolidation`, base `main` a95ebdc. O [plano e a inspeção inicial](plan.md) registram preparação, baseline e achados. Sem merge, deploy, renomeação, tag ou release; versão 1.0.0 preservada.

## Entregas verificáveis

- Governança e badges reaproveitados do PR #8 e829c3f, sem merge/duplicação de arquivos; manutenção, labels declarativas e checklist administrativa ampliadas.
- README simplificado com banner SVG original e três capturas reais do build (biblioteca, Atlas e rede XOR). Guia anterior preservado em [platform-guide.md](../platform-guide.md).
- Auditoria Python, atualização mínima para corrigir avisos conhecidos, 19 testes e verificação de resolução. npm sem avisos conhecidos; versões principais desatualizadas avaliadas e mantidas por compatibilidade, sem atualização indiscriminada.
- V8 mede todos os cinco módulos puros de matemática/estado, sem exclusões por trecho: mínimo 80% por arquivo em quatro métricas. Testes de gradiente, convergência e invariantes continuam independentes da meta de cobertura.
- Workflow único publica tabela de cobertura no resumo e dois arquivos por sete dias; check executa unitários uma vez, Python, E2E, links locais e orçamento de bytes. Push somente main e PRs com destino main evitam duplicar o mesmo trabalho em push da branch/PR. Sem deploy automático.
- Quinze capítulos recebem leitura estática segura no build. HTML `.html` com URLs limpas funciona no preview; regras exatas precedem o fallback Cloudflare. Metadados por rota, origem HTTPS estrita, OG PNG e noindex de previews/rotas privadas. [ADR 0005](../adr/0005-static-reading-and-quality.md).
- Biblioteca ganhou hierarquia de títulos sequencial; cabeçalho quebra linha em texto ampliado, e o conteúdo reserva espaço para impedir salto do rodapé no carregamento. Nenhuma alteração nos cálculos ou geometria dos diagramas.
- Revisão integral do corpus corrigiu fontes de cartões, relações de conceitos e arquivos do Atlas HTTP, além de uma afirmação absoluta sobre overlap. Nenhum novo capítulo/lab foi criado.

## Resultados e método

Baseline antes de mudanças: 50 testes Vitest, 34 E2E e 19 pytest aprovados. A primeira rodada integrada detectou URLs sem barra final caindo no HTML genérico e overflow em 768 px/texto 200%; corrigidos, com 44 E2E aprovados em seguida. Lighthouse inicial detectou título fora de ordem e CLS do rodapé; testes de regressão reproduziram os dois casos antes da correção. A evidência final é registrada abaixo após a verificação integrada.

Relatórios especializados: [cobertura](../consolidation-coverage.md), [segurança](../consolidation-security.md), [editorial](../consolidation-editorial-review.md). Dados de auditoria em [npm-audit.json](npm-audit.json), [npm-outdated.json](npm-outdated.json), [python-outdated.json](python-outdated.json) e [link-audit.json](link-audit.json).

## Revisão independente

Revisor técnico independente leu os novos módulos SSG, origem/metadados, rewrites, CI/cobertura e validadores. Não identificou bug concreto nesse escopo. Confirmou que o preview não processa `_headers`/`_redirects` do Cloudflare: os arquivos são inspecionados/testados localmente, mas comportamento efetivo no provedor depende de revisão humana.

## Limites e intervenção humana

- GitHub GraphQL retornou Forbidden; a página pública e refs Git permitiram verificar PR #8 e main. PR/CI/configurações remotos só podem ser afirmados após resultado efetivo, registrado na entrega.
- Proxy do ambiente bloqueou o domínio Pages por HTTP 403. Não foi acessado painel Cloudflare nem confirmado funcionamento da versão pública. Screenshots e Lighthouse descrevem o build local.
- Auditoria de links externos respeita proxy e timeouts: destinos sem resposta não são declarados íntegros nem quebrados. As fontes citadas precisam de revisão editorial humana quando a rede permitir.
- Axe, emulação de teclado/móvel, texto ampliado e reduced-motion não substituem leitor de tela ou dispositivo físico; não há certificação WCAG ou teste de todos os navegadores.
- Testes Python mockam a fronteira Ollama; não validam inferência real, qualidade de respostas ou n8n. API segue exemplo local, sem backend público novo.
- Estado local não sincroniza entre dispositivos/abas, pode ser apagado pelo navegador e não é criptografado. Sem mudanças de formato nesta consolidação.
- Lighthouse local é uma medição sintética, não dados reais de usuários nem garantia de produção. CI aplica apenas orçamentos de assets determinísticos.
- HTTP 200 de fallback em rotas inexistentes (soft 404) permanece como limite de hospedagem SPA. Texto estático dos capítulos não inclui controles interativos sem JavaScript.

A [checklist de publicação](publication-checklist.md) descreve as etapas autorizáveis pelo proprietário, incluindo configuração SITE_URL, CSP/headers reais, proteção de main, segurança privada, labels, PR #8, reversão e eventual renomeação separada.

## Verificação integrada final

| Verificação                 | Resultado observado                                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check`             | aprovado: lint, formato, 63 testes Vitest em 13 arquivos, validação editorial, TypeScript e build                                                             |
| V8, cinco módulos completos | 100% linhas (122/122), branches (89/89), funções (51/51), statements (141/141); gate 80% por arquivo                                                          |
| Playwright Chromium         | 48 testes aprovados, desktop/móvel, incluindo regra dedicada dos rótulos SVG                                                                                  |
| Python atualizado           | 19 testes aprovados; pip check sem conflitos; duas depreciações TestClient documentadas                                                                       |
| Auditorias de dependências  | npm zero vulnerabilidades conhecidas; 21 pins Python sem avisos após correção                                                                                 |
| SEO preview                 | sem origem: noindex/robots e ausência de sitemap validados                                                                                                    |
| SEO com origem local        | SITE_URL do Pages no build local: 15 capítulos, canonical, OG, sitemap, noindex privado e rewrites validados                                                  |
| Links                       | destinos locais validados; auditoria de 73 URLs externas: 15 respostas 200, 58 sem resposta verificável pelo ambiente; nenhuma declarada válida por suposição |
| Assets                      | maior JS gzip 129.966 B; JS total incluindo lazy 353.247 B; CSS gzip 12.882 B; PNG social 119.090 B; dentro dos limites                                       |
| Preservação                 | banner original, matemática XOR/attention/embeddings e componente da rede sem diff; Atlas mudou somente nome/separação textual acessível                      |

Dados normalizados de cobertura em [coverage-summary.json](coverage-summary.json). A medição abrange os cinco módulos definidos, não toda a interface. Evidências de [acessibilidade](accessibility.md), [performance](performance.md) e [fontes](link-audit.json) descrevem métodos e limites. Os comandos locais não comprovam execução bem-sucedida da CI remota.

## Performance observada

Biblioteca: 97; Atlas: 98; laboratório neural: 97. Acessibilidade, boas práticas e SEO: 100 nas três amostras; CLS zero. LCP entre 2,21 e 2,35 s nas condições locais. [Métricas, configuração e limitações](performance.md) e [dados estruturados](lighthouse-summary.json).

## Entrega GitHub

Branch `chore/platform-consolidation` enviada e SHA remoto conferido com o local. Commits por frente: 3f7af1f (governança), 1def9bf (segurança), 2d6d781 (cobertura/CI), 1b84587 (editorial), 56dfae5 (leitura estática/acessibilidade), f8c0008 (apresentação/evidências), seguido pelo registro desta entrega.

A tentativa `gh pr create --draft --base main --head chore/platform-consolidation --body-file docs/consolidation/pull-request.md` retornou `Post https://api.github.com/graphql: Forbidden`. Nenhum PR foi criado; não houve alteração de credenciais ou tentativa de contornar a restrição. Descrição pronta em [pull-request.md](pull-request.md). Abertura manual: https://github.com/AirtonNettu/ai-engineering-academy-/pull/new/chore/platform-consolidation . A aplicação de labels, confirmação de CI remoto e revisão da ordem com PR #8 permanecem com o mantenedor.

A relação completa dos 69 arquivos alterados está em [changed-files.txt](changed-files.txt). Para executar: `npm ci`, `npm run check`, `npm run check:links`, `npm run check:performance` e `npm run test:e2e` com Chromium instalado. A publicação segue a checklist vinculada acima, somente após aprovação específica.
