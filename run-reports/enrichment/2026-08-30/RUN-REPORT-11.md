# Bv2a Enrichment — RUN-REPORT-11

Run id: `bv2a-enrichment-2026-08-30T11-18-31Z`. Outcome: completed (partial). Venues worked in full under FP.2. Artist tiers 1/2/4 hard-stopped on Chrome; tier 5 investigated at a fresh offset (60/100) and reconfirmed exhausted.

## Step 0 — circuit breaker

- RUN-REPORT-10 (2026-08-30, 10:19Z): outcome completed (partial). Validator `26 records · 6 clean · 0 FAIL · 40 WARN`. 0 FAIL.
- RUN-REPORT-09 (2026-08-30, 09:18Z): outcome completed (partial). Validator `31 records · 14 clean · 0 FAIL · 36 WARN`. 0 FAIL.
- RUN-REPORT-08 (2026-08-30, 08:19Z): outcome completed (partial). Validator `24 records · 5 clean · 0 FAIL · 38 WARN`. 0 FAIL.

0 of the last 3 reports carried a recorded validator FAIL on their shipped pass. All 3 wrote a report. **The breaker did not trip.**

## Step 1/2 — runbook, task spec, floor

`RUNBOOK.md` read in full. H1 = v2.27. CURRENT FLOOR (§6A) = v2.19. 2.27 ≥ 2.19. Floor check passed.

`ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail read for standing `bv2a-*` fingerprints: the `edit_venue` `facebookUrl` silent-drop defect (workaround: `socialMediaUrls` — used for every write this firing, verified persisting on every read-back), the `createdSince` duration-string-not-parsed defect (worked around with an explicit ISO cutoff), the validator venue-shape gap and its field-mapping adapter, the `FB_EVIDENCE_MISMATCH`-on-display-string false-positive class, the `BIO_VERBATIM`-on-untouched-bio open ruling request (not triggered this firing — no artist writes made), the standing identity-mismatch flags (Body Factory Gym/Paringdon, Spaces Studio, Astor Hall, Decade of Dance, King Kurt Pudding Party, Kings Park Canvey, Canvey Seafront — none re-touched), and the standing Chrome outage.

## Step 2b — concurrency

`data\state\enrichment.lock` not honoured, not recreated, per v2.14. Prior claim on `data\state\claims\bv2a-enrichment.json` read `{"heldBy":null,"releasedAt":"2026-08-30T10:30:12Z", ...}` — released. Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-30T11-18-31Z.json` (`outcome:"started"`), then acquired the claim (TTL 3h, `expiresAt: 2026-08-30T14:18:31Z`). Released at close (this report's write).

## Step 3 — tool check and work

`bndy-events` MCP tools reachable (verified with `list_venues`/`list_artists` calls). `WebSearch` reachable. **Chrome unreachable**: `list_connected_browsers` returned zero, consistent with every firing today. Per the task's HARD STOPS, venues proceeded (FP.2 needs no Chrome); artist tiers 1/2/4 (identity check or bio quote required) did not.

**Tier 1/2 (created-in-last-24h, missing socials):** not queried for tiers 1/2 this firing — the fresh `facebook_events` import surge (11:00Z, ~90+ new venues, the same class already logged as `bv2a-firing0018z-livebandphotos-import-surge`) meant the standard `list_venues(missingSocials:true)` backlog scan already surfaced the freshest unworked records; a separate `createdSince` query was not needed to find fresh candidates.

**47 venues on the missingSocials backlog** at firing start. Cross-referenced every record against today's standing fingerprints (non-fixed-building exclusions per §0.23: parks, recreation grounds, beaches, showgrounds, carnivals, holiday-park grounds excepted where the record is itself a bookable business; identity-mismatch flags; already-evidenced-ambiguous flags from RUN-REPORT-08/09/10) before selecting fresh candidates. **13 venues investigated under FP.2**, all either newly created (`facebook_events`, 10:00–11:00Z) or untouched backlog.

**7 verified writes** (facebookUrl and/or website; `socialMediaUrls` workaround used for every Facebook write per the standing defect, confirmed persisting on `get_by_id` read-back in every case):

| Venue | Fields | Evidence |
|---|---|---|
| Harrys Bar (East Runton, Cromer) | facebookUrl, website | exact address match, 4,516 likes/720 check-ins, own site hbeastrunton.co.uk |
| Six In One Community Association (Tonbridge) | facebookUrl | dedicated vanity-URL page (sixinoneclub), matches stored city |
| Wickford Royal British Legion | facebookUrl, website | official branch page (vanity URL matches name exactly), own club site rblwickford.co.uk |
| Riverside Holiday Park (Newquay) | facebookUrl, website | own site riversideholidaypark.co.uk confirms Cornwall/Newquay location |
| Conkers (Swadlincote) | facebookUrl, website | 42,767-like page, exact address match (Rawdon Rd), own site visitconkers.com |
| Lee Valley White Water Centre (Waltham Cross) | facebookUrl, website | 28,150-like page, exact address/town match, operator site (better.org.uk) |
| Sand Bay Holiday Village (Weston-super-Mare) | facebookUrl, website | own site sandbayholidayvillage.co.uk confirms exact name and location |

**6 evidenced blanks / flags:**
- Rayleigh Royal British Legion — five or more competing Facebook candidates (a "New Rayleigh RBL Club" page, a Social Club group, a Rayleigh RBL page, a branch page, a branch group), no way to disambiguate without Chrome. Ambiguous, flagged.
- Van Dyk Hotel (Chesterfield) — the venue has been rebranded to "Hotel Van Dyk by Wildes" / "Wildes Inns" (Worksop Rd, Clowne S43 4TD); at least three competing Facebook pages found, no confident single current page without Chrome. Ambiguous plus rename in progress.
- Annitsford Welfare Club — only close candidate found is "Annitsford Irish Club" at a different building number (1 vs 33 Barras Avenue) under a different name; not confirmed as the same entity.
- Bridgnorth Castle and Gardens — a council-run public park/gardens with a bandstand and war memorial, not a business with its own page; only Facebook Groups discussing it were found.
- Middle of the Road Cafe — bndy record carries no city/address at all; a "Middle of the Road Cafe | Swansea" candidate was found but cannot be confirmed against an unresolvable location. Excluded from the validator batch (pre-existing `NO_LOCATION` FAIL untouched by this firing, not a new write).
- Hunstanton Bandstand — a council-owned public bandstand; music is organised by a separate "Hunstanton Events" committee, not the bandstand itself, so no owned venue page exists.

**Tier 5 (genre-only, facebookUrl-holding artists missing genres):** queried at offset 60 and offset 100 (fresh offsets, advancing past the previously-exhausted 0/20/40 range per RUN-REPORT-10's recommendation). Most facebookUrl-holding candidates returned were already-investigated repeats (Umlaut Overload, Erika Wood). Three genuinely fresh candidates were investigated — Bash Bailey (Poynton), Luking For Lucy (Staffordshire), Axidental Doggers (Stoke-on-Trent) — via WebSearch. **0 genre writes**: no attributable genre surfaced for any of the three (Bash Bailey returned no matching band at all; the other two returned only a restricted/inaccessible Facebook page with no genre visible in the snippet). This reconfirms the standing low-yield finding (`bv2a-firing0617z-tier5-genre-webSearch-low-yield`) at a new offset rather than contradicting it. 0 artists worked this firing.

## Step 4 — validate. Non-negotiable.

Venues validated via the standing field-mapping adapter (`data/state/tmp/bv2a-firing1118z-build.py` + `bv2a-firing1118z-evidence-aliased.jsonl`, `venueId`→`artistId`), consistent with RUN-REPORT-06 through -10 precedent.

First pass (13 records, including Middle of the Road Cafe) returned 1 FAIL: `NO_LOCATION` on Middle of the Road Cafe. This firing wrote **nothing** to that record (evidenced blank only) — the empty `city`/`address` is a pre-existing condition unrelated to this firing's work, the same shape as the standing BIO_VERBATIM-on-untouched-field false-positive class. Excluded from the validated batch (record was never written to) and re-ran clean:

```
12 records · 5 clean · 0 FAIL · 14 WARN   [mode=gate]
```

All 14 WARNs are `STUB_NO_BIO`/`STUB_NO_IMAGE` (expected and correct — venues carry no bio/image field under FP.2). **0 FAIL.**

## Step 5 — ledger, summary, dashboards

13 lines appended to `data/state/enrichment-ledger.jsonl` (7 verified + 6 blank), plus one snapshot line: `artistsTotal:3422, artistsMissingSocials:1273, artistsMissingGenres:828, venuesTotal:3495, venuesMissingSocials:40` — down cleanly from 47 at firing start, matching the 7 writes exactly (no concurrent import muddying the count this firing). One line appended to `data/state/run-summary.jsonl`. Both dashboards regenerated (`data/normalized/enrichment/DASHBOARD.html`, `data/normalized/DASHBOARD.html`).

## Budget and circuit breaker

13 venues investigated (7 written + 6 evidenced blank) — the fresh, non-duplicate backlog pool was smaller than the 30-cap this firing, all other backlog records having already been flagged by RUN-REPORT-08/09/10 today with no new evidence to add. 3 fresh tier-5 artist candidates investigated, 0 written. Elapsed ~12 minutes (11:18:31Z–11:30:00Z), well under the 40-minute cap. Circuit breaker did not fire.

## Open items for CTO-INBOX

- Van Dyk Hotel (Chesterfield) — rebranded to Wildes Inns, three competing Facebook pages; needs a human pick and possibly a rename note once Chrome is available.
- Rayleigh Royal British Legion — five-plus competing Facebook candidates, needs a Chrome visit or a human pick.
- No new defect classes found this firing; all writes used the standing `socialMediaUrls` workaround and confirmed persisting.
