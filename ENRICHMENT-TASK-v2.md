# ENRICHMENT NIGHTLY — TASK DEFINITION v2.0 DRAFT (2026-07-29)

**SUBORDINATE TO `MASTER-IMPORT-RUNBOOK.md` (v1.9+), especially §2A.3 TIGHTENED.** Supersedes the paused 1am FB-image task. Source id for provenance on edits: `enrichment-v2`. Scheduling Jason-only; first run supervised.

## Mission (Jason ruling 2026-07-29)
**50 records/night, artists AND venues**, worked to the tightened standard: not just images — full enrichment.

## Per-record procedure
- Selection: `list_artists`/`list_venues` with missing-data filters (missingSocials, missingGenres, missingLocation / missingAddress, missingSocials), oldest/never-enriched first; skip owner-managed (§0.16) ALWAYS.
- ARTIST: FB search via Chrome (logged-in, name variants ±Band/Duo/Trio + region/town suffixes) → §2A.1 evidence bar → on match VISIT the page: act's own page name (rename if it wins — §2A.5/§0.6), stable graph avatar (never scontent — §0.13), bio (short, the act's own description), genres (enum), actType, page-stated location (overrides gig-town guesses), website/instagram when trivially confirmed. Gig corrections found on the page (times/prices/cancellations) → apply to that artist's bndy events per §0.17. No confident page → record the failed attempt in the ledger so it isn't retried nightly (retry after 90 days or on new gig contact).
- VENUE: Google Places top-up (phone, website via enrich_venue), FB page to same bar, nameVariants for known aliases.
- Every write verified (§0.10); every enrichment decision logged in run report (§0.12 — never in bndy fields).

## Caps & discipline
50 records/night hard cap. Chrome+bridge required — fail-closed if either is missing. Run report to Projects/bndy/ nightly; ledger: Projects/bndy/enrichment-ledger.json.

## Backlog at drafting
~21 blank artists from 2026-07-29 runs + ~187 from the old image-task backlog + venues missing socials. At 50/night ≈ one week to clear, then it becomes maintenance.
