import { useContext } from 'react';
import { LearningContext, type LearningContextValue } from './context';
export function useLearning(): LearningContextValue {
  const ctx = useContext(LearningContext);
  if (!ctx) throw Error('LearningProvider ausente');
  return ctx;
}
