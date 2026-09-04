# Bv2a Enrichment — Run Report 02 (2026-08-18)

Run id: `bv2a-enrichment-2026-08-18T02-18-08Z`. Unattended hourly firing.

## Step 0 — Circuit breaker

Read the last 3 run reports directly (newest first): RUN-REPORT-01 (2026-08-18, COMPLETED, `30 records · 11 clean · 0 FAIL · 39 WARN`), RUN-REPORT-00 (2026-08-18, COMPLETED, `28 records · 9 clean · 0 FAIL · 39 WARN`), RUN-REPORT-23 (2026-08-17, COMPLETED, `30 records · 9 clean · 0 FAIL · 42 WARN`). 0 of 3 recorded a FAIL, all three exist as reports and all three wrote a report. **Breaker NOT TRIPPED.**

## Step 1 — Concurrency

`data\state\claims\bv2a-enrichment.json` read: `{"heldBy":null,"releasedAt":"2026-08-18T01:44:00Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-18T01-18-09Z"}` — released. Heartbeat written first (`data\state\heartbeat\bv2a-enrichment-2026-08-18T02-18-08Z.json`, `outcome:"started"`), then claim acquired: `heldBy: bv2a-enrichment-2026-08-18T02-18-08Z`, `expiresAt: 2026-08-18T05:18:08Z` (3h TTL per §6G). No `data\state\enrichment.lock` file present; not honoured, not recreated (§6A step 2b / v2.14). Used `data\state\claims\bv2a-enrichment.json` per the standing `bv2a-claim-path-stale-in-prompt` fingerprint, not the task prompt's stated path.

## Step 2 — Runbook / spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed (v2.27 ≥ v2.19). Read in full this firing: §0A/§0 prime directives, §1/§1A identity, §2/§2A enrichment protocol (item 3b both-surfaces-before-blank, item 8 quoted-bio), §3 venue protocol, §4/§5 event model, §6/§6A run contract (steps 0, 1, 2, 2a, 2b, 3, 7b, 8), §6B platform facts, §6C failure classes, §6D/§6D-bis event identity, §6E horizons, §6F/§6G concurrency, §7 changelog. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full (also full document read). `CTO-INBOX.md` tail read in full; open fingerprints used directly this firing: `bv2a-claim-path-stale-in-prompt`, `bv2a-oldest-backlog-not-globally-sorted` (list_venues fetched in full across 7 offsets of 100, 672 of 672 missing-socials venues retrieved and sorted client-side by `createdAt`), `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` (adapter script pattern replicated: venue `socialMediaUrls[0].url` aliased to top-level `facebookUrl`, `city`/address-town aliased to `location`; `venueId` evidence lines aliased to `artistId` for the loader), `validator-fb-evidence-mismatch-fp2-corroboration` (expected STUB_NO_BIO/STUB_NO_IMAGE WARNs on FP.2 venues), `bv2a-chrome-unreachable-four-consecutive-firings` (this firing is the FIFTH consecutive occurrence — see Step 3).

## Step 3 — Tool verification

bndy MCP tools reachable (confirmed live via `list_venues`, count 3001 at start; `list_artists`, count 2222). **Chrome/Claude in Chrome: NOT CONNECTED** — `tabs_context_mcp` returned "Claude in Chrome is not connected" on two attempts (`createIfEmpty:false` then `createIfEmpty:true`), not transient.

⚠ **THIS IS THE FIFTH CONSECUTIVE FIRING WITH THIS OUTAGE** (firing 22 at 22:17Z 08-17, firing 23 at 23:17Z 08-17, firing 00 at 00:20Z 08-18, firing 01 at 01:18Z 08-18, this firing at 02:18Z 08-18). Per the task prompt's hard-stop table: *"Chrome unavailable or not logged in to Facebook (venues may proceed; artists may not)"*. **All artist priorities (1, 4, 5) skipped entirely this firing.** Venues proceeded under §FP.2 (WebSearch only, no Chrome needed).

## Step 4 — Candidate selection

Artist priorities not attempted (Chrome unreachable; artist backlog unchanged this firing: missing socials 861, missing genres 612 — static across all five firings).

1. Venues created in last 24h with missing socials: `createdSince` 2026-08-17T02:18:08Z — **0 found**.
2. Backlog venues missing socials, oldest `createdAt` first: `list_venues(missingSocials=true)` — fetched the FULL set (672 of 672, 7 calls of 100 across offsets 0–600), deduplicated and sorted client-side by `createdAt` (per the standing `bv2a-oldest-backlog-not-globally-sorted` finding).

   Cross-checked every candidate against `enrichment-ledger.jsonl` blank-outcome and enrich-outcome entries (jq parse, format-agnostic per the standing `bv2a-firing01-ledger-mixed-json-formatting` finding) and excluded all within the 90-day cooldown: HalfWay House, Darcy's, St Nicholas' Chapel, The Decorated Dead Tattoo Studio, Handcross Bowls Club, Life of Riley, Hartlepool United FC Supporters Association, The White Hart (Whaley Bridge), The Tannery (Derby), West End Club (Stapleford), Hayfield Club, Annitsford Welfare Club, Spaces Studio, Swadlincote Town Hall, Decade of Dance, Hebburn Town Football Club, South Shields National Unionist Workers Club Ltd, Britannia Inn (Leek), West Park Long Eaton, The Foresters Arms (Swadlincote), The Diversion Bars ltd, Tudor Nook Cheadle, Post Office Burslem, Seabridge, Kidsgrove Masonic Club, Black Horse Chester Le Street, Canal Tavern, W P M Sports & Social Club, Jubilee Park Horndean, The Saracens Head (Wilderspool Causeway), Sandbach Town Hall (2026-08-07 blank), The King's Arms Stafford (2026-08-15 blank), The Dolphin Hotel Plymouth, The Saracens Head (Newton Abbot).

   Skipped, already flagged pending human review (not re-searched): Jorge Wilson + Jesse James (garbled name), "United match)" (garbled name, repeat of `bv2a-firing20-garbled-venue-name-united-match`).
   Skipped under §0.23 (non-fixed place): Meriton Road Park, Madeley Carnival, Darlington Market Square, Venue TBC, Jubilee Park Horndean, Newsham Park & Garden, Ann Welfare Playing Fields.

   30 oldest-eligible records taken from the remainder, `createdAt` ranging **2026-07-09 (Inn on the Beach) to 2026-07-31 (DT's, part of a large 2026-07-31 Devon/Torbay capture batch)**.

## Step 5 — Work done

### Venues — 30 considered, 23 enriched (23 verified with facebookUrl, 20 also website), 7 evidenced blank

Fast path (§FP.2): WebSearch only, no Chrome needed. Each verified record's address/postcode was checked against the search result before writing.

**Verified — facebookUrl written** (address/postcode match to the bndy record in every case unless noted):

| Venue | Field(s) | Source |
|---|---|---|
| Inn on the Beach | website, facebookUrl | facebook.com/InnonthebeachHaylingIsland — 97 Sea Front PO11 0AS matches |
| The Milbourne Arms | website, facebookUrl | facebook.com/TheMilbourneArmsHolywellNE250LL — NE25 0LL in the page handle itself |
| Mr Ants Hexham | website, facebookUrl | facebook.com/mrantsbar — 22 Priestpopple NE46 1PQ matches |
| Top Hoose | website, facebookUrl | facebook.com/p/The-Top-Hoose-61579863939196 — Amble/Morpeth NE65 0NH matches |
| Northern Social Club | website, facebookUrl | facebook.com/pages/The-Northern-social-club/209771632405282 — Ridgeway, Ashington NE63 9TL matches |
| The Quakerhouse | website, facebookUrl | facebook.com/TheQuakerhouse — 2 Mechanics Yard, Darlington DL3 7QF matches |
| Shape (Patisserie & Bakehouse) | facebookUrl | facebook.com/p/Shape-Patisserie-and-Bake-61578019030790 — 33 Horse Market, Darlington DL3 7QW matches |
| The Caves | facebookUrl | facebook.com/thecavesedinburgh — Niddry Street South, Edinburgh EH1 1NS matches; picked over two smaller candidate pages on follower count (9,557) and live gig activity |
| MacArts | website, facebookUrl | facebook.com/MacArtsCentre — centre of Galashiels TD1 1SP matches |
| Stereo | website, facebookUrl | facebook.com/stereoglasgow — 22-28 Renfield Lane G2 5AR matches |
| Daltons | website, facebookUrl | facebook.com/Daltons.Showrooms — Lower Promenade, Madeira Drive, Brighton BN2 1TB matches |
| The Piper | website, facebookUrl | facebook.com/ThePiperCall — 1 Norman Road, St Leonards-on-Sea TN37 6NH matches |
| Bedford Esquires - Music Venue | website, facebookUrl | facebook.com/bedfordesquires — 60 Bromham Road, Bedford MK40 2QG matches |
| Suffield Arms | website, facebookUrl | facebook.com/TheSuffieldArms — Thorpe Market NR11 8UE matches |
| The General Havelock | facebookUrl | facebook.com/GeneralHavelockIlkeston — disambiguated by postcode (DE7 5FW) from same-name pubs in Ilford, Hexham and High Wycombe |
| The Coopers Tavern | facebookUrl | facebook.com/cooperstavernburton — 43 Cross Street, Burton upon Trent DE14 1EG matches |
| Alberts Bar | facebookUrl | facebook.com/AlbertsBarTLH — Belgrave Road, Torquay TQ2 5HL matches (TLH Victoria Hotel) |
| The Alice Cross Centre | website, facebookUrl | facebook.com/alicecrosscentre — 1-3 Bitton Park Road, Teignmouth TQ14 9BT matches (community hub) |
| Aztec Bistro & Bar | facebookUrl | facebook.com/AztecBistro — Falkland Road, Torquay TQ2 5JJ matches (Derwent Hotel) |
| The Babbacombe Inn | facebookUrl | facebook.com/BabbacombeInn — 59 Babbacombe Downs Road TQ1 3LP matches |
| Berry Head Hotel | website, facebookUrl | facebook.com/berryhead.hotel.1 — Berry Head Road, Brixham TQ5 9AJ matches |
| The New Quay Inn | facebookUrl | facebook.com/TheNewQuayInn — New Quay Street, Teignmouth TQ14 8DA matches |
| The Dartmouth Inn | facebookUrl | facebook.com/thedartmouthinn — 63 East Street, Newton Abbot TQ12 2JP matches |

**Evidenced blank** (WebSearch tried, multiple query variants, logged in the evidence file):
- The Graduate (Sheffield) — pub confirmed at Surrey Street, but the FB page URL never surfaced across three query variants; a found postcode (S1 2LG) also does not exactly match bndy's S1 2LH — left blank rather than risk a wrong-postcode match
- Seven Stars (Ponteland) — two candidate FB pages (`214029558651300`, `61554854807963`), no way to confirm which is current
- 1865, 1 Carlton Pl (Southampton) — bndy's stored address (1 Carlton Pl, SO15 2DY) does not match the known Southampton venue "The 1865" (25-27 Brunswick Square) — flagged as a possible record-quality issue below, not enriched
- The Stumble Inn, Long Eaton — two candidate FB pages (`thestumble`, a newer numeric-id page), management changed in 2025, no way to confirm which is current
- Bay View (Brixham) — only a same-name "Bay View Bar" found, at Brixham Holiday Park / Fishcombe Road (TQ5 8RB), which does not match bndy's stored address (295 Gillard Road, TQ5 9AP) — different location, not enriched
- The Devonport Arms (Paignton) — address confirmed (42 Elmbank Road, TQ4 5NG) but no confirmable Facebook URL surfaced
- DT's (Torquay) — address confirmed (73 South Street, TQ2 5AA) but two conflicting Facebook page ids surfaced for the same business name, no way to confirm the canonical one

### Artists — 0 processed

Chrome/Claude in Chrome unreachable all firing (`tabs_context_mcp` failed on two attempts, both non-transient — same failure signature as firings 22, 23, 00 and 01). Per the task prompt's hard-stop table, artist priorities (1: new-artist missing socials, 4: backlog artist missing socials, 5: artists missing genres with an existing facebookUrl) were **not attempted**. **This is the FIFTH consecutive firing with this outage.**

No §0.6 name corrections needed this firing (no artist writes).

## Validator

Built via the standing workaround pattern (own script) — venue `socialMediaUrls[0].url` aliased to top-level `facebookUrl`, `city` (or the address-derived town where `city` was blank: The General Havelock, The Coopers Tavern, The Stumble Inn) aliased to `location`; `venueId` evidence lines aliased to `artistId` for the loader — per the standing `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` fingerprints. Records JSON and evidence JSONL built from the same 30 writes/non-writes made this firing.

**Validator summary line (verbatim, first and only run): `30 records · 7 clean · 0 FAIL · 48 WARN   [mode=gate]`**

WARNs: `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 23 Facebook-verified venues (expected — FP.2 venues carry no bio field and need no Chrome avatar fetch, per the standing `validator-fb-evidence-mismatch-fp2-corroboration`-class finding). Two `NAME_BILLING` WARNs on pre-existing bndy names not edited this firing ("Shape (Patisserie & Bakehouse)" — parenthetical; "Bedford Esquires - Music Venue" — promo-tail pattern) — both are how the records were already named in bndy, same class as prior "The Valiant - Leek" / "Murton Club (Official)" precedents.

## Circuit breaker

Not fired. No FAIL outstanding in the validator run.

## CTO-INBOX — new entries this firing

1. **`bv2a-chrome-unreachable-five-consecutive-firings`** — Claude in Chrome unreachable for a FIFTH consecutive firing: firing 22 (2026-08-17 22:17Z), firing 23 (2026-08-17 23:17Z), firing 00 (2026-08-18 00:20Z), firing 01 (2026-08-18 01:18Z), and this firing (2026-08-18 02:18Z). `tabs_context_mcp` "not connected" on two attempts each time, not transient. The artist backlog (861 missing socials, 612 missing genres) has now been static across all five firings — over four hours of unattended runs with zero artist movement. Escalating again: this looks like it needs a human to check the Chrome extension install/login state directly, not a sixth automatic retry.
2. **`bv2a-firing02-1865-carlton-place-address-mismatch`** — venue record "1865, 1 Carlton Pl" (Southampton, id `e29b150b-0939-4d49-bd7a-a5099d9528af`) carries postcode SO15 2DY, but Southampton's known "The 1865" live-music venue is at 25-27 Brunswick Square, a different address entirely. Not enriched — needs a human check of whether this bndy record is the same venue with a wrong address, or a genuinely different, unfound place.

## Budget

23/30 venue records written to bndy (23 verified with facebookUrl, 20 of those also website), 7/30 evidenced blank. 0/0 artists (Chrome unreachable, skipped per hard-stop table). Circuit breaker did not fire. Wall-clock: approximately 2026-08-18T02:18:08Z to 02:30:00Z (~12 minutes), well within the 40-minute nominal target and the 3h claim TTL.
