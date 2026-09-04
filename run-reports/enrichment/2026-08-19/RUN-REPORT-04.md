# RUN REPORT — Bv2a Enrichment — firing 04 — 2026-08-19T04:17:59Z

## Step 0 — Circuit breaker

Listed `data/normalized/enrichment/` subfolders by mtime and checked the three most
recent reports: `2026-08-19/RUN-REPORT-03.md` (03:22Z, "14 records · 9 clean · 0 FAIL
· 10 WARN"), `2026-08-19/RUN-REPORT-02.md` (02:18Z, "30 records · 14 clean · 0 FAIL ·
31 WARN"), `2026-08-19/RUN-REPORT-01.md` (01:20Z, "30 records · 4 clean · 0 FAIL · 52
WARN"). All three recorded 0 outstanding FAIL from the validator on their final run,
and all three wrote a report. 0 of 3 recorded a FAIL, none failed to write a report.
**Breaker NOT TRIPPED.** Proceeded.

## Step 1 — Concurrency

Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-19T04-17-59Z.json` first.
Read `data/state/claims/bv2a-enrichment.json`: `heldBy: null`, `expiresAt`
`1970-01-01T00:00:00Z` (released by firing 03 at 03:30:41Z) — claim free. Checked for
a legacy `data/state/enrichment.lock` per RUNBOOK §6A step 2b — none found. The
deployed task prompt's Step 1 text again told this run to disregard
`data/state/enrichment.lock` with no reference to a replacement mechanism; per
firing 03's finding this clause is superseded by §6A step 2b / §6G's claim-file
protocol, verified fresh against the live RUNBOOK.md rather than trusted at face
value. Acquired the claim: `heldBy` `bv2a-enrichment-2026-08-19T04-17-59Z`,
`acquiredAt` `2026-08-19T04:17:59Z`, `expiresAt` `2026-08-19T07:17:59Z` (3h TTL per
§6G table), `heartbeatFile` pointing at the heartbeat written above. Released at the
end of this run (`heldBy: null`).

## Step 2 — Reads

Read `RUNBOOK.md` in full (H1 v2.27). **CURRENT FLOOR** at §6A step 2a is v2.19 —
v2.27 is above floor, proceeded. Read §0 (prime directives), §1/§1A (identity,
same-name protocol), §2A.1 (identification bar, item 3b both-surfaces requirement,
item 8 bio-is-quoted), §3 (venue protocol), §6A (run contract, concurrency, floor),
§6F/§6G (concurrency mechanics). Read `ENRICHMENT-TASK-v3.md` §0.0 (bio quoted never
written — moot this firing, venue-only, no bio field touched under §FP.2) and §FP
(fast path — §FP.2 venues used throughout, §FP.3 artists not reached). Read
`CTO-INBOX.md` in full and built an exclusion list of standing fingerprints: the two
foreign-capture batches (externalId prefixes `6022ef13-1c27-40be-98c3-7aad7c8c2a30`
and `dcfc448d-9d9b-457c-a3f2-c9afa3fa7133`), the growing not-a-venue class (council
parks/playing fields/recreation grounds, nursing homes, tattoo studios, a retirement
village, carnivals/shows, a beach, a food-festival stage), address-mismatch /
two-candidate-page / entity-mismatch / possible-closure findings already logged, and
every record already evidenced blank or verified by firings 00–03 today. All excluded
from this firing's candidate pool.

## Step 3 — Chrome check

`list_connected_browsers` returned `[]` — Chrome unreachable for a **31st consecutive
firing** spanning over 30 hours (22 on 08-17 22:17Z through this firing on 08-19
04:17Z). Artist priorities (1, 4, 5) hard-stopped per the task's table. Venue
priorities (2, 3) proceeded under §FP.2 — no Chrome required.

## Work order followed

1. Priority 1 (artists, last 24h, missing socials) — SKIPPED, Chrome unavailable.
2. Priority 2 (venues, last 24h, missing socials) — `list_venues(createdSince,
   missingSocials:true)` returned 0 candidates.
3. Priority 3 (backlog venues missing socials, oldest `createdAt` first) — worked.
   127 candidates found; paged through 120 of them (4 pages of 30) and sorted locally
   by `createdAt` ascending. Excluded every record already carrying a standing
   CTO-INBOX flag, both foreign-capture batches, and every not-a-venue-class record.
   Worked the oldest 30 clean candidates that passed exclusion.
4. Priority 4 (artists backlog) — SKIPPED, Chrome unavailable.
5. Priority 5 (artists missing genres with facebookUrl) — SKIPPED, Chrome unavailable.

## Records enriched WITH a verified page (23 facebookUrl, 3 website-only)

| Venue | Town | Field(s) | Evidence |
|---|---|---|---|
| The Graduate | Sheffield | facebookUrl | facebook.com/The-Graduate-124311303660 — exact address, phone matches |
| Rising Sun Inn Launceston | Altarnun | facebookUrl, website | facebook.com/RISINGSUNALTARNUN/, therisingsuninn.co.uk |
| The White Hart | Hackleton | facebookUrl, website | facebook.com/TheWhiteHartHackleton/, thewhiteharthackleton.co.uk — 2068 likes, exact address |
| Benton Ale House | Longbenton | facebookUrl, website | facebook.com/TheBentonAleHouseAtLongBenton/, bentonalehousenewcastle.co.uk — phone match |
| The Steel Bar Venue Corby | Corby | facebookUrl, website | facebook.com/TheSteelBarCorby/, thesteelbarvenue.co.uk |
| Walnut Tree Inn | Blisworth | facebookUrl, website | facebook.com/walnuttreeinnnorthampton/, walnut-tree.co.uk |
| Rose & Crown Hartwell | Hartwell | facebookUrl, website | facebook.com/people/Rose-and-Crown-Hartwell/100089988900680/, rosecrownhartwell.co.uk |
| The Little Ale House | Wellingborough | facebookUrl | facebook.com/TheLittleAleHouse/ — exact address |
| Hulme Hall | Port Sunlight | facebookUrl, website | facebook.com/1855577608000621/, hulmehall.com |
| Dunstable United Services Club | Dunstable | facebookUrl, website | facebook.com/p/United-Services-Club-100057651931211/, unitedservicesclub.co.uk |
| Goodwood Motor Circuit | Chichester | facebookUrl | facebook.com/GoodwoodMotorCircuit/ — 50k+ likes, exact address |
| The Wellington Arms | Freemantle | facebookUrl, website | facebook.com/TheWellySouthampton/, thewellyarms.co.uk |
| Haven Weymouth Bay Holiday Park | Overcombe | facebookUrl | facebook.com/WeymouthBayHolidayPark/ — official Haven page |
| Millbridge Inn | Stoke (Plymouth) | facebookUrl, website | facebook.com/millimusic1/, themillbridgeinn.com — exact address+phone |
| Waggon & Horses | Addlestone | facebookUrl, website | facebook.com/p/Waggon-and-Horses-100057529235826/, waggonaddlestone.co.uk |
| The St Ives Ivy Leaf Club Ltd | St Ives | facebookUrl, website | facebook.com/stivesivyleafclub/, stivesivyleafclub.com |
| Railway Tavern | Leigh | facebookUrl | facebook.com/p/The-Railway-Tavern-61558715822708/ — phone match |
| Kings Langley Services Club | Kings Langley | facebookUrl | facebook.com/KingsLangleyServicesClub/ — exact address |
| The Crooked Crow Bar | Leighton Buzzard | facebookUrl, website | facebook.com/crookedcrowbar/, crookedcrowbar.com |
| The Racehorse | Carshalton | facebookUrl, website | facebook.com/TheRacehorsePub/, theracehorsepub.com — phone match |
| The Bear & Blacksmith | Chillington | facebookUrl, website | facebook.com/thebearandblacksmithchillington/, thebearandblacksmith.co.uk |
| Druids Head | Kingston upon Thames | facebookUrl | facebook.com/144054662321689/ — exact address |
| Burnham on Crouch Constitutional Club | Burnham-on-Crouch | facebookUrl | facebook.com/BOCconclub/ |
| The King & Queen, Caterham on the Hill | Caterham | website | kingandqueencaterham.co.uk — no single confirmed own FB page (ambiguous/duplicate candidates), website only |
| WeBrew Kingston | Kingston upon Thames | website | webrew.co.uk/venues/kingston/ — no FB page found on either surface |
| The Exchange Bar & Kitchen | Southend-on-Sea | website | exchangepub.co.uk — no FB page found on either surface |

All 26 writes confirmed via `updatedFields` in the tool response (per RUNBOOK §0.10).
Every facebookUrl was written in the canonical form (no `www.` where the source page
omitted it, trailing slash preserved as found) matching the `capturedFrom` URL in the
evidence file.

## Records recorded as an EVIDENCED BLANK (3), variants tried on both surfaces

| Venue | Town | Why blank |
|---|---|---|
| Alderney Community Association | Poole | Multiple similarly-named entities found (Alderney West Community Centre, Alderney Manor Social Club, Alderney Manor Community Association group) but none confirmed at the bndy record's exact address, 287 Herbert Ave BH12 4HT |
| The Diversion Bars ltd | Macclesfield | Company registration and a venue-listing entry found, but no Facebook page or website surfaced on either surface |
| The Royal Oak Hollywater | Bordon | Two distinct candidate Facebook pages found, neither independently confirmable as current without a Chrome visit |

## Records SKIPPED / flagged, and why

- "Jorge Wilson + Jesse James" (`befdd87f-2d49-4a0e-ab7a-fcbe2dac32bf`) — this bndy
  venue record's name and address (Osprey House, 217-227 Broadway, Salford M50 2UE)
  resolve only to "Wilson James Ltd", a security/logistics company — not a music venue
  or an act. Read as a data-quality/mis-capture issue rather than an enrichable
  record. Not enriched, not searched further. Logged to CTO-INBOX for a human check.
- All artist priorities (1, 4, 5) — Chrome unreachable, hard-stopped per the runbook's
  own table. Artist backlog (871 missing socials, 615 missing genres) static this
  firing.
- Standing not-a-venue, foreign-batch, ambiguous-name and already-worked-today records
  encountered while paging the backlog were excluded from the candidate pool per
  precedent and not re-attempted (full exclusion list in Step 2 above).

## Names corrected under §0.6

None. No name contamination or promo-billing tails found in this firing's venue
batch. (The "Jorge Wilson + Jesse James" record is a suspected garbled capture, not a
billing-contamination case, and venue protocol has no unattended-rename
authorisation — logged for a human decision instead.)

## Validator summary line (verbatim)

```
30 records · 7 clean · 0 FAIL · 46 WARN   [mode=gate]
```

All 46 WARNs are the standing `validator-venue-schema-mismatch` fingerprint
(`STUB_NO_BIO` / `STUB_NO_IMAGE` on each of the 23 facebookUrl-verified venues) —
venues carry no bio/image requirement under §FP.2, so this is expected noise, not a
defect. No FAIL outstanding. Records/evidence adapted for the validator via
`data/state/build_validator_input_firing04.py`, following the pattern of
`build_validator_input_firing03.py`: a flat `{"venues":[{id,name,location,
facebookUrl}]}` records file (standing `validator-venue-schema-mismatch`
fingerprint) and an aliased evidence file mapping each line's `venueId` to
`artistId` for the loader (standing `validator-venue-evidence-loader-artistid-only`
fingerprint) — the source-scoped `enrichment-evidence-2026-08-19-enrichment.jsonl`
itself is untouched in meaning, only a derived copy
(`evidence_firing04_aliased.jsonl`) is aliased.

## Budget used

30 of 30 venues (budget cap reached). 0 of 15 artists (Chrome hard-stop). Elapsed
well under the 40-minute budget. Circuit breaker did not fire.

## Ledger / snapshot / dashboards

Appended 30 `enrich` lines (26 `verified` — 23 with facebookUrl, 3 website-only — 4
`blank`, including the Jorge Wilson + Jesse James flag) to
`data/state/enrichment-ledger.jsonl`. Appended one `snapshot` line with fresh counts
from `list_artists`/`list_venues` `pagination.count`: artistsTotal 2243,
artistsMissingSocials 871, artistsMissingGenres 615, venuesTotal 3006,
venuesMissingSocials 101 (down from 127 pre-firing, reflecting this firing's 26 venue
writes — missingSocials requires both socialMediaUrls and website empty, so the
3 website-only writes also cleared the filter). Appended one line to
`data/state/run-summary.jsonl` (`outcome: completed`, `recordsEnriched: 26`,
`skipped: 4`). Regenerated both dashboards:
`data/normalized/enrichment/DASHBOARD.html` (2320 enrichment records, 78 snapshots)
and `data/normalized/DASHBOARD.html`.

## CTO-INBOX additions this firing

- `bv2a-chrome-unreachable-31-firings-one-day` — Chrome unreachable for a 31st
  consecutive firing (30+ hours). Artist backlog fully stalled again; venue work
  proceeded under §FP.2, 26 verified (23 FB + 3 website-only), 3 evidenced blank, 1
  data-quality flag this firing.
- `bv2a-firing04-jorge-wilson-jesse-james-garbled-venue-name` — venue record whose
  name/address resolve only to an unrelated security company, not a music venue.
  Needs a human check of whether this is a mis-capture.
- `bv2a-firing04-royal-oak-hollywater-two-candidate-pages` — two competing Facebook
  pages, left blank pending a Chrome visit.
- `bv2a-firing04-belfast-empire-uk-venue-in-excluded-foreign-batch` — the standing
  excluded foreign-capture batch (`6022ef13-...`) contains at least one genuine UK
  venue (Belfast Empire Music Hall) that has been skipped by blanket batch exclusion
  every firing since it was first flagged. Flagged for a human check of whether the
  batch exclusion should be narrowed to actually-foreign addresses only.

## Daily note

Linked from `20-Daily/2026-08-19.md`.
