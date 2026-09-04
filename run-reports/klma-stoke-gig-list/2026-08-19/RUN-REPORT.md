# KLMA Stoke gig list — RUN REPORT 2026-08-19

- **Run id:** `klma-stoke-gig-list-2026-08-19T03-09-01Z`
- **Outcome:** PARTIAL. 9 events created and verified. No artist could be created.
- **Runbook read:** `RUNBOOK.md` H1 **v2.27**. §6A CURRENT FLOOR **v2.19**. Assertion PASSES.
- **Prompt floor:** the task prompt names no number. It defers to §6A. No drift to report.
- **Spec read:** `sources/klma-stoke-gig-list.md` in full, including §VA and §VA.9.
- **Claim:** `data/state/claims/klma-stoke-gig-list.json` read `heldBy: null`, released by the
  2026-08-18T21:32Z run. Acquired normally. No takeover. TTL 2 hours per §6G.
- **Heartbeat:** `data/state/heartbeat/klma-stoke-gig-list-2026-08-19T03-09-01Z.json`.
- **Tombstones:** `data/state/cancellations.jsonl` holds 3 lines (PULS, Tubesnake). None matches
  any artist, venue or date this run wrote.
- **`enrichment.lock`:** absent, as §6A step 2b requires. Nothing recreated it.

---

## 1. THE HEADLINE — the diff was 0/0 and bndy was still missing 9 published gigs

**Section 1 diff: 0 added / 0 removed. Section 2 diff: 0 added / 0 removed.** On the run
contract as written, that is a no-change run and the correct action is to write the snapshot and
stop.

**It would have been the wrong action.** The sheet has published these 9 gigs for weeks. Not one
of them was in bndy this morning:

| Date | Act | Venue | Event id |
|---|---|---|---|
| 2026-08-21 | Statease Quo | Cosey Club | `4baaa2c6-1831-46ed-8e02-9f0dcfa5bb47` |
| 2026-08-22 | C&C Duo | The Grapes Inn | `1af4ae4c-8428-44ce-8f08-af1edda3ae9e` |
| 2026-08-22 | Trilogy Rock Band | The Black Cock | `96478107-78b3-43b4-9e20-cfcd905c8790` |
| 2026-08-27 | Danny Brab & Friends (acoustic night) | Greyhound Inn | `74654202-37d1-44d3-9039-e2fffa18b467` |
| 2026-08-29 | The Alice Band | Cosey Club | `daadea8a-7cef-4aa1-9d46-08a04ef37991` |
| 2026-08-30 | Dawson Dean | Higher Ground Cafe & Bar | `43a26b7a-8f29-4a15-8d5b-34359bc4bf45` |
| 2026-08-31 | C&C Duo | Slug & Lettuce, NUL | `ab10c544-efdf-4d66-8870-2801e7effdc2` |
| 2026-09-18 | Fools Life | Granville's Restaurant & Music Bar | `240cc960-2cff-4bfd-8ca0-77ac0e60b8ed` |
| 2026-09-19 | Danny Brab | The Beartown Tap | `a4498a67-f628-4ca7-a643-09555bbabcf9` |

⚠ **This is a different fault from the one raised yesterday.** `blocked-rows-not-re-presented-by-diff`
(2026-08-18) covers a row a run **skipped and then named in its report**, so the next run can
recover it by reading that report. **None of these 9 rows was ever named by any run.** They are
not in any report, not in any parking lot, and not in any diff. They were invisible.

**The measured cost.** Two of the nine are inside 48 hours of the gig (Statease Quo, 21 Aug;
C&C Duo and Trilogy, 22 Aug). Four more fall inside ten days. Raised as
`klma-zero-diff-hid-nine-missing-gigs`.

**How they were found, and it is cheap.** Group the sheet's future rows by artist, take the
artists with the most rows first (the spec's 2026-08-08 CTO ruling), and for each one call
`search_event(artistId, dateFrom, dateTo)` and compare against the sheet. One call per artist,
not one per row. 19 artists and 6 venue sweeps covered roughly 150 of the 240 near-term rows.

## 2. Chrome — still unreachable

`list_connected_browsers` returned `[]`. This is the same outage the enrichment task has now
logged for 29 consecutive firings since 2026-08-17T22:17Z. `klma-chrome-unreachable-blocks-artists`
is already open. **Not re-raised** (CTO-INBOX rule 5).

**What it cost this run: 9 acts remain unwritable**, each needing a `create_artist`, which
§2A.1 item 5 forbids without an identity check:

| Act | Row | `search_artist` result |
|---|---|---|
| **Molly Vulpine Band** | The Rigger, 2026-09-26 — a HEADLINE gig | nothing above 56%, 2,243 scanned |
| **Vavoom!!** | Cosey Club, 2026-09-04 | no match at all |
| **Groove 45** | Granville's, 2026-09-12 | top match `Groove Rats` 64%, a different act |
| **Blitzkrieg UK** | The Rigger, 2026-09-04, support | nothing above 60% |
| **The Thirteenth Turn** | The Rigger, 2026-09-04, support | nothing above 60% |
| **Deadwax** | The Rigger, 2026-09-18, support | nothing above 60% |
| **Boss Cass** | The Rigger, 2026-09-18, support | nothing above 60% |
| **Definitely KB** | The Bush At Brown Edge, 2026-09-05 | top match `Definitely Oasis` 69%, a different act |
| **KNUTMO FIVE** · **KANGARU** | Sugarmill, 2026-09-13, supports | nothing above 60% / no match |

The last three were already blocked yesterday and are unchanged. The first seven are new.

## 3. Capture

| Feed | Surface used | Result |
|---|---|---|
| Section 1, KLMA sheet | container `curl` on `gviz/tq?tqx=out:html` | HTTP 200, **148,450 bytes**, 427 DOM rows |
| Section 2, Sugarmill | `web_fetch` | 30 distinct gigs, all hrefs intact |
| **Cosey Club** | **`web_fetch`** | **REACHED — 19 dated shows to 10 Oct** |
| **The Rigger** | **`web_fetch`** | **REACHED — 15 dated shows to 27 Mar** |
| Eleven · Artisan Tap | not fetched | rows park-lotted, see §7 |

⚠ **Two §VA venues have a working surface and the spec says they do not.** §VA.1 records Cosey as
needing Chrome for its "Load More" tail, and the 2026-08-18 run recorded Eleven and The Rigger as
egress-blocked at HTTP 000. **`web_fetch` returned both pages complete this run.** Container `curl`
on `thecosey.co.uk` is still 403, so this is a tool difference, not a network change — the same
class as `sugarmill-webfetch-preserves-hrefs`. Raised as `cosey-rigger-webfetch-reachable`.

**Column layout re-verified.** 14 columns; header cells `[2]=Artist [3]=Venue & Location
[5]=Cost/Ticket [6]=Genre [7]=Link to Event`. Post-2026-08-06 mapping, no off-by-one. The header
row is DOM row 427 of 427 — last again — but its position is not stable, so it was located by
searching for `Link to Event`, not by taking the last row.

Raw capture: `data/raw/klma-stoke-gig-list/2026-08-19/`.

## 4. Diff (§5.7, §5.7(a))

**Section 1:** 426 normalised rows in, 426 in the stored snapshot. **0 added / 0 removed** on a
raw-line diff, so no keyed diff was needed and no formatting drift occurred in the 5.5 hours since
the 21:33Z snapshot.

**Section 2, Sugarmill:** 30 rows, **0 added / 0 removed**. Status markers unchanged
(`declan-mckenna` SOLD OUT, `arkayla` SOLD OUT, `the-year-grunge-broke` RESCHEDULED).

**Mode.** The spec declares no §0.29 mode. The run is **append-only**. Already raised as
`klma-no-delta-mode-declared`; not re-raised. **Nothing was deleted and nothing was hidden.**

**§5.7(a) SELF-DIFF GATE.** The written snapshot re-diffed against the capture it came from:

```
SECTION1: snapshot 426 rows, capture 426 rows, added 0, removed 0
SECTION2: snapshot  30 rows, capture  30 rows, added 0, removed 0
```

**0 added / 0 removed on both sections. PASS.**

## 5. Work order

Grouped by artist, largest group first, per the spec's 2026-08-08 CTO ruling: Danny Brab (20 rows
including the `& Friends` billings), Circa 81 (9), Ultraviolet (6), Ant Clowes Duo (5), Trilogy
Rock Band (4), C&C Duo (4), Classic Rockers Duo (4), then the 3-row and 2-row groups, then venue
sweeps for the rest. **Budget was not the limiting factor. No row was deferred for want of time.**

## 6. Records written — 9 created, all verified by `get_by_id` (§0.10)

| Event id | Title | Date | Time | Venue id | Artist id |
|---|---|---|---|---|---|
| `4baaa2c6-1831-46ed-8e02-9f0dcfa5bb47` | Statease Quo @ Cosey Club | 2026-08-21 | 21:00 **defaulted** | `LHrDNnXeCU1eirDOxUKc` | `FugkBu8ZOFpV5rq18CsZ` |
| `1af4ae4c-8428-44ce-8f08-af1edda3ae9e` | C&C Duo @ The Grapes Inn | 2026-08-22 | 14:00 | `c023cd5a-2cd5-4088-a72b-01e22b7136dc` | `GfYlNk9J3qqdWrxSnRPW` |
| `96478107-78b3-43b4-9e20-cfcd905c8790` | Trilogy Rock Band @ The Black Cock | 2026-08-22 | 20:30 | `C34vgRZar2gYJPcEydl9` | `XJ2gV4N1qIe6vK2R562Q` |
| `74654202-37d1-44d3-9039-e2fffa18b467` | Danny Brab & Friends (acoustic night) @ Greyhound Inn | 2026-08-27 | 20:30 | `Cj9cwXdV9nxx3J6IgjC1` | `FIT600aoQ5lpNSejGctN` |
| `daadea8a-7cef-4aa1-9d46-08a04ef37991` | The Alice Band @ Cosey Club | 2026-08-29 | 21:00 **defaulted** | `LHrDNnXeCU1eirDOxUKc` | `8p65oNjs93QWjrGmsJQk` |
| `43a26b7a-8f29-4a15-8d5b-34359bc4bf45` | Dawson Dean @ Higher Ground Cafe & Bar | 2026-08-30 | 19:00 **defaulted** | `niJqnN3DLyL3Ji9vfLOY` | `mBRvfim8KGXkpqmb3wVa` |
| `ab10c544-efdf-4d66-8870-2801e7effdc2` | C&C Duo @ Slug & Lettuce, NUL | 2026-08-31 | 15:00 | `2f60e4aa-419f-4553-8866-644dc4b1a57f` | `GfYlNk9J3qqdWrxSnRPW` |
| `240cc960-2cff-4bfd-8ca0-77ac0e60b8ed` | Fools Life @ Granville's Restaurant & Music Bar | 2026-09-18 | 21:00 **defaulted** | `pkmhj8ElmrfJWNoWLn6X` | `734923eb-24d6-437c-98ce-1c035763211c` |
| `a4498a67-f628-4ca7-a643-09555bbabcf9` | Danny Brab @ The Beartown Tap | 2026-09-19 | 20:00 | `9qjDw2qwkf4LEboUirdx` | `FIT600aoQ5lpNSejGctN` |

All 9 are `isPublic: true`, carry a §6D slug externalId under `klma-stoke-gig-list`, and were read
back with `get_by_id` (§0.10).

**Defaulted times: 4** (§5.6, server-applied, `startTimeDefaulted: true`). The sheet published no
time for Statease Quo, The Alice Band, Dawson Dean or Fools Life. The other five took the sheet's
own time.

**Ticketing (§CT):** every one of the 9 rows had a **blank** `Cost/Ticket` cell, so nothing was
written. §CT rule 2 — a blank cell is unknown, not free. No new vocabulary appeared this run.

**Ampersands written raw** (`C&C Duo`, `Granville's Restaurant & Music Bar`, `Higher Ground Cafe &
Bar`, `Slug & Lettuce`) and confirmed raw on read-back. §6B, and the exact error the 2026-08-18
run made and corrected.

**Name handling.** `Statease Quo - Top Local Tribute To The Mighty Quo` and `The Alice Band - Top
Local Party Band, Covers For All!!` were sanitised per §0.6 and the stripped names were then
**confirmed against the Cosey venue page** (`STATEASE QUO`, `THE ALICE BAND`), which is the naming
authority under §VA. `Danny & Friends (acoustic night)` resolved to the artist **Danny Brab**
`FIT600aoQ5lpNSejGctN` under the spec's alias table, with the billing kept in the event title
(§1A.5).

## 7. Rows NOT written, and why

- **Blocked on the identity check — 9 acts** (§2). Each needs `create_artist`; Chrome is down.
- **The WILKO double booking — 2 rows.** The sheet still bills WILKO at The White Lion,
  Macclesfield and The Bush at Brown Edge on 2026-08-29, submitted 42 seconds apart. One is wrong.
  Chrome is down, so WILKO's own page cannot settle it, and no new evidence arrived. Both rows stay
  unwritten under §0A(b). Already raised as `klma-wilko-two-venues-one-night`; not re-raised.
- **Park-lotted on the spec's `specialist_venues` list — roughly 45 near-term rows** at Artisan Tap
  and Eleven. The spec's two stated blockers for the park-lot are both resolved and this was raised
  yesterday as `artisan-tap-eleven-parklot-blockers-resolved`. **A run does not change a rule**
  (§0A.3 / §7), so the rows stay park-lotted. Not re-raised.
- **Rejected on the §6 accept/reject filter — 4 rows.** `The Band Jam @ The Bradeley Stratheden`
  (open jam, 08-30); `Alternative Open Mic @ Artisan Tap` (08-26 and 09-23); `Lo Tide Open Mic @
  Artisan Tap` (09-06). Same call as previous runs.
- **Not reached — roughly 40 single-row acts** at one-off venues in the 2026-08-19 → 2026-09-30
  window, plus everything beyond 2026-09-30. Named as a limit of this run's sweep, not as a
  decision. The method in §1 is repeatable and the next run should extend it.

## 8. Venue resolution — 0 created, 4 duplicate pairs found

**No venue was created this run.** Every venue resolved to an existing record.

⚠ **`search_venue` was defeated twice more, both times by the exact §3 (v2.16) trap.**

| Probe | Result |
|---|---|
| `search_venue("Slug and Lettuce", "Newcastle-under-Lyme")` | **no venues found**, 0 scanned |
| `search_venue("Slug", "Newcastle")` | the venue, at **21% `low_confidence`** — `2f60e4aa-419f-4553-8866-644dc4b1a57f` |
| `search_venue("The Grapes Inn", "Newcastle-under-Lyme")` | **no venues found** |
| `search_venue("Grapes", "Stoke-on-Trent")` | the venue, at **25% `low_confidence`** — `c023cd5a-2cd5-4088-a72b-01e22b7136dc` |
| `search_venue("Higher Ground Cafe", "Stoke-on-Trent")` | **no venues found** |
| `search_venue("Higher Ground", "Congleton")` | the venue, at **54% `low_confidence`** — `niJqnN3DLyL3Ji9vfLOY` |

Three venues, three misses on the obvious probe, three hits below the 50% "create new" threshold
that every source spec's match ladder uses. **Trusting the ladder would have created three
duplicate venues in one run.** §3's three-probe fallback is what stopped it, and this is now the
seventh and eighth confirmed instance on this source.

**Four duplicate venue pairs found while resolving. None merged — §0.11 forbids a merge inside an
import run.**

| Pub | Records | Note |
|---|---|---|
| The Albert, Brindley St, Newcastle | `4d12e4f8-84de-42c2-b79c-4972e2841f71` and `d0edb10a-4218-416a-b710-9228b5fcb4ac` | **both hold a klma externalId, and BOTH carry a Circa 81 event on 2026-09-13** — one gig, two public records |
| The New Florence, Dresden | `dca1edd2-5edf-48ba-b883-50efc60932b0` and `63f7392c-8a44-4adc-bbfd-7e6b325c333c` | both hold a klma externalId; **both carry a C&C Duo event on 2026-08-30** |
| The Glebe, Glebe St ST4 | `ano2IUt9HBfjJjm0mBke` and `4846f276-39bc-409e-8e6c-fb0802cf4d50` | both hold a klma externalId; the source's Glebe gigs are split across the two |
| The Princess Royal, Dresden | `n28ZWaM3zIV4kk2HmHdm` and `6c6ec5e6-f730-4c48-9248-0bfaed0e5042` | **already raised** 2026-08-12 as `princess-royal-dresden-duplicate`; both still carry a C&C Duo event on 2026-09-05 |

⚠ **All four pairs were created by THIS source**, and in three of the four the duplicate has
already propagated into duplicate public events. The artist+venue+date sentinel cannot see them,
because the venue half of the key differs.

**One garbled venue record.** `c023cd5a-2cd5-4088-a72b-01e22b7136dc` is named
`The Grapes Inn, Newcaple` — the sheet's typo for **Newchapel** — and its `city` field holds
`2 Station Rd`, a street. The record is otherwise correct (ST7 4QT, valid place_id). Not renamed:
the venue protocol has no unattended-rename authorisation matching artist §0.6's evidence bar,
which is the same limit the enrichment task recorded in `bv2a-firing09-name-mismatches-four-venues`.
The event title was written as `C&C Duo @ The Grapes Inn` so the typo does not render publicly.

## 9. §VA venue-authoritative checks

| Venue | Status | Finding |
|---|---|---|
| **Cosey Club** | **CHECKED** (`web_fetch`) | 19 dated shows to 10 Oct. Settled two names and one date — see below. |
| **The Rigger** | **CHECKED** (`web_fetch`) | 15 dated shows to 27 Mar. Confirmed the `Molly Vulpine Band` spelling and its 19:00 start. |
| **The Sugarmill** | **CHECKED** (`web_fetch`) | Sole-source feed. 30 rows, 0 added / 0 removed. |
| **Eleven** · **Artisan Tap** | **NOT CHECKED** | No row from either was imported — all park-lotted (§7). Artisan Tap still has no proven surface. Eleven was not probed this run; `web_fetch` should be tried next run given it worked for Cosey and The Rigger. |

**No row was imported from a venue whose page went unchecked.**

**Names the venue page settled (§VA authority table):**

| Sheet billing | Venue page | Written |
|---|---|---|
| `Statease Quo - Top Local Tribute To The Mighty Quo` | `STATEASE QUO` | **Statease Quo** |
| `The Alice Band - Top Local Party Band, Covers For All!!` | `THE ALICE BAND` | **The Alice Band** |
| `Molly Vulpyne's Band` | **`Molly Vulpine Band`** | not written — act absent from bndy, §2 |

**A date the venue page settled (§5.6b).** The sheet carries `Vavoom` at Cosey on **2026-09-04**
and `Vavoom!! - Rock'n'roll Rampage` on **2026-09-05**. The Cosey page lists **VAVOOM!! on Fri 04
Sept** and nothing on 05 Sept. One gig, 04 September. It could not be written — the act is not in
bndy and Chrome is down.

**Three phantom Cosey events confirmed live in bndy.** The Cosey page proves the second row of
each duplicate-submission pair is the wrong one, and bndy holds an event for each:

| bndy event | bndy date | Cosey page says that date is |
|---|---|---|
| `a0374f62-774b-47bf-9e51-e3c2c960a33b` Angel Of Harlem | 2026-09-11 | BRASSMONKEES |
| `0e0775d2-2278-456a-9aaa-790249f14d16` Ego King | 2026-09-19 | THE ENDINGS |
| `98d45730-3f56-4ce4-af8a-779841664577` The Vanz | 2026-09-26 | ARCTIC STEREO KILLERS |

**These are exactly the three ids already raised on 2026-08-15 as
`cosey-stale-one-day-shifted-events`.** Not re-raised. This run adds the venue-page evidence that
confirms all three are wrong-dated, and each has a correctly-dated sibling already in bndy
(09-05, 09-18, 09-25 respectively). They need a delete, which is not a run's job (§0.11).

**Sugarmill source faults — rechecked, unchanged.** `CHERRY KISS` still links to
`nottingham-1-the-island-quarter`, a different venue (23:00 club night, rejected anyway).
`THE YEAR GRUNGE BROKE` still carries a `2025-12-06` slug and ticket link against a listed date of
4 September 2026; bndy holds 2026-09-04 and that stays. `ELECTRIC FRIDAYS: CONFESSIONS` (21 Aug) is
still banner-only with no gig-guide row; club night by name, not captured.

## 10. QUALITY REPORT (§6, v2.5)

- Events created and read back: **9**.
- Artists created: **0**. **Nothing here is a stub, because nothing was created.**
- Venues created: **0**.
- Records created **with a verified page**: **0** — no record was created that needs one.
- Records created with an **evidenced blank**: **0**.
- Enrichment top-ups: **0**. Every one needs a page visit, which needs Chrome.
- Names sanitised under §0.6: **2** (Statease Quo, The Alice Band), both then confirmed against the
  venue's own page rather than left on a strip.
- Names staged as non-acts: **4** (The Band Jam, Alternative Open Mic ×2, Lo Tide Open Mic).
- Rows skipped: **11 named** — 9 blocked on the identity check, 2 held on the WILKO conflict —
  plus roughly 45 park-lotted and 4 rejected.
- Duplicate records found and reported, not touched: **4 venue pairs, 1 artist pair, 3 phantom
  events**.

## 11. Validator (§6A step 8)

```
0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```

**0 FAIL.** The run wrote no artist and no enrichment field, so there is no enrichment record to
validate and no evidence file. `enrichment-evidence-2026-08-19-klma-stoke-gig-list.jsonl` was not
created — writing an empty one would assert work that did not happen.

## 12. Gate bounces

**None.** No 409, no 422, no 500. Every call returned success and every write read back correctly.
Nine creates and zero duplicate bounces is itself the finding: all nine gigs really were absent.

## 13. Housekeeping

- Snapshot written to `data/state/klma-stoke-gig-list-last-page.txt`, both sections, with the
  normalisation rules and the 0/0 self-diff in the file. §6A step 7 fail-closed gate satisfied.
- `data/state/run-summary.jsonl` appended (one line, append-only).
- `20-Daily/2026-08-19.md` appended.
- `record_run` not called — `SOURCE_RUNS_TOKEN` is still unset. Known and not blocking
  (`record-run-token-missing`).
- Claim released with `heldBy: null`. Heartbeat rewritten to `completed`.

## 14. Raised to CTO-INBOX.md

| Fingerprint | Kind |
|---|---|
| `klma-zero-diff-hid-nine-missing-gigs` | RULE |
| `cosey-rigger-webfetch-reachable` | RULE |
| `klma-venue-duplicate-the-albert-newcastle` | DATA |
| `klma-venue-duplicate-new-florence-dresden` | DATA |
| `klma-venue-duplicate-glebe-stoke` | DATA |
| `klma-duplicate-artist-nu-call-billing-name` | DATA |
| `klma-grapes-inn-newcaple-garbled-record` | DATA |

Not re-raised, already present: `klma-chrome-unreachable-blocks-artists`,
`klma-no-delta-mode-declared`, `klma-header-row-no-longer-last`, `klma-wilko-two-venues-one-night`,
`cosey-stale-one-day-shifted-events`, `princess-royal-dresden-duplicate`,
`blocked-rows-not-re-presented-by-diff`, `artisan-tap-eleven-parklot-blockers-resolved`,
`sugarmill-dream-machine-supports-unsplit`, `sugarmill-status-marker-not-parsed`,
`klma-curl-reproduces-gviz-live`, `sugarmill-webfetch-preserves-hrefs`,
`record-run-token-missing`.

**One open item is now closed by evidence and needs no new line.** `john-not-reached` —
recorded 2026-08-08 as `john-sewell-not-reached`, *"John Sewell Music holds 9 gigs behind one
artist create. Not reached on budget. Highest single yield."* **John Sewell Music
`315d26f9-0a59-42a2-8f7c-f98efca1e36d` now holds 10 events**, every one carrying a §6D slug
externalId under this source, running from 2026-08-23 to 2026-11-21. A later run did the work. The
line can be struck.
