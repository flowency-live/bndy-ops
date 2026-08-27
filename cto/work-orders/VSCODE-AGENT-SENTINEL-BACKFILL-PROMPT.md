# PROMPT FOR VSCODE AGENT — sentinel backfill + venue place_id backfill

> Precondition Jason requires FIRST: deliver the CLEANUP CLOSING REPORT (clusters merged, events repointed count, deletions, needs-jason worksheet, before/after totals) — no backfill until he's acknowledged it.

## Part A — Venue place_id resolution (the 24)
1. Orphaned (0 events, no place_id): DELETE (Jason approved). Log ids in the report.
2. With events: geocode name+city per runbook §3. Google result name must AGREE with the venue name — mismatch = STOP, manual list, never attach a wrong place.
3. **Collision rule: if the resolved place_id already exists on another venue, this is a DUPLICATE VENUE, not a backfill** — merge per keeper rules (repoint every event's venueId to keeper, merge externalIds/enrichment, verify zero refs, delete dupe). Do not blindly set the field.
4. Also `node --check` every script before running (yesterday's stray-quote class).

## Part B — Sentinel backfill (ALL THREE entity types; keys computed on-the-fly, never stored on records, never hand-built)
Use ONLY the shared lib: `buildArtistUniqueKeys()` / `venuePlaceKey()` / `eventUniqueKeys()` from `shared/identity`. One script, three phases, dry-run first with counts.

- **Artists**: identity sentinel + fb sentinel per record. Unresolvable location (should be ~5) → skip + list for manual.
- **Venues**: `venue#gplace#<place_id>` per record (Part A must complete first so coverage is 100%).
- **Events**: one sentinel PER ARTIST (artistId + artistIds[] + collaboratingArtistIds[]) per public gig — this is NOT skipped; the "no natural-key backfill" decision only meant no stored attribute. Without event sentinels, enforce mode cannot block re-imported duplicate events.
- All writes: `ConditionExpression: attribute_not_exists(#k)`, item shape `{key, refId, entityType, source:'backfill', createdAt}` (match unique-gate.js shape exactly).
- **Any collision = a duplicate the cleanup missed.** Do not overwrite, do not delete — list every collision (key, existing refId, colliding record id) in the report for Jason.

## Part C — Report + gate to enforce
Deliver: counts per entity (records, sentinels written, skipped, collisions), the collision list, manual lists. **STOP there.** GATE_MODE=enforce is a separate Jason-approved step after he reviews this report (and after the amended data-quality lib — incl. the new listing-copy gate — is committed + deployed, if not already).

Rules: read-only on entity tables (writes go to bndy-unique-keys only, except Part A merges/deletes which follow THE MERGE RULE); paginate every scan; state anything unverified.
