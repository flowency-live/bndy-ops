# PROMPT FOR VSCODE AGENT — data-quality validation gates (amended spec)

> Run AFTER the review-deploy task succeeds. This amends your 4 proposed gates per Jason's rulings and integrates them into the EXISTING gate stack — do NOT build a parallel validation layer.
> Prereqs to read first: `GATE-IMPLEMENTATION-MANIFEST.md`, `bndy-serverless-api/shared/identity/identity.js` (canonical lib + check-sync pattern).

**Integration rule: every validation below lives in `shared/identity/` helpers (synced copies per lambda, extend `check-sync.test.js`) and is ENFORCED in the artist resolver paths (`handleFindOrCreateArtist`, `handleCreateCommunityArtist`, `handleCreateArtist`) — so every writer (MCP, runners, Backstage, bulk-import) inherits them. Add tests to `shared/identity/identity.test.js`.**

## Gate 1 — Multi-artist lineups. JASON'S RULING (final, not optional):
**An artist record is ALWAYS a single act. Multi-artist lineups are ALWAYS written as individual artist records; the combined lineup string appears ONLY in the event title.**

Server side — REJECT artist names matching lineup patterns, HTTP 422 `code: LINEUP_NAME`:
- contains ` + ` or `+` between word groups
- 2+ commas, or comma + `and`/`&` list shape (single `,` alone is ambiguous → allow; single `&`/`and` is a legit duo form — Harris & Wheeler — allow)
- `/\b(ft\.?|feat\.?|featuring|w\/|vs\.?|supporting|plus (special )?guests?|\+ ?\d+ more|more tba)\b/i`
Error message must instruct the caller: split the lineup; one create/resolve call per act; put the full billing string in the EVENT TITLE; acts that can't be named ("2 more", "TBA") stay in the title only — never become artist records.

Importer/client contract (encode in MCP create_event docs + source-runner rules): split billing on separators BEFORE resolving; event gets `artistId` = headliner, `artistIds`/`collaboratingArtistIds` = all resolved acts, `title` = full lineup string. Unparseable lineup → review queue, never a blind create.

## Gate 2 — Placeholder/cancelled names
REJECT artist create when normalised name is exactly one of: `cancelled|canceled|tbc|tba|to be confirmed|postponed|open mic|various|unknown` (422 `code: PLACEHOLDER_NAME`; special-case open-mic events use the existing OPENMIC event key, not an artist).
Plus: add `status` field to events (`confirmed` default | `cancelled` | `postponed`); public endpoints filter or badge `cancelled`. A cancelled gig is an event-status change, never a new artist.

## Gate 3 — Stylized/unsearchable names. NO non-ASCII rejection.
Umlauts/accents are normal in this scene (Motörhead-class names) — a >30% non-ASCII reject rule would bounce legitimate acts. Instead:
- Extend `normalise()` in the identity lib with a Unicode fold BEFORE the existing steps: NFKD → strip combining marks → confusables map (†→t, ᛟ→o, ɸ→f/o etc. — use a confusables table, not an ad-hoc list) → then existing leet-fold etc. Result: ÜL†RᛟɣᛨɸLE† keys toward `ultraviolet` and the EXISTING sentinel bounces the duplicate. Re-run the 73-test suite + add fold tests.
- Storage convention: `name` = searchable plain form; stylized original + typo variants go in the existing **`nameVariants`** concept (do NOT invent a parallel `aliases` field); optional `display_name` for UI stylization is fine as an additive field.
- Only reject when the folded name has zero alphanumeric characters (422 `code: UNSEARCHABLE_NAME`).

## Gate 4 — Zero-event artists. NO auto-delete job. (Jason's data-safety rule + ADR-022 capture-before-prune.)
Backstage artists legitimately exist before their first gig — a blanket weekly delete would eventually eat real user profiles. Instead: extend the daily integrity check to FLAG (review list, never delete) artists where `ai_created = true` AND `owner_user_id = null` AND no memberships AND zero events AND age > 30d. Deletion is always a reviewed batch, never automatic. Note your "28" vs the July audit's 374 zero-event artists — state the exact filter in the report so the numbers reconcile.

## Gate 5 (new, from the KLMA "Not Guilty - 5pc..." incident) — billing-string names + containment
- `sanitizeBillingName()` helper: strip ` - <description>` tails (` - 5pc Local Rock/pop Covers Band`) before a billing string becomes a name candidate. Apply in KLMA adapter parsing rules AND as a resolver pre-step.
- Containment check in the resolver: if `normaliseKey(incoming)` startsWith an existing artist's nameKey (or vice versa, min 6 chars) in the SAME region → `action: review`, never create. (Edit-distance misses this class; the identity key alone won't bounce it.)
- Deep-audit matcher: add the same containment/prefix pass — exact-key + edit-distance≤2 misses these dupes.

## Order & guardrails
Implement after review-deploy is verified; same repo discipline (uncommitted → tests green incl. identity suite + check-sync → commit → deploy log-mode first). "No intelligence at all": these are deterministic rules — no AI judgment anywhere in the accept/reject path. Flag disagreements to Jason; don't redesign silently.
