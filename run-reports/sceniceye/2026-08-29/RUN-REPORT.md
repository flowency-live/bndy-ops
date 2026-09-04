# ScenicEye run report — 2026-08-29

- **Run id:** `sceniceye-2026-08-29T19-40-16Z`
- **Outcome:** FAILED at §6A step 3. No capture surface was available. No writes to bndy. No snapshot written.
- **Runbook read:** `RUNBOOK.md` H1 **v2.27**. The CURRENT FLOOR in §6A is **v2.19**. The task prompt states no number. Pass.
- **Spec read:** `sources/sceniceye.md`, in full.
- **CTO-INBOX read:** all fingerprints listed before this report was written.
- **Source mode (§0.29):** the spec declares no mode. The run used **append-only**. It deleted nothing.
  The defect is on file as `sceniceye-mode-not-declared` (2026-08-12). It is not raised again.

## 1. Gates

| Step | Result |
|---|---|
| §6A.0 heartbeat | Written: `data/state/heartbeat/sceniceye-2026-08-29T19-40-16Z.json` |
| §6A.1 date | 2026-08-29 (Saturday), shell clock, 19:40:16Z |
| §6A.2 runbook + spec | Both read in full |
| §6A.2a floor | v2.27 >= v2.19. Pass. Prompt asserts no number, so no drift to report |
| §6A.2b claim | `data/state/claims/sceniceye.json` held `heldBy: null`, released by `sceniceye-2026-08-28T04-36-00Z`. Acquired at 19:40:16Z. No takeover. TTL 90 minutes, `expiresAt` 21:10:16Z |
| §6A.3 tools | **FAIL. Chrome is not connected.** See §2 |
| §6A.4 capture | Not reached |
| §6A.5 diff | Not reached |
| §6A.6 pipeline | Not reached |
| §6A.7 snapshot | **Not written, and correctly so.** The run made no capture and no bndy write. §6A step 5 forbids a snapshot on a held run |
| §6A.8 validator | Not run. No record was written, so the validator has no input. No evidence file was written |
| §5.4 tombstones | `data/state/cancellations.jsonl` not consulted. No event was created |

## 2. The blocker — no rendering surface

The spec makes Chrome mandatory for this source. The reason is stated in
`scrape_architecture`: the Super.so SSR cache is stale, so a static fetch returns an old
week. The page must be rendered.

Two surfaces were tried. Both failed.

| Surface | Attempt | Result |
|---|---|---|
| Claude in Chrome | `list_connected_browsers` | `[]` — zero connected browsers |
| Claude in Chrome | `tabs_context_mcp(createIfEmpty:true)` | "Claude in Chrome is not connected" |
| Built-in browser pane | `preview_start` → `https://scenicmind.co.uk/sceniceye` | `navOk: false`. Navigation denied |
| Built-in browser pane | `navigate` → same URL | "navigation to https://scenicmind.co.uk was denied or failed" |

The spec says to stop when Chrome is not connected. It also forbids a fall-back to web fetch.
The run obeyed both instructions. `mcp__workspace__web_fetch` was not called. `curl` was not
called. The bndy MCP tools were not called.

**The Chrome outage is not specific to this task.** Two other scheduled tasks fired minutes
before this one and their heartbeats still read `started`:
`klma-stoke-gig-list-2026-08-29T19-36-05Z.json` (19:36:05Z) and
`gigs-news-uk-2026-08-29T19-37-20Z.json` (19:37:20Z). Treat this as one platform outage
across the evening's tasks, not as a ScenicEye fault.

**The built-in browser result is the new fact.** Earlier Chrome outages on this source
(2026-08-18 and 2026-08-19) left an open question about a second rendering surface. There is
now an answer for the in-app browser: it renders JavaScript, so it meets the spec's stated
reason for the Chrome rule, but `scenicmind.co.uk` is denied to it. It is not a usable
fall-back today. One line is raised to `CTO-INBOX.md` under a new fingerprint.

The open decision `sceniceye-third-surface-needs-ruling` (2026-08-19) already covers the
container-curl surface. It is not raised again.

## 3. Cost of the stop

The stored snapshot is the week of **20-26 August 2026**, captured on 2026-08-28. That week
was already fully past-dated on 2026-08-28. Today is 2026-08-29.

The curator rolls the page on a Thursday. Thursday 27 August has passed. The page has
therefore either rolled to the week of 27 August - 2 September, or the curator has missed a
second roll.

- **If the page has rolled**, this run has missed one capture of a fresh week. Rows dated
  Saturday 29 August are at risk of passing before the next successful run. Rows dated
  30 August to 2 September remain importable by a later run.
- **If the page has not rolled**, the run has missed nothing. The 2026-08-27 and 2026-08-28
  runs both reported the same stale week.

**Neither case can be told from the other without a capture.** The report does not guess
which one holds. The same uncertainty produced the measured loss recorded as
`sceniceye-outage-cost-11-rows-15-16-aug` (2026-08-18), so the risk is real and is stated
here rather than assumed away.

## 4. Diff (§5.7, §5.7a)

Not performed. There is no capture to diff. The stored snapshot
`data/state/sceniceye-last-page.txt` is unchanged and still carries the 2026-08-28 header.

## 5. Quality measures (§6)

| Measure | Count |
|---|---|
| Events created | 0 |
| Artists created with a verified page | 0 |
| Artists created with an evidenced blank | 0 |
| Venues created | 0 |
| Records enriched | 0 |
| Rows skipped | 0 (no rows were captured) |
| Names sanitised or skipped as non-acts | 0 |
| Gate bounces (409/422) | 0 |
| Defaulted start times | 0 |
| Date corrections applied | 0 |

No row reached the venue, artist or event protocol. The run stopped before the capture step.

## 6. Corrections applied by this run

None. The run wrote nothing to bndy.

## 7. Items raised to CTO-INBOX.md

One line, new fingerprint `sceniceye-inapp-browser-denied-domain`.

Not raised, because a fingerprint already holds the item:

- `sceniceye-chrome-unreachable-blocks-capture` (2026-08-18) — the Chrome outage itself.
- `sceniceye-third-surface-needs-ruling` (2026-08-19) — the pending ruling on another surface.
- `sceniceye-mode-not-declared` (2026-08-12) — the missing §0.29 mode.
- `record-run-token-missing` (2026-08-08) — `record_run` was not called, because no record was written.

## 8. Daily note (§6A step 8)

`20-Daily/2026-08-29.md` did not exist. The run created it and appended one line that links
this report.

## 9. Release

- Run summary appended to `data/state/run-summary.jsonl` with `outcome: failed` and zero counts.
- Heartbeat rewritten with `"outcome":"failed"` and `"reason":"6A.3 chrome-unreachable"`.
- Claim `data/state/claims/sceniceye.json` released with `heldBy: null`.

## 10. What the next run should do

1. Check `list_connected_browsers` first. The outage may still hold.
2. If Chrome returns, capture as normal. Expect the week of 27 August - 2 September, or a
   second missed roll on the 20-26 August week.
3. Read this report before treating any absent bndy event as a coverage gap. This run wrote
   nothing, so it removed nothing.
