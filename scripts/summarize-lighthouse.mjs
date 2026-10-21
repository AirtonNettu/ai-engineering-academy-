/* global process, console */
import { readFileSync, writeFileSync } from 'node:fs';
const inputDir = process.argv[2] || '/tmp';
const pages = ['biblioteca', 'arquiteturas', 'laboratorios-neural-network'];
const reports = pages.map((page) => {
  const report = JSON.parse(
    readFileSync(
      `${inputDir}/consolidation-final-lighthouse-${page}.json`,
      'utf8',
    ),
  );
  const metrics = {};
  for (const id of [
    'first-contentful-paint',
    'largest-contentful-paint',
    'speed-index',
    'total-blocking-time',
    'cumulative-layout-shift',
  ]) {
    const audit = report.audits[id];
    metrics[id] = {
      value: audit.numericValue,
      unit: audit.numericUnit,
      displayValue: audit.displayValue,
    };
  }
  return {
    page,
    requestedUrl: report.requestedUrl,
    finalUrl: report.finalDisplayedUrl,
    fetchTime: report.fetchTime,
    lighthouseVersion: report.lighthouseVersion,
    environment: report.environment,
    configSettings: report.configSettings,
    scores: Object.fromEntries(
      Object.entries(report.categories).map(([id, category]) => [
        id,
        Math.round(category.score * 100),
      ]),
    ),
    metrics,
    runWarnings: report.runWarnings,
    accessibilityFindings: report.categories.accessibility.auditRefs
      .filter((ref) => report.audits[ref.id].score === 0)
      .map((ref) => ({
        id: ref.id,
        title: report.audits[ref.id].title,
        details: report.audits[ref.id].details,
      })),
  };
});
writeFileSync(
  'docs/consolidation/lighthouse-summary.json',
  JSON.stringify(reports, null, 2) + '\n',
);
for (const report of reports)
  console.log(
    report.page,
    report.scores,
    report.metrics['largest-contentful-paint'].displayValue,
    report.metrics['cumulative-layout-shift'].value,
  );
