# IA Engineer Academy

Plataforma educacional pública, gratuita e em português brasileiro para compreender e implementar sistemas de IA. Sem cadastro, backend público, analytics ou APIs pagas. O site funciona independentemente de Ollama, n8n e do computador do proprietário.

## Executar

Node.js 24+ e npm:

```bash
npm ci
npm run dev
```

Vite informa o endereço local (porta 5173 por padrão). Para inspecionar a versão compilada:

```bash
npm run build
npm run preview
```

Se o cache padrão não for gravável, use `npm ci --cache /tmp/academy-npm-cache`. Não há segredo ou `.env` necessário para o frontend. `SITE_URL=https://seu-dominio-aprovado` é opcional no build e necessário para gerar sitemap/canonical e habilitar indexação. Sem domínio configurado, robots bloqueia indexação de ambientes de teste.

## Funcionalidades implementadas

- Biblioteca com quatro áreas curriculares e seis capítulos completos: HTTP/APIs; Python e arquitetura; LLMs e inferência; RAG; FastAPI/Ollama; segurança, avaliação e operação.
- Leitor com índice, fontes, data de revisão, código copiável, fonte ajustável, relações entre capítulos e progresso local.
- Busca unificada por capítulos, conceitos, trilhas, projeto, recursos, skills e referências. Sem servidor de pesquisa.
- Três roadmaps com etapas selecionáveis e distinção entre leituras disponíveis e lacunas editoriais.
- Três diagramas com nós consultáveis, etapas e reprodução didática: RAG, LLM e FastAPI/Ollama.
- Explorador com pastas expansíveis, arquivos reais completos, numeração de linhas, Shiki, responsabilidade, símbolos e imports. Links de diagrama para arquivos.
- Glossário interligado; catálogo com 17 referências oficiais/diretórios e filtros por dez especialidades.
- Tema claro/escuro, layout móvel, navegação por teclado e preferências locais.
- Validação de schema/referências, contrato editorial futuro e CI sem deploy.

## Estrutura

```text
content/                       # catálogo, capítulos Markdown e contrato editorial
src/
  components/                  # layout, Markdown seguro, código e diagramas
  pages/                       # biblioteca, leitor, pesquisa, trilhas e explorador
  lib/                         # schema, busca, persistência e contratos
  test/                        # testes de componentes e integração
examples/fastapi-ollama/        # backend educacional independente e seus testes
scripts/                       # validação, metadados estáticos e propostas
public/                        # identidade, headers de segurança e fallback SPA
e2e/                           # Playwright desktop/móvel e axe
.github/workflows/quality.yml   # um workflow de qualidade, sem publicação
docs/                          # arquitetura, aceite, ADRs e operação
```

## Verificações

```bash
npm run check
npx playwright install chromium
npm run test:e2e
```

Em uma máquina com Chromium instalado pode-se evitar download: `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`. Não desative verificação TLS para instalar ferramentas.

O projeto Python tem seus próprios comandos em [examples/fastapi-ollama/README.md](examples/fastapi-ollama/README.md). Testes usam mocks de rede e não precisam de Ollama. A integração com modelo real é opcional e não é comprovada por esses testes.

Veja [documentação de testes](docs/testing.md), [requisitos](docs/requirements.md), [arquitetura](docs/architecture.md), [modelo editorial](docs/content-model.md), [contribuição](CONTRIBUTING.md), [deploy futuro](docs/deployment.md) e [automação editorial](docs/editorial-automation.md).

## Cobertura e limites

Os capítulos são exemplos aprofundados, não um curso completo de todos os tópicos curriculares. As trilhas sinalizam competências ainda sem capítulos dedicados. Diagramas são simulações didáticas, não execuções de modelos. Não existe integração operacional n8n/Ollama neste site, publicação automática, sincronização de progresso ou certificação de skills de terceiros.

Revisão técnica editorial realizada durante a implementação; revisão independente de especialistas é bem-vinda via PR. Site depende de JavaScript para interatividade e leitura; metadados específicos por rota são gerados no build, mas ainda não há SSR do conteúdo. Compartilhamento e indexação reais dependem de domínio e hospedagem aprovados. Nenhum deploy de produção é realizado por este repositório.

## Licença

Código e explicações originais sob [MIT](LICENSE). Fontes externas permanecem sob as licenças dos respectivos autores; links não transferem direitos de reprodução. Não copiamos capítulos de terceiros.
