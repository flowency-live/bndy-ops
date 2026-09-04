# Bv2a Enrichment — RUN-REPORT-02 — 2026-08-28

**Run id:** `bv2a-enrichment-2026-08-28T02-19-05Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Checked the last 3 run reports by mtime before any other action: `RUN-REPORT-01` (2026-08-28, 01:17:31Z firing, completed, validator `5 records · 4 clean · 0 FAIL · 2 WARN`), `RUN-REPORT-00` (2026-08-28, 00:19:03Z firing, completed, `7 records · 6 clean · 0 FAIL · 1 WARN`), `RUN-REPORT-23` (2026-08-27, 23:19:48Z firing, completed, `15 records · 13 clean · 0 FAIL · 1 WARN` after one bio-verbatim-on-untouched-record exclusion). All three completed with a final 0 FAIL. Breaker did not fire.

## Runbook / task spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full: §0A, §0 prime directives 1–29, §1/§1A identity + same-name protocol, §2/§2A enrichment protocol (2A.1 items 1–8 including 3b both-surfaces-mandatory, 3c two-word-query rule, item 8 bio-is-a-quotation), §3 venue protocol, §4, §5, §6 run discipline, §6A run contract (steps 0–9), §6B platform facts, §6C failure classes, §6D/6D-bis, §6E, §6F, §6G concurrency lock protocol/TTL table/dead-holder takeover, §7 change control (full changelog v1.0–v2.27). `ENRICHMENT-TASK-v3.md` read in full: §0.0, §FP fast path, §1–§12. `CTO-INBOX.md` read in full (lines 290–476, the full remaining file) for every `bv2a`/standing precedent through today.

## Standing precedents applied

- `bv2a-firing1319z-verify-id-before-live-write` — `get_by_id` immediately before every `edit_artist`/`edit_venue` call, confirming the target name before writing.
- `bv2a-firing1319z-never-guess-fb-vanity-url` — every `facebookUrl` written was read from a visited page's own DOM (`document.body.innerText` via `javascript_tool`) or a canonical page URL, never inferred from an act name.
- `bv2a-venue-edit-facebookurl-param-silent-noop` — used `socialMediaUrls` for the venue write this firing, not the `facebookUrl`/`instagramUrl` top-level parameters.
- `bv2a-firing1419z-validator-cannot-check-venues` — the venue write excluded from the validator gate pass; only the 5 verified artist records were validated.
- `bv2a-firing2119z-edit-artist-genres-param-replaces-not-merges` — merged Walking Alone's existing `genres:["Rock"]` and `actType:["covers"]` with the newly-evidenced `Punk`/`originals` rather than overwriting.
- §0.9 (409 is a match signal, never worked around) — applied on King Kurt: the rename bounced 409 against an existing "King Kurt" record; did not retry with a varied spelling, did not force a merge (Jason-authorized only), logged the duplicate pair in `CTO-INBOX.md` instead.
- Cross-checked all 11 Tier 1 candidates and all 37 Tier 3 venue candidates against today's evidence file (57 lines held at firing start) and standing CTO-INBOX flags before searching anything — see Selection below.

## Concurrency

`data\state\claims\bv2a-enrichment.json` read at firing start held `{"heldBy":null,"releasedAt":"2026-08-28T02:10:00Z","lastRun":"bv2a-enrichment-2026-08-28T01-17-31Z"}` — released. Wrote heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-28T02-19-05Z.json` (`outcome:"started"`) before any gate, then acquired the claim (`heldBy: bv2a-enrichment-2026-08-28T02-19-05Z`, TTL 3h, `expiresAt: 2026-08-28T05:19:05Z`). No `data\state\enrichment.lock` file present among the source-owned `.lock` files listed in `data\state\` (only other tasks' own lock files present — `gigs-news.lock`, `insangel.lock`, `klma-stoke-gig-list.lock`, `onthecasemusic.lock`, `sceniceye.lock` — none of which are this task's concern) — not honoured, not recreated, per §6A step 2b.

## Preconditions

Confirmed exactly one Chrome browser connected (`list_connected_browsers`) and logged into Facebook (own timeline visible, "What's on your mind, The Torrists?"). bndy MCP tools reachable (`list_artists`/`list_venues`/`edit_artist`/`edit_venue`/`get_by_id`/`search_artist` all responded normally).

## Work — by tier

**Tier 1 — artists created in the last 24h with missing socials:** `list_artists(createdSince: 2026-08-27T02:19:05Z, missingSocials:true)` returned 11 candidates (Lee Wainwright, Collette, Plastic Soul, Xclusive, Joe McShane, Manic, Agents of Chaos, Jung, the Reform, Tee, Over the Moon). Cross-checked all 11 against today's evidence file: **all 11 already carried a line from an earlier firing today.** None re-searched.

**Tier 2 — venues created in the last 24h with missing socials:** `list_venues(createdSince, missingSocials:true)` returned 0 candidates.

**Tier 3 — backlog venues missing socials:** `list_venues(missingSocials:true)` returned 37 (unchanged from firing 01's close). Cross-referenced all 37 individually against standing CTO-INBOX flags and today's evidence file: **36 already accounted for** (flagged non-enrichable class or evidenced blank earlier today). The one exception, The Decorated Dead Tattoo Studio, was already evidenced (instagram found, no Facebook) but its firing-00 write had silently failed to persist — see Defects below. Fixed this firing via the `socialMediaUrls` workaround, confirmed on read-back. **1 venue worked (1 verified, corrective) of 30 cap** — backlog otherwise fully saturated, confirming the standing `bv2a-venue-backlog-saturated` finding for the third consecutive firing today.

**Tier 4 — backlog artists missing socials, oldest `createdAt` first:** paged `list_artists(missingSocials:true)` at offsets 200, 250, 300 (150 records, extending past firing 01's offset-200 stopping point) per the standing `bv2a-firing2219z-tier4-sampling-never-reaches-true-oldest` finding. Sorted locally by `createdAt`, cross-checked against today's evidence file and the §5.4 do-not-attach list. Found a new genuinely-oldest record — **Evolution** (`eJ3aDOC7ByrKZ36foVL9`, created **2025-02-22**) — five months older than any record reached by any firing today or in the standing precedent history (previous oldest: Soulplay, 2025-03-01, from 2026-08-27's firing 23). Worked the 15 oldest genuinely-fresh candidates found across the three pages: **5 verified, 10 evidenced blank.** Meets the 15-artist budget cap exactly.

**Tier 5 — artists missing genres with an existing facebookUrl:** not reached — the 15-artist cap was met by Tier 4.

## Venues — verified (1, corrective fix)

| Venue | Field(s) | Evidence |
|---|---|---|
| The Decorated Dead Tattoo Studio (Poole) | socialMediaUrls (Instagram) | instagram.com/the_decorateddead/ — already evidenced by firing 00 today; that firing's `instagramUrl` top-level-parameter write silently failed to persist (new defect, see below); rewritten via `socialMediaUrls` and confirmed on read-back |

## Artists — verified (5, all with a named Tier A/B signal)

| Artist | Field(s) | Evidence / signal |
|---|---|---|
| Rat Race (Derbyshire, UK) | facebookUrl | facebook.com/theratraceband/ — Musician/band, 442 followers, corroborated by a Google-surfaced photo/post of the act playing The Latch Lifter, Ilkeston, Derbyshire (Tier B: venue inside the stored footprint) |
| Rock T'Night (Yorkshire) | facebookUrl, bio | facebook.com/rocktnightband/ — sole exact-name candidate, Band category, 469 followers, active bio; Google corroborates a York-based band (rocktnightband.com, phone) — York is in Yorkshire, consistent with stored region |
| Dog Day Afternoon (Yorkshire) | facebookUrl, bio | facebook.com/dogdayafternoonband/ — Musician/band, 279 followers; page's own bio states "covering scunthorpe and doncaster area" — Doncaster is South Yorkshire, consistent with stored region (Tier B: page-stated service area) |
| Walking Alone (Staffordshire UK) | facebookUrl, bio, genres (+Punk), actType (+originals) | facebook.com/walkingalone.uk/ — page's own bio states "An original and covers punk band from Stoke-On-Trent!" (Tier A: page-stated location matches stored Staffordshire/Stoke footprint exactly); existing genres/actType merged, not overwritten |
| King Kurt (bndy record still named "King Kurt Pudding Party") | facebookUrl | facebook.com/kingkurtofficial/ — 17K followers, exact page name "King Kurt"; corroborated by undergroundstoke.co.uk's own listing "King Kurt \| Pudding Party" at The Underground, Hanley, Stoke-on-Trent, confirming the stored record's name is the event billing, not the act's name. **Rename to "King Kurt" bounced `HTTP 409: Duplicate artist`** — `search_artist("King Kurt")` confirms an existing 100%-confidence record (`1ae7cc6e-81ac-4a68-b4a3-8d1a1ad867b3`) already carries the identical Facebook identity. Per §0.9, did not retry the rename or force a merge; `facebookUrl` alone was written (this succeeded); duplicate pair logged in `CTO-INBOX.md` for a human merge. |

## Artists — evidenced blank (10)

Both surfaces (Google + Facebook page search/visit) tried for every record before recording blank, per §2A.1 item 3b.

| Artist | Variants tried | Reason |
|---|---|---|
| Evolution (Stockport) | "Evolution band Stockport facebook" | No confident Stockport candidate; hits were Berkshire, Wiltshire and California bands. Genuinely oldest unworked record found (2025-02-22) — advances the standing true-oldest boundary. |
| Head Over Heals (Stoke-on-Trent) | "Head Over Heals band facebook", "\"Head Over Heals\" band Stoke facebook" | No confident Stoke match; candidates were Austin TX, Baltimore, and a location-less 2022-founded tribute act |
| Twistin' (Derbyshire, UK) | "Twistin' band facebook", "Twistin band Derbyshire" | No Derbyshire match; candidates were a Detroit rockabilly act, a Django-style act with no location, and a children's music class |
| Northern Quarter (Yorkshire) | "Northern Quarter band Yorkshire facebook" | Two same-name Yorkshire candidates found (Sheffield, Rotherham); both candidate pages dead on Chrome visit (one redirects to meta.com/about, one shows Facebook's own "content isn't available") |
| Flashback (Yorkshire) | "Flashback band Yorkshire facebook" | No Yorkshire match; candidates were Hertfordshire, Oxfordshire and Warwickshire bands |
| Kelly Rox (Gateshead) | "Kelly Rox band Gateshead facebook" | Lemonrock corroborates NE England but the sole FB candidate ("Kelly Rox guitar vocalist") redirects to meta.com/about on Chrome visit — dead page |
| Ava Ralph (Stoke-on-Trent) | "Ava Ralph Stoke-on-Trent facebook" | No candidate found on either surface |
| Roy Pimmy (Stockport) | "Roy Pimmy Stockport facebook" | No candidate found on either surface |
| Jonny Trax (Newcastle upon Tyne) | "Jonny Trax Newcastle facebook" | Sole candidate (facebook.com/JonnySax15/, 1.4K followers) carries no location field and category "Entertainment website", not Musician/band — name match alone is Tier C, insufficient |
| Beartown Stompers (Congleton) | "Beartown Stompers jazz band Congleton facebook", "\"Beartown Stompers\" facebook" | No dedicated own page found; only third-party festival/brewery mentions |

## Validator summary line (verbatim)

```
5 records · 3 clean · 0 FAIL · 2 WARN   [mode=gate]
```

The 2 WARNs (`STUB_NO_BIO` on Rat Race and King Kurt) are correct behaviour, not a defect: Rat Race's About page carries no bio text at all (Musician/band category only), and King Kurt's own bio field literally reads a booking-contact line ("BOOKING ENQUIRIES kingkurtbookings@hotmail.com") — correctly left empty rather than written as if it were narrative bio content.

0 FAIL. Batch ships.

## Names corrected under §0.6

**Attempted, not completed:** "King Kurt Pudding Party" → "King Kurt" — the act's own Facebook page name is exactly "King Kurt"; "Pudding Party" is the band's touring event/gimmick name, confirmed via an independent venue listing. The rename bounced `HTTP 409: Duplicate artist` against an existing "King Kurt" record already holding the identical Facebook identity. Not forced through; logged as a duplicate-pair finding in `CTO-INBOX.md` for a human merge, per §0.9 and the standing prime directive against merges inside an unattended run.

## Defects found this firing

- **`bv2a-venue-edit-instagramurl-param-silent-noop`** — a new instance of the standing `facebookUrl`-param-silent-noop shape, this time on `edit_venue`'s top-level `instagramUrl` parameter. Firing 00:19:03Z's write to The Decorated Dead Tattoo Studio reported success but never persisted; fixed this firing via `socialMediaUrls`. Logged in `CTO-INBOX.md`.
- **`bv2a-king-kurt-pudding-party-duplicate-of-king-kurt`** — genuine duplicate-artist pair, same class as the standing Zoe Schwarz / Vince Lee cases, found via a name-contamination correction rather than a fresh enrichment. Logged in `CTO-INBOX.md`.

## Ledger / snapshot / run-summary / dashboards

- `data/state/enrichment-ledger.jsonl`: 16 `enrich` lines (1 venue-verified, 5 artist-verified, 10 artist-blank) + 1 `snapshot` line appended.
- Snapshot: artistsTotal 3286 (unchanged — this task creates nothing), artistsMissingSocials 1395 (down from 1400), artistsMissingGenres 950 (unchanged — no genre-only fill this firing beyond the Walking Alone merge, which was socials-triggered), venuesTotal 3205 (unchanged), venuesMissingSocials 36 (down from 37).
- `data/state/run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 6, skipped 10.
- Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (3075 records, 110 snapshots) and `data/normalized/DASHBOARD.html`.

## Evidence file

`data/state/enrichment-evidence-2026-08-28-enrichment.jsonl` — held 57 lines from the two earlier firings today before this one started; this firing appended 16 lines (1 corrective re-affirmation for the venue fix, 5 verified artist captures, 10 evidenced-blank/search-variant lines), ending at 73 lines.

## Budget used

**1 venue worked (1 verified, corrective fix) of 30 cap** — backlog fully saturated after cross-referencing standing flags and today's evidence, confirming the standing finding for the third time today. **5 verified + 10 blank = 15/15 artists worked**, cap met exactly. Elapsed approximately 35 minutes (heartbeat 02:19:05Z → this report). Circuit breaker did not fire; no hard stop encountered.

## Claim / heartbeat

Claim released (`heldBy: null`, `lastRun: bv2a-enrichment-2026-08-28T02-19-05Z`). Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-28T02-19-05Z.json` updated to `completed`.
