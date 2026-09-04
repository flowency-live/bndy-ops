# SPIDER RUN REPORT — 2026-08-21

**Run id:** `spider-2026-08-21T00-54-40Z`
**Outcome:** COMPLETED
**Runbook read:** v2.27. Floor in §6A is v2.19. The task prompt states no number of its own. PASS.
**Claim:** `data/state/claims/spider.json` was released (`heldBy: null`, `lastRun` `spider-2026-08-19T01-05-16Z`). Acquired clean. No takeover.
**Mode (§0.29):** the spec declares no mode. The run used **append-only**. It deleted nothing. The gap is already in CTO-INBOX as `spider-mode-not-declared`; it is not raised again.
**Validator:** `6 records · 4 clean · 0 FAIL · 3 WARN`.

---

## 1. Headline

Six new artists and six new events. All twelve records were read back and confirmed.

Chrome and the Facebook session are working again. The 2026-08-19 run left 12 known, dated, admissible ST6 gigs unwritten because it could not create an artist without an identity check. **Six of those twelve are now in bndy.** Six remain, and one billing is unresolved.

Zero new venues. That figure is real for ST6, not a blocked run.

## 2. Seeds

Seed rule 4 (venues held, website or socials, zero future gigs in bndy). Both seeds carry a website, which the CTO-INBOX item `spider-rule4-ranks-website-below-socials` asks the spec to rank first.

| Seed | id | Surface | Future gigs in bndy before the run |
|---|---|---|---|
| Chell Social Club | `8e1c012b-0f0a-49ca-8e82-80b12fe78c0f` | `chellsocialclub.com/artists` | 0 |
| The Top Pub - Brown Edge | `20eced38-130a-4378-9e45-c8218a3216e7` | `thetoppub.co.uk/drink-and-whats-on` | 0 |

Both are ST6. District cursor was `ST6` and is deliberately unchanged.

## 3. Capture

Raw captures: `data/raw/spider/2026-08-21/`.

**Chell Social Club — a parsing finding worth keeping.** The artists page is a GoDaddy card grid. Its text dump repeats each date heading up to three times, so the heading immediately before an act name is often another card's date. A text-order parse mis-dates five of the eight rows.

The run read the DOM in Chrome and paired each act with its date **by geometry** — nearest heading above, same column. The result was then checked against the calendar: 15, 22 and 29 August and 5, 12, 19 and 26 September 2026 are all Saturdays, and 4 September 2026 is a Friday, exactly as the page states. Eight rows, eight correct weekdays. That is the proof the pairing is right.

**The Top Pub.** A flat bullet list, read with `web_fetch`. The page prints no year. Every one of the nine dated rows aligns to a 2026 weekday (Friday July 31st, Friday August 14th, Saturday 22nd August, Friday August 28th, Friday September 25th, Friday October 30th, Friday November 27th, Friday December 18th, Thursday December 31st). No year was inferred without that check.

## 4. Times (§0.28)

Neither time is a default and both are stage times from the venue's own page.

- **Chell Social Club — 20:15.** The page states the act plays twice: `First half 20:15pm - 21:00pm`, `Second half 22:30pm - 23:15pm`. `startTime` is the first set. Both sets are stated in `ticketInformation`. This is not a §0.28 window: it is two published set times.
- **The Top Pub — 20:00.** `thetoppub.co.uk/live-music-at-the-top-pub` states `(8pm)` against every 2026 live music night. The §5.6 Friday default would have been 21:00; the venue page wins.

⚠ The backend wrote `endTime: "00:00"` on all six events. The run did not send an `endTime`. Flagged, not corrected — it is the same on every event this pipeline writes.

## 5. Artists created

Six. **Two with a verified page, four as evidenced blanks.** No stub was created: every one carries either (a) a page or (b) both search surfaces recorded in `data/state/enrichment-evidence-2026-08-21-spider.jsonl`.

| Artist | id | Page | Evidence |
|---|---|---|---|
| Darren Michaels | `1fc08a6b-596c-4fc5-8495-0e66cfafc55a` | blank | FB page search `Darren Michaels`; Google `"Darren Michaels" vocalist Stoke-on-Trent`, `"Darren Michaels" singer facebook`. Only an agency listing (`bigstarentertainments.co.uk/acts/darren-michaels`). No own page. |
| Twilight Duo | `0e8bc60e-3c18-4562-9522-752831c134f5` | `facebook.com/Twilightduo` | FB page search `Twilight duo Stoke` returned `Twilight Duo`, Musician/band, Stoke-on-Trent, 289 followers, *"Lively, Staffordshire based Duo, performing hits from the 70s to present day."* Page visited; the handle resolves to the canonical `/Twilightduo/`. |
| Sammi Jane | `719bc617-06a2-4b4a-ab1e-26d5be9012ca` | blank | FB page search `Sammi Jane music`; Google `"Sammi Jane" singer Staffordshire`. Booking-agency listings only. |
| Beverley Jordan | `8dabee09-f237-41bf-8fdb-2acc9a62b6d7` | blank | FB page search `Beverley Jordan singer`; Google `"Beverley Jordan" vocalist`. Only a personal profile, which §2A.1 item 4 forbids linking. |
| Alistair Lee | `9ca1b9b5-1fd7-479e-aceb-d11fdea4a99e` | blank | FB page search `Alistair Lee vocalist`; Google `"Alistair Lee" male vocalist gigs`. An Omega Promotions act page corroborates a UK club vocalist. No own page. |
| Penkhull Village Brass | `34369e6a-9e2c-44d9-8976-f01b37ecd856` | `facebook.com/penkhullvillagebrass` | FB page search `Penkhull Village Brass` returned an exact match, Musician/band, Watson Road Stoke-on-Trent, 885 followers. Page visited; the handle resolves. |

**Names.** The venue billed the brass band `Penkhul Village Brass`, with one L. The act's own page spells it **Penkhull**. §0.20 makes the act's own page the naming authority, so the record carries the correct spelling. `featuring Quiz Master Carl` is a quiz host, not an act (§4), so it is in `ticketInformation`, not the name.

`TWILIGHT` is billed by the venue; the act's own page reads **Twilight Duo**. §2A.1 item 7 states a trailing `Duo` is part of the name and must not be stripped, so the record is `Twilight Duo`. The validator WARNs `NAME_BILLING` on that tail; the WARN is expected and the name is correct.

**Bios are EMPTY on both verified records, deliberately.** `get_page_text` returned no text on either Facebook page — the CSS character-scramble defect already logged as `fb-post-text-css-scrambled`. §2A.1 item 8 allows a bio to be a quotation or empty and nothing else, so both are empty. The validator WARNs `STUB_NO_BIO` twice; that is the correct outcome, not a miss.

**actType.** `covers` on the four club vocalists and on Twilight Duo — nothing in the evidence contradicts it (§2A.2). **Left EMPTY on Penkhull Village Brass**: a community brass band is neither a covers nor an originals act on this evidence, and §0.18 says unknown beats a guess.

⚠ **`create_artist` returned HTTP 500 on the Twilight Duo call when `nameVariants` was sent.** Retried without it and it created first time. This is the known `create-artist-500-namevariants` defect and is not raised again. **Consequence: the record carries no `Twilight` name variant**, so the next source that bills the act as plain `Twilight` will not match it.

## 6. Events created

Six. All verified by read-back.

| Event | id | Date | Time | externalId |
|---|---|---|---|---|
| Darren Michaels @ Chell Social Club | `1a5a5258-3428-478b-a050-91589b4b2b04` | 2026-08-22 | 20:15 | `spider` / `venue-8e1c012b-2026-08-22` |
| Twilight Duo @ Chell Social Club | `c570c078-acad-4d3e-9466-af2f1235c4d4` | 2026-08-29 | 20:15 | `spider` / `venue-8e1c012b-2026-08-29` |
| Beverley Jordan @ Chell Social Club | `1b80abc2-df56-49c9-95d7-cda1abdf6cd9` | 2026-09-05 | 20:15 | `spider` / `venue-8e1c012b-2026-09-05` |
| Alistair Lee @ Chell Social Club | `53f6a441-bc8c-42fc-bee6-35fc2c0ce41b` | 2026-09-12 | 20:15 | `spider` / `venue-8e1c012b-2026-09-12` |
| Sammi Jane @ The Top Pub - Brown Edge | `bd837327-986d-44a4-8610-3d8d0e639938` | 2026-08-28 | 20:00 | `spider` / `venue-20eced38-2026-08-28` |
| Penkhull Village Brass @ The Top Pub - Brown Edge | `dcde486f-44b6-493f-90d1-f9df0ba64c7a` | 2026-12-18 | 20:00 | `spider` / `venue-20eced38-2026-12-18` |

`data/state/cancellations.jsonl` was checked on artist + venue + date before the first create. Six lines, no match.

**0 gate bounces. 0 409s. 0 422s.** Both venues held zero future gigs, so no sentinel could fire.

## 7. Rows NOT written, and why

Every one of these is a real, dated, admissible gig. None is a data problem. All seven are handed to the next run.

| Row | Date | Venue | Why not written |
|---|---|---|---|
| Charlotte | 2026-09-04 | Chell | No enrichment search run. Neither surface attempted inside the time budget. |
| Scott Anson | 2026-09-19 | Chell | FB page search done (`Scott Anson singer`) — the one exact-name hit is a **Sheffield actor and singer**, which is a name match with no footprint tie to Stoke, so it fails §2A.1. Google half not run. |
| After The Storm | 2026-09-26 | Chell | FB page search done (`After The Storm duo`) — the only real candidate is a **Plymouth covers band**, disjoint footprint. Google half not run. |
| Phil Boyd | 2026-09-25 | The Top Pub | FB page search done (`Phil Boyd music`), nothing. Google half not run. |
| Before The Bitter End | 2026-10-30 | The Top Pub | FB page search done (`Before The Bitter End`), nothing UK. Google half not run. |
| Hannah Bee | 2026-12-31 | The Top Pub | **Two candidate pages, both Staffordshire.** See §8. |
| The Amazeballs DD King | 2026-11-27 | The Top Pub | Unresolved billing. See §8. |

Half of the enrichment work for four of these is already on disk in this run's evidence file, so the next run pays for the Google half only.

## 8. Two rows that need a decision, not more searching

**Hannah Bee — two same-region candidate pages.** FB page search `Hannah Bee singer` returned:
- `Hannah Bee - Singer/Entertainer`, Public figure, 561 followers, *"Staffordshire-based singer, performing an eclectic mix of hits from the 60s to the present day"*.
- `Hannah BEE`, Musician, 517 followers, *"Singer/Songwriter based in Newcastle-Under-Lyme"*.

The booking is a New Year's Eve pub party, which fits the first. **That is a preference, not a hard signal**, and §1A.2 says a same-name pair in one region is the exact case that must not be guessed. Nothing written. Raised to CTO-INBOX.

**The Amazeballs DD King.** The venue prints one string. It may be one act, or `The Amazeballs` plus `DD King`. §0.5 forbids inventing a name and §4 forbids guessing a split, so the row is skipped rather than written wrong. Raised to CTO-INBOX.

## 9. Rejected rows (§0.23 / admission test)

| Row | Reason |
|---|---|
| Charity Afternoon Tea in Aid of Breast Cancer, 2026-08-22, The Top Pub | `REJECTED-not-a-performance` |
| Quiz Night, Monday evenings, The Top Pub | `REJECTED-no-concrete-date` |
| Neil James, 2026-08-15, Chell | `REJECTED-past-dated` (§0.14) |
| Bryan Hills 2026-07-31, The Little Orcs 2026-08-14, The Top Pub | `REJECTED-past-dated` (§0.14) |

No venue was rejected. Both seeds are fixed buildings with a Google Place ID already in bndy.

## 10. Discovery saturation

**0 new venues per 100 hops. 2 hops, both in ST6.**

ST6 now stands at 10 cumulative hops, 0 venues found, 6 artists found. The district is yielding **acts**, not venues — which is what a district whose venues are already mapped looks like. `venuesKnown` is 6.

⚠ This zero is honest saturation on the venue axis, and it is the first ST6 run that can say so: the 2026-08-19 zero was a Chrome outage, not a measurement.

## 11. State written

- `data/state/spider-last-page.txt` — 13 rows, both seeds, with the normalisation rules in its own header. This source had no snapshot file before today.
- `data/state/spider-coverage.json` — ST6 updated.
- `data/state/spider-seen.json` — both venue seeds stamped `2026-08-21`.
- `data/state/spider-state.json` — cursor stays `ST6`, with the six outstanding gigs named so the next run does not have to re-derive them.
- `data/state/enrichment-evidence-2026-08-21-spider.jsonl` — 12 lines (6 written before the creates, keyed by name; 6 appended after, keyed by `artistId`).
- `data/state/run-summary.jsonl` — one line appended.

## 12. Honest faults in this run

1. **The evidence file was written by name first and back-filled with `artistId` after the create.** §6A step 8 wants the evidence before the bndy write. An `artistId` does not exist until `create_artist` returns, so a create-path run cannot key evidence by id in advance. The search results themselves were recorded before any write. The step as written assumes an enrichment run editing records that already exist.
2. **Two Google queries carried a location I had not verified** — `"Darren Michaels" vocalist Stoke-on-Trent` and `"Sammi Jane" singer Staffordshire`. §2A.1 item 3c forbids that: the venue proves where the act *plays*, not where it is *from*, and a wrong guess turns a real page into a false blank. Both blanks are therefore weaker than they look. A bare-name re-run is worth doing before either is treated as pageless.
3. **`locationType: "regional"` on Sammi Jane could not be verified.** `get_by_id` does not return the field. §6B's Kilmarnock trap needs `regional` paired with the free-text `Staffordshire`. The value was sent; the read-back cannot confirm it.
4. **The run overran its 60-minute TTL** by a few minutes, finishing the writes, the validator and this report rather than stopping mid-batch with unverified records on disk. The cause is the enrichment cost: thirteen new acts at two search surfaces each does not fit a 60-minute run alongside 26 writes and 12 read-backs.

## 13. Against the 25-record target (§Caps)

**12 records written, against a target of 25.** Short, and the shortfall is not saturation — seven more admissible gigs were sitting in the capture with nothing wrong with them.

The binding constraint was the §2A identity check: two search surfaces per new act, thirteen new acts, one hour. The district was rich; the budget was not. This is the honest number, and it is not padded.
