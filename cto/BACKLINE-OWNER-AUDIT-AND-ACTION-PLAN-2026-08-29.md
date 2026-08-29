# bndy Backline - single owner audit and action plan

**Version:** 1.0  
**Status:** Authoritative working audit for Codex and Claude peer review  
**Evidence freeze:** 2026-08-29T20:44:36Z  
**Prepared by:** Backline Owner, independent read-only review  
**Product owner:** Jason  
**Canonical-write authority:** Not granted  

This document consolidates:

- the original Claude CTO audit;
- Claude's evening consolidated audit and self-review;
- the independent full repository audit;
- the independent review of the committed 20-case Gemini trial;
- the source scheduling, Cowork, hydration, production-safety and intelligence-layer findings that previously existed only in chat.

It is intended to be the single shared audit until a newer version explicitly supersedes it. Earlier audit copies should be treated as source material, not current authority.

No repository, AWS, Cowork scheduler, provider, database or canonical-data change was made in producing this audit.

---

## 1. Executive verdict

Backline is a real and credible evidence pipeline operating in production shadow. Its strongest parts are the national Lemonrock bootstrap, durable evidence and Claim model, low-cost serverless design, source-native identities, fail-closed data handling and bounded graph reader.

It is not yet safe to enable general canonical projection.

| Decision area | Verdict |
| --- | --- |
| Shadow evidence ingestion | **AMBER-GREEN** - credible and useful, with source-specific gaps |
| National Lemonrock bootstrap | **GREEN** - completed and controlled |
| Continuous bndy canonical hydration | **RED** - no comprehensive ongoing ingestion path |
| Source scheduling | **RED** - GigsNews is weekly, ScenicEye is not active daily, and configuration ownership is split |
| Canonical-write control | **RED** - no owner-level global kill switch and several direct write paths remain |
| Cowork and AWS writer ownership | **RED** - overlaps and live-state uncertainty remain |
| Enrichment provider | **RED** - unqualified; the latest execution contract failed |
| Observability and recovery | **RED** - alarms, retry semantics and retention are insufficient |
| API release governance | **RED** - the mutation security gate fails but deployment can still proceed |
| Backstage operator UI | **AMBER** - useful tables exist, but deployment, type safety and graph integration are incomplete |
| Visual intelligence layer | **AMBER** - the graph reader and MapLibre foundation exist; the rich combined experience is not built |
| Cost | **AMBER-GREEN** - structurally low cost, but the estimate has not been reconciled to a real bill |

**Overall production position:** AMBER for continued shadow operation, RED for canonical-write promotion.

The latest Gemini run did make zero canonical writes. That is a successful safety outcome. It did not, however, complete inside every approved operating limit and it does not qualify the provider.

---

## 2. Authority, scope and evidence limits

### 2.1 Current authority

The Backline Owner is authorised to inspect and report. The Backline Owner is not currently authorised to:

- change or push repository content;
- deploy infrastructure or application code;
- alter AWS rules, mappings, queues, IAM or concurrency;
- alter Claude Cowork scheduled tasks;
- call external enrichment providers;
- hydrate production data;
- enable or exercise canonical projection;
- create, update or delete canonical bndy records.

Creating this audit is the only write authorised by the current request.

### 2.2 What is fresh

The relevant Git repositories were fetched and frozen at 2026-08-29T20:44:36Z. The 20-case trial artefact, its workflow, contract and approval record were inspected directly at the current `bndy-enrichment` head.

### 2.3 What is not independently fresh

No usable read-only AWS credentials or direct Claude Cowork scheduler export were available in this session. Therefore:

- current deployed resource state is inferred from CDK plus the latest committed production snapshots;
- the exact enabled/disabled state of legacy EventBridge rules is not independently verified;
- current Lambda code fingerprints and event-source mapping states are not independently verified;
- current SQS and DLQ depths outside committed snapshots are not independently verified;
- current CloudWatch errors, alarms and log retention are not independently verified;
- current Cowork task IDs, enabled states, last runs and writer behaviour are not independently verified.

This is a fresh code and evidence audit. It is not yet a fully fresh cloud-runtime audit.

### 2.4 Repository evidence freeze

| Repository | Frozen head | Relevant position |
| --- | --- | --- |
| `bndy-enrichment` | `42d1644d448483c8decce8dd4209f64a8f5951d4` | 20-case capture committed |
| `bndy-backstage` | `02d8d43c1a63a4a103c827aa53d32a089e3084f5` | Claim V2 review release source |
| `bndy-serverless-api` | `d42352f3c83edf671f4e7ca08f3b141f17d80dd8` | Current canonical API boundary |
| `bndy-website` | `58e651e3fba1bc79f8ffeb0199f84eb6dff43295` | Workboard current head; Backline lane still predates the trial result |
| `bndy-ops` | `8dad61a8ca1e11f573eb8818a829cee49a926c60` | Earlier CTO audit plus pre-run execution addendum |
| `bndy-app` | `7699824e8462c9945a79c93d8622bccab8a2f37f` | Current MapLibre product application |
| `bndy-signals` | `db85ecd7ee05f13bdf8816c4a8652d804168ff47` | Legacy source runtime with redeployment hazard |
| `bndy-capture` | `f829789b80bcea682d2668b0a7008e9ff12a43b4` | Capture transport and status API |
| `bndy-MCP` | `5bedc487fc70241d168821021ebf53a69fb482b7` | Direct canonical MCP adapter |
| `bndy-chatzone` | `c951f762b6c9cb8c1b3e4cc0a2b3a0f625ff8a56` | Capture/Dropzone client |

---

## 3. Peer review of Claude's consolidated audit

Claude's consolidated audit contains useful corrections and should not be discarded. It also retains several conclusions contradicted by the committed evidence.

### 3.1 Useful findings retained

The following are adopted into this audit:

1. **One canonical audit is necessary.** Multiple circulating versions are a governance defect.
2. **Durable findings must be separated from transient state.** Every time-sensitive statement needs an evidence timestamp and SHA.
3. **Test counts alone are noise.** The durable statement is that a named suite passed at a named SHA.
4. **Cost is modelled, not proven.** Actual billing must be reconciled before declaring a cost mandate passed.
5. **Hygiene was repeatedly deferred.** Alarms, legacy write grants, integration tests and retry defects must be scheduled as real work rather than repeated audit observations.
6. **GitHub Actions cost was considered.** The public repository means hosted Actions minutes are not currently an additional billed runtime cost.
7. **The provider shows search autonomy.** A requested query count cannot be described as a hard cap when the provider can exceed it inside a single model call.

### 3.2 Corrections required

| Claude consolidated claim | Corrected position |
| --- | --- |
| Citation transport is proven at cohort scale | Exact-segment provider citation binding worked for 50 fact lines, but public destination preservation required by the contract is absent from the artefact. Transport is partially proven, not complete. |
| Every budget held | False. Six cases exceeded the approved two-search limit and six exceeded the $0.05 per-case reserve. Only the $1.50 total reserve held. |
| The run cost about 76p | The artefact records **$0.758573**, not GBP. |
| Twelve cases captured usable evidence | Twelve bundles completed without an adapter exception, but only nine contained any fact lines. Three were zero-confidence, zero-fact abstentions. |
| Fifty facts were usable | Thirty-five fact lines belong to identities below the 0.98 acceptance threshold. Only fifteen sit on accepted-threshold identities; five of those are process markers. Only ten substantive facts are presently eligible for human checking. |
| Five venues and four artists showed correct identity behaviour | Confidence values were captured. Correctness is not established because the cohort has no expected-identity labels or known-answer adjudication. |
| Three abstentions were correct | Not proven. The input manifest contains no expected-park labels. |
| Coverage likely fails but the fix is four searches | Coverage cannot yet be computed against knowable answers. Raising the search allowance is one option, not an approved or proven fix. |
| Safety record is unbroken and canonical writes are zero everywhere | The trial itself wrote nothing canonically. The wider estate still contains Capture, Cowork, MCP and legacy/direct canonical write paths. Backline projection shadow does not mean the whole estate has zero canonical writers. |
| Safe destination resolution shipped, therefore trial destinations are preserved | Resolver code and tests exist, but the trial artefact contains no resolved destination fields and its evidence URLs remain provider redirects. |

### 3.3 Peer-review verdict on Claude's audit

Claude's audit is useful as source material and as a record of self-correction. It is not sufficiently precise to be the single operational audit. The action order in Part C also moves too quickly to a second paid run before repairing the truth set, evidence destination handling and fact semantics.

---

## 4. What Backline is and what is genuinely working

Backline is a capability spanning several repositories, not a new standalone application.

The strategic runtime is `bndy-enrichment`. `bndy-backstage` provides operator review and Godmode. `bndy-serverless-api` remains the canonical bndy write boundary. `bndy-website` carries programme status. `bndy-ops` carries Cowork task evidence. Capture, MCP and product applications are additional ingress and projection participants.

The intended model is:

1. source or human evidence is observed;
2. raw evidence is retained immutably;
3. evidence becomes atomic Claims;
4. source-native candidates retain their own identities;
5. resolutions connect candidates to canonical entities;
6. authority and conflict policy determine current belief;
7. an explicitly authorised projection may update canonical bndy through the canonical APIs;
8. the evidence history remains available to explain and rebuild the projection.

Strong, evidenced capabilities include:

- S3 immutable evidence storage;
- DynamoDB observations, Claims, source state, resolutions and tombstones;
- source-native artist, venue and event identities;
- bounded SQS/Lambda workers with conservative concurrency;
- claim-level authority and owner protection;
- shadow-mode would-write decisions;
- canonical API read-back in the projection design;
- low-cost DynamoDB/S3/SQS/Lambda architecture;
- a bounded one-hop evidence graph reader;
- completed national Lemonrock bootstrap controls;
- source-specific stale-edition and destructive-withdrawal protections;
- a daily Trust Loop classifier;
- privacy-separated Claim V2 authority assertions.

The design principle remains correct:

> AI may propose evidence and reasoning. Deterministic code validates, persists, resolves, limits spend and prevents unsafe mutation.

---

## 5. Current capability status

| Capability | Status | Evidence-backed finding |
| --- | --- | --- |
| Lemonrock national bootstrap | GREEN | 28,504 of 28,504 logical tasks completed, zero failures in the terminal manifest, active queues clear in the committed proof. |
| Lemonrock steady state | GREEN-AMBER | Hourly new-gig and cancellation roots plus daily health are defined. Direct live verification remains snapshot-based. |
| On The Case | GREEN-AMBER | 145 of 145 reconciliation tasks completed and an hourly root rule exists. Registry cadence still says manual and writer authority says Cowork. |
| KLMA | GREEN-AMBER | Daily live shadow evidence run proven with 2,771 Claims. Cowork remains canonical writer. |
| GigsNews | RED | Enabled weekly in Backline, not daily, and the latest readiness evidence has no successful first run. |
| ScenicEye | RED | Adapter exists but remains manual/disabled in Backline; Cowork documentation describes weekly operation. |
| Insangel | RED | Daily configuration exists but is disabled and acquisition remains unqualified. |
| Trust Loop | AMBER | Forty candidates classified, but all remained unresolved in the latest committed manifest. |
| Canonical bndy baseline | AMBER | 15,288 logical entities/observations, 518,131 Claims and 15,288 resolutions were captured on 24 August. The snapshot is now stale. |
| Continuous canonical fact capture | RED | There is no comprehensive recurring path for all artist, venue, event and festival changes. |
| Projection engine | AMBER-RED | Authority, tombstones and shadow decisions exist. Global activation control, retry semantics and truncation handling are insufficient. |
| Enrichment provider | RED | Provider remains inactive and unqualified. Latest run breached its approved per-case limits. |
| Graph reader | AMBER | Bounded graph traversal exists but is not securely embedded in Godmode. |
| Operator UI | AMBER-RED | Useful source and Claim tables exist. Current release, type safety, honesty and graph usability are not proven. |

The CDK creates an `EntityEnrichmentQueue`, but no Lambda consumer is connected to it. It is currently an architectural seam, not an operating enrichment worker.

---

## 6. Source scheduling policy: every enabled source family runs daily or faster

### 6.1 Product-owner decision

Every enabled source family must complete a root acquisition or unchanged-source check at least once in every 24-hour period.

This does not mean running full directory crawls or full profile hydration daily. The required model is:

- daily or faster root acquisition;
- cheap conditional acquisition or content-hash no-op when a publisher has not changed;
- immutable run/heartbeat evidence even when content is unchanged;
- artist and venue profile hydration only when referenced by a discovered gig or explicit repair task;
- directory and national reconciliation as bounded repair controls, not routine daily load;
- disabled or unqualified sources remain disabled until separately accepted.

### 6.2 Current source matrix

| Source family | Backline schedule/config | Cowork declaration | Daily-rule position | Required correction |
| --- | --- | --- | --- | --- |
| Lemonrock | Hourly new-gigs and cancellations; daily health; monthly future reconcile | Older Cowork definitions remain in ops | Meets family rule through hourly roots | Prove old Cowork schedules are disabled. Keep monthly reconcile as repair only. |
| On The Case | Hourly direct AWS rule; registry record says manual and Cowork writer | Daily canonical task | Runtime meets rule, configuration does not tell the truth | Make the registry authoritative and record the actual hourly cadence. Resolve writer ownership. |
| KLMA | Daily registry schedule; shadow; Cowork writer | Daily canonical task | Meets daily rule | Keep daily. Prove parity before writer transfer. |
| GigsNews | Weekly; enabled; no successful first-run timestamp in readiness snapshot | Daily canonical task | **Fails** | Change Backline root to daily, prove first run, record unchanged-source heartbeats and resolve writer ownership. |
| ScenicEye | Backline source manual/disabled; inconsistent source IDs include weekly and daily naming | Weekly canonical task | **Fails when considered active** | Unify the source definition. When enabled, perform a daily lightweight root check. |
| Insangel | Daily declaration but disabled | Cowork history indicates an active generation, exact live task unknown | Not yet an enabled Backline source | Keep disabled until acquisition is qualified, then make daily mandatory. |
| Enrichment | No active qualified Backline worker schedule | Nightly direct enrichment task | Not a source feed and not ready for activation | Do not schedule the provider until qualification and runtime safety pass. |
| Spider/discovery | No strategic Backline equivalent | Nightly unattended creator | Outside Backline evidence control | Freeze writer ownership and design evidence-first ingestion before replacement. |
| Fantastical Library | Paused | Daily task definition, explicit paused trigger | Paused | Leave paused until requalified; daily rule applies if re-enabled. |
| Future regional sources | Disabled or documentation only | None or unknown | Not active | Daily root acquisition becomes an activation acceptance criterion. |

### 6.3 Scheduling implementation requirements

1. Add an honest `hourly` cadence to the source schema, or represent equivalent effective cadence without contradictory manual records.
2. Make the Source Registry the executable scheduling truth, consistent with ADR-110.
3. Remove source-specific direct EventBridge schedule ownership once equivalent registry scheduling is proven.
4. Reject deployment or activation when an enabled source has `weekly`, `manual`, no `nextScanAt`, or no root acquisition within the required policy.
5. Add a stale-source threshold of approximately 26 hours to allow operational grace while still enforcing daily completion.
6. Alarm and show Red in Godmode when the threshold is breached.
7. Display configured cadence, effective infrastructure cadence, last successful acquisition and next due time side by side.
8. Distinguish root acquisition from child hydration and repair reconciliations.
9. Record an unchanged-source success without rewriting duplicate Claims.
10. Require the same rule for any future source at activation.

---

## 7. Canonical bndy hydration and automatic Claim ingestion

### 7.1 Current baseline

The one-shot canonical bootstrap captured the existing bndy corpus into Backline on 24 August:

- 15,288 logical entities and observations;
- 518,131 Claims;
- 15,288 resolutions;
- 15,288 immutable evidence objects;
- artists, venues, events and festivals represented with canonical-self provenance.

This was a valid bootstrap. It is not a continuous ingestion mechanism.

### 7.2 What automatically enters Backline now

- The `bndy-entity-claims` stream creates privacy-minimised authority assertions for Claim V2 ownership and verification evidence.
- Artist join and venue join flows publish some user-created facts directly into the Backline state table.
- These publishers cover selected ownership/join paths, not the general canonical fact surface.

### 7.3 What is missing

- General artist updates do not reliably emit Backline fact observations.
- General venue updates do not reliably emit Backline fact observations.
- Event create/update/cancel/delete does not have a comprehensive Backline publisher.
- Festival changes do not have a comprehensive Backline publisher.
- Normal `find-or-create` paths can bypass direct publishers.
- MCP and Capture paths can create canonical records without a preceding Backline fact observation.
- Direct publishers are best-effort dual writes. A canonical write can succeed when Backline publication fails.
- There is no durable outbox or comprehensive stream consumer for canonical facts.
- No recurring baseline CLI or scheduled reconciliation keeps the 24 August snapshot current.

### 7.4 Required target

Implement one durable canonical fact-ingress path using DynamoDB Streams, a transactional outbox from canonical APIs, or a carefully chosen combination.

The ingress worker must:

- cover artist, venue, event and festival INSERT, MODIFY and REMOVE activity;
- preserve stable canonical IDs;
- create immutable observations and atomic Claims;
- include source `bndy-canonical-change` and the originating actor/path where available;
- be idempotent by entity ID plus version or content hash;
- suppress projection for canonical-origin observations to prevent feedback loops;
- retain owner/protection/provenance metadata;
- retry durably and expose failures;
- support replay;
- run continuously, with a daily reconciliation backstop.

Before relying on an `updated_at` delta, verify timestamp semantics across historical records. The first refresh should be a full scan-and-hash reconciliation against the 24 August snapshot, followed by checksummed read-back and a delta report.

---

## 8. Gemini Interactions 20-case trial: authoritative review

### 8.1 Run identity

| Field | Recorded value |
| --- | --- |
| Repository head | `42d1644d448483c8decce8dd4209f64a8f5951d4` |
| Artefact | `ops/enrichment/gemini-interactions-evidence-first-20-case-unreviewed.json` |
| Captured at | `2026-08-29T20:22:36.606Z` |
| Provider | `gemini-interactions-evidence-first-v1` |
| Model | Gemini 3.6 Flash |
| Review status | `unreviewed` |
| Adapter status | `inactive` |
| Canonical writes | 0 |
| Schedule created | false |
| Provider activated | false |

### 8.2 Approved versus observed

| Measure | Approved/declared | Observed | Result |
| --- | --- | --- | --- |
| Cases | 20 | 20 attempted | Pass |
| Model calls | Exactly one per case | 20 total, one per case | Pass |
| Search queries | One to two per case | 52 total; six cases used four | **Fail** |
| Per-case reserve | $0.05 | Six cases cost about $0.0574 to $0.0579 | **Fail** |
| Total reserve | $1.50 | $0.758573 estimated | Pass |
| Canonical writes | 0 | 0 | Pass |
| Provider activation | None | None | Pass |
| Schedule | None | None | Pass |
| Output target | One unused artefact | One artefact committed | Pass |

The run did not finish inside every limit. It finished inside the total reserve and the no-write boundary.

### 8.3 Complete case outcome table

| Case | Entity | Status | Identity confidence | Fact lines | Citations | Searches | Outcome |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| q01 | the Reform | captured | 0.00 | 0 | 0 | 2 | Abstained; correctness not yet adjudicated |
| q02 | Catalyst | captured | 0.00 | 0 | 0 | 2 | Abstained; correctness not yet adjudicated |
| q03 | Neovenator | error | 0.00 | 0 | 6 | 4 | Search limit breached; whole case rejected |
| q04 | Jonny Trax | error | 0.00 | 0 | 3 | 4 | Search limit breached; whole case rejected |
| q05 | The Humbuckers | captured | 0.92 | 2 | 2 | 2 | Identity below 0.98; facts parked |
| q06 | Charlotte Forman | captured | 0.95 | 9 | 9 | 2 | Identity below 0.98; facts parked |
| q07 | Anna Reay | captured | 0.95 | 16 | 16 | 2 | Identity below 0.98; facts parked; semantic conflict present |
| q08 | the Select Committee | error | 0.00 | 0 | 3 | 4 | Search limit breached; whole case rejected |
| q09 | the Tall Faces | captured | 0.95 | 8 | 8 | 2 | Identity below 0.98; facts parked |
| q10 | Tom Meighan Raw26 | error | 0.00 | 0 | 8 | 2 | Plain-text FACT line invalid; whole case rejected |
| q11 | Whittles Oldham | error | 0.00 | 0 | 5 | 4 | Search limit breached; whole case rejected |
| q12 | Shoulder, Fulford | error | 0.00 | 0 | 3 | 4 | Search limit breached; whole case rejected |
| q13 | Bebside Inn Blyth | captured | 0.99 | 2 | 2 | 2 | Threshold met; one substantive fact plus process marker |
| q14 | Town House Festival Oswestry | captured | 0.00 | 0 | 0 | 2 | Abstained; correctness not yet adjudicated |
| q15 | Murton Officials Club Seaham | captured | 0.99 | 3 | 3 | 2 | Threshold met; two substantive facts plus process marker |
| q16 | Crook Hotel Crook | captured | 0.98 | 3 | 3 | 2 | Threshold met; two substantive facts plus process marker |
| q17 | the Whitehouse Stalybridge | captured | 0.99 | 2 | 2 | 2 | Threshold met; one substantive fact plus process marker |
| q18 | White Hart Woodley | error | 0.00 | 0 | 5 | 4 | Search limit breached; whole case rejected |
| q19 | The Globe, Nantwich | captured | 0.99 | 5 | 5 | 2 | Threshold met; four substantive facts plus process marker |
| q20 | The Roebuck, Chesterton | error | 0.00 | 0 | 3 | 2 | Plain-text FACT line invalid; whole case rejected |

### 8.4 Correct interpretation of the fifty fact lines

| Category | Count |
| --- | ---: |
| Total citation-bound fact lines | 50 |
| Fact lines attached to identity confidence below 0.98 | 35 |
| Fact lines attached to identity confidence at or above 0.98 | 15 |
| `officialPresenceAttempted` process markers within the 15 | 5 |
| Substantive fact lines eligible for human checking | **10** |

The ten substantive fact candidates are:

1. Bebside Inn Blyth address.
2. Murton Officials Club Seaham address.
3. Murton Officials Club Seaham Facebook URL.
4. Crook Hotel Crook address.
5. Crook Hotel Crook location.
6. The Whitehouse Stalybridge address.
7. The Globe, Nantwich address.
8. The Globe, Nantwich website URL.
9. The Globe, Nantwich official URL, duplicating the website assertion.
10. The Globe, Nantwich Facebook URL.

These are not approved facts. They are the subset eligible for human verification after identity review and citation destination recovery.

### 8.5 Qualification design defects

1. **The cohort is not a known-answer cohort.** The source manifest contains no expected-match, expected-park or adjudicated predicate answers.
2. **Correct abstention cannot be claimed.** The three zero-confidence cases may be sensible, but correctness is not yet evidenced.
3. **Knowable coverage cannot be calculated.** The 80% denominator requires human labels for expected matches and knowable predicates.
4. **Raw slot coverage is low but not the qualification metric.** Thirty-five unique requested-predicate slots were represented across 190 requested slots, about 18.4%. This cannot be converted into the formal knowable-coverage result without adjudication.
5. **Search count is not hard-enforced.** Gemini can execute four queries inside one model call before the adapter can inspect usage.
6. **Per-case cost was not hard-enforced.** The adapter detects excess only after the call.
7. **Resolved public destinations are absent.** Resolver code exists, but the trial retains Google provider redirects and source titles rather than resolved public destinations.
8. **Fact terminology is misleading.** `admittedFacts` means parsed, citation-bound bundle facts, not facts accepted into Backline knowledge or canonical projection.
9. **Identity gating occurs after provider capture.** Facts were parsed for identities below 0.98 and must remain parked.
10. **Fact semantics need tightening.** Anna Reay was assigned Solo Act, Band and Duo simultaneously. These may describe related formations, not three values for one canonical `hasArtistType` predicate.
11. **Process metadata is modelled as entity knowledge.** `officialPresenceAttempted` belongs on acquisition/observation metadata, not as an entity fact.
12. **Website and official URL duplication is possible.** Equivalent assertions need deterministic normalisation and deduplication.
13. **Source quality is not equivalent to citation presence.** Official sites, CAMRA, directories, Facebook, Discogs and entertainment listings need different authority treatment.
14. **The one-shot workflow retains a push-message trigger.** It can obtain repository write and AWS OIDC permissions when a main-branch commit message starts with the approved-run phrase. The existing output file blocks another successful capture, but the trigger was a permission workaround and should be removed in favour of explicit dispatch-only operation.

### 8.6 Trial verdict

| Gate | Verdict |
| --- | --- |
| Provider transport returned provider citations | Partial pass |
| Exact-segment fact/citation binding | Pass for the 50 parsed fact lines |
| Durable destination evidence | Fail/incomplete |
| No-write safety | Pass |
| One model call per case | Pass |
| One to two searches per case | Fail |
| $0.05 per-case reserve | Fail |
| $1.50 total reserve | Pass |
| Known-answer identity accuracy | Not testable yet |
| Expected-park behaviour | Not testable yet |
| Knowable-predicate coverage | Not testable yet |
| Provider qualification | **Not qualified** |

The correct phrase is: **the data boundary held, but the provider-control contract failed and the qualification truth set is incomplete.**

### 8.7 Work required before another paid run

1. Adjudicate all 20 identities, including explicit expected-match or expected-park labels and reasons.
2. Record which requested predicates are knowable for every expected-match case and their expected values where practical.
3. Review all 50 current fact lines, while keeping the 35 sub-threshold facts parked.
4. Recover and preserve safe public citation destinations or record failed resolution explicitly.
5. Move `officialPresenceAttempted` to observation metadata.
6. Resolve artist formation semantics and mutually exclusive predicate rules.
7. Normalise duplicate/equivalent URL predicates.
8. Add source-quality/authority classification separate from citation presence.
9. Decide whether the next contract explicitly permits up to four provider queries, or replace the evidence search with a mechanism whose request count can truly be controlled.
10. Recalculate the per-case reserve if four searches are authorised. Do not retain a $0.05 hard-reserve claim when observed four-search calls exceed it.
11. Tighten or redesign format handling. Valid atomic facts may be retained only if malformed lines cannot undermine identity or citation offsets; otherwise continue whole-case failure.
12. Build an offline validator that calculates the actual gates from the reviewed truth set.
13. Obtain a fresh, explicit approval for one new bounded run.
14. Return the qualification workflow to dispatch-only operation with the minimum required permissions before it is reused.

No second provider run should be started before items 1 to 14 are complete and peer-reviewed.

---

## 9. Canonical-write and writer-ownership risks

### 9.1 No global owner-level kill switch

Backline projection activation currently depends primarily on per-source values such as `shadow=false` and `writerAuthority=aws`, plus optional projection policy. There is no separate global owner-level deny switch that must be explicitly opened before any source can project.

Required control hierarchy:

1. global canonical projection disabled by default;
2. source explicitly enabled;
3. action explicitly allowed;
4. predicate explicitly allowed;
5. authority threshold passed;
6. owner protection passed;
7. run-level volume and destructive-action limits passed;
8. read-back passed;
9. audit evidence persisted.

### 9.2 Direct write paths outside the strategic projection boundary

| Path | Current risk |
| --- | --- |
| Google Discovery worker | Active queue mapping and direct grants to `bndy-artists` and `bndy-venues`. Its planner currently dispatches no entities, but the worker remains armed if messaged. |
| Capture processor | Uses canonical artist, venue and event APIs directly after Gemini interpretation rather than first creating Backline fact observations and Claims. |
| bndy MCP | Uses canonical community/find-or-create APIs and does not comprehensively emit Backline fact observations. |
| Serverless join publishers | Publish only selected artist/venue join facts, best effort, with no durable retry/outbox. |
| Claude Cowork tasks | Continue as declared canonical writers for several sources until proven otherwise. |
| Legacy `bndy-signals` | Remote main still defines production schedules and non-dry-run canonical writers. |

### 9.3 Legacy `bndy-signals` redeployment hazard

The remote default branch still declares production rules for KLMA, On The Case, GigsNews and ScenicEye as enabled and uses non-dry-run canonical writers. Operations evidence from 27 July says the deployed rules were disabled and Lambda concurrency set to zero, but the durable disabling commit is not on the current remote default branch.

Therefore the likely cloud state is disabled, but a new deployment from remote main could re-enable legacy writers. This must be corrected in code and verified in AWS before Backline production ownership is accepted.

### 9.4 Cowork overlap

The repository contains task definitions for daily or nightly KLMA, On The Case, GigsNews, enrichment and spider work; weekly ScenicEye; paused Fantastical Library; and older Lemonrock operations. No append-only v2 run-ledger records were present in the inspected remote despite the documented run contract.

Backline cannot safely transfer writer ownership or hydrate Cowork changes until the live task list and recent execution evidence are exported.

Required live export fields:

- task ID and display name;
- enabled, paused or deleted state;
- schedule and timezone;
- last start, completion and outcome;
- source family;
- canonical APIs or MCP tools used;
- create/update/cancel limits;
- current snapshot/cursor location;
- writer authority;
- replacement Backline worker, if any.

---

## 10. Projection engine and knowledge-store defects

1. Claim loading queries a maximum of 1,000 records and does not surface truncation.
2. Projection exceptions can be raised and then recorded as successful terminal outcomes, preventing retry.
3. A source can be made writable through distributed configuration rather than one owner-controlled release gate.
4. Storage invariants are mostly unit-tested with fakes rather than production-like DynamoDB and S3 integration tests.
5. Graph/index reads are bounded, which is good, but subject/detail limits can truncate without an operator-visible warning.
6. Historical evidence and canonical baselines use observation IDs that the current Backstage detail route cannot always open.
7. Projection safety requires explicit idempotency and replay proof for every supported action.

Required corrections:

- throw or paginate when Claim results exceed the current page;
- send retryable projection errors to a durable exception path and DLQ;
- distinguish reviewed terminal exceptions from transient failures;
- add DynamoDB conditional-write, S3 immutability, stream replay and projection read-back integration tests;
- expose truncation and pagination in Godmode;
- add a projection decision ledger with source, evidence, Claims, policy version and before/after values.

---

## 11. Observability and operational safety

The current CDK does not define an adequate production alarm set. Most functions do not have explicit log retention.

Minimum required alarms and views:

- visible messages and age of oldest message for every main queue;
- visible messages for every DLQ and historical quarantine;
- Lambda error, throttle and duration thresholds;
- event-source mapping disabled or stalled;
- source stale beyond 26 hours;
- projection exception count;
- canonical read-back failure count;
- hydration stream iterator age and failure count;
- no successful Trust Loop classification in the expected window;
- provider budget consumption and refusal rate;
- provider format error and citation-loss rate;
- unexpected canonical projection attempt while global switch is closed;
- legacy writer invocation;
- log retention configured on every function.

Fail-closed behaviour without alarms can become fail-stalled. Safety must be visible.

---

## 12. API, IAM and release governance

### 12.1 `bndy-serverless-api`

Local read-only validation of current source found:

- route verification passes with 265 expected routes;
- the mutation security test fails because 13 mutation routes are absent from the mutation baseline;
- affected areas include join, Claim, membership, invitation and ownership mutations;
- the main deployment still succeeded, so the release path does not consistently enforce the root security gate;
- the Source Inspector post-deploy smoke subsequently failed because an expected observation description was empty;
- functions share a broad hard-coded `bndy-api-instance-role` rather than function-specific least privilege.

Required corrections:

1. classify and baseline every mutation route;
2. make the security gate mandatory in the production deployment workflow;
3. fail deployment if route reconciliation or Source Inspector smoke fails;
4. replace the broad shared role with bounded function roles or clearly justified capability roles;
5. stop using broad `ListTables` discovery where explicit table configuration is available;
6. add durable retry/outbox behaviour for Backline publication.

### 12.2 `bndy-backstage`

Current findings:

- Vite production build succeeds;
- the full TypeScript check fails with extensive existing errors;
- no meaningful tests cover Backline Explorer or its data service;
- the latest inspected Amplify release built but failed to obtain OIDC credentials, so release completion is not proven;
- dependency installation reported high and critical vulnerabilities;
- the global `canonicalWritesEnabled` display is hard-coded false and can misrepresent per-source reality;
- the source summary route can repeatedly page a very large task partition;
- subject detail is limited without a truncation indicator;
- observation ID validation excludes baseline and some user-created observation formats.

Required corrections:

- repair the release credential path and prove the deployed SHA;
- establish a TypeScript quality baseline and prevent new errors;
- add Backline Explorer service/component tests;
- derive global status from real source and global-switch configuration;
- replace unbounded summary scans with indexed aggregates;
- show pagination and truncation explicitly;
- support all valid observation ID formats;
- resolve high and critical dependency vulnerabilities before production sign-off.

### 12.3 Backline admin API

The graph/admin Lambda Function URL uses `authType: NONE`, CORS `*`, and a bearer service token. The static explorer expects an operator to paste that service token into the browser.

This is acceptable only as an internal prototype. Production Godmode must call the graph through an authenticated server-side platform-admin boundary so the service token never reaches browser storage or JavaScript.

### 12.4 Related repository triage

- `bndy-capture` and `bndy-chatzone` are the Capture transport and user interface. The Backline stack polls Capture every five minutes, but the interpretation path still writes canonically before complete evidence convergence.
- `bndy-MCP` remains a direct canonical adapter. It is part of the hydration and evidence-ingress problem, not a replacement for Backline.
- `bndy-infrastructure` is stale legacy infrastructure and should not be treated as the deployment authority for Backline.
- `bndy-types` is old and is not currently the single type authority for the Backline knowledge model.
- `bndy-frontstage` is decommissioned/legacy context. The attached Google Maps and Firestore-era files come from that older generation.
- `bndy-signals` is a strategic predecessor and a live redeployment risk until its default branch and cloud state are reconciled.

### 12.5 Local verification outcomes

- `bndy-enrichment`: build and 340 tests across 54 files passed on the tested code tree. Changes after that proof were workflow/status/artefact changes rather than runtime source changes.
- `bndy-enrichment` CDK synth could not be completed in this sandbox because `tsx` was denied creation of its local IPC pipe. This is an environment limitation, not a successful or failed infrastructure assertion.
- `bndy-serverless-api`: route validation found 265 expected routes, but the mutation security test failed on 13 unclassified mutation routes.
- `bndy-backstage`: production build succeeded, while the full TypeScript check failed extensively.
- `bndy-app`: the current application uses MapLibre and its inspected CI/release lineage is separate from the attached legacy map refactor.

---

## 13. Workboard and audit accuracy

The current `bndy-website` head has newer Claim Journey updates, but the Backline lane still reflects the pre-trial position. It describes Backline health as Green and the approved qualification as the current step.

The current `bndy-ops` audit addendum also predates the run and says capture is blocked by workflow scope.

Required corrections when repository writes are authorised:

1. Set overall Backline health to Amber.
2. Record the 20-case run as completed but contract-failed and unreviewed.
3. Record the correct $0.758573 estimated cost and $1.50 total reserve.
4. Record six search-limit and per-case reserve breaches.
5. Record nine fact-bearing cases, not twelve usable cases.
6. Record ten substantive high-threshold fact candidates awaiting review.
7. Record the missing known-answer labels and destination preservation.
8. Record the daily-source product-owner decision and GigsNews/ScenicEye gaps.
9. Record the canonical hydration gap.
10. Record serverless, Backstage, observability and legacy-writer production gates.
11. Replace `CTO audit passed` language with a dated, evidence-based readiness statement.
12. Link this audit as the current shared plan once it has been peer-reviewed and committed.

Future audits must include:

- version number;
- evidence freeze time;
- exact repository/deployed SHAs;
- durable findings separate from transient state;
- explicit evidence limitations;
- a supersedes/superseded-by relationship;
- reviewer decisions and unresolved challenges.

---

## 14. Cost position

The architecture is structurally compatible with the low-cost mandate:

- Lambda rather than persistent compute;
- SQS for bounded work;
- DynamoDB on demand;
- S3 immutable evidence;
- conservative concurrency;
- no Neptune, OpenSearch, RDS, ECS or NAT requirement for the current evidence graph;
- source-specific low-frequency repair work;
- browser runtime separated from standard HTTP workers.

Claude modelled approximately $8 to $20 per month for AWS shadow steady state, with provider spending separately bounded. That model is plausible, not verified billing evidence.

Cost actions:

1. obtain one real AWS monthly service-level bill and reconcile it to the model;
2. include CloudWatch, PITR, GSI write amplification, Secrets Manager and evidence retention;
3. confirm public GitHub Actions remains free under repository and organisation policy;
4. monitor full-table operational scans as the StateTable grows;
5. evaluate GSI projection reduction only after access-pattern proof;
6. retain source concurrency and browser limits;
7. never describe requested per-case provider spend as hard-capped unless the code can enforce it before or during the call.

---

## 15. Visual intelligence layer

### 15.1 Existing foundation

Backline already has:

- a bounded graph reader over sources, observations, Claims, candidates, resolutions and entities;
- a read-only admin API;
- a static Obsidian-style explorer prototype;
- Backstage source, run, Trust Loop and Claim tables;
- a current product application standardised on MapLibre;
- canonical maps and summary visualisations in Godmode.

### 15.2 Attached map refactor assessment

The attached MapRefactor and TypeScript files describe an older Google Maps and Firebase-era implementation and a proposed move to Leaflet while retaining Google Places. They are useful historical reference for markers, clustering, popups, themes and filters.

They should not set the Backline technology direction:

- the current `bndy-app` already uses MapLibre extensively;
- the attached venue service uses Firebase/Firestore assumptions that no longer match the canonical API and DynamoDB architecture;
- a geographic map alone cannot explain evidence, identity, authority, conflict and projection decisions;
- adding Leaflet would fragment the current map stack.

### 15.3 Target Godmode experience

Build one authenticated Backline Intelligence workspace with:

1. **Geographic canvas:** MapLibre map of canonical and unresolved artist, venue and gig activity.
2. **Expandable evidence graph:** sources, observations, Claims, candidate identities, resolutions and canonical entities.
3. **Decision drawer:** raw evidence, public citation destination, source authority, confidence, conflict and resolution history.
4. **Timeline:** source acquisitions, Claim changes, resolution changes, canonical projection history and reversals.
5. **Conflict lanes:** competing values grouped by predicate and authority.
6. **Would-write simulator:** before/after canonical diff, policy reason, blocked protections and projected cost/volume.
7. **Source operations:** cadence, last success, next run, queue health, DLQ, writer authority and stale alarms.
8. **Filters:** source, region, entity type, predicate, authority, confidence, conflict, owner protection and projection state.
9. **Progressive graph expansion:** one bounded indexed neighbourhood at a time to preserve the low-cost model.
10. **Secure server-side access:** no service token pasted into the browser.

This can remain on DynamoDB/S3 with bounded traversal. Neptune is not required for the current scale or experience.

---

## 16. Ranked action plan

### 16.1 Roles

- **Backline Owner (Codex):** primary technical owner, implementation proposal, evidence collection and delivery when authorised.
- **Claude Peer Reviewer:** independent challenge, evidence verification and review sign-off. Claude should not independently expand scope, spend, deploy or alter schedules.
- **Product Owner (Jason):** approves provider calls, production mutations, schedule/writer cutovers and canonical projection.

### 16.2 Action register

| ID | Priority | Action | Primary | Peer | Current status | Acceptance evidence |
| --- | --- | --- | --- | --- | --- | --- |
| BL-001 | P0 | Establish this as the single versioned audit | Backline Owner | Claude | Draft complete | One peer-reviewed file; earlier copies marked superseded when repo writes are authorised |
| BL-002 | P0 | Obtain fresh read-only AWS inventory | Backline Owner | Claude | Blocked by access | EventBridge rules, mappings, concurrency, queue/DLQ depth, alarms, log retention, streams and deployed SHA inventory |
| BL-003 | P0 | Export live Cowork schedule inventory | Backline Owner | Claude | Blocked by scheduler access | Complete enabled/paused task list with cadence, last run and writer paths |
| BL-004 | P0 | Correct workboard and CTO status | Backline Owner | Claude | Blocked by read-only authority | Backline Amber; trial and all production gates accurately recorded |
| BL-005 | P0 | Enforce daily-or-faster enabled source policy | Backline Owner | Claude | Decision recorded, not implemented | GigsNews daily; ScenicEye daily when enabled; 26-hour stale alarm; deployment invariant tests |
| BL-006 | P0 | Reconcile scheduling into one executable truth | Backline Owner | Claude | Not started | Registry and effective infrastructure cadence agree; hourly supported; no unexplained direct rules |
| BL-007 | P0 | Neutralise legacy and duplicate writers | Backline Owner | Claude | Not started | `bndy-signals` durable disable on main; live AWS verified; old Lemonrock Cowork off; one writer per source |
| BL-008 | P0 | Add global canonical projection kill switch | Backline Owner | Claude | Not started | Global deny defaults closed and is required in addition to source/action/predicate permission |
| BL-009 | P0 | Revoke or isolate Google Discovery direct canonical grants | Backline Owner | Claude | Not started | No direct artist/venue mutation path outside approved projection policy |
| BL-010 | P0 | Close Capture/MCP canonical evidence bypass | Backline Owner | Claude | Not started | Every successful canonical mutation emits durable Backline fact evidence or a transactional outbox record |
| BL-011 | P0 | Design continuous canonical fact ingress | Backline Owner | Claude | Not started | Artist, venue, event and festival changes become idempotent observations/Claims with no feedback loop |
| BL-012 | P0 | Rehydrate changes since the 24 August baseline | Backline Owner | Claude | Blocked by BL-011 and approval | Full scan/hash delta, counts, checksums, error report and canonical read-back; zero projection |
| BL-013 | P0 | Add alarms, log retention and stale-source health | Backline Owner | Claude | Not started | Alarm matrix implemented and tested; every function has explicit retention |
| BL-014 | P0 | Fix projection retry and Claim truncation | Backline Owner | Claude | Not started | Retryable errors retry/DLQ; reviewed exceptions explicit; no silent 1,000-Claim truncation |
| BL-015 | P0 | Enforce serverless API security gate | Backline Owner | Claude | Not started | All mutations classified; deployment cannot bypass failed security or smoke tests |
| BL-016 | P0 | Reduce API IAM privilege | Backline Owner | Claude | Not started | Function/capability roles document and enforce least privilege |
| BL-017 | P1 | Add storage and replay integration tests | Backline Owner | Claude | Not started | Dynamo conditional writes, S3 immutability, stream replay, idempotency and projection read-back proven |
| BL-018 | P1 | Repair Backstage release and type baseline | Backline Owner | Claude | Not started | Deployed SHA proven; OIDC fixed; type errors baselined; high/critical vulnerabilities resolved |
| BL-019 | P1 | Correct Backstage status and data-access defects | Backline Owner | Claude | Not started | Honest global state, indexed summaries, pagination/truncation and all observation IDs supported |
| BL-020 | P1 | Build reviewed known-answer cohort from current 20 cases | Backline Owner | Claude | Not started | Expected identity, expected park, knowable predicates, expected values and notes for all 20 |
| BL-021 | P1 | Adjudicate current trial without another provider call | Backline Owner | Claude | Not started | All 20 identities and 50 fact lines reviewed; ten high-threshold candidates explicitly accepted/rejected |
| BL-022 | P1 | Repair enrichment evidence and fact semantics | Backline Owner | Claude | Not started | Destinations preserved; process metadata moved; formation semantics and URL dedupe defined; source quality classified |
| BL-023 | P1 | Design enforceable qualification contract v2 | Backline Owner | Claude | Not started | Honest query/cost limits, offline validator and reviewed truth-set gates; no provider call |
| BL-024 | P1 | Run one new qualification only after approval | Backline Owner | Claude | Blocked by BL-020 to BL-023 and approval | One approved bounded artefact; full automatic gate report; zero canonical writes |
| BL-025 | P1 | Secure the graph API behind platform-admin auth | Backline Owner | Claude | Not started | No browser service token; authenticated server-side proxy; bounded indexed reads |
| BL-026 | P2 | Build Backline Intelligence Godmode workspace | Backline Owner | Claude | Not started | MapLibre, graph, evidence drawer, timeline, conflicts, source health and would-write diff integrated |
| BL-027 | P2 | Prove one source's shadow would-write report | Backline Owner | Claude | Blocked by safety work | Known-answer additive-only report with zero destructive actions and complete evidence lineage |
| BL-028 | P2 | Prepare KLMA as first controlled canonical pilot | Backline Owner | Claude | Blocked by BL-027 | Parity, rollback, owner protection, volume limits, alarms and explicit approval ready |
| BL-029 | P3 | Execute bounded KLMA canonical pilot | Backline Owner | Claude | Not authorised | Product-owner approval, global/source gates opened briefly, read-back and rollback evidence |
| BL-030 | P3 | Retire Cowork writer source by source | Backline Owner | Claude | Not started | Backline parity proven, Cowork disabled, no duplicate writer and post-cutover monitoring green |

### 16.3 Execution sequence

#### Phase 0: evidence and control closure

BL-001 to BL-007. Do not change provider, projection or hydration behaviour until live AWS and Cowork ownership are known.

#### Phase 1: production safety and hydration foundation

BL-008 to BL-019. These are prerequisites for safe ownership, even while canonical projection remains closed.

#### Phase 2: enrichment qualification repair

BL-020 to BL-024. Adjudicate what has already been bought before spending again.

#### Phase 3: intelligence experience

BL-025 and BL-026 can proceed after the authenticated read path is agreed. They must remain read-only until projection gates are complete.

#### Phase 4: first canonical pilot

BL-027 to BL-030. KLMA remains the preferred first additive-only candidate, but only after every production gate below passes.

---

## 17. Canonical-write readiness gates

Canonical writes remain prohibited until all gates are evidenced.

### 17.1 Ownership and scheduling

- [ ] Fresh AWS rule/mapping/concurrency inventory completed.
- [ ] Fresh Cowork schedule export completed.
- [ ] Exactly one writer authority assigned per source.
- [ ] Every enabled source family runs daily or faster.
- [ ] No enabled source is stale beyond the agreed threshold.
- [ ] Legacy `bndy-signals` redeployment cannot reactivate writers.
- [ ] Old Lemonrock Cowork schedules are proven disabled.

### 17.2 Write control

- [ ] Global canonical projection kill switch exists and defaults closed.
- [ ] Source, action and predicate allowlists exist.
- [ ] Owner-managed protections are tested against the pilot predicates.
- [ ] Direct Google Discovery grants are removed or independently blocked.
- [ ] Capture and MCP mutations enter the evidence boundary durably.
- [ ] Destructive action limit is zero for the first pilot.

### 17.3 Hydration and knowledge integrity

- [ ] Continuous canonical fact ingress covers artists, venues, events and festivals.
- [ ] 24 August baseline delta/full reconciliation completed.
- [ ] Idempotency, replay and feedback-loop suppression proven.
- [ ] No silent Claim truncation.
- [ ] Storage immutability and conditional writes integration-tested.

### 17.4 Operations

- [ ] Queue, DLQ, stale source, Lambda and projection alarms active.
- [ ] Explicit log retention on all functions.
- [ ] Projection transient failures retry and reach a DLQ when exhausted.
- [ ] Deployed SHAs and runtime mappings are visible in Godmode.
- [ ] API mutation security and post-deploy smoke gates are mandatory.
- [ ] Least-privilege IAM review passed.

### 17.5 Pilot evidence

- [ ] Complete shadow would-write report on a known-answer cohort.
- [ ] Zero destructive actions.
- [ ] Additive-only action list reviewed.
- [ ] Complete before/after values and evidence lineage available.
- [ ] Rollback and read-back plan tested.
- [ ] Product Owner gives explicit source-specific approval.

---

## 18. Shared peer-review protocol

This audit is designed for Codex and Claude to review without creating competing documents.

### 18.1 Review method

For each challenged finding or action, the reviewer records one of:

- **ACCEPT** - evidence and conclusion accepted;
- **CHALLENGE** - conclusion disputed, with exact evidence and proposed correction;
- **NEW EVIDENCE** - later state changes the time-sensitive position;
- **SUPERSEDED** - a later audit version replaces the item.

Every review entry must include:

- audit version;
- finding/action ID or section;
- reviewer;
- timestamp;
- repository or deployed SHA where relevant;
- evidence path or run ID;
- whether the entry changes a durable finding or only current state.

### 18.2 Review register

| Audit version | Item | Reviewer | Decision | Evidence or challenge | Resolution |
| --- | --- | --- | --- | --- | --- |
| 1.0 | Entire audit | Claude | Pending | Peer review requested | Pending |
| 1.0 | Entire audit | Backline Owner | ACCEPT | Independent audit and repository evidence freeze | Draft owner sign-off complete |
| 1.0 | Canonical-write authority | Product Owner | Not requested | Canonical writes remain unauthorised | Closed |

Claude should peer-review this file, not create another consolidated audit. Any accepted corrections should produce version 1.1 of this same document with a change log.

---

## 19. Immediate next actions

Under the current read-only authority, the next actions are:

1. Claude peer-reviews version 1.0 using the protocol above.
2. The Backline Owner resolves evidence-backed challenges into version 1.1.
3. Obtain the read-only AWS inventory and Cowork scheduler export.
4. Confirm the action order with the Product Owner.
5. Only then request authority for a bounded implementation tranche.

No second Gemini run is currently recommended. No canonical write, schedule change or production deployment is currently authorised.

---

## Appendix A: principal evidence

### A1. Enrichment and trial

- `bndy-enrichment` current head: <https://github.com/flowency-live/bndy-enrichment/commit/42d1644d448483c8decce8dd4209f64a8f5951d4>
- PR 116 citation binding: <https://github.com/flowency-live/bndy-enrichment/pull/116>
- Trial artefact: <https://github.com/flowency-live/bndy-enrichment/blob/42d1644d448483c8decce8dd4209f64a8f5951d4/ops/enrichment/gemini-interactions-evidence-first-20-case-unreviewed.json>
- Trial contract: <https://github.com/flowency-live/bndy-enrichment/blob/42d1644d448483c8decce8dd4209f64a8f5951d4/docs/INTERACTIONS-EVIDENCE-FIRST-QUALIFICATION-CONTRACT.md>
- Approval record: <https://github.com/flowency-live/bndy-enrichment/blob/42d1644d448483c8decce8dd4209f64a8f5951d4/ops/enrichment/backline-interactions-evidence-first-20-case-approval-2026-08-29.txt>
- Source registry seed: <https://github.com/flowency-live/bndy-enrichment/blob/42d1644d448483c8decce8dd4209f64a8f5951d4/src/cli/seed-wave1-sources.ts>
- CDK stack: <https://github.com/flowency-live/bndy-enrichment/blob/42d1644d448483c8decce8dd4209f64a8f5951d4/lib/bndy-enrichment-stack.ts>

### A2. Status and operations

- Current workboard repository head: <https://github.com/flowency-live/bndy-website/commit/58e651e3fba1bc79f8ffeb0199f84eb6dff43295>
- Existing ops audit head: <https://github.com/flowency-live/bndy-ops/commit/8dad61a8ca1e11f573eb8818a829cee49a926c60>
- Canonical baseline documentation: <https://github.com/flowency-live/bndy-enrichment/blob/42d1644d448483c8decce8dd4209f64a8f5951d4/docs/BNDY-CANONICAL-BASELINE.md>
- Lemonrock manifest: <https://github.com/flowency-live/bndy-enrichment/blob/42d1644d448483c8decce8dd4209f64a8f5951d4/ops/lemonrock-reconciliation-manifest.json>
- On The Case manifest: <https://github.com/flowency-live/bndy-enrichment/blob/42d1644d448483c8decce8dd4209f64a8f5951d4/ops/onthecase-reconciliation-manifest.json>
- KLMA manifest: <https://github.com/flowency-live/bndy-enrichment/blob/42d1644d448483c8decce8dd4209f64a8f5951d4/ops/klma-shadow-bau-manifest.json>
- Trust Loop readiness snapshot: <https://github.com/flowency-live/bndy-enrichment/blob/42d1644d448483c8decce8dd4209f64a8f5951d4/ops/trust-loop-v1-readiness.json>

### A3. Related repositories

- Serverless API current head: <https://github.com/flowency-live/bndy-serverless-api/commit/d42352f3c83edf671f4e7ca08f3b141f17d80dd8>
- Backstage current head: <https://github.com/flowency-live/bndy-backstage/commit/02d8d43c1a63a4a103c827aa53d32a089e3084f5>
- Legacy signals current head: <https://github.com/flowency-live/bndy-signals/commit/db85ecd7ee05f13bdf8816c4a8652d804168ff47>
- Current MapLibre application head: <https://github.com/flowency-live/bndy-app/commit/7699824e8462c9945a79c93d8622bccab8a2f37f>

---

## Appendix B: change log

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-08-29 | First single owner audit. Consolidates Claude audits, independent repository audit, full trial correction, daily-source decision, hydration, canonical safety, operations, UI and shared action register. |
