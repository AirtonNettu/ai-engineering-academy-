# ADR 0005 — Leitura estática e verificação econômica

Status: implementada na consolidação, 21/10/2026.

## Contexto e evidência

A auditoria do HTML gerado encontrou apenas root vazio e metadados; todos os artigos dependiam de execução JavaScript. Isso limita leitura sem scripts e rastreadores que não renderizam JavaScript. Os 15 Markdown são públicos, pequenos, versionados e independentes de serviços.

## Decisão

Gerar somente a leitura dos capítulos no build Vite, com `renderToStaticMarkup` e ReactMarkdown seguro, sem HTML editorial executável ou imagens remotas. Âncoras usam o mesmo slug da UI; referências vêm dos mesmos metadados. O React substitui o root pela aplicação interativa ao iniciar. Não há novo backend, framework, dependência de runtime ou alteração de URLs/diagramas.

A alternativa de apenas metadados manteria o problema de leitura. SSR de toda a aplicação e hidratação parcial exigiriam resolver import.meta.glob, estado local e componentes dependentes do navegador, com complexidade desnecessária. O fallback proposto não tenta simular controles sem JS. Testes verificam 15 artigos sem JavaScript e retomada da UI com ele.

A origem de publicação é validada estritamente. Preview sem SITE_URL permanece noindex; rotas privadas de estudo nunca entram no sitemap. Open Graph é específico por rota e usa captura real PNG com URL absoluta quando a origem é configurada.

## Qualidade e custo

V8 mede integralmente todos os módulos puros de matemática e estado/agenda, com mínimo de 80% por arquivo em linhas, branches, funções e statements. Cobertura e invariantes matemáticos são complementares. O workflow único roda a suíte uma vez, publica tabela no resumo e mantém artefatos sete dias. Links internos e orçamento de bytes são gates determinísticos; destinos externos e Lighthouse são auditorias separadas para evitar instabilidade/consumo recorrente.

## Consequências e limites

Texto HTML e JS coexistem no download inicial do capítulo; há limite de escala e não há garantia de ranking/indexação. Fallback SPA pode devolver 200 para URL desconhecida. Conteúdo estático não inclui progresso/estado privado, diagramas ativos ou realce Shiki. Não é certificação de acessibilidade, segurança ou desempenho. Publicação, domínio e headers efetivos exigem validação humana no provedor.

O servidor de preview Vite resolve URLs limpas a arquivos `.html`, mas não a diretórios sem barra final. Um teste sem JavaScript expôs o fallback genérico; a saída foi ajustada a arquivos `.html` e rewrites exatos por rota antes do fallback. Há 86 regras exatas nesta cobertura; conferir os limites vigentes do provedor ao expandir o catálogo, sem pressupor capacidade ilimitada.
