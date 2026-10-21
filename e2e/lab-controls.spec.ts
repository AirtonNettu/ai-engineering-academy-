import { expect, test } from '@playwright/test';

for (const width of [320, 390, 768, 1280]) {
  test(`controles da rede sem sobreposição em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/laboratorios/neural-network');
    const controls = page.locator('.lab-controls');
    await expect(controls.getByRole('button')).toHaveCount(3);
    const geometry = await controls.evaluate((container) => {
      const buttons = [...container.querySelectorAll('button')];
      return buttons.map((button) => {
        const box = button.getBoundingClientRect();
        const icon = button.querySelector('svg')!.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(button);
        const text = [...range.getClientRects()].at(-1)!;
        return {
          left: box.left,
          right: box.right,
          top: box.top,
          bottom: box.bottom,
          iconWidth: icon.width,
          iconHeight: icon.height,
          inside:
            icon.left >= box.left &&
            icon.right <= box.right &&
            text.left >= icon.right &&
            text.right <= box.right &&
            text.top >= box.top &&
            text.bottom <= box.bottom,
        };
      });
    });
    for (const box of geometry) {
      expect(box.inside).toBe(true);
      expect(box.iconWidth).toBe(16);
      expect(box.iconHeight).toBe(16);
      expect(box.left).toBeGreaterThanOrEqual(0);
      expect(box.right).toBeLessThanOrEqual(width);
      expect(box.bottom - box.top).toBeGreaterThanOrEqual(44);
    }
    for (let i = 0; i < geometry.length; i++) {
      for (let j = i + 1; j < geometry.length; j++) {
        const a = geometry[i],
          b = geometry[j];
        expect(
          a.right <= b.left ||
            b.right <= a.left ||
            a.bottom <= b.top ||
            b.bottom <= a.top,
        ).toBe(true);
      }
    }
    await controls.getByRole('button', { name: 'Um passo' }).click();
    await expect(page.getByTestId('epoch')).toHaveText('1');
    const reset = controls.getByRole('button', { name: 'Reiniciar' });
    await reset.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('epoch')).toHaveText('0');
    const play = controls.getByRole('button', { name: 'Reproduzir' });
    await play.focus();
    await page.keyboard.press('Space');
    await expect(
      controls.getByRole('button', { name: 'Pausar' }),
    ).toBeVisible();
    await expect(page.getByTestId('epoch')).not.toHaveText('0');
    await controls.getByRole('button', { name: 'Pausar' }).click();
    await expect(play).toBeVisible();
    const network = page.getByRole('img', {
      name: 'Pesos e ativações da rede',
    });
    await expect(network).toBeVisible();
    expect(await network.locator('circle').count()).toBe(6);
  });
}
