# PROMPT FOR VSCODE AGENT — data cleanup execution (Dynamo CLI)

> Run ONLY after: (1) review-deploy verified, (2) Jason has authorized the cleanup scope. Work via AWS CLI on DynamoDB — NEVER via MCP `edit_event` (broken in prod until the deploy lands; even after, CLI + verify is the rule here).
> Inputs: your `audit/` deliverables (cleanup-lists-2026-07-27.json, deep-audit clusters), `Projects/bndy/dedup-remediation-plan.md` (keeper rules), backups from Part B0.

## Non-negotiable protocol (this is what prevented-orphans-97 means)

**THE MERGE RULE: no duplicate artist record is ever deleted until EVERY event referencing it — via `artistId`, `artistIds[]`, AND `collaboratingArtistIds[]` — has been repointed to the keeper and VERIFIED by re-reading each event from Dynamo.** The July orphan disaster happened because deletes ran before reassignment was confirmed. Every write in this task is followed by a read-back verify. Progress is logged per cluster to `audit/cleanup-progress-<date>.json` so a crash loses nothing. Ambiguous → stage as `needs-jason`, never merge. Fresh backup verification before starting (non-empty, parseable, counts match live).

Keeper rule (Jason-approved): **most events → oldest record → best enriched**, in that order.

## Execution order

### 1. Venue merges (9 place_id clusters) — AUTO
Per cluster: pick keeper → merge onto keeper anything it lacks (externalIds additively, name_variants, enrichment, coords/place data) → find ALL events with dupe's venueId (query `venueId-date-index` + full-scan fallback) → update each event's `venueId` to keeper (and re-derive geohash fields if the repo's cascade helper expects it) → re-read each → verify zero events reference dupe → delete dupe venue → re-verify. If keeper and dupe both have an event for the same artist+date, that's a natural_key dup — handle per §2 before the venue delete.

### 2. Event natural_key duplicates (14 groups) — AUTO
Per group: survivor = oldest (or best-enriched if older is bare) → merge onto survivor any of: ticketUrl, price, startTime/endTime, description, imageUrl, externalIds (additive) → DELETE the others (Jason's rule: delete, not hide) → verify survivor intact + others gone.

### 3. Junk artists — AUTO with per-record checks
- **4 "Cancelled" artists**: review their events first — a "cancelled" placeholder gig gets `status: cancelled` (if field deployed) or `isPublic: false` + flagged, or deleted if pure junk; then zero-ref verify → delete artist.
- **1 unicode merge** (ÜL†RᛟɣᛨɸLE† → Ultraviolet 30c4ade9): transfer enrichment; add the stylized original to keeper's nameVariants; repoint events per THE MERGE RULE; delete 87f59213.
- **28 zero-event deletes**: per record verify LIVE before delete: `ai_created = true` AND `owner_user_id` null AND no membership rows (query memberships `artist_id-index`) AND zero events across all three reference fields AND present in backup. Any check fails → skip to needs-jason. Report the exact filter used (reconcile vs the July audit's 374).

### 4. Multi-artist lineup records (15) — JASON'S RULING
**Lineups are NEVER artist records. Each named act becomes its own individual artist record; the full lineup string lives ONLY in the event title.**
Per lineup record: parse the acts → resolve each against existing artists (normalised search incl. bare-core + containment; runbook thresholds) → create individual records only for genuinely-new acts (location from the gig venue's region; attempt FB enrichment per standing rule; actType) → update the event(s): `title` = full lineup string (keep as-is), `artistId` = headliner, `artistIds`/`collaboratingArtistIds` = all resolved act ids → re-read verify → zero-ref verify → delete the lineup record. Unnameable acts ("2 more", "TBA") stay in the title only — no record, no LineupSlot, nothing.

### 5. Artist duplicate clusters (113 same-key; 155 near-miss; + containment class)
- AUTO-MERGE only: same normalised key + same/compatible region + no distinct-act evidence (ADR-023). Apply THE MERGE RULE per cluster: keeper → transfer enrichment (facebookUrl, profileImageUrl, genres, actType, bio, socials) → externalIds additive → dupe's name spelling into keeper nameVariants → repoint/merge events (if keeper already has same venue+date event → that's a dup event: merge fields, delete it) → zero-ref verify (all three fields, fresh query) → delete dupe + its membership rows → log.
- NEEDS-JASON (stage, don't touch): near-miss (edit-distance) pairs, common-word names without region+genre agreement, different-region same-name (legit distinct — e.g. Not Guilty Stoke vs Yorkshire dbf7563d), anything ambiguous.
- Containment class: `f8b8f2b4` "Not Guilty - 5pc Local Rock/pop Covers Band" → merge into the existing STOKE Not Guilty keeper (NOT Yorkshire); put the billing string in the event title if not already; add nothing to keeper's name.
- Run a containment/prefix pass over the full artist table to find more of this class; add hits to the worksheet.

### 6. Orphaned events (185)
Match each dangling reference to a surviving keeper by title/date/venue (the July name-matching plan); repoint per THE MERGE RULE; unmatched → needs-jason list with enough context to decide (title, date, venue, source, externalIds).

### 7. Close out
Re-run your audit counts → summary report: before/after per issue type, clusters merged, events repointed (count), needs-jason worksheet, any skips + reasons. Deliverables to `Projects/bndy/audit/`. NOTE for post-enforce phase: every merge/delete here changes which sentinels the Phase-4 backfill will write — backfill runs AFTER this cleanup, never before.

## Hard rules
Deterministic only — no AI judgment on identity; unclear = needs-jason. No review/QA notes in any bndy field (public data). No imports re-enabled. No GATE_MODE changes. Paginate every scan. State anything not verified.
