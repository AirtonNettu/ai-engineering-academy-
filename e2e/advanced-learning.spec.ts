import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { flashcards } from '../src/learning/content';

test('percurso retoma etapas e agenda respostas editoriais', async ({
  page,
}) => {
  await page.goto('/capitulos/rag');
  await page.getByRole('link', { name: 'Estudar este assunto' }).click();
  await page.getByRole('button', { name: 'Concluir etapa e avançar' }).click();
  await expect(
    page.getByRole('button', { name: '2 Leitura intermediária' }),
  ).toHaveAttribute('aria-current', 'step');
  await page.reload();
  await expect(
    page.getByRole('button', { name: '2 Leitura intermediária' }),
  ).toHaveAttribute('aria-current', 'step');
  await page.getByRole('button', { name: '6 Flashcards' }).click();
  await page.getByRole('button', { name: 'Mostrar resposta' }).click();
  await page.getByRole('button', { name: 'Errei', exact: true }).click();
  await expect(page.getByText('1 revisões respondidas')).toBeVisible();
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('academy:learning')!),
  );
  expect(stored.study.rag.completed).toContain(0);
  expect(Object.values(stored.cards)).toHaveLength(1);
  const result = Object.values(stored.cards)[0] as {
    incorrect: number;
    dueAt: number;
    lastReviewedAt: number;
  };
  expect(result.incorrect).toBe(1);
  expect(result.dueAt - result.lastReviewedAt).toBe(600000);
});

test('backup exporta, importa após confirmação e rejeita JSON inválido', async ({
  page,
}) => {
  await page.goto('/flashcards?capitulo=rag');
  await page.getByRole('button', { name: 'Mostrar resposta' }).click();
  await page.getByRole('button', { name: 'Acertei', exact: true }).click();
  await page.goto('/meus-dados');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar backup JSON' }).click();
  const file = await download;
  const path = await file.path();
  expect(path).toBeTruthy();
  const backup = readFileSync(path!, 'utf8');
  await page
    .getByRole('checkbox', { name: 'Entendo que o progresso será apagado' })
    .check();
  await page.getByRole('button', { name: 'Limpar dados de estudo' }).click();
  expect(
    await page.evaluate(
      () =>
        Object.keys(JSON.parse(localStorage.getItem('academy:learning')!).cards)
          .length,
    ),
  ).toBe(0);
  await page.getByLabel('Selecionar backup JSON').setInputFiles({
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(backup),
  });
  expect(
    await page.evaluate(
      () =>
        Object.keys(JSON.parse(localStorage.getItem('academy:learning')!).cards)
          .length,
    ),
  ).toBe(0);
  await page
    .getByRole('button', { name: 'Confirmar substituição dos dados' })
    .click();
  expect(
    await page.evaluate(
      () =>
        Object.keys(JSON.parse(localStorage.getItem('academy:learning')!).cards)
          .length,
    ),
  ).toBe(1);
  await page.getByLabel('Selecionar backup JSON').setInputFiles({
    name: 'bad.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"version":999}'),
  });
  await expect(page.getByRole('status')).toContainText('Backup inválido');
  expect(
    await page.evaluate(
      () =>
        Object.keys(JSON.parse(localStorage.getItem('academy:learning')!).cards)
          .length,
    ),
  ).toBe(1);
  expect(
    flashcards.filter((c) => c.chapterId === 'rag').length,
  ).toBeGreaterThanOrEqual(3);
});

test('laboratórios calculam, respondem a controles e mantêm fontes reais', async ({
  page,
}) => {
  await page.goto('/laboratorios/neural-network');
  await expect(page.getByTestId('epoch')).toHaveText('0');
  await page.getByRole('button', { name: 'Um passo' }).click();
  await expect(page.getByTestId('epoch')).toHaveText('1');
  await page.getByRole('button', { name: 'Reproduzir', exact: true }).click();
  await expect(page.getByTestId('epoch')).not.toHaveText('1');
  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  const paused = await page.getByTestId('epoch').textContent();
  await page.waitForTimeout(250);
  await expect(page.getByTestId('epoch')).toHaveText(paused!);
  await page.getByRole('button', { name: 'Reiniciar', exact: true }).click();
  await expect(page.getByTestId('epoch')).toHaveText('0');
  await page.goto('/laboratorios/attention?codigo=1');
  await page.getByLabel('Texto de exemplo').fill('a b');
  await page.getByLabel('Máscara causal').check();
  await expect(
    page.getByRole('button', { name: 'a consulta b: 0.000' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'a consulta b: 0.000' }).click();
  await expect(page.locator('.lab-panel')).toContainText('mascarado');
  await expect(page.locator('.source-code').first()).toContainText(
    'function softmax',
  );
  await page.goto('/laboratorios/embeddings');
  const ranking = await page.getByTestId('ranking').textContent();
  const node = page.getByRole('button', { name: 'Mover Busca RAG' });
  await node.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByTestId('ranking')).toHaveText(ranking!);
  await page.getByRole('button', { name: 'Aumentar zoom' }).click();
  await page.getByRole('button', { name: 'Reiniciar', exact: true }).click();
  await expect(page.getByTestId('retrieval')).toContainText('1 / 5');
});

test('Atlas oferece pan, zoom, artigos e código relacionado', async ({
  page,
}) => {
  await page.goto('/arquiteturas?diagrama=rag');
  await page.getByRole('button', { name: 'Ampliar diagrama' }).click();
  await expect(page.getByLabel('Escala do diagrama')).toHaveText('125%');
  const map = page.getByRole('group', {
    name: 'Mapa de arquitetura com zoom e deslocamento',
  });
  const before = await map.locator('g').first().getAttribute('transform');
  await map.focus();
  await page.keyboard.press('ArrowRight');
  await expect(map.locator('g').first()).not.toHaveAttribute(
    'transform',
    before!,
  );
  await page.getByRole('button', { name: 'Opcional: Reranker' }).click();
  await page.getByRole('button', { name: /Ler código relacionado/ }).click();
  await expect(page.locator('.atlas-source .source-code')).toContainText(
    'function cosine',
  );
  await page.getByRole('button', { name: 'Restaurar enquadramento' }).click();
  await expect(page.getByLabel('Escala do diagrama')).toHaveText('100%');
  await page.goto('/arquiteturas?diagrama=agents');
  await expect(page.locator('.atlas-node-list button')).toHaveCount(5);
  await page.locator('.atlas-links a[href^="/capitulos/"]').click();
  await expect(page).toHaveURL(/\/capitulos\/mcp-agentes/);
});

test('páginas avançadas são acessíveis e sem overflow em ambos os temas', async ({
  page,
}) => {
  test.setTimeout(90000);
  for (const route of [
    '/laboratorios/neural-network',
    '/laboratorios/attention',
    '/laboratorios/embeddings',
    '/estudar/rag',
    '/flashcards?capitulo=rag',
    '/meus-dados',
    '/trilhas',
    '/arquiteturas?diagrama=agents',
  ]) {
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    if (route === '/laboratorios/attention') {
      await page.getByLabel('Máscara causal').check();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      route,
    ).toBe(true);
    for (const dark of [false, true]) {
      if (dark) {
        await page.getByRole('button', { name: 'Ativar modo escuro' }).click();
        await page.evaluate(async () => {
          void getComputedStyle(document.body).color;
          await Promise.all(
            document
              .getAnimations()
              .map((animation) => animation.finished.catch(() => {})),
          );
        });
      }
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
        `${route} dark=${dark}`,
      ).toEqual([]);
      if (dark)
        await page.getByRole('button', { name: 'Ativar modo claro' }).click();
    }
  }
});
