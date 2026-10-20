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
