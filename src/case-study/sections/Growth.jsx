// Growth — dark feature section with the three-stage revenue bar
// chart. Bars animate in on scroll, values count up. Sits between the
// Beta stage and the Early GA stage as the visual punchline of the
// year-over-year story.

import React from 'react';
import BarChart from '../components/BarChart.jsx';
import Reveal from '../components/Reveal.jsx';

const fmtMoney = (n) => {
  if (n >= 1000) return '$' + Math.round(n / 1000) + 'K';
  return '$' + Math.round(n).toLocaleString();
};
const fmtMoneyFull = (n) =>
  '$' + Math.round(n).toLocaleString('en-US');

const Growth = ({ data }) => (
  <section className="cs-section cs-section--dark cs-section--growth">
    <div className="cs-container">
      <Reveal className="cs-section-head cs-section-head--centered">
        <div className="cs-eyebrow cs-eyebrow--on-dark">{data.eyebrow}</div>
        <h2 className="cs-h2 cs-h2--on-dark">{data.title}</h2>
        <p className="cs-section-intro cs-section-intro--on-dark">{data.sub}</p>
      </Reveal>

      <BarChart bars={data.bars} formatValue={fmtMoneyFull} />
    </div>
  </section>
);

export default Growth;
