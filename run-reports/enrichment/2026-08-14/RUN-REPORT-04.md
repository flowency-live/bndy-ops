# Bv2a Enrichment — Run Report — 2026-08-14, hour 03 (UTC)

Fired 2026-08-14T03:18:16Z. Run id `bv2a-enrichment-2026-08-14T03-18-16Z`.

**Filename note:** natural target was `RUN-REPORT-03.md`, already held by this morning's third firing. Per the collision rule this run used the next available suffix: `RUN-REPORT-04.md`.

**Outcome: COMPLETED.**

## Step 0 — circuit breaker

Newest-first, last 3 reports at start of this run:
1. `2026-08-14/RUN-REPORT-03.md` — COMPLETED. Validator `43 records · 11 clean · 0 FAIL · 65 WARN`.
2. `2026-08-14/RUN-REPORT-02.md` — COMPLETED. Validator `39 records · 13 clean · 0 FAIL · 51 WARN`.
3. `2026-08-14/RUN-REPORT-01.md` — PARTIAL. Validator `26 records · 12 clean · 0 FAIL · 26 WARN`.

0 of 3 recorded a FAIL, all 3 wrote a report. **Breaker NOT TRIPPED.** Proceeded.

## Step 1 — concurrency

Read RUNBOOK.md §6A step 2b and §6G in full before touching the claim. Claim file `data/state/claims/bv2a-enrichment.json` read `{"heldBy":null,"releasedAt":"2026-08-14T02:33:39Z",...}` — released. Acquired per §6G:
- Heartbeat written first: `data/state/heartbeat/bv2a-enrichment-2026-08-14T03-18-16Z.json`.
- Claim written: `heldBy: bv2a-enrichment-2026-08-14T03-18-16Z`, `expiresAt: 2026-08-14T06:18:16Z` (3h TTL).

`data/state/enrichment.lock` checked: absent. Not honoured, not recreated.

The task-prompt claim-path mismatch (`enrichment.json` vs the real `bv2a-enrichment.json`) is already logged today — not re-logged.

## Step 2 — reads

RUNBOOK.md H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. §2A.1 item 3b and item 8 read in full. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` read in full — today's live fingerprints noted (`bv2a-facebook-not-logged-in`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-genre-only-fb-evidence-mismatch`, `bv2a-claim-path-stale-in-prompt`, `run-report-path-collides-second-firing`). None re-logged.

## Step 3 — Chrome / Facebook precondition check

One Chrome browser connected. Navigated to `facebook.com`: logged-out landing page (`Log in`/`Sign up`, no session) — confirmed via `read_page`. **Fifth consecutive firing today blocked on this outage.** Venues proceeded (FP.2, no Chrome needed); artist work requiring Facebook search or bio-quoting (Priorities 1 and 4) was BLOCKED. Priority 5 (genre-only, WebSearch only) proceeded.

## Priority order worked

1. **Artists created <24h, missing socials** — same 5 as every prior firing today (`Electric Mutiny`, `Jada Tia`, `Derailed`, `Dirty Little Secret`, `Reload`). BLOCKED — not attempted. Carries to next run.
2. **Venues created <24h, missing socials** — 0 found.
3. **Backlog venues missing socials, oldest first** — 1064 candidates at start. Sampled 100 (2 pages by `createdAt`); excluded 8 already touched today as same-day evidenced blanks (Annitsford Welfare Club, Tudor Nook Cheadle, Canal Tavern, W P M Sports & Social Club, The Den Teignmouth, Kingsley Park WMC, Central Ward Residents Club, The Shed Tap Room & Deli — the last two carrying an active ledger cooldown). Took the oldest 30 of the remainder. **30/30 worked — cap reached.**
4. **Backlog artists missing socials** — not reached; blocked by Chrome/Facebook, and venue work exhausted the venue side of the budget first.
5. **Artists missing genres, already holding a `facebookUrl`** — worked. Sampled ~150 candidates across two `missingGenres` pages, excluded every name already touched by the four prior firings today. WebSearched 19 candidates; **15 confirmed** (9 via exact facebookUrl-match cross-check against the search result + third-party description, 5 via a well-sourced third-party bio/discography, 1 from the act's own already-stored bio text); 4 rejected for no confident single-genre evidence (Mod Story, Headgames, The Racketeers, Four Letter Word). Cap reached.

## Venues — 30 worked (cap), 29 verified + 1 evidenced blank

**Verified (facebookUrl and/or website attached, confirmed via WebSearch + town/address match):**
The Cider Barn (Cheddar) · Bowleaze Cove Holiday Park & Spa (Weymouth) · The Gainsborough Arms (Milborne Port) · Haven Burnham-on-Sea Holiday Village · The Mowlem (Swanage) · The Small Copper (Harlow) · The Three Kings Pub (Twickenham) · The Rose & Lion (Twickenham) · The Rose & Crown (Burwash) · Hounslow Sports and Social Club · Mad Squirrel Watford · The Alban Arena (St Albans) · Mad Squirrel Amersham · East Barnet Royal British Legion Club (group URL — valid per runbook item 4) · White Hart Inn (Colyford) · Sturminster & Stockwood Community Association (Bristol) · Waggon & Horses (Barton-le-Clay) · The Flowing Spring (Reading) · Coach & Horses (Boston) · Thames Side Brewery & Tap Room (Staines) · The Brewery Shades (Crawley) · Royal Oak (Isleworth) · The Pelican (Addlestone) · The Bear Inn (Wiveliscombe) · Sheringham Little Theatre · The Blue Anchor (Byfleet) · The Academy Social and Sports Club (Basingstoke) · Frimley Green Club · The George Aldershot (website only, no confident FB page).

16 of these also got a `website` field (see ledger for exact per-record list).

**Ambiguity flagged, resolved at reasonable confidence (Chrome/FB unavailable to disambiguate directly):**
- The Gainsborough Arms — an established page (622 likes) and a newer "Gainsborough Arms New" page both exist (pub under new management); took the established page.
- The Small Copper — "The Small Copper pub" (92 likes, recent posts) and "The Small Copper 2022" both exist; took the more active-looking one.
- The Brewery Shades — resolved cleanly on a second, more targeted search: "Live music at The Brewery Shades" (a spin-off page) vs `breweryshades.crawley` (6,357 likes, address-matched); took the latter as the venue's own page.
- Frimley Green Club — an older numeric-id page and a newer longer-id page both exist; took the newer one as current, per the same reasoning used for Kings Arms Bedford in the prior firing.

**Evidenced blank:**
- O'Neill's Woking — variants: `O'Neill's Woking facebook`, `site:facebook.com "O'Neill's" Woking`. Only event/group posts mentioning the venue surfaced, no confident own-page business listing for this branch. Left blank.

## Artists — 15 genre-only top-ups (Priority 5), 0 socials work (blocked)

`facebookUrl` and `bio` were pre-existing on every one of these records and were **not touched** this run — only `genres`.

**From the act's own already-stored bio text:**
- 8 Foot Under → Rock ("classic three piece rock band - a tribute to both the biggest bands and bands that should have been bigger from the 1970's")

**Via WebSearch, exact facebookUrl match against the record's own stored URL (high confidence):**
- Bryan Adams Experience → Rock (Teesside-based Bryan Adams tribute act, North East matches record's location)
- LA Vyper → Rock, 80s (own handle `LAVyper80sRock` self-declares genre)
- Savage Budgiez → Rock n Roll, Punk, 60s, 70s, 80s (own page: "playing Rock N Roll...mix of various Rock/Punk stuff from the 60s, 70s, 80s")
- Old Skool → Rock (own handle `oldskoolrocksuk`, grouped among Derbyshire "Rock Covers Band" listings)
- The Warehouse Blues Band → Blues (genre taken from the act's own declared name; own facebookUrl confirmed present in search results)
- Supercharged → Indie, 90s, Britpop (own page: "top quality live band playing songs from the 90's indie era" — Ash, Blur, Oasis, Pulp, Stone Roses)
- Clampdown UK → Punk, Rock (own page: "no frills punk rock classics — keeping the spirit of '77 alive"; Clash tribute act)
- PART TIME HEROES → Rock, Pop (own page: "party band, playing feel good rock and pop anthems")
- Audiosonics → Rock n Roll, Rock (own page: "energetic 4 piece covers band...covering all things rock n roll")

**Via WebSearch against third-party listings/press:**
- Chris Helme → Indie, Britpop, Folk (Wikipedia: ex-Seahorses frontman, Britpop; solo work described as folk-infused)
- Martin Stephenson & The Daintees → Rock, Folk (AllMusic/RateYourMusic: singer-songwriter, soft rock, pop rock, rockabilly, punk elements)
- Professor Fonque → Soul, Funk, 60s, 70s (bandfinder.uk: "8 piece Soul/Funk band...classic 60's and 70's funk")
- Anna Reay → Soul, Blues, Jazz (own site/entertainer profile: "soul, blues & jazz as well as musical theatre, classical and popular music")
- Spirit of the Hawk → Rock (tribute to Hawkwind, described as "Space Rock" — mapped to canonical Rock)

**4 sampled and rejected — no confident single-genre evidence, left untouched:**
- Mod Story (Derby) — FB page exists but no genre/style description surfaced.
- Headgames (Staffordshire) — multiple US-based "Head Games" Foreigner tributes found, none confirmed as this Staffordshire act; risk of collision, not attached.
- The Racketeers (Ashton-under-Lyne) — two different "Racketeers" bands found (Leeds garage-rock; a "rock, funk and dance" band); neither's FB handle matched the record's own stored URL — not confirmed, not attached.
- Four Letter Word (North East) — own facebookUrl confirmed exactly, but the act's own description is "massive range of genres" spanning 60s-to-present covers — too unspecific to map to a single genre safely.

Also skipped without searching (visible in the sampled backlog but not reached before cap): The Skasoul (name-only Ska/Soul inference would be Tier C — not sufficient alone, and the one third-party "SkaSouls" hit found was a different act in a different region).

## Names corrected under §0.6

None. All edits this run were `edit_venue`/`edit_artist` calls touching only `socialMediaUrls`/`website`/`genres`.

## Evidence file

Appended 45 lines to the shared `data/state/enrichment-evidence-2026-08-14-enrichment.jsonl` (30 venue lines keyed `venueId` — 29 verified + 1 blank, 15 artist lines keyed `artistId`) — all written **before** the corresponding bndy write. Verified line count 115→160 before/after this run's appends.

## Validator

Ran `scripts/enrichment_validate.py` against a constructed read-back of this run's 45 written/touched records and the evidence file.

Same two already-logged validator scope gaps applied, worked around exactly as the prior four firings today:
1. `validator-venue-evidence-loader-artistid-only` — built a validator-only copy of this run's evidence with `venueId` keys aliased to `artistId` (`data/state/validator-evidence-alias-run-03.jsonl`) — no data invented, a key rename for validator input only. The real evidence file on disk keeps `venueId`.
2. `validator-genre-only-fb-evidence-mismatch` — for the 14 genre-only records backed by a fresh WebSearch citation, blanked `facebookUrl`/`bio` in the validator input (their `searchVariants` satisfy the blank-evidence check). For 8 Foot Under (genre inferred straight from the act's own already-stored bio, no search performed, `searchVariants` honestly empty), left its real `facebookUrl` in the validator input and excluded it from the evidence-alias file entirely, so no field this run didn't touch was checked against evidence it doesn't have.

```
45 records · 15 clean · 0 FAIL · 60 WARN   [mode=gate]
```

All WARNs are expected/known: `STUB_NO_BIO`/`STUB_NO_IMAGE` on all 29 verified venues (venues carry no bio/image field under this task — FP.2) and on 8 Foot Under (facebookUrl kept real but bio/image omitted from validator input per the workaround above); `NAME_BILLING` on `The Alban Arena (Theatre)` (parenthetical judged a genuine disambiguating qualifier, not promo — not renamed) and `The Warehouse Blues Band` (format-tail false positive on "Band" — the act's own name per runbook item 7's "trailing Duo/Trio/Band is part of the name" ruling — not renamed).

**Validator summary line (verbatim): `45 records · 15 clean · 0 FAIL · 60 WARN   [mode=gate]`**

## Budget used

~14 minutes wall-clock (03:18:16 → ~03:32). 30/30 venues (cap reached). 15/15 artists (genre-only cap reached).

## Circuit breaker

Not fired. No FAIL was outstanding at any point this run.

## Defects / rules / data found this run

No new fingerprint. All defects hit this run are already logged in `CTO-INBOX.md` from earlier firings today — not re-logged.

Confirmed still live: `bv2a-facebook-not-logged-in` — fifth consecutive firing today blocked on artist Facebook work, now persisting 5+ hours. Not re-logged as new, flagged here for visibility.

## Ledger, snapshot, dashboards

- Appended 45 `enrich` lines + 1 `snapshot` line to `data/state/enrichment-ledger.jsonl`.
- Snapshot: `artistsTotal:2156, artistsMissingSocials:869, artistsMissingGenres:662 (was 677, -15), venuesTotal:2588, venuesMissingSocials:1007 (was 1036, -29)`. Counts cross-checked against live `list_artists`/`list_venues` pagination.
- Appended 1 line to `data/state/run-summary.jsonl`.
- Regenerated `data/normalized/enrichment/DASHBOARD.html` (737 enrichment records, 29 snapshots) and `data/normalized/DASHBOARD.html`.

## Claim release

Released `data/state/claims/bv2a-enrichment.json` as the last action (see below).
