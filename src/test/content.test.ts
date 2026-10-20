import { describe, it, expect, vi } from 'vitest';
import { catalog, validateCatalog } from '../lib/content';
import { search } from '../lib/search';
import { readPreference, savePreference } from '../lib/storage';

describe('contratos editoriais e pesquisa', () => {
  it('aceita o catálogo publicado e rejeita capítulo relacionado inexistente', () => {
    expect(() => validateCatalog(catalog)).not.toThrow();
    const broken = structuredClone(catalog);
    broken.chapters[0].related = ['inexistente'];
    expect(() => validateCatalog(broken)).toThrow(/referência/i);
  });
  it('rejeita ids duplicados, datas inválidas e fontes inseguras', () => {
    const duplicate = structuredClone(catalog);
    duplicate.chapters.push(duplicate.chapters[0]);
    expect(() => validateCatalog(duplicate)).toThrow();
    const date = structuredClone(catalog);
    date.chapters[0].reviewedAt = '2026-99-99';
    expect(() => validateCatalog(date)).toThrow();
    const unsafe = structuredClone(catalog);
    unsafe.chapters[0].sources[0].url = 'javascript:alert(1)';
    expect(() => validateCatalog(unsafe)).toThrow();
  });
  it('encontra inferência sem acento e todos os tipos de conteúdo', () => {
    expect(search('inferencia').some((r) => r.kind === 'Capítulo')).toBe(true);
    for (const [q, kind] of [
      ['MLOps', 'Trilha'],
      ['FastAPI', 'Projeto'],
      ['embedding', 'Conceito'],
      ['skills', 'Skill'],
      ['PyTorch', 'Recurso'],
    ]) {
      expect(
        search(q).some((r) => r.kind === kind),
        q,
      ).toBe(true);
    }
    expect(search('zzzzzzzz')).toEqual([]);
    expect(search('')).toEqual([]);
  });
});
describe('busca no texto completo', () => {
  it('encontra conceitos no corpo mesmo sem tags correspondentes', () => {
    expect(
      search('prefill').some((r) => r.url === '/capitulos/llm-inferencia'),
    ).toBe(true);
  });
});
describe('persistência resiliente', () => {
  it('recupera JSON corrompido e usa fallback', () => {
    localStorage.setItem('academy:progress', '{');
    expect(readPreference('progress', {})).toEqual({});
  });
  it('salva preferências sem bloquear se armazenamento indisponível', () => {
    savePreference('theme', 'dark');
    expect(readPreference('theme', 'light')).toBe('dark');
    const spy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw Error('quota');
      });
    expect(() => savePreference('theme', 'light')).not.toThrow();
    spy.mockRestore();
  });
});
