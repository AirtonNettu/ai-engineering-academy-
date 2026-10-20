# ADR 0004 — Aprendizagem local e laboratórios determinísticos

Status: aceita na implementação da Issue #2, 2026-10-20.

## Contexto

A plataforma estática precisa de estudo guiado, revisão e laboratórios reais, sem backend obrigatório, APIs pagas ou GPU. URLs anteriores precisam continuar válidas. Profundidade editorial e senioridade profissional têm significados diferentes.

## Decisões

1. Capítulos Markdown mantêm três âncoras progressivas e metadados validados; o texto original dos seis capítulos permanece. Roadmaps têm níveis contextualizados independentes dessas camadas.
2. Cartões são conteúdo editorial versionado. Estado de estudo é separado, validado por Zod e salvo em localStorage com backup JSON. IndexedDB foi descartado para o volume atual, evitando complexidade sem benefício demonstrado. Importação substitui mediante confirmação, sem somar contadores potencialmente duplicados.
3. Revisão usa intervalos fixos e explícitos. Não chamamos isso de modelo adaptativo de memória; métricas são autodeclaradas e baseadas em eventos reais.
4. Matemática é TypeScript puro: rede pequena batch/gradiente, atenção de uma cabeça e cosseno/ranking. Interface importa os mesmos módulos que testes e painel de fontes. Inicialização/dataset fixos permitem reprodução sem bibliotecas de ML ou pesos externos.
5. SVG fornece diagrama, seleção e gestos. React Flow/Canvas não foram acrescentados: os grafos pequenos não precisam de edição geral e SVG facilita semântica, teclado e leitura de números. Atlas distingue fluxo principal e componentes opcionais; projeção 2D dos embeddings não altera a busca em 4D.
6. Playback é opt-in, limitado e limpo no unmount; movimento reduzido desacelera atualizações e elimina transições de CSS. Código e conteúdos são carregados por rota ou demanda.

## Consequências

Sem custo de infraestrutura e sem dados enviados a terceiros. Não há sincronização ou avaliação automática de aprendizagem. Exemplos pequenos não medem desempenho/generalização de LLMs. Papéis profissionais e links são guias contextualizados, não certificações. Expansões devem manter limites numéricos, gestos e acessibilidade testados.
