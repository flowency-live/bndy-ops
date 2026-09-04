# KLMA Stoke gig list — RUN REPORT 2026-08-21 (second firing)

- **Run id:** `klma-stoke-gig-list-2026-08-21T03-09-03Z`
- **Outcome:** COMPLETED. 7 events created. 5 artists created. 0 venues created. Validator 0 FAIL, 0 WARN.
- **Runbook read:** `RUNBOOK.md` H1 **v2.27**. §6A CURRENT FLOOR **v2.19**. Assertion PASSES.
- **Prompt floor:** the task prompt names no number. It defers to §6A. No drift to report.
- **Spec read:** `sources/klma-stoke-gig-list.md` in full, including §VA and §VA.9.
- **Inbox read:** `CTO-INBOX.md` in full, 392 lines. Fingerprints checked before every item below.
- **Claim:** `data/state/claims/klma-stoke-gig-list.json` read `heldBy: null`, released at 01:56Z by the
  00:24Z run. Acquired normally. **No takeover.** TTL 2 hours per §6G.
- **Heartbeat:** `data/state/heartbeat/klma-stoke-gig-list-2026-08-21T03-09-03Z.json`.
- **Tombstones:** `data/state/cancellations.jsonl` holds 6 lines. None matches an artist, venue or
  date this run wrote.
- **`enrichment.lock`:** absent. Nothing recreated it.
- **Mode:** the spec declares no §0.29 mode. The run used **append-only**. Nothing was deleted.
  Nothing was hidden.
- **Report path:** this file is `RUN-REPORT-2.md`. `RUN-REPORT.md` holds the 00:24Z firing. See the
  standing item `run-report-path-collides-on-second-firing`.

---

## 1. HEADLINE — A ZERO DIFF, AND SEVEN GIGS WRITTEN ANYWAY

**Both source sections were unchanged. 0 added and 0 removed on section 1 and on section 2.**
The section 1 HTML was **byte-identical** to the 00:24Z capture: md5 `706fd8a24a8b45b09abf6380235f6424`,
110,597 bytes both times. The curator made no edit in the 2 hours 43 minutes between the firings.

**A zero diff is not a reason to write nothing.** The standing item `klma-zero-diff-hid-nine-missing-gigs`
says exactly this: the diff measures the source against itself, and it cannot see a gig the sheet has
published for weeks that bndy still lacks.

So this run worked the **named coverage backlog** instead. The 00:24Z report, section 8, listed six
acts it could not reach and named the cost of each. **This run wrote all of them, plus one more.**

| Named in the 00:24Z report | Written this run |
|---|---|
| Groove 45 — Granville's, 2026-09-12 | ✅ artist + event |
| Blitzkrieg UK — The Rigger, 2026-09-04 | ✅ event (artist already existed) |
| The Thirteenth Turn — The Rigger, 2026-09-04 | ✅ event (artist already existed) |
| Deadwax — The Rigger, 2026-09-18 | ✅ artist + event, name corrected to **DeadWax** |
| Boss Cass — The Rigger, 2026-09-18 | ✅ artist + event |
| KNUTMO FIVE — Sugarmill, 2026-09-13 | ✅ artist + event |
| KANGARU — Sugarmill, 2026-09-13 | ✅ artist + event |

**The backlog named in section 8 of the 00:24Z report is now empty.**

## 2. Capture

| Feed | Surface used | Result |
|---|---|---|
| Section 1, KLMA sheet | container `curl` on `gviz/tq?tqx=out:html` | HTTP 200, 110,597 bytes, 429 DOM rows, 8 `td` cells on every row |
| Section 2, Sugarmill | `web_fetch` | 30 distinct gigs, hrefs intact |
| The Rigger | not re-fetched | the 00:24Z firing fetched it 3 hours ago and its findings are used below |
| Cosey Club · Eleven · Artisan Tap | **not fetched** | see §7 |

Column alignment was verified against the header row before any parsing. The header row is DOM row
429 of 429 this run, and reads `Artist / Venue & Location / Time (eg 9pm) / Cost/Ticket / Genre /
Link to Event`. Column 5 carries `Cost/Ticket` and column 6 carries `Genre` on both Rigger rows
worked below. **No column bleed was present** (§VA.5).

## 3. Diff

| Section | Snapshot rows | Capture rows | Added | Removed |
|---|---|---|---|---|
| 1 — KLMA sheet | 428 | 428 | **0** | **0** |
| 2 — Sugarmill | 30 | 30 | **0** | **0** |

**§5.7(a) self-diff gate: the new snapshot re-diffed against the capture it was written from returns
0 added and 0 removed on both sections. PASS.** The result is recorded in the snapshot's own header.

Nothing was deleted and nothing was hidden. The mode is append-only, so §5.7 removed-row handling
and §0.17 did not run.

## 4. What was written

### 4a. Events created — 7

| Event id | Date | Act | Venue | Time | Ticketing |
|---|---|---|---|---|---|
| `72866f2c-d506-4b9b-88d8-015613511494` | 2026-09-04 | Blitzkrieg UK | The Rigger | 19:00 | cell blank, nothing written |
| `cc2e9a6e-fa89-4774-9f21-ba63da76c157` | 2026-09-04 | The Thirteenth Turn | The Rigger | 19:00 | cell blank, nothing written |
| `f72bd006-3ae8-4594-b1e9-37d7ee5f1a5b` | 2026-09-18 | DeadWax | The Rigger | 19:00 | cell blank, nothing written |
| `e6675c64-39b9-4281-9eb8-dfce7dcfab04` | 2026-09-18 | Boss Cass | The Rigger | 19:00 | cell blank, nothing written |
| `c6b39aec-9a09-437a-bf2f-42c1048f8cb3` | 2026-09-12 | Groove 45 | Granville's Restaurant & Music Bar | 21:00 **defaulted** | cell blank, nothing written |
| `f2928c58-e750-4c93-bed2-dfd19768a6a8` | 2026-09-13 | Knutmo Five | The Sugarmill | 19:00 | ticketed, £12.50, Gigantic |
| `f2f30669-58e6-4905-a85e-187fccbdae84` | 2026-09-13 | Kangaru | The Sugarmill | 19:00 | ticketed, £12.50, Gigantic |

Every event carries `isPublic: true` and a source-tagged externalId. Every event was read back
(§0.10): the four Rigger events by `search_event(venueId)`, the Sugarmill and Granville's events by
`get_by_id`.

**The four Rigger events are §4 splits of two genuine multi-act bills.** The sheet bills
`The Varukers, Blitzkrieg UK, The Thirteenth Turn` on 2026-09-04 and
`Riskee And The Ridicule, Deadwax, Boss Cass` on 2026-09-18. The headline of each bill already held a
discrete event. Sibling ids, so a parent can be attached when the generic parent-event container ships:

- **2026-09-04:** `7192e8ce-3312-426b-9a5a-361e7b251152` (The Varukers, headline) ·
  `72866f2c-d506-4b9b-88d8-015613511494` · `cc2e9a6e-fa89-4774-9f21-ba63da76c157`
- **2026-09-18:** `5126279e-72ef-4204-8cc9-b9b1c3fc8e0b` (Riskee and the Ridicule, headline) ·
  `f72bd006-3ae8-4594-b1e9-37d7ee5f1a5b` · `e6675c64-39b9-4281-9eb8-dfce7dcfab04`
- **2026-09-13, Sugarmill:** `38426528-e6ab-47d7-b1ec-2c99fc61bbaf` (The Dream Machine, headline) ·
  `f2928c58-e750-4c93-bed2-dfd19768a6a8` · `f2f30669-58e6-4905-a85e-187fccbdae84`

`billing` and `billingOrder` are set on all six child events.

### 4b. Artists created — 5. Four with a verified page, one an evidenced blank

**`44676164-261d-40a3-a558-f77fe878d3e6` DeadWax** — verified page.
- Page `facebook.com/deadwaxofficial`, 1.8K followers, category **Band**. Visited in Chrome.
- Identity: the page's own Details read *"Holmfirth, United Kingdom, HD9 1UY"*. Its own tagline reads
  *"Alternative Grime Rock"*. Bandsintown lists DeadWax on the Riskee and the Ridicule bill at The
  Rigger on 2026-09-18, which is the exact row imported. The page is live — its most recent post
  names a 2000trees Festival set.
- ⚠ **Name corrected.** The sheet bills `Deadwax`. The act's own page spells it **DeadWax**. §0.20
  gives the act's page the last word.
- ⚠ **A same-name page was REJECTED.** Facebook page search also returned `The deadwax`,
  Musician/band, 8 followers, whose own text reads *"An American rock band from Washington DC"*.
  §0.15 forbids it. bndy is UK-only.
- Bio *"Alternative Grime Rock"* transferred verbatim. genres `Rock / Alternative / Metal / Other`
  (inferred, the only field §2A.1 item 8 permits a run to infer; `Grime` maps to `Other` per §0.18).
  actType `originals`.

**`9fbb698e-7539-4ddc-9f83-4fc402334e62` Boss Cass** — verified page.
- Page `facebook.com/bosscassuk`, 1.1K followers, category Musician/band. Visited in Chrome.
- Identity: **the act's OWN website `bosscass.com` links this page in its site header.** That is an
  owner link, which is the strongest form of the §2A.1 bar. The page is live — its most recent post
  reads *"Morning all, September fast approaches and so do my lil giggybangers"*.
- Bio *"Aggy one man punk thang"* transferred verbatim. genres `Punk / Other`. actType `originals`.
  artistType `solo` — the act is a one-man band.
- ⚠ **Location.** The Facebook page states NO location. The Rigger is a national-act venue, so
  §0.7's gig-town fallback is **forbidden** and `Stoke-on-Trent` was not written. `hotvox.co.uk`
  describes the act as **Devon's** hip hop / party punk one-man band. Location written `Devon` with
  `locationType: regional` (§6B Kilmarnock trap). The source of the location is named here because
  §2A.1 item 3b requires it.

**`70386982-7974-48af-bbf0-aebeb7aaca3e` Groove 45** — verified page, strongest evidence of the run.
- Page `facebook.com/groove45`, 441 followers, category Band. Visited in Chrome.
- Identity: **the page's own most recent post reads *"See you in September Granville's-Stone!"* and
  tags the venue.** That is the very gig being imported. §2A.1 names this as the strongest signal.
- The page's own Details read *"Leek, Staffordshire, United Kingdom, St13"*. Location written `Leek`,
  a town, taken from the act's own page and not from the gig town.
- Bio *"Pop/rock function band based in Staffordshire!"* transferred verbatim, exclamation mark
  included. genres `Pop / Rock`. actType `covers` — the page's own word is "function band".

**`c46aee41-959d-4f44-a8da-796ba7b9f917` Knutmo Five** — verified page.
- Page `facebook.com/profile.php?id=61592542604160`, 16 followers, category Musician/band. Visited in
  Chrome. The `profile.php` id form is preserved per §2A.2.
- Identity: the page's own Details read *"Stoke-on-Trent, United Kingdom"*, and its own event post
  names **the Artisan Tap, Hartshill** on 2026-08-19. That is a KLMA-covered venue and a Stoke
  footprint. `godisinthetvzine.co.uk` (2026-08-03) corroborates a three-piece from the
  Nottingham/Stoke area playing twee pop, shoegaze and slacker indie rock.
- ⚠ **A 16-follower page is not weak evidence here.** §2A.1 item 3b says Facebook ranks by follower
  count and a small local page loses to a same-name page anywhere on earth. This page won on its own
  stated town and its own gig post, not on reach.
- Bio *"Transatlantic indie music"* transferred verbatim. genres `Indie / Alternative`. actType
  `originals`.

**`27e8f1a6-0868-45b1-bf78-ee3ccec3a222` Kangaru** — **evidenced blank.**
- **Four search variants across both mandated surfaces returned no page:** Facebook page search
  `Kangaru` and `Kangaru band`; Google `Kangaru band` and
  `Kangaru "The Dream Machine" Sugarmill September 2026`. The Sugarmill's own gig page was also
  opened and names the act in the billing only.
- Rejected: `Kangurusband` on Facebook (a different spelling, no evidence tying it to this act);
  `reverbnation.com/kangaru`, an alternative artist from Belmont, California (§0.15); a Jóhann
  Jóhannsson film-score track; an Australian quintet **Kanguru**; a German jazz-rock band **Känguru**.
- **bio EMPTY. genres EMPTY. actType EMPTY.** No evidence exists to copy and §0.18 says unknown beats
  wrong. §2A.2's `["covers"]` default was NOT applied — the bill is an originals bill, which is
  exactly the case §0.18 says outranks the default.
- ⚠ **Location `UK wide`, `locationType: regional`.** The Sugarmill is a national-act venue, so §0.7
  forbids the gig-town fallback and the act's own page states nothing because no page was found.
- ⚠ `artistType: band` was written **only because the `create_artist` schema requires the field.**
  §2A.1 item 8 says copy it or leave it empty; the schema allows no empty. Standing item
  `artisttype-required-forces-an-inference`.

### 4c. Venues created — 0

**`search_venue("Granvilles", "Stone")` returned nothing.** `list_venues(city: "Stone")` returned
**`pkmhj8ElmrfJWNoWLn6X` Granville's Restaurant & Music Bar**, ST15 8AB, which **already carries a
`klma-stoke-gig-list` externalId**. The apostrophe in `Granville's` defeated the search. That is the
**seventh** instance of `search-venue-apostrophe`. Not re-raised.

**The §3 three-probe rule is what saved this.** The match ladder alone would have said "create", and
a duplicate venue splits a venue's gigs in two.

## 5. TWO OWN-RUN ERRORS, BOTH CAUGHT ON READ-BACK AND BOTH CORRECTED

**(a) An HTML-escaped ampersand reached a public field.** `create_event` for Groove 45 was called
with the title `Groove 45 @ Granville's Restaurant &amp; Music Bar`. §6B forbids this in plain words
and it was written anyway. Read-back showed the literal `&amp;`. Corrected in the same minute by
`edit_event`, and the correction verified: the stored title now reads
`Groove 45 @ Granville's Restaurant & Music Bar`. **Own error, not a tool defect.** Same class as the
standing `html-entity-in-event-title`, so it is not raised as a new item.

**(b) A duplicated word in a public ticketing field.** The Knutmo Five event was written with
`ticketInformation: "Special guest on the The Dream Machine bill..."`. Corrected by `edit_event` and
verified. Own error.

Both fields are public (§0.12). Both are correct now.

## 6. Removed rows

**None.** Section 1 and section 2 both diffed 0 removed. The single genuine future removal from the
00:24Z firing — Walters & Bligh at Swiftys on 2026-08-21 — is unchanged and is already logged as
`klma-walters-bligh-swiftys-vanished-today`. Not re-raised.

## 7. §VA venue-authoritative checks — honest status

| Venue | Status this run | Note |
|---|---|---|
| **The Rigger** | **NOT RE-FETCHED** | the 00:24Z firing fetched it 3 hours ago; its findings are used, and the source did not change |
| **The Sugarmill** | **CHECKED** | sole-source feed, 30 rows, 0/0 diff, plus the Dream Machine gig page opened directly |
| **Cosey Club** | **NOT FETCHED** | no row worked this run belongs to it |
| **Eleven** | **NOT FETCHED** | no row worked this run belongs to it |
| **Artisan Tap** | **NOT FETCHED** | still no proven surface (§VA.1) |

**This is stated rather than claimed as "checked".** §VA.7 requires it. No name written this run
depended on a venue page that was not read.

⚠ **The Rigger's page bills only the headline act on both dates.** The 00:24Z firing established
this. The four support acts imported here are **KLMA-only** and the venue page cannot corroborate
them. Bandsintown independently lists DeadWax on the 18 September bill, which corroborates one of
the four. The other three rest on the KLMA row alone. That is stated because §VA.7 asks for it.

## 8. A COVERAGE CHECK, NOT A DIFF — WHAT THE SHEET PUBLISHES THAT bndy MAY LACK

The standing item `klma-zero-diff-hid-nine-missing-gigs` says a zero diff hides real gaps. This run
therefore sampled coverage directly, and the sample is reported with numbers rather than a claim.

**Window: 2026-08-21 to 2026-09-07, 17 days. 139 sheet rows, 106 distinct acts.** Rows were grouped
by artist and the largest groups were checked first, per the spec's 2026-08-08 CTO ordering ruling.

| Act | Sheet rows in window | bndy events in window | Gap |
|---|---|---|---|
| Danny Brab | 10 | 12 | **0** |
| ÜL†RᛟɣᛨɸLE† (Ultraviolet) | 6 | 8 | **0** |
| Circa 81 | 5 | 5 | **0** |
| John Sewell Music | 2 (10 across 12 months) | 10 | **0** |
| The Rigger, whole venue | 6 | 29 | **0** |
| The Sugarmill, whole venue | 30 | 30+ | **0** |

**Every group sampled is fully covered.** The four largest artist groups in the window account for
**23 of the 139 rows** and every one of them is in bndy. **This is the first measured evidence that
the source's near-term coverage is sound**, and it is a different answer from the one the
2026-08-19 run found. It does not prove the tail is covered — 87 of the 106 acts in the window carry
a single gig each and were not individually checked.

⚠ **`john-sewell-not-reached` is RESOLVED.** The item was raised on 2026-08-08 and called the single
biggest win available. `315d26f9-0a59-42a2-8f7c-f98efca1e36d` John Sewell Music now holds **10
future events**, every one carrying a correct §6D `klma-stoke-gig-list` slug.

⚠ **`sugarmill-dream-machine-supports-unsplit` is RESOLVED** by the two Sugarmill writes above.

## 9. THE SUGARMILL'S OTHER MULTI-ACT BILLS ARE NOT MISSING — THEY USE `artistIds`

While checking the Dream Machine bill, four other Sugarmill multi-act events were opened. **All of
them already hold every act on the bill**, not as a lumped name but as separate artist records in
`artistIds`:

| Event | Bill | `artistIds` |
|---|---|---|
| `58e281c3-a870-4b57-b6ed-6cc3a08a0b53` | M60 + Florentenes + The Publics | 3 |
| `6c3fb43d-4cd0-4e1e-9c21-e7435e02c7eb` | Fell Out Boy + Stiff Bizkit + Dookie | 3 |
| `6bd4d6d8-b50c-45c8-9b6e-c06ac8ef58d4` | Goldie Lookin Chain + John MOuse | 2 |
| `8a49376d-7adc-4bd4-bf8c-2ae3d39c8f4f` | Skids / Theatre of Hate | 2 |

An attempt to give John MOuse his own discrete event on 2026-10-24 **bounced `DUPLICATE_EVENT`**
against `6bd4d6d8`, because the artist+venue+date sentinel counts collaborators (§1). §0.9 says a
bounce is a match signal and is never worked around, so nothing was written and nothing was changed.

⚠ **This is a real tension in the rules, and it is raised, not resolved here.** §4's interim rule
says "do steps 1 to 3 only" — one discrete event per artist — and it was written when
multi-artist `create_event` was an open MCP request (the spec's own "Related" section still lists it
as pending). **`artistIds` has since shipped.** The two models cannot coexist on one venue and date:
once a multi-artist event exists, the sentinel makes the discrete-event model unreachable. A run
should not decide this. Raised as `rule4-vs-shipped-artistids-sentinel`.

## 10. Times, prices and defaults applied

| Event | Sheet or page value | Written | Rule |
|---|---|---|---|
| Blitzkrieg UK, The Thirteenth Turn @ The Rigger | `7:00 pm` | 19:00 | direct |
| DeadWax, Boss Cass @ The Rigger | `7:00 pm` | 19:00 | direct |
| **Groove 45 @ Granville's** | **blank** | **21:00, DEFAULTED** | §5.6 Saturday. Applied by the server, `startTimeDefaulted: true`. |
| Knutmo Five, Kangaru @ The Sugarmill | `Starts: 7:00 pm` | 19:00 | §0.28 stage time |

**Ticketing (§CT).** The `Cost/Ticket` cell is **blank on both Rigger rows**, so nothing was written.
A blank cell is unknown, not free (§CT rule 2). The two Sugarmill events took the bill's £12.50 across
both children, and the sibling relationship is stated in `ticketInformation` (§CT rule 6). The
Gigantic ticket URL was checked against §VA.9's rule: its path contains
`stoke-on-trent-the-sugarmill`, so the per-gig link was stored rather than the venue default.

⚠ Every event created this run read back `endTime: 00:00` without one being sent. Standing item
`create-event-writes-endtime-midnight`. Not re-raised.

## 11. Validator (§6A step 8)

Evidence written **before** each bndy write to
`data/state/enrichment-evidence-2026-08-21-klma-stoke-gig-list.jsonl`, appended never rewritten. The
file held 6 lines from the 00:24Z firing and now holds 16. Five pre-write lines and five matching
`artistId`-keyed lines were appended by this run.

```
5 records · 5 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit code 0.

⚠ **One check could not be made.** `get_by_id(entityType: "artist")` **does not return
`locationType`.** §6B requires a regional location string to be verified as `regional` on read-back,
because without it the value geocodes to Kilmarnock. Two records this run carry a regional string —
`Boss Cass` (`Devon`) and `Kangaru` (`UK wide`). Both were sent with `locationType: "regional"` and
both `create_artist` calls returned success, but **the read-back cannot confirm it.** Raised as
`get-by-id-omits-locationtype`.

## 12. Quality measures (§6, v2.5)

| Measure | Count |
|---|---|
| Artists created with a **verified page** | **4** |
| Artists created with an **evidenced blank** | **1** (Kangaru, 4 variants across both surfaces, all recorded) |
| Artists created as a **bare stub** | **0** |
| Names **sanitised or corrected** | **1** (`Deadwax` → `DeadWax`, from the act's own page) |
| Rows **skipped** | 0 gig rows. The diff offered none. |
| Rows **staged** | 0. §0A rule 1 abolished staging. |
| Gate bounces | 1 (`DUPLICATE_EVENT`, §9, honoured) |
| Own errors found and corrected | 2 (§5) |

## 13. Items raised to `CTO-INBOX.md`

| Fingerprint | Kind |
|---|---|
| `rule4-vs-shipped-artistids-sentinel` | RULE |
| `get-by-id-omits-locationtype` | DEFECT |
| `ultraviolet-titles-mixed-billing-and-name` | DATA |
| `klma-backlog-cleared-john-sewell-and-sugarmill` | DATA (closes two standing items) |

**Not re-raised, because a fingerprint already exists:** `search-venue-apostrophe` (7th instance),
`create-event-writes-endtime-midnight`, `html-entity-in-event-title`,
`klma-no-delta-mode-declared`, `klma-walters-bligh-swiftys-vanished-today`,
`klma-duplicate-artist-nu-call-billing-name`, `run-report-path-collides-on-second-firing`,
`artisttype-required-forces-an-inference`, `blocked-rows-not-re-presented-by-diff`,
`artisan-tap-eleven-parklot-blockers-resolved`, `record-run-token-missing`.

## 14. `record_run`

Not called. It fails on a missing `SOURCE_RUNS_TOKEN` and the task prompt states this is not
blocking. `run-summary.jsonl` was appended instead, and it is the dashboard's real input.

## 15. Nothing outstanding

The named backlog is empty. The snapshot is written and passes its own 0/0 gate. The claim is
released. The heartbeat records `completed`.
