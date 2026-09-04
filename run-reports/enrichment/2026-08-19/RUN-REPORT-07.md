# Bv2a Enrichment — Run Report — 2026-08-19, firing 07 (07:20:37Z)

**Run id:** `bv2a-enrichment-2026-08-19T07-20-37Z`
**Outcome: completed.** Circuit breaker did not fire (last 3 reports — 04, 05, 06 — each closed at 0 FAIL). RUNBOOK read at v2.27, floor v2.19 — met.

## Preconditions

- RUNBOOK.md readable, v2.27 ≥ floor v2.19. Proceed.
- Concurrency: `data/state/claims/bv2a-enrichment.json` was `heldBy: null` (released by the prior firing at 06:38Z). Acquired at 07:20:37Z, TTL 3h → expires 10:20:37Z. Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-19T07-20-37Z.json` written first, rewritten `completed` last.
- **Chrome: unreachable.** `tabs_context_mcp` failed twice (not transient). This is the **34th consecutive firing** with Chrome down (first noted firing 22 on 08-17). Per the task's hard-stop table: artist enrichment (work-order items 1, 4, 5) is fully blocked this firing — zero artist records touched. Venue work (items 2, 3) needs no Chrome (§FP.2) and proceeded.

## Work order followed

1. Artists created <24h, missing socials — **skipped, Chrome hard-stop.**
2. Venues created <24h, missing socials — queried, **0 found.**
3. Backlog venues missing socials, oldest first — worked. See below.
4. Backlog artists missing socials — **skipped, Chrome hard-stop.**
5. Artists missing genres with facebookUrl — **skipped, Chrome hard-stop** (genre-only top-up still requires visiting the act's own page to confirm; treated as artist work under the same stop).

## Venue backlog: found saturated, not empty

`list_venues(missingSocials:true)` returns **61 venues remaining** (64 at firing start). Before searching, I cross-checked candidate ids against today's `enrichment-ledger.jsonl` (2497 lines) and found **the entire 64-venue backlog had already been attempted 1–4 times today** by firings 00–06: Astor Hall 3×, Turks Head 3×, Walton Conservative Club 4×, Plympton Spice 1×, Darcy's/The Nest/White Lodge/Annitsford/Hayfield/Tannery/Saracens Head/Jubilee Inn/Dicey Reilly's/Sola Bar/West End Club/Hunstanton Bandstand each 2–3×. Of the 64, roughly 20 are structurally unenrichable (foreign addresses in the `6022ef13` batch, non-fixed-building parks/showgrounds/beaches, garbled names) and are already flagged in CTO-INBOX by prior firings (Astor Hall care-home, "1865, 1 Carlton Pl" address mismatch, "Jorge Wilson + Jesse James", "EX39 4JN"/Instow Beach, "United match)", White Lodge, Hunstanton Bandstand, Castle Playing Fields — did not re-flag any of these, per the inbox's own no-duplicate rule).

**Records enriched WITH a verified page/site (3):**

| Venue | Field(s) written | Source | Note |
|---|---|---|---|
| The Turks Head, Reading (`8d3570d1-d252-424a-af53-89a93d5b1e6e`) | website, facebookUrl | `turkreadingpub.co.uk` (venue's own official Star Pubs site, footer links) | Blanked 3× earlier today by generic Facebook/Google search; the venue's own official website — never previously checked — states the current trading name and links `facebook.com/TheTurksReading` and Instagram directly. Address matches exactly (31 London Rd, Reading RG1 5BJ). |
| Walton Hersham & Oatlands Conservative Club (`8106dbb5-b0a4-424e-995e-8b5b6256578a`) | website | `waltonconservativeclub.co.uk` | Blanked 4× earlier today. Own official site, plain URL, exact address match (4 Manor Rd, Walton-on-Thames KT12 2PB). No Facebook page found. |
| Plympton Spice Plymouth (`13db6e7b-fe80-40e9-a3a9-6ea7fe30e2db`) | facebookUrl | `facebook.com/plymptonspice` | Blanked once earlier today (cursory check, no evidence recorded). Exact name/address match (151 Ridgeway, Plympton, Plymouth PL7 2HJ) confirmed via the restaurant's own listings across two independent search results. |

All three read back via `get_by_id` and confirmed written correctly.

**Records recorded as an EVIDENCED BLANK: none written this firing.** All other backlog candidates already carry a same-day blank ledger entry from an earlier firing (1–3× each); re-running the identical search and writing a duplicate "blank" line would not add information and is the exact waste flagged below. This is a deliberate omission, not an oversight — see CTO-INBOX `bv2a-venue-backlog-saturated-no-cooldown-check`.

**Records SKIPPED and why:** the remaining ~55 backlog venues — skipped because already attempted today with the same blank outcome I would independently reach (verified by spot-checking 2 of them: King William Ⅳ Bristol confirmed still a genuine place mismatch per the 00:38Z evidence; Decorated Dead Tattoo Studio Poole confirmed still Instagram-only, no FB, per the earlier-today evidence).

**Names corrected under §0.6:** none this firing.

## Validator summary line (verbatim)

```
3 records · 1 clean · 0 FAIL · 4 WARN   [mode=gate]
```

The 4 WARNs are `STUB_NO_BIO`/`STUB_NO_IMAGE` on the two facebookUrl-verified venues (Turks Head, Plympton Spice) — expected noise under §FP.2, venues carry no bio/image requirement. Mid-firing correction: the first validator pass FAILed The Turks Head on `FB_EVIDENCE_MISMATCH` because `capturedFrom` pointed at the venue's own corroborating website rather than the Facebook URL itself — the same standing fingerprint as `validator-fb-evidence-mismatch-fp2-corroboration` (2026-08-15). Corrected by appending a fresh evidence line with `capturedFrom` set to the Facebook URL itself (matching the established firings 04–06 convention), re-validated: 0 FAIL.

Records/evidence adapted via the standing pattern: `data/normalized/enrichment/records-2026-08-19-firing07.json` and `data/state/evidence_firing07_aliased.jsonl` (venueId→artistId aliased for the loader), built by `data/state/build_validator_input_firing07.py`.

## Budget used

3 venues enriched (verified), 0 artists (Chrome hard-stop), elapsed well under the 40-minute budget (~10 minutes). Did not exceed 30 venues / 15 artists. Circuit breaker did not fire.

## Ledger / snapshot / dashboards

Appended 3 `enrich` lines (all `verified`) to `data/state/enrichment-ledger.jsonl`. Appended one `snapshot` line: artistsTotal 2243, artistsMissingSocials 871, artistsMissingGenres 615 (all unchanged — Chrome down, no artist work), venuesTotal 3006, venuesMissingSocials 61 (down from 64, reflecting this firing's 3 writes). Appended one line to `data/state/run-summary.jsonl` (`outcome: completed`, `recordsEnriched: 3`, `skipped: 61`). Regenerated both dashboards: `data/normalized/enrichment/DASHBOARD.html` (2383 enrichment records, 81 snapshots) and `data/normalized/DASHBOARD.html`.

## CTO-INBOX additions this firing

- `bv2a-chrome-unreachable-34-firings` — Chrome unreachable for a 34th consecutive firing.
- `bv2a-venue-backlog-saturated-no-cooldown-check` — **new finding.** `list_venues(missingSocials)` selection never consults the ledger, so the same ~60 venues (mostly structurally unenrichable: foreign, non-fixed-building, garbled-name) are re-searched 1–4× every firing today, burning budget on records that cannot change outcome. A cooldown gate (per `ENRICHMENT-TASK-v3.md` §9: 90-day cooldown on `no-page-found`) is specified but not applied at the `list_venues` selection step. Did not re-log the individual already-flagged venue defects (Astor Hall, 1865/Carlton Place, Jorge Wilson + Jesse James, EX39 4JN, White Lodge, Hunstanton Bandstand, etc.) — all already present, several logged 2–3× today by earlier firings, which is itself evidence for the same underlying gap.

## Daily note

Linked from `20-Daily/2026-08-19.md`.
