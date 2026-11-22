import { describe, it, expect } from 'vitest';
import papers from '../../content/research/papers.json' with { type: 'json' };
import modelsDatasets from '../../content/research/models-datasets.json' with { type: 'json' };
import { catalog } from '../lib/content';

describe('Centro de Pesquisa Científica (v2)', () => {
  it('contém pelo menos 25 artigos seminais e contemporâneos curados', () => {
    expect(papers.length).toBeGreaterThanOrEqual(25);
  });

  it('todos os artigos possuem atributos essenciais e URLs HTTPS abertas', () => {
    const validStatuses = new Set([
      'peer-reviewed',
      'preprint',
      'technical-report',
    ]);
    const validFields = new Set([
      'transformers-attention',
      'rag-retrieval',
      'efficient-inference',
      'reasoning-alignment',
      'mixture-of-experts',
      'agents-tool-use',
    ]);

    for (const paper of papers) {
      expect(paper.id).toMatch(/^[a-z0-9-]+$/);
      expect(paper.title.length).toBeGreaterThan(3);
      expect(paper.originalTitle.length).toBeGreaterThan(3);
      expect(paper.authors.length).toBeGreaterThan(0);
      expect(validStatuses.has(paper.status)).toBe(true);
      expect(validFields.has(paper.field)).toBe(true);
      expect(paper.canonicalUrl.startsWith('https://')).toBe(true);
      expect(paper.openAccessPdfUrl.startsWith('https://')).toBe(true);
      expect(paper.keyFindings.length).toBeGreaterThan(0);
      expect(paper.abstractPtBr.length).toBeGreaterThan(20);
    }
  });

  it('conexões pedagógicas dos artigos apontam para capítulos e diagramas reais', () => {
    const knownChapters = new Set(catalog.chapters.map((c) => c.id));
    const knownDiagrams = new Set(catalog.diagrams.map((d) => d.id));

    for (const paper of papers) {
      if (paper.connections.chapterId) {
        expect(
          knownChapters.has(paper.connections.chapterId),
          `Capítulo desconhecido: ${paper.connections.chapterId}`,
        ).toBe(true);
      }
      if (paper.connections.diagramId) {
        expect(
          knownDiagrams.has(paper.connections.diagramId),
          `Diagrama desconhecido: ${paper.connections.diagramId}`,
        ).toBe(true);
      }
    }
  });

  it('catálogo de modelos possui licenças abertas declaradas e metadados válidos', () => {
    expect(modelsDatasets.models.length).toBeGreaterThanOrEqual(15);
    for (const model of modelsDatasets.models) {
      expect(model.id).toMatch(/^[a-z0-9-]+$/);
      expect(model.name.length).toBeGreaterThan(1);
      expect(model.organization.length).toBeGreaterThan(1);
      expect(model.parameterCount.length).toBeGreaterThan(0);
      expect(model.contextWindow).toBeGreaterThan(128);
      expect(model.license.length).toBeGreaterThan(1);
    }
  });

  it('catálogo de datasets possui volumes e links abertos verificáveis', () => {
    expect(modelsDatasets.datasets.length).toBeGreaterThanOrEqual(10);
    for (const dataset of modelsDatasets.datasets) {
      expect(dataset.id).toMatch(/^[a-z0-9-]+$/);
      expect(dataset.name.length).toBeGreaterThan(1);
      expect(dataset.url.startsWith('https://')).toBe(true);
      expect(dataset.tokenCountOrSize.length).toBeGreaterThan(1);
    }
  });
});
