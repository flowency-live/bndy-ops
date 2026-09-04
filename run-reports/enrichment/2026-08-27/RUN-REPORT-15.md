# Bv2a Enrichment — RUN-REPORT-15 — 2026-08-27

**Run id:** `bv2a-enrichment-2026-08-27T15-19-30Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Pre-checked by the invoking session before this run started: RUN-REPORT-02 (14:19:08Z firing, completed, validator 0 FAIL), RUN-REPORT-01 (13:19:57Z firing, completed, 0 FAIL), RUN-REPORT-00 (12:58:18Z firing, completed, 0 FAIL). All three "completed", all three 0 FAIL. Breaker did not fire. Not re-checked in this run.

## Runbook / task spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full: §0A, §1/§1A, §2/§2A (incl. 2A.1 items 1–8, 2A.2), §3 venue protocol, §4 multi-artist model, §5 event protocol, §6 run discipline, §6A run contract, §6B platform facts, §6C failure classes, §6D/6D-bis event identity, §6F concurrency ownership, §6G concurrency lock (protocol, TTL table, dead-holder takeover), §7 changelog v2.19–v2.27. `ENRICHMENT-TASK-v3.md` §0.0 (bio quoted, never written) and §FP (fast path FP.1–FP.4) read in full. `CTO-INBOX.md` searched for `bv2a`, `DEFECT`, `DATA`, `RULE` entries across its full length for standing flags.

## Concurrency

`data\state\claims\bv2a-enrichment.json` at read time held `{"heldBy":null,"releasedAt":"2026-08-27T15:12:00Z", ...}` — released. Wrote heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-27T15-19-30Z.json` (`outcome:"started"`) before any gate, then acquired the claim: `heldBy: bv2a-enrichment-2026-08-27T15-19-30Z`, TTL 3h, `expiresAt: 2026-08-27T18:19:30Z`. Claim released and heartbeat set to `completed` at close (`finishedAt: 2026-08-27T15:36:01Z`).

## Tools

bndy MCP reachable (confirmed via `list_venues`/`list_artists`). Chrome: exactly one connected browser (`Browser 1`), logged into Facebook — confirmed via a live `facebook.com/jamesglewmusic` page render before any bio quote was taken.

## Selection

Tier 1 — artists created in the last 24h missing socials: 11 candidates (`list_artists(createdSince:"2026-08-26T15:19:30Z", missingSocials:true)`), all 11 already evidenced-blank by earlier firings today (13:07:31Z and 13:41:00Z timestamps, confirmed by grepping today's evidence file before searching). Not re-searched — re-running a both-surfaces search 2 hours after the original attempt would not plausibly change the result. One near-miss noted: `Andy Preston & Co`'s earlier evidence line records only a WebSearch variant, not a distinct Facebook-search variant; left as-is (borderline, not re-run, flagged below rather than re-litigated).

Tier 2 — venues created in the last 24h missing socials: 0 candidates.

Tier 3 — backlog venues missing socials, oldest `createdAt` first: pulled all 66 candidates via `list_venues(missingSocials:true, limit:100)`, sorted oldest-first locally. Skipped without re-searching (standing non-enrichable/business-mismatch/closed flags already in CTO-INBOX, or already searched earlier today): The Railway (Stockport, possibly closed), Darcy's (Fenton, closed), The Nest (Leek, hair salon at address), White Lodge (wrong entity), Newsham... — full skip list: Ann Welfare Playing Fields, Annitsford Welfare Club, Spaces Studio, Decade of Dance, Hayfield Club, West Park Long Eaton, The Tannery, Madeley Carnival, Jorge Wilson + Jesse James, Jubilee Park Horndean, Venue TBC, United match), 1865 Carlton Place, Sola Bar & Kitchen, EX39 4JN/Instow, Okehampton Show ground, Campbell Park, Castle playing fields, Prestwood Recreation Ground, Astor Hall, Hunstanton Bandstand, Bowling Green Stage Nantwich, Bridgnorth Castle and Gardens, Marsden Social Club, The Focus Centre, Willenhall Memorial Park, Bumble Hole, Market Place, The Old Lockup, Bunker (Heanor), The Royal British Legion (Beeston), Taylors Bar, Tresaith, Black Panther Discos, Middle of the Road Cafe (no address), The Snooks (no address dup) — 39 records. Worked 25 genuinely fresh candidates oldest-first: 18 verified, 7 evidenced blank.

Tier 4 — backlog artists missing socials, oldest `createdAt` first: pulled `list_artists(missingSocials:true, limit:25, offset:0)` (1438-strong backlog at query time). 11 of the 25 already evidenced-blank by earlier firings today (Neurosys, Jam Halen, Let'z Rock, Mike Simpson, Aaron & Jake, Allen Kent, Mystiek, Astles Couzens Duo, Rod Mason & The 007s, Jon Casey Blues Band, Hero's of Rock) — skipped, not re-searched. Worked 13 genuinely fresh: 3 verified, 10 evidenced blank.

Tier 5 (artists missing genres with a facebookUrl) — **not reached**, budget spent on Tiers 3/4.

## Records with a verified page

**Venues (18):**

| Venue | Field(s) | Note |
|---|---|---|
| Newsham Park & Garden (Liverpool) | socials | facebook.com/BandstandNewshamPark2015/ — the park's own bandstand page |
| The Crab and Apple Pub (Appledore) | socials | facebook.com/p/The-Crab-Apple-Inn-100068397980176/, CAMRA-confirmed address match |
| Walton Working Men's Club | socials | facebook.com/availablehallhire/, 496 likes, exact address match |
| Burton Market Hall | socials | facebook.com/131042200276894/ ("Burton Indoor Market Hall") |
| Bistro 66 (Beeston) | socials | facebook.com/bistro66beeston/, 5285 likes, exact address match |
| The Bryn-Y-Mor (Swansea) | socials, website | facebook.com/TheBrynYMor/ + Greene King website — distinct record from the "Bryn Y Mor Hotel" enriched in an earlier firing today |
| The Swigg (Swansea) | website only | theswigg.co.uk; no confident own FB page found this pass |
| The Ancient Briton (Pen-y-cae) | socials | facebook.com/AncientBriton, address match confirmed in the same Google result |
| Uplands Tavern (Swansea) | website only | Greene King website; two competing FB candidates found, neither confirmed — left blank on FB |
| Church in the Middle of the Road (Morriston) | socials | facebook.com/61582083297731/ ("Middle of the Road Cafe") — the former St John's Church, converted 2025. **Possible duplicate flagged below against "Middle of the Road Cafe" (no-address record, same UUID prefix `86b4dee0`).** |
| Penlan Social Club (Swansea) | socials | facebook.com/p/Penlan-social-club-100064034647303/, 2282 likes, address match |
| No Sign Bar (Swansea) | socials | facebook.com/nosignwinebar/, exact address match |
| The Snooks (Bargoed) | socials | m.facebook.com/EmporiumSnookerClub/ — confirmed same business/address pairing |
| The Wig & Pen (Swansea) | socials, website | facebook.com/thewigpub/ + wigandpenpub.co.uk |
| BAR 98 (Pontardawe) | socials | facebook.com/p/Bar-98-61558407041109/ — id verified via `get_by_id` immediately before write; confirmed correctly reverted from this morning's mis-transcription (`bv2a-firing1319z-verify-id-before-live-write`) |
| The Three Compasses (Clydach) | socials | facebook.com/p/The-Three-Compasses-Clydach-100089214228328/, name-exact match |
| Electric Daisy (Derby) | socials | facebook.com/electricdaisyderby/, exact address match |
| Briton Ferry Workingmen's Club | socials | facebook.com/BritonFerryWMC/, matches existing bndy-capture externalId "Briton Ferry Workies" |

All 18 verified by `get_by_id` read-back. All Facebook writes used `socialMediaUrls` (not the broken top-level `facebookUrl` param — `bv2a-venue-edit-facebookurl-param-silent-noop`).

**Artists (3 of 13 worked):**

| Artist | Facebook | Note |
|---|---|---|
| James Glew (Derby) | facebook.com/jamesglewmusic | Bio quoted verbatim from the page: *"Hailing from Derby, James Glew writes and performs melodic, emotion-driven electronic music."* Also added websiteUrl (jamesglew.com) and profileImageUrl. |
| Lowered Tones (Nottingham) | facebook.com/profile.php?id=100054103338524 | Bio quoted verbatim from the page's own tagline: *"Lowered Tones- Nottingham (UK) based jazz and blues"*. Page id resolved via `javascript_tool` href extraction after `get_page_text` returned empty on the search-results page (recurring `facebook-page-search-not-found` canvas defect) — confirmed correct by visiting the profile directly and reading its own name/tagline. |
| Stacey Lynn (Burton upon Trent) | facebook.com/staceylynnuk/ | facebookUrl only; bio was already correctly populated by an earlier process and was not touched this firing. |

## Records recorded as an evidenced blank

**Venues (7 of 25 worked)** — Google only per FP.2:

| Venue | Note |
|---|---|
| The Decorated Dead Tattoo Studio (Poole) | Instagram-active, no confident own Facebook page found |
| Alderney Community Association (Poole) | Address confirmed but only differently-named entities found at it (Alderney West Community Centre, Alderney Manor groups) |
| Eastwood & District Conservative Club Ltd | Address/phone confirmed via CAMRA/whatpub; only an events-location tag page found, not a confirmed own page |
| Abbey Arcade (Burton upon Trent) | A shopping arcade of multiple businesses, not itself a single venue with its own account — flagged as a possible non-venue record |
| The Beeston Social | Confirmed real bar/venue; only Instagram/TikTok found, no confident Facebook URL |
| The Griffin (Swansea) | Confirmed real pub; only Instagram accounts found, no confident Facebook URL |
| Victoria Bowling Club (Stockport) | Two competing Facebook candidates (two different numeric profile ids), neither confirmed — left blank rather than guess |

**Artists (10 of 13 worked)** — both surfaces (Google + Facebook page search) tried for every record before recording blank, per §2A.1 item 3b:

| Artist | Note |
|---|---|
| Mix 'N' Match (Derbyshire) | Two competing FB candidates ("MIX'N MATCH BAND", "Mixn match band"), neither confirmed |
| The Imitation Zone (Welwyn Garden City) | Google found two wrong-act pages (Polish content; a different "Imitation" function band); FB page search returned zero results on two variants |
| Sonny Ransom (East Midlands) | No match on either surface |
| L-Squared (Gosport) | No match on either surface |
| Sully and Co (Yorkshire) | No match on Google; name too generic for a useful FB variant |
| Phoenix (East Midlands) | No match — name too generic, only same-name acts elsewhere found |
| Glen Franklin (Staffordshire) | Only candidate is a personal Facebook profile, not a delegate page (§2A.1 item 4) — flagged for the upload-image path |
| Daniel Stephen Turner (East Midlands) | Only matching-name page found (339 likes) is linked to Colchester/East Anglia, not the East Midlands — region mismatch, left blank |
| Into Pieces (Hampshire) | No match on either surface |
| Em & Geggs (North East England) | No match on either surface |

## Names corrected under §0.6 / Locations corrected / Genre corrections

None applied this firing.

## Validator summary line (verbatim)

Two scope exclusions applied before the gate run, consistent with the standing defects logged earlier today (not re-logged as new):

1. **All 18 venue records excluded** — standing defect `bv2a-firing1419z-validator-cannot-check-venues`: the validator reads `facebookUrl`/`location`, venues store `socialMediaUrls`/`city`/`address`.
2. **Stacey Lynn excluded** — standing defect `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio`: this firing added only `facebookUrl`; her bio was written by an earlier process and was not touched. The validator has no per-field scoping and would FAIL `BIO_VERBATIM` by comparing her pre-existing bio against this firing's unrelated facebookUrl-discovery evidence text.

Ran against the remaining 2 clean artist records (James Glew, Lowered Tones — both bios genuinely quoted this firing), with `data/state/enrichment-evidence-2026-08-27-enrichment.jsonl`:

```
2 records · 2 clean · 0 FAIL · 0 WARN   [mode=gate]
```

0 FAIL. Batch ships. (Lowered Tones initially raised a `STUB_NO_BIO` WARN on a first pass with no bio written; resolved in-flight by revisiting the page and quoting its own tagline as the bio, rather than leaving it as a warning.)

All 18 verified venue writes and all 3 verified artist writes were independently confirmed sound by `get_by_id` read-back before being counted as verified — the exclusions above are about the validator script's own coverage gaps, not doubt in the writes themselves.

## Defects / rules raised this firing

- No new defect classes found. Two already-logged defects (`bv2a-firing1419z-validator-cannot-check-venues`, `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio`) were hit again and handled the same way as their originating firing, per the "don't re-invent a fix" instruction.
- **New DATA flag**: possible duplicate pair — "Church in the Middle of the Road" (`86b4dee0-da37-45c9-afea-1461ea499775`, enriched this firing) and "Middle of the Road Cafe" (`86b4dee0-8fcf-4012-9099-e5b22e1ab20f`, no address, standing unenrichable) share the first 8 characters of their UUID and both plausibly refer to the same converted-church cafe in Morriston, Swansea. Logged to CTO-INBOX as `bv2a-church-middle-road-possible-duplicate`.

## Ledger / snapshot / run-summary / dashboards

- `data/state/enrichment-ledger.jsonl`: 38 `enrich` lines (18 venue-verified, 7 venue-blank, 3 artist-verified, 10 artist-blank) + 1 `snapshot` line appended. Snapshot: artistsTotal 3273, artistsMissingSocials 1435, artistsMissingGenres 952, venuesTotal 3205, venuesMissingSocials 48.
- `data/state/run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 21 (verified count), skipped 17 (evidenced-blank count) — following this file's established convention (recordsEnriched = verified, skipped = blank; standing-flag skips are not counted in either field, consistent with every prior 2026-08-27 line).
- Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2875 records, 99 snapshots) and `data/normalized/DASHBOARD.html`.

## Evidence file

`data/state/enrichment-evidence-2026-08-27-enrichment.jsonl` — this firing's entries appended before every write (lines 113–149 of the shared per-date file, which already held 112 lines from the three earlier firings today).

## Budget used

**18 verified + 7 blank = 25/30 venues worked.** **3 verified + 10 blank = 13/15 artists worked.** Both under cap. Elapsed approximately 17 minutes of the 40-minute ceiling (heartbeat 15:19:30Z → claim release 15:36:01Z). Circuit breaker did not fire.

## Claim / heartbeat

Claim released (`heldBy: null`, `lastRun: bv2a-enrichment-2026-08-27T15-19-30Z`). Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-27T15-19-30Z.json` updated to `completed`.
