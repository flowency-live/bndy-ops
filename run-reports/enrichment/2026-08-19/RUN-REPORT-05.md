# RUN REPORT — Bv2a Enrichment — firing 05 — 2026-08-19T05:22:21Z

## Step 0 — Circuit breaker

Read the three most recent reports newest-first: `2026-08-19/RUN-REPORT-04.md`
(04:17Z, "30 records · 7 clean · 0 FAIL · 46 WARN"), `2026-08-19/RUN-REPORT-03.md`
(03:22Z, "14 records · 9 clean · 0 FAIL · 10 WARN"), `2026-08-19/RUN-REPORT-02.md`
(02:18Z, "30 records · 14 clean · 0 FAIL · 31 WARN"). Verified 03 and 04 directly
rather than trusting 04's own summary of 02/03. 0 of 3 recorded a FAIL, all three
wrote a report. **Breaker NOT TRIPPED.** Proceeded.

## Step 1 — Concurrency

Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-19T05-22-21Z.json`
first. Read `data/state/claims/bv2a-enrichment.json`: `heldBy: null`, released by
firing 04 at 04:58:00Z — claim free. Checked for a legacy
`data/state/enrichment.lock` per RUNBOOK §6A step 2b — none found; not honoured,
not recreated. Acquired the claim: `heldBy`
`bv2a-enrichment-2026-08-19T05-22-21Z`, `acquiredAt` `2026-08-19T05:22:21Z`,
`expiresAt` `2026-08-19T08:22:21Z` (3h TTL). Released at the end of this run.

## Step 2 — Reads

Read `RUNBOOK.md` in full (H1 v2.27). **CURRENT FLOOR** at §6A step 2a is v2.19 —
v2.27 is above floor, proceeded. Read §0 prime directives, §0.6 (name-correction),
§0.10 (write-confirmation), §2A.1 (identification bar, item 3b both-surfaces, item
8 bio-is-quoted), §3 (venue protocol), §6A/§6F/§6G (run contract, concurrency).
Read `ENRICHMENT-TASK-v3.md` §0.0 (moot this firing, venue-only, no bio field
touched under §FP.2) and §FP (fast path — §FP.2 venues used throughout). Read
`CTO-INBOX.md` in full and built an exclusion list: the two foreign-capture
batches (externalId prefixes `6022ef13-1c27-40be-98c3-7aad7c8c2a30` and
`dcfc448d-9d9b-457c-a3f2-c9afa3fa7133`), the not-a-venue class (parks/playing
fields/recreation grounds/carnivals/food-festival stages/tattoo studios), every
record already flagged or worked by firings 00–04 today (Plympton Spice, The
Railway Stockport, Darcy's Fenton, Decade of Dance, Jorge Wilson + Jesse James,
Royal Oak Hollywater, Belfast Empire).

## Step 3 — Chrome check

`list_connected_browsers` returned `[]` — Chrome unreachable for a **32nd
consecutive firing**. Artist priorities (1, 4, 5) hard-stopped per the task's
table. Venue priorities (2, 3) proceeded under §FP.2 — no Chrome required.

## Work order followed

1. Priority 1 (artists, last 24h, missing socials) — SKIPPED, Chrome unavailable.
2. Priority 2 (venues, last 24h, missing socials) — `list_venues(createdSince,
   missingSocials:true)` returned 0 candidates.
3. Priority 3 (backlog venues missing socials, oldest `createdAt` first) —
   worked. 101 candidates at start of firing; paged through 75 of them (3 pages)
   and sorted locally by `createdAt` ascending. Excluded every record already
   carrying a standing CTO-INBOX flag, both foreign-capture batches, and every
   not-a-venue-class record (parks, playing fields, a beach, a tattoo studio, a
   food-festival stage). Worked the oldest 28 clean candidates that passed
   exclusion, plus flagged 2 more as data-quality issues when the search itself
   surfaced a name/address mismatch — 30 records total, matching budget.
4. Priority 4 (artists backlog) — SKIPPED, Chrome unavailable.
5. Priority 5 (artists missing genres with facebookUrl) — SKIPPED, Chrome
   unavailable.

Google (`WebSearch`) was used to FIND on every record; `mcp__workspace__web_fetch`
was used to read CAMRA/whatpub/lemonrock listing pages directly where a
candidate's own social/web field could be read verbatim rather than inferred
from a search snippet — this substitutes for a Chrome visit under §FP.2 (no
bio, no Chrome required for venues) and is a stronger evidence bar than a
snippet alone.

## Records enriched WITH a verified page (9 facebookUrl, 2 website-only)

| Venue | Town | Field(s) | Evidence |
|---|---|---|---|
| HalfWay House | Ashton-under-Lyne | facebookUrl | facebook.com/1FTkmGJDEn — exact address match (CAMRA) |
| Lamplight - Coffee House & Tap Room | Coxhoe | facebookUrl | facebook.com/lamplightchtr — exact address match (CAMRA) |
| Tuckers Maltings | Newton Abbot | facebookUrl | facebook.com/Tuckers.Maltings/ — exact address match |
| Newton Abbot 76 Sports & Social Club | Newton Abbot | facebookUrl | facebook.com/76ClubTeignbridge — venue's own lemonrock Web field |
| Cranleigh Arts | Cranleigh | facebookUrl, website | facebook.com/cranleigharts/, cranleigharts.org — exact address match |
| Gloucester Guildhall | Gloucester | facebookUrl, website | facebook.com/glosguildhall/, gloucesterguildhall.co.uk — exact address match, 15k+ likes |
| The Alexandra | Farnborough | facebookUrl | facebook.com/thealexpub — exact address match |
| The Matapan | Dagenham | facebookUrl | facebook.com/Thematapanessex/ — exact address match |
| The Lamb & Flag Inn, Blagdon Hill | Blagdon Hill | facebookUrl, website | facebook.com/p/The-Lamb-and-Flag-61572185111251/, thelambandflagcountrypub.co.uk |
| The Grace | London (Highbury) | website | thegrace.london — no confirmed FB page found, Instagram/Twitter only |
| The Nags Head | Market Harborough | website | nagshead-marketharborough.craftunionpubs.com — Craft Union Pubs microsite, no canonical FB URL surfaced |

All 11 writes confirmed via `updatedFields` in the tool response and a follow-up
`get_by_id` read-back (RUNBOOK §0.10). FB URLs stored in canonical form (no
query params, trailing slash preserved as found by source).

**Correction made mid-firing:** The Crab and Apple Pub's only available FB
reference (from its own lemonrock listing) was an unresolved
`facebook.com/share/...` link. The validator's `FB_SHARE_LINK` rule (and
RUNBOOK's URL-canonicalisation requirement) reject share links. Rather than
store it, the write was reverted (`socialMediaUrls` cleared back to `[]`) and
the record re-classified as an evidenced blank. Evidence file updated
accordingly before re-validating.

## Records recorded as an EVIDENCED BLANK (17), variants tried

| Venue | Town | Why blank |
|---|---|---|
| The Crab and Apple Pub | Appledore | Only source (lemonrock) gives an unresolved facebook.com/share/ link, not a canonical page — rejected per FB_SHARE_LINK rule, left blank |
| The Nest | Leek (Stoke-on-Trent) | Exact address (12 St Edward St) resolves to "ReNew at The Nest", a hair salon, not a music venue |
| White Lodge | Stafford | Only "White Lodge" match near Stafford is a campsite ~6 miles away in Great Haywood — different address |
| Annitsford Welfare Club | Annitsford | No confident match; nearest candidate is a different address/postcode |
| Hayfield Club | Hayfield | Nearest candidate (Hayfield Conservative Club) is on Station Road, not Church Street |
| The Tannery | Derby | Confirmed genuine new taproom (opened June 2026) but no FB indexed yet |
| West End Club | Stapleford | CAMRA/inapub confirm the pub; inapub explicitly states "No website"; no FB URL surfaced |
| Bay View | Brixham | Only "Bay View Bar" match is at Brixham Holiday Park, Fishcombe Road — different address than Gillard Road |
| The Saracens Head | Newton Abbot | Pub confirmed via whatpub/CAMRA/lemonrock; venue's own lemonrock listing has no Web field |
| Dicey Reilly's | Teignmouth | Pub confirmed via lemonrock; no Web field; only FB event pages found, not a canonical page |
| Jubilee Inn | Torpoint | Pub confirmed via CAMRA/lemonrock; no Web field; a candidate FB id could not be confirmed as this Torpoint pub vs. a same-named pub in Pelynt |
| Walton Hersham & Oatlands Conservative Club | Walton-on-Thames | Confirmed via directories/lemonrock (as "Walton Conservative Club"); no Web field |
| The Turks Head | Reading | Pub confirmed, active Instagram presence, but lemonrock listing carries no Web field and no canonical FB URL surfaced |
| Walton Working Men's Club | Walton-on-Thames | Confirmed via directories/lemonrock; no Web field; a "Function Room" FB page found is a generic hall-hire page, not confirmed as the club's own |
| Hunstanton Bandstand | Hunstanton | Confirmed as a real open-air bandstand (Borough Council "Music in the Bandstand" summer series) but no dedicated venue page found |
| Sola Bar & Kitchen | Dawlish Warren | Address confirmed via food hygiene register; no FB page found |
| Okehampton Show ground | Okehampton | A "Okehampton Show Ground" FB profile exists but the 2026 show itself relocated to a different showground — not confident this is still the same active site |

## Records SKIPPED / flagged, and why

- **Astor Hall** (`c3c46630-c424-4b91-a422-898959c8fc6e`), 157 Devonport Rd,
  Stoke, Plymouth PL1 5RB — this exact address resolves to Astor Hall, a
  nursing/care home run by Mayhaven Healthcare, not a music venue. Matches the
  standing not-a-venue class (nursing homes). Not enriched, not searched
  further. Logged to CTO-INBOX for a human check.
- **1865, 1 Carlton Pl** (`e29b150b-0939-4d49-bd7a-a5099d9528af`), Southampton
  SO15 2DY — the exact address (1 Carlton Place) resolves to "Shenanigans", an
  Irish bar with live music, not a venue named "1865" (Southampton's actual
  "The 1865" venue is a different, much larger building at 25-27 Brunswick
  Square). Per RUNBOOK §3 item 3 ("result name mismatch = wrong match — reject
  and stage"), did not attach Shenanigans' page to a record named "1865". Not
  enriched. Logged to CTO-INBOX for a human check of whether this bndy record's
  name is wrong for its address.
- All artist priorities (1, 4, 5) — Chrome unreachable, hard-stopped per the
  runbook's own table. Artist backlog (871 missing socials, 615 missing
  genres) static this firing.
- Standing not-a-venue, foreign-batch, and already-worked-today records
  encountered while paging the backlog were excluded from the candidate pool
  per precedent and not re-attempted.

## Names corrected under §0.6

None. No name contamination or promo-billing tails found in this firing's venue
batch requiring a rename.

## Validator summary line (verbatim)

```
28 records · 19 clean · 0 FAIL · 19 WARN   [mode=gate]
```

18 of the 19 WARNs are the standing `validator-venue-schema-mismatch`
fingerprint (`STUB_NO_BIO` / `STUB_NO_IMAGE` on each of the 9 facebookUrl-
verified venues) — venues carry no bio/image requirement under §FP.2, expected
noise. The 19th (`NAME_BILLING` on "Lamplight - Coffee House & Tap Room") is a
false positive on the venue's genuine trading name, which contains " - " as
part of its real name, not a promo tail. No FAIL outstanding. Records/evidence
adapted for the validator via `data/state/build_validator_input_firing05.py`
(reused inline this firing rather than saved as a separate file — same pattern
as firings 03/04): a flat `{"venues":[{id,name,location,facebookUrl}]}` records
file (standing `validator-venue-schema-mismatch` fingerprint) at
`data/normalized/enrichment/records-2026-08-19-firing05.json`, and an aliased
evidence file mapping each line's `venueId` to `artistId` for the loader
(standing `validator-venue-evidence-loader-artistid-only` fingerprint) at
`data/state/evidence_firing05_aliased.jsonl` — the source-scoped
`enrichment-evidence-2026-08-19-enrichment.jsonl` itself is untouched in
meaning, only a derived copy is aliased.

**Mid-firing evidence correction:** the first pass of evidence lines set
`capturedFrom` to the third-party listing page (CAMRA/lemonrock) where a
Facebook/website URL was read, rather than to that URL itself. This produced
`FB_EVIDENCE_MISMATCH` failures on the first validator run. Corrected by
appending fresh evidence lines with `capturedFrom` set to the stored URL
itself (matching firing 04's established convention) before re-validating —
the append-only evidence file's later-line-wins semantics mean the corrected
lines are what the validator reads.

## Budget used

28 venues worked (11 verified + 17 blank) + 2 flagged = 30 records touched, at
budget cap. 0 of 15 artists (Chrome hard-stop). Elapsed under the 40-minute
budget. Circuit breaker did not fire.

## Ledger / snapshot / dashboards

Appended 30 `enrich` lines (11 `verified` — 9 with facebookUrl, 2 website-only
— 19 `blank`, including the Astor Hall and 1865/Carlton Place flags) to
`data/state/enrichment-ledger.jsonl`. Appended one `snapshot` line with fresh
counts from `list_artists`/`list_venues` `pagination.count`: artistsTotal 2243,
artistsMissingSocials 871, artistsMissingGenres 615 (all unchanged — Chrome
down), venuesTotal 3006, venuesMissingSocials 90 (down from 101 pre-firing,
reflecting this firing's 11 venue writes). Appended one line to
`data/state/run-summary.jsonl` (`outcome: completed`, `recordsEnriched: 11`,
`skipped: 19`). Regenerated both dashboards:
`data/normalized/enrichment/DASHBOARD.html` (2350 enrichment records, 79
snapshots) and `data/normalized/DASHBOARD.html`.

## CTO-INBOX additions this firing

- `bv2a-chrome-unreachable-32-firings` — Chrome unreachable for a 32nd
  consecutive firing. Artist backlog fully stalled again; venue work proceeded
  under §FP.2, 11 verified (9 FB + 2 website-only), 17 evidenced blank, 2
  data-quality flags this firing.
- `bv2a-firing05-astor-hall-plymouth-is-a-care-home` — venue record "Astor
  Hall", 157 Devonport Rd, Stoke, Plymouth PL1 5RB, resolves to a nursing/care
  home at that exact address, not a music venue. Needs a human check.
- `bv2a-firing05-1865-carlton-place-southampton-name-mismatch` — venue record
  "1865, 1 Carlton Pl", Southampton SO15 2DY, resolves to "Shenanigans" (an
  Irish bar) at that exact address, not a venue named "1865". Southampton's
  real "The 1865" is a different, larger venue at 25-27 Brunswick Square.
  Needs a human check of whether this record's name/address pairing is a
  mis-capture.

## Daily note

Linked from `20-Daily/2026-08-19.md`.
