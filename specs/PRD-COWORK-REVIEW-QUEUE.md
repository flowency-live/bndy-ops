# PRD — bndy Godmode Review Queue & Cowork Staging Layer

**Version:** 1.0 (2026-07-31)
**Author:** Cowork session, on Jason's instruction
**Status:** Ready to hand to a build agent
**Problem owner:** Jason (sole reviewer today)

---

## 1. The problem, stated plainly

Every automated write into bndy generates a residue of things a human must decide: an artist that matched three candidates, a venue that geocoded oddly, a gig whose date the band's own page contradicts, an act the backend validator refused, a venue that turns out not to be grassroots at all. Today that residue is scattered across:

- ad-hoc `.md` run reports on Jason's local disk (`Projects/bndy/*.md`)
- inline prose in Cowork chat transcripts, which vanish from view once the chat scrolls
- subagent reports that only ever existed inside one conversation
- alias and gotcha tables duplicated by hand across per-source task files

Three consequences, all of them observed in the Lemonrock run on 2026-07-31:

1. **Review work cannot be delegated.** It lives in Jason's chat window, so only Jason can see it. He is the bottleneck by construction.
2. **The same question gets asked twice.** The runbook already calls a review queue that re-asks a resolved question "a bug" (§1A.5), but with no shared store there is nowhere for the answer to live.
3. **Decisions are made too late to prevent work.** Arena Torquay — a 1,500-capacity room booking The Lemonheads and Belphegor — was fully imported (13 events, 11 artists) before anyone could say "that isn't grassroots". Cleanup cost more than prevention would have.

**What Jason asked for:** one place, in the godmode interface, showing everything from all Cowork work — interactive chats and scheduled tasks alike — that needs his attention. Backed by database staging tables rather than local files. Plus the MCP tooling for agents to write into it.

---

## 2. Goals / non-goals

### Goals
- One queue, all sources, all run types. If an automated process wants a human decision, it goes here and nowhere else.
- Decisions are **durable and reusable** — resolving an item teaches the system, so no future run asks again.
- Prevention as well as triage: ignore-lists and alias tables are first-class records, not prose in a markdown file.
- Review work is **delegable** — anyone with godmode access can clear items, not just Jason.
- Agents can read and write the queue through MCP, in both attended and unattended runs.

### Non-goals (v1)
- Not a general-purpose task manager. Scope is decisions arising from automated writes into bndy.
- Not a replacement for run reports. Reports stay as the narrative audit trail; the queue holds the *actionable* subset.
- No multi-user assignment, comments, or SLAs in v1. Single reviewer, optimise for speed of clearing.
- No mobile UI.

---

## 3. Core concepts

### 3.1 Review Item
The atomic unit. One decision, one screen, one or two clicks to resolve.

| Field | Notes |
|---|---|
| `id` | uuid |
| `status` | `open` · `resolved` · `dismissed` · `superseded` |
| `type` | see the taxonomy in §4 |
| `severity` | `blocking` (work stopped, waiting) · `advisory` (work proceeded, confirm after the fact) |
| `source` | `lemonrock`, `klma-stoke-gig-list`, `onthecasemusic`, … |
| `runId` | the run that raised it |
| `origin` | `cowork-chat` · `scheduled-task` · `agent` — plus the agent name/id |
| `title` | one line, scannable |
| `evidence` | structured blob: candidate records, URLs, the verbatim bounce, the source row |
| `proposedActions` | the 2–4 things the reviewer can click (§5) |
| `entityRefs` | bndy ids this touches, so the UI can deep-link |
| `resolution` | chosen action, who, when, free-text note |
| `learnedRuleId` | FK to the rule this decision created, if any |
| `createdAt` / `resolvedAt` | |
| `dedupeKey` | see §3.3 |

### 3.2 Learned Rule
**This is the part that makes the queue worth building.** A resolved item that would otherwise recur writes a rule the pipeline consults *before* it acts.

| Field | Notes |
|---|---|
| `id`, `scope` | `global` or a specific `source` |
| `kind` | `ignore-venue` · `ignore-artist` · `alias` · `venue-mapping` · `verified-source-name` · `accept-name` |
| `match` | how to recognise it: source slug, exact name, normalised key, place_id |
| `action` | `skip` · `map-to <bndyId>` · `use-name-verbatim` · `allow` |
| `reason`, `rulingBy`, `rulingAt` | provenance — every rule traces to a human decision |
| `hitCount`, `lastHitAt` | so dead rules can be pruned and useful ones justified |

Worked example — Jason's ruling today becomes:
```
{scope: "lemonrock", kind: "ignore-venue", match: {slug: "arenatorquay"},
 action: "skip", reason: "Not grassroots — national touring bookings",
 rulingBy: "jason", rulingAt: "2026-07-31"}
```
and the next Lemonrock run never fetches that venue's feed at all.

The existing per-source markdown alias tables (Danny Brab, Rachel Shenton, Tanky, Sea Horse → Seahorse Sports Bar, Crook Hotel → `de040d70`, …) are seed data for this table. **Migrating them is part of the build**, and once migrated the task files should point at the DB rather than duplicate it.

### 3.3 Deduplication
`dedupeKey` = hash of (`source`, `type`, the identifying part of `evidence`). Raising an item whose key already exists `open` bumps `lastSeenAt` and `occurrenceCount` rather than creating a second row. A key that matches a `resolved` item with a `learnedRuleId` **must not** be raised at all — the pipeline should have consulted the rule. If it is raised, that's a pipeline bug and the UI should say so.

---

## 4. Item type taxonomy

Derived from what actually came up in the Lemonrock, KLMA and OnTheCase runs:

| Type | Raised when | Typical actions |
|---|---|---|
| `ambiguous-artist` | find-or-create returned `review` with candidates | Create new · Merge into candidate X · Skip act |
| `same-name-distinguish` | §1A footprint check inconclusive | Distinct (set region) · Same (reuse id) · Stage |
| `venue-mismatch` | geocode name/town disagrees with source | Accept · Reject + manual place_id · Ignore venue |
| `venue-not-grassroots` | venue looks out of scope | Ignore venue (creates rule) · Keep |
| `gate-bounce` | backend 4xx that isn't a plain duplicate | Fix input · Raise validator defect · Ignore act |
| `enrichment-unresolved` | no confident FB/socials found | Supply URL · Confirm none exists · Leave pending |
| `source-date-conflict` | §5.6b act's page contradicts the listing | Accept correction · Keep listing date |
| `source-dropped-event` | §0.17 candidate deletion | Delete · Keep · Investigate |
| `foreign-act` | act based outside the UK at a UK venue | Import with `UK wide` · Skip · New location model |
| `validator-defect` | a valid record the backend wrongly refuses | Log to fix queue · Override |

`foreign-act` and `venue-not-grassroots` both come directly from today's run and neither had anywhere to live.

---

## 5. The interface

A new godmode tab: **Review**.

**Default view — one prioritised list.** Blocking items first, then advisory, each newest-first. Filters across the top: source · type · severity · run. A count badge on the tab itself, because the whole point is that Jason can see at a glance whether anything is waiting.

**Each row** shows: severity dot, type chip, source chip, the one-line title, age, and occurrence count if >1. Expanding a row reveals the evidence — candidate records rendered as comparable cards (name, location, region, footprint venue list, FB link, event count) rather than raw JSON, the verbatim bounce where relevant, and a deep link to the source listing.

**Resolution is one click.** Each item carries its 2–4 `proposedActions` as buttons. Where an action would create a Learned Rule, the button says so explicitly — "Ignore this venue for Lemonrock (permanent)" — because a permanent rule deserves a deliberate click. Bulk-select for the obvious cases: ten DJ acts from one source get ignored together.

**A second tab, Rules**, lists Learned Rules with their hit counts, and allows editing or retiring one. This is where a wrong decision gets corrected — important, because a bad ignore-rule silently suppresses real gigs and would otherwise be invisible.

**A third tab, Runs**, lists recent runs with their counts and links to the full report. This is the audit trail, read-only.

---

## 6. Data model — Dynamo

Single-table design consistent with the existing bndy backend.

```
PK                        SK                          Notes
REVIEW#<id>               META                        the item
RUN#<runId>               REVIEW#<createdAt>#<id>     items by run
STATUS#<status>           <createdAt>#<id>            the default queue view
SOURCE#<source>           REVIEW#<createdAt>#<id>     per-source filter
DEDUPE#<dedupeKey>        REVIEW#<id>                 dedupe lookup
RULE#<id>                 META                        the learned rule
RULESCOPE#<scope>#<kind>  RULE#<id>                   pipeline consults this
RUN#<runId>               META                        run summary
```

GSIs: `status-createdAt` for the queue, `source-status` for per-source triage. Access patterns are all key-based; no scans.

**Rule lookup must be cheap**, because the pipeline hits it before every venue and every artist. Query `RULESCOPE#<source>#ignore-venue` once per run and cache in memory for the run's duration.

---

## 7. MCP tooling

New tools on the bndy-events MCP server, so agents in chats and scheduled tasks use the identical path.

| Tool | Purpose |
|---|---|
| `raise_review_item` | Create or bump an item. Takes type, severity, source, runId, origin, title, evidence, proposedActions, entityRefs. Returns `{id, deduped: bool}`. **Idempotent on dedupeKey.** |
| `list_review_items` | Filter by status/source/type/run. For agents checking what's already open before raising. |
| `resolve_review_item` | Apply a resolution + optionally emit a Learned Rule. Primarily the UI's, but available for agent auto-resolution where a rule already covers it. |
| `get_learned_rules` | **The one every import run calls first.** Filter by scope + kind. Returns ignore-lists, aliases, mappings, verified names. |
| `upsert_learned_rule` | Create/update a rule. Requires `rulingBy` — a rule with no human ruling behind it is rejected. |
| `start_run` / `complete_run` | Run lifecycle + summary counts, so the Runs tab is populated automatically. |

**Runbook consequence:** §6's "run report is mandatory" gains a clause — every staged item must be raised via `raise_review_item`, not merely written into a report. And every import run must call `get_learned_rules` before its first write. Those two changes are what actually retire the local-markdown workflow.

---

## 8. Migration

1. Build tables + MCP tools; leave the UI stubbed.
2. Backfill Learned Rules from the existing markdown alias/gotcha tables in `KLMA-TASK-v2.md`, `ONTHECASE-TASK-v2.md`, `project_*_venue_issues` memories. Roughly 25–30 rules.
3. Seed the first ignore-rules from today: `lemonrock/arenatorquay` (not grassroots), plus the standing DJ/karaoke/quiz reject patterns which are currently re-derived by every agent from prose.
4. Point the next supervised run at `get_learned_rules` and confirm it skips Arena Torquay without being told.
5. Ship the UI.
6. Only then strip the duplicated tables out of the task files, leaving a pointer.

---

## 9. Success criteria

- Jason opens one tab and sees every outstanding decision from every source and every run type, with a count badge.
- Resolving an item takes one click and, where relevant, writes a rule that prevents recurrence.
- A second run after a resolution raises **zero** items for that same decision.
- An ignore-rule demonstrably prevents fetching, not just prevents writing — the work is skipped, not undone.
- Review work can be handed to someone who was not in the original conversation and is still actionable, because the evidence travels with the item.
- No import run writes a staged decision to local disk any more.

---

## 10. Open questions for Jason

1. **Ignore-list granularity.** Venue-level and artist-level are clear. Do you also want *venue+act-type* (e.g. allow Arena Torquay only for grassroots bills), or is a venue either in or out?
2. **Who else reviews?** v1 assumes only you. If the intent is to farm it out, items need an assignee and the UI needs auth scoping — worth knowing now, it changes the data model.
3. **Auto-resolution appetite.** Should an agent be allowed to auto-resolve an item when a Learned Rule covers it exactly, or must every item be seen once by a human? (Recommendation: auto-resolve, but log it visibly on the Runs tab.)
4. **Retention.** Keep resolved items forever as an audit trail, or archive after N months?
5. **Scope beyond bndy.** You said "ALL work Cowork does". v1 as specced is bndy-import-shaped. Should the schema be neutral enough to carry non-bndy decisions later — and if so, what's the second use case, so the abstraction is designed against something real rather than guessed?
