# ADR 0001 — Plataforma estática

Status: aceita na implementação, 2026-10-20.

Contexto: conteúdo público, custo desejado zero, leitura independente de serviços locais e sem login.

Decisão: React/TypeScript/Vite com conteúdo Git e busca local. Sem backend, banco remoto ou autenticação. Cloudflare Pages apenas como destino futuro.

Alternativas: CMS/backend adicionariam operação e dependência externa sem requisito funcional. MDX permitiria código editorial executável; Markdown seguro é suficiente.

Consequências: operação simples; progresso não sincroniza; conteúdo exige build; leitura depende de JS enquanto não houver prerender completo. Busca local adequada à cobertura atual.
