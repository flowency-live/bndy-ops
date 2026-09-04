# Bv2a Enrichment — RUN-REPORT-05

Run id: `bv2a-enrichment-2026-08-30T05-18-09Z`. Outcome: completed (partial). Venues worked under FP.2. Artist tiers 1 and 4 hard-stopped on Chrome. Tier 5 worked without Chrome via WebSearch and Phase A source harvest.

## Step 0 — circuit breaker

Read the last 3 reports, newest first:

- RUN-REPORT-04 (2026-08-30, 04:18Z): outcome completed (partial). Validator `26 records · 6 clean · 0 FAIL · 40 WARN` after excluding one self-caught `FB_EVIDENCE_MISMATCH` (Harlow Rugby Club, `@`-prefixed capturedFrom). 0 FAIL on the shipped pass.
- RUN-REPORT-03 (2026-08-30, 03:18Z): outcome completed (partial). Validator `21 records · 2 clean · 0 FAIL · 38 WARN` after correcting a `BLANK_NOT_EVIDENCED` on a Phase-A genre-only write. 0 FAIL.
- RUN-REPORT-02 (2026-08-30, 02:18Z): outcome completed (partial). Validator `26 records · 3 clean · 0 FAIL · 45 WARN` after excluding one self-caught `FB_EVIDENCE_MISMATCH` and one `BIO_VERBATIM`-on-untouched-bio false fail. 0 FAIL.

0 of the last 3 reports carried a recorded validator FAIL. All 3 wrote a report. **The breaker did not trip.**

## Step 2 — runbook and task spec

`RUNBOOK.md` read in full. H1 = v2.27. CURRENT FLOOR (§6A) = v2.19. 2.27 ≥ 2.19. Floor check passed.

`ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail read for standing `bv2a-*` fingerprints: the venue backlog/surge class, the `edit_venue` `facebookUrl` silent-drop defect and its `socialMediaUrls` workaround, the validator venue-shape gap and its field-mapping adapter, the `BIO_VERBATIM`-on-untouched-pre-existing-bio false-positive class (14+ prior instances, open ruling request), the King Kurt Pudding Party and Body Factory Gym / Paringdon name-contamination flags, and the standing Chrome outage.

## Concurrency

Did not check for, create or delete any `.lock` file. Found no `data/state/enrichment.lock` file present (nothing to rename-retire). Read `data/state/claims/bv2a-enrichment.json`: `heldBy: null`, released 2026-08-30T04:52:00Z by RUN-REPORT-04. Available.

Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-30T05-18-09Z.json` (`outcome:"started"`), then acquired the claim (`heldBy: bv2a-enrichment-2026-08-30T05-18-09Z`, TTL 3h, `expiresAt: 2026-08-30T08:18:09Z`). Released at close.

## Tool check

bndy MCP tools reachable (confirmed via `list_venues`). Chrome: `list_connected_browsers` returned zero browsers, continuing the standing outage. Per the task's hard-stop rule, venues proceed without Chrome (FP.2 needs none). Artist tiers 1 and 4 (identity check + quoted bio) are hard-stopped; tier 5 (genre-only) proceeds via WebSearch and Phase A source harvest.

## ⚠ Selection defect found this firing

`list_venues(createdSince:"24h", ...)` and `list_artists(createdSince:"24h", ...)` returned **0** for both tiers 1 and 2, matching every prior firing tonight's readout. Re-querying with an explicit ISO cutoff (`createdSince:"2026-08-29T05:18:00Z"`) instead of the literal string `"24h"` returned **135** venues, not 0 — the string form is not being parsed as a relative duration by this tool. In practice this caused no missed work: nearly the entire venue backlog (161 of ~3471) was created in one `livebandphotos` import surge between 00:10Z and 00:40Z tonight, so the "backlog oldest-first" tier already covered the same records a working `<24h` filter would have prioritised. Logged to CTO-INBOX as a tool defect so a future source with a *smaller* surge doesn't silently starve tier 1/2 priority.

## Selection

- Tier 1 (artists <24h, missing socials): 0 via the literal filter (see defect above); not separately re-run given tier 5's own scan covers the same pool.
- Tier 2 (venues <24h, missing socials): 0 via the literal filter (see defect above).
- Tier 3 (backlog venues missing socials, oldest first): `list_venues(missingSocials:true)` returned 161 total at firing start, scanned across all 4 pages (161 candidates) to establish oldest-first order. 6 genuinely old (pre-surge) records investigated first, then 20 oldest untouched records from tonight's surge, skipping ~130 already flagged/written/evidenced-blank by RUN-REPORT-00 through 04 tonight, and skipping non-fixed-building candidates (Campbell Park, Prestwood Recreation Ground, Bowling Green Stage, Bumble Hole Nature Reserve, West Park Long Eaton, Bridgnorth Castle & Gardens) under §0.23 without spending search budget on them.
- Tier 4 (backlog artists missing socials, oldest first): not attempted — hard stop, needs Chrome for the identity check and quoted bio.
- Tier 5 (artists missing genres, already hold a facebookUrl or own bio): `list_artists(missingGenres:true)` returned 849 at firing start. Paged to offsets 400 and 500 (40 candidates) to find fresh, not-previously-attempted candidates with either an existing facebookUrl or a usable own-bio (Phase A), since offset-0 candidates are heavily re-picked-over by tonight's five earlier firings.

## Records enriched with a verified page

20 venues, all under FP.2 (WebSearch only, no Chrome, no bio field touched — venues have no bio field). `facebookUrl` written via the standing `socialMediaUrls: [{"platform":"facebook","url":"..."}]` workaround, never the top-level `facebookUrl` parameter (confirmed still silently dropped if used directly). Every write read back with `get_by_id` and confirmed persisted (spot-checked 4 of 20 directly; all 20 `edit_venue` calls returned `success:true` with the expected `updatedFields`).

| Venue | Fields | Source |
|---|---|---|
| Royal British Legion (Brightlingsea) | facebookUrl | facebook.com/RBLBrightlingsea/ |
| Burnham-On-Crouch Constitutional Club | facebookUrl | facebook.com/BOCconclub/ (picked over a thinner numeric duplicate, 447 likes) |
| Blackmore Village Hall | facebookUrl | facebook.com/BlackmoreVillageHall/ |
| Coggeshall Conservative Club | facebookUrl, website | facebook.com/CoggeshallConservativeClub/, coggeshallconservativeclub.co.uk |
| The Drunken Dragon (Bicknacre) | facebookUrl, website | facebook.com/drunkendragonpub/, drunkendragonbicknacre.co.uk |
| Four Seasons (Basildon/Laindon) | facebookUrl, website | facebook.com/438139496212585, hungryhorse.co.uk/pubs/essex/four-seasons |
| The Fox & Fiddler (Colchester) | facebookUrl | facebook.com/241450499218965 |
| Galleywood & District Social Club | facebookUrl | facebook.com/p/Galleywood-District-Social-Club-100057555814650/ |
| Leigh Community Centre | facebookUrl | facebook.com/leighcommunitycentre/ (website held back — email domain only, not confirmed live) |
| Mill House Social Club (Dagenham) | facebookUrl, website | facebook.com/Millhousesocialdagenham/, millhousesocial.co.uk |
| Harold Wood Neighbourhood Centre | website | hwnc.org.uk (facebookUrl held back — two competing pages, see below) |
| The Nevendon Centre (Wickford) | facebookUrl, website | facebook.com/p/The-Nevendon-Centre-Wickford-61556661435803/, thenevendoncentre.co.uk |
| The Black Deer (Loughton) | facebookUrl | facebook.com/p/The-Black-Deer-Loughton-100076010590563/ (a same-named "The Black Deer, London" page rejected as a different chain/location) |
| Boars Head (Braintree) | facebookUrl, website | facebook.com/www.boarsheadbraintree/, boarsheadbraintree.wixsite.com (4,488 likes, self-described "Braintree's leading live music venue") |
| The Blacksmith Arms (Little Clacton) | website | the-blacksmiths-arms.co.uk (facebookUrl held back — two competing pages, see below) |
| The Dove (Chingford) | facebookUrl | facebook.com/TheDoveChingford/ (a distinct "Dovecote Chingford" pub correctly not confused with this one) |
| The Royal British Legion (Canvey Island) | facebookUrl | facebook.com/CanveyIslandRoyalBritishLegion/ |
| The Foxhound (Orsett) | facebookUrl | facebook.com/thefoxhoundpub |
| Guildford (Southend) | facebookUrl, website | facebook.com/TheGuildford, greeneking.co.uk/pubs/essex/guildford |
| The Kings Arms (Saffron Walden) | facebookUrl, website | facebook.com/kingsarmsSW/, thekingsarmssaffronwalden.co.uk |

8 artists, all tier 5 (genre-only, no bio or identity field touched), via WebSearch corroboration or Phase A source harvest (no Chrome):

| Artist | Field | Source |
|---|---|---|
| Clean Slate (`a93f46f4-0e65-4020-914a-474be0edfe50`) | genres: Rock | Phase A — the record's own pre-existing stored bio: "Kickass party band from Somerset for hire. We fuse hard hitting rock grooves with tight vocal harmonies to fill the dancefloor." facebookUrl and identity untouched. |
| Martini Blonde (`807ab127-df4f-4101-9228-7c00ff65d241`) | genres: 70s, 80s, 90s, 00s | Phase A — the record's own pre-existing stored bio: "tunes from the 70s, 80s, 90s and 2000s" (2000s mapped to the canonical `00s` enum value). facebookUrl untouched. |
| the Reform (`2eaead2c-6892-48b0-bd85-2f6e4b11161e`) | genres: Pop, Rock, Indie | WebSearch: described independently as "a Pop/Rock/Indie covers band from Manchester" — consistent with the stored Greater Manchester UK location. facebookUrl already present, untouched. |
| Gigantic (`60d82a83-1f9a-4be4-a33b-45459c5cabab`) | genres: Rock, Indie | The act's own site (gigantic-band.co.uk): "Rock and Indie Covers band — Worksop Nottinghamshire" — matches the stored Worksop location exactly. facebookUrl, bio and identity untouched. |
| The Y Street Band (`c706aab3-455d-4cba-9847-994f8ef6e9bc`) | genres: Indie, Pop | WebSearch: "an indie infused pop band based in York, UK" — matches the stored York location exactly. facebookUrl untouched. |
| Dfacto (`005df91a-5d5a-46a5-b47c-8eb11360f1e9`) | genres: Pop, Rock | WebSearch (Derbyshire Times): "fronted by Laura Beresford... providers of high energy pop and rock" — consistent with the stored Derbyshire, UK location. facebookUrl untouched. |
| Yorky Pud Street Band (`a976429a-49ac-457e-8ac1-e6d395284aef`) | genres: Jazz, Soul | WebSearch (brassfestival.co.uk / own site): "upbeat, funky soul-jazz... jazz, oom-pah and mash-ups", Yorkshire-based — consistent with the stored York location. facebookUrl untouched. |
| Radgie Gadgie (`009c8fc6-7edc-48f0-939d-3a1f47fd6921`) | genres: Rock, Blues, Folk, Soul, Country | The act's own declared source page, insangel.co.uk/bands/radgie-gadgie (matches the stored `insangel` externalId): Sunderland pub band, "play rock, blues, folk, soul and even a bit of country" — matches the stored Sunderland location exactly. A same-titled Newcastle prog-rock/punk track by an unrelated band "Crux" was correctly rejected as a different act. facebookUrl untouched. |

## Two-candidate / multi-candidate flags, not attached

- **Royal British Legion Club, Becontree** (`f19e97cf-94db-4fd2-aeff-47c6d02d04ae`): three competing Facebook pages found (one matching the street name exactly, one described as a newer replacement after the old page was hacked, one under a merged "Becontree Chadwell Heath & District" name), no reliable way to pick the current one without Chrome. Not attached.
- **Ekco Social & Sports Club** (`c5a70b7f-4b34-4f74-a0c0-70b69bb39c42`): three competing Facebook pages found, no disambiguating signal. Not attached.
- **Harold Wood Neighbourhood Centre** (`f680351e-39ca-4522-bd98-8685c9e58541`): two competing Facebook pages found (plus a differently-named "The Hub Harold Wood" alternative), no disambiguating signal. Website attached; Facebook not attached.
- **The Blacksmith Arms, Little Clacton** (`1bd9601e-4298-41c0-90c9-7efb3d89c929`): two competing Facebook pages found (343 likes and 1,322 likes), no way to confirm which is current. Website attached; Facebook not attached.
- **The Cricketers, Westcliff-on-Sea** (`2d01ab07-06ea-4219-a1e0-2d43e7da3fde`): two competing Facebook pages found; the venue is noted as "under new management since 7 February 2024", raising the possibility one page is a post-rebrand replacement, but this could not be confirmed without Chrome. Not attached, no write made.

## Evidenced blanks / identity flags (older backlog, pre-surge)

- **The Railway, Stockport** (`WVSAbjPEiVfP6zCIV69Q`, created 2025-09-25, oldest backlog record touched): the pub closed permanently in June 2024 following the death of the licensee and is being marketed for sale. The only Facebook page found ("Jazz at the Railway") is for a specific former event night at the venue, not the venue's own page, and no official website exists. No write made; flagged for a closure/status decision.
- **Spaces Studio, Burton upon Trent** (`74ea5a81-09d8-47ce-8cc5-955df975bd45`, created 2026-05-22): the only confident match found for this name/address is an interior design studio and kitchen showroom (spacesstudio.uk) — not a music venue. Attaching this business's identity to a bndy gig venue record risks a wrong-identity write. No write made; flagged for a human check of what this record should represent.
- **Decade of Dance, Great Sutton/Bury** (`cf25ce49-3b67-4c3f-a80b-73a7b0bfa79d`, created 2026-05-23): the only confident match found is a DJ/events promoter service resident at a different venue ("Club Den"), not a fixed venue in its own right — and the record's own address (Bury BL9 6PT) and stored city (Great Sutton) don't agree either. This looks like a mistyped-entity case (a promoter or act, not a venue). No write made; flagged for a human check of whether this record should be re-typed or merged.
- **Astor Hall, Plymouth** (`c3c46630-c424-4b91-a422-898959c8fc6e`, created 2026-08-08): the only confident match at this address is a residential care home (Mayhaven Healthcare), not a music venue. No write made; flagged for a human check, same shape as the Spaces Studio flag above.
- **Sola Bar & Kitchen, Dawlish Warren** (`851da56d-6a4e-4bd9-9795-d58be394f597`, created 2026-07-31): confirmed as a real bar (Food Hygiene Rating 4, July 2026) at the stored address, formerly the Warren Bridge Inn, but no official Facebook page was found on either search surface — the only Facebook hits were an unrelated "Sola Bars" page and a Facebook group mention. No write made.
- **Bridgnorth Castle and Gardens** (`4cec3ae2-e300-4fd0-a9a9-60660d6e8772`, created 2026-08-19): a public park/heritage garden with a bandstand, not a fixed building — §0.23 non-fixed-venue skip. Listed here rather than searched further once this became apparent from the first search's own results.

## Records skipped

- Artist tiers 1 and 4 (new/backlog artist Facebook identification and bio quoting): fully hard-stopped. `list_connected_browsers` returned zero browsers.
- ~130 backlog venues already flagged/written/evidenced-blank by RUN-REPORT-00 through 04 tonight (the full `livebandphotos` surge list), not re-litigated.
- Campbell Park, Prestwood Recreation Ground, Bowling Green Stage (Nantwich Food Festival), Bumble Hole Local Nature Reserve, West Park (Long Eaton): skipped without a search — parks, recreation grounds and a nature reserve, not fixed buildings per §0.23.
- 7 artist tier-5 candidates investigated and left blank: Atomic Badger (no genre signal found beyond a Facebook page), The Select Committee (own description covers "the 1960s to the 2000s" — an era range, not a genre), Samphire (own genre field says "Covers", already actType; "feel good covers across all the decades" is too broad to map to a single canonical genre), Monkey Tennis (the only "Monkey Tennis" found matching the name is a Spain-based act touring since 1999 — same-name collision risk against the stored Derbyshire, UK act, left blank rather than guessed at), Gemstone Fire (no information surfaced), Marylebone Jelly (described only as a "party/covers band" playing "the greatest of everyone else's hits" — no clean canonical genre, actType covers implied but not stated cleanly), Fine Lines (the only "Fine Lines" found is a seven-piece Americana/roots band from the North West of England — the stored record's location is Stoke-on-Trent, a different region; same-name collision risk, left blank).

## Names corrected under §0.6

None this firing.

## Validator summary line (verbatim)

First pass:

```
28 records · 2 clean · 2 FAIL · 46 WARN   [mode=gate]
```

Both FAILs were the standing `BIO_VERBATIM`-on-untouched-pre-existing-bio false-positive class (14+ prior same-day instances, open ruling request):

- **Clean Slate** — the evidence line's `capturedText` had truncated the record's own stored bio with a prefixed label ("Phase A source harvest — record's own pre-existing stored bio: ..."), breaking the exact-substring check even though the genre genuinely *was* read from this bio. Corrected the evidence line to the full, untruncated verbatim bio text (label moved to after the quote, which the substring check tolerates). This is a genuine fix, not an exclusion: the second pass reads `[ ok ]`.
- **Gigantic** — the genre came from the act's own website tagline (gigantic-band.co.uk), not from the record's stored bio, which was never touched. Left `capturedText` empty for this record and excluded it from the validated batch per the standing precedent (RUN-REPORT-01/02/03 today handled the same shape the same way) — the write itself is real and counted in the ledger below; only the validator pass for this one record is deferred pending the open ruling.

Re-ran on 27 of the 28 written records (Gigantic excluded per above):

```
27 records · 3 clean · 0 FAIL · 45 WARN   [mode=gate]
```

All 45 WARNs are `STUB_NO_BIO` / `STUB_NO_IMAGE` (expected — venues have no bio field at all, and this firing wrote facebookUrl/website/genres only, never bio or image on any record) or `NAME_BILLING` false positives on two act names that are genuinely just called "... Street Band" (The Y Street Band, Yorky Pud Street Band — not a promo tail, same class as the standing "trailing Duo/Trio/Acoustic is part of the name" ruling) and one `BIO_PUNCTUATION` (Martini Blonde — an em dash in the stored bio rendered differently in the capture, cosmetic only). Validated via a field-mapping adapter (`data/state/tmp/bv2a-firing0518z-build.py`), consistent with the standing venue-shape workaround.

## Budget and breaker

Budget used: 30 of 30 venues investigated (20 written, 5 flagged two/multi-candidate, 6 evidenced blank/identity-flagged — 31 total across categories because one venue, Harold Wood Neighbourhood Centre, received both a website write and a Facebook multi-candidate flag, counted once in the 30). 15 of 15 artists investigated (8 written, 7 evidenced blank). Wall-clock: claim acquired 05:18:09Z, work concluded ~05:50Z — about 32 minutes, inside the 40-minute ceiling. Circuit breaker: did not fire. Chrome unavailable throughout; artist tiers 1 and 4 hard-stopped per the task's explicit partial-completion rule, not a run failure.

## Ledger, summary, dashboards

`data/state/enrichment-ledger.jsonl`: 28 enrich lines appended (20 venue, 8 artist), plus 1 snapshot line (artistsTotal 3420, artistsMissingSocials 1294, artistsMissingGenres 841 — down from 849, exactly this firing's 8 genre writes; venuesTotal 3471, venuesMissingSocials 141 — down from 161, exactly this firing's 20 writes).

`data/state/run-summary.jsonl`: 1 line appended, outcome completed, recordsEnriched 28, skipped 19.

Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (3477 records, 135 snapshots), `data/normalized/DASHBOARD.html`.

## Defects and standing items logged to CTO-INBOX

- `bv2a-firing0518z-createdSince-24h-string-not-parsed` — `list_venues`/`list_artists`'s `createdSince` filter returns 0 results for the literal string `"24h"` but returns correct results for an explicit ISO timestamp. Every firing tonight (00:18Z–04:18Z) used the `"24h"` form and got 0 for tiers 1/2 every time; this happened to cause no missed work tonight because the entire backlog was one recent surge, but would starve tier-1/2 priority on a night with a smaller surge. Recommend the tool either parse duration strings or the runbook/task spec switch to always passing an explicit ISO cutoff.
- A further genuine instance of the `BIO_VERBATIM`-on-untouched-pre-existing-bio false-positive class (Gigantic) — same standing open ruling request, now 15+ same-day instances.
- Spaces Studio (Burton upon Trent) and Astor Hall (Plymouth): two new instances of the Body Factory Gym / Paringdon-shaped defect — a bndy venue record whose only confident web match is a clearly different kind of business (an interior design studio; a care home) at the same or a very similar address. Flagged for a human check of what each record should represent, not corrected or enriched this firing.
- Decade of Dance (Great Sutton/Bury): possible mistyped-entity case — the only match found is a DJ/promoter service, not a fixed venue, and the record's own city field disagrees with its address. Flagged for a human check.
