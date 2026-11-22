# Changelog

## 2.0.0 — 2026-11-21 (IA Engineer Academy 2.0 — Research & Engineering)

- **Centro de Pesquisa Científica (`/pesquisa`):**
  - Curadoria e ingestão estática de 26 artigos científicos seminais e contemporâneos (com arXiv, DOI e links abertos).
  - Catálogo de 16 modelos abertos de inteligência artificial e 10 datasets canônicos de treino/avaliação.
  - Conexões pedagógicas bidirecionais entre pesquisa acadêmica, capítulos teóricos, modelos e laboratórios interativos.
- **Atlas de Arquiteturas Expandido (`/arquiteturas?diagrama=<id>`):**
  - 4 novas arquiteturas com decomposição passo a passo: Mixture of Experts (`moe`), Speculative Decoding (`speculative`), Ciclo Agêntico ReAct (`agents-react`) e RAG Híbrido (`hybrid-rag`), totalizando 9 diagramas interativos.
  - Preservação estrita do diagrama da homepage (`llm-runtime`) e zero dependências pesadas de terceiros.
- **Observatório de Inteligência Artificial (`/observatorio`):**
  - Painéis de capacidade com métricas verificáveis (MMLU-Pro, GSM8K, HumanEval e Chatbot Arena ELO) com anotações explícitas de protocolo (DATA-02).
  - Painéis de engenharia de serving com medições reais e padronizadas em vLLM e Ollama (TTFT, decode tokens/s, VRAM em FP16 vs AWQ vs GGUF) em hardware documentado (DATA-01).
  - Gráficos SVG nativos responsivos com tabelas semânticas equivalentes para leitores de tela e zero violações WCAG.
- **Expansão Editorial em IA Generativa (FEATURE-01):**
  - 4 novos capítulos completos em três profundidades ordenadas:
    - _Modelos de Raciocínio e Cadeia de Pensamento (Reasoning LLMs)_ (`modelos-raciocinio`);
    - _Fine-Tuning Eficiente: PEFT, LoRA e QLoRA_ (`fine-tuning-peft`);
    - _Avaliações Contínuas e LLM-as-a-Judge_ (`llm-as-a-judge`);
    - _Serving e Otimizações de Inferência em Larga Escala_ (`serving-alta-escala`).
  - Total de 19 capítulos e 57 flashcards com repetição espaçada local.
- **Qualidade, Validação Contínua e Governança (DATA-03, QA-01, SEC-01):**
  - Script `scripts/validate-v2-data.ts` integrado aos pipelines de build e qualidade (`npm run check`).
  - Suíte de testes unitários e testes negativos em `src/test/data-validation.test.ts`.
  - Esclarecimento estrito de escopo de testes E2E em Chromium Desktop e Chromium com emulação móvel Pixel 7 (QA-01).
  - Auditoria independente final pelo Agente 20 sem alegação de risco zero ou vulnerabilidade absoluta (SEC-01).

## 1.0.0 — consolidação (PR #17)

- Reaproveitamento da governança proposta no PR #8, com manutenção, labels e Dependabot limitado.
- README com banner preservado e capturas reais; guia detalhado mantido em docs.
- Cobertura V8 dos cálculos e do estado local; validação de links e resumo de cobertura no workflow único de qualidade.
- Leitura estática segura de 15 capítulos, metadados/URLs limpas e noindex de previews/rotas privadas.
- Hierarquia de títulos, nomes acessíveis do Atlas, reflow do cabeçalho e estabilidade de carregamento corrigidos.
- Starlette/pytest atualizados para corrigir avisos conhecidos, com 19 testes e auditoria limpa.
- Referências de cartões, glossário, responsabilidades no Atlas e explicação de overlap revisados.
- Auditorias locais de segurança, editorial, acessibilidade, SEO e performance, com resultados e limitações documentados.

Não foi criada tag, release ou alteração da versão 1.0.0. Veja docs/consolidation/report.md para a evidência final desta branch.

## Histórico existente

- PR #1: plataforma estática pública, conteúdo técnico e exemplo FastAPI/Ollama.
- PR #4: aprendizagem avançada, 15 capítulos, 45 cartões, quatro trilhas e três labs reais.
- PR #6: correção do layout dos controles dos laboratórios.
- PR #7: apresentação visual e banner SVG no README.

Esses marcos são PRs reais; não representam versões/release publicadas.
