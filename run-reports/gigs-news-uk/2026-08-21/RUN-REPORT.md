# gigs-news — scheduled run 2026-08-21

- **Run id**: `gigs-news-2026-08-21T00-28-30Z`
- **Runbook read**: `RUNBOOK.md` H1 **v2.27**, in full. Floor in §6A is **v2.19**. Assertion PASSES.
- **Prompt floor**: the task prompt states no number. §6A step 2a is the gate.
- **Spec read**: `sources/gigs-news-uk.md`, in full.
- **Inbox read**: `CTO-INBOX.md`, in full, before any item was considered.
- **Claim**: `data/state/claims/gigs-news.json`, acquired 00:28:30Z, TTL 90 minutes. Previous holder released cleanly at 2026-08-19T05:26:00Z. No takeover.
- **Heartbeat**: `data/state/heartbeat/gigs-news-2026-08-21T00-28-30Z.json`.
- **Outcome**: PARTIAL. One gig and one act written. One row is unimportable. One unclaimed writer is raised to the inbox.

## 1. Counts

| Measure | Count |
|---|---|
| Events created | 1 |
| Events edited | 0 |
| Artists created | 1 |
| Venues created | 0 |
| Records created with a verified page | 0 |
| Records created with an evidenced blank | 1 |
| Rows skipped — no resolvable venue | 1 |
| Rows skipped — past-dated (§0.14) | 3 |
| Rows already in bndy, no write needed | 20 |
| Rows rejected by the §0 filter and the spec reject list | 24 |
| Blank-act and time-only rows | 39 |
| Gate bounces | 0 |
| Creates against the 50 cap | 2 |
| Validator | 1 record · 1 clean · 0 FAIL · 0 WARN, exit 0 |

## 2. Capture

**Chrome is reachable again.** `tabs_context_mcp` returned a live tab on the first attempt. The outage recorded as `gigs-news-chrome-unreachable-blocks-artists` and `gigs-news-chrome-outage-eight-acts-four-days` has ended. Facebook page search also answers again, so `facebook-page-search-not-found` (2026-08-14) has ended too.

`mcp__workspace__web_fetch` on `https://www.gigs-news.uk/` returned an empty body. The run escalated to Chrome rather than retrying, and did not fall back to a container fetch.

| URL | Method | Rows |
|---|---|---|
| `https://www.gigs-news.uk/` | Chrome, DOM walk over leaf `center`/`p`/`td` nodes reading `a[href]` | 109 nodes, 95 snapshot lines |
| `https://www.gigs-news.uk/branded.htm` | Chrome, `innerText` | 412 lines, forward list at 18–45 |

Raw capture: `data/raw/gigs-news-uk/2026-08-21/week-view-rows.txt` and `branded-forward-list.txt`. No row was taken from a text dump; every venue href was read from the anchor (§0.22).

`javascript_tool` guard 1 fired as documented — any returned string containing `=` is blocked. Venue hrefs of the `profile.php?id=…` form were transformed to `(eq)` on return and are stored that way in the raw file. Guard 3 also fired: output truncates near 1.4 KB, so the 109 rows were returned in seven slices.

## 3. Horizon and the branded.htm forward list

The forward list is the header `gigs 2026` plus the **27 dated rows** that follow it, `innerText` lines 18–45. The next `Gigs 2026` header, at line 162, opens the archive. Archive headers sit at 162, 201, 268, 325 and 367 and all are excluded. All three safeguards held: ordinal position, the lowercase/capitalised header distinction, and the day-name-against-date cross-check.

The forward list is **unchanged from the stored snapshot: 0 added, 0 removed**. No re-verification was needed.

One source oddity, not actioned: the **home page's** own sponsorship block renders `(cancelled - United match)` immediately before the `Saturday 26th September - the Billy Goat Mossley` row. `branded.htm` carries no cancellation on that row. The home page sponsorship block is skip-both-event-and-venue under the spec, and `branded.htm` is the authority, so nothing was changed. Worth a look if the marker appears on `branded.htm`.

## 4. Diff (§5.7)

Mode: the spec declares neither `delta` nor `append-only`. Already open as `gigs-news-mode-undeclared` (2026-08-12). The run defaulted to **append-only** and removed nothing.

- **Section 1 (week view)**: 1 added, 0 removed, 15 changed.
- **Section 2 (branded forward list)**: 0 added, 0 removed.
- **§5.7(a) self-diff gate**: the new snapshot re-diffed against the capture it was written from returns **0 added / 0 removed**, 123 lines against 123 lines.

**No future-dated named row disappeared.** Every removed line is a blank-act slot the curator has now filled, so no §0.17 decision arose on either mode.

| Old snapshot line | New line | Meaning |
|---|---|---|
| `next week - Stockport Rock & Roll Society` | `9th Sept Off the Record - Stockport Rock & Roll Society` | act and forward date named — see §7 |
| `live bands - Spinning Top` (Thu) | `Blues Jam - Spinning Top` | still a non-artist row, still rejected |
| `- Acoustic Lounge Poynton` (Fri) | `Hustle - Acoustic Lounge Poynton` | act named |
| `- the Swan Inn Wilmslow` (Fri) | `the Grey Numbers - the Swan Inn Wilmslow` | act named |
| `- Queens Hotel Macclesfield` (Fri) | `the Moon Reivers - Queens Hotel Macclesfield` | act named |
| `- the Dog Inn Chadderton` (Fri) | `Marshall Gill & Co - the Dog Inn Chadderton` | act named |
| `- Ashton Jubilee Club` (Fri) | `Vulture Squadron - Ashton Jubilee Club` | act named — **written this run** |
| `- Acoustic Lounge Poynton` (Sat) | `Cold Flame - Acoustic Lounge Poynton` | act named |
| `- the Swan Inn Wilmslow` (Sat) | `Bet Shop Boys - the Swan Inn Wilmslow` | act named |
| `- Queens Hotel Macclesfield` (Sat) | `Safehouse - Queens Hotel Macclesfield` | act named |
| `- Hare & Hounds New Mills` (Sat) | `the Torrists - Hare & Hounds New Mills` | act named |
| *(absent)* | `the Select Committee - Railway Hotel Nantwich` | new row, Sat 22 Aug |
| `4pm - Spinning Top` (Sun) | `live bands 4pm - Spinning Top` | still rejected |
| `6pm - the Dog Inn Chadderton` (Sun) | `Molly Duffy 6pm - the Dog Inn Chadderton` | act named |
| `7pm - Acoustic Lounge Poynton` (Sun) | `Simon Langley 7pm - Acoustic Lounge Poynton` | act named |

Normalisation applied to both sides and recorded in the snapshot header: whitespace runs collapsed to one space; every line trimmed; trailing comma, full stop or slash stripped; HTML entities decoded once; empty lines removed. Chrome `innerText` returns one forward row per line, so the line-splitting rule the previous curl capture needed did not apply and is noted as such in the header.

## 5. The page is one week stale in two places

The week view is still titled `What's on This Week 19 - 23 August` on 21 August. Its day headers run Wednesday 19th, Thursday 20th, Friday 21st, Saturday 22nd — then **`Sunday 16th August`**, which is last Sunday. The rows below it are this week's, so the correct date is **2026-08-23**, a Sunday, which is the third safeguard. Already open as `gigs-news-sunday-header-stale-16-august`.

The Wednesday and Thursday blocks are now past-dated. Three named rows under them were **skipped under §0.14**, not written: `Ricky Stone` (Coach & Horses Oldham, 19 Aug), `Route 66` (the Welcome Inn Whitefield, 20 Aug) and `Roy Pimmy` (White Hart Woodley, 20 Aug, already in bndy). Route 66 was blocked by the Chrome outage on 18 and 19 August and its date has now passed. That is the outage's measurable cost: one gig lost outright.

## 6. Event created

Carries `isPublic: true` and a `{source:"gigs-news", id:"<date>-<artist>-<venue>"}` externalId in the form this source already uses at this venue (`2026-08-28-branded-jubilee-club-ashton`). Read back with `get_by_id` (§0.10).

| Event id | Title | Date | Time | Artist id | Venue id |
|---|---|---|---|---|---|
| `05fa20c7-1f15-4126-97f5-cef4ec0fa132` | Vulture Squadron @ Jubilee Club | 2026-08-21 | 21:00 **defaulted** | `7b8598b3-73f9-4753-b74b-623494958b7b` | `49bc4606-97d7-45a5-a693-a887ac2f0810` |

externalId written: `2026-08-21-vulture-squadron-jubilee-club-ashton`.

**Defaulted time.** The source publishes no time for this row. `startTime` was omitted and the server applied the §5.6 Friday rule, returning `startTimeDefaulted: true` and 21:00. No time was invented and none was asked for.

`cancellations.jsonl` was read before the create. The file holds five lines and none matches Vulture Squadron, the Jubilee Club or 2026-08-21. `run-summary.jsonl` and today's report directories were read first: **no run has fired today before this one**, so no other run has ruled on this gig (§5.4 v2.19).

## 7. Artist created — one, with an evidenced blank

**Vulture Squadron** `7b8598b3-73f9-4753-b74b-623494958b7b`, `band`, location `Greater Manchester UK`, `locationType: regional`. Bio empty, genres empty, actType empty, no socials.

`search_artist("Vulture Squadron")` and `search_artist("Vulture")` both returned nothing at any confidence, so no §1A same-name question arose. `create_artist` returned `action: created` with no review and no bounce.

**Identification, both surfaces, per §2A.1 item 3b.** Two same-name UK band pages exist and **neither is evidenced as this act**:

- `facebook.com/VultureSquadronBand` — 178 followers, category Band, bio *"Not your average rock band!"*. Visited, including its About tab. **It publishes no location and no gig list.** Name match alone is never sufficient (§2A.1).
- `facebook.com/Vulturegigs` — 147 followers, Musician/band, rock covers. Visited. Google identifies this as the act that announced it had stopped playing after about 32 years in the SW home counties. Wrong region and no longer active.

Search variants tried, recorded in the evidence file: Google `vulture squadron band`; Google `"Vulture Squadron" band Wigan gigs`; Facebook page search `vulture squadron`; and a direct visit to both candidate pages. Facebook page search returned five pages — an aviation shop, two model-aircraft and social groups, and the two band pages above. Nothing places any of them in the North West.

**Blank beats wrong (§2A.1 item 1).** The record ships with socials empty and is flagged here.

Two deviations, stated plainly rather than buried:

1. **`artistType` was set to `band` without page evidence.** §2A.1 item 8 says artistType is copied from evidence or left empty, but `create_artist` makes the field mandatory, so it cannot be left empty. `band` was chosen because the name is a group name, not a person's name. If the field ever becomes optional, this value should be re-checked.
2. **The evidence line was appended immediately after the create, not before it.** §6A step 8 requires the evidence file first. The purpose of that ordering is to make a bio a transfer rather than an authored field; this record has no bio and no attached URL, so nothing was authored, and the line could not carry a real `artistId` until the record existed. Stated so it is visible, not defended.
3. **`locationType` is not returned by `get_by_id`.** The regional string was paired with `locationType: "regional"` on the create (§6B Kilmarnock trap), but the read-back does not expose the field, so it cannot be verified under §0.10 by that route.

Evidence file: `data/state/enrichment-evidence-2026-08-21-gigs-news.jsonl`, one line.

## 8. One row cannot be imported — Stockport Rock & Roll Society

`9th Sept Off the Record - Stockport Rock & Roll Society` is a **future-date-prefix row** under the Wednesday 19 August header. Parsed per the spec: date **2026-09-09**, which is a Wednesday, artist **Off the Record**, venue **Stockport Rock & Roll Society**.

The artist exists and is correct: **Off the Record** `ZBsvczPpYGAHbDdcHFfJ`, Stockport, and `search_event` returns **zero future events** for it. This would be its first gig in bndy.

**The venue cannot be resolved and the row is therefore skipped, not staged (§0A rule 1b).** Probes run, all three required by §3 plus one more:

| Probe | Result |
|---|---|
| `search_venue("Rock & Roll Society", "Stockport")` | no venues found |
| `search_venue("Rock and Roll Society", "Stockport")` | no venues found |
| `search_venue("Society", "Stockport")` | no venues found |
| `search_venue("Rock and Roll", "Stockport")` | no venues found |

The source's anchor is a Facebook **group**, `facebook.com/groups/1968976253154349`, "Stockport Rock and Roll Society", a public group of 2.5K members. The group publishes no address to a non-member. A society is an organisation, not a building, so no correct Google Place ID exists for it — §0.8 forbids the create and §0.23 forbids guessing a building for it. The spec's own 2026-05-01 history records this venue as the single park-lot of the first import.

No inbox line raised: §0.23 already answers this row. It is reported here so the cost is visible — one real act, one real forward-dated gig, permanently unimportable until the society's host venue is named.

## 9. Twenty rows were already in bndy — and sixteen of them arrived twelve minutes before this run

Every named importable row for 21–23 August already existed in bndy except Vulture Squadron. That is the correct outcome, but **the records were not written by this task and were not written under the run contract.**

`get_by_id` on the new records returns `createdAt` timestamps of **2026-08-21T00:15:56Z to 00:17:19Z**. This run acquired its claim at **00:28:30Z**. In the intervening window an unidentified writer created roughly sixteen artists and seventeen events covering exactly this source's rows — including all eight acts this task recorded as blocked on 19 August.

Measured, not inferred:

- `data/state/claims/gigs-news.json` recorded `heldBy: null` from 2026-08-19T05:26:00Z until this run acquired it. **No claim was held at 00:15Z.**
- `data/state/heartbeat/` holds **no file dated 2026-08-20 or 2026-08-21** other than this run's.
- `data/state/run-summary.jsonl` **has no line after 2026-08-19T11:40Z.**
- The events carry **`externalIds: []`** — verified with `get_by_id`, not with `search_event`, because §6B records a false-negative mode on the latter. Example: `b1ca13c9-9e21-4a8e-80df-b4af2b3cd28c` the Grey Numbers @ The Swan Inn, and `a2ed7b78-312a-4216-b51a-130e0dc9a65c` Zak James @ Buxton Working Men's Club.
- The artists are **stubs**. Example: `Thombres` `697cf79e-3977-4114-ab04-42db93f28e9e` — `bio: ""`, `genres: []`, no `facebookUrl`, no `profileImageUrl`. §2A.1 items 5 and 7 forbid exactly this, and §6C names it as a standing failure class.

The events, with the venue and date this source publishes:

| Event id | Row | Date |
|---|---|---|
| `5f01f28c-7ce1-404f-a9c4-966fb1cea38a` | Hustle @ The Acoustic Lounge | 2026-08-21 |
| `b1ca13c9-9e21-4a8e-80df-b4af2b3cd28c` | the Grey Numbers @ The Swan Inn | 2026-08-21 |
| `1a4df5b7-87ed-4bb8-a072-30e3b7f9012d` | the Moon Reivers @ Queen's Hotel | 2026-08-21 |
| `a3ced6b9-3e5a-4ef1-9888-d1ba006beeac` | Marshall Gill and Co @ The Dog Inn | 2026-08-21 |
| `548ac7f5-ed39-4178-ab97-100e2b75fbd5` | Thombres @ The Musketeer | 2026-08-21 |
| `3245365e-bc0d-4013-bc4f-b61b65a9c6dd` | Lee Buckle and friends @ The Railway | 2026-08-21 |
| `f39f8d9a-9980-41f3-8064-0b15efc8206c` | Bet Shop Boys @ The Swan Inn | 2026-08-22 |
| `48ba0614-a98b-4c28-8301-4cff89f7570d` | Safehouse @ Queen's Hotel | 2026-08-22 |
| `6ba7c7fc-4003-4548-bd49-2ea198853a36` | The Torrists @ Hare & Hounds | 2026-08-22 |
| `51553e6d-72f7-49f6-ad47-76ae14cc5df6` | Sinnertwin @ Bike 'N' Hound | 2026-08-22 |
| `4bb22b8a-4b4e-4703-a516-6a32d5fe40cc` | Andy Lee @ The Windsor Castle | 2026-08-22 |
| `a2ed7b78-312a-4216-b51a-130e0dc9a65c` | Zak James @ Buxton Working Men's Club | 2026-08-22 |
| `3163749d-828e-434c-864c-a4259a4eb9da` | The Railway, Nantwich (artist: The Select Committee) | 2026-08-22 |
| `2e75275c-00ad-4216-bad6-9783773274f6` | Karl Magee @ Albion Dukinfield | 2026-08-23 |
| `fd24f7c1-e0c7-48dd-b1f7-61bd2793de66` | Molly Duffy @ The Dog Inn | 2026-08-23 |
| `2c00373d-e23e-4d13-9e05-32f7eafe1319` | Simon Langley @ The Acoustic Lounge | 2026-08-23 |

**Why no externalId back-fill was written.** Sixteen missing provenance ids is a real defect: without them this source's diff cannot match its own rows, and a later run can only find these events by artist plus venue plus date. The obvious fix is to write `{source:"gigs-news", id:"<date>-<artist>-<venue>"}` onto each. **This run did not do it**, for one reason: `externalid-slug-drift` is an open DEFECT against this source recording that three derivation styles are already live and the id is not a reliable idempotency key. §6B's `fantasticallibrary` precedent is exact — when a source's id convention is disputed, writing more ids in a fourth pass fragments provenance further rather than fixing it, and provenance writes are suspended until the convention is ruled. Sixteen ids written into a disputed convention would be harder to unpick than sixteen absent ones. The back-fill is a single clean pass once the convention is settled.

Raised to the inbox as one line, because it is a different fact from `unclaimed-bare-artist-creates-0413z` (six artists, no events, 18 August): this is a writer that produced sixteen artists **and** seventeen events for one named source, minutes before that source's own scheduled run, with no claim, no heartbeat and no summary line.

## 10. Row disposition — all 95 week-view lines

| Class | Count |
|---|---|
| Page furniture (title, week strap, 2 featured duplicates) | 4 |
| Day headers | 5 |
| Blank-act and time-only rows — the curator's empty slots | 39 |
| Named rows rejected by the filter | 24 |
| Named rows past-dated (§0.14) | 3 |
| Named rows importable | 20 |

The 20 importable rows: **1 written this run** (Vulture Squadron), **16 already present** and listed in §9, **2 written by this task on 19 August** (Cold Flame @ The Railway `47793a7b-c5b0-4733-bbb3-d5fd115e40b9`, Smudge @ The Coach and Horses `7c90df59-b515-4a69-a115-33efc128b5fa`), and **1 skipped for an unresolvable venue** (§8).

The remaining long-standing rows — Stage Two, the Grey Dogs, Paul Waldron, Mongomery's Angels, Tracy Morgan & co, Just Jane, Soul 4 Soul, Ged Scott, and the three `Reserved` rows carried by artist `branded` `rwDw320gku5uQ4gzaU2N` — are unchanged at source and unchanged in bndy.

The 24 rejected named rows: open mics (8), karaoke and karaoke/disco (6), DJ-only (`DJ Martin 7pm`), generic `live bands` at Spinning Top (3), `Blues Jam` at Spinning Top with no leading act name, theme nights with no performer (`Jazz Night`, `Jazz at the Railway`), the spec `event_skips` entry `Backwater Blues Jam`, and `Tony Auton band Jam` (past-dated Thursday, and already in bndy). Every venue behind them is already in bndy; none produced a venue create.

## 11. Identity and venue resolution

No artist name was created from a lineup, a venue, a residency or a descriptor. No name was invented. No name needed sanitising this run. `Marshall Gill & Co` and `Lee Buckle & friends` are §1A.5 billing aliases and both already resolve to the bare act in bndy; neither produced a second record.

No venue was created. Every venue used was confirmed by an existing `gigs-news-uk` externalId matching the source's own Facebook anchor:

| Source label | bndy record | Postcode | Anchor match |
|---|---|---|---|
| `Ashton Jubilee Club` | `49bc4606-97d7-45a5-a693-a887ac2f0810` Jubilee Club, Ashton-in-Makerfield | WN4 9SL | spec learned mapping; WN4 confirmed Wigan-side (§0.24) |

**`search_venue` was defeated by an apostrophe for the sixth time.** `search_venue("Bike n Hound", "Hyde")` returns *no venues found*. The venue exists as `qCk6zjFPCmz1E6I4G9oz` **Bike 'N' Hound**, 5 Hamnett St, Hyde SK14 2EX, already carrying three externalIds including a `gigs-news-uk` one. It surfaced on the §3 fallback probe `search_venue("Hound", "Hyde")` at **36% low_confidence** — below the 50% create-new threshold in the spec's match ladder. `list_venues(city:"Hyde")` also returned it. No duplicate was created. Already open as `search-venue-apostrophe`; no second line raised.

## 12. Snapshot and state

- Snapshot written: `data/state/gigs-news-uk-last-page.txt`, 126 lines, two sections, normalisation rules in the header.
- Self-diff gate: **0 added / 0 removed**.
- Evidence file: `data/state/enrichment-evidence-2026-08-21-gigs-news.jsonl`, 1 line.
- Validator: `1 records · 1 clean · 0 FAIL · 0 WARN [mode=gate]`, exit 0.
- `record_run` not called: `SOURCE_RUNS_TOKEN` is still unset, already open as `record-run-token-missing`.
- No enrichment top-up was written on another writer's records. Chrome is available and the sixteen stub artists in §9 are enrichable, but that is `bv2a-enrichment`'s owned work and this run's own write needed only one identity check. Reported rather than half-done.
- **Correction, stated because the line is already on disk.** This run's `run-summary.jsonl` line carries `finishedAt: 2026-08-21T01:05:00Z`. The run in fact finished at about **00:47Z**. The line was **not** rewritten: §6A step 7b is append-only, and a second corrected line would double-count one gig and one artist on the dashboard, which is worse than a timestamp eighteen minutes ahead. `gigsAdded`, `artistsAdded` and `venuesAdded` on that line are correct.
- **Two other runs fired in the same window and both are visible in the state files**: `klma-stoke-gig-list` at 00:24:33Z and `sceniceye` at 00:34:33Z. Both hold their own claims. No shared file was written blind: this run touched only `gigs-news-uk` paths, plus append-only writes to `run-summary.jsonl`, `CTO-INBOX.md` and the daily note. The KLMA run independently found the same unclaimed writer on its own source and raised `unclaimed-klma-event-creates-0023z`; that line is KLMA-scoped and the line raised here is this source's, so the two are not duplicates.

## 13. Raised to CTO-INBOX.md

One item, one new fingerprint.

1. `unclaimed-writer-16-acts-17-gigs-0015z` — an unidentified writer created sixteen artists and seventeen events for this source at 00:15–00:17Z, twelve minutes before this run's claim, with no claim, no heartbeat, no summary line, no event externalIds and bare artist records.

Nothing else was raised. The stale Sunday header, the undeclared §0.29 mode, the undated snapshot lines, the externalId drift, the `search_venue` apostrophe and the `record_run` token are all already open under their own fingerprints, and CTO-INBOX rule 5 forbids a second line for the same item. The Chrome outage lines are left as they stand: they record a fault that has now cleared, and striking a line is a triage action, not a run action.
