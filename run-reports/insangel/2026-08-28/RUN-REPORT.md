# insangel — RUN REPORT 2026-08-28

- **runId**: `insangel-2026-08-28T05-02-32Z`
- **outcome**: completed
- **runbook**: `RUNBOOK.md` v2.27. Floor in §6A is v2.19. The task prompt names no number. Pass.
- **spec**: `sources/insangel.md`
- **claim**: `data/state/claims/insangel.json`. It read `heldBy: null` at 05:02:32Z. Acquired, TTL 90 minutes, `expiresAt` 06:32:32Z. No takeover.
- **heartbeat**: `data/state/heartbeat/insangel-2026-08-28T05-02-32Z.json`
- **mode**: append-only. Nothing was deleted or hidden.

## 1. Counts

| Measure | Count |
|---|---|
| Events created | 8 |
| Events edited | 0 |
| Artists created | 0 |
| Artists matched to an existing record | 4 |
| Venues created | 0 |
| Venues matched to an existing record | 7 |
| Venue records enriched (provenance) | 1 |
| Rows skipped | 385 declared placeholders, 44 past-dated |
| Gate bounces (409 / 422 / 500) | 0 |
| Creates against the 50 cap | 8 |

No artist and no venue was created, so no record needed enrichment. The cap was not reached.

## 2. Capture

- Surface: **Chrome**. `fetch()` + `DOMParser`, reading `a[href]` directly per §0.22.
- The sandbox proxy still returns 403 `blocked-by-allowlist` for `insangel.co.uk`, and `web_fetch` returns an empty body. This matches the standing `insangel-chrome-is-a-working-surface` item. Not re-raised.
- HTTP 200, 708559 bytes, 76 venue cards, 1116 gig rows, 1127 artist-gig rows.
- Raw capture: `data/raw/insangel/2026-08-28/venues-capture.txt`.

## 3. Self-diff gate (§5.7a)

The snapshot body was rebuilt from the in-page capture line by line, then hashed on both sides.

- In-page SHA-256: `72b63a47112ce6a215cb4aa3bde8c2f1f0d374bfcfd7c432f1a8b9a21b5db040`, 18260 bytes.
- On-disk SHA-256: `72b63a47112ce6a215cb4aa3bde8c2f1f0d374bfcfd7c432f1a8b9a21b5db040`, 18260 bytes.
- **0 added / 0 removed. Gate passes.**

Every venue line was verified by an FNV-1a hash computed in the page and again on disk. 69 of 76 lines matched yesterday's snapshot exactly. The 7 changed lines were transferred in full and re-hashed.

## 4. Diff against the previous snapshot

Previous snapshot: `insangel-2026-08-27T12-44-59Z`, captured 2026-08-27T12:58:00Z.

- Venues added: 0
- Venues removed: 0
- Pairs added: 6
- Pairs removed: 4 — 2 past-dated, 2 future-dated

### Added pairs (all 6 imported)

| Venue slug | Date | Band slug | Weekday check |
|---|---|---|---|
| `cottage-tavern--cleadon` | 2026-09-18 | `ben-hannington` | Fri 18th Sep — matches |
| `g-w-horners--chester-le-street` | 2027-05-08 | `indie-scene-proposal` | Sat 8th May — matches |
| `the-denton--newcastle` | 2027-05-15 | `the-hybrids` | Sat 15th May — matches |
| `the-rattler--south-shields` | 2026-08-30 | `harlie` | Sun 30th Aug — matches |
| `three-brass-monkeys--whitley-bay` | 2026-09-13 | `ben-hannington` | Sun 13th Sep — matches |
| `vesta-tilleys--sunderland` | 2027-03-19 | `the-hybrids` | Fri 19th Mar — matches |

### Removed pairs — logged only, mode is append-only

| Venue slug | Date | Band slug | Reading |
|---|---|---|---|
| `g-w-horners--chester-le-street` | 2027-01-30 | `indie-scene-proposal` | The source moved this act to 2027-05-08. No bndy event held the 2027-01-30 date, so no stale sibling exists. Nothing to delete or edit. |
| `three-brass-monkeys--whitley-bay` | 2026-09-13 | `backing-tracks-solo-tbc` | A placeholder that the source replaced with a named act, Ben Hannington. §0.4 forbids an artist record for a placeholder, so no bndy record ever existed. |
| (2 rows) | before 2026-08-28 | — | Dates passed. Not a cancellation (§5.7). |

**No deletion was made. No tombstone was written.**

## 5. Tombstone check (§5.4)

`data/state/cancellations.jsonl` holds 9 lines. None matches any artist + venue + date processed this run.

## 6. Events created — full UUIDs

| Event id | Title | Date | Start | insangel externalId |
|---|---|---|---|---|
| `3392d7dd-67b3-42ff-a31d-c4c421d0ae36` | Ben Hannington @ The Cottage Tavern | 2026-09-18 | 21:00 defaulted | `18d1cef1e46d` |
| `f9f34519-e9ea-4645-b34f-0d298100cbe8` | Indie Scene Proposal @ GW Horners | 2027-05-08 | 21:00 defaulted | `045cc3f3e7a1` |
| `2fae0c5a-4faf-4914-b425-d3e720fb2eee` | Hybrids @ The Denton | 2027-05-15 | 21:00 defaulted | `bc66d4581a32` |
| `b4866040-1afe-4838-92a5-b2251fd8bf9f` | Harlie @ The Rattler | 2026-08-30 | 19:00 defaulted | `0808e63eebc4` |
| `f842e6d2-849a-4cdf-9179-7d3d828109ac` | Ben Hannington @ Three Brass Monkeys | 2026-09-13 | 19:00 defaulted | `f1c573262ae1` |
| `c36def93-6db5-4a4d-ac89-7ac4f118a72d` | Hybrids @ Vesta Tilley's | 2027-03-19 | 21:00 defaulted | `c46137bead0f` |
| `b61f7d20-d0ed-48cd-b1e6-d624545066cb` | Harlie @ Seatons Place to be | 2026-08-29 | 21:00 defaulted | `89cb8e705f6e` |
| `77ceaac7-70b1-4031-943c-5a7dda976c1a` | Audios @ Seatons Place to be | 2026-08-30 | 19:00 defaulted | `7c1f5bcc085f` |

All 8 were read back with `get_by_id` (§0.10). Every record holds `isPublic: true` and the correct sha1 externalId.

**All 8 start times are DEFAULTED under §5.6.** The listing page publishes no time. The server applied the rule and returned `startTimeDefaulted: true` on each.

The last two rows are not in today's diff. See §8.

## 7. Entities resolved

### Venues (7 matched, 0 created)

| Venue id | Name | insangel slug | How it resolved |
|---|---|---|---|
| `f82f3963-3d93-4a4a-9fcf-22ff307ac5e6` | The Cottage Tavern | `cottage-tavern--cleadon` | `get_by_external_id` missed. `search_venue("Cottage Tavern","Cleadon")` returned it at 78%. Postcode SR6 7PL is Cleadon, Sunderland — county agrees (§0.24). |
| `35b992a2-2903-4172-be1b-11d8e9ca35ec` | GW Horners | `g-w-horners--chester-le-street` | `search_venue("G W Horners","Chester le Street")` returned **no venues found**. The §3 fallback probe `search_venue("Horners","Chester-le-Street")` returned it at 70%, already carrying the insangel id. Sixth instance of the §3 miss class. Not re-raised — `search-venue-apostrophe` is already open. |
| `cdac6734-32df-4f95-b2d9-e262d4a9185a` | The Denton | `the-denton--newcastle` | externalId |
| `0ae09950-ad0a-4854-9bc5-deaa6349c9a5` | The Rattler | `the-rattler--south-shields` | externalId |
| `e2e40de8-d510-485d-8cfc-5a0007a7440c` | Three Brass Monkeys | `three-brass-monkeys--whitley-bay` | externalId |
| `4e392026-581b-4069-b323-aa2b8b52b837` | Vesta Tilley's | `vesta-tilleys--sunderland` | externalId |
| `187c3f78-88e3-4b59-92d1-a0519d271bd8` | Seatons Place to be | `place-to-be--seaton-carew` | externalId |

**Provenance added.** `f82f3963-3d93-4a4a-9fcf-22ff307ac5e6` held only `poster-import-2026-05-03`. The insangel id `cottage-tavern--cleadon` was added alongside it per the spec cross-source rule, with `replaceExternalIds: true` and the complete intended array in one call (§6B). Read back: both ids present.

### Artists (4 matched, 0 created)

| Artist id | Name | insangel slug | How it resolved |
|---|---|---|---|
| `2ddb709e-08e6-42de-bef3-a8ddc209f4a3` | Ben Hannington | `ben-hannington` | externalId |
| `9e34ac77-10bf-4f39-834e-033d0042a4fe` | Indie Scene Proposal | `indie-scene-proposal` | `get_by_external_id` missed. `search_artist` returned normalised name EQUALITY at 100%, location Gateshead. Automatic link under the spec ladder. |
| `1c2bff07-453a-45c0-ba73-0e133b9f92ae` | Hybrids | `the-hybrids` | externalId. The record already carries onthecasemusic ids too. That is correct cross-source overlap and was left alone. |
| `f3d5b24a-6bab-4ceb-96e4-a226f02f1d6c` | Harlie Duo | `harlie` | See below. |
| `caccd0d2-7cea-4f5b-9fe0-8f16d4a9c933` | Audios | `audios` | `get_by_external_id` missed. `search_artist` returned normalised name EQUALITY at 100%, location North East. Automatic link. |

**The `harlie` decision, stated in full.** `search_artist("Harlie")` returns `Charlie` (Whitley Bay) at **86%** and `Harlie Duo` (North East England) at **60%**. The spec ladder forbids linking Charlie: names of 12 characters or fewer with an edit distance of 1 are a different act. No record named exactly `Harlie` exists in bndy — 3282 records were scanned. `Harlie Duo` is the same act under **§1 ADR-023**: an act qualifier in the same region is the same artist, and the qualifier belongs in the event title, never a new record. So the run linked to `Harlie Duo` and titled the events `Harlie @ ...`. A previous run reached the same conclusion — `e8b01c13-4f69-469f-ba94-1d6f125b1c1a`, Harlie @ Newton Grange 2027-07-03, is already live on the same artist id. The decision is now consistent across every insangel Harlie row.

## 8. Two writes outside the diff, and why

The diff offered 6 rows. Two more were written:

- `b61f7d20-d0ed-48cd-b1e6-d624545066cb` — Harlie @ Seatons Place to be, **2026-08-29, tomorrow**.
- `77ceaac7-70b1-4031-943c-5a7dda976c1a` — Audios @ Seatons Place to be, **2026-08-30**.

Both rows are published on today's page and both were in yesterday's snapshot, so the diff could never offer them. They were found while resolving the `harlie` identity question above. They are not an inferred coverage gap: the source rows were read directly, and `search_event` on the venue confirmed the events were absent (§5.4 v2.19).

This is the standing `insangel-snapshot-hides-backlog` defect, already open. **A measurement is added below rather than a new item.**

**Measured today.** `Harlie Duo` `f3d5b24a-6bab-4ceb-96e4-a226f02f1d6c` holds **4 forward events in bndy**. Today's capture bills that act at 11 venues. `Seatons Place to be` holds **1 forward event**; today's capture bills 4 rows there. The backlog is large and a diff run cannot reach it. It needs its own bounded catch-up lane, not more nightly diffs. No further backlog rows were written, to avoid an arbitrary partial sweep.

## 9. Year rule and the weekday check

The listing page prints a weekday with every date. The spec year rule was applied for the snapshot, so the diff stays stable. The weekday was then checked against the derived date on every in-scope row.

- **14 of 697 rows** print a weekday that does not match the derived year, and **all 14** match when one year is added.
- **None of the 14 is among the 8 rows written today.** Every written date has a matching weekday. No date correction was applied and none was needed.

This is the open `insangel-weekday-proves-2027-year` item. Not re-raised.

## 10. Quality (§6, v2.5)

| Class | Count |
|---|---|
| Records created with a verified page | 0 — no artist and no venue was created |
| Records created with an evidenced blank | 0 |
| Records skipped, with a reason | 385 declared placeholder rows, 44 past-dated rows |
| Names sanitised or skipped as non-acts under §0.6 | 0 sanitised. The listing publishes bare act names with no promo tail. |
| Stubs created | **0** |

The run created no name-only stub. Every event hangs on an artist record that already existed and already carries a location.

## 11. Skips

- **385 rows** on the five declared placeholder slugs: `acoustic-covers-tbc`, `cover-band-tbc`, `covers-solo-duo-tbc`, `tribute-tbc`, `showcase-tbc` (§0.4).
- `backing-tracks-solo-tbc` also appeared. It is a placeholder and the spec list does not hold it. Standing item `insangel-placeholder-list-incomplete`. It was excluded from the pipeline and, to keep the diff stable, retained in the snapshot exactly as yesterday.
- **44 rows** dated before the capture date.
- Venue slugs `private-function--houghton` and `private-function` are §0.23 named non-places. Neither offered a new row today.

## 12. Validator (§6A step 8)

`scripts/enrichment_validate.py --records /tmp/ins/records.json --evidence data/state/enrichment-evidence-2026-08-28-insangel.jsonl`

`0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]` — exit 0. The run enriched no artist and no venue, so the record set is empty and the evidence file is empty.

## 13. Snapshot

Written to `data/state/insangel-last-page.txt`. 76 venue lines, 697 pairs, 18260 bytes in the body, SHA-256 `72b63a47112ce6a215cb4aa3bde8c2f1f0d374bfcfd7c432f1a8b9a21b5db040`. The normalisation rules are in the file header.

## 14. Tool notes

- `record_run` was not called. It fails on a missing `SOURCE_RUNS_TOKEN`. Standing item `record-run-token-missing`. Not blocking.
- `javascript_tool` truncates its return at roughly 1000 characters, and blocks any output holding `=` (§6B). The capture was therefore transferred by per-line hash comparison, and only the 7 changed lines were moved in full. This is a working method for this source and is cheaper than paging the whole page out.
- `search_event(venueId, dateFrom, dateTo)` ignored `dateTo` and returned every forward event. Harmless here. Not raised as a defect on one instance.

## 15. CTO-INBOX

Nothing new was appended. Every finding this run matches an item already open: `insangel-mode-not-declared`, `insangel-snapshot-hides-backlog`, `insangel-weekday-proves-2027-year`, `insangel-placeholder-list-incomplete`, `insangel-chrome-is-a-working-surface`, `search-venue-apostrophe`, `record-run-token-missing`.
