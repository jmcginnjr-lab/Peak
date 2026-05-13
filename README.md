# Peak — marketing site

Vite + React app. Two routes (one Vite bundle, code-split):

| Route          | What it is                                  |
|----------------|---------------------------------------------|
| `/`            | Marketing landing page                      |
| `/calculator`  | Internal sales calculator (URL-only)        |

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:5173/

## Marketing-page variants

The landing page renders one of two card sets depending on the URL:

- `/` — **POSITIVE** (5 cards, leading with Peak's strengths)
- `/?v=neg` — **NEGATIVE** (3 cards, framing competitor pain)

The sections below the card stack are identical for both variants. To
edit copy, change the `POSITIVE_CARDS` / `NEGATIVE_CARDS` arrays in
`src/marketing/MarketingSite.jsx`.

## Build / deploy

```bash
npm run build      # → dist/
npm run preview    # serve dist/ at :4173
npm run deploy     # build + push dist/ to a gh-pages branch
```

For deploying behind a project path (`username.github.io/repo-name/`)
rather than a custom domain or user/org page, run with
`BASE_PATH=/repo-name/ npm run deploy` and search-replace JSX asset
paths from `/assets/...` → `${import.meta.env.BASE_URL}assets/...`. A
custom domain or user/org page avoids that step.

## Project layout

```
src/
  main.jsx                   route dispatch (lazy)
  marketing/
    MarketingSite.jsx        Nav · Hero · StackRegion · Footer
                             — defines POSITIVE_CARDS / NEGATIVE_CARDS
                             — `useCardVariant()` reads ?v=neg
    ScrollScenes.jsx         per-card animated UI scenes
                             (Marketplace, Booking, Guestbook, Event,
                             Insight, Spotlight, VIP, Cost, Yield)
    Sections.jsx             Results, Growth, Brand-protection, Compare
    Seats.jsx                hero floorplans
    *.css                    scoped styles
  calculator/                /calculator route
public/assets/               logos, photos, videos, bear illustrations
```

## A few things worth knowing

- **Hero + footer** use a single-video native loop (`<LoopVideo crossfade={false}>`)
  so the perceived loop matches the source duration (~8 s). The
  cross-fade variant is still available in `Sections.jsx` if needed.
- **Content-driven scenes** (Spotlight, VIP, Cost, Yield, Event) get an
  aspect-ratio-auto frame via `.mk-card-scene:has(.sc-X)` overrides in
  `marketing.css`. Without that override the default 5:4 frame clips
  them.
- **Bears** are hidden globally for now —
  `.bear-anchor { display: none !important; }` in `marketing.css`. The
  `<Bear>` JSX still renders, so removing that one rule brings them
  back.
- **Smooth scroll** is Lenis, mounted only on the marketing route.
- **VIP bear watermark** lives at `.sc-vip-card-bear` and uses
  `bear-01.svg` as a CSS mask. Adjust `opacity`, `mask-size`,
  `mask-position` to tune the watermark feel.
