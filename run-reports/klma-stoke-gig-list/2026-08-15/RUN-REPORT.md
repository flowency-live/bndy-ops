# KLMA Stoke gig list — run report 2026-08-15

RUN ID: `klma-stoke-gig-list-2026-08-15T06-13-42Z`
OUTCOME: **completed**
RUNBOOK: read in full. H1 **v2.27**. §6A CURRENT FLOOR **v2.19**. Assertion PASS.
PROMPT FLOOR: the deployed task prompt names no number this run. §6A step 2a is the gate.
SPEC: `sources\klma-stoke-gig-list.md`, read in full.
CLAIM: `data\state\claims\klma-stoke-gig-list.json` was `heldBy: null`. Acquired at 06:13:42Z,
TTL 2 hours. No takeover. No `enrichment.lock` found.
HEARTBEAT: `data\state\heartbeat\klma-stoke-gig-list-2026-08-15T06-13-42Z.json`.
MODE (§0.29): the spec still declares neither `delta` nor `append-only`. The run defaulted to
**append-only**. Nothing was deleted. Already logged as `klma-no-delta-mode-declared`.

---

## 1. Counts

| | n |
|---|---|
| Events created | **12** |
| Artists created | **2** |
| Venues created | **0** |
| Events edited | 4 |
| Artists edited | 3 |
| Events deleted | 0 (append-only) |
| Rows deferred on budget | 5 |
| Rows skipped, unresolvable | 1 |
| Creates against the 50 cap | 14 |

## 2. Capture and diff

**Section 1 — the sheet.** Chrome on the gviz `out:html` endpoint. `web_fetch` was not used
(spec: it serves an eight-week-stale cache).

- 434 rows captured, 14 columns.
- Column mapping verified against the header row: `[2] Artist [3] Venue & Location
  [5] Cost/Ticket [6] Genre [7] Link to Event`. Post-2026-08-06 layout. No off-by-one.
- Diff vs the 2026-08-14T03:20Z snapshot: **24 added / 6 removed / 410 unchanged**.
- §5.7(a) SELF-DIFF GATE: the new snapshot re-diffed against the capture it was written from —
  **0 added / 0 removed, 434 of 434 row hashes identical**. Body digest `a97b2c6b` over
  48352 chars. **PASS.**

**Section 2 — The Sugarmill.** 41 `div.row2` elements, 31 distinct gigs after slug dedupe,
26 dated. Diff **0 added / 0 removed**. Digest `240ff966` over 2621 chars, equal to stored.
§5.7(a) gate **PASS**. No section 2 work was needed.

### 2.1 The six removed rows — four are not removals

Two are past-dropped (13 August, now behind today). The other four are the SAME gigs, edited by
the curator, re-appearing inside the 24 added:

| Removed row | Re-appears as | What changed |
|---|---|---|
| `Epileptic Hillbillys And Planet Strange. Grumpys Motorcycles 12:00 am` | added idx 14 | time `12:00 am` → `5:00 pm` |
| `ANGELS OF DARKNESS Riff Factory 7:00 pm` | added idx 142 | capitalisation only |
| `Imperial Bees, The Groves, and The Filters ...` | added idx 148 | `and` → `And` |
| `Jean & Rogers The Bellringer Pub. Eaton Park. ST2 9ND` | added idx 149 | row-id dropped, `ST2 9ND` → `St2 9nd` |

Net genuinely new rows: **20**. This is the `whitespace-diff-drift` class already in the inbox,
now with a case-folding variant. Under append-only none of it was actionable, which is the
correct outcome — under `delta` three future-dated live gigs would have been delete candidates
on a capitalisation change.

## 3. Work order (spec "ORDER THE ADDED ROWS BY GIGS-PER-ARTIST, DESCENDING")

Groups worked, largest first: Dawson Dean (3) → The Vanz (2) → Brass Monkees (2, after the
alias was proved) → the Cosey Club block (9 rows, one venue) → the Granville's block (6 rows,
one venue) → singles. The five deferred rows are all single-gig groups, which is what the rule
intends.

## 4. Events created — every id in full

| id | title | date | time |
|---|---|---|---|
| `86400b1f-c0aa-48d2-9ef1-3cac9f5e52cc` | Dawson Dean @ The Cock Inn | 2026-08-23 | 19:00 **defaulted** |
| `0c978928-0e13-4d4a-bc6d-3628d4ec3d05` | Dawson Dean @ St. Lawrence's Parish Church, Biddulph | 2026-09-16 | 20:00 **defaulted** |
| `1a11b78e-b36e-491f-bc6a-8e37118e57e8` | C&C Duo @ The Shamrock Bar Leek | 2026-08-15 | 21:00 **defaulted** |
| `7b84b5e8-ac6b-4d5b-8448-8884345bf36f` | Native Way @ Granville's Restaurant & Music Bar | 2026-09-04 | 21:00 **defaulted** |
| `d8bd5248-841d-4d33-8026-c9972136e445` | Angel Of Harlem @ Cosey Club | 2026-09-05 | 21:00 **defaulted** |
| `c7829141-254a-48c1-becb-61cd64c7cb7a` | The Vanz @ Granville's Restaurant & Music Bar | 2026-09-11 | 21:00 **defaulted** |
| `0caa342f-3122-45e0-8920-c73e6bb6251f` | Brass Monkees @ Cosey Club | 2026-09-11 | 21:00 **defaulted** |
| `1f380e38-c699-4fe6-8a89-21247514536d` | Ego King @ Cosey Club | 2026-09-18 | 21:00 **defaulted** |
| `0f9f168d-15be-47ca-9a49-d860dcdb0801` | The Endings @ Cosey Club | 2026-09-19 | 21:00 **defaulted** |
| `b247f716-e269-4b94-85a5-bdd03b7544a6` | Brass Monkees @ Granville's Restaurant & Music Bar | 2026-09-19 | 21:00 **defaulted** |
| `1e2c8ad9-fe54-40c9-ac36-1179e563ea16` | The Vanz @ Cosey Club | 2026-09-25 | 21:00 **defaulted** |
| `e1196904-88e4-47ca-b749-bcf0c29220a2` | Arctic Stereo Killers @ Cosey Club | 2026-09-26 | 21:00 **defaulted** |

**All 12 start times were defaulted by the server under §5.6.** The sheet published no time on
any of these rows. No time was invented by the run.

All 12 were read back (§0.10): 7 by `search_event(venueId: LHrDNnXeCU1eirDOxUKc)`, 3 by
`search_event(venueId: pkmhj8ElmrfJWNoWLn6X)`, 2 by `search_event(artistId: mBRvfim8KGXkpqmb3wVa)`,
and `1a11b78e` by `get_by_id`. Every one carries its §6D slug externalId.

## 5. Events edited

| id | what | why |
|---|---|---|
| `2c2cae0e-a200-47e6-9930-f4e80fb1a639` | startTime 21:00 → **17:00**; externalId `klma-e4989e4bd47d` → §6D slug | the curator corrected the time from `12:00 am` to `5:00 pm`. §5.4: a detail change is an EDIT. |
| `9732c8ce-0fa8-4fa5-8641-9dfb7b78603d` | title `Cozyzone` → `John Angus Band @ Cosey Club (Cozyzone)`; externalId `3406121b0a13` → §6D slug | §VA.2 trap 3: Cozyzone is the club's Sunday session, not an act. A public title naming no artist is not usable. Time 14:00 was already correct and was left alone. |
| `d6f984bf-11f7-4de0-abca-012aedd25e72` | added §6D externalId | the gig already existed with no provenance. §5.3. |
| `0aab2979-bbac-4b53-9b73-4caa32c6ae74` | added §6D externalId | Amnesia @ Granville's 2026-09-26 already existed with no provenance. Covers added row idx 233. |

## 6. Artists — quality, not error count (§6, v2.5)

### Created with a VERIFIED PAGE — 2 of 2

**`66a15ead-fb21-4979-bbc8-f62c53a0cbee` Brass Monkees** — Chester, city.
`facebook.com/thebrassmonkees`, avatar from the graph URL, bio quoted verbatim, genres
Funk/Pop/Soul/R&B, actType covers, website `brassmonkees.com`.
Variants tried: Google `brassmonkees band`, then `brass monkees band facebook`. Page VISITED,
not snippeted. nameVariants `Brassmonkees`, `Brass Monkeys`.

**`b142111d-d68b-4450-8759-57ac32875052` The Endings** — Telford, city.
`facebook.com/TheEndingsTelford` (6.1K followers, active), avatar, genres Folk/Punk/Rock,
actType originals+covers. Variant tried: Google `"the endings" celtic folk punk band`. Page VISITED.
**bio left EMPTY on purpose.** The page's only intro text is *"This is the official Facebook page
for The Endings - Telford"*, which is page chrome, not bio. §2A.1 item 8c permits stripping it and
item 8 forbids composing a replacement. Blank beats invented. The validator WARNs on this and the
warning is correct behaviour, not a defect.
Name: the page reads `The Endings - Telford`. The town tail is a disambiguator, not the act name
(§0.6), corroborated by The Buttermarket Shrewsbury billing them `The Endings`. Tail kept as a
nameVariant.

### Created with an EVIDENCED BLANK — 0

### Names SANITISED or repaired

- **`Brassmonkees` / `Brass Monkeys` → Brass Monkees.** Two spellings, two venues, two dates, one
  act. Settled on the band's OWN site `brassmonkees.com` — *"an electric 9 piece Wedding and
  Function Band Covering Cheshire, Shropshire, Manchester, Merseyside and the Midlands"* — which
  matches the sheet's `9 piece Soul/SKA/Motown` note and covers both gig towns. §1A.2 footprint:
  adjacent, same act, one record.
- **`147e5807-0d86-4313-92ac-05a2baf1b01f` renamed `Arctic Stereo Killers are Back` →
  `Arctic Stereo Killers`** (§1A.4 repair on contact). `are Back` was a billing string welded onto
  the name. The act's own page (`facebook.com/arcticstereokillers`, already stored on the record)
  is titled `Arctic Stereo Killers`. Old name kept as a nameVariant. Bio captured verbatim, cut at
  a line boundary to drop a dated `NEXT GIG:` line (§2A.1 item 8a).

### Matched and reused — 8

Dawson Dean `mBRvfim8KGXkpqmb3wVa` · The Vanz `7a16a3b6-ed61-4d0f-8191-1d89fdcf440f` ·
Angel Of Harlem `b2582e2a-594f-4df1-8129-b8e65fe9769d` · Ego King `66a87a51-effa-4657-ad22-665cadbea5c5` ·
Native Way `e5ikgvWu8HHNApkQiPoy` · C&C Duo `GfYlNk9J3qqdWrxSnRPW` ·
Not Guilty `15a8c00c-8c8c-4942-a0c0-6a0348f5f6c8` · John Angus Band `18797b19-c023-42aa-a62e-76e00c3659ac` ·
Amnesia `aedb52b9-6de9-4487-bb73-1aa59880074b`.

**John Angus Band** was a §1A.2 same-name test: the record is `North East, UK` and the gig is
Crewe. Resolved by enrichment, not by location text — `johnangusband.co.uk` and
`facebook.com/JABB2017` are the only act of that name with any presence, they are an original rock
blues band, and the sheet's genre cell reads `Rock/Blues`. One act, touring. Reused.

**Not Guilty** has three records: `dbf7563d` (Yorkshire), `15a8c00c` (Stoke, claimed) and
`dd831762` `Not Guilty (Stoke on Trent)` (Stoke). The Cosey gig already existed on `15a8c00c`, so
the footprint answered it. The other two are a live §1A duplicate pair — raised to the inbox.

## 7. Venue resolution

| Sheet billing | bndy venue | note |
|---|---|---|
| `The Cosey, Haslington` | `LHrDNnXeCU1eirDOxUKc` Cosey Club | matched at **20% low_confidence**. §3.1: opened, not dismissed. |
| `Granvilles Stone` | `pkmhj8ElmrfJWNoWLn6X` Granville's Restaurant & Music Bar | `search_venue` MISS. Found by §3.1 fallback (c) `list_venues(city:"Stone")`. The apostrophe in `Granville's` defeats the search. |
| `St Lawrence's, Biddulph` | `27024589-638e-43c3-b13d-a1748031c1e8` St. Lawrence's Parish Church | `search_venue` MISS. Found by fallback (c). Full stop AND apostrophe. |
| `The Cock Inn, Leek` | `ty1aOZiIsEDpFBBPM6m5` | 100%. |
| `The Shamrock Irish Bar, Leek` | `4372ad41-49dd-4e83-aedd-6846c1da11c6` The Shamrock Bar Leek | 38% low_confidence, place_id and address agree. Opened before use. |
| `Grumpys Motorcycles` | `HDfCfgFwyafaVHhzYA5z` Grumpy's-GB Motorcycles | reached via the existing event. |

**Zero venues created.** Two more `search_venue` punctuation misses this run — the sixth and
seventh recorded instances. Without §3.1's three-probe rule this run would have created two
duplicate venues in one morning.

## 8. §VA venue-authoritative checks

| Venue | Status | Yield |
|---|---|---|
| **Cosey Club** | **CHECKED** — `thecosey.co.uk/shows`, first render, 17 rows to Sat 03 Oct | Confirmed 8 of 9 added Cosey names exactly: VAVOOM!!, ANGEL OF HARLEM, BRASSMONKEES, NOT GUILTY, EGO KING, THE ENDINGS, THE VANZ, ARCTIC STEREO KILLERS. Zero contradictions with the sheet. |
| **The Sugarmill** | **CHECKED** — sole-source feed, §VA.9 | 0 added / 0 removed. |
| **Eleven** | **NOT CHECKED** | No added row at this venue this run. Nothing to arbitrate. |
| **The Rigger** | **NOT CHECKED** | No added row at this venue this run. |
| **Artisan Tap** | **NOT CHECKED** | No added row at this venue this run. Its surface is still unproven (§VA.1). |

The three unchecked venues are reported as unchecked, per §VA.5. No name was taken from a venue
page that was not read.

**Cosey notes.** `John Angus Band` (Sun 27 Sept) is absent from the venue page's first render —
the club lists its Sunday sessions under the `COZYZONE` name, not the act's, so the page cannot
spell-check that row. The name came from the sheet and is already clean.
The §VA.1 open question — whether `The Cosey` and `Cosey Club` are one room — is unresolved but
looks benign today: the page uses `Cosey Club` for its own club events (QUIZ NIGHT) and
`The Cosey` for band bookings. Not ruled on. No second venue was created.

## 9. `Cost/Ticket` column (§CT)

| Row | Cell | Written |
|---|---|---|
| Dawson Dean @ The Cock Inn | `Free` | `ticketed:false`, `price:"Free"` |
| Dawson Dean @ St. Lawrence's | `£10.00` | `ticketed:true`, `price:"£10.00"` |
| all others | blank | nothing written (§CT rule 2) |

No new vocabulary this run. No row was parked over a ticketing string.

## 10. Gate bounces, verbatim

```
DUPLICATE_EVENT — "Event already exists: This artist already has an event at this venue on
2026-09-27. Artists can only have one gig per venue per day."
existingEventId: 9732c8ce-0fa8-4fa5-8641-9dfb7b78603d  existingEventTitle: "Cozyzone"
```
One bounce, correctly a success signal. The existing event was edited, not worked around (§0.9).

## 11. Rows not written

**Skipped, cannot be written safely — 1**

- `Dawson Dean — Higher Ground Cafe — 2026-08-30`. The sheet gives no town. `search_venue` on
  Stoke-on-Trent and Leek both miss, and a web search returns only US and Canadian cafés of that
  name. §0.8 forbids guessing a town to get a place_id. **No venue created, no event created.**
  The row stays in the sheet and re-presents next run.

**Deferred on budget — 5** (each needs a new artist plus a full §2A enrichment pass)

| Row | Date | Venue |
|---|---|---|
| Vavoom | 2026-09-04 | Cosey Club — name confirmed on the venue page as `VAVOOM!!` |
| Groove 45 | 2026-09-12 | Granville's |
| Fools Life | 2026-09-18 | Granville's |
| GemmaRae | 2026-08-16 | The Fountain Inn - Leek |
| Imperial Bees, The Groves, And The Filters | 2026-09-05 | The Queens Hotel In Macclesfield (§4 three-way split) |

**Already in bndy, no action needed — 3**: Angels Of Darkness @ Riff Factory 2026-09-05
(`a9a5855b`), Jean & Rogers @ The Bellringer 2026-09-05, Amnesia @ Granville's 2026-09-26
(externalId added, §5).

## 12. Validator (§6A step 8)

Evidence file written BEFORE each bndy write:
`data\state\enrichment-evidence-2026-08-15-klma-stoke-gig-list.jsonl` (3 records).
Records file: `data\state\enrichment-records-2026-08-15-klma-stoke-gig-list.json`.

```
3 records · 2 clean · 0 FAIL · 1 WARN   [mode=gate]      exit 0
```

**One FAIL was caught and fixed before this report was written.** `GENRE_ENUM: 'Irish' is not in
the canonical list` on The Endings. `create_artist`'s own schema ACCEPTS `Irish`; the canonical
36-value list in `bndy-frontstage/src/lib/constants/genres.ts` does not contain it. §0.18 names the
constants file as the authority, so the value was removed and the record now reads Folk/Punk/Rock.
This is the BLD-54 schema disagreement biting a live write. It is not a new defect and is not
raised again.

The remaining WARN (`STUB_NO_BIO` on The Endings) is explained in §6 and is deliberate.

## 13. Tombstone check (§5.4)

`data\state\cancellations.jsonl` grepped for every artist, venue and date in the added set before
the first create. **No match.** Nothing was created over another run's evidenced deletion.

## 14. Findings raised to `CTO-INBOX.md`

Four new lines. Fingerprints checked against the file first; nothing already present was re-raised.

- `klma-header-row-no-longer-last` — the spec's cheapest layout check is now unsafe.
- `cosey-stale-one-day-shifted-events` — three live Cosey events one day off the venue page.
- `lineup-named-artist-epileptic-hillbillys` — a §0.3 violation in live data.
- `not-guilty-three-records-two-stoke` — a §1A indistinguishable pair.

## 15. Things this run did NOT do, stated plainly

- It did not check Eleven, The Rigger or Artisan Tap. No added row needed them.
- It did not delete anything. The spec declares no §0.29 mode.
- It did not touch the claimed `Not Guilty` artist record `15a8c00c` (§0.16). It added provenance
  to that artist's existing EVENT only.
- It did not split `Imperial Bees, The Groves, And The Filters`. Deferred whole, not half-done.
- It did not run `record_run` (`SOURCE_RUNS_TOKEN` missing — known, not blocking).
