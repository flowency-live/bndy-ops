# KLMA Stoke gig list — `Cost/Ticket` BACK-FILL PASS, 2026-08-06 (supervised)

**Status: COMPLETED.** 12 events updated, all verified by `get_by_id`. Spec amended. Snapshot NOT rewritten — see §7.

> ⚠ **This is a SECOND, SEPARATE report for the same date.** The scheduled import run's report is `RUN-REPORT.md` in this folder and is untouched. This pass ran afterwards, supervised, on Jason's instruction, and imported no events.

| | |
|---|---|
| Source | `klma-stoke-gig-list` |
| Runbook | v2.8 (floor asserted: ≥ v2.4 — **PASS**) |
| Mode | **Supervised**, Jason present, rulings taken live |
| Trigger | Curator (Dave) added a `Cost/Ticket` field to the submission form |
| Creates | **0** (cap 50 untouched — this pass creates nothing by design) |
| Edits | **12 events** |

---

## 1. Jason's rulings, taken live this session

1. **Word-value mapping** — `Y (see venue)` → `ticketed:true`; `Free`/`free`/`Free entry` → `ticketed:false` + `price "Free"`; `Check with venue` → **boolean left UNSET**; `£X adv` → `ticketed:true` + price minus the suffix + `ticketInformation "Advance ticket"`.
2. **Scope** — full pass over every future row, applying as I go.
3. **Conflicts** — **the sheet wins, overwrite.**

**One carve-out applied by the run and declared here:** ruling 3 settles *source-vs-source* precedence. It was not read as overriding **§0.16 owner-managed records**, which remain untouchable. **No owner-managed record was encountered**, so the carve-out never bound — it is recorded only so the reading is on the record rather than assumed.

---

## 2. Capture — and a tooling trap that would have corrupted the pass

Live sheet read via **Chrome**, gviz `tqx=out:html`. 396 table rows → **382 future gig rows**.

⚠ **`web_fetch` on the same URL returned an eight-week-stale cache.** 13 columns, no `Cost/Ticket`, first data row 13 June. It is well-formed and carries no staleness signal whatsoever. Chrome, seconds later on the identical URL, returned the live 14-column table. **A pass that trusted `web_fetch` would have parsed to the pre-2026-08-06 layout and mis-mapped every column from index 5 onward** — writing prices into `genres` and genres into `eventUrl`, which is precisely the corruption the morning's OPEN-RULINGS item was raised to prevent, arriving by a different door. Logged for a §6B generalisation.

---

## 3. What the new column actually contains

**30 of 382 future rows carry a value (7.9%).** The other 352 are blank because they were submitted before the field existed — **blank is *unknown*, not *free*, and nothing was written for them.**

| Class | Values | Rows |
|---|---|---|
| Priced | `£20.00` `£15.00` `£12.00` `£10.00` `£5.00` + four `… adv` | 13 |
| Ticketed, price unstated | `Y (see venue)` | 11 |
| Free | `Free` `Free entry` `free` | 5 |
| Unknown | `Check with venue` | 1 |

⚠ **18 of the 30 are unusable — they sit at park-lotted venues.** Artisan Tap (11) and Eleven (7) are `specialist_venues`, so no bndy event exists to receive the value. **The rooms that charge are the rooms this source park-lots**, so expect this ratio to persist. Recorded in the spec so nobody re-derives it.

---

## 4. Events updated (12) — every one verified by `get_by_id`

| Date | Event | id | Written |
|---|---|---|---|
| 08-07 | Light of Eternity @ The Rigger | `069ef658-7c08-42f8-94e5-4f57a878914c` | ticketed:true · £20.00 |
| 08-08 | ReWired @ The Ashwood | `53dd4b55-ff47-4ddc-bb24-da834d41b1e8` | ticketed:false · Free |
| 08-08 | The VANZ Band @ The Boulevard | `8db93389-eb1f-407f-9a1e-5c01b2ef0eac` | ticketed:false · Free |
| 08-08 | Galloping Dick @ Grumpy's-GB Motorcycles | `e0c63fb8-f446-4df3-988d-2ccf873dfbcd` | ticketed:true · £5.00 |
| 08-08 | FoxFest: The VANZ ROXX @ Fox and Goose | `fc353358-3b5b-4411-906d-328d3be6d247` | ticketInformation only — **boolean deliberately unset** |
| 08-14 | Andrea Harvey Solo @ Swan Inn | `d30498a3-dd73-4da8-92f8-9e2b92b36284` | ticketed:false · Free |
| 08-29 | Bone China @ White Hart Inn Tean | `da139238-d193-48b1-b722-29331463ff7a` | ticketed:false · Free |
| 08-30 | Terri and the Waders @ The Museum | `7e7ec78e-04bb-418c-ab15-6d17f39bd6e5` | ticketed:false · Free |
| 09-25 | Inner Terrestrials @ The Rigger | `416e058f-eb43-474a-bae8-3b240345924b` | ticketed:true · £15.00 |
| 09-25 | The Dirt @ The Rigger | `a75a9dc7-eefd-42f7-829c-f0f1fb3713ad` | ticketed:true · £15.00 · shared-bill note |
| 10-10 | Transmission (Sound of Joy Division) @ Riff Factory | `feeb1b0f-5e9f-4cf5-a63e-74f10ffd2f1c` | ticketed:true · £15.00 |
| 11-14 | Love Generation @ Alsager Civic | `350374e8-5145-43d5-8c95-9ccced07190c` | ticketed:true · £12.00 |

**Not written, deliberately (1):** `NU CALL @ The Rigger` `6682b244-8fa2-46dc-9030-fc49d8b0cdf4` already held `ticketed:true`, `price "£10"` and a Gigantic ticket URL. The sheet says `£10.00`. **Same price, different formatting — not a conflict.** Overwriting would spend a write and an `updatedAt` to change punctuation. Ruled cosmetic; rule 5 added to spec §CT so future runs do the same.

**Shared bill (§4):** `Inner Terrestrials, The Dirt` is one 09-25 bill at £15 split across two child events. Both carry the price; the sibling relationship went into `ticketInformation` on The Dirt.

**Genuine conflicts requiring the "sheet wins" ruling: ZERO.** Every target field was either empty or cosmetically identical. The ruling cost nothing this pass — it is banked for the next one.

---

## 5. Verification (§0.10)

All 12 re-read with `get_by_id` after writing — **not** the `edit_event` response, which is not independent. All 12 persisted correctly, including the deliberately-unset boolean on `fc353358` (`ticketInformation` present, `ticketed` absent).

⚠ **§6B corroborated again:** `search_event` reported `externalIds: []` for NU CALL while `get_by_id` showed a real §6D slug. The false-negative is live; do not trust `search_event` on externalIds.

---

## 6. Findings raised to OPEN-RULINGS (nothing acted on)

1. **`web_fetch` stale-cache trap** — recommend a §6B generalisation.
2. **Cosey coverage gap: 27 sheet rows vs 15 bndy events**, including an apparent date disagreement (bndy *Not Guilty* 09-12; sheet *Brassmonkees* 09-12, *Not Guilty* 09-18). **The structural point matters more than the venue:** the daily diff only sees rows ADDED since the last snapshot, so a row that failed to import once is invisible to every later run permanently. One venue sampled, 44% shortfall. Worth its own authorised pass.
3. **Event titles carry promo copy / session names** at Cosey (§5.2 form), including five titled bare `Cozyzone`. **Artist records verified clean** — `Acrylic` is `Acrylic`, and the Cozyzone events resolve to `Losing Light` `e25ad8af…` exactly as §VA.2 trap 3 requires. §0.6 held where it matters; damage confined to a display string.

---

## 7. Snapshot — deliberately NOT rewritten

§6A step 7's fail-closed gate binds a run that wrote to bndy. **The current snapshot `data\state\klma-stoke-gig-list-last-page.txt` was written at 23:33 today by the scheduled import run, from this same sheet, and is current.** This pass imported nothing and consumed no diff, so rewriting it would gain nothing and risks masking rows submitted between the two captures. The gate is satisfied by the existing file; the decision is recorded here rather than left implicit.

⚠ **§6F concurrency observed:** `OPEN-RULINGS.md` changed at 23:54 mid-session — an **insangel** run appending in parallel. My in-memory copy was stale, so all edits here were **targeted single-line edits and appends**, never a rewrite. No other session's lines were touched.

---

## 8. Spec amendments (`sources\klma-stoke-gig-list.md`)

§6F pre-write check: unchanged since 2026-08-01 16:34 — safe.

- Field-mapping table rewritten **zero-indexed** to the live 8-column layout, with the change flagged and the old mapping's failure mode stated.
- **New §CT** — the `Cost/Ticket` vocabulary, its bndy mapping, and six non-negotiable rules (blank ≠ free; `Check with venue` never sets the boolean; `ticketInformation` is public; venue-page precedence; cosmetic differences are not conflicts; shared bills share a price).
- **`web_fetch` stale-cache warning** added under "Source & fetch".
- Snapshot-vs-`eventUrl` URL-stripping distinction recorded on the field-mapping row that causes it.
- `updated:` → 2026-08-06.
