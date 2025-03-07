import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    alias: {
      '@/*': './apps/*/src',
      '@test': './apps/*/test'
    },
    root: './',
    testTimeout: 60000,
    cache: false,
    fileParallelism: false,
    bail: 1
  },
  resolve: {
    alias: {
      '@/*': './apps/*/src',
      '@test': './apps/*/test'
    }
  },
  plugins: [swc.vite()]
})
