# Bv2a Enrichment — RUN-REPORT-10

Run id: `bv2a-enrichment-2026-08-30T10-19-25Z`. Outcome: completed (partial). Venues worked in full under FP.2. Artist tiers 1/2/4 hard-stopped on Chrome; tier 5 investigated at two fresh offsets and confirmed exhausted.

## Step 0 — circuit breaker

- RUN-REPORT-09 (2026-08-30, 09:18Z): outcome completed (partial). Validator `31 records · 14 clean · 0 FAIL · 36 WARN`. 0 FAIL.
- RUN-REPORT-08 (2026-08-30, 08:19Z): outcome completed (partial). Validator `24 records · 5 clean · 0 FAIL · 38 WARN`. 0 FAIL.
- RUN-REPORT-07 (2026-08-30, 07:18Z): outcome completed (partial). Validator `32 records · 3 clean · 0 FAIL · 52 WARN` after excluding one standing false positive (Shaun Chipp). 0 FAIL on the shipped pass.

0 of the last 3 reports carried a recorded validator FAIL on their shipped pass. All 3 wrote a report. **The breaker did not trip.**

## Step 1/2 — runbook, task spec, floor

`RUNBOOK.md` read in full. H1 = v2.27. CURRENT FLOOR (§6A) = v2.19. 2.27 ≥ 2.19. Floor check passed.

`ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail read for standing `bv2a-*` fingerprints: the `edit_venue` `facebookUrl` silent-drop defect (workaround: `socialMediaUrls` — used throughout this firing, verified persisting on every read-back), the `createdSince:"24h"` string-not-parsed defect (worked around with an explicit ISO cutoff, `2026-08-29T10:19:25Z`), the validator venue-shape gap and its field-mapping adapter, the `FB_EVIDENCE_MISMATCH`-on-display-string false-positive class, the `BIO_VERBATIM`-on-untouched-bio open ruling request (not triggered this firing — no artist bios touched), the standing identity-mismatch flags (Body Factory Gym/Paringdon, Spaces Studio, Astor Hall, Decade of Dance, King Kurt Pudding Party — none re-touched), and the standing Chrome outage.

## Step 2b — concurrency

`data\state\enrichment.lock` not honoured, not recreated, per v2.14. Prior claim on `data\state\claims\bv2a-enrichment.json` read `{"heldBy":null,"releasedAt":"2026-08-30T09:26:07Z", ...}` — released. Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-30T10-19-25Z.json` (`outcome:"started"`), then acquired the claim (TTL 3h, `expiresAt: 2026-08-30T13:19:25Z`). Released at close (this report's write).

## Step 3 — tool check and work

`bndy-events` MCP tools reachable (verified with a light `list_venues` call). `WebSearch` reachable. **Chrome unreachable**: `list_connected_browsers` returned zero, consistent with every firing today. Per the task's HARD STOPS, venues proceeded (FP.2 needs no Chrome); artist tiers 1/2/4 (identity check or bio quote required) did not.

**Tier 1/2 (created-in-last-24h, missing socials):** `list_venues(createdSince:"2026-08-29T10:19:25Z", missingSocials:true)` returned 35. `list_artists` with the same cutoff was not queried this firing — Chrome-gated tiers 1/4 remain hard-stopped regardless of count, per every prior firing today.

**28 venues investigated under FP.2**, all fresh — the 7 already flagged this morning (Three Horseshoes, George Woodford, Body Factory Gym, Swan and Hedgehog Inn, The Cock Inn Hadleigh, The Link Social Club, The Three Wishes Edgware) were skipped rather than re-searched, since nothing has changed since RUN-REPORT-08/09 confirmed them.

**22 verified writes** (facebookUrl and/or website; `socialMediaUrls` workaround used for every Facebook write per the standing defect, and confirmed persisting on `get_by_id` read-back in every case):

| Venue | Fields | Evidence |
|---|---|---|
| The White Hart Hotel Newmarket | facebookUrl, website | exact name+town match |
| Stansted Mountfitchet Social Club | facebookUrl, website | exact match, corroborated by own site smsc.uk.com |
| Cambridge City Football Club | facebookUrl, website | exact name match, 5,419 likes (club is Sawston-based, trades as "Cambridge City") |
| Mill Hill Golf Club | facebookUrl, website | exact address match, Barnet Way NW7 |
| The Anchor Canewdon | facebookUrl, website | exact name match, 1,939 likes |
| Belmont Con Club | facebookUrl | address match SM2 6BX; page noted "unofficial" by a directory site — flagged to CTO-INBOX |
| The Fox Burwell | facebookUrl | exact name+address match, 4,090 likes |
| East Road Social Club | facebookUrl, website | exact address match, 125 East Road CB1 1BX |
| Quay Theatre Sudbury | facebookUrl, website | exact match, Quay Lane CO10 2AN |
| Dersingham Social Club | facebookUrl | matches externalId `dersingham-village-social-club` |
| Hayes Working Men's Club | facebookUrl, website | exact address match, Pump Lane UB3 3NB |
| The White Swan (Hoddesdon) | facebookUrl | exact name+town match |
| Stotfold Conservative Club | facebookUrl | original page superseded — used the newer `stotfoldcclub` per §2A.1 item 2 |
| Burwell Ex-Service and Social Club | facebookUrl, website | exact name match, founded 1921 RBL branch |
| Half Crown (Benfleet) | facebookUrl, website | exact address match, 25-27 High St |
| The Iron Horse (Sidcup) | facebookUrl, website | exact address match, 122 Station Rd DA15 7AB |
| Teversham Club | facebookUrl | address match, 4 Cherry Hinton Road |
| Victory Services Club | facebookUrl, website | exact address match, 63-79 Seymour St |
| The Queens Head (Tebworth) | facebookUrl | exact address match, The Lane LU7 9QB |
| The White Lion (Cambridge) | facebookUrl | pub is Sawston-based, same naming pattern as Cambridge City FC this firing |
| The Porter and Sorter (Croydon) | website | no Facebook URL surfaced |
| The Shepherd & Dog (Ballards Gore) | website | site title matches the specific Ballards Gore premises, distinct from the separate Stambridge pub of the same name; no Facebook URL confirmed for this specific premises |

**6 evidenced blanks / flags:**
- Berkhamsted Civic Centre — two competing Facebook pages, no distinguishing detail. Ambiguous, flagged.
- Burwell Recreation Ground — public parish-maintained recreation ground, no own bookable-venue page.
- The Plough (Upminster) — no confirmed Facebook URL; ambiguous candidates ("The Plough Kitchen", "The Plough, Cranham") may be different premises.
- Little Shelford Recreation Ground — public recreation ground, no own bookable-venue page.
- Kings Park (Canvey Island) — identity mismatch: only match is a residential park-home community, not a music venue. Logged to CTO-INBOX.
- Canvey Seafront — record's own externalId names a specific pub ("The Fountain, ex Kings Club") but only a generic seafront community page was found. Logged to CTO-INBOX.

**Tier 5 (genre-only, facebookUrl-holding artists missing genres):** queried at offset 20 and offset 40 (per RUN-REPORT-09's recommendation to advance past page 0). Both pages returned only artists already investigated in RUN-REPORT-08 (Soundgenarator, Rob Hunt, The Humanitarians, the Grey Numbers, JD & the Parrots, Umlaut Overload, Erika Wood), interleaved with facebookUrl-less rows that don't qualify for tier 5 at all. This confirms the facebookUrl-holding + missing-genres pool is a small (~12-15 record), already-exhausted set rather than an offset artifact. Not re-investigated; logged as a rule finding to CTO-INBOX. 0 artists worked this firing.

## Step 4 — validate. Non-negotiable.

Venues validated via the standing field-mapping adapter (`data/state/tmp/bv2a-firing1019z-build.py` + `bv2a-firing1019z-evidence-aliased.jsonl`, `venueId`→`artistId`), consistent with the RUN-REPORT-06/-07/-08/-09 precedent.

```
26 records · 6 clean · 0 FAIL · 40 WARN   [mode=gate]
```

All 40 WARNs are `STUB_NO_BIO`/`STUB_NO_IMAGE` (expected and correct — venues carry no bio/image field under FP.2). **0 FAIL.**

## Step 5 — ledger, summary, dashboards

28 lines appended to `data/state/enrichment-ledger.jsonl` (22 verified + 6 blank), plus one snapshot line: `artistsTotal:3422, artistsMissingSocials:1273, artistsMissingGenres:828, venuesTotal:3495, venuesMissingSocials:47`. Venues-missing-socials rose from 45 (RUN-REPORT-09 close) to 47 despite 22 writes this firing — the hourly `facebook_events`/`manual_fix` batch import (16 new venues at 10:00Z alone) is still outpacing enrichment, consistent with the standing `bv2a-firing0018z-livebandphotos-import-surge` note. One line appended to `data/state/run-summary.jsonl`. Both dashboards regenerated (`data/normalized/enrichment/DASHBOARD.html`, `data/normalized/DASHBOARD.html`).

## Budget and circuit breaker

28 venues investigated (close to the 30 cap — the fresh, non-duplicate tier-2/3 pool was exhausted at 28), 0 artists (tier 5 confirmed exhausted at two fresh offsets, not a hard stop — see Step 3). Elapsed ~11 minutes, well under the 40-minute cap. Circuit breaker did not fire.

## Open items for CTO-INBOX

- Kings Park (Canvey Island) — identity mismatch, needs a human check (new this firing).
- Canvey Seafront — possible mis-named entity against its own externalId, needs a human check (new this firing).
- Belmont Con Club — attached Facebook page is a third-party "unofficial" listing rather than a club-run page; flagged in case a better one surfaces.
- Tier 5 (genre-only) confirmed exhausted at offsets 0/20/40 — recommend pausing this lane until Chrome returns rather than re-sampling by offset.
- Berkhamsted Civic Centre — two competing Facebook pages, needs a human pick (carried from this firing, not previously flagged).
- The standing `BIO_VERBATIM`-on-untouched-bio ruling request remains open and unresolved (not triggered this firing).
