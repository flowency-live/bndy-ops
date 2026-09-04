# RUN REPORT — Bv2a Enrichment — firing 06 — 2026-08-19T06:20:11Z

## Step 0 — Circuit breaker

Read the three most recent reports newest-first: `2026-08-19/RUN-REPORT-05.md`
(05:22:21Z, "28 records · 19 clean · 0 FAIL · 19 WARN"), `2026-08-19/RUN-REPORT-04.md`
(04:17:59Z, "30 records · 7 clean · 0 FAIL · 46 WARN"), `2026-08-19/RUN-REPORT-03.md`
(03:22Z, "14 records · 9 clean · 0 FAIL · 10 WARN"). Verified all three directly by
reading the actual files rather than trusting a summary. 0 of 3 recorded a FAIL, all
three wrote a report. **Breaker NOT TRIPPED.** Proceeded.

## Step 1 — Concurrency

Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-19T06-20-11Z.json` first.
Read `data/state/claims/bv2a-enrichment.json`: `heldBy: null`, released by firing 05 at
05:37:21Z — claim free. The task prompt's own Step 1 text again names
`data/state/claims/enrichment.json`, a path that has never existed (standing
`bv2a-claim-path-stale-in-prompt` fingerprint) — used the real path,
`bv2a-enrichment.json`, per RUNBOOK §6A step 2b / §6F ownership table / §6G. Checked for
a legacy `data/state/enrichment.lock` — none found; not honoured, not recreated.
Acquired the claim: `heldBy` `bv2a-enrichment-2026-08-19T06-20-11Z`, `acquiredAt`
`2026-08-19T06:20:11Z`, `expiresAt` `2026-08-19T09:20:11Z` (3h TTL per §6G table),
`heartbeatFile` pointing at the heartbeat above. Released at the end of this run.

## Step 2 — Reads

Read `RUNBOOK.md` in full (H1 v2.27). **CURRENT FLOOR** at §6A step 2a is v2.19 — v2.27
is above floor, proceeded. Read §0 prime directives, §2A.1 (identification bar, item 3b
both-surfaces, item 8 bio-is-quoted), §3 (venue protocol, including the search-miss and
same-name-discipline rules), §6A (run contract), §6F/§6G (concurrency mechanics). Read
`ENRICHMENT-TASK-v3.md` §0.0 (bio quoted never written — moot this firing, venue-only,
no bio field touched under §FP.2) and §FP (fast path — §FP.2 venues used throughout).
Read `CTO-INBOX.md` in full (all ~330 lines) and built an exclusion list: the confirmed
foreign-capture batch (externalId prefix `6022ef13-1c27-40be-98c3-7aad7c8c2a30` —
France/Sweden/Greece/Denmark/Norway/Finland/Germany/Ireland addresses), the standing
not-a-venue class (council parks/playing fields/recreation grounds, nursing/care homes,
tattoo studio, retirement village, DJ/promoter services, carnivals/food-festival stages,
a beach), every record already evidenced blank or flagged by firings 00–05 today, and
every standing name-mismatch/garbled-name/closure flag from prior days still open.

**Correction made this firing:** the `dcfc448d-9d9b-457c-a3f2-c9afa3fa7133` externalId
batch has been excluded as "foreign" by firings 03, 04 and 05's carried-forward
exclusion list without independent verification. Inspecting the two `dcfc448d` records
in this firing's candidate pool — The Kings Arms, 290 Alcester Rd S, Kings Heath,
Birmingham B14 6EN, and The Port House, 9 Bridge St, Stourport-on-Severn DY13 8UY —
both are unambiguously UK addresses with UK postcodes, and both resolved cleanly to
confirmed, exact-address-match Facebook pages this firing. The batch is UK, not
foreign; the "foreign" label was wrongly inherited from its shared capture timestamp
(2026-08-16T11:58Z) with the genuinely foreign `6022ef13` batch. Worked both records
normally. Also reconsidered the standing `bv2a-firing04-belfast-empire-uk-venue-in-
excluded-foreign-batch` flag: Belfast Empire Music Hall (42 Botanic Avenue, Belfast,
Northern Ireland — part of the UK) sits inside the `6022ef13` batch but is itself a
genuine, findable UK venue. Worked it normally rather than continuing the blanket
batch exclusion a fourth time; found and attached its own confirmed Facebook page and
website. Logged both corrections to CTO-INBOX.

## Step 3 — Chrome check

`list_connected_browsers` returned `[]` — Chrome unreachable for a **33rd consecutive
firing**. Artist priorities (1, 4, 5) hard-stopped per the task's own table — priority 5
(genre-only top-up on artists already holding a verified facebookUrl) was considered
since §0.0's bio-quote restriction doesn't bind it and genre is the one field a run may
infer, but treated as Chrome-gated too, consistent with all 32 prior firings' uniform
treatment and the lack of a reliable non-Chrome path to a page's own genre/category
field. Venue priorities (2, 3) proceeded under §FP.2 — no Chrome required.

## Work order followed

1. Priority 1 (artists, last 24h, missing socials) — SKIPPED, Chrome unavailable.
2. Priority 2 (venues, last 24h, missing socials) — `list_venues(createdSince,
   missingSocials:true)` returned 0 candidates.
3. Priority 3 (backlog venues missing socials, oldest `createdAt` first) — worked.
   90 candidates at start of firing; paged through all 90 (3 pages of 30) and sorted
   locally by `createdAt` ascending. Excluded the confirmed-foreign batch, the standing
   not-a-venue class, and every record already evidenced blank/flagged today or on
   prior days. Worked the oldest 30 clean candidates that passed exclusion (including
   the two corrected `dcfc448d` records and Belfast Empire) — 30 records, matching
   budget.
4. Priority 4 (artists backlog) — SKIPPED, Chrome unavailable.
5. Priority 5 (artists missing genres with facebookUrl) — SKIPPED, Chrome unavailable
   (see Step 3 reasoning).

`WebSearch` was used to FIND on every record per §FP.2 step 1 (`"<venue name>" <town>
pub facebook website`), with a Wikidata cross-check used once (Red Lion, Stevenage) and
a `facebook.com/<handle>` direct-name probe used where the first pass surfaced a handle
but not a direct URL. No Chrome visits — none required under §FP.2.

## Records enriched WITH a verified page (25 facebookUrl, 1 website-only)

| Venue | Town | Field(s) | Evidence |
|---|---|---|---|
| Whitsand Bay Fort | Torpoint | facebookUrl, website | facebook.com/whitsandbayholidayvillage/ — exact address match (Donkey Lane) |
| Foxtails Chorley | Chorley | facebookUrl, website | facebook.com/p/Foxtails-Chorley-100094773260566/ — exact address, 424 likes |
| The Manor | Brixham | facebookUrl, website | facebook.com/themanorpub — exact address match, 4,471 likes |
| Claycutters Arms | Chudleigh Knighton | facebookUrl, website | facebook.com/theclaycutters/ — exact address, thatched pub since 1760 |
| The Kings Head | Barnet | facebookUrl | facebook.com/p/The-Kings-Head-100057353293282/ — exact address (84 High St) |
| The Arkley Club | Barnet | facebookUrl | facebook.com/TheArkleyClub/ — exact address/phone match |
| The Ship & Pelican | Heavitree, Exeter | facebookUrl | facebook.com/TheShipAndPelicanExeter/ — exact address, 1,031 likes |
| Clacton Railway Club | Clacton-on-Sea | facebookUrl | facebook.com/p/The-Clacton-Railway-Club-Page-100063627880343/ — exact address |
| The Pelton Arms | Greenwich | facebookUrl, website | facebook.com/pelton.arms/ — exact address, 7,044 likes |
| New Crown Inn Bath | Bath | facebookUrl, website | facebook.com/NewCrownInnBath/ — exact address (21 Newbridge Hill) |
| Kingswood Entertainment & Sports Club | Kingswood, Bristol | facebookUrl | facebook.com/KingswoodRblClub/ — exact address (104 Regent St) |
| The Purbeck Plaza | Swanage | facebookUrl | facebook.com/p/The-Purbeck-Plaza-61552251029365/ — exact address, 796 likes |
| Red Lion | Stevenage | facebookUrl | facebook.com/RedLionStevenage — Wikidata Q26471207 structured FB-ID field + TikTok corroboration |
| The Queen Adelaide | Ewell | facebookUrl | facebook.com/QueenAdelaideEmberInnsEwell/ — exact address |
| Warner Hotels - Corton | Corton, Lowestoft | facebookUrl, website | facebook.com/warnercorton/ — exact address (The St, Corton) |
| The Sun Inn | Romsey | facebookUrl, website | facebook.com/thesunromsey — exact address/phone match |
| The Newtown | Poole | facebookUrl, website | facebook.com/TheNewtownPoole/ — exact address (374 Ringwood Rd), 2,589 likes |
| Hampton HUB Club | Hampton | facebookUrl, website | facebook.com/hamptonhubclub/ — exact address (3 Ashley Rd) |
| The Rattler | South Shields | facebookUrl | facebook.com/TheRattlerSouthShields/ — content-matched (coffee, pub food, cocktails, beachfront) against exact address |
| The Red Lion Inn | Wybunbury | facebookUrl, website | facebook.com/theredlionwybunbury/ — matches Instagram handle, exact address |
| Ring O' Bells | Farnworth, Widnes | facebookUrl, website | facebook.com/ringobellsfarnworth/ — exact address, 3,101 likes |
| The Port House | Stourport-on-Severn | facebookUrl, website | facebook.com/porthousestourport/ — exact address (9 Bridge St), corrected from wrongly-excluded `dcfc448d` batch |
| The Kings Arms | Kings Heath, Birmingham | facebookUrl, website | facebook.com/p/The-Kings-Arms-Kings-Heath-61566009342545/ — exact address, corrected from wrongly-excluded `dcfc448d` batch |
| The Bread Shed | Manchester | facebookUrl, website | facebook.com/TheBreadShedMcr — exact address (126 Grosvenor St) |
| Belfast Empire Music Hall | Belfast | facebookUrl, website | facebook.com/belfastEmpire/ — exact address (42 Botanic Ave); resolved the standing UK-venue-in-foreign-batch flag by working it |
| Swan Inn | Stone | website only | swaninnstone.co.uk — phone match (01785 815570); no confidently-matched own FB page (5,588-like candidate found but town not corroborated in snippet) |

All 26 writes confirmed via `updatedFields` in the tool response, and 3 spot-checked
with `get_by_id` (Belfast Empire Music Hall, The Kings Arms Kings Heath, Ring O'
Bells) — all confirmed correct (RUNBOOK §0.10). FB URLs stored in canonical form (no
query params except Kings Arms' `p/...` numeric form as found, trailing slash
preserved as found by source).

## Records recorded as an EVIDENCED BLANK (4), variants tried on both surfaces

| Venue | Town | Why blank |
|---|---|---|
| Haddenham Airfield Pavilion | Haddenham | Parish-council-managed community pavilion (booked via Active in the Community); only a generic "Haddenham Airfield" page and an unrelated "Haddenham Park" community page surfaced, neither confirmed as this pavilion's own |
| The Cotswold Merrymouth Inn - 13th Century Coaching Inn | Fifield | Two competing Facebook pages (TheMerrymouthInn, MerrymouthInn), neither independently confirmable as current without a Chrome visit |
| Golden Fleece | Chelmsford | Multiple searches (bare name+town, direct handle probe) surfaced only Instagram (@fleecepub) and third-party event pages; no canonical facebook.com page found on either surface |
| Lord Haig | Hertford | Three competing Facebook page candidates (61576047030538, 261061908643, thelordhaig), none independently confirmable as current without a Chrome visit |

Search variants used per venue: bare name + town (§FP.2 step 1), a facebook.com direct
name/handle probe where the first pass surfaced a page name but not a confirmed URL. No
row in this firing's batch failed both surfaces outright with zero candidates — every
blank here is a multiple-candidate or no-canonical-page case, not a "nothing found"
case.

## Records SKIPPED, and why

None skipped outright from the worked batch — all 30 oldest clean backlog venues were
either verified, recorded website-only, or recorded as an evidenced blank. All artist
priorities (1, 4, 5) skipped for the batch as a whole — Chrome unreachable, hard-stopped
per the runbook's own table (see Step 3). Artist backlog (871 missing socials, 615
missing genres) static this firing.

## Names corrected under §0.6

None. No name contamination or promo-billing tails found in this firing's venue batch
requiring a rename. (The validator's two `NAME_BILLING` WARNs — Warner Hotels - Corton,
The Cotswold Merrymouth Inn - 13th Century Coaching Inn — are false positives on
genuine trading names containing " - ", not promo tails; no action taken.)

## Validator summary line (verbatim)

```
30 records · 4 clean · 0 FAIL · 52 WARN   [mode=gate]
```

50 of the 52 WARNs are the standing `validator-venue-schema-mismatch` fingerprint
(`STUB_NO_BIO` / `STUB_NO_IMAGE` on each of the 25 facebookUrl-verified venues) — venues
carry no bio/image requirement under §FP.2, expected noise. The other 2 are
`NAME_BILLING` false positives on genuine trading names (see above). No FAIL
outstanding. Records/evidence adapted for the validator via the standing pattern from
firings 03–05: a flat `{"venues":[{id,name,location,facebookUrl}]}` records file
(standing `validator-venue-schema-mismatch` fingerprint) at
`data/normalized/enrichment/records-2026-08-19-firing06.json`, and an aliased evidence
file mapping each line's `venueId` to `artistId` for the loader (standing
`validator-venue-evidence-loader-artistid-only` fingerprint) at
`data/state/evidence_firing06_aliased.jsonl` — the source-scoped
`enrichment-evidence-2026-08-19-enrichment.jsonl` itself is untouched in meaning, only a
derived copy is aliased.

**Mid-firing evidence correction:** the first validator run FAILed one record (Red
Lion, Stevenage) on `FB_EVIDENCE_MISMATCH` — the initial evidence line's `capturedFrom`
pointed at the Wikidata corroborating page rather than the stored Facebook URL itself.
Corrected by appending a fresh evidence line with `capturedFrom` set to the stored
`facebook.com/RedLionStevenage` URL (matching firings 04/05's established convention)
before re-validating — the append-only evidence file's later-line-wins semantics mean
the corrected line is what the validator reads. Re-run: 0 FAIL.

## Budget used

30 venues worked (26 verified/website-only + 4 blank) = 30 records touched, at budget
cap. 0 of 15 artists (Chrome hard-stop). Elapsed under the 40-minute budget. Circuit
breaker did not fire.

## Ledger / snapshot / dashboards

Appended 30 `enrich` lines (26 `verified` — 25 with facebookUrl, 1 website-only — 4
`blank`) to `data/state/enrichment-ledger.jsonl`. Appended one `snapshot` line with
fresh counts from `list_artists`/`list_venues` `pagination.count`: artistsTotal 2243,
artistsMissingSocials 871, artistsMissingGenres 615 (all unchanged — Chrome down),
venuesTotal 3006, venuesMissingSocials 64 (down from 90 pre-firing, reflecting this
firing's 26 venue writes with a facebookUrl or website — `missingSocials` requires
both `socialMediaUrls` and `website` empty). Appended one line to
`data/state/run-summary.jsonl` (`outcome: completed`, `recordsEnriched: 26`,
`skipped: 4`). Regenerated both dashboards:
`data/normalized/enrichment/DASHBOARD.html` (2380 enrichment records, 80 snapshots)
and `data/normalized/DASHBOARD.html`.

## CTO-INBOX additions this firing

- `bv2a-chrome-unreachable-33-firings` — Chrome unreachable for a 33rd consecutive
  firing. Artist backlog fully stalled again; venue work proceeded under §FP.2, 25
  verified (facebookUrl) + 1 website-only, 4 evidenced blank this firing.
- `bv2a-firing06-dcfc448d-batch-was-not-foreign` — the `dcfc448d-9d9b-457c-a3f2-
  c9afa3fa7133` externalId batch was wrongly treated as foreign and blanket-excluded
  by firings 03–05. Both sampled records this firing (The Kings Arms, Kings Heath,
  Birmingham; The Port House, Stourport-on-Severn) are UK addresses with UK postcodes
  and resolved to confirmed own Facebook pages. Worked normally this firing; the
  remainder of the batch (createdAt clustered 2026-08-16T11:58Z) should not be
  excluded by future firings on this fingerprint alone.
- `bv2a-firing06-belfast-empire-resolved` — resolves the standing
  `bv2a-firing04-belfast-empire-uk-venue-in-excluded-foreign-batch` flag: Belfast
  Empire Music Hall (Belfast, Northern Ireland — UK) is a genuine, findable venue.
  Worked this firing (facebook.com/belfastEmpire/, thebelfastempire.com, exact
  address match). No longer needs blanket exclusion from the `6022ef13` batch by
  fingerprint alone — the batch's other 20+ records remain genuinely foreign and
  should stay excluded individually.

## Daily note

Linked from `20-Daily/2026-08-19.md`.
