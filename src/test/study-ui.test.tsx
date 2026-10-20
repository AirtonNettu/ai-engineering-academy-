import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
describe('estudo guiado e revisão editorial', () => {
  it('avança e retoma o percurso sem perder etapas concluídas', async () => {
    const user = userEvent.setup();
    const { unmount } = mount('/estudar/rag');
    await screen.findByRole('heading', {
      name: 'Estudar: RAG: da pergunta à evidência',
    });
    await user.click(
      screen.getByRole('button', { name: 'Concluir etapa e avançar' }),
    );
    expect(
      screen.getByRole('button', { name: /2 Leitura intermediária/ }),
    ).toHaveAttribute('aria-current', 'step');
    unmount();
    mount('/estudar/rag');
    expect(
      await screen.findByRole('button', { name: /2 Leitura intermediária/ }),
    ).toHaveAttribute('aria-current', 'step');
    expect(
      JSON.parse(localStorage.getItem('academy:learning')!).study.rag.completed,
    ).toEqual([0]);
  });
  it('mostra verso e registra uma resposta real em vez de inventar estatísticas', async () => {
    const user = userEvent.setup();
    mount('/flashcards?capitulo=rag');
    expect(
      await screen.findByText('0 revisões respondidas'),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Mostrar resposta' }));
    await user.click(screen.getByRole('button', { name: 'Acertei' }));
    expect(screen.getByText('1 revisões respondidas')).toBeInTheDocument();
    const values = Object.values(
      JSON.parse(localStorage.getItem('academy:learning')!).cards,
    ) as { correct: number }[];
    expect(values).toHaveLength(1);
    expect(values[0].correct).toBe(1);
  });
  it('Atlas permite ampliar e restaurar o diagrama', async () => {
    const user = userEvent.setup();
    mount('/arquiteturas');
    await user.click(
      await screen.findByRole('button', { name: 'Ampliar diagrama' }),
    );
    expect(screen.getByLabelText('Escala do diagrama')).toHaveTextContent(
      '125%',
    );
    await user.click(
      screen.getByRole('button', { name: 'Restaurar enquadramento' }),
    );
    expect(screen.getByLabelText('Escala do diagrama')).toHaveTextContent(
      '100%',
    );
  });
  it('oferece retomada dos percursos na área de dados', async () => {
    const user = userEvent.setup();
    mount('/estudar/rag');
    await screen.findByRole('button', { name: 'Concluir etapa e avançar' });
    await user.click(
      screen.getByRole('button', { name: 'Concluir etapa e avançar' }),
    );
    await user.click(
      screen.getByRole('link', { name: 'Meus dados de estudo' }),
    );
    expect(
      await screen.findByRole('link', {
        name: /Retomar RAG: da pergunta à evidência/,
      }),
    ).toBeInTheDocument();
  });
  it('mantém título correto nas novas rotas públicas', async () => {
    mount('/laboratorios/neural-network');
    await screen.findByRole('heading', { name: 'Neural Network Training Lab' });
    expect(document.title).toContain('Neural Network Training Lab');
  });
});
