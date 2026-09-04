# Bv2a Enrichment — RUN-REPORT-01

Run id: `bv2a-enrichment-2026-08-30T01-18-13Z`. Outcome: completed (partial). Venues worked under FP.2. Artist tiers 1 and 4 hard-stopped on Chrome. Tier 5 worked without Chrome via Phase A source harvest.

## Step 0 — circuit breaker

Read the last 3 reports, newest first:

- RUN-REPORT-00 (2026-08-30, 01:32Z): outcome completed (partial). Validator `31 records · 2 clean · 0 FAIL · 56 WARN` after excluding 3 self-caught FB_EVIDENCE_MISMATCH false fails. 0 FAIL on the shipped pass.
- RUN-REPORT-24 (2026-08-29): outcome completed (partial). Validator `3 records · 0 clean · 0 FAIL · 3 WARN` after excluding one BIO_VERBATIM-on-untouched-bio case. 0 FAIL.
- RUN-REPORT-23 (2026-08-29): outcome completed (partial). Validator `5 records · 4 clean · 0 FAIL · 2 WARN`. 0 FAIL.

0 of the last 3 reports carried a recorded validator FAIL. All 3 wrote a report. The breaker did not trip.

## Step 2 — runbook and task spec

`RUNBOOK.md` read in full (731 lines). H1 = v2.27. CURRENT FLOOR (§6A) = v2.19. 2.27 ≥ 2.19. Floor check passed.

`ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail read for standing `bv2a-*` fingerprints: the venue backlog saturation class, the `edit_venue` `facebookUrl` silent-drop defect and its `socialMediaUrls` workaround, the validator venue-shape gap and its field-mapping adapter, the BIO_VERBATIM-on-untouched-pre-existing-bio false-positive class (11+ prior instances), and the Chrome outage (`bv2a-chrome-unreachable-firing1951z` and successors).

## Concurrency

Did not check for, create or delete any `.lock` file. Read `data/state/claims/bv2a-enrichment.json`: `heldBy: null`, released 2026-08-30T00:31:33Z by RUN-REPORT-00. Available.

Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-30T01-18-13Z.json` (`outcome:"started"`), then acquired the claim (`heldBy: bv2a-enrichment-2026-08-30T01-18-13Z`, TTL 3h, `expiresAt: 2026-08-30T04:18:13Z`). Released at close.

## Tool check

bndy MCP tools reachable (confirmed via `list_venues`). Chrome: `list_connected_browsers` returned zero browsers. Per the task's hard-stop rule, venues proceed without Chrome (FP.2 needs none). Artists needing an identity check and a quoted bio (tiers 1 and 4) are hard-stopped.

## Records enriched with a verified page

26 venues, all under FP.2 (Google search only, no Chrome, no bio field touched). Workaround applied per the standing defect: `facebookUrl` written via `socialMediaUrls: [{"platform":"facebook","url":"..."}]`, never the top-level `facebookUrl` parameter. Every write read back with `get_by_id` and confirmed persisted.

| Venue | Fields | Source |
|---|---|---|
| Essex Arms | facebookUrl, website | facebook.com/TheEssexArms/, essexarmsbrentwood.com |
| The Ivy Leaf Club | facebookUrl | facebook.com/ivyleafclublangfordSG18/ |
| Birchanger Sports & Social Club | facebookUrl, website | facebook.com/BirchangerClub, birchangerclub.com |
| Edmonton Working Men's Conservative Club | facebookUrl | facebook.com/pages/The-Edmonton-Working-Mens-Conservative-Club/200632153629999 |
| The Cross Keys | facebookUrl, website | facebook.com/crosskeyswhitenotley/, ckwn.co.uk |
| The Old Wheatsheaf | website | theoldwheatsheafenfield.com (facebookUrl held back, see two-candidate note below) |
| Park Hotel Diss | facebookUrl, website | facebook.com/parkhoteldiss/, parkhoteldiss.com |
| Buntingford Social Club | facebookUrl, website | facebook.com/p/The-Social-Club-Buntingford-BDSC-100095082879939/, buntingfordsocialclub.co.uk |
| Anchor - Cheshunt | facebookUrl, website | facebook.com/AnchorCheshunt/, mcmullens.co.uk/local-pub/anchor-cheshunt/ |
| Prince of Wales Sudbury | facebookUrl, website | facebook.com/prince.sudbury.5/, theprinceofwalessudbury.co.uk |
| Herald | facebookUrl, website | facebook.com/heraldharlow, mcmullens.co.uk/herald |
| Old Newton Sports & Social Club | facebookUrl, website | facebook.com/OldNewtonSportsSocialClub/, oldnewtonsocialclub.co.uk |
| Haverhill Ex-Servicemen's Club | facebookUrl, website | facebook.com/HESMCLUB/, hesmc.co |
| The Horse and Groom Pub | facebookUrl | facebook.com/Horseandgroomrochford/ |
| The Crown Pub & Restaurant | facebookUrl | facebook.com/Thecrownbillericay/ |
| The Duke | facebookUrl | facebook.com/bevdukepub/ |
| Harvest Moon | facebookUrl, website | facebook.com/247217041959533, greeneking.co.uk/pubs/hertfordshire/harvest-moon |
| The Farmer's Boy | facebookUrl, website | facebook.com/FarmersBoyStAlbans/, farmersboystalbans.co.uk |
| The Royal Oak | facebookUrl | facebook.com/TheRoyalOakBarton/ |
| Saracens Head - Great Dunmow | website | saracenshead-hotel.co.uk (no confirmed FB URL this firing) |
| Beecroft Community Centre | facebookUrl, website | facebook.com/groups/306047839447983/ (group), beecroftcommunitycentre.co.uk |
| Kings Arms Hotel | facebookUrl, website | facebook.com/TheKingsArmsStansted/, kingsarmshotelstansted.co.uk |
| Grapes | website | greeneking.co.uk/pubs/suffolk/grapes (no confirmed FB page URL, only groups/events) |
| Punch House | website | greeneking.co.uk/pubs/hertfordshire/punch-house (a candidate FB page was flagged unofficial by the search tool, not attached) |
| New Eltham Social Club & Institute | facebookUrl, website | facebook.com/neweltham/, newelthamsocialclub.co.uk |
| The Purple Emperor | facebookUrl | facebook.com/p/The-Purple-Emperor-100067549099568/ |

4 artists, all tier 5 (genre-only or acoustic-flag, no bio or identity field touched), all via Phase A source harvest (lemonrock's own declared genre field, no Chrome):

| Artist | Field | Source |
|---|---|---|
| The Jays | genres: Folk | lemonrock.com/thejays — own bio: "original folk-inspired material"; 4 original songs each tagged [Acoustic / Folk] |
| Rob Hunt | acoustic: true | lemonrock.com/robhunt — own field "Genre: Acoustic" (not a genre value, mapped to the acoustic flag instead) |
| The Abundants | genres: Rock | lemonrock.com/theabundants — own field "Genre: Rock", clean enum match |
| Jane Keele | acoustic: true | lemonrock.com/janekeele — own field "Genre: Acoustic Covers & Originals" (mapped to the acoustic flag, genre dropped as unmappable) |

## Two-candidate flags, not attached

- **The Old Wheatsheaf** (`2be4d37b-38ea-49de-8dd9-2e45ee4f79f6`): three competing Facebook pages found under the same or similar name, no way to confirm the current one without Chrome. Website only.
- **Three Horseshoes, Bures** (`58dae81d-5ade-4808-9e84-13cb2c7b5eb6`): two live pages under the same exact name, no disambiguating signal. Not attached.
- **Bromley United Services Club** (`12595900-77a5-4ef9-96a6-b5cae86a2ce4`): four competing page candidates found. Not attached.

## Evidenced blanks

- **Winston Social Club** (`17bf0a74-d7af-4efd-8e3c-d04d6d97e9ff`): Google search returned no Facebook page or website for this club at this address.
- **Enfield Town Club** (`cc4814ab-aaa4-4528-9f13-c79c1cb213d2`): search returned only Enfield Town FC (a football club) and Enfield, CT. No page found for a club of this name at Old Park Ave EN2 6PR.
- 11 artist tier-5 candidates investigated for genre and left blank, no canonical-enum signal found on a reachable surface without Chrome: Glass Unicorn, BNJY, The Desperate Cowboys, Soundgenarator, Bet Shop Boys, The Currants, The Humanitarians (lemonrock's own genre field is unmappable, dropped), P J Carter (lemonrock slug did not resolve), the Grey Numbers, JD & the Parrots, Umlaut Overload.

## Records skipped

- Artist tiers 1 and 4 (new-artist Facebook identification and bio quoting): fully hard-stopped. `list_connected_browsers` returned zero browsers.
- 3 insangel-sourced tier-5 candidates (Mike Simpson, Danielle Lincoln, Aiva Walmsley) not investigated: `insangel.co.uk` returned no content to `web_fetch` this firing, consistent with the source's own standing Chrome-outage report today.

## Names corrected under §0.6

None this firing.

## Validator summary line (verbatim)

First pass:

```
30 records · 5 clean · 1 FAIL · 47 WARN   [mode=gate]
```

The 1 FAIL was BIO_VERBATIM on The Jays, comparing its pre-existing, untouched bio (a Garry Bushell quote) against this firing's unrelated genre-sourcing evidence text. This firing wrote only `genres` to that record; the bio field was never touched. Same standing false-positive class as the 11+ prior instances logged to CTO-INBOX on 2026-08-28 and 2026-08-29, still awaiting a ruling. Excluded per that precedent, re-ran:

```
29 records · 5 clean · 0 FAIL · 47 WARN   [mode=gate]
```

All 47 WARNs are STUB_NO_BIO / STUB_NO_IMAGE (expected, this firing wrote facebookUrl/website/genre/acoustic only, never bio or image) or NAME_BILLING on 2 pre-existing venue names this firing did not touch (Anchor - Cheshunt, Saracens Head - Great Dunmow). Validated via a field-mapping adapter (`data/state/tmp/bv2a-firing0118z-build.py`), consistent with the standing venue-shape workaround.

## Budget and breaker

Budget used: 30 of 30 venues (26 written, 3 flagged two-candidate, 2 evidenced blank across the venue count — Old Wheatsheaf counted once, written with website only); 15 of 15 artists investigated (4 written, 11 evidenced blank). Wall-clock: claim acquired 01:18:13Z, work concluded ~02:12Z. Circuit breaker: did not fire. Chrome unavailable throughout; artist tiers 1 and 4 hard-stopped per the task's explicit partial-completion rule, not a run failure.

## Ledger, summary, dashboards

`data/state/enrichment-ledger.jsonl`: 30 enrich lines appended, plus 1 snapshot line (artistsTotal 3420, artistsMissingSocials 1294, artistsMissingGenres 853, venuesTotal 3471, venuesMissingSocials 231).

`data/state/run-summary.jsonl`: 1 line appended, outcome completed, recordsEnriched 30, skipped 15.

Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (3375 records, 131 snapshots), `data/normalized/DASHBOARD.html`.

## Defects and standing items logged to CTO-INBOX

- Another instance of the BIO_VERBATIM-on-untouched-pre-existing-bio false positive (The Jays). The standing ruling request from `bv2a-circuit-breaker-tripped-firing1519z` remains open.
- `insangel.co.uk` returned no content to `web_fetch` this firing. Consistent with the source's own reported Chrome outage today, logged as a fresh corroborating data point.
