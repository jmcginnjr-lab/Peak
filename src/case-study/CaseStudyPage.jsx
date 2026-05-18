// CaseStudyPage — orchestrates a single case-study's sections from
// data. The recipe is generic so adding a second case study is just a
// matter of dropping a new data file in /data and registering it in
// CASE_STUDIES below.
//
// URL routing:
//   /case-study              → DEFAULT_SLUG
//   /case-study/<slug>       → CASE_STUDIES[<slug>]
//   /case-study/<unknown>    → falls back to DEFAULT_SLUG
//
// There's no marketing-site nav — case studies are URL-only resources.

import React from 'react';
import Lenis from 'lenis';

import peakPilot from './data/peak-pilot.js';

import TopBar from './components/TopBar.jsx';
import Hero from './sections/Hero.jsx';
import Restaurants from './sections/Restaurants.jsx';
import Stage from './sections/Stage.jsx';
import Growth from './sections/Growth.jsx';
import Takeaways from './sections/Takeaways.jsx';
import Summary from './sections/Summary.jsx';
import Projections from './sections/Projections.jsx';
import Pancakes from './sections/Pancakes.jsx';
import CTA from './sections/CTA.jsx';

const CASE_STUDIES = {
  'peak-pilot': peakPilot,
};
const DEFAULT_SLUG = 'peak-pilot';

const useSlug = () => {
  // Read the last path segment after /case-study. Empty → default.
  const BASE = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  const path = window.location.pathname.replace(/\/+$/, '');
  const stripped = path.replace(`${BASE}/case-study`, '').replace(/^\/+/, '');
  return stripped || DEFAULT_SLUG;
};

const useSmoothScroll = () => {
  React.useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    let raf;
    const tick = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
};

const CaseStudyPage = () => {
  useSmoothScroll();
  const slug = useSlug();
  const data = CASE_STUDIES[slug] || CASE_STUDIES[DEFAULT_SLUG];

  // Three stages get rendered between Restaurants and Growth/Takeaways.
  // The Growth bar chart is interleaved after the Beta stage as the
  // visual punchline of the year-over-year gain.
  return (
    <main className="cs-root">
      <TopBar />
      <Hero data={data.hero} />
      <Restaurants data={data.restaurants} />
      <Stage stage={data.stages[0]} />
      <Stage stage={data.stages[1]} />
      <Growth data={data.growthChart} />
      <Stage stage={data.stages[2]} isLast />
      <Takeaways data={data.takeaways} />
      <Summary data={data.summary} />
      <Projections data={data.projections} />
      <Pancakes data={data.pancakes} />
      <CTA data={data.cta} />

      <footer className="cs-foot">
        <img
          src="/assets/logos/peak-logotype-new.svg"
          alt="Peak"
          className="cs-foot-logo"
        />
        <div className="cs-foot-fineprint">
          © 2026 Peak Hospitality Systems · North America
        </div>
      </footer>
    </main>
  );
};

export default CaseStudyPage;
