---
type: run-report
source: lemonrock
date: 2026-08-01
lane: lemonrock-expansion-01
batch: 2
status: STOPPED UNDER CAP — 41 of 50 — remaining cap needs an enrichment pass, not more events
---

# lemonrock · 2026-08-01 · lane `lemonrock-expansion-01` · BATCH 2

Scope: **Cornwall residue**, per Jason's ruling of this date ("Finish Cornwall. Hold Somerset and Dorset").

**41 creates, all events. Stopped at 41 rather than 50** — see §4.

---

## 1. QUALITY

| Measure | Count |
|---|---|
| Events created | **41** |
| Events bounced `DUPLICATE_EVENT` (§0.9 — success) | **12** |
| Artists created | **0** |
| Venues created | **0** |
| Artist names sanitised (billing → event title) | **1** |
| Rows dropped, beyond the §6E 12-month horizon | **1** |
| Errors | **0** |

Ticket data on all 41: 39 `ticketed: false / price FREE`, 2 ticketed — *The MorZim @ Saltash Social Club* 2026-10-03 at **£3**, and *Dew Barf @ Bullers Arms* 2026-09-19 marked ticketed with price unstated by the source. `ticketed` and `price` again persisted without a compensating `edit_event`, consistent with batch 1.

**Name sanitised.** Lemonrock bills the act as **`Rob C Force Band`** on the Globe Inn dates and **`Rob C Force`** elsewhere — the same slug `robc`. Per §0.6 the billing went to the **event title** and both events resolve to the existing artist `d08e67a6-5062-423e-8b8e-651a51bb3cbf`. No second artist record was created.

**Dropped on horizon.** `969785-2027-08-28` (Vinyl Frontier, Polperro RBL) falls outside the §6E 12-month window. Not an error; it will import on a later run.

---

## 2. A CORRECTION TO BATCH 1'S REPORT

Batch 1 stated "57 of 65 Cornwall artists already existed." **That figure was an inference, not a measurement** — it subtracted the 8 artists created from the 65 distinct artists in the listing and assumed the remainder were present. It was not verified and it is wrong.

Measured in batch 2, across only 11 of Cornwall's ~87 venues, **10 artists do not exist in bndy**:

Smug Jars · Steve Panter · Capri · NaffKo 54 · Bottled Blondie · RooTzmill · Driveglove · Kerosene Cocktail · Andy Marshall · Dog Fish Mammal

Each checked with `search_artist` at 85% confidence; the near-misses re-checked at 60% to rule out a duplicate-by-variant. None of the ten declares a Facebook URL on its Lemonrock page, so each needs a real search before it can be created.

**Consequence for planning:** the Cornwall residue is *not* "nearly all events". Extrapolated, finishing Cornwall will create several dozen artists, each carrying a Facebook pass — the same cost shape as Somerset or Dorset, not a cheaper alternative. This correction was surfaced to Jason before the cap was spent; he confirmed "Finish Cornwall".

---

## 3. WHAT WAS WRITTEN

41 events across 11 venues, 2026-08-28 → 2027-07-16. Venues touched (all pre-existing, full UUIDs):

| Venue | bndy UUID |
|---|---|
| Bullers Arms | `bb5fde28-c17c-4b95-b9a7-1c4349b54ecd` |
| The Wheelers | `0f68dd4f-e474-4194-a76b-9bbadd68ce10` |
| Calstock Social Club | `de40a888-22da-431e-a0a6-bcc6f6c7f742` |
| The Globe Inn, Looe | `8ebd0ba0-6705-435d-add4-a97d3c2ad2eb` |
| The Halfway House Inn | `436d6d70-cd60-4446-82e4-9a7bef71a37b` |
| Polperro Royal British Legion | `c5fb91f0-7ba2-4259-844c-5b5f8411fbbc` |
| The Ploughboy | `2f83a283-5a31-4dcd-8baa-b0bbe5ea881a` |
| Saltash Social Club | `babd10ad-45fe-4fcc-804e-725d8c1aff65` |
| Liskeard Constitutional Club | `ca4305c3-310c-467b-a1cb-2a57f0dd1866` |
| King's Arms, Lostwithiel | `813cd1dc-96fe-4a65-a739-fb1e92cf256a` |
| The Cobweb Inn | `fac60ad3-49db-43cc-8545-0209fcac47c1` |

---

## 4. WHY THIS STOPPED AT 41, NOT 50

The nine remaining cap slots belong to artists, not events — every further Cornwall event at these eleven venues is already written or already bounced. Spending those nine slots means running the Facebook pass for the ten artists in §2, which is a fresh unit of work rather than a continuation of this one. Creating a subset of them mid-pass would leave their gigs half-imported and the ledger harder to read.

**Stopping under cap is the deliberate choice, not a shortfall.**

---

## 5. WHAT "FINISH CORNWALL" ACTUALLY COSTS — stated plainly

Batches 1 and 2 have covered **11 of Cornwall's ~87 importable venues.** Batch 1's Cornwall snapshot holds **219 forward gigs**; **70 events** now exist from this lane's two batches plus the earlier runs' residue.

Remaining, on current evidence:

1. **~76 venues not yet re-read** at `?page=gigs`. Their gigs are in the snapshot but their artist, time and fee fields are not captured.
2. **~10 artists identified as new** in the 11 venues done, needing a Facebook pass each. Pro-rata across the remaining 76 venues, expect **several dozen more**.
3. **~110 further events** once those artists exist.

At the lane's 50-create cap, Cornwall alone is **roughly four to six more batches**, and the dominant cost is artist enrichment, not event writes. That is the honest number; batch 1's report implied a much smaller residue because it rested on the unverified 57-of-65 figure.

Nothing here changes the standing conclusion: **the 176-stub repair backlog, not import coverage, is what governs how Cornwall renders on the map.**
