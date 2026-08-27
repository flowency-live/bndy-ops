# CTO BACKLOG — decisions and specs awaiting Jason

Index of everything raised by Cowork sessions that needs CTO-level judgement or a build.
**Naming convention: `CTO-DECISION-NN-<slug>.md` in `Projects/bndy/`.** One file per decision. Add new items to the top of the table.
Where a decision has been turned into agent-executable work, the build brief is named `BUILD-BRIEF-NN-<slug>.md`.

| # | Item | Type | Raised | Status | File |
|---|---|---|---|---|---|
| ~~05~~ | ~~**Region normalisation**~~ — **WITHDRAWN 2026-07-31, and deliberately kept here so it is not re-raised.** A CTO session read runbook §1A.1 strictly, concluded all six source specs were defective for storing `Derbyshire, UK` / `North West UK` etc., rewrote them, and proposed a **748-record sweep**. Jason rejected it and **the data proved him right**: 6 same-name collision groups across 1,565 artists with **ZERO location clashes**, and **ZERO Kilmarnock geocodes** (1,550 artists carry no coordinates, so that path is not live). `location` exists for **distinguishability**; bndy holds towns and regions as equally first-class, and flattening a county/region string destroys information. **All six specs reverted byte-for-byte; the two wrong §1A.1 clauses removed.** §1A.1 now prohibits enum-compliance sweeps and carries the collision check that actually tests the risk. ⚠ §1A.1's own stated rationale ("free-text regions don't exist in bndy") looks factually wrong and **awaits a Jason ruling** — the only live remnant. | Withdrawn | 2026-07-31 | **CLOSED — do not re-open without new evidence** | runbook §1A.1 · `ENRICHMENT-TASK-v3.md` §7 |
| 04 | **Artist & venue enrichment nightly agent** — FB URL, bio, genres, actType, location for artists; FB/website/phone for venues. **Strategy inverted from v1/v2:** harvest source-declared data FIRST (onthecase genres+bio+venue phone, gigs-news venue FB URLs, fantastical typed host pages, insangel `/bands/<slug>` — all currently unharvested), Facebook search LAST. Codified Tier A/B/C evidence ladder from real accept/reject decisions, do-not-attach collision list, attempt ledger with cooldowns, the working FB image recipe and its three failure modes. | Task spec | 2026-07-31 | **SPECCED — ready to run supervised. NOT blocked by anything** (the 05 dependency was withdrawn) | `ENRICHMENT-TASK-v3.md` (in the vault) |
| 03 | **Ticketed venue banner + per-gig ticketed flag** — mark the venue ticketed, show a banner with an outbound link to the venue's own box office, allow a per-gig `ticketed` true/false override. Uses existing `standardTicketed`/`standardTicketUrl` — no new venue schema. Settles Decision 01 Q1 (two-axis model CONFIRMED) and Q4 (ignore-lists REJECTED as the tool). | PRD / build | 2026-07-31 | **BRIEFED — ready for an agent.** Target: `bndy-serverless-api` + **`bndy-app`** (greenfield, per Jason 2026-07-31 — NOT frontstage). Three ordered phases. | `CTO-DECISION-03-ticketed-venue-feature.md` → **`BUILD-BRIEF-03-ticketed-venue.md`** |
| 02 | **Godmode Review Queue & Learned Rules** — staging tables in Dynamo, MCP tools, one tab showing everything needing Jason's attention across all chats and scheduled tasks. **Resolving an item WRITES A RULE**, so the same question is never asked twice — that is the load-bearing half, not the UI. | PRD / build | 2026-07-31 | **BRIEFED — ready for an agent.** 5 phases, rules store before UI. 5 open questions for Jason before Phase 4 (they don't block 1–3) | `CTO-DECISION-02-review-queue-PRD.md` → **`BUILD-BRIEF-02-review-queue.md`** |
| 01 | **Ticketed gigs vs the grassroots promise** — ticketed and grassroots are two different axes and bndy conflates them. | Decision | 2026-07-31 | **PARTIALLY SETTLED.** Q1 + Q4 closed by Decision 03. **Q2 (`venueTier` field) and Q3 (default filter definition) remain OPEN.** | `CTO-DECISION-01-ticketed-vs-grassroots.md` |

## Related standing docs (not decisions — reference)

- **`10-Projects/bndy-population/RUNBOOK.md` v2.3a — THE authoritative rules for every import.** Amended only by Jason.
- `10-Projects/bndy-population/SCHEDULED-TASK-PROMPTS-v2.md` — the five thin §6A task prompts. **Jason pastes these into the desktop app; nobody else can.**
- `10-Projects/bndy-population/ENRICHMENT-TASK-v3.md` — the nightly enrichment spec (not scheduled; first run must be supervised).
  ⚠ **The `Projects/bndy/MASTER-IMPORT-RUNBOOK.md` copy is TOMBSTONED as of 2026-07-31.** Do not read it, do not edit it.
- `10-Projects/bndy-population/OPEN-RULINGS.md` — the live rulings register.
- `LEMONROCK-BASELINE-PLAN.md` v1.1 · `LEMONROCK-TASK-v1.md` · `LEMONROCK-RUN-LEDGER-2026-07-31.md` + `lemonrock-torbay-ids.json`.
- ⚠ `BNDY-RECOVERY-TRACKER.md` is **STALE** (last updated 2026-07-28). Its phase table and re-enable checklist no longer describe reality. Do not cite it as current state.

## Known defects logged, not yet fixed

| Defect | Impact | Where |
|---|---|---|
| ~~`create_artist` review + `verifiedSourceName` disputed~~ | **RESOLVED 2026-07-31 — both ARE fixed** (`resolveTo`/`confirmNew`/`verifiedSourceName` live in the schema). All four blocked acts now exist. §6B was the stale side | tested live |
| Lemonrock gig feed is a rolling 3-month window; §5.7 removed-row logic would read window slide as cancellation | **Blocks scheduling the Lemonrock task** — would delete real future gigs on first run | `LEMONROCK-TASK-v1.md` |
| `externalIds: []` on the onthecase, gigs-news and (as sha1, not slugs) insangel event cohorts | §5.7(b) lookup impossible → cancellation detection does not work for those sources. ⚠ Constrained: `edit_event(externalIds)` dedupes to ONE id per source, so a record holding a numeric id cannot also hold a slug | Runbook §6C; three back-fill jobs in OPEN-RULINGS |
| `device_stage_files` will not refresh an already-staged file | Subagents silently read stale rules | Runbook §6 / §6B |
| `create_artist` has no `actType` field — requires an `edit_artist` follow-up | Doubles artist write cost | Runbook §2A.2 |
| Ticket prices unknown for The Hairy Dog and The Flowerpot; Flowerpot ticket URL unknown | `standardTicketInformation` left empty rather than guessed (§0.18). Flowerpot correctly shows no banner until its URL is supplied | `BUILD-BRIEF-03` |

## Resolved 2026-07-31 (evening CTO session)

| Was | Outcome |
|---|---|
| ⚠ **TWO RUNBOOKS HAD DIVERGED** — v1.12 in Projects/bndy vs v2.2 in the vault, neither a superset | **RESOLVED.** Jason ruled the vault canonical; merged to **v2.3** with all five unique v1.12 clauses carried across; old path tombstoned |
| **Root cause of July's failures — the fork had SPLIT THE SNAPSHOT STATE DIRECTORY.** Supervised sessions wrote snapshots to `Projects\bndy\<source>-last-page.txt`; scheduled tasks read `data\state\<slug>-last-page.txt` | **RESOLVED.** v2.3 §6A declares ONE state directory, adds a fail-closed snapshot-write gate binding on supervised sessions too, and adds a runbook version floor so a stale rulebook fails closed instead of regressing silently. This is what caused gigs-news to bounce 50/54, KLMA to see 25 phantom rows, and onthecase to hold |
| `edit_event(externalIds)` documented as append-only | **CORRECTED.** It REPLACES and dedupes to **one id per source** — verified live. Constrains all three slug back-fill jobs: a record holding a numeric source id cannot also hold a slug for that source |
| `search_event` under-reports `externalIds` | **WIDENED.** Two false-negative modes — it also returns "no events" for `artistId` without a date range, which nearly caused an orphaning delete. Never trust a negative result before a destructive call |
| Four live duplicate records (Golden Lion venue, Phoenix/Pheonix Park artist, duplicate Hybrids events, "Unknown Venue") | **MERGED AND VERIFIED.** The "Unknown Venue" turned out to be a dangling venue pointer, not a record |
| 30 open rulings | **Down to 4 awaiting Jason**, none blocking. 14 were closed against rules that already existed |
| **Three backend blockers, status disputed** | **RESOLVED — all three ARE fixed.** `resolveTo`/`confirmNew`/`verifiedSourceName` are live. All four blocked acts exist; NU CALL's event topped up with provenance, ticketed flag, price and ticket URL |
| onthecase held for days on a 14-day-window snapshot | **RESOLVED.** Full 273-row feed promoted to `data/state/onthecasemusic-last-page.txt` per Jason's ruling. Source runs normally from tonight |
| Region normalisation (item 05) | **WITHDRAWN.** Premises tested and false — see row 05 above |
