# gigs-news — scheduled run 2026-08-28

- **Run id**: `gigs-news-2026-08-28T04-07-03Z`
- **Runbook read**: `RUNBOOK.md` H1 **v2.27**, in full. Floor in §6A is **v2.19**. Assertion PASSES.
- **Prompt floor**: the task prompt states no number. §6A step 2a is the gate.
- **Spec read**: `sources/gigs-news-uk.md`, in full.
- **Inbox read**: `CTO-INBOX.md`, in full, before any item was considered.
- **Claim**: `data/state/claims/gigs-news.json`, acquired 04:07:03Z, TTL 90 minutes. The previous holder (`gigs-news-2026-08-27T12-23-59Z`) released cleanly at 2026-08-27T13:08:00Z. `heldBy` was null. No takeover.
- **Heartbeat**: `data/state/heartbeat/gigs-news-2026-08-28T04-07-03Z.json`.
- **Outcome**: COMPLETED. The page did not roll. The curator filled in twelve act names that were blank a day ago. Eleven of those gigs were already in bndy. One was written.
- **Gap since the last run**: 15 hours 44 minutes.

## 1. Counts

| Measure | Count |
|---|---|
| Events created | 1 |
| Events edited (provenance back-fill) | 11 |
| Artists created | 0 |
| Artists enriched (top-up) | 1 |
| Venues created | 1 |
| Records created with a verified page | 1 venue (`Society by Whittles`, own Facebook + own Instagram + CAMRA + Oldham Times) |
| Records created with an evidenced blank | 0 |
| Records staged | 0 |
| Names sanitised or skipped as non-acts under §0.6 | 0 sanitised; 53 rows rejected (§7 below) |
| Importable rows confirmed already present in bndy | 44 |
| Rows skipped — no resolvable venue | 1 |
| Rows skipped — past-dated (§0.14) | 7 (the Wednesday block) |
| Gate bounces (409/422) | 0 |
| Creates against the 50 cap | 1 |
| Validator | 1 record · 1 clean · **0 FAIL** · 0 WARN, exit 0 |

## 2. Capture

Chrome connected on the first `tabs_context_mcp` call. Both pages were read through Chrome per the spec. No web fetch was used.

| URL | Method | Result |
|---|---|---|
| `https://www.gigs-news.uk/` | Chrome, DOM walk over leaf block nodes reading `a[href]` (§0.22) | 119 blocks, 99 week-view snapshot lines |
| `https://www.gigs-news.uk/branded.htm` | Chrome, `innerText` | 415 lines, forward list at 21–48 |

Raw capture: `data/raw/gigs-news-uk/2026-08-28/capture-normalised.txt`. Every venue href was read from the anchor. No row came from a text dump.

`javascript_tool` guard 1 fired as documented: any returned string containing `=` is blocked, which hits the `profile.php?id=…` venue hrefs. They were transformed to `(eq)` on return and reversed on this side. Guard 3 also fired: output truncates near 1.4 KB, so the rows were returned in nine slices. Neither is a source fault (§6B).

## 3. Horizon and the branded.htm forward list

The forward list is the header `gigs 2026` at `innerText` line 21 plus the **27 dated rows** at lines 22–48. Line 49 begins the set-list prose. The next header, `Gigs 2026` at line 165, opens the archive; further archive headers sit at 204, 271, 328 and 370. All are excluded.

All three safeguards held: ordinal position, the lowercase-against-capitalised header distinction, and the day-name-against-date cross-check.

Seven forward rows are past-dated (1 August to 22 August). The 28 August row is today and is live in bndy as `788c7a4c-4440-4b2e-90bf-13569a0031ed`. The remaining 20 future rows run 5 September to 31 December, inside the 12-month horizon, and the 2026-08-27 run verified all of them present against artist **branded** `rwDw320gku5uQ4gzaU2N`. Section 2 is unchanged since that run, so no forward row needed re-testing.

## 4. Diff (§5.7)

Mode: the spec declares neither `delta` nor `append-only`. Already open as `gigs-news-mode-undeclared` (2026-08-12). The run defaulted to **append-only** and removed nothing. §0.29 names gigs-news as delta-qualifying on evidence, and the evidence below would satisfy it, but the spec is what declares the mode and it declares none.

- **Section 1 (week view)**: the page still reads `What's on This Week 26 - 30 August`. **12 lines added, 9 lines removed.**
- **Section 2 (branded forward list)**: **0 added, 0 removed.** Byte-identical to the stored snapshot after normalisation.
- **§5.7(a) self-diff gate**: the new snapshot re-diffed against the capture it was written from returns **0 added / 0 removed**, 127 lines against 127. PASS. Artefact: `data/raw/gigs-news-uk/2026-08-28/selfdiff.txt`.

**Every removed line is a blank-act or time-only row that the curator has now named.** Nine removals, and each has a matching addition at the same venue on the same date:

| removed | added |
|---|---|
| `- the Stock Dove Romiley` | `Evolution - the Stock Dove Romiley` |
| `- Whittles Oldham` | `Tom Meighan Raw26 - Whittles Oldham` |
| `- Society by Whittles Oldham` | `Marshall Gill - Society by Whittles Oldham` |
| `- the Dog Inn Chadderton` | `Collette - the Dog Inn Chadderton` |
| `- Bulls Head High Lane` | `Jack Warhurst - Bulls Head High Lane` |
| `- Hare & Hounds New Mills` | `Grand Volume - Hare & Hounds New Mills` |
| `karaoke - Coach & Horses Oldham` (Sat) | `Agents of Chaos - Coach & Horses Oldham` |
| `6pm - the Dog Inn Chadderton` | `Joe McShane 6pm - the Dog Inn Chadderton` |
| `8pm - Coach & Horses Oldham` | `Preston & Weltz 8pm - Coach & Horses Oldham` |

Three further additions have no counterpart removal — they are new rows: `Nothing Like Pressure - White Hart Woodley`, `Northside Brothers of Soul - the Whitehouse Stalybridge`, `Off the Record 2pm - the Stock Dove Romiley`.

**No named future-dated row disappeared.** No §0.17 decision arose under either mode.

## 5. The one event written

**`Marshall Gill @ Society by Whittles`** — event `2b0fc6a5-e118-4729-a334-ae31c68ba35b`, 2026-08-28, 21:00, `isPublic: true`, externalId `{gigs-news, 2026-08-28-marshall-gill-society-by-whittles}`. Verified by `get_by_id`.

- **Artist**: existing record **Marshall Gill** `3cebcd73-7e4f-408a-8e4e-80c6b7cbcadd`, `search_artist` 100% of 3282 scanned, location Oldham. It already carried `{gigs-news, gn-artist-marshall-gill}`. Reused, not created.
- **Time**: **DEFAULTED.** The source gives no time. `startTime` was omitted and the server applied §5.6 Friday 21:00, returning `startTimeDefaulted: true`.
- **Venue**: new, see §6.

## 6. The new venue, and a stale Google Place name

`Society by Whittles Oldham` is not in bndy. §3's three probes all missed: `search_venue("Society","Oldham")` — 0 rows scanned; `search_venue("Society by Whittles","Oldham")` — 0; `list_venues(city:"Oldham")` — 12 venues read by eye, none of them it. It is a genuinely new venue, opened this year.

**Address, evidenced, not guessed (§0.8).** Four independent sources give the same address: the venue's own Facebook page (*"Society, 72 High Street, Lees"*), its own Instagram `society_by_whittles` (*"Society, 72 High Street, Lees, Oldham"*), CAMRA (*"From the team behind Whittles, Society by Whittles is a new social space coming to the heart of Lees"*), and the Oldham Times, 30 April 2026 (*"We've taken on a second venue over in Lees, right in the middle of the high street... the spot, which will be called Society"*).

`create_venue` geocoded 72 High St, Lees, Oldham and returned **`OL4 5AA`**, place_id `ChIJ02fHjBO3e0gRZBXtDc18n2c` — Lees, Oldham, so §0.24 is satisfied. **Google's place name is stale: it returned `The Venue Lees`, the building's previous trading name.** §0.6 as extended at v2.26 governs exactly this: the place_id is the identity, so the record was renamed to the current trading name and the old name kept as a `nameVariant`.

- Venue `bdc57196-9e5e-4003-8f06-5226853b4433` — **Society by Whittles**, 72 High St, Lees, Oldham OL4 5AA, `nameVariants: ["The Venue Lees", "Society by Whittles Oldham", "Society"]`, Facebook `profile.php?id=61560712422582` (the anchor href on the source row), externalId `{gigs-news, venue-society-by-whittles-lees}`. Verified by `get_by_id`.

This is a create with a **verified page**, not an evidenced blank.

## 7. Eleven rows already in bndy — and the second writer again

Every other newly-named row was already live in bndy before this run started, created by the unclaimed `gigs-news-daily-import` writer. **All eleven carried empty `externalIds`.** They were found by `search_event` on the venue id, which is one call for two or three rows.

`edit_event(externalIds)` REPLACES the array (§6B), so each target was read first and confirmed empty. Nothing was overwritten. Provenance written:

| Date | Event | bndy event | externalId written |
|---|---|---|---|
| 2026-08-28 | Evolution @ Stock Dove | `6574233a-194b-4e82-a1fe-0a4db1a557b5` | `2026-08-28-evolution-stock-dove-romiley` |
| 2026-08-28 | Tom Meighan @ Whittles | `d140ab53-2205-483a-a91f-123f8f16bb84` | `2026-08-28-tom-meighan-whittles-oldham` |
| 2026-08-28 | Collette @ The Dog Inn | `5ca91566-3990-4a9f-ae1a-2823140131b7` | `2026-08-28-collette-dog-inn-chadderton` |
| 2026-08-28 | Nothing Like Pressure @ The White Hart | `6f8cb772-553e-4738-808a-a2e33614646b` | `2026-08-28-nothing-like-pressure-white-hart-woodley` |
| 2026-08-28 | Jack Warhurst @ The Bull's Head | `34b632f2-f7bf-4c3b-80e6-f4562ba72f74` | `2026-08-28-jack-warhurst-bulls-head-high-lane` |
| 2026-08-29 | Grand Volume @ Hare & Hounds | `98ae7fd8-86fb-417b-8151-018ce3700d8b` | `2026-08-29-grand-volume-hare-hounds-new-mills` |
| 2026-08-29 | Agents of Chaos @ The Coach and Horses | `afbde7cd-6a3b-41f0-a776-384189acc060` | `2026-08-29-agents-of-chaos-coach-horses-oldham` |
| 2026-08-29 | Northside Brothers of Soul @ The White House | `129e7703-329f-491e-86ec-1c0b46166126` | `2026-08-29-northside-brothers-of-soul-whitehouse-stalybridge` |
| 2026-08-30 | Off the Record @ Stock Dove | `66884b09-9026-44d8-9838-e025ea65fad5` | `2026-08-30-off-the-record-stock-dove-romiley` |
| 2026-08-30 | Joe McShane @ The Dog Inn | `2979ce18-8a48-4725-91cd-c0472b5a9cd2` | `2026-08-30-joe-mcshane-dog-inn-chadderton` |
| 2026-08-30 | Preston & Weltz @ The Coach and Horses | `00e880e5-e38b-4fbf-a1e1-e6fb8b2bf0c7` | `2026-08-30-preston-weltz-coach-horses-oldham` |

The 2026-08-27 run declined this back-fill on budget. Eleven records is a fraction of that job and this run had the budget, so it did the eleven it had just verified row by row. The other 33 events named in the 2026-08-27 report are still bare. `gigs-news-daily-import-second-namespace` is already in the inbox and is not raised again.

**The second writer's naming is sound where it can be checked.** It resolved `Tom Meighan Raw26` to the artist **Tom Meighan**, which is what §0.6 requires — `Raw26` is tour billing, not the act.

## 8. Two venue lookups that only the third probe found

Both are the §3 v2.16 failure mode, and both would have created a duplicate had the run stopped at `search_venue`.

- **`the Whitehouse Stalybridge`** — `search_venue("Whitehouse","Stalybridge")` returns *no venues found*, 0 rows scanned. The venue is `CwMkRsUa9JJDTjBgUSCu` **The White House**, 1 Water St, Stalybridge SK15 2AG, **already carrying `gigs-news-uk:venue-whitehousestalybridge`**. It surfaced only on `list_venues(city:"Stalybridge")`. The defeating character is a **space** in `White House`.
- **`Bulls Head High Lane`** — `search_venue("Bulls Head","High Lane")` and `search_venue("Bull's Head","High Lane")` both return nothing; `search_venue("Bulls Head","Stockport")` returns a **100% confidence match on the wrong pub** (`bc181c84-…`, Bulls Head, 23 Market St, **Marple**). `list_venues(city:"High Lane")` returns two venues, neither of them it. The correct record is `kDZuIhEoN0ZRyFQZgWVp` **The Bull's Head**, 28 Buxton Rd, High Lane, Stockport SK6 8BH, city stored as `Stockport`, name spelled with a **curly apostrophe**, and it already holds the source's own Facebook id `100036783085729`. It was reached through the artist's event history instead.

⚠ **The Marple hit is the dangerous one.** A 100% confidence result at a plausible name in a plausible town, and it is a different pub — §3.4 exactly. `search-venue-apostrophe` is already open in the inbox; these are the sixth and seventh instances of the same class and are recorded here, not raised again.

## 9. The one row this run did not write

`9th Sept Off the Record - Stockport Rock & Roll Society` is unchanged and still unwritable. The date parses to 2026-09-09 and the act resolves (**Off the Record** `ZBsvczPpYGAHbDdcHFfJ`), but the venue publishes no address and no postcode and only a Facebook **group** link, so §0.8 forbids the geocode and §1 forbids an event with no venue. Already in the inbox as `gigs-news-rock-n-roll-society-no-address` (2026-08-27). Not raised again.

## 10. Enrichment — one top-up, no creates

No artist was created, so §2A.5's create-time bar did not bind. **Marshall Gill** `3cebcd73-…` was topped up under §2A.2 because the run had touched it.

- Search, §2A.1 item 3c, two words plus one qualifier: `"Marshall Gill" musician` on Google.
- **Facebook: EVIDENCED BLANK.** The only Facebook surface is a **personal profile** (*"Marshall Gill is on Facebook. Join Facebook to connect with Marshall Gill... Singer/Guitarist at Blackballed"*). §2A.4 forbids linking a personal profile as the act page. Blank beats wrong.
- **Instagram attached**: `instagram.com/marshallgill_`, 1,411 followers, *"Singer/guitarist with…"*.
- **Identity evidenced, not assumed**: a Facebook image caption reads *"Higgis Band with Marshall Gill at The Railway Inn Greenfield 19/07/2026"*. The Railway Inn Greenfield is a gigs-news venue in this source's own patch — a footprint match per §2A.1, not a name match alone.
- **Genres**: `Rock`, inferred. Wikipedia: *"Blackballed are an English rock band from Manchester. Formed in 2012 by then-New Model Army guitarist Marshall Gill"*. Genres is the only field a run may infer (§2A.1 item 8).
- **`bio` left EMPTY.** No verbatim text from the act's own page was captured, so nothing could be quoted. §2A.1 item 8 admits no third option.
- **`actType` left EMPTY.** The evidence points at an originals background and a solo pub booking, and they disagree. §0.18 outranks the `["covers"]` default.
- **`locationType: "city"`** set on the existing `Oldham` value, per the §6B Kilmarnock trap.

Evidence written **before** the bndy write: `data/state/enrichment-evidence-2026-08-28-gigs-news.jsonl`, one line.

## 11. Rejections — 53 rows, by class

| Class | Count | Examples |
|---|---|---|
| Blank act (venue only) | 14 | `- the Albion Dukinfield`, `- Windsor Castle Marple Bridge` |
| Time-only row | 6 | `10pm - Mash Guru Macclesfield`, `8pm - Dog & Partridge Great Moor` |
| Open mic | 7 | `Karl Magee's Open Mic`, `Between the Vines Open Mic 7pm` |
| Karaoke, disco | 6 | `karaoke/disco - the Dog Inn Chadderton` |
| Generic live bands | 5 | `Bands - Spinning Top`, `live bands 4pm - Spinning Top` |
| Jam or themed night | 5 | `Backwater Blues Jam`, `Jazz Night`, `Jazz at the Railway` |
| DJ only | 1 | `DJ Martin 7pm- the Steelworks Bredbury` |
| Sponsorship-meta / branded / Reserved | 8 | `branded - Ashton Jubilee Club`, the home page `gigs 2026` block |
| Not a gig | 1 | `closed today - the Steelworks Bredbury` |

`Backwater Blues Jam` and `Loose Change Jazz Night` are named in the spec's `event_skips`. `Jazz at the Railway` is a standing skip. `Tony Auton band Jam` was rejected as a jam, on the same reading the 2026-08-27 run recorded: the spec's 2026-05-01 calibration imports a named-host jam and its later canonical operating rules reject jams outright, and the later rules win (§7).

Past-dated, skipped under §0.14: the whole `Wednesday 26th August` block, 7 rows. The page rolls on a Wednesday, so that block is stale for the rest of the week.

## 12. Two source oddities, neither actioned

**The `(cancelled - United match)` marker persists for a third week** on the home page sponsorship block, immediately before the `Saturday 26th September - the Billy Goat Mossley` row. `branded.htm` carries no cancellation on that row, and `branded.htm` is the authority for the forward list, so the live event `0801a98f-5fec-4f30-89d9-71ac5862bebd` was left alone. If the marker appears on `branded.htm`, it becomes a §5.4 explicit cancellation.

**`the Whitehouse Stalybridge` carries no anchor.** It is the only gig row on the page with no Facebook link, so the FB-URL-first venue key the spec is built around was unavailable for it. It resolved on the venue name and town instead. Not a defect — noted because the spec calls the anchor the primary venue match key.

## 13. Contract steps

- `data/state/cancellations.jsonl` was read before any create was attempted. It holds nine lines. **None matches any artist, venue and date in this capture** (§5.4 v2.19).
- `data/state/run-summary.jsonl` and today's report directories were read first. Four tasks have completed today: `enrichment` (five firings), `spider`, `klma-stoke-gig-list`, `onthecasemusic`. **No run has ruled on any gig in this capture today** (§5.4 v2.19). No absent record was read as a coverage gap.
- Snapshot written to `data/state/gigs-news-uk-last-page.txt`, 130 lines, with its normalisation rules in the header. Self-diff 0/0.
- Validator run on the one enriched record: `1 record · 1 clean · 0 FAIL · 0 WARN`, exit 0.
- `run-summary.jsonl` appended. Daily note appended.
- One inbox item raised, `shared-tmp-collides-across-runs` — see §14.
- Claim released as the last action.

## 14. A correction this run made to itself

The snapshot write used `/tmp/hdr.txt` as a scratch path in the shared Linux sandbox. **That file already existed, owned by another user, holding the `onthecasemusic` run's snapshot header.** The write was refused with `Permission denied`, the shell continued, and `cat /tmp/hdr.txt` read the other run's 30-line header into the gigs-news snapshot. The bad file existed for about one minute and was rebuilt from the capture before any diff was trusted; the self-diff gate then returned 0/0 against the correct file. `data/state/onthecasemusic-last-page.txt` was never touched and is intact at 403 lines.

**Nothing reached bndy and nothing was lost.** It is recorded here because the near-miss is real and general: §6F governs concurrency in the vault and says nothing about the sandbox, where scheduled tasks share one `/tmp` and a later run cannot overwrite an earlier run's file there. A guessable scratch filename is therefore a cross-task hazard. Raised once, as a RULE.

## 15. Honest read of this run

The curator did not roll the page; he filled in the acts he had not yet been told. Twelve rows gained a name and only one of them needed writing, because the unclaimed daily writer had already created eleven. That writer continues to produce correct records with no provenance, and this run closed eleven of those gaps by hand. The scheduled task's real yield on this source is now provenance, the forward list and the reject discipline — which is what the 2026-08-27 run predicted, and it is Jason's call whether that is the intended shape.
