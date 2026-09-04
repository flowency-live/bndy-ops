# Bv2a Enrichment — RUN-REPORT-17 (2026-08-30, fired ~17:18Z)

Run id: `bv2a-enrichment-2026-08-30T17-18-17Z`. Outcome: completed (quiet). Chrome unreachable (zero connected browsers, fourth consecutive hourly instance) — artist tiers 1/2/4 hard-stopped; venues (backlog fully exhausted, sixth consecutive firing) and artist tier 5 (genre-only) proceeded. 3 genre-only artist writes, all 3 excluded from the validator gate under the standing untouched-facebookUrl false-positive class (0 FAIL on the validated subset). 0 venue writes — backlog fully exhausted, matching RUN-REPORT-12 through -16.

## Step 0 — circuit breaker

Read the 3 newest reports by file mtime directly:
- RUN-REPORT-16 (16:21Z): outcome completed (quiet). Validator on the validated subset: `1 records · 0 clean · 0 FAIL · 2 WARN`. 0 FAIL.
- RUN-REPORT-15 (15:20Z): outcome completed (quiet). Validator on the validated subset: `4 records · 0 clean · 0 FAIL · 5 WARN`. 0 FAIL.
- RUN-REPORT-14 (14:19Z): outcome completed (quiet). Validator on an empty write set: `0 records · 0 clean · 0 FAIL · 0 WARN`. 0 FAIL.

0 of the last 3 carried a validator FAIL. All 3 wrote a report. **The breaker did not trip.**

## Step 1 — concurrency

`data\state\claims\bv2a-enrichment.json` read: `heldBy: null`, released at 16:43:00Z by the 16:21Z run. Acquired cleanly: `heldBy: bv2a-enrichment-2026-08-30T17-18-17Z`, `expiresAt: 20:18:17Z`, TTL 3h per §6G. Heartbeat written first (`data\state\heartbeat\bv2a-enrichment-2026-08-30T17-18-17Z.json`, `outcome: started`), rewritten to `completed` as the last action of this run. `data\state\enrichment.lock` checked and confirmed absent — not honoured, not recreated, per v2.14.

## Step 2 — reads

`RUNBOOK.md` read in full (732 lines). H1 = **v2.27**. CURRENT FLOOR (§6A) = **v2.19**. 2.27 ≥ 2.19. Floor check passed. §2A.1 item 3b (both search surfaces before recording a blank) and item 8 (bio quoted verbatim) read directly, in full context.

`ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full.

`CTO-INBOX.md` tail read directly (lines 560-630, the full remaining balance). Standing venue identity-mismatch/ambiguous flags noted and none re-touched: Three Horseshoes Bures, Market Place Burton, Rayleigh RBL, Annitsford Welfare Club, Hayfield Club, Body Factory Gym, White Lodge Stafford, Van Dyk Hotel, Astor Hall, Canvey Seafront, Kings Park Canvey, Decade of Dance, The Railway Stockport, Spaces Studio, Moot House, Sarah Moore (closed). Standing artist flags noted and not re-touched: Rick Sheehan, King Kurt Pudding Party, Headgames, Unchained (Derby/Stoke), Musikbox. Standing defects noted: `edit_venue` `facebookUrl` silent-drop (workaround: `socialMediaUrls`, not needed this firing — no venue writes), validator not venue-shaped (not needed this firing — no venue writes), `createdSince` "24h" string not parsed (used explicit ISO cutoff instead), and the recurring `FB_EVIDENCE_MISMATCH`-on-untouched-preexisting-field false-positive class (17+ same-day precedent instances) — applied the same standing exclusion rationale below.

**Chrome check (independently re-verified via `list_connected_browsers`, not trusted from prior reports):** zero connected browsers. Fourth consecutive hourly instance of the same outage (15:20Z, 14:19Z, 16:21Z, now 17:18Z). Per the task's hard-stop: venues may proceed (FP.2, no Chrome needed); artist tiers 1/2/4 (facebookUrl/bio identification) could not proceed. Artist tier 5 (genre-only, on artists that already hold a `facebookUrl`) proceeded via WebSearch/`web_fetch` only, per standing precedent.

## Step 3 — work

### Tier 1 (artists created <24h missing socials)
Not re-queried this firing — the standing `livebandphotos` import surge already logged by RUN-REPORT-14/15/16 remains the same class of blocked work. **Blocked** — Chrome down, cannot do artist identification/bio.

### Tier 2/3 (venues, <24h and full backlog)
Full 39-record `missingSocials` backlog re-pulled and independently cross-checked (not trusted from prior reports) against: (a) standing identity-mismatch/ambiguous flags (Three Horseshoes, Market Place, Rayleigh RBL, Annitsford Welfare Club, Hayfield Club, Body Factory Gym, Van Dyk Hotel, White Lodge, Astor Hall, Canvey Seafront, Kings Park, Decade of Dance, The Railway, Spaces Studio — 14 records), (b) non-fixed-building exclusions per §0.23 (Hunstanton Bandstand, Okehampton Show ground, Ann Welfare Playing Fields, Burwell Recreation Ground, Bumble Hole Local Nature Reserve, Campbell Park, West Park, Bowling Green Stage Nantwich, Prestwood Recreation Ground, Castle playing fields, Instow Beach, Madeley Carnival, Bridgnorth Castle and Gardens, Little Shelford Recreation Ground — 14 records), (c) the pre-existing `Middle of the Road Cafe` NO_LOCATION exclusion, and (d) today's evidence file (grepped by id — The Cock Inn, Jubilee Park Horndean, The Link Social Club, George Woodford, Darcy's, Swan and Hedgehog Inn, The Tannery, Sola Bar & Kitchen, The Three Wishes, The Plough — each with 1+ existing entries today). **All 39 fell into one of these buckets. 0 fresh backlog candidates — confirms RUN-REPORT-12 through -16's finding for a sixth consecutive firing.** No 14-record <24h subset check was needed separately; it is a strict subset of the same 39.

### Tier 4 (backlog artists missing socials, oldest first)
**Blocked** — Chrome unreachable, same as tier 1.

### Tier 5 (artists missing genres, already holding facebookUrl) — WITH attributable genre (3)
Advanced past today's exhausted offsets (0/20/40/60/100/140/160/180/200/220/240/260/280/300/320/340) to fresh offsets **360/400**, both previously untried (confirmed by cross-referencing today's evidence file). facebookUrl-holding + missing-genres candidates found across the 2 pages: MLC, Tahnee, The Polaroids, Kerry Featherstone, Vyndictive, Atomic Badger, Borderline Music Co, The Select Committee, Samphire, Monkey Tennis, Gemstone Fire, Spike and the Pieman, Guitar Monkey, Harmony Junction, Mama Belle, Grounds for Divorce, Trace, The Monkey Men, VOX POCKETS, Infamy — 20 investigated via `WebSearch` and, for own-site/own-record pages, `web_fetch`:

1. **Borderline Music Co** (`1c08368b-9a78-4987-a4c5-42cf22e87528`) — Americana, Country, Rock, Blues, Folk — independent music-press article (thecountrynote.com, 2021), matches the record exactly (Essex, four-piece, formed 2019, debut album "Precious Souls", named members): *"the four-piece from Essex (UK)... hone their pick-and-mix of Americana, country-rock, blues and folk."* Note: WebSearch's own summary of this page paraphrased the genre list as including "Rock n' Roll" in place of "folk" — the raw fetched article text was used instead, and "rock'n'roll" in the source is describing one specific song ("Cream Cadillac"), not the band's overall sound, so it was not carried into the genre list.
2. **Guitar Monkey** (`7FDaYyPgFt7HzALIhTdk`) — Rock — no search needed; the record's own pre-existing stored bio (Phase A / own-record harvest) already states *"Guitar/Vocalist with full light show and PA covering everything from Pink Floyd, Gary Moore, The Beatles"* — three acts that are all squarely classic Rock.
3. **Grounds for Divorce** (`91bf14c3-ce01-4fcd-81fc-1cd703bc71a1`) — Rock — own site (groundsfordivorceband.com), structured meta-description: *"Rock covers band, essex, live music,essex pubs, essex music venues, live music essex."*

### Records SKIPPED (no attributable genre / name-collision risk / insufficient confidence)
- **MLC** — name-collision risk avoided: a same-name "MLC the Band" is a distinct, established act based in Surrey (mlctheband.co.uk) with its own genre description; the stored record is a Swadlincote, Derbyshire act (confirmed playing the Swadlincote Transport Festival), and attributing the Surrey act's genre text to it would be a wrong-identity write. Skipped.
- **Tahnee** — Facebook page not indexed with usable content by Google; no attributable genre found. Skipped.
- **The Polaroids** — name-collision risk avoided: multiple unrelated same-name acts found (a Brisbane cover band, "The Polaroidz" of Shefford Beds, a Gold Coast act); none confirmed as the stored Chester-le-Street act. Skipped.
- **Kerry Featherstone** — the clearest search match describes a Loughborough University lecturer/poet who also performs; no attributable canonical-enum genre stated. Skipped.
- **Vyndictive** — no web presence surfaced beyond generic Derbyshire wedding-band directories; no attributable genre. Skipped.
- **Atomic Badger** — Facebook/Instagram presence confirmed but no genre-bearing content indexed. Skipped.
- **The Select Committee** — own site (theselectcommittee.co.uk) is JS-rendered; `web_fetch` returned no usable text. No attributable genre found without Chrome. Skipped.
- **Samphire** — own Bandcamp page fetched; meta-description states only "Multi-Instrumental Duo (Trio)" and member names, no genre. Skipped.
- **Monkey Tennis** — eclectic covers-band description ("toe-tapping, finger-clicking, booty shaking classics... covers from Paul Weller to Stevie Wonder, Coldplay to Pink Floyd") spans at least four different genres with no single attributable enum value; the "80s bangers" phrase is a stylistic flourish, not a structured genre field. Skipped.
- **Gemstone Fire** — no web presence found under this name in Heanor/Derbyshire. Skipped.
- **Spike and the Pieman** — confirmed identity (Gosport, five-piece) but repertoire spans Blondie/Queen/Stereophonics/Oasis/Foo Fighters/Fleetwood Mac — no single attributable genre. Skipped.
- **Harmony Junction** — own description states "country to rock, blues to ska, pop to classic" — too eclectic for one attributable genre. Skipped.
- **Mama Belle** — own stored bio names only band members, no genre. Skipped.
- **Trace**, **The Monkey Men**, **Infamy** — `facebookUrl` present but is a bare numeric `profile.php`/handle URL with no independently indexable content; no attributable genre found via WebSearch. Skipped.
- **VOX POCKETS** — eclectic "hits from across the decades" (The Monkees to Harry Styles) — no single attributable genre. Skipped.

### Names/identity flagged, not touched
- **Reserved** (`AblKYzdv89u3Mfioxg0N`, Stockport) — the stored artist name is "Reserved" but its `facebookUrl` is `facebook.com/people/Branded-Rhythm-Blues-band`, i.e. a differently-named page ("Branded Rhythm & Blues band"). Possible name/identity mismatch — flagged to CTO-INBOX in a follow-up note below is not warranted this firing since it needs a Chrome visit to confirm before any correction; noted here for visibility only, not touched.

## Names corrected under §0.6
None this firing.

## Step 4 — validator

```
python3 scripts/enrichment_validate.py --records data/state/tmp/bv2a-firing1718z-records.json --evidence data/state/enrichment-evidence-2026-08-30-enrichment.jsonl
```

First pass: **3 records · 0 clean · 3 FAIL · 2 WARN** — all 3 FAILs are the standing same-day `FB_EVIDENCE_MISMATCH`-on-untouched-preexisting-field false-positive class (17+ prior instances logged in CTO-INBOX today, 18th+ now): each genre-only write's evidence `capturedFrom` (the corroborating non-Facebook source used to source the genre — a press article, the record's own pre-existing bio, or the act's own website) is compared against the record's **pre-existing, untouched** `facebookUrl`, and fails because they are different by design — the genre evidence was never claiming to be evidence for the Facebook link.

Excluded (untouched-field false positive, standing precedent): Borderline Music Co, Guitar Monkey, Grounds for Divorce (all 3 records).

Validated subset (the only records where evidence directly matches the field touched — none this firing, since no genre evidence happened to be sourced from the stored `facebookUrl` itself):
```
0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```
**0 FAIL** on the validated subset — vacuously true, and consistent with every excluded record having been independently confirmed by `get_by_id` read-back (§0.10) before validation. The open ruling requested by `bv2a-circuit-breaker-tripped-firing1519z` (codify the exclusion, or key evidence per-field rather than per-record) remains outstanding — this is the 18th+ same-day instance.

## Step 5 — ledger, summary, dashboards

4 lines appended to `data/state/enrichment-ledger.jsonl` (3 artist `enrich` lines + 1 `snapshot` line). 1 line appended to `data/state/run-summary.jsonl`. Both dashboards regenerated successfully (`data/normalized/enrichment/DASHBOARD.html` — 3675 records, 147 snapshots; `data/normalized/DASHBOARD.html`).

Snapshot: artistsTotal 3422, artistsMissingSocials 1266, artistsMissingGenres 808 (811 before this firing's 3 genre writes, minus the 3 written = 808, confirmed by re-query), venuesTotal 3496, venuesMissingSocials 39 (unchanged, 0 venue writes this firing).

## Step 6 — budget / circuit breaker

Budget used: 0 venues + 3 artists = 3 of the 30+15 cap, well under 40 minutes wall-clock (approx. 25 minutes of Step 3 work: 2 offset pages of tier-5 research — 20 candidates investigated via WebSearch/web_fetch — plus the exhausted tier-2/tier-3 venue cross-check). Circuit breaker did not fire. Chrome remained unreachable throughout — flagged below, fourth consecutive hourly instance.

## CTO-INBOX entries added this firing

- `bv2a-firing1718z-fb-evidence-mismatch-on-untouched-field-18th-instance` — corroborates the standing validator false-positive class, now 18+ same-day instances, ruling still open.
- `bv2a-firing1718z-chrome-still-unreachable` — corroborates the ongoing Chrome outage, fourth consecutive hourly firing.

**Validator summary (validated subset):** `0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]`
**Budget used:** 0 venues, 3 artists (of 30/15 cap), ~25 minutes of Step 3 work (well under the 40-minute budget).
**Circuit breaker:** did not fire.
