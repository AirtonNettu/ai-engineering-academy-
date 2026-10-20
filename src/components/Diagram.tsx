import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  FileCode2,
} from 'lucide-react';
import { catalog } from '../lib/content';
export function Diagram({ id = 'rag' }: { id?: string }) {
  const diagram = catalog.diagrams.find((d) => d.id === id)!;
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const node = diagram.nodes[step];
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setStep((s) => (s + 1) % diagram.nodes.length),
      2400,
    );
    return () => clearInterval(timer);
  }, [playing, diagram.nodes.length]);
  return (
    <section className="diagram" aria-label={diagram.title}>
      <div className="diagram-heading">
        <div>
          <span className="eyebrow">ARQUITETURA EXPLORÁVEL</span>
          <h2>{diagram.title}</h2>
        </div>
        <span className="tag">Simulação didática</span>
      </div>
      <p className="muted">{diagram.description}</p>
      <div
        className={`flow flow-${diagram.id}`}
        role="group"
        aria-label="Etapas do fluxo"
      >
        {diagram.nodes.map((n, i) => (
          <button
            className={`flow-node ${i === step ? 'selected' : ''} ${i < step ? 'visited' : ''}`}
            key={n.id}
            aria-label={`${i + 1} ${n.title}`}
            aria-pressed={i === step}
            onClick={() => {
              setStep(i);
              setPlaying(false);
            }}
          >
            <span className="node-number">{i + 1}</span>
            <strong>{n.title}</strong>
            {i < diagram.nodes.length - 1 && (
              <ArrowRight className="flow-arrow" aria-hidden size={17} />
            )}
          </button>
        ))}
      </div>
      <div className="diagram-detail" aria-live={playing ? 'off' : 'polite'}>
        <div>
          <span className="eyebrow">
            ETAPA {step + 1} DE {diagram.nodes.length}
          </span>
          <h3>{node.title}</h3>
          <p>{node.description}</p>
          {node.file && (
            <Link
              className="text-link"
              to={`/projetos/fastapi-ollama?file=${encodeURIComponent(node.file)}`}
            >
              <FileCode2 size={16} /> Explorar {node.file}
            </Link>
          )}
        </div>
        <div className="flow-controls">
          <button
            className="icon-button"
            aria-label="Etapa anterior"
            disabled={step === 0}
            onClick={() => {
              setStep((s) => s - 1);
              setPlaying(false);
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            className="icon-button"
            aria-label={playing ? 'Pausar animação' : 'Reproduzir animação'}
            aria-pressed={playing}
            onClick={() => setPlaying((v) => !v)}
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            className="icon-button"
            aria-label="Próxima etapa"
            disabled={step === diagram.nodes.length - 1}
            onClick={() => {
              setStep((s) => s + 1);
              setPlaying(false);
            }}
          >
            <ArrowRight size={18} />
          </button>
          <button
            className="icon-button"
            aria-label="Reiniciar etapas"
            onClick={() => {
              setStep(0);
              setPlaying(false);
            }}
          >
            <RotateCcw size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
