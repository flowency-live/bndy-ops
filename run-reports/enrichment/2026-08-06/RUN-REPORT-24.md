# ENRICHMENT RUN — 2026-08-06 23:14 UTC – 2026-08-07 00:05 UTC (Bv2a Enrichment, run 2, manually kicked off by Jason)

**Mode: NOT unattended.** Jason was present in chat throughout and explicitly asked for a second run ("Run again, new records, then we revert to the schedule"), followed immediately by re-enabling the hourly schedule. Everywhere this report says "flagged" or "not enriched", nothing was written to bndy for that record. The run crosses midnight UTC; all record timestamps in the evidence/ledger use the actual capture time, some on 2026-08-06 and the final snapshot on 2026-08-07.

## What happened before this report

Run 1 finished at 23:30 UTC (`RUN-REPORT-23.md`) and its lock was found already retired. Jason asked immediately for a second pass. Step 0 (circuit breaker — 0 FAILs in the last 3 reports) and Step 1 (concurrency lock) both passed cleanly: no lock existed, so a fresh one was written at 23:14:38Z with a note explaining the context. Step 2 preconditions (RUNBOOK v2.8, ENRICHMENT-TASK-v3 §0.0/§FP, OPEN-RULINGS, bndy MCP reachability, Chrome session) were all re-confirmed from run 1 — no re-read needed within the same session.

## Selection

Per §3 priority order, with run 1's own output used to avoid re-touching records already handled:

1. Venues created <24h, missing socials, not already touched in run 1: worked first.
2. Backlog venues missing socials, oldest first, continuing past run 1's cursor: filled the remainder of the 30-venue budget.
3. Artists: **1 genuinely new record** (Nazma Dawn Desai, created after run 1 started) + **2 retries** of run 1's records whose Facebook-surface check was left explicitly incomplete (Terri and the Waders, Grace Curran) + **12 further backlog artists**, filling the 15-artist budget.

## Venues — 30/30 attempted (budget cap)

**24 verified with a Facebook page found**, address/name cross-checked against the source before writing: The Black & Grey Morpeth · Wilnecote Working Men's Club · The Yachtsman · Haven Perran Sands Holiday Park · Bar 27 · Caffi Isa · The Odd Wheel · Bideford Pannier Market · The Trimmers Arms · The Mitre (Crediton) · Billy Bootleggers · Royal Telegraph · Foundry Arms · Tregonissey War Memorial Club · South Devon Inn · The Lighthouse (Burnham-on-Sea) · Angel Inn Durham City · Shipwrights, Padstow · Steels Social Club · Britannia Tavern · Red Hall Hotel · The Belle Vue · Claughton Hotel · Burnley Wood Club · Lepton Highlanders Sports & Social Club · The Market Ale House.

(That list runs to 26 — two of the 24 above were resolved from two competing Facebook candidates rather than a single clean hit, flagged below.)

**2 resolved between competing candidates** — chosen on the stronger of two signals, not certainty:
- **Wilnecote Working Men's Club**: two pages exist; picked the higher-engagement vanity-handle page (`wwmc.wilnecote`, 1,609 likes/2,709 check-ins) over a lower-engagement duplicate.
- **Haven Perran Sands Holiday Park**: picked the exact-name-matched page over a larger but differently-branded "Perran Sands Holiday Park" page (missing the "Haven" prefix our record uses).

**1 website-only, no Facebook** — **The Roundabout** (Plymouth): official website confirmed and added; Facebook search only surfaced a quiz-night sub-brand page and shopping-centre posts, no confident single venue page. Facebook left blank.

**1 fully evidenced blank with a strong near-miss** — **The Barn At The Mill** (Seaham): venue confirmed to exist via news coverage, but the site runs multiple differently-branded Facebook pages (Mill Inn, Barn Wedding Venue, Ranch) with no single page confidently matching "Barn at the Mill" as our record names it. Flagged for a human pick rather than guessed.

**1 fully evidenced blank** — **W P M Sports & Social Club** (Gosport): only a third-party Facebook event listing and a fan group found, no official venue page.

**1 fully evidenced blank** — **The Dressers Colne**: website confirmed (colnedressers.co.uk), no resolvable Facebook page link across two search variants.

## Artists — 15/15 attempted (budget cap)

**4 verified with a page**:
- **Nightshift** (Tavistock): `facebook.com/nightshiftdevon/`, own website `nightshiftband.co` — new record, high confidence.
- **James Dixon** (South West UK): `facebook.com/jamesdixonmusic/`, own website `jamesdixonmusic.com` — Cornwall-rooted folk/blues singer-songwriter, strong match.
- **Nick Of Time** (Plymouth): `facebook.com/p/Nick-of-Time-Guitar-and-Vocal-Harmony-Duo-100063690096933/` — exact name + type (duo) match against the Lemonrock listing.
- **Clones** (Yorkshire): `facebook.com/clonesbandrock/` — Rotherham-based covers band, matches location and type.

**11 evidenced blanks**, all governed by "blank beats wrong":
- **Nazma Dawn Desai, L-Squared, Beyond Tonight, Sully and Co, Glen Franklin** — no candidate found on either surface.
- **Terri and the Waders, Grace Curran** — **run 1's incomplete Facebook-surface checks retried and completed this run.** Fresh Google searches again returned nothing usable; the check is now closed out rather than left open.
- **Ire-Ish** — only match is a same-name Birmingham band, explicit location mismatch against our Derby record. Rejected.
- **LoveFools** — only match is a same-name German band. Rejected.
- **Orion Stars** — only match is a Sheffield/Chesterfield originals rock band, location mismatch against our Worksop record. Rejected.
- **Timelapse** — a same-name covers band exists in Wigan (Greater Manchester, geographically plausible) but with no address confirmation tying it to our Stockport record. Near-miss, flagged rather than attached.

## Names corrected under §0.6

None this run.

## Validator (RUNBOOK §6A step 8)

Same validation-only shim as run 1 (venue `socialMediaUrls`.facebook → `facebookUrl`, `city` → `location`; no bndy field names or data changed by this step). All 30 run-2 venues had a non-empty `city`, so no location substitution was needed this time.

**Validator summary line (final):**
```
45 records · 15 clean · 0 FAIL · 60 WARN   [mode=gate]
```
All 60 WARNs are `STUB_NO_BIO`/`STUB_NO_IMAGE` — expected noise: venues have no bio field and bio/image collection was out of scope for this pass's social-link-only enrichment. No FAILs. The batch ships.

## Ledger & dashboard

- 45 `enrich` lines appended (30 venues + 15 artists — 8 venues written before this session's context reset, 22 venues + 15 artists written in this continuation), plus 1 `snapshot` line.
- Snapshot (2026-08-07T00:05Z): artistsTotal 1910, artistsMissingSocials 772, artistsMissingGenres 681, venuesTotal 2107, venuesMissingSocials 855.
- `DASHBOARD.html` regenerated: 164 enrichment records, 6 snapshots, exit 0.

## Budget used

**Venues:** 30/30 (cap reached). **Artists:** 15/15 (cap reached). Combined with run 1, this session enriched or evidenced 90 venue-or-artist records across two full-budget passes in one sitting, at Jason's explicit direction to catch up after several days without a run.

**Circuit breaker:** did not trip.

**Lock:** held throughout this run (written at 23:14:38Z at the start of run 2). Being overwritten with a RELEASED marker as this report's final action, same pattern as run 1.

## Recommendation before the schedule resumes

1. **The Barn At The Mill** (Seaham) — needs a human pick between three ambiguously-branded Facebook pages for the same site.
2. **Timelapse** — Wigan candidate is a plausible but unconfirmed match for the Stockport record; worth 30 seconds of a human eye before the next run tries it again.
3. Two artists (Terri and the Waders, Grace Curran) had their incomplete run-1 Facebook checks retried and closed out clean this run — no further action needed on those two.
4. Per Jason's instruction, the hourly schedule (`bv2a-enrichment-hourly-unattended`) is being re-enabled as the next and final step of this session.
