// ScrollScenes.jsx
// Five isolated, animated UI scenes used inside the marketing StackCards.
// Each receives `progress` (0..1, scroll-tied within the card) and `active` (bool).
// The scenes are NOT interactive — they perform themselves so the user
// can sit back and watch the product tour while scrolling.
//
// Convention:
//   progress 0.00–0.20  setup (idle)
//   progress 0.20–0.80  hero animation (scrubs)
//   progress 0.80–1.00  resolution (settled)
// Idle micro-motion (cursor pulse, badge tick) loops independently.

import React from 'react';
const { useState: useStateSC, useEffect: useEffectSC, useMemo: useMemoSC, useRef: useRefSC } = React;

// ─── Scene 1: The problem ──────────────────────────────────────────────────
// Marketplace listing — Peak's restaurant ("Aurelia") sits in a list with
// competitors. Discount badges flash, a guest's cursor hovers another spot.
// As scroll progresses, Aurelia's row dims and the cursor moves AWAY.
// ─── Scene 1: Marketplace (the problem) ────────────────────────────────────
// Aurelia's listing sinks down the algorithmic ranking as discount-paying
// competitors get promoted above it. A commission-stolen counter ticks up.
// At the end, the cursor clicks a competitor and a "booked elsewhere" pulse.
export function SceneMarketplace({ progress }) {
  // The story: Aurelia starts as the top match for tonight. Then sponsored
  // listings appear above it one by one, pushing it further down the list.
  // By the end, three paid placements sit on top of the actual best match.
  //
  // Each promoted row has an `appearAt` threshold. When progress crosses it,
  // the row's max-height transitions from 0 → full, smoothly pushing rows
  // below (including Aurelia) downward. No reordering, no JS layout math.

  const promoted = [
    { id: 'p1', name: 'Bistro Lumina',   cuisine: 'Italian',   rating: 4.6, deal: '20% off',    appearAt: 0.18 },
    { id: 'p2', name: 'House of Embers', cuisine: 'Steak',     rating: 4.5, deal: 'Last 2',     appearAt: 0.40 },
    { id: 'p3', name: 'Anomaly',         cuisine: 'Asian',     rating: 4.3, deal: '15% off',    appearAt: 0.62 },
  ];

  const aureliaDim   = progress > 0.84;
  const overlayShown = progress > 0.74;

  // Sort label flips from "Highly rated" → "Best deals" right before the
  // first sponsored result appears.
  const sortFlipped = progress > 0.10;

  return (
    <div className="sc sc-mkt2">
      {/* Skeleton chrome — just enough to read as "a marketplace listing UI" */}
      <div className="sc-mkt2-brand">
        <span className="sc-mkt2-brand-mark" aria-hidden="true"></span>
        <span className="sc-mkt2-skel sc-mkt2-skel-meta"></span>
      </div>
      <div className="sc-mkt2-bar-skel">
        <span className="sc-mkt2-skel sc-mkt2-skel-search"></span>
        <span className="sc-mkt2-skel sc-mkt2-skel-sort"></span>
      </div>

      <div className="sc-mkt2-list">
        {promoted.map(r => {
          const appeared = progress >= r.appearAt;
          return (
            <div key={r.id} className={`sc-mkt2-row sc-mkt2-promoted ${appeared ? 'is-in' : ''}`}>
              <div className="sc-mkt2-thumb" data-letter={r.name[0]}>{r.name[0]}</div>
              <div className="sc-mkt2-info">
                <div className="sc-mkt2-row-top">
                  <span className="sc-mkt2-name">{r.name}</span>
                  <span className="sc-mkt2-tag">Sponsored</span>
                </div>
                <div className="sc-mkt2-sub">
                  <span>★ {r.rating}</span>
                  <span className="sc-mkt2-dot">·</span>
                  <span>{r.cuisine}</span>
                  <span className="sc-mkt2-dot">·</span>
                  <span>$$$</span>
                </div>
              </div>
              <div className="sc-mkt2-deal">{r.deal}</div>
            </div>
          );
        })}

        {/* Aurelia — skeleton row with just a "Your listing" chip so the user
            understands their position is buried below the paid placements. */}
        <div className="sc-mkt2-row sc-mkt2-aurelia-skel">
          <div className="sc-mkt2-thumb is-aur">A</div>
          <div className="sc-mkt2-info">
            <div className="sc-mkt2-row-top">
              <span className="sc-mkt2-skel sc-mkt2-skel-name"></span>
              <span className="sc-mkt2-tag is-you">Your listing</span>
            </div>
            <span className="sc-mkt2-skel sc-mkt2-skel-sub"></span>
          </div>
        </div>

        {/* One quieter row to imply the list continues. */}
        <div className="sc-mkt2-row sc-mkt2-skel-row">
          <span className="sc-mkt2-skel sc-mkt2-skel-thumb"></span>
          <div className="sc-mkt2-info">
            <span className="sc-mkt2-skel sc-mkt2-skel-name"></span>
            <span className="sc-mkt2-skel sc-mkt2-skel-sub"></span>
          </div>
        </div>
      </div>

      {/* Diagnostic overlay — shows up at the end, the punchline. */}
      <div className={`sc-mkt2-overlay ${overlayShown ? 'is-in' : ''}`}>
        <div className="sc-mkt2-overlay-l">Paid placements above your listing</div>
        <div className="sc-mkt2-overlay-row">
          <span className="sc-mkt2-overlay-num">3</span>
          <span className="sc-mkt2-overlay-rule" />
          <span className="sc-mkt2-overlay-cost">$8.50<i>/cover</i> + 7% <i>gross</i></span>
        </div>
      </div>
    </div>
  );
}

// ─── Scene 2: Booking ───────────────────────────────────────────────────────
// Direct booking on Peak — date chip animates, party-size stepper ticks,
// "name" field types itself in, a confirmation toast slides up.
export function SceneBooking({ progress }) {
  const dateLocked   = progress > 0.10;
  const partyLocked  = progress > 0.30;
  const nameLocked   = progress > 0.55;
  const confirmShown = progress > 0.78;

  // Party size 1 → 4 across 0.10..0.30
  const partyTarget = 4;
  const partyAnim = Math.max(1, Math.min(partyTarget, Math.round(1 + (progress - 0.10) / 0.20 * (partyTarget - 1))));

  // Name typing
  const fullName = 'Vivienne Park';
  const typeStart = 0.30, typeEnd = 0.55;
  const t = Math.max(0, Math.min(1, (progress - typeStart) / (typeEnd - typeStart)));
  const typedName = fullName.slice(0, Math.round(fullName.length * t));

  return (
    <div className="sc sc-book">
      <div className="sc-book-card">
        <div className="sc-book-eyebrow">— Reserve at Aurelia</div>
        <div className="sc-book-h">Friday · April 26</div>

        {/* Date chip row */}
        <div className="sc-book-row">
          <div className="sc-book-label">Date</div>
          <div className={`sc-book-chip ${dateLocked ? 'is-set' : ''}`}>
            <span className="sc-book-chip-glyph">▾</span>
            <span>Fri Apr 26</span>
            {dateLocked && <span className="sc-book-check">✓</span>}
          </div>
        </div>

        {/* Party stepper */}
        <div className="sc-book-row">
          <div className="sc-book-label">Party</div>
          <div className={`sc-book-stepper ${partyLocked ? 'is-set' : ''}`}>
            <button className="sc-book-step" tabIndex="-1">−</button>
            <span className="sc-book-num">{partyAnim}</span>
            <button className="sc-book-step" tabIndex="-1">+</button>
            {partyLocked && <span className="sc-book-check">✓</span>}
          </div>
        </div>

        {/* Time slot grid */}
        <div className="sc-book-row sc-book-row-slots">
          <div className="sc-book-label">Time</div>
          <div className="sc-book-slots">
            {['6:30','6:45','7:00','7:15','7:30','7:45','8:00','8:15'].map((s,i) => (
              <div
                key={s}
                className={`sc-book-slot ${s === '7:30' && progress > 0.18 ? 'is-pick' : ''} ${s === '7:30' && progress > 0.22 ? 'is-locked' : ''}`}
              >{s}</div>
            ))}
          </div>
        </div>

        {/* Name field */}
        <div className="sc-book-row">
          <div className="sc-book-label">Name</div>
          <div className={`sc-book-input ${nameLocked ? 'is-set' : ''}`}>
            <span>{typedName}</span>
            {!nameLocked && t > 0 && t < 1 && <span className="sc-book-caret" />}
            {nameLocked && <span className="sc-book-check">✓</span>}
          </div>
        </div>

        {/* Confirm */}
        <button className={`sc-book-confirm ${confirmShown ? 'is-pulled' : ''}`}>
          Confirm reservation
          <span className="sc-book-arrow">→</span>
        </button>
      </div>

      {/* Confirmation toast */}
      <div
        className="sc-book-toast"
        style={{
          opacity: confirmShown ? 1 : 0,
          transform: `translateY(${confirmShown ? 0 : 16}px)`,
        }}
      >
        <span className="sc-book-toast-check">✓</span>
        <div>
          <div className="sc-book-toast-h">You're on the book.</div>
          <div className="sc-book-toast-s">Confirmation sent to vivienne@…</div>
        </div>
      </div>
    </div>
  );
}

// ─── Scene 3: Guestbook (the host knows you) ───────────────────────────────
// VIP profile card assembles itself in stages as the user scrolls — avatar,
// tags, dietary, notes, recent visits, favorite team, and a tonight banner.
export function SceneGuestbook({ progress }) {
  const avatarShown  = progress > 0.04;
  const flagShown    = progress > 0.10;
  const tagsShown    = progress > 0.18;
  const statsShown   = progress > 0.28;
  const dietShown    = progress > 0.45;
  const notesShown   = progress > 0.52;
  const visitsShown  = progress > 0.68;
  const tonightShown = progress > 0.84;

  // Counter helper — eased countup over a progress window. Ends at the
  // target value once progress passes `hi`; reverses cleanly on scroll up.
  const counter = (target, decimals = 0, lo = 0.30, hi = 0.44) => {
    const t = Math.max(0, Math.min(1, (progress - lo) / (hi - lo)));
    const eased = 1 - Math.pow(1 - t, 3);
    const v = target * eased;
    return decimals > 0 ? v.toFixed(decimals) : String(Math.round(v));
  };

  // Typewriter — reveals one character at a time across a progress window.
  const typewriter = (str, lo, hi) => {
    const t = Math.max(0, Math.min(1, (progress - lo) / (hi - lo)));
    return str.slice(0, Math.round(str.length * t));
  };

  // Pills are limited to three so they don't wrap inside the card.
  const tags = [
    { t: 'VIP',         tone: 'gold' },
    { t: 'Anniversary', tone: 'rose' },
    { t: 'Window pref', tone: 'sage' },
  ];
  const diet = [
    { k: 'No allium',   d: 'garlic, onion, leek' },
    { k: 'Pescatarian', d: 'no land meat' },
  ];
  const noteFull = 'Husband Daniel proposed at table 14 — favorite.';
  const noteTyped = typewriter(noteFull, 0.54, 0.66);
  const noteTyping = noteTyped.length > 0 && noteTyped.length < noteFull.length;

  const visits = [
    { d: 'Mar 02', n: 'Birthday · 6 covers · private room',  sp: '$1,180' },
    { d: 'Apr 26', n: 'Tonight · 2 covers · anniversary',    sp: '—', live: true },
  ];

  return (
    <div className="sc sc-guest">
      <div className="sc-guest-card">
        <div className="sc-guest-head">
          <div className={`sc-guest-avatar ${avatarShown ? 'is-in' : ''}`}>VP</div>
          <div className="sc-guest-name-block">
            <div className="sc-guest-name">Vivienne Park</div>
            <div className="sc-guest-meta">
              <span>14 visits</span>
              <span className="sc-guest-dot">·</span>
              <span>$3,840 lifetime</span>
              <span className="sc-guest-dot">·</span>
              <span>since '22</span>
            </div>
          </div>
          <div className={`sc-guest-flag ${flagShown ? 'is-in' : ''}`}>
            <span className="sc-guest-flag-dot" />
            Arriving 7:30
          </div>
        </div>

        <div className="sc-guest-tags">
          {tags.map((tag, i) => (
            <span
              key={tag.t}
              className={`sc-guest-tag tone-${tag.tone} ${tagsShown ? 'is-in' : ''}`}
              style={{ transitionDelay: `${i * 50}ms` }}
            >{tag.t}</span>
          ))}
        </div>

        {/* Quick stats row — counters tick up as the section reveals. */}
        <div className={`sc-guest-stats ${statsShown ? 'is-in' : ''}`}>
          <div className="sc-guest-stat">
            <div className="sc-guest-stat-v">${counter(274)}</div>
            <div className="sc-guest-stat-l">Avg check</div>
          </div>
          <div className="sc-guest-stat">
            <div className="sc-guest-stat-v">{counter(2.3, 1)} mo</div>
            <div className="sc-guest-stat-l">Cadence</div>
          </div>
          <div className="sc-guest-stat">
            <div className="sc-guest-stat-v">{counter(100)}%</div>
            <div className="sc-guest-stat-l">Show rate</div>
          </div>
          <div className="sc-guest-stat">
            <div className="sc-guest-stat-v">{counter(5.0, 1)}</div>
            <div className="sc-guest-stat-l">NPS</div>
          </div>
        </div>

        {/* Dietary */}
        <div className={`sc-guest-section ${dietShown ? 'is-in' : ''}`}>
          <div className="sc-guest-section-h">Dietary &amp; allergens</div>
          <div className="sc-guest-diet">
            {diet.map((d, i) => (
              <div key={d.k} className="sc-guest-diet-row" style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="sc-guest-diet-k">{d.k}</span>
                <span className="sc-guest-diet-d">{d.d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* A single floor note — types out letter by letter, with caret. */}
        <div className={`sc-guest-section ${notesShown ? 'is-in' : ''}`}>
          <div className="sc-guest-section-h">Notes from the floor</div>
          <div className="sc-guest-note">
            <span className="sc-guest-note-bul" />
            <span>
              {noteTyped}
              {noteTyping && <span className="sc-guest-caret" aria-hidden="true">|</span>}
            </span>
          </div>
        </div>

        {/* Recent visits w/ sparkline */}
        <div className={`sc-guest-section ${visitsShown ? 'is-in' : ''}`}>
          <div className="sc-guest-section-h">Recent visits</div>
          {visits.map((v, i) => (
            <div
              key={i}
              className={`sc-guest-visit ${v.live ? 'is-live' : ''}`}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <span className="sc-guest-visit-d">{v.d}</span>
              <span className="sc-guest-visit-n">{v.n}</span>
              <span className="sc-guest-visit-sp">{v.sp}</span>
              {v.live && <span className="sc-guest-visit-live">Tonight</span>}
            </div>
          ))}
        </div>

        {/* Tonight banner — pulls everything together */}
        <div className={`sc-guest-tonight ${tonightShown ? 'is-in' : ''}`}>
          <div className="sc-guest-tonight-h">For tonight</div>
          <div className="sc-guest-tonight-grid">
            <div><span>Table</span><strong>14 · window</strong></div>
            <div><span>Server</span><strong>Amelia</strong></div>
            <div><span>Pre-pour</span><strong>'18 Cornas</strong></div>
            <div><span>Comp</span><strong>Anniversary cake</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Scene 4: Event ─────────────────────────────────────────────────────────
// Event card: cover photo, title, RSVP counter ticking up, status flips to LIVE.
export function SceneEvent({ progress }) {
  const sold = Math.round(8 + Math.min(progress * 1.05, 1) * 56); // 8 → 64
  const total = 64;
  const pct = Math.min(1, sold / total);
  const isSoldOut = sold >= total;
  const fillShown = progress > 0.10;

  return (
    <div className="sc sc-event">
      <div className="sc-event-card">
        <div className="sc-event-cover">
          {/* Looping square video in place of the old skyline photo —
              reads as a more dynamic event cover. Muted/autoplay/loop
              is set with the same belt-and-suspenders pattern used
              elsewhere (ref callback pins the muted property before
              autoplay races the browser). */}
          <video
            ref={(v) => {
              if (!v) return;
              v.muted = true;
              v.defaultMuted = true;
              v.volume = 0;
              v.setAttribute('muted', '');
            }}
            src="/assets/videos/mp_square.mp4"
            className="sc-event-cover-photo"
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          <div className={`sc-event-status ${isSoldOut ? 'is-soldout' : ''}`}>
            <span className="sc-event-status-dot" />
            {isSoldOut ? 'Sold out' : 'On sale'}
          </div>
          <div className="sc-event-price">$185 / seat</div>
        </div>
        <div className="sc-event-body">
          <div className="sc-event-eyebrow">— Chef's table series</div>
          <div className="sc-event-title">A four-course evening, by candlelight.</div>
          <div className="sc-event-meta">
            <span>Sat · May 18</span>
            <span className="sc-event-dot">·</span>
            <span>7:00 – 10:30 PM</span>
            <span className="sc-event-dot">·</span>
            <span>Aurelia · Private room</span>
          </div>

          <div className="sc-event-rsvp">
            <div className="sc-event-rsvp-row">
              <span className="sc-event-rsvp-num">{sold}</span>
              <span className="sc-event-rsvp-of">of {total} seats sold</span>
            </div>
            <div className="sc-event-rsvp-bar">
              <div
                className="sc-event-rsvp-fill"
                style={{ width: fillShown ? `${pct * 100}%` : 0 }}
              />
            </div>
          </div>

          <div className="sc-event-foot">
            <div className="sc-event-avatars">
              {[0,1,2,3,4].map(i => (
                <div key={i} className="sc-event-avatar" data-i={i} />
              ))}
              <div className="sc-event-avatar-more">+{Math.max(0, sold - 5)}</div>
            </div>
            <div className="sc-event-revenue">
              <span className="sc-event-revenue-label">Booked</span>
              <span className="sc-event-revenue-num">${(sold * 185).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Scene 5: Insight (Busy hours mini grid) ───────────────────────────────
// Weekly busy-hours grid paints itself — a reveal sweep moves left→right
// across the days; bars rise to their values; covers number counts up.
export function SceneInsight({ progress }) {
  const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  // Curve from busy-hours prototype (4a-anchored 23 hours)
  const curve = useMemoSC(() => {
    // Dinner peak: indices 13..18 (5p..10p)
    const arr = new Array(23).fill(0);
    arr[13] = .35; arr[14] = .65; arr[15] = .9; arr[16] = .95; arr[17] = .75; arr[18] = .4;
    return arr;
  }, []);
  const dayMul = [0.6, 0.3, 0.4, 0.55, 0.7, 1.0, 0.95];

  // Reveal sweep — column-by-column reveal across the whole week
  const sweepCols = 7 * 23;
  const revealedCols = Math.round(progress * sweepCols);

  // Cover number ticks up
  const totalCovers = Math.round(progress * 1240);

  return (
    <div className="sc sc-insight">
      <div className="sc-ins-card">
        <div className="sc-ins-head">
          <div>
            <div className="sc-ins-eyebrow">— This week</div>
            <div className="sc-ins-title">Forecast covers</div>
          </div>
          <div className="sc-ins-num">{totalCovers.toLocaleString()}</div>
        </div>

        <div className="sc-ins-grid">
          {days.map((d, di) => (
            <div key={d} className="sc-ins-row">
              <div className="sc-ins-row-label">{d}</div>
              <div className="sc-ins-row-track">
                {curve.map((v, hi) => {
                  const colIdx = di * 23 + hi;
                  const visible = colIdx < revealedCols;
                  const intensity = Math.min(1, v * dayMul[di]);
                  const open = hi >= 7 && hi < 19;
                  return (
                    <div key={hi} className="sc-ins-cell">
                      {open && intensity > 0 && (
                        <div
                          className="sc-ins-cell-fill"
                          style={{
                            height: visible ? `${intensity * 100}%` : 0,
                            background: `rgba(193,163,110,${0.18 + intensity * 0.7})`,
                            borderTop: `1.5px solid rgba(201,166,113,${0.4 + intensity * 0.5})`,
                          }}
                        />
                      )}
                      {!open && <div className="sc-ins-cell-mask" />}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="sc-ins-foot">
          <div className="sc-ins-legend">
            <span className="sc-ins-leg" style={{ background: 'rgba(193,163,110,0.30)' }} />
            <span className="sc-ins-leg" style={{ background: 'rgba(193,163,110,0.60)' }} />
            <span className="sc-ins-leg" style={{ background: 'rgba(193,163,110,0.90)' }} />
            <span className="sc-ins-leg-l">Quiet → Peak</span>
          </div>
          <div className="sc-ins-trend">
            <span className="sc-ins-trend-arrow">↗</span> 14% vs. last week
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Scene 6: Spotlight (specialty tables / table naming) ──────────────────
// A featured table morphs from a generic "Table 14" header into a named
// specialty seat ("Sinatra's Booth") while attribute chips and a "most
// requested" stat reveal underneath. Below the hero card, a small list of
// other named tables fills in — a guest-facing spotlight rail.
export function SceneSpotlight({ progress }) {
  const morphed     = progress > 0.14;
  const attrsShown  = progress > 0.28;
  const statShown   = progress > 0.46;
  const ctaShown    = progress > 0.58;
  const railShown   = progress > 0.66;

  // Count-up for "most requested" — eases over 0.46..0.62
  const t = Math.max(0, Math.min(1, (progress - 0.46) / (0.16)));
  const eased = 1 - Math.pow(1 - t, 3);
  const requestCount = Math.round(38 * eased);

  const attrs = [
    { k: 'View',       v: 'Window onto Mercer' },
    { k: 'Seating',    v: 'Banquette · 4-top'  },
    { k: 'Setting',    v: 'Pre-set candle'     },
  ];

  const rail = [
    { name: 'The Versace Table', sub: '6-top · private corner',  appearAt: 0.70 },
    { name: "Clemenza's Corner", sub: '4-top · banquette',        appearAt: 0.78 },
    { name: 'The Aviator',       sub: '2-top · bar adjacent',     appearAt: 0.86 },
  ];

  return (
    <div className="sc sc-spot">
      <div className="sc-spot-eyebrow">— Specialty tables · Aurelia</div>

      {/* Hero card — name morphs from generic to specialty */}
      <div className="sc-spot-hero">
        <div className="sc-spot-hero-head">
          <div className="sc-spot-name-stage">
            <span className={`sc-spot-name from ${morphed ? 'is-out' : ''}`}>Table 14</span>
            <span className={`sc-spot-name to ${morphed ? 'is-in' : ''}`}>Sinatra's Booth</span>
          </div>
          <div className={`sc-spot-badge ${statShown ? 'is-in' : ''}`}>
            <span className="sc-spot-badge-dot" />
            Most requested
          </div>
        </div>

        <div className={`sc-spot-attrs ${attrsShown ? 'is-in' : ''}`}>
          {attrs.map((a, i) => (
            <div key={a.k} className="sc-spot-attr" style={{ transitionDelay: `${i * 70}ms` }}>
              <span className="sc-spot-attr-k">{a.k}</span>
              <span className="sc-spot-attr-v">{a.v}</span>
            </div>
          ))}
        </div>

        <div className={`sc-spot-stat ${statShown ? 'is-in' : ''}`}>
          <span className="sc-spot-stat-n">{requestCount}</span>
          <span className="sc-spot-stat-l">guest requests · last 30 days</span>
        </div>

        <div className={`sc-spot-cta ${ctaShown ? 'is-in' : ''}`}>
          Reserve Sinatra's Booth
          <span className="sc-spot-cta-arrow">→</span>
        </div>
      </div>

      {/* Rail — other named tables fill in */}
      <div className={`sc-spot-rail ${railShown ? 'is-in' : ''}`}>
        <div className="sc-spot-rail-h">— Also tonight</div>
        <div className="sc-spot-rail-list">
          {rail.map((r) => {
            const appeared = progress >= r.appearAt;
            return (
              <div key={r.name} className={`sc-spot-rail-row ${appeared ? 'is-in' : ''}`}>
                <span className="sc-spot-rail-name">{r.name}</span>
                <span className="sc-spot-rail-sub">{r.sub}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Scene 7: VIP (Peak Illuminati) ────────────────────────────────────────
// A dark member card sits center-stage. As progress advances, the member
// name etches itself in, then a series of privileges reveal underneath.
// A small comparison strip at the bottom reads "OpenTable 1,000 pts → ???"
// flipping to "Peak Illuminati → any table on the planet."
export function SceneVIP({ progress }) {
  const cardShown  = progress > 0.06;
  const nameShown  = progress > 0.18;
  const privShown  = progress > 0.34;
  const compShown  = progress > 0.72;

  // Typewriter for member number
  const memberFull = 'NO. 0247';
  const t = Math.max(0, Math.min(1, (progress - 0.18) / (0.30 - 0.18)));
  const memberTyped = memberFull.slice(0, Math.round(memberFull.length * t));
  const memberTyping = memberTyped.length > 0 && memberTyped.length < memberFull.length;

  const privileges = [
    { glyph: '◐', t: '14-day early access',          s: 'Before the public calendar opens'    },
    { glyph: '✦', t: 'Tables held on request',       s: 'Including Sinatra’s Booth'      },
    { glyph: '◇', t: '12% house credit',             s: 'At every participating restaurant'   },
    { glyph: '⌖', t: 'Concierge across the network', s: 'One ask, any city, any night'        },
  ];

  // Comparison flip — OT side stays "1,000 pts = ???"; Peak side flips in
  return (
    <div className="sc sc-vip">
      <div className="sc-vip-eyebrow">— Peak Illuminati · By invitation</div>

      <div className={`sc-vip-card ${cardShown ? 'is-in' : ''}`}>
        <div className="sc-vip-card-grain" aria-hidden="true" />
        {/* Bear illustration sits behind everything as a faint watermark
            — the Peak equivalent of AMEX's Centurion. Rendered via CSS
            mask in scenes.css so it picks up the gold tint and blends
            into the card surface. */}
        <div className="sc-vip-card-bear" aria-hidden="true" />
        <div className="sc-vip-card-corner sc-vip-card-corner-tl">PK</div>
        <div className="sc-vip-card-corner sc-vip-card-corner-tr">EST · 26</div>
        <div className="sc-vip-card-seal" aria-hidden="true">
          <svg
            className="sc-vip-card-seal-crown"
            viewBox="0 0 24 18"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M2 16 V6 L7 10 L12 2 L17 10 L22 6 V16 Z" />
            <rect x="2" y="14.5" width="20" height="2.5" rx="0.4" />
            <circle cx="2" cy="6" r="1.3" />
            <circle cx="12" cy="2" r="1.3" />
            <circle cx="22" cy="6" r="1.3" />
          </svg>
        </div>
        <div className="sc-vip-card-name-block">
          <div className={`sc-vip-card-name ${nameShown ? 'is-in' : ''}`}>Vivienne Park</div>
          <div className={`sc-vip-card-mno ${nameShown ? 'is-in' : ''}`}>
            <span>{memberTyped}</span>
            {memberTyping && <span className="sc-vip-caret" aria-hidden="true">|</span>}
          </div>
        </div>
        <div className="sc-vip-card-foot">PEAK ILLUMINATI</div>
      </div>

      <div className={`sc-vip-priv ${privShown ? 'is-in' : ''}`}>
        {privileges.map((p, i) => (
          <div key={p.t} className="sc-vip-priv-row" style={{ transitionDelay: `${i * 90}ms` }}>
            <span className="sc-vip-priv-glyph">{p.glyph}</span>
            <div className="sc-vip-priv-text">
              <div className="sc-vip-priv-t">{p.t}</div>
              <div className="sc-vip-priv-s">{p.s}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Shows the privileges in action — what the member actually sees
          in their account, rather than a marketing comparison. Two
          live-state rows: one active table hold, one running credit
          balance. */}
      <div className={`sc-vip-comp ${compShown ? 'is-in' : ''}`}>
        <div className="sc-vip-comp-row sc-vip-comp-hold">
          <span className="sc-vip-comp-l">Active hold</span>
          <span className="sc-vip-comp-v">Sinatra's Booth · Sat 8:00 PM</span>
        </div>
        <div className="sc-vip-comp-row sc-vip-comp-credit">
          <span className="sc-vip-comp-l">House credit</span>
          <span className="sc-vip-comp-v">$284 <i>of</i> $360</span>
        </div>
      </div>
    </div>
  );
}

// ─── Scene 8: Cost (negative — money lost to competitors) ──────────────────
// A receipt-style ledger of what other reservation platforms cost. Line
// items add up one by one (counters tick), summing to monthly and annual
// totals. The punchline pulls in at the end: "Peak — none of this."
export function SceneCost({ progress }) {
  // Each line appears at a threshold; its value is the tail of an easing
  // counter so the numbers FEEL like they're being totted up.
  const ramp = (lo, hi) => {
    const t = Math.max(0, Math.min(1, (progress - lo) / (hi - lo)));
    return 1 - Math.pow(1 - t, 3);
  };

  const coverFee   = Math.round(8.50 * ramp(0.06, 0.18) * 100) / 100;     // $/cover
  const coverMo    = Math.round(2800 * ramp(0.08, 0.22));                  // monthly $$
  const commPct    = (7.0 * ramp(0.22, 0.34)).toFixed(1);
  const commMo     = Math.round(5200 * ramp(0.24, 0.38));
  const adSpend    = Math.round(4200 * ramp(0.38, 0.52));
  const promoSpend = Math.round(2100 * ramp(0.50, 0.62));

  const monthTotal = coverMo + commMo + adSpend + promoSpend;
  const yearTotal  = monthTotal * 12;

  const totalShown  = progress > 0.66;
  const punchShown  = progress > 0.82;

  const fmt = (n) => '$' + n.toLocaleString();

  return (
    <div className="sc sc-cost">
      <div className="sc-cost-eyebrow">— What it costs to be listed</div>

      <div className="sc-cost-receipt">
        <div className="sc-cost-receipt-head">
          <span className="sc-cost-receipt-h">Monthly statement</span>
          <span className="sc-cost-receipt-sub">A typical 80-cover restaurant</span>
        </div>

        <div className="sc-cost-line" style={{ opacity: progress > 0.06 ? 1 : 0 }}>
          <span className="sc-cost-line-l">Per-cover fee</span>
          <span className="sc-cost-line-m">${coverFee.toFixed(2)} × covers</span>
          <span className="sc-cost-line-v">{fmt(coverMo)}</span>
        </div>
        <div className="sc-cost-line" style={{ opacity: progress > 0.22 ? 1 : 0 }}>
          <span className="sc-cost-line-l">Commission</span>
          <span className="sc-cost-line-m">{commPct}% of gross</span>
          <span className="sc-cost-line-v">{fmt(commMo)}</span>
        </div>
        <div className="sc-cost-line" style={{ opacity: progress > 0.38 ? 1 : 0 }}>
          <span className="sc-cost-line-l">Marketing spend</span>
          <span className="sc-cost-line-m">Promoted listings</span>
          <span className="sc-cost-line-v">{fmt(adSpend)}</span>
        </div>
        <div className="sc-cost-line" style={{ opacity: progress > 0.50 ? 1 : 0 }}>
          <span className="sc-cost-line-l">Featured tier</span>
          <span className="sc-cost-line-m">Top-of-search</span>
          <span className="sc-cost-line-v">{fmt(promoSpend)}</span>
        </div>

        <div className="sc-cost-rule" />

        <div className={`sc-cost-total ${totalShown ? 'is-in' : ''}`}>
          <div className="sc-cost-total-row">
            <span className="sc-cost-total-l">Per month</span>
            <span className="sc-cost-total-v">{fmt(monthTotal)}</span>
          </div>
          <div className="sc-cost-total-row sc-cost-total-year">
            <span className="sc-cost-total-l">Per year</span>
            <span className="sc-cost-total-v">{fmt(yearTotal)}</span>
          </div>
        </div>
      </div>

      <div className={`sc-cost-punch ${punchShown ? 'is-in' : ''}`}>
        <div className="sc-cost-punch-l">Peak charges</div>
        <div className="sc-cost-punch-v">$0</div>
        <div className="sc-cost-punch-sub">— of any of it. None of it. Ever.</div>
      </div>
    </div>
  );
}

// ─── Scene 9: Yield (demand-aware pricing, positive) ──────────────────────
// A hero slot ("Saturday 7:30 PM · Sinatra's Booth") with its price
// counting up to a peak figure as scroll advances. Below, a row of other
// Saturday timeslots each with a small demand-bar and a price that
// fades in. Footer: "+18% revenue · same covers."
export function SceneYield({ progress }) {
  // Hero price ramps 0 → 325 over the first half of scroll
  const heroT = Math.max(0, Math.min(1, (progress - 0.04) / (0.28)));
  const heroEased = 1 - Math.pow(1 - heroT, 3);
  const heroPrice = Math.round(325 * heroEased);

  const slotsShown = progress > 0.38;
  const liftShown  = progress > 0.74;

  // Slots — each price counts up on its own ramp. Demand-bar height is
  // fixed (it's the demand curve, not the scrub target).
  const slots = [
    { time: '6:30', target: 185, demand: 0.40, appearAt: 0.40 },
    { time: '7:00', target: 245, demand: 0.62, appearAt: 0.46 },
    { time: '7:30', target: 325, demand: 0.95, appearAt: 0.52, isPeak: true },
    { time: '8:00', target: 295, demand: 0.78, appearAt: 0.58 },
    { time: '8:30', target: 215, demand: 0.46, appearAt: 0.64 },
  ];
  const slotPrice = (s) => {
    const t = Math.max(0, Math.min(1, (progress - s.appearAt) / 0.10));
    return Math.round(s.target * (1 - Math.pow(1 - t, 3)));
  };

  return (
    <div className="sc sc-yield">
      <div className="sc-yield-eyebrow">— Saturday · Demand-aware</div>

      {/* Hero slot card */}
      <div className="sc-yield-hero">
        <div className="sc-yield-hero-l">
          <div className="sc-yield-hero-time">7:30 PM</div>
          <div className="sc-yield-hero-table">Sinatra's Booth · 4-top</div>
          <div className="sc-yield-hero-meta">
            <span className="sc-yield-hero-dot" />
            <span>Peak demand · 12 bids</span>
          </div>
        </div>
        <div className="sc-yield-hero-r">
          <div className="sc-yield-hero-was">$185 base</div>
          <div className="sc-yield-hero-now">${heroPrice}</div>
          <div className="sc-yield-hero-delta">+76%</div>
        </div>
      </div>

      {/* Saturday slot grid */}
      <div className={`sc-yield-grid ${slotsShown ? 'is-in' : ''}`}>
        <div className="sc-yield-grid-h">— The full evening</div>
        <div className="sc-yield-slots">
          {slots.map((s, i) => {
            const appeared = progress >= s.appearAt;
            return (
              <div
                key={s.time}
                className={`sc-yield-slot ${appeared ? 'is-in' : ''} ${s.isPeak ? 'is-peak' : ''}`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="sc-yield-slot-time">{s.time}</div>
                <div className="sc-yield-slot-bar">
                  <div
                    className="sc-yield-slot-fill"
                    style={{ height: appeared ? `${s.demand * 100}%` : 0 }}
                  />
                </div>
                <div className="sc-yield-slot-price">${slotPrice(s)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer lift */}
      <div className={`sc-yield-foot ${liftShown ? 'is-in' : ''}`}>
        <div className="sc-yield-foot-row">
          <span className="sc-yield-foot-arrow">↗</span>
          <span className="sc-yield-foot-pct">+18%</span>
          <span className="sc-yield-foot-l">revenue · same covers</span>
        </div>
        <div className="sc-yield-foot-sub">Live for 3 years at Norma's &amp; Mr. Picadilly</div>
      </div>
    </div>
  );
}

Object.assign(window, {
  SceneMarketplace, SceneBooking, SceneGuestbook, SceneEvent, SceneInsight,
  SceneSpotlight, SceneVIP, SceneCost, SceneYield,
});
