// =========================================================================
// Reservations — Timeline + Cover Flow + Receipt drawer
// =========================================================================

function ReservationsSurface({ openReceipt, viewMode }) {
  return viewMode === "dashboard"
    ? <ReservationsDashboard openReceipt={openReceipt}/>
    : <ReservationsNarrative openReceipt={openReceipt}/>;
}

function ReservationsDashboard({ openReceipt }) {
  const [tab, setTab] = useState("timeline");

  return (
    <div className="surface-dashboard">
      <div className="surface-head">
        <div className="surface-title-stack">
          <div className="surface-eyebrow">Friday May 15 · tonight · main + private + bar</div>
          <div className="surface-title">The book.</div>
        </div>
        <div className="surface-actions">
          <div className="res-tabs">
            <button className={tab === "timeline" ? "active" : ""} onClick={() => setTab("timeline")}>Timeline</button>
            <button className={tab === "coverflow" ? "active" : ""} onClick={() => setTab("coverflow")}>Cover Flow</button>
          </div>
          <button className="btn btn-primary"><Icon name="plus" size={13}/>New reservation</button>
        </div>
      </div>

      {/* Filter row */}
      <div style={{display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap"}}>
        {[
          { id: "all", l: "All", c: 60, active: true },
          { id: "vip", l: "VIP", c: 8 },
          { id: "large", l: "6+ tops", c: 7 },
          { id: "allergy", l: "Allergy", c: 3 },
          { id: "unconfirmed", l: "Unconfirmed", c: 4 },
          { id: "deposit-issue", l: "Deposit issues", c: 2 }
        ].map(f => (
          <button key={f.id} style={{
            fontSize: 12, padding: "6px 12px", borderRadius: 999,
            border: "1px solid " + (f.active ? "rgba(201,166,113,0.32)" : "var(--border)"),
            background: f.active ? "rgba(201,166,113,0.08)" : "transparent",
            color: f.active ? "var(--accent)" : "var(--fg-muted)",
            cursor: "pointer"
          }}>
            {f.l} <span style={{fontFamily: "var(--font-mono)", marginLeft: 5, opacity: 0.6, fontSize: 10.5}}>{f.c}</span>
          </button>
        ))}
      </div>

      {tab === "timeline" && <TimelineView openReceipt={openReceipt}/>}
      {tab === "coverflow" && <CoverFlowView/>}
    </div>
  );
}

function ReservationsNarrative({ openReceipt }) {
  const dinnerRes = PEAK.tapeReservations.filter(r => r.startMin >= 240);
  const totalCovers = dinnerRes.reduce((s, r) => s + r.party, 0);
  const vipCount = dinnerRes.filter(r => r.vip).length;
  const unconfirmed = [
    { id: "r-021", name: "Lai-Sutton 12-top", time: "8:00 PM", reason: "Hasn't confirmed · last contact Mon", deposit: "$240", urgent: true },
    { id: "r-024", name: "Brown, Brienna 9-top", time: "8:45 PM", reason: "Tables 60 → 63 reassigned · needs final confirm", deposit: "$90" },
    { id: "r-019", name: "Brown, Brienna lunch", time: "1:00 PM", reason: "Server allergy note pending", deposit: "$35" },
    { id: "r-105", name: "Moore, Kathleen", time: "8:00 PM", reason: "Originally 6-top · party grew to 8", deposit: "$60" }
  ];

  return (
    <div className="surface-narrative">
      <NarrativeHero
        eyebrow={`Tonight · ${dinnerRes.length} reservations`}
        headline={`<em>${totalCovers}</em> covers on the book tonight.<br/><span class="muted-fragment">4 things need confirming.</span>`}
        sub={`Dinner ramps from 5:00 PM. <b>${vipCount} VIPs</b> · <b>3 allergies</b> on file · one private 9-top at 8:45. Tape opens at 5:30 with the first 4-top.`}
      />

      <SectionHeader title="Needs confirming" meta="before service"/>
      <div style={{display: "flex", flexDirection: "column", gap: 0, borderTop: "1px solid var(--divider)"}}>
        {unconfirmed.map((r, i) => (
          <div key={i} className="changed-item" style={{gridTemplateColumns: "72px 1fr auto auto"}} onClick={() => openReceipt(r.id)}>
            <div className="mono" style={{color: r.urgent ? "var(--peak-warning)" : "var(--accent)", fontSize: 13, letterSpacing: "0.04em"}}>{r.time}</div>
            <div className="changed-body">
              <div className="changed-headline">
                {r.name}
                {r.urgent && <span className="lg-nav-badge warn" style={{marginLeft: 10, fontSize: 9.5}}>UNCONFIRMED</span>}
              </div>
              <div className="changed-sub">{r.reason}</div>
            </div>
            <div className="mono" style={{color: "var(--fg)", fontSize: 13, alignSelf: "center"}}>{r.deposit}</div>
            <div className="changed-meta" style={{alignSelf: "center"}}>OPEN →</div>
          </div>
        ))}
      </div>

      <SectionHeader title="Look closer"/>

      <Expandable
        icon="clock"
        title="The Timeline · every table, every reservation"
        sub={`Tonight 5 PM → 10 PM across ${23} tables. Deposit-status colored edges. Click any pill for the Receipt.`}
      >
        <div style={{margin: "-12px -22px -16px"}}>
          <TimelineView openReceipt={openReceipt}/>
        </div>
      </Expandable>

      <Expandable
        icon="table"
        title="Cover Flow · demand pressure heatmap"
        sub="Tonight's 17 fifteen-minute slots × 16 tables. Cells tinted by demand including searches that didn't book."
        badge="27 missed covers"
      >
        <div style={{margin: "-12px -22px -16px"}}>
          <CoverFlowView/>
        </div>
      </Expandable>

      <Expandable
        icon="filter"
        title="Filters · VIP, allergy, large parties, deposit issues"
        sub="Slice the book by what matters to you right now."
      >
        <div style={{display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap"}}>
          {[
            { l: "All tonight", c: 60 },
            { l: "VIPs", c: 8 },
            { l: "6+ tops", c: 7 },
            { l: "Allergy notes", c: 3 },
            { l: "Unconfirmed", c: 4 },
            { l: "Deposit issues", c: 2 },
            { l: "Returning guests", c: 18 },
            { l: "First-time guests", c: 14 },
          ].map((f, i) => (
            <button key={i} className="btn btn-secondary" style={{fontSize: 12}}>{f.l} <span className="mono" style={{marginLeft: 6, opacity: 0.6, fontSize: 10.5}}>{f.c}</span></button>
          ))}
        </div>
      </Expandable>
    </div>
  );
}

// ---------- TIMELINE ----------
function TimelineView({ openReceipt }) {
  // Tables to render
  const tables = [
    { id: 11, type: "2-top" }, { id: 12, type: "2-top" }, { id: 13, type: "banquette" },
    { id: 14, type: "2-top" }, { id: 15, type: "4-top" }, { id: 17, type: "2-top" },
    { id: 20, type: "round" }, { id: 21, type: "4-top" }, { id: 23, type: "banquette" },
    { id: 24, type: "2-top" }, { id: 25, type: "4-top" }, { id: 27, type: "2-top" },
    { id: 30, type: "2-top" }, { id: 31, type: "2-top" }, { id: 32, type: "4-top" },
    { id: 40, type: "round-6" }, { id: 41, type: "2-top" }, { id: 42, type: "4-top" }, { id: 43, type: "2-top" },
    { id: 60, type: "private" }, { id: 61, type: "private" }, { id: 62, type: "private" }, { id: 63, type: "private-9" },
  ];

  // Slots: 5pm → 10pm (20 slots @ 15 min)
  const slotCount = 20;
  const startHour = 17;
  const slotW = 38;
  const labelW = 90;
  const rowH = 30;
  const totalW = labelW + slotCount * slotW;

  // Get evening reservations only (startMin >= 240 — 3pm onward)
  const dinnerRes = PEAK.tapeReservations.filter(r => r.startMin >= 240);
  function pillFor(table) {
    return dinnerRes.filter(r => r.table === table);
  }
  function xFor(min) { return labelW + ((min - 360) / 15) * slotW; } // 360 = 5pm offset from 11am

  // Now line: at 12:15 — way before 5pm so don't render
  return (
    <div className="timeline-grid">
      <div style={{overflowX: "auto"}}>
        <div style={{minWidth: totalW}}>
          {/* Time header */}
          <div style={{display: "grid", gridTemplateColumns: `${labelW}px 1fr`, borderBottom: "1px solid var(--divider)"}}>
            <div className="timeline-section-label" style={{borderBottom: "none"}}>MAIN</div>
            <div style={{display: "grid", gridTemplateColumns: `repeat(${slotCount}, ${slotW}px)`, fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-muted)", letterSpacing: "0.04em", paddingTop: 6}}>
              {Array.from({length: slotCount}).map((_, i) => {
                const h24 = startHour + Math.floor(i / 4);
                const m = (i % 4) * 15;
                const isHour = m === 0;
                const h = h24 > 12 ? h24 - 12 : h24;
                const ap = h24 >= 12 ? "pm" : "am";
                return (
                  <div key={i} style={{padding: "6px 0 8px 4px", borderLeft: isHour ? "1px solid var(--divider)" : "none", color: isHour ? "var(--fg)" : "var(--fg-subtle)"}}>
                    {isHour ? `${h}:${String(m).padStart(2, "0")}${ap}` : ""}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rows */}
          {tables.map(t => {
            const pills = pillFor(t.id);
            return (
              <div className="timeline-row" key={t.id} style={{display: "grid", gridTemplateColumns: `${labelW}px 1fr`, height: rowH}}>
                <div className="timeline-row-label" style={{borderRight: "1px solid var(--divider)"}}>
                  <span style={{fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 500, color: "var(--fg)"}}>{t.id}</span>
                  <span style={{fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--fg-subtle)", letterSpacing: "0.04em"}}>{t.type}</span>
                </div>
                <div className="timeline-cell-area" style={{position: "relative", background: "transparent"}}>
                  {/* Slot grid */}
                  {Array.from({length: slotCount}).map((_, i) => (
                    <div key={i} style={{
                      position: "absolute", top: 0, bottom: 0,
                      left: i * slotW, width: slotW,
                      borderLeft: i % 4 === 0 && i > 0 ? "1px solid var(--divider)" : "1px solid rgba(255,255,255,0.02)"
                    }}/>
                  ))}
                  {pills.map(p => {
                    const x = xFor(p.startMin);
                    const w = (p.durMin / 15) * slotW - 2;
                    return (
                      <div
                        key={p.id}
                        className={"res-pill deposit-" + p.deposit}
                        style={{left: x, width: w, top: 3, bottom: 3, position: "absolute"}}
                        onClick={() => openReceipt(p.id)}
                      >
                        <span className="deposit-edge"/>
                        {p.vip && <span className="pill-vip">★</span>}
                        <span className="pill-name">{p.name.split(",")[0]}</span>
                        <span className="pill-pax">·{p.party}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* PRIVATE section divider */}
          <div className="timeline-section-label" style={{borderTop: "1px solid var(--divider)"}}>PRIVATE</div>
        </div>
      </div>

      {/* Legend */}
      <div style={{display: "flex", alignItems: "center", gap: 24, padding: "14px 18px", borderTop: "1px solid var(--divider)", fontSize: 11, color: "var(--fg-muted)"}}>
        <span className="swatch" style={{display: "inline-flex", alignItems: "center", gap: 6}}><i style={{width: 4, height: 14, background: "var(--peak-success)", display: "inline-block"}}/>Deposit paid</span>
        <span className="swatch" style={{display: "inline-flex", alignItems: "center", gap: 6}}><i style={{width: 4, height: 14, background: "var(--peak-info)", display: "inline-block"}}/>Refunded</span>
        <span className="swatch" style={{display: "inline-flex", alignItems: "center", gap: 6}}><i style={{width: 4, height: 14, background: "var(--peak-brass-400)", display: "inline-block"}}/>Forfeited</span>
        <span className="swatch" style={{display: "inline-flex", alignItems: "center", gap: 6}}><i style={{width: 4, height: 14, background: "var(--peak-danger)", display: "inline-block"}}/>Disputed</span>
        <span style={{marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-subtle)", letterSpacing: "0.04em"}}>Click any reservation → Receipt drawer</span>
      </div>
    </div>
  );
}

// ---------- COVER FLOW ----------
function CoverFlowView() {
  const cf = PEAK.coverFlow;
  const [view, setView] = useState("demand"); // capacity | demand | revenue
  const [hover, setHover] = useState(null);

  function demandClass(d, booked, cap) {
    if (cap === 0) return "closed";
    if (booked > 0 && booked >= cap) return "full";
    const lvl = d;
    if (lvl >= 4) return "demand-peak";
    if (lvl >= 3) return "demand-high";
    if (lvl >= 2) return "demand-med";
    return "demand-low";
  }

  return (
    <div>
      <div className="coverflow-grid">
        {/* Demand pressure intro */}
        <div style={{display: "flex", alignItems: "center", gap: 16, marginBottom: 16, padding: "12px 14px", background: "var(--peak-ink-700)", borderRadius: 8, border: "1px solid var(--border)"}}>
          <Icon name="bolt" size={16}/>
          <div style={{flex: 1, fontSize: 12.5, color: "var(--fg)"}}>
            <b style={{fontWeight: 600}}>Demand pressure layer is on.</b>{" "}
            <span style={{color: "var(--fg-muted)"}}>Cells are tinted by how much demand actually hit each slot — including the searches that didn't book. The 6:45 – 7:15 PM band lost <b style={{color: "var(--peak-warning)"}}>27 cover-equivalents of pressure</b> across tables 17, 20, 24 tonight.</span>
          </div>
          <div className="tape-toggle">
            <button className={view === "capacity" ? "active" : ""} onClick={() => setView("capacity")}>Capacity</button>
            <button className={view === "demand" ? "active" : ""} onClick={() => setView("demand")}>Demand</button>
            <button className={view === "revenue" ? "active" : ""} onClick={() => setView("revenue")}>Revenue</button>
          </div>
        </div>

        <div style={{overflowX: "auto"}}>
          <table className="cf-table" style={{minWidth: 1000, position: "relative"}}>
            <thead>
              <tr>
                <th className="row-h"/>
                {cf.slots.map(s => <th key={s}>{s}</th>)}
              </tr>
            </thead>
            <tbody>
              {cf.tables.map((t, ti) => (
                <tr key={t}>
                  <td className="cf-row-label">T{t}</td>
                  {cf.cells[ti].map((cell, si) => (
                    <td key={si} style={{padding: 0}}>
                      <div
                        className={"cf-cell " + demandClass(cell.demand, cell.booked, cell.cap)}
                        onMouseEnter={() => setHover({ ti, si, cell })}
                        onMouseLeave={() => setHover(null)}
                      >
                        {cell.booked > 0 ? (
                          <div style={{display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1}}>
                            <span className="cf-booked">{cell.booked}</span>
                            {cell.cap > 0 && <span className="cf-cap">/{cell.cap}</span>}
                          </div>
                        ) : cell.cap > 0 ? (
                          <span className="cf-cap" style={{fontSize: 10}}>—</span>
                        ) : null}
                        {cell.missed > 0 && view === "demand" && (
                          <span className="demand-burst">+{cell.missed}</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="cf-foot-row">
                <td className="cf-row-label" style={{fontWeight: 600}}>Total</td>
                {cf.slots.map((s, si) => {
                  const bookedSum = cf.cells.reduce((sum, row) => sum + row[si].booked, 0);
                  const capSum = cf.cells.reduce((sum, row) => sum + (row[si].cap || 0), 0);
                  return (
                    <td key={s} className="cf-foot-cell">
                      <div className="booked-vs-cap"><b>{bookedSum}</b><span style={{color: "var(--fg-subtle)"}}>/{capSum}</span></div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>

          {/* Hover tooltip */}
          {hover && (
            <div className="lg-tooltip" style={{position: "fixed", left: "60%", top: "60%", zIndex: 30}}>
              <div className="tt-eyebrow">T{cf.tables[hover.ti]} · {hover.cell.slot} PM</div>
              <div className="tt-row"><span>Booked</span><span className="v">{hover.cell.booked} of {hover.cell.cap}</span></div>
              <div className="tt-row"><span>Demand pressure</span><span className="v" style={{color: "var(--accent)"}}>{["—", "Low", "Med", "High", "Peak"][hover.cell.demand]}</span></div>
              {hover.cell.missed > 0 && <div className="tt-row"><span>Searches → no book</span><span className="v" style={{color: "var(--peak-warning)"}}>+{hover.cell.missed}</span></div>}
            </div>
          )}
        </div>

        <div className="cf-legend-row">
          <span className="swatch" style={{display: "inline-flex", alignItems: "center", gap: 6}}><i style={{width: 12, height: 12, borderRadius: 3, background: "var(--peak-ink-600)", border: "1px solid var(--border)", display: "inline-block"}}/>Booked / capacity</span>
          <span className="swatch" style={{display: "inline-flex", alignItems: "center", gap: 6}}><i style={{width: 12, height: 12, borderRadius: 3, background: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.06) 4px, rgba(255,255,255,0.06) 8px)", display: "inline-block"}}/>Closed</span>
          <span className="swatch" style={{display: "inline-flex", alignItems: "center", gap: 6, color: "var(--peak-warning)"}}><i style={{width: 6, height: 6, borderRadius: 2, background: "var(--peak-warning)", display: "inline-block"}}/>+N = searches that didn't convert</span>
          <div className="demand-scale">
            <span style={{fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-subtle)", letterSpacing: "0.06em", textTransform: "uppercase"}}>Demand</span>
            <i style={{background: "rgba(201,166,113,0.04)"}}/>
            <i style={{background: "rgba(201,166,113,0.10)"}}/>
            <i style={{background: "rgba(201,166,113,0.18)"}}/>
            <i style={{background: "rgba(201,166,113,0.28)", border: "1px solid rgba(201,166,113,0.45)"}}/>
            <span style={{fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-subtle)", marginLeft: 4}}>peak</span>
          </div>
        </div>
      </div>

      {/* Below: demand losses callout */}
      <div className="lg-card" style={{marginTop: 14}}>
        <div className="lg-card-head">
          <div>
            <div className="lg-card-eyebrow">Where the missed money lives · tonight 6:45 – 7:30 PM</div>
            <div className="lg-card-title">27 cover-equivalents of demand pressure went unbooked</div>
          </div>
          <button className="btn btn-secondary">Open as report</button>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 4}}>
          {[
            { slot: "6:45 PM", t: "T17", searches: 9, booked: 0, est: "$140", note: "Window 2-top — 'romantic dinner' search bursts after 5pm" },
            { slot: "7:00 PM", t: "T20 / T24", searches: 12, booked: 4, est: "$320", note: "6-top capacity outstripped by group-of-4 demand" },
            { slot: "7:15 PM", t: "T42", searches: 6, booked: 2, est: "$220", note: "Wed-night seating pattern persisting into Fri" },
          ].map((it, i) => (
            <div className="lg-card tight" key={i} style={{background: "var(--peak-ink-700)"}}>
              <div className="lg-card-eyebrow">{it.slot} · {it.t}</div>
              <div style={{display: "flex", alignItems: "baseline", gap: 10, marginTop: 6}}>
                <div style={{fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500, color: "var(--accent)"}}>{it.est}</div>
                <div className="mono subtle" style={{fontSize: 11}}>est. lost</div>
              </div>
              <div style={{fontSize: 11.5, color: "var(--fg-muted)", marginTop: 8, lineHeight: 1.5}}>
                <span className="mono" style={{color: "var(--fg)"}}>{it.searches}</span> searches → <span className="mono" style={{color: "var(--fg)"}}>{it.booked}</span> booked. {it.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ReservationsSurface });
