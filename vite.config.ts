import { defineConfig } from 'vitest/config';

// BASE_PATH is set by the GitHub Pages workflow (e.g. "/Simon/"); locally the site runs at "/".
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
