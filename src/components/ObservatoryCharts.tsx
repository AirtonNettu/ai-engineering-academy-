import { useState } from 'react';
import type { BenchmarkScore, InferenceMetric } from '../types/observatory';

interface BenchmarkChartItem {
  readonly modelId?: string;
  readonly modelName: string;
  readonly category: 'open-weights' | 'proprietary-api';
  readonly benchmarks: readonly BenchmarkScore[];
}

interface BenchmarkChartProps {
  models: readonly BenchmarkChartItem[];
  benchmark: BenchmarkScore['benchmarkName'];
}

export function BenchmarkBarChart({ models, benchmark }: BenchmarkChartProps) {
  const filtered = models
    .map((m) => {
      const b = m.benchmarks.find((item) => item.benchmarkName === benchmark);
      return {
        name: m.modelName,
        category: m.category,
        score: b ? b.score : 0,
        source: b?.sourceUrl || '',
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const maxVal = Math.max(...filtered.map((item) => item.score), 100);

  return (
    <div
      className="observatory-chart"
      role="region"
      aria-label={`Gráfico comparativo de ${benchmark}`}
    >
      <div className="chart-header">
        <h3>{benchmark}</h3>
        <span className="eyebrow green">Métricas Verificáveis</span>
      </div>

      {/* Tabela acessível para leitores de tela */}
      <table className="sr-only">
        <caption>{`Resultados verificáveis para ${benchmark}`}</caption>
        <thead>
          <tr>
            <th scope="col">Modelo</th>
            <th scope="col">Categoria</th>
            <th scope="col">Pontuação</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item.name}>
              <td>{item.name}</td>
              <td>
                {item.category === 'open-weights'
                  ? 'Pesos Abertos'
                  : 'API Proprietária'}
              </td>
              <td>{item.score}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Renderização SVG nativa sem bibliotecas externas */}
      <div className="svg-container" aria-hidden="true">
        <svg
          viewBox={`0 0 600 ${filtered.length * 40 + 20}`}
          className="chart-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {filtered.map((item, idx) => {
            const barWidth = Math.max(10, (item.score / maxVal) * 360);
            const y = idx * 40 + 10;
            const isApi = item.category === 'proprietary-api';
            return (
              <g key={item.name} className="chart-bar-group">
                <text
                  x="140"
                  y={y + 18}
                  textAnchor="end"
                  className="bar-label"
                  fontSize="12"
                  fill="currentColor"
                >
                  {item.name.length > 18
                    ? `${item.name.slice(0, 16)}…`
                    : item.name}
                </text>
                <rect
                  x="150"
                  y={y + 4}
                  width={barWidth}
                  height="20"
                  rx="4"
                  fill={
                    isApi ? 'var(--blue-500, #3b82f6)' : 'var(--green, #10b981)'
                  }
                  opacity="0.85"
                />
                <text
                  x={160 + barWidth}
                  y={y + 19}
                  fontSize="12"
                  fontWeight="600"
                  fill="currentColor"
                >
                  {item.score}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="chart-legend" aria-hidden="true">
        <span className="legend-item">
          <span
            className="legend-color"
            style={{ backgroundColor: 'var(--green, #10b981)' }}
          />
          Pesos Abertos (Open Weights)
        </span>
        <span className="legend-item">
          <span
            className="legend-color"
            style={{ backgroundColor: 'var(--blue-500, #3b82f6)' }}
          />
          API Proprietária
        </span>
      </div>
    </div>
  );
}

interface SystemsChartProps {
  systemsData: readonly {
    modelId: string;
    modelName: string;
    benchmarks: readonly InferenceMetric[];
  }[];
}

export function SystemsInferenceChart({ systemsData }: SystemsChartProps) {
  const [metricType, setMetricType] = useState<
    'decodeTokensPerSec' | 'vramUsageGb' | 'ttftMs'
  >('decodeTokensPerSec');

  const metricTitles = {
    decodeTokensPerSec:
      'Throughput de Geração (tokens/segundo) — Maior é melhor',
    vramUsageGb: 'Consumo de VRAM (GB) — Menor é melhor',
    ttftMs: 'Time to First Token / TTFT (ms) — Menor é melhor',
  };

  const allItems = systemsData.flatMap((m) =>
    m.benchmarks.map((b) => ({
      model: m.modelName,
      engine: b.engine,
      hardware: b.hardware,
      quant: b.quantization,
      value: b[metricType],
      notes: b.sourceNotes,
    })),
  );

  const maxVal = Math.max(...allItems.map((item) => item.value), 10);

  return (
    <div
      className="observatory-chart"
      role="region"
      aria-label="Gráfico de Métricas de Inferência e Engenharia"
    >
      <div className="chart-header">
        <h3>{metricTitles[metricType]}</h3>
        <div
          className="filter-pills"
          role="group"
          aria-label="Seletor de métrica de sistema"
        >
          <button
            type="button"
            aria-pressed={metricType === 'decodeTokensPerSec'}
            onClick={() => setMetricType('decodeTokensPerSec')}
          >
            Throughput (tokens/s)
          </button>
          <button
            type="button"
            aria-pressed={metricType === 'vramUsageGb'}
            onClick={() => setMetricType('vramUsageGb')}
          >
            VRAM (GB)
          </button>
          <button
            type="button"
            aria-pressed={metricType === 'ttftMs'}
            onClick={() => setMetricType('ttftMs')}
          >
            TTFT (ms)
          </button>
        </div>
      </div>

      {/* Tabela de acessibilidade */}
      <table className="sr-only">
        <caption>{metricTitles[metricType]}</caption>
        <thead>
          <tr>
            <th scope="col">Modelo</th>
            <th scope="col">Engine & Quantização</th>
            <th scope="col">Hardware</th>
            <th scope="col">Valor</th>
          </tr>
        </thead>
        <tbody>
          {allItems.map((item) => (
            <tr key={`${item.model}-${item.engine}-${item.quant}`}>
              <td>{item.model}</td>
              <td>{`${item.engine} (${item.quant})`}</td>
              <td>{item.hardware}</td>
              <td>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="svg-container" aria-hidden="true">
        <svg
          viewBox={`0 0 600 ${allItems.length * 36 + 20}`}
          className="chart-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {allItems.map((item, idx) => {
            const barWidth = Math.max(8, (item.value / maxVal) * 340);
            const y = idx * 36 + 10;
            const label = `${item.model.split(' ')[0]} ${item.quant}`;
            return (
              <g
                key={`${item.model}-${item.engine}-${item.quant}`}
                className="chart-bar-group"
              >
                <text
                  x="150"
                  y={y + 16}
                  textAnchor="end"
                  className="bar-label"
                  fontSize="11"
                  fill="currentColor"
                >
                  {label}
                </text>
                <rect
                  x="160"
                  y={y + 3}
                  width={barWidth}
                  height="18"
                  rx="3"
                  fill="var(--accent, #6366f1)"
                  opacity="0.85"
                />
                <text
                  x={170 + barWidth}
                  y={y + 17}
                  fontSize="11"
                  fontWeight="600"
                  fill="currentColor"
                >
                  {`${item.value} ${metricType === 'vramUsageGb' ? 'GB' : metricType === 'ttftMs' ? 'ms' : 't/s'}`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p
        className="notice"
        style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}
      >
        <strong>Condições de teste:</strong> Contexto de 4096 tokens, Batch Size
        1, vLLM / Ollama em hardware de referência documentado. Métricas
        reproduzíveis sem alegações sintéticas.
      </p>
    </div>
  );
}
