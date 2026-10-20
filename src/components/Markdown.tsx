import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { Children, isValidElement, type ReactNode } from 'react';
import { CodeBlock } from './CodeBlock';
import { slug } from '../lib/slug';
function plain(node: ReactNode): string {
  return Children.toArray(node)
    .map((n) =>
      isValidElement<{ children?: ReactNode }>(n)
        ? plain(n.props.children)
        : String(n),
    )
    .join('');
}
export function Markdown({ source }: { source: string }) {
  return (
    <ReactMarkdown
      skipHtml
      disallowedElements={['img']}
      components={{
        h2: ({ children }) => <h2 id={slug(plain(children))}>{children}</h2>,
        h3: ({ children }) => <h3 id={slug(plain(children))}>{children}</h3>,
        a: ({ href, children }) =>
          href?.startsWith('/') ? (
            <Link to={href}>{children}</Link>
          ) : (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        pre: ({ children }) => <>{children}</>,
        code: ({ className, children }) =>
          className || String(children).includes('\n') ? (
            <CodeBlock
              code={String(children).replace(/\n$/, '')}
              language={className?.replace('language-', '')}
            />
          ) : (
            <code className="inline-code">{children}</code>
          ),
      }}
    >
      {source}
    </ReactMarkdown>
  );
}
