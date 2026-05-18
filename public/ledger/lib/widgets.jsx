// =========================================================================
// Peak Ledger — Shared widgets: Sparkline, CompareChart, ReceiptDrawer,
// CommandK, WhyPopover, AnnotationMarker, Toast
// =========================================================================

// ---------- Sparkline ----------
function Sparkline({ data, width = 80, height = 24, prevData = null }) {
  if (!data || !data.length) return null;
  const min = Math.min(...data, ...(prevData || []));
  const max = Math.max(...data, ...(prevData || []));
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y];
  });
  const d = "M" + pts.map(p => p.join(",")).join(" L");
  const fillD = d + ` L${width},${height} L0,${height} Z`;
  const prevPath = prevData ? "M" + prevData.map((v, i) => {
    const x = (i / (prevData.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" L") : null;

  return (
    <svg width={width} height={height} className="kpi-spark">
      <path d={fillD} className="spark-fill"/>
      {prevPath && <path d={prevPath} className="spark-line muted"/>}
      <path d={d} className="spark-line"/>
    </svg>
  );
}

// ---------- "Why is this number" popover ----------
function WhyPopover({ children, eyebrow, body, drivers, anchorPos = "bottom" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <span ref={ref} className={"why-anchor " + (open ? "has-pop" : "")} style={{position: "relative"}} onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
      {children}
      {open && (
        <span className="why-pop" style={anchorPos === "right" ? {left: "calc(100% + 12px)", top: 0} : {top: "calc(100% + 8px)", left: 0}}>
          <div className="pop-eyebrow">{eyebrow}</div>
          <p dangerouslySetInnerHTML={{__html: body}}/>
          {drivers && drivers.length > 0 && (
            <div className="drivers">
              {drivers.map((d, i) => (
                <div className="driver" key={i}>
                  <span>{d.k}</span>
                  <span className="amt">{d.v}</span>
                </div>
              ))}
            </div>
          )}
        </span>
      )}
    </span>
  );
}

// ---------- Annotation Marker (on chart) ----------
function AnnotationMarker({ x, y, ann, onAddInput, onAdd }) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");
  return (
    <g style={{cursor: "pointer"}}>
      <circle
        cx={x} cy={y} r={6}
        className="annotation-pin"
        onClick={() => setOpen(!open)}
      />
      <text x={x} y={y + 3} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono" fill="#0E1A16" fontWeight="700" style={{pointerEvents: "none"}}>i</text>
      {open && (
        <foreignObject x={x - 110} y={y + 12} width={240} height={180} style={{overflow: "visible"}}>
          <div className="annotation-pop">
            <div style={{fontWeight: 600, marginBottom: 4}}>{ann.label}</div>
            <div style={{color: "var(--fg-muted)", fontSize: 11.5, lineHeight: 1.5}}>{ann.body}</div>
            <div className="pop-author">{ann.author} · {ann.date}</div>
            {!adding && <div style={{marginTop: 8, fontSize: 11, color: "var(--accent)", cursor: "pointer"}} onClick={() => setAdding(true)}>+ Add another note</div>}
            {adding && (
              <div className="annotation-add-row">
                <input placeholder="Add a note…" value={text} onChange={e => setText(e.target.value)} autoFocus/>
                <button onClick={() => { onAdd && onAdd(text); setText(""); setAdding(false); }}>Save</button>
              </div>
            )}
          </div>
        </foreignObject>
      )}
    </g>
  );
}

// ---------- Compare Chart: line + ribbon comparison + annotations ----------
function CompareChart({ data, compareMode, annotations: chartAnnotations = [], height = 220 }) {
  const [hover, setHover] = useState(null);
  const wrapRef = useRef(null);

  // Layout
  const padding = { top: 18, right: 24, bottom: 32, left: 50 };
  const width = wrapRef.current ? wrapRef.current.offsetWidth : 800;
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const series = data;
  const all = series.flatMap(d => [d.thisYr, d.lastYr, d.forecast]).filter(v => v != null && v > 0);
  const max = Math.max(...all) * 1.05;
  const yAxis = [0, max / 4, max / 2, (max * 3) / 4, max];

  const xFor = i => padding.left + (i / (series.length - 1)) * innerW;
  const yFor = v => padding.top + innerH - (v / max) * innerH;

  // Compare line config
  const compareKey = compareMode === "YoY" ? "lastYr" : compareMode === "Forecast" ? "forecast" : compareMode === "WoW" ? "lastYr" : null;
  const compareLabel = { YoY: "Last year", Forecast: "Forecast", WoW: "Prior period" }[compareMode];

  const thisLine = series.map((d, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(d.thisYr)}`).join(" ");
  const compareLine = compareKey ? series.map((d, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(d[compareKey])}`).join(" ") : null;
  const fillPath = thisLine + ` L ${xFor(series.length - 1)} ${padding.top + innerH} L ${padding.left} ${padding.top + innerH} Z`;

  return (
    <div ref={wrapRef} style={{position: "relative", width: "100%"}}>
      <svg className="compare-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{height: height + "px"}}>
        {/* Y grid */}
        {yAxis.map((v, i) => (
          <g key={i}>
            <line x1={padding.left} x2={width - padding.right} y1={yFor(v)} y2={yFor(v)} className="compare-grid-line"/>
            <text x={padding.left - 8} y={yFor(v) + 3} className="compare-axis-label" textAnchor="end">
              ${(v / 1000).toFixed(0)}k
            </text>
          </g>
        ))}
        {/* Compare ribbon */}
        {compareLine && <path d={compareLine} className="compare-ribbon-prev"/>}
        {/* This line w/ fill */}
        <path d={fillPath} className="compare-ribbon-now-fill"/>
        <path d={thisLine} className="compare-ribbon-now"/>

        {/* X axis labels */}
        {series.map((d, i) => (
          <text key={i} x={xFor(i)} y={height - 10} className="compare-axis-label" textAnchor="middle">{d.m}</text>
        ))}

        {/* Dots */}
        {series.map((d, i) => (
          <circle
            key={i}
            cx={xFor(i)}
            cy={yFor(d.thisYr)}
            r={hover === i ? 5 : 3}
            className="compare-now-dot"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{cursor: "pointer"}}
          />
        ))}

        {/* Annotation markers */}
        {chartAnnotations.map((ann, ai) => {
          const i = series.findIndex(s => s.m === ann.date.split(" ")[0] || s.m.startsWith(ann.date.split(" ")[0]));
          if (i < 0) return null;
          return <AnnotationMarker key={ai} x={xFor(i)} y={yFor(series[i].thisYr) - 18} ann={ann}/>;
        })}
      </svg>

      {/* Hover tooltip */}
      {hover != null && (
        <div className="lg-tooltip" style={{
          left: Math.min(xFor(hover) + 12, width - 180),
          top: yFor(series[hover].thisYr) - 50
        }}>
          <div className="tt-eyebrow">{series[hover].m}</div>
          <div className="tt-row"><span>This year</span><span className="v" style={{color: "var(--accent)"}}>${series[hover].thisYr.toLocaleString()}</span></div>
          {compareKey && <div className="tt-row"><span>{compareLabel}</span><span className="v">${series[hover][compareKey].toLocaleString()}</span></div>}
          <div className="tt-row"><span>Refunds</span><span className="v" style={{color: "#D98B80"}}>${series[hover].refunds.toLocaleString()}</span></div>
        </div>
      )}

      {/* Legend */}
      <div style={{display: "flex", alignItems: "center", gap: 18, fontSize: 11, color: "var(--fg-muted)", marginTop: 8, paddingLeft: padding.left}}>
        <span style={{display: "inline-flex", alignItems: "center", gap: 6}}>
          <span style={{display: "inline-block", width: 16, height: 2, background: "var(--accent)"}}/>
          This year
        </span>
        {compareKey && (
          <span style={{display: "inline-flex", alignItems: "center", gap: 6}}>
            <span style={{display: "inline-block", width: 16, height: 2, background: "var(--peak-slate-400)", opacity: 0.6, borderStyle: "dashed"}}/>
            {compareLabel}
          </span>
        )}
        <span style={{marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-subtle)", letterSpacing: "0.06em"}}>
          {compareMode === "off" ? "vs. — (no compare)" : "vs. " + compareLabel}
        </span>
      </div>
    </div>
  );
}

// ---------- Receipt Drawer ----------
function ReceiptDrawer({ receiptId, onClose }) {
  const r = receiptId ? PEAK.getReceipt(receiptId) : null;
  const open = !!receiptId;
  return (
    <div style={{display: "contents"}}>
      <div className={"receipt-backdrop " + (open ? "open" : "")} onClick={onClose}/>
      <div className={"receipt-drawer " + (open ? "open" : "")}>
        {r && (
          <div style={{display: "contents"}}>
            <div className="receipt-head">
              <div>
                <div className="receipt-eyebrow">{r.eyebrow}</div>
                <div className="receipt-title">{r.title}</div>
                <div className="receipt-title-row">
                  {r.guest.tags && r.guest.tags.map(t => (
                    <span key={t} className={"tag-chip " + t.toLowerCase()}>{t}</span>
                  ))}
                  <span className="mono subtle" style={{fontSize: 11}}>{r.receiptId}</span>
                </div>
              </div>
              <button className="lg-icon-btn receipt-close" onClick={onClose}>
                <Icon name="x" size={14}/>
              </button>
            </div>

            <div className="receipt-body">
              {/* Booking */}
              <div className="receipt-section">
                <div className="receipt-section-head">Booking</div>
                <div className="receipt-grid">
                  <div className="receipt-cell"><span className="k">Time</span><span className="v">{r.time}</span></div>
                  <div className="receipt-cell"><span className="k">Party</span><span className="v">{r.party} covers</span></div>
                  <div className="receipt-cell" style={{gridColumn: "1 / -1"}}><span className="k">Table</span><span className="v">{r.table}</span></div>
                  <div className="receipt-cell"><span className="k">Source</span><span className="v">{r.source}</span></div>
                  <div className="receipt-cell"><span className="k">Booked by</span><span className="v accent">{r.bookedBy}</span></div>
                  <div className="receipt-cell"><span className="k">Lead time</span><span className="v">{r.leadTime}</span></div>
                  <div className="receipt-cell"><span className="k">Outcome</span><span className={"v " + (r.outcome === "Seated" || r.outcome === "Completed" ? "success" : r.outcome === "No-show" ? "danger" : "")}>{r.outcome}</span></div>
                </div>
              </div>

              {/* Guest */}
              <div className="receipt-section">
                <div className="receipt-section-head">Guest</div>
                <div className="receipt-grid">
                  <div className="receipt-cell"><span className="k">Visits</span><span className="v accent">{r.guest.visits}</span></div>
                  <div className="receipt-cell"><span className="k">Lifetime value</span><span className="v mono">${r.guest.ltv.toLocaleString()}</span></div>
                  <div className="receipt-cell"><span className="k">Phone</span><span className="v mono">{r.guest.phone}</span></div>
                  <div className="receipt-cell"><span className="k">Email</span><span className="v mono">{r.guest.email}</span></div>
                  <div className="receipt-cell"><span className="k">Member since</span><span className="v">{r.guest.memberSince}</span></div>
                  {r.guest.risk && <div className="receipt-cell"><span className="k">Risk</span><span className="v danger">{r.guest.risk}</span></div>}
                </div>
                {r.guest.notes && (
                  <div style={{background: "var(--peak-ink-700)", border: "1px solid var(--border)", borderLeft: "2px solid var(--peak-warning)", borderRadius: 8, padding: 12, fontSize: 12.5, color: "var(--fg)", lineHeight: 1.5}}>
                    <span className="mono subtle" style={{fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase"}}>Note</span>
                    <div style={{marginTop: 4}}>{r.guest.notes}</div>
                  </div>
                )}
              </div>

              {/* Payment */}
              <div className="receipt-section">
                <div className="receipt-section-head">Payment thread</div>
                <div className="receipt-payment">
                  <div className="payment-thread">
                    {r.payment.items.map((it, i) => (
                      <div className="pt-row" key={i}>
                        <span className={"pt-dot " + (it.type === "refund" ? "refunded" : it.type === "fee" ? "fee" : it.state === "failed" ? "failed" : "")}/>
                        <div>
                          <div className="pt-label">{it.label}</div>
                          {it.sub && <div className="pt-sub">{it.sub} {it.date ? "· " + it.date : ""}</div>}
                        </div>
                        <span className={"pt-amt " + (it.type === "refund" ? "refund" : it.type === "fee" ? "fee" : it.type === "total" ? "total" : "")}>
                          {it.amount < 0 ? "−" : ""}${Math.abs(it.amount).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comms */}
              <div className="receipt-section">
                <div className="receipt-section-head">Communications</div>
                <div className="audit-list">
                  {r.comms.map((c, i) => (
                    <div className="audit-item" key={i}>
                      <span className="a-time">{c.time}</span>
                      <span className="a-text">{c.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit */}
              <div className="receipt-section">
                <div className="receipt-section-head">Audit trail</div>
                <div className="audit-list">
                  {r.audit.map((a, i) => (
                    <div className="audit-item" key={i}>
                      <span className="a-time">{a.time}</span>
                      <span className="a-text">{a.text}<span className="actor">{a.actor}</span>{a.post}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="receipt-actions">
              <button className="btn btn-secondary"><Icon name="phone" size={13}/>Call</button>
              <button className="btn btn-secondary"><Icon name="mail" size={13}/>Message</button>
              <button className="btn btn-secondary"><Icon name="edit" size={13}/>Edit</button>
              <div style={{flex: 1}}/>
              <button className="btn btn-primary"><Icon name="check" size={13}/>Seat guest</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Command-K (with Ask mode) ----------
function CommandK({ open, onClose, openReceipt, setSurface }) {
  const [q, setQ] = useState("");
  const [askMode, setAskMode] = useState(false);
  const [askAnswered, setAskAnswered] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setAskMode(false);
      setAskAnswered(false);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
    }
  }, [open]);

  // Default suggestions
  const reservations = PEAK.tapeReservations
    .filter(r => !q || r.name.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 4);

  const guests = PEAK.guests
    .filter(g => !q || g.name.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 3);

  const transactions = PEAK.payoutDetail.transactions
    .filter(t => !q || t.id.toLowerCase().includes(q.toLowerCase()) || t.reservation.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 3);

  const surfaces = [
    { id: "today", icon: "today", label: "Go to Today", sub: "Friday May 15 · 12:15 PM" },
    { id: "money", icon: "dollar", label: "Go to Money — Overview", sub: "YTD · $41,889 gross" },
    { id: "recon", icon: "recon", label: "Go to Reconciliation", sub: "5 exceptions in week May 8-14" }
  ].filter(s => !q || s.label.toLowerCase().includes(q.toLowerCase()));

  // Ask mode "answer"
  const askAnswers = {
    "no-show rate norma": { narration: "Norma's no-show rate at <b>Saturdays in April</b> was <b>3.8%</b> — 7 of 184 covers. Trailing 12-month rate is 4.1%. Tyler's Saturdays ran higher at 5.2%.", q: "What was the no-show rate at Norma's on Saturdays in April?" },
    "refund tyler": { narration: "Tyler issued <b>9 refunds</b> totaling <b>$842</b> in the last 30 days. 6 were guest-cancellation-with-fee-waived. 2 were comp credits. 1 was a misclick adjustment (refunded $20, voided).", q: "Show me every refund Tyler issued in the last 30 days." },
    "saturday": { narration: "Saturday May 16 has <b>91 covers</b> on the book vs. typical <b>407</b>. New bookings down 62%, concierge channel −84%, direct −54%. Weather forecast clear. No promo paused.", q: "Why are Saturday bookings soft?" },
    "table 43": { narration: "Table 43 averaged <b>147.9 min turn time</b> over the past 7 days vs. <b>91 min</b> trailing average. Server: Tyler. Kitchen pickup time on station 4 was up 18% Tuesday.", q: "Which tables had the slowest turns last month?" }
  };

  function findAskAnswer(query) {
    const lower = query.toLowerCase();
    if (lower.includes("no-show") || lower.includes("no show")) return askAnswers["no-show rate norma"];
    if (lower.includes("tyler") && lower.includes("refund")) return askAnswers["refund tyler"];
    if (lower.includes("saturday") || lower.includes("sat may")) return askAnswers["saturday"];
    if (lower.includes("turn") || lower.includes("table 43")) return askAnswers["table 43"];
    // Default: pretend we generated an answer
    return { narration: `<b>Generated answer for:</b> "${query}". The system is unable to answer this query confidently. <span style="color: var(--accent)">Try rephrasing</span> or open a <span style="color: var(--accent)">Reports → Custom</span>.`, q: query };
  }

  function handleEnter() {
    if (askMode && q) setAskAnswered(true);
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") handleEnter();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  if (!open) return null;

  return (
    <div className={"cmdk-backdrop " + (open ? "open" : "")} onClick={onClose}>
      <div className="cmdk-panel" onClick={e => e.stopPropagation()}>
        <div className="cmdk-input-row">
          <Icon name={askMode ? "sparkle" : "search"} size={16}/>
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder={askMode ? "Ask anything — e.g. 'Why are Saturday bookings soft?'" : "Search reservations, guests, transactions…"}
            value={q}
            onChange={e => { setQ(e.target.value); setAskAnswered(false); }}
          />
          <span className="cmdk-mode" onClick={() => setAskMode(!askMode)}>
            {askMode ? "Search" : "Ask AI"}
          </span>
        </div>

        {askMode && askAnswered ? (
          <div className="cmdk-results">
            {(() => {
              const ans = findAskAnswer(q);
              return (
                <div className="cmdk-ask-answer">
                  <div className="cmdk-ask-q">"{ans.q}"</div>
                  <div className="cmdk-ask-narration" dangerouslySetInnerHTML={{__html: ans.narration}}/>
                  <div style={{display: "flex", gap: 8, paddingBottom: 14}}>
                    <button className="btn btn-secondary" onClick={() => { setAskAnswered(false); }}><Icon name="refresh" size={12}/>Refine</button>
                    <button className="btn btn-secondary"><Icon name="report" size={12}/>Save as report</button>
                    <button className="btn btn-secondary"><Icon name="external" size={12}/>Open as view</button>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : askMode ? (
          <div className="cmdk-results">
            <div className="cmdk-group">
              <div className="cmdk-group-head">Try these</div>
              {[
                "What was the no-show rate at Norma's on Saturdays in April?",
                "Show me every refund Tyler issued in the last 30 days.",
                "Why are Saturday bookings soft this week?",
                "Which tables had the slowest turns last month?"
              ].map((s, i) => (
                <div key={i} className="cmdk-row" onClick={() => { setQ(s); setAskAnswered(true); }}>
                  <Icon name="sparkle" size={14}/>
                  <span>{s}</span>
                  <span className="kbd">↵</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="cmdk-results">
            {surfaces.length > 0 && (
              <div className="cmdk-group">
                <div className="cmdk-group-head">Surfaces</div>
                {surfaces.map(s => (
                  <div className="cmdk-row" key={s.id} onClick={() => { setSurface(s.id); onClose(); }}>
                    <Icon name={s.icon} size={14}/>
                    <div>
                      <div>{s.label}</div>
                      <div className="sub">{s.sub}</div>
                    </div>
                    <span className="kbd">↵</span>
                  </div>
                ))}
              </div>
            )}
            {reservations.length > 0 && (
              <div className="cmdk-group">
                <div className="cmdk-group-head">Reservations</div>
                {reservations.map(r => (
                  <div className="cmdk-row" key={r.id} onClick={() => { openReceipt(r.id); onClose(); }}>
                    <Icon name="book" size={14}/>
                    <div>
                      <div>{r.name}</div>
                      <div className="sub">{PEAK.minToTime(r.startMin)} · Table {r.table} · {r.party}-top</div>
                    </div>
                    <span className="kbd">⏎</span>
                  </div>
                ))}
              </div>
            )}
            {guests.length > 0 && (
              <div className="cmdk-group">
                <div className="cmdk-group-head">Guests</div>
                {guests.map(g => (
                  <div className="cmdk-row" key={g.name}>
                    <Icon name="users" size={14}/>
                    <div>
                      <div>{g.name}</div>
                      <div className="sub">{g.visits} visits · ${g.ltv.toLocaleString()} LTV · last {g.last}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {transactions.length > 0 && (
              <div className="cmdk-group">
                <div className="cmdk-group-head">Transactions</div>
                {transactions.map(t => (
                  <div className="cmdk-row" key={t.id}>
                    <Icon name="card" size={14}/>
                    <div>
                      <div>{t.id}</div>
                      <div className="sub">${t.amount.toFixed(2)} · {t.reservation} · {t.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Toast (simple notification) ----------
function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="toast-wrap">
      <div className="toast">
        <Icon name="check" size={14}/>
        <span>{msg}</span>
      </div>
    </div>
  );
}

Object.assign(window, { Sparkline, WhyPopover, AnnotationMarker, CompareChart, ReceiptDrawer, CommandK, Toast });
