# Hospedagem estática — destino futuro

Nenhum deploy de produção está autorizado ou configurado. O workflow de qualidade não publica. Este documento descreve o procedimento para quando o proprietário aprovar.

## Cloudflare Pages

1. Confirme a modalidade gratuita e os limites vigentes na documentação oficial https://developers.cloudflare.com/pages/ . Não contrate recursos pagos ou serviços que exijam cartão.
2. Após aprovação, crie um projeto Pages conectado ao repositório e escolha explicitamente a branch de produção aprovada. Não use a branch de trabalho como produção por acidente.
3. Node 24; comando npm ci && npm run build; diretório de saída dist. Não há Functions nem backend necessário.
4. Defina SITE_URL com a origem HTTPS aprovada, por exemplo a origem real de Pages ou domínio próprio, sem caminho. Não inclua tokens em variáveis VITE_.
5. Faça a validação de ambiente de revisão autorizada, incluindo carregamento direto de /capitulos/rag e /projetos/fastapi-ollama.
6. Confira _headers e _redirects, canonical, sitemap, robots e ausência de chamadas administrativas no navegador. Deploy e merge na main exigem autorização explícita do proprietário.

Os serviços Pages leem _headers/_redirects; vite preview não aplica esses headers. O fallback SPA resolve rotas não correspondidas. HTML por rota fornece metadados; conteúdo ainda é renderizado por JS. O servidor pode retornar HTTP 200 para uma rota desconhecida (soft 404), com mensagem 404 na interface. Para SEO rigoroso em escala, planejar prerender/controle de status.

## Indexação

Sem SITE_URL, robots.txt contém Disallow: / para não indexar previews sem identidade. Com origem aprovada, o build gera sitemap.xml com as rotas públicas editoriais e robots permite leitura, excluindo busca. Não há domínio oficial inventado. Não publique um sitemap de domínio de teste.

## Operação a R$ 0

Assets estáticos não precisam de n8n/Ollama. A gratuidade depende das franquias vigentes do provedor/GitHub; monitore o consumo antes de ativar recursos adicionais. Não há API com cobrança por token ou deploy automático nesta implementação.

## Reversão

Guarde o SHA de cada build aprovado. Use uma publicação anterior aprovada no provedor se precisar reverter; não faça force push nem reescreva main. Preferências locais de visitantes não são migradas por deploy.

## Rotas de aprendizagem avançada

O mesmo build estático inclui `/laboratorios`, suas três páginas, `/flashcards`, `/meus-dados` e `/estudar/:id`. Mantenha o fallback SPA existente. Dados e percursos privados não entram no sitemap; nenhum backend é necessário. Esta alteração não autoriza nem executa deploy.
