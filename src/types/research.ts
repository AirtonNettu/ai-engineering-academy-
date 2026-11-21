/**
 * src/types/research.ts
 * Contratos de dados formais para o Centro de Pesquisa Científica da IA Engineer Academy 2.0
 */

export type PeerReviewStatus =
  'peer-reviewed' | 'preprint' | 'technical-report';

export type ScientificField =
  | 'transformers-attention'
  | 'rag-retrieval'
  | 'efficient-inference'
  | 'reasoning-alignment'
  | 'mixture-of-experts'
  | 'agents-tool-use';

export interface Author {
  readonly name: string;
  readonly institution?: string;
  readonly orcid?: string;
}

export interface ResearchPaper {
  readonly id: string;
  readonly title: string;
  readonly originalTitle: string;
  readonly authors: readonly Author[];
  readonly publicationDate: string; // YYYY-MM
  readonly venue: string;
  readonly status: PeerReviewStatus;
  readonly doi?: string;
  readonly arxivId?: string;
  readonly canonicalUrl: string;
  readonly openAccessPdfUrl: string;
  readonly field: ScientificField;
  readonly abstractPtBr: string;
  readonly keyFindings: readonly string[];
  readonly connections: {
    readonly chapterId?: string;
    readonly diagramId?: string;
    readonly labId?: 'neural-network' | 'attention' | 'embeddings';
    readonly relatedProject?: string;
  };
}

export interface ModelMetadata {
  readonly id: string;
  readonly name: string;
  readonly organization: string;
  readonly releaseDate: string;
  readonly license: string;
  readonly architecture: string;
  readonly parameterCount: string;
  readonly contextWindow: number;
  readonly primaryPaperId?: string;
  readonly huggingFaceUrl?: string;
  readonly openWeights: boolean;
}

export interface DatasetMetadata {
  readonly id: string;
  readonly name: string;
  readonly createdBy: string;
  readonly modality: 'text' | 'code' | 'multimodal' | 'evaluation';
  readonly tokenCountOrSize: string;
  readonly license: string;
  readonly primaryPaperId?: string;
  readonly url: string;
}

export interface ResearchCatalog {
  readonly papers: readonly ResearchPaper[];
  readonly models: readonly ModelMetadata[];
  readonly datasets: readonly DatasetMetadata[];
}
