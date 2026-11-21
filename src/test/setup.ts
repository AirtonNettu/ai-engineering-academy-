import '@testing-library/jest-dom/vitest';
import { cleanup, configure } from '@testing-library/react';
import { afterEach } from 'vitest';

configure({ asyncUtilTimeout: 10000 });

afterEach(() => {
  cleanup();
  localStorage.clear();
});

Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true });
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: () => {},
  writable: true,
});
