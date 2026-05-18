import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'

// Route dispatch based on URL path. Three entry points:
//   /              → marketing site
//   /calculator    → internal sales tool (URL-only, no link from marketing)
//   /case-study/*  → long-form editorial case studies (URL-only)
// Each entry lazily imports its own bundle + CSS so marketing visitors
// never download the calculator or case-study code and vice versa.
//
// BASE_URL respects Vite's `base` config so /calculator and /case-study
// work the same way under a project-page deploy.
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');
const path = window.location.pathname.replace(/\/+$/, '');
const isCalculatorPath = path === `${BASE}/calculator`;
const isCaseStudyPath  = path === `${BASE}/case-study` || path.startsWith(`${BASE}/case-study/`);

const MarketingApp  = lazy(() => import('./marketing/MarketingApp.jsx'));
const CalculatorApp = lazy(() => import('./calculator/CalculatorApp.jsx'));
const CaseStudyApp  = lazy(() => import('./case-study/CaseStudyApp.jsx'));

const App = isCalculatorPath ? CalculatorApp
          : isCaseStudyPath  ? CaseStudyApp
          : MarketingApp;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </StrictMode>,
)
