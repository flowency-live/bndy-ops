# Enrichment run report — 2026-08-15, 09:19Z firing

**Outcome: COMPLETED.**

## Step 0 — circuit breaker

Last 3 reports at start of this run, newest first:
1. `2026-08-15/RUN-REPORT-08.md` — COMPLETED. Validator `45 records · 14 clean · 0 FAIL · 61 WARN`.
2. `2026-08-15/RUN-REPORT-07.md` — COMPLETED. Validator `45 records · 12 clean · 0 FAIL · 64 WARN`.
3. `2026-08-15/RUN-REPORT-06.md` — COMPLETED. Validator `43 records · 17 clean · 0 FAIL · 52 WARN`.

0 of 3 recorded a FAIL, all 3 wrote a report. **Breaker NOT TRIPPED.** This pre-flight check was already performed for this firing per the task instructions; confirmed against the actual files on disk before proceeding.

## Step 1/2 — runbook and task spec

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed (v2.27 ≥ v2.19). Read in full this firing: §0A/§0 prime directives, §2A (2A.1 items 1–8 including item 3b — both search surfaces before any blank — and item 8 — bio is quoted, never composed; 2A.2 mechanics), §3 venue protocol, §6 run discipline, §6A run contract (steps 0, 1, 2, 2a, 2b, 3–7), §6F concurrency (vault_claim.py — governs shared *files* like RUNBOOK.md, not this task's claim), §6G concurrency lock protocol and TTL table. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full, plus mission/field-rules/evidence-ladder sections for reference. `CTO-INBOX.md` read in full.

**Live/open fingerprints noted, none re-logged:** `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-genre-only-fb-evidence-mismatch`, `bv2a-claim-path-stale-in-prompt`, `run-report-path-collides-second-firing`, `enrich-venue-batch-array-not-parsed`, `bv2a-edit-artist-409-on-facebookurl-write`, `danny-and-friends-duplicate-of-danny-brab`, `bv2a-facebook-not-logged-in` (not applicable — Chrome confirmed logged in this firing).

**Task-prompt claim path note** (already-logged fingerprint `bv2a-claim-path-stale-in-prompt`): the task text names `data\state\claims\enrichment.json`, which has never existed. Used the real path per the runbook and the pre-flight instruction: `data\state\claims\bv2a-enrichment.json`.

## Step 0 (heartbeat) / Step 2b — concurrency

Heartbeat written first: `data\state\heartbeat\bv2a-enrichment-2026-08-15T09-19-21Z.json`, `{"outcome":"started"}`, rewritten to `{"outcome":"completed"}` as the last action of this run.

`data\state\enrichment.lock` not present — not honoured, not recreated (retired per §6A step 2b). Claim file `data\state\claims\bv2a-enrichment.json` read `{"heldBy":null,"releasedAt":"2026-08-15T08:31:00Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-15T08-19-45Z"}` — released. Acquired cleanly:
`{"heldBy":"bv2a-enrichment-2026-08-15T09-19-21Z","acquiredAt":"2026-08-15T09:19:21Z","expiresAt":"2026-08-15T12:19:21Z","heartbeatFile":"data\\state\\heartbeat\\bv2a-enrichment-2026-08-15T09-19-21Z.json"}`. No takeover needed. Released at end of run (see Ledger section).

## Step 3 — Chrome / Facebook precondition check

One Chrome browser connected, tab group established via `tabs_context_mcp`. Navigated to `facebook.com`, confirmed via `get_page_text`: logged-in home feed ("What's on your mind, Jason?"). Full artist work (Chrome-quoted bio) available where a candidate page was found.

## Selection

1. **Artists created <24h, missing socials** — 16 found (unchanged set from the 07:20Z/07:37Z/08:05Z/08:19Z firings this morning). Checked every id against today's ledger: **all 16 already carry a today's-date ledger entry** (attempted at 07:37Z or 08:05Z), or (Danny & Friends, `d27e100b`) are logged in `CTO-INBOX.md` as a duplicate needing a merge, out of scope for an edit-only run. None re-attempted this firing.
2. **Venues created <24h, missing socials** — 114 found, a second, distinct Amber Taverns/Robinsons Brewery pub-refurbishment cohort (no id overlap with the 30 done at 08:19Z, confirmed by spot-checking the first 10 ids against the ledger before starting). Worked the first 30 in list order, reaching the venue cap.
3. **Backlog venues oldest-first** — not reached; venue cap (30) filled entirely by Priority 2.
4. **Backlog artists missing socials, oldest createdAt first** — `list_artists(missingSocials:true)` does not sort by `createdAt`, so three pages (limit 60/100/100, offset 0/60/160) were pulled and merged client-side, sorted by `createdAt` ascending, and cross-checked against today's ledger (133 already-attempted ids at the point of selection). This surfaced a much older tail than the 08:19Z firing found (its "oldest" was 2026-05-03; this pull found records back to **2025-02-22**), confirming the earlier firing's approximation note was correct — the true backlog is older than simple low-offset pagination shows. Took the 15 genuinely oldest not already attempted today: oldest is **Evolution** (created 2025-02-22), newest of the 15 is **The Needles** (created 2026-05-22).
5. **Genre-only top-up** — not reached; budget went to Priorities 2 and 4.

## Venues — verified (30 of 30)

All via `WebSearch` per FP.2, no Chrome needed (venues carry no bio field under this task). Every venue confirmed against its stored address/town in the search snippet before writing.

| Venue | id | Field(s) written | Evidence |
|---|---|---|---|
| The Iron Dragon | `7da9f9b9-aaf4-4cf9-aadb-0f84e991991e` | facebookUrl, website | facebook.com/TheIronDragonMerthyr/ — Castle St CF47 8BG matches |
| Star & Garter | `4d5be560-9d7e-402f-8ab0-b89924c1760f` | website only | robinsonsbrewery.com/pubs/star-garter-stockport/ — **facebookUrl left blank**: two search passes (bare name+town, then `facebook.com "Star & Garter" Stockport Hillgate`) both confirmed the pub has a Facebook page but never surfaced its URL |
| Hogarths | `7fdda01d-ba05-4697-917a-59b625072566` | facebookUrl, website | facebook.com/HogarthsSouthShields/ — 14 Mile End Rd NE33 1TS matches |
| George & Dragon | `2712998f-1a10-474d-bd88-21c53efc2ced` | facebookUrl, website | facebook.com/GeorgeDragonleigh — 7 King St, Leigh WN7 4LP matches |
| The Mousetrap Social | `51b48b7a-520f-43fd-be56-4c01eef137bb` | facebookUrl, website | facebook.com/themousetrapsocial/ — 27-33 Market St NG1 6HX matches |
| The Whistle Blower | `d0e8923a-1c47-4078-8ade-844d6c39192a` | facebookUrl, website | facebook.com/thewhistleblowerconsett/ — Consett matches (search snippet gave postcode DH8 5AB vs stored DH8 5QP — not corrected, out of scope, noted below) |
| The Royal Oak | `dd9c8f48-fb40-4837-95fc-e1a525bf853d` | facebookUrl, website | facebook.com/RoyalOakRadcliffe — Water St, Radcliffe M26 4TW, Amber Taverns confirmed. **Same-name trap avoided**: a second candidate `facebook.com/RoyalOakPubRadcliffe` is Radcliffe-on-Trent, Nottinghamshire — a different town — and was rejected |
| The Black Swan In Hand | `7cfa219c-16d3-4acb-8552-e2bd5005ec9f` | facebookUrl, website | facebook.com/TheBlackSwanInHand/ — 2 Bridge St CV11 4AF matches |
| Bulls Head Kerridge | `d472bd9b-9229-42aa-856a-bdbb835613c2` | facebookUrl, website | facebook.com/BullsHeadKerridge/ — 2 Oak Ln, Kerridge SK10 5BD matches (Robinsons Brewery, not Amber) |
| The County | `b235a951-cb68-4eb8-8282-4ede603e0464` | facebookUrl, website | facebook.com/TheCountyRotherham/ — Bridgegate, Rotherham matches |
| The Queens Pub | `458b0cb0-d9af-44ce-92e1-103d206c54f6` | facebookUrl, website | facebook.com/QueensBlackpool/ — 271 Talbot Rd FY3 7AZ, Amber Taverns confirmed |
| Three Brass Monkeys | `202b4420-9ec5-47df-983b-54fdcca8f09c` | website only | ambertaverns.co.uk/pub/three-brass-monkeys-weston-super-mare/ — **facebookUrl left blank**: two searches (incl. one excluding the Swansea/Bridlington/Hartlepool/Whitley Bay same-name sister venues) confirmed the July-2026 reopening but never surfaced this venue's own FB page URL |
| Harry Pursey | `541cc428-e82d-4038-bd15-cd8544144a22` | facebookUrl, website | facebook.com/HarryPurseyHull/ — 386 Beverley Rd HU5 1LN matches |
| Bulls Head | `bc181c84-0255-4c6b-8d7e-4f4c91807386` | facebookUrl, website | facebook.com/thebullsheadmarplevillage/ — 23 Market St, Marple SK6 7AA matches (Robinsons) |
| Red Lion | `7408a851-7107-4297-bf44-8432bb7d54c9` | facebookUrl, website | facebook.com/270957339602875 ("The Red Lion Cheadle") — 83 Stockport Rd SK8 2AJ matches (Robinsons) |
| The Alex James | `2d1c19d9-f52d-457c-ad33-9945e3cb6dc7` | facebookUrl, website | facebook.com/thealexjamesbellshill/ — Bellshill matches |
| The Iron Ram | `2340604c-b204-4c14-9947-acf2d6536901` | facebookUrl, website | facebook.com/TheIronRamDerby/ — 27 Iron Gate DE1 3GL matches |
| George & Dragon | `13ad5ebe-2b4a-4f4e-b4dc-479ffadb5181` | facebookUrl, website | facebook.com/GeorgeDragonCheadle — 1 High St SK8 1AX matches |
| The Market Tavern | `106772f4-7aab-4d90-8aec-0b21dc9d41c2` | facebookUrl, website | facebook.com/st.helens/ ("The Market Tavern \| Saint Helens") — 26-28 Bridge St WA10 1NW matches |
| The Wheatsheaf | `81904a3f-9af7-4e57-9229-c1806d10fec1` | facebookUrl, website | facebook.com/WheatsheafWesthoughton/ — 106 Market St BL5 3AZ matches |
| Skenning Bobs | `a9ce0463-82d4-4338-a6bd-f29ba3114916` | facebookUrl, website | facebook.com/SkenningBobs/ — Elliott St, Tyldesley M29 matches |
| Pump and Truncheon | `66be0b1e-7e63-4c15-ab6b-5d0e9f8b8771` | facebookUrl, website | facebook.com/ThePumpAndTruncheon/ — Bamber Bridge, Amber Taverns confirmed |
| The Cock, Henbury | `e2099de0-4007-4d60-a24b-68a719808e9d` | facebookUrl, website | facebook.com/TheCockHenbury/ — Chelford Rd, Henbury SK10 3LH matches (Robinsons) |
| The Bodfor | `d9a015c2-3395-4d81-989f-d5c15248f33c` | facebookUrl, website | facebook.com/TheBodforRhyl/ — 13-15 Bodfor St LL18 1AS matches |
| The Bulls Head | `b4825cc9-a523-4bba-ad99-e5a12757ce90` | facebookUrl, website | facebook.com/bullsheadcongleton — Mill St CW12 1AB matches |
| Hogarths | `0433bdbb-81ad-4525-b2a0-62945d4c305e` | facebookUrl, website | facebook.com/HogarthsHereford/ — Commercial Rd, Hereford matches (search gave house no. 57 vs stored 59 — same street/postcode, not corrected) |
| Harry Hotspur | `4f34c07b-11c6-42b4-aaaa-3e26639f3d8b` | facebookUrl, website | facebook.com/TheHarryHotspur — 127 Micklegate YO1 6LB matches |
| Hogarth's | `6c45fdb4-8ff1-4e58-87ad-534ad3709860` | facebookUrl, website | facebook.com/HogarthsRochdale/ — The Butts, Rochdale matches; website set to hogarthsbars.co.uk |
| Commercial Hotel | `88381eb5-3d7d-4207-887c-e72a3dc7eb90` | facebookUrl, website | facebook.com/CommercialHotelRainhill — 12 Station Rd, Rainhill L35 0LP matches |
| The Plough | `234fb3d1-a6c1-4914-9e4b-6c75a9e05c91` | facebookUrl, website | facebook.com/ThePloughGorton/ — 925-927 Hyde Rd M18 7FB matches (Robinsons) |

Every one of the 30 gained at least a website or Facebook page; 28 of 30 gained a confirmed Facebook page (2 — Star & Garter, Three Brass Monkeys Weston — website only, evidenced blank on facebookUrl). Spot-verified with `get_by_id` on 2 records (The Iron Dragon, The Plough); both read back exactly as written.

## Artists — verified (0 of 15 worked)

None. Two near-miss candidates were investigated via Chrome and rejected — see below.

## Artists — evidenced blank (15 of 15 worked)

Google searched per §2A.1 item 3b/3c (bare name + at most one qualifier — town/region already on the stored record, not an invented one — per FP.3's pattern). None of these 15 produced a confident Tier A/B match, so Facebook's own page-search surface was not separately re-run for each per FP.1's Google-first fast path; two produced a plausible-looking page and were escalated to Chrome for a closer look (both rejected — see below). Full search variants are in the evidence file.

- **Evolution** (`eJ3aDOC7ByrKZ36foVL9`, Stockport) — no Stockport candidate; only Wiltshire, California and Berkshire same-name bands. Left blank.
- **Soulplay** (`L2R6qpDMjMQYSln8gKjZ`, Stockport) — `facebook.com/SoulPlayFunctionBand/` found (328 followers, category "Band", bio "6-12 pc band playing Funk/Soul/Motown..."). Visited via Chrome: **no location field on the page itself**; a booking-agency (Alive Network) listing places them as available in the Stockport/Manchester/Cheshire area, but that is a service-area listing for a nationally agency-represented function band, not the act's own stated home. Left blank — name+genre match with no page-stated location does not clear the identification bar (§2A.1, cf. the Vicky Jackson PINK precedent in `ENRICHMENT-TASK-v3.md` §11a GAP 1).
- **Havoc** (`99106598-bb14-493b-b46e-6fc348858563`, Stone) — no candidate found. Left blank.
- **The Rockerfellas** (`23c68d1e-2e8f-4449-a238-1c088a441bff`, North West England) — three competing pages (South African band, UK-nationwide `therockerfellaslive`, `Rockerfellasuk`), none confirming North West England specifically. Left blank.
- **The Comittee** (`fb9d3eec-920d-4ecf-a0a3-a76485aee88e`, North East) — no North East candidate; results were Florida, a metal collective, and a DC hip-hop crew. Left blank.
- **Head Over Heals** (`d6441091-b2dc-47d6-9491-17466e9bfd42`, Stoke-on-Trent) — `facebook.com/headoverheelsgroup/` found, an 80s tribute band founded 2022 — but the stored name is spelled "Head Over **Heals**" against the page's "Head Over **Heels**", and no page or listing confirms a Stoke-on-Trent base (directory hits are generic hire-category aggregator pages, not the act's own claim). Left blank — spelling variance plus unconfirmed location.
- **Partners In Crime** (`214b271e-24a8-43ac-8fef-6d1b1e2d8699`, North West UK) — candidates in Melbourne, Tampa Bay and Florence (Italy), none North West UK. Left blank.
- **Tommy P & the Crew** (`50a4267f-0eb6-449e-baac-034c53eed664`, North West UK) — no exact-name match found. Left blank.
- **Devil Hound Blues** (`b4283e4a-c69f-41e5-86db-e9f49aaac7ce`, North West UK) — no exact-name match; nearest were Heinous Hound Blues Band and Devil's Hound. Left blank.
- **Roadhouse Sinners** (`808b5190-8ff8-4605-bdfd-c60e036b75b8`, North West UK) — no band combining both words found. Left blank.
- **Rhythm Revival** (`7990fc78-ba94-4a06-a648-501d406082d9`, Newcastle) — `facebook.com/rhythmrevivalband/` found (398 followers, Musician/band, "Live funk, soul and pop band"). Visited via Chrome: most recent visible post is **"at The Belfry Hotel & Resort", 14 June 2023, Tamworth (Staffordshire)** — not Newcastle. `insangel.co.uk/bands/rhythm-revival` (a North East gig-booking source) does list a Newcastle gig (The Denton, 13 Nov 2026), but the FB page's own visible activity plus its website `rhythmrevival.co.uk` read as a nationally-touring agency function band, not one based in/around Newcastle. **Left blank** — a single NE tour date does not outweigh a contrary Staffordshire appearance on the same page; this is a near-miss worth a human's 30 seconds (flagged below, not logged as a fingerprint).
- **Borderline** (`81936781-f6f4-4160-b151-ff4a1e47366a`, North East England) — nearest match is "Borderland" (different spelling), a Newcastle wedding band. Left blank — name doesn't match.
- **Kamaro** (`af8c2c46-e1f2-478a-8302-f45875304a31`, Hampshire) — nearest match is "Komaro" (different spelling), a Hampshire party band; a same-spelling "Kamaro Rock Band" is Harrisburg, PA (non-UK, §2A.1.1 bars it anyway). Left blank.
- **Twistin'** (`eba88c49-d84b-45d0-a4b6-a10e9f52dbf6`, Derbyshire, UK) — no UK candidate; results were Detroit and Auckland (NZ) acts. Left blank.
- **The Needles** (`000a937b-f283-4585-8aeb-688cd7f458e3`, Derbyshire, UK) — no Derbyshire candidate; results were a 1990s Aberdeen punk band, a French punk band, and The Needles Pub in Derby (a venue, not this act). Left blank.

## Artists — skipped

None. All 15 backlog candidates were fully worked (0 verified, 15 evidenced blank) — a legitimate, conservative outcome per `ENRICHMENT-TASK-v3.md` §1 ("a night that enriches 8 records correctly and leaves 42 blank is a good night").

## Names corrected under §0.6

None this firing.

## Validator

Evidence file: `data\state\enrichment-evidence-2026-08-15-enrichment.jsonl` — 45 new lines appended this firing (133 → 178 total for today), all written before the corresponding bndy write.

Known validator scope gaps applied — same workarounds as prior firings today, all already logged in `CTO-INBOX.md`, not re-logged:
1. `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` — built `data\state\validator-records-run-0929.json` (venue `socialMediaUrls[0].url`/`city` aliased to top-level `facebookUrl`/`location`; no data invented, schema rename for validator input only) and `data\state\validator-evidence-alias-run-0929.jsonl` (`venueId` keys aliased to `artistId`, 45 lines covering the 30 venues + 15 artists touched this run).
2. Artist `location` fields were populated in the validator-input reconstruction from each record's actual stored `location` (Stockport, Stone, North West England, etc. — read during selection) since none of it was written this run; the first validator pass without this correctly caught the reconstruction gap as 15 `NO_LOCATION` FAILs, which were fixed in the input file (not the bndy records, which already carried these values) before re-running.

Result, first pass (reconstruction gap): `45 records · 2 clean · 15 FAIL · 56 WARN`. Second pass, after fixing the validator-input reconstruction (no bndy data touched): **0 FAIL**.

**Validator summary line (verbatim): `45 records · 17 clean · 0 FAIL · 56 WARN   [mode=gate]`**

WARNs breakdown: `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 28 verified venues that gained a facebookUrl (venues carry no bio/image field under this task — structurally unavoidable, same as every prior firing today).

### Circuit breaker for next run

Not fired. No FAIL was outstanding in the final (bndy-accurate) validator run.

## Defects / fingerprints

No new fingerprint raised this firing. All defects encountered already have open CTO-INBOX entries (`bv2a-claim-path-stale-in-prompt`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`) and were not re-logged.

One near-miss worth a human's 30 seconds, not logged as a fingerprint (below the bar for a CTO-INBOX entry): **Rhythm Revival** (`7990fc78-ba94-4a06-a648-501d406082d9`) — a strong-looking Facebook page and an insangel-listed Newcastle gig, but the page's own most recent visible activity is a Tamworth appearance, contradicting the stored Newcastle location. Worth a look if the North East gig proves out over time.

## Budget used

~14 minutes elapsed (09:19:21Z acquire to 09:33:30Z release), well inside the 40-minute target and far under the 3-hour TTL. Stopped exactly at both caps: 30/30 venues, 15/15 artists worked (0 verified + 15 evidenced blank — a conservative but legitimate outcome, not a shortfall). Priority 1 (artists created <24h) had 16 candidates, all already attempted in earlier firings today or logged as a known duplicate — correctly not re-attempted. Priority 3 (backlog venues) and Priority 5 (genre-only top-up) not reached; budget went entirely to Priority 2 (fresh venue batch) and Priority 4 (oldest backlog artists, now confirmed to reach back to 2025-02-22 — the true backlog tail is older than earlier firings' low-offset pagination suggested).

Circuit breaker: **did not fire.**

## Ledger / snapshot / dashboards

Ledger: 46 lines appended to `data\state\enrichment-ledger.jsonl` (30 venue `verified`, 15 artist `blank`) plus one `snapshot` line. Run-summary line appended to `data\state\run-summary.jsonl` (`recordsEnriched: 45`, `skipped: 0`). Both dashboards regenerated:
- `data\normalized\enrichment\DASHBOARD.html` — 1140 enrichment records, 39 snapshots, exit 0
- `data\normalized\DASHBOARD.html` — exit 0

Snapshot counts (post-run): artistsTotal 2209, artistsMissingSocials 894 (unchanged — no artist field was confidently written this firing), artistsMissingGenres 637 (unchanged), venuesTotal 2963, venuesMissingSocials 934 (was 964 as of the 08:31Z snapshot; −30 for this run's writes).

Claim released: `{"heldBy":null,"releasedAt":"2026-08-15T09:33:30Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-15T09-19-21Z"}`. Heartbeat rewritten to `"outcome":"completed"`.
