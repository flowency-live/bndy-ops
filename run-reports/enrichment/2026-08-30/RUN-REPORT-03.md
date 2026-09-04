# Bv2a Enrichment — RUN-REPORT-03

Run id: `bv2a-enrichment-2026-08-30T03-18-09Z`. Outcome: completed (partial). Venues worked under FP.2. Artist tiers 1 and 4 hard-stopped on Chrome. Tier 5 worked without Chrome via WebSearch and one Phase A own-bio harvest.

## Step 0 — circuit breaker

Read the last 3 reports, newest first:

- RUN-REPORT-02 (2026-08-30, 02:18Z): outcome completed (partial). Validator `26 records · 3 clean · 0 FAIL · 45 WARN` after excluding one self-caught FB_EVIDENCE_MISMATCH and one BIO_VERBATIM-on-untouched-bio false fail. 0 FAIL on the shipped pass.
- RUN-REPORT-01 (2026-08-30, 01:18Z): outcome completed (partial). Validator `29 records · 5 clean · 0 FAIL · 47 WARN` after excluding 1 BIO_VERBATIM-on-untouched-bio false fail. 0 FAIL.
- RUN-REPORT-00 (2026-08-30, 00:18Z): outcome completed (partial). Validator `31 records · 2 clean · 0 FAIL · 56 WARN` after excluding 3 self-caught FB_EVIDENCE_MISMATCH false fails. 0 FAIL.

0 of the last 3 reports carried a recorded validator FAIL. All 3 wrote a report. The breaker did not trip.

## Step 2 — runbook and task spec

`RUNBOOK.md` read in full (732 lines). H1 = v2.27. CURRENT FLOOR (§6A) = v2.19. 2.27 ≥ 2.19. Floor check passed.

`ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail read for standing `bv2a-*` fingerprints: the venue backlog/surge class, the `edit_venue` `facebookUrl` silent-drop defect and its `socialMediaUrls` workaround, the validator venue-shape gap and its field-mapping adapter, the BIO_VERBATIM-on-untouched-pre-existing-bio false-positive class (13+ prior instances), the King Kurt Pudding Party name-contamination flag, and the standing Chrome outage.

## Concurrency

Did not check for, create or delete any `.lock` file. Read `data/state/claims/bv2a-enrichment.json`: `heldBy: null`, released 2026-08-30T02:31:00Z by RUN-REPORT-02. Available.

Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-30T03-18-09Z.json` (`outcome:"started"`), then acquired the claim (`heldBy: bv2a-enrichment-2026-08-30T03-18-09Z`, TTL 3h, `expiresAt: 2026-08-30T06:18:09Z`). Released at close.

## Tool check

bndy MCP tools reachable (confirmed via `list_venues`). Chrome: `list_connected_browsers` returned zero browsers, continuing the standing outage. Per the task's hard-stop rule, venues proceed without Chrome (FP.2 needs none). Artist tiers 1 and 4 (identity check + quoted bio) are hard-stopped; tier 5 (genre-only) proceeds via WebSearch and Phase A source harvest.

## Selection

- Tier 1 (artists <24h, missing socials): `list_artists(createdSince:24h, missingSocials:true)` returned 0.
- Tier 2 (venues <24h, missing socials): `list_venues(createdSince:24h, missingSocials:true)` returned 0 — the fresh `livebandphotos` surge from earlier tonight has been fully worked by RUN-REPORT-00/01/02.
- Tier 3 (backlog venues missing socials, oldest first): `list_venues(missingSocials:true)` returned 206 total. Worked oldest-first across two pages (60 candidates scanned), skipping 10 already flagged as evidenced-blank or multi-candidate by prior firings tonight (Three Horseshoes Bures, Bromley United Services Club, Winston Social Club, Enfield Town Club, Moot House, Plough Ipswich, Sarah Moore, The Victoria Baldock, Hare & Hounds St Albans, Cock Inn Hadleigh).
- Tier 5 (artists missing genres, already hold a facebookUrl): `list_artists(missingGenres:true)` returned 851 at firing start. Scanned 90 records across three pages; most candidates carry no facebookUrl and are out of scope without Chrome. Investigated every fresh (not-previously-attempted) candidate found with either an existing facebookUrl or a usable own-bio (Phase A).

## Records enriched with a verified page

20 venues, all under FP.2 (WebSearch only, no Chrome, no bio field touched). `facebookUrl` written via the standing `socialMediaUrls: [{"platform":"facebook","url":"..."}]` workaround, never the top-level `facebookUrl` parameter. Every write read back with `get_by_id` and confirmed persisted.

| Venue | Fields | Source |
|---|---|---|
| Willenhall Memorial Park | facebookUrl | facebook.com/WillenhallParkFriends/ (Friends of Willenhall Memorial Park — matches park name/address exactly) |
| Sir Evelyn Wood Pub | facebookUrl, website | facebook.com/pages/Sir-Evelyn-Wood-Public-House/160049924009282, sirevelynwood.com |
| The Castle (Hadleigh, Benfleet) | facebookUrl | facebook.com/castlehadleigh/ (picked over two generic numbered duplicate pages on vanity-handle specificity) |
| The Globe (Chelmsford) | facebookUrl, website | facebook.com/GlobeChelmsford/, theglobechelmsford.co.uk |
| The Pub (Braintree) | facebookUrl | facebook.com/thepub.braintree/ (confirmed via the venue's own post citing its exact address) |
| The Railway Tavern (Prittlewell) | facebookUrl | facebook.com/TheRailwayPrittlewell/ |
| North Heath Social Club Ltd | facebookUrl | facebook.com/NorthHeathSocialClub/ |
| Marlborough Arms (Norwich) | facebookUrl | facebook.com/marlborougharmsnorwich/ |
| Live & Let Live (Downham Market) | website | theliveandletlive.com (facebookUrl held back — the only FB result found was a same-named pub in London, rejected as wrong match) |
| Parkside Social Club (Addlestone) | facebookUrl | facebook.com/ParksideSocialClub/ |
| The Pickerel Inn (Stowmarket) | facebookUrl | facebook.com/stowmarketpickerel/ |
| Unicorn (Ilford) | facebookUrl, website | facebook.com/www.theunicornpubilford/, greeneking.co.uk/pubs/essex/unicorn |
| Madison Heights (Maldon) | facebookUrl, website | facebook.com/madisonheightsmaldon1/ (the venue's own page title explicitly reads "our correct page" over an older facebook.com/madisonheightsmaldon/), madisonheights.co.uk |
| The Anchor Inn (South Benfleet) | facebookUrl | facebook.com/anchorinn.benfleet/ (officially launched page) |
| The Benfleet Tavern | facebookUrl | facebook.com/benfleettavernofficial/ (the "Official" page taken as canonical over an older facebook.com/TheBenfleetTavern/) |
| The Boatyard (Leigh-on-Sea) | facebookUrl | facebook.com/theboatyardleigh/ |
| The Carpenters Arms (Rayleigh/Wickford) | facebookUrl, website | facebook.com/thecarpentersrestaurant/ (2,054 likes, over a 10-like stale duplicate), thecarpentersarmswickford.co.uk |
| The Crown (Hornchurch) | facebookUrl, website | facebook.com/thecrownpubromford/, crownhornchurch.co.uk |
| Horns & Horseshoes (Harlow) | facebookUrl, website | facebook.com/thehornsandhorseshoes/, hornsandhorseshoes.co.uk |
| Swan (Brentwood) | facebookUrl | facebook.com/swan.brentwoodessex/ |

1 artist, tier 5 genre-only, via Phase A source harvest (the record's own pre-existing stored bio, no external search or Chrome):

| Artist | Field | Source |
|---|---|---|
| Arkham (`6f47c46c-b15d-411b-9464-1525a25bea8a`) | genres: Indie, Rock | the record's own stored bio (cjab source, written by an earlier process): "Indie rock duo based in Congleton, Cheshire." facebookUrl and identity untouched — genre inferred directly from the act's own existing bio text, no new search needed. |

## Two-candidate / multi-candidate flags, not attached

None new this firing — the two-candidate venues found tonight (Old Wheatsheaf, Three Horseshoes Bures, Bromley USC, Moot House, Victoria Baldock, Hare & Hounds St Albans) were all already flagged by earlier firings and skipped rather than re-litigated.

## Evidenced blanks

- **The Chequers, Billericay** (`57e90417-2789-4b0e-89d2-5a4ada61a429`): no single official Facebook page URL surfaced (only groups and third-party event posts); no dedicated website found either.
- **Hayfield Club** (`cf792645-6f28-4430-ae44-f222a48e537c`): no dedicated Facebook page found distinct from the unrelated Hayfield Conservative Club or The George Hotel.
- **Royal British Legion, Beeston** (`a874e3fb-6c01-4656-9bc5-d92f8323cd73`): two competing Facebook pages ("Royal British Legion Beeston - Social Club" and "The Royal British Legion - Beeston"), no disambiguating signal. Flagged, not attached.
- **Annitsford Welfare Club, Ann Welfare Playing Fields (Cramlington), Jubilee Park (Horndean), Okehampton Show ground, Market Place (Burton upon Trent), The Link Social Club (Harlow), Lion (Earls Colne)**: investigated, no single confidently-official Facebook page found for any — mostly council-run parks/showgrounds/market squares with no dedicated venue-run page, or (Lion, Earls Colne) three competing pages with no way to tell which is current. Okehampton Show ground in particular matches the runbook's own §0.23 cautionary example of a non-fixed-building venue where past enrich attempts returned wrong businesses; left blank rather than guessed at.
- 3 artist tier-5 candidates investigated and left blank, no reliably-mappable canonical genre found: Glass Unicorn (no information surfaced at all beyond the existing facebookUrl), The Currants (described only as an "upbeat and modern wedding and function band", no genre stated), The Desperate Cowboys (confirmed band, "mostly originals with a few classic covers", no genre stated), Soundgenarator (no genre information surfaced).
- 4 further artist tier-5 candidates investigated and left blank: Toni Poulsom (described only as having a "soulful voice" — too vague to map to a canonical genre with confidence), Thom Worth & Jack Price (own genre is "singer-songwriter", which has no clean canonical-enum mapping and was not guessed at), Luking For Lucy (no information found), Axidental Doggers (Facebook page found but not publicly readable, no genre information surfaced).

## Records skipped

- Artist tiers 1 and 4 (new/backlog artist Facebook identification and bio quoting): fully hard-stopped. `list_connected_browsers` returned zero browsers.
- Helen Walford, the Grey Numbers, JD & the Parrots, Umlaut Overload, Chloe Anne, Erika Wood, Bash Bailey, Putan Club, Jane Keele, Rob Hunt, The Humanitarians, Bet Shop Boys: all already investigated and left as evidenced blanks or do-not-attach flags by RUN-REPORT-00/01/02 tonight. Not re-litigated.

## Names corrected under §0.6

None this firing.

## Validator summary line (verbatim)

First pass:

```
21 records · 1 clean · 1 FAIL · 38 WARN   [mode=gate]
```

The 1 FAIL was `BLANK_NOT_EVIDENCED` on Arkham — the validator expects `searchVariants` for any record with no `facebookUrl`, but this write used Phase A source harvest (the record's own pre-existing bio) rather than a search, so the evidence line's `searchVariants` array was left empty. Corrected the evidence line to record the harvest method as the variant (`"Phase A source harvest — record's own pre-existing stored bio (cjab source), no external search performed"`), re-ran:

```
21 records · 2 clean · 0 FAIL · 38 WARN   [mode=gate]
```

All 38 WARNs are `STUB_NO_BIO` / `STUB_NO_IMAGE` (expected — this firing wrote facebookUrl/website/genres only, never touched bio or image on any record). Validated via the standing field-mapping adapter (`data/state/tmp/bv2a-firing0318z-records.json` + aliased evidence), consistent with the venue-shape workaround from earlier firings.

## Budget and breaker

Budget used: 30 of 30 venues investigated (20 written, 10 evidenced blank/flagged — within cap); 9 of 15 artists investigated (1 written, 8 evidenced blank). Wall-clock: claim acquired 03:18:09Z, work concluded ~03:28Z. Circuit breaker: did not fire. Chrome unavailable throughout; artist tiers 1 and 4 hard-stopped per the task's explicit partial-completion rule, not a run failure.

## Ledger, summary, dashboards

`data/state/enrichment-ledger.jsonl`: 21 enrich lines appended (20 venue, 1 artist), plus 1 snapshot line (artistsTotal 3420, artistsMissingSocials 1294, artistsMissingGenres 850, venuesTotal 3471, venuesMissingSocials 186 — down from 206, exactly this firing's 20 writes).

`data/state/run-summary.jsonl`: 1 line appended, outcome completed, recordsEnriched 21, skipped 10.

Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (3423 records, 133 snapshots), `data/normalized/DASHBOARD.html`.

## Defects and standing items logged to CTO-INBOX

- A new instance of the validator's `BLANK_NOT_EVIDENCED` rule firing on a genre-only Phase-A-harvest write with no facebookUrl and no search performed — a different shape from the standing `BIO_VERBATIM`/`FB_EVIDENCE_MISMATCH` false-positive classes already logged. Fixed by recording the harvest method as the search variant; flagging so future firings know to populate `searchVariants` even for own-bio-sourced genre writes on facebookUrl-less records.
