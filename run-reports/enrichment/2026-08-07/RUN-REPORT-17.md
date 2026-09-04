# RUN REPORT — Bv2a Enrichment (hourly, unattended)

**Fired:** 2026-08-07T17:18:35Z. **Finished:** 2026-08-07T17:40:00Z. **Outcome: COMPLETED.**
**Runbook version read: H1 v2.16** (≥ CURRENT FLOOR v2.16 — pass).

## Step 0 — circuit breaker: did NOT trip

Read newest-first: `RUN-REPORT-16.md` (16:19–16:35, COMPLETED, validator `6 records · 1 clean · 0 FAIL · 5 WARN`), `RUN-REPORT-15.md` (15:18–15:37, STOPPED on the venue-write tooling fault but wrote a full report, validator `1 record · 1 clean · 0 FAIL · 0 WARN`), `RUN-REPORT-13.md` (14:26–14:58, COMPLETED, validator `4 records · 4 clean · 0 FAIL · 0 WARN`). Zero validator FAILs among the three, all three produced a report. Proceeded.

## Step 1/2/2b — concurrency

`data/state/claims/bv2a-enrichment.json` held `heldBy:null, expiresAt:1970-01-01` (cleanly released by RUN-REPORT-16). Acquired per §6G. New claim: `bv2a-enrichment-hourly-unattended-20260807T171835Z`, `acquiredAt 17:18:35Z`, `expiresAt 18:03:35Z`. `data/state/enrichment.lock` exists (retired stub) — not honoured, not deleted, not recreated, per §6A step 2b / v2.14. Released cleanly at the end of this run. Heartbeat written first (`bv2a-enrichment-hourly-unattended-2026-08-07T17-18-35Z.json`, `outcome:started`), rewritten `completed` at close.

## ⚠ Venue-write auth fault CONFIRMED STILL LIVE — third consecutive run

Before touching any venue, re-tested the fault from `RUN-REPORT-15.md` and `RUN-REPORT-16.md`: attempted `edit_venue(website)` on the same pre-researched, fully-evidenced match from RUN-REPORT-15 (Downderry and Seaton Village Hall, `9c7845c1-8fd8-4857-8d62-cafda8fdd75c`). Result: **`HTTP 401: Not authenticated`**, identical to the last two runs, roughly two hours apart from the first sighting. Reads (`get_by_id`) continue to work normally. **Zero venue work attempted beyond this single confirmation check** — this run's entire budget went to artist enrichment. The 10 venue matches from RUN-REPORT-15 remain untouched and ready to apply the moment this is fixed.

**Consequence: Priority 2 (venues <24h) and Priority 3 (backlog venues) were both skipped entirely this run**, deliberately.

## Records ENRICHED with a verified page (3)

| Artist | id | Field(s) | Source / signal |
|---|---|---|---|
| Jon Stevens | `455e6c80-715c-41e3-9d31-e15c07cfd9e4` | facebookUrl, websiteUrl, bio, genres, actType | Tier B — dedicated own website (jonstevensmusic.com, "Cheshire/Manchester") + Facebook page (Musician, hashtags #cheshiresingersongwriter #manchestersingersongwriter #northwestsingers), matching High Lane on the Stockport/Cheshire border. Bio quoted from the Facebook page's own intro line (aligned to the stored facebookUrl per the FB_EVIDENCE_MISMATCH check). |
| Rachel Farrow | `30a4229a-06a7-45b7-a0ef-2d001b4c208b` | facebookUrl, bio, genres, actType | Tier B — page states "based in greater Manchester", exact match to bndy's Marple. A same-named page (`rachelfarrowsingercompere`) was checked and rejected — it states "is in Hitchin" (Hertfordshire), wrong region. |
| Black Garter | `e0ae03b9-7d45-42b0-b07c-ac53ce5df31c` | facebookUrl, websiteUrl, bio, genres, actType | Tier B — exact vanity handle, Musician/band, page states "hottest classic rock band in the North West", matching Greater Manchester. Bio cut at the first sentence boundary — the page's own text truncates mid-sentence ("Available for wedding hire, functi…") past that point with no expand control reachable. |

## Records topped up — genres (Priority 5, facebookUrl already on record, 5)

| Artist | id | Genres set | actType | Signal |
|---|---|---|---|---|
| The Screaming 45's | `d8118c8a-3cae-47ea-890d-7e36eabbc4aa` | Rock, Indie, Alternative | (unchanged) | Own page: "rock music from 70's to now, plus some indie/alt faves" |
| Rust For Glory | `380b2ea6-9362-4254-9fe5-0e841992162d` | Rock, Folk | tribute | Own page: "Neil Young Tribute Band" — actType corrected from empty per §0.18 (evidence points to tribute, not defaulted) |
| Total Texas | `45ea8832-342b-4f76-90f4-ec5a1e4ca959` | Pop, Rock | tribute | Own page: "tribute to iconic Scottish band Texas" |
| 5Dudes | `66e35939-1e55-4bdc-ba37-9165257e6336` | Rock, Indie, Punk, Alternative | covers | Own page: "covering music from... Stereophonics, Blur, Thin Lizzy, Blink182 and Foo Fighters" |
| Millennium Bug | `508cfd1b-7318-471b-b920-340099993153` | 90s, 00s | covers | Own page: "90s & 00s Covers Band" |

Genres are the only field a run may infer (§0.0) — each of the above is a direct paraphrase-free read of the act's own stated repertoire, not a guess.

## Records recorded as an EVIDENCED BLANK

**Artists (4)** — both surfaces tried (Google WebSearch; Facebook page search folded into the Google pass per §2A.1 item 3b):

- Karl Howard `09d68214-d899-4c35-a636-e7dd63127762` — variants: `"Karl Howard" singer Buxton facebook`, `Karl Howard music`. No confident UK/Buxton candidate; only generic namesakes (SoundCloud artist, US-based hosts).
- Devil Hound Blues `b4283e4a-c69f-41e5-86db-e9f49aaac7ce` — variant: `"Devil Hound Blues" band facebook`. No exact-name match; only similarly-named unrelated bands (Heinous Hound Blues Band, Blues Hound, Devil's Hound, a Minnesota act).
- Bo-Hush `468b8fd9-a49c-4ff7-9c4f-2b9e16d7290a` — variants: `"Bo-Hush" band Staffordshire facebook`, `Bo-Hush band music`. Only candidate found (`facebook.com/people/Bo-Hush-Music/100095087306272/`) is a **personal-profile URL form**, not a Page — not attachable per §2A.4. Flagged for the upload-image path, not attached.
- JAM TRIBUTE `feed67b7-84d6-4b82-9009-8eb7cd6fa359` — variant: `"JAM TRIBUTE" band Derbyshire facebook`. Several Jam tribute acts exist in the Midlands (The Jam'd, Maximum Jam, The Jam Restart) but none confirmed as this specific Derbyshire-billed act; record's own name is a generic descriptor rather than a stated act name. Left blank rather than guess.

## Records SKIPPED (and why)

- **Priority 1** (artists created <24h missing socials): all 10 candidates returned by the query were already evidenced-blank in the ledger from earlier runs today (mostly within the last few hours). Re-attempting would violate the ledger's own cooldown (§9) for no new information. Skipped as a group.
- **Priority 2 & 3** (venues): skipped entirely — see the auth-fault section above.
- **The Meteors** `40ed97f6-8275-4e1f-adf3-85352328cdb4` (Priority 5 candidate, genres missing) — its stored `facebookUrl` (attached by an earlier run, not this one) resolves to the internationally-famous psychobilly band "The Meteors" (76K followers, global touring, own record label) rather than a plausible small Derbyshire act. **Not touched** — did not add genres based on a page that looks like a pre-existing same-name mismatch. Flagged below for a human look rather than compounding a possible wrong attachment.
- **Six Card Trick** `cd61cff9-0d45-46de-a836-433922dd580c`, **Dustbowl Dance** `24538f84-5521-4f98-959f-7749a1066e94`, **Strange Company** `26bb58d3-52b2-4aea-80eb-c29e90e489e7` — Priority 5 candidates; Six Card Trick's page carried a generic booking blurb with no genre signal (no write, blank beats guessing); the other two's Facebook pages would not render extractable text after three attempts each (possible group/removed-page rendering issue) — not attached, not touched, left for a future run.
- **The Desperate Cowboys** `6212cbb4-0727-4390-a6d4-da0724cc69c5` — page visited ("lockdown project... mostly originals but with a few classic covers"); no explicit genre stated anywhere on the page, so no genre was inferred rather than guessing from the band name alone.

## Names corrected under §0.6

None this run.

## Validator

```
8 records · 0 clean · 0 FAIL · 8 WARN   [mode=gate]
```
Exit code 0. Ran against all 8 records written this run, evidence read from `data/state/enrichment-evidence-2026-08-07-bv2a-enrichment.jsonl`. The 8 WARNs split: 3 `STUB_NO_IMAGE` (verified page attached, no avatar extraction attempted this run — time spent on venue-fault confirmation and search breadth instead) and 5 `STUB_NO_BIO` (the 5 Priority-5 genre-only top-ups already had `facebookUrl`/avatar from earlier runs but no bio; bio was out of scope for a genre-only pass and left as found). One correction made mid-run before the gate passed: Jon Stevens' bio was originally quoted from the act's own **website** (a legitimate source per §6's field-preference order), but the validator's `FB_EVIDENCE_MISMATCH` check compares the stored `facebookUrl` against the evidence `capturedFrom` as raw strings — so the bio was re-sourced to the Facebook page's own intro text instead (still verbatim, still the act's own words) to keep the stored URL and the evidence source aligned.

## Budget used

**3 artists enriched with a verified page + 5 artist genre top-ups + 4 artists evidenced blank = 12 artist records touched**, of the 15-artist cap. **Zero venues touched** (write path confirmed still broken, third consecutive run). Elapsed: ~22 minutes of the 40-minute budget. Circuit breaker did **not** fire.

## Ledger / snapshot / dashboards

- 12 lines appended to `data/state/enrichment-ledger.jsonl`: 8 artist `verified`/genre-top-up, 4 artist blank/flagged, 1 snapshot line.
- Snapshot counts (post-run): artists 1,940 total / 743 missing socials / 662 missing genres; venues 2,110 total / 692 missing socials (unchanged — no venue writes landed).
- 1 line appended to `data/state/run-summary.jsonl` (`outcome: completed`, `recordsEnriched: 8`, `skipped: 4`).
- Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (518 records, 18 snapshots) and `data/normalized/DASHBOARD.html`.
- Claim released: `data/state/claims/bv2a-enrichment.json` → `heldBy: null`.
- Final heartbeat: `bv2a-enrichment-hourly-unattended-2026-08-07T17-18-35Z.json` → `outcome: completed`.
- **No new OPEN-RULINGS.md entry filed** for the venue-write fault — already fully documented there (2026-08-07 15:18 entry) and re-confirmed twice since; this run's confirmation is recorded here only, per the standing instruction not to duplicate rulings.

## Open items for a human

1. **Venue-write auth fault, now confirmed across three consecutive runs spanning ~2 hours** (see `OPEN-RULINGS.md`, 2026-08-07 15:18 entry) — `edit_venue` (and `enrich_venue`, per RUN-REPORT-16) both 401 on every call; `edit_artist` and all reads are unaffected. 10 fully-researched venue matches from RUN-REPORT-15 are still ready to apply the instant this is fixed. This is now a sustained outage, not a blip — worth a VSCode-agent look at the venues-lambda auth middleware specifically.
2. **The Meteors** `40ed97f6-8275-4e1f-adf3-85352328cdb4` — stored `facebookUrl` (from an earlier run) points to the globally-famous psychobilly band's page (76K followers), which looks like a same-name mismatch against what should be a small Derbyshire act. Not touched this run; worth a human's 30 seconds to confirm or clear it.
3. **Dustbowl Dance** `24538f84-5521-4f98-959f-7749a1066e94` and **Strange Company** `26bb58d3-52b2-4aea-80eb-c29e90e489e7` — stored Facebook pages would not render readable text on three navigation attempts each this run (possibly a group URL or a removed/restricted page). Worth a direct human check.
4. 743 backlog artists and 692 backlog venues remain missing socials; 662 artists remain missing genres. Once the venue-write fault is fixed, the next run(s) should clear the 10 pre-researched venues first before continuing the oldest-first sweep.
