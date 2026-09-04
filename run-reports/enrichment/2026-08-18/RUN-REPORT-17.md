# Bv2a Enrichment — RUN REPORT — 2026-08-18, firing 17 (17:17Z)

## Step 0 — Circuit breaker

Read the last 3 run reports (RUN-REPORT-16, 15, 14, all dated 2026-08-18). Each recorded 0
outstanding FAIL from the validator on its final run. 0 of 3 recorded a FAIL, none failed to
write a report. **Breaker NOT TRIPPED.**

Heartbeat written first: `data\state\heartbeat\bv2a-enrichment-2026-08-18T17-17-45Z.json`,
`outcome:"started"`.

## Step 1 — Concurrency

Claim file: `data\state\claims\bv2a-enrichment.json` (the runbook-correct path; the task
prompt's `data\state\claims\enrichment.json` has never existed — standing fingerprint
`bv2a-claim-path-stale-in-prompt`). Read before the runbook: `heldBy:null`, released by
firing 16 at 16:35:00Z — **acquired** at 17:17:45Z, TTL 3h (expires 20:17:45Z).
`data\state\enrichment.lock` not present; not honoured, not recreated.

## Step 2 — Runbook read

RUNBOOK.md read in full this firing: H1 = **v2.27** (2026-08-08), CURRENT FLOOR (§6A) =
**v2.19** — check passed. Read §2A.1 items 3b (both Facebook search and Google mandatory
before any artist blank) and 8 (bio is quoted, never written) verbatim, §2A.2 mechanics, §3
venue protocol, §6A run contract, §6F/§6G concurrency in full. Read ENRICHMENT-TASK-v3.md
§0.0 and §FP in full: §FP.2 confirms venues need only `website`/`facebookUrl`, no bio, no
Chrome. Read CTO-INBOX.md tail in full (last ~60 lines): confirmed standing, still-live
fingerprints — `bv2a-claim-path-stale-in-prompt`, `validator-venue-schema-mismatch`,
`validator-venue-evidence-loader-artistid-only`, `bv2a-edit-venue-facebookurl-param-does-not-exist`,
`bv2a-firing14-enrich-venue-batch-array-not-found` — all still current, none superseded.
Used `socialMediaUrls` (never the non-existent `facebookUrl` param) on every `edit_venue`
call this firing and confirmed `updatedFields` on every response — no silent no-op writes.
Did not attempt the `enrich_venue` batch-array path (known broken per firing 14) — went
straight to `WebSearch` per venue under §FP.2.

## Chrome check

`list_connected_browsers` returned `[]`. **Twentieth consecutive firing** with Chrome
unreachable, spanning firing 22 (2026-08-17 22:17Z) through this firing (2026-08-18 17:17Z),
over 19 hours. Per the task's HARD STOPS table: venues proceed under FP.2 (no Chrome
needed); the 6 stranded priority-1 artist candidates (Camems, Whiskey Rebel, Guns for Girls,
One Dimensional Creatures, Uncle Dad & The Day Drinkers, Devoted — all created 2026-08-18
04:13–04:15Z) remain hard-stopped and carry over again. Artist backlog (867 missing socials,
614 missing genres) confirmed static from the snapshot below.

## Step 3 — Work

Priority order per the task: (1) artists created <24h missing socials — **6 candidates
found, blocked, Chrome down**; (2) venues created <24h missing socials — **0 found**
(`list_venues(createdSince=2026-08-17T17:17:45Z, missingSocials=true)` returned empty);
(3) backlog venues missing socials, oldest `createdAt` first — **worked, 30 records**;
(4) backlog artists — **blocked, Chrome down**; (5) artists missing genres with a
facebookUrl — **blocked, Chrome down** (same treatment as all 19 prior outage firings).

**Selection method:** paged `list_venues(missingSocials:true)` across the full 340-record
backlog (offsets 0, 100, 200, 300 — 300 of 340 records retrieved), pooled and sorted by
`createdAt` ascending, cross-checked against today's evidence file
(424 unique ids already worked today before this firing) to exclude records already
touched, and excluded standing CTO-INBOX non-venue/foreign-batch flags (Okehampton Show
ground, Venue TBC, "United match)", Ann Welfare Playing Fields, West Park Long Eaton,
Seabridge, The Nest, The Decorated Dead Tattoo Studio, Campbell Park, Gostrey Meadow,
Plympton Spice Plymouth, Jubilee Park Horndean, Darcy's, Prestwood Recreation Ground,
Hunstanton Bandstand, Dorset County Show, the `6022ef13-…` foreign-capture batch, Decade
of Dance, and Jorge Wilson + Jesse James — the last two already flagged in earlier firings
as possible non-venue / garbled name needing a human check, so not re-attempted). **This
was not an exhaustive sort of the remaining ~40 records** — the same honest caveat as prior
firings: the last page (offset 300–340) was not retrieved due to output-size limits.

Evidence file: `data\state\enrichment-evidence-2026-08-18-enrichment.jsonl` already existed
from earlier firings today — appended, not overwritten. All 30 evidence lines written
before their corresponding `edit_venue` call (or, for blanks, before recording the blank).

### Records enriched WITH a verified page (24)

| Venue | id | Fields written | Evidence |
|---|---|---|---|
| Wolstanton Social Club | `Am20CeVkowTqxJzYVuJE` | website | wolstantonsocialclub.co.uk |
| Leek Conservative Club (Dog & Rot) | `OZZiBTQpGpgV3ZlFCvan` | facebookUrl (group) | facebook.com/groups/714663077031367 |
| The King's Arms, Stafford | `32e49cc0-ccfb-4eff-9544-8efd4d09b031` | facebookUrl | facebook.com/KingsArmsStafford |
| Mount Pleasant Hotel | `e60ad2d3-168b-4ab2-8a41-ea923d8c5012` | website + facebookUrl | facebook.com/MountPleasantHotelSidmouth |
| Honiton Working Mens Club | `5db4fce0-f7ab-431f-a7f0-70381915a6e1` | website + facebookUrl | facebook.com/profile.php?id=1603598316530117 |
| Sundowners | `dbcb7109-aa07-4b42-888e-9b134b84c0ed` | facebookUrl | facebook.com/Sundowners.Exmouth |
| The Royal British Legion | `078e6154-383e-4a22-a813-e76cb26eaa23` | facebookUrl | facebook.com/people/CrownhillDistrict-RBL-Social-Club/61553356299954 |
| Three Ferrets | `f6da243f-6723-470b-a567-27850c5341cc` | facebookUrl | facebook.com/threeferretsplymouth2021 |
| Exeter Corn Exchange | `c6e12efe-25c6-4517-8f8e-bef1db5f376f` | website + facebookUrl | facebook.com/exetercornexchange |
| The Box Office Lounge | `d5a02265-88db-4b8f-8ab8-ed3f8beddde9` | website + facebookUrl | facebook.com/theboxofficelounge |
| Esplanade Hotel | `67297542-381e-467d-a1cc-d1410bff3250` | website + facebookUrl | facebook.com/TheEsplanadeHotelPaignton |
| St Budeaux Community Centre | `088e8004-45d1-4fb9-88fb-2b04ec49dfa0` | facebookUrl | facebook.com/p/St-Budeaux-Community-Centre-100080141634866 |
| The Elburton Inn | `5c32228c-8403-48cf-819f-70d7d1a09491` | facebookUrl | facebook.com/Theelburtoninn |
| Steam Packet Inn | `cef61d41-dbd9-4d99-8021-21753992cc6b` | website + facebookUrl | facebook.com/steampacketinnkingswear |
| The Union Inn Pub & Rooms | `f797467e-c471-49b5-8008-56d5642d1ebd` | website + facebookUrl | facebook.com/p/The-Union-Inn-Pub-Newton-Abbot-61566783578960 |
| Pentrich Brewing Co | `91219e56-4140-4d30-b740-1d73c9b46377` | website + facebookUrl | facebook.com/pentrichbrewingco |
| The Monks Bridge | `7607e8d8-0d03-4dde-9a79-26bd67f8e96b` | facebookUrl | facebook.com/TheMonksBridge |
| The Mill Wheel | `bf7a3d55-2630-4e3e-bb9f-5f1b3a0822db` | website + facebookUrl | facebook.com/TheMillWheel |
| The Plymstock Inn | `2f4b27f2-2da2-4ac5-839d-d2310bf99898` | website + facebookUrl | facebook.com/theplymstockinn |
| The Ploughboy | `2f83a283-5a31-4dcd-8baa-b0bbe5ea881a` | facebookUrl | facebook.com/PloughboyInnsaltash |
| Railway Hotel Saltash | `3e57c751-c527-4a6e-a5bd-4b9eca839442` | website + facebookUrl | facebook.com/RailwaySaltash |
| The Exchange (Ivybridge) | `cdd6a129-2c55-48df-937f-be78d8578f50` | facebookUrl | facebook.com/ExchangeIvybridge |
| Ivybridge Constitutional Club | `7c4b80ca-2c1f-49da-b820-01900d9d38f2` | website + facebookUrl | facebook.com/p/Ivybridge-Constitutional-Club-61572498075335 |
| Golden Lion (Brixham) | `a9efe968-f695-4b9f-befc-06ff2edadfa0` | facebookUrl | facebook.com/brixhamgoldenlion |

All 24 confirmed via `updatedFields` on the `edit_venue` response (no silent no-ops); 3
spot-checked via `get_by_id` read-back (King's Arms Stafford, Esplanade Hotel, Railway Hotel
Saltash) and confirmed persisted.

**Name-mismatch note:** "The Royal British Legion" (bndy name) is, per its own Facebook
page, "Crownhill and District RBL Social Club" — address (Tailyour Road, Crownhill, PL6
5DH) matches exactly. Enriched but NOT renamed this firing, same class as the firing
09/12 name-mismatch findings — venue protocol has no explicit unattended-rename
authorisation.

**Weak-name-match note:** Leek Conservative Club (Dog & Rot) was attached to the Facebook
GROUP "The Dog and Rotters (Leek Conservative Club)" rather than a page — valid per §2A.1
item 4's group-URL ruling. No website found.

### Records recorded as an EVIDENCED BLANK (6)

| Venue | id | Variants tried | Reason |
|---|---|---|---|
| The Railway | `WVSAbjPEiVfP6zCIV69Q` | "The Railway" Wellington Road Stockport facebook; "The Railway" pub Stockport SK4 facebook.com own page live music | **Possible closure** — CAMRA/whatpub record the pub as closed long-term since 24/06/2024 following the licensee's death. Only FB candidate found ("Jazz at the Railway") is an event-branded page, not confirmed as the pub's own current page. Needs a human check of trading status, same class as the Darcy's finding. |
| Lamplight - Coffee House & Tap Room | `f40351b5-5e3b-49e7-81af-cb09949757bc` | "Lamplight" Coxhoe coffee house facebook; Lamplight Coxhoe facebook.com; site:facebook.com Lamplight Coxhoe | Real, open venue (CAMRA/Untappd/Instagram confirm) but no confident own Facebook or website URL surfaced across three variants — only tangential mentions via Coxhoe Village Hall's own page. |
| Madeley Carnival, Madeley | `56373bed-08e8-4fd8-a2f7-cafde860e75e` | Madeley Carnival Crewe facebook | Only unrelated Madeley pages found (school, GP practice, Madeley Club, The Madeley Centre, Parish Council) — none naming a "Madeley Carnival" page. |
| Centre Totnes, Market Square | `7aa39dda-6fdf-4b1f-965f-2f3864702d05` | "Centre Totnes" Market Square Totnes facebook | No distinct business named "Centre Totnes" found — only Totnes Market Square (council-run) and Totnes Town Council pages. Possible garbled/ambiguous record name, flagged for a human check. |
| Tuckers Maltings | `354ebcd2-508e-4290-906e-95f301391b5a` | Tuckers Maltings Newton Abbot facebook; Tuckers Maltings Newton Abbot open closed 2026 | The historic maltings production business closed in 2018 after 118 years. The building now operates as a separate live-music/craft-beer venue, "The Maltings Taphouse & Bottle Shop", with its own distinct Facebook page — not the same entity as the "Tuckers.Maltings" heritage page. Left blank rather than attach either page under the bndy record's current name; needs a human decision on whether to rename/merge. |
| Dicey Reilly's | `d9ea5e42-82d6-4dd2-a128-7c56f2c04f73` | "Dicey Reilly's" Teignmouth facebook; Dicey Reilly's Teignmouth Regent Street facebook.com page pub | Real, active pub (live music Fridays confirmed by multiple sources) but no confident own-page URL surfaced — only a generic Facebook "events" listing and third-party mentions. |

### Records SKIPPED, and why

None beyond the standing priority-1/4/5 artist hard-stop (Chrome down, 20th consecutive
firing — see above). No new non-venue findings beyond Tuckers Maltings' distinct
entity-mismatch (recorded above as an evidenced blank rather than a skip, since the search
was completed and the result is a considered blank, not an unworked row).

### Names corrected under §0.6

None. No verified page this firing carried a different name from the bndy record.

### Validator summary line

```
30 records · 6 clean · 0 FAIL · 48 WARN   [mode=gate]
```

Clean on the first pass — no correction cycle needed. All 48 WARN are `STUB_NO_BIO` /
`STUB_NO_IMAGE` on the 24 facebookUrl-bearing records plus `NAME_BILLING` on two records
with a parenthetical/hyphen in their (correct) names — expected, non-blocking noise per
standing fingerprints `validator-venue-schema-mismatch` and `validator-venue-evidence-loader-artistid-only`:
venues carry no bio/image requirement under §FP.2, and the validator's WARN class does not
gate.

### Budget used, and whether the circuit breaker fired

Claim acquired 17:17:45Z, work (runbook read + search + writes + validation) completed by
~17:35Z — **~18 minutes**, well inside the 40-minute task budget and the 3-hour claim TTL.
Circuit breaker did not fire (0 FAIL on this and the prior 3 reports).

## Step 5 — Ledger, summary, dashboards

- `data\state\enrichment-ledger.jsonl`: appended 30 `enrich` lines (24 verified, 6 blank) +
  1 `snapshot` line.
- Snapshot: `artistsTotal:2231, artistsMissingSocials:867, artistsMissingGenres:614,
  venuesTotal:3004, venuesMissingSocials:316` (316 = 340 − 24 verified this firing — exact
  1:1 match; artist figures static, confirming the Chrome outage's continued effect;
  venuesTotal unchanged, no creates this firing per task scope).
- `data\state\run-summary.jsonl`: appended one line, `outcome:"completed"`,
  `recordsEnriched:24`, `skipped:6`.
- Both dashboards regenerated: `data\normalized\enrichment\DASHBOARD.html` (2026 enrichment
  records, 67 snapshots) and `data\normalized\DASHBOARD.html`.
- `20-Daily/2026-08-18.md`: one line appended linking this report.

## CTO-INBOX

Appended: twentieth-consecutive-firing Chrome outage entry; The Railway (Stockport)
possible-closure finding; Tuckers Maltings entity-mismatch finding; Centre Totnes
ambiguous-name finding. See `CTO-INBOX.md`, 2026-08-18 section.

## Outcome

**Ran OK.** enrichment — 24 venues verified, 6 venues evidenced blank (30 total), 0
artists (Chrome unreachable, 20th consecutive firing). Validator 0 FAIL.
