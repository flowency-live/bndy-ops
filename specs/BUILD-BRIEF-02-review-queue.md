# BUILD BRIEF 02 — Godmode Review Queue & Learned Rules

**Status:** READY TO BUILD · **Raised:** 2026-07-31 · **Owner:** Jason (CTO)
**Decision record / PRD:** `CTO-DECISION-02-review-queue-PRD.md` (the *why* and the full data model; this document is the *build order* and the acceptance bar)
**Codebases:** `bndy-serverless-api` (DynamoDB + Lambda) · `bndy-MCPServer` (new tools) · `bndy-backstage` or wherever godmode lives (UI)
**Runbook:** subordinate to `bndy-population/RUNBOOK.md` v2.3a

---

## 0. The one sentence that justifies this build

**Resolving a review item must WRITE A RULE, so the same question is never asked twice.**

Everything else here is plumbing. If you build the queue but not the Learned Rule store, you have built a nicer inbox and the reviewer's workload does not fall. Runbook §1A.5 already calls a queue that re-asks a resolved question *a bug*.

## 1. Why it matters, concretely

Today the residue of every automated write — an artist that matched three candidates, a venue that geocoded oddly, a gig whose date the band's own page contradicts, an act the validator refused — is scattered across local `.md` files, chat transcripts that scroll away, and subagent reports that only ever existed inside one conversation.

Three consequences, all observed:

1. **Review work cannot be delegated.** It lives in Jason's chat window, so only Jason can clear it. He is the bottleneck by construction.
2. **The same question gets asked twice**, because there is nowhere for the answer to live.
3. **Decisions arrive too late to prevent work.** Arena Torquay — a 1,500-capacity room booking national tours — was fully imported (13 events, 11 artists) before anyone could say "that isn't grassroots". Cleanup cost more than prevention would have.

## 2. Build order

Ship in this sequence. Each phase is independently useful; do not start the UI before the rules store works.

### Phase 1 — Tables + Learned Rules (the load-bearing half)

Single-table DynamoDB, consistent with the existing backend. Full key design is in the PRD §6; implement it as specified.

**Learned Rule** is the important entity:

| Field | Notes |
|---|---|
| `id`, `scope` | `global`, or a specific source (`lemonrock`, `klma-stoke-gig-list`, …) |
| `kind` | `ignore-venue` · `ignore-artist` · `alias` · `venue-mapping` · `verified-source-name` · `accept-name` |
| `match` | how to recognise it — source slug, exact name, normalised key, place_id |
| `action` | `skip` · `map-to <bndyId>` · `use-name-verbatim` · `allow` |
| `reason`, `rulingBy`, `rulingAt` | provenance — **every rule traces to a human decision** |
| `hitCount`, `lastHitAt` | so dead rules can be pruned and useful ones justified |

**Rule lookup must be cheap** — the pipeline hits it before every venue and every artist. One query per scope per run, cached in memory for the run's duration.

### Phase 2 — MCP tools

New tools on the bndy-events MCP server, so chats and scheduled tasks use the identical path:

| Tool | Purpose |
|---|---|
| `get_learned_rules` | **The one every import run calls first.** Filter by scope + kind. |
| `raise_review_item` | Create or bump an item. **Idempotent on `dedupeKey`.** Returns `{id, deduped}`. |
| `list_review_items` | Filter by status/source/type/run — for agents checking what is already open. |
| `resolve_review_item` | Apply a resolution, optionally emitting a Learned Rule. |
| `upsert_learned_rule` | **Requires `rulingBy`** — a rule with no human behind it is rejected. |
| `start_run` / `complete_run` | Run lifecycle + summary counts, so the Runs tab populates itself. |

### Phase 3 — Migration and seeding

1. Backfill Learned Rules from the existing markdown alias/gotcha tables in `sources/*.md` and the `project_*_venue_issues` memories — roughly 25–30 rules. Known seeds include the billing aliases (Danny Brab, Rachel Shenton, Tanky, Russ Tippins, Dog In A Box, Rock and Roll Preachers) and the venue mappings (Sea Horse → Seahorse Sports Bar, New Hartley SMC → New Hartley Memorial Hall, Crook Hotel → `de040d70`).
2. Seed the first ignore-rules: `lemonrock/arenatorquay`, plus the standing DJ / karaoke / quiz reject patterns currently re-derived from prose by every agent.
3. **Prove it:** point a supervised run at `get_learned_rules` and confirm it skips Arena Torquay **without being told**.
4. Only then strip the duplicated tables out of the source specs, leaving a pointer. Not before — a half-migrated alias table is worse than either state.

### Phase 4 — UI

A new godmode tab, **Review**. Blocking items first, then advisory, newest-first. Filters: source · type · severity · run. **A count badge on the tab itself** — the whole point is that Jason can see at a glance whether anything is waiting.

Each row: severity dot, type chip, source chip, one-line title, age, occurrence count if >1. Expanding shows the evidence as **comparable cards** — name, location, footprint venues, FB link, event count — not raw JSON.

**Resolution is one click.** Each item carries 2–4 proposed actions as buttons. Where an action creates a Learned Rule, **the button says so**: "Ignore this venue for Lemonrock (permanent)". A permanent rule deserves a deliberate click. Bulk-select for the obvious cases — ten DJ acts from one source get ignored together.

Two more tabs: **Rules** (with hit counts, editable, retirable — this is where a wrong decision gets corrected, and it matters because a bad ignore-rule silently suppresses real gigs and is otherwise invisible) and **Runs** (read-only audit trail).

### Phase 5 — Runbook amendment

Two clauses, already drafted into §6 as pending:
- Every staged decision is **raised via `raise_review_item`**, not merely written into a report.
- Every import run **calls `get_learned_rules` before its first write** — this becomes a new step in the §6A run contract.

Those two changes are what actually retire the local-markdown workflow. Until they land, the queue is optional and will be bypassed.

---

## 3. Item taxonomy

Derived from what actually came up in real runs — implement all of these:

`ambiguous-artist` · `same-name-distinguish` · `venue-mismatch` · `venue-not-grassroots` · `gate-bounce` · `enrichment-unresolved` · `source-date-conflict` · `source-dropped-event` · `foreign-act` · `validator-defect`

`foreign-act` and `venue-not-grassroots` both came directly from live runs and had nowhere to live.

## 4. Acceptance

1. Jason opens one tab and sees every outstanding decision from every source and every run type, with a count badge.
2. Resolving an item takes one click and, where relevant, writes a rule.
3. **A second run after a resolution raises ZERO items for that same decision.** This is the headline test.
4. An ignore-rule demonstrably **prevents fetching**, not just prevents writing — the work is skipped, not undone.
5. Review work can be handed to someone who was not in the original conversation and is still actionable, because the evidence travels with the item.
6. `raise_review_item` is idempotent — raising the same item twice bumps `occurrenceCount`, it does not create a second row.
7. `upsert_learned_rule` without `rulingBy` is rejected.
8. No import run writes a staged decision to local disk any more.

## 5. Open questions Jason still owes you

These do not block Phases 1–3. Get answers before Phase 4.

1. **Ignore-list granularity** — venue-level and artist-level are clear. Also want *venue + act-type* (allow Arena Torquay only for grassroots bills), or is a venue simply in or out?
2. **Who else reviews?** v1 assumes only Jason. If the intent is to delegate, items need an assignee and the UI needs auth scoping — that changes the data model, so it is worth knowing now.
3. **Auto-resolution appetite** — may an agent auto-resolve when a Learned Rule covers the case exactly, or must every item be seen once by a human? *(PRD recommendation: auto-resolve, but log it visibly on the Runs tab.)*
4. **Retention** — keep resolved items forever as audit trail, or archive after N months?
5. **Scope beyond bndy** — Jason said "ALL work Cowork does". v1 as specced is bndy-import-shaped. Should the schema be neutral enough to carry non-bndy decisions later, and if so what is the second use case, so the abstraction is designed against something real?

## 6. Traps

- Read every write back with `get_by_id` (§0.10). `search_*` tools have documented false-negative modes.
- `dedupeKey` = hash of (source, type, the identifying part of evidence). A key matching a **resolved** item that carries a `learnedRuleId` **must not be raised at all** — the pipeline should have consulted the rule. If it is raised anyway, that is a pipeline bug and the UI should say so.
- Do not let the queue become a general task manager. Scope is decisions arising from automated writes into bndy. Run reports stay as the narrative audit trail; the queue holds only the *actionable* subset.
