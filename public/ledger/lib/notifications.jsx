// =========================================================================
// Notification system — macOS-style toasts + activity tray drawer
// Replaces the persistent Highlights rail.
// =========================================================================

// Toast that slides in top-right, auto-dismisses
function NotificationToast({ note, onDismiss, onOpen }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const t = setTimeout(() => setVisible(false), 6500);
    const t2 = setTimeout(() => onDismiss && onDismiss(note.id), 7000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [note.id]);

  return (
    <div className={"toast-note " + (visible ? "in" : "out") + " " + (note.tone || "")} onClick={() => { setVisible(false); setTimeout(() => onOpen && onOpen(note), 200); }}>
      <div className="toast-note-icon"><Icon name={note.icon || "bell"} size={14}/></div>
      <div className="toast-note-body">
        <div className="toast-note-eyebrow">{note.eyebrow}</div>
        <div className="toast-note-title">{note.title}</div>
        {note.body && <div className="toast-note-sub">{note.body}</div>}
      </div>
      <button className="toast-note-close" onClick={(e) => { e.stopPropagation(); setVisible(false); setTimeout(() => onDismiss && onDismiss(note.id), 200); }}>
        <Icon name="x" size={11}/>
      </button>
    </div>
  );
}

// Toast stack at top-right
function ToastStack({ toasts, onDismiss, onOpen }) {
  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <NotificationToast key={t.id} note={t} onDismiss={onDismiss} onOpen={onOpen}/>
      ))}
    </div>
  );
}

// Activity tray drawer (slides from right) — replaces the persistent rail
function ActivityTray({ open, onClose, notes, persona, openReceipt, setSurface, pinned, setPinned }) {
  const [tab, setTab] = useState("unread");
  const unread = notes.filter(n => !n.read);
  const all = notes;
  const shown = tab === "unread" ? unread : all;

  // Group by section
  const grouped = {};
  shown.forEach(n => {
    const section = n.section || "Updates";
    if (!grouped[section]) grouped[section] = [];
    grouped[section].push(n);
  });

  // Pinned mode renders as a docked column instead of a drawer
  const isVisible = open || pinned;

  return (
    <div style={{display: "contents"}}>
      {!pinned && <div className={"tray-backdrop " + (open ? "open" : "")} onClick={onClose}/>}
      <aside className={"tray-drawer " + (isVisible ? "open" : "") + (pinned ? " pinned" : "")}>
        <div className="tray-head">
          <div>
            <div className="receipt-eyebrow">Activity · {persona}</div>
            <div className="tray-title">Activity</div>
          </div>
          <div style={{display: "flex", gap: 6}}>
            <button
              className="lg-icon-btn"
              onClick={() => setPinned(!pinned)}
              title={pinned ? "Unpin (open as drawer)" : "Pin to side"}
            >
              <Icon name={pinned ? "x" : "anchor"} size={14}/>
            </button>
            {!pinned && (
              <button className="lg-icon-btn" onClick={onClose} title="Close">
                <Icon name="x" size={14}/>
              </button>
            )}
          </div>
        </div>

        <div className="tray-tabs">
          <button className={tab === "unread" ? "active" : ""} onClick={() => setTab("unread")}>
            Unread <span className="mono" style={{color: tab === "unread" ? "var(--accent)" : "var(--fg-subtle)", marginLeft: 4}}>{unread.length}</span>
          </button>
          <button className={tab === "all" ? "active" : ""} onClick={() => setTab("all")}>
            All <span className="mono" style={{color: tab === "all" ? "var(--accent)" : "var(--fg-subtle)", marginLeft: 4}}>{all.length}</span>
          </button>
        </div>

        <div className="tray-body">
          {shown.length === 0 ? (
            <div className="tray-empty">
              <Icon name="check" size={20}/>
              <div style={{marginTop: 10}}>You're caught up.</div>
            </div>
          ) : (
            Object.entries(grouped).map(([section, items]) => (
              <div key={section} className="tray-section">
                <div className="tray-section-head">{section}</div>
                {items.map(n => (
                  <div
                    key={n.id}
                    className={"tray-item " + (n.tone || "") + (n.read ? " read" : "")}
                    onClick={() => {
                      if (n.target?.receipt) openReceipt(n.target.receipt);
                      else if (n.target?.surface) setSurface(n.target.surface);
                      if (!pinned) onClose();
                    }}
                  >
                    <div className="tray-item-icon"><Icon name={n.icon || "bell"} size={13}/></div>
                    <div className="tray-item-body">
                      <div className="tray-item-head">
                        <div className="tray-item-title">{n.title}</div>
                        <div className="tray-item-meta">{n.eyebrow}</div>
                      </div>
                      {n.body && <div className="tray-item-sub">{n.body}</div>}
                      {n.cta && <div className="tray-item-cta">{n.cta}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}

// Hook that manages notifications: load initial set per persona,
// fire occasional new ones as toasts.
function useNotifications(persona) {
  const [notes, setNotes] = useState([]);
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(1);
  const sequenceRef = useRef([]);
  const timersRef = useRef([]);

  // Reset & seed when persona changes
  useEffect(() => {
    const data = PEAK.highlights[persona] || PEAK.highlights.GM;
    const seeded = [];
    const sectionMap = { needsYou: "Needs you", whatChanged: "What changed", coming: "Coming up", wins: "Wins" };
    Object.entries(sectionMap).forEach(([key, label]) => {
      (data[key] || []).forEach((item, i) => {
        seeded.push({
          id: `n-${persona}-${key}-${i}`,
          section: label,
          eyebrow: item.tag,
          title: item.title,
          body: item.body,
          cta: item.cta,
          target: item.target,
          tone: item.urgent ? "urgent" : item.danger ? "danger" : item.win ? "win" : item.warn ? "warn" : "",
          icon: item.urgent ? "alert" : item.danger ? "warn" : item.win ? "check" : item.warn ? "warn" : "info",
          read: false
        });
      });
    });
    setNotes(seeded);
    setToasts([]);
    sequenceRef.current = [];

    // Clear any pending timers
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];

    // Schedule a single "fresh" toast to demo the system. Only one at a time.
    const t = setTimeout(() => {
      if (seeded[0]) {
        const note = { ...seeded[0], id: `t-${idRef.current++}` };
        setToasts([note]);
      }
    }, 1800);
    timersRef.current.push(t);

    return () => {
      timersRef.current.forEach(t => clearTimeout(t));
    };
  }, [persona]);

  function dismissToast(id) {
    setToasts(prev => prev.filter(t => t.id !== id));
  }

  function openTrayFromToast(note) {
    setNotes(prev => prev.map(n => n.title === note.title ? { ...n, read: false } : n));
    dismissToast(note.id);
  }

  function markAllRead() {
    setNotes(prev => prev.map(n => ({ ...n, read: true })));
  }

  function fireSampleNotification(note) {
    const fresh = { ...note, id: `t-manual-${idRef.current++}` };
    setToasts([fresh]); // single, not stacked
    setNotes(prev => [fresh, ...prev]);
  }

  return { notes, toasts, dismissToast, openTrayFromToast, markAllRead, fireSampleNotification };
}

Object.assign(window, { NotificationToast, ToastStack, ActivityTray, useNotifications });
