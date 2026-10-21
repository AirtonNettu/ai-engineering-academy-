import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { catalog } from '../src/lib/content';
import { renderStaticChapter } from './render-chapter';
import { siteOrigin } from './site-origin';
const routes: [string, string, string][] = [
  [
    '/',
    'Engenharia de IA, em profundidade',
    'Biblioteca pública e gratuita de Engenharia de IA em português.',
  ],
  [
    '/biblioteca',
    'Biblioteca técnica',
    'Capítulos aprofundados, código e fontes para estudar engenharia de IA.',
  ],
  [
    '/trilhas',
    'Trilhas profissionais',
    'Trilhas para AI Application Engineer, MLOps e desenvolvimento de modelos.',
  ],
  [
    '/arquiteturas',
    'Arquiteturas interativas',
    'Explore pipelines de RAG, LLMs e integração FastAPI com Ollama.',
  ],
  [
    '/projetos/fastapi-ollama',
    'Explorador de código',
    'Estude arquivos reais de uma integração FastAPI com Ollama.',
  ],
  [
    '/recursos',
    'Skills e recursos',
    'Documentação oficial, ferramentas e catálogo de skills.',
  ],
  [
    '/glossario',
    'Glossário técnico',
    'Definições de token, embedding, inferência, contexto, MCP e RAG.',
  ],
  [
    '/laboratorios',
    'Laboratórios interativos',
    'Cálculos didáticos reais de redes neurais, atenção e embeddings no navegador.',
  ],
  [
    '/laboratorios/neural-network',
    'Neural Network Training Lab',
    'Rede pequena, loss e backpropagation reais em TypeScript.',
  ],
  [
    '/laboratorios/attention',
    'Attention Explorer',
    'Q, K, V, softmax e máscara causal com números reais.',
  ],
  [
    '/laboratorios/embeddings',
    'Embedding Explorer',
    'Similaridade cosseno, ranking e projeção de vetores didáticos.',
  ],
  [
    '/flashcards',
    'Flashcards',
    'Revisão espaçada de cartões editoriais e dados locais.',
  ],
  ...catalog.chapters.map(
    (c) =>
      [`/capitulos/${c.id}`, c.title, c.description] as [
        string,
        string,
        string,
      ],
  ),
];
const template = readFileSync('dist/index.html', 'utf8');
const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );
const origin = siteOrigin(process.env.SITE_URL);
const privateRoutes: [string, string, string][] = [
  ['/busca', 'Busca', 'Pesquisa local na biblioteca.'],
  ['/meus-dados', 'Meus dados', 'Dados privados mantidos neste navegador.'],
  ...catalog.chapters.map(
    (c) =>
      [`/estudar/${c.id}`, `Estudar: ${c.title}`, c.description] as [
        string,
        string,
        string,
      ],
  ),
];
for (const [path, title, description] of [...routes, ...privateRoutes]) {
  const indexable =
    !!origin && !privateRoutes.some(([route]) => route === path);
  const url = origin ? new URL(path, origin).href : null;
  let head = template
    .replace(
      /<title>.*?<\/title>/,
      `<title>${escape(title)} — IA Engineer Academy</title>`,
    )
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escape(description)}"/>`,
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${escape(title)} — IA Engineer Academy"/>`,
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${escape(description)}"/>`,
    )
    .replace(
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:image" content="${origin ? new URL('/social-card.png', origin).href : '/social-card.png'}"/>`,
    )
    .replace(
      '</head>',
      `${indexable && url ? `<link rel="canonical" href="${escape(url)}"/><meta property="og:url" content="${escape(url)}"/>` : '<meta name="robots" content="noindex, follow"/>'}</head>`,
    );
  if (path.startsWith('/capitulos/')) {
    const chapter = catalog.chapters.find(
      (c) => `/capitulos/${c.id}` === path,
    )!;
    const body = readFileSync(`content/chapters/${chapter.id}.md`, 'utf8');
    head = head.replace(
      '<div id="root"></div>',
      () => `<div id="root">${renderStaticChapter(chapter, body)}</div>`,
    );
  }
  const file = path === '/' ? 'dist/index.html' : `dist${path}.html`;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, head);
}
if (origin) {
  writeFileSync(
    'dist/sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(([path]) => `<url><loc>${escape(new URL(path, origin).href)}</loc></url>`).join('')}</urlset>`,
  );
  writeFileSync(
    'dist/robots.txt',
    `User-agent: *\nAllow: /\nDisallow: /busca\nDisallow: /meus-dados\nDisallow: /estudar/\nSitemap: ${new URL('/sitemap.xml', origin).href}\n`,
  );
} else {
  writeFileSync('dist/robots.txt', 'User-agent: *\nDisallow: /\n');
  console.log(
    'SITE_URL ausente: indexação desabilitada; sitemap depende do domínio aprovado.',
  );
}
console.log(
  `Metadados para ${routes.length + privateRoutes.length} rotas; ${catalog.chapters.length} capítulos com leitura estática.`,
);

// Mapeamentos exatos precedem o fallback SPA e preservam URLs sem extensão.
const rewrites = [...routes, ...privateRoutes]
  .filter(([path]) => path !== '/')
  .flatMap(([path]) => [`${path} ${path}.html 200`, `${path}/ ${path} 301`]);
writeFileSync(
  'dist/_redirects',
  [...rewrites, readFileSync('public/_redirects', 'utf8').trim(), ''].join(
    '\n',
  ),
);
