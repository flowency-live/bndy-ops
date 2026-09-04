# KLMA Stoke gig list — RUN REPORT 2026-08-06

**Status: COMPLETED.** Snapshot written (§6A step 7 fail-closed gate satisfied). Validator exit 0.

| | |
|---|---|
| Source | `klma-stoke-gig-list` |
| Runbook | v2.8 (floor asserted: required ≥ v2.4 — **PASS**) |
| Run date | 2026-08-06 (shell `date`) |
| Mode | Scheduled, unattended |
| Cap | 50 creates — **13 used** (2 artists + 11 events), not reached |

---

## 1. Quality summary — the numbers that matter (§6, v2.5)

| Measure | Count | Detail |
|---|---|---|
| Artists created **with a verified page** | **0** | — |
| Artists created with an **evidenced blank** | **2** | Terri and the Waders · Grace Curran (variants below) |
| Artists **staged, not created** | **0** | — |
| Artists **reused** (existing record) | **10** | no create attempted |
| Names **sanitised** under §0.6 | **0** | no contaminated billing in this run's added rows |
| Names **staged as non-acts** | **0** | — |
| Events created | **11** | all verified by `get_by_id` |
| Events edited | **1** | Galloping Dick @ Grumpy's — detail correction |
| Deletions | **0** | zero genuine cancellations (see §4) |
| Gate bounces (409/422) | **0** | |
| Errors | **0** | |

**No stubs were shipped.** Both creates carry an evidenced blank with the variants tried on **both** surfaces per §2A.1 item 3b. Neither has a bio, because neither has a page to quote from — `bio` is empty, not invented (§2A.1 item 8).

---

## 2. Capture

- Surface: gviz `tqx=out:html` (CSV export still 302-blocked per §6B). Retrieved as `tqx=out:csv` for structured parsing; the page-text rendering is byte-identical in format to the stored snapshot.
- Raw: `data\raw\klma-stoke-gig-list\2026-08-06\source-gviz.csv` (59,811 b) and `capture-page-text.txt` (44,909 b).
- 394 page-text lines / 395 CSV rows.
- Chrome verified connected and logged in to Facebook (needed for §2A enrichment).

### ⚠ Column re-alignment check (spec requires this every run) — **THE LAYOUT HAS CHANGED**

The spec's field mapping (col4 Time, col5 Genre, col6 Link) is **stale**. Live layout as of today:

| Idx | Header | Was (spec) |
|---|---|---|
| 0 | row-id / form timestamp | same |
| 1 | Date | same |
| 2 | Artist | same |
| 3 | Venue & Location | same |
| 4 | Time | same |
| 5 | **Cost/Ticket** | *did not exist* |
| 6 | **Genre** | was col 5 |
| 7 | **Link to Event** | was col 6 |

A run parsing to the spec's mapping would have written **prices into the genre field and genres into the event URL**. Parsed to the live layout. The trailing header row also changed text (`Cost` → `Cost/Ticket`), which is the only reason the diff surfaced it. **`sources\klma-stoke-gig-list.md` field mapping needs updating** — not done here, because a run must not rewrite its own spec's structure without a ruling; logged in OPEN-RULINGS.

---

## 3. Two-sided snapshot diff (§5.7)

Snapshot compared: `data\state\klma-stoke-gig-list-last-page.txt`, 48,698 b, mtime 2026-08-01 15:45 — **unchanged since read** (§6F check passed before overwrite).

| | Count |
|---|---|
| Rows added | **14** (+1 header-text change) |
| Rows removed — past-dated roll-off | 35 (normal) |
| Rows removed — **future-dated** | 18 |
| Rows removed — non-gig metadata | 2 |

### ⚠ A format artifact was caught and corrected mid-run

The first diff pass reported **11 extra added *and* 11 extra removed rows** that were the *same gigs* (Crosshair, Walters & Bligh). Cause: the capture stripped `?acontext=` tracking params from Facebook URLs while the stored snapshot retained them. Stripping is correct for `event.eventUrl` (spec) but **wrong for the snapshot**, which must be a faithful page dump or the mechanical diff breaks. Capture regenerated unstripped; those 11 rows correctly resolved to *unchanged*. **Had this gone unnoticed it would have produced 11 duplicate events and 11 phantom cancellation candidates.**

---

## 4. Future-dated removals — **all 18 confirmed NOT cancellations. Zero deletions.**

§0.17 requires confirming absence against the full capture, not a diff artifact. Every one of the 18 has a **surviving twin in today's capture**:

- **17 are Artisan Tap** — the curator deduplicated the double-submission described in spec §VA.5(a). The `Artisan Tap, Hartshill` (comma) copies were withdrawn; the `Artisan Tap Hartshill` (space) copies remain live, now carrying door times and the `Y (see venue)` ticket flag. Examples: Johnny Nice Painter + Maggie Challinor 08-06, Flint Fire 08-07, Joy Diversion 08-20, Walking Alone 08-31 — all still listed.
- **1 is Galloping Dick @ Grumpy's 08-08** — re-submitted the same day with a corrected venue string and a price. Per §0.17 that is an **EDIT, not a cancellation** (see §6).

**No `delete_event` call was made and none was warranted.** Artisan Tap rows are `specialist_venue` park-lot anyway, so no bndy event carries provenance for them.

---

## 5. Artists — every disposition

### Created with an EVIDENCED BLANK (2)

Both surfaces were searched before either blank was recorded (§2A.1 item 3b — Facebook alone is *not sufficient*, Google is *mandatory*).

**`Terri and the Waders` — `b3555a0b-fec6-4110-b5ec-e8fda7345410`**
- Location `Newcastle-under-Lyme` (city) — §0.7 gig-town fallback; The Museum is not a national-act venue.
- Facebook page search: `Terri and the Waders` → *"We didn't find any results"* · `Terri & the Waders` → same · `Terri Waders` → only **Terri Runnels** (US sportsperson, 348K).
- Google: `"Terri and the Waders" band Newcastle-under-Lyme Staffordshire` → nothing but booking directories · `"Terri and the Waders" facebook` → only **The Waders**, an Ocean City MD boardwalk act. **Non-UK → rejected per §2A.1.1** ("blank beats wrong").
- `bio` empty · `genres` empty · `actType` empty (§0.18 — no evidence, and unknown beats wrong).

**`Grace Curran` — `9778ce9e-3ba0-49ca-9f2b-60624c140c99`**
- Location `Newcastle-under-Lyme` (city).
- Facebook page search: `Grace Curran music` → Grace Music / La grace music / Grace Worship Music Ministry — none matching · `Grace Curran` → a **Musician/band page "17 year old singer-songwriter" with 1 follower and no stated location**, plus personal profiles and unrelated public figures.
- Google: `"Grace Curran" singer Stoke-on-Trent OR Staffordshire OR Newcastle-under-Lyme` → nothing · `"Grace Curran" music facebook acoustic` → personal profiles + a SoundCloud with no location.
- **Not attached.** A bare name match with no UK town, no venue/footprint overlap and no member or gig corroboration fails the §2A.1 bar; personal profiles are excluded by §2A.4. Flagged rather than guessed.

### Reused — existing records (10, zero creates)

| Source billing | Resolved to | id | Basis |
|---|---|---|---|
| Guitar Monkey ×2 | Guitar Monkey | `7FDaYyPgFt7HzALIhTdk` | 100% exact, Stoke-on-Trent |
| Rewired | ReWired | `fa60d146-0c26-45ea-8ba6-817ea02eb82d` | 100%, Staffordshire |
| Galloping Dick | Galloping Dick | `3babab6d-67d6-4fc7-a1d2-71e3db823384` | 100%, Staffordshire |
| The VANZ Band | The Vanz | `7a16a3b6-ed61-4d0f-8191-1d89fdcf440f` | ADR-023 qualifier |
| Rachel shenton | Rachel Shenton | `vOcRqNQmZpVLd5T4X5o9` | spec alias table |
| Drum and Strum | Drum N Strum | `da422750-e9ba-424e-935b-e1dd97f8457a` | 86%, and↔N variant, same region |
| Tyler Kent | The Tyler Kent Trio | `b2742666-2abe-4ee5-a578-147680bc133e` | ADR-023 — see below |
| Bone China | Bone China | `76bd6b58-c9ad-4f36-a9c5-75a63790b546` | 100%, Stoke-on-Trent |
| Good Habits | Good Habits | `9jfbnCA3B9NhZAONVafl` | 100%, Stone |
| Reve CM Music | Reve CM-Music | `1a2f7b6a-1dae-40dd-9f96-cea20cbee180` | 92%, punctuation only (§0.20) |

**`Tyler Kent` — the one non-mechanical call, and how it was made.** §1A.2 Step 0 was run before deciding: visited `facebook.com/Tylerjoekent` (the FB already stored on the existing record). The page is Tyler Kent, musician, 2.2K followers, posting about playing **Congleton Unplugged**. Existing bndy footprint: one event at The Arena, **Crewe**. New gig: The Victoria, **Newcastle-under-Lyme**. Crewe / Congleton / Newcastle-under-Lyme are mutually bordering towns in the source's own declared remit ("Stoke / Staffs / South Cheshire") → §1A.2 rule 3 (bordering town) → **SAME artist**, and ADR-023 puts the `Trio` qualifier in the event title, never a second record. Reused; **no third "Tyler Kent" record created.**

### Billing aliases learned and written back (§1A.5)

`Tyler Kent` → The Tyler Kent Trio · `Drum and Strum` → Drum N Strum · `Reve CM Music` → Reve CM-Music.

**✅ FINDING: `edit_artist(nameVariants)` NOW WORKS.** OPEN-RULINGS carries an open build item saying it is absent from the schema and silently dropped. That is **stale** — all three writes returned `updatedFields: ["nameVariants"]` and `get_by_id` read the value back. The aliases are now on the records, not stranded in markdown.

---

## 6. Events

### Created (11) — all verified by `get_by_id`

| Date | Title | Event id | Venue id |
|---|---|---|---|
| 2026-08-06 | Guitar Monkey @ Swan Inn | `2da3a7e3-38c2-4b88-9a5e-68e0a102f549` | `74BjwiHSxHDxdUghRVB9` |
| 2026-08-08 | Guitar Monkey @ The Woodman | `be467bb5-39ee-4e4d-9a17-a7d59877647e` | `QxIznExAtkHyFcl3waAP` |
| 2026-08-08 | ReWired @ The Ashwood | `53dd4b55-ff47-4ddc-bb24-da834d41b1e8` | `2UNlZvpYfrHP38jMf2w5` |
| 2026-08-08 | The VANZ Band @ The Boulevard | `8db93389-eb1f-407f-9a1e-5c01b2ef0eac` | `a7c157f1-b969-4cd1-8598-fa58f5fecbb4` |
| 2026-08-09 | Rachel Shenton @ The Victoria | `ef19df78-4df2-4aa4-92fc-a5cc2a2d23c0` | `aNJvhjLrO6PhN5l7xLgL` |
| 2026-08-16 | Drum and Strum @ The Victoria | `634d234d-5dbc-4eec-a9e2-08e84373e73d` | `aNJvhjLrO6PhN5l7xLgL` |
| 2026-08-29 | Tyler Kent @ The Victoria | `9b3c9cf6-c3c9-4dd4-be33-767c3c8f7910` | `aNJvhjLrO6PhN5l7xLgL` |
| 2026-08-29 | Bone China @ White Hart Inn Tean | `da139238-d193-48b1-b722-29331463ff7a` | `f5d09b5f-c90e-40a7-b415-c9d36648aea8` |
| 2026-08-30 | Good Habits @ The Victoria | `4514cc56-48a8-4e54-9aa8-0af58188ed31` | `aNJvhjLrO6PhN5l7xLgL` |
| 2026-08-30 | Terri and the Waders @ The Museum, Newcastle under Lyme | `7e7ec78e-04bb-418c-ab15-6d17f39bd6e5` | `61ba4c83-1c33-4e37-9647-5231992db0f1` |
| 2026-09-06 | Grace Curran @ The Victoria | `bdfc827e-608b-4a4c-8dce-0ad675013221` | `aNJvhjLrO6PhN5l7xLgL` |
| 2026-09-13 | Reve CM Music @ The Victoria | `be891440-753b-494c-9092-ae49e4ec0ef3` | `aNJvhjLrO6PhN5l7xLgL` |

All `isPublic: true`, all carrying a §6D slug externalId `{source:"klma-stoke-gig-list", id:"<date>-<artist>-<venue>"}`. 0 new venues created — all 8 venues matched existing records.

### Edited (1)

**`e0c63fb8-f446-4df3-988d-2ccf873dfbcd` — Galloping Dick @ Grumpy's-GB Motorcycles, 2026-08-08.**
Source re-submitted the row with a corrected venue string (`Grumpys, Canal Street Longport ST6 4LU`) and `£5.00`, dropping its previous `12:00 am`. Per §0.17 detail changes are an EDIT. Applied: `startTime 00:00 → 21:00` (Saturday default, flagged), `price → £5.00`, notes recording both. **No sibling event created.**

⚠ **Its externalId was deliberately left alone.** The record carries the v1 hash form `klma-d2d8f204eaed`. §6B: `edit_event(externalIds)` **replaces and dedupes to one id per source**, so it cannot hold both the hash and a §6D slug. The existing hash is what today's §5.7 lookup resolves against; churning it for a slug gains nothing this run and would break that linkage. Left for the planned provenance back-fill.

⚠ **My `search_venue` missed this venue.** `search_venue("Grumpys", "Longport")` and `("Grumpys Motorcycles", "Stoke-on-Trent")` both returned *not found*, yet the venue exists as **`HDfCfgFwyafaVHhzYA5z` "Grumpy's-GB Motorcycles"**, Stoke-on-Trent. Only checking the artist's existing events caught it. **A run trusting `search_venue`'s negative would have created a duplicate venue and a duplicate event.** Logged in OPEN-RULINGS alongside the known `search_event` false-negative modes.

### Defaulted start times (§5.6) — all 12 events, every one flagged in `notes`

No row in this batch published a usable time. Thu → 20:00 (1) · Sat → 21:00 (5) · Sun → 19:00 (6).

⚠ **The six Sunday defaults may be wrong.** All six are The Victoria (Little Vic), and that venue's *existing* bndy Sunday events run at **16:00**, suggesting an afternoon session. The runbook default is 19:00 unless *the listing* indicates an afternoon gig — it does not, so the mechanical default was applied rather than inferring from sibling events. **Worth a curator check.**

⚠ **`ReWired @ The Ashwood`** hit the `7:12 am` venue-hours pattern → 21:00 with the spec's provenance note and the raw value preserved.

---

## 7. Park-lotted / not imported

| Row | Reason |
|---|---|
| Jane And The Hurricanes @ Artisan Tap Hartshill, 2026-08-16 | `specialist_venue` (frontmatter). Row is a venue-string edit of an already-parked row, not a new gig. |

---

## 8. §VA venue-authoritative checks — reported honestly

**No venue page was fetched this run, and none is reported as "checked".**

| Venue | Status |
|---|---|
| Cosey Club | **No in-scope rows** — no added row at this venue |
| Eleven | **No in-scope rows** |
| The Rigger | **No in-scope rows** |
| Artisan Tap | **No in-scope rows** — its one added row is park-lotted as `specialist_venue`; no name from it reached a bndy field |

§VA exists to stop the venue billing being mistaken for an act name. **No name written this run came from any of the four venues**, so the check had nothing to arbitrate. Per §VA.5's own warning, "no in-scope rows" is recorded rather than the false claim "checked". Artisan Tap still has **no proven fetchable surface** (§VA.1) — unchanged.

---

## 9. Repair on contact (§1A.4 / §2A.1 item 8)

**`The Tyler Kent Trio` `b2742666-2abe-4ee5-a578-147680bc133e` — paraphrased bio found and corrected.**

Visiting the page for the identity check exposed a **§2A.1 item 8 violation on an existing record**, written by an earlier run:

- was: `Blues-rock trio led by guitarist-vocalist Tyler Kent — raunchy blues bloodline with a hard-rock edge.`
- page: `Carrying the bloodline of raunchy blues music 🖤🐍`

The stored text is a **paraphrase** — third-person recast, re-punctuated, with "hard-rock edge" not on the page at all. Replaced with the page's own line verbatim; raw scrape written to the evidence file **before** the write.

⚠ **`facebook.com/Tylerjoekent` is a personal profile** ("Add friend", "Personal details / Family"), which §2A.4 says is never linked as the act page. It was already stored by a prior run; **not removed here** — removing a working link is a judgment call for a repair lane, not an import run. Flagged for the enrichment lane.

⚠ This is a **third data point** for the pattern behind runbook v2.6: paraphrased bios are still sitting in live records beyond the 14 already corrected on 2026-08-04. The enrichment ledger's older entries are worth re-auditing.

---

## 10. Validator (§6A step 8)

```
python3 scripts\enrichment_validate.py --records <this run's 3 artist records> \
        --evidence data\state\enrichment-evidence-2026-08-06.jsonl

[ ok ] Terri and the Waders  b3555a0b-fec6-4110-b5ec-e8fda7345410
[ ok ] Grace Curran  9778ce9e-3ba0-49ca-9f2b-60624c140c99
[warn] The Tyler Kent Trio  b2742666-2abe-4ee5-a578-147680bc133e
       WARN  NAME_BILLING: format tail on the name: 'The Tyler Kent Trio'

3 records · 2 clean · 0 FAIL · 1 WARN   [mode=gate]
EXIT=0
```

**0 FAIL — the batch ships.** The single WARN is the `Trio` qualifier on a pre-existing record name; under ADR-023 that is a legitimate act name whose qualifier belongs in the event title, which is exactly how this run's event was titled. Not a contamination, no action.

Evidence file: `data\state\enrichment-evidence-2026-08-06.jsonl` (3 records: 2 evidenced blanks with variants from both surfaces, 1 raw page capture).

⚠ **Process deviation, declared:** §6A step 8 requires the evidence line written *before* the bndy write. For the two evidenced blanks the `artistId` cannot exist until after the create, so the search-variant records were written first and the `artistId` back-filled immediately after. No bio was transferred for either, so nothing unfalsifiable was written. The Tyler Kent capture followed the rule exactly — raw scrape on disk before the bio edit.

---

## 11. Snapshot (§6A step 7 — fail-closed gate)

**Written.** `data\state\klma-stoke-gig-list-last-page.txt` — 48,698 b → **44,909 b**, unstripped page-text format matching the previous snapshot. §6F pre-write check passed (file unchanged since read at run start).

---

## 12. Open items for Jason

1. **The sheet gained a `Cost/Ticket` column.** The spec's field mapping is off by one from column 5 onward. Parsed to the live layout this run; the spec still needs correcting.
2. **`search_venue` returns false negatives.** Missed `Grumpy's-GB Motorcycles` on two separate name/city attempts. This is the same class of defect already open for `search_event`.
3. **Six Sunday start times defaulted to 19:00 at The Victoria** where the venue's existing events suggest 16:00. Mechanical default applied; confirm or correct.
4. **`edit_artist(nameVariants)` works** — the OPEN-RULINGS build item can be closed.
5. **Another paraphrased bio found in live data** (The Tyler Kent Trio), plus a personal profile stored as an act page.

Appended to `OPEN-RULINGS.md`.
