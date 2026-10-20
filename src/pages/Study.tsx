import { Link, useParams } from 'react-router-dom';
import { chapterById, chapterUrl } from '../lib/content';
import { useLearning } from '../learning/useLearning';
import { useChapterDocument } from '../lib/useChapterDocument';
import { Markdown } from '../components/Markdown';
import { slug } from '../lib/slug';
import { Diagram } from '../components/Diagram';
import { FlashcardDeck } from '../learning/FlashcardDeck';
import { flashcards } from '../learning/content';
import { SourcePreview } from '../components/SourcePreview';
import '../learning/learning.css';
const steps = [
  'Leitura fundamental',
  'Leitura intermediária',
  'Leitura avançada',
  'Arquitetura',
  'Implementação',
  'Flashcards',
];
export default function Study() {
  const { id = '' } = useParams();
  const chapter = chapterById(id);
  const { state, setStudy } = useLearning();
  const doc = useChapterDocument(id);
  if (!chapter)
    return (
      <section className="empty">
        <h1>Assunto não encontrado</h1>
        <Link to="/biblioteca">Voltar à biblioteca</Link>
      </section>
    );
  const saved = state.study[id] || { step: 0, completed: [], updatedAt: 0 };
  const step = saved.step;
  const depths = chapter.depths || [];
  const bounds = Array.from(doc.body.matchAll(/^## (.+)$/gm), (m) => ({
    anchor: slug(m[1]),
    position: m.index,
  }));
  const start =
    bounds.find((h) => h.anchor === depths[step]?.anchor)?.position ?? 0;
  const end =
    bounds.find((h) => h.anchor === depths[step + 1]?.anchor)?.position ??
    doc.body.length;
  const codeUrl = new URL(
    chapter.implementation?.url || '/projetos/fastapi-ollama',
    'https://academy.invalid',
  );
  const lab = codeUrl.pathname.split('/').at(-1);
  const file = codeUrl.pathname.startsWith('/laboratorios/')
    ? `src/labs/${lab === 'neural-network' ? 'neural' : lab}.ts`
    : `examples/fastapi-ollama/${codeUrl.searchParams.get('file') || 'app/main.py'}`;
  const cards = flashcards.filter((c) => c.chapterId === id);
  const answered = cards.filter((c) => state.cards[c.id]).length;
  return (
    <>
      <Link className="text-link back-link" to={chapterUrl(id)}>
        ← Voltar ao artigo completo
      </Link>
      <div className="page-intro">
        <span className="eyebrow green">PERCURSO DE ESTUDO</span>
        <h1>Estudar: {chapter.title}</h1>
        <p>
          Da teoria à arquitetura, da arquitetura ao código, do código à
          compreensão.
        </p>
      </div>
      <p className="study-progress" role="status">
        {saved.completed.length}/6 etapas concluídas. O progresso é uma marcação
        pessoal, não uma certificação.
      </p>
      <ol className="study-steps" aria-label="Etapas do percurso">
        {steps.map((title, i) => (
          <li key={title}>
            <button
              aria-label={`${i + 1} ${title}`}
              aria-current={step === i ? 'step' : undefined}
              onClick={() => setStudy(id, i)}
            >
              <span>{saved.completed.includes(i) ? '✓' : i + 1}</span>
              {title}
            </button>
          </li>
        ))}
      </ol>
      <section className="study-stage" aria-label={steps[step]}>
        <div className="study-stage-heading">
          <span className="eyebrow green">ETAPA {step + 1} DE 6</span>
          <h2>{steps[step]}</h2>
        </div>
        {step < 3 ? (
          doc.error ? (
            <p role="alert">
              Falha ao carregar o texto. Recarregue para tentar novamente.
            </p>
          ) : doc.body ? (
            <article className="prose">
              <Markdown source={doc.body.slice(start, end)} />
            </article>
          ) : (
            <p role="status">Carregando leitura…</p>
          )
        ) : step === 3 ? (
          <>
            <Diagram id={chapter.diagrams[0]} />
            {chapter.labs?.map((l) => (
              <Link
                className="button secondary"
                to={`/laboratorios/${l}`}
                key={l}
              >
                Executar laboratório de {l} →
              </Link>
            ))}
            <p className="small muted">
              Diagramas representam arquitetura. Os laboratórios vinculados
              calculam números reais, com limites didáticos explícitos.
            </p>
          </>
        ) : step === 4 ? (
          <>
            <p>{chapter.implementation?.label}</p>
            <Link
              className="button secondary"
              to={chapter.implementation?.url || '/projetos/fastapi-ollama'}
            >
              Abrir implementação com seus controles →
            </Link>
            <p className="small muted">
              Fonte real do repositório. Este arquivo não implementa sozinho
              todos os sistemas discutidos no artigo; consulte os limites e
              testes do exemplo.
            </p>
            <SourcePreview file={file} />
          </>
        ) : (
          <>
            <FlashcardDeck chapterId={id} />
            <p>
              {answered}/{cards.length} cartões deste assunto já respondidos.
              Responda todos ao menos uma vez para concluir esta etapa.
            </p>
          </>
        )}
      </section>
      <div className="study-navigation">
        <button
          className="button secondary"
          disabled={step === 0}
          onClick={() => setStudy(id, step - 1)}
        >
          Etapa anterior do percurso
        </button>
        <button
          className="button primary"
          disabled={
            (step < 3 && !doc.body) || (step === 5 && answered < cards.length)
          }
          onClick={() => setStudy(id, Math.min(5, step + 1), true)}
        >
          {step === 5 ? 'Concluir percurso' : 'Concluir etapa e avançar'}
        </button>
        {step < 5 && (
          <button
            className="text-button"
            onClick={() => setStudy(id, step + 1)}
          >
            Avançar sem concluir
          </button>
        )}
      </div>
      {saved.completed.length === 6 && (
        <p className="notice" role="status">
          Percurso concluído neste navegador. Continue revisando os cartões
          conforme a agenda.
        </p>
      )}
      <p className="coverage-note">
        Você pode voltar e retomar sem perder as marcações.{' '}
        <Link to="/meus-dados">Faça backup</Link>: o armazenamento local pode
        ser apagado pelo navegador.
      </p>
    </>
  );
}
