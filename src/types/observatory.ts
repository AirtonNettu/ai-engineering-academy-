/**
 * src/types/observatory.ts
 * Contratos para o Observatório de Métricas Verificáveis da IA Engineer Academy 2.0
 */

export interface BenchmarkScore {
  readonly benchmarkName:
    'MMLU-Pro' | 'GSM8K' | 'HumanEval' | 'MATH' | 'Chatbot-Arena-ELO';
  readonly score: number;
  readonly maxScore?: number;
  readonly evaluationMethod:
    'few-shot' | 'zero-shot' | 'cot' | 'elo-crowdsourced';
  readonly sourceUrl: string;
  readonly recordedDate: string;
}

export interface InferenceMetric {
  readonly engine: 'vLLM' | 'Ollama' | 'TGI' | 'SGLang';
  readonly hardware: string;
  readonly quantization: 'FP16' | 'BF16' | 'AWQ-4bit' | 'GGUF-Q4_K_M';
  readonly ttftMs: number;
  readonly decodeTokensPerSec: number;
  readonly vramUsageGb: number;
  readonly contextLengthTested: number;
  readonly sourceNotes: string;
}

export interface ModelObservatoryEntry {
  readonly modelId: string;
  readonly modelName: string;
  readonly category: 'open-weights' | 'proprietary-api';
  readonly parameterCount: string;
  readonly benchmarks: readonly BenchmarkScore[];
  readonly inferenceMetrics: readonly InferenceMetric[];
}

export interface ObservatoryData {
  readonly models: readonly ModelObservatoryEntry[];
  readonly recordedAt: string;
  readonly primarySources: readonly {
    readonly name: string;
    readonly url: string;
    readonly description: string;
  }[];
}
