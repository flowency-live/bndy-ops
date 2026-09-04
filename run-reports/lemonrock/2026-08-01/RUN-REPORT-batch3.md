---
type: run-report
source: lemonrock
date: 2026-08-01
lane: lemonrock-expansion-01
batch: 3
status: ARTIST LAYER FOR CORNWALL COMPLETE — event backfill remains
---

# lemonrock · 2026-08-01 · lane `lemonrock-expansion-01` · BATCH 3

Scope: **Cornwall**, per Jason's ruling. This batch closed the **artist layer** — the part that was blocking everything else.

**Every one of Cornwall's 65 distinct acts now exists in bndy.** Before this batch, 13 did not.

---

## 1. QUALITY

| Measure | Count |
|---|---|
| Artists created **with a verified Facebook page** | **8** |
| Artists created with an **evidenced blank** | **3** |
| Artists **matched** to an existing record (no duplicate) | **1** |
| Artists **staged, not created** | **1** |
| Artist names **sanitised** | **1** |
| Errors | **0** |

## 2. CREATED WITH A VERIFIED PAGE (8)

Each page opened in Chrome, confirmed a **Musician/band** page for the right act, bio and avatar taken from it.

| Artist | bndy UUID | Facebook | Evidence |
|---|---|---|---|
| **Kerosene Cocktail** | `121a3c31-6885-4b4d-98c5-ac6389ad6632` | `/kerosenecocktail` | 11K followers · "Cornwall's Pop Punk Powerhouse… As heard on BBC Introducing" |
| **RooTzmill** | `de48a19d-d27c-4aa5-bda6-eed93677c0f8` | `/rootzmill` | 677 followers · "Proper Cornish Roots, Reggae and Ska covers band" — matches Lemonrock's *Ska / Reggae* |
| **NaffKo 54** | `89015ae4-ffbd-4cd9-838c-886b236c5cb6` | `/NaffKo54` | 589 followers · "EST. 2020 : Alternative Anthems of the 90s & 00s" — matches *Pop / Punk, Plymouth* |
| **Bottled Blondie** | `9478470d-b9bf-4df2-9f25-06bc09dbff26` | `/bottledblondie` | 1.4K followers · "Blondie Tribute Band based in Cornwall, UK" |
| **Driveglove** | `97a21977-20c5-4b37-be46-dec8abc1d5e1` | `/DriveGlove` | 486 followers · "Eighties // New Wave // Synth Pop Cover Band" — matches *80s Covers* |
| **Dog Fish Mammal** | `b7527b8f-0db1-48d9-a820-a2904a1831e7` | `/DogFishMammal` | 406 followers · "4 piece blues rock'n'roll band" |
| **Capri** | `1d81af8b-70af-4858-af1d-e36ae4955813` | `/capri80sband` | 787 followers · "Function/covers band playing songs of the 80's" — matches *80s Covers, 5 piece, Plymouth* |
| **Smug Jars** | `abcf3ce7-e47c-442a-8f98-23f313ecf6ca` | `/profile.php?id=61564992127258` | 167 followers · "acoustic guitar and vocal harmony duo" · **Launceston** |

## 3. CREATED WITH AN EVIDENCED BLANK (3)

| Artist | bndy UUID | Searches actually run |
|---|---|---|
| **Steve Panter** | `9fdc06eb-746b-475b-92b4-11dcf5dcb290` | `Steve Panter` · `Steve Panter acoustic` |
| **Andy Marshall** | `ae9efa67-83fd-44c1-b4c6-d8c609348713` | `Andy Marshall` · `Andy Marshall easy listening` |
| **Foxhole** | `9a058424-7d41-4e6d-8476-bdc00a7a412d` | `Foxhole` · `Foxhole grunge band` — **three candidate pages, none confirmable to this act.** Deliberately left blank rather than attach a guess; that guess is exactly how *Merlians* ended up pointing at `facebook.com/Rockexpert`. |

## 4. ⚑ THE FOOTLOOSE BAND RESULT — the mandate's §5 demonstrated live

`search_artist` for **Footloose** returned **nothing at 80% confidence**. On that evidence the run was about to create a new artist.

It did not, because the run had already found the act's Facebook page (`/profile.php?id=100091552269658` — 352 followers, *"Premier function rock band"*, **Exeter, United Kingdom**, matching Lemonrock's *Footloose Band; Location: Exeter, Devon*). Passing that URL to `create_artist` returned:

> `action: "matched"` · `matchedBy: "facebook"` · confidence 1 · `4b8b57c3-c363-4773-a140-fb2ba1c07ba8`

**The record already existed and only the Facebook key found it.** This is the concrete case for two standing rules at once: *"never verify with `search_artist` — documented false-negative modes"*, and *"enrichment IS the dedup key"*. Had this run skipped enrichment and trusted the search, it would have created a duplicate of a band carrying 13 gigs.

## 5. NAMES

- **`Rising Tide Trio` → Rising Tide** (§0.6 — "Trio" is the format tail). Matched the existing record `74f33fe8-f75f-44c3-8bfa-66073db0f595`; no duplicate.
- **`Six Kinds Of Wesnesday` — STAGED, not created.** Almost certainly a misspelling of *Wednesday* in the source. Two Facebook searches (`Six Kinds Of Wesnesday`, `Six Kinds Of Wednesday band`) found nothing, so the correct spelling cannot be established. Creating a permanently misspelled artist is worse than holding one support slot. Its double-bill headliner, *The Best Of Smashing Pumpkins*, already exists.
- **`Bad Knees Blues Band`** remains staged under the existing §8 open ruling. **New evidence for whoever resolves it:** the act's own Lemonrock page declares `facebook.com/badknees.bluesband`, and titles it exactly *Bad Knees Blues Band*, Buckfastleigh, Blues / Rock. That probably resolves the ambiguity — but it is Jason's ruling to close, not this run's.

## 6. CORNWALL, FULLY MAPPED FOR THE FIRST TIME

All **84 non-parked Cornwall venues** read at `?page=gigs` this batch — zero fetch errors.

| | |
|---|---|
| Importable forward gigs (within the §6E 12-month horizon) | **174** |
| Distinct venues carrying them | **77** |
| Distinct artists | **65** — **all now exist in bndy** |
| Rows staged: no publishable start time ("check times") | **18** |
| Rows parked: festival / rally / private-function / theatre venues | as batch 1 |

## 7. WHAT REMAINS FOR CORNWALL

**One thing only: event backfill.** The blocker is gone — no further Facebook work is needed for Cornwall.

1. ~**100 events** still to write, at venues whose records already exist.
2. **27 venues** in the long tail (1–2 gigs each) still need their bndy id resolved; all 27 carry a full postal address and `geo.position` from the source, so `create_venue` will resolve or create each cleanly. Two exceptions with no postcode — *Downderry Village Hall*, *Haven Perran Sands*, *Queens Head St Austell* — should be staged rather than geocoded on a town name (the *Ocean, Exmouth* failure mode).
3. **18 no-start-time rows** stay staged pending the open ruling.

That is mechanical work at roughly two calls per event, with no research in it. It did not fit in this batch alongside the artist pass.

**Unchanged and still the governing fact:** the 176-stub repair backlog, not import coverage, is what determines how Cornwall renders. This batch added 11 artists that are the opposite of stubs — every one with a bio, and eight with a verified page and avatar.
