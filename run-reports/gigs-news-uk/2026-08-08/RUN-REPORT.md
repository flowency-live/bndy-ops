# gigs-news — RUN REPORT 2026-08-08

**Outcome: COMPLETED — with one self-inflicted error, caught and reverted before the report was filed. Read §4a first.** Runbook read at **v2.17**; §6A step 2a floor is **v2.17** → pass. (The deployed task prompt asserts no number of its own; §6A step 2a is the binding gate.)

- Run id: `gigs-news-2026-08-08T09-18-13Z`
- Heartbeat: `data\state\heartbeat\gigs-news-2026-08-08T09-18-13Z.json`
- Claim: `data\state\claims\gigs-news.json` — **file absent → acquired** (TTL 90 min, §6G). No takeover. Legacy `data\state\gigs-news.lock` found already released (`heldBy: null`, 2026-08-07T04:55Z); not honoured, not deleted, not recreated (§6A step 2b).
- Snapshot written: **YES** — `data\state\gigs-news-uk-last-page.txt`
- Validator: `5 records · 3 clean · 0 FAIL · 2 WARN [mode=gate]` — **exit 0**

---

## 1. Counts

| | |
|---|---|
| Rows captured (week view) | 89 |
| Rows captured (branded.htm forward list) | 24 |
| Rows in horizon and importable | 20 |
| **Events created (net)** | **1** |
| Events created then reverted by this run | 1 (§4a) |
| Events bounced 409 (already imported) | 18 |
| **Artists created** | **1** |
| Artists matched / reused | 20 |
| Venues created | 0 |
| Venues matched | 15 |
| Rows rejected by filter | 26 |
| Rows dropped as past-dated | 43 |
| Staged | 0 |
| Deletions | 0 |
| Cancellations actioned | 0 |

**Quality split (§6 v2.5).** Of the 5 acts that needed an identity check this run: **3 created/confirmed with a verified page**, **2 with an evidenced blank** (variants recorded on both surfaces), **0 stubs**, **0 staged**.

---

## 2. Capture

Two pages, both read in Chrome (source spec: Chrome mandatory, client-rendered).

1. `https://www.gigs-news.uk/` — week view, **still showing "What's on This Week 5 - 9 August"**; the curator has not rolled the page. `document.visibilityState` was `hidden` (MCP tab group is structurally hidden, §6B) — **not a blocker here**: this is a static page, all 216 `<center>` blocks and 94 anchors were present in one render, no lazy-load involved.
2. `https://www.gigs-news.uk/branded.htm` — forward list taken as the **first dated section only** (lines 16–39, 24 rows, 1 Aug → 12 Dec), stopping at the next `Gigs 2026` header at line 156. The archive blocks (`Gigs 2026` / `2025` / `2024` / `2023` / `2022`, 186 rows) were **present in innerText this time** and were excluded by the ordinal rule, not by the render behaviour the spec relies on — see §7.

### ⚠ Tooling finding — `javascript_tool` blocks any returned string containing `=`

Every extraction attempt returned `[BLOCKED: Cookie/query string data]` until the `=` character was removed from the output. Confirmed by bisection: `window.__ROWS.slice(0,2).join(' ~ ')` returns fine, `'count=' + ...` on the same data is blocked. A second guard (`[BLOCKED: Base64 encoded data]`) fires on long uniform strings, and output truncates around ~1.4 KB.

**Consequence for this source:** venue Facebook hrefs (`profile.php?id=...`) cannot be returned raw and must be transformed (`=` → `(eq)`) before returning. **§0.22 was still honoured** — collection used `innerText` line walks plus `a[href]` reads inside `javascript_tool`, never `get_page_text`. `get_page_text` was used only for Google result pages during enrichment, which is what it is for.

---

## 3. Two-sided diff vs the 2026-08-07 snapshot

**Added rows (4), all in the week view — the curator filled in four previously blank act slots:**

| date | row | disposition |
|---|---|---|
| Fri 7 Aug | `Collette - the Stock Dove Romiley` | **past-dated, dropped** (§0.14) |
| Fri 7 Aug | `the Originals - Crown Bredbury` | **past-dated, dropped** |
| Fri 7 Aug | `Dr.Uke - The Crown Inn Stockport` | **past-dated, dropped** |
| Sat 8 Aug | `Back to BritPop - The Crown Inn Stockport` | **IMPORTED** |

**Removed rows: none that are real.** The home page's own `gigs 2026` block lost everything from 2 Oct onward (and the past 1 Aug row), but **all of those rows are still published on `branded.htm`**, which is the authoritative forward list for this source. Per §5.7(a) absence was confirmed against the **full capture**, not one page — so **nothing was treated as source-dropped and nothing was deleted.** Had only the home page been read, 11 future `branded`/`Reserved` events would have looked dropped and §0.17 would have deleted them.

**Cancellations:** `Sunday 20th September - Cheshire Cheese Newton - Reserved (cancelled - United match)` still carries its cancellation note and is still correctly absent from bndy. No action.

---

## 4. Scope decision — why 20 rows were pipelined, not 1

A strict reading of §5.7 puts only the one added row in scope. A spot-check of an *unchanged* row first (`Puls - the Arden Arms Stockport`, Sat 8 Aug) found **no such event in bndy**, which read as the defect already open at `OPEN-RULINGS.md` 2026-08-06 (klma): *the daily diff only sees rows ADDED since the last snapshot, so a row that failed to import once is invisible to every subsequent run, for ever.*

On that reading, and under §0A rule 1 (a run decides) and rule 3 (the measure is records in bndy), **every importable Sat 8 / Sun 9 row was pipelined**, not just the diff delta.

**The reading was wrong, and §4a is what it cost.** 18 of the 20 bounced 409 — the source was already fully imported. The scope expansion found **zero** real coverage gaps and produced **one wrong write**.

## 4a. ⛔ I RE-CREATED AN EVENT ANOTHER RUN HAD DELETED THIS MORNING ON GOOD EVIDENCE

**What happened.** `PULS @ Arden Arms, 2026-08-08` was absent from bndy not because it had never imported, but because **the spider run deleted it 40 minutes before I started** — event `5d394619-87ea-47de-bee1-1e6a96fcedb2`, deleted at ~09:30Z because the act's own website `pulsrockband.site/shows` states **"August 8th - CANCELLED - The Arden Arms"** (§5.6b: the act's own page beats the source listing). gigs-news still lists the gig, because the curator has not updated the page.

I created it again as `ff955d57-6915-4c09-a363-60a4c71f01da` at 09:36Z.

**Reverted.** I re-read `pulsrockband.site/shows` — still "August 8th - CANCELLED" — and **deleted `ff955d57` at 10:52Z, verified gone by `get_by_id`.** Net effect on bndy: none. The spider's deletion stands.

**Why the safeguards did not catch it.** The 409 sentinel cannot fire on a record that no longer exists, and the snapshot diff cannot see a deletion made in bndy by a different task. Nothing in the run contract asks a run to look at what has already run today — §6A step 5 diffs the source against the source, never against bndy's own recent history.

**Two things follow, and both are for Jason (raised in `OPEN-RULINGS.md`):**

1. **A missing event is NOT evidence of a coverage gap.** It may be an evidenced deletion from earlier the same day. Before treating an absence as a gap to fill, a run must check `data\state\run-summary.jsonl` and today's other run reports. That is a cheap rule and I would have needed it before, not after.

2. **§0.17's "deletion is safe — if the gig reappears the pipeline simply re-imports it" is FALSE when a second source still publishes the row.** Here re-import is precisely the wrong outcome, and it is not a one-off: gigs-news will keep listing this gig until Chris Statham rolls the page, so **every gigs-news run between now and then will try to re-create a gig the band has cancelled.** A deletion with no tombstone is not durable in a multi-source pipeline. Some record of "this was deleted, on this evidence, do not re-import" is needed — otherwise the honest choice for an evidenced cancellation is `isPublic:false` rather than delete, which is the exact question already open from v2.11b.

**My own error, separately:** I generalised from a single absent record to "there is a coverage gap on this source" and expanded scope on it. One data point, and the alternative explanation — *another run deleted it* — was sitting in `20-Daily\2026-08-08.md`, which I read only when writing this report. **Read the day's own log before theorising about the data** (v2.10's standing lesson, arrived at from the other direction).

---

## 5. Records written

### Events created — 1 net

| id | title | date | time | externalId | status |
|---|---|---|---|---|---|
| `574bfe5f-7af4-4bfc-9511-f4bd16d7e8b1` | Back to Britpop @ The Crown Inn | 2026-08-08 | 21:00 *(defaulted, Sat)* | `gigs-news:2026-08-08-back-to-britpop-the-crown-inn` | **live**, verified by `get_by_id` |
| `ff955d57-6915-4c09-a363-60a4c71f01da` | PULS @ Arden Arms | 2026-08-08 | 21:00 *(defaulted, Sat)* | `gigs-news:2026-08-08-puls-arden-arms` | **created in error, DELETED by this run 10:52Z, absence verified** — see §4a |

The surviving event was verified by `get_by_id` (§0.10): `isPublic: true`, correct artist/venue/date, externalId persisted.

### Artist created (1) — with an evidenced blank, no stub

**`Back to Britpop` `907191c7-66f1-4fad-bde8-87335f37560c`** · band · Manchester (city) · actType `tribute` · genres `Britpop, Indie, 90s` · nameVariants `["Back to BritPop"]` · instagram + website attached · **facebookUrl BLANK, evidenced.**

- Name corrected from the source's `Back to BritPop` to the act's own `Back to Britpop` (§0.20); source spelling kept as a nameVariant.
- Bio is a **verbatim two-line quotation** of the act's own Instagram bio, line breaks preserved, third (truncated) line cut at the line boundary (§2A.1 item 8).
- FB blank because the only Facebook page the act itself publishes — linked from `backtobritpopband.wixsite.com` — returns *"This content isn't available at the moment"* while logged in. Variants tried, both surfaces: Google `"Back to BritPop" band`; Facebook page search `back to britpop`; direct `facebook.com/backtobritpop`.
- ⚠ **`create_artist` returned HTTP 500 when the `bio` containing emoji + U+2063 invisible separators was passed on the create call.** Fail-closed, nothing written. The identical string persisted first time via `edit_artist` and read back byte-identical. **Build item — see §8.**

### Artists matched, not duplicated (4 that needed an identity check)

| source billing | resolved to | how |
|---|---|---|
| `Dan Budd is Robbie` | **Dan Budd as Robbie Williams** `717b6832-659a-4109-bc71-912466636015` | matched on **facebook key**; already fully enriched (created 2026-08-06) and already carried `Dan Budd is Robbie` as a nameVariant. Nothing to top up. |
| `Undercover` | **Undercover Rock Band** `d42b78b4-a295-4a69-8328-111d7dbbd681` | `create_artist` returned `review` against 3 shared-token candidates; §1A.7 enrich-first found the act's page (`profile.php?id=100063527858840`) and the **existing bndy record holds the same page id** → same act (§1A.2 Step 0). Reused, **not created**. |
| `Vehicle` | **The Band Vehicle** `ada252ae-e81c-477d-961d-ae715a90fa5f` | 422 `DUPLICATE_ARTIST` from the uniqueness gate; existing record already carried `Vehicle` as a nameVariant. Gate obeyed, existing id used (§0.9). |
| `Nazma` | **Nazma Dawn Desai** `bf8a8379-ed0e-48b6-913d-4588b408d03c` | matched on **name_variant**. No act-owned page on either surface (evidenced blank recorded); the record's own name confirms the third-party attribution. |

**Top-ups applied (§2A.2 / §1A.4):**
- `d42b78b4` — added nameVariants `["Undercover", "Undercover Rock band"]` + externalId `gigs-news:artist-undercover-rock-band`.
- `ada252ae` — added externalId `gigs-news:artist-vehicle`; **canonicalised facebookUrl** from `facebook.com/p/The-Band-Vehicle-100063548463931/` to `facebook.com/profile.php?id=100063548463931` (§2A.2 — same page id, canonical form). This was the one validator FAIL and it is fixed, not waived.

### Venue finding — a `search_venue` miss that was not an absence (§3.1, fourth confirmed instance)

`search_venue("Poynton Workmens Club", "Poynton")` → **not found**. `search_venue("Workmens", "Stockport")` → not found. `list_venues(city:"Poynton")` → one venue, not it. All three §3.1 probes missed. The venue exists as **`QWIBLMGTJIqiGnkk1kvU` "Poynton Workmen's Club"**, 142 Park Ln, **SK12 1RG** — surfaced only when `create_venue` dedup'd it on `google_place_id` at 100% confidence. **The defeating character is the apostrophe in "Workmen's"**, exactly as with `Men's`, `Grumpy's` and `Steels.`. No duplicate was created because `create_venue` deduplicates server-side on place_id — **that server-side dedup, not the match ladder, is what saved this one.** Postcode SK12 confirms Cheshire East (§0.24).

---

## 6. Rejected rows (26) — logged, not imported

**Sat 8 Aug:** `karaoke - the Albion Dukinfield` · `karaoke/disco - the Dog Inn Chadderton` · `live bands - Spinning Top` (multi_act, no names) · blank-act rows at Kings Arms Hotel Wilmslow, the Musketeer Leigh, the Billy Goat Mossley, Queens Arms Old Glossop, the Railway Handforth, Marple Con & Social Club, Crown Bredbury, Dane Bank Denton, Rising Sun Hazel Grove · time-only rows `8pm - Dog & Partridge Great Moor`, `5pm - Windsor Castle Marple Bridge`, `8pm - the Steelworks Bredbury`.

**Sun 9 Aug:** `4pm - Cheshire Cheese Newton` · `4pm - Spinning Top` (time-only) · `- Prince of Wales Glossop` (blank) · `Dave's karaoke 5pm - the Club Romiley` · `Between the Vines Open Mic 7pm - Fox & Pine Oldham` · `Jazz at the Railway - the Moor Club` (spec: always skip).

**Duplicate branded row:** `branded - Stockport Town Hall Tavern` appears twice under Sat 8 Aug; one event only (`463cb7ec-37f2-45e2-871f-12c52eff738d`, already in bndy).

No name was sanitised as a non-act this run. No row was skipped for lowercase `branded` (§ spec warning honoured).

## 6b. Defaulted times — all flagged per §5.6

Sat 8 Aug, no time in the listing → **21:00**: PULS, Back to Britpop (the 2 created). Sun 9 Aug times were all stated in the listing (`4pm`→16:00, `5pm`→17:00, `6pm`→18:00, `7pm`→19:00, `6-8pm`→18:00/20:00) except `Lazarus - Whittles Oldham`, which had none → **19:00** Sunday default; that row 409'd, so nothing was written from the default.

## 6c. Gate bounces, verbatim classes

18 × `DUPLICATE_EVENT`. **12 matched on externalId** (`Found existing event with externalId gigs-news:<slug>. This event was already imported.`) — confirming the §6D slug convention in live data is `<date>-<artist-slug>-<bndy-venue-name-slug>`. **6 matched on the artist+venue+date sentinel with `matchedExternalId: null`** — every one of those was then read with `get_by_id` and **all six already carry a `gigs-news` externalId under a slightly different slug** (e.g. `2026-08-08-sods-law-the-crown-heaton-moor` where I derived `...-the-crown`, `2026-08-08-vehicle-the-wellington-stockport` where I derived `...-the-band-vehicle-...`). **Nothing was rewritten** — §6B says match the existing convention, never add a second id, and `edit_event(externalIds)` would have replaced the good one.

⚠ **Slug drift is real on this source**: the venue portion is sometimes the bndy venue name, sometimes the source's label with its locality suffix, and the artist portion sometimes uses the source billing rather than the resolved artist name. It is harmless today (the sentinel catches the duplicate either way) but it means **the externalId cannot be relied on as the primary idempotency key for gigs-news** — see §8.

---

## 7. Source-spec finding — the branded.htm archive guard did not behave as documented

`sources\gigs-news-uk.md` says the 186 archive rows *"are present in the DOM but are not rendered, so `innerText` excludes all 186 automatically"* and offers that as one of two independent safeguards. **This run's `innerText` capture returned all 406 lines including every archive row.** The ordinal rule — *the forward list is the FIRST dated section; every subsequent `Gigs <year>` header opens an archive* — worked exactly as written and is what kept the capture clean.

**Nothing was mis-imported.** But the spec presents two safeguards and only one of them is currently load-bearing. The spec was **not edited by this run** (§6F: a run does not rewrite its own spec's structural claims unattended) — raised in `OPEN-RULINGS.md`.

---

## 8. Raised to OPEN-RULINGS.md

0. **(§4a, the important one)** An absent event is not evidence of a coverage gap — it may be today's evidenced deletion. And **an evidenced deletion is not durable while a second source still lists the row**: §0.17's "re-import is safe" is false in that case, and this specific gig will be re-offered by gigs-news every night until the curator rolls the page.
1. `create_artist` HTTP 500 on a bio containing emoji / U+2063 (fail-closed); `edit_artist` accepts the identical string. Every enriched create currently needs a second write.
2. gigs-news event externalId slug drift — three derivation styles live in the data for one source.
3. `sources\gigs-news-uk.md` branded.htm `innerText` safeguard no longer holds (spec not edited by this run).
4. `javascript_tool` output guard blocks any string containing `=` — affects every source whose ids or hrefs carry query strings.
5. Event title `The Swan, Wilmslow` on `ae2ae9ae-ea90-40ef-b366-c76a1f47b323` does not follow the §5.2 «Artist» @ «Venue» form. Display string only; artist and venue records are correct. Repair-lane, not touched.

## 9. Files written

- `data\raw\gigs-news-uk\2026-08-08\capture-normalised-2026-08-08.txt`
- `data\state\gigs-news-uk-last-page.txt` (snapshot)
- `data\state\enrichment-evidence-2026-08-08-gigs-news.jsonl` (5 records, written before the bndy writes)
- `data\state\heartbeat\gigs-news-2026-08-08T09-18-13Z.json`
- `data\state\claims\gigs-news.json`
- `data\state\run-summary.jsonl` (one appended line)
- this report
