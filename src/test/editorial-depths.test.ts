import { it, expect } from 'vitest';
import { validateChapterDepths } from '../lib/editorial-depths';
const depths = [
  { anchor: 'fundamentacao' },
  { anchor: 'funcionamento-intermediario' },
  { anchor: 'analise-avancada' },
];
const paragraph =
  'Um mecanismo precisa de hipóteses, limites, decisões e exemplos verificáveis. '.repeat(
    10,
  );
const body = depths.map((d) => `## ${d.anchor}\n\n${paragraph}`).join('\n');
it('valida profundidades ordenadas, substanciais e existentes', () => {
  expect(() => validateChapterDepths(body, depths)).not.toThrow();
  expect(() =>
    validateChapterDepths(
      body.replace('## funcionamento-intermediario', '## outro'),
      depths,
    ),
  ).toThrow();
  expect(() =>
    validateChapterDepths(body, [depths[1], depths[0], depths[2]]),
  ).toThrow();
  expect(() =>
    validateChapterDepths('## fundamentacao\n\ncurto', depths),
  ).toThrow();
});
