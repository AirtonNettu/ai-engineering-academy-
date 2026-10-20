# Advanced Learning Experience Implementation Plan

> Execução: superpowers:executing-plans; domínios independentes podem seguir superpowers:dispatching-parallel-agents. Sem worktree adicional.

**Goal:** implementar integralmente Issue #2 preservando a plataforma pública existente.
**Architecture:** dados editoriais e locais separados; matemática pura e visualização React/SVG.
**Tech Stack:** React, TypeScript, Vite, Zod, Vitest, Playwright; dependências atuais.
**Spec:** docs/superpowers/specs/2026-10-20-advanced-learning.md

## Restrições globais

main abfa6fb; branch feat/advanced-learning-experience; pt-BR; estático; custo R$ 0; sem APIs/GPU/backend obrigatório; sem merge/deploy; slugs preservados.

## Review Focus

Dados importados inválidos/corrompidos, timezone/data de revisão, cleanup de animação/limites numéricos, gestos touch e teclado, referências editoriais e URLs antigas.

## Tarefas

1. [x] Conteúdo em três profundidades, fontes, cartões, glossário e roadmaps especializados. Arquivos: content/*, src/pages/Roadmaps.tsx e CSS próprio. Metadados: depths [{id,title,anchor}], labs [], implementation {label,url}; cartões {id,chapterId,front,back,difficulty,sourceUrl,reviewedAt}. Testar esquema/cobertura e linkagem, preservando conteúdo anterior. Commit por tarefa.
2. [x] Laboratórios reais. Arquivos src/labs/** e src/pages/Labs.tsx; rotas /laboratorios e /laboratorios/:labId. Funções puras com testes de matemática e UI. Play/pause/reset limitados, touch/teclado e fonte real exibida. Commit por tarefa.
3. [x] Persistência versionada, revisão espaçada e import/export. Arquivos src/learning/model.ts, scheduler.ts, useLearning.ts, testes. Testar relógio explícito, repetição, erros, migração, importação inválida e quota. Commit por tarefa.
4. [x] Percurso, flashcards e dados locais. Arquivos src/pages/Study.tsx, Flashcards.tsx, LearningData.tsx; integrar botão de estudo e profundidade no leitor. Testes de fluxo, retomada, estatísticas, filtros e import/export. Commit por tarefa.
5. [x] Atlas, catálogo/rotas/busca/SEO e navegação. Arquivos Diagram.tsx, AtlasCode.tsx, content.ts, search.ts, routes.ts, App/Layout, scripts. Testar referências, seletores, zoom/pan/reset e destinos. Commit por tarefa.
6. [x] Documentação, ADRs, aceite e CI. Atualizar README/AGENTS/docs; rodar suíte completa, revisão independente e correções. Push somente branch autorizada; tentar PR em rascunho e registrar bloqueio se a API continuar negada.

Evidências e limitações de entrega: docs/advanced-progress.md e docs/testing.md. A revisão independente foi tentada, mas interrompida por limite de uso; revisão técnica local concluída.
