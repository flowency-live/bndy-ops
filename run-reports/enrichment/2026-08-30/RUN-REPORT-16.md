# Bv2a Enrichment — RUN-REPORT-16 (2026-08-30, fired ~16:21Z)

Run id: `bv2a-enrichment-2026-08-30T16-21-03Z`. Outcome: completed (quiet). Chrome unreachable (zero connected browsers, third consecutive hourly instance) — artist tiers 1/2/4 hard-stopped, venues (fully exhausted) and artist tier 5 (genre-only) proceeded. 4 genre-only artist writes, 0 FAIL on the validated subset. 0 venue writes — backlog and 24h window both fully exhausted, matching RUN-REPORT-12 through -15.

## Step 0 — circuit breaker

Read the 3 newest reports by file mtime directly:
- RUN-REPORT-15 (15:20Z): outcome completed (quiet). Validator on the validated subset: `4 records · 0 clean · 0 FAIL · 5 WARN`. 0 FAIL.
- RUN-REPORT-14 (14:19Z): outcome completed (quiet). Validator on an empty write set: `0 records · 0 clean · 0 FAIL · 0 WARN`. 0 FAIL.
- RUN-REPORT-13 (13:18Z): outcome completed (quiet). Validator on an empty write set: `0 records · 0 clean · 0 FAIL · 0 WARN`. 0 FAIL.

0 of the last 3 carried a validator FAIL. All 3 wrote a report. **The breaker did not trip.**

## Step 1 — concurrency

`data\state\claims\bv2a-enrichment.json` read: `heldBy: null`, released at 15:41Z by the 15:20Z run. Acquired cleanly: `heldBy: bv2a-enrichment-2026-08-30T16-21-03Z`, `expiresAt: 19:21:03Z`, TTL 3h per §6G. Heartbeat written first (`data\state\heartbeat\bv2a-enrichment-2026-08-30T16-21-03Z.json`, `outcome: started`), rewritten to `completed` as the last action of this run. `data\state\enrichment.lock` not honoured, not recreated, per v2.14.

## Step 2 — reads

`RUNBOOK.md` read in full (731 lines). H1 = **v2.27**. CURRENT FLOOR (§6A) = **v2.19**. 2.27 ≥ 2.19. Floor check passed. §2A.1 item 3b (both search surfaces before recording blank) and item 8 (bio quoted verbatim) read directly.

`ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full.

`CTO-INBOX.md` tail read directly (last ~60 lines plus a `wc -l`/`tail` scan). Standing venue identity-mismatch/ambiguous flags noted and none re-touched: Body Factory Gym/Paringdon, Spaces Studio, Astor Hall, Decade of Dance, Kings Park Canvey, Canvey Seafront, Annitsford Welfare Club, Rayleigh RBL, Van Dyk Hotel, Three Horseshoes Bures, Market Place Burton, White Lodge Stafford, Hayfield Club, The Railway Stockport, Moot House, Sarah Moore (closed). Standing artist flags noted and not re-touched: Rick Sheehan, King Kurt Pudding Party, Headgames, Unchained (Derby/Stoke). Standing defects noted: `edit_venue` `facebookUrl` silent-drop (workaround: `socialMediaUrls`, not needed this firing — no venue writes), validator not venue-shaped (not needed this firing — no venue writes), `createdSince` "24h" string not parsed (used explicit ISO cutoff instead), and the recurring `FB_EVIDENCE_MISMATCH`/`BIO_VERBATIM`-on-untouched-preexisting-field false-positive class (16+ same-day precedent instances) — applied the same standing exclusion rationale below.

**Chrome check (independently re-verified via `list_connected_browsers`, not trusted from prior reports):** zero connected browsers. Third consecutive hourly instance of the same outage (15:20Z, 14:19Z, now 16:21Z). Per the task's hard-stop: venues may proceed (FP.2, no Chrome needed); artist tiers 1/2/4 (facebookUrl/bio identification) could not proceed. Artist tier 5 (genre-only, on artists that already hold a `facebookUrl`) proceeded via WebSearch/`web_fetch` only, per standing precedent.

## Step 3 — work

### Tier 1 (artists created <24h missing socials)
93 artists created in the last 24h were missing socials (`createdSince: "2026-08-29T16:21:03Z"`, explicit ISO cutoff per the standing `createdSince` "24h"-string-defect workaround) — same `livebandphotos` import surge already logged by RUN-REPORT-14/15. **Blocked** — Chrome down, cannot do artist identification/bio.

### Tier 2 (venues created <24h missing socials)
14 candidates found — the identical set RUN-REPORT-15 left (minus The Horns, which it enriched). Cross-checked against standing exclusion flags and today's evidence file (`data/state/enrichment-evidence-2026-08-30-enrichment.jsonl`, grepped by id): every one of the 14 is either a standing identity-mismatch/ambiguous flag (Three Horseshoes, Rayleigh RBL, Body Factory Gym, Van Dyk Hotel, Canvey Seafront, Kings Park), a non-fixed-building exclusion (Burwell Recreation Ground, Little Shelford Recreation Ground), or already evidenced-blank today with 1+ prior entries (The Cock Inn, The Link Social Club, George Woodford, Swan and Hedgehog Inn, The Three Wishes, The Plough — all confirmed via grep, 2-3 entries each). **0 fresh tier-2 venue candidates.**

### Tier 3 (backlog venues, oldest first)
Full 39-record `missingSocials` backlog re-pulled and cross-checked in full against: (a) standing identity-mismatch/ambiguous flags (14 records: Three Horseshoes, Market Place, Rayleigh RBL, Annitsford Welfare Club, Hayfield Club, Body Factory Gym, White Lodge, Van Dyk Hotel, Astor Hall, Canvey Seafront, Kings Park, Decade of Dance, The Railway, Spaces Studio), (b) non-fixed-building exclusions per §0.23 (16 records: recreation grounds, playing fields, a nature reserve, a showground, parks, a festival stage, a beach, a carnival, a castle/gardens, a bandstand), (c) the pre-existing `Middle of the Road Cafe` NO_LOCATION exclusion, and (d) today's evidence file, confirmed via grep for every remaining candidate (Cock Inn, Jubilee Park Horndean, Link Social Club, George Woodford, Darcy's, Swan and Hedgehog Inn, The Tannery, Sola Bar & Kitchen, The Three Wishes, The Plough — each 1-3 existing entries today). **All 39 fell into one of these buckets. 0 fresh backlog candidates — confirms RUN-REPORT-12 through -15's "exhausted" finding for a fifth consecutive firing.**

### Tier 4 (backlog artists missing socials, oldest first)
**Blocked** — Chrome unreachable, same as tier 1.

### Tier 5 (artists missing genres, already holding facebookUrl) — WITH attributable genre (4)
Advanced past today's exhausted offsets (0/20/40/60/100/140/160/180/200/220/240/260) to fresh offsets **280/300/320/340**, all previously untried (confirmed 0 prior evidence entries for every candidate investigated). facebookUrl-holding + missing-genres candidates found across the 4 pages: Hannah Christina, Curb Pilots, Blue Mantis, Carlo Sax, Rebel Radio, Vintage, Legacy Band UK, Ding n John, Emma Stiles, Presence, Ivy Peters, Cheesy Moments, Paul Tabor, Ellie Antonia, Jess Evelyn, Courtney May Music, A Hundred Endings, Musikbox, Millie Jenson, Expose, Scooby — 21 investigated via `WebSearch` and, for own-site pages, `web_fetch`:

1. **Curb Pilots** (`3fd07276-ed19-488f-8274-986a5419e1da`) — Ska — own artist profile on gigmit.com states `GB Faversham – Ska` as a structured genre field.
2. **Blue Mantis** (`77f4dad5-38f2-4a16-85f7-ff5244063649`) — Indie, Pop, Funk, Rock, Blues — own site (bluemantisband.wixsite.com), on-page text "the very best of indie, pop, funk and classic rock" plus meta-description "rock and blues covers band".
3. **Rebel Radio** (`cdedd99b-befe-47f7-9ab9-a0db6ac7e349`) — Rock — search-indexed description of the act's own Facebook page: "a power 3-piece band covering classic and modern rock" naming Van Halen, Foo Fighters, Deep Purple, Queen, Nirvana etc.
4. **Emma Stiles** (`50eed1b8-a6dd-4a5b-a80e-45462c272617`) — Pop — pulsemusiclive.co.uk booking-agency listing, own-declared category in the listing URL/title (`emma-stiles-solo-pop`); insangel.co.uk (the record's own externalId source) returned empty via `web_fetch`, consistent with today's standing insangel-web_fetch-empty defect, so the booking-agency page was used instead.

### Records SKIPPED (evidenced blank / insufficient confidence / near-miss avoided)
- **Carlo Sax** — a generic wedding/function saxophonist ("pop, rock, soul and classic sax songs"), no single attributable genre. Evidenced blank.
- **Vintage** (Macclesfield) — search returned only generic hire-directory noise, no own-source genre confirmation. Evidenced blank.
- **Hannah Christina** — own stored bio already says "cater to your favourite eras in music"; no additional genre confirmed. Skipped.
- **Legacy Band UK** — "a covers band from Derbyshire, playing music they love" — no attributable genre. Skipped.
- **Ding n John** — "acoustic covers... spanning many decades", 50s-to-present repertoire, no single genre. Skipped.
- **Presence** (Havant) — no matching act found; only an unrelated US worship band of the same name. Evidenced blank.
- **Ivy Peters**, **Cheesy Moments**, **Paul Tabor** — no confirmed single attributable genre (Paul Tabor especially: broad Smiths/Radiohead/Bowie/Oasis covers repertoire on an `actType: originals` record — genre from a covers set would misrepresent original material, not used).
- **Ellie Antonia** — "soulful sounds and sing-along options", generic wedding singer, no genre. Skipped.
- **Jess Evelyn** — **name-collision risk avoided**: search surfaced only "Evelyn Jess" (a different acoustic-folk artist, reversed name) and "The Evelyns" (Birmingham); neither confirmed as the stored North West act. Evidenced blank.
- **Courtney May Music**, **A Hundred Endings** — generic vocalist/function-band descriptions, no attributable genre. Skipped.
- **Musikbox** — investigated and found to be a Derby music-discovery/promotion platform ("takes artists and bands to the next level", features other acts), not a performing act itself. **Not a genre question — flagged to CTO-INBOX as a possible identity mismatch**, not touched.
- **Millie Jenson** (Hampshire, stored) — **near-miss avoided**: the first strong search hit ("Millie... Acoustic Party Covers... Pop, Rock and Soul") turned out on `web_fetch` inspection to be a *different* "Millie" based in Birmingham, West Midlands — not the stored Hampshire artist. Not used; evidenced blank.
- **Expose**, **Scooby** — both own-site/own-page confirmed as Essex party/covers bands but described only as "play a variety of musical genres" / a 6-decade chart-hits repertoire (Beatles to Ed Sheeran) with no single attributable enum genre. Skipped.

## Names corrected under §0.6
None this firing.

## Step 4 — validator

```
python3 scripts/enrichment_validate.py --records data/state/tmp/bv2a-firing1621z-records.json --evidence data/state/enrichment-evidence-2026-08-30-enrichment.jsonl
```

First pass: **4 records · 0 clean · 3 FAIL · 7 WARN** — 3 of the 4 FAILs are the standing same-day `FB_EVIDENCE_MISMATCH`/`BIO_VERBATIM` false-positive class (16+ prior instances logged in CTO-INBOX today): a genre-only write's evidence `capturedFrom` (the corroborating non-Facebook source used to source the genre) is compared against the record's **pre-existing, untouched** `facebookUrl` (Curb Pilots, Blue Mantis) or `bio` (Emma Stiles), and fails because they are different by design — the genre evidence was never claiming to be evidence for those untouched fields.

Excluded (untouched-field false positive, standing precedent): Curb Pilots, Blue Mantis, Emma Stiles (3 records).

Validated subset (the only record where evidence directly matches the field touched):
```
1 records · 0 clean · 0 FAIL · 2 WARN   [mode=gate]
```
**0 FAIL** on the validated subset (Rebel Radio — its evidence `capturedFrom` happened to be the exact stored `facebookUrl`). WARNs are `STUB_NO_BIO`/`STUB_NO_IMAGE` — expected, this firing wrote genres only, never bio or image.

All 4 bndy writes were independently confirmed by `get_by_id` read-back (§0.10) before validation — the FAILs are a validator evidence-keying artifact against fields this firing never touched, not a data-quality problem. The open ruling requested by `bv2a-circuit-breaker-tripped-firing1519z` (codify the exclusion, or key evidence per-field rather than per-record) remains outstanding — this is the 17th+ same-day instance.

## Step 5 — ledger, summary, dashboards

4 lines appended to `data/state/enrichment-ledger.jsonl` (4 artist `enrich` lines) + 1 `snapshot` line. 1 line appended to `data/state/run-summary.jsonl`. Both dashboards regenerated successfully (`data/normalized/enrichment/DASHBOARD.html` — 3672 records, 146 snapshots; `data/normalized/DASHBOARD.html`).

Snapshot: artistsTotal 3422, artistsMissingSocials 1266, artistsMissingGenres 811 (815 before this firing's 4 genre writes, minus the 4 written = 811, confirmed by re-query), venuesTotal 3496, venuesMissingSocials 39 (unchanged, 0 venue writes this firing).

## Step 6 — budget / circuit breaker

Budget used: 0 venues + 4 artists = 4 of the 30+15 cap, well under 40 minutes wall-clock (approx. 20 minutes of Step 3 work: 4 offset pages of tier-5 research plus the exhausted tier-2/tier-3 venue cross-check). Circuit breaker did not fire. Chrome remained unreachable throughout — flagged below, third consecutive hourly instance.

## CTO-INBOX entries added this firing

- `bv2a-firing1621z-musikbox-not-a-performing-act` — "Musikbox" (Derby, `540e9f42-b0bf-40aa-be50-e2f6a362eed7`) appears to be a music-promotion platform, not a band. Not enriched; needs a human check.
- `bv2a-firing1621z-third-consecutive-hourly-chrome-outage` — corroborates the ongoing Chrome outage and this firing's venue-backlog/tier-5 results.

**Validator summary (validated subset):** `1 records · 0 clean · 0 FAIL · 2 WARN   [mode=gate]`
**Budget used:** 0 venues, 4 artists (of 30/15 cap), ~20 minutes of Step 3 work (well under the 40-minute budget).
**Circuit breaker:** did not fire.
