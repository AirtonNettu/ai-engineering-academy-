import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import catalog from '../../content/catalog.json';

const read = (id: string) => readFileSync(`content/chapters/${id}.md`, 'utf8');
describe('cobertura editorial avançada', () => {
  it('preserva capítulos e oferece três camadas reais com implementação', () => {
    expect(catalog.chapters.length).toBeGreaterThanOrEqual(15);
    for (const id of [
      'http-apis',
      'python-backend',
      'llm-inferencia',
      'rag',
      'ollama-fastapi',
      'seguranca-avaliacao',
    ]) {
      expect(catalog.chapters.some((chapter) => chapter.id === id)).toBe(true);
    }
    for (const chapter of catalog.chapters) {
      expect(chapter.depths.map((depth) => depth.id)).toEqual([
        'fundamental',
        'intermediario',
        'avancado',
      ]);
      const body = read(chapter.id);
      for (const title of [
        'Fundamentação',
        'Funcionamento intermediário',
        'Análise avançada',
      ])
        expect(body).toContain(`## ${title}`);
      expect(chapter.implementation.url).toMatch(
        /^\/(laboratorios|projetos)\//,
      );
      expect(body.split(/\s+/).length).toBeGreaterThan(700);
    }
  });
  it('oferece cartões editoriais contextualizados e fontes HTTPS', () => {
    const cards = JSON.parse(
      readFileSync('content/flashcards.json', 'utf8'),
    ) as {
      id: string;
      chapterId: string;
      sourceUrl: string;
      difficulty: string;
      front: string;
      back: string;
      reviewedAt: string;
    }[];
    expect(new Set(cards.map((card) => card.id)).size).toBe(cards.length);
    for (const chapter of catalog.chapters) {
      const group = cards.filter((card) => card.chapterId === chapter.id);
      expect(group.length).toBeGreaterThanOrEqual(3);
      expect(new Set(group.map((card) => card.difficulty)).size).toBe(3);
      for (const card of group) {
        expect(card.sourceUrl).toMatch(/^https:\/\//);
        expect(card.reviewedAt).toBe('2026-10-20');
        expect(card.front.length).toBeGreaterThan(20);
        expect(card.back.length).toBeGreaterThan(60);
      }
    }
  });
  it('liga quatro especialidades a competências contextualizadas', () => {
    expect(catalog.roadmaps.map((roadmap) => roadmap.id)).toEqual([
      'application',
      'operations',
      'models',
      'research',
    ]);
    for (const roadmap of catalog.roadmaps) {
      expect(roadmap.levels.map((level) => level.id)).toEqual([
        'junior',
        'pleno',
        'senior',
      ]);
      for (const level of roadmap.levels) {
        for (const field of [
          'prerequisites',
          'responsibilities',
          'deliverables',
          'chapters',
          'labs',
        ] as const)
          expect(level[field].length).toBeGreaterThan(0);
        for (const id of level.chapters)
          expect(catalog.chapters.some((chapter) => chapter.id === id)).toBe(
            true,
          );
      }
      for (const step of roadmap.steps)
        expect(step.chapters.length).toBeGreaterThan(0);
    }
    expect(catalog.diagrams.some((diagram) => diagram.id === 'agents')).toBe(
      true,
    );
  });
});

// Exercise the public selection controls and existing etapa query together.
import { createElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach } from 'vitest';
import Roadmaps from '../pages/Roadmaps';
afterEach(cleanup);

describe('roadmaps por contexto profissional', () => {
  it('seleciona senioridade sem perder a competência escolhida por URL', async () => {
    render(
      createElement(
        MemoryRouter,
        { initialEntries: ['/trilhas?trilha=application&etapa=2'] },
        createElement(Roadmaps),
      ),
    );
    expect(
      screen.getByRole('heading', { name: 'RAG e conhecimento' }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /^Sênior$/ }));
    expect(
      screen.getByRole('heading', { name: 'AI Application Engineer · Sênior' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'RAG e conhecimento' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Plano de rollout, rollback e responsabilidade operacional',
      ),
    ).toBeInTheDocument();
  });
  it('oferece pesquisa com entregáveis e laboratórios funcionais', async () => {
    render(createElement(MemoryRouter, null, createElement(Roadmaps)));
    await userEvent.click(
      screen.getByRole('button', { name: /AI Research Engineer/ }),
    );
    expect(
      screen.getByRole('heading', { name: 'AI Research Engineer · Júnior' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Reprodução local de operação matemática'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Laboratório: Attention Explorer' }),
    ).toHaveAttribute('href', '/laboratorios/attention');
  });
});
