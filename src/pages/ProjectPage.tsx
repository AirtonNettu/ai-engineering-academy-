import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FileCode2, Folder, ChevronRight, ArrowUpRight } from 'lucide-react';
import { catalog } from '../lib/content';
import { CodeBlock } from '../components/CodeBlock';
import { PageIntro } from '../components/Cards';
const sources = import.meta.glob(
  [
    '/examples/fastapi-ollama/**/*.{py,txt,md}',
    '!**/.venv/**',
    '!**/__pycache__/**',
  ],
  {
    query: '?raw',
    import: 'default',
  },
);
const env = import.meta.glob('/examples/fastapi-ollama/.env.example', {
  query: '?raw',
  import: 'default',
});
const loaders = { ...sources, ...env };
type Tree = { [key: string]: Tree | null };
function makeTree(paths: string[]): Tree {
  const tree: Tree = {};
  for (const path of paths) {
    const parts = path.split('/');
    let node = tree;
    parts.forEach((part, i) => {
      if (i === parts.length - 1) node[part] = null;
      else {
        node[part] ??= {};
        node = node[part] as Tree;
      }
    });
  }
  return tree;
}
function FileTree({
  tree,
  prefix = '',
  selected,
  onSelect,
}: {
  tree: Tree;
  prefix?: string;
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <ul className="file-tree">
      {Object.entries(tree).map(([name, children]) => {
        const path = prefix + name;
        return (
          <li key={path}>
            {children ? (
              <details open>
                <summary>
                  <Folder size={15} />
                  {name}
                </summary>
                <FileTree
                  tree={children}
                  prefix={path + '/'}
                  selected={selected}
                  onSelect={onSelect}
                />
              </details>
            ) : (
              <button
                aria-current={selected === path ? 'true' : undefined}
                onClick={() => onSelect(path)}
              >
                <FileCode2 size={14} />
                {name}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
export default function ProjectPage() {
  const project = catalog.projects[0];
  const [params, setParams] = useSearchParams();
  const requested = params.get('file');
  const selected = project.files.some((f) => f.path === requested)
    ? requested!
    : 'app/main.py';
  const file = project.files.find((f) => f.path === selected)!;
  const [loaded, setLoaded] = useState({ path: '', code: '', error: false });
  useEffect(() => {
    let active = true;
    const load = loaders[`/examples/fastapi-ollama/${selected}`];
    if (load)
      load()
        .then((code) => {
          if (active)
            setLoaded({ path: selected, code: String(code), error: false });
        })
        .catch(() => {
          if (active) setLoaded({ path: selected, code: '', error: true });
        });
    return () => {
      active = false;
    };
  }, [selected]);
  return (
    <>
      <PageIntro
        eyebrow="EXPLORADOR DE CÓDIGO-FONTE"
        title="O código não precisa ser uma caixa-preta."
        description="Uma API de chat com Python, FastAPI e Ollama. Arquivos completos, responsabilidades explícitas e testes executáveis — sem precisar de um modelo online para estudar."
      />
      <div className="project-badges">
        <span className="tag">Python 3.12+</span>
        <span className="tag">FastAPI</span>
        <span className="tag">HTTPX</span>
        <span className="tag">Testes com mocks</span>
        <Link className="text-link" to="/capitulos/ollama-fastapi">
          Ler explicação completa <ArrowUpRight size={14} />
        </Link>
      </div>
      <div className="explorer">
        <aside className="explorer-sidebar">
          <h2>
            <Folder size={17} /> fastapi-ollama
          </h2>
          <FileTree
            tree={makeTree(project.files.map((f) => f.path))}
            selected={selected}
            onSelect={(path) => setParams({ file: path })}
          />
          <div className="explorer-note">
            Código real, versionado e testado. A execução é local e opcional.
          </div>
        </aside>
        <div className="explorer-main">
          <div className="file-breadcrumb">
            <FileCode2 size={15} />
            <span>fastapi-ollama</span>
            <ChevronRight size={13} />
            <strong>{selected}</strong>
          </div>
          <div className="file-explanation">
            <span className="eyebrow green">RESPONSABILIDADE DO ARQUIVO</span>
            <h2>{file.role}</h2>
            <p>{file.symbols}</p>
            <div className="imports">
              <strong>Imports e dependências</strong>
              <span>
                {file.imports.length
                  ? file.imports.join(' · ')
                  : 'Sem imports de módulos.'}
              </span>
            </div>
          </div>
          {loaded.error ? (
            <p role="alert">
              Não foi possível carregar o arquivo. Recarregue a página.
            </p>
          ) : loaded.path !== selected ? (
            <p role="status">Carregando arquivo…</p>
          ) : (
            <CodeBlock
              key={selected}
              code={loaded.code}
              title={selected}
              language={
                selected.endsWith('.py')
                  ? 'python'
                  : selected.endsWith('.json')
                    ? 'json'
                    : 'text'
              }
            />
          )}
        </div>
      </div>
      <section className="section project-guide">
        <div>
          <h2>Execute. Teste. Entenda.</h2>
          <p>
            Crie um ambiente virtual e rode os testes sem acessar o Ollama. Para
            geração real, instale o modelo localmente conforme o README.
          </p>
          <CodeBlock
            code={
              'cd examples/fastapi-ollama\npython -m venv .venv\n. .venv/bin/activate\npython -m pip install -r requirements.lock.txt\npython -m pytest -q\npython -m uvicorn app.main:create_app --factory'
            }
            language="bash"
          />
        </div>
        <div>
          <h2>O caminho da requisição</h2>
          <ol className="execution-list">
            <li>
              <strong>main.py</strong>Composição da aplicação e ciclo de vida
              HTTP.
            </li>
            <li>
              <strong>models.py → routes/chat.py</strong>Validação de entrada e
              contrato do endpoint.
            </li>
            <li>
              <strong>integrations/ollama.py</strong>Chamada ao modelo e
              validação de resposta.
            </li>
            <li>
              <strong>routes/chat.py</strong>Resposta pública e tradução de
              erros.
            </li>
          </ol>
          <Link className="text-link" to="/arquiteturas?diagrama=http">
            Explorar diagrama da integração <ArrowUpRight size={16} />
          </Link>
          <p className="small muted">
            /health é liveness do backend. Testes mockados não medem qualidade
            do modelo. Sem geração pública ou integração local ativa neste site.
          </p>
        </div>
      </section>
    </>
  );
}
