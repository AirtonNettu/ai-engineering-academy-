# Consolidação — escopo e referência

Solicitação integral fornecida pelo proprietário em 21/10/2026. Branch `chore/platform-consolidation` baseada em `origin/main` a95ebdc. Sem merge, deploy, renomeação administrativa, tag ou release.

## Inspeção antes de alterações

Main já incorpora os PRs #4 (aprendizagem), #6 (controles) e #7 (README/banner). PR #8 está aberto: `chore: consolidar governança open-source e preparar renomeação`, head e829c3f. Sua árvore e diff foram lidos por ref Git e página pública. A lista pública de PRs abertos mostrou #8. API GraphQL retornou Forbidden; não se alteraram credenciais. Sem tags remotas encontradas. Versão npm existente 1.0.0 preservada.

Baseline executado antes de mudanças: check aprovado (50 Vitest, lint/formato, validação editorial, TypeScript/build), 34 E2E Chromium desktop/móvel e 19 pytest. Uma execução E2E duplicada iniciada por engano foi interrompida; o processo original concluiu 34 testes. Python teve uma depreciação Starlette/AnyIO. Logs locais /tmp/consolidation-baseline-*.

## Problemas confirmados / estratégia

- Ausência de cobertura instrumentada: medir todos os módulos matemáticos e estado/agenda com V8; exigir 80% de linhas/branches por módulo matemático e adicionar testes de borda reais.
- Governança pendente no PR #8: reaproveitar os seis arquivos novos e badges, sem duplicar/mesclar o PR nem sobrescrever banner. Registrar origem e ampliar manutenção/labels/limites.
- README longo sem screenshots: preservar guia integral em docs/platform-guide.md; capturar três telas do build real e simplificar entrada.
- Headers/livePages inacessíveis pelo proxy (403): verificar arquivos e build local, listar validação humana obrigatória no provedor. Não confundir bloqueio do ambiente com falha do site.
- HTML das rotas fornece metadados, mas capítulos dependem de JS: avaliar leitura sem JS e implementar somente fallback estático seguro/reproduzível para capítulos se confirmado benefício. Manter React/Vite/URLs.
- Metadados Open Graph são genéricos e validação SITE_URL insuficiente: gerar valores por rota, validar origem estrita; preservar noindex de previews.
- Auditoria Python reportou advisories nos pins pytest/Starlette: testar menor conjunto compatível e reauditar. npm audit inicial zero; majors desatualizados serão avaliados sem atualização indiscriminada.
- Revisão editorial integral por corpus e relações, sem ampliar catálogo; corrigir afirmações/links comprovadamente imprecisos.
- Acessibilidade em quatro larguras, teclado, zoom/reduced-motion e labs: ampliar evidências sem alterar geometria sem necessidade.
- Lighthouse local e orçamento de assets: medição informativa fora da CI pesada; limites estáveis de build na CI.

## Tarefas e responsáveis técnicos

1. Conteúdo e referências: domínio editorial independente.
2. AppSec/Python: domínio de segurança independente.
3. Cobertura matemática/estado: domínio independente com alterações restritas a configuração/testes.
4. Coordenação: governança, README/evidências, SEO/SSG, links, CI/performance e integração/revisão final.

A delegação segue superpowers:dispatching-parallel-agents para arquivos/domínios sem conflito. O escopo e execução em branch foram explicitamente autorizados pelo proprietário; não se solicitou autorização repetida. As restrições administrativas permanecem intactas.
