# IA Engineer Academy

> **Da teoria à arquitetura, da arquitetura ao código, do código à compreensão.**

**A IA Engineer Academy é uma plataforma educacional gratuita, open-source e em português brasileiro dedicada ao estudo da Inteligência Artificial e da Engenharia de IA.** Seu propósito é ajudar pessoas a entender **como a IA funciona, como construir aplicações com ela e como avaliar sua qualidade, segurança e operação** — desde os fundamentos até decisões técnicas mais avançadas.

🌐 **[Acessar a plataforma gratuitamente](https://ai-engineering-academy-3cy.pages.dev/)**

## O que é este projeto?

É uma biblioteca de aprendizagem técnica e prática **focada em IA**, construída pela comunidade. Em vez de reunir cursos genéricos de todas as linguagens de programação, a Academy conecta explicações, diagramas, exemplos reais de código, trilhas de estudo e referências confiáveis para estudar tópicos como:

- **Modelos de linguagem:** tokens, embeddings, inferência e arquitetura de LLMs.
- **Construção de aplicações:** Python, APIs, FastAPI, Ollama e integração de modelos.
- **Engenharia de IA:** RAG, avaliação, segurança, arquitetura e operação de sistemas.
- **Caminhos profissionais:** competências e trilhas para atuar com aplicações e sistemas de IA.

Python e outras tecnologias aparecem **como ferramentas para entender e implementar sistemas de IA**, não como um catálogo genérico de cursos de programação.

**Não é um chatbot, um modelo de IA, um serviço de treinamento de LLMs nem uma plataforma de cursos pagos.** É um ambiente de estudo e consulta que busca explicar não só *o que* usar, mas *por que*, *como funciona por dentro* e *quais são os limites e as decisões de engenharia*.

## Para quem é?

- **Quem está começando:** pode construir uma base conceitual e seguir conteúdos relacionados.
- **Desenvolvedores:** podem estudar integrações, código, arquiteturas e boas práticas de aplicações com IA.
- **Profissionais e estudantes mais experientes:** podem aprofundar decisões técnicas, avaliação, segurança e operação.
- **Colaboradores:** podem propor correções, artigos, exemplos, recursos e melhorias na experiência de estudo.

## Como usar a Academy?

**Para estudar, basta abrir [o site](https://ai-engineering-academy-3cy.pages.dev/).** Não precisa instalar Node.js, usar terminal, criar conta ou fornecer cartão. A plataforma é pública e pode ser acessada pelo celular ou computador.

Explore a biblioteca, use a busca e o glossário, consulte as trilhas, abra os diagramas e examine os exemplos de código. Os recursos já disponíveis estão descritos abaixo; novas experiências educacionais são desenvolvidas e revisadas separadamente antes de serem anunciadas como prontas.

**Para contribuir com o projeto**, consulte [CONTRIBUTING.md](CONTRIBUTING.md), abra uma issue para apresentar uma proposta ou envie um pull request. Contribuições passam por revisão antes de entrar na versão pública. O código está disponível sob licença MIT; materiais de terceiros mantêm suas próprias licenças.

## Para desenvolvedores: executar localmente

Os comandos abaixo são **somente para quem deseja desenvolver, testar ou contribuir com o código do site**. Não são necessários para estudar na plataforma pública.

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
