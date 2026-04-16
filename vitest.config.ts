import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  oxc: {
    jsx: {
      runtime: 'automatic',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'scripts/**/*.test.ts'],
    setupFiles: ['./src/tests/vitest-setup.ts'],
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      utils: path.resolve(__dirname, 'src/utils'),
      components: path.resolve(__dirname, 'src/components'),
      styles: path.resolve(__dirname, 'src/styles'),
      types: path.resolve(__dirname, 'src/types'),
      messages: path.resolve(__dirname, 'src/messages'),
    },
  },
})
