# RUN REPORT — Bv2a Enrichment (hourly, unattended)

**Fired:** 2026-08-07T15:18:51Z. **Finished:** 2026-08-07T15:37:00Z. **Outcome: STOPPED** — not a clean completion. All venue writes were blocked by a tooling fault discovered mid-run (see below); artist work proceeded to a natural stopping point within budget.
**Runbook version read: H1 v2.16** (≥ CURRENT FLOOR v2.16 — pass).

## Step 0 — circuit breaker: did NOT trip

Read newest-first: `RUN-REPORT-13.md` (14:26–14:58, COMPLETED, validator `4 records · 4 clean · 0 FAIL · 0 WARN`), `CIRCUIT-BREAKER-TRIPPED-14.md` (14:20, a reasoned stop that itself wrote a heartbeat + report — not a silent "ran but wrote no report" case; it explains and closes out the one earlier silent gap at 13:20:07Z), `RUN-REPORT-12.md` (COMPLETED, validator `8 records · 0 FAIL · 9 WARN`). Zero validator FAILs among the three, all three produced a report. Independently re-checked `data/state/heartbeat/` for any `outcome:started` firing newer than RUN-REPORT-13's final heartbeat (14:26:32Z, outcome `completed`) — none found. Proceeded.

## Step 1/2/2b — concurrency

`data/state/claims/bv2a-enrichment.json` held `heldBy:null, expiresAt:1970-01-01` (cleanly released by the prior run) — acquired per §6G table row 1. New claim: `bv2a-enrichment-hourly-unattended-bv2a-20260807T151851Z`, `acquiredAt 15:18:51Z`, `expiresAt 16:03:51Z`. `data/state/enrichment.lock` exists (retired stub, written 13:19) — not honoured, not deleted, not recreated, per §6A step 2b / v2.14. Released cleanly at the end of this run.

## ⚠ Tooling fault found mid-run — THIS IS WHY THE RUN STOPPED EARLY

After completing full research (Google + Facebook page search, per §FP/§2A.1 item 3b) on 10 backlog venues with confidently-matched Facebook pages and/or websites (all exact address matches), **every `edit_venue` call returned `HTTP 401: Not authenticated`**, and so did `enrich_venue` on the same venue. Retried on 3 different venue ids, twice each — identical result every time. In the same window, `edit_artist` on `9778ce9e-…` (Grace Curran) **succeeded immediately**, and every read call (`get_by_id`, `list_venues`, `list_artists`, `search_venue`) worked normally throughout the run. This is isolated to the venue-write endpoints, not a session-wide auth failure. Filed in full, with all 10 candidate matches so they can be applied without re-research, in `OPEN-RULINGS.md` under "Appended by the bv2a-enrichment-hourly-unattended scheduled run, 2026-08-07 15:18–15:37 UTC".

**Zero venues were written to bndy this run**, despite 10 being fully researched and evidenced. Per §0.10 (never trust a write without reading it back) every one of the 10 was confirmed still blank via the `edit_venue` error response itself (no success claimed) and would have been re-confirmed via `get_by_id` had the writes gone through.

## Records ENRICHED with a verified page (0 new — 1 re-verified)

| Artist | id | Field(s) | Note |
|---|---|---|---|
| Grace Curran | `9778ce9e-3ba0-49ca-9f2b-60624c140c99` | instagramUrl | Already set by the 14:47 run this same day; `edit_artist` call succeeded (confirming artist-write path is healthy) but wrote no new value — read back unchanged. Not a new enrichment, listed only as the write-path health check. |

## Venues found with a verified match, but NOT written (blocked by the 401 fault above)

All 10 fully evidenced in `data/state/enrichment-evidence-2026-08-07-bv2a-enrichment.jsonl` (~15:24 UTC) and in `OPEN-RULINGS.md`, ready for immediate application once the write path is fixed:

| Venue | id | Field(s) found | Source of match |
|---|---|---|---|
| Downderry and Seaton Village Hall | `9c7845c1-8fd8-4857-8d62-cafda8fdd75c` | facebookUrl (group), website | Google — name + address match |
| The Beehive Inn, Yeovil | `3450464e-0c08-4364-a5a3-4e18e0fd014c` | facebookUrl, website | Google — exact address match (112 Huish) |
| Christchurch Conservative Club | `aa8df727-b4bc-44c4-a2a3-f12773aa65f6` | website | Google — exact address match (18 Bargates) |
| The Mermaid, Sherborne | `426fcc7a-ad34-4a3f-900c-bddb2e109411` | facebookUrl, website | Google — postcode match (DT9 4JD, §0.24) |
| St Mawes Hotel & Restaurant | `88f3c067-e5c2-43ac-afac-381c381d2ac2` | facebookUrl, website | Google — exact address match |
| The Burton, Brixham | `7c707727-a299-4881-8e9f-564967dfb643` | facebookUrl, website | Google — exact address match (23 Burton St) |
| The Esplanade Club, Watchet | `e2c50742-a7b9-4328-9317-9e17c335a761` | facebookUrl, website | Google — exact address match (5 The Esplanade) |
| Blue Peter Inn, Polperro | `2d2336bb-6bf5-43f9-83a5-e07d6ec7cd13` | website only | Google — website confident; two competing FB page ids, left blank per blank-beats-wrong |
| Seale Arms, Dartmouth | `b665dd5f-b58e-4875-a8aa-19d758a0b474` | facebookUrl | Google — exact address match (10 Victoria Rd) |
| The Devon & Cornwall, Millbrook | `4500a19d-6ddc-4e56-b788-906fcd7e4402` | facebookUrl | Google — exact address match (1 West St) |

## Records recorded as an EVIDENCED BLANK

**Venues (2)** — Google only, per §FP.2:
- Parc Trenance `8bea377f…` — variant: `"Parc Trenance" Padstow facebook`. Holiday-park address hosting several distinct businesses; no single one uniquely matches the bndy record.
- The Den, Teignmouth `4cbc8307…` — variant: `"The Den" Teignmouth Promenade facebook`. An open park/promenade, not a bookable venue with its own page — likely a source mis-parse of a park as a gig venue.

**Artists (13)** — both surfaces tried (Google WebSearch + Facebook page search via Chrome, logged in), per §2A.1 item 3b:
- Paula Ann `a4ce8576…` — Google surfaced an entertainersworldwide.com listing (Bromborough, North West England) with no attributable social link; the only exact-name Facebook profile is a non-UK personal profile (Austin, TX) — rejected per §2A.1.1. Blank.
- Nazma Dawn Desai `bf8a8379…`, Lee Ashley `712657fc…` — no relevant result on either surface. Blank.
- Paul McCoy `da16486f…` — common name, dominated by the real US singer (12 Stones); no UK page found. Blank, do-not-attach risk noted.
- Mike Jones `c062411f…` — near-miss: "Mike Jones Music" (Musician/band, "Duo/Trio/Full band available", 1.4K followers) visited directly — no location field, no posts, no gig-footprint evidence. Tier C (name+format alone), not attached. **Worth a human glance.**
- Dale Murphy `20bc1aab…` — dominated by the US baseball player and an unrelated duo (Murphy Ridge, no Manchester link stated). Blank.
- Sophie Jenkinson `a0bb6738…` — only a LinkedIn profile, no FB act page. Blank.
- Shot Sundays `3b89e461…`, Retro Knights `284ad523…` — no relevant result on either surface. Blank.
- The House Katz `16ed5a04…` — exact-name FB pages exist but are non-UK (Mississippi, Philadelphia) — rejected per §2A.1.1. Blank.
- Mix 'N' Match `167d9aa4…` — exact-name FB page is in the Philippines — rejected. Blank.
- Hero's of Rock `d6d159d9…` — near-miss "Heroes of ROCK" tribute page found via Google but its UK/Hampshire location was never confirmed (Facebook search's closest name match is a Swedish act); left blank rather than risk a wrong country. **Worth a human glance.**
- Higgi's Band `9a384287…` — only a same-surname solo DnB producer found (format mismatch: solo electronic ≠ band). Blank.

## Records SKIPPED (budget/time, not attempted this run)

None of the priority-1 or priority-4 candidates worked this run were skipped for budget reasons — all reached a definitive outcome (verified-but-blocked, or evidenced blank). Priority-2 (venues created <24h missing socials) returned 0 candidates. Priority-5 (artists missing genres with facebookUrl) was not reached — the run's remaining time went to the venue write-fault investigation and documentation instead. 741 backlog venues and 738 backlog artists remain missing socials beyond what this run touched.

## Names corrected under §0.6

None this run.

## Validator

```
1 records · 1 clean · 0 FAIL · 0 WARN   [mode=gate]
```
Exit code 0. Ran against the one artist record actually touched (Grace Curran) with evidence read from `data/state/enrichment-evidence-2026-08-07-bv2a-enrichment.jsonl`. No venue records were validated because none were written — validating a write that didn't happen would be meaningless. The 10 blocked venue matches are documented as evidence only, not as bndy state.

## Budget used

Artist research: 13 attempted (7 priority-1 + 6 backlog), all reached a definitive blank outcome. Venue research: 12 attempted (10 verified-but-blocked + 2 evidenced blank). Well under the 30-venue/15-artist cap; stopped on the tooling fault, not the cap or the 40-minute clock (~19 minutes elapsed). Circuit breaker did **not** fire.

## Ledger / snapshot / dashboards

- 26 lines appended to `data/state/enrichment-ledger.jsonl`: 2 venue blanks, 10 venue `found-write-blocked` (informational — NOT a bndy write, flagged explicitly so the next run doesn't waste research re-doing this), 13 artist blanks, 1 snapshot line.
- Snapshot counts (post-run, effectively unchanged from pre-run since no venue writes landed): artists 1,940 total / 751 missing socials / 675 missing genres; venues 2,110 total / 692 missing socials.
- 1 line appended to `data/state/run-summary.jsonl` (`outcome: stopped`, `recordsEnriched: 16`, `skipped: 10`).
- Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (492 records, 16 snapshots) and `data/normalized/DASHBOARD.html`.
- Claim released: `data/state/claims/bv2a-enrichment.json` → `heldBy: null`.
- Final heartbeat: `bv2a-enrichment-hourly-unattended-2026-08-07T15-18-51Z.json` → `outcome: stopped`, reason recorded.
- New OPEN-RULINGS.md entry filed: **`edit_venue`/`enrich_venue` return HTTP 401 on every call this run while `edit_artist` and all reads work fine** — needs Jason/VSCode-agent attention. All 10 blocked venue matches are listed there in full so they can be applied in one pass once fixed.

## Open items for a human

1. **Venue-write auth fault (see OPEN-RULINGS.md)** — `edit_venue` and `enrich_venue` both 401 on every call this run; `edit_artist` and reads are unaffected. 10 fully-researched venue matches are ready to apply the moment this is fixed — no re-research needed.
2. **Mike Jones** (`c062411f…`) and **Hero's of Rock** (`d6d159d9…`) — near-miss candidate pages found, both lacking the location confirmation needed to clear the identification bar. Worth a human glance.
3. Backlog volume is large (741 venues / 738 artists still missing socials) — once the write fault is fixed, subsequent runs should make fast progress on the 10 pre-researched venues before continuing the oldest-first sweep.
