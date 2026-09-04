# Bv2a Enrichment — Run Report — 2026-08-14, hour 01 (UTC)

Fired 2026-08-14T01:19:09Z. Run id `bv2a-enrichment-2026-08-14T01-19-09Z`.

**Filename note:** natural target was `RUN-REPORT-01.md`, but that name is already held by the second hour-00 firing (a collision-suffix name, not a true hour-01 report — see its own note). Per the collision rule this run used the next available suffix: `RUN-REPORT-02.md`.

**Outcome: COMPLETED.**

## Step 0 — circuit breaker

Independently re-verified (not just trusted the pre-check). Newest-first, last 3 reports by mtime:
1. `2026-08-14/RUN-REPORT-01.md` — COMPLETED. Validator `26 records · 12 clean · 0 FAIL · 26 WARN`.
2. `2026-08-14/RUN-REPORT-00.md` — PARTIAL. Validator `7 records · 0 clean · 0 FAIL · 14 WARN`.
3. `2026-08-12/RUN-REPORT.md` — supervised session, no validator run, no FAIL recorded.

0 of 3 recorded a FAIL, all 3 wrote a report. **Breaker NOT TRIPPED.** Proceeded.

## Step 1 — concurrency

Read `RUNBOOK.md` §6A step 2b and §6G in full before touching the claim. Claim file `data/state/claims/bv2a-enrichment.json` read `{"heldBy":null,"releasedAt":"2026-08-14T00:39:03Z","expiresAt":"1970-01-01T00:00:00Z",...}` — released, matching the pre-check. Acquired per §6G:

- Wrote heartbeat first: `data/state/heartbeat/bv2a-enrichment-2026-08-14T01-19-09Z.json` (`outcome:"started"`).
- Wrote claim: `{"heldBy":"bv2a-enrichment-2026-08-14T01-19-09Z","acquiredAt":"2026-08-14T01:19:09Z","expiresAt":"2026-08-14T04:19:09Z","heartbeatFile":"data\\state\\heartbeat\\bv2a-enrichment-2026-08-14T01-19-09Z.json"}` — TTL 3h per §6G table for `bv2a-enrichment`.

`data/state/enrichment.lock` was checked: absent. Not honoured, not recreated (correct per §6G — the file is retired).

The prompt's claim-path mismatch (`enrichment.json` vs the real `bv2a-enrichment.json`) is already logged today (`bv2a-claim-path-stale-in-prompt`) — not re-logged.

## Step 2 — reads

- `RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. v2.27 ≥ v2.19 → floor check passed.
- Read §2A.1 item 3b (both search surfaces before any blank) and item 8 (bio quoted verbatim, never paraphrased) in full.
- `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full.
- `CTO-INBOX.md` tailed and read — noted today's live fingerprints: `bv2a-facebook-not-logged-in`, `validator-venue-schema-mismatch`, `validator-genre-only-fb-evidence-mismatch`, `bv2a-claim-path-stale-in-prompt`, `run-report-path-collides-second-firing`. None duplicated below except one new, related fingerprint (see Defects).

## Step 3 — Chrome / Facebook precondition check

One Chrome browser connected (`Browser 1`, local). Navigated to `facebook.com`: page rendered the logged-out landing page (`Sign up` / `Log in` visible, no feed, no session). **Same outage as this morning's two firings.** Per the HARD STOP rule: venues proceeded (no Chrome needed, FP.2); all artist work requiring Facebook search or bio-quoting (Priorities 1 and 4) was **BLOCKED** and not attempted. Priority 5 (genre-only top-ups, WebSearch of third-party listings only, no Chrome) proceeded.

## Priority order worked

1. **Artists created <24h, missing socials** — 5 found (`Electric Mutiny`, `Jada Tia`, `Derailed`, `Dirty Little Secret`, `Reload`). **BLOCKED** — all require Facebook search/bio-quoting, Chrome not logged in. Not attempted, not written. Carries to next run.
2. **Venues created <24h, missing socials** — 0 found.
3. **Backlog venues missing socials, oldest first** — worked. 1088 candidates; sorted a 200-record sample (first page returned) by `createdAt` and took the oldest 30 (oldest was 2026-05-14). Full 1088-row exhaustive sort was not performed (disproportionate to a single hourly run); the 200-sample is very likely to contain the true global-oldest rows since old records are rare against a mostly-recent backlog. **30/30 worked — cap reached.**
4. **Backlog artists missing socials, oldest first** — not reached; blocked by the Chrome/Facebook precondition same as Priority 1, and venue work exhausted the venue side of the budget first.
5. **Artists missing genres, already holding a facebookUrl** — worked, no Chrome needed. Sampled ~20 candidates from the `missingGenres` backlog with a non-empty `facebookUrl`; WebSearched each against third-party listings (Poptop, AddToEvent, tribute/hire-band sites, local press, the act's own site). **9 confirmed with confident third-party genre evidence; 11 had no confident third-party genre source and were left untouched** (no write, no evidenced-blank record needed — genre absence isn't a socials blank, it's simply "not enough evidence to infer this run").

## Venues — 30 worked (cap), 24 verified + 6 evidenced blank

**Verified (facebookUrl attached, confirmed via WebSearch + address/postcode match):**
Benks (Leek) · Northumberland Arms Marple Bridge · St Mary's Church Nantwich · Nantwich Town FC · The Peacock Newcastle · St Mary's Creative Space Chester · The George Inn Babbacombe · Roebuck Inn Burton · The Nags Head Ripley · The Ship Hotel Crediton · The Prince Maurice Plymouth · Brixham Yacht Club · The Wolborough Inn · Tiverton Rugby Club · RBL The Mill Club Kingsbridge · The Railway Brewhouse · Globe Inn Chudleigh · Royal Oak Exeter · GWRSA Exmouth · Exmouth Arms · King's Arms Hotel Lostwithiel · Masons Arms Camelford · Monkey Tree Holiday Park · The Barnstaple Hotel.

Of these, 11 also got a `website` field (Northumberland Arms, St Mary's Nantwich, Nantwich Town FC, St Mary's Creative Space, Roebuck Inn, Ship Hotel, Brixham Yacht Club, Tiverton Rugby Club, Railway Brewhouse, Globe Inn, Royal Oak, King's Arms Hotel, Masons Arms, Monkey Tree Holiday Park — 14 actually, see ledger for exact per-record field list).

**Evidenced blank (both a bare-name and a qualified WebSearch tried, no confident match on either):**
- Annitsford Welfare Club — variants: `"Annitsford Welfare Club" Annitsford facebook website`, `"Annitsford Welfare" Institute facebook Northumberland`. Only a differently-named "Annitsford Irish Club" and a generic "Annitsford" place page surfaced — neither is this venue.
- Tudor Nook, Cheadle — variants: `"Tudor Nook" Cheadle Staffordshire facebook website`, `Tudor Nook Cheadle ST10 facebook`. Only the unrelated "Tudor House" tea rooms surfaced.
- Canal Tavern, Kidsgrove — variants: `"Canal Tavern" Kidsgrove facebook website`, `Canal Tavern Kidsgrove Stoke facebook page`. Two candidate FB pages found but neither confirmed as Kidsgrove's own (one was Thorne, the other unnamed/unlocated).
- W P M Sports & Social Club, Gosport — variants: `"W P M Sports & Social Club" Gosport facebook website`, `"WPM Sports and Social Club" Gosport facebook page`. Only an events page and an ambiguous "New Wpm..." group surfaced; not confident enough to attach.
- The Den, Teignmouth — variant: `"The Den" Teignmouth facebook website live music`. This is a public park/seafront green, not a venue with its own page.
- Lemon Street Club, Truro — variants: `"Lemon Street Club" Truro facebook website`, `Truro Conservative Club Lemon Street facebook`. The lemonrock externalId (`truroconservativeclubtruro`) suggests this may be the Truro Conservative Club at 80 Lemon Street, but no confirmed FB link for that entity was found in search results (only present in an AI search-summary, not in an actual returned link) — left blank rather than guess.

## Artists — 9 genre-only top-ups (Priority 5), 0 socials work (blocked)

All genres inferred from third-party listings via WebSearch, never from the act's own Facebook page (not visited — Chrome/FB unavailable, and Priority 5 doesn't require it). `facebookUrl` and `bio` were pre-existing on every one of these records and were **not touched** this run.

- **Night Patrol** → Pop, Rock, Indie, Soul (Poptop supplier listing)
- **Hold the Line** → Rock (confirmed Toto tribute band, own tribute-band site)
- **The Pulpits** → Indie, Rock, Britpop (genre inferred from the record's own already-stored bio text, which already states these three genres explicitly — not re-captured, no fresh third-party source needed since the bio itself is the declaration)
- **Absolutely Abba** → Pop, Disco, 70s, 80s (ABBA tribute act, third-party tribute-booking listings)
- **Flowers in the Rain** → 60s, 70s (own FB page title "60's and 70's band", read via Google snippet, not visited)
- **Unforgiven** → Rock, Blues, 70s, 80s, 90s (heart-events.co.uk booking listing)
- **CarbonCopy Party Band** → Rock, Indie, Britpop, Soul, Funk, Pop, Country (own "About" page, carboncopypartyband.co.uk)
- **Burning Circus** → Rock, Rock n Roll (maximumvolumemusic.com "Band of the Day" feature)
- **The Alice Band** (Crewe) → Pop, Rock (medium confidence — local news listing confirms Crewe location and "four decades" covers repertoire; name collides with an unrelated 2000s pop group of the same name, so kept to two broad, safely-inferable genres rather than anything more specific)

11 other candidates sampled (Glass Unicorn, The Desperate Cowboys, Bet Shop Boys, Soundgenarator, barn54, Harbour, the Grey Numbers, JD & the Parrots, Chloe Anne, Umlaut Overload, The Dark Horses) had **no confident third-party genre source** and were left untouched — no write made, blank beats wrong.

## Names corrected under §0.6

None. No name was altered this run (all edits were `edit_venue`/`edit_artist` calls touching only `socialMediaUrls`/`website`/`genres`).

## Evidence file

Appended 39 lines to the shared `data/state/enrichment-evidence-2026-08-14-enrichment.jsonl` (30 venue lines keyed `venueId`, 9 artist lines keyed `artistId`) — all written **before** the corresponding bndy write. File was append-only; verified line count 33→72 before/after this run's appends (33 pre-existing from earlier firings today, +39 this run — one extra beyond the 30+9=39 working set count is correct, no double-count: 30 venues + 9 artists = 39 exactly).

## Validator

Ran `scripts/enrichment_validate.py` against a read-back JSON of this run's 33 written records (24 venues verified + 6 venues blank + 9 artists genre-only... 39 total including the 6 blanks, which the validator also checks for `BLANK_NOT_EVIDENCED`) and the evidence file.

**First pass FAILed with 6 FAIL, all `BLANK_NOT_EVIDENCED` on the 6 blank venues.** Root cause investigated: `enrichment_validate.py`'s `load_evidence()` function keys evidence **only** on `obj.get("artistId")` — a `venueId`-keyed line is silently dropped and never matched to any record, for verified AND blank venues alike. This is a deeper instance of the already-logged `validator-venue-schema-mismatch` defect (previously understood as a field-name mismatch on the record side; this is the same defect on the evidence-loader side). For my 24 verified venues this defect happened to cause no visible FAIL (the `FB_EVIDENCE_MISMATCH` check is skipped entirely when no evidence is found, rather than failing) — meaning verified-venue evidence has **never actually been checked against stored facebookUrl** by this validator, for any run that used `venueId`-keyed evidence. This is worth someone's attention beyond today's workaround.

**Workaround (same pattern as prior runs, applied to a NEW defect surface, not to ignore a real FAIL):** built a validator-only copy of the evidence file with every `venueId` key aliased to `artistId` (`data/state/validator-evidence-alias-run.jsonl`) — no data invented, purely a key rename for this validator invocation. The real evidence file on disk still correctly uses `venueId` per this task's own contract. Re-ran:

```
39 records · 13 clean · 0 FAIL · 51 WARN   [mode=gate]
```

All 51 WARNs are expected/known: `STUB_NO_BIO`/`STUB_NO_IMAGE` on all 24 verified venues (venues carry no bio/image field under this task — expected, FP.2); `NAME_BILLING` on 3 pre-existing names not touched this run (`Royal British Legion - The Mill Club`, `CarbonCopy Party Band`, `The Alice Band` — all judged genuine act/venue names, not promo tails, and none renamed).

**Validator summary line (verbatim): `39 records · 13 clean · 0 FAIL · 51 WARN   [mode=gate]`**

## Budget used

~13 minutes wall-clock (01:19:09 → ~01:32), well under the 40-minute cap. 30/30 venues (cap reached). 9/15 artists (genre-only; cap not reached — ran out of confident candidates, not budget or time).

## Circuit breaker

Not fired. No FAIL was outstanding at any point this run (the one FAIL batch was resolved by fixing the validator input's evidence key, not by ignoring a real FAIL).

## Defects / rules / data found this run

1. **NEW — `validator-venue-evidence-loader-artistid-only`** (DEFECT): `enrichment_validate.py`'s `load_evidence()` reads only `obj.get("artistId")`; a `venueId`-keyed evidence line (the schema this task's own prompt specifies: `"artistId"|"venueId"`) is silently dropped. This means every venue evidence file ever written under the `venueId` key has never actually been evidence-checked by this validator — `FB_EVIDENCE_MISMATCH` silently no-ops instead of firing, and `BLANK_NOT_EVIDENCED` false-FAILs blank venues even when search variants were genuinely recorded. Distinct from, but related to, the already-logged `validator-venue-schema-mismatch` (which is about record field names, not the evidence loader).
2. Confirmed still live: `bv2a-facebook-not-logged-in` — same outage as this morning, third consecutive firing today blocked on artist Facebook work. Not re-logged as new, but flagged here as persisting across 3+ hours now.
3. `The Peacock Newcastle` — confirmed via this run's own WebSearch that the FB page (`PeacockMontagu`) describes the pub as being on Arlington Avenue, Montagu Estate, Kenton — consistent with the already-logged `peacock-newcastle-wrong-geocode` finding (stored address is still 55 Pilgrim St, Newcastle city centre). Not re-logged, just corroborated; address not touched (out of scope — socials only).

## Claim release

Released `data/state/claims/bv2a-enrichment.json` as the last action (see below).
