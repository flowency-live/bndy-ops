# ScenicEye run report 2 — 2026-08-21 (second firing)

**OUTCOME: COMPLETED. 0 events created. 0 artists created. 0 venues created. 1 live event corrected under §0.28. Validator 0 FAIL. Coverage probe found no gap.**

| field | value |
|---|---|
| Run id | `sceniceye-2026-08-21T04-36-19Z` |
| Task slug | `sceniceye` |
| Fired | 2026-08-21T04:36:19Z |
| Today | 2026-08-21 (Friday), from `date +%Y-%m-%d` in the shell |
| Runbook read | `RUNBOOK.md` H1 **v2.27**, in full |
| Floor asserted | §6A **CURRENT FLOOR v2.19**. 2.27 >= 2.19. PASS |
| Prompt floor | The task prompt names no number. §6A step 2a is the only gate |
| Spec read | `sources/sceniceye.md`, in full |
| Declared §0.29 mode | **none**. The run defaults to `append-only`. Raised as `sceniceye-mode-not-declared` on 2026-08-12. Not raised again |
| Claim | `data/state/claims/sceniceye.json` read `heldBy: null`, released 01:13:00Z by the 00:34Z run. Acquired 04:37:30Z, TTL 90 min, expires 06:07:30Z. Released as the last action |
| Heartbeat | `data/state/heartbeat/sceniceye-2026-08-21T04-36-19Z.json` |
| `enrichment.lock` | Not present. Nothing recreated it (§6A step 2b) |
| Report path | `RUN-REPORT-2.md`. `RUN-REPORT.md` holds the 00:34Z firing. Path collision already raised as `run-report-path-collides-on-second-firing` |

## 1. This is the second sceniceye firing today

The 00:34:33Z run completed and released its claim at 01:13:00Z. This report does not repeat
its findings. Read `RUN-REPORT.md` in this folder first. This run re-captured the source,
re-diffed it, and probed bndy for coverage.

## 2. Chrome and the capture

`list_connected_browsers` returned one local browser. Chrome remains connected. The spec's
mandatory surface was available, so the third-surface question did not arise.
`sceniceye-third-surface-needs-ruling` (2026-08-19) stays open and is not re-raised.

Capture method: `javascript_tool` DOM walk of `h2` day-headings plus the following
`table.notion-table` (§0.22). `get_page_text` was not used for extraction.

`javascript_tool` output guards (§6B): output was returned in six-line chunks with `=`
transformed, because the tool truncates near 1.4 KB. No guard fired.

**Stale-week check: PASS.** The banner reads `20 August - 26 August 2026`. Seven day tables,
Thursday 20 August to Wednesday 26 August. The week is current. The curator rolls on a
Thursday; the next roll is 27 August.

Raw capture: `data/raw/sceniceye/2026-08-21/capture-rows-2.txt`, 29 act rows across 7 days.
One of the 29 is the Monday 24 August "No gigs listed" cell, collapsed to the rule-7 form.

## 3. §5.7(a) normalisation and the self-diff gate

Both sides normalised by the rules written into the snapshot header. The extractor was run a
second time against the same DOM and the two results compared line by line.

**Self-diff: 0 added, 0 removed** (36 lines each side). The gate passes.

## 4. Snapshot diff

The stored snapshot was written by the 00:34Z run, same week, same format.

**Diff: 0 added, 0 removed** (35 comparable lines each side).

The source has not changed in the four hours between the two firings. No removed row arose,
so §5.7 removed-row handling and §0.17 deletion had nothing to act on. The source declares no
§0.29 mode, so the run is `append-only` regardless.

## 5. Coverage probe — a diff compares the source to itself, never to bndy

`klma-zero-diff-hid-nine-missing-gigs` (2026-08-19) and `gigs-news-zero-diff-hid-branded-row`
(2026-08-21) both record a 0/0 diff sitting on top of real missing gigs. A zero diff is
therefore not evidence that bndy holds the week. This run checked bndy directly.

Method: `search_event(venueId, dateFrom 2026-08-21, dateTo 2026-08-27)` for all fourteen
resolved venues, plus `get_by_id` on two events. `search-event-daterange-ignored` (2026-08-21)
is open, so results were filtered by date on read.

**All 18 forward-dated source rows are present in bndy, `isPublic: true`, correct date and
correct start time. Zero gaps. Zero creates were needed.**

| date | act | event id | venue id |
|---|---|---|---|
| 2026-08-21 | Mica Alice | `b002c031-7270-4606-b667-4a5a8afceda0` | `3218ee02-6145-4aac-9be8-c113acfefdb1` |
| 2026-08-21 | Astromoda | `423c11f2-1d8e-4766-b650-7e16642f447b` | `557be6b0-33f9-4945-8adb-fe1cd7dff78b` |
| 2026-08-21 | Jonny Moody | `3267f4db-5fcb-404c-a698-00dbe2f30773` | `bedb0ed3-e93c-4ddf-9fe3-7d0a044f9316` |
| 2026-08-21 | CarbonCopy Party Band | `faf2bdfb-2cbb-42dc-b7b9-1dc8bb63f25a` | `eb51991a-b082-433c-90e4-123340283271` |
| 2026-08-22 | Michelle Lewis + Tom Light | `c681b493-15c5-42aa-a556-b0de73b50b3c` | `d4cf2b67-2550-45c4-9511-0cd9971341e1` |
| 2026-08-22 | Millie Jenson | `50ec6156-a38e-4af5-8bcf-1b25d60ba226` | `c90f3d40-f90d-4e61-b498-dbd40db12ff9` |
| 2026-08-22 | Mucky Fingers | `72622130-7a25-401b-9726-62ad226dcfbd` | `18a06cd3-8556-42c4-8e12-b0c2c6140073` |
| 2026-08-22 | The Austin's | `ba3770a7-ff89-4833-8c9b-e6f48afeda6c` | `6e35b9e8-f859-4452-9ce5-e70061e0d31e` |
| 2026-08-22 | Mark Searle | `9a460bf2-8dad-42c5-8d0a-6ef1d36cb448` | `8670d198-54a8-43a5-80f9-94bca1b21f40` |
| 2026-08-22 | Why 2K | `7e331ffe-dca6-42fd-8f98-3417e1b2aed9` | `52867bf8-e2b0-461c-9da5-c563f5464e2b` |
| 2026-08-22 | The Pop Pickers | `6a62ab61-1f69-48e0-b348-7e8169ee156d` | `2f01ebc9-abce-4ff6-8b39-0bde440d45ff` |
| 2026-08-22 | Snake Heart | `d7bcf125-5b1b-4af9-91a9-9ece527f3040` | `eb51991a-b082-433c-90e4-123340283271` |
| 2026-08-22 | Forever Oasis | `d01ebd71-c8c3-41af-a82d-f10137fe4fa7` | `11fbe3bb-6798-4c30-b34e-2b999648ac01` |
| 2026-08-23 | Through the Decades Duo - Mal & Lena | `4f157f96-88ba-4931-a777-6f9c3ceb96f8` | `d3200659-f23b-4a19-a2c3-63e036b75c56` |
| 2026-08-23 | Sean Sings Elvis | `395f4694-f114-44ce-86b7-86767f1eb90b` | `557be6b0-33f9-4945-8adb-fe1cd7dff78b` |
| 2026-08-23 | Terry Nutskin | `d244f958-ba9d-486b-9a9a-17364320dccc` | `eb51991a-b082-433c-90e4-123340283271` |
| 2026-08-25 | Herding Cats | `95158c26-17fc-4fac-b129-0a14e5a74342` | `557be6b0-33f9-4945-8adb-fe1cd7dff78b` |
| 2026-08-26 | Matt O'Neil | `39671176-eaa4-4c01-9ef6-8e3314364e7b` | `c3e9765d-db57-49d6-8cad-3ca67d745ae6` |

**Every one of the eighteen carries the externalId source `sceniceye-daily-import`, and none
carries the §6D `sceniceye` key.** This confirms the 00:34Z finding
`sceniceye-daily-import-second-namespace` by direct read of every affected record, not by
sample. Nothing was rewritten: a back-fill onto another writer's records is cleanup (§0.11),
not import, and the item is already with Jason.

The Golden Lion event sits on `d3200659-…`, the record that holds this source's provenance.
The duplicate `4ce15a95-…` created in error at 00:34Z still holds zero events. It was not
touched. `sceniceye-golden-lion-havant-duplicate-placeid` stays open.

## 6. The one write this run made — §0.28 window rule

`c681b493-15c5-42aa-a556-b0de73b50b3c`, `90s Garden Party - Featuring Michelle Lewis and Tom
Light` at The Olive Leaf, 2026-08-22, held `startTime 12:00` and `endTime 21:00` and no
`ticketInformation`.

The source cell reads `12:00 PM - 9:00 PM`. **§0.28 states that a window is not a time.** A
nine-hour span is the venue's garden-party window, not a set time, and §0.28 requires the
uncertainty to be stated rather than rendered as a nine-hour gig on the map. This is the
Radioactive Show case §0.28 was written for.

§5.3 authorises enriching an existing event with new fields when a create bounces or the
record already exists. The times were left exactly as the source publishes them.

```
edit_event(eventId: c681b493-15c5-42aa-a556-b0de73b50b3c,
           ticketInformation: "Event runs 12:00-21:00, stage time not published")
-> success, updatedFields: ["ticketinformation"]
```

Read back with `get_by_id` (§0.10): `ticketInformation` present and exact, `startTime 12:00`,
`endTime 21:00`, `isPublic true`, `updatedAt 2026-08-21T04:40:46.650Z`. No other field moved.

**No other row in the capture is a window.** The next longest span is three hours.

## 7. Rows skipped, with reasons

**Past-dated (§0.14) — 2 rows, Thursday 20 August:** Billy Joel at Number 73 Bar & Kitchen;
Adam Ede at The Crown Inn, Emsworth. Both were also past at the 00:34Z firing.

**Venue is not a fixed building (§0.23) — 8 rows, Saturday 22 August, the Farmstock rows:**
`Farmstock Family Festival` (a farm site, 214 Catherington Lane), and seven slot rows whose
venue cell reads literally `Farmstock Festival` — a named non-place with no address. Per §1 an
event cannot exist without a venue, so the slots cannot be written.

This is §0.23 deciding, not the word "festival" deciding, exactly as §0.27 and the spec's
2026-08-08 CTO ruling require. Acts named in those rows, kept as discovery leads only:
Hadley Stephen, Katie Fid, Tony Gold, Lauren Stanley, The SG's - Bivol Trust, The Pfizer
Chiefs, The Centurions.

**The Centurion test did not arise.** No `- Music Festival` rows at The Centurion appear in
the 20-26 August capture. Had they, they would have imported as ordinary gigs.

## 8. Counts

| metric | value |
|---|---|
| Rows captured | 29 (28 gig rows + 1 "No gigs listed" cell) |
| Rows past-dated, skipped (§0.14) | 2 |
| Rows skipped, venue not a fixed building (§0.23) | 8 |
| Rows carried to the pipeline | 18 |
| **Events created** | **0** |
| Events already present, verified by read | 18 |
| **Events corrected (§0.28)** | **1** |
| Artists created | 0 |
| Artists created with a verified page | 0 |
| Artists created with an evidenced blank | 0 |
| Artists enriched | 0 |
| Venues created | 0 |
| Venues matched | 14 |
| Names sanitised or staged as non-acts under §0.6 | 0 |
| 409 / 422 bounces | 0 |
| Defaulted start times (§5.6) | 0 |
| Date corrections applied | 0 |
| Deletions | 0 |
| Tombstones written | 0 |
| Tombstone file checked before any create | yes — `data/state/cancellations.jsonl`, 6 lines, no match on any artist+venue+date in this capture. No create was attempted in any case |

**Quality reading (§6, v2.5).** This run created nothing, so the stub test does not bite. Its
substance is the coverage probe: eighteen records read back individually rather than assumed
from a zero diff. One live public record was wrong under §0.28 and is now right.

## 9. Postcode check (§0.24)

Every venue postcode is PO7, PO8, PO9, PO10 or PO11 — Havant, Waterlooville, Emsworth, Hayling
Island, Rowlands Castle, Purbrook. All inside this source's declared Hampshire region. Zero
out-of-region rejects.

The Swallow address disagreement recorded at 00:34Z (source says 296 Middle Park Way PO9 4NL,
bndy record says 500 Dunsbury Way PO9 5BL) is unchanged. One pub, one place_id, same PO9
district. Not an item, recorded so a later run does not read it as new.

## 10. Validator (§6A step 8)

No enrichment field was written this run. No bio, no social URL, no location, no genre. The
only write was an event `ticketInformation` value derived from the source capture itself, not
from a scraped page, so there is no page text to quote and no evidence line to write. No
evidence file was created and no legacy file was touched.

```
python3 scripts/enrichment_validate.py --records <empty set> --mode gate

0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```

**0 FAIL. Exit 0.**

The `NAME_BILLING` WARN raised at 00:34Z against
`Through the Decades Duo - Mal & Lena` (`71b57165-40a0-4dc1-a650-8007fd137cba`) still stands.
This run did **not** rename the record. The 00:34Z run had already gathered the evidence — the
act's own page reads `Through The Decades - Duo` — and decided against a rename; reversing a
sibling run's same-day judgment on a record about which this run has no new evidence is the
two-runs-fighting pattern v2.19 exists to stop. The item is with Jason as
`through-the-decades-name-carries-member-tail`.

## 11. Snapshot

Rewritten to `data/state/sceniceye-last-page.txt`: same week, same 35 comparable lines,
`Fetched` line updated to this run. One normalisation rule added to the header (rule 9:
strip a trailing comma, full stop or slash from the venue cell; skip blank lines when
diffing) so the next run reproduces this run's exact comparison.

This run wrote to bndy, so the §6A step 7 fail-closed gate binds. The snapshot write succeeded.

## 12. `CTO-INBOX.md`

**Nothing raised.** Every finding in this run is already fingerprinted in that file:
`sceniceye-daily-import-second-namespace`, `sceniceye-golden-lion-havant-duplicate-placeid`,
`through-the-decades-name-carries-member-tail`, `sceniceye-mode-not-declared`,
`sceniceye-third-surface-needs-ruling`, `sceniceye-outage-cost-11-rows-15-16-aug`,
`run-report-path-collides-on-second-firing`, `search-event-daterange-ignored`,
`record-run-token-missing`.

Inbox rule 3 says an empty run does not append. The §0.28 correction is a rule working, not an
item. The Farmstock skip is §0.23 working. Neither is a defect.

## 13. `record_run`

Not attempted. `record-run-token-missing` (2026-08-08) is open and `SOURCE_RUNS_TOKEN` is
unset. Non-blocking per the task contract. `run-summary.jsonl` was appended (§6A step 7b).

## 14. What the next run should expect

- The snapshot is current. The curator rolls on a Thursday; the next roll is 27 August.
- `sceniceye-daily-import` took the whole week twenty minutes ahead of the 00:34Z task and
  every record still carries only that namespace. This task now has nothing to write on a
  normal week. **The redundancy question is the live one and it needs a ruling, not a run's
  decision.**
- The §6D key is absent from all 18 records, so `get_by_external_id` on the canonical key
  will keep missing. Idempotency for this task rests entirely on the artist+venue+date
  sentinel.
