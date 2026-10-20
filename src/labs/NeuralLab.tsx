import { useCallback, useState } from 'react';
import { initialNetwork, forward, gradient, loss, train, XOR } from './neural';
import { Controls } from './Controls';
import { usePlayback } from './usePlayback';
export default function NeuralLab() {
  const [state, setState] = useState(() => ({
    p: initialNetwork(),
    epoch: 0,
    history: [loss(initialNetwork())],
  }));
  const [lr, setLr] = useState(1);
  const [budget, setBudget] = useState(3000);
  const [batch, setBatch] = useState(10);
  const [playing, setPlaying] = useState(false);
  const [sample, setSample] = useState(1);
  const advance = useCallback(
    (steps: number) => {
      setState((s) => {
        const n = Math.min(steps, budget - s.epoch);
        if (n <= 0) return s;
        const p = train(s.p, lr, n);
        return {
          p,
          epoch: s.epoch + n,
          history: [...s.history, loss(p)].slice(-250),
        };
      });
    },
    [budget, lr],
  );
  const tick = useCallback(
    () => advance(Math.min(batch, 20)),
    [advance, batch],
  );
  usePlayback(playing && state.epoch < budget, tick);
  const f = forward(state.p, XOR[sample].x);
  const nodes = [...XOR[sample].x, ...f.hidden, f.output];
  const xy = [
    [50, 85],
    [50, 215],
    [225, 50],
    [225, 150],
    [225, 250],
    [410, 150],
  ];
  return (
    <section className="lab-panel" aria-label="Rede neural interativa">
      <h2>Treinar e inspecionar a rede</h2>
      <p>
        Rede real 2 → 3 → 1. h = tanh(Wx + b); ŷ = sigmoid(vh + b). Loss = média
        de (ŷ − y)² nos quatro exemplos XOR. Backprop calcula ∂L/∂θ; cada época
        atualiza θ ← θ − η∇L usando o batch completo.
      </p>
      <div className="lab-settings">
        <label>
          Learning rate: {lr}
          <input
            aria-label="Learning rate"
            type="range"
            min="0.05"
            max="5"
            step=".05"
            value={lr}
            onChange={(e) => setLr(+e.target.value)}
          />
        </label>
        <label>
          Limite de épocas: {budget}
          <input
            aria-label="Limite de épocas"
            type="range"
            min={Math.max(100, state.epoch)}
            max="5000"
            step="1"
            value={budget}
            onChange={(e) => {
              setPlaying(false);
              setBudget(+e.target.value);
            }}
          />
        </label>
        <label>
          Épocas por atualização: {batch}
          <input
            aria-label="Épocas por atualização"
            type="range"
            min="1"
            max="20"
            value={batch}
            onChange={(e) => setBatch(+e.target.value)}
          />
        </label>
        <label>
          Entrada XOR
          <select
            aria-label="Entrada XOR"
            value={sample}
            onChange={(e) => setSample(+e.target.value)}
          >
            {XOR.map((d, i) => (
              <option key={i} value={i}>
                {d.x.join(', ')} → {d.y}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Controls
        playing={playing && state.epoch < budget}
        onPlay={() => setPlaying((v) => !v)}
        onStep={() => {
          setPlaying(false);
          advance(1);
        }}
        onReset={() => {
          setPlaying(false);
          setState({
            p: initialNetwork(),
            epoch: 0,
            history: [loss(initialNetwork())],
          });
        }}
        disabled={state.epoch >= budget}
      />
      <p role="status">
        Época <strong data-testid="epoch">{state.epoch}</strong> / {budget} ·
        MSE {loss(state.p).toFixed(6)} · saída {f.output.toFixed(4)}
      </p>
      <p aria-label="Gradiente do primeiro peso">
        ∂L/∂w₀ = {gradient(state.p)[0].toFixed(6)}. Próxima atualização desse
        peso: {state.p[0].toFixed(6)} − {lr} × {gradient(state.p)[0].toFixed(6)}{' '}
        = {(state.p[0] - lr * gradient(state.p)[0]).toFixed(6)}.
      </p>
      <svg
        viewBox="0 0 460 300"
        role="img"
        aria-label="Pesos e ativações da rede"
      >
        <title>
          Rede: azul indica peso positivo; tracejado indica peso negativo.
        </title>
        {[0, 1].flatMap((i) =>
          [0, 1, 2].map((j) => {
            const w = state.p[j * 2 + i];
            return (
              <g key={`${i}-${j}`}>
                <line
                  x1={xy[i][0]}
                  y1={xy[i][1]}
                  x2={xy[j + 2][0]}
                  y2={xy[j + 2][1]}
                  stroke={w >= 0 ? 'var(--accent)' : 'var(--muted)'}
                  strokeDasharray={w < 0 ? '5 4' : undefined}
                  strokeWidth={Math.min(5, 0.5 + Math.abs(w))}
                />
                <text
                  x={(xy[i][0] + xy[j + 2][0]) / 2}
                  y={(xy[i][1] + xy[j + 2][1]) / 2 - 5}
                >
                  {w.toFixed(2)}
                </text>
              </g>
            );
          }),
        )}
        {[0, 1, 2].map((j) => (
          <g key={j}>
            <line
              x1={225}
              y1={xy[j + 2][1]}
              x2="410"
              y2="150"
              stroke="var(--accent)"
              strokeDasharray={state.p[j + 9] < 0 ? '5 4' : undefined}
              strokeWidth={Math.min(5, 0.5 + Math.abs(state.p[j + 9]))}
            />
            <text x="310" y={(xy[j + 2][1] + 150) / 2 - 5}>
              {state.p[j + 9].toFixed(2)}
            </text>
          </g>
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={xy[i][0]} cy={xy[i][1]} r="25" />
            <text x={xy[i][0]} y={xy[i][1] + 4} textAnchor="middle">
              {n.toFixed(2)}
            </text>
            {i >= 2 && (
              <text x={xy[i][0]} y={xy[i][1] + 40} textAnchor="middle">
                b {state.p[i === 5 ? 12 : i + 4].toFixed(2)}
              </text>
            )}
          </g>
        ))}
      </svg>
      <h3>Histórico real da perda</h3>
      <svg
        viewBox="0 0 460 120"
        role="img"
        aria-label="Histórico de MSE, últimas 250 atualizações"
      >
        <line x1="5" y1="110" x2="455" y2="110" stroke="currentColor" />
        <polyline
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          points={state.history
            .map(
              (v, i) =>
                `${5 + (i * 450) / Math.max(1, state.history.length - 1)},${110 - v * 100}`,
            )
            .join(' ')}
        />
        <text x="5" y="15">
          MSE (escala 0–1)
        </text>
      </svg>
      <p>
        Uma atualização do gráfico pode reunir várias épocas; “Um passo” executa
        exatamente uma. Máximo de 20 épocas por atualização e 5.000 no total.
        Learning rate alto pode oscilar ou saturar ativações; esta rede didática
        não treina um LLM. Inicialização fixa permite reproduzir os resultados.
      </p>
    </section>
  );
}
