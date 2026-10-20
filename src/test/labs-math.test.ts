import { describe, expect, it } from 'vitest';
import { initialNetwork, loss, gradient, train, XOR } from '../labs/neural';
import { attention, softmax, tokenize } from '../labs/attention';
import { cosine, rank, documents } from '../labs/embeddings';
describe('matemática dos laboratórios', () => {
  it('backprop corresponde a diferenças finitas de cada parâmetro', () => {
    const p = initialNetwork();
    const g = gradient(p);
    const eps = 1e-5;
    p.forEach((_, i) => {
      const a = [...p],
        b = [...p];
      a[i] += eps;
      b[i] -= eps;
      expect(g[i]).toBeCloseTo((loss(a) - loss(b)) / (2 * eps), 6);
    });
  });
  it('treina XOR de forma determinística e limita entradas inválidas', () => {
    const p = initialNetwork();
    const result = train(p, 1, 5000);
    expect(loss(result)).toBeLessThan(0.015);
    expect(loss(p)).toBeGreaterThan(loss(result));
    expect(XOR).toHaveLength(4);
    expect(() => train(p, Infinity, 1)).toThrow();
    expect(() => train(p, 1, 5001)).toThrow();
    expect(() => loss(p.map(() => NaN))).toThrow();
  });
  it('softmax é estável e atenção causal normaliza só o passado', () => {
    expect(softmax([1000, 1000])).toEqual([0.5, 0.5]);
    const a = attention(tokenize('eu estudo IA'), true);
    expect(a.weights[0]).toEqual([1, 0, 0]);
    a.weights.forEach((r) =>
      expect(r.reduce((x, y) => x + y, 0)).toBeCloseTo(1),
    );
    expect(a.output[0]).toEqual(a.v[0]);
    expect(tokenize('')).toEqual(['∅']);
    expect(tokenize('a '.repeat(20))).toHaveLength(8);
  });
  it('cosseno e ranking usam vetores originais', () => {
    expect(cosine([1, 0], [1, 0])).toBe(1);
    expect(cosine([0, 0], [1, 0])).toBe(0);
    expect(cosine([1, 0], [0, 1])).toBe(0);
    expect(rank(documents[0].vector)[0].id).toBe(documents[0].id);
    expect(() => cosine([NaN], [1])).toThrow();
  });
});

describe('equações e limites numéricos', () => {
  it('atenção sem máscara corresponde ao produto escalar escalonado e soma ponderada', () => {
    const a = attention(['um', 'dois']);
    expect(a.scores[0][1]).toBeCloseTo(
      (a.q[0][0] * a.k[1][0] + a.q[0][1] * a.k[1][1]) / Math.sqrt(2),
      12,
    );
    expect(a.weights[0][1]).toBeCloseTo(
      Math.exp(a.scores[0][1]) /
        (Math.exp(a.scores[0][0]) + Math.exp(a.scores[0][1])),
      12,
    );
    expect(a.output[0][1]).toBeCloseTo(
      a.weights[0][0] * a.v[0][1] + a.weights[0][1] * a.v[1][1],
      12,
    );
    expect(() => attention([], false)).toThrow();
    expect(() => attention(['x'], false, NaN)).toThrow();
    expect(() => softmax([-Infinity])).toThrow();
  });
  it('rejeita parâmetros finitos que produzem resultados não finitos', () => {
    expect(() => loss(Array(13).fill(Number.MAX_VALUE))).toThrow();
  });
});
