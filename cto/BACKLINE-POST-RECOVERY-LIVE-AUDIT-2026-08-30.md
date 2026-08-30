# BNDY Backline post-recovery live audit

Status: **IN PROGRESS**

Latest completed phase: **Phase 4 — fresh CloudFormation drift checks**

Audit started: `2026-08-30T20:18:29.598Z`

Required account: `771551874768`

Required region: `eu-west-2`

This report is the incremental evidence record for the definitive post-recovery audit following the SAM/CDK infrastructure collision of 29–30 August 2026. Live AWS state is authoritative. Repository state, prior reports and the interrupted audit transcript are supporting evidence only.

Safety boundary: this audit does not deploy, invoke Lambda functions, change infrastructure or configuration, read secrets, consume queue messages, scan application data, trigger workflows, or exercise product endpoints. CloudFormation drift detection is the only authorised AWS diagnostic that initiates an operation.

## 1. Executive verdict

The audit is not yet complete. No final resumption or deployment verdict is issued at Phase 4.

| Question | Verdict | Reason |
| --- | --- | --- |
| Is the recovered serverless API stack stable? | UNVERIFIED | It is `UPDATE_COMPLETE`, but its fresh drift diagnostic was partial and the live Source Inspector route remains pending. |
| Is Enrichment runtime state verified? | PARTIAL | The stack is `UPDATE_COMPLETE` after user-confirmed parallel CDK work; runtime inventory is pending. |
| Are CloudFormation owners coherent? | PARTIAL | Twelve relevant stacks are identified; production Source Runner is drifted and the resource-level ledger is pending. |
| Are automatic deployment bypasses contained? | NO | Current workflow inspection proves the Source Inspector and Capture bypasses remain armed. |
| Are canonical writes proven disabled? | UNVERIFIED | Live controls, stream mappings and writer gates are pending. |
| Is it safe to resume read-only Backline work? | NO | The required live audit is incomplete. |
| Is it safe to resume local implementation? | NO | The required live audit is incomplete. |
| Is it safe to merge safety-only changes? | NO | Signals PR 1 is mergeable and passing, but automatic deployment bypasses and live ownership checks remain unresolved. |
| Is it safe to deploy Enrichment? | NO | Runtime, ownership and proposed differences are pending. |
| Is it safe to enable streams or hydration? | NO | Explicitly outside the current safety boundary. |
| Is it safe to activate providers? | NO | Explicitly outside the current safety boundary. |

## 2. Identity and audit scope

### Phase 1 result

**PASS.** The stop conditions were tested at `2026-08-30T20:18:29.598Z`–`2026-08-30T20:18:47.272Z`.

| Check | Observed value | Result |
| --- | --- | --- |
| AWS account | `771551874768` | PASS — exact required account. |
| Caller ARN | `arn:aws:iam::771551874768:user/bndy-deployer` | PASS — no session fragment required sanitisation. |
| Configured region | `eu-west-2` | PASS — exact required region. |
| Explicit regional CloudFormation read | Returned stack `bndy-remote-mcp` from `eu-west-2` | PASS — credentials and required baseline read permission are available. |
| AWS CLI | `2.28.24` | Recorded. |
| SAM CLI | `1.159.1` | Recorded. |
| AWS CDK CLI | `2.1135.1` | Recorded from the locally installed project dependency. |
| Node.js | `v22.22.3` | Recorded. |
| Git | `2.47.1.windows.1` | Recorded. |

The initially named documentation folder was not a Git worktree. The exact scoped repository `flowency-live/bndy-ops` was therefore cloned to `C:\VSProjects\bndy-ops` without changing any existing worktree. Its `main` branch was clean and aligned with `origin/main` before this report was created.

Authoritative starting evidence read:

- `bndy-ops/cto/BACKLINE-RECOVERY-CHECKPOINT-2026-08-30.md`.
- `bndy-website/docs/SERVERLESS-API-INCIDENT-RECOVERY-2026-08-30.md` was absent from the stale local worktree and was read from `origin/main` without checkout.
- `Troubleshooting Logs/prompt1.txt` was inspected as an interrupted historical transcript. Its live observations will be independently revalidated, and unsanitised identifiers from it will not be copied into this report.

### Fixed live scope

- AWS account `771551874768`, region `eu-west-2`.
- Known stacks: `BndyEnrichmentStack`, `bndy-serverless-api`, `bndy-capture`, `bndy-source-inspector`, plus all discovered active Signals and related Backline/source/intelligence stacks.
- Repositories: `bndy-ops`, `bndy-enrichment`, `bndy-serverless-api`, `bndy-signals`, `bndy-capture`, `bndy-MCP`, `bndy-app`, `bndy-backstage`, `bndy-website`, and historical `bndy-infrastructure`.

## 3. Repository heads and CI

### Worktree and remote state

The snapshot below was taken after a fetch that did not change any checked-out branch. Ahead/behind is `local HEAD` versus the remote default branch. Dirty files pre-existed this audit and were preserved.

| Repository | Worktree | Checked-out branch and HEAD | Remote default and HEAD | Ahead / behind | Worktree state |
| --- | --- | --- | --- | ---: | --- |
| `bndy-ops` | `C:\VSProjects\bndy-ops` | `main` at `63f57366841559a1f4746d35883957bf6f69617e` | `main` at `1964bbaa03411576d3e2c35f924dbf6ed6190122` | 1 / 0 | Clean; the one local commit is audit Phase 1. |
| `bndy-enrichment` | `C:\VSProjects\bndy-enrichment` | `main` at `39bae4fcbbe86a27b8e936225c94331cbb343d1c` | `main` at `72a9c23be73bbb347ecc3403f7f3e3211c78e9bc` | 0 / 3 | Dirty: modified `src/google/gemini.ts`; 12 untracked paths including `.worktrees/`, `_to_delete/`, scripts, JSON datasets, `cdk.out.validation/`, a patch, `nul`, and `src/cli/gather-cowork-artists.ts`. |
| `bndy-serverless-api` | `C:\VSProjects\bndy-serverless-api` | `master` at `d42352f3c83edf671f4e7ca08f3b141f17d80dd8` | `master` at `db7f5086ce5ecc88eb324fed84aad5ef0eaaec05` | 0 / 5 | Dirty: three modified files and seven untracked implementation/build paths. |
| `bndy-signals` | `C:\VSProjects\florence\bndy-signals` | `main` at `b5167ddb02eaa97c15fe77f3a67d6f8fbcbe8308` | `main` at `db85ecd7ee05f13bdf8816c4a8652d804168ff47` | 1 / 0 | Dirty `README.md`; local-only commit `b5167dd` disables source schedules but is not remote production authority. |
| `bndy-capture` | `C:\VSProjects\bndy-capture\bndy-capture` | `main` at `f829789b80bcea682d2668b0a7008e9ff12a43b4` | `main` at `7693e169cc77a903eea233e4ee64f25d547c7c26` | 0 / 1 | Dirty Android activity plus untracked Gradle wrapper paths. |
| `bndy-MCP` | `C:\VSProjects\bndy-MCPServer` | `feature/festivals-phase-1a` at `3766302f436cf6a60e3ee2fb4aaa72c2d94172aa` | `main` at `5bedc487fc70241d168821021ebf53a69fb482b7` | 7 / 9 | Clean but diverged feature branch; not suitable as a default-head validation worktree. |
| `bndy-app` | `C:\VSProjects\bndy-app` | `skin/cyberpunk` at `1eeaa2d2946e2b7215056c0b7afc822b18e19f61` | `main` at `a54dc959b76393b1e1924dfded5ca35ec3da9071` | 0 / 2 | Dirty rename, six modified files and one untracked incident note. |
| `bndy-backstage` | `C:\VSProjects\bndy-backstage` | `main` at `78d1e04c7897988d66db3c40501a678a300fe8bb` | `main` at `c4a6ac88eec0f6ceccf4713162b41a62c24ea0a4` | 0 / 16 | Dirty local settings plus six untracked diagnostic/script paths. |
| `bndy-website` | `C:\VSProjects\_Websites\bndy-publicwebsiteV2` | `main` at `4ed4525f4bd60b4fab0dbfea3a025dd8b5af1f09` | `main` at `fdf5b937546c5fb20f19cfedb6e976e6be429284` | 0 / 114 | Clean but substantially behind. The incident report was read from `origin/main` without checkout. |
| `bndy-infrastructure` | `C:\VSProjects\bndy-infrastructure-audit` | `master` at `bcb0e263c640d8944e075e1e0d109080d8181d11` | `master` at the same SHA | 0 / 0 | Clean audit clone. The pre-existing similarly named folder was not a Git worktree and was left untouched. |

### Latest remote-default commits

| Repository | Latest commits, newest first |
| --- | --- |
| `bndy-ops` | `1964bba` reference recovery checkpoint; `3308709` checkpoint recovery state; `0bdc0f0` owner audit/action plan; `8dad61a` audit execution addendum; `5af9e78` crawl-state sync. |
| `bndy-enrichment` | `72a9c23` production marker; `3d6f242` merge PR 123; `307c757` deployment boundary; `39bae4f` earlier production marker; `93069c7` Send to bndy hardening. |
| `bndy-serverless-api` | `db7f508` merge PR 70; `9b763df` merge PR 69; `940bc3d` bounded Backline summary; `b09f59a` Claim route baseline; `ca641b9` aliases/deployment workflow. |
| `bndy-signals` | `db85ecd` merge write errors; `c4225f5` merge review items; `8d3050b` intelligence pass fixes; `2845442` intelligence Lambda/trigger; `d0089ab` ScenicEye parser. |
| `bndy-capture` | `7693e16` WhatsApp intake; `f829789` public outcome details; `e905f16` Dropzone convergence; `3356654` Android build; `5d752c0` Android capture context. |
| `bndy-MCP` | `5bedc48` live acceptance; `85ea8d7` and `91f395b` deployment triggers; `4e3b157` OIDC policy; `ecaf00d` AWS bootstrap. |
| `bndy-app` | `a54dc95` merge PR 35; `0961cc5` Facebook Claim journey; `1eeaa2d` same-origin auth; `1c84063` Add/Claim journey; `7699824` gig history. |
| `bndy-backstage` | `c4a6ac8` merge PR 16; `28e25d9` bounded task browsing; `02d8d43` and `90340d6` Claim V2 releases; `17feb13` Claim review actions. |
| `bndy-website` | `fdf5b93` merge PR 44; `b5f0c1e` post-recovery status; `13a4175` incident report; `a2d3a58` Send to bndy delivery; `e3aad13` Meta checkpoint. |
| `bndy-infrastructure` | Only two commits exist: `bcb0e26` removed the API from this repository and `7683331` created the historical consolidation repository. This confirms it is not current infrastructure authority. |

### Pull requests

| Repository / PR | State | Draft | Mergeability | Checks | Audit relevance |
| --- | --- | --- | --- | --- | --- |
| [Enrichment #17](https://github.com/flowency-live/bndy-enrichment/pull/17) | OPEN | Yes | CONFLICTING | Four historical checks passed | Edition work; not ready to merge. |
| [Enrichment #28](https://github.com/flowency-live/bndy-enrichment/pull/28) | OPEN | No | CONFLICTING | Two historical tests passed | Claim deduplication; cannot merge cleanly. |
| [Enrichment #122](https://github.com/flowency-live/bndy-enrichment/pull/122) | CLOSED, unmerged | No | UNKNOWN | Tests passed | Superseded combined release path is not active. |
| [Enrichment #123](https://github.com/flowency-live/bndy-enrichment/pull/123) | MERGED at `2026-08-30T18:02:32Z` | No | — | CI passed; publish/release skipped | Manual deployment boundary is in remote `main`. |
| [Serverless API #11](https://github.com/flowency-live/bndy-serverless-api/pull/11) | OPEN | No | CONFLICTING | Test failure; validation passed; deploy skipped | Obsolete one-shot GSI recovery remains open and unsafe to merge. |
| [Serverless API #69](https://github.com/flowency-live/bndy-serverless-api/pull/69) | MERGED | No | — | Tests and validation passed; deploy skipped | Produced `9b763df`. |
| [Serverless API #70](https://github.com/flowency-live/bndy-serverless-api/pull/70) | MERGED | No | — | Tests and validation passed; deploy skipped | Produced default head `db7f508`. |
| [Signals #1](https://github.com/flowency-live/bndy-signals/pull/1) | OPEN | No | MERGEABLE | Test passed | Fail-closed safety change; merge must not imply deployment. |

No other scoped repository has an open PR.

### Default-head checks

| Repository default head | Failed or pending evidence |
| --- | --- |
| `bndy-serverless-api` `db7f508` | **FAILED:** two `Deploy Source Inspector` jobs and commit statuses `source-inspector/fail-smoke` and `source-inspector/deploy`. |
| `bndy-app` `a54dc95` | CI `verify` and `check` passed; multiple one-shot jobs skipped. |
| `bndy-backstage` `c4a6ac8` | CI passed; release and patch jobs skipped. |
| `bndy-website` `fdf5b93` | Build passed; one-shot workboard jobs skipped. |
| `bndy-signals`, `bndy-capture`, `bndy-MCP` | Latest recorded default-head checks passed; none is pending. |
| `bndy-ops`, `bndy-enrichment`, `bndy-infrastructure` | GitHub reports zero check runs/status contexts on the current default head. This is “no checks reported”, not a successful check. |

### Relevant Actions runs since `2026-08-30T12:00:00Z`

#### Serverless API and Source Inspector

| Run | Workflow / event / SHA | UTC window | Conclusion and failing step | AWS write capability | Evidence of AWS mutation |
| --- | --- | --- | --- | --- | --- |
| [33314022350](https://github.com/flowency-live/bndy-serverless-api/actions/runs/33314022350) | Deploy BNDY API / PR / `fd19829` | 13:22:50–13:23:36 | Failure: Lambda tests | Yes, deploy job exists | Deploy job skipped; none. |
| [33314034284](https://github.com/flowency-live/bndy-serverless-api/actions/runs/33314034284) | Deploy BNDY API / PR / `a7dbf80` | 13:23:06–13:23:53 | Failure: Lambda tests | Yes | Deploy job skipped; none. |
| [33314043720](https://github.com/flowency-live/bndy-serverless-api/actions/runs/33314043720) | Deploy BNDY API / PR / `2cd03d5` | 13:23:19–13:24:09 | Failure: Lambda tests | Yes | Deploy job skipped; none. |
| [33314116303](https://github.com/flowency-live/bndy-serverless-api/actions/runs/33314116303) | Deploy BNDY API / PR / `12f985b` | 13:24:57–13:26:06 | Success | Yes | Deploy job skipped; none. |
| [33314221078](https://github.com/flowency-live/bndy-serverless-api/actions/runs/33314221078) | Deploy BNDY API / push / `ca641b9` | 13:27:12–13:28:33 | Success | Yes | Deploy job skipped; none. |
| [33314277846](https://github.com/flowency-live/bndy-serverless-api/actions/runs/33314277846) | Deploy Source Inspector / workflow-run / `ca641b9` | 13:28:35–13:29:10 | Failure: smoke | **Yes** | API route/integration reconciliation succeeded; SAM build/deploy skipped. This preceded incident closure. |
| [33326309190](https://github.com/flowency-live/bndy-serverless-api/actions/runs/33326309190) | Deploy BNDY API / PR / `b09f59a` | 17:49:03–17:50:11 | Success | Yes | Deploy job skipped; none. |
| [33326799462](https://github.com/flowency-live/bndy-serverless-api/actions/runs/33326799462) | Deploy BNDY API / PR / `940bc3d` | 18:00:08–18:01:20 | Success | Yes | Deploy job skipped; none. |
| [33326902135](https://github.com/flowency-live/bndy-serverless-api/actions/runs/33326902135) | Deploy BNDY API / push / `9b763df` | 18:02:07–18:03:21 | Success | Yes | Main deployment skipped; its successful completion triggered Source Inspector run `33326965685`. |
| [33326913608](https://github.com/flowency-live/bndy-serverless-api/actions/runs/33326913608) | Deploy BNDY API / push / `db7f508` | 18:02:21–18:03:35 | Success | Yes | Main deployment skipped; its successful completion triggered Source Inspector run `33326976298`. |
| [33326965685](https://github.com/flowency-live/bndy-serverless-api/actions/runs/33326965685) | Deploy Source Inspector / workflow-run / `9b763df` | 18:03:23–18:04:00 | Failure: smoke | **Yes** | **Reached mutation:** reconciled route to a newly created integration/route. SAM build/deploy skipped. |
| [33326976298](https://github.com/flowency-live/bndy-serverless-api/actions/runs/33326976298) | Deploy Source Inspector / workflow-run / `db7f508` | 18:03:37–18:04:11 | Failure: smoke | **Yes** | **Reached mutation:** raced with the preceding run, deleted/recreated its route/integration and installed another. SAM build/deploy skipped. |

The smoke logs emit three passing boolean assertions followed by `false`; command order indicates the first failing assertion was the expected non-empty description for the fixed Facebook page. This is a log-order inference, not a current endpoint test.

#### Enrichment and Lemonrock

| Run | Workflow / SHA | UTC window | Conclusion | AWS mutation boundary |
| --- | --- | --- | --- | --- |
| [33323890573](https://github.com/flowency-live/bndy-enrichment/actions/runs/33323890573) | `deploy-aws` / `39bae4f` | 16:57:30–16:57:55 | Failure at `npx cdk bootstrap` | OIDC audit role authenticated, but failed on `cloudformation:GetTemplate` before deployment; no mutation is evidenced by the job log. |
| `33326678729`, `33326732900`, `33326925644` | malformed historical Lemonrock quarantine workflow registrations | 17:57:20–18:02:34 | Failure, zero jobs | No AWS step ran. |
| [33326926450](https://github.com/flowency-live/bndy-enrichment/actions/runs/33326926450) | Lemonrock production bootstrap / `3d6f242` | 18:02:35–18:02:36 | **Skipped** | No deploy/bootstrap job ran. |
| [33326928719](https://github.com/flowency-live/bndy-enrichment/actions/runs/33326928719) | Verify Lemonrock production bootstrap / `3d6f242` | 18:02:38–18:03:16 | Success | Read production metadata and committed a marker; it did not prove or change Lambda code. |
| `33312889061`, `33325626512`, `33326928914` | Lemonrock monitoring | 12:58:05, 17:34:18 and 18:02:38 | Success | No deployment evidence. |

The current marker records skipped bootstrap run `33326926450` and copies that run's `head_sha` into `deployedSha`. Repository code proves the field is not a deployed-revision measurement. The Lambda revision remains `UNMAPPED` until Phase 6.

#### Capture and Signals

- Neither `capture-acceptance-hotdeploy.yml` nor `capture-unknown-admission-acceptance.yml` ran at or after `2026-08-30T12:00:00Z`. Their most recent runs were 21 and 22 August respectively.
- The separate historical `Hot-deploy current Capture processor` workflow last ran successfully on 22 August. Its file is absent from `origin/master`, so its still-`active` GitHub registry entry has no default-branch trigger definition.
- The `bndy-capture` repository had no Actions run in the audit window.
- `bndy-signals` had no Actions run in the audit window; production PR 1 has not deployed.

## 4. Stack inventory and drift

### Phase 3 result — active stack discovery

**Inventory complete.** At `2026-08-30T20:25:58.828Z`–`2026-08-30T20:30:24.845Z`, twelve active top-level stacks met the fixed name/resource scope. No relevant stack is nested, in progress, failed, rolling back, deleting or under review. Only `bndy-serverless-api` has termination protection enabled.

| Stack | Status | Created UTC | Last update UTC | Termination protection | Resources |
| --- | --- | --- | --- | --- | ---: |
| `BndyEnrichmentStack` | `UPDATE_COMPLETE` | 2026-08-11 13:49:49 | **2026-08-30 20:08:43** | No | 79 |
| `bndy-serverless-api` | `UPDATE_COMPLETE` | 2025-09-25 15:12:27 | 2026-08-30 16:08:30 | **Yes** | 308 |
| `bndy-capture` | `UPDATE_COMPLETE` | 2026-08-02 20:49:34 | 2026-08-30 16:36:03 | No | 30 |
| `bndy-source-inspector` | `UPDATE_COMPLETE` | 2026-08-21 22:54:38 | 2026-08-24 16:53:56 | No | 2 |
| `BndySignals-Storage-dev` | `UPDATE_COMPLETE` | 2026-05-01 23:05:23 | 2026-06-16 22:29:50 | No | 3 |
| `BndySignals-Workflow-dev` | `UPDATE_COMPLETE` | 2026-05-01 23:06:01 | 2026-06-16 22:32:34 | No | 20 |
| `BndySignals-Api-dev` | `UPDATE_COMPLETE` | 2026-05-01 23:08:01 | 2026-06-16 22:33:04 | No | 66 |
| `BndySignals-Storage-prod` | `CREATE_COMPLETE` | 2026-06-17 13:21:34 | 2026-06-17 13:36:03 | No | 2 |
| `BndySignals-Workflow-prod` | `CREATE_COMPLETE` | 2026-06-17 13:38:52 | 2026-06-17 13:39:00 | No | 20 |
| `BndySignals-Api-prod` | `CREATE_COMPLETE` | 2026-06-17 13:40:59 | 2026-06-17 13:41:08 | No | 66 |
| `BndySourceRunner-dev` | `UPDATE_COMPLETE` | 2026-06-16 10:21:55 | 2026-06-18 18:08:37 | No | 36 |
| `BndySourceRunner-prod` | `UPDATE_COMPLETE` | 2026-06-15 19:22:46 | 2026-06-18 18:22:47 | No | 36 |

The exact stack IDs are:

- `BndyEnrichmentStack`: `arn:aws:cloudformation:eu-west-2:771551874768:stack/BndyEnrichmentStack/85600010-958b-11f1-adde-02eb3f35187b`
- `bndy-serverless-api`: `arn:aws:cloudformation:eu-west-2:771551874768:stack/bndy-serverless-api/0c629c00-9a22-11f0-a06b-0614d0c62539`
- `bndy-capture`: `arn:aws:cloudformation:eu-west-2:771551874768:stack/bndy-capture/ab4063d0-8eb3-11f1-8a65-06d0992ab9bf`
- `bndy-source-inspector`: `arn:aws:cloudformation:eu-west-2:771551874768:stack/bndy-source-inspector/494a9f10-9db3-11f1-a5e7-0ac3b6b0c895`
- `BndySignals-Storage-dev`: `arn:aws:cloudformation:eu-west-2:771551874768:stack/BndySignals-Storage-dev/3bb79be0-45b2-11f1-a787-02c1e00f88fb`
- `BndySignals-Workflow-dev`: `arn:aws:cloudformation:eu-west-2:771551874768:stack/BndySignals-Workflow-dev/5270b790-45b2-11f1-86e0-0addf44d4233`
- `BndySignals-Api-dev`: `arn:aws:cloudformation:eu-west-2:771551874768:stack/BndySignals-Api-dev/99fac600-45b2-11f1-9eff-06be37588ce7`
- `BndySignals-Storage-prod`: `arn:aws:cloudformation:eu-west-2:771551874768:stack/BndySignals-Storage-prod/760e5f10-6a4f-11f1-8764-0a7bb1e4c037`
- `BndySignals-Workflow-prod`: `arn:aws:cloudformation:eu-west-2:771551874768:stack/BndySignals-Workflow-prod/e0cea3d0-6a51-11f1-9688-020596a13c63`
- `BndySignals-Api-prod`: `arn:aws:cloudformation:eu-west-2:771551874768:stack/BndySignals-Api-prod/2cb862e0-6a52-11f1-92d0-06a7d7c8f61b`
- `BndySourceRunner-dev`: `arn:aws:cloudformation:eu-west-2:771551874768:stack/BndySourceRunner-dev/32cacfa0-696d-11f1-8860-025b594bc23b`
- `BndySourceRunner-prod`: `arn:aws:cloudformation:eu-west-2:771551874768:stack/BndySourceRunner-prod/96e0bfa0-68ef-11f1-a8f7-0281c4bdaeff`

### Resource counts by type

| Stack/domain | Type counts |
| --- | --- |
| Enrichment | Lambda 12; event-source mappings 6; EventBridge rules 9; SQS queues 13; DynamoDB tables 1; IAM roles/policies 12/12; Lambda permissions 7; Lambda URLs 1; S3 buckets/policies 1/1; Secrets Manager secrets 1; alarms 1; CDK metadata 1. |
| Serverless API | API Gateway v2 APIs/stages 1/1; Lambda functions 27; Lambda permissions 270; DynamoDB tables 8; SSM parameters 1. |
| Capture | API Gateway v2 APIs/stages/domain/mapping 1 each; Lambda functions 2; event-source mappings 1; Lambda permissions 13; DynamoDB tables 1; SQS queues 2; S3 buckets 1; IAM roles 2; secrets 2; certificate and Route 53 record 1 each. |
| Source Inspector | Lambda functions 1; Lambda permissions 1. |
| Signals Storage dev/prod | DynamoDB tables 1 each; dev also has one S3 bucket; CDK metadata 1 each. |
| Signals Workflow dev/prod | Lambda functions 5, IAM roles/policies 6/6, SQS queues 1, Step Functions state machines 1 and CDK metadata 1 in each environment. |
| Signals API dev/prod | REST APIs/stages/deployments 1 each, API resources 11, methods 20, Lambda functions 5, Lambda permissions 16, IAM roles/policies 5/5 and CDK metadata 1 in each environment. |
| Source Runner dev/prod | Lambda functions 6, EventBridge rules 5, Lambda permissions 5, DynamoDB tables 2, IAM roles/policies 6/6, custom log-retention resources 5 and CDK metadata 1 in each environment. |

### Sanitised parameters, outputs, tags and relationships

Parameter **values** were deliberately not emitted. Key names prove the configuration surface without revealing `JwtSecret`, WhatsApp tokens, Capture tokens or app secrets. Output values were likewise deferred to the resource ownership ledger, where only non-secret physical identifiers are included.

| Stack group | Parameter keys | Output keys | Tags / relationship |
| --- | --- | --- | --- |
| Enrichment | resolved claims-stream SSM reference; `BootstrapVersion` | 21 keys covering worker/function names, queue URLs, evidence bucket, state table, admin API URL and secret ARN | No tags; top-level. |
| Serverless API | `JwtSecret`, `Stage` | HTTP API ID/URL and selected function ARNs | No tags; top-level. |
| Capture | 14 keys covering domain/origin/rate limits and WhatsApp/Capture secret inputs | API URLs, webhook URL, table/bucket/function/queue names and secret ARNs | No tags; top-level. |
| Source Inspector | `BndyHttpApiId` | `SourceInspectorFunctionArn` | No tags; top-level. |
| Signals and Source Runner | `BootstrapVersion` | Environment-specific storage, workflow, DLQ, API, source table and runner function identifiers | No tags; all top-level. |

### Discovery boundary

Five active BNDY-named stacks were inspected and excluded: `bndy-remote-mcp`, `bndy-remote-mcp-bootstrap`, `bndy-brass-api`, `bndy-builder-tables`, and `bndy-calendar-sync`. Their names and physical/logical resources do not implement Backline, Capture, Source Inspector, Signals, source runners, interpretation or intelligence. The first three contain only remote MCP/bootstrap or Brass API resources; the latter two contain generic builder/calendar tables.

### Rollback and failure events since `2026-08-29T18:00:00Z`

Only `bndy-serverless-api` has matching events. At `2026-08-29T22:25:32Z` its attempted update failed because the four physical tables `bndy-entity-claims`, `bndy-entity-memberships`, `bndy-entity-invites`, and `bndy-join-analytics` already existed; the SAM dependency nested stack was cancelled and the parent reached `UPDATE_ROLLBACK_COMPLETE` at `22:26:00Z`. Later recovery/import work brought the stack to its current `UPDATE_COMPLETE` status. The other eleven relevant stacks have no failure/rollback event in the requested window.

### Concurrent Enrichment baseline

The stack update timestamp changed during the broader audit window. CloudFormation events show a user-initiated CDK change set executed at `2026-08-30T20:08:43Z` and completed at `20:10:34Z`, updating ten existing Lambdas and creating the source-health worker/rule/permission/IAM resources/alarm. CloudTrail event `72437377-06fa-40db-bc67-2c61262c0893` identifies a CDK `ExecuteChangeSet` through the `aws-cdk-jason` assumed deploy role. The user confirmed this was isolated parallel Enrichment work. It is therefore not classified as an audit violation or finding, but it invalidates earlier Enrichment template/drift observations; Phase 4 onward uses the post-update state.

### Fresh drift

Fresh detection started across all twelve relevant stacks at `2026-08-30T20:32:21Z`. All reached a terminal diagnostic status by the final observation at `20:34:20Z`. The AWS status API exposes the detection start timestamp but no completion timestamp, so the terminal observation time is the bounded completion evidence.

| Stack | Detection ID | Started UTC | Detection result | Stack drift / count |
| --- | --- | --- | --- | --- |
| `BndyEnrichmentStack` | `e77be860-a4b1-11f1-99e5-0ab1de9238ef` | 20:32:22.502 | `DETECTION_FAILED` — 2 internal resource failures | Partial `IN_SYNC` / 0 |
| `bndy-serverless-api` | `e8335180-a4b1-11f1-9b5e-0235bca2f88f` | 20:32:23.704 | `DETECTION_FAILED` — 2 internal resource failures | Partial `IN_SYNC` / 0 |
| `bndy-capture` | `e8e78650-a4b1-11f1-927e-0a152873eaa7` | 20:32:24.885 | `DETECTION_COMPLETE` | `IN_SYNC` / 0 |
| `bndy-source-inspector` | `e99cf3a1-a4b1-11f1-90bb-0a56de3189e1` | 20:32:26.074 | `DETECTION_COMPLETE` | `IN_SYNC` / 0 |
| `BndySignals-Storage-dev` | `ea5917b0-a4b1-11f1-87af-0646abfd2b13` | 20:32:27.307 | `DETECTION_COMPLETE` | `IN_SYNC` / 0 |
| `BndySignals-Workflow-dev` | `eb1032b0-a4b1-11f1-b653-02aa72f5b28f` | 20:32:28.507 | `DETECTION_FAILED` — 3 internal resource failures | Partial `IN_SYNC` / 0 |
| `BndySignals-Api-dev` | `ebc551e0-a4b1-11f1-a223-06db9d8e8551` | 20:32:29.694 | `DETECTION_FAILED` — 3 internal resource failures | Partial `IN_SYNC` / 0 |
| `BndySignals-Storage-prod` | `ec7b5b70-a4b1-11f1-9eb1-0655b2845313` | 20:32:30.887 | `DETECTION_COMPLETE` | `IN_SYNC` / 0 |
| `BndySignals-Workflow-prod` | `ed3f95d0-a4b1-11f1-910a-0616edde641d` | 20:32:32.173 | `DETECTION_FAILED` — 1 internal resource failure | Partial `IN_SYNC` / 0 |
| `BndySignals-Api-prod` | `ee057de0-a4b1-11f1-9357-027f98c10cf5` | 20:32:33.471 | `DETECTION_FAILED` — 1 internal resource failure | Partial `IN_SYNC` / 0 |
| `BndySourceRunner-dev` | `eecf5d90-a4b1-11f1-86db-02d5fa2bbb37` | 20:32:34.793 | `DETECTION_FAILED` — 4 internal resource failures | Partial `IN_SYNC` / 0 |
| `BndySourceRunner-prod` | `ef8fee70-a4b1-11f1-8320-02bc20eea893` | 20:32:36.055 | `DETECTION_FAILED` — 3 internal resource failures | Partial **`DRIFTED` / 5** |

`IN_SYNC` paired with `DETECTION_FAILED` is **not** accepted as a complete clean result. AWS reported no explicit “unsupported resource type” response; the incomplete checks were all labelled `Internal Failure`. Affected logical IDs were:

- Enrichment: `LemonrockMonthlyFutureReconcileE22F76CE`, `GoogleDiscoveryQueue5D916585`.
- Serverless API: `CalendarFunctionGetCalendarSubscriptionsPermission`, `ArtistsFunctionFindOrCreateArtistPermission`.
- Signals Workflow dev: `InterpreterFnServiceRoleDefaultPolicyEC44D895`, `PackBuilderFnServiceRoleDefaultPolicy2F13CA32`, `InterpreterFnServiceRole7337E5D1`.
- Signals API dev: `SignalsApicandidatescandidateIdGET064A3585`, one ratify-route Lambda permission, and `EventCandidateApiFnServiceRoleA09D912F`.
- Signals Workflow prod: `FailureHandlerFn01314552`.
- Signals API prod: `SignalsApicandidatescandidateIdratifyAD59A5B3`.
- Source Runner dev: `ScenicEyeRunnerFn00C951E2`, `IntelligencePassS3Trigger1516BA81` and the log-retention provider role/policy.
- Source Runner prod: `ScenicEyeRunnerFn00C951E2`, `GigsNewsRunnerFnServiceRoleDefaultPolicy2C145578`, and `CDKMetadata`.

### Production Source Runner drift details

All five known differences are `NOT_EQUAL` changes at property `/State`; no resource is deleted.

| Logical resource | Physical rule | Expected | Actual | Difference |
| --- | --- | --- | --- | --- |
| `GigsNewsSchedule476135E9` | `bndy-gigs-news-schedule-prod` | `ENABLED` | `DISABLED` | `NOT_EQUAL` |
| `IntelligencePassS3Trigger1516BA81` | `bndy-intelligence-pass-s3-trigger-prod` | `ENABLED` | `DISABLED` | `NOT_EQUAL` |
| `KlmaSchedule072A1EA8` | `bndy-klma-schedule-prod` | `ENABLED` | `DISABLED` | `NOT_EQUAL` |
| `OnTheCaseSchedule2833FF2F` | `bndy-onthecase-schedule-prod` | `ENABLED` | `DISABLED` | `NOT_EQUAL` |
| `ScenicEyeSchedule31F5D2D5` | `bndy-sceniceye-schedule-prod` | `ENABLED` | `DISABLED` | `NOT_EQUAL` |

The live disabled state is fail-closed, but the deployed production template still declares all five automation paths enabled. Any ordinary stack deployment could reverse the containment. Phase 10 independently verifies the effective rule states and targets.

### Drift blind spots

CloudFormation drift cannot establish the health or ownership of API Gateway routes/integrations created directly by CLI. In particular, `bndy-source-inspector` owns only a Lambda and permission, while the post-closure workflow directly deleted/created the production HTTP API integration and route. A clean drift result for that stack says nothing about those unmanaged objects. Direct Lambda hot-deploy capability and one-off workflows are similarly outside stack drift; Phases 6, 7 and 13 cover those paths.

## 5. Resource ownership ledger

Pending Phase 5.

## 6. Lambda and trigger inventory

Pending Phase 6.

## 7. Source Inspector incident-after-incident analysis

Phase 2 CI finding; live route state and CloudTrail correlation continue in Phases 7 and 13.

- **Did it run?** Yes. Two post-closure workflow-run jobs executed concurrently after separate successful-but-non-deploying `Deploy BNDY API` runs.
- **Did it deploy?** It did not SAM-deploy Lambda code: source-change detection was false and both SAM steps were skipped. It did perform direct AWS API Gateway mutations.
- **What changed?** Run `33326965685` reconciled `POST /api/community/source/inspect` to a new integration/route. Run `33326976298` then deleted/replaced that work and installed another integration/route.
- **Does the route currently work?** UNVERIFIED pending Phase 7. Both historical smoke runs failed.
- **Is automation still armed?** Yes. `deploy-source-inspector.yml` is active. Successful completion of `Deploy BNDY API` on `master` triggers it even when that workflow's deployment job is skipped. Source-code detection gates only the SAM build/deploy steps; it does not gate destructive route reconciliation.
- **Does the recovery closure remain valid?** The closure's claim that the recovered CloudFormation stack completed successfully may remain true, but its API-route snapshot ceased to be definitive after the two direct post-closure mutations. Current route coherence must be re-proven.

## 8. Capture hot-deploy analysis

Phase 2 result:

- Both named workflows are present and registered `active` on `bndy-serverless-api/master`.
- Neither ran after the recovery window began; there is no CI evidence that either changed `bndy-capture-processor` on 30 August.
- Both retain long-lived AWS credential configuration and direct `aws lambda update-function-code` capability against the CDK-owned processor.
- Both can invoke production scanners and mutate Capture records during their acceptance path; they are not ordinary tests.
- Their path filters require a push changing the workflow file itself, reducing accidental frequency but not removing the ownership bypass.
- The current processor hash and last-modified time will be compared with workflow history in Phase 6 and CloudTrail in Phase 13.

## 9. DynamoDB, streams and SSM

Pending Phases 8–9.

## 10. Schedules and source authority

Pending Phase 10.

## 11. Queues, alarms and logs

Pending Phases 11–12.

## 12. Canonical-write safety

Pending synthesis from Phases 6, 8–10 and 13.

## 13. CDK/SAM differences

Pending Phases 14–15.

## 14. Cowork inventory

Pending Phase 16.

## 15. Findings ranked by severity

### P0 — Source Inspector workflow bypass performs unconditional route replacement

- **Evidence:** active `deploy-source-inspector.yml`; runs `33326965685` and `33326976298`; successful `Reconcile API Gateway integration and route` steps; failed smoke steps; failed statuses on default head.
- **Affected resource:** production `POST /api/community/source/inspect` route and its HTTP API integration.
- **Impact:** any successful completion of the main workflow can delete and recreate the route even when the main deployment was intentionally skipped. Consecutive pushes caused concurrent reconcilers to race after incident closure.
- **Required decision:** contain the automatic trigger and establish a single CloudFormation owner before further main-branch deployment activity.
- **HITL approval:** Yes — workflow/default-branch changes are outside this read-only audit.

### P1 — Capture processor retains two cross-repository hot-deployment paths

- **Evidence:** active `capture-acceptance-hotdeploy.yml` and `capture-unknown-admission-acceptance.yml` on serverless API default head, each containing `aws lambda update-function-code` against `bndy-capture-processor` and production replay steps.
- **Affected resource:** `bndy-capture-processor` and Capture production data-plane operations.
- **Impact:** bypasses Enrichment CDK ownership and can replace code without a CloudFormation record. No run occurred in the current audit window, so this is an armed capability rather than a demonstrated 30 August mutation.
- **Required decision:** retire or permanently gate both paths and retain one release authority.
- **HITL approval:** Yes.

### P1 — Default branch still fails Source Inspector status

- **Evidence:** `db7f508` has failed `source-inspector/fail-smoke` and `source-inspector/deploy` statuses from two failed jobs.
- **Affected resource:** serverless API release confidence and the Source Inspector route.
- **Impact:** default head cannot be treated as fully green, and the route's functional state remains unverified.
- **Required decision:** diagnose after the route ownership boundary is contained; do not rerun the mutating workflow as a diagnostic.
- **HITL approval:** Required for any remediation; not required for continued read-only investigation.

### P1 — Production Source Runner template would re-enable five contained triggers

- **Evidence:** fresh detection `ef8fee70-a4b1-11f1-8320-02bc20eea893` reports five `/State` differences: template `ENABLED`, live `DISABLED` for GigsNews, KLMA, On The Case, ScenicEye and the intelligence-pass S3 trigger.
- **Affected resource:** `BndySourceRunner-prod` and its five production EventBridge rules.
- **Impact:** current live containment is fail-closed, but deploying the current stack template can silently restore automated acquisition and intelligence processing.
- **Required decision:** merge/adopt fail-closed IaC without deploying it automatically, then review a bounded deployment under separate approval.
- **HITL approval:** Yes; this audit will not reconcile drift.

### P2 — Lemonrock marker mislabels a workflow SHA as deployed SHA

- **Evidence:** verifier assigns `github.event.workflow_run.head_sha` to `deployedSha`; source run `33326926450` was skipped.
- **Affected resource:** `docs/lemonrock-production-status.json` and operator deployment evidence.
- **Impact:** readers can falsely conclude that commit `3d6f242` is deployed.
- **Required decision:** replace the field with a deterministic deployed artifact mapping or explicitly use `UNMAPPED`.
- **HITL approval:** Yes for repository correction; no for documenting the discrepancy.

## 16. Minimum safe recovery sequence

Pending final synthesis. No recovery action will be implemented by this audit.

## 17. Evidence appendix

### Phase 1 command record

All timestamps are UTC. Commands were run locally and did not mutate AWS.

| Timestamp | Command | Exit | Sanitised result |
| --- | --- | ---: | --- |
| `2026-08-30T20:18:29.598Z` | `aws sts get-caller-identity --output json` | 0 | Required account and caller ARN confirmed. User ID omitted. |
| `2026-08-30T20:18:29.598Z` | `aws configure get region` | 0 | `eu-west-2`. |
| `2026-08-30T20:18:29.598Z` | `aws cloudformation list-stacks --region eu-west-2 --max-items 1 ...` | 255 | AWS returned data, then the local paginator/JMESPath combination failed. Not treated as the permission proof. |
| `2026-08-30T20:18:47.272Z` | `aws cloudformation list-stacks --region eu-west-2 --stack-status-filter CREATE_COMPLETE --query 'StackSummaries[0].StackName' --output text` | 0 | Returned `bndy-remote-mcp`; clean baseline permission proof. |
| `2026-08-30T20:18:29.598Z` | `aws --version` | 0 | `aws-cli/2.28.24`. |
| `2026-08-30T20:18:29.598Z` | `sam --version` | 0 | `SAM CLI 1.159.1`. |
| `2026-08-30T20:18:29.598Z` | `npx --no-install cdk --version` | 0 | `2.1135.1`; no package installation. |
| `2026-08-30T20:18:29.598Z` | `node --version` | 0 | `v22.22.3`. |
| `2026-08-30T20:18:29.598Z` | `git --version` | 0 | `2.47.1.windows.1`. |

### Evidence limitations at Phase 1

- The website incident recovery document has not yet been located.
- No live runtime, drift, data-plane health or repository-currentness conclusion is made from Phase 1 alone.
- Historical values from the checkpoint and interrupted transcript remain unverified until their corresponding phases complete.

### Phase 2 command record

Phase 2 completed at `2026-08-30T20:31:00Z` (rounded command-window end). All repository operations were read-only except `git fetch`, cloning missing scoped repositories, and the required local audit commit. No branch was checked out or changed.

| Command family | Exit | Evidence obtained |
| --- | ---: | --- |
| `git remote get-url`, `branch --show-current`, `rev-parse HEAD`, `status --short`, `ls-remote --symref`, `rev-list --left-right --count`, `log -5` | 0 | Paths, origins, local/default heads, dirty state, divergence and latest commits for all ten repositories. |
| `git fetch origin` in each existing worktree | 0 | Current remote refs without checkout/reset/stash/clean. |
| `gh repo clone flowency-live/bndy-ops` and `gh repo clone flowency-live/bndy-infrastructure` | 0 | Missing exact scoped repositories. Existing non-Git directories were not overwritten. |
| `git show origin/main:docs/SERVERLESS-API-INCIDENT-RECOVERY-2026-08-30.md` | 0 | Authoritative website incident report from current remote without changing the 114-commit-behind worktree. |
| `gh pr list` for all repositories and `gh pr view` for PRs 17, 28, 122, 123, 11, 69, 70 and 1 | 0 | State, draft status, mergeability and check rollups. |
| `gh api repos/{repo}/commits/{default}/check-runs` and `/status` | 0 after one corrected empty-SHA query | Current default-head checks and statuses. The initial nested-field query supplied no SHA and returned only API 404/422 errors; it changed nothing. |
| `gh run list --created '>=2026-08-30T12:00:00Z'` and `gh run view ... --json jobs` | 0 | Relevant run IDs, SHAs, times, jobs, steps and conclusions. |
| `gh run view {Source Inspector run} --log` | 0 | Exact checked-out SHAs, skipped SAM steps, successful route reconciliation, smoke failure and sanitised credential masking. |
| `git show origin/master:.github/workflows/{workflow}.yml` | 0 | Current Source Inspector and Capture workflow triggers and mutation capability. |
| `gh run list --workflow {Capture workflow}` | 0 | No run in the audit window; latest historical runs recorded. |
| `git show origin/main:docs/lemonrock-production-status.json` and verifier workflow inspection | 0 | Current marker and proof that `deployedSha` copies a skipped run's head SHA. |

### Phase 2 evidence limitations

- GitHub evidence proves the workflow steps that ran but does not alone prove current AWS resource state; Phases 6, 7 and 13 will correlate Lambda configuration, API Gateway and CloudTrail.
- The Source Inspector smoke failure point is inferred from ordered shell output because the workflow did not print an assertion label.
- No current deployed Lemonrock commit mapping is available from repository/CI evidence; it remains `UNMAPPED`.
- The website and several code worktrees are intentionally behind their remote default heads. Later validation will use isolated temporary worktrees rather than modifying them.

### Phase 3 command record

| UTC window | Command family | Exit | Evidence obtained |
| --- | --- | ---: | --- |
| `2026-08-30T20:25:58Z`–`20:30:24Z` | `aws cloudformation describe-stacks --region eu-west-2` | 0 | All active stacks, exact IDs, status, timestamps, termination protection, parent/root relationship, parameter/output keys and tags. |
| Same | `aws cloudformation list-stack-resources --stack-name ...` for all BNDY-named stacks | 0 | Scope discovery, exact resource totals and counts by type; excluded-stack boundary. |
| Same | `aws cloudformation describe-stack-events --stack-name ...` for all twelve relevant stacks | 0 | Failure/rollback events since the required cutoff. |
| Same | `aws cloudtrail lookup-events --lookup-attributes AttributeKey=ResourceName,AttributeValue=BndyEnrichmentStack` | 0 | Sanitised CDK change-set actor, event name/time and event IDs for the concurrent update. |
| Same | `aws cloudformation describe-termination-protection ...` | 252 | Audit-command correction: that read operation does not exist in AWS CLI v2. Termination protection was then read successfully from `DescribeStacks.EnableTerminationProtection`; no update call was made. |

Phase 3 did not call any mutation API. The Enrichment mutation observed in the same wall-clock window was separate user-confirmed parallel work, and the live inventory was refreshed after it completed.

### Phase 4 command record

| UTC window | Command family | Exit | Evidence obtained |
| --- | --- | ---: | --- |
| `2026-08-30T20:32:21Z`–`20:32:36Z` | `aws cloudformation detect-stack-drift --stack-name ...` for all twelve relevant stacks | 0 | Twelve fresh diagnostic IDs. This was the explicitly authorised diagnostic mutation. |
| `2026-08-30T20:32:37Z`–`20:34:20Z` | `aws cloudformation describe-stack-drift-detection-status --stack-drift-detection-id ...` | 0 | Terminal status, partial/complete drift status, failed logical resources and counts. Polls were spaced and stopped at terminal state. |
| `2026-08-30T20:33:xxZ` | `aws cloudformation describe-stack-resource-drifts --stack-name BndySourceRunner-prod --stack-resource-drift-status-filters MODIFIED DELETED` | 0 | Every known expected/actual/difference for the five drifted rules. |

AWS does not return a completion timestamp from `describe-stack-drift-detection-status`; `20:34:20Z` is the final terminal observation bound, not an inferred service-side completion time.
