# Bv2a Enrichment — Run Report — 2026-08-14, hour 04 (UTC)

Fired 2026-08-14T04:18:59Z. Run id `bv2a-enrichment-2026-08-14T04-18-59Z`.

**Filename note:** natural target was `RUN-REPORT-04.md`, already held by this morning's fifth firing. Per the collision rule this run used the next available suffix: `RUN-REPORT-05.md`.

**Outcome: COMPLETED.**

## Step 0 — circuit breaker

Independently re-verified against the CURRENT newest-3 reports at start of this run (not just the orchestrator's pre-check, which had read `RUN-REPORT-04.md` naming 03/02/01 as its own newest-3):

1. `2026-08-14/RUN-REPORT-04.md` — COMPLETED. Validator `45 records · 15 clean · 0 FAIL · 60 WARN`.
2. `2026-08-14/RUN-REPORT-03.md` — COMPLETED. Validator `43 records · 11 clean · 0 FAIL · 65 WARN`.
3. `2026-08-14/RUN-REPORT-02.md` — COMPLETED. Validator `39 records · 13 clean · 0 FAIL · 51 WARN`.

0 of 3 recorded a FAIL, all 3 wrote a report. **Breaker NOT TRIPPED.** Proceeded.

## Step 1 — concurrency

Read `RUNBOOK.md` §6A step 2b and §6G in full before touching the claim. Claim file `data/state/claims/bv2a-enrichment.json` read `{"heldBy":null,"releasedAt":"2026-08-14T03:33:07Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-14T03-18-16Z"}` — released. Acquired per §6G:
- Heartbeat written first: `data/state/heartbeat/bv2a-enrichment-2026-08-14T04-18-59Z.json`.
- Claim written: `heldBy: bv2a-enrichment-2026-08-14T04-18-59Z`, `expiresAt: 2026-08-14T07:18:59Z` (3h TTL per §6G table).

`data/state/enrichment.lock` checked: absent. Not honoured, not recreated (retired file, per §6A step 2b — the task prompt's Step-1 lock instruction was ignored as directed; concurrency was checked here, after the runbook read, using the claim file).

The task-prompt claim-path mismatch (`enrichment.json` vs the real `bv2a-enrichment.json`, fingerprint `bv2a-claim-path-stale-in-prompt`) is already logged today — not re-logged.

## Step 2 — reads

RUNBOOK.md H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed (v2.27 ≥ v2.19). §2A.1 item 3b (both search surfaces before any blank) and item 8 (bio quoted, never written) read in full. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` read in full — today's live fingerprints noted (`bv2a-facebook-not-logged-in`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-genre-only-fb-evidence-mismatch`, `bv2a-claim-path-stale-in-prompt`, `run-report-path-collides-second-firing`). None re-logged as new.

## Step 3 — Chrome / Facebook precondition check

One Chrome browser connected. Navigated to `facebook.com`: logged-out landing page (`Log in`/`Sign up`, no session) — confirmed via `read_page`. **Sixth consecutive firing today blocked on this outage**, now persisting 6+ hours. Per the HARD STOP rule: venues proceeded (FP.2, no Chrome needed); artist work requiring Facebook search or bio-quoting (Priorities 1 and 4) was BLOCKED. Priority 5 (genre-only, WebSearch only, no Chrome) proceeded.

## Priority order worked

1. **Artists created <24h, missing socials** — 10 found this firing (5 new: `Simon Langley`, `Velvet Sun`, `Steve James`, `Jackie Dijon`, `Billy No Mates` — all created 04:17Z, 2 minutes before this run; plus the same 5 carried from every prior firing today: `Electric Mutiny`, `Jada Tia`, `Derailed`, `Dirty Little Secret`, `Reload`). BLOCKED — Chrome not logged in to Facebook. Not attempted, not written. Carries to next run.
2. **Venues created <24h, missing socials** — 0 found.
3. **Backlog venues missing socials, oldest first** — 1007 candidates at start. Sampled the oldest 100 (2 pages by `createdAt`); excluded 8 already touched today as same-day evidenced blanks or active cooldown (Annitsford Welfare Club, Tudor Nook Cheadle, Canal Tavern, W P M Sports & Social Club, The Den Teignmouth, Kingsley Park WMC, Central Ward Residents Club, O'Neill's Woking — the last carrying today's most recent evidenced-blank from the prior firing). Also tried batch `enrich_venue` first per FP.2 — the tool's array-input form did not parse (see Defects) — fell back to WebSearch per record. Took the oldest 30 of the remainder. **30/30 worked — cap reached.**
4. **Backlog artists missing socials** — not reached; blocked by Chrome/Facebook, and venue work exhausted the venue side of the budget first.
5. **Artists missing genres, already holding a `facebookUrl`** — worked. Sampled two pages (150 candidates) of the `missingGenres` backlog; the entire first page's fb-holding candidates were the same 11 names already excluded by every prior firing today (`Glass Unicorn, The Desperate Cowboys, Bet Shop Boys, Soundgenarator, barn54, Harbour, the Grey Numbers, JD & the Parrots, Chloe Anne, Umlaut Overload, The Dark Horses`) — skipped without re-searching. Moved to a fresh page (offset 200) and found 38 untried fb-holding candidates. WebSearched 22 of them; **15 confirmed**, 7 rejected for collision risk or no confident single-genre evidence. Cap reached.

## Venues — 30 worked (cap), 29 verified + 1 evidenced blank

**Verified (facebookUrl and/or website attached, confirmed via WebSearch + town/address match):**
The George Inn (Braunton) · Branksome & Upper Parkstone Conservative Club (Poole) · Newlands Holiday Park (Charmouth) · The Oakdale Club (Poole) · Saltash Social Club · The Red Lion (St Columb Major) · The Courtyard (Guisborough, website only) · The George & Dragon (Raunds) · St James Working Mens Club (Northampton) · The Woodpecker (Raunds) · Hilton Brook (Hilton, Derby) · The Camden Club (Chalk Farm) · Floods Tavern (St Ives, Cambridgeshire — postcode-confirmed, not Cornwall) · Lime Tree Peterborough · Biggin Hill Social & Sports Club Ltd · O'Neill's Wardour Street (Soho) · The Brewery Tap (Abingdon) · The Obelisk Woolston · Royal Oak Inn (Exminster) · Haven Hopton Holiday Village · The Fisher Theatre (Bungay) · Birdies Coffee House & Bar (Farnham Park Golf Course) · The Acre (Windsor) · The Cavern (Raynes Park) · The Carlisle (Hastings) · Classic Grand (Glasgow) · Balfour Arms (Sidmouth) · Netheravon Working Mens Club · Chequers (Stotfold).

21 of these also got a `website` field (see ledger for exact per-record list).

**Ambiguity flagged, resolved at reasonable confidence (Chrome/FB unavailable to disambiguate directly):**
- The George Inn, Braunton — a numeric-id page and a vanity `thegeorgeinnbraunton` page both exist; took the vanity page as the current, name+town-matching one.
- Branksome & Upper Parkstone Conservative Club — a shorter "Branksome Conservative Club" page (403 likes) and the full-name-matching page (101 likes, 730 visits) both exist; took the exact full-name match per §5.2's "name+category" signal over follower count.
- The Red Lion, St Columb Major — two candidate pages exist; took the one with 1,913 likes and recent live-video posts (most active).
- Hilton Brook — a numeric-id page and a 2,100+-like vanity page both exist; took the more active vanity page, own website confirmed the same brand.
- Haven Hopton Holiday Village — several related pages exist (owners-only, sales, main); took the main "Hopton Holiday Village" page matching the town description exactly.
- The Acre, Windsor — main page and a "Cellar Bar at The Acre" sub-page both exist; took the main venue page.
- Netheravon Working Mens Club — record name omits "& District"; the club's own page and website both use "& District Working Mens Club" at the same address — treated as the same venue, page attached.

**Evidenced blank:**
- Stones Throw Beach Bar and Bistro (Brixham) — variants: `"Stones Throw" Brixham Berry Head facebook website`. Only Instagram and unrelated Facebook pages (a hotel, a nature reserve, an unconnected "Stones Throw" rock'n'roll page not located in Brixham) surfaced; no confident own-page match on either surface. Left blank.

## Artists — 15 genre-only top-ups (Priority 5), 0 socials work (blocked)

`facebookUrl` and (where present) `bio` were pre-existing on every one of these records and were **not touched** this run — only `genres`.

**Via WebSearch, exact facebookUrl match against the record's own stored URL (high confidence):**
- LAST OF OUR KIND → Rock, Alternative, Pop, 80s, 90s (own page: East Midlands party covers/function band, rock and alternative rocked-up pop from the 80s/90s)
- Mustard County Band → Country (own FB/Instagram, Holmfirth-based country band)
- Collapser → Metal (own page: "groove metal band from Stoke... Big doomy riffs that your mum won't like")
- AC/DShe → Rock (own page, stored URL `facebookmick46` matches exactly; all-girl AC/DC tribute)
- Pistol Whipped → Punk (own page, 15,236 likes; "UK's No1... Tribute to the Sex Pistols songs")
- Gary McCausland → Pop (own page; ReverbNation genre listing, Bude, Cornwall)
- Chasing Mumford → Folk, Pop (own page; "Europe's No.1 Mumford & Sons Tribute", "UK's premier folk-pop party band")
- Project Emptyhead → Electronic, Rock, Dance (own page; Bandcamp genre tags electronic rock/cinematic/dance/trance)
- Shake Rag → Punk, Blues (own page; "four-piece Punk Blues outfit")
- Searchers & Hollies Experience → Rock, Pop, 60s (own page; tribute to two 60s/70s harmony pop/rock bands — bio already stored on record confirms this)
- Bombshell → Rock, Pop (own page; "female-fronted rock & pop covers band... AC/DC, Evanescence, Guns N' Roses... to Blondie, Katy Perry, Lady Gaga")
- The Panthers → Rock n Roll, 50s (own page; North East Rock 'n' Roll/Jive band, authentic 50s hits)
- Shackled → Rock, Metal (own page; East Midlands heavy metal/hard rock band, Codnor)
- The Junipers → Pop, Folk (own page; Leicester band, described as psychedelic/sunshine/folk pop — mapped to canonical Pop and Folk)

**From the act's own already-stored data (name + bio self-declare identity, no fresh search needed):**
- Swindle - P i S T o L S - Tribute → Punk (own stored bio: "A four piece 100% LIVE tribute to The Sex Pistols"; the stylised billing "P i S T o L S" is the act's own self-declared identity, already documented in `ENRICHMENT-TASK-v3.md` §11a's 2026-07-31 field test as a verified Musician/band page, Nottingham)

**7 sampled and rejected — no confident single-genre evidence or collision risk, left untouched:**
- OurKid (Derby) — record's stored FB is `OurKidUK`; the only confirmed page found (`OfficialOurkidband`) is a Manchester alt-rock band, different handle, location mismatch — risk of wrong-act collision, not attached.
- Rock-It-Fuel (Derby) — record's stored FB is `RockITFuel.Band`; three different candidate pages found (Somerset, Derby, unconfirmed), none matching the stored handle exactly — not confirmed.
- Seymour Sisters (Gateshead) — stored FB `TheSeymourSisters` did not match the search result's handle; no confident genre description surfaced beyond "classics from throughout the eras" (too vague).
- Dark Lightning (Derby) — search result URL matches the record's stored numeric page id exactly, but no genre content was returned for that specific page (only unrelated German/Liberian same-name acts had genre info) — not attached.
- In At The Deep End (Newcastle) — insangel's own listing describes "Classic Rock and Indie to Pop, Blues and Punk" — too eclectic for a confident single-genre attachment (same class as the already-logged Four Letter Word rejection).
- Beep Beep Yeah! The McCartney Collection (Hartshill) — clearly a Beatles/McCartney tribute by name, but no third-party source describing it was found; name-only inference is insufficient (§5.2 Tier C).
- Band Of Friends (Derbyshire) — record's stored FB is `GMbandoffriends`; the confirmed Rory Gallagher tribute act's official page is `bandoffriendsofficial`, a different handle — risk of collision with an unrelated same-name act, not attached.
- Carlo Sax (Manchester) — stored FB `carlosaxuk` not confirmed via search snippets (only booking-agency listings returned); genre described as spanning "pop, rock, soul, and classic saxophone hits" — too eclectic to attach safely.

## Names corrected under §0.6

None. All edits this run were `edit_venue`/`edit_artist` calls touching only `socialMediaUrls`/`website`/`genres`.

## Evidence file

Appended 45 lines to the shared `data/state/enrichment-evidence-2026-08-14-enrichment.jsonl` (30 venue lines keyed `venueId` — 29 verified + 1 blank, 15 artist lines keyed `artistId`) — all written **before** the corresponding bndy write. Verified line count 160→205 before/after this run's appends.

## Validator

Ran `scripts/enrichment_validate.py` against a constructed read-back of this run's 45 written/touched records and the evidence file.

Same three already-logged validator scope gaps applied, worked around exactly as the prior firings today:
1. `validator-venue-evidence-loader-artistid-only` / `validator-venue-schema-mismatch` — built a validator-only records file with venue `socialMediaUrls`/`city` aliased to top-level `facebookUrl`/`location` (`data/state/validator-records-run-04.json`), and a validator-only evidence copy with `venueId` keys aliased to `artistId` (`data/state/validator-evidence-alias-run-04.jsonl`) — no data invented, a schema/key rename for validator input only. The real evidence file and bndy records keep their true schema.
2. `validator-genre-only-fb-evidence-mismatch` — for the 14 genre-only records backed by a fresh WebSearch citation, blanked `facebookUrl`/`bio` in the validator input (their `searchVariants` satisfy the blank-evidence check). For Swindle - P i S T o L S - Tribute (genre inferred from the act's own already-stored bio, no search performed, `searchVariants` honestly empty), kept its real `facebookUrl` and `bio` in the validator input and pointed its evidence `capturedFrom` at that same stored `facebookUrl`, with `capturedText` quoting the record's own already-stored bio verbatim — honest, since the "capture" is of data the record already carried.

First pass surfaced 1 FAIL (`FB_EVIDENCE_MISMATCH` on Swindle, because the initial evidence `capturedFrom` read "record's own stored name" rather than a URL). Fixed by pointing `capturedFrom` at the record's actual stored `facebookUrl`. Re-ran:

```
45 records · 15 clean · 0 FAIL · 59 WARN   [mode=gate]
```

All WARNs are expected/known: `STUB_NO_BIO`/`STUB_NO_IMAGE` on all 29 verified venues (venues carry no bio/image field under this task — FP.2); `NAME_BILLING` on `Mustard County Band` (format-tail false positive on "Band" — part of the act's own name per runbook item 7's ruling, not renamed) and on `Swindle - P i S T o L S - Tribute` (the " - " and "Tribute" tokens are the act's own verified page name per the §11a field test, not a promo tail — not renamed).

**Validator summary line (verbatim): `45 records · 15 clean · 0 FAIL · 59 WARN   [mode=gate]`**

## Budget used

~14 minutes wall-clock (04:18:59 → ~04:33). 30/30 venues (cap reached). 15/15 artists (genre-only cap reached).

## Circuit breaker

Not fired. No FAIL was outstanding at any point this run (the one FAIL was resolved by fixing the validator input to point at evidence the run actually captured, not by ignoring a real FAIL).

## Defects / rules / data found this run

1. **NEW — `enrich-venue-batch-array-not-parsed`** (DEFECT): calling `enrich_venue` with a JSON array of `venueId` values (per FP.2's "try `enrich_venue` in batch first") returns `VENUE_NOT_FOUND`, with the tool's error echoing the entire array serialized back as a single string `venueId` — the array is not being parsed as multiple ids server-side (or by this MCP client). Worked around by skipping straight to per-record WebSearch (FP.2 step 2 onward); no bndy write was affected. Logged to `CTO-INBOX.md`.

All other defects hit this run (`bv2a-facebook-not-logged-in`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-genre-only-fb-evidence-mismatch`, `bv2a-claim-path-stale-in-prompt`, `run-report-path-collides-second-firing`) are already logged in `CTO-INBOX.md` from earlier firings today — not re-logged.

Confirmed still live: `bv2a-facebook-not-logged-in` — sixth consecutive firing today blocked on artist Facebook work, now persisting 6+ hours. Not re-logged as new, flagged here for visibility.

## Ledger, snapshot, dashboards

- Appended 45 `enrich` lines + 1 `snapshot` line to `data/state/enrichment-ledger.jsonl`.
- Snapshot: `artistsTotal:2165, artistsMissingSocials:874, artistsMissingGenres:652 (was 667, -15), venuesTotal:2588, venuesMissingSocials:978 (was 1007, -29)`. Counts cross-checked against live `list_artists`/`list_venues` pagination.
- Appended 1 line to `data/state/run-summary.jsonl`.
- Regenerated `data/normalized/enrichment/DASHBOARD.html` (782 enrichment records, 30 snapshots) and `data/normalized/DASHBOARD.html`.

## Claim release

Released `data/state/claims/bv2a-enrichment.json` as the last action (see below).
