import { useState } from 'react';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { catalog } from '../lib/content';
import { normalize } from '../lib/search';
import { PageIntro, Empty } from '../components/Cards';
export default function Resources() {
  const [category, setCategory] = useState('Todas');
  const [query, setQuery] = useState('');
  const resources = catalog.resources.filter(
    (r) =>
      (category === 'Todas' || r.category === category) &&
      normalize(`${r.title} ${r.description}`).includes(normalize(query)),
  );
  return (
    <>
      <PageIntro
        eyebrow="SKILLS, FERRAMENTAS E REFERÊNCIAS"
        title="Boas fontes fazem a diferença."
        description="Um catálogo curado de documentação oficial, ferramentas abertas e referências para aprofundar sua prática. Acesso externo não é instalação nem certificação."
      />
      <div className="notice security-notice">
        <ShieldCheck size={22} />
        <div>
          <strong>
            Antes de instalar uma skill, revise o que ela pode fazer.
          </strong>
          <p>
            Verifique origem, licença, scripts, permissões e destinos de rede.
            Nunca compartilhe segredos com instruções de terceiros.
            Compatibilidade deve ser confirmada na documentação do autor.
          </p>
          <a
            href="https://skills.sh/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Explorar o catálogo externo skills.sh ↗
          </a>
        </div>
      </div>
      <div className="resource-tools">
        <label>
          Especialidade
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {[
              'Todas',
              ...new Set(catalog.resources.map((r) => r.category)),
            ].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Filtrar recursos
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nome ou finalidade..."
          />
        </label>
      </div>
      {resources.length ? (
        <div className="resource-grid">
          {resources.map((r) => (
            <article className="resource-card" id={r.id} key={r.id}>
              <div className="resource-card-top">
                <span className="tag">{r.category}</span>
                <span className="eyebrow">{r.kind}</span>
              </div>
              <h2>{r.title}</h2>
              <p>{r.description}</p>
              <p className="small muted">{r.compatibility}</p>
              <a
                className="text-link"
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Consultar fonte <ArrowUpRight size={16} />
                <span className="sr-only"> de {r.title}</span>
              </a>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title="Nenhum recurso encontrado"
          description="Tente outro termo ou especialidade."
        />
      )}
      <p className="coverage-note">
        Skills e ferramentas externas podem mudar de licença, compatibilidade ou
        política de uso. Não instalamos nem executamos conteúdo de terceiros
        automaticamente.
      </p>
    </>
  );
}
