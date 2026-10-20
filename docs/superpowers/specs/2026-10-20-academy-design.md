# Especificação — IA Engineer Academy

## Objetivo e restrições

Plataforma pública de estudo em português brasileiro, sem autenticação, cobrança ou dependência de serviços locais. O prompt mestre é a fonte de requisitos. Implementação autorizada em feat/academy-platform; sem merge/deploy. Conteúdo cobre quatro áreas curriculares com capítulos aprofundados exemplares e cobertura explicitamente limitada.

## Arquitetura escolhida

React + TypeScript + Vite, React Router, Markdown seguro via react-markdown, Shiki apenas com linguagens necessárias, busca textual local normalizada. Dados editoriais JSON separados de capítulos Markdown. Schema Zod valida dados, referências internas, arquivos e diagramas no build. React Flow foi considerado; um diagrama SVG/HTML com etapas e nós acessíveis é suficiente para o fluxo linear didático e reduz dependências. MDX foi descartado para não executar código editorial. Backend/CMS remoto foi descartado por custo e disponibilidade.

## Experiência

Tema claro/escuro persistido, fonte ajustável, navegação móvel, busca unificada, biblioteca filtrável, leitor com índice, progresso local, cópia de código, glossário, três roadmaps, catálogo filtrável e explorador de arquivos. Identidade: papel claro, azul profundo, acento verde, tipografia de sistema legível. Diagramas são simulações didáticas identificadas; seleção de nó relaciona código e arquitetura.

## Contratos

Chapter: id, title, category, description, tags, concepts, sources, reviewedAt, status, codeFiles, diagrams, minutes. Roadmaps têm competências com capítulos opcionais e lacunas declaradas. Projetos têm árvore derivada de arquivos reais, explicações por arquivo/símbolo, dependências e execução. Busca indexa todos os tipos sem API. LocalStorage tem recuperação para JSON inválido e indisponibilidade.

## Exemplo executável

Python/FastAPI/HTTPX/Pydantic: POST /api/chat, entrada limitada, timeout, host configurado pelo operador, resposta sem streaming, erros HTTP consistentes e testes HTTP com transporte mockado. Sem execução remota pelo navegador. /health é liveness, não prova disponibilidade do Ollama.

## Qualidade

Vitest/Testing Library para busca, schema, persistência, leitor e interações; pytest para validação e erros de upstream; Playwright para navegação desktop/móvel e acessibilidade automatizada. Build inclui validação editorial e geração de sitemap a partir da origem configurada. CSP e headers estáticos sem inline scripts; CI Linux com cache, timeout, permissões read-only e sem deploy.

## Editorial e automação

Propostas futuras n8n/Ollama seguem JSON Schema, fontes HTTPS, base commit e revisão humana, com deduplicação por identificador e sem publicação automática. Site não se conecta aos serviços administrativos.

## Aceite

Os 17 critérios do prompt são mapeados em docs/requirements.md. Conteúdo e exemplos devem existir, não apenas títulos. Nenhuma afirmação de funcionamento com Ollama real sem execução. Deploy Cloudflare é apenas documentado.
