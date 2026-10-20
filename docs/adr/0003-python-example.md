# ADR 0003 — Exemplo Python independente

Status: aceita na implementação, 2026-10-20.

Decisão: exemplo executável em examples/fastapi-ollama com composição explícita, cliente HTTP compartilhado pelo lifespan, configuração por ambiente e transporte mockável. O explorador importa esses mesmos arquivos como texto.

Motivo: código e demonstração não podem divergir. Sem backend público, não há inferência remota ou cobrança. Testes mockados executam contratos e falhas sem modelos online.

Consequências: testes não avaliam qualidade de IA; inferência real requer hardware e modelo. Novas capacidades precisam de contrato e testes antes de inclusão.
