# bndy Frontend — Greenfield Rebuild Plan

**Decision (2026-07-03):** rebuild the frontend as a fresh app (`bndy-app`) with the new design language as its foundation, migrating screen-by-screen. The map v2 module already built proves the direction.

**Principle:** this is a **re-shell, not a rewrite.** The backend/API is sound and untouched. We reuse the data layer, the component kit, and the (already modular) map. We set the foundations right once, then bring screens across one vertical slice at a time behind a per-route cutover — so we are always shippable and never in a dark period.

---

## 1. What this is NOT

- **Not a from-scratch rewrite.** We lift working code (hooks, services, types, shadcn components, the map module) rather than retype it.
- **Not a big-bang cutover.** Old and new run side by side; each route flips only when it reaches parity.
- **Not a backend project.** `api.bndy.co.uk`, DynamoDB, auth — unchanged. (The perf-audit backend items proceed on their own track.)

---

## 2. New-app foundations (get these right once)

| Concern | Decision |
|---|---|
| Framework | Next 15 App Router, React 18.3, TypeScript (match the current ecosystem so components port cleanly). |
| Styling | Tailwind with `darkMode: 'class'`; **design-token contract** in CSS vars (`:root` + `.dark`) — colours, surfaces, radii, the neon brand set. |
| Theme + skins | `ThemeProvider` owns `mode: light|dark` + `skin`, persisted to user preference. The map's skin registry plugs into the same system; app accents read the same tokens. |
| Components | shadcn/Radix kit lifted from `bndy-frontstage/src/components/ui` and re-tokenised. |
| Data | Lift `src/hooks/*`, `src/lib/services/*`, `queryClient`, `src/lib/types.ts`; TanStack Query provider at root; same `NEXT_PUBLIC_API_URL`. |
| Map | Import `src/components/map` (v2) wholesale — no changes. |
| Rendering | **Static/ISR by default.** Tenant detection in **middleware**, not the root layout (the mistake that forced SSR on every route). Public profile pages use `revalidate`, not `no-store`. |
| One map engine | MapLibre only. No Mapbox token, no Deck.gl, no Leaflet. |
| Chrome | The prototype's language: no heavy header, glass controls, the mode toggle / search / tonight badge / date bar / skin+theme controls as shared components. |

---

## 3. Reuse ledger

**Ports ~as-is:** `src/hooks/*` (useVenues, useAllPublicEvents, useEventsForList, useArtist, useVenue…), `src/lib/services/*`, `src/lib/utils/*` (date-filter, fuzzy-search), `src/lib/types.ts`, `queryClient`, `src/components/ui/*` (shadcn), the whole `src/components/map` module, `TenantContext`.

**Adapt / re-skin:** `EventInfoOverlay` / `VenueInfoOverlay` → prototype bottom-sheet; `ListView` / `listview/*`; venue + artist profile pages; `ArtistBrowseClient` (keep react-window virtualization); nav/header → new light chrome.

**Rebuild fresh:** root layout + providers (clean, static-first); the design-token/theme/skin system; navigation shell. `MapboxContext` and the old `mapbox/*` tree are dropped entirely.

**Leave behind:** Deck.gl, mapbox-gl, leaflet, the `next.config` splitChunks hacks, `ServiceWorker` cache-nuker, root-level repo junk.

---

## 4. Screen inventory & migration order

Ordered by value delivered vs. risk. Each slice is shippable.

1. **Shell + Home map** — foundations, nav, theme/skin, then the v2 map (already built). *Cut over home first.*
2. **Gig list view** — the good ListView; reuses `useEventsForList`. Re-skin only.
3. **Venue profile** — port, ISR + SEO metadata (single fetch, no `no-store`, no duplicate `generateMetadata` fetch).
4. **Artist profile + Artist browse** — port; keep virtualized grid + debounced memoised search; paginated endpoint if/when backend adds it.
5. **Event wizard** — **last and heaviest** (Google Places, multi-step, react-hook-form). Until ported, "Add event" deep-links to the old app.
6. **about / chat / dropzone** — trivial; migrate opportunistically.

---

## 5. Cutover strategy

- Host `bndy-app` on a preview origin (e.g. `beta.bndy.co.uk`) during the build.
- **Per-route reverse proxy** (recommended): the new app serves migrated routes and proxies everything else to the old app, so users see one site while we migrate underneath. Alternatively flip routes at the DNS/edge as each reaches parity.
- A route is "done" when: visual parity to the new language, data correct, SEO intact (for public pages), no console errors, and it works on mobile.
- Keep the old app deployable until the wizard lands and every route has flipped; then retire it.

---

## 6. Repo & tooling

- **New repo `bndy-app`** (proposed path `C:\VSProjects\bndy-app`), so history is clean and the old app stays intact as a reference/fallback.
- Same Amplify/CI shape as frontstage; `npm ci`-clean lockfile from day one.
- Env: `NEXT_PUBLIC_API_URL` (same backend), no Mapbox token, Google Maps key only where the wizard needs it.

---

## 7. Risks & how we hold them

- **Event wizard** is the real lift — quarantine it to last; deep-link back to old app meanwhile.
- **SEO/SSR on public profiles** — get the static/ISR + metadata pattern right in the venue-profile slice, then reuse it.
- **Two apps in flight** — the reverse-proxy keeps it invisible to users; keep slices small so the gap is short.
- **Viewport data** — build the new map viewport-driven against the backend geo endpoint (perf-audit item) so it scales; coordinate that backend work.
- **Auth/tenant** — port `TenantContext` + Cognito wiring early (needed by profiles/wizard); validate on the first authenticated route.

---

## 8. First scaffold (what I lay down next)

1. `bndy-app` skeleton: Next 15 App Router, Tailwind + `darkMode:'class'`, TS, the token contract + `.dark`, root providers (react-query, theme/skin, tenant).
2. Lift the data layer + shadcn kit + the `src/components/map` module.
3. New nav/chrome shell + the light/dark + skin controls as shared components.
4. Home route rendering the v2 map against the live API.
5. Then slice #2 (gig list).

Ports either way — everything already built (map module, date bar, skins, light/dark) drops straight into this shell.
