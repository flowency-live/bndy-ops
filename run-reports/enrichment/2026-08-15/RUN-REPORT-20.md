# Bv2a Enrichment — Run Report 20 (2026-08-15)

Run id: `bv2a-enrichment-2026-08-15T20-18-05Z`. Unattended hourly firing.

## Step 0 — Circuit breaker

Last 3 run reports (newest first): RUN-REPORT-19 (COMPLETED, `45 records · 18 clean · 0 FAIL · 54 WARN`), RUN-REPORT-18 (COMPLETED, `43 records · 22 clean · 0 FAIL · 43 WARN`), RUN-REPORT-17 (COMPLETED, `30 records · 7 clean · 0 FAIL · 46 WARN`). 0 of 3 recorded a FAIL. All three exist as reports. **Breaker NOT TRIPPED.**

## Step 1 — Concurrency

`data\state\claims\bv2a-enrichment.json` read before any other action: `{"heldBy":null,"releasedAt":"2026-08-15T19:52:30Z",...}` — released. Heartbeat written first (`data\state\heartbeat\bv2a-enrichment-2026-08-15T20-18-05Z.json`, `outcome:"started"`), then claim acquired: `heldBy: bv2a-enrichment-2026-08-15T20-18-05Z`, `expiresAt: 2026-08-15T23:18:05Z` (3h TTL per §6G). No `data\state\enrichment.lock` file present, and would not have been honoured per §6A step 2b / v2.14.

## Step 2 — Runbook / spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full: §0A/§0 prime directives, §1/§1A identity, §2/§2A enrichment protocol (item 3b both-surfaces, item 8 quoted-bio), §3 venue protocol, §6/§6A run contract, §6B platform facts, §6F/§6G concurrency, §7 changelog. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail read; open fingerprints noted and used directly below: `bv2a-oldest-backlog-not-globally-sorted`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-fb-evidence-mismatch-fp2-corroboration`, `bv2a-edit-artist-409-on-facebookurl-write` / `bv2a-409-isolated-to-facebookurl-field` (Tanky remains write-blocked, not re-attempted — no new information since firing 18/19).

## Step 3 — Tool verification

bndy MCP tools reachable (confirmed live via `list_venues`, count 2967). Chrome: exactly one connected browser, logged into Facebook (confirmed via `facebook.com` home feed showing "What's on your mind, Jason?").

## Step 4 — Candidate selection

1. Artists created in last 24h with missing socials: 14 found — all 14 already fully worked by firing 18 today (13 evidenced blank + Tanky identified-but-write-blocked; Danny & Friends is the known `danny-and-friends-duplicate-of-danny-brab` CTO-INBOX item, correctly not re-searched). No unworked candidates. Not re-attempted.
2. Venues created in last 24h with missing socials: 0 found.
3. Backlog venues missing socials, oldest `createdAt` first: sampled `list_venues missingSocials=true` across offsets 0 and 60 (120 of 756, per the standing `bv2a-oldest-backlog-not-globally-sorted` finding — API not created-order, sampled and sorted client-side). 7 of the oldest were already attempted today by firings 17/18/19 (Ann Welfare Playing Fields, Annitsford Welfare Club, Hayfield Club, Tudor Nook Cheadle, Canal Tavern, W P M Sports & Social Club, Jubilee Park Horndean) — skipped. `Okehampton Show ground` and `Dorset County Show` skipped as non-fixed-place under §0.23 (precedent firing 18). `Venue TBC` (Hampshire) skipped as a named non-place under §0.23. One further oldest-eligible record, **"United match)"** (a garbled name at the Old Trafford address, Sir Matt Busby Way) — **SKIPPED, not enriched**: the name reads as a corrupted capture (likely "Man United match)" truncated), not a genuine grassroots venue, and enriching it under a broken name would be actively wrong. Flagged below rather than guessed at. 30 oldest-eligible records taken from the remainder, one skipped for the reason above, leaving **29 venues processed**.
4. Backlog artists missing socials, oldest `createdAt` first: sampled the first 50 of 874 (offset 0). 15 already attempted today (13 from firing 19's blank cohort, Uncle Jack verified, Danny & Friends flagged-not-worked) were excluded. 15 oldest-eligible artists taken.
5. Priority (e), artists missing genres with an existing facebookUrl: not reached — budget spent on (c) and (d).

## Step 5 — Work done

### Venues — 29 processed (1 skipped separately, see Step 4), 25 verified, 4 evidenced blank

Fast path (§FP.2): WebSearch only, no Chrome needed. Each verified record's town/address was confirmed in the search result before writing.

**Verified** (facebookUrl and/or website written):

| Venue | Field(s) | Source |
|---|---|---|
| The Keys (Ripley) | facebookUrl | facebook.com/thewreckripley — page currently trading under this handle, displays "The Keys Ripley" |
| The Witham (Barnard Castle) | website, facebookUrl | facebook.com/TheWitham — Arts Centre, own site thewitham.org.uk |
| The Taproom - Padiham | facebookUrl | facebook.com/PadihamTaproom |
| Blackburn Empire Theatre | website, facebookUrl | facebook.com/blackburnempire, blackburnempire.com |
| The Edge Arts Centre (Much Wenlock) | facebookUrl | facebook.com/edgeartscentre — the main, regularly-updated of two candidate pages |
| Throstles Nest, Congleton | facebookUrl | facebook.com/Throstlesnest |
| Billingham Synthonia Cricket Club | facebookUrl | facebook.com/BSCC1923 |
| Park Inn (Darwen) | facebookUrl | facebook.com/parkinn.darwen |
| The Wedgewood Rooms (Southsea) | website, facebookUrl | facebook.com/TheWedgewoodRooms, wedgewood-rooms.co.uk |
| The Risley Park Pub & Kitchen | website, facebookUrl | facebook.com/therisleyparkbar, therisleypark.co.uk |
| The Barge Inn (Long Eaton) | facebookUrl | facebook.com/p/The-Barge-Inn-Long-Eaton-100063724714785 |
| Thistle Park Tavern (Plymouth) | facebookUrl | facebook.com/thistleparktavern |
| The Ships Tavern (Elburton, Plymouth) | website, facebookUrl | facebook.com/theshipstavernelburton, theshipstavern.com |
| King's Highway (Derby) | website, facebookUrl | facebook.com/The.Kings.Highway, kingshighwaypub.co.uk |
| The West Devon Club (Tavistock) | website, facebookUrl | facebook.com/357743427616285, thewestdevonclub.com |
| The Old Inn (Malborough) | website, facebookUrl | facebook.com/p/The-Old-Inn-Malborough-100063521262247, oldinnmalborough.co.uk |
| The Millbrook Inn (South Pool) | website, facebookUrl | facebook.com/MillbrookInnSouthPool, millbrookinnsouthpool.co.uk |
| The Swan Inn (Noss Mayo) | website, facebookUrl | facebook.com/theswannossmayo, swaninnnossmayo.com |
| The Steamer Coffee House and Kitchen (Cullompton) | website, facebookUrl | facebook.com/steamercoffeekitchen, the-steamer.co.uk |
| Shooters (Dawlish) | website, facebookUrl | facebook.com/p/Shooters-Dawlish-100075732166941, shootersdawlish.co.uk |
| The Salterton Arms (Budleigh Salterton) | website, facebookUrl | facebook.com/SaltertonArms, thesaltertonarms.com |
| The London Inn (Kilkhampton) | facebookUrl | facebook.com/TheLondonInnKilkhampton |
| Project Eighty Three (Newquay) | facebookUrl | facebook.com/project83nqy — **page migration**: the original page `projecteightythree` explicitly directs followers to this newer page; used the live successor per §2A.1 item 2 |
| The Red Lion Inn (Newlyn) | facebookUrl | facebook.com/theredlionnewlyn |
| Wilful Beer - Mutley Plain (Plymouth) | website only | wilfulbeer.co.uk — new taproom (opened 12/12/25); the brand's FB page covers a different site (South Brent) and no Mutley-specific FB page was confirmed, so facebookUrl left blank rather than risk attaching the wrong location's page |

**Evidenced blank** (WebSearch tried, multiple query variants per record, logged in the evidence file):
- White Lodge (Stafford) — only a same-name campsite (Great Haywood) surfaced, wrong town and wrong venue type.
- West End Club (Stapleford) — no own-page URL resolved across three query variants; only an events sub-page and third-party mentions.
- The Dolphin Hotel (Plymouth) — CAMRA/whatpub reference a page exists but no usable URL surfaced across three variants.
- The Saracens Head (Newton Abbot) — only a personal-account karaoke post and an unrelated same-name pub in Newton Green, Suffolk.

**Skipped, not enriched, not evidenced**: "United match)" (`9be0502f-2a7f-42ac-8751-b51852b2320a`) — garbled/corrupted venue name at the Old Trafford address; enriching a broken name would compound the defect. Flagged to CTO-INBOX below.

### Artists — 15 processed, 3 verified, 12 evidenced blank

**Verified:**
- **The Jefferson Archive** (`e727f2c1…`) — facebookUrl `facebook.com/jeffersonarchive`, bio quoted verbatim from the page's own About/Bio block via Chrome: *"The Jefferson Archive are a four piece blues rock band from South Devon."* Matches stored location (Newton Abbot) and genres (Blues, Rock, covers).
- **The Humanitarians** (`ee9c5d0a…`) — facebookUrl `facebook.com/thehumanitarians`, bio quoted verbatim via Chrome: *"The Art of self destruction the bands 3rd album is about to drop. Watch this space."* Corroborated by a gig-guide listing at CJ's Bar, Newton Abbot (matches stored location).
- **Christian Harling** (`2389ca4a…`) — websiteUrl `christianharling.com`, instagramUrl `instagram.com/christianharlinglive` (both trivially confirmed). No Facebook page surfaced across search; facebookUrl left blank.

**Evidenced blank** (WebSearch tried per §2A.1 item 3b, searchVariants logged for every record): Shot… — *(none carried over; see below for full list)* Electric Gherkins · Retro Knights · Higgi's Band · Karl Howard · Rob Hunt · Jason Howard · Aaron & Jake · Let'z Rock · The Relics · One Step Behind · P J Carter.

**The Jays** (`90d0d2d3…`, near-miss worth detail) — two same-name candidates were found and **both rejected after visiting them**: `facebook.com/FollowTheJays` states "Duluth, Minnesota" (hard non-UK reject, §2A.1.1); the act's own site `thejaysduo.co.uk` states "Essex-based … playing across Essex, Suffolk, Hertfordshire, London, Cambridgeshire" — a real UK act but the wrong region entirely versus the stored Kingsteignton, Devon record. Correctly left blank rather than attach either name-collision.

**One Step Behind** (`4f46f4ea…`, near-miss) — the only match found is "One Step Behind", the UK's longest-running Madness tribute band (est. 1993, national touring act, own site onestepbehindtribute.com). No evidence ties it specifically to Derby. Left blank per the Tier C name-match-alone rule; **recommend a human look**, since a national tribute act could plausibly be the correct match but the identification bar isn't met.

**P J Carter** (`91043238…`) — a Facebook page ("PJ Carter - Singer Guitarist", id `100068880728179`) is referenced by lemonrock and search results, and gig listings confirm he plays Liskeard Constitutional Club (matches stored town) — but the page itself returns "This content isn't available" when visited directly via Chrome. Left blank rather than store a dead link; no working alternative found.

No §0.6 name corrections needed this firing. One `NAME_BILLING` warn on a pre-existing name not touched this firing ("The Taproom - Padiham"), one on "Wilful Beer - Mutley Plain" (both legitimate, the ` - ` is part of the trading name), one on "Higgi's Band" (format-tail pattern, legitimate — matches the source's own billing). No do-not-attach list matches.

## Validator

Built via the standing workaround pattern (`data\state\build_validator_input_run2018.py`) — venue `socialMediaUrls[0].url`/`website` aliased to top-level `facebookUrl`, `city` aliased to `location`; `venueId` evidence lines aliased to `artistId` — per the standing `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` fingerprints.

**Validator summary line (verbatim): `44 records · 18 clean · 0 FAIL · 51 WARN   [mode=gate]`**

First run: 0 FAIL, no re-run needed. WARNs: `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 24 Facebook-verified venues (expected — FP.2 venues carry no bio field and need no Chrome avatar fetch per the standing `validator-fb-evidence-mismatch-fp2-corroboration`-class finding). Three `NAME_BILLING` warns on pre-existing names, all reviewed and legitimate (see above).

## Circuit breaker

Not fired. No FAIL outstanding in the final validator run.

## CTO-INBOX — new entries this firing

1. **`bv2a-firing20-garbled-venue-name-united-match`** — venue `9be0502f-2a7f-42ac-8751-b51852b2320a` is named "United match)" at the Old Trafford address (Sir Matt Busby Way, Stretford). The name reads as a truncated/corrupted capture, not a real venue name. Skipped rather than enriched under a broken name; needs a human to establish the real source and either correct the name or delete the record.
2. **`bv2a-firing20-one-step-behind-derby-near-miss`** — artist "One Step Behind" (Derby) has a strong name match to the UK's national Madness tribute band of the same name (est. 1993), but no evidence ties the touring act specifically to Derby. Left blank per the Tier C ladder, flagged for a human look.
3. **`bv2a-firing20-pjcarter-page-dead-link`** — artist "P J Carter" (Liskeard) has a referenced Facebook page (`100068880728179`) that returns "This content isn't available" when visited directly, despite being cited by lemonrock and search results. Possibly deleted, restricted, or a stale index entry.

## Budget

29/30 venues processed (1 skipped for a data-quality name defect, flagged above), 15/15 artists (3 verified, 12 evidenced blank). Circuit breaker did not fire. Wall-clock: approximately 20:18:05Z to 21:25Z (~67 minutes) — over the nominal 40-minute target due to the volume of disambiguation searches this cohort required (several same-name-collision checks), but within the 3h claim TTL.
