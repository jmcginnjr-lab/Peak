// =========================================================================
// Today — GM's command center
// =========================================================================

function TodaySurface({ openReceipt, compareMode, viewMode }) {
  return viewMode === "dashboard"
    ? <TodayDashboard openReceipt={openReceipt} compareMode={compareMode}/>
    : <TodayNarrative openReceipt={openReceipt} compareMode={compareMode}/>;
}

function TodayNarrative({ openReceipt, compareMode }) {
  const shift = PEAK.todayShift;
  const pnl = PEAK.dayPnL;

  return (
    <div className="surface-narrative">
      <NarrativeHero
        eyebrow={`Friday May 15 · Lunch in service · ${PEAK.NOW.time}`}
        headline={`Today is <em>on plan</em>.<br/><span class="muted-fragment">One decision needs you.</span>`}
        sub={`<b>${shift.seated}</b> of <b>${shift.capacity}</b> seated. Robin on door, Maeve on floor, Tyler running. The 12-top tonight hasn't confirmed yet — everything else is humming.`}
      >
        <div className="nar-meta-strip">
          <span><b>{shift.walkIns}</b><span className="lbl">walk-ins absorbed</span></span>
          <span><b>{shift.turning}</b><span className="lbl">turning · next 30 min</span></span>
          <span><b>${pnl.depositsCollected.toFixed(0)}</b><span className="lbl">deposits today · <span style={{color: "var(--peak-success)"}}>+$87 vs LW</span></span></span>
          <span><b>0</b><span className="lbl">refunds today</span></span>
        </div>
      </NarrativeHero>

      {/* The one decision */}
      <FocusCard
        tone="urgent"
        eyebrow="Decision · before 6:00 PM"
        title="Lai-Sutton 12-top hasn't confirmed for tonight"
        body="Booked 9 days ago with a <b>$240 deposit</b>. Last contact Monday. Tables 60+62 held. Releasing the hold opens room for two walk-in 4-tops at 8:00 PM."
        actions={
          <div style={{display: "contents"}}>
            <button className="btn btn-secondary">Hold till 6 PM</button>
            <button className="btn btn-secondary">Release</button>
            <button className="btn btn-primary"><Icon name="phone" size={13}/>Text now</button>
          </div>
        }
      />

      {/* Inline disclosures */}
      <SectionHeader title="Look closer" meta="open anything below"/>

      <Expandable
        icon="clock"
        title="The Tape · today's full bookings"
        sub="11 AM → 10 PM. Scrub to any moment, click any pill for the receipt."
      >
        <TheTape openReceipt={openReceipt}/>
      </Expandable>

      <Expandable
        icon="trend"
        title="Cover pacing vs. last Friday"
        sub="Tracking −12% toward today's plan. Lunch on plan; dinner is the open question."
        badge="−12%"
      >
        <DayPacingChart/>
        <div style={{fontSize: 13, color: "var(--fg-muted)", marginTop: 14, lineHeight: 1.55, maxWidth: "60ch"}}>
          Lunch is <b style={{color: "var(--fg)"}}>+3 vs last Friday</b>. Dinner has 94 covers on the book vs typical 138 same-day last week. Booking velocity tightened after Tuesday's storm and hasn't fully recovered. The −12% is a dinner story, not a service-quality story.
        </div>
      </Expandable>

      <Expandable
        icon="card"
        title="Day P&L · running"
        sub={`$${pnl.depositsCollected.toFixed(0)} deposits collected · $18 forfeited · net est. settles Sun May 17.`}
      >
        <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, padding: "8px 0"}}>
          <div className="nar-quiet-stat">
            <span className="v">${pnl.depositsCollected.toFixed(2)}</span>
            <span className="l">Deposits collected</span>
            <span style={{fontSize: 11.5, color: "var(--fg-muted)"}}>across 24 covers seated</span>
          </div>
          <div className="nar-quiet-stat">
            <span className="v" style={{color: "#E6B478"}}>${pnl.depositsForfeited.toFixed(2)}</span>
            <span className="l">Forfeited (no-show)</span>
            <span style={{fontSize: 11.5, color: "var(--fg-muted)"}}>Otieno 2-top · T43</span>
          </div>
          <div className="nar-quiet-stat">
            <span className="v" style={{color: "#9DC08A"}}>$0.00</span>
            <span className="l">Refunds today</span>
            <span style={{fontSize: 11.5, color: "var(--fg-muted)"}}>first clean lunch this week</span>
          </div>
          <div className="nar-quiet-stat">
            <span className="v">${(pnl.depositsCollected + pnl.depositsForfeited - pnl.feesSoFar).toFixed(2)}</span>
            <span className="l">
              <WhyPopover
                eyebrow="Net to bank"
                body="Estimated net for lunch. Stripe payouts settle T+2 — today's deposits less fees land in <b>po_1TZ4</b> on May 17."
                drivers={[
                  { k: "Gross today", v: "$1,247.50" },
                  { k: "Stripe fees", v: "−$47.32" },
                  { k: "No-show retained", v: "+$18.00" }
                ]}
              >Net est.</WhyPopover>
            </span>
            <span style={{fontSize: 11.5, color: "var(--fg-muted)"}}>settles Sun May 17</span>
          </div>
        </div>
      </Expandable>

      <Expandable
        icon="users"
        title="Now & Next · arriving in the next 30 min"
        sub="5 arriving · 1 VIP · 1 allergy on file"
      >
        <div className="now-next-list">
          {[
            { time: "12:30", name: "Park, Hyun-Jin", meta: "T31 · 2-top · returning · $14 deposit" },
            { time: "12:35", name: "Saito-Brown party", meta: "T40 · 6-top · VIP · $42 deposit", tag: "vip" },
            { time: "12:45", name: "Whitman, Lou", meta: "T17 · 4-top · ALLERGY: shellfish", tag: "allergy" },
            { time: "12:50", name: "Caldwell, R.", meta: "T41 · 2-top" },
            { time: "1:00",  name: "Brown, Brienna (lunch)", meta: "T42 · 4-top · VIP returning", tag: "vip" },
          ].map((it, i) => (
            <div className="now-next-item" key={i} onClick={() => openReceipt(["r-014","r-017","r-006","r-018","r-019"][i])}>
              <div className="nn-time">{it.time}</div>
              <div>
                <div className="nn-name">{it.name}</div>
                <div className="nn-meta">{it.meta}</div>
              </div>
              {it.tag && <div className={"nn-tag " + it.tag}>{it.tag === "vip" ? "VIP" : "ALLERGY"}</div>}
            </div>
          ))}
        </div>
      </Expandable>
    </div>
  );
}

// ---------- THE TAPE — scrubbable timeline with revenue + cover ribbons ----------
function TheTape({ openReceipt }) {
  const [mode, setMode] = useState("revenue"); // revenue | covers | demand
  const [scrubX, setScrubX] = useState(null);
  const [hoverRes, setHoverRes] = useState(null);
  const wrapRef = useRef(null);
  const svgRef = useRef(null);

  // Tape spans 11:00 AM → 10:00 PM (11 hrs × 4 slots = 44 slots × 15 min each)
  const slots = 44;
  const startHour = 11;
  const nowMin = 75; // 12:15 PM = +75 min from 11:00
  const reservations = PEAK.tapeReservations;
  const revenue = PEAK.tapeRevenue;

  // Layout
  const padding = { top: 24, right: 16, bottom: 72, left: 60 };
  const slotW = 22; // px per 15min slot
  const totalW = padding.left + slotW * slots + padding.right;
  const ribbonH = 110;
  const trackH = 4;
  const laneH = 18;
  const laneGap = 3;
  const laneY0 = padding.top + ribbonH + 36;
  // Compute total height dynamically: 8 lanes max
  const laneCountCap = 8;
  const lanesAreaH = laneCountCap * (laneH + laneGap);
  const height = padding.top + ribbonH + 36 + lanesAreaH + padding.bottom;

  // Rev ribbon path
  const revMax = Math.max(...revenue);
  const xFor = i => padding.left + i * slotW + slotW / 2;
  const yFor = v => padding.top + (ribbonH - (v / revMax) * ribbonH);
  const revPath = revenue.map((v, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(v)}`).join(" ");
  const fillPath = revPath + ` L ${xFor(slots - 1)} ${padding.top + ribbonH} L ${xFor(0)} ${padding.top + ribbonH} Z`;

  // Hour labels: every 4 slots
  const hourLabels = [];
  for (let i = 0; i < slots; i += 4) {
    const h24 = startHour + Math.floor(i / 4);
    const h = h24 > 12 ? h24 - 12 : h24;
    const ap = h24 >= 12 ? "PM" : "AM";
    hourLabels.push({ i, label: `${h}${ap}` });
  }

  // Reservation lanes: stack into rows to avoid overlap (greedy)
  const lanes = [];
  function placeRes(r) {
    const rStart = (r.startMin + 0) / 15;
    const rEnd = rStart + r.durMin / 15;
    for (let l = 0; l < lanes.length; l++) {
      const fits = lanes[l].every(ex => ex.end <= rStart || ex.start >= rEnd);
      if (fits) {
        lanes[l].push({ start: rStart, end: rEnd, res: r });
        return l;
      }
    }
    lanes.push([{ start: rStart, end: rEnd, res: r }]);
    return lanes.length - 1;
  }
  const placed = reservations
    .slice()
    .sort((a, b) => a.startMin - b.startMin)
    .map(r => ({ r, lane: placeRes(r) }));
  const laneCount = Math.min(lanes.length, laneCountCap);

  // Color a pill by deposit status / mode
  function pillFill(r) {
    if (mode === "revenue") return "rgba(201,166,113,0.55)";
    if (mode === "covers") return r.party >= 6 ? "rgba(194,146,68,0.7)" : "rgba(107,142,90,0.55)";
    return "rgba(93,122,138,0.55)";
  }
  function pillBorder(r) {
    if (r.deposit === "paid") return "var(--peak-success)";
    if (r.deposit === "refunded") return "var(--peak-info)";
    if (r.deposit === "forfeited") return "var(--peak-brass-400)";
    if (r.deposit === "comp") return "var(--peak-slate-400)";
    return "var(--border-strong)";
  }

  function handleMove(e) {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const ratio = totalW / rect.width;
    const x = (e.clientX - rect.left) * ratio;
    if (x >= padding.left && x <= totalW - padding.right) setScrubX(x);
    else setScrubX(null);
  }

  // Compute scrub-time stats
  function scrubInfo() {
    if (scrubX == null) return null;
    const slotIdx = Math.max(0, Math.min(slots - 1, Math.round((scrubX - padding.left) / slotW)));
    const totalMin = startHour * 60 + slotIdx * 15;
    const h24 = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    const h = h24 > 12 ? h24 - 12 : h24;
    const ap = h24 >= 12 ? "PM" : "AM";
    const time = `${h}:${String(m).padStart(2, "0")} ${ap}`;
    const seated = reservations.filter(r => r.startMin <= slotIdx * 15 && r.startMin + r.durMin > slotIdx * 15).length;
    const covers = reservations.filter(r => r.startMin <= slotIdx * 15 && r.startMin + r.durMin > slotIdx * 15).reduce((s, r) => s + r.party, 0);
    return { time, slotIdx, seated, covers, rev: revenue[slotIdx] };
  }

  const scrub = scrubInfo();
  const nowSlotIdx = nowMin / 15;
  const nowX = padding.left + nowSlotIdx * slotW;

  return (
    <div className="lg-card tape-card" ref={wrapRef} style={{marginTop: 16}}>
      <div className="lg-card-head">
        <div>
          <div className="lg-card-eyebrow">The Tape · 11 AM → 10 PM</div>
          <div className="lg-card-title">{reservations.length} reservations · {reservations.reduce((s, r) => s + r.party, 0)} covers · ${revenue.reduce((s, v) => s + v, 0).toLocaleString()} in deposit-bearing revenue</div>
        </div>
        <div className="tape-controls">
          <span className="lg-card-eyebrow">Ribbon</span>
          <div className="tape-toggle">
            <button className={mode === "revenue" ? "active" : ""} onClick={() => setMode("revenue")}>Revenue</button>
            <button className={mode === "covers" ? "active" : ""} onClick={() => setMode("covers")}>Covers</button>
            <button className={mode === "demand" ? "active" : ""} onClick={() => setMode("demand")}>Demand</button>
          </div>
        </div>
      </div>

      <div className="tape-svg-wrap" style={{overflowX: "auto", overflowY: "visible"}}>
        <svg
          ref={svgRef}
          className="tape-svg"
          viewBox={`0 0 ${totalW} ${height}`}
          width="100%"
          style={{minWidth: totalW, height: height}}
          onMouseMove={handleMove}
          onMouseLeave={() => { setScrubX(null); setHoverRes(null); }}
        >
          {/* Hour grid */}
          {hourLabels.map(({ i, label }, idx) => (
            <g key={idx}>
              <line x1={xFor(i) - slotW / 2} x2={xFor(i) - slotW / 2} y1={padding.top - 6} y2={height - padding.bottom + 4} stroke="var(--divider)" strokeWidth="1"/>
              <text x={xFor(i) - slotW / 2 + 4} y={padding.top - 6} className="compare-axis-label" style={{fontSize: 9.5, fill: "var(--fg-muted)"}}>{label}</text>
            </g>
          ))}

          {/* Revenue ribbon */}
          <path d={fillPath} fill="rgba(201,166,113,0.10)"/>
          <path d={revPath} stroke="var(--accent)" strokeWidth="1.5" fill="none"/>

          {/* Now line */}
          <line x1={nowX} x2={nowX} y1={padding.top - 8} y2={height - padding.bottom + 8} stroke="var(--peak-success)" strokeWidth="1.5" strokeDasharray="3 3"/>
          <circle cx={nowX} cy={padding.top - 8} r="4" fill="var(--peak-success)"/>
          <rect x={nowX + 4} y={padding.top - 14} width="92" height="14" rx="3" fill="var(--peak-ink-900)" stroke="var(--peak-success)" strokeOpacity="0.4"/>
          <text x={nowX + 10} y={padding.top - 4} fontSize="10" fontFamily="JetBrains Mono" fill="var(--peak-success)" letterSpacing="0.06em">NOW · 12:15 PM</text>

          {/* Reservation pills */}
          {placed.map(({ r, lane }) => {
            const startSlot = r.startMin / 15;
            const endSlot = (r.startMin + r.durMin) / 15;
            const x = padding.left + startSlot * slotW;
            const w = (endSlot - startSlot) * slotW - 1;
            const y = laneY0 + lane * (laneH + laneGap);
            if (lane >= laneCount) return null;
            const isPast = r.startMin + r.durMin < nowMin;
            return (
              <g key={r.id}
                 style={{cursor: "pointer", opacity: isPast ? 0.55 : 1}}
                 onClick={() => openReceipt(r.id)}
                 onMouseEnter={() => setHoverRes(r)}
                 onMouseLeave={() => setHoverRes(null)}>
                <rect
                  x={x} y={y} width={Math.max(w, 6)} height={laneH}
                  rx="3"
                  fill={pillFill(r)}
                  stroke={pillBorder(r)}
                  strokeWidth="1"
                />
                {w > 50 && (
                  <text x={x + 6} y={y + laneH / 2 + 3.5} fontSize="10" fill="var(--fg)" fontFamily="Inter" fontWeight="500" style={{pointerEvents: "none"}}>
                    {r.vip && <tspan fill="var(--peak-brass-400)" fontWeight="700">★ </tspan>}
                    {r.name.split(",")[0].slice(0, 12)}{r.name.length > 12 ? "…" : ""} <tspan fill="var(--fg-muted)" fontFamily="JetBrains Mono">·{r.party}</tspan>
                  </text>
                )}
                {w <= 50 && w > 14 && (
                  <text x={x + 3} y={y + laneH / 2 + 3.5} fontSize="9" fill="var(--fg)" fontFamily="JetBrains Mono" style={{pointerEvents: "none"}}>{r.party}</text>
                )}
              </g>
            );
          })}

          {/* Scrub line */}
          {scrubX != null && (
            <line x1={scrubX} x2={scrubX} y1={padding.top - 8} y2={height - padding.bottom + 8} stroke="var(--accent)" strokeWidth="1" strokeDasharray="2 3" opacity="0.7"/>
          )}

          {/* Bottom-axis micro labels (15-min ticks) */}
          {[0, 8, 16, 24, 32, 40].map(i => (
            <text key={i} x={xFor(i)} y={height - 32} fontSize="8.5" fill="var(--fg-subtle)" textAnchor="middle" fontFamily="JetBrains Mono" letterSpacing="0.04em">
              ${revenue.slice(0, i + 1).reduce((s, v) => s + v, 0).toLocaleString()}
            </text>
          ))}
          <text x={padding.left} y={height - 18} fontSize="9" fill="var(--fg-subtle)" fontFamily="JetBrains Mono" letterSpacing="0.06em">Cumulative revenue (deposit + cancellation fee)</text>
        </svg>

        {/* Scrub tooltip */}
        {scrub && (
          <div className="lg-tooltip" style={{
            left: Math.min((scrubX / totalW) * (wrapRef.current?.offsetWidth || totalW) + 12, (wrapRef.current?.offsetWidth || totalW) - 200),
            top: 24
          }}>
            <div className="tt-eyebrow">{scrub.time}</div>
            <div className="tt-row"><span>Covers in service</span><span className="v">{scrub.covers}</span></div>
            <div className="tt-row"><span>Bookings</span><span className="v">{scrub.seated}</span></div>
            <div className="tt-row"><span>Rev this 15 min</span><span className="v" style={{color: "var(--accent)"}}>${scrub.rev}</span></div>
          </div>
        )}

        {/* Hover res tooltip */}
        {hoverRes && (
          <div className="lg-tooltip" style={{
            left: ((padding.left + (hoverRes.startMin / 15 + (hoverRes.durMin / 15) / 2) * slotW) / totalW) * (wrapRef.current?.offsetWidth || totalW) - 100,
            top: laneY0 + 100
          }}>
            <div className="tt-eyebrow">{PEAK.minToTime(hoverRes.startMin)} · T{hoverRes.table}</div>
            <div style={{fontWeight: 600, fontSize: 13, margin: "2px 0 6px"}}>{hoverRes.name}</div>
            <div className="tt-row"><span>Party</span><span className="v">{hoverRes.party} covers</span></div>
            <div className="tt-row"><span>Deposit</span><span className="v">{hoverRes.deposit}</span></div>
            <div className="tt-row"><span>Revenue</span><span className="v" style={{color: "var(--accent)"}}>${hoverRes.revenue}</span></div>
          </div>
        )}
      </div>

      <div className="tape-legend">
        <span className="swatch"><i style={{background: "var(--peak-success)"}}/>Deposit paid</span>
        <span className="swatch"><i style={{background: "var(--peak-info)"}}/>Refunded</span>
        <span className="swatch"><i style={{background: "var(--peak-brass-400)"}}/>Forfeited (no-show)</span>
        <span className="swatch"><i style={{background: "var(--peak-slate-400)"}}/>Comped</span>
        <span style={{marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em", color: "var(--fg-subtle)"}}>
          Click any pill to open the Receipt · scrub to read any moment
        </span>
      </div>
    </div>
  );
}

// ---------- Mini compare-of-the-day chart on the Today surface ----------
function DayPacingChart() {
  // 15-minute cover-count curve, today vs last Friday
  const today  = [0, 4, 10, 18, 24, 32, 38, 40, 42, 44, 46, 47];
  const lastWk = [0, 4, 12, 22, 28, 36, 42, 44, 46, 48, 52, 56, 58, 58, 56, 52, 46];
  const labels = ["11", "11:30", "12", "12:30", "1", "1:30", "2", "2:30", "3", "3:30", "4", "4:30", "5", "5:30", "6", "6:30", "7"];

  const w = 720, h = 180;
  const pad = { top: 14, right: 24, bottom: 30, left: 36 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const max = 60;
  const xFor = (i, n) => pad.left + (i / (n - 1)) * innerW;
  const yFor = v => pad.top + innerH - (v / max) * innerH;

  const todayPath = today.map((v, i) => `${i === 0 ? "M" : "L"} ${xFor(i, lastWk.length)} ${yFor(v)}`).join(" ");
  const lastPath = lastWk.map((v, i) => `${i === 0 ? "M" : "L"} ${xFor(i, lastWk.length)} ${yFor(v)}`).join(" ");
  const fillPath = todayPath + ` L ${xFor(today.length - 1, lastWk.length)} ${pad.top + innerH} L ${pad.left} ${pad.top + innerH} Z`;

  return (
    <svg className="compare-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{height: h + "px"}}>
      {[0, 15, 30, 45, 60].map(v => (
        <g key={v}>
          <line x1={pad.left} x2={w - pad.right} y1={yFor(v)} y2={yFor(v)} className="compare-grid-line"/>
          <text x={pad.left - 8} y={yFor(v) + 3} className="compare-axis-label" textAnchor="end">{v}</text>
        </g>
      ))}
      <path d={lastPath} className="compare-ribbon-prev"/>
      <path d={fillPath} className="compare-ribbon-now-fill"/>
      <path d={todayPath} className="compare-ribbon-now"/>

      {/* now line */}
      <line x1={xFor(2.5, lastWk.length)} x2={xFor(2.5, lastWk.length)} y1={pad.top - 4} y2={pad.top + innerH} stroke="var(--peak-success)" strokeDasharray="3 3" strokeWidth="1"/>

      {/* dots on today */}
      {today.map((v, i) => (
        <circle key={i} cx={xFor(i, lastWk.length)} cy={yFor(v)} r="2.5" className="compare-now-dot"/>
      ))}

      {labels.filter((_, i) => i % 2 === 0).map((l, i) => (
        <text key={l} x={xFor(i * 2, lastWk.length)} y={h - 10} className="compare-axis-label" textAnchor="middle">{l}</text>
      ))}
    </svg>
  );
}

// ---------- TodayDashboard — everything visible, the v1 layout ----------
function TodayDashboard({ openReceipt, compareMode }) {
  const shift = PEAK.todayShift;
  const pnl = PEAK.dayPnL;

  return (
    <div className="surface-dashboard">
      <div className="surface-head">
        <div className="surface-title-stack">
          <div className="surface-eyebrow">Friday May 15, 2026 · Lunch in service</div>
          <div className="surface-title">Today.</div>
        </div>
        <div className="surface-actions">
          <button className="btn btn-secondary"><Icon name="anchor" size={13}/>Pin reminder</button>
          <button className="btn btn-secondary"><Icon name="share" size={13}/>Share to ownership</button>
        </div>
      </div>

      {/* Hero status strip */}
      <div className="today-hero">
        <div className="hero-shift">
          <div className="hero-shift-state"><span className="live-dot"/>{shift.state}</div>
          <div className="hero-shift-name">Norma's · Lunch</div>
          <div className="hero-shift-sub">Robin · Maeve · Tyler</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-num">{shift.seated}<span className="small"> / {shift.capacity}</span></div>
          <div className="hero-stat-label">Covers seated</div>
          <div className="hero-stat-delta up">+3 vs. last Fri</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-num">{shift.walkIns}</div>
          <div className="hero-stat-label">Walk-ins</div>
          <div className="hero-stat-delta flat">2 turned · 25 min wait</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-num">{shift.turning}</div>
          <div className="hero-stat-label">Turning</div>
          <div className="hero-stat-delta flat">5 arriving · 1 late</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-num">${pnl.depositsCollected.toFixed(0)}</div>
          <div className="hero-stat-label">Deposits today</div>
          <div className="hero-stat-delta up">+$87 vs. LW</div>
        </div>
      </div>

      <TheTape openReceipt={openReceipt}/>

      {/* Two-up compare + Now & Next */}
      <div className="today-grid">
        <div className="lg-card">
          <div className="lg-card-head">
            <div>
              <div className="lg-card-eyebrow">Cover pacing · today vs. last Friday</div>
              <div className="lg-card-title" style={{marginTop: 4}}>
                Tracking{" "}
                <WhyPopover
                  eyebrow="Why is this number?"
                  body="Lunch is on plan (+3 covers vs last Fri). Dinner is the open question — 94 covers booked vs. 138 same-day last week. Booking velocity tightened after Tuesday's storm and hasn't fully recovered."
                  drivers={[
                    { k: "Lunch", v: "+3 vs LW" },
                    { k: "Dinner booked", v: "94 of typical 138" },
                    { k: "Walk-in lift expected", v: "~28 covers" }
                  ]}
                >
                  <span style={{color: "var(--accent)", fontWeight: 600, fontVariantNumeric: "tabular-nums"}}>−12%</span>
                </WhyPopover>
                {" "}toward today's plan
              </div>
            </div>
          </div>
          <DayPacingChart/>
        </div>

        <div className="lg-card">
          <div className="lg-card-head">
            <div className="lg-card-title">Now & Next</div>
            <span className="lg-card-eyebrow">{PEAK.NOW.time}</span>
          </div>
          <div className="now-next-list">
            {[
              { time: "12:30", name: "Park, Hyun-Jin", meta: "T31 · 2-top · returning · $14 deposit" },
              { time: "12:35", name: "Saito-Brown party", meta: "T40 · 6-top · VIP · $42 deposit", tag: "vip" },
              { time: "12:45", name: "Whitman, Lou", meta: "T17 · 4-top · ALLERGY: shellfish", tag: "allergy" },
              { time: "12:50", name: "Caldwell, R.", meta: "T41 · 2-top" },
              { time: "1:00",  name: "Brown, Brienna (lunch)", meta: "T42 · 4-top · VIP returning", tag: "vip" }
            ].map((it, i) => (
              <div className="now-next-item" key={i} onClick={() => openReceipt(["r-014","r-017","r-006","r-018","r-019"][i])}>
                <div className="nn-time">{it.time}</div>
                <div>
                  <div className="nn-name">{it.name}</div>
                  <div className="nn-meta">{it.meta}</div>
                </div>
                {it.tag && <div className={"nn-tag " + it.tag}>{it.tag === "vip" ? "VIP" : "ALLERGY"}</div>}
              </div>
            ))}
          </div>

          <div style={{marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", color: "var(--accent)", textTransform: "uppercase", padding: "10px 0 6px"}}>Next decisions</div>
          <div className="decision-list">
            <div className="decision-item urgent">
              <div style={{flex: 1}}>
                <div className="di-title">Walk-in turned away at bar (25 min wait)</div>
                <div className="di-sub">Bar opens 4 seats at 12:35. Reach Mei before they leave.</div>
                <div className="di-actions">
                  <button className="di-act primary">Offer bar at 12:35</button>
                  <button className="di-act">Quote 35 min</button>
                </div>
              </div>
            </div>
            <div className="decision-item">
              <div style={{flex: 1}}>
                <div className="di-title">Lai-Sutton 12-top hasn't confirmed for 8pm</div>
                <div className="di-sub">Booked 9 days ago. $240 deposit on file.</div>
                <div className="di-actions">
                  <button className="di-act primary">Text now</button>
                  <button className="di-act">Hold till 6pm</button>
                  <button className="di-act">Release</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Day P&L */}
      <div className="lg-card" style={{marginTop: 16}}>
        <div className="lg-card-head">
          <div>
            <div className="lg-card-eyebrow">Day P&L · running</div>
            <div className="lg-card-title">Money story so far</div>
          </div>
        </div>
        <div className="pnl-grid">
          <div className="pnl-cell">
            <span className="l">Deposits collected</span>
            <span className="v">${pnl.depositsCollected.toFixed(2)}</span>
            <span className="s">across 24 covers seated</span>
          </div>
          <div className="pnl-cell">
            <span className="l">Forfeited (no-show)</span>
            <span className="v warn">${pnl.depositsForfeited.toFixed(2)}</span>
            <span className="s">Otieno 2-top · T43</span>
          </div>
          <div className="pnl-cell">
            <span className="l">Refunds issued</span>
            <span className="v success">$0.00</span>
            <span className="s">First clean lunch this week</span>
          </div>
          <div className="pnl-cell">
            <span className="l">Net (est.)</span>
            <span className="v">${(pnl.depositsCollected + pnl.depositsForfeited - pnl.feesSoFar).toFixed(2)}</span>
            <span className="s">settles to bank Sun May 17</span>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TodaySurface, TodayNarrative, TodayDashboard, TheTape, DayPacingChart });
