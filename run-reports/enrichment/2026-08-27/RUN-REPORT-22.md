# Bv2a Enrichment — RUN-REPORT-22 — 2026-08-27

**Run id:** `bv2a-enrichment-2026-08-27T22-18-32Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Checked the last 3 run reports by mtime before any other action: RUN-REPORT-21 (21:19:13Z firing, completed, validator "4 records · 3 clean · 0 FAIL · 1 WARN" — benign STUB_NO_BIO), RUN-REPORT-20 (20:19:03Z firing, completed, "1 records · 1 clean · 0 FAIL · 0 WARN" after 6 pre-existing-bio scope exclusions), RUN-REPORT-19 (19:19:03Z firing, completed, "14 records · 12 clean · 0 FAIL · 3 WARN" after 1 exclusion). All three completed with a final 0 FAIL. Breaker did not fire.

## Runbook / task spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full: §0A, §0 prime directives, §1/§1A, §2/§2A (items 1–8 including 3b both-surfaces-mandatory, 3c two-word-query rule, item 8 bio-is-a-quotation), §3, §4, §5, §6 run discipline, §6A run contract (steps 0–9), §6B, §6C, §6D/6D-bis, §6E, §6F, §6G, §7. `ENRICHMENT-TASK-v3.md` read in full: §0.0, §FP, §1–§12. `CTO-INBOX.md` read in full (both pages) for all `bv2a`/standing precedent entries.

**Standing defects/precedents applied:**
- `bv2a-firing1319z-verify-id-before-live-write` — applied: `get_by_id` immediately before both edit_artist calls, confirming target name/current field state.
- `bv2a-firing1319z-never-guess-fb-vanity-url` — applied: every facebookUrl written was read from a visited page's own URL bar / a `find`-resolved DOM href, never inferred from a name.
- `bv2a-firing2119z-edit-artist-genres-param-replaces-not-merges` — applied: both genre writes read the pre-existing array first (via `get_by_id`) and merged the new value in, never replaced.
- `bv2a-venue-backlog-saturated` — reconfirmed (see below).

## Concurrency

`data\state\claims\bv2a-enrichment.json` at read time (22:18:32Z) held `{"heldBy":null,"releasedAt":"2026-08-27T21:36:00Z", ...}` — released, matching RUN-REPORT-21's close. Wrote heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-27T22-18-32Z.json` before any gate, then acquired the claim (`heldBy: bv2a-enrichment-2026-08-27T22-18-32Z`, TTL 3h, `expiresAt: 2026-08-28T01:18:32Z`). No `data\state\enrichment.lock` found (retired, not honoured, not recreated). Claim released and heartbeat set to `completed` at close.

## Tools

bndy MCP reachable (confirmed via `list_artists`). Chrome: exactly one connected browser, confirmed logged into Facebook via a live render of `facebook.com/` showing the account's own feed ("What's on your mind, The Torrists?").

## Selection

**Tier 1 — artists created in last 24h missing socials:** `list_artists(createdSince:"2026-08-26T22:18:32Z", missingSocials:true)` returned the same 11 candidates as firings 15–21. All 11 already carried an evidence line from earlier firings today. Not re-searched.

**Tier 2 — venues created in last 24h missing socials:** 0 candidates.

**Tier 3 — backlog venues missing socials, oldest first:** `list_venues(missingSocials:true, limit:100)` returned **46** (unchanged from firing 21's close). Cross-checked all 46 individually against today's evidence file: 31 already carried a line from an earlier firing today; the other 15 (Market Place, Willenhall Memorial Park, The Old Lockup, Hayfield Club, Venue TBC, United match), White Lodge, Bumble Hole, Middle of the Road Cafe, The Nest, Astor Hall, Decade of Dance, EX39 4JN, Jorge Wilson + Jesse James, Bridgnorth Castle and Gardens) are standing non-enrichable precedents named explicitly in `CTO-INBOX.md` from 2026-08-18/19/21 (business/address mismatches, council green spaces, placeholders — none evidenced again today, correctly). **Zero fresh candidates — full backlog saturation, 46/46, reconfirmed.** 0 venue writes this firing.

**Tier 4 — backlog artists missing socials, oldest `createdAt` first:** `list_artists(missingSocials:true)` (1409-strong). Sampled **three** pages of 50 (offset 0, 50, 100) rather than the usual two — **offset 100 had never been sampled by any prior firing**, and all 50 records on it were absent from today's evidence file, with `createdAt` running back to **2025-11-21** (`The Rockerfellas`), far older than anything any firing had touched today (earliest previously touched: 2026-07-29). This is logged as a new finding below. Combined all three pages, sorted locally by `createdAt`, cross-checked against today's evidence file and the §5.4 do-not-attach list. **Worked the oldest 15 genuinely-fresh candidates** (budget cap): 5 from the offset-0/50 sweep (`createdAt` 2026-07-31T22:15:09Z through 2026-08-22T14:08:08Z) plus 10 true-oldest records from the newly-reached offset-100 page (`createdAt` 2025-11-21T13:22:20Z through 2026-07-29T20:04:29Z) — 2 verified, 13 evidenced blank. Meets the 15-artist budget cap exactly.

**Tier 5:** not reached — cap met by Tier 4.

## Records with a verified page

| Artist | Facebook | Note |
|---|---|---|
| Serah Beu and The Flying Dutchman (Nottingham) | facebook.com/serahbeuandtheflyingdutchman | Tier B: sole exact-name candidate, Musician/band, own bio present, independently corroborated by two third-party Beeston/Broxtowe (Greater Nottingham) event listings (broxtowe.gov.uk, oxjambeeston.org) matching the stored Nottingham location. Bio quoted verbatim from the page's own Bio field. Genre `Rock` added alongside existing `Folk`, `Indie` (merge, not replace). |
| Last Orders (Yorkshire) | facebook.com/Lastordershuddersfield | Tier B: sole strong candidate, Musician/band, page-stated location "Honley West Yorks" matches stored region Yorkshire, `actType` covers matches page's own "cover band" wording, genre Rock/Indie corroborates stored Rock/Pop. Bio quoted verbatim. Genre `Indie` added alongside existing `Rock`, `Pop`. |

Both writes verified by `get_by_id` read-back immediately after writing, before counting as verified.

## Records recorded as an evidenced blank

Both surfaces (Google + Facebook page search) tried for every record before recording blank, per §2A.1 item 3b, except where noted:

| Artist | Note |
|---|---|
| Richard James (Devon) | Google found only unrelated Richard James musicians and one no-location, no-UK-evidence "Richard James Band" FB page (generic joke bio). FB page search for "Richard James Devon" returned no matching UK act. |
| Koppelli (Bridgnorth) | Google and FB page search both returned nothing matching. |
| Tino Gunnar (Nottingham) | Google found the name as a member of Lineside, an alt-rock act from Lincolnshire/Yorkshire — location-inconsistent with the stored Nottingham record and a different billed act name. FB page search returned nothing. |
| Jack's got a Plan (Nottingham) | Sole exact-name FB page found (719 followers, Musician/band), but no page-stated location and no Nottingham-specific gig evidence (only Leicester/Leeds/London tour dates found via Google) — only one Tier B signal present, insufficient alone. Flagged as a near-miss for a human's 30 seconds, same handling as the standing Flutter precedent. |
| The Rockerfellas (North West England) | FB page search (region-qualified) returned one candidate, but its lineup names (David Doolan, Terry Grace, John Stufflebean, Steve Phillips) read as American, not UK-consistent, and no location field is present — likely the Hollywood/LA act found via Google, not the stored North West England act. |
| Roadhouse Sinners (North West UK) | Google and FB page search both returned nothing matching. |
| Futari (Cheshire) | Google and FB page search both returned nothing matching (FB surfaced only an unrelated Belgian restaurant). |
| The Chains Length (Worksop) | Sole exact-name FB page found ("Band" category, 159 followers, genre-fit bio "Songs of booze, sex, rock 'n' roll, loss and betrayal"), but no location, no posts, no lineup evidence — same class as the standing Flutter precedent (name + genre-vibe alone is never sufficient). Flagged as a near-miss. |
| the 21st Amendment (Greater Manchester) | Google and FB page search both returned nothing matching (only unrelated same-word venues/bars/bands). |
| Mojo Rising (Greater Manchester) | One "Mojo Rising" Musician/band FB page found, but its bio states a 2026 Medway Fringe Festival (Kent, South East England) nomination — location-inconsistent with the stored Greater Manchester record. Not attached. |
| Newberry & Verch (Marple) | Google found a real, well-documented US/Canadian touring folk duo (Joe Newberry, Missouri; April Verch, Ottawa Valley) — a genuine non-UK act per §2A.1.1, not attachable to the stored UK grassroots duo despite the touring act's UK festival dates. FB page search not needed given the clear non-UK identification. |
| Kno Duo (Cheshire) | Google and FB page search both returned nothing matching. |
| Bash Bailey (Poynton) | Google found only an unrelated physics teacher. FB page search for "Bash Bailey music" returned no matching act. |

## Names corrected under §0.6 / Locations corrected / Genre corrections

None under §0.6 this firing. Genres ADDED to existing non-empty sets (never replaced, per the firing-21 lesson): Serah Beu and The Flying Dutchman → `Rock` added alongside `Folk`, `Indie`; Last Orders → `Indie` added alongside `Rock`, `Pop`.

## Validator summary line (verbatim)

```
2 records · 2 clean · 0 FAIL · 0 WARN   [mode=gate]
```

0 FAIL. Batch ships.

## Defects / findings raised this firing

- **NEW — Tier 4 selection has never sampled past `offset 100` (`list_artists(missingSocials:true)`, 1409-strong).** Every prior firing today (and, from report cross-referencing, likely every firing since v3.1's "pull two pages of 50" convention was adopted) only ever fetched offset 0 and 50 — 100 of 1409 candidates. Those 100 have been repeatedly re-sampled and are now fully evidenced. `offset 100` had never been touched: all 50 records on it were fresh, with `createdAt` running back to **2025-11-21** — five months older than anything any firing had reached via the offset-0/50 convention (oldest previously touched was 2026-07-29). **The "oldest createdAt first" instruction (task prompt Tier 4, ENRICHMENT-TASK-v3.md §3.4d) has not actually been honoured by the two-page sampling convention**, because `list_artists` does not sort by `createdAt` server-side and the convention never looked past the first 100 API-order results. This firing paged to offset 100 and worked the true-oldest 10 found there. **Recommend:** either request server-side `createdAt` ascending sort on `list_artists`, or make "page until you find 15 fresh, don't stop at offset 100" the explicit rule. Logged to `CTO-INBOX.md`.
- No guessed-vanity-URL incidents this firing.
- Two evidence-file line mistakes were self-caught and corrected same firing: a stray placeholder line was appended once for `0468f0bf-...` (Phoenix) and once for `d9061b1c-...` (Raised on Chaos) — neither artist was worked this firing, neither had a real capture attached. Both were immediately followed by a correction line disregarding the erroneous entry, before any further evidence or bndy writes touched those ids. Logged so the pattern (copy-paste id mismatch when hand-assembling evidence JSONL) is visible if it recurs.

## Ledger / snapshot / run-summary / dashboards

- `data/state/enrichment-ledger.jsonl`: 15 `enrich` lines (2 artist-verified, 13 artist-blank) + 1 `snapshot` line appended. Snapshot: artistsTotal 3273, artistsMissingSocials 1407 (down from 1409), artistsMissingGenres 946 (unchanged — no empty-to-non-empty genre sets this firing), venuesTotal 3205, venuesMissingSocials 46 (unchanged — no venue writes).
- `data/state/run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 2, skipped 13.
- Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2987 records, 106 snapshots) and `data/normalized/DASHBOARD.html`.

## Evidence file

`data/state/enrichment-evidence-2026-08-27-enrichment.jsonl` — held 247 lines from prior firings before this one started; this firing appended 15 real capture/search-variant lines plus 2 self-caught correction lines (for the 2 stray mistaken entries), ending at 266 lines (later confirmed as `data/normalized/records-2026-08-27-firing22.json` cross-check for the 2 written records — both `[ ok ]`).

## Budget used

**0 venues worked (46/46 saturated, 0 fresh) of 30 cap.** **2 verified + 13 blank = 15/15 artists worked**, cap met exactly. Elapsed approximately 29 minutes of the 40-minute ceiling (heartbeat 22:18:32Z → close ~22:47Z). Circuit breaker did not fire; no hard stop encountered.

## Claim / heartbeat

Claim released (`heldBy: null`, `lastRun: bv2a-enrichment-2026-08-27T22-18-32Z`). Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-27T22-18-32Z.json` updated to `completed`.
