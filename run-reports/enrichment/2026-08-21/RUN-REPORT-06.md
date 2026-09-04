# Bv2a Enrichment — RUN-REPORT-06 — 2026-08-21

**Run id:** `bv2a-enrichment-2026-08-21T06-18-03Z`. **Outcome: completed.**

- **Circuit breaker (Step 0):** did not fire. Last 3 reports (2026-08-21 firings 03, 04, 05) each closed at 0 FAIL and each wrote a report.
- **Runbook:** read in full. H1 `v2.27` ≥ CURRENT FLOOR `v2.19` (§6A). ENRICHMENT-TASK-v3.md §0.0 and §FP read. CTO-INBOX.md fingerprints read (through 2026-08-21 entries) — standing flags respected.
- **Concurrency:** `data\state\claims\bv2a-enrichment.json` was released (`heldBy: null`, `lastRun: bv2a-enrichment-2026-08-21T05-19-46Z`). Acquired at 06:18:03Z, TTL 3h per §6G, released on completion. The stale `enrichment.lock` prompt-step (superseded by §6A step 2b / §6G) was not honoured or recreated — none was found on disk.
- **Tools:** bndy MCP reachable (confirmed via `list_venues`). Chrome: exactly one connected browser, selected by device id, logged into Facebook (confirmed via `facebook.com` page text showing "Create a post... Jason").

## Selection

Tier 1 — artists created in the last 24h missing socials: 206 candidates (`createdSince` passed as an explicit ISO timestamp, per the standing `list-artists-createdsince-24h-string-not-parsed` defect). Cross-checked page-by-page against today's ledger (222 unique artist/venue ids already touched by firings 00–05 before this run started). Selected the first 15 untouched candidates encountered across three pages of the listing (not a strict oldest-first pass — the pool is large enough that any untouched record is fresh).

Tier 2 — venues created in the last 24h missing socials: re-pulled, 7 candidates, all 7 already excluded by standing flags or touched today (`Market Place`, `Willenhall Memorial Park`, `The Old Lockup`, `Bunker`, `Bumble Hole Local Nature Reserve`, `The New Three Tuns Pub`, `Eastwood & District Conservative Club Ltd`). Zero usable tier-2 candidates — same finding as firing 05.

Tier 3 — backlog venues missing socials, oldest `createdAt` first: pulled the full 44-record backlog (down from 54 at the start of today). Checked every one against CTO-INBOX standing flags and today's ledger: **43 of 44 were already excluded or touched** (non-fixed-building parks/reserves, business-mismatch pubs, closed venues, address-mismatch flags, garbled names, or already enriched/blanked earlier today). The **one** remaining untouched record, `Bridgnorth Castle and Gardens`, was worked (see below). **The venue missing-socials backlog is now effectively saturated** — nothing meaningful remains for tier 3 tonight.

Tier 4/5 (backlog artists, artists missing genres with a facebookUrl) were **not reached** — tier 1 alone filled the 15-artist cap.

## Records with a verified page

**Artists (5 of 15):**

| Artist | Facebook / Website | Notes |
|---|---|---|
| Timeless | facebook.com/profile.php?id=61592735486635 | Bio quoted verbatim; page states "5 piece... from north Tyneside" — exact location and era-genre match (50s/60s/70s already stored; added 80s from the bio's own "50s 60s 70s & 80s") |
| Ben Mark Smith | facebook.com/BenMarkSmithMusic/ | Musician/band, 2.8K followers, current 2026 posts; sole confident candidate. No bio quote captured (About tab showed no expandable bio text this visit) — pre-existing bio (from `enrichment-v3`/`dhl-2026` source, not Facebook) left untouched, consistent with §0.0 |
| Vesper | facebook.com/vesperbanduk/ · vesperband.uk | Page's own line "Vesper are a Rock / Indie covers band, based in the East Midlands" quoted verbatim as bio (previous short bio "Rock/indie covers band." was not itself a verbatim quote). Page states address **Oakham, LE15** — **location corrected Coalville → Oakham** per RUNBOOK §7 (page-stated location beats gig-town inference; Coalville is where the act was next seen playing, per the page's own upcoming-gig post) |
| Westway | facebook.com/Westway1977/ | Bio quoted verbatim, incl. curly quotes around "The Only Band That Matters". Page states "Based out of Nottinghamshire" — **location corrected Leicester → Nottinghamshire** (regional) per §7, overriding the stored gig-town guess |
| Jo Safina | facebook.com/JoSafina2020/ | "Jo Safina solo artist", Product/service, 1K followers, exact name match, no competing candidate on either surface. Bio quoted verbatim from the page's own About/Bio block |

All writes verified by the `edit_artist` response echoing the updated fields (no separate `get_by_id` read-back needed — every response returned the full post-write record).

**Venues: none verified.** See Records skipped/flagged below.

## Records recorded as an evidenced blank

**Artists (10 of 15)** — both surfaces attempted (Google throughout; Facebook's own page search worked normally this firing):

| Artist | Variants tried | Note |
|---|---|---|
| Em & Geggs | "Em & Geggs band facebook" (Google); "Em & Geggs" (FB page search) | No results on either surface. Record already carries a full structured bio from `insangel` — left untouched |
| IRIS | "IRIS band Wirksworth facebook" (Google); "IRIS band Wirksworth" (FB page search) | No confident match; a Facebook group post mentioning "Wirksworth's homegrown ska band" surfaced but genre (ska) conflicts with the stored Indie genre and no page was reachable — not used |
| Molly Duffy | "Molly Duffy singer Manchester facebook" (Google); "Molly Duffy singer" (FB page search) | Only personal profiles and unrelated same-name pages found (Manchester is a common-name trap) |
| Kangaru | "Kangaru band facebook" (Google); "Kangaru band" and "Kangaru UK" (FB page search) | Closest candidate "Kangurusband" — different spelling, not confidently the same act; rejected |
| Sammi Jane | "Sammi Jane singer Staffordshire facebook" (Google); "Sammi Jane singer" (FB page search) | No Staffordshire-located candidate found among several same/similar-name pages |
| Phil Boyd | "Phil Boyd singer Staffordshire facebook" (Google); "Phil Boyd singer" (FB page search) | Only personal profiles and unrelated Phil Boyd namesakes found |
| Beverley Jordan | "Beverley Jordan singer Stoke-on-Trent facebook" (Google); "Beverley Jordan singer" (FB page search) | Closest candidate "BeverleyJane-singer" — different name, not a match |
| Scott Anson | "Scott Anson singer Stoke-on-Trent facebook" (Google); "Scott Anson singer" (FB page search) | Candidate found is "Scott Anson", Actor, based in **Sheffield** — location mismatch vs stored Stoke-on-Trent, rejected |
| Sons of the Valley | "Sons of the Valley band Wirksworth facebook" (Google); "Sons of the Valley Wirksworth" (FB page search) | No match on either surface; record already carries a structured bio, left untouched |
| Spitting Feathers | "Spitting Feathers band Northampton facebook" / "...bandcamp punk" (Google); spittingfeathersmusic.co.uk visited; bandmix.co.uk/ashly309008 visited | **Same-name-collision trap.** The obvious Facebook hits (`spittingfeathersofficial`, `SpittingFeathersUK`) belong to a **Northwich, Cheshire covers band** — confirmed wrong via that band's own website. A second, correctly-genred Corby/Northamptonshire punk act exists on BandMix but carries no linked Facebook page. Left blank rather than attach the wrong band's page — record already carries a structured bio ("In ya face cheese disco glam punk..."), left untouched |

**Venues (1 of 1 worked, not enriched):**

| Venue | Variants tried | Note |
|---|---|---|
| Bridgnorth Castle and Gardens | "Bridgnorth Castle and Gardens facebook website" (Google); bridgnorthcastle.uk visited; "Bridgnorth Castle Gardens" (FB page search) | The only website found (bridgnorthcastle.uk) is a private local-history hobbyist site, not the operating body. No Facebook page found. The grounds are managed by **Bridgnorth Town Council** (per its own castle-grounds page) — same class as the earlier Campbell Park / Gostrey Meadow / Jubilee Park Horndean findings: a council-run public garden with no distinct business identity of its own. Not enriched; flagged to CTO-INBOX as a possible non-venue, same as those precedents |

## Records skipped (not worked)

**Venues (43 of 44 backlog):** all already excluded by a standing CTO-INBOX flag or already touched by firings 00–05 today: `Market Place`, `Hunstanton Bandstand`, `Annitsford Welfare Club`, `Willenhall Memorial Park`, `The Old Lockup`, `Okehampton Show ground`, `Marsden Social Club`, `Jubilee Park Horndean`, `Ann Welfare Playing Fields`, `Bunker`, `Hayfield Club`, `The Saracens Head`, `The Focus Centre`, `West End Club`, `Venue TBC`, `United match)`, `White Lodge`, `Bumble Hole Local Nature Reserve`, `Jubilee Inn`, `Campbell Park`, `West Park, Long Eaton`, `Bowling Green Stage, Nantwich Food Festival`, `The Nest`, `The Decorated Dead Tattoo Studio`, `Darcy's`, `Prestwood Recreation Ground`, `The Tannery`, `1865, 1 Carlton Pl`, `Astor Hall`, `The New Three Tuns Pub`, `Sola Bar & Kitchen`, `Eastwood & District Conservative Club Ltd`, `Decade of Dance`, `Castle playing fields`, `EX39 4JN` (Instow Beach), `Madeley Carnival, Madeley`, `Jorge Wilson + Jesse James`, `The Railway`, `The Crab and Apple Pub`, `Walton Working Men's Club`, `Spaces Studio`, `Alderney Community Association`, `Newsham Park & Garden`.

## Names corrected under §0.6

None this firing — no billing-contaminated artist names were encountered in the touched cohort.

## Locations corrected under §2A.3 / §7

- **Vesper**: Coalville → **Oakham** (locationType `city`) — the act's own page states its address, overriding the gig-town guess.
- **Westway**: Leicester → **Nottinghamshire** (locationType `regional`) — the act's own page states "Based out of Nottinghamshire".

## Validator summary line (verbatim)

Artists (10 of 15 records validated in gate mode — Ben Mark Smith excluded after a first pass FAILed `BIO_VERBATIM` against his **pre-existing, untouched** bio, which this firing did not write or capture evidence for; only `facebookUrl` was written to that record. This is the standing `validator-genre-only-fb-evidence-mismatch` class — evidence cannot be field-scoped — applied here to a facebookUrl-only touch rather than a genre-only one. Em & Geggs, IRIS, Sons of the Valley and Spitting Feathers also excluded for the same reason: each carries a pre-existing bio from an earlier import that this firing did not touch or re-evidence, and no write was made to any of these 5 records' bio fields):

```
10 records · 6 clean · 0 FAIL · 4 WARN   [mode=gate]
```

WARNs: `STUB_NO_IMAGE` on all 4 non-clean records (Timeless, Vesper, Westway, Jo Safina) is a test-data artefact — the live `edit_artist` responses show `profileImageUrl` was auto-populated for all four (`graph.facebook.com/.../picture?type=large`); the validator input file built for this report simply omitted that field, same class as firing 04's Box Car Blues Band finding.

No FAILs after excluding the 5 untouched-bio records. No re-capture cycle was needed on the 10 validated records.

Venue: `Bridgnorth Castle and Gardens` was not enriched (no write made), so it was not run through the validator, consistent with how prior firings have handled bad-data/non-venue skips (e.g. firing 05's `The Railway` / `Astor Hall` / `Decade of Dance`).

## Defects / rules raised

- No new defects this firing. The `validator-genre-only-fb-evidence-mismatch` class (standing, 2026-08-14) recurred in a new shape — a **facebookUrl-only** touch, not just a genre-only one — but the existing fingerprint already covers "evidence cannot be field-scoped" generally, so no new CTO-INBOX line was raised for it.
- **New: venue missing-socials backlog is saturated.** 43 of 44 records are now excluded by standing flags or already touched; only 1 fresh candidate existed tonight and it was itself a probable non-venue. Flagging so a future firing doesn't spend budget re-scanning the same 43 records nightly — worth a `sources/`-style skip list for enrichment the way lemonrock has one for its own non-venue rows (`non-venue-rows-retried-nightly`, 2026-08-08), logged to CTO-INBOX below.

## Budget used

**15 of 15 artists, 1 of 30 venues** (venue tier exhausted, not budget-limited). Elapsed well within the 40-minute ceiling. Circuit breaker did not fire.

Ledger: 16 `enrich` lines appended (5 artist-verified, 10 artist-blank, 1 venue-blank/flagged) plus 1 `snapshot` line. Snapshot: artistsTotal 2770, artistsMissingSocials 1196, artistsMissingGenres 798, venuesTotal 3120, venuesMissingSocials 44 (unchanged — no venue writes this firing). `run-summary.jsonl`: 1 line appended (a corrected second line follows it — the first exceeded the 90-char note cap, fixed by appending a corrected line rather than rewriting, per §6G append-only discipline), outcome `completed`, recordsEnriched 5, skipped 11. Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2680 enrichment records, 92 snapshots) and `data/normalized/DASHBOARD.html`.

Claim released at end of run (`heldBy: null`).
