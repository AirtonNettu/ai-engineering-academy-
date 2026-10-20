import { describe, it, expect } from 'vitest';
import { validateMarkdownLinks } from '../lib/routes';

describe('links Markdown reais, incluindo definições e títulos', () => {
  it('rejeita rota, âncora com título e definição referenciada inválidos', () => {
    expect(() =>
      validateMarkdownLinks('[link](/capitulos/inexistente)', 'rag'),
    ).toThrow();
    expect(() =>
      validateMarkdownLinks(
        '[link](/capitulos/rag#inexistente "Título")',
        'rag',
        { rag: '## Real' },
      ),
    ).toThrow();
    expect(() =>
      validateMarkdownLinks(
        '[link][bad]\n\n[bad]: /capitulos/inexistente',
        'rag',
      ),
    ).toThrow();
  });
  it('proíbe links relativos e URLs de script ou host relativo', () => {
    for (const url of [
      'inexistente',
      '../rag',
      '//outro.example/path',
      'javascript:alert(1)',
      'data:text/html,oi',
    ]) {
      expect(
        () => validateMarkdownLinks(`[link](${url})`, 'rag'),
        url,
      ).toThrow();
    }
  });
  it('aceita links/âncoras válidos e ignora código que parece link', () => {
    const body =
      '## Real\n\n[link](#real "Título")\n\n[referência][ok]\n\n[ok]: /capitulos/http-apis\n\n```md\n[exemplo](/rota-nao-real)\n```';
    expect(() => validateMarkdownLinks(body, 'rag')).not.toThrow();
  });
  it('valida âncoras entre capítulos com os documentos completos', () => {
    expect(() =>
      validateMarkdownLinks('[link](/capitulos/http-apis#contrato)', 'rag', {
        'http-apis': '## Contrato',
      }),
    ).not.toThrow();
    expect(() =>
      validateMarkdownLinks('[link](/capitulos/http-apis#ausente)', 'rag', {
        'http-apis': '## Contrato',
      }),
    ).toThrow();
  });
});
