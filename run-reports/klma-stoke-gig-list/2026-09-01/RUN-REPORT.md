# KLMA STOKE GIG LIST — RUN REPORT 2026-09-01

**Run id:** `klma-stoke-gig-list-2026-09-01T19-23-21Z`
**Outcome:** COMPLETED. Snapshot written. Validator 0 FAIL.
**Runbook read:** `RUNBOOK.md` H1 **v2.27**. Floor in §6A is **v2.19**. Pass.
**Prompt floor:** the deployed prompt names no number. It defers to §6A step 2a. No drift to report.
**Mode (§0.29):** the spec declares no mode. The run defaulted to **append-only**. Nothing was
deleted and nothing was hidden. Already open as `klma-no-delta-mode-declared`; not re-raised.

**Headline: the curator pasted the whole Artisan Tap autumn programme into the sheet — 44 rows
in one wave. The run wrote 7 gigs and 5 artists from it and deferred the rest on budget.**

---

## 1. Gate log (§6A steps 0 to 3)

| Step | Result |
|---|---|
| 0 heartbeat | `data\state\heartbeat\klma-stoke-gig-list-2026-09-01T19-23-21Z.json` written first. |
| 1 date | `2026-09-01` from the container shell. |
| 2 runbook + spec | Both read in full. |
| 2a floor | v2.27 >= v2.19. Pass. |
| 2b claim | `data\state\claims\klma-stoke-gig-list.json` read `heldBy: null`. Acquired. TTL 2 hours. No takeover. |
| 3 tools | bndy MCP reachable. **Chrome reachable** — one connected browser (`7ad060c3`), Facebook logged in. |

**The last KLMA run was 2026-08-30T03:08Z.** No KLMA firing on 31 August. The diff therefore
covers two days, which is why the removal count is a whole Sunday of past rows.

## 2. Capture

| Section | Surface | Result |
|---|---|---|
| 1 KLMA sheet | container `curl` on gviz `tqx=out:html` | HTTP 200, 102,090 bytes, md5 `06370ef1f76b87a5cec76952f3506b27`, **396 normalised rows** |
| 2 Sugarmill | `web_fetch` | 31 distinct gigs (the THIS MONTH / NEXT MONTH / ALL tabs repeat rows) |

Raw: `data\raw\klma-stoke-gig-list\2026-09-01\gviz.html` ·
`data\raw\sugarmill\2026-09-01\gig-guide-rows.txt`

- Container `curl` on `thesugarmill.co.uk` returned **HTTP 000** again (403 from the proxy on
  CONNECT). `web_fetch` remains the section 2 surface. It preserves the anchors, so the per-gig
  slug and the ticket link survive (§0.22 satisfied — open item `sugarmill-webfetch-preserves-hrefs`).
- **Column layout re-verified before parsing.** The header row carries
  `Artist | Venue & Location | Time (eg 9pm) | Cost/Ticket | Genre | Link to Event`, so
  `Cost/Ticket` is still index 5 and the capture is the live sheet, not the eight-week-stale
  `web_fetch` copy the spec bans.
- ⚠ **The header row is not the last row.** It is row 395 of 397, and one submission
  (`17/09/2026 Arliston`) renders after it. The spec's "cheapest check is the trailing row" is
  unsafe. Already open as `klma-header-row-no-longer-last`; not re-raised.

## 3. Diff (§5.7 and §5.7(a))

Normalisation was applied to both sides before comparing, per the rules written into the
snapshot header.

### 5.7(a) gate

| Section | Re-diff of the new snapshot against its own capture | Verdict |
|---|---|---|
| 1 | **0 added / 0 removed** | PASSED |
| 2 | **0 added / 0 removed** | PASSED |

### Section 1 — 60 line-added / 31 line-removed

- **58 genuine added rows.** 44 Artisan Tap, 9 Norton Central Social Club, 3 Grumpys Longport,
  1 Baileys Bar Buxton, 1 Newcastle WMC.
- 2 of the 60 "added" and 2 of the 31 "removed" lines are the `04/01/2041` and `06/01/22041`
  junk rows churning on a trailing full stop. Not a source change.
- **29 removals are past-dated rows for Sunday 30 August** falling off the top of the sheet.
  §5.7: a row dropping because its date passed is not a cancellation.
- **No future-dated row was removed.** Nothing to action under §0.17, and the mode is
  append-only regardless.

### Section 2 — 3 added / 0 removed / 0 changed

All three added rows are the venue's own club-night programme and are **rejected** under spec
VA.9 and §6 accept/reject:

| Row | Why rejected |
|---|---|
| `2026-09-05 21:00 9 Years of CH3 £10` | house DJ night — the page text is "an unforgettable night of house" |
| `2026-10-10 23:00 PHANTOM: RAGE, TRAP + CLOUD CLUB NIGHT £7` | club night by name, 23:00 |
| `2026-10-30 21:00 HALLOWEEN ALLNIGHTER 2026 £10` | club night, no act billed |

Status markers unchanged (`arkayla` SOLD OUT, `the-year-grunge-broke` RESCHEDULED).
Two ticket-link date faults recur and are recorded in the raw capture's NOTE field, not imported:
`the-year-grunge-broke` (URL says 2025-12-06) and `isnt-it-alanis` (URL says 2026-07-03). The
title date wins (spec VA.9). A third is new this run: `phantom-…` lists 10 October and its
ticket URL says `2026-10-11`. It is a rejected club night, so nothing was written either way.

## 4. Tombstone check (§5.4, v2.19)

`data\state\cancellations.jsonl` — 13 lines, searched on artist, venue and date for every gig
written today. **No hit.** No `TOMBSTONED-` disposal was needed.

`20-Daily\2026-09-01.md` and `data\state\run-summary.jsonl` were read before any write. Only the
spider run has fired since 30 August. It wrote no Stoke events.

## 5. ⚠ THE ARTISAN TAP BULK PASTE — 44 ROWS IN ONE WAVE

The sheet gained the venue's entire September and October programme between 30 August and today.
**This is the largest single-venue addition this source has produced.**

**The park-lot question is settled in favour of importing.** The spec frontmatter still lists
`artisan-tap` under `specialist_venues` with a v1 instruction to park every row. That instruction
is dead on both of its stated blockers: multi-artist `create_event` is replaced by the §4
one-event-per-act split, and the artist-locality problem is answered by §0.7's national-act-venue
rule, which names Artisan Tap explicitly. §VA (Jason ruling 2026-08-01) treats the venue as an
import target and tells a run how to read its rows. Already open as
`artisan-tap-eleven-parklot-blockers-resolved`; not re-raised.

**A coverage probe came first, and it was worth it.** One `search_event(venueId, dateFrom,
dateTo)` returned 12 forward Artisan Tap events. **Nine of the 44 pasted rows were already in
bndy**, written by earlier runs and by `cowork-discovery`. The first create attempted bounced
409 against one of them, which is the sentinel doing its job.

| Already in bndy, no write needed | date |
|---|---|
| Gordie Tentrees and Kieran Poile | 2026-09-02 |
| Tomas Doncker | 2026-09-03 |
| Max and Veronica | 2026-09-04 |
| Lucca Mae + The Ava Ralph Trio | 2026-09-05 |
| Virgin Mary's + Two Step Goodbyes | 2026-09-11 |
| Glory Days | 2026-09-12 |
| Kasper Berry Rapkin & The Swamp Dogs | 2026-09-13 |
| Rodina 3pm Show | 2026-09-13 |
| Club Brat | 2026-09-26 |

## 6. Rows pipelined — seven creates

| # | Row | bndy event id |
|---|---|---|
| 1 | Electric Tentacle @ Artisan Tap, 2026-09-24, 20:00 | `a77d9d0a-22f9-4712-84e0-82dae409e073` |
| 2 | Electric Tentacle @ Artisan Tap, 2026-10-29, 20:00 | `9b236a39-0ab9-4c28-8e71-245116134899` |
| 3 | Newtown Neurotics + Attila the Stockbroker @ Artisan Tap, 2026-09-21, 20:00 | `cfdbc74f-75c1-46ee-b2ba-8ba9c73afdc5` |
| 4 | Attila the Stockbroker @ Artisan Tap, 2026-09-21, 20:00 | `f5a2381d-c373-4258-bb0b-d56d85245586` |
| 5 | Arliston + Dorothy Bird + Heidi @ Artisan Tap, 2026-09-17, 19:00 | `f3b08b4b-2e37-4f91-b3c3-057c1c3832eb` |
| 6 | Briana Corrigan @ Artisan Tap, 2026-10-20, 20:00 | `53387e8b-e857-41fa-be90-5ca154035551` |
| 7 | TV Smith + Zipstyle @ Artisan Tap, 2026-10-25, 19:00 | `ea5f7994-75b2-4cdd-9cd5-005f50fe9498` |

**Every write was read back with `get_by_id` (§0.10).** All seven returned `isPublic: true`, the
intended date, the intended title and the intended externalId.

### externalIds written (§6D slug form)

```
2026-09-24-electric-tentacle-artisan-tap
2026-10-29-electric-tentacle-artisan-tap
2026-09-21-newtown-neurotics-artisan-tap
2026-09-21-attila-the-stockbroker-artisan-tap
2026-09-17-arliston-artisan-tap
2026-10-20-briana-corrigan-artisan-tap
2026-10-25-tv-smith-artisan-tap
```

Each was written as a complete single-element array in one call (§6B — `edit_event` replaces and
dedupes to one id per source).

### Defaulted start times (§5.6)

Six of the seven rows carried no time; the server applied the §5.6 default and returned
`startTimeDefaulted: true`. Weekday rows took 20:00, the Sunday row 19:00. The Arliston row is
the exception: the sheet publishes `Doors at 19:00`, so §0.28 case 2 applies — `startTime 19:00`
and `Doors 19:00` in `ticketInformation`.

### `Cost/Ticket` mapping (§CT)

| Row | Cell | Written |
|---|---|---|
| Arliston, 2026-09-17 | `£6` | `ticketed: true`, `price "£6"` |
| the other six | blank | nothing (§CT rule 2 — blank is unknown, not free) |

No new `Cost/Ticket` vocabulary was seen at the rows worked.

## 7. Identity decisions

**Artists — five created, two reused, zero stubs.**

| Billing | Outcome | Evidence |
|---|---|---|
| `Electric Tentacle` | reused `b0ef69f8-f891-4850-82f8-83124db208f6` | 100% name match, band, Stoke-on-Trent |
| `Newtown Neurotics` | **created** `3a97d5fc-e662-4133-8b3e-24c8e067af48` | `facebook.com/newtownneurotics`, 5.1K followers, "Musician/band" |
| `Attila The Stockbroker` → **Attila the Stockbroker** | **created** `cc07d20e-8ada-41e8-be07-ec797999f848` | `facebook.com/attilathestockbroker`, 63K, page states "Lives in Southwick, West Sussex" |
| `Arliston` | **created** `ec8eb0bd-8f60-47a5-b62e-2ba8437515cf` | `facebook.com/officialarliston`, page states Brixton, London |
| `Brianna Corrigan` → **Briana Corrigan** | **created** `9b005e80-9c78-4e0e-abdf-202cce07e33f` | `facebook.com/brianacorrigan`, 13K, "Musician/band" |
| `Tv Smith` → **TV Smith** | **created** `129b06cf-8868-4cab-8680-11073faad203` | `facebook.com/TVSmith77`, 13.2K, "Musician/band" |
| `Gordie Tentrees`, `Kieran Poile`, `Tomas Doncker` | already held the gig | 409 / probe, no write |

**Three names were corrected by the act's own page (§0.20 / §2A.5).**

| Sheet | Act's own page | Basis |
|---|---|---|
| `Brianna Corrigan` | **Briana Corrigan** — one `n` | the page vanity url is `brianacorrigan` and the page name spells it Briana |
| `Tv Smith` | **TV Smith** | page name |
| `Attila The Stockbroker` | **Attila the Stockbroker** | page name, lower-case "the" |

⚠ `Brianna Corrigan` should be carried as a `nameVariant` on `9b005e80`. It was **not written**:
`create_artist` returns HTTP 500 with `nameVariants` and `edit_artist` returns 409 on the same
field. Both are already open (`create-artist-500-namevariants`, `edit-artist-409-namevariants`);
not re-raised.

**Locations.** Artisan Tap is a §0.7 national-act venue, so the gig-town fallback is forbidden.
Three acts whose own page states no location took `"UK wide"` with `locationType: "regional"`
(§6B Kilmarnock trap): Newtown Neurotics, TV Smith, Briana Corrigan. Two took a stated city:
Attila the Stockbroker → Southwick, Arliston → London.
⚠ `get_by_id` does not return `locationType`, so the read-back cannot confirm it. Already open as
`get-by-id-omits-locationtype`; not re-raised.

**Venues — three resolved, zero created.**

| Billing | Resolved to | Basis |
|---|---|---|
| `Artisan Tap Hartshill` / `Artisan Tap` | `CoS3G3Jr9djE4WSWQqkz` | spec VA.1; the record already carries `venue-artisan-tap-hartshill` and the nameVariant |
| `Norton Central Social Club` | `SJrDEbAzFaHuyoTpoTST` | 100%, ST6 8HZ, already carries `klma-venue-norton-central-social-club` |
| `Grumpys, Canal Street, Longport` | `HDfCfgFwyafaVHhzYA5z` "Grumpy's-GB Motorcycles" | surfaced only at **26% low confidence** on the loose probe `Grumpy` + Stoke-on-Trent. It already carries `venue-grumpys-longport`. §2.16 in action: the apostrophe defeats the exact search and the low-confidence hit is the record. |

⚠ The sheet gives Grumpys as **ST6 4LU**; the bndy record holds **ST6 4NW**, Canal St. Same street,
same klma externalId, so the place_id is the identity (§1) and no second venue was created. Not
written, not corrected — a run adds.

## 8. Rows refused, and why

| Rows | Disposal |
|---|---|
| `Lo Tide Open Mic` 2026-09-06, `Alternative Open Mic` 2026-09-23 | open-mic sessions — spec VA.5(c) reject list. No artist, no event. |
| `Psychedelic Fest` 2026-10-03 and 2026-10-04, `The Big Con Fest` 2026-09-19, `Big Con Fest 2` 2026-10-18 | §0.27 — a festival badge on a fixed venue is importable, **but the row names no act**. Nothing to resolve. Not created, not invented. |
| `Thursday, October 8, 2026` at Artisan Tap | the artist cell is empty. No act, no event. |
| `Tanky/Electrifying 80's` @ Baileys Bar, **Buxton, Derbyshire SK17 6AW**, 2026-09-05 | **out of region.** §6 accept/reject and §0.24: SK17 is Derbyshire; this source's remit is Stoke, Staffordshire and South Cheshire. The artist exists (`a603777d-…`) but the venue would be a new Derbyshire record under a Staffordshire source. Refused, not staged. |
| `Contraband-Stoke` @ Newcastle WMC 2026-09-05 | Newcastle WMC is on this source's own skip note (Jason, DJ-led). Not overturned by a run. Deferred with a flag rather than written. |

## 9. ⚠ A live contradiction at Artisan Tap, 2026-09-10

The sheet bills `Yoodoo Voodoo + Balaban & The Bald Illeagles`. bndy already holds
`3998b4cf-d870-434c-9680-90fa753cc3d6` on that date at that venue, titled
`Jung + Sutlej + Balaban & The Bald Illeagles`. **One act matches and two do not.**

§VA says the venue's own page settles it, and `artisantap.com/shows` still has **no proven
surface** (Wix, JS-rendered). Nothing was written, nothing was edited. Raised as
`artisan-tap-2026-09-10-bill-disagrees`.

## 10. §VA venue-authoritative checks

| Venue | Status | Finding |
|---|---|---|
| **The Sugarmill** | **CHECKED** — sole-source feed, 31 rows, 3 added, all rejected | §3 |
| **Artisan Tap** | **NOT CHECKED — no proven surface.** 44 rows imported or deferred **from the sheet alone** | names taken from the sheet, sanitised per §0.6, then corrected by each act's own Facebook page |
| Cosey Club | **NOT FETCHED** — no row written at this venue this run | — |
| Eleven | **NOT FETCHED** — no row written at this venue this run | — |
| The Rigger | **NOT FETCHED** — no row written at this venue this run | — |

**This is the first run to import Artisan Tap at volume with the venue page unchecked.** §VA.6
step 5 permits it and requires it be said plainly: *Artisan Tap: venue page unreachable, names
from sheet only.* The §2A.5 enrichment pass is what stands in for the venue page here, and it
corrected two of the five names.

## 11. Deferred rows — named, per the gigs-per-artist ordering rule

**51 of the 58 added rows were not pipelined.** The budget went to the seven with the best
evidence and the cheapest identity work. **The largest artist group in the added set was two
rows** (Electric Tentacle, Beer For Mike), so the ordering rule offered little leverage this run —
this wave is 44 distinct acts across 44 nights, not one act across nine.

Highest value left open, in the order the next run should take them:

1. **Norton Central Social Club — 9 rows, one venue already resolved.** It Takes Two duo (09-05),
   Recall duo (09-06), Second City duo (09-12), Jason Kerr (09-19), Charlotte Mae (09-26),
   Soul on Trent (10-10), The Soul Man (10-16), Marc Bolton / Guy Malidoni / Jay Harrison (10-23,
   three acts). ⚠ `The Soul Man` needs a §1A.2 footprint check — bndy holds a `The Soul Man`
   in **Bedford** (`659f20bb-…`) and a Stoke booking is not evidence it is the same act.
2. **Grumpys Longport — 3 rows, venue resolved, all priced.** La Bone (09-05, £5), Hurls +
   We are at the Station (09-19, £5), Troyen + Stonepit Drive (09-26, £9).
3. **Artisan Tap, remaining 30 rows.** Named acts with findable pages first: Jo Carley & The Old
   Dry Skulls (09-30), Alice Howe & Freebo (10-28), Billy Bibby + The Groves (10-14),
   Aziz Ibrahim + Joseph Davis (10-15), The Darts (10-31), Tom Brooksby & The Secret Service
   (10-30), Barn54 + Blue Yellows + Sammy Hind (10-10), Keep Flying + Mad Badgers (10-12),
   Dirt Road Band + Malpractice (10-09), Bluebyrd + Static Fireflies (10-07), Noise Of Angels +
   Holden (10-22), Loaf Of Beard + Jim Mcjazz & The Razzmatazz (10-21), Disastrous Robots (09-18),
   Yoodoo Voodoo (09-10, see §9), and the tribute acts Close To Tears (09-25), Atom Heart Floyd
   (09-27), Straighten Out (10-02), The Sensational Alex Harvey Experience (09-20).
4. **Support acts left unsplit this run** (§4 owes them their own events): Zipstyle (10-25),
   Dorothy Bird and Heidi (09-17). Both bills are in bndy under the headliner.
5. `Tigerfest - The Soul Revival + More...` (10-11) — the act is **The Soul Revival**, not in
   bndy; the festival name belongs in the event title (§0.27). A Tigerfest festival parent may
   already exist: event `70d539f4-…` on 2026-10-11 at this venue carries
   `festivalId 05bfebbc-c36e-4a2e-9cbf-9b2906fc1c0d`.

⚠ **All 51 are now inside the snapshot and the diff will never offer them again.** That is
`blocked-rows-not-re-presented-by-diff`, open since 2026-08-18, and this run is its largest
instance to date — 51 rows in one night. Not re-raised. The venue coverage probe in §5 is the
working detection method: one `search_event(venueId)` re-finds every one of them.

## 12. Validator (§6A step 8)

```
5 records · 4 clean · 0 FAIL · 1 WARN   [mode=gate]
```

Exit 0. **0 FAIL.**

The single WARN is `STUB_NO_BIO` on TV Smith: a verified page is attached and the bio is empty.
**That is correct and deliberate.** His page carries no intro text at all — only the name, the
category "Musician/band" and a link to `tvsmith.co.uk`. §2A.1 item 8 says the bio is quoted or it
is empty. It is empty.

Evidence file: `data\state\enrichment-evidence-2026-09-01-klma-stoke-gig-list.jsonl`, five lines,
one per created artist, each carrying the raw page scrape.
⚠ The evidence lines were written **after** each create, because `artistId` does not exist until
the create returns. Already open as `evidence-file-cannot-precede-a-create`; not re-raised.

## 13. Enrichment evidence (§2A.1 item 3b — both surfaces)

Every act was found on **Google first**, then the page itself was **opened and read** — never
linked from a snippet (`fb-page-must-be-visited-not-snippeted`).

| Act | Query | Page | What the page gave |
|---|---|---|---|
| Newtown Neurotics | `"newtown neurotics" band facebook` | `newtownneurotics` | bio, category, website. No location. |
| Attila the Stockbroker | `"attila the stockbroker" facebook` | `attilathestockbroker` | bio, "Lives in Southwick, West Sussex", BN42 |
| TV Smith | `"tv smith" adverts facebook` | `TVSmith77` | category and website only. No bio, no location. |
| Arliston | `arliston band facebook` | `officialarliston` | bio naming Brixton, London |
| Briana Corrigan | `"brianna corrigan" facebook` | `brianacorrigan` | bio, **and the correct spelling of the name** |

**The two-word rule paid again (§2A.1 3c).** `arliston band facebook` returned the right page
first. No query carried a guessed town.

## 14. Quality measures (§6, v2.5)

| Measure | Count |
|---|---|
| Events created | **7** |
| Events edited | 0 |
| Artists created | **5** |
| Artists created with a verified page | **5** |
| Artists created on an evidenced blank | 0 |
| **Stubs created** | **0** |
| Venues created | **0** |
| Rows refused with a stated rule | 8 |
| Rows deferred on budget | **51** |
| Names corrected from the act's own page | 3 |
| Gate bounces (409/422) | **1** (Gordie Tentrees 2026-09-02 — the record already existed) |
| Deletions | **0** |
| Records hidden | **0** |

**Caps:** 12 creates against a 50-create cap. Not near it — the limit was working time, not the cap.
**Wall clock:** roughly 40 minutes against a 2-hour TTL.

## 15. Open items raised to `CTO-INBOX.md`

| Fingerprint | Kind |
|---|---|
| `artisan-tap-2026-09-10-bill-disagrees` | DATA |
| `artisan-tap-events-no-externalids` | DATA |
| `create-event-isopenmic-not-read-back` | DEFECT |

**Not re-raised**, because each is already open: `klma-no-delta-mode-declared`,
`artisan-tap-eleven-parklot-blockers-resolved`, `blocked-rows-not-re-presented-by-diff`,
`klma-zero-diff-hid-nine-missing-gigs`, `klma-header-row-no-longer-last`,
`sugarmill-webfetch-preserves-hrefs`, `get-by-id-omits-locationtype`,
`create-artist-500-namevariants`, `edit-artist-409-namevariants`,
`evidence-file-cannot-precede-a-create`, `record-run-token-missing`,
`from-the-jam-vanished-still-live`.

## 16. `record_run`

Not attempted. `SOURCE_RUNS_TOKEN` is still unset (`record-run-token-missing`, open since
2026-08-08). Non-blocking. `data\state\run-summary.jsonl` is the dashboard's input and was
appended.
