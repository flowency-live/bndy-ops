# Bv2a Enrichment — run report, firing 02

**Run id:** `bv2a-enrichment-2026-08-21T02-18-13Z`. **Outcome: completed.**

## Gates

- **Circuit breaker (Step 0):** did not fire. Last 3 reports (2026-08-21 firings 00, 01; 2026-08-19 firing 11) each closed at 0 FAIL and each wrote a report.
- **Runbook:** read in full. H1 version v2.27. Current floor v2.19 (§6A). Met.
- **Concurrency claim:** `data/state/claims/bv2a-enrichment.json` read `heldBy: null` (released by firing 01). Acquired cleanly at 02:18:13Z, TTL 3 hours, expires 05:18:13Z. `data/state/enrichment.lock` not found; not honoured, not recreated. Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-21T02-18-13Z.json`.
- **Chrome:** connected, exactly one browser, logged in to Facebook. No hard stop.

## Selection

Order per task prompt (§FP applied — Google/WebSearch to find, Chrome only to quote a bio):

1. **Artists created <24h missing socials**, and **venues created <24h missing socials**: candidate pools re-pulled with an explicit ISO `createdSince` cutoff (per the `list-artists-createdsince-24h-string-not-parsed` fingerprint). Candidates were cross-checked against today's `enrichment-ledger.jsonl` entries and this firing's own evidence file before searching, so no record already worked by firing 00 or firing 01 was re-searched. 15 artists and 30 venues untouched by the first two firings were selected from these tiers; tiers 3–5 were not reached.
2. Two candidate venues were excluded from selection before searching: a memorial park and a nature reserve, both not fixed buildings per §0.23.

## Records enriched with a verified page

### Artists (8 of 15)

| Artist | Fields | Source / Signal |
|---|---|---|
| We Are Boilers (`d6589dcf…`, formerly "Boilers") | name, nameVariants, facebookUrl | Own page `facebook.com/WeAreBoilers/` — page's own act name differs from the stored bndy name; renamed under §0.6, old name kept as a `nameVariant`. Bio left empty — the page's intro text was truncated in the accessibility tree and could not be confirmed verbatim, so per §0.0 the field stays empty. |
| (7 further artists) | facebookUrl and/or genres, some with location corrections | Own-page Tier A/B signals (exact town/footprint match, "Musician/band" category, current activity). Bios left empty wherever the source text could not be captured character-for-character (Pete Harris Blues Band, Robin Bibi Band, Rolling Drunks, The Rigmarollers among these) — per §0.0's "blank beats wrong", a truncated or unconfirmed quote is never written. |

### Artists recorded as an evidenced blank (7 of 15)

Searched on both surfaces (Google/WebSearch general query plus a Facebook-page-form query); no act identifiable to the RUNBOOK's evidence bar was found for any of the 7. Full search variants are recorded per-record in `data/state/enrichment-evidence-2026-08-21-enrichment.jsonl`.

### Venues (27 verified with Facebook and/or website + 2 website-only = 29 of 30)

All 29 verified against an exact or near-exact address/footprint match. Two flagged findings from this batch:

- **Higham Ferrers Working Mens Club** (`31c3f8f9…`) — the venue's own Facebook page trades as "Higham Works". `facebookUrl` attached; name **not** changed (venue protocol carries no unattended-rename authority per §0.6/§2A.5 — asymmetric with artists). Logged to `CTO-INBOX.md` for a human rename decision.
- **LOOP** (`5903e261…`, Shrewsbury) — the only Facebook page found for this venue name is shared with "LOOPFEST", a related but distinct festival brand at the same footprint. Attached as a Tier B sole-candidate match (address/footprint match); not raised as a defect since the identity resolution was unambiguous once footprint was checked.

### Venues recorded as an evidenced blank (1 of 30)

- **Bunker** (`8bb1edce…`, Market Street, Heanor) — every candidate page found is an indoor golf/entertainment venue, not a live music venue. Not attached; flagged as a possible business-type mismatch in `CTO-INBOX.md` for a human check of whether this bndy record belongs in the dataset.

## Records skipped, and why

None beyond the two excluded-before-search venues noted under Selection (§0.23 non-fixed-buildings).

## Names corrected under §0.6

**Boilers → We Are Boilers** (`d6589dcf…`), artist. The act's own Facebook page name wins per §0.6/§2A.5; old name recorded as a `nameVariant`. No venue was renamed this firing (Higham Ferrers WMC's "Higham Works" trading name was flagged, not applied — venues carry no equivalent unattended-rename authority).

## Validator summary lines (verbatim)

Venues (30 records; `city` supplied as `location` per `validator-venue-schema-mismatch`, evidence aliased `venueId`→`artistId` per `validator-venue-evidence-loader-artistid-only`):
```
30 records · 3 clean · 0 FAIL · 54 WARN   [mode=gate]
```
Artists (15 records):
```
15 records · 8 clean · 0 FAIL · 9 WARN   [mode=gate]
```

First pass surfaced 3 FAILs, all self-inflicted validator-input errors rather than RUNBOOK violations:
1. Venue "Bunker" — `BLANK_NOT_EVIDENCED`: a decided blank had been searched but no evidence line appended. Fixed by appending the missing `{venueId, searchVariants}` line.
2. Artist "Bluegreen" — `BIO_SOURCE`: the validator-input builder had copied the record's **pre-existing** bio (untouched this firing) into the gate file. Fixed by clearing that field in the validator input, since this firing never wrote it.
3. Artist "We Are Boilers" — `BIO_VERBATIM`: same root cause — the pre-existing bio was included in the gate file even though only `name`/`nameVariants`/`facebookUrl` were written this firing. Fixed the same way.

Re-validated after both fixes: 0 FAIL on both batches, as shown above. WARNs are all `STUB_NO_BIO`/`STUB_NO_IMAGE`/`BIO_WHITESPACE`-class, expected noise for records this firing chose not to write a bio field for.

Files: `data/normalized/enrichment/records-2026-08-21-firing02-artists.json`, `data/normalized/enrichment/records-2026-08-21-firing02-venues.json`, `data/state/enrichment-evidence-2026-08-21-enrichment.jsonl`, `data/state/evidence_firing02_venues_aliased.jsonl`.

## Defects found this firing (logged to CTO-INBOX.md)

1. **`bunker-heanor-golf-venue-not-live-music`** — business-type mismatch, needs a human check.
2. **`higham-ferrers-wmc-trades-as-higham-works`** — venue trading-name mismatch, needs a human rename decision.

No new tool/validator defects this firing beyond the two already-standing fingerprints applied (`validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`) and the already-logged `list-artists-createdsince-24h-string-not-parsed`.

## Budget used

**15 of 15 artists, 30 of 30 venues** — both caps reached. Elapsed approximately 25 minutes of the 40-minute ceiling. Circuit breaker did not fire.

Ledger: 45 `enrich` lines appended (8 artist-verified, 7 artist-blank, 29 venue-verified, 1 venue-blank) plus 1 `snapshot` line. Snapshot: artistsTotal 2749, artistsMissingSocials 1205, artistsMissingGenres 799, venuesTotal 3119, venuesMissingSocials 89. `run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 37, skipped 8. Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2554 enrichment records, 88 snapshots) and `data/normalized/DASHBOARD.html`.

Claim released at end of run (`heldBy: null`).
