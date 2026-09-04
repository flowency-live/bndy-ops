# Bv2a Enrichment — RUN-REPORT-18 — 2026-08-27

**Run id:** `bv2a-enrichment-2026-08-27T18-18-06Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Checked the last 3 run reports by mtime before any other action: RUN-REPORT-17 (17:17:56Z firing, completed, validator "4 records · 2 clean · 0 FAIL · 3 WARN" after excluding 2 pre-existing-bio false positives), RUN-REPORT-16 (16:19:58Z firing, completed, "3 records · 2 clean · 0 FAIL · 2 WARN"), RUN-REPORT-15 (15:19:30Z firing, completed, "2 records · 2 clean · 0 FAIL · 0 WARN"). All three completed with 0 FAIL. Breaker did not fire.

## Runbook / task spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full: §0A, §0 prime directives 1–29, §1/§1A identity + same-name protocol, §2/§2A enrichment protocol (2A.1 items 1–8 including 3b both-surfaces-mandatory and item 8 bio-is-a-quotation, 2A.2 mechanics), §3 venue protocol, §4 multi-artist model, §5 event protocol, §6 run discipline, §6A run contract (steps 0–9), §6B platform facts, §6C failure classes, §6D/6D-bis event identity, §6E horizons, §6F concurrency ownership lanes, §6G concurrency lock protocol/TTL table (`bv2a-enrichment` = 3h)/dead-holder takeover, §7 changelog. `ENRICHMENT-TASK-v3.md` read in full: §0.0, §FP fast path, §1–§11a. `CTO-INBOX.md` read in full (both pages) for standing `bv2a`/`DEFECT`/`DATA`/`RULE` entries.

**Standing defects/precedents applied, not re-discovered:**
- `bv2a-venue-edit-facebookurl-param-silent-noop` — not applicable this firing (no venue writes).
- `bv2a-firing1419z-validator-cannot-check-venues` — not applicable (no venue records in the gate pass).
- `bv2a-firing1319z-verify-id-before-live-write` — applied: every write's target id/name confirmed via `get_by_id` read-back immediately after writing.
- `bv2a-firing1319z-never-guess-fb-vanity-url` / `bv2a-firing1717z-guessed-fb-vanity-url-recurrence` — applied: every facebookUrl written was copied from a search result or DOM-read href, never inferred from a name.
- `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` — **hit twice this firing** (The Latest Flames, Spiralling) — both carried a pre-existing bio from an earlier process that this firing never touched; excluded both from the gate pass with the standing rationale (see Validator section).
- `bv2a-venue-backlog-saturated` (multiple prior firings) — reconfirmed: of 47 backlog venue candidates, 0 were fresh (all already flagged non-venue/address-mismatch or touched by an earlier firing today).

## Concurrency

`data\state\claims\bv2a-enrichment.json` at read time (18:18:06Z) held `{"heldBy":null,"releasedAt":"2026-08-27T18:42:00Z", ...}` — released, matching RUN-REPORT-17's close. Wrote heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-27T18-18-06Z.json` (`outcome:"started"`) before any gate, then acquired the claim: `heldBy: bv2a-enrichment-2026-08-27T18-18-06Z`, TTL 3h, `expiresAt: 2026-08-27T21:18:06Z`. No `data\state\enrichment.lock` file found (confirmed retired per §6A step 2b — not honoured, not recreated). Claim released and heartbeat set to `completed` at close.

## Tools

bndy MCP reachable (confirmed via `list_artists`/`list_venues`). Chrome: exactly one connected browser (`Browser 1`, deviceId `7ad060c3-b3e0-41c9-9dd4-a8097db94bfa`), selected by device, confirmed logged into Facebook via a live render of `facebook.com/` showing the account's own feed ("What's on your mind, The Torrists?") before any bio quote was taken.

## Selection

**Tier 1 — artists created in the last 24h missing socials:** `list_artists(createdSince:"2026-08-26T18:18:06Z", missingSocials:true)` returned the same 11 candidates as firings 16/17 (Lee Wainwright, Plastic Soul, Xclusive, Greg Davies, Andy Preston & Co, Manic, Jung, the Reform, Tee, The Escape Committee Trio, Over the Moon). All 11 already carried an evidence line from firing 00/01 today. Not re-searched. None counted toward this firing's worked total.

**Tier 2 — venues created in the last 24h missing socials:** `list_venues(createdSince:"2026-08-26T18:18:06Z", missingSocials:true)` returned **0 candidates**.

**Tier 3 — backlog venues missing socials, oldest `createdAt` first:** `list_venues(missingSocials:true, limit:100)` returned **47** candidates (down from 48 at firing 17's start — Bunker (Heanor) resolved). Cross-checked every one against today's evidence file (venueId-keyed) and against the standing named skip list (White Lodge, Astor Hall, Decade of Dance, Old Lockup Wirksworth, Market Place Burton, Willenhall Memorial Park, Bumble Hole, Instow Beach, Venue TBC, United match), Bridgnorth Castle and Gardens, The Nest Leek, Hayfield Club, Spaces Studio, Jorge Wilson + Jesse James, The Railway Stockport, Darcy's Fenton, The Snooks, Middle of the Road Cafe). **Every one of the 47 is either already touched today or on the standing skip list. Zero fresh candidates — full backlog saturation, reconfirmed at 47/47.** 0 venue writes this firing, not a stopping decision.

**Tier 4 — backlog artists missing socials, oldest `createdAt` first:** `list_artists(missingSocials:true)` (1426-strong at query time; pulled two pages of 50, offset 0 and 50, sorted locally by `createdAt`). 35 of the 100 sampled already carried an evidence line from earlier firings today; **15 genuinely fresh candidates** identified, `createdAt` 2026-08-09T21:44Z through 2026-08-20T17:31Z: The Latest Flames, SoulMatrix, Afterlife Rock Covers Band UK, Amber Star, Aiva Walmsley, Dave Legg, Marshal Beard, Winter Wilson, Steve & Julie Wigley, Narthen, Art Themen Organ Trio, Cyph_on, Josh Bailey Trio, Spiralling, Strictly ABBA. **Worked all 15 — 4 verified, 11 evidenced blank.** Meets the 15-artist budget cap exactly.

**Tier 5 (artists missing genres with a facebookUrl):** not reached — the 15-artist cap was met by Tier 4.

## Records with a verified page

| Artist | Facebook | Note |
|---|---|---|
| Afterlife Rock Covers Band UK (Essex) | facebook.com/p/Afterlife-Rock-Covers-Band-61572136558797/ | Tier A/B: sole candidate, name-exact ("Afterlife Rock Covers Band"), Musician/band, page-stated "Lives in Harlow, Essex" matches the stored Essex location and the lemonrock record's Roydon/Essex footprint. Bio quoted verbatim: *"Afterlife are a classic rock (not heavy rock) band. Formed in 2018, the band is tight, and we play all over the UK in pubs & clubs. We are well known in the bike rally and festival scenes. We have both indoor and outdoor Pa."* Avatar not attached — the page's numeric graph id could not be extracted this pass (`javascript_tool`'s `=`-blocking guard stripped the relevant attribute values); left empty rather than guess, flagged `STUB_NO_IMAGE` in the validator (benign). |
| Winter Wilson (Derby) | facebook.com/winterwilsonmusic/ | Tier A: nationally-known, well-evidenced UK folk duo (Kip Winter, Dave Wilson), confirmed by independent press coverage playing the Derby folk festival circuit that this record's `derbyfolk` externalId sources from. Bio quoted verbatim: *"Folk with a splash of blues, singing out for the underdog, beautiful songs, beautifully sung."* Website winterwilson.com also written. Genres `Folk`, `Blues` inferred from the bio's own words. |
| Narthen (Derby) | facebook.com/narthenmusic/ | Tier A: name-exact match, Musician/band, sole candidate, page confirms membership (Jo Freya, Fi Fraser, Sarah Matthews, Doug Eunson) matching independent coverage. Bio quoted verbatim: *"Narthen are Jo Freya, Fi Fraser, Sarah Matthews and Doug Eunson. They play Soprano Sax, clarinet, Whistles, Fiddles, hammer dulcimer, diatonic accordion and they sing in soaring 4 part harmony."* Website narthen.info also written. Genre `Folk` inferred from context (derbyfolk source, ensemble folk instrumentation stated in the act's own bio). |
| Strictly ABBA (West Midlands) | facebook.com/strictlyabbatribute/ | Tier B: sole candidate on both surfaces, name-exact, Musician/band, 3.7K followers, current activity — meets the documented "sole candidate + verbatim name + category + current activity + plausible followers" Tier B bar. Bio quoted verbatim: *"Strictly ABBA - The ultimate tribute band to the music of ABBA"*. Page states no location field; existing West Midlands / Pop / 70s / tribute fields left untouched. |

All 4 writes verified by `get_by_id` read-back immediately after writing, before counting as verified.

## Records recorded as an evidenced blank

**Artists (11 of 15 worked)** — both surfaces (Google + Facebook page search) tried for every record before recording blank, per §2A.1 item 3b:

| Artist | Note |
|---|---|
| The Latest Flames (Enfield, London) | Google surfaced only lemonrock/reverbnation pages for named member Chris Hargrave, no dedicated band FB page. FB page search returned only unrelated Enfield brass/concert bands. |
| SoulMatrix (Surrey) | Google returned only Surrey soul/Motown hire-band directories, none named SoulMatrix. FB page search returned no matching pages. |
| Amber Star (Greater Manchester UK) | Only candidate found (`amberstarnyc`) is a Los Angeles digital creator — non-UK, rejected per §2A.1 item 1. FB page search returned unrelated "Amber Band" UK acts, none named Amber Star. |
| Aiva Walmsley (North East England) | Google surfaced an unrelated London-based "Aiva Music" with no Walmsley evidence. FB page search returned zero results for the exact name. |
| Dave Legg (Greater Manchester UK) | No dedicated act page found on either surface — only personal profiles matching the name, not attachable per §2A.1 item 4. |
| Marshal Beard (Congleton) | Google confirmed a Congleton Beer Festival 2026 performance but no dedicated FB page. FB page search returned only unrelated same-surname musicians, none in Congleton. |
| Steve & Julie Wigley (Derby) | Google confirmed the duo is Derbyshire-based (Julie Wigley from Derby) with videos hosted on third-party pages (Derbyfolkfest, thenarrowboatsessions) but no dedicated own FB page. FB page search returned only an unrelated solo "Steve Wigley music" from the Black Country — region and format mismatch, rejected. |
| Art Themen Organ Trio (London) | Google confirmed the touring lineup (Art Themen sax, Pete Whittaker organ, George Double drums) but surfaced no dedicated FB page, only third-party promoter/venue pages hosting videos. FB page search for "Art Themen" returned zero relevant pages. |
| Cyph_on (Leicester) | Google confirmed a Leicester gig at Firebug but no dedicated FB page. FB page search returned only unrelated tech/gaming/retail pages. |
| Josh Bailey Trio (Birmingham) | Google confirmed the trio (Royal Birmingham Conservatoire lineup) but no dedicated FB page. Sole FB candidate `facebook.com/joshbaileyartist` visited directly — states "21 year old singer from Surrey", a different solo act in the wrong region — rejected. |
| Spiralling (Nottingham) | Only candidate found on either surface is "Spiraling" (single L), a New Jersey, US band — non-UK, rejected per §2A.1 item 1. FB page search for "Spiralling Nottingham" returned no matching UK act. |

## Names corrected under §0.6 / Locations corrected / Genre corrections

- **Genres inferred** (the one field a run may infer, per §2A.1 item 8): Winter Wilson → `Folk`, `Blues` (from the act's own "Folk with a splash of blues" bio); Narthen → `Folk` (from context: derbyfolk source, ensemble folk instrumentation in the act's own bio).
- No name or location corrections this firing.

## Validator summary line (verbatim)

Two scope exclusions applied before the gate run, consistent with the standing `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` defect:

1. **The Latest Flames** — pre-existing bio (from an earlier process) untouched this firing; this firing's evidence line sourced the facebookUrl search (found nothing), not the bio.
2. **Spiralling** — same class: pre-existing bio ("Nottingham band (Yasfest lineup).") untouched this firing.

First pass, all 15 artist records:
```
15 records · 10 clean · 2 FAIL · 3 WARN   [mode=gate]
```
Both FAILs were `BIO_VERBATIM` on the two excluded records above — confirmed via each record's own edit history that this firing wrote nothing to either. Excluded both with this rationale and re-ran:

```
13 records · 10 clean · 0 FAIL · 3 WARN   [mode=gate]
```

0 FAIL. Batch ships. All 3 WARNs are benign and expected: `STUB_NO_IMAGE` on Afterlife Rock Covers Band UK (the `/p/.../<numeric>/` page form did not yield an easy graph image this pass under the `javascript_tool` `=`-blocking guard — left empty rather than guess); `NAME_BILLING` on Art Themen Organ Trio and Josh Bailey Trio (both flag the trailing "Trio" — the runbook's explicit rule states a trailing Duo/Trio/Acoustic/Solo is part of the name and must never be stripped; neither name was touched this firing in any case, as both records stayed blank).

## Defects / rules raised this firing

- No new defect classes found. `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` was hit a further two times (fourth and fifth same-day instances) and handled the same way as its originating firing — not re-logged to `CTO-INBOX.md` as it is already a well-established standing defect with an open remediation ask (a records-written-fields concept in the validator).
- Venue backlog saturation reconfirmed with a fresh count (47/47, down from 48/48 at firing 16 — one candidate, Bunker (Heanor), was resolved by firing 17) — not logged as new, same standing `bv2a-venue-backlog-saturated` finding.
- No guessed-vanity-URL incidents this firing — every facebookUrl written was copied from a search result or a DOM-read href, never inferred from a name.

## Ledger / snapshot / run-summary / dashboards

- `data/state/enrichment-ledger.jsonl`: 15 `enrich` lines (4 artist-verified, 11 artist-blank) + 1 `snapshot` line appended. Snapshot: artistsTotal 3273, artistsMissingSocials 1422, artistsMissingGenres 948, venuesTotal 3205, venuesMissingSocials 47.
- `data/state/run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 4 (verified count), skipped 11 (evidenced-blank count) — Tier 1's 11 already-evidenced artists and Tier 3's 47 already-flagged/touched venues are not counted in either field, consistent with this file's established convention.
- Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2926 records, 102 snapshots) and `data/normalized/DASHBOARD.html`.

## Evidence file

`data/state/enrichment-evidence-2026-08-27-enrichment.jsonl` — this firing's 15 entries appended before every write/search-conclusion (lines 187–201 of the shared per-date file, which already held 186 lines from six earlier firings today).

## Budget used

**0 venues worked (Tier 2: 0 candidates; Tier 3: 47/47 already flagged/touched, zero fresh) of 30 cap.** **4 verified + 11 blank = 15/15 artists worked**, cap met exactly. Elapsed approximately 35 minutes of the 40-minute ceiling (heartbeat 18:18:06Z → claim release ~18:53Z). Circuit breaker did not fire.

## Claim / heartbeat

Claim released (`heldBy: null`, `lastRun: bv2a-enrichment-2026-08-27T18-18-06Z`). Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-27T18-18-06Z.json` updated to `completed`.
