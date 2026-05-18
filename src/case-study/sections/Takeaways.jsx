// Takeaways — three editorial insights with oversized chapter numbers.
// Each one fades in independently as it scrolls into view. The bodies
// read like magazine paragraphs, not bullet points.

import React from 'react';
import Reveal from '../components/Reveal.jsx';

const Takeaways = ({ data }) => (
  <section className="cs-section cs-section--light cs-section--takeaways">
    <div className="cs-container">
      <Reveal className="cs-section-head">
        <div className="cs-eyebrow">{data.eyebrow}</div>
      </Reveal>

      <ol className="cs-takeaways">
        {data.items.map((t, i) => (
          <Reveal key={t.num} as="li" className="cs-takeaway" delay={i * 100}>
            <div className="cs-takeaway-num">{t.num}</div>
            <div className="cs-takeaway-body">
              <h3 className="cs-takeaway-head">{t.head}</h3>
              <p className="cs-takeaway-text">{t.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  </section>
);

export default Takeaways;
