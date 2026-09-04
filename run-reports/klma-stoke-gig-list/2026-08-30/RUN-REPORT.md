# KLMA STOKE GIG LIST — RUN REPORT 2026-08-30

**Run id:** `klma-stoke-gig-list-2026-08-30T03-08-52Z`
**Outcome:** COMPLETED. Snapshot written. Validator 0 FAIL.
**Runbook read:** `RUNBOOK.md` H1 **v2.27**. Floor in §6A is **v2.19**. Pass.
**Prompt floor:** the deployed prompt names no number. It defers to §6A step 2a. No drift to report.
**Mode (§0.29):** the spec declares no mode. The run defaulted to **append-only**. Nothing was
deleted and nothing was hidden. Already raised as `klma-no-delta-mode-declared`; not re-raised.

**Headline: the diff was empty and the run still wrote five real gigs.** See §6.

---

## 1. Gate log (§6A steps 0 to 3)

| Step | Result |
|---|---|
| 0 heartbeat | `data\state\heartbeat\klma-stoke-gig-list-2026-08-30T03-08-52Z.json` written first. |
| 1 date | `2026-08-30` from the container shell. |
| 2 runbook + spec | Both read in full. |
| 2a floor | v2.27 >= v2.19. Pass. |
| 2b claim | `data\state\claims\klma-stoke-gig-list.json` read `heldBy: null`. Acquired. TTL 2 hours. No takeover. |
| 3 tools | bndy MCP reachable. **Chrome UNREACHABLE.** See §2. |

## 2. Chrome was unreachable, and it did not stop the run

The 00:18Z and 01:18Z enrichment runs report the same outage today. Neither capture section
needs Chrome.

- **Section 1** was captured by container `curl` on the gviz endpoint, the surface the
  2026-08-28 and 2026-08-29 runs used. HTTP 200, 95,662 bytes,
  md5 `82865f9e3cc779d9a62db17091bc40d7`, 367 normalised rows. The spec bans **`web_fetch`**
  of gviz, which serves an eight-week-stale 13-column copy. It does not ban curl. **The
  freshness test is the layout:** today's capture carries `Cost/Ticket` at index 5 and rows
  dated into 2027, so it is not the stale copy. The column map was re-verified against the
  trailing header row before any row was parsed.
- **Section 2** was captured by `web_fetch`. Container curl for that domain returned HTTP 000
  again this run (not allowlisted).

**What Chrome's absence cost:** the §2A.1 item 3b Facebook surface. Under §2A.5 no artist may
be created without an identity check, so a row needing a NEW artist would have been skipped.
**No row needed one.** Every act written today already exists in bndy. Cost this run: zero.

## 3. Capture

| Section | Surface | Rows |
|---|---|---|
| 1 KLMA sheet | container curl, gviz `tqx=out:html` | 367 normalised lines |
| 2 Sugarmill | `web_fetch` | 28 distinct gigs |

Raw: `data\raw\klma-stoke-gig-list\2026-08-30\gviz.html` ·
`data\raw\sugarmill\2026-08-30\gig-guide-rows.txt`

## 4. Diff (§5.7 and §5.7(a))

Normalisation was applied to both sides before comparing, per the rules written into the
snapshot header.

### 5.7(a) gate

| Section | Re-diff of the new snapshot against its own capture | Verdict |
|---|---|---|
| 1 | **0 added / 0 removed** | PASSED |
| 2 | **0 added / 0 removed** | PASSED |

⚠ The section 2 gate failed 18/18 on its first attempt. The cause was mine, not the source: the
raw capture file carries a sixth NOTE field, and the first regeneration did not strip the
trailing ` |` before splitting. **The extraction step is now written into the snapshot header**
so the next run reproduces it exactly. Nothing was deleted, and the run is append-only, so no
removal depended on the gate.

### Section 1 — 2 line-added / 29 line-removed, of which ZERO are real

**There are no genuine added rows today.** The last capture was 7.5 hours ago.

- The two "added" lines are `04/01/2041` and `06/01/22041` — the same two junk rows as
  yesterday, with a trailing space now trimmed by normalisation rule 4. A formatting
  improvement, not a source change.
- **27 of the 29 removals are past-dated rows for Saturday 29 August** falling off the top of
  the sheet. §5.7: a row dropping because its date passed is not a cancellation.
- The other two removals are the trailing-space forms of the two junk rows above.

**No future-dated row was removed.** Nothing to action under §0.17, and the mode is
append-only regardless.

### Section 2 — 0 added / 0 removed / 0 changed

Status markers unchanged (`arkayla` SOLD OUT, `the-year-grunge-broke` RESCHEDULED).
`ELECTRIC FRIDAYS` and `DEVILS NIGHT` remain banner-only with no gig-guide row. Both are club
nights by name and are not captured.

## 5. Tombstone check (§5.4, v2.19)

`data\state\cancellations.jsonl` — 9 lines, searched on artist, venue and date for every gig
written today. **No hit.** No `TOMBSTONED-` disposal was needed.

`20-Daily\2026-08-30.md` and `data\state\run-summary.jsonl` were read before any write
(§5.4 v2.19). Only the two enrichment firings have run today. Neither touched an event.

## 6. ⚠ THE ZERO DIFF WAS HIDING FIVE PUBLISHED GIGS

`klma-zero-diff-hid-nine-missing-gigs` has been open since 2026-08-19. It says a 0/0 diff is
not evidence that the sheet and bndy agree, because a row skipped on any earlier run is
written into the snapshot and can never be re-offered. **Today the diff was empty and the
budget was free, so the run tested that claim instead of stopping.**

**The method, and it is cheap.** Group the 362 future sheet rows by artist. Work the largest
groups first — the §"ORDER THE ADDED ROWS BY GIGS-PER-ARTIST" rule applies to a coverage probe
exactly as it does to added rows. For each of the largest, one `search_event(artistId, dateFrom,
dateTo)` returns that act's whole forward diary in bndy, and one local comparison names every
gap. **Seven artists cost 11 MCP reads and covered 106 of the 362 future rows — 29%.**

| Artist | Sheet future rows | In bndy | Gaps found |
|---|---|---|---|
| Danny Brab (incl. `Danny & Friends`) | 41 | 38 | **3** |
| Circa 81 | 22 | 22 | 0 |
| Crosshair | 12 | 12 | 0 |
| Trilogy Rock Band | 12 | 10 | **2** |
| John Sewell Music | 9 | 9 | 0 |
| Jane and the Hurricanes | 6 | 6 | 0 |
| Whiskey Rebel | 5 | 5 | 0 |
| **Total** | **107** | **102** | **5** |

**All five gaps were in the two largest groups.** The ordering rule paid for itself on the
first two probes. The remaining 255 future rows were not probed; the budget went to writing the
five gigs found rather than to more reading. The next run can continue from `The VANZ` family
(8 rows), `Stone Cold Sober...ish` (5) and `Classic Rockers Duo` (4).

⚠ **None of these five rows is new.** Every one was in yesterday's snapshot, and in the
snapshot before that. The diff could not offer them and never will. **This is a second dated
instance of `klma-zero-diff-hid-nine-missing-gigs`, and it now has a working detection method.**

## 7. Rows pipelined — five creates

| # | Row | bndy id |
|---|---|---|
| 1 | Danny Brab @ The Seabridge, 2026-10-02, 20:30 | `ee572609-5eda-4906-9c28-8fa378aab74b` |
| 2 | Danny Brab @ The Pickled Pig At The Bank House, 2026-10-09, 18:30 | `a3a00607-3873-4735-aafa-8885febca25d` |
| 3 | Danny Brab @ The Moorland Inn, 2026-12-05, 20:30 | `824a1dfc-cd63-4e82-9701-10e83ff0b951` |
| 4 | Trilogy Rock Band @ The Jolly Sailor, 2026-10-31, 21:00 | `bcb88100-6a3d-45e9-90a0-474d39c3a3f8` |
| 5 | Trilogy Rock Band @ The Moorland Inn, 2026-12-18, 20:30 | `27b1efa8-4ace-45f5-9ab6-45c2c195c4a9` |

**Every write was read back with `get_by_id` (§0.10).** All five returned `isPublic: true`, the
intended date, the intended time and the intended externalId.

### externalIds written (§6D slug form)

```
2026-10-02-danny-brab-the-seabridge
2026-10-09-danny-brab-the-pickled-pig-at-the-bank-house
2026-12-05-danny-brab-the-moorland-inn
2026-10-31-trilogy-rock-band-the-jolly-sailor
2026-12-18-trilogy-rock-band-the-moorland-inn
```

Each was written as a complete single-element array in one call (§6B — `edit_event` replaces
and dedupes to one id per source).

## 8. Identity decisions

**Artists — two resolutions, zero creates, zero stubs.**

| Billing | Resolved to | Basis |
|---|---|---|
| `Danny Brab` | `FIT600aoQ5lpNSejGctN` | spec alias table (Jason ruling 2026-07-29). 38 existing events on this record. |
| `Trilogy Rock Band` | `XJ2gV4N1qIe6vK2R562Q` | spec alias table. NOT `Trilogy` (Newcastle upon Tyne) and NOT `Trilo3y` (Stockport). |

**Venues — five resolutions, zero creates.**

| Billing | Resolved to | Basis |
|---|---|---|
| `Seabridge, Seabridge` | `3CFhQW25LUmAqLx2MHlR` The Seabridge, Newcastle | The same record already carries the Circa 81 gig billed `The Seabridge, Clayton`. Seabridge and Clayton are adjacent Newcastle-under-Lyme suburbs. |
| `Pickled Pig, Stafford` | `902e7440-39b3-459b-bdbc-51a8932eff27` The Pickled Pig At The Bank House | Established mapping — the record already holds this act's 2026-12-11 gig. |
| `Moorland Inn, Burslem` | `hbXt7haW5QcV06fHixD0` The Moorland Inn, ST6 1JP | See the duplicate note below. |
| `The Jolly Sailor, Macclesfield` | `11827bd7-3ca3-46fa-8e65-a9437a63b736` | 63 Sunderland St, SK11 6HN. Already carries `klma-venue-cf4b2ea04857`. |
| `The Moorland Inn, Smallthorne` | `hbXt7haW5QcV06fHixD0` | Same pub. Moorland Road runs from Burslem into Smallthorne, and the postcode is the identity, not the area name (§0.24). |

⚠ **`Moorland Inn` exists twice in bndy.** `14d737bc-3891-4512-8ccb-22d2d83eae0b` "Moorland Inn"
and `hbXt7haW5QcV06fHixD0` "The Moorland Inn" hold **the same address, ST6 1JP**, under two
different Google Place IDs. **This run used `hbXt7haW5QcV06fHixD0`, because that record already
carries this source's externalId `venue-moorland-inn-burslem`** — a run follows the existing
provenance rather than starting a second one. It did not merge them (§0.11) and did not create
a third. Raised as `klma-venue-duplicate-moorland-inn-burslem`.

**Postcode check (§0.24):** ST6, ST15 and SK11 all sit inside the Staffordshire / South Cheshire
remit. No row was rejected on county.

## 9. `Cost/Ticket` mapping (§CT)

**All five rows carried a blank `Cost/Ticket` cell, so nothing was written.** §CT rule 2: a
blank cell does not mean free. No new vocabulary was seen this run.

## 10. §VA venue-authoritative checks

| Venue | Status | Finding |
|---|---|---|
| **The Sugarmill** | **CHECKED** — sole-source feed, 28 rows, no change | §4 and below |
| Cosey Club | **NOT FETCHED** — no row written at this venue this run | — |
| Eleven | **NOT FETCHED** — no row written at this venue this run | — |
| The Rigger | **NOT FETCHED** — no row written at this venue this run | — |
| Artisan Tap | **NOT FETCHED** — no row written, and still no proven surface | — |

**Sugarmill coverage was verified in full, not assumed.** One
`search_event(venueId: 333e73ff-…)` returned 26 forward events. **Every importable row in
section 2 is present in bndy.** The rejected rows are the venue's own club-night and day-party
programme — `VAMPIRE BALL 2026`, `SCENE. emo. metalcore…`, `West End Day Party: Live!`,
`80s Day Disco`, `Ska Day Party`, `TRANCE DAY PARTY`, `90s Day Party` — correctly absent under
§6 accept/reject and spec VA.9.

⚠ `from-the-jam-saturday-3rd-october-2026` (`c77955b4-9dbe-4433-bd18-43f95a1fb4c5`) is still
live in bndy and still absent from the source. The mode is append-only, so it was not deleted.
Already open as `from-the-jam-vanished-still-live`; not re-raised.

## 11. Data faults found while reading, not while writing

Three faults surfaced during the §6 coverage probe. **None blocked a write. None was fixed** —
a run adds, it does not merge or delete (§0.11).

1. **`Moorland Inn` duplicated** — §8 above. New: `klma-venue-duplicate-moorland-inn-burslem`.
2. **`Royal Oak` duplicated, and the duplicate has split a gig in two.** The single sheet row
   `Circa 81 The Royal Oak, Biddulph 2026-10-10` exists as **two live bndy events**:
   `fa548764-a1db-41cc-a062-7e546b67f067` at `7d2130e9-b351-40da-8080-cd06a9f706ce` and
   `06b160f1-41b9-42fe-979b-acb98f990f76` at `0x3dT0oH6L1WfVHVgTAP`. New:
   `klma-venue-duplicate-royal-oak-biddulph`.
3. **Two live events point at a venue that does not exist.** `6bf267cb-eb46-477e-87f0-071ec7570151`
   (2026-09-19) and `0d9ab5d7-c4c2-4744-b5fc-e6e829b3176a` (2026-11-14), both Circa 81 at
   `Bench & Bar, Fenton`, carry `venueId: UDR8xzQsgn3MLevSBO58`. `get_by_id` returns
   **`found: false`** for that id, and `search_event` renders the venue as "Unknown Venue".
   New: `klma-bench-bar-venueid-not-found`.

**Already open, seen again, not re-raised:** `klma-venue-duplicate-the-albert-newcastle`
(Circa 81 doubled on 2026-09-13 and 2026-12-20), `klma-venue-duplicate-old-star-uttoxeter`
(Crosshair doubled on 2026-10-16), `klma-venue-duplicate-butchers-arms-forsbrook`
(Whiskey Rebel doubled on 2026-08-30).

⚠ Event `242c4aff-f274-48ae-a01b-5cdac177bd20` holds **two** `klma-stoke-gig-list` externalIds
(`dbbffce38680` and `36a7b17b40f6`), which §6B says the dedupe fix makes impossible. It is a
pre-existing record and this run did not touch it. Same class as the open
`externalid-slug-drift`; not re-raised.

## 12. A shared `/tmp` path collided with yesterday's run

Writing `/tmp/newsnap.txt` returned **Permission denied**. The file was yesterday's KLMA run's
working copy, owned by `nobody`. The run moved to a run-scoped working directory
`/tmp/klma-run-2026-08-30T03-08-52Z` and continued.

⚠ **The snapshot was verified intact before and after.** The failed `cp` copied yesterday's
file over an identical copy of itself; md5 and byte count were unchanged. Already open as
`shared-tmp-collides-across-runs`; not re-raised. **Standing note for the next run: use a
run-scoped `/tmp` directory from the first write, not after the first collision.**

## 13. Validator (§6A step 8)

```
0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit 0. **`0 FAIL`.**

Evidence file: `data\state\enrichment-evidence-2026-08-30-klma-stoke-gig-list.jsonl` — created,
empty, and correctly so. **This run created no artist and wrote no enrichment field**, so there
is no bio, no page and no blank to evidence. The validator has nothing to check and says so.
This is the honest result, not a skipped step.

## 14. Quality measures (§6, v2.5)

| Measure | Count |
|---|---|
| Events created | **5** |
| Events edited | 0 |
| Artists created | **0** |
| Artists created with a verified page | 0 |
| Artists created on an evidenced blank | 0 |
| **Stubs created** | **0** |
| Venues created | **0** |
| Rows skipped | **0** |
| Rows deferred on budget | 255 future rows not coverage-probed (§6) |
| Names sanitised | 0 |
| Non-acts refused | 7 Sugarmill club-night and day-party rows (§10) |
| Gate bounces (409/422) | **0** |
| Deletions | **0** |
| Records hidden | **0** |

**Caps:** 5 creates against a 50-create cap. Not near it.
**Wall clock:** roughly 10 minutes against a 2-hour TTL.

## 15. Open items raised to `CTO-INBOX.md`

| Fingerprint | Kind |
|---|---|
| `klma-venue-duplicate-moorland-inn-burslem` | DATA |
| `klma-venue-duplicate-royal-oak-biddulph` | DATA |
| `klma-bench-bar-venueid-not-found` | DATA |
| `klma-artist-grouped-coverage-probe` | RULE |

**Not re-raised**, because each is already open: `klma-no-delta-mode-declared`,
`klma-zero-diff-hid-nine-missing-gigs`, `klma-venue-duplicate-the-albert-newcastle`,
`klma-venue-duplicate-old-star-uttoxeter`, `klma-venue-duplicate-butchers-arms-forsbrook`,
`from-the-jam-vanished-still-live`, `shared-tmp-collides-across-runs`, `externalid-slug-drift`,
`record-run-token-missing`, `klma-chrome-unreachable-blocks-artists`,
`run-report-path-collides-on-second-firing`.

## 16. `record_run`

Not attempted. `SOURCE_RUNS_TOKEN` is still unset (`record-run-token-missing`, open since
2026-08-08). Non-blocking. `data\state\run-summary.jsonl` is the dashboard's input and was
appended.
