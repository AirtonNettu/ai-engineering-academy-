# ADR 0002 — Conteúdo tipado e diagramas acessíveis

Status: aceita na implementação, 2026-10-20.

Decisão: Zod valida catálogo JSON e referências; Markdown é separado da interface; diagramas lineares usam HTML com botões e conectores, sem React Flow. Shiki tokeniza código sem injetar HTML e carrega sob demanda.

Motivo: os diagramas ensinam etapas, não editam grafos. Evitar dependência de editor reduz peso e simplifica teclado. Schema único previne divergência de metadados.

Consequências: layouts novos podem exigir componentes específicos; schema não prova veracidade editorial. Links/citações precisam de revisão humana além da validação automatizada.
