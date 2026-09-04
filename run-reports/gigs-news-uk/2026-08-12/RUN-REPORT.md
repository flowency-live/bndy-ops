# gigs-news RUN REPORT — 2026-08-12

**Outcome: COMPLETED.** Snapshot written. Validator 0 FAIL.

- Run id: `gigs-news-2026-08-12T00-17-31Z`
- Runbook read: **v2.27**. Floor asserted from §6A: **v2.19**. Pass.
- Prompt floor: the task prompt states no number. It defers to §6A. No drift to report this run.
- Claim: `data/state/claims/gigs-news.json`, acquired 00:18Z, TTL 90 minutes.
- Heartbeat: `data/state/heartbeat/gigs-news-2026-08-12T00-17-31Z.json`.
- Legacy `data/state/gigs-news.lock` exists and reads `heldBy: null`. It is retired by §6A step 2b. The run did not honour it and did not delete it.

## 1. Counts

| Measure | Count |
|---|---|
| Events created and read back | 20 |
| Artists created | 8 |
| Artists matched and enriched | 2 |
| Venues created | 0 |
| Venues matched | 18 |
| Event 409 (already in bndy) | 3 |
| Rows skipped by the reject filter | 61 |
| Rows skipped needing a decision | 2 |
| Creates against the 50 cap | 28 |

## 2. Quality (§6, v2.5)

- **Created with a verified page: 6** — Last Race Home, Anywhere But There, On The Run, Ashley Sherlock, The Cover Babes, and (matched, then enriched) Tony Auton Band and The Driscols.
- **Created with an evidenced blank: 3** — Sin City, Amber Star, Gemma Christina. Search variants for each are in `data/state/enrichment-evidence-2026-08-12-gigs-news.jsonl`. Both surfaces were used per §2A.1 item 3b.
- **Staged: 0.** §0A abolished staging. Two rows were skipped instead (§5 below).
- **Names sanitised: 2** — `Tony Auton band Jam` to the act `Tony Auton Band` with the billing kept in the event title (spec calibration 2026-05-01); `the Cover Babes duo` to `The Cover Babes`, on the act's own page name.

## 3. Capture

Two pages, both read in Chrome, `innerText` only (§0.22, and the spec's archive rule).

1. `https://www.gigs-news.uk/` — week view, "What's on This Week 12 - 16 August".
2. `https://www.gigs-news.uk/branded.htm` — forward list.

**Forward-list boundary.** The `gigs 2026` header is innerText line 15. The next `Gigs 2026` archive header is line 159. The forward list is therefore lines 16 to 42 — 27 rows. Lines 43 onward are set lists and video captions, not gigs. The archive sections (159, 198, 265, 322, 364) were excluded by `innerText` as the spec predicts. Every forward row's day name was checked against its date. All 27 agree.

Raw capture: `data/raw/gigs-news-uk/2026-08-12/capture.txt`.

## 4. Diff (§5.7)

**Mode: treated as `append-only`.** §0.29 requires every source spec to declare `delta` or `append-only` at its top. `sources/gigs-news-uk.md` declares neither. The run therefore actioned no removals. See the CTO-INBOX item `gigs-news-mode-undeclared`.

- **§5.7(a) normalisation applied**, both sides: whitespace runs collapsed, every line trimmed, trailing comma/full stop/slash stripped, HTML entities decoded once, empty lines dropped. The rules are written into the snapshot header.
- **§5.7(a) gate: self-diff of the new snapshot against its own capture is 0 added / 0 removed.** Proven, not asserted.
- **Section 1 (week view):** the page rolled from 5-9 August to 12-16 August. Every row of the previous snapshot is now past-dated. A row that disappears because its date passed is not a cancellation (§5.7). No action.
- **Section 2 (forward list): 3 rows added, 0 future rows removed.**
  - `Sunday 16th August - Whittles Oldham OL1 1EA - 5pm Reserved`
  - `Saturday 10th October - Queens Arms Hotel Old Glossop SK13 7RZ - Reserved`
  - `Thursday 31st December - Queens Arms Hotel Old Glossop SK13 7RZ - Reserved`

  The other 20 future forward rows were already in bndy, verified by `search_event(artistId: rwDw320gku5uQ4gzaU2N)`. Two rows (1 and 8 August) fell off because they passed.

## 5. Tombstone check (§5.4, v2.19)

`data/state/cancellations.jsonl` holds one deletion: PULS @ Arden Arms 2026-08-08. That date has passed and no row in today's capture matches it on artist + venue + date. No create was suppressed.

## 6. Events created

### branded forward list (artist `rwDw320gku5uQ4gzaU2N`)

| Event id | Date | Venue | Venue id | Time |
|---|---|---|---|---|
| `550190d0-77bf-4e34-ba1c-e64cfc32ca70` | 2026-08-16 | Whittles@tokyo, Oldham | `yGNojetg8AYGh9vlGPia` | 17:00 (source: 5pm) |
| `170c8b51-1e5d-446c-9b51-f2dbbbb4e4e7` | 2026-10-10 | The Queens Arms, Glossop | `ThfJQrk9GsFtuBsPJjN5` | 21:00 (defaulted, Sat) |
| `ef449f7b-9d34-41dc-98b0-bf803eda57fd` | 2026-12-31 | The Queens Arms, Glossop | `ThfJQrk9GsFtuBsPJjN5` | 20:00 (defaulted, Thu) |

### week view, existing artists

| Event id | Date | Artist | Artist id | Venue id | Time |
|---|---|---|---|---|---|
| `b8ee955e-3106-4cb3-ab64-a32d41b47788` | 2026-08-13 | Roy Pimmy | `ebf3417d-76d5-42ca-8b5f-1b069a64b3a5` | `6de33e51-114e-47b8-92d3-abccb4fe6bf6` | 16:30 (source) |
| `0010fbf3-62f5-4cc4-943e-c79122ed10b8` | 2026-08-14 | Northern Lights | `ac73f303-f023-4919-ae55-f39be155d559` | `xyERKljjDSlCFaYKMWPH` | 21:00 (defaulted) |
| `052a1514-f9bb-4d7a-bfec-e42d74069908` | 2026-08-14 | Paula Ann | `a4ce8576-0eb3-4e01-9199-0a621198adec` | `06c8fb91-59f6-4180-b97b-fbc2acd4322a` | 21:00 (defaulted) |
| `3135a632-7cad-44d5-8d32-836d3a43051e` | 2026-08-14 | Evolution | `eJ3aDOC7ByrKZ36foVL9` | `f54d4cbe-e6f1-4bb0-9c9d-03c6c9d78470` | 21:00 (defaulted) |
| `ed20f36b-d00a-41f0-b990-0fa25615815a` | 2026-08-14 | Paul Waldron | `102a2613-9e16-49c2-b49e-f0c095afdd1e` | `EsXfxgxJTFkuRvaRLpS7` | 20:00 (source: 8pm) |
| `007ea6c9-3af2-4280-ac11-c78895a62037` | 2026-08-15 | Soulplay | `L2R6qpDMjMQYSln8gKjZ` | `5399d41a-10a9-4064-b971-774fd096fdaf` | 21:00 (defaulted) |
| `43d1f46b-2d3e-42eb-989f-8b7681fb621e` | 2026-08-15 | Rise Of Kain | `444a660d-6441-406c-88a1-40ea1638bddd` | `qCk6zjFPCmz1E6I4G9oz` | 21:00 (defaulted) |

### week view, artists created or enriched this run

| Event id | Date | Artist | Artist id | Venue id | Time |
|---|---|---|---|---|---|
| `8347ffde-fc3d-45c4-8c33-a2f94aa1ac57` | 2026-08-12 | Last Race Home | `4310cb35-633a-4590-885a-ffeaafb1ccb7` | `yO2hHYD6a41h48HDHqh1` | 20:00 (defaulted, Wed) |
| `70c422ec-6531-4508-b977-c27d6fad6c14` | 2026-08-13 | Sin City | `72cd0163-8670-4947-b670-457dbf1aa0fe` | `FXQKvDaexNQj53yl4icf` | 20:00 (defaulted, Thu) |
| `eeeb1b81-16e7-40be-8e72-9dbfd30f7482` | 2026-08-13 | Tony Auton Band | `rT16iLy3u64bhZadG7SR` | `1efc325d-207c-4883-a18d-ff38a928df84` | 20:00 (defaulted, Thu) |
| `76ed584b-b8a3-4475-b4cf-286db83c4e2f` | 2026-08-14 | Anywhere But There | `6c515b4c-f897-4044-92d2-c92f2558e0b5` | `KPuQOU8ZZipCyYgxX4iS` | 21:00 (defaulted) |
| `2d92204f-a3f2-48e5-ab67-342376711f83` | 2026-08-15 | Amber Star | `4d6ebf05-baea-49cb-872e-52b30f2e3905` | `18a2916a-59d1-4375-ad4d-1fa99e3a9dd8` | 21:00 (defaulted) |
| `bc0360dc-285b-4826-9e4b-f6932929f132` | 2026-08-15 | On The Run | `8e0d59d1-7f7a-4c23-b0f2-8fb7910db5c8` | `KPuQOU8ZZipCyYgxX4iS` | 21:00 (defaulted) |
| `c94caefe-667a-4b4a-8f67-5bb253f9b053` | 2026-08-15 | The Driscols | `ZpnSVBlNOIhQP6Jkl5lj` | `QWIBLMGTJIqiGnkk1kvU` | 21:00 (defaulted) |
| `6fa2aa0a-f95b-49fa-a728-1c2da86927fb` | 2026-08-15 | Gemma Christina | `11895a97-00d2-415d-a0c9-a219676c20c2` | `TdrtliunWD8ENVM9WGyg` | 21:00 (defaulted) |
| `d24b1308-8ccf-4161-9d59-20af1f1e3b26` | 2026-08-16 | Ashley Sherlock | `30bb2d99-cabe-4c49-b9d6-19099071d593` | `18a2916a-59d1-4375-ad4d-1fa99e3a9dd8` | 17:00 (source: 5pm) |
| `05546a60-8b69-464c-b774-0fa1b1a978b0` | 2026-08-16 | The Cover Babes | `191953ca-0481-440d-9730-5917b70b7951` | `lwlZ1VKJskevDmYlc8V6` | 17:00 (source: 5pm) |

**Every one of the 20 was read back with `search_event` (§0.10).** All 20 carry a `gigs-news` externalId in the §6D slug form.

**Defaulted times: 14.** All are §5.6 day defaults. Six carry a source time.

## 7. Artists created

| Artist id | Name | Type | Location | Facebook | Bio |
|---|---|---|---|---|---|
| `4310cb35-633a-4590-885a-ffeaafb1ccb7` | Last Race Home | band | Manchester (city) | `facebook.com/lastracehome` | quoted |
| `72cd0163-8670-4947-b670-457dbf1aa0fe` | Sin City | band | Greater Manchester UK (regional) | evidenced blank | empty |
| `6c515b4c-f897-4044-92d2-c92f2558e0b5` | Anywhere But There | band | Newton-le-Willows (city) | `profile.php?id=61564853652513` | quoted |
| `4d6ebf05-baea-49cb-872e-52b30f2e3905` | Amber Star | solo | Greater Manchester UK (regional) | evidenced blank | empty |
| `8e0d59d1-7f7a-4c23-b0f2-8fb7910db5c8` | On The Run | band | Manchester (city) | `facebook.com/OntheRunManchester` | quoted |
| `11895a97-00d2-415d-a0c9-a219676c20c2` | Gemma Christina | solo | Buxton (city) | evidenced blank | empty |
| `30bb2d99-cabe-4c49-b9d6-19099071d593` | Ashley Sherlock | solo | Manchester (city) | `facebook.com/Ashleysherlockmusic` | empty (page carries no bio) |
| `191953ca-0481-440d-9730-5917b70b7951` | The Cover Babes | duo | Manchester (city) | `profile.php?id=61586420956106` | quoted |

Every regional location carries `locationType: regional` (§6B Kilmarnock trap), verified on read-back.

## 8. Artists matched, then topped up (§2A.2)

- **`rT16iLy3u64bhZadG7SR` Tony Auton Band.** `create_artist` matched on normalised name at confidence 1. My own `search_artist("Tony Auton")` at minConfidence 70 had missed it — the name distance is 67%. The stored record already held the same Facebook page, which confirms identity. Added: artistType `band`, genres Rock n Roll / Blues / Rock, actType `originals`, bio `rock n roll band` (quoted), website `tonyauton.com`.
- **`ZpnSVBlNOIhQP6Jkl5lj` The Driscols.** Matched on normalised name. Added: artistType `band`, genres Pop / Rock / Motown / Disco / 80s, actType `covers`, website, and the `gigs-news` externalId. Their own page confirms `Sat 15 Aug - Poynton WMC`, the exact row imported.

**Lesson for the next run: a `search_artist` miss is not evidence the artist is absent.** Both records existed. `create_artist` found both. This is the artist-side twin of §3's `search_venue` rule.

## 9. Gate bounces, verbatim

1. `DUPLICATE_EVENT` — "This artist already has an event at this venue on 2026-08-14." Riff Raff @ Jubilee Club. Existing `72d58d2f-baf9-4133-9313-beee1db58bff`.
2. `DUPLICATE_EVENT` — same message, 2026-08-14. Blind Tiger @ The Crown Inn Bredbury. Existing `b8f2780b-01ce-42bc-b686-4c75de154626`.
3. `DUPLICATE_EVENT` — same message, 2026-08-15. the Mixtape Biros @ The Crown Inn Stockport. Existing `b5fcf0b0-24e2-4139-8070-3e0e5d7ffb8f`.
4. `HTTP 409: Duplicate artist` on `edit_artist(ZpnSVBlNOIhQP6Jkl5lj, nameVariants: ["the Driscols","The Driscolls"])`. The same call without `nameVariants` succeeded. Raised as `edit-artist-409-namevariants`.

All three duplicate events hold `externalIds: []`. They were written by an earlier run with no provenance. This run did not repair them, because `edit_event(externalIds)` replaces the array and §0.11 forbids incidental repair inside an import. It belongs with the open `externalid-slug-drift` item.

## 10. Venue resolution

18 venues resolved, 0 created. Three needed the §3 fallback ladder:

- `Coach & Horses Oldham` — `search_venue("Coach & Horses","Oldham")` returned nothing. The single-word probe `Coach` returned **The Coach and Horses**, `1efc325d-207c-4883-a18d-ff38a928df84`, at 25% low confidence, already carrying a `gigs-news-uk` externalId. `and` against `&` defeated the search.
- `Bike n Hound Hyde` — `search_venue` returned nothing. `list_venues(city:"Hyde")` returned **Bike 'N' Hound**, `qCk6zjFPCmz1E6I4G9oz`. Sixth confirmed apostrophe case. Already logged as `search-venue-apostrophe`; not re-raised.
- `Poynton Workmens Club` — all three probes missed. `create_venue` returned `isNew: false`, `matchMethod: google_place_id`, **Poynton Workmen's Club** `QWIBLMGTJIqiGnkk1kvU`. The apostrophe again. The backend place_id gate is what prevented a duplicate, not the search.

Postcodes were checked against the expected county for every new-to-this-run venue (§0.24). Whittles OL1 1EA and Queens Arms SK13 7RZ both agree with the source.

## 11. Rows skipped

**Reject filter, 61 rows.** Open mics (9), karaoke and karaoke/disco (5), themed nights with no performer — Jazz Night, Jazz at the Railway, Rocking 60s (3), generic `live bands` at Spinning Top (5), blank act rows of the form `- «Venue»` (30), time-only rows such as `10pm - Mash Guru` and `8pm - Dog & Partridge Great Moor` (6), `next week - Stockport Rock & Roll Society` with no act (1), `branded - looking for a venue/cancellation` (3 rows plus the forward-list row for 14/15 August — not a gig, per the spec).

**Source event_skips list, 1 row.** `Backwater Blues Jam - the Railway Greenfield`, reason `manual_skip`.

**Explicit cancellation, 1 row.** `Sunday 20th September - Cheshire Cheese Newton SK14 4BH 5pm - Reserved (cancelled - United match)`. Never imported. Correctly absent from bndy.

**Two rows skipped needing a decision. The next run retries both.**

1. `Dave Legg - the Wellington pub Stockport`, 2026-08-15. The evidence says DJ, not a live act: Instagram `offertondjs`, billed as "DJ Dave Legg" with Knights Of Disco, hosting a Motown and Northern Soul night at The Navigation Marple. §6 rejects DJ sets. Venue would be `ffAHL9Hg3JsTWU36Kbiq`.
2. `Charlotte - Cher tribute - the Crown Heaton Moor`, 2026-08-15. The strongest candidate is the Facebook page "A Little Cher Tribute - Charlotte Olivia", a North West Cher tribute, which fits. But the performer's surname is given as **Shepherd** on one page and **Berry** on another, and the act name appears as both "A Little Cher" and the full page title. The source supplies only "Charlotte". §0.5 forbids an invented name and §0.6 forbids using the billing. The name cannot be settled from the evidence, so the row was skipped rather than guessed.

## 12. Validator (§6A step 8)

```
python3 scripts/enrichment_validate.py \
  --records gigs-news-records-2026-08-12.json \
  --evidence data/state/enrichment-evidence-2026-08-12-gigs-news.jsonl

10 records · 7 clean · 0 FAIL · 3 WARN   [mode=gate]   exit 0
```

The three WARNs, and why each stands:

- `NAME_BILLING: format tail on the name: 'Tony Auton Band'` — the record predates this run and is the act's own name. §2A.1 item 7 says a trailing `Band` is not evidence of a defect. No change.
- `STUB_NO_BIO` on **The Driscols** — the page's about text is a gig diary, not a bio. Copying it would put a decaying list on a public profile. Bio left empty deliberately.
- `STUB_NO_BIO` on **Ashley Sherlock** — the page's about text is only the website URL. Nothing to quote.

Evidence file: `data/state/enrichment-evidence-2026-08-12-gigs-news.jsonl`, 12 records, written before every bndy write.

## 13. Tool notes

- `record_run` was not called. `SOURCE_RUNS_TOKEN` is still unset. Already logged as `record-run-token-missing`; not re-raised. `run-summary.jsonl` was appended normally.
- `javascript_tool` output guards were hit twice: the `=` block on Facebook `profile.php?id=` hrefs, worked around with the `(eq)` convention and by extracting the numeric id alone; and the ~1.4 KB truncation when paging the branded.htm innerText. Neither is a source fault (§6B).
- `get_page_text` returned nothing on three Facebook pages that rendered fine through `javascript_tool` reading `document.body.innerText`. Use the JS route for Facebook act pages.
- Two Facebook page searches were useless and Google settled both: `tony auton` autocorrected to "ashton" and returned nothing relevant; `sin city band` returned only same-name acts from Seattle, New Zealand, Dundee, Brighton and Leicester. §2A.1 item 3b holds — both surfaces, every time.

## 14. Raised to CTO-INBOX

- `gigs-news-mode-undeclared` (RULE)
- `duplicate-driscols-driscolls` (DATA)
- `edit-artist-409-namevariants` (DEFECT)

Nothing else was raised. Every other candidate already has a fingerprint in the file.
