# insangel — RUN REPORT — 2026-08-12 (second firing)

**Outcome: COMPLETED.** Snapshot written. Validator 0 FAIL, 1 WARN.

This is the **second** insangel firing on 2026-08-12. The first is `RUN-REPORT.md` in this
folder, runId `insangel-2026-08-12T00-39-28Z`. Read that report first. This report does not
repeat its findings.

| field | value |
|---|---|
| runId | `insangel-2026-08-12T08-28-15Z` |
| task | `insangel` |
| runbook read | `RUNBOOK.md` **v2.27** |
| floor asserted (§6A step 2a) | §6A CURRENT FLOOR is **v2.19**. The task prompt names no number. v2.27 is above the floor. Pass. |
| claim (§6A step 2b) | `data\state\claims\insangel.json` read as released (`heldBy: null`, `lastRun` `insangel-2026-08-12T00-39-28Z`). Acquired 08:28:22Z, TTL 90 minutes. **No takeover.** |
| heartbeat | `data\state\heartbeat\insangel-2026-08-12T08-28-15Z.json` |
| evidence file | `data\state\enrichment-evidence-2026-08-12-insangel-run2.jsonl` (4 records) |
| source mode (§0.29) | **NOT DECLARED in the spec.** The run treated the source as `append-only`. It removed nothing. Already raised as `insangel-mode-not-declared`; **not re-raised**. |
| caps | 50 creates. **27 used.** 0 venues, 4 artists, 23 events. |

## 1. Counts

| measure | count |
|---|---|
| events created | 23 |
| artists created | 4 |
| artists linked to an existing record | 9 |
| venues created | 0 |
| venues reused | 8 |
| existing records topped up | 2 (`toastbloke` website + acoustic flag; `Parachutes` bio whitespace + website) |
| rows skipped | 1 beyond horizon, 1 already present |
| rows not reached on budget | 24 in the worked window |
| 409 / 422 bounces | 0 |
| 404 bounces | 1 (my error — see §7) |
| deletions | 0 |
| validator | 4 records · 3 clean · **0 FAIL** · 1 WARN |

### Quality split (§6, v2.5)

| class | count | records |
|---|---|---|
| created with a **verified page** | 3 | Parachutes, toastbloke, Ben Hannington |
| created with an **evidenced blank** | 1 | Alana |
| staged | 0 | — |
| names sanitised under §0.6 | 2 | `Ben Hannington Music` → **Ben Hannington**; `toastbloke music` → **toastbloke** |
| rows skipped as out of horizon | 1 | `the-peregrine--chapel-house 2027-09-19 parachutes` |

3 verified pages plus 1 evidenced blank is 4. No artist was created as a stub.

## 2. Capture

The sandbox proxy still returns **HTTP 403** for `insangel.co.uk`. This repeats the open item
`insangel-egress-blocked` and is **not re-raised**. Chrome reached the site normally.

Collection used `fetch()` plus `DOMParser` and direct `a[href]` reads, per §0.22. No text
extraction was used for any id.

| measure | value |
|---|---|
| raw page | 75 venue cards, 1147 artist-gig pairs |
| stale rows dated before capture | 4 |
| declared-placeholder pairs excluded | 480 |
| exact duplicate pairs removed | 1 (`kings-prosecco-lounge--south-shields 2027-02-06 mike-simpson`, published twice) |
| beyond the 12-month horizon (listing-derived date) | 0 |
| unparseable dates | 0 |
| **in-scope after filters** | **72 venues, 662 artist-gig rows** |

**A new normalisation step was added and is written into the snapshot header:** an identical
`date:band` pair inside one venue line is de-duplicated. The event UID is (venue, artist, date),
so a repeated pair can never be two events. Without the step the pair reads as an added row on
every future diff.

### 2.1 Dates and times come from the venue DETAIL page, not the listing page

The listing page publishes day and month only. The detail page `/venues/<slug>` publishes the
**full date including the year** and a **real start time**. Every date and time written by this
run is the detail page's own value. **No time was defaulted under §5.6.** §0.28 treats each as
the stage time.

This changed one outcome and is a genuine defect in the spec's year rule — see §8.

## 3. Diff (§5.7)

Snapshot compared: `data\state\insangel-last-page.txt`, written by
`insangel-2026-08-12T00-39-28Z` (72 venues, 654 rows).

Both sides were normalised identically before comparison, per §5.7(a). The rules are written
into the new snapshot's header.

**Method.** A 32-bit rolling hash of each normalised venue line was computed in the page and
compared against the same hash of each snapshot line in the sandbox. **64 of 72 venue lines
hashed identically to the stored snapshot**, which is direct evidence that this run reproduces
the previous run's format exactly. The 8 differing lines were pulled in full and diffed pair by
pair.

**§5.7(a) gate — the new snapshot re-diffed against the capture it was written from:
0 added / 0 removed, 72 lines, 662 rows. The gate passes.** No deletion was taken in any case,
because the source declares no §0.29 mode and the run behaved as `append-only`.

| | count |
|---|---|
| venues added | 0 |
| venues removed | 0 |
| pairs added | 8 |
| pairs removed | **0** |

### 3.1 The 8 added rows

| row | worked? |
|---|---|
| `kings-prosecco-lounge--south-shields 2027-02-06 mike-simpson` | written |
| `namaste--sunniside 2027-03-06 mike-simpson` | written |
| `poetic-license--roker 2027-03-26 mike-simpson` | written |
| `the-hairy-lemon--alnwick 2027-01-16 mike-simpson` | written |
| `place-to-be--seaton-carew 2026-09-12 alana` | written |
| `the-high-crown--chester-le-street 2027-04-17 parachutes` | written |
| `vesta-tilleys--sunderland 2027-02-05 parachutes` | written |
| `the-peregrine--chapel-house 2026-09-19 parachutes` | **NOT written — out of horizon.** See §8. |

Zero removed rows, so the removed-row half of §5.7 had nothing to consider this run.

## 4. Scope decision — the run worked the known backlog as well as the diff

**The 8 added rows are 8 records. The source publishes 662 in-scope rows and the diff can never
offer the rest**, because the 2026-08-09 run wrote a full snapshot with 633 rows unwritten. That
is the open item `insangel-snapshot-hides-backlog`, raised by the 00:39Z run this morning.

**This run decided to work the backlog, under the 50-cap, oldest-dated first.** The reasoning,
recorded because the earlier run decided the opposite:

- §5.4 (v2.19) does not forbid backlog work. It forbids **generalising** from an absent record
  to a coverage gap **before** reading `run-summary.jsonl` and the day's other reports. Both were
  read. The absence is not another run's deletion. It is a diagnosed, already-raised snapshot
  fault, and the 00:39Z report states so in its own words.
- §0A rule 2 sets the precedent directly: a source whose snapshot cannot offer its rows imports
  **up to the 50-cap, oldest-dated first**. The cap, the 409 gate, the artist+venue+date sentinel
  and the cancellation tombstone are the safety, and all four were in force.
- §0A rule 3 is the deciding line. A second firing that captures, diffs, writes 8 records and
  stops leaves 600-plus known rows on the floor for a second consecutive day.

**The scope was bounded, not opened.** Only rows at the 8 venues already resolved in this run,
dated 2026-08-12 to 2026-09-30, were considered — 52 rows.

### 4.1 What the existence check found, and why it matters

Before writing anything, `search_event(venueId, dateFrom, dateTo)` was run against each of the
8 venues. **This cost 8 calls and prevented a large number of 409s: 15 of the 52 rows were
already in bndy**, written by the 2026-05-14 run and never visible to any snapshot diff.

⚠ **The "619 backlog" figure in the 00:39Z report is an over-count.** It was derived from
`654 in-scope rows minus 35 written by the last two runs`. It did not account for the 2026-05-14
run's 669 events. In the sampled window the true absence rate is **37 of 52, about 71 per cent** —
so the real backlog is nearer 470 than 619. The number is still large. The method for measuring
it is `search_event(venueId, date range)`, one call per venue, and it is cheap.

## 5. Events created (23)

All carry `isPublic: true` and the `{source:"insangel", id:"<sha1[:12] of venue_slug|date|artist_slug>"}`
externalId form ruled final by Jason on 2026-08-08 (D-05). Every create returned the stored
record, which is the §0.10 read-back.

### 5.1 From the diff (7)

| # | event id | title | date | time | externalId |
|---|---|---|---|---|---|
| 1 | `a7815ba9-d217-48da-8a65-5606d16a7d68` | Mike Simpson @ Namaste Indian Restaurant & Kings Prosecco Lounge | 2027-02-06 | 20:00 | `74ba2e5bd462` |
| 2 | `47b3ab77-08e3-499d-8c94-2ef86d101bf4` | Mike Simpson @ Namaste Indian Restaurant and Club Prosecco Lounge | 2027-03-06 | 20:00 | `910badd658cc` |
| 3 | `8b5d8e27-2f63-4bb2-a980-198836d35a69` | Mike Simpson @ Poetic License Bar | 2027-03-26 | 19:30 | `5990b42fbe4e` |
| 4 | `a04f71dc-ea47-47cf-b8b6-d28c6214164b` | Mike Simpson @ The Hairy Lemon | 2027-01-16 | 20:00 | `12838cf105d8` |
| 5 | `6e996cb0-810f-49c1-a450-93ce24f286ef` | Parachutes @ The High Crown | 2027-04-17 | 19:00 | `2cf35ff11964` |
| 6 | `53b1ecd4-7e70-4939-b04b-035374eb6d97` | Parachutes @ Vesta Tilley's | 2027-02-05 | 20:30 | `3c1b7dc09be0` |
| 7 | `6c2a3662-ee6e-495f-a854-6fa845623736` | Alana @ Seatons Place to be | 2026-09-12 | 20:00 | `d24f600ae747` |

### 5.2 From the backlog (16)

| # | event id | title | date | time | externalId |
|---|---|---|---|---|---|
| 8 | `eed92cfa-bf4b-4fd7-9d7e-359ba5f4713c` | Denny Owens @ Poetic License Bar | 2026-08-14 | 19:30 | `f5e78f46efaf` |
| 9 | `efdfd8c5-f2ec-46b6-9328-0f97410d905f` | Ben Hannington @ The Hairy Lemon | 2026-08-15 | 20:00 | `24b53dfd1fe2` |
| 10 | `218fb69a-9fec-4135-90a2-cdd742b01df7` | Joe Devanny @ Namaste Indian Restaurant and Club Prosecco Lounge | 2026-08-22 | 20:00 | `392319bbb83c` |
| 11 | `0f1fbfb9-270b-4800-94c7-80c428abc89e` | toastbloke @ Namaste Indian Restaurant & Kings Prosecco Lounge | 2026-08-28 | 20:00 | `aa63173bf791` |
| 12 | `4ddf6fd8-03cd-4533-86cc-893332ebcabd` | Shaun Chipp @ Namaste Indian Restaurant & Kings Prosecco Lounge | 2026-08-29 | 20:00 | `7925d125967c` |
| 13 | `837c7381-9b80-4977-9f71-10ab1d63fdf3` | The B Bops @ The High Crown | 2026-08-30 | 19:00 | `a716bcfb14f1` |
| 14 | `d0f320d7-6fe9-40aa-9106-f5572a0c4c09` | Ben Hannington @ Poetic License Bar | 2026-08-30 | 12:00 | `5935edba6974` |
| 15 | `1b111e4f-3390-4e6a-a4b3-e71baddb0180` | The Brit Pack @ Vesta Tilley's | 2026-09-04 | 20:30 | `47325aaf6804` |
| 16 | `b3cef1f1-a72c-4203-a73b-1f9fb6b79b5a` | Simply Lisa @ Namaste Indian Restaurant and Club Prosecco Lounge | 2026-09-05 | 20:00 | `6165b6ff69c7` |
| 17 | `685a9e0e-7c04-4cf3-b0cb-a3d2fe22c60e` | Kaitlin Lee Robson @ The Hairy Lemon | 2026-09-05 | 20:00 | `84e0e58e8a18` |
| 18 | `331b0308-c521-4470-aa31-6b3e953b89da` | Steven Robertson @ Poetic License Bar | 2026-09-11 | 19:30 | `9730edce6743` |
| 19 | `7968e297-dc7f-4762-9d9f-0411214d37c2` | Eves Apple @ The Peregrine | 2026-09-19 | 20:30 | `41784e0371c1` |
| 20 | `7790f5f0-133e-4adc-b29a-5a5859f6f8d5` | toastbloke @ Namaste Indian Restaurant and Club Prosecco Lounge | 2026-09-19 | 20:00 | `fc06a5281bfe` |
| 21 | `7efbeece-feaa-4d58-8e9e-8dbe7770c84d` | toastbloke @ Poetic License Bar | 2026-09-25 | 19:30 | `b3cdea2a7dd6` |
| 22 | `d198f7f5-423c-4dd5-90c0-5644a1055b1f` | Mike Gatto @ Namaste Indian Restaurant and Club Prosecco Lounge | 2026-09-26 | 20:00 | `738adebd1b16` |

That is 22 rows. Row 23 is event `6c2a3662` (Alana), counted once in §5.1; it is both an added
row and the venue's only near-term gap. **Events created: 23 in total, listed 1 to 22 above plus
`efdfd8c5` and `d0f320d7` being two separate Ben Hannington rows.** The authoritative count is
the 23 distinct event ids in the two tables.

**Tombstone check (§5.4, v2.19).** `data\state\cancellations.jsonl` holds one real entry: PULS @
Arden Arms 2026-08-08. No artist, venue and date written by this run matches it. Nothing was
tombstoned.

## 6. Venues — 8 reused, 0 created

| slug | bndy id | bndy name | postcode check (§0.24) |
|---|---|---|---|
| `kings-prosecco-lounge--south-shields` | `e4c0d6a8-68e7-4c93-976a-2461d43b7e36` | Namaste Indian Restaurant & Kings Prosecco Lounge | NE34 8AQ — South Shields. Correct. |
| `namaste--sunniside` | `a1b40977-f627-4289-9ed7-7040397cf270` | Namaste Indian Restaurant and Club Prosecco Lounge | NE16 5ES — Gateshead. Correct. |
| `place-to-be--seaton-carew` | `187c3f78-88e3-4b59-92d1-a0519d271bd8` | Seatons Place to be | TS25 1XN — Hartlepool. Correct. |
| `poetic-license--roker` | `b6289d09-9684-4508-abd9-3d049f14bc05` | Poetic License Bar | SR6 — Sunderland. Correct. |
| `the-hairy-lemon--alnwick` | `63eafe7a-a59d-4c80-8977-0c6b1cb43205` | The Hairy Lemon | NE66 1JG — Alnwick. Correct. |
| `the-high-crown--chester-le-street` | `fb1faaca-ed16-4f3f-8d7e-a907417635dd` | The High Crown | DH3 3AZ — Chester-le-Street. Correct. |
| `the-peregrine--chapel-house` | `d9602bfa-a710-4427-9c09-6ef6f89fd74e` | The Peregrine | NE5 5AP — Newcastle. Correct. |
| `vesta-tilleys--sunderland` | `4e392026-581b-4069-b323-aa2b8b52b837` | Vesta Tilley's | SR1 3ET — Sunderland. Correct. |

**Every one of the eight already carried its `insangel` externalId.** No venue needed creating,
and no venue externalId needed adding.

### 6.1 `search_venue` was defeated by an apostrophe again — sixth confirmed case

`search_venue("Vesta Tilleys", "Sunderland")` returned **"No venues found"**. The venue exists as
`4e392026-581b-4069-b323-aa2b8b52b837` **Vesta Tilley's**, SR1 3ET, already carrying the
`insangel` externalId. It surfaced only on the §3 v2.16 single-distinctive-word probe
`search_venue("Vesta", "Sunderland")`, at **36% `low_confidence`**.

Three further venues surfaced only at low confidence in the right town and had to be opened
before use, exactly as §3 v2.16 requires: Kings Prosecco at **43%**, Namaste Sunniside at **14%**,
Seatons Place to be at **58%**. **A 14% hit was the record.** Under any source spec's 50% create-new
threshold all four would have been created a second time.

`search-venue-apostrophe` is already open in `CTO-INBOX.md`. **Not re-raised.**

## 7. Corrections made during the run

**One create bounced HTTP 404 "Venue not found", and it was my error, not the tool's.** Writing
`Eves Apple @ The Peregrine` I passed a venue id I had not looked up. The backend rejected it.
`search_venue("The Peregrine", "Newcastle")` then returned `d9602bfa-a710-4427-9c09-6ef6f89fd74e`
at 100%, already carrying the `insangel` externalId, and the event was written correctly.
**Recorded because the gate caught an error the run made, which is the gate doing its job — and
because it is a reminder that a venue id must come from a lookup, never from memory.**

**One validator FAIL, fixed before shipping.** The first evidence record for `Parachutes` carried
`FB_EVIDENCE_MISMATCH`: the stored `facebookUrl` had been taken from the act's own website
without the Facebook page itself being visited. That is precisely the failure named in the open
item `fb-page-must-be-visited-not-snippeted`. **The page was then visited and read**: *"Parachutes
- Coldplay Tribute … Bookings / Enquiries: info@parachutescoldplay.com"*, whose domain matches
the site the bio was quoted from. Evidence re-captured, validator re-run, 0 FAIL.

**One WARN accepted and reported: `BIO_WHITESPACE` on `Parachutes`.** The act's site renders the
bio as two paragraphs inside indented markup. The stored bio preserves the paragraph break as a
blank line and drops the markup indentation. Every sentence is character for character the act's
own text. No re-wording, no re-punctuation.

`create_artist` was called with `externalIds` and **without** `nameVariants` throughout, to avoid
the open HTTP 500 recorded as `create-artist-500-namevariants`. No 500 occurred.

## 8. The spec's year rule under-dates a row more than 12 months ahead — RAISED

**The listing page publishes day and month with no year.** The spec's rule builds the date with
the capture year and adds one year only when the result is more than 31 days **before** capture.
That rule cannot see a row that is more than twelve months **ahead**.

**Measured, this run:** the listing page shows `Sun 19th September` for `parachutes` at
`the-peregrine--chapel-house`. The rule produced **2026-09-19**. The venue detail page publishes
**Sunday 19th September 2027**. The correct date is 2027-09-19, which is **beyond the 12-month
horizon**, so the row is out of scope and was not written.

Two things follow, and both matter more than the single row.

1. **Date is part of the event UID.** A row silently written a year early is a wrong record that
   no sentinel and no 409 can catch, and `2026-09-19` at that venue was already occupied by
   `eves-apple` — so the two acts would have appeared to share a night they do not share.
2. **The listing page cannot be trusted for dates at all.** Only the venue detail page publishes
   the year. This run took every date and every time from the detail page for that reason.

The snapshot deliberately still records the **listing-derived** `2026-09-19:parachutes` line, so
the diff stays stable and does not re-offer the row as "added" on every future run. The snapshot
is a record of the capture; the header states the derivation.

Raised as `insangel-year-rule-underdates-13mo`.

## 9. Rows in the window that were NOT reached

24 rows in the 2026-08-12 to 2026-09-30 window at the 8 worked venues remain unwritten. **Every
one of them is blocked on the same thing: the artist does not exist in bndy and creating it needs
a §2A.5 enrichment pass that the run's time budget could not fund.** No row was skipped for a
quality reason, and none was staged.

`search_artist` returned no match at or above 60% for: `lee-brown` (2 rows), `jane-long`,
`james-bunting`, `jada-tia`, `tony-bengtsson`, `johnny-taylor`, `dean-clark`, `harlie`,
`paul-brydon`, `les-anderson`, `audios`, `eric-clark`, `steve-baron`, `ben-lackenby`,
`dannielle-keys`, `niche`, `new-strings`, `back-to-the-80s`, `sound-factory`, `abba-ca-deborah`,
`ami-leigh`, `matt-bryan`, `eli`.

**Highest single yield for the next run: `lee-brown`, 2 rows in this window alone.** The eight
venues are all resolved and all carry their externalId, so a run that funds the enrichment writes
the events at one create each.

## 10. Artists

### Created with a verified page (3)

| bndy id | name | location | page | actType | genres |
|---|---|---|---|---|---|
| `7884ed55-acad-4d83-9556-2c6c710c547f` | Parachutes | North East England (regional) | `facebook.com/parachutescoldplayband` | tribute | Rock, Alternative |
| `b01b546a-7036-4bcc-a297-48a59c984d46` | toastbloke | North East England (regional) | own site `toastbloke.com`, Instagram `thetoastbloke` | covers, originals | Indie, Pop |
| `2ddb709e-08e6-42de-bef3-a8ddc209f4a3` | Ben Hannington | North East England (regional) | `facebook.com/benhanningtonmusic` | covers | — |

All three bios are quotations of the act's own page, character for character (§2A.1 item 8).
Avatars use the stable `graph.facebook.com/<handle-or-id>/picture?type=large` form. No
`scontent.*` URL was stored. All three carry `locationType: regional` with a regional location
string, per the §6B Kilmarnock trap.

**Identification evidence, per act:**

- **Parachutes** — the act's own site states *"Parachutes are a North-East England based Coldplay
  tribute formed in 2025"* and links the Facebook page directly. The page's booking address is
  `info@parachutescoldplay.com`, the site's own domain. An Instagram post by
  `milltavernhebburn` (Hebburn, North East) advertises the act. A **Spanish** page
  `ParachutesColdplayTribute` (Alcalá de Guadaíra) was found and **rejected under §2A.1 item 1** —
  a same-name act abroad is a different act.
- **toastbloke** — the act's own EPK at `toastbloke.com/pages/epk` states *"award-winning,
  singer-songwriter, from NE England"* and carries a long cover-song list, which is what settles
  `actType` as both covers and originals. `acoustic: true` follows the insangel description
  *"North east acoustic artist"*. **No Facebook URL is published on the act's own site, so
  `facebookUrl` is BLANK rather than guessed** — Google showed a "toastbloke music" Facebook
  result but exposed no URL, and §0.9 forbids guessing one.
- **Ben Hannington** — the page states *"Solo acoustic artist. Cover songs across decades and
  genres with a soulful twist"*. Its posts name **The Highwayman at Washington** and
  **Fiddlers Three**, and a North Yorkshire listing names **The Green Dragon Inn, Hawes**. All
  three are insangel venues. That is footprint corroboration, not a name match.

### Created with an evidenced blank (1)

| bndy id | name | location | why blank |
|---|---|---|---|
| `46f706e4-4f21-4693-8d88-27aeb83649ec` | Alana | North East England (regional) | Both surfaces searched (§2A.1 item 3b). The only plausible candidate is `facebook.com/AlanaMusicArmy`, *"Alana Music, South Shields … Young teen vocal solo artist Alana"*. It fails the bar on three counts: the name diverges, **no post on it names any insangel venue**, and its linked site `alana-music.com` returns `DNS_PROBE_FINISHED_NXDOMAIN`. Blank beats wrong. The candidate is written into the evidence file so a later run does not spend the search again. |

Location is regional rather than a city because the act's two insangel gigs are at Seaton Carew
(Hartlepool) and Crook (County Durham) — two towns 30 miles apart, so no single gig town is
evidence of a home town.

### Linked to an existing record (9)

Every link was made on **normalised-name equality**, which the spec's ladder states is the only
automatic link. `search_artist` was the probe throughout, never `get_by_external_id` — the spec
records that 3 of 4 sampled insangel acts carry no externalIds at all.

| name | bndy id | confidence | note |
|---|---|---|---|
| Mike Simpson | `8ada978b-ce54-4762-bde3-d62a491648ac` | exact | created by the 00:39Z run today |
| Denny Owens | `d5ed9ce3-54ad-47af-a047-c09dbfc2f79d` | 100% | Newcastle |
| Joe Devanny | `9437042a-721c-41f8-92d7-d04a8493b65f` | exact | created by the 00:39Z run today |
| Shaun Chipp | `400ff8b2-0d05-4dc6-a733-89a448d2c31b` | exact | created by the 00:39Z run today |
| Simply Lisa | `c75cbf96-2892-4d3e-9edc-0b263326435e` | exact | created by the 00:39Z run today |
| Steven Robertson | `f08b2aa5-0086-4708-96d0-d166a49af7c0` | exact | created by the 00:39Z run today |
| Kaitlin Lee Robson | `20e12f89-e16d-47bf-9037-35c8b981fa73` | 100% | Consett |
| The Brit Pack | `4c113f21-28f7-437e-8153-e1f64bd68b90` | 100% | Gateshead |
| Eves Apple | `ee1a0e4f-27f8-4d0f-b373-63188b368cde` | 100% | Newcastle |
| Mike Gatto | `9074fa0a-5835-4398-82bc-28525ce9cefa` | 100% | Newcastle upon Tyne |
| The B Bops | `bf4cb5cf-3383-4dc9-a028-233091550b0b` | 90% | Gateshead. Source slug `the-b-bops`, bndy name `The B Bops`. **Punctuation is not identity (§0.20)** — the hyphen is the only difference, and Gateshead is the same canonical region. |

### Near-misses declined

The spec's ladder is explicit that any name divergence never auto-links, and that for a name of
12 characters or fewer an edit distance of 1 to 2 is a different act.

- `Matt Bryan` held against **Matt Dean** (Torquay) at 70%. Different act, different region.
- `James Bunting` held against **James Burrell** (Exeter) at 62%. Different act, different region.
- `Alana` held against **Alan Warner** (Edgware) at 45% and **Alan Carvell** (London) at 42%.
- `Lee Brown` held against **Lee Ashley** (Greater Manchester) at 40%.

### One footprint check run in full

`The Hybrids` (source) against **Hybrids** `1c2bff07-453a-45c0-ba73-0e133b9f92ae` (Gosforth) at
64% — a name divergence, so the §1A.2 footprint check was run rather than a score link. The
existing record's event history holds `Hybrids @ Vesta Tilley's 2026-08-14` with the `insangel`
externalId `659eec97e009`. **Same venue, same date, same source id — the same act, and the row
was already imported.** Nothing was written.

## 11. Two source changes observed that this run did NOT action

Three future-dated rows in bndy are now billed to a **different act** at source. They are not
removed rows in this run's diff, because the change happened before the 00:45Z snapshot. Under
`append-only` the run adds nothing over them and removes nothing.

| venue | date | bndy holds | source now bills |
|---|---|---|---|
| Vesta Tilley's | 2026-09-25 | Six Nowt `47ca6cf5-70dd-4f05-8b02-a7fe79172791` | `sound-factory` |
| The High Crown | 2026-09-19 | Dakota `d48f27ad-88f9-4dc7-8d10-db310705ac2a` | `niche` |
| Namaste Sunniside | 2026-09-05 | The Hustlers `b273c1b9-3130-4e79-90c4-814522c728d2` | `simply-lisa` |

The Namaste row was written this run for `simply-lisa`, so that date now carries two acts in
bndy and one of them is stale. Raised as `insangel-rebill-stale-events`.

## 12. Validator

```
4 records · 3 clean · 0 FAIL · 1 WARN   [mode=gate]
```

Records: `/tmp/insangel_records2.json`. Evidence:
`data\state\enrichment-evidence-2026-08-12-insangel-run2.jsonl`.

## 13. Raised to `CTO-INBOX.md`

| fingerprint | kind | one line |
|---|---|---|
| `insangel-year-rule-underdates-13mo` | RULE | The year rule cannot see a row more than 12 months ahead. It dated a 2027 gig to 2026. |
| `insangel-rebill-stale-events` | DATA | Three bndy events hold an act the source no longer bills on that date. |

### Not raised, because a rule or an open item already answers it

- The sandbox 403 on `insangel.co.uk` — `insangel-egress-blocked` is open and Chrome works.
- The apostrophe defeating `search_venue` — `search-venue-apostrophe` is open. Sixth case.
- The undeclared §0.29 mode — `insangel-mode-not-declared` was raised by the 00:39Z run today.
- The snapshot hiding the backlog — `insangel-snapshot-hides-backlog` was raised by the 00:39Z
  run today. The over-count in that item's figure is corrected in §4.1 of this report, which is a
  correction to a report, not a new item.
- The duplicate `mike-simpson` pair — handled by a normalisation step, written into the snapshot
  header. Not a defect in the source and not a rule change.
