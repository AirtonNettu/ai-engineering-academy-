import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';
import App from '../App';
it('biblioteca mantém níveis de títulos sem pular de h1 para h3', async () => {
  render(
    <MemoryRouter initialEntries={['/biblioteca']}>
      <App />
    </MemoryRouter>,
  );
  await screen.findByRole('heading', {
    level: 1,
    name: 'Conhecimento que se conecta.',
  });
  const levels = screen
    .getAllByRole('heading')
    .map((h) => Number(h.tagName.slice(1)));
  for (let i = 1; i < levels.length; i++)
    expect(levels[i]).toBeLessThanOrEqual(levels[i - 1] + 1);
});

it('nome acessível do componente opcional inclui o rótulo visível', async () => {
  render(
    <MemoryRouter initialEntries={['/arquiteturas']}>
      <App />
    </MemoryRouter>,
  );
  const node = await screen.findByRole('button', {
    name: 'Selecionar Autorização opcional no mapa',
  });
  expect(node.textContent).toMatch(/Autorização\s+OPCIONAL/);
  expect(node).toHaveTextContent('Autorização');
});
