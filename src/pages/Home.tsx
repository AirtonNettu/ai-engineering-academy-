import { useLearning } from '../learning/useLearning';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Code2,
  Network,
  GraduationCap,
  Terminal,
  Braces,
  Cpu,
  Workflow,
  ShieldCheck,
  Github,
} from 'lucide-react';
import { catalog, chapters } from '../lib/content';

import { ChapterCard } from '../components/Cards';
const icons = [Braces, Cpu, Workflow, ShieldCheck];
export default function Home() {
  const { state } = useLearning();
  const progress = state.reading;
  const read = chapters.filter((c) => progress[c.id]).length;
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-badge">
            <span className="status-dot" /> ENGENHARIA DE IA, SEM CAIXA-PRETA
          </div>
          <h1>
            Entenda os fundamentos.
            <br />
            Construa <span>o que vem depois.</span>
          </h1>
          <p>
            Vá além do prompt. Explore conceitos, arquiteturas e código real
            para construir sistemas de inteligência artificial — do primeiro
            princípio à implementação.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/biblioteca">
              Explorar a biblioteca <ArrowRight size={17} />
            </Link>
            <Link className="button secondary" to="/trilhas">
              Encontrar minha trilha <RouteIcon />
            </Link>
          </div>
          <div className="hero-footnote">
            <span>
              <BookOpen size={14} /> 100% gratuito
            </span>
            <span>
              <Github size={14} /> Código aberto
            </span>
            <span>
              <GraduationCap size={15} /> Em português
            </span>
          </div>
        </div>
        <div
          className="hero-visual"
          aria-label="Arquitetura conceitual de uma aplicação de IA"
        >
          <div className="visual-top">
            <span className="tiny-dot" />
            <span className="tiny-dot" />
            <span className="tiny-dot" />
            <span>architecture / ai-system</span>
            <Code2 size={14} />
          </div>
          <div className="visual-grid">
            <div className="visual-label">DA IDEIA À IMPLEMENTAÇÃO</div>
            <div className="architecture-node input-node">
              <Braces size={20} />
              <div>
                <strong>Sua aplicação</strong>
                <span>Interface · API · Contexto</span>
              </div>
              <span className="node-tag">INPUT</span>
            </div>
            <div className="visual-connector">
              <span />↓<span />
            </div>
            <div className="visual-middle">
              <div className="architecture-node">
                <Network size={21} />
                <strong>Conhecimento</strong>
                <span>RAG & ferramentas</span>
              </div>
              <div className="visual-plus">+</div>
              <div className="architecture-node model-node">
                <Cpu size={21} />
                <strong>Modelo de IA</strong>
                <span>Inferência & raciocínio</span>
              </div>
            </div>
            <div className="visual-connector">↓</div>
            <div className="architecture-node output-node">
              <Terminal size={19} />
              <div>
                <strong>Uma resposta. Um sistema.</strong>
                <span>Compreenda cada conexão.</span>
              </div>
              <span className="output-check">✓</span>
            </div>
            <div className="visual-caption">
              <span className="status-dot" /> Menos abstração. Mais compreensão.
            </div>
          </div>
        </div>
      </section>
      <div className="learning-home-links">
        <Link className="button secondary" to="/laboratorios">
          Calcular nos laboratórios →
        </Link>
        <Link className="button secondary" to="/flashcards">
          Revisar flashcards →
        </Link>
        <Link className="text-link" to="/meus-dados">
          Retomar e preservar meu estudo →
        </Link>
      </div>
      <div className="stats-bar">
        <div>
          <strong>{chapters.length.toString().padStart(2, '0')}</strong>
          <span>capítulos aprofundados</span>
        </div>
        <div>
          <strong>04</strong>
          <span>áreas de conhecimento</span>
        </div>
        <div>
          <strong>{catalog.roadmaps.length.toString().padStart(2, '0')}</strong>
          <span>trilhas profissionais</span>
        </div>
        <div>
          <strong>∞</strong>
          <span>vontade de aprender</span>
        </div>
      </div>
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow green">CONSTRUA UMA BASE SÓLIDA</span>
            <h2>Um universo. Quatro perspectivas.</h2>
            <p>Aprenda como as peças se conectam, uma camada de cada vez.</p>
          </div>
          <Link className="text-link" to="/biblioteca">
            Ver biblioteca <ArrowRight size={16} />
          </Link>
        </div>
        <div className="area-grid">
          {catalog.areas.map((area, i) => {
            const Icon = icons[i];
            return (
              <Link
                key={area.id}
                to={`/biblioteca?area=${area.id}`}
                className={`area-card area-${area.id}`}
              >
                <span className="area-card-index">0{i + 1}</span>
                <div className="area-symbol">
                  <Icon size={24} />
                </div>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
                <div className="area-card-bottom">
                  <span>
                    {chapters.filter((c) => c.category === area.id).length}{' '}
                    {chapters.filter((c) => c.category === area.id).length === 1
                      ? 'capítulo disponível'
                      : 'capítulos disponíveis'}
                  </span>
                  <ArrowUpRight size={17} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow green">APRENDIZADO QUE VAI A FUNDO</span>
            <h2>Abra um capítulo. Conecte as ideias.</h2>
            <p>Conceitos, funcionamento interno e implementação, juntos.</p>
          </div>
          <Link className="text-link" to="/biblioteca">
            Todos os capítulos <ArrowRight size={16} />
          </Link>
        </div>
        <div className="chapter-grid">
          {[chapters[2], chapters[3], chapters[4]].map((c) => (
            <ChapterCard
              key={c.id}
              chapter={c}
              index={chapters.indexOf(c)}
              read={!!progress[c.id]}
            />
          ))}
        </div>
      </section>
      <section className="code-promo">
        <div>
          <span className="eyebrow">LEIA O CÓDIGO. ENTENDA O SISTEMA.</span>
          <h2>
            O caminho entre
            <br />a arquitetura e o arquivo.
          </h2>
          <p>
            Explore uma integração real com Python, FastAPI e Ollama. Descubra o
            papel de cada módulo, acompanhe o fluxo e estude os testes.
          </p>
          <Link className="button light-button" to="/projetos/fastapi-ollama">
            Abrir explorador de código <ArrowUpRight size={17} />
          </Link>
          <span className="promo-note">
            Nenhum modelo online necessário para estudar.
          </span>
        </div>
        <div className="promo-code" aria-hidden="true">
          <div className="promo-file">
            <span className="tiny-dot" />
            <span>app / integrations / ollama.py</span>
            <span>Python</span>
          </div>
          <pre>
            <span className="code-purple">class</span>{' '}
            <span className="code-yellow">OllamaService</span>:<br />
            <br /> <span className="code-purple">async def</span>{' '}
            <span className="code-blue">generate</span>(self, message: str):
            <br /> response = <span className="code-purple">await</span>{' '}
            self.client.post(
            <br /> <span className="code-green">"/api/chat"</span>,<br />{' '}
            json=&#123;<span className="code-green">"model"</span>: self.model,
            <br /> <span className="code-green">"stream"</span>:{' '}
            <span className="code-purple">False</span>, ...&#125;
            <br /> )<br /> response.raise_for_status()
          </pre>
          <Link to="/projetos/fastapi-ollama" tabIndex={-1}>
            Trecho visual abreviado · explore o arquivo completo →
          </Link>
        </div>
      </section>
      <section className="section bottom-grid">
        <div>
          <span className="eyebrow green">SEU PRÓXIMO PASSO</span>
          <h2>Uma direção para cada jornada.</h2>
          <p className="muted">
            Aplicações, operação ou desenvolvimento de modelos: encontre o seu
            caminho sem confundir os papéis.
          </p>
          <Link className="text-link" to="/trilhas">
            Explorar trilhas profissionais <ArrowRight size={16} />
          </Link>
        </div>
        <div className="study-note">
          <span className="note-icon">
            <BookOpen size={22} />
          </span>
          <div>
            <h3>Seu ritmo. Seu progresso.</h3>
            <p>
              {read
                ? `${read} de ${chapters.length} capítulos marcados como lidos.`
                : 'Marque capítulos como lidos e continue de onde parou.'}{' '}
              Tudo fica neste navegador, sem conta.
            </p>
            <Link className="text-link" to="/biblioteca">
              Minha biblioteca <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      <div className="coverage-note">
        Uma biblioteca em construção: {chapters.length} capítulos completos
        disponíveis. Os demais tópicos do currículo estão identificados como
        cobertura futura, sem páginas vazias.
      </div>
    </>
  );
}
function RouteIcon() {
  return <ArrowUpRight size={16} />;
}
