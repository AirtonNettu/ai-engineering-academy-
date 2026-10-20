import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { catalog } from '../src/lib/content';

test('jornada pública: busca, leitura e progresso persistido', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /Entenda os fundamentos/ }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Buscar conhecimento...' }).click();
  await page
    .getByRole('searchbox', { name: 'Buscar em toda a Academy' })
    .fill('inferencia');
  await page
    .getByRole('heading', { name: 'Por dentro de uma resposta de um LLM' })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Um modelo estima distribuições' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Marcar como lido' }).click();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Lido — desmarcar' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Aumentar fonte' }).click();
  await expect(page.locator('.prose')).toHaveCSS('font-size', '19px');
  await page.getByRole('button', { name: 'Ativar modo escuro' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('explorador, diagrama e trilhas têm ações reais', async ({ page }) => {
  await page.goto('/projetos/fastapi-ollama');
  await page.getByRole('button', { name: 'ollama.py', exact: true }).click();
  await expect(page.locator('.explorer-main .source-code')).toContainText(
    'class OllamaService',
  );
  await expect(
    page.locator('.explorer-main .source-code span[style]'),
  ).not.toHaveCount(0);
  await page.goto('/arquiteturas?diagrama=http');
  await page.getByRole('button', { name: '3 Adaptador', exact: true }).click();
  await page
    .getByRole('link', { name: 'Explorar app/integrations/ollama.py' })
    .click();
  await expect(page.locator('.explorer-main .source-code')).toContainText(
    'class OllamaService',
  );
  await page.goto('/trilhas');
  await page.getByRole('button', { name: /MLOps \/ LLMOps Engineer/ }).click();
  await page.getByRole('button', { name: /Pipelines e serving/ }).click();
  await expect(page.locator('.competency')).toContainText(
    'Ainda não há capítulo dedicado',
  );
});

test('cópia de código e filtros de catálogo funcionam', async ({
  page,
  context,
  browserName,
}) => {
  if (browserName === 'chromium')
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/projetos/fastapi-ollama?file=app/models.py');
  await expect(page.locator('.explorer-main .source-code')).toContainText(
    'class ChatRequest',
  );
  await page
    .getByRole('button', { name: 'Copiar código de app/models.py' })
    .click();
  await expect(page.locator('.explorer-main').getByRole('status')).toHaveText(
    'Copiado',
  );
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    'class ChatRequest',
  );
  await page.goto('/recursos');
  await page.getByLabel('Especialidade').selectOption('QA');
  await expect(page.locator('.resource-card')).toHaveCount(2);
  await expect(
    page.getByRole('heading', { name: 'Playwright', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: 'webapp-testing — Anthropic',
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Docker', exact: true }),
  ).not.toBeVisible();
});

test('rotas publicadas, links internos e layout sem overflow', async ({
  page,
}) => {
  const routes = [
    '/',
    '/biblioteca',
    '/trilhas',
    '/arquiteturas',
    '/projetos/fastapi-ollama',
    '/recursos',
    '/glossario',
    '/busca',
    ...catalog.chapters.map((c) => `/capitulos/${c.id}`),
  ];
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    if (route.startsWith('/capitulos/'))
      await expect(page.locator('article h2').first()).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      route,
    ).toBe(true);
    const links = await page
      .locator('a[href^="/"]')
      .evaluateAll((els) =>
        els.map((el) => new URL((el as HTMLAnchorElement).href).pathname),
      );
    for (const link of links)
      expect(routes, `link em ${route}: ${link}`).toContain(link);
  }
  expect(errors).toEqual([]);
});

test('acessibilidade automatizada em páginas representativas e temas', async ({
  page,
}) => {
  for (const path of [
    '/',
    '/capitulos/http-apis',
    '/arquiteturas',
    '/projetos/fastapi-ollama',
    '/trilhas',
    '/recursos',
    '/glossario',
    '/busca?q=RAG',
  ]) {
    await page.goto(path);
    if (path.startsWith('/capitulos'))
      await expect(page.locator('article h2').first()).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      results.violations,
      `${path}: ${JSON.stringify(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
    ).toEqual([]);
  }
  await page.getByRole('button', { name: 'Ativar modo escuro' }).click();
  const dark = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(dark.violations).toEqual([]);
});

test('teclado, menu móvel e preferências corrompidas', async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    localStorage.setItem('academy:progress', 'null');
    localStorage.setItem('academy:fontSize', '"quebrado"');
  });
  await page.goto('/biblioteca');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Pular para o conteúdo' }),
  ).toBeFocused();
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page
      .getByRole('link', { name: 'Trilhas profissionais', exact: true })
      .click();
    await expect(
      page.getByRole('heading', {
        name: 'Escolha a direção. Construa o caminho.',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Abrir menu' }),
    ).toHaveAttribute('aria-expanded', 'false');
  }
  await page.goto('/capitulos/http-apis');
  await expect(page.locator('.prose')).toHaveCSS('font-size', '18px');
});

test('links de referência chegam à seção após o carregamento', async ({
  page,
}) => {
  await page.goto('/busca?q=Attention');
  await page
    .getByRole('heading', { name: 'Attention Is All You Need' })
    .click();
  await expect(page.locator('#referencias')).toBeInViewport();
});

test('links profundos aguardam o conteúdo em uma conexão lenta', async ({
  page,
}) => {
  await page.route('**/assets/*.js', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 120));
    await route.continue();
  });
  for (const [path, anchor] of [
    ['/glossario#token', '#token'],
    ['/recursos#pytorch', '#pytorch'],
    ['/capitulos/rag#montagem-de-contexto', '#montagem-de-contexto'],
  ]) {
    await page.goto(path);
    await expect(page.locator(anchor)).toBeInViewport();
  }
});
