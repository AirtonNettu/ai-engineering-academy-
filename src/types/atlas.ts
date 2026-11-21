/**
 * src/types/atlas.ts
 * Contratos para as arquiteturas estendidas do Atlas interativo
 */

export interface AtlasNode {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly file: string | null;
  readonly optional?: boolean;
}

export interface AtlasArchitecture {
  readonly id: string;
  readonly title: string;
  readonly category:
    'model-architecture' | 'serving-optimization' | 'system-pipeline';
  readonly description: string;
  readonly relatedChapter: string;
  readonly nodes: readonly AtlasNode[];
  readonly technicalNotes: readonly string[];
}
