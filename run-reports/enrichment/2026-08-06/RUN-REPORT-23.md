# ENRICHMENT RUN — 2026-08-06 22:37–23:30 UTC (Bv2a Enrichment, manually kicked off by Jason)

**Mode: NOT unattended.** Jason was present in chat throughout and explicitly directed this run to proceed past a stale-lock stop. Everywhere this report says "flagged" or "not enriched", nothing was written to bndy for that record.

## What happened before this report

An earlier automated firing of this same task at 22:37 UTC ran Step 0 (circuit breaker — passed, 0 FAILs in the last 3 reports) and Step 1 (concurrency lock), found `data\state\enrichment.lock` **942 seconds (~15.5 min) old** — under the 55-minute staleness threshold — and stopped per the rule, writing nothing. That is recorded separately in `2026-08-06/LOCKED-22.md`.

Jason then said the task "has not completed for days due to desktop access" and asked me to push it through manually now, to prepare for re-enabling the schedule. Both `rm` (bash) and `allow_cowork_file_delete` failed to delete the lock file outright ("Operation not permitted" / "Could not find mount for path") — the same platform limitation the 2026-08-04 run hit. With Jason's live authorization, I overwrote the lock's content with a fresh timestamp and proceeded, rather than treating the stale marker as a genuine block.

## Step 2 — preconditions

- RUNBOOK.md H1 version: **v2.8**, meets CURRENT FLOOR v2.8. Pass.
- ENRICHMENT-TASK-v3.md §0.0, §FP read in full. Version floor v2.3 — met.
- OPEN-RULINGS.md standing rulings read; nothing blocks this task.
- bndy MCP tools reachable (confirmed via `list_artists`/`list_venues`). `createdAt`/`createdSince` filter is now returning real values — the read-side defect logged 2026-08-01 and re-confirmed fixed on 2026-08-04 remains fixed.
- Chrome: exactly one browser connected, logged in to Facebook as Jason Jones. Precondition met.

## Selection

Per §3 priority order:
1. Artists created <24h, missing socials: **6** found, all worked.
2. Venues created <24h, missing socials: **2** found, all worked.
3. Backlog venues missing socials, oldest `createdAt` first: **28** worked (budget exactly filled: 2 + 28 = 30).
4. Backlog artists missing socials, oldest `createdAt` first: **9** worked (6 + 9 = 15).
5. Artists missing genres with facebookUrl: not reached — artist budget filled by priorities 1+4.

## Venues — 30/30 attempted (budget cap)

**24 verified with a Facebook page found**, address/name cross-checked against the source before writing (Tier A/B — address or phone match): Bees Knees (Rawtenstall) · Shooters Arms (Nelson) · The Farmers Union (Exeter) · The Spring Arts & Heritage Centre (Havant) · The Union Inn (Saltash) · Bird In Hand (Fareham) · The Lodge Inn, Alsager · Railway Inn (Greenfield) · Dartmouth Yacht Club · Kingstone (village hall) · The Royal Standard (Lyme Regis) · The Rising Sun (Botusfleming) · The Armoury (Yeovil) · The Treasury (Plymouth) · Stags Head (Esh Winning) · Cullercoats Crescent Club · Foaming Quart (Norton, Stoke) · The London Inn (Okehampton) · Coal & Cotton (Boothstown) · Sir Joshua Reynolds (Plympton) · The Bridge (Ashbourne) · Kings Arms (Taunton) · The Blisland Inn · The Black Horse (Sidmouth) · The Crown Inn (Bridport) · Pavilion Tearoom (Burslem Park).

**1 verified with caveats — Cheshire County Show**: this is an agricultural showground, not a fixed pub/venue. Flagged per RUNBOOK §0.23's spirit (same handling as *Bolton Food & Drink Festival* in the 2026-08-04 report) — enriched as an existing record, not created, with facebookUrl set to the Royal Cheshire Show's official page (address matches exactly). Worth Jason's eyes.

**1 verified, one field only — The Mason's Arms.**: a second same-name pub exists in the same city; the attached page (`themasonsarmsnorthwood`) was chosen on a phone-number + address match (Tier B, two signals), not certainty. Flag for spot-check.

**1 website-only, evidenced blank on Facebook — The Old Talbot** (Hilton, Derby): website confirmed, but only a Facebook Group and Facebook Events turned up for the page itself — no dedicated page found, so facebookUrl was left blank rather than attaching a group.

**1 fully evidenced blank — Green Posts** (Portsmouth): two search variants tried (general + `facebook.com`-restricted), no resolvable page or website found. Nothing written.

## Artists — 15/15 attempted (budget cap)

**1 verified with a page and a quoted bio — The Beatniks** (Hampshire): `facebook.com/Beatniks.duo/`, Musician/band, 1.2K followers, location-consistent. Bio quoted **character for character** from the page's About tab (confirmed by screenshot, not just the accessibility tree, because Facebook's own DOM truncates the aria-label). Genres inferred from the page's own words ("60s/70s") → `60s`, `70s`. actType inferred → `covers`. No image was available to attach (flagged `STUB_NO_IMAGE` by the validator — correctly, nothing was skipped).

**14 evidenced blanks**, all governed by "blank beats wrong":
- **Patch Collins, Sophie Jenkinson** — no match on **both** surfaces (Google + Facebook page search, page search results confirmed empty of any relevant candidate).
- **Jon Casey Blues Band** — a real, well-documented band (Merseyside, blues-rock, released an album, supported Dr Feelgood) with an **archived directory profile explicitly stating it has no Facebook page**. Strong evidence of genuine absence, not just an unsuccessful search.
- **Mix 'N' Match** — only non-UK candidates found (Philippines, Virginia, Netherlands) — rejected per §2A.1.1, never attach a non-UK page.
- **T Junction** — two competing candidates (a wedding band and an acoustic duo), neither confirmed to Hampshire or to our record's "band" type. Near-miss, flagged rather than guessed.
- **The Black Jeans Party Rock Band** — a real "The Black Jeans" page exists but is a Birmingham indie-rock wedding band, branding and area both mismatched against our Staffordshire "Party Rock Band" record. Rejected near-miss (Tier C — name+genre alone is never sufficient), flagged.
- **Jam Halen** — the search results describe this as a *weekly jam/open-mic night* at a Torquay pub, not a fixed act. This may be a mis-imported non-act record (the runbook's residency/night pattern, §0.4-adjacent). **Not enriched, flagged for Jason** — may need reclassifying rather than enriching.
- **Simon Hopper Band** — only a personal Facebook profile for the named member was found, not a band page; personal profiles are never attached (§2A.4).
- **Terri and the Waders, Grace Curran, Let'z Rock, Hero's of Rock, Aaron & Jake, Blind 90** — Google search returned no confident match for any of these six. Facebook's own page search was attempted for Terri and the Waders and Grace Curran but the results had not finished loading at capture time; it was **not completed** for Let'z Rock, Hero's of Rock, or Aaron & Jake due to the time already spent on this batch. **These six should be the first candidates re-tried next run** — Blind 90 in particular has an `insangel` source page that would normally be checked first (§4 Phase A) but `insangel.co.uk` is off the sandbox's egress allowlist (per OPEN-RULINGS 2026-08-06) and this run did not route around that via Chrome.

## Names corrected under §0.6

None this run — no billing-contaminated names encountered in this batch.

## Validator (RUNBOOK §6A step 8)

`scripts\enrichment_validate.py` is artist-shaped (checks `facebookUrl`/`bio`/`location` by those field names). As in the 2026-08-04 run, venues were fed through a **validation-only shim** (venue `socialMediaUrls`-facebook → `facebookUrl`, `city` → `location`) purely to run the checks — no bndy field names or data were changed by this step. Two venues (Foaming Quart, The Crown Inn) carry a `null` city in bndy despite having a full address and a geocoded `google_place_id` — the shim substituted the town from their address for validation purposes only, since the check exists to catch missing location, not a missing `city` string specifically.

**Validator summary line (final):**
```
31 records · 2 clean · 0 FAIL · 57 WARN   [mode=gate]
```
All 57 WARNs are `STUB_NO_BIO`/`STUB_NO_IMAGE` — expected noise from venues (no bio field, avatar out of scope) plus one genuine `STUB_NO_IMAGE` on The Beatniks (no image was available to collect). No FAILs outstanding; the batch ships.

## Ledger & dashboard

- 45 `enrich` lines appended to `enrichment-ledger.jsonl` (30 venues + 15 artists), plus 1 `snapshot` line.
- Snapshot (2026-08-06T23:30Z): artistsTotal 1905, artistsMissingSocials 775, artistsMissingGenres 682, venuesTotal 2099, venuesMissingSocials 875.
- `DASHBOARD.html` regenerated: 119 enrichment records, 5 snapshots, exit 0.

## Budget used

**Venues:** 30/30 (cap reached). **Artists:** 15/15 (cap reached). **Time:** well over the 40-minute figure in the task budget — this was a manually-authorized catch-up run after several days without one, not a routine hourly pass, and Jason asked to see how far it could be pushed rather than cut at 40 minutes. Flagging this honestly rather than under-reporting elapsed time.

**Circuit breaker:** did not trip (checked against the last 3 reports at the top of this run — 0 recorded FAILs).

**Lock:** at the time of writing, both `rm` and `allow_cowork_file_delete` still failed on `data\state\enrichment.lock` ("Operation not permitted" / "Could not find mount for path"), so the plan was to overwrite it with a RELEASED marker as the final action, same as 2026-08-04. When the edit was attempted, the file had **already disappeared** — it now exists as `data\state\RETIRED-enrichment.lock-2026-08-06` (renamed, not deleted, content preserved). Something outside this run's control — most likely the platform completing the earlier delete request asynchronously, or Jason acting on the `LOCKED-22.md` recommendation — resolved it. Net effect is exactly what was wanted: **no `enrichment.lock` exists**, so the next scheduled run's Step 1 check starts clean with no wait.

## Recommendation before re-enabling the schedule

1. Delete the lock file by hand (above) — this is now the *third* run in a row affected by the same delete failure.
2. Fix or accept the delete-permission gap: `allow_cowork_file_delete` returned "Could not find mount for path" for a file that both `Read` and `Edit` could reach at the identical path — worth a look before relying on it for future runs.
3. Six artists (Terri and the Waders, Grace Curran, Let'z Rock, Hero's of Rock, Aaron & Jake, Blind 90) had incomplete second-surface (Facebook) checks this run — good first candidates for the next pass.
4. Jam Halen — check whether this is really an artist record or a mis-imported open-mic night.
