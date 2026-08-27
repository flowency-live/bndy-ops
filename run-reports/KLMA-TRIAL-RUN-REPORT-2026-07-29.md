# KLMA SUPERVISED TRIAL RUN — 2026-07-29 (Cowork session, Jason supervising)

**Scope:** KLMA sheet rows for Thu 30 + Fri 31 Jul (11 gigs, 13 rows incl. 2 source-side dup rows). Task def: KLMA-TASK-v2.md. First live run under GATE_MODE=enforce + runbook v1.6.

## VERDICT: the gates work in live fire. Zero duplicates created. Every bad pattern bounced or resolved correctly.

## Gate proof (the point of the trial)
| Test | Result |
|---|---|
| Raw Cosey listing string "Cyril Blake 60s & 70s Band - It'll Be Fun! All Aboard!!" as artist | ✅ **BOUNCED 400 data_quality, fail closed, nothing created** |
| Not Guilty (name exists in 2 regions) | ✅ **action:review** with both candidates; mechanical §1A pick = Stoke record (gig at Swiftys, Meir) |
| 4 already-imported events (Not Guilty, Crosshair, Front Page News, Nathan Peake, Seriously Collins, VANZ ROXX — 6 total) | ✅ **409 DUPLICATE_EVENT each, existing id returned, none re-created** |
| Source-side dup row (Crosshair ×2 in sheet) | ✅ processed once |
| Lineup "Walter Kocays + Ava Ralph" | ✅ split → 2 artists + **2 discrete events** (§4), sibling ids logged below |
| "The VANZ ROXX" | ✅ ADR-023: matched existing **The Vanz** (7a16a3b6); act stayed in the title (event already existed → bounced too) |
| Venue matching incl. spelling variants ("Post Office"/"Old Post Office", "The Cosey Haslington"→Cosey Club, "Banker's Draught Pub In Leek"→The Bankers Draught) | ✅ all 10 venues matched existing records, **zero venue creates** |

## §2A enrichment-before-decide, demonstrated
Billing "Cyril Blake 60s & 70s Band" — no such artist existed. Web identification found the act's REAL name: **"Cyril Blake's Multicoloured Bus Ride"** (60s/70s covers band, resident at The Cosey — crewe.nub.news). Created under the real name, genres + actType covers evidenced, location Crewe. No confident FB page found → left blank (blank beats wrong), attempt logged.

## Writes (all verified by read-back)
**Artists created (6, all needs_review):** Cyril Blake's Multicoloured Bus Ride (8e452e7a) · Danny & Friends (549582d2) · Walter Kocays (ecb4cd24) · Ava Ralph (04fde5ea) · Dom Morgan (90c44da2) · Electric Tentacle (b0ef69f8)
**Artists matched (6, reused):** Crosshair · Front Page News · Nathan Peake · Seriously Collins · The Vanz · Not Guilty (Stoke 15a8c00c via review-pick)
**Events created (6):** Bus Ride @ Cosey Club 31/7 (40b86fd1) · Danny & Friends @ PAU Cafe 31/7 (8f9f2013) · Bushtonbury Day 1 - Dom Morgan @ The Bush 31/7 (e74a86e0, FB event link attached) · Walter Kocays @ Artisan Tap 31/7 (514aa17f) · Ava Ralph @ Artisan Tap 31/7 (607d1121) ← lineup siblings · Electric Tentacle @ Artisan Tap 30/7 (c48f5e61)
**Events bounced (6, already existed):** b3a762b1 (Not Guilty @ Swiftys) · 9eed7a21 (Crosshair @ Furlong) · f570d093 (FPN @ Old Post Office) · 346a8fe1 (Nathan Peake @ Bankers Draught) · a67ab01a (Seriously Collins @ Eleven) · 51ad576c (VANZ ROXX @ Ashwood)

## Staged for Jason / follow-ups
1. **Dup venue pairs found (place_id differs, same building — sentinels can't collapse these):** The Ashwood (2UNlZvpY) vs Ashwood Longton (a0489e41); PAU Cafe (9Lo1wQb5) vs "Pau, Trentham" (4f3a6fff). → venue-merge per keeper rules.
2. **Start times defaulted to 20:00** (19:30 PAU) where the sheet had none — flagged, edit if wrong.
3. Bounced existing events NOT topped-up with the sheet's times/prices this run (out of trial scope) — a future run can enrich them via edit_event.
4. `create_artist` externalIds didn't persist on the community create path (empty after create AND after edit_artist merge) — **minor API bug for the VSCode agent**: provenance externalIds on artists lost.
5. Not Guilty (Stoke) could take the klma externalId + FB event link as top-up.
6. Snapshot file klma-last-page.txt NOT updated (trial only covered 2 days of rows).

## Runbook compliance
No judgment on identity (review pick was mechanical: region match) · every 409/422 obeyed, zero workarounds · no venue guessed · lineup split per §4 · past rows untouched · caps nowhere near (12 creates) · this report = the §6 run report.
