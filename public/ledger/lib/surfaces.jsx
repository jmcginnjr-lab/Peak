// =========================================================================
// Remaining surfaces — Guests, Forecast, Reports, Reconciliation, Activity, Settings
// =========================================================================

// ---------- GUESTS ----------
function GuestsSurface({ openReceipt, viewMode }) {
  const [sort, setSort] = useState("ltv");
  return (
    <div className="surface-narrative">
      <NarrativeHero
        eyebrow="All-time · 4,287 guests"
        headline={`<em>142 VIPs</em>.<br/><span class="muted-fragment">486 regulars driving 62% of revenue.</span>`}
        sub={`Repeat rate is <b>41%</b> — up 2 points from Q1. Nine guests carry a risk flag (3+ no-shows or an open dispute). Brienna Brown is tonight — VIP returning, tree-nut allergy on file.`}
      />

      <SectionHeader title="Top guests by LTV" meta="all-time"/>
      <div style={{display: "flex", justifyContent: "flex-end", marginBottom: 4}}>
        <div className="tape-toggle">
          {["ltv", "visits", "recent"].map(s => (
            <button key={s} className={sort === s ? "active" : ""} onClick={() => setSort(s)}>
              {s === "ltv" ? "LTV" : s === "visits" ? "Visits" : "Recent"}
            </button>
          ))}
        </div>
      </div>
      <div style={{borderTop: "1px solid var(--divider)"}}>
        {PEAK.guests.slice(0, 6).map((g, i) => (
          <div key={i} className="guest-row" style={{gridTemplateColumns: "40px 1.4fr 1fr 80px 100px 80px"}} onClick={() => g.name === "Brienna Brown" && openReceipt("r-024")}>
            <div className="g-avatar">{g.initials}</div>
            <div>
              <div className="g-name">{g.name}</div>
              <div className="g-tags">
                {g.tags.map(t => <span key={t} className={"tag-chip " + t.toLowerCase()}>{t}</span>)}
                {g.risk && <span className="tag-chip risk">RISK</span>}
              </div>
            </div>
            <div className="g-meta">{g.note}</div>
            <div className="g-num">{g.visits}<span className="sub">VISITS</span></div>
            <div className="g-num">${g.ltv.toLocaleString()}<span className="sub">LTV</span></div>
            <div className="g-num">{g.last}<span className="sub">LAST</span></div>
          </div>
        ))}
      </div>

      <SectionHeader title="Look closer"/>

      <Expandable
        icon="users"
        title="All 4,287 guests · search, filter, segment"
        sub="Cohort lens by tag, visits, LTV band. Export segments."
      >
        <DataTable
          csvName="guests.csv"
          defaultSort={{ key: "ltv", dir: "desc" }}
          onRowClick={(r) => r.name === "Brienna Brown" && openReceipt("r-024")}
          columns={[
            { key: "name", label: "Guest", render: r => (
              <div style={{display: "flex", alignItems: "center", gap: 10}}>
                <div className="g-avatar" style={{width: 28, height: 28, fontSize: 10}}>{r.initials}</div>
                <div>
                  <div style={{color: "var(--fg)", fontWeight: 500}}>{r.name}</div>
                  <div style={{display: "flex", gap: 4, marginTop: 2}}>
                    {r.tags.map(t => <span key={t} className={"tag-chip " + t.toLowerCase()}>{t}</span>)}
                    {r.risk && <span className="tag-chip risk">RISK</span>}
                  </div>
                </div>
              </div>
            ), sortValue: r => r.name },
            { key: "tags", label: "Tag", filterable: true, filterValue: r => r.tags[0] || "—", render: r => r.tags.join(", ") || "—", csvValue: r => r.tags.join("|") },
            { key: "note", label: "Note" },
            { key: "visits", label: "Visits", num: true, sortValue: r => r.visits },
            { key: "ltv", label: "LTV", num: true, render: r => "$" + r.ltv.toLocaleString(), sortValue: r => r.ltv, csvValue: r => r.ltv },
            { key: "last", label: "Last visit" }
          ]}
          rows={PEAK.guests}
        />
      </Expandable>

      <Expandable
        icon="trend"
        title="Cohort & segment health"
        sub="VIPs, regulars, lapsed, at-risk — counts and trends YTD."
      >
        <div className="kpi-row" style={{gridTemplateColumns: "repeat(4, 1fr)", margin: 0}}>
          <div className="kpi">
            <span className="kpi-label">VIPs</span>
            <span className="kpi-value">142</span>
            <div className="kpi-foot"><span className="kpi-delta up">▲ 6 MoM</span><span className="kpi-sub">3.3% of base</span></div>
          </div>
          <div className="kpi">
            <span className="kpi-label">Regulars (4+ visits)</span>
            <span className="kpi-value">486</span>
            <div className="kpi-foot"><span className="kpi-delta up">▲ 3.1%</span><span className="kpi-sub">62% of YTD rev</span></div>
          </div>
          <div className="kpi">
            <span className="kpi-label">Repeat rate</span>
            <span className="kpi-value">41%</span>
            <div className="kpi-foot"><span className="kpi-delta up">▲ 2pp</span><span className="kpi-sub">vs. Q1</span></div>
          </div>
          <div className="kpi">
            <span className="kpi-label">Risk flags</span>
            <span className="kpi-value" style={{color: "#D98B80"}}>9</span>
            <div className="kpi-foot"><span className="kpi-sub">3+ no-shows or dispute</span></div>
          </div>
        </div>
      </Expandable>
    </div>
  );
}

// ---------- FORECAST ----------
function ForecastSurface({ viewMode, compareMode, setCompareMode }) {
  return viewMode === "dashboard"
    ? <ForecastDashboard compareMode={compareMode} setCompareMode={setCompareMode}/>
    : <ForecastNarrative compareMode={compareMode} setCompareMode={setCompareMode}/>;
}

function ForecastDashboard({ compareMode, setCompareMode }) {
  const fc = PEAK.forecast;
  return (
    <div className="surface-dashboard">
      <div className="surface-head">
        <div className="surface-title-stack">
          <div className="surface-eyebrow">Forecast · May 15 – May 21</div>
          <div className="surface-title">What's coming.</div>
        </div>
        <div className="surface-actions">
          <SurfaceControls
            compareMode={compareMode}
            setCompareMode={setCompareMode}
          />
          <div className="tape-toggle">
            <button className="active">7-day</button>
            <button>30 / 60 / 90</button>
          </div>
        </div>
      </div>

      {/* Headline call-out */}
      <div className="lg-card" style={{marginBottom: 14, borderLeft: "2px solid var(--peak-warning)", background: "linear-gradient(180deg, rgba(194,146,68,0.04), var(--bg-card))"}}>
        <div style={{display: "flex", alignItems: "center", gap: 18}}>
          <Icon name="warn" size={20}/>
          <div style={{flex: 1}}>
            <div className="lg-card-eyebrow" style={{color: "var(--peak-warning)"}}>Soft Saturday — flag from anomaly engine</div>
            <div className="lg-card-title" style={{marginTop: 4, fontSize: 16}}>Sat May 16 pacing at <span style={{color: "var(--peak-warning)"}}>22%</span> of typical Saturday demand.</div>
            <div style={{fontSize: 13, color: "var(--fg-muted)", marginTop: 6, lineHeight: 1.55}}>
              91 covers on the book by Friday lunch. The trailing 4 Saturdays averaged 398. New bookings down 62%, concierge channel −84%. Weather forecast clear.
            </div>
          </div>
          <button className="btn btn-secondary">Add annotation</button>
          <button className="btn btn-primary">Open in Activity</button>
        </div>
      </div>

      <div className="forecast-week-grid">
        {fc.map((d, i) => {
          const pct = Math.round((d.booked / d.target) * 100);
          return (
            <div key={i} className={"fc-day " + (d.alert ? "alert" : "")}>
              <div className="fc-dow">{d.dow}{d.label && <span style={{marginLeft: 6, color: d.alert ? "var(--peak-warning)" : "var(--peak-success)"}}>· {d.label}</span>}</div>
              <div className="fc-date">{d.date}</div>
              <div className="fc-cov">{d.booked}</div>
              <div className="mono subtle" style={{fontSize: 10.5, letterSpacing: "0.04em"}}>covers booked · {d.paid} paid</div>
              <div className="fc-bar">
                <div className="fc-bar-fill" style={{width: Math.min(pct, 100) + "%"}}/>
                <div className="fc-bar-target" style={{left: "100%"}}/>
              </div>
              <div style={{fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-subtle)", letterSpacing: "0.06em"}}>vs target {d.target}</div>
              <div className={"fc-pace " + (d.pace < -10 ? "behind" : d.pace > 5 ? "ahead" : "flat")}>
                <span>{d.pace > 0 ? "▲" : d.pace < 0 ? "▼" : "—"} {Math.abs(d.pace)}%</span>
                <span style={{color: "var(--fg-subtle)"}}>vs LW</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="lg-card" style={{marginTop: 14}}>
        <div className="lg-card-head">
          <div>
            <div className="lg-card-eyebrow">Booking pacing · this week vs. trailing 4 same-DOWs</div>
            <div className="lg-card-title">When the bookings usually come in</div>
          </div>
        </div>
        <PacingChart/>
      </div>

      <div className="lg-card" style={{marginTop: 14}}>
        <div className="lg-card-head">
          <div>
            <div className="lg-card-eyebrow">Capacity gaps · ranked by historical fill</div>
            <div className="lg-card-title">Where to push for bookings this week</div>
          </div>
        </div>
        <table className="lg-table">
          <thead>
            <tr>
              <th>Slot</th>
              <th>Day</th>
              <th>Current fill</th>
              <th>Typical fill</th>
              <th className="num">Lift opportunity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>7:00 PM</td><td>Sat May 16</td><td>22%</td><td>96%</td><td className="num" style={{color: "var(--accent)"}}>$2,840</td><td><button className="ex-act primary" style={{fontSize: 11, padding: "5px 10px"}}>Push to concierge</button></td></tr>
            <tr><td>7:30 PM</td><td>Sat May 16</td><td>18%</td><td>92%</td><td className="num" style={{color: "var(--accent)"}}>$2,360</td><td><button className="ex-act" style={{fontSize: 11, padding: "5px 10px"}}>Offer move-up</button></td></tr>
            <tr><td>6:00 PM</td><td>Sun May 17</td><td>32%</td><td>78%</td><td className="num" style={{color: "var(--accent)"}}>$1,120</td><td><button className="ex-act" style={{fontSize: 11, padding: "5px 10px"}}>Email regulars</button></td></tr>
            <tr><td>8:30 PM</td><td>Sat May 16</td><td>14%</td><td>68%</td><td className="num">$840</td><td><button className="ex-act" style={{fontSize: 11, padding: "5px 10px"}}>Hold for VIPs</button></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ForecastNarrative({ compareMode, setCompareMode }) {
  const fc = PEAK.forecast;
  return (
    <div className="surface-narrative">
      <NarrativeHero
        eyebrow="Forecast · May 15 – May 21"
        headline={`One <em>soft Saturday</em>.<br/><span class="muted-fragment">Otherwise normal.</span>`}
        sub={`Saturday May 16 is pacing at <b>22%</b> of typical demand — 91 covers booked vs. typical 407. <span class="accent">Concierge channel is down 84%</span> — that's the signal. Weather forecast clear, no promo paused.`}
      >
        <div style={{marginTop: 22}}>
          <SurfaceControls
            compareMode={compareMode}
            setCompareMode={setCompareMode}
          />
        </div>
      </NarrativeHero>

      <FocusCard
        tone="urgent"
        eyebrow="Soft Saturday · flagged by anomaly engine"
        title="Sat May 16 needs a push — or a story for ownership"
        body="316 covers below typical Saturday demand. <b>Concierge channel −84%</b> is unusual; direct bookings only −54%. Reaching out to the concierge desks tomorrow morning may recover 80–120 covers."
        actions={
          <div style={{display: "contents"}}>
            <button className="btn btn-secondary">Add annotation</button>
            <button className="btn btn-primary"><Icon name="external" size={13}/>Investigate</button>
          </div>
        }
      />

      <SectionHeader title="Look closer"/>

      <Expandable
        icon="calendar"
        title="The 7-day grid · every day, every cover"
        sub="Booked vs target with pacing deltas. Click any day to drill in."
        defaultOpen={true}
      >
        <div className="forecast-week-grid">
          {fc.map((d, i) => {
            const pct = Math.round((d.booked / d.target) * 100);
            return (
              <div key={i} className={"fc-day " + (d.alert ? "alert" : "")}>
                <div className="fc-dow">{d.dow}{d.label && <span style={{marginLeft: 6, color: d.alert ? "var(--peak-warning)" : "var(--peak-success)"}}>· {d.label}</span>}</div>
                <div className="fc-date">{d.date}</div>
                <div className="fc-cov">{d.booked}</div>
                <div className="mono subtle" style={{fontSize: 10.5, letterSpacing: "0.04em"}}>covers booked · {d.paid} paid</div>
                <div className="fc-bar">
                  <div className="fc-bar-fill" style={{width: Math.min(pct, 100) + "%"}}/>
                  <div className="fc-bar-target" style={{left: "100%"}}/>
                </div>
                <div style={{fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-subtle)", letterSpacing: "0.06em"}}>vs target {d.target}</div>
                <div className={"fc-pace " + (d.pace < -10 ? "behind" : d.pace > 5 ? "ahead" : "flat")}>
                  <span>{d.pace > 0 ? "▲" : d.pace < 0 ? "▼" : "—"} {Math.abs(d.pace)}%</span>
                  <span style={{color: "var(--fg-subtle)"}}>vs LW</span>
                </div>
              </div>
            );
          })}
        </div>
      </Expandable>

      <Expandable
        icon="trend"
        title="Booking pacing curve · this week vs. trailing 4 same-DOWs"
        sub="When the bookings usually come in vs. when they're coming in now."
      >
        <PacingChart/>
      </Expandable>

      <Expandable
        icon="bolt"
        title="Capacity gaps · ranked by historical fill"
        sub="Where to push for bookings this week. $7,160 in estimated lift across 4 unfilled slots."
        badge="$7,160 lift"
      >
        <table className="lg-table" style={{marginTop: -8}}>
          <thead>
            <tr>
              <th>Slot</th>
              <th>Day</th>
              <th>Current fill</th>
              <th>Typical fill</th>
              <th className="num">Lift opportunity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>7:00 PM</td><td>Sat May 16</td><td>22%</td><td>96%</td><td className="num" style={{color: "var(--accent)"}}>$2,840</td><td><button className="ex-act primary" style={{fontSize: 11, padding: "5px 10px"}}>Push to concierge</button></td></tr>
            <tr><td>7:30 PM</td><td>Sat May 16</td><td>18%</td><td>92%</td><td className="num" style={{color: "var(--accent)"}}>$2,360</td><td><button className="ex-act" style={{fontSize: 11, padding: "5px 10px"}}>Offer move-up</button></td></tr>
            <tr><td>6:00 PM</td><td>Sun May 17</td><td>32%</td><td>78%</td><td className="num" style={{color: "var(--accent)"}}>$1,120</td><td><button className="ex-act" style={{fontSize: 11, padding: "5px 10px"}}>Email regulars</button></td></tr>
            <tr><td>8:30 PM</td><td>Sat May 16</td><td>14%</td><td>68%</td><td className="num">$840</td><td><button className="ex-act" style={{fontSize: 11, padding: "5px 10px"}}>Hold for VIPs</button></td></tr>
          </tbody>
        </table>
      </Expandable>
    </div>
  );
}

function PacingChart() {
  // Days out from service (booking lead-time curve)
  const days = ["28d out", "21d", "14d", "7d", "5d", "3d", "2d", "1d", "Day-of"];
  const baseline = [60, 110, 180, 280, 320, 360, 380, 395, 410];
  const thisWeek = [38, 64, 95, 86, 88, 90, 91, null, null];

  const w = 720, h = 200;
  const pad = { top: 16, right: 24, bottom: 30, left: 36 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const max = 420;
  const xFor = i => pad.left + (i / (days.length - 1)) * innerW;
  const yFor = v => pad.top + innerH - (v / max) * innerH;

  const basePath = baseline.map((v, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(v)}`).join(" ");
  const thisPath = thisWeek.filter(v => v != null).map((v, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(v)}`).join(" ");

  return (
    <svg className="compare-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{height: h + "px"}}>
      {[0, 100, 200, 300, 400].map(v => (
        <g key={v}>
          <line x1={pad.left} x2={w - pad.right} y1={yFor(v)} y2={yFor(v)} className="compare-grid-line"/>
          <text x={pad.left - 8} y={yFor(v) + 3} className="compare-axis-label" textAnchor="end">{v}</text>
        </g>
      ))}
      <path d={basePath} className="compare-ribbon-prev"/>
      <path d={thisPath + ` L ${xFor(6)} ${pad.top + innerH} L ${xFor(0)} ${pad.top + innerH} Z`} className="compare-ribbon-now-fill"/>
      <path d={thisPath} className="compare-ribbon-now"/>
      {thisWeek.map((v, i) => v != null && <circle key={i} cx={xFor(i)} cy={yFor(v)} r="3" className="compare-now-dot"/>)}
      {days.map((d, i) => <text key={d} x={xFor(i)} y={h - 10} className="compare-axis-label" textAnchor="middle">{d}</text>)}

      {/* arrow showing the gap */}
      <line x1={xFor(7)} y1={yFor(91)} x2={xFor(7)} y2={yFor(395)} stroke="var(--peak-warning)" strokeWidth="1.5" strokeDasharray="3 2"/>
      <text x={xFor(7) + 8} y={yFor(243)} fontSize="11" fill="var(--peak-warning)" fontFamily="JetBrains Mono">−76% of typical</text>
    </svg>
  );
}

// ---------- REPORTS ----------
function ReportsSurface() {
  return (
    <div className="surface-narrative">
      <NarrativeHero
        eyebrow={`Reports · ${PEAK.reports.length} saved`}
        headline={`The <em>Weekly Brief</em> is ready.<br/><span class="muted-fragment">Six other reports saved.</span>`}
        sub="Auto-rendered Sunday morning · one-page narrative for ownership. Add your two-line note and it sends. Below: the rest of the report library."
      />

      <FocusCard
        eyebrow="Sunday May 17 · Owner's email"
        title="Weekly Operator Brief · Week of May 8 – 14"
        body="<b>A clean week, with one corporate cancellation that mattered.</b> Net $9,114 (−4% WoW). Refunds elevated on May 13 but single-source. Saturday next week pacing soft — needs a note."
        actions={
          <div style={{display: "contents"}}>
            <button className="btn btn-secondary"><Icon name="external" size={13}/>Preview</button>
            <button className="btn btn-primary"><Icon name="mail" size={13}/>Send Sunday 7 AM</button>
          </div>
        }
      />

      <SectionHeader title="Report library"/>
      <div className="report-grid">
        {PEAK.reports.map((r, i) => (
          <div key={i} className="report-card">
            <div className="rc-eyebrow">{r.eyebrow}</div>
            <div className="rc-title">{r.title}</div>
            <div className="rc-sub">{r.sub}</div>
            <div className="rc-foot">
              <span>{r.foot}</span>
              <span className="rc-arrow">OPEN →</span>
            </div>
          </div>
        ))}
        <div className="report-card" style={{borderStyle: "dashed", justifyContent: "center", alignItems: "center", textAlign: "center", color: "var(--fg-muted)"}}>
          <Icon name="plus" size={22}/>
          <div className="rc-title" style={{fontSize: 18, color: "var(--fg-muted)"}}>Build a custom report</div>
          <div className="rc-sub">Any drill-down view can be saved here.</div>
        </div>
      </div>

      <SectionHeader title="Look closer"/>

      <Expandable
        icon="report"
        title="Preview the Weekly Brief"
        sub="What ownership sees Sunday morning."
      >
        <div className="peak-eyebrow" style={{marginBottom: 8}}>NORMA'S · WEEK OF MAY 8 – 14, 2026</div>
        <div style={{fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--fg)", lineHeight: 1.1, marginBottom: 18}}>
          A clean week, with one corporate cancellation that mattered.
        </div>
        <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, padding: "16px 0", borderTop: "1px solid var(--divider)", borderBottom: "1px solid var(--divider)"}}>
          <div>
            <div className="kpi-label">Net</div>
            <div style={{fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.02em"}}>$9,114</div>
            <div className="mono subtle" style={{fontSize: 11}}>▼ 4% WoW</div>
          </div>
          <div>
            <div className="kpi-label">Covers</div>
            <div style={{fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.02em"}}>1,242</div>
            <div className="mono subtle" style={{fontSize: 11}}>▲ 6 vs LW</div>
          </div>
          <div>
            <div className="kpi-label">Refunds</div>
            <div style={{fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500, color: "#D98B80", letterSpacing: "-0.02em"}}>$1,240</div>
            <div className="mono subtle" style={{fontSize: 11}}>1 large event</div>
          </div>
          <div>
            <div className="kpi-label">Next week</div>
            <div style={{fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500, color: "var(--peak-warning)", letterSpacing: "-0.02em"}}>Soft Sat</div>
            <div className="mono subtle" style={{fontSize: 11}}>investigate</div>
          </div>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 18}}>
          <div>
            <div className="peak-eyebrow" style={{marginBottom: 8}}>THREE THINGS THAT CHANGED</div>
            <ol style={{margin: 0, padding: "0 0 0 18px", color: "var(--fg)", fontSize: 13.5, lineHeight: 1.65}}>
              <li>Corporate cancellation Friday May 13 — 4 parties, $1,240 in refunds, $285 retained as fee.</li>
              <li>Tuesday weather: 1.4" rain through service, covers down 38%.</li>
              <li>Net average deposit up $3.20 after the May 1 increase — no conversion hit.</li>
            </ol>
          </div>
          <div>
            <div className="peak-eyebrow" style={{marginBottom: 8}}>TWO THINGS TO WATCH</div>
            <ol style={{margin: 0, padding: "0 0 0 18px", color: "var(--fg)", fontSize: 13.5, lineHeight: 1.65}}>
              <li>Saturday May 16 demand soft for the third week running. Concierge channel −84%.</li>
              <li>T43 turn-time anomaly — Tyler section. Already shadowed by Maeve.</li>
            </ol>
          </div>
        </div>
      </Expandable>
    </div>
  );
}

// ---------- RECONCILIATION ----------
function ReconciliationSurface() {
  const rc = PEAK.reconciliation;
  const [resolved, setResolved] = useState({});

  function resolve(i) {
    setResolved({ ...resolved, [i]: true });
  }
  const remaining = rc.exceptions.length - Object.values(resolved).filter(Boolean).length;
  const canClose = remaining === 0;

  return (
    <div className="surface-narrative">
      <NarrativeHero
        eyebrow={`Period · ${rc.period}`}
        headline={
          canClose
            ? `Ready to <em>close</em>.<br/><span class="muted-fragment">Zero exceptions.</span>`
            : `<em>${remaining}</em> exception${remaining === 1 ? "" : "s"} to clear.<br/><span class="muted-fragment">Then you can close.</span>`
        }
        sub={canClose
          ? `All 384 transactions reconciled. Click <b>Close & sign period</b> to lock the books and export to QuickBooks.`
          : `<b>${rc.matched + (rc.exceptions.length - remaining)}</b> of <b>${rc.total}</b> transactions auto-matched. Each exception has a guided resolution — confirm or override.`
        }
      />

      {canClose && (
        <FocusCard
          tone=""
          eyebrow="Close & sign"
          title="Sign and export May 8 – 14 to QuickBooks"
          body="Zero exceptions, balanced to the cent. Signing locks the period and queues a journal-entry export. <b>This action is logged.</b>"
          actions={
            <div style={{display: "contents"}}>
              <button className="btn btn-secondary">Preview JE</button>
              <button className="btn btn-primary"><Icon name="lock" size={13}/>Close & sign</button>
            </div>
          }
        />
      )}

      {!canClose && (
        <div style={{display: "contents"}}>
          <SectionHeader title="Exceptions" meta="in resolution order"/>
          {rc.exceptions.map((ex, i) => (
            <div key={i} className="exception-row" style={{opacity: resolved[i] ? 0.4 : 1, marginBottom: 8}}>
              <div className={"ex-tag " + (ex.danger ? "danger" : "")}>{ex.tag}</div>
              <div>
                <div className="ex-title">{ex.title}</div>
                <div className="ex-sub">{ex.sub}</div>
              </div>
              <div className="ex-suggest" dangerouslySetInnerHTML={{__html: ex.suggest.replace(/(po_[\w]+|py_[\w]+|RES-[\w-]+)/g, '<b>$1</b>')}}/>
              <div className="ex-actions">
                {resolved[i] ? (
                  <span className="mono" style={{color: "var(--peak-success)", fontSize: 12}}><Icon name="check" size={12}/> Resolved</span>
                ) : (
                  <div style={{display: "contents"}}>
                    <button className="ex-act primary" onClick={() => resolve(i)}>Confirm</button>
                    <button className="ex-act">Manual…</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <SectionHeader title="Look closer"/>

      <Expandable
        icon="recon"
        title="Auto-match progress · all 384 transactions"
        sub={`${rc.matched + (rc.exceptions.length - remaining)} of ${rc.total} matched · $${(8421.40 - 842.50).toFixed(2)} reconciled`}
      >
        <div className="recon-progress" style={{margin: 0, border: "0", padding: 0, background: "none"}}>
          <div style={{flex: 1}}>
            <div className="rp-label">Auto-match progress</div>
            <div style={{display: "flex", alignItems: "baseline", gap: 4, marginTop: 6}}>
              <span className="rp-num">{rc.matched + (rc.exceptions.length - remaining)}</span>
              <span className="rp-total">of {rc.total} transactions</span>
            </div>
            <div className="rp-bar"><div className="rp-bar-fill" style={{width: ((rc.matched + (rc.exceptions.length - remaining)) / rc.total * 100) + "%"}}/></div>
          </div>
        </div>
      </Expandable>

      <Expandable
        icon="lock"
        title="Previously closed periods"
        sub="Signed · timestamped · exported. The audit trail."
      >
        <table className="lg-table" style={{marginTop: -8}}>
          <thead>
            <tr><th>Period</th><th>Closed by</th><th>Close date</th><th>Exceptions</th><th>Export</th></tr>
          </thead>
          <tbody>
            {rc.closedPeriods.map((p, i) => (
              <tr key={i}>
                <td>{p.period}</td>
                <td><span style={{color: "var(--accent)"}}>{p.closedBy}</span></td>
                <td>{p.date}</td>
                <td>{p.exceptions === 0 ? <span style={{color: "var(--peak-success)"}}>zero</span> : p.exceptions}</td>
                <td><span className="mono subtle" style={{fontSize: 11}}>QBO · CSV · PDF</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Expandable>
    </div>
  );
}

// ---------- ACTIVITY ----------
function ActivitySurface() {
  const [view, setView] = useState("anomalies");
  return (
    <div className="surface-narrative">
      <NarrativeHero
        eyebrow="Activity · last 24 hours"
        headline={`Three things <em>worth a look</em>.<br/><span class="muted-fragment">Otherwise routine.</span>`}
        sub="Saturday demand soft. Table 43 turn times spiked Tuesday. May 13 had a coordinated cancellation. Everything else is the normal hum of service."
      />

      <div className="tape-toggle" style={{width: "fit-content", marginBottom: 18}}>
        <button className={view === "anomalies" ? "active" : ""} onClick={() => setView("anomalies")}>Anomalies <span className="mono" style={{marginLeft: 4, color: "var(--peak-warning)"}}>3</span></button>
        <button className={view === "audit" ? "active" : ""} onClick={() => setView("audit")}>Audit log</button>
      </div>

      {view === "anomalies" && (
        <div style={{display: "contents"}}>
          {PEAK.anomalies.map((a, i) => (
            <div key={i} className={"anomaly-card " + (a.tier === "danger" ? "danger" : "warn")}>
              <div className="ac-head">
                <div className="ac-title">{a.title}</div>
                <div className="ac-meta">{a.meta}</div>
              </div>
              <div className="ac-body">{a.body}</div>
              <div className="ac-drivers">
                {a.drivers.map((d, j) => (
                  <div key={j} className="driver"><span>{d.k}</span><span style={{color: "var(--fg)", fontFamily: "var(--font-mono)"}}>{d.v}</span></div>
                ))}
              </div>
              <div className="ac-actions">
                <button className="ac-act primary">Investigate</button>
                <button className="ac-act">Looks normal · dismiss</button>
                <button className="ac-act">Add annotation</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "audit" && (
        <div className="lg-card" style={{padding: 0}}>
          <div style={{padding: "14px 18px", borderBottom: "1px solid var(--divider)"}}>
            <div className="lg-card-eyebrow">Last 24 hours · all actors</div>
          </div>
          {PEAK.activity.map((a, i) => (
            <div key={i} className="activity-row">
              <div className="ar-time">May 15 · {a.time}</div>
              <div className="ar-icon"><Icon name={a.icon === "user-x" ? "user-x" : a.icon === "check" ? "check" : a.icon === "alert" ? "alert" : a.icon === "card" ? "card" : a.icon === "edit" ? "edit" : a.icon === "user-plus" ? "user-plus" : a.icon === "comment" ? "comment" : a.icon === "refresh" ? "refresh" : "settings"} size={14}/></div>
              <div className="ar-text">
                {a.text}
                {a.actor && <span className="actor"> {a.actor}</span>}
                {a.obj && <span> · {a.obj}</span>}
              </div>
              <div className="ar-meta">norma's</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- SETTINGS ----------
function SettingsSurface() {
  return (
    <div className="surface-narrative">
      <NarrativeHero
        eyebrow="Organization · Brown Hospitality Group"
        headline="Settings."
        sub="4 locations · 27 users · Stripe + QuickBooks connected. Everything else is the way you left it."
      />
      <SectionHeader title="Org"/>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14}}>
        {[
          { eyebrow: "Locations", title: "4 active · 1 in renovation", sub: "Norma's · Sutton · Mister Parker's · The Annex" },
          { eyebrow: "Team", title: "27 active users · 4 roles", sub: "Owner · Admin · Manager · Staff" },
          { eyebrow: "Integrations", title: "Stripe · QuickBooks · Xero", sub: "Stripe May 2024 · QBO syncing nightly · Xero pending re-auth" },
          { eyebrow: "Deposit policy", title: "$25 per cover · 24 hr window", sub: "Effective May 1 · last edited by Becca M." },
          { eyebrow: "Notifications", title: "Anomaly engine quiet by default", sub: "No email alerts. Highlights rail only." },
          { eyebrow: "Billing", title: "Multi-unit plan · $320 / mo", sub: "Next invoice June 1" }
        ].map((s, i) => (
          <div key={i} className="lg-card" style={{cursor: "pointer"}}>
            <div className="lg-card-eyebrow">{s.eyebrow}</div>
            <div style={{fontSize: 16, fontWeight: 600, color: "var(--fg)", marginTop: 6, fontFamily: "var(--font-display)", letterSpacing: "-0.01em"}}>{s.title}</div>
            <div style={{fontSize: 12.5, color: "var(--fg-muted)", marginTop: 6, lineHeight: 1.5}}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { GuestsSurface, ForecastSurface, ReportsSurface, ReconciliationSurface, ActivitySurface, SettingsSurface });
