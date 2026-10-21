# Performance e SEO — medição local

## Método reproduzível

Lighthouse 13.5.0 foi instalado somente em `/tmp/academy-audit-tools`, sem acrescentá-lo ao projeto/CI. Chromium instalado em `/usr/bin/chromium`, build de produção com a origem informada pelo proprietário, servido por Vite preview em loopback. Uma navegação mobile simulada por página, em sequência, sem E2E paralelo durante a medição. Condições completas, versão do navegador e warnings estão em lighthouse-summary.json. Não são dados de usuários reais ou produção; uma execução não é um percentil estatístico.

```bash
SITE_URL=https://ai-engineering-academy-3cy.pages.dev npm run build
npm run preview -- --port 4174
# Em outro terminal, instale a ferramenta temporária fora do projeto:
npm install --prefix /tmp/academy-audit-tools lighthouse@13.5.0
CHROME_PATH=/usr/bin/chromium /tmp/academy-audit-tools/node_modules/.bin/lighthouse \
  http://127.0.0.1:4174/biblioteca \
  --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output-path=/tmp/consolidation-final-lighthouse-biblioteca.json
```

Repita para `arquiteturas` e `laboratorios/neural-network`, usando os nomes de saída em `scripts/summarize-lighthouse.mjs`, e execute `node scripts/summarize-lighthouse.mjs /tmp`. O flag no-sandbox é específico do Chromium neste contêiner, não uma configuração de produção. O preview não aplica os headers do Cloudflare.

A primeira medição, sem SITE_URL, teve SEO 63 por noindex/robots de preview deliberados. A biblioteca tinha acessibilidade 98 por salto h1→h3 e CLS 0,107 pelo rodapé no carregamento. As duas causas receberam testes vermelhos antes das correções. A rodada com origem confirmou indexabilidade local; isso não demonstra indexação pelo Google.

## Orçamentos

`npm run check:performance` mede bytes reais do build com gzip nível padrão Node e compara limites estáveis: maior chunk JS ≤180 KiB; soma de JS incluindo lazy ≤600 KiB; soma CSS ≤40 KiB; imagem social PNG ≤250 KiB. Há margem documentada para evolução, sem excluir gramáticas Shiki ou chunks para passar. Esses são gates da CI, sem dependência de rede/hardware.

Alvos orientadores da auditoria sintética: performance ≥90, LCP ≤2,5 s, CLS ≤0,1 e TBT ≤200 ms nas páginas amostradas. Scores não são gates da CI: simulação, máquina e carga podem variar. Não aplicar esses valores como garantia a todos os dispositivos. Não foram avaliados Core Web Vitals reais, Firefox/WebKit ou rede de produção.

Resultados numéricos finais e condições estão em [lighthouse-summary.json](lighthouse-summary.json) e no relatório principal após a auditoria. Acessibilidade automática não substitui leitor de tela ou revisão manual.

A correção de rótulos SVG precisou também separar as palavras nos nós de texto: o DOM concatenava `AutorizaçãoOPCIONAL`. A regra dedicada axe reproduziu o problema; um espaço textual e nome acessível na ordem correspondente resolveram sem alterar coordenadas. Essa regra passou nos dois projetos Playwright antes da confirmação Lighthouse.

## Resultados medidos

| Página                      | Performance | Acessibilidade | Boas práticas | SEO |    LCP | CLS |   TBT |
| --------------------------- | ----------: | -------------: | ------------: | --: | -----: | --: | ----: |
| biblioteca                  |          97 |            100 |           100 | 100 | 2.35 s |   0 | 42 ms |
| arquiteturas                |          98 |            100 |           100 | 100 | 2.22 s |   0 | 59 ms |
| laboratorios-neural-network |          97 |            100 |           100 | 100 | 2.21 s |   0 | 69 ms |

Os três relatórios finais não registraram achados automáticos de acessibilidade nas regras avaliadas, incluindo a confirmação do Atlas. Score 100 não é conformidade universal.
