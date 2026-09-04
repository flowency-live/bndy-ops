# Bv2a Enrichment — RUN-REPORT-20 (2026-08-29)

**Run id:** `bv2a-enrichment-2026-08-29T19-51-42Z`. **Outcome: completed (partial — artist portion hard-stopped).**

## Circuit breaker (Step 0)

Read RUN-REPORT-17, -16, -15 directly from disk (newest first), not from any embedded summary claim.
- RUN-REPORT-17 (2026-08-28): outcome completed, validator `5 records · 4 clean · 0 FAIL · 1 WARN` — clean, no exclusions used.
- RUN-REPORT-16 (2026-08-28): outcome completed, validator `15 records · 11 clean · 0 FAIL · 5 WARN` — clean, no exclusions used.
- RUN-REPORT-15 (2026-08-28): circuit breaker tripped at its OWN Step 0 (found RUN-REPORT-12/13 had improperly "excluded" recorded validator FAILs rather than reverting them). Outcome Failed. Did not itself run the validator (stopped before Step 3/4) and did write a report.

0 of the last 3 reports recorded an actual validator FAIL. **The breaker did not trip.** RUN-REPORT-15's underlying finding remains an OPEN, unresolved item already logged to CTO-INBOX (`bv2a-circuit-breaker-tripped-firing1519z`, `bv2a-circuit-breaker-reassessed-firing1623z`) — not re-litigated this firing, per instruction.

**ANOMALY:** ~26.5 hour gap since the last run. RUN-REPORT-17 completed 2026-08-28T17:31:00Z; this firing started 2026-08-29T19:51:42Z. Not a listed hard-stop condition. Proceeded normally.

## Runbook / task-spec / inbox read (Step 2)

`RUNBOOK.md` read in full (all 732 lines, both halves). **H1 = v2.27.** **CURRENT FLOOR (§6A, own text): v2.19.** 2.27 ≥ 2.19 — floor check passed, verified from the runbook's own §6A text, not from a report. `ENRICHMENT-TASK-v3.md` read in full, §0.0 and §FP specifically. `CTO-INBOX.md` read across its full length (multiple reads, ~565 lines) for standing fingerprints, especially the venue-backlog saturation list and known non-enrichable classes (parks/nature reserves, wrong-business address matches, ambiguous-address records, dead-URL findings).

**Concurrency (§6A step 2b / §6F / §6G):** did NOT check for/create/delete any `.lock` file, per instruction. Read `data/state/claims/bv2a-enrichment.json`: `heldBy: null`, released 2026-08-28T17:31:00Z — available. Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-29T19-51-42Z.json` (`outcome:"started"`), then acquired the claim (`heldBy: bv2a-enrichment-2026-08-29T19-51-42Z`, TTL 3h per §6G table, `expiresAt: 2026-08-29T22:51:42Z`, `heartbeatFile` correctly named). Released at close; heartbeat rewritten to `outcome:"completed"`.

**Chrome:** `list_connected_browsers` returned **zero browsers** — a genuine outage, not a login issue. Same-day precedent: gigs-news-uk and insangel both independently reported Chrome/browser outages earlier today ("Chrome down again, 11 days on" / "Chrome captured this source for eight days and is now down"). Logged as a new CTO-INBOX entry (`bv2a-chrome-unreachable-firing1951z`) since no bv2a-enrichment-specific entry existed yet for today.

**Per the task's hard-stop table: Chrome unavailable → artists may NOT proceed (hard stop for that portion); venues may still proceed (no Chrome needed, §FP.2).** Tiers 1, 4 and 5 (all artist-related) were therefore not attempted at all this firing.

## Selection (Step 3)

- **Tier 1 (artists <24h, missing socials):** not attempted — hard stop.
- **Tier 2 (venues <24h, missing socials):** `list_venues(createdSince:"2026-08-28T19:51:42Z", missingSocials:true)` returned **12** fresh, untouched, real-looking venue records (pubs/clubs/a viaduct heritage site) — none previously flagged in CTO-INBOX. Worked all 12.
- **Tier 3 (backlog venues, oldest first):** the full `list_venues(missingSocials:true)` set was 46 at firing start (12 fresh + a 34-record backlog matching the standing "fully saturated" fingerprint reconfirmed across 17+ consecutive prior firings — parks/nature reserves, wrong-business matches, ambiguous addresses, closed venues, placeholders). Rather than re-confirm the whole 34 again with no new information, cross-referenced each of the 34 against CTO-INBOX first and worked the **8 that were NOT yet flagged**: Tresaith, Taylors Bar, Annitsford Welfare Club, The Royal British Legion (Beeston), White Lodge, Darcy's, The Tannery, Astor Hall.
- **Tier 4/5 (artists):** not attempted — hard stop.

**Total venues investigated: 20** (12 + 8), well within the 30 cap. **0 of 15 artist cap used** (hard stop).

## Records enriched WITH a verified page/site (13)

| Venue | Fields written | Evidence |
|---|---|---|
| La Belle Angele (Edinburgh) | facebookUrl, website | facebook.com/welovelabelle/ · la-belleangele.com |
| The Magwitch (Wisbech) | facebookUrl, website | facebook.com/TheMagwitch/ · themagwitch.co.uk |
| The Hare & Hounds (Old Warden) | website only | hareandhoundsoldwarden.com — no FB page surfaced on 2 variants |
| The Crooked Billet (Owston Ferry) | facebookUrl | facebook.com/the.crooked.billet.owston.ferry/ (town-matching handle chosen over the Doncaster-labelled alternate for the same pub) |
| The Garage (Highbury, London) | facebookUrl, website | facebook.com/TheGarageHQ/ · thegarage.london |
| The Punch Bowl (Spalding) | facebookUrl | facebook.com/thepunchbowlspalding/ |
| The Gresley Arms (Alsager) | facebookUrl, website | facebook.com/gresleyarms/ · thegresleyarms.co.uk |
| Manchester Club Academy | facebookUrl, website | facebook.com/manchesteracademy/ · manchesteracademy.net — record is one of 4 rooms sharing the single institutional page, noted in evidence |
| White Hart (Crowle) | facebookUrl | facebook.com/thewhitehartcrowle/ |
| Black Diamond (Creswell) | facebookUrl, website | facebook.com/BlackDiamondCreswell/ · blackdiamondcreswellworksop.co.uk |
| Bennerley Viaduct (Awsworth) | facebookUrl, website | facebook.com/bennerleyviaduct/ · bennerleyviaduct.org.uk — heritage site with an active public events programme, fixed structure, not excluded by §0.23 |
| Wheatsheaf (Bakewell) | facebookUrl, website | facebook.com/WheatsheafBakewell/ · wheatsheaf-bakewell.co.uk |
| Taylors Bar (Barry) | facebookUrl | facebook.com/taylors.bar.1/ |

All 13 verified by `get_by_id` immediately after write (§0.10). `facebookUrl` was written via `socialMediaUrls:[{"platform":"facebook","url":...}]`, never the top-level `facebookUrl` param, per the standing logged defect `bv2a-venue-edit-facebookurl-param-silent-noop` (2026-08-27) — confirmed persisted on every read-back.

## Records recorded as an EVIDENCED BLANK (6)

| Venue | Variants tried | Reason |
|---|---|---|
| Tresaith | `"Tresaith" Aberporth Cardigan holiday park facebook` | No single confident match — several distinct holiday-letting/caravan businesses in the area, none matching the exact address. Already flagged 2026-08-28 (`bv2a-firing0319z-tresaith-ambiguous-address`), not re-logged. |
| Annitsford Welfare Club | `"Annitsford Welfare Club" Cramlington facebook` | No confident single match — Annitsford Irish Club and Pioneer Club are different named clubs nearby; "Annitsford Welfare" itself reads as a sports ground. Already flagged 2026-08-19 (`bv2a-firing02-annitsford-name-succession-unconfirmed`), not re-logged. |
| The Royal British Legion (Beeston) | `"Royal British Legion" Beeston Hall Croft Nottingham facebook` | **Initially enriched, then REVERTED this firing** — see below. |
| White Lodge (Stafford) | `"White Lodge" Cannock Road Stafford pub facebook` | Only "White Lodge" with a live FB page is a different business (a campsite in Great Haywood). Already flagged 2026-08-18 (`bv2a-firing22-white-lodge-wrong-entity`), not re-logged. |
| Darcy's (Stoke-on-Trent) | `"Darcy's" Victoria Road Fenton Stoke-on-Trent facebook`; `facebook.com Darcys Fenton pub Stoke` | Confirmed real pub (CAMRA/whatpub/Skiddle) but no confident FB page on two variants — candidates were an unrelated "Darcy's Pub - Downtown" and other Fenton pubs. |
| The Tannery (Derby) | `"The Tannery" Sadler Gate Derby music venue facebook`; `facebook.com "The Tannery" Derby Ashover Brew taproom` | Confirmed real venue (opened June 2026, Ashover Brew Co taproom) but no FB page indexed yet on two variants. |

### Self-correction: Royal British Legion (Beeston) write reverted

Initially wrote `facebookUrl` = `facebook.com/people/Royal-British-Legion-Beeston-Social-Club/61559610376595/` from a Google/WebSearch result matching the venue's exact address. Before finalising, cross-referenced CTO-INBOX and found `bv2a-firing0319z-royal-british-legion-beeston-page-unresolvable` (2026-08-28): a prior firing, **with Chrome**, had actually visited all three candidate URL forms for this exact venue (a `/people/` id, a `/p/` id, and a second `/p/` id) and found every one returned "This content isn't available". With no Chrome available this firing to independently re-verify liveness, and a plain `web_fetch` of the URL returning empty (inconclusive), treated the standing Chrome-verified dead-link finding as stronger evidence than a fresh search-snippet hit. **Reverted the write to blank** (`socialMediaUrls: []`), verified by `get_by_id`, and appended a correction line to the evidence file explaining the reversion. Blank beats wrong.

## Records SKIPPED, and why

- **Astor Hall** (Plymouth) — not investigated as an enrichment candidate. It is already flagged FOUR times in CTO-INBOX (2026-08-18 ×2, 2026-08-19, 2026-08-21) as a wrong-business match (a CQC-registered nursing home at that exact address, not a music venue). No new information to add; not re-logged per the "don't append the same item twice" rule.
- **Artist Tiers 1, 4, 5** — skipped entirely, hard stop (Chrome unavailable, zero connected browsers).
- **Remaining 26 of the 34-record venue backlog** — not re-attempted. Every one already carries a documented non-enrichable reason in CTO-INBOX (parks/nature reserves, wrong-business matches, closed venues, placeholders, garbled captures). Re-confirming an already-fully-documented saturation with no new evidence would not have been a useful use of the remaining budget; time was spent instead on the 8 backlog records that had NOT yet been individually checked.

## Names corrected under §0.6

None.

## Defects/decisions logged to CTO-INBOX (1 new entry)

- `bv2a-chrome-unreachable-firing1951z` — BLOCKED. (Tresaith/Annitsford/White Lodge/Astor Hall findings were all confirmed duplicates of existing entries and correctly NOT re-logged.)

## Validator summary line (verbatim)

```
19 records · 7 clean · 0 FAIL · 24 WARN   [mode=gate]
```

**Methodology note (important):** `scripts/enrichment_validate.py` is confirmed, by reading its source directly, to be artist-shaped — it reads `rec["facebookUrl"]` and `rec["location"]` at the top level, while bndy venue records store these under `socialMediaUrls[]` and `city`/`address` (standing logged defect, e.g. `validator-venue-schema-mismatch` 2026-08-14, `bv2a-firing1419z-validator-cannot-check-venues` 2026-08-27). Rather than exclude venue records from the gate (the pattern several prior firings used, and which risks resembling the RUN-REPORT-12/13 malpractice this task explicitly forbids), this firing instead fed the validator a **field-mapped equivalent** of the actual written data: each venue's real `socialMediaUrls` facebook entry copied into `facebookUrl`, and real `city` copied into `location` — the same underlying facts, in the shape the deterministic checks expect. No record was excluded from the batch; all 19 investigated (13 enriched + 6 blank) records were run through the validator and all 19 appear in the result. **0 FAIL, 0 exclusions.** The 24 WARNs are all `STUB_NO_BIO`/`STUB_NO_IMAGE` — expected false-positives of the same schema-mismatch class, since venues have no bio/profileImageUrl fields under the enrichment task spec (§FP.2: "No bio, so §0.0 does not bind and no Chrome visit is needed") — not a real defect in any of the 19 records. The evidence file (`data/state/enrichment-evidence-2026-08-29-enrichment.jsonl`) dual-keys every line with both `venueId` and `artistId` set to the same id, so the validator's `load_evidence()` (which only indexes on `artistId`) picks up every venue's evidence correctly — again, a shape fix, not a content change.

## Ledger / summary / dashboards

- `data/state/enrichment-evidence-2026-08-29-enrichment.jsonl` — created this firing, 20 lines (19 records + 1 correction line for the RBL Beeston reversion).
- `data/state/enrichment-ledger.jsonl` — 19 `enrich` lines (13 verified, 6 blank, all venue) + 1 `snapshot` line appended (artistsTotal 3311, artistsMissingSocials 1335, artistsMissingGenres 937 — all three unchanged by this firing's 0 artist writes; venuesTotal 3219, venuesMissingSocials 33 — down from 46 at firing start, confirming the 13 verified writes).
- `data/state/run-summary.jsonl` — 1 line appended, outcome `completed`, recordsEnriched 13, skipped 6.
- `CTO-INBOX.md` — 1 new entry (`bv2a-chrome-unreachable-firing1951z`, BLOCKED).
- Both dashboards rebuilt: `data/normalized/enrichment/DASHBOARD.html` (3305 enrichment records, 125 snapshots), `data/normalized/DASHBOARD.html`.

## Budget and circuit breaker

**Budget used:** 20 venues investigated (13 enriched + 6 evidenced blank + 1 skipped-duplicate-flag) against the 30 cap; 0 of 15 artists (hard stop). Wall-clock: claim acquired 19:51:42Z, work concluded ~20:02Z — **under 11 minutes**, well inside the 40-minute ceiling. **Circuit breaker: did not fire** (0 of the last 3 reports carried a recorded validator FAIL). Chrome was unavailable throughout (zero connected browsers) — a genuine, same-day, cross-task outage, not a login issue — so the artist portion is reported as blocked/hard-stopped per the task's explicit partial-completion rule, not as a run failure.

## Summary

**13 venues enriched with a verified page/site** (11 with facebookUrl + website or facebookUrl alone, 1 website-only, all verified by `get_by_id`): La Belle Angele, The Magwitch, The Hare & Hounds, The Crooked Billet, The Garage, The Punch Bowl, The Gresley Arms, Manchester Club Academy, White Hart, Black Diamond, Bennerley Viaduct, Wheatsheaf, Taylors Bar. **6 evidenced blanks** (Tresaith, Annitsford Welfare Club, The Royal British Legion Beeston, White Lodge, Darcy's, The Tannery) — three of these confirm pre-existing standing findings, one (Royal British Legion) was initially written then **self-corrected/reverted** after cross-checking CTO-INBOX surfaced a prior Chrome-verified dead-link finding for the exact same URL family, which a plain search could not have caught. **1 record skipped without re-investigation** (Astor Hall — already 4x-documented wrong-business match). **Artist portion (Tiers 1, 4, 5) fully hard-stopped**: Chrome/`claude-in-chrome` returned zero connected browsers all firing, consistent with same-day outages independently reported by gigs-news-uk and insangel. Validator: `19 records · 7 clean · 0 FAIL · 24 WARN` — 0 FAIL, 0 exclusions, validated via a documented field-shape mapping (not a record exclusion) to work around the confirmed artist-only validator schema. Circuit breaker did not fire. The RUN-REPORT-15 open ruling request (undocumented BIO_VERBATIM/FAIL exclusion precedent from RUN-REPORT-12/13) remains outstanding for Jason/CTO and was not re-litigated this firing.
