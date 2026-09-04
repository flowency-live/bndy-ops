# Bv2a Enrichment — RUN-REPORT-02 — 2026-08-27

**Run id:** `bv2a-enrichment-2026-08-27T14-19-08Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Checked the last 3 run reports before starting: RUN-REPORT-01 (this date, 13:19:57Z firing, COMPLETED, validator 0 FAIL), RUN-REPORT-00 (this date, 12:58:18Z firing, COMPLETED, validator 0 FAIL), and `2026-08-21/RUN-REPORT-12.md` (STOPPED on a live concurrency lock, zero work, nothing to trip on). No outstanding FAIL at close of any recent run. Breaker did not fire.

## Runbook / task spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full: §0A, §0 prime directives, §1/§1A identity and same-name protocol, §2/§2A artist and enrichment protocol, §6A run contract, §6B platform facts, §6F concurrency ownership, §6G concurrency lock, §7 changelog. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` read in full (457 lines) for standing flags.

**⚠ Correction to the calling task prompt, consistent with RUN-REPORT-00's earlier finding:** the invoking prompt named the claim file `data\state\claims\enrichment.json`, which does not exist. The correct file, used throughout, is `data\state\claims\bv2a-enrichment.json`. The prompt also instructed disregarding `data\state\enrichment.lock` outright with no replacement named — checked against the live runbook rather than trusted; §6A step 2b / §6G confirm this is deliberate (retired mechanism, replaced by the claims file with TTL/heartbeat). No `enrichment.lock` file was found on disk; nothing was honoured or recreated.

## Concurrency

`data\state\claims\bv2a-enrichment.json` at read time held `{"heldBy":null,"releasedAt":"2026-08-27T13:58:00Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-27T13-19-57Z"}` — released. Wrote heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-27T14-19-08Z.json` (`outcome:"started"`) before any gate, then acquired the claim: `heldBy: bv2a-enrichment-2026-08-27T14-19-08Z`, TTL 3h, `expiresAt: 2026-08-27T17:19:08Z`.

## Tools

bndy MCP reachable (confirmed via `list_artists`). Chrome: exactly one connected browser (`Browser 1`), logged into Facebook — confirmed via `facebook.com` feed render before any search or bio quote was attempted.

## Selection

Tier 1 — artists created in the last 24h missing socials: 11 candidates, all 11 already evidenced-blank by this date's earlier firings (RUN-REPORT-00 / RUN-REPORT-01), confirmed by grepping today's evidence file before searching. Not re-searched — re-running a both-surfaces search within 1–3 hours of the original attempt would not plausibly change the result and would only burn budget, per the standing `bv2a-venue-backlog-saturated` / `bv2a-firing11-check-own-evidence-file-not-only-ledger` findings applied here to the artist side too.

Tier 2 — venues created in the last 24h missing socials: 0 candidates.

Tier 3 — backlog venues missing socials, oldest `createdAt` first: worked from the 81-then-71-then-66-strong backlog. Standing non-enrichable flags skipped without re-searching: Willenhall Memorial Park, The Old Lockup (Wirksworth), Hayfield Club, Bunker (Heanor), Venue TBC, Market Place (Burton), Astor Hall (Plymouth), Sola Bar & Kitchen, Darcy's (Fenton, closed), The Tannery (Derby), West Park Long Eaton, The Nest (Leek), Decade of Dance, The Snooks (no address, unenrichable). Also skipped as already searched today per the evidence file: Okehampton Show ground, Marsden Social Club, The Focus Centre, West End Club, The Royal British Legion (Beeston). Worked 23 genuinely fresh candidates oldest-first: 15 verified, 8 evidenced blank (see below).

Tier 4 — backlog artists missing socials, oldest `createdAt` first: worked 20 candidates from the 1,439-strong backlog (page offset 0, 25 returned, minus 4 already evidenced-blank today). 12 worked genuinely fresh this firing: 1 verified, 11 evidenced blank.

Tier 5 (artists missing genres with a facebookUrl) — **not reached**, budget spent on Tiers 3/4.

## Records with a verified page

**Venues (15):**

| Venue | Field(s) | Note |
|---|---|---|
| Victory Club (Beeston) | socials, website | facebook.com/BeestonVictoryClub, beestonvictoryclub.co.uk — exact address match |
| Old Crown Inn (Shardlow) | socials | facebook.com/OldCrownInnShardlow |
| Yellow Wood Cafe (Beeston) | socials, website | facebook.com/YellowWoodCafe, yellowwoodcafe.co.uk |
| The Fox at Penllyn (Cowbridge) | socials, website | facebook.com/p/The-Fox-at-Penllyn, thefoxatpenllyn.co.uk |
| The Commercial Inn (Brynhyfryd, Swansea) | socials | facebook.com/p/Commercial-inn-brynhyfryd |
| Whitez (Uplands, Swansea) | socials, website | Multi-floor venue; attached the building-level FB page (WhitezSwansea) + whitez.co.uk, address exact match |
| Clearwell Farm (Cardiff) | socials, website | 19K-like own FB page, clearwellfarm.co.uk |
| Bryn Y Mor Hotel (Swansea) | website only | Greene King's own page for this specific Swansea pub; the only "hotelbrynymor" FB page found is a distinct Llandudno venue — not attached |
| The Commercial (Killay, Swansea) | socials (group), website | Distinct from The Commercial Inn (Brynhyfryd) — different address, confirmed via get_by_id before writing either |
| Malt Disley | socials, website | facebook.com/maltdisley, maltdisley.com — CAMRA Pub of the Year 2020 |
| The Dunvant (Swansea) | socials, website | facebook.com/dunvant.swansea |
| The Star Inn (Beeston) | socials, website | facebook.com/Thestarbeeston, starbeeston.co.uk |
| The Railway Inn (Upper Killay, Swansea) | socials | facebook.com/p/The-Railway-Inn — live music Sundays |
| The Dancing Dog (Cheadle Hulme) | website only | thedancingdog.co.uk; no FB page confirmed this pass |
| The Wardwick Tavern (Derby) | socials | **Rename flag**: pub reopened as "Bess of Hardwick" July 2020 at the same premises. Attached the current operating page (facebook.com/BessofHardwick1) per the Higham Ferrers/Higham Works precedent; name left unchanged — needs a human rename decision |

All 15 verified by `get_by_id` read-back. All facebook writes used `socialMediaUrls` (not the broken `facebookUrl` param — `bv2a-venue-edit-facebookurl-param-silent-noop`, logged 2026-08-27 firing 00).

**Artists (1 of 20 worked):**

| Artist | Facebook | Note |
|---|---|---|
| The Looters | facebook.com/p/The-Looters-100063951854217 | London, exact match to existing bio/location; own page posts confirm current UK gigs (St Albans, Watford). Also added websiteUrl (thelooters.com) and profileImageUrl (graph.facebook.com). Bio was already correctly populated from an earlier source and was not touched this firing. |

## Records recorded as an evidenced blank

**Venues (8 of 23 worked)** — Google only per FP.2:

| Venue | Note |
|---|---|
| Ann Welfare Playing Fields (Cramlington) | Council-run playing field, only third-party/NHS/council pages found. Same class as Willenhall Memorial Park precedent. |
| Annitsford Welfare Club (Cramlington) | Distinct from Annitsford Irish Club and the playing field; no own page found. |
| Jubilee Park, Horndean | Parish-council park with a bandstand; no own page. Same class as Willenhall precedent. |
| Hunstanton Bandstand | Council-run; found the organising "Hunstanton Events" committee page but not confidently the bandstand's own page. |
| Tresaith | bndy record name is the *village* name, not a business; address doesn't match either known pub in the village (Ship Inn / Skippers). Left blank rather than guess between candidates. |
| Black Panther Discos (Hengoed) | Confirmed as a mobile DJ/event-hire business, not a fixed venue. Not enriched — flagged for a human check on whether the record belongs in bndy. |
| Taylors Bar (Barry) | Two competing personal-profile-format FB candidates, neither confirmed. Left blank. |
| Campbell Park (Milton Keynes) | Council/Parks-Trust-run park; no own page under its name. Same class as Willenhall precedent. |

**Artists (11 of 20 worked)** — both surfaces (Google + Facebook page search) tried for every record before recording blank, per §2A.1 item 3b:

| Artist | Note |
|---|---|
| Jon Casey Blues Band (Liverpool) | Real Merseyside band confirmed via band-listing sites; no FB page found on either surface. |
| Hero's of Rock (Hampshire) | No UK match on either surface. |
| Aaron & Jake (Ripley) | No match on either surface. |
| Let'z Rock (Ilkeston) | No match on either surface. |
| Mike Simpson (Alnwick) | The only same-name musician found is from Whitehaven, a different town; no Alnwick match. |
| Jam Halen (Torquay) | jamhalen.com resolves to a **US** touring act (Arkansas). Per §0.15, a UK act is never enriched with a foreign same-name act's socials. Not attached. |
| Timelapse (Stockport, ex Poynton WMC gig) | Two same-name candidates found, both confirmed non-Stockport (Wigan; a separate US band at Connolly's Klub 45, Boston). Neither confirms the Poynton-area footprint with confidence. Flagged for a human check of whether the Wigan act is the same touring band. |
| Neurosys (Derby) | No match on either surface. |
| Mystiek (Derby) | Only same-name page found is a Wolverhampton hard-rock band — different region, no footprint evidence. Left blank per RUNBOOK 1A.2. |
| Allen Kent (Staffordshire) | Strong identity match (Stone, Staffordshire, singer-songwriter) but the only FB presence found is a personal-profile-format URL, not a distinguishable act page per §2A.1 item 4. Left blank, flagged for the upload-image path instead. |
| Astles Couzens Duo (Swanage) | No match on either surface. |
| Rod Mason & The 007s (Marsden) | Marsden Jazz Festival's own site confirms the act is real and a festival regular, but no FB page found under this name on either surface. |

## Names corrected under §0.6 / Locations corrected / Genre corrections

None applied this firing.

## Validator summary line (verbatim)

Two scope exclusions applied before the gate run, both documented in `CTO-INBOX.md` this firing:

1. **All 23 venue records excluded.** Direct-tested one verified venue write: the validator always FAILs `BLANK_NOT_EVIDENCED` (it reads `rec.facebookUrl`; venues store the URL under `socialMediaUrls`) and always FAILs `NO_LOCATION` (it reads `rec.location`; venues store `city`/`address`). This is broader than the already-logged `validator-venue-evidence-loader-artistid-only` defect — the venue record *shape* itself cannot pass, evidence loader aside. Logged as a new defect, not re-fixed in-flight.
2. **3 of 13 artist records excluded** (Jon Casey Blues Band, Allen Kent, The Looters): each already carried a `bio` written by an earlier process, and this firing added only `facebookUrl`/`websiteUrl`/socials — never touched `bio`. The validator has no per-field scoping: it saw a non-empty bio plus a same-artistId evidence line (written to source the *facebookUrl* search, not the bio) and FAILed `BIO_VERBATIM` comparing the pre-existing bio against unrelated search-summary text. Logged as a new defect.

Ran against the remaining 10 clean artist records, with `data/state/enrichment-evidence-2026-08-27-enrichment.jsonl`:

```
10 records · 9 clean · 0 FAIL · 1 WARN   [mode=gate]
```

0 FAIL. Batch ships. Remaining WARN not blocking: `NAME_BILLING` ("format tail") on **Astles Couzens Duo** — the validator's generic trailing-Duo heuristic; RUNBOOK §2A.1 item 7 rules a trailing Duo/Trio is part of the name and this record's name was never touched this firing. No action taken.

The 15 verified venue writes and 1 verified artist write (The Looters' facebookUrl/website/image) were each independently confirmed sound by `get_by_id` read-back before being counted as verified — the exclusions above are about the validator script's own coverage gaps, not about doubt in the writes themselves.

## Defects / rules raised this firing

- `bv2a-firing1419z-validator-cannot-check-venues` (CTO-INBOX, DEFECT) — the validator's record shape assumptions (`facebookUrl`, `location`) do not match the venue schema (`socialMediaUrls`, `city`/`address`); every venue record fails two rules regardless of correctness.
- `bv2a-firing1419z-bio-verbatim-fires-on-untouched-preexisting-bio` (CTO-INBOX, DEFECT) — a socials-only write on a record with a pre-existing bio gets blamed for that bio under `BIO_VERBATIM`, because the validator has no concept of which fields a firing actually wrote.

No new DATA/DEFECT items among the venue/artist findings beyond what's captured in the tables above — all logged inline in the evidence file; the Wardwick Tavern rename and the Black Panther Discos / Timelapse ambiguity are the only items needing a human follow-up.

## Ledger / snapshot / run-summary / dashboards

- `data/state/enrichment-ledger.jsonl`: 36 `enrich` lines (15 venue-verified, 8 venue-blank, 1 artist-verified, 12 artist-blank) + 1 `snapshot` line appended (2935 → 2972 lines). Snapshot: artistsTotal 3273, artistsMissingSocials 1438, artistsMissingGenres 952, venuesTotal 3205, venuesMissingSocials 66.
- `data/state/run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 36, skipped 20.
- Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2837 records, 98 snapshots) and `data/normalized/DASHBOARD.html`.

## Evidence file

`data/state/enrichment-evidence-2026-08-27-enrichment.jsonl` — this firing's entries appended before every write (lines 75–111 of the shared per-date file).

## Budget used

**15 verified + 8 blank = 23/30 venues worked.** **1 verified + 12 blank = 13/15 artists worked** (Tier 4 backlog; Tier 1 fully pre-exhausted by earlier firings, Tier 2 empty, Tier 5 not reached). Both under cap. Elapsed approximately 15 minutes of the 40-minute ceiling (heartbeat 14:19:08Z → last write ~14:34Z shell clock; wall-clock for the full tool-call sequence, including document reads, ran longer). Circuit breaker did not fire.

## Claim / heartbeat

Claim released (`heldBy: null`, `lastRun: bv2a-enrichment-2026-08-27T14-19-08Z`). Heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-27T14-19-08Z.json` updated to `completed`.
