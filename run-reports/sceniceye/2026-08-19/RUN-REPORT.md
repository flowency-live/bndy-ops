# ScenicEye run report — 2026-08-19

**OUTCOME: STOPPED at §6A step 3. Zero bndy writes. Zero capture.**

| field | value |
|---|---|
| Run id | `sceniceye-2026-08-19T04-37-08Z` |
| Task slug | `sceniceye` |
| Fired | 2026-08-19T04:37:08Z |
| Today | 2026-08-19 (Wednesday) |
| Runbook read | `RUNBOOK.md` H1 **v2.27** |
| Floor asserted | §6A **CURRENT FLOOR v2.19**. 2.27 >= 2.19. PASS |
| Prompt floor | The task prompt names no number. §6A step 2a is the only gate |
| Spec read | `sources/sceniceye.md`, in full |
| Declared §0.29 mode | **none**. The run defaults to `append-only`. Already raised as `sceniceye-mode-not-declared` (2026-08-12) |
| Claim | `data/state/claims/sceniceye.json` was `heldBy: null`. Acquired at 04:37:08Z, TTL 90 min, released at the end of this run |
| Heartbeat | `data/state/heartbeat/sceniceye-2026-08-19T04-37-08Z.json` |

## 1. The blocker

`sources/sceniceye.md` states: *"CHROME IS MANDATORY... If Chrome is not connected: STOP and report the blocker. Do NOT fall back to web fetch, and do not touch bndy."*
RUNBOOK §6A step 3 states: *"Chrome connected where the source requires it. Missing -> STOP + report. Never substitute a plain web fetch for a Chrome-rendered source."*

Two probes, both negative:

1. `list_connected_browsers` returned `[]`.
2. `tabs_context_mcp{createIfEmpty:true}` returned "Claude in Chrome is not connected".

The outage is not local to this task. It is the same outage that `bv2a-enrichment` reports at 31 consecutive firings from 2026-08-17T22:17Z, and that `gigs-news` and `klma` report today. This is the **fourth consecutive sceniceye firing** blocked by it (2026-08-18 21:31Z, and this one).

## 2. What was NOT done, and why

| step | state |
|---|---|
| 4 Capture | Not attempted. Chrome is the only surface the spec permits |
| 5 Two-sided diff | Not possible. No capture |
| 6 Pipeline | Not run. 0 venues, 0 artists, 0 events |
| 7 Snapshot | **NOT written.** Correct. Writing today's state as "seen" with no capture would make the next diff swallow every row (§6A step 5). The fail-closed gate in §6A step 7 binds a run that WROTE to bndy. This run wrote nothing |
| 8 Validator | Not run. `enrichment_validate.py` takes the records a run wrote. This run wrote none |

No diagnostic fetch was made this run. The 2026-08-18 run already probed the non-Chrome surface and recorded the result (`sceniceye-curl-reproduces-live-week`). Repeating it adds no fact.

## 3. Counts

| metric | value |
|---|---|
| Rows captured | 0 |
| Events created | 0 |
| Artists created with a verified page | 0 |
| Artists created with an evidenced blank | 0 |
| Venues created | 0 |
| Names sanitised under §0.6 | 0 |
| Rows skipped | 0 |
| 409 / 422 bounces | 0 |
| Defaulted start times | 0 |
| Date corrections applied | 0 |
| Deletions | 0 |
| Tombstones written | 0 |

## 4. Snapshot state

`data/state/sceniceye-last-page.txt` still holds the capture of **2026-08-15**, week **6-12 August 2026**, 34 gig rows plus three empty days. Every row in it is now past-dated.

The live page is four days ahead of that snapshot. When Chrome returns, the next run diffs a stale-by-two-weeks snapshot against a current capture. Expect a large "added" count. That is a diff artifact, not a source change. The added rows are safe: they are additive and idempotent on the `sceniceye` externalId. **No removed row from that diff may be actioned** — the source is `append-only` and §5.7(a) cannot be satisfied across a two-week gap.

## 5. Cost of the outage

`sceniceye-outage-cost-11-rows-15-16-aug` (2026-08-18) already records up to 11 rows lost on 15-16 August.

The 13-19 August week now expires the same way. This source publishes a **rolling 14-day guide with a Thursday roll**. A row not captured before its date passes is not recoverable — §0.14 forbids importing a past-dated gig, and the curator's page does not retain it. Unlike a forward-listing source, a blocked sceniceye run does not defer work. It destroys it.

## 6. Raised this run

One line appended to `CTO-INBOX.md`:

| KIND | FINGERPRINT |
|---|---|
| DECISION | `sceniceye-third-surface-needs-ruling` |

Checked first against every existing sceniceye fingerprint in that file. Not a duplicate of:

- `sceniceye-chrome-unreachable-blocks-capture` (2026-08-18) — states the outage. A 32nd identical BLOCKED line adds no fact.
- `sceniceye-curl-reproduces-live-week` (2026-08-18) — states that a non-Chrome surface returns the live week. It is a RULE. **A run never edits a rule.** It has sat unruled for one day and the source has done nothing for four.
- `sceniceye-outage-cost-11-rows-15-16-aug` (2026-08-18) — states the loss to date.

The new item is the one thing none of them is: a request for a ruling, with the standing cost attached.

## 7. Open items for Jason

1. **May this source capture from a surface other than Chrome?** The spec forbids it. §6A step 3 forbids it. A logged diagnostic says the surface works and returns live content. A run may not settle this. See `sceniceye-third-surface-needs-ruling`.
2. **The Chrome extension.** 31+ automatic retries across five tasks have not resolved it. It needs a human to check the install and login state directly.
3. `sceniceye-mode-not-declared` is still open from 2026-08-12. The spec declares no §0.29 mode.
