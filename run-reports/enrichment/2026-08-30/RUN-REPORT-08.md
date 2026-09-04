# Bv2a Enrichment — Run Report

Run id: `bv2a-enrichment-2026-08-30T08-19-31Z`. Outcome: completed (partial). Venues worked in full under FP.2. Artist tiers 1 and 4 hard-stopped on Chrome. Tier 5 (genre-only) investigated via WebSearch and lemonrock Phase A harvest; 0 usable genre writes.

## Step 0 — circuit breaker

- RUN-REPORT-07 (2026-08-30, 07:18Z): outcome completed (partial). Validator `33 records · 3 clean · 2 FAIL · 52 WARN` first pass, both FAILs excluded per standing BIO_VERBATIM/FB_EVIDENCE_MISMATCH false-positive class (Shaun Chipp), 0 FAIL on the shipped pass.
- RUN-REPORT-06 (2026-08-30, 06:17Z): outcome completed (partial). Validator `27 records · 0 clean · 0 FAIL · 56 WARN`. 0 FAIL.
- RUN-REPORT-05 (2026-08-30, 05:18Z): outcome completed (partial). Validator `27 records · 3 clean · 0 FAIL · 45 WARN`. 0 FAIL.

0 of the last 3 reports carried a recorded validator FAIL on their shipped pass. All 3 wrote a report. **The breaker did not trip.**

## Step 1/2 — runbook, task spec, floor

`RUNBOOK.md` read in full. H1 = v2.27. CURRENT FLOOR (§6A) = v2.19. 2.27 ≥ 2.19. Floor check passed.

`ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail read for standing `bv2a-*` fingerprints: the `edit_venue` `facebookUrl` silent-drop defect (workaround: `socialMediaUrls`), the `createdSince:"24h"` string-not-parsed defect (workaround: explicit ISO cutoff), the validator venue-shape gap and its field-mapping adapter, the `FB_EVIDENCE_MISMATCH`-on-display-string class, the `BIO_VERBATIM`-on-untouched-bio false-positive class (open ruling request, 16+ same-day instances), the standing identity-mismatch flags (Body Factory Gym/Paringdon, Spaces Studio, Astor Hall, Decade of Dance, King Kurt Pudding Party — none re-touched this firing), and the standing Chrome outage (5th+ consecutive firing tonight with zero connected browsers).

## Step 2b — concurrency

No `data\state\enrichment.lock` found — correctly never recreated, per v2.14. Prior claim on `data\state\claims\bv2a-enrichment.json` read `{"heldBy":null,"releasedAt":"2026-08-30T07:58:30Z", ...}` — released. Wrote heartbeat `data/state/heartbeat/bv2a-enrichment-2026-08-30T08-19-31Z.json` (`outcome:"started"`), then acquired the claim (`heldBy: bv2a-enrichment-2026-08-30T08-19-31Z`, TTL 3h, `expiresAt: 2026-08-30T11:19:31Z`). Released at close (this report's write).

## Step 3 — tool check

`bndy-events` MCP tools reachable. `WebSearch` reachable. **Chrome unreachable**: `list_connected_browsers` returned zero. Per the task's HARD STOPS, venues may proceed (FP.2 needs no Chrome); artists needing an identity check or a bio quote (tiers 1 and 4) may not.

## Work done

### Tier 1 — artists created in the last 24h, missing socials
`list_artists(createdSince:"2026-08-29T08:19:31Z", missingSocials:true)` returned 114, not worked. Chrome unreachable; tier 1 requires either a Facebook identity check (§2A.1 item 3) or a bio quote (item 8/§0.0), neither obtainable from WebSearch alone. Per the task's HARD STOPS this is not a run failure.

### Tier 2 — venues created in the last 24h, missing socials
`list_venues(createdSince:"2026-08-29T08:19:31Z", missingSocials:true)` returned 62 (part of the ongoing `livebandphotos` import surge noted in RUN-REPORT overnight, `venuesMissingSocials` moved 29→90→217→64 across the night as the import and successive firings' work interleaved). Worked 30 of the 62 under FP.2, oldest-appearing-first within the returned page. Budget cap (30 venues) reached; the remaining ~32 fresh venues and the older backlog (tier 3) were not reached this firing.

**24 venues enriched with a verified page/website (all read back via `get_by_id`, all confirmed persisting):**

| Venue | Fields written | Signal |
|---|---|---|
| Bromley United Services Club | website | Official site thebusc.com, address match. facebookUrl left blank — 3 competing FB page candidates (Orpington-tagged, Bromley-tagged, and a third), no Chrome to disambiguate. |
| Plough (Ipswich) | website | The People's Pub Co. official page for this exact pub, address match. |
| The Bay Horse (Sudbury) | facebookUrl, website | FB page + own site, address match. |
| Northfleet & District Traders Association | facebookUrl | FB Page (preferred over a co-existing Group of the same name), address match. |
| The Butchers Arms (Barnet) | facebookUrl | FB page, address match exactly. |
| Brentham Club (Ealing) | website | Official club site, address match. |
| Five Bells Cavendish | facebookUrl | FB page "The Cavendish Five Bells", town match. |
| Royal Oak (Chingford) | facebookUrl | FB page "TheRoyalOakChingford", address match exactly. |
| Anvil Inn Congham | facebookUrl, website | FB page + own site, address match. |
| Curzon Community Centre (Barking) | facebookUrl | FB page, address match. |
| The Miners Arms (Dunton Green) | facebookUrl | FB page, address match. |
| The Royal Oak (St Ives, Cambs) | facebookUrl | FB page, address match (13 Crown St, PE27 5EB). |
| The Brickmakers (Norwich) | facebookUrl, website | Current active FB page + own site; an older "thebrickmakers" page explicitly labelled "2003 to 2022" was correctly not used. |
| The Railway (Blackheath) | website | Official site, address match. No distinct FB page URL surfaced. |
| Dartford Social Club Ltd | facebookUrl | FB page, address match. |
| Crittall Athletic & Social Club | facebookUrl | Only online presence is a Facebook Group (no Page exists) — used per the group-is-valid-evidence precedent. |
| The White Hart (King's Lynn) | facebookUrl, website | FB page + direct-booking site, address match exactly. |
| White Horse (Sudbury) | facebookUrl | FB page, address match. |
| Market House (Maidstone) | facebookUrl, website | FB page + own site, address match. |
| The Railway Tavern (Longfield) | facebookUrl, website | FB page + own site, address match. |
| The White Lion (Baldock) | website | Official site, address match. No distinct FB page URL surfaced (only third-party group posts). |
| Rainham Cricket Club | facebookUrl, website | FB page + own site, address match. |
| The Pelham Arms (Gravesend) | facebookUrl | FB Page (a separate fan Group of the same name also exists; Page preferred), address match. |
| The Kings Head (Tollesbury) | facebookUrl | FB page "The Kings Head \| Maldon" (facebook.com/tollesbury), title match + 1,371 likes/598 check-ins + address match. **Supersedes an earlier same-day finding** (RUN-REPORT-07, 07:35Z) that flagged this venue as 3-way multi-candidate ambiguous — this firing's search surfaced only this one candidate, with a specific "Kings Head" page title and strong check-in corroboration, distinguishing it from the other two candidates the earlier firing saw (neither titled "Kings Head"). Flagged here for a human's 30 seconds given the prior ambiguity note. |

**6 venues investigated, left blank (evidenced):**

| Venue | Reason | Variants tried |
|---|---|---|
| Three Horseshoes (Bures) | Two competing FB page candidates for the same pub name/town (`100057205040024` and `647045332013498`), no way to disambiguate without Chrome. | `"Three Horseshoes" Bures pub facebook website` |
| Enfield Town Club | Only same-name unrelated football-club pages surfaced (Enfield Town FC and variants); no evidence either represents this specific social club. | `"Enfield Town Club" Enfield facebook website` |
| The Cock Inn (Hadleigh) | No clear FB or website URL surfaced in results. | `"The Cock Inn" Hadleigh Ipswich facebook website` |
| The Link Social Club (Harlow) | No confirmed owned Facebook Page found (only third-party group posts, CAMRA/venue-hire listings). | `"The Link Social Club" Harlow Parsloe Road facebook` |
| George Woodford (South Woodford) | Result confirms "they have a Facebook page" but no URL surfaced in the snippet. | `"George Woodford" pub 70 High Road South Woodford facebook` |
| The Social (Leytonstone Ex-Servicemen's Club) | Multiple competing FB candidates (a personal-style profile, a fan group, and a Page), no way to confirm which is current/official without Chrome. | `"Leytonstone Ex-Servicemen's Club" OR "The Social" Harvey Road Leytonstone facebook` |

**Budget used: 30 of 30 venues investigated (cap reached).**

### Tier 5 — artists missing genres that already hold a facebookUrl (genre-only, no Chrome needed)
13 candidates investigated (Glass Unicorn, The Currants, BNJY, The Desperate Cowboys, Bet Shop Boys, Soundgenarator, Rob Hunt, The Humanitarians, the Grey Numbers, JD & the Parrots, Umlaut Overload, Erika Wood — plus lemonrock Phase A checks on P J Carter and Jane Keele). **0 genre writes.** WebSearch consistently failed to surface a canonical-enum genre from an attributable source; lemonrock Phase A harvest (`robhunt`, `thehumanitarians`, `janekeele`) returned pages with "Genres: No genres set" — the lemonrock "Genre" meta field for these is actually the Originals/Covers value, not a true genre, and none of bndy's genre-only candidates gained anything from it. This reconfirms the standing low-yield finding already logged today (`bv2a-firing0617z-tier5-genre-webSearch-low-yield`, RUN-REPORT-06): this lane is not Chrome-independent in practice, because the genre almost always lives on the Facebook page itself, not in a Google snippet or a lemonrock stub. No writes made; no wrong genre risked. Budget cap (15) not reached — genuinely no usable evidence, not a time-out.

### Tier 1 / Tier 4 (artist socials, new and backlog)
Both hard-stopped on Chrome per the task's explicit HARD STOPS clause. Not a run failure.

### insangel Phase A check
`web_fetch(insangel.co.uk/bands/mike-simpson)` returned empty content — consistent with insangel's own reported Chrome/surface outage today (`insangel-no-surface-second-consecutive-day`, logged 2026-08-30). Did not block this firing's tier-5 work since Mike Simpson holds no facebookUrl (not a tier-5 candidate); noted as a corroborating data point.

## Validator summary line (verbatim)

```
24 records · 5 clean · 0 FAIL · 38 WARN   [mode=gate]
```

All 38 WARNs are `STUB_NO_BIO`/`STUB_NO_IMAGE` — expected and correct, since venues carry no bio/image field under FP.2. Venues validated via the standing field-mapping adapter (`data/state/tmp/bv2a-firing0819z-records.json` + aliased evidence, `venueId`→`artistId`), consistent with the RUN-REPORT-20/RUN-REPORT-06/-07 precedent. **0 FAIL.**

No artist records were written this firing (tier 5 yielded no evidence-backed writes), so no artist-shaped validation pass was needed.

## Ledger, summary, dashboards

`data/state/enrichment-ledger.jsonl`: 31 lines appended (24 venue verified, 6 venue blank), plus 1 snapshot line. `data/state/run-summary.jsonl`: 1 line appended, `outcome:"completed"`, `recordsEnriched:24`, `skipped:6`. Both dashboards regenerated (`data/normalized/enrichment/DASHBOARD.html`, `data/normalized/DASHBOARD.html`).

Snapshot: artistsTotal 3420, artistsMissingSocials 1294, artistsMissingGenres 834, venuesTotal 3471, venuesMissingSocials 64 (up from 62 at firing start — a concurrent import process added venues during this run, consistent with the ongoing `livebandphotos` surge).

## Names corrected under §0.6

None this firing (no artist records touched).

## Budget and circuit breaker

Budget used: 30 of 30 venues investigated (cap reached, 24 written + 6 evidenced blank). 13 artist candidates investigated for genre-only enrichment (tier 5), 0 written — genuine lack of evidence, not a cap. Wall-clock: claim acquired 08:19:31Z, work concluded ~08:31Z — about 12 minutes, well inside the 40-minute ceiling. Circuit breaker: did not fire. Chrome unavailable throughout; artist tiers 1 and 4 hard-stopped per the task's explicit partial-completion rule, not a run failure.

## Open items for a human

- **The Kings Head (Tollesbury)**: this firing attached `facebook.com/tollesbury` after RUN-REPORT-07 (07:35Z) flagged the same venue as 3-way multi-candidate ambiguous. Reasoning given above; worth a human's 30 seconds given the prior flag.
- Standing open ruling (unchanged, not re-touched): `bv2a-circuit-breaker-tripped-firing1519z` — codify the BIO_VERBATIM-on-untouched-bio exclusion, or key evidence per-field rather than per-record.
- Standing identity-mismatch flags (unchanged, not re-touched): Body Factory Gym/Paringdon, Spaces Studio, Astor Hall, Decade of Dance, King Kurt Pudding Party.
- Tier-5 genre-only lane: recommend deprioritising on nights Chrome is down (now confirmed a second time), consistent with RUN-REPORT-06's recommendation.

## No new defect classes found

Standing `facebookUrl` silent-drop workaround (`socialMediaUrls`), `createdSince` ISO-cutoff workaround, and the venue-shape validator adapter all re-confirmed working.
