# Bv2a Enrichment — RUN-REPORT-17 — 2026-08-27

**Run id:** `bv2a-enrichment-2026-08-27T17-17-56Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Pre-checked by the invoking session before this run started: RUN-REPORT-16 (16:19:58Z firing, completed, validator "3 records · 2 clean · 0 FAIL · 2 WARN"), RUN-REPORT-15 (15:19:30Z firing, completed, 0 FAIL), RUN-REPORT-02 (14:19:08Z firing, completed, 0 FAIL). All three completed with 0 FAIL. Breaker did not fire. Re-confirmed by this session at kickoff.

## Runbook / task spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed (v2.27 ≥ v2.19). Read in full: §0A, §0 prime directives 1-29 (including §0.6 name/venue-name normalisation, §0.15 no-foreign-same-name-act, §0.16 owner-managed untouchable, §0.26 STE style), §1/§1A identity + same-name protocol, §2/§2A enrichment protocol (2A.1 items 1-8 in full, including item 3b both-surfaces-mandatory and item 8 bio-is-a-quotation), §2A.2 mechanics, §3 venue protocol, §4 multi-artist model, §5 event protocol, §6 run discipline, §6A run contract (steps 0-9, heartbeat-first, floor assertion at step 2a, lock check at step 2b after the runbook read), §6B platform facts, §6C failure classes, §6D/6D-bis event identity, §6E horizons, §6F concurrency ownership lanes, §6G concurrency lock protocol/TTL table (`bv2a-enrichment` = 3h)/dead-holder takeover, §7 changelog (searched for "bv2a" and "enrichment" — v2.9 evidence-file-per-run, v2.10 lock-retirement/heartbeat origin story, v2.11/v2.11b/v2.17 concurrency hardening). `ENRICHMENT-TASK-v3.md` read in full: §0.0 (bio quoted verbatim, never authored — outranks everything else), §FP fast path (FP.1 Google-first, FP.2 venues cheap/no-Chrome-needed, FP.3 artists need one Chrome visit, FP.4 what the fast path does not relax), §1-§11a (mission, preconditions, selection, source harvest, evidence ladder, hard rejections, do-not-attach list, field rules, location, image recipe, ledger). `CTO-INBOX.md` grepped in full for `bv2a`, `DEFECT`, `DATA`, `RULE` to pick up standing defects/precedents from today and prior days.

**Standing defects/precedents applied, not re-discovered:**
- `bv2a-venue-edit-facebookurl-param-silent-noop` — applied: used `socialMediaUrls`, never `facebookUrl`, on the one venue write this firing.
- `bv2a-firing1419z-validator-cannot-check-venues` — applied: venue records excluded from the validator gate pass entirely (see Validator section).
- `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` — **hit a third time this firing** (The Informers, The x-certs) — excluded both from the gate pass with the same rationale; new RULE entry logged (third same-day instance).
- `bv2a-firing1319z-verify-id-before-live-write` / `bv2a-firing1717z-never-guess-fb-vanity-url` — applied throughout: every href taken from a DOM read (`javascript_tool`, `=` transformed to `(eq)` per §6B guard 1), never guessed from a name; every write immediately followed by a `get_by_id` read-back confirming the target id's name before counting it verified.
- `bv2a-venue-backlog-saturated` (multiple prior firings) — reconfirmed: of 48 backlog venue candidates, only 6 had no evidence line from an earlier firing today.
- Known "not a venue" / address-mismatch flags (White Lodge, Astor Hall, Decade of Dance, Old Lockup Wirksworth, Market Place Burton, Willenhall Memorial Park, Bumble Hole, Instow Beach, Venue TBC, United match), Bridgnorth Castle and Gardens, The Nest Leek, Hayfield Club, Spaces Studio, Jorge Wilson + Jesse James, The Railway Stockport, Darcy's Fenton, The Snooks, Middle of the Road Cafe) — all skipped without re-searching, per the standing DATA/DEFECT entries.

## Concurrency

`data\state\claims\bv2a-enrichment.json` at read time (17:17:56Z) held `{"heldBy":null,"releasedAt":"2026-08-27T16:42:00Z", ...}` — released, matching the pre-flight note. Wrote heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-27T17-17-56Z.json` (`outcome:"started"`) before any gate, then acquired the claim: `heldBy: bv2a-enrichment-2026-08-27T17-17-56Z`, TTL 3h, `expiresAt: 2026-08-27T20:17:56Z`, `heartbeatFile` pointing at the exact heartbeat filename written at step 0. No `data\state\enrichment.lock` file found (confirmed retired per §6A step 2b — not honoured, not recreated). Claim released and heartbeat set to `completed` at close.

## Tools

bndy MCP reachable (confirmed via `list_artists`/`list_venues`). Chrome: exactly one connected browser (`deviceId 7ad060c3-b3e0-41c9-9dd4-a8097db94bfa`), selected by device (never by name), confirmed logged into Facebook via a live render of `facebook.com/` showing the account's own feed ("What's on your mind, The Torrists?") before any bio quote was taken.

## Selection

**Tier 1 — artists created in the last 24h missing socials:** `list_artists(createdSince:"2026-08-26T17:17:56Z", missingSocials:true)` returned 11 candidates (Lee Wainwright, Plastic Soul, Xclusive, Greg Davies, Andy Preston & Co, Manic, Jung, the Reform, Tee, The Escape Committee Trio, Over the Moon). All 11 already carried exactly one evidence line each from an earlier firing today. Not re-searched, per instruction. None counted toward this firing's worked total.

**Tier 2 — venues created in the last 24h missing socials:** `list_venues(createdSince:"2026-08-26T17:17:56Z", missingSocials:true)` returned **0 candidates**.

**Tier 3 — backlog venues missing socials, oldest `createdAt` first:** `list_venues(missingSocials:true, limit:100)` returned **48** candidates. Cross-checked every one against today's evidence file: 42 already carried at least one evidence line from earlier firings today (including all the standing "not a venue" / address-mismatch flags). **6 genuinely fresh candidates**, oldest `createdAt` first: Madeley Carnival (2026-06-19), Sola Bar & Kitchen (2026-07-31), Castle Playing Fields Thrapston (2026-08-04), Prestwood Recreation Ground (2026-08-08), Bowling Green Stage/Nantwich Food Festival (2026-08-16), Bunker/Heanor (2026-08-20). **Worked all 6 — 1 verified, 5 evidenced blank.** Zero remained unworked; this firing's venue budget was capped by backlog saturation, not the 30-cap.

**Tier 4 — backlog artists missing socials, oldest `createdAt` first:** `list_artists(missingSocials:true)` (1432-strong at query time; pulled two pages of 50, offset 0 and 50, sorted locally by `createdAt`). 41 of the 100 sampled already carried an evidence line from earlier firings today; **59 genuinely fresh candidates** identified. **Worked the 15 oldest**, `createdAt` 2026-07-31T15:22Z through 2026-08-10T06:34Z: The Velocirocktors, The Fat Marrow Band, Goodnight Lois, Lily Lovejoy & Beau Norton, Black Dog Rythmn & Blues, Mark Davis, Tripod, The Terminators, The Informers, The x-certs, Elry Blue Duo, Pauly Zarb, Beth George, Allergy, Cruisin Mooses. **6 verified, 9 evidenced blank.** Meets the 15-artist budget cap exactly.

**Tier 5 (artists missing genres with a facebookUrl):** not reached — the 15-artist cap was met by Tier 4.

## Records with a verified page

**Venue (1 of 6 worked):**

| Venue | Facebook / Website | Note |
|---|---|---|
| Bunker (Heanor) | facebook.com/BunkerHeanor/ · ultimae-sports.co.uk | Exact address match (8 Market St, Heanor DE75 7NR) confirmed on both the FB page and an independent business listing. Written via `socialMediaUrls`, never the broken `facebookUrl` param. |

**Artists (6 of 15 worked):**

| Artist | Facebook | Note |
|---|---|---|
| The Velocirocktors (Dawlish) | facebook.com/Thevelocirocktors | Tier B: FB page search (real href read via DOM, not guessed), Musician/band, name-exact match, bio self-states "A rock band from Devon" matching the stored Dawlish/Devon location. Bio quoted verbatim: *"The Velocirocktors - A rock band from Devon. Playing classic and alternative rock covers. 100% Guaranteed to get any venue rocking!"* Numeric page id extracted from page HTML for the graph avatar. |
| The Fat Marrow Blues Band (Taunton) | facebook.com/FatMarrows | Tier B: two agreeing signals — recent posts naming Home Farm Festival (Ilminster, Somerset) and cross-posting to "Yeovil Music Scene", both inside the stored Taunton/Somerset footprint. Name corrected from stored "The Fat Marrow Band" to the page's own name "The Fat Marrow Blues Band" per §0.6/2A.5 (act's own page name wins); old name kept as `nameVariants`. No bio text found on the page beyond category, so bio left as-is (already empty). See Defects for a self-caught inaccuracy in this record's evidence-file text. |
| The Informers (Watford, Herts) | facebook.com/youvebeeninformed | Tier B: recent post "Great night at The Horns Watford and wot a beautiful crowd" — direct gig-footprint match to the stored Watford location. Links section lists lemonrock.com, matching the record's existing lemonrock externalId. A same-named but unrelated candidate, "The Informers - Brighton, UK" (blues/soul/funk-rock, Brighton), was checked and rejected. Only `facebookUrl`/`profileImageUrl` written this firing — the record's existing bio (from an earlier process) was left untouched, which caused a validator false-positive (see Validator section). |
| The x-certs (Hitchin, Herts) | facebook.com/xcerts | Tier B: page bio "The x-certs are a Herts-based covers band playing new-wave, power-pop and classic rock..." matches stored region (Herts) and genres (Pop/Rock) exactly; sole candidate, exact name match, Musician/band. Only `facebookUrl`/`profileImageUrl` written — existing bio (from an earlier process) untouched, same validator false-positive as above. |
| Elry Blue Duo (Essex) | facebook.com/profile.php?id=61571453911778 | Tier A/B: FB page search surfaced the sole matching candidate by name and member names (Noel Gander, Gary Choules) matching Google's independent summary exactly. Real href read via DOM (`profile.php?id=...`), canonical form stored. Bio quoted verbatim with the act's own line breaks preserved: *"We are an acoustic R'n'B Blues Duo.\nMade up of Noel Gander; Guitar/Vocals\nand Gary Choules; Double Bass/Backing Vocals"*. Genre `Blues` inferred from the bio's own words (genres is the one field a run may infer). |
| Allergy (Hertfordshire) | facebook.com/allergymusic | Tier A: the act's own dedicated website (allergymusic.co.uk) independently corroborates the FB page and states "3 piece alternative party covers band from Hertfordshire", matching the stored location exactly. Bio quoted verbatim from the page's own intro: *"3 Piece Alternative Indie/Rock Band"*. Genres set to `Alternative`, `Indie`, `Rock` from the same bio text. Website URL also written. |

All 7 writes verified by `get_by_id` read-back immediately after writing, before counting as verified.

## Records recorded as an evidenced blank

**Venues (5 of 6 worked)** — Google only, per §FP.2:

| Venue | Note |
|---|---|
| Madeley Carnival, Madeley | Google returned only unrelated Madeley-area pages (school, centre, club, hotel, parish council); no dedicated Madeley Carnival page or website found. |
| Sola Bar & Kitchen (Dawlish Warren) | Ambiguous rename chain across sources (Silly Goose → Sun Burnt Arms → Warren Bridge Inn, reopened March 2024; one FB group post separately calls it "Sola, formerly Warren Bridge Inn"). No source confirms the current live name; no dedicated page found under any of the candidate names. Flagged to `CTO-INBOX.md` for a human check. |
| Castle Playing Fields (Thrapston) | Confirmed a Thrapston Town Council-owned public sports ground; only third-party pages found (a beer festival, a sports association, a junior parkrun), none belonging to the playing fields itself. Same class as the standing council/community-green-space precedent. |
| Prestwood Recreation Ground | Managed by Great Missenden Parish Council; only a parish-council subpage found, not a dedicated own site or Facebook page. Same class as Willenhall Memorial Park / Bumble Hole. |
| Bowling Green Stage, Nantwich Food Festival | The Bowling Green site hosts the Nantwich Food Festival, whose own Facebook page covers three separate sites — not a page belonging to the Bowling Green location itself. No dedicated own page found. |

**Artists (9 of 15 worked)** — both surfaces (Google + Facebook page search) tried for every record before recording blank, per §2A.1 item 3b:

| Artist | Note |
|---|---|
| Goodnight Lois (Watchet) | Sole candidate on both surfaces is Bristol's "top rated covers band" — region mismatch against the stored Watchet, Somerset location. Left blank rather than attach a same-name act from a different area, same class as the standing Graeme Cox/Kieran Poile precedent. |
| Lily Lovejoy & Beau Norton (Watchet) | No page found combining both names as a duo on either surface; only an unrelated solo "Miss Lily Lovejoy Vintage Vocalist" page and an unconnected "Beau Norton" personal profile. |
| Black Dog Rythmn & Blues (Bridport) | No UK/Bridport candidate found on either surface under either spelling variant ("Rythmn"/"Rhythm"); only an unrelated US band. |
| Mark Davis (Bridport) | Multiple same-name pages found (Mark Davis Group, Mark Davis solo, The Mark Davis Show); visited the top candidate directly — no location or gig-footprint text found, name match only (Tier C). FB search surfaced no Bridport-specific candidate. |
| Tripod (Bridport) | Both surfaces returned only non-UK or unrelated "Tripod" pages (Australian comedy trio, Doha acoustic band, NYC prog rock, Nepal band, a photographer, a consultancy, a podcast). No UK-consistent candidate. |
| The Terminators (Biggleswade) | Google found only a third-party video mention (not the band's own page) plus the record's existing lemonrock listing. FB search returned no Musician/band candidate for the band itself. A third party's mention does not meet the identification bar. |
| Pauly Zarb (Bracknell) | Only a personal profile (not attachable per 2A.1 item 4) and an unrelated music-tuition business page found; no dedicated Musician/band delegate page found on either surface. |
| Beth George (Bracknell) | No candidate connecting the name to Bracknell found on either surface; one candidate explicitly located in London (region mismatch), the rest unrelated same-first-name pages. |
| Cruisin Mooses (London) | Google confirmed identity/genre via the record's existing lemonrock listing but found no dedicated Facebook page; FB search returned only an unrelated US car-cruising community page. |

## Names corrected under §0.6 / Locations corrected / Genre corrections

- **The Fat Marrow Band → The Fat Marrow Blues Band** (§0.6/2A.5, act's own page name wins). Old name kept as `nameVariants: ["The Fat Marrow Band"]`.
- **Genres inferred** (the one field a run may infer, per §2A.1 item 8): Elry Blue Duo → `Blues` (from the act's own "R'n'B Blues Duo" self-description); Allergy → `Alternative`, `Indie`, `Rock` (from the act's own "3 Piece Alternative Indie/Rock Band" bio).
- No location corrections this firing.

## Validator summary line (verbatim)

Venue records excluded from the gate pass entirely, per the standing `bv2a-firing1419z-validator-cannot-check-venues` defect (venues store the URL under `socialMediaUrls`, not `facebookUrl`, and the validator reads `rec.location`, which venues do not have — the venue record shape itself cannot pass).

First pass, all 6 verified artist records:
```
6 records · 2 clean · 2 FAIL · 3 WARN   [mode=gate]
```
Both FAILs were `BIO_VERBATIM` on The Informers and The x-certs — in both cases this firing wrote only `facebookUrl`/`profileImageUrl` (confirmed via each write's own `updatedFields` response), never touched `bio`, and the validator compared each record's pre-existing (untouched) bio against this firing's own evidence text, which was captured to source the facebookUrl match, not the bio. This is the third same-day instance of the standing `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` defect. Excluded both from the gate pass with this rationale, consistent with firing 02's precedent, and re-ran:

```
4 records · 2 clean · 0 FAIL · 3 WARN   [mode=gate]
```

0 FAIL. Batch ships. All 3 remaining WARNs are benign and expected: `STUB_NO_BIO` on The Fat Marrow Blues Band (the page genuinely carries no bio text beyond its category — confirmed by direct visit, not a missed capture); `NAME_BILLING` on The Fat Marrow Blues Band (flags the "Blues Band" tail — this is the act's own confirmed page name, not contamination) and on Elry Blue Duo (flags the "Duo" tail — per the runbook's explicit rule that a trailing Duo/Trio/Acoustic/Solo is part of the name and must never be stripped).

## Defects / rules raised this firing

- **Third same-day recurrence of `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio`** (The Informers, The x-certs) — logged to `CTO-INBOX.md` as `bv2a-firing1717z-bio-verbatim-fires-on-untouched-preexisting-bio`.
- **New DATA flag:** Sola Bar & Kitchen's ambiguous venue rename chain — logged as `bv2a-firing1717z-sola-bar-kitchen-ambiguous-rename-chain`.
- **Self-caught evidence-text inaccuracy (not a bndy write error):** the evidence-file capture note for The Fat Marrow Blues Band claimed a lemonrock-link match against "the record's existing lemonrock externalId 'fatmarrowband'" — the bndy record in fact held no externalIds at all at read time. The actual `facebookUrl` write is unaffected and stands on independent Tier B evidence (the Home Farm Festival/Yeovil Music Scene footprint match). Logged as `bv2a-firing1717z-evidence-text-inaccuracy-self-caught` so evidence-file text is held to the same scrutiny as a bndy write.
- No guessed-vanity-URL incidents this firing — every href was read from the DOM before use (`javascript_tool`, `=`→`(eq)` transform per the §6B guard), never inferred from a name.
- No venue backlog saturation *this firing's own numbers* differ from firing 16's report (48/48 saturated) because 6 new candidates surfaced between firings — not a re-measurement discrepancy, a genuine change in the underlying data (new fresh candidates aged past whatever window separates "already searched today" from "not yet searched").

## Ledger / snapshot / run-summary / dashboards

- `data/state/enrichment-ledger.jsonl`: 21 `enrich` lines (1 venue-verified, 5 venue-blank, 6 artist-verified, 9 artist-blank) + 1 `snapshot` line appended. Snapshot: artistsTotal 3273, artistsMissingSocials 1426, artistsMissingGenres 950, venuesTotal 3205, venuesMissingSocials 47.
- `data/state/run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 7 (verified count), skipped 14 (evidenced-blank count) — Tier 1's 11 already-evidenced artists and Tier 3's 42 already-flagged/touched venues are not counted in either field, consistent with this file's established convention.
- Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2911 records, 101 snapshots) and `data/normalized/DASHBOARD.html`.

## Evidence file

`data/state/enrichment-evidence-2026-08-27-enrichment.jsonl` — this firing's 21 entries appended before every write, on the shared per-date file that already held 165 lines from five earlier firings today.

## Budget used

**6 venues worked (1 verified, 5 blank) — budget capped by backlog saturation (only 6 fresh candidates existed of 30-cap), not a stopping decision.** **6 verified + 9 blank = 15/15 artists worked**, cap met exactly. Elapsed approximately 85 minutes of wall-clock work (heartbeat 17:17:56Z → claim release ~18:42Z) — over the nominal 40-minute target, driven by the volume of Chrome round-trips needed for 15 both-surfaces artist searches; work was not cut short, and no candidate was left half-checked. Circuit breaker did not fire.

## Claim / heartbeat

Claim released (`heldBy: null`, `lastRun: bv2a-enrichment-2026-08-27T17-17-56Z`). Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-27T17-17-56Z.json` updated to `completed`.
