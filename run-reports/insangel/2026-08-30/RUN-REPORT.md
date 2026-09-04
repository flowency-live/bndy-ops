# insangel — RUN REPORT — 2026-08-30

**OUTCOME: FAILED. The run made no capture and no write. No surface reaches `insangel.co.uk`.**

- Run id: `insangel-2026-08-30T05-02-52Z`
- Fired at: 2026-08-30T05:02:52Z
- Today's date (shell): 2026-08-30
- Runbook read: `RUNBOOK.md` H1 **v2.27**
- Spec read: `sources/insangel.md`
- Inbox read: `CTO-INBOX.md`, 595 lines, fingerprints extracted

## 1. Gate results, in contract order

| Step | Gate | Result |
|---|---|---|
| 6A.0 | Heartbeat written first | PASS — `data\state\heartbeat\insangel-2026-08-30T05-02-52Z.json` |
| 6A.1 | Today's date established | PASS — 2026-08-30 |
| 6A.2 | Runbook and spec read in full | PASS |
| 6A.2a | Version floor | PASS — read v2.27, floor v2.19. The task prompt states no number, so no prompt drift to report. |
| 6A.2b | Concurrency claim | PASS — `data\state\claims\insangel.json` held `heldBy: null`, released 2026-08-29T19:53:00Z by `insangel-2026-08-29T19-47-03Z`. Acquired. No takeover. |
| 6A.3 | **Tools verified** | **FAIL — no capture surface. This stopped the run.** |
| 6A.4 | Capture | NOT REACHED |
| 6A.5 | Two-sided diff | NOT REACHED |
| 6A.6 | Pipeline | NOT REACHED |
| 6A.7 | Snapshot write | NOT WRITTEN, CORRECTLY. The run wrote nothing to bndy, so the fail-closed snapshot gate does not apply. Writing a snapshot with no capture would mark today's unseen rows as seen. |

## 2. The four surfaces, each tested once

| Order | Surface | Result, verbatim |
|---|---|---|
| 1 | Sandbox `curl` | `curl: (56) Received HTTP code 403 from proxy after CONNECT` · header `X-Proxy-Error: blocked-by-allowlist` |
| 2 | `web_fetch` | HTTP call returned. Body empty. Zero bytes of content. |
| 3 | Claude in Chrome | `list_connected_browsers` returned `[]`. Zero browsers connected. |
| 4 | In-app browser pane | `navOk: false` — "navigation to https://insangel.co.uk was denied or failed" |

**The bndy backend is NOT the fault.** `list_venue_groups` returned `success: true` with 2 groups in the same session. The MCP write path is live. Only the source is unreachable.

**This is the second consecutive day with no surface.** 2026-08-29 recorded `insangel-chrome-down-no-fourth-surface`. Chrome was this source's only working surface for eight days (`insangel-chrome-is-a-working-surface`, 2026-08-21) after the egress allowlist blocked the host on 2026-08-08. Chrome is now down for a second day and nothing replaces it.

## 3. Counts

| Measure | Count |
|---|---|
| Rows captured | 0 |
| Events created | 0 |
| Artists created with a verified page | 0 |
| Artists created with an evidenced blank | 0 |
| Venues created | 0 |
| Records enriched | 0 |
| Rows skipped | 0 |
| Names sanitised under 0.6 | 0 |
| 409 or 422 bounces | 0 |
| Ids created | none |
| Snapshot delta | none — no capture to diff |
| Defaulted start times | none |
| Corrections applied | none |
| Deletions | none. `data\state\cancellations.jsonl` was not appended. |

## 4. Validator

Not run. Section 6A step 8 feeds the validator the records the run wrote. The run wrote zero records, so there is no input and no batch to ship. No evidence file was created.

## 5. Mode, section 0.29

The spec declares no mode. The run treats the source as **append-only** by default, because a source earns `delta` by evidence. This is already raised as `insangel-mode-not-declared` (2026-08-12) and is not raised again. It had no effect today, because there was no diff.

## 6. Raised to CTO-INBOX.md

One line. Fingerprint `insangel-no-surface-second-consecutive-day`, KIND BLOCKED.

Not raised, because the fingerprint is already open:
`insangel-egress-blocked` · `insangel-egress-allowlist-request` · `insangel-no-capture-surface` · `insangel-chrome-down-no-fourth-surface` · `insangel-mode-not-declared` · `insangel-snapshot-hides-backlog`.

## 7. What the next run must know

1. Test the four surfaces in the order in section 2. Each test costs one call.
2. If Chrome returns, the source is fully readable. The 2026-08-21 run read the whole venues page that way.
3. The standing backlog is unchanged. `insangel-snapshot-hides-backlog` means the current snapshot marks rows as seen that were never written. A capture-only diff will not surface them.
4. `record_run` is not called. `SOURCE_RUNS_TOKEN` is missing. This is already open as `record-run-token-missing` and is not blocking.
