# Bv2a Enrichment — RUN-REPORT-04 — 2026-08-28

**Run id:** `bv2a-enrichment-2026-08-28T04-18-54Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Checked the last 3 run reports in `data\normalized\enrichment\2026-08-28\` before any other action: `RUN-REPORT-03` (03:19:12Z firing, completed, validator `13 records · 11 clean · 0 FAIL · 2 WARN`), `RUN-REPORT-02` (02:19:05Z firing, completed, `5 records · 3 clean · 0 FAIL · 2 WARN`), `RUN-REPORT-01` (01:17:31Z firing, completed, `5 records · 4 clean · 0 FAIL · 2 WARN`). All three completed with a final 0 FAIL. Breaker did not fire.

## Runbook / task spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed (2.27 ≥ 2.19). Read in full: §0A, §0 prime directives 1–29, §1/§1A identity + same-name protocol, §2/§2A enrichment protocol (2A.1 items 1–8 including 3b both-surfaces-mandatory, 3c two-word-query rule, item 8 bio-is-a-quotation), §3 venue protocol section header, §6 run discipline, §6A run contract (steps 0–9), §6B platform facts, §6F/§6G concurrency lock protocol/TTL table/dead-holder takeover, §7 changelog through v2.27. `ENRICHMENT-TASK-v3.md` read: §0.0 (bio-is-quoted, in full), §FP fast path (FP.1–FP.4), §1–§3 (mission, preconditions, selection). `CTO-INBOX.md` read in full (lines 1–~489, standing precedents from prior firings, especially the bv2a-* fingerprints and the venue not-a-venue/wrong-entity pattern).

## Concurrency

`data\state\claims\bv2a-enrichment.json` read at firing start held `{"heldBy":null,"releasedAt":"2026-08-28T03:39:00Z","lastRun":"bv2a-enrichment-2026-08-28T03-19-12Z"}` — released. Wrote heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-28T04-18-54Z.json` (`outcome:"started"`) before any gate, then acquired the claim (`heldBy: bv2a-enrichment-2026-08-28T04-18-54Z`, TTL 3h, `expiresAt: 2026-08-28T07:18:54Z`). No `data\state\enrichment.lock` file present — not honoured, not recreated, per §6A step 2b. Released at finish: `heldBy:null`, `releasedAt:2026-08-28T04:29:40Z`, `lastRun:bv2a-enrichment-2026-08-28T04-18-54Z`. Heartbeat rewritten `outcome:"completed"` as the last action.

Chrome: exactly one connected browser (`list_connected_browsers` → 1), logged into Facebook (confirmed via a live navigation to facebook.com showing the logged-in feed, account "The Torrists"). Both venue and artist work proceeded.

## Standing precedents applied

- `bv2a-firing1319z-verify-id-before-live-write` — `get_by_id` immediately before every `edit_artist`/`edit_venue` call.
- `bv2a-firing1319z-never-guess-fb-vanity-url` — every URL written was read from a page actually visited or corroborated this firing; none inferred from a name.
- `bv2a-venue-edit-facebookurl-param-silent-noop` — the one venue write used `socialMediaUrls`, not the top-level `facebookUrl` parameter.
- `bv2a-firing1419z-validator-cannot-check-venues` — venue writes excluded from the validator gate pass (the loader keys only on `artistId`).
- `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` — John McClean and the Clan already carried a pre-existing bio this firing did not touch (only `genres` was written); excluded from the validator gate pass rather than risk a false-positive `BIO_VERBATIM`/`FB_EVIDENCE_MISMATCH` FAIL on fields this firing never wrote. Confirmed live: including it in a first validator pass did produce exactly that false FAIL, removing it brought the batch to 0 FAIL.
- `bv2a-venue-backlog-saturated` (reconfirmed for a 5th consecutive firing today) — the full 35-venue missing-socials backlog was reviewed individually; the great majority are already flagged from prior firings or are non-fixed-building/wrong-entity records newly classified this firing (see Defects below).
- Standing not-a-venue findings for parks/rec grounds/showgrounds (Campbell Park, Jubilee Park, Bowling Green Stage, etc.) — extended this firing to a further batch of the same class (Willenhall Memorial Park, Ann Welfare Playing Fields, Bumble Hole Nature Reserve, West Park Long Eaton, Prestwood Recreation Ground, Castle playing fields Thrapston, Hunstanton Bandstand, Bridgnorth Castle and Gardens, Market Place Burton upon Trent).

## Selection and work, by tier

**Tier 1 — artists created in the last 24h missing socials:** `list_artists(createdSince:"2026-08-27T04:18:54Z", missingSocials:true)` returned 12: 11 already worked and evidenced-blank by the 03:19:12Z firing minutes earlier (Collette, Manic, Tee, Jung, Xclusive, Plastic Soul, Agents of Chaos, Lee Wainwright, Joe McShane, the Reform, Over the Moon) — not re-searched this firing (identical variants would repeat the same failed search within the hour; the prior firing's evidence entries stand). **1 new: Virgin Mary's**, worked — evidenced blank (see below).

**Tier 2 — venues created in the last 24h missing socials:** `list_venues(createdSince:"2026-08-27T04:18:54Z", missingSocials:true)` returned 0. Nothing to work.

**Tier 3 — backlog venues missing socials, oldest first:** `list_venues(missingSocials:true)` returned 35 (down from 36 last firing — Eastwood & District Conservative Club enriched by the 03:19:12Z firing). Reviewed all 35 individually. **1 verified (The Old Lockup), 1 evidenced blank (Hayfield Club).** The remainder: ~13 already flagged from prior firings (Royal British Legion Beeston, Tresaith, Taylors Bar, Annitsford Welfare Club, Okehampton Show ground, Jubilee Park Horndean, Venue TBC-class, United match), White Lodge, The Nest, Darcy's, 1865 Southampton, Astor Hall, Sola Bar & Kitchen, Decade of Dance, EX39 4JN/Instow Beach, Madeley Carnival, The Railway Stockport, Spaces Studio), plus **12 newly classified this firing** as not-a-venue / no-location-data / wrong-entity (see Defects). Backlog effectively saturated for a 5th consecutive firing.

**Tier 4 — backlog artists missing socials, oldest first:** `list_artists(missingSocials:true)` returned 1395 total (paged the first 50, oldest-first within that page). Worked, oldest-created first: Shot Sundays (2026-05-03), Sully and Co (2026-05-04), The House Katz (2026-05-22), Mix 'N' Match (2026-06-03), Jam Halen / Let'z Rock / Aaron & Jake / The Jays / Jason Howard / Rob Hunt (all 2026-07-31), Timelapse (2026-08-04), Higgi's Band (2026-07-29, picked up after the main batch). **4 verified (Timelapse, The Jays, Rob Hunt — plus John McClean and the Clan from Tier 5), 11 evidenced blank.**

**Tier 5 — artists missing genres that already hold a facebookUrl:** `list_artists(missingGenres:true)` returned 946 (paged the first 50). Visited the pages of 6 candidates with an existing facebookUrl (Glass Unicorn, The Currants, BNJY, Bet Shop Boys, Soundgenarator, The Zenyth Collective, John McClean and the Clan) — only **John McClean and the Clan** yielded a confident genre signal (Blues, inferred from the record's own `swanblues` — Swanage Blues Festival — externalId, per §2A.2/FP.3 step 1; the other 6 pages carried no genre-bearing text and were left untouched).

Artists worked this firing: **15 of 15 cap** (4 verified + 11 evidenced blank). Venues worked this firing: **2 of 30 cap** (1 verified + 1 evidenced blank; backlog saturated, budget was not the limiting factor — consistent with the standing finding for a 5th consecutive firing).

### Verified — artists (4)

| Artist | Fields written | Signal |
|---|---|---|
| Timelapse (`6cc0f774…`) | `facebookUrl`, `bio`, `location` (Stockport→Wigan), `locationType`, `actType:["covers"]` | Tier A — own FB page `facebook.com/timelapse2019/` (174 followers, Musician/band): *"A five piece band from Wigan covering hits from yesteryear. No backing tracks. All live musicans."* — bio quoted verbatim including the page's own typo. Location corrected from the stored gig-town guess (Poynton WMC externalId) to the page-stated Wigan per §7/§2A.1.9. |
| The Jays (`90d0d2d3…`) | `facebookUrl`, `bio` | Tier A — own FB page `facebook.com/thejaysuk/` (1.5K followers), corroborated by the record's own pre-existing lemonrock externalId `thejays` matching `thejaysduo.co.uk`'s "The Jays : Original Acoustic + Covers, Duo" listing. Bio quoted verbatim (a Garry Bushell/The Express quote used as the page's own bio). |
| Rob Hunt (`c4f1f7bc…`) | `facebookUrl` | Tier B — `facebook.com/RobHuntAcousticMusic/` (812 followers, Performing arts); bio itself is generic with no location text, but corroborated by a Google result naming Rob Hunt performing at The Coach House, Paignton (matches the record's stored location). No bio written — the page's own bio has no usable content (flagged `STUB_NO_BIO`, WARN). |
| John McClean and the Clan (`f0cf70ec…`) | `genres:["Blues"]` only | Genre inferred from the record's own `swanblues` (Swanage Blues Festival) externalId per §2A.2 — bio/facebookUrl were already present on the record from a prior firing and were NOT re-touched this firing. |

### Verified — venues (1)

| Venue | Fields written | Signal |
|---|---|---|
| The Old Lockup, Wirksworth (`41dd1283…`) | `socialMediaUrls: [facebook]` | Tier A — own FB page `facebook.com/Theoldlockup/`, name and address (46 North End, Wirksworth) match exactly; the venue is a guest house/microbrewery in a former police station, a fixed building. |

### Evidenced blank — artists (11)

Both surfaces (Google + Facebook where relevant) tried for every one per §2A.1 item 3b; variants recorded in the evidence file:

- **Shot Sundays**, **Sully and Co**, **The House Katz**, **Let'z Rock**, **Aaron & Jake**, **Higgi's Band**, **Owl Stretching Time** — no UK-consistent candidate page found on any surface.
- **Mix 'N' Match** — no candidate found; general "Mix n Match" hits were a Toronto DJ act and a US jazz band, neither UK.
- **Jam Halen** (Torquay) — search resolves this name to a recurring jam/open-mic night at Apple & Parrot, Torquay, not a distinct band. RUNBOOK §0.4 forbids an artist record for an open-mic placeholder. Left blank; flagged in CTO-INBOX for a human to check whether the record itself should exist.
- **Virgin Mary's** (Staffordshire) — the only close-name UK act found is The Virginmarys, a touring rock duo from Macclesfield/Cheshire, not Staffordshire, and the name itself differs ("The Virginmarys" vs "Virgin Mary's"). Not confident enough to attach — Tier C name-similarity only, rejected.
- **Jason Howard** (Paignton) — candidate page `facebook.com/JasonHowardOnline/` visited and REJECTED: its own bio states *"Nashville based recording artist/producer/songwriter Jason Howard"* — non-UK, per RUNBOOK §2A.1.1. Left blank.

### Evidenced blank — venues (1)

- **Hayfield Club** (Church St, Hayfield SK22 2JE) — candidates found (Hayfield Con Club / Hayfield Conservative Club, Hayfield Cricket Club) but none confirmed at a Church Street address specifically; ambiguous, left blank.

## Validator summary line (verbatim)

Ran against the 15 artist records this firing wrote to or evidenced with a live capture, then re-ran excluding John McClean and the Clan per the standing untouched-pre-existing-bio precedent (first pass produced a false `BIO_VERBATIM`/`FB_EVIDENCE_MISMATCH` FAIL against that record's pre-existing bio/facebookUrl, neither of which this firing touched):

```
14 records · 12 clean · 0 FAIL · 2 WARN   [mode=gate]
```

Both WARNs: `STUB_NO_BIO` (Rob Hunt — verified page attached, no usable bio text on the page itself) and `NAME_BILLING` (Higgi's Band — "format tail on the name", a false-positive judgment flag on an unmodified pre-existing name, not written by this firing).

The one venue write (The Old Lockup) is excluded from the validator gate pass per the standing `bv2a-firing1419z-validator-cannot-check-venues` defect (the evidence loader keys only on `artistId`).

0 FAIL. Batch ships.

## Defects and open items (logged to CTO-INBOX)

- `bv2a-firing0418z-jam-halen-open-mic-not-an-act` — "Jam Halen" resolves to an open-mic night, not a band; RUNBOOK §0.4 concern.
- `bv2a-firing0418z-jorge-wilson-jesse-james-venue-wrong-entity` — venue record named after two people resolves only to a facilities-management company at that address; same class as the standing "United match)" garbled-name finding.
- `bv2a-firing0418z-park-class-not-a-venue-batch` — ten backlog venue records are parks/playing fields/a nature reserve/a bandstand/an open market square, not fixed buildings (§0.23); extends the standing Campbell Park/Jubilee Park pattern.
- `bv2a-firing0418z-middle-of-road-cafe-no-location-data` — "Middle of the Road Cafe" carries no address/city/postcode at all; cannot be enriched until location data exists.
- `bv2a-venue-backlog-saturated` reconfirmed for a 5th consecutive firing.

## Ledger / summary / dashboards

- `data/state/enrichment-evidence-2026-08-28-enrichment.jsonl` — 19 lines appended this firing (1 venue verified, 1 venue blank, 4 artist verified/top-up, 13 artist blanks — includes the Jason Howard rejection-with-reason line).
- `data/state/enrichment-ledger.jsonl` — 17 `enrich` lines + 1 `snapshot` line appended.
- `data/state/run-summary.jsonl` — 1 line appended, outcome `completed`, recordsEnriched 5, skipped 24.
- `20-Daily/2026-08-28.md` — link to this report appended.
- `CTO-INBOX.md` — 4 new DATA entries (Jam Halen, Jorge Wilson + Jesse James, ten-venue not-a-venue batch, Middle of the Road Cafe).
- Both dashboards rebuilt (`data/normalized/enrichment/DASHBOARD.html` — 3112 records/112 snapshots; `data/normalized/DASHBOARD.html`) — both exit 0.

## Summary

**1 venue verified + 1 evidenced blank** (backlog otherwise saturated — 10 further records newly classified this firing as not-a-venue/wrong-entity/no-location-data and flagged, the rest already flagged by prior firings). **4 artists verified (2 facebookUrl+bio, 1 facebookUrl-only, 1 genre-only top-up) + 11 evidenced blank** (one rejected as non-UK, one flagged as a probable open-mic misclassification, both surfaces tried throughout). Validator: 0 FAIL on the 14 gate-eligible artist records (one genre-only top-up excluded per standing precedent; one venue write excluded per standing precedent). Elapsed approximately 11 minutes (heartbeat 04:18:54Z → claim release 04:29:40Z), well inside the 40-minute budget. Circuit breaker did not fire; no hard stop encountered; Chrome was available and logged in throughout.
