import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  FileCode2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Monitor,
  Server,
  Database,
  Search,
  Cpu,
  ShieldCheck,
  Activity,
  Network,
  Layers,
  Wrench,
} from 'lucide-react';
import { catalog } from '../lib/content';
import { SourcePreview } from './SourcePreview';
import './atlas.css';
type Node = {
  id: string;
  title: string;
  description: string;
  file: string | null;
  optional?: boolean;
};
type View = { x: number; y: number; scale: number };
const neuralSource = 'src/labs/neural.ts';
const attentionSource = 'src/labs/attention.ts';
const embeddingsSource = 'src/labs/embeddings.ts';
const policySource = 'src/lib/agent-cycle.ts';
const baseView = { x: 0, y: 0, scale: 1 };
function relatedCode(id: string, node: Node): string {
  if (node.file) return `examples/fastapi-ollama/${node.file}`;
  if (id === 'agents' || node.id === 'auth') return policySource;
  if (id === 'training') return neuralSource;
  if (id === 'rag' && node.id === 'question')
    return 'examples/fastapi-ollama/app/models.py';
  if (id === 'rag' && node.id === 'evaluate')
    return 'examples/fastapi-ollama/tests/test_chat.py';
  if (id === 'rag')
    return /retrieve|context|rerank|vector-store/.test(node.id)
      ? embeddingsSource
      : 'examples/fastapi-ollama/app/integrations/ollama.py';
  return /vector|embedding/.test(node.id)
    ? embeddingsSource
    : /train|neural/.test(node.id)
      ? neuralSource
      : attentionSource;
}
function iconFor(node: Node) {
  const name = node.id + ' ' + node.title.toLowerCase();
  return /auth|autoriz/.test(name)
    ? ShieldCheck
    : /observ|eval|monitor/.test(name)
      ? Activity
      : /retriev|recuper/.test(name)
        ? Search
        : /vector|embedding|banco/.test(name)
          ? Database
          : /context/.test(name)
            ? Layers
            : /model|llm|transform|generate|geração/.test(name)
              ? Cpu
              : /tool|ferrament/.test(name)
                ? Wrench
                : /request|cliente|text|pergunta/.test(name)
                  ? Monitor
                  : /adapter|api|server/.test(name)
                    ? Server
                    : /tokens|rerank/.test(name)
                      ? Layers
                      : Network;
}
export function Diagram({ id = 'rag' }: { id?: string }) {
  const diagram =
    catalog.diagrams.find((d) => d.id === id) || catalog.diagrams[0];
  const extras: Node[] =
    diagram.id === 'rag'
      ? [
          {
            id: 'auth',
            title: 'Autorização',
            description:
              'Opcional em uma base pública; obrigatória quando documentos têm restrições. Filtre permissões antes da recuperação. O exemplo de política local não implementa um sistema de identidade.',
            file: null,
            optional: true,
          },
          {
            id: 'reranker',
            title: 'Reranker',
            description:
              'Etapa opcional entre recuperação e contexto: reordena candidatos. O arquivo relacionado contém cosseno/ranking didático, não um modelo de reranking treinado.',
            file: null,
            optional: true,
          },
          {
            id: 'vector-store',
            title: 'Banco vetorial',
            description:
              'Opcional: armazena vetores e metadados em arquiteturas de busca vetorial. A recuperação também pode usar índice lexical. O código relacionado demonstra ranking local, não implementa um banco vetorial.',
            file: null,
            optional: true,
          },
          {
            id: 'observability',
            title: 'Observabilidade',
            description:
              'Telemetria transversal, sem entrar na sequência de geração. Métricas não exigem registrar prompts pessoais. O teste relacionado verifica contrato HTTP, não qualidade semântica.',
            file: 'tests/test_chat.py',
            optional: true,
          },
        ]
      : [];
  const nodes: Node[] = [...diagram.nodes, ...extras];
  const [selection, setSelection] = useState({
    step: 0,
    id: diagram.nodes[0].id,
  });
  const [playing, setPlaying] = useState(false);
  const [view, setView] = useState<View>(baseView);
  const [source, setSource] = useState(false);
  const svg = useRef<SVGSVGElement>(null);
  const gesture = useRef<{
    points: Map<number, { x: number; y: number }>;
    start: View;
    center: { x: number; y: number };
    distance: number;
  }>({
    points: new Map(),
    start: baseView,
    center: { x: 0, y: 0 },
    distance: 1,
  });
  const node = nodes.find((n) => n.id === selection.id) || nodes[0];
  const file = relatedCode(diagram.id, node);
  const article =
    diagram.id === 'agents'
      ? 'mcp-agentes'
      : diagram.id === 'http'
        ? 'ollama-fastapi'
        : diagram.id === 'llm'
          ? 'llm-inferencia'
          : diagram.id === 'training'
            ? 'redes-neurais'
            : 'rag';
  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(
      () =>
        setSelection((s) => {
          const step = (s.step + 1) % diagram.nodes.length;
          return { step, id: diagram.nodes[step].id };
        }),
      2400,
    );
    return () => clearInterval(t);
  }, [playing, diagram]);
  function local(clientX: number, clientY: number) {
    const el = svg.current;
    if (!el) return { x: clientX, y: clientY };
    const matrix = el.getScreenCTM();
    if (!matrix) return { x: clientX, y: clientY };
    const p = el.createSVGPoint();
    p.x = clientX;
    p.y = clientY;
    return p.matrixTransform(matrix.inverse());
  }
  function zoom(factor: number) {
    setView((v) => {
      const scale = Math.min(2.5, Math.max(0.6, v.scale * factor));
      return {
        x: 450 - ((450 - v.x) * scale) / v.scale,
        y: 180 - ((180 - v.y) * scale) / v.scale,
        scale,
      };
    });
  }
  function begin(e: ReactPointerEvent<SVGSVGElement>) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = local(e.clientX, e.clientY);
    const g = gesture.current;
    g.points.set(e.pointerId, p);
    g.start = view;
    const values = [...g.points.values()];
    g.center =
      values.length === 1
        ? p
        : {
            x: (values[0].x + values[1].x) / 2,
            y: (values[0].y + values[1].y) / 2,
          };
    g.distance =
      values.length > 1
        ? Math.hypot(values[0].x - values[1].x, values[0].y - values[1].y)
        : 1;
  }
  function move(e: ReactPointerEvent<SVGSVGElement>) {
    const g = gesture.current;
    if (!g.points.has(e.pointerId)) return;
    g.points.set(e.pointerId, local(e.clientX, e.clientY));
    const points = [...g.points.values()];
    if (points.length === 1)
      setView({
        ...g.start,
        x: g.start.x + points[0].x - g.center.x,
        y: g.start.y + points[0].y - g.center.y,
      });
    else {
      const scale = Math.min(
        2.5,
        Math.max(
          0.6,
          (g.start.scale *
            Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)) /
            Math.max(1, g.distance),
        ),
      );
      const center = {
        x: (points[0].x + points[1].x) / 2,
        y: (points[0].y + points[1].y) / 2,
      };
      setView({
        scale,
        x: center.x - ((g.center.x - g.start.x) * scale) / g.start.scale,
        y: center.y - ((g.center.y - g.start.y) * scale) / g.start.scale,
      });
    }
  }
  function end(e: ReactPointerEvent<SVGSVGElement>) {
    gesture.current.points.delete(e.pointerId);
    gesture.current.start = view;
    const first = [...gesture.current.points.values()][0];
    if (first) gesture.current.center = first;
  }
  function choose(n: Node) {
    const step = diagram.nodes.findIndex((b) => b.id === n.id);
    setSelection((s) => ({ id: n.id, step: step >= 0 ? step : s.step }));
    setPlaying(false);
    setSource(false);
  }
  const positions = nodes.map((_, i) =>
    i < diagram.nodes.length
      ? { x: 35 + i * 166, y: 45 }
      : { x: 35 + (i - diagram.nodes.length) * 205, y: 220 },
  );
  function next(step: number) {
    setSelection({ step, id: diagram.nodes[step].id });
    setPlaying(false);
    setSource(false);
  }
  return (
    <section className="diagram atlas" aria-label={diagram.title}>
      <div className="diagram-heading">
        <div>
          <span className="eyebrow">ATLAS DE ARQUITETURAS</span>
          <h2>{diagram.title}</h2>
        </div>
        <span className="tag">
          Arquitetura didática · sem chamadas externas
        </span>
      </div>
      <p className="muted">{diagram.description}</p>
      <div className="atlas-tools">
        <div>
          <button
            className="icon-button"
            aria-label="Reduzir diagrama"
            onClick={() => zoom(0.8)}
          >
            <ZoomOut size={18} />
          </button>
          <output aria-label="Escala do diagrama">
            {Math.round(view.scale * 100)}%
          </output>
          <button
            className="icon-button"
            aria-label="Ampliar diagrama"
            onClick={() => zoom(1.25)}
          >
            <ZoomIn size={18} />
          </button>
          <button
            className="icon-button"
            aria-label="Restaurar enquadramento"
            onClick={() => setView(baseView)}
          >
            <Maximize size={18} />
          </button>
        </div>
        <span>
          Arraste o fundo para mover. Dois dedos ampliam. Teclado: setas, +, − e
          Home.
        </span>
      </div>
      <svg
        ref={svg}
        viewBox="0 0 900 360"
        className="atlas-map"
        role="group"
        aria-label="Mapa de arquitetura com zoom e deslocamento"
        tabIndex={0}
        onPointerDown={begin}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          const pans: Record<string, [number, number]> = {
            ArrowLeft: [25, 0],
            ArrowRight: [-25, 0],
            ArrowUp: [0, 25],
            ArrowDown: [0, -25],
          };
          if (pans[e.key]) {
            e.preventDefault();
            const [x, y] = pans[e.key];
            setView((v) => ({ ...v, x: v.x + x, y: v.y + y }));
          } else if (['+', '=', '-', 'Home'].includes(e.key)) {
            e.preventDefault();
            if (e.key === 'Home') setView(baseView);
            else zoom(e.key === '-' ? 0.8 : 1.25);
          }
        }}
      >
        <defs>
          <marker
            id={`arrow-${diagram.id}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>
        <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
          {diagram.nodes.slice(0, -1).map((n, i) => (
            <path
              key={n.id}
              className="atlas-edge"
              d={`M ${positions[i].x + 140} 90 H ${positions[i + 1].x - 5}`}
              markerEnd={`url(#arrow-${diagram.id})`}
            />
          ))}
          {extras.flatMap((n, i) => {
            const pos = positions[diagram.nodes.length + i];
            const from =
              n.id === 'auth'
                ? 0
                : n.id === 'reranker'
                  ? 1
                  : n.id === 'vector-store'
                    ? 1
                    : 3;
            const p = positions[from];
            const d =
              n.id === 'vector-store'
                ? `M ${pos.x + 70} ${pos.y} L ${p.x + 70} 128`
                : `M ${p.x + 70} 128 L ${pos.x + 70} ${pos.y}`;
            const paths = [
              <path
                key={n.id}
                className="atlas-edge optional-edge"
                d={d}
                markerEnd={`url(#arrow-${diagram.id})`}
              />,
            ];
            if (n.id === 'auth' || n.id === 'reranker') {
              const to = positions[n.id === 'auth' ? 1 : 2];
              paths.push(
                <path
                  key={n.id + '-return'}
                  className="atlas-edge optional-edge"
                  d={`M ${pos.x + 140} ${pos.y + 40} L ${to.x + 100} 128`}
                  markerEnd={`url(#arrow-${diagram.id})`}
                />,
              );
            }
            return paths;
          })}
          {nodes.map((n, i) => {
            const Icon = iconFor(n);
            const p = positions[i];
            const active = node.id === n.id;
            const parts = n.title.split(' ');
            return (
              <g
                key={n.id}
                className={`atlas-node ${active ? 'active' : ''} ${n.optional ? 'optional-node' : ''}`}
                transform={`translate(${p.x} ${p.y})`}
                role="button"
                tabIndex={0}
                aria-label={`Selecionar ${n.title} no mapa`}
                aria-pressed={active}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => choose(n)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    choose(n);
                  }
                }}
              >
                <rect width="140" height="83" rx="10" />
                <Icon x={12} y={13} width={22} height={22} />
                <text x="12" y="54">
                  {parts.slice(0, 2).join(' ')}
                </text>
                {parts.length > 2 && (
                  <text x="12" y="70">
                    {parts.slice(2).join(' ')}
                  </text>
                )}
                {n.optional && (
                  <text x="46" y="29" className="atlas-optional-label">
                    OPCIONAL
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      <p className="atlas-legend">
        <span>→ Fluxo principal simplificado</span>
        {extras.length > 0 && (
          <span>
            ⇢ Componentes opcionais/transversais; não são etapas finais da
            geração.
          </span>
        )}
      </p>
      <div
        className="atlas-node-list"
        role="group"
        aria-label="Componentes da arquitetura"
      >
        {nodes.map((n, i) => (
          <button
            key={n.id}
            aria-label={
              n.optional ? `Opcional: ${n.title}` : `${i + 1} ${n.title}`
            }
            aria-pressed={n.id === node.id}
            onClick={() => choose(n)}
          >
            {n.optional ? '◇' : i + 1} {n.title}
          </button>
        ))}
      </div>
      <div className="diagram-detail">
        <div>
          <span className="eyebrow">
            {node.optional
              ? 'COMPONENTE OPCIONAL'
              : `ETAPA ${selection.step + 1} DE ${diagram.nodes.length}`}
          </span>
          <h3>{node.title}</h3>
          <p>{node.description}</p>
          <div className="atlas-links">
            <Link className="text-link" to={`/capitulos/${article}`}>
              Ler artigo relacionado →
            </Link>
            {node.file && (
              <Link
                className="text-link"
                to={`/projetos/fastapi-ollama?file=${encodeURIComponent(node.file)}`}
              >
                <FileCode2 size={16} /> Explorar {node.file}
              </Link>
            )}
            <button
              className="text-button"
              aria-expanded={source}
              onClick={() => setSource((v) => !v)}
            >
              Ler código relacionado: {file}
            </button>
          </div>
        </div>
        <div className="flow-controls">
          <button
            className="icon-button"
            aria-label="Etapa anterior"
            disabled={selection.step === 0}
            onClick={() => next(selection.step - 1)}
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
            disabled={selection.step === diagram.nodes.length - 1}
            onClick={() => next(selection.step + 1)}
          >
            <ArrowRight size={18} />
          </button>
          <button
            className="icon-button"
            aria-label="Reiniciar etapas"
            onClick={() => next(0)}
          >
            <RotateCcw size={17} />
          </button>
        </div>
      </div>
      {source && (
        <div className="atlas-source">
          <p className="small muted">
            Código relacionado real, não implementação completa de toda a
            arquitetura. Os exemplos de atenção/vetores e política são
            didáticos; não executam um LLM nem um servidor MCP.
          </p>
          <SourcePreview file={file} />
        </div>
      )}
    </section>
  );
}
