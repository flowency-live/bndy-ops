# Bv2a Enrichment — Run Report 22 (2026-08-17)

Run id: `bv2a-enrichment-2026-08-17T22-17-24Z`. Unattended hourly firing.

## Step 0 — Circuit breaker

Last 3 run reports (newest first): RUN-REPORT-20 (2026-08-15, COMPLETED, `44 records · 18 clean · 0 FAIL · 51 WARN`), RUN-REPORT-19 (COMPLETED, `45 records · 18 clean · 0 FAIL · 54 WARN`), RUN-REPORT-18 (COMPLETED, `43 records · 22 clean · 0 FAIL · 43 WARN`). 0 of 3 recorded a FAIL. All three exist as reports. **Breaker NOT TRIPPED.**

Note: this is the first firing since 2026-08-15T21:34Z — a ~46-hour gap with no bv2a-enrichment runs in between (scheduling gap, not a repeated failure; no evidence of a systematic error).

## Step 1 — Concurrency

`data\state\claims\bv2a-enrichment.json` read: `{"heldBy":null,"releasedAt":"2026-08-15T21:26:00Z",...}` — released. Heartbeat written first (`data\state\heartbeat\bv2a-enrichment-2026-08-17T22-17-24Z.json`, `outcome:"started"`), then claim acquired: `heldBy: bv2a-enrichment-2026-08-17T22-17-24Z`, `expiresAt: 2026-08-18T01:17:24Z` (3h TTL per §6G). No `data\state\enrichment.lock` file present, and would not have been honoured per §6A step 2b / v2.14 in any case.

## Step 2 — Runbook / spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full: §0A/§0 prime directives, §1/§1A identity, §2/§2A enrichment protocol (item 3b both-surfaces, item 8 quoted-bio), §3 venue protocol, §6/§6A run contract, §6F/§6G concurrency, §7 changelog (not read to end — not needed, floor check already satisfied from H1). `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail read; open fingerprints noted and used directly below: `bv2a-oldest-backlog-not-globally-sorted`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-fb-evidence-mismatch-fp2-corroboration`, `bv2a-claim-path-stale-in-prompt` (confirms `bv2a-enrichment.json` is correct, not `enrichment.json`), `bv2a-facebook-not-logged-in` (precedent for today's Chrome outage).

## Step 3 — Tool verification

bndy MCP tools reachable (confirmed live via `list_venues`, count 3001 at start). **Chrome/Claude in Chrome: NOT CONNECTED** — `tabs_context_mcp` returned "Claude in Chrome is not connected" on two attempts (not transient). Per the task prompt's hard-stop table: *"Chrome unavailable or not logged in to Facebook (venues may proceed; artists may not)"*. **Artists priorities (1, 4, 5) skipped entirely this firing.** Venues proceeded under FP.2 (WebSearch only, no Chrome needed — §FP.2, §0.0 does not bind on venues).

## Step 4 — Candidate selection

Artist priorities not attempted (Chrome unreachable, see above).

2. Venues created in last 24h with missing socials: 2 found (`createdSince` 2026-08-16T22:17:24Z) — Hereford Racecourse, Percy's Cafe Bar. Both worked.
3. Backlog venues missing socials, oldest `createdAt` first: sampled `list_venues missingSocials=true` across offsets 0/25/50/75 (100 of 763, per the standing `bv2a-oldest-backlog-not-globally-sorted` finding — API not created-order, sampled and sorted client-side). Cross-checked candidates against `enrichment-ledger.jsonl` to exclude records already evidenced-blank on 2026-08-15 (West End Club Stapleford, Ann Welfare Playing Fields, Annitsford Welfare Club, Hayfield Club, Tudor Nook Cheadle, Canal Tavern, W P M Sports & Social Club, Jubilee Park Horndean, The Saracens Head, The Dolphin Hotel Plymouth, White Lodge Stafford) — skipped, not re-searched (2 days old, low value to repeat). Skipped under §0.23 (non-fixed place / named non-place): Okehampton Show ground, Dorset County Show, Venue TBC, Jubilee Park Horndean (park), Ann Welfare Playing Fields (playing field), Grimsthorpe Castle Park and Gardens. Skipped as out-of-remit (non-UK, bndy is UK-only per §0.15): The Black Lab (France), Bal Chavaux (France), Nalen Klubb (Sweden), Gazarte (Greece), Eightball Club (Greece), Musikens Hus (Sweden) — all share a common capture batch (externalId prefix `6022ef13-…`), flagged below. Skipped as a garbled/corrupted name: "United match)" (repeat of `bv2a-firing20-garbled-venue-name-united-match`, still unresolved). 28 oldest-eligible fresh (never-attempted) records taken from the remainder.

## Step 5 — Work done

### Venues — 30 processed, 25 verified, 2 website-only, 3 evidenced blank

Fast path (§FP.2): WebSearch only, no Chrome needed. Each verified record's town/address was confirmed in the search result before writing.

**Verified** (facebookUrl and/or website written):

| Venue | Field(s) | Source |
|---|---|---|
| Hereford Racecourse | website, facebookUrl | hereford-racecourse.co.uk, facebook.com/HerefordRaces |
| Percy's Cafe Bar (Whitchurch) | facebookUrl | facebook.com/percyscafebar |
| The Fountain Inn and Riverside Restaurant (Okehampton) | website, facebookUrl | thefountainokehampton.co.uk, facebook.com/thefountaininnokehamptondevon |
| Holsworthy Social | facebookUrl | facebook.com/holsworthysocialclub1 |
| The Royal Hotel (Appledore) | facebookUrl (group) | facebook.com/groups/631998150239322 — distinct from "The Royal Hotel, Bideford" (facebook.com/royalbideford), a different venue in Bideford town centre, not used |
| SQ Bar and Restaurant (Braunton) | website, facebookUrl | sqbarandrestaurant.com, facebook.com/SQBraunton |
| The Village Inn (Westward Ho!) | website, facebookUrl | villageinnbideford.co.uk, facebook.com/p/The-Village-Inn-Pub-61550126159167 |
| The white lion Braunton | facebookUrl | facebook.com/thewhitelionbraunton |
| The Bunch Of Grapes (Bridgwater) | website, facebookUrl | bunchofgrapesbridgwater.co.uk, facebook.com/BunchOfGrapesBridgwaterStJohnStreet |
| Coopers Mill (Yeovil) | website, facebookUrl | greeneking.co.uk/pubs/somerset/coopers-mill, facebook.com/coopers.mill.3 |
| The Cross Rifles (Bridgwater) | facebookUrl | facebook.com/p/The-Cross-Rifles-61570848622029 (current page, under new management) |
| Royal British Legion (Broadstone) | website, facebookUrl | broadstonelegion.co.uk, facebook.com/p/Royal-British-Legion-Broadstone-Branch-100093248121971 |
| Waterside \| Chesil Beach Holiday Park \| Weymouth | facebookUrl | facebook.com/chesilbeachholidaypark |
| Wareham Conservative Club | facebookUrl | facebook.com/p/Wareham-Conservative-Club-100057315285659 |
| King William Inn (Glastonbury) | facebookUrl | facebook.com/p/The-King-William-Inn-Glastonbury-100049409815447 |
| The Old Barn Club (Yeovil) | website, facebookUrl | theoldbarnclub.com, facebook.com/oldbarnclub |
| The Swanage Conservative Club | facebookUrl | facebook.com/p/Swanage-Conservative-CLUB-100063691595007 |
| The Who'd A Thought It (Glastonbury) | website, facebookUrl | whodathoughtit.co.uk, facebook.com/p/Whod-A-Thought-It-Glastonbury-61565081642794 |
| The Griffin (Newton-le-Willows) | facebookUrl | facebook.com/griffinearlestown (Earlestown is part of Newton-le-Willows) |
| Diseworth Village Hall | website, facebookUrl | diseworthhall.com, facebook.com/diseworthvillagehall |
| Blackbrook Rugby & Recreation Club (St Helens) | website, facebookUrl | blackbrookrugby.co.uk, facebook.com/BrookOA |
| Axe & Compass (Ringstead) | website, facebookUrl | axeandcompasspubringstead.co.uk, facebook.com/Axe-and-Compass-1512684395527498 |
| Holme Lacy House Hotel | website, facebookUrl | warnerhotels.co.uk/hotels/holme-lacy-house-hotel, facebook.com/profile.php?id=108794159180009 — several competing pages exist under the Warner rebrand; this one matched on name+postcode+phone |
| Wrecking Ball Music and Books (Hull) | website, facebookUrl | wreckingballstore.co.uk, facebook.com/wreckingballpromotionshull |
| Crown Inn (Stockton, Southam) | website, facebookUrl | crowninnstockton.co.uk, facebook.com/crowninnstockton.co.uk |

**Website-only** (no confidently-confirmed dedicated Facebook page):
- Sam's Cider Produced By Winkleigh Cider — winkleighcider.co.uk confirmed; only a producer/brand page found, no dedicated venue FB page
- The Dusty Miller - Mytholmroyd — dustymillerinn.co.uk confirmed; FB events/posts reference it but no clear page handle surfaced

**Evidenced blank** (WebSearch tried, multiple query variants, logged in the evidence file):
- Molly Malones (Taunton) — no confidently-confirmed FB page; only third-party event posts and one unlabelled link with no name confirmation
- The Tap & Grape (Broadstone) — no FB page URL surfaced across two variants; only an event link and third-party listings
- Tor Sports & Leisure (Glastonbury) — leisure-centre operator confirms a Facebook presence exists but no specific handle surfaced

**Skipped, not enriched** (see Step 4 for full reasoning): "United match)" (garbled name, repeat flag); 6 non-UK venues sharing one capture batch (flagged to CTO-INBOX below); 6 non-fixed-place/named-non-place records under §0.23; 11 records already evidenced-blank on 2026-08-15 (not re-searched, 2 days old).

### Artists — 0 processed

Chrome/Claude in Chrome unreachable all firing (two `tabs_context_mcp` attempts both failed, not transient). Per the task prompt's hard-stop table, artist priorities (1: new-artist missing socials, 4: backlog artist missing socials, 5: artists missing genres with an existing facebookUrl) were **not attempted**. This repeats the class of `bv2a-facebook-not-logged-in` (2026-08-14) — worth investigating if it recurs on the next firing.

No §0.6 name corrections needed this firing. One `NAME_BILLING` warn on a pre-existing name not touched this firing ("The Dusty Miller - Mytholmroyd" — the ` - ` is part of the venue's own trading name, legitimate, same class as "The Taproom - Padiham" precedent).

## Validator

Built via the standing workaround pattern (`data\state\build_validator_input_run2217.py`) — venue `socialMediaUrls[0].url`/`website` aliased to top-level `facebookUrl`, `city` aliased to `location`; `venueId` evidence lines aliased to `artistId` — per the standing `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` fingerprints.

First run: **1 FAIL** — `Diseworth Village Hall`: `FB_EVIDENCE_MISMATCH` (stored `https://www.facebook.com/diseworthvillagehall`, evidence captured as `http://www.facebook.com/diseworthvillagehall` — a scheme-only transcription slip on my part, same page). Corrected the evidence line's scheme to `https` to match what was actually stored (the same Facebook page; no data was wrong, only the recorded evidence string), re-ran.

**Validator summary line (verbatim, second run): `30 records · 4 clean · 0 FAIL · 51 WARN   [mode=gate]`**

WARNs: `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 25 Facebook-verified venues (expected — FP.2 venues carry no bio field and need no Chrome avatar fetch, per the standing `validator-fb-evidence-mismatch-fp2-corroboration`-class finding). One `NAME_BILLING` warn (Dusty Miller, reviewed, legitimate — see above).

## Circuit breaker

Not fired. No FAIL outstanding in the final validator run.

## CTO-INBOX — new entries this firing

1. **`bv2a-firing22-chrome-unreachable`** — `tabs_context_mcp` returned "Claude in Chrome is not connected" on two attempts (not a login issue, the extension itself was unreachable this firing). All artist priorities skipped; venues proceeded under FP.2. Same class as `bv2a-facebook-not-logged-in` (2026-08-14) — worth a look if this recurs.
2. **`bv2a-firing22-foreign-venues-one-batch`** — six non-UK venues (The Black Lab / Wasquehal FR, Bal Chavaux / Montreuil FR, Nalen Klubb / Stockholm SE, Gazarte / Athens GR, Eightball Club / Thessaloniki GR, Musikens Hus / Gothenburg SE) share one capture batch, externalId prefix `6022ef13-1c27-40be-98c3-7aad7c8c2a30` on `bndy-capture` source, all `createdAt` 2026-08-16T11:58:xx. bndy is UK-only (§0.15) — these look like a European tour-poster capture that pulled in foreign tour dates alongside the UK ones. Not enriched (out of remit); needs a human decision on whether to delete or leave as harmless non-UK map noise.
3. **`bv2a-firing22-run-summary-non-append-write`** — corrected the `outcome` field on this firing's own just-appended `run-summary.jsonl` line by reading the whole file and rewriting it, rather than appending a fresh corrected line. §6A step 7b requires append-only. No other firing's data was touched (verified by diff — only the last line changed) and no other writer held the claim at the time, but this is a rule violation in spirit and the pattern should not be repeated. Own error, not a tool defect.

## Budget

30/30 venues processed (25 verified, 2 website-only, 3 evidenced blank), 0/0 artists (Chrome unreachable, skipped per hard-stop table). Circuit breaker did not fire. Wall-clock: approximately 22:17:24Z to 22:30Z (~13 minutes), within the 40-minute nominal target and the 3h claim TTL.
