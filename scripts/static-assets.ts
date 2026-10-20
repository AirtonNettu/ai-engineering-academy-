import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { catalog } from '../src/lib/content';
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
const origin = process.env.SITE_URL;
if (
  origin &&
  (!origin.startsWith('https://') || new URL(origin).pathname !== '/')
)
  throw Error('SITE_URL deve ser uma origem HTTPS sem caminho');
for (const [path, title, description] of routes) {
  const url = origin ? new URL(path, origin).href : null;
  const head = template
    .replace(
      /<title>.*?<\/title>/,
      `<title>${escape(title)} — IA Engineer Academy</title>`,
    )
    .replace(
      /<meta name="description" content="[^"]*"\s*\/>/,
      `<meta name="description" content="${escape(description)}"/>`,
    )
    .replace(
      '</head>',
      `${url ? `<link rel="canonical" href="${url}"/><meta property="og:url" content="${url}"/>` : ''}</head>`,
    );
  const dir = `dist${path === '/' ? '' : path}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, head);
}
if (origin) {
  writeFileSync(
    'dist/sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(([path]) => `<url><loc>${new URL(path, origin).href}</loc></url>`).join('')}</urlset>`,
  );
  writeFileSync(
    'dist/robots.txt',
    `User-agent: *\nAllow: /\nDisallow: /busca\nSitemap: ${new URL('/sitemap.xml', origin).href}\n`,
  );
} else {
  writeFileSync('dist/robots.txt', 'User-agent: *\nDisallow: /\n');
  console.log(
    'SITE_URL ausente: indexação desabilitada; sitemap depende do domínio aprovado.',
  );
}
console.log(`Metadados estáticos gerados para ${routes.length} rotas.`);
