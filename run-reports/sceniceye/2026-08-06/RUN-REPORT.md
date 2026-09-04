# ScenicEye — RUN REPORT 2026-08-06

**Status: COMPLETED.** Snapshot written (§6A step 7 fail-closed gate satisfied).
Runbook read in full: `RUNBOOK.md` **v2.8** ≥ required floor v2.4 → assertion PASSED.
Spec read in full: `sources\sceniceye.md`. `OPEN-RULINGS.md` standing rulings read and applied.

| | |
|---|---|
| Run type | Scheduled, unattended |
| Today | 2026-08-06 (Thursday), 23:27 BST at capture |
| Source | https://scenicmind.co.uk/sceniceye |
| Capture method | Chrome MCP `javascript_tool`, post-hydration DOM read of `table.notion-table` rows (NOT `get_page_text` — §0.22) |
| Raw capture | `data\raw\sceniceye\2026-08-06\capture.txt` |
| Horizon | today → +14 days (§6E, source-specific) |
| Cap | 50 creates. **Used 21.** Not hit. |

---

## 1. STALE-WEEK CHECK — PASSED (source rolled)

Banner reads **"6 August – 12 August 2026"**; day-tables present for Thursday 6 Aug through Wednesday 12 Aug. Today is Thursday 6 Aug, so the guide **has** rolled to the current Thu–Sun edition. This is not a held run.

Prior snapshot was the 30 Jul – 5 Aug edition, so the roll is genuine and not a re-read of the same week.

Hydration sanity: 7 day-tables and correct current-week headers returned, i.e. the Super.so SSR cache (documented stale-by-weeks) was replaced by live Notion data before extraction. `document.hidden === true` as always for MCP-group tabs — per §6B this affects infinite-scroll lists only, and this page is not one; content was fully present.

## 2. SNAPSHOT DIFF (§5.7, two-sided)

Snapshot `data\state\sceniceye-last-page.txt` **present** (2026-07-31, week 30 Jul – 5 Aug). Not a missing-snapshot held run.

- **Added rows:** 29 gig rows, all in the new 6–12 Aug edition.
- **Removed future-dated rows / cancellation candidates: ZERO.** All 10 rows in the prior snapshot were dated 31 Jul – 2 Aug and are now past. §5.7: *"A row disappearing because its date passed is NOT a cancellation."* No §0.17 deletion was considered and none was performed.

## 3. ROW DISPOSITION — 29 rows captured

| Disposition | Rows |
|---|---|
| Imported (event created) | 13 |
| Matched existing event, topped up | 1 |
| Skipped — past-dated (§0.14) | 2 |
| Skipped — festival (Jason ruling 2026-07-31) | 13 |
| **Total** | **29** |

### 3a. Skipped — past-dated (§0.14), 2 rows

Run fired at 23:27 BST; both Thursday 6 Aug gigs had already finished.

- `George Michael - Tribute | Number 73 Bar & Kitchen | 19:30` — **also a §0.5 non-name**, see §6.
- `West Brook | The Crown Inn, Emsworth | 20:30`

### 3b. Skipped — festivals, 13 rows

Per the run prompt and OPEN-RULINGS Resolved (*"Hi Fest ignore-festivals extended to sceniceye"*).

**Staunton Festival — 8 rows.** Two independent grounds:
1. Festival ruling.
2. **§0.23 non-fixed-building venue.** "Staunton Country Park, Petersfield Road, Havant, PO9" is a country park, partial postcode, no correct Google Place ID can exist. Venue NOT created, gigs NOT imported.

Rows: Hybrid Kid · Shotgun Smile · OB3 · Vestas (Sat 8 Aug); Pfizer Chiefs · Patch Collins · Mother Shipton (Sun 9 Aug); Davey Jones Locker (Sun 9 Aug, venue field literally *"Venue missing from calendar"* — would have been parked `tbc_venue` regardless).

**"Music Festival" at The Centurion — 5 rows.** MD Duo (Fri) · Dirty Blonde · Astromoda · Mark Harris · Skadacious (Sat). Billed `<Act> - Music Festival`. Skipped under the same ruling — **but flagged to Jason as an edge case** (see §7): unlike Staunton these are named acts at a fixed, already-known pub, and §4 would model them cleanly as per-artist discrete events. A ruling would recover ~5 gigs a weekend at this venue.

Note: **Patch Collins was skipped in his Staunton row and imported in his ordinary Heroes row** — same act, different rows, correctly handled per-row.

## 4. ARTISTS — 8 created, 5 matched. QUALITY BREAKDOWN

### 4a. Created WITH a verified Facebook page — 4

Bio in every case is a **character-for-character quotation** of the act's own page (§2A.1 item 8); raw scrape held in `data\state\enrichment-evidence-2026-08-06.jsonl`.

| Artist | id | Page | Evidence meeting the §2A.1 bar |
|---|---|---|---|
| Cheesy Moments | `21edf8c8-b06d-4fb1-be3f-4d340f3943b3` | facebook.com/cheesymoments69 | Musician/band, 388 followers, active (post 2 weeks old); bio names six members; Portsmouth Music Scene listing corroborates footprint |
| Chloe Anne | `4f5288d8-d8c2-44df-8248-83bb2f2b7be8` | facebook.com/ChloeAnneMusic | Musician/band, 914 followers, active 3 weeks; page states *"performing in Portsmouth and the surrounding area"*; Google surfaced a Hayling Island gig promo — the gig town being imported |
| The Restless | `83b31e4a-0e30-4c4a-a1af-749bfd7a7112` | facebook.com/TheRestlessPortsmouth | Musician/band, 1.5K followers; handle carries the town; 12 reviews |
| Mama Belle | `db714e97-8fd2-4f02-8a98-d5c6bf79a2dc` | facebook.com/MamaBelle.Band | Musician/band, 1.5K followers; **page post reads "This Saturday at 21:00 / Back at The Heroes / Waterlooville" — the exact gig being imported**, and it independently confirms the 21:00 start |

Avatars: `graph.facebook.com/<numeric-id>/picture?type=large` only. No `scontent.*` URLs (§0.13).

Location provenance: Chloe Anne → **Portsmouth** (page-stated, `city`). The Restless → **Portsmouth** (page handle, `city`). Cheesy Moments, Mama Belle → page states none → spec default **"Hampshire UK"** + `locationType: regional` (§6B Kilmarnock pairing observed).

`genres` set on The Restless only (`Rock`, `Indie`, `Punk` — quoted from its own page; genres is the one field a run may infer). `actType: ["covers"]` on The Restless only ("Event band playing the best of..."); left **EMPTY** on the other three — §0.18 outranks the covers default, unknown beats wrong.

### 4b. Created with an EVIDENCED BLANK — 4

Both surfaces tried in every case per §2A.1 item 3b (Facebook page search **and** Google). Full variant lists are in the evidence JSONL; summary:

| Artist | id | Variants tried | Why blank |
|---|---|---|---|
| The Beatniks | `bddd1626-50b3-43e1-a476-13f1bb6bbc91` | FB: "The Beatniks Hampshire", "Beatniks band Portsmouth". Google: `"The Beatniks" band Emsworth OR Havant OR Hampshire`, `"Beatniks" facebook band Havant OR Emsworth OR Waterlooville gig` | Two same-name pages found and **rejected**: `/TheBeatniksUK` is an **Essex** band (gigs at The Garrison, Shoeburyness); `/beatniksmusic` is an **Australian** record shop (Burleigh Heads, Gold Coast). Only Emsworth Sports & Social Club's own page posts about the act. §2A.1.1 — blank beats wrong |
| Sophie Jenkinson | `a0bb6738-2621-491e-bc27-de8b025807d9` | FB: "Sophie Jenkinson music". Google: `"Sophie Jenkinson" singer Hampshire OR Portsmouth OR Emsworth facebook`, `"Sophie Jenkinson" Hampshire band live music` | No act page on either surface; FB returned only unrelated Sophies |
| T Junction | `8ac5ddd7-09aa-47cf-9530-974353185473` | FB: "T Junction band Hampshire". Google: `"T Junction" band Havant OR Hampshire OR Portsmouth facebook live music`, `"T Junction" OR "T-Junction" Havant "Golden Lion"` | `/t.junction.music.duo` found and **rejected — non-UK**: its gig posts are Para Hills Community Club, **Adelaide**. Curator's own page `scenicmind.co.uk/sandbox/bands/t-junction` confirms Category: Band and venues (Golden Lion Havant, Cowplain Social Club) but carries no act page or bio |
| Patch Collins | `4cb1695f-1ea5-4ee5-ad19-3d079a9313c3` | FB: "Patch Collins". Google: `"Patch Collins" music Hampshire OR Portsmouth OR Havant facebook`, `"Patch Collins" singer OR musician OR acoustic gig` | No act **page**. A Facebook **group** titled "Patch Collins Solo Singer" exists — a group is not an act page and yields no graph avatar, so not attached. Venue-hosted FB event at The Eastfield Public House corroborates he is a real local solo act |

All four carry a resolvable location (`Hampshire UK` + `regional`, spec default) — §0.7 satisfied, none staged.

### 4c. Matched existing — 5, no duplicates created

| Source billing | bndy artist | id | Basis |
|---|---|---|---|
| Freddy Saxo | **Freddie Saxo** | `0f8f5537-42bd-4950-be60-273fa777f93f` | 83% + already in Hampshire → spec's explicit *"reuse even at 70–89% in Hampshire/Portsmouth"* rule. Spelling variant, **not** a new record |
| Matt O'Neil | Matt O'Neil | `b8f27dba-ba54-4d34-8959-3a89c8a7bdfd` | 100% |
| TJ Quinn | TJ Quinn | `192db870-422a-458f-97fc-d82f288965d8` | 100% (2 gigs this week) |
| Forever Queen | Forever Queen | `02c77116-5a68-4d2f-bea3-9bf94f87c2ba` | 100%, Hampshire, existing FB page |
| Baxtrax | Baxtrax | `1896acb0-b4be-434f-b002-08d366c0b68e` | 100% |

**Near-miss rejected as distinct:** `T Junction` vs *Twin Junction* (77%, Greater Manchester) — different name, different region, §1A.7 → not a collision.

### 4d. Names SANITISED or held as non-acts (§0.6)

| Raw source billing | Action |
|---|---|
| `Forever Queen - 🎫 Ticket` | Ticket marker stripped from the name; artist is **Forever Queen**; `ticketed: true` carried on the event instead |
| `MD Duo - Music Festival`, `Dirty Blonde - Music Festival`, `Astromoda - Music Festival`, `Mark Harris - Music Festival`, `Skadacious - Music Festival` | `- Music Festival` identified as **event billing, not act name**. Rows skipped as festival, so no artist created either way — but recorded here so no future run mistakes the tail for identity |
| `Hybrid Kid - Staunton Festival` and 7 more | Same: `- Staunton Festival` is the event, not the act |
| `George Michael - Tribute` | **Not an act name — §0.5.** The real tribute act is not stated. Would have been STAGED, not created, had the row not also been past-dated. Logged to OPEN-RULINGS |

**Zero artist records in this run carry a billing tail, a festival name, a venue name or a ticket marker.**

## 5. VENUES — 0 created, 10 matched

All ten resolved to **existing** bndy records on `google_place_id`, 100% confidence. No venue was created, so no geocode risk was taken.

| Venue | id |
|---|---|
| The Crown Inn Emsworth | `557be6b0-33f9-4945-8adb-fe1cd7dff78b` |
| The Heroes, Waterlooville | `eb51991a-b082-433c-90e4-123340283271` |
| Stansted Park Garden Centre | `3218ee02-6145-4aac-9be8-c113acfefdb1` |
| The Lord Raglan | `bedb0ed3-e93c-4ddf-9fe3-7d0a044f9316` |
| Emsworth Sports & Social Club | `b9cf260b-63da-46c2-ad84-51d88ead74ee` |
| The Lifeboat Inn | `096afdf6-573f-4c65-8551-6e25fd119092` |
| The Stags Head | `c90f3d40-f90d-4e61-b498-dbd40db12ff9` |
| Cowplain Social Club | `2f01ebc9-abce-4ff6-8b39-0bde440d45ff` |
| The Old House at Home, Havant | `349ca19c-fb7f-45e6-b9a1-bebdb16a0634` |
| The Hampshire Rose | `cfd6ec30-e647-4a5b-8ca4-4dd5188a7798` |
| The Golden Lion (Havant) | `d3200659-f23b-4a19-a2c3-63e036b75c56` |

**§0.24 postcode check:** every venue resolved to PO7 / PO8 / PO9 / PO10 / PO11 — all Portsmouth postal area, Hampshire. No out-of-county matches. The Golden Lion (a §3.4 named repeat-name risk) confirmed as Bedhampton, Havant PO9 3EY by place_id.

## 6. EVENTS — 13 created, 1 matched-and-topped-up

All `isPublic: true`. All times **explicit in the source** — **§5.6 defaults were NOT used anywhere this run**. Start-only per the spec's `time_capture: start_only`. externalIds follow the live convention verified against event `fd04603f` before writing: `{source:"sceniceye", id:"<YYYY-MM-DD>-<artist-slug>-<venue-slug>"}`.

### Friday 7 August 2026
| Event | id | Time |
|---|---|---|
| Freddie Saxo @ Stansted Park Garden Centre | `3a807ddc-85cc-4781-b5f2-e2421bb3dcbd` | 14:30 |
| Matt O'Neil @ The Crown Inn Emsworth | `dab98c2c-5f59-4d9e-bc33-faefe705627d` | 20:30 |
| Cheesy Moments @ The Heroes, Waterlooville | `67cd68aa-7e47-47c0-9f01-d69fc3ce24d8` | 20:30 |
| TJ Quinn @ The Lord Raglan | `e5ca59b3-a946-4659-90d4-c2e0e1151295` | 20:30 |
| The Beatniks @ Emsworth Sports & Social Club | `3a270ca8-6007-45df-9583-d7fced679b3d` | 20:30 |
| Chloe Anne @ The Lifeboat Inn | `bab38c46-1dc8-4628-bddd-e02bd510a08e` | 21:00 |

### Saturday 8 August 2026
| Event | id | Time |
|---|---|---|
| Sophie Jenkinson @ The Stags Head | `22358a37-887f-4c41-bf91-055166612b62` | 20:00 |
| The Restless @ The Old House at Home, Havant | `28c849c5-9edf-4904-9a51-283d8457bb56` | 21:00 |
| Mama Belle @ The Heroes, Waterlooville | `a46d58d8-3fe0-447f-886f-2e537124fe4d` | 21:00 |

### Sunday 9 August 2026
| Event | id | Time |
|---|---|---|
| Baxtrax @ The Hampshire Rose | `01115881-a914-4818-a8ab-b33116d70ea8` | 14:00 |
| T Junction @ The Golden Lion | `7de5eecb-bf10-4d2d-af8d-a09f718e7f07` | 15:00 |
| TJ Quinn @ The Crown Inn Emsworth | `953e2d68-2432-4430-98cb-42578d6238cf` | 15:00 |
| Patch Collins @ The Heroes, Waterlooville | `acb62621-7a87-43d6-adb9-c17670f48acb` | 16:30 |

### Gate bounce — 1, verbatim

```
{ "success": false,
  "error": "DUPLICATE_EVENT",
  "message": "Event already exists: This artist already has an event at this venue on 2026-08-08.
              Artists can only have one gig per venue per day.",
  "existingEventId": "d62b8b2f-c43b-478e-8c59-086c035bebd2",
  "existingEventTitle": "Forever Queen @ Cowplain Social Club",
  "matchedExternalId": null }
```

Treated as a **match signal** (§0.9 / §5.3). No variant created, no name altered. The existing event was created 2026-07-02 by `cowork-discovery` and is **richer** than the source row — it carries a description, `ticketed: true`, ticket information and the venue's own `eventUrl`. Action taken: added this source's provenance id alongside the existing one via a single `edit_event` with the complete intended array (§6B — the call REPLACES). Read back: **both ids present and correct**, nothing else altered.

⚠ **Time discrepancy, deliberately NOT overwritten.** Source says 20:45; the existing record says `startTime 19:00` with description *"Doors 19:00"* sourced from the venue's own page. Per §5.6b the venue's own page outranks the source listing, so 19:00 stands. Raised in §7 for confirmation.

## 7. STAGED / OPEN ITEMS → `OPEN-RULINGS.md`

1. **`"<Act> - Music Festival"` at The Centurion** — is the festival skip meant to cover a single ordinary pub's own badged music-festival weekend? 5 named acts lost this week.
2. **`George Michael - Tribute`** — §0.5 unnamed tribute act; past-dated this week but this billing pattern will recur.
3. **Forever Queen 8 Aug time conflict** — 19:00 (venue page, kept) vs 20:45 (source).
4. **`Chloe Anne` was reported created by the 2026-06-05 run but does not exist in bndy** under that or any near name (searched at minConfidence 25, plus "Chloe", plus "Chloe Anne Music"). Created fresh this run. Either that report was wrong or the record was later removed — worth knowing which, since the same run reports 8 other creates.

## 8. VALIDATOR (§6A step 8)

Evidence JSONL written **before** the bndy writes: `data\state\enrichment-evidence-2026-08-06.jsonl` (8 lines — 4 with `capturedText`, 4 with `searchVariants`). Artist ids were patched in after create, as ids do not exist until then; the `capturedText` itself was fixed before any write, which is the guarantee the rule protects.

```
python3 scripts/enrichment_validate.py \
  --records data/normalized/sceniceye/2026-08-06/records.json \
  --evidence data/state/enrichment-evidence-2026-08-06.jsonl --mode gate

8 records · 8 clean · 0 FAIL · 0 WARN   [mode=gate]        EXIT=0
```

**Judgment-class sample (§6A step 8, 3 records checked against source by eye):** Mama Belle (page post names the exact venue/date/time being imported ✓), T Junction (rejected page's own posts are Adelaide-based ✓), Cheesy Moments (bio re-read against the live page including both apostrophe forms and the line break ✓).

## 9. WRITE VERIFICATION (§0.10)

`get_by_id` read-back on all 8 new artists and on 4 events (`3a807ddc`, `3a270ca8`, `a46d58d8`, plus the edited `d62b8b2f`). All correct: `isPublic: true`, externalIds present, raw `&` stored unescaped in "The Beatniks @ Emsworth Sports & Social Club", no HTML entities anywhere.

**Near-miss caught and reported rather than buried:** the `create_venue` call for Emsworth Sports & Social Club was sent with an HTML-escaped `&amp;` in the name (§6B violation). It resolved to an **existing** venue by place_id (`isNew: false`), so **no bad value was written** — the returned record carries the correct raw `&`. Flagged here because the guard that saved it was luck, not process.

## 9b. SPEC UPDATES MADE (own ownership lane only, §6F)

`sources\sceniceye.md` — this source's run owns this file; no other source's spec or snapshot was touched.

- Alias table gains **Freddy Saxo → Freddie Saxo**. Also written onto the record itself as `nameVariants: ["Freddy Saxo"]` and read back — `edit_artist(nameVariants)` **works** (the KLMA run proved the same thing this morning; the OPEN-RULINGS build item calling it broken is stale). §1A.5 satisfied: this billing will never be asked again.
- New **"Known non-act billings"** table so no future run mistakes `- Staunton Festival`, `- Music Festival`, `- 🎫 Ticket` or `George Michael - Tribute` for an act name.
- Frontmatter `last_run` / `last_status` updated; run-history row added.
- **Void path corrected:** the spec said the snapshot lives at `Projects/bndy/sceniceye-last-page.txt`. §6A declares that ARCHIVE and VOID, and that split state directory is the documented root cause of July's phantom diffs. Now points at `data\state\sceniceye-last-page.txt`.

## 9c. CONCURRENCY (§6F)

Two other scheduled runs (**klma** and **insangel**) wrote this vault during this run — `OPEN-RULINGS.md` and `20-Daily\2026-08-06.md` both changed after I first read them. Detected by mtime before writing, both files re-read, and **both written by strict shell append only** — no read-modify-write, so no possibility of clobbering their entries. My rulings are appended in a clearly-labelled block at the end rather than inserted into the "Open — awaiting Jason" section, and want re-filing upward when someone is editing the file exclusively.

## 9d. NOT DONE — deliberate, for the enrichment lane

Four **matched** artists are missing enrichment and qualify for a §2A.2 top-up: **Freddie Saxo** `0f8f5537-42bd-4950-be60-273fa777f93f`, **Matt O'Neil** `b8f27dba-ba54-4d34-8959-3a89c8a7bdfd`, **TJ Quinn** `192db870-422a-458f-97fc-d82f288965d8`, **Baxtrax** `1896acb0-b4be-434f-b002-08d366c0b68e` — all four have no facebookUrl, no bio and no image. Not attempted here: each needs a full both-surfaces pass at the §2A.1 bar, and the enrichment ledger belongs to the enrichment run (§6F ownership lanes). Note **Matt O'Neil is already on record in OPEN-RULINGS as a §2A.1.1 evidenced blank**, so only three are genuinely unexplored.

## 10. COUNTS

| Metric | Count |
|---|---|
| Rows captured | 29 |
| Artists created — verified page | **4** |
| Artists created — evidenced blank | **4** |
| Artists matched existing | 5 |
| Artists STAGED | 0 |
| Venues created | 0 |
| Venues matched | 10 |
| Events created | 13 |
| Events matched + topped up | 1 |
| Gate bounces (409/422) | 1 (handled as match) |
| Deletions (§0.17) | 0 |
| Defaulted start times (§5.6) | 0 |
| Total creates against the 50 cap | **21** |
| Validator | 0 FAIL · 0 WARN |

Snapshot written to `data\state\sceniceye-last-page.txt` (week 6–12 Aug 2026, same pipe format as prior snapshots).
