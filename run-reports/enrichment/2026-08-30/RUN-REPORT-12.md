# Bv2a Enrichment — RUN-REPORT-12

Run id: `bv2a-enrichment-2026-08-30T12-18-55Z`. Outcome: completed (partial). Venues worked in full under FP.2 (1 write, 13 evidenced blank). Artist tiers 1/2/4 hard-stopped on Chrome; tier 5 investigated at a fresh offset (140) and reconfirmed low-yield.

## Step 0 — circuit breaker

- RUN-REPORT-11 (2026-08-30, 11:18Z): outcome completed (partial). Validator `12 records · 5 clean · 0 FAIL · 14 WARN`. 0 FAIL.
- RUN-REPORT-10 (2026-08-30, 10:19Z): outcome completed (partial). Validator `26 records · 6 clean · 0 FAIL · 40 WARN`. 0 FAIL.
- RUN-REPORT-09 (2026-08-30, 09:18Z): outcome completed (partial). Validator `31 records · 14 clean · 0 FAIL · 36 WARN`. 0 FAIL.

Independently re-verified RUN-REPORT-10 and RUN-REPORT-09 directly (not just via RUN-REPORT-11's own summary): both confirm 0 FAIL on their shipped pass. 0 of the last 3 reports carried a recorded validator FAIL. All 3 wrote a report. **The breaker did not trip.**

## Step 1/2 — runbook, task spec, floor

`RUNBOOK.md` read in full. H1 = v2.27. CURRENT FLOOR (§6A) = v2.19. 2.27 ≥ 2.19. Floor check passed.

`ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail read for standing `bv2a-*` fingerprints: the `edit_venue` `facebookUrl` silent-drop defect (workaround: `socialMediaUrls` — not needed this firing, since the only write was a plain `website` field, which persists directly), the `createdSince` duration-string-not-parsed defect (worked around with an explicit ISO cutoff), the validator venue-shape adapter, the `FB_EVIDENCE_MISMATCH`/`BIO_VERBATIM`-on-untouched-field false-positive class (not triggered — no artist writes made), the standing identity-mismatch flags (Body Factory Gym/Paringdon, Spaces Studio, Astor Hall, Decade of Dance, Kings Park Canvey, Canvey Seafront, Annitsford Welfare Club, Rayleigh RBL, Van Dyk Hotel, Three Horseshoes Bures — none re-touched), and the standing Chrome outage.

## Step 2b — concurrency

`data\state\enrichment.lock` not honoured, not recreated, per v2.14. Prior claim on `data\state\claims\bv2a-enrichment.json` read `{"heldBy":null,"releasedAt":"2026-08-30T11:30:30Z", ...}` — released. Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-30T12-18-55Z.json` (`outcome:"started"`), then acquired the claim (TTL 3h, `expiresAt: 2026-08-30T15:18:55Z`). Released at close (this report's write).

## Step 3 — tool check and work

`bndy-events` MCP tools reachable (verified with `list_venues`/`list_artists` calls). `WebSearch` reachable. **Chrome unreachable**: `list_connected_browsers` returned zero, consistent with every firing today. Per the task's HARD STOPS, venues proceeded (FP.2 needs no Chrome); artist tiers 1/2/4 (identity check or bio quote required) did not.

**Selection.** `list_venues(missingSocials:true, createdSince:<ISO 24h cutoff>)` returned 15 fresh venues; the full `missingSocials` backlog held 40. After excluding non-fixed-building records (recreation grounds, parks, a nature reserve, a beach, a showground, a carnival, a festival stage — 14 records) and standing identity-mismatch/ambiguous flags from earlier firings today (Rayleigh RBL, Van Dyk Hotel, Annitsford Welfare Club, Hunstanton Bandstand, Three Horseshoes Bures, Middle of the Road Cafe [pre-existing `NO_LOCATION`], Kings Park Canvey, Canvey Seafront, Decade of Dance, Astor Hall, Spaces Studio, Body Factory Gym — 12 records), **14 candidates remained**: 7 fresh (<24h) and 7 backlog (oldest-first).

⚠ **Process note, caught mid-firing:** several of these 14 (Darcy's, The Plough, The Link Social Club, The Tannery, White Lodge — confirmed via the shared day evidence file) had already been searched and recorded as evidenced blanks by earlier firings today (04:21–10:23Z), because a "no page found" blank does not clear a record off the `missingSocials` filter and most blanks were not distinctive enough to earn a named CTO-INBOX flag. This firing re-searched them without knowing that, which is wasted effort but not a correctness problem — no wrong data was written, and the blanks were reconfirmed rather than contradicted. **Recommend a future firing grep the day's `enrichment-evidence-<date>-enrichment.jsonl` for a candidate's id before spending a search on it.**

**`enrich_venue` tried first in batch** (all 14) per FP.2 — 1 fresh geocode (Berkhamsted Civic Centre), 13 already held a `googlePlaceId`; no Places-sourced website surfaced.

**1 verified write:**

| Venue | Field | Evidence |
|---|---|---|
| Berkhamsted Civic Centre | website | `berkhamsted-tc.gov.uk/our-services/halls-for-hire/civic-centre/` — Berkhamsted Town Council's own hall-for-hire page, exact address match (196 High St, Berkhamsted HP4 3AP), corroborated by Wikipedia. `facebookUrl` left blank: two competing candidate pages (`378611019320411`, `174028109275133`) plus a third-party promoter page ("Berkhamsted Entertainment") posting about events there — no way to pick the venue's own page from Google alone. |

**13 evidenced blanks** (both surfaces tried where a vanity handle was plausible — Google general search plus `site:facebook.com` restricted search; no confidently-identifiable own page found for any):
- The Cock Inn (Hadleigh) — real pub confirmed (exact address, live-music note on multiple directories), but the only "Cock Inn" Facebook pages found are at Leek, Wing and Headley — different towns entirely.
- The Link Social Club (Harlow) — confirmed real venue (CAMRA, Yell, u3a), no Facebook page surfaced distinct from third-party group/event mentions.
- George Woodford ("The George", South Woodford) — own website found (georgesouthwoodford.co.uk), no distinct Facebook page URL surfaced.
- Swan and Hedgehog Inn (Ipswich) — event pages use a `swanandhedgehog` handle repeatedly, but no direct visit to confirm it's a business page rather than an events-only construct; not attached on that uncertainty.
- The Three Wishes (Edgware) — a "Three Wishes Freehouse" FB page found, but the snippet says only "London", not "Edgware" specifically, and at least one other same-name "Three Wishes" (Greenford) exists nearby — not decisive enough to attach.
- The Plough (Upminster) — reconfirmed blank (see process note above); two same-name candidates found previously ("The Plough Kitchen", "The Plough, Cranham"), neither confirmable.
- Darcy's (Fenton, Stoke-on-Trent) — reconfirmed blank; directories reference "a Facebook page" but no URL surfaces.
- The Railway (Stockport) — only candidate is "Jazz at the Railway" (a jazz-night page, not confirmably the pub's own); independent evidence suggests the pub itself may be **closed** since the licensee's death in 2024 — flagged to CTO-INBOX for a human check rather than treated as a routine blank.
- White Lodge (Stafford) — no web candidate matches the stored name+address; only a campsite (Great Haywood) and an unrelated care/community unit (Cannock) found — flagged as a possible wrong/mis-named entity.
- Hayfield Club (Hayfield) — no confident single match; "Hayfield Emporium" occupies the address but under a different name, "Hayfield Con Club" is plausible but address-unconfirmed — flagged.
- The Tannery (Derby) — real, recently-opened venue confirmed (Derby City Council press coverage), operator's own Facebook page (Ashover Brewery) is located in Clay Cross, not Derby — not the same page, not attached.
- Sola Bar & Kitchen (Dawlish Warren) — address confirmed via food-hygiene register; the only FB candidate found ("Sola Bars", plural) may be a multi-site brand page rather than this specific site — not decisive, not attached.
- Market Place (Burton upon Trent) — search surfaced only differently-named entities at/near the address (Burton Market Hall, Harmless Market, an unrelated "Market Place Travel" agency) plus festival coverage describing events "at Market Place" — suggests this bndy record may denote the public square itself rather than a specific bookable business. Flagged to CTO-INBOX for a human check of what the record should represent.

**Tier 5 (genre-only, facebookUrl-holding artists missing genres):** queried at a fresh offset (140), past today's exhausted 0/20/40/60/100 range. 6 genuinely new candidates found (Kelly Bourne, Miranda Newton, The Skasoul, Jo Safina, Nick Milner Band, Ginger & the Ninjas) — investigated via WebSearch. **0 genre writes**: results were uniformly generic ("covers band", "solo singer") with no attributable canonical-enum genre; one name-collision risk correctly avoided (Jo Safina search returned only the unrelated Jo Stafford). Reconfirms the standing low-yield finding (`bv2a-firing0617z-tier5-genre-webSearch-low-yield`) at a third distinct offset. 0 artists worked this firing.

## Step 4 — validate. Non-negotiable.

Venues validated via the standing field-mapping adapter (`data/state/tmp/bv2a-firing1218z-build.py` + `bv2a-firing1218z-evidence-aliased.jsonl`, `venueId`→`artistId`), consistent with RUN-REPORT-06 through -11 precedent.

```
14 records · 14 clean · 0 FAIL · 0 WARN   [mode=gate]
```

**0 FAIL, 0 WARN** — the one written record (Berkhamsted) carries no bio/image so no `STUB_*` WARN fires on it, and all 13 blanks are evidenced (`searchVariants` present) so `BLANK_NOT_EVIDENCED` does not fire on any of them.

## Step 5 — ledger, summary, dashboards

14 lines appended to `data/state/enrichment-ledger.jsonl` (1 verified + 13 blank), plus one snapshot line: `artistsTotal:3422, artistsMissingSocials:1273, artistsMissingGenres:828, venuesTotal:3495, venuesMissingSocials:39` — down from 40 at firing start, matching the 1 write exactly. One line appended to `data/state/run-summary.jsonl`. Both dashboards regenerated (`data/normalized/enrichment/DASHBOARD.html`, `data/normalized/DASHBOARD.html`).

## Budget and circuit breaker

14 venues investigated (1 written + 13 evidenced blank) — the fresh, non-duplicate backlog pool was smaller than the 30-cap this firing (several candidates turned out to be same-day duplicates, see process note above). 6 fresh tier-5 artist candidates investigated, 0 written. Elapsed ~8 minutes (12:18:55Z–12:27:00Z), well under the 40-minute cap. Circuit breaker did not fire.

## Open items for CTO-INBOX

- The Railway (Stockport) — only FB candidate is a jazz-night page, not confirmably the pub's own; independent evidence suggests the pub may be closed since 2024. Needs a human check.
- White Lodge (Stafford) — no web candidate matches the stored name+address. Possible wrong/mis-named entity, needs a human check.
- Hayfield Club (Hayfield) — no confident single match between two differently-named nearby candidates. Needs a human check or Chrome visit.
- Market Place (Burton upon Trent) — may denote a public square rather than a specific bookable venue. Needs a human check of what the record should represent.
- Process defect (not a bndy defect): today's enrichment evidence file is shared across firings but nothing surfaces "already searched this record today" at selection time, so a later firing can duplicate an earlier firing's search effort on the same blank. No wrong data resulted. Logged as a `RULE` fingerprint recommending a pre-selection grep of the day's evidence file.
