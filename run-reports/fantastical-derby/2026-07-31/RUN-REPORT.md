# FANTASTICAL DERBY — SUPERVISED FULL-CORPUS RUN, 2026-07-31

**Run type:** supervised requalification run. Replaces the held seed report written earlier the same day.
**Capture:** 493 events, `capture_method: paste` (runbook §6B — MCP Chrome tabs are always `document.hidden`, so the FB events list stalls at 8 rows).
**Raw:** `data\raw\fantastical-derby\2026-07-31\capture.txt`
**Snapshot:** `data\state\fantastical-derby-last-page.txt` — **WRITTEN AND VALID.** The 2026-07-29 seven-row snapshot was renamed `INVALID-...-unscrolled.txt` and must never be used.
**externalId form:** `{source:"fantasticallibrary", id:"<fb-numeric-event-id>"}` per §6D-bis (Jason ruling, this date).

---

## Totals

| Outcome | Count |
|---|---|
| Events **created** | 197 |
| Existing events **back-filled** with the fbid | 147 |
| Existing events that already held a `fantasticallibrary` id | 15 |
| **Events now carrying provenance** | **359** |
| Skipped in-batch by rule | 7 |
| Staged, awaiting rulings | 21 |
| Rejected under existing rulings | 50 + 19 touring |

Artists created across the run: **~70**. Venues resolved: **~90**, of which only ~18 were new — the source's footprint was already well covered by the May and June runs.

## Rulings applied (Jason, 2026-07-31)

- **Touring acts** — grassroots-only, but The Hairy Dog and The Flowerpot are kept as grassroots rooms. 5 imported (barn54, Mötley Crüde, Definitely Oasis, Ian Prowse, Canned Pineapple), 19 rejected (Vaillant Live, Derby Arena, Darley Park, Derby Cathedral).
- **Ticketed venues** — The Hairy Dog and The Flowerpot now carry `standardTicketed: true`; Hairy Dog also has `standardTicketUrl`. Every event at those rooms is created with `ticketed: true`. Build spec: `CTO-DECISION-03`.
- **"by Candlelight"** — all rejected.
- **Promoter organisers** — all rejected.
- **Suspect times** — imported with §5.6 defaults, obviously-wrong values overridden. Chris Helme 07:30 → 21:00; TGB 17:32 → 17:30.
- **Multi-act bills** — PARKED at Jason's instruction, not imported.
- **Recurring venue nights with no named act** (Luminote, "Playing the songs of OASIS") — ignored. Standing rule: no artist name, no import.

## Needs a human

1. **Ant Hill Mob misattribution.** Event `f3d1607d-8374-47a0-82fe-8e3be131342c` (Castle Inn, 14 Aug) is attributed to the Warwickshire "Anthill Mob" but belongs to The Ant Hill Mob (Burton, `8bc112d4`). It carries a prior "NEEDS MANUAL DELETE" note. The correct-artist event `3845735e` holds the fbid. ⚠ `create_artist` auto-matches "Ant Hill Mob" to the wrong Warwickshire record by normalised name — this trap recurs on every future run of any Derbyshire source. This is the §1A.3 canonical three-band incident, still live.
2. **Duplicate venue** — Royal Oak Tibshelf exists twice: `d9fe0d38` "Royal Oak" and `37bb18fb` "The Royal Oak". Runs use `37bb18fb`. Needs a merge.
3. **Masquerade / Masquerade Trio** — server normalised "Masquerade Trio" onto existing "Masquerade" `4e40a170`, but the FB pages differ (`masquerade.band.5` vs `MasqueradeTrio`). Possible merge error; socials deliberately not attached.
4. **Two acts with blank socials by design** — Swindle - P i S T o L S - Tribute `63a86df0` and Vicky Jackson PINK `0517abd4`. Both had a wrong URL written and cleared; they need a real page URL.
5. **~30 acts created with blank socials** because the organiser was a venue page and no act-owned handle existed. Nothing was guessed. These are the natural queue for an enrichment pass.
6. **Duplicate listing, one id kept** — Far Away Cows @ The Smithfield 8 Aug appears twice in the source (band's listing + venue's). Only fbid `1546582103213443` is stored; `1295297582577147` cannot be added because the server holds one id per source. Correct behaviour, recorded for traceability.
7. **Holly Bush Inn** `8ab69eab` — real pub (Makeney, Belper), created on a stray geocode, zero events attached. Left in place rather than deleting a legitimate venue.

## What still blocks scheduling

Nothing technical. The three MCP defects found today (`create_artist` review unresolvable, `verifiedSourceName` unexposed, `edit_event` externalIds append-only) were all fixed and verified live the same day. The snapshot is valid, the externalId form is settled, and the source's rulebook is current.

**Outstanding before the task is re-enabled:** Jason's ruling on the 20 parked multi-act bills, and a decision on whether the ~30 blank-socials acts get an enrichment pass first. Scheduling itself remains Jason-only (§0.1).
