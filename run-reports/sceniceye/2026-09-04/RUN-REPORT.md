# ScenicEye — RUN REPORT 2026-09-04

| field | value |
|---|---|
| Run id | `sceniceye-2026-09-04T04-36-37Z` |
| Fired | 2026-09-04T04:36:37Z |
| Finished | 2026-09-04T04:44:00Z |
| Outcome | **FAILED — no render surface. 0 events, 0 artists, 0 venues. No bndy writes. No capture.** |
| Runbook read | `RUNBOOK.md` **v2.27**, in full |
| Floor asserted | §6A CURRENT FLOOR **v2.19**. The task prompt names no number. v2.27 >= v2.19 -> PASS |
| Spec read | `sources/sceniceye.md`, in full |
| Capture surface | **NONE AVAILABLE.** Chrome not connected. The in-app browser denies the domain. |
| Mode (§0.29) | Not declared by the spec. Treated as **append-only**. Already raised: `sceniceye-mode-not-declared` |

---

## 1. Gates (§6A steps 0-3)

| step | result |
|---|---|
| 0 heartbeat | Written first: `data\state\heartbeat\sceniceye-2026-09-04T04-36-37Z.json`, `outcome: started`. Rewritten `failed` as the last action, reason `6A.3 chrome-unreachable`. |
| 1 date | `date +%Y-%m-%d` -> **2026-09-04**, a Friday. |
| 2 runbook + spec | Both read in full. |
| 2a floor | Runbook H1 v2.27, floor v2.19. PASS. The prompt states no number, so there is no drift to report. |
| 2b claim | `data\state\claims\sceniceye.json` read. `heldBy: null`, released 2026-09-03T04:52:00Z by `sceniceye-2026-09-03T04-36-11Z`. **Acquired cleanly. No takeover.** TTL 90 minutes (§6G), `expiresAt` 2026-09-04T06:06:37Z. `heartbeatFile` quotes the step-0 filename exactly. |
| 3 tools | **FAIL.** `list_connected_browsers` returned an empty array. `tabs_context_mcp{createIfEmpty:true}` returned "Claude in Chrome is not connected". Two attempts, both negative. bndy MCP tools were not exercised, because no capture exists to write. |

## 2. The blocker

The spec makes Chrome mandatory for this source and forbids a `web_fetch` fallback:
*"If Chrome is not connected: STOP and report the blocker. Do NOT fall back to web fetch, and
do not touch bndy."* §6A step 3 states the same rule: *"Never substitute a plain web fetch for a
Chrome-rendered source."*

One alternative render surface exists in this session. The in-app browser was tried once. It
returned: *"The person hasn't allowed the browser pane to use https://scenicmind.co.uk yet."*
The approval is interactive. **This run is unattended, so no approval can be given.** This is the
same state as 2026-08-29, fingerprint `sceniceye-inapp-browser-denied-domain`.

**No render surface exists. The run stops before capture. Nothing was written to bndy.**

## 3. Context — this is a recurrence, not a continuing outage

Chrome was reachable on 2026-09-01, 2026-09-02 and 2026-09-03. The earlier outage ran
2026-08-18 to 2026-08-30 and had cleared. Today it is down again.

## 4. Capture, diff, snapshot

| item | result |
|---|---|
| capture | **NONE.** `data\raw\sceniceye\2026-09-04\` holds no capture file. |
| two-sided diff (§5.7) | **NOT RUN.** A diff needs a capture. |
| snapshot | **NOT WRITTEN.** §6A step 5 forbids writing a snapshot on a held run. The stored snapshot stays at the 2026-09-02 content, 81 lines, 34 normalised rows. |
| removals actioned | **NONE.** The source is append-only and no capture exists. |

The fail-closed snapshot gate (§6A step 7) does not apply: it binds a run that WROTE to bndy.
This run made zero writes.

## 5. Quality measures (§6 report rule)

| measure | count |
|---|---|
| records created with a verified page | 0 |
| records created with an evidenced blank | 0 |
| records staged | 0 |
| names sanitised or skipped as non-acts under §0.6 | 0 |
| gate bounces (409/422) | 0 |
| defaulted times (§5.6) | 0 |
| corrections applied (§5.6b) | 0 |

## 6. Validator (§6A step 8)

**NOT RUN.** No records were written and no evidence file was produced, so there is nothing to
validate. `data\state\enrichment-evidence-2026-09-04-sceniceye.jsonl` was not created.

## 7. Cost of the outage

The curator rolls the page on a Thursday. Yesterday, 2026-09-03, the page had not yet rolled and
the week of 27 Aug - 2 Sep was still live. The week of 3-9 September was therefore expected to
appear today. **This run cannot see it.** Rows dated Thursday 3 September are already past and
cannot be recovered. Rows from 4 September onward remain importable by the next run that has a
render surface. The same class of loss is on record as `sceniceye-outage-cost-11-rows-15-16-aug`.

## 8. Items raised

One line appended to `CTO-INBOX.md`:

| KIND | FINGERPRINT |
|---|---|
| BLOCKED | `sceniceye-chrome-outage-recurred-2026-09-04` |

Not raised again, because each is already open in `CTO-INBOX.md`:
`sceniceye-chrome-unreachable-blocks-capture`, `sceniceye-inapp-browser-denied-domain`,
`sceniceye-third-surface-needs-ruling`, `sceniceye-webfetch-reproduces-live-week`,
`sceniceye-mode-not-declared`, `record-run-token-missing`.

## 9. record_run

Not called. It fails on a missing `SOURCE_RUNS_TOKEN` (`record-run-token-missing`) and this run
has no counts to record. `run-summary.jsonl` carries the result instead.
