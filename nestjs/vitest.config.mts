import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    globals: true,
    alias: {
      '@/*': './src/*',
      '@test': './test/*'
    },
    testTimeout: 100000,
    dir: './',
    root: './'
  },
  resolve: {
    alias: {
      '@/*': './src/*',
      '@test': './test/*'
    }
  },
  root: './',
  plugins: [swc.vite()]
})
