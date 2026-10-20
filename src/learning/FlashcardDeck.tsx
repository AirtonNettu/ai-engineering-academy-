import { useEffect, useState } from 'react';
import { flashcards } from './content';
import { useLearning } from './useLearning';
import { reviewStats } from './scheduler';
import { Link } from 'react-router-dom';
export function FlashcardDeck({ chapterId }: { chapterId?: string }) {
  const { state, review } = useLearning();
  const [difficulty, setDifficulty] = useState('todas');
  const [dueOnly, setDueOnly] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [clock, setClock] = useState(Date.now);
  useEffect(() => {
    const t = window.setInterval(() => setClock(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);
  const matching = flashcards.filter(
    (c) =>
      (!chapterId || c.chapterId === chapterId) &&
      (difficulty === 'todas' || c.difficulty === difficulty),
  );
  const queue = matching.filter(
    (c) => !dueOnly || !state.cards[c.id] || state.cards[c.id].dueAt <= clock,
  );
  const card = queue.length ? queue[cursor % queue.length] : undefined;
  const stats = reviewStats(
    Object.fromEntries(
      matching
        .filter((c) => state.cards[c.id])
        .map((c) => [c.id, state.cards[c.id]]),
    ),
  );
  function grade(correct: boolean) {
    if (!card) return;
    review(card.id, correct);
    setFlipped(false);
    if (!dueOnly) setCursor((n) => n + 1);
  }
  const label = {
    basico: 'Fundamental',
    intermediario: 'Intermediário',
    avancado: 'Avançado',
  };
  return (
    <section className="flashcard-deck" aria-label="Revisão de flashcards">
      <div className="learning-statistics">
        <span>{stats.reviews} revisões respondidas</span>
        <span>
          {stats.studied}/{matching.length} cartões estudados
        </span>
        <span>
          {stats.reviews
            ? `${Math.round((100 * stats.correct) / stats.reviews)}% de acertos declarados`
            : 'Sem taxa de acerto antes da primeira resposta'}
        </span>
      </div>
      <div className="learning-filters">
        <label>
          Dificuldade
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              setCursor(0);
              setFlipped(false);
            }}
          >
            <option value="todas">Todas</option>
            <option value="basico">Fundamental</option>
            <option value="intermediario">Intermediário</option>
            <option value="avancado">Avançado</option>
          </select>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={dueOnly}
            onChange={(e) => {
              setDueOnly(e.target.checked);
              setCursor(0);
              setFlipped(false);
            }}
          />{' '}
          Apenas cartões novos ou vencidos
        </label>
      </div>
      {!dueOnly && (
        <p className="notice">
          Prática antecipada: suas respostas também atualizam a agenda. Isso não
          comprova domínio nem retenção.
        </p>
      )}
      {card ? (
        <article className="review-card" key={card.id}>
          <span className="eyebrow green">
            {label[card.difficulty]} · {card.chapterId} · {queue.length} na fila
            atual
          </span>
          <h2>{card.front}</h2>
          {flipped ? (
            <>
              <div className="review-answer" aria-live="polite">
                <h3>Resposta editorial</h3>
                <p>{card.back}</p>
                <a
                  href={card.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fonte de referência ↗
                </a>
              </div>
              <div className="review-actions">
                <button
                  className="button secondary"
                  onClick={() => grade(false)}
                >
                  Errei
                </button>
                <button className="button primary" onClick={() => grade(true)}>
                  Acertei
                </button>
              </div>
              <p className="small muted">
                Avalie sua própria lembrança, não apenas se a resposta parece
                familiar.
              </p>
            </>
          ) : (
            <button className="button primary" onClick={() => setFlipped(true)}>
              Mostrar resposta
            </button>
          )}
        </article>
      ) : (
        <div className="empty">
          <h2>Revisões em dia para este filtro</h2>
          <p>
            Não há cartões novos ou vencidos agora. Você pode praticar
            antecipadamente desmarcando o filtro.
          </p>
          {matching.some((c) => state.cards[c.id]) && (
            <p>
              Próxima revisão:{' '}
              {new Date(
                Math.min(
                  ...matching
                    .filter((c) => state.cards[c.id])
                    .map((c) => state.cards[c.id].dueAt),
                ),
              ).toLocaleString('pt-BR')}
            </p>
          )}
        </div>
      )}
      <details className="review-policy">
        <summary>Como a revisão espaçada funciona?</summary>
        <p>
          Os cartões são escritos e revisados editorialmente; não são gerados
          por IA nesta página. Ao errar, você revisa novamente em 10 minutos e a
          sequência é reiniciada. Acertos consecutivos usam 1, 3, 7, 14 e depois
          30 dias (intervalos de 24 horas). Não é um modelo adaptativo de
          memória nem uma medição automática de aprendizado.
        </p>
        <p>
          As estatísticas contam respostas efetivamente dadas neste navegador.
          Alterar o relógio do dispositivo afeta quais cartões vencem. Não há
          sincronização, login ou telemetria.
        </p>
        <Link className="text-link" to="/meus-dados">
          Exportar, importar ou limpar dados de estudo →
        </Link>
      </details>
    </section>
  );
}
