import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: [
        'src/labs/neural.ts',
        'src/labs/attention.ts',
        'src/labs/embeddings.ts',
        'src/learning/model.ts',
        'src/learning/scheduler.ts',
      ],
      reporter: ['text', 'json-summary', 'lcov'],
      thresholds: {
        perFile: true,
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
    },
  },
});
