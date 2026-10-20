import { useEffect, useState } from 'react';
const documents = import.meta.glob('../../content/chapters/*.md', {
  query: '?raw',
  import: 'default',
});
export function useChapterDocument(id: string) {
  const [value, setValue] = useState({ id: '', body: '', error: false });
  useEffect(() => {
    let active = true;
    const loader = documents[`../../content/chapters/${id}.md`];
    if (loader)
      loader()
        .then((body) => {
          if (active) setValue({ id, body: String(body), error: false });
        })
        .catch(() => {
          if (active) setValue({ id, body: '', error: true });
        });
    return () => {
      active = false;
    };
  }, [id]);
  return {
    body: value.id === id ? value.body : '',
    error: value.id === id && value.error,
  };
}
