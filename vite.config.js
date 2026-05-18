import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Tiny dev-server middleware: the Peak Ledger design prototype lives at
// public/ledger/ as a static tree (Babel-in-browser HTML, not part of the
// Vite SPA). Without this, a request to /ledger/ falls through Vite's
// HTML middleware and gets the SPA's root index.html back instead of the
// prototype's index.html. Rewriting the URL before subsequent middlewares
// see it lets sirv serve the public file directly.
const serveLedgerDir = {
  name: 'serve-ledger-dir',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === '/ledger' || req.url === '/ledger/') {
        req.url = '/ledger/index.html';
      }
      next();
    });
  },
};

// https://vite.dev/config/
//
// `base` defaults to '/' (custom domain or username.github.io). For a
// GitHub Pages PROJECT page (username.github.io/repo-name/), set the
// BASE_PATH env var to '/repo-name/' before building, e.g.
//   BASE_PATH=/peak/ npm run build:gh-pages
// All asset URLs and the SPA route check (src/main.jsx) honor this.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react(), serveLedgerDir],
})
