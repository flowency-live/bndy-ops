# KLMA Stoke gig list — scheduled run, 2026-08-08

**Run id** `klma-stoke-gig-list-2026-08-08T09-18-18Z` · unattended · **outcome: COMPLETED**
**Runbook read:** `RUNBOOK.md` **v2.17**. Prompt asserts `>= v2.4`; §6A step 2a **CURRENT FLOOR is v2.17**. Pass on both. (The prompt's numeric floor is void per §6A step 2a — reported so the drift stays visible.)
**Spec read:** `sources/klma-stoke-gig-list.md` (updated 2026-08-06, incl. §VA and §CT). **`OPEN-RULINGS.md`** read; STANDING RULINGS binding.
**Claim:** `data/state/claims/klma-stoke-gig-list.json` was **missing → acquired** (§6G). TTL 2h. No takeover. Released at end.
**Heartbeat:** `data/state/heartbeat/klma-stoke-gig-list-2026-08-08T09-18-18Z.json`.
**Validator:** `8 records · 6 clean · 0 FAIL · 2 WARN [mode=gate]` — **exit 0**.

---

## 1. HEADLINE — QUALITY, NOT ERROR COUNT (§6 v2.5)

| | count |
|---|---|
| Artists created **with a verified page** | **6** |
| Artists created with an **evidenced blank** | **2** |
| Artists created as a **stub** (neither) | **0** |
| Artists **skipped** (not reached this run) | **13** |
| Events created | **11** |
| Venues created | **2** |
| Names **sanitised** under §0.6 | **2** |
| Names **rejected as non-acts** | 0 |
| Gate bounces (409/422) | 0 |
| Errors | **1** (`create_artist` HTTP 500 — see §7) |
| **Total creates** | **21** of a 50 cap |

**The run did not hit the cap. It ran out of working budget** — 19 of the 28 added rows were never
pipelined. They are listed in §6 and re-present on the next run untouched, because the snapshot
records only what the source published, not what was imported.

---

## 2. CAPTURE AND TWO-SIDED DIFF (§6A steps 4–5, §5.7)

Snapshot existed (both sections). Not a first run.

### Section 1 — KLMA sheet
Chrome on `gviz/tq?tqx=out:html`. `web_fetch` **not used** (spec: serves an 8-week-stale cache with no staleness signal).

**Column alignment re-verified this run, as the spec requires.** Trailing header row found at row 408:
`0 rowid/timestamp · 1 Date · 2 Artist · 3 Venue & Location · 4 Time · 5 Cost/Ticket · 6 Genre · 7 Link to Event` — 14 columns, matching the post-2026-08-06 mapping. **No off-by-one, no genre bleed.**

| | |
|---|---|
| Live rows | 419 |
| Snapshot rows | 394 |
| **Added** | **27** |
| **Removed** | **2** — both **past-dated** (Thu 6 Aug: Guitar Monkey @ The Swan Inn Stone; Johnny Nice Painter + Maggie Challinor @ Artisan Tap). Normal past-drop, **not** cancellations. No §0.17 action. |
| Position-only changes | 47 rows (curator re-sorted). Content identical — not a diff. |

⚠ **A whitespace artifact faked 4 extra added and 4 extra removed rows on the first pass.** The
curator's `Auctioneers  arms, cider festival, caverswall` gained a second space. Under §5.7(a) both
sides were re-normalised with a whitespace collapse, which resolved it to the true 27/2. **Three of
the four phantom "removals" were future-dated** — `Sac N Craic @ Glebe` 30 Aug, `C&c Duo @ The
Princess Royal` 5 Sep, `Love Generation @ Alsager Civic` 14 Nov. Under §0.17-as-it-now-stands
(Jason's "never hide, delete and recreate" ruling) an unnormalised run would have **deleted three
live gigs**. This is the third instance in three days of snapshot-format drift being the whole
story — see §8.

The new snapshot carries its **normalisation rules in its own header** so the next run regenerates
it byte-for-byte rather than inferring the format. Reconstruction was verified **hash-for-hash
against the live DOM across all 419 lines: 0 mismatches.**

### Section 2 — The Sugarmill (§VA.9)
`fetch()` + `DOMParser` in `javascript_tool`, reading `a[href]` (§0.22 — `get_page_text` forbidden here).

| | |
|---|---|
| `div.row2` elements | 45 |
| **Distinct gigs after dedupe** | **33** (28 dated, 5 with no title heading) |
| **Added** | **1** |
| **Removed** | 0 |

⚠ **The page renders every gig in TWO `div.row2` elements.** A run that does not dedupe by slug
double-counts the entire feed. Written into the snapshot header as rule 1.
⚠ **The gig-guide anchor path is `/sugarmill-gig-guide/`, not `/gig-guide/`.** My first parse used
the latter and silently produced empty slugs for all 33 rows. Also written into the header.

---

## 3. VENUE-AUTHORITATIVE CHECKS (§VA.7 — required per venue)

| Venue | Status | Findings |
|---|---|---|
| **The Rigger** | **CHECKED** — `theriggervenue.co.uk/upcoming-event-guide`, fetched clean | See below |
| **The Sugarmill** | **CHECKED** — sole-source feed captured | 3 known source faults all still present (§4) |
| **Cosey Club** | **NOT CHECKED** — no Cosey rows in this run's added set | n/a |
| **Eleven** | **NOT CHECKED** — no Eleven rows added; `specialist_venue`, park-lotted regardless | n/a |
| **Artisan Tap** | **NOT CHECKED** — still no proven surface (§VA.1). The only Artisan Tap row this run was a *past-dated removal* | n/a |

**The Rigger — merge result across the 9 added Rigger rows:**

| KLMA row | Venue's own page | Action |
|---|---|---|
| 05/12 `Headsticks: Revolution, An alternative musical gathering` | `Revolution: An alternative Musical Gathering`, Sat 05 Dec | ⭐ **Confirms §0.6.** The venue lists the *event* under that name with no act named, so the act is **Headsticks** and the rest is the EVENT title. Imported that way. |
| 06/12 `Beans on toast` | `Beans on Toast`, Sun 06 Dec | Name correction available — **not imported this run** (budget) |
| 06/11 `InMe` | `InMe`, Fri 06 Nov | Date + name confirmed. **Imported.** |
| 27/03 `Mosh Spice + Spinors` | `Mosh Spice`, Sat 27 Mar | Headliner confirmed; Spinors is KLMA-only support. Not imported this run |
| 13/08, 14/08, 22/08, 04/12, 03/04 | **absent from the venue page** | The venue's guide starts at Sun 09 Aug and has no entries for these dates. Per §VA.5(5): **imported from KLMA alone where imported at all, and said so here.** |

**KLMA is richer than the venue page for The Rigger, as §VA.4 predicts** — every one of these 9 rows
carries a price and a Facebook event URL the venue does not publish. All taken.

---

## 4. WHAT WAS WRITTEN

### 4a. Artists created WITH A VERIFIED PAGE (6)

| Artist | id | Page | Location, and where it came from |
|---|---|---|---|
| **Sam Hackney** | `d9dd3a04-74bb-4482-b842-297b597d7aa6` | own site `samhackneymusic.co.uk` | Stoke-on-Trent — the site says "from the Potteries" |
| **GemmaRae** | `d9f4430b-ddd5-41fc-b5f4-2da229b48e7d` | `facebook.com/profile.php?id=61589291296759` | Newcastle-under-Lyme — the page's own event post |
| **Crimson Veil** | `bfa62b32-2e95-4f65-871b-0457801a646f` | `facebook.com/crimsonveilband` | Brighton — **from Google/press (Reigning Phoenix Music, Ave Noctum), not the page and not the gig town** |
| **InMe** | `df9b6da9-ba18-4698-83a3-9e5644c3e7ff` | `facebook.com/inmeofficial` | Brentwood — **from Wikipedia/Google, not the page** |
| **Headsticks** | `6bffce2b-2f6f-4765-b5be-c847ee1f13c3` | `facebook.com/headsticksmusic` | **"UK wide" + regional** — page states none, and §0.7 forbids the gig-town fallback at The Rigger |
| **Naked Sunday** | `2a6d4e79-e9a7-4b2a-8e2f-6aa2e0207f3a` | `facebook.com/nak3dsunday` | Wolverhampton — **stated on the act's own page**, which outranks the "Stafford"/"Stoke" variants in the press results |

**Bios.** 3 quoted verbatim (Sam Hackney, GemmaRae, Crimson Veil). **3 left deliberately EMPTY** —
never composed:
- **InMe** — the page's entire intro block is booking/management email addresses plus an album trail. Not a bio, and §2A.1 item 8 forbids writing one.
- **Headsticks** — Facebook clamps the intro **mid-sentence** (`"...as raw and honest as it"`). A truncated fragment is not a quotation; item 8 allows a cut only at a sentence or line boundary. **Needs an About-tab capture by the enrichment run.**
- (Naked Sunday's bio *was* captured verbatim, typos and stray spaces intact.)

### 4b. Artists created with an EVIDENCED BLANK (2)

Both surfaces tried on both, per §2A.1 item 3b:

| Artist | id | Variants tried |
|---|---|---|
| **Crooked Head** | `3382a914-7f93-46b0-a3a4-5ec875c27c8a` | Google `Crooked Head band Stoke` → nothing (a Henley venue, a headband product, The Crooked Fiddle Band). FB page search `Crooked Head band` → *CrooKed-Band* (Manchester hardcore), *Crooked Fiddle Band*, *Crooked River Band*, *Crooked Cabin Band*, *The Crooked Hearts Band* (Scotland). **None is "Crooked Head".** |
| **Grimlord** | `7fa40360-6427-4930-926a-dfc9b07f9b69` | Google `Grimlord band UK` → Grimlord is a **Polish** band from Wrocław (Wikipedia, Metal Archives); a French black-metal band shares the name. FB page search `Grimlord` → *"Grimlord · POLISH BAND FROM WROCŁAW"* (450 followers), plus a record label and an undescribed `G R I M L O R D`. **§2A.1.1: never attach a non-UK same-name act's page.** Blank beats wrong. |

Both carry `"UK wide"` + `locationType: regional` — the Sugarmill is a national-act venue (§0.7/§VA.9), so the gig town is not evidence.

### 4c. Venues created (2)

| Venue | id | Postcode check (§0.24) |
|---|---|---|
| **Castle Mona** | `64fd6092-c900-49a9-8f67-2fb50d3d1ea5` | 4 Victoria St, Newcastle-under-Lyme **ST5 1NT** ✓ Staffordshire |
| **Talisman** | `6fecd113-6071-46c4-90f8-4bbd3dcedb85` | Furlong Rd, Tunstall, Stoke-on-Trent **ST6 5TZ** ✓ Staffordshire |

Both cleared the **v2.16 three-probe fallback** before creation — `search_venue(full name, city)`,
the distinctive word alone, and a loose city probe all returned nothing. Castle Mona's town was
**looked up, never guessed** (§0.8): CAMRA/WhatPub give 4 Victoria Street, ST5 1NT. Both were then
**independently corroborated by Sam Hackney's own gig diary**, which lists "Castle Mona, Newcastle
under Lyme" on 08 Aug and "The Tallisman, Tunstall" on 09 Aug.

Venues matched, not created: The Bush At Brown Edge · Fox and Goose (Foxt) · Waggon & Horses · The Rigger · The Sugarmill.

### 4d. Events created (11)

| Date | Event | id |
|---|---|---|
| 2026-08-08 | Rachel Shenton Clubland @ The Bush At Brown Edge | `6b5699af-9a5f-4f05-9bdd-68bf5b1dc12e` |
| 2026-08-08 | HardDrive (Foxtfest) @ Fox and Goose | `943297bc-d299-43ca-a034-a41ce1dbfa3b` |
| 2026-08-08 | Sam Hackney @ Castle Mona | `7056ab1c-9ee4-47cc-87f3-c8307251e98c` |
| 2026-08-08 | GemmaRae @ Waggon & Horses | `f972e16e-f29b-42cb-8de5-b28c34ef8205` |
| 2026-08-09 | Sam Hackney @ Talisman | `30cdb493-2969-4452-bc66-d5dfdcef7963` |
| 2026-08-22 | Crimson Veil @ The Rigger | `2e42db26-4d6d-4f44-bc8f-2708dc5be86a` |
| 2026-10-02 | Crooked Head @ The Sugarmill | `3d9dcf17-b2a9-42f8-a59c-1ae668730934` |
| 2026-10-02 | Naked Sunday @ The Sugarmill | `78f5b808-438e-4a55-bef2-51844855c329` |
| 2026-10-02 | Grimlord @ The Sugarmill | `5601b640-7027-4f98-b467-23c4cb378966` |
| 2026-11-06 | InMe @ The Rigger | `e9ba695f-e15d-4bbe-84d2-7447325daae9` |
| 2026-12-05 | Headsticks — Revolution: An alternative Musical Gathering @ The Rigger | `41dbd09d-1404-4c89-bfb9-9e81ea3e1b17` |

All 11 `isPublic: true`, all carry a §6D externalId, all read back with `get_by_id` (§0.10).
**§4 sibling ids for retroactive parent attachment:** the three 2026-10-02 Sugarmill events above are one bill.

### 4e. Names sanitised (§0.6)

- `Headsticks: Revolution, An alternative musical gathering` → artist **Headsticks**; the rest is the event title. **Confirmed independently by the venue's own listing**, which names the night and no act.
- `Rachel Shenton Clubland` → artist **Rachel Shenton** `vOcRqNQmZpVLd5T4X5o9`; "Clubland" is a billing and was already on that record's `nameVariants`. §1A.5 automatic match, no review.

### 4f. Defaulted start times (§5.6) — all correctable

Nine of the eleven rows published no time. Sat → 21:00, Sun → 19:00 applied: the four 08-08 events,
Sam Hackney 08-09 (19:00), Crimson Veil, InMe, Headsticks. The three Sugarmill events took **19:00
from the page itself**, not a default.

---

## 5. TICKETING (§CT)

`£10` `£26.40` `£22` `£16.50`-class values → `ticketed: true` + the value verbatim. Blank cells wrote nothing.

⚠ **Two values are NOT in the §CT vocabulary and I had to rule on them. Please confirm.**
- **`£0.00`** (Sam Hackney ×2) — read as **Free**: `ticketed: false`, `price: "Free"`. Unlike `Check with venue`, this is an explicit statement of zero price, not of ignorance, so §0.18's unknown-beats-wrong does not bite. **Add `£0.00` to the §CT table.**
- **`FREE`** (HardDrive) — same mapping as `Free`, differing only in case. **Make the §CT match case-insensitive.**
- `Free Entry` (The Fabulous Sarah Jane Experience) and `£3.50 entry` (John Sewell) also appeared in rows not reached this run. The vocabulary is drifting; it is worth a pass.

---

## 6. NOT REACHED THIS RUN — 19 rows, nothing lost

The run stopped on working budget, **not** on the 50-create cap (21 of 50 used). These rows were
captured and diffed but never pipelined. **They are still absent from the snapshot's "imported"
state and will re-present as normal added rows next run.** No stubs were written for any of them.

**John Sewell Music — 9 gigs, one artist. The single biggest win available and it is still open.**
14 Aug Cappello Lounge · 23 Aug Sandon Hall Stafford · 30 Aug The Red Lion Bradley · 20 Sep Crown
Wharf Stone · 10 Oct The Globe Tunstall · 17 Oct The Bridge Inn Stone · 23 Oct The Dog House
Stafford · 24 Oct The Old Bulldog Longton · 14 Nov The Globe Tunstall · 15 Nov Crown Wharf Stone ·
21 Nov The Prince of Wales Stafford. Not in bndy under that name (searched at minConfidence 25).
Needs ~8 venue creates, which is why it lost to cheaper rows. **Worth doing first next run.**

**The Rigger, remaining 6 rows:** 13/08 `Static Fireflies, Joel & Bene, and Ed Bowker` (§4 → 3 acts)
· 14/08 Onjah · 04/12 Tony Wright · 06/12 Beans on Toast · 27/03 Mosh Spice + Spinors · 03/04 Smoke
on Trent. Enrichment leads already gathered and recorded here so the next run does not repeat the
work: **Beans on Toast** = `facebook.com/beansontoastmusic` (Jay McAllister, Braintree, Essex);
**Tony Wright** = Terrorvision frontman, Bradford, `tonywright.net` (FB page not yet pinned — a
`laikatone` page appeared and needs opening). **Static Fireflies**, **Onjah** and **Ed Bowker** all
returned nothing on Google and need the Facebook surface before a blank can be called evidenced.

**Also not reached:** 27 Sep The Fabulous Sarah Jane Experience @ The Roebuck, Chesterton · 13 Dec
Cosmic Waves @ The Bridge Inn, Stone.

---

## 7. ERRORS, BOUNCES AND SELF-REPORTS

- **`create_artist` HTTP 500, fail-closed, no record written.** Creating GemmaRae with `nameVariants`
  in the create payload. Retried **with the same name** and fewer fields per §0.9 → clean create;
  `nameVariants` then persisted fine via `edit_artist`. This sharpens the open build item of
  2026-08-07 (*"`create_artist(nameVariants)` is silently dropped"*): **on this payload it did not
  drop them silently, it 500'd.** Same field, worse failure mode.
- **⚠ SELF-REPORT: I HTML-escaped an ampersand, the exact thing §6B forbids.** Event
  `f972e16e-f29b-42cb-8de5-b28c34ef8205` was created titled `GemmaRae @ Waggon &amp; Horses`.
  **Caught by the §0.10 read-back, corrected to `&`, re-verified.** §6B has carried this warning
  since 2026-07-31 and I walked into it anyway; the read-back is the only reason it is not live data.
- **0 gate bounces.** No 409, no 422, no `review` verdicts.
- `get_by_id` still does not return `locationType`, so the §6B Kilmarnock pairing **could not be
  verified on read-back** for the three regional records (Headsticks, Crooked Head, Grimlord). It was
  passed correctly on write. Existing open item.

---

## 8. FOR OPEN-RULINGS

Appended to `OPEN-RULINGS.md` this run:
1. §CT vocabulary gap — `£0.00`, `FREE`, `Free Entry`, `£3.50 entry`.
2. Third consecutive day of snapshot-format drift faking a diff, this time nearly deleting three live future gigs.
3. The Sugarmill's double-rendered rows and the `/sugarmill-gig-guide/` anchor path — spec facts, not rulings, but the spec was **not edited by this run** (same restraint prior runs applied).
4. Two new unresolved undated Sugarmill slugs: `vampire-ball-2026`, `the-bon-jovi-experience`.
5. `Gemma Rae` was reported as reused at 89% by the 2026-06-13 run and **is not in bndy** — a second instance of the report-vs-database discrepancy already open for `Chloe Anne`.
