# PROMPT FOR VSCODE AGENT — post-trial fix list (2026-07-29)

The supervised KLMA trial passed (see KLMA-TRIAL-RUN-REPORT-2026-07-29.md). Four items surfaced. Same discipline as always: tests first, sam validate, deploy, verify, report. No pattern/rule changes beyond what's specified.

## 1. Bulk-import 500→401 (carried over — still open)
Anonymous POST /api/ingest/bulk-import must return 401, currently 500. CloudWatch via Console; auth check likely throwing or running after body parse.

## 2. Artist externalIds don't persist (found in trial)
`create_artist` (community path) with externalIds AND `edit_artist` externalIds-merge both return `externalIds: []` afterwards — while EVENT externalIds work fine. Determine: storage bug (external_ids never written on bndy-artists) vs response-mapping bug (stored, echoed wrong). Check the actual Dynamo item for artist 8e452e7a-2bbe-4c66-9d4e-b2d85f64b9d1 (two attempted writes of `{source: klma-stoke-gig-list, id: klma-artist-cyril-blake-mbr}`). Fix whichever it is; add a regression test.

## 3. Artist nameVariants + resolver alias matching (REVISED per Jason 2026-07-29 — supersedes the earlier "mid-band → review" framing)
"Danny & Friends" / "Danny Brab & Friends" are BILLINGS of the artist Danny Brab (FIT600aoQ5lpNSejGctN) — known aliases must MATCH automatically, not go to review. Implement the learn-once model (runbook §1A.5):
a. Add `nameVariants` (string array) to artist records: server-side on bndy-artists, exposed in `edit_artist` (additive merge like externalIds) + returned by get/search. Mirror the venues implementation.
b. Resolver: `handleFindOrCreateArtist` must match the incoming name against each candidate's nameVariants (normaliseKey comparison) BEFORE similarity scoring — variant hit = `action:'matched', matchedBy:'name_variant'`.
c. Mid-band safety net: similarity 60–89 + sharedToken + SAME region bucket + NO variant match → `action:'review'` (never silent create). When Jason confirms a review outcome, the billing gets written back as a nameVariant so it never reviews again.
d. Backfill first variants: Danny Brab gets ["Danny & Friends", "Danny Brab & Friends"].
Tests: Danny Brab case verbatim — billing "Danny & Friends" must return matched via variant after (d), and would have returned review (not created) before it.

## 4. Smoke/test residue cleanup
Delete via the API delete routes (they release sentinels — never CLI-delete gated records): "Gate Test Band 2026-07-27" (82d342f9-0389-4ad2-b2fe-534a240fd2a5) + whatever artists/events your enforce smoke tests created ("Legitimate new artist", same-name-diff-region test record — you have the ids). Verify each is zero-event first; confirm sentinel rows gone after.

## 5. Orphan event sentinels (found in full KLMA run 2026-07-29 — Jason approved)
Event f40fccde-d448-4514-8bc4-6cb7f52cc6d8 no longer exists (get_by_id 404) but its `bndy-unique-keys` event# rows are still live — they block legitimate creates for Eaton Park (`HOifh16xNRfedOMgSkG1`) and The Vanz (`7a16a3b6-ed61-4d0f-8191-1d89fdcf440f`) @ The Bush (`YUno720qqVNIwH0wgAob`) on 2026-08-01. Likely cause: event deleted via a path that didn't release sentinels (CLI cleanup, or deletion between backfill and enforce).
a. One-off sweep: scan ALL `event#` rows in bndy-unique-keys, verify each stored eventId exists in bndy-events, delete orphans; report count + the released keys.
b. Add the same orphan check (events + artists + venues) to the daily integrity Lambda spec (BACKEND-GATES-PHASE5-SPEC.md).
c. Confirm the API delete routes release EVERY sentinel an event claims (all artistIds + collaboratingArtistIds keys, not just primary) — add a regression test.
After (a), tell the session so it re-runs the two blocked creates.

## 6. Orphan EVENTS + artist-delete guard (found 2026-07-29 evening — So-Oasis incident; URGENT, visible on public map)
Cleanup deleted duplicate artists but left their EVENTS behind, pointing at dead artistIds — frontend renders them as artist "Artist" with no link. Confirmed pair (both created by the OLD pre-gate KLMA task 13/24 Jul, artists deleted in cleanup): events b01a0b4c + 850b37fd @ Swiftys 2026-08-01 — already deleted by hand via API. There WILL be more.
a. One-off sweep: scan ALL bndy-events; flag every event whose artistId (or any artistIds[]/collaboratingArtistIds[] member) does not exist in bndy-artists. Report list (id, title, date, venue, dead artistId, createdAt). DELETE orphans whose date is future and whose only externalIds are import sources; anything else → report for Jason.
b. Backend gate: artist delete must REFUSE (409 ARTIST_HAS_EVENTS) while any event references the artist — zero-event check server-side, not left to protocol discipline. Regression test.
c. Add the dead-reference check (events→artists, events→venues) to the daily integrity Lambda spec alongside the orphan-sentinel check.

## 7. §2A.5 verified-source-name exception is unimplemented — legitimate acts are UNCREATABLE (found 2026-07-30, BV2 local run + follow-up)
`create_artist` returns **400 data_quality_validation_failed** for **"NU CALL - Nu-Metal Tribute Band"** — a real act whose OWN Facebook page (facebook.com/lastcallswindon, 1.1K followers, 71 past events) carries exactly that name. The listing-copy detector reads the " - «descriptor»" tail as promo copy and fails closed.
This is correct behaviour for the Cosey-Club class of junk, and WRONG here: runbook §2A.5 (Jason ruling, Tanky incident) says when the act's own page name IS the billing string, that string is the name. The rule exists in the runbook with no way to express it to the backend — so the gate is currently unpassable for this whole class. (Precedent already in the DB: "Tanky/Electrifying 80's show" a603777d, created before the detector tightened.)
a. Add an explicit, auditable override to the create path — e.g. `verifiedSourceName: true` (+ required `facebookUrl` evidence) that bypasses `isListingCopyName` ONLY, never the other validators; record it on the artist so review can see why it passed. Design your own shape if better, but it must be explicit and logged — not a loosened pattern.
b. Regression tests: "NU CALL - Nu-Metal Tribute Band" + `verifiedSourceName` → creates; the same name WITHOUT the flag → still 400; "Not Guilty - 5pc Local Rock/pop Covers Band" WITH the flag → still 400 if you can distinguish, else document that the flag is trusted and only set after §2A.1 evidence.
c. Report back so the session can create NU CALL (location "UK wide", actType ["tribute"], FB above) plus its event: The Rigger `YOMsEVdj9Y7OMMy88HFV`, 2026-08-21 20:00, £10 ticketed, ticketUrl gigantic.com/nu-call-tickets/newcastle-under-lyme-the-rigger/2026-08-21-20-00.
d. Related, lower priority: confirm free-text/regional locations such as **"UK wide"** (Jason ruling 2026-07-30 for national touring acts) pass validation and bucket sanely in `regionBucket()` — if they slug-fallback or throw, tell us and we'll agree a canonical value.

Done = all seven verified + one-paragraph report each.
