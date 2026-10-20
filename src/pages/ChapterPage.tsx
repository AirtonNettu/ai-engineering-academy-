import { useLearning } from '../learning/useLearning';
import '../learning/learning.css';
import { useHashScroll } from '../lib/useHashScroll';
import { useEffect, useState, type CSSProperties } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  CalendarDays,
  Minus,
  Plus,
} from 'lucide-react';
import { chapterById, catalog, chapterUrl } from '../lib/content';
import { readPreference, savePreference } from '../lib/storage';
import { Markdown } from '../components/Markdown';
import { slug } from '../lib/slug';
import { Diagram } from '../components/Diagram';
import { Empty } from '../components/Cards';
const documents = import.meta.glob('../../content/chapters/*.md', {
  query: '?raw',
  import: 'default',
});
export default function ChapterPage() {
  const { id = '' } = useParams();
  const chapter = chapterById(id);
  const [document, setDocument] = useState({ id: '', body: '', error: false });
  const { state, markReading } = useLearning();
  const progress = state.reading;
  const [font, setFont] = useState(() => {
    const v = readPreference<unknown>('fontSize', 18);
    return typeof v === 'number' && v >= 16 && v <= 24 ? v : 18;
  });
  useEffect(() => {
    let active = true;
    const load = documents[`../../content/chapters/${id}.md`];
    if (load)
      load()
        .then((body) => {
          if (active) setDocument({ id, body: String(body), error: false });
        })
        .catch(() => {
          if (active) setDocument({ id, body: '', error: true });
        });
    return () => {
      active = false;
    };
  }, [id]);
  useHashScroll(document.id === id && !!document.body);
  if (!chapter)
    return (
      <Empty
        title="Capítulo não encontrado"
        description="Volte à biblioteca para consultar os capítulos publicados."
      />
    );
  const body = document.id === id ? document.body : '';
  const toc = Array.from(body.matchAll(/^## (.+)$/gm), (m) => m[1]);
  const area = catalog.areas.find((a) => a.id === chapter.category)!;
  function changeFont(v: number) {
    setFont(v);
    savePreference('fontSize', v);
  }
  function mark() {
    markReading(id);
  }
  return (
    <>
      <Link className="text-link back-link" to="/biblioteca">
        <ArrowLeft size={16} /> Biblioteca <span>/</span> {area.title}
      </Link>
      <div className="reader-header">
        <span className="eyebrow green">{area.title}</span>
        <h1>{chapter.title}</h1>
        <p>{chapter.description}</p>
        <div className="reader-meta">
          <span>
            <Clock3 size={15} />
            {chapter.minutes} min de leitura
          </span>
          <span>
            <CalendarDays size={15} />
            Revisão técnica: {chapter.reviewedAt.split('-').reverse().join('/')}
          </span>
          <span className="tag">
            {chapter.status === 'revisado-tecnicamente'
              ? 'Revisado tecnicamente'
              : 'Rascunho'}
          </span>
        </div>
      </div>
      <nav className="depth-navigation" aria-label="Profundidades do artigo">
        {chapter.depths.map((depth, i) => (
          <a href={`#${depth.anchor}`} key={depth.id}>
            {i + 1}. {depth.title}
          </a>
        ))}
      </nav>
      <Link className="button primary chapter-study-link" to={`/estudar/${id}`}>
        Estudar este assunto →
      </Link>
      <div className="reader-layout">
        <div className="reader-main">
          <div className="reader-toolbar">
            <button
              className={`button small-button ${progress[id] ? 'read-button' : 'secondary'}`}
              onClick={mark}
            >
              {progress[id] ? <Check size={16} /> : null}
              {progress[id] ? 'Lido — desmarcar' : 'Marcar como lido'}
            </button>
            <div className="font-controls">
              <span>Tamanho do texto</span>
              <button
                className="icon-button"
                aria-label="Diminuir fonte"
                disabled={font <= 16}
                onClick={() => changeFont(font - 1)}
              >
                <Minus size={16} />
              </button>
              <span>{font}</span>
              <button
                className="icon-button"
                aria-label="Aumentar fonte"
                disabled={font >= 24}
                onClick={() => changeFont(font + 1)}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          {document.error ? (
            <div role="alert" className="notice">
              Não foi possível carregar o capítulo.{' '}
              <button onClick={() => window.location.reload()}>
                Tentar novamente
              </button>
            </div>
          ) : body ? (
            <article
              className="prose"
              style={{ '--reader-font': `${font}px` } as CSSProperties}
            >
              <Markdown source={body} />
            </article>
          ) : (
            <p role="status">Carregando capítulo…</p>
          )}
          {chapter.diagrams.map((d) => (
            <Diagram key={d} id={d} />
          ))}
          <section id="referencias" className="references">
            <h2>Referências e documentação</h2>
            <p className="muted">
              Explicações originais da Academy. Consulte as fontes para detalhes
              de especificação e versões.
            </p>
            <ul>
              {chapter.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.title} ↗
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <section className="related">
            <h2>Continue conectando as ideias</h2>
            {chapter.related.map((r) => (
              <Link key={r} to={chapterUrl(r)}>
                {chapterById(r)!.title}
                <ArrowRight size={17} />
              </Link>
            ))}
          </section>
        </div>
        <aside className="reader-aside">
          <nav aria-label="Neste capítulo">
            <span className="eyebrow">NESTE CAPÍTULO</span>
            {toc.map((t) => (
              <a href={`#${slug(t)}`} key={t}>
                {t}
              </a>
            ))}
            <a href="#referencias">Referências</a>
          </nav>
          <div className="reader-concepts">
            <span className="eyebrow">CONECTE OS CONCEITOS</span>
            {chapter.concepts.map((c) => (
              <Link key={c} to={`/glossario#${c}`}>
                {catalog.glossary.find((t) => t.id === c)!.title} ↗
              </Link>
            ))}
          </div>
          {chapter.codeFiles.length > 0 && (
            <Link className="reader-project" to="/projetos/fastapi-ollama">
              <strong>Da teoria ao arquivo</strong>
              <span>Explore o projeto FastAPI + Ollama →</span>
            </Link>
          )}
        </aside>
      </div>
    </>
  );
}
