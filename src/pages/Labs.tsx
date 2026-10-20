import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CodeBlock } from '../components/CodeBlock';
import NeuralLab from '../labs/NeuralLab';
import AttentionLab from '../labs/AttentionLab';
import EmbeddingLab from '../labs/EmbeddingLab';
import neuralSource from '../labs/neural.ts?raw';
import attentionSource from '../labs/attention.ts?raw';
import embeddingSource from '../labs/embeddings.ts?raw';
import '../labs/labs.css';
const labs = [
  {
    id: 'neural-network',
    title: 'Neural Network Training Lab',
    description:
      'Treine uma rede 2–3–1 no XOR com forward, backprop e perda reais.',
    source: neuralSource,
    file: 'neural.ts',
    component: NeuralLab,
  },
  {
    id: 'attention',
    title: 'Attention Explorer',
    description:
      'Inspecione Q, K, V, softmax e máscara causal em uma cabeça didática.',
    source: attentionSource,
    file: 'attention.ts',
    component: AttentionLab,
  },
  {
    id: 'embeddings',
    title: 'Embedding Explorer',
    description:
      'Compare vetores por cosseno e explore uma projeção manipulável.',
    source: embeddingSource,
    file: 'embeddings.ts',
    component: EmbeddingLab,
  },
];
export default function Labs() {
  const { labId } = useParams();
  const [params] = useSearchParams();
  const lab = labs.find((l) => l.id === labId);
  if (!labId)
    return (
      <div className="labs">
        <h1>Laboratórios visuais</h1>
        <p>
          Da teoria ao cálculo: exemplos pequenos, determinísticos e executados
          apenas no navegador. Sem GPU ou serviços externos.
        </p>
        <div className="lab-catalog">
          {labs.map((l) => (
            <article key={l.id}>
              <h2>
                <Link to={`/laboratorios/${l.id}`}>{l.title}</Link>
              </h2>
              <p>{l.description}</p>
            </article>
          ))}
        </div>
      </div>
    );
  if (!lab)
    return (
      <div>
        <h1>Laboratório não encontrado</h1>
        <Link to="/laboratorios">Voltar aos laboratórios</Link>
      </div>
    );
  const Component = lab.component;
  return (
    <div className="labs">
      <Link to="/laboratorios">← Laboratórios</Link>
      <h1>{lab.title}</h1>
      <p>{lab.description}</p>
      <nav aria-label="Modo do laboratório">
        <Link to={`/laboratorios/${lab.id}`}>Experimentar</Link> ·{' '}
        <Link to={`/laboratorios/${lab.id}?codigo=1`}>
          Ver código dos cálculos
        </Link>
      </nav>
      <Component key={lab.id} />
      {params.get('codigo') === '1' && (
        <section className="lab-source">
          <h2>Código real executado pelo laboratório</h2>
          <p>
            Fonte original: src/labs/{lab.file}. A interface importa estas
            mesmas funções; o trecho abaixo é importado do arquivo, sem
            duplicação matemática. Clone o repositório, execute npm ci e npm run
            dev para experimentar localmente.
          </p>
          <CodeBlock
            code={lab.source}
            language="typescript"
            title={`src/labs/${lab.file}`}
          />
          <h3>Reproduzir a verificação</h3>
          <CodeBlock
            language="shell"
            code={
              'npm ci\nnpx vitest run src/test/labs-math.test.ts src/test/labs-ui.test.tsx\nnpm run dev'
            }
          />
          <p>
            Os testes comparam todos os gradientes por diferenças finitas (ε =
            10⁻⁵), verificam convergência em 5.000 épocas, softmax causal,
            cosseno e controles de interface. Alterar projeção visual não altera
            os vetores usados na busca.
          </p>
        </section>
      )}
    </div>
  );
}
