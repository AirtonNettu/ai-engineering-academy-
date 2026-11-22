# Critérios de Aceite e Quality Gates — IA Engineer Academy 2.0

## Matriz de Rastreabilidade, Quality Gates por Equipe e Definition of Done

Este documento define os critérios de aceite rastreáveis para todas as entregas da IA Engineer Academy 2.0, estabelecendo os gates de qualidade obrigatórios para as 7 equipes e a lista de verificação da auditoria independente final.

---

## 1. Critérios de Aceite Rastreáveis

### 1.1 Centro de Pesquisa Científica (RF-01 a RF-06)

- [ ] **CA-RES-01:** A rota `/pesquisa` deve estar devidamente mapeada em `src/App.tsx`, registrada em `src/lib/routes.ts` e renderizar sem erros de console ou falhas de hidratação.
- [ ] **CA-RES-02:** O catálogo de artigos deve listar no mínimo 25 trabalhos seminais e contemporâneos curados de IA (Transformers, RoPE, LoRA, FlashAttention, DPO, MoE, PagedAttention, etc.), cada um contendo título original, título em pt-BR, autores, ano, venue, resumo traduzido/explicado e link aberto (arXiv/DOI).
- [ ] **CA-RES-03:** Cada trabalho listado deve indicar explicitamente se é _Artigo Revisado por Pares_ ou _Preprint_, com badge visual distintivo.
- [ ] **CA-RES-04:** A interface deve permitir filtrar artigos por área temática e realizar busca instantânea em memória por termos de busca (título, autor, abstract).
- [ ] **CA-RES-05:** Os artigos devem possuir conexões bidirecionais clicáveis apontando para os capítulos editoriais da biblioteca (`/capitulos/<id>`), diagramas do Atlas (`/arquiteturas?diagrama=<id>`) e laboratórios (`/laboratorios/<id>`).
- [ ] **CA-RES-06:** O catálogo de modelos e datasets deve listar pelo menos 15 modelos abertos e 10 datasets de referência, exibindo licença aberta (Apache 2.0, MIT, OpenRAIL), contagem de parâmetros e arquitetura base.
- [ ] **CA-RES-07:** Todos os dados de pesquisa devem ser carregados de snapshots estáticos compilados (`content/research/*.json`), sem requisições síncronas a APIs externas pelo navegador no carregamento da página.

### 1.2 Expansão do Atlas de Arquiteturas (RF-07 a RF-09)

- [ ] **CA-ATL-01:** O seletor de diagramas na página `/arquiteturas` deve disponibilizar as 4 novas arquiteturas (MoE, Speculative Decoding, Loop Agêntico e RAG Híbrido), totalizando 9 arquiteturas interativas.
- [ ] **CA-ATL-02:** O diagrama original do RAG exibido na página inicial (`src/pages/Home.tsx`) deve permanecer rigorosamente idêntico em visual, estilo e comportamento.
- [ ] **CA-ATL-03:** Cada novo diagrama deve implementar o ciclo completo de etapas (mínimo de 4 etapas por diagrama), com navegação passo a passo, suporte a play/pause temporizado (intervalo de 2,4 segundos) e controles acessíveis por teclado (setas esquerda/direita).
- [ ] **CA-ATL-04:** Os novos diagramas devem utilizar exclusivamente o motor SVG de `src/components/Diagram.tsx`, sem inclusão de novas bibliotecas de grafos.
- [ ] **CA-ATL-05:** Todas as conexões de código nos nós dos diagramas devem apontar para referências de arquivos e funções reais do projeto ou da documentação oficial associada.

### 1.3 Observatório de Inteligência Artificial (RF-10 a RF-13)

- [ ] **CA-OBS-01:** A rota `/observatorio` deve estar acessível na navegação, renderizando painéis analíticos com métricas de capacidade (MMLU-Pro, GSM8K, HumanEval, Chatbot Arena ELO) e engenharia (TTFT, decode tokens/s, VRAM em quantizações FP16/AWQ/GGUF).
- [ ] **CA-OBS-02:** 100% dos números apresentados devem conter fonte primária explícita documentada e data de aferição, sendo terminantemente proibida a inclusão de métricas fabricadas ou estimadas sem metodologia declarada.
- [ ] **CA-OBS-03:** Os gráficos comparativos devem ser renderizados em componentes SVG leves e acessíveis, com suporte a cores temáticas claras e escuras (variáveis CSS).
- [ ] **CA-OBS-04:** Para cada gráfico interativo, deve existir uma tabela de dados alternativa oculta para leitores de tela (`sr-only`), permitindo auditoria e navegação assistiva completa.
- [ ] **CA-OBS-05:** Os filtros de categoria (Pesos Abertos vs APIs Proprietárias) e faixa de parâmetros devem operar de forma instantânea em memória, sem recarregar a página e sem telemetria.

### 1.4 Expansão Editorial em IA Generativa (RF-14 a RF-16)

- [ ] **CA-EDT-01:** O catálogo deve incorporar os 4 aprofundamentos técnicos essenciais (Modelos de Raciocínio, Fine-Tuning Eficiente LoRA/QLoRA, Avaliações com LLM-as-a-Judge, e Serving em Larga Escala).
- [ ] **CA-EDT-02:** Cada novo tópico deve respeitar rigorosamente a estrutura de 3 profundidades ordenadas (Conceito Fundamental, Implementação Prática e Considerações de Produção).
- [ ] **CA-EDT-03:** No mínimo 3 novos flashcards didáticos devem ser cadastrados para cada novo tema, vinculados ao sistema de repetição espaçada local.
- [ ] **CA-EDT-04:** Todas as âncoras e referências Markdown introduzidas devem ser validadas e aprovadas sem erros pelo script `scripts/check-links.ts`.

### 1.5 Requisitos Não Funcionais e de Qualidade (RNF-01 a RNF-08)

- [ ] **CA-QAL-01:** O build estático (`npm run build`) deve gerar a pasta `dist/` perfeitamente, sem erros ou warnings de TypeScript.
- [ ] **CA-QAL-02:** O comando `npm run check` deve executar e passar com código de saída 0 (linting, formatação Prettier, validação de tipos e testes unitários em Vitest).
- [ ] **CA-QAL-03:** A meta de cobertura mínima de 80% nos módulos matemáticos (`src/labs/*.ts`) e de estado de estudo (`src/learning/*.ts`) deve permanecer integralmente cumprida.
- [ ] **CA-QAL-04:** A suíte de testes ponta a ponta (`npm run test:e2e`) deve executar e passar em 100% dos testes Playwright, incluindo os testes de acessibilidade com `axe-core`.
- [ ] **CA-QAL-05:** Zero chamadas a APIs pagas e zero credenciais em código ou variáveis `VITE_*`.
- [ ] **CA-QAL-06:** Nenhuma violação das diretrizes de segurança da CSP em `public/_headers`.

---

## 2. Quality Gates por Equipe

Cada equipe só poderá liberar seus artefatos para a fase subsequente após a aprovação formal em seu respectivo Quality Gate:

| Equipe                                 | Quality Gate de Saída                    | Verificação Obrigatória                                                                                                    |
| :------------------------------------- | :--------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **Equipe 1 — Arquitetura**             | **Gate 1: Contratos e Schemas**          | Contratos TypeScript declarados sem `any`; ADRs aprovadas; ausência de duplicação validada.                                |
| **Equipe 2 — Pesquisa Científica**     | **Gate 2: Integridade de Dados**         | Schemas JSON de papers e modelos validados por script; todas as fontes com links abertos ativos; zero dados fabricados.    |
| **Equipe 3 — Engenharia de IA**        | **Gate 3: Rigor Técnico Editorial**      | Prosa técnica em pt-BR com precisão matemática; novas arquiteturas com etapas lógicas e conexões de código reais.          |
| **Equipe 4 — Observatório**            | **Gate 4: Verificabilidade Analítica**   | Proveniência de 100% dos dados analíticos comprovada; especificações de hardware documentadas para métricas de inferência. |
| **Equipe 5 — Experiência & Interface** | **Gate 5: Ergonomia e Acessibilidade**   | Zero violações de contraste no tema claro e escuro; navegação por teclado fluida; sem quebras em mobile; home preservada.  |
| **Equipe 6 — Qualidade & Segurança**   | **Gate 6: Automação e Auditoria de CI**  | `npm run check` verde; suíte E2E verde; orçamentos de performance respeitados; CSP estrita sem scripts inline inseguros.   |
| **Equipe 7 — Integração & Entrega**    | **Gate 7: Auditoria Independente Final** | Relatório de auditoria independente favorável (GO); PR pronto para revisão humana pelo proprietário.                       |

---

## 3. Definition of Done (DoD)

Uma funcionalidade da IA Engineer Academy 2.0 é considerada concluída (**DONE**) somente quando satisfaz integralmente as seguintes condições:

1. Código escrito em TypeScript estrito em conformidade com as diretrizes do projeto.
2. Componentes e rotas cobertos por testes unitários e/ou testes E2E do Playwright.
3. Acessibilidade validada (WCAG 2.1 AA) sem erros reportados pelo AxeBuilder.
4. Documentação de arquitetura, contratos e decisões registrada em `docs/v2/`.
5. Validação de links internos e externos sem referências quebradas (`npm run check:links`).
6. Submissão aprovada pelo par de revisão cruzada.
7. Auditoria independente final favorável sem riscos residuais não mitigados.
8. Nenhuma alteração não autorizada na branch `main`.
