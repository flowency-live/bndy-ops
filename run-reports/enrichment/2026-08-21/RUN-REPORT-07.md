# Bv2a Enrichment — RUN-REPORT-07 — 2026-08-21

**Run id:** `bv2a-enrichment-2026-08-21T07-18-19Z`. **Outcome: completed.**

- **Circuit breaker (Step 0):** did not fire. Last 3 reports (2026-08-21 firings 04, 05, 06) each closed at 0 FAIL and each wrote a report.
- **Runbook:** read in full. H1 `v2.27` ≥ CURRENT FLOOR `v2.19` (§6A). ENRICHMENT-TASK-v3.md §0.0 and §FP read. CTO-INBOX.md fingerprints read (through 2026-08-21 entries) — standing flags respected.
- **Concurrency:** `data\state\claims\bv2a-enrichment.json` was released (`heldBy: null`, `lastRun: bv2a-enrichment-2026-08-21T06-18-03Z`). Acquired at 07:18:19Z, TTL 3h per §6G, released on completion. The stale `enrichment.lock` prompt-step (superseded by §6A step 2b / §6G) was not honoured or recreated — none was found on disk. Heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-21T07-18-19Z.json` written first, updated to `completed` last.
- **Tools:** bndy MCP reachable (confirmed via `list_venues`). Chrome: exactly one connected browser, selected by device id, logged into Facebook (confirmed via `facebook.com` page text showing "Jason Jones").

## Selection

Tier 1 — artists created in the last 24h missing socials: 201 candidates (`createdSince` passed as an explicit ISO timestamp, per the standing `list-artists-createdsince-24h-string-not-parsed` defect). Cross-checked against today's ledger (238 unique ids touched by firings 00–06 before this run started, across every task, not just enrichment). Selected 15 untouched candidates across two pages of the listing, biased toward the oldest `createdAt` within each page rather than a strict single global sort — the pool is large enough that any untouched record is fresh.

Tier 2 — venues created in the last 24h missing socials: re-pulled, 7 candidates, all 7 already excluded by standing flags or touched today (`Market Place`, `Willenhall Memorial Park`, `The Old Lockup`, `Bunker`, `Bumble Hole Local Nature Reserve`, `The New Three Tuns Pub`, `Eastwood & District Conservative Club Ltd`) — identical set to firing 06. Zero usable tier-2 candidates.

Tier 3 — backlog venues missing socials, oldest `createdAt` first: pulled the full 44-record backlog — **unchanged from firing 06's saturated count.** Every one of the 44 is either already flagged (standing CTO-INBOX entry) or already touched today; no fresh candidate exists. **Confirms the `bv2a-venue-backlog-saturated` finding raised in firing 06 — this firing spent no further budget re-scanning it.** Zero venue writes this firing.

Tier 4/5 (backlog artists, artists missing genres with a facebookUrl) were **not reached** — tier 1 alone filled the 15-artist cap.

## Records with a verified page

**Artists (8 of 15):**

| Artist | Facebook / Website | Notes |
|---|---|---|
| CaveGirl | facebook.com/cavegirlandtheneandergals/ | Tier A: bndy's own bio already named the backing act "The Neandergals" and the page's own upcoming-gig list includes Duffy's, Leicester — matching the stored Leicester location. Bio quoted verbatim (retained the page's own emoji). |
| 54 North | facebook.com/54Northmusic | Tier A: page's own bio — *"54 North is a Celtic Fusion Trio with Folk, Blues and Country influences"* — matches bndy's stored genres and trio format exactly, plus an upcoming Lincoln gig (Oct 2026) matching the stored location. Facebook's own page search (`facebook.com/search/pages`) worked normally this firing, recovering a candidate Google alone had missed — see Defects below. |
| Bitter Sweet Smile | facebook.com/p/Bitter-Sweet-Smile-61556250942962/ | Tier B: exact name, page states "Northants, UK" matching stored Northampton location, genre (90s grunge/alternative rock) matches stored Grunge/Rock. Category Musician/band. |
| Total Clash | facebook.com/Total.Clash.band/ | Tier A/B: exact thematic bio match (Clash tribute, "'77-'79" punk era), sole candidate, no competing page. Page states **Clitheroe, United Kingdom** — **location corrected West Midlands → Clitheroe** (locationType `city`) per RUNBOOK §7, the act's own page overriding the stored regional guess. Bio's own curly-quote apostrophe (`'77`, U+2018) preserved verbatim — validator's `BIO_PUNCTUATION` WARN on the first pass was a re-typing artefact on my end, corrected by re-capturing the exact codepoint from the live page rather than retyping. |
| Tom Taylor | facebook.com/MusicofTomTaylor/ | Tier B: page states "North East and Cumbria" gig footprint, consistent with stored Newcastle upon Tyne. Bio quoted verbatim including the page's own Instagram line (with its own typo, "Instagram.con"). |
| Derek Nash Acoustic Quartet | facebook.com/p/Derek-Nash-Music-100082532301015/ | Tier B: unique named jazz musician, own website (dereknash.com) linked, category Musician/band, no collision risk. Bio quoted verbatim ("Saxophone around the world") — short but genuine, not composed. |
| Nick Costley-White Guitar Trio | facebook.com/people/Nick-Costley-White/61557415787209/ | Tier B: unique name, own website linked (nickcostleywhite.co.uk), a post referencing a "trio gig" corroborating the stored trio format. Bio quoted verbatim ("Jazz Guitarist"). |
| Broken English | facebook.com/BECR2017/ | Tier B: page states "Black Country" — consistent with stored Willenhall location — and covers classic rock acts (Thin Lizzy, AC/DC, Zep, Sabbath, Priest) consistent with stored Rock/80s genres. Page's own name is "Broken English classic rock", not bare "Broken English" — **not renamed** (venue/artist protocol carries no unattended-rename authority for a borderline case); flagged to CTO-INBOX for a human rename decision, same handling as today's Higham Ferrers WMC finding. |

All 8 writes verified by the `edit_artist` response echoing the updated fields. `profileImageUrl` set explicitly for all 8 (3 needed a follow-up write after the validator's first pass flagged `STUB_NO_IMAGE` — see Validator section).

**Venues: none worked, none verified.** See Selection, tier 3.

## Records recorded as an evidenced blank

**Artists (7 of 15)** — both surfaces attempted (Google throughout; Facebook's own page search also worked this firing, recovering 54 North above):

| Artist | Variants tried | Note |
|---|---|---|
| Parasight | "Parasight band Nottingham facebook" (Google) | Facebook page found (facebook.com/parasightband/, 1.7K followers, Musician/band) but the page states no location anywhere in the visible About/intro text, the band has since disbanded ("no longer carrying on with PARASIGHT"), and an external aggregator described it as "from Derby" against bndy's stored Nottingham (Yasfest lineup) — a real, unresolved location conflict with no page-stated signal to settle it. Left blank rather than risk a wrong regional attach; flagged as a near-miss worth a human's 30 seconds. |
| Kieran Poile | "Kieran Poile singer Staffordshire facebook" (Google) | A real "Kieran Poile" musician exists (Bluegrass/Country/Old-time/Fiddle — genre overlap with bndy's stored Folk/Americana/Country is compelling) but every reference found ties him to Montreal/Whitehorse, Canada, with no Staffordshire connection surfaced. Left blank rather than attach a possibly-wrong-country act; flagged as a near-miss. |
| Jono Rowland | "Jono Rowland Swanage Blues Festival facebook" (Google) | Only the festival's own page surfaced, not an act page — the festival page is not the act's own page and was not used per §5.3. No individual page found. |
| After The Storm | "After The Storm band Stoke-on-Trent facebook" (Google) | A gig-review site (themidlandsrocks.co.uk) confirms the act's existence and describes two songs, but no Facebook link was surfaced for a Stoke-on-Trent act by that name (name-collision risk with same-named acts elsewhere is high for this generic name). |
| Vulture Squadron | "Vulture Squadron band facebook" (Google) | Multiple same-name candidates found (a SW-home-counties covers act that "permanently grounded" after 32 years, a "Not your average rock band" page, a historic Southend punk act) — none stated Greater Manchester, and no single candidate met the Tier B bar of 2+ signals. Left blank. |
| Saskia | "Saskia singer Derby facebook indie" (Google) | Common first name — five-plus different "Saskia" musicians found (Saskia Maxwell, Saskia Scott, Saskia GM, Saskia Eng, Saskia Jae Singer), none with a Derby/East Midlands signal. Left blank rather than guess among namesakes. |
| The Other Half | "The Other Half band Willenhall facebook" (Google) | The only well-evidenced candidate (facebook.com/otherhalfuk/, "Give Them The Girl" on Big Scary Monsters Records) is a known indie act with no Willenhall connection — rejected as a likely wrong-region same-name act, consistent with §2A.1.1's "it's all I could find" trap. |

## Records skipped (not worked)

**Venues (44 of 44 backlog):** identical set to firing 06 — all already excluded by a standing CTO-INBOX flag or already touched today. No change since the last firing; see the `bv2a-venue-backlog-saturated` entry (2026-08-21, firing 06) for the full list.

## Names corrected under §0.6

None this firing.

## Locations corrected under §2A.3 / §7

- **Total Clash**: West Midlands (regional) → **Clitheroe** (locationType `city`) — the act's own page states its address; the stored region was a guess this firing has now replaced with page-stated fact.

## Validator summary line (verbatim)

First pass (before the profileImageUrl and punctuation fixes below):

```
8 records · 4 clean · 0 FAIL · 6 WARN   [mode=gate]
```

WARNs on the first pass: `STUB_NO_IMAGE` on 3 records (Bitter Sweet Smile, Derek Nash Acoustic Quartet, Nick Costley-White Guitar Trio) — `profileImageUrl` had not been set on these three at write time; fixed with a follow-up `edit_artist` call setting the standard `graph.facebook.com/<handle-or-id>/picture?type=large` form for each. `BIO_PUNCTUATION` on Total Clash — the bio I submitted used a straight apostrophe (`'77`) where the live page uses a curly `'` (U+2018) as its own typo; re-captured the exact codepoint from the page (not retyped) and corrected.

Second pass, after both fixes:

```
8 records · 6 clean · 0 FAIL · 2 WARN   [mode=gate]
```

Remaining WARNs: `NAME_BILLING` (format tail) on **Derek Nash Acoustic Quartet** and **Nick Costley-White Guitar Trio** — both are the standing, correctly-handled case under RUNBOOK §2A.1 item 6: a trailing format descriptor (`Quartet`, `Trio`) is part of the act's own working name and is not stripped absent the act's own page showing a different name. Neither page contradicts the stored name (Derek Nash's page is his personal "Derek Nash Music" page, not the quartet's own; Nick Costley-White's page carries his bare name with no trio-specific page existing). No rename made. No re-capture cycle was needed beyond the two fixes above.

No FAILs at any point. Zero venue writes this firing, so nothing to validate on that side.

## Defects / rules raised

- **Facebook's own page search is working again this firing** (`facebook.com/search/pages/?q=...` returned real text content, e.g. for "54 North band"), reversing the `facebook-page-search-not-found` recurrence noted in firing 04 earlier today. Intermittent — worth noting the flip-flop rather than treating either state as settled.
- **`bv2a-venue-backlog-saturated` (raised 2026-08-21, firing 06) reconfirmed unchanged** — the 44-record venue backlog had zero new candidates this firing, one firing later. Nightly re-pulls of the same 44 rows continue to cost nothing but the list call itself, but the finding stands: a skip list would save the trouble of re-reading 44 flag rationales nightly.
- No new record-level defects this firing.

## Budget used

**15 of 15 artists, 0 of 30 venues** (venue tier exhausted at tier 2/3, not budget-limited — see Selection). Elapsed well within the 40-minute ceiling. Circuit breaker did not fire.

Ledger: 15 `enrich` lines appended (8 artist-verified, 7 artist-blank) plus 1 `snapshot` line. Snapshot: artistsTotal 2770, artistsMissingSocials 1188, artistsMissingGenres 798, venuesTotal 3120, venuesMissingSocials 44 (unchanged — no venue writes this firing). `run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 8, skipped 7. Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2695 enrichment records, 93 snapshots) and `data/normalized/DASHBOARD.html`.

Claim released at end of run (`heldBy: null`). Heartbeat updated to `completed`.
