# Bv2a Enrichment — Run Report 05 (2026-08-18)

Run id: `bv2a-enrichment-2026-08-18T05-20-11Z`. Unattended hourly firing.

## Step 0 — Circuit breaker

Read the last 3 run reports directly (newest first): RUN-REPORT-04 (2026-08-18, COMPLETED, `30 records · 5 clean · 0 FAIL · 50 WARN`), RUN-REPORT-03 (2026-08-18, COMPLETED, `30 records · 4 clean · 0 FAIL · 52 WARN`), RUN-REPORT-02 (2026-08-18, COMPLETED, `30 records · 7 clean · 0 FAIL · 48 WARN`). 0 of 3 recorded a FAIL, all three exist and all three wrote a report. **Breaker NOT TRIPPED.**

## Step 1 — Concurrency

Read `data\state\claims\bv2a-enrichment.json` at start: `{"heldBy":null,"releasedAt":"2026-08-18T04:47:00Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-18T04-18-28Z"}` — released. Used `data\state\claims\bv2a-enrichment.json`, not the literal path named in the task prompt (`data\state\claims\enrichment.json`) — independently confirmed by reading RUNBOOK.md §6G's own TTL table, which names this task `bv2a-enrichment`, and by finding a live `bv2a-enrichment.json` claim file with a full acquire/release history on disk (no `enrichment.json` claim file exists). This matches the standing `bv2a-claim-path-stale-in-prompt` finding already in `CTO-INBOX.md`, but was verified fresh against the runbook text itself, not taken on the inbox's word alone. Checked for `data\state\enrichment.lock`: not present. Per RUNBOOK §6A step 2b / §6G, this file is retired and must never be recreated — not honoured, not recreated.

Heartbeat written first: `data\state\heartbeat\bv2a-enrichment-2026-08-18T05-20-11Z.json`, `outcome:"started"`. Claim then acquired: `heldBy: bv2a-enrichment-2026-08-18T05-20-11Z`, `expiresAt: 2026-08-18T08:20:11Z` (3h TTL per §6G table).

## Step 2 — Runbook / spec read

`RUNBOOK.md` read in full. H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed (v2.27 ≥ v2.19). Confirmed directly from the text (not assumed from the task prompt): §2A.1 item 3b (both search surfaces required before any blank is recorded) and item 8 (bio is a character-for-character quotation, never composed) both exist as described. §3 venue protocol, §6/§6A run contract, §6F/§6G concurrency mechanics, and the full changelog were also read. `ENRICHMENT-TASK-v3.md` §0.0 and §FP (fast path) read in full, plus the rest of the document for field-by-field rules (§6) and the do-not-attach list (§5.4). `CTO-INBOX.md` read in full (209 lines) for open fingerprints.

**Note on the task prompt vs the runbook:** the prompt's stated concurrency path (`data\state\claims\enrichment.json`) does not match what RUNBOOK.md §6F/§6G actually specify (`data\state\claims\<task>.json` with task = `bv2a-enrichment`). This is a real discrepancy between the prompt and the source of truth, not a fabricated one — confirmed by reading the runbook myself and by the absence of any `enrichment.json` claim file on disk. Per "the runbook wins," I used the runbook's path.

## Step 3 — Tool verification

bndy MCP tools reachable — confirmed live via `list_venues` (count 3003 total / 596 missing socials at start) and `list_artists` (count 2228 total / 867 missing socials / 614 missing genres at start). WebSearch reachable and used throughout.

**Chrome tested first, two attempts** (`tabs_context_mcp` with `createIfEmpty:false` then `true`): **not connected**, both non-transient ("Claude in Chrome is not connected"). Per `CTO-INBOX.md`, this outage has now been continuous since firing 22 (2026-08-17 22:17Z) through firings 23, 00, 01, 02, 03, 04, and this firing — **the EIGHTH consecutive firing**, spanning over seven hours. Per the task prompt's hard-stop table ("Chrome unavailable... venues may proceed; artists may not"), artist priorities 1, 4 and 5 were **not attempted this firing**. Venues proceeded under §FP.2 (WebSearch only, no Chrome needed).

## Step 3 — Work: venues (FP.2, no Chrome needed)

**Selection.** Priority 2 (venues created in the last 24h with missing socials): `list_venues(missingSocials:true, createdSince:2026-08-17T05:20:11Z)` returned **0 results**. Fell to priority 3: backlog venues missing socials, oldest `createdAt` first. Pulled the first page of `list_venues(missingSocials:true, limit:100, offset:0)` (596 total at start) — the API's own default ordering is already ascending by `createdAt`, confirmed by inspection, so page 1 already surfaces the oldest backlog without a full 6-page pull.

**Cooldown check.** `enrichment-ledger.jsonl` (1,776 lines at start) parsed with Python `json.loads` per line (format-agnostic, per the standing `bv2a-firing01-ledger-mixed-json-formatting` finding) for every `type:"enrich", entity:"venue", outcome:"blank"` line — 99 unique venue ids excluded on that basis. This correctly excluded White Lodge (Stafford), Handcross Bowls Club, West End Club (Stapleford), Ann Welfare Playing Fields, Annitsford Welfare Club, Hayfield Club, Tudor Nook (Cheadle), Canal Tavern, W P M Sports & Social Club, Jubilee Park (Horndean), The Dolphin Hotel (Plymouth), The Saracens Head (Newton Abbot), Newton Abbot 76 Sports & Social Club, Okehampton Show ground, Molly Malones, The Tap & Grape (Broadstone) and Tor Sports & Leisure — all already recorded blank by earlier firings today or in prior days.

**Other exclusions applied before selecting the working set:** Venue TBC (§0.23 named non-place) and "United match)" (garbled name, already flagged in `CTO-INBOX.md` for human review) — both within the oldest page but neither cooldown-listed nor real candidates.

10 oldest-eligible records taken, `createdAt` ranging **2026-07-31T20:52Z (Creeks End Inn, Kingsbridge) to 2026-08-01T01:19Z (Watchet Town Football Club)** — all part of the same 2026-07-31/08-01 Devon/Cornwall/Somerset lemonrock-sourced capture batch prior firings have been working through.

### Records enriched WITH a verified page (9, all with facebookUrl; 5 of these also website)

All confirmed by `get_by_id` read-back and matched on address/postcode against the search evidence:

1. Creeks End Inn (Kingsbridge) — `f0cc3d0f-44db-4fd7-a3f1-503c33e993f5` — facebookUrl + website. Street ("Square's Quay") and town match bndy record exactly; own site `creeksendinn.co.uk`.
2. Rod & Line (Tideford, Saltash) — `e57c05c8-ae35-4b3c-a95f-d3c5e47a1efc` — facebookUrl + website. Address (Church Rd, Tideford, Saltash PL12 5HW) matches exactly; own site `rodandlinetideford.co.uk`.
3. The Kirton Cow Pub & Kitchen (Crediton) — `2ed635b9-e46d-4e12-b262-db2e33515098` — facebookUrl + website. Address (37 High St, Crediton EX17 3JP) matches exactly; own site `kirtoncowcrediton.co.uk`.
4. The Wings Bar (Exmouth) — `106b2807-ea78-4a71-8f5e-cb7fff40903a` — facebookUrl. Address (33-35 Imperial Rd, Exmouth EX8 1DB) matches exactly, confirmed in a third-party group post citing the same address. No own-domain website found.
5. King Arthur's Arms (Tintagel) — `68314971-d49c-4879-a30f-45384901904d` — facebookUrl + website. Town/name match, 2,000 likes, own site `kingarthursarms.co.uk`.
6. The Bear Inn (Weston-super-Mare) — `ad7136ba-84e7-4831-861e-c9bbf034d0b3` — facebookUrl + website. Address (66 Walliscote Rd, Weston-super-Mare BS23 1ED) matches exactly; own site `thebearinnweston.co.uk`. A second, separate accommodation-only page (`bearinnhotel`) exists for the same building — the main pub page was used.
7. Royal Oak (Nailsea) — `b23bc8bc-5130-4dca-ab5c-8ce4bc8049fe` — facebookUrl. Address (43 High St, Nailsea BS48 1AS) matches exactly. No own-domain website found.
8. Tavern Inn the Town (Weston-super-Mare) — `5860820a-d568-4295-97f9-200aab4f19a5` — facebookUrl. Address (57-59 Regent St, Weston-super-Mare BS23 1SP) matches exactly. No own-domain website found.
9. Watchet Town Football Club — `1e30e66c-21a5-422c-8795-6b174989b588` — facebookUrl + website. Address (Doniford Rd, Watchet TA23 0DE) matches exactly. Three competing Facebook identities exist for this club; the clean vanity-handle page (`WatchetTownFC`) matching the club's own website domain was picked over one page explicitly self-labelled "unofficial" (id `912984185465444`) and an older, differently-named "Watchet Football Club" page (`179790828739509`).

### Records recorded as an EVIDENCED BLANK — no bndy write (1)

10. Jack Chams (Tavistock) — `8f2ba89b-bdb4-47f1-93c5-9b26c4276cae` — variants tried: `"Jack Chams" Tavistock facebook`; `facebook.com/100008121914792 Jack Chams Tavistock page`. Address (17 West St, Tavistock PL19 8AN) confirmed via Yell/whatpub, but the only Facebook presence found is a `people/`-style personal-profile URL (`100008121914792`) and a public group (`166175863453390`) — no dedicated business Page vanity URL surfaced across two variants. No independent website found either. Left blank rather than attach an unofficial-looking profile, consistent with the venue protocol's evidence bar and the `bv2a-firing04-cattedown` precedent (two informal profile-style pages, left blank).

### Records SKIPPED, and why

None skipped mid-batch from the 10-record working set. "Venue TBC" (§0.23 named non-place) and "United match)" (garbled name, already flagged for human review) were excluded during candidate selection, before any write was attempted, and are not counted against the batch.

### Names corrected under §0.6

None this firing — all 10 bndy names matched the venue's own trading name closely enough that no rename was warranted.

## Step 3 — Work: artists

**0 processed.** Chrome unreachable all firing (eighth consecutive occurrence — see Step 3 above). Per the task prompt's hard-stop table, artist priorities 1 (new-artist missing socials), 4 (backlog artist missing socials) and 5 (artists missing genres with an existing facebookUrl) were not attempted.

## Validator

Built via an adapter script for this firing (`data/state/build_validator_input_run0520.py`), following the standing `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` fingerprints already logged in `CTO-INBOX.md`: venue `facebookUrl` supplied as a top-level field (sourced from the `socialMediaUrls[0].url` just written), `location` aliased from `city`; the evidence file's `venueId` keys were aliased to `artistId` for the loader, and the blank record (Jack Chams) carries its `searchVariants`. Records JSON: `data/normalized/enrichment/records-2026-08-18-firing05.json`. Evidence: `data/state/evidence_run0520_aliased.jsonl` (aliased subset of the shared `data/state/enrichment-evidence-2026-08-18-enrichment.jsonl`, this firing's 10 lines only).

**Validator summary line (verbatim, first and only run): `10 records · 1 clean · 0 FAIL · 18 WARN   [mode=gate]`**

WARNs: `STUB_NO_BIO`/`STUB_NO_IMAGE` on all 9 Facebook-verified venues (expected — FP.2 venues carry no bio field and need no Chrome avatar fetch, per the standing `validator-fb-evidence-mismatch-fp2-corroboration` fingerprint). No other WARN classes fired. No FAIL.

## Circuit breaker

Not fired. No FAIL outstanding in the validator run.

## Budget used

10 venues worked (9 written to bndy, 1 evidenced blank) against the 30-venue / 15-artist / 40-minute budget. 0 artists worked (Chrome unreachable — hard stop on the artist portion only). This firing intentionally worked a smaller, fully-verified batch rather than pushing toward the 30-venue ceiling, to keep every match individually checked against address/postcode evidence within the time actually spent. Wall-clock: approximately 05:20:11Z claim acquired to 05:33Z ledger/dashboard writes complete (~13 minutes), well within the 40-minute ceiling and the 3h claim TTL.

## Ledger, snapshot, run-summary, dashboards

- Appended 10 `type:"enrich"` lines to `data/state/enrichment-ledger.jsonl` (9 `outcome:"verified"`, 1 `outcome:"blank"`), plus one `type:"snapshot"` line: `artistsTotal:2228, artistsMissingSocials:867, artistsMissingGenres:614, venuesTotal:3003, venuesMissingSocials:587` (from live `list_artists`/`list_venues` pagination.count at 05:32Z). Note: `venuesMissingSocials` dropped from 596 to 587 — a delta of exactly 9, matching the 9 venues actually written this firing.
- Appended one line to `data/state/run-summary.jsonl`: `{"date":"2026-08-18","task":"enrichment","finishedAt":"2026-08-18T05:33:00Z","outcome":"completed","gigsAdded":0,"artistsAdded":0,"venuesAdded":0,"recordsEnriched":9,"skipped":1,"note":"10 venues worked, 9 written, 1 blank. Chrome down (8th firing), artists skipped."}`
- Regenerated both dashboards: `data/normalized/enrichment/DASHBOARD.html` (1695 enrichment records, 55 snapshots) and `data/normalized/DASHBOARD.html`.

## CTO-INBOX — new entries this firing

One new finding raised: the eighth-consecutive-firing Chrome outage (escalating the existing chain of identical findings for 22, 23, 00, 01, 02, 03, 04). No new data-quality findings this firing — all near-miss/ambiguous cases (Jack Chams) were resolved by leaving the record blank rather than by a finding needing a human decision. See the appended line in `CTO-INBOX.md`.

## Discrepancy note for the operator

The task prompt asserted the concurrency claim path as `data\state\claims\enrichment.json`. RUNBOOK.md itself — read in full this firing — names the task `bv2a-enrichment` throughout §6G's TTL table and the changelog, and the only claim file that exists on disk with a real acquire/release history is `data\state\claims\bv2a-enrichment.json`. This was verified directly against the runbook text, not assumed from `CTO-INBOX.md`'s existing note on the same subject (`bv2a-claim-path-stale-in-prompt`), though the two agree.
