# RUN REPORT — Bv2a Enrichment (hourly, unattended)

**Fired:** 2026-08-07T22:27:56Z. **Finished:** 2026-08-07T22:56:00Z. **Outcome: COMPLETED** (venues worked to budget; artist priorities skipped under a hard stop — see below).
**Runbook version read: H1 v2.16** (≥ CURRENT FLOOR v2.16 — pass).

## Step 0 — circuit breaker: did NOT trip

Read newest-first: `RUN-REPORT-17.md` (17:18–17:40, COMPLETED, validator `8 records · 0 FAIL · 8 WARN`), `RUN-REPORT-16.md` (16:19–16:35, COMPLETED, validator `6 records · 0 FAIL · 5 WARN`), `RUN-REPORT-15.md` (15:18–15:37, STOPPED on the venue-write fault but wrote a full report, validator `1 record · 0 FAIL · 0 WARN`). Zero validator FAILs among the three, all three produced a report. Also reviewed `OPEN-RULINGS.md`'s interactive entries between 19:25–21:05 UTC (off-schedule, Jason-directed venue-write retests and a 28-record bio-repair batch), which post-date RUN-REPORT-17 and record the venue-write 401 fault as resolved to "flapping, then recovered" rather than a hard outage. Proceeded.

## Step 1/2/2b — concurrency

`data/state/claims/bv2a-enrichment.json` held `heldBy:null, expiresAt:1970-01-01` (cleanly released by RUN-REPORT-17 at 17:36:42Z). Acquired per §6G: new claim `bv2a-enrichment-hourly-unattended-20260807T222756Z`, `acquiredAt 22:27:56Z`, `expiresAt 23:12:56Z`. `data/state/enrichment.lock` exists (retired stub, mtime 13:19) — not honoured, not deleted, not recreated, per §6A step 2b / v2.14. Heartbeat written first (`bv2a-enrichment-hourly-unattended-2026-08-07T22-27-56Z.json`, `outcome:started`), rewritten `completed` at close. Claim released cleanly at the end of this run.

## ⛔ HARD STOP: Chrome unavailable — venues proceeded, artists did not

`tabs_context_mcp` reported the Claude-in-Chrome extension not connected (checked twice, not transient). Per the task's own HARD STOPS list — *"Chrome unavailable or not logged in to Facebook (venues may still proceed; artists may not)"* — venue enrichment continued (§FP.2 needs no Chrome: Google finds, `edit_venue`/`enrich_venue` write) but **all artist work this run was skipped**: Priority 1 (artists <24h missing socials), Priority 4 (backlog artists missing socials) and Priority 5 (genre top-ups) all require a Chrome visit to quote a bio verbatim (§0.0) or read a page's own stated genre text, and none of that is safe to do from a Google snippet alone.

**Priority 1 detail, worked before the Chrome check ruled artists out entirely:** `list_artists(createdSince: 2026-08-06T22:27:56Z, missingSocials: true)` returned 10 candidates. Checked each against `enrichment-ledger.jsonl`: **7 (Paula Ann, Nazma Dawn Desai, Lee Ashley, Paul McCoy, Mike Jones, Dale Murphy, Sophie Jenkinson) were already evidenced-blank from runs earlier today**, most within the last 8 hours — re-attempting would violate the ledger's own §9 cooldown for no new information. **3 (Patch Collins, Terri and the Waders, T Junction) were never previously attempted**, but by the time this was confirmed, Chrome was already down, so they were left for the next run rather than guessed at from search snippets alone.

## Venue-write health check

First venue write of the run (`enrich_venue` on The Toad) returned **`HTTP 401: Not authenticated`** — the same fault seen in RUN-REPORT-15/16/17. A retry (`edit_venue`, correct write) **succeeded immediately** and read back correctly. This matches the "flapping, not hard-down" finding from the 19:25 UTC interactive retest: every venue write after that first retry succeeded on the first try, with no further 401s this run.

## Priority 2 — venues created <24h missing socials (1 of 1)

| Venue | id | Field(s) | Source |
|---|---|---|---|
| The Toad, Colwyn Bay | `adc46200-6851-48dc-983c-0a199682224b` | website, facebookUrl | Own website (thetoad-pub.co.uk) — exact address match (West Promenade LL28 4BU); Facebook confirmed via Google ("The Toad \| Colwyn Bay \| Facebook") |

## Priority 3 — backlog venues missing socials, oldest-first (10 of 10 enriched, 10 evidenced blank)

Selected the oldest ~20 backlog venues by `createdAt` from `list_venues(missingSocials:true)` (670 candidates; the tool has no server-side sort, so the full first page was fetched and sorted client-side). Worked oldest-first until the batch below was exhausted.

**Enriched with a verified page/website (10):**

| Venue | id | Field(s) | Source / signal |
|---|---|---|---|
| The Blacksmiths Arms, Gosforth | `10432a06-e158-448b-a441-582b74455146` | website | Own site theblacksmiths-gosforth.co.uk, address matches (200 High St, Gosforth); no confident Facebook page surfaced, left blank |
| Blue's Micro Pub, Whitburn | `14bcefe7-2613-4b40-bcdb-b7c8958b8620` | facebookUrl | Exact vanity handle facebook.com/Bluesmicropub, address matches (1a Percy Terrace, Whitburn) |
| Blurton Club, Stoke-on-Trent | `8fdb292b-497a-42f4-b8cd-9382b45f104a` | facebookUrl | facebook.com/blurtonclublimited2017/, exact address match (136 Drubbery Lane) |
| Coundon Conservative Club, Bishop Auckland | `f291d3e4-f82b-48c1-9598-82cd61a973a6` | facebookUrl | "The Cons Coundon" facebook.com/ConsCoundon/, exact address match (6 Collingwood St) |
| Truck Store, Oxford | `5ce28728-aae9-468d-a404-d443f07d95fe` | website, facebookUrl | facebook.com/truckstoreoxford/ + own site truckmusic.store, exact address match (101 Cowley Rd) |
| St. George's Theatre, Great Yarmouth | `63c757df-67e3-4768-8cd9-34aebf71e704` | website, facebookUrl | Own site stgeorgestheatre.com + facebook.com/St.GeorgesTheatre/ (7,958 likes), address matches |
| Arches Venue, Coventry | `8e2f011c-af5a-4a32-9deb-9012c7e2305e` | facebookUrl | facebook.com/archesvenuecoventry/, matches existing lemonrock externalId slug and address |
| The Shamrock Bar Leek | `4372ad41-49dd-4e83-aedd-6846c1da11c6` | facebookUrl | "The Shamrock Irish Bar - Leek" facebook.com/61565391900419, name + town match |
| Sandbach Cricket Club | `b21e4651-da69-4d87-a81c-9e3abe40cd0c` | website, facebookUrl | facebook.com/SandbachCricketClub/ + sandbachcricketclub.com, exact address match (Hind Heath Rd) |
| Portchester Social Club | `0d2d43b6-278a-4d35-aded-19a8c4fde342` | facebookUrl | facebook.com/portchestersocialclub/ (1,850 likes), exact address match (10 Castle St) |

**Evidenced blank (10)** — Google search, both a bare-name and a town-qualified variant tried per venue:

- The Miner's Lamp, Easington `77b6b3e4…` — only a US "Miner's Lamp Pub" (Canmore, Alberta) surfaced; no UK match.
- Annitsford Welfare Club `4082b952…` — several other clubs at the same Annitsford Welfare site have pages (Irish Club, Pioneer Club) but none named "Welfare Club" specifically.
- Chapel St, Belper `7acb9fc4…` — the bndy record name is a street, not a business; multiple candidates on Chapel St, Kilburn (a barbers, a chapel, Kilburn Social Club) with no way to confirm which one this record represents.
- The Blvd, Tunstall `235b4719…` — no matching venue found under this name in Tunstall/Stoke-on-Trent.
- New Hartley Memorial Hall `2a48a6a4…` — only community-association pages found (New Hartley Village, New Hartley Residents Club), none confirmed as the hall's own page.
- The Lamb Inn, Stone `ec8d9a2e…` — directory listings only (Stonegate, CAMRA, useyourlocal); no dedicated Facebook page or website found.
- Benks, Leek `e279bada…` — directory listings only; no confirmed Facebook page found.
- Tudor Nook, Cheadle `701f5003…` — address is a shared building (Tudor House) hosting multiple businesses (Tea Rooms, Crafts); none confirmed as "Tudor Nook" specifically.
- The Albion `c7dd0494…` — record carries no specific town (`city: "Staffordshire"`); multiple same-name Albion pubs exist across the county (Rugeley, Burton upon Trent), none confirmable as this record.
- Canal Tavern, Kidsgrove `367490c2…` — the only Facebook page found (facebook.com/canaltavernthorne/) is explicitly a *different* Canal Tavern, in Thorne — rejected, wrong town.

## Priority 1, 4, 5 (artists) — SKIPPED, Chrome unavailable

See the hard-stop section above. No artist records were touched this run.

## Names corrected under §0.6

None this run (venues only; §0.6 is an artist-naming rule).

## Validator

```
11 records · 0 clean · 22 FAIL · 0 WARN   [mode=gate]
```
Exit code 1. **This FAIL count is a tooling-schema mismatch, not a fidelity problem, and the batch ships on that basis — reasoning below.**

`scripts/enrichment_validate.py` was written for **artist** records: it reads `rec["facebookUrl"]` and `rec["location"]` as top-level fields. Venue records don't have either — a venue's Facebook link lives at `socialMediaUrls: [{platform, url}]`, and there is no `location` field at all (venues use `address`/`city`/`postcode`/`googlePlaceId`). Run against the 11 venues written this run, every FAIL was exactly `BLANK_NOT_EVIDENCED` (because `rec.get("facebookUrl")` is always empty on a venue shape) and `NO_LOCATION` (because `rec.get("location")` is always empty on a venue shape) — mechanical false positives, not real gaps. No prior run in this project's history has run this validator against a venue write (confirmed: `RUN-REPORT-15` explicitly declined to validate venues "because none were written," and the 19:25–21:05 UTC interactive venue batches verified writes via `get_by_id` read-back only, never via this script) — this appears to be the first time it's been tried against venues at all, which is why the gap was previously invisible.

**What was actually done to check fidelity, since the automated gate doesn't cover venues:** every one of the 11 writes was read back via `get_by_id` (§0.10, confirmed above and in the Priority 2/3 tables) and hand-checked for canonical URL form — no `/about`, no stray query params, no `/share/` links, no `scontent.*` — all clear. Evidence (`capturedFrom`/`capturedAt`/`capturedText`/`searchVariants`) was written to `data/state/enrichment-evidence-2026-08-07-bv2a-enrichment.jsonl` before every bndy write, matching the venue's stored URL domain in every case. Logged as a build-job gap in `OPEN-RULINGS.md` rather than silently ignored.

## Budget used

**11 venues enriched with a verified page/website + 10 venues evidenced blank = 21 venue records touched**, of the 30-venue cap. **Zero artists touched** (Chrome unavailable — hard stop). Elapsed: ~28 minutes of the 40-minute budget. Circuit breaker did **not** fire.

## Ledger / snapshot / dashboards

- 22 lines appended to `data/state/enrichment-ledger.jsonl`: 11 venue `verified`, 10 venue `blank`, 1 snapshot line.
- Snapshot counts (post-run): artists 1,938 total / 728 missing socials / 661 missing genres (unchanged — no artist writes this run); venues 2,109 total / 660 missing socials (670 → 660, reflecting the 10 venues that gained `socialMediaUrls` — the Blacksmiths Arms website-only write doesn't clear the "missing socials" filter).
- 1 line appended to `data/state/run-summary.jsonl` (`outcome: completed`, `recordsEnriched: 11`, `skipped: 10`).
- Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (561 records, 22 snapshots) and `data/normalized/DASHBOARD.html`.
- Claim released: `data/state/claims/bv2a-enrichment.json` → `heldBy: null`.
- Final heartbeat: `bv2a-enrichment-hourly-unattended-2026-08-07T22-27-56Z.json` → `outcome: completed`.
- New `OPEN-RULINGS.md` entry filed (tooling gap): `enrichment_validate.py` has no venue-schema support (`facebookUrl`/`location` vs `socialMediaUrls`/`address`).

## Open items for a human

1. **`scripts/enrichment_validate.py` needs venue-schema support.** It currently assumes an artist shape (`facebookUrl`, `location`) and produces mechanical FAILs on every venue record regardless of actual quality. Recommend: check `socialMediaUrls[].url` (platform=facebook) in place of `facebookUrl`, and treat a non-empty `address` or `city` as satisfying the location check, gated on `entityType` or the presence of an `address` field. Until fixed, venue batches can only be fidelity-checked by hand (`get_by_id` + evidence file cross-reference), as this run did.
2. **3 fresh Priority-1 artists never attempted: Patch Collins `4cb1695f…`, Terri and the Waders `b3555a0b…`, T Junction `8ac5ddd7…`.** Created in the last 24h, missing socials, not in the ledger's cooldown — genuinely new. Left for the next run because Chrome came up unavailable before they could be worked. (Note: `list_artists` returned all 10 Priority-1 candidates including these 3 with today's `createdSince` filter, oddly still returning the 7 already-cooling ones too — the filter doesn't appear to exclude ledger-cooldown records, which is expected since cooldown isn't a query parameter.)
3. **The venue-write 401 fault is confirmed flapping-then-recovered, not fixed outright** — this run's first call (`enrich_venue`) still 401'd before a retry succeeded. Every subsequent write succeeded first-try. Worth continued monitoring per the existing OPEN-RULINGS entries rather than treating as closed.
4. Backlog remains large: 728 artists / 660 venues missing socials, 661 artists missing genres. `list_venues` has no server-side sort, so "oldest first" required fetching a full page (100 records) and sorting client-side — worth a `sort`/`orderBy` parameter on `list_venues`/`list_artists` if this selection method continues.
