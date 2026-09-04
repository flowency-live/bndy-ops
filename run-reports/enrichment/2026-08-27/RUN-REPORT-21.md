# Bv2a Enrichment — RUN-REPORT-21 — 2026-08-27

**Run id:** `bv2a-enrichment-2026-08-27T21-19-13Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Checked the last 3 run reports by mtime before any other action: RUN-REPORT-20 (20:19:03Z firing, completed, validator "1 records · 1 clean · 0 FAIL · 0 WARN" after 6 pre-existing-bio + 1 venue-shape scope exclusions), RUN-REPORT-19 (19:19:03Z firing, completed, "14 records · 12 clean · 0 FAIL · 3 WARN" after 1 exclusion), RUN-REPORT-18 (18:18:06Z firing, completed, "13 records · 10 clean · 0 FAIL · 3 WARN" after 2 exclusions). All three completed with 0 FAIL. Breaker did not fire. Confirmed independently: `data\state\claims\bv2a-enrichment.json` read at firing start held `{"heldBy":null,"releasedAt":"2026-08-27T21:13:00Z","lastRun":"bv2a-enrichment-2026-08-27T20-19-03Z"}` — released, matching RUN-REPORT-20's close exactly. No run has landed since. `data\normalized\enrichment\2026-08-27\tmp\` held only stale files from firing 17 (`records-17.json`, `records-17-clean.json`) — an old working file, not a stale claim; did not affect the circuit-breaker read.

## Runbook / task spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full: §0A, §0 prime directives 1–29, §1/§1A identity + same-name protocol, §2/§2A enrichment protocol (2A.1 items 1–8 including 3b both-surfaces-mandatory, 3c two-word-query rule, item 8 bio-is-a-quotation, 2A.2 mechanics), §3 venue protocol, §4 multi-artist model, §5 event protocol, §6 run discipline, §6A run contract (steps 0–9), §6B platform facts, §6C failure classes, §6D/6D-bis event identity, §6E horizons, §6F concurrency ownership lanes, §6G concurrency lock protocol/TTL table (`bv2a-enrichment` = 3h)/dead-holder takeover, §7 changelog. `ENRICHMENT-TASK-v3.md` read in full: §0.0, §FP fast path, §1–§11a. `CTO-INBOX.md` read (full-text grepped for all `2026-08-27` entries plus the standing precedent list) for `bv2a`/`DEFECT`/`DATA`/`RULE` entries.

**Standing defects/precedents applied, not re-discovered:**
- `bv2a-firing1319z-verify-id-before-live-write` — applied: every write's target id/name confirmed via `get_by_id` read-back immediately after writing.
- `bv2a-firing1319z-never-guess-fb-vanity-url` — applied: every facebookUrl written was copied from a search result or a `find`-resolved href, never inferred from a name.
- `bv2a-venue-backlog-saturated` — reconfirmed: cross-referenced all 46 backlog venue candidates against both today's evidence file and `CTO-INBOX.md`'s standing precedent list (not just today's file, per firing 20's corrected practice). Zero fresh.
- `bv2a-firing1419z-validator-cannot-check-venues` — not applicable this firing (no venue writes).
- `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` — not hit this firing (no pre-existing-bio records were touched for facebookUrl-only).

## Concurrency

`data\state\claims\bv2a-enrichment.json` at read time (21:19:13Z) held `{"heldBy":null,"releasedAt":"2026-08-27T21:13:00Z", ...}` — released, matching RUN-REPORT-20's close. Wrote heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-27T21-19-13Z.json` (`outcome:"started"`) before any gate, then acquired the claim: `heldBy: bv2a-enrichment-2026-08-27T21-19-13Z`, TTL 3h, `expiresAt: 2026-08-28T00:19:13Z`. No `data\state\enrichment.lock` file found (confirmed retired per §6A step 2b — not honoured, not recreated; only the two `RETIRED-enrichment.lock-*` tombstones exist). Claim released and heartbeat set to `completed` at close.

## Tools

bndy MCP reachable (confirmed via `list_artists`/`list_venues`). Chrome: exactly one connected tab group, confirmed logged into Facebook via a live render of `facebook.com/` showing the account's own feed ("What's on your mind, The Torrists?") before any page was visited.

## Selection

**Tier 1 — artists created in the last 24h missing socials:** `list_artists(createdSince:"2026-08-26T21:19:13Z", missingSocials:true)` returned the same 11 candidates as firings 15–20 (Lee Wainwright, Plastic Soul, Xclusive, Greg Davies, Andy Preston & Co, Manic, Jung, the Reform, Tee, The Escape Committee Trio, Over the Moon). All 11 already carried an evidence line from earlier firings today. Not re-searched. None counted toward this firing's worked total.

**Tier 2 — venues created in last 24h missing socials:** `list_venues(createdSince:"2026-08-26T21:19:13Z", missingSocials:true)` returned **0 candidates**.

**Tier 3 — backlog venues missing socials, oldest `createdAt` first:** `list_venues(missingSocials:true, limit:100)` returned **46** candidates (down from 47 at firing 20's close — The Snooks resolved). Cross-checked every one against today's evidence file AND a full-text `CTO-INBOX.md` search (not just today's file, per firing 20's corrected practice): all 46 are either (a) already carrying an evidence line from an earlier firing today, or (b) a standing non-enrichable precedent named explicitly in `CTO-INBOX.md` or a prior firing's report (Market Place Burton, Willenhall Memorial Park, Old Lockup Wirksworth, Okehampton Show ground — address mismatch, Hayfield Club, Venue TBC, United match), White Lodge, Bumble Hole, Middle of the Road Cafe, Astor Hall, Sola Bar & Kitchen — ambiguous rename, Decade of Dance, EX39 4JN/Instow Beach, Jorge Wilson + Jesse James, Bridgnorth Castle and Gardens, The Nest, Darcy's, 1865 Carlton Pl — misgeocode, The Railway Stockport — possibly closed, Spaces Studio — wrong business), or (c) a non-fixed-building venue per §0.23 (Jubilee Park Horndean, Ann Welfare Playing Fields, Campbell Park, West Park Long Eaton, Bowling Green Stage Nantwich, Prestwood Recreation Ground, Castle playing fields Thrapston, Madeley Carnival) that was never enrichable in the first place. **Zero fresh candidates — full backlog saturation, 46/46.** 0 venue writes this firing, not a stopping decision.

**Tier 4 — backlog artists missing socials, oldest `createdAt` first:** `list_artists(missingSocials:true)` (1413-strong at query time; pulled two pages of 50, offset 0 and 50, sorted locally by `createdAt`). Checked all 100 sampled programmatically against today's evidence file (by artistId) and the §5.4 do-not-attach list: 83 already carried a line from earlier firings today, 1 (`Charlie`) is a standing do-not-attach/already-enriched record; **16 genuinely fresh candidates** identified, `createdAt` 2026-07-31T22:15:17Z through 2026-08-22T14:08:08Z: Thomas Kavanagh, The Abundants, Dan Williams Trio, Musica Batley Jazz Bats, Kyla Brox, Justin Ryan, Andy Scott, The Greedy Club, Last Arrow, Chris King, Hearts and Bones, Hola Mi Pato, March, Owl Stretching Time, Limerence, Serah Beu and The Flying Dutchman. **Worked the oldest 15 of those 16** (budget cap) — 4 verified, 11 evidenced blank. Meets the 15-artist budget cap exactly. Serah Beu and The Flying Dutchman (createdAt 2026-08-22T14:08:08Z) not reached this firing.

**Tier 5 (artists missing genres with a facebookUrl):** not reached — the 15-artist cap was met by Tier 4.

## Records with a verified page

| Artist | Facebook | Note |
|---|---|---|
| Thomas Kavanagh (Devon) | facebook.com/thomaskavanaghmusic/ | Tier B: sole candidate, name-exact, Musician/band, 2.1K followers, category tagline "Country\| Pop \| Rock Singer UK" corroborated independently by BBC Introducing Devon coverage and countrymusic.co.uk performer listing (both confirm Devon origin). Bio quoted verbatim from the page's own Bio field: *"Country\| Pop \| Rock Singer UK"*. Website thomaskavanaghmusic.com also written. Genres Country/Pop/Rock added **alongside** the record's existing genre `Americana` (see Defects below — the first write mistakenly replaced rather than merged; caught and corrected same firing before validation). |
| Kyla Brox (Marsden) | facebook.com/KylaBroxPage/ | Tier B: sole candidate, name-exact, Musician/band, 4.7K followers, own website kylabrox.com linked from the page, independently corroborated by a Wikipedia entry (blues/soul singer, father Victor Brox). No About/Bio text field populated on the page itself — left bio empty rather than compose one from the Wikipedia summary; flagged `STUB_NO_BIO` in the validator (benign, blank-beats-wrong, same class as the Daisy Mae precedent in firing 20). Genre `Blues` added. |
| Last Arrow (Nottingham) | facebook.com/lastarrownottingham/ | Tier A: page states exact location "Nottingham, United Kingdom" matching the stored record, Musician/band, current activity (2026 posts about upcoming gigs and a new album). Bio quoted verbatim: *"Nottingham based original indie/rock band stream/buy our music here https://songwhip.com/last-arrow"*. actType set to `originals` from the page's own wording ("original indie/rock band"). Existing genres `Indie`/`Rock` left untouched (already correct, not re-written). |
| Hola Mi Pato (Nottingham) | facebook.com/profile.php?id=100094770007197 | Tier A: sole exact-name candidate on Facebook page search, Musician/band, page's own description states "round Nottingham" — exact match to the stored record. Bio quoted verbatim: *"Hola Mi Pato are a Duo playing Latin and Hispanic songs round Nottingham"*. Genre `Latin` and actType `covers` set from the page's own wording. |

All 4 writes verified by `get_by_id` read-back immediately after writing, before counting as verified.

## Records recorded as an evidenced blank

**Artists (11 of 15 worked)** — both surfaces (Google + Facebook page search) tried for every record before recording blank, per §2A.1 item 3b:

| Artist | Note |
|---|---|
| Dan Williams Trio (Bridgnorth) | Google surfaced a Facebook profile URL (`Dan-Williams-Music-100047676921099`) and a Bridgnorth Music & Arts Festival artist page — visited both: the FB profile id redirects to `meta.com/about` (dead/deactivated page), the festival URL 404s. FB page search for "Dan Williams Trio" returned no matching band page. |
| The Abundants (Essex) | Google found only unrelated "Abundance" projects/labels, no UK act. FB page search returned no matching band page. |
| Musica Batley Jazz Bats (Marsden) | Google found only the parent organisation "Musica Batley" (a community music centre in Batley, West Yorkshire) — not the same entity as the specific "Jazz Bats" performing ensemble, not attachable. FB page search for the full name returned no matching result. |
| Justin Ryan (Derby) | Google found only a US country artist from Easton, MD — non-UK, rejected per §2A.1 item 1. FB page search with a "Derby" qualifier returned no UK-relevant candidate. |
| Andy Scott (Nottingham) | Google found only two unrelated famous musicians (an RNCM saxophonist; the Sweet's guitarist) — neither is a Nottingham acoustic solo act. FB page search with a "Nottingham" qualifier returned no matching result. |
| The Greedy Club (Nottingham) | Google found only an unrelated "Greedy Sauce" band. FB page search returned no matching result. |
| Chris King (Nottingham) | Google found a US blues artist (Louisiana) and an unrelated 1990s Nottingham dance-music producer (KWS) — different genre/era, not the stored country/blues act. FB page search returned no matching result. |
| Hearts and Bones (Nottingham) | Google found only Paul Simon album/tribute references in the US. FB page search returned no matching result. |
| Hola Mi Pato — *(moved to verified above)* | — |
| March (Nottingham) | Google found only generic hire-band directory listings. FB page search returned only a US band "MARCH" (Wilmington, DE) and unrelated marching-band pages. |
| Owl Stretching Time (Nottingham) | Google found only an Ott song title and an unrelated LA band "Owls Stretching Time". FB page search did surface one exact-name "Owl Stretching Time · Musician/band" result, but with zero followers, no location and no description shown — no identification signal present, not attached per §2A.1 (name match alone is never sufficient). |
| Limerence (Nottingham) | Google found several same-name unrelated acts (London, Dunfermline, Dublin), none evidencing Nottingham. FB page search restricted to "Limerence Nottingham" returned zero results. |

## Names corrected under §0.6 / Locations corrected / Genre corrections

None under §0.6 this firing (no name corrections). Genres newly SET where the record had none (permitted per §2A.2 — genres are evidence-based, not corrections): Kyla Brox → `Blues`; Hola Mi Pato → `Latin`. Genres ADDED to an existing non-empty set: Thomas Kavanagh → `Pop`, `Rock` added alongside the pre-existing `Country`, `Americana` (see Defects below).

## Validator summary line (verbatim)

No scope exclusions needed this firing (no pre-existing-bio records touched for facebookUrl-only).

```
4 records · 3 clean · 0 FAIL · 1 WARN   [mode=gate]
```

0 FAIL. Batch ships. The one WARN is benign and expected: `STUB_NO_BIO` on Kyla Brox (the page's own About tab carries no Bio field text — correctly left blank rather than composed from an outside Wikipedia summary, per §0.0).

## Defects / rules raised this firing

- **NEW — `edit_artist`'s `genres` parameter REPLACES the stored array wholesale; it is not additive.** First write to Thomas Kavanagh (`4b55e17e-6fd1-4c46-8678-c30d550e1ab3`) set `genres: ["Country","Pop","Rock"]` without first re-reading the record's pre-existing `["Country","Americana"]` value from the initial `list_artists` sweep — the write silently dropped `Americana`. Caught immediately by comparing the `edit_artist` response against the original `list_artists` snapshot (not by a validator rule — the validator has no notion of a prior value), and corrected same firing with a second `edit_artist(genres:["Country","Americana","Pop","Rock"])` call, verified by `get_by_id`. **Rule going forward: before writing any non-empty `genres` array, `get_by_id` (or trust the just-fetched `list_artists` row) and MERGE with the existing values — never write only the newly-evidenced ones.** Logged to `CTO-INBOX.md` as a new standing defect (no prior entry existed for this).
- No guessed-vanity-URL incidents this firing — every facebookUrl written was copied from a search result or a `find`-resolved DOM href (Hola Mi Pato's `profile.php?id=` form was extracted via `find` + accessibility tree after `get_page_text` returned only chrome/nav text, not guessed from the name).
- Venue backlog saturation reconfirmed at 46/46 (down from 47/47 at firing 20's close — The Snooks resolved that firing). Not logged as new, same standing `bv2a-venue-backlog-saturated` finding.

## Ledger / snapshot / run-summary / dashboards

- `data/state/enrichment-ledger.jsonl`: 15 `enrich` lines (4 artist-verified, 11 artist-blank) + 1 `snapshot` line appended. Snapshot: artistsTotal 3273, artistsMissingSocials 1409 (down from 1413), artistsMissingGenres 946 (down from 947), venuesTotal 3205, venuesMissingSocials 46 (unchanged — no venue writes this firing).
- `data/state/run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 4 (verified count), skipped 11 (evidenced-blank count).
- Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2972 records, 105 snapshots) and `data/normalized/DASHBOARD.html`.

## Evidence file

`data/state/enrichment-evidence-2026-08-27-enrichment.jsonl` — this firing's 15 entries appended before every write/search-conclusion (the file already held 232 lines from nine earlier firings today before this firing started; now 247 lines).

## Budget used

**0 venues worked (Tier 2: 0 candidates; Tier 3: 46/46 already flagged/touched, zero fresh) of 30 cap.** **4 verified + 11 blank = 15/15 artists worked**, cap met exactly. Elapsed approximately 16 minutes of the 40-minute ceiling (heartbeat 21:19:13Z → claim release ~21:35Z). Circuit breaker did not fire; no hard stop encountered.

## Claim / heartbeat

Claim released (`heldBy: null`, `lastRun: bv2a-enrichment-2026-08-27T21-19-13Z`). Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-27T21-19-13Z.json` updated to `completed`.
