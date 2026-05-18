// Stage — a single product stage (Alpha / Beta / Early GA). Each gets
// a chapter marker, a label, a date, a short prose narrative, an
// optional pullquote, and a metric table comparing both restaurants
// plus a combined column. Highlighted rows render with brass emphasis.

import React from 'react';
import Reveal from '../components/Reveal.jsx';

const Stage = ({ stage, isLast }) => (
  <section className={`cs-section cs-section--stage cs-stage cs-stage--${stage.slug}`}>
    <div className="cs-container">
      <Reveal className="cs-stage-head">
        <div className="cs-stage-head-text">
          <div className="cs-stage-label-row">
            <span className="cs-stage-label">{stage.label}</span>
            <span className="cs-stage-date">{stage.date}</span>
          </div>
          <div className="cs-stage-sub">{stage.sub}</div>
        </div>
        <div className="cs-stage-chapter">{stage.chapter}</div>
      </Reveal>

      <Reveal className="cs-stage-narrative">
        <p>{stage.narrative}</p>
      </Reveal>

      {stage.highlights && stage.highlights.length > 0 && (
        <Reveal className="cs-highlights" data-count={stage.highlights.length}>
          {stage.highlights.map((h, i) => (
            <div
              key={i}
              className="cs-highlight"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="cs-highlight-stat">{h.stat}</div>
              <div className="cs-highlight-label">{h.label}</div>
            </div>
          ))}
        </Reveal>
      )}

      {stage.pullquote && (
        <Reveal className="cs-pullquote">
          <p className="cs-pullquote-text">
            <span className="cs-pullquote-mark" aria-hidden="true">“</span>
            {stage.pullquote.text}
          </p>
          {stage.pullquote.attr && (
            <div className="cs-pullquote-attr">— {stage.pullquote.attr}</div>
          )}
        </Reveal>
      )}

      <Reveal className="cs-table-wrap">
        <table className="cs-table">
          <thead>
            <tr>
              <th />
              <th>Norma’s</th>
              <th>Mister Parker’s</th>
              <th className="cs-table-combined">Combined</th>
            </tr>
          </thead>
          <tbody>
            {stage.metrics.map((row) => (
              <tr key={row.k} className={row.highlight ? 'is-highlight' : ''}>
                <th scope="row">{row.k}</th>
                <td>{row.norma}</td>
                <td>{row.parker}</td>
                <td className="cs-table-combined">
                  {row.combined}
                  {row.delta && <span className="cs-table-delta">{row.delta}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </div>
    {!isLast && <div className="cs-stage-rule" aria-hidden="true" />}
  </section>
);

export default Stage;
