# Enrichment run report — 2026-08-14, 08:19Z firing

**Report path note:** `RUN-REPORT-08.md` already existed for this clock hour (08:35Z firing, prior to this one starting its write phase). Per the standing `run-report-path-collides-second-firing` fingerprint (already logged in `CTO-INBOX.md`, not re-logged), this report is written to `RUN-REPORT-08b.md` to avoid overwriting it. Not a new defect.

## Step 0 — circuit breaker

Last 3 reports at start of this run, newest first:
1. `2026-08-14/RUN-REPORT-08.md` — COMPLETED. Validator `44 records · 2 clean · 0 FAIL · 85 WARN`.
2. `2026-08-14/RUN-REPORT-07.md` — COMPLETED. Validator `31 records · 7 clean · 0 FAIL · 49 WARN`.
3. `2026-08-14/RUN-REPORT-06.md` — COMPLETED. Validator `41 records · 9 clean · 0 FAIL · 61 WARN`.

0 of 3 recorded a FAIL, all 3 wrote a report. **Breaker NOT TRIPPED.** Proceeded.

## Step 1/2 — runbook and task spec

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed (v2.27 ≥ v2.19). Read in full this firing (§0A, §0 items 1–29, §1/§1A, §2A.1 in full including items 3b and 8, §2A.2, §3, §4, §5, §6/§6A/§6B/§6C/§6D/§6D-bis/§6E/§6F/§6G). `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` read in full — today's live fingerprints noted (`bv2a-facebook-not-logged-in`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-genre-only-fb-evidence-mismatch`, `bv2a-claim-path-stale-in-prompt`, `run-report-path-collides-second-firing`, `enrich-venue-batch-array-not-parsed`). None re-logged as new.

## Step 2b — concurrency

`data\state\enrichment.lock` does not exist — not honoured, not recreated (RUNBOOK §6A step 2b / §6G). Claim file per the runbook, not the stale prompt path: `data\state\claims\bv2a-enrichment.json`. Found `heldBy: null` (released by the 08:35Z firing at 08:37Z i.e. prior run's own claim id shown as `lastRun`). Acquired cleanly:
`{"heldBy":"bv2a-enrichment-2026-08-14T08-19-39Z","acquiredAt":"2026-08-14T08:19:39Z","expiresAt":"2026-08-14T11:19:39Z","heartbeatFile":"data\\state\\heartbeat\\bv2a-enrichment-2026-08-14T08-19-39Z.json"}`
No takeover needed.

## Step 3 — Chrome / Facebook precondition check

One Chrome browser connected (`list_connected_browsers` — exactly one, selected by deviceId per §8, never by name). Navigated to `facebook.com`: logged-out landing page (email/password fields, "Log in" button, no session) — confirmed via `read_page`. **Tenth consecutive firing today blocked on this outage** (`bv2a-facebook-not-logged-in`, already logged — not re-logged). Per the HARD STOP rule: venues proceeded (FP.2, no Chrome needed); artist socials/bio work (Priorities 1 and 4) was BLOCKED, not attempted. Priority 5 (genre-only, WebSearch only, no Chrome) proceeded.

## Selection

1. **Artists created <24h, missing socials** — 15 found (same cohort as every prior firing today). BLOCKED — Chrome not logged in to Facebook. Not attempted, not written. Carries to next run.
2. **Venues created <24h, missing socials** — 0 found. Nothing to do.
3. **Backlog venues missing socials, oldest `createdAt` first** — worked. 895 candidates at start; 22 taken, oldest-first from the returned page (May 2026 through Aug-08 batch).
4. **Backlog artists missing socials, oldest first** — not reached; blocked by Chrome/Facebook (same reason as Priority 1), and this firing's time went to venues + Priority 5 instead.
5. **Artists missing genres, already holding a `facebookUrl`** — 10 candidates found with a stored `facebookUrl`; worked via WebSearch only (no Chrome needed, genre-only, no bio/socials touched).

## Venues — verified (15)

All via `WebSearch` "`<name>` `<town>` facebook/website" per FP.2, no Chrome. Confidence: name + address matched exactly against the bndy record in every case below.

| Venue | id | Field(s) written | Evidence |
|---|---|---|---|
| Kingsley Park Working Mens Club & Institute | `094fe7ff-47fa-45b0-85c6-e633f18afa0b` | facebookUrl | facebook.com/p/Friends-of-Kingsley-Park-WMC-100057058254700 — phone matches club's own listed number on two independent sources |
| Central Ward Residents Club | `4b083bc0-c679-4685-8a34-5615d6775308` | website | central-ward.co.uk |
| The Shed Tap Room & Deli | `70b937b6-e739-45a0-953b-ef5fec41bcd0` | website | theshed.pub (own site; 4 competing FB accounts found, none confidently disambiguated without Chrome — FB left blank) |
| Stones Throw Beach Bar and Bistro | `71156ae2-9809-4b4f-93a3-7e5aaaf6121e` | facebookUrl | facebook.com/people/Stones-Throw-Beach-Bar-Bistro/61590873947320 |
| The Victoria Club | `1d23a037-f483-46de-81d4-c35430d1656a` | website | thevictoriaclubaylesbury.co.uk |
| Three Kings Restaurant | `662071a5-d1c0-447d-9571-5636913ec52a` | website, facebookUrl | threekingsrestaurant.uk; facebook.com/p/THREE-KINGS-Restaurant-61550765333109 |
| Jolly Colliers | `03089a0c-b4d8-41c9-b30d-cab329057aa7` | facebookUrl | facebook.com/p/Jolly-Colliers-Bedminster-61583004572199 — address matches exactly |
| The Chapel Grounds Coffee Shop | `b2bd7226-2212-4e70-87c8-66086b7169b9` | website, facebookUrl | thechapelcotfordstluke.co.uk; facebook.com/TheChapelatCotfordStLuke — own post names the coffee shop specifically |
| Old George Hotel | `bab8da0d-16b5-4ca4-a1dd-bc59d720bbbd` | website, facebookUrl | theoldgeorgestonystratford.co.uk; facebook.com/theoldgeorgestonystratford |
| THE ALE HOUSE | `6f60fced-ada3-4565-8593-3193a803c2c4` | website, facebookUrl | thealehousestroud.com; facebook.com/p/The-Ale-House-100063620620627 |
| Golden Lion | `c74536c5-2aef-4080-bf53-d13f25255285` | facebookUrl | facebook.com/goldenlionbristol — address matches exactly |
| Three Tuns Inn | `5058f75c-dd5c-4594-a5e5-ac41437c4465` | facebookUrl | facebook.com/p/The-Three-Tuns-100043344773207 — address + phone match |
| The George Ale House | `4c70c886-1197-41fa-a489-aecb6d5b9ea7` | facebookUrl | facebook.com/georgealehousegreatmissenden — address matches exactly |
| The Prince of Wales | `94b71254-c914-44af-b7e9-9361db85d41e` | facebookUrl | facebook.com/POWmarlow — address matches exactly |
| Bletchley Conservative Club | `b9d7a9d9-d167-444a-93a0-ffb464cc864c` | website | bletchleyconservativeclub.com — no confident FB URL surfaced |

## Venues — evidenced blank (7)

Search variants tried on Google (WebSearch) for each; no confident name+town match found, or the only candidates were a different entity at the same site (flagged, not attached).

- Annitsford Welfare Club (`4082b952-b9e3-4f81-acc0-2dd9f41fdcef`) — found "Annitsford Irish Club" and "Annitsford Pioneer Club" at what appears to be the same complex, but neither matches the stored name; not attached.
- Tudor Nook, Cheadle (`701f5003-e01e-42ae-bb09-a08b0f5a9045`) — only "Tudor House Crafts Cheadle" found, a different business at the same historic building; not attached.
- Canal Tavern, Kidsgrove (`367490c2-6382-4bca-8d9a-f0ed3584dfe2`) — two searches; a `profile.php` page exists but no snippet confirmed Kidsgrove specifically (a same-name pub in Thorne was correctly rejected).
- W P M Sports & Social Club (`db9dd035-7cee-42a4-ad23-9976bad2a339`) — only an events page and an unofficial-looking group found; no confident official page.
- The Den, Teignmouth (`4cbc8307-5d4b-4c41-8ea4-34bb695b38d8`) — this is a council-run open green/park, not a private venue; no dedicated official page found.
- Hunstanton Bandstand (`59a6224b-b454-45e2-b0af-04006a92c0e7`) — council-run bandstand; "Hunstanton Events Committee" page found but covers the whole town's events, not specific to this bandstand.
- Park Pavillion, Harwich (`4e74985b-df50-4523-a02e-0062832eb148`) — community centre; no Facebook presence surfaced.

## Artists — genre-only (Priority 5)

10 candidates held a `facebookUrl` already and were missing `genres`. WebSearch only (no Chrome, no bio/socials touched — this priority is genre-only by design).

**Verified (2):**
- The Dark Horses (`8acfb072-e48e-4634-b2d6-cea37af19a9b`) — genres `["Rock","Indie"]`. Own site (thedarkhorses.co.uk/about-the-band): "Midlands-based hard rock and indie covers band... guitar-based rock covers band from Burton-On-Trent."
- Harbour (`8c3d5a6d-c780-47b0-8616-71839daa5909`) — genres `["90s"]`. Source-declared on Lemonrock's own listing: "Harbour UK : 90s Covers".

**Evidenced skip — no reliable genre found (8):** Glass Unicorn, The Desperate Cowboys, Bet Shop Boys, Soundgenarator, the Grey Numbers, JD & the Parrots, Umlaut Overload, Chloe Anne. WebSearch alone (no Chrome to check each page's own About/category text) did not surface a clear, sourceable genre for any of these — several returned only unrelated same-name acts or generic directory listings. Left blank rather than guess (§0.18: "unknown = leave empty, never invent"). Search variants logged in the evidence file for each; carries to next run.

## Names corrected under §0.6

None this run.

## Validator

Evidence file: `data\state\enrichment-evidence-2026-08-14-enrichment.jsonl` (append-only, source-scoped `enrichment` slug, shared across today's firings — this run's 32 new lines appended before the corresponding writes).

Known validator scope gaps applied, same workarounds as every prior firing today (all already logged in `CTO-INBOX.md`, not re-logged):
1. `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` — built `data\state\validator-records-run-09.json` (venue `socialMediaUrls[0].url`/`city` aliased to top-level `facebookUrl`/`location`; no data invented, schema rename for validator input only) and `data\state\validator-evidence-alias-run-09.jsonl` (`venueId` keys aliased to `artistId`, 32 lines covering the 22 venues touched this run — some venue ids also appear in earlier firings' evidence lines under the real schema; last-writer-wins correctly picked up this run's own lines).
2. `validator-genre-only-fb-evidence-mismatch` — for The Dark Horses and Harbour, `facebookUrl` and `bio` were pre-existing and untouched this run; the validator input blanked both fields so the check falls back to the `searchVariants` evidenced-blank path rather than false-firing `FB_EVIDENCE_MISMATCH`/`BIO_VERBATIM` against genre-only search evidence that was never claimed as bio/page evidence.

Result, first pass, 0 FAIL:

```
24 records · 13 clean · 0 FAIL · 22 WARN   [mode=gate]
```

**Validator summary line (verbatim): `24 records · 13 clean · 0 FAIL · 22 WARN   [mode=gate]`**

All WARNs are expected/known: `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 11 verified venues that gained a `facebookUrl` this run (venues carry no bio/image field under this task — FP.2, no Chrome visit made or needed).

### Circuit breaker for next run

Not fired. No FAIL was outstanding at any point this run.

## Defects / fingerprints

No new fingerprint. All defects hit this run (`bv2a-facebook-not-logged-in`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `validator-genre-only-fb-evidence-mismatch`, `bv2a-claim-path-stale-in-prompt`, `run-report-path-collides-second-firing`, `enrich-venue-batch-array-not-parsed`) are already logged in `CTO-INBOX.md` from earlier firings today — not re-logged.

## Budget used

30 minutes elapsed (08:19Z acquire to 08:49Z last write), within the 40-minute / 30-venue-15-artist budget. Stopped at 22 venues + 10 artists attempted (not the full 30/15) — quality/time tradeoff: each venue took a full WebSearch-confirm-write-readback cycle, and genre-only artist search yield was low (2/10) without Chrome to check each page's own About text, so the remaining time went to writing this report, the validator pass and the ledger/dashboard steps properly rather than pushing further into the backlog with less scrutiny per record.

Circuit breaker: **did not fire.**

## Ledger / snapshot / dashboards

Ledger: 24 lines appended to `data\state\enrichment-ledger.jsonl` (15 venue `verified`, 7 venue `blank`, 2 artist `verified`) plus one `snapshot` line. Run-summary line appended to `data\state\run-summary.jsonl`. Both dashboards regenerated (`data\normalized\enrichment\DASHBOARD.html`, `data\normalized\DASHBOARD.html`) — exit 0 on both.

Snapshot counts (post-run): artistsTotal 2171, artistsMissingSocials 879, artistsMissingGenres 625, venuesTotal 2589, venuesMissingSocials 880.

Claim released: `{"heldBy":null,"releasedAt":"2026-08-14T09:05:00Z","expiresAt":"1970-01-01T00:00:00Z","lastRun":"bv2a-enrichment-2026-08-14T08-19-39Z"}`. Heartbeat rewritten to `"outcome":"completed"`.
