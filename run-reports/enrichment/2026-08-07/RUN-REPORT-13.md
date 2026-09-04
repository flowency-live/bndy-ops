# RUN REPORT — Bv2a Enrichment (hourly, unattended)

**Fired:** ~2026-08-07T14:20 UTC (heartbeat `2026-08-07T14-26-32Z`, actual start delayed to 14:26 by Step 0/2/2b reading). **Finished:** 2026-08-07T14:56 UTC. **Outcome: COMPLETED** (stopped early on time budget, not the 30/15 record cap — permitted by the task's own "whichever comes first").
**Runbook version read: H1 v2.16** (≥ CURRENT FLOOR v2.16 — pass).

## Step 0 — circuit breaker: did NOT trip

Read newest-first: `CIRCUIT-BREAKER-TRIPPED-14.md` (14:20, reasoned stop — a prior 13:20:07Z firing acquired the claim, wrote heartbeat `outcome:started`, and went dark with no report, no claim release; the breaker correctly stopped and reported it, writing nothing to bndy), `RUN-REPORT-12.md` (validator `8 records · 0 clean(sic, all 8 verified/blank) · 0 FAIL · 9 WARN`), `RUN-REPORT-10.md` (validator `5 records · 0 FAIL · 5 WARN`). **Zero validator FAILs among the three, and all three produced a report** — the silent 13:20:07Z gap was itself the thing CB-14 caught and reported, not a second unreported gap. Per CB-14's own closing note ("the next scheduled run's Step 0 ... should proceed normally"), and independently re-verified here by reading every `bv2a-enrichment*` heartbeat file in `data/state/heartbeat/` (only the single 13:20:07Z entry is stuck at `outcome:started`; no other unresolved firing exists) — proceeded.

## Step 1/2/2b — concurrency

`data/state/claims/bv2a-enrichment.json` held `expiresAt: 2026-08-07T14:05:07Z` (the dead 13:20:07Z run's claim) — in the past, so acquired per §6G table row 2. New claim: `bv2a-enrichment-hourly-unattended-bv2a-20260807T142632Z`, `acquiredAt 14:26:32Z`, `expiresAt 15:11:32Z`. **`data/state/enrichment.lock` exists (written ~13:19 by the dead run) — not honoured, not deleted, not recreated**, per §6A step 2b / v2.14. Released cleanly at the end of this run (see below).

## Records ENRICHED with a verified page (7 — all venues)

| Venue | id | Field(s) | Source of match |
|---|---|---|---|
| The Lion House, Allendale | `2555dbb5-c8e1-4fd8-9639-c6dc4138d552` | facebookUrl | Google → facebook.com/thegoldenlionallendale — address match (Market Place, Allendale NE47 9BD) |
| Esholt Sports & Leisure Club | `71ea140d-8b29-4b17-8cae-e9a34c8d5cb7` | facebookUrl, phone | Google — Bradford/Shipley area match |
| Fat Lil's, Witney | `58a32d40-5cfa-4e13-ba56-e0caa0702a42` | facebookUrl, website | Google — exact address match (64A Corn St) |
| Farmers Arms, Congleton | `9d5c213f-5f37-4637-adb0-95e01bdb0df4` | facebookUrl | Google — exact name+town match |
| Top of The World Stafford | `f368ee4b-dfb5-43f8-a29f-5b73161049bf` | facebookUrl, website | Two FB candidates competed (staffordbesteventsvenues vs staffordeventvenue) — resolved by fetching the venue's own official site, which links `facebook.com/staffordeventvenue` itself (Tier A, source-linked) |
| Groves Restaurant and Bar | `d49796fd-2536-40c4-8036-9816f0f1958f` | facebookUrl | Google — exact address match (22C Elm Grove). **Flag:** FB page trades as "Groves Bar & Kitchen" (renamed from the bndy record's "Restaurant and Bar"); a second candidate "Groves Bar & Tapas" exists at the same address — picked Kitchen as the more established/active page (426 likes, 262 check-ins). Worth a human glance. |
| The Mermaid, Exeter | `974e7891-2c14-41bf-a08f-05c46afaa7a9` | facebookUrl, phone | Google — exact address match (11b Gandy St) |

## Records recorded as an EVIDENCED BLANK

**Venues (8)** — WebSearch only, per §FP.2 (Chrome only needed when two pages compete, which didn't apply to any of these):
- The Blacksmiths Arms, Gosforth `10432a06…` — variants: `"Blacksmiths Arms" Gosforth facebook`. Only groups/event posts surfaced, no venue-owned page.
- Annitsford Welfare Club `4082b952…` — variants: `"Annitsford Welfare Club" facebook`. Nearest hit is a different club (Annitsford Irish Club) — not attached to avoid collision.
- The Blvd, Tunstall `235b4719…` — variants: `"The Blvd" Tunstall Stoke-on-Trent facebook`. No page or website found at all; venue name itself is vague and may be a bad parse — flagged, not corrected (out of this task's remit).
- New Hartley Memorial Hall `2a48a6a4…` — variants: `"New Hartley Memorial Hall" facebook`. Only a residents'-association community-events page exists (covers multiple venues) — too weak to attach as the Hall's own identity.
- Tudor Nook, Cheadle `701f5003…` — variants: `"Tudor Nook" Cheadle facebook`. bndy address literally contains "Tudor House"; nearest candidates are "Tudor House Tea Rooms"/"Tudor House Crafts" at the same building — plausible but name doesn't match closely enough to attach. **Flag for a human: is Tudor Nook a room inside Tudor House Tea Rooms?**
- W P M Sports & Social Club, Gosport `db9dd035…` — variants: `"WPM Sports" Gosport facebook`. Only "WPM Titans" (reads as a sports team, not the club itself) found.
- Canal Tavern, Kidsgrove `367490c2…` — variants: `"Canal Tavern" Kidsgrove facebook`. Only a same-named pub in Thorne (wrong town) found.
- The Nags Head, Ripley `018ed55b…` — variants: `"The Nags Head" Ripley Derbyshire facebook`. Directory listings reference a Facebook presence but no resolvable URL surfaced.

**Artists (4)** — both surfaces tried (Google WebSearch + Facebook page search via Chrome, logged in as verified by screenshot), per §2A.1 item 3b / RUNBOOK §2A.1.3b, binding for artists:
- Terri and the Waders `b3555a0b…` — variants: Google `"Terri and the Waders" band`; Facebook page search `Terri and the Waders` (zero results on both surfaces).
- T Junction `8ac5ddd7…` — variants: Google `"T Junction" band facebook`; Facebook page search `T Junction band` surfaced a plausible "T-junction band" page (102 followers, Musician/band, "5 piece band playing hits of the 60's, 70's and popular hits of Rod Stewart") but **no location stated on the page** — name+genre alone is Tier C, explicitly insufficient per RUNBOOK §6. Not attached.
- Patch Collins `4cb1695f…` — variants: Google `"Patch Collins" music`; Facebook page search `Patch Collins` (no relevant candidate on either surface).
- Grace Curran `9778ce9e…` — variants: Google `"Grace Curran" music singer`; Facebook page search `Grace Curran music` (no dedicated FB page on either surface — facebookUrl blank). **Partial enrichment:** Google surfaced `instagram.com/gracecurranmusic` with a stated location (Liverpool/Stoke-on-Trent) consistent with the bndy record's Newcastle-under-Lyme — attached as instagramUrl (trivially confirmed, §2A enrichment fields).

## Records SKIPPED (budget/time, not attempted this run)

7 of the 11 artists created in the last 24h with missing socials were not reached: Nazma Dawn Desai, Lee Ashley, Paul McCoy, Mike Jones, Dale Murphy, Sophie Jenkinson (Google-only lead found, a different-city session vocalist — not confidently the same act; Facebook-surface check not completed), plus one not reached at all. **Next run retries these** — nothing was staged or parked. Backlog venues beyond the 15 processed (699 total missing socials at run start), backlog artists (priority tier 4), and artists-missing-genres-with-facebookUrl (priority tier 5) were not reached this run.

## Names corrected under §0.6

None — no artist names required sanitising this run (all 4 artist candidates were already clean act names).

## Validator

```
4 records · 4 clean · 0 FAIL · 0 WARN   [mode=gate]
```
Exit code 0. Ran against the 4 artist records touched (Grace Curran, Terri and the Waders, T Junction, Patch Collins) with evidence read from `data/state/enrichment-evidence-2026-08-07-bv2a-enrichment.jsonl`. The validator's schema targets artist records (bio/facebookUrl rules); the 15 venue edits were verified by hand via `get_by_id` read-back instead (§0.10) — all socialMediaUrls/website/phone writes confirmed present on read-back, none pending.

## Budget used

**15 venues + 4 artists = 19 records touched** (of the 30 venue / 15 artist cap). Stopped on **time budget**, not the record cap — per the task's "whichever comes first," this is a compliant early stop, not a failure. Circuit breaker did **not** fire.

## Ledger / snapshot / dashboards

- 19 lines appended to `data/state/enrichment-ledger.jsonl` (7 verified + 8 blank venues, 1 partial + 3 blank artists), plus 1 snapshot line.
- Snapshot counts (post-run): artists 1,939 total / 751 missing socials / 675 missing genres; venues 2,110 total / 692 missing socials.
- 1 line appended to `data/state/run-summary.jsonl`.
- Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (467 records, 15 snapshots) and `data/normalized/DASHBOARD.html`.
- Claim released: `data/state/claims/bv2a-enrichment.json` → `heldBy: null`.
- Final heartbeat: `bv2a-enrichment-hourly-unattended-2026-08-07T14-26-32Z.json` → `outcome: completed`.

## Open items for a human

1. **Groves Restaurant and Bar** — FB page trades as "Groves Bar & Kitchen"; consider a name top-up on next contact, and check the competing "Groves Bar & Tapas" page isn't the more current one.
2. **Tudor Nook, Cheadle** — possible relationship to "Tudor House Tea Rooms" at the same address; needs a human or a future run with more budget to resolve.
3. **The Blvd, Tunstall** — vague venue name/address, no web presence found at all; may be worth a §0.19-style review of whether this record is even correctly named.
