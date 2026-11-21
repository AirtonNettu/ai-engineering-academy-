# ADR-002: Expansão do Atlas de Sistemas de IA e Modelo Taxonômico

**Status:** Proposto  
**Data:** 2026-11-21  
**Autor:** Equipe 1 — Arquitetura (Agente 02) & Equipe 3 — Engenharia de IA (Agente 08)  
**Revisor:** Agente 03 (Architecture Reviewer)

---

## 1. Contexto e Problema

O **Atlas de Arquiteturas** (`/arquiteturas`) existente é um dos pontos altos da IA Engineer Academy, fornecendo diagramas interativos em SVG com navegação passo a passo, play/pause e vinculação entre desenho técnico e blocos de código. Atualmente, possui 5 diagramas:

1. Pipeline de RAG
2. FastAPI + Ollama (HTTP)
3. Como um LLM gera texto
4. MCP e agentes com limites
5. Treinamento de uma rede pequena

Com o avanço veloz da engenharia de IA moderna, tornou-se indispensável adicionar diagramas de arquiteturas cruciais:

- **Mixture of Experts (MoE)** (Top-K Gating, esparsidade de parâmetros e roteamento).
- **Speculative Decoding & KV-Cache Sharing** (Aceleração de inferência sem perda de qualidade).
- **Loop Agêntico Completo (ReAct + Memory + Tool Use)**.
- **RAG Híbrido** (Fusão de busca densa + esparsa BM25 + Cross-Encoder Reranker).

O desafio arquitetural é: **Como expandir o Atlas sem duplicar componentes, sem inflar o bundle e sem quebrar o diagrama original da home page?**

---

## 2. Decisão

Adotamos a **Reutilização Integral do Motor SVG Declarativo (`Diagram.tsx`) com Expansão de Catálogo**:

1. **Preservação da Home:** O diagrama principal da página inicial (`src/pages/Home.tsx`), que renderiza o fluxo didático do RAG, permanece inalterado em código, estilo e comportamento.
2. **Reaproveitamento de Componente:** As novas arquiteturas serão cadastradas diretamente em `content/catalog.json` sob a chave `"diagrams"` e consumirão exatamente a mesma máquina de estados de `src/components/Diagram.tsx` (que já lida com nós interativos, setas de fluxo, avanço temporal de 2,4s e pausa).
3. **Seleção Unificada por Query Parameter:** A rota permanece estritamente `/arquiteturas`, permitindo navegar entre as 9 arquiteturas através dos botões de filtro existentes e URL com query param `?diagrama=<id>`.
4. **Vinculação com Capítulos:** Cada nova arquitetura do Atlas apontará para o capítulo editorial correspondente (ex: MoE aponta para `/capitulos/inferencia-eficiente#moe`, Speculative Decoding para `/capitulos/llm-inferencia#especulativa`).

---

## 3. Alternativas Consideradas

| Alternativa                                                          | Prós                                                                                                                          | Contras                                                                                                                    | Decisão                                                           |
| :------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| **A. Adotar Biblioteca Externa de Grafos (React Flow ou Cytoscape)** | Recursos avançados de arrastar e soltar.                                                                                      | Aumenta o bundle em mais de 150 KB; exige código CSS complexo; quebra a consistência visual com os 5 diagramas existentes. | **Rejeitada.** Viola as diretrizes de performance e simplicidade. |
| **B. Criar Páginas Separadas para cada Nova Arquitetura**            | Arquivos isolados.                                                                                                            | Fragmenta a navegação; duplica templates de página; prejudica a experiência unificada do estudante.                        | **Rejeitada.** Duplicação desnecessária de rotas.                 |
| **C. Extensão Declarativa no Motor SVG Existente**                   | 100% de consistência visual; zero dependências adicionadas; acessível por teclado; suporte nativo a `prefers-reduced-motion`. | Exige desenho cuidadoso das coordenadas dos nós no SVG nativo.                                                             | **Aprovada.**                                                     |

---

## 4. Consequências

### Positivas

- Zero impacto no tempo de carregamento da plataforma (SVGs vetoriais leves).
- Acessibilidade preservada de forma homogênea em todas as arquiteturas.
- O estudante experimenta a mesma interface fluida de navegação passo a passo em todos os temas.
- Diagrama da home continua intocado e estável.
