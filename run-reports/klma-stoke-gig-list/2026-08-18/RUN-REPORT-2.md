# KLMA Stoke gig list — RUN REPORT 2026-08-18 (second firing)

- **Run id:** `klma-stoke-gig-list-2026-08-18T21-32-04Z`
- **Outcome:** PARTIAL. 11 events created and verified. No artist could be created.
- **Runbook read:** `RUNBOOK.md` H1 **v2.27**. §6A CURRENT FLOOR **v2.19**. Assertion PASSES.
- **Prompt floor:** the task prompt names no number. It defers to §6A. No drift to report.
- **Spec read:** `sources/klma-stoke-gig-list.md` in full, including §VA and §VA.9.
- **Claim:** `data/state/claims/klma-stoke-gig-list.json` was `heldBy: null`, released by the
  03:08Z firing. Acquired normally. No takeover. TTL 2 hours per §6G.
- **Tombstones:** `data/state/cancellations.jsonl` holds 3 lines. None matches any artist,
  venue or date in this run.
- **Report path:** this is the SECOND firing of 2026-08-18. §6A step 7 fixes one report path per
  date, so this file is `RUN-REPORT-2.md` and the 03:08Z firing's `RUN-REPORT.md` is untouched.
  Already raised as `run-report-path-collides-on-second-firing`; not re-raised.

---

## 1. THE HEADLINE — 11 gigs landed, every one of them blocked this morning

The 03:08Z firing skipped 12 rows because their acts were not in bndy and Chrome was down, so
no artist could be created (§2A.1 item 5). **Between then and now, 8 of those acts appeared in
bndy.** They were written by an unidentified process at ~04:13Z and are already raised as
`unclaimed-bare-artist-creates-0413z`.

**The artists exist. Reusing an existing artist is not creating one.** So every one of those
rows became writable without touching a single `create_artist` call:

| Act | bndy artist id | Rows unblocked |
|---|---|---|
| Whiskey Rebel | `74bb42af-aa1c-4227-9964-49a17550fdab` | 3 |
| WILKO | `74e74e95-2b73-4ca3-b6c8-b83b86a57a81` | 4 (2 written, 2 held — §6) |
| Guns for Girls | `e31f7482-114f-459d-bbe8-225851ec7c4f` | 1 (half of a split bill) |
| One Dimensional Creatures | `efbc1768-6ad2-4037-8a5b-ecaaed62ee29` | 1 (half of a split bill) |
| Devoted | `c38d38ba-0f70-462d-b413-6b8a52c1ec68` | 1 |
| Chaindrive | `caff9ca1-9b85-4439-878a-9e4399cfc12a` | 1 |
| Strawberry Blonde | `945b4ec0-c7a1-465b-a228-1a4b220fe31b` | 1 |
| Marc Gollins | `e1c25d46-082b-4ee6-810e-c6145930c31e` | 1 |

⚠ **These rows are NOT in this run's diff, and that is the finding.** The 03:08Z firing wrote
them into the snapshot, because a snapshot records what the source PUBLISHED, not what was
imported. Under a strict diff they are "unchanged" and would never be offered to a run again.
They were worked here only because the previous run named them in its report and this run read
it. **That is a person-shaped safeguard, not a mechanical one.** Raised as
`blocked-rows-not-re-presented-by-diff`. Same class as `insangel-snapshot-hides-backlog`, now
confirmed on a second source with a measured cost of 11 gigs and 18 hours.

## 2. Chrome — still unreachable

`list_connected_browsers` returned `[]`. `tabs_context_mcp` returned "not connected". Two
attempts. Not transient. This is the same outage the enrichment task has now logged for 23
consecutive firings, and the KLMA fingerprint `klma-chrome-unreachable-blocks-artists` is
already open from the 03:08Z firing. **Not re-raised** (CTO-INBOX rule 5).

**What it still costs.** 3 acts remain unwritable: **Definitely KB**, **KNUTMO FIVE**,
**KANGARU**. All three need a `create_artist`, and §2A.1 item 5 has no exception.

## 3. Capture

| Feed | Surface used | Result |
|---|---|---|
| Section 1, KLMA sheet | container `curl` on `gviz/tq?tqx=out:html` | HTTP 200, **148,450 bytes**, 427 DOM rows |
| Section 2, Sugarmill | `web_fetch` | 30 distinct gigs, all hrefs intact |
| Cosey Club | not re-fetched | no Cosey row in this run's added set — see §7 |

**Liveness evidence.** The capture is 793 bytes larger than the 03:09Z one and contains rows
that one does not. A cached copy cannot grow.

**Column layout re-verified.** 14 columns; header cells `[2]=Artist [3]=Venue & Location
[5]=Cost/Ticket [6]=Genre [7]=Link to Event`. Post-2026-08-06 mapping, no off-by-one.

⚠ **The header row moved again.** At 03:09Z it was DOM row 413 of 425 with 11 submissions after
it. Now it is row 427 of 427 — last again. **Its position is not stable in either direction**,
so the spec's "last row is the cheapest check" is unsafe and the run must locate the row
containing `Link to Event`. Already raised as `klma-header-row-no-longer-last`; not re-raised.

Raw capture: `data/raw/klma-stoke-gig-list/2026-08-18b/`.

## 4. Diff (§5.7, §5.7(a)) — a raw-line diff over-reports this source by 26 rows

**Section 1, raw line diff:** 29 added / 27 removed.

**Section 1, keyed diff (date + artist + venue, leading row-id stripped, `£7`≡`£7.00`):
1 added / 0 removed.**

**26 of the 29 "adds" pair with 26 of the 27 "removes". They are the same rows, reformatted by
the sheet, not by us.** The curator's raw form submissions have been rewritten into the sheet's
standard shape overnight:

```
03:09Z  17/08/2026 22:51:28 21/08/2026 WILKO Navio Lounge, Nantwich Country & Blues
21:33Z  46251.9524 Friday, August 21, 2026 WILKO Navio Lounge, Nantwich Country & Blues
```

Same gig. Both the leading cell (form timestamp → float row-id) and the date cell
(`DD/MM/YYYY` → `Day, Month DD, YYYY`) changed. Separately, the junk form-metadata placeholder
rows rolled their fake years — `2027-12-xx` → `2040-12-xx`, `2040-01-xx` → `2041-01-xx`.

⚠ **This is the RUNBOOK §5.7(a) formatting-drift class, fourth instance on this source, and it
is the largest yet.** A run that diffed raw lines and had a `delta` mode would have proposed
**11 future-dated deletions of gigs that are still published**, including four it had created
itself 18 hours earlier. The seven normalisation rules in §5.7(a) do not catch this: they
normalise whitespace, punctuation and entities, and this drift is a *field-format* rewrite.
**The keyed diff is what caught it.** The mode declaration is the only reason it was harmless.

**Mode.** The spec declares no §0.29 mode. The run is **append-only**. Already raised as
`klma-no-delta-mode-declared`; not re-raised. **Nothing was deleted and nothing was hidden.**

**THE ONE GENUINELY NEW GIG ROW:** `Definitely KB @ The Bush At Brown Edge, 2026-09-05`.

**Section 2, Sugarmill:** 30 rows, **0 added / 0 removed**. Status markers unchanged
(`declan-mckenna` SOLD OUT, `arkayla` SOLD OUT, `the-year-grunge-broke` RESCHEDULED).

**§5.7(a) SELF-DIFF GATE.** The written snapshot re-diffed against the capture it came from:

```
SECTION1: snapshot 426 rows, capture 426 rows, added 0, removed 0
SECTION2: snapshot  30 rows, capture  30 rows, added 0, removed 0
```

**0 added / 0 removed on both sections. PASS.**

## 5. Work order (spec's CTO ruling 2026-08-08)

Grouped by artist, largest group first: **Whiskey Rebel (3)**, **WILKO (4)**, then the singles
and the one split bill. Budget was not the limiting factor. No row was deferred for want of
time this run.

## 6. Records written — 11 created, 1 corrected, all verified by `get_by_id` (§0.10)

| Event id | Title | Date | Time | Venue id | Artist id |
|---|---|---|---|---|---|
| `0f22741b-1c43-41cf-9263-de1c70e85502` | Whiskey Rebel @ Butchers Arms | 2026-08-30 | 19:00 **defaulted** | `e95bca2e-e019-48c1-b6f7-1b4db860f931` | `74bb42af-aa1c-4227-9964-49a17550fdab` |
| `d34452ec-4adf-4a0f-a928-4f5228da4ec1` | Whiskey Rebel @ The Black Cock | 2026-09-05 | 21:00 **defaulted** | `C34vgRZar2gYJPcEydl9` | `74bb42af-aa1c-4227-9964-49a17550fdab` |
| `c058c1c5-07d8-461b-b5f5-3db8490a96f8` | Whiskey Rebel @ New Finney Gardens | 2026-09-11 | 21:00 **defaulted** | `88edfa74-bbd3-4734-aea2-cd0a9343f05c` | `74bb42af-aa1c-4227-9964-49a17550fdab` |
| `9b87d6f3-9399-4539-ada1-499bc37183b9` | Guns for Girls @ Grumpy's-GB Motorcycles | 2026-08-22 | 21:00 **defaulted** | `HDfCfgFwyafaVHhzYA5z` | `e31f7482-114f-459d-bbe8-225851ec7c4f` |
| `41a25f26-68e5-4984-8bee-a4b61cc13b64` | One Dimensional Creatures @ Grumpy's-GB Motorcycles | 2026-08-22 | 21:00 **defaulted** | `HDfCfgFwyafaVHhzYA5z` | `efbc1768-6ad2-4037-8a5b-ecaaed62ee29` |
| `00e799b7-b38e-4d63-86dc-020fd49a061c` | Devoted @ The Old Star | 2026-08-22 | 21:00 **defaulted** | `cr54ADsGpNZBWpd0Rmei` | `c38d38ba-0f70-462d-b413-6b8a52c1ec68` |
| `6b106026-e0b3-47fa-a01b-9cc9b3052012` | Chaindrive @ The Old Post Office | 2026-08-28 | 21:00 **defaulted** | `ocqMyrVLWZkxk5zEjJ2w` | `caff9ca1-9b85-4439-878a-9e4399cfc12a` |
| `f73598ea-ac24-491a-a436-e497e275b058` | Strawberry Blonde @ Swan Inn | 2026-08-21 | 21:00 **defaulted** | `74BjwiHSxHDxdUghRVB9` | `945b4ec0-c7a1-465b-a228-1a4b220fe31b` |
| `698f0f8d-c006-4066-8333-673b053f0c76` | Marc Gollins @ Waggon & Horses | 2026-08-22 | 21:00 **defaulted** | `xDcdX6nXL4kszVnDjlpj` | `e1c25d46-082b-4ee6-810e-c6145930c31e` |
| `a345e9b9-bddd-414d-ac17-d6a5dbd7498e` | WILKO @ Navio Lounge | 2026-08-21 | 21:00 **defaulted** | `f2526159-6726-41c9-b86b-680db69ff169` | `74e74e95-2b73-4ca3-b6c8-b83b86a57a81` |
| `040730b6-631f-42be-956d-1039abdc7fcb` | WILKO @ The Black Lion | 2026-11-07 | 21:00 **defaulted** | `ImnGvNQiQeckEIJYVgzu` | `74e74e95-2b73-4ca3-b6c8-b83b86a57a81` |

All 11 events above were created by this run, are `isPublic: true`, carry a §6D slug externalId
under `klma-stoke-gig-list`, and were read back with `get_by_id` (§0.10).

**All start times were defaulted by the server (§5.6).** The sheet published no time for any of
these rows. Every response returned `startTimeDefaulted: true`.

**Ticketing written (§CT), all matched case-insensitively after trimming:**

| Row | Cell | Written |
|---|---|---|
| Guns for Girls / One Dimensional Creatures | `£5.00` | `ticketed: true`, `price: "£5.00"` on BOTH children, sibling named in `ticketInformation` per §CT rule 6 |
| Chaindrive | `Free entry` | `ticketed: false`, `price: "Free"` |
| Strawberry Blonde | `Free` | `ticketed: false`, `price: "Free"` |
| Whiskey Rebel ×3, Devoted, WILKO ×2, Marc Gollins | *(blank)* | nothing written — §CT rule 2, blank is unknown, not free |

**One row's Link column held prose, not a URL.** Whiskey Rebel 2026-08-30 carries
`Charity event for the Dougie Mac` in column 7. It is a submitter putting a note in the wrong
field, not column drift — column 6 correctly holds `Rock/Pop`. Stored verbatim in
`description`, which is punter-useful source text, not provenance (§0.12). Not stored as an
`eventUrl`.

### Correction made this run

⚠ **I HTML-escaped an ampersand and §6B forbids exactly that.** `create_event` was called with
the title `Marc Gollins @ Waggon &amp; Horses` and stored the literal `&amp;`. Caught on the
create response, corrected immediately with `edit_event(title:"Marc Gollins @ Waggon & Horses")`
and confirmed by `get_by_id`. **My error, not a tool fault.** The rule is already written
(§6B, 2026-07-31) and needs no new inbox line. Recorded here because a correction belongs in
the report.

## 7. Rows NOT written, and why

**Blocked — the act is not in bndy and no artist can be created without Chrome (3 acts).**

| Act | Row | `search_artist` result |
|---|---|---|
| **Definitely KB** | The Bush At Brown Edge, 2026-09-05 | top match `Definitely Oasis` (Derby) **69%** — a different act. 2,239 scanned |
| **KNUTMO FIVE** | Sugarmill, 2026-09-13, support | nothing above 60%, 2,243 scanned |
| **KANGARU** | Sugarmill, 2026-09-13, support | no match at all, 2,243 scanned |

Definitely KB is the run's only genuinely new sheet row. The two Sugarmill supports are the
outstanding §4 split already raised as `sugarmill-dream-machine-supports-unsplit`.

**Held as unsafe to write — the WILKO double booking (2 rows).**
The sheet still bills **WILKO at two venues on 2026-08-29** — The White Lion, Macclesfield and
The Bush at Brown Edge — submitted 42 seconds apart. One is wrong. Chrome is down, so WILKO's
own page cannot settle it, and no new evidence has arrived since 03:08Z. **Both rows stay
unwritten under §0A(b).** The act's other two dates (21 Aug, 7 Nov) are unaffected by the
conflict and were written. Already raised as `klma-wilko-two-venues-one-night`; not re-raised.

**Park-lotted on the spec's `specialist_venues` list (2 rows).**
`Camems @ Artisan Tap, 2026-08-19` and `Uncle Dad & The Day Drinkers @ Artisan Tap, 2026-08-30`.
**Both acts now exist in bndy**, and the spec's two stated blockers for park-lotting Artisan Tap
and Eleven — no multi-artist `create_event`, and no artist-locality method — are **both
resolved** (§4 splitting and §2A shipped long ago). The park-lot is now costing real gigs at a
live Stoke room. **A run does not change a rule**, so the rows stay park-lotted and the question
is raised as `artisan-tap-eleven-parklot-blockers-resolved`.

**Rejected on the §6 accept/reject filter (1 row).**
`The Band Jam @ The Bradeley Stratheden`, 2026-08-30, genre `All Comers` — an open jam, not a
named act. Same call as 03:08Z.

## 8. Venue resolution — 0 created, 2 duplicate pairs found

**No venue was created this run.** Every venue resolved to an existing record.

⚠ **`search_venue` was defeated by an apostrophe again — the sixth confirmed instance.**
`search_venue("The Butcher's Arms", "Forsbrook")` → *no venues found*, 0 scanned. The §3 fallback
probe `search_venue("Butchers Arms", "Forsbrook")` returned the venue at **100%**. Had the ladder
been trusted, this run would have created a duplicate.

**Two duplicate venue pairs found while resolving, both same-address / two-place_id:**

| Pub | Records | Note |
|---|---|---|
| Butchers Arms, 62 Cheadle Rd, Forsbrook ST11 9AS | `e95bca2e-e019-48c1-b6f7-1b4db860f931` (holds the klma externalId) and `468d27bb-e085-4628-b4ec-0cadf54008b5` | used the klma-tagged one |
| The Old Star, Queen St, Uttoxeter ST14 8HJ | `cr54ADsGpNZBWpd0Rmei` and `844002d0-e423-43d1-8705-df49a7a276e8` | **both hold a `klma-stoke-gig-list` externalId** — this source created both |

Both raised. Neither merged: §0.11 forbids a merge inside an import run.

**One postcode variance, not a blocker.** The sheet bills Grumpys as `Canal Street, Longport.
ST6 4LU`; the bndy record `HDfCfgFwyafaVHhzYA5z` is `Canal St, ST6 4NW` and already carries this
source's own venue externalId `venue-grumpys-longport`. Same street, same business, established
klma record. Reused, and the variance is noted rather than acted on. It surfaced at **30%
low_confidence**, which §3 (v2.16) says to open rather than dismiss — that is what happened.

## 9. §VA venue-authoritative checks

| Venue | Status | Finding |
|---|---|---|
| **The Sugarmill** | **CHECKED** (`web_fetch`) | Sole-source feed. 30 rows, 0 added / 0 removed. |
| **Cosey Club** | **NOT RE-FETCHED** | No Cosey row in this run's added or worked set. The 03:09Z firing checked it 18 hours ago. Nothing was imported from Cosey unchecked. |
| **Eleven** · **The Rigger** · **Artisan Tap** | **UNREACHABLE / no surface** | Egress blocks the first two (HTTP 000 at 03:09Z); Artisan Tap still has no proven surface. **No row from any of the three was imported this run** — the two Artisan Tap rows are park-lotted, see §7. |

**No row was imported from a venue whose page went unchecked.**

**Sugarmill source faults — rechecked, unchanged.** `CHERRY KISS` still links to
`nottingham-1-the-island-quarter`, a different venue (row is a 23:00 club night, rejected
anyway). `THE YEAR GRUNGE BROKE` still carries a `2025-12-06` slug and ticket link against a
listed date of 4 September 2026; bndy holds 2026-09-04 and that stays. No row is missing a
ticket link. `ELECTRIC FRIDAYS: CONFESSIONS` (21 Aug) is still banner-only with no gig-guide
row; club night by name, not captured.

## 10. QUALITY REPORT (§6, v2.5)

- Events created and read back: **11**.
- Events corrected: **1** (own `&amp;` error, §6).
- Artists created: **0**. **Nothing here is a stub, because nothing was created.**
- Venues created: **0**.
- Records created **with a verified page**: **0** — no record was created that needs one.
- Records created with an **evidenced blank**: **0**.
- Enrichment top-ups: **0**. Every one needs a page visit, which needs Chrome. The 8 reused
  artists all carry `location: "Staffordshire UK"` and no socials; they belong to the
  enrichment task's backlog, not to this run.
- Genres NOT written: the sheet publishes a genre for most of these rows
  (`Rock/Pop`, `Biker rock`, `Alternative Rock + Post Punk`). A genre-only artist top-up is
  currently a known false-FAIL against the validator
  (`validator-genre-only-fb-evidence-mismatch`), so it was left alone rather than spend the run
  on a correction cycle. Named here so it is a decision, not an omission.
- Rows skipped: **8** — 3 blocked on the identity check, 2 held on the WILKO conflict, 2
  park-lotted at Artisan Tap, 1 rejected as an open jam.
- Names sanitised: **0**. No worked row needed §0.6 stripping.
- Names staged as non-acts: **1** (`The Band Jam`).

## 11. Validator (§6A step 8)

```
0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit code 0. **0 FAIL.** The run wrote no artist and no enrichment field, so there is no
enrichment record to validate and no evidence file
(`enrichment-evidence-2026-08-18-klma-stoke-gig-list.jsonl` was not created — writing an empty
one would assert work that did not happen).

## 12. Gate bounces

None. No 409, no 422, no 500. Every call returned success and every write read back correctly.
**Zero duplicate bounces is itself a signal**: all 11 gigs really were absent from bndy.

## 13. Housekeeping

- Snapshot written to `data/state/klma-stoke-gig-list-last-page.txt`, both sections, with the
  normalisation rules and the 0/0 self-diff in the file. §6A step 7 fail-closed gate satisfied.
- `data/state/run-summary.jsonl` appended (one line, append-only).
- `20-Daily/2026-08-18.md` appended.
- `record_run` not called — `SOURCE_RUNS_TOKEN` is still unset. Known and not blocking
  (`record-run-token-missing`).
- Claim released with `heldBy: null`. Heartbeat rewritten to `completed`.

## 14. Raised to CTO-INBOX.md

| Fingerprint | Kind |
|---|---|
| `blocked-rows-not-re-presented-by-diff` | RULE |
| `artisan-tap-eleven-parklot-blockers-resolved` | RULE |
| `klma-venue-duplicate-butchers-arms-forsbrook` | DATA |
| `klma-venue-duplicate-old-star-uttoxeter` | DATA |

Not re-raised, already present: `klma-chrome-unreachable-blocks-artists`,
`klma-no-delta-mode-declared`, `klma-header-row-no-longer-last`,
`klma-wilko-two-venues-one-night`, `sugarmill-dream-machine-supports-unsplit`,
`run-report-path-collides-on-second-firing`, `unclaimed-bare-artist-creates-0413z`,
`record-run-token-missing`, `validator-genre-only-fb-evidence-mismatch`.
