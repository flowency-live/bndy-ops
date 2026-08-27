# bndy Venue Dedupe Report

**Date:** 2026-06-08
**Scope:** All 1,245 venues in bndy (pulled via `list_venues`, 3 pages).
**Method:** Haversine distance between Google-place coordinates + normalised-name similarity (lowercase, stripped "the"/punctuation/apostrophes, Levenshtein + token overlap + containment). Two passes: (1) proximity + name similarity, (2) exact-name match including the 18 venues that have **no coordinates** (which the geographic pass cannot see).

No changes have been made to bndy. Everything below is a recommendation for you to action.

---

## Tier 1 — Confident duplicates (18 pairs)

These are the same venue twice. Recommend: keep the more complete record, merge any events onto it, then remove the other. Check event linkage before deleting.

### 1a. Same coordinates, name is just a "The"/spelling variant

| # | Record A (keep) | Record B (remove) | Apart | City |
|---|---|---|---|---|
| 1 | Railway Inn Selston `d874c766` | Railway Inn `53f3cc72` | 0 m | Selston |
| 2 | The Railway Greenfield `NwEtqexK` | Railway Inn `fec32c7a` | 2 m | Greenfield / Oldham |
| 3 | The Butchers Arms `a9568101` | Butchers Arms `e95bca2e` | 3 m | Stoke / Forsbrook |
| 4 | The Crook Hotel `de040d70` | Crook Hotel `57c3ab0e` | 6 m | Crook |
| 5 | The Golden Lion `d3200659` | Golden Lion `f34a9b2c` | 8 m | Havant |

### 1b. Exact name match where one copy has NO coordinates (the no-coord copy is the redundant one)

| # | Record A (keep — has coords) | Record B (remove — no coords) | City |
|---|---|---|---|
| 6 | The Sugarmill `333e73ff` | The Sugarmill `aa54db08` | Stoke-on-Trent |
| 7 | King's Hall `7ccde402` | King's Hall `dacdf575` | Stoke-on-Trent |
| 8 | The Furlong `39079840` | The Furlong `d186e8da` | Stoke-on-Trent |
| 9 | Polite Vicar `55aefa3f` | Polite Vicar `9ab239de` | Newcastle |
| 10 | Swan & Chequers, Sandbach `3a6bcb38` | Swan & Chequers, Sandbach `771892e3` | Sandbach |
| 11 | The Top Pub - Brown Edge `20eced38` | The Top Pub - Brown Edge `afcf412e` | Stoke-on-Trent |
| 12 | Stone Cricket Club `3ecb8752` | Stone Cricket Club `020a9f02` | Stone |
| 13 | The Peel Arms `fa0a9502` | The Peel Arms `c6b80002` | Market Drayton |
| 14 | Crown & Thistle `4bcdfe7a` | Crown & Thistle `8da2998e` | Stoke-on-Trent |
| 15 | The Bankers Draught `67696c63` | The banker's Draught `d3d37bb5` | Leek |
| 16 | The Jug `KFWFxYJA` | The Jug `6916dbc7` | Newcastle |
| 17 | Tavern `124a847b` | Tavern `c53bf273` | Uttoxeter |
| 18 | The Crown `9e6164f5` | The Crown `09448ecc` | Market Drayton |

---

## Tier 2 — Very likely (same point, one copy named by its street address)

A real venue and an auto-named "address" stub sitting on the same coordinates. Almost certainly the same place — quick visual check, then merge the address stub into the named venue.

| Named venue (keep) | Address stub (remove) | Apart | City |
|---|---|---|---|
| Mount Pleasant Inn `9b56952c` | 109 Mount Pleasant Rd `a1aa4cbf` | 3 m | Swadlincote |
| House Of Beer Ashbourne `94ce64a0` | 28b Church St `bfb1bfcf` | 3 m | Ashbourne |
| The Dog House Pub Alfreton `76e56542` | 32 Nottingham Rd `1a930f35` | 4 m | Alfreton |
| The Last Post `0249016e` | 1 Uttoxeter Old Rd `a7687e91` | 4 m | Derby |
| Spondon Liberal Club `766d5486` | 4 Moor St `e7b53d59` | 7 m | Derby / Spondon |

(There are more "address-as-name" venues in the data — e.g. *12 Midland Pl*, *282 Lovedean Ln*, *Meadow Rd*, *Bembridge Dr*, *Whatcroft Hall Ln*, *Sidney St & Matilda St* — worth a sweep, as they're a recurring import artefact.)

---

## Tier 3 — Possible (proximity, needs your judgement / possible rebrand)

| Pair | Apart | Notes |
|---|---|---|
| Crazy Moose Nantwich `n5TADkhT` / Loco Nantwich `XmFnVDvl` / The Cheshire Cat `hthWXVTn` | ≤30 m | Three bar names within 30 m on the same Nantwich spot. Likely a rebrand chain (Crazy Moose → Loco?) rather than 3 live venues. |
| Owley Wood Recreation Club `5dcf5984` / Owley Wood `bc293f4f` | 391 m | "Owley Wood" looks like a truncated entry of the club. |
| Lorentes – Darley Abbey `4394c1ad` / Darley Abbey Wines `a278c15a` | 33 m | Could be the same premises; could be two neighbours. |

---

## Considered but NOT duplicates (false positives, for transparency)

Flagged by proximity but they are genuinely different venues sharing a word or a coarse town-centre geocode:

- **Derby Market Hall / "Derby" / Derby Folk Festival** — three separate things ~100 m apart. *Note:* the venue literally named **"Derby" `ab88da0e`** is a vague/junk entry worth tidying regardless.
- Talbot / Malbank (Nantwich, 55 m); Melbourne Assembly Rooms / The Melbourne Inn (57 m); Swadlincote Cons Club / Swadlincote Town Hall (66 m).
- ~40 venue pairs sit within 40 m of each other in dense town centres (Stoke, Derby, Nantwich) purely because their coordinates round to the same point — distance alone is **not** reliable here, which is why each candidate above also had to pass a name check.

---

## Data-quality observations

- **18 venues have no latitude/longitude.** ~14 of them are exact-name duplicates of a properly geocoded venue (Tier 1b). The remaining no-coord venues — *The Crossbar @ Audley FC* `0faeb206`, *The Pickled Pig At The Bank House* `902e7440`, *Farmers Arms (Nantwich)* `3d769e43`, *Artisan Markets Newcastle* `bfdf63f6` — are not duplicates but should have coordinates added.
- The recurring **"address as venue name"** pattern (Tier 2) suggests an import path that creates a venue from a raw address when it can't match an existing one — the prime cause of the no-name/stub duplicates.

---

## Suggested next step

Tier 1 (18 pairs) can be actioned now. For each, confirm which record events are attached to, re-point events to the keeper, then remove the duplicate. I can help re-point events or draft the merges — just say the word. (I won't delete anything automatically.)
