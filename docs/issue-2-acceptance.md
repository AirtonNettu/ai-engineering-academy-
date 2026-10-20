# Aceite rastreável — Issue #2

Fonte completa: [issue preservada](issues/2.md). Base `main`: abfa6fb. Branch: feat/advanced-learning-experience. Sem merge/deploy.

| Requisito                   | Implementação concreta                                                                                       | Evidência                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Biblioteca profunda         | 15 capítulos, seis originais preservados, três camadas por artigo, fontes, referências e código relacionado  | advanced-content.test.ts, editorial-depths.test.ts, validate:content, links e leitura E2E |
| Roadmaps                    | quatro especialidades × três níveis; pré-requisitos, autonomia, responsabilidade, entregáveis e links        | testes editoriais/UI e seleção de trilha/etapa E2E                                        |
| Comparação de papéis        | artigo carreira-ai-engineer, distinção Software/Application/ML/Research/Operations e contexto organizacional | cobertura editorial; revisão de conteúdo                                                  |
| Percurso                    | seis etapas, conclusão explícita, pular sem concluir, voltar e retomar                                       | study-ui.test.tsx e E2E de retomada                                                       |
| Flashcards                  | 45 cartões, frente/verso, dificuldade, acertei/errei e fila agendada                                         | learning.test.ts, study-ui, E2E de revisão                                                |
| Persistência e privacidade  | migração de leitura, schema local, exportação/importação confirmada e limpeza                                | testes de corrupção, JSON inválido/IDs/versão/tamanho e E2E de arquivo real               |
| Neural Network Training Lab | forward, MSE, backprop, SGD, parâmetros e histórico reais, controles/limites                                 | gradiente por diferenças finitas em 13 parâmetros, convergência, UI e E2E                 |
| Attention Explorer          | X/Q/K/V, scores escalonados, softmax estável/causal, heatmap e saída                                         | testes de pesos/somas/máscara e interação                                                 |
| Embedding Explorer          | vetores 4D editoriais, cosseno/ranking, projeção com drag/pan/zoom                                           | matemática, teclado, PointerEvent touch/pinch e E2E                                       |
| Atlas                       | cinco fluxos, SVG com ícones/setas, zoom/pan, foco, seleção, opcionalidade e código real relacionado         | testes de seleção/escala/código, E2E, axe                                                 |
| Artigos profissionais       | API/treino, RAG/fine-tuning, testes não determinísticos, prontidão/segurança/custos e carreira               | docs/content-coverage.md e artigos autorais                                               |
| Pesquisa/glossário          | texto completo, labs, Atlas, estudo, conceitos e metadados                                                   | busca unitária, rotas e navegação E2E                                                     |
| Rotas e site anteriores     | todos os slugs/URLs preservados; leitor/tema/fonte/código continuam                                          | suíte existente mantida e ampliada; comparação de headings/prosa                          |
| Editorial futuro            | contrato n8n/Ollama/PR preservado; proposta deve preservar camadas/links                                     | editorial.test.ts; nenhuma integração operacional fingida                                 |
| Qualidade                   | lint, formato, typecheck, build, Vitest, Chromium desktop/móvel e pytest                                     | docs/testing.md; CI único com cache, timeout e cancelamento                               |
| Entrega                     | commits por tarefa, push somente da branch; PR preparado                                                     | docs/advanced-progress.md e descrição de PR                                               |

## Limitações reais

Sem inferência com modelo Ollama, treinamento PyTorch/LLM, automação n8n operacional ou publicação. A rede pequena treina de fato em JavaScript; não confundir esse experimento com treinamento de LLM. Vetores são manuais e atenção é uma cabeça didática. Testes automatizados não substituem avaliação com leitor de tela, dispositivo físico ou especialista editorial independente. Algumas fontes remotas não puderam ser consultadas, conforme cobertura. Falha de API GitHub pode impedir criar/consultar PR/CI remoto; registrar o resultado efetivo, não inventar link de PR criado.
