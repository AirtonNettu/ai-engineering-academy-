import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';

const root = process.cwd();

export const httpsUrl = z
  .string()
  .refine((v) => v.startsWith('https://'), 'URL deve ser HTTPS');

export const authorSchema = z.object({
  name: z.string().min(1),
  institution: z.string().optional(),
  orcid: z.string().optional(),
});

export const paperSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  originalTitle: z.string().min(1),
  authors: z.array(authorSchema).min(1),
  publicationDate: z.string().regex(/^\d{4}-\d{2}$/),
  venue: z.string().min(1),
  status: z.enum(['peer-reviewed', 'preprint', 'technical-report']),
  doi: z.string().optional(),
  arxivId: z.string().optional(),
  canonicalUrl: httpsUrl,
  openAccessPdfUrl: httpsUrl,
  field: z.enum([
    'transformers-attention',
    'rag-retrieval',
    'efficient-inference',
    'reasoning-alignment',
    'mixture-of-experts',
    'agents-tool-use',
  ]),
  abstractPtBr: z.string().min(30),
  keyFindings: z.array(z.string().min(5)).min(1),
  connections: z.object({
    chapterId: z.string().optional(),
    diagramId: z.string().optional(),
    labId: z.enum(['neural-network', 'attention', 'embeddings']).optional(),
    relatedProject: z.string().optional(),
  }),
});

export const modelSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  organization: z.string().min(1),
  releaseDate: z.string().regex(/^\d{4}-\d{2}$/),
  license: z.string().min(1),
  architecture: z.string().min(1),
  parameterCount: z.string().min(1),
  contextWindow: z.number().int().positive(),
  primaryPaperId: z.string().optional(),
  huggingFaceUrl: httpsUrl.optional(),
  openWeights: z.boolean(),
});

export const datasetSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  createdBy: z.string().min(1),
  modality: z.enum(['text', 'code', 'multimodal', 'evaluation']),
  tokenCountOrSize: z.string().min(1),
  license: z.string().min(1),
  primaryPaperId: z.string().optional(),
  url: httpsUrl,
});

export const benchmarkScoreSchema = z.object({
  benchmarkName: z.enum([
    'MMLU-Pro',
    'GSM8K',
    'HumanEval',
    'MATH',
    'Chatbot-Arena-ELO',
  ]),
  score: z.number().positive(),
  maxScore: z.number().optional(),
  evaluationMethod: z.enum([
    'few-shot',
    'zero-shot',
    'cot',
    'elo-crowdsourced',
  ]),
  evaluationProtocolNotes: z.string().min(5),
  sourceUrl: httpsUrl,
  recordedDate: z.string().regex(/^\d{4}-\d{2}$/),
});

export const modelObservatoryEntrySchema = z.object({
  modelId: z.string().min(1),
  modelName: z.string().min(1),
  category: z.enum(['open-weights', 'proprietary-api']),
  parameterCount: z.string().min(1),
  benchmarks: z.array(benchmarkScoreSchema).min(1),
});

export const observatorySchema = z.object({
  recordedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  primarySources: z.array(
    z.object({
      name: z.string().min(1),
      url: httpsUrl,
      description: z.string().min(1),
    }),
  ),
  models: z.array(modelObservatoryEntrySchema).min(1),
});

export const systemMetricSchema = z.object({
  engine: z.enum(['vLLM', 'Ollama', 'TGI', 'SGLang']),
  hardware: z.string().min(1),
  quantization: z.enum(['FP16', 'BF16', 'AWQ-4bit', 'GGUF-Q4_K_M']),
  ttftMs: z.number().positive(),
  decodeTokensPerSec: z.number().positive(),
  vramUsageGb: z.number().positive(),
  contextLengthTested: z.number().positive(),
  inputPromptTokens: z.number().int().positive(),
  outputTokens: z.number().int().positive(),
  concurrency: z.number().int().positive(),
  testDate: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/),
  sourceUrl: httpsUrl,
  methodology: z.string().min(15),
  sourceNotes: z.string().min(1),
});

export const systemsDataSchema = z.array(
  z.object({
    modelId: z.string().min(1),
    modelName: z.string().min(1),
    benchmarks: z.array(systemMetricSchema).min(1),
  }),
);

export function runValidation() {
  console.log('Iniciando validação estática de dados v2...');

  // 1. Papers
  const papersPath = resolve(root, 'content/research/papers.json');
  if (!existsSync(papersPath)) throw new Error('papers.json não encontrado');
  const papersRaw = JSON.parse(readFileSync(papersPath, 'utf-8'));
  const papers = z.array(paperSchema).parse(papersRaw);
  console.log(`✓ ${papers.length} artigos científicos validados com sucesso.`);

  // 2. Models & Datasets
  const modelsPath = resolve(root, 'content/research/models-datasets.json');
  if (!existsSync(modelsPath))
    throw new Error('models-datasets.json não encontrado');
  const modelsDatasetsRaw = JSON.parse(readFileSync(modelsPath, 'utf-8'));
  const models = z.array(modelSchema).parse(modelsDatasetsRaw.models);
  const datasets = z.array(datasetSchema).parse(modelsDatasetsRaw.datasets);
  console.log(`✓ ${models.length} modelos de ML abertos validados.`);
  console.log(`✓ ${datasets.length} datasets de IA validados.`);

  // 3. Observatory Benchmarks
  const benchPath = resolve(root, 'content/observatory/benchmarks.json');
  if (!existsSync(benchPath)) throw new Error('benchmarks.json não encontrado');
  const benchRaw = JSON.parse(readFileSync(benchPath, 'utf-8'));
  const benchData = observatorySchema.parse(benchRaw);
  console.log(
    `✓ ${benchData.models.length} modelos avaliados no Observatório validados.`,
  );

  // 4. Observatory Systems
  const sysPath = resolve(root, 'content/observatory/systems.json');
  if (!existsSync(sysPath)) throw new Error('systems.json não encontrado');
  const sysRaw = JSON.parse(readFileSync(sysPath, 'utf-8'));
  const systems = systemsDataSchema.parse(sysRaw);
  console.log(
    `✓ ${systems.length} conjuntos de métricas de serving validados.`,
  );

  console.log(
    '\n✅ Validação completa de integridade de dados v2 concluída com sucesso!',
  );
}

// Executa automaticamente se invocado como script principal
if (process.argv[1]?.includes('validate-v2-data')) {
  try {
    runValidation();
  } catch (err) {
    console.error('❌ Falha na validação de dados v2:', err);
    process.exit(1);
  }
}
