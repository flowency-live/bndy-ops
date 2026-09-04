# Bv2a Enrichment — Run Report — 2026-08-14, 8th firing (UTC)

Fired 2026-08-14T06:18:38Z. Run id `bv2a-enrichment-2026-08-14T06-18-38Z`.

**Outcome: COMPLETED.**

## Step 0 — circuit breaker

Pre-flight (orchestrator-verified before delegation): newest-first, last 3 reports at start of this run — RUN-REPORT-06.md (COMPLETED, `45 records · 15 clean · 0 FAIL · 61 WARN`), RUN-REPORT-05.md (COMPLETED, `0 FAIL`), RUN-REPORT-04.md (COMPLETED, `0 FAIL`). 0 of 3 recorded a FAIL, all 3 wrote a report. **Breaker NOT TRIPPED.** Proceeded.

## Step 1 — concurrency

Read `RUNBOOK.md` §6A step 2b and §6G in full before touching the claim. The task-prompt claim path (`data\state\claims\enrichment.json`) is stale — known fingerprint `bv2a-claim-path-stale-in-prompt`, not re-logged. Real claim file `data/state/claims/bv2a-enrichment.json` read `{"heldBy":null,"releasedAt":"2026-08-14T05:33:38Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-14T05-18-56Z"}` — released. Acquired per §6G:
- Heartbeat written first: `data/state/heartbeat/bv2a-enrichment-2026-08-14T06-18-38Z.json`.
- Claim written: `heldBy: bv2a-enrichment-2026-08-14T06-18-38Z`, `expiresAt: 2026-08-14T09:18:38Z` (3h TTL per §6G table).

`data/state/enrichment.lock` not checked/honoured/recreated (retired file, per §6A step 2b).

## Step 2 — reads

RUNBOOK.md H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed (v2.27 ≥ v2.19). §2A.1 item 3b (both search surfaces before any blank) and item 8 (bio quoted, never written) read in full. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` read in full — today's live fingerprints noted (`bv2a-facebook-not-logged-in`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-genre-only-fb-evidence-mismatch`, `bv2a-claim-path-stale-in-prompt`, `run-report-path-collides-second-firing`, `enrich-venue-batch-array-not-parsed`). None marked resolved, none re-logged.

## Step 3 — Chrome / Facebook precondition check

One Chrome browser connected (`list_connected_browsers`). Navigated to `facebook.com`: logged-out landing page (`Log in`/`Sign up` fields present, no session) — confirmed via `read_page`. **Eighth consecutive firing today blocked on this outage.** Per the HARD STOP rule: venues proceeded (FP.2, no Chrome needed); artist work requiring Facebook search or bio-quoting (Priorities 1 and 4) was BLOCKED. Priority 5 (genre-only, WebSearch only, no Chrome) proceeded.

## Priority order worked

1. **Artists created <24h, missing socials** — 15 found (same cohort as prior firings today: Simon Langley, Velvet Sun, Steve James, Steve Baron, Jackie Dijon, Electric Mutiny, Billy No Mates, Chester, Harlie Duo, Jada Tia, Derailed, Dirty Little Secret, Jonathan Honour, Reload, Les Anderson). BLOCKED — Chrome not logged in to Facebook. Not attempted, not written. Carries to next run.
2. **Venues created <24h, missing socials** — 0 found.
3. **Backlog venues missing socials, oldest first** — 949 candidates at start. Sampled the oldest ~109 (3 pages by `createdAt`, client-side sorted since the list tool does not sort by date); excluded candidates already touched by earlier firings today (cross-checked against every `venueId` in the shared evidence file, 172 unique ids) and one already-evidenced-blank same-day record (Jeckyll & Hyde, Northampton). One further candidate, Okehampton Show ground, appeared in the sampled window but was excluded before selection — same non-fixed-building skip already applied by an earlier firing (§0.23). Took the oldest 30 of the remainder, `createdAt` 2026-02-10 through 2026-08-07. **30/30 worked — cap reached.**
4. **Backlog artists missing socials** — not reached; blocked by Chrome/Facebook, and venue work exhausted the venue side of the budget first.
5. **Artists missing genres, already holding a `facebookUrl`** — worked. Sampled the first page (50) of `missingGenres` candidates; 11 carried a non-empty `facebookUrl` and none were already touched today. WebSearched all 11; **1 confirmed** (barn54), 10 rejected — no confident single-genre evidence, ambiguity with same-name acts, or no accessible page content. Did not pull further pages — ran out of time budget after the venue batch and this sample.

## Venues — 30 worked (cap), 25 verified + 1 website-only + 4 evidenced blank... see below (5 blank total)

**Verified (facebookUrl attached, confirmed via WebSearch address/name match):**
Railway Arches / Signature Brew Haggerston (London) · The Miner's Lamp (Easington) · The Albion (Burton upon Trent) · Madeley Town Council (Telford) · Hip Hop Bar, Alsager (Cheshire) · The Turbinia (Newton Aycliffe) · Wilsthorpe Tavern (Long Eaton) · The Bell Inn (Bovey Tracey) · Holly Bush Inn (Belper) · Golden Hind (Plymouth) · The Sidmouth Arms (Upottery) · The Malt House (Seaton) · The Feathers (Budleigh Salterton) · The Ancient Mariner (Lynmouth) · The Angel (Poole) · West India House (Bridgwater) · The Motorsport Lounge (Llandudno) · Rose & Crown (Woodford Green) · Royal Penrith · The Dukes arms (Woodford, Kettering) · Higham Sports & Social Club/The SAS (Higham Ferrers) · Buxton Brewery/Trackside · Queens Arms (Brixham) · The Star Inn (Whipton, Exeter) = 23 acts.

Correction to count: 23 above + 2 more counted below make 25 total verified-with-facebookUrl. Full list, alphabetically, with what was attached:
- Railway Arches (facebookUrl + website — this is the venue previously flagged as "trading as Signature Brew Haggerston" per RUNBOOK §0.6; socials attached under the existing record, name NOT changed this pass — out of scope, flagged below)
- The Miner's Lamp — facebookUrl (moderate confidence: numeric-id page "The Miners Lamp Easington New", matches town; a same-named but differently-titled page "SpreadfromthemedTheDeli" was rejected as not name-matching)
- The Albion — facebookUrl + website
- Madeley Town Council — facebookUrl (the venue record itself is the council; direct name match)
- Hip Hop Bar, Alsager — facebookUrl
- The Turbinia — facebookUrl + website
- Wilsthorpe Tavern — facebookUrl + website
- The Bell Inn — facebookUrl
- Holly Bush Inn — facebookUrl + website (three candidate pages found for this pub; took the plain vanity-handle page cross-confirmed by the matching website domain)
- Golden Hind — facebookUrl
- The Sidmouth Arms — facebookUrl + website
- The Malt House — facebookUrl + website
- The Feathers — facebookUrl + website (two candidate pages; took the newer-format "The Feathers Budleigh" page)
- The Ancient Mariner — facebookUrl (2,100+ likes, address-matched)
- The Angel — facebookUrl + website
- West India House — facebookUrl (2,715 likes, address-matched; two other same-named pages found and rejected as lower-engagement/less clearly matched)
- The Motorsport Lounge — facebookUrl + website
- Rose & Crown — facebookUrl
- Royal Penrith — facebookUrl + website (bndy stores "Royal Penrith"; the pub's own branding is "The Royal" — not renamed this pass, flagged below)
- The Dukes arms — facebookUrl
- Higham Sports & Social Club (The SAS) — facebookUrl
- Buxton Brewery — facebookUrl (attached to "Buxton Brewery Trackside", the specific taproom at the stored Staden Lane address)
- Queens Arms — facebookUrl + website
- The Star Inn — facebookUrl + website

That is 24 venues with a facebookUrl attached. Plus:
- **The Black Bear (Congleton) — website only.** Own website confirmed (theblackbearatcongleton.co.uk); no Facebook link surfaced on the site or in two targeted searches. Recorded as an evidenced partial: website written, facebookUrl left blank with variants logged.

**25 venues got a write this run (24 with facebookUrl, 1 website-only).**

**Evidenced blank (5) — both surfaces tried, nothing confident found:**
- Sun Hotel (Blackburn) — variants: `"Sun Hotel" Blackburn Astley Gate facebook website`, `"Sun Hotel" Blackburn pub facebook.com`. CAMRA explicitly states no website; no FB page surfaced.
- Ann Welfare Playing Fields (Annitsford/Cramlington) — variant: `Ann Welfare Playing Fields Annitsford Cramlington facebook`. Only third-party club mentions found (Cramlington Juniors FC, 2nd Cramlington Scouts), no dedicated page for the fields themselves.
- Jubilee Park, Horndean — variant: `Jubilee Park Horndean facebook`. Only Horndean Parish Council's own page surfaced, not a dedicated page for the park.
- Pinhoe Parish Church (Exeter) — variant: `Pinhoe Parish Church Exeter facebook`. Multiple other Pinhoe-area churches (Baptist, St Mark's) have pages but none confirmed as St Michael and All Angels, the actual parish church at this address.
- The Bricklayers (Poole/Parkstone) — variants: `"Bricklayers Arms" Parkstone Poole facebook`, `bricklayersarmsparkstone facebook.com`. Multiple same-named Bricklayers Arms pubs found in other UK towns (Putney, Hemel Hempstead, Colchester, Sevenoaks); none for the Parkstone location specifically.

## Artists — 1 genre-only top-up (Priority 5), 0 socials work (blocked)

**Confirmed and written:**
- barn54 (UK wide, `facebookUrl` already stored, bio already stored and untouched this run) → **genres: Rock**. Own Facebook page description (surfaced via WebSearch, page content indexed by Google): *"barn54 blends melancholic ballads with rock-driven anthems"* — a `rock-driven` self-description is the evidence for the single genre `Rock`. Only `genres` was written; the pre-existing `facebookUrl` and `bio` were not touched.

**10 sampled and rejected — no confident single-genre evidence, left untouched:**
- Glass Unicorn (Stockport) — no search results found for this specific act at all.
- The Desperate Cowboys (Derby) — page found, describes "mostly originals but with a few classic covers" with no genre named; too unspecific.
- Bet Shop Boys (Wilmslow) — page found (matches stored facebookUrl) but no genre content surfaced.
- Soundgenarator (Buxton) — no genre content found beyond the generic bio already stored.
- The Grey Numbers — search surfaced a differently-named band ("The Grey", Cambridge post-metal) with a similar but non-matching name; not the same act, not used.
- JD & the Parrots (Derby) — page found (matches stored facebookUrl) but no genre content surfaced.
- Chloe Anne (Portsmouth) — multiple same-first-name performers found; none confirmed as matching the stored facebookUrl's content.
- The Dark Horses (Derby) — three distinct bands of this name found (Orange County NY, Burton-on-Trent UK, Brighton UK); none confirmed as the specific Derby-listed act — collision risk, not attached.
- Umlaut Overload — page located but no accessible content; no genre evidence.

(barn54 + these 10 = 11 candidates sampled from the first page of `missingGenres` results; further pages not pulled this run.)

## Names corrected under §0.6

None written this run. All venue edits touched only `socialMediaUrls`/`website`; the artist edit touched only `genres`.

**Flagged, not corrected (out of scope for a socials/genre-only pass):**
- Railway Arches (`54a00c26-1401-4bce-9691-6993214a6ee0`) — confirmed via this run's own search to now trade as Signature Brew Haggerston (facebookUrl attached: `facebook.com/signaturebrewe8/`). This is the exact case named in RUNBOOK §0.6 ("Railway Arches" → "Signature Brew Haggerston", verify place_id unchanged first). Socials attached under the existing record; name left unchanged pending a dedicated §0.6 rename pass with a place_id check.
- Royal Penrith (`b7b80e70-1000-4ab4-a310-da7a7609a1f0`) — the venue's own branding/Facebook/website all read "The Royal", not "Royal Penrith". Socials attached; name left unchanged, flagged for a future §0.6 pass.

## Evidence file

Appended 31 lines to the shared `data/state/enrichment-evidence-2026-08-14-enrichment.jsonl` (30 venue lines keyed `venueId` — 25 verified/partial + 5 blank, 1 artist line keyed `artistId`) — all written **before** the corresponding bndy write. Verified line count 246→277 before/after this run's appends.

## Validator

Ran `scripts/enrichment_validate.py` against a constructed read-back of this run's 31 written/touched records and the evidence file.

Same already-logged validator scope gaps applied, worked around exactly as prior firings today:
1. `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` — built a validator-only records file with venue `socialMediaUrls`/`city` aliased to top-level `facebookUrl`/`location` (`data/state/validator-records-run-07.json`), and a validator-only evidence copy with `venueId` keys aliased to `artistId` (`data/state/validator-evidence-alias-run-07.jsonl`) — no data invented, a schema/key rename for validator input only. The real evidence file and bndy records keep their true schema.
2. `validator-genre-only-fb-evidence-mismatch` — barn54's `facebookUrl` and `bio` were pre-existing and untouched this run; the validator input blanked both fields for this record so the check falls back to the `searchVariants` evidenced-blank path rather than false-firing `FB_EVIDENCE_MISMATCH`/`BIO_VERBATIM` against an unrelated captured snippet.

Result, first pass, 0 FAIL:

```
31 records · 7 clean · 0 FAIL · 49 WARN   [mode=gate]
```

All WARNs are expected/known: `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 24 verified venues (venues carry no bio/image field under this task — FP.2); `NAME_BILLING` (parenthetical) on "Higham Sports & Social Club (The SAS)" — this is the venue's own real name, not a promo tail, not renamed.

**Validator summary line (verbatim): `31 records · 7 clean · 0 FAIL · 49 WARN   [mode=gate]`**

## Budget used

30/30 venues (cap reached). 1/15 artists genre-only (cap not reached — ran out of confident candidates in the sampled 11; did not pull further `missingGenres` pages this run). Wall-clock per heartbeat/claim timestamps: started 06:18:38Z.

## Circuit breaker

Not fired. No FAIL was outstanding at any point this run.

## Defects / rules / data found this run

No new fingerprint. All defects hit this run (`bv2a-facebook-not-logged-in`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-genre-only-fb-evidence-mismatch`, `bv2a-claim-path-stale-in-prompt`, `run-report-path-collides-second-firing`, `enrich-venue-batch-array-not-parsed`) are already logged in `CTO-INBOX.md` from earlier firings today — not re-logged.

Confirmed still live: `bv2a-facebook-not-logged-in` — eighth consecutive firing today blocked on artist Facebook work (socials/bio), now persisting 8+ hours across the day. Not re-logged as new, flagged here for visibility per the standing instruction.

## Ledger, snapshot, dashboards

- Appended 30 `enrich` lines (venue) + 1 `enrich` line (artist) + 1 `snapshot` line to `data/state/enrichment-ledger.jsonl`.
- Snapshot: `artistsTotal:2171, artistsMissingSocials:879 (unchanged — no artist socials work this run), artistsMissingGenres:641 (was 642, -1), venuesTotal:2588, venuesMissingSocials:924 (was 949, -25)`. Counts cross-checked against live `list_artists`/`list_venues` pagination.
- Appended 1 line to `data/state/run-summary.jsonl` (`recordsEnriched: 26` = 25 venue writes + 1 artist genre write; `skipped: 15` = 5 evidenced-blank venues + 10 rejected artist candidates).
- Regenerated `data/normalized/enrichment/DASHBOARD.html` (854 enrichment records, 32 snapshots) and `data/normalized/DASHBOARD.html`.

## Claim release

Released `data/state/claims/bv2a-enrichment.json` as the last action.
