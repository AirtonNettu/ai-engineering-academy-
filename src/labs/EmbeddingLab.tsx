import { useCallback, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { documents, rank } from './embeddings';
import { Controls } from './Controls';
import { usePlayback } from './usePlayback';
export default function EmbeddingLab() {
  const [query, setQuery] = useState('rag');
  const [positions, setPositions] = useState(() =>
    documents.map((d) => [...d.position]),
  );
  const [view, setView] = useState({ x: 0, y: 0, z: 1 });
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const pointers = useRef(
    new Map<number, { x: number; y: number; node: number | null }>(),
  );
  const svg = useRef<SVGSVGElement>(null);
  const ranking = rank(documents.find((d) => d.id === query)!.vector);
  const active = ranking[selected];
  const tick = useCallback(
    () => setSelected((s) => Math.min(documents.length - 1, s + 1)),
    [],
  );
  usePlayback(playing && selected < documents.length - 1, tick, 1000);
  function point(e: PointerEvent<SVGElement>) {
    const rect = svg.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * 460) / (rect.width || 460),
      y: ((e.clientY - rect.top) * 330) / (rect.height || 330),
    };
  }
  function down(e: PointerEvent<SVGElement>, node: number | null) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { ...point(e), node });
  }
  function move(e: PointerEvent<SVGElement>) {
    const old = pointers.current.get(e.pointerId);
    if (!old) return;
    const now = point(e);
    const others = [...pointers.current.entries()].filter(
      ([id]) => id !== e.pointerId,
    );
    if (others.length) {
      const other = others[0][1];
      const before = Math.hypot(old.x - other.x, old.y - other.y);
      const after = Math.hypot(now.x - other.x, now.y - other.y);
      if (before > 1)
        setView((v) => ({
          ...v,
          z: Math.max(0.5, Math.min(3, (v.z * after) / before)),
        }));
    } else if (old.node !== null) {
      setPositions((ps) =>
        ps.map((p, i) =>
          i === old.node
            ? [
                Math.max(20, Math.min(440, p[0] + (now.x - old.x) / view.z)),
                Math.max(20, Math.min(310, p[1] + (now.y - old.y) / view.z)),
              ]
            : p,
        ),
      );
    } else
      setView((v) => ({
        ...v,
        x: Math.max(-460, Math.min(460, v.x + now.x - old.x)),
        y: Math.max(-330, Math.min(330, v.y + now.y - old.y)),
      }));
    pointers.current.set(e.pointerId, { ...now, node: old.node });
  }
  function end(e: PointerEvent<SVGElement>) {
    pointers.current.delete(e.pointerId);
  }
  function reset() {
    setPlaying(false);
    setSelected(0);
    setPositions(documents.map((d) => [...d.position]));
    setView({ x: 0, y: 0, z: 1 });
    pointers.current.clear();
  }
  return (
    <section className="lab-panel" aria-label="Explorador de embeddings">
      <h2>Recuperar por similaridade</h2>
      <p>
        Vetores editoriais determinísticos de quatro dimensões (código, dados,
        linguagem, operação), criados manualmente como exemplo. Não são
        embeddings de um modelo. Similaridade = (q · d) / (‖q‖ ‖d‖); ranking usa
        os vetores originais, sem banco ou API.
      </p>
      <label>
        Consulta de exemplo
        <select
          aria-label="Consulta de exemplo"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(0);
            setPlaying(false);
          }}
        >
          {documents.map((d) => (
            <option key={d.id} value={d.id}>
              {d.title}
            </option>
          ))}
        </select>
      </label>
      <p>
        Vetor q = [{documents.find((d) => d.id === query)!.vector.join(', ')}]
      </p>
      <Controls
        playing={playing && selected < documents.length - 1}
        onPlay={() => setPlaying((v) => !v)}
        onStep={() => {
          setPlaying(false);
          tick();
        }}
        onReset={reset}
        disabled={selected === documents.length - 1}
      />
      <p data-testid="retrieval" role="status">
        Recuperação {selected + 1} / {documents.length}: {active.title} (
        {active.score.toFixed(4)})
      </p>
      <div className="lab-controls">
        <button
          aria-label="Aumentar zoom"
          onClick={() => setView((v) => ({ ...v, z: Math.min(3, v.z + 0.2) }))}
        >
          Zoom +
        </button>
        <button
          aria-label="Diminuir zoom"
          onClick={() =>
            setView((v) => ({ ...v, z: Math.max(0.5, v.z - 0.2) }))
          }
        >
          Zoom −
        </button>
        <button onClick={() => setView({ x: 0, y: 0, z: 1 })}>
          Centralizar
        </button>
      </div>
      <p id="embedding-help">
        Projeção 2D ilustrativa manual: distância visual não representa
        necessariamente a distância nos vetores. Arrastar muda só a posição
        projetada; o ranking permanece calculado em 4D. Arraste o fundo para
        pan, use dois dedos para zoom. No gráfico focado: setas movem a câmera,
        +/− zoom, 0 centraliza. Nos pontos focados: setas movem o ponto.
      </p>
      <svg
        ref={svg}
        className="lab-embedding"
        viewBox="0 0 460 330"
        tabIndex={0}
        role="group"
        aria-label="Projeção de vetores navegável"
        aria-describedby="embedding-help"
        onPointerDown={(e) => down(e, null)}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onLostPointerCapture={end}
        onKeyDown={(e) => {
          if (
            [
              'ArrowLeft',
              'ArrowRight',
              'ArrowUp',
              'ArrowDown',
              '+',
              '-',
              '0',
            ].includes(e.key)
          ) {
            e.preventDefault();
            setView((v) =>
              e.key === '0'
                ? { x: 0, y: 0, z: 1 }
                : {
                    x: Math.max(
                      -460,
                      Math.min(
                        460,
                        v.x +
                          (e.key === 'ArrowLeft'
                            ? 20
                            : e.key === 'ArrowRight'
                              ? -20
                              : 0),
                      ),
                    ),
                    y: Math.max(
                      -330,
                      Math.min(
                        330,
                        v.y +
                          (e.key === 'ArrowUp'
                            ? 20
                            : e.key === 'ArrowDown'
                              ? -20
                              : 0),
                      ),
                    ),
                    z: Math.max(
                      0.5,
                      Math.min(
                        3,
                        v.z + (e.key === '+' ? 0.2 : e.key === '-' ? -0.2 : 0),
                      ),
                    ),
                  },
            );
          }
        }}
      >
        <g transform={`translate(${view.x} ${view.y}) scale(${view.z})`}>
          {documents.map((d, i) => (
            <g
              key={d.id}
              transform={`translate(${positions[i][0]} ${positions[i][1]})`}
              role="button"
              tabIndex={0}
              aria-label={`Mover ${d.title}`}
              aria-pressed={active.id === d.id}
              onPointerDown={(e) => down(e, i)}
              onKeyDown={(e) => {
                if (e.key.startsWith('Arrow')) {
                  e.stopPropagation();
                  e.preventDefault();
                  setPositions((ps) =>
                    ps.map((p, j) =>
                      i === j
                        ? [
                            Math.max(
                              20,
                              Math.min(
                                440,
                                p[0] +
                                  (e.key === 'ArrowLeft'
                                    ? -10
                                    : e.key === 'ArrowRight'
                                      ? 10
                                      : 0),
                              ),
                            ),
                            Math.max(
                              20,
                              Math.min(
                                310,
                                p[1] +
                                  (e.key === 'ArrowUp'
                                    ? -10
                                    : e.key === 'ArrowDown'
                                      ? 10
                                      : 0),
                              ),
                            ),
                          ]
                        : p,
                    ),
                  );
                }
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelected(ranking.findIndex((r) => r.id === d.id));
                }
              }}
              onClick={() =>
                setSelected(ranking.findIndex((r) => r.id === d.id))
              }
            >
              <circle r={active.id === d.id ? 19 : 13} />
              <text y="-25" textAnchor="middle">
                {d.title}
              </text>
            </g>
          ))}
        </g>
      </svg>
      <ol data-testid="ranking">
        {ranking.map((d) => (
          <li key={d.id} aria-current={active.id === d.id ? 'step' : undefined}>
            <button
              onClick={() =>
                setSelected(ranking.findIndex((r) => r.id === d.id))
              }
            >
              {d.title}: {d.score.toFixed(4)}
            </button>{' '}
            · [{d.vector.join(', ')}]
          </li>
        ))}
      </ol>
      <p>
        Vetor zero recebe similaridade 0 por convenção explícita. Consulta usa
        os próprios exemplos: recuperar a si mesmo primeiro é esperado e não
        mede qualidade de busca em produção.
      </p>
    </section>
  );
}
