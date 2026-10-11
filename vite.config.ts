import { defineConfig } from 'vite';

// Source lives in web/. The build lands in dist/, and scripts/postbuild.mjs publishes it to the
// repo root, which is what GitHub Pages serves (main branch, / folder).
export default defineConfig({
  root: 'web',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'es2020',
    chunkSizeWarningLimit: 900,
    cssCodeSplit: false,
    modulePreload: { polyfill: false },
    assetsInlineLimit: 0,
  },
});
