# Bv2a Enrichment — RUN-REPORT-09

Run id: `bv2a-enrichment-2026-08-30T09-18-46Z`. Outcome: completed (partial). Venues worked in full under FP.2. Artist tiers 1/2/4 hard-stopped on Chrome. Tier 5 (genre-only) skipped this firing — see Step 3.

## Step 0 — circuit breaker

- RUN-REPORT-08 (2026-08-30, 08:19Z): outcome completed (partial). Validator `24 records · 5 clean · 0 FAIL · 38 WARN`. 0 FAIL.
- RUN-REPORT-07 (2026-08-30, 07:18Z): outcome completed (partial). Validator `32 records · 3 clean · 0 FAIL · 52 WARN` after excluding one standing false positive (Shaun Chipp). 0 FAIL on the shipped pass.
- RUN-REPORT-06 (2026-08-30, 06:17Z): outcome completed (partial). Validator `27 records · 0 clean · 0 FAIL · 56 WARN`. 0 FAIL.

0 of the last 3 reports carried a recorded validator FAIL on their shipped pass. All 3 wrote a report. **The breaker did not trip.**

## Step 1/2 — runbook, task spec, floor

`RUNBOOK.md` read in full. H1 = v2.27. CURRENT FLOOR (§6A) = v2.19. 2.27 ≥ 2.19. Floor check passed.

`ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail read for standing `bv2a-*` fingerprints: the `edit_venue` `facebookUrl` silent-drop defect (workaround: `socialMediaUrls`), the `createdSince:"24h"` string-not-parsed defect (worked around with an explicit ISO cutoff), the validator venue-shape gap and its field-mapping adapter, the `FB_EVIDENCE_MISMATCH`-on-display-string false-positive class, the `BIO_VERBATIM`-on-untouched-bio false-positive class (open ruling request, still unresolved), the standing identity-mismatch flags (Body Factory Gym/Paringdon, Spaces Studio, Astor Hall, Decade of Dance, King Kurt Pudding Party — none re-touched this firing), and the standing Chrome outage.

## Step 2b — concurrency

`data\state\enrichment.lock` not honoured, not recreated, per v2.14. Prior claim on `data\state\claims\bv2a-enrichment.json` read `{"heldBy":null,"releasedAt":"2026-08-30T08:32:00Z", ...}` — released. Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-30T09-18-46Z.json` (`outcome:"started"`), then acquired the claim (TTL 3h, `expiresAt: 2026-08-30T12:18:46Z`). Released at close (this report's write).

## Step 3 — tool check and work

`bndy-events` MCP tools reachable. `WebSearch` reachable. **Chrome unreachable**: `list_connected_browsers` returned zero. Per the task's HARD STOPS, venues proceeded (FP.2 needs no Chrome); artist tiers 1/2/4 (identity check or bio quote required) did not.

Tier 5 (genre-only, already-linked artists) was queried (`list_artists(missingGenres:true)`) but **not worked this firing**: the returned page's facebookUrl-holding candidates (Glass Unicorn, The Currants, BNJY, The Desperate Cowboys, Bet Shop Boys, Soundgenarator, Rob Hunt, The Humanitarians) are the identical set RUN-REPORT-08 investigated one firing ago with 0 genre writes — re-running the same candidates against the same low-yield lane (standing finding `bv2a-firing0617z-tier5-genre-webSearch-low-yield`) was judged not a good use of budget this firing. Not a hard stop; a scope decision, logged here.

**30 venues investigated under FP.2** (`WebSearch: "<venue>" <town> pub facebook website`), selected from `list_venues(missingSocials:true)` — a mix of fresh Tier-2 backlog from the 2026-08-30 `livebandphotos` import surge and older backlog, skipping venues already flagged non-fixed-identity (parks/beaches/nature reserves/showgrounds/carnivals) or already carrying a standing identity-mismatch flag (Body Factory Gym, Astor Hall, Decade of Dance).

**19 verified writes** (facebookUrl and/or website, `socialMediaUrls` workaround for Facebook per the standing defect):

| Venue | Fields | Evidence |
|---|---|---|
| Enfield Town Club | website | enfieldtownclub.com — exact name match |
| The Royal British Legion (Beeston) | facebookUrl | address match (16 Hall Croft) |
| The Social (Leytonstone Ex-Servicemen's Club) | facebookUrl | exact name match, sole page |
| The George Cavendish | facebookUrl, website | exact address match, 2,487 likes |
| The Cricketers (Westcliff) | facebookUrl | page name includes town |
| The Rose and Crown (Bishops Stortford) | facebookUrl (group) | exact address match |
| Sundon Park Social Club | facebookUrl, website | exact address match |
| The Glenn Social & Sports | facebookUrl | exact address match |
| Dartford Working Mens Club | facebookUrl | exact name match, sole current page |
| Ekco Social and Sports Club Association | facebookUrl, website | exact address match |
| The Catherine Wheel (Albury) | facebookUrl, website | exact address match |
| United Service Club (Chingford) | facebookUrl, website | exact address match |
| The Wishing Well (Hayes) | website | vanity domain matches name+town |
| The Greyhound (Stratford) | facebookUrl | exact address match |
| North Street Tavern (Sudbury) | facebookUrl | exact address match |
| Royal British Legion - Becontree | facebookUrl | address-term match ("Becontree Ave") |
| The Black Horse Inn (Ipswich) | facebookUrl | exact address match |
| The Half Moon (Bishops Stortford) | facebookUrl | exact address match, 3,672 likes |
| The Royal British Legion (Upminster) | facebookUrl | exact address match, existing externalId corroborates |

**12 evidenced blanks** (both-surfaces search discipline applied; blank beats wrong):
- Three Horseshoes, Bures — two competing Facebook pages found, no way to confirm which is live without Chrome. Ambiguous, flagged.
- Market Place, Burton upon Trent — reconfirmed prior evidenced blank (public square, no own page).
- The Cock Inn, Hadleigh — FB presence confirmed to exist by third-party listings but no direct URL surfaced.
- The Link Social Club, Harlow — no venue-specific Page URL found, only event/group posts.
- Hayfield Club — no single clear candidate among several distinct Hayfield clubs.
- George Woodford (The George, South Woodford) — FB page referenced but URL not surfaced.
- White Lodge, Stafford — only candidate found is a different White Lodge (Great Haywood campsite). Wrong location, rejected.
- Darcy's, Stoke-on-Trent — FB presence confirmed to exist but no direct URL surfaced.
- Swan and Hedgehog Inn, Ipswich — only event pages found, no official Page URL.
- The Tannery, Derby — no FB URL surfaced (newly opened taproom, June 2026).
- Sola Bar & Kitchen, Dawlish Warren — possible rename from Warren Bridge Inn, no confirmed current official page.
- The Three Wishes, Edgware — no official Page URL surfaced.

## Step 4 — validate. Non-negotiable.

Venues validated via the standing field-mapping adapter (`data/state/tmp/bv2a-firing0918z-build.py` + `bv2a-firing0918z-evidence-aliased.jsonl`, `venueId`→`artistId`), consistent with the RUN-REPORT-06/-07/-08 precedent.

```
31 records · 14 clean · 0 FAIL · 36 WARN   [mode=gate]
```

All 36 WARNs are `STUB_NO_BIO`/`STUB_NO_IMAGE` (expected and correct — venues carry no bio/image field under FP.2) plus 2 `NAME_BILLING` WARNs on pre-existing venue names this firing did not create or touch (The Social (Leytonstone...) parenthetical; Royal British Legion - Becontree's ` - `). **0 FAIL.**

## Step 5 — ledger, summary, dashboards

19 lines appended to `data/state/enrichment-ledger.jsonl`, plus one snapshot line: `artistsTotal:3420, artistsMissingSocials:1294, artistsMissingGenres:834, venuesTotal:3471, venuesMissingSocials:45` (down from 64 at firing start — confirms all 19 writes persisted). One line appended to `data/state/run-summary.jsonl`. Both dashboards regenerated (`data/normalized/enrichment/DASHBOARD.html`, `data/normalized/DASHBOARD.html`).

## Budget and circuit breaker

30 venues investigated (cap), 0 artists (tier 5 explicitly skipped as a scope decision, not a hard stop — see Step 3). Elapsed well under the 40-minute cap. Circuit breaker did not fire.

## Open items for CTO-INBOX

- Three Horseshoes, Bures — two competing Facebook pages, needs a human pick (or a future Chrome-available firing to visit both).
- The standing `BIO_VERBATIM`-on-untouched-bio ruling request (from `bv2a-circuit-breaker-tripped-firing1519z`) remains open and unresolved.
- Tier 5 (genre-only) remains low-yield without Chrome and was skipped rather than re-investigating the same 0-yield candidate set; a future firing should advance the `list_artists` offset rather than re-querying page 0.
