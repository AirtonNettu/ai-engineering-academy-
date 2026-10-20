/** Tokenização didática por espaços: até oito tokens, sem vocabulário de LLM. */
export function tokenize(text: string) {
  const tokens = text
    .trim()
    .split(/\s+/u)
    .filter(Boolean)
    .slice(0, 8)
    .map((t) => Array.from(t).slice(0, 24).join(''));
  return tokens.length ? tokens : ['∅'];
}
export const WQ = [
    [1, 0.2],
    [0.1, 0.8],
  ],
  WK = [
    [0.7, -0.2],
    [0.3, 1],
  ],
  WV = [
    [1, 0.5],
    [-0.2, 0.7],
  ];
export function softmax(scores: number[]) {
  if (
    !scores.length ||
    scores.some((x) => Number.isNaN(x) || x === Infinity) ||
    scores.every((x) => x === -Infinity)
  )
    throw new Error('Scores inválidos.');
  const max = Math.max(...scores);
  const e = scores.map((v) => Math.exp(v - max));
  const sum = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / sum);
}
function project(v: number[], w: number[][]) {
  return [0, 1].map((j) => v.reduce((s, x, i) => s + x * w[i][j], 0));
}
export function attention(tokens: string[], causal = false, scale = 1) {
  if (
    tokens.length < 1 ||
    tokens.length > 8 ||
    !Number.isFinite(scale) ||
    scale < 0.1 ||
    scale > 3
  )
    throw new Error('Attention fora dos limites.');
  const embeddings = tokens.map((t) => {
    const c = Array.from(t).reduce((s, c) => s + c.codePointAt(0)!, 0);
    return [Math.sin(c) * scale, Math.cos(c) * scale];
  });
  const q = embeddings.map((v) => project(v, WQ)),
    k = embeddings.map((v) => project(v, WK)),
    v = embeddings.map((e) => project(e, WV));
  const scores = q.map((row, i) =>
    k.map((key, j) =>
      causal && j > i
        ? -Infinity
        : row.reduce((s, x, d) => s + x * key[d], 0) / Math.sqrt(2),
    ),
  );
  const weights = scores.map(softmax);
  const output = weights.map((row) =>
    [0, 1].map((d) => row.reduce((s, w, j) => s + w * v[j][d], 0)),
  );
  return { embeddings, q, k, v, scores, weights, output };
}
