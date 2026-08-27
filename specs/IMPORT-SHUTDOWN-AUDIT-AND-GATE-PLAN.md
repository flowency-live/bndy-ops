# bndy — Import Shutdown, Duplicate Audit & Backend Gate Plan

**Date:** 2026-07-27 · **Author:** Claude (Cowork session) · **Status:** STOP-ALL-IMPORTS in effect pending gates
**Companion doc:** `VSCODE-AGENT-DEEP-AUDIT-PROMPT.md` (feed to the Dynamo-CLI VSCode agent)

---

## 0. Executive summary

Every automated importer has been polluting the database because **the backend has zero enforced uniqueness — every "gate" in the system is advisory read-then-write application logic, and the strongest gate (the artist find-or-create resolution ladder) is unreachable in production.** The single most damaging finding: `POST /api/artists/find-or-create` — ~500 lines of tested ADR-014/021/023 matching logic — **is not declared in `template.yaml`, so API Gateway 404s it**, and both the MCP server and the signals runners are coded to **fall back to `POST /api/artists/community` on 404 — a route with no dedup at all**. Every automated artist create has been going through the no-dedup door, one new record per import attempt.

Venues and events have the same disease in different forms: `POST /api/venues` requires a Google Place ID but **never checks whether that place_id already exists**; the venue dedup ladder's table scan is **unpaginated (silently truncated at 1 MB)**; event dedup has skip-holes and is keyed on `venueId`, so venue duplication cascades directly into event duplication. Nothing anywhere uses a DynamoDB `ConditionExpression` or transaction — there is not one atomic uniqueness constraint in the entire write surface.

The fix is three enforcement layers per entity, so that **even if a client's logic is wrong, the database bounces the write**:
1. **Hard DB constraint** — uniqueness sentinel items written in a `TransactWriteItems` with `attribute_not_exists`, keyed on: venue = `google_place_id`; artist = `normalise(name) + '#' + region_bucket`; event = `sha1(venueId|artistId|date)` per artist.
2. **Single resolver choke point per entity** — all creates funnel through find-or-create; direct-create routes closed or delegated.
3. **Route hygiene** — wire the missing route, auth the unauthenticated bulk route, kill the 404→blind-create fallbacks (fail closed, never fall back to a no-dedup path).

The existing runbook logic (normalisation recipe, ADR-023 acts model, region rules, FB-URL identity, keeper rules) is **good and is preserved** — it becomes the application layer *in front of* the hard constraint, not a replacement for it.

---

## 1. Import-path inventory & stop status

| # | Path | What it is | Status | Who stops it |
|---|------|-----------|--------|--------------|
| 1 | **Desktop Cowork scheduled tasks** — KLMA daily, onthecase-daily-import (18:00), gigs-news daily, sceniceye weekly, fb-artist-image-enrichment (01:00) | Chrome-read + MCP-write sessions on Jason's machine. Snapshot files show runs through **21 Jul** (KLMA) and **26 Jul** (FB images) | ⚠ **JASON must pause** — these live in the desktop app; this cloud session cannot see or disable them (verified: the account's cloud scheduler holds only 3 expired one-off reminders, none import-related) | Jason, desktop app |
| 2 | **AWS EventBridge rules** (bndy-signals `SourceRunnerStack`, `enabled: stage === 'prod'`) — `bndy-klma-schedule-prod` 08:00 UTC, `bndy-onthecase-schedule-prod` 03:05 UTC, `bndy-gigs-news-schedule-prod` 08:00 UTC, `bndy-sceniceye-schedule-prod` 08:30 UTC, **plus** `bndy-intelligence-pass-s3-trigger-prod` (fires on any `*/run.json` landing in the signals bucket — not schedule-based, `DRY_RUN=false` in prod, writes to live API via Bedrock-driven decisions) | Cloud-side runners, independent of the desktop | ⚠ **NOT verified whether the prod stack is actually deployed.** Disable commands are in the VSCode-agent prompt (Part A). Note: a console disable is drift — the next `cdk deploy` re-enables; the durable fix is `enabled: false` in `source-runner-stack.ts` | VSCode agent (has AWS CLI) |
| 3 | **MCP server (bndy-events tools)** — used by me and any AI session | All tools hit `https://api.bndy.co.uk` hardcoded, unauthenticated | ✅ **I will make no create/edit/bulk calls** from this session until gates are live. But this is policy, not enforcement — any other session can still call them | Backend gates (this plan) |
| 4 | **Unauthenticated public API routes** — `POST /api/artists/community`, `POST /api/venues`, `POST /api/venues/find-or-create`, `POST /api/events/community`, **`POST /api/ingest/bulk-import` (no `requireAuth` — the only handler in events-agent-lambda missing it)**, `PUT /api/*/mcp` routes | Open to anyone on the internet, not just our importers | ❌ **Open until gates land.** Bulk-import auth fix is a one-line change and should ship first | Backend gates |
| 5 | **Signals source-runner writers** | The *well-behaved* client: `canCreate:false` on artists+venues (match-or-review, never create), find-or-create routes, event create relies on server dedup. Residual risks: the artist 404→community fallback; `stage` does not isolate the API — a dev-stack runner still points at `https://api.bndy.co.uk` (live) | Stopped when #2 is disabled | VSCode agent |

**Dev/prod hazard worth its own line:** `source-runner-stack.ts` L52 defaults `bndyApiBase = 'https://api.bndy.co.uk'` with no stage switch. Any manual invoke of a *dev* runner writes to *production* bndy. (Not verified whether the bin entrypoint overrides this — flagged for the VSCode agent.)

---

## 2. Root-cause findings (ranked)

### F1 — The artist gate is dead code: route missing from template.yaml ⚠ SMOKING GUN
`handleFindOrCreateArtist` (artists-lambda/handler.js:1983, routed in code at :396) implements the full ADR-014/021/023 ladder — slug normalisation, multi-prefix candidate search, similarity + shared-token scoring, footprint (venue-region) disambiguation, margin guards, matched/review/created contract — with a 499-line test suite. **But `template.yaml` never declares `POST /api/artists/find-or-create`** (its `ArtistsFunction` events list has 13 routes; find-or-create is not one — contrast venues, which declares it at L445-450). API Gateway therefore 404s the route.

Both automated clients then do exactly the wrong thing:
- **MCP** `create-artist.ts` L53: `if (err?.message?.includes('404'))` → `POST /api/artists/community`. (Substring test on the error *body* — even a 500 whose body mentions "404" triggers it.)
- **Signals** `HttpBndyWriteClient.ts` L156: `status === 404` → same fallback (its own comment: *"This route always creates (no dedup) — use with caution"*).

`handleCreateCommunityArtist` (:1541) validates only that name and location are non-empty — its error string literally says `'Location is required to prevent duplicates'` — **then never compares location (or anything) against any existing record**. Plain `put`, no condition. Every automated artist create since the fallback shipped has gone through this door.

### F2 — Venue place_id is required but not unique
- `POST /api/venues` (`handleCreateVenue`, venues-routes.js:431, unauthenticated): rejects a missing `googlePlaceId` (422) — then does **zero** dedup. POSTing a place_id that already exists creates a second venue with the same `google_place_id`. The one field ADR-018 treats as venue identity is checked for presence, not uniqueness.
- The find-or-create ladder's candidate load is **`dynamodb.scan` with no pagination** (venue-deduplication.js:89-94; same at :510). DynamoDB scans cap at 1 MB per call — beyond that, the ladder matches against a silent partial set. At 1,437 venues with enrichment blobs this is very plausibly truncating **today** (the event-data.js scan paginates correctly, so the pattern was known and just not applied here).
- **No GSI exists on `bndy-venues` at all** — place_id lookup can only scan.
- MCP `create_venue` **discards** caller-supplied `address`, `googlePlaceId`, `latitude`, `longitude` (accepted in schema, never read), geocodes only `"name, city"`, and blind-takes Google `candidates[0]` with no confidence floor → near-miss queries yield a different place_id → server sees no match → new venue.
- MCP `search_venue` **drops every venue with an empty address** (L26) — those venues are permanently unfindable to importers, so each import re-creates them. (This plus the "address-as-venue-name" stub pattern in the June venue report explains most venue dupes.)
- `updateVenuePlaceId` (events-agent) and `PUT /api/venues/{id}` can point two venues at one place_id with no check.

### F3 — Nothing is atomic
`grep ConditionExpression` across artists-lambda and venues-lambda write paths: **zero hits**. No `TransactWriteItems` anywhere in the repo. Every dedup check that does exist is check-then-put — two concurrent importer requests (KLMA and gigs-news fire at the *same minute*, 08:00 UTC) both pass the check and both write. Events-agent even computes `naturalKey = sha1(venueId|artistId|date)` (handler.js:869-873), **stores it on the item, and never uses it for anything**. The uniqueness key already exists in the data; nothing enforces it.

### F4 — Event dedup has holes and inherits venue duplication
`checkForDuplicateEvent` (event-data.js:147) does check (artist, venue, date) via `venueId-date-index` — but:
- Skipped entirely when `venueId` absent (crud.js:87) and when `artistIdsList` empty (public.js:861 — i.e. every open-mic on the unauthenticated community route).
- **Keyed on `venueId`** — the same real gig imported against two duplicate venue rows lives in two index partitions and never collides. Venue dupes cascade into event dupes.
- `date` matched as exact string; format drift bypasses.
- externalId dedup runs **only** on `/api/events/community`; the two authenticated create paths never check it.
- **Update paths have no dedup at all** — an event can be *edited into* being a duplicate (crud.js:322, mcp.js:135 both allow `date` and `venueId` changes unchecked).
- The audit JSON's 13 duplicate-event groups (identical artistId+venueId+date+title) prove the advisory check is not holding for all writers.

### F5 — `edit_event(artistId)` silent no-op: root cause found
`events-lambda/handlers/mcp.js:167` — the allowed-fields map contains `'artist_id': 'artist_id'` while the actual attribute (and GSI hash key) is **`artistId`**. Send `artist_id` → writes a useless orphan attribute, returns 200, nothing changes. Send `artistId` → not in the map → silently dropped (200 if other fields present). The comment on that line reads *"Reassign event to different artist (for merging duplicates)"* — **the one tool built to fix artist duplicates is the tool that doesn't work**, and it's what orphaned the 33+97 events during dedup. Fix: `'artistId': 'artistId'` (+ keep `'artist_id'` as an alias mapping to `artistId`).

### F6 — Anonymous bulk write
`POST /api/ingest/bulk-import` (events-agent handler.js:1025) is **the only handler in that lambda that never calls `requireAuth`** — anonymous, unlimited, direct `PutCommand` writes to `bndy-artists`, `bndy-venues`, `bndy-events`, bypassing every other lambda's logic. Its `resolveArtist` matches by **exact normalised name only** over a full HTTP artist list (no fuzzy, no article/suffix strip → any spelling variant = CREATE_NEW), and its `resolveVenue` compares `v.googlePlaceId` (camelCase) against the Places result — if the list API actually emits `google_place_id`, that comparison is always false and **every venue resolves to CREATE_NEW** (needs verification, flagged to VSCode agent).

### F7 — Client-side flag and threshold drift
- MCP `create_event` sends **no `ai_created` / `needs_review`** (while telling the calling LLM it set them) — MCP events are invisible to any review queue keyed on those flags; filter on `source = 'mcp_ai_import'` instead.
- MCP 409 handling exists only on `create_event`, via a fragile regex; `create_venue`/`create_artist`/`bulk_import` can't distinguish "duplicate" from "outage".
- `search_artist` default `minConfidence 50` returns false negatives on exact matches (recorded 2026-07-09); the runbooks already say re-search at 25 + bare-core — but this is prompt discipline, which is exactly what the hard gate makes non-load-bearing.

### F8 — Route/template drift
`POST /api/events`, `PUT/DELETE /api/events/{id}`, `POST /api/venues/community` are declared in template.yaml with **no matching handler branch** (404s), while `/api/artists/find-or-create` and the acts routes exist in code with no template entry. The declared-vs-deployed surface has drifted in both directions. (Deployed API Gateway not directly verified from here — VSCode agent Part A confirms.)

---

## 3. Damage assessment (as of the 2026-07-09 audit — a FRESH audit is Part B of the VSCode prompt)

From `full-audit-report.json` (scan ≥ 2026-07-09) — **numbers are 18 days stale; imports have run since**:

| Metric | Value |
|---|---|
| Artists / Venues / Events | 2,108 / 1,437 / 4,584 |
| Duplicate artist name groups | **54 groups = 112 records (58 excess)** — and this matcher is *weaker* than the runbook normalise recipe (misses Star Breaker/Starbreaker, Damien/Damiain, Ant Clowes/Duo), so the true count is higher |
| Duplicate event groups (identical artist+venue+date) | **13** (12 pairs + 1 triple) |
| Orphaned events (dead artistId / collaboratingArtistIds) | **97** across 74 dangling artist IDs — largely caused by F5 during the July dedup |
| Orphaned events (dead venueId) | 2 (incl. `Integration Test Event` dated 2099-12-31 — test data in prod) |
| Zero-event artists | 374 (17.7%) — clustered in bulk-import bursts |
| Artists with no usable location | **331** (224 blank + 107 "UK"); only 12 geocoded — this blocks the artist UID until backfilled |
| Venue dupes | 6 same-address groups in the JSON, but the June venue report found 18 Tier-1 + Tier-2 pairs; address-string matching also false-positives (Millers Bar vs New Mills FC share an address) — confirming **place_id, not address, is the UID** |

Known post-07-09 pollution (from memory): sceniceye 2026-07-12 run created Emily Martine / Peludo Beach / The Shadders ×2 artists + ×2 live events and Golden Lion Havant ×2 — i.e. the bleeding continued right up to the shutdown.

---

## 4. The gates — design

Principle (your words, now the spec): **even if a client's logic seems good, the backend bounces the write if its assumptions are wrong.** Three layers per entity; the DB constraint is the one that cannot be talked around.

### 4.1 Hard DB constraints (Layer 0 — the floor)

All three core tables are `PK: id` with no sort key, so business-key uniqueness uses **sentinel items**: alongside each real record, a marker item whose `id` *is* the business key, written in one `TransactWriteItems` with `ConditionExpression: attribute_not_exists(id)`. Any second create — from any client, any bug, any race — throws `TransactionCanceledException` → HTTP 409 with the existing entity's id. No new tables required (a separate `bndy-unique-keys` table is a clean variant; same semantics — decide at build time).

| Entity | Sentinel id | Notes |
|---|---|---|
| Venue | `uniq#venue#gplace#<google_place_id>` | **Totally impossible to duplicate**, per your ruling. Collision returns the existing venue (200, `matchMethod: google_place_id`) — find-or-create semantics preserved. |
| Artist | `uniq#artist#<identity_key>` where `identity_key = normalise(name) + '#' + region_bucket` | Your ruling: **name + performing location IS the UID.** Same name in a *different non-empty* region = legitimately distinct (Not Guilty Stoke vs Yorkshire) — different sentinel, allowed. Same name where either side lacks a region = **review, never create** (empty never matches, empty never creates). |
| Event | `uniq#event#<sha1(venueId '|' artistId '|' date)>` — one sentinel **per artist** incl. `collaboratingArtistIds` | `generateNaturalKey` already exists (events-agent handler.js:869) — promote it to the shared lib and actually use it. Open-mic/no-artist events key on `sha1(venueId|OPENMIC|date|startTime)` so the skip-hole closes. Delete/merge must delete sentinels in the same transaction. |

`normalise(name)` and `region_bucket` are the **existing runbook recipe, unchanged** (artist-identity-gate-plan.md §1): lowercase → `&`→`and` → strip punctuation/apostrophes → strip leading "the " → strip trailing {band, duo, trio, acoustic, live, music, uk} → collapse whitespace → leet-fold; region canonicalised to coarse buckets (Staffs, NE, Hants, NW…), stoke-on-trent/staffordshire/newcastle-under-lyme collapse to one. **One shared library** (`lib/identity.js` in serverless-api, published so MCP/signals import the same code) — never re-implemented per caller.

### 4.2 Resolvers as the only doors (Layer 1)

- **Artist:** add `POST /api/artists/find-or-create` to template.yaml (~6 lines — resurrects the whole tested ladder). Then make `POST /api/artists/community` internal-only: the route either disappears or redirects into the resolver. `handleCreateArtist` (authenticated Backstage) also funnels through the resolver. The resolver's `created` outcome performs the Layer-0 transactional write; `review` writes nothing and returns candidates. FB-URL exact match (normalised: strip trailing slash, `/about`, query, lowercase host) checked **first** as strongest identity signal → new GSI `facebook_key`.
- **Venue:** `handleCreateVenue` delegates to `handleFindOrCreateVenue`; the ladder keeps L1 place_id → L2 geo+name → L3 name+address → L3.5 geocode — but L1 becomes a **query on a new GSI `google_place_id-index`** (bndy-venues currently has *no* GSI; this also kills the unpaginated scan). Scan pagination fixed regardless. L4 create = Layer-0 transaction. `updateVenuePlaceId` and `PUT /api/venues/{id}` place_id changes go through the same sentinel (claim new key transactionally, release old).
- **Event:** `assertEventUniqueness()` in `lib/event-data.js`, called from **all four** create sites and **both** update paths (updates that change artist/venue/date must re-claim sentinels transactionally). Keep `checkForDuplicateEvent` as the friendly pre-check that returns `existingEventId` in the 409 body; the transaction is the backstop for races.

### 4.3 Route & client hygiene (Layer 2)

1. `requireAuth` on `POST /api/ingest/bulk-import` (one line), and point its `resolveArtist`/`resolveVenue` at the real resolvers instead of exact-name-over-HTTP.
2. **Delete the 404→community fallbacks** in MCP `create-artist.ts` and signals `HttpBndyWriteClient.ts`. Fail closed: resolver unreachable = error surfaced to the operator, never a blind create.
3. MCP `create_venue`: honour caller-supplied `googlePlaceId`/`address`/coords; pass address into the Places query; stop blind-trusting `candidates[0]` (require name-similarity agreement with the top candidate or return review).
4. MCP `search_venue`: stop dropping address-less venues.
5. MCP: proper 409 handling on all four write tools (structured `{code:'DUPLICATE', existingId}` from the server, no regex parsing); send `ai_created`/`needs_review` honestly on events.
6. Fix `mcp.js:167` (`artistId`) — first, it's one line and unblocks cleanup.
7. Reconcile template↔handler drift (dead routes both directions); CI check that every declared route has a handler and vice versa (CLAUDE.md rule #5 automated).
8. Backstage/dropzone forms: location mandatory; inline collision UX ("A 'Not Guilty' already exists in Stoke — same act?") with Create-as-new enabled only when both records have distinct non-empty regions. The backend bounces regardless — the UX just makes the bounce friendly.

### 4.4 Standing guardrail (Layer 3)

Daily integrity Lambda (EventBridge, in-stack this time): same-normalised-name pairs where either lacks location; same-name-same-region pairs; sentinel↔record consistency; events whose artistId/collaboratingArtistIds/venueId don't resolve; naturalKey collisions. Alerts on any day the count is non-zero. This is the "would have caught the 97 orphans months ago" detector from your gate plan, now with sentinels to check against.

---

## 5. Rollout order (respects the no-quick-fixes rule; each step verifiable)

| Phase | Work | Risk gate |
|---|---|---|
| 0 | **Stop**: pause desktop tasks (Jason) + disable EventBridge rules & S3 trigger (VSCode agent) + `requireAuth` on bulk-import + fix `mcp.js:167` | None — pure stop/repair |
| 1 | **Fresh deep audit + full backups** (VSCode agent, Part B) — current dup groups under the *real* identity keys, orphans, naturalKey collisions | Read-only |
| 2 | **Backfill** — artist locations (149 from own gigs' venue geo, 137 from FB town, 45 manual per gate plan L7), then `identity_key`, `name_lower`, `facebook_key`, `nameVariants`; venue `google_place_id` coverage check; GSIs created (`google_place_id-index`, artist slug GSI the code already asks for at handler.js:2034, `facebook_key`) | Tables aren't in the SAM template — GSI creation is out-of-band (CLI/console) or table-import first; decide before touching prod (2026-05-01 deploy incident applies) |
| 3 | **Dedup remediation** — merge/delete per the existing runbook rules (keeper = most events → oldest → best enriched; transfer enrichment first; verify zero events before artist delete; multi-artist events staged; ambiguous → Jason). Reassignments via Dynamo, not `edit_event`, until F5's fix is deployed | Backup verified first; the 07-03 worksheet corpus is the validation set |
| 4 | **Sentinel backfill in log-only mode** — write sentinels for all existing (now-clean) records; run the gates in shadow mode logging would-be bounces for a few days | Surfaces any legitimate-collision edge cases before enforcement |
| 5 | **Enforce** — transactions on, community route closed, fallbacks deleted, MCP updated | 409s become the norm for importer retries — clients updated in the same release |
| 6 | **Re-enable imports one source at a time**, watching the daily integrity report; then the standing guardrail is the permanent tripwire | One source per day, KLMA first (simplest parser) |

**Runbooks are untouched** — every rule in `dedup-remediation-plan.md`, `artist-identity-gate-plan.md`, `venue-dedupe-report.md`, the discovery-spider accept/reject filter, and the memory feedback rules is either preserved as-is (cleanup discipline, keeper rules, enrichment-at-creation, never-guess-venue-address) or promoted from prompt discipline into server code (normalise recipe, region rules, FB-key identity, place_id UID, artist+venue+date event key).

---

## 6. CLI access — your question answered

**Yes, you can give me CLI access here — with a caveat.** This cloud session has a full Linux shell with network access; the AWS CLI is installable in seconds. What I need is credentials: an IAM access key. The caveat is that anything you paste into chat persists in the conversation transcript, so do **not** paste your root/admin keys. The right way, if you want me CLI-capable:

1. Create a dedicated IAM user (e.g. `claude-cowork-audit`) with a scoped policy — for audit: `dynamodb:Scan/Query/GetItem/DescribeTable` on `arn:aws:dynamodb:eu-west-2:*:table/bndy-*`; add `events:DisableRule`, `lambda:PutFunctionConcurrency` if you want me to do the stop actions; add write actions only if/when you want me executing remediation.
2. Paste the key pair here; I configure it in this sandbox (it dies with the session container).
3. Rotate/delete the key when we're done.

**My recommendation:** the VSCode agent already has authenticated CLI access on your machine — for the deep audit and the AWS stop actions, feeding it the companion prompt is faster and exposes no credentials. Give *me* scoped keys later if you want me independently verifying remediation or running the integrity checks from here. Meanwhile I can operate read-only via MCP for spot checks — but note MCP itself is part of the crime scene (F5, F7), so nothing deep should trust it.

---

## 7. What I could NOT verify from here (per your standing rule)

- **Deployed API Gateway routes vs template.yaml** — the find-or-create 404 is inferred from the template + both clients' fallback code + the gate plan's "created (legacy community path)" observation. VSCode agent Part A confirms with `aws apigatewayv2 get-routes`.
- **Whether the prod SourceRunnerStack is actually deployed/enabled** (and whether the CDK bin entrypoint overrides `bndyApiBase` for dev).
- **festivals-lambda** — not audited (not staged); write routes `POST /festivals`, `PATCH /festivals/{id}` presumed unguarded; same gate pattern must be applied. Flagged in the VSCode prompt.
- **`DEFAULT_SAFETY_CAPS` values** and the runner lambda handlers' dryRun defaults (files not staged).
- Whether `GET /api/venues` emits `googlePlaceId` or `google_place_id` (decides if F6's resolveVenue comparison is dead → every bulk-import venue = CREATE_NEW).
- Current live duplicate counts — the 7/09 audit is stale; Part B regenerates it.
