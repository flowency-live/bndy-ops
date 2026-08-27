# bndy-app — Production Readiness Audit

**Date:** 2026-07-11 · **Scope:** frontend repo `C:\VSProjects\bndy-app` + its API/asset dependencies
**Standard:** best-in-class at every layer; right solution over quick fix, always (Jason, 2026-07-11).
**Verified by trace:** artist-search INP fixed — worst input dispatch was 1,900ms, now <10ms; worst task 4,321ms → 74ms; GC churn 3.8s → 0.

Severity: **P0** = will break or embarrass at scale/launch · **P1** = degrades real users now · **P2** = quality bar for "best in class".

---

## A. Scale & performance

### A1 · P0 — API payloads don't scale (backend + frontend contract)
`fetchGigs` pulls **every gig nationwide for 2 years**; `fetchVenues`/`fetchArtists` pull full tables. Today that's ~2.2k gigs / 1.4k venues / 2k artists; at 10× the payload alone kills first paint on mobile networks, and every client-side distance/filter pass grows linearly.
**Right fix (not a patch):** viewport/geo-bounded gigs endpoint + cursor-paginated artists/venues (this is the perf-audit backlog item; coordinate with backend). Frontend then moves filtering to query params and drops the client-side distance sweep. Until the endpoint exists, interim guardrail: request windowing (90 days default, "load more" for the horizon) — explicitly labelled interim.
**Effort:** backend endpoint + frontend adoption, ~2–3 days. The single most important scaling item.

### A2 · P1 — Gig list (GigsHome) renders every filtered card
Same disease the artist browse had. Fine at 43 gigs in radius; not at 500 (London launch). The day-band structure is the natural seam.
**Right fix:** the same `Deferred` render-on-approach per day band, promoted from ArtistsBrowse into a shared `src/components/DeferredSection.tsx`, plus `memo(GigCard)`. If bands can individually exceed ~100 cards, use real windowing (TanStack Virtual) instead — decide once, against London-scale data. **Effort:** half a day including the shared extraction.

### A3 · P1 — Images: raw `<img>`, no optimization pipeline
4 eslint-suppressed raw `<img>`s; zero `next/image`. One artist JPEG ships at 445 KiB. S3 serves `Cache-Control: None` (927 KiB re-downloaded every repeat visit).
**Right fix:** (a) S3 upload pipeline sets `max-age=31536000, immutable` + one-off backfill (backend); (b) resize/WebP variants at enrichment time (backend); (c) `next/image` with `remotePatterns` for S3 + fbcdn, real `sizes` per grid (frontend). Do all three — they solve different halves. **Effort:** ~1 day frontend, ~1 day pipeline.

### A4 · P2 — Remaining continuous work
Tonight-ping now 30fps and tab-paused (done). Ticker is compositor-only (done). Backdrop blurs halved (done). Watch item: if map + many glass controls still cost battery on low-end Android, the next step is pausing the ping while the map is mid-gesture. Profile on a real device before doing anything.

---

## B. Accessibility

### B1 · P1 — Sheets have no focus management
`role="dialog"` + Escape exist, but: focus does not move into the sheet on open, is not trapped (Tab reaches the page behind), is not restored on close, and background scroll isn't locked.
**Right fix:** replace hand-rolled Sheet internals with Radix UI `Dialog` primitives (already in the ecosystem per the shadcn plan — this is the "lifted shadcn kit" the greenfield plan §2 intended). Radix gives focus trap, restore, scroll lock, aria wiring and portal for free, and we keep our styling. Refactor all five sheet consumers. **Effort:** ~1 day. This is the correct fix, not adding a focus-trap util to the custom Sheet.

### B2 · P1 — Map is canvas-only; no keyboard/SR path to gigs from the map
GPU markers can't receive keyboard focus. The gig list at `/gigs` is the accessible equivalent — make that explicit: `aria-label` on the map region, a visually-hidden "Browse these gigs as a list" link above the map, and ensure everything doable on the map is doable in the list (it is today — keep it that way as a rule).

### B3 · P2 — Contrast sweep per skin
Most pairings pass; the ones to verify and correct at token level: Blackout `--dim2 #666` on `#000` (3.6:1 — fails for small text; raise to ~#8A8A8A), Solar `--hl #B58900` w/ white text (borderline), Golden Hour `--dim2 #B08D72` on `#F9EBDC`. Run all 9 skins through a contrast script (I can generate one from skins.css) and adjust tokens, not components.

### B4 · P2 — Reduced-motion is global-kill only
`globals.css` nukes all animation durations. Correct, but the skin-wipe swap then flashes abruptly. Minor: gate the wipe behind a matchMedia check (SkinPicker already checks for splash — mirror it).

---

## C. Mobile

### C1 · P1 — Ticker ignores the iOS notch
`.bndy-ticker` is fixed at `top:0` with no safe-area padding — on notched iPhones it renders under the status bar/notch. Fix in skins.css: `padding-top: env(safe-area-inset-top, 0px)` on the ticker and bump `main`'s offset accordingly. (Nav + FAB already handle safe-area.)

### C2 · P2 — Device matrix untested
Everything above verified by code inspection and desktop traces only. Before launch: real-device pass on a mid-range Android (Moto G class) and an iPhone with notch — map gestures, sheet drag, skin switch, keyboard-open layout (search inputs + `interactive-widget=resizes-content` may be needed in viewport meta).

---

## D. SEO / infra / hygiene

- **Good news:** artist/venue profile pages already do this right — server components, `revalidate: 300` ISR, `generateMetadata`. This meets plan §4. Keep it the template for any new public page.
- **P1 — no `robots.txt` / `sitemap.xml`**: add `src/app/robots.ts` + `src/app/sitemap.ts` (generate from artists/venues at build/ISR). Trivial in Next and matters for the "replace Facebook for discovery" goal.
- **P2 — no web manifest / PWA**: for the ambition ("home-screen app for gig-goers"), add manifest + icons; installability is cheap credibility. Service worker only if/when offline gig lists become a goal — do not cargo-cult one in.
- **P2 — pre-existing tsc errors (3)**: `MapView showUserHeading` (typings lag; verify option name against maplibre version) + two test DTO mismatches. Fix properly — a red typecheck normalises ignoring it.
- **P2 — test coverage**: vitest covers domain logic only. Features (skins provider, Deferred, Sheet behaviour) have zero tests. Minimum bar: provider attribute wiring, Deferred render gating, sheet focus behaviour post-Radix.
- **Process:** CI must run `tsc --noEmit`, eslint, vitest, and a Lighthouse CI budget (LCP < 2.5s, INP < 200ms, CLS < 0.1) on every PR — that's how these stop reaching you via DevTools.

---

## Recommended order

1. A1 API windowing/geo endpoint (backend+frontend, the scaling keystone)
2. B1 Radix dialog refactor + C1 ticker safe-area + D robots/sitemap (one PR each, fast)
3. A2 shared DeferredSection on gig list · A3 image pipeline + next/image
4. B3 contrast sweep · D tests/CI budgets · C2 device pass
5. B2/B4/PWA polish

Nothing here is a quick fix; each entry names the structural solution. Items marked backend need the API repo, which I don't currently have mounted.
