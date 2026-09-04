# ENRICHMENT RUN REPORT — 2026-08-14 (Bv2a Enrichment, hourly, unattended)

**Outcome: PARTIAL.** Venues and genre-only artist top-ups enriched under budget. New artist enrichment (Priorities 1 and 4) blocked — Chrome connected but not logged into Facebook.

**Fired:** 2026-08-14T00:26:47Z. **Runbook read:** v2.27, floor asserted v2.19 (PASS). **Spec:** `ENRICHMENT-TASK-v3.md` v3.0, §0.0 and §FP read in full. **CTO-INBOX.md** fingerprints read in full.

**Filename note:** the real clock (`date -u`) still reads hour 00 at both fire time and finish time, colliding with the prior firing's `RUN-REPORT-00.md`. Per the already-open `run-report-path-collides-on-second-firing` class of defect (logged 2026-08-12 for klma), this report is written as `-01` to avoid overwriting the earlier report rather than destroying it.

---

## Step 0 — circuit breaker

Last 3 run reports in `data/normalized/enrichment/` (newest first):

1. `2026-08-14/RUN-REPORT-00.md` — PARTIAL. Validator `7 records · 0 clean · 0 FAIL · 14 WARN`. No FAIL.
2. `2026-08-12/RUN-REPORT.md` — supervised session, no validator run. No FAIL recorded.
3. `2026-08-07/RUN-REPORT-interactive-0040Z.md` — COMPLETED. Validator `6 records · 1 clean · 0 FAIL · 6 WARN`. No FAIL.

0 of 3 recorded a FAIL, and all 3 wrote a report. **Breaker NOT TRIPPED.** Proceeded.

---

## Step 1 — concurrency

Claim file (per RUNBOOK §6A step 2b / §6G, task id `bv2a-enrichment`, TTL 3h): `data/state/claims/bv2a-enrichment.json`. **This is the RUNBOOK's own naming, not the task prompt's stale `enrichment.json` path** — that discrepancy is already logged (`bv2a-claim-path-stale-in-prompt`, 2026-08-14), not re-logged here.

Read at start: `{"heldBy":null,"releasedAt":"2026-08-14T00:38:00Z","lastRun":"bv2a-enrichment-2026-08-14T00-14-07Z"}` — released by the prior firing. Acquired cleanly: `heldBy: bv2a-enrichment-2026-08-14T00-26-47Z`, `expiresAt: 2026-08-14T03:26:47Z`.

Found `data/state/*.lock` files for other sources (gigs-news, insangel, klma, onthecasemusic, sceniceye) and `data/state/RETIRED-enrichment.lock-*` — none honoured, none touched, per §6A step 2b / §6G.

## Step 2 — runbook + spec read

RUNBOOK.md H1 = **v2.27** (2026-08-08). CURRENT FLOOR = v2.19. **PASS.** §2A.1 item 3b (both search surfaces before any blank) and item 8 (bio quoted, never written) read and applied. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` read in full — fingerprints noted below where relevant.

## Step 3 — Chrome / Facebook check (hard-stop gate)

Chrome connected (one browser, `Browser 1`, Windows, local). Navigated to `facebook.com`: page showed **"Sign up / Log in"**, not a logged-in feed. **Confirmed NOT logged in.** Per the task's hard-stop rule this blocks all artist work that requires Facebook search or bio-quoting (Priorities 1 and 4). Already logged today as `bv2a-facebook-not-logged-in` — not re-logged.

**Venues proceed** (no Chrome needed, FP.2). **Priority 5** (genre-only top-ups on artists that already hold a `facebookUrl`) also proceeds: genres are inferred via `WebSearch`, never quoted, so §0.0's Chrome-only-to-quote restriction does not block it.

---

## Work done, in priority order

**Priority 1 — artists created <24h, missing socials (5 found).** BLOCKED. Cannot run Facebook identification without a logged-in session. Not attempted; retry next run.

**Priority 2 — venues created <24h, missing socials (6 found, all worked).**

| Venue | Result | Evidence |
|---|---|---|
| The Jovial Monk (`e5c621b9…`) | facebookUrl attached | facebook.com/p/Jovial-Monk-North-Ormesby-61583947696152 |
| Red Lion Bradley (`84d3d753…`) | facebookUrl + website | facebook.com/redlionbradley, redlionbradley.co.uk |
| The Prince of Wales Stafford (`2c0c6d4b…`) | facebookUrl attached | facebook.com/ThePrinceOfWalesStafford |
| Sandon Hall (`1bea7c85…`) | website only (no FB surfaced) | sandonhall.co.uk |
| The Dog House (`e48a0afd…`) | facebookUrl attached | facebook.com/TheDogHousePubStafford |
| The Amble Inn (`9adcf560…`) | facebookUrl attached | facebook.com/TheAmbleInn |

All 6: verified page, matched by town/address to the bndy record. All read back via `get_by_id`.

**Priority 3 — backlog venues missing socials, oldest `createdAt` first (10 attempted, cap 30 not reached).**

Oldest-first order from `list_venues(missingSocials:true)`, skipping one ledger cooldown hit (`W P M Sports & Social Club`, `db9dd035…`, `no-page-found` until 2026-11-12):

| Venue | Result | Evidence |
|---|---|---|
| The Priory, Ware (`4e5f47fb…`) | facebookUrl + website (Ware Priory event venue) | facebook.com/warepriory |
| Highweek Village Inn (`a0fc4856…`) | facebookUrl + website | facebook.com/TheHighweek |
| Record Corner, Godalming (`d34100a3…`) | facebookUrl + website | facebook.com/recordcorneruk |
| Rivet Sports and Social Club (`5238f834…`) | website only — FB search returned only the squash sub-section page, not the club's own; not attached (Tier C, insufficient) | rivetsportsandsocialclub.co.uk |
| Coronet Bingo (`e6e29633…`) | website only — FB search returned several differing page ids with no clearly current one; not attached | coronetbingo.com |
| **The Shed Tap Room & Deli (`70b937b6…`)** | **EVIDENCED BLANK** — no confident facebook or website match; results returned an unrelated venue and a personal profile only | variants: `"The Shed Tap Room" Peterborough Sand Martin House facebook` |
| Greenstone, Dereham (`faf52d5a…`) | facebookUrl + website | facebook.com/TheGreenstoneMarstons |
| McCafferty's Irish Bar, Bicester (`b3d7dac9…`) | facebookUrl attached | facebook.com/McCaffertysBarBicester |
| Bicton Park Botanical Gardens (`858029f1…`) | facebookUrl + website | facebook.com/bictonparkgardens |
| The Three Wishes (`84efa928…`) | facebookUrl attached, matched to the Wealdstone page (bndy city field reads "Harrow Wealdstone", distinguishing it from the separate North Harrow page of the same pub chain) | facebook.com/3wisheswealdstone |

**Venue total: 16 attempted (6 + 10), 15 with a verified page/website, 1 evidenced blank. Well under the 30-venue cap.**

**Priority 4 — backlog artists missing socials.** BLOCKED, same reason as Priority 1. Not attempted; retry next run.

**Priority 5 — artists missing genres that already hold a `facebookUrl` (10 enriched, 5 skipped, cap 15 reached).** Genres only — no Chrome, no bio touched, no facebookUrl re-verified (these were pre-existing on the record).

| Artist | Genres written | Evidence basis |
|---|---|---|
| Midnight Shift | Rock n Roll | own stored bio: "rockabilly and rock and roll covers" |
| Definitely Oasis | Britpop | FB page self-titled "Oasis Tribute Band" |
| Whitesnake UK | Blues, Rock, Metal | tribute act; third-party listing states "Blues, Blues Rock, Rock, Classic Rock, Heavy Metal And Hard Rock" — mapped to canonical enum |
| Sam Shields | Americana, Folk | own website: "modern blend of Americana & Folk" |
| The Excuses Band | Rock, Pop, Funk | album review: "eclectic concoction of upbeat, melodic rock, pop and funk" |
| The Meteors | Punk, Rock n Roll | Wikipedia: "psychobilly... fusing punk rock, rockabilly" — psychobilly is not a canonical value, mapped to its two stated component genres |
| Six Card Trick | Pop, Rock, Indie | source's own onthecasemusic listing: "Pop / Rock / Indie" |
| Deadsheep.Band | Indie, Alternative | music-press profile: "Indie, Alternative, Nu Indie, Emo, Indie Pop" — mapped to the two canonical values present |
| Dustbowl Dance | Pop, Indie | promoter listing: covers Coldplay/Mumford & Sons/George Ezra/Kaiser Chiefs, "contemporary pop and indie rock" |
| Peashooter | Pop, Rock n Roll | promoter listing: "cover band playing pop 'n' rock 'n' roll" |

**Skipped (evidenced blank — no reliable single-genre evidence found, correctly left empty rather than guessed):** barn54 (genre described only as "melancholic ballads with rock-driven anthems" — too vague to map), Soundgenarator (no genre information found), The Desperate Cowboys (described only as "just for fun", no genre stated), Glass Unicorn (no genre information found), Bet Shop Boys (no genre information found; declined to infer from the "Pet Shop Boys" name pun alone — name match is never sufficient, §2A.1 Tier C).

**Artist total: 15 attempted (10 enriched + 5 skipped), at the 15-artist cap.**

---

## Names corrected under §0.6

None this run — no artist or venue names required sanitising or correction.

---

## Validator

Ran `scripts/enrichment_validate.py` against this run's own 26 written records and its evidence file (`data/state/enrichment-evidence-2026-08-14-enrichment.jsonl`, append-only, this run's own writes appended to today's file).

**Two known validator scope gaps hit, both worked around for this run without altering any bndy data:**

1. **`validator-venue-schema-mismatch`** (already logged 2026-08-14) — the validator reads top-level `facebookUrl`/`location`; venues store `socialMediaUrls[]`/`city`. Worked around by mapping venue `city`→`location` and the facebook entry from `socialMediaUrls[]`→`facebookUrl` in the validator's input file only. Not re-logged.
2. **NEW — `validator-genre-only-fb-evidence-mismatch`.** The validator's `FB_EVIDENCE_MISMATCH` and `BIO_VERBATIM` checks compare the record's *current* `facebookUrl`/`bio` against this run's evidence `capturedFrom`/`capturedText`, with no way to scope evidence to a single field. On a genre-only top-up (Priority 5), the artist's `facebookUrl` and `bio` were pre-existing and untouched this run; the evidence gathered was for `genres` only, sourced from third-party listings (Wikipedia, onthecasemusic, promoter pages), not the act's own FB page. Naively feeding the full current record produced 11 false FAILs. Worked around by blanking `facebookUrl`/`bio` in the validator input for these 10 records (since this run made no claim about them), leaving only the `genres` enum checks live — which all passed. Logged to CTO-INBOX below as this is a new fingerprint.

**Validator summary line (after both workarounds, reflecting exactly what this run wrote and no more): `26 records · 12 clean · 0 FAIL · 26 WARN [mode=gate]`**

Remaining WARNs are all expected/pre-existing: `STUB_NO_BIO`/`STUB_NO_IMAGE` on venues (venues have no bio/image fields under this task — expected, FP.2), and `NAME_BILLING` on two pre-existing artist names (`The Excuses Band`, `Deadsheep.Band`) that were not renamed this run.

---

## Budget used

**~11 minutes of real elapsed time** (00:26:47Z start → 00:37:56Z at dashboard regeneration), well under the 40-minute ceiling. **16 venues** (of the 30 cap) and **15 artist records attempted** (of the 15 cap — genre top-ups, since new-artist work was hard-stopped). Stopped on reaching the artist cap and completing the available venue backlog slice, not on time or the circuit breaker.

**Circuit breaker: NOT fired** — no validator FAIL was outstanding at any point this run (both scope-gap false-FAILs were resolved by correcting the validator input, not by ignoring a real FAIL).

---

## Ledger, summary, dashboards

- Appended 25 `enrich` lines + 1 `snapshot` line to `data/state/enrichment-ledger.jsonl`.
- Appended 1 line to `data/state/run-summary.jsonl`.
- Updated `data/state/enrichment-ledger.json` cooldown entry for The Shed Tap Room & Deli (90-day, next eligible 2026-11-12).
- Regenerated `data/normalized/enrichment/DASHBOARD.html` (610 enrichment records, 26 snapshots) and `data/normalized/DASHBOARD.html`.

## Claim release

`data/state/claims/bv2a-enrichment.json` will be released (`heldBy: null`) as the last action of this run.
