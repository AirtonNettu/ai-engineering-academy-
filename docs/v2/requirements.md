# Requisitos do Sistema — IA Engineer Academy 2.0

## Requisitos Funcionais, Não Funcionais e Mapeamento de Preservação

Este documento estabelece as especificações de requisitos para a versão 2.0, detalhando as capacidades a implementar, as restrições arquiteturais obrigatórias e as salvaguardas para impedir qualquer duplicação de funcionalidades existentes.

---

## 1. Mapeamento de Funcionalidades Existentes (Baseline 1.0)

Para assegurar o princípio de **não duplicação**, mapeamos a infraestrutura e os recursos já consolidados no repositório:

| Recurso / Módulo                 | Arquivos Principais                                                           | Responsabilidade Existente                                                                                | Diretriz de Preservação 2.0                                                                                                                          |
| :------------------------------- | :---------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Página Inicial (Home)**        | `src/pages/Home.tsx`, `src/components/Diagram.tsx`                            | Apresentação da plataforma, jornada de estudos e diagrama animado principal do RAG.                       | **INTOCÁVEL.** O diagrama original da home e sua apresentação não devem sofrer alterações visuais ou estruturais.                                    |
| **Biblioteca de Capítulos**      | `src/pages/Library.tsx`, `src/pages/ChapterPage.tsx`, `content/chapters/*.md` | Leitura dos 15 capítulos existentes organizados em 3 profundidades (Conceito, Prática, Produção).         | Preservar integralmente os 6 slugs originais, suas âncoras e a taxonomia existente.                                                                  |
| **Atlas de Arquiteturas**        | `src/pages/Architectures.tsx`, `src/components/Diagram.tsx`                   | Navegação por 5 diagramas interativos (RAG, HTTP, LLM, Agentes MCP, Treinamento Neural).                  | **Estender** a lista de diagramas no mesmo componente via `content/catalog.json`, sem duplicar o motor SVG nem criar nova rota de atlas.             |
| **Laboratórios Matemáticos**     | `src/pages/Labs.tsx`, `src/labs/*.ts`                                         | 3 laboratórios puros com cálculos em TypeScript (Rede Neural 2-3-1, Atenção Multi-Head e Embeddings 4D).  | Preservar integridade matemática, sem alterar cálculos ou substituir por animações fictícias.                                                        |
| **Busca em Memória**             | `src/pages/SearchPage.tsx`, `src/lib/search.ts`                               | Busca lexical estática com normalização Unicode em memória (capítulos, flashcards, recursos e glossário). | **Estender** o índice existente em `search.ts` para indexar artigos científicos e modelos do Centro de Pesquisa, sem adicionar bibliotecas externas. |
| **Flashcards e Estudo Espaçado** | `src/pages/Flashcards.tsx`, `src/pages/Study.tsx`, `src/learning/*`           | Algoritmo de repetição espaçada local (SM-2 adaptado) em `localStorage`.                                  | Reutilizar para novos conceitos introduzidos nos capítulos expandidos.                                                                               |
| **Backend de Exemplo Python**    | `examples/fastapi-ollama/`                                                    | Demonstração pedagógica isolada de API FastAPI com Ollama mockado.                                        | Manter isolado como material de referência, sem transformar em dependência de runtime do site.                                                       |

---

## 2. Requisitos Funcionais da Versão 2.0 (RF)

### 2.1 Centro de Pesquisa Científica (RF-01 a RF-06)

- **RF-01 (Catálogo Curado de Artigos):** A plataforma deve disponibilizar uma seção pública `/pesquisa` contendo uma curadoria de trabalhos científicos seminais e contemporâneos em IA (ex: Transformers, RoPE, LoRA, FlashAttention, DPO, MoE, RAG Híbrido).
- **RF-02 (Filtros e Metadados Científicos):** Cada artigo deve exibir: título, autores, data de publicação, abstract traduzido/resumido em pt-BR, identificador DOI ou arXiv, link aberto para o PDF/página oficial e classificação de tópicos. Deve permitir filtragem por área temática e busca por texto.
- **RF-03 (Catálogo de Modelos e Datasets):** O Centro de Pesquisa deve listar modelos e datasets abertos de referência (ex: Llama 3, DeepSeek, Mistral, Qwen, datasets MMLU, GSM8K, FineWeb), com metadados de licença aberta (Apache 2.0, MIT, OpenRAIL), arquitetura base e parâmetros.
- **RF-04 (Ponte Pedagógica Pesquisa → Prática):** Cada entrada do Centro de Pesquisa deve conectar-se explicitamente aos capítulos editoriais, diagramas do Atlas e laboratórios pertinentes (ex: paper do _Attention is All You Need_ conecta ao capítulo de Transformers, ao diagrama de LLM e ao Laboratório de Atenção).
- **RF-05 (Proveniência e Rastreabilidade):** Todos os dados científicos devem conter link direto para suas fontes primárias abertas (arXiv, OpenAlex, Hugging Face Hub, Papers with Code). É terminantemente proibido exibir artigos inexistentes ou referências fictícias.
- **RF-06 (Funcionamento Offline-First):** O catálogo de pesquisa deve ser empacotado estaticamente em tempo de compilação (snapshot JSON) e carregado sob demanda via lazy loading, garantindo navegação instantânea sem depender de chamadas síncronas a APIs externas pelo navegador.

### 2.2 Expansão do Atlas de Sistemas de IA (RF-07 a RF-09)

- **RF-07 (Novas Arquiteturas Interativas):** O Atlas existente (`/arquiteturas`) deve ser expandido com 4 novas arquiteturas essenciais da engenharia de IA:
  1. **Mixture of Experts (MoE):** Roteador de tokens (Top-K Gating), especialistas esparsos (FFN Experts) e agregação ponderada.
  2. **Speculative Decoding & KV-Cache Sharing:** Modelo rascunho rápido gerando tokens candidatos validados em lote pelo modelo alvo, reaproveitando o cache de chaves/valores.
  3. **Loop Agêntico Completo:** Ciclo de raciocínio ReAct (Pensamento → Ação → Observação), chamada de ferramentas (Tool Calling via MCP) e memória de curto/longo prazo.
  4. **Pipeline RAG Híbrido:** Ingestão multiformato, busca híbrida (Dense Vector + Sparse BM25), fusão de rankings recíprocos (RRF) e reclassificação via Cross-Encoder.
- **RF-08 (Controles e Acessibilidade dos Diagramas):** As novas arquiteturas devem utilizar exatamente o mesmo motor SVG interativo de `src/components/Diagram.tsx`, preservando controles de play/pause, avanço de etapas por teclado e visualização de código.
- **RF-09 (Zero Duplicação de Rota):** As novas arquiteturas devem ser selecionadas via o seletor já existente na página `/arquiteturas` (e parâmetro de busca `?diagrama=<id>`), sem criação de rotas paralelas.

### 2.3 Observatório de Inteligência Artificial (RF-10 a RF-13)

- **RF-10 (Painel de Métricas Verificáveis):** A plataforma deve disponibilizar a rota `/observatorio` apresentando análises quantitativas de modelos em duas dimensões:
  1. **Métricas de Capacidade e Raciocínio:** Resultados em benchmarks canônicos (MMLU-Pro, GSM8K, HumanEval, MATH, Chatbot Arena ELO).
  2. **Métricas de Engenharia e Inferência:** Throughput comparativo (tokens/segundo), TTFT (_Time to First Token_), consumo de VRAM por tamanho de contexto e impacto de quantizações (FP16 vs AWQ vs GGUF Q4_K_M).
- **RF-11 (Proveniência Explícita de Cada Ponto de Dado):** Cada métrica exibida deve apontar para a fonte primária e a metodologia de medição (ex: LMSYS Leaderboard, OpenCompass, relatórios técnicos oficiais dos modelos ou benchmarks executados em vLLM com hardware documentado).
- **RF-12 (Gráficos SVG Acessíveis e Leves):** As comparações gráficas devem ser renderizadas através de componentes SVG acessíveis nativos em React, sem bibliotecas pesadas de gráficos (como Chart.js ou D3), contendo tabelas de dados equivalentes para leitores de tela.
- **RF-13 (Filtros Multidimensionais sem Rastreamento):** Permitir filtrar métricas por classe de modelo (Pesos Abertos vs API Proprietária), tamanho de parâmetros (<10B, 10B-70B, >70B) e modalidade de inferência.

### 2.4 Expansão Editorial em IA Generativa (RF-14 a RF-16)

- **RF-14 (Capítulos Aprofundados de IA Generativa):** Integrar ao catálogo editorial 4 aprofundamentos técnicos essenciais:
  1. _Modelos de Raciocínio e Cadeia de Pensamento (Reasoning LLMs):_ Arquitetura de inferência estendida, tokens ocultos de raciocínio, amostragem e alinhamento via RL.
  2. _Fine-Tuning Eficiente (PEFT / LoRA / QLoRA):_ Adaptação de baixo rank, decomposição matricial $W = W_0 + B \cdot A$, quantização de 4 bits (NF4) e cálculo de memória de treinamento.
  3. _Avaliações Contínuas e LLM-as-a-Judge:_ Protocolos de calibração humana, combate a vieses de posição e verbosidade, e métricas G-Eval/MT-Bench.
  4. _Serving e Otimizações de Inferência em Larga Escala:_ PagedAttention, Continuous Batching, Chunked Prefill e paralelismo tensorial.
- **RF-15 (Três Profundidades Ordenadas):** Cada novo tópico editorial deve respeitar rigorosamente a regra das três profundidades estabelecidas no projeto: Conceito Fundamental, Implementação Prática e Considerações de Produção.
- **RF-16 (Flashcards e Exercícios Integrados):** Para cada novo capítulo/tópico, incluir no mínimo 3 cartões de revisão ativa integrados ao sistema de repetição espaçada local.

---

## 3. Requisitos Não Funcionais (RNF)

- **RNF-01 (Arquitetura 100% Estática):** A aplicação deve compilar integralmente para arquivos estáticos (`HTML`, `CSS`, `JS`, `JSON`) distribuíveis pelo Cloudflare Pages. Não é permitida a exigência de um servidor Node.js dinâmico em produção.
- **RNF-02 (Custo Operacional Zero — R$ 0):** A plataforma não deve depender de nenhuma API paga, serviço com cartão de crédito obrigatório ou infraestrutura com custo recorrente.
- **RNF-03 (Privacidade e Ausência de Telemetria):** Não coletar endereços IP, dados de identificação pessoal, eventos analíticos ou dados de navegação. Todos os dados de progresso e preferências devem permanecer exclusivamente no `localStorage` do navegador do usuário (`academy:*`).
- **RNF-04 (Acessibilidade WCAG 2.1 Nível AA):** Todos os novos componentes, páginas, gráficos e diagramas devem atender às diretrizes de acessibilidade: suporte completo a navegação por teclado, foco visível, contraste mínimo de 4.5:1 para texto normal, suporte a leitores de tela com `aria-live` e obediência à preferência de `prefers-reduced-motion`.
- **RNF-05 (Orçamento de Performance e Assets):**
  - O bundle JavaScript inicial deve manter carregamento sob demanda via `React.lazy()` para todas as novas páginas (`/pesquisa`, `/observatorio`).
  - Nenhuma imagem rasterizada pesada não compactada; preferência absoluta por SVGs otimizados.
  - O First Contentful Paint (FCP) deve permanecer abaixo de 1.5s em redes convencionais.
- **RNF-06 (Segurança e Content Security Policy):**
  - Nenhum script inline inseguro (`unsafe-inline` em script-src permanece proibido).
  - Sanitização obrigatória de todo Markdown via AST (`mdast-util-from-markdown` / `react-markdown` configurado de forma segura sem HTML bruto).
  - Nenhum segredo ou chave de API privada exposta nas variáveis `VITE_*` ou no código fonte.
- **RNF-07 (Compatibilidade de Plataforma):** O código deve compilar e validar perfeitamente em ambientes Windows (PowerShell) e POSIX/Linux (Ubuntu da GitHub Actions).
- **RNF-08 (Testabilidade e Cobertura):**
  - Os módulos existentes com meta de 80% de cobertura V8 (`src/labs/*.ts` e `src/learning/*.ts`) não devem ter suas coberturas reduzidas nem seus testes removidos.
  - Novos utilitários de transformação e validação de dados devem possuir cobertura de testes unitários em Vitest.
  - Novas rotas devem ser auditadas por testes E2E com Playwright.
