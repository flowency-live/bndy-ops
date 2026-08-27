# bndy-ops

Operational home for bndy's scheduled import tasks and the CTO working record.
This folder is BOTH the live working directory for local Cowork scheduled
tasks AND a git repository - files at the root are live and their paths must
not change without updating the task prompts that reference them.

## Layout

| Path | What lives here |
|---|---|
| `*-TASK-v*.md`, `MASTER-IMPORT-RUNBOOK.md`, `LEMONROCK-AGENT-MANDATE.md`, `BUILD-OPERATING-MODEL.md` (root) | Live runbooks - the prompts/instructions scheduled tasks load. Root paths are load-bearing. |
| `*-last-page.txt`, `discovery-crawl-state.json`, `discovery-review.jsonl`, `fb-image-progress.json` (root) | Live state and cursors, updated by each run. Root paths are load-bearing. |
| `run-reports/` | Dated run reports and remediation reports. Every run appends here per RUN-CONTRACT.md. |
| `cto/` | CTO persona record: CTO-BACKLOG, CTO-DECISION-*, DECISIONS-*, recovery tracker, and `INBOX.md` - the single queue of items needing a CTO ruling. |
| `cto/work-orders/` | Work orders issued to coding agents (VSCODE-AGENT-*). |
| `specs/` | Product/technical specs and plans. |
| `audit/` | Data-quality audit scripts and reports (big JSON outputs untracked). |
| `design-kit/`, `archive-refs/` | Design assets and archived references. |

## Contract

See `RUN-CONTRACT.md`. Short version: every scheduled run ends with a report
in `run-reports/`, a line in `cto/INBOX.md`, and a commit+push. No commit
means no run.

Cloud-side counterparts already in git: `bndy-enrichment` (Backline ops/docs
evidence) and `bndy-website` (public workboard).
