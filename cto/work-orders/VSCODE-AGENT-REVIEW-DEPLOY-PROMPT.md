# PROMPT FOR VSCODE AGENT — review + deploy the bndy uniqueness gates

> Paste this file to the VSCode agent after the deep-audit task (or run in parallel — this touches code repos, not the audit).
> Change inventory + rationale: `Documents/Claude/Projects/bndy/GATE-IMPLEMENTATION-MANIFEST.md`
> Background: `Documents/Claude/Projects/bndy/IMPORT-SHUTDOWN-AUDIT-AND-GATE-PLAN.md`

The Cowork session has implemented backend duplicate-prevention gates as **uncommitted changes** in two repos. Your job: review, test, commit, deploy to live with the gate in log mode, and verify. Jason has approved this work; do not redesign it — flag concerns instead of rewriting.

## Scope of the uncommitted changes

- `C:\VSProjects\bndy-serverless-api` — `git status` will show: modified `template.yaml`, `artists-lambda/handler.js`, `events-lambda/{lib/event-data.js, handlers/crud.js, handlers/public.js, handlers/mcp.js, event-dedup.test.js}`, `venues-lambda/{lib/venue-deduplication.js, handlers/venues-routes.js}`, `events-agent-lambda/handler.js`; untracked NEW `shared/identity/` (4 files) + `{artists,events,venues}-lambda/lib/{identity.js, unique-gate.js}` (6 synced copies).
- `C:\VSProjects\bndy-MCPServer` — modified `src/utils/http-client.ts`, `src/tools/{create-artist,create-venue,create-event,search-venue}.ts`.
- Nothing else. bndy-signals/frontstage/backstage untouched. No commits, no deploys have been made.

## 1. Review

1. `git diff` both repos against the manifest's changed-files list — confirm nothing outside the list changed.
2. Key review points (the intent, so you can check the code matches):
   - Every create path for artists/venues/events writes record + sentinel(s) to `bndy-unique-keys` via `transactWrite` with `attribute_not_exists` (in `lib/unique-gate.js` → `gatedPut`). Behaviour switches on env `GATE_MODE`: `off` | `log` (default — logs `WOULD_BOUNCE`, still writes) | `enforce` (409 / returns existing venue).
   - `template.yaml`: new route `POST /api/artists/find-or-create` (the root-cause fix), new `UniqueKeysTable` resource (Retain), `GATE_MODE`/`UNIQUE_KEYS_TABLE` in Globals. **Check the YAML diff carefully** — this template has deploy history (2026-05-01 incident).
   - `mcp.js` allowedFields now maps `artistId` (and alias `artist_id`) to the real `artistId` attribute — the edit_event silent no-op fix.
   - `handleBulkImport` now calls `requireAuth`.
   - MCP `create-artist.ts` no longer falls back to `/api/artists/community` on 404 — fail closed. Confirm no other tool still references that fallback.
   - Venue scans paginated (`scanAll`) in `venue-deduplication.js` (two sites).
3. Run `node shared/identity/check-sync.test.js` and `node shared/identity/identity.test.js` (both should pass; 73/73 — already verified on this machine, re-confirm).

## 2. Test

1. `npm test` (jest) in: `artists-lambda`, `events-lambda`, `venues-lambda`, `events-agent-lambda`. Note: `events-lambda` `event-dedup.test.js` was already updated for the transactional write (4/4 passing on this machine). **If any other suite fails on a missing `transactWrite`/`delete` mock, extend that suite's DynamoDB mock the same way event-dedup.test.js does (transactWrite/delete resolving {}) — do not weaken the gate code to pass tests.**
2. MCP server: `npm run build` in `bndy-MCPServer` (tsc must be clean) and run its vitest suite if present.
3. `sam validate --lint` in bndy-serverless-api. Run the repo's route-verification script if present (CLAUDE.md guardrail: every declared route must have a handler).

## 3. Commit + deploy (only after 1–2 are green)

1. Commit the two repos with messages referencing the manifest (separate commits per repo; don't mix in the perf-fix changes if any are still uncommitted from 2026-07-02 — if the trees contain those, commit gates separately or ask Jason).
2. Deploy bndy-serverless-api per the repo's normal guarded process (`sam build && sam deploy` with its samconfig). The deploy creates `bndy-unique-keys` (PAY_PER_REQUEST) and ships everything with **GATE_MODE=log** — behaviour-preserving apart from: find-or-create route goes live, bulk-import now 401s anonymous callers, raw venue create returns the existing venue on place_id hit, edit_event artistId works.
3. Rebuild/restart the MCP server so the new tool code is live.

## 4. Post-deploy verification (all read-only or reversible)

1. `aws apigatewayv2 get-routes` — `POST /api/artists/find-or-create` now present.
2. POST a known-existing artist to find-or-create (e.g. name "The Glamz", location "Stoke-on-Trent", canCreate:false) → expect `action: matched` or `review`, HTTP 200, **no record created**.
3. POST `/api/ingest/bulk-import` with no auth cookie → expect 401.
4. `aws dynamodb describe-table --table-name bndy-unique-keys` → ACTIVE.
5. CloudWatch: watch events/artists/venues lambda logs for `UNIQUE-GATE UNAVAILABLE` (table/env misconfig — must not appear) and note any `WOULD_BOUNCE` entries (expected, that's the telemetry).
6. Report back: test results, deploy output, verification results, and any `WOULD_BOUNCE` sightings.

## Explicitly OUT of scope for this task
- Do NOT set GATE_MODE=enforce (that waits for sentinel backfill after dedup remediation).
- Do NOT re-enable any EventBridge rule or scheduled import.
- Do NOT touch bndy-signals (separate task will remove its 404-fallback + fix the BNDY_API_BASE_URL/BNDY_API_BASE env mismatch before runners ever restart).
- Deferred items list = manifest §"Deliberately NOT done". Leave them.

## Rollback
- Behaviour: set `GATE_MODE=off` in template Globals (or per-function env) and redeploy — gates become plain puts.
- Full: `git revert` the commits and redeploy. `bndy-unique-keys` is DeletionPolicy: Retain and harmless if orphaned.
