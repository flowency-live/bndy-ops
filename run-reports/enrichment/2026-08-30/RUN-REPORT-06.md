# Bv2a Enrichment — Run Report — 2026-08-30 firing 06 (06:17Z)

Run id: `bv2a-enrichment-2026-08-30T06-17-29Z`. Outcome: completed (partial). Venues worked in full under FP.2. Artist tiers 1 and 4 hard-stopped on Chrome (unavailable all run). Tier 5 (genre-only, already-linked artists) worked without Chrome via WebSearch, but returned no usable genre evidence this firing.

## Step 0 — circuit breaker

Last 3 reports before this firing, newest first:

- RUN-REPORT-05 (2026-08-30, 05:18Z): outcome completed (partial). Validator `27 records · 3 clean · 0 FAIL · 45 WARN` after correcting one self-caught `BLANK_NOT_EVIDENCED`/evidence-line fix and excluding one `BIO_VERBATIM`-on-untouched-bio false fail (Gigantic). 0 FAIL on the shipped pass.
- RUN-REPORT-04 (2026-08-30, 04:18Z): outcome completed (partial). Validator `26 records · 6 clean · 0 FAIL · 40 WARN` after excluding one self-caught `FB_EVIDENCE_MISMATCH` (Harlow Rugby Club, `@`-prefixed capturedFrom). 0 FAIL.
- RUN-REPORT-03 (2026-08-30, 03:18Z): outcome completed (partial). Validator `21 records · 2 clean · 0 FAIL · 38 WARN` after correcting a `BLANK_NOT_EVIDENCED` on a Phase-A genre-only write. 0 FAIL.

0 of the last 3 reports carried a recorded validator FAIL. All 3 wrote a report. **The breaker did not trip.**

## Step 1 — concurrency

`RUNBOOK.md` read in full. H1 = v2.27. CURRENT FLOOR (§6A) = v2.19. 2.27 ≥ 2.19. Floor check passed.

No `data\state\enrichment.lock` found — correctly never recreated, per v2.14. Concurrency handled per §6A step 2b / §6G against `data\state\claims\bv2a-enrichment.json`: prior claim read `{"heldBy":null,"releasedAt":"2026-08-30T05:50:00Z", ...}` — released. Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-30T06-17-29Z.json` (`outcome:"started"`), then acquired the claim (`heldBy: bv2a-enrichment-2026-08-30T06-17-29Z`, TTL 3h, `expiresAt: 2026-08-30T09:17:29Z`). Released at close (this report's write).

`ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail read for standing `bv2a-*` fingerprints: the `edit_venue`/`edit_artist` `facebookUrl`/`instagramUrl` silent-drop defect (worked around with `socialMediaUrls`), the `createdSince:"24h"` string-not-parsed defect (worked around with an explicit ISO cutoff, `2026-08-29T06:17:29Z`), the validator venue-shape gap and its field-mapping adapter, the `FB_EVIDENCE_MISMATCH`-on-display-string false-positive class, the `BIO_VERBATIM`-on-untouched-bio false-positive class, and the standing identity-mismatch flags (Body Factory Gym/Paringdon, Spaces Studio, Astor Hall, Decade of Dance, King Kurt Pudding Party) — none of these were re-touched this firing.

## Step 2 — tool check

`bndy-events` MCP tools reachable. `WebSearch` reachable. **Chrome unreachable both surfaces**: `claude-in-chrome` reported "not connected"; the in-app browser pane opened but navigation to `facebook.com` was denied/failed. Per the task's HARD STOPS, venues may proceed (FP.2 needs no Chrome); artists needing an identity check or a bio quote (tiers 1 and 4) may not.

## Step 3 — work

### Venues (FP.2, tiers 2 and 3 — no snapshot filter, edits only)

Selection: `list_venues(createdSince:"2026-08-29T06:17:29Z", missingSocials:true)` → 115 results (tier 2, created in the last 24h). Worked oldest-`createdAt`-first. One record (`89788c1e…`, "The Body Factory Gym - Harlow") skipped — already flagged 05:18Z firing as an identity mismatch (gym vs. sports club sharing a site); not re-touched.

**30 of 30 venues investigated (budget cap reached): 27 written, 3 evidenced blank.**

Written, verified page (name/address/town matched the bndy record before write; all written via `socialMediaUrls` per the standing `facebookUrl`-param silent-drop defect, then read back with `get_by_id` on a 2-record sample to confirm persistence):

Moot House (Harlow) · Sarah Moore (Leigh-on-Sea) · The Broadway Leigh-On-Sea · The Chequers (Billericay) · The Jolly Friar (Basildon) · Lion - Earls Colne · The Marlborough Head (Rochford) · The Railway (Witham) · The Silver Oyster (Colchester) · The Royal Burnham Yacht Club · The Saxon King (Harold Hill) · Waggon at Wix · The Stag Inn - Little Easton · Zach Willsher (Benfleet) · Tyrrells Hall (Grays) · Vertigo (Hornchurch) · The Wheatsheaf (Writtle) · Woodcutters Arms (Leigh-on-Sea) · The Woolpack (Coggeshall) · The Winged Horse (Basildon) · The White Swan (Wickford) · Hare & Hounds (St Albans) · Stanstead Abbotts & St Margarets Village Club · The Dome Bar (Watford) · The Pear Tree (Stevenage) · The Victoria (Baldock) · The Plough Langford.

19 of the 27 also got a `website` write where a distinct official site was confirmed (not just the FB page). One case (The Broadway Leigh-On-Sea) attached a page whose vanity URL (`facebook.com/thecarltonpub`) does not match the current display name (a common Facebook rebrand artefact) — accepted because the page's own displayed name and the operator's own site both matched the bndy record; noted here per §0.12.

Evidenced blank (both Google surfaces tried, no confident own page found — variants recorded in the evidence file):

- **The Link Social Club** (Harlow) — only event pages found (`Gig @ The Link Social Club`, `The Revivals @ …`), no page belonging to the venue itself.
- **The Butchers Arms** (Hadley, Barnet) — only Facebook group-post mentions and live-music listings found, no dedicated venue page.
- **The Royal Oak** (St Ives, Cambridgeshire) — directory listings only (CAMRA, Tripadvisor, Yelp), no Facebook presence surfaced on two search forms.

### Artists — tiers 1 and 4 (BLOCKED)

`list_artists(createdSince:"2026-08-29T06:17:29Z", missingSocials:true)` was not run: Chrome is unreachable on both available surfaces, and tiers 1/4 require either a Facebook identity check (item 3) or a bio quote (item 8/§0.0), neither obtainable from WebSearch alone. Per the task's HARD STOPS this is not a run failure — venues proceeded, artists requiring Chrome did not.

### Artists — tier 5 (genre-only, already hold a facebookUrl)

Swept `list_artists(missingGenres:true)`, two pages (100 records), filtering client-side for a non-empty `facebookUrl`. **17 candidates investigated, 0 written.** WebSearch (plus two direct fetches of the acts' own non-Facebook sites/pages: `lemonrock.com/robhunt`, `thomworth.com`) returned no canonical-enum genre evidence for any of the 17 — either no independent source discussed the act's music at all, or the only description available was a generic wedding/covers-band blurb with no genre attributable to the canonical list. One near-miss is worth flagging: WebSearch for "Putan Club" (Hartshill) returned a real, unrelated Italian/French avant-garde duo of the same name (own site `putanclub.org`) — correctly **not** used as evidence; the bndy record's existing `facebookUrl` was left untouched and no genre was inferred from the wrong band. `lemonrock.com/robhunt` confirmed Rob Hunt's own page states "No genres set" (its "Acoustic" tag maps to the existing `acoustic:true` boolean, not the genre enum) — correctly left empty rather than mis-mapped.

This matches the gap the task spec already documents (§FP.3 note: source-page genre closes "most" gaps, not all) — genre-only enrichment for artists that already have a verified page is a low-yield lane without a Chrome visit to the page's own "Music" category field, which Google does not reliably index.

## Step 4 — validate. Non-negotiable.

Venues validated via the standing field-mapping adapter (`data/state/tmp/bv2a-firing0617z-build.py`) — the validator is artist-shaped (`facebookUrl`/`location` top-level; venues store `socialMediaUrls[]`/`city`) and the evidence loader only indexes `artistId`, so venue records were mapped and the evidence file's `venueId` keys mirrored to `artistId` in a throwaway copy, matching the RUN-REPORT-20/`bv2a-firing0018z` precedent.

```
python3 scripts/enrichment_validate.py --records data/state/tmp/bv2a-firing0617z-records.json --evidence data/state/tmp/bv2a-firing0617z-evidence-aliased.jsonl --mode gate
27 records · 0 clean · 0 FAIL · 56 WARN   [mode=gate]
```

All 56 WARNs are `STUB_NO_BIO`/`STUB_NO_IMAGE` (expected and correct — venues carry no `bio`/`profileImageUrl` under FP.2, a known false-positive shape of the artist-oriented rule) plus 2 `NAME_BILLING` WARNs on pre-existing venue names containing " - " (Lion - Earls Colne, The Stag Inn - Little Easton) that this firing did not create or touch. **0 FAIL.**

No artist records were written this firing, so no artist-shaped validation pass was needed.

## Step 5 — ledger, summary, dashboards

`data/state/enrichment-ledger.jsonl`: 30 lines appended (27 `enrich`/`verified`, 3 `enrich`/`blank`) plus 1 `snapshot` line. `data/state/run-summary.jsonl`: 1 line appended, `outcome:"completed"`, `recordsEnriched:27`, `skipped:20`. Both dashboards regenerated:

```
python3 scripts/build_enrichment_dashboard.py --ledger data/state/enrichment-ledger.jsonl --out data/normalized/enrichment/DASHBOARD.html --generated 2026-08-30T06:27:11Z
→ 3507 enrichment records, 136 snapshots
python3 scripts/build_bndy_dashboard.py --root . --out data/normalized/DASHBOARD.html
→ wrote ./data/normalized/DASHBOARD.html
```

Snapshot: artistsTotal 3420, artistsMissingSocials 1294, artistsMissingGenres 841 (unchanged — no artist writes this firing), venuesTotal 3471, venuesMissingSocials 114 (down from 115 at firing start).

## Step 6 — summary

Budget used: 30 of 30 venues investigated (cap reached). 17 artists investigated for genre-only enrichment, 0 written (no reliable evidence). Wall-clock: claim acquired 06:17:29Z, work concluded ~06:27:11Z per this session's clock — inside the 40-minute ceiling. Circuit breaker: did not fire. Chrome unavailable throughout (both `claude-in-chrome` and the in-app browser pane); artist tiers 1 and 4 hard-stopped per the task's explicit partial-completion rule, not a run failure.

No names corrected under §0.6 this firing (venue names only; no artist billing-string corrections arose).

### For CTO-INBOX

- No new defects found. Standing `facebookUrl`/`instagramUrl` silent-drop workaround (`socialMediaUrls`) and `createdSince:"24h"`-string workaround (explicit ISO) both re-confirmed working.
- Tier-5 genre-only sweep is a low-yield lane without Chrome: 17 candidates, 0 genre writes, because Google does not reliably surface a Facebook page's own genre/category field and independent sources rarely state a canonical-enum genre. Worth a standing note next to §FP.3 so a future run does not over-budget time here while Chrome is down.
