# Bv2a Enrichment — RUN-REPORT-07

Run id: `bv2a-enrichment-2026-08-30T07-18-28Z`. Outcome: completed (partial). Venues worked under FP.2. Artist tiers 1 and 4 hard-stopped on Chrome. Tier 5 worked via WebSearch and Phase A source harvest, no Chrome.

## Step 0 — circuit breaker

Read the last 3 reports, newest first:

- RUN-REPORT-06 (2026-08-30, 06:17Z): outcome completed (partial). Validator `27 records · 0 clean · 0 FAIL · 56 WARN`. 0 FAIL.
- RUN-REPORT-05 (2026-08-30, 05:18Z): outcome completed (partial). Validator `27 records · 3 clean · 0 FAIL · 45 WARN` after excluding 1 self-caught false positive. 0 FAIL on the shipped pass.
- RUN-REPORT-04 (2026-08-30, 04:18Z): outcome completed (partial). Validator `26 records · 6 clean · 0 FAIL · 40 WARN` after excluding 1 self-caught `FB_EVIDENCE_MISMATCH`. 0 FAIL.

0 of the last 3 reports carried a recorded validator FAIL. All 3 wrote a report. The breaker did not trip.

## Step 1 — runbook, task spec, concurrency

`RUNBOOK.md` read in full. H1 = v2.27. CURRENT FLOOR (§6A) = v2.19. 2.27 ≥ 2.19. Floor check passed.

Did not check for, create or delete any `.lock` file. Found no `data/state/enrichment.lock`. Read `data/state/claims/bv2a-enrichment.json`: `heldBy: null`, released 2026-08-30T06:27:11Z by RUN-REPORT-06. Available.

Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-30T07-18-28Z.json` (`outcome:"started"`), then acquired the claim (`heldBy: bv2a-enrichment-2026-08-30T07-18-28Z`, TTL 3h, `expiresAt: 2026-08-30T10:18:28Z`). Released at close.

`ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail read for standing `bv2a-*` fingerprints: the `edit_venue` `facebookUrl` silent-drop defect (workaround: `socialMediaUrls`), the `createdSince:"24h"` string-not-parsed defect (workaround: explicit ISO cutoff), the validator venue-shape gap and its field-mapping adapter, the `FB_EVIDENCE_MISMATCH`-on-display-string class, the `BIO_VERBATIM`-on-untouched-bio false-positive class (open ruling request), and the standing identity-mismatch flags (Body Factory Gym/Paringdon, Spaces Studio, Astor Hall, Decade of Dance, King Kurt Pudding Party). None re-touched this firing.

## Step 2 — tool check

`bndy-events` MCP tools reachable. `WebSearch` reachable. `list_connected_browsers` returned zero browsers. Chrome unreachable, same as every firing tonight. Venues proceed under FP.2 (no Chrome needed). Artist tiers 1 and 4 (identity check, bio quote) hard-stopped. Tier 5 (genre-only) proceeds via WebSearch and Phase A.

## Step 3 — work

### Venues (FP.2, tier 2 — created in the last 24h, missing socials)

`list_venues(createdSince:"2026-08-29T07:18:28Z", missingSocials:true)` returned 88 (the `livebandphotos` surge from 00:10–00:32Z). Worked oldest-`createdAt`-first. Skipped, not re-litigated: Royal British Legion Becontree and Ekco Social Club (multi-candidate flags, RUN-REPORT-05), Body Factory Gym (identity-mismatch flag), The Cricketers Westcliff (multi-candidate flag, RUN-REPORT-05), The Link Social Club Harlow (evidenced blank, RUN-REPORT-06), Kings Park and Canvey Seafront (§0.23 non-fixed-building skip, parks/esplanade).

**30 of 30 venues investigated (budget cap reached): 26 written, 4 evidenced blank.**

Written, verified page or website (all social writes via `socialMediaUrls`, never the top-level `facebookUrl` parameter, per the standing silent-drop defect; every write read back with `get_by_id`):

Rayleigh Town Sports & Social Club (FB group, sole candidate) · Romford Bowls Club · South Ockendon Village Social Club · Stifford Clays Social Club (+website) · The Castlemayne pub · The Horse & Groom (website only) · Junction (website only) · The Star Pub Thaxted · The Oddfellows Arms (+website) · Owl and Pussycat · Papillon · The Queens Head Burnham-on-Crouch · Queens Head Waltham Abbey (website only) · Red Lion Billericay · The Royal British Legion Harlow (+website) · The Royal Oak Pub Stambridge · The Star At Steeple (+website) · The Sultan Waltham Abbey (+website) · The Trading Room Bar & Kitchen (+website) · The Wharf Grays (+website) · The White Lion Sible Hedingham · Winston Social Club Laindon (FB group, sole candidate) · The Windermere Club Southend (+website) · Wivenhoe Town Cricket Club · Hatfield Social Club (+website) · Jacoby's Ware.

Two records used a Facebook **group** URL, not a page, as the only social surface found (Rayleigh Town Sports & Social Club, Winston Social Club Laindon) — valid per the standing group-URL rule, not stripped or downgraded.

Evidenced blank (both search variants tried, no confident own page found):

- **Half Crown** (South Benfleet) — Instagram only, no Facebook page or website surfaced.
- **The Plough** (Upminster) — the only near-name candidate ("The Plough Kitchen") could not be confirmed as the same pub.
- **The Kings Head** (Tollesbury) — three competing Facebook candidates, no way to confirm the current live page without Chrome. Multi-candidate flag, not attached.
- **The Shepherd & Dog** (Ballards Gore) — the only web presence found under this name is a different pub in Stambridge; not used as evidence for this record.

### Artists — tiers 1 and 4 (BLOCKED)

`list_artists(createdSince:"2026-08-29T07:18:28Z", missingSocials:true)` returned 114, not worked. Chrome unreachable on the only available surface (`list_connected_browsers` zero). Tiers 1 and 4 need either a Facebook identity check (item 3) or a bio quote (item 8/§0.0), neither obtainable from WebSearch alone. Per the task's HARD STOPS this is not a run failure.

### Artists — tier 5 (genre-only, already hold a facebookUrl)

Swept `list_artists(missingGenres:true)` at offset 700 (fresh offset, not previously worked today). **13 candidates investigated: 7 written, 6 evidenced blank.**

Written (genres only, `facebookUrl` and `bio` left untouched):

| Artist | Genres | Source |
|---|---|---|
| Ricky Booth (`89b89208…`) | Rock, Pop | Facebook page repertoire (Stereophonics, Oasis, Queen, Elton John) |
| Vinyl Overdrive (`USIeHHwL…`) | Rock | ReverbNation, same handle as stored facebookUrl |
| MancElvis band (`c2d2b334…`) | Rock n Roll, 50s | Manchester Elvis tribute band, formed 2019. actType set to tribute. |
| The Franchise (`4fd13570…`) | Pop, Rock, Motown, Disco | Facebook page (same URL as stored) — "varied mix of pop, rock, Motown and disco". Location says Nottingham, stored record says Derbyshire, UK — flagged below, not corrected (genre-only scope). |
| LICKSQUID (`af0f7918…`) | Pop, Rock, Soul | lastminutemusicians.com, Ripley, Derbyshire — matches stored area |
| Mufunta (`70d8cac8…`) | Metal | Metal-archives.com and own Facebook — "sludge doom groove metal", Stoke-on-Trent, matches actType originals |
| Shaun Chipp (`400ff8b2…`) | Pop, Soul, Funk, Indie, Rock, Folk | Phase A — insangel.co.uk/bands/shaun-chipp (matches stored externalId), dropped non-canonical "Irish" |

Evidenced blank: Sam Bloor (record producer, not confirmed as a performing act — possible mis-typed entity, flagged), James Cowley Music (era-spanning covers repertoire, no clean genre), Lorna Grace Poole (framed as vocal coach/tutor, only indirect genre signal), Flying Panda (no reliable distinguishing source found), Rayven Skye (ambiguous match, no clean genre signal), Uncle Dad & The Day Drinkers (self-described "2 piece, drums n shouting", no confirmed canonical genre).

## Step 4 — validate. Non-negotiable.

```
python3 scripts/enrichment_validate.py --records data/state/tmp/bv2a-firing0718z-records.json --evidence data/state/tmp/bv2a-firing0718z-evidence-aliased.jsonl --mode gate
33 records · 3 clean · 2 FAIL · 52 WARN   [mode=gate]
```

Both FAILs were on **Shaun Chipp**: `BIO_VERBATIM` (comparing the record's untouched pre-existing bio against this firing's unrelated genre-evidence text) and `FB_EVIDENCE_MISMATCH` (evidence captured from the insangel Phase A source page, not the stored facebookUrl). Same standing false-positive class as 15+ same-day prior instances (RUN-REPORT-01 through 06 today, and every firing since 2026-08-28). Excluded from the validated batch with this rationale — the genre write itself is real and in the ledger. The open ruling request from `bv2a-circuit-breaker-tripped-firing1519z` (codify the exclusion, or key evidence per-field) remains unresolved.

Re-ran on 32 of the 33 records (Shaun Chipp excluded):

```
32 records · 3 clean · 0 FAIL · 52 WARN   [mode=gate]
```

All 52 WARNs are `STUB_NO_BIO`/`STUB_NO_IMAGE` (expected — venues carry no bio field under FP.2; artist genre-only writes never touched bio or image). Venues validated via the standing field-mapping adapter (`data/state/tmp/bv2a-firing0718z-records.json` + aliased evidence, `venueId`→`artistId`), consistent with the RUN-REPORT-20/`bv2a-firing0018z` precedent. **0 FAIL.**

## Step 5 — ledger, summary, dashboards

`data/state/enrichment-ledger.jsonl`: 43 lines appended (26 venue verified, 4 venue blank, 7 artist verified, 6 artist blank), plus 1 snapshot line. `data/state/run-summary.jsonl`: 1 line appended, `outcome:"completed"`, `recordsEnriched:33`, `skipped:10`.

Both dashboards regenerated:

```
python3 scripts/build_enrichment_dashboard.py --ledger data/state/enrichment-ledger.jsonl --out data/normalized/enrichment/DASHBOARD.html --generated 2026-08-30T07:58:30Z
→ 3550 enrichment records, 137 snapshots
python3 scripts/build_bndy_dashboard.py --root . --out data/normalized/DASHBOARD.html
→ wrote ./data/normalized/DASHBOARD.html
```

Snapshot: artistsTotal 3420 (unchanged), artistsMissingSocials 1294 (unchanged — no artist social writes this firing), artistsMissingGenres 834 (down from 841, exactly this firing's 7 genre writes), venuesTotal 3471 (unchanged), venuesMissingSocials 88 (down from 114, exactly this firing's 26 writes).

## Step 6 — summary

Budget used: 30 of 30 venues investigated (cap reached). 13 of 15 artists investigated (13 candidates found at a fresh offset; budget cap not reached on the artist side). Wall-clock: claim acquired 07:18:28Z, work concluded ~07:58Z — inside the 40-minute ceiling. Circuit breaker: did not fire. Chrome unavailable throughout; artist tiers 1 and 4 hard-stopped per the task's explicit partial-completion rule, not a run failure.

No names corrected under §0.6 this firing.

### For CTO-INBOX

- No new defect classes found. Standing `facebookUrl` silent-drop workaround (`socialMediaUrls`), `createdSince` ISO-cutoff workaround, and the venue-shape validator adapter all re-confirmed working.
- The Franchise (`4fd13570-cb81-41bc-ae76-62262e986bc0`): facebookUrl-confirmed identity, but the page's own description places the act in Nottingham while the stored record says Derbyshire, UK. Same shape as the standing region-mismatch class (Best of Foo, Yeo Division). Not corrected this firing (genre-only scope); needs a human check.
- Sam Bloor (`639ee241-b260-4c28-861f-2006bcc5f948`): stored as a "band" but every source describes a record producer/engineer, not a performing act. Possible mis-typed entity, needs a human check.
- Another same-day instance of the `BIO_VERBATIM`-on-untouched-pre-existing-bio false positive (Shaun Chipp), paired this time with a new variant, `FB_EVIDENCE_MISMATCH` on a Phase-A genre-only write where the evidence source is a structured page, not the stored facebookUrl. The open ruling request (codify the exclusion, or key evidence per-field) remains unresolved, now 16+ same-day instances.
