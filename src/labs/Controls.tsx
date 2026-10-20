import { Play, Pause, RotateCcw, StepForward } from 'lucide-react';
export function Controls({
  playing,
  onPlay,
  onStep,
  onReset,
  disabled = false,
}: {
  playing: boolean;
  onPlay: () => void;
  onStep: () => void;
  onReset: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="lab-controls">
      <button onClick={onPlay} disabled={disabled}>
        {playing ? <Pause size={16} /> : <Play size={16} />}{' '}
        {playing ? 'Pausar' : 'Reproduzir'}
      </button>
      <button onClick={onStep} disabled={disabled}>
        <StepForward size={16} /> Um passo
      </button>
      <button onClick={onReset}>
        <RotateCcw size={16} /> Reiniciar
      </button>
    </div>
  );
}
