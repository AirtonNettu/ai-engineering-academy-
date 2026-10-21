import { describe, expect, it } from 'vitest';
import { renderStaticChapter } from '../../scripts/render-chapter';
import { siteOrigin } from '../../scripts/site-origin';
import { catalog } from '../lib/content';
describe('publicação estática segura', () => {
  it('valida uma origem HTTPS sem credenciais, caminho, query ou fragmento', () => {
    expect(siteOrigin(undefined)).toBeNull();
    expect(siteOrigin('https://academy.example/')).toBe(
      'https://academy.example',
    );
    for (const value of [
      'http://example.com',
      'https://user:pass@example.com',
      'https://example.com/path',
      'https://example.com?key=x',
      'https://example.com/#x',
      'bad',
    ]) {
      expect(() => siteOrigin(value)).toThrow();
    }
  });
  it('inclui artigo, âncoras, código escapado e referências sem executar HTML', () => {
    const html = renderStaticChapter(
      catalog.chapters[0],
      '## Uma seção\n\nTexto original.\n\n```python\nprint("<tag>")\n```\n\n<script>alert(1)</script>\n\n[ruim](javascript:alert(1))',
    );
    expect(html).toContain('<h1>');
    expect(html).toContain('id="uma-secao"');
    expect(html).toContain('Texto original.');
    expect(html).toContain('&lt;tag&gt;');
    expect(html).toContain('id="referencias"');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('href="javascript:');
  });
});
