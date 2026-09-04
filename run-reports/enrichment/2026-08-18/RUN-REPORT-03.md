# Bv2a Enrichment — Run Report — 2026-08-18 firing 03 (03:19:13Z)

## Outcome: COMPLETED

## Step 0 — Circuit breaker

Re-verified independently (not just relayed): `ls -la --time-style=full-iso data/normalized/enrichment/2026-08-18/` showed the three newest reports, newest first: RUN-REPORT-02.md (mtime 2026-08-18 03:29, COMPLETED, `30 records · 7 clean · 0 FAIL · 48 WARN`), RUN-REPORT-01.md (mtime 02:31, COMPLETED, `30 records · 11 clean · 0 FAIL · 39 WARN`), RUN-REPORT-00.md (mtime 01:31, COMPLETED, `28 records · 9 clean · 0 FAIL · 39 WARN`). 0 of 3 recorded a FAIL, all three exist and all three wrote a report. **Breaker NOT TRIPPED.**

## Step 1 — Concurrency

`data\state\claims\bv2a-enrichment.json` read at start: `{"heldBy":null,"releasedAt":"2026-08-18T02:30:00Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-18T02-18-08Z"}` — released. Used `data\state\claims\bv2a-enrichment.json` per the standing `bv2a-claim-path-stale-in-prompt` fingerprint, not the task prompt's stated path. No `data\state\enrichment.lock` file present; would not have been honoured or recreated in any case per §6A step 2b / v2.14.

Heartbeat written first: `data\state\heartbeat\bv2a-enrichment-2026-08-18T03-19-13Z.json`, `outcome:"started"`. Claim then acquired: `heldBy: bv2a-enrichment-2026-08-18T03-19-13Z`, `expiresAt: 2026-08-18T06:19:13Z` (3h TTL per §6G). Claim released at 03:38:01Z (`heldBy: null`) and heartbeat rewritten to `outcome:"completed"` as the last actions of this firing.

## Step 2 — Runbook / spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed (v2.27 ≥ v2.19). Read this firing (grep/sed by section heading): §0A/§0 prime directives (in full), §1/§1A identity, §2/§2A enrichment protocol in full (item 3b both-surfaces-before-blank, item 8 quoted-bio, §2A.2 mechanics), §3 venue protocol, §6/§6A run contract (steps 0, 1, 2, 2a, 2b, 3, 6, 7, 7b, 8), §6B platform facts, §6C failure classes, §6D-bis/§6D event identity, §6F/§6G concurrency (in full), §7 changelog tail. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail (last ~160 lines) read in full.

Open fingerprints used directly this firing: `bv2a-claim-path-stale-in-prompt`; `bv2a-oldest-backlog-not-globally-sorted` (list_venues fetched in FULL across 7 offsets of 100 — 649 of 649 missing-socials venues retrieved via Grep against the saved tool-result JSON files, id/name/city/createdAt extracted for every record, sorted client-side by `createdAt`); `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` (adapter script `build_validator_input_run0333.py` written this firing, following the `build_validator_input_run2217.py` pattern — venue `socialMediaUrls[0].url` aliased to top-level `facebookUrl`, `city` aliased to `location`, `venueId` evidence lines aliased to `artistId` for the loader); `validator-fb-evidence-mismatch-fp2-corroboration` (expected STUB_NO_BIO/STUB_NO_IMAGE WARNs on FP.2 venues — confirmed, not failures); `bv2a-firing01-ledger-mixed-json-formatting` (cooldown check used Python `json.loads` per line, not a text grep, against `enrichment-ledger.jsonl`).

## Step 3 — Tool verification

Chrome tested first, per orchestrator instruction, with `tabs_context_mcp`: **not connected**, two consecutive attempts, both non-transient ("Claude in Chrome is not connected... extension isn't reachable"). This is the **SIXTH consecutive firing** with this outage (22, 23, 00, 01, 02, this firing 03 — all 2026-08-17/18). Per the task prompt's hard-stop table, artist priorities 1 (new-artist missing socials), 4 (backlog artist missing socials) and 5 (artists missing genres with an existing facebookUrl) were **not attempted this firing** — this is not a hard stop for the whole task, only for the Chrome-dependent artist portion. bndy MCP tools reachable and used throughout. WebSearch reachable and used throughout.

## Step 3 — Work: venues (FP.2, no Chrome needed)

**Selection.** Priority 2 (venues created in the last 24h with missing socials) checked first: `list_venues(missingSocials:true, createdSince:<24h ago>)` returned **0 results** — nothing to work at that priority. Fell to priority 3: backlog venues missing socials, OLDEST createdAt first. `list_venues(missingSocials:true)` paginated in FULL across 7 offsets of 100 (offsets 0–600), 649 of 649 records retrieved (not sampled), id/name/city/createdAt extracted via Grep against the saved tool-result files, sorted client-side by `createdAt` ascending.

**Cooldown check.** `enrichment-ledger.jsonl` parsed line-by-line with Python `json.loads` (format-agnostic, per the standing mixed-formatting finding) for `type:"enrich", entity:"venue", outcome:"blank"` within the last 90 days: 94 unique venue ids excluded on that basis.

**Other exclusions applied before selecting the working set:** 9 venues skipped as garbled/non-venue/already-flagged-for-human-review from prior CTO-INBOX findings ("United match)" — garbled name; "1865, 1 Carlton Pl" — address mismatch flagged; "Jorge Wilson + Jesse James" — two artist names concatenated, not a venue; "Spaces Studio" — non-venue business; "Decade of Dance" — non-venue business; "Seabridge, Seabridge" — postcode mismatch flagged; "Venue TBC" — RUNBOOK §0.23 placeholder; "The Stumble Inn, Long Eaton" — blank city, in prior cooldown list; "EX39 4JN" — postcode used as a name, garbled). 14 non-UK venues (Lille, Paris, Stockholm, Athens, Thessaloniki, Gothenburg, Copenhagen, Dublin, Malmö, Skien, Drammen, Espoo, Haugesund, Hamburg) excluded per RUNBOOK §0.15 (bndy is UK-only) — flagged as a fresh CTO-INBOX finding below, since these look like a bulk non-UK capture batch, same class as the `bv2a-firing22-foreign-venues-one-batch` finding on 2026-08-17.

573 clean candidates remained. Worked the 30 oldest in order.

### Records enriched WITH a verified page (26)

All confirmed by `get_by_id` read-back (returned inline in the `edit_venue` response and matched on address/postcode against the search evidence in every case):

1. Meriton Road Park (Handforth) — `4c0e1c53-569b-41a2-8d53-e762a0593975` — facebookUrl
2. Darlington Market Square — `d64d5f40-2d35-4ed5-9e72-42acfabb0b9d` — facebookUrl
3. The Saracens Head, Wilderspool Causeway (Warrington) — `b59facf2-5a30-4469-8b2f-dabf23211757` — facebookUrl + website. Two candidate FB pages exist for this pub ("Saracens Head - Warrington" and "The Saracens Head wilderspool"); picked the one whose name matches the bndy record's "Wilderspool" naming. Same class as the `bv2a-firing23-kings-head-two-candidate-pages` precedent — low risk, not independently confirmed which is more current.
4. The Manor Inn (Torquay) — `670e1285-10cd-424c-be5e-4435343c1a53` — facebookUrl
5. Nutbrook Cricket Club (Ilkeston) — `e051dd0b-5447-435d-be4d-9380443703a7` — facebookUrl
6. Kensington Tavern (Derby) — `1298bede-43e3-40bc-8745-80c67836fb8c` — facebookUrl
7. The Malt Shovel Shardlow — `341700c1-d107-417b-be54-1c37e6fed5b2` — facebookUrl
8. The Red Lion (Kegworth) — `b7321963-c6b2-4f11-83be-6592637efa2b` — facebookUrl
9. White Hart Inn (Derby) — `986f0494-5955-4236-8619-03ba9c811caa` — facebookUrl. Note: bndy record reads city "Derby"; confirmed address is 68 Derby Road, Aston-on-Trent, DE72 2AF — a village just outside Derby, address confirmed exactly by the read-back, same class as prior address-more-specific-than-city findings.
10. The Cherry Tree Pennycross (Plymouth) — `94d70caf-a9df-40df-9606-1e2eae424106` — facebookUrl + website
11. Compton Social Club (Plymouth) — `153d8d96-de30-47b7-a0ed-036c1b4db017` — facebookUrl
12. The Falstaff Inn (Plymouth) — `c314e7ad-54da-49a7-8aaf-e5faf104118c` — facebookUrl
13. The Fishermans Arms (Plymouth) — `e2c1ab53-5e8a-480d-bb57-7e386c348a6d` — facebookUrl + website
14. The Bishop Blaize (Exeter) — `9c2c00b4-4b2f-4303-884c-04d627e508ab` — facebookUrl
15. Green Gables Inn (Exeter) — `261ee646-21e1-4dde-83a6-eecf681b710e` — facebookUrl
16. The Holt (Exeter) — `d81dd6a8-fb36-472e-95ff-764338713c55` — facebookUrl + website
17. Bridge Inn (Topsham) — `473585e8-91ec-415f-9e03-7e60c907676a` — facebookUrl + website
18. Hyde Park Social Club (Plymouth) — `beb58439-6015-47c5-af80-5e5889f8112b` — facebookUrl + website
19. Kitty O'Hanlons Plymouth — `4d000222-49e1-410b-8f23-afdb3a0be634` — facebookUrl + website
20. Marina Bar (Plymouth) — `9e37b1e4-029f-482a-91ff-c0c2aa811ea3` — facebookUrl + website
21. The Racehorse (Tiverton) — `7929df84-a13a-41b5-8b3c-40b2001c4820` — facebookUrl + website
22. Old Picture House (Seaton) — `e94e7839-3144-4be7-aba4-1346a805c581` — facebookUrl + website
23. The Swan Inn (Dawlish) — `374c9bc7-bb29-43db-a962-ac43bda1fcbe` — facebookUrl. Three candidate FB pages exist for this pub; picked the primary vanity-URL page (`swaninn.dawlish`) — not independently confirmed against the other two.
24. New Morley Arms (Plymstock/Plymouth) — `9b59ae78-3d7a-4b2f-aa36-17646170765f` — facebookUrl
25. Pier Masters House (Plymouth) — `09df31cb-6028-4d5c-aaa2-765557f3b47c` — facebookUrl + website
26. Radway Inn (Sidmouth) — `d600afb1-d4be-447e-9999-b9d2fa354644` — facebookUrl

### Records enriched with website only, no confident Facebook page (2)

27. The Prospect Inn (Exeter Quay) — `ec639133-63bf-4dbe-bdc0-0a505b82a8bd` — website `theprospectexeter.co.uk` written. Google returned the pub's own site and third-party listings (CAMRA, Heavitree Brewery, TripAdvisor) but no single confidently-the-venue's-own Facebook page URL — only event/post pages referencing the pub. Variants tried: `"Prospect Inn" Exeter facebook`, `facebook.com "Prospect Inn" Exeter Quay pub page`.
28. Mariners' Hall (Beer) — `f8935c06-e127-443d-a846-ab1b88d9861f` — website `marinershall.co.uk` written (a registered charity's own community-hall site). No dedicated Facebook page surfaced. Variants tried: `"Mariners Hall" Beer Devon facebook`.

### Records recorded as an EVIDENCED BLANK — no bndy write (2)

Both surfaces required by §2A.1 item 3b are Facebook-native search + Google; with Chrome down, Google alone was used per FP.2 (venues need no Chrome visit), consistent with the venue protocol which does not carry the artist-specific both-surfaces mandate. Neither website nor a confident Facebook page was found for either after two query variants each:

29. The Volunteer (Honiton) — `72563980-f7e8-4702-9365-4342804d1f0c` — variants tried: `"The Volunteer" Honiton facebook`, `facebook.com "The Volunteer" Honiton High Street pub page`. Only a Facebook group about the pub's classics nights surfaced (not the pub's own page), and no confirmed own website — nothing written.
30. The Quad Theatre (Marjon University, Plymouth) — `ae105b9d-1bbe-4ae3-9b76-3d08f67b696a` — variants tried: `"The Quad Theatre" Plymouth facebook`, `the quad theatre marjon plymouth facebook`. The venue's social media is run entirely under Barbican Theatre's own page (`facebook.com/BarbicanTheatrePlymouth`), not a dedicated Quad Theatre identity — per §2A.1's evidence bar this is not confidently *this* venue's own page, so left blank rather than attach a shared/borrowed identity.

### Records SKIPPED, and why

None skipped mid-batch. The 9 garbled/non-venue/flagged records and 14 non-UK records above were excluded during candidate selection, before any write was attempted — listed under "Other exclusions applied" above, not counted against the 30-record budget.

### Names corrected under §0.6

None this firing — no name corrections were needed on any of the 30 records worked (all bndy names matched the venue's own trading name closely enough that no rename was warranted).

## Validator

Built via the standing workaround pattern (`data/state/build_validator_input_run0333.py`, following `build_validator_input_run2217.py`'s approach) — venue `facebookUrl` aliased from `socialMediaUrls[0].url`, `location` aliased from `city`; `venueId` evidence lines aliased to `artistId` for the loader — per the standing `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` fingerprints. Records JSON and evidence JSONL built from the same 30 writes/non-writes made this firing.

**First run: 1 FAIL** — `FB_EVIDENCE_MISMATCH` on The Saracens Head, Wilderspool Causeway: the evidence line's `capturedFrom` was the pub's own website (used to source the address confirmation), not the Facebook page URL that was actually written to the `facebookUrl` field. Corrected by appending a supplementary evidence line keyed to the actual Facebook page URL (`facebook.com/p/The-Saracens-Head-wilderspool-61550267034690/`), re-ran.

**Validator summary line (verbatim, second and final run): `30 records · 4 clean · 0 FAIL · 52 WARN   [mode=gate]`**

WARNs: `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 26 Facebook-verified venues (expected — FP.2 venues carry no bio field and need no Chrome avatar fetch, per the standing `validator-fb-evidence-mismatch-fp2-corroboration`-class finding). No other WARN classes fired.

## Circuit breaker

Not fired. No FAIL outstanding in the final validator run.

## Budget used

30 venues worked (28 written to bndy, 2 evidenced blank) against the 30-venue / 15-artist / 40-minute budget. 0 artists worked (Chrome unreachable — hard stop on the artist portion only). Elapsed wall-clock this firing: approximately 19 minutes (03:19:13Z claim acquired → 03:38:01Z claim released), within the 40-minute ceiling.

## Ledger, snapshot, run-summary, dashboards

- Appended 30 `type:"enrich"` lines to `data/state/enrichment-ledger.jsonl` (28 `outcome:"verified"`, 2 `outcome:"blank"`), plus one `type:"snapshot"` line: `artistsTotal:2222, artistsMissingSocials:861, artistsMissingGenres:612, venuesTotal:3002, venuesMissingSocials:622` (from live `list_artists`/`list_venues` pagination.count at 03:35–03:36Z).
- Appended one line to `data/state/run-summary.jsonl`: `{"date":"2026-08-18","task":"enrichment","finishedAt":"2026-08-18T03:33:55Z","outcome":"completed","gigsAdded":0,"artistsAdded":0,"venuesAdded":0,"recordsEnriched":28,"skipped":2,"note":"30 venues worked, 28 written, 2 blank. Chrome down, artists skipped."}`
- Regenerated both dashboards: `data/normalized/enrichment/DASHBOARD.html` (1655 enrichment records, 53 snapshots) and `data/normalized/DASHBOARD.html`.

## CTO-INBOX — new entries this firing

One new fingerprint raised (sixth-consecutive-firing Chrome outage) and one data finding on a batch of non-UK venues encountered while sorting the backlog (not previously logged as a fresh finding by id, though the same class was noted 2026-08-17). See the appended lines in `CTO-INBOX.md`.
