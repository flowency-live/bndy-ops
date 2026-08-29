# bndy Backline - CTO audit, 29 August 2026

Scope: progress, status, technical excellence, cost base, remaining work. Evidence: bndy-enrichment @ HEAD 937db16 (29 Aug 18:20Z), bndy-website workboard @ 18:28Z, BACKLINE-TRUST-LAYER-TECHNICAL-STATUS-2026-08-29.md, ops/docs artefacts, full codebase review (327 tests run green in 17s), CDK stack cost read.

## 1. Verdict

Backline is real, disciplined and cheap. In four days it went from a stalled bootstrap to: national Lemonrock corpus complete and gated, four source families in shadow BAU, a Trust Loop with hard money/write gates, and the first provably citation-grounded enrichment result. The engineering culture visible in the code - fail closed, evidence first, budgets in a transaction, zero canonical writes anywhere - matches the paper architecture unusually well. The open risks are operational (no alarms, one legacy write path still armed), not architectural. The enrichment provider is one reviewed cohort away from qualification.

## 2. Progress and status - CONFIRMED positions

| Area | Position | Evidence |
|---|---|---|
| Lemonrock bootstrap | COMPLETE and gate-passed: run-907eba4a, 28,504/28,504 tasks, 0 failed, queues+DLQ 0. Artists 10,587 observed vs 10,533 advertised; venues 8,341 vs 8,287; future gigs 7,787 vs 7,861 with the 74-gap closed as terminal-gone evidence | ops/lemonrock-reconciliation-manifest.json, 27 Aug 22:44Z |
| Lemonrock BAU | Deployed + verified: hourly new-gigs/cancellations, daily 02:10 health, monthly day-1 reconcile, gig-triggered hydration, no scheduled directory crawls (~1,471 root runs/30d) | ops/lemonrock-low-cost-operating-status.json; stack lines 294-334; heartbeat green 29 Aug 18:18Z |
| On The Case | Gig-led reconciliation complete (145/145, 0 failed), hourly BAU rule live, shadow | ops/onthecase-reconciliation-manifest.json |
| KLMA | Healthy daily shadow BAU, 2,771 claims 28 Aug; writer cutover deliberately deferred (Cowork remains writer) | ops/klma-shadow-bau-manifest.json |
| GigsNews | Enabled weekly shadow; WEAKEST activation evidence - lastRunAt was null in the 28 Aug readiness snapshot. Verify first weekly run happened | seed-wave1-sources.ts; ops/trust-loop-v1-readiness.json |
| Scenic Eye / Insangel / Norfolk | Merged-disabled / recon-gated / doc-only respectively - correctly parked | seed lines 76-92; docs |
| Trust Loop v1 | Active: 40/40 candidates classified, all unresolved, artist hard gate closed pending reviewed known-answer set | ops/trust-loop-v1-manifest.json |
| Enrichment qualification | Five failed-closed attempts (total spend <$0.70, every bad fact quarantined), then PR #114 evidence-first Interactions adapter passed the single-case proof: Whittles Oldham, 5 admitted facts, 6 provider citations, $0.0296 vs $0.05 reserved, zero writes | ops/enrichment/*, commit 937db16 |
| Everything | shadow=true, canonicalWrites=0 across all sources and runs | every manifest |

Status-doc accuracy check: honest overall. Two overstatements to correct on the workboard: "Whittles proof passed" is technically true but the artefact is reviewStatus=unreviewed (human sign-off pending), and GigsNews "activated" lacks a first-run timestamp. Note also the doc references PR #116 (citation-range hardening); no #116 merge exists on main at HEAD - it is correctly awaiting your approval.

## 3. Technical excellence - scorecard

| Dimension | Score | Note |
|---|---|---|
| Architecture cohesion | 4/5 | Pipeline implements the documented model end to end (runner.ts:214-307 -> engine.ts:266-478). Deduction: legacy GoogleDiscoveryWorker still holds direct write grants to bndy-artists/venues outside the claims model; prototype modules (hybrid, facebook, serpapi) un-pruned |
| Tests | 4/5 | 327 tests / 52 files, green in 17s, failure-path-dominant (tombstones, authority refusal, fail-closed grounding, SSRF hops, budget exhaustion, replay caps). Deduction: all unit-level fakes - no integration proof of DynamoDB conditional writes or S3 IfNoneMatch |
| Fail-closed discipline | 4/5 | Budgets reserved transactionally before any provider call; per-item $0.03 / daily $0.60 caps hardcoded; identity <0.98 parks; read-back verification throws to force retry. Edges: projection exceptions marked success without retry (engine.ts:198); one swallowed catch in dead code |
| Code hygiene | 3/5 | Dead maybeReinstate; 3 parallel Gemini clients with 34 any-typed parses; enum lists duplicated; silent 1000-claim truncation (engine.ts:85); admin API has open Function URL + CORS * + one cached service token |
| ADR adherence | 4.5/5 | ADR-106 implemented to the letter incl. exact budgets; ADR-108 exact; ADR-109 one undocumented drift (venue-owned granted owner-mutation - tested deliberately, ADR not updated) |

Top risks, ranked: (1) legacy discovery worker's live canonical write grants; (2) zero CloudWatch alarms on 6 DLQs/exception sink - fail-closed silently becomes fail-stalled; (3) no integration tests on the storage invariants everything rests on; (4) projection exceptions unretried; (5) ADR-109 drift. Quick wins list is in section 6.

## 4. Cost base - PASSES the low-running-cost mandate

Steady-state monthly estimate (eu-west-2, shadow BAU as deployed):

| Item | Est/month | Notes |
|---|---|---|
| DynamoDB on-demand writes+reads | $2-6 | BAU write volume low; monthly reconcile burst ~28.5k tasks. Multiplier: 3 GSIs at ProjectionType.ALL amplify every claim write ~4x |
| DynamoDB storage + PITR | $1-3 | Corpus ~600k items and growing; PITR ~$0.22/GB |
| Lambda (15 fns, incl. 5-min capture scan, hourly ticks) | $1-3 | Largely in free tier; 3GB browser worker rarely invoked |
| S3 evidence + SQS + EventBridge | $1-2 | ~100k immutable objects, small |
| CloudWatch logs | $1-5 | RISK: no logRetention set on most functions - never-expire log groups are the classic slow leak |
| Secrets Manager | ~$1 | 2-3 secrets |
| Gemini enrichment | hard-capped $18 | $0.60/day transactional cap; actual spend to date <$1.50 total |
| **Total AWS** | **~$8-20** | Gemini cap on top only when enrichment activates |

Structural cost watch-items (growth, not today): the three ALL-projection GSIs on the claims-heavy StateTable (biggest lever - move to KEYS_ONLY/INCLUDE where read models allow); hourly heartbeat + manifest jobs doing full-table scans as the corpus grows (already partly addressed by "Serialise Lemonrock manifest scans"); unset log retention.

## 5. Remaining work - CTO-ordered plan

The status doc's ordering is right. My execution plan against it:

1. **Approve + merge PR #116** (citation endpoint binding, no provider call). DECISION NEEDED: yours. My review recommendation: approve - the cumulative-citation leak it fixes is exactly the class of evidence error Backline exists to prevent, and the suite is green.
2. **Redirect-destination preservation** (safe resolution of Google grounding URLs: HTTPS-only, hop/timeout limits, SSRF-safe, immutable dual retention, fail closed). Implementable + unit-testable now with zero provider spend. The SSRF-guarded acquisition code and its tests already exist to build on. I will draft this.
3. **Qualification contract doc** for the 20-case cohort (fact-to-citation mapping, abstention quality, zero-false-match hard gate, >=80% knowable-predicate coverage). I will draft this.
4. **20-case qualification run** - DECISION NEEDED: authorise case count 20, one call/case, <=2 searches/case, reserve $1.50 (headroom over the $0.60 nominal given observed search autonomy and the earlier $0.66 run), zero writes.
5. Human adjudication -> Godmode publication -> qualification decision -> shadow BAU commissioning -> much later, controlled projection. Each behind its own gate as documented.

Parallel hygiene sprint (cheap, high value): DLQ + exception alarms (~40 lines CDK); revoke legacy discovery worker write grants; set logRetention on all functions; update ADR-109; delete dead code; extract shared enums; zod the Gemini parsers; throw on 1000-claim truncation; lock down the admin Function URL. Also: verify GigsNews first weekly run; correct the two workboard overstatements.

## 6. Constraints on my execution right now

Repo write from this session is still proxy-blocked and the desktop bridge is offline, so items 2, 3 and the hygiene sprint land from me as ready-to-apply patches/branch bundles plus exact commit messages until write access exists. Decisions 1 and 4 are yours; nothing in this plan spends money or writes canonically without your explicit approval, per the trust boundaries.

## 7. Progress addendum - 29 Aug evening

Both approvals executed. PR 116 merged to main (ceb9f1b) and verified: 340 tests green on the merged tree. Remaining-work item 2 (safe citation-destination resolution) implemented, tested and pushed (c4a44f8). Item 3 delivered: the 20-case qualification contract, a budget-controlled cohort runner ($1.50 total / $0.05 per-case reservation, hard stop, unmeasured cases charged in full) and the recorded approval artefact are on main (54d0fb7, 8579a66). The dispatch-gated capture workflow is written and blocked only by the access token lacking workflow scope; once granted, the capture runs, then human adjudication decides qualified/failed. Workboard updated to match. Cost position unchanged: capture reserves $1.50 once.
