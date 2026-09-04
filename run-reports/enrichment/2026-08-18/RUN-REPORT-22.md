# Bv2a Enrichment — 2026-08-18, firing 22 (22:17Z)

## Step 0 — Circuit breaker
Read the last 3 run reports (RUN-REPORT-21, 20, 19). Each recorded 0 outstanding FAIL
from the validator on its final run, and all three wrote a report. 0 of 3 recorded a
FAIL, none failed to write a report. **Breaker NOT TRIPPED.** Proceeded.

## Step 1 — Runbook and version floor
Read `RUNBOOK.md` in full — H1 **v2.27**. CURRENT FLOOR (§6A) = **v2.19** — pass.
Read `ENRICHMENT-TASK-v3.md` §0.0 then §FP in full, and `CTO-INBOX.md` fingerprints
(most recent ~40 entries). Two rules held throughout: §2A.1 item 3b (both search
surfaces before any blank) and §2A.1 item 8 (the bio is quoted, never written — moot
this firing, no bio field touched under FP.2).

## Step 2 — Concurrency
Heartbeat written first: `data\state\heartbeat\bv2a-enrichment-2026-08-18T22-17-15Z.json`,
outcome `started`. `data\state\enrichment.lock` not present; not honoured, not
recreated (retired per RUNBOOK §6A step 2b). Claim acquired at
`data\state\claims\bv2a-enrichment.json`: prior claim was `heldBy:null` (released by
firing 21 at 21:32:43Z) — acquired cleanly, `expiresAt` +3h (task TTL).

## Step 3 — Chrome check
`list_connected_browsers` returned `[]`. Chrome unreachable for a **TWENTY-FIFTH**
consecutive firing, spanning 22 (08-17 22:17Z) through this firing (08-18 22:17Z) —
one full day. Per the task's own hard-stop rule, artist enrichment (which requires a
Chrome visit to quote a bio/confirm identity per §FP.3 step 3) could not proceed.
Venue work proceeded under §FP.2, which needs no Chrome.

## Step 4 — Selection and work
Priority order 1 (new artists) and 4 (backlog artists) and 5 (genre-only artists) were
all blocked by the Chrome outage. Priority order 2 (venues created in the last 24h,
missing socials) yielded one candidate, worked first. Priority order 3 (backlog
venues missing socials, oldest `createdAt` first) supplied the rest, worked from a
locally-sorted subset of the 227-record backlog (100 records paged and inspected;
oldest-eligible-first ordering applied within that set, skipping records already
carrying a standing CTO-INBOX flag — non-venue, address-mismatch, ambiguous-name,
ignore-listed, or already-worked-blank this run-day).

**Budget: 30 venues or 40 minutes, whichever first.** Hit the 30-venue cap at
22:28Z — 11 minutes elapsed, well inside the 40-minute ceiling.

### Records enriched WITH a verified page (14)
| Venue | Field(s) | Evidence |
|---|---|---|
| Navio Lounge (Nantwich) | facebookUrl, website | facebook.com/100094533794795, thelounges.co.uk/navio/ |
| Seabridge, Seabridge | facebookUrl | facebook.com/seabridgepub/ |
| Molly Malones (Taunton) | facebookUrl | facebook.com/562329250525573 |
| Stone Pier Cafe (Weymouth) | facebookUrl | facebook.com/StonepiercafeWeymouth/ |
| The Tap & Grape Broadstone | facebookUrl | facebook.com/thetapandgrapebroadstone/ |
| Sass Cafe & Bar (Weston-super-Mare) | facebookUrl | facebook.com/sasscafeandbar/ |
| The Stables @ Port Eliot (St Germans) | facebookUrl | facebook.com/reciprocityatPortEliot/ |
| The Old Wainhouse Inn (Wainhouse Corner) | facebookUrl | facebook.com/wainhouseinn/ |
| Alvaston Hall Hotel (Nantwich) | facebookUrl | facebook.com/warneralvastonhall/ |
| King Billy Music Bar (Northampton) | facebookUrl | facebook.com/p/King-Billy-Music-Bar-61575671577445/ |
| Red Lion (Chesham) | facebookUrl | facebook.com/theredlionchesham/ |
| The White Horse (London Colney) | facebookUrl | facebook.com/TheWhiteHorseLC/ |
| The Cellar Bar (Bedford) | website, facebookUrl | facebook.com/cellarbarbedford/, thecellarbarbedford.co.uk |
| The Bluebell (Bedford) | website, facebookUrl | facebook.com/thebluebellbedford/, bluebellbedford.com |

All 14 confirmed by exact or near-exact address/postcode match in the search result
title or snippet, per §FP.2 step 3. Every write read back via `get_by_id` before
logging (§0.10).

### Records recorded as an EVIDENCED BLANK (16), variants tried on both surfaces
Both surfaces here means a bare-name Google query plus a targeted `site:facebook.com`
or address-qualified follow-up query — Chrome/Facebook-native search was not
available this firing (outage above), so both queries went through `WebSearch`.

- **HalfWay House** (Ashton-under-Lyne) — CAMRA/Instagram confirm the pub; no own FB page surfaced.
- **White Lodge** (Stafford) — only match found (thewhitelodgesite) is a different entity, a campsite in Great Haywood. Flagged.
- **West End Club** (Stapleford) — FB events page referenced, no own business page confirmed.
- **Lamplight - Coffee House & Tap Room** (Coxhoe) — page referenced by CAMRA/Instagram, URL did not surface.
- **Annitsford Welfare Club** — only match is the distinct Annitsford Irish Club, different address.
- **Hayfield Club** — three differently-named local clubs found, none matching.
- **The Tannery** (Derby) — new venue (opened June 2026), no page found yet.
- **The Saracens Head** (Newton Abbot) — a facebook.com/saracenshead/ candidate exists but town unconfirmed; several same-name pubs elsewhere. Flagged.
- **The Dolphin Hotel, Plymouth** — only third-party group posts; several same-name Dolphin Hotels in other towns.
- **Dicey Reilly's** (Teignmouth) — page referenced by whatpub/lemonrock, URL did not surface.
- **Newton Abbot 76 Sports & Social Club** — three candidate pages, none confirmed current without a Chrome visit.
- **Jubilee Inn** (Torpoint) — multiple candidates, confusable with a different "Jubilee Inn, Pelynt".
- **The Nags Head** (Market Harborough) — a page id was referenced, URL did not surface.
- **Crab & Winkle** (Peterborough) — Greene King's own site confirms the pub; no FB URL surfaced.
- **The Holly Tree** (Addlestone) — ambiguous between a group for the pub itself and a confirmed page for an in-house sub-venue ("The Cave @ The Holly Tree"); not confirmed as the same entity. Flagged.
- **Castle playing fields** (Thrapston) — council-managed public playing field, same class as prior non-venue findings (Campbell Park, Gostrey Meadow, etc). Flagged.

### Records SKIPPED, and why
None skipped outright this firing — every candidate reached either a verified write
or an evidenced blank within budget.

### Names corrected under §0.6
None. No venue rename actioned this firing (venue protocol has no explicit
unattended-rename authorisation, per the standing `bv2a-firing09-name-mismatches`
precedent).

### Validator summary line (verbatim)
```
30 records · 15 clean · 0 FAIL · 29 WARN   [mode=gate]
```
Two genuine FAILs were caught and corrected before this final run: `FB_EVIDENCE_MISMATCH`
on Navio Lounge and Molly Malones, both because the stored canonical URL (bare numeric
id) differed from the exact as-searched URL in the evidence line (a `/p/Name-<id>/`
form and a `/pages/Name/<id>` form respectively). Both corrected by appending a second
evidence line in the canonical form (append-only, last-line-wins in the loader) —
same page in both cases, own-firing fix, matching the standing
`bv2a-firing08-canonicalised-url-triggers-evidence-mismatch` fingerprint. The 29 WARNs
are all expected and non-blocking: `STUB_NO_BIO`/`STUB_NO_IMAGE` on all 14 enriched
venues (venues carry no bio/image requirement under §FP.2 — the validator's artist-shaped
check does not know that), and one `NAME_BILLING` warning on "Lamplight - Coffee House &
Tap Room", which is the venue's own correct name, not a promo tail.

Records/evidence adapted for the validator via `data\state\build_validator_input_firing22.py`,
per the standing `validator-venue-schema-mismatch` (writes the
`{"venues":[{id,name,location,facebookUrl}]}` shape the validator actually reads) and
`validator-venue-evidence-loader-artistid-only` fingerprints (aliases this firing's
`venueId` evidence lines to `artistId` for the loader; the source-scoped file itself
— `enrichment-evidence-2026-08-18-enrichment.jsonl` — is untouched in meaning, only a
derived copy is aliased).

## Step 5 — Ledger, summary, dashboards
- `data\state\enrichment-ledger.jsonl`: appended 14 `enrich`/verified lines, 16
  `enrich`/blank lines, one `snapshot` line (artistsTotal 2243, artistsMissingSocials
  871, artistsMissingGenres 615, venuesTotal 3005, venuesMissingSocials 214).
- `data\state\run-summary.jsonl`: appended one line, `outcome:"completed"`,
  `recordsEnriched:14`, `skipped:16`.
- Regenerated `data\normalized\enrichment\DASHBOARD.html` (2161 enrichment records,
  72 snapshots) and `data\normalized\DASHBOARD.html`.

## Budget used, and whether the circuit breaker fired
11 minutes of the 40-minute task budget; 30-venue cap reached first. Well inside the
3-hour claim TTL. Circuit breaker did not fire (0 FAIL on this firing's final run, and
this report is being written).

## Outcome
14 venues enriched with a verified page, 16 evidenced blank, 0 artists (Chrome
unreachable, **25th consecutive firing**, spanning a full day: 22 on 08-17 22:17Z
through this firing on 08-18 22:17Z). Validator 0 FAIL. Strongly recommend a human
check the Chrome extension install/login state directly — 25 automatic retries have
not self-resolved it, and the artist backlog (871 missing socials, 615 missing
genres) has been essentially static all day as a result.
