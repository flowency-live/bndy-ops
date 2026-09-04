# Bv2a Enrichment — Run Report — 2026-08-15, firing 12

**Outcome: COMPLETED.**

Run id `bv2a-enrichment-2026-08-15T12-20-05Z`. Claim acquired 12:20:05Z, released 12:35:00Z. ~15 minutes elapsed, well inside the 40-minute budget.

## Step 0 — Circuit breaker

Already performed by the calling agent before this firing started: read the last 3 run reports (RUN-REPORT-11, -10, -09), all outcome COMPLETED, all validator 0 FAIL, 0 of 3 recorded a FAIL. **Breaker NOT TRIPPED.** Not re-derived here per the calling agent's instruction; noted only.

## Step 2 — Runbook / task spec / inbox read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed (2.27 ≥ 2.19). Read in full this firing: §0A, §0 prime directives, §1/§1A identity, §2/§2A enrichment protocol (item 3b — both search surfaces before any blank — and item 8 — bio is quoted, never composed), §2A.2 mechanics, §3 venue protocol, §6/§6A run contract (heartbeat-first, floor assertion, claim mechanics), §6D-bis, §6F/§6G concurrency in full, changelog to v2.27.

`ENRICHMENT-TASK-v3.md` §0.0, §FP fast path, §1–§12 (field rules, evidence ladder §5.2, hard rejections §5.3, do-not-attach list §5.4, location resolution §7, image recipe §8) read in full.

`CTO-INBOX.md` read in full. Live/open fingerprints noted, none re-logged: `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-genre-only-fb-evidence-mismatch`, `bv2a-claim-path-stale-in-prompt`, `run-report-path-collides-second-firing`, `enrich-venue-batch-array-not-parsed`, `bv2a-edit-artist-409-on-facebookurl-write`, `danny-and-friends-duplicate-of-danny-brab`, `validator-fb-evidence-mismatch-fp2-corroboration`. Chrome confirmed one connected browser (`list_connected_browsers` → exactly one, `7ad060c3…`), logged in to Facebook (verified via `facebook.com/` landing page — "What's on your mind, Jason?").

## Step 1 (per this prompt) — Concurrency

Per §6A step 2b, checked `data\state\claims\bv2a-enrichment.json` (not `enrichment.json` — stale prompt path, fingerprint `bv2a-claim-path-stale-in-prompt` already open, not re-logged). Found `{"heldBy":null,"releasedAt":"2026-08-15T11:40:00Z",...}` — released. Did not touch the retired `enrichment.lock`. Wrote heartbeat `bv2a-enrichment-2026-08-15T12-20-05Z.json` (`outcome:"started"`) as the first action per §6A step 0, then acquired the claim with a 3-hour TTL per §6G's table (`bv2a-enrichment` row).

## Priority order worked

1. **Artists created <24h, missing socials (16 candidates).** All 16 confirmed already attempted today via grep of `RUN-REPORT-06.md` through `RUN-REPORT-11.md` (7 in RUN-REPORT-06, 9 in RUN-REPORT-07/09/10). Correctly not re-attempted.
2. **Venues created <24h, missing socials.** 24 candidates found; 23 unattempted today (`2a0692d0` The Alexandra already done in RUN-REPORT-10/11). Worked all 23 unattempted — priority 2 exhausted below the 30-cap.
3. **Backlog venues missing socials, oldest createdAt first.** Sampled 3 pages (offset 0/300/600) of `list_venues(missingSocials=true)`, merged, took the 7 oldest to fill the remaining venue budget to 30. Oldest found: `Annitsford Welfare Club` (2025-05-14).
4. **Backlog artists missing socials, oldest first.** `list_artists(missingSocials=true)` (886 records) has no stable date-sort, so 5 pages (offset 0/150/300/450/600, ~125 records) were sampled and merged to approximate oldest-first, as RUN-REPORT-11 did. Oldest unattempted found: `THE FUNKBREAKERS` (2026-05-01). `Double Cross`/`Downturn`/`Sully and Co`/`The House Katz`/`Dilemma`/`NOVOCAINE LIVE`/`DEJA VU`/`Bomshell`/`Mix 'N' Match`/`Glen Franklin` all confirmed already attempted in RUN-REPORT-08/11 and skipped. `Double X` and `Tracy Morgan` are on the ENRICHMENT-TASK-v3 §5.4 do-not-attach list — `Double X` already flagged (RUN-REPORT-11), `Tracy Morgan` skipped here (not counted against the cap; both are documented same-name collision risks).
5. Not reached — priority 4 filled the artist budget.

## Venues — 30 records: 25 verified, 5 evidenced blank

Fast path (§FP.2): WebSearch for each, town/address confirmed against the record's stored address before accepting a `facebook.com/<page>` URL. No Chrome needed (§FP.2 — no bio field on venues). Several chain-pub name collisions checked against address, not name alone (`The Kings` × 2, `Hogarths`-style risk noted from prior firings).

**Verified (25):** The Kings (Heywood) `9a7ebfbb`, The William Jessop (Ellesmere Port) `4ef6703d`, Prince of Brewers (Burton upon Trent) `ba1cf7f2`, The North Star North Shields `22074bb2`, The Windmill's End (Rowley Regis) `9ffe437d`, The Old Post Office (Coatbridge) `fe096e68`, The Leopard (Chester) `408c1bc6`, The Dean & Chapter (Ferryhill) `75a48e93`, The Middle Inn (Washington) `55905fac`, The Stockton (Redcar) `f14e9f06`, The Stitching Pony (Kettering) `a57a6d4c`, The Wheatsheaf (Weaverham) `aabcef97`, Red Lion (Little Budworth) `9ad50e3a`, Castle & Anchor (Stockton-on-Tees) `74515221`, The Metropole (Gateshead) `6e7caea7`, The Kings (Barrow-in-Furness) `3a4d2c95`, The Royal (Runcorn) `d3b96265`, The Cotton Bale (Hyde) `9cd805c5`, The Clayhanger (Burslem) `ebce95bf`, Saracens Head (Dudley) `e64777b0`, The Billy Wright (Wolverhampton) `f9541fe5`, The Berkeley (Wigan) `5b5f2359`, The Black Horse (Croston) `ff551e65`, The Ashley (South Shields) `0329853a`, The Loft Cleckheaton `978c24c5`.

All 25 read back via the `edit_venue` response confirming `socialMediaUrls` updated. Two used a bare numeric Facebook page id (Red Lion Little Budworth `facebook.com/161982923990349`, The Metropole `facebook.com/388918211284994`) — no vanity handle surfaced for either, both confirmed against address/town before accepting.

**Evidenced blank (5)** — WebSearch tried, no confident town-matching page found:

- **Annitsford Welfare Club** `4082b952` — only "Annitsford Irish Club" (a different venue) found. Variants: `"Annitsford Welfare Club" facebook`.
- **The Babington Arms** `b18da88a` — JD Wetherspoon pub; Wetherspoon venues do not run individual town Facebook pages. Variants: `"The Babington Arms" Derby pub facebook`.
- **West Park, Long Eaton** `0888fe2f` — only West Park Leisure Centre (different facility) and a fan/community page ("We Love West Park Long Eaton") found, neither confirmably the events-field venue's own page. Variants: `"West Park" Long Eaton Nottingham bandstand facebook`.
- **W P M Sports & Social Club** `db9dd035` — only a third-party FB events listing found, no club-owned page. Variants: `"W P M Sports" OR "WPM Sports" Social Club Gosport facebook`.
- **Canal Tavern** `367490c2` — only a same-named pub in Thorne (different town) found on Facebook. Variants: `"Canal Tavern" Kidsgrove pub facebook`.

## Artists — 15 worked, 4 verified, 11 evidenced blank, 1 skipped (do-not-attach)

**Verified (4)** — Chrome-visited (logged in) to quote the bio verbatim per §0.0/§FP.3 step 3:

- **Uncle Pleb** `f4029dae-025d-4426-808d-7cdb371c2f67` — `facebook.com/p/Uncle-Pleb-61589593895407/`, category Musician/band, 51 followers, page-stated location **"Bollington, Macclesfield, United Kingdom, SK10 5HX"** — exact match to the stored location. Tier A/B: exact town match plus category match. Bio quoted verbatim: *"Uncle Pleb (Lifelong friends Steve Black and James Dennis) are a duo from the North West of England. Their original songs, telling of strange characters and heroic deeds, serve to both move and amuse the listener."* The bio explicitly states "original songs," so §0.18 outranks the covers default — `actType` set to `["originals"]`, not defaulted, and said so here. `genres` (`["Folk"]`) already correct from a prior firing, left unchanged. Read back clean.
- **Flynns Arcade** `61d7cc52-eb18-49a8-8d90-90382e5c66bf` — `facebook.com/FlynnsArcadeBournemouth/`, category Musician/band, 444 followers, 100% recommend (8 reviews). Page-stated service area: *"Christchurch, Dorset · Bournemouth · Southampton · Poole · Wareham · Wimborne · Winton · Winchester · Southbourne · Ringwood"* — includes Southampton and Winchester, both Hampshire, consistent with the stored regional location "Hampshire" even though the band's home base (Bournemouth) sits just across the Dorset boundary; noted here rather than silently accepted. Bio quoted verbatim: *"Flynn's Arcade are a three-piece cover band based around Bournemouth playing the best of alt rock, pop and punk, and so much more!"* Website `flynns-arcade.co.uk` added. `profileImageUrl` auto-populated server-side to the stable graph URL. Read back clean.
- **The Feel Good Foundation** `bc16d7ed-2fbd-4293-862f-a8d8c5d54f36` — `facebook.com/p/The-Feel-Good-Foundation-100090358484635/`, category Musician/band, 854 followers. Page itself carries no location field; Tier B corroboration from a third-party listing (availablebands.co.uk) naming Barnsley, South Yorkshire, consistent with the stored regional location "Yorkshire," plus sole plausible UK candidate and genre consistency (indie/pop bill vs. stored Pop/Soul/Rock). Bio quoted verbatim: *"Feel good tunes, from indie bangers to pop classics, dancefloor fillers and songs you love to sing along to."* Read back clean.
- **The Crashers** `b1570d2a-7da5-48ed-9598-23e770093111` — `facebook.com/Thecrashersuk/`, category Musician/band, 1.8K followers, 100% recommend (7 reviews). Page states *"The finest indie rock covers band in Sheffield."* — matches stored regional location "Yorkshire" (Sheffield, South Yorkshire) and genres. **The page's own bio is truncated by Facebook itself** at "...The Crashers are the perf" — confirmed by re-visiting `/about` and `/directory_basic_info` and by clicking the text; the fuller sentence never rendered. Per §0.0's permitted transformation (cut at a sentence boundary), only the complete first sentence — *"The finest indie rock covers band in Sheffield."* — was quoted; the truncated fragment was NOT appended. `genres` topped up to `["Rock","Pop","Indie"]` (Indie inferred from "indie rock," the one field §0.0 permits inference on). `profileImageUrl` auto-populated server-side. Read back clean.

**Evidenced blank (11)** — both surfaces tried (Google via WebSearch, then Facebook's own page search where a candidate needed confirming) before recording:

- **THE FUNKBREAKERS** `f6d673aa` — no page found for a Stoke-on-Trent act of this name. Variants: `"THE FUNKBREAKERS" band Stoke-on-Trent facebook`.
- **JAM TRIBUTE** `feed67b7` — only "The Jam'd," an unrelated national Jam tribute act, found; no Derbyshire-specific page. Note: the validator flagged `NAME_BILLING` on this pre-existing name ("Tribute" in the name — act or subject?) — not resolved this firing since no page was found to confirm either way; left as-is, not a new defect, not logged. Variants: `"Jam Tribute" band Derbyshire facebook`.
- **Pinkish** `030e54a2` — only "Pinkish Floyd," a differently-named Pink Floyd tribute act, found; name does not match. Variants: `"Pinkish" band Derbyshire facebook`.
- **Double Cross** `be6c7a2f` — only US and unrelated UK acts found, none in Derby. Variants: `"Double Cross" band Derby facebook`.
- **Supersonic 90s** `4059ec7a` — a "Super Sonic 90s" page exists but no location evidence ties it to Derbyshire; treated as unconfirmed rather than guessed. Variants: `"Supersonic 90s" band Derbyshire facebook`, `"Super Sonic 90s" OR "Supersonic90s" band facebook location about`.
- **Revolving Jay's** `c265d975` — no match; only unrelated Jaykays/JayBee's acts found. Variants: `"Revolving Jay's" band Derbyshire facebook`.
- **Nexus** `ded71dec` — only a Canterbury-based Nexus covers band found, wrong region (stored: Hampshire). Variants: `"Nexus" band Hampshire facebook covers`.
- **Blitz** `16a16143` — a "BlitZ" glam/classic-rock band exists in Nottingham city, ~20 miles from the stored town (Worksop); genre/format not corroborated as the same act, treated as unconfirmed. Variants: `"Blitz" band Worksop Nottinghamshire facebook`.
- **Rose Tattoo** `794c6a32` — only the original Australian rock band (formed Sydney 1976) found; no North East England covers-act page. Record carries a pre-existing bio ("Live band performing in the North East of England.") from a prior firing — untouched this firing, no capturedText exists for it, aliased to empty for validator input only per the standing `validator-genre-only-fb-evidence-mismatch` workaround. Variants: `"Rose Tattoo" band North East England facebook Newcastle covers`.
- **The Shards** `1ae3bce2` — same-name bands found in East Sussex and as an unrelated acoustic trio; neither is the stored Staffordshire act. Variants: `"The Shards" band Staffordshire facebook`.
- **The Moonshine Rascals** `a88be653` — strong location corroboration (Cowplain Social Club, The Heroes Waterlooville, both Hampshire/Portsmouth-area venues, matching the stored genre Rock n Roll) but no Facebook page URL surfaced on either surface. Flagged as a near-miss worth a human's 30 seconds rather than guessed. Variants: `"The Moonshine Rascals" band Hampshire facebook`, `"Moonshine Rascals" band facebook.com Portsmouth Waterlooville`.

**Skipped (1):**

- **Tracy Morgan** `bb7ede4f` — on the ENRICHMENT-TASK-v3 §5.4 do-not-attach list (documented same-name collision: US comedian, 1.6M followers, vs. this Dukinfield act). Not retried, not counted against the 15-record cap.

No §0.6 name corrections found this firing.

## Validator

`scripts\enrichment_validate.py` run against this firing's 45 written/touched records (30 venues + 15 artists), evidence from `data\state\enrichment-evidence-2026-08-15-enrichment.jsonl`.

Checked the script's `--help` first. Built validator-input files per the standing workaround pattern (fingerprints `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, both already open in CTO-INBOX.md, and `validator-genre-only-fb-evidence-mismatch` applied for Rose Tattoo's untouched pre-existing bio) — `data\state\build_validator_input_run1220.py` builds `data\state\validator-records-run-1220.json` (venue `socialMediaUrls[0].url`/`city` aliased to top-level `facebookUrl`/`location`; no data invented) and `data\state\validator-evidence-alias-run-1220.jsonl` (`venueId` keys aliased to `artistId`, 45 lines). No new validator-scope defects found this firing (the `NAME_BILLING` WARN on JAM TRIBUTE is the check working as designed, not a defect).

**Validator summary line (verbatim): `45 records · 17 clean · 0 FAIL · 53 WARN   [mode=gate]`**

The WARNs are `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 25 verified venues (expected and correct — §FP.2 venues carry no bio field and no Chrome avatar fetch), `STUB_NO_IMAGE` on Uncle Pleb and The Feel Good Foundation (verified page attached, no scraped avatar — server did not auto-populate an image for these two), and `NAME_BILLING` on JAM TRIBUTE (pre-existing name, untouched, flagged correctly).

## Circuit breaker

Not fired. No FAIL was outstanding in the final validator run.

## CTO-INBOX

No new lines appended. All defects/near-misses encountered this firing (`NAME_BILLING` on JAM TRIBUTE, the Crashers page-truncation, the Flynns Arcade Bournemouth/Hampshire boundary nuance) are either the validator working as designed or handled within this run's own judgement — none met the bar of "genuine new defect."

## Ledger, snapshot, run-summary

Appended 45 lines to `enrichment-ledger.jsonl` (30 venue + 15 artist enrich lines) plus one snapshot line. Snapshot: `artistsTotal: 2209`, `artistsMissingSocials: 882`, `artistsMissingGenres: 633`, `venuesTotal: 2967`, `venuesMissingSocials: 851`.

Appended `run-summary.jsonl`: `{"date":"2026-08-15","task":"enrichment","finishedAt":"2026-08-15T12:33:30Z","outcome":"completed","gigsAdded":0,"artistsAdded":0,"venuesAdded":0,"recordsEnriched":45,"skipped":1,"note":"30 venues (25 verified/5 blank), 15 artists (4 verified/11 blank), 1 do-not-attach skip"}`.

Both dashboards regenerated: `data\normalized\enrichment\DASHBOARD.html` (1277 enrichment records, 42 snapshots) and `data\normalized\DASHBOARD.html`.

## Budget

30/30 venues, 15/15 artists (+1 do-not-attach skip not counted against cap). ~15 minutes of the 40-minute budget used. Circuit breaker did not fire; this run did not trip it for the next firing.

## Claim / heartbeat

Claim released: `{"heldBy":null,"releasedAt":"2026-08-15T12:35:00Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-15T12-20-05Z"}`. Heartbeat `bv2a-enrichment-2026-08-15T12-20-05Z.json` rewritten to `"outcome":"completed"`.
