# Bv2a Enrichment — Run Report 2026-08-15, hour 10

**Outcome: COMPLETED.**

Run id: `bv2a-enrichment-2026-08-15T10-18-06Z`. Claim: `data\state\claims\bv2a-enrichment.json` (the runbook-correct filename — the task prompt still names `enrichment.json`, which has never existed; fingerprint `bv2a-claim-path-stale-in-prompt`, not re-logged).

## Step 0 — Circuit breaker

Last 3 run reports (newest first), read from `data\normalized\enrichment\`:

1. `2026-08-15/RUN-REPORT-09.md` — COMPLETED. Validator `45 records · 17 clean · 0 FAIL · 56 WARN`.
2. `2026-08-15/RUN-REPORT-08.md` — COMPLETED. Validator `45 records · 14 clean · 0 FAIL · 61 WARN`.
3. `2026-08-15/RUN-REPORT-07.md` — COMPLETED. Validator `45 records · 12 clean · 0 FAIL · 64 WARN`.

0 of 3 recorded a FAIL, all 3 wrote a report. **Breaker NOT TRIPPED.** Proceeded.

## Step 1 — Concurrency

`data\state\claims\bv2a-enrichment.json` read after the runbook load: `{"heldBy":null,"releasedAt":"2026-08-15T09:33:30Z", ...}` — free. Acquired at `2026-08-15T10:18:06Z`, TTL 3h (expires 13:18:06Z), heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-15T10-18-06Z.json`. No `data\state\enrichment.lock` found; would not have been honoured regardless (retired, §6A step 2b).

## Step 2 — Runbook / task spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full this firing: §0A/§0, §1/§1A, §2/§2A (including item 3b — both search surfaces before any blank — and item 8 — bio is quoted, never composed), §3 venue protocol, §6/§6A/§6F/§6G, §6D-bis, changelog to v2.27. `ENRICHMENT-TASK-v3.md` §0.0, §FP, §5–§9 read in full. `CTO-INBOX.md` read in full.

**Live/open fingerprints noted, none re-logged:** `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-genre-only-fb-evidence-mismatch`, `bv2a-claim-path-stale-in-prompt`, `run-report-path-collides-second-firing`, `enrich-venue-batch-array-not-parsed`, `bv2a-edit-artist-409-on-facebookurl-write`, `danny-and-friends-duplicate-of-danny-brab`, `bv2a-facebook-not-logged-in` (not applicable — Chrome confirmed one connected browser, logged in as Jason, this firing).

## Step 3 — Tools verified

`list_venues` reachable (2963 venues). Chrome: exactly one connected browser ("Browser 1"), navigated to facebook.com, confirmed logged in ("What's on your mind, Jason?").

Heartbeat written first: `data\state\heartbeat\bv2a-enrichment-2026-08-15T10-18-06Z.json`, `{"outcome":"started"}`, rewritten to `{"outcome":"completed"}` as the last action of this run.

## Selection

Priority order per task prompt:

1. **Artists created <24h, missing socials** — 16 candidates. 15 of 16 already carried a ledger entry from an earlier firing today; the 16th (`Danny & Friends`, `d27e100b-…`) is the known duplicate of Danny Brab (§ fingerprint `danny-and-friends-duplicate-of-danny-brab`) and is not a fresh candidate to attempt. **None reachable — priority exhausted for today.**
2. **Venues created <24h, missing socials** — 84 candidates, all unattempted (0 ledger hits). Worked oldest-`createdAt`-first. **32 worked** (budget target 30, two over on the last batch of 8 — reported honestly rather than trimmed to a round number).
3. Backlog venues — not reached; budget went entirely to priority 2.
4. **Backlog artists missing socials, oldest `createdAt` first** — 894 candidates. Filtered against the ledger (skip anything already attempted today/within cooldown) and the do-not-attach list (§5.4 — none of tonight's candidates matched it). **15 worked**, oldest-unattempted-first: The Relics, P J Carter, The Velvet Detour, The Fat Marrow Band, Tripod, The Looters, Fabulous Funky Funks, Elry Blue Duo, Queenage, Beth George, Slap, Ace & The Venturas, The Imitation Zone, Two Bob Short, The Bonnet.
5. Genre-only top-up — not reached.

## Venues — verified with a page (31)

Fast path (FP.2): Google to find, no Chrome needed for venues (no bio field). Every attach confirmed by name + address/town match against the stored record.

| Venue | id | facebookUrl | Notes |
|---|---|---|---|
| The Church Inn | `3ba256cc-…` | facebook.com/churchinncheadlehulme | |
| Dun Cow | `d0bc9858-…` | facebook.com/theduncow | |
| Finger Post Hotel | `02b7c8a8-…` | facebook.com/TheFingerpost | |
| Hartford Hall, Hartford | `935ffc37-…` | facebook.com/p/Hartford-Hall-on-School-Lane-100089711277309 | |
| Hole in t' Wall | `a26c803e-…` | facebook.com/p/Hole-In-t-Wall-New-Hall-Inn-100067552060402 | |
| Horse Shoe, Astbury | `08d9d0df-…` | facebook.com/horseshoeinnastbury | |
| Junction Inn, Ashton Under Lyne | `5d86d0c4-…` | facebook.com/junctioninnturnerlane | two same-name candidates existed (Turner Lane / Hazelhurst); matched on stored address "55 Turner Ln" |
| Tempest Arms, Elslack | `34825abd-…` | facebook.com/tempestarms.co.uk | + website tempestarms.co.uk |
| The Craven Heifer Inn, Kelbrook | `6782be44-…` | facebook.com/185165848226843 | numeric page id |
| The Queens | `c0b6dd84-…` | facebook.com/TheQueensStockport | |
| The Winchester | `f6d1d07f-…` | facebook.com/thewinchestertaunton | |
| The Doctors | `ac610dec-…` | facebook.com/thedoctorsbathgate | |
| The Stirling | `01f5611a-…` | facebook.com/thestirlingpub | + website ambertaverns.co.uk/pub/the-stirling |
| Oxford Tap | `f5185e06-…` | facebook.com/theoxfordtap | FB page metadata labels it "Farsley"; confirmed as the Guiseley site via ambertaverns.co.uk/pub/the-oxford-tap (own operator page) + website added |
| King Street Social Tap | `1dc5456d-…` | facebook.com/KingStreetSocialTap | + website ambertaverns.co.uk/pub/king-street-social-tap |
| Bryggen Eynde | `3fceae62-…` | facebook.com/BryggenEynde | + website ambertaverns.co.uk/pub/bryggen-eynde |
| The Old Vic Cleethorpes | `414ad394-…` | facebook.com/theoldviccleethorpes | |
| The Railway | `4d5a4ba2-…` | facebook.com/therailwaycaerphilly | |
| The Water House | `b1cf8ba2-…` | facebook.com/TheWaterHousePubDurham | 3 candidate pages existed (legacy Wetherspoons page, a quiz page, this one) — chose the one matching the exact stored address and describing itself as the current occupant |
| Claremont Social Tap | `cced6cbc-…` | facebook.com/ClaremontSocialTap | |
| Montagues | `e0df512e-…` | facebook.com/MontaguesKirkcaldy | |
| The Imperial | `d75b0164-…` | facebook.com/TheImperialDumfries | |
| Northern Way Bolton | `24bcde8e-…` | facebook.com/NorthernWayBolton | |
| The Northern Way Preston | `9a9efb09-…` | facebook.com/TheNorthernWayPreston | |
| Hogarths (Newcastle-under-Lyme) | `992db288-…` | facebook.com/HogarthsNewcastleUnderLyme | |
| The Drum Winder | `af395a80-…` | facebook.com/TheDrumWinder | |
| The Northern Way (Paisley) | `2b54210e-…` | facebook.com/TheNorthernWayPaisley | |
| The Wheatsheaf (Atherton) | `4ac01b42-…` | facebook.com/TheWheatsheafAtherton | |
| The Tap and Clapper | `992bee09-…` | facebook.com/tapandclapper | |
| The Saddle | `9ad16405-…` | facebook.com/Saddlehorwich | |
| The Auctioneer | `0e4e7079-…` | facebook.com/auctioneer.hanley | |

## Venues — evidenced blank (1)

- **The Alexandra** (`2a0692d0-…`, Stockport/Edgeley) — two Google searches ("The Alexandra Edgeley Stockport pub facebook", "facebook.com The Alexandra Edgeley Stockport") surfaced only Instagram (@thealexandraedgeley) and a third-party group post; no own-page facebook.com URL. Left blank.

## Artists — verified with a page (7)

| Artist | id | Tier | Signal |
|---|---|---|---|
| The Velvet Detour | `c55f3df4-…` | A | Exact name match, Musician/band, bio states "South West UK" matching the stored Axminster/Devon footprint. Bio quoted verbatim (incl. the page's own 🎸). Added genre Indie on the bio's own word "indie anthems". |
| Fabulous Funky Funks | `67803f7b-…` | B | Woking-located page matching existing (pre-existing, untouched) bndy bio's own facts — session musicians, formed 2010. facebookUrl only; bio was already correctly source-quoted by an earlier run and was not re-touched. |
| Queenage | `f52b3c6a-…` | B | Google snippet states "based in Rayleigh, Southend-On-Sea" (Essex) — consistent with stored Essex location; page bio "Queen tribute band based in the UK" quoted verbatim. |
| Slap | `1e51fe01-…` | A | Page's own recent posts name Hoddesdon, Harlow, Jungle Bar Hertford, The Cock Inn Bishops Stortford — all inside the stored Hertfordshire footprint. Bio quoted verbatim. Added genres Rock/Reggae/Punk/Ska and actType originals+covers from the bio's own words. |
| Ace & The Venturas | `29be1835-…` | B | Google corroborated a Hertfordshire gig (Jacoby's, Ware); page visited, Musician/band, bio quoted verbatim. Genres Pop/Rock/Indie and actType covers added from the bio ("renditions of… pop, indie, and rock"). |
| Two Bob Short | `7b7b538a-…` | A | Sole candidate, page visited, bio quoted verbatim. The band's own site (twobobshort.com) states "Essex Premier Rock Covers Band" — **location corrected Hertfordshire → Essex** per §7 (page-stated location beats a stored guess). Genres Rock/Indie/Pop/Punk and actType covers added from the bio. |
| The Bonnet | `396cb3de-…` | B | Own presence is a Facebook **group** (valid per RUNBOOK §2A.1 item 4, Jason ruling 2026-08-07 — group URLs are never stripped). Group's own posts confirm gigs at the White Swan, Hoddesdon and Hoddesdon Labour Club — matching the stored Hertfordshire location and a third-party listing of Hoddesdon, Herts. No bio (group about pages carry none) — left empty, not invented. |

## Artists — evidenced blank (8)

Both surfaces (Facebook-style targeted query + plain Google) tried on every one before recording blank; where a specific facebook.com URL was found and visited, it is named as a rejected candidate.

- **The Relics** (`6f95e4a3-…`, Exeter) — `facebook.com/relictheband`, `facebook.com/therelicsrock` (empty/dead), `relicsband.com` (domain not resolving) — none confirmed as this Exeter/southwest trio. Source page (lemonrock.com/relics) carries no FB link either. Left blank.
- **P J Carter** (`91043238-…`, Liskeard) — no dedicated page found; only an unrelated "PJ Music" instrument retailer surfaced. Left blank.
- **The Fat Marrow Band** (`602e443f-…`, Taunton) — no dedicated page; only a third-party venue video mention ("Fat Marrow Blues Band" at The Royal Standard, Lyme Regis). Left blank.
- **Tripod** (`8b66e128-…`, Bridport) — no UK/Bridport candidate; results were an Australian comedy trio, a NYC rock trio, a family covers band and a Doha acoustic act. Left blank.
- **The Looters** (`9c885aef-…`, Belsize Park, London) — candidate `facebook.com/p/The-Looters-100063951854217/` visited and resolves to Meta's generic redirect (dead/non-existent page id). No other Belsize Park-confirmed page found despite the act's own live website (thelooters.com). Left blank.
- **Elry Blue Duo** (`f552af38-…`, Essex) — candidate `facebook.com/p/Elry-Blue-61571453911778/` visited and resolves to Meta's generic redirect (dead page id). Left blank.
- **The Imitation Zone** (`0944552f-…`, Hertfordshire) — candidate `facebook.com/imitationzone/` visited and **rejected**: confirmed a different act (category Artist, bio "boy is a place", unrelated). No other candidate found. Left blank.
- **Beth George** (`cb62904a-…`, Bracknell) — several people named Beth George found on Facebook (a Whitstable electro-pop artist, personal profiles) but none confirm the Bracknell/MUSICA connection already recorded in the existing bndy bio. Left blank.

## Names corrected under §0.6

None this firing.

## Location correction (§7, page-stated location beats a stored guess)

**Two Bob Short** (`7b7b538a-…`) — Hertfordshire → **Essex**, on the act's own website (twobobshort.com, "Essex Premier Rock Covers Band"). Logged here per §7/§2A.2.

## Validator

Evidence file: `data\state\enrichment-evidence-2026-08-15-enrichment.jsonl` — 47 new lines appended this firing (178 → 225 total for today), all written before the corresponding bndy write.

Known validator scope gaps applied — same workarounds as prior firings today, all already logged in `CTO-INBOX.md`, not re-logged:

1. `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` — built `data\state\validator-records-run-1018.json` (venue `socialMediaUrls[0].url`/`city` aliased to top-level `facebookUrl`/`location`; no data invented, schema rename for validator input only) and `data\state\validator-evidence-alias-run-1018.jsonl` (`venueId` keys aliased to `artistId`, 47 lines covering the 32 venues + 15 artists touched this run).
2. `validator-genre-only-fb-evidence-mismatch` (same class) — **Fabulous Funky Funks**, **The Relics**, **The Looters** and **Beth George** carry a pre-existing bio that this run did not touch and has no `capturedText` for (their actual bndy record's bio field was not written to this run — Fabulous Funky Funks only received `facebookUrl`; the other three received no write at all). Aliased their `bio` to empty for validator input only.

Result, first pass (before the genre-only-fb-evidence-mismatch alias): `47 records · 9 clean · 4 FAIL · 66 WARN`. All 4 FAILs were the known reconstruction-gap class above (BIO_VERBATIM firing against an untouched pre-existing bio compared against this run's own capture note, not the source of that bio). Second pass, after applying the documented alias (no bndy data touched): **0 FAIL**.

**Validator summary line (verbatim): `47 records · 12 clean · 0 FAIL · 67 WARN   [mode=gate]`**

WARNs breakdown: `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 31 verified venues (venues carry no bio/image field under this task — structurally unavoidable, same as every prior firing today) plus `STUB_NO_BIO` on Fabulous Funky Funks and The Bonnet (facebookUrl attached, bio genuinely absent/untouched — not a defect); `NAME_BILLING` WARNs on **The Fat Marrow Band** and **Elry Blue Duo** — both format-tail patterns ("Band"/"Duo") that RUNBOOK §2A.1 item 7 (Jason ruling 2026-08-07) explicitly says are part of the name and must never be stripped on the pattern alone; not actioned.

### Circuit breaker for next run

Not fired. No FAIL was outstanding in the final (bndy-accurate) validator run.

## Defects / fingerprints

No new fingerprint raised this firing. All defects encountered already have open CTO-INBOX entries (`bv2a-claim-path-stale-in-prompt`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-genre-only-fb-evidence-mismatch`) and were not re-logged.

## Budget used

~19 minutes elapsed (10:18:06Z acquire to 10:37:52Z ledger/snapshot write), well inside the 40-minute target and far under the 3-hour TTL. Venues: 32/30 worked (2 over the round target — the last batch of 8 was pulled through in full rather than cut mid-batch; reported honestly). Artists: 15/15 worked. Priority 1 (fresh artists) exhausted with zero fresh candidates; priority 3 (backlog venues) not reached; priority 5 (genre-only top-up) not reached.

Circuit breaker: **did not fire.**

## Ledger / snapshot / dashboards

Ledger: 47 lines appended to `data\state\enrichment-ledger.jsonl` (31 venue `verified`, 1 venue `blank`, 7 artist `verified`, 8 artist `blank`) plus one `snapshot` line. Run-summary line appended to `data\state\run-summary.jsonl` (`recordsEnriched: 38`, `skipped: 9`). Both dashboards regenerated:

- `data\normalized\enrichment\DASHBOARD.html` — 1187 enrichment records, 40 snapshots, exit 0
- `data\normalized\DASHBOARD.html` — exit 0

Snapshot counts (post-run): artistsTotal 2209, artistsMissingSocials 887 (was 894 — −7 for this run's writes), artistsMissingGenres 634, venuesTotal 2963, venuesMissingSocials 903 (−31 for this run's writes).

Claim released: `{"heldBy":null,"releasedAt":"2026-08-15T10:38:00Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-15T10-18-06Z"}`. Heartbeat rewritten to `"outcome":"completed"`.
