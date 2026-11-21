# ADR-003: Observatório de IA com Métricas Verificáveis e Proveniência de Dados

**Status:** Proposto  
**Data:** 2026-11-21  
**Autor:** Equipe 4 — Observatório (Agente 10 & Agente 11) & Equipe 1 — Arquitetura (Agente 01)  
**Revisor:** Agente 03 (Architecture Reviewer)

---

## 1. Contexto e Problema

O ecossistema de modelos de linguagem e engenharia de IA sofre com excesso de alegações de marketing, benchmarks contaminados por data leakage e números de velocidade desprovidos de contexto de hardware e metodologia de amostragem.

A IA Engineer Academy 2.0 necessita de um **Observatório de Inteligência Artificial** (`/observatorio`) que permita aos engenheiros comparar modelos de forma séria e verificável:

- Benchmarks canônicos de capacidade e raciocínio (MMLU-Pro, GSM8K, HumanEval, Chatbot Arena ELO).
- Métricas de engenharia e inferência (Throughput em tokens/s, TTFT, impacto de quantização AWQ/GPTQ/GGUF, consumo de VRAM).

A regra fundamental inegociável é: **Não inventar métricas, benchmarks ou medições fictícias**. Toda informação deve ter proveniência explícita e reproduzível.

---

## 2. Decisão

Adotamos uma **Metodologia Estrita de Proveniência Primária e Visualização em Gráficos SVG Acessíveis**:

1. **Fontes Primárias Auditadas:** Todas as pontuações e métricas devem derivar estritamente de:
   - _LMSYS Chatbot Arena_ (Hugging Face Leaderboard aberto).
   - _OpenCompass / Open LLM Leaderboard_ (Hugging Face / Repositórios abertos).
   - _Artigos técnicos oficiais dos modelos_ (Technical Reports com links DOI/arXiv).
   - _Benchmarks de engenharia de serving_ executados em frameworks de código aberto (vLLM, Ollama, SGLang) com especificação exata do hardware (ex: 1x NVIDIA RTX 4090 24GB ou 1x A100 80GB PCIe).
2. **Registro de Metadados de Avaliação:** Cada medição armazena a data de coleta, método (zero-shot, 5-shot, CoT), tamanho de contexto testado e URL da fonte.
3. **Componentes Gráficos em SVG Nativo Acessível (`ObservatoryCharts.tsx`):**
   - Gráficos de barras comparativos e gráficos de dispersão (trade-off entre qualidade vs latência) construídos diretamente em SVG sem bibliotecas pesadas de terceiros (sem Chart.js, D3 ou Recharts).
   - Cada gráfico inclui uma representação alternativa oculta em tabela HTML semântica (`<table className="sr-only">`), garantindo acessibilidade plena para leitores de tela.

---

## 3. Alternativas Consideradas

| Alternativa                                                        | Prós                                                                                                | Contras                                                                                                                       | Decisão        |
| :----------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------- | :------------- |
| **A. Dados Estimados / Sintéticos de Simulação**                   | Fácil preenchimento de métricas.                                                                    | **Inaceitável.** Viola a integridade científica da academia e ensina dados errados aos estudantes.                            | **Rejeitada.** |
| **B. Incorporar Iframes de Leaderboards Externos**                 | Menos esforço de dados.                                                                             | Falha sem internet; quebra CSP com `frame-src`; design inconsistente; dependência de sites de terceiros que podem sair do ar. | **Rejeitada.** |
| **C. Ingestão Curada com Rastreabilidade Estrita e SVGs Próprios** | 100% confiável; visual integrado ao tema claro/escuro; sem chamadas externas; conformidade com CSP. | Exige esforço contínuo de curadoria e teste de schemas.                                                                       | **Aprovada.**  |

---

## 4. Consequências

### Positivas

- Plataforma torna-se referência em integridade técnica e transparência para a comunidade de engenharia de IA.
- Gráficos carregam instantaneamente e respondem à alternância de tema claro/escuro nativamente via variáveis CSS.
- Estudantes com deficiência visual conseguem auditar todos os números através da tabela semântica de fallback.
