# Gate implementation — changed-files manifest (2026-07-27)

**Status: implemented UNCOMMITTED in the working trees. NOT deployed. Tests below. Review before commit/deploy.**
Written by the Cowork session in parallel with the VSCode agent's Part B data audit. Companion: `IMPORT-SHUTDOWN-AUDIT-AND-GATE-PLAN.md`.

## What's implemented

**Hard uniqueness gate** (sentinel items in new table `bndy-unique-keys`, written in one `TransactWriteItems` with `attribute_not_exists` alongside the entity record):
- Venue UID `venue#gplace#<google_place_id>` — on both create paths (find-or-create L4 + raw `POST /api/venues`, which also now does an advisory existence check and returns the existing venue instead of creating)
- Artist UID `artist#<normalise(name)>#<region_bucket>` + `artist#fb#<facebook_key>` — on both create paths (community + authenticated Backstage)
- Event UID `event#<sha1(venueId|artistId|date)>` per artist incl. collaborators; OPENMIC+startTime key for artist-less public events (closes the open-mic skip-hole) — on all three create sites in events-lambda
- Delete paths release sentinels (artist ×2, venue ×2, event MCP delete)
- MCP event **update** paths now re-check duplicates when artist/venue/date changes (bounce in enforce mode)

**Modes** — env `GATE_MODE` (in template Globals): `off` | `log` (default; collision telemetry, still writes) | `enforce` (409 bounce). Flip to `enforce` only after Phase-4 sentinel backfill. Missing `bndy-unique-keys` table degrades to a loud warning + ungated write.

**Phase 0 fixes**
- `template.yaml`: **`POST /api/artists/find-or-create` route added** (root-cause F1) + `UniqueKeysTable` resource (Retain) + `GATE_MODE`/`UNIQUE_KEYS_TABLE` globals
- `events-lambda/handlers/mcp.js`: **F5 fixed** — `artistId` now maps to the real attribute (with `artist_id` back-compat alias + double-send guard)
- `events-agent-lambda/handler.js`: **F6 fixed** — `requireAuth` on `handleBulkImport`
- `venues-lambda`: **F2 scan pagination fixed** in the dedup ladder + integration route (uses existing `scanAll`)

**Shared identity library** — `shared/identity/identity.js` (canonical) + byte-identical copies in each lambda's `lib/` enforced by `shared/identity/check-sync.test.js`. Implements the runbook recipes exactly: normalise (incl. leet-fold, apostrophe removal, act-qualifier stripping per ADR-023), whitespace-free identity key (Star Breaker≡Starbreaker), coarse region buckets (Newcastle-under-Lyme≠Newcastle upon Tyne; bare "UK"/empty = UNKNOWN which never matches and can't create in enforce mode), facebook_key canonicalisation (profile.php id preserved), event natural key with strict date normalisation, editDistance/isNearMiss for the resolver's review pass.

**MCP server (fail closed)**
- `http-client.ts`: structured `ApiError` (real status + parsed body) — no more substring-matching error text
- `create-artist.ts`: **404→community fallback DELETED** (root cause of artist pollution). 409 → "use existing id" with the id; 404 → stop the import
- `create-venue.ts`: caller-supplied `googlePlaceId`/lat/lng now honoured (no re-geocode); address included in the Places query; 409 handled
- `search-venue.ts`: address-less venues no longer invisible (name-similarity fallback ≥60)
- `create-event.ts`: `ai_created`/`needs_review` now actually sent; 409 parsed from structured body

## Changed files

### bndy-serverless-api (NEW)
- `shared/identity/identity.js` + `identity.test.js` (73 checks) + `unique-gate.js` + `check-sync.test.js`
- `artists-lambda/lib/identity.js`, `artists-lambda/lib/unique-gate.js` (synced copies)
- `events-lambda/lib/identity.js`, `events-lambda/lib/unique-gate.js`
- `venues-lambda/lib/identity.js`, `venues-lambda/lib/unique-gate.js`

### bndy-serverless-api (EDITED)
- `template.yaml` — route F1, UniqueKeysTable, gate env
- `artists-lambda/handler.js` — gate on both creates, 422 LOCATION_UNRESOLVABLE (enforce), sentinel release on both deletes
- `events-lambda/lib/event-data.js` — `eventGateKeys`/`putEventGated`/`releaseEventSentinels`
- `events-lambda/handlers/crud.js` — gated create
- `events-lambda/handlers/public.js` — gated create ×2 (public-gig + community)
- `events-lambda/handlers/mcp.js` — F5 artistId fix, update duplicate-guard, delete sentinel release
- `venues-lambda/lib/venue-deduplication.js` — paginated scans, gated L4 create (returns existing venue on bounce)
- `venues-lambda/handlers/venues-routes.js` — raw create: existence check + gate; delete releases sentinel
- `events-agent-lambda/handler.js` — requireAuth on bulk-import

### bndy-MCPServer (EDITED)
- `src/utils/http-client.ts`, `src/tools/create-artist.ts`, `src/tools/create-venue.ts`, `src/tools/create-event.ts`, `src/tools/search-venue.ts`

## Verification done / NOT done

DONE: identity test suite 73/73 (incl. runbook corpus: Ant Clowes Duo≡Ant Clowes, 8Ts Band≡8Ts, Not Guilty Stoke≠Yorkshire, Damiain→near-miss-review-not-merge, Star Breaker≡Starbreaker, both Newcastles distinct); `node --check` on every edited JS file; `tsc --noEmit --strict` clean on every edited TS file; check-sync green; committed file sizes verified against container copies (mount byte-clamp gotcha).

NOT done (needs device/CI): the lambdas' existing jest/vitest suites (deps live on the device); SAM template validation (`sam validate`); any deploy. **`event-dedup.test.js` will need updating** — it mocks `dynamodb.put`, and community creates now go through `transactWrite` (mock must handle `transactWrite` or set `GATE_MODE=off` in test env). `sam validate --lint` before any deploy per CLAUDE.md guardrails.

## Deliberately NOT done (deferred, in order)
1. **events-agent v3 gate port** — bulk-import/approve still write via v3 `PutCommand` ungated (auth now required though). Port `unique-gate` to SDK v3 or route its creates through the lambdas' HTTP APIs. Its `resolveArtist` should call `/api/artists/find-or-create` once deployed.
2. **signals `HttpBndyWriteClient.ts` L156 404-fallback removal** — runners are disabled so it can't fire; MUST be removed before re-enabling any source. (Left untouched to avoid colliding with the VSCode agent working in that repo.) Also fix `createDependencies.ts` reading `BNDY_API_BASE_URL` while the CDK stack sets `BNDY_API_BASE` (runners currently fall through to the hardcoded prod default — make dev stacks point at a dev API).
3. **Sentinel backfill script** (Phase 4) — blocked on the deep audit + dedup remediation; then write sentinels for all clean records and flip GATE_MODE→enforce.
4. **GSIs** (`google_place_id-index`, artist slug, `facebook_key`) — perf, not correctness; the sentinel gate is the correctness layer. Out-of-band creation (tables aren't in the SAM stack).
5. **`updateVenuePlaceId`** (events-agent) can still point two venues at one place_id — gate its place_id write when porting the v3 gate.
6. **Festivals** — create is unauthenticated with advisory slug-suffixing only; apply the same pattern after the core three are proven.
7. **Backstage/dropzone UX** for friendly 409/422 handling (backend bounces regardless).

## Deploy order (when Jason says go)
1. `sam validate --lint` + run lambda test suites on device (fix event-dedup.test mocks)
2. Deploy with `GATE_MODE=log` (default) — creates behave as today + telemetry; find-or-create route goes live, which alone fixes artist imports; MCP server rebuild (`npm run build`) + restart
3. Watch `WOULD_BOUNCE` logs for a few days → backfill sentinels → `GATE_MODE=enforce`
