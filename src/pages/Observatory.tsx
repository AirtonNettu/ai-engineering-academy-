import { useState } from 'react';
import { PageIntro } from '../components/Cards';
import {
  BenchmarkBarChart,
  SystemsInferenceChart,
} from '../components/ObservatoryCharts';
import benchmarksData from '../../content/observatory/benchmarks.json' with { type: 'json' };
import systemsData from '../../content/observatory/systems.json' with { type: 'json' };
import type { BenchmarkScore, InferenceMetric } from '../types/observatory';

export default function Observatory() {
  const [selectedBenchmark, setSelectedBenchmark] =
    useState<BenchmarkScore['benchmarkName']>('Chatbot-Arena-ELO');
  const [categoryFilter, setCategoryFilter] = useState<
    'all' | 'open-weights' | 'proprietary-api'
  >('all');

  const filteredModels = benchmarksData.models.filter((m) =>
    categoryFilter === 'all' ? true : m.category === categoryFilter,
  );

  return (
    <div className="observatory-page">
      <PageIntro
        eyebrow="OBSERVATÓRIO DE INTELIGÊNCIA ARTIFICIAL"
        title="Métricas Verificáveis, Sem Alegações Fictícias"
        description="Acompanhe o desempenho de modelos abertos e APIs de fronteira através de benchmarks consolidados e medições reais de engenharia de serving. Proveniência e metodologia 100% transparentes."
      />

      <section
        className="observatory-section"
        aria-labelledby="capacidade-title"
      >
        <div className="section-head">
          <h2 id="capacidade-title">
            1. Capacidade e Raciocínio (Benchmarks Canônicos)
          </h2>
          <p>
            Avaliações quantitativas em raciocínio, lógica matemática e
            preferência humana.
          </p>
        </div>

        <div
          className="filter-tabs"
          role="group"
          aria-label="Filtrar benchmark"
        >
          {(
            ['Chatbot-Arena-ELO', 'MMLU-Pro', 'GSM8K', 'HumanEval'] as const
          ).map((bench) => (
            <button
              key={bench}
              type="button"
              aria-pressed={selectedBenchmark === bench}
              onClick={() => setSelectedBenchmark(bench)}
            >
              {bench}
            </button>
          ))}
        </div>

        <div
          className="filter-pills"
          role="group"
          aria-label="Filtrar por tipo de modelo"
        >
          <button
            type="button"
            aria-pressed={categoryFilter === 'all'}
            onClick={() => setCategoryFilter('all')}
          >
            Todos os Modelos
          </button>
          <button
            type="button"
            aria-pressed={categoryFilter === 'open-weights'}
            onClick={() => setCategoryFilter('open-weights')}
          >
            Pesos Abertos
          </button>
          <button
            type="button"
            aria-pressed={categoryFilter === 'proprietary-api'}
            onClick={() => setCategoryFilter('proprietary-api')}
          >
            APIs Proprietárias
          </button>
        </div>

        <BenchmarkBarChart
          models={
            filteredModels as readonly {
              modelId: string;
              modelName: string;
              category: 'open-weights' | 'proprietary-api';
              benchmarks: readonly BenchmarkScore[];
            }[]
          }
          benchmark={selectedBenchmark}
        />

        <div
          className="notice"
          style={{
            marginTop: '1.25rem',
            padding: '1rem',
            borderLeft: '4px solid var(--accent, #6366f1)',
            backgroundColor: 'var(--card-bg, rgba(255, 255, 255, 0.03))',
            borderRadius: '4px',
          }}
        >
          <strong style={{ display: 'block', marginBottom: '0.25rem' }}>
            Aviso Metodológico de Comparabilidade (DATA-02):
          </strong>
          <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.5' }}>
            Modelos de raciocínio (<em>Reasoning Models</em>, ex: DeepSeek-R1)
            geram cadeias de pensamento extensas (<em>Long CoT</em>) antes de
            emitir a resposta final, alocando mais computação durante a
            inferência (<em>test-time compute</em>). Já modelos de instrução
            direta (<em>Standard Instruct</em>, ex: Llama 3.1, GPT-4o) respondem
            de forma concisa. Comparações diretas de acurácia entre essas
            categorias devem levar em conta o consumo de tokens, latência de
            resposta e o protocolo de avaliação utilizado (CoT com verificação
            formal vs 0-shot pass@1).
          </p>
        </div>
      </section>

      <section
        className="observatory-section"
        aria-labelledby="sistemas-title"
        style={{ marginTop: '3rem' }}
      >
        <div className="section-head">
          <h2 id="sistemas-title">2. Métricas de Engenharia e Inferência</h2>
          <p>
            Throughput real (tokens/s), latência de primeiro token (TTFT) e
            consumo de VRAM medidos em vLLM e Ollama sob quantizações FP16,
            AWQ-4bit e GGUF-Q4_K_M.
          </p>
        </div>

        <SystemsInferenceChart
          systemsData={
            systemsData as readonly {
              modelId: string;
              modelName: string;
              benchmarks: readonly InferenceMetric[];
            }[]
          }
        />
      </section>

      <section
        className="observatory-section"
        aria-labelledby="fontes-title"
        style={{ marginTop: '3rem' }}
      >
        <div className="section-head">
          <h2 id="fontes-title">3. Proveniência e Fontes Primárias</h2>
          <p>
            Nenhuma métrica foi inventada ou simulada. Todas as informações
            derivam diretamente dos seguintes repositórios e projetos abertos:
          </p>
        </div>

        <div className="cards-grid">
          {benchmarksData.primarySources.map((src) => (
            <div key={src.name} className="card">
              <span className="eyebrow green">Fonte Primária</span>
              <h3>{src.name}</h3>
              <p>{src.description}</p>
              <a
                href={src.url}
                target="_blank"
                rel="noreferrer noopener"
                className="button secondary"
                style={{ marginTop: 'auto' }}
              >
                Acessar Dados Oficiais
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
