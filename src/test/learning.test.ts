import { describe, it, expect, vi, afterEach } from 'vitest';
import { scheduleReview, reviewStats } from '../learning/scheduler';
import {
  persistLearning,
  emptyLearning,
  loadLearning,
  parseBackup,
  createBackup,
} from '../learning/model';
const now = Date.UTC(2026, 9, 20, 12);
const known = { chapters: new Set(['rag']), cards: new Set(['rag-1']) };
describe('revisão espaçada com relógio explícito', () => {
  it('agenda erro em dez minutos e acertos em 1, 3, 7, 14 e 30 dias', () => {
    let card;
    for (const days of [1, 3, 7, 14, 30, 30]) {
      card = scheduleReview(card, true, now);
      expect(card.dueAt).toBe(now + days * 86400000);
    }
    const wrong = scheduleReview(card, false, now);
    expect(wrong.dueAt).toBe(now + 600000);
    expect(wrong.streak).toBe(0);
    expect(scheduleReview(wrong, true, now).intervalDays).toBe(1);
    expect(reviewStats({ a: wrong })).toEqual({
      reviews: 7,
      correct: 6,
      incorrect: 1,
      studied: 1,
    });
  });
  it('não inventa revisões e rejeita relógio inválido', () => {
    expect(reviewStats({})).toEqual({
      reviews: 0,
      correct: 0,
      incorrect: 0,
      studied: 0,
    });
    expect(() => scheduleReview(undefined, true, NaN)).toThrow();
  });
});
describe('dados locais e backup estrito', () => {
  it('migra progresso existente e tolera armazenamento corrompido', () => {
    localStorage.setItem(
      'academy:progress',
      JSON.stringify({ rag: true, obsolete: 'bad' }),
    );
    expect(loadLearning().reading).toEqual({ rag: true });
    localStorage.setItem('academy:learning', '{');
    expect(loadLearning().reading).toEqual({ rag: true });
  });
  it('exporta e importa sem perder datas, etapas ou contadores', () => {
    const state = emptyLearning();
    state.reading.rag = true;
    state.cards['rag-1'] = scheduleReview(undefined, true, now);
    state.study.rag = { step: 3, completed: [0, 1, 2], updatedAt: now };
    expect(parseBackup(createBackup(state, now), known)).toEqual(state);
  });
  it('rejeita ids desconhecidos, JSON truncado, tipo indevido e objetos grandes', () => {
    const state = emptyLearning();
    state.reading.unknown = true;
    expect(() => parseBackup(createBackup(state, now), known)).toThrow();
    expect(() => parseBackup('{', known)).toThrow();
    expect(() => parseBackup(' '.repeat(500001), known)).toThrow();
    const bad = JSON.parse(createBackup(emptyLearning(), now));
    bad.data.study.rag = { step: 99, completed: [], updatedAt: now };
    expect(() => parseBackup(JSON.stringify(bad), known)).toThrow();
    expect(() =>
      parseBackup(JSON.stringify({ ...bad, token: 'forbidden' }), known),
    ).toThrow();
  });
});

describe('armazenamento, relógio e contratos nas fronteiras', () => {
  afterEach(() => vi.restoreAllMocks());
  it('persiste e recupera o estado e o espelho de progresso', () => {
    const state = emptyLearning();
    state.reading.rag = false;
    expect(persistLearning(state)).toBe(true);
    expect(loadLearning()).toEqual(state);
    expect(JSON.parse(localStorage.getItem('academy:progress')!)).toEqual({
      rag: false,
    });
  });
  it('tolera quota e acesso indisponível e recupera progresso de formato inválido', () => {
    const set = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new DOMException('Quota', 'QuotaExceededError');
      });
    expect(persistLearning(emptyLearning())).toBe(false);
    set.mockRestore();
    localStorage.setItem('academy:progress', JSON.stringify({ rag: true }));
    localStorage.setItem('academy:learning', JSON.stringify({ version: 999 }));
    expect(loadLearning().reading).toEqual({ rag: true });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });
    expect(loadLearning()).toEqual(emptyLearning());
  });
  it('relata falha também quando somente o espelho excede a quota', () => {
    const original = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
      this: Storage,
      key,
      value,
    ) {
      if (key === 'academy:progress')
        throw new DOMException('Quota', 'QuotaExceededError');
      original.call(this, key, value);
    });
    const state = emptyLearning();
    expect(persistLearning(state)).toBe(false);
    expect(loadLearning()).toEqual(state);
  });
  it('rejeita relógios inválidos e cartões inconsistentes, aceitando limites válidos', () => {
    for (const clock of [
      -1,
      0.5,
      Infinity,
      Number.MAX_SAFE_INTEGER,
      253400000000001,
    ])
      expect(() => scheduleReview(undefined, false, clock)).toThrow(
        'Relógio inválido',
      );
    expect(scheduleReview(undefined, false, 0).dueAt).toBe(600000);
    expect(
      scheduleReview(undefined, true, 253400000000000).lastReviewedAt,
    ).toBe(253400000000000);
    const card = scheduleReview(undefined, false, now);
    expect(() => scheduleReview({ ...card, streak: 1 }, true, now)).toThrow();
    expect(reviewStats({ untouched: { ...card, incorrect: 0 } }).studied).toBe(
      0,
    );
  });
  it('valida IDs de cartões e estudo, versão, datas e conteúdo antes de exportar', () => {
    const state = emptyLearning();
    state.cards.unknown = scheduleReview(undefined, true, now);
    expect(() => parseBackup(createBackup(state, now), known)).toThrow(
      'Cartão desconhecido',
    );
    delete state.cards.unknown;
    state.study.unknown = { step: 0, completed: [], updatedAt: now };
    expect(() => parseBackup(createBackup(state, now), known)).toThrow(
      'Capítulo desconhecido',
    );
    delete state.study.unknown;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    expect(JSON.parse(createBackup(state)).exportedAt).toBe(
      new Date(now).toISOString(),
    );
    const backup = JSON.parse(createBackup(state, now));
    for (const patch of [
      { version: 2 },
      { exportedAt: 'ontem' },
      { format: 'outro' },
    ])
      expect(() =>
        parseBackup(JSON.stringify({ ...backup, ...patch }), known),
      ).toThrow();
    state.study.rag = { step: 1, completed: [0, 0], updatedAt: now };
    expect(() => createBackup(state, now)).toThrow();
  });
});
