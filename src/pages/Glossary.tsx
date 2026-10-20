import { useState } from 'react';
import { Link } from 'react-router-dom';
import { catalog, chapterById, chapterUrl } from '../lib/content';
import { normalize } from '../lib/search';
import { PageIntro, Empty } from '../components/Cards';
export default function Glossary() {
  const [q, setQ] = useState('');
  const terms = catalog.glossary
    .filter((t) =>
      normalize(t.title + ' ' + t.definition).includes(normalize(q)),
    )
    .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
  return (
    <>
      <PageIntro
        eyebrow="GLOSSÁRIO INTERLIGADO"
        title="Termos claros. Ideias conectadas."
        description="Definições técnicas em português e caminhos para compreender os conceitos em profundidade."
      />
      <label className="glossary-filter">
        Filtrar conceitos
        <input
          type="search"
          placeholder="Embedding, contexto, MCP..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </label>
      <nav className="glossary-index" aria-label="Índice de conceitos">
        {terms.map((t) => (
          <a key={t.id} href={`#${t.id}`}>
            {t.title}
          </a>
        ))}
      </nav>
      {terms.length ? (
        <div className="glossary-list">
          {terms.map((t) => (
            <article key={t.id} id={t.id}>
              <span className="glossary-letter">{t.title[0]}</span>
              <div>
                <h2>{t.title}</h2>
                <p>{t.definition}</p>
                <div className="glossary-links">
                  {t.chapters.map((c) => (
                    <Link key={c} to={chapterUrl(c)}>
                      {chapterById(c)!.title} ↗
                    </Link>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title="Conceito não encontrado"
          description="Tente outro termo ou consulte a biblioteca."
        />
      )}
    </>
  );
}
