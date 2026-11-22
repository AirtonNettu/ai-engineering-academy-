import { describe, it, expect } from 'vitest';
import {
  paperSchema,
  modelSchema,
  datasetSchema,
  benchmarkScoreSchema,
  systemMetricSchema,
  httpsUrl,
} from '../../scripts/validate-v2-data';
import papersData from '../../content/research/papers.json' with { type: 'json' };
import modelsDatasetsData from '../../content/research/models-datasets.json' with { type: 'json' };
import benchmarksData from '../../content/observatory/benchmarks.json' with { type: 'json' };
import systemsData from '../../content/observatory/systems.json' with { type: 'json' };
import catalog from '../../content/catalog.json' with { type: 'json' };

describe('DATA-03 — Validação Contínua e Integridade de Dados v2', () => {
  describe('Testes Positivos nos Snapshots Ativos', () => {
    it('todos os 26 papers cumprem estritamente o schema Zod e possuem URLs HTTPS', () => {
      expect(papersData.length).toBe(26);
      for (const paper of papersData) {
        expect(() => paperSchema.parse(paper)).not.toThrow();
        expect(paper.canonicalUrl.startsWith('https://')).toBe(true);
        expect(paper.openAccessPdfUrl.startsWith('https://')).toBe(true);
      }
    });

    it('todos os modelos e datasets cumprem estritamente o schema', () => {
      expect(modelsDatasetsData.models.length).toBe(16);
      expect(modelsDatasetsData.datasets.length).toBe(10);
      for (const m of modelsDatasetsData.models) {
        expect(() => modelSchema.parse(m)).not.toThrow();
      }
      for (const d of modelsDatasetsData.datasets) {
        expect(() => datasetSchema.parse(d)).not.toThrow();
        expect(d.url.startsWith('https://')).toBe(true);
      }
    });

    it('todas as métricas do observatório possuem notas de protocolo e proveniência comprovada', () => {
      for (const m of benchmarksData.models) {
        for (const b of m.benchmarks) {
          expect(() => benchmarkScoreSchema.parse(b)).not.toThrow();
          expect(b.evaluationProtocolNotes.length).toBeGreaterThanOrEqual(5);
          expect(b.sourceUrl.startsWith('https://')).toBe(true);
        }
      }
    });

    it('todas as métricas de serving possuem hardware, metodologia descritiva e valores positivos', () => {
      for (const s of systemsData) {
        for (const b of s.benchmarks) {
          expect(() => systemMetricSchema.parse(b)).not.toThrow();
          expect(b.methodology.length).toBeGreaterThanOrEqual(15);
          expect(b.sourceUrl.startsWith('https://')).toBe(true);
          expect(b.vramUsageGb).toBeGreaterThan(0);
          expect(b.decodeTokensPerSec).toBeGreaterThan(0);
          expect(b.ttftMs).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Testes Negativos (Rejeição de Dados Inválidos e Inconsistentes)', () => {
    it('rejeita URLs sem protocolo HTTPS seguro', () => {
      expect(() => httpsUrl.parse('http://inseguro.com/artigo.pdf')).toThrow();
      expect(() => httpsUrl.parse('javascript:alert(1)')).toThrow();
      expect(() => httpsUrl.parse('ftp://files.org/data.zip')).toThrow();
    });

    it('rejeita artigo científico com identificador mal formatado ou resumo insuficiente', () => {
      const invalidPaper = {
        ...papersData[0],
        id: 'Artigo Inválido com Espaço e Maiúscula',
      };
      expect(() => paperSchema.parse(invalidPaper)).toThrow();

      const shortAbstractPaper = {
        ...papersData[0],
        abstractPtBr: 'Curto',
      };
      expect(() => paperSchema.parse(shortAbstractPaper)).toThrow();
    });

    it('rejeita métrica de benchmark com pontuação negativa ou método de avaliação desconhecido', () => {
      const negativeScore = {
        benchmarkName: 'MMLU-Pro',
        score: -10,
        evaluationMethod: 'few-shot',
        evaluationProtocolNotes: 'Protocolo de teste',
        sourceUrl: 'https://exemplo.com',
        recordedDate: '2025-01',
      };
      expect(() => benchmarkScoreSchema.parse(negativeScore)).toThrow();

      const invalidMethod = {
        benchmarkName: 'GSM8K',
        score: 85,
        evaluationMethod: 'metodo-inventado',
        evaluationProtocolNotes: 'Protocolo de teste',
        sourceUrl: 'https://exemplo.com',
        recordedDate: '2025-01',
      };
      expect(() => benchmarkScoreSchema.parse(invalidMethod)).toThrow();
    });

    it('rejeita métrica de inferência com VRAM negativa, TTFT zerado ou metodologia vazia', () => {
      const invalidVram = {
        engine: 'vLLM',
        hardware: '1x RTX 4090',
        quantization: 'FP16',
        ttftMs: 20,
        decodeTokensPerSec: 100,
        vramUsageGb: -5,
        contextLengthTested: 4096,
        inputPromptTokens: 512,
        outputTokens: 128,
        concurrency: 1,
        testDate: '2025-01-01',
        sourceUrl: 'https://docs.vllm.ai',
        methodology: 'Metodologia válida com mais de 15 caracteres',
        sourceNotes: 'Notas',
      };
      expect(() => systemMetricSchema.parse(invalidVram)).toThrow();

      const emptyMethodology = {
        ...invalidVram,
        vramUsageGb: 16,
        methodology: 'Curto',
      };
      expect(() => systemMetricSchema.parse(emptyMethodology)).toThrow();
    });

    it('rejeita conexões para capítulos editoriais inexistentes na plataforma', () => {
      const validChapterIds = new Set(catalog.chapters.map((c) => c.id));
      for (const paper of papersData) {
        if (paper.connections.chapterId) {
          expect(
            validChapterIds.has(paper.connections.chapterId),
            `Paper ${paper.id} aponta para capítulo inexistente: ${paper.connections.chapterId}`,
          ).toBe(true);
        }
      }
    });
  });
});
