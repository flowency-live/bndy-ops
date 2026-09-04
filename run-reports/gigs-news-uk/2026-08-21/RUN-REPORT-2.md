# gigs-news — scheduled run 2026-08-21, second firing

- **Run id**: `gigs-news-2026-08-21T04-07-30Z`
- **Runbook read**: `RUNBOOK.md` H1 **v2.27**, in full. Floor in §6A is **v2.19**. Assertion PASSES.
- **Prompt floor**: the task prompt states no number. §6A step 2a is the gate.
- **Spec read**: `sources/gigs-news-uk.md`, in full.
- **Inbox read**: `CTO-INBOX.md`, in full, before any item was considered.
- **Claim**: `data/state/claims/gigs-news.json`, acquired 04:08:00Z, TTL 90 minutes. The 00:28:30Z holder released cleanly at 00:47:00Z. No takeover.
- **Heartbeat**: `data/state/heartbeat/gigs-news-2026-08-21T04-07-30Z.json`.
- **Report path**: this is the **second** firing of this task today. §6A step 7 fixes one report path per date, so `RUN-REPORT.md` (00:28Z firing) is preserved and this run writes `RUN-REPORT-2.md`. Already open as `run-report-path-collides-on-second-firing`.
- **Outcome**: COMPLETED. The source is unchanged. One missing gig was found by coverage probe and written.

## 1. Counts

| Measure | Count |
|---|---|
| Events created | 1 |
| Events edited | 0 |
| Artists created | 0 |
| Venues created | 0 |
| Records created with a verified page | 0 |
| Records created with an evidenced blank | 0 |
| Rows added at source | 0 |
| Rows removed at source | 0 |
| Importable rows confirmed present in bndy | 27 |
| Importable rows found ABSENT and written | 1 |
| Rows skipped — no resolvable venue | 1 |
| Gate bounces | 0 |
| Creates against the 50 cap | 1 |
| Validator | 0 records · 0 clean · 0 FAIL · 0 WARN, exit 0 |

No artist was created, so no enrichment decision arose and no evidence line was written.

## 2. Capture

Chrome connected on the first `tabs_context_mcp` call. Both pages read through Chrome per the spec.

| URL | Method | Result |
|---|---|---|
| `https://www.gigs-news.uk/` | Chrome, DOM walk over leaf `center`/`p`/`td`/`div` nodes reading `a[href]` (§0.22) | 109 nodes, 95 snapshot lines |
| `https://www.gigs-news.uk/branded.htm` | Chrome, `innerText` | 412 lines, forward list at 18–45 |

Raw capture: `data/raw/gigs-news-uk/2026-08-21/week-view-rows-0407Z.txt` and `branded-forward-list-0407Z.txt`.

`javascript_tool` guard 1 fired as documented: any returned string containing `=` is blocked. Venue hrefs of the `profile.php?id=…` form were transformed to `(eq)` on return and are stored that way in the raw file. Guard 3 also fired: output truncates near 1.4 KB, so the rows were returned in eight slices. Neither is a source fault (§6B).

## 3. Horizon and the branded.htm forward list

The forward list is the header `gigs 2026` plus the **27 dated rows** that follow it, `innerText` lines 18–45. Archive headers sit at 162 (`Gigs 2026`), 201, 268, 325 and 367 and are all excluded. All three safeguards held: ordinal position, the lowercase/capitalised header distinction, and the day-name-against-date cross-check. Line counts and header positions are byte-identical to the 00:28Z firing.

## 4. Diff (§5.7)

Mode: the spec declares neither `delta` nor `append-only`. Already open as `gigs-news-mode-undeclared`. RUNBOOK §0.29 names gigs-news as delta-qualifying, and both conditions hold this run — the self-diff is 0/0 and the stored snapshot was produced by the same Chrome enumeration as today's capture. **No removed row arose, so no deletion decision was taken under either mode.**

- **Section 1 (week view)**: 0 added, 0 removed, 0 changed.
- **Section 2 (branded forward list)**: 0 added, 0 removed.
- **§5.7(a) self-diff gate**: the new snapshot re-diffed against the capture it was written from returns **0 added / 0 removed**.

The whole page is byte-identical to the 00:33Z capture after normalisation: 126 snapshot lines against 126, no differing line.

Normalisation applied to both sides and recorded in the snapshot header: whitespace runs collapsed to one space; every line trimmed; trailing comma, full stop or slash stripped; HTML entities decoded once; empty lines removed.

## 5. A zero diff is not proof that bndy is complete — and this run proves it

`klma-zero-diff-hid-nine-missing-gigs` (2026-08-19) records a run whose diff read 0/0 while nine published gigs were absent from bndy. That finding is klma-scoped. **This run tested the same question on gigs-news and found the same fault.**

The 00:28Z firing accounted for 20 of the week view's importable rows and named 8 more as long-standing and unchanged. It did not test the **section 2 forward list** against bndy, because that section diffed 0/0 and had done so for days.

This run enumerated every future-dated forward row and read the artist `branded` `rwDw320gku5uQ4gzaU2N` event list in one call. **22 future forward rows are published. bndy held 21.**

**Missing: `Sunday 20th September - Cheshire Cheese Newton SK14 4BH 5pm - Reserved`.**

Confirmed absent by three independent reads before any write:

| Probe | Result |
|---|---|
| `search_event(artistId: rwDw320gku5uQ4gzaU2N, 2026-08-21 →)` | 21 events, none on 2026-09-20 |
| `get_by_external_id(event, gigs-news, 2026-09-20-branded-reserved-cheshire-cheese-newton)` | `found: false` |
| `search_event(venueId: 18a2916a-…, from 2026-09-18)` | one forward event at that venue, dated 2026-11-07 |

`data/state/cancellations.jsonl` was read before the create. It holds six lines and none matches the artist, the venue or the date. `data/state/run-summary.jsonl` and today's seven report directories were read first: no run today has ruled on this gig (§5.4 v2.19).

## 6. Event created

| Event id | Title | Date | Time | Artist id | Venue id |
|---|---|---|---|---|---|
| `d8546c64-bdd4-4cfd-9cce-e34a9be24fe0` | branded (Reserved) @ Cheshire Cheese | 2026-09-20 | 17:00 | `rwDw320gku5uQ4gzaU2N` | `18a2916a-59d1-4375-ad4d-1fa99e3a9dd8` |

- `isPublic: true`. Read back with `get_by_id` (§0.10).
- externalId written: `{source:"gigs-news", id:"2026-09-20-branded-reserved-cheshire-cheese-newton"}` — the §6D date-slug form, and the exact convention the other 21 `branded` events on this source already carry.
- **Time is published, not defaulted.** The source row reads `5pm`, so `startTime` is 17:00 and `startTimeDefaulted` came back `false`. §0.28 treats a single published time as the stage time. The precedent in live data agrees: the `Sunday 22nd November … Reserved - 4pm` row is stored as 16:00.
- **Artist**: `branded`, the existing record. The spec's 2026-07-29 ruling maps both `branded` and `Reserved` rows to this one artist, with `(Reserved)` carried in the event title. No artist was created, so §2A.5 did not engage.
- **Venue**: `Cheshire Cheese`, Hyde, the record the 2026-11-07 `branded` row already uses for the same source label `Cheshire Cheese Newton`. No venue search was needed and no venue was created.
- `endTime` was not supplied and read back as `00:00`. Already open as `create-event-writes-endtime-midnight`.

## 7. Coverage probe — every importable row, checked against bndy

28 importable future-dated rows are published across both sections' named listings, plus one row with no resolvable venue. All 28 are now in bndy.

Verified live this run by `search_artist` then `search_event`, or by `get_by_id`:

| Row | Date | bndy event |
|---|---|---|
| Stage Two @ the Albion Dukinfield | 2026-08-21 | `6e540828-3efc-411e-83dd-8b13a5bfeb41` |
| the Grey Dogs @ the Crown Heaton Moor | 2026-08-21 | `8286ea74-75d7-4e32-a5dd-00416c020062` |
| Paul Waldron @ the Moor Club | 2026-08-21 | `49a8e1e3-c73c-45a7-8458-cc863146c12e` |
| Mongomery's Angels @ Arden Arms | 2026-08-22 | `14a3e613-5826-4264-a2a4-3eeee8679b51` |
| Tracy Morgan & co @ Cheshire Cheese | 2026-08-22 | `7c658943-325f-426b-9929-7fc6b0d08e88` |
| Just Jane @ the Musketeer Leigh | 2026-08-22 | `ed435268-494a-4e86-98bb-b215698e6f9c` |
| Soul 4 Soul @ the Wellington Stockport | 2026-08-22 | `870f7aff-4212-46a2-9060-8f7415d96493` |
| Ged Scott @ Poynton Workmen's Club | 2026-08-22 | `33c59bb2-3a9b-4af7-9d32-60abbee07d30` |
| Cold Flame @ the Acoustic Lounge | 2026-08-22 | `8db0bd41-195f-49b7-8d6b-5cdfb676f82b` |
| Cold Flame @ the Railway Greenfield | 2026-08-23 | `47793a7b-c5b0-4733-bbb3-d5fd115e40b9` |
| Smudge @ the Coach and Horses | 2026-08-23 | `7c90df59-b515-4a69-a115-33efc128b5fa` |
| Zak James @ Buxton Working Men's Club | 2026-08-22 | `a2ed7b78-312a-4216-b51a-130e0dc9a65c` |

The remaining 15 were read back with `get_by_id` by the 00:28Z firing three and a half hours earlier and are listed in `RUN-REPORT.md` §6 and §9. This run did not re-read them.

**`Cold Flame @ The Acoustic Lounge` 2026-08-22 was not named in the 00:28Z firing's accounting.** It exists and is correct, but it carries `{source:"cowork-discovery", id:"cold-flame__2026-08-22"}` — a namespace outside §6D — so this source's own `get_by_external_id` cannot see it. It is recorded here so the row is not read as missing by a future run. No inbox line: `sceniceye-daily-import-second-namespace` and `otcm-daily-import-legacy-namespace` already carry this class for two other sources today, and a third line adds no fact.

## 8. One row still cannot be imported — Stockport Rock & Roll Society

`9th Sept Off the Record - Stockport Rock & Roll Society`, the future-date-prefix row parsed to 2026-09-09, is unchanged at source and remains unimportable. The 00:28Z firing ran all three §3 fallback probes plus a fourth and found no venue; the source's anchor is a Facebook group with no published address, and a society is not a fixed building, so §0.8 and §0.23 both forbid the create. No probe was repeated this run and no inbox line was raised: §0.23 already answers the row.

## 9. Rows past-dated since the 00:28Z firing

None. The week view's Wednesday and Thursday blocks were already past at 00:28Z. `Ricky Stone` (19 Aug), `Route 66` (20 Aug) and `Roy Pimmy` (20 Aug) stay unimportable under §0.14.

The page is still titled `What's on This Week 19 - 23 August` and its last day header still reads `Sunday 16th August` where the rows below it belong to 2026-08-23. Already open as `gigs-news-sunday-header-stale-16-august`. The day-name-against-date check is what catches it and it caught it again.

## 10. Provenance back-fill — deliberately NOT done, and why

Sixteen events written by an unclaimed writer at 00:15–00:17Z still carry `externalIds: []`. Verified again this run on `a2ed7b78-312a-4216-b51a-130e0dc9a65c` (Zak James @ Buxton Working Men's Club): empty.

The 00:28Z firing declined to back-fill them because `externalid-slug-drift` is an open DEFECT against this source. **This run also declines, and adds the evidence that firing did not have:** every gigs-news event id read this run — 21 `branded` events plus ten named-act events — uses the §6D form `<YYYY-MM-DD>-<artist-slug>-<venue-slug>` with no exception. The variance is confined to which venue name is slugged: the source's label in `2026-11-07-branded-cheshire-cheese-newton`, the bndy record's name in `2026-08-23-smudge-coach-and-horses`.

That narrows the dispute but does not settle it, and §6B's `fantasticallibrary` precedent is explicit that provenance writes stay suspended while a convention is disputed. Writing sixteen ids in a form that may be half-wrong fragments provenance further. The back-fill remains a single clean pass once the venue-slug half is ruled. No second inbox line: `externalid-slug-drift` already holds this item.

## 11. Identity, venues and enrichment

- No artist was created, renamed, sanitised or enriched. No name was invented.
- No venue was created or searched. The one venue used was already carrying this source's rows.
- The sixteen stub artists from 00:15Z remain unenriched. Chrome is available, but that queue is `bv2a-enrichment`'s owned work and four of its firings have run today. Reported rather than half-done.
- No `search_venue` call was made, so the apostrophe defect did not arise this run.

## 12. Snapshot and state

- Snapshot written: `data/state/gigs-news-uk-last-page.txt`, 126 lines, two sections, normalisation rules in the header. Fetched-at line updated to 04:12Z; the body is unchanged.
- Self-diff gate: **0 added / 0 removed**.
- Validator: `0 records · 0 clean · 0 FAIL · 0 WARN [mode=gate]`, exit 0. No enrichment record was written this run, so the input set is empty and the gate is vacuously clean. Stated rather than claimed as a pass over real records.
- Evidence file: none written. No artist was created and no page was read for identification.
- `record_run` not called: `SOURCE_RUNS_TOKEN` is still unset, already open as `record-run-token-missing`.
- `run-summary.jsonl` appended, one line, append-only.
- Daily note `20-Daily/2026-08-21.md` appended, one line.
- No other task held a claim in this window. This run touched only `gigs-news-uk` paths, plus append-only writes to `run-summary.jsonl`, `CTO-INBOX.md` and the daily note.

## 13. Raised to CTO-INBOX.md

One item, one new fingerprint.

1. `gigs-news-zero-diff-hid-branded-row` — a 0/0 diff on both sections hid a forward-list gig that bndy never held. The diff compares the source against itself and never asks whether bndy holds the row.

Nothing else was raised. The stale Sunday header, the undeclared §0.29 mode, the undated snapshot lines, the externalId drift, the `record_run` token, the midnight `endTime`, the second report path and the unclaimed 00:15Z writer are all already open under their own fingerprints, and CTO-INBOX rule 5 forbids a second line for the same item.
