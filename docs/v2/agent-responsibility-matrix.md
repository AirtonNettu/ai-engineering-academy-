# Matriz de Responsabilidades dos 21 Agentes — IA Engineer Academy 2.0

## Modelo RACI, Propriedade de Arquivos e Protocolo de Revisão Cruzada

Este documento especifica a distribuição de atribuições dos 21 papéis especializados divididos nas 7 equipes, mapeando a responsabilidade estrita sobre arquivos do repositório, contratos de interface e os pares de revisão cruzada.

---

## 1. Mapeamento das 7 Equipes e 21 Agentes

|   ID    | Papel / Título             | Equipe                             | Foco Primário                                                                          | Par de Revisão Cruzada       |
| :-----: | :------------------------- | :--------------------------------- | :------------------------------------------------------------------------------------- | :--------------------------- |
| **A01** | **Solutions Architect**    | Equipe 1 — Arquitetura             | Topologia estática 2.0, viabilidade técnica Cloudflare Pages, governança geral         | A03 (Architecture Reviewer)  |
| **A02** | **Software Architect**     | Equipe 1 — Arquitetura             | Modularização do código em `src/`, padrões de componentes, desacoplamento              | A01 (Solutions Architect)    |
| **A03** | **Architecture Reviewer**  | Equipe 1 — Arquitetura             | Conformidade com `AGENTS.md`, ADRs, anti-duplicação e orçamentos                       | A02 (Software Architect)     |
| **A04** | **Scientific Researcher**  | Equipe 2 — Pesquisa Científica     | Curadoria de literatura seminal/recente, taxonomia científica, pontes pedagógicas      | A06 (Data Quality Engineer)  |
| **A05** | **Data Engineer**          | Equipe 2 — Pesquisa Científica     | Scripts de extração estática (OpenAlex, arXiv, Hugging Face), geração de snapshots     | A04 (Scientific Researcher)  |
| **A06** | **Data Quality Engineer**  | Equipe 2 — Pesquisa Científica     | Validação de esquemas, integridade referencial, verificação de licenças e proveniência | A05 (Data Engineer)          |
| **A07** | **Generative AI Engineer** | Equipe 3 — Engenharia de IA        | Design dos módulos editoriais avançados (Reasoning, LoRA/QLoRA, Evals)                 | A09 (Technical Reviewer)     |
| **A08** | **AI Systems Engineer**    | Equipe 3 — Engenharia de IA        | Especificação das novas arquiteturas do Atlas (MoE, Speculative, RAG Híbrido, Agentes) | A07 (Generative AI Engineer) |
| **A09** | **Technical Reviewer**     | Equipe 3 — Engenharia de IA        | Revisão técnica de rigor conceitual e terminologia em pt-BR precisa                    | A08 (AI Systems Engineer)    |
| **A10** | **ML Research Engineer**   | Equipe 4 — Observatório            | Metodologia de benchmarks de capacidade de modelos (MMLU-Pro, GSM8K, Arena)            | A11 (Benchmark Engineer)     |
| **A11** | **Benchmark Engineer**     | Equipe 4 — Observatório            | Metodologia e proveniência de métricas de engenharia (TTFT, decode, VRAM, throughput)  | A12 (Analytics Engineer)     |
| **A12** | **Analytics Engineer**     | Equipe 4 — Observatório            | Modelagem dos dados analíticos e lógica de agregação estática cliente                  | A10 (ML Research Engineer)   |
| **A13** | **UI/UX Designer**         | Equipe 5 — Experiência & Interface | Arquitetura de informação, ergonomia visual e design system preservado                 | A15 (Accessibility Engineer) |
| **A14** | **Frontend Engineer**      | Equipe 5 — Experiência & Interface | Desenvolvimento de páginas e componentes React 19 / TypeScript estrito                 | A13 (UI/UX Designer)         |
| **A15** | **Accessibility Engineer** | Equipe 5 — Experiência & Interface | Conformidade WCAG 2.1 AA, navegação por teclado, ARIA, contraste e reduced-motion      | A14 (Frontend Engineer)      |
| **A16** | **QA Engineer**            | Equipe 6 — Qualidade & Segurança   | Matriz de rastreabilidade de requisitos, testes unitários e de integração              | A17 (Automation Engineer)    |
| **A17** | **Automation Engineer**    | Equipe 6 — Qualidade & Segurança   | Automação de CI/CD, testes E2E com Playwright, validação de limites de bundle          | A16 (QA Engineer)            |
| **A18** | **Security Engineer**      | Equipe 6 — Qualidade & Segurança   | Modelagem de ameaças estáticas, CSP, SRI, sanitização de Markdown e zero credenciais   | A03 (Architecture Reviewer)  |
| **A19** | **Integration Engineer**   | Equipe 7 — Integração & Entrega    | Unificação de rotas, integração com busca em memória (`search.ts`) e cross-links       | A21 (Release Engineer)       |
| **A20** | **Independent Auditor**    | Equipe 7 — Integração & Entrega    | Auditoria final independente de conformidade, qualidade e ausência de regressões       | A01 / A19 (Coordenação)      |
| **A21** | **Release Engineer**       | Equipe 7 — Integração & Entrega    | Governança de release, verificação do build de produção, changelogs e PR final         | A20 (Independent Auditor)    |

---

## 2. Propriedade Estrita de Arquivos (`File Ownership`)

Para evitar conflitos de edição e garantir rastreabilidade, cada arquivo novo ou existente possui um agente proprietário primário (_Owner_) e agentes colaboradores (_Contributors_):

| Caminho de Arquivos                       | Agente Proprietário | Colaboradores | Descrição de Responsabilidade                                             |
| :---------------------------------------- | :-----------------: | :-----------: | :------------------------------------------------------------------------ |
| `docs/v2/master-plan.md`                  |       **A01**       |   A03, A21    | Planejamento macro, governança e alinhamento estratégico                  |
| `docs/v2/architecture-and-contracts.md`   |       **A02**       |   A01, A14    | Desenho arquitetural e contratos TypeScript formais                       |
| `docs/v2/adrs/*`                          |    **A01 / A02**    | A03, A08, A10 | Registro de Decisões de Arquitetura (ADRs v2)                             |
| `docs/v2/requirements.md`                 |       **A03**       |   A01, A16    | Requisitos funcionais, não funcionais e matriz de não-duplicação          |
| `docs/v2/scientific-apis-evaluation.md`   |       **A05**       | A04, A06, A18 | Análise de viabilidade técnica, jurídica e de limites de APIs científicas |
| `src/types/research.ts`                   |       **A05**       |   A02, A06    | Interfaces TypeScript para artigos, autores, modelos e datasets           |
| `src/types/observatory.ts`                |       **A12**       | A10, A11, A02 | Interfaces TypeScript para benchmarks e métricas de inferência            |
| `src/types/atlas.ts`                      |       **A08**       |   A02, A14    | Interfaces TypeScript para as novas arquiteturas do Atlas                 |
| `content/research/papers.json`            |       **A04**       |   A05, A06    | Catálogo estático curado de artigos científicos em IA                     |
| `content/research/models-datasets.json`   |       **A05**       |   A04, A06    | Catálogo estático curado de modelos e datasets abertos                    |
| `content/observatory/benchmarks.json`     |       **A10**       |   A11, A12    | Dados verificáveis de benchmarks de capacidades e raciocínio              |
| `content/observatory/systems.json`        |       **A11**       |   A10, A12    | Dados verificáveis de latência, throughput e memória de inferência        |
| `content/catalog.json` (expansão)         |       **A08**       |   A07, A19    | Registro das novas arquiteturas e tópicos curriculares                    |
| `content/chapters/*.md` (expansão v2)     |       **A07**       |   A09, A04    | Conteúdo editorial dos novos temas de IA generativa                       |
| `src/pages/ResearchCenter.tsx`            |       **A14**       |   A13, A15    | Página do Centro de Pesquisa Científica                                   |
| `src/pages/Observatory.tsx`               |       **A14**       |   A13, A15    | Página do Observatório de Inteligência Artificial                         |
| `src/components/Diagram.tsx` (novos SVGs) |    **A08 / A14**    |   A13, A15    | Motor de renderização e etapas das novas arquiteturas                     |
| `src/components/ObservatoryCharts.tsx`    |    **A12 / A14**    |   A13, A15    | Gráficos SVG acessíveis para métricas do observatório                     |
| `src/lib/routes.ts`                       |       **A19**       |   A02, A14    | Registro das novas rotas públicas e validação de links                    |
| `src/lib/search.ts`                       |       **A19**       |   A02, A05    | Extensão do índice de busca em memória para artigos e modelos             |
| `e2e/v2-flows.spec.ts`                    |       **A17**       |   A16, A15    | Testes ponta a ponta das novas experiências e acessibilidade              |
| `test/research.test.ts`                   |       **A16**       |   A05, A06    | Testes unitários de integridade de dados e schemas de pesquisa            |
| `test/observatory.test.ts`                |       **A16**       |   A10, A11    | Testes unitários de cálculo e integridade de métricas do observatório     |
| `scripts/validate-v2-data.ts`             |       **A06**       |   A05, A18    | Script de validação estática de schemas em CI (`npm run check`)           |

---

## 3. Matriz RACI por Frente de Entrega

- **R (Responsible):** Quem executa a tarefa.
- **A (Accountable):** Quem responde pela qualidade final da entrega e aprova.
- **C (Consulted):** Quem provê insumos técnicos e suporte.
- **I (Informed):** Quem é comunicado da entrega ou dependência.

| Frente de Trabalho                           | R (Responsável) | A (Aprovador) |   C (Consultado)   |  I (Informado)   |
| :------------------------------------------- | :-------------: | :-----------: | :----------------: | :--------------: |
| **1. Arquitetura e Contratos**               |       A02       |      A01      | A03, A05, A12, A18 | Todas as equipes |
| **2. Avaliação de Fontes Científicas**       |       A05       |      A04      |      A06, A18      | Equipes 3, 4 e 5 |
| **3. Curadoria de Dados de Pesquisa**        |    A04, A05     |      A06      |      A07, A09      | Equipes 1, 5 e 7 |
| **4. Métricas e Benchmarks do Observatório** |    A10, A11     |      A12      |      A08, A09      | Equipes 1, 5 e 7 |
| **5. Expansão Editorial (IA Generativa)**    |       A07       |      A09      |      A04, A08      |  Equipes 5 e 7   |
| **6. Novas Arquiteturas do Atlas**           |       A08       |      A03      |   A02, A09, A13    |  Equipes 5 e 7   |
| **7. Design e Acessibilidade de Telas**      |    A13, A15     |      A14      |      A04, A10      |  Equipes 1 e 6   |
| **8. Implementação Frontend React**          |       A14       |      A02      |   A13, A15, A19    |  Equipes 6 e 7   |
| **9. Testes Unitários e Qualidade**          |       A16       |      A03      |   A06, A10, A14    |  Equipes 1 e 7   |
| **10. Automação E2E e CI/CD**                |       A17       |      A16      |      A15, A18      |  Equipes 1 e 7   |
| **11. Segurança, CSP e Sanitização**         |       A18       |      A01      |      A03, A14      | Todas as equipes |
| **12. Integração Sistêmica e Rotas**         |       A19       |      A02      |      A14, A16      |  Equipes 6 e 7   |
| **13. Auditoria Independente Final**         |       A20       |      A01      |  Todas as equipes  |   Proprietário   |
| **14. Release e Preparação de PR**           |       A21       |      A01      |      A19, A20      |   Proprietário   |

---

## 4. Protocolo de Revisão Cruzada Obrigatória

Nenhum código, dado ou documento é incorporado à branch de desenvolvimento sem a emissão de um parecer favorável do par de revisão cruzada.

### Checklist de Revisão Cruzada:

1. **Conformidade Funcional:** O artefato atende exatamente ao requisito e aos contratos TypeScript estabelecidos?
2. **Salvaguarda Anti-Duplicação:** Há reutilização de componentes existentes (`Cards.tsx`, `CodeBlock.tsx`, `Diagram.tsx`, etc.) em vez de criação redundante?
3. **Ausência de Alucinação / Dados Falsos:** Se envolve artigos, modelos, datasets ou métricas, há link direto e proveniência comprovada para fonte pública aberta?
4. **Segurança e Privacidade:** Zero telemetria, zero credenciais em código ou URLs, estrita aderência ao CSP (`public/_headers`)?
5. **Acessibilidade e Usabilidade:** Elementos semânticos nativos, tags ARIA apropriadas, suporte a teclado completo e contraste validado?
6. **Passagem em Testes:** `npm run check` verde no escopo do arquivo alterado.
