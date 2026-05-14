// Seats — five floor-plan archetypes shown alongside the hero copy.
//
// Each plan is a realistic SVG floor plan rendered in brass. SVGs are
// imported as raw strings via Vite's ?raw query so we can manipulate
// the markup at mount time: a random ~22% of the non-envelope shapes
// (seats, tables, beds, rooms) are tagged `class="hi"` for the bright
// gold highlight. The rest sit at a softer brass level just brighter
// than the outer-envelope strokes — reads as "some tables booked, the
// rest open" rather than a fully painted floor plan.
//
// Reveal is opacity-driven by `--seat-progress` on the parent (0..1
// from scroll). Same hook the dot-matrix used.
//
// The figure order — Airplane, Theater, Restaurant, Arena, Hotel — is
// load-bearing for the CSS (`:nth-child` positions Restaurant centre,
// translates Theater/Arena inward, hides Airplane/Hotel on phones).

import React from 'react';

import airplaneRaw from './floorplans/airplane.svg?raw';
import theaterRaw from './floorplans/theater.svg?raw';
import restaurantRaw from './floorplans/restaurant.svg?raw';
import arenaRaw from './floorplans/arena.svg?raw';
import hotelRaw from './floorplans/hotel.svg?raw';

const PLANS = [
  { label: 'Airplane',   raw: airplaneRaw,   highlightFraction: 0.18 },
  { label: 'Theater',    raw: theaterRaw,    highlightFraction: 0.20 },
  { label: 'Restaurant', raw: restaurantRaw, highlightFraction: 0.18 },
  { label: 'Arena',      raw: arenaRaw,      highlightFraction: 0.22 },
  { label: 'Hotel',      raw: hotelRaw,      highlightFraction: 0.22 },
];

// Tag a random subset of the SVG's <path> / <circle> shapes with
// `class="hi"` plus an inline `--hi-threshold` between 0.5 and 0.85.
// CSS reads the threshold against the global `--seat-progress` to fade
// each shape from the neutral brass up to bright gold at staggered
// moments — reads as people choosing tables/seats organically rather
// than a single flash.
//
// Shapes carrying `stroke-opacity` (the outer envelopes — fuselage
// curve, arena ring, hotel/restaurant building outline, theater stage
// rail) are skipped so the envelope always sits as quiet context.
const highlightShapes = (raw, fraction) => {
  const tagRegex = /<(path|circle)\b[^>]*?\/>/g;
  const matches = [];
  let m;
  while ((m = tagRegex.exec(raw)) !== null) {
    matches.push({
      tag: m[0],
      start: m.index,
      end: m.index + m[0].length,
      tagName: m[1],
      isEnvelope: /stroke-opacity/.test(m[0]),
    });
  }
  const candidates = matches.filter((x) => !x.isEnvelope);
  const target = Math.max(1, Math.round(candidates.length * fraction));
  // Shuffle and pick `target`. Math.random is fine — selection is stable
  // for the component's lifetime via useMemo.
  const picked = [...candidates]
    .sort(() => Math.random() - 0.5)
    .slice(0, target);
  const picks = new Set(picked.map((p) => p.start));

  let out = '';
  let cursor = 0;
  for (const m2 of matches) {
    out += raw.slice(cursor, m2.start);
    if (picks.has(m2.start)) {
      // Threshold in [0.5, 0.85]: each highlighted shape starts as
      // neutral and ramps to gold once scroll progress passes its own
      // threshold. The spread + randomness gives the organic feel.
      const threshold = (0.5 + Math.random() * 0.35).toFixed(3);
      out += m2.tag.replace(
        `<${m2.tagName}`,
        `<${m2.tagName} class="hi" style="--hi-threshold:${threshold}"`
      );
    } else {
      out += m2.tag;
    }
    cursor = m2.end;
  }
  out += raw.slice(cursor);
  return out;
};

const Seats = ({ stage = 0, showRestaurant = false }) => {
  // Random selection stable for the component's lifetime.
  const processed = React.useMemo(
    () => PLANS.map((p) => ({ ...p, svg: highlightShapes(p.raw, p.highlightFraction) })),
    []
  );

  return (
    <section
      className="mk-seats"
      data-stage={stage}
      data-show-restaurant={showRestaurant ? 'true' : 'false'}
    >
      <div className="mk-seats-inner">
        <div className="mk-seats-mark" aria-hidden="true">
          <img src={`${import.meta.env.BASE_URL}assets/logos/peak-mark-gold.svg`} alt="" />
        </div>
        <h2 className="mk-seats-h">Unlock the value of your seats.</h2>
        <p className="mk-seats-sub">
          Airlines, theaters, hotels, and venues price demand by time and
          location. Peak brings that same model to restaurants — simply and
          natively.
        </p>
        <div className="mk-seats-row">
          {processed.map(({ label, svg }) => {
            const isRest = label === 'Restaurant';
            return (
              <figure
                className={`plan-figure ${isRest ? 'plan-figure--restaurant' : ''}`}
                key={label}
              >
                <div
                  className="plan-svg"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
                <figcaption className="plan-label">{label}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Seats;
