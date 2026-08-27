---
type: superseded
superseded: 2026-07-31
---

# ⚠ SUPERSEDED — DO NOT CITE AS CURRENT STATE

**This tracker describes the 27–28 July import-shutdown recovery and has not been accurate since 2026-07-28.** Its phase table and re-enable checklist do not describe reality: the imports were re-enabled, the gates went to enforce, five scheduled tasks are live, and the runbook has since forked and been merged.

**Where the truth actually lives now:**

| For | Read |
|---|---|
| The rules | `AllProjectsMD\bndy\10-Projects\bndy-population\RUNBOOK.md` **v2.3a** — the ONE runbook |
| What needs a decision | `bndy-population\OPEN-RULINGS.md` |
| Decisions and builds | `Documents\Claude\Projects\bndy\CTO-BACKLOG.md` |
| What ran, and what it did | `bndy-population\data\normalized\<slug>\<date>\RUN-REPORT.md` |
| Per-source procedure | `bndy-population\sources\<slug>.md` |
| Enrichment | `bndy-population\ENRICHMENT-TASK-v3.md` |
| Scheduled task prompts | `bndy-population\SCHEDULED-TASK-PROMPTS-v2.md` |

**What actually happened since this file was last true (2026-07-28 → 07-31):**

- Cleanup, sentinel backfill and `GATE_MODE=enforce` all landed; supervised runs re-qualified the sources.
- Five daily scheduled tasks went live (`Bv2a insangel` · `Bv2a KLMA` · `BV2a GigsNews` · `Bv2a ScenicEye` · `Bv2a otcm`). The older `bv2-*` and `*-daily-import` generations are **disabled**, retained only as a quality reference.
- **The runbook forked** into a vault copy (v2.2) and a `Projects\bndy` copy (v1.12) that contradicted each other. Jason ruled the vault canonical; they were merged to **v2.3**, and `Projects\bndy\MASTER-IMPORT-RUNBOOK.md` is now a tombstone.
- **Root cause of the week's failures found:** the fork had split the snapshot state directory, so supervised sessions wrote snapshots to a path no scheduled task reads. That single mechanism caused gigs-news to bounce 50 of 54 rows, KLMA to see 25 phantom "added" rows, and onthecase to hold. Fixed in v2.3 — one state directory, a fail-closed snapshot-write gate binding on supervised sessions too, and a runbook version floor.
- All three MCP/backend blockers (`create_artist` review resolution, `verifiedSourceName`, `edit_event` externalIds dedupe) are **fixed and verified**.
- OnTheCase's snapshot was rebuilt from a full-feed capture; the source runs normally again.

**The standing rules from this file that DO outlive it** — all now in the runbook, cited here only so nothing is lost:

No session ever creates or re-enables an import task (Jason only) · no AI judgment on identity — deterministic rules and backend bounces only · multi-artist bills become one discrete event per act · owner-managed records are untouchable · blank beats wrong on enrichment.

---

*Original content removed. Its history is in git and in the run reports; keeping a stale phase table here only invites someone to act on it.*
