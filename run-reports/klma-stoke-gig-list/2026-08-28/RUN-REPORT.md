# KLMA Stoke gig list — RUN REPORT 2026-08-28

- **Run id:** `klma-stoke-gig-list-2026-08-28T03-08-21Z`
- **Fired:** 2026-08-28T03:08:21Z
- **Runbook read:** `10-Projects/bndy-population/RUNBOOK.md` H1 **v2.27**
- **Floor asserted (§6A step 2a):** runbook CURRENT FLOOR line = **v2.19**. v2.27 ≥ v2.19. **PASS.**
- **Floor named in the task prompt:** none. The prompt defers to §6A, which is the correct shape.
  The standing drift item `prompt-runbook-floor-drift` is unchanged and is not re-raised.
- **Spec read:** `sources/klma-stoke-gig-list.md`, in full, including §VA and §CT.
- **Claim (§6A step 2b / §6G):** `data/state/claims/klma-stoke-gig-list.json` read as
  `heldBy: null`, released 2026-08-27T13:47:00Z. Acquired cleanly. **No takeover.**
  TTL 2 hours per §6G, `expiresAt` 2026-08-28T05:08:21Z.
- **Mode (§0.29):** the spec declares neither `delta` nor `append-only`.
  **The run defaulted to APPEND-ONLY. Nothing was deleted and nothing was hidden.**
  Already raised as `klma-no-delta-mode-declared`; not re-raised.

---

## 1. HEADLINE

Seven genuinely new sheet rows, all seven resolved and written or already present.
The named carry-over from the 2026-08-27 run — the Rigger bill on 20 November — was taken
**first among the new-artist work**, as the spec's ordering rule and the CTO-INBOX entry
`klma-nirvanah-la-foo-fighters-deferred` both required. Both acts are now in bndy with
verified pages, quoted bios and correct locations.

**The line diff overstated the change by a factor of three, and the run did not act on it.**
Nineteen lines were added and fourteen removed against yesterday's snapshot. **Twelve of
those pairs are one and the same rows, reformatted by the curator's sheet** — the leading
cell flips between a form timestamp and a float row-id, and the Date cell flips between
`D/M/YYYY` and `Weekday, Month D, YYYY`. Every one of the twelve was pipelined by
yesterday's run. This is the standing `klma-sheet-reformats-rows-defeats-line-diff`
defect, and it is the reason this source must never delete on a line diff.

**The budget was not exhausted.** No added row was deferred.

## 2. Capture

| | |
|---|---|
| Surface | container `curl` on `gviz/tq?tqx=out:html&gid=831966245` |
| Result | HTTP 200, 106,068 bytes, md5 `85188fcf3818c3b6e16006758a3e01fc` |
| DOM rows | 410, **8 `td` cells on every row** |
| Normalised rows | 409 |
| Raw kept at | `data/raw/klma-stoke-gig-list/2026-08-28/gviz.html` |

`web_fetch` on the gviz endpoint was **not** used — the spec records it serving an
eight-week-stale cache. The container curl route confirmed again as live
(`klma-curl-reproduces-gviz-live`, standing, not re-raised).

**§VA.5(b) column-alignment check — PASSED.** Every DOM row carries 8 cells. The seven
added rows were read cell by cell before any write, and the mapping held on all seven:

```
0 rowid/timestamp | 1 Date | 2 Artist | 3 Venue & Location | 4 Time | 5 Cost/Ticket | 6 Genre | 7 Link to Event
```

No genre text was found bleeding into the artist column this run.

**Section 2 (Sugarmill)** captured by `web_fetch` of `thesugarmill.co.uk/gig-guide/`,
hrefs intact. 28 distinct gigs after deduping by slug (the page renders each gig twice).
Kept at `data/raw/sugarmill/2026-08-28/gig-guide.txt`.

## 3. Diff

### Section 1 — KLMA sheet

| | |
|---|---|
| Lines added | 19 |
| Lines removed | 14 |
| **Of which reformat noise** | **12 pairs** |
| **Genuinely added** | **7** |
| **Genuinely removed** | **2** |

The twelve reformatted pairs, for the record — same gig, both sides:

| Row | Was | Now |
|---|---|---|
| Danny Brab, Shroppie Fly Audlem, 3 Sep | `24/08/2026 22:25:58 03/09/2026` | `24/08/2026 22:25:58 Thursday, September 3, 2026` |
| Notorious 80s, Ashwood Longton, 28 Aug | `25/08/2026 14:07:48 28/08/2026` | `46259.58875 Friday, August 28, 2026` |
| Whiskey Rebel, Moorville Hall, 3 Oct | `25/08/2026 23:09:16 03/10/2026` | `46259.96477 Saturday, October 3, 2026` |
| Southbound, Ash Inn Mow Cop, 30 Aug | `26/08/2026 11:03:26 30/08/2026` | `46260.46071 Sunday, August 30, 2026` |
| C&C Duo, The Star Church Leigh, 29 Aug | `26/08/2026 12:35:59 29/08/2026` | `46260.52499 Saturday, August 29, 2026` |
| Contraband-Stoke, Black Cock Blythe Bridge, 29 Aug | `26/08/2026 15:07:38 29/08/2026` | `46260.6303 Saturday, August 29, 2026` |
| David Cotterill, Swan Stone, 26 Aug | `26/08/2026 17:55:05 26/08/2026` | `46260.74658 Wednesday, August 26, 2026` |
| VANZ Acoustic Duo, Mere Inn Alsager, 28 Aug | `26/08/2026 17:56:05 28/08/2026` | `46260.74728 Friday, August 28, 2026` |
| The VANZ Band, Rumba Bar Congleton, 29 Aug | `26/08/2026 17:57:06 29/08/2026` | `46260.74799 Saturday, August 29, 2026` |
| The VANZ Band, Sun Inn Stafford, 29 Aug | `26/08/2026 17:57:57 29/08/2026` | `46260.74858 Saturday, August 29, 2026` |
| The VANZ Band, Boulevard NUL, 30 Aug | `26/08/2026 17:58:53 30/08/2026` | `46260.74923 Sunday, August 30, 2026` |
| C&C Duo, Foxearth Bar, 12 Sep | `27/08/2026 13:22:39 12/09/2026` | `46261.55739 Saturday, September 12, 2026` |

**None of the twelve is a new gig and none is a removal.** All twelve were written or
matched by the 2026-08-27 run. Had this source been in `delta` mode and had the run
diffed on the raw line, §0.17 would have proposed **eleven future-dated deletions** on
nothing but a spreadsheet re-render.

### Section 2 — The Sugarmill

**0 added / 0 removed. One CHANGED row.**

| Slug | Was | Now | Action |
|---|---|---|---|
| `arkayla-saturday-19th-september-2026` | `Starts: 7:30 pm` | `Starts: 7:00 pm` | **EDITED** the bndy event to 19:00 |

The gigantic ticket URL still reads `2026-09-19-19-30`. Per §VA.9 the page heading wins
over the ticket URL, and per §0.17 a detail change on a source is an EDIT, never a new
sibling. Details in section 6.3.

## 4. Ordering — largest artist group first (spec rule, CTO ruling 2026-08-08)

The seven added rows were grouped by artist before any of them was worked:

| Order | Artist | Rows | Identity cost |
|---|---|---|---|
| 1 | The Vanz (billed `The VANZ Band` ×3, `The VANZ ROXX` ×1) | **4** | one resolution, no create |
| 2 | Andrea Harvey | **2** | one resolution, no create |
| 3 | Eddie Lee's Back to Back | 1 | one resolution, no create |

Then the named carry-over (2 new artists, 1 bill, The Rigger). Total identity work: three
reuses and two creates for nine events touched.

## 5. Future-dated rows that vanished from the sheet — LOGGED ONLY, NOTHING DELETED

Mode is append-only (§0.29, section above). **No deletion, no hide, no tombstone written.**

| Row | Date | Note |
|---|---|---|
| `46184.63095 Saturday, August 29, 2026 Ultraviolet The Furlong 9:00 pm` | 2026-08-29 | Future-dated. Gone from the sheet with no replacement row. Left live. |
| `Saturday, September 26, 2026 The Vanz - Popular Blues/rock Covers Band The Cosey Haslington` | 2026-09-26 | Future-dated. **Probably a re-book, not a cancellation** — the same act on the same date now appears at **The Boulevard, Newcastle-under-Lyme** (added row, written this run as `86b46ebc-…`). Two live Vanz events now sit on 2026-09-26 at two venues. |

The second one is the more interesting: an append-only source cannot express a venue
move, so the move arrives as one removal plus one addition and leaves both events live.
Raised.

## 6. What was written

### 6.1 Events created — 7

| # | Event | id | Date | Time | Ticketing |
|---|---|---|---|---|---|
| 1 | The VANZ Band @ The Boulevard | `86b46ebc-5fa8-4b68-9d94-8f20efae9cdb` | 2026-09-26 | 22:00 | `ticketed:false`, `price:"Free"` |
| 2 | The VANZ Band @ The Coppenhall Working Mens Club | `6544949f-f88c-4178-942e-8f2052ed3ee0` | 2026-09-27 | 17:00–18:00 | `ticketed` UNSET, ticketInformation set |
| 3 | Andrea Harvey Solo Absolute Rock fest @ Waggon & Horses | `7c068694-6aba-48ff-92fa-8fa2949558b3` | 2026-09-05 | 21:00 | `ticketed:false`, `price:"Free"` |
| 4 | Andrea Harvey's Solo Absolute Rock fest @ The Black Horse, Endon | `3ca79d24-1e17-46eb-b6d4-406a565ec109` | 2026-09-18 | 21:30 | `ticketed:false`, `price:"Free"` |
| 5 | Eddie Lee's Back to Back @ The Raven Inn | `9be1cbf2-e96a-4be1-b454-97cb1b079d38` | 2026-08-30 | 20:00 | `ticketed:false`, `price:"Free"` |
| 6 | Nirvanah / LA Foo Fighters @ The Rigger | `9008ebac-5cce-4f2b-b8f5-189effc3f920` | 2026-11-20 | 19:00 | `ticketed:true`, Eventbrite |
| 7 | Nirvanah / LA Foo Fighters @ The Rigger | `dae7842a-bac9-457b-9251-8cd70dc7ea92` | 2026-11-20 | 19:00 | `ticketed:true`, Eventbrite |

Events 6 and 7 are the **§4 split** of one bill: one discrete event per act, sharing the
title. Sibling ids recorded here so a parent event can be attached retroactively when the
generic multi-artist parent ships (§4 BUILD STATUS).

All seven verified by `get_by_id` (§0.10). All seven carry `isPublic:true` and a
`klma-stoke-gig-list` externalId in §6D slug form.

### 6.2 Events bounced 409 — 2 (success signals, §0.9)

| Row | Existing event | externalId matched |
|---|---|---|
| The VANZ Band, Granvilles Stone, 2026-09-11 | `c7829141-254a-48c1-becb-61cd64c7cb7a` | `2026-09-11-the-vanz-granvilles-restaurant-music-bar` |
| The VANZ ROXX, Cosey Club, 2026-09-25 | `1e2c8ad9-fe54-40c9-ac36-1179e563ea16` | `2026-09-25-the-vanz-cosey-club` |

Both already carried the exact id this run derived — the derivation is stable and the
idempotency key is doing its job. Neither was retried under a varied name (§0.9).

### 6.3 Event edited — 1

`95d6226b-bed5-4fa4-8efd-dec63d6b10c9` — **Arkayla @ The Sugarmill**, 2026-09-19.
`startTime` **19:30 → 19:00**, and `ticketInformation` set to `SOLD OUT` (the marker the
source has carried since 2026-08-21 and which the snapshot strips from the act name per
`sugarmill-status-marker-not-parsed`). Read back and confirmed.

### 6.4 Artists created — 2, both with a VERIFIED PAGE

| Artist | id | Location | Page | Bio |
|---|---|---|---|---|
| Nirvanah | `1aa625ae-c0ff-42f6-88b4-ff128212ef3a` | **Cardiff** (`city`) | `facebook.com/nirvanahtribute` | quoted verbatim |
| L.A. Foo Fighters | `dafce3a1-44e0-42fb-8c6f-e009b6cb9213` | **UK wide** (`regional`) | `facebook.com/LAFooFighters` | quoted verbatim |

**Zero stubs. Zero evidenced blanks. Zero staged rows.**

**Nirvanah.** Google `nirvanah band` returned the act's own site and two Facebook pages.
Both pages were visited. The one the source implies
(`facebook.com/p/Nirvanah-Nirvana-Tribute-Band-61566509236003/`) carries a post from the
act saying *"We finally got our old page back!!!"* and naming the other page — so under
§2A.1 item 2 the **recovered primary page** `facebook.com/nirvanahtribute` was taken
instead: 2.8K followers, category Musician/band, and its own Details block reads
**"Cardiff, United Kingdom"**. That is the page's own stated location, so it overrides the
gig town, and §0.7's national-act-venue restriction never had to be invoked for this act.
Identity is hard-evidenced: the page links `nirvanah.co.uk`, the act's own site.
Bio taken character-for-character from the page. actType `tribute`, genres
`Grunge / Alternative / Rock` (§0.18 — the tributed act's genres, never "Tribute" as a genre).

**L.A. Foo Fighters.** Google `"LA Foo Fighters" tribute band` returned
`facebook.com/LAFooFighters` and `la-foofighters.com`. **Both were visited.** The name
"L.A." is a real trap here — three same-name Foo Fighters tributes are genuinely Californian
(Fooz Fighters, Faux Fighters and others), and §2A.1 item 1 forbids attaching a non-UK act's
page. **The UK evidence is the Facebook page's own contact number, `+44 7825 182425`,**
plus the site's own words *"Based in the UK"* and its meta title *"UK Foo Fighters Tribute
Band"*. Its own tour list carries **this exact Rigger date at 7:00PM**, which independently
confirms both the identity and the time.
**No town is stated on either surface**, and The Rigger is a national-act venue, so §0.7
forbids the gig-town fallback: location is **"UK wide"** with `locationType: "regional"`
(§6B Kilmarnock trap — the pairing is mandatory and was written).
Name taken from the act's own site: **L.A. Foo Fighters**, with the full stops.
Bio quoted verbatim from `la-foofighters.com/home`, cut at a sentence boundary.

**Distinguishability (§1A).** `L.A. Foo Fighters` was checked against every near-name in
bndy before the create. Four exist and **none is this act**: `Foo Fighters UK` (Ilkeston),
`FOO FIGHTERS GB` (Derbyshire), `Fore Fighters` (Staffordshire) and `The F'uke Fighters`
(Derbyshire). Different names, different pages, different locations — §1A.7's "a review
verdict is not a collision" applies in advance. The new record's `UK wide` region keeps it
distinguishable from all four.

### 6.5 Artists matched — 3, no create

| Billed as | Resolved to | id | Why |
|---|---|---|---|
| `The VANZ Band` (×3) and `The VANZ ROXX` (×1) | **The Vanz** | `7a16a3b6-ed61-4d0f-8191-1d89fdcf440f` | ADR-023 (§1): `X` / `X Band` in one region is ONE artist, the qualifier belongs in the event title. Confirmed by the spec's own learned-alias line — *"The VANZ ROXX \<venue\>" → The Vanz; "ROXX" is promo*. |
| `Andrea Harvey Solo Absolute Rock fest`, `Andrea Harvey's Solo Absolute Rock fest` | **Andrea Harvey** | `d9f184e8-9fec-4917-88d7-67a355b83b82` | 100% name match, Stone. Spec alias rule: the billing goes in the EVENT TITLE, never the artist record. |
| `Eddie Lees Back to Back` | **Eddie Lee's Back to Back** | `eb5fcc95-4c45-4f6e-8d20-11cd480993e2` | Same act, Staffordshire, FB `BacktoBack60sBand`. The sheet drops the apostrophe. §0.20 — punctuation is not identity. |

⚠ **A spec conflict was decided, not escalated.** The spec's historical `ARTIST_ALIASES`
dict (2026-04-30) maps `The VANZ Band`, `The VANZ ROXX` and `VANZ Acoustic Duo` to **three
separate artists**, with the note *"Jason will reconcile these in bndy later"*. The spec's
own CANONICAL OVERRIDES block says the runbook wins and everything below it is historical;
**ADR-023 in §1 and the 2026-07-29 learned-alias line both say one artist**, and only one
Vanz record exists in bndy. One artist it is. No new record was created and none was
renamed. Recorded here rather than raised, because two live rules already answer it (§0.20
of the inbox rules: do not raise what an existing rule answers).

⚠ **No `nameVariants` were written on any record this run.** `create_artist` returns HTTP
500 with `nameVariants` and `edit_artist` returns HTTP 409 with them — both standing,
both already in the inbox (`create-artist-500-namevariants`, `edit-artist-409-namevariants`).
The billing variants are carried in the event titles instead, which is where §1A.5 puts
them anyway.

### 6.6 Venues created — 0. Venues matched — 7.

| Sheet cell | bndy venue | id |
|---|---|---|
| `Granvilles, Stone` | Granville's Restaurant & Music Bar | `pkmhj8ElmrfJWNoWLn6X` |
| `The Boulevard, Newcastle under Lyme` | The Boulevard | `a7c157f1-b969-4cd1-8598-fa58f5fecbb4` |
| `Coppenhall Club` | The Coppenhall Working Mens Club | `CCNVANtGSGM8vggYddzj` |
| `The Cosey Club, Haslington` | Cosey Club | `LHrDNnXeCU1eirDOxUKc` |
| `Waggon & Horses, Newcastle under Lyme` | Waggon & Horses | `xDcdX6nXL4kszVnDjlpj` |
| `Black Horse, Endon` | The Black Horse, Endon | `RIDVGVy7UAvWa19Zj5DQ` |
| `The Raven Crewe` | The Raven Inn | `ILter889MV8bJCrPKpVh` |

⚠ **§3.1's three-probe rule earned its place twice this run.**

- `search_venue("Granvilles", "Stone")` returned **no venues found**. The venue exists,
  in Stone, **already carrying a `klma-stoke-gig-list` externalId**. It surfaced only on
  `list_venues(city:"Stone")`. The defeating character is the **apostrophe in "Granville's"**
  — the sixth confirmed instance of `search-venue-apostrophe`, not re-raised.
- `search_venue("Coppenhall Club", "Crewe")` returned **no venues found**;
  `search_venue("Coppenhall", "Crewe")` returned the right venue at **31% low_confidence**,
  below every match ladder's create-new threshold. It was opened rather than dismissed, and
  it **already carried `venue-coppenhall-club-crewe` from this very source**. A ladder run
  mechanically would have created a duplicate.

`The Black Horse, Endon` (50%) and `The Raven Inn` (69%) were also low-confidence hits in
the right town, opened and confirmed by postcode (ST9 9BA, CW2 6NA) per §0.24.

## 7. §VA venue-authoritative checks

| Venue | Status | Finding |
|---|---|---|
| **The Rigger** | **CHECKED** — `web_fetch`, 18 dated entries to 05 Dec | Settled the 20 Nov bill as **"Nirvanah / LA Foo Fighters"** and supplied the Eventbrite ticket link the sheet lacks. |
| **The Sugarmill** | **CHECKED** — `web_fetch`, 28 dated gigs to 22 Jan 2027 | One changed row (Arkayla time). See 6.3. |
| **Cosey Club** | **NOT FETCHED** | One added row was at this venue (`The VANZ ROXX`, 25 Sep) and it bounced 409 against an existing event, so no name was written from the sheet. Nothing was imported from Cosey billing this run. |
| **Eleven** | **NOT FETCHED** | No added row at this venue. |
| **Artisan Tap** | **NOT FETCHED** | No added row at this venue. Still has no proven surface (§VA.1). |

**Name corrected from a venue page:** the sheet's `Nirvanah & L.a. Foo Fighters` against
The Rigger's `Nirvanah / LA Foo Fighters`. The venue page settled the split; the acts' own
pages then settled the spellings — **Nirvanah** and **L.A. Foo Fighters** — which is §VA's
authority order working end to end.

**Contradictions flagged:** none this run.

## 8. Times and defaults

| Event | Sheet cell | Written | Why |
|---|---|---|---|
| Vanz @ Granvilles | `9.45pm` | 21:45 | period-for-colon |
| Vanz @ Boulevard | `10pm` | 22:00 | |
| Vanz @ Coppenhall | `5pm - 6pm (3 bands on)` | **17:00 / endTime 18:00** | **§0.28 window rule.** A range is the slot, not a stage time. The uncertainty is stated in `ticketInformation`, and the event does not render as an open-ended evening. |
| Vanz @ Cosey | `9.15pm` | 21:15 | (409, not written) |
| Andrea Harvey @ Waggon & Horses | `9pm` | 21:00 | |
| Andrea Harvey @ Black Horse | `9.30pm` | 21:30 | |
| Eddie Lee's @ Raven | `8pm` | 20:00 | |
| Nirvanah / LA Foo Fighters @ Rigger | none in sheet | **19:00** | Published by the venue AND by L.A. Foo Fighters' own site as 7:00PM. **Not a default** — §5.6 was never reached. |

**No start time was defaulted this run, and none was invented.**

## 9. Ticketing — §CT mapping applied

| Cell | Mapped to | Note |
|---|---|---|
| `Free` / `free` | `ticketed:false`, `price:"Free"` | four rows, case-insensitive match per the 2026-08-08 CTO ruling |
| `See venue for details` | `ticketed` **UNSET**, ticketInformation set | states neither a zero nor a number → the `Check with venue` class |
| `Small entry fee for non-members` | `ticketed` UNSET, ticketInformation verbatim | same class (row bounced 409, so not written) |
| `Free before 9/9.30pm` | `ticketed` **UNSET**, ticketInformation `Free before 9/9.30pm` | see below |

⚠ **Two new §CT vocabulary values, both ruled in-run and neither escalated**, per the
2026-08-08 CTO ruling that a run must not escalate a phrasing:

1. **`Free before 9/9.30pm`** — a *conditional* free entry. It states neither a flat zero
   price nor a number, so `ticketed` is left unset and the condition goes verbatim into
   `ticketInformation`, where it is useful to a punter. Writing `ticketed:false` would
   publicly assert a free gig the source did not claim.
2. **`See venue for details`** — a plain synonym of `Check with venue`. Same treatment.

Both belong in the §CT table on its next touch. Named here as the ruling requires.

**Sugarmill ticketing.** The Arkayla edit added `SOLD OUT` to `ticketInformation`. The
per-gig ticket URL was already stored and its path contains `stoke-on-trent-the-sugarmill`,
so it passes the §VA.9 wrong-venue guard and was left alone.

## 10. Snapshot and the §5.7(a) gate

New snapshot written to `data/state/klma-stoke-gig-list-last-page.txt`, both sections,
with the normalisation rules in each section's own header so the next run reproduces them.

**§5.7(a) SELF-DIFF GATE — PASSED, mechanically, on both sections.**

| Section | Regenerated from | Re-diff vs the file just written |
|---|---|---|
| 1 — KLMA sheet | `data/raw/klma-stoke-gig-list/2026-08-28/gviz.html`, md5 `85188fcf…` | **0 added / 0 removed** |
| 2 — Sugarmill | the run's own `web_fetch` capture | **0 added / 0 removed** |

The gate is reported for completeness. **This run is append-only and deleted nothing**, so
no removal depended on it — but the gate is exactly what makes the twelve reformatted rows
in section 3 safe to reason about rather than merely believable.

## 11. Validator (§6A step 8)

Evidence file, written per-run and per-slug:
`data/state/enrichment-evidence-2026-08-28-klma-stoke-gig-list.jsonl` — 3 lines, JSON-valid,
**appended, never rewritten**.

```
1 records · 1 clean · 0 FAIL · 0 WARN   [mode=gate]
```

⚠ **ONE RECORD WAS EXCLUDED FROM THE GATE PASS, AND HERE IS EXACTLY WHY.**

`L.A. Foo Fighters` **cannot pass the validator as written**, and the data is correct.

The record has two truthful evidence lines, because it has two of its own surfaces:

- the **bio** is quoted from `la-foofighters.com/home` — the act's own website, which
  §2A.1 item 8 explicitly permits;
- the **facebookUrl** is read from `facebook.com/LAFooFighters`, visited via Chrome.

`load_evidence()` keeps **one line per artistId, last writer wins**. So the validator can
only ever see one surface:

- website line last → `FAIL FB_EVIDENCE_MISMATCH` (capturedFrom is not the stored fb URL);
- Facebook line last → `FAIL BIO_VERBATIM` (the FB page carries no bio text at all).

Both were observed this run, in that order. **There is no ordering that passes**, and the
only three ways to make it pass are to delete a correct bio, drop a correctly evidenced
Facebook page, or stitch two scrapes into one `capturedText` and misstate where the text
came from. The third is precisely the falsification this validator exists to catch, so it
was not done.

The record was therefore excluded from the gate pass with this rationale — the same
disposal four dated enrichment runs have used for validator false positives
(`bv2a-firing1419z-validator-cannot-check-venues` and its siblings) — and **the limitation
is raised as a new inbox item**, because it is a different shape from the ones already
logged: those are about *untouched pre-existing* bios, this is about a *clean create* whose
bio and page honestly come from two different pages the same band owns.

**Judgment-class sampling (§6A step 8, second class).** Three of the nine events touched
were re-read against source after writing: the Coppenhall window against the sheet cell,
the Rigger time against both the venue page and the act's own tour list, and the Arkayla
time against the live gig-guide heading. All three agreed.

## 12. Two things this run got wrong and corrected

1. **`&` was HTML-escaped in an event title.** `create_event` was called with
   `Waggon &amp; Horses` and stored it literally, on event `7c068694-…`. Caught by the
   §0.10 read-back, corrected by `edit_event` in the same minute, re-read and confirmed.
   This is §6B's named trap and it caught me anyway — the note is right where it should be
   and I still walked into it.
2. **The evidence file was written after the creates, not before.** §6A step 8 requires
   the evidence line first. It cannot be, on a create: the line is keyed by `artistId` and
   the id does not exist until the create returns. Standing item
   `evidence-file-cannot-precede-a-create`, not re-raised. The captures themselves were
   taken before the writes; only the file append followed them.

## 13. Standing items confirmed live again this run

| Fingerprint | Confirmation |
|---|---|
| `klma-sheet-reformats-rows-defeats-line-diff` | 12 pairs this run. The single largest source of false diff signal here. |
| `search-venue-apostrophe` | Granville's. Sixth instance. |
| `klma-no-delta-mode-declared` | Spec still declares no §0.29 mode. Run defaulted append-only. |
| `create-artist-500-namevariants` / `edit-artist-409-namevariants` | Avoided by not writing `nameVariants`. Not retested. |
| `evidence-file-cannot-precede-a-create` | Structural on any create. |
| `get-by-id-omits-locationtype` | `locationType` not returned on either new artist read-back; verified instead from the create payload. |
| `record-run-token-missing` | See section 15. |
| `sugarmill-status-marker-not-parsed` | `SOLD OUT` / `RESCHEDULED` still present, still stripped by the snapshot rules. |

## 14. Raised to CTO-INBOX

| Fingerprint | Kind |
|---|---|
| `validator-two-surfaces-one-evidence-line` | DEFECT |
| `klma-ultraviolet-furlong-vanished-still-live` | DATA |
| `klma-vanz-2026-09-26-venue-move-both-live` | DATA |

## 15. Counts

| | |
|---|---|
| Raw DOM rows captured (section 1) | 410 |
| Normalised rows (section 1) | 409 |
| Distinct gigs captured (section 2) | 28 |
| Line-diff added / removed | 19 / 14 |
| **Genuine added rows** | **7** |
| **Genuine removed rows** | **2** — logged, nothing deleted |
| Added rows pipelined | **7 of 7 — none deferred** |
| **Events created** | **7** |
| Events bounced 409 | 2 |
| Events edited | 1 |
| Events deleted | **0** |
| Events hidden | **0** |
| **Artists created** | **2 — both with a verified page, both with a quoted bio** |
| Artists created as a stub | **0** |
| Artists created on an evidenced blank | **0** |
| Artists matched | 3 |
| **Venues created** | **0** |
| Venues matched | 7 |
| Rows staged | **0** |
| Names sanitised or rejected as non-acts under §0.6 | 0 |
| Validator | 1 clean, 0 FAIL, 0 WARN; **1 record excluded with the rationale in section 11** |
| Creates against the 50 cap | **9** |

`record_run` — see below.
