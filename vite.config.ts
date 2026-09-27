import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Relative Pfade: läuft auf GitHub Pages (Unterordner) und als ZIP vom Schulserver.
  base: './',
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 2000,
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
