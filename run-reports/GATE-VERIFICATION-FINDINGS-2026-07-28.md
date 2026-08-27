# Gate verification findings — 2026-07-28 (full source sweep)

Sweep of current bndy-serverless-api + bndy-MCPServer against every agreed protection. **27/30 PASS** — sentinel gates, event/venue/artist create paths, data-quality patterns (amended), MCP fail-closed clients, template (route/table/env/runtime) all verified present and correct. Copies in sync (check-sync green on device).

## Fixed immediately (Cowork, committed to working tree)
- ✅ `POST /api/artists/community` now runs `validateArtistData` (was the ONLY create path without it — lineup/placeholder/listing-copy names could enter through the unauthenticated door). 422 `DATA_QUALITY` on failure. artists-lambda/handler.js, needs redeploy with the other pending shared/identity amendments.

## FOR VSCODE AGENT — remaining fixes (before or with enforce-mode deploy)

1. **Artist rename/relocate must re-key sentinels** — `handleUpdateArtist` + `handleMCPUpdateArtist` write name/location/facebookUrl with no gate interaction. Required: when any identity field changes → build old + new keys via `buildArtistUniqueKeys`; claim new sentinels + release old ones transactionally (claim-new-with-attribute_not_exists + delete-old in one TransactWriteItems; enforce-mode 409 on collision, log-mode WOULD_BOUNCE). Otherwise: renames create unguarded duplicate identities AND permanently strand old keys.
2. **MCP event update sentinel re-key** — events mcp.js update guard is advisory-only: add sentinel release/claim when artist/venue/date changes, and include artistIds[] + collaboratingArtistIds[] in the duplicate check (currently primary artist only).
3. **Resolver: FB-first match** — in `handleFindOrCreateArtist`, before name scoring: if incoming facebookUrl's facebookKey exactly matches any existing artist's, return `matched` (strongest signal, runbook §1A.2 Step 0). Include facebookUrl in the candidate projection.
4. **Resolver: containment check** — if normaliseKey(incoming) startsWith an existing candidate's nameKey (or vice versa, ≥6 chars) in the same region → `action:'review'`, never `created` (billing-string class: "Not Guilty - 5pc..." / "Cyril Blake 60s & 70s Band - ...").
5. Minor: placeholder set is compared post-article-strip so "The Unknown"/"The Various" get rejected — acceptable, but add "the unknown"-class names to tests as documented behaviour. Dead confusable `'Λ'` entry (lowercased before fold) — remove or move lowercasing after fold.
6. Redeploy checklist: these + the pending shared/identity amendments (narrowed lineup patterns, unicode fold, listing-copy gate, community-create validation) ship together; `npm test` all lambdas + `sam validate` first.

## Known-and-accepted (no action)
Log mode = telemetry-only until enforce; unique-gate degrades loudly if sentinel table missing; events-agent direct writes ungated (Phase 5 deferred, auth required now); unmatched locations fall back to own-slug (fails safe + integrity check will flag).
