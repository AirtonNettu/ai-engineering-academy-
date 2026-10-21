import { appendFileSync, readFileSync } from 'node:fs';
import { relative } from 'node:path';
const report = JSON.parse(
  readFileSync('coverage/coverage-summary.json', 'utf8'),
) as Record<string, Record<string, { pct: number }>>;
const rows = Object.entries(report)
  .filter(([path]) => path !== 'total')
  .map(
    ([path, metrics]) =>
      `| ${relative(process.cwd(), path)} | ${metrics.lines.pct}% | ${metrics.branches.pct}% | ${metrics.functions.pct}% | ${metrics.statements.pct}% |`,
  );
const markdown = [
  '## Cobertura V8 — matemática e estado',
  '',
  '| Módulo | Linhas | Branches | Funções | Statements |',
  '| --- | ---: | ---: | ---: | ---: |',
  ...rows,
  '',
  'Threshold: 80% por arquivo nas quatro métricas. Os cinco módulos são incluídos integralmente. Cobertura não comprova correção matemática; testes de gradiente e invariantes são complementares.',
  '',
].join('\n');
if (process.env.GITHUB_STEP_SUMMARY)
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
else console.log(markdown);
