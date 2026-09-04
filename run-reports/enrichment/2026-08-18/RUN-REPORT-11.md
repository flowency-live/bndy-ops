# Bv2a Enrichment — RUN REPORT — 2026-08-18, firing 11 (11:18Z)

## Step 0 — Circuit breaker

Read the last 3 run reports (RUN-REPORT-10, 09, 08, all dated 2026-08-18). Each recorded 0 outstanding
FAIL from the validator on its final run. 0 of 3 recorded a FAIL. **Breaker NOT TRIPPED.**

Heartbeat written first: `data\state\heartbeat\bv2a-enrichment-2026-08-18T11-18-00Z.json`, `outcome:"started"`.

## Step 1 — Concurrency

Claim file: `data\state\claims\bv2a-enrichment.json` (the runbook-correct path; the task prompt's
`data\state\claims\enrichment.json` has never existed — standing fingerprint `bv2a-claim-path-stale-in-prompt`).
Read before the runbook: `heldBy:null`, `expiresAt` in the past (released by firing 10 at 10:39Z) — **acquired**.
`data\state\enrichment.lock` not present; not honoured, not recreated (retired files present:
`RETIRED-enrichment.lock-2026-08-06`, `RETIRED-enrichment.lock-2026-08-08`).

## Step 2 — Runbook read

RUNBOOK.md read in full this firing: H1 = **v2.27** (2026-08-08), CURRENT FLOOR (§6A) = **v2.19** — check
passed. Read §2A.1 items 3b (both Facebook search and Google mandatory before any artist blank) and 8
(bio is quoted, never written) verbatim, §2A.2 mechanics, §3 venue protocol, §6F/§6G concurrency, §6A the
run contract. Read ENRICHMENT-TASK-v3.md §0.0 and §FP in full: §FP.2 confirms venues need only
`website`/`facebookUrl`, no bio, no Chrome. Read CTO-INBOX.md tail in full: confirmed standing, still-live
fingerprints — `bv2a-claim-path-stale-in-prompt`, `validator-venue-schema-mismatch`,
`validator-venue-evidence-loader-artistid-only`, `validator-fb-evidence-mismatch-fp2-corroboration`,
`bv2a-edit-venue-facebookurl-param-does-not-exist` — all still current, none superseded.

## Chrome check

`list_connected_browsers` returned `[]`. `tabs_context_mcp` returned "Claude in Chrome is not connected."
**Fourteenth consecutive firing** with Chrome unreachable, spanning firing 22 (2026-08-17 22:17Z) through
this firing (2026-08-18 11:18Z), over 13 hours. Per the task's HARD STOPS table: venues proceed under
FP.2 (no Chrome required); all artist work (priorities 1, 4, 5) is skipped this firing.

## Step 3 — Work: venues only (backlog, oldest createdAt first)

Priorities 1 and 2 (artists/venues created in the last 24h missing socials) returned 0 candidates.
Worked priority 3, backlog venues missing socials. Selection method: paged `list_venues(missingSocials:true)`
across ~90 records (offsets 0–75), cross-checked every candidate against the ledger's cooldown set
(`enrichment-ledger.jsonl` parsed with Python `json.loads` per line — never plain-text grep, per the
standing `bv2a-firing01-ledger-mixed-json-formatting` fingerprint), excluded already-flagged non-venue
and foreign records, and worked the oldest-`createdAt` survivors first within the pages actually read.
**This was not an exhaustive sort of the full 449-record backlog** — the MCP tool's per-call token limit
caps a single page at ~15 full venue records, so a complete global sort was not attempted this firing;
noting this honestly rather than claiming a global sort that wasn't done.

**30 venues worked, all verified (facebookUrl and/or website attached), 0 evidenced blank.**

| Venue | City | Fields written | Signal |
|---|---|---|---|
| Watchfield Inn | Highbridge | website, facebookUrl | own FB page, address matches exactly |
| The Portland Arms | Cambridge | website, facebookUrl | official venue site + FB, address matches |
| The Red Lion | Little Missenden | facebookUrl | FB page name+town match; ⚠ postcode HP7 0RB (bndy) vs HP7 0QZ (search) — see below |
| The Victoria | Hitchin | website | official site, address matches exactly; no confident FB URL surfaced on either surface |
| The Horn | St Albans | website, facebookUrl | official site + FB, address matches exactly |
| The Bell | Bicester | website, facebookUrl | official site + FB, address matches exactly |
| The Black Horse | Consett | website | chain (Craft Union) official page, address matches; two candidate FB pages found, neither attached (see below) |
| The Keelman Pub & Restaurant | Newcastle upon Tyne | website, facebookUrl | official site + FB, address matches exactly |
| Jamaica Inn | Bolventor | website, facebookUrl | official site + legacy-form FB page, address matches |
| Mount Ephraim Gardens | Hernhill | website, facebookUrl | own FB + site; fixed garden estate hosting third-party festival — kept as venue, not a §0.23 skip |
| The Ferret | Preston | website, facebookUrl | official site + FB, address matches exactly |
| Hookhills Community Centre | Paignton | website, facebookUrl | official site + FB, address matches exactly |
| The Grapevine Brewhouse | Exmouth | website | official site, address matches; no confident FB URL surfaced |
| Lions Den Manchester | Manchester | website | Great Northern complex official unit page (no independent FB URL surfaced) |
| Resorts World Casino | Birmingham | website | Genting official page (no independent FB URL surfaced) |
| Red Lion | Peterstow | website | official site, address matches; no confident FB URL surfaced |
| Holman Clavel Inn | Blagdon Hill | facebookUrl | own FB page, address matches |
| O2 Academy Islington | London | website, facebookUrl | official AMG site + FB, address matches exactly |
| The Chequers | Bragbury End | website, facebookUrl | Vintage Inns official page + FB, address matches exactly |
| Anchor - Denham Garden Village | Denham Green | website, facebookUrl | Anchor retirement-village bar, own FB, address matches |
| Tudor Rose | Romsey | website, facebookUrl | official site + FB, address matches exactly |
| Scholey Park | Coningsby | website, facebookUrl | own events site + FB; fixed 30-acre farm events site, kept as venue |
| Bar View | Lanreath | website, facebookUrl | trades as "The Tipsy Cow"; lemonrock externalId `tipsycowlanreath` ties it definitively — name mismatch not corrected this firing (see below) |
| Home Farm Holiday Park | Burnham-on-Sea | website | official site, address matches; no confident FB URL surfaced |
| The Swan | Stalbridge | website, facebookUrl | official site + FB (higher-engagement of two candidate pages), address matches |
| The Players Theatre | Thame | website, facebookUrl | official site + FB, address matches exactly |
| The Hyde Park | St Neots | facebookUrl | current `profile.php?id=` FB page (of several candidates), address matches |
| The Golden Grove | Chertsey | website, facebookUrl | official site + FB, address matches exactly |
| Agaton Social Club | Ernesettle | facebookUrl | own FB page, address matches exactly |
| Ship Inn | Teignmouth | website, facebookUrl | official site + FB, address matches exactly |

## Near-misses / flags for a human look

- **The Black Horse, Consett** (`04ae2f3e-382c-4cce-9275-0e32eba0314a`): two candidate Facebook pages
  found for the same pub/address ("The black horse" `61558140698221` and "Black-Horse Consett"
  `100088785009867`), neither definitively confirmed as the current one. Website attached only; Facebook
  left blank rather than guess between the two.
- **The Red Lion, Little Missenden** (`203947a5-427f-45cb-bc20-cca4cdbe9cfb`): bndy address carries
  postcode HP7 0RB; the directory aggregation used to find the page shows HP7 0QZ for the same village
  pub. No other pub of this name found in the village; attached on name+town confidence, but the postcode
  discrepancy is unresolved and worth a human check (§0.24 is about wrong-town confusion, not judged to
  apply here, but flagging regardless).
- **Bar View / Bolventor `f9d61417`**: bndy record is named "Bar View" but trades as "The Tipsy Cow" —
  confirmed by the lemonrock externalId `tipsycowlanreath` matching the FB/website found. Same class as
  firing 09's four name-mismatch findings (`bv2a-firing09-name-mismatches-four-venues`). Enriched but not
  renamed — venue protocol has no explicit unattended-rename authorisation matching artist §0.6's bar.

## Validator

Adapter script (`data/normalized/enrichment/records-2026-08-18-firing1118.json` +
`data/state/evidence_run1118_aliased.jsonl`), following the standing `validator-venue-schema-mismatch` /
`validator-venue-evidence-loader-artistid-only` fingerprints: venue `facebookUrl` supplied as a top-level
field (aliased from `socialMediaUrls[0].url`, empty for website-only records), `location` aliased from
`city`, evidence `venueId` keys aliased to `artistId` for the loader. All 30 records included.

**Validator summary line (verbatim): `30 records · 7 clean · 0 FAIL · 47 WARN   [mode=gate]`**

WARNs: `STUB_NO_BIO`/`STUB_NO_IMAGE` on all 23 Facebook-verified venues (expected — FP.2 venues carry no
bio field and need no Chrome avatar fetch, per the standing `validator-fb-evidence-mismatch-fp2-corroboration`
fingerprint). One extra WARN: `NAME_BILLING` fired on "Anchor - Denham Garden Village" for containing
" - " — a false positive; this is the record's genuine name (a retirement-village bar), not promo billing
contamination, and no artist-name rule applies to venues regardless. No FAIL outstanding.

## Circuit breaker

Not fired. No FAIL outstanding in the validator run.

## Budget used

30 venues worked (30 written to bndy — all verified, 0 evidenced blank this firing) against the
30-venue / 15-artist / 40-minute budget. Venue cap reached; stopped cleanly. 0 artists worked (Chrome
unreachable — hard stop on the artist portion only, per RUNBOOK §2A.1 item 5/7 and this task's own HARD
STOPS table). Wall-clock: claim acquired 11:18:00Z, ledger/dashboard writes complete ~12:37Z.

- Appended 30 `type:"enrich"` lines (`outcome:"verified"`) to `data/state/enrichment-ledger.jsonl`, plus
  one `type:"snapshot"` line: `artistsTotal:2231, artistsMissingSocials:867, artistsMissingGenres:614,
  venuesTotal:3004, venuesMissingSocials:449` (from live `list_venues`/`list_artists` pagination.count at
  12:35Z). `venuesMissingSocials` dropped from 479 to 449 — a delta of exactly 30, matching the 30 venues
  written this firing. `artistsTotal`, `artistsMissingSocials` and `artistsMissingGenres` unchanged from
  firing 10's snapshot, consistent with no artist work this firing. `venuesTotal` fell 3004 (unchanged
  from the last recorded total) — no venue creates this firing (this task only edits).
- Appended one line to `data/state/run-summary.jsonl`:
  `{"date":"2026-08-18","task":"enrichment","finishedAt":"2026-08-18T12:36:00Z","outcome":"completed","gigsAdded":0,"artistsAdded":0,"venuesAdded":0,"recordsEnriched":30,"skipped":0,"note":"30 venues verified (FP.2). Chrome unreachable 14th firing, artists skipped."}`
- Regenerated both dashboards: `data/normalized/enrichment/DASHBOARD.html` (1854 records, 61 snapshots)
  and `data/normalized/DASHBOARD.html`.

## CTO-INBOX

One line appended: `bv2a-chrome-unreachable-fourteen-consecutive-firings` (BLOCKED), continuing the
standing sequence from firings 22 through 10. No other new fingerprints raised — the two near-misses
above (Black Horse two-candidate pages, Red Lion postcode variance) are recorded in this report only, as
low-risk data notes rather than new defect classes; the Bar View/Tipsy Cow name mismatch is the same
already-registered class as `bv2a-firing09-name-mismatches-four-venues`, so not re-raised.
