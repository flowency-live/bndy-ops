# gigs-news — scheduled run 2026-08-27

- **Run id**: `gigs-news-2026-08-27T12-23-59Z`
- **Runbook read**: `RUNBOOK.md` H1 **v2.27**, in full. Floor in §6A is **v2.19**. Assertion PASSES.
- **Prompt floor**: the task prompt states no number. §6A step 2a is the gate.
- **Spec read**: `sources/gigs-news-uk.md`, in full.
- **Inbox read**: `CTO-INBOX.md`, in full, before any item was considered.
- **Claim**: `data/state/claims/gigs-news.json`, acquired 12:24:30Z, TTL 90 minutes. The previous holder (`gigs-news-2026-08-21T04-07-30Z`) released cleanly at 2026-08-21T04:23:00Z. No takeover.
- **Heartbeat**: `data/state/heartbeat/gigs-news-2026-08-27T12-23-59Z.json`.
- **Outcome**: COMPLETED. The page rolled to a new week. Every importable row of that week is already in bndy. Zero writes were needed. One row is unimportable.
- **Gap since the last run**: six days. No task fired for this source between 2026-08-21T04:23Z and this run.

## 1. Counts

| Measure | Count |
|---|---|
| Events created | 0 |
| Events edited | 0 |
| Artists created | 0 |
| Venues created | 0 |
| Records created with a verified page | 0 |
| Records created with an evidenced blank | 0 |
| Importable rows confirmed present in bndy | 33 |
| Importable rows found absent and written | 0 |
| Rows skipped — no resolvable venue | 1 |
| Rows skipped — past-dated (§0.14) | 1 |
| Rows rejected by the §0 filter and the spec reject list | 53 |
| Gate bounces (409 DUPLICATE_EVENT) | 6 |
| Creates against the 50 cap | 0 |
| Validator | 0 records · 0 clean · 0 FAIL · 0 WARN, exit 0 |

No artist was created, so no enrichment decision arose and no evidence line was written.

## 2. Capture

Chrome connected on the first `tabs_context_mcp` call. Both pages were read through Chrome per the spec. No web fetch was used.

| URL | Method | Result |
|---|---|---|
| `https://www.gigs-news.uk/` | Chrome, DOM walk over leaf `center`/`p`/`td`/`div` nodes reading `a[href]` (§0.22) | 111 nodes, 96 snapshot lines |
| `https://www.gigs-news.uk/branded.htm` | Chrome, `innerText` | 415 lines, forward list at 21–48 |

Raw capture: `data/raw/gigs-news-uk/2026-08-27/week-view-rows.txt` and `branded-forward-list.txt`. Every venue href was read from the anchor. No row came from a text dump.

`javascript_tool` guard 1 fired as documented: any returned string containing `=` is blocked. Venue hrefs of the `profile.php?id=…` form were transformed to `(eq)` on return and are stored that way in the raw file. Guard 3 also fired: output truncates near 1.4 KB, so the rows were returned in eight slices. Neither is a source fault (§6B).

## 3. Horizon and the branded.htm forward list

The forward list is the header `gigs 2026` at `innerText` line 21 plus the **27 dated rows** at lines 22–48. Line 49 begins the set-list prose. The next header, `Gigs 2026` at line 165, opens the archive; further archive headers sit at 204, 271, 328 and 370. All are excluded.

All three safeguards held: ordinal position, the lowercase/capitalised header distinction, and the day-name-against-date cross-check.

Six forward rows are past-dated (1 Aug to 22 Aug) and were not considered. The 21 future rows run 28 August to 31 December, inside the 12-month horizon.

## 4. Diff (§5.7)

Mode: the spec declares neither `delta` nor `append-only`. Already open as `gigs-news-mode-undeclared` (2026-08-12). The run defaulted to **append-only** and removed nothing.

- **Section 1 (week view)**: the page rolled from `What's on This Week 19 - 23 August` to `26 - 30 August`. 55 lines added, 54 lines removed.
- **Section 2 (branded forward list)**: **0 added, 0 removed**. The list is byte-identical to the stored snapshot after normalisation.
- **§5.7(a) self-diff gate**: the new snapshot re-diffed against the capture it was written from returns **0 added / 0 removed**, 124 lines against 124.

**No future-dated named row disappeared.** Every removed line belongs to a `19 - 23 August` day header, so its date has passed. §5.7 states plainly that a row disappearing because its date passed is not a cancellation. No §0.17 decision arose under either mode.

Normalisation applied to both sides, and recorded in the snapshot header: whitespace runs collapsed to one space; every line trimmed; trailing comma, full stop or slash stripped; HTML entities decoded once; empty lines removed.

## 5. Coverage — 33 of 34 importable rows already in bndy

The run tested every importable row against bndy. Six were tested by `create_event`, which bounced `DUPLICATE_EVENT` each time (§0.9 — a bounce is a match signal, not an error). The remainder were tested by `search_event` on the venue id, which is one call for two or three rows.

| Date | Row | bndy event |
|---|---|---|
| 2026-08-27 | Roy Pimmy @ The White Hart | `d972a92b-b064-449d-bd26-a0800c46c5b3` |
| 2026-08-27 | Mandy's Angels @ Welcome Inn | `a476706f-2908-48ad-86b5-975563ed9e73` |
| 2026-08-28 | branded @ Jubilee Club | `788c7a4c-4440-4b2e-90bf-13569a0031ed` |
| 2026-08-28 | Blind Tiger @ Arden Arms | `9f1e0b1c-85df-479c-96e0-882e573dfc51` |
| 2026-08-28 | Jackson Kay Band @ The Acoustic Lounge | `ce5ec50a-8647-402e-b65b-0e22a8a69f95` |
| 2026-08-28 | Over the Moon @ The Swan Inn | `87507952-009d-4490-a866-a4edcb1c1bc0` |
| 2026-08-28 | Hold the Line @ Queen's Hotel | `8bbc4d72-7ae5-4b59-aaaa-88bb7789e521` |
| 2026-08-28 | the Reform @ The Crown | `d8c7ddae-5d0a-42e8-8eb4-aab1fdb6419b` |
| 2026-08-28 | Salford Angels @ The Railway | `9ab0a413-e6db-4464-b22a-29c7af0ec775` |
| 2026-08-28 | Burke N Hoff @ The Musketeer | `9e424360-39e6-4699-976c-6470fd11af5d` |
| 2026-08-28 | The Driscols @ The Crown Inn Bredbury | `2563a7bb-a729-40e0-afa7-ed84c54f2513` |
| 2026-08-28 | Northside Brothers of Soul @ Marple Con Club | `05bef8b4-9970-4d6f-86e9-a12bb4190ece` |
| 2026-08-28 | Reservoir Dads @ The Crown Inn Stockport | `8dba8498-a76d-4046-924d-467eb2db0388` |
| 2026-08-28 | Paul Waldron @ The Moor Club | `a2ca2f67-a3ee-4085-a3dd-422b50ff6cff` |
| 2026-08-29 | Ginger & the Ninjas @ The Acoustic Lounge | `6b25e8fd-ad11-44e8-bf1a-18998c42b3cf` |
| 2026-08-29 | Bridgewater Blues @ Arden Arms | `14033f9d-c018-4d61-918c-abf28a53670a` |
| 2026-08-29 | Adelphi Fusion @ The Crown | `ea77d4c9-49e7-4a6c-8194-e367b80182e2` |
| 2026-08-29 | Tee @ Cheshire Cheese | `9fc440f0-8585-4536-b249-4450c4e588c6` |
| 2026-08-29 | The Randomers @ Kings Arms Wilmslow | `57f3acaf-5042-45c1-95d4-b4131891e228` |
| 2026-08-29 | Bad Mother Covers @ Queen's Hotel | `cc6bf71e-e7ec-4f16-8ec7-2b3241c0292c` |
| 2026-08-29 | Dream On @ Whittles@tokyo | `510a91ca-0481-4871-960b-f10ad58e6fd2` |
| 2026-08-29 | Sinnertwin @ The Musketeer | `4b473a33-c4f1-41e9-8bf9-faefd2ed562f` |
| 2026-08-29 | Andy Preston & Co @ The Crown Inn Stockport | `e513fe80-a531-429d-9508-4de25da9bf94` |
| 2026-08-29 | Electric Landlady @ Marple Con Club | `5cce2edd-a784-4372-adef-3b8fade248dd` |
| 2026-08-29 | the Tall Faces @ The Wellington | `b331686d-a287-4499-92a7-9c36df52e054` |
| 2026-08-29 | Greg Davies @ The New Inn Chapel | `b2ba5c8c-e7b3-4635-9ced-587f057e7f05` |
| 2026-08-29 | The Select Committee @ Townhouse Oswestry | `dd8afd7e-b111-4336-a0af-993b7ad520b5` |
| 2026-08-29 | Bak Trax @ Poynton Workmen's Club | `2ccf64b7-8047-4c93-aca0-e1508b7a2930` |
| 2026-08-29 | Lee Wainwright @ Buxton Working Men's Club | `63b4c2f5-c09f-43f4-9132-a7596b769f35` |
| 2026-08-30 | Devil Hound Blues @ The Railway | `bf33bac9-ff47-45b1-a468-5ed3c7a0c302` |
| 2026-08-30 | Manic @ Cheshire Cheese | `301e37d2-18a2-44ea-b1c1-a778e14d075b` |
| 2026-08-30 | Nick Milner Band @ The Acoustic Lounge | `ae0b8656-381d-444d-91e1-419186076768` |

The whole forward list is present too. `search_event` on artist **branded** `rwDw320gku5uQ4gzaU2N` for 2026-09-01 to 2027-01-31 returned **20 events, one per forward row, each carrying a `gigs-news` externalId** in the §6D slug form. With the 28 August row above, that is 21 of 21 future forward rows.

## 6. The one row this run did not write

`9th Sept Off the Record - Stockport Rock & Roll Society` is a §Future-date-prefix row. The date parses to **2026-09-09** and the act resolves: **Off the Record** `ZBsvczPpYGAHbDdcHFfJ`, Stockport, holds no September event.

**The venue blocks it.** `Stockport Rock & Roll Society` is not in bndy. Three probes all missed: `search_venue("Rock and Roll Society","Stockport")`, `search_venue("Society","Stockport")`, and `list_venues(city:"Poynton")` for the adjacent case. The source publishes only a Facebook **group** link, `facebook.com/groups/1968976253154349`, and no address and no postcode. §0.8 forbids guessing a town or address to obtain a Google Place ID, so the venue cannot be created and the event cannot exist without it (§1: the event UID is venue, artist, date).

The row is skipped, not staged. The same row has now been skipped by three consecutive runs, so it is raised to the inbox once, as `gigs-news-rock-n-roll-society-no-address`.

## 7. Rejections — 53 rows, by class

| Class | Count | Examples |
|---|---|---|
| Blank act (venue only) | 21 | `- the Stock Dove Romiley`, `- Hare & Hounds New Mills` |
| Time-only row | 8 | `10pm - Mash Guru Macclesfield`, `8pm - Dog & Partridge Great Moor` |
| Open mic | 7 | `Karl Magee's Open Mic`, `Between the Vines Open Mic 7pm` |
| Karaoke, disco | 6 | `karaoke/disco - the Dog Inn Chadderton` |
| Generic live bands | 5 | `Bands - Spinning Top`, `live bands 4pm - Spinning Top` |
| Jam or themed night | 5 | `Backwater Blues Jam`, `Jazz Night`, `Jazz at the Railway` |
| DJ only | 1 | `DJ Martin 7pm- the Steelworks Bredbury` |

`Backwater Blues Jam` and `Loose Change Jazz Night` are named in the spec's `event_skips`. `Jazz at the Railway` is a standing skip in the spec. **`Tony Auton band Jam - Coach & Horses Oldham` was rejected as a jam.** The spec is self-contradictory here: its 2026-05-01 calibration says a named-host jam imports with the host as the artist, and the later canonical operating rules reject jams outright. The later rules win (§7 change control). This is recorded here rather than in the inbox, because the row is one weekly gig and the rule is already decided.

Past-dated, skipped under §0.14: `Bite the Dust - Eagle & Child Whitefield`, Wednesday 26 August. The page rolls on a Wednesday, so the Wednesday block is already gone by the time a Thursday run reads it. The other six Wednesday rows are rejects in any case.

## 8. A second writer is importing this source under a different namespace

Every week-view event listed in §5 exists, and **none of them carries a `gigs-news` externalId** — their `externalIds` arrays are empty. The venue and artist records tell the story: they carry ids from a source named **`gigs-news-daily-import`**, for example venue `The White Hart` `6de33e51-114e-47b8-92d3-abccb4fe6bf6` holds both `gigs-news-uk:venue-thewhitehartwoodley` and `gigs-news-daily-import:venue_white-hart-woodley`, and artist `The Select Committee` `PNJ6TclgY1pH26h2orEa` holds `gigs-news-uk:artist-the-select-committee` and `gigs-news-daily-import:artist_the-select-committee`.

§6D fixes one namespace for this source, `gigs-news`. A second daily writer under a second namespace means the events it creates cannot be matched by this task's externalId at all — only the artist, venue and date sentinel catches them, which it did, six times, cleanly. **Nothing was written wrongly and no duplicate was created.** The cost is provenance, not data. It is the same class as `otcm-daily-import-legacy-namespace` and it is raised once, as `gigs-news-daily-import-second-namespace`.

This run did not back-fill the missing `gigs-news` ids onto those 33 events. That is about 66 tool calls against a 90-minute claim, and §6B warns that `edit_event(externalIds)` replaces the array, so each one needs a `get_by_id` first. It is a clean, mechanical job for a session with a budget for it.

## 9. Two records that need a human

**`Mandy's Angels` and `Mandy Montgomery's Angels` look like one act, twice.** `7848ef89-3614-4ace-aabf-c73975218041` is `Mandy's Angels`, Greater Manchester UK, no socials. `9242d30f-f1a6-403c-99e2-7ea7584e8ae6` is `Mandy Montgomery's Angels`, Stockport, with a Facebook page `graph.facebook.com/147140105917750`. The source billed `Mongomery's Angels` last week and `Mandy's Angels` this week, which is §1A.5 billing drift on one act. The two names normalise differently, so no sentinel can see the pair.

This run used the exact-name record `7848ef89` for the 27 August event, which is the mechanical answer. It did not merge anything: §0.11 forbids a merge inside an import run. Raised as `duplicate-mandys-angels-montgomery`.

**Event titles that hold a venue name instead of an act.** Six live events name `The Select Committee` `PNJ6TclgY1pH26h2orEa` as the artist but are titled `The Crown, Heaton Moor`, `Acoustic Lounge, Poynton`, `The Swan, Wilmslow`, `Marple Con Club, Marple`, `The Queens, Macclesfield` and `Townhouse, Oswestry`. The artist link is right and the venue link is right; only the title is wrong, and it renders publicly. §5.2 requires the form `«Artist» @ «Venue»`. Not corrected here — the records belong to another writer's import and the fix is a title sweep, not an import decision. Recorded here rather than in the inbox, because it is cosmetic and no rule is missing.

## 10. Two source oddities, neither actioned

**The `Cheshire Cheese` postcode disagrees.** The forward list publishes `SK14 4BH`. The bndy venue `18a2916a-59d1-4375-ad4d-1fa99e3a9dd8` holds `Hyde Rd, Newton, Hyde SK14 4LE`. Both are Newton, Hyde, and both sit inside the expected county, so §0.24 is satisfied and the place_id decides (§1). No edit was made.

**The home page's sponsorship block still carries `(cancelled - United match)`** immediately before the `Saturday 26th September - the Billy Goat Mossley` row, exactly as the 2026-08-21 run recorded. `branded.htm` carries no cancellation on that row, and `branded.htm` is the authority for the forward list, so the live event `0801a98f-5fec-4f30-89d9-71ac5862bebd` was left alone. This is now the second week the marker has persisted. If it appears on `branded.htm`, it becomes a §5.4 explicit cancellation.

## 11. Contract steps

- `cancellations.jsonl` was read before any create was attempted. It holds six lines. None matches any artist, venue and date in this capture (§5.4 v2.19).
- `run-summary.jsonl` and today's report directories were read first. One other task holds a claim today, `klma-stoke-gig-list` at 12:22:00Z. It is a different source and a different lane. No run has ruled on any gig in this capture today (§5.4 v2.19).
- Snapshot written to `data/state/gigs-news-uk-last-page.txt`, 127 lines, with its normalisation rules in the header.
- Validator run on an empty record set: `0 records · 0 clean · 0 FAIL · 0 WARN`, exit 0.
- Daily note appended.
- Claim released as the last action.

## 12. Honest read of this run

The source published a full new week and bndy already held all 33 importable gigs before this run started. That is a genuine no-change result and it is what §6 asks a run to report rather than manufacture activity around. It is also the second signal in two weeks that a second, unclaimed importer is servicing this source ahead of the scheduled task. If that writer is intended, this task's job narrows to provenance, the forward list and the reject discipline. If it is not intended, it is writing events with no externalIds every day. Either way it is Jason's call, and it is in the inbox.
