# Modelo editorial

`content/catalog.json` é a fonte de metadados. `src/lib/content.ts` define schema Zod e verifica unicidade e referências cruzadas. Tipos da interface são inferidos do schema.

| Campo de capítulo  | Regra                                                              |
| ------------------ | ------------------------------------------------------------------ |
| id                 | slug estável único; arquivo content/chapters/id.md                 |
| title, description | texto não vazio em pt-BR                                           |
| category           | id de uma das áreas                                                |
| tags               | termos de pesquisa não vazios                                      |
| concepts           | ids existentes no glossário                                        |
| related            | ids de capítulos publicados                                        |
| sources            | título e URL HTTPS, ao menos uma                                   |
| reviewedAt         | data ISO real YYYY-MM-DD                                           |
| status             | revisado-tecnicamente para conteúdo publicado                      |
| codeFiles          | caminhos existentes no projeto educacional                         |
| diagrams           | ids de diagramas existentes                                        |
| minutes            | inteiro positivo; estimativa editorial de estudo, incluindo código |

## Adicionar conteúdo

1. Escreva um capítulo original Markdown em content/chapters; use headings H2 únicos para índice.
2. Adicione metadados no catálogo, fontes primárias e data efetiva da revisão técnica.
3. Explique conceito, mecanismo, arquitetura, uso, limitações e implementação. Pseudocódigo deve ser identificado; nunca o apresente como testado.
4. Conecte capítulos, glossário, diagrama e arquivos existentes. Atualize trilhas apenas quando a relação fizer sentido; leitura relacionada não é cobertura integral de uma competência.
5. Execute npm run validate:content e npm run check. Novos arquivos do exemplo também precisam entrar no catálogo.
6. Abra PR com justificativa, fontes, licença e revisão humana. Nunca publique rascunhos gerados automaticamente.

## Markdown seguro

HTML é ignorado; não há MDX nem execução JavaScript. Código é texto tokenizado em spans React. Imagens editoriais remotas são desabilitadas. O validador usa AST Markdown, incluindo títulos e definições referenciais, sem interpretar exemplos em blocos de código. Links relativos ambíguos e URLs de script são proibidos; use /rota, #âncora ou URL externa HTTPS. Links internos devem apontar para rotas/âncoras conhecidas; fontes usam HTTPS. Schema valida estrutura, não veracidade: revisão humana continua obrigatória.

## Evolução

Áreas são extensíveis. Glossário aponta capítulos; trilhas apontam leituras opcionais e sinalizam ausências. Diagramas têm nós consultáveis e caminhos de arquivo opcionais; projetos descrevem responsabilidades e símbolos. Campos novos devem ser adicionados ao schema antes de serem consumidos pela interface. Contrato de proposta futura em content/editorial-proposal.schema.json.
