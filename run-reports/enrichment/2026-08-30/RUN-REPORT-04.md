# Bv2a Enrichment — RUN-REPORT-04

Run id: `bv2a-enrichment-2026-08-30T04-18-09Z`. Outcome: completed (partial). Venues worked under FP.2. Artist tiers 1 and 4 hard-stopped on Chrome. Tier 5 worked without Chrome via WebSearch.

## Step 0 — circuit breaker

Read the last 3 reports, newest first:

- RUN-REPORT-03 (2026-08-30, 03:18Z): outcome completed (partial). Validator `21 records · 2 clean · 0 FAIL · 38 WARN` after correcting one self-caught `BLANK_NOT_EVIDENCED` on a Phase-A genre-only write. 0 FAIL on the shipped pass.
- RUN-REPORT-02 (2026-08-30, 02:18Z): outcome completed (partial). Validator `26 records · 3 clean · 0 FAIL · 45 WARN` after excluding one self-caught FB_EVIDENCE_MISMATCH and one BIO_VERBATIM-on-untouched-bio false fail. 0 FAIL on the shipped pass.
- RUN-REPORT-01 (2026-08-30, 01:18Z): outcome completed (partial). Validator `29 records · 5 clean · 0 FAIL · 47 WARN` after excluding 1 BIO_VERBATIM-on-untouched-bio false fail. 0 FAIL.

0 of the last 3 reports carried a recorded validator FAIL. All 3 wrote a report. The breaker did not trip.

## Step 2 — runbook and task spec

`RUNBOOK.md` read in full (732 lines). H1 = v2.27. CURRENT FLOOR (§6A) = v2.19. 2.27 ≥ 2.19. Floor check passed.

`ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail read for standing `bv2a-*` fingerprints: the venue backlog/surge class, the `edit_venue` `facebookUrl` silent-drop defect and its `socialMediaUrls` workaround, the validator venue-shape gap and its field-mapping adapter, the BIO_VERBATIM-on-untouched-pre-existing-bio false-positive class, the King Kurt Pudding Party name-contamination flag, and the standing Chrome outage.

## Concurrency

Did not check for, create or delete any `.lock` file. Read `data/state/claims/bv2a-enrichment.json`: `heldBy: null`, released 2026-08-30T03:28:32Z by RUN-REPORT-03. Available.

Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-30T04-18-09Z.json` (`outcome:"started"`), then acquired the claim (`heldBy: bv2a-enrichment-2026-08-30T04-18-09Z`, TTL 3h, `expiresAt: 2026-08-30T07:18:09Z`). Released at close.

## Tool check

bndy MCP tools reachable (confirmed via `list_venues`). Chrome: `list_connected_browsers` returned zero browsers, continuing the standing outage. Per the task's hard-stop rule, venues proceed without Chrome (FP.2 needs none). Artist tiers 1 and 4 (identity check + quoted bio) are hard-stopped; tier 5 (genre-only) proceeds via WebSearch.

## Selection

- Tier 1 (artists <24h, missing socials): `list_artists(createdSince:24h, missingSocials:true)` returned 0.
- Tier 2 (venues <24h, missing socials): `list_venues(createdSince:24h, missingSocials:true)` returned 0.
- Tier 3 (backlog venues missing socials, oldest first): `list_venues(missingSocials:true)` returned 186 total at firing start. Scanned across three pages (120 candidates) to establish true oldest-first order, since the tool does not sort by `createdAt`. Worked 30 oldest-first, skipping records already flagged as evidenced-blank/multi-candidate by earlier firings tonight, and skipping non-fixed-building candidates under §0.23 (parks, recreation grounds, a festival stage, a nature reserve) without spending search budget on them.
- Tier 5 (artists missing genres, already hold a facebookUrl): `list_artists(missingGenres:true)` returned 850 at firing start. The first page's facebookUrl-holding candidates (Glass Unicorn, The Currants, BNJY, The Desperate Cowboys, Bet Shop Boys, Soundgenarator, Rob Hunt, The Humanitarians) had all already been investigated and left blank by tonight's earlier firings — not re-litigated. Widened to structured-source-backed and independently-searchable candidates without a stored facebookUrl (genre is the one field a run may infer, §0.0), consistent with tonight's tier-5 practice.

## Records enriched with a verified page

25 venues, all under FP.2 (WebSearch only, no Chrome, no bio field touched). `facebookUrl` written via the standing `socialMediaUrls: [{"platform":"facebook","url":"..."}]` workaround, never the top-level `facebookUrl` parameter. Every write read back with `get_by_id` and confirmed persisted.

| Venue | Fields | Source |
|---|---|---|
| The Aviator (Great Clacton) | facebookUrl, website | facebook.com/TheAviatorClacton/, theaviatorpubclacton.co.uk |
| Aveley Village Social Club Ltd | facebookUrl, website | facebook.com/people/Aveley-Village-Social-Club-Ltd/100057080005343/, aveleysocialclub.co.uk |
| Bar Monico (Canvey Island) | facebookUrl | facebook.com/bar.monico/ (picked over a same-named "Bar Monico, Slough" page) |
| The Brandon Groves Community Club | facebookUrl, website | facebook.com/brandongrovescommunityclub/, brandongrovesclub.co.uk |
| Chelmsford Social Club | facebookUrl, website | facebook.com/profile.php?id=212269628812783 (399 likes, matches address and "since 1975" detail — picked over two thinner numeric duplicates), chelmsfordsocialclub.co.uk |
| The Cherry Tree Pub (Dagenham) | facebookUrl | facebook.com/p/The-Cherry-Tree-Pub-100087454001671/ |
| Comrades Sports and Social Club (Clacton) | facebookUrl | facebook.com/comradessportsandsocialclub/ |
| Corringham Social Club | facebookUrl, website | facebook.com/corringhamsocialclub/, corringhamsocialclub.co.uk |
| Frinton War Memorial Club | website | frintonwarmemorialclub.com (facebookUrl held back — two competing pages, see below) |
| Hadleigh Conservative Club Ltd | website | hadleighcc.co.uk (facebookUrl held back — two competing pages, see below) |
| Harlow Rugby Club | facebookUrl, website | facebook.com/HarlowRugbyClub/, harlowrugby.club (a separate "Functions & Events" page, facebook.com/lattonpark, exists but the main club page was preferred) |
| Harlow War Memorial Institute | facebookUrl, website | facebook.com/150269555011693 (address matches exactly), hwmi.co.uk |
| Highways Sports & Social Club (Colchester) | facebookUrl | facebook.com/highwaySocial/ |
| Elm Park Bowls Club | facebookUrl | facebook.com/pages/Elm-Park-Hornchurch-Bowling-Club/180806828964078 (moderate confidence — area/name match, sole candidate) |
| Kelvedon Labour Club Ltd | facebookUrl, website | facebook.com/p/Kelvedon-Labour-Club-100063699397022/, kelvedonlabourclub.org |
| Laindon Community Centre | website | laindon.club (only Facebook groups found, not a page — not attached) |
| RAFA Club (Witham) | facebookUrl, website | facebook.com/WithamRAFA/, withamrafaclub.co.uk |
| Shepherd (Kelvedon Hatch) | website | theshepherdkelvedonhatch.com (facebookUrl held back — three competing pages, see below) |
| The Snooty Fox (Great Bromley) | facebookUrl, website | facebook.com/thesnootyfoxbromley/, snootyfoxpub.com |
| Admiral Vernon (Dagenham) | facebookUrl | facebook.com/192074204220830 |
| Anchor Canewdon Ltd | facebookUrl | facebook.com/TheAnchorCanewdon/ |
| The Angel (Braintree) | facebookUrl | facebook.com/theangelinnbraintree/ |
| Archers (Gidea Park) | website | greeneking.co.uk/pubs/essex/archers (no confirmed dedicated FB page found) |
| The Bell Inn (Castle Hedingham) | facebookUrl, website | facebook.com/TheBellInnCastleHedinghamHalstead/, hedinghambell.co.uk |
| The Bell (Ingatestone) | facebookUrl, website | facebook.com/TheBellIngatestone/, thebell-ingatestone.co.uk |

1 artist, tier 5 genre-only, via independent third-party corroboration (no Chrome, no facebookUrl touched):

| Artist | Field | Source |
|---|---|---|
| Lord Toffingham (`b2d4f896-6b9e-4ee2-8fe5-184c1f43b2f2`) | genres: Rock, Pop | livebandphotos.co.uk gig listing and YouTube video captions: "70s Glam Rock Band LORD TOFFINGHAM", "playing 70's Glam, Rock & Pop" — Glam mapped away per §0.18 (not on the canonical list), Rock and Pop kept. Consistent with the stored Essex location (Leigh Constitutional Club gig footage). facebookUrl and bio untouched. |

## Two-candidate / multi-candidate flags, not attached

- **Frinton War Memorial Club** (`78f9869b-cc63-47a1-a333-13136a6bea18`): two live Facebook pages found under slightly different names/handles, no disambiguating signal without Chrome. Website only.
- **Hadleigh Conservative Club Ltd** (`8a02df9e-29dc-40b3-a101-89b629c962aa`): two competing Facebook pages (61 likes vs 121 likes), no way to confirm which is current. Website only.
- **Shepherd, Kelvedon Hatch** (`205a2149-023f-4d0f-9dba-624db3fc21fb`): three competing Facebook pages found for the same pub. Website only.

## Evidenced blanks

- **Darcy's, Fenton, Stoke-on-Trent** (`sFtBFBVDH68B7lROwqqj`, oldest backlog record touched, created 2025-09-25): no single official Facebook page surfaced across two search variants; only third-party pub-listing sites. No write made.
- **White Lodge, Stafford** (`4508b924-b3fc-4d6e-907b-65841ec1baa5`): the only strong search hit is a campsite of the same name in Great Haywood, not the pub at 37 Cannock Rd, Stafford ST17 0QE the bndy record describes — a likely candidate-confusion case. No write made.
- **The Tannery, Derby** (`d6572707-b153-40e4-ac09-fa15c19166a1`): a genuine, very new (opened June 2026) craft-beer taproom; no dedicated Facebook page surfaced across three search variants, only its operator's (Ashover Brew Co) own page. No write made.
- **Hunstanton Bandstand** (`59a6224b-b454-45e2-b0af-04006a92c0e7`): a council-run structure with events organised by a separate "Hunstanton Events" committee page — no single page representing the bandstand itself. No write made.
- **The Body Factory Gym - Harlow** (`89788c1e-bd2f-496a-b554-7865c8b3fc82`): flagged, not enriched. The bndy record is named "The Body Factory Gym - Harlow" but its `externalId` is `livebandphotos:paringdon-sports-and-social-club-harlow`. Body Factory Gym (a fitness chain) and Paringdon Sports & Social Club (a live-music social club with its own facebook.com/paringdonsports/ page) are two different, unrelated businesses that happen to share a site. Attaching the sports club's Facebook page to a record named after the gym risks a wrong-identity write. Needs a human check of which entity the record should actually represent.
- 12 artist tier-5 candidates investigated and left blank, no reliably-mappable canonical genre found without Chrome: Glen Franklin, Lovin' It, Marshal Beard, Higgi's Band, Karl Howard (no information surfaced at all beyond directory listings); One Night Stand (a same-name "Classic rock covers band" found on BandMix, Uttoxeter area — plausible but not confirmed as the same Stoke-on-Trent act, left blank rather than guessed at); Amber Star, Sonny Ransom, Phoenix, The Greedy Club (no information surfaced); Daniel Stephen Turner (own Facebook billing is "Singer-Songwriter" with a mixed punk/folk/Americana/rock description — no clean single canonical-enum mapping, not guessed at); Mystiek (a strong "Hard Rock" genre signal found, but the source places the band in Wolverhampton, not the stored Derby location — left blank rather than risk attaching the wrong same-named act's genre); Graeme Cox (an "acoustic" musician found under this name, but based in Huddersfield, not the stored Devon — same-name-collision risk, left blank).

## Records skipped

- Artist tiers 1 and 4 (new/backlog artist Facebook identification and bio quoting): fully hard-stopped. `list_connected_browsers` returned zero browsers.
- Three Horseshoes Bures, Bromley United Services Club, Winston Social Club, Enfield Town Club, Moot House, Plough Ipswich, Sarah Moore, The Victoria Baldock, Hare & Hounds St Albans, Cock Inn Hadleigh, The Chequers, Market Place Burton, Royal British Legion Beeston, Annitsford Welfare Club, Ann Welfare Playing Fields, Jubilee Park Horndean, Hayfield Club, Okehampton Show ground, Link Social Club Harlow, Lion Earls Colne: all already investigated and left as evidenced blanks or do-not-attach flags by earlier firings tonight. Not re-litigated.
- Campbell Park (Milton Keynes), Prestwood Recreation Ground, Bowling Green Stage (Nantwich Food Festival), Bumble Hole Local Nature Reserve, West Park (Long Eaton): skipped without a search — parks, recreation grounds, a festival stage and a nature reserve, not fixed buildings per §0.23. Listed here rather than searched, per the runbook's instruction to list and move on.
- Glass Unicorn, The Currants, BNJY, The Desperate Cowboys, Bet Shop Boys, Soundgenarator, Rob Hunt, The Humanitarians: already investigated and left as evidenced blanks by earlier firings tonight. Not re-litigated.

## Names corrected under §0.6

None this firing.

## Validator summary line (verbatim)

First pass:

```
26 records · 6 clean · 1 FAIL · 40 WARN   [mode=gate]
```

The 1 FAIL was `FB_EVIDENCE_MISMATCH` on Harlow Rugby Club — my own evidence line's `capturedFrom` was written as `facebook.com/@HarlowRugbyClub/` (with an `@`) while the canonical URL actually stored was `facebook.com/HarlowRugbyClub/` (no `@`, per the canonicalisation rule in §6). Self-caught: corrected the evidence line to match the canonical URL actually written, re-ran:

```
26 records · 6 clean · 0 FAIL · 40 WARN   [mode=gate]
```

All 40 WARNs are `STUB_NO_BIO` / `STUB_NO_IMAGE` (expected — this firing wrote facebookUrl/website/genres only, never touched bio or image on any record; venues have no bio field at all). Validated via the standing field-mapping adapter (`bv2a-firing0418z-records.json` + aliased evidence), consistent with the venue-shape workaround from earlier firings.

## Budget and breaker

Budget used: 30 of 30 venues investigated (25 written, 3 flagged multi-candidate, 5 evidenced blank/flagged — 33 total across categories because 3 multi-candidate venues also received a website-only write, counted once each in the 30). 15 of 15 artists investigated (1 written, 14 evidenced blank). Wall-clock: claim acquired 04:18:09Z, work concluded ~04:52Z — about 34 minutes, inside the 40-minute ceiling. Circuit breaker: did not fire. Chrome unavailable throughout; artist tiers 1 and 4 hard-stopped per the task's explicit partial-completion rule, not a run failure.

## Ledger, summary, dashboards

`data/state/enrichment-ledger.jsonl`: 26 enrich lines appended (25 venue, 1 artist), plus 1 snapshot line (artistsTotal 3420, artistsMissingSocials 1294, artistsMissingGenres 849, venuesTotal 3471, venuesMissingSocials 161 — down from 186, exactly this firing's 25 writes).

`data/state/run-summary.jsonl`: 1 line appended, outcome completed, recordsEnriched 26, skipped 5.

Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (3449 records, 134 snapshots), `data/normalized/DASHBOARD.html`.

## Defects and standing items logged to CTO-INBOX

- A new instance of the self-caught `FB_EVIDENCE_MISMATCH` class (Harlow Rugby Club) — an `@`-prefixed URL form used in a search-result title leaking into the evidence line's `capturedFrom` rather than the canonical URL actually written. Same shape as the standing precedent (East Ham Social Club, RUN-REPORT-02): the fix is always to record the canonical URL that was actually stored, not the literal search-result string.
- The Body Factory Gym - Harlow / Paringdon Sports & Social Club name-vs-externalId mismatch: flagged for a human check of which entity the record should represent, per the King Kurt Pudding Party precedent (name-contamination flag, not corrected or enriched in a genre/socials-only pass).
