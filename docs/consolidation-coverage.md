# Cobertura da consolidação

**100% aplica-se somente aos cinco arquivos da tabela abaixo.** O denominador
do V8 é limitado por `coverage.include` em `vite.config.ts`; não é uma medição
global do repositório. Componentes React, providers, páginas, utilitários de
`src/lib`, scripts e Python não entram nesse percentual. Ter testes funcionais
nessas áreas não estabelece sua cobertura de linhas ou branches. O gate continua
80% por arquivo nas quatro métricas, sem redução do escopo.

`npm run test:coverage` executa a suíte Vitest com V8. O provider
`@vitest/coverage-v8` está fixado em `5.0.5`, correspondente ao Vitest instalado.
`npm run check` inclui essa execução, sem executar a suíte unitária duas vezes.

O escopo é explícito em `vite.config.ts`: todos os módulos puros de matemática
(`neural.ts`, `attention.ts`, `embeddings.ts`) e aprendizagem (`model.ts`,
`scheduler.ts`). Nenhum trecho desses arquivos é excluído. Cada arquivo deve
atingir pelo menos 80% de linhas, branches, funções e statements.

Os testes exercitam diferenças finitas de todos os parâmetros em duas redes,
convergência XOR, sigmoid saturada, overflow, limites de treino, softmax estável,
máscara causal, projeções e soma ponderada, tokenização Unicode, cosseno e
ranking. Para aprendizagem, verificam migração, armazenamento indisponível,
quota em ambas as gravações, limites de relógio, intervalos e estatísticas,
backup estrito, IDs desconhecidos e validação antes de exportar.

Resultado observado em 21/10/2026: **63 testes passaram em 13 arquivos**.

| Módulo                      | Linhas         | Branches     | Funções      | Statements     |
| --------------------------- | -------------- | ------------ | ------------ | -------------- |
| `src/labs/neural.ts`        | 100% (40/40)   | 100% (22/22) | 100% (11/11) | 100% (44/44)   |
| `src/labs/attention.ts`     | 100% (31/31)   | 100% (22/22) | 100% (23/23) | 100% (42/42)   |
| `src/labs/embeddings.ts`    | 100% (10/10)   | 100% (11/11) | 100% (5/5)   | 100% (10/10)   |
| `src/learning/model.ts`     | 100% (29/29)   | 100% (11/11) | 100% (7/7)   | 100% (31/31)   |
| `src/learning/scheduler.ts` | 100% (12/12)   | 100% (23/23) | 100% (5/5)   | 100% (14/14)   |
| Total                       | 100% (122/122) | 100% (89/89) | 100% (51/51) | 100% (141/141) |

Os reporters são `text`, `json-summary` e `lcov`. Artefatos locais:
`coverage/coverage-summary.json`, `coverage/lcov.info` e
`coverage/lcov-report/index.html`. O diretório `coverage/` é ignorado pelo Git.
As chaves de arquivo no JSON contêm o caminho absoluto do checkout; consumidores
podem localizar o módulo pelo sufixo `src/labs/...` ou `src/learning/...`.
Cobertura indica execução dos caminhos instrumentados, sem provar ausência de
bugs nem retenção de aprendizagem.

Os quatro testes adicionais em relação à medição inicial desta frente cobrem origem/HTML estático e semântica de títulos/rótulos. O escopo e os totais dos cinco módulos instrumentados não mudaram. Resumo normalizado versionado em docs/consolidation/coverage-summary.json.

## Lacunas identificadas na revisão do PR #17

- **Cobertura não medida fora dos cinco arquivos:** a suíte monta a aplicação
  (`ui.test.tsx`, `study-ui.test.tsx`, `labs-ui.test.tsx`), mas não informa um
  percentual para componentes, `LearningProvider`, páginas, busca e scripts de
  build. Próximo passo: medição separada dessas áreas, mantendo o gate atual.
- **Persistência na interface:** `learning.test.ts` verifica quota e acesso
  bloqueado no modelo; falta um teste de integração que provoque essa falha ao
  interagir com a aplicação, confira o alerta do `LearningProvider` e exporte
  o estado mantido em memória. Não confundir teste do modelo com essa jornada.
- **Clipboard negado:** o E2E concede permissão e valida sucesso de cópia;
  falta exercitar a rejeição de `navigator.clipboard.writeText` e a mensagem
  apresentada ao usuário, sem perder o conteúdo original.
- **Acessibilidade e navegadores:** axe cobre amostras e temas, e há testes de
  teclado/reduced-motion; falta avaliação por leitor de tela e teste manual de
  foco/contraste em todas as páginas. Chromium desktop e Pixel 7 emulado não
  comprovam Firefox, WebKit nem dispositivo físico.
- **Fronteiras externas:** os 19 casos Python simulam o transporte HTTP do
  Ollama. Não validam inferência com modelo real, hardware, proxy nem headers
  aplicados pelo provedor de hospedagem.

O PR acrescenta testes do avaliador de auditoria (severidades, exit code 1 sem
achados, relatório inválido/inconsistente e dependências puladas). Esses testes
usam fixtures locais; não comprovam disponibilidade dos serviços de advisories.
