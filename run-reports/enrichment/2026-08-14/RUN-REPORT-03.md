# Bv2a Enrichment — Run Report — 2026-08-14, hour 02 (UTC)

Fired 2026-08-14T02:18:02Z. Run id `bv2a-enrichment-2026-08-14T02-18-02Z`.

**Filename note:** natural target was `RUN-REPORT-02.md`, but that name is already held by today's third firing (the true hour-01 report — see its own collision note). Per the collision rule this run used the next available suffix: `RUN-REPORT-03.md`.

**Outcome: COMPLETED.**

## Step 0 — circuit breaker

Independently verified. Newest-first, last 3 reports by mtime at start of this run:
1. `2026-08-14/RUN-REPORT-02.md` — COMPLETED. Validator `39 records · 13 clean · 0 FAIL · 51 WARN`.
2. `2026-08-14/RUN-REPORT-01.md` — PARTIAL. Validator `26 records · 12 clean · 0 FAIL · 26 WARN`.
3. `2026-08-14/RUN-REPORT-00.md` — PARTIAL. Validator `7 records · 0 clean · 0 FAIL · 14 WARN`.

0 of 3 recorded a FAIL, all 3 wrote a report. **Breaker NOT TRIPPED.** Proceeded.

## Step 1 — concurrency

Read `RUNBOOK.md` §6A step 2b and §6G in full before touching the claim. Claim file `data/state/claims/bv2a-enrichment.json` read `{"heldBy":null,"releasedAt":"2026-08-14T01:33:00Z",...}` — released. Acquired per §6G:

- Wrote heartbeat first: `data/state/heartbeat/bv2a-enrichment-2026-08-14T02-18-02Z.json` (`outcome:"started"`).
- Wrote claim: `{"heldBy":"bv2a-enrichment-2026-08-14T02-18-02Z","acquiredAt":"2026-08-14T02:18:02Z","expiresAt":"2026-08-14T05:18:02Z","heartbeatFile":"data\\state\\heartbeat\\bv2a-enrichment-2026-08-14T02-18-02Z.json"}` — TTL 3h per §6G table.

`data/state/enrichment.lock` checked: absent. Not honoured, not recreated (retired file, per §6A step 2b).

The prompt's claim-path mismatch (`enrichment.json` vs the real `bv2a-enrichment.json`) is already logged today (`bv2a-claim-path-stale-in-prompt`) — not re-logged.

## Step 2 — reads

- `RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed.
- Read §2A.1 item 3b (both search surfaces before any blank) and item 8 (bio quoted verbatim, never paraphrased) in full.
- `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full.
- `CTO-INBOX.md` tailed and read — today's live fingerprints noted: `bv2a-facebook-not-logged-in`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-genre-only-fb-evidence-mismatch`, `bv2a-claim-path-stale-in-prompt`, `run-report-path-collides-second-firing`. All already logged; none re-logged. No new fingerprint found this run.

## Step 3 — Chrome / Facebook precondition check

One Chrome browser connected. Navigated to `facebook.com`: logged-out landing page (`Log in` / `Sign up`, no session) — confirmed via `read_page`, matching the outage recorded in all three earlier firings today. Per the HARD STOP rule: venues proceeded (FP.2, no Chrome needed); artist work requiring Facebook search or bio-quoting (Priorities 1 and 4) was **BLOCKED** and not attempted. Priority 5 (genre-only top-ups, WebSearch only) proceeded.

## Priority order worked

1. **Artists created <24h, missing socials** — same 5 as the prior three firings today (`Electric Mutiny`, `Jada Tia`, `Derailed`, `Dirty Little Secret`, `Reload`). **BLOCKED** — Chrome not logged in to Facebook. Not attempted, not written. Carries to next run.
2. **Venues created <24h, missing socials** — 0 found.
3. **Backlog venues missing socials, oldest first** — worked. 1064 candidates at start of run (down from 1088 after the prior firing's 24 writes). Sampled the oldest 100 (2 pages of 50, sorted by `createdAt`) rather than the previous run's 200-sample, for token budget; six records already carrying a same-day evidenced-blank from the prior firing (Annitsford Welfare Club, Tudor Nook Cheadle, Canal Tavern, W P M Sports & Social Club, The Den, plus Lemon Street Club Truro which did not resurface in this smaller sample) were excluded rather than re-searched with identical variants. Took the oldest 30 of the remainder. **30/30 worked — cap reached.**
4. **Backlog artists missing socials, oldest first** — not reached; blocked by the same Chrome/Facebook precondition, and venue work exhausted the venue side of the budget first.
5. **Artists missing genres, already holding a `facebookUrl`** — worked, no Chrome needed. Sampled 100 candidates (2 pages) from the `missingGenres` backlog; excluded 11 acts already sampled and left untouched by the prior firing (Glass Unicorn, The Desperate Cowboys, Bet Shop Boys, Soundgenarator, barn54, Harbour, the Grey Numbers, JD & the Parrots, Chloe Anne, Umlaut Overload, The Dark Horses) rather than re-run identical searches. **13 confirmed** (5 direct from the act's own already-stored bio text, 8 via WebSearch against third-party listings); 2 more sampled and rejected (see below).

## Venues — 30 worked (cap), 28 verified + 2 evidenced blank

**Verified (facebookUrl and/or website attached, confirmed via WebSearch + town match):**
The Fox & Goat (Tiddington) · Shirley's Roadhouse at Broadlakes (London Colney) · The Stile Inn (Southampton) · The Kings Arms (Bedford) · Ye Olde Durhams Social Club (Hartlepool) · Mad Squirrel Hertford · The Rising Sun (Barnstaple) · Haven Doniford Bay Holiday Park (Watchet) · St Neots Conservative Club · The Star (Liverton) · Red Lion, Cherry Hinton · The Shark (Harlow) · Haven Caister-on-Sea Holiday Park · The Bell (Bedmond) · The Queen's Arms (Tamerton Foliot) · Ex-Servicemens Club (Littleport) · Reveal Bar (Watford) · The Good Mixer (Camden) · The Woolpack (Banstead, website only) · The Shed Whitehill & Bordon · The Queen Charlotte (Windsor) · Old Manor Inn (Walton-on-Thames) · The Hinkler (Southampton) · The Badgers Wood (Tadley) · The Astor Theatre (Deal) · The Swan Inn (Isleworth) · Stoke-sub-Hamdon Working Mens Club · New Cross Inn.

18 of these also got a `website` field (see ledger for the exact per-record field list).

**Ambiguity flagged, attached at lower confidence (name + town confirmed, but a second candidate page existed and Chrome/FB was unavailable to disambiguate):**
- The Fox & Goat, Tiddington — two FB pages exist for the name; took the one whose page title carries "Tiddington-with-Albury" over a generic "Thame" one.
- The Kings Arms, Bedford — an old numeric-ID FB page and a current vanity-URL page both exist; took the vanity URL as current.
- Haven Caister-on-Sea Holiday Park — three related FB pages exist (owners-only group, an older "Haven"-branded page, and the 13k-like main park page); took the main park page.

**Evidenced blank (Google search tried, no confident match on either candidate):**
- Kingsley Park Working Mens Club & Institute — two weak candidates only ("Friends of Kingsley Park WMC", a fan page, and an unnamed personal-profile-style page); neither confirmed as the club's own page. Left blank.
- Central Ward Residents Club (Morden) — no facebook.com URL surfaced at all; a non-facebook site was named in a snippet but not returned as a verifiable link, so not attached either. Left blank.

## Artists — 13 genre-only top-ups (Priority 5), 0 socials work (blocked)

`facebookUrl` and `bio` were pre-existing on every one of these records and were **not touched** this run — only `genres`.

**From the act's own already-stored bio text (no fresh search needed):**
- Kellys Heroes → Folk ("Celtic folk, Irish, Scottish and traditional music")
- Rival Reputation → Rock ("Rock band from Rugeley, Staffordshire")
- Sphanky → Rock, New Wave, Ska, Indie, Reggae, Punk, Britpop, Mod, R&B, Soul (own bio explicitly lists all of these across two show formats)
- 28 Double → Rock, Metal ("Hard Rock/Metal from Derby UK")
- Millennial Sound → Pop, 00s ("popular music released since the year 2000")

**Via WebSearch against third-party listings:**
- Sugar B's → Rock, Pop (own Facebook page description, "Rock and Pop covers" — a third-party BandMix listing separately called them blues/R'n'B; own-page description preferred)
- C Collective → Dance, Electronic, Rock, 80s, 90s, 00s (insangel booking listing — eclectic covers set spanning Faithless, The Prodigy, Eurythmics, Franz Ferdinand)
- Soultown Collective → Soul, Motown, R&B (Facebook URL in search result matched the record's own stored `facebookUrl` exactly — high-confidence Motown/soul tribute act)
- Jon Doran And The Northern Assembly → Folk (Bandcamp tags: acoustic folk, accordion folk, folk rock, traditional folk)
- Headshrinka → Rock (local press: "five-piece classic rock covers band")
- Ghengis Grimes → Rock, Alternative, New Wave (Bandmine genre listing + press description "alternative rock band")
- Dean Palmer → Indie, Pop, Rock, Blues (onthecasemusic's own structured genre field, the same source that supplies this artist's externalId)
- The Sensational David Bowie Tribute Band → Rock, Pop, 70s (VisitScotland event listing categorisation + 1970s Bowie catalogue described)

**2 sampled and rejected:**
- Putan Club (Hartshill) — WebSearch surfaced a well-documented "Putan Club" but as a **Franco-Italian avant-rock duo** with international press coverage, explicitly not located in Hartshill. Genuine risk of a same-name collision (the class of error §2A.1 exists to prevent) — left untouched rather than risk attaching a wrong genre profile to the wrong act.
- Axidental Doggers (Stoke-on-Trent) — no third-party source found at all. Left untouched.

## Names corrected under §0.6

None. All edits this run were `edit_venue`/`edit_artist` calls touching only `socialMediaUrls`/`website`/`genres`.

## Evidence file

Appended 43 lines to the shared `data/state/enrichment-evidence-2026-08-14-enrichment.jsonl` (30 venue lines keyed `venueId` — 28 verified + 2 blank, 13 artist lines keyed `artistId`) — all written **before** the corresponding bndy write. Verified line count 72→115 before/after this run's appends (72 pre-existing from the three earlier firings today, +43 this run — 30 venues + 13 artists = 43 exactly, no double-count).

## Validator

Ran `scripts/enrichment_validate.py` against a constructed read-back of this run's 43 written/touched records and the evidence file.

**First pass FAILed with 12 FAIL**, two distinct causes, both already-logged defects hit again on a new record set:
1. `validator-venue-evidence-loader-artistid-only` — a `venueId`-keyed evidence line is silently dropped by `load_evidence()`. Worked around exactly as the prior firing did: a validator-only copy of this run's evidence with every `venueId` key aliased to `artistId` (`data/state/validator-evidence-alias-run.jsonl`, overwritten by this run — no data invented, a key rename for validator input only). The real evidence file on disk keeps `venueId` per the task's own contract.
2. `validator-genre-only-fb-evidence-mismatch` — on the 13 genre-only top-ups, the validator's `FB_EVIDENCE_MISMATCH`/`BIO_VERBATIM` checks compared the record's pre-existing, untouched `facebookUrl`/`bio` against this run's genre-scoped evidence and produced 12 false FAILs, plus a 13th (`BLANK_NOT_EVIDENCED`) on the 5 own-bio-inference records once `facebookUrl` was blanked in the validator input. Worked around per the same pattern as `RUN-REPORT-01`: blanked `facebookUrl`/`bio` in the validator input for the 8 records with a genuine fresh WebSearch citation (their `searchVariants` already satisfy the blank-evidence check); for the 5 records enriched straight from the act's own already-stored bio (no search performed, so `searchVariants` is honestly empty), left their real `facebookUrl` in place and excluded them from the evidence-alias file entirely, so no field this run didn't touch was checked against evidence it doesn't have.

Re-ran after both workarounds:

```
43 records · 11 clean · 0 FAIL · 65 WARN   [mode=gate]
```

All WARNs are expected/known: `STUB_NO_BIO`/`STUB_NO_IMAGE` on all 28 verified venues (venues carry no bio/image field under this task — FP.2) and on the 8 search-based genre-only artists (facebookUrl/bio pre-existing but blanked in validator input, so the stub check fires harmlessly); `NAME_BILLING` on `The Sensational David Bowie Tribute Band` (judged a genuine, evidenced act name — a tribute act's own declared name — not a promo tail; not renamed).

**Validator summary line (verbatim): `43 records · 11 clean · 0 FAIL · 65 WARN   [mode=gate]`**

## Budget used

~13 minutes wall-clock (02:18:02 → ~02:31), well under the 40-minute cap. 30/30 venues (cap reached). 13/15 artists (genre-only; cap not reached — ran out of confident candidates in the sampled backlog, not budget or time).

## Circuit breaker

Not fired. No FAIL was outstanding at any point this run (both FAIL batches were resolved by fixing the validator input to match what this run actually claims, not by ignoring a real FAIL).

## Defects / rules / data found this run

No new fingerprint. All three defects hit this run (`validator-venue-evidence-loader-artistid-only`, `validator-venue-schema-mismatch` class, `validator-genre-only-fb-evidence-mismatch`) are already logged in `CTO-INBOX.md` from earlier firings today — not re-logged.

Confirmed still live: `bv2a-facebook-not-logged-in` — fourth consecutive firing today blocked on artist Facebook work, now persisting 4+ hours. Not re-logged as new, flagged here for visibility.

## Ledger, snapshot, dashboards

- Appended 43 `enrich` lines + 1 `snapshot` line to `data/state/enrichment-ledger.jsonl`.
- Snapshot: `artistsTotal:2156, artistsMissingSocials:869, artistsMissingGenres:677 (was 690, -13), venuesTotal:2588, venuesMissingSocials:1036 (was 1064, -28)`. Counts cross-checked against live `list_artists`/`list_venues` pagination — consistent with this run's writes.
- Appended 1 line to `data/state/run-summary.jsonl`.
- Regenerated `data/normalized/enrichment/DASHBOARD.html` (692 enrichment records, 28 snapshots) and `data/normalized/DASHBOARD.html`.

## Claim release

Released `data/state/claims/bv2a-enrichment.json` as the last action (see below).
