import { useEffect, useState, useRef, type ReactNode } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Blocks,
  Route,
  Code2,
  Library,
  Search,
  ArrowUpRight,
  Sun,
  Moon,
  Menu,
  X,
  GraduationCap,
  Github,
  PanelLeftClose,
  FlaskConical,
  Layers,
  HardDriveDownload,
} from 'lucide-react';
import { readPreference, savePreference } from '../lib/storage';
const navigation = [
  { to: '/', title: 'Visão geral', icon: Blocks },
  { to: '/biblioteca', title: 'Biblioteca', icon: BookOpen },
  { to: '/trilhas', title: 'Trilhas profissionais', icon: Route },
  { to: '/arquiteturas', title: 'Arquiteturas interativas', icon: Blocks },
  {
    to: '/projetos/fastapi-ollama',
    title: 'Explorador de código',
    icon: Code2,
  },
  { to: '/recursos', title: 'Skills e recursos', icon: Library },
  { to: '/glossario', title: 'Glossário', icon: GraduationCap },
  { to: '/laboratorios', title: 'Laboratórios', icon: FlaskConical },
  { to: '/flashcards', title: 'Flashcards', icon: Layers },
  { to: '/meus-dados', title: 'Meus dados de estudo', icon: HardDriveDownload },
];
export function Layout({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const [mobile, setMobile] = useState(
    () =>
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(max-width: 760px)').matches,
  );
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(max-width: 760px)');
    const update = () => setMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const [theme, setTheme] = useState(() => {
    const saved = readPreference<string>('theme', 'light');
    return saved === 'dark' ? 'dark' : 'light';
  });
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    savePreference('theme', theme);
  }, [theme]);
  useEffect(() => {
    if (!location.hash) window.scrollTo?.(0, 0);
  }, [location.pathname, location.hash]);
  useEffect(() => {
    if (!menu || !mobile) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const items = () =>
      Array.from(
        sidebarRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled)',
        ) || [],
      );
    items()[0]?.focus();
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenu(false);
      if (e.key !== 'Tab') return;
      const elements = items();
      const first = elements[0];
      const last = elements.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [menu, mobile]);
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className="app-shell">
        <aside
          ref={sidebarRef}
          className={`sidebar ${menu ? 'is-open' : ''}`}
          inert={mobile && !menu}
          aria-label="Navegação principal"
        >
          <Link className="brand" to="/" onClick={() => setMenu(false)}>
            <span className="brand-mark">
              <Code2 size={24} />
            </span>
            <span>
              IA Engineer<span className="brand-academy">ACADEMY</span>
            </span>
          </Link>
          <button
            className="mobile-close icon-button"
            aria-label="Fechar menu"
            onClick={() => setMenu(false)}
          >
            <PanelLeftClose size={20} />
          </button>
          <div className="sidebar-caption">SEU ESPAÇO DE APRENDIZADO</div>
          <nav>
            {navigation.map(({ to, title, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMenu(false)}
              >
                <Icon size={18} />
                <span>{title}</span>
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-note">
            <span className="status-dot" /> Conhecimento aberto
            <p>
              Sem barreiras. Sem assinatura.
              <br />
              Feito para quem quer entender.
            </p>
            <a
              href="https://github.com/AirtonNettu/ai-engineering-academy-"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={16} /> Contribuir no GitHub{' '}
              <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="sidebar-bottom">
            <span>APRENDA. CONSTRUA. COMPARTILHE.</span>
            <span className="small">
              Uma biblioteca em constante construção.
            </span>
          </div>
        </aside>
        {menu && (
          <button
            className="menu-backdrop"
            aria-label="Fechar navegação"
            onClick={() => setMenu(false)}
          />
        )}
        <div className="main-shell" inert={mobile && menu}>
          <header className="topbar">
            <div className="topbar-location">
              <Link className="mobile-brand" to="/">
                IA Engineer<span>Academy</span>
              </Link>
              <button
                className="mobile-menu icon-button"
                aria-expanded={menu}
                aria-label={menu ? 'Fechar menu' : 'Abrir menu'}
                onClick={() => setMenu((v) => !v)}
              >
                {menu ? <X size={21} /> : <Menu size={21} />}
              </button>
              <span className="topbar-home">
                Academy <span>/</span>
              </span>
              <span>
                {navigation.find((n) => n.to === location.pathname)?.title ||
                  (location.pathname.startsWith('/capitulos')
                    ? 'Leitura'
                    : 'Explorar')}
              </span>
            </div>
            <div className="topbar-actions">
              <button
                className="search-trigger"
                aria-label="Buscar conhecimento..."
                onClick={() => {
                  setMenu(false);
                  navigate('/busca');
                }}
              >
                <Search size={17} />
                <span>Buscar conhecimento...</span>
                <kbd>↵</kbd>
              </button>
              <button
                className="icon-button theme-toggle"
                aria-label={
                  theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'
                }
                onClick={() =>
                  setTheme((t) => (t === 'light' ? 'dark' : 'light'))
                }
              >
                {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
              </button>
              <a
                className="github-top icon-button"
                aria-label="Repositório no GitHub"
                href="https://github.com/AirtonNettu/ai-engineering-academy-"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={19} />
              </a>
            </div>
          </header>
          <main id="conteudo" className="page-content" tabIndex={-1}>
            {children}
          </main>
          <footer className="footer">
            <Link to="/">IA Engineer Academy</Link>
            <span>Conhecimento aberto. Engenharia de verdade.</span>
            <Link to="/recursos">
              Fontes e recursos <ArrowUpRight size={14} />
            </Link>
          </footer>
        </div>
      </div>
    </>
  );
}
