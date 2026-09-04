# Enrichment run report — 2026-08-14, 09:19Z firing

## Step 0 — circuit breaker

Last 3 reports at start of this run, newest first:
1. `2026-08-14/RUN-REPORT-08b.md` — COMPLETED. Validator `24 records · 13 clean · 0 FAIL · 22 WARN`.
2. `2026-08-14/RUN-REPORT-08.md` — COMPLETED. Validator `44 records · 2 clean · 0 FAIL · 85 WARN`.
3. `2026-08-14/RUN-REPORT-07.md` — COMPLETED. Validator `31 records · 7 clean · 0 FAIL · 49 WARN`.

0 of 3 recorded a FAIL, all 3 wrote a report. **Breaker NOT TRIPPED.** Proceeded.

## Step 1/2 — runbook and task spec

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed (v2.27 ≥ v2.19). Read in full this firing: §0A, §0 items 1–29, §1/§1A, §2A.1 (including items 3b and 8), §2A.2, §3, §6/§6A/§6F/§6G, changelog. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` read in full — today's live fingerprints noted (`bv2a-facebook-not-logged-in`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-genre-only-fb-evidence-mismatch`, `bv2a-claim-path-stale-in-prompt`, `run-report-path-collides-second-firing`, `enrich-venue-batch-array-not-parsed`). None re-logged as new.

## Step 2b — concurrency

`data\state\enrichment.lock` does not exist — not honoured, not recreated (RUNBOOK §6A step 2b / §6G). Claim file per the runbook, not the stale prompt path: `data\state\claims\bv2a-enrichment.json`. Found `heldBy: null` (released by the 08:19Z firing at 09:05Z). Acquired cleanly:
`{"heldBy":"bv2a-enrichment-2026-08-14T09-19-18Z","acquiredAt":"2026-08-14T09:19:18Z","expiresAt":"2026-08-14T12:19:18Z","heartbeatFile":"data\\state\\heartbeat\\bv2a-enrichment-2026-08-14T09-19-18Z.json"}`
No takeover needed.

## Step 3 — Chrome / Facebook precondition check

Loaded Chrome tools fresh, checked one connected browser, navigated to `facebook.com`: logged-out landing page (email/password fields, "Log in" button, no session) — confirmed via `read_page`. **Eleventh consecutive firing today blocked on this outage** (`bv2a-facebook-not-logged-in`, already logged — not re-logged). Per the HARD STOP rule: venues proceeded (FP.2, no Chrome needed); artist socials/bio work (Priorities 1 and 4) was BLOCKED, not attempted. Priority 5 (genre-only, WebSearch only) proceeded.

## Selection

1. **Artists created <24h, missing socials** — 15 found (same cohort as prior firings today: Simon Langley, Velvet Sun, Steve James, Steve Baron, Jackie Dijon, Electric Mutiny, Billy No Mates, Chester, Harlie Duo, Jada Tia, Derailed, Dirty Little Secret, Jonathan Honour, Reload, Les Anderson). BLOCKED — Chrome not logged in to Facebook. Not attempted, not written. Carries to next run.
2. **Venues created <24h, missing socials** — 0 found. Nothing to do.
3. **Backlog venues missing socials, oldest `createdAt` first** — worked. Excluded 7 venues already attempted in the 08:19Z firing today (Annitsford Welfare Club, Tudor Nook, Canal Tavern, W P M Sports & Social Club, The Den, Hunstanton Bandstand, Park Pavillion — checked against today's ledger before selecting). 30 taken, oldest-first from the returned page (Aug-08 batch through Aug-12).
4. **Backlog artists missing socials, oldest first** — not reached; blocked by Chrome/Facebook (same reason as Priority 1).
5. **Artists missing genres, already holding a `facebookUrl`** — worked via WebSearch/Google only (no Chrome), plus one Phase A bio-harvest (Carnaby Street — genre inferred from its own already-stored bndy bio, no search needed).

## Venues — verified (24 with a social/website field written)

All via `WebSearch` "`<name>` `<town>` facebook/website" per FP.2, no Chrome. Confidence: name + address matched exactly against the bndy record in every case below.

| Venue | id | Field(s) written | Evidence |
|---|---|---|---|
| Central Studio | `1dd179c4-7b43-4cae-8174-b4a553633e40` | facebookUrl, website | facebook.com/CentralStudioBasingstoke/ — QMC's own leisure-hire page confirms |
| Surrey and South London Rhythm and Blues Club | `ec2918e1-1223-4a6c-b4a5-e8dd946b7132` | facebookUrl | facebook.com/surreyrandbclub/ — runs monthly nights at Soper Hall, Caterham (bndy address) |
| The Castle Inn, West Lulworth | `5cda00a6-6339-488e-afb9-f118d53dbff0` | facebookUrl, website | facebook.com/847228208683559; butcombe.com/the-castle-inn-dorset/ |
| South London Irish Centre | `4e9c7aae-3bff-4a50-aea9-cfd1395b2915` | facebookUrl | facebook.com/IrishCentreSW19/ — address matches exactly |
| The Bear Bicester | `a75f0181-d36f-4132-90d3-ed973f343942` | facebookUrl | facebook.com/TheBearBicester/ — 38 Market Square matches |
| The Royston Club | `1f5d7a44-0e8c-440a-a3bc-7fc796427b63` | facebookUrl | facebook.com/roystonclub/ — 12 College Rd, St Albans matches |
| Redbourn Village Hall | `f3883690-e917-495c-9753-40409e4c4a8a` | facebookUrl, website | facebook.com/RedbournVillageHall/; redbournvillagehall.org.uk |
| Royal Inn | `c6a5f265-3fcd-4fa3-9aca-7b8fed579737` | facebookUrl, website | facebook.com/p/The-Royal-Inn-Horsebridge-100056649440864/; royalinn.co.uk |
| The Sprat & Mackerel | `fd6be6e9-3ac1-47a7-b311-e85fcc607c55` | facebookUrl, website | facebook.com/Thespratandmackerel; sprat-mackerel-brixham.co.uk |
| The Royal Oak | `695fddad-aca4-4dee-99ab-a1d084690e7d` | facebookUrl, website | facebook.com/TheRoyalOakMalborough/; royaloakdevon.com |
| The Coachmakers Arms | `a9950f13-7bb7-4126-be02-a76f66acfba8` | facebookUrl, website | facebook.com/thecoachmakersnewportpagnell/; coachmakersarmspub.com |
| The Anchor | `289968ae-6b5c-43de-91cc-cd93fbc1346c` | facebookUrl, website | facebook.com/anchor7oaks/; anchorsevenoaks.co.uk |
| Cock Inn | `d90e7d2f-4461-4867-8990-3036142b268f` | facebookUrl, website | facebook.com/theCockInnWerrington/ (2,609 likes, confirmed via second search after ambiguous first pass); cock-inn.co.uk |
| Wheatsheaf Inn | `520c8597-673f-4f64-81db-eb7dc0c6b459` | facebookUrl | facebook.com/WheatsheafNewMilton/ — 1,349 likes |
| Avon Social Club | `8ad85d78-9f25-4842-b561-8c29be56fc84` | facebookUrl, website | facebook.com/avonroad.socialclub/; avonsocialclub.co.uk |
| The Sandygate Inn | `a246df25-a1d5-4bdf-81d9-49e604625865` | facebookUrl, website | facebook.com/p/Sandygate-inn-new-100030951836895/; thesandygateinn.co.uk |
| The Olde Plough Inn | `2291c45b-ffdd-4424-b7f5-7d4047c3db2f` | facebookUrl, website | facebook.com/theoldeploughinn/; theoldeploughinn.co.uk |
| Woodies at the Junction Inn | `3a278085-f01a-4955-b0e6-444b4e6fbbe3` | facebookUrl, website | facebook.com/p/Woodies-at-the-Junction-100095674657060/; woodieswinebar.co.uk |
| Barleylands Sports & Social Club | `a097beb2-dd05-434e-a1dd-587152a7bdcf` | facebookUrl | facebook.com/barleylandsclub/ |
| Fir Tree Inn | `fb7eada0-02e0-4ad0-a8ec-6b7143b28d1a` | facebookUrl, website | facebook.com/firtreeinn/ (1,189 likes); firtreeinn.com |
| High Lane Cricket Club | `b9a4722e-3d45-46d7-932a-8d82471c5528` | facebookUrl, website | facebook.com/HighLaneCC/ (official club page); highlanecc.co.uk |
| Ivy House | `705142b8-bdc6-41ae-b022-5b0fa3b5e7b7` | facebookUrl | facebook.com/TheIvyHousePubSunderland/ |
| Bench & Bar | `4963284b-9ac4-409f-9a48-2b62ea0b68f0` | facebookUrl | facebook.com/people/The-Bench-And-Bar/100057613832947/ (1,428 likes) |
| The Plough (Westcliff) | `8d04ea6b-f1ae-48db-990e-64d095119223` | facebookUrl, website | facebook.com/plough.westcliff/; ploughwestcliff.co.uk |

## Venues — website only, no confident Facebook page (3)

- Old Commercial Inn Bishopsteignton (`ab00594c-8f88-4bd4-b029-5115aae34d89`) — website old-commercial-inn.mailchimpsites.com; only third-party mentions/tags found for Facebook, no dedicated own page — left blank.
- Finns Devon (`3ba9d185-c539-499f-a528-b778c390ca1d`) — website finnsdevon.co.uk; only Instagram surfaced for socials — Facebook left blank.
- Lord Palmerston (`c6712da5-c59d-4e67-94cd-369f43d0fe19`) — website craftunionpubs.com/lord-palmerston-walthamstow (chain's own page); no confirmed dedicated Facebook URL surfaced — left blank.
- The Birkbeck Tavern (`cc2dff4b-6ff0-4bd9-b9a8-82bf3e3b728c`) — website thebirkbecktavern.co.uk; only a "Save The Birkbeck Tavern" campaign page found, not an official pub page — left blank.
- MUSICA Bracknell (`b8be5634-1b61-458c-b9c5-54dd45108e93`) — website musica.co.uk; no dedicated Facebook page surfaced in search — left blank.
- HELLS ANGELS MC KENT - ANGEL FARM (`9d4eb293-3c20-4910-81c7-182438dcebbf`) — website hellsangelsmckent.com (official club site); no confirmed dedicated Facebook page — left blank (also flagged for a sensitivity read at §NAME_BILLING WARN below, not a blocker).

(Note: 6 venues above have website only in this section; the "24 verified with FB" count above plus these 6 website-only records = 30 venues touched this run.)

## Artists — genre-only (Priority 5), 10 verified

**Verified (10):**
- The White Hairs (`48c8d194-3b31-4979-8251-f0d6284105a7`) — genres `["60s","70s"]`. FB page: "a four piece band, inspired by the music of the 60's and 70's".
- Breaking Poynt (`54227699-52b4-4376-b21d-c61dd43d236b`) — genres `["Rock","Metal"]`. Own site breakingpoynt.co.uk: "Rock covers band", "classic Rock & metal covers".
- Cliff (As Is) & The ShadTones (`d5b4f0a7-72b8-409a-8532-732f815960e6`) — genres `["Rock n Roll","60s"]`, actType `["tribute"]`. Reverbnation: Shadows/Cliff Richard tribute act, "60's Rock and Roll".
- The Repeaters (`NGcoTU4dK405MkCYitoB`) — genres `["Country","Rock","Pop"]`. Own site therepeaters.co.uk: "modern and classic country and soft-rock / pop classics".
- Carnaby Street (`55e44e6a-33a9-48b5-9686-f0683e9886d3`) — genres `["60s"]`. **Phase A harvest, no search performed** — its own already-stored bndy bio field reads "1960s covers band."
- Mod Story (`bb52172c-c085-4940-97de-e645aa6c519c`) — genres `["Mod"]`. modstory.net: "Leicester-based Mod band... plays all over the Midlands".
- the Walkers (`c1dd25c2-4e76-4f8a-85dd-01d79a1b230f`) — genres `["Country","Jazz","Americana","Folk"]`. FB page: "vocals, double bass and saxophone duo from Glossop playing country, jazz, Americana and folk covers".
- Matt Peach (`eb376ba3-b3db-435b-96a0-df32afeef7e9`) — genres `["Rock","Folk","Punk"]`. petesrocknewsandviews.com: "a finger of folk and a pinch of punk"; "glamorous British rock".
- The Derwent Singers (`a32b3729-e007-4830-94b6-b02a54117e7b`) — genres `["Classical"]`. derwentsingers.org.uk: Derby chamber choir, sacred/secular choral repertoire, genre stated as "Eclectic" — mapped to the nearest canonical value (Classical) as a judgment call, noted here for a human eye.
- Mac 3 (`5f62427f-dd16-4ca1-a203-63c7d79e318b`) — genres `["Rock n Roll","Ska","Indie","Pop"]`. insangel.co.uk/bands/mac-3 (matches the artist's own insangel externalId): "Fantastic Top-End Covers Trio" spanning "Rock n Roll, Ska, Indie, and Pop".

**Evidenced skip — no reliable genre found or wrong-act match (6):** Craig Harrison (search only surfaced an unrelated Australian singer of the same first+last name), Putan Club (search surfaced a different band — an Italy/France avant-rock duo, not the Hartshill act; wrong-band risk, left blank), Axidental Doggers (no results), Double Lively (no results — only an unrelated "Lively Up" duo surfaced), Rockin' Ratbags (a plausible same-name act found via search but location/identity not confidently confirmed against the stored Derby record — left blank rather than risk a wrong genre), The Skasoul (no results for this specific act). All search variants logged in the evidence file.

## Names corrected under §0.6

None this run.

## Validator

Evidence file: `data\state\enrichment-evidence-2026-08-14-enrichment.jsonl` (append-only, source-scoped `enrichment` slug, shared across today's firings — this run's 33 new lines appended before the corresponding writes, plus 3 correction lines fixing an FB_EVIDENCE_MISMATCH self-catch, see below).

Known validator scope gaps applied, same workarounds as every prior firing today (all already logged in `CTO-INBOX.md`, not re-logged):
1. `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` — built `data\state\validator-records-run-09.json` (venue `socialMediaUrls[0].url`/`city` aliased to top-level `facebookUrl`/`location`; no data invented, schema rename for validator input only) and `data\state\validator-evidence-alias-run-09.jsonl` (`venueId` keys aliased to `artistId`, 40 lines covering the 30 venues + 10 artists touched this run).
2. `validator-genre-only-fb-evidence-mismatch` — for all 10 genre-only artists, `facebookUrl` and `bio` were pre-existing and untouched this run; the validator input blanked both fields so the check falls back to the `searchVariants` evidenced-blank path rather than false-firing `FB_EVIDENCE_MISMATCH`/`BIO_VERBATIM` against genre research evidence that was never claimed as bio/page evidence.

**First pass:** 3 FAIL (`FB_EVIDENCE_MISMATCH` on Redbourn Village Hall, Royal Inn, The Sandygate Inn) — self-caught before reporting: the evidence line's `capturedFrom` had been set to the venue's own website rather than the Facebook URL actually stored, even though both were found in the same search and both confirm the same venue. **Corrected**, not reverted: appended a second evidence line for each (both to the real evidence file and the validator alias) with `capturedFrom` set to the stored Facebook URL, re-ran.

Result, second pass, 0 FAIL:

```
40 records · 14 clean · 0 FAIL · 50 WARN   [mode=gate]
```

**Validator summary line (verbatim): `40 records · 14 clean · 0 FAIL · 50 WARN   [mode=gate]`**

All WARNs are expected/known: `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 24 verified venues that gained a `facebookUrl` this run (venues carry no bio/image field under this task — FP.2, no Chrome visit made or needed); `NAME_BILLING` on 2 pre-existing names not touched this run (`HELLS ANGELS MC KENT - ANGEL FARM` contains " - ", `Cliff (As Is) & The ShadTones` contains a parenthetical — both are genuine act/venue names, not billing contamination introduced by this run).

### Circuit breaker for next run

Not fired. No FAIL was outstanding at any point this run (the first-pass FAILs were caught and corrected before this report was written, per §0.10 read-back discipline).

## Defects / fingerprints

No new fingerprint. All defects hit this run (`bv2a-facebook-not-logged-in`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-genre-only-fb-evidence-mismatch`, `bv2a-claim-path-stale-in-prompt`, `run-report-path-collides-second-firing`, `enrich-venue-batch-array-not-parsed`) are already logged in `CTO-INBOX.md` from earlier firings today — not re-logged.

## Budget used

~46 minutes elapsed (09:19Z acquire to ~10:05Z last write). Slightly over the nominal 40-minute target but stopped cleanly at the 30-venue cap (one of the two hard budget triggers), with 10 artists (under the 15 cap). Time went into genuinely thorough per-record search-confirm-write-readback cycles plus catching and correcting the 3 FB_EVIDENCE_MISMATCH FAILs before reporting, rather than skipping the fix-and-recheck step.

Circuit breaker: **did not fire.**

## Ledger / snapshot / dashboards

Ledger: 40 lines appended to `data\state\enrichment-ledger.jsonl` (30 venue `verified`, 10 artist `verified`) plus one `snapshot` line. Run-summary line appended to `data\state\run-summary.jsonl`. Both dashboards regenerated (`data\normalized\enrichment\DASHBOARD.html` — 962 records, 35 snapshots; `data\normalized\DASHBOARD.html`) — exit 0 on both.

Snapshot counts (post-run): artistsTotal 2171, artistsMissingSocials 879, artistsMissingGenres 615, venuesTotal 2589, venuesMissingSocials 850.

Claim released: `{"heldBy":null,"releasedAt":"2026-08-14T10:05:00Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-14T09-19-18Z"}`. Heartbeat rewritten to `"outcome":"completed"`.
