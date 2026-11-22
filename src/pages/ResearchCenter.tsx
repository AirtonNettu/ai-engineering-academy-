import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageIntro } from '../components/Cards';
import papersData from '../../content/research/papers.json' with { type: 'json' };
import modelsDatasetsData from '../../content/research/models-datasets.json' with { type: 'json' };
import type { ScientificField, PeerReviewStatus } from '../types/research';

const fieldLabels: Record<ScientificField | 'all', string> = {
  all: 'Todas as Áreas',
  'transformers-attention': 'Transformers & Atenção',
  'rag-retrieval': 'RAG & Recuperação',
  'efficient-inference': 'Inferência Eficiente',
  'reasoning-alignment': 'Raciocínio & Alinhamento',
  'mixture-of-experts': 'Mixture of Experts (MoE)',
  'agents-tool-use': 'Agentes & Ferramentas',
};

const statusLabels: Record<
  PeerReviewStatus,
  { label: string; className: string }
> = {
  'peer-reviewed': { label: 'Revisado por Pares', className: 'green' },
  preprint: { label: 'Preprint (arXiv)', className: 'blue' },
  'technical-report': { label: 'Relatório Técnico', className: 'amber' },
};

export default function ResearchCenter() {
  const [activeTab, setActiveTab] = useState<
    'papers' | 'models' | 'datasets' | 'flow'
  >('papers');
  const [selectedField, setSelectedField] = useState<ScientificField | 'all'>(
    'all',
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPapers = papersData.filter((paper) => {
    const matchesField =
      selectedField === 'all' || paper.field === selectedField;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      paper.title.toLowerCase().includes(q) ||
      paper.originalTitle.toLowerCase().includes(q) ||
      paper.abstractPtBr.toLowerCase().includes(q) ||
      paper.authors.some((a) => a.name.toLowerCase().includes(q));
    return matchesField && matchesSearch;
  });

  const filteredModels = modelsDatasetsData.models.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.architecture.toLowerCase().includes(q) ||
      m.organization.toLowerCase().includes(q)
    );
  });

  const filteredDatasets = modelsDatasetsData.datasets.filter((d) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.modality.toLowerCase().includes(q) ||
      d.createdBy.toLowerCase().includes(q)
    );
  });

  return (
    <div className="research-center-page">
      <PageIntro
        eyebrow="CENTRO DE PESQUISA CIENTÍFICA"
        title="Fundamentos de Fronteira. Conectados à Prática."
        description="Explore os artigos seminais que fundaram a engenharia de IA, consulte os pesos abertos dos principais modelos e acerte seus projetos com rigor científico e transparência de fontes."
      />

      <div
        className="filter-tabs"
        role="group"
        aria-label="Navegar no Centro de Pesquisa"
      >
        <button
          type="button"
          aria-pressed={activeTab === 'papers'}
          onClick={() => setActiveTab('papers')}
        >
          {`Artigos Científicos (${papersData.length})`}
        </button>
        <button
          type="button"
          aria-pressed={activeTab === 'models'}
          onClick={() => setActiveTab('models')}
        >
          {`Modelos Abertos (${modelsDatasetsData.models.length})`}
        </button>
        <button
          type="button"
          aria-pressed={activeTab === 'datasets'}
          onClick={() => setActiveTab('datasets')}
        >
          {`Datasets & Benchmarks (${modelsDatasetsData.datasets.length})`}
        </button>
        <button
          type="button"
          aria-pressed={activeTab === 'flow'}
          onClick={() => setActiveTab('flow')}
        >
          Fluxo Pedagógico Integrado
        </button>
      </div>

      {activeTab !== 'flow' && (
        <div className="search-controls" style={{ margin: '1.5rem 0' }}>
          <div className="search-input-wrapper">
            <input
              type="search"
              placeholder="Buscar por título, autor, arquitetura ou conceito..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar no acervo do Centro de Pesquisa"
              className="search-field"
            />
          </div>

          {activeTab === 'papers' && (
            <div
              className="filter-pills"
              role="group"
              aria-label="Filtrar artigos por área temática"
              style={{ marginTop: '0.75rem' }}
            >
              {(Object.keys(fieldLabels) as (ScientificField | 'all')[]).map(
                (field) => (
                  <button
                    key={field}
                    type="button"
                    aria-pressed={selectedField === field}
                    onClick={() => setSelectedField(field)}
                  >
                    {fieldLabels[field]}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      )}

      {/* ABA 1: ARTIGOS CIENTÍFICOS */}
      {activeTab === 'papers' && (
        <section aria-labelledby="artigos-heading">
          <h2 id="artigos-heading" className="sr-only">
            Artigos Científicos Curados
          </h2>
          <div className="cards-grid">
            {filteredPapers.map((paper) => {
              const status = statusLabels[paper.status as PeerReviewStatus];
              return (
                <article key={paper.id} className="card paper-card">
                  <div className="card-meta">
                    <span className={`eyebrow ${status.className}`}>
                      {status.label}
                    </span>
                    <span className="date-badge">{paper.publicationDate}</span>
                  </div>

                  <h3>{paper.title}</h3>
                  <p className="original-title">
                    <em>{paper.originalTitle}</em>
                  </p>

                  <p className="paper-authors">
                    <strong>Autores:</strong>{' '}
                    {paper.authors.map((a) => a.name).join(', ')} ({paper.venue}
                    )
                  </p>

                  <p className="paper-abstract">{paper.abstractPtBr}</p>

                  <div className="paper-findings">
                    <strong>Pontos-chave:</strong>
                    <ul>
                      {paper.keyFindings.map((finding) => (
                        <li key={finding}>{finding}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Conexões pedagógicas com o restante do site */}
                  <div
                    className="connections-block"
                    style={{ marginTop: 'auto', paddingTop: '1rem' }}
                  >
                    <span
                      className="connections-label"
                      style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        marginBottom: '0.4rem',
                      }}
                    >
                      Conexões na Academy:
                    </span>
                    <div
                      className="connection-links"
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.4rem',
                      }}
                    >
                      {paper.connections.chapterId && (
                        <Link
                          to={`/capitulos/${paper.connections.chapterId}`}
                          className="button secondary"
                          style={{
                            fontSize: '0.8rem',
                            padding: '0.3rem 0.6rem',
                          }}
                        >
                          📖 Ler Capítulo
                        </Link>
                      )}
                      {paper.connections.diagramId && (
                        <Link
                          to={`/arquiteturas?diagrama=${paper.connections.diagramId}`}
                          className="button secondary"
                          style={{
                            fontSize: '0.8rem',
                            padding: '0.3rem 0.6rem',
                          }}
                        >
                          📐 Ver no Atlas
                        </Link>
                      )}
                      {paper.connections.labId && (
                        <Link
                          to={`/laboratorios/${paper.connections.labId}`}
                          className="button secondary"
                          style={{
                            fontSize: '0.8rem',
                            padding: '0.3rem 0.6rem',
                          }}
                        >
                          🧪 Laboratório
                        </Link>
                      )}
                    </div>
                  </div>

                  <div
                    className="card-actions"
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginTop: '1rem',
                    }}
                  >
                    <a
                      href={paper.canonicalUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="button primary"
                      style={{ fontSize: '0.85rem' }}
                    >
                      Ver no arXiv/DOI ↗
                    </a>
                    <a
                      href={paper.openAccessPdfUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="button secondary"
                      style={{ fontSize: '0.85rem' }}
                    >
                      PDF Aberto ↗
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* ABA 2: MODELOS ABERTOS */}
      {activeTab === 'models' && (
        <section aria-labelledby="modelos-heading">
          <h2 id="modelos-heading" className="sr-only">
            Modelos de Inteligência Artificial
          </h2>
          <div className="cards-grid">
            {filteredModels.map((model) => (
              <div key={model.id} className="card model-card">
                <div className="card-meta">
                  <span
                    className={`eyebrow ${model.openWeights ? 'green' : 'blue'}`}
                  >
                    {model.openWeights ? 'Pesos Abertos' : 'API Proprietária'}
                  </span>
                  <span className="date-badge">{model.releaseDate}</span>
                </div>

                <h3>{model.name}</h3>
                <p>
                  <strong>Organização:</strong> {model.organization}
                </p>
                <p>
                  <strong>Parâmetros:</strong> {model.parameterCount}
                </p>
                <p>
                  <strong>Contexto:</strong>{' '}
                  {model.contextWindow.toLocaleString('pt-BR')} tokens
                </p>
                <p>
                  <strong>Licença:</strong> {model.license}
                </p>
                <p>
                  <strong>Arquitetura:</strong> {model.architecture}
                </p>

                {model.huggingFaceUrl && (
                  <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                    <a
                      href={model.huggingFaceUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="button secondary"
                      style={{ width: '100%', textAlign: 'center' }}
                    >
                      Acessar no Hugging Face ↗
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ABA 3: DATASETS */}
      {activeTab === 'datasets' && (
        <section aria-labelledby="datasets-heading">
          <h2 id="datasets-heading" className="sr-only">
            Datasets & Benchmarks Abertos
          </h2>
          <div className="cards-grid">
            {filteredDatasets.map((dataset) => (
              <div key={dataset.id} className="card dataset-card">
                <div className="card-meta">
                  <span className="eyebrow green">
                    {dataset.modality.toUpperCase()}
                  </span>
                  <span className="date-badge">{dataset.license}</span>
                </div>

                <h3>{dataset.name}</h3>
                <p>
                  <strong>Criador:</strong> {dataset.createdBy}
                </p>
                <p>
                  <strong>Volume:</strong> {dataset.tokenCountOrSize}
                </p>

                <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                  <a
                    href={dataset.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="button secondary"
                    style={{ width: '100%', textAlign: 'center' }}
                  >
                    Repositório do Dataset ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ABA 4: FLUXO PEDAGÓGICO INTEGRADO */}
      {activeTab === 'flow' && (
        <section
          aria-labelledby="fluxo-heading"
          className="pedagogical-flow-section"
        >
          <div className="notice" style={{ marginBottom: '2rem' }}>
            <h2
              id="fluxo-heading"
              style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}
            >
              O Método da Academy: Pesquisa → Teoria → Modelo → Experimento
            </h2>
            <p>
              A engenharia de IA de alto impacto não se resume a consumir APIs
              de terceiros como caixas-pretas. Cada funcionalidade construída em
              produção apoia-se em um artigo seminal, formaliza-se em uma
              arquitetura de sistema e valida-se através de código e medições.
            </p>
          </div>

          <div className="cards-grid">
            <div className="card">
              <span className="eyebrow green">Etapa 1: Pesquisa</span>
              <h3>Fundamentos Matemáticos</h3>
              <p>
                Consulte o artigo original no Centro de Pesquisa para
                compreender os limites teóricos, a formulação da perda e os
                trade-offs comprovados pelos pesquisadores.
              </p>
            </div>

            <div className="card">
              <span className="eyebrow green">Etapa 2: Teoria</span>
              <h3>Capítulos da Biblioteca</h3>
              <p>
                Aprofunde-se nos 19 capítulos organizados em 3 profundidades
                (*Conceito*, *Prática* e *Produção*), entendendo como integrar o
                modelo em pipelines escaláveis.
              </p>
            </div>

            <div className="card">
              <span className="eyebrow green">Etapa 3: Arquitetura</span>
              <h3>Atlas de Sistemas</h3>
              <p>
                Navegue passo a passo pelas 9 arquiteturas interativas no Atlas,
                inspecionando cada nó de computação, roteamento e validação.
              </p>
            </div>

            <div className="card">
              <span className="eyebrow green">Etapa 4: Experimento</span>
              <h3>Laboratórios e Código</h3>
              <p>
                Experimente o código em nossos laboratórios interativos em
                TypeScript puro ou rode a API pedagógica FastAPI + Ollama em seu
                próprio terminal.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
