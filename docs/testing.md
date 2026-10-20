# Testes e evidências

## Comandos

Node 24+; instale com npm ci. Para a interface:

```bash
npm run check
npx playwright install chromium
npm run test:e2e
```

`check` executa ESLint, Prettier, Vitest, schema editorial, TypeScript estrito e build de produção. O build gera metadados e robots. A suíte E2E usa o build com `vite preview`, não um servidor de desenvolvimento, e percorre Chromium desktop e Pixel 7 emulado.

Na máquina de nuvem, o CDN do Playwright retornou 403 Domain forbidden; foi usado o Chromium já instalado, sem desativar verificações ou alterar a política de rede:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

Para o exemplo Python, instale requirements.lock.txt em um ambiente virtual e execute `python -m pytest -q` na pasta do exemplo. O pytest.ini na raiz também permite executar a suíte a partir da raiz do repositório. Não há dependência de Ollama nos testes.

## Cobertura funcional

- **Vitest/Testing Library:** schema válido e referências inválidas; IDs/datas/fontes; busca por todos os tipos e corpo completo sem acentos; JSON local corrompido e quota; leitura, tamanho de fonte e progresso; árvore/código reais; etapas do diagrama; rota ausente; Markdown sem execução de HTML/JavaScript; propostas editoriais estritas e revisão obrigatória.
- **Playwright:** jornada busca → leitura → persistência; tema e fonte; seleção de código com Shiki; cópia para clipboard real; filtros de catálogo; relações diagrama/arquivo; seleção de competências; rotas e links internos; ausência de overflow; teclado/menu móvel; dados locais inválidos; referências com âncoras.
- **axe:** regras WCAG 2 A/AA e 2.1 AA nas páginas representativas, desktop/móvel e amostra em tema escuro. Isso não comprova conformidade completa; leitura de tela e avaliação manual especializada continuam recomendadas.
- **pytest:** sucesso e corpo real enviado ao upstream, seis classes de entrada inválida, timeout, conexão, seis falhas de payload/status e quatro configurações inválidas. Aplicação e rota executam de verdade; apenas transporte externo é mockado.

## Evidências da sessão de implementação

| Verificação     | Resultado observado                                                                         |
| --------------- | ------------------------------------------------------------------------------------------- |
| npm run check   | passou; lint/formato, 50 testes Vitest, validação e build                                   |
| Playwright      | 26 testes passaram, incluindo links profundos com chunks atrasados em desktop e móvel       |
| pytest          | 19 passaram; uma depreciação de alias AnyIO usada por Starlette, sem falha funcional        |
| Servidor Python | Uvicorn iniciou; GET /health retornou 200 e status ok; POST com mensagem vazia retornou 422 |
| npm audit       | zero vulnerabilidades conhecidas após atualizar Vitest/ESLint                               |
| Revisão visual  | capturas inspecionadas em 1440px e 390px; sem overflow nos testes de rotas                  |

As contagens descrevem testes executados, não percentuais de cobertura de código. Não há meta de cobertura artificial. Falhas iniciais de seletores foram corrigidas para distinguir o bloco do explorador do bloco de instruções; os testes continuaram verificando arquivos reais e clipboard.

## Não comprovado

Inferência com modelo real/hardware, n8n operacional, deploy Cloudflare, aplicação efetiva dos headers pelo provedor, domínio real, indexação em buscadores, Firefox/WebKit, leitores de tela e dispositivo físico. Os checks locais não comprovam sucesso de GitHub Actions remoto. Links externos são fontes citadas; somente as três skills adicionadas tiveram seus SKILL.md consultados nesta sessão, não uma auditoria contínua de todos os destinos.

## Testes úteis ao contribuir

Escreva um caso que falhe para o comportamento desejado, execute-o, implemente e execute novamente. Para mudanças editoriais, valide referências/datas e revise tecnicamente as fontes. Para o backend, simule a fronteira HTTP externa e não a lógica pública. Não desative assertions, TLS, signatures ou checksums para obter um teste verde.

## Ampliação da Issue #2

Os 50 testes unitários/componentes incluem os 18 anteriores e verificam gradientes dos 13 parâmetros por diferenças finitas, convergência XOR, softmax/causalidade, cosseno/ranking, limites de playback e pausa ao alterar orçamento. Também cobrem migração local, agenda com relógio explícito, importação estrita, três profundidades, cartões, roadmaps e retomada do percurso.

Os 26 testes Playwright executam em desktop e Pixel 7 emulado: rotas antigas e novas, download/importação real de backup, confirmação e rejeição de dados inválidos, revisão com vencimento, controles dos labs, Atlas e axe nos dois temas. Uma espera por término de transições evita auditar cores intermediárias na troca de tema.

A revisão técnica final verificou separação entre cálculo e animação, limites de trabalho, cleanup de timers, mudança de arquitetura com remontagem e persistência. Corrigiu a retomada involuntária ao ampliar o orçamento da rede e o contraste dos pesos altos na atenção causal em ambos os temas. A tentativa de revisão independente foi interrompida pelo limite de uso do agente; não representa aprovação independente concluída. Não houve redução de assertions para obter aprovação.
