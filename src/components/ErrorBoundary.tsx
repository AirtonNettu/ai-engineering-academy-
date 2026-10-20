import { Component, type ReactNode } from 'react';
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <main className="fatal">
        <h1>Não foi possível abrir esta página</h1>
        <p>
          Seus dados de leitura continuam no navegador. Recarregue para tentar
          novamente.
        </p>
        <button onClick={() => window.location.reload()}>Recarregar</button>
      </main>
    ) : (
      this.props.children
    );
  }
}
