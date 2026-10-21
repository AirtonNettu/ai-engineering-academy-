import { useLearning } from '../learning/useLearning';
import { useSearchParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { catalog, chapters } from '../lib/content';
import { normalize } from '../lib/search';

import { ChapterCard, Empty, PageIntro } from '../components/Cards';
export default function Library() {
  const [params, setParams] = useSearchParams();
  const area = params.get('area') || 'todas';
  const [query, setQuery] = useState('');
  const { state, clearReading } = useLearning();
  const progress = state.reading;
  const [onlyRead, setOnlyRead] = useState(false);
  const filtered = chapters.filter(
    (c) =>
      (area === 'todas' || c.category === area) &&
      normalize(`${c.title} ${c.tags.join(' ')}`).includes(normalize(query)) &&
      (!onlyRead || progress[c.id]),
  );
  const selected = catalog.areas.find((a) => a.id === area);
  return (
    <>
      <PageIntro
        eyebrow="BIBLIOTECA TÉCNICA"
        title="Conhecimento que se conecta."
        description="Leia com profundidade. Explore a arquitetura. Entenda a implementação. Sem atalhos para o que importa."
      />
      <div className="library-tools">
        <label className="input-with-icon">
          <Search size={18} />
          <span className="sr-only">Filtrar capítulos</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Encontre um assunto na biblioteca..."
          />
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={onlyRead}
            onChange={(e) => setOnlyRead(e.target.checked)}
          />{' '}
          Apenas lidos
        </label>
      </div>
      <div
        className="filter-tabs"
        role="group"
        aria-label="Área de conhecimento"
      >
        <button aria-pressed={area === 'todas'} onClick={() => setParams({})}>
          Todos os capítulos <span>{chapters.length}</span>
        </button>
        {catalog.areas.map((a) => (
          <button
            key={a.id}
            aria-pressed={area === a.id}
            onClick={() => setParams({ area: a.id })}
          >
            {a.title}
          </button>
        ))}
      </div>
      <div className="results-caption">
        <span>
          {filtered.length} capítulos disponíveis
          {selected ? ` em ${selected.title}` : ''}
        </span>
        <span>
          {chapters.filter((c) => progress[c.id]).length}/{chapters.length}{' '}
          lidos neste navegador
        </span>
      </div>
      <h2 className="sr-only">Capítulos disponíveis</h2>
      {filtered.length ? (
        <div className="chapter-grid library-grid">
          {filtered.map((c) => (
            <ChapterCard
              key={c.id}
              chapter={c}
              index={chapters.indexOf(c)}
              read={!!progress[c.id]}
            />
          ))}
        </div>
      ) : (
        <Empty
          title="Nenhum capítulo encontrado"
          description="Tente outro termo ou remova os filtros para continuar explorando."
        />
      )}
      <section className="curriculum section">
        <h2>O mapa completo de conhecimento</h2>
        <p className="muted">
          A taxonomia abaixo orienta a expansão editorial. Um tópico neste mapa
          não significa que já exista um capítulo dedicado.
        </p>
        {(selected ? [selected] : catalog.areas).map((a) => (
          <details key={a.id}>
            <summary>
              {a.title}
              <span>{a.topics.length} tópicos curriculares</span>
            </summary>
            <div className="topic-cloud">
              {a.topics.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <Link to={`/biblioteca?area=${a.id}`} className="text-link">
              Ver capítulos disponíveis desta área →
            </Link>
          </details>
        ))}
      </section>
      <div className="local-data">
        <p>
          O progresso fica apenas neste navegador. Nenhuma conta ou
          sincronização.
        </p>
        <button
          className="text-button"
          onClick={() => {
            clearReading();
          }}
        >
          <RotateCcw size={15} /> Apagar progresso local
        </button>
      </div>
    </>
  );
}
