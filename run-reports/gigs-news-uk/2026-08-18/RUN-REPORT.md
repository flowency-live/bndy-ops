# gigs-news — scheduled run 2026-08-18

- **Run id**: `gigs-news-2026-08-18T04-07-19Z`
- **Runbook read**: `RUNBOOK.md` H1 **v2.27**. Floor in §6A is **v2.19**. Assertion PASSES.
- **Prompt floor**: the task prompt states no number. §6A step 2a is the gate.
- **Spec read**: `sources/gigs-news-uk.md`, in full.
- **Claim**: `data/state/claims/gigs-news.json`, acquired 04:07:19Z, TTL 90 minutes. Previous holder released cleanly at 2026-08-15T06:43:49Z. No takeover.
- **Heartbeat**: `data/state/heartbeat/gigs-news-2026-08-18T04-07-19Z.json`.
- **Outcome**: completed.

## 1. Counts

| Measure | Count |
|---|---|
| Events created | 8 |
| Events edited (provenance back-fill) | 2 |
| Artists created | 0 |
| Venues created | 0 |
| Records created with a verified page | 0 |
| Records created with an evidenced blank | 0 |
| Rows skipped — new artist, Chrome unreachable | 5 |
| Rows rejected by the §0 filter | 46 |
| Gate bounces (409 DUPLICATE_EVENT) | 2 |
| Creates against the 50 cap | 8 |
| Validator | 0 FAIL, 0 WARN |

No artist and no venue was created, so no enrichment write occurred. The report therefore records no verified-page or evidenced-blank creates. This is a correct zero, not an omission.

## 2. Capture — Chrome was unreachable, and the source did not need it

`tabs_context_mcp` returned "Claude in Chrome is not connected" on two attempts. This is the same outage the enrichment, spider and KLMA tasks reported through the night (six firings, 2026-08-17 22:17Z onward).

The spec says Chrome is mandatory for this source and that a plain fetch returns a shell. **That is no longer true.** A container `curl` returned both pages complete:

| URL | HTTP | Bytes |
|---|---|---|
| `https://www.gigs-news.uk/` | 200 | 107,459 |
| `https://www.gigs-news.uk/branded.htm` | 200 | 259,533 |

The week view rendered the live week, `What's on This Week 19 - 23 August`, three days newer than the stored snapshot. The blank-artist rows the spec documents (`- the Swan Inn Wilmslow`) are present in the raw HTML as `&nbsp;- ` followed by the venue anchor, so they are the curator's own empty slots and not a truncated render. Raw HTML held in `data/raw/gigs-news-uk/2026-08-18/`.

Chrome was still required for §2A.1 artist identification. It blocked five rows and nothing else — see §5.

## 3. Horizon and the branded.htm forward list

`branded.htm` forward list = the header `gigs 2026` plus the 27 contiguous dated rows that follow it. The next `Gigs 2026` header sits at line 163 and opens 186 rows of archive. Both safeguards held: ordinal position, and the capitalisation cross-check.

The forward list is **byte-identical to the stored snapshot**: 0 added, 0 removed.

All 22 importable forward rows are already in bndy under artist `branded` `rwDw320gku5uQ4gzaU2N`, dates 2026-08-19 to 2026-12-31, each carrying a `gigs-news` externalId. Verified by `search_event(artistId, 2026-08-18 → 2027-01-31)`. The 23rd row, `Sunday 20th September - Cheshire Cheese Newton`, carries `(cancelled - United match)` on the following line and is correctly absent.

## 4. Diff (§5.7)

Mode: the spec declares neither `delta` nor `append-only`. Already open as `gigs-news-mode-undeclared` (2026-08-12). The run defaulted to **append-only** and removed nothing.

- **Section 1 (week view)**: 46 added, 58 removed.
- **Section 2 (branded forward list)**: 0 added, 0 removed.
- **§5.7(a) self-diff gate**: the new snapshot re-diffed against the capture it was written from returns **0 added / 0 removed**.

**Every one of the 58 removals is a past-dated row from the 12–16 August week.** The page rolled. No future-dated row disappeared, so no §0.17 decision arose on either mode.

Normalisation applied to both sides, and recorded in the snapshot header: whitespace runs collapsed to one space; every line trimmed; trailing comma, full stop or slash stripped; HTML entities decoded once; empty lines removed.

## 5. Rows skipped — a new artist and no Chrome

§2A.1 item 5 forbids creating an artist without an identity check, and Chrome is the only surface for it. Five rows are skipped for the next run to retry. None is a defect; each is one search away from a create once Chrome returns.

| Row | Date | Venue |
|---|---|---|
| Route 66 | 2026-08-20 | the Welcome Inn Whitefield |
| Thombres | 2026-08-21 | the Musketeer Leigh |
| Sinnertwin | 2026-08-22 | Bike n Hound Hyde |
| Zak James | 2026-08-22 | Buxton Working Mens Club |
| Karl Magee | 2026-08-23 | the Albion Dukinfield |

`search_artist` at minConfidence 25 returned no candidate above 50% for any of the five. `Sinnertwin`'s top hit was `Siân Hawkins` at 50%, which is the shared-token noise §1A.7 describes, not a collision.

## 6. Events created

All 8 carry `isPublic: true` and a `{source:"gigs-news", id:"<date>-<artist>-<venue>"}` externalId. All 8 were read back with `get_by_id` (§0.10).

| Event id | Title | Date | Time | Artist id | Venue id |
|---|---|---|---|---|---|
| `501f4df1-6453-418b-a567-ba1dd9925c32` | Roy Pimmy @ The White Hart | 2026-08-20 | 16:30 source | `ebf3417d-76d5-42ca-8b5f-1b069a64b3a5` | `6de33e51-114e-47b8-92d3-abccb4fe6bf6` |
| `84cb56a0-64f7-4af0-b7ed-22a5f549d46c` | Tony Auton Band Jam @ The Coach and Horses | 2026-08-20 | 20:00 **defaulted** | `rT16iLy3u64bhZadG7SR` | `1efc325d-207c-4883-a18d-ff38a928df84` |
| `8286ea74-75d7-4e32-a5dd-00416c020062` | Grey Dogs @ The Crown | 2026-08-21 | 21:00 **defaulted** | `f6a91ee3-b923-4a31-b5cf-ed75ba9794b1` | `xyERKljjDSlCFaYKMWPH` |
| `6e540828-3efc-411e-83dd-8b13a5bfeb41` | Stage Two @ Albion Dukinfield | 2026-08-21 | 21:00 **defaulted** | `7d7aa48a-dd4a-48eb-8f66-f37383507738` | `06c8fb91-59f6-4180-b97b-fbc2acd4322a` |
| `49a8e1e3-c73c-45a7-8458-cc863146c12e` | Paul Waldron @ The Moor Club | 2026-08-21 | 20:00 source | `102a2613-9e16-49c2-b49e-f0c095afdd1e` | `EsXfxgxJTFkuRvaRLpS7` |
| `14a3e613-5826-4264-a2a4-3eeee8679b51` | Mandy Montgomery's Angels @ Arden Arms | 2026-08-22 | 21:00 **defaulted** | `9242d30f-f1a6-403c-99e2-7ea7584e8ae6` | `5399d41a-10a9-4064-b971-774fd096fdaf` |
| `7c658943-325f-426b-9929-7fc6b0d08e88` | Tracy Morgan & co @ Cheshire Cheese | 2026-08-22 | 21:00 **defaulted** | `bb7ede4f-5b66-462c-9f7e-05f254f0a3e3` | `18a2916a-59d1-4375-ad4d-1fa99e3a9dd8` |
| `870f7aff-4212-46a2-9060-8f7415d96493` | Soul 4 Soul @ The Wellington | 2026-08-22 | 21:00 **defaulted** | `48TinAWgzKA66q00orBZ` | `ffAHL9Hg3JsTWU36Kbiq` |

Six defaulted start times, all under §5.6, all applied by the server (`startTimeDefaulted: true`). The source publishes no time for those rows.

## 7. Gate bounces — both correct, both back-filled

| Row | Existing event | What happened |
|---|---|---|
| Just Jane @ the Musketeer Leigh 2026-08-22 | `ed435268-494a-4e86-98bb-b215698e6f9c` | 409 DUPLICATE_EVENT, `matchedExternalId: null`. The record was created 2026-02-10 with an **empty** externalIds array. `edit_event` wrote the `gigs-news` id. |
| Ged Scott @ Poynton Workmen's Club 2026-08-22 | `33c59bb2-3a9b-4af7-9d32-60abbee07d30` | 409 DUPLICATE_EVENT. The record already held `{expansion-01, poyntonwmc-2026-08-22-ged-scott}`. `edit_event` wrote the complete array in one call, keeping the expansion-01 id and adding the `gigs-news` id. |

Both reads were `get_by_id` first, then one write of the whole array, per §6B. Both were read back after. **The Ged Scott event is now dual-source** — a future §0.17 decision on it must not treat it as gigs-news's alone.

## 8. Name handling (§0.6, §1A)

| Source billing | Resolved to | Why |
|---|---|---|
| `Tony Auton band Jam` | artist **Tony Auton Band** `rT16iLy3u64bhZadG7SR` | Spec's named-host jam convention: leading name is the act, full string is the title. ADR-023 qualifier rule makes `Tony Auton` and `Tony Auton Band` one record in one region (North West UK). 67% match. |
| `the Grey Dogs` | artist **Grey Dogs** `f6a91ee3-…` (Manchester) | Leading article. 100% on the bare core. |
| `Mongomery's Angels` | artist **Mandy Montgomery's Angels** `9242d30f-…` (Stockport) | Curator misspelling of Montgomery. 72%. §1A.2 footprint agrees: the record is Stockport and the gig is the Arden Arms, Stockport. §0.20 — a spelling is not an identity. |
| `Tracy Morgan & co` | artist **Tracy Morgan** `bb7ede4f-…` (Dukinfield) | §1A.5 billing alias. The billing is kept in the event title; the artist id is the plain record. Cheshire Cheese Newton is 3 miles from Dukinfield, so the footprint agrees. |

No artist name was created from a lineup, a venue, a residency or a descriptor. No name was invented.

## 9. Rejected rows (§0 filter, spec reject list) — 46

Open mics (8), karaoke and karaoke/disco (4), DJ-only (`DJ Martin 7pm`), generic `live bands` at Spinning Top (5), theme nights with no performer (`Jazz Night`, `Jazz at the Railway`), the spec's `event_skips` entry `Backwater Blues Jam`, `next week - Stockport Rock & Roll Society`, time-only rows (`10pm - Mash Guru Macclesfield`, `8pm - Dog & Partridge Great Moor`, and 9 more), and 17 rows with a blank act segment. Every one is a venue the pipeline already holds; none produced a venue create.

## 10. Source fault — the Sunday header is stale

The page is titled `What's on This Week 19 - 23 August` and its day headers run Wednesday 19th, Thursday 20th, Friday 21st, Saturday 22nd — then **`Sunday 16th August`**. 16 August is last Sunday and is in the past.

The rows beneath it **have** been rolled: last week's Sunday acts (Cooper & the Makerfields, Ashley Sherlock, Simon Langley, the Cover Babes duo, Steve James, Elvis show) are all gone, replaced by time-only rows and one new act. So the section is this week's; only the header is stale. The correct date is 2026-08-23.

The one act under it, `Karl Magee 5pm`, is a new artist and is skipped for Chrome anyway, so the correction changed no write this run. Raised to `CTO-INBOX.md` because it will change a write as soon as Chrome returns.

## 11. Venue resolution — two more low-confidence records that read as misses

Neither produced a create. Both are the §2.16 trap.

| Probe | Result | Correct record |
|---|---|---|
| `search_venue("Coach & Horses","Oldham")` | **no venues found** | `1efc325d-207c-4883-a18d-ff38a928df84` "The Coach and Horses", Waterhead OL4 2HT, already carrying `gigs-news-uk:venue-coach-horses-oldham`. It surfaced only on the loose probe `search_venue("Coach","Oldham")`, at **25% low_confidence**. |
| `search_venue("Poynton Workmens Club","Poynton")` | **no venues found** | `QWIBLMGTJIqiGnkk1kvU` "Poynton Workmen's **Club**". The apostrophe defeats the search. `list_venues(city:"Poynton")` also missed it, because the record's city is "Stockport". It was found by reading The Driscols' event history. |

The apostrophe case is already open as `search-venue-apostrophe`. The `list_venues(city:…)` fallback failing because the venue's `city` field disagrees with its town is the same class and is worth noting: **all three §3.1 probes can miss a record that exists**.

One tool-argument error of my own: the first `search_venue` calls passed `&amp;` instead of `&`, which is the §6B prohibition. Two probes were wasted. Corrected on retry; nothing was written with the escaped form.

## 12. Snapshot and state

- Snapshot written: `data/state/gigs-news-uk-last-page.txt`, 124 lines, two sections, normalisation rules in the header.
- Self-diff gate: **0 added / 0 removed**.
- Evidence file: `data/state/enrichment-evidence-2026-08-18-gigs-news.jsonl`, empty — no enrichment write occurred.
- Validator: `0 records · 0 clean · 0 FAIL · 0 WARN [mode=gate]`, exit 0.
- `cancellations.jsonl` checked before every create. No artist+venue+date hit.
- `record_run` not called: `SOURCE_RUNS_TOKEN` is still unset, already open as `record-run-token-missing`.

## 13. Raised to CTO-INBOX.md

Four items, all new fingerprints.

1. `gigs-news-curl-reproduces-week-view` — the spec's Chrome-mandatory rule for capture is stale.
2. `gigs-news-snapshot-rows-not-date-qualified` — a snapshot line holds no date, so a weekly-recurring act at the same venue is invisible to the diff. Roy Pimmy, Tony Auton and Paul Waldron are the live proof: their rows are byte-identical across the 12–16 and 19–23 August captures, so the diff called them unchanged while their real dates moved by seven days. They were imported only because this run pipelines every week-view row rather than only the diff-added ones. A run that trusted the diff would have missed three gigs.
3. `gigs-news-sunday-header-stale-16-august` — the curator's stale Sunday header.
4. `gigs-news-chrome-unreachable-blocks-artists` — five named acts unwritable, seventh consecutive firing across four tasks.
