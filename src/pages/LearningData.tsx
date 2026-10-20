import { Link } from 'react-router-dom';
import { catalog } from '../lib/content';
import { useState, type ChangeEvent } from 'react';
import { PageIntro } from '../components/Cards';
import { useLearning } from '../learning/useLearning';
import {
  createBackup,
  parseBackup,
  type LearningState,
} from '../learning/model';
import { knownLearningIds } from '../learning/content';
import '../learning/learning.css';
export default function LearningData() {
  const { state, replace, clear } = useLearning();
  const [pending, setPending] = useState<LearningState | null>(null);
  const [message, setMessage] = useState('');
  const [confirm, setConfirm] = useState(false);
  function download() {
    try {
      const blob = new Blob([createBackup(state)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ia-engineer-academy-estudo.json';
      document.body.append(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage('Backup JSON exportado. Guarde o arquivo em um local seguro.');
    } catch {
      setMessage(
        'Não foi possível exportar. Verifique as permissões de download do navegador.',
      );
    }
  }
  async function upload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setPending(null);
    if (!file) return;
    try {
      if (file.size > 500000) throw Error();
      const parsed = parseBackup(await file.text(), knownLearningIds);
      setPending(parsed);
      setMessage('Backup validado. Nenhum dado foi substituído ainda.');
    } catch {
      setMessage(
        'Backup inválido: use um JSON exportado pela Academy, até 500 KB, com capítulos e cartões conhecidos. Seus dados atuais foram preservados.',
      );
    }
    e.target.value = '';
  }
  return (
    <>
      <PageIntro
        eyebrow="SEUS DADOS, NO SEU NAVEGADOR"
        title="Seu estudo continua com você."
        description="Sem conta, sincronização ou telemetria. Leituras, percurso e revisões ficam neste dispositivo e podem ser apagados pelo navegador. Exporte um backup para preservá-los."
      />
      <div className="data-grid">
        <section className="data-panel">
          <h2>Retomar meus percursos</h2>
          {Object.keys(state.study).length ? (
            <ul className="resume-list">
              {Object.entries(state.study)
                .sort((a, b) => b[1].updatedAt - a[1].updatedAt)
                .map(([id, value]) => {
                  const chapter = catalog.chapters.find((c) => c.id === id);
                  return chapter ? (
                    <li key={id}>
                      <Link className="text-link" to={`/estudar/${id}`}>
                        Retomar {chapter.title} →
                      </Link>
                      <span className="small muted">
                        Etapa {value.step + 1}/6 · {value.completed.length}{' '}
                        concluídas
                      </span>
                    </li>
                  ) : null;
                })}
            </ul>
          ) : (
            <p>
              Você ainda não iniciou um percurso. Abra um artigo e escolha
              “Estudar este assunto”.
            </p>
          )}
        </section>
        <section className="data-panel">
          <h2>Exportar dados de estudo</h2>
          <p>
            O arquivo contém marcações de leitura, etapas do percurso,
            contadores e agenda de flashcards. Não inclui identidade ou dados
            enviados a servidores.
          </p>
          <button className="button primary" onClick={download}>
            Exportar backup JSON
          </button>
        </section>
        <section className="data-panel">
          <h2>Importar um backup</h2>
          <p>
            A importação é validada antes de qualquer alteração. Ao confirmar,
            substitui seu progresso atual; não combina contadores.
          </p>
          <label>
            Selecionar backup JSON
            <input
              type="file"
              accept="application/json,.json"
              onChange={upload}
            />
          </label>
          {pending && (
            <div className="notice">
              <p>
                {Object.keys(pending.reading).length} registros de leitura;{' '}
                {Object.keys(pending.study).length} percursos;{' '}
                {Object.keys(pending.cards).length} cartões revisados.
              </p>
              <button
                className="button primary"
                onClick={() => {
                  replace(pending);
                  setPending(null);
                  setMessage('Dados de estudo importados.');
                }}
              >
                Confirmar substituição dos dados
              </button>
              <button className="text-button" onClick={() => setPending(null)}>
                Cancelar importação
              </button>
            </div>
          )}
        </section>
        <section className="data-panel">
          <h2>Limpar estudo e revisões</h2>
          <p>
            Remove leituras, percursos e agenda de revisão desta Academy. Tema e
            tamanho de fonte são preservados; outros sites não são afetados.
            Exporte antes de limpar.
          </p>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={confirm}
              onChange={(e) => setConfirm(e.target.checked)}
            />{' '}
            Entendo que o progresso será apagado
          </label>
          <button
            className="button secondary"
            disabled={!confirm}
            onClick={() => {
              clear();
              setConfirm(false);
              setPending(null);
              setMessage('Dados de estudo limpos.');
            }}
          >
            Limpar dados de estudo
          </button>
        </section>
      </div>
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
    </>
  );
}
