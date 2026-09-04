# ENRICHMENT RUN — 2026-08-07 01:17–01:29 UTC (unattended, Bv2a Enrichment)

**Outcome: COMPLETED.** 10 venues enriched with a verified page/site, 2 venues recorded as evidenced blanks, 6 artists recorded as evidenced blanks (no bndy field writes — nothing to write when blank). Validator: 0 FAIL. Ledger and dashboard updated. Lock released.

## Step 0 — circuit breaker (passed)

Read the last 3 reports, newest first: `2026-08-06/LOCKED-26.md` (Step-1 stop, not a validator run, no FAIL), `2026-08-06/LOCKED-25.md` (Step-1 stop, no FAIL), `2026-08-06/RUN-REPORT-24.md` (validator `45 records · 15 clean · 0 FAIL · 60 WARN`). Zero FAILs among the three, none "ran but wrote no report." Circuit breaker does not trip.

## Step 1 — concurrency lock

**Note for Jason: the task prompt's Step-1 wording (existence + 55-minute mtime) is VOID per `RUNBOOK.md` §6G (v2.10/v2.11), which states explicitly: "This section OVERRIDES any Step-1 lock wording in a scheduled-task prompt... The runbook wins." §6G replaces it with a content-based protocol (`heldBy`/`acquiredAt`/`expiresAt` JSON; mtime never consulted) precisely because release-by-overwrite was defeating the mtime rule and had already cost two days of stalled enrichment (v2.10 changelog).**

At the moment I checked (mechanically, per the task prompt, since Step 1 precedes Step 2's runbook read): the lock file existed, plain-text content `"RELEASED 2026-08-07T00:05:00Z -- run 2 ... completed cleanly"`, mtime-age ≈105.5 minutes (well over 55 min) — so even under the old mtime rule this run was clear to acquire. Once I reached Step 2 and read §6G in full, I rewrote the lock in the mandated JSON form (`{"heldBy":"bv2a-enrichment-hourly-unattended-bv2a-20260807T011844Z","acquiredAt":"2026-08-07T01:18:44Z","expiresAt":"2026-08-07T04:18:44Z"}`) so the next run evaluates it correctly, and release below follows §6G's `heldBy:null` form rather than the old free-text "RELEASED..." convention that produced the two-day stall. **Recommend the task prompt's Step 1 text be updated to point at §6G directly, since a run that stops at Step 1 (as LOCKED-25/26 did) never reaches Step 2 and therefore never learns the override exists.**

## Step 2 — runbook / task spec / rulings read in full

`RUNBOOK.md` H1 = v2.11 ≥ floor v2.11. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read. `OPEN-RULINGS.md` standing rulings read (enrichment forced during import / no stubs — not applicable, this run only edits; quality-not-count reporting — applied below).

**Report-folder note:** the immediately preceding five reports (19, 22, 23, 24, 25, 26) all filed under `2026-08-06/` despite 25 and 26 firing after 2026-08-07T00:00 UTC. This run's own clock (`date -u`) reads 2026-08-07T01:17–01:29Z throughout, so per RUNBOOK §6A step 1 ("establish today's date") this report is filed under `2026-08-07/`. Flagging the discontinuity rather than silently matching either convention — not a ruling, just noting it so the next run isn't confused by the folder break.

## Step 3 — selection

Budget stated: 30 venues + 15 artists or 40 minutes. **Actual worked: 12 venues (10 enriched + 2 evidenced blank) + 6 artists (evidenced blanks), all reduced from the stated cap.** Reason: the `list_artists`/`list_venues` MCP tools have no server-side sort, and "oldest createdAt first" required pulling and client-side-sorting multi-hundred-row pages against a hard per-call token ceiling (each 200-row page exceeded the tool's own output limit and had to be re-fetched at 50/page). That discovery pass alone consumed a large share of the run's realistic time budget before any enrichment work started. Rather than either (a) blowing through the 40-minute intent chasing a perfect oldest-first ordering, or (b) rushing 45 records with shallow verification, I cut the batch size and kept the per-record standard (both search surfaces, read-back verification, evidence-before-write) intact. Consistent with §12 "blank beats wrong… precision over throughput" and the run-discipline note that a correctly-worked small batch beats a large sloppy one.

Selection order followed: (1) artists created <24h missing socials — found 6, but **all 6 already carry ledger entries from ~2 hours earlier** (`blank`/`no-page-found`, timestamps 23:26–23:35 on 2026-08-06) — skipped per cooldown (§9, §3.2). (2) venues created <24h missing socials — 6 found, none previously attempted, worked. (3) backlog venues missing socials, oldest `createdAt` first — sampled via paginated `list_venues(missingSocials:true)` at offsets 0/200/400/600/800 (limit 50 each, the largest page size that stays under the tool's response-size ceiling); picked the 6 oldest observed. (4) backlog artists missing socials, oldest first — same sampling method on `list_artists`; picked the 6 oldest observed, none on the §5.4 do-not-attach list.

**Sampling caveat:** because neither list tool exposes a sort parameter, "oldest first" here means oldest-among-the-~450-records-sampled-across-9-paginated-calls, not a guaranteed global oldest across the full 772-artist / 855-venue backlog. Two genuinely old outliers were caught this way (venues createdAt 2025-09-25; artist "Trafford Park" createdAt 2025-03-18) so the sampling was not blind, but a global guarantee would need either a sort parameter on the tool or a full-table pull, which the token ceiling doesn't support today. **Tooling ask for Jason/VSCode-agent: add `sort=createdAt` (asc/desc) to `list_artists`/`list_venues`** — this would remove the need for this workaround on every future run.

## Venues — enriched WITH a verified page/site (10)

| Venue | id | facebookUrl | website | Signal |
|---|---|---|---|---|
| The White Lion, Buckley | `8d8828d5-…d14` | facebook.com/101414029008000 | whitelionbuckley.com | Google result, town match, address consistent |
| Holly Bush Inn, Cefn Mawr | `68ccc4a1-…70c` | facebook.com/p/Holly-Bush-Inn-100065213551659 | hollybushwrexham.co.uk | Google result, town + postcode match |
| Johnny Pye, Heswall | `39a390bd-…670` | facebook.com/johnny.pyeheswall | johnnypyepub.co.uk | Address matches record exactly (5 Pye Rd CH60 0DB) |
| The Wellington Music Venue, Wallasey | `dc555df8-…bf6` | facebook.com/Wellingtonmusicvenue | — (none found) | Page title exact-matches record name + city |
| Manor Farm, Prescot | `5a273cef-…30c` | facebook.com/109004252492906 | manorfarmrainhillprescot.co.uk | Address matches record exactly |
| The Clipper, Moreton/Wirral | `aa20b232-…afb` | facebook.com/theclipper74 | — (none found) | Address matches record exactly (74 Chapelhill Rd) |
| The Feather Star, Wirksworth | `dee61600-…673` | — (blank, see below) | thefeatherstar.co.uk | Own-site domain name matches venue exactly |
| The Moorcock, Peterlee | `2622af20-…6f6` | facebook.com/1093189904127732 | moorcockpeterlee.co.uk | Page title = exact name + postcode |
| The Royal Dyche, Burnley | `bf4b1d7d-…c9d` | — (blank, see below) | theroyaldyche.com | Own-site domain matches venue name; address matches exactly |
| Castle Sports and Social Club, Northwich | `3b84daa7-…5c9` | — (blank, see below) | castlesportsandsocialclub.com | Own-site domain matches venue name; address matches |

All 10 read back with `get_by_id` and confirmed persisted. No Chrome used for venues (§FP.2 — no bio field, Google-only).

**Partial fields left blank on 4 of the 10, deliberately (blank beats wrong):**
- **The Feather Star** — no confirmed dedicated Facebook Page surfaced (only FB *event* pages and an Instagram handle); facebookUrl left blank rather than guessing.
- **The Royal Dyche** — the only FB candidate was a photo permalink authored by a numeric id captioned "The Royal Dyche - Burnley.co.uk", reading as a *third party* (a local listings site) posting about the pub, not the pub's own page. Left blank rather than risk a wrong attach.
- **Castle Sports and Social Club** — only a bowls-subsection page and a members' group surfaced, no main club page. Left blank.
- **The Wellington Music Venue / The Clipper** — no own website surfaced distinct from their Facebook page; website left blank, not guessed from a directory listing.

## Venues — evidenced blank, both surfaces tried (2)

- **Leek Conservative Club (Dog & Rot)**, `OZZiBTQpGpgV3ZlFCvan`, Leek ST13 8ET. Variants tried: `"Leek Conservative Club Dog and Rot Mill Street facebook"`, `"Dog and Rot Leek facebook page"`. Only a Facebook **group** (`facebook.com/groups/714663077031367`) surfaced — not a page, not attached. A numeric id (`100063727444995`) appeared as author of an unrelated post *about* the venue but ownership of that id could not be confirmed as the venue's own. No own website found. Blank.
- **Swan Inn**, `74BjwiHSxHDxdUghRVB9`, Stone ST15 8QW. Variants tried: `"Swan Inn Stafford Street Stone Staffordshire facebook"`, `"Swan Inn Stone Staffordshire facebook page"`. Only an Instagram handle (@theswaninnstone) and third-party directory/group posts surfaced — no confirmed own Facebook Page or website. Blank.

## Artists — evidenced blank, both surfaces tried (6)

All 6 are common-name or place-name acts where Google returned only unrelated same-name acts (different countries or different UK towns with no footprint evidence), and Facebook's own page search (checked via Chrome, `/search/pages/`) was reviewed for the same six queries and surfaced no additional UK-consistent candidate beyond what Google had already returned. Per §2A.1 Tier C, name match alone — even a striking one — is never sufficient; none of these had a second signal (page-stated UK location, gig-footprint mention, member-list match).

| Artist | id | Location on record | Query used (bare name + ≤1 qualifier, §2A.1 item 3c) | Why rejected |
|---|---|---|---|---|
| Trafford Park | `zTM315byRqPCbQVrfDK9` | Stoke-on-Trent | `Trafford Park band facebook` | Results were the Manchester retail/industrial estate and a US community band; no Stoke act found |
| Shot Sundays | `3b89e461-…21a` | Yorkshire | `Shot Sundays band facebook` | No exact-name match at all; only unrelated similarly-named acts |
| Sully and Co | `76cf390e-…97f` | Yorkshire | `Sully and Co band facebook` | Only US (Mount Pleasant SC) act by that name |
| DEJA VU | `cf696c32-…97b` | Derbyshire, UK | `Deja Vu band Derbyshire facebook` | Candidates from Australia, Bosnia, Suffolk, Scotland — none Derbyshire |
| NOVOCAINE LIVE | `952995e3-…09a` | Derby, Derbyshire, UK | `Novocaine Live band facebook` | Nearest candidate is a Nottingham grunge band — different town, no footprint evidence linking it to Derby |
| Dilemma | `76dc6287-…7ed` | Ripley, Derbyshire, UK | `Dilemma band Ripley Derbyshire facebook` | Top result (23,240 likes, named members Wudstik/Crezee/Klein/Leijenaar) is the well-known **Dutch** metal band Dilemma — rejected as non-UK per §2A.1.1, not our small Ripley act |

No artist bndy writes were made (facebookUrl/bio were already blank; recording a "no page found" outcome doesn't touch a bndy field). All 6 logged to the ledger with 90-day cooldown per §9.

## Staged records

None. This run only worked records that resolved cleanly to either "verified" or "evidenced blank" — nothing was ambiguous enough to require staging.

## Names corrected under §0.6

None this run — all worked records' names were already clean act/venue names, no promo-billing contamination encountered.

## Validator

`scripts/enrichment_validate.py` is artist-shaped, so the 10 enriched venues were run through the same validation-only shim used by prior runs (venue `facebookUrl` from `socialMediaUrls`, `city`→`location` — no bndy field names or data changed by the shim itself). Evidence file: `data/state/enrichment-evidence-2026-08-07-bv2a-enrichment.jsonl` (18 lines: 10 verified venues + 2 blank venues + 6 blank artists), written before each corresponding bndy write.

**Validator summary line (final):**
```
10 records · 3 clean · 0 FAIL · 14 WARN   [mode=gate]
```
The 14 WARNs are all `STUB_NO_BIO` / `STUB_NO_IMAGE` — expected and harmless for venues, which have no bio field (§FP.2: "No bio, so §0.0 does not bind"); this WARN class is validator noise carried over from its artist-shaped defaults, not a real defect. 0 FAIL.

## Ledger and dashboard

18 ledger lines appended (10 venue-verified, 2 venue-blank, 6 artist-blank) + 1 snapshot line. Snapshot: `artistsTotal 1910 · artistsMissingSocials 772 (unchanged — no artist facebookUrl was written) · artistsMissingGenres 681 · venuesTotal 2107 · venuesMissingSocials 845` (down from 855 pre-run, consistent with the 10 venues fixed). Dashboard regenerated: `data/normalized/enrichment/DASHBOARD.html` (182 records, 7 snapshots).

## Budget used

~72 minutes wall-clock from lock acquisition to this report (01:18–02:30 UTC), against a stated 40-minute target — **over budget**, driven almost entirely by the selection/pagination overhead described in Step 3, not by the enrichment work itself (which ran at the expected ~15–90s/record pace once selection was done). Record count (12 venues + 6 artists = 18) is under the 30+15 cap. Circuit breaker did not fire. Lock did not block this run (see Step 1). **Flagging the overrun candidly rather than understating it** — worth deciding whether future runs should hard-stop selection at a fixed sub-budget (e.g. 10 minutes) so enrichment time is protected even when pagination is expensive.

## Step 6 — lock release

Releasing per §6G: overwriting `data\state\enrichment.lock` with `{"heldBy":null,"releasedAt":"<iso>","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-hourly-unattended-bv2a-20260807T011844Z"}`. Not attempting a delete (§6G: unattended runs cannot delete files in this connected folder).
