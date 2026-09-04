# KLMA STOKE GIG LIST — RUN REPORT 2026-08-29

**Run id:** `klma-stoke-gig-list-2026-08-29T19-36-05Z`
**Outcome:** COMPLETED. Snapshot written. Validator 0 FAIL.
**Runbook read:** `RUNBOOK.md` H1 **v2.27**. Floor in §6A is **v2.19**. Pass.
**Prompt floor:** the deployed prompt names no number and defers to §6A step 2a. No drift to report.
**Mode (§0.29):** the spec declares no mode. The run defaulted to **append-only**. Nothing was
deleted and nothing was hidden. Already raised as `klma-no-delta-mode-declared`; not re-raised.

---

## 1. Gate log (§6A steps 0 to 3)

| Step | Result |
|---|---|
| 0 heartbeat | `data\state\heartbeat\klma-stoke-gig-list-2026-08-29T19-36-05Z.json` written first. |
| 1 date | `2026-08-29` from the container shell. |
| 2 runbook + spec | Both read in full. |
| 2a floor | v2.27 >= v2.19. Pass. |
| 2b claim | `data\state\claims\klma-stoke-gig-list.json` read `heldBy: null`. Acquired. TTL 2 hours. No takeover. |
| 3 tools | bndy MCP reachable. **Chrome UNREACHABLE — no connected browser.** See §2. |

## 2. Chrome was unreachable, and it did not stop the run

`list_connected_browsers` returned `[]`. The in-app browser pane was denied for
`docs.google.com`, and this session cannot approve a site.

**Neither section needed Chrome.**

- **Section 1** was captured by container `curl` on the gviz endpoint — the same surface the
  2026-08-28 run used. HTTP 200, 102,836 bytes, md5 `5d853961b2cd51a6992873448cf46e71`,
  396 DOM rows, 8 `td` cells on every row. The spec's ban is on **`web_fetch`** of gviz
  (which serves an eight-week-stale 13-column copy), not on curl. **The freshness test is the
  layout:** today's capture carries the `Cost/Ticket` column at index 5 and rows dated to
  2027, so it is not the stale copy. Column mapping was re-verified against the trailing
  header row before a single row was parsed.
- **Section 2** was captured by `web_fetch` of the Sugarmill page, again as on 2026-08-28.
  Container curl for that domain returned HTTP 000 (not allowlisted), re-tested this run.

**What Chrome's absence DID cost:** the §2A.1 item 3b Facebook surface. Under §2A.5 no artist
may be created without an identity check, so a row needing a NEW artist would have been
skipped. **No row needed one.** Every act in today's six added rows already exists in bndy.
Cost this run: zero.

## 3. Capture

| Section | Surface | Rows |
|---|---|---|
| 1 KLMA sheet | container curl, gviz `tqx=out:html` | 395 normalised lines |
| 2 Sugarmill | `web_fetch` | 28 distinct gigs |

Raw: `data\raw\klma-stoke-gig-list\2026-08-29\gviz.html` ·
`data\raw\sugarmill\2026-08-29\gig-guide-rows.txt`

## 4. Diff (§5.7 and §5.7(a))

**Normalisation was applied to both sides before comparing**, per the eight rules written into
the snapshot header. The self-diff gate was then run.

### 5.7(a) gate

| Section | Re-diff of the new snapshot against its own capture | Verdict |
|---|---|---|
| 1 | **0 added / 0 removed** | PASSED |
| 2 | **0 added / 0 removed** | PASSED |

The gate is reported for completeness. The run is append-only and deleted nothing, so no
removal depended on it.

### Section 1 — 10 line-added / 19 line-removed, of which 6 are real

**Four added/removed pairs are the SAME gig, reformatted by the curator's sheet.** The leading
cell flips between a form timestamp and a float row-id, and the Date cell flips between
`D/M/YYYY` and `Weekday, Month D, YYYY`. Fingerprint `klma-sheet-reformats-rows-defeats-line-diff`
is already open; not re-raised.

| Reformatted, not new | Date |
|---|---|
| Joy Diversion @ Diversion, Macclesfield | 2026-12-12 |
| The SickNotes @ The Jug, Newcastle | 2026-11-28 |
| Whiskey Rebel @ Moorville Hall | 2026-11-14 |
| Eddie Lees Back to Back @ The Raven, Crewe | 2026-08-30 |

**Removals: 19 total, 18 past-dated.** Rows for 25 to 28 August fell off the top of the sheet
because their dates passed. That is not a cancellation (§5.7).

**The one future-dated removal is not a loss.**

| Removed row | Still listed as |
|---|---|
| `The Vanz, The Cosey, Haslington, 2026-09-25, 9pm, Blues/Rock` | `The VANZ ROXX, The Cosey Club, Haslington, 2026-09-25, 9.15pm, ROCK` |

Same act family, same venue, same night, re-billed by the curator. Per the spec's alias table
`The VANZ ROXX` is its own artist record and the billing belongs in the event title. **Nothing
was deleted; the mode is append-only regardless.**

### Section 2 — 0 added / 0 removed / 0 changed

ARKAYLA still reads `Starts: 7:00 pm`, which matches the edit the 2026-08-28 run made against
the stale Gigantic URL. Status markers unchanged (`arkayla` SOLD OUT,
`the-year-grunge-broke` RESCHEDULED). `ELECTRIC FRIDAYS` and `DEVILS NIGHT` remain banner-only
with no gig-guide row; both are club nights by name and are not captured.

## 5. Tombstone check (§5.4, v2.19)

`data\state\cancellations.jsonl` — 9 lines, searched on artist, venue and date for all six
added rows. **No hit.** Nothing was tombstoned. No `TOMBSTONED-` disposal was needed.

## 6. ⚠ ANOTHER WRITER WROTE THIS SOURCE DURING THIS RUN

**Four of the six added rows were already in bndy when this run reached them, created at
`2026-08-29T19:34:2xZ` — between two and four minutes before this run wrote its heartbeat at
`19:36:05Z`.** All four were created with **empty `externalIds`**, so they carry no provenance
and no idempotency key, and the claim file read `heldBy: null` throughout.

| Event | Created at |
|---|---|
| `2b137438-6c2a-4f65-a55c-bfc5e3e7043c` C&C Duo @ The Gresley Arms | 19:34:29Z |
| `e65a2b8f-0f01-4772-b6e8-4c801bcb078e` Fracxura + Death Warmed Up @ Grumpys | 19:34:25Z |
| `9d564002-a1a7-407e-a282-2daa5758ea6d` The Clash Of The Beat @ The Rigger | 19:34:34Z |
| `fc5047b6-2990-4522-b89f-0de8046d95e4` Steve Paul @ The Priory | (empty ids, same cohort) |

This run did not fight it. **It completed the four records instead** — attaching the §6D
externalId, the `Cost/Ticket` mapping and, where the source published one, the ticket URL.
That is the additive, idempotent outcome and it leaves the four rows re-importable.

Raised as `klma-unclaimed-writer-1934z-four-events`. Prior dated instances exist
(`unclaimed-klma-event-creates-0023z`, `klma-unclaimed-writer-1208z-nine-events`,
`unclaimed-creates-2026-08-20-daytime`). **This one is new information because the overlap was
concurrent with a held claim, not merely unattributed.**

## 7. Work order (spec ruling 2026-08-08)

Added rows were grouped by artist and the largest group worked first. `C&C Duo` held two of
the six rows and went first. Every other act held one. **No row was deferred on budget. The
whole diff was worked.**

## 8. Rows pipelined — all six

| # | Row | Disposal | bndy id |
|---|---|---|---|
| 1 | C&C Duo @ The Gresley Arms, 2026-08-30, 18:00, `Free entry` | **EDIT** — externalId + price attached to the pre-existing record | `2b137438-6c2a-4f65-a55c-bfc5e3e7043c` |
| 2 | C&C Duo @ The Bridge Inn, Stone, 2026-09-19, 20:30, `Free` | **CREATE** | `414e8ff2-5da3-4e31-a41c-2dfa100b629a` |
| 3 | Tanky/Electrifying 80's @ The Globe, Nantwich, 2026-08-30, 19:45, `Free` | **CREATE** | `c7a82ec6-f758-4e95-a43f-173f2d8f10ba` |
| 4 | Fracxura + Death Warmed Up @ Grumpys, 2026-08-29, 20:00, `£5.00` | **EDIT** — externalId attached | `e65a2b8f-0f01-4772-b6e8-4c801bcb078e` |
| 5 | Steve Paul @ The Priory, Leek, 2026-09-05, 21:00, `No charge` | **EDIT** — externalId + price attached | `fc5047b6-2990-4522-b89f-0de8046d95e4` |
| 6 | Clash of the Beat @ The Rigger, 2026-09-11, `Doors 7pm`, `£11.00` | **EDIT** — externalId + ticketUrl + doors attached | `9d564002-a1a7-407e-a282-2daa5758ea6d` |

**Every write was read back with `get_by_id` or returned in the edit response (§0.10).**

### externalIds written (§6D slug form)

```
2026-08-30-cc-duo-the-gresley-arms
2026-09-19-cc-duo-the-bridge-inn
2026-08-30-tanky-electrifying-80s-show-the-globe
2026-08-29-fracxura-grumpys-gb-motorcycles
2026-09-05-steve-paul-the-priory
2026-09-11-the-clash-of-the-beat-the-rigger
```

All six were written as a complete single-element array in one call (§6B — `edit_event`
replaces and dedupes to one id per source).

## 9. Identity decisions

**Artists — six resolutions, zero creates, zero stubs.**

| Billing | Resolved to | Basis |
|---|---|---|
| `C&C Duo` | `GfYlNk9J3qqdWrxSnRPW` | 100% name, Stoke-on-Trent, footprint is this sheet |
| `Tanky/Electrifying 80's` | `a603777d-25f1-4f4c-9d13-866a4a0fe49c` | spec alias table, §2A.5 verified-source-name, name kept verbatim |
| `Steve Paul` | `413d7903-7473-4a85-96f3-0c52075cf6c8` | 100% name, "Staffordshire UK", Leek is inside that footprint |
| `Fracxura` | `548cae91-da45-43eb-a59d-6bd54cbec7d0` | 100% name, Stoke-on-Trent, sole record |
| `Death Warmed Up` | `63f1b685-3949-47a3-9e37-a5b63e1a9891` | 100% name, Worksop — see the caveat below |
| `Clash of the Beat` | `da160138-6a70-4c6f-b963-17202e95bb96` | §1A.2 bare-core variant of `The Clash Of The Beat`, Congleton |

**`Clash of the Beat` — the footprint check, in full.** The existing record is
`The Clash Of The Beat`, Congleton. The incoming billing drops the leading `The`, which is a
bare-core variant and triggers §1A.2. Its event history holds `Beartown Brewery, Congleton`
(2026-08-30, Congleton Jazz & Blues Festival). Congleton is Cheshire East and borders
Newcastle-under-Lyme. **Same canonical footprint, adjacent town — §1A.2 rule 3 says SAME
artist, reuse.** No second record was created. The event title keeps the venue-page spelling
`The Clash Of The Beat`.

⚠ **`Death Warmed Up` — a link this run inherited rather than made.** The other writer had
already attached the Worksop `Death Warmed Up` to the Grumpys bill before this run read it.
Worksop is East Midlands; Longport is West Midlands, and the two footprints do not touch. A
punk bill drawing a band 50 miles is ordinary, and §1A forbids creating an indistinguishable
second record on the strength of a doubt, so **the link stands and nothing was created**.
Raised as `klma-death-warmed-up-worksop-vs-stoke` so a human can look at it. **This is the one
identity call in the run that is not hard-evidenced.**

**Venues — five resolutions, zero creates.**

| Billing | Resolved to | Note |
|---|---|---|
| `Gresley Arms, Alsager` | `1ce9b251-44b2-4a90-90ea-cc045f5038f1` | The Gresley Arms, ST7 8BQ. Already carries `venue-gresley-arms-alsager`. The record's town reads Alsagers Bank, the sheet says Alsager. The place_id is the identity (§1) and a prior run made this mapping; not re-litigated. |
| `The Bridge Inn, Stone` | `zeqBH5shQluh20e8m4rL` | 100%, ST15 8EB |
| `The Globe, Nantwich` | `1e3d87a1-8752-411d-864a-e06c2b0b89c3` | 100%, CW5 7EA — matches the address in the sheet cell exactly |
| `Grumpys, Canal Street Longport` | `HDfCfgFwyafaVHhzYA5z` | **§2.16 in action.** `search_venue("Grumpys","Longport")` → *no venues found*. The loose probe on the city returned `Grumpy's-GB Motorcycles`, Canal St ST6 4NW, at **30% low_confidence** — already carrying `venue-grumpys-longport`. The apostrophe defeats the search, exactly as recorded. **Opened before creating. No duplicate.** |
| `The Rigger` | `YOMsEVdj9Y7OMMy88HFV` | spec VA.1 |

**Postcode check (§0.24):** ST7, ST15, ST13, ST6 and CW5 all sit inside the Staffordshire /
South Cheshire remit. No row was rejected on county.

## 10. §VA venue-authoritative checks

| Venue | Status | Finding |
|---|---|---|
| **The Rigger** | **CHECKED** — `theriggervenue.co.uk/upcoming-event-guide`, fetched clean | See below |
| **The Sugarmill** | **CHECKED** — sole-source feed, 28 rows, no change | §4 |
| Cosey Club | **NOT FETCHED** — no added row at this venue this run | — |
| Eleven | **NOT FETCHED** — no added row at this venue this run | — |
| Artisan Tap | **NOT FETCHED** — no added row, and still no proven surface | — |

⚠ **The Rigger's own page does NOT list the 2026-09-11 gig.** Its listing runs
Sun 30 Aug · Mon 31 Aug · Wed 02 Sep · Thu 03 Sep · Fri 04 Sep · Sat 05 Sep · **Fri 18 Sep** ·
Wed 23 Sep · … — chronological, with 11 September absent, so it is missing from the page and
not merely behind the "Load More" tail.

**KLMA is the only listing surface for this gig, and it is corroborated.** The sheet carries
`https://www.gigantic.com/clash-of-the-beat-tickets/newcastle-under-lyme-the-rigger/2026-09-11-19-00`
— a live Gigantic URL whose path names this venue. **Names corrected: none** (the venue page
had nothing to correct against). **Contradictions: none.** The gig was imported on KLMA plus
the ticket URL, and this paragraph is the §VA.5 disclosure that the venue page did not confirm it.

**Time (§0.28).** The sheet publishes `Doors 7pm` and no stage time. Doors was used as
`startTime` (19:00), and `Doors 19:00` was written to `ticketInformation`. The Gigantic URL
independently encodes `19-00`.

## 11. `Cost/Ticket` mapping (§CT)

| Row | Cell | `ticketed` | `price` | `ticketInformation` |
|---|---|---|---|---|
| C&C Duo, Gresley Arms | `Free entry` | false | `Free` | — |
| C&C Duo, Bridge Inn | `Free` | false | `Free` | — |
| Tanky, The Globe | `Free` | false | `Free` | — |
| Fracxura, Grumpys | `£5.00` | true | `£5.00` | — |
| **Steve Paul, The Priory** | **`No charge`** | false | `Free` | — |
| Clash of the Beat, The Rigger | `£11.00` | true | `£11.00` | `Doors 19:00` |

⚠ **`No charge` is a spelling the §CT table does not carry.** It was ruled by the table's own
standing instruction — *a value that states a zero price is `Free`* — and the row was **not**
parked over a ticketing string. Per the prompt's standing rule a run never edits a rule, so the
spec was **not** edited; the new spelling is raised as `klma-ct-vocabulary-no-charge` for the
CTO to add. This is the third dated instance of the same shape (`FREE` and `£0.00` on
2026-08-08).

## 12. Multi-artist bill (§4)

`Fracxura + Death Warmed Up` is one bill. The record in bndy carries **both** acts in
`artistIds`, which is the shipped multi-artist model, not the §4 "one discrete event per
artist" model. This run did **not** split it: splitting would have created a second Fracxura
event at the same venue and date, which the sentinel exists to prevent. The tension is already
open as `rule4-vs-shipped-artistids-sentinel` and is not re-raised.

Sibling ids for a future parent-event attach: `e65a2b8f-0f01-4772-b6e8-4c801bcb078e`
(Fracxura, Death Warmed Up).

## 13. Validator (§6A step 8)

```
0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit 0. **`0 FAIL`.**

Evidence file: `data\state\enrichment-evidence-2026-08-29-klma-stoke-gig-list.jsonl` — created,
empty, and correctly so. **This run created no artist and wrote no enrichment field**, so there
is no bio, no page and no blank to evidence. The validator has nothing to check and says so.
This is the honest result, not a skipped step.

## 14. Quality measures (§6, v2.5)

| Measure | Count |
|---|---|
| Events created | **2** |
| Events edited (provenance and ticketing completed) | **4** |
| Artists created | **0** |
| Artists created with a verified page | 0 |
| Artists created on an evidenced blank | 0 |
| **Stubs created** | **0** |
| Venues created | **0** |
| Rows skipped | **0** |
| Rows deferred on budget | **0** |
| Names sanitised | 0 (no billing contamination in today's six rows) |
| Non-acts refused | 0 |
| Gate bounces (409/422) | **0** |
| Deletions | **0** |
| Records hidden | **0** |

**Caps:** 6 writes against a 50-create cap. Not near it.

## 15. Open items raised to `CTO-INBOX.md`

| Fingerprint | Kind |
|---|---|
| `klma-unclaimed-writer-1934z-four-events` | DATA |
| `klma-curl-is-a-trusted-gviz-surface` | RULE |
| `klma-ct-vocabulary-no-charge` | RULE |
| `klma-death-warmed-up-worksop-vs-stoke` | DATA |

**Not re-raised**, because each is already open: `klma-no-delta-mode-declared`,
`klma-sheet-reformats-rows-defeats-line-diff`, `rule4-vs-shipped-artistids-sentinel`,
`record-run-token-missing`, `search-venue-apostrophe`, `run-report-path-collides-on-second-firing`.

## 16. `record_run`

Not attempted. `SOURCE_RUNS_TOKEN` is still unset (`record-run-token-missing`, open since
2026-08-08). Non-blocking. `data\state\run-summary.jsonl` is the dashboard's input and was
appended.
