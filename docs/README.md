# Índice de Documentação — IA Engineer Academy

Guia central de navegação para estudar, desenvolver, testar, manter e operar a **IA Engineer Academy**.

---

## 1. Guia para estudantes e aprendizado

| Documento                                         | Descrição                                                                                                               |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [Guia da Plataforma](platform-guide.md)           | Visão geral dos recursos educacionais: capítulos, laboratórios, Atlas e trilhas.                                        |
| [Roadmaps Curriculares](roadmap.md)               | Competências profissionais de Engenharia de IA por senioridade e contexto.                                              |
| [Dados de Estudo e Privacidade](learning-data.md) | Detalhes sobre o armazenamento local no navegador (`academy:learning`), privacidade e importação/exportação de backups. |

---

## 2. Engenharia e desenvolvimento

| Documento                                                               | Descrição                                                                                  |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [Requisitos do Sistema](requirements.md)                                | Requisitos funcionais, não funcionais e critérios de aceite da plataforma.                 |
| [Arquitetura](architecture.md)                                          | Desenho arquitetural, leitura estática, renderização cliente e isolamento de dependências. |
| [Modelo Editorial](content-model.md)                                    | Estrutura dos capítulos em 3 profundidades, metadados, catálogo e flashcards associados.   |
| [Automação Editorial](editorial-automation.md)                          | Contrato de validação de propostas de conteúdo (`editorial.ts` e schema).                  |
| [Exemplo Python FastAPI + Ollama](../examples/fastapi-ollama/README.md) | Backend educacional independente com contratos HTTP e testes mockados.                     |

---

## 3. Testes, qualidade e limites

| Documento                                             | Descrição                                                                                                                                                                                    |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Guia de Testes](testing.md)                          | Comandos de execução (Vitest, Playwright, pytest), cobertura funcional e limites de teste.                                                                                                   |
| [Cobertura de Código](consolidation-coverage.md)      | Explicação detalhada da meta de cobertura V8 mínima de 80% por arquivo (aplicável estritamente aos módulos configurados em `src/labs/*.ts` e `src/learning/*.ts`, e não a toda a aplicação). |
| [Instruções de Engenharia para Agentes](../AGENTS.md) | Regras inegociáveis de preservação de código, cobertura, semântica e restrições de deploy.                                                                                                   |

> [!NOTE]
> **Escopo da meta de cobertura V8:** A exigência de cobertura mínima de 80% (linhas, branches, funções e statements) se aplica estritamente aos módulos matemáticos e de estado local (`src/labs/neural.ts`, `src/labs/attention.ts`, `src/labs/embeddings.ts`, `src/learning/model.ts`, `src/learning/scheduler.ts`). Ela não se aplica à totalidade da interface nem deve ser confundida com prova formal de generalização.

---

## 4. Operação, governança e publicação

| Documento                                                 | Descrição                                                                                                                    |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Manutenção da Plataforma](maintenance.md)                | Rotinas de atualização de dependências, checagens periódicas e monitoramento.                                                |
| [Procedimento de Publicação](deployment.md)               | Procedimentos para publicação estática (Cloudflare Pages), geração de sitemap, noindex em preview e validação de `SITE_URL`. |
| [Checklist de Renomeação](repository-rename-checklist.md) | Checklist preparatório para eventual renomeação administrativa do repositório para `ai-engineering-academy` (não executada). |
| [Política de Segurança](../SECURITY.md)                   | Canal para reporte coordenado de vulnerabilidades (via _Private Vulnerability Reporting_ habilitado no GitHub).              |
| [Guia de Contribuição](../CONTRIBUTING.md)                | Diretrizes e checklist para envio de pull requests revisáveis.                                                               |

---

## 5. IA Engineer Academy 2.0 (Planejamento e Arquitetura)

| Documento                                                                      | Descrição                                                                                   |
| :----------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------ |
| [Índice Geral do Academy 2.0](v2/index.md)                                     | Visão geral do plano de evolução 2.0, centro de pesquisa, observatório e expansão do Atlas. |
| [Plano Mestre de Implementação](v2/master-plan.md)                             | Cronograma em 5 fases, modelo operacional multiagente e matriz de dependências.             |
| [Matriz de Responsabilidade dos 21 Agentes](v2/agent-responsibility-matrix.md) | Distribuição dos papéis, propriedade de arquivos (`File Ownership`) e revisão cruzada.      |
| [Requisitos do Sistema 2.0](v2/requirements.md)                                | Requisitos funcionais, não funcionais e salvaguardas de não duplicação.                     |
| [Avaliação de APIs Científicas](v2/scientific-apis-evaluation.md)              | Análise de viabilidade (OpenAlex, arXiv, Hugging Face, etc.), cotas R$ 0 e governança.      |
| [Arquitetura e Contratos de Dados](v2/architecture-and-contracts.md)           | Topologia estática, diagramas de fluxo e interfaces TypeScript estritas.                    |
| [Critérios de Aceite e Quality Gates](v2/acceptance-criteria.md)               | Critérios de aceite rastreáveis, quality gates por equipe e Definition of Done.             |
| [ADRs da Versão 2.0](v2/adrs/ADR-001-static-research-center-offline-first.md)  | Decisões arquiteturais fundamentais para a evolução 2.0.                                    |

---

## 6. Registros históricos e decisões de arquitetura

> [!IMPORTANT]
> Os documentos a seguir são **registros históricos** de auditorias, entregas e decisões tomadas em marcos específicos do projeto. Eles refletem o estado no momento de sua elaboração e não devem ser interpretados como afirmações de validação em tempo real.

### Relatórios e marcos históricos

- [Relatório de Consolidação (21/10/2026)](consolidation/report.md): Auditoria e consolidação operacional da plataforma.
- [Plano de Consolidação](consolidation/plan.md): Planejamento da etapa de consolidação e baseline.
- [Revisão de Segurança da Consolidação](consolidation-security.md): Auditoria de pacotes e isolamento do exemplo Python.
- [Critérios de Aceite da Issue #2](issue-2-acceptance.md): Validação da expansão da experiência avançada de aprendizagem.
- [Layout dos Controles dos Labs](lab-controls-layout.md): Registro da correção de sobreposição de botões em telas pequenas.

### Decisões Arquiteturais (ADRs)

- [ADR 0001: Plataforma estática](adr/0001-static-platform.md)
- [ADR 0002: Conteúdo e diagramas](adr/0002-content-and-diagrams.md)
- [ADR 0003: Exemplo Python](adr/0003-python-example.md)
- [ADR 0004: Aprendizagem avançada](adr/0004-advanced-learning.md)
- [ADR 0005: Leitura estática e qualidade](adr/0005-static-reading-and-quality.md)
