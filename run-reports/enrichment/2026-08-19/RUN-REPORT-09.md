# Bv2a Enrichment — run report, firing 09, 2026-08-19

**Outcome: completed.** Circuit breaker did not fire (last 3 reports — 06, 07, 08 — each closed at 0 FAIL, all wrote a report). RUNBOOK read at v2.27, floor v2.19 — met.

## Preconditions

- Runbook + ENRICHMENT-TASK-v3.md read in full. CTO-INBOX.md tail read for standing fingerprints.
- Concurrency claim `data\state\claims\bv2a-enrichment.json` was released (`heldBy: null`) — acquired cleanly, TTL 3h, heartbeat `bv2a-enrichment-2026-08-19T09-18-06Z.json`.
- **Chrome: unreachable.** `list_connected_browsers` returned `[]`; `tabs_context_mcp` returned "not connected". This is the **36th consecutive firing** with Chrome down (unbroken run since firing 22 on 08-17 22:17Z). Per the task's hard-stop table: **all** artist enrichment (work-order items 1, 4, 5) is blocked this firing, including the genre-only item 5 — the hard-stop table draws no carve-out for genre-only edits, so none was taken even though genre is technically inferable from a Google snippet. Venue work (items 2, 3) needs no Chrome (§FP.2) and proceeded.

## Work order followed

1. Artists created in last 24h, missing socials — BLOCKED (Chrome).
2. Venues created in last 24h, missing socials — queried, **0 results**.
3. Backlog venues missing socials, oldest createdAt first — worked (see below).
4. Backlog artists missing socials — BLOCKED (Chrome).
5. Artists missing genres holding a facebookUrl — BLOCKED (Chrome; not attempted despite genre being technically inferable without a browser, because the task's hard-stop table has no such carve-out and this run does not reinterpret it).

## Venue backlog selection — the saturation problem, measured precisely this firing

`list_venues(missingSocials: true)` returned **59** venues, unchanged in shape from the standing `bv2a-venue-backlog-saturated-no-cooldown-check` finding logged this morning: the selection tool does not consult the ledger, so the same small backlog is offered every firing regardless of how recently each record was searched. Cross-referencing all 59 ids against `enrichment-ledger.jsonl` before doing any searching (a step earlier firings today evidently skipped) showed:

- **18 of the first 50 had never been attempted.** Of those, **13 were non-UK addresses** (France, Sweden, Greece, Norway, Denmark, Finland, Germany, Ireland — all under the standing `bndy-capture:6022ef13…` foreign-tour batch) and correctly not worked; bndy is a UK platform. One (`2f2e5e77`, "Venue TBC") is itself a placeholder name, not a real venue. One (`9be0502f`, "United match)") is a garbled capture. One (`c97a9fd2`, Arena Torquay) is the standing §0.19 ignore-list match. That left genuinely workable UK candidates: **Campbell Park** and **Gostrey Meadow**.
- The remaining 9 (offset 50–59) had **not** been checked against the ledger before I queried them — I made that mistake mid-firing and only caught it after already running searches on all 9. Six of the nine (`479b4860` Alderney, `d4c89efe` Royal Oak Hollywater, `e49909e5` Diversion Bars, `b7fb4005` Haddenham Airfield Pavilion, `8fd6c973` Lord Haig, `96d265b8` Golden Fleece) had in fact been searched by **this same firing's predecessors 1–4 times already today**, most recently at 08:27Z (firing 08) — 34 minutes before I searched them again. Two (`6ce8538f` Haugesund, `ceaa1104` Plan B) were genuinely fresh but foreign, correctly not worked. One (`9fbfd78e` Newsham Park) was last attempted 2026-08-18.

**What I did about it, having found it mid-firing:** rather than discard three searches that had already been run, I checked whether they'd turned up anything the prior firing missed. Three had: Haddenham Airfield Pavilion, Lord Haig and Golden Fleece all verified this firing on evidence the 06:35Z/08:27Z searches did not surface (see below) — the same "blank-then-verified-disagreement" pattern already logged three times today (Dolphin Hotel Plymouth, Crab & Winkle, Newton Abbot 76). The other three (Alderney, Diversion Bars, Newsham Park) reconfirmed blank with nothing new — **not re-logged to the ledger**, since a duplicate blank entry adds no information and is exactly the waste the standing fingerprint is about.

**Recommendation, restated with today's numbers:** `list_venues(missingSocials)` should accept or internally apply a ledger cooldown. 59 candidates, 9 firings today, most records touched 2–4 times, only 8 genuinely worth a human's or an agent's next look. A cooldown filter would have saved this firing from re-running 6 of its 8 searches.

## Records enriched WITH a verified page (4)

- **Gostrey Meadow**, Farnham (`51741c53-74ce-4f2b-88aa-105fdffab7c3`) — website `farnham.gov.uk` (Farnham Town Council's own green-spaces page, names the meadow and its bandstand/music events) + Facebook `profile.php?id=143327552376457` ("Gostrey Meadows — Farnham, UK — Park"). Tier B: name+town match on both surfaces, corroborating. Never previously attempted.
- **Haddenham Airfield Pavilion** (`b7fb4005-d749-4208-ac2f-a22b408aebb3`) — website `activeinthecommunity.org.uk/facility-hire/haddenham-airfield-pavilion/` (AITC's own page, exact name + exact address match) + Facebook `112462208814165` ("Haddenham Airfield", same site, corroborated by AITC's own posts referencing events at the Pavilion). **Supersedes today's 06:35Z and 08:27Z blank findings** — those searches missed the AITC facility-hire subpage, which is the strongest single piece of evidence here.
- **Lord Haig**, Hertford (`8fd6c973-f19b-44c9-b57d-c2e6b34d10a8`) — website `lordhaig.co.uk` (exact name+address match, "live music, bands" advertised) + Facebook `facebook.com/thelordhaig` (vanity handle matching the pub's own name). Two other stale FB pages and a second domain also surfaced (an apparent ownership-change duplicate-presence pattern); took the vanity handle + `.co.uk` domain as the live pair rather than leaving blank on the ambiguity, since address match was unambiguous. **Supersedes today's 06:35Z and 08:27Z blank findings**, which stopped at the multi-candidate ambiguity.
- **Golden Fleece**, Chelmsford (`96d265b8-d86d-4372-b150-94472332deee`) — website `socialpubandkitchen.co.uk/golden-fleece-chelmsford` + Facebook `357189734374300` ("The Golden Fleece Chelmsford — Home"). Exact address confirmed independently (84 Duke St, CM1 1JP) against a same-named but different pub in Braughing (excluded). **Supersedes today's 06:35Z and 08:27Z blank findings.**

## Records recorded as an EVIDENCED BLANK (1 fresh + 3 reconfirmed, not re-logged)

- **Campbell Park**, Milton Keynes (`4b4a6503-c9c3-42ea-8832-8134bb746925`) — never previously attempted. No dedicated FB/website for the park itself; only the managing Parks Trust (a different-named entity covering all MK parks) and third-party festival pages (Pop In The Park, MK Mela) were found. Variant tried: `"Campbell Park" Milton Keynes events facebook website`.
- Alderney Community Association, The Diversion Bars ltd, Newsham Park & Garden — searched, found nothing beyond what today's existing blank ledger entries already record (three competing same-area entities for Alderney; no confirmed FB/own-website for Diversion Bars beyond an unconfirmed generic-named page; Newsham Park results are all a different "haunted asylum" business at the same park, not the park itself). Not re-logged to the ledger — see saturation note above.

## Records SKIPPED, and why

- All artist work (871 missing socials, 615 missing genres) — Chrome unreachable, hard-stop table has no carve-out.
- 13 non-UK venues under the standing foreign-tour batch — out of remit, not worked.
- `2f2e5e77` "Venue TBC" — placeholder name, not a real venue identity to search for.
- `9be0502f` "United match)" — garbled capture, needs a human to establish the real venue name before any search is meaningful.
- `c97a9fd2` Arena Torquay — standing §0.19 ignore-list match.
- `d4c89efe` Royal Oak Hollywater — already flagged two-candidate-pages, needs a Chrome visit to resolve; not re-searched.

## Names corrected under §0.6

None this firing.

## Validator summary line (verbatim)

```
4 records · 0 clean · 0 FAIL · 8 WARN   [mode=gate]
```

First pass FAILed all 3 of the "superseding" records on `FB_EVIDENCE_MISMATCH` — `capturedFrom` had pointed at the corroborating website rather than the Facebook URL itself, same standing fingerprint as firing 07 and the 2026-08-15 original. Corrected by appending a fresh evidence line per record with `capturedFrom` set to the Facebook URL itself; re-validated: 0 FAIL. All 8 WARNs are `STUB_NO_BIO`/`STUB_NO_IMAGE` — expected noise under §FP.2, venues carry no bio/image requirement. Records/evidence adapted via the standing pattern (fingerprints `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only`): `data/normalized/enrichment/records-2026-08-19-firing09.json` and `data/state/evidence_firing09_aliased.jsonl`, built by `data/state/build_validator_input_firing09.py`.

## Budget used

4 venues verified + 1 fresh blank + 3 reconfirmed-not-relogged = 8 venue records searched, 0 artists (blocked). Well under the 30-venue/15-artist cap. Time: approx. 20 minutes of the 40-minute ceiling. Circuit breaker did not fire.

## Ledger / snapshot / summary

Ledger: 5 `enrich` lines appended (4 verified, 1 blank) + 1 `snapshot` line. Snapshot: artistsTotal 2243, artistsMissingSocials 871, artistsMissingGenres 615, venuesTotal 3005, venuesMissingSocials 55 (was 59 before this firing). `run-summary.jsonl`: 1 line appended, outcome `completed`, recordsEnriched 4, skipped 1.

Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (2402 enrichment records, 83 snapshots), `data/normalized/DASHBOARD.html`.
