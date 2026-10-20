import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock3, BookOpen } from 'lucide-react';
import { catalog, chapterUrl, type Chapter } from '../lib/content';
export function ChapterCard({
  chapter,
  index = 0,
  read = false,
}: {
  chapter: Chapter;
  index?: number;
  read?: boolean;
}) {
  const area = catalog.areas.find((a) => a.id === chapter.category)!;
  return (
    <Link className="chapter-card" to={chapterUrl(chapter.id)}>
      <div className="card-top">
        <span className={`topic-icon area-${chapter.category}`}>
          <BookOpen size={20} />
        </span>
        <span className="eyebrow">{area.title}</span>
        <ArrowUpRight className="card-arrow" size={18} />
      </div>
      <div className="chapter-number">
        CAPÍTULO {String(index + 1).padStart(2, '0')}
      </div>
      <h3>{chapter.title}</h3>
      <p>{chapter.description}</p>
      <div className="card-bottom">
        <span>
          <Clock3 size={14} /> {chapter.minutes} min de leitura
        </span>
        <span>{read ? '✓ Lido' : 'Ler capítulo →'}</span>
      </div>
    </Link>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-intro">
      <span className="eyebrow green">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
export function Empty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="empty">
      <BookOpen size={30} />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
