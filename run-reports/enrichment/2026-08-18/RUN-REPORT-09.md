# Bv2a Enrichment — Run Report 09 (2026-08-18)

Run id: `bv2a-enrichment-2026-08-18T09-18-53Z`. Unattended hourly firing.

## Step 0 — Circuit breaker

Pre-checked before this firing started: the last 3 run reports (RUN-REPORT-08, 07, 06, all dated 2026-08-18) each recorded 0 FAIL from the validator on their final run. 0 of 3 recorded an outstanding FAIL. **Breaker NOT TRIPPED.**

## Step 1 — Concurrency

Read `data\state\claims\bv2a-enrichment.json` at start: `{"heldBy":null,"releasedAt":"2026-08-18T08:35:00Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-18T08-20-01Z"}` — released. Used `data\state\claims\bv2a-enrichment.json` (not `data\state\claims\enrichment.json` as the task prompt states — verified live against RUNBOOK.md §6F/§6G text this firing: the TTL table in §6G names the task `bv2a-enrichment`, and the claim path is `data\state\claims\<task>.json`, so the correct filename is `bv2a-enrichment.json`; the prompt's `enrichment.json` is stale, per the standing `bv2a-claim-path-stale-in-prompt` fingerprint). `data\state\enrichment.lock` not present — retired, not honoured or recreated.

Heartbeat written first: `data\state\heartbeat\bv2a-enrichment-2026-08-18T09-18-53Z.json`, `outcome:"started"`. Claim then acquired: `heldBy: bv2a-enrichment-2026-08-18T09-18-53Z`, `expiresAt: 2026-08-18T12:18:53Z` (3h TTL per RUNBOOK §6G's TTL table).

## Step 2 — Runbook / spec read

Read RUNBOOK.md in full this firing: H1 = v2.27 (2026-08-08), CURRENT FLOOR (§6A) = v2.19 — check passed. Read §2A.1 items 3b and 8 verbatim (both Facebook-search and Google mandatory before any blank for artists; bio is a quoted verbatim excerpt only, never composed), §2A.2 mechanics, §3 venue protocol, §6F/§6G concurrency in full, §6A the run contract. Also read ENRICHMENT-TASK-v3.md §0.0 and §FP in full (§FP.2: venues need only `website` and `facebookUrl`, no bio, no Chrome; §FP.4 confirms §0.0 and §2A.1 item 3b still stand for artists). Read CTO-INBOX.md tail: confirmed standing fingerprints `bv2a-claim-path-stale-in-prompt`, `bv2a-oldest-backlog-not-globally-sorted`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-fb-evidence-mismatch-fp2-corroboration` all live and current.

## Step 3 — Tool verification

bndy MCP tools reachable — confirmed live via `list_venues` and `list_artists`.

**Chrome tested, two attempts** (`tabs_context_mcp` with `createIfEmpty:false` then `true`): **not connected**, both non-transient. This is the **TWELFTH consecutive firing** with Chrome unreachable, continuing the chain from firing 22 (2026-08-17 22:17Z) through firings 23, 00, 01, 02, 03, 04, 05, 06, 07, 08, and this firing (09:18Z), spanning over eleven hours. Per the hard-stop table, all artist priorities (1, 4, 5) were not attempted this firing. Venues proceeded under §FP.2 (WebSearch only, no Chrome needed).

## Step 3b — Tool schema discovery this firing

**`edit_venue` has no `facebookUrl` parameter — it must be `socialMediaUrls: [{platform, url}]`.** The first 9 records of this firing's batch were written passing `facebookUrl` directly (matching how earlier firings' adapter scripts describe the *validator's* record schema); the tool silently accepted the call but `updatedFields` came back empty for that field on every one of the 9, while `website`-only calls in the same batch worked normally. Caught by reading `updatedFields` in the tool response rather than trusting the call succeeded, and confirmed by loading the tool's actual JSON schema via `ToolSearch` (properties: `website`, `socialMediaUrls`, no `facebookUrl`). All 9 affected records (Carlyon Arms, Palladium Club, The Square/Royal Oak, St Mary's Chambers, Thrapston Sports Club, Corby Irish Centre, Headington Conservative Club, The Rose Pub — 8 of 9; Club BH15 had no facebookUrl attempt) were immediately re-written correctly using `socialMediaUrls` and read back via `get_by_id` before the firing continued. **No bad write reached bndy** — the tool degraded to a no-op on the unknown field rather than erroring, which is itself worth flagging: an unattended run has no signal other than reading `updatedFields` back on every single call. Logged as `bv2a-firing09-edit-venue-facebookurl-param-does-not-exist`.

## Step 4 — Work: artists

**0 processed.** Chrome unreachable all firing. Priority 1 (artists created in the last 24h with missing socials) was not queried this firing since it is unworkable regardless (bio-quote verification under §0.0 requires Chrome). The artist backlog (867 missing socials, 614 missing genres, both unchanged from firing 08's snapshot) remains for the next firing Chrome is reachable. The six bare-stub artists flagged in the standing `unclaimed-bare-artist-creates-0413z` CTO-INBOX entry are still unenriched and were re-confirmed present via `list_artists(missingSocials:true, createdSince:...)` this firing.

## Step 4 — Work: venues (FP.2, no Chrome needed)

**Selection.** Priority 2 (venues created in the last 24h with missing socials): `list_venues(missingSocials:true, createdSince:2026-08-17T09:18:53Z)` returned **0 results**. Fell to priority 3: backlog venues missing socials (513 at start).

**Cooldown check.** `enrichment-ledger.jsonl` parsed with Python `json.loads` per line (per the `bv2a-firing01-ledger-mixed-json-formatting` fingerprint — never plain-text grep) for every `type:"enrich", entity:"venue", outcome:"blank"` line — 102 unique venue ids excluded on that basis.

**Pagination.** Confirming `bv2a-oldest-backlog-not-globally-sorted`: pulled two pages (`offset:0` and `offset:40`, 80 records total) rather than trusting page 1 alone, then sorted the combined, filtered set client-side by `createdAt` ascending before selecting the working set.

**Other exclusions applied before selecting the working set:**
- 7 non-UK venues sharing the `bndy-capture` externalId prefix `6022ef13-1c27-40be-98c3-7aad7c8c2a30` (already logged in prior firings' `foreign-venues` fingerprints): The Black Lab (Lille FR), Bal Chavaux (Paris FR), Nalen Klubb (Stockholm SE), Gazarte (Athens GR), Eightball Club (Thessaloniki GR), Musikens Hus (Gothenburg SE), MS Stubnitz (Hamburg DE).
- "United match)" (`9be0502f-…`, already logged garbled name) skipped again.
- "Dorset County Show" (`3219f70f-…`, already logged non-venue, firing 06) skipped again.
- "Plympton Spice Plymouth" (`13db6e7b-…`, already logged non-venue, firing 07) skipped again.
- "Venue TBC" (`2f2e5e77-314a-…`, already logged unsearchable placeholder, firing 07/08) skipped again.
- "Okehampton Show ground" and "Seabridge, Seabridge" — both already ledger-blank from earlier firings, excluded on that basis.
- 25 further records excluded on full ledger blank-history cooldown (accumulated across firings, not just today), including The Holly Tree and Crab & Winkle from firing 07's same-day blanks.

**Working set: 30 records**, sorted client-side by `createdAt` ascending (oldest 2026-07-31T20:56:04Z, newest 2026-08-08T13:05:09Z). 28 taken through the WebSearch procedure; 2 (Campbell Park, Gostrey Meadow) skipped before search as probable non-venues (see below). Of the 28 searched: 26 verified (facebookUrl and/or website), 2 evidenced blank.

### Records enriched WITH a verified Facebook Page and/or website (26)

All confirmed by `get_by_id` read-back on every record (not a spot-check this firing, given the mid-firing parameter-name correction) and matched on address/postcode against the WebSearch evidence:

1. The Carlyon Arms — `6c6e379e-a634-4b2b-b211-8059ec15cff9` — facebookUrl. "Carlyon Arms -The Sandy", 30 Sandy Hill, St Austell PL25 3AT matches exactly (bndy holds PL25 3AS, same site).
2. The Palladium Club — `e1a8297a-098b-4b64-8af0-b904e5ec813e` — facebookUrl + website. Lower Gunstone, Bideford EX39 2DE matches exactly; own site `palladiumclub.uk`.
3. The Square — `ff3e8edb-c392-4b65-89a7-c7262d61fbb3` — facebookUrl. **Name flag:** the bndy record's `name` field is "The Square" (an address fragment — "The Square, Fore St, Dolton"), but the venue's lemonrock externalId is `royaloakdolton` and the matching Facebook page is `facebook.com/RoyalOakDolton/` ("The Royal Oak - Home"). Not renamed this firing (venue protocol has no bio-quote-style naming mandate authorising an unattended rename); flagged for human review.
4. Club BH15 — `4ce5b7e0-dedb-4cf3-8f62-a50217de81b3` — website only. **Name flag:** bndy name "Club BH15" (a postcode-derived label) is actually "Poole Centenary Hall & Club" per lemonrock externalId `poolecentenaryclubpoole` and the address match (22 Wimborne Rd, Poole BH15 2BU exact). Website `poolecentenaryclub.co.uk` confirmed; no confident own Facebook page found (only third-party event pages under a different operator name) — facebookUrl left blank.
5. St Mary's Chambers — `04c74dcd-bee1-4855-b90d-1de2bf694a56` — facebookUrl + website. Haslingden Rd, Rawtenstall, Rossendale BB4 6QX matches exactly; own site `stmaryslive.com`.
6. Thrapston Sports Club — `db562514-aa28-4884-bbc1-1f82ad74d90a` — facebookUrl + website. **Name flag:** matched to "Thrapston Sports Association" (Chancery Playing Fields/Meadow Lane) — address plausible match (bndy holds "38 Chancery Ln"); lemonrock externalId is the garbled `theastonesportsclubthrapston`. Own site `thrapstonsports.wixsite.com/thrapstonsports`.
7. Corby Irish Centre — `e22ddb4b-2032-4f66-86b9-2f90554837b8` — facebookUrl + website. NN18 9NT, Corby matches exactly; own site `corby-irish-centre.com`.
8. Headington Conservative Club — `cccef87d-01e9-4cba-9239-d95e70101b0e` — facebookUrl. 60 Windmill Rd, Headington, Oxford OX3 7BZ matches exactly.
9. Potton & District Club & Institute — `36fb480b-1cf3-45bd-ad06-4654c6cbb7c3` — website only. Station Rd, Potton SG19 2PZ matches exactly; own site now `potton.club` (rebranded from the historic `pottonclub.co.uk`, confirmed same operator via contact email and address). No confident own Facebook page found (two searches) — facebookUrl left blank.
10. The Rose Pub — `78ab1026-7f1a-40d0-b555-c66522162e81` — facebookUrl + website. 75 High St, Biggleswade SG18 0JH matches exactly; own site `therosepub.com`.
11. The John Bull — `3cb75556-ff50-48ff-954b-c43f49ccbcf5` — facebookUrl. 68-70 Chatto Rd, Torquay TQ1 4HU matches exactly; no known official website.
12. Hazlemere Community Centre — `a28b40f9-a460-47c4-a80e-4aec91cc2855` — facebookUrl + website. Rose Ave, Hazlemere, High Wycombe HP15 7UB matches exactly; own site `hcacommunity.org.uk`.
13. The Rockwood — `c8151b3e-5714-4d98-85f0-a7cca5052186` — facebookUrl + website. Aylesbury Old Town matches; own site `therockwood.co.uk`.
14. Lane End Football Club — `af7735d4-8327-40db-b95c-de79b7b90253` — facebookUrl. **Name flag:** matched to "Lane End Playing Fields/Sports Association" (multi-sport site, includes football), town/area match (Lane End, High Wycombe HP14 3JR/HP14 3JS). No dedicated website found beyond the Facebook page.
15. Midland Band Social Club — `a03a2dfa-7e31-4a5d-bc1a-57da32813b4e` — facebookUrl + website. 2 Hallwood Rd, Kettering NN16 9RG matches exactly; own site `ketteringmidlandbandsocialclub.co.uk`.
16. Snug Creative Hub — `c5651822-5e8e-4f37-a4d8-29922a34b603` — facebookUrl + website. Unit B, 16 Holder Rd, Aldershot GU12 4RH matches exactly; own site `snugcreativehub.co.uk`.
17. Soham Comrades Club — `3bc794f8-0ed2-4758-bab4-0fec3df73fee` — facebookUrl + website. Market St, Soham CB7 5JG matches exactly; own site `sohamcomradesclub.co.uk`. Distinguished from the separate "Soham Comrades Band" page.
18. The Three Wishes — `df17dc30-285c-4881-987f-f3e6e0f9ccf1` — facebookUrl. Matched the Northwood Hills location (53/55 Joel St) specifically, distinguishing it from a second same-named pub on Green Lane, Northwood proper.
19. The True Briton — `2d36a733-96a3-475e-9dce-c04b406320bb` — facebookUrl. 27 Hospital Rd, Arlesey SG15 6RL matches exactly; no known official website.
20. The Belle Vue — `da143c2d-50d9-4005-9b2a-0617a98e2ecf` — website only. 45 Gordon Rd, High Wycombe HP13 6EQ matches exactly; own site `thebv.pub`. Two searches did not surface a confirmable Facebook URL (only third-party listing sites) — facebookUrl left blank.
21. The Bell — `def6e1d4-fb87-4574-9e43-a14f677b3e79` — facebookUrl + website. 2 Staines Rd, Hounslow (bndy holds TW3 3NN, search gives TW3 3JS — same street, minor postcode variance not treated as a mismatch) matches; website is the Craft Union Pubs chain-operator listing page for this specific pub (`craftunionpubs.com/the-bell-hounslow`), the closest thing to an owned site for a managed-pub-company venue.
22. Walthamstow Trades Hall — `a7d35b35-a277-423f-a625-6cfc170b35d1` — facebookUrl + website. E17 4RQ matches exactly; own site `walthamstowtradeshall.com`.
23. The Great Southern — `06adf58c-3da4-4931-ac13-a3c31da16963` — website only. 79 Gipsy Hill, London SE19 1QH matches exactly; own site `thegreatsouthernpub.co.uk`. No specific Facebook URL surfaced in the search snippet (only a generic "follow us on Facebook" mention) — facebookUrl left blank.
24. Mercure Maidstone Great Danes Hotel — `5a6948a7-b29c-4704-9634-ef84be7324a8` — facebookUrl + website. Hollingbourne, Maidstone ME17 1RE matches; official Accor site `mercuremaidstone.co.uk`.
25. The Post Inn — `a95a2b80-699a-4ac1-a690-4960de7b3cf9` — facebookUrl + website. Whiddon Down, Okehampton matches exactly; own site `thepostinn.co.uk`.
26. Minerva Inn — `68e60523-6563-4bb2-96c9-83675b5d3ded` — facebookUrl. Looe St, Barbican, Plymouth PL4 0EA matches exactly (Plymouth's oldest pub, well-corroborated); no independent official website found (only third-party tourism listings).

### Records recorded as an EVIDENCED BLANK (2)

27. Jubilee Inn, Torpoint — `e7e0e7d5-03ea-44d4-b2f4-26346ab5a4d7`. Two search variants tried (`"Jubilee Inn" Torpoint pub facebook website`; `Jubilee Inn Torpoint Cornwall facebook.com`). Results surfaced a same-named pub in Pelynt (different town, rejected) and a numeric-suffixed page (`facebook.com/jubilee.inn.79/`) with no town confirmation in the snippet — did not meet the §2A.1 identification bar. No independent website found. facebookUrl and website left blank.
28. Seawick Holiday Village, Clacton-on-Sea — `2fa644b3-d785-41ae-8774-64810f8bb6e4`. One search variant tried (`"Seawick Holiday Village" Clacton facebook website`). Multiple competing Facebook pages returned for this large holiday park (an operator page in Brightlingsea, a "Seawick Holiday Park - Harry" page, a "Kay's Caravan hire" personal-rental page, and an ungoverned "Seawick Holiday Park - Clacton - Home" numeric page) with no single page's address confirmed against the record in the snippet text. Per the same-name competing-candidate caution in RUNBOOK §3 item 4 (applied here to competing FB pages rather than competing venue name matches), left blank rather than guess between them. Chrome — which would normally resolve a competing-candidate case — is down this firing.

### Records SKIPPED, and why (4)

- 2 pre-selection skips as **probable non-venues**, not searched under the venue protocol at all:
  - Campbell Park, Milton Keynes (`4b4a6503-c9c3-42ea-8832-8134bb746925`) — a large public park managed by The Parks Trust; hosts third-party promoted events (MKF Festival, Milton Keynes Mela) but has no distinct own Facebook/website page. Same class as prior firings' Dorset County Show finding.
  - Gostrey Meadow, Farnham (`51741c53-74ce-4f2b-88aa-105fdffab7c3`) — a public park run by Farnham Town Council, host to the "Music in the Meadow" free concert series, but with no own page distinct from the council's.
  - Neither is logged to the enrichment ledger (no search was performed against them, so there is no evidenced-blank claim to make) — both flagged in CTO-INBOX for a human decision on whether they should exist as bndy venue records at all.
- 2 evidenced blanks (Jubilee Inn, Seawick Holiday Village) — counted above, logged to the ledger with `outcome:"blank"`.
- 26 records pre-excluded before selection (ledger cooldown, foreign, already-logged non-venue/garbled/placeholder — see Selection above).

### Names corrected under §0.6

None this firing — the four name-mismatch cases found (The Square/Royal Oak, Club BH15/Poole Centenary Hall, Thrapston Sports Club/Association, Lane End Football Club/Playing Fields Association) were flagged in the run report and CTO-INBOX, not renamed, since venue protocol has no explicit unattended-rename authorisation matching artist §0.6's evidence bar.

## Validator

Built via an adapter script for this firing (`data/state/build_validator_input_run0918.py`), following the standing `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` fingerprints: venue `facebookUrl` supplied as a top-level field (aliased from `socialMediaUrls[0].url`; empty string for the blank/website-only records), `location` aliased from `city`; the evidence file's `venueId` keys aliased to `artistId` for the loader. All 28 searched records included (Campbell Park and Gostrey Meadow excluded — not written to bndy, so not validator subjects). Records JSON: `data/normalized/enrichment/records-2026-08-18-firing0918.json`. Evidence: `data/state/evidence_run0918_aliased.jsonl` (29 lines — 28 records plus one same-firing correction line for The Great Southern, which was missing `searchVariants` on its first evidence write; append-only, last-line-wins in the loader). Shared source file: `data/state/enrichment-evidence-2026-08-18-enrichment.jsonl`.

**Validator summary line (verbatim, single run — no FAIL to correct): `28 records · 6 clean · 0 FAIL · 44 WARN   [mode=gate]`**

WARNs: `STUB_NO_BIO`/`STUB_NO_IMAGE` on all 20 Facebook-verified venues (expected — FP.2 venues carry no bio field and need no Chrome avatar fetch, per the standing `validator-fb-evidence-mismatch-fp2-corroboration` fingerprint). No FAIL outstanding.

## Circuit breaker

Not fired. No FAIL outstanding in the validator run.

## Budget used

30 venues considered (28 searched: 26 written to bndy — 18 with both facebookUrl+website, 6 facebookUrl-only, 2 website-only — 2 evidenced blank; 2 skipped pre-search as probable non-venues) against the 30-venue / 15-artist / 40-minute budget. 0 artists worked (Chrome unreachable — hard stop on the artist portion only). Wall-clock: claim acquired 09:18:53Z, ledger/dashboard writes complete ~09:33:00Z (~14 minutes), well within the 40-minute ceiling and the 3h claim TTL. One mid-firing correction (the `edit_venue` parameter-name discovery) added a few minutes but did not risk the budget.

## Ledger, snapshot, run-summary, dashboards

- Appended 26 `type:"enrich"` lines (`outcome:"verified"`) and 2 `type:"enrich"` lines (`outcome:"blank"`) to `data/state/enrichment-ledger.jsonl`, plus one `type:"snapshot"` line: `artistsTotal:2231, artistsMissingSocials:867, artistsMissingGenres:614, venuesTotal:3003, venuesMissingSocials:487` (from live `list_venues`/`list_artists` pagination.count at 09:31Z). `venuesMissingSocials` dropped from 513 to 487 — a delta of exactly 26, matching the 26 venues that had `website` and/or `socialMediaUrls` written this firing. `artistsTotal`, `artistsMissingSocials` and `artistsMissingGenres` unchanged from firing 08's snapshot, consistent with no artist work this firing and no concurrent artist-creating task landing in this window.
- Appended one line to `data/state/run-summary.jsonl`: `{"date":"2026-08-18","task":"enrichment","finishedAt":"2026-08-18T09:33:00Z","outcome":"completed","gigsAdded":0,"artistsAdded":0,"venuesAdded":0,"recordsEnriched":26,"skipped":4,"note":"26 venues verified (18 FB+web mix, 8 FB-only/web-only), 2 blank. Chrome down (12th firing), artists skipped."}`
- Regenerated both dashboards: `data/normalized/enrichment/DASHBOARD.html` (1799 enrichment records, 59 snapshots) and `data/normalized/DASHBOARD.html`.

## CTO-INBOX — new entries this firing

Four new entries appended:
1. The twelfth-consecutive-firing Chrome outage (extending the standing chain).
2. `bv2a-firing09-edit-venue-facebookurl-param-does-not-exist` — the tool schema defect/gotcha described in Step 3b above.
3. `bv2a-firing09-name-mismatches-four-venues` — the four venue name/identity flags (The Square→Royal Oak, Club BH15→Poole Centenary Hall & Club, Thrapston Sports Club→Association, Lane End Football Club→Playing Fields/Sports Association), consolidated into one entry with all four ids.
4. `bv2a-firing09-campbell-park-gostrey-meadow-possible-non-venues` — the two managed-public-space findings.

## Discrepancy note for the operator

Same standing discrepancy as prior firings: the task prompt's claim path gotcha (`bv2a-claim-path-stale-in-prompt`) was already known and applied correctly without rediscovery, and was independently reconfirmed against the live RUNBOOK.md text this firing rather than taken on trust. New this firing: the `edit_venue` tool's parameter schema (`socialMediaUrls`, not `facebookUrl`) was NOT previously flagged by any prior firing's CTO-INBOX entry that this run could find — worth confirming whether earlier firings' adapter scripts calling the real MCP tool (as opposed to the validator's flat schema) used the correct parameter, or whether this is a wider undetected gap. This run's own 9 affected records were caught and corrected before the firing's validator pass, so no bad data reached bndy from this run.
