import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowUpRight } from 'lucide-react';
import { search } from '../lib/search';
import { Empty, PageIntro } from '../components/Cards';
export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const results = search(query);
  return (
    <>
      <PageIntro
        eyebrow="PESQUISA UNIFICADA"
        title="Qual é a sua próxima pergunta?"
        description="Encontre capítulos, conceitos, trilhas, projetos, ferramentas, skills e referências. Busca local, sem enviar dados a terceiros."
      />
      <label className="input-with-icon search-large">
        <Search size={21} />
        <span className="sr-only">Buscar em toda a Academy</span>
        <input
          autoFocus
          type="search"
          value={query}
          onChange={(e) =>
            setParams(e.target.value ? { q: e.target.value } : {}, {
              replace: true,
            })
          }
          placeholder="Experimente RAG, inferência ou FastAPI..."
        />
      </label>
      <p role="status" className="muted">
        {query
          ? `${results.length} resultados para “${query}”`
          : 'Comece por um conceito, ferramenta ou área de interesse.'}
      </p>
      {results.length ? (
        <div className="search-results">
          {results.map((r) => (
            <Link key={r.kind + r.id} to={r.url}>
              <div>
                <span className="eyebrow green">{r.kind}</span>
                <h2>{r.title}</h2>
                <p>{r.description}</p>
              </div>
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </div>
      ) : query ? (
        <Empty
          title="Ainda não encontramos esse termo"
          description="Tente uma palavra mais curta ou procure no glossário. A cobertura editorial disponível é limitada e explícita."
        />
      ) : (
        <div className="topic-cloud">
          {['RAG', 'inferência', 'FastAPI', 'MCP', 'segurança', 'MLOps'].map(
            (q) => (
              <button className="tag" key={q} onClick={() => setParams({ q })}>
                {q} ↗
              </button>
            ),
          )}
        </div>
      )}
    </>
  );
}
