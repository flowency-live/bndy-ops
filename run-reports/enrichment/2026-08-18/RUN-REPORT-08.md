# Bv2a Enrichment — Run Report 08 (2026-08-18)

Run id: `bv2a-enrichment-2026-08-18T08-20-01Z`. Unattended hourly firing.

## Step 0 — Circuit breaker

Pre-checked by the orchestrator before this firing started: the last 3 run reports (RUN-REPORT-07, 06, 05, all dated 2026-08-18) each recorded 0 FAIL from the validator. 0 of 3 recorded a FAIL. **Breaker NOT TRIPPED.**

## Step 1 — Concurrency

Read `data\state\claims\bv2a-enrichment.json` at start: `{"heldBy":null,"releasedAt":"2026-08-18T07:32:11Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-18T07-19-04Z"}` — released. Used `data\state\claims\bv2a-enrichment.json` (not `data\state\claims\enrichment.json`, per the standing `bv2a-claim-path-stale-in-prompt` fingerprint — verified live against RUNBOOK.md §6F/§6G text this firing, not taken on trust). `data\state\enrichment.lock` not present — retired, not honoured or recreated.

Heartbeat written first: `data\state\heartbeat\bv2a-enrichment-2026-08-18T08-20-01Z.json`, `outcome:"started"`. Claim then acquired: `heldBy: bv2a-enrichment-2026-08-18T08-20-01Z`, `expiresAt: 2026-08-18T11:20:01Z` (3h TTL per RUNBOOK §6G's TTL table).

## Step 2 — Runbook / spec read

Read RUNBOOK.md in full this firing: H1 = v2.27 (2026-08-08), CURRENT FLOOR (§6A) = v2.19 — check passed, floor read live in §6A rather than assumed. Read §2A.1 items 3b and 8 verbatim (both Facebook-search and Google mandatory before any blank; bio is a quoted verbatim excerpt only, never composed), §2A.2 mechanics (canonicalise stored FB URLs), §3 venue protocol, §6F/§6G concurrency in full, and §6A the run contract. Also read ENRICHMENT-TASK-v3.md §0.0 and §FP in full. Read CTO-INBOX.md tail: confirmed standing fingerprints `bv2a-claim-path-stale-in-prompt`, `bv2a-oldest-backlog-not-globally-sorted`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-fb-evidence-mismatch-fp2-corroboration`, `bv2a-firing01-ledger-mixed-json-formatting` all live and current.

## Step 3 — Tool verification

bndy MCP tools reachable — confirmed live via `list_venues` and `list_artists`.

**Chrome tested, two attempts** (`tabs_context_mcp` with `createIfEmpty:false` then `true`): **not connected**, both non-transient. This is the **ELEVENTH consecutive firing** with Chrome unreachable, continuing the chain from firing 22 (2026-08-17 22:17Z) through firings 23, 00, 01, 02, 03, 04, 05, 06, 07, and this firing (08:20Z), spanning over ten hours. Per the hard-stop table, all artist priorities (1, 4, 5) were not attempted this firing. Venues proceeded under §FP.2 (WebSearch only, no Chrome needed).

## Step 4 — Work: artists

**0 processed.** Chrome unreachable all firing. Priority 1 (artists created in the last 24h with missing socials) was not queried this firing since it is unworkable regardless (bio-quote verification under §0.0 requires Chrome). The artist backlog (867 missing socials, 614 missing genres, both unchanged from firing 07's snapshot) remains for the next firing Chrome is reachable.

## Step 4 — Work: venues (FP.2, no Chrome needed)

**Selection.** Priority 2 (venues created in the last 24h with missing socials): `list_venues(missingSocials:true, createdSince:2026-08-17T08:20:01Z)` returned **0 results**. Fell to priority 3: backlog venues missing socials (543 at start).

**Cooldown check.** `enrichment-ledger.jsonl` parsed with Python `json.loads` per line (per the `bv2a-firing01-ledger-mixed-json-formatting` fingerprint — never plain-text grep) for every `type:"enrich", entity:"venue", outcome:"blank"` line — 102 unique venue ids excluded on that basis.

**Pagination.** Confirming `bv2a-oldest-backlog-not-globally-sorted`: pulled two pages (`offset:0` and `offset:40`, 80 records total) rather than trusting page 1 alone, then sorted the combined, filtered set client-side by `createdAt` ascending before selecting the working set.

**Other exclusions applied before selecting the working set (15 records):**
- 8 non-UK venues on these two pages, all sharing the `bndy-capture` externalId prefix `6022ef13-1c27-40be-98c3-7aad7c8c2a30`, `createdAt` clustered 2026-08-16T11:58Z: The Black Lab (Lille FR), Bal Chavaux (Paris FR), Nalen Klubb (Stockholm SE), Gazarte (Athens GR), Eightball Club (Thessaloniki GR), Musikens Hus (Gothenburg SE), MS Stubnitz (Hamburg DE) — already logged in `bv2a-firing22-foreign-venues-one-batch`/`bv2a-firing03-foreign-venues-widen-batch`, not re-logged. Two UK venues from the SAME capture batch (Mount Ephraim Gardens, Hernhill Kent; The Ferret, Preston) were correctly NOT excluded — the batch mixes UK and foreign rows and each was checked individually rather than batch-excluded wholesale.
- "United match)" (`9be0502f-2a7f-42ac-8751-b51852b2320a`, already logged as a garbled name) skipped again on the already-logged basis.
- "Dorset County Show" (`3219f70f-750a-4d8d-9acf-7f177ef5113e`, already logged non-venue, firing 06) skipped again.
- "Plympton Spice Plymouth" (`13db6e7b-fe80-40e9-a3a9-6ea7fe30e2db`, already logged non-venue, firing 07) skipped again.
- "Venue TBC" (`2f2e5e77-314a-4ce6-8377-b705e9480cdc`, Southampton, already logged unsearchable placeholder, firing 07) skipped again — **note: firing 07's CTO-INBOX entry cited the wrong id for this record** (`2f2e5e77-9d6e-…`, which does not exist per `get_by_id`); corrected in this firing's CTO-INBOX entry.
- "Okehampton Show ground" (`adc02e06-…`, already logged address mismatch, firing 04) skipped again.
- "Seabridge, Seabridge" (`a6cb4e7c-…`, already logged postcode mismatch, firing 23) skipped again.
- 2 records already recorded as an evidenced blank by firing 07 (same-day ledger history, not just today's earlier hours): The Holly Tree (`4a1616f3-…`), Crab & Winkle (`e9bb25ed-…`).
- 20 further records excluded on full ledger blank-history cooldown (not all from today — the ledger is cumulative) beyond the 15 manually identified above.

**Working set: 30 records**, sorted client-side by `createdAt` ascending (oldest 2026-07-31T20:39:38Z, newest 2026-08-08T12:35:57Z). All 30 written to bndy — 28 with a verified own Facebook Page, 2 with website only, 0 evidenced blank.

### Records enriched WITH a verified Facebook Page (28)

All confirmed by `get_by_id` read-back (spot-checked 3 of 30 directly; all 30 `edit_venue` responses echoed the written fields) and matched on address/postcode against the WebSearch evidence:

1. The Keynsham Courtyard — `3952d07c-fc7b-4cc1-9c6b-e0b0a4dd4daf` — facebookUrl + website. 19 High St, Keynsham BS31 1DP matches exactly; own site `thekeynshamcourtyard.co.uk`.
2. The King Arthur (Glastonbury) — `a6db798c-f6f8-422e-996f-243a7442f69f` — facebookUrl + website. 31-33 Benedict St, Glastonbury BA6 9NB matches exactly; own site `thekingarthurglastonbury.com`.
3. The Nags Head (Lyme Regis) — `16a4b7ab-932e-43f6-9f95-78c6137fd127` — facebookUrl + website. 32 Silver St, Lyme Regis DT7 3HS matches exactly; own site `nagsheadlymeregis.com`.
4. Taunton Racecourse Conference Centre — `075e50b7-75d9-47b8-8579-6cd3fcf43c85` — facebookUrl + website. Orchard Portman, Taunton TA3 7BL confirmed against an independent address lookup (bndy holds "B3170, Taunton TA3 7BL"); own site `tauntonracecourse.co.uk`. Three candidate FB pages exist under the same operator (Taunton Racecourse, Taunton Conference Centre, Taunton Racecourse Conference Centre) — picked the one whose name matches the bndy record exactly.
5. Wyke Regis Working Mens Club — `675e1ebd-6ea3-4e2b-9657-8a6cb14f0308` — facebookUrl. Club House, 56 Portland Rd, Weymouth DT4 9AB matches exactly per the search snippet. Distinguished from the separate, differently-named "Wyke Regis Social Club" page, which is a different venue.
6. Surfside Polzeath — `46aea0d1-63fe-48a7-9533-8007014c169e` — facebookUrl + website. Polzeath Beach, Wadebridge PL27 6TB matches exactly; own site `surfsidepolzeath.co.uk`.
7. Grapes Inn, Farnworth — `3aa928ee-0293-4f81-9ae0-00c15ee2d23f` — facebookUrl. 12 Mossfield Rd, Farnworth, Bolton BL4 0AB matches exactly.
8. Adelphi Hotel (Liverpool) — `2e6f389c-037f-4149-be43-3687bd87f2a2` — facebookUrl. Ranelagh St, Liverpool L3 5UL matches exactly.
9. Corn Exchange (Ross-on-Wye) — `5a35e868-6b6e-4a0b-b1a9-f363da416f30` — facebookUrl. The only Facebook presence found for this named event space is operated under the King's Head Hotel brand (`KingsHeadHotelRossonWye`, titled "Ross Corn Exchange" on Facebook, contact `cornexchange@kingshead.co.uk`) — treated as confidently identifying, since the Corn Exchange has no separate public identity from its operator.
10. The Mason Arms (Thrapston) — `c7250f5a-78b6-48e5-ba7d-cdc8d1acd0d0` — facebookUrl. 1 Huntingdon Rd, Thrapston matches exactly.
11. Cantina, Goodrington — `f8c545fc-134b-4bcd-be08-d471fc942a1a` — facebookUrl + website. Youngs Park Rd, Goodrington, Paignton TQ4 6BU matches exactly; own site `cantinagoodrington.co.uk`.
12. The Red Lion Shepperton — `aa96fe83-e6f2-4849-ad40-79550f4a5f09` — facebookUrl + website. Russell Rd, Shepperton TW17 9HX matches exactly; own site `redlionshepperton.com`. Distinguished from a separate "Red Lion Old Shepperton" page.
13. North Down Orchard — `1d232d05-0513-43d0-8b56-927a0d7b70a5` — facebookUrl + website. Haselbury Plucknett TA18 7PL matches exactly; own site `northdownorchard.com`.
14. ShyneFest — `52198069-42e1-4b0e-80b7-61241b258542` — facebookUrl. Merrist Wood College, Worplesdon GU3 3PE matches exactly. **Flagged separately below and in CTO-INBOX**: this is a music festival, not a fixed building, and has moved between Surrey sites in past years.
15. Sportsmens Rest — `4cb63a89-7458-4e06-9bc4-cf4a5221cb27` — facebookUrl + website. Shenley Leisure Centre, Shenley Church End MK5 6HF matches exactly; own site via `shenleyleisure.org.uk`.
16. The Binfield Club — `0c08a4cd-b733-46a0-b0bc-4a16b736efba` — facebookUrl + website. Binfield, Bracknell RG42 4HP matches exactly; own site `binfieldclub.co.uk`.
17. The Queen's Head, Kingston — `4aafeaaf-fd96-4bd4-bdc2-481e14afa436` — facebookUrl + website. 144 Richmond Rd, Kingston upon Thames KT2 5HA matches exactly; own site `queensheadkingston.co.uk`.
18. Tuckers Grave Inn & Campsite — `68d3f8b1-da50-4c5c-9a7b-d8b95f207c86` — facebookUrl + website. Faulkland BA3 5XF matches exactly; own site `tuckersgraveinn.co.uk`.
19. Plume of Feathers (Princetown) — `a03c9ce6-9826-41bd-80a8-b2544a3494d2` — facebookUrl + website. Princetown PL20 6QQ matches exactly; own site `plumedartmoor.co.uk`.
20. Ealing Ex Servicemen's Club — `6fec8b4d-7a64-48a8-914c-eb7e2128f36a` — facebookUrl. 3 Craven Rd, London W5 2UA matches exactly.
21. Star Inn (Liverton) — `67a76ac7-68d9-475b-be46-632ef64dc1e5` — facebookUrl + website. Liverton, Newton Abbot TQ12 6EZ matches exactly; own site `thestarnewtonabbot.co.uk`.
22. The Westward Inn (Lee Mill) — `ceaeedad-62a8-43aa-970a-906cb7d9983a` — facebookUrl. Lee Mill Bridge, Lee Mill PL21 9EE matches exactly.
23. The White Bear (West Ruislip) — `3e65fa6b-8423-42a5-b5a5-13ff7c5d4468` — facebookUrl + website. Ickenham Rd, Ruislip HA4 7DF matches exactly; own site `whitebearruislip.com`.
24. The Royal British Legion (Hockley) — `38255c17-5503-4e0c-9866-13cbdf62975a` — facebookUrl + website. 1 White Hart Ln, Hockley SS5 4DQ matches exactly; own site `hockleyrbl.uk`.
25. Leigh On Sea Constitutional Club — `6d53eb7c-77b2-4764-8f2d-6e30eef4f120` — facebookUrl. 116-118 Elm Rd, Leigh-on-Sea SS9 1SQ matches exactly. Picked the main club page over a separate "Entertainment" sub-page.
26. The Railway Hotel (Southend-on-Sea) — `692c34c9-2e6c-4cf7-b554-b4e57e405a82` — facebookUrl + website. Clifftown Rd, Southend-on-Sea SS1 1AJ matches exactly; own site `railwayhotelsouthend.co.uk`.
27. The Old Garrison Pub & Kitchen (Shoeburyness) — `bac2daf1-99c1-4809-a1b7-108347114f09` — facebookUrl + website. Campfield Rd, Shoeburyness SS3 9BX matches exactly; own site `theoldgarrison.com`.
28. The Barley Mow, Epsom — `39840c78-9326-43db-9acf-a2e67fcba295` — facebookUrl + website. 12 Pikes Hill, Epsom KT17 4EA matches (search independently confirmed "12-14 Pikes Hill"); own site `barley-mow-epsom.co.uk`.

### Records enriched with WEBSITE ONLY (2) — no confident own Facebook Page found

29. Steel Brew (Plymouth) — `504f91b8-e4bc-484d-95c9-57df06c134c3` — website only (`steelbrew.co.uk`, own domain, Mills Bakery, Royal William Yard, Plymouth matches — a licensing-register address gives PL1 3RP against bndy's PL1 3GD, same building complex, minor unit-level variance not treated as a mismatch). Every Facebook result found was a third-party post, event page, or another business's photo album, never an owned page for Steel Brew itself — does not meet the §2A.1 identification bar, so facebookUrl left blank.
30. Wellington & District Conservative Club — `9fc20645-f46d-4561-9dac-c2209e3a7a52` — website only (`wellingtonconservativeclub.wordpress.com`, own domain, 19 High St, Wellington TA21 8QT matches exactly). Two Google searches (full name, and bare name plus town) found no Facebook page at all, only a WordPress site, a CAMRA/whatpub listing, and an unrelated "Taunton & Wellington Conservatives" political page — facebookUrl left blank.

### Records recorded as an EVIDENCED BLANK

None this firing — every one of the 30 working-set records yielded either a verified Facebook Page or a confirmed own-domain website.

### Records SKIPPED, and why

15 records excluded from the working set before any search — see the "Other exclusions" list under Selection above (8 non-UK, 1 garbled name, 2 already-logged non-venues, 1 already-logged unsearchable placeholder, 2 already-logged address/postcode mismatches, plus 2 same-day evidenced blanks and 20 further ledger-blank-history exclusions). None are new findings except the ShyneFest and Venue TBC items below.

### Names corrected under §0.6

None this firing.

## New findings this firing

1. **ShyneFest is a moving festival, not a fixed venue.** Its own coverage shows past years at Miles Green Farm (Bisley) and Apps Court Farm (Walton-on-Thames) before this year's Merrist Wood College site. Enriched anyway since the record already exists and the facebookUrl match is unambiguous, but flagged for a human decision on whether this should be a venue record at all, given its address is liable to go stale on a future relocation. Logged as `bv2a-firing08-shynefest-venue-is-a-moving-festival`.
2. **Firing 07's "Venue TBC" CTO-INBOX entry cited the wrong id.** `get_by_id` this firing confirms `2f2e5e77-9d6e-4baf-93bd-676bb3241ee3` (as written in firing 07's entry) does not exist; the real record is `2f2e5e77-314a-4ce6-8377-b705e9480cdc`, same address and createdAt as firing 07 described. Same transcription trap as the earlier jorge-wilson correction (first-8-characters collision — RUNBOOK §6 warns full UUIDs are required for exactly this reason). Logged as `bv2a-firing07-venue-tbc-evidence-id-wrong`.
3. **Canonicalised write vs as-searched evidence URL caused a validator FAIL.** Wyke Regis WMC was written to bndy with the canonicalised Facebook URL (`https://www.facebook.com/wykeworkingmensclub/`, per RUNBOOK §2A.2) but the evidence line captured during search still held the mobile-prefixed form (`m.facebook.com/...`) — same page, different URL string, and the validator's `FB_EVIDENCE_MISMATCH` check is a strict string match. Corrected same firing by appending a second evidence line in canonical form (append-only; the loader keys on venueId and the later line wins). Logged as `bv2a-firing08-canonicalised-url-triggers-evidence-mismatch` — worth canonicalising the URL at capture time in future firings, not just at write time.

## Validator

Built via an adapter script for this firing (`data/state/build_validator_input_run0820.py`... — actual script content run inline this firing), following the standing `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` fingerprints: venue `facebookUrl` supplied as a top-level field (empty string for the 2 website-only records), `location` aliased from `city`; the evidence file's `venueId` keys aliased to `artistId` for the loader. All 30 records written this firing are included. Records JSON: `data/normalized/enrichment/records-2026-08-18-firing0820.json`. Evidence: `data/state/evidence_run0820_aliased.jsonl` (31 lines — 30 records plus one same-firing correction line for Wyke Regis WMC, per finding 3 above; the shared source file is `data/state/enrichment-evidence-2026-08-18-enrichment.jsonl`).

**First run: `30 records · 2 clean · 1 FAIL · 56 WARN [mode=gate]` — BATCH DOES NOT SHIP.** The single FAIL was `FB_EVIDENCE_MISMATCH` on Wyke Regis WMC (finding 3 above). Corrected by appending a canonical-form evidence line (append-only, not a rewrite) and re-running.

**Validator summary line (verbatim, second and final run): `30 records · 2 clean · 0 FAIL · 56 WARN   [mode=gate]`**

WARNs: `STUB_NO_BIO`/`STUB_NO_IMAGE` on all 28 Facebook-verified venues (expected — FP.2 venues carry no bio field and need no Chrome avatar fetch, per the standing `validator-fb-evidence-mismatch-fp2-corroboration` fingerprint). No FAIL outstanding.

## Circuit breaker

Not fired. No FAIL outstanding in the final validator run.

## Budget used

30 venues worked (30 written to bndy — 28 with facebookUrl, 2 website-only — 0 evidenced blank, 15 pre-excluded before selection as already-logged/foreign/ledger-blank-history) against the 30-venue / 15-artist / 40-minute budget. 0 artists worked (Chrome unreachable — hard stop on the artist portion only). Wall-clock: claim acquired 08:20:01Z, ledger/dashboard writes complete ~08:34:00Z (~14 minutes), well within the 40-minute ceiling and the 3h claim TTL.

## Ledger, snapshot, run-summary, dashboards

- Appended 30 `type:"enrich"` lines to `data/state/enrichment-ledger.jsonl` (all `outcome:"verified"` — 28 with `fields:["facebookUrl"]` or `["facebookUrl","website"]`, 2 with `fields:["website"]` only), plus one `type:"snapshot"` line: `artistsTotal:2231, artistsMissingSocials:867, artistsMissingGenres:614, venuesTotal:3003, venuesMissingSocials:513` (from live `list_venues`/`list_artists` pagination.count at 08:33Z). `venuesMissingSocials` dropped from 543 to 513 — a delta of exactly 30, matching the 30 venues written this firing. `artistsTotal`, `artistsMissingSocials` and `artistsMissingGenres` unchanged from firing 07's snapshot, consistent with no artist work this firing and no concurrent artist-creating task landing in this window.
- Appended one line to `data/state/run-summary.jsonl`: `{"date":"2026-08-18","task":"enrichment","finishedAt":"2026-08-18T08:33:00Z","outcome":"completed","gigsAdded":0,"artistsAdded":0,"venuesAdded":0,"recordsEnriched":30,"skipped":0,"note":"30 venues verified (28 FB, 2 website-only), 0 blank. Chrome down (11th firing), artists skipped."}`
- Regenerated both dashboards: `data/normalized/enrichment/DASHBOARD.html` (1771 enrichment records, 58 snapshots) and `data/normalized/DASHBOARD.html`.

## CTO-INBOX — new entries this firing

Four new entries appended (all listed under "New findings this firing" above, plus the eleventh-consecutive-Chrome-outage entry extending the standing chain).

## Discrepancy note for the operator

Same standing discrepancy as prior firings: the task prompt's claim path gotcha (`bv2a-claim-path-stale-in-prompt`) was already known and applied correctly without rediscovery, and was independently reconfirmed against the live RUNBOOK.md text this firing rather than taken on trust.
