# Scheduled task run contract

Every bndy scheduled task that works in this folder MUST end its run with:

1. Write/update its run report as `run-reports/<TASK>-RUN-REPORT-<YYYY-MM-DD>.md`
   (append a dated section if a report for today exists). Keep state/cursor
   files where they already live (repo root) - do not move them.
2. Update `cto/INBOX.md`: add one line under Open - task name, what changed
   (created/updated/skipped counts), anything needing a CTO decision.
3. Commit and push:
   git add -A
   git commit -m "run(<task>): <date> <one-line outcome>"
   git push
   If push fails, still commit; note the failure in the run report.

Rules: never commit secrets or tokens; large JSON dumps stay untracked (see
.gitignore); a run that changed nothing still commits its report line
("no change") so absence of a commit means the task did not run.
