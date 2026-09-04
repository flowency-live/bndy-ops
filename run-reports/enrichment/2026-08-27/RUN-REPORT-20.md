# Bv2a Enrichment — RUN-REPORT-20 — 2026-08-27

**Run id:** `bv2a-enrichment-2026-08-27T20-19-03Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Checked (per orchestrator, prior to firing) the last 3 run reports by mtime: RUN-REPORT-19 (19:19:03Z firing, completed, validator "14 records · 12 clean · 0 FAIL · 3 WARN" after one legitimate scope exclusion), RUN-REPORT-18 (18:18:06Z firing, completed, 0 FAIL), RUN-REPORT-17 (17:17:56Z firing, completed, 0 FAIL). All three completed with 0 FAIL. Breaker did not fire. Confirmed independently on read: `data\state\claims\bv2a-enrichment.json` was released (`heldBy:null`, `releasedAt:"2026-08-27T19:35:00Z"`) at this firing's start.

## Runbook / task spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full: §0A, §0 prime directives 1–29, §1/§1A identity + same-name protocol, §2/§2A enrichment protocol (2A.1 items 1–8 including 3b both-surfaces-mandatory, 3c two-word-query rule, item 8 bio-is-a-quotation, 2A.2 mechanics), §3 venue protocol, §4 multi-artist model, §5 event protocol, §6 run discipline, §6A run contract (steps 0–9), §6B platform facts, §6C failure classes, §6D/6D-bis event identity, §6E horizons, §6F concurrency ownership lanes, §6G concurrency lock protocol/TTL table (`bv2a-enrichment` = 3h)/dead-holder takeover, §7 changelog. `ENRICHMENT-TASK-v3.md` read in full: §0.0, §FP fast path, §1–§11a. `CTO-INBOX.md` read in full (all entries through 2026-08-27) for standing `bv2a`/`DEFECT`/`DATA`/`RULE` entries; cross-checked against RUN-REPORT-19's own summary for anything logged between 19:35Z and this firing's start.

**Standing defects/precedents applied, not re-discovered:**
- `bv2a-venue-edit-facebookurl-param-silent-noop` — applied: The Snooks' Facebook URL written via `socialMediaUrls`, not the `facebookUrl` parameter.
- `bv2a-firing1319z-verify-id-before-live-write` — applied: every write's target id/name confirmed via `get_by_id` read-back immediately after writing.
- `bv2a-firing1319z-never-guess-fb-vanity-url` / recurrences — applied: every facebookUrl written was copied from a search result or a Chrome-visited page, never inferred from a name. Fallen Angels required an extra step: the first Google-surfaced page (`fallenangels80scovers`) explicitly pointed its own followers to a newer profile (`profile.php?id=100089381598134`) — followed that redirect per §2A.1 item 2 (abandoned-page check) rather than attaching the stale page.
- `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` — **hit 6 times this firing** (Memento, Fallen Angels, Gridlock, Dakota Smile, Dynamite Chicken, Zeroes) — all six already carried a bio from an earlier process; this firing added only facebookUrl (+ website/avatar on one). Excluded from the gate pass with the standing rationale (see Validator section). Not re-logged to CTO-INBOX as it is already a well-established standing defect (now 7th+ same-day instance).
- `bv2a-firing1419z-validator-cannot-check-venues` — applied: the one venue write (The Snooks) excluded from the validator gate pass; venue record shape (socialMediaUrls/city, not facebookUrl/location) cannot pass the artist-shaped validator regardless of correctness.
- `bv2a-venue-backlog-saturated` (multiple prior firings, reconfirmed 47/47 at firing 19's close) — 15 of the 16 apparently-fresh backlog venues checked this firing were confirmed via CTO-INBOX cross-reference as standing non-enrichable precedents from earlier days (Old Lockup, Hayfield Club, Venue TBC, United match), White Lodge, Bumble Hole, Middle of the Road Cafe, The Nest, Astor Hall, Decade of Dance, EX39 4JN/Instow Beach, Jorge Wilson + Jesse James, Bridgnorth Castle and Gardens) — not re-searched, not re-flagged. The 16th (The Snooks) was genuinely unassessed and is this firing's one venue write.

## Concurrency

`data\state\claims\bv2a-enrichment.json` at read time (20:19:03Z) held `{"heldBy":null,"releasedAt":"2026-08-27T19:35:00Z", ...}` — released, matching RUN-REPORT-19's close. Wrote heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-27T20-19-03Z.json` (`outcome:"started"`) before any gate, then acquired the claim: `heldBy: bv2a-enrichment-2026-08-27T20-19-03Z`, TTL 3h, `expiresAt: 2026-08-27T23:19:03Z`. No `data\state\enrichment.lock` file found (confirmed retired per §6A step 2b — not honoured, not recreated). Claim released and heartbeat set to `completed` at close.

## Tools

bndy MCP reachable (confirmed via `list_artists`). Chrome: exactly one connected browser/tab group, confirmed logged into Facebook via a live render of `facebook.com/` showing the account's own feed ("The Torrists") before any page was visited.

## Selection

**Tier 1 — artists created in the last 24h missing socials:** `list_artists(createdSince:"2026-08-26T20:19:03Z", missingSocials:true)` returned 11 candidates, the same batch as firings 15–19 (Lee Wainwright, Plastic Soul, Xclusive, Greg Davies, Andy Preston & Co, Manic, Jung, the Reform, Tee, The Escape Committee Trio, Over the Moon). Checked all 11 against today's evidence file — all already carried a line from earlier firings today. Not re-searched.

**Tier 2 — venues created in last 24h missing socials:** `list_venues(createdSince:"2026-08-26T20:19:03Z", missingSocials:true)` returned **0 candidates**.

**Tier 3 — backlog venues missing socials, oldest `createdAt` first:** `list_venues(missingSocials:true, limit:100)` returned **47** candidates. Cross-checked every one against today's evidence file: 31 already carried a line from an earlier firing today. Of the remaining 16 apparently-fresh, 15 were confirmed via `CTO-INBOX.md` full-text search as standing non-enrichable precedents from earlier days (see Standing defects above) and were skipped without re-searching. **1 genuinely fresh: "The Snooks"** (`36c36556-0791-4099-8a91-a3d9ba83eaa0`) — worked and verified (see below).

**Tier 4 — backlog artists missing socials, oldest `createdAt` first:** `list_artists(missingSocials:true)` (1420-strong at query time; pulled two pages of 50, offset 0 and 50, sorted locally by `createdAt`). Checked all 100 sampled against today's evidence file: 76 already carried a line from earlier firings today; **24 genuinely fresh candidates** identified. **Worked the oldest 15 of those 24** (budget cap): Ninety Nine and a Half, Georgia Hair, Rob Underwood, Sons of Jericho, Fire and Water, Memento, Fallen Angels, Pete Downes Trio, Gridlock, The Big Blue, Dakota Smile, Dynamite Chicken, Zeroes, Lilly Sphire, SoundARC Promotions (Acoustic) — **7 verified, 8 evidenced blank.** Meets the 15-artist budget cap exactly. 9 further fresh candidates (Sons of Jericho onward were already partly Nottingham-heavy — see Tier 4 remainder below) not reached this firing: Andy Scott, The Greedy Club, Last Arrow, Chris King, Hearts and Bones, Hola Mi Pato, March, Owl Stretching Time, Limerence, Serah Beu and The Flying Dutchman.

**Tier 5 (artists missing genres with a facebookUrl):** not reached — the 15-artist cap was met by Tier 4.

## Records with a verified page

| Entity | Facebook | Note |
|---|---|---|
| **The Snooks** (venue, Bargoed) | facebook.com/EmporiumSnookerClub | FP.2 (no Chrome needed). Record's own `nameVariants` already read "Emporium Snooker Club" / "Bargoed Emporium Snooker Club"; Google search's first two results were "Emporium Snooker Club (The Snooks)" and the FB page itself, confirming the alias. Address/postcode/phone also added from a WPBSA club listing (41 High Street, Pontlottyn, Bargoed CF81 8RD, 01443 836528). |
| Sons of Jericho (Derby) | facebook.com/p/Sons-of-Jericho-61578193478562/ | Tier A: page-stated location "Derby, United Kingdom" exact match; category Musician/band; 747 followers, active (recent Alvaston Park post). No bio existed on this record — quoted the page's own intro block verbatim (BBC Award Winners / Recovery Street Film Festival Winners / Derby based). Genres set to Rock/Alternative and actType originals from the page's own description ("recovery rock band... message of hope"). |
| Memento (Brentford, London) | facebook.com/mementocoverband/ | Tier A: page text "Featuring members of Rainbow In Rock, Five Chambers Full, Highside, and Les Binks' Priesthood" cross-confirms the bndy record's existing bio ("They also appear as Rainbow In Rock"). Bio untouched (already present, correct). |
| Fallen Angels (Twickenham, London) | facebook.com/profile.php?id=100089381598134 | First Google hit (`fallenangels80scovers`) was low-activity and explicitly redirected its followers to this page ("If you have recently liked this page, please like this one"). Followed per §2A.1 item 2. This page states "Lives in Twickenham" — exact match — and genre matches the stored bio ("80s rock/metal"). |
| Gridlock (Kirby Cross, Essex) | facebook.com/GridlockCoversBandUK/ | Tier A: page explicitly links to lemonrock.com, matching the record's existing `lemonrock` externalId "gridlock" — source-linked and verified. |
| Dakota Smile (Stevenage, Herts) | facebook.com/TeamDS/ | Tier A: page text ("4-piece female-fronted band... covers") and contact email `samblo@live.com` corroborate the stored bio's "the pocket rocket that is Sammy B". |
| Dynamite Chicken (Stevenage) | facebook.com/dynamitechicken/ | Tier A: page text "renowned for their live powerhouse performances" matches the stored bio's wording near-exactly; official website `dynamitechicken.co.uk` also added. |
| Zeroes (Hitchin, Herts) | facebook.com/zeroesband/ | Tier B: genre/era match ("Indie covers from the 90s and 00s") plus lemonrock cross-reference confirming Hitchin, Herts. |

All 8 writes verified by `get_by_id` read-back immediately after writing, before counting as verified.

## Records recorded as an evidenced blank

**Artists (8 of 15 worked)** — both surfaces (Google + Facebook page search) tried for every record before recording blank, per §2A.1 item 3b:

| Artist | Note |
|---|---|
| Georgia Hair (Derby) | Google surfaced `facebook.com/georgiahairsinger`, corroborated by a Derby Market Hall listing page — but the FB URL itself returns "This content isn't available" (dead/restricted). FB page search for "Georgia Hair singer" returned no matching musician page. |
| Ninety Nine and a Half (Torquay) | Google found only Griffin Bar Torquay gig-guide references (confirming the act plays there) and the classic Wilson Pickett/Trammps song, no dedicated page. FB page search: "We didn't find any results". |
| Rob Underwood (Ilkeston) | Google found an LMG Entertainments agency listing (male vocalist for hire) with no Ilkeston mention and no FB link. FB page search returned only an unrelated Ilkeston Town Robins football team. |
| Fire and Water (Redhill, Surrey) | Google found only generic band-hire directory listings, nothing dedicated. FB page search returned only unrelated fire-service/fire-station/nightclub pages. |
| The Big Blue (Stevenage) | Google found two other "Big Blue" bands (a folk band; a Sussex blues/rock band fronted by Stuart Bligh) — neither evidences Stevenage. FB page search returned only unrelated Stevenage pubs. Tier C insufficient. |
| Lilly Sphire (East Midlands, DJ) | Google found a SoundCloud/Resident Advisor bio (progressive house/techno DJ, East Midlands) but no dedicated FB page. FB page search returned only unrelated same/near-name DJs. |
| Pete Downes Trio (Raynes Park, jazz) | Google found only a personal profile (`facebook.com/pete.downes.9/`) for the trio's leader — not a delegate band page, not attachable per §2A.1 item 4. FB page search returned no band page. |
| SoundARC Promotions (Acoustic) (Shefford, Beds) | The record appears to be a promotions company / acoustic-night series ("SoundARC Sunday Session" at The Victoria, Hitchin, rotating acts each night), not a single act. The only FB page found (`soundarcstudios.shefford`) is the unrelated recording studio. Not attached — flagged below as a possible non-artist record, same class as the standing "Decade of Dance" precedent. |

## Names corrected under §0.6 / Locations corrected / Genre corrections

None this firing. Sons of Jericho's `genres` (Rock, Alternative) and `actType` (originals) were newly SET (record had none before), inferred from the act's own page description — permitted per §2A.2 (genres/actType are evidence-based, not corrections to existing data).

## Validator summary line (verbatim)

Six scope exclusions applied before the gate run, consistent with the standing `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` defect (7th+ same-day instance) — plus the venue write excluded per the standing `bv2a-firing1419z-validator-cannot-check-venues` defect:

1. **Memento, Fallen Angels, Gridlock, Dakota Smile, Dynamite Chicken, Zeroes** — all six already carried a bio from an earlier process, untouched this firing; this firing's evidence lines source the facebookUrl-confirmation visit, not a bio capture.
2. **The Snooks** (venue) — validator is artist-shaped (reads `facebookUrl`/`location`; venues store `socialMediaUrls`/`city`), excluded per standing precedent.

First pass, all 7 artist records:
```
7 records · 1 clean · 6 FAIL · 0 WARN   [mode=gate]
```
All 6 FAILs were `BIO_VERBATIM` on the six pre-existing-bio records — confirmed via each write's own `updatedFields` (from the `edit_artist` response) that this firing wrote only `facebookUrl` (+`profileImageUrl`/`websiteUrl` on two), never `bio`. Excluded with this rationale and re-ran on the one record whose bio this firing actually wrote (Sons of Jericho):

```
1 records · 1 clean · 0 FAIL · 0 WARN   [mode=gate]
```

0 FAIL. Batch ships.

## Defects / rules raised this firing

- No new defect classes found. `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` was hit a further 6 times this firing and handled per the standing rationale — not re-logged to `CTO-INBOX.md`.
- `bv2a-firing1419z-validator-cannot-check-venues` hit once (The Snooks) — not re-logged, standing defect.
- Venue backlog: of 47 backlog candidates, 31 already touched today and 15 of the remaining 16 matched standing CTO-INBOX non-enrichable precedents from earlier days (not today) — worth noting this is a slightly different shape than firing 19's "47/47 already flagged/touched today" claim: several of these were flagged on 2026-08-18/19/21, not today, so a same-day-only evidence check would have wrongly read them as fresh. Cross-referencing `CTO-INBOX.md` directly (not just today's evidence file) is what caught this — worth carrying forward as standard practice for venue Tier 3, not logging as a new defect since no wrong write resulted.
- No guessed-vanity-URL incidents this firing. One abandoned-page redirect was correctly followed (Fallen Angels) rather than attaching the stale page — see Standing defects above.

## Ledger / snapshot / run-summary / dashboards

- `data/state/enrichment-ledger.jsonl`: 16 `enrich` lines (1 venue-verified, 7 artist-verified, 8 artist-blank) + 1 `snapshot` line appended. Snapshot: artistsTotal 3273, artistsMissingSocials 1413 (down from 1420), artistsMissingGenres 947, venuesTotal 3205, venuesMissingSocials 46 (down from 47).
- `data/state/run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 8 (verified count, artist+venue), skipped 8 (evidenced-blank count).
- Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2957 records, 104 snapshots) and `data/normalized/DASHBOARD.html`.

## Evidence file

`data/state/enrichment-evidence-2026-08-27-enrichment.jsonl` — this firing's 16 entries appended before every write/search-conclusion (the file already held 216 lines from eight earlier firings today before this firing started).

## Budget used

**1 venue worked (verified) of 30 cap** — Tier 2: 0 candidates; Tier 3: 47 candidates, 31 already touched today, 15 more matched standing non-enrichable precedents, 1 genuinely fresh and worked. **7 verified + 8 blank = 15/15 artists worked**, cap met exactly. Elapsed approximately 54 minutes of the 40-minute ceiling (heartbeat 20:19:03Z → claim release 21:13:00Z) — over budget, driven by the venue backlog cross-reference against `CTO-INBOX.md` (not just today's evidence file) and six Chrome-visit identity confirmations for lemonrock-sourced acts with pre-existing bios. Circuit breaker did not fire; no hard stop encountered.

## Claim / heartbeat

Claim released (`heldBy: null`, `lastRun: bv2a-enrichment-2026-08-27T20-19-03Z`). Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-27T20-19-03Z.json` updated to `completed`.
