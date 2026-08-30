# BNDY Backline post-recovery live audit

Status: **IN PROGRESS**

Latest completed phase: **Phase 7 — Source Inspector API investigation**

Audit started: `2026-08-30T20:18:29.598Z`

Required account: `771551874768`

Required region: `eu-west-2`

This report is the incremental evidence record for the definitive post-recovery audit following the SAM/CDK infrastructure collision of 29–30 August 2026. Live AWS state is authoritative. Repository state, prior reports and the interrupted audit transcript are supporting evidence only.

Safety boundary: this audit does not deploy, invoke Lambda functions, change infrastructure or configuration, read secrets, consume queue messages, scan application data, trigger workflows, or exercise product endpoints. CloudFormation drift detection is the only authorised AWS diagnostic that initiates an operation.

## 1. Executive verdict

The audit is not yet complete. No final resumption or deployment verdict is issued at Phase 7.

| Question | Verdict | Reason |
| --- | --- | --- |
| Is the recovered serverless API stack stable? | UNVERIFIED | It is `UPDATE_COMPLETE`; the Source Inspector route is singular/coherent but unmanaged and functionally unverified, and stack drift was partial. |
| Is Enrichment runtime state verified? | PARTIAL | All functions are active/successful and mappings are coherent; logs, controls and schedules are still pending. The deployed Git SHA is `UNMAPPED`. |
| Are CloudFormation owners coherent? | NO | Core stack ownership is mapped, but canonical tables and the Source Inspector route/integration have no CloudFormation owner, and two cross-repository deployment paths remain. |
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

### Deployed template evidence

The current `Original` template body was retrieved for every relevant stack. Digests are SHA-256 over the returned body; JSON-bodied CDK templates were normalised through the local JSON parser before hashing, while string/YAML bodies were hashed as returned. These are evidence locators, not claims that local repository heads match production.

| Stack | Template digest | Deployed resources |
| --- | --- | ---: |
| `BndyEnrichmentStack` | `a6715ffaf7e2e5c5e3aaba0f55922b94c079399de9a1c4610868478aafb0fac0` | 79 |
| `bndy-serverless-api` | `6fe1123a18ebacecf756b0259d8abf577ae4baf826583295a69a0689e126eeb9` | 308 |
| `bndy-capture` | `970c8fd9593cfed308973b773557a34d00186165da83d8b7bbe8914d8ded5317` | 30 |
| `bndy-source-inspector` | `29fa574026f75b97e0077af3abf038d221a37aeed91ae6eee44bfcb80d07d286` | 2 |
| `BndySignals-Storage-dev` | `73285a13e9aacfe7f9ef44852015df55caba8939986e623a7c35146821112b2d` | 3 |
| `BndySignals-Workflow-dev` | `946b2ae95dbe2e68a05d325c3036a09dc4610c01b7ecc67c119f727beff61360` | 20 |
| `BndySignals-Api-dev` | `7c030b93dc0b6349feafacf227db66b8a2e28b45f2c4ede63a3f48b3c80e51aa` | 66 |
| `BndySignals-Storage-prod` | `cffc7eccd86dceb47921473497985fceba4071d72a52d74d07d8dea432806ca2` | 2 |
| `BndySignals-Workflow-prod` | `00d46778c160971facbeea84fc42b1fe9359f54f5f901291272b233a01719284` | 20 |
| `BndySignals-Api-prod` | `ff09717c11baae0ea69ad67dc96a11ade71591c794c4f8003cb9292282190745` | 66 |
| `BndySourceRunner-dev` | `a6442369215e3d5450b3b78bd0e6b71b8dca1e9b17a78f6f98e61a93d7f1bd2f` | 36 |
| `BndySourceRunner-prod` | `38b8b68533b99edb62cb155578780bdcce928cb42824264f01f198b247611678` | 36 |

### Authoritative ownership ledger

“Collision” includes a second deployment path, ambiguous source authority, or missing IaC ownership; it does not assert that two stacks currently claim the same physical ID.

| Resource domain | Physical resource | Logical ID | Owning stack | Intended repository | Evidence | Collision |
| --- | --- | --- | --- | --- | --- | --- |
| Backline state | `BndyEnrichmentStack-StateTable9728C7E5-14HR6N3NEWGLM` | `StateTable9728C7E5` | `BndyEnrichmentStack` | `bndy-enrichment` | Deployed template + stack resource | No |
| Evidence | `bndyenrichmentstack-evidencebucketfba44255-evhoeotjgvyv` | `EvidenceBucketFBA44255` | `BndyEnrichmentStack` | `bndy-enrichment` | Deployed template + stack resource | No |
| Browser scan queue/DLQ | `...BrowserScanQueue4C491B38-D0v3HZOZEo7V`; `...BrowserScanDLQF60E07F4-NsXNGs23lnLA` | `BrowserScanQueue4C491B38`; `BrowserScanDLQF60E07F4` | `BndyEnrichmentStack` | `bndy-enrichment` | Deployed template + stack resources | No |
| Capture-processing queue/DLQ | `...CaptureProcessingQueue6959335B-tKwPhKYnpdNr`; `...CaptureProcessingDLQ0A31D9DF-1nkotUMdq4Vs` | `CaptureProcessingQueue6959335B`; `CaptureProcessingDLQ0A31D9DF` | `BndyEnrichmentStack` | `bndy-enrichment` | Deployed template + stack resources | No |
| Entity-enrichment queue/DLQ | `...EntityEnrichmentQueueD721536B-nJHO6hJNMHCr`; `...EntityEnrichmentDLQA8E8FCCD-n28k9G2OOIef` | `EntityEnrichmentQueueD721536B`; `EntityEnrichmentDLQA8E8FCCD` | `BndyEnrichmentStack` | `bndy-enrichment` | Deployed template + stack resources | No |
| Google discovery queue/DLQ | `...GoogleDiscoveryQueue5D916585-WYcljufbbQga`; `...GoogleDiscoveryDLQE4DD72E1-deG9eoQofWpS` | `GoogleDiscoveryQueue5D916585`; `GoogleDiscoveryDLQE4DD72E1` | `BndyEnrichmentStack` | `bndy-enrichment` | Deployed template + stack resources | No |
| Projection queue/DLQ | `...ProjectionQueue84CD9FA9-MNRzvzNKh5Vg`; `...ProjectionDLQ7E1DC66F-PxEmZhDGVUV6` | `ProjectionQueue84CD9FA9`; `ProjectionDLQ7E1DC66F` | `BndyEnrichmentStack` | `bndy-enrichment` | Deployed template + stack resources | No |
| Source-scan queue/DLQ | `...SourceScanQueue1C378650-2ik6EDD7UUyd`; `...SourceScanDLQB39C3B51-HFgXfNWhjtQ7` | `SourceScanQueue1C378650`; `SourceScanDLQB39C3B51` | `BndyEnrichmentStack` | `bndy-enrichment` | Deployed template + stack resources | No |
| Historical failure quarantine | `...HistoricalSourceFailureQuarantine6F3AD1FE-QMUFWmB2M4oD` | `HistoricalSourceFailureQuarantine6F3AD1FE` | `BndyEnrichmentStack` | `bndy-enrichment` | Deployed template; no active consumer mapping | No; explicitly **not** an active DLQ |
| Backline workers | stack-named admin API, browser-source, claim-authority, Google-discovery, projection, planner, dispatcher, source-health, source worker and trust-loop Lambdas | `BacklineAdminApi9B1E7442`; `BrowserSourceWorkerCA2BC3A6`; `ClaimAuthorityStreamWorker0E6B1DD9`; `GoogleDiscoveryWorker66B9CA30`; `ProjectionWorker2E654DBF`; `ScanPlannerBC522289`; `SourceDispatcherB94114BB`; `SourceHealthWorkerB381903F`; `SourceWorker336FEA29`; `TrustLoop620D9456` | `BndyEnrichmentStack` | `bndy-enrichment` | Deployed template + exact stack mapping | No stack collision |
| Backline rules | nine stack-named rules for capture scan, daily scan, Lemonrock health/fast/monthly, On The Case hourly, dispatch, source health and trust-loop classification | `CaptureScanRuleA091BC00`; `DailyScanRule81F5C117`; `LemonrockDailyHealthCheckEE745091`; `LemonrockFastGigTickB23E8683`; `LemonrockMonthlyFutureReconcileE22F76CE`; `OnTheCaseHourlyGigTick6AD850EB`; `SourceDispatchTick13E0B2C9`; `SourceHealthTick0308599E`; `TrustLoopDailyClassification6A973B5D` | `BndyEnrichmentStack` | `bndy-enrichment` | Deployed template + stack mapping | **Yes:** On The Case also has a Signals runner/rule path |
| Capture processor | `bndy-capture-processor` | `CaptureProcessorA6E403AD` | `BndyEnrichmentStack` | `bndy-enrichment` | Deployed template + live stack mapping | **Yes:** two active workflows in `bndy-serverless-api` can directly hot-deploy it |
| Capture scanner | `bndy-capture-scan` | `CaptureScannerA0D85922` | `BndyEnrichmentStack` | `bndy-enrichment` | Deployed template + live stack mapping | Operational acceptance workflows can invoke it; no second IaC owner found |
| Capture API Lambda | `bndy-capture-CaptureFunction-BVTWEGNTT6jJ` | `CaptureFunction` | `bndy-capture` | `bndy-capture` | Deployed template + stack mapping | No |
| Capture table | `bndy-capture-CapturesTable-7YKTGU5HDPA4` | `CapturesTable` | `bndy-capture` | `bndy-capture` | Deployed template + stack mapping | No |
| Capture image bucket | `bndy-capture-images-771551874768-eu-west-2` | `CaptureImagesBucket` | `bndy-capture` | `bndy-capture` | Deployed template + stack mapping | No |
| Entity Claims | `bndy-entity-claims` | `EntityClaimsTable` | `bndy-serverless-api` | `bndy-serverless-api` | Imported live stack resource, `UPDATE_COMPLETE` | No current owner collision; historically collided with Enrichment |
| Entity Memberships | `bndy-entity-memberships` | `EntityMembershipsTable` | `bndy-serverless-api` | `bndy-serverless-api` | Imported live stack resource, `UPDATE_COMPLETE` | No current collision |
| Entity Invites | `bndy-entity-invites` | `EntityInvitesTable` | `bndy-serverless-api` | `bndy-serverless-api` | Imported live stack resource, `UPDATE_COMPLETE` | No current collision |
| Join Analytics | `bndy-join-analytics` | `JoinAnalyticsTable` | `bndy-serverless-api` | `bndy-serverless-api` | Imported live stack resource, `UPDATE_COMPLETE` | No current collision |
| Canonical Artists | `bndy-artists` | None | **No CloudFormation owner** | Undeclared; heavily consumed by `bndy-serverless-api` | DynamoDB list + `DescribeStackResources` returns no owning stack | **Yes:** stateful production table without IaC authority |
| Canonical Venues | `bndy-venues` | None | **No CloudFormation owner** | Undeclared; heavily consumed by `bndy-serverless-api` | DynamoDB list + no owning stack | **Yes** |
| Canonical Events | `bndy-events` | None | **No CloudFormation owner** | Undeclared; heavily consumed by `bndy-serverless-api` | DynamoDB list + no owning stack | **Yes** |
| Source Inspector Lambda | `bndy-source-inspector-SourceInspectorFunction-a7P9shrPou6W` | `SourceInspectorFunction` | `bndy-source-inspector` | `bndy-serverless-api` | Deployed template has Lambda + permission only | **Yes:** automatic SAM workflow is armed in another stack's main workflow chain |
| Source Inspector route/integration | Production HTTP API child objects, IDs recorded in Phase 7 | None | **No CloudFormation owner** | Intended repository is unresolved | Neither deployed template contains `AWS::ApiGatewayV2::Route` or `Integration`; workflow uses direct CLI | **Yes — direct destructive CLI ownership** |
| Signals source runners, dev/prod | `bndy-{gigs-news,klma,onthecase,sceniceye}-runner-{dev,prod}` | `GigsNewsRunnerFn5895B928`; `KlmaRunnerFn0E5EC8FB`; `OnTheCaseRunnerFnCCCCCA8C`; `ScenicEyeRunnerFn00C951E2` | `BndySourceRunner-dev` / `prod` | `bndy-signals` | Deployed templates + exact stack mappings | **Yes:** source overlap with Backline/Cowork; prod template/live trigger mismatch |
| Signals intelligence pass, dev/prod | `bndy-intelligence-pass-{dev,prod}` and matching EventBridge trigger | `IntelligencePassFn534CBC29`; `IntelligencePassS3Trigger1516BA81` | `BndySourceRunner-dev` / `prod` | `bndy-signals` | Deployed templates + stack mapping | Prod trigger is drifted disabled; template expects enabled |
| Signals source state/review, dev/prod | `bndy-source-state-{dev,prod}`; `bndy-source-review-{dev,prod}` | `SourceStateTable69DA611C`; `SourceReviewTableE031BB9A` | `BndySourceRunner-dev` / `prod` | `bndy-signals` | Deployed templates + stack mapping | No physical owner collision |
| Signals canonical storage, dev/prod | `bndy-signals-{dev,prod}` | `SignalsTableE8D63F6D` | `BndySignals-Storage-dev` / `prod` | `bndy-signals` | Deployed templates + stack mapping | No physical owner collision |

### Ownership conclusions

- Stack ownership for the recovered four imported entity tables is now coherent and belongs to `bndy-serverless-api`; Enrichment consumes the Claims stream but does not own the table.
- The three canonical Artists/Venues/Events tables exist and are actively referenced, but no active CloudFormation stack owns them. “Used by serverless API” is not the same as IaC ownership.
- `bndy-capture-processor` has one live CloudFormation owner but three code-release authorities: Enrichment CDK and two direct serverless-repository workflows.
- The Source Inspector Lambda has a small dedicated stack; its production HTTP API route and integration have no stack owner and are reconstructed destructively by CLI.
- The historical `bndy-infrastructure` repository owns none of the scoped live resources and remains non-authoritative.
- Source acquisition authority is not singular: On The Case exists in both Enrichment and Signals, with Cowork still pending Phase 16.

## 6. Lambda and trigger inventory

### Complete Lambda configuration snapshot

All **74** functions are `Zip` package type, have 512 MiB ephemeral storage, are `Active`, and have `Successful` last-update status. Every function exposes only `$LATEST`; therefore no aliases or provisioned-concurrency configurations exist. No function has a Lambda dead-letter configuration (queue redrive is inventoried separately). All functions use x86_64 except the two `bndy-capture` functions, which use arm64.

Tracing is `Active` for all serverless API and Capture functions and `PassThrough` elsewhere. The shared layer `bndy-jwt:3` is attached to Source Inspector and all serverless API functions except `JoinAnalyticsFunction`; no other relevant function has a layer. Reserved concurrency is absent except:

- Enrichment `SourceWorker336FEA29`: `2`.
- Production `bndy-gigs-news-runner-prod`, `bndy-klma-runner-prod`, `bndy-onthecase-runner-prod`, `bndy-sceniceye-runner-prod`, and `bndy-intelligence-pass-prod`: `0` (fail-closed).
- The production Source Runner custom log-retention provider has no reservation.

Times below are UTC. Environment **values were never emitted**.

| Owning stack | Logical ID | Function name | Runtime / arch | Handler | Code SHA-256 | Last modified UTC | MiB / timeout s | Environment variable names |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `bndy-capture` | `CaptureFunction` | `bndy-capture-CaptureFunction-BVTWEGNTT6jJ` | python3.12 / arm64 | `app.lambda_handler` | `H5RUMJTOSX4OjfvNHrmmpz8lNn+R1DFdhcBY2YXI2dA=` | 2026-08-30 16:38:39 | 256 / 10 | ALLOWED_ORIGIN, CAPTURE_TOKEN, CAPTURES_TABLE, IMAGE_BUCKET, PUBLIC_ALLOWED_ORIGINS, PUBLIC_MAX_IMAGE_BYTES, PUBLIC_RATE_LIMIT, PUBLIC_RATE_WINDOW_SECONDS, WHATSAPP_ENABLED, WHATSAPP_GRAPH_VERSION, WHATSAPP_QUEUE_URL, WHATSAPP_SECRET_ARN |
| `bndy-capture` | `WhatsAppWorkerFunction` | `bndy-capture-WhatsAppWorkerFunction-kga4qq5E2vHX` | python3.12 / arm64 | `app.whatsapp_worker_handler` | `H5RUMJTOSX4OjfvNHrmmpz8lNn+R1DFdhcBY2YXI2dA=` | 2026-08-30 16:38:34 | 256 / 30 | ALLOWED_ORIGIN, CAPTURE_TOKEN, CAPTURES_TABLE, IMAGE_BUCKET, PUBLIC_ALLOWED_ORIGINS, PUBLIC_MAX_IMAGE_BYTES, PUBLIC_RATE_LIMIT, PUBLIC_RATE_WINDOW_SECONDS, WHATSAPP_ENABLED, WHATSAPP_GRAPH_VERSION, WHATSAPP_QUEUE_URL, WHATSAPP_SECRET_ARN |
| `bndy-serverless-api` | `ArtistsFunction` | `bndy-serverless-api-ArtistsFunction-4wCJA9JLMwF5` | nodejs22.x / x86_64 | `handler.handler` | `zWpCnUZhbdWFa3+SfsIXk1do4z5NkS0byKBY5bL4lCA=` | 2026-08-30 16:08:36 | 512 / 30 | GATE_MODE, JWT_SECRET, MCP_SERVICE_TOKEN, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `ArtistSongsFunction` | `bndy-serverless-api-ArtistSongsFunction-gbHmDyNdSoSx` | nodejs20.x / x86_64 | `handler.handler` | `/MdBJwIiUm/lA92wUrdugFwUuwZWGoFYHyLdhEJj0ic=` | 2026-08-29 21:21:18 | 512 / 30 | GATE_MODE, JWT_SECRET, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `AuthFunction` | `bndy-serverless-api-AuthFunction-gKJksEC1lGjw` | nodejs22.x / x86_64 | `handler.handler` | `1XRvsBVVh2w+RtDffoFuGA3wBIzAn25eMchx3Sn/rE8=` | 2026-08-30 16:08:36 | 512 / 30 | COGNITO_USER_POOL_CLIENT_ID, COGNITO_USER_POOL_CLIENT_SECRET, GATE_MODE, JWT_SECRET, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `BuildersFunction` | `bndy-serverless-api-BuildersFunction-uOQgtdHFxjtK` | nodejs20.x / x86_64 | `handler.handler` | `+bENEjhYbdJ9nckez+a0TkXOZ8OULf0ILHih4tJnXCw=` | 2026-08-29 21:21:17 | 512 / 30 | BUILDER_VENUES_TABLE, BUILDER_WHITELIST, BUILDERS_TABLE, GATE_MODE, JWT_SECRET, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `CalendarFunction` | `bndy-serverless-api-CalendarFunction-pm1VDgjlUJls` | nodejs20.x / x86_64 | `handler.handler` | `4DGeBTv+X9QzR/YKuYhlrNPzsEAuYBKiRht3WZtiyM4=` | 2026-08-30 16:08:36 | 1024 / 60 | GATE_MODE, JWT_SECRET, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `ClaimsFunction` | `bndy-serverless-api-ClaimsFunction-CHixeE5rBsCH` | nodejs22.x / x86_64 | `handler.handler` | `yhsYDgPIqss8e/Qg0D0ES/GY3cZGQyT81MlMpYVf9r8=` | 2026-08-30 16:08:36 | 512 / 30 | ENTITY_CLAIMS_TABLE, ENTITY_MEMBERSHIPS_TABLE, GATE_MODE, JWT_SECRET, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `EntityInvitesFunction` | `bndy-serverless-api-EntityInvitesFunction-paSUVSTSsnQv` | nodejs22.x / x86_64 | `handler.handler` | `DRIPgHfg9T9yNuKKFlkFA2CnvPePXH9ufq+Ur7BewUg=` | 2026-08-30 16:08:36 | 512 / 30 | ENTITY_INVITES_TABLE, ENTITY_MEMBERSHIPS_TABLE, GATE_MODE, JWT_SECRET, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `EntityMembershipsFunction` | `bndy-serverless-api-EntityMembershipsFunction-5eCV4kiEvcg5` | nodejs22.x / x86_64 | `handler.handler` | `cdZ/i5dtA0uxDeoA4TeM1mnuruV7S9t5Lg4i4i0Cq+c=` | 2026-08-30 16:08:36 | 512 / 30 | ENTITY_MEMBERSHIPS_TABLE, GATE_MODE, JWT_SECRET, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `EventsAgentFunction` | `bndy-serverless-api-EventsAgentFunction-axkjUtQOMf5T` | nodejs20.x / x86_64 | `handler.handler` | `+SbS3fRkLyRFxZAgwStkbjvZcxq441xl/AiMm2xK0Uo=` | 2026-08-30 16:08:35 | 512 / 300 | GATE_MODE, JWT_SECRET, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `EventsCuratorFunction` | `bndy-serverless-api-EventsCuratorFunction-v6iLLgPxrRkg` | nodejs20.x / x86_64 | `handler.handler` | `4DGeBTv+X9QzR/YKuYhlrNPzsEAuYBKiRht3WZtiyM4=` | 2026-08-30 16:08:36 | 1024 / 60 | GATE_MODE, JWT_SECRET, MCP_SERVICE_TOKEN, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `EventsFunction` | `bndy-serverless-api-EventsFunction-03skAPFIwe9g` | nodejs22.x / x86_64 | `handler.handler` | `4DGeBTv+X9QzR/YKuYhlrNPzsEAuYBKiRht3WZtiyM4=` | 2026-08-30 16:08:36 | 1024 / 60 | GATE_MODE, JWT_SECRET, MCP_SERVICE_TOKEN, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `ExpensesFunction` | `bndy-serverless-api-ExpensesFunction-Bnz5w8tLpkb8` | nodejs20.x / x86_64 | `handler.handler` | `a4fZk1aI2UJOkDUDx1xPkNoX3it7jaeceec1RM2Bf3Y=` | 2026-08-30 16:08:36 | 512 / 30 | GATE_MODE, JWT_SECRET, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `FestivalsFunction` | `bndy-serverless-api-FestivalsFunction-ltYkkG704zfV` | nodejs20.x / x86_64 | `handler.handler` | `kRMFYRPB6kLWHw7jEcasydIEG6KC1iVsFEuSqO6wO3Y=` | 2026-08-30 16:08:36 | 512 / 30 | GATE_MODE, JWT_SECRET, MCP_SERVICE_TOKEN, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `InvitesFunction` | `bndy-serverless-api-InvitesFunction-yhX3zozC79xA` | nodejs20.x / x86_64 | `handler.handler` | `cUx/lza8GW3UfeWXKkj1T68tZtbPYYuQwJg8hKcg0KQ=` | 2026-08-30 16:08:36 | 512 / 30 | GATE_MODE, JWT_SECRET, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `IssuesFunction` | `bndy-serverless-api-IssuesFunction-5IgjRk6sRhe8` | nodejs20.x / x86_64 | `handler.handler` | `I9+ybihEr9TfMpOjyN6RGY2r2EjniG58f1sPgTiOZRw=` | 2026-08-29 21:21:17 | 512 / 30 | GATE_MODE, JWT_SECRET, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `JoinAnalyticsFunction` | `bndy-serverless-api-JoinAnalyticsFunction-klzLo4lX7qqK` | nodejs22.x / x86_64 | `handler.handler` | `683f5QVSvFzXW7ZgokaLSEwAafXEGyqjvOQ4/X//ZQA=` | 2026-08-30 16:08:36 | 512 / 30 | GATE_MODE, JOIN_ANALYTICS_TABLE, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `MembershipsFunction` | `bndy-serverless-api-MembershipsFunction-adBmJyeWuWLA` | nodejs20.x / x86_64 | `handler.handler` | `Q6fb/tRrYfdX4aqpdY87lSJZRg6MpFzh2aVDfOrEsns=` | 2026-08-30 16:08:36 | 512 / 30 | GATE_MODE, JWT_SECRET, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `NotificationsFunction` | `bndy-serverless-api-NotificationsFunction-jSSPxlg9MAcR` | nodejs20.x / x86_64 | `handler.handler` | `Eo2r1O+JTNecjeyiKg3pB9ieJKQO4hPVTAgCob+/R64=` | 2026-08-30 16:08:36 | 512 / 30 | GATE_MODE, JWT_SECRET, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `OwnershipFunction` | `bndy-serverless-api-OwnershipFunction-finwDwrKVzch` | nodejs22.x / x86_64 | `handler.handler` | `0wIyB/+ADLjMvhPetzrpKRUTzojx14hJuNV3eawAOg8=` | 2026-08-30 16:08:36 | 512 / 30 | ARTIST_MEMBERSHIPS_TABLE, ENTITY_MEMBERSHIPS_TABLE, GATE_MODE, JWT_SECRET, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `SetlistsFunction` | `bndy-serverless-api-SetlistsFunction-wUqy1CYSx17Y` | nodejs20.x / x86_64 | `handler.handler` | `UIGccEPzjTJx83nHArisbhbY8jogtPHr9jldKfWUqwI=` | 2026-08-30 16:08:36 | 512 / 30 | GATE_MODE, JWT_SECRET, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `SongsFunction` | `bndy-serverless-api-SongsFunction-c3eFxAdsTmeS` | nodejs20.x / x86_64 | `handler.handler` | `H8VJpgLqHM2P/oqnvssc9W5gCet8d8zPlklrsAGrXOk=` | 2026-08-29 21:21:17 | 512 / 30 | GATE_MODE, JWT_SECRET, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `SourceRunsFunc` | `bndy-serverless-api-SourceRunsFunc-bUjoJCjAxPH2` | nodejs20.x / x86_64 | `handler.handler` | `36//BnACPOPrDelyGdUtrc4w5DBoFNse7Wd3zYtzysM=` | 2026-08-30 16:08:36 | 512 / 30 | GATE_MODE, NODE_ENV, SOURCE_RUNS_BUCKET, SOURCE_RUNS_TOKEN, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `SpotifyFunction` | `bndy-serverless-api-SpotifyFunction-dfAWTwGUnJFf` | nodejs20.x / x86_64 | `handler.handler` | `eFWvlvhqHdANfMnl0I///ljl5hwdmj7SMb21cKXGvU4=` | 2026-08-30 16:08:36 | 512 / 30 | GATE_MODE, JWT_SECRET, NODE_ENV, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `UploadsFunction` | `bndy-serverless-api-UploadsFunction-AZ3judAhrxT2` | nodejs22.x / x86_64 | `handler.handler` | `3DJmV+Qu/dbpl3ZeFTIjgrsmGCp9pgjLI/kPNW6MXDA=` | 2026-08-30 16:08:36 | 512 / 30 | GATE_MODE, JWT_SECRET, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `UsersFunction` | `bndy-serverless-api-UsersFunction-HNQeQw7kJO9b` | nodejs22.x / x86_64 | `handler.handler` | `0EZuMMDff9dp4+7neU9voNEpfXqlSN++KM3tPbklAgk=` | 2026-08-30 16:08:36 | 512 / 30 | GATE_MODE, JWT_SECRET, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `VenueCRMFunction` | `bndy-serverless-api-VenueCRMFunction-Pq0Nqtm5MJUc` | nodejs20.x / x86_64 | `handler.handler` | `7rvLbsrl7BLriM0vX0xWVASbEk0pIPsdkXr/ORAyKdg=` | 2026-08-30 16:08:36 | 512 / 30 | GATE_MODE, JWT_SECRET, NODE_ENV, UNIQUE_KEYS_TABLE |
| `bndy-serverless-api` | `VenuesFunction` | `bndy-serverless-api-VenuesFunction-z91LnIIRKHhq` | nodejs22.x / x86_64 | `handler.handler` | `aQAvjgh0nlPhBTv0Qdn/OVirrKCjZGHGFFptKJ6+WjU=` | 2026-08-30 16:08:36 | 512 / 30 | ENTITY_MEMBERSHIPS_TABLE, GATE_MODE, GOOGLE_PLACES_API_KEY, JWT_SECRET, MCP_SERVICE_TOKEN, NODE_ENV, UNIQUE_KEYS_TABLE, VENUE_GROUPS_TABLE |
| `bndy-source-inspector` | `SourceInspectorFunction` | `bndy-source-inspector-SourceInspectorFunction-a7P9shrPou6W` | nodejs20.x / x86_64 | `source-inspector-v3.handler` | `NArX64RXocHu7qxyRIXVmJbdNhQjbzgJs21ejsYmejQ=` | 2026-08-24 16:54:01 | 256 / 8 | ARTISTS_TABLE, NODE_ENV, UNIQUE_KEYS_TABLE |
| `BndyEnrichmentStack` | `BacklineAdminApi9B1E7442` | `BndyEnrichmentStack-BacklineAdminApi9B1E7442-64rdprEIyZ9E` | nodejs22.x / x86_64 | `index.handler` | `+4TL8uqhiyUP2Oqj98P9rZ29u0xZr5qawnfhAfTVtHY=` | 2026-08-30 20:08:48 | 512 / 30 | BNDY_SERVICE_SECRET_NAME, STATE_TABLE |
| `BndyEnrichmentStack` | `BrowserSourceWorkerCA2BC3A6` | `BndyEnrichmentStack-BrowserSourceWorkerCA2BC3A6-KeJDw5n4rGX0` | nodejs22.x / x86_64 | `index.handler` | `fSIGu5/JhICQO4Zu4HER+KJmjy0sDYPsCMD/zLEKuLY=` | 2026-08-30 20:08:51 | 3072 / 840 | EVIDENCE_BUCKET, PROJECTION_QUEUE_URL, STATE_TABLE |
| `BndyEnrichmentStack` | `CaptureProcessorA6E403AD` | `bndy-capture-processor` | nodejs22.x / x86_64 | `index.handler` | `1j4JD/627XAzmPI0kqcofyETrx4MG0K9I2ZZhKCdfqw=` | 2026-08-30 20:08:49 | 1024 / 300 | BNDY_API_BASE, BNDY_SERVICE_SECRET_NAME, CAPTURE_API_BASE, CAPTURE_SECRET_NAME, GEMINI_MODEL, GEMINI_SECRET_ARN, SEARCH_HORIZON_DAYS |
| `BndyEnrichmentStack` | `CaptureScannerA0D85922` | `bndy-capture-scan` | nodejs22.x / x86_64 | `index.handler` | `p4LQWpiEJ0ndfwPEH/38m2057yNJQvxWjcFNz1aJM6o=` | 2026-08-30 20:08:49 | 512 / 60 | CAPTURE_API_BASE, CAPTURE_QUEUE_URL, CAPTURE_SCAN_LIMIT, CAPTURE_SECRET_NAME |
| `BndyEnrichmentStack` | `ClaimAuthorityStreamWorker0E6B1DD9` | `BndyEnrichmentStack-ClaimAuthorityStreamWorker0E6B-SWUTdZhEakId` | nodejs22.x / x86_64 | `index.handler` | `6DWLsfYE5IutVciurLJbS/LnnHKtFT82TQK9GBbCm1w=` | 2026-08-30 20:08:49 | 256 / 30 | STATE_TABLE |
| `BndyEnrichmentStack` | `GoogleDiscoveryWorker66B9CA30` | `BndyEnrichmentStack-GoogleDiscoveryWorker66B9CA30-Nc72FG6J3ShU` | nodejs22.x / x86_64 | `index.handler` | `IdlSyh7rDZIDsCeM4etR996apXQ5XMcd4Bb84yB39XU=` | 2026-08-30 20:09:12 | 1024 / 300 | EVIDENCE_BUCKET, GEMINI_MODEL, GEMINI_SECRET_ARN, SEARCH_HORIZON_DAYS, STATE_TABLE |
| `BndyEnrichmentStack` | `ProjectionWorker2E654DBF` | `BndyEnrichmentStack-ProjectionWorker2E654DBF-8omMuPbBsAna` | nodejs22.x / x86_64 | `index.handler` | `19Os1uol99j/VraLiX7v1zoNn1PfeLMnZlPpCZGutzA=` | 2026-08-30 20:08:49 | 1024 / 240 | BNDY_API_BASE, BNDY_SERVICE_SECRET_NAME, ENTITY_ENRICHMENT_QUEUE_URL, STATE_TABLE |
| `BndyEnrichmentStack` | `ScanPlannerBC522289` | `BndyEnrichmentStack-ScanPlannerBC522289-D9WXLIcdx9Wi` | nodejs22.x / x86_64 | `index.handler` | `h2BvKOT8QDOTYbs2XFBJGAZjfjK/XJE9b5nblW/tbQE=` | 2026-08-30 20:08:49 | 1024 / 30 | GOOGLE_QUEUE_URL, STATE_TABLE |
| `BndyEnrichmentStack` | `SourceDispatcherB94114BB` | `BndyEnrichmentStack-SourceDispatcherB94114BB-RqgXyjZuSD0a` | nodejs22.x / x86_64 | `index.handler` | `m1/o/ZX4t5vebRCJbfV3r0yNNqTdlhKx3IF3vwNy21c=` | 2026-08-30 20:08:49 | 512 / 30 | BROWSER_SCAN_QUEUE_URL, PROJECTION_QUEUE_URL, SOURCE_SCAN_QUEUE_URL, STATE_TABLE |
| `BndyEnrichmentStack` | `SourceHealthWorkerB381903F` | `BndyEnrichmentStack-SourceHealthWorkerB381903F-CXSWKQigdrRx` | nodejs22.x / x86_64 | `index.handler` | `NyNAX2uuLYVXW2N2nrLghLDLioYJCpqkS/wEVfkDFcY=` | 2026-08-30 20:09:22 | 256 / 30 | STATE_TABLE |
| `BndyEnrichmentStack` | `SourceWorker336FEA29` | `BndyEnrichmentStack-SourceWorker336FEA29-ghZk2mBRjOks` | nodejs22.x / x86_64 | `index.handler` | `6/f+WsAQLGRDxj9youufEy95Jhemdnr+wvJ2eSm2eBU=` | 2026-08-30 20:08:49 | 1024 / 840 | EVIDENCE_BUCKET, PROJECTION_QUEUE_URL, SOURCE_SCAN_QUEUE_URL, STATE_TABLE |
| `BndyEnrichmentStack` | `TrustLoop620D9456` | `BndyEnrichmentStack-TrustLoop620D9456-uGPEj1SDMLZy` | nodejs22.x / x86_64 | `index.handler` | `EdVTt6MiaQVqPOf43c3nT+HCbLAR5QnfODzjvzcMpAc=` | 2026-08-30 20:08:49 | 1024 / 600 | STATE_TABLE |
| `BndySignals-Api-dev` | `ClaimReviewFn0A50568D` | `bndy-signals-claim-review-dev` | nodejs20.x / x86_64 | `index.handler` | `HDYseWQYXLsD16jX592GDy6fapUBpEpXHcgLBAwQWuI=` | 2026-06-16 22:33:10 | 256 / 30 | SIGNALS_TABLE, STAGE |
| `BndySignals-Api-dev` | `ClarificationApiFnB1350347` | `bndy-signals-clarification-api-dev` | nodejs20.x / x86_64 | `index.handler` | `QZJl4b1dasfSvAaBWLgLAzdt0j1ZEj6Jo9/Dek1DWdc=` | 2026-05-05 08:13:13 | 256 / 30 | SIGNALS_TABLE, STAGE |
| `BndySignals-Api-dev` | `EventCandidateApiFnD7145113` | `bndy-signals-event-candidate-api-dev` | nodejs20.x / x86_64 | `index.handler` | `7cicmdN+BkwsBw2/qAZSp46HKVuokK2PHKzqbQWzyFs=` | 2026-05-04 13:01:39 | 256 / 30 | SIGNALS_TABLE, STAGE |
| `BndySignals-Api-dev` | `SignalGetFn57AC2379` | `bndy-signals-get-dev` | nodejs20.x / x86_64 | `index.handler` | `dssoGUcLS0xGWw2WH4LVtXD+7sEqZGZRM7wLp65FByU=` | 2026-05-04 22:49:03 | 256 / 30 | SIGNALS_BUCKET, SIGNALS_TABLE, STAGE |
| `BndySignals-Api-dev` | `SignalIntakeFn2670C829` | `bndy-signals-intake-dev` | nodejs20.x / x86_64 | `index.handler` | `9eUzOutKYNWehK8gIwjWgVAQ0FTuHsp9qrAWZDeiV6c=` | 2026-05-04 22:18:33 | 256 / 30 | SIGNAL_WORKFLOW_ARN, SIGNALS_BUCKET, SIGNALS_TABLE, STAGE |
| `BndySignals-Api-prod` | `ClaimReviewFn0A50568D` | `bndy-signals-claim-review-prod` | nodejs20.x / x86_64 | `index.handler` | `HDYseWQYXLsD16jX592GDy6fapUBpEpXHcgLBAwQWuI=` | 2026-06-17 13:41:50 | 256 / 30 | SIGNALS_TABLE, STAGE |
| `BndySignals-Api-prod` | `ClarificationApiFnB1350347` | `bndy-signals-clarification-api-prod` | nodejs20.x / x86_64 | `index.handler` | `QZJl4b1dasfSvAaBWLgLAzdt0j1ZEj6Jo9/Dek1DWdc=` | 2026-06-17 13:41:50 | 256 / 30 | SIGNALS_TABLE, STAGE |
| `BndySignals-Api-prod` | `EventCandidateApiFnD7145113` | `bndy-signals-event-candidate-api-prod` | nodejs20.x / x86_64 | `index.handler` | `7cicmdN+BkwsBw2/qAZSp46HKVuokK2PHKzqbQWzyFs=` | 2026-06-17 13:41:50 | 256 / 30 | SIGNALS_TABLE, STAGE |
| `BndySignals-Api-prod` | `SignalGetFn57AC2379` | `bndy-signals-get-prod` | nodejs20.x / x86_64 | `index.handler` | `dssoGUcLS0xGWw2WH4LVtXD+7sEqZGZRM7wLp65FByU=` | 2026-06-17 13:41:50 | 256 / 30 | SIGNALS_BUCKET, SIGNALS_TABLE, STAGE |
| `BndySignals-Api-prod` | `SignalIntakeFn2670C829` | `bndy-signals-intake-prod` | nodejs20.x / x86_64 | `index.handler` | `9eUzOutKYNWehK8gIwjWgVAQ0FTuHsp9qrAWZDeiV6c=` | 2026-06-17 13:41:50 | 256 / 30 | SIGNAL_WORKFLOW_ARN, SIGNALS_BUCKET, SIGNALS_TABLE, STAGE |
| `BndySignals-Workflow-dev` | `ClarificationGeneratorFn2F86C6CB` | `bndy-signals-clarification-gen-dev` | nodejs20.x / x86_64 | `index.handler` | `vjWKElDYBJT2PRHUjBBlNjd8zfFM+C3Y9OMm9wiPrkc=` | 2026-05-04 22:17:26 | 256 / 60 | SIGNALS_TABLE, STAGE |
| `BndySignals-Workflow-dev` | `ExtractorFn0C95F7E9` | `bndy-signals-extractor-dev` | nodejs20.x / x86_64 | `index.handler` | `+S6jBdwAd+o+9SPJUyV/ouis4aalCN2GBv66VLWY6Cw=` | 2026-05-03 18:13:49 | 1024 / 300 | SIGNALS_BUCKET, SIGNALS_TABLE, STAGE |
| `BndySignals-Workflow-dev` | `FailureHandlerFn01314552` | `bndy-signals-failure-handler-dev` | nodejs20.x / x86_64 | `index.handler` | `Ded+dQp1VF4359+Z8p7Ys02utsHTUQitGo7faXkTsv4=` | 2026-05-01 23:11:49 | 256 / 30 | DLQ_URL, SIGNALS_TABLE, STAGE |
| `BndySignals-Workflow-dev` | `InterpreterFn608A6A2E` | `bndy-signals-interpreter-dev` | nodejs20.x / x86_64 | `index.handler` | `5bDXFJ7bmyL34EbJQU1pMKtLJObou26Ncg6WN0j0Q6c=` | 2026-05-04 22:48:23 | 1024 / 300 | BEDROCK_MODEL_ID, MODEL_INPUT_COST_PER_1K, MODEL_OUTPUT_COST_PER_1K, SIGNALS_TABLE, STAGE |
| `BndySignals-Workflow-dev` | `PackBuilderFn77373EE1` | `bndy-signals-pack-builder-dev` | nodejs20.x / x86_64 | `index.handler` | `BtNx5cD+J3MlAtpHP0HwcPBesb2Z8kehXho4tOi4qRg=` | 2026-05-04 22:48:24 | 512 / 120 | SIGNALS_TABLE, STAGE |
| `BndySignals-Workflow-prod` | `ClarificationGeneratorFn2F86C6CB` | `bndy-signals-clarification-gen-prod` | nodejs20.x / x86_64 | `index.handler` | `vjWKElDYBJT2PRHUjBBlNjd8zfFM+C3Y9OMm9wiPrkc=` | 2026-06-17 13:39:42 | 256 / 60 | SIGNALS_TABLE, STAGE |
| `BndySignals-Workflow-prod` | `ExtractorFn0C95F7E9` | `bndy-signals-extractor-prod` | nodejs20.x / x86_64 | `index.handler` | `+S6jBdwAd+o+9SPJUyV/ouis4aalCN2GBv66VLWY6Cw=` | 2026-06-17 13:39:43 | 1024 / 300 | SIGNALS_BUCKET, SIGNALS_TABLE, STAGE |
| `BndySignals-Workflow-prod` | `FailureHandlerFn01314552` | `bndy-signals-failure-handler-prod` | nodejs20.x / x86_64 | `index.handler` | `Ded+dQp1VF4359+Z8p7Ys02utsHTUQitGo7faXkTsv4=` | 2026-06-17 13:40:09 | 256 / 30 | DLQ_URL, SIGNALS_TABLE, STAGE |
| `BndySignals-Workflow-prod` | `InterpreterFn608A6A2E` | `bndy-signals-interpreter-prod` | nodejs20.x / x86_64 | `index.handler` | `5bDXFJ7bmyL34EbJQU1pMKtLJObou26Ncg6WN0j0Q6c=` | 2026-06-17 13:39:42 | 1024 / 300 | BEDROCK_MODEL_ID, MODEL_INPUT_COST_PER_1K, MODEL_OUTPUT_COST_PER_1K, SIGNALS_TABLE, STAGE |
| `BndySignals-Workflow-prod` | `PackBuilderFn77373EE1` | `bndy-signals-pack-builder-prod` | nodejs20.x / x86_64 | `index.handler` | `BtNx5cD+J3MlAtpHP0HwcPBesb2Z8kehXho4tOi4qRg=` | 2026-06-17 13:39:42 | 512 / 120 | SIGNALS_TABLE, STAGE |
| `BndySourceRunner-dev` | `GigsNewsRunnerFn5895B928` | `bndy-gigs-news-runner-dev` | nodejs20.x / x86_64 | `index.handler` | `bJUSwbbRhRFitjWkkpMrlmx3WDy7n7D4Ey9smIQzggU=` | 2026-06-18 18:08:46 | 2048 / 300 | BNDY_API_BASE, BNDY_SOURCE_RUNS_BUCKET, NODE_ENV, SOURCE_REVIEW_TABLE, SOURCE_STATE_TABLE, STAGE |
| `BndySourceRunner-dev` | `IntelligencePassFn534CBC29` | `bndy-intelligence-pass-dev` | nodejs20.x / x86_64 | `index.handler` | `i0xOwjqBmnCVf+ZJwxp1XnuuRQz0ssDzPgnwqv5biLs=` | 2026-06-18 13:08:27 | 1024 / 300 | BNDY_API_BASE, BNDY_API_URL, BNDY_SOURCE_RUNS_BUCKET, DRY_RUN, MAX_COST_PER_RUN, MAX_ITEMS_PER_RUN, NODE_ENV, SOURCE_REVIEW_TABLE, SOURCE_RUNS_BUCKET, SOURCE_STATE_TABLE, STAGE |
| `BndySourceRunner-dev` | `KlmaRunnerFn0E5EC8FB` | `bndy-klma-runner-dev` | nodejs20.x / x86_64 | `index.handler` | `paMQVZF5hfQaRZLIFukaGGZKeOX3tv0L+Q+LKsm87W8=` | 2026-06-18 18:08:43 | 512 / 300 | BNDY_API_BASE, BNDY_SOURCE_RUNS_BUCKET, NODE_ENV, SOURCE_REVIEW_TABLE, SOURCE_STATE_TABLE, STAGE |
| `BndySourceRunner-dev` | `LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A` | `BndySourceRunner-dev-LogRetentionaae0aa3c5b4d4f87b-xEgUBaG6XHb0` | nodejs24.x / x86_64 | `index.handler` | `pGKLvOYNjMKMXsm2uFkMPuAFBE+yi4V7pWHVTZAKGfo=` | 2026-06-16 22:30:18 | 128 / 900 | — |
| `BndySourceRunner-dev` | `OnTheCaseRunnerFnCCCCCA8C` | `bndy-onthecase-runner-dev` | nodejs20.x / x86_64 | `index.handler` | `VeCzt2AMX4cYi8FgSmNInHQexOeGWsorZs1GfZ75/gw=` | 2026-06-18 18:08:46 | 2048 / 300 | BNDY_API_BASE, BNDY_SOURCE_RUNS_BUCKET, NODE_ENV, SOURCE_REVIEW_TABLE, SOURCE_STATE_TABLE, STAGE |
| `BndySourceRunner-dev` | `ScenicEyeRunnerFn00C951E2` | `bndy-sceniceye-runner-dev` | nodejs20.x / x86_64 | `index.handler` | `ECxAo8U+cMH53E/e4bBOb0Hpt9/CHi7JRk7vIIa1xBc=` | 2026-06-18 18:08:47 | 2048 / 300 | BNDY_API_BASE, BNDY_SOURCE_RUNS_BUCKET, NODE_ENV, SOURCE_REVIEW_TABLE, SOURCE_STATE_TABLE, STAGE |
| `BndySourceRunner-prod` | `GigsNewsRunnerFn5895B928` | `bndy-gigs-news-runner-prod` | nodejs20.x / x86_64 | `index.handler` | `bJUSwbbRhRFitjWkkpMrlmx3WDy7n7D4Ey9smIQzggU=` | 2026-06-18 18:23:04 | 2048 / 300 | BNDY_API_BASE, BNDY_SOURCE_RUNS_BUCKET, NODE_ENV, SOURCE_REVIEW_TABLE, SOURCE_STATE_TABLE, STAGE |
| `BndySourceRunner-prod` | `IntelligencePassFn534CBC29` | `bndy-intelligence-pass-prod` | nodejs20.x / x86_64 | `index.handler` | `i0xOwjqBmnCVf+ZJwxp1XnuuRQz0ssDzPgnwqv5biLs=` | 2026-06-18 13:16:25 | 1024 / 300 | BNDY_API_BASE, BNDY_API_URL, BNDY_SOURCE_RUNS_BUCKET, DRY_RUN, MAX_COST_PER_RUN, MAX_ITEMS_PER_RUN, NODE_ENV, SOURCE_REVIEW_TABLE, SOURCE_RUNS_BUCKET, SOURCE_STATE_TABLE, STAGE |
| `BndySourceRunner-prod` | `KlmaRunnerFn0E5EC8FB` | `bndy-klma-runner-prod` | nodejs20.x / x86_64 | `index.handler` | `paMQVZF5hfQaRZLIFukaGGZKeOX3tv0L+Q+LKsm87W8=` | 2026-06-18 18:23:00 | 512 / 300 | BNDY_API_BASE, BNDY_SOURCE_RUNS_BUCKET, NODE_ENV, SOURCE_REVIEW_TABLE, SOURCE_STATE_TABLE, STAGE |
| `BndySourceRunner-prod` | `LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A` | `BndySourceRunner-prod-LogRetentionaae0aa3c5b4d4f87-tNd3hAHRxcPu` | nodejs24.x / x86_64 | `index.handler` | `pGKLvOYNjMKMXsm2uFkMPuAFBE+yi4V7pWHVTZAKGfo=` | 2026-06-17 13:36:50 | 128 / 900 | — |
| `BndySourceRunner-prod` | `OnTheCaseRunnerFnCCCCCA8C` | `bndy-onthecase-runner-prod` | nodejs20.x / x86_64 | `index.handler` | `VeCzt2AMX4cYi8FgSmNInHQexOeGWsorZs1GfZ75/gw=` | 2026-06-18 18:22:57 | 2048 / 300 | BNDY_API_BASE, BNDY_SOURCE_RUNS_BUCKET, NODE_ENV, SOURCE_REVIEW_TABLE, SOURCE_STATE_TABLE, STAGE |
| `BndySourceRunner-prod` | `ScenicEyeRunnerFn00C951E2` | `bndy-sceniceye-runner-prod` | nodejs20.x / x86_64 | `index.handler` | `ECxAo8U+cMH53E/e4bBOb0Hpt9/CHi7JRk7vIIa1xBc=` | 2026-06-18 18:23:04 | 2048 / 300 | BNDY_API_BASE, BNDY_SOURCE_RUNS_BUCKET, NODE_ENV, SOURCE_REVIEW_TABLE, SOURCE_STATE_TABLE, STAGE |

### Environment-name classification

- **Canonical-write controls:** no Lambda has an environment variable named `CANONICAL_WRITE`, `CANONICAL_WRITES`, `WRITE_CANONICAL` or equivalent. This absence is not proof that code cannot write; state-table and IAM/runtime gates are checked later.
- **Dry-run controls:** only the two Signals intelligence-pass functions expose `DRY_RUN`.
- **Projection controls:** no boolean projection-control environment name exists. `PROJECTION_QUEUE_URL` is a queue reference, not an enablement flag; the global projection control is stored in DynamoDB and checked in Phase 8.
- **Queue/table/bucket references:** names include `*_QUEUE_URL`, `*_TABLE`, `STATE_TABLE`, `EVIDENCE_BUCKET`, `SIGNALS_BUCKET`, `SOURCE_RUNS_BUCKET`, and `IMAGE_BUCKET`.
- **Provider configuration:** names include `GEMINI_MODEL`, `GEMINI_SECRET_ARN`, `GOOGLE_PLACES_API_KEY`, `BEDROCK_MODEL_ID`, model-cost controls, Spotify/Cognito identifiers and secret references. No value was read or reported.
- **API/source identifiers:** `BNDY_API_BASE`, `BNDY_API_URL`, `CAPTURE_API_BASE`, `NODE_ENV`, `STAGE`, source-state/review names, run limits and source-run buckets.

### Event-source mappings

Only seven mappings exist for the 74 scoped functions; all are enabled. No canonical Artists, Venues or Events stream mapping exists.

| UUID | Function | Source | State / result | Batch / window | Partial batch | Max concurrency | Destination |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `ff22b7c3-d782-4932-a165-20f6558b5ac1` | Claim Authority worker | DynamoDB `bndy-entity-claims` stream | Enabled / `OK` | 10 / 0s | None | None | No success/failure destination |
| `4ca3a209-8df6-4071-9d52-651a4fb791b4` | Browser Source worker | SQS Browser Scan queue | Enabled / no result reported | 1 / 0s | `ReportBatchItemFailures` | None | None |
| `42e9930c-074b-44d9-97d2-2fb15fc32564` | Projection worker | SQS Projection queue | Enabled / no result reported | 1 / 0s | `ReportBatchItemFailures` | None | None |
| `a17dc72f-e8b6-49ce-b3cc-133fd8b25796` | Source worker | SQS Source Scan queue | Enabled / no result reported | 1 / 0s | `ReportBatchItemFailures` | 2 | None |
| `31929135-0183-4beb-82d7-d8236a544da0` | `bndy-capture-processor` | SQS Capture Processing queue | Enabled / no result reported | 1 / 0s | `ReportBatchItemFailures` | None | None |
| `a93e7053-5197-4ac2-b661-bab4a7149600` | Google Discovery worker | SQS Google Discovery queue | Enabled / no result reported | 1 / 0s | `ReportBatchItemFailures` | None | None |
| `c2250d62-dbf0-4498-a809-640d821fd6a5` | Capture WhatsApp worker | SQS WhatsApp queue | Enabled / no result reported | 1 / 0s | `ReportBatchItemFailures` | None | None |

The Claims mapping starts at `LATEST`, bisects batches on error, has unlimited record age, three retry attempts and parallelisation factor 1. It points exactly to `bndy-entity-claims/stream/2026-08-29T16:15:10.440`. No mapping is disabled, failed or unexpected from its owning template.

### Required point determinations

- **Claim authority:** mapped and enabled against `bndy-entity-claims`; last processing result is `OK`.
- **Canonical streams:** no Artist, Venue or Event stream mapping exists.
- **Source Inspector backend:** `bndy-source-inspector-SourceInspectorFunction-a7P9shrPou6W`, handler `source-inspector-v3.handler`, hash `NArX64RXocHu7qxyRIXVmJbdNhQjbzgJs21ejsYmejQ=`, last modified `2026-08-24T16:54:01Z`.
- **Capture processor:** hash `1j4JD/627XAzmPI0kqcofyETrx4MG0K9I2ZZhKCdfqw=`, last modified `2026-08-30T20:08:49Z`. This aligns with the user-confirmed CDK stack update, not either Capture hot-deploy workflow; neither named workflow ran on 30 August.
- **Enrichment deployed revision:** the deployed template is byte-structurally equal after JSON normalisation to local `cdk.out/BndyEnrichmentStack.template.json` produced immediately before the 20:08 deployment, including all twelve asset keys. The source worktree was at `39bae4fcbbe86a27b8e936225c94331cbb343d1c` but dirty, and was three commits behind remote `main`. Therefore the deterministic template/artifact is mapped, but the deployed Git revision remains **`UNMAPPED`**; it must not be labelled `3d6f242` or `39bae4f`.


## 7. Source Inspector incident-after-incident analysis

### Current live API state

The production HTTP API is `qry0k6pmd0`, identified from the `bndy-serverless-api` stack output and live stack resource. It currently has 271 routes and 271 integrations.

| Property | Live value |
| --- | --- |
| Route key / ID | `POST /api/community/source/inspect` / `j9f4rqn` |
| Integration target / ID | `integrations/x5ygbhg` / `x5ygbhg` |
| Integration | `AWS_PROXY`, method `POST`, payload `2.0`, timeout 8,000 ms |
| Lambda target | `bndy-source-inspector-SourceInspectorFunction-a7P9shrPou6W` |
| Authorisation | `NONE`; API key not required; no authorizer ID |
| Duplicates | Exactly one matching route and one integration targeting the Source Inspector Lambda |
| Functional result | **UNVERIFIED** — the audit did not invoke the endpoint; both historical post-closure smoke jobs failed |

Structural coherence does not equal managed ownership or functional health.

### Template ownership

- The deployed `bndy-serverless-api` template contains no `source/inspect` literal and no `AWS::ApiGatewayV2::Route` or `AWS::ApiGatewayV2::Integration` resource.
- The deployed `bndy-source-inspector` template contains one source-inspect reference in its Lambda permission, but its only resources are the Lambda and permission. It contains no route or integration resource.
- Therefore route `j9f4rqn` and integration `x5ygbhg` are **unmanaged CLI-created resources**. CloudFormation drift cannot assess them.

### Post-closure mutation lineage

Incident recovery was recorded complete at `2026-08-30T13:51:28Z`. The following direct API Gateway mutations happened after closure:

| UTC | Event | Target | CloudTrail event ID | Workflow correlation |
| --- | --- | --- | --- | --- |
| 18:03:43 | `CreateIntegration` | `cxos6l6` → Source Inspector Lambda | `45903cad-2441-4307-b600-0f410b770711` | Run `33326965685`, session marker `sid/00153a38405e` |
| 18:03:44 | `CreateRoute` | temporary route `yr5ji0e` → `cxos6l6` | `c0b883d4-7dc1-46d7-b577-da16683f715f` | Run `33326965685` |
| 18:03:52 | `DeleteRoute` | route `yr5ji0e` | `5edd344e-24d7-4492-8b23-c9e3e375d73b` | Run `33326976298`, session marker `sid/f0201d73702f` |
| 18:03:56 | `DeleteIntegration` | integration `cxos6l6` | `bab9b56a-a21a-42b3-bf10-9f8463c4e2c4` | Run `33326976298` |
| 18:03:57 | `CreateIntegration` | current `x5ygbhg` → Source Inspector Lambda | `5315b3f4-2522-4dea-b80e-1bd48ff8a452` | Run `33326976298` |
| 18:03:58 | `CreateRoute` | current `j9f4rqn` → `x5ygbhg` | `d96aee99-9452-434d-aebb-4e26b59cf529` | Run `33326976298` |

All six events used AWS CLI 2.36.29 on a GitHub-hosted Ubuntu runner. CloudTrail identifies `userIdentity.type=Root`, principal/account `771551874768`; access-key identifiers were deliberately omitted. This is deterministic evidence that the workflow's long-lived credentials operated as the AWS account root, not merely as a named IAM deployer.

### Required conclusions

- **Did it run?** Yes. Two post-closure workflow-run jobs executed concurrently after separate successful-but-non-deploying `Deploy BNDY API` runs.
- **Did it deploy?** It did not SAM-deploy Lambda code: source-change detection was false and both SAM steps were skipped. It did directly create/delete API Gateway resources.
- **What changed?** The first run created integration `cxos6l6` and route `yr5ji0e`; the second deleted both and installed current integration `x5ygbhg` and route `j9f4rqn`.
- **Does the route currently work?** **UNVERIFIED.** It is structurally wired to the expected active Lambda, but both smoke jobs failed and the route was not invoked by this audit.
- **Is automation still armed?** **Yes.** `deploy-source-inspector.yml` remains active. Successful completion of `Deploy BNDY API` on `master` triggers it even when that workflow's deployment job is skipped. Source-code detection gates only SAM build/deploy, not destructive route reconciliation.
- **Does recovery closure remain valid?** The statement that the serverless CloudFormation recovery completed at 13:51 remains historically valid. Its route snapshot is no longer authoritative because unmanaged root-credential mutations occurred at 18:03. The recovered stack must not be called wholly stable while this route remains outside CloudFormation and functionally unverified.

## 8. Capture hot-deploy analysis

Phase 2 result:

- Both named workflows are present and registered `active` on `bndy-serverless-api/master`.
- Neither ran after the recovery window began; there is no CI evidence that either changed `bndy-capture-processor` on 30 August.
- Both retain long-lived AWS credential configuration and direct `aws lambda update-function-code` capability against the CDK-owned processor.
- Both can invoke production scanners and mutate Capture records during their acceptance path; they are not ordinary tests.
- Their path filters require a push changing the workflow file itself, reducing accidental frequency but not removing the ownership bypass.
- The current processor hash is `1j4JD/627XAzmPI0kqcofyETrx4MG0K9I2ZZhKCdfqw=` and last-modified time is `2026-08-30T20:08:49Z`. That aligns with the user-confirmed Enrichment CDK update, not either hot-deploy workflow; neither named workflow ran on 30 August. CloudTrail mutation history is still independently checked in Phase 13.

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

### P0 — Source Inspector workflow mutated production as AWS account root

- **Evidence:** CloudTrail event `d96aee99-9452-434d-aebb-4e26b59cf529` and the five adjacent route/integration events identify `userIdentity.type=Root`, root ARN/principal, GitHub-runner AWS CLI user agent, and the exact workflow session markers. Access-key IDs were not recorded.
- **Affected resource:** AWS root credential boundary and every resource reachable by the static workflow credentials; demonstrated target is the production HTTP API.
- **Impact:** a routinely triggered repository workflow holds root-equivalent production authority, bypassing least privilege, OIDC session control and a single IaC release boundary.
- **Required decision:** disable the automatic path, remove/rotate the root access key through the account's approved security process, and replace it only with scoped short-lived OIDC permissions after ownership is declared.
- **HITL approval:** Yes — credential rotation, workflow containment and IAM changes require owner/security approval.

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

### P1 — Canonical Artists, Venues and Events tables have no CloudFormation owner

- **Evidence:** all three tables are live and heavily referenced by serverless API code; CloudFormation physical-resource lookup returns no owning stack, and none appears in any relevant deployed template.
- **Affected resource:** `bndy-artists`, `bndy-venues`, `bndy-events`.
- **Impact:** schema, deletion protection, streams and recovery settings have no declared deployment authority; a future repository assumption could repeat the table collision that caused the incident.
- **Required decision:** designate one IaC authority and use an explicit, reviewed import/adoption plan; do not recreate or attach them opportunistically.
- **HITL approval:** Yes — stateful-resource adoption is outside this audit.

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

### Phase 5 command record

| Command family | Exit | Evidence obtained |
| --- | ---: | --- |
| `aws cloudformation get-template --template-stage Original --stack-name ...` for all twelve stacks | 0 | Current deployed template bodies and SHA-256 evidence digests; no change set created. |
| `aws cloudformation get-template-summary --stack-name ...` | 0 | Template resource types and safe parameter-key metadata for SAM/string-bodied templates. |
| `aws cloudformation list-stack-resources --stack-name ...` | 0 | Logical ID to physical resource mapping for ledger rows. |
| `aws dynamodb list-tables --region eu-west-2` | 0 | Existence of canonical and relevant BNDY tables; no item access. |
| `aws cloudformation describe-stack-resources --physical-resource-id ...` | 0 for imported tables; 255 for the three canonical tables | The four imported tables resolve to `bndy-serverless-api`; canonical tables return no stack owner. The validation error is negative ownership evidence, not an access failure. |
| In-memory literal/type search of the two deployed Source Inspector-related templates | 0 | Neither template contains `AWS::ApiGatewayV2::Route` or `AWS::ApiGatewayV2::Integration`; no template or secret values were written to the report. |
| `rg` across scoped repositories | 0 with one Windows `nul` warning | Intended repository references and evidence that canonical tables are application dependencies. Generated/build paths were excluded where practical; no files changed. |

### Phase 6 command record

| Command family | Exit | Evidence obtained |
| --- | ---: | --- |
| `aws lambda list-functions` and `--function-version ALL` | 0 | All 74 stack-owned function configurations, code hashes, last-modified times, runtime/architecture/package/handler, resources, tracing, layers, DLQ and environment **names**; only `$LATEST` exists. |
| `aws lambda get-function-configuration --function-name ...` for all 74 functions | 0 | Every function is `Active` with `Successful` last update. Values and status reasons were not emitted. |
| `aws lambda get-function-concurrency --function-name ...` for all 74 functions | 0 | Reserved-concurrency inventory, including Enrichment cap 2 and five fail-closed production Signals reservations at 0. |
| `aws lambda list-event-source-mappings` and `get-event-source-mapping` for Claims | 0 | All seven scoped mappings and detailed Claims-stream retry/batch configuration. No message/item consumption occurred. |
| Normalised deployed-template versus local `cdk.out` comparison | 0 | Exact Enrichment template equality and asset-key mapping; dirty worktree prevents a deterministic Git-SHA claim. |

Because all functions have only `$LATEST`, Lambda aliases and provisioned concurrency are structurally absent: aliases require a published version, and provisioned concurrency cannot target `$LATEST`. No paid provider, product endpoint or Lambda was invoked.

### Phase 7 command record

| Command family | Exit | Evidence obtained |
| --- | ---: | --- |
| `aws apigatewayv2 get-routes --api-id qry0k6pmd0` | 0 | Current unique route ID, target, authorisation and total route count. |
| `aws apigatewayv2 get-integrations --api-id qry0k6pmd0` | 0 | Current unique integration, Lambda target, method, payload and timeout; duplicate count. |
| `aws cloudformation get-template` in-memory type/literal checks | 0 | Neither related deployed template owns a route or integration. |
| `aws cloudtrail lookup-events` for `CreateRoute`, `DeleteRoute`, `CreateIntegration`, `DeleteIntegration` after closure | 0 | Six exact mutation events, IDs, order, targets, root actor and workflow-run correlation. Sensitive access-key IDs and source addresses were omitted. |

No API route, Lambda or product endpoint was invoked.
