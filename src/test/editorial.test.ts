import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { validateProposal } from '../lib/editorial';
const valid = () => ({
  version: 1,
  id: 'update-rag',
  baseCommit: 'a'.repeat(40),
  title: 'Revisar capítulo RAG',
  humanReviewRequired: true,
  sources: [
    {
      url: 'https://docs.ollama.com/api/chat',
      title: 'API oficial',
      retrievedAt: '2026-10-20',
    },
  ],
  changes: [
    {
      chapterId: 'rag',
      rationale:
        'Atualização proposta com fonte oficial; revisão de precisão e licenciamento obrigatória.',
      markdown: readFileSync('content/chapters/rag.md', 'utf8'),
    },
  ],
});
describe('contrato de propostas editoriais', () => {
  it('valida proposta sem publicá-la', () =>
    expect(validateProposal(valid()).id).toBe('update-rag'));
  it('rejeita alvos ausentes, base inválida, fonte insegura e publicação automática', () => {
    const missing = valid();
    missing.changes[0].chapterId = 'ausente';
    expect(() => validateProposal(missing)).toThrow();
    const bad = valid();
    bad.baseCommit = 'main';
    expect(() => validateProposal(bad)).toThrow();
    const source = valid();
    source.sources[0].url = 'http://inseguro.example';
    expect(() => validateProposal(source)).toThrow();
    const auto = valid();
    auto.humanReviewRequired = false;
    expect(() => validateProposal(auto)).toThrow();
    expect(() => validateProposal({ ...valid(), token: 'secret' })).toThrow();
  });
  it('rejeita alterações duplicadas e exige revalidação dos links', () => {
    const duplicate = valid();
    duplicate.changes.push(duplicate.changes[0]);
    expect(() => validateProposal(duplicate)).toThrow();
    const broken = valid();
    broken.changes[0].markdown += '\n[link inválido](/capitulos/inexistente)';
    expect(() => validateProposal(broken)).toThrow();
  });
});
