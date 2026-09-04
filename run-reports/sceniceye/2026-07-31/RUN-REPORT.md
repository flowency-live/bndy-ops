---
type: run-report
source: sceniceye
run_date: 2026-07-31
task_file_version: "v2.1"
outcome: HELD — no bndy writes
tags: [run-report, sceniceye, bndy-population]
---

# Scenic Eye weekly import — RUN REPORT 2026-07-31

**Outcome: capture succeeded, stale-week check PASSED, import HELD. Zero bndy writes.**

Run date established from the device clock (**2026-07-31, Friday**) — the workspace shell
was unavailable ("VM service not running. The service failed to start."), so
`date +%Y-%m-%d` could not be run. The task file permits the device-clock fallback.

Chrome was connected. `scenicmind.co.uk/sceniceye` rendered fully and was read via
`get_page_text` (sceniceye.co.uk frameset correctly bypassed). No truncation — the page
tail, footer and contact block were all present.

---

## 1. Stale-week check — PASSED

| Check | Value |
|---|---|
| Page edition header | **30 July – 5 August 2026** |
| Today | 2026-07-31 (Fri) |
| Expected upcoming Thu–Sun | 30 Jul – 2 Aug 2026 |
| Verdict | **Current edition. Not stale.** |

This is the opposite of the 2026-07-29 run, where the 23–29 Jul edition was still live and
the trap correctly fired. The guide has rolled over. Processing proceeded.

Day sections **Thu 30 Jul, Mon 3 Aug, Tue 4 Aug, Wed 5 Aug** all read "No gigs listed" —
genuinely empty, not a parse failure. Thu 30 Jul is past-dated relative to today and is
empty anyway, so no §0.14 rejections were needed.

---

## 2. Why the import was held

Read-only work completed in full. Writes held on three blockers — the first is the same
hard stop that held `bv2-gigsnewsimport` on 2026-07-30 and is **still unruled**.

### 2.1 `MASTER-IMPORT-RUNBOOK.md` does not exist in the vault (unchanged since 2026-07-30)

The task file's first line declares itself **subordinate** to `MASTER-IMPORT-RUNBOOK.md`
(v1.10+) — "The runbook wins on any conflict. This file holds ONLY Scenic Eye-specific
procedure and quirks." A whole-vault grep for `MASTER-IMPORT-RUNBOOK` returns only the
2026-07-30 daily note and the gigs-news run report — i.e. only prior complaints about its
absence. The document itself is not present.

Sections cited as governing this run, all unavailable:

| Section | What it governs |
|---|---|
| §0.1 | never create/re-enable schedules |
| §0.2 | no identity judgment |
| §0.6 | ticket-marker handling → `ticketed: true` |
| §0.9 | obey every bounce / 409 top-up procedure |
| §0.10 | post-create verification |
| §0.12 | never write QA notes into bndy fields |
| §0.14 | past-dated entry handling |
| §0.16 | owner-managed records untouchable |
| §0.18 | blank beats wrong / empty beats a wrong default |
| §1A / §2A.3 | artist footprint check + enrich-inline (FB search + page visit) |
| §3 / §3.4 | venue rules + same-name-different-town disambiguation |
| §4 / §5 | one discrete event per artist |
| §5.5 / §5.6 / §5.7 | horizon / start-time defaults / snapshot diff |
| §6 | 50-creates cap |

The only runbook present is `10-Projects/bndy-population/RUNBOOK.md` (2026-04-30), a
different script-driven pipeline with none of these sections.

This matters more here than for any other source: **this is the source that caused the
2026-07-12 duplicate incident**, and §1A/§2A/§3.4/§0.9 are precisely the gates written to
stop it recurring. Proceeding would mean inventing those gates from scratch while creating
4 new artists against a database that still contains unresolved duplicates from last time
(see §2.3).

### 2.2 No snapshot file → the §5.7 two-sided diff cannot run

`sceniceye-last-page.txt` does not exist anywhere in the vault (globbed vault-wide; also no
`SCENICEYE-RUN-REPORT-2026-07-29.md`, which the task file cites as holding the Hi Fest
discovery leads — that report is not in the vault either). With no prior side, every row is
an "addition" and the two-sided diff degrades to a bulk first-import with no
removal-detection.

**The snapshot was deliberately NOT written this run.** Writing it would make next week's
diff treat all 9 of today's candidates as already-processed and silently skip them. Holding
it keeps them recoverable — same call as the 2026-07-30 gigs-news run.

### 2.3 externalId scheme conflict — and it is live on the records

The task file specifies `{source: "sceniceye", id: "<date>-<artist-slug>-<venue-slug>"}`.
Every venue found in bndy already carries **two** competing external ids:

```
{source: "sceniceye",              id: "venue-the-westleigh-havant"}
{source: "sceniceye-daily-import", id: "venue_the-westleigh"}
```

So a prior run used `sceniceye-daily-import` with a `venue_`/underscore scheme, and another
used `sceniceye` with a hyphen scheme. Neither matches the `<date>-<artist>-<venue>` event
scheme in the current task file. This is the same unruled conflict logged as gigs-news
blocker #3 on 2026-07-30.

**Worse:** the two Golden Lion records (§4) carry the *identical* externalId
`{source: "sceniceye-daily-import", id: "venue_the-golden-lion"}`. `get_by_external_id` is
therefore ambiguous for that key — idempotency is already broken for this venue.

---

## 3. Source capture — all 9 rows, verbatim

Edition **30 July – 5 August 2026**. Nine listings across three days.

| # | Date | Act (as printed) | Venue (as printed) | Time |
|---|---|---|---|---|
| 1 | Fri 31 Jul | Adie B — "Garden" | The Golden Lion, 54 Bedhampton Road, Havant, PO9 3EY | 7:00 PM – 9:00 PM |
| 2 | Fri 31 Jul | Matt O'Neil | The Westleigh, Westleigh Park, Martin Road, Havant, PO9 5TH | 8:00 PM – 10:00 PM |
| 3 | Sat 1 Aug | Atomic Badger | Cowplain Social Club, 54 London Road, Waterlooville | 8:30 PM |
| 4 | Sat 1 Aug | Phoenix Park | The Old House At Home, 2 South St, Havant | 9:00 PM |
| 5 | Sat 1 Aug | Carboncopy | The Heroes, 125 London Road, Waterlooville | 8:30 PM |
| 6 | Sat 1 Aug | Matt O'Neil | The Infinity Bar Hayling Island, 139 Elm Grove, PO11 9ED | 8:00 PM – 10:00 PM |
| 7 | Sun 2 Aug | Double X | The Golden Lion, 54 Bedhampton Road, Havant | 3:00 PM – 6:00 PM |
| 8 | Sun 2 Aug | Matt O'Neil | Robin Hood Inn - Rowlands castle, 26 The Green, PO9 6AB | 4:00 PM – 6:00 PM |
| 9 | Sun 2 Aug | Damien Lodrick | The Heroes, 125 London Road, Waterlooville, PO7 7DZ | 4:30 PM |

**Rejections: 0.** No open-mic / jam / karaoke / DJ-only / TBC rows in this edition. No
past-dated rows (Thu 30 Jul empty). No Hi Fest content — the weekender has passed, so the
open Hi Fest ruling does not block this run.

**Defaulted times: 0.** Every row carried an explicit time, as expected for this source.
Four rows are start-only (no end time) — that is the source's own format, not a default.

**Ticket markers: 0.** No 🎫 markers in this edition.

---

## 4. bndy reconciliation (read-only) — all 9 are genuinely new

Nothing from this edition is in bndy yet. Searched every candidate venue for events in
2026-07-30 → 2026-08-14: **zero matches** against any of the 9 rows. The only event in
range at any of these venues is `Forever Queen @ Cowplain Social Club` (2026-08-08,
`d62b8b2f-…`), which is not from this edition and is untouched.

### 4.1 Venues — all 7 already exist, none need creating

| Venue (source) | bndy record | id | Confidence |
|---|---|---|---|
| The Golden Lion, Havant | The Golden Lion | `d3200659-f23b-4a19-a2c3-63e036b75c56` | 100 |
| The Westleigh | The Westleigh | `11fbe3bb-6798-4c30-b34e-2b999648ac01` | 100 |
| Cowplain Social Club | Cowplain Social Club | `2f01ebc9-abce-4ff6-8b39-0bde440d45ff` | 100 |
| The Old House At Home | The Old House at Home, Havant | `349ca19c-fb7f-45e6-b9a1-bebdb16a0634` | 72 |
| The Heroes | The Heroes, Waterlooville | `eb51991a-b082-433c-90e4-123340283271` | 40 * |
| The Infinity Bar Hayling Island | The Infinity Bar Hayling Island | `b62b30e5-2c4d-4929-a84d-c9f289357e9e` | 52 * |
| Robin Hood Inn, Rowlands Castle | The Robin Hood | `20dbda0e-1ab9-408c-93cf-8d9e13a65881` | 71 |

\* Low confidence scores are **name-suffix artefacts**, not genuine mismatches — the bndy
records append ", Waterlooville" / "Hayling Island" to the name, which inflates edit
distance. Address, postcode and `google_place_id` all match exactly. Confirmed by address,
not by name. Flagging because a naive ≥70 gate would have bounced two correct venues and
created duplicates.

### 4.2 ⚠ Golden Lion duplicate from the 2026-07-12 incident is STILL LIVE

| id | name | city | place_id |
|---|---|---|---|
| `d3200659-f23b-4a19-a2c3-63e036b75c56` | The Golden Lion | Havant PO9 3EY | `ChIJoyarZxoTfEgRWQGR0bdskas` |
| `f34a9b2c-63b9-46c7-97f0-9219756ef16c` | Golden Lion | Bedhampton | `ChIJn_Ra_LhEdEgRvJ-EWySD1RQ` |

Same street address (54 Bedhampton Rd), coordinates ~8 m apart, **different**
`google_place_id`, and both carry the same `sceniceye-daily-import` externalId. This is the
documented duplicate pair — it was never merged. Rows 1 and 7 both target this venue, so
importing them now would attach events to one arm of an unresolved duplicate. Not merged
here: merging is a destructive write and §0.16 (owner-managed) is unavailable.

### 4.3 Artists — 3 exist, 4 new, 1 duplicate pair to resolve

| Artist | Status | id |
|---|---|---|
| Atomic Badger | **exists** (100%, Hampshire) | `b67be43d-6015-417b-ae46-2b777c77469b` |
| Double X | **exists** (100%, Hampshire) | `5a453a04-ece0-4d10-af8e-98b59c88642c` |
| Phoenix Park | **exists** (100%, Hampshire UK) | `1527b55f-b2c4-4bbd-80d3-2b3cf4af693a` |
| Adie B | new — no match at any threshold | — |
| Matt O'Neil | new — no match; tried `Matt O'Neill`, `Matt ONeil` | — |
| Carboncopy | new — no match; tried `Carbon Copy` | — |
| Damien Lodrick | new — no match; tried `Damian Lodrick`, `Lodrick` | — |

### 4.4 ⚠ The "Pheonix" typo the task file warns about is now a real duplicate pair

Both records exist, both in Hampshire UK:

| id | name | profileImage |
|---|---|---|
| `1527b55f-b2c4-4bbd-80d3-2b3cf4af693a` | **Phoenix Park** | `facebook.com/phoenixparkrock` |
| `52d4b4b3-e00a-4790-8fb1-4b605ce517c0` | **Pheonix Park** | *(none)* |

83% mutual confidence. The task file's alias rule ("Pheonix" ≈ "Phoenix") is exactly this
pair, but the rule as written only prevents creating a *third* record — it does not say
which of the two existing ones wins, and the merge gate lives in the missing runbook. Row 4
would attach to `1527b55f` (correctly spelled, has FB image), leaving `52d4b4b3` orphaned.

---

## 5. Staged rows — ready to import once blockers are ruled

No re-fetch needed. Times converted to 24h. `venueId` resolved and verified by address.

| # | Date | artist | artistId | venueId | start | end |
|---|---|---|---|---|---|---|
| 1 | 2026-07-31 | Adie B | *create* | `d3200659…` | 19:00 | 21:00 |
| 2 | 2026-07-31 | Matt O'Neil | *create* | `11fbe3bb…` | 20:00 | 22:00 |
| 3 | 2026-08-01 | Atomic Badger | `b67be43d…` | `2f01ebc9…` | 20:30 | — |
| 4 | 2026-08-01 | Phoenix Park | `1527b55f…` | `349ca19c…` | 21:00 | — |
| 5 | 2026-08-01 | Carboncopy | *create* | `eb51991a…` | 20:30 | — |
| 6 | 2026-08-01 | Matt O'Neil | *create* | `b62b30e5…` | 20:00 | 22:00 |
| 7 | 2026-08-02 | Double X | `5a453a04…` | `d3200659…` | 15:00 | 18:00 |
| 8 | 2026-08-02 | Matt O'Neil | *create* | `20dbda0e…` | 16:00 | 18:00 |
| 9 | 2026-08-02 | Damien Lodrick | *create* | `eb51991a…` | 16:30 | — |

Projected creates: **4 artists + 9 events = 13**, well under the §6 cap of 50. Zero venue
creates.

New-artist defaults that would apply (pending §2A enrichment, which needs the runbook):
`location: "Hampshire UK"`, `locationType: regional`.

### Parse judgment calls

- **Row 1, "Garden"** — printed on its own line between act and venue. Read as a
  stage/area qualifier (the Golden Lion's garden), not part of the act name, so sanitized
  out of the artist field. Alternative reading is a billing suffix ("Adie B — Garden"),
  which §0.18 says to drop rather than guess into a name field. Flagging as a judgment
  call, not a certainty.
- **Row 2/6/8, "Matt O'Neil"** — source uses a curly apostrophe (U+2019). Would be
  normalized to a straight apostrophe on create; noting it because it affects future
  search-by-name matching.
- **Row 8 venue** — printed "Robin Hood Inn - Rowlands castle"; the trailing town is part
  of the venue label, not the name. Matches bndy "The Robin Hood" by postcode PO9 6AB.

---

## 6. Snapshot delta

**Not computed — no prior snapshot exists (§2.2).** `sceniceye-last-page.txt` was
**not written this run**, deliberately, so the 9 rows above are not silently consumed.

Once the diff is authorized, the file should be seeded at
`10-Projects/bndy-population/data/normalized/sceniceye/sceniceye-last-page.txt` with these
pipe rows:

```
2026-07-31 | Adie B | The Golden Lion, Havant | 19:00
2026-07-31 | Matt O'Neil | The Westleigh, Havant | 20:00
2026-08-01 | Atomic Badger | Cowplain Social Club, Waterlooville | 20:30
2026-08-01 | Phoenix Park | The Old House At Home, Havant | 21:00
2026-08-01 | Carboncopy | The Heroes, Waterlooville | 20:30
2026-08-01 | Matt O'Neil | The Infinity Bar, Hayling Island | 20:00
2026-08-02 | Double X | The Golden Lion, Havant | 15:00
2026-08-02 | Matt O'Neil | The Robin Hood, Rowland's Castle | 16:00
2026-08-02 | Damien Lodrick | The Heroes, Waterlooville | 16:30
```

Note the task file's stated snapshot path (`Projects/bndy/sceniceye-last-page.txt`) does not
correspond to a real folder in this vault; the path above follows the actual
`data/normalized/<source>/` convention.

---

## 7. 409s / 422s

**None — no write calls were made.** Nothing to report verbatim.

---

## 8. Counts

| Metric | Value |
|---|---|
| Source rows captured | 9 |
| Rejected (skip list / past-dated) | 0 |
| In horizon (31 Jul → 14 Aug) | 9 |
| Staged for import | 9 |
| Defaulted start times | 0 |
| **bndy writes this run** | **0** |
| Venues needing creation | 0 |
| Artists needing creation | 4 |
| Live duplicates found | 2 pairs (Golden Lion venue, Phoenix/Pheonix Park artist) |

---

## 9. Follow-ups

- [ ] **Locate or write `MASTER-IMPORT-RUNBOOK.md`** — now blocking both `bv2-sceniceye-importer`
      and `bv2-gigsnewsimport`. Second consecutive held run.
- [ ] **Merge Golden Lion duplicate** — `d3200659` vs `f34a9b2c`, incl. the shared
      `sceniceye-daily-import` externalId that breaks `get_by_external_id`
- [ ] **Merge / rule on Phoenix Park vs Pheonix Park** — `1527b55f` vs `52d4b4b3`
- [ ] **Rule on the externalId scheme** — `sceniceye` vs `sceniceye-daily-import`, hyphen vs
      underscore, and whether to back-fill event ids
- [ ] Confirm the "Garden" reading on row 1
- [ ] Hi Fest ruling still open (not blocking — the weekender has passed)
- [ ] Locate `SCENICEYE-RUN-REPORT-2026-07-29.md` — cited by the task file, absent from the
      vault, holds the Hi Fest discovery leads

**Resume here:** once the runbook and the externalId scheme are ruled on, §5's 9 rows import
directly with no re-fetch. Merge the two duplicate pairs first, or rows 1, 4 and 7 will
attach to unresolved records.

---

# RUN 2 — same day, second scheduled fire (2026-07-31)

**Outcome: HELD again. Zero bndy writes. Blockers unchanged.** Re-verified independently
rather than trusting Run 1's findings.

## Counts

| Metric | Run 1 | Run 2 |
|---|---|---|
| Source rows captured | 9 | 9 (**identical**) |
| Rejected | 0 | 0 |
| Defaulted start times | 0 | 0 |
| Ticket markers | 0 | 0 |
| bndy writes | 0 | **0** |
| 409s / 422s | none | **none — no write calls made** |

## Re-verification results

- **Stale-week check: PASSED.** Edition header still **30 July – 5 August 2026**; today is
  Fri 2026-07-31. Current, not stale.
- **Capture is byte-equivalent to Run 1** — all 9 rows, same acts/venues/times, same four
  empty days (Thu 30 Jul, Mon 3–Wed 5 Aug). No re-fetch needed for import; Run 1 §5's
  staged table stands unchanged.
- **`MASTER-IMPORT-RUNBOOK.md` still absent.** Vault-wide grep returns 4 files, all of them
  prior *complaints* about its absence (2 daily notes, 2 run reports). The document itself
  has not appeared.
- **`sceniceye-last-page.txt` still absent.** Snapshot again deliberately **not written**,
  for the same reason as Run 1 — writing it would make next week's diff treat all 9
  candidates as already-processed and silently drop them.
- **bndy state unchanged since Run 1.** Nothing from this edition was imported in the
  interim: zero events at The Golden Lion, The Heroes or The Westleigh across 31 Jul–2 Aug;
  `Matt O'Neil` and `Adie B` still return no artist match (1296 scanned).

## Anomalies — both duplicate pairs re-confirmed LIVE

**Golden Lion venue.** Both records still present, and the shared externalId is confirmed
first-hand — `get_by_external_id(venue, sceniceye-daily-import, venue_the-golden-lion)` is
**ambiguous across two rows**, so idempotency is broken for this venue:

| id | name | city | place_id | externalIds |
|---|---|---|---|---|
| `f34a9b2c-63b9-46c7-97f0-9219756ef16c` | Golden Lion | Bedhampton | `ChIJn_Ra_LhEdEgRvJ-EWySD1RQ` | `sceniceye-daily-import / venue_the-golden-lion` |
| `d3200659-f23b-4a19-a2c3-63e036b75c56` | The Golden Lion | Havant PO9 3EY | `ChIJoyarZxoTfEgRWQGR0bdskas` | `sceniceye / venue-the-golden-lion-bedhampton` **+** `sceniceye-daily-import / venue_the-golden-lion` |

Correction to Run 1: the `sceniceye`-scheme id on `d3200659` is
`venue-the-golden-lion-bedhampton` (Run 1 illustrated the scheme with the Westleigh record).
The substance is unchanged — two competing schemes, neither matching the task file's
`<date>-<artist>-<venue>` event scheme.

**Phoenix Park artist.** `Phoenix Park` (`1527b55f…`, has FB image) and `Pheonix Park`
(`52d4b4b3…`, no image) both still live, both "Hampshire UK", 83% mutual. Neither carries
any externalId, so nothing pins which is canonical.

Rows 1, 4 and 7 target these two unresolved pairs. Importing them now attaches public events
to one arm of a duplicate — the precise failure mode of the 2026-07-12 incident.

## Why held rather than partially imported

Rows 2, 3, 5, 6, 8, 9 avoid the duplicate pairs, so a partial import was considered and
rejected: the **externalId scheme conflict applies to all 9 rows equally** and is still
unruled, and 5 of those 6 rows require *creating* artists, which the task file makes
conditional on mandatory §2A.3 enrich-inline — a procedure defined only in the missing
runbook. Creating 4 thin artist records against a corpus with known unresolved duplicates
is how the last incident started. Blank beats wrong.

## Escalation

This is the **third consecutive held run** across two sources (`bv2-gigsnewsimport`
2026-07-30, `bv2-sceniceye-importer` Run 1 and Run 2 today). All three are blocked on the
same single missing document. To break the loop, a **draft** reconstruction has been written
to `10-Projects/bndy-population/MASTER-IMPORT-RUNBOOK-DRAFT.md` — clearly marked
**NOT RATIFIED**, reconstructed only from section descriptions quoted in the task files and
prior reports. It is a decision aid for Jason, **not** authority to import: no run should
cite it until he ratifies or replaces it.

Follow-ups from Run 1 all still open, unchanged.

---

# RUN 3 — same day, third scheduled fire (2026-07-31)

**Outcome: IMPORTED. 9 events + 3 artists created, all verified. Zero gate bounces.**

The blocker that held Runs 1 and 2 is **resolved**: `10-Projects/bndy-population/RUNBOOK.md`
is now the consolidated **MASTER IMPORT RUNBOOK v2.0 (2026-07-30)**. Its header states it is
the ONLY runbook, supersedes the 2026-04-30 file at the same path, and that any copy outside
this path is archive. Both authority files read in full before any tool call.

Two Run-1/2 findings are corrected by direct observation:

1. **The snapshot file DOES exist** — `data/state/sceniceye-last-page.txt`, fetched 2026-07-17,
   week 16–22 Jul, in the exact pipe format §5.7 expects. Runs 1 and 2 searched the task
   file's stale path (`Projects/bndy/…`). §6D of v2.0 fixes the slug↔path map. The two-sided
   diff therefore ran normally this run.
2. **The externalId scheme is ruled** — §6D: stable human-readable slugs
   `{source:"sceniceye", id:"<YYYY-MM-DD>-<artist-slug>-<venue-slug>"}`, and the namespace
   `sceniceye` is canonical (`sceniceye-daily-import` on legacy records is not to be tidied).
   Applied to all 9 events.

## Pre-flight (§6A)

| Check | Result |
|---|---|
| Today's date | **2026-07-31 (Fri)** — `mcp__workspace__bash` unavailable ("VM service not running"); device clock used per §6A.1 |
| RUNBOOK.md v2.0 | Read in full |
| sources/sceniceye.md | Read in full |
| bndy MCP | Reachable |
| Chrome (mandatory here) | Connected, logged in |
| Snapshot | Present (2026-07-17, week 16–22 Jul) |

## Stale-week check — PASSED

Banner **30 July – 5 August 2026**; today Fri 31 Jul. Current edition, page has rolled.
Thu 30 Jul / Mon 3 / Tue 4 / Wed 5 Aug all genuinely "No gigs listed". Capture is identical
to Runs 1 and 2 — 9 rows. Raw capture: `data/raw/sceniceye/2026-07-31/page-text.txt`.

## Two-sided snapshot diff (§5.7)

- **Added rows: 9** — none present in the 16–22 Jul snapshot.
- **Removed future-dated rows: 0.** Every row in the previous snapshot has since passed its
  date; §5.7 is explicit that a row disappearing because its date passed is NOT a
  cancellation. **No deletions performed, none warranted.**
- New snapshot written to `data/state/sceniceye-last-page.txt` in the same pipe format.

## Counts

| Metric | Value |
|---|---|
| Rows on page | 9 |
| Rows imported | **9** |
| Events created | **9** |
| Artists created | **3** |
| Artists matched / reused | **4** |
| Venues created | **0** (7 resolved) |
| Parked / skipped / staged | 0 |
| Defaulted start times | **0** |
| 409 / 422 bounces | **0** |
| Total creates vs §6 cap of 50 | 12 |

## Events created — all read back with `get_by_id`, all `isPublic: true`

| Event id | Date | Time | Title | Venue id | externalId (`sceniceye`) |
|---|---|---|---|---|---|
| `a6948998-db08-46ab-b3be-697f7430c58f` | 2026-07-31 | 19:00 | Adie B @ The Golden Lion | `d3200659…` | `2026-07-31-adie-b-the-golden-lion` |
| `ec0f9279-a1e1-47ef-869a-c0836216fd9a` | 2026-07-31 | 20:00 | Matt O'Neil @ The Westleigh | `11fbe3bb…` | `2026-07-31-matt-oneil-the-westleigh` |
| `a36979c0-37a3-4602-be37-35fa93e700eb` | 2026-08-01 | 20:30 | Atomic Badger @ Cowplain Social Club | `2f01ebc9…` | `2026-08-01-atomic-badger-cowplain-social-club` |
| `cf0bd62a-580d-4ddf-8c51-3f71ccfe6d5b` | 2026-08-01 | 21:00 | Phoenix Park @ The Old House at Home | `349ca19c…` | `2026-08-01-phoenix-park-the-old-house-at-home` |
| `b58e065a-b5e2-4750-809b-51741c43738e` | 2026-08-01 | 20:30 | Carboncopy @ The Heroes | `eb51991a…` | `2026-08-01-carboncopy-the-heroes` |
| `edf884c0-0e2d-48cc-b569-9fe89e6a0cad` | 2026-08-01 | 20:00 | Matt O'Neil @ The Infinity Bar Hayling Island | `b62b30e5…` | `2026-08-01-matt-oneil-the-infinity-bar-hayling-island` |
| `fd04603f-46bc-4d6b-98a2-39c844b136c0` | 2026-08-02 | 15:00 | Double X @ The Golden Lion | `d3200659…` | `2026-08-02-double-x-the-golden-lion` |
| `45cff961-71b3-4693-a142-0926d8690bc7` | 2026-08-02 | 16:00 | Matt O'Neil @ The Robin Hood | `20dbda0e…` | `2026-08-02-matt-oneil-robin-hood-inn` |
| `93bd3022-a7d9-4e67-8156-74ea411987a5` | 2026-08-02 | 16:30 | Damien Lodrick @ The Heroes | `eb51991a…` | `2026-08-02-damien-lodrick-the-heroes` |

Every row carried an explicit start time — §5.6 defaults were not needed and not used.
Start-only captured per the source's `time_capture.policy`; end times discarded.
Read-back shows `endTime: "00:00"` on all nine — that is the backend's empty rendering, not a
value this run wrote. Cosmetic observation only.

## Artists created (3) — §2A enrichment evidence

### `6003f8f6-a2e8-43a9-a196-36269e8f1338` — Adie B (solo · "Hampshire UK" · `regional`)
FB searched in Chrome, logged in: `Adie B music` (pages), `Adie B` (pages), `Adie B Havant`
(top). Hits were Venezuelan / US / gamer pages, plus a personal profile "Ade Bingham, Havant"
— a personal profile is never linked as the act page (§2A.4). **No confident UK act page →
facebookUrl and avatar left BLANK, flagged** (§2A.1: blank beats wrong). actType and genres
left EMPTY (§0.18 outranks the covers default — no evidence either way). Location from the
source default; `locationType: regional` verified on read-back (§6B Kilmarnock trap).

### `b8f27dba-ba54-4d34-8959-3a89c8a7bdfd` — Matt O'Neil (solo · "Hampshire UK" · `regional`)
Six FB variants searched: `Matt O'Neil music Hampshire`, `Matt O'Neil music`, `Matt O'Neil`,
`Matt O'Neill Hampshire`, `Matt ONeil acoustic`, `Matt ONeil music`, plus
`Matt O'Neill live music Havant` (top). Every same-name candidate was **non-UK** — the
strongest, "Matt O'Neil" (5.1K followers), is a Houston TX music production studio.
**§2A.1.1: a non-UK act's page is NEVER attached. facebookUrl BLANK, flagged.** He plays three
gigs this week across Havant / Hayling Island / Rowland's Castle, so he is plainly a working
local act — a manual FB URL would let a future run enrich him. actType/genres EMPTY.

### `ec178188-4204-4c70-ad94-5baa93a040b1` — CarbonCopy Party Band (band · Portsmouth · `city`)
Billed by the source as **"Carboncopy"**. FB `Carboncopy band` (pages) → verified page
**CarbonCopy Party Band**, category Band, 42 Middle Street, Portsmouth PO5 4BP, 2K followers,
page-stated service area "Hampshire · West Sussex · Dorset". **Hard signal per §2A.1:** a
recent post thanks **The Ship and Bell, Horndean** — a pub ~2 miles from Waterlooville, inside
this guide's own footprint. Page active.
Applied: `facebookUrl https://www.facebook.com/CarbonCopyPartyBand`; avatar
`https://graph.facebook.com/CarbonCopyPartyBand/picture?type=large` (graph URL, never
scontent); location **Portsmouth** — the page's own stated location overrides the Hampshire
default (§2A.3); `actType: ["covers"]` via follow-up `edit_artist`, evidenced by the page
describing weddings/events covers work. **Name set to the act's own page name** (§2A.3/§2A.5);
the event title keeps the source billing, "Carboncopy @ The Heroes" (§1A.5).

## Artists matched / reused (4)

| Artist | id | Basis |
|---|---|---|
| Atomic Badger | `b67be43d-6015-417b-ae46-2b777c77469b` | 100% name, Hampshire, existing `sceniceye` externalIds |
| Phoenix Park | `1527b55f-b2c4-4bbd-80d3-2b3cf4af693a` | 100% name, Hampshire UK, FB `phoenixparkrock` |
| Double X | `5a453a04-ece0-4d10-af8e-98b59c88642c` | 100% name, Hampshire, externalId `artist-double-x` |
| Damien Lodrick → **The Damien Lodrick Band** | `eeddccb6-8c17-45fd-97df-e7c9b61fc6a0` | Runs 1/2 wrongly concluded "new". §1 ADR-023 (X / X Band in the same region = same act) plus the record already carrying the learned alias `sceniceye:artist-damien-lodrick`; Portsmouth footprint contains Waterlooville. **Reused — a fourth artist create was correctly avoided.** |

Top-up on matched records (§2A.2): **Double X** has no facebookUrl and no avatar. Searched
`Double X band Hampshire` (pages) — only a Kyiv bags brand, a New Hampshire "Double Down Band"
and unrelated businesses. **No confident UK match → left blank**, flagged.

## Venues resolved (7, none created)

| Venue | id | How |
|---|---|---|
| The Golden Lion, Havant | `d3200659-f23b-4a19-a2c3-63e036b75c56` | search 100%, place_id `ChIJoyarZxoTfEgRWQGR0bdskas` |
| The Westleigh, Havant | `11fbe3bb-6798-4c30-b34e-2b999648ac01` | search 100% |
| Cowplain Social Club, Waterlooville | `2f01ebc9-abce-4ff6-8b39-0bde440d45ff` | search 100% |
| The Old House at Home, Havant | `349ca19c-fb7f-45e6-b9a1-bebdb16a0634` | name 72% but address/town agree exactly (2 South St, Havant) — §3.4 satisfied |
| The Heroes, Waterlooville | `eb51991a-b082-433c-90e4-123340283271` | name 40% (stored name carries the town suffix) but address 125 London Rd, PO7 7DZ agrees exactly |
| The Infinity Bar Hayling Island | `b62b30e5-2c4d-4929-a84d-c9f289357e9e` | address 139 Elm Grove, PO11 9ED agrees exactly |
| The Robin Hood, Rowland's Castle | `20dbda0e-1ab9-408c-93cf-8d9e13a65881` | `search_venue` missed it under "Robin Hood Inn" (both town spellings tried). `create_venue` find-or-create returned **EXISTING** on place_id `ChIJPTdJdqVFdEgRxZ0r-viEz2A` — **no duplicate created**, exactly the §3.2 behaviour. |

## Data-quality findings — logged, not acted on (§0.11)

1. **Golden Lion duplicate pair still live** (re-confirmed): `d3200659…` "The Golden Lion"
   (place_id `ChIJoyarZxoTfEgRWQGR0bdskas`) vs `f34a9b2c…` "Golden Lion", city Bedhampton
   (place_id `ChIJn_Ra_LhEdEgRvJ-EWySD1RQ`). Both carry
   `sceniceye-daily-import:venue_the-golden-lion`. This run used `d3200659` — the arm holding
   the canonical `sceniceye` externalId and matching the source's stated town (Havant).
2. **Phoenix Park / Pheonix Park duplicate pair still live**: `1527b55f…` (enriched, FB +
   avatar + genres) vs `52d4b4b3…` (bare). This run used `1527b55f`.
   Both pairs remain merge candidates for the separate, Jason-authorised cleanup protocol.
3. **`locationType` is not returned by `get_by_id`**, so the §6B pairing cannot be verified on
   read-back for pre-existing records (Atomic Badger "Hampshire", Double X "Hampshire",
   Phoenix Park "Hampshire UK"). New records this run were created with the pairing explicit.
   Tooling item: expose `locationType` on `get_by_id`.
4. **Row 1 cell ambiguity**: the Adie B row renders a stray value "Garden" between act and
   venue. Read as a venue-area note (the Golden Lion's garden), not part of any name (§0.6).
   No name field was affected. Same reading as Runs 1 and 2.
5. **Row 2/6/8 apostrophe**: the source uses a curly apostrophe (U+2019) in "Matt O'Neil";
   the record was created with a straight apostrophe. Noted because it affects future
   search-by-name matching.
6. `mcp__workspace__bash` unavailable for the entire run; no step other than the date needed it.
7. **`MASTER-IMPORT-RUNBOOK-DRAFT.md`**, authored by Run 2, is now redundant and directly
   conflicts with §6A.2's prohibition on reconstructing a runbook. Recommend Jason delete it —
   this run did not read it and no future run should.

## Open items for Jason

- **Confirm `artistType`** on the two personal-name creates (Adie B, Matt O'Neil) — set to
  `solo` from the billing alone, no page evidence.
- **Matt O'Neil FB page** — three gigs this week, no findable page under any of six spellings.
- **Double X** — still no socials/avatar after a second search.
- **Alias to learn (§1A.5):** ScenicEye billing **"Carboncopy"** → **CarbonCopy Party Band**
  (`ec178188-4204-4c70-ad94-5baa93a040b1`). Added to the source file's alias table this run so
  it is never re-reviewed. Confirm the act-page-name-wins call, since the bare-core normalised
  key differs from the billing.
- **Delete `MASTER-IMPORT-RUNBOOK-DRAFT.md`** (finding 7).
- Two merge candidates (Golden Lion venue pair, Phoenix/Pheonix Park artist pair).
- **Hi Fest ruling** still open, not triggered this week.

## Verification

All 12 writes (3 `create_artist`, 1 `edit_artist`, 9 `create_event`, plus the find-or-create
venue call) were read back with `get_by_id`. All nine events confirm the intended date, start
time, artist id, venue id, `isPublic: true`, and a single `sceniceye` slug externalId. No 409s,
no 422s, no retries, no name variation attempted.
