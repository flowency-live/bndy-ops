# Rulings — 2026-08-10

Written here because `C:\VSProjects\AllProjectsMD` dropped off folder access mid-session.
**Merge into `DECISIONS.md` and `BUILD.md` when the vault is reconnected.**

---

## 1. Editions — was D-33. RULED A, renamed.

The feature is **EDITIONS**. Insangel is the first customer, not the name. **No partner name in any table, route, flag or component.**

1. An edition is a set of UK postcode areas, a drawn polygon, or both.
2. The operator draws the scope on a map. ⚠ **Jason has built this map selector before. Reuse it. Do not build a new one.**
3. **Gigs filter.** A gig is pinned at its venue, so it inherits the venue postcode.
4. **Artists do not filter.** An artist has no postcode. `/artists` shows every record in every edition.
5. Carried from Jason's original description and not restated: the gig filter is a clearable default view, not a wall.

Build effect: rewrite BLD-38 generically. BLD-73 (remove `lemonrock` and `onthecase` skins, add `london`) is unchanged.

---

## 2. Claim — was D-35. DISSOLVED, not chosen.

Jason, 2026-08-10: *"from day 1, as soon as its claimed we stop touching the record."*

The owner-write freeze is **not a predecessor to claiming. It is the definition of claiming.** They ship as one thing.

Build effect: BLD-40 merges into BLD-39. BLD-71 is no longer blocked on ordering.

---

## 3. Imported gigs at a claimed venue — NEW. RULED A.

**The profile is frozen.** Name, address, photo, description, bio, image. No machine write, ever.

**Gigs keep importing.** An imported gig at a claimed venue is created as normal, marked as source-derived. The owner can delete or hide any of them.

Rationale: a fully frozen page goes stale, because most owners will not enter every gig by hand. Claiming would then leave a venue worse off than not claiming.

---

## 4. Enrichment suggestion store — NEW BUILD ITEM.

Follows from 2 and 3. Enrichment can no longer write to a claimed record.

- Enrichment writes to a **separate suggestions store**, keyed to the record.
- The owner sees them on a new **"bndy AI Enrichment"** tab on their edit page.
- The owner accepts or rejects each suggestion, one at a time.
- **Nothing appears on the public page until the owner accepts it.**

---

## 5. Backlog order, item 1 — RULED.

**Punter accounts are the first item.** bndy is already live; this is an incremental addition, not a release.

- A **"Login or Register"** link at the top of the app.
- Sign-in methods: **socials, email, and magic link.**
- ⚠ **All three are already implemented in `bndy-backstage`. Reuse that implementation. Do not design a new one.**
- Build the user record with roles from day one: `punter`, `curator`, `owner`, `staff`. Adding roles later is a migration.

---

## 6. D-27 revoke the old Cognito client — RULED A.

Verify production OAuth at `backstage.bndy.co.uk` first, then revoke client `1j0i62m1ldiqk82q0lba8455n9`.
**Assigned to a VSCode agent.** Jason 2026-08-10.

---

## 7. D-28 lanes — THE CONSTRUCT IS WITHDRAWN.

Jason 2026-08-10: *"You invented 'lanes', I never asked for that construct. Quality is the gate, not a number or region. If we are adding quality data for events, with enriched artists and valid venues, then a 'lane' can cover off every square foot of the UK for all I care."*

**Lanes are removed.** No region cap. No create cap. No per-batch go/no-go. Delete every lane clause from every source spec, task prompt and runbook section. `sources/lemonrock.md` §9 goes entirely.

**QUALITY IS THE ONLY GATE.** A run continues while every record it writes passes. A run stops the moment quality fails, not when it reaches a number.

A run STOPS and reports when any of these is true:

1. The validator returns any FAIL.
2. An artist cannot be created with either a verified Facebook page or an evidenced no-page-found.
3. Venues created exceed 10% of events created — the venue resolver is failing.
4. A capture is short against the count the source states.
5. A write cannot be verified with `get_by_id`.

Otherwise the run continues. Scope is national by default.

---

## 8. D-29 full reconciliation pass — RULED A. DEFERRED.

**Authorised: one full reconciliation pass per source.** Read everything the source publishes, compare against bndy, import what is missing. A diff-based run can never see a row that failed once, because that row is not new on the next run. Every diff source has this hole. One pass per source closes it.

⚠ **NOT A PRIORITY.** Jason 2026-08-10: do not start this until the bndy-app front-end features are built. Authorised, queued, not scheduled.

### 8a. NEW PRECEDENT — a venue that publishes its own events is its own source.

Jason 2026-08-10, on Cosey Club: *"we have a URL with its published events. This is precedence. We can probably ignore the cosey club in KLMA and just take its own published events."*

**The rule.** Where a venue publishes its own event list at its own URL, that venue becomes its own source. It is then added to the ignore list of every aggregator that also carries it.

- The venue's own page is the authority. An aggregator is second-hand.
- This removes the duplicate-import problem at source rather than deduplicating afterwards.
- **Action: add `Cosey Club` to the KLMA ignore list and create a source spec for its own URL.**

---

## 9. D-36 the work queue — CLOSED. B, already in progress.

Jason 2026-08-10: *"I'm already working on option B."* Enrichment intelligence moves into AWS. Not a Cowork build item — Jason owns it.

**Interim.** Markdown files stay the working store until the backlog moves into a **DynamoDB table**. **ADRs go into Dynamo too.** Until then, keep working the way we are today.

My standing obligation while the interim lasts: nothing gets logged only in a file. Every open item is stated in chat as well.

---

## JASON'S DECISION LIST IS EMPTY — 2026-08-10

All six closed today: Editions, claiming, imported gigs at a claimed venue, accounts first, revoke the Cognito client, lanes withdrawn, reconciliation authorised and deferred, work queue.

---

## ⚠ BLOCKER — BOTH MCP DELETE ROUTES ARE UNDEPLOYED. 2026-08-10.

`delete_artist` and `delete_venue` BOTH return NOT_FOUND naming an undeployed route, while `get_by_id` returns the record a second later. The records exist. The delete routes do not.

```
delete_artist af8c2c46-e1f2-478a-8302-f45875304a31
  -> ARTIST_NOT_FOUND "or DELETE /api/artists/:id/mcp route not deployed yet"
delete_venue  ab88da0e-5f8b-4a53-bb3e-c4bc0751f347
  -> VENUE_NOT_FOUND  "or DELETE /api/venues/:id/mcp route not deployed yet"
```

**This was logged as BLD-64 and marked "not blocking". That is now wrong. It blocks four of Jason's rulings.**

### Rulings made and NOT executed

| Ref | Record | Ruling | State |
|---|---|---|---|
| D-13 | `Kamaro` artist `af8c2c46-e1f2-478a-8302-f45875304a31` | Delete. Not a duplicate, zero events, no content, no findable page. | BLOCKED |
| D-16 | `Derby` venue `ab88da0e-5f8b-4a53-bb3e-c4bc0751f347` | Delete. City centroid, not a venue. | BLOCKED |
| D-16 | `Ripley` venue | Delete. Not yet located. | BLOCKED |
| D-16 | `Cannock` venue | Delete. Not yet located. | BLOCKED |

### Second defect found while doing this

`search_event` rejects `venueId` with `HTTP 400: startDate and endDate required` even when both dates ARE supplied. So the events attached to a venue cannot be counted before deleting it. Both must be fixed together, or a delete could take live gigs with it — which has happened once already (Arena Torquay took a `poster-import` Sex Pistols date).

### On how `Derby` was created

The logged item blamed `poster-import`. It is wrong. The record carries **no externalIds** and `createdSource: mcp_ai_import`. It was one of our own MCP writes on 2026-05-23, with `validated: false` from the moment it was made. Nothing at write time refused a venue whose address is a bare town name. That gate is BLD-26 / §0.23 and it is still not enforced in code.

---

---

## ⚠ BACKLOG ITEM — THE BASELINE IS NOT BEING CHECKED. Jason 2026-08-10.

**The fault.** The Victoria (Little Vic), Newcastle-under-Lyme, `aNJvhjLrO6PhN5l7xLgL`, is a known KLMA venue. bndy holds its socials. The venue's own first social post is a full August listing — roughly 12 live music gigs. **bndy holds ZERO events for this venue.**

Jason: *"Whats the point in me doing any enrichment or spidering for new gigs with AI, if you can't even get the foundational baseline done?"*

**What must change.** For EVERY venue already in bndy that carries a source id, the spider and enrichment tasks must check that venue's own page and socials for gigs bndy does not hold, and import them. That check does not exist today. Both tasks look for NEW venues and NEW artists. Neither closes the gap on venues we already have.

**Where.** RUNBOOK — spider task and enrichment task definitions. The scheduled prompts stay lean and signpost to the runbook, so the runbook is where this is written.

**Scale.** Unknown and probably large. Every KLMA venue, then every source.

**Also observed from the same poster:** this venue's Sunday live music runs at **17:00 and 18:00**, not 19:00 and not 16:00. The D-17 recommendation of 16:00 was wrong.

---

### Mine to clear. No ruling needed from Jason.

| Ref | What it needs |
|---|---|
| D-13 | `Kamaro` vs `Komaro` — check both pages, one act or two. |
| D-16 | `Derby`, `Ripley`, `Cannock` exist as venues from `poster-import`. Towns, not places. |
| D-17 | Little Vic times. |
| D-18 | Ant Hill Mob alias. |
| D-26 | Bone Idol / Abbaholics. |
| D-30 | insangel egress — likely already closed. Verify and close. |
| D-31 | Evidenced deletion — likely already closed. Verify and close. |

