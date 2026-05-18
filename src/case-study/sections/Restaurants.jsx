// Restaurants — two pilot venues introduced side-by-side. Editorial
// layout: an eyebrow + section title above, then a two-column card
// row. Each card has a name, location, format, three labelled stats,
// and a short prose blurb.

import React from 'react';
import Reveal from '../components/Reveal.jsx';

const Restaurants = ({ data }) => (
  <section className="cs-section cs-section--light cs-section--restaurants">
    <div className="cs-container">
      <Reveal className="cs-section-head">
        <div className="cs-eyebrow">{data.eyebrow}</div>
        <h2 className="cs-h2">{data.title}</h2>
        <p className="cs-section-intro">{data.intro}</p>
      </Reveal>

      <div className="cs-venues">
        {data.venues.map((v, i) => (
          <Reveal key={v.name} className="cs-venue" delay={i * 120}>
            <div className="cs-venue-head">
              <h3 className="cs-venue-name">{v.name}</h3>
              <div className="cs-venue-meta">
                <span>{v.location}</span>
                <span className="cs-dot">·</span>
                <span>{v.format}</span>
              </div>
            </div>
            <dl className="cs-venue-stats">
              {v.stats.map((s) => (
                <div key={s.k} className="cs-venue-stat">
                  <dt>{s.k}</dt>
                  <dd>{s.v}</dd>
                </div>
              ))}
            </dl>
            <p className="cs-venue-blurb">{v.blurb}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Restaurants;
