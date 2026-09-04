---
type: run-report
source: lemonrock
date: 2026-08-01
lane: lemonrock-expansion-01
batch: 4
status: HALTED — Chrome extension disconnected mid-run. Not a decision point; a tool failure.
---

# lemonrock · 2026-08-01 · lane `lemonrock-expansion-01` · BATCH 4

Scope: **Cornwall event backfill.** Ran continuously per Jason's instruction — no go/no-go pauses.

**Halted by a Chrome extension disconnect, not by choice.** `tabs_context_mcp` returns *"Browser extension is not connected"* on repeated attempts. Lemonrock has no API, so with Chrome down the remaining source rows cannot be read at all. Everything written before the disconnect is committed and verified.

---

## 1. WRITTEN THIS BATCH

| Measure | Count |
|---|---|
| Venues resolved (`create_venue` find-or-create) | **36** |
| — of which **newly created** | **7** |
| — of which matched an existing record on Google Place ID | **29** (provenance back-filled with the `lemonrock` externalId) |
| Events created | **7** |
| Events bounced `DUPLICATE_EVENT` (§0.9 — success) | **11** |
| Errors | **0** |

**Venues created (full UUIDs):**

| Venue | bndy UUID |
|---|---|
| The Blisland Inn, Blisland | `ac5559c1-159b-4e47-85d0-0216fd2aaa0d` |
| Old Albion Inn, Crantock | `5c06c3bb-3813-4fde-b9cf-97cbd7813607` |
| The Red Lion, St Columb Major | `402befc8-cfe2-4504-ad98-9d1e48da1373` |
| Parc Trenance, Tregolds | `8bea377f-d158-4771-96db-b7aa95a6d365` |
| The Four Lords, St Blazey Gate | `180ff4de-e415-4c65-93e9-11e07c531a81` |
| Archer Arms, Lewannick | `f28808e2-31ef-49b8-b210-f7f2e5d7607f` |
| Downderry and Seaton Village Hall | `9c7845c1-8fd8-4857-8d62-cafda8fdd75c` |

All seven resolved to a real Google Place ID. **Zero bad geocodes across all four batches.**

**Events created:** Off The Wall @ The Blisland Inn · Dew Barf @ The Elephant at Port Eliot (ticketed) · The Mighty Pumpkins @ The Fishermans Arms, East Looe · The MorZim @ Old Albion Inn · Andy Marshall @ Calstock Social Club · Vinyl Frontier @ The Red Lion, St Columb Major · The Stone River Band @ Looe Social Club.

## 2. TWO FINDINGS WORTH KEEPING

**Lemonrock publishes one building under two venue slugs.** `oldschoolpelyntpelynt` and `pelyntsocialclubpelynt` both resolved to the same Google Place and therefore the same bndy venue, `8d3195ba-92dc-4a4f-9a0f-5f55f6cd22c0`, which now carries both externalIds. `create_venue`'s Place-ID dedup handled it correctly with no intervention — worth knowing, because a naive slug-keyed import would have produced two pins on the map for one pub.

**The long tail was already imported.** Of 18 event rows attempted, 11 bounced as duplicates. The residue at the far end of the horizon is thinner than the raw gig count suggests, because earlier Devon-radius runs already reached into east Cornwall.

## 3. WHAT REMAINS — precisely

**57 event rows**, all at venues whose bndy ids are now resolved, all with artists that now exist. Nothing else. No research, no Facebook work, no venue creation.

The blocker is purely mechanical: those 57 rows' **artist, start time and fee** were held in the browser session that died, and re-reading them needs Chrome against `<venue-slug>?page=gigs`. The `data\state\lemonrock-last-page.txt` snapshot holds each row's gigId, date and venue slug, so the work list itself is not lost — only the per-row detail.

**To resume:** reconnect the Chrome extension, re-read the ~40 venue pages carrying those 57 rows, and write them. On this batch's observed rate roughly a third will bounce as duplicates, so expect ~35–40 real creates.

## 4. CUMULATIVE — lane `lemonrock-expansion-01`, all four batches

| | |
|---|---|
| Venues created | **18** — every one with a real Google Place ID |
| Artists created | **19** — **13 with a verified Facebook page**, 6 with an evidenced blank |
| Artists staged, not created | **2** (Six Kinds Of Wesnesday; plus Bad Knees Blues Band held under its existing ruling) |
| Events created | **84** |
| Duplicate bounces (success) | **36** |
| Names sanitised | **3** (Nawtey Beys · Rising Tide · Rob C Force Band billing) |
| Errors | **3**, all `Invalid genres`, all fail-closed and retried clean |
| Bad geocodes | **0** |
| Stubs created | **0** |

**Cornwall's artist and venue layers are complete.** What is left is 57 event rows and a working browser.
