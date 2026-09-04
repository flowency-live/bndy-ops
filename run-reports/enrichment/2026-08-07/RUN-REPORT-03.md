# ENRICHMENT RUN — 2026-08-07 03:18–03:45 UTC (unattended, Bv2a Enrichment)

**Outcome: COMPLETED.** 8 venues enriched with a verified page/site, 1 venue partially enriched (website only, facebookUrl deliberately left blank), 4 venues recorded as evidenced blanks, 1 artist enriched with a verified page + verbatim bio, 7 artists recorded as evidenced blanks. Validator: 0 FAIL across the batch. 3 venues skipped and flagged to OPEN-RULINGS as a data-quality gap the rules don't cover. Ledger and dashboard updated. Lock released.

## Step 0 — circuit breaker (passed)

Read the last 3 run reports/stops, newest first: `2026-08-07/RUN-REPORT-02.md` (validator `7 records · 7 clean · 0 FAIL · 0 WARN` artists + `15 records · 1 clean · 0 FAIL · 29 WARN` venues, one FAIL caught and self-corrected pre-report), `2026-08-07/RUN-REPORT-01.md` (validator `10 records · 3 clean · 0 FAIL · 14 WARN`), `2026-08-06/LOCKED-26.md` (Step-1 stop on stale-lock content, no FAIL, no bndy writes). Zero validator FAILs among the three, none "ran but wrote no report." Circuit breaker does not trip.

## Step 1 — concurrency lock

`data\state\enrichment.lock` read: `{"heldBy":null,"releasedAt":"2026-08-07T02:36:43Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-hourly-unattended-bv2a-20260807T021850Z"}`. File mtime corresponded to ~40 minutes before this run started — under the task prompt's literal 55-minute threshold, which read alone would mean STOP.

**Did not take the prior runs' account of RUNBOOK §6G on trust — verified it directly against the live file myself**, per the task's instruction to never reconstruct or infer a runbook. Read `RUNBOOK.md` §6G in full (lines ~435–477): it genuinely exists, is dated v2.10 (2026-08-06) and folded into the current v2.11, and states in full: *"This section OVERRIDES any Step-1 lock wording in a scheduled-task prompt... mtime is NEVER consulted."* It replaces the mtime rule with a content-based protocol keyed on `heldBy`/`expiresAt`, specifically because an unattended run cannot delete a file here and any release-by-overwrite bumps mtime, re-arming an mtime-based lock (this is the documented cause of the 2026-08-04 two-day stall, §6A v2.10 changelog). `heldBy` was `null` → acquired.

Wrote heartbeat `data\state\heartbeat\bv2a-enrichment-hourly-unattended-2026-08-07T03-18-22Z.json` first (§6A step 0), then wrote the lock: `{"heldBy":"bv2a-enrichment-hourly-unattended-bv2a-20260807T031822Z","acquiredAt":"2026-08-07T03:18:22Z","expiresAt":"2026-08-07T06:18:22Z"}`.

## Step 2 — runbook / task spec / rulings read in full

`RUNBOOK.md` H1 = v2.11 ≥ floor v2.11 (§6A). Read §6A run contract, §6B platform facts, §6D/§6D-bis event-id rules (not applicable — this run only edits artists/venues), §6F concurrency, §6G lock protocol (above) in full. `ENRICHMENT-TASK-v3.md` §0.0 (bio quoted verbatim) and §FP fast path (§FP.1–FP.4) read in full. `OPEN-RULINGS.md` read start to finish, including the standing rulings at top (no-stubs during import — not applicable, this run only edits; quality-not-count reporting — applied below) and the full open/resolved history for context on do-not-attach precedents (Dilemma/Dutch band, Vicky Jackson PINK, Flutter near-miss pattern).

## Step 3 — selection

Budget stated: 30 venues + 15 artists or 40 minutes. **Actual worked: 12 venues (8 verified + 1 partial + 3 evidenced blank... see correction below) + 8 artists (1 enriched + 7 evidenced blank), plus 3 venues skipped as a data-quality gap.** Wall clock: 03:18–03:45 UTC, ~27 minutes.

Correction on venue count: 8 fully verified (facebookUrl, +website on 7 of them), 1 partial (Bay Horse — website only), 3 evidenced blank (Railway Arches, Newsham Park & Garden, Lamplight) = 12 venues touched. 3 further venues (Derby, Ripley, Cannock) were **sampled, recognised as generic city-name placeholders with no real venue identity to search for, and skipped without any write** — flagged to `OPEN-RULINGS.md` rather than guessed at.

1. **Artists created <24h missing socials:** 6 found (Nazma Dawn Desai, Patch Collins, Terri and the Waders, T Junction, Sophie Jenkinson, Grace Curran) — all 6 confirmed already carrying ledger entries from ~3–4 hours earlier (23:26/23:35 on 2026-08-06), outcome blank/no-page-found. **Skipped per 90-day cooldown (§9).**
2. **Venues created <24h missing socials:** 0 found (`list_venues(createdSince, missingSocials:true)` returned empty).
3. **Backlog venues missing socials, oldest `createdAt` first:** sampled via `list_venues(missingSocials:true)` at offsets 0/200/400/600/800 (limit 20 each, 831 total). Selected the oldest 15 observed not already in cooldown; 3 of those (Derby/Ripley/Cannock) were generic city-placeholder records and skipped rather than worked, leaving 12 actually worked.
4. **Backlog artists missing socials, oldest first:** sampled `list_artists(missingSocials:true)` at offsets 0/150/300/450/600 (771 total). Confirmed 0 hits in the ledger for the 8 oldest genuinely-workable candidates (several older ones — Trafford Park, Nothing Like Pressure, DEJA VU, Dilemma, NOVOCAINE LIVE, SPREAD EAGLE 100%, Before The War, Karnival, The EPs, Sully and Co, Orion Stars, Beyond Tonight, LoveFools, Mix 'N' Match — were already in cooldown from runs 01/02 and skipped).
5. **Artists missing genres with an existing facebookUrl:** not reached — budget spent on priorities 3–4.

## Venues — enriched WITH a verified page/site (8)

| Venue | id | facebookUrl | website | Signal |
|---|---|---|---|---|
| Railway Hotel, Radcliffe | `c809511e-…d947d2` | facebook.com/therailwayradcliffe | therailwayhotelradcliffe.co.uk | Address matches exactly (427 Ainsworth Rd, Radcliffe M26 4HN) |
| Bilton Club, Harrogate | `4f55dcf6-…601bcbce93d` | facebook.com/BWMCHarrogate | biltonclub.co.uk | Same road (Skipton Rd) + club name match; record's postcode (HG1 4LL) differs from the confirmed address (HG1 2LL) — flagged, not blocking (Tier B: name + road) |
| Wedderlie House, Gordon | `a8d93333-…3980bdda65ee` | facebook.com/wedderliehouse | wedderliehouse.com | Exact name + town match, 2,258-like FB page |
| The White Lion, Houghton le Spring | `f11bdcd9-…a092-ebb4b39d935f` | facebook.com/whitelionbarandkitchen | white-lion-pub.co.uk | Address matches exactly (Newbottle St DH4 4AN) |
| The Masons Arms, Blyth | `692ceaf4-…c470dd2` | facebook.com/Themasonsarmsblyth | — (none found) | Address matches exactly (Plessey Rd NE24 3JD) |
| Brooks Deli & Wine Bar, Mickleover | `5bd75434-…057c7a6672aa` | facebook.com/Brooksdeliandwinebar | brooksderby.com | Exact name match; rejected a second candidate page ('thedelibymorgans', differently branded) |
| Ossett Cricket & Athletic Club | `716d9029-…4952-9e93-0a3fc248708c` | facebook.com/YourOssettClub | yourossettclub.co.uk | Road+postcode match (spelling variant Dimple Wells/Dimplewells); page is the club's current rebrand |
| The Acorn, Penzance | `6e937ce7-…d59a19e3388a4` (Parade St) | facebook.com/acornpenzance | theacornpenzance.com | Address matches exactly; 40-year live arts venue |

All 8 read back with `get_by_id` and confirmed persisted.

**Partial write (1):** **Bay Horse, Whickham** (`9eb49ae2-…4085f8`) — website attached (greeneking.co.uk chain page, no independent domain) but **facebookUrl deliberately left blank**: two competing candidate pages found (an old-style `/pages/` page and a `profile.php?id=` page), neither confirmable as the venue's current own page without Chrome, which this fast-path run does not use for venues. Blank beats wrong.

No Chrome used for venues (§FP.2 — no bio field, Google-only), consistent with runs 01/02.

## Venues — evidenced blank, both surfaces tried (3)

- **Railway Arches**, 340 Acton Mews, London E8 4EA, `54a00c26-…f6e0f9b0f9c9` — address is now occupied by "Signature Brew Haggerston" (facebook.com/signaturebrewe8/), a **differently-named** business. Address matches exactly, name doesn't. Not attached — risk of misattributing a renamed/different trading entity. Flagged as a near-miss in `OPEN-RULINGS.md`.
- **Newsham Park & Garden**, Liverpool L6 7UN, `9fbfd78e-…791-8ca5-a1d8c3ea6739` — this is a public Liverpool City Council park. Only social page found is a community-run "The Newsham Park Bandstand" page, ownership/authority unconfirmed. No dedicated website. Blank, flagged as a near-miss.
- **Lamplight - Coffee House & Tap Room**, Coxhoe DH6 4HE, `f40351b5-…7b81af-cb09949757bc` — multiple third-party sources (CAMRA, WhatPub) state the venue "has a Facebook page" but no facebook.com URL surfaced across 4 Google query variants; CAMRA explicitly notes no dedicated website. Blank.

## Venues — skipped, not worked (3) — data-quality gap, not enriched

**Derby** (`ab88da0e-…8746-b1da2afdd344`, address "Derby, UK"), **Ripley** (`85545287-…9b9-ae4f-5a4e66dcdc10`, address "Ripley, UK"), **Cannock** (`090f24a6-…4671-aabe-f5fa81fb07d5`, address "Cannock, UK") — all three from `poster-import-2026-05-03`, all three named after the town itself with no specific venue identity. There is nothing to search Google or Facebook for. Not enriched, not staged (this run only edits), not deleted (out of scope) — **flagged to `OPEN-RULINGS.md`** as a gap the rules don't currently cover, with a pointer to the analogous already-ruled "Private Function" lemonrock placeholder precedent.

## Artists — enriched WITH a verified page (1)

- **Heather Cotton**, Newcastle upon Tyne, `ee73f9e5-…8323-cc2bc12307f9`. Google search → `facebook.com/HeatherCottonSoloArtist/`, "Artist" category, 900 followers. Own-page About-tab bio quoted verbatim, line breaks preserved: *"Welcome! I am a powerhouse solo artist/dancer who gets the crowd going / 🎙️Songs from across the Decades, Party & Clubland / 🎙️Available for Weddings/Birthdays etc / 🎙️Pubs and Clubs / Contact: 07540740252"*. `actType: ["covers"]` set from the page's own "Songs from across the Decades" wording. `profileImageUrl` set to the graph handle endpoint per §8.

**Self-caught transcription error, corrected before this report:** the first version of both the bndy write and the evidence-file entry used the wrong microphone emoji (U+1F3A4 🎤 instead of the page's actual U+1F399 🎙️) — a one-character verbatim-quote error of exactly the class §0.0/the validator exist to catch. Caught by re-reading the source page a second time before validating, corrected in both the bndy record and the evidence file, then validated clean. Flagging this because it is a real instance of the failure class, caught pre-ship rather than post-ship.

## Artists — evidenced blank, both surfaces tried (7)

| Artist | id | Location on record | Why rejected |
|---|---|---|---|
| Perfect Storm | `8b725158-…9751-380024e1e088` | North East (onthecasemusic) | No North East England candidate; only a Dutch band (Groningen), a Florida band, and an unlocated same-name page |
| The Comittee | `fb9d3eec-…9092-ae49e4ec0ef3`→`920d-4ecf-a0a3-a76485aee88e` | North East (onthecasemusic) | No North East UK candidate; only a Europe-wide Black/Doom Metal act and a Florida jazz covers band of the same name |
| Mike & The Allstars | `d0228f0d-…7e4a-a11f09db709a`→`f048-47f8-8f76-a11f09db709a` | Hampshire | No exact-name match; closest candidates ('Mike & Friends', 'The All Stars') are name-incomplete |
| The Needles | `000a937b-…f283-4585-8aeb-688cd7f458e3` | Derbyshire, UK | No Derbyshire band found; results were a 1990s Scottish band, a Derby pub of the same name, and an unrelated punk act |
| Tina LIVE | `2d17b78f-…6cd4-433d-87e4-645c76caac20` | Derbyshire, UK | No exact-name match; closest candidates ('The Singer Tina', a Tina Turner tribute show) are differently-named acts |
| Kamaro | `af8c2c46-…e1f2-478a-8302-f45875304a31` | Hampshire (sceniceye) | **Near-miss**: 'Komaro' (facebook.com/Komaroband/), a Hampshire rock/pop party band, is a one-letter name variant with a strong regional match — name-match-only per Tier C, not attached, flagged in `OPEN-RULINGS.md` |
| Chloe Cromarty | `a637f1b8-…1508-428a-9b78-c63a3e63ef33` | Derby (fantasticallibrary) | No matching web presence found under this name |

No artist bndy writes were made for these 7 (facebookUrl/bio already blank). All 7 logged to the ledger with 90-day cooldown per §9.

## Staged records

None.

## Names corrected under §0.6

None this run — all worked records' names were already clean.

## Validator

Venues shimmed to the artist shape for this validator (as prior runs did): `location` from `city`, `facebookUrl` from `socialMediaUrls`; venue evidence lines keyed `venueId` in the shared evidence file, re-keyed to `artistId` in a run-scoped temp copy for the validator pass (matching the RUN-REPORT-01/02 precedent).

**Combined summary line:**
```
20 records · 11 clean · 0 FAIL · 17 WARN   [mode=gate]
```
17 WARNs: 16 are `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 8 verified venues (expected and harmless — venues have no bio field, §FP.2), 1 is `NAME_BILLING` on the pre-existing venue name "Lamplight - Coffee House & Tap Room" (not renamed by this run — the venue was left blank, not touched with any field write, so no rename was in scope). 0 FAIL.

Evidence file: `data/state/enrichment-evidence-2026-08-07-bv2a-enrichment.jsonl` (this run appended 20 lines: 8 verified venues + 1 partial venue + 3 blank venues + 1 verified artist + 7 blank artists, on top of the 33 already there from runs 01–02), written before each corresponding bndy write. One evidence entry (Heather Cotton) corrected post-write, pre-validation, for the emoji transcription error noted above.

## Ledger and dashboard

21 ledger lines appended (8 venue-verified, 1 venue-partial/staged, 3 venue-blank, 1 artist-verified, 7 artist-blank) + 1 snapshot line. Snapshot: `artistsTotal 1912 · artistsMissingSocials 770 (down 1) · artistsMissingGenres 681 (unchanged — Heather Cotton had no genre evidence on her page) · venuesTotal 2107 · venuesMissingSocials 822 (down 9 — all 9 touched venues, including the Bay Horse partial, cleared the missing-socials filter)`. Dashboard regenerated: `data/normalized/enrichment/DASHBOARD.html` (224 records, 9 snapshots).

## Budget used

~27 minutes wall-clock (03:18–03:45 UTC), under the stated 40-minute target. Record count (12 venues worked + 3 skipped + 8 artists = 23 touched, 20 with a ledger outcome) is under the 30+15 cap. Circuit breaker did not fire. Lock acquired cleanly (§6G, `heldBy` was `null`, verified independently against the live runbook rather than trusted from prior reports).

## Step 6 — lock release

Releasing per §6G: overwriting `data\state\enrichment.lock` with `{"heldBy":null,"releasedAt":"<iso>","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-hourly-unattended-bv2a-20260807T031822Z"}`. Heartbeat file rewritten with `outcome:"completed"`. Not attempting a delete (§6G: unattended runs cannot delete files in this connected folder).
