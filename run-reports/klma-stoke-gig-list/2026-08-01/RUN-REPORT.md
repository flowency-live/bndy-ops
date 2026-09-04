# KLMA Stoke Gig List — RUN REPORT 2026-08-01

**Status: COMPLETED.** Snapshot written (§6A step 7 fail-closed gate satisfied).

- **Source:** `klma-stoke-gig-list` · Google Sheet, gviz `?tqx=out:html` read via Chrome
- **Runbook:** `RUNBOOK.md` **v2.4** — version floor (≥ v2.4) asserted and PASSED
- **Spec:** `sources/klma-stoke-gig-list.md` (read in full)
- **Standing rulings:** `OPEN-RULINGS.md` STANDING RULINGS read and applied (no-stubs; quality-not-error-count reporting)
- **Capture:** 434 rows, 121 distinct date groups. Capture method: `javascript_tool` + DOM read (§0.22 — `get_page_text` NOT used for collection)
- **Date established:** device clock, 2026-08-01. `mcp__workspace__bash` was UNAVAILABLE all session ("VM service not running") — §6A step 1 fallback used.

---

## 1. HEADLINE COUNTS

| Metric | Count |
|---|---|
| Rows captured | 434 |
| Added rows (vs snapshot) | 25 |
| — of which importable (core) | 6 |
| — of which park-lot (Artisan Tap / Eleven) | 19 |
| Removed future rows | 1 |
| Past-dropped rows (Jul 30–31) | 13 |
| **Artists created** | **1** |
| **Events created** | **5** |
| Events matched (409 DUPLICATE_EVENT) | 1 |
| Events enriched (provenance back-fill) | 1 |
| Staged / blocked | 1 |
| Gate bounces (unresolved) | 0 |
| Creates against 50 cap | 6 / 50 |

---

## 2. ARTIST QUALITY BREAKDOWN (per STANDING RULING 2026-08-01)

### 2a. Created WITH a verified Facebook page — 1

| Artist | id | Evidence |
|---|---|---|
| **Hannah Christina** | `91a759f1-41fe-47d4-82f8-bc4438d0b1fc` | `facebook.com/hannahchristinamusic` — page category **Musician/band**; page carries a post about **the very gig being imported** ("charity fun day … at The Victoria, The Little Vic This Sunday 2nd from 4pm"); bio states "vocalist from **Stoke-on-Trent**". Meets §2A.1 bar on three independent signals. Page live (post dated late July 2026). |

Fields written and verified by read-back (§0.10):
- `name`: **Hannah Christina** — page name is "Hannah Christina Music"; the `Music` suffix stripped per §0.6 and the existing `Andrea Harvey Music → Andrea Harvey` precedent in this source's alias table
- `artistType`: `solo` (bio: "a unique vocalist")
- `location`: `Stoke-on-Trent`, `locationType: city` (from the act's own page, not the gig-town fallback)
- `bio`: taken verbatim from the act's own page
- `profileImageUrl`: `https://graph.facebook.com/100066536991820/picture?type=large` (numeric-id graph URL per §2A.2 — no `scontent.*`)
- `actType`: `["covers"]` — **defaulted** per §2A.2; nothing contradicts it and the bio ("cater to your favourite eras in music") supports it. Flagged here as a defaulted value.
- `genres`: **left EMPTY** — source genre cell read "All genres", which is not a bndy enum value (§0.18: unknown beats invented)
- `externalIds`: `{klma-stoke-gig-list, artist-hannah-christina}`

### 2b. Created with an EVIDENCED BLANK — 0

None. No artist was created this run without a verified page.

### 2c. STAGED (not created) — 0

None. The no-stubs override did not have to hold anything back: the only genuinely new act resolved to a verified page on the first search.

### 2d. Matched / reused existing artists — 3

| Billing in source | Resolved to | id | Basis |
|---|---|---|---|
| `Catalyst` | **Catalyst** | `9e3abec3-2ed9-4a37-9e84-91a429fb7a27` | 100% name match; location `Staffordshire UK`; already carries a `klma-stoke-gig-list` externalId (came from this source). §1A.2 footprint check: new gigs are Newcastle-under-Lyme + Madeley, inside the existing Staffordshire footprint → SAME act, reuse (rule 3). |
| `Sam Bloor` | **Sam Bloor** | `639ee241-b260-4c28-861f-2006bcc5f948` | 100% name match, `Stoke-on-Trent, UK`, has FB avatar. |
| `The vanz` | **The Vanz** | `7a16a3b6-ed61-4d0f-8191-1d89fdcf440f` | 100% name match + the spec's learned mapping ("The VANZ ROXX \<venue\>" → The Vanz). Billing variant only. |

---

## 3. EVENTS CREATED — 5 (full UUIDs)

| # | Event | id | Date | Time | externalId |
|---|---|---|---|---|---|
| 1 | Hannah Christina @ The Victoria | `87f9f941-230d-4917-80c6-9263399696cb` | 2026-08-02 | 16:00 | `2026-08-02-hannah-christina-the-victoria` |
| 2 | Sam Bloor @ The Victoria | `52a00433-fc7c-4e1d-885c-84490812d910` | 2026-08-02 | 16:00 | `2026-08-02-sam-bloor-the-victoria` |
| 3 | Catalyst @ The Victoria | `504e2f83-fb3f-4e93-b03a-644469e82e02` | 2026-08-23 | 19:00 | `2026-08-23-catalyst-the-victoria` |
| 4 | Catalyst @ The Museum, Newcastle under Lyme | `5aa8e45f-5144-4ae2-b8de-ccf9938533fd` | 2026-08-29 | 21:00 | `2026-08-29-catalyst-the-museum-newcastle-under-lyme` |
| 5 | Catalyst @ The Offley Arms | `6ee78bbb-639e-4a8d-b4a2-9025056432be` | 2026-09-04 | 21:00 | `2026-09-04-catalyst-the-offley-arms` |

All five: `isPublic: true`, §6D slug externalIds, verified by `get_by_id` read-back (§0.10).

### Venues — all matched, none created

| Source billing | bndy venue | id | Check |
|---|---|---|---|
| "The little vic, king street" / "Little Vic, King Street, Newcastle" | **The Victoria** | `aNJvhjLrO6PhN5l7xLgL` | Decisive: already carries externalId `klma-venue-victoria-little-vic-nul`. 62 King St, Newcastle-under-Lyme **ST5** ✓ (§0.24 postcode check passes — Staffordshire, not any other "Newcastle") |
| "The Museum, George Street, Newcastle" | **The Museum, Newcastle under Lyme** | `61ba4c83-1c33-4e37-9647-5231992db0f1` | 29 George St, **ST5 1JU** ✓ exact street match |
| "Offley Arms, Madeley" | **The Offley Arms** | `06119cf7-2c06-4caf-8b8e-03c1f9f4d51b` | Poolside, Madeley, **CW3 9DX** ✓ (Madeley, Staffs — Crewe postal town; address names Madeley) |
| "Ye olde crown" | **Ye Olde Crown** | `Rf2j76jAGsoRR93vc1pi` | Spec learned mapping; Burslem ST6 4AW ✓ |

### Defaulted start times (§5.6) — flagged for correction

- **Catalyst @ The Victoria, 2026-08-23** — Sunday, source time blank → defaulted **19:00**
- **Catalyst @ The Museum, 2026-08-29** — Saturday, source time blank → defaulted **21:00**
- **Catalyst @ The Offley Arms, 2026-09-04** — Friday, source time blank → defaulted **21:00**

### Time correction applied from the act's own page (§2A.3 / §5.6b) — needs your confirmation

- **Hannah Christina @ The Victoria, 2026-08-02** and **Sam Bloor @ The Victoria, 2026-08-02** were set to **16:00**, NOT the Sunday 19:00 default.
  **Evidence, verbatim from `facebook.com/hannahchristinamusic`:** *"It's almost August! Starting off with a charity fun day for a great cause at The Victoria, The Little Vic This Sunday 2nd from 4pm!! Very excited"*
  Hannah Christina's own page is act-owned evidence for her own event. **Sam Bloor's 16:00 is inferred from the same post** (same venue, same date, same billed charity day) rather than from his own page — that one is the weaker of the two. Flagging it explicitly for your call; the alternative is the bare 19:00 default, which the evidence contradicts.

---

## 4. EVENT MATCHED — 1 (409 = success signal, §0.9)

- Source row: `46234.61083 Sunday, August 2, 2026 The vanz Ye olde crown`
- `create_event` returned verbatim:
  > `DUPLICATE_EVENT — "Event already exists: This artist already has an event at this venue on 2026-08-02. Artists can only have one gig per venue per day." existingEventId: 705044f6-54eb-4376-9dd8-7e4110020284, existingEventTitle: "The VANZ ROXX @ Ye Olde Crown", matchedExternalId: null`
- **Correctly treated as a match, not retried with a varied name (§0.9).** The row is a second submission of the gig already on the sheet as `The VANZ ROXX Ye Olde Crown Burslemmy`.
- **Provenance enriched:** the existing event held `externalIds: []` (confirmed by `get_by_id`, not by `search_event` — §6B false-negative mode a). Wrote the single §6D id `{klma-stoke-gig-list, 2026-08-02-the-vanz-ye-olde-crown}` in one call per the replace-and-dedupe behaviour. Verified on read-back.

---

## 5. REMOVED FUTURE ROW — 1 — **STAGED, NOT DELETED**

**Row gone from the sheet:** `46140.89047 Saturday, August 1, 2026 Danny Brab Market Hall, Crewe Indie, Britpop & US alternative scene`

- Absence confirmed against the FULL capture by two independent methods (§5.7a) — not a formatting artifact. Other Aug 1 rows are still present, so this is not past-window drift.
- bndy event located: **`e5f3fe4a-4f47-4ed1-b911-d5fccfa90249`** — "Danny Brab @ Crewe Market Hall", 2026-08-01 20:00, venue `fIqoL7N8DSfWuvPiU9Hm` (Crewe Market Hall), artist `FIT600aoQ5lpNSejGctN`.
- **NOT DELETED.** §0.17(a) requires the event's externalIds be *from this source only*. `get_by_id` confirms `externalIds: []` — **empty**, so provenance is unattributable and the single-source condition **cannot be satisfied**. An event with no provenance may have come from the poster-import or another source.
- Additional caution: the gig is **today** (2026-08-01). A same-day irreversible delete on unattributable provenance is exactly the failure mode §0.11/§6 guard against.
- **Action: logged here and appended to `OPEN-RULINGS.md` for your ruling.** No write was made to the event.
- This is another instance of the known empty-externalIds defect already open in `OPEN-RULINGS.md` for onthecase / gigs-news / insangel — it now demonstrably blocks **cancellation detection for KLMA too**.

---

## 6. PARK-LOT — 19 added rows not imported

All at **Artisan Tap** and **Eleven Sandyford**, which the spec holds as `specialist_venues` (their rows are park-lotted every run, and both are national-act venues under the 2026-07-30 ruling).

A **new submitter wave** is visible: 15 of the 19 are *second submissions of gigs already on the sheet*, entered in a distinct format — venue as `Artisan Tap Hartshill` (no comma), a `7:00 pm` time and a `Y (see venue)` cost cell:

Aug 6 Johnny Nice Painter + Maggie Challinor · Aug 7 Flint Fire Prodigy Tribute · Aug 8 Putan Club + Eccie The Dog · Aug 15 Oh! Gunquit + The Complaint That Creeps · Aug 16 Jane & The Hurricanes · Aug 20 Joy Diversion · Aug 21 Laura Evans + Hels Pattison · Aug 22 Jessie & The Revolvers + Billobuckers · Aug 23 Dan Bud as Robbie Williams · Aug 26 Alternative Open Mic · Aug 27 Electric Tentacle · Aug 28 Onjah + Northwestern · Aug 29 Pretty Shivers + Jorge Wilson · Aug 30 Uncle Dad & The Day Drinkers · Aug 31 Walking Alone

Genuinely new park-lot rows (4): Aug 1 Strange + Morning Star (DJ) · Aug 2 Lo Tide Book club · Aug 5 Bloody Benders + Red Moon Heroes · Aug 19 Camems

**Note for the venue-source work:** these duplicate pairs will need de-duplicating when `artisan-tap-hartshill` / `eleven-sandyford` become their own sources, since the two submitters spell the venue differently and neither row carries a row-id.

---

## 7. SNAPSHOT DELTA

- Previous snapshot: 423 content lines. New snapshot: **434** lines.
- Reconciliation is exact: `423 − 13 (past-dropped Jul 30–31) − 1 (removed) + 25 (added) = 434` ✓
- Diff was cross-validated two ways: (i) per-date artist digests against the stored snapshot; (ii) sheet row-ids — all six new *core* rows carry fresh ids `46234.61083 … 46234.82259`, and **no other row in the sheet has an id ≥ 46233**.
- Snapshot written to `data\state\klma-stoke-gig-list-last-page.txt` in the same gviz `out:html` page-text format (§5.7 requires format parity).
- The 11 rows carrying long Facebook `?acontext=` tracking URLs were restored **verbatim from the previous snapshot** — the browser tool blocks query-string content in its output, so those lines could not be re-read this run. They were confirmed still present and unchanged by their date+artist keys.

---

## 8. NOTES, DEVIATIONS AND THINGS TO WATCH

1. **`mcp__workspace__bash` was down for the whole session** ("VM service not running"). Date came from the device clock per §6A step 1. No shell-based diff or file tooling was available, so the two-sided diff was done in-browser and by direct file reads. This also means **no `device_list_dir` mtime pre-check (§6F) was possible** on the files written. Only this source's own files were touched, per the §6F ownership lane.
2. **Chrome tab reported `document.hidden: true`** (the known structural MCP-tab condition, §6B). This did **not** invalidate the capture: the gviz endpoint returns a single fully-rendered static `<table>` (all 434 rows present in the DOM), not a lazy-loaded feed. The §6B hazard applies to infinite-scroll feeds only.
3. **Column alignment re-verified this run** as the spec requires. The live sheet has **7 columns, not the 6 the spec's field-mapping table documents** — there is a **Cost** column at index 5, between Time and Genre (e.g. `£6.00`, `Free`, `Y (see venue)`). Parsed accordingly. The spec's "Field mapping" table should be corrected on its next touch; I have not edited another owner's section beyond this note.
4. **Facebook search worked normally this session** (logged in as Jason Jones), returning the Hannah Christina page on the first query. Single act pages read fine via `get_page_text`, consistent with the v2.2 withdrawal of the "FB enrichment is structurally broken" claim.
5. **No lineup-named artist was created**; no placeholder artist; no artist created without a resolvable location.
6. Multi-artist sibling events for the 2026-08-02 Little Vic charity day (Hannah Christina + Sam Bloor, and Ozzfest elsewhere) are listed here so a parent event can be attached retroactively when §4's parent container ships: `87f9f941-230d-4917-80c6-9263399696cb`, `52a00433-fc7c-4e1d-885c-84490812d910`.
