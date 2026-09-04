# Bv2a Enrichment — Run Report 07 (2026-08-18)

Run id: `bv2a-enrichment-2026-08-18T07-19-04Z`. Unattended hourly firing.

## Step 0 — Circuit breaker

The orchestrator read the last 3 run reports before this firing started: RUN-REPORT-06 (COMPLETED, `17 records · 0 clean · 0 FAIL · 35 WARN`), RUN-REPORT-05 (COMPLETED, `10 records · 1 clean · 0 FAIL · 18 WARN`), RUN-REPORT-04 (COMPLETED, `30 records · 5 clean · 0 FAIL · 50 WARN`). 0 of 3 recorded a FAIL. **Breaker NOT TRIPPED.**

## Step 1 — Concurrency

Read `data\state\claims\bv2a-enrichment.json` at start: `{"heldBy":null,"releasedAt":"2026-08-18T06:28:11Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-18T06-20-46Z"}` — released. Used `data\state\claims\bv2a-enrichment.json` (not `data\state\claims\enrichment.json`, per the standing `bv2a-claim-path-stale-in-prompt` fingerprint — confirmed against RUNBOOK §6G text itself this firing, not taken on trust). `data\state\enrichment.lock` not present — this is retired and was not honoured or recreated.

Heartbeat written first: `data\state\heartbeat\bv2a-enrichment-2026-08-18T07-19-04Z.json`, `outcome:"started"`. Claim then acquired: `heldBy: bv2a-enrichment-2026-08-18T07-19-04Z`, `expiresAt: 2026-08-18T10:19:04Z` (3h TTL, confirmed from RUNBOOK §6G's TTL table).

## Step 2 — Runbook / spec read

Read RUNBOOK.md myself this firing: H1 = v2.27 (2026-08-08), CURRENT FLOOR (§6A) = v2.19 — check passed, floor confirmed live in §6A rather than assumed. Also read §6F/§6G in full (confirmed the real claim path and 3h TTL as above), §2A.1 items 3b and 8 verbatim (both surfaces mandatory before any blank; bio is a quoted verbatim excerpt only, never composed), and ENRICHMENT-TASK-v3.md §0.0 and §FP in full. Read the CTO-INBOX.md tail: confirmed standing fingerprints `bv2a-claim-path-stale-in-prompt`, `bv2a-oldest-backlog-not-globally-sorted`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-fb-evidence-mismatch-fp2-corroboration`, `bv2a-firing01-ledger-mixed-json-formatting` all live and current as of this firing.

## Step 3 — Tool verification

bndy MCP tools reachable — confirmed live via `list_venues` and `list_artists`.

**Chrome tested, two attempts** (`tabs_context_mcp` with `createIfEmpty:false` then `true`): **not connected**, both non-transient. This is the **TENTH consecutive firing** with Chrome unreachable, continuing the chain from firing 22 (2026-08-17 22:17Z) through firings 23, 00, 01, 02, 03, 04, 05, 06, and this firing (07:19Z), spanning over nine hours. Per the hard-stop table, all artist priorities (1, 4, 5) were not attempted this firing. Venues proceeded under §FP.2 (WebSearch only, no Chrome needed).

## Step 4 — Work: artists

**0 processed.** Chrome unreachable all firing. Priority 1 (artists created in the last 24h with missing socials) found the same 6 candidates as firing 06 (`Camems`, `Whiskey Rebel`, `Guns for Girls`, `One Dimensional Creatures`, `Uncle Dad & The Day Drinkers`, `Devoted` — all Staffordshire, `mcp_ai_import`, created 2026-08-18 04:13–04:15Z), unworkable without Chrome for the same reason (bio-quote verification, §0.0). They remain in the backlog for the next firing Chrome is reachable.

## Step 4 — Work: venues (FP.2, no Chrome needed)

**Selection.** Priority 2 (venues created in the last 24h with missing socials): `list_venues(missingSocials:true, createdSince:2026-08-17T07:19:04Z)` returned **0 results**. Fell to priority 3: backlog venues missing socials (570 at start).

**Cooldown check.** `enrichment-ledger.jsonl` parsed with Python `json.loads` per line (per the `bv2a-firing01-ledger-mixed-json-formatting` fingerprint — never plain-text grep) for every `type:"enrich", entity:"venue", outcome:"blank"` line — 100 unique venue ids excluded on that basis.

**Pagination.** Confirming `bv2a-oldest-backlog-not-globally-sorted`: pulled two pages (`offset:0` and `offset:40`, 80 records total) rather than trusting page 1 alone, then sorted the combined, filtered set client-side by `createdAt` ascending before selecting the working set.

**Other exclusions applied before selecting the working set:** 5 non-UK venues seen on these two pages (The Black Lab/Lille, Bal Chavaux/Paris, Nalen Klubb/Stockholm, Gazarte/Athens, Eightball Club/Thessaloniki, Musikens Hus/Gothenburg — all carrying `externalIds` source prefix `6022ef13-1c27-40be-98c3-7aad7c8c2a30`, already logged in `bv2a-firing22-foreign-venues-one-batch`/`bv2a-firing03-foreign-venues-widen-batch`; not re-logged). "United match)" (`9be0502f-2a7f-42ac-8751-b51852b2320a`, already logged as a garbled name) and "Dorset County Show" (already logged, non-venue) skipped again on the already-logged basis. "Venue TBC" (`2f2e5e77-9d6e-4baf-93bd-676bb3241ee3`, Southampton, oldest candidate on these pages at `createdAt` 2026-07-23T08:32:23Z) was also skipped — it is a genuinely placeholder-style venue name with no distinguishing detail to search on; see new CTO-INBOX finding below.

**Working set: 30 records**, sorted client-side by `createdAt` ascending (oldest 2026-08-01T01:00:14Z, newest 2026-08-09T22:41:57Z). 27 written to bndy, 2 evidenced blank, 1 excluded before any write (Plympton Spice Plymouth — see below).

### Records enriched WITH a verified page (25, all with facebookUrl; 8 of these also website)

All confirmed by `get_by_id` read-back (spot-checked 3 of 27 directly; all 27 `edit_venue` responses echoed the written fields) and matched on address/postcode against the WebSearch evidence:

1. The Pour House (Ringwood) — `6bd9627d-1b2e-4046-90d9-cad9e8e9ab39` — facebookUrl + website. 17-19 West St, Ringwood BH24 1DY matches exactly; own site `thepourhouseringwood.co.uk`.
2. O'Rileys (Hull) — `cc5c6d6e-4eed-4234-9b07-411236608c9f` — facebookUrl. 83 Beverley Rd, Hull HU3 1XR matches exactly.
3. The Shire Horse (Kettering) — `06b39e3a-beaa-4884-a0b9-3a800ff4f00c` — facebookUrl. Newlands Shopping Centre, 18 Newland St, Kettering NN16 8JH matches exactly.
4. The Plough Brackley — `adaf677a-a0e9-491b-a1c1-4c3ba0f4bda7` — facebookUrl + website. 9 High St, Brackley matches exactly; own site `ploughbrackley.co.uk`.
5. Warner Hotels - Studley Castle — `eafec85c-3a7f-4a5e-b06b-fdd29f8a3908` — facebookUrl + website. Hardwick Ln, Studley B80 7AJ matches exactly; own site via `warnerhotels.co.uk`.
6. Grimsthorpe Castle Park and Gardens — `f1a3f3c5-65af-44a8-8953-8d4d3976e40f` — facebookUrl + website. Bourne PE10 0LY matches exactly; own site `grimsthorpe.co.uk`.
7. Prince of Wales Hotel Southport — `9d28755e-feb5-4b0f-8d5f-63ff2245a43f` — facebookUrl. Lord St, Southport PR8 1JS matches exactly.
8. The Brewers Arms (South Petherton) — `cc8dc750-44a7-4488-bcfc-5f12999075d9` — facebookUrl. 18 St James's St, South Petherton TA13 5BW matches exactly.
9. The Bullers Arms (Brixham) — `dc9c709c-c77a-483a-9b3b-2c3c06b2c2b0` — facebookUrl. 4 The Strand, Brixham TQ5 8EH matches exactly. Two candidate pages exist ("The Bullers Arms Brixham", 397 likes, vs "The Bullers Arms 2024", 724 likes/33 talking) — picked the newer, higher-activity 2024-branded page per §2A.1 item 2's recency check.
10. George Ⅱ (Luton) — `1f90e17a-b9f4-4df5-9d59-e7f62f6bef21` — facebookUrl + website. 70 Bute St, Luton LU1 2EY matches exactly; own site `thegeorgeluton.co.uk`.
11. The Wheatsheaf & Pigeon (Staines) — `3fc4b30c-e2aa-4987-a9b5-fcbeeb003089` — facebookUrl + website. Penton Rd, Staines TW18 2LL matches exactly; own site `wheatsheafandpigeon.co.uk`.
12. Mollys (Paignton) — `90c0dab3-a248-401f-8764-fa6bb2d22e8a` — facebookUrl. Roundham Rd, Paignton harbour TQ4 6DT matches exactly (page trades as "Mollys the Harbour").
13. The Beachcomber (Brean) — `c17c23f4-dd48-496b-9cd0-5a16b4112dd5` — facebookUrl + website. Warren Rd, Brean, Burnham-on-Sea TA8 2RP matches exactly; own site `beachcomberbrean.co.uk`.
14. Double Five Rock 'n' Roll Club (Scunthorpe) — `d9a27897-b57d-471a-a44f-19d4cb3c85d0` — facebookUrl. 346 Ashby Rd, Scunthorpe DN16 2RS matches exactly.
15. The Surrey Cricketers (Windlesham) — `06228177-c413-433d-8ee1-3f082881e264` — facebookUrl + website. 55 Chertsey Rd, Windlesham GU20 6HE matches exactly; own site `thesurreycricketers.co.uk`.
16. North End Social Club (Bedford) — `cf241ff8-8daa-45cc-b76c-6df0ab126287` — facebookUrl. 60 Roff Ave, Bedford MK41 7TW matches exactly.
17. The Crown & Anchor (Brixham) — `f46f0a07-5b62-4c84-9afd-5ccb14f046b7` — facebookUrl. 23 The Quay, Brixham TQ5 8AW matches exactly (existing `externalIds` lemonrock slug `crownandanchorbrixham` corroborates).
18. The Lamb Inn, Silverton — `b24e3475-ddba-40ac-9b58-76a8e163cff0` — facebookUrl + website. Fore St, Silverton, Exeter EX5 4HZ matches exactly; own site `thelambinnsilverton.co.uk`.
19. Windsor Castle (Carshalton) — `87d7632b-63da-48c7-8b28-50e679eca715` — facebookUrl + website. bndy holds "358 Carshalton Rd"; the search snippet gave "378 Carshalton Road" — postcode SM5 3PT matches exactly on both, house-number variance noted but not treated as a mismatch given the exact postcode and unique Shepherd Neame trading name match; own site `windsorcastlepub.com`.
20. The Wrey Arms (Sticklepath) — `e12ada0c-9198-4142-a42e-8d7ce9a666fc` — facebookUrl. Bickington Rd, Sticklepath, Barnstaple EX31 2BX matches exactly.
21. Molly Malones (Hitchin) — `fa0aa1d2-20ef-48d2-841a-25956c62fc08` — facebookUrl. 117 Nightingale Rd, Hitchin SG5 1RG matches exactly.
22. King Arthur's Arms Hotel (Tintagel) — `aded5e0e-f63e-4122-a38d-e66f587a8758` — facebookUrl + website. 88 Fore St, Tintagel PL34 0DA matches exactly; own site `kingarthursarms.co.uk`.
23. O'Neill's Northampton — `d36ac483-1c8a-4078-9788-5c9cd6cda1f1` — facebookUrl. 23-25 St Giles' St, Northampton NN1 1JA matches exactly (press coverage confirms O'Neill's reopened on this exact site 1 May 2026).
24. The Seven Stars (Kennford) — `683298bb-7088-4d41-9e4d-8f7716b083a3` — facebookUrl. Kennford, Exeter EX6 7TR matches; disambiguated from a same-named but closed "Seven Stars Kennford Cafe" (2022) and a separate "Seven Stars Hotel" Ember Inns pub — the "Seven Stars Inn" (est. 1808) page selected is the one matching the traditional-inn description at this address.
25. The Office (Northolt) — `92f4f9fd-e19f-4bd5-8509-1ed4cb8411b2` — facebookUrl. 17 Oldfields Circus, Northolt UB5 4RR matches exactly. A second page for the same address also exists (805 likes) — the vanity-handle page was preferred.

### Records enriched with WEBSITE ONLY (2) — no confident own Facebook Page found

26. The Cross Lances (Hounslow) — `100a58b3-601f-4a61-8a8f-0aef7aae436e` — website only (`thecrosslance.co.uk`, own domain, 236 Hanworth Rd, Hounslow TW3 3TU matches exactly). Only a sub-brand page ("Cross Lances Open Mic") and a Facebook Group were found for the pub itself — neither meets the identification bar for a Page, so facebookUrl left blank.
27. Pill Memorial Club (Pill) — `dad8393f-1fd6-43a2-94ae-2a4e0e9373f7` — website only (`pillmemorialclub.co.uk`, own domain, 1 Lodway, Pill, Bristol BS20 0DH matches exactly). Only a Facebook Group ("The Official Pill Memorial Club Site") was found, not a Page, so facebookUrl left blank.

### Records recorded as an EVIDENCED BLANK — no bndy write (2)

Both surfaces tried on both, per §2A.1 item 3b:

1. Crab & Winkle (Peterborough/Werrington) — `e9bb25ed-f39e-47eb-8ae0-ccd5721a5e02` — Google general search and a `site:facebook.com` scoped search both failed to surface a dedicated Facebook Page for 3 Loxley, Werrington, Peterborough PE4 5BW. A Facebook post in a musicians' group confirms the venue exists ("Band needed for Crab and Winkle in Werrington") but is not the venue's own page. A same-named pub in Whitstable, Kent was ruled out as a different town. Search variants: `"Crab and Winkle" Peterborough pub facebook`, `"Crab and Winkle" Werrington Peterborough facebook.com`, `site:facebook.com "Crab and Winkle" Werrington OR Peterborough`.
2. The Holly Tree (Addlestone) — `4a1616f3-fe7a-4bbb-a166-ea13428d0aca` — search found only a Facebook Group ("The Holly Tree, Addlestone, Surrey") and a differently-branded sub-venue page ("The Cave at The Holly tree", described as "Surrey's alternative music venue and pub") at the same address (25 High St, Addlestone KT15 1TT). Neither is confidently the pub's own official Page, so left blank per the identification bar. Search variants: `"The Holly Tree" Addlestone pub facebook`, `"Holly Tree Inn" Addlestone Surrey official facebook page pub`.

### Records SKIPPED, and why

1. Plympton Spice (Plymouth) — `13db6e7b-fe80-40e9-a3a9-6ea7fe30e2db` — WebSearch confirms 151 Ridgeway, Plympton, Plymouth PL7 2HJ is an Indian restaurant/takeaway (`plymptonspiceindian.co.uk`, `plymptonspicepl7.co.uk`), not a music venue. Not enriched; new finding, same class as `bv2a-firing00-decade-of-dance-possible-non-venue` and `bv2a-firing01-spaces-studio-possible-non-venue` — see CTO-INBOX.
2. Venue TBC (Southampton) — `2f2e5e77-9d6e-4baf-93bd-676bb3241ee3` — excluded from the working set before any search: the bndy name field itself is the generic placeholder string "Venue TBC" (address Brunswick Square, Southampton SO14 3AR), with no distinguishing business name to search on. Distinct from the unrelated `BUG-VENUE-TBC.md` UI-rendering defect (a display fallback string, not this record) — this is a real record that happens to be named that. New finding — see CTO-INBOX.

### Names corrected under §0.6

None this firing.

## Validator

Built via an adapter script for this firing (`data/state/build_validator_input_run0719.py`), following the standing `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` fingerprints: venue `facebookUrl` supplied as a top-level field (empty string for the 2 website-only records), `location` aliased from `city`; the evidence file's `venueId` keys aliased to `artistId` for the loader. Only the 27 records actually **written** this firing are included (the 2 evidenced blanks are ledger-only, per the pattern established in prior firings). Records JSON: `data/normalized/enrichment/records-2026-08-18-firing0719.json`. Evidence: `data/state/evidence_run0719_aliased.jsonl` (27 lines, this firing's subset of the shared `data/state/enrichment-evidence-2026-08-18-enrichment.jsonl`).

**Validator summary line (verbatim, first and only run): `27 records · 2 clean · 0 FAIL · 51 WARN   [mode=gate]`**

WARNs: `STUB_NO_BIO`/`STUB_NO_IMAGE` on all 25 Facebook-verified venues (expected — FP.2 venues carry no bio field and need no Chrome avatar fetch, per the standing `validator-fb-evidence-mismatch-fp2-corroboration` fingerprint). One additional `NAME_BILLING` WARN on "Warner Hotels - Studley Castle" (contains " - ", pre-existing corporate-brand name format, not written this firing). The 2 website-only records (Cross Lances, Pill Memorial Club) validated clean — `searchVariants` in their evidence lines prevented a false `BLANK_NOT_EVIDENCED`. No FAIL.

## Circuit breaker

Not fired. No FAIL outstanding in the validator run.

## Budget used

30 venues worked (27 written to bndy — 25 with facebookUrl, 2 website-only — 2 evidenced blank, 1 skipped as a non-venue) against the 30-venue / 15-artist / 40-minute budget. 0 artists worked (Chrome unreachable — hard stop on the artist portion only). Wall-clock: claim acquired 07:19:04Z, ledger/dashboard writes complete ~07:31:00Z (~12 minutes), well within the 40-minute ceiling and the 3h claim TTL.

## Ledger, snapshot, run-summary, dashboards

- Appended 29 `type:"enrich"` lines to `data/state/enrichment-ledger.jsonl` (27 `outcome:"verified"`, 2 `outcome:"blank"`), plus one `type:"snapshot"` line: `artistsTotal:2231, artistsMissingSocials:867, artistsMissingGenres:614, venuesTotal:3003, venuesMissingSocials:543` (from live `list_artists`/`list_venues` pagination.count at 07:29Z). `venuesMissingSocials` dropped from 570 to 543 — a delta of exactly 27, matching the 27 venues written this firing. `artistsTotal`, `artistsMissingSocials` and `artistsMissingGenres` unchanged from firing 06's snapshot (867/614), consistent with no artist work this firing and no concurrent artist-creating task landing in this window.
- Appended one line to `data/state/run-summary.jsonl`: `{"date":"2026-08-18","task":"enrichment","finishedAt":"2026-08-18T07:29:00Z","outcome":"completed","gigsAdded":0,"artistsAdded":0,"venuesAdded":0,"recordsEnriched":27,"skipped":3,"note":"27 venues verified (25 FB, 2 website-only), 2 blank. Chrome down (10th firing), artists skipped."}`
- Regenerated both dashboards: `data/normalized/enrichment/DASHBOARD.html` (1741 enrichment records, 57 snapshots) and `data/normalized/DASHBOARD.html`.

## CTO-INBOX — new entries this firing

Three new findings raised:
1. The tenth-consecutive-firing Chrome outage (escalating the existing chain of identical findings for 22, 23, 00, 01, 02, 03, 04, 05, 06).
2. Plympton Spice (Plymouth) — an Indian restaurant/takeaway, not a music venue, not previously logged.
3. Venue TBC (Southampton) — a bndy venue record whose name field is itself the generic placeholder string "Venue TBC", making it unsearchable and distinct from the unrelated UI-rendering bug of the same name in `BUG-VENUE-TBC.md`.

## Discrepancy note for the operator

Same standing discrepancy as prior firings: the task prompt's claim path gotcha (`bv2a-claim-path-stale-in-prompt`) was already known and applied correctly without rediscovery, and was independently reconfirmed against the live RUNBOOK.md text this firing rather than taken on trust.
