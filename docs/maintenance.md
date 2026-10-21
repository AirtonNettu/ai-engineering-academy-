# Manutenção e governança

O mantenedor revisa PRs, fontes e resultados antes de qualquer publicação. A branch de consolidação não autoriza renomeação, merge, deploy ou release. A licença MIT cobre contribuições originais; fontes externas conservam suas licenças.

## Rotina econômica

- A cada PR: workflow Quality único, Linux padrão, permissões de leitura, cache npm/pip, timeout de 15 minutos e cancelamento de execuções redundantes. Testes unitários com cobertura executam uma vez. Chromium cobre desktop/móvel; Lighthouse e links externos não rodam repetidamente na CI.
- Semanalmente: Dependabot agrupa npm minor/patch (máximo dois PRs abertos) e limita pip a um PR. Mudanças principais requerem justificativa e verificação de compatibilidade; não há auto-merge. Revisar changelogs e auditorias antes de aceitar.
- Na revisão editorial: verificar fontes, data, precisão, relações, três profundidades e cartões. O link checker local verifica destinos existentes; a auditoria externa distingue indisponibilidade de falha definitiva.
- Antes de publicar: checklist em docs/consolidation/publication-checklist.md, revisão humana e aprovação expressa. Nunca enviar dados/segredos de estudos aos workflows.

## Segurança e contribuições

Leia [SECURITY.md](../SECURITY.md), [CONTRIBUTING.md](../CONTRIBUTING.md) e templates em `.github`. O fluxo de relato privado depende de o proprietário habilitar Private vulnerability reporting no painel Security; não há e-mail privado inventado. Sem esse recurso, combinar um canal seguro com o mantenedor sem expor detalhes exploráveis publicamente.

`.github/labels.yml` é o catálogo proposto, com bug, documentation, accessibility, security, dependencies, good first issue e help wanted. Templates usam apenas a label padrão bug; o restante pode ser aplicado pelo mantenedor após conferir labels existentes. O arquivo não altera configurações remotas nem cria atividade comunitária. Não marcar tarefas abertas como good first issue sem escopo e orientação reais.

## Orçamento e configurações externas

Este repositório público usa apenas ferramentas gratuitas e ativos estáticos. O proprietário precisa confirmar plano e limites atuais do GitHub/Cloudflare, proteção de main, exigência de revisão/status checks e alertas de segurança. Nenhum recurso pago ou limite de cobrança foi ativado. Logs/artefatos de cobertura têm retenção de sete dias. Não é possível garantir franquias futuras de terceiros.

Os arquivos de governança e a checklist de renomeação foram reaproveitados do PR #8, head e829c3f, sem efetuar merge do PR. Esta branch os consolida; o mantenedor deve evitar integrar duas vezes os mesmos arquivos ao decidir a ordem dos PRs.
