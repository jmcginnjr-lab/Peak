// =========================================================================
// Peak Ledger — Shared data layer
// All surfaces read from window.PEAK so the narrative stays consistent.
// =========================================================================

window.PEAK = (function() {
  const NOW = { date: "Fri May 15, 2026", time: "12:15 PM", day: "Friday" };

  // ---------- Today: shift state ----------
  const todayShift = {
    state: "Lunch · In service",
    seated: 47,
    capacity: 60,
    walkIns: 3,
    walkInsTotal: 5,
    late: 1,
    turning: 8,
    arriving: 5
  };

  // ---------- The Tape: today's bookings (each = { table, party, time, name, status, deposit, vip, allergy, source, revenue }) ----------
  // Tape goes 11am → 10pm. Times in minutes from 11:00.
  // status: seated, confirmed, arriving, departed, late, no-show
  const tapeReservations = [
    { id: "r-001", table: 11, party: 2, startMin: 30, durMin: 90, name: "Holland T.", status: "seated", deposit: "paid", source: "direct", revenue: 14 },
    { id: "r-002", table: 12, party: 4, startMin: 0, durMin: 100, name: "Pugh family", status: "departed", deposit: "paid", source: "direct", revenue: 28 },
    { id: "r-003", table: 13, party: 2, startMin: 60, durMin: 95, name: "Marquez", status: "seated", deposit: "paid", vip: true, source: "direct", revenue: 14 },
    { id: "r-004", table: 14, party: 6, startMin: 45, durMin: 120, name: "Okonkwo party", status: "seated", deposit: "paid", source: "concierge", revenue: 42 },
    { id: "r-005", table: 15, party: 2, startMin: 75, durMin: 90, name: "Chen", status: "confirmed", deposit: "paid", source: "direct", revenue: 14 },
    { id: "r-006", table: 17, party: 4, startMin: 90, durMin: 105, name: "Whitman", status: "confirmed", deposit: "paid", allergy: true, source: "direct", revenue: 28 },
    { id: "r-007", table: 20, party: 8, startMin: 120, durMin: 150, name: "Sato birthday", status: "confirmed", deposit: "paid", vip: true, source: "direct", revenue: 80 },
    { id: "r-008", table: 21, party: 2, startMin: 30, durMin: 80, name: "Ricci", status: "seated", deposit: "comp", source: "direct", revenue: 0 },
    { id: "r-009", table: 23, party: 2, startMin: 20, durMin: 75, name: "Beauchamp", status: "seated", deposit: "paid", source: "direct", revenue: 14 },
    { id: "r-010", table: 24, party: 5, startMin: 95, durMin: 110, name: "Mercer team", status: "confirmed", deposit: "paid", source: "concierge", revenue: 35 },
    { id: "r-011", table: 25, party: 4, startMin: 30, durMin: 100, name: "Vasquez", status: "seated", deposit: "paid", source: "direct", revenue: 28 },
    { id: "r-012", table: 27, party: 2, startMin: 165, durMin: 80, name: "Bremmer", status: "confirmed", deposit: "paid", source: "direct", revenue: 14 },
    { id: "r-013", table: 30, party: 4, startMin: 15, durMin: 95, name: "Aalto", status: "departed", deposit: "paid", source: "direct", revenue: 28 },
    { id: "r-014", table: 31, party: 2, startMin: 90, durMin: 85, name: "Park", status: "confirmed", deposit: "paid", source: "direct", revenue: 14 },
    { id: "r-015", table: 32, party: 4, startMin: 105, durMin: 105, name: "Kalra", status: "confirmed", deposit: "refunded", source: "direct", revenue: 0 },
    { id: "r-016", table: 33, party: 2, startMin: 60, durMin: 80, name: "Ng", status: "seated", deposit: "paid", source: "direct", revenue: 14 },
    { id: "r-017", table: 40, party: 6, startMin: 110, durMin: 140, name: "Saito-Brown", status: "confirmed", deposit: "paid", vip: true, source: "direct", revenue: 42 },
    { id: "r-018", table: 41, party: 2, startMin: 130, durMin: 80, name: "Caldwell", status: "confirmed", deposit: "paid", source: "direct", revenue: 14 },
    { id: "r-019", table: 42, party: 4, startMin: 145, durMin: 110, name: "Brown, Brienna", status: "confirmed", deposit: "paid", vip: true, source: "direct", revenue: 35 },
    { id: "r-020", table: 43, party: 2, startMin: -10, durMin: 70, name: "Otieno", status: "no-show", deposit: "forfeited", source: "direct", revenue: 18 },
    { id: "r-021", table: 60, party: 12, startMin: 180, durMin: 180, name: "Lai-Sutton 12-top", status: "warn", deposit: "pending", source: "direct", revenue: 240 },
    { id: "r-022", table: 61, party: 4, startMin: 170, durMin: 110, name: "Albright", status: "confirmed", deposit: "paid", source: "direct", revenue: 28 },
    { id: "r-023", table: 62, party: 2, startMin: 200, durMin: 90, name: "DeLuca", status: "confirmed", deposit: "paid", source: "direct", revenue: 14 },
    { id: "r-024", table: 63, party: 9, startMin: 225, durMin: 140, name: "Brown, Brienna (PM)", status: "confirmed", deposit: "paid", vip: true, source: "direct", revenue: 90 },
    // Evening / dinner
    { id: "r-101", table: 12, party: 2, startMin: 360, durMin: 95, name: "Monahan, Elinor", status: "confirmed", deposit: "paid", source: "direct", revenue: 50 },
    { id: "r-102", table: 13, party: 2, startMin: 330, durMin: 120, name: "Zoller, Kylie", status: "confirmed", deposit: "paid", vip: true, source: "concierge", revenue: 60 },
    { id: "r-103", table: 13, party: 2, startMin: 460, durMin: 95, name: "Sykes, Ben", status: "confirmed", deposit: "paid", source: "direct", revenue: 50 },
    { id: "r-104", table: 14, party: 2, startMin: 360, durMin: 105, name: "O'Quinn, Brandon", status: "confirmed", deposit: "paid", source: "direct", revenue: 50 },
    { id: "r-105", table: 15, party: 6, startMin: 320, durMin: 140, name: "Moore, Kathleen", status: "confirmed", deposit: "paid", vip: true, source: "direct", revenue: 180 },
    { id: "r-106", table: 17, party: 6, startMin: 320, durMin: 140, name: "Moore, Kathleen", status: "confirmed", deposit: "paid", source: "direct", revenue: 180 },
    { id: "r-107", table: 17, party: 4, startMin: 470, durMin: 110, name: "Perez, Esmeralda", status: "confirmed", deposit: "paid", source: "direct", revenue: 100 },
    { id: "r-108", table: 20, party: 4, startMin: 355, durMin: 115, name: "Anderson, Darius", status: "confirmed", deposit: "paid", source: "direct", revenue: 100 },
    { id: "r-109", table: 21, party: 2, startMin: 345, durMin: 120, name: "Cole, Jeffrey", status: "confirmed", deposit: "paid", source: "direct", revenue: 60 },
    { id: "r-110", table: 23, party: 2, startMin: 340, durMin: 110, name: "Di Figlia, Rob", status: "confirmed", deposit: "paid", source: "direct", revenue: 60 },
    { id: "r-111", table: 24, party: 5, startMin: 360, durMin: 130, name: "Moiseeva, Elena", status: "confirmed", deposit: "paid", vip: true, source: "direct", revenue: 150 },
    { id: "r-112", table: 25, party: 5, startMin: 360, durMin: 130, name: "Moiseeva, Elena", status: "confirmed", deposit: "paid", source: "direct", revenue: 150 },
    { id: "r-113", table: 27, party: 2, startMin: 405, durMin: 100, name: "Forde", status: "confirmed", deposit: "paid", source: "direct", revenue: 50 },
  ];

  // ---------- Tape revenue ribbon by 15-min slot (lunch + dinner) ----------
  // 11am → 10pm = 11hrs × 4 slots = 44 slots. Each value = $/15min slot revenue accrued.
  const tapeRevenue = [
    // 11:00 - 1:00pm (8 slots) — lunch ramp
    8, 14, 22, 28, 38, 64, 96, 84,
    // 1:00 - 3:00 (8 slots) — lunch tail
    72, 54, 36, 22, 14, 8, 6, 4,
    // 3:00 - 5:00 (8 slots) — quiet
    2, 4, 6, 8, 10, 14, 22, 32,
    // 5:00 - 7:00 (8 slots) — dinner ramp
    48, 64, 96, 138, 168, 210, 248, 268,
    // 7:00 - 9:00 (8 slots) — peak
    286, 302, 320, 305, 280, 264, 224, 188,
    // 9:00 - 10:00 (4 slots)
    144, 96, 56, 32
  ];

  // ---------- Day P&L snapshot (today, in-progress) ----------
  const dayPnL = {
    depositsCollected: 1247.50,
    depositsForfeited: 18.00,   // Otieno no-show
    refundsIssued: 0,
    feesSoFar: 47.32,
    coversSoFar: 24,
    coversAtClose: 142
  };

  // ---------- 7-day forecast headline (week of May 15-21) ----------
  // The narrative: Sat May 16 is the soft signal. 91 booked vs 407 last week same-day.
  // Sun-Thu also pacing behind because the booking window is still open.
  const forecast = [
    { dow: "FRI", date: "May 15", booked: 176, paid: 56, pace: 0,    cap: 290, target: 280, prevWk: 292, lastYr: 230, alert: false, label: "Today" },
    { dow: "SAT", date: "May 16", booked: 91,  paid: 28, pace: -78,  cap: 290, target: 410, prevWk: 407, lastYr: 416, alert: true, label: "Soft" },
    { dow: "SUN", date: "May 17", booked: 96,  paid: 32, pace: -73,  cap: 290, target: 360, prevWk: 364, lastYr: 358, alert: true, label: "Soft" },
    { dow: "MON", date: "May 18", booked: 55,  paid: 14, pace: -68,  cap: 200, target: 170, prevWk: 170, lastYr: 171, alert: false },
    { dow: "TUE", date: "May 19", booked: 9,   paid: 2,  pace: -94,  cap: 200, target: 140, prevWk: 140, lastYr: 162, alert: true, label: "Open" },
    { dow: "WED", date: "May 20", booked: 6,   paid: 2,  pace: -96,  cap: 200, target: 145, prevWk: 145, lastYr: 111, alert: true, label: "Open" },
    { dow: "THU", date: "May 21", booked: 11,  paid: 3,  pace: -93,  cap: 250, target: 164, prevWk: 164, lastYr: 178, alert: true, label: "Open" }
  ];

  // ---------- Money: Overview KPIs ----------
  const moneyOverview = {
    gross: { value: 41889.40, delta: 4.2, prev: 40194.10, spark: [3800, 4100, 4400, 4800, 5200, 5400, 5100, 4900, 5300, 5600, 4900, 4200, 3800] },
    net:   { value: 40154.10, delta: 3.9, prev: 38647.30, spark: [3700, 4000, 4200, 4600, 5000, 5200, 4900, 4700, 5100, 5400, 4700, 4000, 3600] },
    refunds: { value: 1735.30, delta: 12.6, dir: "up-bad", spark: [120, 165, 180, 240, 165, 168, 275, 896, 357, 38, 120, 240, 1240], note: "Driven by 4 large-party cancellations May 13." },
    fees: { value: 1742.18, delta: 4.5, spark: [140, 150, 155, 160, 168, 172, 168, 175, 180, 178, 172, 168, 162] },
    forfeited: { value: 486.50, delta: -8.3, dir: "down-good", spark: [42, 36, 38, 41, 44, 38, 32, 28, 36, 44, 38, 32, 28] }
  };

  // ---------- "What Changed" auto narrative cards ----------
  const whatChanged = [
    { eyebrow: "Refunds", headline: "Refunds up $1,240 WoW",
      body: "Four large-party cancellations on Friday May 13 (Hess, Park 8-top, Aubrey wedding-rehearsal, Cohen). Three of four forfeited a $95 deposit.",
      delta: "+247%", dir: "down" },
    { eyebrow: "Saturday cover pacing", headline: "Sat May 16 tracking 22% of plan",
      body: "91 covers on the book vs. typical 407 by Friday lunch. No promo running, weather forecast clear.",
      delta: "−78%", dir: "down" },
    { eyebrow: "Avg deposit", headline: "Average deposit up $3.20",
      body: "Move to $25 per cover on dinner reservations took effect May 1. Roll-forward shows higher deposit per booking with no observable conversion impact.",
      delta: "+14.6%", dir: "up" }
  ];

  // ---------- Refund taxonomy ----------
  const refundTaxonomy = [
    { color: "#A34A3F", label: "Guest cancellation — with fee retained", count: 14, amount: 1330.00, sub: "Cancellation fee revenue" },
    { color: "#C29244", label: "Guest cancellation — fee waived", count: 8, amount: 760.00, sub: "Contra-revenue, manager approved" },
    { color: "#6B8E5A", label: "No-show — deposit forfeited", count: 11, amount: 486.50, sub: "Recognized as forfeited deposit revenue", isRevenue: true },
    { color: "#5D7A8A", label: "Restaurant-initiated (closure, error, comp)", count: 6, amount: 412.00, sub: "Contra-revenue" },
    { color: "#A34A3F", label: "Dispute lost", count: 1, amount: 95.00, sub: "Plus $15 chargeback fee" },
    { color: "#8A928C", label: "Misc adjustments", count: 3, amount: 138.30, sub: "Manual journal entries" },
  ];

  // ---------- Payouts ----------
  const payouts = [
    { id: "po_1TX9", date: "May 15", amount: 108.50, gross: 179.86, fees: 71.36, charges: 9, refunds: 0, status: "paid", bank: "Wells Fargo ··4477" },
    { id: "po_1TW4", date: "May 14", amount: 412.30, gross: 564.50, fees: 152.20, charges: 23, refunds: 0, status: "paid", bank: "Wells Fargo ··4477" },
    { id: "po_1TV2", date: "May 13", amount: -842.50, gross: 0, fees: 22.50, charges: 0, refunds: 4, status: "paid", bank: "Wells Fargo ··4477", note: "4 large-party refunds; payout reversed against incoming charges" },
    { id: "po_1TU8", date: "May 12", amount: 234.10, gross: 326.40, fees: 92.30, charges: 14, refunds: 0, status: "paid", bank: "Wells Fargo ··4477" },
    { id: "po_1TT5", date: "May 11", amount: 1218.40, gross: 1456.20, fees: 237.80, charges: 47, refunds: 0, status: "paid", bank: "Wells Fargo ··4477" },
    { id: "po_1TS3", date: "May 10", amount: 1986.20, gross: 2294.50, fees: 308.30, charges: 68, refunds: 0, status: "paid", bank: "Wells Fargo ··4477" },
    { id: "po_1TR1", date: "May 09", amount: 1742.40, gross: 2014.80, fees: 272.40, charges: 59, refunds: 0, status: "paid", bank: "Wells Fargo ··4477" },
  ];

  // Payout drill — May 15 ($108.50) — 9 charges all from May 13 dinner
  const payoutDetail = {
    payout: payouts[0],
    transactions: [
      { id: "py_1TWm3", amount: 57.13, fee: 22.13, net: 35.00, date: "May 13", reservation: "Sato birthday — 8-top", table: 20 },
      { id: "py_1TWlP", amount: 17.39, fee: 6.89, net: 10.50, date: "May 13", reservation: "Whitman — 4-top", table: 17 },
      { id: "py_1TWl0", amount: 6.46, fee: 2.96, net: 3.50, date: "May 13", reservation: "Beauchamp — 2-top", table: 23 },
      { id: "py_1TWjQ", amount: 11.93, fee: 4.93, net: 7.00, date: "May 13", reservation: "Pugh family — 4-top", table: 12 },
      { id: "py_1TWi8", amount: 22.85, fee: 8.85, net: 14.00, date: "May 13", reservation: "Mercer team — 5-top", table: 24 },
      { id: "py_1TWgD", amount: 17.39, fee: 6.89, net: 10.50, date: "May 13", reservation: "Kalra — 4-top (refunded)", table: 32 },
      { id: "py_1TWfC", amount: 11.93, fee: 4.93, net: 7.00, date: "May 13", reservation: "Chen — 2-top", table: 15 },
      { id: "py_1TWdx", amount: 17.39, fee: 6.89, net: 10.50, date: "May 13", reservation: "Holland T. — 2-top", table: 11 },
      { id: "py_1TWTW", amount: 17.39, fee: 6.89, net: 10.50, date: "May 13", reservation: "Marquez — 2-top", table: 13 }
    ]
  };

  // ---------- Earnings by month for compare chart ----------
  // Series: this year vs last year vs forecast. 13 months ending Jun 26.
  const earningsByMonth = [
    { m: "Jun 25", thisYr: 38420, lastYr: 36120, forecast: 37800, refunds: 1820 },
    { m: "Jul",    thisYr: 40180, lastYr: 38240, forecast: 39600, refunds: 1640 },
    { m: "Aug",    thisYr: 36240, lastYr: 35400, forecast: 36800, refunds: 1980 },
    { m: "Sep",    thisYr: 39820, lastYr: 36900, forecast: 38900, refunds: 2140 },
    { m: "Oct",    thisYr: 43680, lastYr: 41080, forecast: 41600, refunds: 1820 },
    { m: "Nov",    thisYr: 45920, lastYr: 43100, forecast: 44200, refunds: 2080 },
    { m: "Dec",    thisYr: 52400, lastYr: 48800, forecast: 50400, refunds: 2680 },
    { m: "Jan 26", thisYr: 36240, lastYr: 32480, forecast: 35200, refunds: 2347 },
    { m: "Feb",    thisYr: 38420, lastYr: 36980, forecast: 38000, refunds: 1850 },
    { m: "Mar",    thisYr: 44600, lastYr: 41200, forecast: 42400, refunds: 2120 },
    { m: "Apr",    thisYr: 39820, lastYr: 38240, forecast: 40000, refunds: 1980 },
    { m: "May",    thisYr: 24450, lastYr: 30800, forecast: 32400, refunds: 1735, isPartial: true },
    { m: "Jun 26", thisYr: 0,     lastYr: 36120, forecast: 38400, refunds: 0, isFuture: true }
  ];

  // ---------- Cover Flow (Reservations → Cover Flow) — dinner service tonight ----------
  // 16 tables × 17 slots (5pm → 9pm in 15 min increments)
  // Each cell = { booked, cap, demand (0-3 = none/low/med/high/peak), missed (web searches that didn't convert) }
  function buildCoverFlow() {
    const slots = ["5:00", "5:15", "5:30", "5:45", "6:00", "6:15", "6:30", "6:45", "7:00", "7:15", "7:30", "7:45", "8:00", "8:15", "8:30", "8:45", "9:00"];
    const tables = [11, 12, 13, 14, 15, 17, 20, 21, 23, 24, 25, 27, 40, 42, 60, 63];
    // demand intensity profile per slot — heavy spike at 7-8pm
    const demand =     [1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 3, 3, 2, 2, 1, 1, 1];
    const bookedPct =  [0.2, 0.3, 0.55, 0.6, 0.85, 0.7, 0.7, 1.0, 1.0, 1.0, 0.65, 0.55, 0.45, 0.3, 0.2, 0.15, 0.1];
    const missed =     [0, 0, 0, 0, 2, 1, 1, 4, 6, 5, 3, 1, 0, 0, 0, 0, 0];
    const cells = tables.map((t, ti) => slots.map((s, si) => {
      const booked = Math.random() < bookedPct[si] ? Math.round(2 + Math.random() * 4) : 0;
      const cap = booked > 0 ? booked + Math.round(Math.random() * 2) : (Math.random() < 0.85 ? 4 : 0);
      return {
        slot: s,
        table: t,
        booked: booked,
        cap: cap,
        demand: demand[si],
        missed: si === 7 && t === 17 ? 3 : (Math.random() < 0.05 ? 1 : 0)
      };
    }));
    return { slots, tables, cells, demand, missed };
  }

  // Stable seed (deterministic ish)
  let seed = 5;
  function rand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  Math.random = rand;
  const coverFlow = buildCoverFlow();

  // ---------- Highlights rail ----------
  const highlights = {
    GM: {
      needsYou: [
        { tag: "TONIGHT", title: "Lai-Sutton 12-top hasn't confirmed for 8pm", body: "Booked 9 days ago, $240 deposit. Last contact: Monday. No table assignment.", cta: "Confirm or release →", urgent: true, target: { surface: "reservations" } },
        { tag: "12:30 PM", title: "Walk-in just refused at bar — wait quoted 25 min", body: "Bar has 4 seats opening 12:35. Reach Mei before they leave.", cta: "View floor →", urgent: true, target: { surface: "today" } },
        { tag: "TOMORROW", title: "Sat May 16 prep — 91 of typical 407 covers booked", body: "Soft Saturday flagged. Send to ownership before service.", cta: "Open brief →", target: { surface: "forecast" } }
      ],
      whatChanged: [
        { tag: "−78%", title: "Saturday covers tracking far below plan", body: "Same DOW last 4 weeks averaged 398 by Friday lunch. No promo or closure on file.", cta: "Investigate →", danger: true, target: { surface: "forecast" } },
        { tag: "+22 min", title: "Table 43 turn time spiked Tuesday", body: "147.9 min vs. 91 min trailing avg. Server: Tyler. Cross-check ticket flow.", cta: "View turn report →", warn: true, target: { surface: "activity" } },
        { tag: "Tue rain", title: "Tuesday's dip explained — 1.4\" rain through service", body: "Covers down 38%. Annotated. Comparison views now exclude or label.", cta: "View annotation →", target: { surface: "money" } }
      ],
      coming: [
        { tag: "8:30 PM", title: "Mother's Day NYE booking from Brienna Brown — 9-top", body: "Returning VIP, 12 prior visits. Allergy on file: peanuts.", cta: "Open guest →", target: { receipt: "r-024" } }
      ],
      wins: [
        { tag: "STREAK", title: "10th sold-out Friday lunch in a row", body: "Streak began Mar 6.", win: true, target: { surface: "today" } }
      ]
    },
    CFO: {
      needsYou: [
        { tag: "DUE MAY 18", title: "Dispute deadline — Olivia Renn $185", body: "Chargeback reason: 'product not received'. Evidence required by Mon May 18.", cta: "Open dispute →", urgent: true, target: { surface: "money" } },
        { tag: "UNMATCHED", title: "Payout May 13 (−$842.50) has 4 unmatched refunds", body: "Auto-match found likely reservations. Confirm to clear.", cta: "Open reconciliation →", urgent: true, target: { surface: "recon" } },
        { tag: "PERIOD", title: "April close 97% complete — 5 exceptions remaining", body: "All are ambiguous refund categorizations. ETA 10 min to close.", cta: "Resume close →", target: { surface: "recon" } }
      ],
      whatChanged: [
        { tag: "+$1,240", title: "Refund spike May 13", body: "4 large-party cancellations. 3 of 4 forfeited a $95 deposit ($285 retained).", cta: "View receipt drilldowns →", danger: true, target: { surface: "money" } },
        { tag: "Stripe fee", title: "Fee burden ticked up 0.4% this month", body: "Within Stripe normal; flagging for ownership.", cta: "Open fees →", target: { surface: "money" } },
        { tag: "−$3,820", title: "Deposit float lower than May 24 baseline", body: "Sat–Sun bookings off plan. Cash-on-books for next 30 days down $7,400.", cta: "Open cash forecast →", warn: true, target: { surface: "forecast" } }
      ],
      coming: [],
      wins: [
        { tag: "CLOSED", title: "March 2026 books closed, signed by Becca M.", body: "Exported to QuickBooks May 1. Zero exceptions.", win: true, target: { surface: "recon" } }
      ]
    },
    Owner: {
      needsYou: [
        { tag: "PORTFOLIO", title: "2 of 4 locations tracking below plan this week", body: "Norma's (−18%) and Mister Parker's (−6%). Reach Maeve and Tyler.", cta: "Open portfolio →", urgent: true, target: { surface: "today" } },
        { tag: "DECISION", title: "Q3 capex memo ready for sign-off", body: "Sutton renovation $84k, Norma's bar refresh $28k. Both inside payback window.", cta: "Open memo →", target: { surface: "reports" } }
      ],
      whatChanged: [
        { tag: "+8%", title: "Mister Parker's lunch covers up 8% MoM", body: "Two-month trend. New menu launched April 3.", cta: "Compare →", win: true, target: { surface: "money" } },
        { tag: "−18%", title: "Norma's Saturday demand soft for 3rd week", body: "Cancellation rate flat; new bookings down. Investigate channel mix.", cta: "Open Norma's →", warn: true, target: { surface: "forecast" } }
      ],
      coming: [
        { tag: "MAY 19", title: "Quarterly review with Sutton ownership", body: "Pack auto-rendered — needs your two-line note.", target: { surface: "reports" } }
      ],
      wins: [
        { tag: "BRAND", title: "Sutton featured in Eater 'best new bars' list", body: "Bookings ticked up 14% in the 48 hours after.", win: true, target: { surface: "activity" } }
      ]
    },
    "Read-only": {
      needsYou: [],
      whatChanged: [
        { tag: "WEEK", title: "Week of May 8 net: $9,114 (−4% WoW)", body: "Saturday soft. Refunds elevated. Forecast for May 15-21 also tracking soft.", target: { surface: "reports" } }
      ],
      coming: [],
      wins: []
    }
  };

  // ---------- The Receipt — Brienna Brown 9-top tonight ----------
  const receiptFor = {
    "r-024": {
      id: "r-024",
      title: "Brown, Brienna",
      eyebrow: "Reservation · paid",
      receiptId: "RES-026B-4427",
      time: "8:45 PM · Fri May 15",
      table: "Table 63 · main · window 4-top + chairs",
      party: 9,
      source: "Direct — concierge desk",
      bookedBy: "Tyler",
      leadTime: "11 days",
      guest: {
        name: "Brienna Brown",
        phone: "+1 925 785 3527",
        email: "brienna.b@—",
        visits: 13,
        ltv: 4280,
        memberSince: "Sep 2023",
        tags: ["VIP", "regular"],
        notes: "Husband's birthday on May 15. Allergy: tree nuts. Prefers window seat near bar.",
        risk: null
      },
      payment: {
        items: [
          { type: "charge", label: "Deposit · $10 × 9 covers", sub: "Visa ··4242 · Stripe py_1TWm3", amount: 90.00, date: "May 04 · 9:42 PM", state: "succeeded" },
          { type: "fee", label: "Stripe fee", sub: "2.9% + $0.30", amount: -2.91, date: "May 04 · 9:42 PM" },
          { type: "total", label: "Net to bank", sub: "Payout po_1TS3 · May 10", amount: 87.09 }
        ]
      },
      comms: [
        { time: "May 04 · 9:42 PM", text: "Confirmation email sent (Tyler)" },
        { time: "May 10 · 8:00 AM", text: "Reminder sent (auto)" },
        { time: "May 14 · 4:14 PM", text: "Guest replied: 'See you tomorrow!'" }
      ],
      outcome: "Pending arrival",
      audit: [
        { time: "May 04 · 9:42 PM", text: "Booking created by ", actor: "Tyler", post: " · 9-top, table 63" },
        { time: "May 04 · 9:42 PM", text: "Charged deposit ", actor: "$90.00", post: " · Visa ··4242 · succeeded" },
        { time: "May 06 · 11:08 AM", text: "Note added by ", actor: "Maeve", post: ": 'husband's birthday — surprise cake'" },
        { time: "May 10 · 12:36 AM", text: "Settled in payout ", actor: "po_1TS3", post: " · $87.09 net" },
        { time: "May 12 · 9:14 AM", text: "Table assignment confirmed by ", actor: "Brienna", post: " — moved from 60 → 63 at guest request" }
      ]
    }
  };

  // Fallback receipt builder for the rest
  function getReceipt(id) {
    if (receiptFor[id]) return receiptFor[id];
    const res = tapeReservations.find(r => r.id === id);
    if (!res) return null;
    return {
      id: res.id,
      title: res.name,
      eyebrow: "Reservation · " + (res.deposit || "n/a"),
      receiptId: "RES-026B-" + res.id.toUpperCase().replace("R-", ""),
      time: minToTime(res.startMin) + " · Fri May 15",
      table: "Table " + res.table + " · main",
      party: res.party,
      source: res.source === "concierge" ? "Concierge desk" : "Direct booking",
      bookedBy: ["Tyler", "Maeve", "Robin", "Cole"][res.table % 4],
      leadTime: Math.floor(Math.random() * 18) + 2 + " days",
      guest: {
        name: res.name,
        phone: "+1 — ··" + (1000 + Math.floor(Math.random() * 8999)),
        email: res.name.toLowerCase().replace(/[^a-z]/g, "") + "@—",
        visits: Math.floor(Math.random() * 12) + 1,
        ltv: Math.round((res.revenue || 14) * 12 + Math.random() * 400),
        memberSince: "2024",
        tags: res.vip ? ["VIP"] : (Math.random() < 0.3 ? ["regular"] : []),
        notes: res.allergy ? "Allergy on file. Cross-check ticket." : "",
        risk: res.status === "no-show" ? "no-show" : null
      },
      payment: {
        items: res.deposit === "paid" ? [
          { type: "charge", label: "Deposit · $" + (res.revenue / res.party).toFixed(0) + " × " + res.party + " covers", sub: "Visa · Stripe", amount: res.revenue, date: "May", state: "succeeded" },
          { type: "fee", label: "Stripe fee", sub: "2.9% + $0.30", amount: -(res.revenue * 0.029 + 0.30), date: "May" },
          { type: "total", label: "Net to bank", sub: "Payout", amount: res.revenue - (res.revenue * 0.029 + 0.30) }
        ] : res.deposit === "forfeited" ? [
          { type: "charge", label: "Cancellation fee", sub: "Forfeited no-show deposit", amount: res.revenue || 18, date: "May", state: "succeeded" }
        ] : res.deposit === "refunded" ? [
          { type: "charge", label: "Deposit", sub: "Visa", amount: 28, date: "May", state: "succeeded" },
          { type: "refund", label: "Refund issued", sub: "Manager-approved", amount: -28, date: "May", state: "refunded" }
        ] : [],
      },
      comms: [{ time: "—", text: "Confirmation sent" }],
      outcome: res.status === "seated" ? "Seated" : res.status === "departed" ? "Completed" : res.status === "no-show" ? "No-show" : "Pending",
      audit: [
        { time: "May", text: "Booking created", actor: "system", post: "" },
        { time: "May", text: "Deposit collected", actor: res.deposit === "paid" ? "$" + res.revenue : "$0", post: "" }
      ]
    };
  }

  function minToTime(min) {
    const totalMin = 11 * 60 + min;
    const h24 = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    const h = h24 > 12 ? h24 - 12 : h24;
    const ap = h24 >= 12 ? "PM" : "AM";
    return h + ":" + String(m).padStart(2, "0") + " " + ap;
  }

  // ---------- Reconciliation ----------
  const reconciliation = {
    period: "May 8 – May 14, 2026",
    total: 384,
    matched: 379,
    remaining: 5,
    progress: 0.987,
    exceptions: [
      { tag: "ORPHAN", danger: false, title: "Stripe charge py_1TVz0 has no reservation match", sub: "$28.00 · descriptor 'RESERVATION' · May 12", suggest: "Likely Henley 4-top (table 25, 6pm). Same amount, same minute." },
      { tag: "REFUND", danger: false, title: "Refund $95 with no category", sub: "py_re_1TUR · May 13 4:18 PM · issued by Tyler", suggest: "Looks like cancellation-with-fee-waived. Confirm to categorize." },
      { tag: "PAYOUT", danger: true, title: "Payout po_1TV2 (−$842.50) net negative", sub: "May 13 · 4 refunds, 0 charges", suggest: "Expected. Refunds reversed against next day's charges. Apply standard adjustment." },
      { tag: "ADJUST", danger: false, title: "Manual adjustment $45 needs memo", sub: "May 11 · Maeve · 'gift card credit'", suggest: "Mark as gift-card-redeemed; books journal entry to liability." },
      { tag: "AMBIG", danger: false, title: "Ambiguous descriptor 'RESERVATION'", sub: "py_1TT3W · $14.00 · May 09", suggest: "Match to Chen 2-top, May 09 7:00 PM. Manual confirm." }
    ],
    closedPeriods: [
      { period: "Apr 24 – Apr 30, 2026", closedBy: "Becca M.", date: "May 1", exceptions: 0 },
      { period: "Apr 17 – Apr 23, 2026", closedBy: "Becca M.", date: "Apr 24", exceptions: 2 },
      { period: "Apr 10 – Apr 16, 2026", closedBy: "Becca M.", date: "Apr 17", exceptions: 0 }
    ]
  };

  // ---------- Guests ----------
  const guests = [
    { initials: "BB", name: "Brienna Brown", tags: ["VIP", "regular"], visits: 13, ltv: 4280, last: "Apr 18", note: "Tree-nut allergy" },
    { initials: "KM", name: "Kathleen Moore", tags: ["VIP"], visits: 22, ltv: 6840, last: "May 02", note: "" },
    { initials: "EM", name: "Elena Moiseeva", tags: ["VIP", "regular"], visits: 17, ltv: 5120, last: "Apr 30", note: "Always 5-top" },
    { initials: "JS", name: "Jeffrey Cole", tags: ["regular"], visits: 8, ltv: 1840, last: "Apr 24", note: "" },
    { initials: "BO", name: "Brandon O'Quinn", tags: [], visits: 3, ltv: 480, last: "Apr 04", note: "" },
    { initials: "DA", name: "Darius Anderson", tags: ["regular"], visits: 6, ltv: 1380, last: "May 04", note: "" },
    { initials: "RD", name: "Rob Di Figlia", tags: [], visits: 1, ltv: 110, last: "Apr 28", note: "First visit" },
    { initials: "KZ", name: "Kylie Zoller", tags: ["VIP"], visits: 9, ltv: 2680, last: "Mar 22", note: "Concierge" },
    { initials: "EM", name: "Esmeralda Perez", tags: [], visits: 2, ltv: 220, last: "Apr 11", note: "" },
    { initials: "OR", name: "Olivia Renn", tags: [], visits: 1, ltv: 0, last: "Apr 02", note: "Dispute open", risk: true }
  ];

  // ---------- Reports library ----------
  const reports = [
    { eyebrow: "Built-in", title: "Weekly Operator Brief", sub: "One-page narrative for ownership. Auto-renders Sunday morning.", foot: "Last sent · May 11" },
    { eyebrow: "Built-in", title: "Month-end Financial Pack", sub: "Audit-grade close pack: P&L, refunds, fees, payouts, journal entries.", foot: "Audit-grade · PDF · CSV" },
    { eyebrow: "Built-in", title: "Quarterly Owner Review", sub: "Cross-location performance, capital decisions, brand signal.", foot: "Q1 2026 · ready" },
    { eyebrow: "Saved", title: "Turn Time by Table — Past 30 days", sub: "Saved by Maeve · table-level turn times, with rolling baseline.", foot: "Edited Apr 28" },
    { eyebrow: "Saved", title: "Refunds Tyler issued — past 90 days", sub: "Server-attributed refund log for performance review.", foot: "Edited May 13" },
    { eyebrow: "Saved", title: "Demand pressure by hour — Sat dinner", sub: "Web searches that hit slots but didn't book. Heatmap.", foot: "Edited May 6" }
  ];

  // ---------- Activity / audit log ----------
  const activity = [
    { time: "12:14 PM", icon: "user-x", text: "Walk-in turned away — bar wait 25 min", actor: "Mei", obj: "" },
    { time: "12:11 PM", icon: "check", text: "Holland 2-top seated · table 11", actor: "Robin", obj: "" },
    { time: "12:08 PM", icon: "alert", text: "Otieno marked ", actor: "no-show", obj: "deposit $18 forfeited" },
    { time: "11:54 AM", icon: "card", text: "Deposit charged for Sato birthday 8-top — ", actor: "$57.13", obj: "" },
    { time: "11:47 AM", icon: "edit", text: "Lai-Sutton 12-top table reassigned ", actor: "60 → 60+62", obj: "Mei" },
    { time: "11:33 AM", icon: "user-plus", text: "New booking — Albright 4-top 1:50 PM · Tyler", actor: "", obj: "" },
    { time: "11:14 AM", icon: "comment", text: "Annotation added to May 12: ", actor: "1.4\" rain through service", obj: "Maeve" },
    { time: "10:58 AM", icon: "refresh", text: "Payout po_1TX9 settled to Wells Fargo — $108.50", actor: "", obj: "" },
    { time: "10:42 AM", icon: "settings", text: "Deposit policy updated: dinner $25/cover · effective May 15", actor: "Becca M.", obj: "" }
  ];

  const anomalies = [
    {
      tier: "danger",
      title: "Saturday cover pacing 78% below trailing average",
      meta: "Detected 11:30 AM today",
      body: "Sat May 16 has 91 covers on the book by Friday lunch. The trailing 4 Saturdays averaged 398 by the same time. No promo paused, no closure on file, weather forecast clear.",
      drivers: [
        { k: "New bookings (last 7 days)", v: "−62%" },
        { k: "Cancellation rate", v: "Flat (4.1%)" },
        { k: "Channel: concierge", v: "−84%" },
        { k: "Channel: direct", v: "−54%" }
      ]
    },
    {
      tier: "warn",
      title: "Tuesday turn time spike on table 43",
      meta: "Detected May 13",
      body: "147.9 min vs. 91 min trailing avg. Server Tyler. Cross-correlated with kitchen ticket-pickup time on that station (+18%).",
      drivers: [
        { k: "Server", v: "Tyler" },
        { k: "Kitchen pickup delay", v: "+18%" },
        { k: "Comparable tables (44, 45)", v: "Normal" }
      ]
    },
    {
      tier: "warn",
      title: "Refund spike May 13 — 4 large parties",
      meta: "Detected May 13 6:30 PM",
      body: "$1,240 in refunds in 6 hours — 4 large-party cancellations. Three of four forfeited a $95 deposit. Looks like a single-source coordinated cancellation (corporate event pulled).",
      drivers: [
        { k: "Bookings affected", v: "4" },
        { k: "Deposit retained", v: "$285" },
        { k: "Net refunded", v: "$955" }
      ]
    }
  ];

  // ---------- Annotations on charts ----------
  const annotations = [
    { date: "May 12", label: "1.4\" rain through service", author: "Maeve", body: "Storm Tuesday — covers down 38%, turn times spike 32%. Tagged 'weather' for exclusion in 4-week trailing averages." },
    { date: "May 13", label: "Corporate-event cancellation (4 parties)", author: "Becca M.", body: "Cohen Industries pulled their May 13 dinner with 6 hours notice. 4 parties, 32 covers, $1,240 in refunds. $285 retained." },
    { date: "Mar 09", label: "Mother's Day prep — booking surge", author: "system", body: "Auto-detected: 2.4× normal booking velocity in the 7 days prior." }
  ];

  return {
    NOW,
    todayShift,
    tapeReservations,
    tapeRevenue,
    dayPnL,
    forecast,
    moneyOverview,
    whatChanged,
    refundTaxonomy,
    payouts,
    payoutDetail,
    earningsByMonth,
    coverFlow,
    highlights,
    receiptFor,
    getReceipt,
    minToTime,
    reconciliation,
    guests,
    reports,
    activity,
    anomalies,
    annotations
  };
})();
