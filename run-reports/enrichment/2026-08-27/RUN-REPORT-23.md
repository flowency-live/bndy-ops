# Bv2a Enrichment — RUN-REPORT-23 — 2026-08-27

**Run id:** `bv2a-enrichment-2026-08-27T23-19-48Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Checked the last 3 run reports by mtime before any other action: RUN-REPORT-22 (22:18:32Z firing, completed, validator "2 records · 2 clean · 0 FAIL · 0 WARN"), RUN-REPORT-21 (21:19:13Z firing, completed, "4 records · 3 clean · 0 FAIL · 1 WARN" — benign STUB_NO_BIO), RUN-REPORT-20 (20:19:03Z firing, completed, "1 records · 1 clean · 0 FAIL · 0 WARN" after 6 pre-existing-bio scope exclusions). All three completed with a final 0 FAIL. Breaker did not fire.

## Runbook / task spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full: §0A, §0 prime directives, §1/§1A, §2/§2A (items 1–8 including 3b both-surfaces-mandatory, 3c two-word-query rule, item 8 bio-is-a-quotation), §3 venue protocol, §4, §5, §6 run discipline, §6A run contract (steps 0–9), §6B, §6C, §6D/6D-bis, §6E, §6F, §6G concurrency lock protocol/TTL table/dead-holder takeover, §7. `ENRICHMENT-TASK-v3.md` read in full: §0.0, §FP fast path, §1–§12. `CTO-INBOX.md` read in full for all `bv2a`/standing precedent entries through 2026-08-27.

**Standing defects/precedents applied:**
- `bv2a-venue-edit-facebookurl-param-silent-noop` — not triggered (no venue writes this firing).
- `bv2a-firing1319z-never-guess-fb-vanity-url` — applied: every candidate URL used was read from a visited page's own DOM (`document.body.innerText` / `<a href>` via `javascript_tool`, per the standing `fb-page-text-needs-javascript-tool` rule), never inferred from a name.
- `bv2a-firing2119z-edit-artist-genres-param-replaces-not-merges` — not triggered (no genre writes this firing).
- `bv2a-firing1419z-validator-cannot-check-venues` — not triggered (no venue writes; Tier 3 fully saturated, see below).
- `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` — **triggered once, new instance.** Soulplay (`L2R6qpDMjMQYSln8gKjZ`) carries a pre-existing bio from an earlier process. This firing never wrote to Soulplay's bio (or any field — the record was researched and rejected, zero bndy writes made). The gate FAILed `BIO_VERBATIM` because the record's own pre-existing bio was compared against this firing's unrelated search-summary evidence text. Excluded from the gate pass with this rationale, consistent with the standing precedent; re-ran on the remaining 14, 0 FAIL.
- `bv2a-firing2219z-tier4-sampling-never-reaches-true-oldest` — applied: paged `list_artists(missingSocials:true)` across five pages (offset 0/50/100/150/200 = 250 records), not the old two-page convention, to find genuinely oldest-first unworked candidates rather than re-sampling records already evidenced today.

## Concurrency

`data\state\claims\bv2a-enrichment.json` at read time (23:19:48Z) held `{"heldBy":null,"releasedAt":"2026-08-27T22:36:08Z", ...}` — released, matching RUN-REPORT-22's close. Wrote heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-27T23-19-48Z.json` before any gate, then acquired the claim (`heldBy: bv2a-enrichment-2026-08-27T23-19-48Z`, TTL 3h, `expiresAt: 2026-08-28T02:19:48Z`). No `data\state\enrichment.lock` found — only `RETIRED-enrichment.lock-*` tombstones, not honoured, not recreated. Claim released and heartbeat set to `completed` at close (23:31:40Z).

## Tools

bndy MCP reachable (confirmed via `list_artists`/`list_venues`). Chrome: one connected browser, confirmed logged into Facebook via a live render of `facebook.com/` showing the account's own feed ("What's on your mind, The Torrists?").

## Selection

**Tier 1 — artists created in last 24h missing socials:** `list_artists(createdSince:"2026-08-26T23:19:48Z", missingSocials:true)` returned the same 11 candidates as firings 15–22 (Lee Wainwright, Plastic Soul, Xclusive, Greg Davies, Andy Preston & Co, Manic, Jung, the Reform, Tee, The Escape Committee Trio, Over the Moon). Cross-checked all 11 against today's evidence file — all 11 already carry a line from an earlier firing today. Not re-searched.

**Tier 2 — venues created in last 24h missing socials:** `list_venues(createdSince:"2026-08-26T23:19:48Z", missingSocials:true)` returned **0** candidates.

**Tier 3 — backlog venues missing socials, oldest first:** `list_venues(missingSocials:true, limit:100)` returned **46** (unchanged from firing 22's close). Cross-checked all 46 individually against today's evidence file: 31 already carry a line from an earlier firing today; the other 15 (Market Place, Willenhall Memorial Park, The Old Lockup, Hayfield Club, Venue TBC, United match), White Lodge, Bumble Hole, Middle of the Road Cafe, The Nest, Astor Hall, Decade of Dance, EX39 4JN, Jorge Wilson + Jesse James, Bridgnorth Castle and Gardens) are the exact same standing non-enrichable precedent set named in RUN-REPORT-22 and CTO-INBOX (business/address mismatches, council green spaces, placeholders) — none evidenced again today, correctly. **Zero fresh candidates — full backlog saturation, 46/46, reconfirmed for the second consecutive firing.** 0 venue writes this firing.

**Tier 4 — backlog artists missing socials, oldest `createdAt` first:** `list_artists(missingSocials:true)` (1407-strong). Per the standing `bv2a-firing2219z-tier4-sampling-never-reaches-true-oldest` finding, paged **five** pages of 50 (offset 0, 50, 100, 150, 200 — 250 records, not the old two-page convention) and sorted locally by `createdAt`. Cross-checked all 250 against today's evidence file and the §5.4 do-not-attach list. The oldest genuinely-fresh 15 ran from `createdAt` **2025-03-01T15:50:56Z** (Soulplay) through **2026-06-20T08:00:35Z** (Bo-Hush) — five candidates in the 2025-03 to 2026-05 range that no prior firing today had reached (Soulplay, The Comittee, Devil Hound Blues, Kamaro, The Needles), pushing the true-oldest-touched boundary back a further ~2 months from firing 22's close (2025-11-21). Two exact-name do-not-attach-list collisions were skipped on sight without a search: `Jessie James` (Stoke-on-Trent, `createdAt` 2026-07-29T12:36:56Z) and `Charlie` (Whitley Bay, `createdAt` 2026-07-29T16:35:44Z) — both on the standing list, neither searched. **Worked the oldest 15 genuinely-fresh candidates** (budget cap): 0 verified, 15 evidenced blank. Meets the 15-artist budget cap exactly.

**Tier 5:** not reached — cap met by Tier 4.

## Records with a verified page

None this firing. Every candidate that produced a Facebook page either failed the identification bar on location (§2A.1) or turned out non-UK (§2A.1.1). See below.

## Records recorded as an evidenced blank

Both surfaces (Google + Facebook page search) tried for every record before recording blank, per §2A.1 item 3b.

| Artist | Note |
|---|---|
| Soulplay (Stockport) | Google found alivenetwork.com describing "Soulplay \| Acoustic Duo Derbyshire" and the act's own soulplay.co.uk. FB page search for "Soulplay Stockport" returned five candidates (55K-follower Brazilian-Portuguese page, a Philippines band, two generic "Soul Play" pages, a soft-play venue) — none UK-Stockport-consistent. No page attached. |
| The Comittee (North East) | Google and FB search both surfaced the same two "The Committee - band" pages. One is a black-doom metal act ("WE ARE THE VOICE OF THE DEAD") — wrong genre entirely. The other returned no accessible page content on visit. Neither confirmable as the onthecasemusic-sourced North East act. |
| Devil Hound Blues (North West UK) | Sole exact-name FB candidate found on both surfaces (94 followers, Musician/band, UK mobile number, no bio, no location field, no visible posts). Only one Tier B-adjacent signal present (exact name + UK contact) — same class as the standing Jack's got a Plan / Chains Length near-miss precedent (2026-08-27, firing 22). Flagged as a near-miss, not attached. |
| Kamaro (Hampshire) | Sole obvious candidate facebook.com/KamaroBand, despite matching the record's existing `sceniceye` externalId "kamaro", states "Belfast Based five piece Rock Band formed in 2016" — Northern Ireland, location-inconsistent with the stored Hampshire record. Not attached. |
| The Needles (Derbyshire, UK) | Google and FB search both returned only a Derby nightlife venue and a defunct Scottish band (Aberdeen/Glasgow, split 2007) — no Derbyshire act under this name. |
| Tina LIVE (Derbyshire, UK) | Google found a "Tina LIVE" Tina Turner tribute show (starring Julie Nevada) touring South Derbyshire venues — but FB's own search for the show and for "Tina Live Turner tribute" returned only the real Tina Turner's official page, a Lisbon-based tribute and an unrelated touring production. No dedicated page found. |
| JAM TRIBUTE (Derbyshire, UK) | Google found several Jam tribute acts covering Derbyshire (A Band Called Malice, The Jam Tribute, Changing Man) but none under this exact stored name. FB search returned Maximum Jam and other Pearl Jam tributes — no exact-name match on either surface. Validator flagged `NAME_BILLING` ("Tribute" in the name) — benign, judgment call, not blocking. |
| The Dirty Notes (Derbyshire, UK) | Google returned a US act (Johnny Sketch and the Dirty Notes) and a differently-named Northampton band (The Dirty Words). FB search returned no page under this exact name on either surface. |
| Double Cross (Derby, Derbyshire, UK) | Sole FB candidate found on both surfaces links out to statelinebands.com, a US Midwest booking agency — non-UK act per §2A.1.1. Not attached. |
| Nexus (Hampshire) | Sole strong candidate on both surfaces, facebook.com/nexuslivecovers (1.1K followers), states "regularly seen on the Canterbury circuit" with an NZ-prefixed contact number — Kent, location-inconsistent with the stored Hampshire record. |
| The Shards (Staffordshire UK) | Sole strong candidate on both surfaces, facebook.com/theshards (388–416 followers, acoustic trio), states "Lives in Wigan, From Wigan" — Greater Manchester, inconsistent with the `klma-stoke-gig-list`-sourced Staffordshire/Stoke record. |
| Cheap Date (Yorkshire) | FB search returned a Cambridge-based "Cheap Date" (UK but wrong region), a US "Cheap Date Band" (Indiana), and unrelated Sheffield/Erie results. No Yorkshire-consistent match on either surface. |
| The Cords (Yorkshire) | Google and FB both identify "The Cords" as a Scottish jangle-pop duo based in Greenock — UK but wrong region (Inverclyde, west Scotland) versus the stored Yorkshire record. |
| The Prediction (Yorkshire) | Google returned only band-hire listicles and a Kaiser Chiefs song reference; FB search returned no page under this exact name on either surface. |
| Bo-Hush (Staffordshire UK) | Google found only "Bo Hush Studios", a Staffordshire recording studio, not a band. FB search returned no matching band page on either surface. |

## Names corrected under §0.6 / Locations corrected / Genre corrections

None this firing — no writes made to bndy at all (all 15 records remain exactly as found).

## Validator summary line (verbatim)

First pass (15 records, including Soulplay):
```
15 records · 13 clean · 1 FAIL · 1 WARN   [mode=gate]
```
The 1 FAIL was `BIO_VERBATIM` on Soulplay, comparing its untouched pre-existing bio against this firing's unrelated search-summary evidence text (this firing wrote nothing to Soulplay). Excluded per the standing `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` precedent; re-ran on the remaining 14:
```
14 records · 13 clean · 0 FAIL · 1 WARN   [mode=gate]
```
0 FAIL. Batch ships. The one WARN (`NAME_BILLING` on JAM TRIBUTE — "Tribute" in the name) is a judgment flag, not a defect: the record was never renamed or written to, so it does not affect this firing's outcome.

## Defects / findings raised this firing

- `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` — 4th same-day/multi-day instance, now against a record this firing never wrote a single field to (previous instances all involved a partial write, e.g. facebookUrl added). Reinforces the standing recommendation: the validator needs a records-written-fields concept, or per-field evidence keys, so a record that was purely researched-and-rejected this firing is not gated on its pre-existing bio at all. Not re-logged as a new fingerprint — same class, noted here for the trend.
- No guessed-vanity-URL incidents this firing.
- `bv2a-firing2219z-tier4-sampling-never-reaches-true-oldest` — reconfirmed as the correct discipline: paging to offset 200 this firing surfaced 5 candidates older than anything any prior firing today had reached (down to 2025-03-01), none of which the old two-page convention would ever have found.

## Ledger / snapshot / run-summary / dashboards

- `data/state/enrichment-ledger.jsonl`: 15 `enrich` lines (0 artist-verified, 15 artist-blank) + 1 `snapshot` line appended. Snapshot: artistsTotal 3273 (unchanged), artistsMissingSocials 1407 (unchanged — zero writes this firing), artistsMissingGenres 946 (unchanged), venuesTotal 3205 (unchanged), venuesMissingSocials 46 (unchanged).
- `data/state/run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 0, skipped 15.
- Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (3002 records, 107 snapshots) and `data/normalized/DASHBOARD.html`.

## Evidence file

`data/state/enrichment-evidence-2026-08-27-enrichment.jsonl` — held 266 lines from prior firings before this one started; this firing appended 15 search/capture lines (all evidenced blanks — `capturedText` records what was found on each surface, `searchVariants` lists the queries tried), ending at 281 lines. Cross-checked against `data/normalized/enrichment/2026-08-27/tmp/records-23.json` (15 records) and `records-23-clean.json` (14, Soulplay excluded per the bio-verbatim precedent above) — both validator passes logged above.

## Budget used

**0 venues worked (46/46 saturated, 0 fresh) of 30 cap.** **0 verified + 15 blank = 15/15 artists worked**, cap met exactly. Elapsed approximately 12 minutes of the 40-minute ceiling (heartbeat 23:19:48Z → close 23:31:40Z). Circuit breaker did not fire; no hard stop encountered.

## Claim / heartbeat

Claim released (`heldBy: null`, `lastRun: bv2a-enrichment-2026-08-27T23-19-48Z`). Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-27T23-19-48Z.json` updated to `completed`.
