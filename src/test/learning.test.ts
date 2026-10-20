import { describe, it, expect } from 'vitest';
import { scheduleReview, reviewStats } from '../learning/scheduler';
import {
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
