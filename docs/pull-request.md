# Experiência avançada de aprendizagem

Closes #2

Amplia a plataforma existente com 15 capítulos em três profundidades, 45 flashcards editoriais com revisão espaçada, quatro roadmaps especializados e percurso de seis etapas com retomada. Preserva slugs, âncoras, hospedagem estática e acesso público gratuito.

Os três laboratórios calculam no navegador: forward/backprop/SGD de uma rede XOR, Q/K/V/softmax causal e cosseno/ranking de vetores 4D. Possuem controles, limites, pausa, fonte real e interação por toque/mouse/teclado. O Atlas possui cinco arquiteturas com seleção, zoom/pan e relações com artigos/código. Dados locais têm migração, backup JSON validado e importação confirmada.

Validação local: `npm run check` (50 testes Vitest, lint, formato, esquema editorial, TypeScript e build), 26 testes Playwright em Chromium desktop/móvel com axe e 19 testes Python sem Ollama. Resultados detalhados e limites em docs/testing.md; aceite em docs/issue-2-acceptance.md.

A revisão final corrigiu pausa ao alterar orçamento e contraste da atenção causal. A tentativa de revisão independente foi interrompida por limite de uso; não equivale a aprovação independente. Fontes oficiais são citadas, mas disponibilidade de todos os destinos externos não foi auditada. Modelos Ollama reais, n8n, Cloudflare, dispositivo físico e leitores de tela não foram exercitados.

Sem dependências novas, backend obrigatório, serviço pago, merge ou deploy. Automação editorial permanece proposta revisável por humanos. Dados não sincronizam entre dispositivos; os cálculos pequenos são didáticos, sem alegação de treinamento de LLM ou generalização.
