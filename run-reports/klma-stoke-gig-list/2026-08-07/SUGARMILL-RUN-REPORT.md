# THE SUGARMILL — supervised import, 2026-08-07

**Run id:** `cto-2026-08-07-sugarmill-import` · **Runbook:** v2.12 · **Spec:** `sources/klma-stoke-gig-list.md` §VA.9
**Namespace:** `sugarmill` (a namespace WITHOUT its own task — collected by the KLMA task, §6D)
**Venue:** The Sugarmill, Stoke-on-Trent `333e73ff-bdc5-48b7-9821-ce20412e3fee`

## Capture

- `data/raw/sugarmill/2026-08-07/gig-guide.txt` — 27 rows.
- Method: `fetch()` + `DOMParser` inside `javascript_tool` (§0.22 — `get_page_text` is FORBIDDEN here; it strips the `a[href]` gig-guide slugs that carry the externalId).
- Snapshot: `data/state/klma-stoke-gig-list-last-page.txt`, now explicitly two-section. SECTION 1 is the KLMA Facebook feed (captured 2026-08-06 by the scheduled task); SECTION 2 is this Sugarmill capture. §6A step 7 satisfied — this run wrote to bndy, so it wrote its snapshot.

## Totals

| Outcome | Count |
|---|---|
| Source rows captured | 27 |
| Rows imported as events | 19 |
| — of which newly created | 18 |
| — of which pre-existing, back-filled | 1 |
| Rows rejected by rule | 8 |
| Artists created | 22 |
| Artists reused | 3 |
| Validator | 0 FAIL · 21 WARN |

Every event: `isPublic: true`, `ticketed: true`, `price` from source, `externalIds: [{source:"sugarmill", id:"<gig-guide-slug>"}]`, `eventUrl` to the gig-guide page.

## Ticketing

The venue was marked `standardTicketed: true` with `standardTicketUrl: https://thesugarmill.gigantic.com/promoter/sugarmill` earlier in this session. Per CTO-DECISION-03 the event-level ticket link inherits from the venue, so per-gig `ticketUrl` was set only where a real per-gig Gigantic URL was in hand — one row (The Dream Machine). The other 18 inherit. This matches Jason's instruction: "We only need one link to buy tickets."

## Rejected — 8 rows, all under existing rulings

Seven club nights with no named act (standing rule: no artist name, no import): CASTLES IN PARIS, Motown Day Party, CHERRY KISS, 80s Day Disco, Ska Day Party, TRANCE DAY PARTY, 90s Day Party.

Plus **West End Day Party: Live!** (26 Sep, 15:00). Previously staged pending a ruling. It is NOT a ruling — Jason's standing instruction "Unless we have artist names we ignore!" already answers it. A day-party series branded "Live!" with no named act is a reject. Closed without spending reviewer attention.

## Judgement calls made in-run, with the rule that authorised them

- **THE YEAR GRUNGE BROKE** — slug and Gigantic link both say 2025-12-06; the gig-guide title parenthetical says Friday 4th September 2026. §VA.9 makes the title parenthetical authoritative and the Gigantic URL explicitly NOT. Weekday check corroborates: 2026-09-04 is a Friday, 2025-12-06 was a Saturday, so the page is a recycled 2025 listing. Imported as 2026-09-04, reasoning recorded in the event's `notes`. **No human needed.**
- **Multi-act bills** — imported as ONE event carrying `artistIds`, not split into one event per act. Splitting would force N events to share a single gig-guide slug and break externalId uniqueness under §6D-bis. Three rows affected (M60+Florentenes+The Publics; GLC+John MOuse; Fell Out Boy+Stiff Bizkit+Dookie), plus Skids/Theatre of Hate.
- **Promoters and non-musical guests stripped** — "This Feeling x The Sugarmill presents: FOARN" → act is FOARN. "A CERTAIN RATIO: SEXTEXT + FORCE ANNIVERSARY TOUR" → SEXTEXT + FORCE is the tour name, not a second act. "FROM THE JAM + NICKY WELLER *LIVE IN CONVERSATION*" → Nicky Weller is a speaker slot, not linked as an artist; recorded in `notes`.
- **§0.7 national-act venue** — The Sugarmill is a registered national-act venue, so the 9 acts whose own pages state no home town got `location: "UK wide"`, `locationType: "regional"` rather than a guess.

## Defects found this run

1. **`create_artist(nameVariants)` is silently dropped.** Passed on Skids, Elvana, Dookie, NME'd, The Year Grunge Broke; read-back showed `nameVariants: []` on all five. An `edit_artist` follow-up persisted them correctly. This matters more than the known `actType` gap — nameVariants IS the duplicate-prevention mechanism, so dropping it on create means the very billing strings that would prevent a future duplicate never get stored. **New build item.**
2. **`create_artist` has no `actType`** — already logged; re-confirmed. Combined with (1), every artist create in this batch needed a second write. 22 creates became 44 calls.
3. **`search_event` reports `externalIds: []` regardless of stored value** — re-confirmed for the third time. The venue listing showed `[]` for all 19 events while `get_by_id` showed the ids present and correct. Also caught a *second* consequence: it hid a pre-existing `klma-stoke-gig-list` id on the Limehouse Lizzy event, which only surfaced in the `edit_event` response.
4. **`get_by_id` still does not return `locationType`** — already logged; the §6B pairing cannot be verified on read-back.

## Needs a human

1. **18 acts carry a verified Facebook page but an empty bio** (validator WARN `STUB_NO_BIO`). The Chrome tab froze with a CDP timeout partway through the run, so no page body was ever read. Rather than paraphrase — §2A.1 item 8, bio is a verbatim quotation or EMPTY — every bio was left blank and the evidence file records `capturedText: ""` for each. **This is the enrichment trawler's queue, not a ruling.**
2. **`Limehouse Lizzy - LIVE` `f45c7a44`** carries a `- LIVE` descriptor tail from an earlier source. §2A.5 cleanup candidate; not touched by this run.
3. **Florentenes location conflict** — the act's own Facebook page states Manchester; ITV Granada calls them a Bolton band. Act's own page won (§2A.1). Bolton sits inside Greater Manchester so neither is wrong, but if bndy wants the finer grain it should be Bolton.
4. **Three undated gig-guide slugs remain unresolved** — `bootleg-blondie`, `fleetwood-shack`, `scene-emo-metalcore-dubstep-brutal-clubnight`. The third is a club night and rejects on name. The first two carry no date on the guide, and their event pages could not be read because Chrome froze. No event can be created without a date, so they are simply absent — not lost, they will reappear on the next capture.

## What this unblocks

The Sugarmill now has a spec section, a §6D slug↔path row, a snapshot and a populated namespace. The next scheduled KLMA run diffs SECTION 2 against a real baseline instead of treating all 27 rows as new. Nothing further is needed to schedule it.
