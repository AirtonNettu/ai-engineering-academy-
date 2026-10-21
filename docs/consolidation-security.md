# Revisão de segurança da consolidação

Data: 21/10/2026. Escopo: aplicação estática, estado local e exemplo FastAPI/Ollama. Revisão de código e auditoria de dependências não constituem pentest nem garantia de ausência de vulnerabilidades.

## Dependências Python: achados e correção

`pip-audit 2.10.1`, instalado em ambiente temporário fora do projeto, consultou os 21 pacotes fixados em `examples/fastapi-ollama/requirements.lock.txt`. Comando reproduzível após instalar a ferramenta em um venv separado:

```bash
pip-audit -r examples/fastapi-ollama/requirements.lock.txt --no-deps --disable-pip -f json
```

`--no-deps --disable-pip` audita os pins informados sem instalar o exemplo ou resolver dependências. O lock contém as transitivas; a auditoria não substitui uma verificação da resolução. O arquivo não tem hashes, portanto não garante integridade dos artefatos baixados.

O resultado inicial foi exit 1, 12 registros em dois pacotes. O feed retornou registros duplicados: eram seis identificadores únicos.

| Pacote original  | Aviso           | Contexto no exemplo                                                                                  | Correção aplicada |
| ---------------- | --------------- | ---------------------------------------------------------------------------------------------------- | ----------------- |
| pytest 9.0.2     | PYSEC-2026-1845 | Ataque por usuário local a diretórios temporários em UNIX; ferramenta de testes, sem runtime público | 9.0.3             |
| Starlette 0.52.1 | PYSEC-2026-161  | Reconstrução de URL com Host malformado; não há autorização baseada em URL no exemplo                | 1.3.1             |
| Starlette 0.52.1 | PYSEC-2026-2281 | SSRF/credenciais NTLM em StaticFiles no Windows; o exemplo não usa StaticFiles                       | 1.3.1             |
| Starlette 0.52.1 | PYSEC-2026-2280 | Despacho de métodos arbitrários em HTTPEndpoint; as rotas usam funções FastAPI                       | 1.3.1             |
| Starlette 0.52.1 | PYSEC-2026-248  | Reconstrução de URL com caminho malformado; o exemplo não usa hostname reconstruído para confiança   | 1.3.1             |
| Starlette 0.52.1 | PYSEC-2026-249  | Limites ignorados em formulários urlencoded; a rota recebe JSON e não usa request.form               | 1.3.1             |

Referências de avisos: [pytest](https://osv.dev/vulnerability/PYSEC-2026-1845), [Host](https://osv.dev/vulnerability/PYSEC-2026-161), [StaticFiles](https://osv.dev/vulnerability/PYSEC-2026-2281), [HTTPEndpoint](https://osv.dev/vulnerability/PYSEC-2026-2280), [caminho](https://osv.dev/vulnerability/PYSEC-2026-248), [formulários](https://osv.dev/vulnerability/PYSEC-2026-249). IDs e versões corrigidas vêm do feed consumido pela ferramenta; não houve exploração dessas falhas.

Starlette 1.3.1 é a menor versão indicada pelo feed que corrige todos esses avisos. Embora seja uma mudança de versão principal, os metadados oficiais de FastAPI 0.135.1 declaram `starlette>=0.46.0`, sem limite superior. Em um venv Python 3.12 separado, o conjunto atualizado passou nos 19 testes existentes e em `pip check`. A auditoria dos 21 pins atualizados terminou com exit 0 e nenhum aviso conhecido. TestClient emite duas depreciações (HTTPX e alias BlockingPortal do AnyIO); isso é uma limitação de manutenção futura, sem quebra observada nos contratos testados. Nenhuma dependência de auditoria foi adicionada ao projeto.

## Aplicação estática e estado local

- `Markdown` usa `react-markdown` com `skipHtml`, proíbe imagens e mantém a transformação padrão de URLs seguras. Links externos incluem `noopener noreferrer`. Há teste existente de HTML e URL JavaScript; o realce usa elementos React, sem HTML bruto.
- `public/_headers` restringe scripts, conexões e recursos à mesma origem, bloqueia objetos e frames e desabilita câmera, microfone e geolocalização. `style-src 'unsafe-inline'` atende estilos de tokens e leitor; não libera scripts inline. A revisão confirma o arquivo, não sua aplicação por um provedor remoto.
- Backups são JSON local, com schema estrito, versão, limites de tamanho, IDs conhecidos e confirmação explícita antes da substituição. Não há upload remoto. localStorage e arquivos exportados dependem da segurança do dispositivo e da origem; não são armazenamento criptografado.
- JSON inválido e falhas de armazenamento têm fallback; falhas de persistência avisam sobre estado mantido só em memória. O carregamento local valida formato, mas aceita IDs legados desconhecidos; a importação é mais restrita. Isso pode preservar registros obsoletos, sem demonstrar execução de código ou acesso remoto.
- Como acompanhamento de robustez, avaliar atualizações simultâneas do provider e limites extremos de contadores/relógio do scheduler com testes de regressão antes de alterar comportamento. Não foi comprovado impacto de segurança remoto nesses pontos; não foram introduzidas migrações de dados nesta revisão.

## Exemplo FastAPI e limites de validação

O exemplo é separado do site e documenta bind em `127.0.0.1`. A mensagem tem limite de 4.000 caracteres, campos extras são proibidos e URLs do upstream vêm da configuração do operador. HTTPX não segue redirects; há timeout e tradução de falhas sem devolver corpos upstream. Não há ferramentas, execução de comandos, autenticação ou persistência de conversas. A resposta do modelo continua sendo conteúdo não confiável e não deve virar comando ou HTML executável.

O limite de mensagem é aplicado após parsing JSON; não é limite de corpo HTTP ou controle de concorrência. A resposta upstream também não possui limite explícito de bytes. Isso reforça o escopo local documentado: publicar a API exigiria projeto específico de autorização, limites de tráfego/corpo/concorrência e TLS. Não foi adicionado backend público.

Os testes usam transporte HTTP mockado, sem download ou inferência real. Ollama e n8n reais não foram validados. GitHub e a URL pública retornaram bloqueios de acesso nesta sessão; não houve contorno nem confirmação de headers, configuração remota ou funcionamento em produção. A auditoria npm registrada pela consolidação retornou zero vulnerabilidades conhecidas; versões desatualizadas por si só não provam vulnerabilidade.

## Complemento de verificação da coordenação

`npm audit` após instalar o provider V8 também retornou zero vulnerabilidades conhecidas; dados em docs/consolidation/npm-audit.json. A busca por padrões de chaves privadas, tokens GitHub e AWS nos arquivos rastreados não encontrou correspondência; é uma inspeção limitada, não uma garantia de ausência de segredos. Código de apresentação estática usa o mesmo parsing seguro, sem scripts editoriais inline.

`npm outdated` e `pip list --outdated` foram consultados, com resultados em docs/consolidation. Majors de ferramentas npm e atualizações sem advisory Python foram mantidos para evitar alteração indiscriminada. A mudança principal Starlette é exceção justificada pelos avisos, metadados de compatibilidade e testes. As 21 dependências pinadas atualizadas têm zero avisos no feed consultado. O lock continua sem hashes, conforme limite declarado.

A API GraphQL do GitHub foi bloqueada; páginas públicas GitHub e transporte Git funcionaram. O domínio Pages foi bloqueado pelo proxy. Portanto não foi realizada uma auditoria remota de produção nem de configurações administrativas.
