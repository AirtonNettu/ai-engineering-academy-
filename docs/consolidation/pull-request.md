# Consolidação da IA Engineer Academy

Consolida a plataforma existente a partir de main a95ebdc, preservando React/TypeScript/Vite, URLs, identidade, banner, cálculos e geometria dos laboratórios. Reaproveita a governança do PR #8 (head e829c3f), sem realizar merge desse PR; o mantenedor deve considerar essa sobreposição ao decidir a ordem de integração.

## Alterações

- README enxuto, três screenshots reais, guia extenso preservado, SECURITY/CONTRIBUTING/templates, Dependabot limitado, labels declarativas, manutenção, changelog e checklist de renomeação/publicação.
- V8 nos cinco módulos completos de matemática/estado, gate 80% por arquivo, resumo e artefatos no workflow único; links locais e orçamentos de assets.
- Correção de avisos de Starlette/pytest com conjunto compatível, lock e auditoria. Nenhuma atualização principal indiscriminada ou novo backend.
- Leitura estática segura dos 15 capítulos, metadados específicos, origem estrita e noindex de previews/dados; URLs limpas e rewrites antes do fallback SPA.
- Hierarquia de títulos, texto ampliado, nomes acessíveis do Atlas e estabilidade do rodapé corrigidos com regressões. Fontes de flashcards, glossário e responsabilidades de arquivos revisadas.

## Evidências

Resultados, cobertura medida, segurança, Lighthouse, acessibilidade e capturas estão em docs/consolidation/report.md. Relatórios JSON e comandos de reprodução acompanham a documentação. A suíte existente foi preservada e ampliada, sem excluir linhas/branches relevantes para elevar a cobertura.

## Limites e revisão humana

O ambiente bloqueou Pages por 403; headers/redirects/configuração efetivos no Cloudflare não foram confirmados. Parte das fontes externas ficou inacessível; nenhum sucesso remoto foi inventado. Leitor de tela e aparelho físico não estavam disponíveis. Testes Python usam transporte mockado, sem Ollama/n8n reais. Duas depreciações TestClient estão registradas. Lighthouse é medição sintética local, sem garantia de produção.

Sem merge, deploy, tag, release, renomeação administrativa ou alteração da versão 1.0.0. Aprovação dessas operações é separada. Nenhum serviço pago ou telemetria introduzido.
