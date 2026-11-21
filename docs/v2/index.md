# IA Engineer Academy 2.0 — Research & Engineering

## Índice Geral de Documentação Técnica e Planejamento Multiagente

Este diretório reúne o plano mestre, as decisões arquiteturais, os contratos formais de dados, a avaliação de fontes científicas e a matriz de responsabilidades para a evolução **IA Engineer Academy 2.0**.

---

## 1. Documentos Principais

| Documento                                                                    | Descrição                                                                                                                                                     |
| :--------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Plano Mestre de Implementação](master-plan.md)                              | Cronograma em 5 fases, dependências entre as 7 equipes, governança de branches e quality gates.                                                               |
| [Matriz de Responsabilidades dos 21 Agentes](agent-responsibility-matrix.md) | Distribuição dos 21 papéis em 7 equipes, mapeamento estrito de propriedade de arquivos (`File Ownership`) e protocolo de revisão cruzada.                     |
| [Requisitos do Sistema 2.0](requirements.md)                                 | Requisitos Funcionais (RF) e Não Funcionais (RNF), mapa de recursos existentes e salvaguardas anti-duplicação.                                                |
| [Avaliação de APIs Científicas](scientific-apis-evaluation.md)               | Análise de viabilidade de OpenAlex, arXiv, Hugging Face Hub e Papers with Code (Cotas R$ 0, licenças, rate limits e fallback estático).                       |
| [Arquitetura e Contratos de Dados](architecture-and-contracts.md)            | Arquitetura técnica (Static Ingestion + Client-Side Cache), diagramas mermaid e contratos TypeScript estritos para Pesquisa, Atlas, Observatório e Editorial. |
| [Critérios de Aceite e Quality Gates](acceptance-criteria.md)                | Critérios de aceite rastreáveis, checklist de auditoria independente e Definition of Done (DoD).                                                              |
| [Relatório de Auditoria Independente](audit-report.md)                       | Avaliação técnica de segurança (OWASP), acessibilidade, proveniência dos dados, performance e ausência de regressões (Agente 20).                             |
| [Relatório de Execução Multiagente](multi-agent-execution-report.md)         | Registro consolidado das atividades efetivamente executadas pelos 21 agentes nas 7 equipes especializadas.                                                    |

---

## 2. Decisões Arquiteturais (ADRs v2)

| ADR                                                             | Título                                       | Decisão Principal                                                                                                                                                                                                              |
| :-------------------------------------------------------------- | :------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ADR-001](adrs/ADR-001-static-research-center-offline-first.md) | Centro de Pesquisa Científica Offline-First  | Arquitetura estática baseada em snapshots JSON compilados no build + cache local no navegador via IndexedDB/Storage, sem backend ou dependência de runtime externo.                                                            |
| [ADR-002](adrs/ADR-002-atlas-expansion-taxonomy.md)             | Expansão do Atlas e Modelo Taxonômico        | Reutilização integral do motor SVG interativo existente para novos diagramas (MoE, Speculative Decoding, Agentic Loop, RAG Híbrido), sem duplicar componentes nem alterar o diagrama da homepage.                              |
| [ADR-003](adrs/ADR-003-ai-observatory-verifiable-metrics.md)    | Observatório de IA com Métricas Verificáveis | Adoção estrita de fontes primárias abertas e reprodutíveis (LMSYS/Chatbot Arena, OpenCompass, Hugging Face Open LLM Leaderboard, vLLM/SGLang benchmarks), proibindo dados simulados ou inferências sintéticas não comprovadas. |
| [ADR-004](adrs/ADR-004-scientific-apis-governance.md)           | Governança de APIs Científicas e Custo Zero  | Pipeline de ingestão estático executado via scripts locais/CI sem chaves pagas, com política de tolerância a falhas de rede, sem expor tokens no bundle do frontend.                                                           |

---

## 3. Diretrizes de Preservação e Compatibilidade

A evolução 2.0 respeita rigorosamente as regras fundamentais do repositório ([AGENTS.md](../../AGENTS.md)):

1. **Plataforma Estática:** Preservação de React 19, TypeScript estrito, Vite e deploy estático no Cloudflare Pages.
2. **Custo R$ 0 e Privacidade:** Acesso 100% público, gratuito, sem login, sem telemetria e sem dependência de serviços pagos em nuvem.
3. **Identidade Visual:** Preservação estrita da identidade da plataforma, layout responsivo e diagrama original da homepage.
4. **Zero Duplicação:** Integração coesa do Centro de Pesquisa, novos diagramas do Atlas e Observatório às rotas, busca e armazenamento existentes.
5. **Rigor Científico:** Proibição explícita de alucinação de citações, benchmarks sintéticos sem proveniência ou métricas de desempenho fabricadas.
