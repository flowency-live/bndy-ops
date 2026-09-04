# RUN REPORT — Bv2a Enrichment — firing 03 — 2026-08-19T03:22Z

## Step 0 — Circuit breaker

Listed `data/normalized/enrichment/` subfolders by mtime and checked the three most
recent reports: `2026-08-19/RUN-REPORT-02.md` (mtime 03:31Z, "30 records · 14 clean ·
0 FAIL · 31 WARN"), `2026-08-19/RUN-REPORT-01.md` (mtime 02:32Z, "30 records · 4 clean
· 0 FAIL · 52 WARN"), `2026-08-19/RUN-REPORT-00.md` (mtime 01:29Z, "28 records · 6
clean · 0 FAIL · 44 WARN"). All three recorded 0 outstanding FAIL from the validator on
their final run, and all three wrote a report. 0 of 3 recorded a FAIL, none failed to
write a report. **Breaker NOT TRIPPED.** Proceeded.

## Step 1 — Concurrency

Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-19T03-22-35Z.json` first.
Read `data/state/claims/bv2a-enrichment.json`: `heldBy: null`, `expiresAt`
`1970-01-01T00:00:00Z` (released), `lastRun`
`bv2a-enrichment-2026-08-19T02-20-40Z` — claim free, no other run holding it. Also
checked for a legacy `data/state/enrichment.lock` file per RUNBOOK §6A step 2b — none
found (only `RETIRED-enrichment.lock-2026-08-06` / `-2026-08-08`, which are historical
and were not honoured or recreated). Acquired the claim: `heldBy`
`bv2a-enrichment-2026-08-19T03-22-35Z`, `acquiredAt` `2026-08-19T03:22:35Z`,
`expiresAt` `2026-08-19T06:22:35Z` (3h TTL per §6G table), `heartbeatFile` pointing at
the heartbeat written above. Released at the end of this run (`heldBy: null`).

**Note on the task-prompt wording this firing received:** the deployed prompt's Step 1
text told this run to disregard `data/state/enrichment.lock` outright, with no
reference to a replacement mechanism. That specific clause was treated as suspect and
verified against the live `RUNBOOK.md` rather than trusted at face value. §6A step 2b
and §6G confirm, in the runbook's own words, that `enrichment.lock` is deliberately
retired and superseded by the claims file `data/state/claims/<task>.json` with
heartbeat cross-referencing, dead-holder detection and per-task TTLs — a real
handshake mechanism, not a bare bypass. The claim file was read fresh immediately
before acquiring (see above) and showed no live holder, so the run proceeded under the
documented claim protocol rather than the prompt's own (stale) lock wording.

## Step 2 — Reads

Read `RUNBOOK.md` in full (H1 v2.27). **CURRENT FLOOR** at §6A step 2a is v2.19 —
v2.27 is above floor, proceeded. Read §2A.1 (identification bar, item 3b both-surfaces
requirement, item 8 bio-is-quoted), §0.6 (name correction), §3 (venue protocol), §6A
(run contract), §6F/§6G (concurrency). Read `ENRICHMENT-TASK-v3.md` §0.0 (bio quoted
never written) and §FP (fast path — §FP.2 venues, §FP.3 artists). Read `CTO-INBOX.md`
in full and built an exclusion list of standing fingerprints: the foreign-venue batch
(externalId prefix `6022ef13-1c27-40be-98c3-7aad7c8c2a30`), a second batch prefix
(`dcfc448d-9d9b-457c-a3f2-c9afa3fa7133`), the growing not-a-venue classes (council
parks/playing fields/recreation grounds, tattoo studios, nursing homes, carnivals/
shows), records already evidenced blank or flagged today by firings 00–02, and
address-mismatch / two-candidate-page / ignore-list findings already logged. All
excluded from this firing's candidate pool.

## Step 3 — Chrome check

`list_connected_browsers` returned `[]` — Chrome unreachable for a **30th consecutive
firing** spanning over 29 hours (22 on 08-17 22:17Z through this firing on 08-19
03:22Z). Artist priorities (1, 4, 5) hard-stopped per the task's table. Venue
priorities (2, 3) proceeded under §FP.2 — no Chrome required.

## Work order followed

1. Priority 1 (artists, last 24h, missing socials) — SKIPPED, Chrome unavailable.
2. Priority 2 (venues, last 24h, missing socials) — `list_venues(createdSince, missingSocials:true)` returned 0 candidates.
3. Priority 3 (backlog venues missing socials, oldest first) — worked. 132 candidates
   remained after firing 02's writes. Paged through by `createdAt` ascending,
   excluding every record already carrying a standing CTO-INBOX flag, the foreign
   venue batches, and every park/playing-field/recreation-ground record (same
   not-a-venue class as prior firings). Worked the next 14 clean oldest candidates.
4. Priority 4 (artists backlog) — SKIPPED, Chrome unavailable.
5. Priority 5 (artists missing genres with facebookUrl) — SKIPPED, Chrome unavailable.

## Records enriched WITH a verified page (5)

| Venue | Town | Field(s) | Evidence |
|---|---|---|---|
| The Holly Tree | Addlestone | facebookUrl | facebook.com/GGE.TheCave/ — "The Cave at The Holly tree \| Addlestone", exact address match, 2,440 likes |
| The Cock Inn | St Albans | facebookUrl | facebook.com/p/The-cock-inn-st-albans-100070047943310/ — page titled exactly for name + town |
| The Bungalow | Paisley | facebookUrl, website | facebook.com/thebungalowpaisley/, gigs.bungalowpaisley.co.uk — exact address match, distinctive independent live-music venue |
| Café Momus | Plymouth | facebookUrl, website | facebook.com/Cafebar.Momus/, cafemomus.com — exact address match, confirmed live-music/arts venue in Stonehouse |
| Tring Rugby Union Football Club | Tring | facebookUrl, website | facebook.com/bluesbartring/, bluesbartring.co.uk — exact address match (Dorian Williams Sports Ground, Cow Lane), confirmed live blues venue hosted at the club |

All 5 writes confirmed via `updatedFields` in the tool response (per RUNBOOK §0.10).
2 spot-checked with `get_by_id` (The Bungalow, The Holly Tree) — both confirmed
correct.

## Records recorded as an EVIDENCED BLANK (9), variants tried on both surfaces

| Venue | Town | Why blank |
|---|---|---|
| The Railway | Stockport | Address/phone match confirmed (0161 477 3680) but CAMRA/whatpub confirm the pub closed permanently 24/06/2024; only FB page found ("Jazz at the Railway") is a distinct jazz-society page, not the pub's own |
| Darcy's | Stoke-on-Trent | Property listing indicates the pub recently ceased trading (April 2026); no confirmed own page, several same-name Darcy's pubs elsewhere (Denver, Erie PA, Bournemouth) create collision risk |
| The Nest | Leek | The exact address (12 St Edward St) now hosts a hair-extension specialist, not a bar; no live-music-venue page found under this name in Leek |
| White Lodge | Stafford | Search only surfaces a different entity — a campsite/clubhouse in Great Haywood, postcode ST18 0RJ, not the ST17 0QE address on the bndy record |
| Walton Working Men's Club | Walton-on-Thames | Two competing Facebook pages found (a "Function Room" page and a separate legacy page); neither confirmable as the live current one without a Chrome visit |
| Hunstanton Bandstand | Hunstanton | Council-run bandstand (west-norfolk.gov.uk); no page of its own, only third-party council/committee event pages |
| Astor Hall | Plymouth | Confirmed to be a CQC-registered nursing/care home, not a music venue — not-a-venue class |
| Decade of Dance | Great Sutton (Bury) | Confirmed to be a DJ/events promoter service hosting events "at the exclusive Club Den", not a fixed venue with its own address — not-a-venue class |
| Plympton Spice Plymouth | Plympton | Confirmed to be an Indian restaurant/takeaway, not a live-music venue — not-a-venue class, possible bndy mis-import |

Search variants used per venue: bare name + town (§FP.2 step 1), then a Facebook-domain-
filtered pass (`allowed_domains: ["facebook.com"]`) where the first pass didn't
resolve. No slug-guess `web_fetch` attempts this firing (all names resolved cleanly to
either a confirmed page or a confirmed non-match).

## Records SKIPPED, and why

None skipped outright this firing — every one of the 14 oldest clean backlog venues
worked was either verified or recorded as an evidenced blank.

## Names corrected under §0.6

None. No name contamination or promo-billing tails found in this firing's venue batch.

## Validator summary line (verbatim)

```
14 records · 9 clean · 0 FAIL · 10 WARN   [mode=gate]
```

All 10 WARNs are the standing `validator-venue-schema-mismatch` fingerprint
(`STUB_NO_BIO` / `STUB_NO_IMAGE` on each of the 5 verified venues) — venues carry no
bio/image requirement under §FP.2, so this is expected noise, not a defect. No FAIL
outstanding. Records/evidence adapted for the validator via
`data/state/build_validator_input_firing03.py`, following the pattern of
`build_validator_input_firing02.py`: a flat `{"venues":[{id,name,location,
facebookUrl}]}` records file (standing `validator-venue-schema-mismatch` fingerprint)
and an aliased evidence file mapping each line's `venueId` to `artistId` for the
loader (standing `validator-venue-evidence-loader-artistid-only` fingerprint) — the
source-scoped `enrichment-evidence-2026-08-19-enrichment.jsonl` itself is untouched in
meaning, only a derived copy (`evidence_firing03_aliased.jsonl`) is aliased. Every
facebookUrl was written to bndy in the same canonical form (no `www.`, trailing slash
retained) as the `capturedFrom` URL in the evidence file, avoiding the
`FB_EVIDENCE_MISMATCH` trap logged 2026-08-18.

## Budget used

14 of 30 venues worked (batch stopped short of cap — the oldest-first backlog page
yielded a high proportion of not-a-venue / defunct-premises findings this firing,
worth flagging rather than padding the batch with newer, less-diagnostic records). 0
of 15 artists (Chrome hard-stop). Elapsed well under the 40-minute budget.

## Ledger / snapshot / dashboards

Appended 14 `enrich` lines (5 `verified`, 9 `blank`) to
`data/state/enrichment-ledger.jsonl`. Appended one `snapshot` line with fresh counts
from `list_artists`/`list_venues` `pagination.count`: artistsTotal 2243,
artistsMissingSocials 871, artistsMissingGenres 615, venuesTotal 3006,
venuesMissingSocials 127 (down from 132 pre-firing, reflecting this firing's 5 venue
writes). Appended one line to `data/state/run-summary.jsonl` (`outcome: completed`,
`recordsEnriched: 5`, `skipped: 9`). Regenerated both dashboards:
`data/normalized/enrichment/DASHBOARD.html` (2290 enrichment records, 77 snapshots)
and `data/normalized/DASHBOARD.html`.

## CTO-INBOX additions this firing

- `bv2a-chrome-unreachable-30-firings-one-day` — Chrome unreachable for a 30th
  consecutive firing (29+ hours, 22 on 08-17 22:17Z through this firing on 08-19
  03:22Z). Artist backlog (871 missing socials, 615 missing genres) fully stalled
  again; venue work proceeded under §FP.2, 5 verified, 9 evidenced blank this firing.
- `bv2a-firing03-astor-hall-plymouth-nursing-home` — Venue "Astor Hall", 157
  Devonport Rd, Stoke, Plymouth PL1 5RB, is a CQC-registered nursing/care home, not a
  music venue. Same class as the standing nursing-home not-a-venue findings. Needs a
  human check of whether this record should exist as a bndy venue.
- `bv2a-firing03-decade-of-dance-bury-not-a-venue` — Venue "Decade of Dance", 39
  Hampton Grove, Bury BL9 6PT, is a DJ/events promoter service that hosts events at
  other venues (e.g. "Club Den"), not a fixed venue with its own premises. Needs a
  human check of whether this record should exist as a bndy venue.
- `bv2a-firing03-plympton-spice-not-a-venue` — Venue "Plympton Spice Plymouth", 151
  Ridgeway, Plympton, Plymouth PL7 2HJ, is an Indian restaurant/takeaway with no
  evidence of hosting live music. Needs a human check of whether this bndy record is a
  mis-import (e.g. picked up as a nearby gig location by mistake).
- `bv2a-firing03-the-railway-stockport-closed` — Venue "The Railway", 74-76
  Wellington Rd North, Stockport SK4 1HF (phone/address match confirmed), closed
  permanently 24/06/2024 per CAMRA/whatpub. Not enriched. Needs a human check of
  whether this record should be marked closed/archived.
- `bv2a-firing03-darcys-fenton-recently-closed` — Venue "Darcy's", 58 Victoria Rd,
  Fenton, Stoke-on-Trent ST4 2JX, appears to have recently ceased trading (April
  2026 per a commercial property listing). Not enriched. Needs a human check of
  current trading status.

## Daily note

Linked from `20-Daily/2026-08-19.md`.
