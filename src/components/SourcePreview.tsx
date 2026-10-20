import { useEffect, useState } from 'react';
import { CodeBlock } from './CodeBlock';
const files = import.meta.glob(
  [
    '/src/labs/*.ts',
    '/src/lib/agent-cycle.ts',
    '/examples/fastapi-ollama/app/**/*.py',
    '/examples/fastapi-ollama/tests/*.py',
  ],
  { query: '?raw', import: 'default' },
);
export function SourcePreview({ file }: { file: string }) {
  const [loaded, setLoaded] = useState({ file: '', code: '', error: false });
  useEffect(() => {
    let active = true;
    const load = files['/' + file];
    if (load)
      load()
        .then((code) => {
          if (active) setLoaded({ file, code: String(code), error: false });
        })
        .catch(() => {
          if (active) setLoaded({ file, code: '', error: true });
        });
    return () => {
      active = false;
    };
  }, [file]);
  if (!files['/' + file])
    return <p role="alert">Não há código associado a este caminho.</p>;
  if (loaded.error)
    return (
      <p role="alert">
        Não foi possível carregar a fonte. Recarregue para tentar novamente.
      </p>
    );
  if (loaded.file !== file) return <p role="status">Carregando fonte real…</p>;
  return (
    <CodeBlock
      title={file}
      language={file.endsWith('.py') ? 'python' : 'typescript'}
      code={loaded.code}
    />
  );
}
