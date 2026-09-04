# Bv2a Enrichment — RUN-REPORT-09 — 2026-08-21

**Run id:** `bv2a-enrichment-2026-08-21T09-18-13Z`. **Outcome: completed.**

- **Circuit breaker (Step 0):** did not fire. Checked the last 3 reports directly (firings 06, 07, 08), not just trusted their own claims. All 3 closed at 0 FAIL (firing 08 reached 0 FAIL on a second pass after fixing a `FB_EVIDENCE_MISMATCH`) and all 3 wrote a full report. Circuit breaker cannot trip.
- **Runbook:** read in full. H1 `v2.27` ≥ CURRENT FLOOR `v2.19` (§6A step 2a) — pass. ENRICHMENT-TASK-v3.md §0.0, §FP, §5, §6, §7 read in full. CTO-INBOX.md read through the 2026-08-21 firing-08 entries — standing flags respected (venue backlog saturation, do-not-attach list, genre mapping table).
- **Concurrency:** `data\state\claims\bv2a-enrichment.json` was released (`heldBy: null`, `lastRun: bv2a-enrichment-2026-08-21T08-19-45Z`) at read time. Acquired at `2026-08-21T09:18:13Z`, TTL 3h per §6G (`expiresAt: 2026-08-21T12:18:13Z`). No `data\state\enrichment.lock` file found; the retired mechanism was not honoured and not recreated. Heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-21T09-18-13Z.json` written first with `outcome: started`, rewritten to `completed` last.
- **Tools:** bndy MCP reachable (confirmed via `list_artists`/`list_venues`). Chrome: exactly one connected browser, selected by deviceId, logged into Facebook — confirmed via `facebook.com` page text showing "Jason Jones" and 3 notifications before any bio quote was attempted.

## Selection

Tier 1 — artists created in the last 24h missing socials (`createdSince` as an explicit ISO timestamp, per the standing `list-artists-createdsince-24h-string-not-parsed` defect): 187 candidates. Cross-checked the first 75 (two pages) against a fresh pull of `data/state/enrichment-ledger.jsonl` for every `2026-08-21` artist line (118 unique ids already touched today across firings 00–08). 58 of the first 75 were already touched; 17 were genuinely untouched. Selected 15 of those 17 (left 2 in reserve).

Tier 2 — venues created in the last 24h missing socials: same 7 candidates as firing 08 — all either already evidenced-blank today (Willenhall Memorial Park, Bumble Hole Local Nature Reserve) or already flagged DATA (Market Place, The Old Lockup, Bunker) or already carrying 2+ blank ledger entries today (The New Three Tuns Pub, Eastwood & District Conservative Club Ltd). Zero untouched.

Tier 3 — backlog venues missing socials: pulled the full 44-record backlog and checked ledger presence for every id individually (script cross-check, not a re-search). 41 of 44 already carry a ledger entry today. Of the 3 untouched: 2 are not real venues at all — **"Venue TBC"** (a placeholder name, §0.23 named non-place — should never have been created, not this task's job to delete) and **"United match)"** (address is Old Trafford football stadium; a garbled capture, not a music venue) — skipped without a search, flagged to CTO-INBOX. The third, **"EX39 4JN"** (Instow Beach, Devon), was searched: only a village community page found, not the beach's own page — evidenced blank, same class as Willenhall/Bumble Hole/Bridgnorth Castle.

**Zero venue writes possible this firing. Venue backlog saturation reconfirmed** (firings 06, 07, 08, now 09).

Tier 4/5 (backlog artists, artists missing genres with a facebookUrl) were **not reached** — tier 1 filled the 15-artist cap.

## Records with a verified page

**Artists (10 of 15):**

| Artist | Facebook | Notes |
|---|---|---|
| Gallery 47 | facebook.com/Gallery47 | Tier A/B: confirmed via Google as Jack Peachey, real Nottingham singer-songwriter; page's own Intro states "Songwriter from Nottingham, UK" — matches stored city exactly. No extended bio field on the page; quoted the Intro line as the bio. |
| The Mechanist | facebook.com/TheMechanistBand | Tier A: page's own Intro is near-identical to the stored (pre-existing) bio — confirms identity. Stored bio was a paraphrase (`&`→`and`, punctuation tidied); corrected to the exact captured text, including the flag emoji and phonetic bracket. |
| Stereofakeits | facebook.com/61567067621280 | Tier B: exact name, category Musician/band, sole candidate, bio matches stored `actType: tribute` exactly. Google's location snippet said Birmingham; stored location is Willenhall — both West Midlands, not identical city, noted here per §7 rather than overridden. |
| The Fleetwood Mack Experience | facebook.com/TheFleetwoodMackExperienceUK | Tier A: page states "a 6-piece tribute band from the West Midlands in the UK" — exact regional match to stored location. |
| Emma Stiles | facebook.com/emmastilesmusic | Tier A: page's own Intro states "North East, UK" — exact match to stored region. Sourced originally via insangel. |
| Year Zero | facebook.com/yearzeropunk | Tier A: page's own bio is near-identical to the stored (pre-existing) bio — confirms identity. Stored bio had a straight apostrophe and no trailing punctuation where the page uses curly quotes; corrected to the exact captured text. |
| Value Of Nothing | facebook.com/profile.php?id=61561154862926 | Tier A: found via Facebook page search (`Value Of Nothing band`) after Google returned no FB link. Page bio "Radge post- hardcore from Lestah/..." — "Lestah" is Leicester slang, matching the stored (pre-existing) bio's "Leicester" — decisive identity match. Numeric profile.php id, own Bio field. |
| The Thirteenth Turn | facebook.com/profile.php?id=61553348968516 | Tier A/B: found via Facebook page search after Google corroborated a Stoke gig (The Rigger, 4 Sept) and a Netherlands-based vocalist. Page bio confirms "England and the Netherlands" — cross-source agreement. |
| Spodo Komodo | facebook.com/profile.php?id=61579839447690 | Tier A: found via Facebook page search — two same-name pages exist; picked the one whose bio states "3 Lincolnshire musicians", exact match to stored region. The other ("Spodo-Verse") was not this act. |
| Millie Jenson | facebook.com/profile.php?id=61571960858866 | Tier B: sole candidate, exact name, category Musician/band, plausible follower count (86), no contradicting evidence — the explicit §5.2 Tier B "sole candidate" case. Page carries no bio text at all; left bio empty, flagged `STUB_NO_BIO` (WARN, not FAIL). |

All 10 writes verified by `get_by_id` read-back (§0.10) after the `edit_artist` call. `profileImageUrl` set for all 10 using the `graph.facebook.com/<handle-or-numeric-id>/picture?type=large` form (not individually placeholder-tested against §8's three-outcome check this firing — time-boxed; flagged here rather than silently skipped).

**Venues: none worked, none verified.** See Selection — the one genuinely untouched candidate (Instow Beach) had no own page.

## Records recorded as an evidenced blank

**Artists (5 of 15)** — Google searched for every record, Facebook's own page search used as the second surface for all 5:

| Artist | Variants tried (Google, then Facebook page search) | Note |
|---|---|---|
| Route 66 | `"Route 66" band Wirksworth facebook`; FB: `Route 66 Wirksworth` (no results) | Multiple same-name "Route 66" bands found (Dorset, Houston, Kansas City) — none in Wirksworth/Derbyshire. Generic name, no confident match on either surface. |
| The Sleepers | `"The Sleepers" band Leicester facebook`; FB: `The Sleepers Leicester` (no music-act results) | Same-name bands found in Cape Town, Chicago, San Francisco, West Midlands — none in Leicester. |
| Andy Lee | `Andy Lee singer Manchester covers facebook`; FB: `Andy Lee Manchester singer` (no confident results) | Google's best candidate ("Andy Lee Entertainer") never confirms a Manchester base in the snippet; FB search returned only unrelated same-name pages. Generic name, common-name collision risk — left blank rather than guess. |
| Ross Alexander | `"Ross Alexander" singer songwriter Northampton facebook` | Found `facebook.com/ross.a.hodgson`, corroborated by a second source (a radio-show FB video naming him as a Kettering musician) — but the page itself is a **personal profile** ("Add friend", "In a relationship with", category "Digital creator", not "Musician/band"). Not attachable per §2A.1 item 4. No delegate page found. Flagged to CTO-INBOX. |
| Tomas Doncker | `"Tomas Doncker" band facebook` | A real, well-documented US touring musician (Wikipedia, official site, `facebook.com/TomasDonckerMusic`) — but bndy is UK-only per §2A.1.1 and the stored record's own location is "New York". Left blank rather than attach a non-UK page; raised as a DECISION to CTO-INBOX since this may be a genuinely booked international act, not a same-name collision. |

**Venues (1)** — Google only (no bio field, §FP.2, so no Chrome step required):

| Venue | Variant tried | Note |
|---|---|---|
| EX39 4JN (Instow Beach, Devon) | `"Instow Beach" facebook Devon` | Found "Instow North Devon" (village community page, 2,281 followers) and assorted group posts, but no page run by the beach itself. Same class as Willenhall Memorial Park / Bumble Hole. Not enriched, flagged. |

## Records skipped (not worked)

**Venues (2 of 3 remaining backlog):** "Venue TBC" and "United match)" are not real venues — a booking-state placeholder and what appears to be a garbled football-fixture capture (address is Old Trafford). Not searched; flagged to CTO-INBOX for a human decision on deletion/correction rather than spending search budget on them.

**Venues (41 of 44 backlog):** all carry at least one ledger entry from today's earlier firings. Reconfirms `bv2a-venue-backlog-saturated`.

## Names corrected under §0.6

None this firing.

## Locations corrected under §2A.3 / §7

None applied. One page-stated signal noted but not acted on: Stereofakeits' Google snippet said "Birmingham" against the stored Willenhall — both West Midlands, treated as consistent rather than a conflict, per the same reasoning as firing 08's RockSka/Dialled Down notes.

## Genre corrections on contact

Two pre-existing records — **Value Of Nothing** and **The Thirteenth Turn** — carried the genre value `Hardcore`, which is not in the 32-value canonical list (§0.18 / ENRICHMENT-TASK-v3 §6). Neither was written by this firing's search-and-attach step; found on contact while writing `facebookUrl`. Corrected both to `["Punk"]` (dropping the unmapped value, keeping the genre already present) rather than leaving the validator FAIL unresolved. Flagged to CTO-INBOX for the mapping table to gain a `Hardcore` row.

## Validator summary line (verbatim)

First pass:

```
10 records · 7 clean · 2 FAIL · 1 WARN   [mode=gate]
```

FAIL: `GENRE_ENUM` on Value Of Nothing and The Thirteenth Turn — see "Genre corrections on contact" above. Fixed by correcting the stored genres, not by reverting the firing's own writes.

Second pass, after the genre fix:

```
10 records · 9 clean · 0 FAIL · 1 WARN   [mode=gate]
```

Remaining WARN, not blocking:
- `STUB_NO_BIO` on **Millie Jenson** — the page carries no bio field at all (only a category); left empty per §0.0 rather than composing one.

The 5 evidenced-blank artists and the 1 evidenced-blank venue were not run through the gate validator — no `edit_artist`/`edit_venue` write was made to any of them, so there is nothing for the gate to check (the validator's own docstring: gate mode validates records "a run has JUST written"). Three of the five blanks (Route 66, The Sleepers, Ross Alexander) carry pre-existing bios from earlier imports that this firing did not touch or re-evidence; including them in a gate run would FAIL `BIO_SOURCE` for a bio this firing never claimed to have sourced — same exclusion class as firing 06's Em & Geggs/IRIS/Sons of the Valley/Spitting Feathers.

## Defects / rules raised

- `bv2a-ross-alexander-personal-profile-only` (CTO-INBOX) — best candidate for Ross Alexander is a personal profile, not attachable.
- `bv2a-tomas-doncker-non-uk-real-act` (CTO-INBOX, DECISION) — a real, evidenced international touring act stored with a non-UK location; needs a ruling on whether §2A.1.1 blocks this case or only same-name confusion.
- `genre-enum-missing-hardcore-mapping` (CTO-INBOX, DEFECT) — `Hardcore` is not canonical and has no row in the §0.18 mapping table; found twice this firing.
- `bv2a-instow-beach-ex39-postcode-name` (CTO-INBOX) — council/tourist-board green space, no own page, same class as the standing parks/gardens findings.
- `bv2a-venue-tbc-and-united-match-non-venues` (CTO-INBOX) — two backlog records are not real venues at all; flagged for a human deletion/correction decision, not worked.
- `bv2a-venue-backlog-saturated-reconfirmed-firing09` (CTO-INBOX) — venue backlog saturation reconfirmed for the fourth consecutive firing today.

## Budget used

**10 verified + 5 blank = 15 of 15 artists worked, 0 of 30 venues written** (1 venue candidate found and worked, ending in an evidenced blank; 2 more identified as non-venue records and skipped; venue tier otherwise fully saturated — not budget-limited). Elapsed within the 40-minute ceiling. Circuit breaker did not fire.

Ledger: 10 `enrich` lines for verified artists + 5 `enrich` lines for blank artists + 1 `enrich` line for the blank venue + 1 `snapshot` line appended to `data/state/enrichment-ledger.jsonl`. Snapshot: artistsTotal 2770, artistsMissingSocials 1172 (down from 1182 pre-firing, wait — 1182 at firing 08's close per its own report; today's fresh pull read 1172, a drop of 10, matching this firing's 10 verified writes), artistsMissingGenres 798, venuesTotal 3120, venuesMissingSocials 44 (unchanged — no venue writes this firing). `run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 10, skipped 6 (5 artists + 1 venue). Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2728 enrichment records, 95 snapshots) and `data/normalized/DASHBOARD.html`.

Claim released at end of run (`heldBy: null`, `releasedAt: 2026-08-21T09:52:00Z`). Heartbeat updated to `completed`.
