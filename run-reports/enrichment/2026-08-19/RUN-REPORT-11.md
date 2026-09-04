# Bv2a Enrichment — run report, firing 11

**Run id:** `bv2a-enrichment-2026-08-19T11-19-03Z`. **Outcome: completed.**

## Gates

- **Circuit breaker (Step 0):** did not fire. The last 3 reports (08, 09, 10) each closed at 0 FAIL and each wrote a report.
- **Runbook:** read in full. H1 version v2.27. Current floor v2.19. Met.
- **Concurrency claim:** `data/state/claims/bv2a-enrichment.json` was released (`heldBy: null`) on read. Acquired at 11:19:03Z, TTL 3 hours, expires 14:19:03Z. Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-19T11-19-03Z.json`.
- **Chrome:** unreachable. `list_connected_browsers` returned `[]`. This is the 38th consecutive firing with Chrome down (22 on 08-17 22:17Z through this firing on 08-19 11:19Z). Per the hard-stop table, all artist work (priority items 1, 4, 5) is blocked this firing. Venue work (items 2, 3) needs no Chrome under §FP.2 and proceeded.

## Selection

Artists created in the last 24h with missing socials: 4 found, not worked (Chrome down).
Venues created in the last 24h with missing socials: 0 found.
Backlog venues missing socials: 53 total. Checked today's ledger before selecting; 45 of the 53 already carried at least one search attempt today. 8 UK, fixed-building candidates had not been touched today and were worked this firing.

## Records enriched with a verified page

| Venue | Field | Source |
|---|---|---|
| Centre Totnes, Market Square (`7aa39dda-6fdf-4b1f-965f-2f3864702d05`) | website, facebookUrl | Totnes Town Council's own site names the Civic Hall at this address; Council's own venues Facebook page attached. Tier B: official source, address match. |
| King William Ⅳ, Bristol (`2c702b8d-292d-4d14-9546-e42855136475`) | facebookUrl | Exact address match (62 Broad St, Staple Hill, Bristol BS16 5NP) across independent pub directories; local nickname "The King Billy" carries the only Facebook page found under that address. Tier B: address match, sole candidate, not directly visited (Chrome down). |

## Records recorded as an evidenced blank

| Venue | Variants tried (Google, both queries where used) | Reason |
|---|---|---|
| The Decorated Dead Tattoo Studio, Poole (`28f7869f`) | `"The Decorated Dead" Poole tattoo studio facebook`; `"the decorated dead" 302 Ashley Road Poole facebook page` | Instagram only, no venue Facebook page found. |
| Bay View, Brixham (`5f95f7e3`) | `"Bay View" Brixham pub facebook`; `"295 Gillard Road" Brixham "Bay View"` | Address mismatch. bndy holds 295 Gillard Rd TQ5 9AP; only "Bay View" found is Bay View Bar, Fishcombe Rd TQ5 8RB, Brixham Holiday Park. Different postcode, not attached. Possible geocode error in the bndy record, worth a human check. |
| Sola Bar & Kitchen, Dawlish Warren (`851da56d`) | `"Sola Bar" Dawlish Warren facebook`; `Sola Bar Kitchen Dawlish Warren Warren Bridge Inn official facebook page` | One third-party post claims a rename from Warren Bridge Inn to Sola. The pub's own Facebook page is still branded `thewarrenbridgeinn` with no rename stated on it. Not enough to attach under the new name. |
| The Crab and Apple Pub, Appledore (`228da383`) | `"Crab and Apple" Appledore pub facebook`; `"Crab and Apple" "New Quay Street" Appledore address` | Only candidate found is differently named ("The Crab Apple Inn"), no address corroboration. Name mismatch, rejected per RUNBOOK §3 item 3. |
| Alderney Community Association, Poole (`479b4860`) | `"Alderney Community Association" Poole facebook` | Address (287 Herbert Ave, BH12 4HT) confirmed by one directory. Three differently named Facebook entities found near that address (Alderney West Community Centre / Alderney Manor Social Club / Alderney Manor Community Association). No exact-name match, not attached. |
| The Royal Oak Hollywater, Bordon (`d4c89efe`) | `"Royal Oak" Hollywater Bordon Liphook Road facebook` | Two competing Facebook page candidates, same as found at 00:28 and 08:27 today for this same venueId. See Corrections below. |

## Corrections made mid-firing

`d4c89efe-c6e2-4b87-8327-3c6203a57e82` (The Royal Oak Hollywater) was attached to one of the two competing Facebook page candidates at 11:23:51Z, on the strength of a dated post snippet. This repeated a choice two earlier firings today had already correctly declined to make, for the documented reason that neither candidate is confirmable without a Chrome visit. The write was reverted at 11:24:33Z (`socialMediaUrls` cleared, confirmed empty by `get_by_id`). The lesson: check today's own evidence file for the venueId before running a fresh search, not only the ledger.

## Records skipped, and why

Three venues carry known data-quality defects already logged in `CTO-INBOX.md` and were not re-searched: `2f2e5e77-314a-4ce6-8377-b705e9480cdc` ("Venue TBC", unsearchable placeholder name), `9be0502f-2a7f-42ac-8751-b51852b2320a` ("United match)", garbled capture), `befdd87f-2d49-4a0e-ab7a-fcbe2dac32bf` ("Jorge Wilson + Jesse James", garbled capture, resolves to an unrelated logistics company). Non-fixed-building venues (parks, playing fields, showgrounds, a beach) were left alone per RUNBOOK §0.23. 4 artists created in the last 24h with missing socials were not worked; Chrome down.

## Names corrected under §0.6

None this firing.

## Validator summary line (verbatim)

```
2 records · 0 clean · 0 FAIL · 4 WARN   [mode=gate]
```

First pass FAILed Centre Totnes on `FB_EVIDENCE_MISMATCH` (`capturedFrom` pointed at the Council's own site, not the Facebook URL itself). Same standing fingerprint as firing 09. Corrected by appending a fresh evidence line with `capturedFrom` set to the Facebook URL; re-validated at 0 FAIL. The 4 WARNs are `STUB_NO_BIO`/`STUB_NO_IMAGE` on both verified venues, expected noise under §FP.2 (venues carry no bio/image requirement).

Records/evidence built via the standing pattern (fingerprints `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only`): `data/normalized/enrichment/records-2026-08-19-firing11.json` and `data/state/evidence_firing11_aliased.jsonl`, built by `data/state/build_validator_input_firing11.py`.

## Budget used

2 venues verified, 6 evidenced blank (one of the 6 involved a write made in error and reverted) = 8 venue records worked. 0 artists (Chrome hard-stop). Elapsed approximately 20 minutes of the 40-minute ceiling. Well under the 30-venue/15-artist cap. Circuit breaker did not fire.

Ledger: 8 `enrich` lines appended (2 verified, 6 blank) plus 1 `snapshot` line. Snapshot: artistsTotal 2243, artistsMissingSocials 871, artistsMissingGenres 615 (all unchanged, Chrome down, no artist work), venuesTotal 3005, venuesMissingSocials 51 (down from 53). `run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 2, skipped 6. Regenerated both dashboards: `data/normalized/enrichment/DASHBOARD.html` (2419 enrichment records, 85 snapshots) and `data/normalized/DASHBOARD.html`.
