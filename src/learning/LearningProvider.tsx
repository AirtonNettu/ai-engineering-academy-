import { useState, type ReactNode } from 'react';
import {
  emptyLearning,
  loadLearning,
  persistLearning,
  type LearningState,
} from './model';
import { scheduleReview } from './scheduler';
import { LearningContext } from './context';
export function LearningProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(loadLearning);
  const [warning, setWarning] = useState('');
  function commit(next: LearningState) {
    setState(next);
    setWarning(
      persistLearning(next)
        ? ''
        : 'Armazenamento indisponível: suas alterações estão apenas na memória desta página. Exporte um backup antes de sair.',
    );
  }
  return (
    <LearningContext.Provider
      value={{
        state,
        warning,
        markReading: (id) =>
          commit({
            ...state,
            reading: { ...state.reading, [id]: !state.reading[id] },
          }),
        clearReading: () => commit({ ...state, reading: {} }),
        setStudy: (id, step, complete = false) => {
          const old = state.study[id] || {
            step: 0,
            completed: [],
            updatedAt: 0,
          };
          const completed = complete
            ? [...new Set([...old.completed, old.step])]
            : old.completed;
          commit({
            ...state,
            study: {
              ...state.study,
              [id]: { step, completed, updatedAt: Date.now() },
            },
          });
        },
        review: (id, correct) =>
          commit({
            ...state,
            cards: {
              ...state.cards,
              [id]: scheduleReview(state.cards[id], correct, Date.now()),
            },
          }),
        replace: commit,
        clear: () => commit(emptyLearning()),
      }}
    >
      {warning && (
        <div className="persistence-warning" role="alert">
          {warning}
        </div>
      )}
      {children}
    </LearningContext.Provider>
  );
}
