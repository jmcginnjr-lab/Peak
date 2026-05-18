// =========================================================================
// Peak Ledger — Shell components (Sidebar, Topbar, Highlights Rail)
// =========================================================================

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ---------- Tiny SVG icon helpers (1.5px stroke, hand-rolled to avoid external deps) ----------
function Icon({ name, size = 16 }) {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor", strokeWidth: 1.5,
    strokeLinecap: "round", strokeLinejoin: "round"
  };
  const paths = {
    "calendar":  <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
    "today":     <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    "book":      <><path d="M4 19V5a2 2 0 0 1 2-2h11l3 3v15H6a2 2 0 0 1-2-2z"/><path d="M9 7h7M9 11h7M9 15h5"/></>,
    "dollar":    <><path d="M12 2v20"/><path d="M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    "users":     <><circle cx="9" cy="8" r="3.5"/><path d="M3 21c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M15 21c0-3 2-5 4-5"/></>,
    "trend":     <><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></>,
    "report":    <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/></>,
    "recon":     <><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 5v6h-6"/><path d="M9 12l2 2 4-4"/></>,
    "pulse":     <><path d="M3 12h4l3-7 4 14 3-7h4"/></>,
    "settings":  <><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.5a7 7 0 0 0-2 1.2L5 5.9 3 9.3l2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2L10 21h4l.6-2.5a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z"/></>,
    "search":    <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/></>,
    "bell":      <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    "compare":   <><path d="M16 3l5 5-5 5"/><path d="M21 8H8a5 5 0 0 0-5 5"/><path d="M8 21l-5-5 5-5"/><path d="M3 16h13a5 5 0 0 0 5-5"/></>,
    "chevron-down": <><path d="M6 9l6 6 6-6"/></>,
    "chevron-right": <><path d="M9 6l6 6-6 6"/></>,
    "chevron-left":  <><path d="M15 6l-6 6 6 6"/></>,
    "x":         <><path d="M18 6L6 18M6 6l12 12"/></>,
    "filter":    <><path d="M3 5h18l-7 9v6l-4-2v-4z"/></>,
    "download":  <><path d="M12 4v12"/><path d="M7 11l5 5 5-5"/><path d="M5 20h14"/></>,
    "share":     <><circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M8.6 10.6l6.8-3.2M8.6 13.4l6.8 3.2"/></>,
    "plus":      <><path d="M12 5v14M5 12h14"/></>,
    "check":     <><path d="M5 13l4 4L19 7"/></>,
    "alert":     <><path d="M12 9v4M12 17h0"/><circle cx="12" cy="12" r="9"/></>,
    "info":      <><circle cx="12" cy="12" r="9"/><path d="M12 8h0M12 12v4"/></>,
    "card":      <><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 11h18"/></>,
    "edit":      <><path d="M4 20h4l10-10-4-4L4 16v4z"/></>,
    "user-x":    <><circle cx="10" cy="8" r="3.5"/><path d="M3 21c0-3.3 2.7-6 6-6h2"/><path d="M16 15l5 5M21 15l-5 5"/></>,
    "user-plus": <><circle cx="10" cy="8" r="3.5"/><path d="M3 21c0-3.3 2.7-6 6-6h2"/><path d="M17 13v6M14 16h6"/></>,
    "comment":   <><path d="M4 4h16v12H8l-4 4z"/></>,
    "refresh":   <><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 5v6h-6"/></>,
    "phone":     <><path d="M22 16.9v2.9a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.2 2h2.9a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></>,
    "mail":      <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></>,
    "tag":       <><path d="M20 12l-8 8-9-9V3h8z"/><circle cx="7" cy="7" r="1.5"/></>,
    "sparkle":   <><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></>,
    "external":  <><path d="M14 4h6v6"/><path d="M20 4l-10 10"/><path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></>,
    "expand":    <><path d="M4 14v6h6"/><path d="M20 10V4h-6"/><path d="M4 20l7-7M20 4l-7 7"/></>,
    "command":   <><path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z"/></>,
    "menu":      <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    "eye":       <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></>,
    "eye-off":   <><path d="M2 12s4-7 10-7c2.5 0 4.7 1 6.5 2.5"/><path d="M22 12s-4 7-10 7c-2.5 0-4.7-1-6.5-2.5"/><path d="M3 3l18 18"/></>,
    "wallet":    <><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M16 12h3"/></>,
    "receipt":   <><path d="M4 3h16v18l-3-2-2 2-2-2-2 2-2-2-2 2-3-2z"/><path d="M8 7h8M8 11h8M8 15h5"/></>,
    "table":     <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18M15 3v18"/></>,
    "clock":     <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    "lock":      <><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
    "anchor":    <><circle cx="12" cy="5" r="2"/><path d="M12 7v14"/><path d="M5 18a7 7 0 0 0 14 0"/><path d="M3 14h2M19 14h2"/></>,
    "bolt":      <><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></>,
    "warn":      <><path d="M10.3 3.7L2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h0"/></>,
  };
  return <svg {...props}>{paths[name] || <circle cx="12" cy="12" r="9"/>}</svg>;
}

// ---------- Sidebar ----------
function Sidebar({ surface, setSurface, persona, collapsed, setCollapsed }) {
  const [hovering, setHovering] = useState(false);
  const enterTimerRef = useRef(null);
  const leaveTimerRef = useRef(null);

  function onEnter() {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    if (!collapsed) return;
    // Delay opening — so people brushing past don't get a jump-open
    enterTimerRef.current = setTimeout(() => setHovering(true), 700);
  }
  function onLeave() {
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    leaveTimerRef.current = setTimeout(() => setHovering(false), 120);
  }
  // Reset hover state when collapsed toggles
  useEffect(() => { setHovering(false); }, [collapsed]);

  const sections = [
    {
      label: null,
      items: [
        { id: "today",       icon: "today",   label: "Today", badge: null },
        { id: "reservations",icon: "book",    label: "Reservations", badge: "60" },
        { id: "money",       icon: "dollar",  label: "Money", badge: persona === "CFO" ? "3" : null, badgeClass: "warn" },
      ]
    },
    {
      label: "People",
      items: [
        { id: "guests",      icon: "users",   label: "Guests" },
      ]
    },
    {
      label: "Planning",
      items: [
        { id: "forecast",    icon: "trend",   label: "Forecast", badge: "Soft", badgeClass: "warn" },
        { id: "reports",     icon: "report",  label: "Reports" },
      ]
    },
    {
      label: "Books",
      items: [
        { id: "recon",       icon: "recon",   label: "Reconciliation", badge: "5", badgeClass: persona === "CFO" ? "warn" : null },
        { id: "activity",    icon: "pulse",   label: "Activity", badge: "3" },
      ]
    },
    {
      label: "Admin",
      items: [
        { id: "settings",    icon: "settings",label: "Settings" },
      ]
    }
  ];

  const showFull = !collapsed || hovering;

  return (
    <aside
      className={"lg-sidebar" + (collapsed ? " collapsed" : "") + (collapsed && hovering ? " hovering" : "")}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="lg-brand">
        <button
          className="lg-brand-logo"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <img src="assets/peak-mark-gold.svg" alt="Peak"/>
          <span className="lg-brand-chev">
            <Icon name={collapsed ? "chevron-right" : "chevron-left"} size={10}/>
          </span>
        </button>
        <div className="lg-brand-text">
          <div className="lg-brand-name">Peak Ledger</div>
          <div className="lg-brand-sub">v0.1 · Beta</div>
        </div>
      </div>

      <div className="lg-location" title={collapsed && !hovering ? "Norma's · 1 of 4 locations" : undefined}>
        {collapsed && !hovering ? (
          <div style={{
            width: 24, height: 24, borderRadius: 5,
            background: "var(--peak-ink-600)",
            color: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 600
          }}>N</div>
        ) : (
          <div style={{display: "contents"}}>
            <div className="loc-meta">
              <div className="loc-name">Norma's</div>
              <div className="loc-portfolio">PORTFOLIO · 1 of 4</div>
            </div>
            <Icon name="chevron-down" size={14}/>
          </div>
        )}
      </div>

      <nav className="lg-nav">
        {sections.map((sec, si) => (
          <div key={si} style={{display: "contents"}}>
            {sec.label && <div className="lg-nav-section">{sec.label}</div>}
            {sec.items.map(item => (
              <div
                key={item.id}
                className={"lg-nav-item " + (surface === item.id ? "active" : "")}
                onClick={() => setSurface(item.id)}
                title={collapsed && !hovering ? item.label : undefined}
                data-has-badge={item.badge ? "1" : "0"}
              >
                <Icon name={item.icon} size={16}/>
                <span className="lg-nav-label">{item.label}</span>
                {item.badge && <span className={"lg-nav-badge " + (item.badgeClass || "")}>{item.badge}</span>}
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div className="lg-foot">
        <div className="avatar" title={collapsed && !hovering ? (persona === "CFO" ? "Becca Maddox · CFO" : persona === "Owner" ? "Reggie Costa · Owner" : "Brienna Brown · GM") : undefined}>
          {persona === "CFO" ? "BM" : persona === "Owner" ? "RC" : "BB"}
        </div>
        <div className="user">
          <div className="u-n">{persona === "CFO" ? "Becca Maddox" : persona === "Owner" ? "Reggie Costa" : "Brienna Brown"}</div>
          <div className="u-r">{persona}</div>
        </div>
      </div>
    </aside>
  );
}

// ---------- Topbar ----------
function Topbar({ surface, onCmdK, onBellClick, bellCount, viewMode, setViewMode, trayPinned }) {
  return (
    <header className="lg-topbar">
      <div className="lg-topbar-center">
        <div className="lg-search" onClick={onCmdK}>
          <Icon name="search" size={14}/>
          <input className="lg-search-input" placeholder="Search or ask anything…" readOnly/>
          <span className="lg-kbd">⌘K</span>
        </div>

        <div className="lg-view-toggle">
          <button className={viewMode === "narrative" ? "active" : ""} onClick={() => setViewMode("narrative")} title="Insights — narrative, simple by default">
            <span>Insights</span>
          </button>
          <button className={viewMode === "dashboard" ? "active" : ""} onClick={() => setViewMode("dashboard")} title="Report — everything at once">
            <span>Report</span>
          </button>
        </div>
      </div>

      {!trayPinned && (
        <div className="lg-topbar-far-right">
          <button className="lg-icon-btn lg-bell" onClick={onBellClick} title="Activity tray">
            <Icon name="bell" size={14}/>
            {bellCount > 0 && <span className="lg-bell-dot">{bellCount}</span>}
          </button>
        </div>
      )}
    </header>
  );
}

// ---------- Highlights Rail ----------
function HighlightsRail({ persona, openReceipt, setSurface }) {
  const data = PEAK.highlights[persona] || PEAK.highlights.GM;
  const [showAll, setShowAll] = useState(false);

  // By default show only top 2-3 items across all categories
  const sections = [
    { key: "needsYou", label: "Needs you" },
    { key: "whatChanged", label: "What changed" },
    { key: "coming", label: "What's coming" },
    { key: "wins", label: "Wins" }
  ];

  // Count total items
  const totalItems = sections.reduce((s, sec) => s + (data[sec.key]?.length || 0), 0);

  return (
    <aside className="lg-rail">
      <div className="lg-rail-head">
        <div className="lg-rail-title">Highlights</div>
        <span className="mono subtle" style={{fontSize: 10, letterSpacing: "0.1em"}}>{persona.toUpperCase()}</span>
      </div>

      {sections.map(sec => {
        const items = data[sec.key] || [];
        if (!items.length) return null;
        // In quiet mode, only show top 1 per section (urgent prioritized)
        const visible = showAll ? items : items.slice(0, 1);
        return (
          <div key={sec.key} style={{display: "contents"}}>
            <div className="lg-rail-section">{sec.label}</div>
            {visible.map((item, i) => (
              <div
                key={i}
                className={"lg-rail-card " + (item.urgent ? "urgent " : "") + (item.danger ? "danger " : "") + (item.win ? "win " : "")}
                onClick={() => {
                  if (/reconcil/i.test(item.title)) setSurface("recon");
                  else if (/dispute/i.test(item.title)) setSurface("money");
                  else if (/saturday/i.test(item.title) || /pacing/i.test(item.title)) setSurface("forecast");
                  else if (/brown|brienna/i.test(item.title)) openReceipt("r-024");
                  else if (/12-top|lai-sutton/i.test(item.title)) setSurface("reservations");
                }}
              >
                <div className="lg-rail-card-head">
                  <div className="lg-rail-card-title">{item.title}</div>
                  <div className="lg-rail-card-meta">{item.tag}</div>
                </div>
                {showAll && item.body && <div className="lg-rail-card-body">{item.body}</div>}
                {showAll && item.cta && <div className="lg-rail-card-cta">{item.cta}</div>}
              </div>
            ))}
          </div>
        );
      })}

      <div className="lg-rail-show-more" onClick={() => setShowAll(!showAll)}>
        {showAll ? "Show less ↑" : `Show all ${totalItems} · with detail ↓`}
      </div>
    </aside>
  );
}

Object.assign(window, { Icon, Sidebar, Topbar, HighlightsRail });
