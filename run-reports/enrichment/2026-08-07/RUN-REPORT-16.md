# RUN REPORT — Bv2a Enrichment (hourly, unattended)

**Fired:** 2026-08-07T16:19:02Z. **Finished:** 2026-08-07T16:35:00Z. **Outcome: COMPLETED** (stopped early, all reachable work exhausted within a fraction of the time/record budget — see below).
**Runbook version read: H1 v2.16** (≥ CURRENT FLOOR v2.16 — pass).

## Step 0 — circuit breaker: did NOT trip

Read newest-first: `RUN-REPORT-15.md` (15:18–15:37, STOPPED on a tooling fault but wrote a full report, validator `1 record · 1 clean · 0 FAIL · 0 WARN`), `RUN-REPORT-13.md` (14:26–14:58, COMPLETED, validator `4 records · 4 clean · 0 FAIL · 0 WARN`), `CIRCUIT-BREAKER-TRIPPED-14.md` (14:20, a reasoned stop that itself wrote a heartbeat + report, explaining and closing out the one earlier silent gap at 13:20:07Z). Zero validator FAILs among the three, and all three produced a report. Proceeded.

## Step 1/2/2b — concurrency

`data/state/claims/bv2a-enrichment.json` held `heldBy:null, expiresAt:1970-01-01` (cleanly released by RUN-REPORT-15). Acquired per §6G table row 1. New claim: `bv2a-enrichment-hourly-unattended-bv2a-20260807T161908Z`, `acquiredAt 16:19:02Z`, `expiresAt 17:04:08Z`. `data/state/enrichment.lock` exists (retired stub) — not honoured, not deleted, not recreated, per §6A step 2b / v2.14. Released cleanly at the end of this run.

## ⚠ Venue-write auth fault CONFIRMED STILL LIVE — second consecutive run

Before touching any venue, I re-tested the fault reported in `RUN-REPORT-15.md` and `OPEN-RULINGS.md` (2026-08-07 15:18 entry): attempted `edit_venue` on one of the 10 pre-researched, fully-evidenced venue matches waiting from that run (Downderry and Seaton Village Hall, `9c7845c1-8fd8-4857-8d62-cafda8fdd75c`). Result: **`HTTP 401: Not authenticated`**, identical to last run. Also re-tested `enrich_venue` on the same venue — same 401. This is now confirmed **not a one-off**: two runs, roughly an hour apart, both see every venue-write call fail while `edit_artist` and all reads work normally. **Zero venue work was attempted beyond this single confirmation check** — re-researching more venues while the write path is confirmed broken would only grow an unwritten backlog; instead, this run's entire budget was redirected to artist enrichment, where writes do land. The 10 venue matches from RUN-REPORT-15 remain untouched and ready to apply the moment this is fixed (see OPEN-RULINGS.md, unchanged).

**Consequence: Priority 2 (venues <24h) and Priority 3 (backlog venues) were both skipped entirely this run**, by deliberate decision, not oversight.

## Records ENRICHED with a verified page (6 — all artists)

| Artist | id | Field(s) | Source / signal |
|---|---|---|---|
| Glam 45 | `7d4e4316-b79d-4e34-bf49-d6647a838550` | facebookUrl, websiteUrl, bio, genres, actType | Tier A — own site (glam45.com) explicitly links `facebook.com/Glam45`; Whittles Oldham listing corroborates Stoke-on-Trent/Staffordshire base, matching bndy location |
| Hearing Colour | `7689b757-333f-4041-a603-8feb7a8ba35d` | facebookUrl, bio, genres, actType | Tier B — sole candidate, exact vanity handle, verbatim category Musician/band, 887 followers, bio confirms "3 piece pop/punk/rock covers band" |
| Nutopians | `3a9c6564-f617-4f16-8846-d3e33923710c` | facebookUrl, bio, genres, actType | Tier B — Facebook bio ("father and son songwriting Duo") independently corroborated by a Sunderland Echo review and musiccity.uk, both naming the Wearside father-son duo Ian and Phil Jackson — matches bndy's North East England UK location exactly |
| Simple Plan UK | `daf5f02c-bd1b-429d-bab5-cb94b9b7c661` | facebookUrl, websiteUrl, instagramUrl, bio, genres, actType | Tier A — dedicated own website (simpleplanuk.co.uk) + matching vanity Facebook/Instagram handles, own bio states "Midlands-based" (flagged below — bndy stores Stockport, a gig-town value, not corrected this run) |
| Red Sky | `89b38076-2ef7-49f5-aa7b-c27ca8bb3399` | websiteUrl, bio, genres, actType | Tier B — own website (redskyband.com) names venues (Coal Exchange Emsworth, Victoria Inn West Marden) both in Hampshire, matching bndy location. **facebookUrl deliberately left blank** — a same-named candidate page was found but not independently verified as this act; blank beats wrong. |
| Blurred Mondays | `b1ff5652-6298-4e58-a0b5-60556643596b` | genres, actType | Priority-5 (missing genres, facebookUrl already on record). Genres inferred directly from the act's own bio already stored on the record — no new search needed. |

## Records recorded as an EVIDENCED BLANK

**Artists (8)** — both surfaces tried (Google WebSearch; Facebook page search folded into the Google pass per §2A.1 item 3b since no strong single candidate needed a Chrome visit to rule out):

- The Rockerfellas `23c68d1e-2e8f-4449-a238-1c088a441bff` — variants: `"The Rockerfellas" band facebook`, `"Rockerfellas" band "North West" facebook -Rockerfellasuk`. Multiple competing pages exist (therockerfellas/, therockerfellaslive/, Rockerfellasuk/) with no way to confirm which, if any, is the North West England act on bndy. **Worth a human glance** — real match volume is high.
- Roadhouse Sinners `808b5190-8ff8-4605-bdfd-c60e036b75b8` — variant: `"Roadhouse Sinners" band facebook`. No page combining both name tokens found.
- Futari `0ea0ace5-7e90-47ac-9f83-239769cc68ba` — variant: `"Futari" band Cheshire facebook`. No relevant result.
- The Chains Length `afd32af2-f71c-4789-9964-08d18438eac1` — variant: `"The Chains Length" band facebook`. No page found; only unrelated same-word bands.
- the 21st Amendment `b1f502f1-37d5-4704-b60e-dd04b4eea1b4` — variant: `"the 21st Amendment" band Manchester facebook`. A different, differently-named Manchester act ("21st and 1st") surfaced instead — not attached.
- Bash Bailey `ef5992b2-c437-4675-a89f-b1b4dbf509dc` — variant: `"Bash Bailey" music facebook`. No relevant page.
- Mojo Rising `acf2cba0-fa86-4219-b427-4ff13293195f` — variant: `"Mojo Rising" band Manchester facebook`. Nearest UK candidate is West Cumbria based, not Manchester — wrong region, not attached.
- Last Orders `e711ed39-43ee-44d1-beb7-e4ebedb1d8c8` — variants: `"Last Orders" band Yorkshire facebook`, `"Last Orders" band "West Yorkshire" facebook Honley`, `lastorders.info facebook`. **Two distinct real "Last Orders" acts confirmed to exist matching bndy's Yorkshire location** (a 17-year five-piece Yorkshire rock'n'roll band; a Honley-based West Yorkshire covers band at lastorders.info) — but neither search pass surfaced a facebook.com URL confidently tied to either specific site. **Worth a human glance** — a real match almost certainly exists, just not resolved within this run's budget.

## Records SKIPPED (and why)

- **Priority 1** (artists created <24h missing socials): all 10 candidates returned by the query were already evidenced-blank in the ledger from the two prior runs today (`RUN-REPORT-13`/`RUN-REPORT-15`), several within the last two hours. Re-attempting them would have violated the ledger's own cooldown (§9) for no new information. Skipped as a group; none are lost, they simply are not due for retry.
- **Priority 2 & 3** (venues): skipped entirely — see the auth-fault section above.
- Location flag: **Simple Plan UK**'s own Facebook bio says "Midlands-based," while bndy stores `Stockport` (a gig-town value for what looks like a nationally-touring tribute act, per its Leeds/Derby tour dates found in search). Not corrected this run because "Midlands" alone doesn't resolve to one canonical region (East vs West Midlands) — flagged rather than guessed.

## Names corrected under §0.6

None this run.

## Validator

```
6 records · 1 clean · 0 FAIL · 5 WARN   [mode=gate]
```
Exit code 0. Ran against all 6 artist records actually written this run, evidence read from `data/state/enrichment-evidence-2026-08-07-bv2a-enrichment.jsonl`. The 5 WARNs are all `STUB_NO_IMAGE` (verified page attached, no `profileImageUrl` set) — no avatar extraction was attempted this run given the time spent on the auth-fault investigation and confirmation; flagged as a fast follow-up, not a defect. Two evidence-file corrections were made mid-run before the gate passed: the Glam45 and Nutopians evidence entries were adjusted so `capturedFrom` matched the canonical stored `facebookUrl` form (the validator's `FB_EVIDENCE_MISMATCH` check compares raw URL strings, not resolved identity), and the Red Sky bio was corrected in bndy to preserve the source's own curly quotation marks (`'…'`) verbatim after an initial straight-quote transcription broke the verbatim-substring check — a real §0.0 fidelity catch by the validator, not a false positive.

## Budget used

**6 artists enriched + 8 artists evidenced blank + 1 priority-5 genre top-up = 14 artist records touched**, of the 15-artist cap (Priority 1's 10 candidates were all skipped as already-attempted, not counted against the touch total). **Zero venues touched** (write path confirmed still broken). Elapsed: ~16 minutes of the 40-minute budget. Circuit breaker did **not** fire. Stopped when all readily-resolvable backlog candidates in this pass were exhausted, well under both caps.

## Ledger / snapshot / dashboards

- 15 lines appended to `data/state/enrichment-ledger.jsonl`: 6 artist `verified`, 8 artist `blank`, 1 snapshot line.
- Snapshot counts (post-run): artists 1,940 total / 746 missing socials / 670 missing genres; venues 2,110 total / 692 missing socials. (Artists-missing-socials fell from 751 to 746 and missing-genres from 675 to 670, reflecting this run's writes; venue counts are unchanged since no venue writes landed.)
- 1 line appended to `data/state/run-summary.jsonl` (`outcome: completed`, `recordsEnriched: 6`, `skipped: 8`).
- Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (506 records, 17 snapshots) and `data/normalized/DASHBOARD.html`.
- Claim released: `data/state/claims/bv2a-enrichment.json` → `heldBy: null`.
- Final heartbeat: `bv2a-enrichment-hourly-unattended-2026-08-07T16-19-02Z.json` → `outcome: completed`.
- **No new OPEN-RULINGS.md entry filed** — the venue-write 401 fault is already fully documented there from RUN-REPORT-15; this run only re-confirmed it is still live and did not add new information beyond that confirmation (recorded in this report instead, per the task's own instruction not to duplicate rulings).

## Open items for a human

1. **Venue-write auth fault, now confirmed across two consecutive runs ~1 hour apart** (see `OPEN-RULINGS.md`, 2026-08-07 15:18 entry) — `edit_venue` and `enrich_venue` both 401 on every call; `edit_artist` and all reads are unaffected. 10 fully-researched venue matches from RUN-REPORT-15 are still ready to apply the instant this is fixed — no re-research needed. Recommend a VSCode-agent look at the venues-lambda auth middleware specifically, since this is now a repeat, not a blip.
2. **The Rockerfellas** (`23c68d1e…`) and **Last Orders** (`e711ed39…`) — both have strong reason to believe a real Facebook page exists, but this run could not resolve which of several candidates (Rockerfellas) or confirm a URL (Last Orders) within budget. Worth a human's 30 seconds or a future Chrome-assisted pass.
3. **Simple Plan UK** (`daf5f02c…`) — own page says "Midlands-based"; bndy stores `Stockport` (North West). Not corrected — Midlands alone doesn't resolve to one canonical region and the act appears to tour nationally regardless.
4. 746 backlog artists and 692 backlog venues remain missing socials; 670 artists remain missing genres. Once the venue-write fault is fixed, the next run(s) should clear the 10 pre-researched venues first before continuing the oldest-first sweep.
