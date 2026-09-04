---
type: run-report
source: onthecasemusic
date: 2026-07-31
runbook: RUNBOOK.md v2.0
status: HELD — zero bndy writes
---

# onthecasemusic — run report 2026-07-31

**Outcome: HELD. Zero bndy writes.** Capture succeeded cleanly; the run stopped at the
snapshot-diff gate (§6A.5). Snapshot deliberately **not** written, so tomorrow's diff is not
poisoned.

## Counts

| | |
|---|---|
| Created | **0** |
| Matched | 0 |
| Edited | 0 |
| Deleted | 0 |
| Bounced (409/422) | 0 — no write calls made |
| Staged / parked | 246 in-horizon rows (see §4) |
| Defaulted times | 0 — every row carried an explicit time |

## 1. Run contract steps

| Step | Result |
|---|---|
| 1. Today's date | **2026-07-31**. `mcp__workspace__bash` unavailable ("VM service not running") → device clock used, per §6A.1 fallback. |
| 2. Read RUNBOOK.md in full | ✅ v2.0 (2026-07-30) |
| 2. Read sources/onthecasemusic.md in full | ✅ |
| 3. Verify tools | bndy MCP ✅ reachable (read calls succeeded). Chrome ✅ connected ("Browser 1", Windows, local). Shell ❌ down — not required by this source. |
| 4. Capture | ✅ `data/raw/onthecasemusic/2026-07-31/gigs-normalised.txt` — full feed, 273 rows, 2026-07-31 → 2027-12-18 |
| 5. Two-sided diff | ❌ **BLOCKED** — see §2 |
| 6. Pipeline rows | ⛔ not run |
| 7. Report + snapshot | Report written. **Snapshot NOT written** (§6A.5). |

## 2. BLOCKER — the snapshot cannot support a mechanical diff

`data\state\onthecasemusic-last-page.txt` exists but does not meet the format its own spec
mandates ("stored as normalised pipe rows … the **FULL feed** including beyond-horizon rows").
What is actually stored, verbatim structure:

- Header `Fetched 2026-07-16`
- Pipe rows for **17 Jul – 26 Jul 2026 only** — a 14-day window. Every one of those dates is
  now past.
- Then a literal marker line: `--- BEYOND WINDOW (first few for diff context) ---`
- Three dates (31 Jul, 1 Aug, 2 Aug) in a **different, lossy format** — semicolon-joined,
  self-described as "first few", no times, no prices, no addresses.

Consequences, both fatal to §5.7:

1. **Added-row side.** The snapshot's coverage ends 2 Aug 2026. The capture runs to
   31 Jul 2027 (in-horizon). ~236 of 246 in-horizon rows are "absent from the snapshot"
   purely because the snapshot never held them. Pipelining those is exactly the bulk-import
   §6A.5 forbids — and the source spec records that the 2026-07-29 run already imported
   238 gigs to this horizon, so nearly all of them are already in bndy.
2. **Removed-row side.** §5.7(b) says "look up the bndy event by **this source's
   externalId**". That lookup cannot work here — see §3. The one format-comparable slice
   (31 Jul – 2 Aug) was checked anyway and is resolved in §3.

Per §6A.5 this is a held run, not a green field.

## 3. Second, independent blocker — onthecasemusic events carry NO externalIds

Verified live, read-only, this run:

```
search_event(artistId=1c2bff07…Hybrids, 2026-07-31 → 2026-08-05) → 3 events, all "externalIds": []
get_by_external_id(event, onthecasemusic, 2026-08-01-1977-new-hartley-smc-new-hartley) → found: false
```

This is §6C's **"Empty externalIds"** failure class, live on this source. Provenance and
idempotency for onthecasemusic events currently rest on nothing. §6D's stable-slug scheme
(v2.0) has never been applied to these records — the April/July imports predate the ruling.
Until existing records are back-filled, §5.7(b) is unimplementable for this source.

### 3.1 The three comparable removed rows — all resolved, none actionable

| Snapshot row | Present in new capture? | bndy state | Verdict |
|---|---|---|---|
| Fri 31 Jul — Undercover Band @ Bridge Hotel Durham | ✅ yes | — | not removed |
| Fri 31 Jul — Hybrids @ Blacksmiths Arms Gosforth | ✅ yes | event `536ab98b` exists, 21:00 ✓ | not removed |
| Fri 31 Jul — Russ Tippins Electric Band @ Crown and Cannon Winlaton | ✅ yes | — | not removed |
| Sat 01 Aug — Hybrids @ Clousden Hill | ❌ absent (Clousden Hill now Charlotte Forman; Hybrids moved to Red Lion Earsdon 20:00) | **no Clousden Hill event exists** for Hybrids that date | nothing to delete — see §3.2 |
| Sat 01 Aug — We 3 Colonels @ White Swan Morpeth | ✅ yes | — | not removed |
| Sat 01 Aug — 1977 @ New Hartley SMC | ❌ absent (New Hartley has no 1 Aug row at all) | artist `d7c8ec6a` exists; **zero events 31 Jul – 5 Aug** | never imported — nothing to delete |
| Sat 01 Aug — In At The Deep End @ Bebside Inn | ✅ yes | — | not removed |
| Sun 02 Aug — Diamond Dogs @ Sea Horse Club | ✅ yes | — | not removed |
| Sun 02 Aug — Dakota @ Crown and Cannon Winlaton | ❌ absent (now Black Cadillac) | artist `cb798bf5` exists; **zero events 31 Jul – 5 Aug** | never imported — nothing to delete |

**Net: zero §0.17 deletions warranted.** All three disappearances are venue/act swaps by the
curator, and in each case the corresponding bndy event was never created. No delete call was
made.

### 3.2 Data defect found in passing — duplicate Hybrids event + broken venue

Read-only discovery while checking §3.1. **Not touched** — §0.11 forbids merges/deletes during
an import run; this is cleanup work.

```
9e97f365-2e18-4d59-b158-1d7da41a7444  "Hybrids @ The Red Lion, Earsdon"  2026-08-01 20:00
    venueId 7dd36d63-9169-4b16-a1e9-77b1b83e7ec8  →  venueName "Unknown Venue", city null
fccb511f-5697-4f89-bbf0-71026648562b  "Hybrids @ The Red Lion"           2026-08-01 20:00
    venueId 7dd36d63-114c-4a5a-8e27-69f8d2c97244  →  "The Red Lion", Whitley Bay
```

Two events, same artist, same date, same time — the artist+venue+date sentinel did not catch
them because the venueIds differ. One of the two venue records resolves to **"Unknown Venue"
with a null city**, which is a §0.8 violation (venue created without a resolvable place). Both
event records have empty externalIds.

Note the venueId prefixes are identical (`7dd36d63`) — worth checking whether that is a
coincidence or an id-generation bug.

## 4. What a first-run import WOULD create (§6A.5 requirement)

Full capture: **273 rows**, 2026-07-31 → 2027-12-18.
Within the §5.5 / §6E 12-month horizon (≤ 2027-07-31): **246 rows**.
Beyond horizon (kept in capture, not imported): **27 rows**.

### 4.1 Skips inside the horizon — 5 rows

| Date | Row | Rule |
|---|---|---|
| 2026-07-31 | Undecided Acoustic Duo @ Sun Inn Morpeth | source spec skip list — Jason 2026-07-29 |
| 2026-08-14 | to be confirmed @ Blacksmiths Arms Gosforth | §0.4 placeholder |
| 2026-08-29 | to be confirmed @ New Hartley SMC | §0.4 placeholder |
| 2026-09-19 | to be confirmed @ Old Fat Ox Holywell | §0.4 placeholder |
| 2026-12-20 | to be confirmed @ Crown and Cannon Winlaton | §0.4 placeholder |

**Net importable inside horizon: 241 event rows.** Against a §6 cap of 50 creates/run, this
alone confirms the run cannot proceed on a broken baseline — it would take five capped runs
to walk a feed that is already ~97% imported.

### 4.2 Row counts by month (in-horizon)

| Month | Rows | | Month | Rows |
|---|---|---|---|---|
| 2026-07 (31st only) | 10 | | 2027-01 | 6 |
| 2026-08 | 58 | | 2027-02 | 6 |
| 2026-09 | 35 | | 2027-03 | 8 |
| 2026-10 | 39 | | 2027-04 | 6 |
| 2026-11 | 35 | | 2027-05 | 6 |
| 2026-12 | 29 | | 2027-06 | 4 |
| | | | 2027-07 | 4 |

### 4.3 Rows needing attention when the run is unblocked

Not resolved this run — logged so the unblocked run does not rediscover them.

- **Billing aliases already ruled (§1A.5) — reuse, never create:**
  `Russ Tippins Electric Band` (2026-07-31) → **Russ Tippins** `d00d1abd` ·
  `Dogs In A Box Duo` (2026-09-12) → **Dog In A Box** `e9e0b454` ·
  `Rock & Roll Preachers` (2026-10-10) and `Rock n Roll Preachers` (2027-03-06) →
  **Rock and Roll Preachers** `1382449f` ·
  `Mad Manners - One Man Madness Show` (2027-06-19) → **Mad Manners** `8c4c7181` ·
  `Riff Raff` (2026-09-13) → NW record `b88a13b3`, footprint-proven, no NE twin ·
  `Rock Doctors` (2026-07-31) → **The Rock Doctors** `bae7bce9`.
- **Learned venue mappings that apply:** Sea Horse Club `a5f246ed` · New Hartley SMC →
  New Hartley Memorial Hall `2a48a6a4` · Murton Officials Club → Murton Club (Official)
  `05272a47` · Fat Ox Whitley Bay → Fat Ox Hotel `f4712549` · Bridlepath Whickham →
  The Bridle Path `05c443b1` · Easington Colliery WMC `758d8dc5` · Clennel Hall Rothbury →
  Clennell Hall Country House `1f0ec1cc`.
- **New venue names not in the learned-mapping table** (need §3 resolution, place_id
  required): Turbinia (Newton Aycliffe) · Billy Bootleggers, Byker · Seven Stars Ponteland ·
  Penny Gill Spennymoor · Ox & Plough Washington · The Peacock Newcastle · Runhead Bar &
  Grill Ryton · Red House Farm Whitley Bay · Three Tuns Gateshead · Angels Place Sunderland ·
  Melton Constable Seaton Sluice · The Prior Doxford Sunderland · Cross Keys Washington ·
  Live Lounge Sunderland · Sun Inn Morpeth.
- **Names to sanity-check before any create** (§0.6 / §6C pub-as-artist): `Turbinia` appears
  as a venue here, not an act. `Justuzfor`, `Six Nowt`, `GodZZ of Wor`, `Sugar B's`,
  `The Comittee` (sic — curator spelling), `Koolrock Uk`, `OasisJam`, `Fizzyfish`,
  `Indie Scene Proposal`, `Beef`, `Scratch`, `Charlie` — short/odd names needing the §2A.3
  Chrome FB pass and a §1A.2 footprint check before any record is created.
- **`Urban Starz` (2026-08-07)** — the runbook §2A.3 cites this act by name: the page's own
  stated location is **Teesside**, not Newcastle. Do not let the gig town donate the location.
- **`Lynch Mob` (2026-08-15)** — high non-UK collision risk (US band of that name).
  §2A.1(1): blank beats wrong.

## 5. Data-quality flags raised (no writes made)

1. **Empty externalIds across onthecasemusic events** — §6C failure class, live. Blocks §5.7
   permanently until back-filled. **This is the single highest-value fix for this source.**
2. **Duplicate Hybrids event + "Unknown Venue" record**, §3.2 above.
3. **Non-canonical artist locations.** `1977` (`d7c8ec6a`) and `Dakota` (`cb798bf5`) both
   store location **"North East England"**. §1A.1's canonical value is **"North East"** —
   "North East England" is not in the 13-region enum, so it cannot distinguish records or
   filter the map. Likely affects the wider 209-artist onthecasemusic cohort. Needs a sweep,
   not a per-run fix.
4. **Snapshot format drift**, §2 above — the stored snapshot silently became a 14-day window
   on a source whose spec explicitly says it is *not* a rolling window.

## 6. Rules cited

§0.1 (no scheduled-task changes — none made) · §0.4 · §0.6 · §0.8 · §0.11 (defect in §3.2 left
untouched) · §0.17 · §1A.1 · §1A.2 · §1A.5 · §2A.1 · §2A.3 · §3 · §5.5 · §5.7 · §6 (50-create
cap) · §6A.1 · §6A.5 (**the hold**) · §6C · §6D · §6E.

## 7. To unblock

1. Rule on the snapshot. The full-feed normalised capture is already written and ready to be
   promoted verbatim: `data/raw/onthecasemusic/2026-07-31/gigs-normalised.txt` →
   `data/state/onthecasemusic-last-page.txt`. Promoting it makes tomorrow's diff mechanical
   and correct — but it also means today's 246 in-horizon rows are never re-offered, so it
   should only be promoted once you're satisfied the 2026-07-29 import really did land them.
2. Back-fill §6D slug externalIds onto existing onthecasemusic events (VSCode-agent job).
   Without this, cancellation detection stays impossible for this source.
3. Clean up the duplicate Hybrids pair and the "Unknown Venue" record (§3.2).
4. Sweep "North East England" → "North East" across the onthecasemusic artist cohort.

No scheduled task was created, modified or re-enabled (§0.1).
