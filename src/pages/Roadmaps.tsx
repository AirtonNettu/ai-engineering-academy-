import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Route } from 'lucide-react';
import { catalog, chapterById, chapterUrl } from '../lib/content';
import { PageIntro } from '../components/Cards';
export default function Roadmaps() {
  const [params, setParams] = useSearchParams();
  const roadmap =
    catalog.roadmaps.find((r) => r.id === params.get('trilha')) ||
    catalog.roadmaps[0];
  const index = Number(params.get('etapa') || 0);
  const selected =
    Number.isInteger(index) && index >= 0 && index < roadmap.steps.length
      ? index
      : 0;
  const step = roadmap.steps[selected];
  return (
    <>
      <PageIntro
        eyebrow="TRILHAS PROFISSIONAIS"
        title="Escolha a direção. Construa o caminho."
        description="Três papéis distintos, competências conectadas e um ponto de partida honesto. Selecione uma etapa para encontrar leituras relacionadas."
      />
      <div className="roadmap-tabs">
        {catalog.roadmaps.map((r) => (
          <button
            key={r.id}
            aria-pressed={r.id === roadmap.id}
            onClick={() => setParams({ trilha: r.id })}
          >
            <Route size={21} />
            <strong>{r.title}</strong>
            <span>{r.focus}</span>
          </button>
        ))}
      </div>
      <section className="roadmap-intro">
        <span className="eyebrow green">{roadmap.focus}</span>
        <h2>{roadmap.title}</h2>
        <p>{roadmap.description}</p>
      </section>
      <div className="roadmap-layout">
        <ol className="roadmap-path" aria-label="Competências da trilha">
          {roadmap.steps.map((s, i) => (
            <li key={s.title}>
              <button
                aria-pressed={selected === i}
                onClick={() =>
                  setParams({ trilha: roadmap.id, etapa: String(i) })
                }
              >
                <span className="roadmap-index">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <strong>{s.title}</strong>
                  <span>
                    {s.chapters.length
                      ? `${s.chapters.length} leituras relacionadas`
                      : 'Conteúdo dedicado ainda não publicado'}
                  </span>
                </div>
                <ArrowUpRight size={17} />
              </button>
            </li>
          ))}
        </ol>
        <section className="competency" aria-live="polite">
          <span className="eyebrow green">COMPETÊNCIA {selected + 1}</span>
          <h2>{step.title}</h2>
          <p>{step.description}</p>
          <h3>Conecte com a biblioteca</h3>
          {step.chapters.length ? (
            step.chapters.map((id) => (
              <Link to={chapterUrl(id)} key={id}>
                {chapterById(id)!.title}
                <ArrowUpRight size={17} />
              </Link>
            ))
          ) : (
            <p className="notice">
              Ainda não há capítulo dedicado a esta competência. Consulte os
              recursos oficiais enquanto a cobertura editorial é ampliada.
            </p>
          )}
          <Link className="text-link" to="/recursos">
            Documentação e ferramentas oficiais →
          </Link>
        </section>
      </div>
      <p className="coverage-note">
        As trilhas são mapas de competências, não certificações. Leituras
        relacionadas podem cobrir apenas parte de cada etapa.
      </p>
    </>
  );
}
