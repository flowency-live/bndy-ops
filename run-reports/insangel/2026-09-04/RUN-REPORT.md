# insangel — RUN REPORT 2026-09-04

- **runId**: `insangel-2026-09-04T05-02-58Z`
- **outcome**: **FAILED.** No capture surface. Zero rows collected. Zero writes to bndy.
- **runbook version read**: v2.27. **CURRENT FLOOR (§6A)**: v2.19. Above floor.
- **prompt floor**: the task prompt states no number. §6A step 2a is the gate.
- **spec read**: `sources\insangel.md`, in full.
- **claim**: `data\state\claims\insangel.json`. Previous state `heldBy: null`, released by the 2026-09-03 run. Acquired clean. No takeover.
- **heartbeat**: `data\state\heartbeat\insangel-2026-09-04T05-02-58Z.json`
- **mode**: `append-only`. The spec declares no §0.29 mode. See CTO-INBOX `insangel-mode-not-declared`. No removal was actioned.

## 1. Headline

| measure | count |
|---|---|
| events created | 0 |
| artists created | 0 |
| venues created | 0 |
| rows captured | 0 |
| validator | not run — no records written |

**Creates this run: 0 of 50.** The run stopped at §6A step 3 (tool verification). No capture, so no diff, no pipeline and no snapshot write. The §6A step 7 fail-closed snapshot gate does not apply: the run made no write to bndy, so the stored 2026-09-03 snapshot stays the baseline and tomorrow's diff is unaffected.

## 2. Capture — all four surfaces failed

| surface | result |
|---|---|
| sandbox `curl` | HTTP 000. `curl: (56) Received HTTP code 403 from proxy after CONNECT`. The egress allowlist still blocks this host. Standing item `insangel-egress-allowlist-request`. |
| `web_fetch` | HTTP 200 shape, empty body. Same behaviour as 2026-08-19 and 2026-08-30. |
| Chrome (`claude-in-chrome`) | `list_connected_browsers` returned `[]`. Zero browsers connected. This is the surface that worked on 2026-08-21 and 2026-09-01 to 2026-09-03. |
| in-app browser pane | Refused. The tool requires an interactive `request_access` approval for `insangel.co.uk`. **A scheduled run has no person to approve it.** Standing item `builtin-browser-navigation-denied-unattended`. |

The spec says server-rendered HTML and that `curl` is sufficient. That has not been true since 2026-08-18 — see the standing item `insangel-chrome-is-a-working-surface`. With Chrome down, this source has no surface at all.

**Today's Chrome outage is not confined to this task.** `sceniceye` failed at 04:44Z on the same two surfaces, and `gigs-news` blocked 4 acts on it at 04:20Z. That is consistent with one browser-connection outage rather than a fault in this source.

## 3. Steps not reached

- §6A step 4 capture — not reached.
- §6A step 5 two-sided diff — not reached. The stored snapshot `data\state\insangel-last-page.txt` (`insangel-2026-09-03T05-02-34Z`, 67 venues, 652 pairs) is untouched.
- §6A step 6 pipeline — not reached.
- §6A step 8 validator — not run. Nothing was written, so there is nothing to validate.

## 4. Corrections and decisions

None. The run wrote nothing to bndy, corrected nothing and deleted nothing.

## 5. Items raised

One line appended to `CTO-INBOX.md`, fingerprint `insangel-chrome-outage-2026-09-04`. The four standing items below are already in the inbox and are **not** re-raised:

- `insangel-egress-allowlist-request` (DECISION, 2026-08-18)
- `insangel-chrome-is-a-working-surface` (RULE, 2026-08-21)
- `insangel-chrome-down-no-fourth-surface` (BLOCKED, 2026-08-29)
- `builtin-browser-navigation-denied-unattended`

## 6. Standing note

`record_run` was not called. `SOURCE_RUNS_TOKEN` is unset — standing item `record-run-token-missing`. `run-summary.jsonl` was appended as normal and is the dashboard input.

## 7. Next run

The next firing repeats the four probes. Nothing is lost: the source is re-read daily and the 2026-09-03 snapshot still diffs correctly against a later capture. The blocker is the surface, not the pipeline.
