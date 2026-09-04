# spider — RUN REPORT 2026-09-01

**Run id:** `spider-2026-08-31T23-27-15Z` (UTC 23:27Z on 2026-08-31; local date 2026-09-01, BST)
**Runbook read:** v2.27. **Floor asserted:** §6A CURRENT FLOOR v2.19. **PASS.**
**Prompt floor:** the deployed prompt states no number; §6A step 2a is the binding gate.
**Outcome:** PARTIAL.
**Records written to bndy and read back: 7** — 5 events, 2 venues, 0 artists.
**Target: 25.** The run fell 18 short. §11 states the cause without excuse.

---

## 1. Gates

| Step | Result |
|---|---|
| §6A.0 heartbeat | Written first. `data\state\heartbeat\spider-2026-08-31T23-27-15Z.json`. |
| §6A.1 date | Shell down. Device clock used. UTC read from the browser: `2026-08-31T23:27:15Z`. Local date 2026-09-01. |
| §6A.2 runbook + spec | Both read in full. |
| §6A.2a floor | v2.27 ≥ v2.19. PASS. |
| §6A.2b claim | `data\state\claims\spider.json` held by `spider-2026-08-30T01-06-01Z`, `expiresAt` 2026-08-30T02:06:01Z — **in the past**. Ordinary acquire, not a §6G takeover. TTL 60 minutes. |
| §6A.3 tools | bndy MCP reachable. Chrome connected. Facebook session live. **The isolated shell is DOWN** — see §2. |
| §6A.5 snapshot | Not applicable. `spider` is a discovery source with no upstream feed (spec §What this is). Its state is `spider-seen.json`, `spider-coverage.json` and `spider-state.json`. |
| §5.4 tombstones | `data\state\cancellations.jsonl` read. 14 lines. No line matches any artist+venue+date written by this run. |
| §6A.8 validator | **NOT RUN.** See §2. |

**Dead run found.** The previous firing `spider-2026-08-30T01-06-01Z` wrote its heartbeat and never rewrote it. It still reads `"outcome":"started"` with no `finishedAt`. That run died. Its claim had already expired, so no takeover rule was needed. No spider run fired on 2026-08-31.

---

## 2. THE SHELL IS DOWN. THIS RUN CREATED NO ARTISTS. (the decision that shaped the run)

`mcp__workspace__bash` returned `Workspace unavailable ... VM service not running` on two attempts, twelve minutes apart. There is no other route to Python in this session.

`scripts\enrichment_validate.py` therefore could not run. §6A step 8 says a batch with an outstanding `FAIL` does not ship, and states plainly that an agent cannot be the enforcement mechanism for a rule about its own fidelity. A run that cannot execute the validator cannot certify an enrichment write.

**The decision this run made, under §0A rule 1 (a run decides):**

| Write class | Permitted this run | Why |
|---|---|---|
| Event create against an existing artist and an existing venue | **YES** | The validator reads artist and venue enrichment records. An event record holds no bio, no social URL and no enum the validator checks. Its scope over this class is empty. |
| Venue create with **no** enrichment fields attached | **YES** | `create_venue` geocodes and deduplicates on `google_place_id` server-side. The control is the backend place_id gate and §3's three probes, not the validator. No `facebookUrl`, no bio and no image were written. |
| Artist create | **NO** | §2A.5 makes enrich-inline mandatory on every new-artist create, with no exception. That write is exactly what the validator exists to check. |
| Artist or venue enrichment edit | **NO** | Same reason. |

**The cost is measured, not estimated.** 12 rows were found at source that this run could otherwise have written. Every one of them is listed in §7 with its blocker. The precedent for stopping outright is the 2026-08-09 enrichment run (`shell-sandbox-unavailable`), which wrote nothing. This run judged that stopping outright would have cost the 5 events as well, and that those 5 are outside the validator's reach.

Raised to CTO-INBOX as `spider-shell-down-blocks-artist-creates`.

---

## 3. District selection

Cursor `data\state\spider-state.json` read: `nextDistrict: CW2`, written 2026-08-29T20:45:00Z, with the instruction *"STAY IN CW2 one more run IF Chrome is up"*. **Chrome is up.** CW2 worked as instructed.

CW2 saturation is 0.0 over 2 hops. Rule 3 of the district ladder would skip a district under 0.5. The explicit cursor instruction outranks the ladder here, and §Caps says to cover one or two districts properly rather than scatter.

Districts touched: **CW2** (Crewe), **CW1** (Crewe Market Hall), **ST5** (The Rigger), **CW9** (Northwich, FIRST TOUCH), **NG1** (Nottingham, FIRST TOUCH).

---

## 4. Seeds and hops

**11 hops across 10 seeds.** Cap is 20 seeds; the run stopped on yield, not on the cap.

| # | Seed | Rule | Surface | Result |
|---|---|---|---|---|
| 1 | The Express, Crewe `26b80c61-a573-4d17-9542-80d02d7d136b` | 4 | craftunionpubs.com own page | *"Sorry, there are no events available at the moment."* 0 gigs. |
| 2 | Ebenezer's, Crewe `d2823194-97f5-4714-8a2f-1f2bde11455b` | 4 | stored `facebook.com/ebenezerscrewe` | **DEAD URL.** See §8. |
| 3 | Ebenezer's, second surface | 4 | `ebenezers.co.uk/gigs.html` (found via Google) | 4 gigs. 1 already in bndy, 3 blocked on artist creates. |
| 4 | Nantwich Road Social Club `01239430-8bdd-415e-b14c-1fee8ef9ff09` | 4 | `facebook.com/nantwichroadclub` Events tab | *"No events to show."* No website in the links row. 0 gigs. |
| 5 | Crewe Market Hall `fIqoL7N8DSfWuvPiU9Hm` | 4 | crewemarkethall.com / .co.uk | **No reachable surface.** See §8. |
| 6 | **Oli Ng `8c4bd940-3acd-47fc-8b1a-104ac6d6fafd`** | **3** | **olingmusic.co.uk/tour** | **3 gigs, 0 held by bndy. All 3 written.** |
| 7 | **Headsticks `6bffce2b-2f6f-4765-b5be-c847ee1f13c3`** | **1** | **headsticks.co.uk/gigs** | **13 rows. 2 written, 2 already held, 9 skipped with a stated reason.** |
| 8 | The Rigger `YOMsEVdj9Y7OMMy88HFV` | 2 | theriggervenue.co.uk full gig guide | 16 rows. **All 16 already in bndy.** 0 gaps. |
| 9 | Tyler Kent `b2742666-2abe-4ee5-a578-147680bc133e` | 1 | `facebook.com/Tylerjoekent` | No Events tab (personal profile shape). 0 gigs. |
| 10 | Son of Shinobi `f7de2513-207e-4c75-89bc-7f0d0867c7c5` | 3 | `facebook.com/sonofshinobi` Events tab | *"No events to show."* 3.6K followers. 0 gigs. |
| 11 | Mutha Humbucker `5ef26a1b-757e-4588-88c6-a54226511100` | 3 | `facebook.com/muthahumbucker` Events tab | *"No events to show."* 0 gigs. |
| 12 | We Are Nomad `2b5421fe-31af-477d-9b16-852d43149be5` | 3 | `facebook.com/WeAreNomadMusic` Events tab | *"No events to show."* 0 gigs. |

**Seed rule 3 earned its place again.** Oli Ng held a verified page and **zero** future gigs in bndy while his own site published three. That is the silent under-import the rule was written to catch.

---

## 5. Records created — all 7 read back (§0.10)

### Venues (2)

| id | name | address | place_id | district |
|---|---|---|---|---|
| `d6f6778c-29f8-46dc-9a77-65eecee5705c` | The Salty Dog | 23 High St, Northwich CW9 5BZ | `ChIJGZeB5CP5ekgRmXBeQs9eMD4` | CW9 |
| `61b0ccbb-5ef2-4f6d-9508-fc087b189986` | Foremans Bar | 13-15 Forman St, Nottingham NG1 4AA | `ChIJ8_0jHIDBeUgRMILhKEq4DpI` | NG1 |

**§3 probes before each create.** The Salty Dog: `search_venue("The Salty Dog","Northwich")` miss; `search_venue("Salty Dog","Northwich")` miss; `search_venue("Salty","Northwich")` miss; `list_venues(city:"Northwich")` returned 10 records, read in full, no match. Foremans Bar: `search_venue("Foremans Bar","Nottingham")` miss; `search_venue("Foremans","Nottingham")` miss. Both created first time with a Google Place ID at 100% match confidence.

**§0.24 postcode check.** CW9 is Northwich, Cheshire. NG1 is Nottingham city centre. Both agree with the source town.

**§0.23 fixed-building check.** Both are fixed buildings. Foremans Bar describes itself as *"Nottingham's smallest live venue"* — grassroots, admitted.

**Known defect, not raised again.** Both records read back with an **empty `postcode` field** while holding the postcode inside `address`. That is `venue-postcode-field-blank` / BLD-66, already in CTO-INBOX. Not duplicated.

### Events (5)

| id | title | date | venue | startTime |
|---|---|---|---|---|
| `8599fd10-b211-4e01-8823-0e4149002fdc` | Oli Ng @ Crewe Market Hall | 2026-09-13 | Crewe Market Hall `fIqoL7N8DSfWuvPiU9Hm` | 19:00 **DEFAULTED** (Sun) |
| `ee015f8b-d581-4fbd-9406-fe7fcd5eda93` | Oli Ng @ The Salty Dog | 2026-11-21 | The Salty Dog `d6f6778c-…` | 21:00 **DEFAULTED** (Sat) |
| `fc4f76ed-963f-4286-9ad8-220c19a54438` | Headsticks @ The Salty Dog | 2026-11-21 | The Salty Dog `d6f6778c-…` | 21:00 **DEFAULTED** (Sat) |
| `f344bda9-3efd-4924-921f-ef86fd029bc7` | Headsticks @ Foremans Bar | 2026-11-29 | Foremans Bar `61b0ccbb-…` | 19:00 **DEFAULTED** (Sun) |
| `7107bc09-ff3f-4764-b4a1-9e3da3433807` | Oli Ng @ The Rigger | 2026-12-05 | The Rigger `YOMsEVdj9Y7OMMy88HFV` | 21:00 **DEFAULTED** (Sat) |

**All five start times are defaulted.** Neither source page publishes a stage time or a doors time. `startTime` was omitted and the server applied §5.6, returning `startTimeDefaulted: true` on every call. Every one is correctable.

⚠ **One defaulted time deserves a human eye.** `7107bc09` (Oli Ng @ The Rigger, 2026-12-05) is a set inside *Revolution: An alternative Musical Gathering*, which bndy already holds as `41dbd09d-1404-4c89-bfb9-9e81ea3e1b17` running **13:00–23:00**. The default put Oli Ng at 21:00. That is inside the window and is not wrong, but it is not evidence either.

**§4 multi-artist handling.** Both bills were split into discrete per-artist events, per §4 steps 1–3. Sibling event ids for a future parent: Salty Dog 2026-11-21 → `ee015f8b` + `fc4f76ed`. The Rigger 2026-12-05 → `7107bc09` (Oli Ng) + `41dbd09d` (Headsticks, pre-existing).

**Provenance.** Form `{source:"spider", id:"artist-<seedId>-<GIG date>"}`. The gig date is used, not the run date, so the id is unique per event. CTO-INBOX carries `spider-externalid-not-unique-per-event` (2026-08-28) against the run-date form; this run does not reproduce it. One id carries an `-headsticks` suffix where a single seed produced two acts on one date.

**0 events bounced 409.** No sentinel fired.

---

## 6. Venues examined and NOT created

**REJECTED — non-fixed site (§0.23):** Off The Tracks Festival, Castle Donington · Dimpsey Festival, Buckland St Mary · Whitwell Festival, Derbyshire. All three are field festivals with no correct Google Place ID.

**REJECTED — out of region (§Caps, strip defined in `PLAN-500-GIGS.md` §REGION):**
- Katie Fitzgerald's, Stourbridge DY8 (West Midlands, south of the strip) — Headsticks 2026-09-20
- Late Bar, Rhyl LL18 (North Wales; the strip's west coast is Merseyside/Wirral/Chester) — Headsticks 2026-09-26
- The Firebug, Leicester LE1 — Headsticks 2026-10-10
- Riverside Rebellion, Darlington DL (North East, listed out of scope) — Headsticks 2026-11-28
- Dimpsey Festival, Buckland St Mary (Somerset) — also fails §0.23 above

**REJECTED — not grassroots AND out of region:** Boiler Shop, Newcastle upon Tyne NE1. A ~1,100-capacity room, and the North East is out of scope.

⚠ **BORDERLINE, SKIPPED, AND FLAGGED FOR JASON: Fulford Arms, York YO10** — Headsticks, 2026-10-17, *One For The Road Festival*, at a fixed pub. The strip is defined as reaching *"South & West Yorkshire (Sheffield, Doncaster, Leeds) and East Yorkshire (Hull)"* with a *"northern edge Leeds"*. York is **North** Yorkshire and is named in neither list, but it sits geographically between Leeds and Hull. The run skipped it rather than widen the lane unilaterally. **One gig at a real grassroots venue turns on this call.**

**ADMITTED:** The Salty Dog (CW9) and Foremans Bar (NG1) — see §5.

---

## 7. Rows found at source and NOT written — the measured cost of §2

**12 importable rows blocked on the artist-create hold.**

| Source | Row | Date | Venue status | Blocker |
|---|---|---|---|---|
| ebenezers.co.uk/gigs.html | Campbell/Jensen | 2026-12-16 | Ebenezer's held | artist not in bndy |
| ebenezers.co.uk/gigs.html | Shaun Kirk | 2027-04-01 | Ebenezer's held | artist not in bndy |
| ebenezers.co.uk/gigs.html | Terra Spencer | 2027-04-22 | Ebenezer's held | artist not in bndy |
| headsticks.co.uk/gigs | Steve Ignorant (Revolution Gathering) | 2026-12-05 | The Rigger held | artist not in bndy |
| Arena Crewe backlog (carried, not worked) | skiddle 41978670 | — | Arena held | no act named on the listing row |
| Arena Crewe backlog | 42573107 Forever Tina | — | Arena held | artist not in bndy; US same-name trap |
| Arena Crewe backlog | 42630481 Pitbull UK | — | Arena held | artist not in bndy |
| Arena Crewe backlog | 42666800 That 80s Show | — | Arena held | artist not in bndy |
| Arena Crewe backlog | 42669944 Achtung Baby | — | Arena held | artist not in bndy; AU/IT same-name trap |
| headsticks.co.uk/gigs | Fulford Arms, York | 2026-10-17 | venue not held | region ruling, §6 |
| headsticks.co.uk/gigs | Katie Fitzgerald's, Stourbridge | 2026-09-20 | venue not held | out of region |
| headsticks.co.uk/gigs | Late Bar, Rhyl | 2026-09-26 | venue not held | out of region |

⚠ **Two of these carry a non-UK identity trap** (Forever Tina, Achtung Baby) and one is unnamed. Those three would have needed care even with the validator up. The other six are ordinary creates that a working shell would have allowed.

**Ebenezer's acts are non-UK touring artists** — Sara Milonovich & Greg Anderson (New York), Terra Spencer (Nova Scotia), Shaun Kirk (Australia). bndy already holds the first as `23d1e0e2-e29d-4e1f-9d18-37219b47ace4`, so the precedent for a non-UK act playing a UK grassroots room already exists in the data. Whether the other three should be created is a live question, not a settled one.

---

## 8. Source faults found

1. **Ebenezer's stored Facebook URL is dead.** `https://www.facebook.com/ebenezerscrewe` returns *"This content isn't available at the moment"* on a logged-in session, twice, with a 5-second render wait. The live page is **`https://www.facebook.com/Ebenezers1857`**, declared on the venue's own site. The venue also holds a real gig listing at **`https://www.ebenezers.co.uk/gigs.html`** that bndy does not record. Raised as `ebenezers-crewe-facebook-url-dead`. **Not fixed** — an enrichment edit is a validator-governed write (§2).

2. **Crewe Market Hall has no reachable web surface.** `crewemarkethall.com` returns `ERR_SSL_PROTOCOL_ERROR` on https and redirects to `/defaultsite` on http. `crewemarkethall.co.uk` returns the same SSL error. `facebook.com/crewemarkethall` returns *"content isn't available"*. bndy holds 2 future gigs there; the venue clearly runs more. Covered by the standing `venue-websites-stale-or-empty-crewe` entry (2026-08-27) — **not duplicated**.

3. **A Facebook artist Events tab is not a gig surface.** 5 of 5 artist pages read this run published no upcoming events: Headsticks (8.1K followers, and its own website lists **13** gigs), Son of Shinobi (3.6K), Tyler Kent (2.2K), Mutha Humbucker (1.5K), We Are Nomad (230). CTO-INBOX holds `fb-venue-pages-no-upcoming-six-of-six` for *venue* pages. The artist case is new. Raised as `spider-fb-artist-events-tab-not-a-gig-surface`.

4. **`javascript_tool` blocked two reads on the `=` guard** (§6B guard 1) — theriggervenue.co.uk and crewemarkethall.com. Both recovered by transforming `=` to `(eq)` before returning. Named here so it is not read as a source fault.

5. **Facebook pages need a render wait.** A read at 0s returned an empty body for a page that rendered fully at 4s. Two seeds were nearly recorded as empty on this alone.

---

## 9. Deletions

**None.** No row vanished. `spider` has no upstream feed and no snapshot, so §5.7 removed-row handling and §0.17 do not apply to it.

⚠ **The `spider` spec declares no §0.29 mode.** §0.29 requires every source spec to declare `delta` or `append-only` at the top. `sources\spider.md` declares neither. This run behaved as `append-only` and deleted nothing. Sibling entries already exist for sceniceye, gigs-news, klma, insangel and otcm. Raised as `spider-mode-not-declared`.

---

## 10. The metric this source owes

**Discovery saturation: 2 new venues in 11 hops = 18.2 per 100 hops.**

| District | Hops this run | New venues | Saturation this run | Note |
|---|---|---|---|---|
| CW2 | 4 | 0 | 0.0 | Rule-4 queue is now effectively closed. See below. |
| CW1 | 1 | 0 | 0.0 | Crewe Market Hall has no reachable surface. |
| ST5 | 1 | 0 | 0.0 | The Rigger: 16 of 16 rows already in bndy. KLMA has it fully covered. |
| CW9 | 1 | 1 | 100.0 | **FIRST TOUCH.** Reached from the Headsticks hop, not by district selection. |
| NG1 | 1 | 1 | 100.0 | **FIRST TOUCH.** Reached from the Headsticks hop. On the strip's southern edge. |

⚠ **The headline figure is misleading and the table is the honest version.** Both new venues came from **two artist hops**, not from the CW2 district work. The four CW2 district hops returned zero. This is the same blindness recorded as `saturation-blind-to-rule4-fill` (2026-08-28): a district-keyed metric cannot see that an artist hop is what actually grew the map.

**CW2 rule-4 queue status: CLOSED for 30 days.** The Express publishes no events. Nantwich Road Social Club publishes no events and no website. Ebenezer's has a real surface, now recorded in the coverage note. Woodside and The Raven Inn remain unread and are carried forward.

---

## 11. Why the run delivered 7 against a target of 25

Two causes, in order of size.

1. **The shell outage removed the artist-create lane** (§2). 6 of the 12 blocked rows in §7 are ordinary creates that would otherwise have been written. That alone is most of the gap.
2. **The CW2 rule-4 venue queue is worked out.** Four hops, zero gigs, zero venues. That is saturation honestly reported, and the spec says a run that finds nothing new in a worked-out district is a **good** run. It is not the reason to widen a rule.

**What actually worked, and should shape the next run:** two artist hops onto **the acts' own websites** produced 5 events and 2 venues. Every Facebook Events tab read — 5 artist pages and 1 venue page — produced nothing. The next run should rank an act's own website above every Facebook surface, and should prefer artist seeds over the CW2 rule-4 remainder.

---

## 12. Quality measure (§6)

| Class | Count |
|---|---|
| Records created with a verified page | 0 (no artist or venue enrichment attempted — §2) |
| Records created with an evidenced blank | 0 |
| Records skipped, with a stated reason | 12 (§7) plus 7 venue rejections (§6) |
| Names sanitised or refused as non-acts | 2 — *"Open Mic Night"* and *"Anarchy - band showcase"* at The Rigger, both refused under §0.4 as placeholders, not acts |
| Gate bounces (409/422/400) | 0 |
| Deletions | 0 |
| Partial captures | 0 |

**Validator:** not run. Shell unavailable. **0 records were written in the validator's scope**, by design (§2). This is not a claim that a validation passed.

---

## 13. Files written

- `data\state\heartbeat\spider-2026-08-31T23-27-15Z.json`
- `data\state\claims\spider.json` (acquire, then release)
- `data\state\spider-seen.json`
- `data\state\spider-coverage.json`
- `data\state\spider-state.json`
- `data\state\run-summary.jsonl` (append)
- `20-Daily\2026-09-01.md`
- `CTO-INBOX.md` (append, 3 items)
- this report
