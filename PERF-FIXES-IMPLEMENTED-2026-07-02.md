# Perf fixes implemented — 2026-07-02

All week-1 quick wins from PERFORMANCE-AUDIT-2026-07-02.md are implemented in the **working trees** of bndy-serverless-api and bndy-frontstage. **Nothing committed, nothing deployed** — both repos had your agents' uncommitted WIP on main/master, so I didn't touch git state. Zero user impact until you ship.

## What changed — bndy-serverless-api

New tested helpers, copied per-lambda (lambda-layers is charter-protected): `lib/http-response.js` (gzip + Cache-Control), `lib/scan-all.js` (paginated scan), `lib/batch-get.js` (BatchGetItem in chunks of 25 with UnprocessedKeys retry). 18 unit tests + 11 handler behavior tests, all green.

**events-lambda** — `handlers/public.js`: all public GETs (`/api/events/public`, `/geo`, `/api/venues/{id}/events`, `/api/artists/{id}/public-events`) now gzip when accepted + `Cache-Control: public, max-age=60`; `/api/events/batch` gzips. All `Promise.all(get)` joins → BatchGetItem (~25× fewer round trips). Collaborating-artists scan now paginates (was silently truncating at 1MB). `handler.js`: keep-alive HTTPS agent on the DynamoDB client (SDK v2 defaults to a new TLS handshake per call — this alone should visibly cut the venue endpoint's 10.8s since template.yaml env vars are off-limits to me).

**venues-lambda** — `handlers/venues-routes.js`: **removed the per-venue COUNT query N+1** (1,417 queries/request — the 10.8s; nothing consumes `eventCount`, verified across frontstage + backstage). Scan now paginates (was silently dropping venues past 1MB). Dropped `enrichment_data` blob from the list payload. Gzip + max-age=60. External-id lookup scan paginated. Keep-alive agent.

**artists-lambda** — `handler.js`: `GET /api/artists` scan now paginates (**you are at ~1.27MB — artists were about to start vanishing from the list**). Dropped `bio` from the list projection (detail endpoint still returns it; response keeps `bio: ""` so the shape is unchanged). Gzip added, 300s cache kept. External-id scan paginated. Keep-alive agent.

Test status: events 90/96 (6 pre-existing failures — 4 multi-artist create tests hitting your agents' uncommitted put-verification WIP, 2 calendar-tokens; both fail identically without my changes), venues 35/35, artists 39/39 (integration.test.js fails 11/11 on pristine code — pre-existing). I added a `batchGet` shim to multi-artist.test.js's aws-sdk mock.

## What changed — bndy-frontstage

`next.config.ts`: deleted the custom splitChunks (3MB vendors chunk on every route) and `optimization.sideEffects=false` (was disabling tree-shaking). `layout.tsx` + `MapView.tsx`: MapboxProvider moved off the root layout into the dynamically-imported MapView, so mapbox-gl only ships on the map route (singleton still survives navigation via `window.__BNDY_MAP__`; all `useMapbox` consumers are inside that tree — verified). `providers.tsx`: Google Maps no longer auto-loads on every page; both wizard steps already call `loadGoogleMaps()` on demand (verified). Context values memoized (MapboxContext, ViewToggleContext incl. stable `toggleTheme`, EventsContext). ServiceWorkerRegistration no longer deletes all CacheStorage on every page load (SW unregister kept). Deleted the orphaned legacy Leaflet tree `src/components/map/` (VenueModeIndicator relocated to `src/components/shared/`); removed its stale jest.mocks and the markercluster type decls. `package.json`: removed 11 dead deps (playwright, axios, supercluster, react-leaflet, leaflet.markercluster, @maptiler/*, @googlemaps/*, use-google-maps-script, use-places-autocomplete, @types for same); express → devDependencies. **Kept** use-debounce (wizard uses it — the audit overstated that one), leaflet (ArtistEventsMap), mapbox-gl, @types/google.maps.

Verification: `tsc --noEmit` clean for every file I touched (remaining errors are pre-existing stale test fixtures, e.g. `socialMediaURLs` vs `socialMediaUrls`). Jest can't run in my Linux sandbox against your Windows node_modules (SWC binary bus-error) — **run `npm test` on your machine before committing**. Note I ran `npm install --no-save @next/swc-linux-x64-gnu` which added extra platform binaries under node_modules/@next; harmless, not in package.json.

## You must do (in order)

1. **frontstage**: `npm install` (refreshes package-lock.json after dep removals — **Amplify's `npm ci` will fail without this**) → `npm test` → `npm run build` → eyeball the map, artist browse, venue page, wizard venue step locally → commit + push.
2. **serverless-api**: review diffs (isolated to events/venues/artists lambdas + new lib/ + test files), run the three suites, deploy the three lambdas via your usual flow. Deploy backend before or independently of frontend — response shapes are backward-compatible.
3. **template.yaml (charter: human-only — my diffs not applied):**
   - Rotate the Cognito client secret and replace lines ~500-501 with `{{resolve:secretsmanager:bndy/cognito-client-secret:SecretString}}` (same pattern as the JWT secret at line 83). It's plaintext in the repo, second audit in a row.
   - Optional now that keep-alive is set in code: `AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1'` under `Globals.Function.Environment.Variables`.
4. After deploy, re-measure against the baseline table in the audit report.

## Expected effect

`/api/venues`: 10.8s → ~1s (N+1 gone) and ~1MB → ~100KB on the wire (gzip). `/api/events/public`: payload ~10× smaller, joins ~25× fewer round trips (scan remains — that's the week-2/3 GSI fix). All public GETs cacheable 60s. Non-map routes: ~800KB gzip JS → target <200KB; no Google Maps script or mapbox-gl outside where they're used.

## Not done (next, per audit)

The events GSI (`PUBLIC#<month>`/date) + denormalised names — the fix that matters before scale; CloudFront in front of api.bndy.co.uk + bndy-images; artists browse react-query + virtualization; SDK v3/arm64/esbuild; tables into IaC. The unauth `/mcp` mutation endpoints still need a decision.
