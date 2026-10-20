/** Vetores de exemplo editoriais: dimensões aproximam código, dados, linguagem e operação. */
export const documents = [
  {
    id: 'python',
    title: 'API Python',
    vector: [1, 0.2, 0.1, 0.4],
    position: [90, 80],
  },
  {
    id: 'rag',
    title: 'Busca RAG',
    vector: [0.4, 1, 0.8, 0.2],
    position: [260, 100],
  },
  {
    id: 'texto',
    title: 'Linguagem e tokens',
    vector: [0.1, 0.3, 1, 0.1],
    position: [360, 220],
  },
  {
    id: 'ops',
    title: 'Observabilidade',
    vector: [0.4, 0.2, 0.1, 1],
    position: [140, 250],
  },
  {
    id: 'treino',
    title: 'Treinamento',
    vector: [0.6, 0.9, 0.4, 0.4],
    position: [250, 230],
  },
];
export function cosine(a: number[], b: number[]) {
  if (
    !a.length ||
    a.length !== b.length ||
    ![...a, ...b].every(Number.isFinite)
  )
    throw new Error('Vetores incompatíveis ou não finitos.');
  const na = Math.hypot(...a),
    nb = Math.hypot(...b);
  return na && nb
    ? Math.max(
        -1,
        Math.min(1, a.reduce((s, x, i) => s + x * b[i], 0) / (na * nb)),
      )
    : 0;
}
export function rank(query: number[]) {
  return documents
    .map((d) => ({ ...d, score: cosine(query, d.vector) }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}
