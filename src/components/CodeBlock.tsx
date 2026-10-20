import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { ThemedToken } from 'shiki';
export function CodeBlock({
  code,
  language = 'text',
  title,
}: {
  code: string;
  language?: string;
  title?: string;
}) {
  const [tokens, setTokens] = useState<ThemedToken[][]>([]);
  const [copy, setCopy] = useState('Copiar');
  useEffect(() => {
    let active = true;
    import('../lib/highlighter')
      .then((m) => m.highlighter)
      .then((h) => {
        const lang = h.getLoadedLanguages().includes(language)
          ? language
          : 'text';
        const result = h.codeToTokens(code, { lang, theme: 'github-dark' });
        if (active) setTokens(result.tokens);
      })
      .catch(() => {
        /* Código em texto simples permanece disponível. */
      });
    return () => {
      active = false;
    };
  }, [code, language]);
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopy('Copiado');
    } catch {
      setCopy('Não foi possível copiar; selecione o texto.');
    }
  }
  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>{title || language}</span>
        <button
          onClick={copyCode}
          aria-label={`Copiar código${title ? ` de ${title}` : ''}`}
        >
          {copy === 'Copiado' ? <Check size={14} /> : <Copy size={14} />} {copy}
        </button>
        <span className="sr-only" role="status">
          {copy !== 'Copiar' ? copy : ''}
        </span>
      </div>
      <pre
        className="source-code"
        tabIndex={0}
        aria-label={title || `Código ${language}`}
      >
        <code>
          {tokens.length
            ? tokens.map((line, i) => (
                <span className="code-line" key={i}>
                  <span className="line-number" aria-hidden="true">
                    {i + 1}
                  </span>
                  {line.map((token, j) => (
                    <span key={j} style={{ color: token.color }}>
                      {token.content}
                    </span>
                  ))}
                  {'\n'}
                </span>
              ))
            : code.split('\n').map((line, i) => (
                <span className="code-line" key={i}>
                  <span className="line-number" aria-hidden="true">
                    {i + 1}
                  </span>
                  {line}
                  {'\n'}
                </span>
              ))}
        </code>
      </pre>
    </div>
  );
}
