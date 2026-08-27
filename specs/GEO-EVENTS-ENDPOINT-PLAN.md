# Geo Events Endpoint — Design & Implementation Plan (Audit A1)

**Date:** 2026-07-11 · **Repos:** `bndy-serverless-api` (source of change) + `bndy-app` (adopts, does not bend)
**Principle:** the new frontend is the contract. Backend debt gets fixed; the frontend never adapts to backend slop.
**Deployment:** VSCode agent only, per repo guardrails (validate-deployment, verify-routes, 25-route limit).

---

## 1. Current state (surveyed 2026-07-11)

| Piece | State |
|---|---|
| `handleGetPublicEventsGeo` (events-lambda/handlers/public.js:169) | EXISTS — queries centre + 8 neighbour geohashes on `geohash6-date-index`, filters `isPublic`, returns lightweight events, `max-age=60` |
| Route in handler.js | `GET /api/events/public/geo` matched (line 84) — note path differs from the comment (`/api/events/geo`) |
| Route in template.yaml | **MISSING** — endpoint is unreachable. Only `/api/events/batch` is registered |
| `geohash6-date-index` GSI | **Not in template.yaml or the exported stack template** — presumed absent from the live table (verify below) |
| Geohash attributes on events | `computeGeohashFields` writes `geohash6/geohash4/geoLat/geoLng` on (some) create paths; **no backfill script exists** → older events lack the attributes and would be invisible to any sparse geo index |
| Granularity | geohash6 ≈ 1.2 km cells; a 3×3 block covers ~3.6 km — right for "walking distance", wrong for a city/regional map viewport |
| `POST /api/events/batch` | EXISTS and routed — batch join of events + artists + venues, cap 100. Good; the frontend detail-fetch can use it as-is |

**Verify on live infra before building (VSCode agent, read-only):**
1. `aws dynamodb describe-table --table-name bndy-events` → confirm which GSIs actually exist.
2. Sample 3 old + 3 recent events → do they carry `geohash4/geohash6/geoLat/geoLng`?
3. Route count on EventsFunction vs the 25-route limit (adding 1).

---

## 2. Frontend contract (fixed — this is what the backend must serve)

The map needs, per viewport + date window: `{ id, artistId, venueId, date, startTime, geoLat, geoLng }` — enough for pins, tonight-ring, clustering and count badges. Full details load on tap via `POST /api/events/batch` (already live). The gigs list page needs the same query at radius scale. Nothing else changes in `bndy-app`; hooks swap their internals only.

### Endpoint
```
GET /api/events/public/geo?bbox={west},{south},{east},{north}&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
→ 200 { events: LightEvent[], truncated: boolean }
   Cache-Control: public, max-age=60
```
- `bbox` (not raw geohash): the server owns the geohash strategy; the client speaks geography. This is the contract-stability move — precision changes never touch the client.
- Backward compat: keep accepting the existing `geohash` param (deprecated) since the handler already ships it.

## 3. Design

### 3.1 Index: sparse GSI `geohash4-date-index`
- PK `geohash4` (string), SK `date` (string) · Projection: INCLUDE `id, artistId, venueId, startTime, geoLat, geoLng, isPublic`.
- geohash4 ≈ 39 × 19.5 km cells. A city viewport = 1–6 cells; county = ~6–12. Each cell is one cheap `Query` with `date BETWEEN`.
- Sparse by nature: only items with `geohash4` appear → backfill (3.3) is mandatory, and its absence is why this rollout is ordered the way it is.
- The queried-but-absent `geohash6-date-index` is NOT created. One index, one strategy. If "within walking distance" becomes a feature, geohash6 attrs are already on items and a second GSI can be added then — that decision is deferred, not fudged.

### 3.2 Handler: bbox → cell cover → fan-out
1. Validate bbox (numeric, west<east, south<north, dates valid, window ≤ 400 days).
2. `ngeohash.bboxes(south, west, north, east, 4)` → cell list.
3. If cells ≤ 24: parallel `Query` per cell on `geohash4-date-index`, `FilterExpression isPublic = true`, merge, return `truncated:false`.
4. If cells > 24 (country-scale zoom): **do not fan out 700 queries.** Return the existing whole-window dataset path (today's `fetchGigs` query) from behind the 60s shared cache, `truncated:true`. Country view is one hot cacheable query; viewport view is the per-user path. Both are honest.
5. Response shape per §2; keep the lightweight mapping already in the handler, plus `startTime`.

### 3.3 Backfill: `events-lambda/backfill-geohash.js`
- Scan `bndy-events` where `attribute_not_exists(geohash4)`; join venue for lat/lng; write `geohash4/geohash6/geoLat/geoLng` via `computeGeohashFields`.
- `--dry-run` default (prints counts + sample), `--execute` to write; batched with backoff; idempotent. Mirrors existing repo script conventions (`backfill-start-time.js`).
- Events whose venue has no coordinates get logged to a report file, not silently skipped — that list feeds the venue-geocoding cleanup.

### 3.4 Template changes
- Add GSI to the `bndy-events` table definition **where the table is actually managed** (verify §1.1 first — if the table pre-dates SAM management, GSI is added via console/CLI by the VSCode agent and recorded in IaC as documentation).
- Register `GET /api/events/public/geo` on EventsFunction (both methods GET+OPTIONS as siblings do).

### 3.5 Tests first (repo is TDD)
- `lib/geo-query.test.js`: bbox validation, bbox→cell cover (incl. meridian/edge cases), cell-cap logic.
- `handlers/public.geo.test.js`: param validation, sparse-index mock returns, truncated path, isPublic filtering, response shape.
- Extend `public-perf.test.js` with a 6-cell fan-out timing assertion.

## 4. Frontend adoption (after backend is live & verified)
- `fetchGigsInView(bbox, window)` in `src/lib/api.ts`; MapView drives it from `map.getBounds()` + selected date window (moveend-debounced), keyed React Query cache per rounded-bbox+window.
- Gigs list uses radius→bbox from the chosen origin.
- Feature-flagged (`NEXT_PUBLIC_GEO_EVENTS=1`); the whole-table `fetchGigs` path stays as fallback until the flag has a week of clean production behind it, then dies.

## 5. Rollout order (each step gated on the previous)
1. VSCode agent: infra verification (§1) → report findings.
2. Me: tests + handler rework + backfill script + template edits (no deploy).
3. VSCode agent: `npm run validate` + `verify-routes` → create GSI → wait ACTIVE → run backfill dry-run → review → execute → deploy lambda.
4. Me: frontend adoption behind flag; Jason verifies on gigmap; flag on; retire old path.

**Explicitly not doing:** creating geohash6-date-index "because the code mentions it"; client-side geohash math; unbounded fan-out; backfill without dry-run review; any deploy from this session.

---

# v2 ADDENDUM — corrected survey + revised scope (2026-07-11, after live verification)

**Corrections to §1:** the endpoint IS live — route `/api/events/public/geo` registered (my grep pattern missed it), `geohash6-date-index` EXISTS and is ACTIVE (created outside IaC — should be recorded in the template as documentation). ~20% of events lack geohash fields. Scope shrinks accordingly; §3.2's handler is an amendment, not a rewrite.

**Answer to "is it a client-side issue":** no — `bndy-app` has never called the geo endpoint. It uses whole-window `GET /api/events`. Adoption is step 4 and waits on bbox support.

**On deferring geohash4 — the cell math says no, IF the map viewport is the goal:**

| Viewport | gh6 cells (~1.2km) | gh4 cells (~39km) |
|---|---|---|
| Walking distance, 3km | ~9 | 1 |
| Town, 10km | ~70 | 1–2 |
| City/region, 25km | ~440 | 1–4 |
| County, 60km | ~2,500 | 4–9 |

bbox→gh6 conversion alone only works for walking-distance radii; a city viewport explodes to hundreds of parallel queries. Since a GSI hash key needs equality (no prefix match), gh6 cannot serve gh4-scale queries. **geohash4-date-index is the piece that makes the map case possible — it's not optional if A1 is the goal.** It is, however, cheap: fields already exist on 80% of items, index creation is online, and the same backfill fixes both precisions (they're written together).

**Revised scope (agreed + amended):**
1. Handler: add `bbox` param (server-side conversion, adaptive precision): cover at gh6 if ≤12 cells → existing index; else gh4 → new index; else cached whole-window + `truncated:true`. Existing `geohash` param kept, deprecated.
2. Backfill `backfill-geohash.js` (gh4 + gh6 + geoLat/geoLng together), dry-run first, missing-coords venues reported not skipped.
3. `geohash4-date-index` GSI — required for viewport scale, created online by VSCode agent, recorded in IaC.
4. Record the existing gh6 GSI in template docs while we're there.
Tests-first and rollout gating per §3.5/§5 unchanged.
