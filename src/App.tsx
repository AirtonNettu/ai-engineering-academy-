import { LearningProvider } from './learning/LearningProvider';
import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { Layout } from './components/Layout';
const Study = lazy(() => import('./pages/Study'));
const Flashcards = lazy(() => import('./pages/Flashcards'));
const LearningData = lazy(() => import('./pages/LearningData'));
const Labs = lazy(() => import('./pages/Labs'));
const Home = lazy(() => import('./pages/Home'));
const Library = lazy(() => import('./pages/Library'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const ChapterPage = lazy(() => import('./pages/ChapterPage'));
const Architectures = lazy(() => import('./pages/Architectures'));
const ProjectPage = lazy(() => import('./pages/ProjectPage'));
const Roadmaps = lazy(() => import('./pages/Roadmaps'));
const Resources = lazy(() => import('./pages/Resources'));
const Glossary = lazy(() => import('./pages/Glossary'));
import { chapterById } from './lib/content';
export default function App() {
  const location = useLocation();
  useEffect(() => {
    const routeTitles: Record<string, string> = {
      '/': 'Engenharia de IA, em profundidade',
      '/biblioteca': 'Biblioteca',
      '/busca': 'Busca',
      '/trilhas': 'Trilhas profissionais',
      '/arquiteturas': 'Arquiteturas interativas',
      '/projetos/fastapi-ollama': 'Explorador de código',
      '/recursos': 'Skills e recursos',
      '/glossario': 'Glossário',
      '/flashcards': 'Flashcards e revisão espaçada',
      '/meus-dados': 'Dados de estudo',
      '/laboratorios': 'Laboratórios interativos',
      '/laboratorios/neural-network': 'Neural Network Training Lab',
      '/laboratorios/attention': 'Attention Explorer',
      '/laboratorios/embeddings': 'Embedding Explorer',
    };
    const chapter =
      location.pathname.startsWith('/capitulos/') ||
      location.pathname.startsWith('/estudar/')
        ? chapterById(location.pathname.split('/')[2])
        : undefined;
    document.title = `${(chapter && location.pathname.startsWith('/estudar/') ? `Estudar: ${chapter.title}` : chapter?.title) || routeTitles[location.pathname] || 'Página não encontrada'} — IA Engineer Academy`;
  }, [location.pathname, location.hash]);
  return (
    <LearningProvider>
      <Layout>
        <Suspense fallback={<p role="status">Carregando conteúdo…</p>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/estudar/:id"
              element={<Study key={location.pathname} />}
            />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/meus-dados" element={<LearningData />} />
            <Route path="/laboratorios" element={<Labs />} />
            <Route
              path="/laboratorios/:labId"
              element={<Labs key={location.pathname} />}
            />
            <Route path="/biblioteca" element={<Library />} />
            <Route path="/busca" element={<SearchPage />} />
            <Route
              path="/capitulos/:id"
              element={<ChapterPage key={location.pathname} />}
            />
            <Route path="/arquiteturas" element={<Architectures />} />
            <Route path="/projetos/fastapi-ollama" element={<ProjectPage />} />
            <Route path="/trilhas" element={<Roadmaps />} />
            <Route path="/recursos" element={<Resources />} />
            <Route path="/glossario" element={<Glossary />} />
            <Route
              path="*"
              element={
                <section className="empty">
                  <span className="eyebrow green">404</span>
                  <h1>Página não encontrada</h1>
                  <p>Este endereço não corresponde a um conteúdo publicado.</p>
                  <Link className="button primary" to="/biblioteca">
                    Voltar para a biblioteca
                  </Link>
                </section>
              }
            />
          </Routes>
        </Suspense>
      </Layout>
    </LearningProvider>
  );
}
