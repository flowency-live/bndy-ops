# Bv2a Enrichment — RUN REPORT — 2026-08-19, firing 01 (01:20Z)

## Step 0 — Circuit breaker
Independently re-read the 3 most recent run reports: `2026-08-19/RUN-REPORT-00.md`,
`2026-08-18/RUN-REPORT-23.md`, `2026-08-18/RUN-REPORT-22.md` (confirmed newest-first by
mtime; no newer report existed at start of this firing). All three recorded 0 outstanding
FAIL from the validator on their final run, and all three wrote a report. 0 of 3 recorded a
FAIL, none failed to write a report. **Breaker NOT TRIPPED.** Proceeded.

## Step 1 — Concurrency
No `.lock` file honoured or created (`data/state/enrichment.lock` not present — retired
mechanism). Claim path confirmed as `data/state/claims/bv2a-enrichment.json` per the standing
fingerprint `bv2a-claim-path-stale-in-prompt`. Found `heldBy:null` (released by firing 00 at
2026-08-19T00:47:00Z). Heartbeat written first: `data/state/heartbeat/bv2a-enrichment-2026-08-19T01-20-35Z.json`.
Claim acquired: `heldBy: bv2a-enrichment-2026-08-19T01-20-35Z`, `expiresAt: 2026-08-19T04:20:35Z`
(3h TTL).

## Step 2 — Reads
`RUNBOOK.md` read in full: H1 **v2.27**, current floor **v2.19** — pass. Read §0 (prime
directives, incl. §0.6 name-stripping), §2A.1/§2A.2 (enrichment protocol, incl. item 3b
both-surfaces-before-blank and item 8 bio-is-quoted), §3 (venue protocol), §6A (run contract,
concurrency, floor). `ENRICHMENT-TASK-v3.md` read in full: §0.0 (bio quoted never written —
moot this firing, venue-only, no bio field touched under §FP.2) and §FP (§FP.2 venue fast
path used throughout; §FP.3 artist fast path not reached, Chrome down). `CTO-INBOX.md` read
in full (all ~300 lines) for standing fingerprints, not-a-venue flags, ambiguous-name flags,
address-mismatch flags and same-day evidenced blanks to exclude from the candidate pool.

## Step 3 — Chrome check
`list_connected_browsers` returned `[]`. Chrome unreachable for a **TWENTY-EIGHTH**
consecutive firing (22 on 08-17 22:17Z through this firing, over 27 hours). Per the runbook's
hard-stop table, all artist priorities (1, 4, 5) are HARD-STOPPED. Venue work proceeded under
§FP.2, which needs no Chrome.

## Work order followed
Priority 1/4/5 (artists): skipped — Chrome hard-stop.
Priority 2 (venues created last 24h, missing socials): **0 candidates**
(`createdSince` 2026-08-18T01:20:35Z, `missingSocials:true` → 0 results).
Priority 3 (backlog venues missing socials, oldest `createdAt` first): worked from the
174-venue backlog. Built an exclusion set from the enrichment ledger (643 venue ids touched
since 2026-08-17T22:00Z — the start of the Chrome outage) to avoid re-searching records
already enriched or evidenced-blank within the last day, then paged ~117 of 174 records,
locally sorted by `createdAt`, and additionally excluded: non-UK venues (the `6022ef13-...`
foreign-tour capture batch — Hamburg, Dublin, Copenhagen, Skien, Espoo, Norway, etc.),
standing not-a-venue flags (Hunstanton Bandstand, Jubilee Park Horndean, Campbell Park,
Gostrey Meadow, West Park Long Eaton, Ann Welfare Playing Fields, Prestwood Recreation
Ground, Castle playing fields, Decade of Dance, The Decorated Dead Tattoo Studio, Plympton
Spice, The Nest), standing ambiguous/entity-mismatch flags (Darcy's, The Railway Stockport,
Tuckers Maltings, Astor Hall, White Lodge, Arena Torquay, Centre Totnes, EX39 4JN, Venue TBC,
"United match)", The Holly Tree, The Cock Inn St Albans, Sola Bar & Kitchen, Okehampton Show
ground, King William Ⅳ, 1865/1 Carlton Pl, Hartlepool United FC Supporters Association, Red
Lion Stevenage, Bowling Green Stage Nantwich), and records already worked as an evidenced
blank in the immediately preceding firings (firing 23 and firing 00, both within the last
~2 hours: West End Club, Annitsford Welfare Club, Hayfield Club, The Tannery, The Saracens
Head, Jubilee Inn, Walton Hersham & Oatlands Conservative Club, The Turks Head, Newton Abbot
76 Sports & Social Club). 30 fresh, unflagged, UK candidates selected, oldest `createdAt`
first (2026-06-19 through 2026-08-16).

## Records enriched WITH a verified page (26)
| Venue | facebookUrl | website | Evidence |
|---|---|---|---|
| DT's, Torquay | facebook.com/p/DTS-100063716646521/ | — | exact address + phone match, 73 South St TQ2 5AA |
| The Quad Theatre, Plymouth | facebook.com/MarjonArtsCentre/ | barbicantheatre.co.uk/the-quad-theatre | address match, Derriford Rd PL6 8BH |
| The Racehorse Inn, Taunton | facebook.com/p/The-Racehorse-Inn-Taunton-61577049009490/ | — | address match via Yelp, 157 E Reach |
| The Regency, Weston-super-Mare | facebook.com/p/The-Regency-Weston-s-Mare-100037234399905/ | — | exact address, 22-24 Lower Church Rd BS23 2AG |
| Watchet Royal British Legion | facebook.com/watchetrblclub/ | — | address match, Mill Ln, behind the Star Inn |
| Carnglaze Caverns, St Neot | facebook.com/carnglazecaverns/ | carnglaze.com | name + village match, 14k+ likes |
| Scream and Shake Cafe & Bar, Blackpool | facebook.com/screamblackpool/ | — | exact address, 33 Birley St FY1 1EG |
| Stanwick Club | facebook.com/ClubStanwick/ | stanwickclub.com | village + High St match |
| The Peacock, Kenton | facebook.com/PeacockMontagu/ | — | exact address, Arlington Ave NE3 4TS (confirms earlier `peacock-newcastle-wrong-geocode` correction) |
| Wollaston Working Mens Club | facebook.com/WollastonWMC | — | exact address, 73 London Rd NN29 7QP (now trading as "Works 1898") |
| The Coach & Horses Ale & Craft, Wellingborough | facebook.com/Coach.Horses.Wellingborough/ | thecoachandhorseswellingborough.co.uk | exact address, 17 Oxford St NN8 4HY |
| Otley Courthouse | facebook.com/otleycourthouse/ | otleycourthouse.org.uk | name match, 4186 likes |
| Lane Theatre, Newquay | facebook.com/lanetheatre/ | — | name + village match, 2415 likes |
| The ElmTree, Hightown | facebook.com/ElmTreeinRingwood/ | theelmtreeringwood.co.uk | exact address, Hightown Rd BH24 3DY |
| The Face Bar, Reading | facebook.com/facebar.reading.9/ | hirethefacebar.com | exact address, Ambrose Pl RG1 7JE |
| The Nightingale, Sutton | facebook.com/p/The-Nightingale-Sutton-100063480073384/ | thenightingalesutton.co.uk | exact address, 53 Carshalton Rd |
| The Whistler, Haddenham | facebook.com/thewhistler2025/ | thewhistler.net | exact address, 2A Woodways HP17 8DS |
| The Amberwood Inn, Walkford | facebook.com/AmberwoodInnLtd/ | theamberwood.co.uk | exact address, 154 Ringwood Rd BH23 5RQ |
| The Kings Arms Inn, Tedburn St Mary | facebook.com/kingsarmstedburn/ | kingsarmsinn.co.uk | village match, 1569 likes |
| Last Hop, Staines | facebook.com/lasthopstaines/ | lasthop.co.uk | exact address, Thames Edge/Clarence St |
| Crown & Anchor, Plymouth | facebook.com/crownandanchorplymouth/ | crownandanchorplymouth.co.uk | exact address, 10-11 The Barbican PL1 2LS |
| Sandy Conservative Club | facebook.com/SandyConservativeClub/ | sandyconservativeclub.org.uk | exact address, 19 Bedford Rd SG19 1EL |
| The Wharf Teddington | facebook.com/thewharfteddington/ | — | exact address, 22 Manor Rd TW11 8BG |
| The Pickwick Inn & Accommodation | facebook.com/107250982193902/ | thepickwick.co.uk | exact address, The Old Chapel, St Ann's Chapel TQ7 4HQ (distinguished from a same-name "Pickwick Inn - Bigbury" page) |
| The Bell, Sandy | facebook.com/dingdongthebellsandy/ | — | exact address, 1 Station Rd SG19 1AW |
| Daleys Bedford (Kempston) | facebook.com/groups/Daleysclub/ | — | active Facebook GROUP (valid per §2A.1 item 4 group-URL rule), address match confirmed via CAMRA listing |

All 26 confirmed by exact or near-exact address/postcode/village match in the search result
title, snippet or a corroborating third-party listing (Yelp/CAMRA/whatpub), per §FP.2 step 3.
Every write's `updatedFields` response checked (all returned `socialMediaUrls`, several also
`website`), and 3 spot-checked with `get_by_id` (The Quad Theatre, The Pickwick Inn &
Accommodation, Daleys Bedford) — all read back correctly.

## Records recorded as an EVIDENCED BLANK (4), variants tried on both surfaces
- **Madeley Carnival, Madeley** — `"Madeley Carnival" Madeley Crewe facebook`. Only Madeley
  School, Madeley Club, The Madeley Centre and Madeley Parish Council pages surfaced, no page
  for a carnival event. Reads as a temporary annual event, not a fixed venue — same class as
  the standing Bowling Green Stage Nantwich finding. Flagged for a human check of whether
  this record should exist as a bndy venue.
- **Bay View, Brixham** — `"Bay View" Brixham pub facebook`, `"Bay View" "Gillard Road"
  Brixham`. Three different "Bay View" entities found in Brixham (King Street accommodation,
  Fishcombe Road Holiday Park bar, and the Berry Head/Gillard Road area, which is actually a
  different hotel). None confirmed at bndy's address 295 Gillard Rd TQ5 9AP. Left blank
  rather than attach a wrong-place page; flagged for a human check.
- **The Crab and Apple Pub, Appledore** — `"The Crab and Apple" Appledore pub facebook`,
  `"Crab and Apple" "New Quay Street" Appledore`. Only candidate found is "The Crab Apple
  Inn" with 11 likes and no address confirmation in any snippet. Left blank as
  under-evidenced.
- **The Grace, London N5** — `"The Grace" Highbury Corner London N5 facebook`,
  `thegrace.london The Grace Islington facebook.com/thegrace`. Address confirmed (20-22
  Highbury Corner N5 1RD) and own website thegrace.london found and attached would have been
  reasonable, but no confirmable direct Facebook page URL surfaced on either surface — only a
  Twitter/Instagram handle (@thegraceldn) referenced. Left the facebookUrl field blank this
  firing (record left otherwise untouched — no partial write made, next firing can retry).

## Records SKIPPED, and why
- All artist priorities (1, 4, 5) — Chrome unreachable, hard-stopped per the runbook's own
  table. Artist backlog (871 missing socials, 615 missing genres) static this firing.
- Standing not-a-venue, ambiguous-name, entity-mismatch, and same-day-already-blank records
  listed under "Work order followed" above were excluded from the candidate pool per
  precedent and not re-attempted.

## Names corrected under §0.6
None. No promo-billing or lineup-contaminated names encountered this firing (venue protocol
only, no artist creates or edits). Two name/entity observations noted but NOT corrected
(venue protocol has no unattended-rename authorisation, same as prior firings' findings):
Wollaston Working Mens Club now trades as "Works 1898" per its own Facebook page.

## Validator summary line (verbatim)
```
30 records · 4 clean · 0 FAIL · 52 WARN   [mode=gate]
```
Clean on first pass, no correction cycle needed. All 52 WARNs are `STUB_NO_BIO`/
`STUB_NO_IMAGE` on the 26 verified records — expected noise per the standing
`validator-venue-schema-mismatch` fingerprint: venues carry no bio/image requirement under
§FP.2. Records/evidence adapted for the validator via `data/state/build_validator_input_run0120.py`,
following the exact pattern of the most recent adapter script (`build_validator_input_firing23.py`):
a flat `{"venues":[{id,name,location,facebookUrl}]}` records file (standing
`validator-venue-schema-mismatch` fingerprint) and an aliased evidence file mapping each
line's `venueId` to `artistId` for the loader (standing
`validator-venue-evidence-loader-artistid-only` fingerprint) — the source-scoped
`enrichment-evidence-2026-08-19-enrichment.jsonl` itself is untouched in meaning, only a
derived copy (`evidence_run0120_aliased.jsonl`) is aliased.

## Budget used
26 venues verified + 4 evidenced blank = 30 venue records worked, at the 30-venue cap. 0
artists (Chrome hard-stop). Elapsed roughly 35 minutes of the 40-minute budget. Circuit
breaker did not fire (0 FAIL on this firing's validator run, all three prior reports clean).

## Ledger / snapshot / dashboards
Appended 26 `enrich`/verified lines + 4 `enrich`/blank lines + 1 `snapshot` line to
`data/state/enrichment-ledger.jsonl` (now 2358 total lines). Snapshot: artistsTotal 2243,
artistsMissingSocials 871, artistsMissingGenres 615 (all unchanged — Chrome hard-stop),
venuesTotal 3006, venuesMissingSocials 148 (down from 174; confirmed by fresh
`list_venues`/`list_artists` `pagination.count` calls, not computed). Appended 1 line to
`data/state/run-summary.jsonl`. Regenerated `data/normalized/enrichment/DASHBOARD.html`
(2246 enrichment records, 75 snapshots) and `data/normalized/DASHBOARD.html`.

## CTO-INBOX additions this firing
- `bv2a-chrome-unreachable-28-firings-one-day`
- `bv2a-firing01-madeley-carnival-not-a-venue`
- `bv2a-firing01-bay-view-brixham-three-candidates`
