# Bv2a Enrichment — Run Report 06 (2026-08-18)

Run id: `bv2a-enrichment-2026-08-18T06-20-46Z`. Unattended hourly firing.

## Step 0 — Circuit breaker

The orchestrator read the last 3 run reports before this firing started: RUN-REPORT-05 (COMPLETED, `10 records · 1 clean · 0 FAIL · 18 WARN`), RUN-REPORT-04 (COMPLETED, `30 records · 5 clean · 0 FAIL · 50 WARN`), RUN-REPORT-03 (COMPLETED, `30 records · 4 clean · 0 FAIL · 52 WARN`). 0 of 3 recorded a FAIL. **Breaker NOT TRIPPED.**

## Step 1 — Concurrency

Read `data\state\claims\bv2a-enrichment.json` at start: `{"heldBy":null,"releasedAt":"2026-08-18T05:34:00Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-18T05-20-11Z"}` — released. Used `data\state\claims\bv2a-enrichment.json` (not `data\state\claims\enrichment.json`, per the standing `bv2a-claim-path-stale-in-prompt` fingerprint). `data\state\enrichment.lock` not present — this is retired and was not honoured or recreated.

Heartbeat written first: `data\state\heartbeat\bv2a-enrichment-2026-08-18T06-20-46Z.json`, `outcome:"started"`. Claim then acquired: `heldBy: bv2a-enrichment-2026-08-18T06-20-46Z`, `expiresAt: 2026-08-18T09:20:46Z`.

## Step 2 — Runbook / spec read

Runbook floor check already confirmed by the orchestrator before this firing started: H1 = v2.27, CURRENT FLOOR (§6A) = v2.19, check passed. Known fingerprints from `CTO-INBOX.md` were supplied directly and not re-derived.

## Step 3 — Tool verification

bndy MCP tools reachable — confirmed live via `list_venues` and `list_artists`. WebSearch reachable and used throughout.

**Chrome tested, two attempts** (`tabs_context_mcp` with `createIfEmpty:false` then `true`): **not connected**, both non-transient. This is the **NINTH consecutive firing** with Chrome unreachable, continuing the chain from firing 22 (2026-08-17 22:17Z) through firings 23, 00, 01, 02, 03, 04, 05, and this firing (06:20Z), spanning over eight hours. Per the hard-stop table, all artist priorities were not attempted this firing. Venues proceeded under §FP.2 (WebSearch only, no Chrome needed).

## Step 4 — Work: artists

**0 processed.** Chrome unreachable all firing. Priority 1 (artists created in the last 24h with missing socials) found 6 candidates (`Camems`, `Whiskey Rebel`, `Guns for Girls`, `One Dimensional Creatures`, `Uncle Dad & The Day Drinkers`, `Devoted` — all Staffordshire, `mcp_ai_import`, created 2026-08-18 04:13–04:15Z), but none could be worked: bio-quote verification requires Chrome per §0.0, and no bare edit is permitted without it. These remain in the backlog for the next firing Chrome is reachable.

## Step 4 — Work: venues (FP.2, no Chrome needed)

**Selection.** Priority 2 (venues created in the last 24h with missing socials): `list_venues(missingSocials:true, createdSince:2026-08-17T06:20:46Z)` returned **0 results**. Fell to priority 3: backlog venues missing socials. `list_venues(missingSocials:true, limit:35, offset:0)` (587 total at start) was pulled. The API's returned order is **not** sorted by `createdAt` (confirmed by inspection this firing — it mixes May, June, July and August records) — the client-side sort therefore only covers what this one page returned, not the full 587-record backlog. This is a correction to RUN-REPORT-05's assumption that page 1 is already ascending; flagged below as a new finding.

**Cooldown check.** `enrichment-ledger.jsonl` (1,795 lines at start) parsed with Python `json.loads` per line for every `type:"enrich", entity:"venue", outcome:"blank"` line — 100 unique venue ids excluded on that basis (up from 99 in RUN-REPORT-05, one new blank recorded since). This correctly excluded, from the returned page: W P M Sports & Social Club, Tudor Nook (Cheadle), Hunstanton Bandstand, Annitsford Welfare Club, Canal Tavern, O'Neill's Woking, Okehampton Show ground, Jubilee Park (Horndean), Ann Welfare Playing Fields, Hayfield Club, The Saracens Head (Newton Abbot), Tor Sports & Leisure, West End Club (Stapleford) — all already recorded blank by earlier firings.

**Other exclusions applied before selecting the working set:** four non-UK venues (The Black Lab/Lille, Bal Chavaux/Paris, Nalen Klubb/Stockholm, Gazarte/Athens), all carrying `externalIds` source prefix `6022ef13-1c27-40be-98c3-7aad7c8c2a30`, already logged as a batch in `bv2a-firing03-foreign-venues-widen-batch`; not re-logged. Okehampton Show ground (already logged, address mismatch) skipped again on the cooldown/logged basis.

**Working set: 18 records**, sorted client-side by `createdAt` ascending among the returned page (oldest 2026-08-04T18:17Z, newest 2026-08-16T11:58:30Z). 17 enriched, 1 excluded before any write (Dorset County Show — see below).

### Records enriched WITH a verified page (17, all with facebookUrl; 8 of these also website)

All confirmed by `get_by_id` read-back and matched on address/postcode against the search evidence:

1. The White Hart - Corby — `dd3d76e9-d5a0-4122-bb9f-1cd2ca7d25a5` — facebookUrl. High St, Corby NN17 1UX matches exactly.
2. London Stone (Staines) — `3b1dc119-6b0f-4d9d-bf99-b8cb752c58b1` — facebookUrl + website. 14 Church St, Staines TW18 4EP matches exactly; own site `londonstonepub.com`.
3. The Sportsman (Bedford) — `dde82c25-e982-4437-9635-e3353328f6ef` — facebookUrl. 58 The Boundary, Bedford MK41 9HA matches exactly. Two similarly-named "Bedford Sportsman" pages exist for pubs in Westchester County, NY — ruled out as non-UK.
4. Farnham Maltings — `62c4d1a2-7ec9-4475-bafa-ac08c6826b68` — facebookUrl + website. Bridge Square, Farnham GU9 7QR matches exactly; own site `farnhammaltings.com`.
5. The Avon Inn (Avonwick) — `1a4f2573-c1c8-4184-b2c5-238905bc8423` — facebookUrl + website. Plymouth Rd, Avonwick TQ10 9NB matches exactly; own site `avon-inn.co.uk`.
6. The Kings Head Sports Pub (Seaford) — `b2724d05-fa65-4393-b144-82d5d2dc485d` — facebookUrl. Pelham Rd, Seaford BN25 1EP matches exactly.
7. The George IV, Chiswick — `9cb2fde9-3d30-4a2c-9834-041d64e8c00a` — facebookUrl + website. 185 Chiswick High Rd W4 2DR matches exactly; own site `georgeiv.co.uk`.
8. Fatling Hornchurch — `5b320004-bee8-4478-b1c4-d68b4feddd70` — facebookUrl. 109 High St, Hornchurch RM11 1TX matches exactly.
9. Elephant & Castle (Ramsgate) — `ffbacf6f-d88a-42a5-b13f-d338f318200b` — facebookUrl. 8-10 Hereson Rd, Ramsgate CT11 7DP matches exactly.
10. West End Social Club (Woking) — `d2fc6170-1346-40e3-8c3d-70283c30ecce` — facebookUrl + website. 2 High St, West End, Woking GU24 9PL matches exactly; own site `westendsocialclub.co.uk`. A second, older-style Facebook page for the same club also exists — the current vanity-handle page (`thewesc`) was used.
11. Townfoot Café and Bar (Rothbury) — `cec5afc7-dbf2-46a9-9c74-5e8f6bb6b1c5` — facebookUrl. Old Motor House, Rothbury matches exactly (confirmed via local press coverage of the venue's opening).
12. The Acacia Centre (Kirkby in Ashfield) — `c4098785-302c-4282-bf48-b798f91dee91` — facebookUrl. Acacia Ave, Kirkby-in-Ashfield NG17 9BH matches exactly (page trades as "The Acacia Community Centre").
13. The Leopard (Burton-on-Trent) — `8d6eb3a8-3fbf-4838-9842-95661831c091` — facebookUrl. Lichfield Street, Burton-on-Trent DE14 3QZ matches exactly. A differently-located "The Leopard - Tutbury" page was ruled out (different town).
14. Gresley Old Hall (Swadlincote) — `501c6e6a-b392-4d7c-a911-fc551fa6ee22` — facebookUrl. Gresley Wood Rd, Church Gresley, Swadlincote DE11 9QW matches exactly (page trades as "Gresley Old Hall Community Welfare Centre").
15. Golden Lion Hotel (Todmorden) — `0c56e35d-9e5c-4d2f-8956-25b3a74dd069` — facebookUrl + website. Fielden Square, Todmorden OL14 6LZ matches exactly; own site `goldenliontodmorden.com`.
16. Houldsworth Working Men's Club (Stockport) — `3b812ceb-819f-4546-b71d-252335ea289e` — facebookUrl + website. 35 Leamington Rd, Reddish, Stockport SK5 6BD matches exactly; own site `houldsworthwmc.co.uk`.
17. Chinnery's (Southend-on-Sea) — `f733216b-9f08-4eef-b12f-4b5baac23b9c` — facebookUrl + website. 21-22 Marine Parade, Southend-on-Sea matches exactly; own site `chinnerys.co.uk`.

### Records recorded as an EVIDENCED BLANK — no bndy write (0)

None this firing — every remaining candidate in the working set resolved to a confident, address-matched Facebook page on the first WebSearch variant.

### Records SKIPPED, and why

1. Dorset County Show (Dorchester) — `3219f70f-750a-4d8d-9acf-7f177ef5113e` — WebSearch confirms this is the annual Dorchester Agricultural Society show (5–6 September 2026, at Agriculture House, Acland Rd), not a fixed music venue. Excluded under §0.23 before any write was attempted. New finding this firing — see CTO-INBOX.

### Names corrected under §0.6

None this firing — all 17 bndy names matched the venue's own trading name closely enough that no rename was warranted. "The White Hart - Corby" carries a pre-existing ' - Corby' suffix on the bndy name field that the validator flags as `NAME_BILLING`; this predates this firing (the name field was not touched) and is noted, not corrected, since it may be deliberate disambiguation from other White Hart pubs.

## Validator

Built via an adapter script for this firing (`data/state/build_validator_input_run0620.py`), following the standing `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` fingerprints: venue `facebookUrl` supplied as a top-level field, `location` aliased from `city`; the evidence file's `venueId` keys aliased to `artistId` for the loader. Records JSON: `data/normalized/enrichment/records-2026-08-18-firing06.json`. Evidence: `data/state/evidence_run0620_aliased.jsonl` (17 lines, this firing's subset of the shared `data/state/enrichment-evidence-2026-08-18-enrichment.jsonl`).

**Validator summary line (verbatim, first and only run): `17 records · 0 clean · 0 FAIL · 35 WARN   [mode=gate]`**

WARNs: `STUB_NO_BIO`/`STUB_NO_IMAGE` on all 17 Facebook-verified venues (expected — FP.2 venues carry no bio field and need no Chrome avatar fetch, per the standing `validator-fb-evidence-mismatch-fp2-corroboration` fingerprint). One additional `NAME_BILLING` WARN on The White Hart - Corby (pre-existing name field, not written this firing). No FAIL.

## Circuit breaker

Not fired. No FAIL outstanding in the validator run.

## Budget used

17 venues worked (17 written to bndy, 0 evidenced blank) against the 30-venue / 15-artist / 40-minute budget. 0 artists worked (Chrome unreachable — hard stop on the artist portion only). Wall-clock: claim acquired 06:20:46Z, ledger/dashboard writes complete ~06:27:15Z (~7 minutes), well within the 40-minute ceiling and the 3h claim TTL.

## Ledger, snapshot, run-summary, dashboards

- Appended 17 `type:"enrich"` lines to `data/state/enrichment-ledger.jsonl` (all `outcome:"verified"`), plus one `type:"snapshot"` line: `artistsTotal:2231, artistsMissingSocials:867, artistsMissingGenres:614, venuesTotal:3003, venuesMissingSocials:570` (from live `list_artists`/`list_venues` pagination.count at 06:26Z). `venuesMissingSocials` dropped from 587 to 570 — a delta of exactly 17, matching the 17 venues written this firing. `artistsTotal` rose from 2228 to 2231 (+3), consistent with other concurrent tasks (spider/klma) creating new artist records this hour, not this firing.
- Appended one line to `data/state/run-summary.jsonl`: `{"date":"2026-08-18","task":"enrichment","finishedAt":"2026-08-18T06:27:15Z","outcome":"completed","gigsAdded":0,"artistsAdded":0,"venuesAdded":0,"recordsEnriched":17,"skipped":1,"note":"17 venues verified, 0 blank. Chrome down (9th firing), artists skipped."}`
- Regenerated both dashboards: `data/normalized/enrichment/DASHBOARD.html` (1712 enrichment records, 56 snapshots) and `data/normalized/DASHBOARD.html`.

## CTO-INBOX — new entries this firing

Two new findings raised:
1. The ninth-consecutive-firing Chrome outage (escalating the existing chain of identical findings for 22, 23, 00, 01, 02, 03, 04, 05).
2. Dorset County Show (Dorchester) — an agricultural show, not a fixed venue, not previously logged.

A third note (not a CTO-INBOX line, recorded here instead): `list_venues(missingSocials:true)` is **not** sorted by `createdAt` — RUN-REPORT-05's inference that page 1 is already oldest-first does not generalise across pages or across firings. This firing's "oldest first" selection was only ever oldest-among-the-one-page-returned, not oldest-in-the-full-backlog. Worth a look if strict oldest-first ordering across the full 570-record backlog matters to a future firing.

## Discrepancy note for the operator

Same standing discrepancy as prior firings: the task prompt's claim path gotcha (`bv2a-claim-path-stale-in-prompt`) was already known and applied correctly without rediscovery.
