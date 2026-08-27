# CTO DECISION 02 / PRD — Godmode Review Queue & Cowork Exception Handling

**Version:** 2.0 (2026-07-31) — supersedes PRD-COWORK-REVIEW-QUEUE.md v1.0
**Owner:** Jason (CTO) · **Status:** Ready to hand to a build agent
**Change from v1:** the write-back direction is inverted per Jason's ruling — see §3.

---

## 1. Problem

Every automated write into bndy leaves a residue of human decisions: ambiguous artists, odd geocodes, validator bounces, venues that turn out not to be grassroots. Today that residue lives in chat transcripts, local `.md` run reports, and subagent outputs that existed inside one conversation and are now unreachable.

Observed cost, Lemonrock run 2026-07-31:
- Arena Torquay imported in full (13 events, 11 artists) before anyone could say "not grassroots". Cleanup cost more than prevention.
- Five venues silently produced zero events. Jason's words: *"I can not easily see the things that were rejected. Its fucking impossible to see the edge cases I need to work through."*
- `Ooshka, Baby!!` was reported as a new defect when an existing rule already covered it.

Review work cannot be delegated because it isn't anywhere a second person can reach.

## 2. Goals

- One godmode tab showing every outstanding decision from **all** Cowork work — interactive chats and scheduled tasks alike.
- Decisions are durable, queryable, and reusable. Resolving one prevents the recurrence.
- Review work is delegable to someone who wasn't in the original conversation.
- No import run writes a staged decision to local disk.

**Non-goals (v1):** general task management; replacing run reports (they stay as narrative audit); mobile.

## 3. The write-back direction — Jason's ruling, and why v1 was wrong

v1 had agents writing rules directly, which quietly turns the runbook into a machine-generated file. **The correct flow:**

```
Cowork run hits an exception
        │
        ▼
raise_review_item ──────────────► DYNAMO (staging tables)
                                        │
Jason reviews in godmode, takes action  │
        │                               ▼
        └──────────────────────► ACTION RECORDED (what he decided, on what evidence)
                                        │
                     Cowork reads actions back via MCP
                                        │
                                        ▼
                     Cowork PROPOSES a runbook change — a deliberate,
                     reviewed step, never an automatic write
```

The database is the record of **what Jason decided, case by case**. The runbook is what we chose to **generalise** from those decisions. Keeping them separate means the runbook stays human-authored (§7 of the runbook requires exactly this) while the case law accumulates automatically.

Practical consequence: agents never edit the runbook. They read rules, raise exceptions, and read back resolutions. A periodic Cowork pass reviews accumulated actions and says "you've made the same call six times, shall we make it a rule?"

## 4. Data model (Dynamo, single-table, consistent with existing bndy backend)

### ReviewItem
`id` · `status` (open/resolved/dismissed/superseded) · `type` (§5) · `severity` (blocking/advisory) · `source` · `runId` · `origin` (cowork-chat / scheduled-task / agent + agent id) · `title` · `evidence` (structured: candidates, URLs, verbatim bounce, source row) · `proposedActions` · `entityRefs` (bndy ids, for deep links) · `dedupeKey` · `occurrenceCount` · `createdAt`

### ReviewAction — the record of Jason's decision
`id` · `reviewItemId` · `action` (the button pressed) · `params` (e.g. target bndyId for a merge) · `decidedBy` · `decidedAt` · `note` · `evidenceSnapshot` (what he was looking at when he decided)

### AppliedRule — machine-consultable state derived from actions
`id` · `scope` (global | source) · `kind` (ignore-venue / ignore-artist / alias / venue-mapping / verified-source-name / accept-name / venue-tier) · `match` · `action` · `sourceActionId` (FK — every rule traces to a human decision) · `hitCount` · `lastHitAt`

Key layout:
```
REVIEW#<id>                 META
STATUS#<status>             <createdAt>#<id>        default queue view
SOURCE#<source>             REVIEW#<createdAt>#<id>
RUN#<runId>                 REVIEW#<createdAt>#<id>
DEDUPE#<dedupeKey>          REVIEW#<id>
ACTION#<reviewItemId>       <decidedAt>#<id>
RULESCOPE#<scope>#<kind>    RULE#<id>               pipeline consults this
RUN#<runId>                 META                    run summary
```
GSIs: `status-createdAt`, `source-status`. All access is key-based; no scans. Rule lookup is queried once per run and cached for its duration.

## 5. Item types (derived from real runs)

`ambiguous-artist` · `same-name-distinguish` · `venue-mismatch` · `venue-not-grassroots` · `venue-tier-unknown` · `gate-bounce` · `validator-defect` · `enrichment-unresolved` · `source-date-conflict` · `source-dropped-event` · `foreign-act` · `zero-yield-venue` (a venue whose whole feed was rejected — the Molloy's case, currently invisible)

## 6. Interface

**Review tab.** One prioritised list, blocking first. Count badge on the tab. Filters: source, type, severity, run.

Each row: severity dot, type chip, source chip, one-line title, age, occurrence count. Expand shows evidence as comparable cards (name, location, region, footprint, FB link, event count) — not raw JSON — plus a deep link to the source listing.

**One click to resolve.** 2–4 `proposedActions` per item. Bulk-select for obvious batches (ten DJ acts from one source). Buttons that create a permanent rule say so.

**Rules tab.** Lists AppliedRules with hit counts; edit or retire. Critical, because a wrong ignore-rule silently suppresses real gigs and is otherwise invisible.

**Runs tab.** Recent runs, counts, link to full report. Read-only audit.

## 7. MCP tools (bndy-events server)

| Tool | Purpose |
|---|---|
| `raise_review_item` | Create or bump. Idempotent on `dedupeKey`. Returns `{id, deduped}`. |
| `list_review_items` | Filter by status/source/type/run. |
| `get_applied_rules` | **Every import run calls this before its first write.** Returns ignore lists, aliases, mappings, verified names, venue tiers. |
| `list_review_actions` | **The write-back path.** Cowork reads Jason's decisions to propose runbook changes. |
| `resolve_review_item` | Records a ReviewAction; optionally emits an AppliedRule. Primarily the UI's. |
| `start_run` / `complete_run` | Run lifecycle + summary counts. |

Runbook consequences (already landed in v1.12 §6): staged items are **raised**, not just reported; every run calls the rules lookup before its first write.

## 8. Migration

1. Tables + MCP tools; UI stubbed.
2. Backfill AppliedRules from existing markdown alias/gotcha tables (`KLMA-TASK-v2.md`, `ONTHECASE-TASK-v2.md`, `LEMONROCK-TASK-v1.md`, `project_*_venue_issues` memories) — roughly 30 rules.
3. Seed today's rulings: `lemonrock/arenatorquay` ignore, the DJ/karaoke/quiz reject patterns, `Ooshka, Baby!!` verified-source-name.
4. Point the next supervised run at `get_applied_rules`; confirm it skips Arena Torquay unprompted.
5. Ship the UI.
6. Strip duplicated tables out of task files, leaving pointers.

## 9. Success criteria

- One tab shows every outstanding decision, with a count badge.
- Resolving takes one click and, where relevant, prevents recurrence.
- A second run after a resolution raises zero items for that decision.
- An ignore-rule prevents *fetching*, not just writing.
- Someone who wasn't in the original conversation can action an item.
- Zero staged decisions written to local disk.

## 10. Decisions taken (no open questions — these were agreed in conversation 2026-07-31)

- Auto-resolve when an AppliedRule covers an item exactly; log it visibly on the Runs tab.
- Retain resolved items indefinitely as audit trail.
- Keep the schema bndy-shaped until a real second use case exists; do not abstract speculatively.
- **Outstanding, to confirm at build time:** whether ignore lists are venue-level binary or venue+act-type (see CTO Decision 01 — the `venueTier` model may make binary ignore lists unnecessary), and whether review is single-user (Jason) or needs assignees + auth scoping.
