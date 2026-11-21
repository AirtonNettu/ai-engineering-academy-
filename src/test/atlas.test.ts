import { describe, it, expect } from 'vitest';
import { catalog } from '../lib/content';

describe('Expansão do Atlas de Arquiteturas (v2)', () => {
  it('contém exatamente 9 arquiteturas interativas cadastradas', () => {
    expect(catalog.diagrams.length).toBe(9);
  });

  it('preserva os 5 diagramas originais com seus nós e identificadores', () => {
    const originalIds = ['rag', 'http', 'llm', 'agents', 'training'];
    const currentIds = new Set(catalog.diagrams.map((d) => d.id));

    for (const id of originalIds) {
      expect(currentIds.has(id), `Diagrama original ausente: ${id}`).toBe(true);
    }
  });

  it('inclui as 4 novas arquiteturas especificadas para a versão 2.0', () => {
    const v2Ids = ['moe', 'speculative', 'agents-react', 'hybrid-rag'];
    const currentIds = new Set(catalog.diagrams.map((d) => d.id));

    for (const id of v2Ids) {
      expect(currentIds.has(id), `Nova arquitetura v2 ausente: ${id}`).toBe(
        true,
      );
    }
  });

  it('cada diagrama possui nós com identificadores únicos e descrições claras', () => {
    for (const diagram of catalog.diagrams) {
      expect(diagram.title.length).toBeGreaterThan(2);
      expect(diagram.description.length).toBeGreaterThan(10);
      expect(diagram.nodes.length).toBeGreaterThanOrEqual(5);

      const nodeIds = diagram.nodes.map((n) => n.id);
      expect(new Set(nodeIds).size).toBe(nodeIds.length);

      for (const node of diagram.nodes) {
        expect(node.title.length).toBeGreaterThan(1);
        expect(node.description.length).toBeGreaterThan(5);
      }
    }
  });
});
