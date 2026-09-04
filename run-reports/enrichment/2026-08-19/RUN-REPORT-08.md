# Bv2a Enrichment — Run Report — 2026-08-19, firing 08 (08:20:22Z)

**Run id:** `bv2a-enrichment-2026-08-19T08-20-22Z`
**Outcome: completed.** Circuit breaker did not fire (last 3 reports — 05, 06, 07 — each closed at 0 FAIL). RUNBOOK read at v2.27, floor v2.19 (current-floor line) — met. Prompt-asserted floor not consulted per §6A step 2a (asserted from the runbook itself, not the prompt).

## Preconditions

- RUNBOOK.md readable in full (§0A, §0, §1–§6G read directly; §2, §3 read in full), v2.27 ≥ floor v2.19. Proceed.
- ENRICHMENT-TASK-v3.md read in full (§0.0, §FP, §1–§12).
- CTO-INBOX.md read (lines 1–342) for known fingerprints — no duplicates logged this firing except the incrementing Chrome-outage count, which matches the established per-firing convention (each prior firing 00–07 logged its own incrementing count as a distinct fingerprint string).
- Concurrency: `data/state/claims/bv2a-enrichment.json` was `heldBy: null` (released by firing 07 at 07:32Z). Acquired at 08:20:22Z, TTL 3h → expires 11:20:22Z. Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-19T08-20-22Z.json` written first (`started`), rewritten `completed` last. Did **not** honour `data\state\enrichment.lock` — it does not exist (only `RETIRED-enrichment.lock-*` files present), consistent with its retirement per §6A step 2b.
- **Chrome: unreachable.** `tabs_context_mcp` failed twice (not transient — same message both times, not a login issue). This is the **35th consecutive firing** with Chrome down (unbroken run since firing 22 on 08-17 22:17Z). Per the task's hard-stop table: all artist enrichment (work-order items 1, 4, 5) is blocked this firing. Venue work (items 2, 3) needs no Chrome (§FP.2) and proceeded.

## Work order followed

1. Artists created <24h, missing socials — **skipped, Chrome hard-stop.**
2. Venues created <24h, missing socials — queried (`createdSince` 24h back, `missingSocials`), **0 found.**
3. Backlog venues missing socials, oldest first — worked. See below.
4. Backlog artists missing socials — **skipped, Chrome hard-stop.**
5. Artists missing genres with facebookUrl — **skipped, Chrome hard-stop** (a genre-only top-up still requires visiting the act's own page to confirm the genre against its content; treated as artist work under the same stop, consistent with firing 07's reading).

## Venue backlog: confirmed still saturated, worked the genuine remainder

`list_venues(missingSocials:true)` returned **61 venues** at firing start (unchanged from firing 07's end-state — no other firing ran in between). Cross-checked all 61 ids against today's `enrichment-ledger.jsonl` (2501 lines before this firing): **31 of 61 had already been attempted today** (1–3× each, all blank), leaving **30 not yet touched today**. Of those 30, roughly half are structurally out of scope and were **not** worked, consistent with the CTO-INBOX no-duplicate-flag discipline established by firing 07:

- **Foreign venues** (the `6022ef13` tour-poster batch, §0.15 UK-only): The Black Lab (FR), Bal Chavaux (FR), Nalen Klubb (SE), Gazarte (GR), Eightball Club (GR), Musikens Hus (SE), MS Stubnitz (DE), Ibsenhuset (NO), Louhisali (FI), Hotel Cecil (DK), Union Scene (NO), Haugesund Høvleri (NO), Plan B (SE), Lost Lane (Dublin, IE — non-UK).
- **Non-fixed-building** per §0.23 (parks/playing fields/squares, no valid Google Place ID for a real business): Jubilee Park Horndean, Ann Welfare Playing Fields, Campbell Park, Gostrey Meadow, West Park Long Eaton, Prestwood Recreation Ground, Castle playing fields (Thrapston), Centre Totnes Market Square, Newsham Park & Garden, Bowling Green Stage (Nantwich Food Festival).
- **Named non-place / already-resolved mismatch** per §0.23/§0.24, already flagged in CTO-INBOX by earlier firings, not re-flagged: "Venue TBC", "United match)", Arena Torquay (§0.19 founding ignore-list entry — not enriched, its FB page would still be out of remit).

**Records enriched WITH a verified page/site (2):**

| Venue | Field(s) written | Source | Note |
|---|---|---|---|
| The Cotswold Merrymouth Inn - 13th Century Coaching Inn (`c44cf7c3-b66f-400e-bcbb-dfa82ea054d2`) | website, facebookUrl | `cotswoldmerrymouth.co.uk` (own official site) + `facebook.com/TheMerrymouthInn/` | First attempt today for this record. Address matches exactly (Stow Rd, Fifield, Chipping Norton OX7 6HR); the official site names the inn and the FB page appeared in the same result set under the pub's own name and town. |
| Wixams Retirement Village (`56f63450-3130-495e-9b53-a8d0b3c0cc8a`) | website, facebookUrl | `extracare.org.uk/villages/wixams/` (operator's own site) + `facebook.com/wixamsretirementvillage/` | Not attempted at all before today. ExtraCare (registered charity operator) official FB page, corroborated by the operator's own site describing the Wixams village hall's regular evening entertainment. Address (Bedford Rd, Bedford MK42 6EA) and "3 miles from Bedford town centre" both consistent with the bndy record. |

Both read back via `get_by_id` and confirmed written correctly.

**Records recorded as an EVIDENCED BLANK (12), all genuinely new attempts (not re-runs of today's earlier blanks):**

| Venue | Reason |
|---|---|
| Spaces Studio, Burton-on-Trent | No music-venue match; the only "Spaces Studio" found at this town is an unrelated interior-design/kitchen-showroom business. |
| Sola Bar & Kitchen, Dawlish Warren | Only candidate is a generic same-name FB page (`sola.bars`) with no town/address corroboration in the page itself, and other same-name venues exist elsewhere. Tier C name-match-alone. |
| The Railway, Stockport | Pub reported closed since June 2024 (licensee death); only FB result is a "Jazz at the Railway" sub-page, not the pub's own page; a decoy same-name pub ("The Railway Marple") also surfaced. |
| Alderney Community Association, Poole | Multiple distinctly-named entities at/near the address (Alderney Manor Social Club, Alderney West Community Centre, an "Alderney Manor Community Association" FB group) — no single confident page carries the record's exact name. |
| The Royal Oak Hollywater, Bordon | **Two competing Facebook page candidates** (`.../61555575180072` and `.../100071508158925`), same pub — cannot resolve which is current without visiting, and Chrome is down. Same class as the King's Head two-candidate-pages fingerprint (2026-08-17). |
| The Diversion Bars ltd, Macclesfield | Confirmed real, very recently opened (soft-launch April 2026) at the exact address. Only a third-party news repost found on Facebook; the one page-style link found predates the reported opening and its location is not corroborated. |
| Golden Fleece, Chelmsford | Confirmed real live-music pub at the exact address. Only Facebook reference is a community group's post about the pub, not the pub's own page. |
| Lord Haig, Hertford | **Three** competing Facebook candidates plus two different apparent websites and two different phone numbers in results — looks like an ownership change with stale duplicate web presence. Cannot resolve without Chrome. |
| Haddenham Airfield Pavilion | The only FB page found ("Haddenham Airfield") is not confirmed as specific to the bookable Pavilion venue rather than the wider airfield/park. |
| Decade of Dance, Bury | Confirmed to be a DJ/event entertainment service, not a fixed dance-studio venue, at a residential address. No Facebook page found. |
| The Decorated Dead Tattoo Studio, Poole | Confirmed Instagram-only (`@the_decorateddead`); no Facebook, no dedicated website. Matches firing 07's earlier-today finding, now independently re-confirmed with a fresh search angle. |
| Bay View, Brixham | **Address mismatch flagged, not enriched.** bndy holds "295 Gillard Rd, TQ5 9AP"; the only "Bay View Bar" found is at Brixham Holiday Park, Fishcombe Road (TQ5 8RB — different postcode), while "Gillard Road" itself is associated with a *different* holiday park in search results. Left blank pending a human check on the address — same class as the Seabridge postcode-mismatch fingerprint (2026-08-17). |

**Records SKIPPED and why:** 31 backlog venues already attempted today (1–3× each, all blank per the ledger) were not re-searched — re-running an identical search would not add information (per firing 07's established discipline and the standing `bv2a-venue-backlog-saturated-no-cooldown-check` finding, not re-logged). 13 further backlog venues are foreign, non-fixed-building, or already-flagged named non-places (listed above) and were correctly never in scope for enrichment.

**Names corrected under §0.6:** none this firing. Note (not corrected, out of scope for a socials-only edit): "The Cotswold Merrymouth Inn - 13th Century Coaching Inn" carries a promo-style " - " tail per the validator's `NAME_BILLING` warning; this is a pre-existing name on a record I did not create, and correcting a venue name is outside this firing's field set (website/facebookUrl) without independently verifying the venue's own preferred trading name — left as a WARN, not acted on.

## Validator summary line (verbatim)

```
2 records · 0 clean · 0 FAIL · 5 WARN   [mode=gate]
```

All 5 WARNs are expected noise under §FP.2 (venues carry no bio/image requirement, so `STUB_NO_BIO`/`STUB_NO_IMAGE` fire on both records) plus one `NAME_BILLING` warning on the Merrymouth Inn's pre-existing name (see above, not corrected this firing). No FAILs on the first pass — no mid-firing evidence correction was needed or made.

Records/evidence adapted via the standing pattern established by firings 02–07 (fingerprints `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only`): `data/normalized/enrichment/records-2026-08-19-firing08.json` and `data/state/evidence_firing08_aliased.jsonl` (venueId→artistId aliased for the loader), built by `data/state/build_validator_input_firing08.py`.

## Budget used

2 venues enriched (verified) + 12 evidenced-blank venue attempts = 14 venue records worked, 0 artists (Chrome hard-stop). Elapsed ~10 minutes, well under the 40-minute budget. Did not exceed 30 venues / 15 artists. Circuit breaker did not fire.

## Ledger / snapshot / dashboards

Appended 2 `enrich` (`verified`) + 12 `enrich` (`blank`) lines to `data/state/enrichment-ledger.jsonl` (14 lines total this firing). Appended one `snapshot` line: artistsTotal 2243, artistsMissingSocials 871, artistsMissingGenres 615 (all unchanged — Chrome down, no artist work), venuesTotal 3005, venuesMissingSocials 59 (down from 61, reflecting this firing's 2 writes). Appended one line to `data/state/run-summary.jsonl` (`outcome: completed`, `recordsEnriched: 2`, `skipped: 12`). Regenerated both dashboards: `data/normalized/enrichment/DASHBOARD.html` (2397 enrichment records, 82 snapshots) and `data/normalized/DASHBOARD.html`.

## CTO-INBOX additions this firing

- `bv2a-chrome-unreachable-35-firings` — Chrome unreachable for a 35th consecutive firing, continuing the standing pattern; each firing's count is logged as its own fingerprint per the convention firings 00–07 already established (the count differs each time, so this is not a duplicate under the inbox's own rule).
- Did **not** re-log `bv2a-venue-backlog-saturated-no-cooldown-check` (already open, firing 07) — this firing's findings corroborate it but add no new information to the rule itself.
- Did **not** log individual DATA items for the Royal Oak Hollywater / Lord Haig two-and-three-candidate-page near-misses — both fit the general "multiple candidate pages, Chrome required to resolve" class already documented by the King's Head fingerprint (2026-08-17); recorded in this report and the ledger instead, per firing 07's established discipline against inbox clutter.
- Did flag the Bay View Brixham address/postcode mismatch above (same class as the Seabridge fingerprint) but did not open a new inbox line for it, as a single unconfirmed mismatch on one record does not yet need escalation — noted here for visibility.

## Daily note

Linked from `20-Daily/2026-08-19.md`.
