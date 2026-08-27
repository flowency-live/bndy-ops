# Geo Events Endpoint — Review & Deploy Handoff

**For:** VSCode agent · **From:** Claude (Cowork session) · **Date:** 2026-07-11
**Repo:** `C:\VSProjects\bndy-serverless-api` (all changes uncommitted, in working tree)
**Design doc:** `Projects/bndy/GEO-EVENTS-ENDPOINT-PLAN.md` (read v2 addendum) · **Audit item:** A1 in `BNDY-APP-PRODUCTION-AUDIT.md`
**I did not deploy anything.** Deployment is yours, per repo guardrails.

---

## 1. What changed (4 files, events-lambda only)

| File | Change |
|---|---|
| `lib/geo-query.js` | **NEW.** Pure functions: `parseBbox`, `validateDateWindow` (≤400-day window), `planBboxQuery` (adaptive precision: gh6 index if cover ≤12 cells, gh4 index if ≤24, else fallback). Includes `estimateCells` span-estimator so country-scale bboxes are rejected *without* materialising ~750k gh6 cells. |
| `lib/geo-query.test.js` | **NEW.** 16 tests incl. a timing assertion that fallback planning never allocates the big cover. |
| `handlers/public.js` | `handleGetPublicEventsGeo` amended: accepts `bbox=west,south,east,north` (new primary contract); legacy `geohash` param kept working (centre+8 neighbours, gh6). Fallback path uses `scanAll` whole-window scan with `truncated:true` — bounded fan-out always. Response adds `startTime` and top-level `truncated`. One new import line. **No other handler touched.** |
| `handlers/public.geo.test.js` | **NEW.** 9 behaviour tests: validation 400s, legacy path (9 gh6 queries), walking→gh6 / city→gh4 / country→scan fallback, isPublic + date-window on every query, light response shape (no private fields), cache headers. |
| `backfill-geohash.js` | **NEW.** Dry-run by default; `--execute` writes `geohash4/geohash6/geoLat/geoLng` (via existing `lib/geohash.computeGeohashFields`, venue `latitude`/`longitude`). Paginated scan, venue cache, 10-way concurrency, throttling backoff, writes `geo-backfill-report.json`. Venues without coords are **reported, not skipped** — that list feeds venue-geocoding cleanup. |
| `DEPLOYMENT.md` | Appended deploy-handoff section incl. exact GSI CLI. |

**API contract (what bndy-app will call):**
```
GET /api/events/public/geo?bbox=W,S,E,N&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
→ 200 { events: [{id, artistId, venueId, date, startTime, geoLat, geoLng}], truncated: boolean }
   Cache-Control: public, max-age=60 (gzip via jsonResponse when >1KB)
```
No route changes needed — `/api/events/public/geo` is already registered and live.

## 2. Test status

- `npx jest lib/geo-query.test.js handlers/public.geo.test.js handlers/public-perf.test.js` → **31/31 pass**
- Full `npx jest` in events-lambda → **115 pass / 7 fail** — the 7 are in `multi-artist.test.js` (4), `event-dedup.test.js` (1), `calendar-tokens.test.js` (2). These are in **your** WIP areas, not the geo work. See §5 — you must confirm whether they pre-date today.

## 3. Review checklist (suggested)

- [ ] `git diff events-lambda/lib/geo-query.js events-lambda/handlers/public.js events-lambda/backfill-geohash.js`
- [ ] Confirm gh4 GSI cell caps (12/24) are acceptable query fan-out for your RCU budget
- [ ] Confirm fallback = whole-window `scanAll` behind 60s shared cache is acceptable at country zoom (it's what every request does today)
- [ ] Backfill: review `FilterExpression`, concurrency 10, retry policy
- [ ] Run the 3 geo test suites yourself

## 4. Deploy order (each step gates the next)

1. **Create GSI** `geohash4-date-index` on `bndy-events` (online, no downtime — exact CLI in `events-lambda/DEPLOYMENT.md`). Wait for `IndexStatus: ACTIVE`.
2. **Backfill:** `node backfill-geohash.js` (dry-run) → review counts + report → `--execute`. Expected candidates ≈ 20% of events per your earlier verification. Send Jason the `missingCoords` list.
3. `npm run validate` + `node scripts/verify-routes.js` → **deploy EventsFunction**.
4. **Smoke:** city bbox `?bbox=-2.4,52.9,-2.0,53.15&startDate=<today>&endDate=<+14d>` → 200, `truncated:false`, events present · UK bbox `?bbox=-8,50,2,59&...` → `truncated:true` · legacy `?geohash=gcqrs4&...` still 200.
5. Record **both** geo GSIs (existing gh6 + new gh4) in IaC/template docs — the gh6 one being undocumented is what derailed the first survey.
6. Report done → Claude wires bndy-app adoption behind `NEXT_PUBLIC_GEO_EVENTS=1`.

## 5. ⚠️ Incident during this session — action required from you

Mid-session, **four files were truncated on disk by the Windows↔sandbox mount sync** (files Claude never wrote): `handlers/public.js`, `handlers/crud.js`, `handlers/mcp.js`, `lib/event-data.js`. All four were repaired by re-attaching the missing tails from git HEAD (syntax-checked, suite-verified). Two caveats:

1. **`handlers/mcp.js`** — the cut landed inside your *uncommitted* edit region. Your `updateArtistEventCounts(...)` addition in `handleLeaveEvent` survived; the function's completion was restored from HEAD. If you had further edits below that point, they are lost — please re-verify `handleLeaveEvent` and everything after line ~460.
2. **`handlers/public.js`** — cut at ~line 1009 inside the community-create response object; tail restored from HEAD. Your uncommitted multi-artist edits above the cut survived. The 4 failing `multi-artist.test.js` tests may be your normal mid-TDD state **or** lost tail-edits — please confirm against your intent.

**Mitigation going forward: commit early, commit often in both repos.** The corruption only ever destroys uncommitted work. Recommend committing Claude's geo changeset and your WIP as separate commits immediately after review.
