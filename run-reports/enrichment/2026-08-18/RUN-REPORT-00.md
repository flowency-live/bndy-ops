# Bv2a Enrichment — Run Report 00 (2026-08-18)

Run id: `bv2a-enrichment-2026-08-18T00-20-46Z`. Unattended hourly firing.

## Step 0 — Circuit breaker

Orchestrator pre-checked and relayed the last 3 reports (newest first): RUN-REPORT-23 (2026-08-17, COMPLETED, `30 records · 9 clean · 0 FAIL · 42 WARN`), RUN-REPORT-22 (2026-08-17, COMPLETED, `30 records · 4 clean · 0 FAIL · 51 WARN`), RUN-REPORT-20 (2026-08-15, COMPLETED, `44 records · 18 clean · 0 FAIL · 51 WARN`). 0 of 3 recorded a FAIL, all three exist as reports. **Breaker NOT TRIPPED.** Cited per protocol; not re-verified independently beyond the orchestrator's relay.

## Step 1 — Concurrency

`data\state\claims\bv2a-enrichment.json` read: `{"heldBy":null,"releasedAt":"2026-08-17T23:30:17Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-17T23-17-47Z"}` — released. Heartbeat written first (`data\state\heartbeat\bv2a-enrichment-2026-08-18T00-20-46Z.json`, `outcome:"started"`), then claim acquired: `heldBy: bv2a-enrichment-2026-08-18T00-20-46Z`, `expiresAt: 2026-08-18T03:20:46Z` (3h TTL per §6G). No `data\state\enrichment.lock` file present, and would not have been honoured per §6A step 2b / v2.14 in any case. Claim path confirmed via standing `bv2a-claim-path-stale-in-prompt` fingerprint (`data\state\claims\bv2a-enrichment.json`, not the task prompt's stated path).

## Step 2 — Runbook / spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed (v2.27 ≥ v2.19). Read in full: lines 1-252 (relayed/confirmed by orchestrator: §0A, prime directives, §1/§1A identity, §2/§2A enrichment protocol incl. item 3b both-surfaces-before-blank and item 8 quoted-bio) and lines 253-732 read directly this firing (§3 venue protocol, §4/§5 event model, §6/§6A run contract, §6B platform facts, §6C failure classes, §6D-bis/§6D event identity, §6E horizons, §6F/§6G concurrency, §7 changelog through v2.27). `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail read; open fingerprints used directly this firing: `bv2a-claim-path-stale-in-prompt`, `bv2a-oldest-backlog-not-globally-sorted` (list_venues sampled across 5 offsets — 0/150/300/450/600 of 715 — and sorted client-side by createdAt), `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` (adapter script pattern replicated, see Validator section), `validator-fb-evidence-mismatch-fp2-corroboration` (expected STUB_NO_BIO/STUB_NO_IMAGE WARNs on FP.2 venues), `bv2a-chrome-unreachable-two-consecutive-firings` (governed Step 3 below), `bv2a-firing23-kings-head-two-candidate-pages` / `bv2a-firing23-seabridge-postcode-mismatch` / `bv2a-firing20-garbled-venue-name-united-match` (all noted, none re-litigated).

## Step 3 — Tool verification

bndy MCP tools reachable (confirmed live via `list_venues`, count 3001 at start; `list_artists`, count 2222). **Chrome/Claude in Chrome: NOT CONNECTED** — `tabs_context_mcp` returned "Claude in Chrome is not connected" on two attempts (`createIfEmpty:false` then `createIfEmpty:true`), not transient.

⚠ **THIS IS THE THIRD CONSECUTIVE FIRING WITH THIS OUTAGE** (firing 22 at 22:17Z, firing 23 at 23:17Z, this firing at 00:20Z — all 2026-08-17/18, roughly hourly apart). The `bv2a-chrome-unreachable-two-consecutive-firings` CTO-INBOX entry explicitly flagged that a third occurrence would mean the artist backlog never moves. It has now happened. Flagged prominently below and in CTO-INBOX.

Per the task prompt's hard-stop table: *"Chrome unavailable or not logged in to Facebook (venues may proceed; artists may not)"*. **All artist priorities (1, 4, 5) skipped entirely this firing.** Venues proceeded under §FP.2 (WebSearch only, no Chrome needed, §0.0 bio rule does not bind on venues).

## Step 4 — Candidate selection

Artist priorities not attempted (Chrome unreachable, see above; artist backlog unchanged this firing: missing socials 861, missing genres 612).

1. Venues created in last 24h with missing socials: `createdSince` 2026-08-17T00:20:46Z — **0 found**.
2. Backlog venues missing socials, oldest `createdAt` first: `list_venues(missingSocials=true)` sampled across offsets 0/150/300/450/600 of 715 (250 of 715 sampled, per the standing `bv2a-oldest-backlog-not-globally-sorted` finding — API not created-order, sampled and sorted client-side by `createdAt`).

   Cross-checked every candidate against `enrichment-ledger.jsonl` and excluded records already evidenced-blank in the last ~10 days (matching firing 22/23's skip list, not re-searched): W P M Sports & Social Club, Canal Tavern, Annitsford Welfare Club, Ann Welfare Playing Fields, Hayfield Club, West End Club (Stapleford), Tudor Nook Cheadle, Jubilee Park Horndean, The Saracens Head, Tor Sports & Leisure, The Tap & Grape Broadstone.

   Skipped under §0.23 (non-fixed place / named non-place): Okehampton Show ground, Dorset County Show, Venue TBC, Grimsthorpe Castle Park and Gardens, Bowling Green Stage (Nantwich Food Festival), Lakefest, Madeley Carnival (Madeley).

   Skipped as out-of-remit (non-UK, §0.15): The Black Lab (France), Bal Chavaux (France), Nalen Klubb (Sweden), Gazarte (Greece), Union Scene (Norway), Lost Lane (Dublin) — same foreign-capture-batch class as `bv2a-firing22-foreign-venues-one-batch` (externalId prefix `6022ef13-…`), not re-flagged again.

   Skipped as a garbled/corrupted name: "United match)" (repeat of `bv2a-firing20-garbled-venue-name-united-match`, still unresolved).

   30 oldest-eligible records taken from the remainder, `createdAt` ranging **2025-09-25 to 2026-07-31** — noticeably older than firing 22/23's cohorts (2026-05-04 to 2026-07-25), because this firing worked further down the true tail once the near-term backlog thinned.

3/4/5. Backlog artists, artists-missing-genres: not attempted (Chrome unreachable).

## Step 5 — Work done

### Venues — 30 considered, 28 processed (19 verified with facebookUrl, 4 website-only, 5 evidenced blank), 2 skipped as non-venue/non-fixed-place

Fast path (§FP.2): WebSearch only, no Chrome needed. Each verified record's town/address/postcode was confirmed against the search result before writing.

**Verified — facebookUrl written** (Tier: address/postcode match to the bndy record in every case):

| Venue | Field(s) | Source |
|---|---|---|
| The Ye Olde Rose & Crown (Stafford) | facebookUrl | facebook.com/YORAC.Stafford — Joule's Brewery taphouse listing confirms handle |
| Oggy's Sports Bar (Hanley) | facebookUrl | facebook.com/Hanleycomeondown — address 227 Lichfield St matches exactly |
| The Sun Inn (Llangollen) | facebookUrl | facebook.com/suninnllangollen — 49 Regent St address matches exactly |
| The Red Lion (Repton, Derby) | facebookUrl | facebook.com/13marston — page titled "The Red Lion at Repton" |
| The Vigilant Inn (South Shields) | facebookUrl | facebook.com/p/The-Vigilant-Harton-61565901205381 — 165 Sunderland Rd matches exactly |
| Clennell Hall Country House (Rothbury) | website, facebookUrl | clennellhallcountryhouse.com, facebook.com/clennellhallcountryhousealwinton |
| The Valiant - Leek | facebookUrl | facebook.com/TheValiantLeek — 3 Stanley St matches exactly |
| Dubrek Studios (Derby) | website, facebookUrl | dubrek.co.uk, facebook.com/dubrek — 67 Bridge St matches exactly |
| Town Crier (Coventry) | facebookUrl | facebook.com/TheTownCrierAtCoventry — Corporation St matches exactly |
| The Ship Inn (Whitby) | facebookUrl | facebook.com/shipwhitby15 — Marine Parade matches exactly |
| Yardbirds Rock Club (Grimsby) | website, facebookUrl | yardbirdsrocks.co.uk, facebook.com/yardbirds.rock — 23 Church St matches exactly |
| The George Inn (Andover) | facebookUrl | facebook.com/thegeorgeinnstmarybourne — postcode SP11 6BG matches exactly (bndy's terse "Andover" address resolves to St Mary Bourne) |
| Grannie Annies Sunderland (Roker) | facebookUrl | facebook.com/grannieanniespp — 3 Marine Walk matches exactly |
| BottleCraft Hanley | facebookUrl | facebook.com/bottlecraftsot — 33 Piccadilly matches exactly |
| Shukers Farm Shop, Werrington | facebookUrl | facebook.com/Shukersfarmshop — Leek Rd/Weston Coyney address matches |
| Wizards Hollow (Diggle) | facebookUrl | facebook.com/Wizardshollow — Wharf/Warth Mill, Diggle OL3 5PJ matches |
| The Sun Inn (Morpeth) | facebookUrl | facebook.com/thesuninnmorpeth — High Church address matches exactly |
| Haven Riviere Sands Holiday Park (Hayle) | website, facebookUrl | haven.com/parks/cornwall/riviere-sands, facebook.com/RiviereSandsHolidayPark |
| Combe Haven Holiday Park (Hastings) | website, facebookUrl | haven.com/parks/sussex/combe-haven, facebook.com/CombeHavenHolidayPark |

**Website-only** (no confidently-confirmed dedicated Facebook page):
- Ty Fry Manor & Estate (Pentraeth) — tyfrymanor.co.uk confirmed; only Instagram + third-party event/post mentions found for Facebook, no dedicated venue page
- Sunnyvale (Rhyl) — sunnyvaleuk.co.uk confirmed; multiple ambiguous/unrelated Facebook pages found (Kinmel Bay Beach Retreat, Sunnyvale beach resort), none confidently the park's own
- The Babington Arms (Derby, Wetherspoon) — babingtonarms.co.uk confirmed (Wetherspoon pub microsite); no pub-level Facebook page found (Wetherspoon pages are centrally managed, not per-pub)
- The Globe Inn (Calthwaite) — globecalthwaite.co.uk confirmed; two competing Facebook pages found (theglobeinncalthwaite, theglobeinncalthwaitecumbria) with no way to confirm which is current — left blank rather than guess, same pattern as firing 23's Kings Head/Britannia Inn precedent

**Evidenced blank** (WebSearch tried, multiple query variants, logged in the evidence file):
- Hartlepool United FC Supporters Association — searches surfaced the football club's own page and an unrelated Supporters' Trust (@HUST_1908), not a confirmed Association page for the ground's function-room/bar use
- The Bulls Head (Baildon) — only event pages, group posts and band videos found referencing the venue; no single dedicated venue-owned page confirmed across two search variants
- Life of Riley (Sunderland) — search surfaced an unrelated Sunday-league football team of the same name and generic "SunderlandLife"/promoter pages; no confidently-confirmed venue-owned page
- The Tannery (Derby) — new (opened June 2026) Sadler Gate taproom; no dedicated Facebook page surfaced, no official website beyond third-party directory listings
- The White Hart (Whaley Bridge) — "has a Facebook page" per directory listings but no confirmable URL surfaced

**Skipped, not enriched** (record-quality concerns, flagged to CTO-INBOX below rather than forced):
- Decade of Dance (Bury, id `cf25ce49-3b67-4c3f-a80b-73a7b0bfa79d`) — search results describe this as a mobile DJ/event-hire service at a residential-looking address (39 Hampton Grove), not a fixed music venue. Possible mis-classified record.
- West Park, Long Eaton (id `0888fe2f-504b-48fa-a1c2-e9c3e0afe7e0`) — a public park with a council-bookable bandstand; no dedicated venue-owned Facebook page (only a general "we love this park" community page and a separate carnival event page). Treated as §0.23 non-fixed-place class.

### Artists — 0 processed

Chrome/Claude in Chrome unreachable all firing (`tabs_context_mcp` failed on two attempts, both non-transient — same failure signature as firings 22 and 23). Per the task prompt's hard-stop table, artist priorities (1: new-artist missing socials, 4: backlog artist missing socials, 5: artists missing genres with an existing facebookUrl) were **not attempted**. **This is the THIRD consecutive firing with this outage** — see CTO-INBOX entry below.

No §0.6 name corrections needed this firing. One pre-existing `NAME_BILLING` WARN surfaced on a record not touched this firing ("The Valiant - Leek" — the ` - ` is part of how the record is already named in bndy; not edited, left as-is, same class as prior "Dusty Miller - Mytholmroyd" / "Taproom - Padiham" precedents).

## Validator

Built via the standing workaround pattern (own script, inline this firing, following `build_validator_input_run2317.py`'s approach) — venue `facebookUrl`/`website` set directly at top level (no evidence-loader remap needed beyond aliasing `venueId`→`artistId` in the evidence file), per the standing `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` fingerprints. Records JSON and evidence JSONL built from the same writes made to bndy this firing (28 records: 19 verified-FB, 4 website-only, 5 evidenced blank).

**Validator summary line (verbatim, first and only run): `28 records · 9 clean · 0 FAIL · 39 WARN   [mode=gate]`**

WARNs: `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 19 Facebook-verified venues (expected — FP.2 venues carry no bio field and need no Chrome avatar fetch, per the standing `validator-fb-evidence-mismatch-fp2-corroboration`-class finding). One `NAME_BILLING` WARN (The Valiant - Leek, pre-existing name, reviewed, legitimate — see above).

## Circuit breaker

Not fired. No FAIL outstanding in the validator run.

## CTO-INBOX — new entries this firing

1. **`bv2a-chrome-unreachable-three-consecutive-firings`** — Claude in Chrome unreachable for THREE consecutive firings running: firing 22 (2026-08-17 22:17Z), firing 23 (2026-08-17 23:17Z), and this firing (2026-08-18 00:20Z). `tabs_context_mcp` returned "not connected" on two attempts each time, not transient. Escalating beyond the `bv2a-chrome-unreachable-two-consecutive-firings` flag which predicted exactly this. **The artist backlog (861 missing socials, 612 missing genres) has not moved across all three firings and will not move on any future firing while this persists.** This looks like it may need a human to check the Chrome extension / browser connection outside of this task's control — recommend checking extension install/login state directly rather than waiting for a fourth automatic retry.
2. **`bv2a-firing00-decade-of-dance-possible-non-venue`** — venue record "Decade of Dance" (id `cf25ce49-3b67-4c3f-a80b-73a7b0bfa79d`, Bury BL9 6PT) reads as a mobile DJ/event-hire service at what looks like a residential address, not a fixed music venue. Not enriched. Needs a human check of whether this record should exist as a bndy venue at all.
3. **`bv2a-firing00-george-inn-andover-address-terse`** — venue "The George Inn, Andover SP11 6BG" (id `00712053-79a5-4226-a9fd-9b772c861355`) has a terse bndy address ("The George Inn, Andover SP11 6BG") that actually resolves to The George Inn, St Mary Bourne (postcode matches exactly). Enriched on the postcode match; flagging in case the bndy address/city field would benefit from being made more specific on next touch.

## Budget

28/30 venue records written to bndy (19 verified, 4 website-only, 5 evidenced blank), 2/30 skipped (record-quality concerns, see above), 0/0 artists (Chrome unreachable, skipped per hard-stop table). Circuit breaker did not fire. Wall-clock: approximately 2026-08-18T00:20:46Z to 00:29:17Z (~9 minutes of write time; total firing including research ran longer but stayed well within the 40-minute nominal target and the 3h claim TTL).
