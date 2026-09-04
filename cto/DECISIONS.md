---
type: decision-queue
created: 2026-08-08
updated: 2026-08-09
owner: Jason
style: ASD-STE100
---

# bndy DECISION QUEUE

**This file is the single source. Work top to bottom. One decision at a time.**

Every entry has the same shape: the issue, three options, a recommendation.
Jason answers. The agent writes the ruling into the runbook or the source spec **in the same session**, then moves the entry to CLOSED.

**Rules for the agent.**
1. **Do not log a decision you can make yourself.** If an existing rule already answers it, that is work, not a decision. Nine entries in the first pass were mine and should never have been here.
2. Check the fact before you write the options. Three entries were stale on arrival — the work was already done.
3. Never reuse an ID. `D-33` was issued twice on 2026-08-08 and had to be renumbered.
4. Never delete an entry. Move it to CLOSED with its ruling text.

## STATE — 13 OPEN · 24 CLOSED

| Open | What it is | Owner |
|---|---|---|
| D-13, D-16, D-17, D-18, D-26 | Five record checks. **Mine, not Jason's.** Each needs a lookup, not a ruling. | cowork |
| D-27 | Revoke the old Cognito client. Six days open. | **jason** |
| D-28 | Does a lane's region bind as hard as its cap? Governance. | **jason** |
| D-29 | Authorise a full KLMA reconciliation pass. | **jason** |
| D-30 | insangel egress route. **Likely closed by D-02** — verify, then close. | cowork |
| D-31 | Evidenced deletion is not durable. **Largely answered by D-37 + BLD-32** — verify, then close. | cowork |
| D-33 | Tenant editions — scope a filter or a boundary? | **jason** |
| D-35 | Claim — does the owner-write gate ship first? | **jason** |
| D-36 | The work queue — where does the intelligence run? | **jason** |

**Genuinely Jason's: six.** D-27, D-28, D-29, D-33, D-35, D-36.
**Mine to clear: seven.** D-13, D-16, D-17, D-18, D-26, D-30, D-31.

---

# OPEN

## D-13 · `Kamaro` versus `Komaro`
**Issue.** One-letter difference, both Hampshire. Left unattached under Tier C.
**Options.** A. Same act, merge. · B. Two acts, keep. · C. Check the pages first.
**Recommend: C.** Same reason as D-12.
**Status:** OPEN

## D-16 · Generic city-name placeholder venues
**Issue.** `Derby`, `Ripley`, `Cannock` exist as venues from `poster-import`. They are towns, not places. They cannot be enriched.
**Options.** A. Leave them. · B. Merge each into the real venue if one exists. · C. Delete them.
**Recommend: B, then C for any with no events.** A leaves map pins that read as bugs. C alone risks orphaning a real event.
**Status:** OPEN

## D-17 · Little Vic Sunday start times
**Issue.** Six Sundays were defaulted to 19:00 by §5.6. The venue's other Sundays run at 16:00.
**Options.** A. Correct all six to 16:00. · B. Leave the default. · C. Check the venue's own page, then correct.
**Recommend: C.** The venue page is the authority. If it is silent, use 16:00, because the venue's own pattern beats a global default.
**Status:** OPEN

## D-18 · Verify the Ant Hill Mob alias survived the vault revert
**Issue.** A vault revert may have removed the alias from `sources/fantastical-derby.md`. If it is gone, `create_artist` will again auto-match the Burton act onto the Warwickshire record. This is the canonical §1A.3 three-band trap.
**Options.** A. Check the file now and restore if missing. · B. Assume it survived. · C. Rewrite the alias regardless.
**Recommend: C.** Writing it twice costs nothing. Checking costs a session. Being wrong costs a mis-attributed gig on every Derbyshire run.
**Status:** OPEN

## D-26 · Bone Idol and Abbaholics
**Issue.** Both were corrected on 2026-08-04. One document says this closes the decision. Two others still list it open.
**Options.** A. Confirm closed. · B. Re-review both records. · C. Leave open.
**Recommend: A.** Verify the two records once, then strike the item from all three documents.
**Status:** OPEN — probably already resolved

---

# TIER 4 — governance and security

## D-27 · Revoke the old Cognito client
**Issue.** Client `1j0i62m1ldiqk82q0lba8455n9` is still ACTIVE six days after the replacement was deployed. Two audit files disagree on which client was the exposed one. Both are active.

**Options.**
- **A. Verify production OAuth at backstage.bndy.co.uk, then revoke.**
- **B. Revoke now.**
- **C. Leave both active.**

**Recommend: A.** B risks locking out production if the app still uses the old client. C leaves a known-exposed credential live.

**Status:** OPEN · ⚠ oldest open security item

## D-28 · Does a lane's region bind as hard as its cap?
**Issue.** A run wrote 269 artists outside its authorised Torbay lane. The cap was respected. The region was not.

**Options.** A. Yes — a run that exhausts its region stops. · B. No — the cap is the only hard limit. · C. Warn and continue.
**Recommend: A.** A lane with a soft boundary is not a lane. This is the same failure class as a self-granted override.
**Status:** OPEN

## D-29 · Authorise a full KLMA reconciliation pass
**Issue.** The Cosey Club sheet holds 27 future rows. bndy holds 15. A daily diff can never see a row that failed once, because the row is not new on the next run.

**Options.** A. Authorise one full reconciliation per source. · B. Reconcile KLMA only. · C. Do nothing.
**Recommend: A.** Every diff-based source has this hole. One pass per source closes it. C leaves 12 known missing gigs at one venue alone.
**Status:** OPEN

## D-30 · insangel egress and transfer route
**Issue.** The sandbox cannot reach insangel.co.uk. Three routes exist and none is sanctioned.

**Options.** A. Allowlist insangel.co.uk. · B. Sanction a paste route. · C. Bless a Chrome DOM snapshot form.
**Recommend: C.** Chrome already reaches the site and §0.22 already requires DOM extraction. A needs infrastructure. B needs Jason every night.
**Status:** OPEN · depends on D-02

## D-31 · Evidenced deletion is not durable
**Issue.** On 2026-08-08 spider deleted a gig on the act's own evidence. gigs-news re-created it 40 minutes later. Net zero, but the pipeline fought itself.

**Options.** A. A cancelled status, not a delete (item P4). · B. A tombstone that blocks re-creation. · C. Source precedence — the act's own site beats an aggregator.
**Recommend: A.** P4 is already specced and it also unblocks lemonrock scheduling. B and C are both subsets of what A gives you.
**Status:** OPEN — largely answered by P4

---


---

## D-33 · Tenant editions: is the scope a filter or a boundary?
**Blocks:** E1 (insangel.bndy.co.uk).

**Issue.** Insangel want their own skin and only venues in certain postcodes. They also want "Show all". ⚠ **A venue has a postcode. An artist does not** — artist location is free text by the 2026-07-31 ruling. So artist scope can only be derived from events at in-scope venues, never from the artist record.

**Options.**
- **A. Default filter.** The tenant sets the opening view. "Show all" clears it. One estate, one database.
- **B. Hard boundary.** The tenant can never see outside its postcodes. No "Show all".
- **C. Separate deployment per tenant.** A real fork of data and app.

**Recommend: A.** It is what Jason described, it is the cheapest build, and it reuses the subdomain machinery already in `bndy-frontstage/src/middleware.ts`. B contradicts the stated "Show all". C multiplies every future change by the tenant count.

**Status:** OPEN

## D-35 · Claim: does the owner-write gate ship first?
**Blocks:** E3 (claim).

**Issue.** `owner_user_id` exists. Runbook §0.16 forbids any import from editing an owner-managed record. **The backend gate for §0.16 is marked PENDING — the rule is prose only.** If claim ships first, the next nightly import overwrites the first owner's edits.

**Options.**
- **A. Gate first, claim second.** No claim UI until a machine write to an owned record is rejected by the API.
- **B. Ship together in one release.**
- **C. Ship claim now.** Rely on §0.16 as prose and fix it if it bites.

**Recommend: A.** The gate is small and it is the only thing standing between a claimed venue and a nightly overwrite. C converts a known risk into a user-visible betrayal — the one class of bug a claiming venue will never forgive.

**Status:** OPEN

## D-36 · The work queue: where does the intelligence run?
**Blocks:** E6, and structurally E2, E5 and the whole CTO-INBOX pattern.

**Issue.** Every queue in bndy today is a markdown file. That is the direct cause of "no single view", of items logged three times, and of two entries that would destroy data if executed. Jason wants a mechanical workflow. Enrichment needs Chrome and a logged-in Facebook session, which AWS cannot provide.

**Options.**
- **A. AWS owns the queue. Cowork drains it.** One `WorkQueue` table plus three API routes. The existing enrichment task claims items instead of scanning `list_artists`.
- **B. Full AWS intelligence.** Move enrichment into Lambda. Needs headless browser infrastructure and a Facebook session strategy.
- **C. Keep the markdown files.** Improve the discipline.

**Recommend: A.** It is a small build, it removes Cowork as the system of record, and it replaces four markdown queues with one table. B is a programme, not a sprint, and nothing needs it yet. C has been the policy for two weeks and produced the problem you asked me to fix this morning.

**Status:** OPEN


---

# CLOSED

Move an entry here when it is ruled. Keep the ruling text. Never delete an entry.

*(none yet)*

---

# CLOSED — 2026-08-08

Rulings are kept in full. Never delete an entry.

## D-01 · Empty provenance: may a run delete an unattributed event?
**Blocks:** D11, B10, D8, V4, and the only real artist merge. **Also covers X-OR05.**

**Issue.** 770 of 1,762 artists carry no `externalIds`. An unknown number of events are the same. A run cannot attribute these records, so it cannot safely delete them when a source drops the row. It also cannot prove they came from a source at all.

**Options.**
- **A. Backfill first, then enforce.** No deletes and no reject gate until provenance exists on every record.
- **B. Enforce now, backfill later.** Reject machine creates without `externalIds` from today. Leave old records alone and never delete them.
- **C. Delete on evidence.** Allow a run to delete an unattributed event when the full capture confirms the row is gone.

**RULED 2026-08-08 — B, with the scope corrected by Jason.**

⚠ **My original framing was wrong.** I keyed the rule on "has `externalIds`". Jason wrote hundreds of records directly before this project began and will keep doing so. A hand-made record has no source and never will. Absence of provenance is the CORRECT state for a human write, not a defect.

**The ruling.** The gate keys on **who wrote the record**, not on the payload. It lives at the **route**, not in a flag — a flag can be omitted by the same buggy caller it is meant to catch, which is how `nameVariants` was lost.

- MCP and source-runner routes: reject a create with empty `externalIds`. → `BUILD.md` BLD-07
- UI, community and owner routes: **exempt permanently.** Not "pending a backfill".

**Two knock-on corrections.**
1. **D11's "770 artists" is not a work estimate.** An unknown share are Jason's or the community's and must NEVER be back-filled. Measure the split with `list_artists(aiCreated:true)` first. → BLD-08
2. **§0.17 was already safe for hand-made records.** A source-diff can only propose deleting a record carrying that source's id. A human record carries none, so no run can reach it.

**Status:** RULED 2026-08-08 — B (route-level, machine writes only). Build: BLD-07, BLD-08, BLD-09.

## D-02 · insangel: authorise the lane, or pause the task
**Blocks:** X-OR01, X-OR20, X-OR21, X-OR45.

**Issue.** The insangel task has run three nights. Each night it captures 1,181 rows and writes nothing. It holds correctly, because no seed lane is authorised. It has now discarded 665 importable events three times. Only Jason may change a schedule.

**Options.**
- **A. Pause the task.** Stop the waste today. Decide the lane later.
- **B. Authorise a named lane now.** Write the name, the region scope, the cap, the per-batch go or no-go, and the closing condition.
- **C. Leave it running.** Accept the nightly waste as a cheap freshness check.

**RULED 2026-08-08 — Jason: "This is fixed. Close it."**

Egress to `insangel.co.uk` is restored. The task can reach its source again.

⚠ **Two items stay open. Closing D-02 does not close them.**
1. **D-05 — the externalId form.** Still a one-way door. Rule it before the first insangel write, not after.
2. **No lane is authorised.** The task will hold again tonight under §6A step 5, unless §0A's "a missing snapshot is a first run" now covers it. **Verify tomorrow's run wrote something.** If it held, the lane is the blocker, not egress.

**Status:** RULED 2026-08-08 — CLOSED. Egress fixed.

## D-03 · Open mic events: which model?
**Blocks:** P1b (build), P1c (import rule).

**Issue.** bndy rejects every open mic. The rule "no artist name, no import" was written to stop promo copy becoming fake artists. An open mic has no named act because that is the format. The most grassroots category in live music is the one bndy discards.

**Options.**
- **A. Artist-less event type.** Add `eventType: open_mic | jam | karaoke`. Allow an empty `artistIds` when set.
- **B. Venue-owned recurring night.** A first-class recurring entity on the venue that generates occurrences.
- **C. Host as the artist.** Model the compere as the act.

**RULED 2026-08-08 — B. Port the existing model, then wire recurrence to it.**

⚠ **My original three options were wrong.** I offered a choice of model. The model was already built. Investigation on 2026-08-08 found open mic working end to end on the community route, and a full recurrence engine already written and server-validated.

**What already exists — do not rebuild any of it.**
| Layer | State | Evidence |
|---|---|---|
| Backend, community route | Works. `artistId: null` allowed, `type: 'open-mic'`, auto-title `Open Mic @ <venue>`, optional host artists | `events-lambda/handlers/public.js:828-968` |
| Duplicate gate | Works. An OPENMIC key closes the artist-less hole | `public.js:1009-1011` |
| Frontstage wizard | Works. Toggle, host search, review, POST payload | `wizard/steps/ArtistStep.tsx`, `EventWizard.tsx:86` |
| Frontstage rendering | Works. "Open Mic" and "Open Mic with \<artist\>" | `EventInfoOverlay.tsx:116-123` |
| Recurrence engine | Built. `day\|week\|month\|year`, interval 1-99, `forever\|count\|until` | `events-lambda/lib/event-data.js:37-113` |

**There is no ghost or placeholder artist.** It is a boolean on the event. The host artist is optional and separate.

**The three real gaps.**
1. bndy-app has none of it. Never ported.
2. MCP `create_event` has no `isOpenMic` and no `type`. **This is the actual §0.4 blocker** — a scheduled run cannot import an open mic today.
3. Recurrence is wired to the artist-event route only. Nothing connects it to community or open-mic events.

⚠ **Dead path to remove:** `frontstage/src/lib/services/event-service.ts` throws `'Artist ID is required to create event'`. It contradicts the wizard. Fix or delete it before porting.

**Status:** RULED 2026-08-08 — B. Build: BLD-37, BLD-48, BLD-49, BLD-50.

## D-04 · lemonrock batch 2: go or no-go
**Issue.** Cornwall has a residue of unfinished work. Somerset and Dorset are untouched. The lemonrock feed is a rolling 3-month window, so §5.7 would read the window sliding as cancellation and delete real future gigs.

**Options.**
- **A. Finish Cornwall residue only. Hold Somerset and Dorset.**
- **B. Run all three counties now.**
- **C. Hold everything until P4 (cancelled status) ships.**

**RULED 2026-08-08 — A. Cornwall residue only. Hold Somerset and Dorset.**

⚠ **MY FRAMING OF THIS DECISION WAS FACTUALLY WRONG. The lemonrock agent disproved it with measurement.**

| My claim | Measured truth |
|---|---|
| "rolling 3-month window" | **FALSE. The horizon is 497 days and forward-open.** Live sample of 9 venue pages, 157 gigs, 2026-08-08 → 2027-12-18. Two stored captures agree (392 and 882 days). Over six days the front edge advanced and **the back edge did not contract. Nothing falls off the back.** |
| "§5.7 would delete live gigs" | **TRUE — but not for my reason.** 798 future-dated deletions on a six-day diff. Cause is **capture-method mismatch**, not window slide: the 2 Aug capture is venue-derived, the 8 Aug is artist-derived, and artist pages do not list every gig. §5.7 already requires the same format; **no stored capture in a matching format exists.** |
| county venue counts | **Unsafe.** Slug-suffix matching misses **43 of 100** venues on an unbiased sample. Every county count in this log derives from it. |

**Two of two sampled deletion candidates were confirmed LIVE at source** — gig `948792` Lanterne Rouge and `961026` Schofield Band, both 7 Nov 2026.

**Where my false claim came from and where it spread.** I inherited "rolling 3-month window" from `LEMONROCK-TASK-v1.md` and never tested it. I then used it as the justification for BLD-32 and repeated it in `CONTROL-2026-08-08.md` and `STATUS-2026-07-25-to-2026-08-08.md`. All three are corrected.

**The conclusion survives, the reasoning does not.** Do not schedule any run with removed-row handling until §5.7 has a same-format stored capture AND BLD-32 replaces deletion with a status change. Additive import is safe and idempotent by `<gigId>-<date>`.

**⚠ SUPERSEDED SAME DAY — Jason: "I want ALL gigs Lemonrock has captured now, then a task scheduled to check it weekly."**

**Scope is now the FULL lemonrock estate, not Cornwall.**

I carried the agent's caution into the wrong axis. Its reason was that Cornwall is the only county whose *enumeration* is evidenced — that is a question about whether we found everything, not about whether importing what we found is safe. Under `append-only` (D-37) it is safe: additive, idempotent on `<gigId>-<date>`, and no deletion path runs.

⚠ **The real residual risk is venue creation, not events.** The last pass created ~330 venues and V3 caught **26 wrong geocodes**; 15 stray venues were written before detection and had to be deleted. At full-estate scale that is the thing that will hurt. Mitigations are mandatory, not optional — see the revised agent reply.

**Status:** SUPERSEDED 2026-08-08 — full estate, weekly schedule

## D-05 · insangel externalId form — a one-way door
**Issue.** insangel events carry v1 sha1 hashes, not §6D slugs. The live formula is `sha1("<venue_slug>|<date_iso>|<artist_slug>")[:12]`, pipe-delimited, verified. The spec calls it collision-prone. That criticism is unfounded. ⚠ `edit_event(externalIds)` holds **one id per source**, so a record cannot carry both forms.

**Options.**
- **A. Keep the sha1 hashes.** Correct the spec. Add no new convention.
- **B. Sweep to §6D slugs.** One mechanical migration, then one convention everywhere.
- **C. Decide later.**

**RULED 2026-08-08 — A. Keep the sha1 hashes.**

The form is fixed and permanent: `sha1("<venue_slug>|<date_iso>|<artist_slug>")[:12]`, **pipe-delimited**.

**Actions.**
1. Correct `sources/insangel.md`. Remove the "collision-prone" claim. It is unevidenced. Write the formula with its separators, because the spec currently omits them.
2. Add the form to the §6D table as the insangel exception, beside §6D-bis (Facebook numeric ids). Two documented exceptions to slug ids now exist.
3. Do NOT sweep. Do NOT back-fill. Existing hashes stay.

⚠ **This closes the door.** `edit_event(externalIds)` holds one id per source. No insangel record can ever carry a §6D slug. Reversing this later means deleting and re-creating every insangel event.

**Supersedes:** X-OR10 and X-OR21 in `OPEN-RULINGS.md`. Both proposed a slug back-fill. Strike them.

**Status:** RULED 2026-08-08 — A. Work: spec correction (cowork), §6D table row (cowork).

---

## D-06 · Festivals listed by a source
**Issue.** 17 Cornwall rows are parked. No rule covers a festival that a source lists as a normal gig. The same rows return on every run.

**Options.**
- **A. Skip all festival rows.** Log them. Import nothing.
- **B. Import them as normal events** at the named venue when the venue is a fixed building.
- **C. Import only when the festival is at a venue already in bndy.**

**RULED 2026-08-08 — Jason: "we never do NOT import the discreet gigs if we can get the artist and venue."**

**Written as RUNBOOK §0.27 (v2.22). It SUPERSEDES the "ignore festivals entirely" ruling.**

1. If an artist and a venue resolve, the gig imports. No festival exception.
2. The only test is §0.23 — a fixed building with a correct Google Place ID. A field, marquee, park or street fails it. A pub that badges its own weekend does not.
3. The festival or series name goes in the EVENT TITLE. §0.6 still keeps it out of the ARTIST name.
4. Where a Festival parent exists, attach the children to it.

**Why the old ruling failed.** It was written for fantastical, where every example was a field. It became a proxy for §0.23, and the proxy misfires on a pub. It cost 5 Centurion Portsmouth gigs, skipped three weeks running at a fixed venue already in bndy.

**Spec corrected:** `sources/fantastical-derby.md` lines 59 and 67.

**Also closes D-08 and X-OR26.** Same test, same answer.

**Build raised:** BLD-51 (festival + series UI — backend is built, only the UI is missing), BLD-52 (conflict detection wrongly blocks a second act at one venue on one date), BLD-53 (expose `festivalId` on the import path).

**Status:** RULED 2026-08-08

## D-07 · "Private Function" as a venue name
**Issue.** lemonrock publishes "Private Function" as a venue. It is not a place. It recurs across regions and sources.

**Options.**
- **A. Skip the row.** Never create the venue.
- **B. Create one shared placeholder venue.**
- **C. Import the gig against the artist with no venue.**

**RULED 2026-08-08 — A. CTO decision, not escalated.**

§0.8 and §0.23 already forbade this. Only the named examples were missing. Written into RUNBOOK §0.23 (v2.23): `Private Function` · `Private Party` · `Venue TBC` · `TBC` · `TBA` · `Secret Location` · `Various` · `Your Venue Here`.

**Rejected explicitly: a shared placeholder venue.** One pin standing for every private booking in the UK is a false location, and §0.21 already forbids empty map pins.

**Where a private booking DOES belong:** artist unavailability. That model is already built — `events-lambda/handlers/crud.js`, `unavailableEvent`, venue key deliberately omitted.

**Two findings while checking.**
1. No junk records exist. `search_venue` returns nothing for either name. Nothing to clean.
2. ⚠ **`BUG-VENUE-TBC.md` asserted a "shared national placeholder venue (ruling J3)" that does not exist.** It was written while the device bridge was down and never verified. Corrected in place — a build agent would otherwise hunt a phantom record.

**Status:** RULED 2026-08-08

## D-08 · A pub's own badged festival
**Issue.** Five Centurion Portsmouth gigs were skipped three weeks running. The venue is a fixed pub already in bndy. The rows are skipped only because the listing says "festival".

**Options.**
- **A. The festival skip applies only to non-fixed sites.** Import these.
- **B. Keep skipping anything badged as a festival.**
- **C. Import, and mark the events as part of a festival.**

**RULED 2026-08-08 — closed by D-06. Same test, same answer.**

RUNBOOK §0.27. The venue is a fixed pub already in bndy, so the 5 Centurion Portsmouth gigs import.

**Status:** RULED 2026-08-08 — closed by D-06

## D-09 · Doors time versus stage time
**Issue.** bndy has one `startTime` and no doors field. Forever Queen listed 19:00 doors and 20:45 stage. A funday listed 14:00 to 20:00 with no stage time, and the card then advertised a six-hour gig.

**Options.**
- **A. `startTime` always means doors.** Ignore stage time.
- **B. `startTime` always means stage time.** Fall back to doors when no stage time exists.
- **C. Add a `doorsTime` field.**

**RULED 2026-08-08 — B only. Jason.**

`startTime` means **stage time**. Written as RUNBOOK §0.28 (v2.25).

1. Stage time published — use it.
2. Doors only — use doors, and put `Doors <HH:MM>` in `ticketInformation`.
3. Both — use stage. Doors goes in `ticketInformation`.
4. Neither — §5.6 weekday default.

⚠ **A window is not a time.** `14:00-20:00` is the venue's opening window. Use the start, set `endTime`, and state the uncertainty in `ticketInformation`. Observed live: Radioactive Show at Lepton Highlanders rendered as a six-hour gig.

**C rejected.** No `doorsTime` field. Logged as BLD-55, blocked as not needed.

**Build raised:** BLD-56 — a card must not render a multi-hour window as a set time.

**Status:** RULED 2026-08-08

## D-10 · The allowed genre vocabulary
**Issue.** Sources publish "Acoustic" and "Rock Covers" constantly. Both bounce with a 400. The enum was rebuilt on 2026-08-04, but **no document states whether these two values now pass.** Verify before ruling.

**Options.**
- **A. Extend the enum** to cover the values sources actually publish.
- **B. Keep the enum. Map source values to it** in the import layer.
- **C. Keep the enum. Drop unmapped values** and leave genres empty.

**RULED 2026-08-08 — B. CTO decision, not escalated.**

Checked first. **Neither value is a missing genre.** The canonical list is 36 values in `bndy-frontstage/src/lib/constants/genres.ts`. `Acoustic` is a **boolean flag** on the artist record. `Rock Covers` is genre `Rock` plus `actType: ["covers"]`.

Written as a mapping table in RUNBOOK §0.18 (v2.24), covering `Acoustic`, covers strings, tributes, joined strings, and unmapped genres such as Hip Hop.

**A 400 on a genre is a mapping job. It is not a defect and not a ruling.** This sat open for eight days.

⚠ **Defect found while checking: the two MCP tools disagree.** `create_artist` allows 36 values including `Hardcore` and `Irish`. `edit_artist` allows 34 — both missing. An artist created with `Hardcore` cannot be edited without the enum rejecting it. Raised as BLD-54.

**Status:** RULED 2026-08-08

## D-11 · Cost/Ticket needs a procedure, not a table
**Issue.** The KLMA Cost/Ticket column produced four uncovered values in one run. The spec lists cases in a table. A table cannot cover free text.

**Options.**
- **A. Write normalisation rules** — case-insensitive, strip currency words, map "free"/"FREE"/"no charge" to Free.
- **B. Extend the table** each time a new value appears.
- **C. Import the raw string** and let the frontend handle it.

**ALREADY DONE — closed 2026-08-08 without a ruling.**

The fix was written into `sources/klma-stoke-gig-list.md` §CT on 2026-08-08, before this entry was created. It reads: *"MATCH THIS TABLE CASE-INSENSITIVELY, AND TRIM BEFORE MATCHING (CTO ruling 2026-08-08)"*, with the fallback: a zero price is `Free`, a number is that number, neither is `Check with venue`.

**This entry was stale on arrival.** I logged a decision for work that was already complete.

**Status:** CLOSED 2026-08-08 — already implemented

---

# TIER 3 — cheap. Answer several in one sitting.

## D-12 · `Chill` ×2, Dorchester and Exmouth
**Issue.** The rule says different location means a different act. The two are 50 miles apart in one region and the name is generic.
**Options.** A. Keep both. · B. Merge into one. · C. Check both Facebook pages first, then decide.
**RESOLVED 2026-08-08 — one act. Merged and enriched.**

Evidence: the "Dorchester" record `b37cd4bd` held ONE event, and it was in **Taunton**, not Dorchester. The "Exmouth" record `d3a6c59d` held 54 events including Taunton (7 days earlier) and Dorchester. Footprints overlap, so §1A.2 says one act.

**Executed:** event `6798b8eb` reassigned to `d3a6c59d` and verified by read-back; `b37cd4bd` deleted after confirming zero events remained.

**Enriched from the source's own band page (`lemonrock.com/chill`):** `facebook.com/chillthepartyband`, location Dorchester, `trio`, `actType: covers`, genres Pop/Rock/60s/70s/80s/90s. Bio left EMPTY — the fetch returned a paraphrase, not raw page text, and §2A.1 item 8 requires a verbatim quote or nothing.

⚠ **Root cause found, and it is systemic.** The two records never shared a uniqueness key, because neither `Exmouth` nor `Dorchester` appears in the hand-typed region table at `artists-lambda/lib/identity.js:138`. Both bucketed to `UNKNOWN_REGION`, which by its own comment never matches anything. **488 of 1,956 artists (25%) are in that state.** Raised as BLD-57, BLD-58, BLD-59.

**Full-estate scan, 2026-08-08:** 5 duplicate-name groups remain, all distinguishable by location, none gate-blind. No further merges needed.

**Status:** RESOLVED 2026-08-08

## D-14 · Black Flame duo naming
**Issue.** Created as `Black Flame` with the billing kept as a nameVariant, under ADR-023. Reversible.
**Options.** A. Confirm as created. · B. Rename to the full billing. · C. Split into two records.
**RULED 2026-08-08 — A. CTO. Confirmed as created, under ADR-023.**
**Status:** RULED

## D-15 · Tyler Kent — a personal Facebook profile stored as a page
**Issue.** The stored URL is a personal profile, not an act page. It works today.
**Options.** A. Remove it and leave blank. · B. Keep it until a real page appears. · C. Keep it and flag the record.
**RULED 2026-08-08 — A. CTO. §2A.1 already says blank beats wrong.** A personal profile is not the act's page. Clear the field. Data task, no rule change.
**Status:** RULED

## D-19 · Unnamed tribute acts, e.g. "George Michael - Tribute"
**Issue.** The source names the tributed artist, not the act. Creating "George Michael - Tribute" makes a record that is not a real name.
**Options.** A. Skip the row. · B. Import with the billing as the name. · C. Open the venue's page and find the act's real name.
**RULED 2026-08-08 — C then A. CTO. §0.20 already answers this** — the act's own page is the naming authority. Find the real name; if none exists, skip the row. Never invent `George Michael - Tribute` as an artist.
**Status:** RULED

## D-20 · Does §0.6 renaming extend to venues?
**Issue.** The Railway Arches address now trades as Signature Brew Haggerston. §0.6 covers artist names only.
**Options.** A. Extend §0.6 to venues. Rename, keep the old name as a variant. · B. Keep the old name. · C. Create a new venue.
**RULED 2026-08-08 — A. CTO. Written into RUNBOOK §0.6 (v2.26).** The place_id is the identity, not the name. Rename, keep the old name as a variant, never create a second record. ⚠ Verify the place_id is unchanged first — a different place_id is a different building.
**Status:** RULED

## D-21 · Lane Theatre parking
**Issue.** The Beehive was parked as a ticketed venue. It is unclear whether that precedent covers theatre-type venues.
**Options.** A. Park all theatres. · B. Treat a theatre like any ticketed venue — import and mark `standardTicketed`. · C. Decide per venue.
**RULED 2026-08-08 — B. CTO. Decision 03 already settled it** — ticketing is surfaced, not hidden. A theatre that books grassroots acts is a ticketed venue, not an ignore-list entry. Unparks Lane Theatre.
**Status:** RULED

## D-22 · Short-name `search_artist` confidence is unsafe
**Issue.** 88 of 176 insangel acts have names under 10 characters. At that length a one-character difference still scores 86%, and the auto-link threshold is 80%. `Harlie` matched `Charlie` at 86%.
**Options.** A. Raise the threshold for short names. · B. Require a second signal (location or Facebook) below 10 characters. · C. Leave it and rely on human review.
**RULED 2026-08-08 — B. CTO. This was a build spec, not a decision.** Below 10 characters, require a second signal (location or Facebook) before auto-linking. Already logged as BLD-13.
**Status:** RULED

## D-23 · `venueTier` field and the default filter
**Issue.** Decision 01 Q2 and Q3 are still open. Nothing is blocked today.
**Options.** A. Add `venueTier: grassroots | mid | touring`. · B. Keep `standardTicketed` alone. · C. Defer until a real touring room forces it.
**RULED 2026-08-08 — C. CTO. Defer.** `standardTicketed` covers every venue in the estate today. Deferring costs nothing and avoids a 2,110-venue backfill. Revisit when a genuine touring room forces it.
**Status:** RULED

## D-24 · §1A.1's stated rationale is factually wrong
**Issue.** §1A.1 justifies the 13-value region enum by claiming free-text regions "do not exist in bndy". The data contradicts this. The rule is annotated but unchanged.
**Options.** A. Rewrite the rationale, keep the rule. · B. Remove the rule. · C. Leave the annotation.
**RULED 2026-08-08 — A. CTO. Corrected in RUNBOOK §1A.1 (v2.26).** The claim that bndy cannot store free-text regions was false. The rule stands; its reason is now true. Compound values like `Midlands, UK` are discouraged for AMBIGUITY, not for storage. Stored values remain working data — never sweep.
**Status:** RULED

## D-25 · How to audit bios written before the evidence contract
**Issue.** 14 paraphrased bios were corrected on 08-04. One more was found live on 08-06. 28 more were repaired on 08-07. Older records have no evidence file, so the affected population is unknown.
**Options.** A. Sample 10 and report the fail rate. · B. Re-check every bio. · C. Clear every bio with no evidence file.
**RULED 2026-08-08 — A. CTO. This duplicates work item D2.** Sample 10, report the fail rate, decide from the number. It gates I1 and therefore all scheduling. Not a decision — a task.
**Status:** RULED

## D-32 · (sorted into Tier 1) Adopt the §5.7(a) snapshot-reproducibility rule
**Blocks:** nothing. **Recurrence: 4 sources, 3 consecutive days.**

**Issue.** Snapshot format drift is now the single largest near-miss in the pipeline. A curator typed one extra space into a KLMA cell and the diff returned 4 phantom removals; 3 were future-dated, and §0.17 would have deleted three live gigs. ScenicEye's ", England" artifact put 14 live events at the same risk. Three runs have proposed the same fix and none has been adopted.

**Options.**
- **A. Adopt the wording the sceniceye run proposed.** Normalise both sides before diffing: collapse whitespace, strip trailing punctuation, normalise case on venue suffixes. Write the rules into each snapshot header.
- **B. Require every snapshot to re-diff against its own capture at 0/0 before the run may delete anything.**
- **C. Keep patching each source spec as the drift appears.**

**RULED 2026-08-08 — A and B. CTO decision. Not escalated.**

Jason: *"I really dont know what this decision is and you should be able to make it yourself."* He was right. This was an engineering fix, not a decision. Logging it here was a mistake and it is the pattern he called out.

**Written into RUNBOOK v2.21 as §5.7(a), inside §6A step 5, where the run actually diffs.**

**Status:** RULED 2026-08-08 — done, no build needed.

⚠ **The wider point Jason made, and it stands: there are too many rules, and they collide.** The runbook is 151 KB with 70+ rule statements. Two live collisions are known and unfixed:
1. §5.4 and §0.17 still instruct HIDING. Jason's 2026-08-06 ruling says never hide, delete and recreate. A run reading the runbook today does the wrong thing.
2. The KLMA task prompt ordered runs to STAGE artists. §0A abolished staging. Fixed in TASK-PROMPTS-v4, but it ran for a day against a rule that forbade it.

**Rule: from now the CTO decides anything mechanical and writes it. Only genuine trade-offs reach this file.**

---

# TIER 2 — recurring. Each returns every run until ruled.

## D-34 · The event lifecycle: one field or two?
**Blocks:** E2 (community review), P4 (cancelled). ⚠ **Rule this before either is built, or they will ship two competing fields.**

**Issue.** Three states are wanted: a gig is cancelled; a gig is awaiting review but visible; a gig is normal. These are not one axis. A community gig can also be cancelled. A cancelled gig can also be unreviewed.

**Options.**
- **A. Two fields.** `status: scheduled | cancelled | postponed` (the world) and `moderation: unreviewed | approved | rejected` (our opinion).
- **B. One enum** holding every combination.
- **C. Booleans.** `isCancelled`, `needsReview`, `isRejected`.

**RULED 2026-08-08 — A. Two fields.**

- `status: scheduled | cancelled | postponed` — what is happening in the world.
- `moderation: unreviewed | approved | rejected` — what we think of the record.

Both default to the safe value. Absent means `scheduled` and `unreviewed`, so no backfill is needed.

⚠ **C is what exists today and it is the proof.** `needsReview` is a boolean, it sits on 1,926 of 1,938 artists, and it has never been cleared once.

**Unblocks:** BLD-30 (review queue), BLD-32 (cancelled status), BLD-41 (flag a problem). Build the field once, use it in all three.

**Status:** RULED 2026-08-08 — A

## D-37 · Is bndy append-only, or does it run a delta?
**Blocks:** D-04 scope, BLD-32, §5.7 as a whole.

**Issue.** If bndy is deliberately append-only, removed-row handling should not exist, and §5.7, §0.17, the 798 lemonrock deletions and the cancelled-gig status are all solving a problem that is not there. Additive import is already safe and idempotent on the source's externalId.

**Options.** A. Append-only everywhere. · B. Delta everywhere, once snapshots are same-format. · C. Per source, declared, earned by evidence.

**RULED 2026-08-08 — C. Jason.**

Written as RUNBOOK §0.29 (v2.27). Every source spec declares `delta` or `append-only` at the top, and a run reads it before §5.7.

- **`append-only`** — adds and edits, never removes. §5.7 and §0.17 do not run.
- **`delta`** — may action removed rows, but only when the snapshot re-diffs against its own capture at **0/0** (§5.7(a)) AND was produced by the **same enumeration method** as today's capture.

**A source earns `delta` by evidence, not by intent.**

| Source | Mode | Why |
|---|---|---|
| lemonrock | **`append-only`** | Venue-derived snapshot vs artist-derived capture → 798 future-dated deletions, 2 of 2 sampled live at source |
| onthecase | `delta` | Reproduces its own capture at 0/0 |
| gigs-news | `delta` | Reproduces its own capture at 0/0 |
| klma, sceniceye, insangel, spider | to declare | Assume `append-only` until a 0/0 self-diff is on record |

⚠ **An append-only source is still schedulable.** Withholding a whole source because it cannot do deletions is the wrong trade.

**Status:** RULED 2026-08-08 — C

---
# TIER 5 — big-ticket. Each blocks an epic in `WORK-ITEMS.md` §12.
