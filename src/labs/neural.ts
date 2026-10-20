/** Rede 2–3–1: tanh oculta, sigmoid de saída, MSE média e SGD em batch XOR. */
export const XOR = [
  { x: [0, 0], y: 0 },
  { x: [0, 1], y: 1 },
  { x: [1, 0], y: 1 },
  { x: [1, 1], y: 0 },
];
// 6 pesos entrada, 3 vieses ocultos, 3 pesos saída, 1 viés saída.
export function initialNetwork(): number[] {
  return [0.8, -0.7, -0.9, 0.6, 0.5, 0.9, 0.1, -0.2, 0.3, 0.7, -0.8, 0.6, -0.1];
}
function validate(p: number[]) {
  if (p.length !== 13 || !p.every(Number.isFinite))
    throw new Error('Parâmetros precisam ser 13 números finitos.');
}
export function forward(p: number[], x: number[]) {
  validate(p);
  if (x.length !== 2 || !x.every(Number.isFinite))
    throw new Error('Entrada inválida.');
  const preactivation = [0, 1, 2].map(
    (j) => x[0] * p[2 * j] + x[1] * p[2 * j + 1] + p[6 + j],
  );
  if (!preactivation.every(Number.isFinite))
    throw new Error('Overflow nas ativações.');
  const hidden = preactivation.map(Math.tanh);
  const z = hidden.reduce((s, h, j) => s + h * p[9 + j], p[12]);
  if (!Number.isFinite(z)) throw new Error('Overflow na saída.');
  const output =
    z >= 0 ? 1 / (1 + Math.exp(-z)) : Math.exp(z) / (1 + Math.exp(z));
  return { hidden, output };
}
export function loss(p: number[]) {
  return (
    XOR.reduce((s, d) => s + (forward(p, d.x).output - d.y) ** 2, 0) /
    XOR.length
  );
}
export function gradient(p: number[]) {
  validate(p);
  const g = Array<number>(13).fill(0);
  for (const { x, y } of XOR) {
    const { hidden, output } = forward(p, x);
    const delta = (2 * (output - y) * output * (1 - output)) / XOR.length;
    g[12] += delta;
    hidden.forEach((h, j) => {
      g[9 + j] += delta * h;
      const dh = delta * p[9 + j] * (1 - h * h);
      g[6 + j] += dh;
      g[2 * j] += dh * x[0];
      g[2 * j + 1] += dh * x[1];
    });
  }
  return g;
}
export function train(p: number[], learningRate: number, epochs: number) {
  validate(p);
  if (
    !Number.isFinite(learningRate) ||
    learningRate <= 0 ||
    learningRate > 5 ||
    !Number.isInteger(epochs) ||
    epochs < 0 ||
    epochs > 5000
  )
    throw new Error('Treino fora do orçamento.');
  let next = [...p];
  for (let n = 0; n < epochs; n++) {
    const g = gradient(next);
    next = next.map((v, i) => v - learningRate * g[i]);
    validate(next);
  }
  return next;
}
