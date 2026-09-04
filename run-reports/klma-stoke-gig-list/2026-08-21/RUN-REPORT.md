# KLMA Stoke gig list — RUN REPORT 2026-08-21

- **Run id:** `klma-stoke-gig-list-2026-08-21T00-24-33Z`
- **Outcome:** COMPLETED. 6 events created. 4 pre-existing events enriched. 2 artists created. 1 artist corrected. 1 venue created. Validator 0 FAIL.
- **Runbook read:** `RUNBOOK.md` H1 **v2.27**. §6A CURRENT FLOOR **v2.19**. Assertion PASSES.
- **Prompt floor:** the task prompt names no number. It defers to §6A. No drift to report.
- **Spec read:** `sources/klma-stoke-gig-list.md` in full, including §VA and §VA.9.
- **Claim:** `data/state/claims/klma-stoke-gig-list.json` read `heldBy: null`. Acquired normally. No takeover. TTL 2 hours per §6G.
- **Heartbeat:** `data/state/heartbeat/klma-stoke-gig-list-2026-08-21T00-24-33Z.json`.
- **Tombstones:** `data/state/cancellations.jsonl` holds 5 lines. None matches an artist, venue or date this run wrote.
- **`enrichment.lock`:** absent, as §6A step 2b requires. Nothing recreated it.
- **Mode:** the spec declares no §0.29 mode. The run defaulted to **append-only**. Nothing was deleted. Nothing was hidden.

---

## 1. HEADLINE — Chrome is back, and the artist backlog moved

`list_connected_browsers` returned one live browser. The Facebook session is logged in.
Page search returns results again.

This ends an outage that the enrichment task logged for **38 consecutive firings**, from
2026-08-17T22:17Z to 2026-08-19T11:19Z. `klma-chrome-unreachable-blocks-artists` and
`facebook-page-search-not-found` are both answered by this run's evidence.

**What it bought.** The 2026-08-19 run listed 9 acts it could not write, because §2A.1 item 5
forbids a bare artist create. This run wrote **2 of those 9**, both with a verified page or an
evidenced blank, and both with a discrete event attached. It also corrected a third.

⚠ **No task ran at all on 2026-08-20.** `data/state/heartbeat/` holds nothing between
2026-08-19T11:19Z and this run. `data/state/run-summary.jsonl` agrees. That is a 37-hour gap
across every scheduled task. This run is the first firing since.

## 2. Capture

| Feed | Surface used | Result |
|---|---|---|
| Section 1, KLMA sheet | container `curl` on `gviz/tq?tqx=out:html` | HTTP 200, **110,597 bytes**, 429 DOM rows, 8 `td` cells on every row |
| Section 2, Sugarmill | `web_fetch` | 30 distinct gigs, hrefs intact |
| The Rigger | `web_fetch` | REACHED — 15 dated shows to 27 Mar |
| Cosey Club · Eleven · Artisan Tap | **not fetched** | see §7 |

Container `curl` on `thesugarmill.co.uk` returned HTTP 000 with
`Received HTTP code 403 from proxy after CONNECT`. `web_fetch` returned the page complete.
That matches the standing `sugarmill-webfetch-preserves-hrefs` finding.

## 3. ⚠ THE PREVIOUS SNAPSHOT WAS MISSING A WHOLE COLUMN

**The 2026-08-19 snapshot omitted column 4, the Time column.** Its stored header row reads
`Artist Venue & Location Cost/Ticket Genre Link to Event`. There is no `Time (eg 9pm)` field in
it, and no data row carries a time.

Today's capture carries the Time column on the header row and on every data row.

**A raw-line diff of the two reports 152 added and 150 removed.** None of that is source change.
Every one of the 150 "removed" rows is the same gig with its time missing.

**Under `delta` mode this run would have proposed roughly 90 future-dated deletions.**
§0.17 deletes those. The source had not changed at all. Append-only mode is the only reason the
question did not arise.

**What this run did instead.** It parsed the capture by column index and generated two joined
forms per row — one with the time cell and one without. It diffed the stored snapshot against
both. That gives a time-insensitive comparison and the true result:

| | count | detail |
|---|---|---|
| Added, gig rows | **8** | pipelined, see §4 |
| Added, form-metadata churn | 8 | 2040/2041 placeholder rows, `Gig List Form` banners |
| Removed, past-dated | 3 | Major Feelgood 18 Aug, Camems 19 Aug, Solstice 19 Aug — normal |
| Removed, duplicate spelling | 2 | see below |
| Removed, genuine future row | **1** | see §6 |
| Removed, form-metadata churn | 8 | 2040/2041 placeholder rows |

The two duplicate-spelling removals are not removals. `Eddie Lee,s Back to Back` at
`The Red Lion. Wynbunbury` on 22 Aug vanished while `Eddie Lees Back to Back` at
`The Red Lion Wynbunbury` on the same date is still published. The same holds for
`Tanky's Electrifying 80s - 80's Synth Pop Favourites` at `The Cosey Haslington` on 22 Aug, where
`Tanky/Electrifying 80's` at `The Cosey Club, 1, Fields Road, Haslington, Crewe, CW1 5ST` remains.
The curator removed one of two rows for one gig. Nothing was cancelled.

Raised as `klma-snapshot-missing-time-column`.

**Section 2 diff: 0 added / 0 removed.** All 30 Sugarmill rows are unchanged. The three status
markers are unchanged: `declan-mckenna` SOLD OUT, `arkayla` SOLD OUT, `the-year-grunge-broke`
RESCHEDULED.

## 4. What was written

Rows were worked in gigs-per-artist order, largest group first, per the spec's 2026-08-08 CTO
ruling. Jane and the Hurricanes carried 5 of the 8 added gig rows.

### 4a. Events created — 6

| Event id | Date | Act | Venue | Time | Price |
|---|---|---|---|---|---|
| `7e7cb663-a909-411b-b452-361633644c79` | 2026-10-15 | Jane and the Hurricanes | Swan Inn, Stone | 21:00 | Free |
| `b61c4c48-22f2-4e36-90e5-0743ea429d60` | 2026-10-24 | Jane and the Hurricanes | The Roebuck, Leek | 21:00 | Free |
| `74aeb426-7a0a-4f50-bd2d-e4ec984256d3` | 2026-11-08 | Jane and the Hurricanes | Alexander's Live, Chester | 14:00 | Free |
| `617adb9f-5272-4fab-9250-64fe55c6a9a6` | 2026-11-15 | Jane and the Hurricanes | Clarence House Hotel, Tenby | 13:00 | Free |
| `975b1f5a-f793-44de-859d-f39ccb6f96f1` | 2026-09-26 | Molly Vulpyne Band | The Rigger | 19:00 | ticketed |
| `8551b3be-a02f-43af-9062-acefecd26b38` | 2026-09-05 | Definitely KB | The Bush At Brown Edge | 21:00 | — |

Every one carries `isPublic: true` and a §6D slug externalId. Every one was read back with
`get_by_id` or `search_event` (§0.10).

### 4b. Events enriched, not created — 4

Each bounced `DUPLICATE_EVENT`. §5.3 says enrich the existing record and never create a variant.

| Event id | Date | Act | Venue | What this run added |
|---|---|---|---|---|
| `410d58bc-db54-4c70-9f56-4220945bd5a0` | 2026-08-30 | Jane and the Hurricanes | The Black Bear | klma externalId, alongside the existing `cjab` and `cowork-discovery` ids |
| `faf37324-a746-4c56-81e2-cb202fb955a6` | 2026-08-22 | Afterglow | The Ashwood | klma externalId, `ticketed:false`, `price: Free`, the Facebook event URL |
| `9f808b40-732e-497a-8ed4-2275fb4c2c08` | 2026-08-21 | Jo Safina | The Ashwood | klma externalId, defaulted-time provenance note |
| `0d2f6d42-ddd6-4b05-a51a-fc222aa62e46` | 2026-09-04 | Vavoom | Cosey Club | klma externalId |

The Black Bear event is already a child of Festival `9a7b5df5-c0ae-4487-9793-8612232d5565`,
Congleton Jazz & Blues Festival 2026. This run left the parent link untouched.

### 4c. Artists created — 2, both with evidence

**`32e06da5-abfd-4a1f-be77-931d79b44f9b` Molly Vulpyne Band** — verified page.
- Page: `facebook.com/mollyvulpyne`, 1.2K followers, category Musician/band. Visited in Chrome.
- Identity evidence: the page's own post reads *"This new single from Molly Vulpyne Band"*. The
  Rigger's ticket link is `gigantic.com/molly-vulpyne-band-tickets/...`. Breakingtunes, Louder
  Than War and Spindizzy Records all use `Molly Vulpyne Band`.
- ⚠ **Name corrected.** KLMA bills `Molly Vulpyne's Band`. The Rigger's own page bills
  `Molly Vulpine Band` with an **i**. The act's own page spells it **Vulpyne** with a **y**, and
  so does the venue's own ticket URL. §0.20 gives the act's page the last word. Written as
  `Molly Vulpyne Band`.
- ⚠ **The page states it is no longer in use** — *"I AM NO LONGER USING THIS PAGE. Interact with
  me on Instagram instead"*. §2A.1 item 2 requires a check for a live successor. The page names
  its own successor, so `instagram.com/molly_vulpyne` is stored too. No newer Facebook page exists.
- **Bio EMPTY.** The only intro text on the page is that migration notice. It is not a bio.
  §2A.1 item 8 allows a quotation or nothing. This run wrote nothing.
- ⚠ **Location Dublin.** The act is Irish. The evidence is unambiguous: a video shot on a walk
  around Dublin, a record mixed at Trackmix Dublin, a live session at RTÉ 2fm, and two Irish
  dates. The gig is at a UK venue, so the gig itself is in remit. §0.7's "UK wide" fallback for a
  national-act venue does not apply, because the act's own page does state a location.
- genres `Alternative / Punk / Rock` (inferred, the only field §2A.1 item 8 permits a run to
  infer). actType `originals`.

**`13964c28-5cb4-4bdc-befb-3935bae72154` Definitely KB** — verified page.
- Page: `facebook.com/p/Definitely-KB-100063560919174/`, 2.9K followers, Liverpool. Visited in Chrome.
- Identity evidence: the page's own text reads *"Definitely KB, 90's Indie/Britpop & Solo-Oasis
  Tribute."*. The venue's own Facebook event for this exact gig reads *"For all you 90s britpop
  and indie fans"*. Same billing, same genre, same country.
- Bio transferred verbatim, line breaks preserved, Facebook chrome stripped.
- The 2026-08-19 run held this act against `Definitely Oasis` at 69%. §1A.7 applies: a different
  name is not a collision. Resolved with `confirmNew: true`.
- ⚠ The page's own title is `Definitely K.B` with full stops. Its own bio text writes
  `Definitely KB`, and so do the sheet and the venue's event. §0.20 normalises the punctuation.
  Written as `Definitely KB`.

### 4d. Artist corrected — 1. A LIVE RECORD CARRIED A US BAND'S FACEBOOK PAGE

**`24527005-5066-424c-90f3-d96016769992` Vavoom.**

`create_artist` matched this record on the normalised name. The 2026-08-19 run reported "no match
at all" for this act, because it searched the billing string `Vavoom!!`. The record existed.

Reading it back showed `facebookUrl: https://www.facebook.com/vavoomband/` and a matching avatar.
**This run opened that page in Chrome. It is a Detroit covers band.** Its own text reads
*"Winner of 2021 WDIV's Vote 4 The Best: 'Best Cover Band' also 2019 Hour Detroit Magazine's
'Best Cover Band'"*, and it links `vavoomband.com`.

The bndy record is the **Crewe** act — a three-piece rockabilly and rock 'n' roll band with
Andy Boote, Stephen Wallace and Chris Large, playing The Cosey in Haslington.

§0.15 and §2A.1 item 1 forbid a non-UK same-name page on a UK act. §2A.1 states a wrong link is
worse than a blank one. **This run cleared `facebookUrl` and `profileImageUrl` and verified the
clear on read-back.** It also filled the empty fields: `artistType: trio`, `location: Crewe`,
genres `Rock n Roll / Rock / 50s`, actType `covers`.

The record was created on 2026-08-19T12:59Z by the `cjab` source, not by this task. Logged as
`vavoom-us-facebook-on-uk-act` so the source that wrote it can be checked for the same fault
elsewhere.

⚠ **A second US band, `vavoomrocks.net`, also surfaced on Google and was also rejected.** Two
different American bands share this name. The Google result summary blended all three acts into
one description. That is exactly the failure §2A.1 item 3b warns about, and it was caught only by
opening the page.

### 4e. Venue created — 1

**`2727327b-a42e-4e83-adb0-398fc845b126` Clarence House Hotel**, Tenby.
- Google Place ID `ChIJG3NjqX7LbkgRthMXqBPDBEQ`. Address `1 -2, Clarence Hotel, Esplanade,
  Tenby SA70 7DU`.
- §0.24 postcode check: **SA70 is Pembrokeshire**, which is where Tenby is. PASS.
- The sheet bills it `The Clarence Hotel`. Its own site is `clarencehoteltenby.co.uk` and its
  registered name is Clarence House Hotel. Google's own address string contains both. The two
  names are one building.
- `search_venue("Clarence", "Tenby")` returned nothing. `list_venues(city:"Tenby")` returned
  two venues, neither of them this one. Both probes ran before the create, per §3.

⚠ **`search_venue` missed `Alexander's Live`, Chester, on the apostrophe.**
`search_venue("Alexanders","Chester")` returned zero. `list_venues(city:"Chester")` returned the
record at once. That is the sixth instance of `search-venue-apostrophe`. Not re-raised.

## 5. ⚠ AN UNATTRIBUTED WRITER CREATED KLMA EVENTS AT 00:23Z, 90 SECONDS BEFORE THIS RUN

Three of the four `DUPLICATE_EVENT` bounces in §4b resolved to records created at
**2026-08-21T00:23:01Z, 00:23:04Z and 00:23:32Z**. This run wrote its heartbeat at 00:24:33Z, so
none of them is its own.

| Event id | createdAt | externalIds as found |
|---|---|---|
| `9f808b40-732e-497a-8ed4-2275fb4c2c08` Jo Safina @ The Ashwood | 00:23:01Z | **empty** |
| `faf37324-a746-4c56-81e2-cb202fb955a6` Afterglow @ The Ashwood | 00:23:04Z | **empty** |
| `0d2f6d42-ddd6-4b05-a51a-fc222aa62e46` Vavoom @ The Cosey | 00:23:32Z | **empty** |

All three are KLMA sheet rows. Two of them are rows this run's own diff had just found as added.

**There is no heartbeat, no claim, no run report and no `run-summary.jsonl` line for that
writer.** The claim file read `heldBy: null` when this run acquired it.

Every one was written with **no externalId**, so no future run can match it by provenance and the
§5.7 diff cannot see it. This run back-filled the correct §6D slug on all three.

Same class as the standing `unclaimed-bare-artist-creates-0413z`, which names artist creates.
This is event creates, so it is logged separately as `unclaimed-klma-event-creates-0023z`.

## 6. Removed rows — append-only, so nothing was deleted

**One genuine future-dated removal:**

`45950.67852 Friday, August 21, 2026 Walters & Bligh Swiftys 8:00 pm Acoustic Rock & Pop Covers`
plus a long Facebook `acontext` query string.

The gig is **today**. The row is gone from the sheet. Under append-only the run logs it and does
nothing else. It is not deleted and it is not hidden. Logged as
`klma-walters-bligh-swiftys-vanished-today`.

The other 13 removals are explained in §3. Three are past-dated. Two are duplicate spellings of a
row still present. Eight are 2040/2041 form-metadata churn.

## 7. §VA venue-authoritative checks — honest status

| Venue | Status this run | Note |
|---|---|---|
| **The Rigger** | **CHECKED** | `web_fetch` returned the page complete, 15 dated shows |
| **Cosey Club** | **NOT FETCHED** | see below |
| **Eleven** | **NOT FETCHED** | see below |
| **Artisan Tap** | **NOT FETCHED** | still no proven surface (§VA.1) |
| **The Sugarmill** | **CHECKED** | sole-source feed, 30 rows, 0/0 diff |

**Why Cosey and Eleven were not fetched.** No added row this run belongs to either venue, so
neither page was needed as a name authority. The run spent its remaining budget on the artist
backlog instead, which Chrome had blocked for two days. **This is a deliberate choice and it is
stated here rather than reported as "checked".** §VA.5 also holds: the run pipelined no
Artisan Tap or Eleven row, so the column-bleed hazard was not reached.

**What The Rigger's page settled.** It bills only the headline act for 04 Sept (VARUKERS) and
18 Sept (Riskee & The Ridicule). The support acts in the KLMA rows are not on the venue page at
all. It confirmed `Molly Vulpine Band` on Sat 26 Sept at 19:00, and its ticket URL confirmed the
**Vulpyne** spelling that the act's own page uses.

## 8. Not reached, and why — named so the next run can take them

The 2026-08-19 run listed 9 blocked acts. This run cleared 2 and corrected 1. **Six remain**, and
all six are now writable, because Chrome is back:

| Act | Gig | Cost |
|---|---|---|
| **Groove 45** | Granville's, 2026-09-12 | 1 artist, 1 event |
| **Blitzkrieg UK** | The Rigger, 2026-09-04, support | 1 artist, 1 event |
| **The Thirteenth Turn** | The Rigger, 2026-09-04, support | 1 artist, 1 event |
| **Deadwax** | The Rigger, 2026-09-18, support | 1 artist, 1 event |
| **Boss Cass** | The Rigger, 2026-09-18, support | 1 artist, 1 event |
| **KNUTMO FIVE** and **KANGARU** | Sugarmill, 2026-09-13, supports | 2 artists, 2 events |

⚠ **A deferred row is not a saved row.** The snapshot now records all six as seen, so no future
diff will offer them. They are recoverable only from this report and from the 2026-08-19 report.
That is the standing `blocked-rows-not-re-presented-by-diff` fault, unchanged.

**Rows skipped this run:**

- `19/08/2026 15:43:16 Thursday, August 20, 2026 Afterglow Ashwood Longton 7:12 am` — **past-dated**.
  Today is 2026-08-21. §0.14 forbids importing it.
- 8 added rows dated 2040 and 2041, plus `Gig List Form` banner rows — form metadata, not gigs.

## 9. Times, prices and defaults applied

| Row | Sheet value | Written | Rule |
|---|---|---|---|
| Jo Safina @ The Ashwood, 21 Aug | `7:12 am` | **21:00** | spec "venue-hours-as-time". Provenance written to `event.notes`. |
| Jane and the Hurricanes @ Black Bear | `3.00 pm` | 15:00 | matches the pre-existing record |
| Jane and the Hurricanes @ Roebuck | `9.00 pm` | 21:00 | `H.MMpm` |
| Jane and the Hurricanes @ Alexander's | `2.00 pm` | 14:00 | `H.MMpm` |
| Jane and the Hurricanes @ Clarence House | `1.00 pm` | 13:00 | `H.MMpm` |
| Molly Vulpyne Band @ The Rigger | not in the sheet | 19:00 | **from the venue's own ticket URL**, `...2026-09-26-19-00` |

**§CT `Cost/Ticket` mapping applied.** `Free Entry` on five Jane and the Hurricanes rows and
`Free` on the Afterglow row both map to `ticketed: false`, `price: "Free"`. No new vocabulary
appeared this run. No row was parked over a ticketing string.

The Molly Vulpyne Band event is `ticketed: true` with the venue's own Gigantic URL. That URL
contains `newcastle-under-lyme-the-rigger`, so it resolves to the right venue.

## 10. Quality measures (§6 v2.5)

- Records created **with a verified page**: **1** (Definitely KB — page visited, bio quoted).
- Records created **with a partial verified page**: **1** (Molly Vulpyne Band — page visited and
  attached, bio deliberately empty, successor Instagram attached).
- Records created **with an evidenced blank**: **0**.
- Records **corrected**: **1** (Vavoom — a wrong US page removed, four empty fields filled).
- Records **skipped or staged**: **0 staged**. 1 past-dated row skipped, 8 junk rows skipped.
- Names **sanitised or corrected**: **2** — `Molly Vulpyne's Band` to `Molly Vulpyne Band`,
  `Definitely K.B` to `Definitely KB`.
- **Zero stubs.** Every artist written carries a location, genres, an actType and a page.

## 11. Validator — §6A step 8

Evidence file: `data/state/enrichment-evidence-2026-08-21-klma-stoke-gig-list.jsonl`.
Every line was written before its bndy write.

```
3 records · 2 clean · 0 FAIL · 2 WARN   [mode=gate]
EXIT=0
```

Both WARNs are on `Molly Vulpyne Band` and both are expected:

- `STUB_NO_BIO` — a verified page is attached and the bio is empty. That is deliberate and §4c
  states why. The page's only intro text is a migration notice.
- `NAME_BILLING` — a format tail on the name. The 2026-08-07 Jason ruling states that a trailing
  `Band` is part of the name and must not be stripped on the pattern alone. Four independent
  sources use `Molly Vulpyne Band`.

## 12. Gate bounces, verbatim

Four `DUPLICATE_EVENT` bounces. All four are §0.9 success signals and none was worked around:

```
Event already exists: This artist already has an event at this venue on 2026-08-30.
  existingEventId 410d58bc-db54-4c70-9f56-4220945bd5a0
Event already exists: This artist already has an event at this venue on 2026-08-22.
  existingEventId faf37324-a746-4c56-81e2-cb202fb955a6
Event already exists: This artist already has an event at this venue on 2026-08-21.
  existingEventId 9f808b40-732e-497a-8ed4-2275fb4c2c08
Event already exists: This artist already has an event at this venue on 2026-09-04.
  existingEventId 0d2f6d42-ddd6-4b05-a51a-fc222aa62e46
```

One `create_artist` returned `action: matched` on Vavoom. That is a match, not a bounce, and this
run reused the id.

`record_run` was not called. `SOURCE_RUNS_TOKEN` is still unset. That is the standing
`record-run-token-missing` defect and it is not blocking. `run-summary.jsonl` is the dashboard's
real input and this run appended to it.

## 13. Snapshot

Written to `data/state/klma-stoke-gig-list-last-page.txt`. 428 section-1 rows and 30 section-2
rows. The normalisation rules are written into the file's own header, including the column-index
parse that recovered the Time column.

**§5.7(a) self-diff gate:**

```
SECTION1: snapshot 428 rows, capture 428 rows, added 0, removed 0
SECTION2: snapshot 30 rows, capture 30 rows, added 0, removed 0
0 added / 0 removed on both sections. PASS.
```

## 14. Raised to CTO-INBOX

| Fingerprint | Kind |
|---|---|
| `klma-snapshot-missing-time-column` | RULE |
| `unclaimed-klma-event-creates-0023z` | DATA |
| `vavoom-us-facebook-on-uk-act` | DATA |
| `klma-walters-bligh-swiftys-vanished-today` | DATA |
| `chrome-restored-after-38-firings` | DATA |
| `no-scheduled-task-ran-2026-08-20` | DEFECT |

Not re-raised, already open: `klma-no-delta-mode-declared`, `search-venue-apostrophe`,
`blocked-rows-not-re-presented-by-diff`, `record-run-token-missing`,
`klma-chrome-unreachable-blocks-artists`, `sugarmill-webfetch-preserves-hrefs`,
`klma-curl-reproduces-gviz-live`, `cosey-rigger-webfetch-reachable`,
`klma-zero-diff-hid-nine-missing-gigs`, `unclaimed-bare-artist-creates-0413z`.
