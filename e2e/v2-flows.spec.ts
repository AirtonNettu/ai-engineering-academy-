import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('IA Engineer Academy 2.0 — Fluxos E2E e Acessibilidade', () => {
  test('Centro de Pesquisa: filtros, busca e acessibilidade', async ({
    page,
  }) => {
    await page.goto('/pesquisa');
    await expect(
      page.getByRole('heading', { name: /Fundamentos de Fronteira/ }),
    ).toBeVisible();

    // Busca textual instantânea por artigo
    const searchInput = page.getByRole('searchbox', {
      name: 'Buscar no acervo do Centro de Pesquisa',
    });
    await searchInput.fill('attention');

    await expect(
      page.getByRole('heading', { name: 'Atenção É Tudo o Que Você Precisa' }),
    ).toBeVisible();

    // Limpar busca e alternar para aba de Modelos Abertos
    await searchInput.fill('');
    await page.getByRole('button', { name: /Modelos Abertos/ }).click();
    await expect(
      page.getByRole('heading', { name: 'Llama 3 8B Instruct' }),
    ).toBeVisible();

    // Alternar para aba de Datasets
    await page.getByRole('button', { name: /Datasets & Benchmarks/ }).click();
    await expect(
      page.getByRole('heading', { name: 'FineWeb-Edu' }),
    ).toBeVisible();

    // Auditoria de Acessibilidade (Axe)
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('Observatório de IA: benchmarks, serving e acessibilidade', async ({
    page,
  }) => {
    await page.goto('/observatorio');
    await expect(
      page.getByRole('heading', { name: /Métricas Verificáveis/ }),
    ).toBeVisible();

    // Selecionar benchmark HumanEval
    await page.getByRole('button', { name: 'HumanEval', exact: true }).click();
    await expect(
      page.getByRole('region', { name: 'Gráfico comparativo de HumanEval' }),
    ).toBeVisible();

    // Alternar métrica de sistemas de serving para VRAM
    const vramButton = page
      .getByRole('group', { name: 'Seletor de métrica de sistema' })
      .getByRole('button', { name: 'VRAM (GB)' });
    await vramButton.click({ force: true });
    await expect(
      page.getByRole('region', {
        name: 'Gráfico de Métricas de Inferência e Engenharia',
      }),
    ).toBeVisible();

    // Auditoria de Acessibilidade (Axe)
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('Atlas 2.0: novas arquiteturas interativas (MoE e Speculative Decoding)', async ({
    page,
  }) => {
    // Navegar para nova arquitetura MoE
    await page.goto('/arquiteturas?diagrama=moe');
    await expect(
      page.getByRole('button', { name: 'Mixture of Experts (MoE)' }),
    ).toHaveAttribute('aria-pressed', 'true');

    // Inspecionar nó de Roteador
    await page
      .getByRole('button', { name: '2 Roteador (Gating)', exact: true })
      .click();
    await expect(page.locator('.diagram-detail')).toContainText(
      'Camada linear calcula logits de afinidade',
    );

    // Navegar para nova arquitetura Speculative Decoding
    await page.goto('/arquiteturas?diagrama=speculative');
    await expect(
      page.getByRole('button', { name: 'Speculative Decoding' }),
    ).toHaveAttribute('aria-pressed', 'true');

    // Inspecionar nó de validação em lote
    await page
      .getByRole('button', { name: '3 Validação em lote', exact: true })
      .click();
    await expect(page.locator('.diagram-detail')).toContainText(
      'Modelo alvo avalia todos os K candidatos',
    );
  });
});
