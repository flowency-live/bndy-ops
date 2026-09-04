# KLMA Stoke gig list — RUN REPORT 2026-08-18

- **Run id:** `klma-stoke-gig-list-2026-08-18T03-08-53Z`
- **Outcome:** PARTIAL. The capture succeeded and the writes are correct. No artist could be created.
- **Runbook read:** `RUNBOOK.md` H1 **v2.27**. §6A CURRENT FLOOR **v2.19**. Assertion PASSES.
- **Prompt floor:** the task prompt names no number. It defers to §6A. No drift to report.
- **Spec read:** `sources/klma-stoke-gig-list.md` in full, including §VA and §VA.9.
- **Claim:** `data/state/claims/klma-stoke-gig-list.json` was `heldBy: null`. Acquired normally.
  No takeover. TTL 2 hours per §6G.
- **Tombstones:** `data/state/cancellations.jsonl` holds 2 lines. Neither matches any artist,
  venue or date in this run.

---

## 1. THE BLOCKER — Chrome was unreachable for the whole run

`tabs_context_mcp` returned "not connected". `list_connected_browsers` returned `[]`.
Two attempts, 30 seconds apart. This is not transient.

This is the **sixth consecutive firing across three different tasks**. The enrichment task
raised it at 22:17Z, 23:17Z, 00:20Z, 01:18Z and 02:18Z. The spider raised it at 01:52Z.
See `bv2a-chrome-unreachable-five-consecutive-firings` and
`spider-chrome-unreachable-blocks-new-artists` in `CTO-INBOX.md`.

**What it costs this source.** RUNBOOK §2A.1 item 5 and §2A.5(b) both state that a run which
cannot perform the identity check on a name STAGES the artist and does not create it. §0A
replaces "stage" with "skip and retry next run". So **no new artist was created this run**,
and every added row whose act is not already in bndy was skipped. That is 12 of 19 rows.

**What it did NOT cost.** Capture, diffing, venue resolution, event creation against an
existing artist and event edits all need no Chrome. All of those ran normally.

## 2. Capture — the surface changed, and the change is evidenced

| Feed | Spec surface | Used this run | Result |
|---|---|---|---|
| Section 1, KLMA sheet | Chrome on `gviz/tq?tqx=out:html` | **container `curl`** on the same URL | HTTP 200, 147,657 bytes, 425 DOM rows |
| Section 2, Sugarmill | `javascript_tool` DOM read | **`web_fetch`** | 30 distinct gigs, all hrefs intact |
| Cosey Club | its own page | **`web_fetch`** | 19 rows, first response only |
| Eleven, The Rigger, Artisan Tap | their own pages | container `curl` | **HTTP 000 — egress blocked** |

**Why a container curl is not the thing the spec forbids.** The spec bans `web_fetch` on the
gviz endpoint because that tool served an eight-week-old cache on 2026-08-06. A container
curl is a different mechanism with no such cache. The capture proves it: it contains a
submission timestamped **`18/08/2026 00:13:07`**, three hours before this run. No copy cached
from the 2026-08-15 run can contain that row. The layout check also passes independently —
14 columns, header cells at the post-2026-08-06 indices, no off-by-one.

**Why `web_fetch` is safe for the Sugarmill.** §VA.9 forbids `get_page_text` under RUNBOOK
§0.22, because text extraction discards the `a[href]` that carries the gig-guide slug and the
ticket link. `web_fetch` **preserves hrefs**. Every slug and every gigantic.com link recorded
below came out of an href. The §0.22 hazard does not apply to this tool.

Raw capture: `data/raw/klma-stoke-gig-list/2026-08-18/`.

## 3. Diff (§5.7, §5.7(a))

Both sides were normalised with the seven rules written into the snapshot header before any
comparison.

**Section 1 — KLMA sheet.** 19 added / 29 removed / 405 of 434 rows unchanged.

**All 29 removed rows are dated 14, 15 or 16 August. Today is 18 August. Every one of them is
past-dropped.** There is not one future-dated removal, so no deletion question arises at all
this run. The 2026-08-15 whitespace-drift class of near-miss did not recur.

**Section 2 — Sugarmill.** 0 genuinely new gigs.
- 1 removed: `motown-day-party-saturday-15th-august-2026` (2026-08-15). Past-dropped.
- 5 rows moved out of the previous snapshot's "undated slugs" block and now carry a title
  heading: `bootleg-blondie`, `the-bon-jovi-experience`, `fleetwood-shack`, `vampire-ball-2026`,
  `scene-emo-metalcore-dubstep-brutal-clubnight`. All five were resolved by the 2026-08-12 run —
  three imported, two rejected as club nights. **They are not new gigs and were not re-litigated.**
- 1 billing changed — see §7.

**Mode.** The spec declares no RUNBOOK §0.29 mode. The run is **append-only**. Already raised
as `klma-no-delta-mode-declared` on 2026-08-12; not re-raised.

**§5.7(a) SELF-DIFF GATE.** The written snapshot was re-diffed against the capture it was
written from:

```
SECTION1: snapshot 424 rows, capture 424 rows, added 0, removed 0
SECTION2: snapshot  30 rows, capture  30 rows, added 0, removed 0
```

**0 added / 0 removed on both sections. PASS.**

## 4. Work order (spec's CTO ruling 2026-08-08)

Added rows were grouped by artist and the largest groups taken first: WILKO (4 rows), Whiskey
Rebel (3), then the singles. **Both of the largest groups turned out to need a new artist and
were therefore blocked, not deferred on budget.** Budget was not the limiting factor this run —
the Chrome outage was. No row was left unworked for want of time.

## 5. Records written — 4 created, 2 edited, all verified by `get_by_id` (§0.10)

### Created

| Event id | Title | Date | Time | Venue | Artist |
|---|---|---|---|---|---|
| `3190e6d5-273e-4116-b7c3-fc2a6b4f5b29` | Tanky/Electrifying 80's show @ Cosey Club | 2026-08-22 | 21:00 **defaulted** | `LHrDNnXeCU1eirDOxUKc` | `a603777d-25f1-4f4c-9d13-866a4a0fe49c` |
| `756dd80d-1915-42b3-ae6f-a547b7d3ef78` | Southbound @ Prince Of Wales | 2026-08-22 | 21:00 **defaulted** | `Xiaxlq2K0keBgk6TU4E5` | `T3vyQPs3qY3XvWInPKhX` |
| `ecd25941-a3b5-45a1-bdeb-2539065fc10a` | So Oasis @ Gardeners Retreat | 2026-08-29 | 21:00 **defaulted** | `h7vjRstHEFx5wsfCU8ez` | `80bd40ed-a17b-48cf-b57c-74a627867e48` |
| `1f036b37-3562-479e-a442-ea6f4339fd47` | Under The Influence @ Green Star | 2026-12-31 | 20:00 **defaulted** | `PrUInpF22PJIskerI2Ic` | `a643f428-9c09-4ab7-88a0-f616880a34c0` |

All four are `isPublic: true`. All four carry a §6D slug externalId under `klma-stoke-gig-list`.
**All four start times were defaulted by the server (§5.6) — the sheet published no time for any
of them.** The server returned `startTimeDefaulted: true` in each case.

### Edited — the row already existed in bndy

| Event id | What the row added | Fields written |
|---|---|---|
| `f4b4773d-f940-45a9-838f-3ff8190f7738` | The Broadcasters @ Swan Inn, Stone 2026-08-27 — a poster-import record from May | `ticketed: false`, `price: "Free"`, plus a `klma-stoke-gig-list` externalId |
| `b199b95c-5012-470a-9f5e-18fea413b617` | Eddie Lee's Back to Back @ The Red Lion Inn 2026-08-22 — imported by the 2026-08-12 run | `ticketed: false`, `price: "Free"` |

⚠ The externalIds write on `f4b4773d` obeyed §6B: `get_by_id` first, then the **complete
intended array in one call**. Read-back confirms both ids present — the `poster-import-2026-05-03`
id survived alongside the new one, which is the correct cross-source outcome.

## 6. Rows NOT written, and why

**Blocked — the act is not in bndy and no artist can be created without Chrome (12 rows).**

| Act | Rows | Venue(s) | `search_artist` result |
|---|---|---|---|
| WILKO | 4 | Navio Lounge Nantwich 21/08 · White Lion Macclesfield 29/08 · Bush at Brown Edge 29/08 · Black Lion Trent Vale 07/11 | no match at any confidence, 2,222 scanned |
| Whiskey Rebel | 3 | Butcher's Arms Forsbrook 30/08 · Black Cock Blythe Bridge 05/09 · New Finney Gardens Bucknall 11/09 | top match "Rebel Rebel" 54% — a Bowie tribute, not this act |
| Guns for Girls **+** One Dimensional Creatures | 1 | Grumpys, Longport 22/08 | neither exists. §4 split needs two creates |
| Devoted | 1 | The Old Star, Uttoxeter 22/08 | top match "Big TED" 43% — not this act |
| Chaindrive | 1 | The Old Post Office, Burslem 28/08 | nothing above 25% |
| Strawberry Blonde | 1 | Swan Inn, Stone 21/08 | top match "Suicide Blonde" 53% — not this act |
| Marc Gollins | 1 | Waggon and Horses, Higherland 22/08 | top match "The Marching Bones" 33% — not this act |

Every one of these is a normal added row. **They re-present next run and cost nothing.** No
`create_artist` call was attempted, so no gate was worked around and no stub was written.

**Rejected on the §6 accept/reject filter (1 row).**
`The Band Jam @ The Bradeley Stratheden`, 2026-08-30, genre column `All Comers`. "All comers"
is an open jam session, not a named act. Not an artist, not an event. Not created.

**Skipped as unsafe to write (2 of the 4 WILKO rows, counted above).**
The sheet bills **WILKO at two different venues on the same night, 2026-08-29** — The White
Lion, Macclesfield and The Bush at Brown Edge. The two submissions are 42 seconds apart
(`17/08/2026 22:52:34` and `17/08/2026 22:53:16`), so one is almost certainly a typing error on
the date or the venue. The event UID is (venue, artist, date), so bndy would accept **both** and
publish a physically impossible pair. Under §0A(b) this is a row that cannot be written safely,
so neither was written. Raised to `CTO-INBOX.md`. The act is blocked on Chrome regardless.

## 7. §VA venue-authoritative checks — 2 of 5 reachable

| Venue | Status | Finding |
|---|---|---|
| **Cosey Club** | **CHECKED** (`web_fetch`) | Sat 22 Aug is billed **"ELECTRIFYING 80S"**. The sheet billed `Tanky/Electrifying 80's`. Both resolve to the existing record `a603777d-…` kept verbatim under §2A.5 — spec §VA.2 trap 1 rules this explicitly. **Date confirmed by the venue. No name correction needed and no second record created.** Tail beyond Sat 10 Oct is behind "Load More" and was not read. |
| **The Sugarmill** | **CHECKED** (`web_fetch`) | Sole-source feed. See §3 and below. |
| **Eleven** | **UNREACHABLE** | `elevenmusicvenue.co.uk` HTTP 000, egress. No Eleven row was in this run's added set, so nothing was imported unchecked. |
| **The Rigger** | **UNREACHABLE** | `theriggervenue.co.uk` HTTP 000, egress. No Rigger row in the added set. |
| **Artisan Tap** | **UNREACHABLE** | Still no proven surface, per the spec. No Artisan Tap row in the added set. |

**No row was imported from a venue whose page went unchecked.** The one VA-venue row imported
(Cosey) was checked against the venue's own page and agrees with it.

**Sugarmill billing change.** `the-dream-machine-sunday-13th-september-2026` was billed
`THE DREAM MACHINE` on 2026-08-15 and is now billed
**`THE DREAM MACHINE + KNUTMO FIVE + KANGARU`**. Under §4 that is two further discrete events.
`search_artist("Kangaru")` returns nothing across 2,222 records, so both supports are new
artists and both are blocked by the Chrome outage. **The existing headline event is untouched
and correct.** Logged to `CTO-INBOX.md` so the next run splits the bill.

**Sugarmill source faults — rechecked, unchanged.** The `CHERRY KISS` ticket link still points
at `nottingham-1-the-island-quarter`, a different venue; that row is a 23:00 club night and is
rejected anyway. `THE YEAR GRUNGE BROKE` still carries a slug and ticket link reading
`2025-12-06` against a listing date of 4 September 2026; bndy holds 2026-09-04 and that stays.
No row is missing a ticket link. One new observation: `ELECTRIC FRIDAYS: CONFESSIONS`
(Friday 21st August) appears in the page banner with no row in the gig guide. It is a club
night by name and was not captured.

## 8. §CT ticketing column

Four values seen in the added rows, all matched case-insensitively after trimming:

| Cell | Written |
|---|---|
| `Free` (Strawberry Blonde, The Broadcasters, Chaindrive `Free entry`) | `ticketed: false`, `price: "Free"` |
| `£0` (Southbound) | `ticketed: false`, `price: "Free"` — a stated zero price, per the v2.19 `£0.00` row read case-insensitively |
| `£7` (SoOasis) | `ticketed: true`, `price: "£7"` |
| `Between £2-£5 for non members.` (Tanky) | **new phrasing.** A range is not a single price. `ticketed: true`, price left EMPTY, text into `ticketInformation` verbatim |

`£0` and the range phrasing should be added to the §CT table on its next touch. Neither is an
escalation — the CTO ruling of 2026-08-08 says a run decides a ticketing string and reports it.

## 9. QUALITY REPORT (§6, v2.5) — the numbers that matter

- Records created **with a verified page**: **0**.
- Records created with an **evidenced blank**: **0**.
- **Artists created at all: 0.** Nothing here is a stub, because nothing was created.
- Records **skipped**: 13 rows — 12 blocked on the identity check, 1 rejected as a jam night.
- Names **sanitised**: 0. No added row needed §0.6 stripping this run.
- Names **staged as non-acts**: 1 (`The Band Jam`, an open jam session).
- Enrichment top-ups: **0**. Every one needs a page visit, which needs Chrome.

**This run creates no stub and reports no false clean.** The honest summary is that four real
gigs landed and thirteen rows are waiting on a browser extension.

## 10. Validator (§6A step 8)

```
0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit code 0. **0 FAIL.** The run wrote no artist and no enrichment field, so there is no
enrichment record to validate and no evidence file
(`enrichment-evidence-2026-08-18-klma-stoke-gig-list.jsonl` was not created — writing an empty
one would assert work that did not happen).

## 11. Gate bounces

None. No 409, no 422, no 500. Every call returned success and every write read back correctly.

## 12. Housekeeping

- Snapshot written to `data/state/klma-stoke-gig-list-last-page.txt`, both sections, with the
  normalisation rules and the 0/0 self-diff in the header. §6A step 7 fail-closed gate satisfied.
- `run-summary.jsonl` appended.
- `record_run` not called — `SOURCE_RUNS_TOKEN` is still unset. Known and not blocking
  (`record-run-token-missing`).
- Claim released with `heldBy: null`. Heartbeat rewritten to `completed`.

## 13. Raised to CTO-INBOX.md

| Fingerprint | Kind |
|---|---|
| `klma-chrome-unreachable-blocks-artists` | BLOCKED |
| `klma-curl-reproduces-gviz-live` | RULE |
| `sugarmill-webfetch-preserves-hrefs` | RULE |
| `klma-wilko-two-venues-one-night` | DATA |
| `sugarmill-dream-machine-supports-unsplit` | DATA |

Not re-raised, already present: `klma-no-delta-mode-declared`,
`klma-header-row-no-longer-last`, `record-run-token-missing`.
