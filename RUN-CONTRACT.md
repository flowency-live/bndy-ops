# Scheduled task run contract

Version: 2.0, 2026-08-28

This is the output contract for every bndy scheduled task that works in this
folder. It applies independently of the source-specific ingestion runbook.
Source rules decide what a task may do; this contract decides what evidence a
task must leave behind.

## Required end-of-run outputs

Every run, including a no-change, blocked or failed run, MUST finish with all
of the following:

1. Write one append-only machine ledger record to
   `run-ledger/<YYYY-MM-DD>/<TASK>-<RUN-ID>.json`. It MUST validate against
   `RUN-LEDGER-SCHEMA.json`. Use a fresh stable run id and UTC timestamps.
   Never overwrite or reuse a prior run record.
2. Write/update the human report as
   `run-reports/<TASK>-RUN-REPORT-<YYYY-MM-DD>.md` (append a UTC-timestamped
   section if a report for today exists). Include the machine-ledger path.
3. Update `cto/INBOX.md`: add one line under Open with task, run id, outcome,
   created/updated/parked/rejected/error counts and anything needing a CTO
   decision. A clean no-change run still gets a line.
4. Keep state and cursor files where they already live in the repository root.
   Do not move them and do not treat a mutable snapshot as proof of a write.
5. Commit and push:

   ```text
   git add -A
   git commit -m "run(<task>): <date> <one-line outcome>"
   git push
   ```

   If push fails, still commit and record the failure in both the machine
   ledger and human report.

## Machine ledger requirements

The ledger is the hand-off from Cowork to Backline and Godmode. It MUST make
the following independently checkable:

- which source capture, cursor or source-native record was read;
- whether the run was a canonical writer, shadow run or no-write inspection;
- every canonical create, update, cancel/hide, match, skip, park, reject and
  error, including the canonical entity id where one exists;
- canonical API read-back for every successful write;
- identity candidates, confidence, evidence references and the reason for a
  match, park, conflict or rejection;
- artist enrichment outcomes for artist type, act type, genres, acoustic
  capability and official links;
- field-level evidence for every asserted value and every official URL;
- explicit `attempted_no_official_presence` when no identity-safe official
  website or social profile can be found;
- run totals and enrichment-health totals that reconcile with the per-record
  entries;
- every warning, blocker and item needing human review.

Facebook is optional. A Facebook URL is accepted only when evidence ties that
page to the same act, such as an exact gig, venue/date footprint, official
website cross-link or unambiguous self-identification. Name similarity alone
is insufficient. A blank URL or an attempted-no-presence result is healthy;
a wrong artist URL is a critical identity defect.

Artist type and act type use the canonical BNDY taxonomy. Acoustic is a
separate boolean capability. Genres must be supported by source or first-party
evidence and must never be invented to improve completion. A gig region is
source-footprint evidence, not proof of the artist's canonical home location.
An owner-managed or artist self-claimed BNDY profile is the highest first-party
authority; automated evidence may raise conflicts but must not overwrite it.

## Safety and consistency rules

- Never commit secrets, tokens, cookies or personal browser/session data.
- Do not copy whole page dumps into the ledger. Reference the retained capture
  and include only the minimum fact/evidence needed to explain a decision.
- Large database dumps stay untracked as defined in `.gitignore`.
- Counts in the Markdown report, JSON ledger and `cto/INBOX.md` must agree.
- A run is not operationally evidenced until the JSON ledger, human report,
  inbox line and commit are all present. A changed snapshot alone proves only
  that local state moved.
- If the task cannot produce valid outputs, fail closed before any further
  canonical writes and report the blocker.
