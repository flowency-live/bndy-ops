# Bv2a Enrichment — Run Report

**Run id:** `bv2a-enrichment-2026-08-28T00-19-03Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Checked the last 3 run reports by mtime before any other action: `RUN-REPORT-23` (2026-08-27, 23:19:48Z firing, completed, validator "15 records · 13 clean · 1 FAIL (excluded per standing bio-verbatim-on-untouched-record precedent) · 1 WARN" — re-ran 0 FAIL on the remaining 14), `RUN-REPORT-22` (22:18:32Z firing, completed, "2 records · 2 clean · 0 FAIL"), `RUN-REPORT-21` (21:19:13Z firing, completed, "4 records · 3 clean · 0 FAIL · 1 WARN"). All three completed with a final 0 FAIL. Breaker did not fire.

## Runbook / task spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full: §0A, §0 prime directives 1–29, §1/§1A identity + same-name protocol, §2/§2A enrichment protocol (2A.1 items 1–8 including 3b both-surfaces-mandatory, 3c two-word-query rule, item 8 bio-is-a-quotation), §3 venue protocol, §4, §5, §6 run discipline, §6A run contract (steps 0–9), §6B platform facts, §6C failure classes, §6D/6D-bis, §6E, §6F, §6G concurrency lock protocol/TTL table/dead-holder takeover, §7. `ENRICHMENT-TASK-v3.md` read in full: §0.0, §FP fast path, §1–§12. `CTO-INBOX.md` grepped in full for all `bv2a`/standing precedent entries through 2026-08-27 (lines 327–468).

## Standing precedents applied

- `bv2a-venue-edit-facebookurl-param-silent-noop` — used `socialMediaUrls` for every venue Facebook write, not the `facebookUrl` parameter.
- `bv2a-firing1319z-never-guess-fb-vanity-url` — a prose-summary claim of `facebook.com/thebeestonsocial` was not backed by a distinct search-result link, so it was NOT written; only the confirmed website + Instagram were attached for The Beeston Social.
- `bv2a-firing2119z-edit-artist-genres-param-replaces-not-merges` — no `genres` array was written to any record that already held one (Walter Kocays, Dave Rich); existing genres were left untouched and confirmed unchanged on read-back.
- `bv2a-firing1419z-validator-cannot-check-venues` — venue records excluded from the validator gate pass; only the 7 verified artist records were validated.
- `bv2a-venue-backlog-saturated` — cross-referenced the 46 missing-socials venues against known CTO-INBOX flags (Jorge Wilson, Royal Oak Hollywater-class two-candidate cases, Astor Hall, 1865 Carlton Pl, Old Lockup, Market Place Burton, The Nest, Hayfield Club, Bridgnorth Castle Gardens, Willenhall Memorial Park, Bumble Hole, Instow EX39, Venue TBC, United match), Okehampton Show, Spaces Studio, The Railway Stockport, Sola Bar & Kitchen, Middle of the Road Cafe) before selecting a fresh batch of 20 to work, rather than re-searching known-bad records.
- White Lodge (`4508b924`) was skipped without a search — RUNBOOK's own v2.27 changelog cross-references it as a known business-mismatch case (same shape as the Astor Hall care-home mismatch).
- `bv2a-firing1319z-verify-id-before-live-write` — every edit response was checked against the intended record name before moving to the next write; two records were additionally spot-verified with `get_by_id`.

## Concurrency

`data\state\claims\bv2a-enrichment.json` read at firing start held `{"heldBy":null,"releasedAt":"2026-08-27T23:31:40Z","lastRun":"bv2a-enrichment-2026-08-27T23-19-48Z"}` — released. Wrote heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-28T00-19-03Z.json` (`outcome:"started"`) before any gate, then acquired the claim (`heldBy: bv2a-enrichment-2026-08-28T00-19-03Z`, TTL 3h, `expiresAt: 2026-08-28T03:19:03Z`). No `data\state\enrichment.lock` file present (retired per §6A step 2b — not honoured, not recreated).

## Preconditions

Confirmed exactly one Chrome browser connected (`list_connected_browsers`) and logged into Facebook (own timeline visible, notifications present). bndy MCP tools reachable (`list_artists`/`list_venues`/`edit_artist`/`edit_venue`/`get_by_id` all responded normally).

## Work — by tier

**Tier 1 — artists created in the last 24h with missing socials:** `list_artists(createdSince: 2026-08-27T00:19:00Z, missingSocials:true)` returned 11 candidates, all created 2026-08-27 11:56–12:37Z. Worked all 11.

**Tier 2 — venues created in the last 24h with missing socials:** `list_venues(createdSince, missingSocials:true)` returned 0 candidates.

**Tier 3 — backlog venues missing socials:** `list_venues(missingSocials:true)` returned 46 (unchanged from firing 23's close, confirming the standing saturation finding). Ran `enrich_venue` in batch on 20 fresh (non-flagged) candidates first — all 20 already carried a `google_place_id` from an earlier geocode pass, so no free website data came back. Worked all 20 via Google search (FP.2 — no Chrome needed for venues): **10 verified, 10 evidenced blank.**

**Tier 4 — backlog artists missing socials, oldest `createdAt` first:** with only 4 artist slots left inside the 15-cap after Tier 1, pulled `list_artists(missingSocials:true, offset:200, limit:50)` and worked the 4 oldest genuinely-fresh candidates from that page not already on the do-not-attach list or touched by yesterday's firings: Walter Kocays (2026-07-29), Miranda Newton (2026-07-29), Georgia Lily (2026-07-31), Dave Rich (2026-07-31). ⚠ This was NOT an exhaustive page-to-offset-200+ sweep for the true global oldest (per the `bv2a-firing2219z-tier4-sampling-never-reaches-true-oldest` finding) — budget was spent reaching the 15-artist cap via Tier 1 first. Flagging so tomorrow's firing does not assume today reached the true oldest tail.

**Tier 5 — artists missing genres with an existing facebookUrl:** not reached; budget (15 artists) was spent by Tiers 1 and 4.

## Venues — verified (10, with a Facebook page or website)

| Venue | Field(s) | Evidence |
|---|---|---|
| Black Panther Discos (Hengoed) | facebookUrl | facebook.com/Blackpantherdiscos/ — exact address match, 149 Gelligaer Rd |
| Marsden Social Club | facebookUrl (group) | facebook.com/groups/296616827126391/ — postcode HD7 6EW matches whatpub/CAMRA |
| The Focus Centre (Swanage) | website | sandpdt.org.uk/focus-centre/ — exact address, corner of Chapel Lane/High Street |
| West End Club (Stapleford) | facebookUrl | facebook.com/321449411237168 — corroborated by a gig post naming the exact address |
| Victoria Bowling Club (Stockport) | facebookUrl | facebook.com/profile.php?id=149602412428800 — corroborated by an "N-BoS play the Victoria Bowling Club" gig event |
| The Decorated Dead Tattoo Studio (Poole) | instagramUrl | instagram.com/the_decorateddead/ — exact address match; no Facebook page found on two search variants |
| The Beeston Social | website, instagramUrl | thebeestonsocial.com; instagram.com/thebeestonsocial/ — exact name+address match |
| Alderney Community Association (Poole) | website | alderney-manor.co.uk — same site as the lemonrock-sourced externalId |
| Abbey Arcade (Burton) | website | theabbeyarcade.co.uk — exact name+address; no single business FB page represents the whole arcade so facebookUrl left blank |
| The Griffin (Swansea) | website, instagramUrl | thepeoplespub.co.uk/the-griffin-swansea; instagram.com/griffin_swansea/ |

## Venues — evidenced blank (10)

| Venue | Reason |
|---|---|
| Tresaith | No single business at the stored address confidently matches the record name |
| Taylors Bar (Barry) | Two competing FB candidates (taylors.bar.1, taylors.bar.94), neither confirmed without a Chrome visit |
| Hunstanton Bandstand | Council-run structure (King's Lynn & West Norfolk BC); no dedicated own page |
| Annitsford Welfare Club | Nearby "Annitsford Irish Club" is a different name and street number |
| The Royal British Legion (Beeston) | Two competing FB candidates, neither confirmed |
| White Lodge (Stafford) | Already flagged as a known business mismatch (v2.27 changelog); not re-searched |
| Darcy's (Fenton) | Only same-name US pubs found, no UK match |
| The Tannery (Derby) | No FB or website found after two search variants |
| Eastwood & District Conservative Club | Only a Facebook EVENTS page found, not the club's own page |
| Decade of Dance (Bury) | Resolves to a mobile DJ/event service at a residential address, not a fixed venue — flagged for a human check on whether this bndy record is a mis-capture |

## Artists — verified (7, all with quoted bio + Facebook page)

| Artist | Facebook | Note |
|---|---|---|
| Greg Davies (Whaley Bridge) | facebook.com/gregdaviesguitarist/ | Guitar teaching page, category Musician/Guitarist, 1.2K followers — sole UK candidate distinct from the comedian of the same name |
| Andy Preston & Co | facebook.com/andyprestonmusic/ | Musician/band, Hazel Grove (Stockport) — consistent with stored Greater Manchester UK region |
| The Escape Committee Trio | facebook.com/EscapeCommittee/ | Musician/band, 261 followers, sole near-exact-name candidate |
| Walter Kocays (Stoke-on-Trent) | facebook.com/wocays1/ | Corroborated independently by setlist.fm, Bandcamp, hotvox.co.uk |
| Miranda Newton (Newcastle upon Tyne) | facebook.com/mirandanewtonsoloartist/ | Delegate "Solo Artist" page used, not the personal profile; corroborated by a North East live-music group post |
| Georgia Lily (Ilkeston) | facebook.com/GeorgiaLilyVocalist/ | Musician/band, East Midlands region consistent with stored location |
| Dave Rich (Looe) | facebook.com/daverichmusic/ | Own website daverich.co.uk states "Southwest UK", consistent with Looe, Cornwall |

## Artists — evidenced blank (8)

| Artist | Reason |
|---|---|
| Lee Wainwright | No confident UK match; only unrelated same-name profiles |
| Plastic Soul | No Greater-Manchester/UK-wide-consistent match found |
| Xclusive | Three competing candidate pages, none confirmed as the Crewe act |
| Manic | No confident match found on either surface |
| Jung | No confident match found on either surface |
| the Reform | Candidate found (facebook.com/TheReformLive/, Pop/Rock/Indie Covers Band) but the page returned "This content isn't available" on Chrome visit (both `/about` and root) — treated as unreachable/dead, left blank rather than guess |
| Tee | Closest candidate ("Earl Tee Music") is a different name, not an exact match |
| Over the Moon | No Greater-Manchester-based candidate found; candidates are Shrewsbury-based or a different format |

## Validator summary line (verbatim)

First pass (7 records) initially returned 2 FAIL (`BIO_VERBATIM` on Miranda Newton and Dave Rich) because the evidence file's `capturedText` had been written as a prose summary rather than the raw scrape — corrected to the literal raw `get_page_text` output before re-running:

```
7 records · 6 clean · 0 FAIL · 1 WARN   [mode=gate]
```

The one WARN (`NAME_BILLING` on "The Escape Committee Trio" — trailing "Trio") is a judgment flag, not a defect: per RUNBOOK §2A.1 item 7, a trailing Duo/Trio/Acoustic/Solo is part of the name and was not stripped or renamed.

0 FAIL. Batch ships.

## Names corrected under §0.6

None this firing — no name changes were made.

## Ledger / snapshot / run-summary / dashboards

- `data/state/enrichment-ledger.jsonl`: 35 `enrich` lines (10 venue-verified, 10 venue-blank, 7 artist-verified, 8 artist-blank) + 1 `snapshot` line appended.
- Snapshot: artistsTotal 3273 (unchanged — this task creates nothing), artistsMissingSocials 1400 (down from 1407), artistsMissingGenres 946 (unchanged — no artist had an empty genres array filled this firing), venuesTotal 3205 (unchanged), venuesMissingSocials 37 (down from 46).
- `data/state/run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 17, skipped 18.
- Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (3037 records, 108 snapshots) and `data/normalized/DASHBOARD.html`.

## Evidence file

`data/state/enrichment-evidence-2026-08-28-enrichment.jsonl` — new file for today (per-day per RUNBOOK §6F ownership table), 35 lines: 10 venue-verified + 10 venue-blank + 7 artist-verified + 8 artist-blank capture/search-variant lines. Two artist lines (Miranda Newton, Dave Rich) were corrected in place before the validator run — the first draft mixed prose summary with the raw scrape and failed `BIO_VERBATIM`; replaced with the literal `get_page_text` output before any further step. No bndy write was affected — the bio fields were already the correct verbatim quotation; only the evidence file's `capturedText` needed the fix.

## Budget used

**20 venues worked (10 verified + 10 blank) of 30 cap. 7 verified + 8 blank = 15/15 artists worked**, cap met exactly. Elapsed approximately 55 minutes (heartbeat 00:19:03Z → this report). Circuit breaker did not fire; no hard stop encountered.

## Claim / heartbeat

Claim released (`heldBy: null`, `lastRun: bv2a-enrichment-2026-08-28T00-19-03Z`). Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-28T00-19-03Z.json` updated to `completed`.
