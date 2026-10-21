# Cobertura da consolidação

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
