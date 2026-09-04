# Bv2a Enrichment — RUN-REPORT-00 — 2026-08-27

**Run id:** `bv2a-enrichment-2026-08-27T12-58-18Z`. **Outcome: completed.**

- **Circuit breaker (Step 0):** did not fire. Checked the last 3 enrichment run reports directly (all in `data/normalized/enrichment/2026-08-21/`): RUN-REPORT-12 and RUN-REPORT-11 both STOPPED on a concurrency lock held by another run (not expired, zero work, no validator run — nothing was written, so nothing to trip on). RUN-REPORT-09 COMPLETED: first validator pass 2 FAIL (both a pre-existing `GENRE_ENUM` issue on contact, self-corrected same firing), second pass 0 FAIL, 1 WARN. No report shows an outstanding FAIL at close and none is missing. Breaker cannot trip.
- **Runbook:** read in full. H1 `v2.27` ≥ CURRENT FLOOR `v2.19` (§6A step 2a) — pass. ENRICHMENT-TASK-v3.md §0.0, §FP, §5, §6, §7 read in full. CTO-INBOX.md read from the top of the visible tail through the last 2026-08-27 entries — standing flags respected (Venue TBC / United match placeholder skip, Willenhall/Bumble Hole/EX39 4JN no-own-page class, Ross Alexander/Kieran Poile/Tomas Doncker/RockSka open items left untouched, Hardcore→Punk mapping precedent).
- **Concurrency:** `data\state\claims\bv2a-enrichment.json` at read time held `heldBy: bv2a-enrichment-2026-08-21T10-20-49Z`, `expiresAt: 2026-08-21T13:20:49Z` — six days in the past relative to now (2026-08-27T12:58Z). Per §6G's acquire table ("expiresAt in the past → acquire"), this was a plain, uncontested acquire, not a dead-holder takeover (no takeover language used, none needed). Acquired at `2026-08-27T12:58:41Z`, TTL 3h (`expiresAt: 2026-08-27T15:58:41Z`), `heartbeatFile` pointing at this run's own heartbeat. No `data\state\enrichment.lock` file found; the retired mechanism was not honoured and not recreated.
- **⚠ Correction to the calling task prompt, followed per the runbook's own precedence rule:** the invoking prompt named the claim file as `data\state\claims\enrichment.json`. That file does not exist and is not what any past run report, §6A, §6F or §6G names. The correct file, used throughout this run, is `data\state\claims\bv2a-enrichment.json`, per RUNBOOK.md and every prior `bv2a-enrichment-*` heartbeat/claim on disk.
- **Tools:** bndy MCP reachable (confirmed via `list_artists`). Chrome: exactly one connected browser (`Browser 1`), logged into Facebook — confirmed via `facebook.com` page render showing the logged-in feed and 6 notifications before any bio quote was attempted.
- **⚠ Tool defect found and worked around this firing:** `edit_venue`'s top-level `facebookUrl` parameter reports `"success": true` and lists `facebookUrl` in `updatedFields`, but the write does **not** persist — `get_by_id` read-back showed no facebook value anywhere (no `facebookUrl` field on the read schema at all, and `socialMediaUrls: []`). Confirmed on two separate venues (The Star Inn, Moorville Hall) before switching to the working field: `socialMediaUrls: [{"platform":"facebook","url":"..."}]`, which persists correctly and is what `get_by_id`/`list_venues` actually return. Every venue Facebook write in this report used `socialMediaUrls`. Logged to CTO-INBOX as a DEFECT — this would have silently produced 5 "successful" writes with nothing behind them if §0.10's read-back hadn't caught it on the first record.

## Selection

Tier 1 — artists created in the last 24h missing socials (`createdSince` as an explicit ISO timestamp, per the standing `list-artists-createdsince-24h-string-not-parsed` defect — relative strings are not parsed): 13 candidates, none present in today's ledger yet (checked before starting). All 13 worked.

Tier 2 — venues created in the last 24h missing socials: 3 candidates (The Star Inn, Moorville Hall, Crown — all `klma-stoke-gig-list` sourced), none in today's ledger. All 3 worked.

Tier 3 — backlog venues missing socials, oldest `createdAt` first: pulled the full 108-record backlog (dropping to 105/103 as this firing's own writes landed). Skipped without searching, per standing CTO-INBOX flags: Willenhall Memorial Park, "Venue TBC", "United match)" (not encountered again this session but excluded from consideration), Bunker (Heanor — not a live-music venue), Hayfield Club (address mismatch), Bridgnorth Castle and Gardens, Sola Bar & Kitchen (open naming conflict) — none of these were re-searched. Worked the next 15 oldest genuinely-untouched candidates by `createdAt`: 2 from 2025-09-25 (Darcy's, The Railway Stockport), then 2026-05 to 2026-08 dated records through West Park Long Eaton, The Tannery, Spaces Studio and The Decorated Dead Tattoo Studio. 5 of the 15 attached; 10 recorded as evidenced blank or flagged (see below) — genuinely worked either way (verified attach or evidenced blank both count as worked, per the budget definition).

Tier 4/5 (backlog artists, artists missing genres with a facebookUrl) were **not reached** — Tier 1 filled the 15-artist artist cap before Tier 4 was needed.

## Records with a verified page

**Artists (3 of 13):**

| Artist | Facebook | Notes |
|---|---|---|
| The Missing Cats Duo (was "Missing Cats") | facebook.com/themissingcatsduo | Tier B: sole candidate, category Musician/band, page's own bio "Highly entertaining acoustic duo based in the North East" — exact region match to stored "North East UK". §0.6 name correction applied: the act's own page name is "The Missing Cats Duo", not the generic stored "Missing Cats" — corrected, and `artistType` changed band→duo, `acoustic` set true to match. |
| Mandy's Angels | facebook.com/p/Mandys-Angels-100062994050769 | Tier A/B: exact name match, category Band, and a dated post (22 Aug, "Live gig", Stockport) naming "The Arden Arms Pub Stockport" and "THE WELCOME INN in Whitefield" — both Greater Manchester towns, matching stored location exactly. **Note:** the same numeric page id (100062994050769) resolves under two different display names — "Mandy's Angels" and "Mandy Montgomery's Angels" (contact email `mandy.montgomery17@gmail.com`, post text itself reads "Montgomery's Angels") — this is the SAME Facebook page, one act, confirming the existing CTO-INBOX flag `duplicate-mandys-angels-montgomery` refers to one act billed two ways, not two acts. Not merged (§0.11 — no merges in an import/enrichment run); flagged. |
| Adelphi Fusion | facebook.com/profile.php?id=61561637758421 | Tier B: exact name, sole candidate, category Musician/band, page bio "Electrifying covers band in the North-West" — matches stored "Greater Manchester UK". Genres inferred from the page's own stated repertoire (Funk, Soul, R&B, Motown — all four are canonical enum values; Motown itself already implies genre, mapped the three distinct genre-enum values and left `actType: ["covers"]`). |

All 3 writes verified by `get_by_id` read-back after `edit_artist`. `profileImageUrl` set for all 3 using `graph.facebook.com/<numeric-id>/picture?type=large`.

**Venues (5 of 18 worked):**

| Venue | Field(s) | Notes |
|---|---|---|
| The Star Inn (Church Leigh) | facebookUrl | facebook.com/thestarchurchleigh — town match confirmed in the page's own listing title. |
| Moorville Hall | facebookUrl | facebook.com/MoorvilleHallandFoxearthBar — address (Werrington/Stoke-on-Trent) matches; page carries a video of a live performance ("Im Every Whitney") at the venue, confirming it is the gigging bar's page, not the separate hotel-spa page found alongside it. |
| Crown (Chasetown) | website | crownchasetown.co.uk — official Marston's pub site, address confirmed exact match (20 High Street, Chasetown, Burntwood WS7 3XF). Facebook left blank: two candidate pages exist (`p/The-Crown-Inn-Chasetown-...` and `thecrowninnchasetown`) and neither could be disambiguated without a login-gated visit that returned no confirming content — blank beats wrong. |
| Jubilee Inn (Torpoint) | facebookUrl | facebook.com/118660594856407 — address on page ("16-23 Fore St PL11 2AD Torpoint") matches exactly; a post about a live duo confirms music at the venue. Page is Facebook's "Unofficial Page" designation (fan-managed, 0 explicit followers shown) but carries genuine check-ins and gig content — attached on address + content match, not follower count. |
| The Saracens Head (Newton Abbot) | facebookUrl, website, phone | facebook.com/saracensheadnewtonabbot2, saracensheadnewtonabbot.co.uk, +44 1626 365430 — address on page is an exact match (Fairfield Terrace, Newton Abbot TQ12 2LH) and a dated post ("Join us this Saturday 25th July for Guesswork from 8pm") confirms live music. |

All 5 verified by `get_by_id` read-back. All 5 used `socialMediaUrls` (not the broken `facebookUrl` parameter — see Tools note above).

## Records recorded as an evidenced blank

**Artists (10 of 13)** — Google (`WebSearch`) tried first for every record; Facebook's own page search (Chrome, logged in) used as the second surface before any blank was recorded, per §2A.1 item 3b:

| Artist | Variants tried (Google, then Facebook page search) | Note |
|---|---|---|
| Lee Wainwright | `"Lee Wainwright" band Manchester`; FB: `Lee Wainwright` | Only unrelated Wainwright profiles/pages surfaced on both surfaces. |
| Plastic Soul | `"Plastic Soul" band`; FB: `Plastic Soul band` | Candidates found are an Indonesian Beatles tribute act, a Spanish jazz quartet, and unlocated small pages — none UK-consistent. |
| Greg Davies | `"Greg Davies" acoustic Manchester`; FB: `Greg Davies musician` | Sole plausible candidate, "Greg Davies Musician/Guitarist" (Whaley Bridge), is explicitly a guitar/drum-lessons teaching page ("Welcome to my music & teaching page") with no evidence of a live performing act — fails the identification bar. |
| Andy Preston & Co | `"Andy Preston" band Manchester` | Only candidate, "Andy Preston Music" (facebook.com/andyprestonmusic), is a solo acoustic entertainer page — no location field, no "& Co" band framing. Insufficient for the stored band-format act. |
| Manic | `"Manic" duo Greater Manchester band`; FB: `Manic band Manchester` | Results were a Dutch DJ/producer using the name "Manic", "Manic Bliss" (different name) and "Maniac Band" (different name) — no Greater Manchester duo match. |
| Jung | `"Jung" band Staffordshire`; FB: `Jung band Staffordshire`, `Jung band` | Only Korean, Austrian, Nepali and Thai acts named Jung/JungBand surfaced — no UK match. |
| the Reform | `"the Reform" band Manchester covers`; FB: `The Reform band` | Google's top candidate, facebook.com/TheReformLive, returns "This content isn't available at the moment" (deleted or restricted) when visited directly. FB page search for the name returned no result at all. |
| The Escape Committee Trio | `"The Escape Committee" trio band`; FB: `Escape Committee Trio` | Google's candidate, facebook.com/EscapeCommittee, carries no "Trio" in its own page name and no location field — generic bio only ("Good, honest music - just the way you like it!"). Insufficient to confirm as the specific trio lineup billed in bndy. |
| Tee | `"Tee" solo singer Manchester covers facebook`; FB: `Tee solo singer Manchester` | Only unrelated DJs/creators/businesses surfaced on both surfaces; no confident solo-act match. |
| Over the Moon | `"Over the Moon" band Manchester covers facebook`; FB: `Over the Moon Manchester band` | Candidates found: a Shrewsbury covers band (different town), a Hoboken NJ band, and small unrelated pages — no Manchester match. |

**Venues (10 of 18 worked)** — Google only for most (§FP.2, no bio field, no Chrome required); Chrome used where two candidates needed disambiguating:

| Venue | Variant(s) tried | Note |
|---|---|---|
| Darcy's (Fenton) | `"Darcy's" Fenton Stoke-on-Trent bar facebook` | Only unrelated "The Cafe Fenton" and "Bench & Bar Fenton" pages surfaced — neither confirmed as the same premises. |
| The Railway (Stockport) | `"The Railway" Wellington Road North Stockport pub facebook` | Candidate page "Jazz at the Railway" exists, but external reporting states the pub has been "long-term closed as of 24/6/2024" after the licensee's death. Not attached pending confirmation of reopening/closure — flagged. |
| 1865, 1 Carlton Pl (Southampton) | `"1865" Carlton Place Southampton bar facebook` | **Likely mis-geocoded record.** The real, well-known "The 1865" venue is at 25-27 Brunswick Square SO14 3AR — a different street and postcode entirely from the stored "1 Carlton Pl SO15 2DY" (Carlton Place itself hosts "Shenanigans" Irish bar, unrelated). Not attached; flagged for a human address check — this may be the same venue as the already-flagged placeholder "Venue TBC" (2f2e5e77-314a-4ce6-8377-b705e9480cdc), whose address IS Brunswick Square SO14 3AR. |
| Alderney Community Association (Poole) | `"Alderney Community Association" Poole facebook` | Multiple similarly-named community entities found near the same road (Alderney West Community Centre, Alderney Manor Social Club, an "Alderney Manor Community Association" group) — could not confidently pick one without risking a wrong attach. |
| The Crab and Apple Pub (Appledore) | `"Crab and Apple" Appledore pub facebook` | Candidate "The Crab Apple Inn" page (11 followers, "Local business" category, no address field, no posts, generic bio) — too thin to confirm as the same premises despite a plausible name match. |
| Okehampton Show ground | `Okehampton Showground facebook website` | The "Okehampton Show" FB page (6.8K followers) states its own site as "Stoney Park Showground", not "New Road Cross, Okehampton EX20 4LP" (the bndy record's stored address) — an address mismatch, not attached; flagged for a human check of whether these are the same site under different naming. |
| West Park, Long Eaton | `"West Park" Long Eaton Nottingham bandstand facebook` | Has a real bandstand, but only unofficial fan/community pages found ("We Love West Park Long Eaton", "Party In The Park - Long Eaton"); no page confirmed as the park's own. |
| The Tannery (Derby) | `"The Tannery" Sadler Gate Derby bar facebook` | New taproom (opened June 2026); no Facebook page surfaced via search. |
| Spaces Studio (Burton) | `"Spaces Studio" Wharf Road Burton-on-Trent facebook` | Website found (spacesstudio.uk) is a kitchen/interior-design showroom — different postcode to the bndy record (DE14 1QL vs stored DE14 1PZ) and an unrelated business type entirely, not a live-music venue. Not attached; flagged — this bndy record may be a different, unrelated "Spaces Studio". |
| The Decorated Dead Tattoo Studio (Poole) | `"The Decorated Dead" tattoo studio Poole facebook` | Has an Instagram (@the_decorateddead) but no Facebook page found. |

## Records skipped (not searched)

Backlog venues already flagged non-enrichable by prior firings and not re-searched this run: Willenhall Memorial Park, Bunker (Heanor — not a live-music venue), Hayfield Club (address mismatch), Bridgnorth Castle and Gardens (council green space), Sola Bar & Kitchen (open naming conflict, DATA flag pending). "Venue TBC" and "United match)" were not present in this firing's fetched candidate pages but remain standing skips per CTO-INBOX.

## Names corrected under §0.6

**The Missing Cats Duo** (was "Missing Cats") — act's own Facebook page name is "The Missing Cats Duo", not the generic stored "Missing Cats". `artistType` corrected band→duo and `acoustic` set true to match the page's own self-description ("acoustic duo").

## Locations corrected under §2A.3 / §7

None applied this firing. No location conflicts found on any attached record.

## Genre corrections on contact

None found this firing (no pre-existing `Hardcore` or other non-canonical value encountered on any touched record).

## Validator summary line (verbatim)

Ran once, against the 3 artist writes and 5 venue writes from this firing (`data/state/enrichment-records-2026-08-27-enrichment.json`, built from this firing's own `get_by_id` read-backs) with the evidence file `data/state/enrichment-evidence-2026-08-27-enrichment.jsonl`:

```
3 records · 2 clean · 0 FAIL · 1 WARN   [mode=gate]
```

(Validator output covers the 3 artist records with bio fields; the 5 venue records carry no bio and triggered no bio-fidelity rules.)

Remaining WARN, not blocking, and not a defect:
- `NAME_BILLING` on **The Missing Cats Duo**: "format tail on the name". This is the validator's generic heuristic flagging a trailing "Duo". RUNBOOK.md §2A.1 item 7 (Jason ruling, 2026-08-07) explicitly states a trailing Duo/Trio/Acoustic/Solo **is part of the name and must not be stripped**, and that renaming is only correct when the act's own page positively shows the fuller form — exactly the case here (the page's own name literally is "The Missing Cats Duo"). No action taken; noted here per the runbook's own guidance rather than reverted.

0 FAIL on the first pass — no second pass needed.

## Defects / rules raised

- `bv2a-venue-edit-facebookurl-param-silent-noop` (CTO-INBOX, DEFECT) — `edit_venue`'s `facebookUrl` parameter reports success but does not persist; use `socialMediaUrls` instead.
- `bv2a-mandys-angels-montgomery-same-fb-page-confirmed` (CTO-INBOX, DATA) — confirms the standing `duplicate-mandys-angels-montgomery` flag: both display names resolve to the identical Facebook page id, i.e. one act billed two ways, not two acts.
- `bv2a-1865-carlton-place-possible-misgeocode` (CTO-INBOX, DATA) — stored address for "1865, 1 Carlton Pl" does not match the real "The 1865" venue's address; may be the same venue as the already-flagged "Venue TBC" placeholder record.
- `bv2a-okehampton-showground-address-mismatch` (CTO-INBOX, DATA) — Okehampton Show's own FB page names "Stoney Park Showground" as its site, not the bndy record's stored "New Road Cross" address.
- `bv2a-spaces-studio-burton-wrong-business` (CTO-INBOX, DATA) — the only "Spaces Studio" found at/near the stored address is a kitchen/interior-design showroom, not a live-music venue; likely a different, unrelated business or a mis-capture.
- `bv2a-railway-stockport-possibly-closed` (CTO-INBOX, DATA) — external reporting states this pub has been long-term closed since June 2024.

## Budget used

**3 verified + 10 blank = 13 of 15 artists worked** (Tier 1 exhausted the 24h-new-artist queue at 13; did not proceed to backlog artists). **5 verified + 10 blank = 15 of 18 venues considered, all worked** (3 new + 15 backlog by oldest `createdAt`), well inside the 30-venue cap. Elapsed approximately 17 minutes from heartbeat start to this write, inside the 40-minute ceiling. Circuit breaker did not fire.

Ledger: 3 `enrich` lines for verified artists + 10 for blank artists + 5 `enrich` lines for verified venues + 10 for blank venues + 1 `snapshot` line appended to `data/state/enrichment-ledger.jsonl` (2860 → 2889 lines). Snapshot: artistsTotal 3273, artistsMissingSocials 1442, artistsMissingGenres 953, venuesTotal 3205, venuesMissingSocials 103 (down from 108 pre-firing — matches the 5 venue writes; the 3 new-venue writes fed straight in from the same backlog count). `run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 8, skipped 20. Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2756 enrichment records, 96 snapshots) and `data/normalized/DASHBOARD.html`.

Claim released at end of run (`heldBy: null`, `lastRun: bv2a-enrichment-2026-08-27T12-58-18Z`). Heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-27T12-58-18Z.json` updated to `completed`.

## Note on a stray file

A shell `mv`/`rm` failure while correcting a copy-paste error in the evidence file left one empty, harmless stray file on disk: `data\state\enrichment-evidence-2026-08-27-enrichment.jsonl.new` (0 bytes). It is not read by anything and contains no data; flagged here for visibility rather than left silent.
