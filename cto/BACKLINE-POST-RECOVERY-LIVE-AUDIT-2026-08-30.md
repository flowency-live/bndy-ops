# BNDY Backline post-recovery live audit

Status: **IN PROGRESS**  
Latest completed phase: **Phase 1 — identity and stop conditions**  
Audit started: `2026-08-30T20:18:29.598Z`  
Required account: `771551874768`  
Required region: `eu-west-2`

This report is the incremental evidence record for the definitive post-recovery audit following the SAM/CDK infrastructure collision of 29–30 August 2026. Live AWS state is authoritative. Repository state, prior reports and the interrupted audit transcript are supporting evidence only.

Safety boundary: this audit does not deploy, invoke Lambda functions, change infrastructure or configuration, read secrets, consume queue messages, scan application data, trigger workflows, or exercise product endpoints. CloudFormation drift detection is the only authorised AWS diagnostic that initiates an operation.

## 1. Executive verdict

The audit is not yet complete. No resumption or deployment verdict is issued at Phase 1.

| Question | Verdict | Reason |
| --- | --- | --- |
| Is the recovered serverless API stack stable? | UNVERIFIED | Stack, drift, route and runtime checks are pending. |
| Is Enrichment runtime state verified? | PARTIAL | AWS identity and read access are verified; runtime inventory is pending. |
| Are CloudFormation owners coherent? | PARTIAL | Prior evidence identifies collisions; live ownership verification is pending. |
| Are automatic deployment bypasses contained? | NO | Prior evidence says the workflows remain armed; current repository and CI verification is pending. |
| Are canonical writes proven disabled? | UNVERIFIED | Live controls, stream mappings and writer gates are pending. |
| Is it safe to resume read-only Backline work? | NO | The required live audit is incomplete. |
| Is it safe to resume local implementation? | NO | The required live audit is incomplete. |
| Is it safe to merge safety-only changes? | NO | Repository and CI state are pending. |
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
- `bndy-website/docs/SERVERLESS-API-INCIDENT-RECOVERY-2026-08-30.md` is not present in the currently available website worktree and remains to be obtained through read-only repository inspection.
- `Troubleshooting Logs/prompt1.txt` was inspected as an interrupted historical transcript. Its live observations will be independently revalidated, and unsanitised identifiers from it will not be copied into this report.

### Fixed live scope

- AWS account `771551874768`, region `eu-west-2`.
- Known stacks: `BndyEnrichmentStack`, `bndy-serverless-api`, `bndy-capture`, `bndy-source-inspector`, plus all discovered active Signals and related Backline/source/intelligence stacks.
- Repositories: `bndy-ops`, `bndy-enrichment`, `bndy-serverless-api`, `bndy-signals`, `bndy-capture`, `bndy-MCP`, `bndy-app`, `bndy-backstage`, `bndy-website`, and historical `bndy-infrastructure`.

## 3. Repository heads and CI

Pending Phase 2.

## 4. Stack inventory and drift

Pending Phases 3–4.

## 5. Resource ownership ledger

Pending Phase 5.

## 6. Lambda and trigger inventory

Pending Phase 6.

## 7. Source Inspector incident-after-incident analysis

Pending Phase 7.

## 8. Capture hot-deploy analysis

Pending Phases 2, 6 and 13.

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

No final severity classification is issued at Phase 1.

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
