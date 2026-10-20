# Automação editorial futura: n8n + Ollama

Estado: **contratos e documentação implementados; integração operacional não configurada**. O site estático não conhece hosts, tokens ou disponibilidade desses serviços.

## Fluxo proposto

1. n8n privado coleta apenas fontes autorizadas (documentação oficial, RSS e changelog), respeitando licença, robots e termos aplicáveis.
2. Normaliza URLs e identifica revisões por URL, versão e hash; não transforma todo item em publicação.
3. Ollama em rede privada auxilia na comparação e redação. Documentos externos são dados não confiáveis, nunca comandos administrativos.
4. A proposta é comparada ao conteúdo no baseCommit. Id estável e capítulo alvo evitam duplicação. Conflito com base atual requer rebase/revisão; nunca sobrescreva silenciosamente uma alteração humana.
5. Uma integração futura de menor privilégio cria branch/PR com diff, fontes e justificativa. Não faz merge, push em main nem deploy.
6. Proprietário revisa precisão, licença, segurança e links, executa checks e aprova explicitamente antes da incorporação.

## Contrato implementado

content/editorial-proposal.schema.json é gerado por Zod (`npm run validate:proposal -- --schema`). Campos: version=1, id slug, baseCommit SHA de 40 caracteres, título, humanReviewRequired=true, sources HTTPS com título/data, changes com chapterId existente, rationale e markdown. Schema estrito rejeita chaves extras como token ou comando de publicação.

```bash
npm run validate:proposal -- /caminho/para/proposta.json
```

O comando só valida; não aplica arquivos, não chama n8n/Ollama/GitHub e não publica. Rejeita alterações duplicadas e alvos inexistentes. A validação semântica complementa JSON Schema. Novos capítulos ainda seguem contribuição manual; o contrato atual automatiza somente propostas de revisão de capítulos existentes.

## Responsabilidades futuras

O produtor deve informar SHA real, registrar fontes e reter apenas dados necessários. O consumidor futuro precisa comparar o SHA com Git, validar o catálogo combinado e todas as âncoras, executar checks, limitar tamanho do diff e exigir revisão humana. O validador local não verifica por si só se o SHA está atualizado nem se a fonte realmente afirma o texto proposto. Esses são controles obrigatórios antes de configurar um produtor operacional.

## Segurança

Sem endpoint público editorial. Credenciais ficam no serviço administrativo privado, com escopo mínimo e sem permissão de deploy/merge. Não ficam no frontend, nos JSONs de proposta ou no repositório. Não expor Ollama/n8n por túnel público para o navegador. Aplicar limites de chamadas, tamanho e tempo; reduzir informação pessoal e remover segredos de logs. Revisar scripts e skills antes de uso. A indisponibilidade da automação apenas atrasa propostas; não derruba o site.

## Preservação da experiência de estudo

Propostas sobre capítulos existentes precisam preservar as três profundidades ordenadas e seus links, verificadas pelo validador atual. Cartões e metadados não podem ser aplicados por esse contrato de revisão de texto: mudanças nesses arquivos continuam em PR editorial normal, com schema e revisão humana. Nunca importar dados pessoais de estudo em propostas editoriais. A ampliação não estabelece conexão operacional com n8n/Ollama ou serviços do proprietário.
