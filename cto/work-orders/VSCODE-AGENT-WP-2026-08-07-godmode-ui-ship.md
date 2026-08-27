# VSCode Agent Work Package — Ship the Godmode UI Overhaul to main

**Date raised:** 2026-08-07 · **Owner:** Jason (CTO) · **Repo:** `C:\VSProjects\bndy-backstage`
**Task:** Verify and push work that is ALREADY ON DISK. You are not writing features — the changes were built and reviewed by a Cowork session today. Your job is verification, commit hygiene, and pushing to `origin main`.

⚠ Pushing to `main` triggers the Amplify deploy (`amplify.yml`). Do not push until every gate below passes.

---

## 1. What is on disk (18 files, all uncommitted)

A full rework of `/godmode`: shared react-query data layer, one dense virtualized DataTable behind all catalogue pages, bulk actions, a queue-centric dashboard, review-count badge in the nav, and a review-queue page that renders evidence as readable fields instead of raw JSON. No routes changed; `App.tsx` untouched; the existing edit modals were kept and rewired.

**New files:**

```
client/src/pages/godmode/lib/queries.ts
client/src/pages/godmode/components/DataTable.tsx
client/src/pages/godmode/components/godmode-ui.tsx
```

**Rewritten:**

```
client/src/pages/godmode/GodmodeLayout.tsx
client/src/pages/godmode/Dashboard.tsx
client/src/pages/godmode/artists/index.tsx
client/src/pages/godmode/venues/index.tsx
client/src/pages/godmode/events/index.tsx
client/src/pages/godmode/users/index.tsx
client/src/pages/godmode/songs/index.tsx
client/src/pages/godmode/sources/review-queue.tsx
client/src/pages/godmode/index.tsx        ← now a 12-line tombstone (dead, unrouted monolith)
```

**Type/interface fixes (behaviour-neutral):**

```
client/src/lib/services/godmode-service.ts      ← Artist +eventCount?; Venue +facebookUrl?/instagramUrl?; enrichment_data nullable
client/src/lib/services/source-runs-service.ts  ← Map-iteration + implicit-any fixes
client/src/pages/godmode/components/VenueEditModal.tsx  ← imports Venue from godmode-service (types/api never exported Venue)
client/src/pages/godmode/sources/RunDetailModal.tsx     ← typed the stats rows
client/src/pages/godmode/venues/enrichment.tsx          ← callback param types
client/src/pages/welcome.tsx                            ← fixed a genuinely unclosed <div> (pre-existing tsc error)
```

## 2. Hard context — read before judging tsc output

- **`npx tsc` on this repo does NOT pass and did not pass before this work.** Baseline is ~500 pre-existing errors (≈869 output lines) in files like `components/event-modal.tsx`, `pages/setlists*.tsx`, `App.tsx` (duplicate `UserProfile` types), and various `*.test.tsx`. **Your gate is "no NEW errors", not "zero errors."** Do not attempt to fix the pre-existing ones in this work package.
- The 18 files above must contribute **zero** errors. As of 2026-08-07 they do.
- There is no ESLint config in this repo, so `npm run lint` cannot run. Skip it.

## 3. Verification gates (all must pass before push)

1. `git status` — confirm the modified/untracked set is exactly the 18 files above (plus nothing else you didn't expect). If anything else is dirty, STOP and report; do not sweep unrelated changes into this commit. Never stage `.env`.
2. `npm ci` (or `npm install` if ci fails on Windows), then `npx tsc`. Capture output. Confirm **none** of the 18 files appear in the error list. Total error count should be at or below the previous baseline (the rework *removed* errors from 8 files including `welcome.tsx` and `godmode/index.tsx`).
3. `npm run dev` smoke test as a platform-admin user:
   - `/godmode` — dashboard renders section-by-section (skeletons, no full-page spinner); KPI tiles and data-gap rows link through.
   - `/godmode/artists` — full list scrolls in one container (no pagination); sort a column; shift-click a checkbox range; select rows → bulk bar appears bottom-centre; row click opens the edit modal on the SAME row you clicked with sort active (this was a fixed bug — please re-verify); Prev/Next in the modal walks the filtered set.
   - Deep link `/godmode/artists?filter=no-genres` — page opens pre-filtered.
   - `/godmode/events` — eye icon toggles isPublic per row; bulk Publish/Unpublish appears with a selection.
   - Review Queue nav entry shows an orange count badge when open items exist; page groups by source, evidence expands to a field grid with clickable URLs.
   - Navigate between godmode tabs — no refetch storm (network tab: tables load once, cached ~60s).
4. Nothing in the console at runtime beyond pre-existing noise.

## 4. Commit + push

- Optionally `git rm client/src/pages/godmode/index.tsx` instead of committing the tombstone — Jason's call was "safe to remove"; if unsure, commit the tombstone as-is and leave removal for later. Do NOT delete the other stale files (`setlist-editor*.backup`, `user-context.tsx.bak`, `venue-crm-service.ts.backup`) in this WP.
- Single commit, message:

```
godmode: full UI overhaul — react-query data layer, virtualized DataTable, bulk actions, queue-centric dashboard

- shared cache in pages/godmode/lib/queries.ts replaces per-page full-table refetches
- DataTable: virtualized full-set scroll, sortable, shift-click multi-select, bulk action bar
- artists/venues/events/users/songs rebuilt; events get per-row + bulk publish toggle
- layout: grouped nav (Operate/Catalogue) with live open-review count badge
- dashboard: open reviews, failed-run banner, data-gap deep links (?filter=)
- review queue: evidence as field grid; actions still pending BUILD-BRIEF-02 backend
- retire dead godmode/index.tsx monolith; fix VenueEditModal Venue import, welcome.tsx JSX,
  source-runs-service + RunDetailModal + enrichment type errors

Built by Cowork 2026-08-07; verified: tsc (no new errors vs ~500-error baseline), adversarial review (5 bugs found+fixed pre-commit).
```

- Push to `origin main`. Confirm the Amplify build goes green; if the Amplify build fails, report the log — do not force-push or revert without checking whether the failure is the pre-existing tsc noise (Amplify runs `vite build`, which does not typecheck, so it should be unaffected).

## 5. Report back

Reply with: the tsc error-count before/after, the smoke-test checklist results, the commit hash, and Amplify build status. If any gate fails, stop at that gate and report — do not "fix forward" outside the 18-file scope.
