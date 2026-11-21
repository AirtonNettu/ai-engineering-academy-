import { describe, it, expect } from 'vitest';
import benchmarksData from '../../content/observatory/benchmarks.json' with { type: 'json' };
import systemsData from '../../content/observatory/systems.json' with { type: 'json' };

describe('Observatório de IA (v2)', () => {
  it('registra modelos com benchmarks canônicos verificáveis', () => {
    expect(benchmarksData.models.length).toBeGreaterThanOrEqual(6);
    for (const model of benchmarksData.models) {
      expect(model.modelId.length).toBeGreaterThan(0);
      expect(model.modelName.length).toBeGreaterThan(0);
      expect(model.benchmarks.length).toBeGreaterThan(0);
      for (const b of model.benchmarks) {
        expect(b.score).toBeGreaterThan(0);
        expect(b.sourceUrl.startsWith('https://')).toBe(true);
        expect(b.recordedDate).toMatch(/^\d{4}-\d{2}$/);
      }
    }
  });

  it('declara fontes primárias transparentes com URLs públicas', () => {
    expect(benchmarksData.primarySources.length).toBeGreaterThanOrEqual(3);
    for (const src of benchmarksData.primarySources) {
      expect(src.name.length).toBeGreaterThan(0);
      expect(src.url.startsWith('https://')).toBe(true);
      expect(src.description.length).toBeGreaterThan(10);
    }
  });

  it('registra métricas de serving com hardware e números positivos', () => {
    expect(systemsData.length).toBeGreaterThanOrEqual(4);
    for (const item of systemsData) {
      expect(item.modelName.length).toBeGreaterThan(0);
      expect(item.benchmarks.length).toBeGreaterThan(0);
      for (const b of item.benchmarks) {
        expect(b.ttftMs).toBeGreaterThan(0);
        expect(b.decodeTokensPerSec).toBeGreaterThan(0);
        expect(b.vramUsageGb).toBeGreaterThan(0);
        expect(b.hardware.length).toBeGreaterThan(3);
        expect(b.sourceNotes.length).toBeGreaterThan(5);
      }
    }
  });
});
