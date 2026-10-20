# IA Engineer Academy — instruções de engenharia

- Plataforma educacional pública em pt-BR, gratuita e estática. Sem login, backend público, telemetria ou serviços pagos.
- Trabalhe em branch de tarefa; nunca faça merge na main, force push ou deploy de produção sem autorização explícita.
- Leia docs/requirements.md e docs/architecture.md. Mantenha os critérios de aceite rastreáveis.
- Conteúdo original em content/; exemplos executáveis em examples/. Não invente compatibilidades ou resultados de testes.
- Valide mudanças com npm run check e, para interface, npm run test:e2e. Para Python, siga examples/fastapi-ollama/README.md.
- Markdown não executa HTML nem JavaScript. Não use dangerouslySetInnerHTML com conteúdo não sanitizado.
- Preserve acessibilidade, navegação por teclado, tema, responsividade e reduced-motion.
- Não grave segredos. Automação editorial apenas propõe alterações revisadas por humanos.
- Cada tarefa de nuvem já é isolada; use o checkout existente, sem criar worktrees salvo pedido explícito.
- Commits por tarefa; alterações editoriais devem incluir fontes, data, status e validação de referências.

## Aprendizagem avançada (Issue #2)

- Preserve seis slugs originais e suas âncoras; cada capítulo publicado tem três profundidades ordenadas, implementação relacionada e ao menos três cartões editoriais.
- Profundidade de artigo não representa senioridade profissional. Roadmaps contextualizam autonomia, impacto e entregáveis.
- Matemática dos labs vive em src/labs/*.ts; UI, testes e painéis de fonte devem usar os mesmos arquivos. Não trocar cálculo real por animação fictícia.
- Mantenha limites de trabalho, pausa/cleanup, gestos de toque/mouse, teclado e reduced-motion. Projeção visual de embeddings não altera os vetores de ranking.
- Dados em academy:learning são privados e locais; mudanças de formato precisam de migração/validação e backup. Importação exige confirmação e não aceita IDs desconhecidos.
- Estatísticas só contam respostas dadas; conclusão do percurso é autodeclarada e não certificação. Nunca alegue retenção ou generalização medida por um exemplo pequeno.
- Ao editar conteúdo, execute validate:content e os testes de profundidade/cartões. Ao editar labs, mantenha testes de gradiente/convergência/softmax/cosseno e E2E de controles.
