# Bv2a Enrichment — RUN-REPORT-01 — 2026-08-28

**Run id:** `bv2a-enrichment-2026-08-28T01-17-31Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Checked the last 3 run reports by mtime before any other action: `RUN-REPORT-00` (2026-08-28, 00:19:03Z firing, completed, validator `7 records · 6 clean · 0 FAIL · 1 WARN`), `RUN-REPORT-23` (2026-08-27, 23:19:48Z firing, completed, `15 records · 13 clean · 0 FAIL · 1 WARN` after one bio-verbatim-on-untouched-record exclusion), `RUN-REPORT-22` (2026-08-27, 22:18:32Z firing, completed, `2 records · 2 clean · 0 FAIL`). All three completed with a final 0 FAIL. Breaker did not fire.

## Runbook / task spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full: §0A, §0 prime directives 1–29, §1/§1A identity + same-name protocol, §2/§2A enrichment protocol (2A.1 items 1–8 including 3b both-surfaces-mandatory, 3c two-word-query rule, item 8 bio-is-a-quotation), §3 venue protocol, §4, §5, §6 run discipline, §6A run contract (steps 0–9), §6B platform facts, §6C failure classes, §6D/6D-bis, §6E, §6F, §6G concurrency lock protocol/TTL table/dead-holder takeover, §7 change control (full changelog v1.0–v2.27). `ENRICHMENT-TASK-v3.md` read in full: §0.0, §FP fast path, §1–§12. `CTO-INBOX.md` read in full (lines 300–468) for every `bv2a`/standing precedent through 2026-08-27.

## Standing precedents applied

- `bv2a-firing1319z-verify-id-before-live-write` — `get_by_id` immediately before every `edit_artist` call, confirming the target name before writing.
- `bv2a-firing1319z-never-guess-fb-vanity-url` — every `facebookUrl` written was read from a visited page's own DOM (`document.body.innerText` via `javascript_tool`) or its resolved `profile.php?id=` URL, never inferred from an act name.
- `bv2a-venue-edit-facebookurl-param-silent-noop` — not triggered (no venue field writes this firing; all 7 venue candidates evidenced blank).
- `bv2a-firing1419z-validator-cannot-check-venues` — venue records excluded from the validator gate pass; only the 5 verified artist writes were validated.
- A Facebook GROUP URL was attached for Russ Tippins per the standing 2026-08-07 ruling that group URLs are a legitimate act surface, never stripped or downgraded.
- Source-published listing copy (Swamp Hogs' Lemonrock band description) was used as `bio` under the 2026-07-31 "no-socials-found, listing-copy-permitted" ruling — it describes the act, not a venue or a night, and no working Facebook page was found for the record.
- Cross-checked all 12 Tier 1 candidates against today's evidence file before searching: 8 (Lee Wainwright, Plastic Soul, Xclusive, Manic, Jung, the Reform, Tee, Over the Moon) already carried an evidenced-blank line from the 00:19:03Z firing today and were **not** re-searched. Only the 4 genuinely fresh candidates (created 01:11:58Z, six minutes before this firing) were worked.
- Cross-checked the 37-venue backlog against every standing CTO-INBOX flag (Tresaith, Market Place Burton, Taylors Bar, Hunstanton Bandstand, Annitsford Welfare Club, Willenhall Memorial Park, The Old Lockup, Okehampton Show ground, Hayfield Club, Venue TBC, The Royal British Legion Beeston, United match), White Lodge, Bumble Hole, Middle of the Road Cafe, Campbell Park, The Nest, The Decorated Dead Tattoo Studio, Darcy's, The Tannery, 1865 Carlton Pl, Astor Hall, Sola Bar & Kitchen, Eastwood & District Conservative Club, Decade of Dance, EX39 4JN, Jorge Wilson + Jesse James, Bridgnorth Castle and Gardens, The Railway Stockport, Spaces Studio) plus today's own evidence file (31 records already searched today) before selecting the 7 genuinely fresh, unflagged candidates to search.

## Concurrency

`data\state\claims\bv2a-enrichment.json` read at firing start held `{"heldBy":null,"releasedAt":"2026-08-28T01:16:00Z","lastRun":"bv2a-enrichment-2026-08-28T00-19-03Z"}` — released. Wrote heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-28T01-17-31Z.json` (`outcome:"started"`) before any gate, then acquired the claim (`heldBy: bv2a-enrichment-2026-08-28T01-17-31Z`, TTL 3h, `expiresAt: 2026-08-28T04:17:31Z`). No `data\state\enrichment.lock` file present (retired per §6A step 2b — not honoured, not recreated).

## Preconditions

Confirmed exactly one Chrome browser connected (`list_connected_browsers`) and logged into Facebook (own timeline visible, "What's on your mind, The Torrists?"). bndy MCP tools reachable (`list_artists`/`list_venues`/`edit_artist`/`get_by_id` all responded normally).

## Work — by tier

**Tier 1 — artists created in the last 24h with missing socials:** `list_artists(createdSince: 2026-08-27T01:17:31Z, missingSocials:true)` returned 12 candidates. 8 already evidenced blank today (skipped, not re-searched). Worked the 4 genuinely fresh ones (Collette, Joe McShane, Preston & Weltz, Agents of Chaos, all created 2026-08-28T01:11:58Z): **1 verified, 3 evidenced blank.**

**Tier 2 — venues created in the last 24h with missing socials:** `list_venues(createdSince, missingSocials:true)` returned 0 candidates.

**Tier 3 — backlog venues missing socials:** `list_venues(missingSocials:true)` returned 37 (down from 46 at firing 00:19:03Z's close — 10 verified, 1 net drop unaccounted for by rounding). Cross-referenced all 37 against standing CTO-INBOX flags and today's evidence file: 30 already accounted for (flagged non-enrichable or searched earlier today). Searched the 7 genuinely fresh candidates — all turned out to be council/parish parks, playing fields or temporary festival/carnival sites with no dedicated own page (same class as the standing Willenhall Memorial Park / Bumble Hole / Bridgnorth Castle and Gardens findings): **0 verified, 7 evidenced blank.** Backlog is effectively saturated for today; confirms the standing `bv2a-venue-backlog-saturated` finding.

**Tier 4 — backlog artists missing socials, oldest `createdAt` first:** paged to `offset:200` of `list_artists(missingSocials:true)` (1403-strong at read time) per the standing `bv2a-firing2219z-tier4-sampling-never-reaches-true-oldest` finding. Sorted locally by `createdAt`, cross-checked against today's evidence file and the §5.4 do-not-attach list (skipped `Jessie James` and `Tracy Morgan` on sight, no search). Worked the oldest 11 genuinely-fresh candidates (`createdAt` 2026-06-25T12:32:16Z through 2026-07-31T18:12:30Z), filling the remaining artist budget exactly: **4 verified, 7 evidenced blank.**

**Tier 5 — artists missing genres with an existing facebookUrl:** not reached — the 15-artist cap was met by Tiers 1 and 4.

## Venues — verified

None this firing (0 of 7 worked).

## Venues — evidenced blank (7)

| Venue | Reason |
|---|---|
| Jubilee Park, Horndean | Council-run public park (Horndean Parish Council); no own page, only a generic pages-directory stub |
| Ann Welfare Playing Fields | Council-leased sports pitches (North Tyneside); no dedicated own page found |
| West Park, Long Eaton | Public park; only third-party Friends/fan pages and an unrelated leisure-centre business found |
| Bowling Green Stage, Nantwich Food Festival | Temporary stage within an annual food festival, not a fixed building (§0.23); only the festival's own page found, not this stage |
| Prestwood Recreation Ground | Parish-council recreation ground; no dedicated own page found |
| Castle playing fields, Thrapston | Community playing fields; only third-party pages found (beer festival, sports association, parkrun) |
| Madeley Carnival, Madeley | Annual carnival event, not a fixed building (§0.23); no page found under this name at all |

## Artists — verified (5, all with quoted content sourced correctly)

| Artist | Field(s) | Evidence |
|---|---|---|
| Preston & Weltz (Greater Manchester UK) | facebookUrl, bio | facebook.com/profile.php?id=61575071597006 — sole exact-name Facebook candidate on both surfaces, Musician/band, bio matches stored duo/covers profile |
| Russ Tippins (North East England UK) | facebookUrl | facebook.com/groups/149460451739601/ — official band group (per group-urls-valid ruling), corroborated by The Fox, Hexham (Northumberland) posting twice about "The Russ Tippins Band" performing there |
| Taylor Forevermore (Stoke-on-Trent, Staffordshire) | facebookUrl, bio | facebook.com/profile.php?id=61586336022979 — sole exact-name Taylor Swift tribute act; Google corroborates performances at Eleven Music Venue, Stoke-on-Trent, inside the stored footprint |
| Rush Hour (Exeter) | facebookUrl, bio | facebook.com/RushHourRnB/ — corroborated by the source's own Lemonrock listing ("Rush Hour, Exeter, Devon") and named members (Marisa/Mike/Andy/Steve) |
| Swamp Hogs (Teignmouth) | bio only | lemonrock.com/swamphogs — source's own listing copy used as bio (no working Facebook page found; candidate profile id redirects dead to meta.com); gig venues all South Devon, consistent with stored Teignmouth |

## Artists — evidenced blank (10)

| Artist | Reason |
|---|---|
| Collette (Greater Manchester UK) | No same-name UK act consistent with Greater Manchester found on either surface; candidates were Bristol/London-based or unrelated |
| Joe McShane (Greater Manchester UK) | Sole candidate's own website resolves to a US-hosted Irish-American traditional singer, non-UK-consistent |
| Agents of Chaos (Greater Manchester UK) | Two competing UK-plausible "Agents of Chaos" band pages found, neither confirms Greater Manchester; left blank per the standing two-candidate-pages precedent |
| Pire Hill (Staffordshire UK) | No match found on either surface |
| Lascel (Staffordshire UK) | No band match; only hit is an unrelated solo singer "Lascel Wood" |
| String Theory (Staffordshire UK) | Multiple same-name bands found, none Staffordshire/UK-consistent |
| Working 4 the Weekend (Greater Manchester UK) | No match found; results were all unrelated ("Working for the Weekend" song, a Loverboy tribute, "Working Weekends" punk band) |
| Got the T-Shirts (Greater Manchester UK) | Closest candidate is "Got the T-Shirt" (singular, name mismatch), no location field, no posts — insufficient evidence |
| DJ Roxa (Torquay) | No match found on either surface |
| unRealBlood (Derby) | No match found on either surface |

## Validator summary line (verbatim)

```
5 records · 4 clean · 0 FAIL · 2 WARN   [mode=gate]
```

The 2 WARNs (`STUB_NO_BIO`, `STUB_NO_IMAGE` on Russ Tippins) are correct behaviour, not a defect: the attached page is a Facebook GROUP, which carries no bio field beyond a bare member-list fragment and exposes no graph picture endpoint the way a page does — both were correctly left empty rather than guessed or invented.

0 FAIL. Batch ships.

## Names corrected under §0.6

None this firing — no name changes were made.

## Ledger / snapshot / run-summary / dashboards

- `data/state/enrichment-ledger.jsonl`: 22 `enrich` lines (5 artist-verified, 17 blank: 3 artist Tier1 + 7 venue Tier3 + 7 artist Tier4) + 1 `snapshot` line appended.
- Snapshot: artistsTotal 3286 (unchanged — this task creates nothing), artistsMissingSocials 1400 (down from 1403), artistsMissingGenres 950 (unchanged — no artist had an empty genres array filled this firing), venuesTotal 3205 (unchanged), venuesMissingSocials 37 (unchanged — no venue writes this firing).
- `data/state/run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 5, skipped 17.
- Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (3059 records, 109 snapshots) and `data/normalized/DASHBOARD.html`.

## Evidence file

`data/state/enrichment-evidence-2026-08-28-enrichment.jsonl` — held 35 lines from the 00:19:03Z firing before this one started; this firing appended 22 capture/search-variant lines (5 verified, 17 evidenced-blank/unenrichable), ending at 57 lines.

## Budget used

**7 venues worked (0 verified + 7 blank) of 30 cap** — backlog effectively saturated after cross-referencing standing flags and today's evidence, so the remaining ~30 candidates were correctly skipped rather than re-searched. **5 verified + 10 blank = 15/15 artists worked**, cap met exactly. Elapsed approximately 53 minutes (heartbeat 01:17:31Z → this report). Circuit breaker did not fire; no hard stop encountered.

## Claim / heartbeat

Claim released (`heldBy: null`, `lastRun: bv2a-enrichment-2026-08-28T01-17-31Z`). Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-28T01-17-31Z.json` updated to `completed`.
