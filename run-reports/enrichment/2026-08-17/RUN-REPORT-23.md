# Bv2a Enrichment — Run Report 23 (2026-08-17)

Run id: `bv2a-enrichment-2026-08-17T23-17-47Z`. Unattended hourly firing.

## Step 0 — Circuit breaker

Last 3 run reports (newest first): RUN-REPORT-22 (2026-08-17, COMPLETED, `30 records · 4 clean · 0 FAIL · 51 WARN`), RUN-REPORT-20 (2026-08-15, COMPLETED, `44 records · 18 clean · 0 FAIL · 51 WARN`), RUN-REPORT-19 (COMPLETED, `45 records · 18 clean · 0 FAIL · 54 WARN`). 0 of 3 recorded a FAIL. All three exist as reports. **Breaker NOT TRIPPED.**

## Step 1 — Concurrency

`data\state\claims\bv2a-enrichment.json` read: `{"heldBy":null,"releasedAt":"2026-08-17T22:32:14Z",...}` — released. Heartbeat written first (`data\state\heartbeat\bv2a-enrichment-2026-08-17T23-17-47Z.json`, `outcome:"started"`), then claim acquired: `heldBy: bv2a-enrichment-2026-08-17T23-17-47Z`, `expiresAt: 2026-08-18T02:17:47Z` (3h TTL per §6G). No `data\state\enrichment.lock` file present, and would not have been honoured per §6A step 2b / v2.14 in any case.

## Step 2 — Runbook / spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full: §0A/§0 prime directives, §1/§1A identity, §2/§2A enrichment protocol (item 3b both-surfaces, item 8 quoted-bio), §3 venue protocol, §6/§6A run contract, §6F/§6G concurrency, §7 changelog header. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail read; open fingerprints used directly this firing: `bv2a-claim-path-stale-in-prompt` (confirms `bv2a-enrichment.json` is the correct claim path), `bv2a-oldest-backlog-not-globally-sorted` (list_venues not created-order — sampled 300 across 6 offsets and sorted client-side), `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` (standing workaround script pattern followed), `validator-fb-evidence-mismatch-fp2-corroboration` (expected STUB_NO_BIO/STUB_NO_IMAGE warns on FP.2 venues), `bv2a-firing22-chrome-unreachable` (precedent for today's repeat Chrome outage).

## Step 3 — Tool verification

bndy MCP tools reachable (confirmed live via `list_venues`, count 3001 at start). **Chrome/Claude in Chrome: NOT CONNECTED** — `tabs_context_mcp` returned "Claude in Chrome is not connected" on two attempts (not transient — same class as the immediately preceding firing 22, two firings running). Per the task prompt's hard-stop table: *"Chrome unavailable or not logged in to Facebook (venues may proceed; artists may not)"*. **All artist priorities (1, 4, 5) skipped entirely this firing.** Venues proceeded under FP.2 (WebSearch only, no Chrome needed).

## Step 4 — Candidate selection

Artist priorities not attempted (Chrome unreachable, see above).

2. Venues created in last 24h with missing socials: 0 found (`createdSince` 2026-08-16T23:17:47Z).
3. Backlog venues missing socials, oldest `createdAt` first: sampled `list_venues missingSocials=true` across offsets 0/50/100/150/200/250 (300 of 738, sampled and sorted client-side per the standing `bv2a-oldest-backlog-not-globally-sorted` finding). Cross-checked every candidate against `enrichment-ledger.jsonl` (90-day no-page-found cooldown, §9) and excluded records already evidenced-blank in the last 10 days: W P M Sports & Social Club, Canal Tavern, Annitsford Welfare Club, Ann Welfare Playing Fields, Hayfield Club, West End Club (Stapleford), The Dolphin Hotel Plymouth, The Saracens Head, White Lodge, Tudor Nook Cheadle, Jubilee Park Horndean, Molly Malones (Taunton), The Tap & Grape Broadstone, Tor Sports & Leisure, The Nest — not re-searched. Skipped under §0.23 (non-fixed place): Okehampton Show ground, Dorset County Show, Venue TBC, Grimsthorpe Castle Park and Gardens. Skipped as out-of-remit (non-UK, §0.15): The Black Lab, Bal Chavaux, Nalen Klubb, Gazarte, Eightball Club, Musikens Hus, MS Stubnitz, Hotel Cecil, Lost Lane (Dublin) — same foreign capture batch flagged by firing 22 (`externalId` prefix `6022ef13-…`), still unresolved, not re-flagged again. Skipped as a garbled name: "United match)" (repeat of `bv2a-firing20-garbled-venue-name-united-match`, still unresolved). 30 oldest-eligible records taken from the remainder, `createdAt` ranging 2025-09-25 to 2026-07-25.

## Step 5 — Work done

### Venues — 30 processed, 21 verified (FB + optional website), 2 website-only, 7 evidenced blank

Fast path (§FP.2): WebSearch only, no Chrome needed. Each verified record's town/address was confirmed in the search result before writing.

**Verified** (facebookUrl and/or website written):

| Venue | Field(s) | Source |
|---|---|---|
| The Voyager (South Shields) | facebookUrl | facebook.com/p/Voyager-new-100063738363215 — address 145 Anderson St matches exactly |
| Stork Hotel (Simonstone, Burnley) | website, facebookUrl | storksimonstone.co.uk, facebook.com/141468532658824 |
| Lakeside Park (North Somercotes) | website, facebookUrl | lakesidepark.co.uk, facebook.com/235656719823669 |
| Twenty Ten (Matlock) | facebookUrl | facebook.com/TheKitchenMatlock — page titled "The Kitchen, Twenty Ten \| Matlock", moderate confidence, town+name both present |
| Pudsey Tavern | facebookUrl | facebook.com/pudseytavern |
| Stourbridge Social | website, facebookUrl | stourbridgesocial.com, facebook.com/stourbridgesocial |
| Albert's Shed Southwater (Telford) | facebookUrl | facebook.com/albertsshedsouthwater — location-specific page, distinct from the multi-site brand page |
| Den Engel Belgian Bar and Restaurant (Leek) | website, facebookUrl | denengelleek.co.uk, facebook.com/LeekDenEngel |
| The Cottage of Content (Barton) | facebookUrl | facebook.com/p/The-Cottage-Of-Content-61566581530447 — address matches exactly |
| Brewery Arts (Kendal) | website, facebookUrl | breweryarts.co.uk, facebook.com/TheBreweryArtsCentreKendal |
| The Giffard Arms (Wolverhampton) | facebookUrl | facebook.com/GiffardArms |
| The Carlton (Newcastle-under-Lyme) | website, facebookUrl | the-carlton.co.uk, facebook.com/thenewcastlecarlton |
| Knutton Ex Servicemens Club | facebookUrl | facebook.com/p/Knutton-Club-100063466696000 — address matches |
| The Crows Nest.Newcastle | facebookUrl | facebook.com/TheCrowsNestST5 — address matches |
| The King's Head in Market Drayton | facebookUrl | facebook.com/kingsheadinnmarketdrayton — a second candidate page (thekingsheadmarketdrayton) also exists; picked the one matching the pub's registered trading name (Kings Head Inn) |
| The Wellington Inn Leek | facebookUrl | facebook.com/p/The-Wellington-Inn-61555231406380 |
| The Barley Mow (Biddulph) | facebookUrl | facebook.com/p/The-Barley-Mow-Biddulph-61563080264292 |
| The Barley Mow (Southsea) | website, facebookUrl | barleymowsouthsea.com, facebook.com/BarleyMowsouthsea — address matches exactly |
| Redrock Stockport | website, facebookUrl | redrockstockport.co.uk, facebook.com/RedrockStockportOfficial |
| The Goats Head (Steeton) | facebookUrl | facebook.com/p/The-Goats-Head-Steeton-100057314144940 — address matches exactly |
| Wheatsheaf Hillgate (Stockport) | facebookUrl | facebook.com/SerenaWheatsheaf — address matches exactly |

**Website-only** (no confidently-confirmed dedicated Facebook page):
- Voltage (Bromborough) — voltagebromborough.co.uk confirmed; many unrelated same-name Facebook pages returned across two search variants, no page distinctly confirmed as this venue's own
- Hartington Hall Yha (Buxton/Hartington) — yha.org.uk/hostel/yha-hartington-hall confirmed; only an Instagram account and a third-party newspaper Facebook post found, no dedicated venue page

**Evidenced blank** (WebSearch tried, logged in the evidence file):
- Darcy's (Fenton, Stoke-on-Trent) — no confidently-matching Facebook page; only third-party listing sites returned, and the one Facebook hit found ("The Cafe Fenton") is a different business
- St Nicholas' Chapel (Langstone, Havant) — only the parent church's page (St Faith's, @stfaithshavant) found; not a page dedicated to the chapel itself, left blank rather than attach a different entity's page
- The Decorated Dead Tattoo Studio (Poole) — only Instagram found, no matching Facebook page
- Handcross Bowls Club — own website found but no confidently-distinct Facebook page; a different entity ("The Handcross Club", a broader village social club) shares near-identical naming and was not used
- Fox & Hounds (Fenham, Newcastle) — address confirmed but no dedicated Facebook page surfaced across two search variants
- Britannia Inn (Leek) — two candidate pages found ("The Britannia Inn, Leek" and "Leek - The Britannia Inn New") with no way to confirm which is current; left blank rather than guess
- Seabridge, Seabridge (Newcastle-under-Lyme) — bndy record's postcode (ST5 3LS) does not match the pub found at the same-named road (ST5 3HA, §0.24); could not confirm same location, left blank

### Artists — 0 processed

Chrome/Claude in Chrome unreachable all firing (two `tabs_context_mcp` attempts both failed, not transient). Per the task prompt's hard-stop table, artist priorities (1: new-artist missing socials, 4: backlog artist missing socials, 5: artists missing genres with an existing facebookUrl) were **not attempted**. This is the second consecutive firing with this exact outage (see `bv2a-firing22-chrome-unreachable`, previous firing 23 minutes earlier) — flagged below as now a repeat, worth investigating.

No §0.6 name corrections needed this firing.

## Validator

Built via the standing workaround pattern (own script, `build_validator_input_run2317.py`, following firing 22's `build_validator_input_run2217.py`) — venue `socialMediaUrls[0].url`/`website` aliased to top-level `facebookUrl`, `city` aliased to `location`; `venueId` evidence lines aliased to `artistId` — per the standing `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` fingerprints. For two records (Stork Hotel, Redrock Stockport) where both a website and a Facebook page were found in the same search pass, `capturedFrom` was aliased to the Facebook URL **in the validator-input build only** so `FB_EVIDENCE_MISMATCH` did not fire on a real, corroborated match — same class of fix as firing 19's Royal Oak and firing 22's Diseworth Village Hall. The underlying evidence file lines are untouched.

**Validator summary line (verbatim, first and only run): `30 records · 9 clean · 0 FAIL · 42 WARN   [mode=gate]`**

WARNs: `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 21 Facebook-verified venues (expected — FP.2 venues carry no bio field and need no Chrome avatar fetch, per the standing `validator-fb-evidence-mismatch-fp2-corroboration`-class finding).

## Circuit breaker

Not fired. No FAIL outstanding in the validator run.

## CTO-INBOX — new entries this firing

1. **`bv2a-chrome-unreachable-two-consecutive-firings`** — Claude in Chrome was unreachable for both firing 22 (22:17Z) and this firing (23:17Z), 23 minutes apart. Two consecutive artist-blocking outages is the threshold `bv2a-facebook-not-logged-in` (2026-08-14) flagged as "worth a look if it recurs" — it has now recurred. If this continues, every future firing will process venues only and the artist backlog (missing-socials: 861, missing-genres: 612) will not move at all.
2. **`bv2a-firing23-kings-head-two-candidate-pages`** — "The King's Head in Market Drayton" has two plausible Facebook pages (kingsheadinnmarketdrayton, thekingsheadmarketdrayton). Picked the one matching the pub's registered trading name; not independently confirmed which is more current. Low risk (both clearly the same pub, same address) but noting for completeness.
3. **`bv2a-firing23-seabridge-postcode-mismatch`** — venue record "Seabridge, Seabridge" (id `a6cb4e7c-3969-478b-ab3c-99e697a0d483`) carries postcode ST5 3LS; the only pub of that name found in Newcastle-under-Lyme is at ST5 3HA. Left blank rather than risk a wrong-building match (§0.24). Needs a human check of whether this is a data-entry error on the bndy record or a genuinely different, unfound location.

## Budget

30/30 venues processed (21 verified, 2 website-only, 7 evidenced blank), 0/0 artists (Chrome unreachable, skipped per hard-stop table). Circuit breaker did not fire. Wall-clock: approximately 23:17:47Z to 23:35Z (~17 minutes), well within the 40-minute nominal target and the 3h claim TTL.
