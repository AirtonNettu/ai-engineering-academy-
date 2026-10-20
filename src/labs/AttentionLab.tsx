import { useCallback, useState } from 'react';
import { attention, tokenize, WQ, WK, WV } from './attention';
import { Controls } from './Controls';
import { usePlayback } from './usePlayback';
function Matrix({
  title,
  rows,
  active = false,
}: {
  title: string;
  rows: number[][];
  active?: boolean;
}) {
  return (
    <section
      className="lab-matrix"
      aria-label={`Matriz ${title}`}
      aria-current={active ? 'step' : undefined}
    >
      <h3>{title}</h3>
      <table>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((n, j) => (
                <td key={j}>{Number.isFinite(n) ? n.toFixed(3) : '−∞'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
export default function AttentionLab() {
  const [text, setText] = useState('eu estudo inteligência artificial');
  const [causal, setCausal] = useState(false);
  const [scale, setScale] = useState(1);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState([0, 0]);
  const tokens = tokenize(text);
  const a = attention(tokens, causal, scale);
  const steps = [
    'Q = XWq',
    'K = XWk',
    'V = XWv',
    'S = QKᵀ / √2',
    'A = softmax(S)',
    'O = AV',
  ];
  const tick = useCallback(() => setStep((s) => Math.min(5, s + 1)), []);
  usePlayback(playing && step < 5, tick, 850);
  const i = Math.min(selected[0], tokens.length - 1),
    j = Math.min(selected[1], tokens.length - 1);
  return (
    <section className="lab-panel" aria-label="Explorador de atenção">
      <h2>Tokenizar e calcular atenção</h2>
      <p>
        Uma cabeça de self-attention com dₖ = 2. Tokenização demonstrativa por
        espaços: até 8 tokens de 24 caracteres; vazio vira ∅. Cada vetor X =
        [sin(soma dos códigos Unicode), cos(soma)] × escala. Esses vetores e
        matrizes fixas são exemplos, sem treinamento ou vocabulário comercial.
      </p>
      <div className="lab-settings">
        <label>
          Texto de exemplo
          <input
            aria-label="Texto de exemplo"
            maxLength={240}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setStep(0);
              setPlaying(false);
            }}
          />
        </label>
        <label>
          Escala dos vetores: {scale}
          <input
            aria-label="Escala dos vetores"
            type="range"
            min=".1"
            max="3"
            step=".1"
            value={scale}
            onChange={(e) => setScale(+e.target.value)}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={causal}
            onChange={(e) => setCausal(e.target.checked)}
          />{' '}
          Máscara causal
        </label>
      </div>
      <p>Tokens: {tokens.map((t, i) => `${i}: ${t}`).join(' · ')}</p>
      <Controls
        playing={playing && step < 5}
        onPlay={() => setPlaying((v) => !v)}
        onStep={() => {
          setPlaying(false);
          tick();
        }}
        onReset={() => {
          setStep(0);
          setPlaying(false);
          setSelected([0, 0]);
        }}
        disabled={step === 5}
      />
      <p data-testid="attention-step" role="status">
        Etapa {step + 1}/6: {steps[step]}
      </p>
      <div className="lab-matrices">
        <Matrix title="Wq" rows={WQ} />
        <Matrix title="Wk" rows={WK} />
        <Matrix title="Wv" rows={WV} />
        <Matrix title="X" rows={a.embeddings} />
        <Matrix active={step === 0} title="Q" rows={a.q} />
        <Matrix active={step === 1} title="K" rows={a.k} />
        <Matrix active={step === 2} title="V" rows={a.v} />
        <Matrix
          active={step === 3}
          title="Scores escalonados"
          rows={a.scores}
        />
        <Matrix active={step === 5} title="Saída ponderada O" rows={a.output} />
      </div>
      <h3>Pesos A: selecione uma relação</h3>
      <p>
        Linhas = consultas; colunas = chaves. Cada linha soma 1. A máscara
        coloca −∞ antes da softmax, resultando em peso zero para tokens futuros.
      </p>
      <div
        className="lab-heatmap"
        aria-current={step === 4 ? 'step' : undefined}
        style={{
          gridTemplateColumns: `repeat(${tokens.length},minmax(0,1fr))`,
        }}
      >
        {a.weights.flatMap((row, r) =>
          row.map((w, c) => (
            <button
              key={`${r}-${c}`}
              style={{
                background: `color-mix(in srgb, var(--accent) ${Math.round(w * 25)}%, var(--panel))`,
              }}
              aria-pressed={i === r && j === c}
              aria-label={`${tokens[r]} consulta ${tokens[c]}: ${w.toFixed(3)}`}
              onMouseEnter={() => setSelected([r, c])}
              onFocus={() => setSelected([r, c])}
              onClick={() => setSelected([r, c])}
            >
              {w.toFixed(2)}
            </button>
          )),
        )}
      </div>
      <p role="status">
        {tokens[i]} → {tokens[j]}: score{' '}
        {Number.isFinite(a.scores[i][j])
          ? a.scores[i][j].toFixed(4)
          : '−∞ (mascarado)'}
        , peso {a.weights[i][j].toFixed(4)}. Contribuição para O[{i}] ={' '}
        {a.weights[i][j].toFixed(4)} × V[{j}] = [
        {a.v[j].map((n) => (n * a.weights[i][j]).toFixed(4)).join(', ')}].
      </p>
      <p>
        Softmax estável subtrai o maior score antes de exponenciar. O botão
        reproduzir percorre seis etapas finitas; todas as matrizes permanecem
        visíveis para comparação. Não inclui múltiplas cabeças, posições, camada
        residual ou MLP.
      </p>
    </section>
  );
}
