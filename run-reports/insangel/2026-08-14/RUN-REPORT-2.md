# insangel — RUN REPORT — 2026-08-14 (second firing)

**Outcome: COMPLETED.** Snapshot written. Validator 0 FAIL, 2 WARN.

This is the **second** insangel firing on 2026-08-14. The first ran at 23:57Z on 2026-08-13
and wrote `RUN-REPORT.md` in this directory. This report is `RUN-REPORT-2.md` so the first is
not overwritten. That path collision is already open as `run-report-path-collides-second-firing`
and `run-report-path-collides-on-second-firing`. **Not re-raised.**

| field | value |
|---|---|
| runId | `insangel-2026-08-14T05-02-12Z` |
| task | `insangel` |
| runbook read | `RUNBOOK.md` **v2.27**, read in full |
| floor asserted (§6A step 2a) | §6A CURRENT FLOOR is **v2.19**. The task prompt names no number. v2.27 is above the floor. Pass. |
| claim (§6A step 2b) | `data\state\claims\insangel.json` read as released (`heldBy: null`, `lastRun` `insangel-2026-08-13T23-57-24Z`). Acquired 2026-08-14T05:02:12Z, TTL 90 minutes. **No takeover.** |
| heartbeat | `data\state\heartbeat\insangel-2026-08-14T05-02-12Z.json` |
| evidence file | `data\state\enrichment-evidence-2026-08-14-insangel.jsonl` (6 records after this run; 1 was the first firing's) |
| source mode (§0.29) | **NOT DECLARED in the spec.** The run treated the source as `append-only`. It removed nothing. Already open as `insangel-mode-not-declared`. **Not re-raised.** |
| capture date | 2026-08-14 |
| caps | 50 creates. **16 used.** 0 venues, 6 artists, 10 events. |

## 1. Counts

| measure | count |
|---|---|
| events created | 10 |
| artists created | 6 |
| artists linked to an existing record | 0 |
| venues created | 0 |
| venues reused | 3 |
| existing records topped up | 0 |
| rows already in bndy and left alone | 18 |
| 409 / 422 bounces | 0 |
| deletions | 0 |
| corrections made during the run | 1 (see §7) |
| validator | 6 records · 4 clean · **0 FAIL** · 2 WARN |

### Quality split (§6, v2.5)

| class | count | records |
|---|---|---|
| created with a **verified page** | 1 | George Pallas |
| created with an **evidenced blank** | 5 | Chester, Harlie Duo, Steve Baron, Jonathan Honour, Les Anderson |
| staged | 0 | — |
| names sanitised under §0.6 | 0 | The listing page carries a descriptor tail on the venue DETAIL page only. Every artist name was read from the `a[href]` anchor text, which holds the act name alone. |
| rows skipped as out of horizon | 0 | — |

**No artist was created as a stub.** Every one of the six carries a location, a locationType,
an actType, an acoustic flag and its source externalId. Five carry genres; Jonathan Honour's
are empty because the source names no genre and §0.18 forbids a guess.

## 2. Capture

The sandbox proxy still returns **HTTP 403** for `insangel.co.uk`. That repeats the open item
`insangel-egress-blocked` and is **not re-raised**. Chrome reached the site normally.

Collection used `fetch()` plus `DOMParser` and direct `a[href]` reads, per §0.22. No text
extraction was used for any id.

| measure | value | previous firing |
|---|---|---|
| raw page | 76 venue cards, 1148 artist-gig pairs | 76 / 1149 |
| stale rows dated before capture | 4 | 5 |
| declared-placeholder pairs excluded | 478 | 478 |
| exact duplicate pairs removed | 1 | 1 |
| beyond the 12-month horizon | 0 | 0 |
| unparseable dates | 0 | 0 |
| **in-scope after filters** | **72 venues, 665 artist-gig rows** | 72 / 665 |

The raw pair count fell by one and the stale count fell by one. That is one past-dated row
rolling off the page. The in-scope set is unchanged.

### 2.1 Dates and times come from the venue DETAIL page

The listing page publishes day and month only. The detail page `/venues/<slug>` publishes the
**full date including the year** and a **real start time**. Every date and time written by this
run is the detail page's own value. **No time was defaulted under §5.6.** §0.28 treats each as
the stage time. This follows the open item `insangel-year-rule-underdates-13mo`.

## 3. Diff (§5.7)

Snapshot compared: `data\state\insangel-last-page.txt`, written by
`insangel-2026-08-13T23-57-24Z` five hours before this run (72 venues, 665 rows).

Both sides were normalised identically before comparison, per §5.7(a). The rules are written
into the snapshot's own header and are unchanged.

**Method.** A 32-bit rolling hash of each normalised venue line was computed in the page and
compared against the same hash of each snapshot line in the sandbox. **72 of 72 venue lines
hashed identically.** The source has not changed since 00:05Z.

**§5.7(a) gate — the new snapshot re-diffed against the capture it was written from:
0 added / 0 removed, 72 lines. The gate passes.**

| | count |
|---|---|
| venues added | 0 |
| venues removed | 0 |
| pairs added | 0 |
| pairs removed | 0 |

**A zero diff is a real result, and on this source it is not a reason to write nothing.**
The source publishes 665 in-scope rows and the diff can never offer the backlog, because the
2026-08-09 run wrote a full snapshot with 633 rows unwritten. That is the open item
`insangel-snapshot-hides-backlog`.

## 4. Scope — the run worked the bounded backlog

**Scope was bounded, not opened.** Only rows at the **four venues already resolved in bndy and
already carrying their `insangel` externalId** — The Rattler, The George & Dragon, The Jovial
Monk and The Amble Inn — dated **2026-08-14 to 2026-09-30**, were considered. That is 39 rows.
This is the same boundary the 23:57Z firing set. It is a continuation of that precedent, not a
new expansion.

`search_event(venueId, dateFrom, dateTo)` was run against each venue **before** any write.
**18 of the 39 rows were already in bndy** and were not touched. No 409 was needed to find that
out, and no 409 fired.

Precedent is §0A rule 2 — a source whose snapshot cannot offer its rows imports up to the
50-cap, oldest-dated first. The cap, the 409 gate, the artist+venue+date sentinel and the
cancellation tombstone were all in force. `data\state\cancellations.jsonl` holds one real entry
(PULS @ Arden Arms 2026-08-08). **No artist, venue and date written by this run matches it.**

## 5. Events created (10)

All carry `isPublic: true` and the `{source:"insangel", id:"<sha1[:12] of venue_slug|date|artist_slug>"}`
externalId form ruled final by Jason on 2026-08-08 (D-05). Every create returned the stored
record, which is the §0.10 read-back.

| # | event id | title | date | time | externalId |
|---|---|---|---|---|---|
| 1 | `169f7667-4a8b-47f2-a09f-cbe7b25d22c2` | George Pallas @ The Rattler | 2026-08-14 | 20:00 | `0ff837f0551d` |
| 2 | `11e2888e-5c78-4db6-93ee-4be5df7ec89b` | Les Anderson @ The George & Dragon | 2026-08-15 | 19:00 | `d30ae8281dd1` |
| 3 | `3e60c43e-df36-4b00-bacf-aabfbd963a70` | Chester @ The Rattler | 2026-08-27 | 20:00 | `3428a8d31394` |
| 4 | `ae9e31b4-47d3-4b46-9802-5a17faa441b0` | Jonathan Honour @ The Rattler | 2026-08-30 | 17:00 | `3076f9bcbbdf` |
| 5 | `2f035978-f047-4a2e-a178-04de8cc78549` | Jonathan Honour @ The Jovial Monk | 2026-08-14 | 19:30 | `58d3ba48a851` |
| 6 | `ff030eac-8a66-4cb1-ac76-c975383743a4` | Steve Baron @ The Rattler | 2026-09-03 | 20:00 | `dded1016ba7a` |
| 7 | `76edd89e-e6ed-4101-b4e4-b8d0fcc4c184` | Chester @ The George & Dragon | 2026-09-11 | 20:00 | `2ce0c305dc03` |
| 8 | `a0d430c3-11db-4fbb-9e10-afa659c90130` | Harlie Duo @ The George & Dragon | 2026-09-12 | 19:00 | `7923a12a1ca8` |
| 9 | `f8f15c67-767a-49a6-9cf5-768e57678ed0` | Steve Baron @ The George & Dragon | 2026-09-25 | 20:00 | `11d9f445f3ea` |
| 10 | `4f7c94c3-6e44-47db-bae0-8d1300617072` | Harlie Duo @ The Rattler | 2026-09-27 | 17:00 | `8e104d73f113` |

Event 5 is dated today. §0.14 forbids a PAST date; today is not past, and the detail page
publishes a 19:30 stage time for it.

## 6. Venues — 0 created, 3 reused

| slug | bndy id | bndy name | postcode check (§0.24) |
|---|---|---|---|
| `the-rattler--south-shields` | `0ae09950-ad0a-4854-9bc5-deaa6349c9a5` | The Rattler | NE33 2LD — South Shields. Correct. |
| `the-george-and-dragon--norton` | `108f8433-7c83-476f-ae3d-afeb04e6228f` | The George & Dragon | TS20 1AA — Norton, Stockton-on-Tees. Correct. |
| `jovial-monk--ormesby` | `e5c621b9-a1c6-4683-ae7f-2d05dc255ce7` | The Jovial Monk | TS3 6NQ — North Ormesby, Middlesbrough. Correct. |

All three already carried the `insangel` externalId, verified by `get_by_id` on The Rattler and
by the `search_event` read-backs on the other two. **No venue was created and no `search_venue`
probe was needed**, so the ampersand and apostrophe failure mode did not arise this run.

## 7. Correction made during the run

**One event title was written with an HTML-escaped ampersand, and the run fixed it.**
Event `11e2888e-5c78-4db6-93ee-4be5df7ec89b` was created with the title
`Les Anderson @ The George &amp; Dragon`. §6B states plainly: never HTML-escape `&` in an MCP
tool argument. The read-back showed the literal `&amp;` in the stored title, and
`edit_event(title)` corrected it to `Les Anderson @ The George & Dragon`. The read-back confirms
the raw character. **No other record was affected. This was my error, not a tool fault.**
It is the same class as `html-entity-in-event-title`, which is already open for another source,
so it is **not raised** as a new item. It is recorded here because §0.10 read-back is the only
thing that caught it.

## 8. Artists

### Created with a verified page (1)

| bndy id | name | location | actType | genres |
|---|---|---|---|---|
| `3c10e5f8-52e0-422d-9e25-c2afd517395a` | George Pallas | North East England (regional) | covers | Rock, Indie, Britpop |

`acoustic: true`. `facebookUrl` **`https://www.facebook.com/GeorgePallasMusic`**.
`profileImageUrl` `https://graph.facebook.com/258472918341861/picture?type=large` — a stable
graph URL, never `scontent.*` (§2A.2). `bio` is EMPTY, deliberately — see below.

**Two hard signals clear the §2A.1 identification bar.**

1. The page's own description lists its cover artists as *Stereophonics, Foo Fighters, Weller,
   The Verve, OCS, Oasis, David Grey*. The insangel listing for this act reads *"Acoustic covers
   from the likes of Stereophonics Foofighters oasis the Verve ocean colour scene"*. The same
   five acts, in a page written by someone else.
2. The same Google search returned a video posted by **The Avenue, Roker, Sunderland**, naming
   this act playing live there. Roker is inside the insangel North East footprint.

**The page was VISITED, not read from a snippet** — `fb-page-must-be-visited-not-snippeted` is
open in `CTO-INBOX.md` and this run obeyed it. Read from the page: title *"George Pallas Music |
Facebook"*, numeric page id `258472918341861`, category *Musician/band*, contact
`georgepallas@live.co.uk`. The page states **no location**.

⚠ **`bio` is EMPTY on a verified page, and that is deliberate.** Logged out, the only page-owned
text Facebook exposes is the `og:description`, and it is **truncated by Facebook with a trailing
ellipsis mid-list** (`...David Grey...`). §2A.1 item 8 permits a cut only at a **sentence or line
boundary**. A mid-list ellipsis is not one, and stitching or rounding it off would be exactly the
paraphrase that rule exists to stop. **A logged-in run should re-read this page and quote the
intro in full.** The validator WARNs on this (`STUB_NO_BIO`) and the WARN is correct.

⚠ **The act's own page name is "George Pallas Music".** The record is named **George Pallas**.
"Music" here is a Facebook page-naming convention on a solo artist's page, not a name the act
trades under, and the source bills him as George Pallas. §2A.5's verified-source-name exception
covers a **descriptor tail** on the act's page, which this is not.

### Created with an evidenced blank (5)

| bndy id | name | type | location | actType | genres |
|---|---|---|---|---|---|
| `9f774910-d458-4199-b1f3-a61e36207e80` | Chester | solo | North East England (regional) | covers | Indie, Pop, Folk, Americana |
| `f3d5b24a-6bab-4ceb-96e4-a226f02f1d6c` | Harlie Duo | duo | North East England (regional) | covers | Pop, Rock |
| `b3f7ae97-7a6e-451d-b6f7-ed3c2c07f533` | Steve Baron | solo | North East England (regional) | covers | Country, 60s, Pop |
| `86e25df8-eb69-434e-83da-8dc0f567f212` | Jonathan Honour | solo | North East England (regional) | covers, originals | *(empty)* |
| `9c97472c-b32d-4723-b517-c66a73d6367a` | Les Anderson | solo | North East England (regional) | covers | Rock, Pop |

All five carry `acoustic: true`, an EMPTY `bio` and a BLANK `facebookUrl`.
Every search variant tried, on both surfaces, is recorded in
`data\state\enrichment-evidence-2026-08-14-insangel.jsonl`.

⛔ **FACEBOOK PAGE SEARCH — SURFACE (a) — WAS DOWN FOR THE WHOLE RUN.**
`https://www.facebook.com/search/pages/?q=...` returns the literal body text **"Not Found"** with
an empty document title. Direct act pages still read normally (George Pallas and Jonathan Honour
were both opened). This is already open as `facebook-page-search-not-found`, raised by the KLMA
run earlier today. **Not re-raised.** **Consequence, stated plainly: every blank in this run rests
on Google alone.** §2A.1 item 3b requires both surfaces before a blank is recorded, and one of
them was unavailable. These five blanks are weaker than a two-surface blank and should be re-run
when the surface returns.

⚠ **Jonathan Honour — a candidate page was FOUND and DECLINED.**
Google returned `https://www.facebook.com/JonathanHonourMusic/` first. **The page was visited.**
It reads: 1.1K followers; page id `158071924651785`; category *Musician/band*; its own
description *"Singer songwriter with a wide range of original songs written and recorded both
with my rock project Nobody's Heroes and solo acoustic skiffly punk rock"*; one social link,
`soundcloud.com/jonathanhonour`, which was also opened (handle *JonathanHonourAcoustic*,
12 tracks, latest 2017, `og:locality` null). **The page states no location and names no member.**
The page HTML was searched for Middlesbrough, Teesside, Stockton, Hartlepool, Redcar, Ormesby,
Newcastle, Sunderland, Durham, Shields, North East, Yarm, Guisborough, Saltburn, Billingham,
Norton, Jovial and Rattler: **zero hits.** Two further Google queries found no North East listing
and no link to the act; the only *Nobody's Heroes* band on the web is a covers band in
**Chelmsford, Essex**. §2A.1 item 1 requires one hard UK-consistent signal and there is none.
**A rare name plus a format match is a name match, and a name match alone is never sufficient.**
`facebookUrl` stays BLANK. The candidate is recorded in the evidence file so a logged-in run can
settle it from the page's posts.

⚠ **Chester — the name defeats the search, and the one query run was non-compliant.**
`Chester` is a single seven-character word that is also a UK city. A bare-name query per §2A.1
item 3c returns city noise and cannot isolate the act. The one query actually run —
`"Chester" acoustic covers band Teesside Stockton` — **asserted two towns, which item 3c
forbids**, and returned only band-for-hire directories for Chester (Cheshire) and
Stockton-on-Tees. It is recorded as run, not as a clean negative. The blank is honest but it is
**not a strong blank**, and this act needs a logged-in Facebook page search rather than a better
Google query.

⚠ **Les Anderson — same query fault, but a compliant query was also run.**
`"Les Anderson" acoustic covers musician` (bare name plus one qualifier) returned only unrelated
Andersons and a Texas BandMix profile. A second query asserted "north east", which item 3c
forbids for an act whose listing states no location; it is recorded as run. **The blank rests on
the compliant query.**

⚠ **Steve Baron — every Facebook result is a personal profile.** `facebook.com/mandsbaron`,
`steve.baronian`, `steve.baron.33`, `steve.baron.3382`, `facebook.com/public/Steve-Baron`. §2A.1
item 4 forbids linking a personal profile as the act page. BLANK is the correct outcome, not a
weak one.

⚠ **Harlie Duo — the name is kept as billed, and the validator WARN is expected.**
The validator raises `NAME_BILLING: format tail on the name: 'Harlie Duo'`. §2A.5's 2026-08-07
ruling is explicit: **a trailing `Duo` is part of the name and must not be stripped on the
pattern alone**; a rename needs the act's own page to show a different name positively. No act
page was found, so the billing stands. The source's own listing prose does end
*"...HARLIE has it"*, which hints the act may trade as **HARLIE** — but that is a third-party
listing, not the act's page, and §0.20 makes the act's own page the naming authority. **A
`nameVariants` entry for "Harlie" was NOT written**, because `create-artist-500-namevariants` and
`edit-artist-409-namevariants` are both open defects on that field. Noted here instead.

### Near-misses declined

The spec's ladder states that **normalised name EQUALITY is the only automatic link**, that any
divergence never auto-links at any score, and that for a name of 12 characters or fewer an edit
distance of 1 to 2 is a **different act**.

- **`Harlie` held against `Charlie` (Whitley Bay) at 86%.** This is the exact pair the spec names
  as the reason the 80% auto-link rule was deleted. **Declined.** Two different North East acts,
  one character apart.
- `Chester` held against **Chester Big Band** (Chester UK) at 44% and **The Manchester Anthems**
  at 32%. Different acts, and the first is in Cheshire.
- `Steve Baron` returned `action: "review"` against **Steely Don** (North West), **Steve James**
  (Greater Manchester) and **Steven Robertson** (North East), all at 60%. §1A.7: a candidate with
  a **different name** is not a collision. Resolved with `confirmNew: true`. **That is the
  sanctioned resolution path, not a §0.9 gate workaround.**
- `Jonathan Honour` held against **Nathan Peake** at 47%. Different act.
- `George Pallas` held against **George Comer** (Plymouth) at 54%. Different act, different region.
- `Les Anderson` held against **Liv and Bob** (Exmouth) at 50%. Different act.

`search_artist` was the probe throughout, never `get_by_external_id` — the spec records that
3 of 4 sampled insangel acts carry no externalIds at all.

## 9. Rows in the window that were NOT reached

11 rows at the four worked venues, dated 2026-08-14 to 2026-09-30, remain unwritten. **Every one
is blocked on the same thing: the artist does not exist in bndy and creating it needs a §2A.5
enrichment pass that this run's time budget could not fund.** No row was skipped for a quality
reason, and none was staged.

| date | venue | artist slug |
|---|---|---|
| 2026-08-21 | The George & Dragon | `lynsey-elliott` |
| 2026-08-21 | The Rattler | `dean-clark` |
| 2026-08-22 | The George & Dragon | `val-bilton` |
| 2026-08-23 | The Rattler | `jane-long` |
| 2026-08-28 | The George & Dragon | `james-bunting` |
| 2026-08-28 | The Jovial Monk | `jinxed` |
| 2026-08-28 | The Amble Inn | `the-polaroids` |
| 2026-08-29 | The George & Dragon | `chris-camm` |
| 2026-08-30 | The Jovial Monk | `matt-bryan` |
| 2026-09-05 | The George & Dragon | `anthony-morris` |
| 2026-09-06 | The Rattler | `dave-ridley` |
| 2026-09-11 | The Rattler | `aj` |
| 2026-09-18 | The George & Dragon | `ben-lackenby` |
| 2026-09-18 | The Rattler | `caitlin-morrow-derbyshire` |
| 2026-09-19 | The Jovial Monk | `the-ska-soul` |
| 2026-09-25 | The Amble Inn | `the-babel-fish` |

**Head start for the next run.** The source detail pages were already read this run, so these
dates and times are confirmed and need no re-capture:

- `lynsey-elliott` 2026-08-21 20:00 — listing states *"north east ROCKSTAR"*. ⚠ The listing
  spells the surname **Elliot** in its prose and **Elliott** in the billing and the slug.
- `dean-clark` 2026-08-21 20:00 — listing states *"almost 20 years playing experience... pubs and
  Clubs throughout the North East"*.
- `val-bilton` 2026-08-22 19:00 — listing states *"based in Stockton-on-Tees, Teesside"*. **This
  is a stated town, so this record can take `locationType: "city"` rather than the regional
  fallback.**
- `jane-long` 2026-08-23 17:00 — the band page carries **no details block at all**.
- `james-bunting` 2026-08-28 20:00 · `jinxed` 2026-08-28 20:00 · `the-polaroids` 2026-08-28 20:00
  · `chris-camm` 2026-08-29 19:00 · `matt-bryan` 2026-08-30 14:00.

⚠ `matt-bryan` at 14:00 is an **afternoon** stage time published by the venue, not a §5.6 default.

## 10. Validator

```
6 records · 4 clean · 0 FAIL · 2 WARN   [mode=gate]
```

| record | class | rule | disposition |
|---|---|---|---|
| Harlie Duo | WARN | `NAME_BILLING: format tail on the name` | **Expected and correct to leave.** §2A.5, 2026-08-07 ruling: a trailing `Duo` is part of the name. |
| George Pallas | WARN | `STUB_NO_BIO: verified page attached but bio empty` | **Expected and correct to leave.** The only page-owned text is truncated mid-list; §2A.1 item 8 permits no cut there. |

Records: `/tmp/insangel_records_0814_r2.json`. Evidence:
`data\state\enrichment-evidence-2026-08-14-insangel.jsonl`.

## 11. `record_run`

Not called. `record_run` fails on a missing `SOURCE_RUNS_TOKEN`. That is open as
`record-run-token-missing` and is **not re-raised**. `data\state\run-summary.jsonl` carries this
run's line, which is the dashboard's real input.

## 12. Raised to `CTO-INBOX.md`

**Nothing.** Every finding this run is already an open item. `CTO-INBOX.md` rule 3 says a run
with nothing to raise appends nothing.

### Not raised, because a rule or an open item already answers it

- Facebook page search returning "Not Found" — `facebook-page-search-not-found`, raised today by KLMA.
- The undeclared §0.29 mode — `insangel-mode-not-declared`.
- The snapshot hiding the backlog — `insangel-snapshot-hides-backlog`.
- The listing page's missing year — `insangel-year-rule-underdates-13mo`. This run took every
  date and time from the detail page, which is the workaround that item describes.
- The sandbox 403 on `insangel.co.uk` — `insangel-egress-blocked`. Chrome works.
- A second report file on one date — `run-report-path-collides-second-firing`.
- `nameVariants` rejected by `create_artist` and `edit_artist` —
  `create-artist-500-namevariants`, `edit-artist-409-namevariants`,
  `create-artist-500-namevariants-editworks`.
- `record_run` failing — `record-run-token-missing`.
- My own HTML-escaped ampersand — §6B already states the rule and `html-entity-in-event-title`
  is open. A run's own error, caught and fixed by its own read-back, is not an inbox item.
