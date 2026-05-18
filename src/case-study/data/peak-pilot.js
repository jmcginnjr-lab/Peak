// Peak's Pilot Case Study — content as structured data.
//
// Adding a new case study? Duplicate this file, swap the slug, change
// the data, and register it in src/case-study/CaseStudyPage.jsx's
// CASE_STUDIES map. The template renders whichever case study matches
// the URL slug (defaults to peak-pilot if no slug supplied).

const peakPilot = {
  slug: 'peak-pilot',

  // ─── Cover / Hero ──────────────────────────────────────────────────
  hero: {
    eyebrow: 'Case Study · 2024 — 2026',
    title: 'Two restaurants.',
    titleAccent: 'Twenty-nine months.',
    subtitle: 'A platform proven against real revenue.',
    dek: `Peak Reservations is a reservation and ticketing platform built
          for restaurants where seating is a commodity. Since late 2024,
          two Palm Springs restaurants have operated as pilot venues
          across every stage of the product's development.`,
  },

  // ─── Pilot venues ──────────────────────────────────────────────────
  restaurants: {
    eyebrow: 'The Pilot Venues',
    title: 'Different in every way that matters. Same trajectory.',
    intro: `These venues are meaningfully different from each other — in
            size, daypart, format, and price point. Both are in the same
            product pilot. Both show the same shape of growth, through
            the same seasonal cycles of a desert resort market.`,
    venues: [
      {
        name: "Norma's",
        location: 'Palm Springs, CA',
        format: 'Upscale · Full-service',
        stats: [
          { k: 'Tables',  v: '38'                 },
          { k: 'Seats',   v: '135'                },
          { k: 'Service', v: '7 days · 7a – 9p'    },
        ],
        blurb: `A destination brunch spot frequented by locals and
                celebrities alike. Saturday is consistently the strongest
                revenue day.`,
      },
      {
        name: "Mister Parker's",
        location: 'Palm Springs, CA',
        format: 'Fine dining · Speakeasy',
        stats: [
          { k: 'Tables',  v: '27'                },
          { k: 'Seats',   v: '69'                },
          { k: 'Service', v: 'Wed – Sun · 5p – 9p' },
        ],
        blurb: `Old-Hollywood steakhouse, served by candlelight. Dinner
                only, five nights a week.`,
      },
    ],
  },

  // ─── Three product stages ──────────────────────────────────────────
  stages: [
    {
      slug: 'alpha',
      chapter: '2024',
      label: 'Alpha',
      date: 'November 2024',
      sub: 'Basic admin functionality. No mobile app.',
      narrative: `Built by an outside software agency. Core reservation
                  and ticketing functionality was live; the product was
                  handed off at the end of 2024. Fewer than one in five
                  seated tables carried a paid ticket. The revenue was
                  real but constrained — the product needed to be owned.`,
      highlights: [
        { stat: '20.6%', label: 'Of seated tables carried a paid ticket at Norma’s' },
        { stat: '$75K',  label: 'Combined gross revenue from a baseline product' },
      ],
      metrics: [
        { k: 'Combined gross revenue', norma: '$48,413',  parker: '$26,683',  combined: '$75,096', highlight: true },
        { k: 'Total reservations',     norma: '8,106',    parker: '3,479',    combined: '11,585'                   },
        { k: 'Tables with a paid seat',norma: '1,672',    parker: '583',      combined: '2,255'                    },
        { k: '% Paid tables',          norma: '20.6%',    parker: '16.8%',    combined: '—'                        },
        { k: 'Avg. table price',       norma: '$24.23',   parker: '$34.13',   combined: '—'                        },
        { k: 'Cancellation fees',      norma: '$900',     parker: '$2,700',   combined: '$3,600'                   },
        { k: 'Revenue retained from no-shows', norma: '$5,969', parker: '$3,284', combined: '$9,253'                },
      ],
    },
    {
      slug: 'beta',
      chapter: '2025',
      label: 'Beta',
      date: 'January – November 2025',
      sub: 'Agency engagement ends. In-house team builds. iPad app ships.',
      narrative: `The product was rebuilt from the inside. An iPad app
                  launched. Admin capabilities expanded by ~95%. Both
                  restaurants stayed live on the platform throughout —
                  no restart, no new data set. The same two venues,
                  continuous, with twice the paid-ticket conversion.`,
      highlights: [
        { stat: '+77%',    label: 'Paid tables at Norma’s vs. 2024'             },
        { stat: '+31%',    label: 'Combined revenue, year over year'            },
        { stat: '$23,400', label: 'Cancellation-related revenue captured'      },
      ],
      pullquote: {
        text: 'The same restaurant seated roughly the same number of guests — Peak converted nearly twice as many of them into paying tickets.',
        attr: 'Beta period summary',
      },
      metrics: [
        { k: 'Combined gross revenue', norma: '$58,898',  parker: '$39,505',  combined: '$98,403', delta: '+31%', highlight: true },
        { k: 'Total reservations',     norma: '9,499',    parker: '3,861',    combined: '13,360'                                  },
        { k: 'Tables with a paid ticket', norma: '2,954', parker: '900',      combined: '3,854',   delta: '+71%'                  },
        { k: '% Paid tables',          norma: '31.1%',    parker: '23.3%',    combined: '28.8%'                                   },
        { k: 'Cancellation fees',      norma: '$2,775',   parker: '$6,150',   combined: '$8,925'                                  },
        { k: 'Revenue retained from no-shows', norma: '$7,334', parker: '$7,141', combined: '$14,475'                              },
      ],
    },
    {
      slug: 'ga',
      chapter: '2026',
      label: 'Early GA',
      date: 'April 2026 — present',
      sub: 'iOS app live. Event ticketing. Backmarket resale. Ready for venues beyond the pilot.',
      narrative: `A complete platform: iOS app, iPad app, advanced admin
                  tools, event ticketing, backmarket resale. Two years
                  of real-world iteration behind it. The pilot venues
                  are still live and still growing — and by May 2026,
                  Norma's had already generated 98% of its entire 2025
                  gross revenue, with the peak season still ahead.`,
      highlights: [
        { stat: '92%',    label: 'Of full-year 2025 combined revenue · collected by May' },
        { stat: '$46.55', label: 'Avg. table price at Mister Parker’s'                    },
        { stat: '+36%',   label: 'Mister Parker’s avg. table price vs. 2024'              },
      ],
      metrics: [
        { k: 'Gross revenue (YTD May)',  norma: '$57,857',  parker: '$32,429',  combined: '$90,286', highlight: true },
        { k: 'As % of full-year 2025',   norma: '98%',      parker: '82%',      combined: '92%',     highlight: true },
        { k: 'Total reservations',       norma: '5,025',    parker: '2,091',    combined: '7,116'                    },
        { k: 'Tables with a paid ticket',norma: '1,932',    parker: '598',      combined: '2,530'                    },
        { k: '% Paid tables',            norma: '38.4%',    parker: '28.6%',    combined: '35.5%'                    },
        { k: 'Avg. table price',         norma: '$27.47',   parker: '$46.55',   combined: '$37.01'                   },
        { k: 'Cancellation fees',        norma: '$600',     parker: '$3,150',   combined: '$3,750'                   },
        { k: 'Revenue retained from no-shows', norma: '$3,920', parker: '$4,023', combined: '$7,943'                  },
      ],
    },
  ],

  // ─── Growth chart data (combined gross revenue across stages) ─────
  growthChart: {
    eyebrow: 'Combined gross revenue',
    title: 'The same two venues. Three product stages. Compounding revenue.',
    sub: '2026 figure is YTD through May — the first five months alone are 92% of full-year 2025.',
    bars: [
      { label: '2024 · Alpha',     value: 75096,  sub: 'Full year'        },
      { label: '2025 · Beta',      value: 98403,  sub: 'Full year · +31%' },
      { label: '2026 · Early GA',  value: 90286,  sub: 'YTD · 5 months',  partial: true },
    ],
  },

  // ─── Editorial takeaways ──────────────────────────────────────────
  takeaways: {
    eyebrow: 'What Peak’s Pilot Proves',
    items: [
      {
        num: '01',
        head: 'The product drives real, measurable revenue lift.',
        body: `Combined gross revenue grew 31% from 2024 to 2025 on
               similar reservation volume. The gain came from more
               tables carrying a paid ticket — not more traffic. Both
               restaurants are on pace to significantly outperform
               2025 in 2026, with 92% of last year's full revenue
               already collected by May.`,
      },
      {
        num: '02',
        head: 'The product is battle-tested and ready to scale.',
        body: `What launched in late 2024 as basic reservation
               software is now a full platform: iOS and iPad apps,
               flexible pricing, event ticketing, cancellation
               enforcement, backmarket resale. The two pilot venues
               have tested it through every iteration and contributed
               to improvements. It works.`,
      },
      {
        num: '03',
        head: 'Proven over time, under real operating conditions.',
        body: `29 months of continuous data from two live
               restaurants — through a full product build, a team
               evolution, and two complete seasonal cycles. The team
               that built the beta took the same two venues from $75K
               to $98K in combined gross revenue, and is on pace to
               surpass that again in 2026. The compounding is
               consistent and measurable.`,
      },
    ],
  },

  // ─── Summary table — three stages side-by-side ────────────────────
  summary: {
    eyebrow: 'At a glance',
    title: 'Three stages, side-by-side.',
    columns: ['', '2024 · Alpha', '2025 · Beta', '2026 · Early GA'],
    rows: [
      { k: 'Combined gross revenue',          v: ['$75,096',  '$98,403',  '$90,286 (5 mo.)'], highlight: true },
      { k: 'Year-over-year',                  v: ['—',        '+31%',     '92% of 2025 by May'] },
      { k: 'Norma’s paid conversion',    v: ['20.6%',    '31.1%',    '38.4%'] },
      { k: 'Mister Parker’s paid conv.', v: ['16.8%',    '23.3%',    '28.6%'] },
      { k: 'Mister Parker’s avg. price', v: ['$34.13',   '$30.38',   '$46.55'] },
      { k: 'Combined cancellation fees',      v: ['$3,600',   '$8,925',   '$3,750 (5 mo.)'] },
      { k: 'Combined revenue retained',       v: ['$9,253',   '$14,475',  '$7,943 (5 mo.)'] },
    ],
  },

  // ─── Money-on-the-table compound projections ──────────────────────
  projections: {
    eyebrow: 'Money on the table, over time',
    title: 'Compounded forward.',
    intro: `If Peak's pilot revenue were invested rather than left on the
            floor, here's the future value at three return rates across
            two contribution scenarios.`,
    scenarios: [
      {
        label: 'Scenario A',
        sub: 'Flat $100K/year contribution',
        note: 'Roughly the 2025 actual.',
        years: [
          { y: 'Year 5  · 2031', rates: { '7%': '$945K', '10%': '$1.03M', '12%': '$1.1M' } },
          { y: 'Year 10 · 2036', rates: { '7%': '$1.9M', '10%': '$2.3M',  '12%': '$2.6M' } },
          { y: 'Year 15 · 2041', rates: { '7%': '$3.2M', '10%': '$4.3M',  '12%': '$5.2M' } },
          { y: 'Year 20 · 2046', rates: { '7%': '$5.1M', '10%': '$7.5M',  '12%': '$9.7M' } },
        ],
      },
      {
        label: 'Scenario B',
        sub: 'Contributions grow 15% / year',
        note: 'Starting at $113K — the 2026 projection.',
        years: [
          { y: 'Year 5  · 2031', rates: { '7%': '$1.2M',  '10%': '$1.3M',  '12%': '$1.4M' } },
          { y: 'Year 10 · 2036', rates: { '7%': '$3.5M',  '10%': '$4.0M',  '12%': '$4.4M' } },
          { y: 'Year 15 · 2041', rates: { '7%': '$8.4M',  '10%': '$10.1M', '12%': '$11.5M' } },
          { y: 'Year 20 · 2046', rates: { '7%': '$18.8M', '10%': '$23.7M', '12%': '$28M' } },
        ],
      },
    ],
    closer: `Even the conservative scenario crosses $1M within five years
             and $7.5M by 2046. The compound effect of capturing every
             dollar — instead of leaving them on the floor — is the
             real product.`,
    legend: [
      { rate: '7%',  label: 'Conservative · Vanguard balanced fund',  doubles: 'Doubles every 10.3 years' },
      { rate: '10%', label: 'Historical · S&P 500 average (VTSAX)',   doubles: 'Doubles every 7.2 years'  },
      { rate: '12%', label: 'Aggressive · growth allocation',          doubles: 'Doubles every 6 years'    },
    ],
  },

  // ─── Pancakes / Range-Rovers visual ───────────────────────────────
  pancakes: {
    eyebrow: 'A different unit of measure',
    title: 'In pancakes.',
    intro: `At a $25 brunch pancake with a $5 net profit per order, here's
            what the pilot revenue looks like translated into something
            you can hold in your hand — and into the SUVs you'd need to
            haul the plates away.`,
    rows: [
      { y: '2025 · full year',         gross: '$98,403',  pancakes: 19681, rovers: 164 },
      { y: '2026 · projected',         gross: '$113,567', pancakes: 22713, rovers: 189 },
      { y: 'All three stages',         gross: '$263,785', pancakes: 52757, rovers: 440, highlight: true },
    ],
    footnote: '$25 pancake · $5 net profit per order · Range Rover ~140 cu ft interior · ~120 plates per vehicle',
  },

  // ─── Closing CTA ──────────────────────────────────────────────────
  cta: {
    eyebrow: 'Bring Peak to your floor',
    title: 'You’ve earned your guests.',
    titleAccent: 'Now make every table count.',
    body: `Peak is by invitation, in limited cohorts, in North America.
           If your restaurant fills its own room, we should talk.`,
  },
};

export default peakPilot;
