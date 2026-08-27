# PROMPT FOR VSCODE AGENT — backend gates Phase 5 (post-cleanup, post-sentinels)

> Jason-approved 2026-07-28. Runs AFTER cleanup + sentinel backfill. Same integration rules as before: build into shared/identity + existing handlers, extend check-sync, tests first, no parallel layers. Runbook counterparts: MASTER-IMPORT-RUNBOOK v1.4 §0.16-0.18, §3.4, §5.5.

## G1 — Owner-protection gate (scope: OWNER-MANAGED records only)
Any artist/venue with `owner_user_id` set (non-null) is untouchable by non-owner writers:
- `PUT /api/artists/{id}/mcp`, `PUT /api/events/{id}/mcp` (for events whose artist is owner-managed), community edits, enrichment top-ups, `refresh-facebook-image`, `enrich` routes → **403 `code: OWNER_MANAGED`** when the target (or its parent artist) has an owner.
- Authenticated routes already scope by membership — unchanged.
- Records WITHOUT owners stay editable by MCP/imports (that's most of the directory) — do NOT over-block.
- Shared helper `isOwnerManaged(record)` in shared/identity; enforce in artists/venues/events lambdas.

## G2 — Server-side volume caps
Client-side 50/run caps are advisory. Add backend enforcement:
- Per-source daily create budget: count creates by `source` / externalIds source tag per UTC day (atomic counter item in bndy-unique-keys table: `cap#<source>#<yyyy-mm-dd>` with ADD + threshold check).
- Default cap 100 creates/source/day (env `SOURCE_DAILY_CAP`); exceeded → **429 `code: SOURCE_CAP_EXCEEDED`**, logged loud.
- Applies to artists+venues+events creates on unauthenticated routes; authenticated Backstage exempt.

## G3 — Daily integrity Lambda + GODMODE UI (Jason requirement: visible + actionable)
Backend:
- EventBridge daily (in-stack this time), scanning for:
  - **Orphan sentinels** (Fix #5b, 2026-07-29): scan ALL `event#`, `artist#`, `venue#` rows in bndy-unique-keys, verify each refId exists in bndy-events/bndy-artists/bndy-venues, report orphans (count + keys + refIds). Orphans indicate deletion via paths that didn't release sentinels (CLI cleanup, or deletion before sentinel release was added). Auto-delete orphans (same pattern as cleanup-orphan-event-sentinels.js one-off sweep).
  - **Dead references in events** (Fix #6c, 2026-07-29): scan ALL events in bndy-events, verify every artistId, artistIds[], collaboratingArtistIds[], and venueId exists in their respective tables. Report orphan events (count + event ids + dead reference ids). Orphans indicate artists/venues were deleted without checking for events first (pre-Fix #6b). Flag for manual review - do NOT auto-delete (these may be legitimate events needing artist/venue reassignment).
  - Orphaned events (all 3 artist fields + venueId)
  - Sentinel↔record drift (sentinel without record / record whose keys have no sentinel)
  - Same-name pairs where either lacks resolvable location
  - Slug-fallback region buckets (= missing city mappings)
  - Zero-event `ai_created` unclaimed artists >30d
  - Duplicate place_ids
  - NaturalKey collisions
- Writes results to a `bndy-integrity-reports` item (or S3 JSON) per day: counts + item lists + suggested action per finding class. NEVER auto-fixes anything EXCEPT orphan sentinels (safe to delete since the record is already gone).
Frontend (backstage/godmode):
- New godmode page: latest report, trend vs previous days, per-finding-class list with the records linked, and an "actioned/dismissed" flag Jason can set (stored server-side). Design to bndy skin standards; keep it read-only except the flags.
- API: `GET /api/integrity/latest`, `GET /api/integrity/history`, `POST /api/integrity/{findingId}/ack` (requireAuth, admin only).

## G4 — Provenance enforcement
Unauthenticated creates (artists/venues/events) must carry attributable provenance:
- Require non-empty `externalIds[{source,id}]` OR a known `source` value from an allowlist (`mcp_ai_import`, runner source ids, `frontstage`, `dropzone`).
- Missing/unknown → **422 `code: PROVENANCE_REQUIRED`** in enforce mode; log-mode warn until then.

## G5 — Already-deferred items (fold into this phase)
- events-agent v3 gate port (bulk-import PutCommands still ungated; auth landed).
- festivals-lambda: same sentinel + validation pattern.
- `updateVenuePlaceId` + `PUT /api/venues/{id}` place_id changes: transactional sentinel re-claim (claim new, release old).
- Event `status` field (confirmed/cancelled/postponed) + public filtering — this is the backend for runbook §0.17 (source-dropped gigs get status=cancelled, never deleted).

## Order
G5 event-status + G1 first (they protect data), then G3 (visibility), then G2/G4 (throttles). Each: tests → commit → deploy per repo guardrails → verify → report.
