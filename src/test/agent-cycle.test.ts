import { it, expect } from 'vitest';
import { executeReadTool } from '../lib/agent-cycle';
it('autoriza ferramenta fora do modelo e não executa ações desconhecidas', () => {
  expect(
    executeReadTool({ name: 'lookup', arguments: { term: 'rag' } }, new Set(), {
      rag: 'Recuperação e geração',
    }),
  ).toEqual({ ok: false, reason: 'Ação não autorizada' });
  expect(
    executeReadTool(
      { name: 'lookup', arguments: { term: 'rag' } },
      new Set(['lookup']),
      { rag: 'Recuperação e geração' },
    ),
  ).toEqual({ ok: true, value: 'Recuperação e geração' });
  expect(
    executeReadTool(
      { name: 'delete', arguments: { term: 'rag' } },
      new Set(['lookup']),
      {},
    ).ok,
  ).toBe(false);
});
