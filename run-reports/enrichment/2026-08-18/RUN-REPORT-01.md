# Bv2a Enrichment — Run Report 01 (2026-08-18)

Run id: `bv2a-enrichment-2026-08-18T01-18-09Z`. Unattended hourly firing.

## Step 0 — Circuit breaker

Read the last 3 run reports directly (newest first): RUN-REPORT-00 (2026-08-18, COMPLETED, `28 records · 9 clean · 0 FAIL · 39 WARN`), RUN-REPORT-23 (2026-08-17, COMPLETED, `30 records · 9 clean · 0 FAIL · 42 WARN`), RUN-REPORT-22 (2026-08-17, COMPLETED, `30 records · 9 clean · 0 FAIL · 51 WARN`). 0 of 3 recorded a FAIL, all three exist as reports and all three wrote a report. **Breaker NOT TRIPPED.**

## Step 1 — Concurrency

`data\state\claims\bv2a-enrichment.json` read: `{"heldBy":null,"releasedAt":"2026-08-18T00:31:30Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-18T00-20-46Z"}` — released. Heartbeat written first (`data\state\heartbeat\bv2a-enrichment-2026-08-18T01-18-09Z.json`, `outcome:"started"`), then claim acquired: `heldBy: bv2a-enrichment-2026-08-18T01-18-09Z`, `expiresAt: 2026-08-18T04:18:09Z` (3h TTL per §6G). No `data\state\enrichment.lock` file present; would not have been honoured or recreated in any case per §6A step 2b / v2.14. Used `data\state\claims\bv2a-enrichment.json`, not the task prompt's stale `enrichment.json` path (per the standing `bv2a-claim-path-stale-in-prompt` fingerprint).

## Step 2 — Runbook / spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed (v2.27 ≥ v2.19). Read in full this firing: §0A/§0 prime directives, §1/§1A identity, §2/§2A enrichment protocol (item 3b both-surfaces-before-blank, item 8 quoted-bio), §3 venue protocol, §6A run contract (steps 0, 1, 2, 2a, 2b, 3, 7b, 8), §6F/§6G concurrency. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail read in full; open fingerprints used directly this firing: `bv2a-claim-path-stale-in-prompt`, `bv2a-oldest-backlog-not-globally-sorted` (list_venues sampled/fetched in full across 7 offsets of 100, 692 of 692 missing-socials venues retrieved and sorted client-side by `createdAt`), `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` (adapter script pattern replicated from `build_validator_input_run2217.py`), `validator-fb-evidence-mismatch-fp2-corroboration` (expected STUB_NO_BIO/STUB_NO_IMAGE WARNs on FP.2 venues), `bv2a-chrome-unreachable-three-consecutive-firings` (this firing is the 4th consecutive occurrence — see Step 3), `enrich-venue-batch-array-not-parsed` (skipped batch `enrich_venue`, went straight to WebSearch per FP.2).

## Step 3 — Tool verification

bndy MCP tools reachable (confirmed live via `list_venues`, count 3001 at start). **Chrome/Claude in Chrome: NOT CONNECTED** — `tabs_context_mcp` returned "Claude in Chrome is not connected" on two attempts (`createIfEmpty:false` then `createIfEmpty:true`), not transient.

⚠ **THIS IS THE FOURTH CONSECUTIVE FIRING WITH THIS OUTAGE** (firing 22 at 22:17Z 08-17, firing 23 at 23:17Z 08-17, firing 00 at 00:20Z 08-18, this firing at 01:18Z 08-18). Per the task prompt's hard-stop table: *"Chrome unavailable or not logged in to Facebook (venues may proceed; artists may not)"*. **All artist priorities (1, 4, 5) skipped entirely this firing.** Venues proceeded under §FP.2 (WebSearch only, no Chrome needed).

## Step 4 — Candidate selection

Artist priorities not attempted (Chrome unreachable; artist backlog unchanged this firing: missing socials 861, missing genres 612).

1. Venues created in last 24h with missing socials: `createdSince` 2026-08-17T01:18:09Z — **0 found**.
2. Backlog venues missing socials, oldest `createdAt` first: `list_venues(missingSocials=true)` — fetched the FULL set (692 of 692, 7 calls of 100 across offsets 0–600), deduplicated and sorted client-side by `createdAt` (per the standing `bv2a-oldest-backlog-not-globally-sorted` finding — the API is not created-order).

   Cross-checked every candidate against the FULL history of `enrichment-ledger.jsonl` blank-outcome entries for venues (76 unique ids, format-agnostic `jq` parse — the ledger mixes compact and spaced JSON across firings, a plain-text grep silently misses roughly half of them) and excluded all of them, since §9 states a 90-day cooldown on `no-page-found` and the ledger's entire history (from 2026-08-01) is inside that window.

   Skipped as a garbled/corrupted name: "United match)" (repeat of `bv2a-firing20-garbled-venue-name-united-match`) and "Jorge Wilson + Jesse James" (reads as two artist names, not a venue name — new finding, flagged below).
   Skipped under §0.23 (non-fixed place): Meriton Road Park, Darlington Market Square, Venue TBC.
   Skipped, already flagged pending human review from firing 00: Decade of Dance (`bv2a-firing00-decade-of-dance-possible-non-venue`).

   30 oldest-eligible records taken from the remainder, `createdAt` ranging **2025-09-25 (HalfWay House) to 2026-07-02 (The Deco)**.

## Step 5 — Work done

### Venues — 30 considered, 20 enriched (19 verified with facebookUrl, 1 website-only), 9 evidenced blank, 1 skipped (record-quality concern)

Fast path (§FP.2): WebSearch only, no Chrome needed, batch `enrich_venue` skipped per the standing `enrich-venue-batch-array-not-parsed` defect. Each verified record's address/postcode was checked against the search result before writing.

**Verified — facebookUrl written** (address/postcode match to the bndy record in every case):

| Venue | Field(s) | Source |
|---|---|---|
| Murton Club (Official) | facebookUrl | facebook.com/murtonofficials — 22 Wood's Terrace, Murton, Seaham matches exactly |
| Cramlington Workingmens Social Club | facebookUrl | facebook.com/Cramlingtonvillageclub — postcode NE23 6QJ matches; multiple sources confirm the club is known locally as both names |
| The Miners Bar & Kitchen | facebookUrl | facebook.com/ingarforth — 4 Aberford Rd, Garforth matches exactly |
| Hardwick Social Club | website, facebookUrl | thehardwicksocialclub.com, facebook.com/p/Hardwick-Social-Club-100085513703619 — Harrowgate Lane TS19 8TD matches, live music Thu–Sat confirmed |
| Red House Farm Public House | website, facebookUrl | redhousefarmwhitley.com, facebook.com/RHFPUB — Hepscott Drive NE25 9XJ matches exactly |
| The Sundial | facebookUrl | facebook.com/thenewsundialsouthshields — Sea Road NE33 2LD matches exactly (venue now trades as "The New Sundial"; bndy name not changed) |
| The Grove Inn | facebookUrl | facebook.com/TheGroveInn — Back Row, Holbeck LS11 5PL matches exactly |
| Red Lion | facebookUrl | facebook.com/TheofficialRedLionLinton — 28 Main St, Linton DE12 6PZ matches exactly |
| E Rooms Bar and Music Venue | website, facebookUrl | erooms.org.uk, facebook.com/EROOMSCIC — 14 Westgate WN8 8AZ matches exactly |
| Sanctuary, Hartshill | website, facebookUrl | sanctuaryhartshill.co.uk, facebook.com/SanctuaryAleHouse — 493–495 Hartshill Rd matches |
| The Albert, Brindley Street, Newcastle | facebookUrl | facebook.com/p/The-Albert-61557432818539 — 1 Brindley St, ST5 2DA matches exactly |
| The Swan Hotel & Restaurant | facebookUrl | facebook.com/theswanstafford — 46a Greengate St, Stafford ST16 2JA matches exactly |
| The Old Springs Inn | facebookUrl | facebook.com/oldspringsinn — Spring Rd, Orrell, Wigan WN5 0JJ matches exactly |
| The Museum, Newcastle under Lyme | facebookUrl | facebook.com/p/The-Museum-100063653735124 — 29 George St matches exactly |
| The King's Arms | website, facebookUrl | kingsarmsemsworth.co.uk, facebook.com/p/The-Kings-Arms-Emsworth-100063538961718 — 19 Havant Rd, PO10 7JD matches exactly |
| Swan & Chequers | facebookUrl | facebook.com/SwanAndChequers — 16 Hightown, Sandbach matches exactly |
| Thirteen Club | website, facebookUrl | 13clubalsager.co.uk, facebook.com/th1rt3enclub — Cedar Ave, Alsager ST7 2PH matches exactly |
| The Plough Inn | facebookUrl | facebook.com/ploughkidsgrove — 105 Liverpool Rd, Kidsgrove matches exactly |
| The Deco | website, facebookUrl | thedecopub.co.uk, facebook.com/TheDecoPub — 128 Elm Grove matches exactly |

**Website-only** (no confidently-confirmed dedicated Facebook page):
- Shakespeare Inn (Shardlow, Derby) — shakespeareinn.co.uk confirmed; two competing Facebook pages (shakey2017, shakey117) with no way to confirm which is current — left blank rather than guess, same pattern as firing 23's Kings Head/Britannia Inn precedent

**Evidenced blank** (WebSearch tried, multiple query variants, logged in the evidence file):
- HalfWay House (Ashton-under-Lyne) — no confidently-confirmed dedicated page; only same-name pubs elsewhere (Royton, Sevenoaks, Challock, Torpoint) and generic community-group posts surfaced
- Swadlincote Town Hall — two candidate pages, neither confidently the town hall's own; no website surfaced beyond Wikipedia
- Hebburn Town Football Club — bndy address is the Trustmark Group Stadium; search surfaced both "Hebburn Town FC" and a separate "Hebburn Sports Club" (16 South Drive) with live-music/social-venue framing — could not confirm which entity, or whether either, matches the bndy record's stadium address
- South Shields National Unionist Workers Club Ltd — bndy postcode NE33 5QP; the club's own listings give NE33 5SZ, and two candidate FB pages exist (Southshieldsunionistclub, TheUnionistSouthShields) — postcode drift plus page ambiguity, left blank per §0.24
- The Foresters Arms (Swadlincote) — two candidate pages ("Foresters Arms Swadlincote New" vs "Foresters Arms Swadlincote"), descriptions differ (karaoke vs weekend entertainment), no way to confirm current
- The Diversion Bars ltd (Macclesfield) — now trading as "Diversion Bar & Kitchen" at the same address (23b Church St, confirmed); only an Instagram handle surfaced, no Facebook page URL found in two search variants
- Post Office, Burslem — two distinct "Post Office"-named pubs found in Burslem itself (Post Office Vaults, 3 Market Pl; The Old Post Office, ST6 4JH), neither postcode confidently matches bndy's ST6 3AA — left blank rather than attach the wrong building
- Kidsgrove Masonic Club — only a private Facebook GROUP found ("Kidsgrove Social Club (Masonic Hall)"), not a public page — left blank
- Black Horse Chester Le Street — two candidate pages (a "new page 2024" and an established cocktail-bar rebrand page from 2019), no way to confirm which is current

**Skipped, not enriched** (record-quality concern, flagged to CTO-INBOX below rather than forced):
- Spaces Studio (Burton upon Trent, id `74ea5a81-09d8-47ce-8cc5-955df975bd45`) — search results describe this consistently as an interior-design/kitchen-showroom business (spacesstudio.uk), not a music venue. Possible mis-classified record, same class as firing 00's Decade of Dance finding.

### Artists — 0 processed

Chrome/Claude in Chrome unreachable all firing (`tabs_context_mcp` failed on two attempts, both non-transient — same failure signature as firings 22, 23 and 00). Per the task prompt's hard-stop table, artist priorities (1: new-artist missing socials, 4: backlog artist missing socials, 5: artists missing genres with an existing facebookUrl) were **not attempted**. **This is the FOURTH consecutive firing with this outage.**

No §0.6 name corrections needed this firing (no artist writes).

## Validator

Built via the standing workaround pattern (own script, following `build_validator_input_run2217.py`'s approach) — venue `facebookUrl` aliased to `socialMediaUrls[0].url`, `location` aliased to `city`; `venueId` evidence lines aliased to `artistId` for the loader — per the standing `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` fingerprints. Records JSON and evidence JSONL built from the same 30 writes/non-writes made this firing.

**Validator summary line (verbatim, first and only run): `30 records · 11 clean · 0 FAIL · 39 WARN   [mode=gate]`**

WARNs: `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 19 Facebook-verified venues (expected — FP.2 venues carry no bio field and need no Chrome avatar fetch, per the standing `validator-fb-evidence-mismatch-fp2-corroboration`-class finding). One `NAME_BILLING` WARN on "Murton Club (Official)" — the parenthetical is the pre-existing bndy name, not introduced this firing; not edited, same class as prior "The Valiant - Leek" precedent.

## Circuit breaker

Not fired. No FAIL outstanding in the validator run.

## CTO-INBOX — new entries this firing

1. **`bv2a-chrome-unreachable-four-consecutive-firings`** — Claude in Chrome unreachable for a FOURTH consecutive firing: firing 22 (2026-08-17 22:17Z), firing 23 (2026-08-17 23:17Z), firing 00 (2026-08-18 00:20Z), and this firing (2026-08-18 01:18Z). `tabs_context_mcp` "not connected" on two attempts each time, not transient. The artist backlog (861 missing socials, 612 missing genres) has now been static across all four firings. Repeating the prior recommendation with more weight: this looks like it needs a human to check the Chrome extension install/login state directly.
2. **`bv2a-firing01-jorge-wilson-jesse-james-garbled-venue-name`** — venue record "Jorge Wilson + Jesse James" (Staffordshire) reads as two artist/act names concatenated, not a venue name — likely a bad capture where an artist billing string ended up in the venue name field. Not enriched, not skipped-searched. Needs a human check of the source record.
3. **`bv2a-firing01-spaces-studio-possible-non-venue`** — venue record "Spaces Studio" (Burton upon Trent, id `74ea5a81-09d8-47ce-8cc5-955df975bd45`) reads as an interior-design/kitchen-showroom business (spacesstudio.uk), not a music venue. Not enriched. Same class as firing 00's Decade of Dance finding — needs a human check of whether this record should exist as a bndy venue.
4. **`bv2a-firing01-old-springs-inn-city-field-wrong`** — venue "The Old Springs Inn" (id `7e60b0c1-a753-43ab-92c7-744319333d52`) carries `city: "Staffordshire"` in bndy but its address and confirmed Facebook page (facebook.com/oldspringsinn) place it in Orrell, Wigan, Lancashire — postcode WN5 0JJ matches exactly, so the enrichment was made on the postcode, but the `city` field looks wrong and may misroute regional searches. Same class as firing 00's George Inn Andover finding. Two other records in this firing's candidate batch (The Swan Hotel & Restaurant, The Museum) also carry `city: "Staffordshire"` as a catch-all rather than the actual town — worth a broader check of how many records share this pattern.
5. **`bv2a-firing01-ledger-mixed-json-formatting`** — `enrichment-ledger.jsonl` mixes compact (`"outcome":"blank"`) and spaced (`"outcome": "blank"`) JSON across different firings' writes. A plain-text `grep` for the compact form alone silently misses roughly half of all blank-outcome lines (37 of 76 unique venue ids were missed this way before switching to a format-agnostic `jq` parse). Not a data-loss defect, but a real correctness trap for any future firing doing a text-based cooldown check instead of parsing each line as JSON.

## Budget

20/30 venue records written to bndy (19 verified, 1 website-only), 9/30 evidenced blank, 1/30 skipped (record-quality concern). 0/0 artists (Chrome unreachable, skipped per hard-stop table). Circuit breaker did not fire. Wall-clock: approximately 2026-08-18T01:18:09Z to 01:42:00Z (~24 minutes), within the 40-minute nominal target and well within the 3h claim TTL.
