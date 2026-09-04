# gigs-news — scheduled run 2026-08-19

- **Run id**: `gigs-news-2026-08-19T04-07-31Z`
- **Runbook read**: `RUNBOOK.md` H1 **v2.27**, in full. Floor in §6A is **v2.19**. Assertion PASSES.
- **Prompt floor**: the task prompt states no number. §6A step 2a is the gate.
- **Spec read**: `sources/gigs-news-uk.md`, in full.
- **Inbox read**: `CTO-INBOX.md`, in full, before any item was considered.
- **Claim**: `data/state/claims/gigs-news.json`, acquired 04:07:31Z, TTL 90 minutes. Previous holder released cleanly at 2026-08-18T22:40:00Z. No takeover.
- **Heartbeat**: `data/state/heartbeat/gigs-news-2026-08-19T04-07-31Z.json`.
- **Outcome**: PARTIAL. Two gigs written. Eight named gigs stay unwritable while Chrome is down.

## 1. Counts

| Measure | Count |
|---|---|
| Events created | 2 |
| Events edited | 0 |
| Artists created | 0 |
| Venues created | 0 |
| Records created with a verified page | 0 |
| Records created with an evidenced blank | 0 |
| Rows skipped — new artist, Chrome unreachable | 8 |
| Rows rejected by the §0 filter and the spec reject list | 62 |
| Gate bounces | 0 |
| Creates against the 50 cap | 2 |
| Validator | 0 records · 0 clean · 0 FAIL · 0 WARN, exit 0 |

No artist and no venue was created, so no enrichment write occurred. The verified-page and evidenced-blank rows are therefore a correct zero, not an omission.

## 2. Capture

Chrome is unreachable. `tabs_context_mcp` returned "Claude in Chrome is not connected" on two attempts. This is the **31st consecutive firing** of the same outage across the enrichment, spider, klma and onthecase tasks.

A container `curl` returned both pages complete, as it did on 18 August.

| URL | HTTP | Bytes |
|---|---|---|
| `https://www.gigs-news.uk/` | 200 | 108,409 |
| `https://www.gigs-news.uk/branded.htm` | 200 | 259,533 |

Raw HTML held in `data/raw/gigs-news-uk/2026-08-19/`. Collection reads `a[href]` from the parsed DOM, per §0.22. No row was taken from a text dump.

The week view is still titled `What's on This Week 19 - 23 August`. The page is one day older than the capture and the curator has edited it in place.

Chrome is still required for §2A.1 artist identification. It blocked eight rows and nothing else.

## 3. Horizon and the branded.htm forward list

The forward list is the header `gigs 2026` plus the 14 contiguous source lines that follow it, which split into **27 dated rows**. The next `Gigs 2026` header opens 186 rows of archive and is excluded. Both safeguards held: ordinal position, and the capitalisation cross-check. A third check — day name against date — passed on every forward row.

The forward list is **unchanged from the stored snapshot: 0 added, 0 removed**. Its 22 importable rows were verified present in bndy on 18 August under artist `branded` `rwDw320gku5uQ4gzaU2N` and no row moved, so no re-verification was needed.

One parsing note carried into the snapshot header: `curl` returns several forward rows joined onto one line. They are split before each `<DayName> <digit>`, with `Friday/Saturday` matched **before** `Saturday`, or the row `Friday/Saturday 14/15 August - looking for a venue / cancellation` splits in the middle of its own day name.

## 4. Diff (§5.7)

Mode: the spec declares neither `delta` nor `append-only`. Already open as `gigs-news-mode-undeclared` (2026-08-12). The run defaulted to **append-only** and removed nothing.

- **Section 1 (week view)**: 2 added, 0 removed, 4 changed.
- **Section 2 (branded forward list)**: 0 added, 0 removed.
- **§5.7(a) self-diff gate**: the new snapshot re-diffed against the capture it was written from returns **0 added / 0 removed**.

**No future-dated row disappeared**, so no §0.17 decision arose on either mode.

Every change is the curator filling in an act name against a slot that was blank yesterday. That is the whole delta:

| Old snapshot line | New line | Meaning |
|---|---|---|
| *(absent)* | `Ricky Stone 5-7pm - Coach & Horses Oldham` | new row, Wed 19 Aug |
| `- the Railway Greenfield` | `Lee Buckle & friends - the Railway Greenfield` | act named, Fri 21 Aug |
| `- Coach & Horses Oldham` | `karaoke - Coach & Horses Oldham` | slot filled with karaoke, Sat 22 Aug — rejected |
| *(absent)* | `Andy Lee 4pm - Windsor Castle Marple Bridge` | new row, Sat 22 Aug |
| `- Windsor Castle Marple Bridge` | *(absent)* | the same blank slot, moved from the Sunday block to Saturday |
| `4pm - Railway Greenfield` | `Cold Flame 4pm - Railway Greenfield` | act named, Sun 23 Aug |
| `6pm - Coach & Horses Oldham` | `Smudge 8pm - Coach & Horses Oldham` | act named and time corrected, Sun 23 Aug |

Normalisation applied to both sides and recorded in the snapshot header: whitespace runs collapsed to one space; every line trimmed; trailing comma, full stop or slash stripped; HTML entities decoded once; empty lines removed.

## 5. Row disposition — all 94 week-view lines

| Class | Count |
|---|---|
| Page furniture (title, week strap, 2 featured duplicates) | 4 |
| Day headers | 5 |
| Blank-act and time-only rows — the curator's empty slots | 40 |
| Named rows rejected by the filter | 22 |
| Named rows importable | 23 |

The 23 importable rows account fully:

| Disposition | Count | Rows |
|---|---|---|
| Already in bndy, verified 18 Aug, unchanged at source | 13 | Roy Pimmy, Tony Auton Band Jam, Grey Dogs, Stage Two, Paul Waldron, Mongomery's Angels, Tracy Morgan & co, Soul 4 Soul, Just Jane, Ged Scott, and 3 `Reserved` rows carried by artist `branded` |
| **Written this run** | 2 | Cold Flame, Smudge |
| **Blocked — new artist, no Chrome** | 8 | Ricky Stone, Route 66, Lee Buckle, Thombres, Sinnertwin, Andy Lee, Zak James, Karl Magee |

The 22 rejected named rows: open mics (8), karaoke and karaoke/disco (6), DJ-only (`DJ Martin 7pm`), generic `live bands` at Spinning Top (3), theme nights with no performer (`Jazz Night`, `Jazz at the Railway`), the spec `event_skips` entry `Backwater Blues Jam`, and `next week - Stockport Rock & Roll Society`. Every venue behind them is already in bndy; none produced a venue create.

## 6. Events created

Both carry `isPublic: true` and a `{source:"gigs-news", id:"<date>-<artist>-<venue>"}` externalId in the form this source already uses. Both were read back with `get_by_id` (§0.10).

| Event id | Title | Date | Time | Artist id | Venue id |
|---|---|---|---|---|---|
| `47793a7b-c5b0-4733-bbb3-d5fd115e40b9` | Cold Flame @ The Railway | 2026-08-23 | 16:00 source | `bf9fc099-9238-4778-a06d-2e6a1b1a3d2c` | `NwEtqexKQqLHyBcPVgJF` |
| `7c90df59-b515-4a69-a115-33efc128b5fa` | Smudge @ The Coach and Horses | 2026-08-23 | 20:00 source | `b4cbf739-b352-4985-bc91-222ec42a61fe` | `1efc325d-207c-4883-a18d-ff38a928df84` |

externalIds written: `2026-08-23-cold-flame-railway-greenfield` and `2026-08-23-smudge-coach-and-horses`. Neither existed — checked with `get_by_external_id` before the create.

No start time was defaulted. Both rows publish a time.

`cancellations.jsonl` was read before each create. No artist + venue + date hit. The file holds five lines; none touches a gigs-news venue on 19–23 August.

## 7. Identity decisions (§1A)

**Cold Flame.** `search_artist` returned `COLD FLAME` `bf9fc099-…` at 100%, stored location **Derby** — a different canonical region from the Greenfield gig. §1A.2 says the stored location is not the test, so the footprint was pulled: `search_event(artistId, 2026-01-01 → 2027-06-30)` returns one event, **Cold Flame @ The Acoustic Lounge, Stockport, 2026-08-22** (`8db0bd41-195f-49b7-8d6b-5cdfb676f82b`, source `cowork-discovery`). Greenfield is 12 miles from Stockport and inside the same canonical region as that gig, so §1A.2 rule 3 applies: **same artist, reuse**. No second record was created. The stored `Derby` value is not corrected — §1A.1 forbids sweeping a working location, and the record stays distinguishable either way.

**Smudge.** `search_artist` returned `Smudge` `b4cbf739-…` at 100%, a duo in **Dukinfield**. Coach & Horses Waterhead is 4 miles away, so the footprint agrees. The spec's alias table already rules `Smudge duo` → **Smudge** under ADR-023. Reuse.

**Lee Buckle & friends** would resolve to the artist **Lee Buckle** under §1A.5, with the billing kept in the event title. `search_artist("Lee Buckle")` returns nothing above 50% — top hit `Lee Ashley` at 50%, which is shared-token noise (§1A.7), not a collision. The act is new and therefore blocked, see §8.

No artist name was created from a lineup, a venue, a residency or a descriptor. No name was invented. No name needed sanitising this run.

## 8. Rows blocked — a new artist and no Chrome

§2A.1 items 5 and 7 forbid creating an artist without an identity check on the name, and Chrome is the only surface for that check. Eight rows are skipped for the next run to retry. None is a defect; each is one search away from a create once Chrome returns.

| Row | Date | Venue | `search_artist` top hit |
|---|---|---|---|
| Ricky Stone 5-7pm | 2026-08-19 | Coach & Horses Oldham | `Silkstone` 64% — noise |
| Route 66 | 2026-08-20 | the Welcome Inn Whitefield | nothing above 50% |
| Lee Buckle & friends | 2026-08-21 | the Railway Greenfield | `Lee Ashley` 50% — noise |
| Thombres | 2026-08-21 | the Musketeer Leigh | no match at any confidence |
| Sinnertwin | 2026-08-22 | Bike n Hound Hyde | `Siân Hawkins` 50% — noise |
| Andy Lee 4pm | 2026-08-22 | Windsor Castle Marple Bridge | `Andy T.` 63% — noise |
| Zak James | 2026-08-22 | Buxton Working Mens Club | `Just James` 60% — noise |
| Karl Magee 5pm | 2026-08-23 | the Albion Dukinfield | nothing above 50% |

Five of the eight (Route 66, Thombres, Sinnertwin, Zak James, Karl Magee) have now been blocked for two consecutive firings. Three are new today. **Four of the eight are dated inside the next four days**, so the outage is costing live gigs, not backlog.

## 9. Source fault — the Sunday header is still stale

The page is titled `What's on This Week 19 - 23 August`. Its day headers run Wednesday 19th, Thursday 20th, Friday 21st, Saturday 22nd — then **`Sunday 16th August`**, which is last Sunday.

The rows beneath it are this week's, so the correct date is **2026-08-23**. That is the date used for both events written this run, and 2026-08-23 is a Sunday, which is the third safeguard.

Unlike yesterday, **this correction did change a write**: Cold Flame and Smudge are both under that header. Both would have been dated to a past Sunday and rejected under §0.14 had the header been trusted. Already open as `gigs-news-sunday-header-stale-16-august`.

## 10. Venue resolution

No venue create arose. Both venues came from the spec's learned mappings and were confirmed with `get_by_id`:

| Source label | bndy record | Postcode | Check |
|---|---|---|---|
| `Railway Greenfield` | `NwEtqexKQqLHyBcPVgJF` "The Railway", Oldham | OL3 7JZ | Its stored Facebook page `RailwayInnGreenfieldOldham` matches the source anchor. |
| `Coach & Horses Oldham` | `1efc325d-207c-4883-a18d-ff38a928df84` "The Coach and Horses", Waterhead | OL4 2HT | Its stored Facebook page `coachandhorseswaterhead` matches the source anchor. |

Both postcodes sit in the expected county (§0.24). Neither probe went near `search_venue`, so the apostrophe trap did not arise.

## 11. Snapshot and state

- Snapshot written: `data/state/gigs-news-uk-last-page.txt`, 125 lines, two sections, normalisation rules in the header.
- Self-diff gate: **0 added / 0 removed**.
- Snapshot format deliberately unchanged. `gigs-news-snapshot-rows-not-date-qualified` proposes date-qualifying each line; doing it inside a run would re-enumerate the whole file and read as a wholesale replacement tomorrow, which §0.29 names as the exact condition that disqualifies a source from `delta`. It is a spec change, not a run change.
- Evidence file: `data/state/enrichment-evidence-2026-08-19-gigs-news.jsonl`, empty — no enrichment write occurred.
- Validator: `0 records · 0 clean · 0 FAIL · 0 WARN [mode=gate]`, exit 0.
- `record_run` not called: `SOURCE_RUNS_TOKEN` is still unset, already open as `record-run-token-missing`.
- Today's other run reports and `run-summary.jsonl` were read before any create, per §5.4 v2.19. Nothing today deleted a gigs-news event.

## 12. Raised to CTO-INBOX.md

One item, one new fingerprint.

1. `gigs-news-chrome-outage-eight-acts-four-days` — the outage has moved from a backlog cost to a live one: eight named acts unwritable, four of them playing within four days. The existing `gigs-news-chrome-unreachable-blocks-artists` line records the fault; this line records that it has stopped being cheap.

Nothing else was raised. The Sunday header, the mode declaration, the undated snapshot lines, the `record_run` token and the Chrome fault itself are all already open under their own fingerprints, and §CTO-INBOX rule 5 forbids a second line for the same item.
