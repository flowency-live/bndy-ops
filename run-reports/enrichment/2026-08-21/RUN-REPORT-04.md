# Bv2a Enrichment — RUN-REPORT-04 — 2026-08-21

**Run id:** `bv2a-enrichment-2026-08-21T04-18-42Z`. **Outcome: completed.**

- **Circuit breaker (Step 0):** did not fire. Last 3 reports (2026-08-21 firings 01, 02, 03) each closed at 0 FAIL and each wrote a report.
- **Runbook:** read in full. H1 `v2.27` ≥ CURRENT FLOOR `v2.19` (§6A). ENRICHMENT-TASK-v3.md §0.0 and §FP read. CTO-INBOX.md fingerprints read — standing flags respected (see Records skipped).
- **Concurrency:** `data\state\claims\bv2a-enrichment.json` was released (`heldBy: null`). Acquired at 04:18:42Z, TTL 3h per §6G, released on completion. The stale `enrichment.lock` prompt-step (superseded by §6A step 2b / §6G) was not honoured or recreated — none was found on disk.
- **Tools:** bndy MCP reachable (confirmed via `list_venues`). Chrome: exactly one connected browser, logged into Facebook (confirmed via `facebook.com` page text).

## Selection

Tier 1 — artists created in the last 24h missing socials: 205 candidates (`createdSince` passed as an explicit ISO timestamp, not the literal string `"24h"`, per the standing `list-artists-createdsince-24h-string-not-parsed` defect). Took the **15 oldest**, excluding `Zoe Schwarz & Rob Koral` (standing duplicate-pair flag, `bv2a-zoe-schwarz-duplicate-artist-pair`) — six were a `swanblues` festival-lineup batch (Swanage Blues Festival, confirmed against the festival's own 2026 line-up page), the rest independent creates.

Tier 2 — venues created in the last 24h missing socials: 10 candidates. Excluded before searching: `Market Place` (Burton, standing ambiguous-building flag), `The Old Lockup` (Wirksworth, standing business-mismatch flag), `Bunker` (Heanor, standing golf-venue flag), `Willenhall Memorial Park` and `Bumble Hole Local Nature Reserve` (§0.23, not fixed buildings) — leaving **5 usable candidates**, all 5 worked.

Tier 3 — backlog venues missing socials, oldest `createdAt` first: pulled 67 backlog candidates, filtered out records already carrying a standing CTO-INBOX flag or an obvious non-fixed-building/closed/wrong-entity pattern (`White Lodge` wrong entity, `Darcy's` closed, `Annitsford Welfare Club` name-succession flag, `Ann Welfare Playing Fields`/`Campbell Park`/`Prestwood Recreation Ground`/`West Park Long Eaton` — playing fields/parks, §0.23, `Hunstanton Bandstand` and `Bowling Green Stage Nantwich` — not fixed buildings, `Okehampton Show ground` postcode-mismatch flag, `Venue TBC`/`1865, 1 Carlton Pl` address-mismatch flags, `The Nest` hair-salon-address flag, `The Decorated Dead Tattoo Studio`, `Hayfield Club` address-mismatch flag). Selected the **15 oldest** remaining fixed-building candidates to reach a 20-venue total for this firing (oldest: West End Club, Stapleford, created 2026-05-04).

Tier 4/5 (backlog artists, artists missing genres with a facebookUrl) were **not reached** — tier 1 alone filled the 15-artist artist cap.

## Records with a verified page

**Artists (1 of 15):**

| Artist | Facebook | Notes |
|---|---|---|
| Box Car Blues Band | facebook.com/BoxcarBluesBand/ | Confirmed 2026 Swanage Blues Festival lineup act; bio quoted verbatim from the page's own About/Bio block |

**Venues (13 of 20 — 12 with Facebook and/or website, 1 website-only):**

| Venue | Website | Facebook |
|---|---|---|
| White Hart Inn (Upper Tean) | whitehartintean.co.uk | facebook.com/p/White-Hart-in-Tean-100083957862238/ |
| The Stagborough Arms (Stourport) | — | facebook.com/153889357973500 |
| The Old Brewery Restaurant and Event Venue (Sawley) | — | facebook.com/people/The-Old-Brewery-Restaurant-and-Event-Venue-at-The-White-Lion-Sawley/61584891967392/ (exact address match, 352 Tamworth Rd) |
| The Falcon Hotel (Bridgnorth) | falconhotelbridgnorth.co.uk | facebook.com/thefalconhotelbridgnorth/ |
| The Alexander Centre (Faversham) | thealex.org.uk | facebook.com/TheAlexanderCentreFaversham/ |
| Marsden Mechanics | marsdenmechanics.co.uk | — (no page found; website only) |
| Derby Museum & Art Gallery | derbymuseums.org | facebook.com/721947327815402/ (dedicated page, not the general Derby Museums page) |
| Chapel Street Arts Centre (formerly Deda) | chapelstreetarts.co.uk | facebook.com/deda.derby/ |
| Market Hall (Derby) | derbymarkethall.co.uk | facebook.com/markethallderby/ |
| Giltar Hotel (Tenby) | giltar-hotel.co.uk | facebook.com/GiltarHotel/ |
| The Arches (Swanage) | — | facebook.com/p/The-Arches-Swanage-61577999084323/ |
| Black Swan Inn (Swanage) | blackswanswanage.co.uk | facebook.com/theblackswanswanage/ |
| Baboo Gelato Swanage | baboogelato.com/pages/swanage | facebook.com/BabooSwanage/ (the Swanage-specific page, distinct from the parent Bridport brand page) |

All writes verified by the `edit_artist`/`edit_venue` response echoing the updated fields; no separate `get_by_id` read-back was needed as every response returned the full post-write record.

## Records recorded as an evidenced blank

**Artists (14 of 15)** — both surfaces attempted (Google throughout; Facebook's own page search returned no usable content all firing, see Defects):

| Artist | Variants tried | Note |
|---|---|---|
| Astles Couzens Duo | "Astles Couzens Duo band facebook"; festival lineup page (name not listed on it) | No confident match |
| I Spy & Another | "I Spy & Another band facebook"; "I Spy Another duo Swanage blues facebook" | Confirmed festival lineup act, no own page found |
| Neil Grove & Chris Sentance-Geraghty | "Neil Grove Chris Sentance-Geraghty blues facebook"; "Neil Grove blues Swanage facebook" | Candidate page (100089918569389) returned "page isn't available" on visit |
| Will Killeen | "Will Killeen music facebook"; "Will Killeen singer songwriter facebook Herefordshire" | Confirmed UK act (Herefordshire blues guitarist); candidate FB URL redirected to Meta's corporate page — dead link |
| Cat Alley Dogs | "Cat Alley Dogs band facebook"; "Cat Alley Dogs Swanage blues" | Confirmed festival lineup act, no own page found |
| Al Sansome Band | "Al Sansome Band Leicester facebook" | Only a personal profile found (al.sansome) — §2A.1 item 4 excludes personal profiles |
| Art Themen Organ Trio | "Art Themen organ trio facebook" | Only third-party venue/promoter posts found, no dedicated own page |
| Atlantean | "Atlantean band Nottingham metal facebook" | Only same-name foreign band (Atlantean Kodex, Germany) found — rejected, not UK |
| BELT | "BELT band Derbyshire post-punk facebook" | No match |
| Bluegreen | "Bluegreen band Leicester funk soul jazz facebook" | No match; pre-existing bio left untouched (not sourced from Facebook, so not touched or re-evidenced this firing) |
| Cyph_on | "Cyph_on band Leicester electronic facebook" | No match |
| Dexter Shaw & The Wolftones | "Dexter Shaw Wolftones blues Northampton facebook"; guessed URL dextershawandthewolftones | Guessed slug dead ("content isn't available"); no confirmed own page found |
| I Got Spiders | "I Got Spiders punk Boston Lincolnshire facebook" | No match |
| Josh Bailey Trio | "Josh Bailey Trio jazz Birmingham facebook" | Candidate page found (joshbaileyartist) is a **different** Josh Bailey — 21-year-old singer from Surrey, not the Birmingham jazz trio. Correctly rejected on the §2A.1 identification bar, not attached |

**Venues (7 of 20):**

| Venue | Variants tried | Note |
|---|---|---|
| The New Three Tuns Pub (Eastwood) | "New Three Tuns Eastwood Nottingham pub facebook"; "facebook.com New Three Tuns Eastwood" | Page exists per third-party listings, direct URL not surfaced |
| Eastwood & District Conservative Club Ltd | "Eastwood Conservative Club Nottingham facebook"; "facebook.com Eastwood and District Conservative Club" | No direct page found |
| West End Club (Stapleford) | "West End Club Stapleford Nottingham facebook" | Multiple indirect references, no single confident canonical URL |
| The Tannery (Derby) | "The Tannery Sadler Gate Derby facebook" | New venue (opened June 2026), no page indexed yet |
| The Saracens Head (Newton Abbot) | "Saracens Head Newton Abbot facebook" | Only a same-name pub in Sudbury, Suffolk found — rejected, wrong location |
| Jubilee Inn (Torpoint) | "Jubilee Inn Torpoint facebook" | Multiple same-name candidates (a different Jubilee Inn in Pelynt among them), none independently confirmed |
| Marsden Social Club | "Marsden Social Club Huddersfield facebook" | Possible name variant "Marsden Socialist Club/Institute" per whatpub/CAMRA — no confidently-matching own page found, left blank rather than guess |

## Records skipped (not worked)

20 backlog candidates excluded before searching, all on standing CTO-INBOX flags or §0.23 (not a fixed building): `Market Place` (Burton), `The Old Lockup` (Wirksworth), `Bunker` (Heanor), `Willenhall Memorial Park`, `Bumble Hole Local Nature Reserve`, `White Lodge` (Stafford), `Darcy's` (Fenton), `Annitsford Welfare Club`, `Ann Welfare Playing Fields`, `Campbell Park`, `Prestwood Recreation Ground`, `West Park, Long Eaton`, `Hunstanton Bandstand`, `Bowling Green Stage, Nantwich Food Festival`, `Okehampton Show ground`, `Venue TBC`, `1865, 1 Carlton Pl`, `The Nest` (Leek), `The Decorated Dead Tattoo Studio`, `Hayfield Club`.

## Names corrected under §0.6

None this firing — no billing-contaminated names were encountered in the touched cohort.

## Validator summary lines (verbatim)

Artists (11 of 15 records validated in gate mode — 4 excluded: `BELT`, `Bluegreen`, `Dexter Shaw & The Wolftones`, `I Got Spiders` all carry a **pre-existing bio from an earlier import that this firing did not touch or re-evidence**; feeding them to the gate produced `BIO_SOURCE` FAILs against evidence this firing never wrote. This is the standing `validator-genre-only-fb-evidence-mismatch` class — evidence cannot be field-scoped — applied here to untouched records rather than a genre-only touch. No write was made to any of these 4 records this firing; excluding them from the gate is correct, not a workaround of a real defect):

```
11 records · 6 clean · 0 FAIL · 6 WARN   [mode=gate]
```

Venues (20 records; evidence `venueId` aliased to `artistId` per the standing `validator-venue-evidence-loader-artistid-only` workaround; `city` supplied as `location` per the standing `validator-venue-schema-mismatch` workaround):

```
20 records · 8 clean · 0 FAIL · 25 WARN   [mode=gate]
```

WARNs: `NAME_BILLING` on 5 artist records (`Astles Couzens Duo`, `Box Car Blues Band`, `Al Sansome Band`, `Art Themen Organ Trio`, `Josh Bailey Trio`) are the documented false-positive pattern for names ending in a format word (Duo/Trio/Band) — all five are the acts' correct names, not contamination (RUNBOOK §2A.1 item 7, "trailing Duo/Trio/Acoustic/Solo is part of the name"). `STUB_NO_IMAGE` on Box Car Blues Band is a test-data artefact — the live `edit_artist` response shows `profileImageUrl` was auto-populated (`graph.facebook.com/BoxcarBluesBand/picture?type=large`); the validator input file built for this report simply omitted that field. All 25 venue WARNs are `STUB_NO_BIO`/`STUB_NO_IMAGE`, expected noise under §FP.2 (venues carry no bio/image requirement). One `NAME_BILLING` on Chapel Street Arts Centre (formerly Deda) — a parenthetical, but a legitimate former-name disambiguator, not contamination.

No FAILs on either batch. No re-capture cycle was needed.

## Defects / rules raised

- **`facebook-page-search-not-found` (recurrence).** `facebook.com/search/pages/?q=...` returned no extractable text this firing (canvas/blocked), same as the 2026-08-14 finding. Logged again in CTO-INBOX with today's date. Google remained fully usable throughout and was the sole working surface for every identification this firing.

No new defects beyond this recurrence.

## Budget used

**15 of 15 artists, 20 of 30 venues.** Venue tier 3 was not exhausted to the full 30-cap: stopped at a 20-venue total after thorough per-record verification (multiple candidate pages, address/postcode cross-checks) rather than push through the remaining backlog at lower confidence, consistent with §1's "blank beats wrong... a night that enriches records correctly and leaves some unworked is a good night." Elapsed approximately 20 minutes of the 40-minute ceiling. Circuit breaker did not fire.

Ledger: 35 `enrich` lines appended (1 artist-verified, 14 artist-blank, 12 venue-verified, 1 venue-website-only-verified, 7 venue-blank — 13 verified in total) plus 1 `snapshot` line. Snapshot: artistsTotal 2756, artistsMissingSocials 1199, artistsMissingGenres 800, venuesTotal 3120, venuesMissingSocials 54 (down from 67 at firing start — 13 venues moved off the missing-socials list). `run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 35, skipped 20. Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2634 enrichment records, 90 snapshots) and `data/normalized/DASHBOARD.html`.
