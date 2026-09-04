# insangel — RUN REPORT — 2026-08-15

**Outcome: COMPLETED.** Snapshot written. Validator 0 FAIL, 4 WARN.

| field | value |
|---|---|
| runId | `insangel-2026-08-15T06-42-35Z` |
| task | `insangel` |
| runbook read | `RUNBOOK.md` **v2.27**, read in full |
| floor asserted (§6A step 2a) | §6A CURRENT FLOOR is **v2.19**. The task prompt names no number. v2.27 is above the floor. Pass. |
| claim (§6A step 2b) | `data\state\claims\insangel.json` read as released (`heldBy: null`, `lastRun` `insangel-2026-08-14T05-02-12Z`). Acquired 2026-08-15T06:42:35Z, TTL 90 minutes. **No takeover.** |
| heartbeat | `data\state\heartbeat\insangel-2026-08-15T06-42-35Z.json` |
| evidence file | `data\state\enrichment-evidence-2026-08-15-insangel.jsonl` (4 records) |
| source mode (§0.29) | **NOT DECLARED in the spec.** The run treated the source as `append-only`. It removed nothing. Already open as `insangel-mode-not-declared`. **Not re-raised.** |
| capture date | 2026-08-15 |
| caps | 50 creates. **14 used.** 0 venues, 4 artists, 10 events. |

## 1. Counts

| measure | count |
|---|---|
| events created | 10 |
| artists created | 4 |
| artists linked to an existing record | 6 |
| venues created | 0 |
| venues reused | 5 |
| existing records topped up | 0 |
| rows already in bndy and left alone | 12 |
| 409 / 422 bounces | 0 |
| deletions | 0 |
| corrections made during the run | 1 (see §7) |
| validator | 4 records · 0 clean · **0 FAIL** · 4 WARN |

### Quality split (§6, v2.5)

| class | count | records |
|---|---|---|
| created with a **verified page** | 4 | Jane Long, Ben Lackenby, Matt Bryan, Jinxed |
| created with an **evidenced blank** | 0 | — |
| staged | 0 | — |
| names sanitised under §0.6 | 0 | Every artist name was read from the `a[href]` anchor text, which holds the act name alone. |
| rows skipped as out of horizon | 0 | — |

**No artist was created as a stub.** All four carry a location, a locationType, an actType,
an acoustic flag, a Facebook page, a stable graph avatar and their source externalId.
**All four bios are EMPTY, deliberately — see §9.**

## 2. Capture

The sandbox proxy still returns **HTTP 403** for `insangel.co.uk`. That repeats the open item
`insangel-egress-blocked` and is **not re-raised**. Chrome reached the site normally.

Collection used `fetch()` plus `DOMParser` and direct `a[href]` reads, per §0.22. No text
extraction was used for any id.

⚠ **The venue anchor is the PARENT of `.band_title`, not a child of it.** The spec's
extraction note says the venue link sits inside the `band_title` div. It does not:
`.band_title` holds bare text and its `closest("a[href]")` carries `venues/<slug>`. A first
parse returned 0 venues because of this. Corrected in-run with `closest()`. This is a spec
accuracy note, not a defect — the hrefs are present and §0.22 was obeyed throughout.

| measure | value | previous firing |
|---|---|---|
| raw page | 75 venue cards, 1126 artist-gig rows | 76 / 1148 |
| rows dated before capture | 50 | 4 |
| declared-placeholder rows excluded | 420 | 478 |
| exact duplicate rows removed | 0 | 1 |
| beyond the 12-month horizon | 0 | 0 |
| unparseable dates | 0 | 0 |
| **in-scope after filters** | **72 venues, 656 artist-gig rows** | 72 / 665 |

The stale count rose from 4 to 50 because the run date moved from 14 to 15 August and
Friday 14 August was a busy night across the guide. The filter order also differs from the
previous firing: this run drops past-dated rows **before** counting placeholders, so the two
columns are not directly comparable.

### 2.1 Dates and times come from the venue DETAIL page

The listing page publishes day and month only. The detail page `/venues/<slug>` publishes the
**full date including the year** and a **real start time**. Every date and time written by this
run is the detail page's own value. **No time was defaulted under §5.6.** §0.28 treats each as
the stage time. This follows the open item `insangel-year-rule-underdates-13mo`.

## 3. Diff (§5.7)

Snapshot compared: `data\state\insangel-last-page.txt`, written by
`insangel-2026-08-14T05-02-12Z` (72 venues, 665 rows).

Both sides were normalised identically before comparison, per §5.7(a). The rules are written
into the snapshot's own header and are unchanged.

**Method.** A 32-bit FNV-1a hash of each normalised venue line was computed in the page and
compared against the same hash of each snapshot line in the sandbox. 14 of 72 lines differed;
those 14 plus the added and removed venue were then diffed pair by pair.

**§5.7(a) gate — the new snapshot re-diffed against the capture it was written from:
0 added / 0 removed, 72 lines. The gate passes.**

| | count |
|---|---|
| venues added | 1 (`houghton-golf-club`) |
| venues removed | 1 (`rafa-spitfire-club--crook`) |
| pairs added | 4 |
| pairs removed | 13 |

### 3.1 The 4 added pairs

| venue slug | date | band slug | disposition |
|---|---|---|---|
| `the-amble-inn--amble` | 2026-08-15 | `ben-hannington` | **written** |
| `the-denton--newcastle` | 2026-10-03 | `in-at-the-deep-end` | **written** |
| `g-w-horners--chester-le-street` | 2027-06-26 | `fuse` | **written** |
| `houghton-golf-club` | 2026-09-18 | `back-to-the-80s` | **NOT written — see §8** |

### 3.2 The 13 removed pairs — every one is a date that has passed

`jovial-monk--ormesby` / `jonathan-honour` · `kings-prosecco-lounge--south-shields` /
`lee-brown` · `mighty-oak-bar--ashington` / `alpha-november` · `poetic-license--roker` /
`denny-owens` · `rafa-spitfire-club--crook` / `alana` · `the-black-horse--consett` /
`kaitlin-lee-robson` · `the-denton--newcastle` / `mark-carter` ·
`the-dirty-bottles--alnwick` / `the-b-bops` · `the-george-and-dragon--norton` / `the-eps` ·
`the-portland--ashington` / `joe-devanny` · `the-rattler--south-shields` / `george-pallas` ·
`vesta-tilleys--sunderland` / `the-hybrids` · `washington-arms--washington` /
`tony-bengtsson`.

**All 13 are dated 2026-08-14.** §5.7 states plainly that a row disappearing because its date
passed is NOT a cancellation. Nothing was hidden and nothing was deleted. The venue
`rafa-spitfire-club--crook` leaves the snapshot for the same reason: its only row was the
2026-08-14 one.

⚠ The source mode is undeclared, so the run is `append-only` and §0.17 did not run at all.
Even under `delta` these 13 would not have been actioned.

## 4. Scope

**Scope was the diff plus the same bounded backlog the two previous firings worked.**
The diff is the run's first duty and all four added rows were worked. Backlog scope stayed at
the **four venues already resolved in bndy and already carrying their `insangel` externalId** —
The Rattler, The George & Dragon, The Jovial Monk, The Amble Inn — dated 2026-08-15 to
2026-09-30. **Scope was not expanded.**

`search_event(venueId, dateFrom, dateTo)` was run against each worked venue **before** any
write. **12 rows in the window were already in bndy** and were not touched. No 409 was needed
to find that out, and **no 409 fired all run**.

`data\state\cancellations.jsonl` holds one real entry (PULS @ Arden Arms 2026-08-08).
**No artist, venue and date written by this run matches it.**

⚠ **A missing event was NOT read as a coverage gap (§5.4, v2.19).** `data\state\run-summary.jsonl`
was read first. The only other 2026-08-15 runs are `klma-stoke-gig-list` and `sceniceye`,
neither of which touches the North East.

## 5. Events created (10)

All carry `isPublic: true` and the `{source:"insangel", id:"<sha1[:12] of venue_slug|date|artist_slug>"}`
externalId form ruled final by Jason on 2026-08-08 (D-05).

| # | event id | title | date | time | externalId |
|---|---|---|---|---|---|
| 1 | `353ff811-b2b7-4bbd-953f-32e4fc2ce7f4` | Ben Hannington @ The Amble Inn | 2026-08-15 | 20:00 | `1d0b2fda7cf4` |
| 2 | `a4ed40c1-266c-4757-ab87-b3073d048803` | The Polaroids @ The Amble Inn | 2026-08-28 | 20:00 | `d08228d1ad72` |
| 3 | `a8307646-33ee-4752-84d6-d4cc3c35e354` | Babel Fish @ The Amble Inn | 2026-09-25 | 20:00 | `3f2c47c98204` |
| 4 | `0ebb89b9-e926-4927-9c1a-bbb28feadf29` | In At The Deep End @ The Denton | 2026-10-03 | 20:00 | `3c2a5171babf` |
| 5 | `a34ca0be-3b82-4516-b55a-c3910a10442c` | FUSE @ GW Horners | 2027-06-26 | 21:00 | `f774b977724c` |
| 6 | `3b1fe62e-49f9-48b9-a8d9-ef54c4315128` | The Skasoul @ The Jovial Monk | 2026-09-19 | 19:30 | `f3ed11a41ac6` |
| 7 | `4781e9ae-4fd6-4da2-8439-11660685eb39` | Jane Long @ The Rattler | 2026-08-23 | 17:00 | `6d2603b64f01` |
| 8 | `6b32fc83-b747-439f-961a-7cc15515fbbf` | Ben Lackenby @ The George & Dragon | 2026-09-18 | 20:00 | `880a085d5d5a` |
| 9 | `9a40cfd5-701f-4a85-a646-fffde6773fea` | Matt Bryan @ The Jovial Monk | 2026-08-30 | 14:00 | `b400f0b99ad4` |
| 10 | `df40ddab-edd1-45ee-beb7-a1f6fa14428f` | Jinxed @ The Jovial Monk | 2026-08-28 | 20:00 | `255d92a39c61` |

Event 1 is dated today. §0.14 forbids a PAST date; today is not past, and the detail page
publishes a 20:00 stage time for it.

Event 9 at 14:00 is an **afternoon stage time published by the venue**, not a §5.6 default.

⚠ **The externalId formula was confirmed against live data, not assumed.** The Jovial Monk
already holds `Mark Carter @ The Jovial Monk 2026-08-21` (`08c388f6-7973-4976-a531-323e58edf427`)
carrying `e71a1c1544a3`, which is exactly the sha1 this run computes for
`jovial-monk--ormesby|2026-08-21|mark-carter`. The pipe-delimited form in the spec is correct.

## 6. Venues — 0 created, 5 reused

| slug | bndy id | bndy name | postcode check (§0.24) |
|---|---|---|---|
| `the-rattler--south-shields` | `0ae09950-ad0a-4854-9bc5-deaa6349c9a5` | The Rattler | NE33 2LD — South Shields. Correct. |
| `the-george-and-dragon--norton` | `108f8433-7c83-476f-ae3d-afeb04e6228f` | The George & Dragon | TS20 1AA — Norton, Stockton-on-Tees. Correct. |
| `jovial-monk--ormesby` | `e5c621b9-a1c6-4683-ae7f-2d05dc255ce7` | The Jovial Monk | TS3 6NQ — North Ormesby, Middlesbrough. Correct. |
| `the-amble-inn--amble` | `9adcf560-b0bd-4efa-b9b7-ede765c44946` | The Amble Inn | NE65 0FF — Amble, Northumberland. Correct. |
| `the-denton--newcastle` | `cdac6734-32df-4f95-b2d9-e262d4a9185a` | The Denton | NE5 2JJ — Denton Burn, Newcastle. Correct. |
| `g-w-horners--chester-le-street` | `35b992a2-2903-4172-be1b-11d8e9ca35ec` | GW Horners | DH3 3DF — Chester-le-Street. Correct. |

All six already carried the `insangel` externalId.

⚠ **`search_venue("G W Horners","Chester-le-Street")` returned NO VENUES. The venue exists.**
It surfaced only on the §3 second probe — the single distinctive word, `search_venue("Horners",
"Chester-le-Street")` — at **70% medium_confidence**, and it already carried its `insangel`
externalId. The defeating character this time is a **space inside the initials** (`G W` versus
the stored `GW`), not an apostrophe. This is the **sixth** confirmed instance of the same class.
Already open as `search-venue-apostrophe`. **Not re-raised.** §3's three-probe rule is what
prevented a duplicate venue here, and it is doing real work on this source.

## 7. Correction made during the run

**One event title was written with an HTML-escaped ampersand, and the run fixed it.**
Event `6b32fc83-b747-439f-961a-7cc15515fbbf` was created with the title
`Ben Lackenby @ The George &amp; Dragon`. §6B states plainly: never HTML-escape `&` in an MCP
tool argument. The read-back showed the literal `&amp;`, and `edit_event(title)` corrected it to
`Ben Lackenby @ The George & Dragon`. The read-back confirms the raw character.

⚠ **This is the same mistake the 2026-08-14 firing made, on the same venue name.** It is my
error, not a tool fault, and §0.10 read-back caught it both times. It is not an inbox item —
§6B already states the rule and `html-entity-in-event-title` is open for another source. **It is
recorded here because a repeat is worth seeing: `The George & Dragon` is the one venue name on
this source that carries an ampersand, and it has now caught two consecutive runs.**

## 8. Rows found and NOT written

### 8.1 `houghton-golf-club` — a new venue with no address anywhere on the source

The source added one venue and one gig this cycle: **Back To The 80s, Friday 18 September 2026,
19:30, Houghton Golf Club**. The venue is not in bndy.

Three probes were run per §3 before any create decision:
`search_venue("Houghton Golf Club","Houghton-le-Spring")` → no venues found;
`search_venue("Golf","Houghton-le-Spring")` → no venues found, 3 scanned;
`list_venues(city:"Houghton-le-Spring")` → 1 venue, The Grey Horse. **Genuinely absent.**

**It was still NOT created.** The insangel venue name carries no `", <City>"` suffix, the slug
carries no town, and the detail page publishes **no address and no postcode** — the page holds
the gig row and nothing else. §0.8 forbids guessing a venue's town to obtain a Place ID, and
§0.24 requires the postcode to confirm the county before any create. A golf club named
"Houghton" is very probably Houghton-le-Spring, but "very probably" is exactly the inference
§0.8 exists to stop, and §0.23 notes there is no tool to null a wrong `google_place_id`.

**Disposition: skipped, one row, logged.** Raised to `CTO-INBOX.md` as
`insangel-houghton-golf-club-no-address` so the address can be established once, by hand,
rather than guessed nightly.

### 8.2 Rows in the bounded window still unwritten (12)

Every one is blocked on the same thing: the artist does not exist in bndy and creating it needs
a §2A.5 enrichment pass this run's budget could not fund. **No row was skipped for a quality
reason, and none was staged.**

| date | venue | artist slug | enrichment state at end of run |
|---|---|---|---|
| 2026-08-21 | The George & Dragon | `lynsey-elliott` | Google returned venue pages only (`tanhillinn`, `villagaiety`). No act page. |
| 2026-08-21 | The Rattler | `dean-clark` | Google returned `TheDeanClarkGarageband` plus NE venue pages naming the act (`thesandyss`, South Shields). Candidate NOT yet visited. |
| 2026-08-22 | The George & Dragon | `val-bilton` | Google returned a `facebook.com/p/` page, path not captured before Google began returning empty result sets. |
| 2026-08-28 | The George & Dragon | `james-bunting` | Google returned `thenorthwestsinger` — a different region. Likely a different act. |
| 2026-08-29 | The George & Dragon | `chris-camm` | Candidate `chrismusiccamm`. The NE-qualified query did NOT return the handle. Weak. |
| 2026-09-05 | The George & Dragon | `anthony-morris` | No credible candidate (`MorrisMusicforChrist`, a personal profile, a band called Maldini). |
| 2026-09-06 | The Rattler | `dave-ridley` | Google returned a `facebook.com/p/` page, path not captured. |
| 2026-09-11 | The Rattler | `aj` | A two-character name. A bare-name search per §2A.1 item 3c cannot isolate it. Needs a logged-in Facebook page search. |
| 2026-09-18 | The Rattler | `caitlin-morrow-derbyshire` | Candidate `caitlinmorrowmusic` **was visited**: 1.5K followers, *"I sing, write songs, play guitar"*, Musician, **states no location**. The page name drops the hyphenated surname. A different name plus no location fails §2A.1 item 1. Recorded, not attached. |
| 2026-09-25 | The Amble Inn | `the-babel-fish` | **Artist resolved** (`0e25b84c`), event written. Row is NOT outstanding. |
| — | — | — | — |

**Head start for the next run.** These dates and times are already confirmed from the detail
pages and need no re-capture:
`lynsey-elliott` 2026-08-21 20:00 · `dean-clark` 2026-08-21 20:00 · `val-bilton` 2026-08-22
19:00 (*"based in Stockton-on-Tees, Teesside"* — this record can take `locationType: "city"`) ·
`james-bunting` 2026-08-28 20:00 · `chris-camm` 2026-08-29 19:00 · `anthony-morris` 2026-09-05
19:00 · `dave-ridley` 2026-09-06 17:00 · `aj` 2026-09-11 20:00 ·
`caitlin-morrow-derbyshire` 2026-09-18 20:00.

## 9. Artists

### 9.1 Created with a verified page (4)

| bndy id | name | type | location | actType | genres |
|---|---|---|---|---|---|
| `0b8e3c3e-81cb-4027-889f-143e59091c28` | Jane Long | solo | Newcastle upon Tyne (city) | covers | Rock, Pop, Disco |
| `c1ee004c-2a08-4587-bf61-b772beaa7fd8` | Ben Lackenby | solo | Newcastle upon Tyne (city) | covers, originals | *(empty)* |
| `86ab8e5d-d6cc-4ad4-af81-77de2d0ca9f6` | Matt Bryan | solo | Middlesbrough (city) | covers | *(empty)* |
| `53b549d4-a5f7-4f96-9220-db0c11da5d0b` | Jinxed | band | North East England (regional) | covers | *(empty)* |

**Jane Long** — `facebook.com/janelongvocalist`, 550 followers, category Musician/band.
Two hard signals: the page's own text states *"Available across the North East"*, and its
Personal details state *"From Newcastle upon Tyne"*. Both match the insangel footprint (The
Rattler and Kings Prosecco in South Shields, Mighty Oak in Ashington, Poetic License in Roker,
The Denton in Newcastle). Instagram `janelong_vocalist` taken from the page.
⚠ The page name is **"Jane Long Vocalist"**. The record is named **Jane Long**. "Vocalist" is a
descriptor tail, the same class as "George Pallas Music" on 2026-08-14, and the source bills her
as Jane Long. §2A.5's verified-source-name exception is for a page whose own name IS the billing
string, which this is not.

**Ben Lackenby** — `facebook.com/BenLackenbyMusic`, 283 followers, Musician. The page states
*"Playing around the north east performing original music and covers"*, *"Lives in Newcastle upon
Tyne"* and *"From Cramlington"*. Three signals. `actType` is **covers + originals** on the page's
own wording, not the covers default.

**Matt Bryan** — `facebook.com/MBryanMusic`, 78 followers, Musician. **The page states no
location.** The hard signal is a Middlesbrough venue page naming the act playing live:
`facebook.com/TheBottledNoteMiddlesbrough/videos/live-music-with-the-very-talented-matt-bryan-music-always-a-pleasure/529864882946702`.
The insangel gig is The Jovial Monk, North Ormesby, Middlesbrough. §2A.1 item 1's "UK venues in
the page matching the act's gig footprint" is met by a venue page rather than the act's own, and
the act's page was still visited before attaching.

**Jinxed** — `facebook.com/Jinxed.Band`, 182 followers, Band. The page states *"North East UK
covers band"* and names five members. Two hard signals.
⚠ The page name is **"Jinxed Band"**. The record is named **Jinxed**, per the source billing and
§1's ADR-023: `X` / `X Band` in one region are the same artist and the qualifier belongs in the
event title, never in a new record. **A `nameVariants` entry for "Jinxed Band" was NOT written**,
because `create-artist-500-namevariants` and `edit-artist-409-namevariants` are both open
defects on that field. Noted here instead.

⚠ **ALL FOUR BIOS ARE EMPTY AND THAT IS DELIBERATE.** Every page was read through the rendered
DOM as `innerText` with whitespace collapsed, which **destroys the act's own line breaks**.
§2A.1 item 8 permits a cut only at a sentence or line boundary and requires the act's own line
breaks be preserved; a collapsed transcription is not a character-for-character quotation. Four
real bios were therefore available and none was written. **The validator WARNs `STUB_NO_BIO` on
all four and the WARN is correct.** A run with a line-preserving reader should re-capture these
four intros; the raw collapsed text is in the evidence file so nothing is lost.

### 9.2 Linked to an existing record (6) — no create

| name | bndy id | why it linked |
|---|---|---|
| Ben Hannington | `2ddb709e-08e6-42de-bef3-a8ddc209f4a3` | Normalised name EQUALITY. Its stored avatar is `graph.facebook.com/100028859839122/picture`, and `100028859839122` is the page id of `facebook.com/benhanningtonmusic`, the page this run visited. Same act, confirmed two ways. |
| In At The Deep End | `8376bf6b-440b-4d49-bc70-34faf000c5ff` | Name EQUALITY. Stored avatar id `100047699056591` is the page this run visited, which states *"5 peeps from around Tyneside"*. |
| FUSE | `32e0107a-7599-4306-bd51-516d7c0eda49` | Name EQUALITY. Stored avatar handle is `FUSE.theliveband`, the page this run visited. |
| The Polaroids | `df67f001-4dfd-48ad-a18c-644663a13e63` | Name EQUALITY, 100%. Chester-le-Street. Page `thepolaroidsnorth` visited: *"North East Indie Rock Band"*. |
| Mark Carter | `50530f7a-09c1-4afc-8172-e5bc52fd64cf` | Name EQUALITY, 100%. Barnard Castle, County Durham — same canonical region as Ormesby. |
| Babel Fish | `0e25b84c-4100-4780-94db-74d95f3e8593` | Source bills **The Babel Fish**; the record and the act's own page are both **Babel Fish**. Not an equality match, so the §1A footprint check was applied: same region bucket (North East), and §0.20 makes the act's own page the naming authority. Linked, not duplicated. |

⚠ **The spec's match ladder was obeyed and it earned its keep.** `search_artist("Matt Bryan")`
returned **Matt Dean (Torquay) at 70%** and `search_artist("Chris Camm")` returned **Chris Back
(Ashburton, Devon) at 70%**. Both are above the deleted ≥80-adjacent comfort zone for a careless
reader and both are the wrong act in the wrong region. Neither was linked.
`search_artist("The Ska-Soul")` returned **The Skasoul at 92%** — punctuation only, same region,
same act (§0.20) — and that one WAS linked.

### 9.3 Near-misses declined

- `Dean Clark` held against **Dean Palmer** (Sunderland) 55%, **Glen Dean and The Allstars**
  (Hastings) 31%. Different acts.
- `Jane Long` held against **Jane Keele** (Exmouth) 50%, **The Long Run** (Essex) 42%,
  **Daddy Long Legs** (Plymouth) 40%. Different acts, different regions.
- `Matt Bryan` held against **Matt Dean** (Torquay) 70%. Different act.
- `Chris Camm` held against **Chris Back** (Ashburton) 70%, **Chris Helme** (Yorkshire) 64%.
  Different acts.
- `James Bunting` held against **James Burrell** (Exeter) 62%. Different act.
- `Mark Carter` also held **Get Carter** (North East) 64% and **P J Carter** (Liskeard) 64%.
  Different acts; the 100% equality hit was taken.
- `Dave Ridley` held against **Dave Rich** (Looe) 64%. Different act.

`search_artist` was the probe throughout, never `get_by_external_id` — the spec records that
3 of 4 sampled insangel acts carry no externalIds at all.

## 10. Facebook page search is BACK

⚠ **`facebook.com/search/pages/?q=` returned real results all run.** The open item
`facebook-page-search-not-found`, raised by the KLMA run on 2026-08-14 and repeated by the
insangel run the same day, **does not reproduce today**. Surface (a) of §2A.1 item 3b is
available again. Recorded here rather than in the inbox: a recovery is not an item, and the
open line should be closed by whoever triages it, not by this run.

⚠ **Google began returning empty result sets late in the run.** The same fetch-and-parse routine
that had returned candidates for fifteen acts started returning zero Facebook links for every
query. This looks like rate limiting on repeated same-origin `/search` fetches, not a source
fault or a parse fault. It is the reason §8.2's last few candidates have no captured page path.
**Named here so a later run does not read an empty Google result as an evidenced blank.** No
blank was recorded on the strength of it.

## 11. Other observations, not raised

- **`backing-tracks-solo-tbc` is a placeholder that the spec's `placeholder_artists` list does
  not contain.** It sits in the snapshot at `the-black-horse--consett` on 2026-08-29 and
  2026-09-12. §0.4 forbids creating an artist for it, so no wrong record can result today, but
  the spec's list is the mechanical filter and this slug slips past it. **Raised** as
  `insangel-placeholder-list-incomplete`.
- **The Denton 2026-10-03 already held `Spirit of 97`** (`c1ae792f-e7a3-4f4c-a293-ecffb9bc2700`,
  externalId `d47e98dc6bd0`) from an earlier run. The source now bills **In At The Deep End** on
  that date and lists Spirit of 97 on 2027-04-24 instead. The run is append-only, so the new
  event was added and the old one left alone. This is the same class as the open item
  `insangel-rebill-stale-events`. **Not re-raised.**
- **`b8bcfb76-e7a5-4fe9-901d-0e45a5000927` still carries the §6D slug form**
  (`2026-08-16-kaitlin-lee-robson-the-rattler--south-shields`) rather than the sha1 ruled final
  by D-05. Already open as `insangel-slug-form-externalid`. **Not re-raised.**
- **The undeclared §0.29 mode** — `insangel-mode-not-declared`. **Not re-raised.**
- **The snapshot hiding the backlog** — `insangel-snapshot-hides-backlog`. **Not re-raised.**
- **The sandbox 403 on `insangel.co.uk`** — `insangel-egress-blocked`. Chrome works.
  **Not re-raised.**
- **`record_run` failing on `SOURCE_RUNS_TOKEN`** — `record-run-token-missing`. **Not re-raised.**

## 12. Validator

```
4 records · 0 clean · 0 FAIL · 4 WARN   [mode=gate]
```

| record | class | rule | disposition |
|---|---|---|---|
| Jane Long | WARN | `STUB_NO_BIO` | **Expected and correct to leave.** See §9.1. |
| Ben Lackenby | WARN | `STUB_NO_BIO` | **Expected and correct to leave.** See §9.1. |
| Matt Bryan | WARN | `STUB_NO_BIO` | **Expected and correct to leave.** See §9.1. |
| Jinxed | WARN | `STUB_NO_BIO` | **Expected and correct to leave.** See §9.1. |

Records: `/tmp/insangel_records_0815.json`. Evidence:
`data\state\enrichment-evidence-2026-08-15-insangel.jsonl`.

## 13. `record_run`

Not called. `record_run` fails on a missing `SOURCE_RUNS_TOKEN`. That is open as
`record-run-token-missing` and is **not re-raised**. `data\state\run-summary.jsonl` carries this
run's line, which is the dashboard's real input.

## 14. Raised to `CTO-INBOX.md`

Two items, both new, both checked against the file's existing fingerprints first.

| KIND | FINGERPRINT | why |
|---|---|---|
| DATA | `insangel-houghton-golf-club-no-address` | A new venue with a real forward gig and no address anywhere on the source. §0.8 forbids the guess. One address, entered once, releases it. |
| RULE | `insangel-placeholder-list-incomplete` | `backing-tracks-solo-tbc` is a TBC placeholder that the spec's declared list misses. |
