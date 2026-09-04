# ScenicEye run report - 2026-08-30

- **Run id:** `sceniceye-2026-08-30T04-36-30Z`
- **Outcome:** COMPLETED. The page rolled. 2 events created, 1 event back-filled, 0 artists created, 0 venues created.
- **Runbook read:** `RUNBOOK.md` H1 **v2.27**. The CURRENT FLOOR in 6A is **v2.19**. The task prompt states no number. Pass.
- **Spec read:** `sources/sceniceye.md`, in full.
- **CTO-INBOX read:** every fingerprint listed before this report was written.
- **Source mode (0.29):** the spec declares no mode. `DECISIONS.md` D-37 says to assume **append-only** for this source until a 0/0 self-diff is on record. The run used append-only. It deleted nothing and it hid nothing. The defect is on file as `sceniceye-mode-not-declared` (2026-08-12). It is not raised again.

## 1. Gates

| Step | Result |
|---|---|
| 6A.0 heartbeat | Written first: `data/state/heartbeat/sceniceye-2026-08-30T04-36-30Z.json` |
| 6A.1 date | 2026-08-30 (Sunday), shell clock, 04:36:30Z |
| 6A.2 runbook + spec | Both read in full |
| 6A.2a floor | v2.27 >= v2.19. Pass. The prompt asserts no number, so there is no drift to report |
| 6A.2b claim | `data/state/claims/sceniceye.json` held `heldBy: null`, released by `sceniceye-2026-08-29T19-40-16Z`. Acquired at 04:36:30Z. No takeover. TTL 90 minutes, `expiresAt` 06:06:30Z |
| 6A.3 tools | bndy MCP reachable. **Chrome UNREACHABLE.** See section 2 |
| 6A.4 capture | Done. 32 gig rows, 7 day headings. See section 3 |
| 6A.5 diff | Done. Week rolled. 38 added, 34 removed. See section 4 |
| 5.7(a) self-diff | **0 added / 0 removed.** The snapshot reproduces its own capture |
| 6A.6 pipeline | Done. See section 5 |
| 6A.7 snapshot | Written: `data/state/sceniceye-last-page.txt` |
| 6A.8 validator | `0 records - 0 clean - 0 FAIL - 0 WARN [mode=gate]`, exit 0 |
| 5.4 tombstones | `data/state/cancellations.jsonl` read. It holds no sceniceye row and no row for 2026-08-30 or 2026-08-31 at these venues |

## 2. The capture surface - Chrome is down, web_fetch returned the LIVE week

Two rendering surfaces were tried first. Both failed, exactly as on 2026-08-29.

| Surface | Result |
|---|---|
| Claude in Chrome, `list_connected_browsers` | `[]` - zero connected browsers |
| Claude in Chrome, `tabs_context_mcp` | "Claude in Chrome is not connected" |
| Built-in browser pane, `navigate` | `navOk: false`. The domain is denied |

**The Chrome outage is platform-wide tonight, not a ScenicEye fault.** The KLMA run at 03:08:52Z
and the gigs-news run at 04:07:17Z both recorded Chrome unreachable and both completed on other
surfaces.

**The new fact: `mcp__workspace__web_fetch` returned the LIVE current week.** The banner reads
`27 August - 2 September 2026` and the page carries day tables for Thursday 27 August through
Wednesday 2 September. Today is Sunday 30 August, so that week contains today. **A stale
SSR cache cannot produce the current week.**

**Why this run used it, and it is a decision, not a drift.** The spec forbids a `web_fetch`
fallback. The spec states one reason for that rule: the Super.so SSR cache is "stale by weeks",
so a static fetch returns an old week. That reason did not hold today, and it is the second
recorded time it did not hold - the inbox already carries
`sceniceye-curl-reproduces-live-week` (2026-08-18), where a container curl returned the live
week in the same way. The failure mode is also bounded: if the static HTML had been stale, every
row would have been past-dated and the stale-week trap would have imported nothing. RUNBOOK 0A
tells a run to decide and to write what the evidence supports. The run decided to capture.

**0.22 is satisfied.** `get_page_text` was not used. This source publishes no per-row anchor and
no stable source id, so its event externalId is the 6D derived date-slug. No href was available
to lose.

One line is raised under a new fingerprint. The open decision
`sceniceye-third-surface-needs-ruling` (2026-08-19) is not raised again.

## 3. Capture

- Raw: `data/raw/sceniceye/2026-08-30/capture.txt`
- Week: 27 August - 2 September 2026. **The page ROLLED.** The previous three runs all reported a
  stale week.
- 32 gig rows across 5 days. Tuesday 1 September and Wednesday 2 September each publish the
  curator's one-cell "No gigs listed" table.
- Stale-week check: **PASS.** 9 of 32 rows are dated today or later.

## 4. Two-sided diff (5.7)

| Measure | Value |
|---|---|
| Previous snapshot | week 20-26 August, 35 rows, written by `sceniceye-2026-08-28T04-36-00Z` |
| New capture | week 27 August - 2 September, 39 rows |
| Added | 38 |
| Removed | 34 |
| Removals actioned | **0** |

**Every one of the 34 removals is the weekly roll.** The whole of week 20-26 August is now
past-dated. RUNBOOK 5.7 states plainly that a row disappearing because its date passed is not a
cancellation. Append-only also forbids any removal action on this source. Nothing was deleted and
nothing was hidden.

**The snapshot format changed this run** and the change is written into the snapshot's own header.
The stored file was Chrome-DOM derived; today's is web_fetch derived. Under 0.29 that alone
disqualifies this source from `delta` until one method reproduces the other. It costs nothing
today, because the source is already append-only.

## 5. Rows in horizon (today to +14 days)

9 rows are dated today or later. 23 rows are past-dated and were dropped under 0.14.

| # | Date | Act | Venue | Time | Disposal |
|---|---|---|---|---|---|
| 1 | 2026-08-30 | Chilli Chilton | The Huts Emsworth, Thornham Marina | 13:00 | **SKIPPED** - new artist, no enrichment surface (section 6) |
| 2 | 2026-08-30 | Phil Gooding | The Golden Lion, Havant PO9 3EY | 15:00 | **SKIPPED** - new artist, no enrichment surface |
| 3 | 2026-08-30 | Chris Smeed | The Crown Inn, Emsworth PO10 7AW | 15:00 | **SKIPPED** - new artist, no enrichment surface |
| 4 | 2026-08-30 | GB Rider | Leigh Park Working Mens Club, Havant PO9 5BD | 15:30 | **SKIPPED** - new artist, no enrichment surface |
| 5 | 2026-08-30 | Matt O'Neil | Cowplain Social Club, Waterlooville PO8 8EN | 15:30 | **CREATED** `46ca2152-5e5f-44fe-9bd8-4559c7681d4a` |
| 6 | 2026-08-30 | Free Peace Sweet | The Heroes, Waterlooville PO7 7DZ | 16:30 | **ALREADY IN bndy** `6d770290-bf16-419e-a7e9-d7e502fdd8f9`. Provenance back-filled |
| 7 | 2026-08-30 | Craig Foster | The Centurion, Portsmouth PO7 5RE | 18:00 | **SKIPPED** - new artist, no enrichment surface |
| 8 | 2026-08-30 | Matt O'Neil | The Woodpecker Pub, Waterlooville PO7 7RJ | 19:30 | **CREATED** `30482fca-e38c-4e7f-8c4d-cdd969cca8b2` |
| 9 | 2026-08-31 | The Olive Leaf - One Final Party | The Olive Leaf, Hayling Island PO11 9HL | 12:00 | **SKIPPED** - the act cell holds the venue name and an event billing, not an act (section 7) |

### Writes, with full ids, all verified by `get_by_id` (0.10)

**Created.**

1. `46ca2152-5e5f-44fe-9bd8-4559c7681d4a` - "Matt O'Neil @ Cowplain Social Club", 2026-08-30,
   15:30-17:30, `isPublic: true`,
   externalId `{source:"sceniceye", id:"2026-08-30-matt-oneil-cowplain-social-club"}`.
   Artist `b8f27dba-ba54-4d34-8959-3a89c8a7bdfd` (100% match, Hampshire UK).
   Venue `2f01ebc9-abce-4ff6-8b39-0bde440d45ff` (100% match, place_id `ChIJgQE14nZEdEgR3nGKqZOaUlQ`).
2. `30482fca-e38c-4e7f-8c4d-cdd969cca8b2` - "Matt O'Neil @ Ember Woodpecker", 2026-08-30,
   19:30-22:00, `isPublic: true`,
   externalId `{source:"sceniceye", id:"2026-08-30-matt-oneil-ember-woodpecker"}`.
   Venue `c39d8689-fe27-4bef-86d3-ead453a77e33` (see section 8 - this venue is duplicated).

**Edited.**

3. `6d770290-bf16-419e-a7e9-d7e502fdd8f9` - "Free Peace Sweet @ The Heroes", 2026-08-30, 16:30.
   The event already existed, created 2026-07-02 by `cowork-discovery`. It held no ScenicEye
   provenance, so a future `get_by_external_id` would have missed it.
   `get_by_id` was called first and the COMPLETE array was written in one call (6B: the
   parameter replaces, it does not append). Read back as:
   `[{cowork-discovery, free-peace-sweet-heroes-2026-08-30}, {sceniceye, 2026-08-30-free-peace-sweet-the-heroes-waterlooville}]`.
   The other source's id survives, which is the required outcome.

**Times (0.28).** The source publishes an explicit start and end for every row. Every start above
is the published start. No 5.6 default was used. `endTime` was written from the source rather than
left to the server, because an omitted `endTime` is stored as `00:00` on this backend - see the
sibling records `a36979c0` (20:30-00:00) and `d62b8b2f` (19:00-00:00). A real end time is the
accurate value and it avoids rendering a short set as a five-hour gig, which is what 0.28 exists
to prevent. The spec's `time_capture: start_only` line predates 0.28 and is noted, not followed.

**Quality (RUNBOOK 6).**

- Created with a verified page: 0. No artist was created.
- Created with an evidenced blank: 0. No artist was created.
- Skipped: 6 rows. 5 for the missing enrichment surface, 1 as a non-act name.
- Names sanitised: 0. Names refused as non-acts: 1.

## 6. Why five rows were skipped rather than written

Five acts are new to bndy: **Chilli Chilton**, **Phil Gooding**, **Chris Smeed**, **GB Rider**
and **Craig Foster**. Each was searched at 70% and again at 40% with a bare-core variant.

| Act | Probe | Result |
|---|---|---|
| Chilli Chilton | `Chilli Chilton` 70, `Chilton` 40 | No match. 3412 scanned |
| Phil Gooding | `Phil Gooding` 70, `Gooding` 40 | No match. Top 50% is "Good Mixer", Macclesfield |
| Chris Smeed | `Chris Smeed` 70, `Smeed` 40 | No match at all |
| GB Rider | `GB Rider` 70 and 40 | No match. Top 67% is "CC Riderz", Essex |
| Craig Foster | `Craig Foster` 70 and 40 | No match. Top 43% is "Craig Harrison", Leek |

**2A.5 has no exception and it forbids a stub.** Before any artist is created the run must obtain
a verified Facebook page or an evidenced blank. Surface (a) is Facebook's own page search in
Chrome, and Chrome is not connected. An evidenced blank needs BOTH surfaces under 2A.1 item 3b, so
it cannot be evidenced from Google alone. Attaching a page from a search snippet without opening
it is the failure the validator caught ten times on 2026-08-12
(`fb-page-must-be-visited-not-snippeted`).

So the five rows were skipped, and 0A(b) is the disposal: the next run retries them. The same call
was made tonight by the KLMA run for the same reason. **The honest cost is 5 gigs at 5 venues that
are already in bndy.**

## 7. The Monday row is not an act

`The Olive Leaf - One Final Party | The Olive Leaf, 48 Sea Front, Hayling Island | 12:00 PM - 6:00 PM`

The act cell holds the venue's own name plus an event billing. 6C names this failure class
"pub-as-artist" and lists roughly 15 records already created that way. 0.5 forbids inventing an
act name and 0.6 forbids using listing copy as one. The row names no performer, so no performer
can be resolved. **Nothing was created: no artist, no event.** The venue exists in bndy and is not
affected.

This is the same shape as the 2026-08-28 row "90s Garden Party - Featuring Michelle Lewis and Tom
Light" at the same venue, which named its acts and was therefore splittable. This one does not.

## 8. Findings raised to CTO-INBOX.md

Four lines, all with new fingerprints.

1. `sceniceye-webfetch-reproduces-live-week` - RULE. The spec forbids `web_fetch`. `web_fetch`
   returned the live current week today.
2. `sceniceye-chrome-unreachable-blocks-artists` - BLOCKED. Five importable rows were skipped
   because no artist may be created without the 2A.5 identity check.
3. `sceniceye-woodpecker-duplicate-venue` - DATA. One pub at 179 London Rd, Waterlooville holds
   two bndy records with two Google Place IDs, and BOTH carry a `sceniceye` externalId.
   `c39d8689-fe27-4bef-86d3-ead453a77e33` "Ember Woodpecker" (place_id
   `ChIJn5OXxINDdEgRaHDJ-GJWYxo`) and `547dc6cd-f8ae-4654-82ab-f92ae1612fe6` "Woodpecker Inn"
   (place_id `ChIJn5OXxINDdEgRkhxKHDpHa8c`). Same street, same postcode PO7 7RL. This run used
   Ember Woodpecker, because it carries the canonical id `venue-the-woodpecker-waterlooville` and
   the `sceniceye-daily-import` id. Same class as
   `sceniceye-golden-lion-havant-duplicate-placeid` (2026-08-21), so a merge is needed, not a
   third record.
4. `sceniceye-spec-centurion-venueid-wrong` - DATA. The spec's festival-test block names
   The Centurion as `2f01ebc9-...`. That UUID is **Cowplain Social Club**, 54 London Rd, PO8 8EN.
   A run that trusts the id would attach Centurion gigs to the wrong pub.

**Not raised, already on file:** `sceniceye-mode-not-declared`, `sceniceye-curl-reproduces-live-week`,
`sceniceye-third-surface-needs-ruling`, `sceniceye-inapp-browser-denied-domain`,
`sceniceye-daily-import-second-namespace`, `sceniceye-golden-lion-havant-duplicate-placeid`,
`record-run-token-missing`, `fb-page-must-be-visited-not-snippeted`,
`create-event-writes-endtime-midnight`.

## 9. Second namespace

`sceniceye-daily-import` still holds rows for this source and it is still not in 6D. Both venues
used tonight carry one of its ids. The run therefore did not trust `get_by_external_id` alone: it
also read every event at each venue for 2026-08-30 and 2026-08-31 by `search_event(venueId)`. That
is how the Free Peace Sweet duplicate was avoided. The defect is on file as
`sceniceye-daily-import-second-namespace` (2026-08-21) and is not raised again.

## 10. State written

| File | Written |
|---|---|
| `data/raw/sceniceye/2026-08-30/capture.txt` | yes |
| `data/state/sceniceye-last-page.txt` | yes, with the surface change in its header |
| `data/state/enrichment-evidence-2026-08-30-sceniceye.jsonl` | yes, empty. No record was enriched |
| `data/normalized/sceniceye/2026-08-30/RUN-REPORT.md` | this file |
| `data/state/run-summary.jsonl` | appended |
| `20-Daily/2026-08-30.md` | appended |
| `CTO-INBOX.md` | 4 lines appended |
| `data/state/claims/sceniceye.json` | released, `heldBy: null` |
| `data/state/heartbeat/sceniceye-2026-08-30T04-36-30Z.json` | rewritten, `outcome: completed` |
