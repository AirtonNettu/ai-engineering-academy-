import { useSearchParams, Link } from 'react-router-dom';
import { catalog } from '../lib/content';
import { PageIntro } from '../components/Cards';
import { FlashcardDeck } from '../learning/FlashcardDeck';
import '../learning/learning.css';
export default function Flashcards() {
  const [params, setParams] = useSearchParams();
  const requested = params.get('capitulo') || '';
  const id = catalog.chapters.some((c) => c.id === requested)
    ? requested
    : undefined;
  return (
    <>
      <PageIntro
        eyebrow="REVISÃO ESPAÇADA"
        title="Lembrar também é uma prática."
        description="Cartões editoriais contextualizados. Revele a resposta, avalie sua lembrança e retorne no intervalo agendado — tudo neste navegador."
      />
      <label className="learning-chapter-filter">
        Assunto
        <select
          value={id || ''}
          onChange={(e) =>
            setParams(e.target.value ? { capitulo: e.target.value } : {})
          }
        >
          <option value="">Todos os assuntos</option>
          {catalog.chapters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </label>
      <FlashcardDeck key={id || 'all'} chapterId={id} />
      <p className="coverage-note">
        Seu navegador pode apagar os dados locais.{' '}
        <Link to="/meus-dados">Exporte um backup</Link> para preservá-los;
        nenhum dado é enviado a terceiros.
      </p>
    </>
  );
}
