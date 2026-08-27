# PROMPT FOR VSCODE AGENT — bndy emergency: stop imports + deep Dynamo audit

> Paste this whole file to the VSCode agent (it has AWS CLI access, region `eu-west-2`).
> Context doc: `Documents/Claude/Projects/bndy/IMPORT-SHUTDOWN-AUDIT-AND-GATE-PLAN.md`.

You are working on Jason's bndy platform (DynamoDB tables `bndy-artists`, `bndy-venues`, `bndy-events` in eu-west-2). Automated importers have polluted the database with duplicate artists, venues and events. ALL imports are being stopped and backend uniqueness gates are being designed. Your job has two parts: **A) stop cloud-side imports**, **B) produce a fresh, deep, READ-ONLY data audit**. Do NOT mutate any bndy-* table in this task. Do NOT deploy anything.

---

## PART A — Stop cloud-side imports (do this first)

1. Check whether the bndy-signals source-runner prod stack is deployed:
   ```
   aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE | grep -i source
   aws events list-rules --name-prefix bndy-
   ```
2. If present, disable ALL of (note exact expected names, `{stage}` = `prod`, but disable dev ones too if enabled):
   - `bndy-klma-schedule-prod`
   - `bndy-onthecase-schedule-prod`
   - `bndy-gigs-news-schedule-prod`
   - `bndy-sceniceye-schedule-prod`
   - `bndy-intelligence-pass-s3-trigger-prod`  ← NOT cron-based; fires on `*/run.json` S3 objects and writes to the live API with DRY_RUN=false. Must be disabled too.
   ```
   aws events disable-rule --name <rule>
   ```
3. Belt-and-braces — zero the runner lambdas' concurrency so even a manual invoke can't run:
   ```
   aws lambda put-function-concurrency --function-name bndy-klma-runner-prod --reserved-concurrent-executions 0
   ```
   (repeat for `bndy-onthecase-runner-prod`, `bndy-gigs-news-runner-prod`, `bndy-sceniceye-runner-prod`, `bndy-intelligence-pass-prod`)
4. **Durability warning:** a console/CLI disable is drift — the next `cdk deploy` of `C:\VSProjects\florence\bndy-signals` re-enables them (`enabled: stage === 'prod'` in `infrastructure/cdk/lib/source-runner-stack.ts`). Edit that file to `enabled: false` on all five rules and commit (do not deploy; the commit is so the next deploy doesn't resurrect them).
5. Verify the API-drift finding: dump the deployed routes and diff against `template.yaml`:
   ```
   aws apigatewayv2 get-apis
   aws apigatewayv2 get-routes --api-id <id> --max-results 200
   ```
   Specifically confirm: does `POST /api/artists/find-or-create` exist in the deployed gateway? (We believe it does NOT — this is the root cause of artist duplication: both MCP and signals fall back to the no-dedup `POST /api/artists/community` on 404.)
6. Report back: which rules existed, which were enabled, what you disabled, and the route-diff result.

---

## PART B — Deep data audit (READ-ONLY)

### B0. Backups first
Full paginated scans of all three tables to timestamped JSON (use `--output json`, loop on `LastEvaluatedKey` — NEVER trust a single-page scan):
```
audit/backup-artists-<date>.json
audit/backup-venues-<date>.json
audit/backup-events-<date>.json
```
Verify each file is non-empty valid JSON and record item counts. Also back up `bndy-artist-memberships` (needed to assess merge blast radius later).

### B1. Identity keys — compute these EXACTLY as specified (they are the future uniqueness gates; the audit must use the same keys)

`normalise(name)`:
lowercase → replace `&` with `and` → strip punctuation/apostrophes/hyphens → strip leading `the ` → strip trailing tokens {`band`,`duo`,`trio`,`acoustic`,`live`,`music`,`uk`} (repeat until none) → collapse whitespace → leet-fold (`3`→e, `0`→o, `1`→i, `5`→s).

`region_bucket(location)`: canonicalise to coarse UK areas (Staffs, Cheshire, NE, NW, Yorks, Hants, Derbys, …). `stoke-on-trent`, `staffordshire`, `newcastle-under-lyme` → one bucket. Empty, null, or literal `UK` → `UNKNOWN` (and `UNKNOWN` never matches anything, including itself).

`artist identity_key = normalise(name) + '#' + region_bucket`
`event natural_key  = sha1(venueId + '|' + artistId + '|' + date)` — one per artist including every member of `collaboratingArtistIds` and `artistIds`
`facebook_key` = facebookUrl lowercased host, stripped of trailing slash, `/about`, and query params.

### B2. Duplicate detection
1. **Artists:** group by `normalise(name)` alone; within each group classify: (a) same region_bucket or either UNKNOWN → **duplicate cluster**; (b) different non-empty regions → **legit distinct** (record but don't flag); also run edit-distance ≤2 on normalised keys for near-miss pairs (Damiain/Damien, Pheonix/Phoenix, Star Breaker/Starbreaker class). Separately group by `facebook_key` — exact FB match = same artist regardless of name.
2. **Venues:** group by `google_place_id` (non-empty) — ANY group >1 is a hard duplicate (this is the future UID). Then: exact `normalise(name)` groups; coordinate proximity <100 m **with** name-similarity agreement (proximity alone false-positives in dense town centres — Derby Market Hall / "Derby" are ~100 m apart and distinct); venues with NO place_id at all (these can't be gated — list them for geocode backfill); venues with no coordinates; "address-as-name" stubs (name matches `^\d+ ` or ends in Rd/St/Ln/Dr patterns).
3. **Events:** group by `natural_key` — every group >1 is a duplicate. Also group by (normalised venue cluster, date, normalise(artist name)) to catch dupes hidden by *venue* duplication (same real gig on two venue records — the cascade class). Also externalId collisions: same `{source, id}` on multiple events.
4. **Orphans:** events whose `artistId`, any `collaboratingArtistIds`/`artistIds` member, or `venueId` doesn't resolve to a live record. Note the known 97 from the 07-09 audit (`Documents/Claude/Projects/bndy/orphans-97.json`) — diff: which are fixed, which remain, which are NEW since 07-09.
5. **Junk:** artists named tbc/Cancelled/Elvis-with-no-events etc.; `Integration Test Event` (date 2099-12-31); zero-event artists with `created_at` after 2026-07-09 (= pollution since the last audit).
6. **Provenance:** for every duplicate cluster, tabulate members' `source`, `created_source`, `ai_created`, `created_at`, and `external_ids[].source` — we need to know WHICH importer created each duplicate and WHEN. Bucket created_at by week to show the pollution curve. NOTE: MCP-created events carry only `source:'mcp_ai_import'` (no ai_created/needs_review flags) — don't filter on the flags or you'll miss them.
7. **Sanity checks on known live dupes** (from the 2026-07-12 sceniceye incident): Emily Martine, Peludo Beach (one spelled "Puludo"), The Shadders — each should show ×2 artists + ×2 events; Golden Lion (Havant) ×2 venues. If your audit does NOT find these, your matcher is wrong — fix and re-run.

### B3. Gate-readiness metrics (feeds the backfill phase)
- Artists with empty/UK-only location (07-09 figure: 331) — current count, and how many are inferable from their own events' venue geography (join events→venues→city/region, majority vote).
- Venues missing `google_place_id`; venues whose `google_place_id` appears once (clean) vs >1.
- Events per create-source, and how many carry a stored `naturalKey` attribute already (events-agent writes it; others don't).
- Field-name drift check: does `GET /api/venues` (or the raw items) use `google_place_id`, `googlePlaceId`, or both? Same question for artist `name_lower`/`name_prefix` population coverage (needed by the resolver's GSI).

### B4. Deliverables
Write to `C:\Users\jason\Documents\Claude\Projects\bndy\`:
- `deep-audit-<date>.json` — machine-readable: all clusters with member ids, keys, provenance
- `deep-audit-<date>-summary.md` — headline counts vs the 07-09 audit, pollution-by-source-by-week table, the cascade-class event dupes, orphan diff, gate-readiness metrics, and a ranked remediation worklist (auto-merge / needs-jason split per the existing `dedup-remediation-plan.md` rules: keeper = most events → oldest → best enriched; ambiguous → staged, never merged)

### Rules
- READ-ONLY on all bndy-* tables. No writes, no deletes, no "quick fixes".
- Never trust `edit_event`/MCP for anything in this task — known silent no-op bug (`events-lambda/handlers/mcp.js:167` maps `artist_id` instead of `artistId`).
- Paginate every scan. State anything you could not verify.
- Do not write review notes/uncertainty into any bndy field — worksheets only (bios are public).
