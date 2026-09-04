---
type: run-report
source: gigs-news
run_date: 2026-07-30
task_file_version: "v2.2"
outcome: HELD — no bndy writes
tags: [run-report, gigs-news, bndy-population]
---

# gigs-news daily import — RUN REPORT 2026-07-30

**Outcome: capture succeeded, diff/import HELD. Zero bndy writes this run.**

Run date established from device clock (2026-07-30, Thursday) — the workspace shell was
unavailable ("VM service not running"), so `date +%Y-%m-%d` could not be run. Task file
permits the device-clock fallback.

Chrome was connected. Both required pages rendered fully and were read via
`get_page_text`. No truncation — see sanity check below.

---

## 1. Why the import was held

Four blockers. The first two are hard stops against the task file's own design.

### 1.1 `MASTER-IMPORT-RUNBOOK.md` does not exist in the vault

The task file opens by declaring itself **subordinate** to `MASTER-IMPORT-RUNBOOK.md`
(v1.10+) and states it holds "ONLY gigs-news-specific procedure and quirks". A
whole-vault grep for `MASTER-IMPORT-RUNBOOK` returns nothing. The following sections are
cited as governing and are all unavailable:

| Section | What it governs |
|---|---|
| §0.1 | never create/re-enable schedules |
| §0.2 | no identity judgment |
| §0.7 | national-act-venue location override |
| §0.9 | bounce handling |
| §0.16 | owner-managed records untouchable |
| §0.17 (v1.9) | removed-future-row handling |
| §0.18 | blank beats wrong / empty beats a wrong default |
| §1A | cross-region footprint check |
| §2A.3 | enrich-inline rules (FB search + page visit) |
| §5.5 / §5.6 / §5.7 | horizon / start-time defaults / snapshot-diff |
| §6 | 50-creates cap |

The only runbook present is `10-Projects/bndy-population/RUNBOOK.md`, last updated
**2026-04-30**, which has none of these sections and describes a different (script-driven,
partition-file) pipeline. It is not the referenced document.

Proceeding would mean inventing the write rules — specifically the footprint check,
the enrichment procedure, and the merge/bounce semantics — for ~25 new artists.

### 1.2 No snapshot file → the diff cannot run

`gigs-news-last-page.txt` does not exist anywhere in the vault (globbed vault-wide). The
task file's entire method is two-sided diff against that snapshot. With no prior side,
every row is an "addition", which converts an incremental daily run into a bulk
first-import. The task file's own gotcha section says to **fail closed** rather than treat
an anomalous read as wholesale change.

**Deliberate choice: the snapshot file was NOT written this run.** Writing it now would
record today's page as "already seen", so tomorrow's diff would show zero additions and
the 31 candidate rows below would be silently lost. Leaving it absent keeps them
recoverable.

### 1.3 externalId scheme conflict, with live duplication risk

| Source | source id | id format |
|---|---|---|
| Task file v2.2 | `gigs-news` | `<date>-<artist-slug>-<venue-slug>` |
| Vault spec `sources/gigs-news-uk.md` (2026-05-01) | `gigs-news-uk` | `sha1[:12]` of `(date\|venue_fb_url\|artist_normalised)` |

Worse — **the 22 branded events already in bndy carry `externalIds: []`**. Neither scheme
is actually written to the records. So `get_by_external_id` is blind on them, and an
import run relying on externalId idempotency would re-create rather than match. It would
likely be caught by the artist+venue+date event gate as a bounce, but that is luck, not
design.

### 1.4 Named-host jam rows: task file contradicts the vault spec

Task file v2.2 reject filter lists "jams" flatly. The vault spec (2026-05-01, calibrated
with Jason) explicitly says named-host jam rows **are** importable, with the leading name
as artist and the full string as title, and names this exact row as the worked example:

> `Tony Auton band Jam - Coach & Horses Oldham` → artist `Tony Auton`, title
> `"Tony Auton Band Jam"`

One row is affected this run (Thu 30 Jul). Held pending a ruling.

---

## 2. What is NOT a blocker — the branded/Reserved ruling is confirmed by evidence

The vault spec (2026-05-01) treats `branded` and `Reserved` as paid sponsorship slots to
be park-lotted and skipped. Task file v2.2 overrides this with a Jason ruling of
2026-07-29. **The task file is correct and the spec is stale.** On-page evidence from
`branded.htm` this run:

- Document title is `branded-Rhythm&BluesBand`.
- The page is a band page: set lists, per-venue gig write-ups, and a named line-up
  (Steve Chan guitar, Terry Snowden keys, Chris Statham vocals/harmonica).
- Band history states the group rebranded from "the Dirty Truth" in September 2024 after
  Ken Pressdee left and kept the old name.

The `sources/gigs-news-uk.md` frontmatter should be corrected — it currently instructs
future runs to skip these rows entirely.

**One caveat on the "Reserved = dep line-up" half of the ruling.** The task file says
"their own page says so". The page does not say that. What it shows is `Reserved` /
`R&B Reserve` appearing as a *prior or parallel band* in member credits (e.g. "Tony
Hallsworth - Guitar (Reserved, Two Tones blues band)"), plus an aside that "Ken left the
band because we had too many gigs and too many deps". The dep-line-up reading is
plausible but is not stated on the page. Flagging rather than judging (§0.2).

---

## 3. Capture sanity check — page is fully rendered, not truncated

- Week view header: **"What's on This Week 29 July - 2 August"** — consistent with run date.
- Five day blocks present (Wed 29 Jul → Sun 2 Aug), ~85 rows total.
- `branded.htm` returned the full forward list plus historical years 2022–2025.

No partial-render indicators. §0.17 mass-removal panic is not in play.

---

## 4. branded forward list — ALREADY FULLY IMPORTED, no action needed

`search_event(artistId=rwDw320gku5uQ4gzaU2N, 2026-07-30 → 2027-07-30)` returns **22
events**, which reconcile **exactly** against the branded.htm forward list. A prior run
already imported this list, including the `branded (Reserved) @ «Venue»` title convention
and day-based start times.

| Date | Venue (bndy) | Event id | Label |
|---|---|---|---|
| 2026-08-01 | Arden Arms, Stockport | `49542892` | branded |
| 2026-08-08 | Town Hall Tavern, Stockport | `463cb7ec` | branded |
| 2026-08-19 | Eagle & Child | `9326ce51` | Reserved |
| 2026-08-22 | The Crown, Heaton Moor | `9141775e` | Reserved |
| 2026-08-28 | Jubilee Club, Ashton-in-Makerfield | `788c7a4c` | branded |
| 2026-09-05 | Queen's Hotel, Macclesfield | `07a9e82b` | Reserved |
| 2026-09-11 | The Acoustic Lounge, Poynton | `218ed6b7` | branded |
| 2026-09-13 | The Railway, Greenfield | `93274572` | branded |
| 2026-09-19 | Kings Arms, Wilmslow | `728b2e28` | Reserved |
| 2026-09-26 | The Billy Goat, Mossley | `0801a98f` | branded |
| 2026-10-02 | The Swan Inn, Wilmslow | `b5955538` | branded |
| 2026-10-09 | The Crown, Heaton Moor | `37cb9059` | branded |
| 2026-10-14 | Eagle & Child | `e621e77c` | branded |
| 2026-10-16 | The Dog Inn, Chadderton | `a97e372e` | branded |
| 2026-10-24 | Arden Arms, Stockport | `d3ad6ea6` | Reserved |
| 2026-10-30 | Stock Dove, Romiley | `ec8dd812` | Reserved |
| 2026-11-07 | Cheshire Cheese, Newton | `e2c62d93` | branded |
| 2026-11-14 | The Acoustic Lounge, Poynton | `100398e3` | Reserved |
| 2026-11-22 | The Railway, Greenfield | `cb6e9e52` | Reserved (16:00 ✓) |
| 2026-11-27 | The Musketeer, Leigh | `6525c0d5` | branded |
| 2026-12-04 | The Crown, Heaton Moor | `a328dcbd` | Reserved |
| 2026-12-12 | Town Hall Tavern, Stockport | `94b97843` | branded |

Two forward rows are correctly **absent** from bndy:

- `Friday/Saturday 14/15 August - looking for a venue / cancellation` — not a gig.
- `Sunday 20th September - Cheshire Cheese Newton SK14 4BH 5pm - Reserved` — the week-view
  copy carries `(cancelled - United match)`. Note `branded.htm` shows this row **without**
  the cancellation note; the two pages disagree. The cancelled reading was honoured.

Known-mapping spot checks all passed: Railway Greenfield → `NwEtqexKQqLHyBcPVgJF`;
Jubilee Club Ashton-in-Makerfield → `49bc4606…`; Crown Heaton Moor → `xyERKljjDSlCFaYKMWPH`;
Town Hall Tavern → `BmQg5orKKV613HpsCjge`; Kings Arms Wilmslow → `qBVuL2CvXckaG1hbzzEH`.

**Net: the branded/forward half of this task requires zero work today.** The only
outstanding defect on these records is the empty `externalIds` (see §1.3).

---

## 5. Week-view candidates — STAGED, not imported

Horizon applied: today → +14 days (2026-07-30 → 2026-08-13). Wednesday 29 July is past
and was dropped. The week view only extends to Sunday 2 August, so the effective window
is Thu 30 Jul – Sun 2 Aug.

**31 import candidates** (32 if the Tony Auton jam row is ruled importable). Under the
§6 cap of 50. Start times marked ⏱ are day-based defaults, not page-stated.

### Thursday 30 July (default 20:00)

| Act | Venue | Time | Note |
|---|---|---|---|
| Roy Pimmy | White Hart Woodley | 16:30 | page-stated |
| Higgi's Band | the Welcome Inn Whitefield | 20:00 ⏱ | venue → Welcome Inn, Prestwich `FXQKvDaexNQj53yl4icf` |
| *Tony Auton band Jam* | Coach & Horses Oldham | 20:00 ⏱ | **DISPUTED — see §1.4** |

### Friday 31 July (default 21:00)

| Act | Venue | Time | Note |
|---|---|---|---|
| Bash Bailey & friends | Acoustic Lounge Poynton | 21:00 ⏱ | alias → **Bash Bailey** |
| House of Ska | Queens Hotel Macclesfield | 21:00 ⏱ | |
| the Grey Dogs | the Crown Heaton Moor | 21:00 ⏱ | venue `xyERKljjDSlCFaYKMWPH` |
| Chilly Red | the Railway Greenfield | 21:00 ⏱ | venue `NwEtqexKQqLHyBcPVgJF` |
| Tracy Morgan & Co | the Albion Dukinfield | 21:00 ⏱ | |
| Puls | the Musketeer Leigh | 21:00 ⏱ | short name — needs bare-core + spelling-normalised search |
| Storm Kings | Ashton Jubilee Club | 21:00 ⏱ | venue `49bc4606-97d7-45a5-a693-a887ac2f0810` |
| Northside Brothers of Soul | Marple Con & Social Club | 21:00 ⏱ | ONE act; venue `bbzzpFPYsOVE4bcHU60s` |
| Jon Stevens | Bulls Head High Lane | 21:00 ⏱ | venue alias → **The Bull's Head** |
| Ska Council | The Crown Inn Stockport | 21:00 ⏱ | venue `f54d4cbe…` (154 Heaton Ln) — **NOT** the Heaton Moor Crown |
| Paul Waldron | the Moor Club | 20:00 | page-stated 8pm |

### Saturday 1 August (default 21:00)

| Act | Venue | Time | Note |
|---|---|---|---|
| the Newman Rockets | Acoustic Lounge Poynton | 21:00 ⏱ | |
| Bet Shop Boys | the Crown Heaton Moor | 21:00 ⏱ | |
| One Day band | Cheshire Cheese Newton | 21:00 ⏱ | |
| the Rubber Souls | the Swan Inn Wilmslow | 21:00 ⏱ | |
| Jessie | Kings Arms Hotel Wilmslow | 21:00 ⏱ | venue `qBVuL2CvXckaG1hbzzEH`; short name — search discipline |
| the Select Committee | Queens Hotel Macclesfield | 21:00 ⏱ | |
| Stella Vision | Hare & Hounds New Mills | 21:00 ⏱ | venue `i0ZMEN0agqL6JOTMhSEm` |
| Sod's Law | Coach & Horses Oldham | 21:00 ⏱ | |
| Grey Numbers | the Musketeer Leigh | 21:00 ⏱ | |
| Charlie Whittaker Back-Up band | the Billy Goat Mossley | 21:00 ⏱ | alias → **Charlie Whittaker** |
| Rise of Kain | The Crown Inn Stockport | 21:00 ⏱ | `f54d4cbe…` |
| Rachel Farrow | Windsor Castle Marple Bridge | 17:00 | page-stated 5pm |
| Karl Howard | Buxton Working Mens Club | 21:00 ⏱ | Derbyshire fringe |

Note: `branded - the Arden Arms Stockport` appears **twice** on Saturday. Already in bndy
as `49542892` — no-op either way.

### Sunday 2 August (default 19:00)

| Act | Venue | Time | Note |
|---|---|---|---|
| Black Garter | Railway Greenfield | 16:00 | page-stated 4pm; venue `NwEtqexKQqLHyBcPVgJF` |
| Smudge duo | the Albion Dukinfield | 17:00 | page-stated 5pm; alias → **Smudge** (ADR-023) |
| Alex Ashe | Acoustic Lounge Poynton | 19:00 | page-stated 7pm |
| Marshall Gill | Coach & Horses Oldham | 18:00 | page-stated 6pm |
| Max Jones | the Crown Heaton Moor | 19:00 ⏱ | |

**Defaulted-time count: 23 of 31.**

### §1A footprint check required before any of these are written

`Trilogy Rock Band` and `Lee Michaels` do not appear this week, so the standing
cross-region warning is not triggered. However most of the 31 acts above are likely new
artists needing creation, and §1A/§2A.3 are exactly the sections that are missing.

---

## 6. Rejected rows (logged, not imported)

Applied per the v2.2 reject filter. Counts for the in-horizon window only.

| Category | Count | Examples |
|---|---|---|
| Open mic | 7 | `Open Mic - Blossoms Stockport`, `Between the Vines Open Mic 7pm - Fox & Pine Oldham`, `Open Mic/karaoke - Marple Con & Social Club` |
| Karaoke | 5 | `karaoke - Queens Hotel Macclesfield`, `karaoke/disco - the Dog Inn Chadderton`, `Dave's karaoke 5pm - the Club Romiley` |
| Blank act row | 16 | `- the Swan Inn Wilmslow`, `- Crown Bredbury`, `- Rising Sun Hazel Grove`, `- Poynton Workmens Club` |
| Time-only row | 6 | `10pm - Mash Guru Macclesfield` (×2), `8pm - Dog & Partridge Great Moor`, `4pm - Cheshire Cheese Newton` |
| Jam (unnamed) | 3 | `Jam + Open Mic - Mash Guru`, `Blues Jam 4pm - Spinning Top`, `Backwater Blues Jam - the Railway Greenfield` † |
| "live bands" / no named act | 3 | `live bands - Spinning Top` (Thu/Fri/Sat) |
| Theme night, no performer | 2 | `Jazz Night - the Moor Club`; `5th Aug Rocking 60s - Stockport Rock & Roll Society` ‡ |
| Recurring jazz night | 1 | `Jazz at the Railway - the Moor Club` — always skip per task file |

† `Backwater Blues Jam` is *also* on the vault spec's standing `event_skips.artist_names`
list (Jason, 2026-05-01) — rejected on two independent grounds.

‡ `Rocking 60s` is named verbatim in the v2.2 reject filter as a theme night. Note it
carries a forward-date prefix (`5th Aug`) resolving to 2026-08-05, which *is* in horizon —
rejected on content, not date.

**No `Reserved`/`branded` week-view row was rejected** — correctly treated as artist
`branded` per §2 above.

---

## 7. Counts

| Metric | Value |
|---|---|
| Pages fetched | 2 (both rendered, both complete) |
| bndy creates | **0** |
| bndy edits | **0** |
| 409 / 422 responses | none — no writes attempted |
| branded forward rows on page | 24 (22 already in bndy, 2 correctly excluded) |
| Week-view rows in horizon | ~74 |
| Import candidates staged | 31 (+1 disputed) |
| Rows rejected | 43 |
| Defaulted start times among candidates | 23 |
| Snapshot delta | **not computable** — no prior snapshot exists |

---

## 8. What Jason needs to decide

1. **Where is `MASTER-IMPORT-RUNBOOK.md`?** It is not in this vault. Either it lives
   somewhere unmounted, or it was never written. Nothing safely automates until §1A,
   §2A.3, §0.9, §0.17 and §0.18 are readable.
2. **Which externalId scheme wins** — `gigs-news` + slug triple, or `gigs-news-uk` +
   sha1? And should the 22 existing branded events be back-filled with externalIds? They
   are currently unmatched by any idempotency lookup.
3. **Named-host jams** — task file v2.2 rejects them; the 2026-05-01 spec imports them.
   One row affected today (`Tony Auton band Jam`).
4. **Correct `sources/gigs-news-uk.md`** — its branded/Reserved park-lot policy is now
   known to be wrong and would misdirect any future run that reads it.
5. **Cheshire Cheese 20 Sept** — cancelled on the week view, not cancelled on
   `branded.htm`. Treated as cancelled. Confirm.

Once 1–3 are resolved the 31 staged rows in §5 can be imported directly from this report
without re-fetching.

---

## Related

- Task file: `bv2-gigsnewsimport` (v2.2, 2026-07-30)
- Source spec (stale on branded/Reserved): `[[10-Projects/bndy-population/sources/gigs-news-uk]]`
- Vault runbook (not the referenced master): `[[10-Projects/bndy-population/RUNBOOK]]`
- Daily: `[[20-Daily/2026-07-30]]`
