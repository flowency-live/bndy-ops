# gigs-news — scheduled run 2026-09-01

- **Run id**: `gigs-news-2026-09-01T19-38-28Z`
- **Runbook read**: `RUNBOOK.md` H1 **v2.27**, in full. Floor in §6A is **v2.19**. Assertion PASSES.
- **Prompt floor**: the task prompt states no number. §6A step 2a is the gate.
- **Spec read**: `sources/gigs-news-uk.md`, in full.
- **Inbox read**: `CTO-INBOX.md`. Every fingerprint in the file was listed before any item was considered.
- **Claim**: `data/state/claims/gigs-news.json`. `heldBy` was null, released by `gigs-news-2026-08-30T04-07-17Z`. Acquired 19:38:28Z, TTL 90 minutes. No takeover.
- **Heartbeat**: `data/state/heartbeat/gigs-news-uk-2026-09-01T19-38-28Z.json`. See §12.
- **Outcome**: **COMPLETED.** The curator rolled both pages. The new week is 2 to 6 September. One event created, one explicit cancellation hidden, 21 events given the canonical `gigs-news` externalId, two venue-named event titles corrected.
- **Gap since the last run**: 2 days 15 hours 31 minutes.

## 1. Counts

| Measure | Count |
|---|---|
| Events created | 1 |
| Events hidden (explicit cancellation, §5.4 row 1) | 1 |
| Events edited — externalId back-fill | 21 |
| Events edited — title corrected (§5.2) | 2 |
| Artists created | 0 |
| Artists enriched | 0 |
| Venues created | 0 |
| Records created with a verified page | 0 |
| Records created with an evidenced blank | 0 |
| Records staged | 0 |
| Names sanitised under §0.6 | 1 (`Tony Auton band Jam` to artist `Tony Auton Band`) |
| Rows rejected by the source filter | 45 |
| Rows skipped — no resolvable venue | 1 |
| Rows skipped — date conflict, no sibling created | 1 |
| Gate bounces (409/422) | 0 |
| Creates against the 50 cap | 1 of 50 |
| Validator | 0 records · 0 clean · 0 FAIL · 0 WARN, exit 0 |

**Quality statement (§6).** This run created no artist and no venue, so it created no stub. Every one of the 22 acts in the week view resolved to a record already in bndy. The single event create used an existing enriched artist (`Tony Auton Band`, North West UK, Facebook page on record) and an existing venue with a Google Place ID.

## 2. Capture

`tabs_context_mcp` returned one live tab, so **Claude in Chrome was connected this run** — the first time since the outage that runs `bv2a-chrome-unreachable-*` recorded. Chrome was not needed for the capture and was not needed for enrichment either, because no artist was created.

Both pages were fetched with container `curl` and parsed with BeautifulSoup + lxml, reading `a[href]` on every row per §0.22. That route is evidenced in the inbox as `gigs-news-curl-reproduces-week-view` (2026-08-18) and was used by the two previous runs.

| URL | Method | Result |
|---|---|---|
| `https://www.gigs-news.uk/` | container curl, BeautifulSoup + lxml, leaf block nodes, `a[href]` | HTTP 200, 114,384 bytes |
| `https://www.gigs-news.uk/branded.htm` | same | HTTP 200, 264,098 bytes |

Raw capture: `data/raw/gigs-news-uk/2026-09-01/week-view-raw.html`, `branded-raw.html`. Parser: `parse.py` in the same directory.

**The curator rolled both pages.** Both md5 values changed against 2026-08-30.

| file | md5 (2026-09-01) | md5 (2026-08-30) |
|---|---|---|
| `week-view-raw.html` | `71fd000454e5d0701b176e32844e5267` | `b1c675e0840e0e33239d298ddfc9d9ef` |
| `branded-raw.html` | `dd2042b795135279b6300b08a4ebdd07` | `db98344ec98d320bbe819b5e50152e20` |

The header now reads `What's on This Week 2 - 6 September`. Today is Tuesday 2026-09-01, so every one of the five day blocks is future-dated.

`javascript_tool` was not used, so its three §6B output guards did not arise.

## 3. Horizon and the branded.htm forward list

The forward list is the header `gigs 2026` plus the **20 dated rows** that follow it contiguously. The next line is set-list prose. All three safeguards held: ordinal position, the lowercase-`gigs` against capitalised-`Gigs` distinction, and the day-name-against-date cross-check.

All 20 rows run 5 September to 31 December, inside the 12-month horizon. **All 20 are already in bndy** and every one carries a `gigs-news` externalId in the §6D slug form (`search_event(artistId: rwDw320gku5uQ4gzaU2N, 2026-09-01 to 2027-01-31)` returned exactly 20 events). Section 2 needed no create.

**A parsing correction is written into the new snapshot header.** The rule that ends the forward list must be "the first contiguous row that does not contain a month name and ` - `", not a weekday-date regex. The 2026-08-30 list contained the row `Friday/Saturday 14/15 August - looking for a venue / cancellation`, which a weekday regex truncates at. Today's list has no such row, so both rules give the same 20 rows, but the looser rule is the one the next run must reproduce.

## 4. Diff (§5.7)

**Mode: the spec declares neither `delta` nor `append-only`.** Already open as `gigs-news-mode-undeclared` (2026-08-12), not raised again. The run defaulted to **append-only** and removed nothing. The question is moot this run: every removed row on both sides is past-dated, and §5.7 states plainly that a row disappearing because its date passed is not a cancellation.

- **Section 1 (week view)**: 99 lines against 98. **62 added, 64 removed.** The whole 26 to 30 August week rolled off and the 2 to 6 September week replaced it. Every one of the 64 removed rows is dated 26 to 30 August, all in the past.
- **Section 2 (branded forward list)**: 27 rows against 20. **0 added, 7 removed.** All seven are past-dated:
  - `Saturday 1st August - Arden Arms Stockport SK1 2LX - branded`
  - `Saturday 8th August - Stockport Town Hall Tavern SK1 3SL - branded`
  - `Friday/Saturday 14/15 August - looking for a venue / cancellation`
  - `Sunday 16th August - Whittles Oldham OL1 1EA - 5pm Reserved`
  - `Wednesday 19th August - Eagle & Child Whitefield M45 7EY - Reserved`
  - `Saturday 22nd August - the Crown Heaton Moor SK4 4NZ - Reserved`
  - `Friday 28th August - Ashton Jubilee Club WN4 9SL - branded`
- **§5.7(a) self-diff gate**: the written snapshot re-diffed against a regeneration from the same capture returns **0 added / 0 removed**, 119 lines against 119, ordered identical. **PASS.** Artefact: `data/raw/gigs-news-uk/2026-09-01/selfdiff-snapshot.txt`.

**No §0.17 decision arose.** No future-dated row disappeared from either section.

## 5. The explicit cancellation — branded at Cheshire Cheese, 2026-09-20

The home page `gigs 2026` block carries this pair of lines, in this order, in the same block:

```
Sunday 20th September - Cheshire Cheese Newton SK14 4BH 5pm - Reserved
(cancelled - United match)
```

The marker is inside the same `<span>` run, immediately after the row, in `week-view-raw.html`. `branded.htm` still lists the row **without** the marker.

This is §5.4 row 1: an **explicit cancellation**, not a source drop. §0.17 does not apply and the append-only default does not block it, because hiding is not a removal.

- Event `d8546c64-bdd4-4cfd-9cce-e34a9be24fe0`, `branded (Reserved) @ Cheshire Cheese`, 2026-09-20 17:00, venue `18a2916a-59d1-4375-ad4d-1fa99e3a9dd8`.
- Not owner-managed. `isPublic` set to **false**. Not deleted, so the record is reversible and punters who saw it can learn it is off.
- Read back with `get_by_id`: `isPublic` is absent from the returned record, and a `search_event` on that venue across 5 to 21 September no longer returns it.
- **Tombstone appended** to `data/state/cancellations.jsonl` per §5.4, keyed on artist + venue + date. This is necessary and not decorative: `branded.htm` keeps publishing the row, so without the tombstone the next run re-offers a cancelled gig.

**Why this was not caught before.** The marker was already present in the 2026-08-30 capture. The spec excludes the home page sponsorship block from the snapshot, so no diff has ever seen it. This run read the block anyway, for exactly this reason. The exclusion is correct for import; it is wrong for cancellation detection. The new snapshot header records the marker so the omission is visible.

## 6. Week-view pipeline — every row, and what happened to it

96 gig-row lines were parsed across five day blocks. 22 were importable acts; 45 were rejected by the source filter; the rest are day headers, blank-act rows and duplicates.

### 6.1 Created (1)

| Event id | Title | Date | Time | Artist id | Venue id | externalId |
|---|---|---|---|---|---|---|
| `8f686331-3c07-4b1d-bfdc-5e970c2338f6` | Tony Auton Band Jam @ The Coach and Horses | 2026-09-03 | 20:00 **DEFAULTED** | `rT16iLy3u64bhZadG7SR` | `1efc325d-207c-4883-a18d-ff38a928df84` | `gigs-news:2026-09-03-tony-auton-coach-horses-oldham` |

- Source row: `Tony Auton band Jam - Coach & Horses Oldham`, under `Thursday 3rd September`.
- **§0.6 sanitisation**: the act is **Tony Auton**, not "Tony Auton band Jam". The spec's named-host jam rule keeps the full billing in the event title, which is what was written.
- **§1A / ADR-023**: matched the existing record `Tony Auton Band` (North West UK, Facebook page `156561484410270` on file) at 67%. A qualifier suffix in the same region is the same act, so no second record was made.
- **Defaulted time**: Thursday, no time in the source, server applied §5.6's 20:00 and returned `startTimeDefaulted: true`.
- Verified with `get_by_id` and again with `search_event`.

### 6.2 Titles corrected and externalIds added (2)

Both records were created on 2026-05-10 by a writer that left **the venue name in the title field and no externalIds at all**. Both are The Select Committee, both are live gigs in this week's listing, and both are §5.2 violations that render publicly.

| Event id | Old title | New title | Date | externalId written |
|---|---|---|---|---|
| `1c7e2809-17a5-4681-8ecf-f443f26ac374` | `The Crown, Heaton Moor` | `The Select Committee @ The Crown` | 2026-09-04 | `gigs-news:2026-09-04-select-committee-crown-heaton-moor` |
| `b5bc7d8c-3832-4ab2-a1cd-0f8ce2f2dfea` | `Church House, Sutton` | `The Select Committee @ Church House Sutton` | 2026-09-06 | `gigs-news:2026-09-06-select-committee-church-house-sutton` |

Both verified with `get_by_id` after the write. Neither is owner-managed. Times were left untouched: `b5bc7d8c` holds 21:00 on a Sunday where §5.6 would default to 19:00, but the source publishes no time for that row, so changing it would substitute one unevidenced value for another. Raised in §9.

### 6.3 Already in bndy, externalId back-filled (19)

A second writer, namespace **`gigs-news-daily-import`**, had already imported the whole week. Its rows are correct. They carried no id in the canonical `gigs-news` namespace, so this task could not find them by externalId and would re-derive them every run.

Each of the 19 was verified against today's capture, then written with **both** ids in one `edit_event` call, per the §6B rule that `externalIds` replaces the array. Ids from different sources coexist and both survived read-back.

| Event id | Act | Date | Venue id | `gigs-news` id written |
|---|---|---|---|---|
| `58408842-a21e-4609-91ea-b3b5a110a5a2` | the Power 3 | 2026-09-02 | `yO2hHYD6a41h48HDHqh1` | `2026-09-02-power-3-eagle-child-whitefield` |
| `0d0e8b47-6391-41bb-bd8c-238274e0dd53` | Shannon Mitchell | 2026-09-02 | `1efc325d-207c-4883-a18d-ff38a928df84` | `2026-09-02-shannon-mitchell-coach-horses-oldham` |
| `4f3c2355-1154-4237-8fc6-a4ebe9e634dc` | Roy Pimmy | 2026-09-03 | `6de33e51-114e-47b8-92d3-abccb4fe6bf6` | `2026-09-03-roy-pimmy-white-hart-woodley` |
| `ea25c516-3c02-4160-8b76-159d83b993eb` | the Tennessee Honeys | 2026-09-03 | `FXQKvDaexNQj53yl4icf` | `2026-09-03-tennessee-honeys-welcome-inn-whitefield` |
| `419a0c4f-1c53-4c13-8815-9333a908fd85` | Wasps | 2026-09-04 | `5399d41a-10a9-4064-b971-774fd096fdaf` | `2026-09-04-wasps-arden-arms-stockport` |
| `91391099-f0c1-4d5a-8050-bf02cd9b20d6` | Jess Evelyn | 2026-09-04 | `06c8fb91-59f6-4180-b97b-fbc2acd4322a` | `2026-09-04-jess-evelyn-albion-dukinfield` |
| `32e411c4-359a-43b2-94ac-7f098a65f401` | Muther Duckers | 2026-09-04 | `49bc4606-97d7-45a5-a693-a887ac2f0810` | `2026-09-04-muther-duckers-ashton-jubilee-club` |
| `602cd0e0-4c98-4f7a-8960-36e16b0aac83` | Guy Manrin | 2026-09-04 | `lwlZ1VKJskevDmYlc8V6` | `2026-09-04-guy-manrin-windsor-castle-marple-bridge` |
| `0a01ad1b-ecc8-4581-8280-f80142f64244` | Paul Waldron | 2026-09-04 | `EsXfxgxJTFkuRvaRLpS7` | `2026-09-04-paul-waldron-moor-club` |
| `0002a9f7-2d67-4504-8fb6-63d1533681e1` | the Riders | 2026-09-04 | `TdrtliunWD8ENVM9WGyg` | `2026-09-04-riders-buxton-working-mens-club` |
| `448c9ddc-018c-4487-b7fb-51d7742e096b` | Pierrepoint | 2026-09-05 | `5399d41a-10a9-4064-b971-774fd096fdaf` | `2026-09-05-pierrepoint-arden-arms-stockport` |
| `6013193a-59fc-4782-9848-7756851d79d3` | the Grey Numbers | 2026-09-05 | `xyERKljjDSlCFaYKMWPH` | `2026-09-05-grey-numbers-crown-heaton-moor` |
| `c853a31b-1785-4313-b3eb-7b64f7fd1feb` | Sod's Law | 2026-09-05 | `18a2916a-59d1-4375-ad4d-1fa99e3a9dd8` | `2026-09-05-sods-law-cheshire-cheese-newton` |
| `39050c24-441d-47b2-8170-b5e2cc4f3ea3` | WhiteHairs | 2026-09-05 | `1efc325d-207c-4883-a18d-ff38a928df84` | `2026-09-05-whitehairs-coach-horses-oldham` |
| `dcf03838-b409-4cce-b855-3be531b7be0e` | Full Tilt | 2026-09-05 | `qCk6zjFPCmz1E6I4G9oz` | `2026-09-05-full-tilt-bike-n-hound-hyde` |
| `21389bca-4df1-4db1-aea9-b7b9faa2e6c2` | Searchin | 2026-09-05 | `QWIBLMGTJIqiGnkk1kvU` | `2026-09-05-searchin-poynton-workmens-club` |
| `63a60c16-85e6-4be9-b8cf-1dfe56ce4a3c` | Steve Case | 2026-09-05 | `TdrtliunWD8ENVM9WGyg` | `2026-09-05-steve-case-buxton-working-mens-club` |
| `c2f08720-8dc0-498b-813d-502401618bd6` | Roadhouse Sinners | 2026-09-06 | `NwEtqexKQqLHyBcPVgJF` | `2026-09-06-roadhouse-sinners-railway-greenfield` |
| `39b05899-7228-49f6-b35c-b97ccb409c46` | Mustard County Band | 2026-09-06 | `xyERKljjDSlCFaYKMWPH` | `2026-09-06-mustard-county-band-crown-heaton-moor` |

**Read-back (§0.10).** Every one of the 22 writes was read back. `58408842` and `0d0e8b47` were confirmed with `get_by_external_id` on the new id, which proves both storage and resolution. The remaining 17 back-fills were confirmed with fresh `search_event` reads by venue and date, which returned both ids on each record. `8f686331`, `1c7e2809`, `b5bc7d8c` and `d8546c64` were confirmed with `get_by_id`.

### 6.4 Skipped, with the reason

| Source row | Day | Reason |
|---|---|---|
| `9th Sept Off the Record - Stockport Rock & Roll Society` | Wed 2 Sep | Future-date-prefix row, correctly parsed to 2026-09-09, artist `Off the Record` `ZBsvczPpYGAHbDdcHFfJ`. **No venue.** The three §3 probes all miss and the source gives only a Facebook group URL, no address. §0.8 forbids a venue without a Google Place ID and forbids guessing a town to get one. Already open as `gigs-news-rock-n-roll-society-no-address`. |
| `Reserved - Queens Hotel Macclesfield` | Fri 4 Sep | Date conflict, see §7. No sibling created. |
| `SunFest from 2pm - Rising Sun Hazel Grove` | Sat 5 Sep | A festival badge at a fixed pub, but **no act is named**. §0.27 imports the discrete gig only when an artist resolves; the reject filter forbids an unnamed "live bands" row. Venue is a real fixed building and would resolve; the artist does not exist on the page. |
| `Backwater Blues Jam - the Railway Greenfield` | Thu 3 Sep | Spec `event_skips.artist_names`, Jason HITL 2026-05-01. |
| `Jazz at the Railway - the Moor Club` | Sun 6 Sep | Spec: recurring jazz night, always skip. |
| `Jazz Night - the Moor Club` | Wed 2 Sep | Theme night, no performer named. |
| `bandeoke - the Crown Heaton Moor` | Thu 3 Sep | Non-artist event, same class as karaoke. |
| 8 open-mic rows | all days | `\bopen mic\b`, reject filter. |
| 5 karaoke rows | Fri, Sat, Sun | `\bkaraoke\b`, reject filter. |
| 2 football rows (`football 2pm`) | Sun 6 Sep | Not a gig. |
| 4 `live bands` / `bands` rows at Spinning Top | Wed, Thu, Fri, Sat, Sun | Generic multi-act, no names. Spinning Top is in `multi_act_venues`. |
| 21 blank-act rows (`- the Swan Inn Wilmslow` and similar) | all days | No act named. The venue already exists in bndy in every case. |
| 3 time-only rows (`8pm - The Crown Inn Stockport`, `10pm - Mash Guru Macclesfield`, `5pm - Whittles Oldham`) | Fri, Sat, Sun | No act named. |

## 7. Source date conflict — branded at the Queen's Hotel, Macclesfield

The same page states two different dates for one gig.

| Where | What it says |
|---|---|
| Week view, featured slot | `Reserved - Queens Hotel Macclesfield - Friday` |
| Week view, `Friday 4th September` block | `Reserved - Queens Hotel Macclesfield` (twice) |
| branded.htm forward list | `Saturday 5th September - the Queens Hotel Macclesfield SK11 6JW - Reserved` |
| Home page `gigs 2026` block | `Saturday 5th September - the Queens Hotel Macclesfield SK11 6JW - Reserved` |

bndy holds `07a9e82b-c44e-477a-9c1f-df0d3c6ce2b1`, `branded (Reserved) @ Queen's Hotel`, **2026-09-05**, with `gigs-news:2026-09-05-branded-reserved-queens-hotel-macclesfield`.

**Action: nothing changed, no sibling created.** §5.6b says the act's own page wins over a listing. `branded.htm` **is** the act's own page — it is Chris Statham's band page — and it says Saturday 5th, which is what bndy holds. The week view is the curator's listing of other people's gigs and it disagrees with itself against his own page. Two of the four statements say the 5th, including the authoritative one.

This is a real risk of a gig on the wrong date and it needs a human eye, so it is raised in `CTO-INBOX.md` as `gigs-news-queens-hotel-4th-vs-5th-sept`. A run does not resolve a date conflict where the same publisher contradicts himself.

## 8. Identity work

- **22 acts, 22 matches, 0 creates.** Every act in the week view already exists in bndy.
- **`Tony Auton band Jam`** matched `Tony Auton Band` `rT16iLy3u64bhZadG7SR` under ADR-023 (qualifier in the same region is the same act) after §0.6 stripping.
- **`WhiteHairs`** matched `The White Hairs` `48c8d194-3b31-4979-8251-f0d6284105a7` at 67%. The containment check (§1A.2) and a shared North West region settle it; the source drops the article and the space.
- **`the Grey Numbers`** matched `the Grey Numbers` `0107f0f5-b393-40dd-b0ce-19229c81feb7` at 75%, North West, Facebook `TheGreyNumbers`.
- **`Sod's Law`** matched at 89%. The apostrophe costs 11 points and would sit below a naive threshold. Region and Facebook page agree.
- **Two region mismatches were checked and both reused, not duplicated:**
  - `The Power 3` `61f18462-427d-46f5-94d5-ddb91fda04e4` is stored as Staffordshire UK. Its bndy event history is Queen's Hotel Macclesfield (2026-06-26, KLMA) and Eagle & Child Whitefield (2026-09-02). §1A.2 rule 3: the new gig's venue is already inside the existing footprint, so it is the same act. The stored location is stale, not wrong enough to touch — already open as `bv2a-firing0618z-power3-region-mismatch`.
  - `Full Tilt UK` `27c9a58d-881a-4837-8e21-3414e86cd207` is stored as Yorkshire. Its 2026-09-05 Bike 'N' Hound event already exists and was created by `gigs-news-daily-import`, so the same-act decision was taken before this run and this run did not reopen it. No second record was created.
- **`search_venue` apostrophe defeat, sixth instance.** `search_venue("Bike n Hound", "Hyde")` returns *no venues found*. The venue is `Bike 'N' Hound` `qCk6zjFPCmz1E6I4G9oz`, Hyde SK14 2EX, already carrying a `gigs-news-uk` externalId, and it surfaces only on the loose single-word probe at **29% low_confidence**. §3's three-probe rule caught it. Already open as `search-venue-apostrophe`, not raised again.

## 9. Items raised to CTO-INBOX.md

| FINGERPRINT | KIND | Why |
|---|---|---|
| `gigs-news-queens-hotel-4th-vs-5th-sept` | DATA | The source states Friday 4th in the week view and Saturday 5th on the band's own page. A live event may hold the wrong date. |
| `gigs-news-venue-named-event-titles-2026-05-10` | DATA | Two live events created 2026-05-10 held the venue name in the title field and no externalIds. Both corrected here; the writer is unattributed and may have left more. |

**Items deliberately NOT raised, because a fingerprint already exists:** `gigs-news-mode-undeclared`, `gigs-news-daily-import-second-namespace`, `search-venue-apostrophe`, `gigs-news-rock-n-roll-society-no-address`, `record-run-token-missing`, `bv2a-firing0618z-power3-region-mismatch`.

## 10. Caps and budget

- 50-create cap: **1 create used**. Not approached.
- Import horizon: week view held to today plus 14 days (the whole 2 to 6 September block qualifies); branded.htm forward list taken to the 12-month horizon.
- Claim TTL 90 minutes from 19:38:28Z. The run finished inside it.

## 11. `record_run`

Not called. `record_run` fails on a missing `SOURCE_RUNS_TOKEN` on every scheduled run. Already open as `record-run-token-missing`. `data/state/run-summary.jsonl` is the dashboard's real input and this run appended to it.

## 12. Artefacts written

| Path | What |
|---|---|
| `data/state/heartbeat/gigs-news-uk-2026-09-01T19-38-28Z.json` | Written first at 19:38:28Z, rewritten `completed` last. |
| `data/state/claims/gigs-news.json` | Acquired 19:38:28Z, released `heldBy: null` last. |
| `data/raw/gigs-news-uk/2026-09-01/week-view-raw.html` | Raw capture, 114,384 bytes. |
| `data/raw/gigs-news-uk/2026-09-01/branded-raw.html` | Raw capture, 264,098 bytes. |
| `data/raw/gigs-news-uk/2026-09-01/parse.py` | The parser, so the normalisation is reproducible. |
| `data/raw/gigs-news-uk/2026-09-01/selfdiff-snapshot.txt` | §5.7(a) gate result, 0/0. |
| `data/state/gigs-news-uk-last-page.txt` | New snapshot, 119 body lines, normalisation and section rules in its header. |
| `data/state/cancellations.jsonl` | One line appended for `d8546c64`. |
| `data/state/enrichment-evidence-2026-09-01-gigs-news-uk.jsonl` | Empty. No artist was created and no bio was written, so there is nothing to evidence. |
| `data/normalized/gigs-news-uk/2026-09-01/validator-records.json` | Empty record set fed to the validator. |
| `20-Daily/2026-09-01.md` | One line linking this report. |
| `CTO-INBOX.md` | Two lines appended. |
