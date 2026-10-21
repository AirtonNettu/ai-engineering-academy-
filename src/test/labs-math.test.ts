import { describe, expect, it } from 'vitest';
import {
  initialNetwork,
  forward,
  loss,
  gradient,
  train,
  XOR,
} from '../labs/neural';
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

describe('fronteiras dos módulos matemáticos', () => {
  it('valida dimensões, finitude e overflow sem alterar os parâmetros', () => {
    const p = initialNetwork();
    const snapshot = [...p];
    expect(train(p, 5, 0)).toEqual(p);
    expect(train(p, 5, 0)).not.toBe(p);
    expect(p).toEqual(snapshot);
    for (const params of [[], p.slice(1), p.map(() => Infinity)])
      expect(() => forward(params, [0, 0])).toThrow();
    for (const input of [[], [1], [0, 0, 0], [NaN, 0], [Infinity, 0]])
      expect(() => forward(p, input)).toThrow();
    expect(() => forward(Array(13).fill(Number.MAX_VALUE), [2, 2])).toThrow(
      'ativações',
    );
    const overflow = Array(13).fill(1);
    overflow.splice(9, 4, ...Array(4).fill(Number.MAX_VALUE));
    expect(() => forward(overflow, [0, 0])).toThrow('saída');
    const negative = Array(13).fill(0);
    negative[12] = -1000;
    expect(forward(negative, [0, 0]).output).toBe(0);
    negative[12] = 1000;
    expect(forward(negative, [0, 0]).output).toBe(1);
    for (const rate of [NaN, 0, -1, 5.01])
      expect(() => train(p, rate, 1)).toThrow();
    for (const epochs of [-1, 0.5, Infinity, 5001])
      expect(() => train(p, 1, epochs)).toThrow();
  });
  it('mantém gradientes corretos fora da inicialização e reduz a perda em um passo', () => {
    const p = initialNetwork().map((v, i) => v * 0.3 - i * 0.01);
    const analytical = gradient(p);
    for (let i = 0; i < p.length; i++) {
      const plus = [...p],
        minus = [...p];
      plus[i] += 1e-5;
      minus[i] -= 1e-5;
      expect(analytical[i]).toBeCloseTo((loss(plus) - loss(minus)) / 2e-5, 7);
    }
    expect(loss(train(p, 0.1, 1))).toBeLessThan(loss(p));
  });
  it('softmax preserva translação, máscara e probabilidades extremas', () => {
    expect(softmax([1, 2, 3])).toEqual(softmax([1001, 1002, 1003]));
    expect(softmax([-Infinity, 0])).toEqual([0, 1]);
    expect(softmax([-1000, 1000])).toEqual([0, 1]);
    for (const scores of [[], [NaN], [Infinity], [-Infinity, -Infinity]])
      expect(() => softmax(scores)).toThrow();
    expect(tokenize(' 😀'.repeat(30))[0]).toBe('😀');
    expect(tokenize('😀'.repeat(30))[0]).toBe('😀'.repeat(24));
    for (const scale of [0.1, 3]) {
      const result = attention(['😀'], false, scale);
      expect(result.weights).toEqual([[1]]);
      expect(result.output).toEqual(result.v);
      expect(Math.hypot(...result.embeddings[0])).toBeCloseTo(scale);
    }
    expect(attention(Array(8).fill('x')).weights).toHaveLength(8);
    for (const scale of [0, 0.09, 3.01, Infinity])
      expect(() => attention(['x'], false, scale)).toThrow();
    expect(() => attention(Array(9).fill('x'))).toThrow();
  });
  it('cosseno reconhece oposição, escala, norma zero e desempate determinístico', () => {
    expect(cosine([1, 2], [-2, -4])).toBeCloseTo(-1);
    expect(cosine([1, 2], [2, 4])).toBeCloseTo(1);
    expect(cosine([1, 2], [0, 0])).toBe(0);
    for (const [a, b] of [
      [[], []],
      [[1], [1, 2]],
      [[1], [Infinity]],
    ])
      expect(() => cosine(a, b)).toThrow();
    expect(rank([0, 0, 0, 0]).map((d) => d.id)).toEqual(
      documents.map((d) => d.id).sort((a, b) => a.localeCompare(b)),
    );
    const ranked = rank([1, 0, 0, 0]);
    expect(
      ranked.every((d, i) => i === 0 || ranked[i - 1].score >= d.score),
    ).toBe(true);
  });
});
