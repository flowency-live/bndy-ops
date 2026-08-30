# BNDY Backline post-recovery live audit

Status: **IN PROGRESS**

Latest completed phase: **Phase 16 — Cowork inventory boundary**

Audit started: `2026-08-30T20:18:29.598Z`

Required account: `771551874768`

Required region: `eu-west-2`

This report is the incremental evidence record for the definitive post-recovery audit following the SAM/CDK infrastructure collision of 29–30 August 2026. Live AWS state is authoritative. Repository state, prior reports and the interrupted audit transcript are supporting evidence only.

Safety boundary: this audit does not deploy, invoke Lambda functions, change infrastructure or configuration, read secrets, consume queue messages, scan application data, trigger workflows, or exercise product endpoints. CloudFormation drift detection is the only authorised AWS diagnostic that initiates an operation.

## 1. Executive verdict

The audit is not yet complete. No final resumption or deployment verdict is issued at Phase 16.

| Question | Verdict | Reason |
| --- | --- | --- |
| Is the recovered serverless API stack stable? | UNVERIFIED | It is `UPDATE_COMPLETE`, but a post-closure local SAM deploy rewrote 23 functions from an `UNMAPPED` source; Source Inspector is responsive but unmanaged, Source Runs recorded 14 errors, and drift was partial. |
| Is Enrichment runtime state verified? | NO | The source-freshness alarm is live `ALARM`, Projection has 37 DLQ messages/111 application error records, and the deployed Git SHA is `UNMAPPED`. Controls remain fail-closed. |
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

### Phase 14 — isolated remote-head validation

All validation ran in detached, initially clean worktrees under `C:\VSProjects\_bndy-audit-validation-20260830`. Existing worktrees were not reset, cleaned, stashed, checked out or edited. Generated `cdk.out.audit` directories remain only in the isolated Enrichment and Signals worktrees as Phase 15 inputs. App and Backstage were fetched again after the user's parallel cosmetic pushes; the validated heads below supersede their earlier Phase 2 snapshot values.

| Repository / immutable snapshot | Build and static gates | Tests | Template gate | Result |
| --- | --- | --- | --- | --- |
| Enrichment `72a9c23be73bbb347ecc3403f7f3e3211c78e9bc` | TypeScript build PASS | **FAIL:** 55/57 files and 367/369 tests passed. `klma-parity` fixture SHA expected `c036562d...` but observed `53de97b1...`; GigsNews parity contains one material `INPUT_DIFFERENCE` evidence hash plus five expected location-rule differences, so 6 differences were observed where the manifest expects 5. | CDK synth PASS via compiled entrypoint with `canonicalChangeStreamsEnabled=false`. Read-only `cdk diff --no-change-set` PASS and reports one code-asset-only change to `GoogleDiscoveryWorker`; no structural/configuration change. | **FAIL** — parity gates are not green. |
| Serverless API `db7f5086ce5ecc88eb324fed84aad5ef0eaaec05` | `predeploy` PASS: template validation (two route-count warnings), all 270 source routes verified, 5 security tests, 6 taxonomy tests, identity sync, 5 artist-domain tests and 17 Source Inspector unit tests pass. | Included in `predeploy`. | Clean `sam build --no-cached` PASS. **`sam validate --lint` FAIL:** 16 functions explicitly use `nodejs20.x`, which became non-updateable on `2026-07-01`. | **FAIL** — repository checks pass, but the current template fails deploy lint. |
| Signals main `db85ecd7ee05f13bdf8816c4a8652d804168ff47` | Build PASS; CDK synth PASS with deprecation/cross-stack-reference warnings. | 46 files / 750 tests PASS; one integration file / 4 tests skipped. | No deployment. | PASS. |
| Signals PR #1 head `7e1456d090d841c4cb8410799c097af215397b4b` | Separate worktree build PASS; CDK synth PASS with the same warnings. | 46 files / 750 tests PASS; one integration file / 4 tests skipped. | Read-only review and validation only; not merged or deployed. | PASS. |
| Capture `7693e169cc77a903eea233e4ee64f25d547c7c26` | Server TypeScript build PASS. Python `unittest` 12/12 PASS. | Server Vitest 2/2 PASS. | `sam validate --lint` PASS; clean SAM build PASS. | PASS with dependency reproducibility limitation below. |
| MCP `5bedc487fc70241d168821021ebf53a69fb482b7` | TypeScript build PASS. | 5 files / 40 tests PASS. | Not applicable. | PASS. |
| App `4d6e6620f307af32e41ce307d69d38430ca1959d` | Typecheck PASS; lint PASS with five warnings; production build PASS. | 35 files / 259 tests PASS. | Not applicable. | PASS. |
| Backstage `28277ef9cd1468d2f0e03e82d2e9c3f071dae920` | Production build PASS with chunk warnings. **Typecheck FAIL** with broad incompatible/duplicate domain types. **Lint FAIL** because no ESLint configuration is discoverable. | First run: 28/31 files and 421/469 tests passed, 45 failed, 3 skipped and 16 uncaught errors. A JSON-reporter rerun varied to 43 failures in two venue-coverage files, centred on a `react-leaflet` mock missing `useMap`; the differing totals also show nondeterminism. | Not applicable. | **FAIL** — build output alone is not a reliable release gate. |
| Website `fdf5b937546c5fb20f19cfedb6e976e6be429284` | Astro production build PASS; 18 pages and trailing-slash Brass Bands route generated. | No test script is defined. | Not applicable. | PASS for the documented build gate. |

Safety context was explicit throughout: canonical table streams were synthesized disabled; canonical projection remained live fail-closed because the global control item is absent; no provider or product endpoint was invoked; no change set was created; and nothing was deployed. The Enrichment template itself still defines enabled acquisition/provider-related schedules and mappings—this is not described as “providers inactive” merely because the audit did not invoke them.

Environmental and reproducibility limitations:

- Capture server has no lockfile. `npm ci` correctly refused to run; dependencies were installed in the isolated worktree with `npm install --no-package-lock --no-audit --no-fund`. This changes no tracked file but prevents a lockfile-reproducible validation claim.
- Enrichment and Signals bundling emitted CDK deprecation warnings; Enrichment also emitted an `import.meta`-under-CJS warning for `seed-wave1-sources.ts`. These did not fail synth.
- Backstage failures reproduce at its clean remote head and are code/test-configuration failures, not consequences of the user's dirty active worktree.

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
- Source acquisition authority is not singular: Phase 16 adds recent Cowork execution evidence to the overlapping Backline and Signals implementations.

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
| Functional result | **RESPONSIVE, CONTRACT UNVERIFIED** — aggregate access logs show 11 requests since 12:00Z: five 200, three 400 and three 422 responses; both post-closure smoke jobs still failed |

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
- **Does the route currently work?** **Partially verified.** Without invoking it, the audit observed five HTTP 200 responses and six validation-class 400/422 responses in aggregate access logs through 20:08Z. The integration is responsive, but the failed workflow assertions mean the expected smoke contract remains unverified.
- **Is automation still armed?** **Yes.** `deploy-source-inspector.yml` remains active. Successful completion of `Deploy BNDY API` on `master` triggers it even when that workflow's deployment job is skipped. Source-code detection gates only SAM build/deploy, not destructive route reconciliation.
- **Does recovery closure remain valid?** The statement that the serverless CloudFormation recovery completed at 13:51 remains historically valid. Its route snapshot is no longer authoritative because unmanaged root-credential mutations occurred at 18:03. The recovered stack must not be called wholly stable while this responsive route remains outside CloudFormation and its smoke contract fails.

## 8. Capture hot-deploy analysis

Phase 2 result:

- Both named workflows are present and registered `active` on `bndy-serverless-api/master`.
- Neither ran after the recovery window began; there is no CI evidence that either changed `bndy-capture-processor` on 30 August.
- Both retain long-lived AWS credential configuration and direct `aws lambda update-function-code` capability against the CDK-owned processor.
- Both can invoke production scanners and mutate Capture records during their acceptance path; they are not ordinary tests.
- Their path filters require a push changing the workflow file itself, reducing accidental frequency but not removing the ownership bypass.
- The current processor hash is `1j4JD/627XAzmPI0kqcofyETrx4MG0K9I2ZZhKCdfqw=` and last-modified time is `2026-08-30T20:08:49Z`. That aligns with the user-confirmed Enrichment CDK update, not either hot-deploy workflow; neither named workflow ran on 30 August. CloudTrail mutation history is still independently checked in Phase 13.

## 9. DynamoDB, streams and SSM

### Phase 8 — DynamoDB metadata

All 19 relevant tables are `ACTIVE` and `PAY_PER_REQUEST`; all reported GSIs are `ACTIVE`. Counts and sizes are DynamoDB control-plane estimates, not scan results. No table was scanned or exported.

| Owner / logical ID | Physical table | Created UTC | Keys; GSIs | Stream | TTL | PITR / deletion protection | Items / bytes |
| --- | --- | --- | --- | --- | --- | --- | ---: |
| Enrichment / `StateTable9728C7E5` | `BndyEnrichmentStack-StateTable9728C7E5-14HR6N3NEWGLM` | 2026-08-11 13:49:59 | `pk` HASH, `sk` RANGE; ObservationClaims, SourceSchedule, SubjectClaims | None | Enabled `expiresAt` | Enabled / **No** | 3,046,863 / 2,673,375,521 |
| Serverless / `ActivityLogTable` | `bndy-activity-log` | 2026-08-11 16:42:11 | `user_id` HASH, `sk` RANGE; AllByTime | None | Disabled | Disabled / No | 459 / 110,645 |
| Serverless / `ClaimsTable` | `bndy-claims` | 2026-08-21 22:53:05 | `claim_id` HASH; ByUser, ByTarget, ByStatus | None | Disabled | Disabled / No | 0 / 0 |
| Serverless / `EntityClaimsTable` | `bndy-entity-claims` | 2026-08-24 19:35:27 | `claim_id` HASH; user_id-index, entity_key-index | `NEW_AND_OLD_IMAGES`; `bndy-entity-claims/2026-08-29T16:15:10.440` | Disabled | Disabled / No | 1 / 441 |
| Serverless / `EntityMembershipsTable` | `bndy-entity-memberships` | 2026-08-24 19:33:09 | `membership_id` HASH; user_id-index, entity_id-index | None | Disabled | Disabled / No | 0 / 0 |
| Serverless / `EntityInvitesTable` | `bndy-entity-invites` | 2026-08-24 20:14:02 | `token` HASH; no GSI | None | Enabled `expires_at` | Disabled / No | 0 / 0 |
| Serverless / `JoinAnalyticsTable` | `bndy-join-analytics` | 2026-08-24 20:22:14 | `id` HASH; no GSI | None | Enabled `expires_at` | Disabled / No | 62 / 11,985 |
| Serverless / `FlagsTable` | `bndy-flags` | 2026-08-11 16:58:18 | `id` HASH; ByStatus | None | Disabled | Disabled / No | 1 / 370 |
| Serverless / `UniqueKeysTable` | `bndy-unique-keys` | 2026-07-27 17:35:32 | `key` HASH; no GSI | None | Disabled | Disabled / No | 18,276 / 3,184,929 |
| Capture / `CapturesTable` | `bndy-capture-CapturesTable-7YKTGU5HDPA4` | 2026-08-02 20:54:00 | `id` HASH; status-receivedAt-index | None | Enabled `expiresAt` | Enabled / No | 194 / 155,199 |
| Signals Storage dev / `SignalsTableE8D63F6D` | `bndy-signals-dev` | 2026-05-01 23:05:33 | `PK` HASH, `SK` RANGE; GSI1, GSI2 | None | Disabled | Enabled / No | 251 / 241,623 |
| Signals Storage prod / `SignalsTableE8D63F6D` | `bndy-signals-prod` | 2026-06-17 13:36:07 | `PK` HASH, `SK` RANGE; GSI1, GSI2 | None | Disabled | Enabled / No | 0 / 0 |
| Source Runner dev / `SourceStateTable69DA611C` | `bndy-source-state-dev` | 2026-06-16 10:22:06 | `PK` HASH, `SK` RANGE; no GSI | None | Disabled | Enabled / No | 0 / 0 |
| Source Runner dev / `SourceReviewTableE031BB9A` | `bndy-source-review-dev` | 2026-06-16 10:22:05 | `PK` HASH, `SK` RANGE; GSI1-Status | None | Disabled | Enabled / No | 0 / 0 |
| Source Runner prod / `SourceStateTable69DA611C` | `bndy-source-state-prod` | 2026-06-15 19:22:57 | `PK` HASH, `SK` RANGE; no GSI | None | Disabled | Enabled / No | 0 / 0 |
| Source Runner prod / `SourceReviewTableE031BB9A` | `bndy-source-review-prod` | 2026-06-15 19:22:56 | `PK` HASH, `SK` RANGE; GSI1-Status | None | Disabled | Enabled / No | 0 / 0 |
| **Unmanaged** / none | `bndy-artists` | 2025-09-25 15:48:52 | `id` HASH; name-search-index | None | Disabled | Enabled / **Yes** | 3,422 / 2,762,864 |
| **Unmanaged** / none | `bndy-venues` | 2025-09-25 15:48:42 | `id` HASH; managed_by_user_id-index, ownerGroupId-index | None | Disabled | Enabled / **Yes** | 3,496 / 2,543,280 |
| **Unmanaged** / none | `bndy-events` | 2025-10-05 22:18:53 | `id` HASH; 7 active indexes for owner/date, festival, geo, artist, venue and slug | None | Disabled | Enabled / **Yes** | 10,235 / 6,065,506 |

### Imported-table ownership and drift

`EntityClaimsTable`, `EntityMembershipsTable`, `EntityInvitesTable`, and `JoinAnalyticsTable` are current `UPDATE_COMPLETE` resources in `bndy-serverless-api`; each resource reports `IN_SYNC` in the fresh drift snapshot. This confirms the recovery imports remain attached to that stack. The stack-level diagnostic was partial only because two unrelated Lambda permissions returned internal drift-handler failures.

### Stream state

- `bndy-entity-claims` is the sole relevant table with a stream. It uses `NEW_AND_OLD_IMAGES`, matches the enabled Claim Authority mapping exactly and is published through `/bndy/claims/stream-arn` (metadata consistency checked in Phase 9).
- Canonical `bndy-artists`, `bndy-venues`, and `bndy-events` streams are **disabled**, and Phase 6 found no canonical stream mappings.
- No relevant table has an unexpected second stream or consumer.

### Exact permitted control reads

The exact consistent read of `CONTROL#PROJECTION / GLOBAL` returned no item. Repository runtime code in `DynamoProjectionControlStore.canonicalWritesEnabled()` selects only `canonicalWritesEnabled` and returns true only for an explicit boolean `true`; an absent item therefore fails closed to **canonical projection disabled**.

Exact `SOURCE#<id> / CONFIG` reads were limited to the ten in-scope safety records and reported only control fields:

| Source config | Enabled | Shadow | Writer authority | Runtime / local time | Safety note |
| --- | --- | --- | --- | --- | --- |
| Lemonrock new gigs, cancellations, artist index, venue index, future reconcile | Yes | **Yes** | `aws` | standard / 05:00 | All fail closed before projection because shadow is true. |
| `onthecase-gig-index` | Yes | **Yes** | `cowork` | standard / 02:40 | Shadow plus non-AWS writer authority. |
| `gigs-news-daily-import` | Yes | **Yes** | `cowork` | standard / 09:00 | Registry item has a future due time; live rule/function containment checked in Phase 10. |
| `klma-stoke-gig-list` | Yes | **Yes** | `cowork` | standard / 09:00 | Additive-only policy, max 500 actions, but global/source gates still stop projection. |
| `sceniceye-daily-import` | **No** | **Yes** | `cowork` | browser / 09:00 | Disabled; stored due time is stale and not authority by itself. |
| `insangel-daily-import` | **No** | **Yes** | `cowork` | standard / 06:00 | Disabled; stored due time is stale and not authority by itself. |

These exact records prove the current Backline projection engine is fail-closed for the named sources. They do not yet prove every external Signals/Cowork writer is contained.

### Phase 9 — SSM stream references

| Parameter | Type / version | Last modified UTC | CloudFormation owner | Live target consistency |
| --- | --- | --- | --- | --- |
| `/bndy/claims/stream-arn` | `String` / 1 | `2026-08-30T00:02:08.095Z` | `bndy-serverless-api` / `EntityClaimsStreamArnParameter` | Matches the current `bndy-entity-claims` stream label `2026-08-29T16:15:10.440` and enabled mapping exactly. |
| `/bndy/canonical/artists/stream-arn` | **Absent** | — | None | Consistent with Artists stream disabled and no mapping. |
| `/bndy/canonical/venues/stream-arn` | **Absent** | — | None | Consistent with Venues stream disabled and no mapping. |
| `/bndy/canonical/events/stream-arn` | **Absent** | — | None | Consistent with Events stream disabled and no mapping. |

Only the Claims reference appears in a relevant deployed template: `bndy-serverless-api` owns it and `BndyEnrichmentStack` resolves it. No deployed template contains a canonical Artist/Venue/Event stream-ARN path. The Claims parameter value was read without decryption because it is the expressly approved non-secret `String` stream reference; only its sanitised table name/stream label is retained.

The three absent canonical parameters are fail-closed evidence, not an error requiring repair. Creating them is part of the future explicit stream-activation sequence and is not authorised now.

## 10. Schedules and source authority

### EventBridge rule inventory

All 19 CloudFormation-owned relevant rules have exactly their expected single target, except Lemonrock Fast Gig Tick, which intentionally has two SQS targets. No target has a dead-letter ARN or explicit retry policy; EventBridge service defaults apply. EventBridge does not expose next-fire time for rules, so “next due” is stated only where determinable from a cron expression or registry item.

Metrics are CloudWatch `AWS/Events` sums from `2026-08-30T12:00:00Z` to the `21:00Z` query bound, with the latest non-zero five-minute bucket. A rule invocation count is target delivery, so the two-target Lemonrock rule records two per hourly firing.

| Enrichment logical / physical rule | State | Schedule | Target / safe input | Invocations; latest bucket | Failed | Next due evidence |
| --- | --- | --- | --- | --- | ---: | --- |
| `CaptureScanRuleA091BC00` / `...CaptureScanRule...-WiAtLwjsqvxB` | **Enabled** | `rate(5 minutes)` | `bndy-capture-scan`; no input | 107; 20:50Z | 0 | Within five minutes; exact instant unavailable |
| `DailyScanRule81F5C117` / `...DailyScanRule...-MkunxlY1752Y` | Enabled | `cron(15 3 * * ? *)` | Scan Planner; `entities=[]` | 0; none in window | 0 | 2026-08-31 03:15Z |
| `LemonrockDailyHealthCheckEE745091` / `...LemonrockDailyHealthCheck...-5RArlVZSXBeJ` | Enabled | `cron(10 2 * * ? *)` | Source Scan queue; `sourceId=lemonrock-future-reconcile`, `reason=scheduled` | 0; none in window | 0 | 2026-08-31 02:10Z |
| `LemonrockFastGigTickB23E8683` / `...LemonrockFastGigTick...-mMAx5VCnclWZ` | **Enabled** | `rate(1 hour)` | Source Scan queue ×2; `lemonrock-new-gigs` and `lemonrock-cancellations`, scheduled | 18; 20:15Z | 0 | Within one hour; exact instant unavailable |
| `LemonrockMonthlyFutureReconcileE22F76CE` / `...LemonrockMonthlyFutureReconcile...-2PHqhpDm26dd` | Enabled | `cron(20 2 1 * ? *)` | Source Scan queue; `lemonrock-future-reconcile`, scheduled | 0 | 0 | 2026-09-01 02:20Z |
| `OnTheCaseHourlyGigTick6AD850EB` / `...OnTheCaseHourlyGigTick...-9YMWT55dzPJ2` | **Enabled** | `rate(1 hour)` | Source Scan queue; `onthecase-gig-index`, scheduled | 9; 20:50Z | 0 | Within one hour; exact instant unavailable |
| `SourceDispatchTick13E0B2C9` / `...SourceDispatchTick...-YkAbyNcLmjhk` | **Enabled** | `rate(1 hour)` | Source Dispatcher; no input | 9; 20:50Z | 0 | Within one hour; exact instant unavailable |
| `SourceHealthTick0308599E` / `...SourceHealthTick...-OS4YNhRXwude` | Enabled | `rate(1 hour)` | Source Health worker; no input | 0; newly created | 0 | First firing expected after creation; API gives no timestamp |
| `TrustLoopDailyClassification6A973B5D` / `...TrustLoopDailyClassification...-MbrXYZcDCEkH` | Enabled | `cron(35 3 * * ? *)` | Trust Loop; no input | 0 | 0 | 2026-08-31 03:35Z |

| Signals environment / rule | State | Schedule / pattern | Target | Invocations / failed in window | Next due |
| --- | --- | --- | --- | ---: | --- |
| dev + prod `bndy-gigs-news-schedule-*` | **Disabled** | `cron(0 8 * * ? *)` | `bndy-gigs-news-runner-*` | 0 / 0 in each | None while disabled |
| dev + prod `bndy-klma-schedule-*` | **Disabled** | `cron(0 8 * * ? *)` | `bndy-klma-runner-*` | 0 / 0 in each | None while disabled |
| dev + prod `bndy-onthecase-schedule-*` | **Disabled** | `cron(5 3 * * ? *)` | `bndy-onthecase-runner-*` | 0 / 0 in each | None while disabled |
| dev + prod `bndy-sceniceye-schedule-*` | **Disabled** | `cron(30 8 * * ? *)` | `bndy-sceniceye-runner-*` | 0 / 0 in each | None while disabled |
| dev + prod `bndy-intelligence-pass-s3-trigger-*` | **Disabled** | S3 Object Created, key suffix `/run.json` | `bndy-intelligence-pass-*` | 0 / 0 in each | Event-driven; disabled |

Both Signals source buckets have S3 EventBridge delivery enabled and no Lambda/SQS/SNS bucket notification. The dev bucket is owned by `BndySignals-Storage-dev`. `bndy-signals-prod-771551874768` exists and supplies the production event pattern, but CloudFormation physical-resource lookup finds **no owning stack**; it is a retained/unmanaged stateful resource even though `BndySourceRunner-prod` depends on it.

EventBridge Scheduler has **zero** matching BNDY/Backline/Capture/Source/Signals schedules. The seven Lambda event-source mappings are recorded in Phase 6; no additional automation path was found there.

### Effective source cadence and authority

| Source | Effective AWS path | Current writer/projection gate | Last success evidence | Duplicate acquisition/writer risk |
| --- | --- | --- | --- | --- |
| Lemonrock | New-gigs + cancellations hourly; future health daily; future reconcile monthly; rules enabled and delivering | Registry `enabled=true`, `shadow=true`, writer `aws`; global projection false | New/cancellations succeeded at 21:15Z; future reconcile at 02:10Z; zero consecutive failures | No Signals runner; one-off workflows/marker remain separate evidence paths |
| On The Case | Enrichment direct hourly rule enabled; Signals dev/prod disabled and prod concurrency 0 | Registry shadow true, writer `cowork`; global projection false | Successful runtime state at 20:54:32Z; zero consecutive failures | **Yes:** active Backline acquisition and recently completed Cowork task, plus dormant Signals code |
| KLMA | Enrichment registry dispatcher hourly; config due `2026-08-31T08:00:00Z`; Signals rules disabled/concurrency 0 | Registry shadow true, writer `cowork`, additive-only cap 500; global projection false | Successful runtime state at 08:54:52Z; zero consecutive failures | **Yes:** Backline registry acquisition and recently completed Cowork task, plus dormant Signals code |
| GigsNews | Enrichment registry dispatcher hourly; stored next due `2026-09-04T08:00:00Z`; Signals disabled/concurrency 0 | Registry shadow true, writer `cowork`; global projection false | **Stale:** last success 28 Aug 14:30Z; Source Health ALARM | **Yes:** Backline registry acquisition and recently completed Cowork task, plus dormant Signals code; cadence contradicts daily freshness policy |
| ScenicEye | Registry source disabled; Signals rules disabled/concurrency 0 | Shadow true, writer `cowork`; global projection false | **Missing:** no runtime state; compiled catalog still monitors it as enabled | Recently completed Cowork task; no active AWS acquisition, but registry/catalog authority conflicts and dormant Signals remain |
| Insangel | Registry source disabled; no Signals rule/function | Shadow true, writer `cowork`; global projection false | None in AWS | Recent Cowork task firing failed after two consecutive capture-surface failures; no active AWS acquisition |
| Signals intelligence pass | Dev/prod event rules disabled; production function reserved concurrency 0; S3 EventBridge emission remains enabled | `DRY_RUN` name present; value checked through template/config in canonical-write synthesis | 0 rule deliveries/failures in window | Dormant path remains template-enabled and can be reactivated by redeploy |

No AWS schedule currently gives Signals canonical-writer authority. Enrichment is actively acquiring Lemonrock/On The Case and polling the registry, but its source/global controls keep canonical projection fail-closed. Phase 16 proves recent write-capable Cowork task execution but cannot prove its current scheduler controls; the cross-system source boundary is not singular.

## 11. Queues, alarms and logs

### Phase 11 — queues and dead-letter state

Observed at approximately `2026-08-30T20:57Z`–`21:01Z`. All **17** scoped queues use SQS-managed server-side encryption, long polling is disabled (`ReceiveMessageWaitTimeSeconds=0`), and no message was received, peeked, moved, deleted or redriven.

| Owner / queue family | Primary state (visible / in flight / delayed) | DLQ or quarantine state | Visibility / retention | Redrive and consumer state |
| --- | --- | --- | --- | --- |
| Enrichment Browser Scan | 0 / 0 / 0 | Browser Scan DLQ: 0 / 0 / 0 | Primary 900s / 4d; DLQ 30s / 14d | Max receive 3; enabled Lambda mapping, batch 1, partial-batch response |
| Enrichment Capture Processing | 0 / 0 / 0 | Capture Processing DLQ: 0 / 0 / 0 | Primary 420s / 4d; DLQ 30s / 14d | Max receive 3; enabled mapping to `bndy-capture-processor`, batch 1, partial-batch response |
| Enrichment Entity Enrichment | 0 / 0 / 0 | Entity Enrichment DLQ: 0 / 0 / 0 | Primary 360s / 4d; DLQ 30s / 14d | Max receive 3; **no Lambda event-source mapping** exists for the primary queue |
| Enrichment Google Discovery | 0 / 0 / 0 | Google Discovery DLQ: 0 / 0 / 0 | Primary 360s / 4d; DLQ 30s / 14d | Max receive 3; enabled Lambda mapping, batch 1, partial-batch response |
| Enrichment Projection | 0 / 0 / 0 | **Projection DLQ: 37 / 0 / 0** | Primary 300s / 4d; DLQ 30s / 14d | Max receive 3; enabled Lambda mapping, batch 1, partial-batch response |
| Enrichment Source Scan | 0 / 0 / 0 | Source Scan DLQ: 0 / 0 / 0 | Primary 900s / 4d; DLQ 30s / 14d | Max receive 3; enabled Lambda mapping capped at concurrency 2; queue policy permits only EventBridge queue discovery/send operations |
| Enrichment Historical Source Failure Quarantine | **6,048 / 0 / 0** | Standalone quarantine, explicitly not an active DLQ | 30s / 14d | No redrive policy and no Lambda event-source mapping |
| Capture WhatsApp | 0 / 0 / 0 | WhatsApp DLQ: 0 / 0 / 0 | Primary 120s / 4d; DLQ 30s / 14d | Max receive 5; enabled Lambda mapping, batch 1, partial-batch response |
| Signals Workflow dev | N/A | `bndy-signals-failed-dev`: 0 / 0 / 0 | 30s / 14d | Standalone workflow failure DLQ; no redrive policy or Lambda mapping |
| Signals Workflow prod | N/A | `bndy-signals-failed-prod`: 0 / 0 / 0 | 30s / 14d | Standalone workflow failure DLQ; no redrive policy or Lambda mapping |

The latest CloudWatch `ApproximateAgeOfOldestMessage` datapoints were approximately **1,656 seconds** for the Projection DLQ and **298,023 seconds** for the historical quarantine. All other scoped queues reported zero age. The 6,048 historical records are intentionally segregated and old enough to predate the live audit; their existence is inventory evidence, not proof of a current failure. In contrast, the Projection DLQ contains 37 relatively recent terminal delivery failures even though the primary queue is currently empty and the global projection control is fail-closed. Message contents were deliberately not inspected, so cause, entity scope and replay safety remain unknown.

The empty Entity Enrichment queue has a declared DLQ but no event-source mapping. This is a dormant, consumerless path rather than a current backlog. Its intended owner/activation contract must be confirmed before any producer is enabled.

### Phase 12 — alarms and logs

Observed through `2026-08-30T21:16Z`. The estate has only **12** metric alarms in the region and no composite alarms. Exactly one metric alarm is scoped to the 74 relevant Lambdas, 17 queues, 19 rules or their state tables:

| Alarm | Current state / updated | Metric and condition | Missing data | Actions | Evidence conclusion |
| --- | --- | --- | --- | --- | --- |
| `BndyEnrichmentStack-SourceFreshnessAlarm66469858-VnVwZzBtTl7L` | **ALARM** / 21:11:13Z | Source Health Lambda `Errors` Sum ≥1, one 300s period | `notBreaching` | None — no alarm, OK or insufficient-data action | Created by the 20:08 Enrichment deployment; changed from OK-on-missing-data at 20:11Z to ALARM after the first scheduled health evaluation failed |

There are **no scoped alarms** for the other 73 functions, any queue/DLQ depth or age, EventBridge delivery, API Gateway errors, DynamoDB throttling or the global projection control. The only relevant alarm has no notification/remediation action, so its ALARM state is visible only to a polling operator.

#### Source freshness failure

Lambda metrics record three Source Health invocations and three errors, with zero throttles, at 21:09Z–21:12Z. The EventBridge target has no DLQ or explicit retry policy; the closely spaced attempts are consistent with asynchronous delivery retries after the initial failure. Aggregate log classification proves the handler threw `Daily source freshness gate failed` and reported:

| Coverage root | Health result | Exact runtime-state evidence | Configuration conflict |
| --- | --- | --- | --- |
| `gigs-news-daily-import` | **Stale** | Last run/success `2026-08-28T14:30:32.524Z`, zero consecutive failures | Declares daily cadence and 26h maximum staleness, but live config's next due time is `2026-09-04T08:00:00Z` |
| `sceniceye-daily-import` | **Missing** | Exact `SOURCE#... / STATE` item absent | Deployed code catalog monitors it as an enabled daily coverage root; live registry config disables it |
| Other five monitored roots | Healthy | KLMA, three Lemonrock roots and On The Case all have current successful state and zero consecutive failures | No health-gate conflict observed |

This is not a timeout, throttle or initialization failure. The alarm is exposing inconsistent source cadence/enablement authority across compiled catalog, registry config and runtime state.

#### Lambda metrics and aggregate error classes

From 12:00Z through 21:09Z, only three ordinary functions had non-zero Lambda `Errors`: Source Runs 14/58 invocations, serverless Events 1/476, and Enrichment Google Discovery 1/240. Source Health subsequently added 3/3. All 74 functions reported zero throttles. Source Inspector had 11 invocations and zero Lambda errors; its API access log independently records five 200, three 400 and three 422 responses for the exact route.

The Projection worker had 407 invocations and zero Lambda-level errors because it uses partial-batch responses, but aggregate logs contain exactly **111** `ERROR`/exception-class records. That is exactly three attempts for each of the 37 messages now in its DLQ and is strong correlation, not a message-body inspection. Targeted aggregate searches did not match invalid payload, unknown source, unreadable claims, control-read, API, resolution-review, verification, credential, access-denied or network categories; the precise failure class remains unresolved.

Across 16,999 log records (approximately 3.10 MB scanned), aggregate-only Logs Insights queries returned zero initialization errors, timeouts, throttles and generic failed-batch markers. The broad `ERROR|Exception|Unhandled` classification returned Projection 111, Festivals 62, Google Discovery 3 and Events 1. Festivals' 62 application log records occurred with zero Lambda errors, so keyword counts are not treated as failed invocations. Source Runs' 14 Lambda errors occurred from 16:30Z through 20:00Z and ceased in its later 20:15Z–20:35Z invocations; no initialization/timeout/throttle/generic-error signature classified them.

#### Log-group inventory

For every row below the log group is `/aws/lambda/<function>`. Stored bytes are control-plane approximations observed around 21:05Z. `Never` means no retention policy; `Absent` means the function has never created its default group. Source Health created its group during the first scheduled evaluation after the initial inventory.

| Function | Retention | Stored bytes | Latest event UTC |
| --- | ---: | ---: | --- |
| `bndy-capture-CaptureFunction-BVTWEGNTT6jJ` | Never | 1,897,621 | 2026-08-30 20:46:01 |
| `bndy-capture-processor` | Never | 186,573 | 2026-08-29 19:07:08 |
| `bndy-capture-scan` | Never | 1,712,953 | 2026-08-30 20:46:01 |
| `bndy-capture-WhatsAppWorkerFunction-kga4qq5E2vHX` | Absent | — | — |
| `bndy-gigs-news-runner-dev` | 30d | 0 | 2026-06-17 13:01:14 |
| `bndy-gigs-news-runner-prod` | 30d | 0 | 2026-07-27 08:00:25 |
| `bndy-intelligence-pass-dev` | 30d | 0 | 2026-06-18 13:40:03 |
| `bndy-intelligence-pass-prod` | 30d | 0 | 2026-07-27 08:30:59 |
| `bndy-klma-runner-dev` | 30d | 0 | No events |
| `bndy-klma-runner-prod` | 30d | 0 | 2026-07-27 08:00:20 |
| `bndy-onthecase-runner-dev` | 30d | 0 | 2026-06-17 13:01:16 |
| `bndy-onthecase-runner-prod` | 30d | 0 | 2026-07-27 03:05:47 |
| `bndy-sceniceye-runner-dev` | 30d | 0 | 2026-06-18 13:39:00 |
| `bndy-sceniceye-runner-prod` | 30d | 0 | 2026-07-27 08:30:57 |
| `bndy-serverless-api-ArtistsFunction-4wCJA9JLMwF5` | Never | 24,802,331 | 2026-08-30 20:49:56 |
| `bndy-serverless-api-ArtistSongsFunction-gbHmDyNdSoSx` | Never | 6,806,731 | 2026-08-30 19:18:43 |
| `bndy-serverless-api-AuthFunction-gKJksEC1lGjw` | Never | 4,350,312 | 2026-08-30 20:51:21 |
| `bndy-serverless-api-BuildersFunction-uOQgtdHFxjtK` | Never | 318,185 | 2026-08-30 20:39:20 |
| `bndy-serverless-api-CalendarFunction-pm1VDgjlUJls` | Never | 5,445,868 | 2026-08-30 20:06:17 |
| `bndy-serverless-api-ClaimsFunction-CHixeE5rBsCH` | Never | 0 | 2026-08-30 16:30:41 |
| `bndy-serverless-api-EntityInvitesFunction-paSUVSTSsnQv` | Absent | — | — |
| `bndy-serverless-api-EntityMembershipsFunction-5eCV4kiEvcg5` | Absent | — | — |
| `bndy-serverless-api-EventsAgentFunction-axkjUtQOMf5T` | Never | 42,196 | 2026-08-30 00:11:45 |
| `bndy-serverless-api-EventsCuratorFunction-v6iLLgPxrRkg` | Never | 5,128 | 2026-08-22 17:17:07 |
| `bndy-serverless-api-EventsFunction-03skAPFIwe9g` | Never | 32,158,476 | 2026-08-30 21:02:41 |
| `bndy-serverless-api-ExpensesFunction-Bnz5w8tLpkb8` | Never | 557,682 | 2026-08-30 19:18:19 |
| `bndy-serverless-api-FestivalsFunction-ltYkkG704zfV` | Never | 334,008 | 2026-08-30 20:52:37 |
| `bndy-serverless-api-InvitesFunction-yhX3zozC79xA` | Never | 142,534 | 2026-08-29 20:04:13 |
| `bndy-serverless-api-IssuesFunction-5IgjRk6sRhe8` | Absent | — | — |
| `bndy-serverless-api-JoinAnalyticsFunction-klzLo4lX7qqK` | Absent | — | — |
| `bndy-serverless-api-MembershipsFunction-adBmJyeWuWLA` | Never | 2,195,809 | 2026-08-30 20:39:23 |
| `bndy-serverless-api-NotificationsFunction-jSSPxlg9MAcR` | Never | 2,307,569 | 2026-08-30 20:41:21 |
| `bndy-serverless-api-OwnershipFunction-finwDwrKVzch` | Absent | — | — |
| `bndy-serverless-api-SetlistsFunction-wUqy1CYSx17Y` | Never | 23,332,273 | 2026-08-30 19:23:18 |
| `bndy-serverless-api-SongsFunction-c3eFxAdsTmeS` | Never | 1,077,922 | 2026-08-27 21:51:21 |
| `bndy-serverless-api-SourceRunsFunc-bUjoJCjAxPH2` | Never | 212,400 | 2026-08-30 20:39:24 |
| `bndy-serverless-api-SpotifyFunction-dfAWTwGUnJFf` | Never | 1,416,836 | 2026-08-17 18:52:10 |
| `bndy-serverless-api-UploadsFunction-AZ3judAhrxT2` | Never | 73,631 | 2026-08-30 20:52:13 |
| `bndy-serverless-api-UsersFunction-HNQeQw7kJO9b` | Never | 1,931,205 | 2026-08-30 20:59:56 |
| `bndy-serverless-api-VenueCRMFunction-Pq0Nqtm5MJUc` | Never | 1,313,193 | 2026-08-30 19:18:21 |
| `bndy-serverless-api-VenuesFunction-z91LnIIRKHhq` | Never | 67,609,659 | 2026-08-30 20:48:37 |
| `bndy-signals-claim-review-dev` | Never | 1,026 | 2026-05-03 17:25:55 |
| `bndy-signals-claim-review-prod` | Absent | — | — |
| `bndy-signals-clarification-api-dev` | Never | 1,116 | 2026-05-05 08:24:33 |
| `bndy-signals-clarification-api-prod` | Absent | — | — |
| `bndy-signals-clarification-gen-dev` | Never | 5,472 | 2026-08-22 13:48:27 |
| `bndy-signals-clarification-gen-prod` | Absent | — | — |
| `bndy-signals-event-candidate-api-dev` | Never | 1,023 | 2026-05-04 13:06:29 |
| `bndy-signals-event-candidate-api-prod` | Absent | — | — |
| `bndy-signals-extractor-dev` | Never | 12,602 | 2026-08-22 13:48:16 |
| `bndy-signals-extractor-prod` | Absent | — | — |
| `bndy-signals-failure-handler-dev` | Never | 11,835 | 2026-05-04 22:12:19 |
| `bndy-signals-failure-handler-prod` | Absent | — | — |
| `bndy-signals-get-dev` | Never | 21,038 | 2026-08-22 13:48:26 |
| `bndy-signals-get-prod` | Absent | — | — |
| `bndy-signals-intake-dev` | Never | 15,308 | 2026-08-22 13:48:14 |
| `bndy-signals-intake-prod` | Absent | — | — |
| `bndy-signals-interpreter-dev` | Never | 25,412 | 2026-08-22 13:48:25 |
| `bndy-signals-interpreter-prod` | Absent | — | — |
| `bndy-signals-pack-builder-dev` | Never | 5,670 | 2026-08-22 13:48:26 |
| `bndy-signals-pack-builder-prod` | Absent | — | — |
| `bndy-source-inspector-SourceInspectorFunction-a7P9shrPou6W` | Never | 69,190 | 2026-08-30 20:08:02 |
| `BndyEnrichmentStack-BacklineAdminApi9B1E7442-64rdprEIyZ9E` | Never | 8,812 | 2026-08-27 21:16:17 |
| `BndyEnrichmentStack-BrowserSourceWorkerCA2BC3A6-KeJDw5n4rGX0` | Never | 4,698 | 2026-08-28 13:37:43 |
| `BndyEnrichmentStack-ClaimAuthorityStreamWorker0E6B-SWUTdZhEakId` | Never | 561 | 2026-08-29 17:02:37 |
| `BndyEnrichmentStack-GoogleDiscoveryWorker66B9CA30-Nc72FG6J3ShU` | Never | 2,510,604 | 2026-08-30 19:28:11 |
| `BndyEnrichmentStack-ProjectionWorker2E654DBF-8omMuPbBsAna` | Never | 15,492,342 | 2026-08-30 20:26:11 |
| `BndyEnrichmentStack-ScanPlannerBC522289-D9WXLIcdx9Wi` | Never | 13,388 | 2026-08-30 19:16:27 |
| `BndyEnrichmentStack-SourceDispatcherB94114BB-RqgXyjZuSD0a` | Never | 150,757 | 2026-08-30 20:54:52 |
| `BndyEnrichmentStack-SourceHealthWorkerB381903F-CXSWKQigdrRx` | Never | 0 | 2026-08-30 21:09:40 |
| `BndyEnrichmentStack-SourceWorker336FEA29-ghZk2mBRjOks` | Never | 41,735,989 | 2026-08-30 20:54:32 |
| `BndyEnrichmentStack-TrustLoop620D9456-uGPEj1SDMLZy` | Never | 1,879 | 2026-08-30 03:35:40 |
| `BndySourceRunner-dev-LogRetentionaae0aa3c5b4d4f87b-xEgUBaG6XHb0` | 1d | 0 | 2026-06-18 12:03:21 |
| `BndySourceRunner-prod-LogRetentionaae0aa3c5b4d4f87-tNd3hAHRxcPu` | 1d | 0 | 2026-06-18 13:16:34 |

At phase end, 16 functions had no log group, 10 Source Runner business functions retained logs for 30 days, two CDK retention helpers retained one day, and all other existing Lambda groups retained indefinitely. The API access group `/aws/apigateway/bndy-api` also retains indefinitely, stores approximately 30.8 MB and was last active at 21:01:38Z.

### Phase 13 — CloudTrail mutation audit

Event history was queried from `2026-08-30T12:00:00Z` through phase end. AWS records current Lambda mutations under versioned event names such as `UpdateFunctionCode20150331v2`; both the requested unversioned names and the service's actual names were checked. Targets and actors below are sanitised; request templates, parameter values, secret values, source addresses and access-key IDs are omitted.

| UTC window | Mutation boundary | Actor / source | Current classification | After 13:51:28Z closure? | Boundary result |
| --- | --- | --- | --- | --- | --- |
| 13:45:37–13:51:49 | `bndy-serverless-api` surgical auth recovery: change set created/executed; Users/Uploads configuration and code updated; permissions restored | `bndy-deployer`, local AWS CLI/CloudFormation | Expected incident-recovery work documented by the closure report; final permission events completed seconds after the recorded closure instant | Partly | Owner-coherent CloudFormation recovery; no separate bypass |
| 16:06:42–16:08:49 | `bndy-serverless-api` SAM change set created/executed; **23 Lambda code packages** updated | `bndy-deployer`, local SAM CLI 1.159.1 on Windows | Post-closure deployment, not a GitHub workflow. CloudTrail/CloudFormation cannot map its local build deterministically to a clean Git SHA, so revision is `UNMAPPED` | **Yes** | Correct owning stack, but recovery snapshot/source provenance superseded |
| 16:35:37–16:38:55 | `bndy-capture` SAM change set created/executed; WhatsApp secret, DLQ/queue, worker, event mapping and webhook permissions created; Capture Lambda/API updated | `bndy-deployer`, local SAM CLI 1.159.1 on Windows | Post-closure feature deployment; no Capture GitHub run in the audit window and deployed revision remains `UNMAPPED` pending deterministic build comparison | **Yes** | Correct owning stack; not either serverless hot-deploy bypass |
| 18:03:43–18:03:58 | Two direct Source Inspector reconcilers created/deleted/recreated the production integration and route | AWS account root via GitHub-hosted AWS CLI; runs `33326965685` / `33326976298` | Uncontrolled post-closure mutation; exact six-event lineage is in Section 7 | **Yes** | **Violation:** unmanaged direct CLI path and root credential boundary |
| 18:44:06 | `surgical-sourceruns-db7f5086-20260830194405` change set created but not executed | `bndy-deployer`, local AWS CLI | Still `CREATE_COMPLETE / AVAILABLE`; would modify HTTP API body and Source Runs Lambda code without replacement | **Yes** | No live resource changed, but an executable stale release artefact remains |
| 20:08:27–20:10:34 | `BndyEnrichmentStack` CDK change set created/executed; 11 existing Lambda packages updated; Source Health worker/rule/alarm created | scoped CDK deploy/execution roles, local `aws-cdk-jason` session | User-confirmed parallel Enrichment deployment; explicitly excluded from incident/unauthorised findings and adopted as live baseline | **Yes** | Correct owning stack and scoped role; deployment exposed live freshness ALARM |
| 20:32:22–20:32:36 | Twelve `DetectStackDrift` diagnostics | `bndy-deployer`, local AWS CLI 2.28.24 | This audit's explicitly authorised diagnostic operation | **Yes** | Expected diagnostic; no remediation or resource update |

#### Mutation coverage and negatives

- The serverless 16:08 update generated 23 `UpdateFunctionCode20150331v2` events at 16:08:36Z. It changed code only in stack events; no table, event-source mapping or schedule mutation accompanied it.
- The Capture path generated `CreateSecret`, two `CreateQueue`, `CreateFunction20150331`, `CreateEventSourceMapping20150331`, Capture-function code/configuration updates and two permission additions. The secret's name only was observed; no secret value was read.
- The Enrichment update generated 11 code updates, one Google Discovery configuration update, `CreateFunction20150331`, `PutRule`, `PutTargets`, `PutMetricAlarm` and a Lambda permission. These correlate exactly with its stack events.
- No relevant `UpdateStack`, `CreateStack`, direct/unversioned `UpdateFunctionCode`, direct/unversioned `UpdateFunctionConfiguration`, mapping update/delete, `UpdateTable`, `PutParameter` or `PutSecretValue` event occurred in the window.
- Broadened destructive checks found no relevant stack/function/table/queue/rule/schedule deletion, target removal, queue purge, queue-attribute change, API/stage direct update, bucket-notification update, concurrency change, alarm deletion or secret deletion.
- The named Capture hot-deploy workflows did not mutate the processor. Its only 30 August code event is `cb737d49-...` at 20:08:49Z, invoked by the Enrichment CloudFormation execution role during the user-confirmed deploy.

CloudTrail therefore disproves any claim that recovery closure was the final production mutation. It also distinguishes owner-coherent post-closure deployments from the Source Inspector's direct/root bypass; the former are provenance problems, not evidence of an unauthorised actor.

## 12. Canonical-write safety

Pending synthesis from Phases 6, 8–10 and 13.

## 13. CDK/SAM differences

### Phase 15 — deterministic deployed-versus-local comparison

**Complete.** Deployed `Original` templates were compared in memory with clean Phase 14 SAM build output and CDK cloud assemblies. Every logical-resource set and every non-resource top-level template section matches for the current remote default heads. CDK comparisons used `--no-change-set`; no CloudFormation change set, asset publication or deployment occurred.

| Repository / proposed snapshot | Deployed ↔ local resource set | Lambda code/configuration | All other required categories | Deployment consequence |
| --- | --- | --- | --- | --- |
| Enrichment `72a9c23` / `BndyEnrichmentStack` | 79 ↔ 79; no add/remove | `GoogleDiscoveryWorker` code asset only | No replacement, IAM, DynamoDB, stream, event-source, schedule, API route, log group, alarm or ownership change | Would update one already mapped provider worker. It does not enable a provider or canonical stream, but the full parity suite is red, so deployment remains unsafe. |
| Serverless API `db7f508` / `bndy-serverless-api` | 37 SAM source resources ↔ 37; no add/remove; built and deployed top-level sections equal | All 27 functions have different packaged `CodeUri`; no runtime, environment, event or other function configuration delta | Full API body/270 routes, IAM, eight tables, Claims stream/mapping configuration, SSM, schedules, logs, alarms and ownership unchanged; no replacement | Would rewrite all 27 Lambda code packages from the clean head. Package hashes cannot prove equality to the unmapped deployed build, and 16 functions fail runtime lint. |
| Serverless API `db7f508` / `bndy-source-inspector` | 2 ↔ 2; no add/remove | `SourceInspectorFunction` packaged code only | Permission unchanged; no route/integration exists in either template, so the unmanaged ownership gap remains; no replacement | Would update the Lambda but neither own nor safely repair its production route. Its additional `nodejs20.x` runtime also fails lint. |
| Capture `7693e16` / `bndy-capture` | 13 ↔ 13; no add/remove | Both SAM functions have different packaged `CodeUri`; no configuration delta | API/domain, IAM, table, bucket, queues, event-source mapping, routes, schedules, logs, alarms and ownership unchanged; no replacement | Clean source reproduces the deployed shape, but not a deterministic deployed code hash. Both functions would be rewritten. |
| Signals main `db85ecd` / Storage dev+prod | 3 ↔ 3 dev and 2 ↔ 2 prod; no add/remove | None | No material difference; CDK metadata analytics only under strict comparison | No application-resource change. |
| Signals main `db85ecd` / Workflow dev+prod | 20 ↔ 20 in each; no add/remove | Five Lambda code assets differ in each environment; configuration unchanged | IAM, queue, Step Functions, event sources, schedules, logs, alarms and ownership unchanged; no replacement | Would rewrite five workflow functions per environment. |
| Signals main `db85ecd` / API dev+prod | 66 ↔ 66 in each; no add/remove | Five Lambda code assets differ in each environment; configuration unchanged | IAM and all REST API resources/methods unchanged; no tables, streams, schedules, log groups, alarms, ownership changes or replacements | Would rewrite five API functions per environment. |
| Signals main `db85ecd` / Source Runner dev+prod | 36 ↔ 36 in each; no add/remove | Five Lambda code assets differ in each environment; configuration unchanged | IAM, two tables, five rules, permissions, log-retention resources and ownership unchanged; no stream/event-source/alarm/replacement changes | Production template still declares all five rules `ENABLED` and Intelligence `DRY_RUN=false`; the current code-only diff does not itself list rule updates, but default-head IaC does not encode the live containment. |

The SAM comparison treats local build-directory `CodeUri` values versus deployed S3 object locations as code-package differences, not semantic template differences. It does not claim that local and deployed code differ byte-for-byte; it proves that their identity cannot be deterministically mapped from the available template evidence.

### Signals PR #1 safety-only delta

PR #1 head `7e1456d090d841c4cb8410799c097af215397b4b` preserves the exact 36-resource Source Runner set in dev and prod. It has no additions, removals, replacements, IAM changes, DynamoDB/stream/event-source changes, API changes, log-group/alarm changes or ownership changes.

| Environment | Exact proposed changes |
| --- | --- |
| Dev | Update five Lambda code assets and add `LEGACY_SOURCE_WRITES_ENABLED=false` to all five functions. Dev rules are already disabled and Intelligence is already dry-run. |
| Prod | The same five code/environment updates; change KLMA, On The Case, GigsNews, ScenicEye and Intelligence EventBridge rules from `ENABLED` to `DISABLED`; change Intelligence `DRY_RUN` from `false` to `true`. |

Source review proves the four legacy source handlers now default to `dryRun=true` unless the new variable is exactly `true`; the template pins it to `false`. The PR also removes the artist-community fallback writer and corrects the canonical API base variable lookup. This is fail-closed in both automatic and manual invocation paths. Phase 14 build/tests are green, but merge and deployment remain separate decisions: merging does not repair live state, and this audit does neither.

### Required hazard scan

| Hazard | Result |
| --- | --- |
| Remove a Lambda or API route | None proposed by any compared snapshot. The unmanaged Source Inspector route remains outside its template. |
| Detach/recreate/replace a table or other stateful resource | None proposed. |
| Enable canonical streams | None; Enrichment was synthesized with `canonicalChangeStreamsEnabled=false`, and no canonical stream parameters/resources appear. |
| Enable a provider | No enablement delta. Enrichment would update already-wired Google worker code, so paid-provider safety still requires a separate runtime/operational decision. |
| Enable schedules or event sources | No default-head delta. Signals PR #1 only disables five production rules. |
| Broaden IAM | None proposed. |
| Change ownership | None proposed; existing owner gaps therefore persist. |

### Phase 15 conclusion

Template shape is reproducible, but release provenance is not. “No structural difference” is not a deployment approval: Enrichment tests fail; Serverless and Source Inspector use non-updateable runtimes; several broad code-package rewrites remain unmapped; current Signals main does not encode live containment; and runtime/DLQ/alarm findings remain open. Signals PR #1 is the only bounded fail-closed template delta found.

## 14. Cowork inventory

### Phase 16 — available operational artefacts and task evidence

**CURRENT COWORK INVENTORY UNAVAILABLE.** No current Cowork scheduler export, task-ID export, enabled/paused-state export or configured-cadence export exists in the available BNDY operational artefacts. The audit searched the canonical population workspace and scoped operations repository without accessing a Cowork product surface. `TASK-PROMPTS-v4.md` is a prompt-definition document, not an installed-task export; `SCHEDULED-TASK-PROMPTS-v3.md` contains older labels and was superseded by v4; and `BNDY-RECOVERY-TRACKER.md` marks itself superseded and says not to cite it as current state.

The strongest current evidence is the canonical heartbeat directory and append-only `run-summary.jsonl`. The heartbeat contract says one file is written for every firing and `completed` means the task ran. It proves recent execution outcomes, not the scheduler's current enabled flag, task ID or configured cadence. Firings recur at daily-shaped morning times, with additional out-of-pattern runs on 27 and 29 August; exact configured cadence is therefore **UNVERIFIED**.

`TASK-PROMPTS-v4.md` names the five current source slugs and directs each import through `RUNBOOK.md` Section 6A. That runbook pipelines source rows into BNDY, permits creates/edits under gates and requires read-back verification. The ledger records actual non-zero writes. Cowork is therefore a demonstrated canonical-writer path even though its current scheduler control plane is unavailable.

| Source | Cowork task identity / generation | Scheduler state and cadence | Latest observed run / last successful run | Canonical-writer capability | Corresponding Backline path | Corresponding Signals path | Duplicate-execution risk |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Insangel | Current task name/ID **UNVERIFIED**; v4 slug `insangel`; historical v3 label `Bv2a insangel` | **UNVERIFIED**; recent daily-shaped firings observed | Latest fired `2026-08-30T05:02:52Z`, failed at `6A.3 no-capture-surface`; last success fired `2026-08-28T05:02:32Z`, completed `05:17:00Z` | Yes; last-success ledger records eight gigs added | `insangel-daily-import`: disabled, shadow, writer `cowork` | None found | One recently firing Cowork path now; latent duplicate if Backline is enabled. Repeated capture failure remains unresolved. |
| KLMA | Current task name/ID **UNVERIFIED**; v4 slug `klma-stoke-gig-list`; historical v3 label `Bv2a KLMA` | **UNVERIFIED**; recent daily-shaped firings observed | Fired `2026-08-30T03:08:52Z`; completed `03:21:00Z`; ledger records five gigs added | Yes | `klma-stoke-gig-list`: enabled, shadow, writer `cowork`; registry dispatcher acquisition | `bndy-klma-runner-{dev,prod}`; rules disabled, prod concurrency `0` | **Active duplicate acquisition:** Cowork plus Backline. Backline cannot project while global control is absent; Signals remains a latent writer. |
| GigsNews | Current task name/ID **UNVERIFIED**; v4 slug `gigs-news`; historical v3 label `BV2a GigsNews` | **UNVERIFIED**; recent daily-shaped firings observed | Authoritative `gigs-news` heartbeat fired `2026-08-30T04:07:17Z`; completed `04:16:00Z`; zero writes. The duplicate `gigs-news-uk` heartbeat is marked superseded and is not a sixth task | Yes; earlier ledger entries record writes | `gigs-news-daily-import`: enabled, shadow, writer `cowork`; registry dispatcher acquisition; Backline health state is stale | `bndy-gigs-news-runner-{dev,prod}`; rules disabled, prod concurrency `0` | **Active duplicate acquisition:** Cowork plus Backline. Backline projection is gated; Signals remains a latent writer. |
| ScenicEye | Current task name/ID **UNVERIFIED**; v4 slug `sceniceye`; historical v3 label `Bv2a ScenicEye` | **UNVERIFIED**; recent daily-shaped firings observed | Fired `2026-08-30T04:36:30Z`; completed `04:53:00Z`; ledger records two gigs added | Yes | `sceniceye-daily-import`: live registry disabled and shadow; deployed compiled health catalog still treats it as enabled | `bndy-sceniceye-runner-{dev,prod}`; rules disabled, prod concurrency `0` | Cowork is the only observed current execution path, but contradictory Backline catalog/config creates latent duplicate and monitoring risk; Signals is also latent. |
| On The Case | Current task name/ID **UNVERIFIED**; v4 slug `onthecasemusic`; historical v3 label `Bv2a otcm` | **UNVERIFIED**; recent daily-shaped firings observed | Fired `2026-08-30T03:31:10Z`; completed `03:51:00Z`; zero writes | Yes; prior ledger entries record writes | `onthecase-gig-index`: enabled, shadow, writer `cowork`; direct hourly acquisition rule | `bndy-onthecase-runner-{dev,prod}`; rules disabled, prod concurrency `0` | **Active duplicate acquisition:** Cowork plus hourly Backline. Backline projection is gated; Signals remains a latent writer. |

### Phase 16 conclusion

Cowork cannot be described as disabled or paused. Its task-control inventory is unavailable, and fresh heartbeats prove four completed source runs plus one failed source run on 30 August. Backline's global projection gate prevents its shadow acquisitions from becoming canonical writes, and Signals automatic paths are live-contained, but Cowork independently retains demonstrated canonical-write authority. Canonical writes are therefore **not proven disabled estate-wide**, and the acquisition boundary is already duplicated for KLMA, GigsNews and On The Case.

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
- **Impact:** default head cannot be treated as fully green. The route is responsive in aggregate access logs, but the expected smoke contract remains unverified.
- **Required decision:** diagnose after the route ownership boundary is contained; do not rerun the mutating workflow as a diagnostic.
- **HITL approval:** Required for any remediation; not required for continued read-only investigation.

### P1 — Post-closure serverless deployment rewrote 23 functions from an unmapped source

- **Evidence:** change-set events `d29efce5-...` / `909c18e5-...`, SAM CLI description and 23 `UpdateFunctionCode20150331v2` events at 16:08:36Z; stack events show all completed. This was a local Windows SAM deployment by `bndy-deployer`, not a GitHub run, and no clean Git SHA is deterministically attached.
- **Affected resource:** 23 `bndy-serverless-api` Lambda functions and the production API release baseline.
- **Impact:** the 13:51 recovery report is not current code-provenance evidence. Although the update used the correct owning stack, current production code cannot yet be asserted equal to the current default branch.
- **Required decision:** complete the clean SAM/deployed-template comparison and designate a reproducible release artefact/source mapping before the next deployment.
- **HITL approval:** No for read-only validation; yes for any deployment or release-boundary change.

### P1 — Serverless templates contain 17 function definitions on a non-updateable runtime

- **Evidence:** the clean default-head SAM builds succeed, but `sam validate --lint` rejects 16 explicit `nodejs20.x` resources in the main API template and the additional Source Inspector function in its dedicated template. The lint rule records that creation was disabled on `2026-06-01` and updates on `2026-07-01`.
- **Affected resource:** 17 Lambda definitions across the two Serverless repository templates and their recovery/deployment paths.
- **Impact:** a future recovery or feature deployment can fail even when repository tests and packaging succeed.
- **Required decision:** migrate every explicit `nodejs20.x` function to a supported runtime, pass lint/build/tests, then review the deployed-template difference.
- **HITL approval:** Yes for deployment; no for local remediation and validation.

### P1 — Enrichment default-head parity gates fail

- **Evidence:** clean remote head builds, synthesizes and passes 367/369 tests, but KLMA evidence does not match its manifest hash and GigsNews reports a material evidence-input difference in addition to five expected rule changes.
- **Affected resource:** KLMA and GigsNews parity evidence plus the proposed `GoogleDiscoveryWorker` code asset.
- **Impact:** donor-evidence and source-normalisation parity is not proven, so the otherwise code-only proposed Enrichment update is not safe to deploy.
- **Required decision:** reconcile fixtures/manifests or implementation through reviewed source changes and restore the full suite to green.
- **HITL approval:** No for local correction; yes for deployment.

### P1 — Current Cowork scheduler authority is unavailable while canonical-writing tasks still fire

- **Evidence:** no current scheduler/task export exists in the scoped BNDY artefacts. The v4 task definition names five source imports and delegates them to the canonical-writing runbook; heartbeats on 30 August record completed KLMA, GigsNews, ScenicEye and On The Case runs plus a failed Insangel run. The append-only ledger records recent canonical creates. Historical task labels exist only in superseded v3 material.
- **Affected resource:** Cowork source tasks for Insangel, KLMA, GigsNews, ScenicEye and On The Case, plus their overlapping Backline/Signals acquisition paths.
- **Impact:** operators cannot prove current enabled state, configured cadence or task IDs, cannot demonstrate estate-wide write containment, and have active duplicate acquisition for KLMA, GigsNews and On The Case.
- **Required decision:** obtain a current Cowork task export through the authorised operator, identify one acquisition/writer authority per source, and pause or retire duplicates through a separately approved change.
- **HITL approval:** Yes — inspecting or changing the Cowork scheduler is outside this artefact-only audit.

### P1 — Production Source Runner template would re-enable five contained triggers

- **Evidence:** fresh detection `ef8fee70-a4b1-11f1-8320-02bc20eea893` reports five `/State` differences: template `ENABLED`, live `DISABLED` for GigsNews, KLMA, On The Case, ScenicEye and the intelligence-pass S3 trigger.
- **Affected resource:** `BndySourceRunner-prod` and its five production EventBridge rules.
- **Impact:** current live containment is fail-closed, but deploying the current stack template can silently restore automated acquisition and intelligence processing.
- **Required decision:** merge/adopt fail-closed IaC without deploying it automatically, then review a bounded deployment under separate approval.
- **HITL approval:** Yes; this audit will not reconcile drift.

### P1 — Source freshness control is in ALARM with contradictory source authority

- **Evidence:** the only scoped alarm changed to `ALARM` at 21:11:13Z; Source Health recorded three invocations/three errors and zero throttles. Count-only logs identify `gigs-news-daily-import` as stale and `sceniceye-daily-import` as missing. GigsNews last succeeded on 28 August despite daily/26h policy and is not due until 4 September; ScenicEye is monitored as enabled in deployed code but disabled in live registry config.
- **Affected resource:** Source Health worker/rule/alarm, GigsNews and ScenicEye source authority and daily coverage claims.
- **Impact:** the newly deployed health gate immediately disproves current daily-coverage health. Its alarm has no action and EventBridge has no DLQ, so failure is silent outside polling and can retry without quarantine.
- **Required decision:** reconcile compiled catalog, registry enablement and effective cadence before declaring the source estate healthy; add an approved notification/DLQ design separately.
- **HITL approval:** Yes for configuration, schedule, alarm action or DLQ changes; no for continued read-only diagnosis.

### P1 — Projection DLQ contains 37 recent terminal failures

- **Evidence:** exact SQS control-plane attributes show 37 visible messages, zero in flight and zero delayed in `BndyEnrichmentStack-ProjectionDLQ7E1DC66F-PxEmZhDGVUV6`; the latest `ApproximateAgeOfOldestMessage` datapoint is 1,656 seconds. Aggregate logs contain exactly 111 Projection error records—three attempts per DLQ message—while partial-batch handling leaves Lambda `Errors` at zero. The primary queue is empty and its mapping is enabled.
- **Affected resource:** Enrichment projection worker, Projection queue/DLQ and any canonical entity operations represented by those messages.
- **Impact:** runtime health cannot be declared while recent work has exhausted the three-attempt redrive policy. The audit intentionally did not read message bodies, so failure class and replay safety are unknown.
- **Required decision:** diagnose from aggregate logs and approved operational metadata; any message inspection, purge or redrive requires a separately reviewed recovery procedure. Do not enable global projection to test it.
- **HITL approval:** Yes for message access/redrive or a control change; no for continued read-only log diagnosis.

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

### P2 — Scoped alarm and log-retention coverage is insufficient

- **Evidence:** only one of 12 regional alarms covers any of 74 scoped Lambdas, 17 queues or 19 EventBridge rules; none covers queue depth/age, API errors or partial-batch failures. The one scoped alarm has no action. Forty-six existing Lambda groups and the API access group retain indefinitely; 16 functions have no group because they have not run.
- **Affected resource:** Backline, Capture, Source Inspector and Signals operational detection and log-cost/privacy boundaries.
- **Impact:** the Projection DLQ accumulated without an alarm and the Source Health alarm is silent; most logs have no bounded retention policy.
- **Required decision:** define alert ownership and reviewed thresholds/actions, including DLQ age/depth and partial-batch failure signals, plus explicit retention by data class.
- **HITL approval:** Yes — alarms, notification targets and retention are configuration changes outside this audit.

### P2 — Source Runs recorded 14 unalarmed Lambda errors

- **Evidence:** 58 invocations and 14 Lambda `Errors` from 12:00Z–21:09Z, concentrated between 16:30Z and 20:00Z; zero throttles. Later 20:15Z–20:35Z invocations had no errors, and aggregate log categories did not identify initialization, timeout, throttle or generic exception signatures.
- **Affected resource:** serverless API Source Runs/Backline Explorer observability function.
- **Impact:** the operational read surface had a 24.1% function-error rate over the window without an alarm. The later clean calls reduce current severity, but root cause remains unknown.
- **Required decision:** correlate application/request context through the normal owner process without exposing tokens or user data; add an appropriate error-rate alarm after confirming expected failure semantics.
- **HITL approval:** No for read-only diagnosis; yes for code, deployment or alarm changes.

### P2 — An executable post-closure Source Runs change set remains available

- **Evidence:** change-set event `0605a0bb-...`; live `describe-change-set` reports `CREATE_COMPLETE / AVAILABLE`, description naming commit `db7f5086`, with non-replacement modifications to `BndyHttpApi.Body` and `SourceRunsFunc.Code`. No matching execution event exists.
- **Affected resource:** `bndy-serverless-api` HTTP API definition and Source Runs Lambda.
- **Impact:** a stale manual release artefact can still be executed later and bypass a newly reviewed build; the descriptive commit label is not deterministic deployed-artifact proof.
- **Required decision:** owner must decide whether to delete or supersede it after review; do not execute it as part of recovery.
- **HITL approval:** Yes — deleting or executing a change set changes AWS state and is outside this audit.

### P2 — Capture's post-closure feature deployment has unmapped Git provenance

- **Evidence:** local SAM change-set events `443ecfd2-...` / `c506e626-...` created the WhatsApp secret, queues, worker, mapping and permissions and updated Capture Lambda/API at 16:36Z–16:38Z; no Capture GitHub run occurred in the window.
- **Affected resource:** `bndy-capture` stack and its WhatsApp admission path.
- **Impact:** ownership is coherent and no hot-deploy bypass ran, but the deployed revision cannot yet be attributed to a clean repository SHA.
- **Required decision:** use the clean Phase 14/15 build/template comparison to establish whether current remote source reproduces the deployed shape; retain `UNMAPPED` if not deterministic.
- **HITL approval:** No for read-only comparison; yes for any redeploy.

### P2 — Recovered entity tables lack table-level recovery protections

- **Evidence:** `bndy-entity-claims`, `bndy-entity-memberships`, `bndy-entity-invites` and `bndy-join-analytics` are CloudFormation-owned and in sync, but all have PITR disabled and deletion protection false. Only the parent stack has termination protection.
- **Affected resource:** the four imported serverless API tables.
- **Impact:** stack termination protection does not prevent destructive table replacement during an update, and point-in-time rollback is unavailable.
- **Required decision:** review table-level PITR/deletion protection as a bounded, non-replacement change after ownership is stable.
- **HITL approval:** Yes for any infrastructure change; no for continued read-only work.

### P2 — Production Signals source bucket has no CloudFormation owner

- **Evidence:** `bndy-signals-prod-771551874768` exists with EventBridge delivery enabled and is referenced by the production intelligence event rule, but no active stack claims the bucket. The dev equivalent remains owned by `BndySignals-Storage-dev`.
- **Affected resource:** production Signals source-run object bucket and intelligence trigger boundary.
- **Impact:** retention, notification configuration and lifecycle changes have no current IaC authority; Source Runner depends on unmanaged state.
- **Required decision:** designate and adopt the bucket into one Signals storage owner without replacement or object mutation.
- **HITL approval:** Yes — stateful bucket adoption is outside this audit.

### P2 — Backstage default head lacks reliable validation gates

- **Evidence:** its production bundle succeeds, but typecheck and lint fail; venue-coverage tests fail with an incomplete map mock and produced differing totals across two clean reruns.
- **Affected resource:** Backstage release validation.
- **Impact:** UI changes can appear buildable while type/test regressions are not blocked deterministically.
- **Required decision:** establish lint configuration, reconcile shared types, repair the map mocks, and make repeat runs deterministic and green.
- **HITL approval:** No for local correction; yes for release/deployment.

### P2 — Capture server dependency resolution is not lockfile reproducible

- **Evidence:** the repository has no package lock, so `npm ci` cannot run; Phase 14 required an isolated no-lock install before its passing build and tests.
- **Affected resource:** Capture server validation and packaging inputs.
- **Impact:** different transitive dependency versions can be resolved over time.
- **Required decision:** commit the intended lockfile and validate with `npm ci`, Node/Python tests and clean SAM build.
- **HITL approval:** No for repository work; yes for deployment.

## 16. Minimum safe recovery sequence

Pending final synthesis. No recovery action will be implemented by this audit.

Checkpoint after Phase 16: Phases 1–16 are evidenced. Final synthesis must complete Sections 1, 12 and 16, issue every required explicit verdict, refresh App/Backstage remote heads if they changed again, and commit without pushing.

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

### Phase 8 command record

| Command family | Exit | Evidence obtained |
| --- | ---: | --- |
| `aws dynamodb describe-table --table-name ...` for 19 relevant tables | 0 | Status, creation, billing, keys, GSIs, streams, deletion protection, control-plane item counts and sizes. |
| `aws dynamodb describe-time-to-live --table-name ...` | 0 | TTL state and attribute name. |
| `aws dynamodb describe-continuous-backups --table-name ...` | 0 | PITR status. |
| `aws cloudformation describe-stack-resource` for the four imported tables | 0 | Current stack ownership/status and resource-level `IN_SYNC`. |
| `aws dynamodb get-item` for `CONTROL#PROJECTION / GLOBAL` | 0, no item | Explicit fail-closed global control evidence. |
| Ten exact `SOURCE#<id> / CONFIG` consistent reads | 0 | Only enabled/shadow/writer/schedule/runtime/projection safety fields were retained. No source/table scan occurred. |
| Read-only source inspection of `control-store.ts` and source registry definitions | 0 | Proved absence of the control item evaluates false and identified exact permitted source keys. |

No application item, user data, queue message or private evidence was read.

### Phase 9 command record

| Command family | Exit | Evidence obtained |
| --- | ---: | --- |
| `aws ssm get-parameter --name /bndy/claims/stream-arn --no-with-decryption` | 0 | Approved non-secret String metadata/value, sanitised to table and stream label. |
| Exact `get-parameter --no-with-decryption` for the three canonical stream paths | 254 `ParameterNotFound` each | Confirmed fail-closed absence. |
| In-memory deployed-template regex restricted to `*stream-arn` paths | 0 | Claims path appears only in Serverless API and Enrichment; no canonical stream paths appear. |
| Initial exact `describe-parameters` filter | 0 but false negative | CLI filter construction was corrected with exact `get-parameter`; it did not change state. |
| Diagnostic `BeginsWith=/bndy/` metadata query | 0 | This was broader than the required scope and returned only names/types/timestamps for six unrelated secure parameters. No value or decryption was requested; the unrelated metadata was discarded and is not reproduced. |

The last command is recorded as an audit-scope deviation. It exposed no secret value and caused no mutation.

### Phase 10 command record

| Command family | Exit | Evidence obtained |
| --- | ---: | --- |
| `aws events describe-rule` and `list-targets-by-rule` for 19 rules | 0 | State, cadence/pattern, target, sanitised input, DLQ and retry configuration. |
| `aws cloudwatch get-metric-statistics` for `AWS/Events` Invocations/FailedInvocations | 0 | Delivery/failure sums and latest five-minute delivery bucket since 12:00Z. An initial malformed dynamic dimension returned empty data; corrected dimension strings produced the recorded metrics. |
| `aws scheduler list-schedules` | 0 | No relevant EventBridge Scheduler schedules. |
| `aws s3api get-bucket-notification-configuration` for Signals dev/prod buckets | 0 | S3 EventBridge delivery enabled; no direct Lambda/SQS/SNS notification. |
| CloudFormation physical-resource lookup for both Signals buckets | 0 dev; 254 prod | Dev ownership confirmed; production bucket is unmanaged. |
| Exact source-config timestamp field reads | 0 | Preserved UTC due/last-scheduled strings without locale conversion; no other item attributes retained. |

No schedule, notification, target or function was invoked or modified.

### Phase 11 command record

| Command family | Exit | Evidence obtained |
| --- | ---: | --- |
| `aws cloudformation list-stack-resources` for Enrichment, Capture and both Signals Workflow stacks | 0 | Exact 17-queue owner and logical/physical resource inventory. |
| `aws sqs get-queue-attributes --attribute-names All` for every scoped queue | 0 | Current visible/in-flight/delayed counts, visibility, retention, long-poll, encryption, policy and redrive metadata. No receive operation was issued. |
| `aws lambda list-event-source-mappings` correlation | 0 | Enabled consumers for Browser, Capture Processing, Google Discovery, Projection, Source Scan and WhatsApp; proved the Entity Enrichment primary and all DLQs/quarantines have no Lambda mapping. |
| `aws cloudwatch get-metric-statistics` for `AWS/SQS` `ApproximateAgeOfOldestMessage` | 0 | Latest age datapoints for all queues since 12:00Z; only Projection DLQ and historical quarantine were non-zero. |
| Initial physical-ID-to-queue-name conversion attempt | Non-zero for individual lookups; wrapper exit 0 | CloudFormation already returned queue URLs, so passing each URL as `--queue-name` caused harmless `NonExistentQueue` errors. The command was corrected to use each URL directly; no queue state changed. |

No queue message was received, inspected, moved, deleted, purged or redriven.

### Phase 12 command record

| Command family | Exit | Evidence obtained |
| --- | ---: | --- |
| `aws cloudwatch describe-alarms` and exact alarm refresh/history fields | 0 | Twelve regional metric alarms, zero composite alarms, exactly one scoped alarm; current ALARM state, threshold, missing-data behaviour and empty action lists. |
| CloudFormation-owned function correlation plus `aws logs describe-log-groups` / `describe-log-streams` | 0 after correction | Existence, retention, stored bytes and latest event for every one of 74 function destinations and the production API access group. Two initially mistyped Signals stack names (`API` rather than exact `Api`) returned harmless validation errors and were corrected. |
| `aws cloudwatch get-metric-data` in bounded batches for 74 × Invocations/Errors/Throttles | 0 after correction | Full function metric totals through 21:09Z. A first single Windows command exceeded the process argument-length limit; queries were split into 12-function batches without changing scope. |
| `aws cloudwatch get-metric-statistics` for Source Health and Source Runs | 0 after correction | Minute/five-minute invocation, error, throttle and duration datapoints. One malformed comma-separated `--statistics` attempt was rejected, then corrected to separate values. |
| Aggregate Logs Insights over two ≤50-group batches | 0 | Initialization query IDs `2953f531-...`, `891721e1-...`; exception IDs `f91ada2c-...`, `857a1053-...`; timeout IDs `fab0b843-...`, `46a0a618-...`; throttle IDs `f4503071-...`, `8c4fd791-...`; failed-batch IDs `f87b6ef4-...`, `f1055eef-...`. Only aggregate counts by log group were returned. |
| Targeted Projection aggregate classifiers | 0 | Ten query IDs covering payload/source/claim/control/API/resolution/verification/credential/access/network classes; all returned zero while the broad error count remained 111. No message text or identifier was returned. |
| Targeted Source Health aggregate classifiers | 0 | Query IDs `2e903568-...`, `55f5a2b4-...`, `38dc16bd-...` proved freshness-gate, missing and stale signatures; positive source classifiers `035e87f9-...` and `55eac3e7-...` identified only GigsNews stale and ScenicEye missing. |
| Seven exact DynamoDB `SOURCE#<id> / STATE` consistent reads with a five-field projection | 0 after correction | Source run/success/failure timestamps and consecutive-failure count needed to explain the alarm. An initial incorrect physical table name returned `ResourceNotFoundException`; the exact ledger-owned table was then used. No scan, cursor, observation, metadata or entity data was read. |
| API Gateway stage inspection, aggregate API metrics and access-log Insights query `0dd0d232-...` | 0 | Access logging configuration, disabled per-route detailed metrics, stage-level traffic/errors, and exact Source Inspector route response-status counts without request IDs, errors or bodies. |

No log message body, request ID, user identifier, token, queue message or entity payload was emitted into the audit evidence. Logs Insights operations were read-only and restricted to the audit window.

### Phase 13 command record

| Command family | Exit | Evidence obtained |
| --- | ---: | --- |
| `aws cloudtrail lookup-events` by every required event name from 12:00Z | 0 after correction | Change-set, route/integration, rules/targets, table, SSM and secret-value mutation coverage. An initial PowerShell loop passed the variable name literally inside the lookup expression and returned false zero counts; quoting the full expression corrected it. |
| Lookup of AWS's actual versioned Lambda event names | 0 | 37 code updates, four configuration updates, one mapping creation, eight permission additions, and zero mapping update/delete. |
| Broadened destructive/configuration event-name lookup | 0 | No relevant stack/function/table/queue/rule/schedule deletions, removals, purge, direct API/stage update, bucket notification, concurrency or secret deletion. |
| Resource-name lookup for Source Runs, Capture processor, WhatsApp worker and Source Health | 0 | Correlated versioned API event names and exact CloudFormation actors; ordinary Lambda execution-role assumptions were discarded. |
| `aws cloudformation describe-stack-events` after closure | 0 after correction | Exact resource-level effects and terminal status for serverless, Capture and Enrichment deployments. An initial local `DateTime`/`DateTimeOffset` comparison emitted conversion errors; comparison was corrected to UTC `DateTime` and no AWS call was repeated mutatively. |
| `aws cloudformation list-change-sets` and `describe-change-set` | 0 | Proved the Source Runs change set remains executable and has exactly two non-replacement modifications. No change set was created or executed by the audit. |
| `lookup-events` for `DetectStackDrift` | 0 | Correlated the twelve authorised diagnostic operations with Phase 4. |

Relevant CloudTrail event-ID groups:

- Recovery auth change set: `f60aff53-...`, `bffc6012-...`; Users/Uploads configuration `04f145ba-...`, `5afce1d5-...`; code `a578e9c6-...`, `f2ad9d84-...`.
- Post-closure serverless SAM deploy: `d29efce5-...`, `909c18e5-...`; code events `f8d709ae-...`, `eb683a11-...`, `ea0e9463-...`, `debf7423-...`, `ca94bc12-...`, `c0179d12-...`, `72d39075-...`, `b6347a3f-...`, `b3423a2f-...`, `a4780f05-...`, `967e8544-...`, `8fa66740-...`, `79702a6f-...`, `78f93f52-...`, `fc235de9-...`, `bda21e77-...`, `6346c02c-...`, `42fb86a9-...`, `39cb5744-...`, `2a02de73-...`, `093058e3-...`, `01b8265f-...`, `578f5146-...`.
- Capture deploy: `443ecfd2-...`, `c506e626-...`; secret `4869b420-...`; queues `8c010fc2-...`, `e5c25ac9-...`; worker `abbd3efa-...`; mapping `eb50272f-...`; Capture code/config `ac758448-...`, `f8ee30b5-...`; permissions `2ef02141-...`, `fe43be3f-...`.
- Available Source Runs change set: `0605a0bb-66c4-4d4c-b6b8-7314cf62e6a6`.
- User-confirmed Enrichment deploy: `f206d59c-...`, `72437377-...`; Source Health create/rule/target/alarm/permission `d3ef0421-...`, `d64a89e6-...`, `8b7c73bb-...`, `95fcae0e-...`, `fb6f39a3-...`; existing-function code events are correlated in the Lambda ledger.
- Authorised drift diagnostics: `95731995-...`, `2a18f272-...`, `c361ddbc-...`, `8af19512-...`, `0f1666fd-...`, `792b4ac8-...`, `f19baa34-...`, `53a3a2ad-...`, `26eae5f1-...`, `8743c1ae-...`, `4f2f0e9a-...`, `2515cfb0-...`.

The six Source Inspector direct-mutation IDs are listed in Section 7 and the Phase 7 command record. No request payload containing code locations, template URLs, secret values, parameter values or access-key identifiers was retained.

### Phase 14 command record

| Repository | Commands | Exit / evidence |
| --- | --- | --- |
| Isolation | detached `git worktree add`; `git rev-parse HEAD`; `git status --short` | 0. Source snapshots were initially clean; only deliberate CDK synth output is now untracked in isolated synth worktrees. |
| Enrichment | `npm ci`; build; full and targeted tests; compiled-entrypoint CDK synth; `cdk diff --no-change-set -c canonicalChangeStreamsEnabled=false` | Install/build/synth/diff 0; tests 1. One `GoogleDiscoveryWorker` code asset delta only. |
| Serverless API | `npm ci`; `npm run predeploy`; `sam validate --lint`; `sam build --no-cached` | Install/predeploy/build 0; lint 1 on 16 `nodejs20.x` resources. |
| Signals main / PR #1 | `npm ci`; build; tests; CDK synth in separate detached worktrees | 0 for both; no merge/deploy. |
| Capture | attempted `npm ci`; no-lock install; Node build/tests; Python `unittest`; SAM lint/build | Expected `npm ci` EUSAGE because no lockfile; all subsequent gates 0. |
| MCP | install; build; tests | 0; 40 tests pass. |
| App | install; typecheck; lint; tests; production build | 0; 259 tests pass and lint has five warnings. |
| Backstage | install; typecheck; lint; two test runs; production build | Build 0; typecheck/lint/tests 1 as detailed in Section 3. |
| Website | install; production build | 0; 18 pages generated. |

All AWS access in this phase was read-only CDK lookup. No Lambda, provider, endpoint, workflow or product operation was invoked; no change set or deployment was created.

### Phase 15 command record

| Command family | Exit | Evidence obtained |
| --- | ---: | --- |
| Local CDK synth for Signals main and PR #1 with `stage=dev` / `stage=prod` | 0 | Four clean assemblies per snapshot; only deprecation/cross-stack-reference warnings. |
| `aws cloudformation get-template --template-stage Original` plus in-memory YAML/JSON normalisation | 0 | Deterministic logical-resource sets, top-level sections and changed top-level resource properties for all twelve deployed stacks. No template value containing a secret was emitted. |
| Enrichment `cdk diff --no-change-set` | 0 | One Google Discovery Lambda code-asset difference only. |
| Signals main CDK diff from dev/prod cloud assemblies, `--no-change-set` | 0 | Storage unchanged; Workflow/API/Source Runner code assets only. An initial redundant `--all` option was reported ignored; calls without it repeated the same all-stack results cleanly. |
| Signals PR #1 Source Runner dev/prod `cdk diff --no-change-set` | 0 | Exact five-function environment/code delta and five production rule-state changes; no security broadening. |
| Main Serverless API clean SAM build versus deployed template | 0 | Exact 37-resource and top-level configuration match after treating all 27 build-path/S3 `CodeUri` values as code identities. |
| Source Inspector SAM lint/build and deployed comparison | Lint 1; build/compare 0 | Exact 2-resource configuration match; Lambda code location differs; the dedicated function is an additional `nodejs20.x` lint failure. |
| Capture clean SAM build versus deployed template | 0 | Exact 13-resource and top-level configuration match after treating both `CodeUri` values as code identities. |

Comparison classification was restricted to logical IDs, resource types, changed property names, route structure and explicit safety booleans. Parameter/secret values and deployed asset paths are not reproduced. No stack, function, route, table, stream, mapping, schedule, alarm or provider was modified or invoked.

### Phase 16 command record

| Command family | Exit | Evidence obtained |
| --- | ---: | --- |
| Scoped `rg --files` search in the canonical population workspace and `bndy-ops` | 0 | Found prompt-definition documents and operational ledgers, but no current Cowork scheduler/task export with task IDs, enablement or cadence. |
| Read `TASK-PROMPTS-v4.md`, superseded v3 prompts and the superseded recovery tracker | 0 | Current source slugs and write-capable prompt contract; historical labels only; explicit warning against treating the older tracker as current. |
| Read heartbeat contract and exact latest/last-success heartbeat files | 0 | One-file-per-firing semantics and current outcomes/timestamps for the five named sources. The superseded `gigs-news-uk` duplicate was excluded. |
| Parse selected fields from `data/state/run-summary.jsonl` | 0 after local path correction | Outcome and aggregate create counts only; no entity IDs, payloads or product calls. An initial command accidentally addressed the current directory and returned a harmless local read error before the explicit ledger path was supplied. |
| Read canonical runbook write-contract lines | 0 | Proved that import tasks may create/edit BNDY records under gates and must read each write back. |

No Cowork product surface was opened, no task was invoked or changed, and no product endpoint or canonical record was accessed.
