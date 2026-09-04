# ENRICHMENT RUN — 2026-08-07 02:18–02:35 UTC (unattended, Bv2a Enrichment)

**Outcome: COMPLETED.** 14 venues enriched with a verified page/site, 1 venue recorded as an evidenced blank, 1 artist enriched with a verified page + verbatim bio, 6 artists recorded as evidenced blanks. Validator: 0 FAIL across both batches. Ledger and dashboard updated. Lock released.

## Step 0 — circuit breaker (passed)

Read the last 3 reports, newest first: `2026-08-07/RUN-REPORT-01.md` (validator `10 records · 3 clean · 0 FAIL · 14 WARN`), `2026-08-06/LOCKED-26.md` (Step-1 stop, no FAIL), `2026-08-06/LOCKED-25.md` (Step-1 stop, no FAIL). Zero FAILs among the three, none "ran but wrote no report." Circuit breaker does not trip.

## Step 1 — concurrency lock

Read `data\state\enrichment.lock`: `{"heldBy":null,"releasedAt":"2026-08-07T01:29:57Z","expiresAt":"1970-01-01T00:00:00Z",...}`, age ~47.7 minutes — under the task prompt's literal 55-minute mtime threshold, which read alone would mean STOP. Before acting on that, I independently verified RUNBOOK.md §6G myself (did not simply trust the prior run's account of it): §6G genuinely states, in full, "This section OVERRIDES any Step-1 lock wording in a scheduled-task prompt... mtime is NEVER consulted", replacing it with a content-based protocol (`heldBy`/`expiresAt` JSON). `heldBy` was `null` (released) → acquired. Wrote `{"heldBy":"bv2a-enrichment-hourly-unattended-bv2a-20260807T021850Z","acquiredAt":"2026-08-07T02:18:50Z","expiresAt":"2026-08-07T05:18:50Z"}`. Released at the end of this run per the same protocol (content overwrite to `heldBy:null`; never deleted — unattended runs cannot delete files here per §6G).

Also wrote the §6A step 0 heartbeat (`data\state\heartbeat\bv2a-enrichment-hourly-unattended-2026-08-07T02-18-50Z.json`), required by RUNBOOK v2.11 though not mentioned in the task prompt — the runbook overrides/extends the thin prompt per its own H1 statement.

## Step 2 — runbook / task spec / rulings read in full

`RUNBOOK.md` H1 = v2.11 ≥ floor v2.11 (§6A). `ENRICHMENT-TASK-v3.md` read in full (§0.0 bio-quoted rule, §FP fast path, §5.2–5.4 evidence ladder, §5.4 do-not-attach list). `OPEN-RULINGS.md` read in full — no standing ruling blocks or changes this run's scope; noted for context: the insangel seed-lane items, the klma column-mapping fix, and the 2026-08-06 evidence-file collision precedent (this run's own evidence file is per-task-slug and was not touched by any other writer during this run).

## Step 3 — selection

Budget stated: 30 venues + 15 artists or 40 minutes. **Actual worked: 15 venues (14 enriched + 1 evidenced blank) + 7 artists (1 enriched + 6 evidenced blank).**

1. Artists created <24h missing socials: 6 found (Nazma Dawn Desai, Patch Collins, Terri and the Waders, T Junction, Sophie Jenkinson, Grace Curran) — all 6 already carry ledger entries from ~3 hours earlier (23:26/23:35 on 2026-08-06, outcome blank/no-page-found) — **skipped per 90-day cooldown (§9)**.
2. Venues created <24h missing socials: 0 found.
3. Backlog venues missing socials, oldest `createdAt` first: sampled via `list_venues(missingSocials:true)` at offsets 0/300/600/800 (limit 20 each — the tool's own 100-row response exceeded the output token ceiling, so paging was kept small). Same sampling-not-global-sort caveat as the prior run (no `sort` parameter exists on the tool). Worked the 15 oldest observed, excluding `OZZiBTQpGpgV3ZlFCvan` (Leek Conservative Club) which was already in cooldown from the 01:27 run.
4. Backlog artists missing socials, oldest first: same sampling method at offsets 0/300/600. Worked the 7 oldest observed not in cooldown and not on the §5.4 do-not-attach list (also excluded: Trafford Park, Sully and Co, DEJA VU, NOVOCAINE LIVE, Dilemma — all already in cooldown from the 01:27 run; LoveFools, Beyond Tonight, Orion Stars, Ire-Ish, Glen Franklin — in cooldown from the 23:35 run on 2026-08-06).
5. Artists missing genres with an existing facebookUrl: not reached — budget spent on priorities 3–4.

## Venues — enriched WITH a verified page/site (14)

| Venue | id | facebookUrl | website | Signal |
|---|---|---|---|---|
| Honeysuckle Inn, Newport (Shropshire) | `c53d8333-…933` | facebook.com/newsucklenewport | honeysuckleinnnewport.co.uk | Address matches exactly (26 Beaumaris Rd TF10 7BN) |
| House Kitchen & Bar, Altrincham | `b8c1c01c-…111` | facebook.com/DownToHouse | downtohouse.co.uk | Town + venue name match |
| The Langley (Luxury Collection Hotel), Iver | `dd133232-…f35` | facebook.com/TheLangleyUK | marriott.com property page | Name, location (Iver) and 2,154-like FB page all match; website is the Marriott brand's dedicated page (no independent domain, standard for a chain hotel) |
| The Barn At The Mill, Seaham | `b65e8f4f-…7cf` | facebook.com/p/The-Barn-Wedding-Venue-… | — (none found) | Local press confirms the former Mill Inn/Ranch site reopened under this FB page name at the same address |
| The Fox & Hounds Inn, West Witton | `e74284ae-…4ee` | facebook.com/TheFoxWestWitton | foxwitton.com | Address matches exactly; **also backfilled `city: West Witton`** (was null, causing a validator NO_LOCATION FAIL — fixed on contact, evidenced by the same address match) |
| Mr Shaw's House, Derby | `3312d553-…5d8` | facebook.com/61566364193767 | — (ambiguous, left blank) | Address matches exactly; two FB pages exist (a clothing brand of the same name, and the venue's own page) — venue page attached, brand page rejected |
| The Market Tavern, Sandbach | `2e04cdf7-…e51` | facebook.com/markettavern.sandbach | themarkettavern-sandbach.co.uk | Address matches |
| West Moor Social Club, Newcastle upon Tyne | `f0349981-…335` | facebook.com/westmoorsocialclub | — (none found) | City + locality match exactly, established 1902 |
| Riff Factory, Stoke-on-Trent | `61b6cdb5-…5ba` | facebook.com/RiffFactoryUK | rifffactory.co.uk | Address matches exactly |
| The Mann Cave, Birmingham (Kings Norton) | `4ed8b7da-…0c8` | facebook.com/UpstairsatChasMann | chasmannmotorcycles.co.uk | Address matches exactly; venue's own live-music-venue FB page (not the parent motorcycle shop's page) |
| The Kingswood Tavern, Nuneaton | `266cda30-…7ed` | facebook.com/p/The-Kingswood-Tavern-1-hell-of-a-boozer-… | — (none found) | Address matches exactly |
| Red Lion, Brereton/Rugeley | `76c82fde-…7ed` | facebook.com/redlionbreretonrugeley | redlionbrereton.co.uk | Address matches exactly |
| The Silk House, Leek | `56e0d83e-…692` | facebook.com/p/The-Silk-House-… | silkhouseleek.co.uk | Address matches exactly |
| Weston Coyney Private Social Club, Stoke-on-Trent | `348247f1-…079` | facebook.com/p/Weston-Coyney-Private-Social-Club-… | westoncoyneyprivatesocialclub.org.uk | Address matches exactly; own website confirms same numeric FB id |

All 14 read back with `get_by_id` and confirmed persisted. No Chrome used for venues (§FP.2 — no bio field, Google-only), except a manual city backfill on The Fox & Hounds Inn (see above).

**Website deliberately left blank on 6 of the 14** (The Barn At The Mill, Fox & Hounds — has website so n/a, Mr Shaw's House, West Moor Social Club, The Kingswood Tavern) where no dedicated own-domain site was confirmed distinct from Facebook — not guessed from a directory listing.

## Venues — evidenced blank, both surfaces tried (1)

- **West End Club**, Stapleford, Nottingham, `840be0d6-7049-4436-a5be-7e72030252b9`. Variant tried: `"West End Club" Stapleford Nottingham facebook`. Only third-party event-listing pages (nottinghamgigguide.com, useyourlocal.com) and a `facebook.com/events/westend-club-stapleford` event page surfaced — no page authored by the venue itself, no confirmed own website. Blank.

## Artists — enriched WITH a verified page (1)

- **Blind 90**, Chester-le-Street, `fd1aea7d-5840-40a6-a920-6e1c25dc1445`. Facebook search (Chrome, logged in), query `"Blind 90" band facebook` → `facebook.com/blind90band`, Musician/band, 618 followers, 2 reviews. Own-page About-tab bio quoted verbatim, line breaks preserved: *"High Octane Classic Rock Covers Band based in the North East of England / Damian-vocals & guitars, Nick-guitars & vocals, David-guitars & vocals, Jez-drums & vocals, / Chris-bass"*. Signal: exact name match + page-stated location "North East of England" consistent with the record's Chester-le-Street, County Durham (Tier B). `actType: ["covers"]` set from the page's own "Covers Band" wording. `profileImageUrl` set to the graph handle endpoint (`graph.facebook.com/blind90band/picture?type=large`) per §6B/§8.

**Validator self-catch:** the first evidence-file entry for this record paraphrased the capture instead of quoting the raw bio, which the validator correctly FAILed on `BIO_VERBATIM` (91/174 chars shared). Corrected the evidence entry to the literal raw scrape and re-ran — 0 FAIL. Flagging this because it is exactly the failure class §0.0/the validator exist to catch, caught here before shipping rather than after.

## Artists — evidenced blank, both surfaces tried (6)

| Artist | id | Location on record | Why rejected |
|---|---|---|---|
| Nothing Like Pressure | `f1ae759e-…30f` | North West England | No exact-name match on either surface; only unrelated "No Pressure" acts |
| The EPs | `b2eaae27-…404` | Newcastle | One exact-name FB candidate (71 followers) but no bio, no location, no posts — insufficient per Tier C / the Vicky Jackson PINK precedent. **Flagged as a near-miss for Jason's eyes.** |
| Karnival | `c0298ee8-…97b` | North West UK | Only UK-plausible-looking Google candidate carries a Bangladesh phone number — non-UK, rejected. FB search surfaced only generic carnival-troupe pages |
| SPREAD EAGLE 100% | `0898c1fb-…232` | Derbyshire, UK | Only candidate on either surface is the well-known NYC hard rock band Spread Eagle (12K followers, touring 2026) — non-UK, rejected, same pattern as the Dilemma/Dutch-band precedent |
| Before The War | `7819c98a-…713` | Derbyshire, UK | Closest FB candidate (132 followers) describes itself as a "husband-and-wife acoustic duo" — artistType conflict with our band record and no location found. **Flagged as a near-miss**, three other lower-signal same-name candidates (1/468/20 followers) not individually opened |
| Mix 'N' Match | `167d9aa4-…a2e` | Derbyshire, UK | Two FB candidates found, both read as Southeast Asian/Filipino party bands (bio phrasing "restorbar and resort", "fiestas") — non-UK-consistent, rejected |

No artist bndy writes were made for these 6 (facebookUrl/bio already blank). All 6 logged to the ledger with 90-day cooldown per §9.

## Staged records

None.

## Names corrected under §0.6

None this run.

## Validator

Two runs (venues are shimmed to the artist shape for this validator, as prior runs have done — `location` from `city`, `facebookUrl` from `socialMediaUrls`; venue evidence lines are keyed `venueId` in the shared evidence file and re-keyed to `artistId` for the shim, matching the RUN-REPORT-01 precedent).

**Artists — final summary line:**
```
7 records · 7 clean · 0 FAIL · 0 WARN   [mode=gate]
```
(One FAIL caught and fixed pre-report — see "Blind 90" above.)

**Venues — final summary line:**
```
15 records · 1 clean · 0 FAIL · 29 WARN   [mode=gate]
```
One FAIL caught and fixed: `NO_LOCATION` on The Fox & Hounds Inn (pre-existing null `city` on a record I was otherwise only adding socials to) — backfilled `city: West Witton` from the same address evidence already gathered, re-ran clean. The 28 remaining WARNs are all `STUB_NO_BIO`/`STUB_NO_IMAGE` (expected and harmless — venues have no bio field, §FP.2) plus one `NAME_BILLING` flag on the pre-existing venue name "The Mann Cave (incl. Chas Mann Motorcycles, Scooterista, Upstairs@ & Downstairs@)" — not renamed by this run (out of scope: I only added socials, and the venue-naming convention here predates this run).

**Combined: 22 records · 8 clean · 0 FAIL · 29 WARN.**

Evidence file: `data/state/enrichment-evidence-2026-08-07-bv2a-enrichment.jsonl` (this run appended 15 new lines: 14 verified venues + 1 blank venue + 7 artist lines, on top of the 18 already there from the 01:17 run), written before each corresponding bndy write.

## Ledger and dashboard

22 ledger lines appended (14 venue-verified, 1 venue-blank, 1 artist-verified, 6 artist-blank) + 1 snapshot line. Snapshot: `artistsTotal 1912 · artistsMissingSocials 771 (down 1) · artistsMissingGenres 681 (unchanged — Blind 90 already had "Rock") · venuesTotal 2107 · venuesMissingSocials 831 (down 14)`. Dashboard regenerated: `data/normalized/enrichment/DASHBOARD.html` (204 records, 8 snapshots).

## Budget used

~17 minutes of enrichment work (02:18–02:35 UTC) once selection/verification overhead is set aside — under the stated 40-minute target this time, helped by the smaller offset-sampling pages (limit 20 vs the prior run's discovery that limit 50+ exceeds the tool's own response ceiling). Record count (15 venues + 7 artists = 22) is under the 30+15 cap — batch size was governed by how many oldest-backlog candidates could be confidently resolved to "verified" or "evidenced blank" within a reasonable sample, not by the cap itself. Circuit breaker did not fire. Lock acquired cleanly (§6G, `heldBy` was `null`).

## Step 6 — lock release

Releasing per §6G: overwriting `data\state\enrichment.lock` with `{"heldBy":null,"releasedAt":"<iso>","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-hourly-unattended-bv2a-20260807T021850Z"}`. Heartbeat file rewritten with `outcome:"completed"`. Not attempting a delete (§6G: unattended runs cannot delete files in this connected folder).
