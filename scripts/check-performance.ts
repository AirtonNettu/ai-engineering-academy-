import { readFileSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
const assets = readdirSync('dist/assets').map((name) => ({
  name,
  gzip: gzipSync(readFileSync(`dist/assets/${name}`)).length,
}));
const js = assets.filter((a) => a.name.endsWith('.js'));
const css = assets.filter((a) => a.name.endsWith('.css'));
const checks: [string, number, number][] = [
  ['maior chunk JS gzip', Math.max(...js.map((a) => a.gzip)), 180 * 1024],
  [
    'total JS gzip (inclui lazy)',
    js.reduce((s, a) => s + a.gzip, 0),
    600 * 1024,
  ],
  ['total CSS gzip', css.reduce((s, a) => s + a.gzip, 0), 40 * 1024],
  [
    'imagem social PNG',
    readFileSync('dist/social-card.png').length,
    250 * 1024,
  ],
];
for (const [label, actual, budget] of checks) {
  console.log(`${label}: ${actual} / ${budget} bytes`);
  if (actual > budget) process.exitCode = 1;
}
