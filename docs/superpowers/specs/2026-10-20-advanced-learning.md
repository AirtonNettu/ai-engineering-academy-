# Experiência de estudo avançada — Issue #2

Especificação de origem: docs/issues/2.md. Base: main abfa6fb. Branch: feat/advanced-learning-experience. Execução contínua explicitamente autorizada; sem merge/deploy.

## Decisões

Preservar SPA estática e rotas atuais. Não introduzir serviços externos nem novas dependências de produção. Preferir funções TypeScript puras para matemática, SVG/HTML acessível para visualização e localStorage versionado para pequenos registros de estudo. IndexedDB acrescentaria complexidade sem volume que a justifique. Dados de aprendizagem são validados ao ler/importar e o esquema não executa conteúdo importado.

Todos os capítulos terão seções fundamental/intermediária/avançada com âncoras únicas e metadados; a profundidade não significa senioridade profissional. Seis slugs existentes permanecem. Novos capítulos agrupam tópicos coerentes, sem placeholders. Cartões são editoriais com fonte e dificuldade.

Percurso: leitura fundamental → leitura intermediária → leitura avançada → arquitetura → implementação → flashcards. Concluir etapa exige ação explícita; retomar preserva posição. Botão de capítulo leva ao percurso. Revisão usa intervalos explicáveis (erro: dez minutos; acerto: 1, 3, 7, 14, 30 dias), não promete medir retenção. Exportação/importação JSON inclui progresso, etapas e cartões, com validação, limites e confirmação explícita antes de substituir dados. Limpeza só apaga chaves da Academy.

Laboratórios: rede pequena 2-3-1 treinada em exemplos fixos com forward/backprop verdadeiros, orçamento finito de passos e loss real; atenção com tokenização didática, Q/K/V, escala, softmax estável e máscara opcional; embeddings determinísticos com cosseno real/ranking e projeção sinalizada. Controles de toque/mouse/teclado, play/pause/reset, cleanup e reduced-motion. Não simular LLM ou embeddings comerciais.

Atlas: preservar diagrama atual por URL e aprofundar SVG navegável com zoom/pan, nós selecionáveis por teclado/toque, ícones, setas, legenda de opcionalidade, artigos e código real relacionado. Adicionar fluxo MCP/agentes sem fingir integração operacional.

Roadmaps: quatro especialidades com níveis contextuais júnior/pleno/sênior; pré-requisitos, autonomia, entregáveis, responsabilidade e links. Manter queries de trilha existentes. Busca/glossário/metadados/validação abrangem novos recursos.

## Aceite e qualidade

Matriz de aceite em docs/issue-2-acceptance.md: requisitos 1–7 e critérios finais da issue. Testes unitários de gradiente por diferença finita, convergência, softmax/cosseno/ranking, agendamento/estado/importação; testes UI de controle e progresso; E2E desktop/mobile incluindo acessibilidade, toque/arraste e regressão de URLs. npm run check, Playwright e pytest existentes continuam exigidos. Revisão independente final, correções com regressão e relatório honesto. Sem publicação automática ou dados enviados a terceiros.
