// Pancakes — the fun visual translation of revenue into pancakes and
// Range Rovers. A row of comparison cards up top, then a stack of
// pancake icons (one per ~100 orders) so the scale is hold-in-your-
// hand legible.

import React from 'react';
import Reveal from '../components/Reveal.jsx';
import CountUp from '../components/CountUp.jsx';

// Simple pancake "stack" glyph — three discs piled with a pat of
// butter. Drawn inline so it inherits color from CSS.
const PancakeGlyph = () => (
  <svg className="cs-pancake-glyph" viewBox="0 0 32 22" aria-hidden="true">
    <ellipse cx="16" cy="17" rx="14" ry="3.5" />
    <ellipse cx="16" cy="13" rx="13" ry="3.5" />
    <ellipse cx="16" cy="9"  rx="12" ry="3.5" />
    <rect x="13" y="3" width="6" height="4" rx="0.6" className="cs-pancake-butter" />
  </svg>
);

// Render up to `cap` glyphs so very large numbers don't break the
// layout. Scale = how many actual orders each glyph represents.
const PancakeRow = ({ count, scale = 100, cap = 200 }) => {
  const dots = Math.min(cap, Math.round(count / scale));
  return (
    <div className="cs-pancake-row" aria-hidden="true">
      {Array.from({ length: dots }).map((_, i) => (
        <PancakeGlyph key={i} />
      ))}
    </div>
  );
};

const Pancakes = ({ data }) => (
  <section className="cs-section cs-section--light cs-section--pancakes">
    <div className="cs-container">
      <Reveal className="cs-section-head">
        <div className="cs-eyebrow">{data.eyebrow}</div>
        <h2 className="cs-h2">{data.title}</h2>
        <p className="cs-section-intro">{data.intro}</p>
      </Reveal>

      <div className="cs-pancake-cards">
        {data.rows.map((r, i) => (
          <Reveal
            key={r.y}
            className={`cs-pancake-card ${r.highlight ? 'is-highlight' : ''}`}
            delay={i * 120}
          >
            <div className="cs-pancake-card-y">{r.y}</div>
            <div className="cs-pancake-card-gross">{r.gross}</div>
            <div className="cs-pancake-card-stat">
              <CountUp value={r.pancakes} duration={1600} />
              <span className="cs-pancake-card-unit">pancakes</span>
            </div>
            <div className="cs-pancake-card-stat cs-pancake-card-stat--sub">
              <CountUp value={r.rovers} duration={1400} />
              <span className="cs-pancake-card-unit">Range Rovers full</span>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Visual translation of the largest figure. */}
      <Reveal className="cs-pancake-visual">
        <div className="cs-pancake-visual-h">
          All three stages, in plates of pancakes
        </div>
        <PancakeRow count={data.rows[data.rows.length - 1].pancakes} />
        <div className="cs-pancake-visual-foot">{data.footnote}</div>
      </Reveal>
    </div>
  </section>
);

export default Pancakes;
