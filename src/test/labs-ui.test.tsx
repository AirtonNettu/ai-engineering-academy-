import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Labs from '../pages/Labs';
function open(id: string) {
  render(
    <MemoryRouter initialEntries={['/laboratorios/' + id]}>
      <Routes>
        <Route path="/laboratorios/:labId" element={<Labs />} />
      </Routes>
    </MemoryRouter>,
  );
}
describe('controles reais dos labs', () => {
  it('avança treino e reinicia épocas', () => {
    open('neural-network');
    fireEvent.click(screen.getByRole('button', { name: 'Um passo' }));
    expect(screen.getByTestId('epoch')).toHaveTextContent('1');
    expect(
      screen.getByLabelText('Gradiente do primeiro peso'),
    ).toHaveTextContent('∂L/∂w₀');
    fireEvent.click(screen.getByRole('button', { name: 'Reiniciar' }));
    expect(screen.getByTestId('epoch')).toHaveTextContent('0');
  });
  it('avança atenção, altera máscara e reinicia', () => {
    open('attention');
    fireEvent.click(screen.getByRole('button', { name: 'Um passo' }));
    expect(screen.getByTestId('attention-step')).toHaveTextContent('K');
    fireEvent.click(screen.getByLabelText('Máscara causal'));
    expect(screen.getByLabelText('Máscara causal')).toBeChecked();
    fireEvent.click(screen.getByRole('button', { name: 'Reiniciar' }));
    expect(screen.getByTestId('attention-step')).toHaveTextContent('Q');
  });
  it('ranking muda com consulta e seleção avança', () => {
    open('embeddings');
    fireEvent.change(screen.getByLabelText('Consulta de exemplo'), {
      target: { value: 'ops' },
    });
    expect(screen.getByTestId('ranking').firstChild).toHaveTextContent(
      'Observabilidade',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Um passo' }));
    expect(screen.getByTestId('retrieval')).toHaveTextContent('2 / 5');
    fireEvent.click(screen.getByRole('button', { name: 'Reiniciar' }));
    expect(screen.getByTestId('retrieval')).toHaveTextContent('1 / 5');
  });
  it('desconhecido oferece retorno', () => {
    open('inexistente');
    expect(screen.getByText('Laboratório não encontrado')).toBeInTheDocument();
  });
});

describe('interação acessível e orçamento', () => {
  it('destaca a matriz real da etapa atual', () => {
    open('attention');
    expect(screen.getByRole('region', { name: 'Matriz Q' })).toHaveAttribute(
      'aria-current',
      'step',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Um passo' }));
    expect(screen.getByRole('region', { name: 'Matriz K' })).toHaveAttribute(
      'aria-current',
      'step',
    );
  });
  it('reprodução é finita, pausável e limpa timer ao desmontar', () => {
    vi.useFakeTimers();
    try {
      const { unmount } = render(
        <MemoryRouter initialEntries={['/laboratorios/neural-network']}>
          <Routes>
            <Route path="/laboratorios/:labId" element={<Labs />} />
          </Routes>
        </MemoryRouter>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Reproduzir' }));
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(screen.getByTestId('epoch')).toHaveTextContent('10');
      fireEvent.click(screen.getByRole('button', { name: 'Pausar' }));
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getByTestId('epoch')).toHaveTextContent('10');
      fireEvent.click(screen.getByRole('button', { name: 'Reproduzir' }));
      unmount();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
  it('mover ponto por teclado preserva ranking e reset restaura projeção', () => {
    open('embeddings');
    const point = screen.getByRole('button', { name: 'Mover API Python' });
    const before = point.getAttribute('transform');
    const ranking = screen.getByTestId('ranking').textContent;
    fireEvent.keyDown(point, { key: 'ArrowRight' });
    expect(point.getAttribute('transform')).not.toBe(before);
    expect(screen.getByTestId('ranking').textContent).toBe(ranking);
    fireEvent.click(screen.getByRole('button', { name: 'Reiniciar' }));
    expect(point.getAttribute('transform')).toBe(before);
    const plot = screen.getByRole('group', {
      name: 'Projeção de vetores navegável',
    });
    fireEvent.keyDown(plot, { key: '+' });
    expect(point.parentElement).toHaveAttribute(
      'transform',
      'translate(0 0) scale(1.2)',
    );
  });
});

it('arraste por ponteiro e gesto de dois dedos alteram só a projeção', () => {
  open('embeddings');
  const point = screen.getByRole('button', { name: 'Mover API Python' });
  const plot = screen.getByRole('group', {
    name: 'Projeção de vetores navegável',
  });
  const original = point.getAttribute('transform');
  const ranking = screen.getByTestId('ranking').textContent;
  function pointer(
    target: Element,
    type: string,
    id: number,
    x: number,
    y: number,
  ) {
    const event = new Event(type, { bubbles: true, cancelable: true });
    Object.assign(event, {
      pointerId: id,
      clientX: x,
      clientY: y,
      pointerType: 'touch',
    });
    fireEvent(target, event);
  }
  pointer(point, 'pointerdown', 1, 90, 80);
  pointer(plot, 'pointermove', 1, 120, 90);
  pointer(plot, 'pointerup', 1, 120, 90);
  expect(point.getAttribute('transform')).not.toBe(original);
  expect(screen.getByTestId('ranking').textContent).toBe(ranking);
  pointer(plot, 'pointerdown', 1, 100, 100);
  pointer(plot, 'pointerdown', 2, 200, 100);
  pointer(plot, 'pointermove', 2, 250, 100);
  expect(point.parentElement).toHaveAttribute(
    'transform',
    'translate(0 0) scale(1.5)',
  );
  pointer(plot, 'pointercancel', 1, 100, 100);
  pointer(plot, 'pointercancel', 2, 250, 100);
  fireEvent.click(screen.getByRole('button', { name: 'Reiniciar' }));
  expect(point.getAttribute('transform')).toBe(original);
});

it('alterar o orçamento pausa o treinamento até reprodução explícita', () => {
  vi.useFakeTimers();
  try {
    open('neural-network');
    fireEvent.click(screen.getByRole('button', { name: 'Reproduzir' }));
    act(() => {
      vi.advanceTimersByTime(100);
    });
    fireEvent.change(screen.getByLabelText('Limite de épocas'), {
      target: { value: '4000' },
    });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByTestId('epoch')).toHaveTextContent(/^10$/);
    expect(
      screen.getByRole('button', { name: 'Reproduzir' }),
    ).toBeInTheDocument();
  } finally {
    vi.useRealTimers();
  }
});
