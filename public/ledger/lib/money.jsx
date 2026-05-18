// =========================================================================
// Money — CFO's home: Overview / Earnings / Refunds / Fees / Payouts / Disputes / Forfeited
// =========================================================================

function MoneySurface({ compareMode, setCompareMode, viewMode }) {
  return viewMode === "dashboard"
    ? <MoneyDashboard compareMode={compareMode} setCompareMode={setCompareMode}/>
    : <MoneyNarrative compareMode={compareMode} setCompareMode={setCompareMode}/>;
}

function MoneyNarrative({ compareMode, setCompareMode }) {
  const [tab, setTab] = useState("overview");
  const [timeScope, setTimeScope] = useState("YTD");

  return (
    <div className="surface-narrative" style={{maxWidth: tab === "overview" ? 1080 : "none"}}>
      {tab === "overview" ? (
        <MoneyOverview compareMode={compareMode} setCompareMode={setCompareMode} setTab={setTab} timeScope={timeScope} setTimeScope={setTimeScope}/>
      ) : (
        <div>
          <NarrativeHero
            eyebrow="Money · detail"
            headline={({
              earnings: "Earnings detail.",
              refunds: "Every dollar refunded.",
              fees: "Fee burden.",
              payouts: "Payouts &amp; reservations linked.",
              disputes: "Disputes.",
              forfeited: "Forfeited deposits."
            })[tab]}
          />
          <div className="money-tabs" style={{marginTop: -8}}>
            {[
              { id: "overview", label: "← Overview" },
              { id: "earnings", label: "Earnings" },
              { id: "refunds", label: "Refunds & Comps", badge: "$1,735" },
              { id: "fees", label: "Fees" },
              { id: "payouts", label: "Payouts", badge: "7" },
              { id: "disputes", label: "Disputes", badge: "1" },
              { id: "forfeited", label: "Forfeited" },
            ].map(t => (
              <div key={t.id} className={"money-tab " + (tab === t.id ? "active" : "")} onClick={() => setTab(t.id)}>
                {t.label}{t.badge && <span className="badge">{t.badge}</span>}
              </div>
            ))}
          </div>
          {tab === "earnings" && <MoneyEarnings compareMode={compareMode} timeScope={timeScope}/>}
          {tab === "refunds" && <MoneyRefunds/>}
          {tab === "fees" && <MoneyFees/>}
          {tab === "payouts" && <MoneyPayouts/>}
          {tab === "disputes" && <MoneyDisputes/>}
          {tab === "forfeited" && <MoneyForfeited/>}
        </div>
      )}
    </div>
  );
}

// Filter earnings-by-month data based on time scope.
// Returns { rows, label, periodNet, periodGross, periodRefunds, periodFees, periodForfeited }
function scopeFilter(scope) {
  // Map scope → how many months back to show (relative to current month "May 26")
  // PEAK.earningsByMonth: 13 months, indices 0-12.
  // Current month is index 11 (May). Index 12 is forecast (Jun 26).
  const all = PEAK.earningsByMonth;
  let rows;
  let label;
  let scaleFactor; // ratio of period to current YTD totals
  switch (scope) {
    case "Today":
      rows = all.slice(11, 12); // just May (partial)
      label = "Today";
      scaleFactor = 0.04;       // ~one day of May so far
      break;
    case "Week":
      rows = all.slice(10, 12); // Apr + May partial
      label = "This week";
      scaleFactor = 0.16;
      break;
    case "Month":
      rows = all.slice(10, 12); // last month + current partial
      label = "This month";
      scaleFactor = 0.20;
      break;
    case "Custom":
      rows = all;
      label = "Trailing 13 months";
      scaleFactor = 1.6;
      break;
    case "YTD":
    default:
      rows = all.slice(7, 12); // Jan-May
      label = "Year-to-date";
      scaleFactor = 1;
      break;
  }
  return { rows, label, scaleFactor };
}

function MoneyOverview({ compareMode, setCompareMode, setTab, timeScope = "YTD", setTimeScope = () => {} }) {
  const ovBase = PEAK.moneyOverview;
  const { rows: scopedRows, label: scopeLabel, scaleFactor } = scopeFilter(timeScope);

  // Apply the scale factor to make KPIs feel realistic at the chosen scope
  const ov = {
    gross: { ...ovBase.gross, value: ovBase.gross.value * scaleFactor },
    net: { ...ovBase.net, value: ovBase.net.value * scaleFactor },
    refunds: { ...ovBase.refunds, value: ovBase.refunds.value * scaleFactor },
    fees: { ...ovBase.fees, value: ovBase.fees.value * scaleFactor },
    forfeited: { ...ovBase.forfeited, value: ovBase.forfeited.value * scaleFactor }
  };

  return (
    <div>
      <NarrativeHero
        eyebrow={`${scopeLabel} · 2026`}
        headline={`The story this week is <em>refunds</em>.<br/><span class="muted-fragment">Otherwise quiet.</span>`}
        sub={`<b>$${(ov.net.value / 1000).toFixed(1)}k net</b> ${scopeLabel.toLowerCase()}, up 3.9% vs. last year. Four large parties cancelled May 13 — <b>$1,240 in refunds</b>, $285 retained as cancellation fees. <span class="accent">Single-source, not a trend.</span>`}
      >
        <div className="nar-meta-strip">
          <span><b>${(ov.gross.value / 1000).toFixed(1)}k</b><span className="lbl">Gross {scopeLabel.toLowerCase()} · <span style={{color: "var(--peak-success)"}}>+{ov.gross.delta}%</span></span></span>
          <span><b>${Math.round(ov.refunds.value).toLocaleString()}</b><span className="lbl">Refunds · <span style={{color: "var(--peak-danger)"}}>+{ov.refunds.delta}% WoW</span></span></span>
          <span><b>${Math.round(ov.fees.value).toLocaleString()}</b><span className="lbl">Fees · 3.92% eff. rate</span></span>
          <span><b>${Math.round(ov.forfeited.value)}</b><span className="lbl">Forfeited · revenue</span></span>
        </div>
        <div style={{marginTop: 22}}>
          <SurfaceControls
            timeScope={timeScope}
            setTimeScope={setTimeScope}
            compareMode={compareMode}
            setCompareMode={setCompareMode}
          />
        </div>
      </NarrativeHero>

      {/* The 3 things that changed — primary content */}
      <SectionHeader title="What changed this week" meta="3 things worth knowing"/>
      <div className="changed-list">
        <ChangedItem
          delta="+$1,240"
          deltaDir="down"
          headline="Refunds up sharply on May 13"
          sub="Four large-party cancellations in 6 hours — Cohen Industries pulled their corporate dinner. Three of four forfeited a $95 deposit ($285 retained as fee revenue)."
          meta="OPEN →"
          onClick={() => setTab("refunds")}
        />
        <ChangedItem
          delta="−78%"
          deltaDir="down"
          headline="Saturday May 16 pacing far below typical"
          sub="91 covers on the book vs. typical 407 by Friday lunch. Channel mix: concierge −84%, direct −54%. No promo paused, weather clear."
          meta="FORECAST →"
        />
        <ChangedItem
          delta="+$3.20"
          deltaDir="up"
          headline="Average deposit up after May 1 policy change"
          sub="Move to $25 per cover on dinner. Conversion held flat — net deposit collected per booking up 14.6% with no observable demand impact."
          meta="POLICY →"
        />
      </div>

      {/* Look closer */}
      <SectionHeader title="Look closer" meta="open anything below"/>

      <Expandable
        icon="dollar"
        title="The full overview · five KPIs and their sparklines"
        sub="Gross · Net · Refunds · Fees · Forfeited. With WoW deltas and trailing-13-week sparks."
      >
        <MoneyKPIRow ov={ov}/>
      </Expandable>

      <Expandable
        icon="trend"
        title={`Earnings · ${scopeLabel.toLowerCase()}`}
        sub={`${scopedRows.length} ${scopedRows.length === 1 ? "month" : "months"} of data. ${compareMode !== "off" ? "vs. " + compareMode : "Annotated · 3 notes"}`}
        badge={compareMode !== "off" ? "vs. " + compareMode : null}
      >
        <CompareChart
          data={scopedRows}
          compareMode={compareMode === "off" ? "YoY" : compareMode}
          annotations={PEAK.annotations}
          height={260}
        />
        <div style={{marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between"}}>
          <span className="mono subtle" style={{fontSize: 11}}>Annotations · click any pin on the chart</span>
          <span className="nar-link" onClick={() => setTab("earnings")}>Open earnings detail →</span>
        </div>
      </Expandable>

      <Expandable
        icon="table"
        title="Earnings by table · YTD"
        sub="Which tables make us the most money. T63 (private 9-top window) leads at $8,340 YTD."
      >
        <DataTable
          csvName="earnings-by-table-ytd.csv"
          defaultSort={{ key: "revenue", dir: "desc" }}
          columns={[
            { key: "table", label: "Table", render: r => <span className="mono" style={{color: "var(--accent)"}}>T{r.table}</span>, sortValue: r => r.table },
            { key: "type", label: "Type", filterable: true },
            { key: "revenue", label: "Revenue YTD", num: true, format: v => "$" + v.toLocaleString() },
            { key: "deposit", label: "Avg deposit", num: true, format: v => "$" + v.toFixed(2) },
            { key: "covers", label: "Covers", num: true },
            { key: "revPerCover", label: "Rev / cover", num: true, format: v => "$" + v.toFixed(2) },
            { key: "turn", label: "Turn time", num: true, render: r => r.turnFlag ? <span style={{color: "var(--peak-warning)"}}>{r.turn} ▲</span> : r.turn, sortValue: r => parseInt(r.turn) }
          ]}
          rows={[
            { table: "63", type: "Private", revenue: 8340.50, deposit: 51.34, covers: 231, revPerCover: 36.10, turn: "138 min" },
            { table: "80", type: "Bar", revenue: 2378.60, deposit: 23.00, covers: 145, revPerCover: 16.40, turn: "62 min" },
            { table: "70", type: "Round", revenue: 2245.60, deposit: 22.71, covers: 141, revPerCover: 15.93, turn: "94 min" },
            { table: "86", type: "2-top", revenue: 2223.20, deposit: 21.38, covers: 141, revPerCover: 15.77, turn: "78 min" },
            { table: "40", type: "Round", revenue: 2184.00, deposit: 26.42, covers: 114, revPerCover: 19.16, turn: "108 min" },
            { table: "61", type: "Private", revenue: 2130.10, deposit: 23.56, covers: 124, revPerCover: 17.18, turn: "120 min" },
            { table: "42", type: "Window 4-top", revenue: 1783.60, deposit: 26.25, covers: 95, revPerCover: 18.77, turn: "94 min" },
            { table: "43", type: "Window 2-top", revenue: 1684.20, deposit: 18.40, covers: 116, revPerCover: 14.52, turn: "147 min", turnFlag: true },
            { table: "44", type: "Window 2-top", revenue: 1620.40, deposit: 18.40, covers: 110, revPerCover: 14.73, turn: "88 min" },
            { table: "45", type: "Window 2-top", revenue: 1604.20, deposit: 18.40, covers: 108, revPerCover: 14.85, turn: "85 min" },
            { table: "11", type: "2-top", revenue: 1480.60, deposit: 18.40, covers: 102, revPerCover: 14.52, turn: "82 min" },
            { table: "12", type: "2-top", revenue: 1442.80, deposit: 18.40, covers: 100, revPerCover: 14.43, turn: "84 min" },
            { table: "13", type: "Banquette", revenue: 1396.20, deposit: 18.40, covers: 96, revPerCover: 14.54, turn: "80 min" },
            { table: "14", type: "2-top", revenue: 1372.40, deposit: 18.40, covers: 94, revPerCover: 14.60, turn: "82 min" },
            { table: "15", type: "4-top", revenue: 1604.80, deposit: 22.40, covers: 82, revPerCover: 19.57, turn: "100 min" },
            { table: "17", type: "2-top", revenue: 1280.20, deposit: 18.40, covers: 88, revPerCover: 14.55, turn: "82 min" },
            { table: "20", type: "Round", revenue: 1842.60, deposit: 26.42, covers: 96, revPerCover: 19.19, turn: "104 min" },
            { table: "21", type: "4-top", revenue: 1488.80, deposit: 22.40, covers: 76, revPerCover: 19.59, turn: "98 min" },
            { table: "23", type: "Banquette", revenue: 1456.20, deposit: 18.40, covers: 100, revPerCover: 14.56, turn: "80 min" },
            { table: "24", type: "2-top", revenue: 1338.40, deposit: 18.40, covers: 92, revPerCover: 14.55, turn: "82 min" },
            { table: "25", type: "4-top", revenue: 1532.40, deposit: 22.40, covers: 78, revPerCover: 19.64, turn: "96 min" }
          ]}
        />
      </Expandable>

      <Expandable
        icon="wallet"
        title="Payouts · last 7 days · Wells Fargo ··4477"
        sub="Every Stripe payout linked back to the reservations that produced it."
        badge="7"
      >
        <MoneyPayouts/>
      </Expandable>

      <SectionHeader title="Detail views" meta="full Money sub-IA"/>
      <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 12}}>
        {[
          { id: "earnings", l: "Earnings", s: "Gross, net, refunds by month — with compare overlay" },
          { id: "refunds", l: "Refunds & Comps", s: "Full taxonomy — every dollar refunded, by category" },
          { id: "fees", l: "Fees", s: "Stripe + dispute + refund fees · effective rate trend" },
          { id: "payouts", l: "Payouts", s: "Bank settlement log · reservation linkage" },
          { id: "disputes", l: "Disputes", s: "1 open · evidence packet ready", badge: "DUE MAY 18" },
          { id: "forfeited", l: "Forfeited deposits", s: "Recognized as revenue · 11 events YTD" },
        ].map(item => (
          <div key={item.id} className="lg-card tight" style={{cursor: "pointer", padding: "14px 16px"}} onClick={() => setTab(item.id)}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6}}>
              <div style={{fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 500, letterSpacing: "-0.01em", color: "var(--fg)"}}>{item.l}</div>
              {item.badge && <span className="lg-nav-badge warn" style={{fontSize: 9.5}}>{item.badge}</span>}
            </div>
            <div style={{fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.5}}>{item.s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoneyKPIRow({ ov }) {
  return (
    <div className="kpi-row" style={{margin: 0}}>
      <div className="kpi">
        <span className="kpi-label">Gross</span>
        <div style={{display: "flex", alignItems: "flex-end", gap: 8, justifyContent: "space-between"}}>
          <span className="kpi-value">${(ov.gross.value / 1000).toFixed(1)}k</span>
          <Sparkline data={ov.gross.spark} width={70} height={28}/>
        </div>
        <div className="kpi-foot">
          <span className="kpi-delta up">▲ {ov.gross.delta}%</span>
          <span className="kpi-sub">vs. YTD '25</span>
        </div>
      </div>
      <div className="kpi">
        <span className="kpi-label">Net</span>
        <div style={{display: "flex", alignItems: "flex-end", gap: 8, justifyContent: "space-between"}}>
          <span className="kpi-value">${(ov.net.value / 1000).toFixed(1)}k</span>
          <Sparkline data={ov.net.spark} width={70} height={28}/>
        </div>
        <div className="kpi-foot">
          <span className="kpi-delta up">▲ {ov.net.delta}%</span>
          <span className="kpi-sub">after fees + refunds</span>
        </div>
      </div>
      <div className="kpi">
        <span className="kpi-label">Refunds</span>
        <div style={{display: "flex", alignItems: "flex-end", gap: 8, justifyContent: "space-between"}}>
          <span className="kpi-value">${(ov.refunds.value / 1000).toFixed(2)}k</span>
          <Sparkline data={ov.refunds.spark} width={70} height={28}/>
        </div>
        <div className="kpi-foot">
          <WhyPopover
            eyebrow="Why is refunds up?"
            body="Single-source coordinated cancellation on May 13: Cohen Industries pulled their pre-paid corporate dinner. <b>4 parties, 32 covers, $1,240 in refunds.</b> $285 retained as cancellation fee."
            drivers={[
              { k: "Coordinated cancellations", v: "$1,240" },
              { k: "Trailing 4-week avg refunds", v: "$420 / wk" },
              { k: "Retained from fees", v: "+$285" }
            ]}
          >
            <span className="kpi-delta down">▲ {ov.refunds.delta}%</span>
          </WhyPopover>
          <span className="kpi-sub">{ov.refunds.note}</span>
        </div>
      </div>
      <div className="kpi">
        <span className="kpi-label">Fees</span>
        <div style={{display: "flex", alignItems: "flex-end", gap: 8, justifyContent: "space-between"}}>
          <span className="kpi-value">${(ov.fees.value / 1000).toFixed(2)}k</span>
          <Sparkline data={ov.fees.spark} width={70} height={28}/>
        </div>
        <div className="kpi-foot">
          <span className="kpi-delta flat">▲ {ov.fees.delta}%</span>
          <span className="kpi-sub">Stripe + chargeback</span>
        </div>
      </div>
      <div className="kpi">
        <span className="kpi-label">Forfeited</span>
        <div style={{display: "flex", alignItems: "flex-end", gap: 8, justifyContent: "space-between"}}>
          <span className="kpi-value">${ov.forfeited.value.toFixed(0)}</span>
          <Sparkline data={ov.forfeited.spark} width={70} height={28}/>
        </div>
        <div className="kpi-foot">
          <span className="kpi-delta up">▼ {Math.abs(ov.forfeited.delta)}%</span>
          <span className="kpi-sub">no-show fees retained</span>
        </div>
      </div>
    </div>
  );
}

function MoneyEarnings({ compareMode, timeScope = "YTD" }) {
  const { rows: scopedRows, label: scopeLabel } = scopeFilter(timeScope);
  return (
    <div>
      <div className="lg-card">
        <div className="lg-card-head">
          <div>
            <div className="lg-card-eyebrow">Earnings detail · {scopeLabel.toLowerCase()}</div>
            <div className="lg-card-title">Gross / Net / Refunds by month</div>
          </div>
        </div>
        <CompareChart
          data={scopedRows}
          compareMode={compareMode === "off" ? "YoY" : compareMode}
          annotations={PEAK.annotations}
          height={300}
        />
        <div style={{marginTop: 18}}>
          <table className="lg-table">
            <thead>
              <tr>
                <th>Month</th>
                <th className="num">Gross</th>
                <th className="num">Refunds</th>
                <th className="num">Fees</th>
                <th className="num">Net</th>
                <th className="num">vs. last year</th>
              </tr>
            </thead>
            <tbody>
              {scopedRows.map((m, i) => (
                <tr key={i}>
                  <td>{m.m}{m.isPartial && <span className="mono subtle" style={{marginLeft: 6, fontSize: 10}}>partial</span>}{m.isFuture && <span className="mono subtle" style={{marginLeft: 6, fontSize: 10}}>forecast</span>}</td>
                  <td className="num">${m.thisYr.toLocaleString()}</td>
                  <td className="num" style={{color: "#D98B80"}}>−${m.refunds.toLocaleString()}</td>
                  <td className="num">−${Math.round(m.thisYr * 0.04).toLocaleString()}</td>
                  <td className="num" style={{color: "var(--fg)", fontWeight: 600}}>${(m.thisYr - m.refunds - Math.round(m.thisYr * 0.04)).toLocaleString()}</td>
                  <td className="num" style={{color: m.thisYr > m.lastYr ? "var(--peak-success)" : "var(--peak-danger)"}}>
                    {m.thisYr === 0 ? "—" : ((m.thisYr - m.lastYr) / m.lastYr * 100).toFixed(1) + "%"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MoneyRefunds() {
  const tax = PEAK.refundTaxonomy;
  const totalAmount = tax.reduce((s, r) => s + r.amount, 0);
  const totalCount = tax.reduce((s, r) => s + r.count, 0);

  return (
    <div>
      <div className="kpi-row" style={{gridTemplateColumns: "repeat(4, 1fr)"}}>
        <div className="kpi">
          <span className="kpi-label">Total refund value</span>
          <span className="kpi-value">${totalAmount.toLocaleString()}</span>
          <div className="kpi-foot"><span className="kpi-delta down">▲ 12.6%</span><span className="kpi-sub">YTD</span></div>
        </div>
        <div className="kpi">
          <span className="kpi-label">Refund count</span>
          <span className="kpi-value">{totalCount}</span>
          <div className="kpi-foot"><span className="kpi-delta flat">▲ 4 vs LY</span><span className="kpi-sub">across all categories</span></div>
        </div>
        <div className="kpi">
          <span className="kpi-label">Avg refund</span>
          <span className="kpi-value">${(totalAmount / totalCount).toFixed(0)}</span>
          <div className="kpi-foot"><span className="kpi-delta up">▲ 8%</span><span className="kpi-sub">larger parties</span></div>
        </div>
        <div className="kpi">
          <span className="kpi-label">Retained as revenue</span>
          <span className="kpi-value" style={{color: "var(--peak-success)"}}>${tax.filter(r => r.isRevenue).reduce((s, r) => s + r.amount, 0).toFixed(0)}</span>
          <div className="kpi-foot"><span className="kpi-sub">forfeited deposits</span></div>
        </div>
      </div>

      <div className="lg-card" style={{marginTop: 14}}>
        <div className="lg-card-head">
          <div>
            <div className="lg-card-eyebrow">Refund taxonomy · YTD</div>
            <div className="lg-card-title">Every dollar refunded, by category</div>
          </div>
          <span className="mono subtle" style={{fontSize: 11}}>aligned with GL accounts</span>
        </div>

        {/* Stacked bar */}
        <div style={{display: "flex", height: 14, borderRadius: 4, overflow: "hidden", marginBottom: 16, gap: 1}}>
          {tax.map((r, i) => (
            <div key={i} style={{
              flex: r.amount,
              background: r.color,
              opacity: 0.85
            }} title={`${r.label} · $${r.amount}`}/>
          ))}
        </div>

        {tax.map((r, i) => (
          <div key={i} className="refund-tax-row">
            <div className="swatch" style={{background: r.color, opacity: 0.85}}/>
            <div>
              <div className="rt-label">{r.label}{r.isRevenue && <span className="tag-chip" style={{marginLeft: 8, background: "rgba(107,142,90,0.18)", color: "#9DC08A", border: "1px solid rgba(107,142,90,0.32)"}}>REVENUE</span>}</div>
              <div className="rt-sub">{r.sub}</div>
            </div>
            <span className="rt-count">{r.count} events</span>
            <span className="rt-amt" style={{color: r.isRevenue ? "var(--peak-success)" : "var(--fg)"}}>{r.isRevenue ? "+" : "−"}${r.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoneyFees() {
  return (
    <div>
      <div className="kpi-row" style={{gridTemplateColumns: "repeat(4, 1fr)"}}>
        <div className="kpi">
          <span className="kpi-label">Stripe processing</span>
          <span className="kpi-value">$1,642.18</span>
          <div className="kpi-foot"><span className="kpi-delta flat">▲ 4.5%</span><span className="kpi-sub">2.9% + $0.30 · 624 charges</span></div>
        </div>
        <div className="kpi">
          <span className="kpi-label">Dispute fees</span>
          <span className="kpi-value">$45.00</span>
          <div className="kpi-foot"><span className="kpi-delta flat">▲ 1 dispute</span><span className="kpi-sub">Renn $15 · plus retained</span></div>
        </div>
        <div className="kpi">
          <span className="kpi-label">Refund fees</span>
          <span className="kpi-value">$55.00</span>
          <div className="kpi-foot"><span className="kpi-sub">non-recoverable</span></div>
        </div>
        <div className="kpi">
          <span className="kpi-label">Effective rate</span>
          <span className="kpi-value">3.92%</span>
          <div className="kpi-foot"><span className="kpi-delta flat">▲ 0.04pp</span><span className="kpi-sub">avg of charge value</span></div>
        </div>
      </div>

      <div className="lg-card" style={{marginTop: 14}}>
        <div className="lg-card-head">
          <div className="lg-card-title">Fee burden by month</div>
          <span className="mono subtle">YTD</span>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 18, padding: "8px 0"}}>
          {[
            ["Jan", 285.30, 2680, 10.6],
            ["Feb", 312.10, 2890, 10.8],
            ["Mar", 384.20, 3680, 10.4],
            ["Apr", 348.40, 3120, 11.2],
            ["May", 312.18, 2240, 13.9]
          ].map(([m, v, charges, ratio], i) => (
            <div key={i}>
              <div className="kpi-label">{m}</div>
              <div style={{fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500, color: "var(--fg)", marginTop: 6, letterSpacing: "-0.01em"}}>${v.toFixed(0)}</div>
              <div className="mono subtle" style={{fontSize: 11, marginTop: 4}}>{charges} charges · {ratio}% eff. rate</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MoneyPayouts() {
  const [expanded, setExpanded] = useState("po_1TX9");

  return (
    <div>
      {PEAK.payouts.map(p => (
        <div key={p.id} style={{display: "contents"}}>
          <div
            className={"payout-row " + (expanded === p.id ? "expanded" : "")}
            onClick={() => setExpanded(expanded === p.id ? null : p.id)}
          >
            <div>
              <div className="p-date">{p.date}</div>
              <div className="p-id">{p.id}</div>
            </div>
            <div className="p-bank">
              <Icon name="wallet" size={14}/>
              <span>{p.bank}</span>
              {p.note && <span className="mono subtle" style={{fontSize: 10, marginLeft: 8}}>· {p.note}</span>}
            </div>
            <div className="p-num"><span className="lbl">Gross</span>${p.gross.toFixed(2)}</div>
            <div className="p-num"><span className="lbl">Fees</span>−${p.fees.toFixed(2)}</div>
            <div className="p-num" style={{color: p.amount < 0 ? "#D98B80" : "var(--accent)", fontWeight: 600}}><span className="lbl">Net</span>{p.amount < 0 ? "−" : ""}${Math.abs(p.amount).toFixed(2)}</div>
            <Icon name={expanded === p.id ? "chevron-down" : "chevron-right"} size={14}/>
          </div>

          {expanded === p.id && (
            <div className="payout-expand">
              <div>
                <div className="lg-card-eyebrow" style={{marginBottom: 10}}>Stripe transactions ({p.charges})</div>
                <table className="lg-table" style={{fontSize: 12}}>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th className="num">Gross</th>
                      <th className="num">Fee</th>
                      <th className="num">Net</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(p.id === "po_1TX9" ? PEAK.payoutDetail.transactions : []).slice(0, 5).map(tr => (
                      <tr key={tr.id}>
                        <td><span className="mono" style={{color: "var(--fg-muted)"}}>{tr.id.slice(0, 10)}</span></td>
                        <td className="num">${tr.amount.toFixed(2)}</td>
                        <td className="num" style={{color: "var(--fg-subtle)"}}>−${tr.fee.toFixed(2)}</td>
                        <td className="num">${tr.net.toFixed(2)}</td>
                        <td>{tr.date}</td>
                      </tr>
                    ))}
                    {p.id !== "po_1TX9" && (
                      <tr><td colSpan="5" className="dim" style={{padding: "20px 12px", textAlign: "center", fontSize: 12}}>{p.charges} transactions · expand to view all</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div>
                <div className="lg-card-eyebrow" style={{marginBottom: 10}}>Reservations linked</div>
                {(p.id === "po_1TX9" ? PEAK.payoutDetail.transactions : []).slice(0, 5).map(tr => (
                  <div key={tr.id} className="lg-card tight" style={{background: "var(--peak-ink-700)", marginBottom: 6}}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                      <div>
                        <div style={{fontSize: 13, color: "var(--fg)"}}>{tr.reservation}</div>
                        <div className="mono subtle" style={{fontSize: 10.5, marginTop: 2}}>T{tr.table} · {tr.date}</div>
                      </div>
                      <div className="mono" style={{fontSize: 13, color: "var(--accent)"}}>${tr.net.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
                {p.id !== "po_1TX9" && (
                  <div className="dim" style={{padding: "20px 0", fontSize: 12, textAlign: "center"}}>All {p.charges} reservations would render here</div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MoneyDisputes() {
  return (
    <div>
      <div className="lg-card">
        <div className="lg-card-head">
          <div>
            <div className="lg-card-eyebrow">Open · evidence required</div>
            <div className="lg-card-title">1 active dispute</div>
          </div>
        </div>
        <div className="exception-row" style={{borderLeft: "2px solid var(--peak-danger)"}}>
          <div className="ex-tag danger">DUE MAY 18</div>
          <div>
            <div className="ex-title">Renn, Olivia — $185 chargeback</div>
            <div className="ex-sub">Reason: product not received · Filed May 11 · Visa ··0119</div>
          </div>
          <div className="ex-suggest">
            <div>Reservation: <b>RES-026B-1188</b> · Apr 02 7:30 PM · seated 7:34, departed 9:12</div>
            <div className="mono subtle" style={{fontSize: 10.5, marginTop: 2}}>Receipt + audit trail + comms thread ready as evidence packet</div>
          </div>
          <div className="ex-actions">
            <button className="ex-act primary">Submit evidence</button>
            <button className="ex-act">View</button>
          </div>
        </div>
      </div>

      <div className="lg-card" style={{marginTop: 14}}>
        <div className="lg-card-head">
          <div className="lg-card-title">Dispute history · YTD</div>
        </div>
        <table className="lg-table">
          <thead>
            <tr>
              <th>Filed</th><th>Guest</th><th>Reason</th><th>Amount</th><th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>May 11</td><td>Renn, Olivia</td><td>Product not received</td><td className="num">$185.00</td><td><span className="tag-chip" style={{background: "rgba(194,146,68,0.16)", color: "#E6B478"}}>EVIDENCE DUE</span></td></tr>
            <tr><td>Mar 22</td><td>Kuper, Daniel</td><td>Unrecognized</td><td className="num">$95.00</td><td><span className="tag-chip" style={{background: "rgba(107,142,90,0.18)", color: "#9DC08A"}}>WON</span></td></tr>
            <tr><td>Feb 04</td><td>—</td><td>Duplicate</td><td className="num">$28.00</td><td><span className="tag-chip" style={{background: "rgba(163,74,63,0.18)", color: "#D98B80"}}>LOST</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MoneyForfeited() {
  const rows = [
    { date: "May 15", guest: "Otieno", party: 2, server: "Robin", amount: 18.00 },
    { date: "May 09", guest: "Pellegrini", party: 4, server: "Tyler", amount: 35.00 },
    { date: "May 03", guest: "Hayes", party: 6, server: "Maeve", amount: 95.00 },
    { date: "Apr 26", guest: "Wong", party: 2, server: "Robin", amount: 14.00 },
    { date: "Apr 19", guest: "Ricci-Bauer", party: 8, server: "Tyler", amount: 100.00 },
    { date: "Apr 12", guest: "Diaz", party: 4, server: "Tyler", amount: 28.00 },
    { date: "Apr 05", guest: "Carmichael", party: 2, server: "Robin", amount: 18.00 },
    { date: "Mar 28", guest: "Schreiber", party: 4, server: "Maeve", amount: 32.00 },
    { date: "Mar 21", guest: "Ellis", party: 6, server: "Tyler", amount: 72.50 },
    { date: "Mar 14", guest: "Bain", party: 2, server: "Robin", amount: 18.00 },
    { date: "Mar 07", guest: "Wallace", party: 4, server: "Maeve", amount: 56.00 }
  ];
  return (
    <div>
      <div className="lg-card">
        <div className="lg-card-head">
          <div>
            <div className="lg-card-eyebrow">Forfeited deposits · recognized as revenue</div>
            <div className="lg-card-title">$486.50 · 11 events YTD</div>
          </div>
          <span className="mono subtle" style={{fontSize: 11}}>Different tax treatment than refunds — booked to "forfeited deposit revenue"</span>
        </div>
        <DataTable
          csvName="forfeited-deposits.csv"
          defaultSort={{ key: "date", dir: "desc" }}
          dense
          columns={[
            { key: "date", label: "Date", sortValue: r => r.date },
            { key: "guest", label: "Guest" },
            { key: "party", label: "Party", num: true, filterable: true },
            { key: "server", label: "Server", filterable: true, render: r => <span style={{color: "var(--accent)"}}>{r.server}</span> },
            { key: "amount", label: "Forfeit", num: true, format: v => <span style={{color: "var(--peak-success)"}}>+${v.toFixed(2)}</span>, csvValue: r => r.amount.toFixed(2) }
          ]}
          rows={rows}
        />
      </div>
    </div>
  );
}

// ---------- MoneyDashboard — v1 layout, everything visible ----------
function MoneyDashboard({ compareMode, setCompareMode }) {
  const [tab, setTab] = useState("overview");
  const [timeScope, setTimeScope] = useState("YTD");
  const ovBase = PEAK.moneyOverview;
  const { rows: scopedRows, label: scopeLabel, scaleFactor } = scopeFilter(timeScope);
  const ov = {
    gross: { ...ovBase.gross, value: ovBase.gross.value * scaleFactor },
    net: { ...ovBase.net, value: ovBase.net.value * scaleFactor },
    refunds: { ...ovBase.refunds, value: ovBase.refunds.value * scaleFactor },
    fees: { ...ovBase.fees, value: ovBase.fees.value * scaleFactor },
    forfeited: { ...ovBase.forfeited, value: ovBase.forfeited.value * scaleFactor }
  };

  return (
    <div className="surface-dashboard">
      <div className="surface-head">
        <div className="surface-title-stack">
          <div className="surface-eyebrow">{scopeLabel} · 2026 · {compareMode !== "off" ? "vs. " + compareMode : "no compare"}</div>
          <div className="surface-title">Money.</div>
        </div>
        <div className="surface-actions">
          <SurfaceControls
            timeScope={timeScope}
            setTimeScope={setTimeScope}
            compareMode={compareMode}
            setCompareMode={setCompareMode}
          />
          <button className="btn btn-secondary"><Icon name="download" size={13}/>Export</button>
        </div>
      </div>

      <div className="money-tabs">
        {[
          { id: "overview", label: "Overview" },
          { id: "earnings", label: "Earnings" },
          { id: "refunds", label: "Refunds & Comps", badge: "$1,735" },
          { id: "fees", label: "Fees" },
          { id: "payouts", label: "Payouts", badge: "7" },
          { id: "disputes", label: "Disputes", badge: "1" },
          { id: "forfeited", label: "Forfeited deposits" }
        ].map(t => (
          <div key={t.id} className={"money-tab " + (tab === t.id ? "active" : "")} onClick={() => setTab(t.id)}>
            {t.label}{t.badge && <span className="badge">{t.badge}</span>}
          </div>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          {/* 3 what-changed cards */}
          <div className="what-changed">
            {PEAK.whatChanged.map((c, i) => (
              <div className="wc-card" key={i}>
                <div className="wc-eyebrow">{c.eyebrow}</div>
                <div className="wc-headline">{c.headline}</div>
                <div className="wc-body">{c.body}</div>
                <div style={{display: "flex", justifyContent: "space-between", marginTop: 6, alignItems: "center"}}>
                  <span className={"wc-delta " + (c.dir === "up" ? "up" : "down")}>{c.delta}</span>
                  <span className="mono" style={{fontSize: 10, color: "var(--accent)", letterSpacing: "0.06em"}}>OPEN →</span>
                </div>
              </div>
            ))}
          </div>

          <MoneyKPIRow ov={ov}/>

          {/* Earnings chart */}
          <div className="lg-card" style={{marginTop: 14}}>
            <div className="lg-card-head">
              <div>
                <div className="lg-card-eyebrow">Earnings · {scopeLabel.toLowerCase()}</div>
                <div className="lg-card-title">Net by month with comparison overlay</div>
              </div>
              <div className="lg-card-actions">
                <span className="lg-card-eyebrow">{scopedRows.length} {scopedRows.length === 1 ? "month" : "months"} · annotated</span>
              </div>
            </div>
            <CompareChart
              data={scopedRows}
              compareMode={compareMode === "off" ? "YoY" : compareMode}
              annotations={PEAK.annotations}
              height={260}
            />
          </div>

          {/* Earnings by table */}
          <div className="lg-card" style={{marginTop: 14}}>
            <div className="lg-card-head">
              <div>
                <div className="lg-card-eyebrow">Earnings by table · YTD</div>
                <div className="lg-card-title">Which tables make us the most money</div>
              </div>
            </div>
            <DataTable
              csvName="earnings-by-table-ytd.csv"
              defaultSort={{ key: "revenue", dir: "desc" }}
              columns={[
                { key: "table", label: "Table", render: r => <span className="mono" style={{color: "var(--accent)"}}>T{r.table}</span>, sortValue: r => r.table },
                { key: "type", label: "Type", filterable: true },
                { key: "revenue", label: "Revenue YTD", num: true, format: v => "$" + v.toLocaleString() },
                { key: "deposit", label: "Avg deposit", num: true, format: v => "$" + v.toFixed(2) },
                { key: "covers", label: "Covers", num: true },
                { key: "revPerCover", label: "Rev / cover", num: true, format: v => "$" + v.toFixed(2) },
                { key: "turn", label: "Turn time", num: true, render: r => r.turnFlag ? <span style={{color: "var(--peak-warning)"}}>{r.turn} ▲</span> : r.turn, sortValue: r => parseInt(r.turn) }
              ]}
              rows={[
                { table: "63", type: "Private", revenue: 8340.50, deposit: 51.34, covers: 231, revPerCover: 36.10, turn: "138 min" },
                { table: "80", type: "Bar", revenue: 2378.60, deposit: 23.00, covers: 145, revPerCover: 16.40, turn: "62 min" },
                { table: "70", type: "Round", revenue: 2245.60, deposit: 22.71, covers: 141, revPerCover: 15.93, turn: "94 min" },
                { table: "86", type: "2-top", revenue: 2223.20, deposit: 21.38, covers: 141, revPerCover: 15.77, turn: "78 min" },
                { table: "40", type: "Round", revenue: 2184.00, deposit: 26.42, covers: 114, revPerCover: 19.16, turn: "108 min" },
                { table: "61", type: "Private", revenue: 2130.10, deposit: 23.56, covers: 124, revPerCover: 17.18, turn: "120 min" },
                { table: "42", type: "Window 4-top", revenue: 1783.60, deposit: 26.25, covers: 95, revPerCover: 18.77, turn: "94 min" },
                { table: "43", type: "Window 2-top", revenue: 1684.20, deposit: 18.40, covers: 116, revPerCover: 14.52, turn: "147 min", turnFlag: true },
                { table: "44", type: "Window 2-top", revenue: 1620.40, deposit: 18.40, covers: 110, revPerCover: 14.73, turn: "88 min" },
                { table: "45", type: "Window 2-top", revenue: 1604.20, deposit: 18.40, covers: 108, revPerCover: 14.85, turn: "85 min" },
                { table: "11", type: "2-top", revenue: 1480.60, deposit: 18.40, covers: 102, revPerCover: 14.52, turn: "82 min" },
                { table: "12", type: "2-top", revenue: 1442.80, deposit: 18.40, covers: 100, revPerCover: 14.43, turn: "84 min" },
                { table: "13", type: "Banquette", revenue: 1396.20, deposit: 18.40, covers: 96, revPerCover: 14.54, turn: "80 min" },
                { table: "14", type: "2-top", revenue: 1372.40, deposit: 18.40, covers: 94, revPerCover: 14.60, turn: "82 min" },
                { table: "15", type: "4-top", revenue: 1604.80, deposit: 22.40, covers: 82, revPerCover: 19.57, turn: "100 min" },
                { table: "17", type: "2-top", revenue: 1280.20, deposit: 18.40, covers: 88, revPerCover: 14.55, turn: "82 min" },
                { table: "20", type: "Round", revenue: 1842.60, deposit: 26.42, covers: 96, revPerCover: 19.19, turn: "104 min" },
                { table: "21", type: "4-top", revenue: 1488.80, deposit: 22.40, covers: 76, revPerCover: 19.59, turn: "98 min" },
                { table: "23", type: "Banquette", revenue: 1456.20, deposit: 18.40, covers: 100, revPerCover: 14.56, turn: "80 min" },
                { table: "24", type: "2-top", revenue: 1338.40, deposit: 18.40, covers: 92, revPerCover: 14.55, turn: "82 min" },
                { table: "25", type: "4-top", revenue: 1532.40, deposit: 22.40, covers: 78, revPerCover: 19.64, turn: "96 min" }
              ]}
            />
          </div>
        </div>
      )}
      {tab === "earnings" && <MoneyEarnings compareMode={compareMode} timeScope={timeScope}/>}
      {tab === "refunds" && <MoneyRefunds/>}
      {tab === "fees" && <MoneyFees/>}
      {tab === "payouts" && <MoneyPayouts/>}
      {tab === "disputes" && <MoneyDisputes/>}
      {tab === "forfeited" && <MoneyForfeited/>}
    </div>
  );
}

Object.assign(window, { MoneySurface });
