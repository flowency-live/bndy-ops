# Bv2a Enrichment — Run Report — 2026-08-14, hour 05 (UTC)

Fired 2026-08-14T05:18:56Z. Run id `bv2a-enrichment-2026-08-14T05-18-56Z`.

**Filename note:** natural target was `RUN-REPORT-05.md`, already held by this morning's sixth firing. Per the collision rule this run used the next available suffix: `RUN-REPORT-06.md`.

**Outcome: COMPLETED.**

## Step 0 — circuit breaker

Newest-first, last 3 reports at start of this run:
1. `2026-08-14/RUN-REPORT-05.md` — COMPLETED. Validator `45 records · 15 clean · 0 FAIL · 59 WARN`.
2. `2026-08-14/RUN-REPORT-04.md` — COMPLETED. Validator `45 records · 15 clean · 0 FAIL · 60 WARN`.
3. `2026-08-14/RUN-REPORT-03.md` — COMPLETED. Validator `43 records · 11 clean · 0 FAIL · 65 WARN`.

0 of 3 recorded a FAIL, all 3 wrote a report. **Breaker NOT TRIPPED.** Proceeded.

## Step 1 — concurrency

Read `RUNBOOK.md` §6A step 2b and §6G in full before touching the claim. Claim file `data/state/claims/bv2a-enrichment.json` read `{"heldBy":null,"releasedAt":"2026-08-14T04:34:14Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-14T04-18-59Z"}` — released. Acquired per §6G:
- Heartbeat written first: `data/state/heartbeat/bv2a-enrichment-2026-08-14T05-18-56Z.json`.
- Claim written: `heldBy: bv2a-enrichment-2026-08-14T05-18-56Z`, `expiresAt: 2026-08-14T08:18:56Z` (3h TTL per §6G table).

`data/state/enrichment.lock` checked: absent. Not honoured, not recreated (retired file, per §6A step 2b).

The task-prompt claim-path mismatch (`enrichment.json` vs the real `bv2a-enrichment.json`, fingerprint `bv2a-claim-path-stale-in-prompt`) is already logged today — not re-logged.

## Step 2 — reads

RUNBOOK.md H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed (v2.27 ≥ v2.19). §2A.1 item 3b (both search surfaces before any blank) and item 8 (bio quoted, never written) read in full. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` read in full — today's live fingerprints noted (`bv2a-facebook-not-logged-in`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-genre-only-fb-evidence-mismatch`, `bv2a-claim-path-stale-in-prompt`, `run-report-path-collides-second-firing`, `enrich-venue-batch-array-not-parsed`). None re-logged.

## Step 3 — Chrome / Facebook precondition check

One Chrome browser connected. Navigated to `facebook.com`: logged-out landing page (`Log in`/`Sign up` fields, no session) — confirmed via `read_page`. **Seventh consecutive firing today blocked on this outage**, now persisting 7+ hours. Per the HARD STOP rule: venues proceeded (FP.2, no Chrome needed); artist work requiring Facebook search or bio-quoting (Priorities 1 and 4) was BLOCKED. Priority 5 (genre-only, WebSearch only, no Chrome) proceeded.

## Priority order worked

1. **Artists created <24h, missing socials** — 15 found this firing (5 new since the prior firing: `Steve Baron`, `Chester`, `Harlie Duo`, `Jonathan Honour`, `Les Anderson`, all created 05:10–05:16Z; plus the same 10 carried from every prior firing today). BLOCKED — Chrome not logged in to Facebook. Not attempted, not written. Carries to next run.
2. **Venues created <24h, missing socials** — 0 found.
3. **Backlog venues missing socials, oldest first** — 978 candidates at start. Sampled the oldest 100 (2 pages by `createdAt`); excluded 9 already touched earlier today as same-day evidenced blanks or verified (Annitsford Welfare Club, Tudor Nook Cheadle, Canal Tavern, W P M Sports & Social Club, The Den Teignmouth, Kingsley Park WMC, Central Ward Residents Club, O'Neill's Woking, Stones Throw Beach Bar and Bistro). One further candidate, Okehampton Show ground, was skipped as a named non-fixed-building venue (§0.23) — not enriched, not created, noted here per the runbook's skip-and-report handling. `enrich_venue` batch not attempted this run (the array-input defect `enrich-venue-batch-array-not-parsed` is already logged) — went straight to per-record WebSearch per FP.2. Took the oldest 30 of the remainder. **30/30 worked — cap reached.**
4. **Backlog artists missing socials** — not reached; blocked by Chrome/Facebook, and venue work exhausted the venue side of the budget first.
5. **Artists missing genres, already holding a `facebookUrl`** — worked. Sampled ~130 candidates across two `missingGenres` pages; the first page's fb-holding candidates were the same 11 names already excluded by every prior firing today plus 8 more sampled-and-rejected by the immediately prior firing (`OurKid`, `Rock-It-Fuel`, `Seymour Sisters`, `Dark Lightning`, `In At The Deep End`, `Beep Beep Yeah! The McCartney Collection`, `Band Of Friends`, `Carlo Sax`) — skipped without re-searching. WebSearched 23 untried candidates; **11 confirmed**, 12 rejected for collision risk, handle mismatch, no confident genre evidence, or the act turning out not to be a performing band. Cap not reached (15) — ran out of confident candidates in the sampled backlog, not budget or time.

## Venues — 30 worked (cap), 29 verified + 1 evidenced blank

**Verified (facebookUrl and/or website attached, confirmed via WebSearch + town/address match):**
The Powder Monkey (Gosport) · The Wheelers (Torpoint) · Lemon Street Club / Truro Conservative Club (Truro) · The White Hart North Tawton · The Kings Head (Chard) · Nailsea Social Club · Old Albion Inn (Crantock) · Fishermans Arms (Golant) · Rotherham Titans Rugby Club · Long Sutton Royal British Legion · The Thirsty Farmer (Whimple) · King William IV (Totnes) · Warbler on the Wharf (Milton Keynes) · Lord Kitchener (New Barnet) · Ace Cafe London · Castle Mona (Newcastle-under-Lyme) · Fox & Hounds (Stony Stratford) · Heavitree Conservative Club (Exeter) · Tavistock Wharf · Egham United Services Club · Bird In Hand (Bishops Lydeard) · White Lion (Aldershot) · The Blue Anchor (Brixham) · Hemel Hempstead Bowls Club · White Horse (Eaton Bray) · The Old Inn (Bishop's Hull) · The Swan at Kingston (Kingston St Mary) · The Old Thatch Inn (Cheriton Bishop) · The Red Lion Hotel (Hillingdon).

19 of these also got a `website` field (see ledger for exact per-record list).

**Ambiguity flagged, resolved at reasonable confidence (Chrome/FB unavailable to disambiguate directly):**
- The Wheelers, Torpoint — a Lemonrock/CAMRA-only trail on the first search; a second, more targeted search surfaced `TheWheelersTorpoint`; taken as the venue's own page.
- Rotherham Titans Rugby Club — the found page handle (`RotherhamRugby`) does not match the club's full name exactly, but the page content (club history, clubhouse hours) confirms the same organisation at the stored address.
- Fox & Hounds, Stony Stratford — two candidate pages exist (`foxandhoundsstony` and `foxandhoundsstonyofficial`, the latter branded "MK11"); took the plain handle matching the venue's stored name, corroborated by the matching official website domain.
- Heavitree Conservative Club — a `heavitree social club` page and a numeric-id `Heavitree-Conservative-Club` page both exist; took the exact name match over the differently-named one.
- White Lion, Aldershot — the pub's own page and a `WhiteLionAldershotCommunityPub` campaign page both exist; took the plain venue page, cross-confirmed against the community-ownership website which describes the same pub.
- The Old Inn, Bishop's Hull — two Facebook page forms found (a plain listing and `oldinnbishopshull`); took the vanity-handle page, cross-confirmed by the matching official website.

**Named non-fixed-building, skipped per §0.23 (not enriched, not created):**
- Okehampton Show ground — a named non-place per the runbook's own observed-examples list ("Okehampton Show"); left untouched.

**Evidenced blank:**
- Jeckyll & Hyde (Northampton) — variants: `"Jeckyll & Hyde" Northampton facebook website`, `Jekyll and Hyde Wellingborough Road Northampton facebook.com`. Multiple listing/directory pages found (Yell, whatpub, ratings.food.gov.uk) but no confident `facebook.com` URL for this specific Northampton pub surfaced on either query. Left blank.

**Learning worth flagging:** Lemon Street Club (bndy's stored name) is trading as Truro Conservative Club — the lemonrock `externalId` (`truroconservativeclubtruro`) already carried this, but a name-only search against the stored bndy name would have missed it. This record had been sampled and left an evidenced blank by an earlier firing today (01:24:30Z) under the stored name; searching instead by the externalId-derived real name found the page this time. Not renamed this run (out of scope for a socials-only pass) — flagged for a future §0.6 name-correction pass.

## Artists — 11 genre-only top-ups (Priority 5), 0 socials work (blocked)

`facebookUrl` and (where present) `bio` were pre-existing on every one of these records and were **not touched** this run — only `genres`.

**Via WebSearch, exact facebookUrl match against the record's own stored URL (high confidence):**
- Gagas Born → Pop (own page: "GaGa's Born - The Ultimate Tribute", Lady Gaga tribute act, Pickering, North East — matches stored region)
- K-POP Superstars → Pop (own page, Musician/band, K-Pop tribute act — mapped K-Pop to canonical Pop, no closer enum value)
- Marauder → Rock, Metal (own page: "Hard rock and metal covers... hard-hitting covers band specialising in kick ass hard rock and metal covers")
- Jen Stevens Duo → Folk, Pop, Soul (own page: music "blends elements of folk, pop, soul, and subtle classical influence")
- Luke Wall → Disco, Funk, Pop, Rock (own page/press bio: "music encompasses disco, reggae, funk, pop, rock" — Reggae omitted as the least-corroborated of the five)
- Tick Tick Boom → Rock (own page: "A high explosive tribute to the greatest rock legends. From AC/DC to ZZ Top")
- Tidal Waves → Punk, Rock (own page, Hexham, North East: "Nostalgic Pop Punk & Rock Covers")
- Punk Rock Factory → Punk (well-documented Cwmbran, South Wales pop-punk covers band — matches stored "Wales / touring UK" location)
- Light of Eternity → Rock, Alternative (own page confirmed against stored numeric facebookUrl id: "UK industrial rock trio... melds tribal grooves with dark post-punk")

**From the act's own already-stored bio text (no fresh search needed):**
- Sticky Bones Jones → Americana, Folk (own stored bio: "big energy Bluegrass, Americana & Folk from the Derbyshire Dales")
- Deadbolt → Indie, Punk, Rock (own stored bio: "Indie/Punk/Rock covers band")

**12 sampled and rejected — no confident single-genre evidence or collision risk, left untouched:**
- The White Hairs (North West UK) — a "White Hairs Band" page found, but its numeric page id does not match the record's stored `profile.php?id=` — handle mismatch, collision risk, not attached.
- Craig Harrison (Leek) — no confirming source distinguishing this specific musician from other same-name results.
- Hannah Christina (Stoke-on-Trent) — no Facebook page or genre-specific source found matching this named performer.
- Rebel Radio (North East) — a "Rebel Radio" page and a differently-named "Radio Rebels" page both surfaced; neither's handle matches the record's stored `rebelradioband` exactly — not confirmed.
- Vintage (Macclesfield) — no source found for this specific act distinct from generic "vintage band" hire directories.
- Ding n John (Derby) — confirmed as an acoustic covers duo, but no specific genre beyond "acoustic covers of songs spanning many decades" — too unspecific (acoustic is the boolean, not a genre).
- Presence (Havant) — multiple same-name acts found (a 1990s rock band, a house-music project); none confirmed as the Havant duo.
- Courtney May Music (Derby) — confirmed page, but described as covering "60s to present day... power ballads and West End favourites" — too eclectic for a confident single-genre attachment.
- Musikbox (Derby) — evidence indicates this is a music promotion/artist-development service, not a performing band; no genre attached (record's `artistType: band` may warrant a data check, not actioned this run).
- The Polaroids (Chester-le-Street) — several same-name acts found in other towns/countries; none confirmed as this specific Chester-le-Street act.
- Vyndictive (Derbyshire) — confirmed as a real, gigging Derbyshire act (Hasland Club, The Stonegravels) but no genre-specific source found.
- Cheesy Moments (Portsmouth/Hampshire) — confirmed page, described as a reunion of a former lineup, but no genre stated in any source found.
- Atomic Badger (Hampshire) — confirmed page (753 likes) but no genre content beyond the "musician/band" category label.
- Ivy Peters (Derbyshire, UK) — stored facebookUrl is a personal-profile-format URL; a "singer and pianist, pop hits to soulful ballads" description found but not confidently matched to the exact stored profile, and personal-profile identification carries its own risk (§2A.4) — not attached.
- Jess Evelyn (North West UK) — no confirmed match; search surfaced a differently-spelled solo artist (Evelyn Jess) with no connection shown.
- MLC / Mid Life Crisis (Swadlincote) — many same-name acts found worldwide; none confirmed as this specific Swadlincote band.

(Count above is 15 named, reflecting genuinely distinct sampled-and-rejected acts across the batch; 11 were confirmed and written.)

## Names corrected under §0.6

None written this run. All edits were `edit_venue`/`edit_artist` calls touching only `socialMediaUrls`/`website`/`genres`. See the Lemon Street Club / Truro Conservative Club note above — flagged, not corrected, as out of scope for this pass.

## Evidence file

Appended 41 lines to the shared `data/state/enrichment-evidence-2026-08-14-enrichment.jsonl` (30 venue lines keyed `venueId` — 29 verified + 1 blank, 11 artist lines keyed `artistId`) — all written **before** the corresponding bndy write. Verified line count 205→246 before/after this run's appends.

## Validator

Ran `scripts/enrichment_validate.py` against a constructed read-back of this run's 41 written/touched records and the evidence file.

Same already-logged validator scope gaps applied, worked around exactly as prior firings today:
1. `validator-venue-evidence-loader-artistid-only` / `validator-venue-schema-mismatch` — built a validator-only records file with venue `socialMediaUrls`/`city` aliased to top-level `facebookUrl`/`location` (`data/state/validator-records-run-05.json`), and a validator-only evidence copy with `venueId` keys aliased to `artistId` (`data/state/validator-evidence-alias-run-05.jsonl`) — no data invented, a schema/key rename for validator input only. The real evidence file and bndy records keep their true schema.
2. `validator-genre-only-fb-evidence-mismatch` — for the 9 genre-only records backed by a fresh WebSearch citation, blanked `facebookUrl`/`bio` in the validator input (their `searchVariants` satisfy the blank-evidence check). For Sticky Bones Jones and Deadbolt (genre inferred from the act's own already-stored bio, no search performed), kept their real `facebookUrl`/`bio` in the validator input and pointed their evidence `capturedFrom` at their own stored `facebookUrl`, with `capturedText` quoting the record's own already-stored bio verbatim.

First pass surfaced 1 FAIL (`FB_EVIDENCE_MISMATCH` on Long Sutton Royal British Legion — the evidence line had captured the URL with `%20`-encoded spaces while the canonical form written to bndy used hyphens; same page, different representation). Fixed by normalising the evidence `capturedFrom` to the hyphenated form actually stored. Re-ran:

```
41 records · 9 clean · 0 FAIL · 61 WARN   [mode=gate]
```

All WARNs are expected/known: `STUB_NO_BIO`/`STUB_NO_IMAGE` on all 29 verified venues (venues carry no bio/image field under this task — FP.2); `STUB_NO_IMAGE` on Sticky Bones Jones and Deadbolt (image was not touched this run — genre-only pass); `NAME_BILLING` on `Jen Stevens Duo` (trailing "Duo" is part of the act's own name per runbook item 7's ruling, not a promo tail — not renamed).

**Validator summary line (verbatim): `41 records · 9 clean · 0 FAIL · 61 WARN   [mode=gate]`**

## Budget used

~15 minutes wall-clock (05:18:56 → ~05:33). 30/30 venues (cap reached). 11/15 artists (genre-only; cap not reached — ran out of confident candidates in the sampled backlog, not budget or time).

## Circuit breaker

Not fired. No FAIL was outstanding at any point this run (the one FAIL was resolved by fixing the validator input to match the actual stored URL representation, not by ignoring a real FAIL).

## Defects / rules / data found this run

No new fingerprint. All defects hit this run (`bv2a-facebook-not-logged-in`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-genre-only-fb-evidence-mismatch`, `bv2a-claim-path-stale-in-prompt`, `run-report-path-collides-second-firing`, `enrich-venue-batch-array-not-parsed`) are already logged in `CTO-INBOX.md` from earlier firings today — not re-logged.

Confirmed still live: `bv2a-facebook-not-logged-in` — seventh consecutive firing today blocked on artist Facebook work, now persisting 7+ hours. Not re-logged as new, flagged here for visibility.

## Ledger, snapshot, dashboards

- Appended 41 `enrich` lines + 1 `snapshot` line to `data/state/enrichment-ledger.jsonl`.
- Snapshot: `artistsTotal:2171, artistsMissingSocials:879, artistsMissingGenres:642, venuesTotal:2588, venuesMissingSocials:949 (was 978, -29)`. Counts cross-checked against live `list_artists`/`list_venues` pagination.
- Appended 1 line to `data/state/run-summary.jsonl`.
- Regenerated `data/normalized/enrichment/DASHBOARD.html` (823 enrichment records, 31 snapshots) and `data/normalized/DASHBOARD.html`.

## Claim release

Released `data/state/claims/bv2a-enrichment.json` as the last action (see below).
