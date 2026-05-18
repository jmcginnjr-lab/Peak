// Summary — full at-a-glance table of all three stages side-by-side.
// Sits on dark so the metric grid reads with brass accents.

import React from 'react';
import Reveal from '../components/Reveal.jsx';

const Summary = ({ data }) => (
  <section className="cs-section cs-section--dark cs-section--summary">
    <div className="cs-container">
      <Reveal className="cs-section-head cs-section-head--centered">
        <div className="cs-eyebrow cs-eyebrow--on-dark">{data.eyebrow}</div>
        <h2 className="cs-h2 cs-h2--on-dark">{data.title}</h2>
      </Reveal>

      <Reveal className="cs-table-wrap cs-table-wrap--summary">
        <table className="cs-table cs-table--on-dark">
          <thead>
            <tr>
              {data.columns.map((c, i) => (
                <th key={i} className={i === 0 ? '' : 'cs-table-num-col'}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.k} className={r.highlight ? 'is-highlight' : ''}>
                <th scope="row">{r.k}</th>
                {r.v.map((v, i) => (
                  <td key={i} className="cs-table-num-col">{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </div>
  </section>
);

export default Summary;
