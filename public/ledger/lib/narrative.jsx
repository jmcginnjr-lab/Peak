// =========================================================================
// Narrative primitives — Expandable, NarrativeHero, ChangedItem
// "Simple by default, advanced by choice"
// =========================================================================

function Expandable({ icon = "expand", title, sub, defaultOpen = false, children, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={"nar-expand " + (open ? "open" : "")}>
      <div className="nar-expand-head" onClick={() => setOpen(!open)}>
        <div className="nar-expand-icon"><Icon name={icon} size={15}/></div>
        <div className="nar-expand-text">
          <div className="nar-expand-title">{title}{badge && <span className="lg-nav-badge" style={{marginLeft: 8, fontSize: 9.5}}>{badge}</span>}</div>
          {sub && <div className="nar-expand-sub">{sub}</div>}
        </div>
        <div className="nar-expand-chev"><Icon name="chevron-right" size={16}/></div>
      </div>
      <div className="nar-expand-body">
        {open && children}
      </div>
    </div>
  );
}

function NarrativeHero({ eyebrow, headline, sub, children }) {
  return (
    <div className="nar-hero">
      {eyebrow && <div className="nar-eyebrow">{eyebrow}</div>}
      <div className="nar-headline" dangerouslySetInnerHTML={{__html: headline}}/>
      {sub && <div className="nar-sub" dangerouslySetInnerHTML={{__html: sub}}/>}
      {children}
    </div>
  );
}

function FocusCard({ tone, eyebrow, title, body, actions }) {
  return (
    <div className={"nar-focus " + (tone || "")}>
      <div>
        <div className="nf-eyebrow">{eyebrow}</div>
        <div className="nf-title">{title}</div>
        <div className="nf-body" dangerouslySetInnerHTML={{__html: body}}/>
      </div>
      <div className="nf-actions">
        {actions}
      </div>
    </div>
  );
}

function ChangedItem({ delta, deltaDir = "flat", headline, sub, meta, onClick }) {
  return (
    <div className="changed-item" onClick={onClick}>
      <div className={"changed-delta " + deltaDir}>{delta}</div>
      <div className="changed-body">
        <div className="changed-headline">{headline}</div>
        <div className="changed-sub" dangerouslySetInnerHTML={{__html: sub}}/>
      </div>
      <div className="changed-meta">{meta}</div>
    </div>
  );
}

function SectionHeader({ title, meta, action }) {
  return (
    <div className="nar-section">
      <div className="nar-section-title">{title}</div>
      <div style={{display: "flex", alignItems: "baseline", gap: 14}}>
        {meta && <div className="nar-section-meta">{meta}</div>}
        {action}
      </div>
    </div>
  );
}

// In-surface controls: time scope + compare mode. Lives at the top of
// Money and Forecast where it actually matters.
function SurfaceControls({ timeScope, setTimeScope, compareMode, setCompareMode, scopes = ["Today", "Week", "Month", "YTD", "Custom"], compareOptions = ["off", "WoW", "YoY", "Forecast"] }) {
  return (
    <div className="surface-controls">
      {timeScope != null && (
        <div className="lg-scope">
          {scopes.map(s => (
            <button key={s} className={timeScope === s ? "active" : ""} onClick={() => setTimeScope(s)}>{s}</button>
          ))}
        </div>
      )}
      {compareMode != null && (
        <button
          className={"lg-compare " + (compareMode !== "off" ? "on" : "")}
          onClick={() => {
            const i = compareOptions.indexOf(compareMode);
            setCompareMode(compareOptions[(i + 1) % compareOptions.length]);
          }}
        >
          <Icon name="compare" size={13}/>
          <span>vs.</span>
          <span className="cmp-val">{compareMode === "off" ? "—" : compareMode}</span>
        </button>
      )}
    </div>
  );
}

Object.assign(window, { Expandable, NarrativeHero, FocusCard, ChangedItem, SectionHeader, SurfaceControls });
