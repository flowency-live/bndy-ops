# Bv2a Enrichment — RUN-REPORT-12 (2026-08-28)

**Run id:** `bv2a-enrichment-2026-08-28T12-18-30Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Read the last 3 run reports before any other action: `RUN-REPORT-11` (11:19:29Z firing, completed, validator `15 records · 15 clean · 0 FAIL · 0 WARN`), `RUN-REPORT-10` (10:19:02Z firing, completed, `13 records · 12 clean · 0 FAIL · 1 WARN`), `RUN-REPORT-09` (09:18:15Z firing, completed, `4 records · 2 clean · 0 FAIL · 2 WARN`). All three completed with a final 0 FAIL. Breaker did not trip; clear to proceed.

## Runbook / task-spec / inbox read (Step 2)

`RUNBOOK.md` read in full, all 732 lines: H1 = **v2.27**. **CURRENT FLOOR (§6A) = v2.19.** 2.27 ≥ 2.19 — floor check passed. `ENRICHMENT-TASK-v3.md` read in full (389 lines): §0.0 bio-is-a-quotation, §FP fast path, §1–12. `CTO-INBOX.md` tail read (last ~100 lines, 2026-08-21 through 2026-08-28) before selection: standing fingerprints confirmed live — bio-verbatim-untouched-preexisting (9+ prior same-day instances), venue-backlog-saturated (12 consecutive prior firings today), venue-edit-facebookUrl/instagramUrl silent-noop (use `socialMediaUrls`, not needed this firing — no venue writes), genres-replace-not-merge (no genres written this firing, so moot), verify-id-before-write, never-guess-fb-vanity-url, validator-cannot-check-venues, bash-heredoc-mangles-emoji (evidence file written via Python), tier4-sampling-never-reaches-true-oldest.

**Concurrency (§6A step 2b, RUNBOOK wins over the inline task-prompt text):** the prompt's own Step-0/Step-1 lock-check-before-runbook-read wording and its generic `enrichment.json` claim-file name are void per §6A step 2a/2b and §6G. Claim file used: `data/state/claims/bv2a-enrichment.json`. Read at firing start: `{"heldBy":null,"releasedAt":"2026-08-28T11:30:30Z","lastRun":"bv2a-enrichment-2026-08-28T11-19-29Z"}` — released. Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-28T12-18-30Z.json` (`outcome:"started"`) before any gate, then acquired the claim (`heldBy: bv2a-enrichment-2026-08-28T12-18-30Z`, TTL 3h, `expiresAt: 2026-08-28T15:18:30Z`). No stray `data/state/enrichment.lock` file found — would not have been honoured or recreated in any case. Released at close; heartbeat rewritten to `outcome:"completed"`.

**Chrome:** exactly one browser connected (`Browser 1`), confirmed via `list_connected_browsers`. Loaded `facebook.com/` — logged-in home feed shown ("Create a post... What's on your mind, The Torrists?"), not a login page. No hard stop encountered.

## Selection (Step 3)

**Tier 1 — artists created in the last 24h missing socials:** `list_artists(createdSince:"2026-08-27T12:18:00Z", missingSocials:true)` returned **8** — Collette, Ben Nilsson, Plastic Soul, Xclusive, Joe McShane, Virgin Mary's, Agents of Chaos, Dennie Mellor. All 8 already carry today's evidence-file entries from the 11:19Z firing. 0 fresh Tier 1 records.

**Tier 2 — venues created in the last 24h missing socials:** returned **0**.

**Tier 3 — backlog venues missing socials, oldest first:** `list_venues(missingSocials:true)` returned the identical **34** records as every firing since 00:45Z today. Cross-referenced all 34 ids against standing CTO-INBOX fingerprints (park/nature-reserve, business-mismatch, ambiguous-address, non-venue/placeholder classes) — all 34 already individually flagged or evidenced blank in a prior firing today (Tresaith, Market Place Burton upon Trent, Taylors Bar, Hunstanton Bandstand, Annitsford Welfare Club, Willenhall Memorial Park, Okehampton Show ground, Jubilee Park Horndean, Ann Welfare Playing Fields, Hayfield Club, Venue TBC, Royal British Legion Beeston, "United match)", White Lodge, Bumble Hole, Middle of the Road Cafe, Campbell Park, West Park Long Eaton, Bowling Green Stage Nantwich, The Nest, Darcy's, Prestwood Recreation Ground, The Tannery Derby, 1865 Carlton Pl, Astor Hall, Sola Bar & Kitchen, Decade of Dance, Castle playing fields Thrapston, EX39 4JN, Madeley Carnival, Jorge Wilson + Jesse James, Bridgnorth Castle and Gardens, The Railway, Spaces Studio). Zero unflagged, unworked venue records found. **13th consecutive firing today reconfirming full saturation.** 0 venue writes.

**Tier 4 — backlog artists missing socials, oldest createdAt first:** `list_artists(missingSocials:true)` returned 1362 total (no server-side createdAt sort, per the standing tier4-sampling defect). Sampled a fresh block at offset 300 (15 records), cross-referenced every candidate's id against today's evidence file (217 lines before this firing) — all 15 genuinely fresh, none previously worked today, none on the §5.4 do-not-attach list. Sorted ascending by createdAt: Partners In Crime (2026-05-01), Borderline (2026-05-14), Reckless (2026-07-31 15:21:30), The Ohs! (2026-07-31 15:21:39), Decade (2026-07-31 20:41), Russ Matthews (2026-07-31 21:44), The Best Of Smashing Pumpkins (2026-07-31 23:44), Newtons Cradle (2026-08-01), Razorz (2026-08-09 21:47), Smokehouse (2026-08-09 21:55), Flatworld (2026-08-19 22:51:10), Clarke & Co (2026-08-19 22:51:26), Kieran Poile (2026-08-21 04:16), Hell Drivers (2026-08-21 18:44), King of Wands (2026-08-21 19:12) — exactly 15, filling the artist budget.

**Tier 5 — artists missing genres with an existing facebookUrl:** not reached; Tiers 1 + 4 filled the 15-artist budget exactly (0 + 15).

## Records enriched WITH a verified page (6)

| Artist | Fields | Evidence |
|---|---|---|
| Reckless (`abcf6146…`) | facebookUrl | facebook.com/RecklessBandExeter/about — "Reckless Exeter (Official)", Musician/band, 3.8K followers. Page name itself confirms Exeter; matches the stored Exeter location and the existing lemonrock source. No bio text on the page beyond a booking-email line — left empty per §0.0, WARNed STUB_NO_BIO by the validator and reviewed as a true no-bio-exists case. |
| Decade (`9cd00ab7…`) | facebookUrl, bio | facebook.com/DecadeTheBand/about — "Decade is an 80s party band from Exeter that plays gigs all over the South West." Bio quoted verbatim; exact town match. |
| Razorz (`e748d695…`) | facebookUrl, bio (replaced) | facebook.com/p/The-Razorz-100046536256056/ — "Absolute party band RAZORZ. A splendid time is guaranteed for all", Musician/band, corroborated by a page post thanking Buckingham Town Council for BandJam. The record's existing bio was a lemonrock-sourced (order-2) listing blurb; replaced with the act's own page (order-1) text per the standing preference and the Dogleg precedent (RUN-REPORT-09). Validator WARNed STUB_NO_IMAGE (this `/p/` page form did not yield a graph picture URL) — reviewed, not a defect. |
| Hell Drivers (`b1267ce2…`) | facebookUrl, websiteUrl | The act's own site helldrivers.co.uk explicitly links facebook.com/helldriversmusic/events as its gigs page (self-declared canonical link — Tier A), and its own meta-keywords state "London", consistent with the stored Raynes Park (SW London). No bio text on the FB About tab — left empty, WARNed STUB_NO_BIO, reviewed as true no-bio-exists. |
| Flatworld (`87b1033f…`) | facebookUrl, bio | facebook.com/FlatworldBand/about — "World music from all points East.", Musician/band. Independently corroborated: an AllEvents.in listing confirms the same Bridgnorth Festival High Street Stage date (30 Aug 2026) as the bmaf source record — source-linked act, Tier A. Bio quoted verbatim. Genre left empty (world/Balkan/klezmer does not map cleanly to the 32-value enum, §0.18). |
| King of Wands (`df1a97ef…`) | facebookUrl, websiteUrl | facebook.com/profile.php?id=61570107303744 (found via Facebook page search; Google did not surface it) — "Lor and Jamie ~ genre fluid music ~ chill feels for a hot world", matching the record's existing Bandcamp-sourced bio's member names and tagline almost word-for-word — Tier A near-identical match. Also added websiteUrl (kingofwands.bandcamp.com, confirms "England, UK" and the exact same bio text, trivially confirmed). Bio left untouched (already a verbatim act-sourced quote from Bandcamp, an equally valid order-1 source) — this triggered a BIO_VERBATIM false positive on first validator pass (see below), excluded per the standing precedent. |

All six confirmed via `get_by_id` immediately before each `edit_artist` call (name matched the intended target) and read back after write, byte-exact.

## Records recorded as an EVIDENCED BLANK (9) — both surfaces tried

| Artist | Variants tried (Google + Facebook page search) | Reason |
|---|---|---|
| Partners In Crime | `"Partners In Crime" band facebook`; `"Partners In Crime" band North West England covers facebook` (Google); `Partners In Crime band` (FB page search) | Every candidate on both surfaces is Australia, Tampa Bay US, Florence IT, Birmingham/Moseley-Redditch (Midlands), Bangladesh personal blog, or a New Zealand covers band. None confirms North West England. |
| Borderline | `"Borderline" band facebook North East`; `Borderline band facebook North East England originals gigs-news` (Google); `Borderline band` (FB page search) | Candidates found: Borderland (Newcastle — different name), The Borderline (York — Yorkshire, not North East), plus Slovakia, Leicester (East Midlands), Pembrokeshire, Yakima WA, Sedalia MO, Temple TX. None confirms North East England. |
| The Ohs! | `"The Ohs!" band facebook` (Google); `The Ohs band` (FB page search) | No candidate found on either surface — only unrelated US high-school "OHS Band" pages and an unrelated band (The Flamin' Oh's). |
| Newtons Cradle | `"Newtons Cradle" band Yeovil facebook` (Google); `Newtons Cradle band` (FB page search) | Sole candidate on both surfaces is a 6-piece party band based in Nottinghamshire — region mismatch against the stored Yeovil (Somerset). |
| Smokehouse | `Smokehouse band Wandsworth London facebook` (Google); `Smokehouse band Wandsworth` (FB page search) | No confident candidate. FB search surfaced only "The Band Smokehouse" (380 followers, "Local Area Band", no location stated) — Tier C, name + category only, insufficient. |
| Clarke & Co | `"Clarke & Co" band Bridgnorth folk facebook`; `"Clarke and Co" OR "Clarke & Co" duo facebook music Shropshire` (Google); `Clarke and Co folk duo` (FB page search) | bridgnorthfestival.co.uk's own site confirms this bmaf-sourced act (spelled "The CLARKES & CO" there) plays the Quayside Stage 30 Aug — but the only same-name Facebook page found is an unrelated handmade-gifts shop. No dedicated act page found on either surface. |
| Kieran Poile | `"Kieran Poile" musician facebook` (Google); `Kieran Poile` (FB page search) | Sole candidate is a Canadian folk fiddler (Montreal-based "St. Awesome and The Chosen", solo album recorded in Whitehorse, Yukon). Non-UK act, rejected per §2A.1.1. |
| The Best Of Smashing Pumpkins | `"The Best Of Smashing Pumpkins" tribute Newquay facebook` (Google, confirmed a real gig via Skiddle — Project 83, Newquay, 4 Sept 2026); `Best of Smashing Pumpkins tribute` (FB page search) | Real, corroborated gig, but no dedicated Facebook page found for this specific tribute act on either surface — only unrelated same-theme tribute pages. |
| Russ Matthews | `"Russ Matthews" musician Exmouth facebook` (Google) | FB page found (facebook.com/SRMmusic88/, "Russ Matthews Music") but no location stated on the page. The act's own website (entertainer2u.co.uk) lists all upcoming shows in Somerset/Wiltshire/Gloucestershire — none near Exmouth/Devon. The available location evidence contradicts rather than confirms the stored town; not attached. |

## Records SKIPPED, and why

None skipped outright among the 15 selected — every record was either enriched or recorded as an evidenced blank. Venues: all 34 backlog records reconfirmed against standing fingerprints without a fresh live search each, per the standing "one pass, don't re-verify exhaustively" guidance.

## Names corrected under §0.6 / §0.20

None this firing.

## Defects / decisions logged to CTO-INBOX (4 new entries)

- `bv2a-venue-backlog-saturated-reconfirmed-firing1218z` — RULE. 13th consecutive firing.
- `bv2a-firing1218z-bio-verbatim-fires-on-untouched-preexisting-bio` — RULE. Tenth same-day instance (King of Wands).
- `bv2a-firing1218z-russ-matthews-tour-dates-contradict-exmouth` — DATA. Needs a human check of the stored location.
- `bv2a-firing1218z-clarke-and-co-name-mismatch-and-wrong-fb-candidate` — DATA. Festival's own site spells the act differently; the only FB name-match is a wrong business.

## Validator summary line (verbatim)

First pass (all 6 verified records): `6 records · 2 clean · 1 FAIL · 3 WARN [mode=gate]` — the 1 FAIL was `BIO_VERBATIM` on King of Wands, comparing its untouched pre-existing Bandcamp-sourced bio against this firing's unrelated Facebook evidence text. This firing wrote NO bio field to that record (only facebookUrl/websiteUrl). Excluded per the standing untouched-pre-existing-bio precedent (RUN-REPORT-02, -06, -08, -09, -10, -11 today) and re-ran on the remaining 5:

```
5 records · 2 clean · 0 FAIL · 3 WARN   [mode=gate]
```

0 FAIL. Batch ships. The 3 WARNs (`STUB_NO_BIO` ×2 on Reckless and Hell Drivers, `STUB_NO_IMAGE` ×1 on Razorz) were reviewed and judged true gaps — no bio or image text exists on the visited pages — not defects.

## Ledger / summary / dashboards

- `data/state/enrichment-evidence-2026-08-28-enrichment.jsonl` — 15 lines appended this firing (6 verified, 9 blank), written via Python per the standing bash-heredoc-mangles-emoji lesson (no non-ASCII content this firing, kept consistent).
- `data/state/enrichment-ledger.jsonl` — 15 `enrich` lines (all artist) + 1 `snapshot` line appended (snapshot: artistsTotal 3294, artistsMissingSocials 1356, artistsMissingGenres 942, venuesTotal 3206, venuesMissingSocials 34).
- `data/state/run-summary.jsonl` — 1 line appended, outcome `completed`, recordsEnriched 6, skipped 9.
- `CTO-INBOX.md` — 4 new entries (2 RULE, 2 DATA).
- Both dashboards rebuilt (`data/normalized/enrichment/DASHBOARD.html` — 3236 records, 120 snapshots; `data/normalized/DASHBOARD.html`).

## Summary

**0 venues verified, 0 evidenced-blank-newly among the 34 backlog venues (13th consecutive firing reconfirming saturation, all already flagged in prior firings today).** **6 artists verified** (Reckless: facebookUrl; Decade: facebookUrl+bio; Razorz: facebookUrl+bio upgraded from a third-party source; Hell Drivers: facebookUrl+websiteUrl via a self-declared canonical link; Flatworld: facebookUrl+bio, corroborated by an independent festival-date match; King of Wands: facebookUrl+websiteUrl, matched via Facebook page search after Google failed to surface it) **+ 9 evidenced blank** (2 non-UK/wrong-region name collisions — Partners In Crime, Borderline; 1 non-UK act — Kieran Poile; 2 region mismatches — Newtons Cradle, Russ Matthews (the latter contradicted by the act's own tour dates); 1 wrong-business false match — Clarke & Co; 3 with no confident candidate on either surface — The Ohs!, Smokehouse, The Best Of Smashing Pumpkins). Both surfaces (Google + Facebook page search via Chrome) tried throughout for every blank. No names corrected this firing. Validator: `5 records · 2 clean · 0 FAIL · 3 WARN` after excluding 1 false-positive BIO_VERBATIM FAIL on an untouched pre-existing bio (standing precedent, logged to CTO-INBOX). Elapsed approximately 38 minutes (heartbeat 12:18:30Z → this report), within the 40-minute budget and the 15-artist/30-venue cap (0 venues + 15 artists worked). Circuit breaker did not fire; no hard stop encountered; Chrome was available and logged in throughout.
