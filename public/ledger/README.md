# Handoff: Peak Ledger — Financial & Operations Surface

## Overview

**Peak Ledger** is the financial-and-operations surface for Peak — the host-stand-grade reservation platform for high-end restaurants. It is the layer of Peak that a **GM, CFO, or Owner** uses to see, in one place: today's service, money in/out, guest behavior, forecast, books reconciliation, and an audit log. It is dark-mode-first, dense-when-it-needs-to-be, and editorial-where-it-counts — built on the Peak design system (forest-green ink + brass + Inter + an editorial display face).

The product has two operating modes that the user toggles in the topbar:

- **Insights** (narrative) — quieter, story-led layout. Headlines like "Lunch is on pace. Saturday's pacing is light." with supporting evidence below. Default.
- **Report** (dashboard) — denser, everything-at-once layout. KPI row + charts + tables, optimized for scanning.

Both views are real screens — not a toggle on a single screen — and both ship.

## About the Design Files

The files in this bundle are **design references created in HTML / React-via-Babel**. They are prototypes showing intended look, structure, and behavior — **not production code to ship as-is**. The task is to **recreate these designs in the target codebase's existing environment** (whatever your Peak app uses — Next.js/React, Remix, SwiftUI, etc.), using the codebase's established patterns, component library, routing, data-fetching, and state management.

If no environment exists yet, choose the framework that best fits the rest of Peak's stack (the rest of Peak is web; **Next.js + React + Tailwind/CSS-modules** is a reasonable default) and implement there.

Treat `lib/peak.css` as the **visual spec** for components — pull exact values from it, but re-implement the components in your styling system. Treat `lib/data.js` as **fixture data** that documents the data model your real API needs to serve — don't ship the literal `window.PEAK` global.

## Fidelity

**High-fidelity.** Pixel-perfect mockups with final colors, typography, spacing, density, and key interactions worked out. Exact hex values, exact font weights, exact pixel measurements live in `lib/colors_and_type.css` and `lib/peak.css`. Recreate accordingly.

A few caveats:
- Charts (the Tape ribbon, day-pacing chart, earnings stacked bars, forecast pacing curve) are hand-rolled inline SVG. In production, swap to your charting library (Recharts, Visx, D3) — but match the **visual treatment**: brass primary ribbon, slate dashed prior-period, no gradients, no glow.
- Icons are 1.5px-stroke hand-rolled SVG (see `Icon` component in `lib/shell.jsx`). The Peak design system spec'd Lucide as the default icon set — use **Lucide** in production unless Peak has a proprietary set.
- Animations are kept restrained (140–280ms fade-and-slide, `cubic-bezier(0.2, 0.6, 0.2, 1)`). No bounce, no scale.

## How to read the source

```
design_handoff_peak_ledger/
├── README.md                       ← you are here
├── Peak Ledger.html                ← entry point (current design)
├── Peak Ledger v1 (dense).html     ← earlier, denser variant kept for reference
├── assets/
│   ├── peak-mark-gold.svg          ← Peak brass mark — used in sidebar
│   └── peak-lockup-reverse.svg     ← full lockup for dark surfaces
└── lib/
    ├── colors_and_type.css         ← design tokens (THE source of truth for colors/type)
    ├── _shared.css                 ← cross-product base styles from Peak DS
    ├── peak.css                    ← all Peak Ledger component styles
    ├── data.js                     ← fixture data — every surface reads window.PEAK
    ├── tweaks-panel.jsx            ← in-design controls (persona, compare mode, etc.)
    ├── shell.jsx                   ← Sidebar, Topbar, HighlightsRail, Icon
    ├── widgets.jsx                 ← KPI, sparkline, Why-popover, primitives
    ├── narrative.jsx               ← narrative-mode shared layout pieces
    ├── notifications.jsx           ← ActivityTray, ToastStack, useNotifications
    ├── datatable.jsx               ← shared table component
    ├── today.jsx                   ← Today surface (narrative + dashboard)
    ├── reservations.jsx            ← Timeline + Cover Flow views
    ├── money.jsx                   ← Money: Overview/Earnings/Refunds/Fees/Payouts/Disputes/Forfeited
    ├── surfaces.jsx                ← Guests, Forecast, Reports, Reconciliation, Activity, Settings
    └── app.jsx                     ← App root, routing, modals, ⌘K
```

To run locally and click around: `python3 -m http.server` in the handoff folder, then open `http://localhost:8000/Peak%20Ledger.html`. Toggle the **Tweaks** panel (bottom-right) to switch personas, compare modes, and density.

---

## Architecture

### App shell

CSS grid, fixed: `232px sidebar | 1fr content`, `56px topbar | 1fr main`. Sidebar collapses to `56px` (icon-only with delayed hover-expand — 700ms enter, 120ms leave). State persisted in tweaks.

```
┌─────────┬─────────────────────────────────────────────────┐
│         │                  Topbar (56px)                  │
│ Sidebar ├─────────────────────────────────────────────────┤
│ (232px) │                                                 │
│         │                 Surface content                 │
│         │                                                 │
└─────────┴─────────────────────────────────────────────────┘
```

The **Highlights Rail** (a 280px-ish right column with "Needs you / What changed / What's coming / Wins" cards) was prototyped (`HighlightsRail` in shell.jsx) but is **not currently mounted** — content was absorbed into Today's narrative view + the Activity Tray. Decide in production whether to bring it back as a third column or keep the current 2-column layout.

### Persona routing

`persona` is one of `GM | CFO | Owner | Read-only`. It defaults the landing surface and modulates which counts/badges appear:

| Persona      | Default surface | Sidebar badges shown            |
|--------------|-----------------|---------------------------------|
| GM           | Today           | Reservations count, Activity     |
| CFO          | Money           | Money "3", Reconciliation "5 warn" |
| Owner        | Today           | Standard                         |
| Read-only    | Reports         | Standard                         |

Real implementation: derive from the authenticated user's role, not a tweak.

### View modes

`viewMode` is `narrative | dashboard`, toggled in the topbar. Each surface that supports both branches at the top:

```js
function MoneySurface({ viewMode, ...props }) {
  return viewMode === "dashboard"
    ? <MoneyDashboard {...props}/>
    : <MoneyNarrative {...props}/>;
}
```

Persist per-user.

### Compare modes

`compareMode` is `off | WoW | YoY | Forecast`. Affects KPI deltas, chart overlays (the dashed prior-period ribbon on the Tape, the slate bars next to brass in earnings).

---

## Screens / Views

There are **9 top-level surfaces** plus 4 overlay surfaces.

### 1 · Today

**Purpose:** "What's happening right now and what do I need to do about it." The GM's home.

**Two layouts** (toggle via Insights/Report):

#### Today — Insights (narrative)
- **Headline block** (top, full-bleed): editorial-serif headline like *"Lunch is on pace. Saturday's pacing is light."* with two-sentence supporting body in muted text. Headline is set in `var(--font-display)`, 32–40px, weight 500, letter-spacing -0.02em.
- **Hero strip** (`.today-hero`): horizontal 5-cell grid — shift state (live dot + name + capacity), Seated, Walk-ins, Late, Turning/arriving. Background is `linear-gradient(135deg, var(--peak-ink-700), var(--peak-ink-800))` with a subtle brass radial in top-right. ~118px tall.
- **The Tape** (`.tape-card`): scrubbable timeline showing today's bookings as horizontal pills with a revenue ribbon (brass area chart) and cover-count ribbon (slate dashed) layered behind. Spans 11am → 10pm. NOW line is a dashed `var(--peak-success)` vertical with a glowing dot.
- **Two-up**: "Now & Next" (list of next 5 arrivals with VIP/allergy/large-party tags) and "Decisions you owe" (list of urgent items — overbooked window, comp request, 12-top deposit due).
- **Day P&L** (`.pnl-grid`): 4 cells — Covers, Net revenue, Refunds, Fees. Big display-serif numbers (22px, weight 500), small `font-mono` uppercase labels (9.5px, 0.16em letter-spacing).

#### Today — Report (dashboard)
- Same hero strip + Tape, but **5-column KPI row** above (`.kpi-row`): Covers, Revenue, Refunds, Forfeited, No-shows. Each `.kpi` is a 14×16 card with mono-uppercase label, 24px display-serif value, sparkline, and a delta row.
- More tables visible at once. No editorial headline.

**Receipt drawer entry points:** clicking any reservation pill on the Tape, any row in Now & Next, any line item in Day P&L drilldowns.

### 2 · Reservations

**Purpose:** Look at the floor. Manage the book.

**Two layouts** (tabs at top of surface, not the Insights/Report toggle):

#### Timeline
- Horizontal time axis 11am → 10pm, 28 cells (`.timeline-time-labels`).
- **Rows are tables**, grouped into sections (Bar, Window, Banquette, etc.) with `.timeline-section-label` dividers.
- Each reservation is a `.res-pill` positioned absolutely by `startMin` and sized by `durMin`. Color of left edge (`.deposit-edge`, 3px wide) encodes deposit state: paid=success, refunded=info, forfeited=brass, disputed=danger, comp=slate.
- VIP indicator: 12px brass square with "V" in `.pill-vip`.
- Selected pill gets `box-shadow: 0 0 0 1px var(--accent)`.
- Now-line: dashed success vertical, glowing dot at top.

#### Cover Flow
- Table view: rows = service windows (Lunch early/mid/late, Dinner early/mid/late, Late), columns = days. Each `.cf-cell` shows booked/cap as `12/16`, color-mapped by demand pressure (`demand-low/med/high/peak` = increasing brass alpha fill).
- Footer row totals.

### 3 · Money

**Purpose:** "Where is the money, who has it, when do I see it." The CFO surface.

Has **7 sub-tabs** (`.money-tabs`):

1. **Overview** — KPI row (Gross, Net, Refunds, Fees, Forfeited deposits, Pending payout), "What changed" card grid (3 cards calling out the biggest deltas), earnings stacked-bar chart (brass = revenue, danger-soft = refunds, slate dashed = prior period).
2. **Earnings** — full earnings chart with annotations (clickable pins, `.annotation-pin`), breakdowns by service, by source.
3. **Refunds** — refund taxonomy table (`.refund-tax-row`): reason category, count, total. Categories include weather, illness, double-booking, comp.
4. **Fees** — payment-processor fees broken out.
5. **Payouts** — list of `.payout-row` cards. Each row: date, ID, bank-last-4, gross/fees/net columns, status pill (paid=olive, transit=amber). Click to expand into `.payout-expand` showing the reservations that rolled up.
6. **Disputes** — chargebacks, with status and response window.
7. **Forfeited** — forfeited deposits (no-shows, late-cancels) with the linked reservations.

Sub-tab also exposed as deep-link `?tab=earnings` etc.

### 4 · Guests

**Purpose:** Who comes here. Who matters. Who's been a problem.

- **Sort tabs** at top: LTV, Frequency, Recent, At-risk.
- Table of `.guest-row`: avatar (32px circle, initials), name + tags (VIP, Allergy, Regular, Press, At-risk), email/phone meta, lifetime visits, lifetime spend, last visit. Row hover = brass tint background.
- Click row → guest detail (currently scoped to opening the Receipt for their latest reservation — production should open a full guest profile).

### 5 · Forecast

**Purpose:** Are we on track for next week.

#### Forecast — Insights
- Editorial headline + body.
- **Week grid** (`.fc-day` × 7): each day card shows day-of-week, date, expected covers (big brass display-serif), pacing chip (behind/ahead/flat with mono), and a thin progress bar with a target tick. Days flagged `.alert` (e.g. Saturday currently behind pace) get a brass-tinted border.
- **PacingChart**: x = days-out from service (28d → day-of), y = covers booked. Two curves — this week solid brass, last week dashed slate. Hover reveals the date.

#### Forecast — Report
- Same week grid + a wider chart panel, plus a "By source" breakdown table (direct / concierge / waitlist / phone).

### 6 · Reports

**Purpose:** Static, scheduled, exportable reports. Read-only persona's default landing.

- Two-column list of report cards: title, last-run timestamp (mono), recipients, format. Each card has Download / Run now / Schedule actions.

### 7 · Reconciliation (Recon)

**Purpose:** Match Peak's books to bank/POS. Find exceptions.

- **`.recon-progress`** strip at top: big display-serif `42 / 47` (matched/total), brass-to-success gradient progress bar.
- **Exceptions list**: `.exception-row` cards. Each has a tag (`MISMATCH`, `MISSING`, `DUPLICATE`, `DISPUTED`), a 2-line description, a suggested resolution with the suggested counterparty in brass, and 2–3 action buttons (`Accept`, `Mark for review`, `Open receipt`).
- Resolved exceptions slide out with a 220ms fade.

### 8 · Activity

**Purpose:** Audit log. Who did what, when, why.

- View tabs: Anomalies | Audit log | Logins.
- `.activity-row` × N: timestamp (mono), 28×28 icon tile, plain-language description (`<actor>` in brass, `<entity>` in brass), action menu.

### 9 · Settings

**Purpose:** Configure deposit policies, payouts, integrations, users.

- Narrative-style layout: stacked sections with eyebrow + headline + form. Read the file for the specifics.

---

### Overlay surfaces

#### The Receipt Drawer

The most important overlay. Slides in from the right, 520px wide, dark backdrop with 8px blur. Triggered from **every** clickable financial entity — reservations, payouts, exceptions, etc.

Sections, top to bottom:
- **Header**: eyebrow + display-serif title (26px, weight 500, -0.02em) + close button.
- **Reservation detail grid** (`.receipt-grid`): 2-col k/v pairs — guest, party, table, source, deposit amount, etc.
- **Payment thread** (`.receipt-payment`): chronological list of payment events (charge / refund / fee / payout) with dots (success/info/danger/slate), labels, amounts in mono. Last row is total in brass.
- **Audit list**: timestamp + plain-language line ("**Alex Park** waived the comp at 7:42pm" — actor name in brass).
- **Sticky action bar** at bottom: 2–3 primary buttons (Print, Email, Mark disputed, etc.).

Open by route too: `/r/r-024` should deep-link to the same drawer.

#### Command-K (`⌘K` / `Ctrl+K`)

- Backdrop blur + centered 640px panel, slides down 12px on open.
- Input row → fuzzy-match results grouped by Reservations / Guests / Reports / Settings.
- "Ask" mode (toggle button shows `ASK`): natural-language answer block (`.cmdk-ask-answer`) with brass-emphasized numbers. Hook to your LLM endpoint.

#### Activity Tray

- Slides in from the right (narrower than receipt drawer), notification list. Pinable — when pinned, it stays mounted and the bell hides.
- Notifications grouped by category, filterable by persona (CFO sees Money items first, etc.).

#### Toast Stack

- Bottom-right, max 3 stacked toasts. 2.4s default duration. Click toast → opens the tray.

---

## Interactions & Behavior

### Navigation
- Sidebar items switch `surface` state (a string key). No client-side routing in the prototype — use your router in production. Suggested routes:
  - `/today`, `/reservations`, `/money/:tab?`, `/guests`, `/forecast`, `/reports`, `/recon`, `/activity`, `/settings`
- Receipt drawer: `/.../r/:reservationId` overlays current route.

### Keyboard
- `⌘K` / `Ctrl+K` → opens Command-K.
- `Esc` → closes Command-K and Receipt Drawer.
- Arrow keys in Command-K results.

### Hover/active/focus states
- Cards: border `var(--border)` → `var(--border-strong)` on hover. No scale, no shadow bloom.
- Buttons (primary): brass-400 fill → brass-300 on hover, brass-600 + translateY(0.5px) on press.
- Buttons (secondary): border alpha 0.32 → 0.55 on hover, brass-tint wash at alpha 0.06.
- Links: brass baseline, brass-300 + underline on hover.
- Sidebar nav items: muted → fg on hover; active = brass tint background + brass text + inset brass border ring.

### Animations
All transitions use `cubic-bezier(0.2, 0.6, 0.2, 1)` (token `--ease-out`).

| Element                | Property                | Duration |
|------------------------|-------------------------|----------|
| Sidebar collapse       | grid-template-columns   | 220ms    |
| Receipt drawer slide   | transform translateX    | 280ms    |
| Receipt backdrop fade  | opacity                 | 220ms    |
| Command-K panel        | opacity + translateY    | 160ms / 200ms |
| Card border hover      | border-color            | 140ms    |
| Live shift dot         | opacity pulse           | 1.6s loop |
| Now-line glow          | static box-shadow        | —        |

### Form behavior
- Inputs: 8px radius, 1px brass-tinted border, focus = brass border (no glow).
- Currency inputs: right-aligned, mono font, tabular-nums.

### Empty states
- Editorial: serif headline + one line + a single action. No "spot illustrations."

### Loading
- Skeletons should match the brass-tinted hairline card style — 1px border, 12px radius, animated shimmer at very low contrast (rgba(201,166,113,0.04) → 0.08).

### Responsive
- Designed for **1440px+** (`<meta name="viewport" content="width=1440">`). Tablet and mobile are out of scope for this prototype. When implementing responsive:
  - Collapse sidebar to drawer below 1024px.
  - Receipt drawer becomes full-width below 768px.
  - Tape/timeline gets horizontal scroll.

---

## State Management

State lives in `App` (`lib/app.jsx`). Pull into your store (Redux, Zustand, server state via TanStack Query, etc.) appropriately.

```js
{
  // user/persona — derive from auth
  persona: "GM" | "CFO" | "Owner" | "Read-only",

  // view prefs — persist per-user
  viewMode: "narrative" | "dashboard",
  compareMode: "off" | "WoW" | "YoY" | "Forecast",
  density: "default" | "compact",
  sidebarCollapsed: boolean,
  trayPinned: boolean,

  // routing — replace with your router
  surface: string,         // "today" | "reservations" | ...
  receiptId: string | null,
  cmdkOpen: boolean,
  trayOpen: boolean,

  // notifications
  notes: Note[],
  toasts: Toast[],
}
```

### Data model (from `lib/data.js`)

The fixture documents the shape your backend should serve. Top-level keys on `window.PEAK`:

- `NOW` → `{ date, time, day }`
- `todayShift` → `{ state, seated, capacity, walkIns, walkInsTotal, late, turning, arriving }`
- `tapeReservations[]` → see Reservation shape below
- `decisions[]` — urgent items on Today
- `highlights[persona]` → `{ needsYou[], whatChanged[], coming[], wins[] }`
- `money` → `{ overview, earnings, refunds, fees, payouts[], disputes[], forfeited[] }`
- `guests[]` → guest profiles with lifetime stats
- `forecast` → `{ week[], pacing }`
- `reconciliation` → `{ total, matched, exceptions[] }`
- `activity` → `{ anomalies[], audit[], logins[] }`

**Reservation shape:**
```ts
{
  id: string,            // "r-024"
  table: number,
  party: number,
  startMin: number,      // minutes from 11:00am
  durMin: number,
  name: string,
  status: "seated" | "confirmed" | "arriving" | "departed" | "late" | "no-show" | "warn",
  deposit: "paid" | "refunded" | "forfeited" | "disputed" | "comp" | "pending",
  vip?: boolean,
  allergy?: boolean,
  source: "direct" | "concierge" | "waitlist" | "phone",
  revenue: number,       // expected revenue in USD
}
```

---

## Design Tokens

**Source of truth: `lib/colors_and_type.css`.** Lift values from there.

### Colors — Core

| Token                | Hex       | Use |
|----------------------|-----------|-----|
| `--peak-ink-900`     | `#0E1A16` | Primary surface (body bg) |
| `--peak-ink-800`     | `#12221D` | Elevated surface (sidebar, drawer) |
| `--peak-ink-700`     | `#1A2E28` | Card / panel |
| `--peak-ink-600`     | `#243830` | Hairline fills |
| `--peak-ink-500`     | `#2F4A3F` | Subtle accent / dividers |
| `--peak-brass-600`   | `#8B6F3F` | Press / active |
| `--peak-brass-500`   | `#B8945C` | Default brass |
| `--peak-brass-400`   | `#C9A671` | **Brand gold — primary accent** |
| `--peak-brass-300`   | `#D9BC90` | Hover highlight |

### Colors — Semantic

| Token              | Use |
|--------------------|-----|
| `--peak-success`   | Olive — paid, on-track, healthy |
| `--peak-warning`   | Amber-brass — needs attention, behind pace |
| `--peak-danger`    | Terracotta — refund, dispute, error |
| `--peak-info`      | Slate-blue — neutral status |

### Semantic aliases (preferred in components)

| Token              | Maps to                  |
|--------------------|--------------------------|
| `--bg`             | `--peak-ink-900`         |
| `--bg-elev`        | `--peak-ink-800`         |
| `--bg-card`        | `--peak-ink-700`         |
| `--fg`             | bone-50                  |
| `--fg-muted`       | bone-200 alpha           |
| `--fg-subtle`      | bone-300 alpha           |
| `--accent`         | `--peak-brass-400`       |
| `--border`         | `rgba(201,166,113,0.16)` |
| `--border-strong`  | `rgba(201,166,113,0.32)` |
| `--divider`        | `rgba(201,166,113,0.08)` |

**Never use pure `#000` or pure `#FFF`.** Borders are **brass-tinted**, not gray — this is a signature detail.

### Typography

| Token              | Value |
|--------------------|-------|
| `--font-sans`      | `'Inter', system-ui, sans-serif` (300–700 available) |
| `--font-display`   | `'Schibsted Grotesk', serif` (display moments — headlines, KPI numbers, hero stat numbers) |
| `--font-mono`      | `'JetBrains Mono', ui-monospace, monospace` |
| `--font-quote`     | `'Cormorant Garamond', serif` (rare — pullquotes only) |

**Type roles** (lift from `colors_and_type.css`):

| Role                   | Family    | Size  | Weight | Letter-spacing | Case |
|------------------------|-----------|-------|--------|----------------|------|
| Surface title          | display   | 32px  | 500    | -0.02em        | sentence |
| Card title             | sans      | 13px  | 600    | -0.005em       | sentence |
| KPI value              | display   | 24px  | 500    | -0.02em        | — |
| Hero stat number       | display   | 28px  | 500    | -0.02em        | — |
| Eyebrow (signature)    | mono      | 10–11px | 500  | **0.18em**     | UPPERCASE |
| Mono uppercase label   | mono      | 9.5px | 500    | 0.14–0.16em    | UPPERCASE |
| Body                   | sans      | 13px  | 400    | normal         | sentence |
| Body muted             | sans      | 12px  | 400    | normal         | sentence |
| Receipt title          | display   | 26px  | 500    | -0.02em        | sentence |

**Casing rule:** sentence case for everything **except** the mono-uppercase eyebrow/label pattern. No title case anywhere in UI. No emoji.

### Spacing scale

Tokens `--space-1` through `--space-9` exist; in practice the design uses a mix of fixed pixel values driven by component density. Common values: 4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 20 / 22 / 24 / 28 / 32 px.

- Card padding: 20px default, 14×16 tight.
- Surface padding: 28×32, 20×24 in compact density.
- KPI gap: 10px.
- Two-up grid gap: 16px.

### Radii

| Token           | Value | Use |
|-----------------|-------|-----|
| `--radius-sm`   | 4px   | kbd hints, status tags |
| `--radius-md`   | 8px   | Inputs, buttons, chips, search |
| `--radius-lg`   | 12px  | Cards, modals, drawer |
| `--radius-xl`   | 14px  | Command-K panel |
| `--radius-pill` | 999px | status pills, avatars |

### Shadows

Dark mode uses **almost no shadows** — depth is communicated by hairline borders.

| Token             | Use |
|-------------------|-----|
| `--shadow-sm`     | Reserved for popovers on light surfaces |
| `--shadow-md`     | Why-popover: `0 12px 32px rgba(0,0,0,0.5)` |
| `--shadow-lg`     | Receipt drawer / Command-K: `0 24px 60px rgba(0,0,0,0.6)` |
| `--shadow-glow`   | Focus rings only — brass-tinted |

Never use colored shadows for emphasis. The live-dot pulse on the shift state is the one exception (`box-shadow: 0 0 8px rgba(107,142,90,0.7)`).

### Borders (signature)

- Standard: `1px solid var(--border)` — brass-tinted hairline at alpha 0.16.
- Hover: `var(--border-strong)` at alpha 0.32.
- Active/selected: `var(--accent)` solid.
- Left-edge accent on rail cards and decision items: 2px solid in `--peak-warning` / `--peak-danger` / `--peak-success`.

### Easing & duration

| Token         | Value |
|---------------|-------|
| `--ease-out`  | `cubic-bezier(0.2, 0.6, 0.2, 1)` |
| `--dur-fast`  | 140ms |
| `--dur-base`  | 220ms |
| `--dur-slow`  | 420ms (page-level only) |

---

## Iconography

- **Set:** Lucide (1.5px stroke, rounded line caps/joins). In the prototype, icons are hand-rolled inline SVG in the `Icon` component (`lib/shell.jsx`) — replace with `lucide-react` in production.
- **Sizes:** 16px default in nav and inline; 14px in topbar controls; 13px in buttons; 11px in dense badges; 20–24px in tiles.
- **Color:** inherits from text via `currentColor`. Brass tint only on active nav items and confirmed states.
- **Icons always paired with text** in primary navigation. Icon-only is reserved for the bell, search, close, sidebar collapse chevron, and dense toolbar contexts.
- **No filled icons** except the Peak mark itself and the status dots in the receipt payment thread.

---

## Assets

| File                                | Use |
|-------------------------------------|-----|
| `assets/peak-mark-gold.svg`         | Brass Peak mark — shown in sidebar header |
| `assets/peak-lockup-reverse.svg`    | Full Peak wordmark + mark for dark surfaces (available for login, splash) |

The brand system has more variants (`peak-mark.svg`, `peak-wordmark.svg`, `peak-lockup.svg`, `peak-lockup-reverse.png`) in `/projects/<peak-design-system>/assets/logos/` — pull those when needed.

**No restaurant or guest photography is embedded in Peak Ledger** — this is an internal operations surface; the cinematic brand photography lives on the marketing site, not here.

---

## Files

### Entry points
- `Peak Ledger.html` — current design. Loads all libs and mounts `<App/>` to `#root`.
- `Peak Ledger v1 (dense).html` — earlier denser variant. Kept for reference; production should ship the current design.

### Stylesheets
- `lib/colors_and_type.css` — **design tokens** (colors, type, spacing, radii, easing, shadows). Tokens here are the source of truth.
- `lib/_shared.css` — base styles shared with other Peak surfaces (button base, body reset, etc.).
- `lib/peak.css` — all Peak Ledger component styles. ~2700 lines, organized by surface with clear comment dividers.

### Logic
- `lib/data.js` — fixture data (`window.PEAK`) for every surface.
- `lib/tweaks-panel.jsx` — in-design tweak controls (persona/compare/density). Strip in production.
- `lib/shell.jsx` — `Sidebar`, `Topbar`, `HighlightsRail`, `Icon`.
- `lib/widgets.jsx` — primitives: `KPI`, `Sparkline`, `WhyPopover`, etc.
- `lib/narrative.jsx` — `NarrativeHeader`, `EditorialSection`, used by narrative-mode surfaces.
- `lib/notifications.jsx` — `ActivityTray`, `ToastStack`, `useNotifications` hook.
- `lib/datatable.jsx` — reusable `DataTable` used by Guests/Activity/Reports.
- `lib/today.jsx` — `TodaySurface` + `TodayNarrative` + `TodayDashboard` + `TheTape` + `DayPacingChart`.
- `lib/reservations.jsx` — `ReservationsSurface` + `TimelineView` + `CoverFlowView`.
- `lib/money.jsx` — `MoneySurface` + 7 sub-tab components + `MoneyDashboard`.
- `lib/surfaces.jsx` — `GuestsSurface`, `ForecastSurface` (+ narrative/dashboard variants + `PacingChart`), `ReportsSurface`, `ReconciliationSurface`, `ActivitySurface`, `SettingsSurface`.
- `lib/app.jsx` — `App` root, routing, modals, ⌘K handler.

### Recommended implementation order
1. Tokens + base layout (sidebar + topbar + grid).
2. **Today/Narrative** end-to-end — this validates the core component library (KPI, card, hero strip, narrative header).
3. **The Tape** — the most complex single component. Owns its own SVG renderer.
4. **Receipt Drawer** — every other surface links into it.
5. **Money** (all 7 tabs) — once the receipt + tape patterns are settled.
6. Reservations Timeline + Cover Flow.
7. Forecast, Guests, Reconciliation, Activity, Reports, Settings.
8. ⌘K, Activity Tray, Toasts.

---

## Open questions for product

These came up while building the prototype and should be answered before implementation:

1. **Highlights Rail** — built but not mounted. Bring back as third column, fold permanently into the tray, or drop?
2. **Multi-location portfolio** — sidebar shows "Norma's · 1 of 4". Does the location switcher swap data globally, or does each location have its own URL space?
3. **Receipt drawer routing** — should opening a receipt push to `/r/:id` (shareable URL) or be modal-only?
4. **Compare mode "Forecast"** — what's the comparison baseline? Last-week's forecast, the model's projection, or the user's target?
5. **Read-only persona scope** — currently lands on Reports. Should they have any write surface (e.g., notes), or is the whole app read-only for them?
6. **Annotations on charts** — clickable pins ship with the design. Are these system-generated (anomaly detection) or user-authored, or both?

---

## Don'ts (Peak brand-system rules to follow)

- ❌ No emoji anywhere.
- ❌ No exclamation points in copy.
- ❌ No gradients (the Today hero radial brass shimmer is the only one; it's at alpha 0.06).
- ❌ No bouncy/springy animations.
- ❌ No scale-on-hover.
- ❌ No pure gray borders — borders are brass-tinted.
- ❌ No title case in UI. Sentence case only (mono-eyebrow uppercase is the one exception).
- ❌ No "users" — always "guests" or "diners". Internal staff are "GM / CFO / Owner / Host" etc.
- ❌ No hype verbs ("Unlock", "Supercharge", "Seamless", "Revolutionize").
