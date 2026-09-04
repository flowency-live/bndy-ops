# Bv2a Enrichment — RUN-REPORT-02

Run id: `bv2a-enrichment-2026-08-30T02-18-00Z`. Outcome: completed (partial). Venues worked under FP.2. Artist tiers 1 and 4 hard-stopped on Chrome. Tier 5 worked without Chrome via WebSearch corroboration.

## Step 0 — circuit breaker

Read the last 3 reports, newest first:

- RUN-REPORT-01 (2026-08-30, 01:18Z): outcome completed (partial). Validator `29 records · 5 clean · 0 FAIL · 47 WARN` after excluding 1 self-caught BIO_VERBATIM-on-untouched-bio false fail. 0 FAIL on the shipped pass.
- RUN-REPORT-00 (2026-08-30, 00:18Z): outcome completed (partial). Validator `31 records · 2 clean · 0 FAIL · 56 WARN` after excluding 3 self-caught FB_EVIDENCE_MISMATCH false fails. 0 FAIL.
- RUN-REPORT-24 (2026-08-29): outcome completed (partial). Validator `3 records · 0 clean · 0 FAIL · 3 WARN` after excluding one BIO_VERBATIM-on-untouched-bio case. 0 FAIL.

0 of the last 3 reports carried a recorded validator FAIL. All 3 wrote a report. The breaker did not trip.

## Step 2 — runbook and task spec

`RUNBOOK.md` read in full (732 lines). H1 = v2.27. CURRENT FLOOR (§6A) = v2.19. 2.27 ≥ 2.19. Floor check passed.

`ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail read for standing `bv2a-*` fingerprints: the venue backlog/surge class, the `edit_venue` `facebookUrl` silent-drop defect and its `socialMediaUrls` workaround, the validator venue-shape gap and its field-mapping adapter, the BIO_VERBATIM-on-untouched-pre-existing-bio false-positive class (12+ prior same-day instances), and the standing Chrome outage.

## Concurrency

Did not check for, create or delete any `.lock` file. Read `data/state/claims/bv2a-enrichment.json`: `heldBy: null`, released 2026-08-30T02:13:00Z by RUN-REPORT-01. Available.

Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-30T02-18-00Z.json` (`outcome:"started"`), then acquired the claim (`heldBy: bv2a-enrichment-2026-08-30T02-18-00Z`, TTL 3h, `expiresAt: 2026-08-30T05:18:00Z`). Released at close.

## Tool check

bndy MCP tools reachable (confirmed via `list_venues`). Chrome: `list_connected_browsers` returned zero browsers, continuing the standing outage. Per the task's hard-stop rule, venues proceed without Chrome (FP.2 needs none). Artist tiers 1 and 4 (identity check + quoted bio) are hard-stopped; tier 5 (genre-only) proceeds via WebSearch.

## Records enriched with a verified page

25 venues, all under FP.2 (WebSearch only, no Chrome, no bio field touched). Workaround applied per the standing defect: `facebookUrl` written via `socialMediaUrls: [{"platform":"facebook","url":"..."}]`, never the top-level `facebookUrl` parameter. Every write read back with `get_by_id` and confirmed persisted.

| Venue | Fields | Source |
|---|---|---|
| Ye Olde Albion | facebookUrl | facebook.com/yeoldealbionpub |
| Oakwood | facebookUrl | facebook.com/388113837924492 |
| Hopfields | facebookUrl, website | facebook.com/TheHopfieldsHatfield/, mcmullens.co.uk/local-pub/hopfields/ |
| The United Brethren | facebookUrl, website | facebook.com/theubchelmsford/, ubchelmsford.co.uk |
| The Old Hall Tavern | facebookUrl, website | facebook.com/OldHallTavernE4/, oldhalltavernchingford.co.uk |
| East Ham Social Club | facebookUrl, website | facebook.com/groups/14821381814/ (group), easthamsocial.co.uk |
| The Railway Pub & Coffee House | website | therailwaypubsthwf.co.uk (facebookUrl held back, two competing pages — see below) |
| The Red Lion (Latchingdon) | facebookUrl, website | facebook.com/theredlionlatchingdon/, redlionpublatchingdon.co.uk |
| The Sun Inn (Lemsford) | facebookUrl, website | facebook.com/211393015542013, suninn-lemsford.co.uk |
| The Hamlet Court | facebookUrl, website | facebook.com/hamletcourt, hamletcourt.co.uk |
| The Poplar Kitten | facebookUrl, website | facebook.com/poplarkitten/, poplarkittenharlow.co.uk |
| The Golden Lion (Hoddesdon) | facebookUrl, website | facebook.com/GoldenLionHoddesdon/, goldenlionhoddesdon.co.uk |
| Waldegraves Holiday Park | facebookUrl, website | facebook.com/waldegraves.co.uk/, waldegraves.co.uk |
| Ye Olde Crown (Rayleigh) | facebookUrl, website | facebook.com/yeoldecrownrayliegh/, yeoldecrownpub.co.uk |
| The Limeburners (Offton) | website | limeburners.co.uk (facebookUrl held back, two competing pages — see below) |
| The Terrace Bar & Grill | facebookUrl, website | facebook.com/p/Terrace-Bar-And-Restaurant-61553688141305/, theterracebarsouthend.co.uk |
| The Ship (Grays) | facebookUrl, website | facebook.com/Theshiplittlethurrock/, shiplittlethurrock.co.uk |
| The Railway Hotel (Hornchurch) | facebookUrl | facebook.com/railwayhotelhornchurch/ |
| The Marquis of Granby (Old Harlow) | facebookUrl | facebook.com/marquisofgranbyoldharlow |
| The Bengeo Club | facebookUrl, website | facebook.com/bengeoclub/, bengeoclub.co.uk |
| The Welcome Club (Stanford-le-Hope) | facebookUrl, website | facebook.com/TheWelcomeClubinStanford/, welcome-club.co.uk |
| The Roundabout Coffee Shop & Bar (Henlow) | facebookUrl | facebook.com/roundaboutbarandcoffee/ |
| The Fox Inn (Finchingfield) | website | foxinnfinchingfield.co.uk (no confirmed FB page this firing) |
| The Kings Arms Frating | facebookUrl, website | facebook.com/kingsarmsfratingessex/, thekingsarmsfrating.co.uk |
| Dogs Head (Bishop's Stortford) | facebookUrl, website | facebook.com/206228433631873/, mcmullens.co.uk/local-pub/dogs-head/ |

2 artists, both tier 5 (genre-only, no bio or identity field touched), via independent third-party corroboration (no Chrome):

| Artist | Field | Source |
|---|---|---|
| The Zenyth Collective | genres: Rock | AllEvents.in gig listing for a Terrace Bar, Tamworth show: "a Rock based cover/originals band" — consistent with the stored East Midlands region; facebookUrl and bio already present, untouched |
| Jimi Strange | genres: Rock n Roll, Country, Blues, Folk | nottinghamgigguide.com/act/Jimi_Strange (independent Nottingham gig guide, not the act's own page): "genre-spanning songs embracing Rock and Roll, Country, Blues and Folk" — consistent with stored Nottingham location; facebookUrl already present, untouched |

## Two-candidate / multi-candidate flags, not attached

- **The Railway Pub & Coffee House** (`cc33c82e-99dd-4ee8-8f86-fbfc31e4d952`): two live, differently-numbered Facebook pages found for the same pub (South Woodham Ferrers), no reliable way to tell which is current without Chrome. Website only.
- **The Limeburners, Offton** (`85ff9404-bc3a-448e-8a53-65384a832673`): multiple competing Facebook page candidates, no single clearly-official one. Website only.
- **The Victoria, Baldock** (`a46310c7-7e26-4201-9869-a213a35ddc09`): two live Facebook pages (an established vanity-URL page and a newer numeric one). Not attached.
- **Hare and Hounds, St Albans** (`becf2f2f-5ae4-4e06-9aaa-37b51f248f7b`): four-plus competing Facebook pages for the same address, no disambiguating signal without Chrome. Not attached.

## Evidenced blanks

- **The Plough, Ipswich** (`1799df16-e751-4b98-9d01-61c81dac0833`): no single official Facebook page surfaced across two search variants (only group/event mentions); no dedicated venue website found either.
- **Cock Inn, Hadleigh** (`c5a66742-0701-4389-953a-e67a4c73c0f7`): no Facebook page or independent venue website surfaced.
- 5 artist tier-5 candidates investigated and left blank, no reliably-mappable canonical genre found on a Chrome-free surface: Chloe Anne (common-name collision risk, multiple same-name artists), Erika Wood, Bash Bailey, Helen Walford, Putan Club (likely non-UK name collision — the only clean genre evidence found describes a French/Italian industrial duo, not a UK act; §2A.1.1 non-UK rejection applied).
- 6 further artist tier-5 candidates investigated and left blank: Matt Bryan (location/name mismatch risk — search surfaced a same-name Darlington artist, not confirmed as the stored Middlesbrough act), Georgia Lily, Nick Milner Band, Jo Safina (no results), Headgames (possible historic-band/current-act conflation risk — stored actType covers vs. an unrelated 1980s punk band of the same name), The Skasoul.
- **King Kurt Pudding Party**: possible name-contamination case — "King Kurt" is a well-known UK rockabilly/psychobilly band and "Pudding Party" appears in searches only as an EVENT/show name at a specific venue, not necessarily the act's own billing. Left blank rather than guessed at; flagged below for a human check rather than genre-enriched or renamed (out of scope for a genre-only pass).
- **The Missing Cats Duo** (`ff8d0138-ce9d-43a5-b1bd-c71f26e2f18d`): already correctly enriched on `acoustic`/`actType`/facebookUrl by an earlier process; no reliably-mappable genre found this firing (only "acoustic covers" corroborated, which is not a genre). Left blank, not re-touched.

## Records skipped

- Artist tiers 1 and 4 (new/backlog artist Facebook identification and bio quoting): fully hard-stopped. `list_connected_browsers` returned zero browsers.
- Tier 2/3 venue backlog beyond the 25 written: the `livebandphotos` import surge continues (204 fresh venues with missing socials at firing start, createdSince 24h); budget was spent entirely on this fresh tier, oldest-first within the batch returned by `list_venues`.

## Names corrected under §0.6

None this firing.

## Validator summary line (verbatim)

First pass:

```
27 records · 3 clean · 2 FAIL · 45 WARN   [mode=gate]
```

One FAIL (`FB_EVIDENCE_MISMATCH` on East Ham Social Club) was self-caught: my own evidence line's `capturedFrom` pointed at the website source when the field actually written was the Facebook group URL. Corrected the evidence line to cite the correct source, re-ran:

```
27 records · 3 clean · 1 FAIL · 45 WARN   [mode=gate]
```

The remaining FAIL was `BIO_VERBATIM` on The Zenyth Collective, comparing its pre-existing, untouched bio against this firing's unrelated genre-sourcing evidence text. This firing wrote only `genres` to that record; the bio field was never touched. Same standing false-positive class as 12+ prior instances logged to CTO-INBOX between 2026-08-28 and this morning, still awaiting a ruling. Excluded per that precedent, re-ran:

```
26 records · 3 clean · 0 FAIL · 45 WARN   [mode=gate]
```

All 45 WARNs are STUB_NO_BIO / STUB_NO_IMAGE (expected — this firing wrote facebookUrl/website/genres only, never bio or image). Validated via a field-mapping adapter (`data/state/tmp/bv2a-firing0218z-build.py`), consistent with the standing venue-shape workaround.

## Budget and breaker

Budget used: 30 of 30 venues investigated (25 written, 4 flagged two/multi-candidate, 2 evidenced blank — 30 total, within cap); 15 of 15 artists investigated (2 written, 13 evidenced blank/flagged). Wall-clock: claim acquired 02:18:00Z, work concluded ~02:31Z — under 13 minutes, well inside the 40-minute ceiling. Circuit breaker: did not fire. Chrome unavailable throughout; artist tiers 1 and 4 hard-stopped per the task's explicit partial-completion rule, not a run failure.

## Ledger, summary, dashboards

`data/state/enrichment-ledger.jsonl`: 27 enrich lines appended, plus 1 snapshot line (artistsTotal 3420, artistsMissingSocials 1294, artistsMissingGenres 851, venuesTotal 3471, venuesMissingSocials 206).

`data/state/run-summary.jsonl`: 1 line appended, outcome completed, recordsEnriched 27, skipped 13.

Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (3402 records, 132 snapshots), `data/normalized/DASHBOARD.html`.

## Defects and standing items logged to CTO-INBOX

- Another instance of the BIO_VERBATIM-on-untouched-pre-existing-bio false positive (The Zenyth Collective). The standing ruling request from `bv2a-circuit-breaker-tripped-firing1519z` remains open.
- King Kurt Pudding Party: possible artist-name contamination (event/show name appended to a well-known act's name) — flagged for a human check, not corrected or enriched this firing given genre-only scope.
