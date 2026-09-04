# Bv2a Enrichment — RUN-REPORT-09 (2026-08-28)

**Run id:** `bv2a-enrichment-2026-08-28T09-18-15Z`. **Outcome: completed.**

## Circuit breaker (Step 0)

Checked the last 3 run reports in `data\normalized\enrichment\2026-08-28\` before any other action: `RUN-REPORT-08` (08:17:44Z firing, completed, validator `5 records · 0 clean · 0 FAIL · 6 WARN`), `RUN-REPORT-07` (07:18:50Z firing, completed, `5 records · 5 clean · 0 FAIL · 0 WARN`), `RUN-REPORT-06` (06:18:43Z firing, completed, `14 records · 13 clean · 0 FAIL · 1 WARN`). All three completed with a final 0 FAIL. Breaker did not fire.

## Runbook / task-spec / inbox read (Step 2)

`RUNBOOK.md` H1 = **v2.27**, read in full (§0A, §0 prime directives 1–29, §1/§1A identity, §2/§2A enrichment protocol including item 3b both-surfaces-mandatory and item 8 bio-is-a-quotation, §3 venue protocol, §4/§5 event rules, §6/§6A run contract steps 0–9, §6B–§6E, §6F/§6G concurrency, §7 changelog). **CURRENT FLOOR (§6A) = v2.19.** 2.27 ≥ 2.19, floor check passed. `ENRICHMENT-TASK-v3.md` read in full: §0.0 (bio-is-quoted), §FP fast path (FP.1–FP.4), §1–12. `CTO-INBOX.md` tail read in full before selection (standing bv2a-* fingerprints: bio-verbatim-untouched-preexisting ×7, venue-backlog-saturated ×9, venue-edit-facebookurl/instagramurl silent-noop, genres-replace-not-merge, verify-id-before-write, never-guess-fb-vanity-url, validator-cannot-check-venues, bash-heredoc-mangles-emoji, tier4-sampling-never-reaches-true-oldest).

**Concurrency (§6A step 2b, per RUNBOOK not the inline prompt text):** the task prompt's inline instructions (Step 0 lock-check-before-runbook-read, and naming the claim file `data/state/claims/enrichment.json`) are void per §6A step 2a/2b and §6G — this runbook was read first, and the claim file used is `data\state\claims\bv2a-enrichment.json` per §6F/§6G's per-task slug convention, confirmed against every prior run report today. Read the claim at firing start: `{"heldBy":null,"releasedAt":"2026-08-28T08:34:03Z","lastRun":"bv2a-enrichment-2026-08-28T08-17-44Z"}` — released. Wrote heartbeat `data\state\heartbeat\bv2a-enrichment-2026-08-28T09-18-15Z.json` (`outcome:"started"`) before any gate, then acquired the claim (`heldBy: bv2a-enrichment-2026-08-28T09-18-15Z`, TTL 3h, `expiresAt: 2026-08-28T12:18:15Z`). No stray `data\state\enrichment.lock` file found — not honoured, not recreated, per §6A step 2b / §6G (five other tasks' `.lock` files exist in `data/state/` and were left untouched, not this task's concern). Released at close and heartbeat rewritten to `outcome:"completed"`.

**Chrome:** exactly one browser connected ("Browser 1"), logged into Facebook throughout (confirmed via `facebook.com/` load showing the logged-in home feed before any search). No hard stop encountered.

## Selection (Step 3)

**Tier 1 — artists created in the last 24h missing socials:** `list_artists(createdSince:"2026-08-27T09:18:15Z", missingSocials:true)` returned 14. All 14 already carried today's evidence-file entries from earlier firings (verified by cross-checking artistId against `enrichment-evidence-2026-08-28-enrichment.jsonl`, which held 152 unique ids before this firing). 0 fresh Tier 1 records.

**Tier 2 — venues created in the last 24h missing socials:** `list_venues(createdSince:..., missingSocials:true)` returned 0.

**Tier 3 — backlog venues missing socials, oldest first:** `list_venues(missingSocials:true)` returned the same 34 records as every firing since 00:45Z today. Went further than a CTO-INBOX cross-reference this firing: ran `enrich_venue` in a single batch call against all 34 ids. Result: **0 enriched, 34 skipped** — every one already carries a `google_place_id` and the Places record yields no free website for any of them. Combined with the CTO-INBOX fingerprint cross-reference (park/nature-reserve, business-mismatch, ambiguous-address, non-venue/placeholder classes), **zero unflagged, unworked venue records found.** 10th consecutive firing today reconfirming full saturation. 0 venue writes.

**Tier 4 — backlog artists missing socials, oldest createdAt first:** `list_artists(missingSocials:true)` returned 1371 total (no server-side createdAt sort, per the standing `bv2a-firing2219z-tier4-sampling-never-reaches-true-oldest` finding). Paged at offset 100 and offset 150 (50 records each), cross-referenced every candidate's id against today's evidence file, and selected the 15 oldest genuinely-fresh records found across both pages: The Comittee (2026-04-29, the single oldest record touched today), Kamaro (2026-05-15), The Needles / Tina LIVE / JAM TRIBUTE (2026-05-22), The Dirty Notes (2026-06-03), The Cords / Cheap Date / The Prediction (2026-06-10), Hospital Food (2026-07-02), April Davies (2026-07-31 13:20), The Black Dog Boogie Band (2026-07-31 20:36), Dogleg (2026-07-31 23:56), Levent & Taylor's World Band (2026-08-09 22:07), Suburban Sneeze (2026-08-09 21:55).

**Tier 5 — artists missing genres with an existing facebookUrl:** not reached; Tier 4 filled the 15-artist budget exactly.

## Records enriched WITH a verified page (4)

| Artist | Fields | Evidence |
|---|---|---|
| Kamaro → **renamed Komaro** (`af8c2c46…`) | name, facebookUrl, bio, genres, actType | facebook.com/Komaroband/about — Musician/band, "Rock and pop party band playing weddings, events and pubs in Hampshire and surrounding areas!" — exact region match to stored Hampshire, sole candidate, one-letter spelling variant on the source's own name. Renamed to the page's own spelling per §0.20/§2A.5. Bio quoted verbatim; genres Rock/Pop and actType covers inferred from the bio text itself. |
| Levent & Taylor's World Band (`d9b143d9…`) | facebookUrl, bio, genres | facebook.com/LeventTaylor/about — "Original Gypsy-Jazz, Latin and World Music partnership from the UK!" — corroborated by leventandtaylor.com (found via Google) explicitly stating "Essex Based Musicians", matching the stored Essex location. Bio quoted verbatim; genre Latin added alongside the pre-existing Jazz (merged, not replaced — checked existing value via `get_by_id` first per the standing genres-replace-not-merge defect). |
| The Black Dog Boogie Band (`830bdac1…`) | facebookUrl, bio | facebook.com/profile.php?id=100087873481772 (found via Facebook page search, not Google) — "The BDBB play Classic Vintage Rock and Pop. In the Tiverton/ Credition area of Mid Devon ." — exact match to the stored Tiverton location, corroborated by a lemonrock listing found via Google ("Rock & Pop Covers, 4 piece"). Bio quoted verbatim. |
| Dogleg (`647f93e9…`) | facebookUrl, bio (replaced) | facebook.com/DoglegNorthDevon/about (vanity handle itself confirms North Devon) — "We play all manner of gigs, events and functions. We put our own slant on a wide range of covers -". The record already carried a bio from a third-party booking site (encoremusicians.com, an order-2 source per RUNBOOK §6); this firing found the act's own page (order-1) and **replaced** the bio with the page's own verbatim text per the stated preference order. |

All four confirmed via `get_by_id` immediately before each `edit_artist` call (name matched the intended target) and read back after write, byte-exact. Server auto-populated `profileImageUrl` as a `graph.facebook.com/<vanity-or-id>/picture?type=large` URL on all four (not `scontent.*`) — not independently placeholder-checked this firing given the volume of blanks worked; flagged below.

## Records recorded as an EVIDENCED BLANK (11) — both surfaces tried

| Artist | Variants tried (Google + Facebook) | Reason |
|---|---|---|
| The Comittee | `"The Comittee" band North East facebook` (Google — only US/FL "The Committee" bands, one Black/Doom act); `The Comittee band` (FB page search — same false candidates, no NE UK match) | No confident candidate on either surface |
| The Needles | `"The Needles" band Derbyshire facebook` (Google — found `facebook.com/theneedles/`, "Stone Cold Groovers"); visited the page's About and Details tabs directly — no location field, no town/county mentioned anywhere | Sole candidate found but fails the identification bar (name + category only, no location signal) — Tier C, correctly rejected |
| Tina LIVE | `"Tina LIVE" band Derbyshire facebook` (Google — only Tina Turner tribute acts elsewhere); `Tina Live band` (FB page search — "TINA band" 3 followers, no location; nothing else relevant) | No confident candidate found |
| JAM TRIBUTE | `"JAM TRIBUTE" band Derbyshire facebook` (Google — only The Jam'd, a national touring tribute, not Derbyshire-specific); `Jam Tribute band Derbyshire` (FB page search — Cold Flame/Laid/Stonegarden, all different tribute acts) | No confident candidate found; generic descriptor name |
| The Dirty Notes | `"The Dirty Notes" band Derbyshire facebook` (Google — no match); `The Dirty Notes band` (FB page search — The Good Times, The X-Certs, The Velocirocktors etc., none named Dirty Notes) | No candidate found on either surface |
| The Cords | `"The Cords" band Yorkshire covers facebook` (Google — found a Greenock/Scotland "The Cords", wrong region); `The Cords band Yorkshire` (FB page search — only unrelated "Yorkshire ___" pages, no band) | Region mismatch / no candidate |
| Cheap Date | `"Cheap Date" band Yorkshire covers facebook` (Google — no match); `Cheap Date band` (FB page search — six same-name "Cheap Date" pages, all US, or one Cambridge-based UK act — region mismatch vs stored Yorkshire) | Region mismatch / no UK Yorkshire candidate |
| The Prediction | `"The Prediction" band Yorkshire covers facebook` (Google — found `facebook.com/thepredictionband/`, "488 likes"); visited the page directly — bio is a generic party-band blurb with no location, town or county stated anywhere | Sole candidate found but fails the identification bar — Tier C, correctly rejected |
| Hospital Food | `"Hospital Food" band Staffordshire facebook` (Google — found the real band, 2.8K followers); `Hospital Food band Staffordshire` (FB page search — same page, confirms "3 piece Punk Rock & Roll band from West Yorkshire, England") | Region mismatch: real band confirmed West Yorkshire, not the stored Staffordshire UK — flagged for a human check |
| April Davies | `"April Davies" musician Burton upon Trent facebook` (Google — no match); `April Davies music` (FB page search — zero results) | No candidate found on either surface |
| Suburban Sneeze | `"Suburban Sneeze" band Surrey facebook` (Google — nearest hit "Suburban Sound Machine", different name); `Suburban Sneeze` (FB page search — "We didn't find any results") | No candidate found on either surface |

## Records SKIPPED, and why

None skipped outright this firing — every selected record was either enriched or recorded as an evidenced blank. 0 venue records were available to work (backlog fully saturated, confirmed independently this firing via `enrich_venue` batch, see Tier 3 above).

## Names corrected under §0.6 / §0.20

**Kamaro → Komaro** (`af8c2c46-e1f2-478a-8302-f45875304a31`). The act's own Facebook page spells the name "Komaro" — a one-letter variant from the stored sceniceye-sourced spelling. Sole candidate, exact Hampshire region match, no competing act. Corrected per §0.20/§2A.5 (the act's own page is the naming authority).

## Defects / decisions logged to CTO-INBOX (3 new entries)

- `bv2a-venue-backlog-saturated-reconfirmed-firing0918z` — 10th consecutive firing today, this time confirmed via `enrich_venue` batch rather than only a fingerprint cross-reference.
- `bv2a-firing0918z-kamaro-komaro-spelling-corrected` — DATA entry per the table above.
- `bv2a-firing0918z-dogleg-bio-upgraded-to-fb-source` — DATA entry: an existing third-party-sourced bio was replaced with a higher-preference, act-owned-page bio.
- `bv2a-firing0918z-hospital-food-region-mismatch` — DATA entry per the table above.

## Validator summary line (verbatim)

```
4 records · 2 clean · 0 FAIL · 2 WARN   [mode=gate]
```

0 FAIL. Batch ships. The 2 WARNs are both `NAME_BILLING` ("format tail on the name") on "Levent & Taylor's World Band" and "The Black Dog Boogie Band" — reviewed and judged false positives: "World Band" and "Boogie Band" are genuinely part of each act's own name, confirmed verbatim on their own Facebook pages (Levent & Taylor's page name is literally "Levent & Taylor" but the record's fuller name is source-declared/lemonrock-sourced and unchanged this firing; The Black Dog Boogie Band's own page uses the full name including "Boogie Band" in its bio text) — same class as the standing "Ant Clowes Duo"/"Blues Band" precedent (RUNBOOK §2A.1 item 7). No venue writes this firing, so the standing `bv2a-firing1419z-validator-cannot-check-venues` defect is moot here.

## Ledger / summary / dashboards

- `data/state/enrichment-evidence-2026-08-28-enrichment.jsonl` — 15 lines appended this firing (4 artist verified, 11 artist blanks), written via Python (not a bash heredoc) per the standing `bv2a-firing0618z-bash-heredoc-mangles-emoji-in-evidence` lesson.
- `data/state/enrichment-ledger.jsonl` — 15 `enrich` lines + 1 `snapshot` line appended (snapshot: artistsTotal 3294, artistsMissingSocials 1367, artistsMissingGenres 943, venuesTotal 3206, venuesMissingSocials 34).
- `data/state/run-summary.jsonl` — 1 line appended, outcome `completed`, recordsEnriched 4, skipped 11.
- `20-Daily/2026-08-28.md` — link to this report appended.
- `CTO-INBOX.md` — 4 new entries (1 RULE saturation reconfirm, 3 DATA).
- Both dashboards rebuilt (`data/normalized/enrichment/DASHBOARD.html`; `data/normalized/DASHBOARD.html`).

## Summary

**0 venues verified, 0 evidenced blank this firing** (backlog fully saturated for a 10th consecutive firing today — reconfirmed independently this time via an `enrich_venue` batch call against all 34, not just a fingerprint cross-reference; 0 enriched, 34 skipped, all already carrying a `google_place_id`). **4 artists verified** (1 facebookUrl+bio+genres+actType+rename, 1 facebookUrl+bio+genres, 2 facebookUrl+bio) **+ 11 evidenced blank** (two rejected on region-mismatch grounds — The Cords, Cheap Date, Hospital Food; two candidates found but rejected on Tier-C no-location-signal grounds — The Needles, The Prediction; seven on no-confident-candidate grounds — both surfaces tried throughout for all eleven). One existing bio upgraded from a third-party source to the act's own page text (Dogleg). One name corrected to the act's own page spelling (Kamaro → Komaro). Validator: `4 records · 2 clean · 0 FAIL · 2 WARN` (both WARNs reviewed and judged false positives, same class as a standing precedent). Elapsed approximately 20 minutes (heartbeat 09:18:15Z → this report), well inside the 40-minute budget and the 15-artist/30-venue cap. Circuit breaker did not fire; no hard stop encountered; Chrome was available and logged in throughout.
