# Bv2a Enrichment — Run Report 04 (2026-08-18)

Run id: `bv2a-enrichment-2026-08-18T04-18-28Z`. Unattended hourly firing.

## Step 0 — Circuit breaker

Read the last 3 run reports directly (newest first): RUN-REPORT-03 (2026-08-18, COMPLETED, `30 records · 4 clean · 0 FAIL · 52 WARN`), RUN-REPORT-02 (2026-08-18, COMPLETED, `30 records · 7 clean · 0 FAIL · 48 WARN`), RUN-REPORT-01 (2026-08-18, COMPLETED, `30 records · 11 clean · 0 FAIL · 39 WARN`). 0 of 3 recorded a FAIL, all three exist as reports and all three wrote a report. **Breaker NOT TRIPPED.**

## Step 1 — Concurrency

`data\state\claims\bv2a-enrichment.json` read at start: `{"heldBy":null,"releasedAt":"2026-08-18T03:38:01Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-18T03-19-13Z"}` — released. Used `data\state\claims\bv2a-enrichment.json` per the standing `bv2a-claim-path-stale-in-prompt` fingerprint, not the task prompt's stated path. No `data\state\enrichment.lock` file present; not honoured, not recreated (§6A step 2b / v2.14).

Heartbeat written first: `data\state\heartbeat\bv2a-enrichment-2026-08-18T04-18-28Z.json`, `outcome:"started"`. Claim then acquired: `heldBy: bv2a-enrichment-2026-08-18T04-18-28Z`, `expiresAt: 2026-08-18T07:18:28Z` (3h TTL per §6G).

## Step 2 — Runbook / spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read this firing: §0A/§0 prime directives, §1/§1A/§2/§2A enrichment protocol in full (item 3b both-surfaces, item 8 quoted-bio), §3 venue protocol, §6/§6A run contract, §6F/§6G concurrency, §7 changelog tail. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail read in full.

Open fingerprints used directly this firing: `bv2a-claim-path-stale-in-prompt`; `bv2a-oldest-backlog-not-globally-sorted` (list_venues fetched across 7 offsets of 100, 623 of 623 missing-socials venues retrieved, id/name/city/createdAt extracted and sorted client-side by `createdAt`); `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` (adapter script `build_validator_input_run0418.py` written this firing, following the `build_validator_input_run0333.py` pattern); `validator-fb-evidence-mismatch-fp2-corroboration` (expected STUB_NO_BIO/STUB_NO_IMAGE WARNs on FP.2 venues); the enrichment-ledger cooldown check was run as a Python `json.loads`-per-line parse (format-agnostic) against the full ledger, not a text grep, per the standing `bv2a-firing01-ledger-mixed-json-formatting` fingerprint.

## Step 3 — Tool verification

Chrome tested first with `tabs_context_mcp`: **not connected**, two consecutive attempts (`createIfEmpty:false` then `true`), both non-transient. This is the **SEVENTH consecutive firing** with this outage (22, 23, 00, 01, 02, 03, this firing 04 — spanning 2026-08-17 22:17Z to 2026-08-18 04:18Z, over six hours). Per the task prompt's hard-stop table, artist priorities 1, 4 and 5 were **not attempted this firing**. bndy MCP tools reachable and used throughout (confirmed live via `list_venues`, `list_artists`). WebSearch reachable and used throughout.

## Step 3 — Work: venues (FP.2, no Chrome needed)

**Selection.** Priority 2 (venues created in the last 24h with missing socials): `list_venues(missingSocials:true, createdSince:2026-08-17T04:18:28Z)` returned **2 results** — The Black Bull (Blaydon-on-Tyne, onthecasemusic capture) and The Butchers Arms (Forsbrook, Stoke-on-Trent). Both worked first.

Priority 3 (backlog venues missing socials, oldest `createdAt` first): `list_venues(missingSocials:true)` — count 623 at start. Paginated in FULL across 7 offsets of 100 (0–600), all 623 retrieved (not sampled) via `Grep` against the saved tool-result files (six of seven `list_venues` calls exceeded the inline token cap and were auto-saved to disk this firing — read back via a targeted regex extracting only the `id`/`name`/`city`/`createdAt` fields at their exact JSON indent level, rather than re-reading full records, to keep this affordable). Deduplicated and sorted client-side by `createdAt` ascending.

**Cooldown check — done properly this firing.** `enrichment-ledger.jsonl` parsed with a Python script (`json.loads` per line, format-agnostic) for every `type:"enrich", entity:"venue", outcome:"blank"` line ever written (96 unique venue ids, the ledger's entire history from 2026-08-01 being inside the 90-day window). This is worth flagging explicitly: an initial manual read of the last few run reports' own "excluded" prose lists under-counted the true cooldown set — cross-checking the ledger directly by id caught roughly two dozen venues (including several read as "untouched, genuinely old" candidates at first pass — e.g. Swan Inn Stone, The Railway Stockport, Wolstanton Social Club, White Lodge Stafford, The Bulls Head Baildon, Fox & Hounds Newcastle, The Nest Stoke-on-Trent) that had in fact already been recorded blank by an earlier firing today. All 96 were excluded from this firing's candidate pool.

**Other exclusions applied before selecting the working set:** §0.23 non-fixed-place venues already flagged in prior firings' reports (Meriton Road Park, Darlington Market Square, Venue TBC, Jubilee Park Horndean, Madeley Carnival, Newsham Park & Garden, Ann Welfare Playing Fields) were within the ledger-blank set already and excluded on that basis too; the garbled name "United match)" and "Jorge Wilson + Jesse James" were skipped as non-venue names, not searched.

30 oldest-eligible records taken (2 priority-1 new + 28 backlog), backlog `createdAt` ranging **2026-05-14 (The Harbour Inn, Padstow) to 2026-07-31 (The Teign Brewery, part of the same large 2026-07-31 Devon/Cornwall capture batch worked by prior firings).**

### Records enriched WITH a verified page (25, all with facebookUrl; 8 of these also website)

All confirmed by the `edit_venue` response (which echoes the updated record) and matched on address/postcode against the search evidence in every case:

1. The Black Bull (Blaydon-on-Tyne) — `8c01731e-9a75-47d5-958a-fc06161cd8f6` — facebookUrl
2. The Butchers Arms (Forsbrook, Stoke-on-Trent) — `468d27bb-e085-4628-b4ec-0cadf54008b5` — facebookUrl
3. The Harbour Inn (Padstow) — `eaca6126-4554-4657-9ee1-cee1f3b902bb` — facebookUrl
4. The Rock Inn (Roche) — `23690fd5-b393-4701-b877-715cc704a5f7` — facebookUrl
5. Preston Conservative Club (Paignton) — `a87c57e5-f9f2-4d67-a4c1-31bdcc29577f` — facebookUrl
6. Newton Abbot Rugby Football Club (Kingsteignton) — `33fd435e-a216-475a-9f06-1767373f2c7b` — facebookUrl. Identity confirmed by club name/history ("Chasing an egg since 1873"), not an address snippet — high confidence, single unambiguous club.
7. Victoria Social (Bere Alston) — `e13a3831-8d73-445b-ac91-9c1806cbefd5` — facebookUrl
8. The Guillemot Bar (Westward Ho!) — `90ca117f-0ef5-4202-b9b4-50cf5ff0c191` — facebookUrl + website
9. The Country House Inn, Exmouth — `ad32a2fa-48bf-47a1-8028-d8e8aea9dab1` — facebookUrl + website. Two other same-name candidate FB pages exist (61569537524113 "The Country House", 61586391216200); picked the established page (`countryhouseexmouth`, 2,140 likes) matching the pub's own website.
10. George & Dragon (Ilfracombe) — `b696f4f4-c738-48c9-a265-2f5b18a98f1b` — facebookUrl + website
11. The Stand Off (Exeter) — `69bc8fd9-165d-4b74-a078-86dcaf71d937` — facebookUrl + website
12. Welcome Home Inn (Par) — `3d9e5efd-c07c-4594-bd7b-e786306c7fb8` — facebookUrl
13. The Royal Castle (Dartmouth) — `9010a196-7fbe-4c03-9f67-b7167794bf1a` — facebookUrl + website
14. The Llawnroc (Gorran Haven) — `d7cf888f-bb8e-405f-9287-747a2b90e7b9` — facebookUrl + website. Now trades primarily as a guest house rather than a pub, but the address (Chute Lane) matches the bndy record exactly.
15. The Royal British Legion (Fowey) — `7dbdc0ee-0b35-4973-9306-f9890d1b264d` — facebookUrl
16. St Blazey A.F.C. — `9f30c4a9-75e4-44af-828a-af0d069377d3` — facebookUrl. Two candidate pages exist; picked the actively-engaged one (2,885 likes, 709 talking about it) over a bare numeric-id page.
17. Ten Tors Inn (Kingsteignton) — `4c1fc9e4-86e1-4997-bd5c-7bab456a39a0` — facebookUrl + website
18. The Market House Inn (Dartmouth) — `c325ae40-42c0-42ac-ba27-85a865fb941a` — facebookUrl. bndy name "Market House Inn" vs page name "The Market House Dartmouth" — same address (1 Market St TQ6 9QE) and description ("Dartmouth's No1 traditional pub") confirm same venue.
19. Seven Stars Winkleigh — `47604a14-7ac2-4954-8489-0789f82304df` — facebookUrl
20. Seamus O'Donnells (Torquay) — `1f9f2424-409c-496a-b2d2-69337a39dcf6` — facebookUrl. Two candidate pages exist; picked the higher-engagement one (1,614 likes / 23,476 check-ins vs 1,261 likes).
21. Sandy Park (Exeter) — `9cb97427-f825-4f8f-99c8-529749273c54` — facebookUrl + website
22. The Fishermans Arms (Looe) — `06861875-adf6-4317-81ae-9138f13ff3e6` — facebookUrl
23. Prince Of Wales (Falmouth) — `d2f2c4e8-c840-4018-8987-3cfad6b23cea` — facebookUrl. Four candidate pages exist for this pub; picked the one whose quoted description ("billing itself as a music venue") matched the search snippet directly — not independently confirmed against the other three, same risk class as the `bv2a-firing23-kings-head-two-candidate-pages` precedent.
24. The Rising Sun (Gunnislake) — `f13bdaf7-fb7b-4f83-bfb5-e867cd9d14fc` — facebookUrl + website
25. The Teign Brewery (Teignmouth) — `90d94ef7-c49f-432d-8290-d66bf05eb85a` — facebookUrl. Distinct from a separate "Teignmouth Brewery" beer producer with its own page — correctly disambiguated on description text.

### Records enriched with website only, no confident Facebook page (2)

26. The Rising Sun Inn (Eggbuckland, Plymouth) — `246afe42-eee8-43d3-a6a0-639e6e679ebc` — website `therisingsunplymouth.com` written. Two candidate FB pages exist (100050009813600, 61565597731889) with no way to confirm which is current — own website used instead.
27. The Ship, Plymouth (The Barbican) — `cc14e26a-057a-454b-be80-1fa2b75b0255` — website `theshipplymouth.co.uk` written. No confidently-the-venue's-own Facebook page URL surfaced across two query variants, only third-party aggregator listings.

### Records recorded as an EVIDENCED BLANK — no bndy write (3)

28. Okehampton Show ground — `adc02e06-b7a8-41d0-8adc-48ca78465f1c` — variants tried: `Okehampton Showground facebook`, `Okehampton Show Ground New Road Cross facebook`. The only confident Facebook page found ("Okehampton Show", 6,568 likes) states its site as Stoney Park Showground, Holsworthy Road, Okehampton **EX20 1SW** — the bndy record's address is New Road Cross, Okehampton **EX20 4LP**, a different postcode. Not confidently the same site — left blank rather than attach a mismatched address. Flagged below as a possible record-quality issue.
29. Newton Abbot 76 Sports & Social Club — `35b5ed32-4596-477a-a5c0-33382ef8dbe3` — variant tried: `"Newton Abbot 76" sports social club facebook`. Three competing Facebook pages exist (100090305283669, 61558612016904 "New Page", 61577680903170) with no way to confirm which is current without a Chrome visit — left blank.
30. The Cattedown — `31d2dea1-5921-4377-8cd4-3a1f13543fdb` — variant tried: `"Cattedown" social club Plymouth facebook`. Two competing pages exist, both informal "people"-profile-style URLs (100083359206010, 100083439272575) rather than a confirmed business Page — left blank rather than attach an unofficial-looking profile.

### Records SKIPPED, and why

None skipped mid-batch from the 30-record working set. Garbled/non-venue names ("United match)", "Jorge Wilson + Jesse James") and all 96 ledger-cooldown ids were excluded during candidate selection, before any write was attempted, and are not counted against the 30-record budget.

### Names corrected under §0.6

None this firing — no name corrections were needed on any of the 30 records worked.

## Validator

Built via the standing workaround pattern (`data/state/build_validator_input_run0418.py`, following `build_validator_input_run0333.py`'s approach) — venue `facebookUrl` aliased from `socialMediaUrls[0].url` (empty string where blank/website-only), `location` aliased from `city`; `venueId` evidence lines aliased to `artistId` for the loader — per the standing `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` fingerprints. Records JSON and evidence JSONL built from the same 30 writes/non-writes made this firing.

**Validator summary line (verbatim, first and only run): `30 records · 5 clean · 0 FAIL · 50 WARN   [mode=gate]`**

WARNs: `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 25 Facebook-verified venues (expected — FP.2 venues carry no bio field and need no Chrome avatar fetch, per the standing `validator-fb-evidence-mismatch-fp2-corroboration`-class finding). No other WARN classes fired. No FAIL.

## Circuit breaker

Not fired. No FAIL outstanding in the validator run.

## Budget used

30 venues worked (27 written to bndy — 25 with facebookUrl, 2 website-only — 3 evidenced blank) against the 30-venue / 15-artist / 40-minute budget. 0 artists worked (Chrome unreachable — hard stop on the artist portion only). Wall-clock this firing: approximately 04:18:28Z claim acquired → 04:46Z ledger/dashboard writes complete (~28 minutes), within the 40-minute ceiling.

## Ledger, snapshot, run-summary, dashboards

- Appended 30 `type:"enrich"` lines to `data/state/enrichment-ledger.jsonl` (27 `outcome:"verified"`, 3 `outcome:"blank"`), plus one `type:"snapshot"` line: `artistsTotal:2228, artistsMissingSocials:867, artistsMissingGenres:614, venuesTotal:3003, venuesMissingSocials:596` (from live `list_artists`/`list_venues` pagination.count at 04:33–04:34Z). Note: `venuesMissingSocials` dropped from 623 (start of firing) to 596 — a delta of exactly 27, matching the 27 venues actually written this firing; a useful independent sanity check that the writes landed.
- Appended one line to `data/state/run-summary.jsonl`: `{"date":"2026-08-18","task":"enrichment","finishedAt":"2026-08-18T04:46:30Z","outcome":"completed","gigsAdded":0,"artistsAdded":0,"venuesAdded":0,"recordsEnriched":27,"skipped":3,"note":"30 venues worked, 27 written, 3 blank. Chrome down (7th firing), artists skipped."}`
- Regenerated both dashboards: `data/normalized/enrichment/DASHBOARD.html` (1685 enrichment records, 54 snapshots) and `data/normalized/DASHBOARD.html`.

## CTO-INBOX — new entries this firing

Three new findings raised: the seventh-consecutive-firing Chrome outage; the Okehampton Show ground address mismatch; and a correction to a prior firing's mis-pasted evidence id (firing 01's `bv2a-firing01-jorge-wilson-jesse-james-garbled-venue-name` entry cites id `9c3bf58f-96ee-42f0-b42c-cb2b709ed0eb`, which this firing's data confirms actually belongs to "Kidsgrove Masonic Club", not "Jorge Wilson + Jesse James" — the real Jorge Wilson + Jesse James record is `befdd87f-2d49-4a0e-ab7a-fcbe2dac32bf`). See the appended lines in `CTO-INBOX.md`.
