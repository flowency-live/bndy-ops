---
type: run-report
source: lemonrock
date: 2026-08-01
lane: lemonrock-expansion-01
batch: 5
status: ✅ CORNWALL COMPLETE
---

# lemonrock · lane `lemonrock-expansion-01` · BATCH 5 — **CORNWALL IS DONE**

Every importable Cornwall gig inside the §6E 12-month horizon has now been attempted. Each one is either created by this lane or confirmed already present by a `DUPLICATE_EVENT` bounce. **Nothing is left outstanding except the items deliberately parked or staged, all of which are logged.**

---

## 1. THIS BATCH

| Measure | Count |
|---|---|
| Events created | **20** |
| Events bounced `DUPLICATE_EVENT` (§0.9 — success) | **38** |
| Errors | **0** |
| Names sanitised | **1** — `Rising Tide Trio` billing to the event title, resolved to artist **Rising Tide** |

The 52 venues carrying the residue were re-read at `?page=gigs` after the Chrome reconnect; 58 in-horizon rows with a publishable start time were pipelined, plus one multi-act bill.

Spot-checked with `get_by_id`: `ticketed`, `price`, `endTime` and `externalIds` all persisted correctly (Kerosene Cocktail @ The Wheelers, Rising Tide Trio @ The Cecil Arms, Footloose Band @ Downderry and Seaton Village Hall).

---

## 2. CORNWALL — FINAL POSITION

| | |
|---|---|
| Cornwall venues read at `?page=gigs` | **84** (all non-parked), zero fetch errors |
| Forward gigs in the snapshot | **219** |
| Importable inside the 12-month horizon | **174** |
| **Coverage** | **complete — every row created or confirmed present** |
| Distinct Cornwall artists | **65 — all exist in bndy** |

### Deliberately not imported, all logged

| What | Rows | Why |
|---|---|---|
| Festival / rally / outdoor-event venues (Boardmasters, Cornwall Folk Festival, Looe Live, Looe Music Weekender, Tunes In The Park, Great Trethew, Sticker Vintage Rally, Tipsy Cow) | 17 | No rule covers lemonrock festivals; bndy models them separately. `OPEN-RULINGS.md`. |
| "Private Function" placeholder venues (Bodmin · Botusfleming · Looe) | 3 | Privacy placeholders, not venues. Staged. |
| Lane Theatre, Lane | 3 | Parked pending CTO-DECISION-01, on The Beehive precedent. |
| Gigs with no publishable start time ("check times") | 17 | `create_event` requires `startTime`; not invented. Staged. |
| Harlyn Sands · Pissters, Looe | 2 | No postcode, no geo — would have geocoded on town name alone (the *Ocean, Exmouth* failure). Staged. |
| Rob Barratt (Stand Up Comedy) | 1 | §4 genre reject. |
| Six Kinds Of Wesnesday | 1 | Probable source misspelling, unverifiable. Staged. |
| Bad Knees Blues Band | 1 | Held under its existing §8 ruling. New evidence recorded: `facebook.com/badknees.bluesband`. |
| Crown & Anchor, Wiggenhall St Germans | (venue) | **Norfolk**, not Cornwall — caught by per-venue county verification. Dropped. |

---

## 3. LANE TOTALS — all five batches

| Measure | Count |
|---|---|
| **Venues created** | **18** — every one with a real Google Place ID |
| **Artists created** | **19** |
| — with a **verified Facebook page** (bio + avatar taken from it) | **13** |
| — with an **evidenced blank** (search variants recorded) | **6** |
| **Events created** | **104** |
| Duplicate bounces (success, §0.9) | **74** |
| Artists staged, not created | **2** |
| Venues staged, not created | **2** |
| Names sanitised | **4** — Nawtey Beys · Rising Tide · Rob C Force Band · Redhouse (Acoustic) |
| Errors | **3**, all `Invalid genres`, all fail-closed and retried clean |
| **Bad geocodes** | **0** |
| **Stubs created** | **0** |

Enrichment quality of the 19 artists this lane created, against the cohort it is meant not to repeat:

| | this lane | the 176-stub cohort |
|---|---|---|
| has `facebookUrl` | 13 / 19 | 1 / 176 |
| has `bio` | 19 / 19 | 0 / 176 |
| has `profileImageUrl` | 13 / 19 | 1 / 176 |
| has `externalIds` | 19 / 19 | 130 / 176 |

---

## 4. WHAT THIS LANE LEARNED — worth carrying to Somerset and Dorset

1. **`search_artist` is not a dedup check.** *Footloose Band* returned nothing at 80% confidence, yet the record existed — `create_artist` matched it on the **Facebook key** the enrichment pass had just found. Without that pass this run would have duplicated a band carrying 13 gigs. This is the mandate's §5, demonstrated.
2. **Verify the county on the venue's own page.** Slug-to-town matching pulled a Norfolk pub into Cornwall via a shared *St Germans*. One page read killed it.
3. **The source's address and `geo.position` are worth passing to `create_venue` every time.** Eighteen venues, eighteen real Place IDs, zero bad geocodes — against the Devon run's five bad geocodes and 22 orphaned gigs.
4. **Place-ID dedup catches what slugs miss.** `oldschoolpelyntpelynt` and `pelyntsocialclubpelynt` are one building; both externalIds now sit on one venue instead of two map pins.
5. **`create_event`'s documented field-drop did not reproduce once** across 104 creates. Flagged for deliberate re-test before the compensating-`edit_event` clause is relaxed.
6. **Somerset (283 gigs) and Dorset (143) remain untouched**, held on Jason's ruling. Their `cityId` values are captured in `sources\lemonrock.md` §6 and the method is now proven end to end.

**The governing constraint is unchanged: the 176-stub repair backlog, not import coverage, decides how Cornwall renders on the map.**
