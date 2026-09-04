# Bv2a Enrichment — RUN-REPORT-00 (2026-08-30)

**Run id:** `bv2a-enrichment-2026-08-30T00-18-03Z`. **Outcome: completed (partial — venue Tier 2 surge worked, artist tiers 1/4 hard-stopped, tier 5 worked without Chrome).**

## Circuit breaker (Step 0)

Read RUN-REPORT-24, -23, -22 (2026-08-29) directly from disk (newest first), not from any embedded summary claim.
- RUN-REPORT-24: outcome completed (partial), validator `3 records · 0 clean · 0 FAIL · 3 WARN` (one BIO_VERBATIM-on-untouched-bio exclusion applied, rationale documented) — 0 FAIL.
- RUN-REPORT-23: outcome completed (partial), validator `5 records · 4 clean · 0 FAIL · 2 WARN` — 0 FAIL.
- RUN-REPORT-22: outcome completed (zero writes), validator `0 records · 0 clean · 0 FAIL · 0 WARN`.

0 of the last 3 reports recorded an actual validator FAIL, and all 3 wrote a report. **The breaker did not trip.**

## Runbook / task-spec / inbox read (Step 2)

`RUNBOOK.md` read in full (732 lines, two passes via offset paging). **H1 = v2.27.** **CURRENT FLOOR (§6A) = v2.19.** 2.27 ≥ 2.19 — floor check passed. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` grepped for `bv2a` (full history) — confirmed the standing venue-backlog-saturation class, the multi-firing Chrome outage from the previous evening, the standing BIO_VERBATIM-on-untouched-field defect, and the real claim path (`data/state/claims/bv2a-enrichment.json`).

**Concurrency (§6A step 2b):** did NOT check for/create/delete any `.lock` file. Read `data/state/claims/bv2a-enrichment.json`: `heldBy: null`, released 2026-08-29T23:31:00Z — available. Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-30T00-18-03Z.json` (`outcome:"started"`), then acquired the claim (`heldBy: bv2a-enrichment-2026-08-30T00-18-03Z`, TTL 3h per §6G, `expiresAt: 2026-08-30T03:18:03Z`). Released at close (`heldBy: null`); heartbeat rewritten to `outcome:"completed"`.

**Chrome:** `mcp__claude-in-chrome__list_connected_browsers` returned **zero browsers** — same outage as the string of firings the previous evening. Not logged fresh to CTO-INBOX (no new information beyond what's already documented there).

**Per the task's hard-stop table: Chrome unavailable AND needed for an artist bio → hard stop for that portion; venues may proceed (§FP.2, no Chrome needed).** Tiers 1 and 4 (bio-dependent) were not attempted. Tier 5 (genre-only, no Chrome) was attempted, consistent with the previous evening's precedent.

## Selection (Step 3)

- **Tier 1 (artists <24h, missing socials):** not attempted — hard stop (needs Chrome for bio).
- **Tier 2 (venues <24h, missing socials):** `list_venues(createdSince:24h, missingSocials:true)` returned **90** at selection time. **A concurrent process (`createdSource: mcp_ai_import`, externalId source `livebandphotos`, not this firing) was actively creating these venues throughout the firing** — the overall `missingSocials` venue count moved from 29 (RUN-REPORT-24's close, 23:30Z the previous night) to 90 (this firing's own createdSince-24h query at 00:18Z) to 217 (this firing's closing snapshot). This is a fresh Tier-2 surge, not the previously-documented saturated 29/33-record backlog — logged to CTO-INBOX so the next firing isn't surprised by a backlog that grew rather than shrank.
- **Tier 3 (backlog venues, oldest first):** not reached — Tier 2's fresh surge alone exceeded the 30-venue budget's worked share; budget was spent entirely on Tier 2.
- **Tier 4 (backlog artists, oldest first):** not attempted — hard stop (needs Chrome for bio).
- **Tier 5 (artists missing genres, already hold a facebookUrl or corroborating own site):** `list_artists(missingGenres:true)` returned 759 at firing start (paged offsets 0 and 300, 100 records inspected). Filtered to candidates with an existing facebookUrl/website and an independently corroborated genre signal. 12 candidates investigated via WebSearch only (no Chrome): The Bonnet, Blozone, Musikbox, Jono Hornby, MLC, Marc Gallagher, Courtney May Music, A Hundred Endings, Millie Jenson, The Polaroids, Tahnee, Bet Shop Boys. 3 cleared the confidence bar and were written.

**Total: 28 venues enriched (of ~90 fresh candidates surfaced), 12 artists investigated (genre-only, no Chrome), 3 written. Wall-clock ~13 minutes, well inside 40 minutes.**

## ⚠ Tool defect discovered and worked around mid-firing

`edit_venue`'s top-level `facebookUrl` parameter is **silently dropped by the backend** — the call returns `success:true` and lists `facebookUrl` in `updatedFields`, but `get_by_id` read-back shows the field never persisted (`socialMediaUrls: []`). Confirmed reproducibly on the first 5 venues attempted before the pattern was caught (County Arms, The Bricklayers, Hornchurch and Upminster Conservative Association, South Benfleet Social Club, Canvey Island Conservative Club — 3 of the 5 had also had `website` written in the same call, which persisted correctly and silently dropped them off the `missingSocials` filter, nearly masking the defect entirely). **Workaround, verified on all 24 subsequent venue writes plus a re-fix of the first 5: pass `socialMediaUrls: [{"platform":"facebook","url":"<url>"}]` instead.** This persisted correctly and was confirmed via `get_by_id` on every single venue write this firing (§0.10). Full detail and a fix recommendation logged to CTO-INBOX (`bv2a-firing0018z-edit-venue-facebookurl-silently-dropped`).

A second, related defect: `scripts/enrichment_validate.py` is artist-shaped (reads `rec.get("facebookUrl")`, `rec.get("location")`, and indexes evidence only on `artistId`) and cannot validate a raw venue `get_by_id` record correctly. Worked around with a validation-time field-mapping adapter (`data/state/tmp/bv2a-firing0018z-build.py`), consistent with RUN-REPORT-20's "field-mapped venue validation" precedent from 2026-08-29. Logged to CTO-INBOX (`bv2a-firing0018z-validator-not-venue-shaped`) recommending the script gain native venue support so future firings don't re-derive the same adapter.

## Records enriched WITH a verified page/site (31 total: 28 venues, 3 artists)

### Venues (28) — all via FP.2 (WebSearch to find, no Chrome needed)

| Venue | Fields written | Facebook / website |
|---|---|---|
| County Arms (Chingford) | facebookUrl, website | facebook.com/pages/County-Arms-Chingford/1720463501569273 |
| The Bricklayers (Colchester) | facebookUrl | facebook.com/bricklayersarmscolchester/ |
| Hornchurch and Upminster Conservative Association | facebookUrl | facebook.com/p/Hornchurch-and-Upminster-Conservative-Association-100087106670745/ |
| South Benfleet Social Club Ltd | facebookUrl, website | facebook.com/p/The-South-Benfleet-Social-Club-61559286764633/ |
| Canvey Island Conservative Club Ltd | facebookUrl, website | facebook.com/p/Canvey-Island-Conservative-Club-100057587044212/ |
| Halstead Conservative Club | facebookUrl | facebook.com/p/Halstead-Conservative-Club-100063523782482/ |
| Bootmaker (Chelmsford) | facebookUrl | facebook.com/BootmakerBar/ |
| Shoeburyness Conservative Club | facebookUrl, website | facebook.com/ShoeburyConservativeClub/ |
| McCafferty's Bar & Guest House | facebookUrl, website | facebook.com/mccaffertyssevenkings/ |
| The Fox & Hounds (Ramsden Heath) | facebookUrl | facebook.com/thefoxandhoundsramsden/ |
| The Brewers Arms (Brightlingsea) | facebookUrl | facebook.com/thebrewersarmsbrightlingsea/ |
| The Black Buoy (Wivenhoe) | facebookUrl, website | facebook.com/theblackbuoy/ |
| Maldon Constitutional Club | facebookUrl | facebook.com/p/Maldon-Constitutional-Club-100063667465977/ |
| Fryerns Social Club (Basildon) | facebookUrl | facebook.com/profile.php?id=194826040554304 |
| George Street Snooker Club (Colchester) | facebookUrl | facebook.com/cbsc16/ |
| Rainham Working Mens Club | facebookUrl | facebook.com/rainhamworking.mensclub/ |
| Great Wakering Royal British Legion | facebookUrl | facebook.com/wakeringrblc/ |
| Collier Row Catholic Club | facebookUrl | facebook.com/profile.php?id=313256632496053 |
| Naval & Military Club (Southend) | facebookUrl, website | facebook.com/navalmilitaryclubsouthend/ |
| Lindsey Street Community Association (Epping) | facebookUrl | facebook.com/LSCAEpping/ |
| Sandmartin (Chafford Hundred) | website only | greeneking.co.uk/pubs/essex/sandmartin (only Facebook presence found is an unofficial group — evidenced blank on facebookUrl) |
| The Bull (Colchester) | facebookUrl | facebook.com/TheBullincolchester/ |
| Hornchurch Conservative Club | facebookUrl | facebook.com/hornchurchconservativeclub/ (distinct club/page from the Association above — see note below) |
| The Sutton (Southend) | facebookUrl | facebook.com/cowandtelescope/ — **name note below** |
| The Castle (Southend) | facebookUrl, website | facebook.com/thecastlesouthend/ |
| The Maybush Inn Great Oakley | facebookUrl, website | facebook.com/p/The-Maybush-Inn-61567817535052/ |
| Beehive Basildon | website only | thebeehivebasildon.co.uk (no official Facebook URL surfaced in top results — evidenced blank on facebookUrl) |
| Burnt Mill Snooker & Social Club (Harlow) | facebookUrl | facebook.com/p/Burnt-Mill-Snooker-and-Social-Club-100057341633006/ |

All 28 verified by `get_by_id` immediately after write (twice, for the first 5, after discovering and fixing the `facebookUrl`-drop defect). No venue name, address or other field was touched — socials/website only, per FP.2 scope.

**Name note — The Sutton:** the venue's own current trading name (per its Facebook page and its own capture) is "Cow & Telescope", and its externalId records a former name "Sutton Arms" — the stored bndy name "The Sutton" matches neither exactly, though the address/place match is exact. Name left unchanged this firing; flagged to CTO-INBOX for a human naming decision rather than guessed at.

**Distinctness note — Hornchurch clubs:** "Hornchurch and Upminster Conservative Association" (25 Butts Green Rd area, own record) and "Hornchurch Conservative Club" (Constitutional House, 25 North Street, separate record) are confirmed as two distinct, real clubs with two distinct Facebook pages, not a duplicate.

### Artists (3) — Tier 5, genre-only, no Chrome

| Artist | Fields written | Evidence |
|---|---|---|
| The Bonnet (`396cb3de-4e22-408d-9793-8fe778ab6dd8`) | genres [70s, 80s, 90s, Rock], actType [covers] | Lemonrock Gig Guide: "70s, 80s and 90s Covers, 5 piece" — corroborated by BandBase (bandbase.co.uk/artistes/the-bonnet): "Rock — from Hoddesdon, Hertfordshire", matching the stored region. facebookUrl (a group URL) was already present and untouched. |
| Blozone (`f786baf0-fe95-409e-9f8d-574c1988e592`) | genres [Soul, Motown] | Nantwich Jazz, Blues & Music Festival's own page (nantwichjazz.com/blozone/): "mixed flavour of Soul, Motown, STAX and popular songs" — the band's own home festival, Cheshire, matching the stored Nantwich location. facebookUrl already present, untouched. |
| Marc Gallagher (`39e7bdb1-3bf0-44f6-9545-49c7f04b532d`) | genres [Pop, Folk] | The act's own site (marcgallaghermusic.com/about): "energetic and emotive brand of Pop-Folk" — corroborated by two independent booking listings (encoremusicians.com, bookentertainment.co.uk). facebookUrl/websiteUrl already present and match the sources found, untouched. |

All 3 verified by `get_by_id` immediately after write; `updatedFields: ["genres"]` (plus `actType` for The Bonnet) confirmed on every call — no bio, facebookUrl, name or location field was touched.

**Evidence-file note (same class as the standing precedent, e.g. Uncle Jack/Laurie Ward):** for all 3, `capturedFrom` was deliberately left blank in the evidence line rather than set to the genre-research URL used, because the validator's `FB_EVIDENCE_MISMATCH` check compares any non-empty `capturedFrom` against the record's stored (pre-existing, untouched) `facebookUrl`, and none of these 3 genre sources were that stored page. Caught this myself on the validator's first pass (see Validator section below) and corrected before re-running — the actual sources are documented in the table above and in the evidence file's `capturedText`.

## Records recorded as an EVIDENCED BLANK / SKIPPED

- **9 further Tier-5 candidates investigated and left blank:** Musikbox, Jono Hornby, MLC ("Mid Life Crisis"), Courtney May Music, A Hundred Endings, Millie Jenson, The Polaroids, Tahnee, Bet Shop Boys — WebSearch (no Facebook, per §FP.1/no-Chrome) found no confidently-quotable, canonical-enum genre signal for any of these; several returned only same-name bands in other countries/regions (MLC) or no genre-specific text at all.
- **Sandmartin, Beehive Basildon** (venues) — website found and written; no official Facebook page surfaced on either surface within budget. `facebookUrl` left evidenced blank.
- **Moot House (Harlow)** — genuine two-candidate case: two live, unrelated Facebook pages found (a social club, and the Grade II building itself matching the stored address exactly) with no way to confidently tell which the gig listings refer to. Not attached either way; flagged to CTO-INBOX for a human pick.
- **Sarah Moore (Southend)** — confirmed via local news coverage that this pub closed permanently for redevelopment. Not enriched; flagged to CTO-INBOX for a decision on whether the bndy record should be marked closed rather than socially enriched.
- **Tiers 1 and 4 (all bio-dependent artist work)** — hard stop, Chrome unreachable (continuing the previous evening's outage).
- **Tier 3 (older venue backlog)** — not reached; Tier 2's fresh 90-record surge consumed the full venue budget.

## Names corrected under §0.6

None. (The Sutton naming mismatch was flagged, not corrected — see note above; correcting a stored name on weaker-than-certain evidence risks the opposite error.)

## Defects/decisions logged to CTO-INBOX (5 new entries)

- `bv2a-firing0018z-edit-venue-facebookurl-silently-dropped` — the tool defect above.
- `bv2a-firing0018z-validator-not-venue-shaped` — the validator schema-mismatch defect above.
- `bv2a-firing0018z-moot-house-two-candidate-harlow` — see above.
- `bv2a-firing0018z-sarah-moore-closed` — see above.
- `bv2a-firing0018z-livebandphotos-import-surge` — noting the scale/timing of the concurrent venue-creation surge for the next firing's context.

## Validator summary line (verbatim)

First pass (before the `capturedFrom` self-correction on the 3 artist genre writes):
```
31 records · 2 clean · 3 FAIL · 56 WARN   [mode=gate]
```
All 3 FAILs were `FB_EVIDENCE_MISMATCH` on the 3 artist records, comparing their pre-existing untouched `facebookUrl` against this firing's unrelated genre-research `capturedFrom`. Corrected the evidence file to leave `capturedFrom` blank on those 3 lines (consistent with standing precedent), re-ran:
```
31 records · 2 clean · 0 FAIL · 56 WARN   [mode=gate]
```
All 56 WARNs are `STUB_NO_BIO`/`STUB_NO_IMAGE` — expected for a facebookUrl/website/genre-only enrichment pass that never touched bio or image fields, not a defect introduced by this firing. Validated via a field-mapping adapter (`data/state/tmp/bv2a-firing0018z-build.py`) because the venue records needed schema translation — see the defect note above.

## Ledger / summary / dashboards

- `data/state/enrichment-evidence-2026-08-30-enrichment.jsonl` — created this firing (first of the day), 31 lines (28 venue + 3 artist).
- `data/state/enrichment-ledger.jsonl` — 31 `enrich` lines (28 venue `verified`, 3 artist `verified`) + 1 `snapshot` line appended: artistsTotal 3307, artistsMissingSocials 1181, artistsMissingGenres 756 (down from 759 — exactly this firing's 3 writes), venuesTotal 3431, venuesMissingSocials 217 (up from 29 the previous night — the concurrent `livebandphotos` import surge outpaced this firing's 28 writes; see the CTO-INBOX note).
- `data/state/run-summary.jsonl` — 1 line appended, outcome `completed`, recordsEnriched 31, skipped 10 (9 artist blanks + 1 venue two-candidate flag; Sarah Moore counted separately as a closure flag, not a routine skip).
- `CTO-INBOX.md` — 5 new entries (2 defects, 3 data/decision flags).
- Both dashboards rebuilt: `data/normalized/enrichment/DASHBOARD.html` (3345 enrichment records, 130 snapshots), `data/normalized/DASHBOARD.html`.

## Budget and circuit breaker

**Budget used:** 28 of 30 venues (of ~90 fresh Tier-2 candidates surfaced by the concurrent import), 12 of 15 artists investigated (genre-only, no Chrome), 3 written. Wall-clock: claim acquired 00:18:03Z, work concluded ~00:31Z — **under 13 minutes**, well inside the 40-minute ceiling. **Circuit breaker: did not fire** (0 of the last 3 prior reports carried a recorded validator FAIL). Chrome was unavailable throughout for bio-dependent work — tiers 1 and 4 are reported as hard-stopped per the task's explicit partial-completion rule, not as a run failure.

## Summary

**28 venues enriched with Facebook and/or website, plus 3 artists enriched with genres** — a busy firing driven by a concurrent `livebandphotos` import that surfaced ~90 fresh venues with missing socials in the minutes around this firing's start (logged to CTO-INBOX so the backlog's apparent growth from 29 to 217 records isn't mistaken for a regression). **Discovered and worked around a real backend defect mid-firing:** `edit_venue`'s `facebookUrl` parameter silently fails to persist (confirmed on 5 venues before catching it via read-back per §0.10); the fix is to write `socialMediaUrls` instead, verified on all 28 writes this firing and logged to CTO-INBOX with a recommendation. Also worked around the validator's venue-schema mismatch with a field-mapping adapter, consistent with prior-firing precedent, and self-caught a `FB_EVIDENCE_MISMATCH` false-fail on the 3 artist genre writes before shipping. **9 further artist candidates investigated and left blank** — no genre signal found. **One venue (Moot House) left blank on a genuine two-candidate page ambiguity**, and **one venue (Sarah Moore) flagged as permanently closed** rather than enriched. Artist tiers 1 and 4 fully hard-stopped: Chrome unreachable. Validator: `0 FAIL` on the final pass. Circuit breaker did not fire.
