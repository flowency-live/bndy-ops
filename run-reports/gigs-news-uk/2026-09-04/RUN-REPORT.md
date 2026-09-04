# gigs-news — RUN REPORT 2026-09-04

Run id: `gigs-news-2026-09-04T04-07-29Z`
Outcome: **PARTIAL** — 8 events created, 1 event edited, 4 rows blocked on new-artist creates because Chrome is unreachable.

## 1. Gates (§6A steps 0 to 3)

| step | result |
|---|---|
| 0 heartbeat | `data\state\heartbeat\gigs-news-2026-09-04T04-07-29Z.json`, written first |
| 1 date | `2026-09-04` from the shell |
| 2 runbook | read in full. H1 **v2.27** |
| 2a floor | §6A CURRENT FLOOR is **v2.19**. The runbook is **v2.27**. PASS. The task prompt names no number. The standing drift item `prompt-runbook-floor-drift` is already open |
| 2b claim | `data\state\claims\gigs-news.json` held `heldBy:null`. Acquired at 04:07:29Z, TTL 90 minutes, expires 05:37:29Z. No takeover |
| 3 tools | bndy MCP reachable. **Chrome NOT connected** — `list_connected_browsers` returned `[]` |

## 2. Capture (§6A step 4)

Both pages, container curl, into `data\raw\gigs-news-uk\2026-09-04\`.

| page | HTTP | bytes | md5 | change |
|---|---|---|---|---|
| `gigs-news.uk/` | 200 | 114613 | `54849a7b4e8482145b812eb8b6014324` | changed from `74417eae` |
| `gigs-news.uk/branded.htm` | 200 | 264098 | `dd2042b795135279b6300b08a4ebdd07` | byte-identical to 2026-09-03 |

Parsed with BeautifulSoup + lxml, reading `a[href]` on every row per §0.22. `get_page_text` was not used.

**Chrome was unreachable, so the spec's "CHROME IS MANDATORY" line could not be obeyed for capture.** The curl route is the standing precedent `gigs-news-curl-reproduces-week-view` (CTO-INBOX, 2026-08-18): both pages returned complete and live. The capture is not truncated — section 1 holds 98 lines and 5 day headers, section 2 holds 21 lines, both in line with yesterday.

Section 2 stop rule applied as written: the forward list is the FIRST dated section. 21 rows taken, Sep to Dec 2026. No archive row entered the snapshot.

## 3. Diff (§6A step 5, §5.7)

Normalisation is recorded in the snapshot header. Both sides normalised identically before comparing.

**16 added / 15 removed** (line counts equal at 119 both sides).

**Every removed line is the blank-act or time-only form of an added line.** The curator named acts on rows that yesterday read `- the Musketeer Leigh` or `8pm - Dog & Partridge Great Moor`. Removed lines verbatim:

```
- Mash Guru Macclesfield          7pm- the Steelworks Bredbury
- Acoustic Lounge Poynton (x2)    - Queens Hotel Macclesfield
- Society by Whittles Oldham      - the Dog Inn Chadderton
- the Musketeer Leigh (x2)        8pm - Dog & Partridge Great Moor
live bands 4pm - Spinning Top     - the Steelworks Bredbury
5pm - Whittles Oldham             6pm - the Dog Inn Chadderton
7pm - Acoustic Lounge Poynton
```

**No removed row was ever an event in bndy** — a blank act row is rejected by the spec's own reject filter, so none of these has an externalId or a record. There is no cancellation candidate in this diff.

**§0.29 mode: this spec still declares neither `delta` nor `append-only`.** The run defaulted to append-only, as every gigs-news run has since 2026-08-12. §5.7 removed-row handling and §0.17 did not run. The fingerprint `gigs-news-mode-undeclared` is already open; nothing new is raised.

**Self-diff gate (§5.7a): 0 added / 0 removed.** The new snapshot reproduces the capture it was written from. Recorded in `data\raw\gigs-news-uk\2026-09-04\selfdiff-snapshot.txt`.

## 4. Row disposal

16 added rows. 13 read as real gigs, 3 rejected.

**Rejected, per the spec reject filter — no event, venue untouched:**

| row | reason |
|---|---|
| `Nick & Pete's Open Mic - Mash Guru Macclesfield` | open mic |
| `Linda Jennings Open Mic 4pm - the Steelworks Bredbury` | open mic |
| `Blues Jam 4pm - Spinning Top` | jam with no leading act name |

## 5. Written to bndy — 8 created, 1 edited

Every id is a full UUID or the record's full id. Every write was read back with `get_by_id` (§0.10).

| event id | title | date | startTime | externalId |
|---|---|---|---|---|
| `992f4bb5-c06a-4ce1-8bf9-74639c54ead4` | Bridgewater Blues @ The Acoustic Lounge | 2026-09-04 | 21:00 **defaulted** | `2026-09-04-bridgewater-blues-acoustic-lounge-poynton` |
| `bded7e61-cc42-4e79-ba10-25d2b66e855f` | Vintage @ Queen's Hotel | 2026-09-04 | 21:00 **defaulted** | `2026-09-04-vintage-queens-hotel-macclesfield` |
| `8cddf6ce-4c30-44e0-a82c-cdaccbcc643a` | Stash @ The Musketeer | 2026-09-04 | 21:00 **defaulted** | `2026-09-04-stash-musketeer-leigh` |
| `3a9fa845-1015-4435-9ae9-75e19405079c` | Jukebox Rodeo @ The Acoustic Lounge | 2026-09-05 | 21:00 **defaulted** | `2026-09-05-jukebox-rodeo-acoustic-lounge-poynton` |
| `fc6027e3-362c-4bcc-92c8-96b54da22891` | Jack Warhurst @ Hare & Hounds | 2026-09-05 | 21:00 **defaulted** | `2026-09-05-jack-warhurst-hare-hounds-new-mills` |
| `970ea182-4d65-4257-8262-c1d52af4da34` | Trilo3y @ Dog & Partridge, Great Moor | 2026-09-05 | 20:00 from source `8pm` | `2026-09-05-trilo3y-dog-partridge-great-moor` |
| `8208e3ed-817e-4062-82ad-bf50a5b6cd6c` | Lemonade @ Whittles@tokyo | 2026-09-06 | 17:00 from source `5pm` | `2026-09-06-lemonade-whittles-oldham` |
| `53739fc3-043e-447f-8137-cd4e7f256ff5` | Jack Woodward @ The Acoustic Lounge | 2026-09-06 | 19:00 from source `7pm` | `2026-09-06-jack-woodward-acoustic-lounge-poynton` |

All 8 are `isPublic: true`. Five carry a **defaulted** start time under §5.6, applied by the server, not by this run.

**Edited, 1:**

`8f71cb4d-875d-44c7-bd05-80db29dace0c` — Run For Cover @ The Musketeer, 2026-09-05. `create_event` bounced **409 DUPLICATE_EVENT** verbatim:

```
Event already exists: This artist already has an event at this venue on 2026-09-05.
Artists can only have one gig per venue per day.
existingEventId: 8f71cb4d-875d-44c7-bd05-80db29dace0c
```

The gate is correct. The record was created 2026-02-10 with **empty externalIds** and a real 20:30 start time. Per §5.3 the existing event was enriched, not duplicated: the `gigs-news` externalId was added by `edit_event`. **The 20:30 time was left alone** — it is better evidence than the source's silence. Read back: one externalId, `2026-09-05-run-for-cover-musketeer-leigh`.

## 6. Blocked — 4 rows, no new artist could be written

Chrome is unreachable, so §2A.1 item 3b cannot run on either surface. §2A.1 item 5 and item 7 both state that an artist whose identity check cannot be performed is not created bare. These four rows are therefore not written. The next run retries them.

| row | date | venue resolved | search result |
|---|---|---|---|
| `the Lounge Lizards 8pm- the Steelworks Bredbury` | 2026-09-04 | not resolved | `search_artist("Lounge Lizards", minConfidence 25)` → only *Sky Lizard*, Sidmouth, 50%. Not the act |
| `the Spangles - Society by Whittles Oldham` | 2026-09-04 | `bdc57196-9e5e-4003-8f06-5226853b4433` | `search_artist("Spangles", 60)` → none |
| `Ricky Stone - the Dog Inn Chadderton` | 2026-09-04 | not resolved | `search_artist("Ricky Stone", 60)` → *Silkstone* 64% (Taunton), *Ricky Booth* 64% (Ashbourne). Neither is the act |
| `Martin Ward 6pm - the Dog Inn Chadderton` | 2026-09-06 | not resolved | `search_artist("Martin Ward", 60)` → *Laurie Ward* 64%, *Martin Weller* 62%, both Exmouth. Neither is the act |

Two of the four play tonight. This is the fourth dated Chrome outage on this source since 2026-08-18.

## 7. Artist resolution — 9 matched, 0 created, 0 review

No `action: review` was returned. No artist was created, so §2A enrichment did not run and no `confirmNew` / `resolveTo` was needed.

| source billing | bndy artist | id | why it is the same act |
|---|---|---|---|
| Bridgewater Blues Band | Bridgewater Blues | `62c3260f-7141-4e15-8e76-dc63afe33d21` | 77%. Greater Manchester UK, and its avatar is `graph.facebook.com/BridgewaterBluesBand`. The `Band` tail is the billing (§0.6); the FB key is the identity (§1A.2 Step 0) |
| Vintage | Vintage | `a8784ca6-6c7c-44c8-8f9f-6fb4286acef1` | Two `Vintage` records exist: Lincolnshire `8e765587-332b-49e4-a515-a58ccacff4c8` and **Macclesfield**. The gig is at Queen's Hotel Macclesfield. The pair is distinguishable by location (§1A.1); the Macclesfield record is the footprint match (§1A.2 rule 3) |
| Stash | Stash | `9fc687f5-78eb-497d-99e3-fc0b172d1e49` | 100%, sole record, Lancashire. The Musketeer is Leigh WN7, which borders Lancashire — inside the footprint (§1A.2 rule 3) |
| Jukebox Rodeo | Jukebox Rodeo | `d07c7b57-ccc2-44c8-b5f5-b51f6afe178c` | 100%, South Manchester. Poynton is inside that footprint |
| Jack Warhurst | Jack Warhurst | `Xfh6Iv0UeyFOfExSGVtr` | 100%, Stockport, sole record |
| Run For Cover | Run For Cover | `d086b42e-4a24-4a8a-844a-6301297ed12e` | 100%, Chorley, sole record. Already held the 2026-09-05 Musketeer gig |
| Trilo3y | Trilo3y | `qnPMZq8vTzPATVmFEjld` | 100% on the exact source spelling. Stockport, own page `facebook.com/trilo3yoneroute`. **Deliberately NOT matched to `Trilogy` `5fa2d40b-035c-4859-b86f-6c5a23618b5e`, Newcastle upon Tyne** — the spec names `Trilogy Rock Band` as a cross-region name that needs a §1A footprint check, and these are two acts in two disjoint regions. The `3` is the act's own spelling, not a typo (§0.20: do not over-normalise) |
| Lemonade | Lemonade | `8d25337a-daf2-4d84-9539-950d6be95571` | 100%, North West England, sole record |
| Jack Woodward | Jack Woodward | `695cbd7d-ace5-48e6-a652-bd0d2ff6d19d` | 100%, Manchester, sole record |

## 8. Venue resolution — 6 matched, 0 created

§3's three-probe discipline was applied. **Two hits came back low-confidence and were opened rather than dismissed**, which is the §2.16 rule doing its job.

| source venue | bndy venue | id | confidence |
|---|---|---|---|
| Acoustic Lounge Poynton | The Acoustic Lounge, 94-98 Park Ln, SK12 1RE | `Ha5zokxmGzIi6miASzO0` | 79% medium. Postcode agrees with section 2 (`SK12 1RE`) |
| Queens Hotel Macclesfield | Queen's Hotel, 5 Albert Place, SK11 6JW | `6HroN1Vgsv281M7bbbKR` | 92% high. Postcode agrees with section 2 |
| the Musketeer Leigh | The Musketeer, 15 Lord St, WN7 1AB | `KPuQOU8ZZipCyYgxX4iS` | **69% low** — opened. Postcode agrees with section 2 |
| Dog & Partridge Great Moor | Dog & Partridge, Great Moor, 272 Buxton Rd, SK2 7AN | `ea9036e0-f173-438e-bdd2-947b25b5245c` | **11% low** — `search_venue("Dog and Partridge","Stockport")` and `search_venue("Partridge","Great Moor")` both returned nothing. The single-word probe `search_venue("Dog","Stockport")` surfaced it at 11%, already carrying `gigs-news-uk:venue-dogandpartridgegreatmoor`. Sixth instance of the standing `search-venue` miss class |
| Whittles Oldham | Whittles@tokyo, 57 Roscoe St, OL1 1EA | `yGNojetg8AYGh9vlGPia` | 21% low — opened. Not conflated with `Society by Whittles`, Lees OL4 5AA `bdc57196-9e5e-4003-8f06-5226853b4433`, which is a different building with a different place_id |
| Hare & Hounds New Mills | Hare & Hounds, Low Leighton Rd, SK22 4LS | `i0ZMEN0agqL6JOTMhSEm` | learned mapping in the spec, confirmed by `get_by_id` |

§0.24 postcode check passes on all six. No venue was created, so no §0.23 or §0.8 question arose.

## 9. Cancellation tombstones (§5.4)

`data\state\cancellations.jsonl` was read before the first create. 17 lines. Two touch this window and neither matches a row of ours:

- Hard Wired @ The Blacksmiths Arms 2026-09-04 — onthecasemusic, hidden
- Diablo @ Clousden Hill 2026-09-05 — onthecasemusic, deleted

No row of this run was tombstoned. Nothing was appended to the file: this run deleted nothing and hid nothing.

## 10. Quality measure (§6)

- Records created with a verified page: **0** — no artist and no venue was created.
- Records created with an evidenced blank: **0**.
- Rows blocked for want of an identity check: **4** (§6 above). These are not stubs; nothing was written.
- Names sanitised: **0**. No billing string needed stripping this run.
- Names rejected as non-acts: **3** (§4 above).
- Events created: **8**. Events edited: **1**.

This run wrote no artist, so the no-stubs rule is satisfied by construction, not by effort.

## 11. Enrichment evidence (§6A step 8)

`data\state\enrichment-evidence-2026-09-04-gigs-news-uk.jsonl` — created, empty. That is the correct state: no enrichment field was written to any record.

## 12. Validator (§6A step 8)

```
0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit code 0. Input `data\normalized\gigs-news-uk\2026-09-04\validator-records.json` (empty list) and the evidence file above.

## 13. Snapshot (§6A step 7)

Written to `data\state\gigs-news-uk-last-page.txt`, two-section format, 119 body lines, normalisation rules in its own header. Self-diff 0/0.

## 14. Open items raised

Two lines appended to `CTO-INBOX.md`. Both fingerprints are new; the file was searched first.

- `gigs-news-chrome-outage-2026-09-04-four-acts` — BLOCKED
- `gigs-news-run-for-cover-preexisting-no-externalid` — DATA

Not raised, already open and unchanged: `gigs-news-mode-undeclared`, `externalid-slug-drift`, `search-venue-apostrophe`, `prompt-runbook-floor-drift`, `record-run-token-missing`.

## 15. record_run

Not called. `SOURCE_RUNS_TOKEN` is unset and the fingerprint `record-run-token-missing` is already open. `run-summary.jsonl` carries this run instead.
