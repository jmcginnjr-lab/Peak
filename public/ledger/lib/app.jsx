// =========================================================================
// Peak Ledger — App root
// =========================================================================

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "persona": "GM",
  "compareMode": "WoW",
  "density": "default",
  "viewMode": "narrative",
  "sidebarCollapsed": false,
  "trayPinned": false
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [surface, setSurface] = useState("today");
  const [receiptId, setReceiptId] = useState(null);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // timeScope kept here for future surfaces that consume it; not in topbar anymore.
  const timeScope = "Today";

  const persona = t.persona;
  const compareMode = t.compareMode;
  const density = t.density;
  const viewMode = t.viewMode || "narrative";
  const sidebarCollapsed = !!t.sidebarCollapsed;
  const trayPinned = !!t.trayPinned;
  const railVisible = false; // legacy

  const { notes, toasts, dismissToast, openTrayFromToast } = useNotifications(persona);
  const unreadCount = notes.filter(n => !n.read).length;

  // Route persona → default surface ONCE on persona change
  useEffect(() => {
    if (persona === "CFO") setSurface("money");
    else if (persona === "Owner") setSurface("today");
    else if (persona === "Read-only") setSurface("reports");
    else setSurface("today");
  }, [persona]);

  // ⌘K handler
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdkOpen(true);
      }
      if (e.key === "Escape") {
        setReceiptId(null);
        setCmdkOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Toast helper
  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }

  const openReceipt = (id) => setReceiptId(id);

  // Surface switcher
  function renderSurface() {
    switch (surface) {
      case "today": return <TodaySurface openReceipt={openReceipt} compareMode={compareMode} viewMode={viewMode}/>;
      case "reservations": return <ReservationsSurface openReceipt={openReceipt} viewMode={viewMode}/>;
      case "money": return <MoneySurface compareMode={compareMode} setCompareMode={(v) => setTweak("compareMode", v)} viewMode={viewMode}/>;
      case "guests": return <GuestsSurface openReceipt={openReceipt} viewMode={viewMode}/>;
      case "forecast": return <ForecastSurface viewMode={viewMode} compareMode={compareMode} setCompareMode={(v) => setTweak("compareMode", v)}/>;
      case "reports": return <ReportsSurface/>;
      case "recon": return <ReconciliationSurface/>;
      case "activity": return <ActivitySurface/>;
      case "settings": return <SettingsSurface/>;
      default: return <TodaySurface openReceipt={openReceipt} compareMode={compareMode} viewMode={viewMode}/>;
    }
  }

  return (
    <div className={"ledger-root density-" + density + " rail-hidden" + (sidebarCollapsed ? " sidebar-collapsed" : "") + (trayPinned ? " tray-pinned" : "")}>
      <Sidebar surface={surface} setSurface={setSurface} persona={persona} collapsed={sidebarCollapsed} setCollapsed={(v) => setTweak("sidebarCollapsed", v)}/>
      <Topbar
        surface={surface}
        onCmdK={() => setCmdkOpen(true)}
        onBellClick={() => setTrayOpen(true)}
        bellCount={unreadCount}
        viewMode={viewMode}
        setViewMode={(v) => setTweak("viewMode", v)}
        trayPinned={trayPinned}
      />
      <div className="lg-main" data-screen-label={"01 " + surface}>
        <div className="lg-content">
          {renderSurface()}
        </div>
      </div>

      <ActivityTray
        open={trayOpen || trayPinned}
        onClose={() => setTrayOpen(false)}
        notes={notes}
        persona={persona}
        openReceipt={openReceipt}
        setSurface={(s) => { setSurface(s); if (!trayPinned) setTrayOpen(false); }}
        pinned={trayPinned}
        setPinned={(v) => { setTweak("trayPinned", v); if (v) setTrayOpen(false); }}
      />
      <ToastStack
        toasts={toasts}
        onDismiss={dismissToast}
        onOpen={(note) => { openTrayFromToast(note); setTrayOpen(true); }}
      />

      <ReceiptDrawer receiptId={receiptId} onClose={() => setReceiptId(null)}/>
      <CommandK open={cmdkOpen} onClose={() => setCmdkOpen(false)} openReceipt={openReceipt} setSurface={setSurface}/>
      <Toast msg={toast}/>

      {/* Tweaks panel */}
      <TweaksPanel title="Peak Ledger · Tweaks">
        <TweakSection label="Active persona">
          <TweakRadio
            label="Role"
            value={persona}
            onChange={(v) => setTweak("persona", v)}
            options={[
              { value: "GM", label: "GM" },
              { value: "CFO", label: "CFO" },
              { value: "Owner", label: "Owner" },
              { value: "Read-only", label: "Read" }
            ]}
          />
        </TweakSection>
        <TweakSection label="Compare mode">
          <TweakRadio
            label="vs."
            value={compareMode}
            onChange={(v) => setTweak("compareMode", v)}
            options={[
              { value: "off", label: "Off" },
              { value: "WoW", label: "WoW" },
              { value: "YoY", label: "YoY" },
              { value: "Forecast", label: "Fc" }
            ]}
          />
        </TweakSection>
        <TweakSection label="Density">
          <TweakRadio
            label="Spacing"
            value={density}
            onChange={(v) => setTweak("density", v)}
            options={[
              { value: "default", label: "Default" },
              { value: "compact", label: "Compact" }
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
