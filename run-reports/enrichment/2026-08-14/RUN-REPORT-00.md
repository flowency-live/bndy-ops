# ENRICHMENT RUN REPORT — 2026-08-14 (Bv2a Enrichment, hourly, unattended)

**Outcome: PARTIAL.** Venues enriched under budget. Artists blocked — Chrome connected but not logged into Facebook.
**Fired:** 2026-08-14T00:14:07Z. **Runbook read:** v2.27, floor asserted v2.19 (PASS). **Spec:** `ENRICHMENT-TASK-v3.md` v3.0, §0.0 and §FP read in full. **CTO-INBOX.md** fingerprints read in full.

---

## Step 0 — circuit breaker

Last 3 run reports in `data/normalized/enrichment/` (newest first):

1. `2026-08-12/RUN-REPORT.md` — supervised interactive GWRSA session, no validator run (different provenance method, `get_by_id` read-back). No FAIL recorded.
2. `2026-08-12/BLOCKED-shell-sandbox-unavailable.md` — STOPPED at pre-flight, validator never reached. No FAIL recorded.
3. `2026-08-07/RUN-REPORT-interactive-0040Z.md` — COMPLETED, validator `6 records · 1 clean · 0 FAIL · 6 WARN`.

**0 of 3 recorded a validator FAIL. All 3 wrote a report. Breaker NOT TRIPPED.**

## Step 1 — concurrency

Task prompt names `data\state\claims\enrichment.json`, which does not exist and has never existed — every prior firing of this task used `data\state\claims\bv2a-enrichment.json` (matches the runbook §6G TTL table's task name `bv2a-enrichment`). Treated the prompt's path as stale per RUNBOOK §6A ("a numeric floor written into a task prompt is void"; the same reasoning applies to a stale path) and used the live file. Found `expiresAt: 2026-08-13T15:00:00Z`, already passed → **acquired** per §6G's "expiresAt in the past" row, no takeover-of-a-live-holder involved. New claim `bv2a-enrichment-2026-08-14T00-14-07Z`, TTL 3h (§6G table), expires 2026-08-14T03:14:07Z. Heartbeat written first and last, per §6A step 0.

## Venues enriched — verified page attached (7)

| Venue | id | Facebook | Signal |
|---|---|---|---|
| New Hartley Memorial Hall | `2a48a6a4-41f0-44a8-865e-610d52889b6b` | facebook.com/New-Hartley-Community-Events-641495472670037 | Page's own description names the Memorial Hall as the events venue it publicises for. |
| The Lamb Inn | `ec8d9a2e-43ea-4017-93d3-a0348fcc7d31` | facebook.com/thelambinnstone | Name + town match, active page (669 likes), address confirms Stone. |
| St. Lawrence's Parish Church, Biddulph | `27024589-638e-43c3-b13d-a1748031c1e8` | facebook.com/biddulphchurch | Name + town match, active page, address confirms Biddulph. |
| Platform 1 @ East Bedlington Community Centre | `b4f818c9-fcc3-4ebe-8cac-b5c8a9d59792` | facebook.com/platform1musicvenue | Dedicated page, self-described as the venue's live-music arm; own website `ebcc.org.uk/platform-1` also added. |
| Church House, Buglawton | `6f8438ed-2cbf-4e46-bd30-19badc778ef1` | facebook.com/ChurchHouseBuglawton | Name + town match; own website `thechurchhousebuglawton.co.uk` also added. |
| Queens Social Club | `c83be787-2c5d-43fa-be23-5c28a538adb7` | facebook.com/queensthornaby | Title states "Queens Club, Thornaby \| Stockton-on-Tees" — town confirmed. Two other same-name candidate pages existed (`166139933438892`, `queensthornaby2`); this was the cleanest vanity-handle match and is flagged below for a human's 30 seconds. |
| Stanhill Working Mens Club | `ce67d164-b1a3-4cc3-889c-197887f995f1` | facebook.com/profile.php?id=181630725186879 | Name + town match; own website `stanhillsocialclub.com` also added. |

All 7 read back via `get_by_id` and confirmed (§0.10). Provenance `{source: "enrichment-v3", id: "<own id>"}` written on each per the spec header.

**Near-miss worth 30 seconds:** Queens Social Club, Thornaby has three live same-name Facebook pages (`queensthornaby`, `166139933438892`, `queensthornaby2`). Attached the vanity-handle page on town-match evidence only; a human glance would settle which is current.

## Evidenced blanks (5)

Per FP.2, a venue needs only `WebSearch` (Google) — no bio, so §0.0 does not bind and no Chrome visit is required; §2A.1 item 3b's "both surfaces" rule is an artist-identification requirement and does not apply to venues. All 5 below had at least one Google search returning no facebook.com/<page> result whose name and town matched.

| Venue | id | Variants tried |
|---|---|---|
| Annitsford Welfare Club | `4082b952-b9e3-4f81-acc0-2dd9f41fdcef` | `Annitsford Welfare Club facebook website`, `Annitsford Welfare Club New Fordley Cramlington` |
| Benks | `e279bada-a3dd-4846-8196-8a75bbe10713` | `Benks Leek Staffordshire pub facebook`, `Benks Leek facebook.com` |
| Tudor Nook, Cheadle | `701f5003-e01e-42ae-bb09-a08b0f5a9045` | `"Tudor Nook" Cheadle Staffordshire facebook` |
| Canal Tavern (Kidsgrove) | `367490c2-6382-4bca-8d9a-f0ed3584dfe2` | `"Canal Tavern" Kidsgrove facebook`, `"Canal Tavern" Hardingswood Road Kidsgrove facebook page` |
| W P M Sports & Social Club | `db9dd035-7cee-42a4-ad23-9976bad2a339` | `"W P M Sports" OR "WPM Sports and Social Club" Gosport facebook` (one FB events sub-URL surfaced, no canonical page handle resolvable from search alone) |

## Skipped

- **The Peacock Newcastle** (`e345cdd5-425c-4fba-b920-ec1fa721ca3c`) — next-oldest backlog venue after Church House. Skipped: CTO-INBOX already carries `peacock-newcastle-wrong-geocode` (this exact id) — the stored address may be the wrong branch of a two-Peacock collision. Enriching its socials before that geocode question is resolved risks attaching a Facebook page to the wrong building. Left for the geocode fix first.
- **All artist candidates** (5 created-in-24h: Electric Mutiny, Jada Tia, Derailed, Dirty Little Secret, Reload; all backlog-artist and missing-genre priorities) — see Hard Stop below.

## Hard stop — artists

Chrome had exactly one connected browser (precondition met) but `facebook.com` rendered the logged-out landing page (`Sign up` / `Log in` visible, no session). Per this task's own HARD STOPS list: *"Chrome unavailable or not logged in to Facebook (venues may proceed; artists may not)."* No artist was searched, visited, or written to. Priority-5 (genre-only top-ups on artists that already hold a facebookUrl) was also skipped rather than half-run through a non-Facebook source path, given the time already spent on venues — flagged for the next run to pick up first.

## Names corrected under §0.6

None. No venue name required stripping or correction this run.

## Validator

Fed the validator the 7 written venue records. First pass (venue's native shape — `socialMediaUrls[]`, `city`) returned **14 FAIL**, all `BLANK_NOT_EVIDENCED` and `NO_LOCATION` — this is the known artist-shaped schema gap in `enrichment_validate.py` (it reads only a top-level `facebookUrl` string and a `location` field), the same defect already explained in `2026-08-07/RUN-REPORT-22.md` as "not a fidelity failure". Re-fed the same 7 records with `facebookUrl`/`location` aliases mirroring the true stored values (no data invented — `location` = the venue's own `city`, `facebookUrl` = the one URL already in `socialMediaUrls`):

```
7 records · 0 clean · 0 FAIL · 14 WARN   [mode=gate]
```

The 14 WARN are `STUB_NO_BIO` + `STUB_NO_IMAGE` on all 7 — both artist-only checks (venues carry no `bio` field and FP.2 explicitly waives the Chrome/image step for venues). Exit 0. Batch ships.

## Budget

**Time-bound stop, not count-bound.** 7 venues enriched + 5 evidenced blank + 1 skipped = 13 venues attempted, well under the 30-venue ceiling. 0 of 15 artists attempted (hard stop). Elapsed to this point: ~25 minutes of the 40-minute ceiling; stopped here to leave time for validation, ledger, dashboards and this report rather than push further into the venue backlog with no artist work bankable this run.

## Raised to CTO-INBOX

- `validator-venue-schema-mismatch` (DEFECT) — recurring, not new; this is at least the second dated instance (2026-08-07, now 2026-08-14).
- `bv2a-facebook-not-logged-in` (BLOCKED) — artist portion only; venues unaffected.
- `bv2a-claim-path-stale-in-prompt` (RULE) — the task prompt's claim path does not match the live claim file.
