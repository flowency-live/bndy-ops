# bndy-ops sync contract

bndy-ops is the single source of truth for Cowork scheduled task run reports, the CTO inbox, and decision records.

## Source of the data

The scheduled import fleet writes to the vault on Jason's computer:
`AllProjectsMD/bndy/10-Projects/bndy-population/`.
The fleet does not write to this repository. A daily ops-sync task mirrors the vault into this repository.

## Layout

| Path in bndy-ops | Source in the vault |
|---|---|
| `run-reports/<slug>/<date>/<file>` | `data/normalized/<slug>/<date>/` RUN-REPORT, LEDGER, and SWEEP files |
| `cto/INBOX.md` | `CTO-INBOX.md` |
| `cto/DECISIONS.md` | `DECISIONS.md` |

The flat files in `run-reports/` from before 2026-08-01 predate this contract. They stay as history.

## Rules

1. The vault is the write surface. This repository is the mirror. Do not edit mirrored files here.
2. The sync copies report files only. Normalized data payloads stay in the vault.
3. The sync task never runs importers and never edits other scheduled tasks.
4. Commit message format: `ops-sync: <date> run reports and CTO records`.
