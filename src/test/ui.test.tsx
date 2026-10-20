import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { Markdown } from '../components/Markdown';

const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
describe('experiência pública', () => {
  it('pesquisa conteúdos e permite abrir capítulo', async () => {
    const user = userEvent.setup();
    mount('/busca?q=inferencia');
    const result = await screen.findByRole('heading', {
      name: 'Por dentro de uma resposta de um LLM',
    });
    await user.click(result.closest('a')!);
    expect(
      await screen.findByRole('heading', {
        name: 'Um modelo estima distribuições',
      }),
    ).toBeInTheDocument();
  });
  it('marca leitura, ajusta fonte e persiste progresso', async () => {
    const user = userEvent.setup();
    mount('/capitulos/http-apis');
    await screen.findByRole('heading', {
      name: 'Uma fronteira entre processos',
    });
    await user.click(screen.getByRole('button', { name: 'Marcar como lido' }));
    expect(JSON.parse(localStorage.getItem('academy:progress')!)).toEqual({
      'http-apis': true,
    });
    await user.click(screen.getByRole('button', { name: 'Aumentar fonte' }));
    expect(localStorage.getItem('academy:fontSize')).toBe('19');
    expect(
      screen.getByRole('navigation', { name: 'Neste capítulo' }),
    ).toBeInTheDocument();
  });
  it('navega arquivos reais e explica o módulo selecionado', async () => {
    const user = userEvent.setup();
    mount('/projetos/fastapi-ollama');
    await user.click(await screen.findByRole('button', { name: 'ollama.py' }));
    expect(
      await screen.findByText('Adaptador do protocolo HTTP do Ollama.'),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(document.querySelector('.source-code')).toHaveTextContent(
        'class OllamaService',
      ),
    );
  });
  it('avança etapas do diagrama e volta para a primeira', async () => {
    const user = userEvent.setup();
    mount('/arquiteturas');
    await user.click(
      await screen.findByRole('button', { name: 'Próxima etapa' }),
    );
    expect(
      screen.getByRole('button', { name: /2 Recuperação/ }),
    ).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Etapa anterior' }));
    expect(screen.getByRole('button', { name: /1 Pergunta/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
  it('mostra erro de rota e não executa HTML editorial', () => {
    const { unmount } = mount('/nao-existe');
    expect(
      screen.getByRole('heading', { name: 'Página não encontrada' }),
    ).toBeInTheDocument();
    unmount();
    const { container } = render(
      <Markdown
        source={
          '<script>alert(1)</script>\n\n[perigo](javascript:alert%281%29)'
        }
      />,
    );
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('a')?.getAttribute('href')).not.toMatch(
      /^javascript:/,
    );
  });
});
