# Bv2a Enrichment — Run Report — 2026-08-15, firing 17

**Outcome: COMPLETED, with one self-inflicted defect logged.**

Run id `bv2a-enrichment-2026-08-15T17-18-29Z`. Claim acquired 17:18:29Z, released 17:32:00Z.

## Step 0 — Circuit breaker

Last 3 run reports (newest first): RUN-REPORT-16 (COMPLETED, `38 records · 18 clean · 0 FAIL · 41 WARN`), RUN-REPORT-15 (STOPPED, locked, zero writes, no validator run), RUN-REPORT-14 (STOPPED, locked, zero writes, no validator run). 0 of 3 recorded a FAIL. All three exist as reports, so "ran and wrote no report" does not apply. **Breaker NOT TRIPPED.**

## Step 2 — Runbook / task spec / inbox read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full: §0 prime directives, §1/§1A identity, §2/§2A enrichment protocol (item 3b both-surfaces, item 8 quoted-bio), §6/§6A run contract in full, §6B–§6E, §6F/§6G concurrency in full, §7 changelog.

`ENRICHMENT-TASK-v3.md` §0.0 and §FP fast path read.

`CTO-INBOX.md` read; open fingerprints noted, none re-logged as duplicates except one new one (see below): `bv2a-claim-path-stale-in-prompt`, `bv2a-claim-locked-consecutive-firing`, `validator-fb-evidence-mismatch-fp2-corroboration` (used directly), `bv2a-edit-artist-409-on-facebookurl-write`, `danny-and-friends-duplicate-of-danny-brab`, `bv2a-firing13-died-mid-run-claim-recovered`.

## Step 1 / §6A step 2b — Concurrency

Checked `data\state\claims\bv2a-enrichment.json` (real path per standing fingerprint): released (`heldBy: null`, `lastRun: bv2a-enrichment-2026-08-15T16-19-42Z`). Acquired cleanly (table row 1, file present and released). Wrote heartbeat `bv2a-enrichment-2026-08-15T17-18-29Z.json`.

## ⚠ Self-inflicted defect this firing

Early in the run I used a file-write tool that **overwrote rather than appended** `enrichment-evidence-2026-08-15-enrichment.jsonl`, destroying every prior firing's evidence lines for today (firings 6 through 16), unrecoverable — no git history or backup exists in this environment. This is exactly the failure class §6F/v2.9 was written to prevent, this time self-inflicted rather than a genuine concurrent-writer collision. Logged to `CTO-INBOX.md` as `bv2a-firing17-evidence-file-overwritten` immediately on discovery. From that point on, every further write to the evidence file, ledger, run-summary and CTO-INBOX used append-only shell redirection, never a whole-file rewrite. No downstream consequence to already-shipped work: firing 16's batch had already passed its own validator run and been reported before this happened, so its shipped bndy data is unaffected — only the forensic evidence trail for firings 6–16 is now unrecoverable.

## Priority order worked

1. Artists created <24h, missing socials — 16 candidates, all Staffordshire/Greater Manchester `mcp_ai_import` rows from 05:37–05:41Z, all confirmed already attempted today (evidence lines found in today's per-firing files under other run ids, checked before the evidence file was damaged). Not re-attempted. `Danny & Friends` `d27e100b` excluded — it is the standing duplicate-of-Danny-Brab fingerprint, not an enrichment target.
2. Venues created <24h, missing socials — 0 candidates.
3. Backlog venues missing socials, oldest first — **worked below, full 30/30 budget.**
4. Backlog artists missing socials, oldest first — **partially worked, see below.**
5. Not reached.

## Venues — 30 records, 26 enriched (23 verified via Facebook, 3 website-only), 4 evidenced blank

Fast path (§FP.2): WebSearch only, no Chrome needed. Selected the genuinely oldest-`createdAt` unattempted-today candidates across two `list_venues(missingSocials=true)` pages (offsets 0 and 40, 831 total), cross-checked against today's evidence file before it was damaged and again by grep afterwards.

**Verified with Facebook (23):** Cross Keys Country Pub (Hamsterley) `34f81279`, The Keys (Stratford-upon-Avon) `602c26b3`, Grangemoor Working Men's Club (Burntwood) `08547c76`, The Monastery (Manchester) `daf3d7d7`, The Royal Oak (Biddulph) `7d2130e9`, Bollington Taproom/Brewery Tap (Macclesfield) `bb743009`, The Bhurtpore Inn (Nantwich) `a88c1b8f`, Ramsgate Music Hall `9be13adb`, Pinhoe Parish Church (Exeter — benefice page "Pinhoe and Poltimore with HOPE", not a page under the exact stored name) `4d10a36f`, Teignmouth Inn (Dawlish) `9a53d959`, The Den (Teignmouth) `4cbc8307`, George & Dragon (Dartmouth) `5be7f9e5`, Kingsteignton RBL Club `b52f9eb7`, The Kings Arms (Kingsteignton) `878a8ec9`, The Drakes Drum (Plymstock) `0e694927`, California Inn (Modbury — page's postal town reads Ivybridge, same crossroads location) `152b6710`, The Hermitage Inn (Kingsbridge) `dacfb508`, The Ship Inn (Polperro) `80f2b6ae`, Callington Social Club `5a63b255`, The Halfway House Inn (Kingsand) `436d6d70`, Topsham Town F.C. `933ec3f7`, Old school shack / Old School Pelynt `55b3acd4`, The Queens Head Hotel (St Austell) `45e36994`.

**Verified, website only, no Facebook page found (3):** Chell Social Club (Stoke-on-Trent) `8e1c012b` — own site chellsocialclub.com, no facebook.com URL surfaced on two searches; The New Florence (Dresden/Longton) `63f7392c` — Greene King brand page, Instagram only, no Facebook surfaced; Tamar (Crownhill, Plymouth) `6c4439f2` — Greene King brand page, no Facebook surfaced.

**Evidenced blank (4):** Darley Park (Derby) `beb9fcaa` — only a generic council "Derby Parks" page covering many parks, not confidently this specific gig venue; Hayfield Club (High Peak) `cf792645` — no match on stored Church Street address, only a different-address Conservative Club and unrelated same-name clubs elsewhere; Jubilee Park (Horndean) `2ebace81` — council recreation ground, no own social page; The Saracens Head (Newton Abbot) `d2640e2e` — only an unrelated same-name pub in Newton Green, Suffolk, found.

No §0.6 name corrections needed this firing. No do-not-attach list matches.

## Artists — 6 Google-searched, 0 written

Fast path (§FP.3) step 2 only (WebSearch) run against the 6 oldest backlog candidates: Sully and Co `76cf390e`, The House Katz `16ed5a04`, Mix 'N' Match `167d9aa4`, One Night Stand `d48795c5`, Jon Casey Blues Band `318a5946`, Glen Franklin `39f9982f`. None returned a confident UK match on Google alone. **§2A.1 item 3b requires both surfaces (Google AND Facebook's own search via Chrome) before any blank may be recorded**, and with the venue batch having used the working time available, Facebook's own search was not run for these 6. Per §0A doctrine, left **untouched rather than recorded as an under-evidenced blank** — no edit, no evidence line, nothing written. The next run should pick these up and complete the Facebook-side check before deciding verified/blank.

## Validator

`scripts\enrichment_validate.py` run against all 30 venue records touched this firing, evidence from `data\state\enrichment-evidence-2026-08-15-enrichment.jsonl` (this firing's 30 lines only — see the defect above for why earlier firings' lines are gone).

Built via the standing workaround pattern (`data\state\build_validator_input_run1729.py`) — venue name/city aliased to top-level location, venueId evidence lines aliased to artistId, per the standing `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` fingerprints.

**First run: 2 FAIL, both `FB_EVIDENCE_MISMATCH`** — Cross Keys (`capturedFrom` was the `/pages/Name/id/` form, stored `facebookUrl` canonicalised to the bare numeric URL) and The Den (`capturedFrom` was `m.facebook.com`, stored canonicalised to `www.facebook.com`) — same page in both cases, only the URL form differed. Re-aliased `capturedFrom` to the stored canonical form for those 2 records in the validator-input build only (the underlying evidence file line itself was left untouched). Re-ran.

**Validator summary line (verbatim): `30 records · 7 clean · 0 FAIL · 46 WARN   [mode=gate]`**

WARNs are `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 23 Facebook-verified venues (expected — §FP.2 venues carry no bio field and no Chrome avatar fetch).

## Circuit breaker

Not fired. No FAIL outstanding in the final validator run.

## CTO-INBOX

One new line: `bv2a-firing17-evidence-file-overwritten` (own error — see above). Not re-logging any of the standing open fingerprints used this firing.

## Ledger, snapshot, run-summary

Appended 31 lines to `enrichment-ledger.jsonl`: 30 enrich lines (26 `verified`, 4 `blank`) and 1 snapshot line.

Snapshot: `artistsTotal: 2209`, `artistsMissingSocials: 879` (unchanged — no artist writes), `artistsMissingGenres: 633` (unchanged), `venuesTotal: 2967`, `venuesMissingSocials: 805` (down from 831).

Appended `run-summary.jsonl`: `{"date":"2026-08-15","task":"enrichment","finishedAt":"2026-08-15T17:31:00Z","outcome":"completed","gigsAdded":0,"artistsAdded":0,"venuesAdded":0,"recordsEnriched":26,"skipped":10,"note":"30 venues worked (26 socials added, 4 evidenced blank); 6 artists Google-searched only, left untouched, no FB-surface check"}`.

Both dashboards regenerated: `data\normalized\enrichment\DASHBOARD.html` (1345 enrichment records, 44 snapshots) and `data\normalized\DASHBOARD.html`.

## Budget

30/30 venues, 0/15 artists written (6 partially researched, left untouched). Circuit breaker did not fire. Wall-clock: roughly 17:18:29Z to 17:32:00Z.

## Claim / heartbeat

Claim released: `{"heldBy":null,"releasedAt":"2026-08-15T17:32:00Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-15T17-18-29Z"}`. Heartbeat `bv2a-enrichment-2026-08-15T17-18-29Z.json` rewritten to `"outcome":"completed"`.
