// Hero — full-bleed dark opener. Eyebrow, two-line editorial title with
// a serif accent on line 2, subtitle, and a long-form dek paragraph
// below. Scroll cue settles at the bottom-center as the curtain drop.

import React from 'react';

const Hero = ({ data }) => (
  <header className="cs-hero">
    <div className="cs-hero-inner">
      <div className="cs-hero-eyebrow">{data.eyebrow}</div>
      <h1 className="cs-hero-title">
        <span className="cs-hero-title-line">{data.title}</span>
        <span className="cs-hero-title-line cs-hero-title-accent">{data.titleAccent}</span>
      </h1>
      <div className="cs-hero-subtitle">{data.subtitle}</div>
      <p className="cs-hero-dek">{data.dek}</p>
    </div>
    <div className="cs-hero-cue" aria-hidden="true">
      <span className="cs-hero-cue-line" />
      <span className="cs-hero-cue-label">Continue</span>
    </div>
  </header>
);

export default Hero;
