---
type: run-report
source: insangel
date: 2026-07-31
runbook: RUNBOOK.md v2.1
status: HELD SEED RUN — zero bndy writes, snapshot not written
---

# insangel — run report 2026-07-31

**Outcome: HELD SEED RUN. Zero bndy writes.** Capture succeeded. No
`data/state/insangel-last-page.txt` exists, so §6A step 5 applies: report what a first-run
import would create, then stop. The snapshot was deliberately **not** written — recording
today's page as "seen" would make tomorrow's diff silently swallow all 662 in-horizon rows.

## Counts

| | |
|---|---|
| Created | **0** |
| Matched | 0 |
| Edited | 0 |
| Deleted | 0 |
| Bounced (409/422) | 0 — no write calls made |
| Staged / parked | 662 in-horizon rows + 17 beyond-horizon rows |
| Defaulted times | would be **662 of 662** (see §5) |

## 1. Run contract steps (§6A)

| Step | Result |
|---|---|
| 1. Today's date | **2026-07-31**. `mcp__workspace__bash` unavailable ("VM service not running") → device clock, per the §6A.1 fallback. |
| 2. Read `RUNBOOK.md` in full | ✅ v2.1 (2026-07-30) |
| 2. Read `sources/insangel.md` in full | ✅ |
| 3. Verify tools | bndy MCP ✅ (read calls succeeded). Chrome ✅ ("Browser 1", Windows, local). Shell ❌ down — see §2. |
| 4. Capture | ✅ `data/raw/insangel/2026-07-31/CAPTURE-NOTES.md` — 1181 rows, 77 venue cards, 2026-07-31 → 2027-12-18 |
| 5. Two-sided diff | ⛔ **no snapshot exists** → held seed run |
| 6. Pipeline rows | ⛔ not run |
| 7. Report + snapshot | Report written. **Snapshot NOT written** (§6A.5) |
| 8. Daily note | ✅ appended |
| 9. Open rulings | ✅ appended |

## 2. Capture-method deviation (declared)

The spec says curl/requests is sufficient and no Chrome is needed. The shell was down for the
whole run, and `web_fetch` — which runs on the same VM — returned an **empty body** for
`/venues`, `/bands` and `/`. Capture was taken through Chrome against the live DOM instead.

This is a safe substitution in this direction: §6A.3 forbids substituting a plain web fetch
for a *Chrome-rendered* source; using Chrome on a *server-rendered* source loses nothing. The
same class selectors the spec documents (`.venue_page_gig`, `.small_gig_date`,
`.small_band_list a[href^="bands/"]`) were used, and venue/band slugs came from the anchor
`href`s exactly as specified.

**Cost of the deviation:** no byte-exact HTML file could be written to disk. If the snapshot
is later promoted, it must be a fresh capture in a stable, reproducible format — not this
run's derived aggregate. Flagged in §9.

## 3. THE HEADLINE — the spec's year-inference rule (FIX 1) is wrong, and it would have mis-dated 250 rows

`sources/insangel.md` FIX 1 (written 2026-07-30 to replace the hardcoded 2026/2027 rule):

> Build the date using the CAPTURE year. If that date is **more than 31 days before the
> capture date**, add one year.

Applied literally to today's page it produces **250 rows whose printed weekday does not match
the computed date** — i.e. 250 wrong dates. Date is part of the event UID (§1), so each one
would have been a wrong record that the sentinel could not catch.

### 3.1 Why it fails

The rule assumes the site lists near-term gigs only. It does not. `The Denton, Newcastle`
alone carries **114 forward rows running to December 2027** — a rolling ~17 months. Once a
venue card runs past the 12-month mark it wraps into a *second* occurrence of the same
month/day, and a ±31-day test cannot see the difference:

```
The Denton row "Sat 3rd Jul"  (sits between "Sun 27th Jun" and "Sat 10th Jul", deep in the card)
  spec rule      → 2026-07-03   (28 days before capture — inside the 31-day window, so no +1yr)
                   2026-07-03 is a FRIDAY. The site says Sat. Wrong, and past-dated.
  correct answer → 2027-07-03   (a Saturday) ✓
```

The 31-day window is also arbitrary against a source with monthly residencies: The Coach And
Horses, The Seaton Lane Inn and Annitsford Welfare Club each list one gig a month, 12+ months
out, so every one of their rows sits at exactly the boundary the rule is guessing at.

### 3.2 The rule that does work — and it is fully mechanical

Two facts the page gives free: rows within a venue card are in **ascending date order**, and
each row prints its **weekday**.

> Per venue card, walk rows in listed order. Carry `prev`, initialised to the capture date.
> For each row take the first year ≥ `prev`'s year for which the built date is **≥ prev** AND
> its weekday equals the printed weekday. Set `prev` to it.

Result on today's page: **1181 of 1181 rows resolved, 0 ambiguous, 0 weekday mismatches,
0 parse failures.** No year is hardcoded and no ±N-day window is guessed.

### 3.3 Independently corroborated against bndy

The May 2026 import wrote its dates before this ambiguity existed. Nine of them fall in the
wrap region and every one matches the corrected inference, not the spec's:

| Site row | bndy record | Corrected rule | Spec rule |
|---|---|---|---|
| Sat 6th Feb — Delorian Knights @ The Denton | `14d4af88` **2027-02-06** | 2027-02-06 ✓ | 2027-02-06 ✓ |
| Sat 27th Feb — Mac 3 @ The Denton | `8720eb44` **2027-02-27** | 2027-02-27 ✓ | 2027-02-27 ✓ |
| Sat 13th Mar — Midnight Rose @ The Denton | `09b14168` **2027-03-13** | 2027-03-13 ✓ | 2027-03-13 ✓ |
| Sun 25th Apr — The Hustlers @ The Denton | `af095684` **2027-04-25** | 2027-04-25 ✓ | 2027-04-25 ✓ |
| Sat 3rd Jul — (Cover Band TBC) @ The Denton | — | 2027-07-03 ✓ Sat | **2026-07-03 ✗ Fri, past-dated** |

The disagreement is confined to rows whose month/day lands within 31 days of the capture
date — which is exactly where a mis-date is undetectable by eye.

**Also note:** the "beyond horizon = parse error, stage it" line in FIX 2 is a consequence of
the broken FIX 1. With the corrected rule the 17 beyond-horizon rows are not errors at all —
they are genuine monthly-residency bookings into late 2027, and their weekdays verify. They
should be parked as out-of-horizon, not flagged as parse failures.

## 4. What a first-run import WOULD create (§6A.5 requirement)

Full capture **1181 rows**, 2026-07-31 → 2027-12-18.

| | Rows |
|---|---|
| All acts are placeholders → skipped entirely (§0.4) | 502 |
| ≥1 real act | 679 |
| … in horizon (≤ 2027-07-31) | **662** |
| … beyond horizon → parked | 17 |

**662 discrete events across 170 artists and 76 venues.** Against the §6 cap of 50
creates/run that is **≥14 capped runs** — which by itself says this cannot be walked as a
diff. And it is not a green field: the 2026-05-14 run already imported 66 venues, 171
artists and 669 events under this namespace.

### 4.1 Placeholder handling

502 rows drop out under §0.4. Six placeholder slugs appear:

`covers-solo-duo-tbc` · `cover-band-tbc` · `acoustic-covers-tbc` · `tribute-tbc` ·
`showcase-tbc` · **`backing-tracks-solo-tbc`**

The last is **not in the spec's `placeholder_artists` list** (9 rows, all at Washington Arms:
2026-08-30, 10-11, 10-18, 10-25, 11-15, 11-22, 11-29, 12-20, 12-27). It was caught here
because it self-evidently matches §0.4, but a mechanical run keyed to the spec list would
have created an artist called "Backing Tracks Solo TBC". Spec fix needed — §9.

### 4.2 Multi-artist rows (§4) — 3 rows, all at The Raven, Cleadon

```
2026-09-30  malcolm-mcelwee + showcase-tbc + showcase-tbc + showcase-tbc
2026-10-28  showcase-tbc x4
2026-11-25  showcase-tbc x4
```

After §0.4 the first is a single-act event (Malcolm McElwee) and the other two vanish
entirely. No §4 splitting work and no parent-event gap on this source.

### 4.3 Same artist, same date, two venues — 5 rows to verify before writing

The event UID is (venue, artist, date), so these are legal — but physically suspicious and
worth a look, not an assumption:

```
2026-08-01  Kaitlin Lee Robson  South Beach Blyth      + Last Orders Redhouse
2026-08-15  James Bunting       Namaste Sunniside      + The Coach And Horses Wideopen
2026-08-30  Kaitlin Lee Robson  The Teal Farm Washington + The Keelman Newburn
2027-03-17  Justin              Chaplins Sunderland    + Life Of Riley Sunderland
2027-03-17  Ste Wilson          Chaplins Sunderland    + Chester's Chester Le Street
```

Wed 17 Mar 2027 looks like a curator data-entry artefact: five rows across four venues all
land on that one date (Chaplins ×3, Ttonic, Life Of Riley, Chester's) with nothing else
near them. Treat as suspect and stage.

## 5. Times — all 662 would be defaulted

No start times on the listing page. §5.6 defaults would apply to **every** row:

| Weekday | Rows | Default |
|---|---|---|
| Sat | 352 | 21:00 |
| Fri | 227 | 21:00 |
| Sun | 65 | 19:00 |
| Thu | 9 | 20:00 |
| Wed | 7 | 20:00 |
| Mon | 2 | 20:00 |

The spec notes `/venues/<slug>` detail pages "sometimes carry real times". At 76 venue pages
that is a cheap, one-off scrape and would remove a 662-row blanket default from public data.
Recommended before the seed import runs — see §9.

## 6. bndy state — what is actually there, verified read-only

### 6.1 Venues: present and correctly identified

```
get_by_external_id(venue, insangel, the-denton--newcastle)
  → cdac6734-32df-4f95-b2d9-e262d4a9185a  "The Denton", Newcastle
    place_id ChIJGZze9aV3fkgRPNAZ9BXaaIk, externalIds [{insangel, the-denton--newcastle}]
get_by_external_id(venue, insangel, private-function--houghton) → found: false   ← skip rule held
get_by_external_id(venue, insangel, the-park--newcastle)        → found: false   ← new since May
get_by_external_id(venue, insangel, steels-sunderland)          → found: false   ← new since May
```

### 6.2 Events: externalIds ARE present — but in the SUPERSEDED hash form

`search_event` reports `externalIds: []` for every insangel event. **That is the tool lying** —
the same defect the KLMA run logged today. `get_by_id` tells the truth:

```
get_by_id(event, d23bc2a7-4b5b-4a00-8347-fb0ecc85b652)
  → "Group Therapy @ The Denton", 2026-08-08, 21:00, isPublic true, created 2026-05-14
    externalIds: [{ source: "insangel", id: "2870119342f1" }]
```

So insangel is **better off than onthecasemusic and gigs-news** — provenance exists. But the
id is the v1 sha1 hash, and §6D now mandates the slug
`2026-08-08-group-therapy-the-denton--newcastle`. A pipelined run would look up the slug,
miss, and attempt a create — relying entirely on the artist+venue+date sentinel to bounce it.

### 6.3 The hash formula is recoverable — the spec documents it wrongly

The spec says `SHA1[:12](venue_slug + date_iso + artist_slug)` and criticises it because
"the concatenation has no separator (collision-prone)". Reproduced live this run:

```
sha1("the-denton--newcastle"  +  "2026-08-08"  +  "group-therapy")[:12] = 2bdccb8a9344   ✗
sha1("the-denton--newcastle" + "|" + "2026-08-08" + "|" + "group-therapy")[:12]
                                                            = 2870119342f1   ✓ MATCHES
```

**The live ids are pipe-delimited.** The collision criticism is therefore unfounded, and —
more usefully — **the hash→slug back-fill is fully mechanical**: recompute the pipe hash for
every (venue, date, artist) triple in the capture, match it against the stored id, write the
§6D slug. No guessing, no manual reconciliation. This is the single highest-value fix for
this source and it can be done by a VSCode agent today.

### 6.4 Artists: roughly a third are present, and the missing third are the solo acts

23 artists sampled by `get_by_external_id`:

| Present (8) | Absent (15) |
|---|---|
| Group Therapy `f1c421fb` · The EPs `b2eaae27` · Tidal Waves `f12900ce` · Black Cadillac `7d5c6017` · The ZX80s `d56c4e5c` · Eves Apple `ee1a0e4f` · The Hustlers `f0054a85` · Mojave `ddc1b3e0` | Joe Devanny · Kaitlin Lee Robson · Toastbloke · Dave Ridley · Shaun Chipp · James Bunting · Jane Long · Simply Lisa · Harlie Duo · Harlie · Mojave Duo · FarCry · Parrk · Mountain Man · Indie Scene Proposal · Abba ca Deborah |

Every one of the 8 present is `artistType: band`. Every solo/duo act sampled is absent —
including **Joe Devanny (23 gigs)**, **Kaitlin Lee Robson (22)**, **Dave Ridley (16)**,
**Shaun Chipp (15)**, **Toastbloke (15)**. `search_artist` confirms independently: "Toastbloke"
returns nothing across 1303 artists; "Joe Devanny" and "Kaitlin Lee Robson" return only
sub-30% noise from Staffordshire and Manchester.

So the May run's "140 created + 31 linked" landed the bands and not the solo bill. Roughly
**~110 of the 170 artists would need creating** — each requiring the §2A.5 mandatory
enrich-inline Chrome FB pass. That is the real cost of this seed import, and it is why it
must not be attempted as an unattended 50-per-day drip.

### 6.5 Cross-source overlap (FIX 3) — working exactly as specified

```
Black Cadillac 7d5c6017 · location "North East"
  externalIds: [{onthecasemusic, 28916}, {insangel, black-cadillac}]
The ZX80s d56c4e5c
  externalIds: [{poster-import-2026-05-03, artist-the-zx80s}, {insangel, zx80s}]
```

Both carry ids from two sources on one record. Per FIX 3 this is **correct and must never be
"cleaned up"**. Good evidence the overlap rule is understood by whatever wrote these.

### 6.6 Non-canonical artist locations — the onthecase defect is live here too

| Artist | Stored location | §1A.1 verdict |
|---|---|---|
| Black Cadillac `7d5c6017` | `North East` | ✅ canonical |
| The Hustlers `f0054a85` | `North East England` | ❌ not in the 13-region enum |
| Mojave `ddc1b3e0` | `North East England` | ❌ |
| The ZX80s `d56c4e5c` | `North East UK` | ❌ (a third variant) |

Ruling #31 in OPEN-RULINGS covers "North East England" on the onthecase cohort. It is
cross-source, it has a third spelling, and — worse — **`sources/insangel.md` actively
instructs runs to write it**: *"fallback `\"North East England\"` with
`locationType:\"regional\"`"*. That spec line manufactures the defect on every future run.
Correct value is `North East`.

### 6.7 Source-dropped candidates spotted (no action — §5.7(b) cannot run)

Comparing bndy's 24 forward Denton events against today's capture, two disagree:

```
bndy 659ad770  "Justuzfor @ The Denton"  2026-08-29   site now lists: Danielle Lincoln
bndy e1a4c781  "Six Nowt @ The Denton"   2027-03-27   site now lists: Percy And The Piglets
```

Neither is actionable. §5.7(b) requires the bndy event to be found **by this source's
externalId**; the stored ids are hashes, the run would compute slugs, so the lookup fails by
construction. And with no snapshot there is no confirmed-absence baseline (§5.7(a)). Logged
only, per §0.17. No `delete_event` call was made.

## 7. Rows needing attention when this is unblocked

Recorded now so the unblocked run does not rediscover them.

- **ADR-023 qualifier pairs — reuse, never create a second record:**
  `Harlie Duo` (11 gigs, Newcastle) and `Harlie` (2 gigs, Washington) are **one artist**;
  `Mojave Duo` (3, Sunniside) and `Mojave` (2, Chester Le Street) are **one artist** — and
  `Mojave` **already exists** as `ddc1b3e0`, so `mojave-duo` must resolve to it with the
  qualifier living in the event title. The source gives them separate band slugs, so a
  slug-keyed run will create duplicates unless this is hard-coded as an alias.
- **§6C pub-as-artist / odd-name check before any create** — run the §2A.3 Chrome FB pass and
  a §1A.2 footprint check on: `Indie Scene Proposal` (reads like a booking note, not an act;
  4 gigs — and it appears on the onthecase list too, flagged there the same way) ·
  `Justuzfor` · `Six Nowt` · `Godzz Of Wor` · `Parrk` · `Chester` (also a place) ·
  `Justin` · `AJ` · `Eli` · `Kenzo` · `Tahnee` · `GPS` · `199X` · `Hazjak` · `Audios` ·
  `Fuse` · `Niche` · `So What` · `FM` · `Overdrive` · `Big Lamp` (a Newcastle brewery/pub
  name) · `Firebrick Brewery` and `Tow Law Football Club` appear as **venues**, not acts.
- **Non-UK collision risk (§2A.1.1) — blank beats wrong:** `Diamond Dogs` · `Solitary Man` ·
  `The Phonics` · `Common People` · `Mountain Man` · `The Substitutes` · `Small Wonder` ·
  `Pretty In Pink` · `Jinxed` · `Reviver`.
- **Tribute acts — §0.5 applies, do not invent a name:** `Absolutely Abba` ·
  `Abba ca Deborah` · `Amy Winehoose` · `Jagged Little Pill Live` ·
  `The Sensational David Bowie Tribute Band` · `Bryan Adams Experience` ·
  `The N.E. Street Band` · `Gagas Born` · `Just Like Combs` · `Oasism` · `Back To The 80s` ·
  `The Brit Pack`. These are the acts' own billing names, so §2A.5 likely applies verbatim —
  confirm against each act's own FB page, do not strip.
- **`The Tan Hill Inn, Richmond` looks like a national-act venue** (Jagged Little Pill Live,
  Bryan Adams Experience, The Sensational David Bowie Tribute Band, Neuromantica, and a
  "Book Now" ticket marker on Just Like Combs). Per §0.7's 2026-07-30 exception the gig town
  must **not** donate a location to these acts. Needs adding to this spec's national-act
  venue list alongside KLMA's Rigger/Eleven/Artisan Tap.
- **`Simply Lisa`, `The Hustlers`, `GPS`** most-play at `Langley Park Hotel` — a venue whose
  name carries **no city suffix**, so the §0.7 gig-town fallback has nothing to donate.
  Langley Park is in County Durham; do not guess, resolve the venue first (§0.8).
- **Geography check:** four venues are North Yorkshire (`The Tan Hill Inn` Richmond,
  `The Green Dragon` Hardraw, `The Queens Head` Stokesley, `The Bay Horse` Catterick) and one
  is **West Yorkshire** (`The Singing Chocker`, Castleford). Their acts are not North East
  acts. `Parkwood, Stockton`, `Jovial Monk, Ormesby` and `The Endeavour, Middlesbrough` are
  Teesside. §1A.1 region assignment must follow the venue, not the source's NE label.
- **`Newcastle` is ambiguous project-wide (§6C).** Every "Newcastle" here is Newcastle **upon
  Tyne**. Four already-created artists store the bare string `Newcastle` (Group Therapy
  `f1c421fb`, Tidal Waves `f12900ce`, Eves Apple `ee1a0e4f`, The EPs `b2eaae27`) — those
  records cannot be told apart from Newcastle-under-Lyme acts.
- **`Steels. Sunderland`** — the venue name contains a full stop where a comma belongs, so the
  spec's `", <City>"` strip will not fire. Search as "Steels" + city Sunderland.

## 8. Data-quality flags raised (no writes made)

1. **Spec FIX 1's year rule mis-dates 250 of 1181 rows** — §3. Blocking; the corrected rule
   is specified and verified.
2. **`backing-tracks-solo-tbc` missing from the spec's placeholder list** — §4.1. A run would
   create a placeholder artist.
3. **Event externalIds are v1 sha1 hashes, not §6D slugs** — §6.2. Makes §5.7 cancellation
   detection impossible. Back-fill is mechanical (§6.3).
4. **The spec's own hash formula is documented wrong** (missing pipe delimiters) — §6.3.
5. **The spec instructs runs to write `"North East England"`**, which is not a §1A.1 canonical
   region — §6.6. Third variant `"North East UK"` also live.
6. **~110 of 170 artists absent**, all solo/duo — §6.4. The seed import is an enrichment job,
   not a data-entry job.
7. **`search_event` under-reports `externalIds`** — §6.2. Independently confirmed today by the
   KLMA run. Any run trusting it will wrongly conclude a source has no provenance.
8. **662 of 662 times would be defaulted** — §5. A 76-page detail scrape would fix it.

## 9. To unblock

1. **Ratify the corrected date rule (§3.2) into `sources/insangel.md`**, replacing FIX 1, and
   drop FIX 2's "beyond horizon = parse error" clause. Nothing else can proceed safely first.
2. **Add `backing-tracks-solo-tbc`** to `placeholder_artists`.
3. **Back-fill §6D slugs onto the ~669 existing insangel events** from the pipe-hash mapping
   in §6.3 (VSCode-agent job). Until then §5.7 cannot run for this source.
4. **Fix the spec's location fallback** to `North East` + `locationType: "regional"`, and
   sweep `North East England` / `North East UK` across the insangel cohort (same sweep as
   OPEN-RULINGS #31 for onthecase).
5. **Rule on how to seed 662 rows.** A 50/run drip needs 14 runs and would re-diff a moving
   page each time. Options: a supervised bulk session; or raise the cap for one authorised
   seed run; or promote a snapshot and accept the rows are never re-offered. **Do not
   promote this run's derived capture** — it is an aggregate, not a reproducible page dump
   (§2). A fresh capture in a fixed format is needed for the baseline.
6. **Optional but cheap:** scrape the 76 `/venues/<slug>` detail pages for real start times
   before the seed import, so 662 defaulted times never reach public data.
7. **Add `The Tan Hill Inn` to this spec's national-act venue list** (§0.7 exception).

## 10. Rules cited

§0.1 (no scheduled task created, modified or re-enabled) · §0.2 · §0.4 · §0.5 · §0.6 · §0.7 ·
§0.8 · §0.9 · §0.11 · §0.17 · §0.18 · §1 · §1A.1 · §1A.2 · §1A.5 · §2A.1 · §2A.3 · §2A.5 ·
§3 · §4 · §5.5 · §5.6 · §5.7 · §6 (50-create cap) · §6A.1 · §6A.3 · **§6A.5 (the hold)** ·
§6B · §6C · §6D · §6E · ADR-023.

No bndy record was created, edited or deleted. No snapshot was written.
