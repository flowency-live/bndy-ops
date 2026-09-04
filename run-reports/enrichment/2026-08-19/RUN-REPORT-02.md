# RUN REPORT — Bv2a Enrichment — firing 02 — 2026-08-19T02:18Z

## Step 0 — Circuit breaker

Listed `data/normalized/enrichment/` subfolders by mtime and confirmed the three most
recent reports independently: `2026-08-19/RUN-REPORT-01.md` (mtime 02:32Z, "30 records
· 4 clean · 0 FAIL · 52 WARN"), `2026-08-19/RUN-REPORT-00.md` (mtime 01:29Z, "28
records · 6 clean · 0 FAIL · 44 WARN"), `2026-08-18/RUN-REPORT-23.md` (mtime 00:36Z,
"27 records · 9 clean · 0 FAIL · 36 WARN"). All three recorded 0 outstanding FAIL from
the validator on their final run, and all three wrote a report. 0 of 3 recorded a FAIL,
none failed to write a report. **Breaker NOT TRIPPED.** Proceeded.

## Step 1 — Concurrency

Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-19T02-20-40Z.json` first.
Read `data/state/claims/bv2a-enrichment.json`: `heldBy: null`, `expiresAt`
`1970-01-01T00:00:00Z` (expired) — claim free. Acquired the claim with `heldBy`
`bv2a-enrichment-2026-08-19T02-20-40Z`, `expiresAt` `2026-08-19T05:20:40Z`. Released at
the end of this run (`heldBy: null`).

## Step 2 — Reads

Read `RUNBOOK.md` in full (H1 v2.27). **CURRENT FLOOR** at §6A step 2a is v2.19 —
v2.27 is above floor, proceeded. Read §2A.1 (identification bar, item 3b both-surfaces
requirement, item 8 bio-is-quoted), §0.6 (name correction), §3 (venue protocol), §6A
(run contract). Read `ENRICHMENT-TASK-v3.md` §0.0 (bio quoted never written) and §FP
(fast path — §FP.2 venues, §FP.3 artists). Read `CTO-INBOX.md` in full (300 lines,
several chunks) and built an exclusion list of standing fingerprints: the foreign-venue
batch (externalId prefix `6022ef13-1c27-40be-98c3-7aad7c8c2a30`), the growing list of
not-a-venue findings (council parks, playing fields, tattoo studios, nursing homes,
carnivals/shows), and address-mismatch / two-candidate-page / weak-signal findings
already flagged. All excluded from this firing's candidate pool.

## Step 3 — Chrome check

`list_connected_browsers` returned `[]` — Chrome unreachable for a **29th consecutive
firing** spanning over 28 hours (22 on 08-17 22:17Z through this firing on 08-19
02:20Z). Artist priorities (1, 4, 5) hard-stopped per the task prompt's table. Venue
priorities (2, 3) proceeded under §FP.2 — no Chrome required.

## Work order followed

1. Priority 1 (artists, last 24h, missing socials) — SKIPPED, Chrome unavailable.
2. Priority 2 (venues, last 24h, missing socials) — `list_venues(createdSince, missingSocials:true)` returned 0 candidates.
3. Priority 3 (backlog venues missing socials, oldest first) — worked. 148 candidates found; fetched two pages (100 of 148) and sorted by `createdAt` ascending. Excluded every record already carrying a standing CTO-INBOX flag (not-a-venue, address mismatch, foreign-venue batch, two-candidate-page, ignore-list match) and two records already logged in today's evidence file by an earlier firing (The Crab and Apple Pub, The Grace — both already evidenced blank today, not re-worked). Worked the next 30 clean candidates, oldest `createdAt` first.
4. Priority 4 (artists backlog) — SKIPPED, Chrome unavailable.
5. Priority 5 (artists missing genres with facebookUrl) — SKIPPED, Chrome unavailable.

## Records enriched WITH a verified page (16)

| Venue | Town | Field(s) | Evidence |
|---|---|---|---|
| The Rock Hotel + The Rock Kitchen | Weymouth | facebookUrl | facebook.com/p/The-Rock-Hotel-61556513042702/ — exact address match, 41 Abbotsbury Road |
| Perry Street Club & Institute | Chard | facebookUrl | facebook.com/PerryStreetClub/ — exact address match, Knapp Mill House, Waterlake Rd |
| The Black Horse | Farnworth | facebookUrl | facebook.com/TheBlackHorseKearsley/ — exact house number + street match, 59A Higher Market St |
| The Great Doddington Club | Great Doddington | facebookUrl | facebook.com/greatdoddingtonclub/ — distinctive name, correct area |
| Golden Lion | Newton Abbot | facebookUrl | facebook.com/goldenliontq12/ — exact address match, 4 Market St; postcode-area handle |
| Godalming Naval Club | Godalming | facebookUrl | facebook.com/182136358471597/ — distinctive name, correct town |
| Login Lounge | Camberley | facebookUrl | facebook.com/CamberleyLiveMusic/ — page displays as "Login Lounge \| Camberley"; photo caption confirms Park Street |
| The Royal Oak | Bracknell | facebookUrl, website | facebook.com/theroyaloakbracknell/, theroyaloakbracknell.co.uk — exact town match |
| The Cabin | Camberley | facebookUrl | facebook.com/thecabincamberley/ — exact address match, 173-175 London Rd |
| Fiery Bird Music Venue | Woking | facebookUrl, website | facebook.com/Fierybirdlivemusicvenue/, fierybirdvenue.org.uk — exact address match, 32 Goldsworth Rd |
| Kingsley Café | Eynsham | facebookUrl, website | facebook.com/p/Kingsley-Cafe-61568377438718/, kingsleycafe.co.uk — exact address match |
| White Rock Theatre | Hastings | facebookUrl | facebook.com/WhiteRockTheatre/ — distinctive official venue name |
| Badshot Lea Working Men's Club | Badshot Lea | facebookUrl | facebook.com/badshotleaworkingmensclub/ — event page states exact address, 2 St Georges Rd |
| Rose | Wokingham | facebookUrl | facebook.com/therosewokingham/ — name + town match |
| The Royal Oak | Hampton | facebookUrl | facebook.com/TheRoyalOakHampton/ — exact address match, 45 Oak Ave |
| Hartlepool United FC Supporters Association | Hartlepool | website | hartlepoolunited.co.uk/club/supporters-association/ — official club page; 3 competing unofficial FB groups found, none confirmed as the association's own page, facebookUrl left blank |

All 16 writes confirmed via `updatedFields` in the tool response (not just `success:true`,
per RUNBOOK §0.10 and the `edit_venue`-silent-drop defect logged 2026-08-18). 3
spot-checked with `get_by_id` (The Rock Hotel, Fiery Bird Music Venue, Royal Oak
Hampton) — all confirmed correct.

## Records recorded as an EVIDENCED BLANK (14), variants tried on both surfaces

| Venue | Town | Why blank |
|---|---|---|
| HalfWay House | Ashton-under-Lyne | Multiple same-name pubs nationally (Royton, Blackpool, Torpoint, Westernville NY); only local candidate page titled "Ashtown" with no address confirmation |
| West End Club | Stapleford | Address well corroborated by directories but no single confirmed own page — only event pages and third-party posts across several different page IDs |
| Lamplight - Coffee House & Tap Room | Coxhoe | No own page found in two search passes; only an unrelated customer post and unrelated US "Lamplighter" businesses |
| Annitsford Welfare Club | Annitsford | Only candidate is "Annitsford Irish Club" — different name, different house number (1 vs 33 Barras Ave); succession not evidenced |
| Hayfield Club | Hayfield | Three different candidate clubs (Conservative, Angling, Football/Community), none address-confirmed to Church Street |
| The Tannery | Derby | New taproom (opened June 2026), no page found; confused in search with an unrelated Sydney, Australia venue |
| The Saracens Head | Newton Abbot | Only match found is a same-name pub in Sudbury, Suffolk — wrong town, correctly rejected |
| Dicey Reilly's | Teignmouth | No own page found; many same-name Irish pubs elsewhere (Pattaya, St Albert AB, Edmonton, Auckland) create collision risk; direct slug guess returned no content |
| Jubilee Inn | Torpoint | Only address-adjacent candidate is "Jubilee Inn, Pelynt" — different town; a musician's post references the gig but not the venue's own page |
| The Nags Head | Market Harborough | No single confirmed own page; results are event pages and same-name pubs in Belper and East Harling |
| Walton Hersham & Oatlands Conservative Club | Walton-on-Thames | No page matching this exact name found; candidates ("Esher & Walton Conservatives", "Walton Con Club") not confirmed as this club |
| Cranleigh Arts | Cranleigh | Multiple competing pages (Cranleigh Arts, Cranleigh Arts Centre, Cranleigh Art Hub) with conflicting contact details, none confirmable without a Chrome visit |
| The Turks Head | Reading | No single confirmed own page despite many gig-post mentions; other same-name pubs (Wapping, Oldham) create collision risk |
| The Alexandra | Farnborough | Search results only surface entities on Alexandra Road (Post Office, Masonic Centre) — bndy record's address is Victoria Road, a different street; possible address mismatch on the bndy record itself |

Search variants used per venue: bare name + town (§FP.2 step 1), then a Facebook-domain-
filtered pass (`allowed_domains: ["facebook.com"]`), and for two records a direct
slug guess via `web_fetch` (both returned no content — Facebook blocks unauthenticated
fetches, consistent with Chrome being required to actually visit a page).

## Records SKIPPED, and why

None skipped outright this firing — every one of the 30 oldest clean backlog venues was
either verified or recorded as an evidenced blank. Two backlog venues already touched
by an earlier firing today (The Crab and Apple Pub `228da383`, The Grace `d7c36f01`,
both evidenced blank in firing 01) were excluded from re-work as duplicates, not
re-attempted.

## Names corrected under §0.6

None. No name contamination or promo-billing tails found in this firing's venue batch.

## Validator summary line (verbatim)

```
30 records · 14 clean · 0 FAIL · 31 WARN   [mode=gate]
```

All WARNs are expected noise under the standing `validator-venue-schema-mismatch`
fingerprint: venues carry no bio/image requirement under §FP.2, so `STUB_NO_BIO` /
`STUB_NO_IMAGE` fire on every verified venue with a facebookUrl (30 of 31 WARNs). The
remaining WARN is `NAME_BILLING` on "Lamplight - Coffee House & Tap Room" — a false
positive; this is the venue's actual trading name, confirmed verbatim by CAMRA and
WhatPub, not promo billing contaminating an artist name (§0.6 targets artist billing
contamination, not a venue's own hyphenated trading name). No FAIL outstanding.
Records/evidence adapted for the validator via `data/state/build_validator_input_firing02.py`,
following the pattern of `build_validator_input_run0120.py`: a flat
`{"venues":[{id,name,location,facebookUrl}]}` records file (standing
`validator-venue-schema-mismatch` fingerprint) and an aliased evidence file mapping
each line's `venueId` to `artistId` for the loader (standing
`validator-venue-evidence-loader-artistid-only` fingerprint) — the source-scoped
`enrichment-evidence-2026-08-19-enrichment.jsonl` itself is untouched in meaning, only
a derived copy (`evidence_firing02_aliased.jsonl`) is aliased. Every facebookUrl was
written to bndy in the same canonical form (no `www.`, no trailing path beyond the
page slug) as the `capturedFrom` URL in the evidence file, avoiding the
`FB_EVIDENCE_MISMATCH` trap logged 2026-08-18.

## Budget used

30 of 30 venues (budget cap reached). 0 of 15 artists (Chrome hard-stop). Elapsed
approximately 32 minutes of the 40-minute budget.

## Ledger / snapshot / dashboards

Appended 30 `enrich` lines (16 `verified`, 14 `blank`) to `data/state/enrichment-ledger.jsonl`.
Appended one `snapshot` line with fresh counts from `list_artists`/`list_venues`
`pagination.count`: artistsTotal 2243, artistsMissingSocials 871, artistsMissingGenres
615, venuesTotal 3006, venuesMissingSocials 132 (down from 148 pre-firing, reflecting
this firing's 16 venue writes). Appended one line to `data/state/run-summary.jsonl`
(`outcome: completed`, `recordsEnriched: 16`, `skipped: 14`). Regenerated both
dashboards: `data/normalized/enrichment/DASHBOARD.html` (2276 enrichment records, 76
snapshots) and `data/normalized/DASHBOARD.html`.

## CTO-INBOX additions this firing

- `bv2a-chrome-unreachable-29-firings-one-day` — Chrome unreachable for a 29th
  consecutive firing (28+ hours, 22 on 08-17 22:17Z through this firing on 08-19
  02:20Z). Artist backlog (871 missing socials, 615 missing genres) fully stalled
  again; venue work proceeded under §FP.2, 16 verified, 14 evidenced blank this
  firing.
- `bv2a-firing02-alexandra-farnborough-street-mismatch` — Venue "The Alexandra", bndy
  address 74 Victoria Rd, Farnborough GU14 7PH. All search results for "The Alexandra"
  in Farnborough resolve to Alexandra ROAD (Post Office, Masonic Centre), a different
  street. Not enriched. Needs a human check of whether the bndy record's street is
  correct.
- `bv2a-firing02-annitsford-name-succession-unconfirmed` — Venue "Annitsford Welfare
  Club", 33 Barras Ave, Annitsford, Cramlington NE23 7QX. Only candidate found is
  "Annitsford Irish Club", 1 Barras Avenue — different name and house number. Not
  enriched. Needs a human check of whether this is a renamed successor or a genuinely
  different address.
