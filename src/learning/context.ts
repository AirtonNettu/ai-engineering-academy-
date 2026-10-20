import { createContext } from 'react';
import type { LearningState } from './model';
export type LearningContextValue = {
  state: LearningState;
  warning: string;
  markReading: (id: string) => void;
  clearReading: () => void;
  setStudy: (id: string, step: number, complete?: boolean) => void;
  review: (id: string, correct: boolean) => void;
  replace: (state: LearningState) => void;
  clear: () => void;
};
export const LearningContext = createContext<LearningContextValue | null>(null);
