// Projections — the "money on the table, compounded" section. Two
// scenarios with year×rate grids, an intro/closer pair of paragraphs,
// and a legend explaining what each return rate represents.

import React from 'react';
import Reveal from '../components/Reveal.jsx';

const Projections = ({ data }) => (
  <section className="cs-section cs-section--light cs-section--projections">
    <div className="cs-container">
      <Reveal className="cs-section-head">
        <div className="cs-eyebrow">{data.eyebrow}</div>
        <h2 className="cs-h2">{data.title}</h2>
        <p className="cs-section-intro">{data.intro}</p>
      </Reveal>

      <div className="cs-scenarios">
        {data.scenarios.map((s, idx) => {
          const rates = Object.keys(s.years[0].rates);
          return (
            <Reveal key={s.label} className="cs-scenario" delay={idx * 120}>
              <div className="cs-scenario-head">
                <div className="cs-scenario-label">{s.label}</div>
                <div className="cs-scenario-sub">{s.sub}</div>
                <div className="cs-scenario-note">{s.note}</div>
              </div>
              <table className="cs-projection-table">
                <thead>
                  <tr>
                    <th />
                    {rates.map((r) => (
                      <th key={r}>{r}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.years.map((y) => (
                    <tr key={y.y}>
                      <th scope="row">{y.y}</th>
                      {rates.map((r) => (
                        <td key={r}>{y.rates[r]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="cs-projection-closer">
        <p>{data.closer}</p>
      </Reveal>

      <Reveal className="cs-legend">
        {data.legend.map((l) => (
          <div key={l.rate} className="cs-legend-row">
            <span className="cs-legend-rate">{l.rate}</span>
            <span className="cs-legend-label">{l.label}</span>
            <span className="cs-legend-doubles">{l.doubles}</span>
          </div>
        ))}
      </Reveal>
    </div>
  </section>
);

export default Projections;
