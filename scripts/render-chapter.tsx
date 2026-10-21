import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import { Children, isValidElement, type ReactNode } from 'react';
import type { catalog } from '../src/lib/content';
import { slug } from '../src/lib/slug';
type Chapter = (typeof catalog.chapters)[number];
function text(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) =>
      isValidElement<{ children?: ReactNode }>(child)
        ? text(child.props.children)
        : String(child),
    )
    .join('');
}
/** Build-only reading fallback. React replaces this root when JavaScript runs. */
export function renderStaticChapter(
  chapter: Chapter,
  markdown: string,
): string {
  return renderToStaticMarkup(
    <main
      className="static-reading"
      id="conteudo"
      data-static-chapter={chapter.id}
    >
      <nav aria-label="Navegação do artigo">
        <a href="/">IA Engineer Academy</a> ·{' '}
        <a href="/biblioteca">Biblioteca</a>
      </nav>
      <header className="reader-header">
        <h1>{chapter.title}</h1>
        <p>{chapter.description}</p>
        <p>
          Revisão: {chapter.reviewedAt} · {chapter.minutes} min
        </p>
      </header>
      <article className="prose">
        <ReactMarkdown
          skipHtml
          disallowedElements={['img']}
          components={{
            h2: ({ children }) => <h2 id={slug(text(children))}>{children}</h2>,
            h3: ({ children }) => <h3 id={slug(text(children))}>{children}</h3>,
            a: ({ href, children }) => (
              <a
                href={href}
                rel={
                  href?.startsWith('https:') ? 'noopener noreferrer' : undefined
                }
              >
                {children}
              </a>
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </article>
      <section className="reader-references" id="referencias">
        <h2>Referências</h2>
        <ul>
          {chapter.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} rel="noopener noreferrer">
                {source.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <p>
        A leitura está disponível sem JavaScript. Diagramas, busca, realce e
        dados de estudo precisam de JavaScript.
      </p>
    </main>,
  );
}
