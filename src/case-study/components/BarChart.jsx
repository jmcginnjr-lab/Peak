// SVG bar chart with scroll-triggered animation. Bars rise from 0 to
// their value over ~1s when the chart first scrolls into view. Each bar
// label sits below; the value floats above (count-up). Designed for
// the case-study Growth section — three bars, but works for any small
// set.

import React from 'react';
import CountUp from './CountUp.jsx';

const BarChart = ({ bars, formatValue }) => {
  const ref = React.useRef(null);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const max = Math.max(...bars.map((b) => b.value));
  // Round up to a tidy ceiling so the y-axis breathes.
  const ceiling = Math.ceil(max / 25000) * 25000;

  return (
    <div ref={ref} className={`cs-bars ${active ? 'is-in' : ''}`}>
      <div className="cs-bars-track">
        {/* Tidy gridlines at quartiles of the ceiling. */}
        {[0.25, 0.5, 0.75, 1].map((p) => (
          <div
            key={p}
            className="cs-bars-grid"
            style={{ bottom: `${p * 100}%` }}
          >
            <span className="cs-bars-grid-label">
              {formatValue ? formatValue(ceiling * p) : (ceiling * p).toLocaleString()}
            </span>
          </div>
        ))}
        <div className="cs-bars-row">
          {bars.map((b, i) => {
            const h = (b.value / ceiling) * 100;
            return (
              <div
                key={b.label}
                className={`cs-bars-col ${b.partial ? 'is-partial' : ''}`}
              >
                <div className="cs-bars-bar-wrap">
                  <div
                    className="cs-bars-bar"
                    style={{
                      height: active ? `${h}%` : '0%',
                      transitionDelay: `${200 + i * 140}ms`,
                    }}
                  />
                  <div
                    className="cs-bars-value"
                    style={{
                      bottom: active ? `calc(${h}% + 12px)` : '0%',
                      transitionDelay: `${260 + i * 140}ms`,
                      opacity: active ? 1 : 0,
                    }}
                  >
                    {active ? (
                      <CountUp
                        value={b.value}
                        duration={1100}
                        format={formatValue}
                      />
                    ) : null}
                  </div>
                </div>
                <div className="cs-bars-label">
                  <div className="cs-bars-label-main">{b.label}</div>
                  {b.sub && <div className="cs-bars-label-sub">{b.sub}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BarChart;
