# bndy Duplicate-Artist Remediation — EXECUTION PLAN
**Written 2026-07-03 by the discovery-session agent, approved by Jason. For a FRESH agent with full context budget.**
**Jason's decisions already made: duplicate EVENTS are DELETED (not hidden). MCP delete routes (delete_artist, delete_event) WILL BE DEPLOYED — verify early, fall back gracefully if not live yet.**

---

## 1. THE PROBLEM

bndy (~1,775 artists) has systemic duplicate artist records: the same act exists 2–4×, events scattered across the copies. Cause stack:
1. **Server-side dedup is not engaging.** Every recent `create_artist` returns *"created (legacy community path). Flagged for manual review"* — the ADR-014 find-or-create resolution is NOT running. Nothing server-side prevents dup artists. (Flag this to Jason/Vincent as the permanent fix; this plan is the cleanup + process mitigation.)
2. **`search_artist` misses real originals**: (a) apparent index lag — records created <24–48h ago (e.g. by the daily Scenic Eye import) don't surface; (b) normalisation gaps ("Star Breaker"/"Starbreaker", "&"/"and", trailing Band/Duo/Trio); (c) processes searched at minConfidence 80, too strict.
3. Multiple independent writers (5 daily scheduled imports + discovery/spider runs) each trusted a failed search and created "new" artists.

**Known confirmed examples** (Jason's list, min. these — the audit must find them all as validation):
Star Breaker ×4, The Zone ×4, Helen Spooner ×3 (a14a292d / c8edb2fc / 3cfacff3 — keep 3cfacff3, has FB), Roy Pimmy ×3, A Band Called Malice ×3, Danny Brab ×3, Tubesnake ×3, Adam Ede ×3, Rob Black ×3, Ben Staz ×3, Trilogy ×3, Mike & The Floorfillers ×3, Damien Lodrick ×3 (one dupe spelled "Damiain Lodrick" — spelling variants count).
Previously flagged pairs: Blue Ridge Band e4d07ecb-8fd2-4b9c-9647-57fe59b8766c (keep 70e29c87); The Chase 97445235-27f8-4950-8b68-67ad690d203a (keep 09c5d121, has FB thechaseband); Ant Clowes 925a6259 vs Ant Clowes Duo X8nI6ptSlLGoHh8XW51N; Beatles For Sale ccedf866 vs The Beatles For Sale ad2a64fc; Trilogy Rock Band a6b1adbc (dupe) vs XJ2gV4N1qIe6vK2R562Q (keep); the Select Committee 6e00cc46 vs The Select Committee PNJ6TclgY1pH26h2orEa (keep).

---

## 2. CRITICAL GUARDRAILS (read before touching anything)

- **NOT every same-name group is a duplicate.** Per ADR-023 (Artist→Acts model): collapse **same core + same region ONLY**. Same/near name in a DIFFERENT region = potentially a distinct act — e.g. "Backwater" is 3 different bands (do NOT merge; a Swiss Backwater record is being deleted by Jason manually — leave anything Backwater alone). Common-word names (Atomic, Casino, Demon, Mantra, Fine Lines, Pressure Drop, Foxglove, Avian…) need region+genre agreement before merging.
- **Act qualifiers** (X / X Duo / X Band / X Trio) with the same core in the same region = same artist per ADR-023 — merge, keep the plain-core name unless the qualified record is clearly richer/older.
- **Never write review/QA/uncertainty notes into any bndy field** — bios etc. are PUBLIC. Uncertainty goes in the worksheet/report only.
- **Ambiguous groups are STAGED, not merged.** When in doubt → `dedup-worksheet.json` with `status:"needs-jason"` and move on. Precision over throughput.
- **BACKUP FIRST** (Phase 0). No mutation before the backup file exists.

---

## 3. TOOLING NOTES (hard-won, trust these)

- MCP server: `mcp__bndy-events__*`. Load via ToolSearch in ONE call: `select:mcp__bndy-events__list_artists,mcp__bndy-events__search_artist,mcp__bndy-events__get_by_id,mcp__bndy-events__edit_artist,mcp__bndy-events__delete_artist,mcp__bndy-events__search_event,mcp__bndy-events__edit_event,mcp__bndy-events__delete_event,mcp__bndy-events__list_venues,mcp__bndy-events__edit_venue`.
- `list_artists`: paginate (check its limit/offset params after loading; artists ≈ 1,775). Dump ALL to a local JSON before grouping.
- `search_event(artistId)` → events for a specific artist. `edit_event(eventId, artistId: <keeperId>)` is the documented merge-reassignment path.
- Multi-artist events carry `artistIds` (array) plus a primary `artistId`. **TEST on one multi-artist event** whether edit_event(artistId) rewrites the array member; if it only changes the primary, list affected multi-artist events in the worksheet for manual/API fix instead of half-mangling them.
- `delete_artist` previously returned ARTIST_NOT_FOUND (route not deployed); `delete_event` previously returned HTTP 401. **Jason says routes will be deployed — test each ONCE early** (on a confirmed dupe with 0 events / a confirmed dup event). If either still fails, record the exact error, fall back (see Phase 4/5 fallbacks), and continue — do not stall the run.
- Workspace bash path for the project folder: `/sessions/<sandbox>/mnt/bndy/` (check your own mount; Read/Write tools use `C:\Users\jason\Documents\Claude\Projects\bndy\`).
- File-write caution: overwriting existing files in the mounted folder has shown byte-length clamping — write NEW files, or write via python-in-bash, and verify sizes after write.
- No browser needed for this job (pure MCP + python) — do NOT connect Chrome.

---

## 4. PHASE 0 — BACKUP (mandatory, first)

1. Dump every artist record (paginated `list_artists`, full payloads) to `bndy/dedup-backup-artists-2026-07-03.json`.
2. For every dup-group member found in Phase 1, dump its full events (`search_event(artistId)`) into `bndy/dedup-backup-events-2026-07-03.json` BEFORE any reassignment/deletion.
3. Verify both files are non-empty and parse as JSON. Only then proceed to mutations.

## 5. PHASE 1 — FULL AUDIT (read-only)

1. From the artist dump, group by **normalised name key**: lowercase → strip punctuation/apostrophes/hyphens → collapse whitespace → map "&"→"and" → strip leading "the " → strip trailing tokens {band, duo, trio, live, music, acoustic, uk}. Keep a second pass for **fuzzy near-misses** (edit distance ≤2 on the normalised key, catches Damiain/Damien, Pheonix/Phoenix, Star Breaker/Starbreaker).
2. For each group with >1 member: fetch `get_by_id` per member (full fields) + `search_event(artistId)` per member (event count + event list).
3. Classify each group:
   - `auto-merge`: same normalised core AND same/compatible region (or one/both regions empty) AND no evidence of being distinct acts.
   - `needs-jason`: different regions, common-word name with conflicting genres, or anything uncertain. (All "Backwater" → automatic needs-jason/leave-alone.)
4. Write `bndy/dedup-worksheet.json`: per group — members (id, name, location, created flags, socials, externalIds, event count, event list), classification, chosen keeper + why.
5. **Validation gate**: all 13 of Jason's named examples MUST appear in the worksheet. If any are missing, the normalisation is wrong — fix and re-run before proceeding.
6. Also note (do not fix) duplicate VENUES encountered (known: Crook Hotel, Railway Greenfield dup — keep NwEtqexKQqLHyBcPVgJF) → `venueDupes` section of the worksheet for a follow-up job.

## 6. PHASE 2 — KEEPER SELECTION + ENRICHMENT CONSOLIDATION

Keeper rule (Jason-approved): **most events → oldest record → best enriched**, in that order.
- If a dupe holds enrichment the keeper lacks (facebookUrl, profileImageUrl, genres, actType, bio, other socials, externalIds): copy onto the keeper via `edit_artist` BEFORE deleting anything. Merge externalIds additively (edit_artist merges by default).
- Record every keeper decision + enrichment transfer in the worksheet.

## 7. PHASE 3 — EVENT REASSIGNMENT

Per dupe, per event:
1. If the keeper does NOT already have an event at the same venue+date → `edit_event(eventId, artistId: keeperId)`. Preserve everything else on the event.
2. If the keeper DOES already have the same venue+date event → the dupe's event is a duplicate EVENT → **`delete_event(eventId)`** (Jason's decision: delete, not hide). Before deleting, merge anything the doomed event has that the surviving one lacks (ticketUrl, price, startTime if survivor lacks it, externalIds) onto the survivor via `edit_event`.
3. Multi-artist events: apply the tested behaviour from §3; if arrays can't be rewritten safely, worksheet them (`status:"multi-artist-manual"`).
4. After processing, re-check `search_event(dupeId)` returns ZERO events. Non-zero = stop on that group, investigate, don't delete the artist.

## 8. PHASE 4 — ARTIST DELETION

For every dupe now at 0 events: `delete_artist(id)`.
- If the route works: delete all, record each result.
- If it still fails: capture the exact error once, do NOT retry per-record; produce `bndy/dedup-backstage-delete-list.md` (name, id, group, "0 events, enrichment transferred") for Jason to execute in Backstage, and say clearly in the report WHY deletion failed (exact response).

## 9. PHASE 5 — VERIFY, REPORT, HARDEN

1. **Re-scan**: re-run the Phase-1 grouping against a fresh artist dump. Expect: zero auto-merge groups remaining; needs-jason groups unchanged and listed.
2. **Spot-check** 5 keepers: events all present, enrichment intact, no orphaned references.
3. **Report** (tight): groups found / auto-merged / staged-for-Jason; events reassigned / duplicate events deleted; artists deleted (or Backstage list + exact delete error); validation-gate result; venue dupes noted; anomalies.
4. **Update the dashboard artifact `discovery-crawler-nw`** with a "DEDUP REMEDIATION" panel (counts + link to worksheet files).
5. **Stop the bleeding — update all five scheduled task SKILL.md prompts** (`C:\Users\jason\Documents\Claude\Scheduled\{gigs-news-daily-import, sceniceye, onthecase-daily-import, klma-stoke-daily-reimport, discovery-crawler-nw}\SKILL.md` via `mcp__scheduled-tasks__update_scheduled_task`, prompt field) with a mandatory PRE-CREATE PROTOCOL:
   - search_artist at **minConfidence 50** (not 80) AND search the normalised core + "&/and" + qualifier-stripped variants;
   - ANY same/near name in the same region = REUSE, never create;
   - the server does NOT dedup (legacy path) and the index can lag ~24–48h — when a gig's act matches something created by any recent import run (check the run's own report files / state), reuse it;
   - if genuinely uncertain whether an act exists, create is allowed ONLY after all variant searches at 50 return nothing.
6. **Escalate the permanent fix** in the report for Jason/Vincent: (a) ADR-014 server-side find-or-create is not engaging ("legacy community path"); (b) search index freshness; (c) normalised-name matching server-side. Until fixed, every writer must follow the pre-create protocol.

---

## 10. RUN DISCIPLINE

- Work group-by-group; persist worksheet progress after every group so a crash loses nothing.
- Budget: if context runs low, STOP cleanly at a group boundary, persist state, and report exactly which groups are done/remaining — a follow-up agent resumes from the worksheet.
- Nothing outside dup-groups gets modified. No new artists, venues, or events are created by this job.
