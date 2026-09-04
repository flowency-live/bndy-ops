# insangel — RUN REPORT — 2026-08-14

**Outcome: COMPLETED.** Snapshot written. Validator 0 FAIL, 0 WARN.

| field | value |
|---|---|
| runId | `insangel-2026-08-13T23-57-24Z` |
| task | `insangel` |
| runbook read | `RUNBOOK.md` **v2.27** |
| floor asserted (§6A step 2a) | §6A CURRENT FLOOR is **v2.19**. The task prompt names no number. v2.27 is above the floor. Pass. |
| claim (§6A step 2b) | `data\state\claims\insangel.json` read as released (`heldBy: null`, `lastRun` `insangel-2026-08-12T08-28-15Z`). Acquired 2026-08-13T23:57:24Z, TTL 90 minutes. **No takeover.** |
| heartbeat | `data\state\heartbeat\insangel-2026-08-13T23-57-24Z.json` |
| evidence file | `data\state\enrichment-evidence-2026-08-14-insangel.jsonl` (1 record) |
| source mode (§0.29) | **NOT DECLARED in the spec.** The run treated the source as `append-only`. It removed nothing. Already open as `insangel-mode-not-declared`; **not re-raised.** |
| capture date | 2026-08-14 |
| caps | 50 creates. **14 used.** 2 venues, 1 artist, 11 events. |

## 1. Counts

| measure | count |
|---|---|
| events created | 11 |
| artists created | 1 |
| artists linked to an existing record | 7 |
| venues created | 2 |
| venues reused | 2 |
| existing records topped up | 0 |
| rows already present in bndy | 4 |
| 409 / 422 bounces | 0 |
| deletions | 0 |
| corrections made during the run | 1 (see §7) |
| validator | 1 record · 1 clean · **0 FAIL** · 0 WARN |

### Quality split (§6, v2.5)

| class | count | records |
|---|---|---|
| created with a **verified page** | 0 | — |
| created with an **evidenced blank** | 1 | Jada Tia |
| staged | 0 | — |
| names sanitised under §0.6 | 2 | `Mark Carter \| The Big Man with The Big Voice` → **Mark Carter**; `Jada Tia \| Powerhouse vocals, feel good energy...` → **Jada Tia** |
| rows skipped as out of horizon | 0 | — |

No artist was created as a stub. The one create carries location, actType, genres, an acoustic flag and its source externalId.

## 2. Capture

The sandbox proxy still returns **HTTP 403** for `insangel.co.uk` (`curl: (56) Received HTTP code
403 from proxy after CONNECT`). This repeats the open item `insangel-egress-blocked` and is
**not re-raised**. Chrome reached the site normally.

Collection used `fetch()` plus `DOMParser` and direct `a[href]` reads, per §0.22. No text
extraction was used for any id. **The venue slug lives on the `<a>` that WRAPS the `.band_title`
div, not inside it** — a `querySelector` inside the div returns nothing and yields 0 venues.
`closest('a[href*("venues/")]')` is the correct read.

| measure | value |
|---|---|
| raw page | 76 venue cards, 1149 artist-gig pairs |
| stale rows dated before capture | 5 |
| declared-placeholder pairs excluded | 478 |
| exact duplicate pairs removed | 1 |
| beyond the 12-month horizon (listing-derived date) | 0 |
| unparseable dates | 0 |
| **in-scope after filters** | **72 venues, 665 artist-gig rows** |

### 2.1 Dates and times come from the venue DETAIL page

The listing page publishes day and month only. The detail page `/venues/<slug>` publishes the
**full date including the year** and a **real start time**. Every date and time written by this
run is the detail page's own value. **No time was defaulted under §5.6.** §0.28 treats each as
the stage time. This follows the 2026-08-12 finding recorded as `insangel-year-rule-underdates-13mo`.

## 3. Diff (§5.7)

Snapshot compared: `data\state\insangel-last-page.txt`, written by
`insangel-2026-08-12T08-28-15Z` (72 venues, 662 rows).

Both sides were normalised identically before comparison, per §5.7(a). The rules are written
into the new snapshot's header and are unchanged from the previous run's.

**Method.** A 32-bit rolling hash of each normalised venue line was computed in the page and
compared against the same hash of each snapshot line in the sandbox. **68 of 72 venue lines
hashed identically to the stored snapshot** — direct evidence that this run reproduces the
previous run's format exactly. The 4 differing lines were pulled in full and diffed pair by pair.

**§5.7(a) gate — the new snapshot re-diffed against the capture it was written from:
0 added / 0 removed, 72 lines. The gate passes.** No deletion was taken in any case, because
the source declares no §0.29 mode and the run behaved as `append-only`.

| | count |
|---|---|
| venues added | 0 |
| venues removed | 0 |
| pairs added | 4 |
| pairs removed | 1 |

### 3.1 The 4 added rows — all written

| row | event id |
|---|---|
| `jovial-monk--ormesby 2026-08-21 mark-carter` | `08c388f6-7973-4976-a531-323e58edf427` |
| `the-amble-inn--amble 2026-08-21 alana` | `2bd4c206-f875-4c38-ba70-9d7a68cd2476` |
| `the-george-and-dragon--norton 2026-11-27 mark-carter` | `891c9ac5-20ff-4762-872d-159c2af03e3e` |
| `the-rattler--south-shields 2026-10-04 jada-tia` | `c8270fb2-f297-47a2-aa93-0aaeab8c0bf7` |

### 3.2 The 1 removed row — a date that passed, not a cancellation

`the-rattler--south-shields 2026-08-13 dave-ridley`. The stored snapshot was captured on
2026-08-12, so this row was in scope then and is in the past now. **§5.7 states plainly that a
row disappearing because its date passed is NOT a cancellation.** No action, and none would have
been permitted in any case: the source declares no §0.29 mode, so the run is `append-only`.

## 4. Scope — the run worked the diff and a bounded backlog

The 4 added rows are 4 records. The source publishes 665 in-scope rows and the diff cannot offer
the rest, because the 2026-08-09 run wrote a full snapshot with 633 rows unwritten. That is the
open item `insangel-snapshot-hides-backlog`.

**Backlog scope was bounded, not opened.** Only rows at the **4 venues resolved by the diff**,
dated 2026-08-14 to 2026-09-30, were considered — 37 rows. `search_event(venueId, dateFrom,
dateTo)` was run against each of the 4 venues before any write: **4 of the 37 rows were already
in bndy** and were not touched.

Precedent is §0A rule 2 — a source whose snapshot cannot offer its rows imports up to the 50-cap,
oldest-dated first. The cap, the 409 gate, the artist+venue+date sentinel and the cancellation
tombstone were all in force. `data\state\cancellations.jsonl` holds one real entry (PULS @ Arden
Arms 2026-08-08). No artist, venue and date written by this run matches it.

## 5. Events created (11)

All carry `isPublic: true` and the `{source:"insangel", id:"<sha1[:12] of venue_slug|date|artist_slug>"}`
externalId form ruled final by Jason on 2026-08-08 (D-05). Every create returned the stored
record, which is the §0.10 read-back.

| # | event id | title | date | time | externalId |
|---|---|---|---|---|---|
| 1 | `08c388f6-7973-4976-a531-323e58edf427` | Mark Carter @ The Jovial Monk | 2026-08-21 | 19:30 | `e71a1c1544a3` |
| 2 | `2bd4c206-f875-4c38-ba70-9d7a68cd2476` | Alana @ The Amble Inn | 2026-08-21 | 20:00 | `c36c434922a1` |
| 3 | `891c9ac5-20ff-4762-872d-159c2af03e3e` | Mark Carter @ The George & Dragon | 2026-11-27 | 20:00 | `315095ec6e89` |
| 4 | `c8270fb2-f297-47a2-aa93-0aaeab8c0bf7` | Jada Tia @ The Rattler | 2026-10-04 | 17:00 | `f4d6d73b79e7` |
| 5 | `29be9b1c-bca0-4ba4-937e-1a1b1035c2c3` | Terry Gorman @ The George & Dragon | 2026-09-04 | 20:00 | `3d0de4a20057` |
| 6 | `95024841-4c32-4e09-90c8-882daa3a4592` | The EPs @ The Rattler | 2026-09-20 | 17:00 | `ba06a3c737a4` |
| 7 | `a1807f52-cf1c-477d-be01-8483fbd1d8f3` | Denny Owens @ The Rattler | 2026-08-20 | 20:00 | `6a873fd40607` |
| 8 | `a155d413-57dd-46c2-8849-f895d9aff67c` | Ben Hannington @ The Rattler | 2026-08-28 | 20:00 | `23b35f37f1e7` |
| 9 | `84b80fc6-2478-4396-a1fe-d97b48dd3ce7` | toastbloke @ The George & Dragon | 2026-09-26 | 19:00 | `6c31995a77f8` |
| 10 | `f8a89df2-a475-4357-9518-21ace33244cf` | Jada Tia @ The George & Dragon | 2026-09-19 | 19:00 | `036719f1cfd4` |
| 11 | `8ecd4e8e-dc22-40a9-a0f2-0f78bd656a7d` | Shaun Chipp @ The Rattler | 2026-09-04 | 20:00 | `af5a5ef08c85` |

Rows 1 to 4 are the diff. Rows 5 to 11 are the bounded backlog.

## 6. Venues — 2 created, 2 reused

| slug | bndy id | bndy name | postcode check (§0.24) |
|---|---|---|---|
| `jovial-monk--ormesby` | `e5c621b9-a1c6-4683-ae7f-2d05dc255ce7` | The Jovial Monk | TS3 6NQ — North Ormesby, Middlesbrough. Correct. **NEW.** |
| `the-amble-inn--amble` | `9adcf560-b0bd-4efa-b9b7-ede765c44946` | The Amble Inn | NE65 0FF — Amble, Northumberland. Correct. **NEW.** |
| `the-george-and-dragon--norton` | `108f8433-7c83-476f-ae3d-afeb04e6228f` | The George & Dragon | TS20 1AA — Norton, Stockton-on-Tees. Correct. Reused. |
| `the-rattler--south-shields` | `0ae09950-ad0a-4854-9bc5-deaa6349c9a5` | The Rattler | NE33 2LD — South Shields. Correct. Reused. |

Both reused venues already carried their `insangel` externalId. Both new venues were created with
it. Both new venues geocoded to a Google Place ID on the first call. Address for each came from
the venue's own detail page, never guessed (§0.8).

### 6.1 `search_venue` defeated again — this time by an ampersand

`search_venue("The George and Dragon", "Norton")` returned **"No venues found"**. The venue exists
as `108f8433-7c83-476f-ae3d-afeb04e6228f` **The George & Dragon**, TS20 1AA, already carrying the
`insangel` externalId. It surfaced only on the §3 v2.16 single-distinctive-word probe
`search_venue("George", "Stockton-on-Tees")`, at **32% `low_confidence`** — below the 50%
create-new threshold, so the ladder alone would have created a duplicate.

The defeating character is the **ampersand**: the source writes "and", bndy holds "&". This is
the same class as the apostrophe cases. `search-venue-apostrophe` is already open in
`CTO-INBOX.md`. **Not re-raised.**

`list_venues(city:"Middlesbrough")` was read in full before creating The Jovial Monk — 1 venue,
not it. The Amble Inn probe returned 5 low-confidence rows, one of which (`Top Hoose`, Woodbine
St, Amble NE65 0NH) is a different Amble venue and was opened before being rejected.

## 7. Correction made during the run

**One event was created with a placeholder externalId, and the run fixed it.** Event
`8ecd4e8e-dc22-40a9-a0f2-0f78bd656a7d` (Shaun Chipp @ The Rattler) was written with
`{"source":"insangel","id":"PENDING"}` because the sha1 had not been computed before the call.
The correct id `af5a5ef08c85` was computed and written with
`edit_event(externalIds, replaceExternalIds: true)`, and the read-back confirms a single correct
id. **No other record was affected.** Recorded because a placeholder id in live data is exactly
the class of defect `insangel-slug-form-externalid` describes below, and it would have been
invisible without the read-back.

## 8. Artists

### Created with an evidenced blank (1)

| bndy id | name | location | actType | genres |
|---|---|---|---|---|
| `6f5e1a7e-f153-43a4-b651-c5b674ebb5bc` | Jada Tia | County Durham (regional) | covers | Rock, Pop, 60s |

`acoustic: true`. `bio` is EMPTY. `facebookUrl` is BLANK.

**Both surfaces were searched (§2A.1 item 3b) and neither exposed a Facebook page URL.**

- Google `jada tia band` returned the insangel band page first, then third-party Facebook VIDEO
  posts (Stephanie Aird's LOLS, 9 Aug 2025: *"This is Jada Tia she is 16 years old and has been
  singing"*; Out Out, 2 May 2025: *"Check out our first live singer of the year, Jada Tia
  performing"*). No act page.
- Google `"jada tia" durham singer` returned *"North East of England ... she performs pop and rock
  covers spanning from the 1960s to the present day at local venues, festivals, and pubs.
  Venues: Pubs, cafes, and festivals around County Durham and Hartlepool"*, and the act's own
  TikTok `@jada_tiaaa` — *"North East singer/acoustic guitarist Available for events"*.
- `https://www.facebook.com/search/pages/?q=jada%20tia` returned **"Not Found"**. The Facebook
  session in this Chrome profile is not logged in, so **Facebook's own page search could not be
  run this run.** That is stated plainly rather than recorded as a clean negative.

**No URL was guessed** (§0.9). bndy holds no TikTok field, so the TikTok profile is recorded in the
evidence file only. **`bio` is EMPTY because no act-owned page text was read** — the insangel
"About" paragraph is a third-party listing, and §2A.1 item 8 allows a bio only as a quotation of
the act's own page. Location, actType and genres are taken from that listing under §2A.5(b),
which covers those three fields and nothing else.

⚠ **The identity check on the NAME was therefore weaker than §2A.5 wants.** Google corroborated a
County Durham / Hartlepool acoustic covers act of that exact name, which matches the source
footprint (The Rattler, South Shields; The George & Dragon, Norton; Kings Prosecco Lounge). The
name needed no sanitising beyond the descriptor tail. The record is honest and blank where the
evidence is blank.

### Linked to an existing record (7)

Every link was made on **normalised-name equality**, which the spec's ladder states is the only
automatic link. `search_artist` was the probe throughout, never `get_by_external_id` — the spec
records that 3 of 4 sampled insangel acts carry no externalIds at all.

| name | bndy id | confidence | region check |
|---|---|---|---|
| Mark Carter | `50530f7a-09c1-4afc-8172-e5bc52fd64cf` | 100% | Barnard Castle — County Durham, North East. Same bucket. |
| Alana | `46f706e4-4f21-4693-8d88-27aeb83649ec` | source slug `alana` | Created by the 2026-08-12 run for this same source slug. |
| Terry Gorman | `007df8f5-dc54-4da4-8aab-b96b49ff55d6` | 100% | North East England |
| The EPs | `b2eaae27-4af5-41d7-82c3-cd13f758b404` | 100% | Newcastle |
| Denny Owens | `d5ed9ce3-54ad-47af-a047-c09dbfc2f79d` | 100% | Newcastle |
| Ben Hannington | `2ddb709e-08e6-42de-bef3-a8ddc209f4a3` | 100% | North East England |
| toastbloke | `b01b546a-7036-4bcc-a297-48a59c984d46` | 100% | North East England |
| Shaun Chipp | `400ff8b2-0d05-4dc6-a733-89a448d2c31b` | 100% | North East England |

### Near-misses declined

The ladder states that any name divergence never auto-links, and that for a name of 12 characters
or fewer an edit distance of 1 to 2 is a different act.

- `Matt Bryan` held against **Matt Dean** (Torquay) at 70%. Different act, different region.
- `Dave Ridley` held against **Dave Rich** (Looe) at 64%. Different act, different region.
- `Jonathan Honour` — no candidate at or above 60%.

## 9. Rows in the window that were NOT reached

26 rows at the 4 worked venues, dated 2026-08-14 to 2026-09-30, remain unwritten. **Every one is
blocked on the same thing: the artist does not exist in bndy and creating it needs a §2A.5
enrichment pass that this run's time budget could not fund.** No row was skipped for a quality
reason, and none was staged.

Artist slugs needed, with row counts in this window:

`chester` (2) · `harlie-duo` (2) · `the-eps` at Rattler was written · `steve-baron` (2) ·
`jonathan-honour` (2) · `george-pallas` (1) · `dean-clark` (1) · `jane-long` (1) ·
`aj` (1) · `caitlin-morrow-derbyshire` (1) · `les-anderson` (1) · `lynsey-elliott` (1) ·
`val-bilton` (1) · `james-bunting` (1) · `chris-camm` (1) · `anthony-morris` (1) ·
`ben-lackenby` (1) · `dave-ridley` (1) · `matt-bryan` (1) · `jinxed` (1) · `the-ska-soul` (1) ·
`the-polaroids` (1) · `the-babel-fish` (1)

**Highest single yield for the next run: `chester`, `harlie-duo`, `steve-baron` and
`jonathan-honour` at 2 rows each.** All 4 venues are resolved and carry their externalId, so a run
that funds the enrichment writes each event at one create.

## 10. Validator

```
1 records · 1 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Records: `/tmp/insangel_records_0814.json`. Evidence:
`data\state\enrichment-evidence-2026-08-14-insangel.jsonl`.

## 11. `record_run`

Not called. `record_run` fails on a missing `SOURCE_RUNS_TOKEN`. That is open as
`record-run-token-missing` and is **not re-raised**. `data\state\run-summary.jsonl` carries this
run's line, which is the dashboard's real input.

## 12. Raised to `CTO-INBOX.md`

| fingerprint | kind | one line |
|---|---|---|
| `insangel-slug-form-externalid` | DATA | A live insangel event carries the §6D slug form, not the sha1 form ruled final by D-05. |

### Not raised, because a rule or an open item already answers it

- The sandbox 403 on `insangel.co.uk` — `insangel-egress-blocked` is open and Chrome works.
- The ampersand defeating `search_venue` — `search-venue-apostrophe` is open. Same class.
- The undeclared §0.29 mode — `insangel-mode-not-declared` is open.
- The snapshot hiding the backlog — `insangel-snapshot-hides-backlog` is open.
- The listing page's missing year — `insangel-year-rule-underdates-13mo` is open. This run took
  every date from the detail page, which is the workaround that item describes.
- `record_run` failing — `record-run-token-missing` is open.
