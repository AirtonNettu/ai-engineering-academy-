import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Route } from 'lucide-react';
import { catalog, chapterById, chapterUrl } from '../lib/content';
import { PageIntro } from '../components/Cards';
import './Roadmaps.css';
export default function Roadmaps() {
  const [params, setParams] = useSearchParams();
  const roadmap =
    catalog.roadmaps.find((r) => r.id === params.get('trilha')) ||
    catalog.roadmaps[0];
  const level =
    roadmap.levels.find((item) => item.id === params.get('nivel')) ||
    roadmap.levels[0];
  const choose = (changes: Record<string, string>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) next.set(key, value);
    setParams(next);
  };
  const labTitles: Record<string, string> = {
    'neural-network': 'Treinamento de rede neural',
    attention: 'Attention Explorer',
    embeddings: 'Embedding Explorer',
  };
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
        description="Quatro especialidades, responsabilidades contextualizadas e entregáveis concretos. Selecione uma trilha, uma senioridade e uma etapa para orientar seu estudo."
      />
      <div className="roadmap-tabs roadmap-specialties">
        {catalog.roadmaps.map((r) => (
          <button
            key={r.id}
            aria-pressed={r.id === roadmap.id}
            onClick={() => choose({ trilha: r.id, etapa: '0' })}
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
      <section className="roadmap-levels" aria-labelledby="levels-title">
        <h2 id="levels-title">Responsabilidade por senioridade</h2>
        <p className="notice">
          Estes níveis são referências de conversa, não padrões universais nem
          checklists de tecnologias. Autonomia, complexidade, responsabilidade,
          impacto e mentoria dependem da equipe e do contexto. Profundidade de
          artigo é uma dimensão diferente de senioridade.
        </p>
        <div
          className="seniority-options"
          aria-label="Senioridade profissional"
        >
          {roadmap.levels.map((item) => (
            <button
              key={item.id}
              aria-pressed={level.id === item.id}
              onClick={() => choose({ nivel: item.id })}
            >
              {item.title}
            </button>
          ))}
        </div>
        <div className="seniority-detail" aria-live="polite">
          <h3>
            {roadmap.title} · {level.title}
          </h3>
          <div className="seniority-columns">
            <div>
              <h4>Pré-requisitos</h4>
              <ul>
                {level.prerequisites.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Responsabilidades e autonomia</h4>
              <ul>
                {level.responsibilities.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Entregáveis para revisão</h4>
              <ul>
                {level.deliverables.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </div>
          </div>
          <nav
            className="seniority-reading"
            aria-label="Artigos e laboratórios para o nível"
          >
            {level.chapters.map((id) => (
              <Link key={id} to={chapterUrl(id)}>
                {chapterById(id)!.title}
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            ))}
            {level.labs.map((id) => (
              <Link key={id} to={`/laboratorios/${id}`}>
                Laboratório: {labTitles[id]}
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </div>
        <Link className="text-link" to="/capitulos/carreira-ai-engineer">
          Compare os papéis e entenda o contexto profissional →
        </Link>
      </section>
      <div className="roadmap-layout">
        <ol className="roadmap-path" aria-label="Competências da trilha">
          {roadmap.steps.map((s, i) => (
            <li key={s.title}>
              <button
                aria-pressed={selected === i}
                onClick={() => choose({ trilha: roadmap.id, etapa: String(i) })}
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
