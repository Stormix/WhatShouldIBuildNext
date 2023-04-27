/// <reference types="vitest" />

import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    alias: {
      '@/': fileURLToPath(new URL('./src/', import.meta.url))
    },
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  }
});
