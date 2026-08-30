# BNDY Backline recovery checkpoint

Status: authoritative pause and resume checkpoint

Recorded: 2026-08-30T16:49:23Z

Owner: Backline Owner

Purpose: preserve the exact state of Backline while the wider BNDY infrastructure repair is completed. This document is a recovery boundary, not authority to deploy, hydrate, schedule, enable a provider or write canonically.

## 1. Executive position

Backline does not need to be restarted.

The important application and data-plane work survived in the remote repositories. The safe route is a controlled forward integration from the rescued repository heads. The unpublished reliability patch and the production deployment plan must be rebuilt after infrastructure ownership is settled.

At this checkpoint:

- canonical writes are not authorised;
- no Backline deployment should run during the infrastructure repair;
- the current production runtime cannot be certified from repository state alone;
- the latest committed AWS audit predates the rescue and the main Backline safety, cadence and hydration merges;
- every active source must eventually have one authoritative daily-or-faster coverage path;
- the canonical 24 August baseline is stale and requires a controlled catch-up hydration;
- the Gemini provider remains inactive, unscheduled and unqualified;
- the workboard and earlier CTO audit are historical evidence, not current operational truth.

## 2. Product and trust boundary

The target remains an evidence graph:

- immutable evidence and Observations;
- atomic provenance-bearing Claims;
- explicit identity candidates, Resolutions and conflicts;
- bounded graph/read projections;
- canonical BNDY APIs as the only product write authority;
- Backline projection as policy-controlled materialisation, never a second canonical database.

AI may propose evidence and reasoning. Deterministic code must validate, persist, resolve, limit spend and prevent unsafe mutation.

Canonical hydration and canonical projection are separate operations. Ingesting canonical changes into Backline must not enable Backline writes into canonical BNDY.

## 3. Audit boundary

The 30 August recovery audit inspected fresh remote repository heads and committed operational artefacts. It made no commits, pushes, workflow dispatches, AWS calls, deployments, schedule changes or data writes.

The audit environment did not have AWS CLI/runtime access. Current production therefore remains unverified until a fresh read-only AWS inventory is completed after the infrastructure repair.

## 4. Repository heads inspected

| Repository | Branch/head | Backline responsibility | Checkpoint position |
| --- | --- | --- | --- |
| `bndy-enrichment` | `main` at `39bae4fcbbe86a27b8e936225c94331cbb343d1c` | Backline stores, source runtime, Trust Loop, graph, projection, Capture processing | Primary Backline code authority |
| `bndy-serverless-api` | `master` at `ca641b99ea0c2941daacccc9172c6a0cfc14df3b` | Canonical API, Claim V2 table/stream, join and entity APIs | Canonical API authority; current head postdates the last Backline live audit |
| `bndy-signals` | `main` at `db85ecd7ee05f13bdf8816c4a8652d804168ff47` | Legacy source runners and intelligence pass | Unsafe redeploy baseline; fail-closed PR remains open |
| `bndy-capture` | `main` at `7693e169cc77a903eea233e4ee64f25d547c7c26` | Capture API, table, image bucket and WhatsApp transport | Transport authority, not interpretation authority |
| `bndy-MCP` | `main` at `5bedc487fc70241d168821021ebf53a69fb482b7` | Authenticated direct canonical adapter | Canonical ingress that hydration must observe |
| `bndy-app` | `main` at `1eeaa2d2946e2b7215056c0b7afc822b18e19f61` | Join, Claim and owner-facing product flows | Client of canonical API; not a direct Backline writer |
| `bndy-backstage` | `main` at `02d8d43c1a63a4a103c827aa53d32a089e3084f5` | Godmode and Backline Explorer | Visual operator surface survives; live release unverified |
| `bndy-website` | `main` at `a2d3a5899480aa88c8e95532bc76baf9eee69d09` | Public workboard and Backline explanation | Backline lane is stale and must be corrected after recovery |
| `bndy-ops` | pre-checkpoint `main` at `0bdc0f0b79c7a48a355621e303a0c0798ecb8f66` | Cowork evidence, audits, decisions and run contract | Shared operational record |
| `bndy-infrastructure` | `master` at `bcb0e263c640d8944e075e1e0d109080d8181d11` | Historical infrastructure/migration material | Stale since 2025; not an active IaC authority |

## 5. Backline code that survived

The following merged changes are ancestors of current `bndy-enrichment/main`. They do not need cherry-picking or recreation.

### PR 117: global canonical-write safety gate

Merge commit: `878908d`

Surviving behaviour:

- dynamic global control at `CONTROL#PROJECTION / GLOBAL`;
- a missing or false control value defaults to canonical projection off;
- failure to read the control fails retryably rather than writing;
- disabled projection records a would-write shadow outcome;
- action and predicate allowlists are explicit;
- Google discovery direct Artist/Venue mutation permissions and calls were removed;
- Claim truncation and projection retry behaviour were hardened.

This merge did not create or enable the global control row and did not deploy itself.

### PR 118: sanitised live-audit repair

Merge commit: `01bb84f`

The audit tooling was repaired and a newer sanitised audit was captured. Its permissions remained insufficient to read Lambda configuration and CloudWatch alarms.

### PR 119: daily source coverage and freshness

Merge commit: `198b1fa`

Surviving behaviour:

- every enabled source family must have a daily-or-faster coverage root;
- 26-hour maximum staleness with operational grace;
- unified source catalogue;
- GigsNews daily coverage configuration;
- ScenicEye daily lightweight coverage configuration;
- hourly source-health evaluation and CloudWatch alarm;
- explicit separation of coverage roots, child hydration and repair reconciliation.

Status remains code-ready, not proven deployed or seeded.

Insangel correctly remains disabled because its acquisition path is not qualified.

### PR 120: guarded canonical-change ingestion and delta hydration

Merge commit: `1f9d01f`

Surviving behaviour:

- read-only ingestion of inserts, updates and removals from canonical Artists, Venues and Events;
- immutable evidence, Observations, Claims, Resolutions and sync checkpoints;
- canonical-origin Claims are shadow-only and cannot feed back into projection;
- delta hydration compares current canonical records with baseline Claims/checkpoints;
- unchanged records receive small checkpoints instead of duplicate Claim sets;
- removals are recorded without fabricating source deletion evidence;
- optional CDK event mappings are guarded by `canonicalChangeStreamsEnabled`, default false;
- stream mappings use partial-batch failure reporting and DLQs when eventually enabled.

None of the following is proven active:

- canonical table streams;
- SSM canonical stream ARN parameters;
- deployment with `canonicalChangeStreamsEnabled=true`;
- canonical-change source activation;
- delta hydration;
- production acceptance of insert, update or removal handling.

### PR 121: Send to bndy reliability

Merge commit: `93069c7`

This later merge did not overwrite PRs 117 to 120. It does mean that a future all-stack enrichment deployment would include newer Capture processing code as well as the Backline changes. It must not be deployed without an exact change-set review against the rescued runtime.

## 6. Work that did not survive remotely

The local reliability/observability patch was never pushed and no remote `backline/reliability-observability` branch exists.

The lost patch included:

- explicit 30-day log groups;
- approximately 24 Lambda error, DLQ-depth and queue-age alarms;
- reserved concurrency for paid, browser and projection workloads;
- stack reliability tests;
- production reliability gate documentation.

Decision: do not attempt to recover this from memory as a patch against the old tree. Reimplement its intent from the rescued `bndy-enrichment/main` only after the IaC ownership ledger and CloudFormation diff are agreed.

## 7. Latest committed production evidence

Artefact: `bndy-enrichment/ops/backline-sanitised-live-audit.json`

Captured: `2026-08-29T21:50:30.709596Z`

SHA-256: `d3eb39c381c579fe3c8a6b84ca9245d7b94b1cb162bb1dee72b7e314c4421d1a`

Important limitation: this audit predates the infrastructure rescue and predates any possible deployment of PRs 117 to 120.

It recorded:

- AWS account `771551874768`, region `eu-west-2`;
- `BndyEnrichmentStack` at `UPDATE_COMPLETE`;
- stack last updated at `2026-08-29T16:59:00.573Z`;
- 11 Lambda functions, 13 SQS queues and 8 EventBridge rules;
- all active queues and DLQs empty;
- 6,048 messages retained in the non-consuming historical failure quarantine;
- 1,022,223 evidence objects totalling approximately 25.37 GB;
- 2,971,588 Backline state-table items;
- newest evidence activity at `2026-08-29T22:16:24Z`;
- canonical baseline completed on 24 August with 15,288 entities/Observations, 518,131 Claims, 15,288 Resolutions and 15,288 evidence objects;
- baseline manifest `canonicalWritesEnabled:false`;
- Lemonrock retained task history containing 45,536 completed and 4,017 failed current task records across a larger multi-run history;
- 6,048 quarantined superseded delivery copies.

The audit could not read any of the 11 Lambda configurations and could not describe CloudWatch alarms. It therefore did not prove:

- deployed Lambda commit or code hash;
- concurrency limits;
- log retention;
- alarm presence or state;
- current global projection control;
- post-rescue runtime state.

The Lemonrock terminal bootstrap manifest and the wider retained task-state audit use different scopes. The workboard's zero-failure bootstrap statement must not be compared directly with the 4,017 historical/current failed task records without a fresh reconciled run-level audit.

## 8. Source scheduling and Cowork boundary

Owner requirement: every enabled source family must complete a coverage acquisition or unchanged-source heartbeat every 24 hours or faster.

The last code-ready target is:

| Source | Target Backline coverage | Checkpoint status |
| --- | --- | --- |
| Lemonrock | hourly new gigs and cancellations, daily health, monthly repair reconciliation | Previously live shadow; post-rescue state unverified |
| On The Case | hourly gig root | Previously live shadow; post-rescue state unverified |
| KLMA | daily registry root | Code-ready; writer ownership with Cowork not reconciled |
| GigsNews | daily registry root | PR 119 changes weekly to daily; deployment and first heartbeat unproven |
| ScenicEye | daily lightweight registry root | PR 119 changes manual/weekly ambiguity; deployment unproven |
| Insangel | disabled | Correct until acquisition is qualified |
| Norfolk Gig Guide | reconnaissance only | Disabled |

Historical `bndy-ops/cto/BNDY-RECOVERY-TRACKER.md` records that five Cowork tasks were once live daily: Insangel, KLMA, GigsNews, ScenicEye and On The Case. That document is explicitly superseded and does not prove current Cowork scheduler state.

Before any source cutover or retirement, obtain a fresh Cowork scheduled-task export and compare:

- task name and generation;
- enabled/disabled state;
- cadence;
- last successful run;
- canonical writer capability;
- matching Backline source and schedule;
- final chosen writer authority.

The target is one authoritative acquisition path per active source, not duplicate Cowork, Signals and Backline runners.

## 9. Legacy Signals risk

`bndy-signals/main` remains a dangerous redeploy baseline:

- KLMA, On The Case, GigsNews and ScenicEye schedules are enabled in production CDK;
- their Lambda handlers use `dryRun:false`;
- the intelligence pass uses `DRY_RUN:false` in production;
- the S3 intelligence trigger is enabled;
- the runners can call canonical BNDY find-or-create/write APIs.

Open PR 1 at `flowency-live/bndy-signals` is the surviving fail-closed remediation. Its head is `7e1456d090d841c4cb8410799c097af215397b4b`.

It:

- disables all four legacy source schedules;
- disables the intelligence S3 trigger;
- forces the intelligence pass into dry-run;
- sets `LEGACY_SOURCE_WRITES_ENABLED=false`;
- makes manual legacy Lambda invocations default to dry-run;
- removes the unsafe artist community fallback;
- corrects the BNDY API environment lookup.

Decision: peer-review and merge the PR after the infrastructure repair, but do not treat merge as deployment authority. Verify the live Signals stacks separately before any deployment.

## 10. Qualification round 1: exact record

Artefact: `bndy-enrichment/ops/enrichment/gemini-interactions-evidence-first-20-case-unreviewed.json`

Captured: `2026-08-29T20:22:36.606Z`

SHA-256: `48f2ae72afa6d39095f600e537e9036665d1acdf17bef0077e9d1e23a2e92446`

The committed artefact records:

- 20 cases attempted;
- 12 cases captured;
- 9 captured cases with admitted facts;
- 3 captured safe abstentions with zero admitted facts;
- 8 error cases;
- 6 errors because Gemini used four searches against the approved one-to-two-search contract;
- 2 errors because the plain-text FACT line was invalid;
- 20 model calls and 52 searches observed;
- 50 admitted facts in the unreviewed qualification artefact;
- 86 provider citations overall;
- estimated cost `$0.758573` against a `$1.50` reserved maximum;
- zero canonical writes;
- no schedule created;
- provider inactive;
- review status `unreviewed`.

Precise interpretation:

- the eight cases were fail-closed errors, not successful self-refusals;
- "12 captured" does not mean 12 fact-bearing cases;
- admitted into the unreviewed artefact does not mean trusted or production-accepted;
- the four artist identities at 0.92 to 0.95 remain below the 0.98 automatic identity threshold;
- five fact-bearing Venue identities were 0.98 to 0.99;
- three cases safely abstained;
- the provider is not qualified.

Do not simply raise the search allowance to four. First adjudicate the nine fact-bearing cases, then decide whether four-search autonomy is acceptable as a new cost and qualification contract. A rerun requires a newly recorded approval and remains shadow-only.

## 11. IaC ownership collision

| Resource domain | Intended authority | Collision or uncertainty |
| --- | --- | --- |
| Backline StateTable, EvidenceBucket, queues, workers and schedules | `bndy-enrichment` CDK, `BndyEnrichmentStack` | Current workflow deploys the whole stack |
| `bndy-capture-processor` and `bndy-capture-scan` | `bndy-enrichment` CDK | `bndy-serverless-api` retains workflows able to hot-deploy the processor |
| Capture API, capture table, image bucket and WhatsApp transport | `bndy-capture` SAM, stack `bndy-capture` | Separate boundary appears sound |
| Canonical API and `bndy-entity-claims` | `bndy-serverless-api` SAM, stack `bndy-serverless-api` | Claims stream is correctly exported through `/bndy/claims/stream-arn` |
| `bndy-artists`, `bndy-venues`, `bndy-events` | No clear active IaC owner found | Stream enablement requires an explicit owner and surgical change set |
| Legacy source and intelligence stacks | `bndy-signals` CDK | Still armed on main; PR 1 not merged/deployed |
| Historical infrastructure | `bndy-infrastructure` | Must not be used as deployment authority |

The primary cross-stack hazard is not that SAM currently defines the enrichment Capture processor. It does not. The hazard is that serverless API workflows can mutate the CDK-owned Lambda directly with `aws lambda update-function-code`.

The main `bndy-serverless-api` deployment is now manually gated by workflow dispatch, exact `deploy` confirmation and `BNDY_SERVERLESS_DEPLOY_ENABLED=true`. Its embedded Capture acceptance job is frozen with `if: false`.

Two standalone path-triggered workflows remain capable of hot-deploying `bndy-capture-processor`:

- `.github/workflows/capture-acceptance-hotdeploy.yml`;
- `.github/workflows/capture-unknown-admission-acceptance.yml`.

They must be retired or permanently gated before enrichment CDK can be treated as the sole processor release authority.

## 12. Operator and visual intelligence state

Surviving components:

- bounded one-hop evidence graph reader;
- Backline admin API;
- static Backline Explorer;
- Backstage Godmode Backline Explorer for sources, Trust Loop, qualification and Claim state;
- read-only Claim review and authority surfaces.

Unproven or incomplete:

- current Backstage production release after the rescue;
- secure, coherent graph navigation in Godmode;
- consistent conflict and Resolution population;
- truthful side-by-side display of configured cadence, effective schedule, last success and next due;
- global canonical-write state shown prominently;
- clear separation of evidence, inferred Claim, accepted truth and would-write decision;
- current workboard status.

The desired rich view should be built on the existing graph reader and Backstage surface, not a new graph database. The evidence/Claim store remains authoritative; any future Neptune or graph engine remains a projection/index.

## 13. Workboard and audit truth

Existing shared audit:

`bndy-ops/cto/BACKLINE-OWNER-AUDIT-AND-ACTION-PLAN-2026-08-29.md`

It remains useful historical analysis but freezes evidence before PRs 117 to 120 and before the infrastructure rescue.

The Backline lane in `bndy-website/public/workboard.json` is stale. Examples:

- it marks health green without post-rescue production proof;
- it says the qualification workflow is waiting to run although the run completed;
- it contains older wording that PR 116 awaits merge although it was merged;
- it describes GigsNews weekly despite the owner's daily-or-faster rule and PR 119;
- it mixes terminal Lemonrock run results with wider retained task state without explaining scope.

Decision: do not update the workboard until the fresh AWS and Cowork inventories are reconciled. Then replace, rather than append to, the stale current-state wording.

## 14. Integrate, rebuild and freeze decisions

### Preserve and integrate

- Backline knowledge model and stores;
- PRs 117 to 120;
- Claim V2 stream authority ingestion;
- canonical delta hydration implementation;
- source freshness implementation;
- graph reader and Backstage Explorer;
- qualification evidence, strict citation boundary and budget controls;
- app, Capture and MCP ingress paths.

### Rebuild from rescued main

- reliability and observability changes;
- deployment sequence and change-set controls;
- infrastructure ownership ledger;
- current-state audit and workboard report;
- provider qualification decision after adjudication.

### Freeze or retire before deployment

- legacy Signals canonical writers and intelligence auto-apply;
- serverless API Capture hot-deploy workflows;
- duplicate Cowork writers after source-specific parity and ownership transfer;
- any workflow that deploys an entire stack merely to run an acceptance test.

## 15. Resume entry conditions

Do not resume implementation or deployment until the infrastructure owner supplies a stable post-repair boundary and the following read-only work is complete.

1. Fresh CloudFormation stack inventory and status.
2. Stack drift status for the enrichment, serverless API, Capture and Signals stacks.
3. Lambda function names, code hashes, runtimes, aliases, environment shape and event mappings.
4. EventBridge and other scheduler inventory, including enabled state and targets.
5. DynamoDB table ownership, stream state and stream view type.
6. SSM stream ARN parameters.
7. SQS queue/DLQ counts, age and redrive configuration.
8. CloudWatch alarms and log retention.
9. Fresh Cowork scheduled-task export.
10. Exact CDK and SAM synth/diff reports against live state, with every proposed mutation assigned to an owner.

## 16. Controlled forward plan after the infrastructure fix

1. Reconcile live resources to repository commits and declare one owner per resource.
2. Close the Capture hot-deploy bypasses.
3. Peer-review and merge Signals PR 1 without automatically deploying it.
4. Produce a bounded first enrichment change set with canonical streams disabled.
5. Deploy and prove the global projection gate, source-health worker and daily source catalogue.
6. Observe one successful daily-or-faster heartbeat for every enabled source and reconcile Cowork ownership.
7. Rebuild and deploy log retention, alarms and concurrency controls from current main.
8. Refresh the Backstage visual intelligence surface and publish truthful current state.
9. Behind a separate HITL gate, enable canonical streams and SSM parameters, run delta hydration, activate change sources and prove one insert/update/removal with zero projection calls.
10. Adjudicate the qualification artefact and decide whether to revise and rerun the provider contract.
11. Only after shadow stability and a full would-write review, request separate approval for a bounded additive canonical projection pilot.

## 17. HITL gates preserved

The following remain explicit human decisions:

- executing any production CloudFormation change set;
- enabling canonical DynamoDB streams;
- running production delta hydration because it writes Backline evidence and Claims;
- activating a paid enrichment provider or schedule;
- changing the approved provider search/cost contract;
- retiring a Cowork canonical writer;
- enabling the global canonical projection control;
- any canonical-write pilot.

Canonical projection must not be enabled as part of source scheduling, hydration, provider qualification or observability work.

## 18. Completion state this plan targets

Completion of the recovery plan produces:

- a production-safe and observable Backline shadow layer;
- one IaC owner per resource;
- one authoritative writer/acquisition path per source;
- daily-or-faster source coverage with freshness alarms;
- continuously hydrated canonical facts represented as immutable evidence and Claims;
- a truthful, visually rich Godmode evidence graph and operational view;
- reviewed provider evidence and explicit qualification status;
- canonical writes still disabled until their own final gate.

## 19. Peer-review handoff

Any agent resuming Backline must begin with this document and then validate it against:

1. the final infrastructure incident report;
2. a fresh post-repair AWS read-only audit;
3. current remote repository heads;
4. the fresh Cowork scheduled-task export;
5. current open PR and CI state.

If any evidence differs, update this checkpoint by recording the previous value, new value, evidence source and decision. Do not silently overwrite history or infer production state from code state.

