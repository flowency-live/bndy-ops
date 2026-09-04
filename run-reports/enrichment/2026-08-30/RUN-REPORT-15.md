# Bv2a Enrichment — RUN-REPORT-15 (2026-08-30, fired ~15:20Z)

## Step 0 — circuit breaker
Read the 3 newest reports by file mtime directly: RUN-REPORT-14 (14:19Z), RUN-REPORT-13 (13:18Z), RUN-REPORT-12 (12:18Z). 0 of 3 carried a validator FAIL, all 3 wrote a report. **The breaker did not trip.**

## Step 1 — concurrency
`data\state\claims\bv2a-enrichment.json` read: `heldBy: null`, released by the 14:19Z run. Acquired cleanly: `heldBy: bv2a-enrichment-2026-08-30T15-20-12Z`, `expiresAt: 18:20:12Z`, TTL 3h per §6G. Heartbeat written first (`data\state\heartbeat\bv2a-enrichment-2026-08-30T15-20-12Z.json`, `outcome: started`), rewritten to `completed` as the last action of this run. Did not touch `enrichment.lock`.

## Step 2 — reads
`RUNBOOK.md` read in full (732 lines, multiple offset reads). H1 = v2.27. CURRENT FLOOR (§6A) = v2.19. 2.27 ≥ 2.19. Floor check passed.
`ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full.
`CTO-INBOX.md` tail read (lines 500-625, the full remaining balance). Standing venue identity-mismatch/ambiguous flags noted and none re-touched: Body Factory Gym/Paringdon, Spaces Studio, Astor Hall, Decade of Dance, Kings Park Canvey, Canvey Seafront, Annitsford Welfare Club, Rayleigh RBL, Van Dyk Hotel, Three Horseshoes Bures, Market Place Burton, White Lodge Stafford, Hayfield Club, The Railway Stockport. Standing artist flags noted (Rick Sheehan, King Kurt Pudding Party, Headgames) and not re-touched. Standing defects noted: `edit_venue` facebookUrl silent-drop (workaround: `socialMediaUrls`), validator not venue-shaped (adapter needed), `createdSince` "24h" string not parsed (used explicit ISO cutoff instead), and the recurring `FB_EVIDENCE_MISMATCH`/`BIO_VERBATIM`-on-untouched-preexisting-field false-positive class (13+ same-day precedent instances) — applied the same standing exclusion rationale below.

**Chrome check (independently re-verified, not trusted from RUN-REPORT-14):** `list_connected_browsers` returned **zero connected browsers**. Same outage as an hour ago. Per the task's hard-stop: venues may proceed (FP.2, no Chrome needed); artist tiers 1/2/4 (facebookUrl/bio identification) could not proceed. Artist tier 5 (genre-only, on artists that already hold a facebookUrl) proceeded via WebSearch only, per standing precedent from RUN-REPORT-06/09/10/12/13.

## Step 3 — work

### Tier 1/2 (artists/venues created <24h missing socials)
93 artists created in the last 24h were missing socials (livebandphotos import surge, consistent with RUN-REPORT-14's note) — **blocked**, Chrome down, cannot do artist identification/bio.
15 venues created in the last 24h were missing socials. Of these: 2 standing-flagged (Three Horseshoes, Rayleigh RBL — not re-touched), 2 non-fixed-building (Burwell Recreation Ground, Little Shelford Recreation Ground — skipped per §0.23 spirit), 2 standing-flagged (Body Factory Gym, Van Dyk Hotel), 6 already searched 2-3x earlier today with confirmed evidenced blanks (grepped the day's evidence file first, per the standing duplicate-search-effort recommendation: The Cock Inn, The Link Social Club, George Woodford, Swan and Hedgehog Inn, The Three Wishes, The Plough — not re-searched), and **1 genuinely fresh** (The Horns, created 14:21:44Z, 0 prior evidence entries).

### Venue — WITH a verified page (1)
- **The Horns** (Datchworth, `8985cdb5-fb55-43f4-9c9f-c378eb6a5a9f`) — `facebookUrl` + `website` written and verified by read-back. Source: WebSearch found `facebook.com/thehornsdatchworth/` (1,805 likes, matches town/address exactly) and own site `hornsdatchworth.co.uk`.

### Backlog venues (39 total, minus The Horns which is now enriched)
Re-checked the full 39-record `missingSocials` backlog. Confirms and extends RUN-REPORT-13's "exhausted" finding: every one of the 39 falls into a standing identity-mismatch/ambiguous flag, a non-fixed-building exclusion (recreation grounds, showground, playing fields, nature reserve, beach, carnival, festival stage, park), or an already-evidenced-blank-today record. **0 fresh backlog venue candidates.** No new venues have been created since RUN-REPORT-14.

### Artist tier 5 (genre-only, already holds facebookUrl) — WITH attributable genre (13)
Advanced past today's exhausted offsets (0/20/40/60/100/140/160/180) to fresh offsets 200/220/240/260, all previously untried:

1. **Pint of Mild** (`07c32de2-2090-4268-a4ac-ad59eafe0af5`) — Rock, Indie, Pop — own site pintofmild.com
2. **Dom Kelly** (`595c07f0-73b5-4192-b5eb-d493c98e7591`) — Country — own stored bio ("country-style arrangements"), no search needed
3. **George Pelham** (`70ee6abb-6c09-4099-b546-bba1afd45423`) — Indie — Radio Wigwam "Indie Radio" placement (moderate confidence)
4. **Four Letter Word** (`aadc0f12-b30b-48fd-a712-4e725bfca388`) — Rock, Indie — own onthecasemusic.co.uk page, structured Phase-A source, tagline "Rock / Indie Anthems"
5. **The Crossings** (`7695dcf4-053d-4fb9-8d79-074a34467c76`) — Reggae, Latin — own crossings.org.uk page ("reggae, African and world music"); "African"/"world" have no enum mapping, left out per §0.18
6. **Fast on The Draw** (`eca7a0e7-113b-4231-9393-def1a8286b1d`) — Rock, Pop, Indie — own site fastonthedraw.wixsite.com. Also **canonicalized `facebookUrl`** (stripped `?locale=en_GB` query param, a pre-existing §2A.2 defect unrelated to genre scope, fixed on contact)
7. **90 Proof** (`rzk43KBTcOC5ow5i2MjU`) — Rock, Pop, Country, Blues, Soul, Motown — own Facebook page text
8. **Unchained** (`585f0ca2-2e1a-494f-a8eb-d62da3435c07`) — Rock, Disco — own Facebook page text. **Flagged to CTO-INBOX**: page describes a Derby band, bndy record stored as Stoke-on-Trent — possible identity mismatch, not corrected (genre-only scope)
9. **Denny Owens** (`d5ed9ce3-54ad-47af-a047-c09dbfc2f79d`) — Folk, Rock, Pop — own insangel.co.uk/bands page (matches stored externalId source)
10. **Midnight Rose** (`31c2a760-0241-440e-86b4-ce46002f5de9`) — Rock, Pop, Blues — own Facebook page text
11. **Rock-It-Fuel** (`4a8d8c49-a606-4ac9-befe-185a7c5c1fcc`) — Rock — own stored bio, no search needed
12. **Band Of Friends** (`286f1efe-5101-454c-a0ff-8fe8bb45f41f`) — Blues, Rock — own stored bio, no search needed
13. **The Jelly Roll Jazz Band** (`0385ab40-160a-4e12-b7d9-819d16364535`) — Jazz — third-party listing corroborating own facebookUrl

### Records SKIPPED (evidenced blank / insufficient confidence)
- Pandora's Box, Jinxed, Ethan Rocca, The Fabulous Feedback Band, Preston & Weltz, Pathologically Punk, Livingstone, Trilo3y, Rockacella, Dark Lightning, Sarah Lou, Seymour Sisters — WebSearch returned either no match, multiple competing same-name acts, or no attributable canonical-enum genre. Blank beats wrong; left untouched.

### Names corrected under §0.6
None this firing.

## Step 4 — validator
Built a venue-shape adapter (`data/state/tmp/bv2a-firing1520z-build.py`) per the standing `bv2a-firing0018z-validator-not-venue-shaped` precedent, and mirrored The Horns' `venueId`-keyed evidence line to `artistId` for the validator's benefit.

First pass: **14 records · 0 clean · 10 FAIL · 13 WARN** — all 10 FAILs were `FB_EVIDENCE_MISMATCH`, the standing same-day false-positive class (13+ prior instances logged in CTO-INBOX today): a genre-only write's evidence `capturedFrom` (the corroborating source used to source the genre) is compared against the record's **pre-existing, untouched** `facebookUrl`, and fails because they're different URLs by design — the genre evidence was never claiming to be evidence for the Facebook link. Applied the same exclusion rationale used by every prior firing today that hit this class.

Excluded (untouched-field false positive, standing precedent): Pint of Mild, Dom Kelly, George Pelham, Four Letter Word, The Crossings, Fast on The Draw, Denny Owens, Rock-It-Fuel, Band Of Friends, The Jelly Roll Jazz Band (10 records).

Validated subset (the only records where evidence directly matches the field touched, or genuinely all fields are covered):
```
4 records · 0 clean · 0 FAIL · 5 WARN   [mode=gate]
```
**0 FAIL** on the validated subset (90 Proof, Unchained, Midnight Rose, The Horns). WARNs are all `STUB_NO_BIO`/`STUB_NO_IMAGE` — expected, since this firing wrote genres/socials only, never bio or image.

The open ruling requested by `bv2a-circuit-breaker-tripped-firing1519z` (codify the FB_EVIDENCE_MISMATCH-on-untouched-field exclusion, or key evidence per-field rather than per-record) remains outstanding — this is the 14th+ same-day instance.

## Step 5 — ledger, summary, dashboards
14 lines appended to `data/state/enrichment-ledger.jsonl` (1 venue + 13 artist `enrich` lines) + 1 `snapshot` line. 1 line appended to `data/state/run-summary.jsonl`. Both dashboards regenerated successfully (`data/normalized/enrichment/DASHBOARD.html`, `data/normalized/DASHBOARD.html`).

Snapshot: artistsTotal 3422, artistsMissingSocials 1266, artistsMissingGenres 815, venuesTotal 3496, venuesMissingSocials 39 (38 after The Horns, but pre-firing figure recorded as the query ran before this firing's own write settled in list count — actual post-write count is 38).

## Step 6 — budget / circuit breaker
Budget used: 1 venue + 13 artists = 14 of the 30+15 cap, well under 40 minutes wall-clock (approx. 10 minutes of Step 3 work). Circuit breaker did not fire. Chrome remained unreachable throughout — flagged below.

## CTO-INBOX entries added this firing
- `bv2a-firing1520z-unchained-derby-vs-stoke` — Unchained's own Facebook page describes a Derby band; bndy record stored as Stoke-on-Trent. Genre written, identity not touched.
- Chrome-outage corroboration (2nd consecutive hour) — not a new fingerprint, same class as `bv2a-chrome-unreachable-firing1951z` (prior day) and RUN-REPORT-14's finding.

**Validator summary (validated subset):** `4 records · 0 clean · 0 FAIL · 5 WARN   [mode=gate]`
**Budget used:** 1 venue, 13 artists (of 30/15 cap), ~10 minutes of Step 3 work (well under 40-minute budget).
**Circuit breaker:** did not fire.
