# bndy Platform Performance Audit — 2026-07-02

Scope: bndy-frontstage (live.bndy.co.uk), bndy-serverless-api, AWS infra (SAM template + CloudFront config snapshots; bndy-infrastructure repo is stale). All findings verified against source with file:line citations, and confirmed against the live site.

## Live measurements (2026-07-02, warm browser)

| Endpoint / asset | Time | Size (decoded) | Compressed? | Cached? |
|---|---|---|---|---|
| `GET api.bndy.co.uk/api/venues` | **10,809 ms** | 1,047 KB / 1,417 venues | No | No |
| `GET api.bndy.co.uk/api/events/public` (initial page load) | **5,090 ms** | ~1,285 KB | No | No |
| `GET api.bndy.co.uk/api/events/public` (1-week range) | 1,221 ms | 213 KB / 251 events | No | No |
| `GET api.bndy.co.uk/api/artists` | 1,552 ms | 1,270 KB / 1,744 artists (full bios) | No | browser-only 300s |
| `GET live.bndy.co.uk/api/artists/{id}` ×15 (overlay N+1) | 1,800–3,000 ms EACH | ~1 KB each | — | No |
| vendors JS chunk | — | 2,929 KB (one chunk, every route) | br (edge) | immutable |

The slowness is not mysterious. It is four compounding architectural decisions, all fixable.

---

## Root causes (ranked)

### RC1 — Backend reads are full-table scans + N+1 fan-out
- `GET /api/events/public`: paginated **Scan of the entire events table** (past events included — the date filter is a FilterExpression, applied *after* reading every item), then **one GetItem per artist and per venue** (no BatchGetItem). `events-lambda/handlers/public.js:427-470`. Cost grows linearly with total table size forever; ADR-022 capture-before-prune makes this a guaranteed cliff.
- `GET /api/venues`: Scan of bndy-venues **plus one COUNT Query per venue per request** (1,417 today) just to compute `eventCount`, unbounded by date. `venues-lambda/handlers/venues-routes.js:29,61-81`. This is the 10.8s.
- `GET /api/artists/{id}/public-events`: full-table Scan for collaborations (`contains(collaboratingArtistIds)`). `public.js:574-584`.
- Venue search = scan + in-memory `includes()` (`venues-routes.js:39-57`). Artist search is the one good one (name-prefix GSI, `handler.js:1469-1517`).
- The GSIs needed to fix most of this (**geohash6-date-index, venueId/artistId-date-index**) already exist, and a well-built geo endpoint already exists (`public.js:166-222`) — the frontend just doesn't use it.

### RC2 — Zero compression, zero shared caching on the API
- API Gateway is HTTP API (v2): cannot compress or cache. No CloudFront in front of api.bndy.co.uk (the www distribution's `/api/*` behavior has TTL 0 and forwards `Headers: *`, and frontstage bypasses it anyway). Lambdas return raw JSON. Result: multi-MB uncompressed payloads on every request; JSON like this compresses ~10×.
- Only `/api/artists` sets any Cache-Control at all; nothing has a shared cache. Every map pan / page view pays full backend cost.
- Images: `bndy-images` S3 served by **direct S3 URL** — no CDN (uploads-lambda/handler.js:14,226).

### RC3 — Frontend fetches entire datasets, renders everything
- Home map fires **three full-dataset queries** at once: date-range events + ALL future events + ALL venues (`src/components/mapbox/MapboxMap.tsx:64-78`). Hooks are explicitly unbounded (`useAllPublicEvents.ts:43-60`, `useVenues.ts:9`).
- Artists browse: bare useEffect fetch (no react-query) of all 1,744 artists with `cache:'no-store'`, renders **all cards in one pass, no virtualization**, and runs fuzzy Levenshtein over every artist per keystroke via two overlapping effects (`ArtistBrowseClient.tsx:108-165,340-360`).
- N+1 confirmed live: venue/event overlays fetch each gig artist individually through the Next SSR proxy (extra Lambda hop) just for an avatar URL (`useArtistImages.ts:40-60`) — 15 requests × ~2s on first paint.
- Every route is dynamically SSR-rendered (zero static/ISR — `await headers()` in root layout forces it; `layout.tsx:118`) and venue/artist pages do sequential fetch waterfalls with `no-store` plus a duplicate fetch in `generateMetadata`.

### RC4 — Bundle self-sabotage
- Custom `splitChunks` in `next.config.ts:87-116` forces **all node_modules into one 3MB vendors chunk loaded on every route** (confirmed in build manifest — even /about ships mapbox-gl).
- `config.optimization.sideEffects = false` (`next.config.ts:123`) **disables tree-shaking** — the comment says the opposite.
- mapbox-gl statically imported in root layout via MapboxContext (`layout.tsx:17`, `MapboxContext.tsx:4`), defeating the page's correct `dynamic(...,{ssr:false})`.
- Google Maps JS (+places, ~250KB) injected on **every page** (`providers.tsx:11`, `GoogleMapsProvider.tsx:133-140`) though only the event wizard needs it. Three map engines ship: Mapbox (real), Leaflet (only the artist mini-map + a dead legacy tree in `src/components/map/`), Google (script tag). 7+ unused map deps in package.json; `playwright` in prod deps (400MB+ per Amplify install); 8 Google font families in root layout.

---

## No-brainers (do this week; mostly hours each)

**Backend**
1. **Gzip in-Lambda** on all public GETs (check Accept-Encoding, return `isBase64Encoded:true` + `Content-Encoding: gzip`). ~10× wire reduction on every endpoint. Nothing else ships until this does.
2. **Kill `eventCount` N+1 on /api/venues** — maintain a counter attribute on the venue at event create/delete (or drop it from the list response). Turns 10.8s into ~1s.
3. **Add `Cache-Control: public, max-age=60-300`** to all public GETs.
4. `AWS_NODEJS_CONNECTION_REUSE_ENABLED=1` in template.yaml Globals (SDK v2 has keep-alive off by default — free latency on every Dynamo call).
5. Replace `Promise.all(get)` joins with **BatchGetItem** (25/call) in public.js.
6. **Fix unpaginated scans** (correctness, not just perf): `handleGetAllArtists` (handler.js:458), `handleGetAllVenues` (venues-routes.js:29), external-id lookups. The artists list is at ~1.27MB — brushing the 1MB scan page limit; artists will start silently vanishing from the list.
7. Drop `bio` from the artists list projection; drop `enrichment_data` from the venues list.

**Frontend**
8. **Delete the custom splitChunks block and `sideEffects=false`** (`next.config.ts:87-123`). Restores Next 15 granular chunking + tree-shaking. Biggest single bundle win, 10-minute change.
9. **Lazy-init mapbox-gl** inside MapboxContext (dynamic import) so non-map routes don't ship it.
10. **Remove `autoLoad` from GoogleMapsProvider**; load only when the wizard's venue step mounts.
11. Uninstall dead deps: playwright, axios, supercluster, react-leaflet, leaflet.markercluster, @googlemaps/*, @maptiler/*, use-places-autocomplete, use-google-maps-script; express→devDeps. Delete legacy `src/components/map/` Leaflet tree (keep VenueModeIndicator).
12. `useMemo` the context values (MapboxContext.tsx:242, ViewToggleContext.tsx:82, EventsContext.tsx:77); trim fonts to 2-3 families; delete the ServiceWorker cache-nuker (`ServiceWorkerRegistration.tsx:12-29`).

Expected combined effect: non-map routes drop from ~900KB to <200KB gzip JS; venues endpoint ~10× faster; all API payloads ~10× smaller on the wire.

**Security (found in passing, fix immediately)**
- **Cognito client secret hardcoded in plaintext in `template.yaml:500-501`** — flagged in the Nov 2025 audit, still there, now committed to the repo. Rotate + `{{resolve:secretsmanager:...}}` like the JWT secret.
- Several `/mcp` mutation endpoints are deliberately unauthenticated (e.g. `DELETE /api/venues/{id}/mcp`). Fine for a private beta; not fine at scale.
- Stale bndy-infrastructure repo contains an Aurora template with port 5432 open to 0.0.0.0/0 — verify those Sept-2025 stacks are torn down, then archive the repo.

---

## Structural fixes (1-2 weeks; do before scaling)

1. **Events: Query, don't Scan.** Add a GSI — pk `PUBLIC#<yyyy-mm>` (month buckets avoid a hot partition), sk `date` — and rewrite `handleGetAllPublicEvents` as a date-range Query. Denormalize `artistName/venueName/venueCity/artistImageUrl` onto the event at write time (already computed at creation) — this also kills the frontend overlay N+1 (RC3) outright.
2. **Map should be viewport-driven.** The backend geo endpoint (geohash6, parallel queries, slim projection) already exists — route the map through it + `/api/events/batch` instead of fetch-everything. Collapse the map's 3 queries into 1.
3. **CloudFront in front of api.bndy.co.uk** with a real cache policy for anonymous GETs (60-300s TTL, cache on query string, ignore cookies). Even 60s absorbs nearly all pan/zoom traffic. Put bndy-images behind CloudFront (or at minimum set immutable Cache-Control on upload).
4. **Artists browse rebuild**: react-query (staleTime 10min) + virtualized grid + single debounced memoized filter. Server-side: paginated endpoint.
5. **SSR hygiene**: move tenant detection out of root layout (middleware) so routes can be static/ISR; `Promise.all` venue+events; `revalidate: 60-300` instead of `no-store`; stop re-fetching in `generateMetadata`.
6. **Collaboration index** — write adjacency rows at event-create; kill the `contains()` scan per artist profile.
7. **External-id GSI/lookup table** — fixes runner import cost and aligns with build-008 G6 (geocode-before-find-or-create).
8. **SDK v3 migration** (all three lambdas bundle the full ~80MB aws-sdk v2 on nodejs20.x — the dominant cold-start cost) + esbuild bundling + arm64 in template.yaml.
9. **Get DynamoDB tables into IaC.** They exist only in the console: GSIs/billing/PITR unverifiable, unrecoverable if deleted, and it blocks the ADR-022 projection work.
10. One map engine: port `ArtistEventsMap` from Leaflet to the Mapbox marker kit it already half-imports; remove Leaflet.

## What's already good
Mapbox clustering + keyed diffed markers is well built; artist name search uses a proper GSI; react-query defaults are sane where it's used; search is debounced everywhere; images use next/image with AVIF/WebP; public routes skip auth middleware; everything lives in eu-west-2 (right region for the users).

## Sequencing
Week 1: all no-brainers (backend 1-7 are independent of frontend 8-12; ship in parallel). Week 2-3: structural #1-#3 (these three decide whether the platform survives 10-50× data). Then #4-#10 opportunistically. Re-measure after week 1 — the live numbers above are the baseline.
