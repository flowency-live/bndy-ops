---
type: run-report
source: klma-stoke-gig-list
date: 2026-07-31
runbook: RUNBOOK.md v2.0 (2026-07-30)
mode: unattended (scheduled task `bv2-klma-events`)
status: completed — 1 create, 2 staged
---

# KLMA Stoke gig list — run report 2026-07-31

## 1. Preconditions (§6A.1–3)

| Check | Result |
|---|---|
| Today's date | **2026-07-31** — `date` shell unavailable (workspace VM failed to start), device clock used per §6A.1 fallback |
| `RUNBOOK.md` v2.0 | present, read in full |
| `sources/klma-stoke-gig-list.md` | present, read in full |
| bndy MCP tools | reachable and verified (reads + one create + read-back) |
| Chrome | connected (`Browser 1`, Windows, local); Facebook session live |
| Snapshot `data\state\klma-stoke-gig-list-last-page.txt` | present — **but stale and in the wrong format** (see §2) |
| Bash sandbox | **UNAVAILABLE** all run ("VM service not running"). All file work done with the file tools; no scripted parsing. |

## 2. ⚠ SNAPSHOT DEFECT — read this first

The snapshot on disk was **stale by ~8 days and in the superseded CSV format**.

- Its earliest row is `Wednesday, July 22, 2026`; the live sheet now starts at `Thursday, July 30`. It was therefore captured on or about **2026-07-23**.
- It is written as quoted CSV (`"","Friday, July 31, 2026","Crosshair",…`). The source spec's **v2.1 rule requires the out:html page-text format** — the same format as the capture — precisely because the CSV-format snapshot produced **15 false "removed" rows on 2026-07-29**. That format change was specified but never applied.
- Consequence: the 2026-07-29 (supervised) and 2026-07-30 (BV2) KLMA runs both imported from the live sheet **without writing a new snapshot**, so a naive diff today reports **27 "added" rows, of which 25 were already in bndy**.

**This run did not bulk-import them.** Per §0.2 the resolvers, not the diff, decide new-vs-existing: every one of the 27 candidates was resolved against bndy by venue/artist/date before any write. Result: 25 already present, 1 created, 2 staged (§4/§5).

**Fixed this run:** the new snapshot is written in the out:html page-text format, byte-identical to today's capture, so tomorrow's diff is mechanical again.

## 3. Capture (§6A.4)

- Endpoint: `https://docs.google.com/spreadsheets/d/1atEqyN-RI1smTzSaCtMUSui7oNp2dhCpiGoAfY5ySno/gviz/tq?tqx=out:html&gid=831966245`, read as Chrome page text (`export?format=csv` remains blocked — googleusercontent redirect not allowlisted).
- Saved to `data/raw/klma-stoke-gig-list/2026-07-31/gviz-page-text.txt`.
- Column alignment re-verified against known rows (Danny Brab @ Pau, Trilogy @ Red Lion Leek): `row-id | Date | Artist | Venue | Time | Cost | Genre | Link`.
- Rows in capture: 355 lines incl. 8 form/banner rows and the trailing header row. Horizon: 2026-07-30 → 2026-12-31 (all inside the 12-month limit; the 2027 placeholder rows and 2040 metadata rows are junk-skipped as usual).

## 4. Two-sided diff (§5.7)

Diff is row-level and semantic (date + artist + venue), not textual, because snapshot and capture formats differ (§2). Both sides were read in full; no sampling.

### 4a. Removed future-dated rows — **0 cancellations, 0 deletions**

Only two future-dated rows disappeared, and both are **exact duplicates of rows that remain**:

| Snapshot line | Row | Verdict |
|---|---|---|
| 52 | `"" \| Friday, July 31, 2026 \| Crosshair \| The Furlong` | curator de-dupe — row `46184.6297` for the same act/venue/date is still present. Not a cancellation. |
| 55 | `"" \| Friday, July 31, 2026 \| Front Page News \| Post Office, Burslem` | curator de-dupe — row `46179.52102` (`Old Post Office, Burslem`) still present. Not a cancellation. |

Because the gig itself is still listed in both cases, §0.17's delete condition is not met. **No `delete_event` calls made. No events hidden.**

All other disappearances are past-dated rows (22–29 July) rolling off the top of the sheet — normal, not cancellations.

### 4b. Added future-dated rows — 27 candidates

25 already existed in bndy (created by the 2026-07-29 / 07-30 runs). Verified individually:

| Date | Row | bndy state |
|---|---|---|
| 07-31 | "Bushtonbury Day 1" - Dom Morgan @ The Bush | event `e74a86e0` |
| 07-31 | American Fear, The Other Things, Flutter @ The Rigger | **split** — `62220000` / `17b0df1f` / `9de754b2`, all dated 2026-08-01 (§5.6b date correction applied 07-30) |
| 07-31 | Jason Keady @ Capello lounge Newcastle | event `1ab30f1e` @ Cappello Lounge |
| 07-31 | The VANZ ROXX @ Ashwood Longton | event `51ad576c` |
| 08-01 | "Bushtonbury Day 2" - Eaton Park, The Vanz, Rob Wheeler @ The Bush | event `241526b1` (unsplit — see §5) |
| 08-01 | Guitar Monkey @ The plough Bignal end | event `7b3905ec` |
| 08-01 | Resurrected @ Green Star Smallthorne | event `2119306c` |
| 08-01 | Sooasis @ Swiftys Meir | billing variant of `So Oasis` — event `4c672cc7` already carries BOTH externalIds (`…-sooasis-swiftys`, `…-so-oasis-swiftys`), `price: £5.00`, ticketUrl. **Nothing to enrich.** |
| 08-01 | Tanky/Electrifying 80's show @ The Saracens Head, Warrington | event `ade3792c`, artist `a603777d` (§2A.5 verbatim name) |
| 08-01 | The VANZ ROXX @ Bushfest at The Bush Brown Edge | same gig as Bushtonbury Day 2 — **STAGED**, see §5 |
| 08-02 | Bushtonbury Day 3 @ The Bush | event `aa58b95c` |
| 08-02 | Ozzfest @ John Marstons | **STAGED / rejected**, see §5 |
| 08-02 | The VANZ ROXX @ Ye Olde Crown Burslemmy | event `705044f6` |
| 08-07 | Light of Eternity @ The Rigger | event `069ef658` |
| 08-08 | The VANZ ROXX @ FoxFest, Fox & Goose, Foxt | event `fc353358` |
| 08-14 | Andrea Harvey Solo Absolute Rockfest @ The Swan, Stone | event `d30498a3` (billing in title per §1A.5) |
| **08-15** | **Jessie James @ The Bush at Brown Edge** | **ABSENT → created this run** |
| 08-21 | Nu Call - Nu Metal Tribute Band @ The Rigger | event `6682b244` exists; the **artist create is still blocked** — see §7 |
| 08-22 | Mutton Dressed As Glam @ The Bush | event `edb1af39` |
| 08-30 | Classic Rockers duo @ Auctioneers arms, cider festival | event `31ff22e9` |
| 09-05 | Jean & Rogers @ The Bellringer | event `c32d13e4` |
| 09-18 | Classic Rockers duo @ Sir Robert peel | event `63d01cd8` |
| 09-18 | Rachel Shenton Club Anthems @ The Bellringer | event `9f9210b3` (artist `vOcRqNQmZpVLd5T4X5o9` per §1A.5 alias) |
| 09-25 | Inner Terrestrials, The Dirt @ The Rigger | split — `416e058f` / `a75a9dc7` |
| 09-26 | The Edison @ The Bellringer | event `0d3baeaa`, artist `4242897c` name corrected to `Edison` |
| 10-24 | Double Lively @ The Bellringer | event `f5c5769a` |
| 12-18 | Classic Rockers duo @ Sir Robert peel | event `7430a04e` |

No 409/422 bounces occurred — no write was attempted against an existing record.

## 5. Writes (§6A.6)

### Created — 1 event, 0 artists, 0 venues

| Field | Value |
|---|---|
| Event id | **`a62feaab-9012-47f1-8bfa-5de308b5bef0`** ✅ verified by `get_by_id` (§0.10) |
| Title | `Jessie James @ The Bush At Brown Edge` |
| Date | 2026-08-15 (Saturday) |
| Start time | **21:00 — DEFAULTED** (§5.6 Fri/Sat rule; source Time cell blank). Correctable. |
| Artist | `500f6da2-7121-44f0-9607-c4b11d3cc328` — **matched existing** (100%, location Stoke-on-Trent; footprint agrees: same act plays The Victoria/Little Vic NUL on the 07-26 row, Brown Edge is Stoke-on-Trent → §1A.2 rule 3, reuse) |
| Venue | `YUno720qqVNIwH0wgAob` The Bush At Brown Edge (learned mapping, reused) |
| `isPublic` | true |
| `eventUrl` | `https://fb.me/e/4Nzjo1QDP` (no tracking params to strip) |
| `externalIds` | `{source: "klma-stoke-gig-list", id: "2026-08-15-jessie-james-the-bush-at-brown-edge"}` (§6D slug) |

**Enrichment attempt on the matched artist (§2A.2 top-up) — result: BLANK, flagged.**
Facebook searched in Chrome (logged in) per §2A.3, two variants:
- `Jessie James Stoke-on-Trent` → top result **Jessie James Decker** (US, Musician/band, 1.5M followers); remaining results are unrelated personal/pet/photography pages.
- `Jessie James singer Staffordshire` → same US page plus unrelated pages.

No UK-consistent candidate: no Stoke/Staffordshire footprint, no member or venue overlap, nothing linking to the imported gigs. §2A.1.1 explicitly forbids attaching a non-UK same-name act. **facebookUrl left blank; genres and actType left empty (§0.18 — the source genre "All Genres" is not enum-mappable).** Blank beats wrong. Artist record remains `needsReview: true`.

### Staged — 2 rows, no writes

1. **2026-08-02 · `Ozzfest` @ John Marstons** — "all day festival and fundraiser with lots of bands artists ect paying homage to … mr ozzy osbourne". **No named act anywhere in the row.** "Ozzfest" is the event name, not an artist (§0.5 never invent an artist name; §4.1 unnameable acts exist only in display text; §6.4 rejects unnamed "live bands"). Venue resolves cleanly (`Bc8sj7DFuXIhLQI0Ar6A` The John Marston, currently 0 forward events). Park-lot reason: `non_artist_event`. Recoverable from this report — needs a lineup before it can be imported.

2. **2026-08-01 · `The VANZ ROXX` @ "Bushfest at The Bush Brown Edge"** — this is the same gig as the existing `Bushtonbury Day 2 - Eaton Park, The Vanz, Rob Wheeler` (`241526b1`), a pre-split-ruling **lumped multi-artist event**. Creating a discrete The VANZ ROXX event (`7a16a3b6`) at that venue/date is exactly the §4 target model, but it would sit alongside the lump and double-count the gig. §6.7 — ambiguous, so staged. This is the **same question already open for Bushtonbury Day 3** (OPEN-RULINGS 2026-07-29); the Day 2 / Bushfest row needs the same answer. Sibling ids for retroactive parent attachment: `241526b1` (Day 2 lump), `aa58b95c` (Day 3 lump), `e74a86e0` (Day 1, single act).

### Edits — 0
### Deletions / hides — 0
### Gate bounces (409/422) — 0

Creates this run: **1** of the 50 cap.

## 6. Defaulted / corrected values

| Item | Detail |
|---|---|
| Defaulted start time | 1 — Jessie James 2026-08-15 → 21:00 (§5.6 Saturday) |
| Date corrections applied this run | 0 (the 07-31→08-01 Rigger correction was made on the 2026-07-30 run and is left as found) |
| Venue creates | 0 — every venue in the candidate set already carried a `klma-stoke-gig-list` externalId |

## 7. Findings and open items

1. **Snapshot hygiene is the top risk on this source.** Two consecutive runs imported without writing a snapshot, leaving today's diff 8 days stale and in the wrong format. §6A.7 requires the snapshot write at the end of *every* non-held run — fixed today, but worth a gate.
2. **`search_event` under-reports `externalIds`.** It returned `externalIds: []` for events that `get_by_id` shows carrying two ids (e.g. `4c672cc7`). Not a data defect — but any run that trusts `search_event` for idempotency will conclude "no provenance" wrongly. Use `get_by_id` / `get_by_external_id`.
3. **NU CALL still blocked** — event `6682b244` is live at The Rigger 2026-08-21 but the §2A.5 verified-source-name artist create still 400s in the backend validator. Unchanged since 2026-07-30; already in OPEN-RULINGS.
4. **Bushfest / Bushtonbury Day 2 needs the same split ruling as Day 3.** Appended to OPEN-RULINGS.
5. **Bash sandbox down all run.** No scripted parsing was possible; the diff was done by reading both files in full. Slower but not lossy — flagged so the next run knows the capability may still be missing.

## 8. Artefacts

- Capture: `data/raw/klma-stoke-gig-list/2026-07-31/gviz-page-text.txt`
- New snapshot (out:html page-text format, replaces the stale CSV one): `data/state/klma-stoke-gig-list-last-page.txt`
- This report: `data/normalized/klma-stoke-gig-list/2026-07-31/RUN-REPORT.md`
