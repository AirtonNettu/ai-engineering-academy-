import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { catalog } from '../src/lib/content';

for (const width of [320, 390, 768, 1280]) {
  test(`consolidação responsiva ${width}px com movimento reduzido`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const route of [
      '/biblioteca',
      '/arquiteturas',
      '/laboratorios/neural-network',
      '/laboratorios/attention',
      '/laboratorios/embeddings',
      '/capitulos/rag',
      '/meus-dados',
    ]) {
      await page.goto(route);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
    }
    await page.goto('/laboratorios/neural-network');
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const controls = page.locator('.lab-controls');
    const step = controls.getByRole('button', { name: 'Um passo' });
    await step.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('epoch')).toHaveText('1');
    await page.keyboard.press('Tab');
    await expect(
      controls.getByRole('button', { name: 'Reiniciar' }),
    ).toBeFocused();
    await page.keyboard.press('Space');
    await expect(page.getByTestId('epoch')).toHaveText('0');
    const accessibility = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(accessibility.violations).toEqual([]);
  });
}

test('quinze capítulos podem ser lidos sem JavaScript e a aplicação retoma a rota', async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const reading = await context.newPage();
    for (const chapter of catalog.chapters) {
      const response = await reading.goto(
        `http://127.0.0.1:4173/capitulos/${chapter.id}`,
      );
      expect(response?.ok()).toBe(true);
      await expect(
        reading.getByRole('heading', {
          level: 1,
          name: chapter.title,
          exact: true,
        }),
      ).toBeVisible();
      await expect(
        reading.locator(`[data-static-chapter="${chapter.id}"] article`),
      ).toContainText('Fundamentação');
      await expect(reading.locator('#referencias a').first()).toHaveAttribute(
        'href',
        chapter.sources[0].url,
      );
      await expect(
        reading.locator('meta[property="og:title"]'),
      ).toHaveAttribute('content', `${chapter.title} — IA Engineer Academy`);
    }
  } finally {
    await context.close();
  }
  await page.goto('/capitulos/rag#referencias');
  await expect(
    page.getByRole('button', { name: 'Marcar como lido' }),
  ).toBeVisible();
  await expect(page.locator('[data-static-chapter]')).toHaveCount(0);
  await expect(page.locator('#referencias')).toBeVisible();
});

test('carregamento de rota reserva espaço sem deslocar um rodapé visível', async ({
  page,
}) => {
  let release!: () => void;
  const hold = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/Library-*.js', async (route) => {
    await hold;
    await route.continue();
  });
  try {
    await page.goto('/biblioteca', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('status')).toHaveText('Carregando conteúdo…');
    const footer = await page.locator('footer.footer').boundingBox();
    expect(footer!.y).toBeGreaterThanOrEqual(page.viewportSize()!.height);
  } finally {
    release();
  }
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Conhecimento que se conecta.',
    }),
  ).toBeVisible();
});

test('rótulos visíveis dos nós opcionais integram o nome acessível', async ({
  page,
}) => {
  await page.goto('/arquiteturas');
  await expect(
    page.getByRole('heading', { name: 'Pipeline de RAG', exact: true }),
  ).toBeVisible();
  const result = await new AxeBuilder({ page })
    .withRules(['label-content-name-mismatch'])
    .analyze();
  expect(result.violations).toEqual([]);
});
