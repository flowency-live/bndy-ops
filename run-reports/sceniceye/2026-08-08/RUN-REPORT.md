# sceniceye — scheduled run 2026-08-08

**Outcome: COMPLETED. No-change run — 2 rows added by the source, both correctly skipped, ZERO writes to bndy.**

| | |
|---|---|
| Run id | `sceniceye-2026-08-08T09-26-15Z` |
| Fired | 2026-08-08T09:26:15Z |
| Today's date (§6A.1) | 2026-08-08 (Saturday) |
| Runbook H1 read | **v2.17** |
| CURRENT FLOOR (§6A, live line) | **v2.17** → **PASS** |
| Floor asserted by task prompt | none stated in the prompt (it defers to §6A step 2a) — no drift to report |
| Source spec | `sources\sceniceye.md`, read in full |
| OPEN-RULINGS standing rulings | read; both binding items are enrichment/report-quality rules, no artist was created this run so neither was engaged |
| Snapshot written | **YES** — `data\state\sceniceye-last-page.txt` (§6A step 7 fail-closed gate satisfied) |

---

## 1. Gates, in order

**Step 0 — heartbeat.** Written FIRST, before any gate: `data\state\heartbeat\sceniceye-2026-08-08T09-26-15Z.json`, `outcome:"started"`, `runbookVersion:"v2.17"`. Rewritten `completed` as the last action of this run.

**Step 2a — version floor.** Runbook H1 `v2.17`; the live CURRENT FLOOR line reads `v2.17`. Equal, so PASS. Asserted from the runbook after reading it, not from the prompt.

**Step 2b — concurrency claim (§6G).**
- `data\state\claims\sceniceye.json` — **MISSING → acquire** (first acquire row of the §6G table). No takeover; no dead holder to step over.
- Acquired record: `heldBy: sceniceye-2026-08-08T09-26-15Z`, `acquiredAt 2026-08-08T09:26:15Z`, `expiresAt 2026-08-08T10:56:15Z` (**TTL 90 min**, the §6G value for this task), `heartbeatFile` quoting the exact filename written at step 0 (not re-derived).
- Released as the last action with `heldBy: null`.
- ⚠ **A stale `data\state\sceniceye.lock` exists on disk** (the retired per-task lock convention, alongside `gigs-news.lock`, `insangel.lock`, `klma-stoke-gig-list.lock`, `onthecasemusic.lock` and two `RETIRED-enrichment.lock-*` files). §6A step 2b directs the check at the CLAIM file, so it was **not consulted, not honoured and not deleted**. Flagged only so the residue is visible.

**Step 3 — tools.** bndy MCP reachable (12 read calls, all successful). Chrome connected; `scenicmind.co.uk/sceniceye` rendered. No web-fetch substitution.

⚠ **Chrome visibility note.** The MCP tab reported `document.hidden: true` (`innerHeight` 911, `visibilityState "hidden"`) — the permanent state of automation-group tabs per §6B. §6B's hidden-Chrome hard stop is scoped to **lazy-loaded / infinite-scroll** surfaces, and this source is a Super.so/Notion static render: **all 7 day-tables and all 34 rows were present in the DOM in a single pass**, and the capture reproduces the prior snapshot's 29 rows byte-for-byte under the stored normalisation rules. That byte match is the evidence the render was complete, so the capture proceeded. No lazy-loaded surface was touched this run.

---

## 2. Stale-week check (mandatory for this source)

| | |
|---|---|
| Banner week | **6 August – 12 August 2026** |
| Day tables present | Thu 6, Fri 7, Sat 8, Sun 9, Mon 10, Tue 11, Wed 12 (7 tables) |
| Today | Sat 8 August 2026 |
| Verdict | **NOT STALE — this is the current week.** Today falls inside it and 2 of the 7 days (Sat 8, Sun 9) are current/future. |

The page has **not rolled** since the 2026-08-07 run (same banner, same week). The curator rolls on Thursdays, so the 13–19 Aug edition is expected from Thu 13 Aug.

---

## 3. Capture (§0.22 compliant)

- Collected with `javascript_tool` + DOM walk of `h2` day-headings → the following `table.notion-table`, reading cells directly. **`get_page_text` was not used for extraction.**
- 34 gig rows across 7 day sections. Raw normalised capture: `data\raw\sceniceye\2026-08-08\CAPTURE-normalised.txt`.
- Transferred out of the tab as **per-line FNV-1a hashes** (48 lines × 8 hex chars), then only the literal text of the differing lines was pulled — the technique the klma run documented for the `javascript_tool` ~1,000-char ceiling. The ceiling was hit again this run and worked around the same way; nothing new to report on it.

---

## 4. Two-sided diff (§5.7)

Diffed against `data\state\sceniceye-last-page.txt` (2026-08-07, 29 gig rows), both sides under the snapshot's own 8-point normalisation header.

### 4a. ADDED — 2 rows, both SKIPPED

| Date | Act | Venue | Time | Disposal |
|---|---|---|---|---|
| 2026-08-08 | The Monkey Butlers - Staunton Festival | Staunton Country Park, Petersfield Road, Havant, PO9 | 12:35 PM | **SKIP** |
| 2026-08-08 | Tagalu Cat - Staunton Festival | Staunton Country Park, Petersfield Road, Havant, PO9 | 5:45 PM | **SKIP** |

Both skipped on **two independent grounds**, either of which is sufficient:

1. **The festival skip for this source** — Jason's ruling 2026-07-31, carried in `sources\sceniceye.md`: *"park all festivals, handle separately… Skip the row, name it in the report, create nothing — no festival container, and not the individual slots either."*
2. **§0.23 — not a fixed building.** Staunton Country Park is a country park, and the address carries only the **partial postcode `PO9`** with no street number. bndy's venue UID is a Google Place ID and no correct one exists for a park, so the record could only ever be wrong — and §0.23 notes there is no tool to null a bad `google_place_id`.

No artist, venue or event was created for either row. Both acts are recorded here as discovery leads: **The Monkey Butlers**, **Tagalu Cat**.

### 4b. REMOVED — 0 rows

**No future-dated row disappeared from the source.** §0.17 / §5.7(b) therefore did not engage: nothing was deleted, nothing hidden, nothing logged as a source-drop. (Noting for the record that Jason's 2026-08-06 ruling — *never hide; delete and fix / delete and recreate* — is the standing behaviour here and would have governed had a row dropped. §5.4 and §0.17 in the runbook text still say "hide" and remain flagged for a CTO edit by the 2026-08-07 onthecase run; that contradiction did not bite this run because there was nothing to action.)

### 4c. FORMAT-ONLY change — caught, and written into the snapshot header

Mon 10 / Tue 11 / Wed 12 changed shape without changing content. Yesterday they had **no table at all**; today each carries a real one-cell `notion-table` whose act cell reads literally **"No gigs listed"** (venue and time blank).

A naive diff reads that as **3 removed lines + 6 added lines** on three days that contain **zero gigs**, and — since §5.7 routes removed rows to §0.17, which now deletes — that class of artifact is destructive. It was collapsed to the snapshot's rule-7 single-line form and **rule 7 has been extended in the snapshot header** so the next run regenerates it identically. This is the third instance in three days of "the capture surface varies in ways the stored snapshot does not record" (after the onthecase trailing slash and this source's own `, England` suffix on 2026-08-07) — no new ruling requested, the existing normalisation-header device handled it.

A second, subtler trap was found and also written into the header as **new rule 8: the source's DOM row order is not chronological within a day.** Saturday runs 11:30 → 12:35 → **12:00** → 13:30. A run that "tidied" the rows by sorting would make every row below the first inversion diff, on a page that had not changed.

---

## 5. Coverage check — the diff is not the only thing that was verified

The runbook's own open item (2026-08-06, klma) warns that *"the daily diff only ever sees rows that were ADDED since the last snapshot, so a row that failed to import once is invisible to every subsequent run, for ever."* Rather than report "0 added, therefore nothing to do", this run **independently verified every current/future non-festival row against bndy** — resolving the venue, then `search_event(venueId, dateFrom, dateTo)`, which is the reliable probe.

**All 8 are present, all carry `sceniceye` provenance in the §6D slug form. Coverage of this week is complete.**

| Date | Act | Event id | Start | externalId |
|---|---|---|---|---|
| 2026-08-08 | Sophie Jenkinson @ The Stags Head | `22358a37-887f-4c41-bf91-055166612b62` | 20:00 | `2026-08-08-sophie-jenkinson-the-stags-head` |
| 2026-08-08 | Forever Queen @ Cowplain Social Club | `d62b8b2f-c43b-478e-8c59-086c035bebd2` | 19:00 | `2026-08-08-forever-queen-cowplain-social-club` (+ `cowork-discovery`) |
| 2026-08-08 | The Restless @ The Old House at Home, Havant | `28c849c5-9edf-4904-9a51-283d8457bb56` | 21:00 | `2026-08-08-the-restless-the-old-house-at-home-havant` |
| 2026-08-08 | Mama Belle @ The Heroes, Waterlooville | `a46d58d8-3fe0-447f-886f-2e537124fe4d` | 21:00 | `2026-08-08-mama-belle-the-heroes-waterlooville` |
| 2026-08-09 | Baxtrax @ The Hampshire Rose | `01115881-a914-4818-a8ab-b33116d70ea8` | 14:00 | `2026-08-09-baxtrax-the-hampshire-rose` |
| 2026-08-09 | T Junction @ The Golden Lion | `7de5eecb-bf10-4d2d-af8d-a09f718e7f07` | 15:00 | `2026-08-09-t-junction-the-golden-lion` |
| 2026-08-09 | TJ Quinn @ The Crown Inn Emsworth | `953e2d68-2432-4430-98cb-42578d6238cf` | 15:00 | `2026-08-09-tj-quinn-the-crown-inn-emsworth` |
| 2026-08-09 | Patch Collins @ The Heroes, Waterlooville | `acb62621-7a87-43d6-adb9-c17670f48acb` | 16:30 | `2026-08-09-patch-collins-the-heroes-waterlooville` |

**Forever Queen 2026-08-08** is the known open item: bndy holds `19:00` from the venue's own page (description *"Doors 19:00"*), the sceniceye listing says `20:45`. §5.6b gives the venue's own page precedence, so **19:00 was left untouched** — consistent with the 2026-08-06 run's decision and still awaiting Jason's ruling on doors-vs-stage time.

⚠ **`search_venue` low-confidence positives again, three of seven.** The correct venue was returned but scored **40%** for `The Heroes, Waterlooville`, **59%** for `The Crown Inn Emsworth`, **71–78%** for the Stags Head and Hampshire Rose — all below or near the 50% "create new" line in this source's match ladder. Each was confirmed by its `google_place_id` and existing `sceniceye` externalId before use, per §3's three-probe rule and §2.16. **A spec-following run trusting the score alone would have created duplicate venues for two of them.** This is a fourth, fifth and sixth instance of the already-open `search_venue` scorer item; no new ruling requested, but the evidence keeps accumulating.

---

## 6. Rows deliberately not imported (unchanged from the standing position)

| Rows | Reason |
|---|---|
| 11 Staunton Country Park slots (Sat + Sun, incl. the 2 new ones) | Festival skip ruling + §0.23 non-fixed building. `Davey Jones Locker` additionally lists **"Venue missing from calendar"**. |
| 5 Centurion "- Music Festival" slots (MD Duo, Dirty Blonde, Astromoda, Mark Harris, Skadacious) | Festival skip ruling, applied literally. **These are the rows the 2026-08-06 open item asks Jason to rule on** — one ordinary pub already in bndy (`2f01ebc9-abce-4ff6-8b39-0bde440d45ff`), named acts, real clock times, i.e. exactly bndy's target shape. Still unruled, so still skipped. **Cost this week: 5 gigs.** |
| `George Michael - Tribute` (Thu 6 Aug) | §0.5 — the real act's name is nowhere in the listing. Past-dated now, so moot this run. Open item stands. |

**Nothing was "staged" in the abolished §0A sense.** Every row above is either skipped under a standing ruling with the reason named, or already in bndy. No row was parked for want of certainty.

---

## 7. Report quality (§6, v2.5)

| Measure | Count |
|---|---|
| Records created with a **verified page** | 0 |
| Records created with an **evidenced blank** | 0 |
| Records **skipped**, reason named | 16 rows (11 Staunton + 5 Centurion) |
| Names **sanitised** or staged as non-acts under §0.6 | 0 needed this run |
| Gate bounces (409/422) | none — no write was attempted |
| Defaulted start times (§5.6) | none — this source publishes explicit times |
| Date corrections (§5.6b) | none |
| Deletions (§0.17) | none |

**This is a genuine no-change run, not a manufactured one.** The source added two rows and both fall under a standing skip; every other row was verified present rather than assumed.

---

## 8. Validator (§6A step 8)

**Not applicable — zero records were written to bndy, so there is no batch to validate and no enrichment evidence file to write.** `scripts\enrichment_validate.py` takes the records a run wrote; with none, there is nothing to feed it and nothing shipped unvalidated. No `data\state\enrichment-evidence-2026-08-08-sceniceye.jsonl` was created, correctly — an empty evidence file would be a false artefact.

---

## 9. Open rulings raised by this run

**None.** Everything encountered is covered by an existing rule or an already-open item, and §0A rule 3 says a new rule that lets a run write nothing new is a tax. The two items this run touched and did **not** re-raise:

- the Centurion "Music Festival" question (open since 2026-08-06, cost now measurable at 5 gigs/weekend);
- the `search_venue` scorer (open since 2026-08-06, three further instances recorded above).

Both are appended to below with evidence rather than raised afresh.

---

## 10. Files written

- `data\state\heartbeat\sceniceye-2026-08-08T09-26-15Z.json` (started → completed)
- `data\state\claims\sceniceye.json` (acquired → released)
- `data\raw\sceniceye\2026-08-08\CAPTURE-normalised.txt`
- `data\state\sceniceye-last-page.txt` (new snapshot, 34 rows, normalisation header extended to 8 rules)
- `data\state\run-summary.jsonl` (one appended line)
- `data\normalized\sceniceye\2026-08-08\RUN-REPORT.md` (this file)
- `20-Daily\2026-08-08.md` (one appended line)

**Nothing was written to bndy.**
