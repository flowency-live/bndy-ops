# BNDY MASTER IMPORT RUNBOOK — v1.14 (2026-08-01)

**This is the single authoritative runbook for EVERY scheduled task, import session, discovery run, and AI-assisted write into bndy. It supersedes all prior task files. Older runbooks remain for source-specific parsing quirks only; their rules get ported into here one at a time and this file wins on any conflict. Rules change ONLY by Jason's instruction — no session may relax, reinterpret, or "improve" them mid-run.**

Backend gates enforce most of this (GATE_MODE; see GATE-IMPLEMENTATION-MANIFEST.md). The runbook exists so behaviour is right even where a gate hasn't caught up — and a gate bounce is never something to work around.

---

## 0. PRIME DIRECTIVES — NEVER DO THIS

1. **NEVER create, recreate, or re-enable any scheduled import task.** Jason only. All imports are currently STOPPED.
2. **NEVER exercise judgment on identity.** Whether an artist/venue/event is new or existing is decided by the backend resolver and the deterministic rules in this file — never by mid-import reasoning. If the answer isn't mechanical, STOP and stage for Jason.
3. **NEVER create an artist record whose name is a lineup.** One record = one act. "Die Ego, Vulgaris, and Bound By Burdens" is three artists and never a record name. (§4)
4. **NEVER create an artist for a placeholder:** Cancelled / TBC / TBA / To Be Confirmed / Various / Unknown / "Open Mic". Cancellation is an event-status change, not an artist.
5. **NEVER invent an artist name.** "Elvis tribute show featuring Mark Clay" → the artist is **Mark Clay**. "Meat Loaf Vs Elton John" does NOT become artists "Meat Loaf Tribute" / "Elton John Tribute" — if the real act names aren't stated, stage for review. No guessed names, ever.
6. **NEVER use listing copy as a name. An artist name is the ACT'S NAME, nothing else.** Source listings bake descriptions, genres and promo blurb into the billing — strip ALL of it:
   - Descriptions: "Not Guilty - 5pc Local Rock/pop Covers Band" → "Not Guilty"
   - Promo blurb: "Cyril Blake 60s & 70s Band - It'll Be Fun! All Aboard!!" → the existing **Cyril Blake** record — the tail is the venue's advert, and "60s & 70s Band" is a description, not identity
   - Anything after " - "/"–" that reads like a sentence, contains exclamations, times, prices, or hype → not part of the name
   Known offender: **Cosey Club listings routinely embed promo text in the act line** — always sanitize before resolving, and remember §1A.2: the containment check (new key starts with an existing artist's key) catches these even when stripping is missed. Ambiguous stripping → stage for review, never create.
7. **NEVER create an artist without a resolvable location** (real town/county). "UK", blank, or unmappable = stage for review. Location is part of the artist's identity. **EXCEPTION — national-act venues (Jason ruling 2026-07-30):** at venues that routinely book paid national/touring acts, the gig town is NOT evidence of where the act is from, and the §2 gig-town fallback MUST NOT be used. When such an act's own page states no location, set location **"UK wide"** (locationType `regional`) rather than inferring or staging. Per-source venue lists live in the source task files (KLMA: The Rigger, Eleven, Artisan Tap).
8. **NEVER create a venue without a Google Place ID**, and never guess a venue's town/address to get one. No town on the source? Look up the artist's existing events and venues first; still unsure → stage. A wrong geocode creates a mis-named junk venue.
9. **NEVER retry a bounced create with a varied name/spelling.** A 409/422 from the backend is a MATCH SIGNAL or a review instruction. Use the existing id or stage. Working around the gate is the cardinal sin.
10. **NEVER trust a write without reading it back.** Every create/edit is verified with a get by id. A tool returning "success" proves nothing (edit_event lied for months).
11. **NEVER delete or merge records during an import run** — sole exception: §0.17 source-dropped event deletions, which are part of the run. Imports otherwise add; cleanup is a separate, Jason-authorized activity with its own protocol (THE MERGE RULE lives in VSCODE-AGENT-CLEANUP-EXECUTION-PROMPT.md).
12. **NEVER write review notes, uncertainty, QA flags, or import commentary into any bndy field.** All bndy data is public. Flags go in run reports / external JSON only.
13. **NEVER store expiring URLs** (scontent.*.fbcdn.net etc.). Facebook images use stable graph URLs only.
14. **NEVER import past-dated gigs** or undated "regulars". An event needs a concrete future date and a named act.
15. **NEVER enrich a UK act with a foreign same-name act's socials.** bndy is UK-only. No confident FB match = leave blank; a wrong link is worse than none.
16. **NEVER touch an OWNER-MANAGED record.** Any artist/venue with `owner_user_id` set is the owner's truth — imports and MCP sessions do not edit, enrich, or "correct" it, ever. Trust precedence: owner > reviewed > source-runner > automated. (Backend gate pending; the rule applies now regardless.)
17. **Source-dropped events (REVISED v1.9, Jason ruling — supersedes the v1.4 hide rule): a future-dated gig that vanishes from its source IS DELETED — via the API delete route (releases sentinels) — when ALL of these hold:** (a) the event's externalIds are from THIS source only; (b) not owner-managed (§0.16); (c) absence confirmed against the full capture, not a diff/format artifact (§5.7). Any other source still listing it, or an owner id → do NOT delete; log instead. If a deleted gig reappears in the source later, the normal pipeline simply re-creates it — deletion is safe, hiding just keeps mess. Time/detail changes on a source = EDIT the existing event (found via externalId), never create a sibling. Every deletion is logged verbatim in the run report.
18. **NEVER use free-text genres or actType.** bndy's enums only (actType: covers/originals/tribute + acoustic flag; genres from the platform list). Unknown = leave empty, never invent.
20. **PUNCTUATION IS NOT IDENTITY — NORMALISE IT, AND THE ACT'S OWN PAGE IS THE NAMING AUTHORITY (v1.13, Jason ruling 2026-07-31).** A create that bounces `data_quality_validation_failed` on a name containing `,` `!!` `?` or ` - ` is NOT a validator defect and NOT a §2A.5 exception. It means the source's BILLING has been mistaken for the act's NAME. Do this instead: (a) strip promo/strapline per §0.6 — `Aquilla - The Dna of Rock` is the band **Aquilla**; (b) normalise punctuation — `Ooshka, Baby!!` is **Ooshka Baby**; (c) **ENRICH FIRST and let the act's own page settle it** — if their Facebook/website states the name, that spelling wins over the source's billing every time. Both examples above created first time once normalised. ⚠ §2A.5's "verified source name" exception means the ACT'S OWN PAGE verified it — never "the source listing said so verbatim". **Corollary (§2A):** when a source lists no Facebook, still try the obvious slugs — the full billing string as a slug (`facebook.com/aquillathednaofrock`) found a page Lemonrock never declared. A bounce is a prompt to think, not a defect to log.
23. **SKIP VENUES THAT ARE NOT A FIXED BUILDING (v1.14, Jason ruling 2026-08-01).** Festival sites, marquees, street markets, beaches, rally grounds, show fields, one-off event sites. bndy's venue UID is a Google Place ID (§1) and no correct one exists for a tent or a street, so the record can only ever be wrong. Do NOT create the venue, do NOT import its gigs — list them in the run report. Observed: Budleigh Literary Festival Main Marquee (three enrich attempts returned three different wrong businesses, one of them a festival in Oxfordshire), Topsham Charter Day (a street market along Fore Street), Sticker Vintage Rally, Okehampton Show, Watchet Esplanade Street Fair. ⚠ **There is no tool to null a `google_place_id`** — so a wrong one, once written, is stuck. That is why this is a skip rule and not a fix-later rule. Revisit if bndy ever models non-fixed venues.

24. **TRUST THE POSTCODE, NEVER THE TOWN NAME (v1.14, 2026-08-01).** A source's area tag is not evidence of county. Confirmed hits: five "St Ives" venues were St Ives **Cambridgeshire** (PE27), not Cornwall — 19 gigs and 11 artists correctly rejected; a "Merton" venue was Merton **London** (SW19), not Devon; "Beer" geocoded to Somerset; "Seaton" to Cornwall; "Tenbury Wells" matched a "Wells" filter. **Before creating any venue, confirm the postcode prefix matches the expected county.** Anything outside it is a reject regardless of what the listing says. Watch especially: Gillingham (Dorset SP8 / Kent ME7), Newport, Weston, Charlton, Newquay, Bude, and any town name containing "Street" or "Wells" — substring matching on town lists is how three of these got through.
22. **NEVER COLLECT GIGS WITH `get_page_text` — IT STRIPS ANCHOR HREFS (v1.13, 2026-07-31).** Source ids live in `href` attributes (`gig.php?id=<n>`), and text extraction silently discards them. A Plymouth run collected 88 events this way and wrote synthetic externalIds (`<venueslug>-<date>`), which would have broken the §5.7 source-diff and made those events undeletable/unmatchable on any future run. **Collect with `fetch()` + `DOMParser` inside `javascript_tool`, and read `a[href]` directly.** `get_page_text` is for eyeballing a page, never for extraction. Corollary: if a run cannot produce a real source id for a record, that is a STOP-and-report, not a thing to synthesise.
21. **NO FUTURE GIGS = NO ENTITY (v1.13, Jason ruling 2026-07-31).** An artist or venue is created ONLY when the source lists at least one importable FUTURE gig for it. No gigs listed → create nothing, stage nothing, move on. This applies to both parties: a venue whose entire forward listing is empty, cancelled, or wholly rejected (DJ/karaoke/quiz) is NOT created; an act with no future date is NOT created. Empty records are map pins that look like bugs and enrichment work that earns nothing. **This is a CREATION-time rule and is NOT retroactive** — do not sweep existing empty records out of bndy on the strength of it; they are harmless and may gain gigs later.
19. **IGNORE LISTS ARE A FIRST-CLASS RULE (v1.12, Jason ruling 2026-07-31, Arena Torquay incident).** Every source carries an ignore list for **venues AND artists**. A venue that is not grassroots — big rooms booking national/international touring bills — is NOT imported at all: its feed is not fetched, its acts are not created, its events are not written. The check runs BEFORE collection, never as a cleanup afterwards. Arena Torquay (`lemonrock/arenatorquay`) is the founding entry: it reached bndy with 13 events and 11 artists (The Lemonheads, Belphegor, The Slackers…) before anyone could say it was out of scope, and removing it cost more than skipping it would have. Ignore lists live in the review-queue `LearnedRule` store once built (PRD-COWORK-REVIEW-QUEUE.md); until then in the per-source task file under a heading `## IGNORE LIST`. **Every run consults the ignore list before its first fetch.** Adding an entry is a Jason ruling; removing one likewise.

---



---

## 1. IDENTITY — the three UIDs (backend-enforced)

| Entity | UID | Meaning |
|---|---|---|
| Venue | `google_place_id` | Two venues can never share a place_id. |
| Artist | `normalise(name)` + region bucket | Same name in a different (non-empty) region = genuinely different act (Not Guilty Stoke ≠ Not Guilty Yorkshire). Same name, same region = SAME act, always. |
| Event | (venue, artist, date) | One gig per artist per venue per day. Enforced per artist including collaborators. |

Act qualifiers (X / X Duo / X Band / X Trio) in the same region are the SAME artist (ADR-023) — the qualifier belongs in the event title, never a new record. Facebook URL is the strongest identity signal: exact FB match = same artist regardless of spelling.

## 1A. SAME-NAME ARTISTS — the distinguishability protocol (v1.1, Jason ruling)

**Duplicate artist NAMES are allowed. Indistinguishable duplicate ARTISTS are never allowed.** Two records may share a name ONLY when each carries a location that resolves to a *different* canonical bndy region. If you cannot make the new record distinguishable from the existing one, you do not create it — full stop.

### 1A.1 Canonical regions — the ONLY valid region values

An artist location is either **(a) a UK city/town** (preferred — geocodable, and it implies exactly one canonical region) or **(b) one of bndy's canonical regions, verbatim**:

> England · Scotland · Wales · Northern Ireland · North East · North West · Yorkshire and the Humber · East Midlands · West Midlands · East of England · London · South East · South West

**NEVER write a free-text region.** "Yorkshire & Lancashire", "Midlands, UK", "The Potteries", "NE England" are all INVALID — they don't exist in bndy, so the platform cannot use them to distinguish records or filter the map. A source region that doesn't map cleanly to exactly ONE canonical region (e.g. "Yorkshire & Lancashire" spans two) → use the gig venue's town as the location instead; if that's also unavailable → STAGE, don't create. This is a design constraint, not a style preference: an unmappable location = an indistinguishable record.

City is always preferred over region: infer it from the gig venue (or the majority town across the source's gigs for that act). Region-only is the fallback when the act genuinely roams a whole region.

### 1A.2 The MANDATORY same/near-name procedure: ENRICH FIRST, then footprint

**Step 0 — ENRICH BEFORE YOU DECIDE (v1.3, Jason ruling).** The moment a same/near-name candidate exists, run the §2A Facebook identification for the INCOMING act BEFORE any create decision — the FB URL is an identity key, not decoration:

- Compare the found page (canonical facebook_key form) against every same/near-name candidate's stored facebookUrl. **Exact facebook_key match = SAME artist. Reuse immediately** — this overrides location-text differences, spelling variants, everything. (Real incident: two records, same name, same FB URL, same area — the second should have been impossible.)
- Different, well-evidenced FB pages on both sides = strong DISTINCT signal — proceed to the footprint check to confirm.
- Always pass the found facebookUrl INTO find-or-create so the server's FB matching and fb-sentinel engage on the create itself.
- Enrichment effort spent on a match is not wasted: top-up the existing record (§2A.2) with anything it lacks.

**Then the footprint check.** The stored `location` field of the existing record is NOT the test — where the artist actually PLAYS is. Before creating any artist whose name matches or nearly matches an existing record (same normalised name, bare-core variant, or edit-distance ≤2):

1. Pull the existing artist's **event history** (search events by artistId) and map its venues to towns/regions — this is the act's real footprint.
2. **Same venue appears in both?** → SAME artist. Reuse. No exceptions.
3. **New gig's venue is inside or adjacent to the existing footprint** (same canonical region, or a bordering town — Stoke act gigging in Crewe is normal)? → SAME artist. Reuse — even when the stored location text differs from the gig town.
4. **Footprints clearly disjoint** in different canonical regions (e.g. all-Yorkshire history vs a Hampshire gig, no overlap)? → genuinely distinct act → create, ensuring BOTH records end up distinguishable (new record gets a city/canonical region per 1A.1; if the EXISTING record has no usable location, you cannot make the pair distinguishable → STAGE instead, flagging the existing record for a location backfill).
5. **Can't tell** (existing artist has no events, sparse history, or the footprints touch)? → STAGE for Jason. Never create on ambiguity.

Always pass `venueRegion` into find-or-create so the server's footprint scoring engages too — but the check above is YOUR duty regardless of what the tooling does.

### 1A.4 Repair on contact (v1.6, Jason ruling)

When you prove a same/near-name artist is genuinely DISTINCT (different canonical region with disjoint footprint, or different well-evidenced FB page) and create it, you also **top-up the EXISTING record in the same breath**: if it's missing a resolvable location, canonical region, facebook key, or its uniqueness sentinel — fix that now, from the evidence you just gathered. Never leave the old record less identifiable than the new one; the pair must END distinguishable on both sides. Log both ids + what was topped up in the run report.

### 1A.5 Billing aliases — learn once, never re-ask (v1.8, Jason ruling)

Sources bill the same artist under variant names: "Danny & Friends", "Danny Brab & Friends" and "Danny Brab" are ALL the artist **Danny Brab** — the billing belongs in the EVENT TITLE, the artist id is always the same record. When a billing↔artist mapping is KNOWN (confirmed by Jason or by prior resolution), it is an automatic match: no review, no create, ever again. Mappings live on the artist record as **nameVariants** (learned once, shared across ALL sources — the identity model's core principle); until artist nameVariants ship server-side, they live in the per-source task files' alias tables. An UNKNOWN near-miss still goes to review exactly once — and the confirmed answer MUST be written back as a variant/alias so it never asks again. A review queue that asks the same question twice is a bug.

### 1A.3 Worked example — The Ant Hill Mob (real incident)

The DB held: "The Ant Hill Mob" (Burton upon Trent, 3 events), "The Ant Hill Mob" (Northwich, 10 events), "Anthill Mob" ("Midlands, UK", 2 events). All three normalise to the SAME name key (`anthillmob` — spacing collapses). What went wrong, per this protocol: "Midlands, UK" violates 1A.1 (not a canonical region — indistinguishable record, should never have been created); and whichever record came later was created off the stored-location difference without running 1A.2 — a footprint check would have shown whether the Burton and Northwich records share venues/adjacent towns (one touring act) or hold disjoint West Midlands vs North West histories (two acts). The correct import behaviour on meeting an "Ant(hill) Mob" gig: run 1A.2 against BOTH existing records; overlap with either → reuse it; ambiguous → stage. Never a third record.

---


### 1A.7 A `review` verdict is not automatically a same-name conflict (v1.13, Jason ruling 2026-07-31)
`create_artist` returns `action: "review"` on **shared-token fuzzy matches**, not only on true same-name collisions. `Double Helix` was held against *Double X* (Hampshire) and *Double A & The Bay* (Torbay); `Rhythm & Shoes` against *Rhythm House* and *Rhythm Eaters*; `Oas-is` against *Oasish*, *Oasism*, *So Oasis*. **None of those are the same act.** Four real Devon acts and their gigs sat missing because a run read "review" as "duplicate".

**Protocol:** on `review`, ENRICH FIRST (§2A.5) — open the act's own page, take its stated location and footprint. Then:
- Candidate has a **different name** → not a collision. Proceed with `confirmNew: true`. This is the sanctioned resolution path, NOT a §0.9 gate workaround.
- Candidate has the **same name, different canonical region** → distinct act, `confirmNew: true` (§1A.1).
- Candidate has the **same name, same region** → SAME act, `resolveTo: <id>`. Never create.
- Genuinely undecidable after enrichment → stage. That is the only case that reaches a human.

## 2. ARTIST PROTOCOL (per act, after lineup splitting per §4)

1. Sanitise the name: strip billing descriptions (§0.6), trim, no lineup separators remain.
2. Call `POST /api/artists/find-or-create` (MCP `create_artist` does this) with name + location (derive region from the gig venue's town if the source has none) + facebookUrl if known.
3. Obey the outcome, mechanically: `matched` → use that id. `review` → do NOT create; record the candidates in the run report and stage. `created` → proceed to enrichment. 409/422 → §0.9.
4. There is no fallback route. If find-or-create is unreachable: STOP the run and report. Zero creates.
5. Enrichment at creation, never deferred — full protocol in §2A. Missing FB never blocks the create, but the §2A attempt is mandatory and its evidence is logged.
6. Verify with get_by_id. Log created id + fields in the run report.

## 2A. ENRICHMENT PROTOCOL (v1.2, Jason ruling — hard rules)

**NEVER create an artist record without enriching it as far as the evidence allows. And NEVER enrich with the wrong thing — a wrong link is worse than a blank field.** Enrichment fields: facebookUrl, avatar (stable graph URL only), actType, genres, location, instagram/website when trivially confirmed. No Spotify.

### 2A.1 The identification bar — "it's them" must be EVIDENCED, not assumed
A Facebook page (or any social) may be attached ONLY when it is confidently the SAME act. Confidence means at least one hard signal: UK town/venues in the page matching the act's gig footprint; band-member or lineup mentions matching; posts about the very gigs being imported; the source itself linking to it. Name match ALONE is never sufficient.

1. **NEVER attach a non-UK act's page.** "It's all I could find" is precisely the failure mode — a same-name band from the US/AU/EU is a different band. No UK-consistent evidence → facebookUrl stays BLANK, flagged in the run report. (Backwater rule: three acts share that name; blank beats wrong.)
2. **NEVER attach an abandoned page without checking for a live alternative.** Check the page's recent activity. If the last activity is years old, you MUST search for alternatives (renamed page, newer page, "New page" pinned posts, the act's other socials pointing at a successor) before settling. Pick the page with the most recent activity that still meets the identification bar. A dead page is acceptable ONLY when you verified no newer candidate exists and the identification evidence is strong — and you note "inactive since ~<year>, no newer page found" in the run report (report only — §0.12, never in a bndy field).
3. **Search discipline before concluding "no FB" (TIGHTENED v1.9 — Jason correction, 2026-07-29 evening):** general web search is NOT sufficient — Facebook barely indexes there and six easily-findable pages were missed that way. FB identification MUST use **Facebook's own search via Chrome (logged in)**, with variants: ±Band/Duo/Trio/Music, region/area suffixes ("NE", "UK", town name — e.g. "the Beer Monkeys NE", "UrbanStaRz25"), & ↔ and, common misspellings. And when a page IS found, VISIT it — don't just link it: pull the act's own page name (it wins — §2A.5/§0.6), avatar (graph URL), bio, genres, and the page's own stated location (which overrides gig-town guesses: Urban StaRz said Teesside, not Newcastle). Band pages also carry gig corrections (times, prices, cancellations) — apply them to this run's events. A weak-evidence candidate still fails 2A.1 → blank + flag.
4. **Personal profiles** (firstname.lastname, no delegate page) are never linked as the act page → flag for the upload-image path instead.
5. **Enrich-inline is MANDATORY on every new-artist create, including unattended runs (v1.9, Jason ruling — So-Oasis/Edison incident).** No artist record is created as a name-only stub. Before create: FB search (Chrome) per 2A.1's evidence bar → confident match = attach page + avatar + actType/genres + correct the name to the act's own page name; no confident match = create with socials BLANK + flag in the run report (blank beats wrong — §2A.4 personal-profile-only cases stay blank). "Enrichment pass later" is not a valid mode — later never comes; the 2026-07-29 run shipped 6 stubs this way and two turned out to have findable pages and a wrong name ("The Edison" → Edison). If Chrome is unavailable mid-run, new-artist rows are STAGED, not created bare.
6. **Verified-source-name exception (v1.9, Jason ruling — Tanky incident):** when the act's OWN Facebook page name is the full billing string (e.g. "Tanky/Electrifying 80's show"), that billing IS the act's name — keep it verbatim; §0.6 promo-stripping does not apply. The bar is the act's own page carrying the name, evidenced per 2A.1 — a promoter's or venue's phrasing never qualifies. Record each such act in the source task file's alias table so no future run strips or reviews it.
7. **STRUCTURED-SOURCE EXCEPTION — §2A.5(b) (v1.11, Jason ruling 2026-07-31, Lemonrock onboarding).** Where a source publishes the act's **OWN declared identity fields** — genre, act format, originals/covers, home town — those fields ARE the inline enrichment and satisfy §2A.5's no-stub rule: a live Facebook search is NOT required at create time for such sources. Conditions, all binding:
   - **A source-supplied Facebook URL is a STARTING POINT, never a verdict.** The page MUST be VISITED before attaching: confirm §2A.1's evidence bar (UK, footprint agreement, live activity), take the act's own page name (it wins — §2A.5/§0.6), the avatar as a graph URL only (§2A.2), and the page's own stated location, which OVERRIDES the source's "based in". Fails the bar → blank + flag, exactly as if the source had supplied nothing. Canonicalise before storing (`/share/` redirects resolved; `/groups/` is a group not a page — usable but flagged; legacy `Name-ID` forms normalised).
   - **Where the source supplies no Facebook:** `facebookUrl` stays BLANK, the artist is flagged `fb-pending` in the run report, and the record enters the nightly FB-enrichment queue. Never a guessed page.
   - **Blank still beats wrong (§2A.1). This exception relaxes the TIMING of FB enrichment, never the evidence bar.**
   - **It does NOT relax §0.7:** an act with no stated town and no derivable location still STAGES.
   - Qualifying sources are named in their own task file. First qualifying source: **Lemonrock** (`Originals/Covers` → actType, `Genres` → bndy genre enum via written crosswalk, `Band formats` → artistType, `based in` → location).

### 2A.2 Mechanics
- Avatar: `graph.facebook.com/<numeric-id>/picture?type=large` only. NEVER scontent.* URLs (they expire). Reject known placeholder/spacer images.
- Canonicalise stored FB URLs (no /about, no query params; profile.php id preserved).
- actType (create_artist lacks the field → follow with edit_artist): default ["covers"] **ONLY when nothing contradicts it**. **§0.18 OUTRANKS this default (Jason ruling 2026-07-30, BV2 finding):** where the evidence points away from covers — an originals bill, a shoegaze/psych/DIY lineup, the act's own page describing releases — actType is LEFT EMPTY and flagged, never defaulted. A wrong actType is public-facing data; unknown beats wrong, exactly as with socials. Genres separate from actType, enum-only.
- Location per §1A (city preferred, canonical region only).
- Matched existing artists missing enrichment: top-up under the same rules — same bar, same evidence, log what was added.
- Every enrichment decision (which page, why, activity recency) goes in the RUN REPORT — never in bio or any public field.

## 3. VENUE PROTOCOL

1. `search_venue` first (name + city). Match → use it.
2. No match → `create_venue` with name, address, city (city REQUIRED, never invented) — it geocodes and dedups on place_id server-side. Pass a known place_id explicitly if you have one.
3. Result name mismatch vs what you asked for = wrong match — reject and stage; don't accept a wrong pub.
4. **Venue same-name discipline (v1.4):** pub names repeat across the country ("Golden Lion", "Railway", "Swan" exist in dozens of towns). A name-search hit is ONLY a match when the city/address agrees or the place_id confirms it. Wrong-town reuse mis-places every gig at that venue — when the town differs, treat it as a different venue and resolve via place_id.
5. Verify with get_by_id. Known venue gotchas stay in the per-source runbooks (e.g. Ashton Jubilee Club geocodes to the wrong Ashton → manual).

## 4. MULTI-ARTIST EVENTS — the model (Jason ruling, 2026-07-27)

**A multi-artist bill is NEVER one lumped record. Target model:**

1. **Split the bill** into individual acts (separators: `,` `+` `&` `and` `vs` `w/` `ft./featuring` — noting §0.5/0.6 rules; "TBA"/"+2 more" acts are dropped from record-creation entirely, they exist only in display text).
2. **One artist record per act** (§2, each with own location/enrichment).
3. **One DISCRETE EVENT per artist** at that venue/date — each act gets its own event record. (This is what the event UID expects; per-artist events at the same venue+date are all valid.)
4. **One PARENT EVENT holding the children**, displayed as the multi-artist event / mini-festival / series (same pattern as the Festival→child-events model). The parent carries the bill title ("Bushtonbury Day 2", "Die Ego, Vulgaris and Bound By Burdens @ Riff Factory"); children carry "«Artist» @ «Venue»".

**BUILD STATUS (honest): the parent-event container for ordinary multi-artist gigs is NOT built yet** — the Festival parent exists, generic gig parents and MCP support do not. **Interim rule until it ships: do steps 1–3 only** (individual artists + one discrete event per artist), put the full bill in each child's description-free title context ONLY if the source demands it — default is plain "«Artist» @ «Venue»" — and list the sibling event ids in the run report so parents can be attached retroactively. NEVER fall back to one event with a lumped artist name, and never leave a lineup-named artist behind.

**Festival-day listings** ("Bushtonbury Day 2 – Eaton Park, The Vanz, Rob Wheeler") are this same model with the Festival parent: use the existing Festival entity + per-artist child events.

⚠ Any pre-existing cleanup plan that says "update event with collaboratingArtistIds and keep one event" is SUPERSEDED by this section — re-plan those items as per-artist discrete events (+ parent when available).

## 5. EVENT PROTOCOL (per artist, after §4 splitting)

1. Resolve artist (§2) and venue (§3) FIRST. Never create an event against an unresolved party.
2. `create_event` with: artistId, venueId, `date` strictly `YYYY-MM-DD` (future only), startTime, **`isPublic: true` always**, title "«Artist» @ «Venue»", and **source-tagged externalIds** `{source: "<runner/source-id>", id: "<stable-slug>"}` — every automated write must be attributable.
3. 409 duplicate → the event exists; enrich the EXISTING event if you have new fields (ticketUrl, price, times); never create a variant.
4. Cancellations: set event status/hide — never delete, never create anything. Source-dropped gigs per §0.17.
5. **Import horizon (v1.4):** events up to 12 months ahead; festivals exempt. NEVER import a past-dated gig as an event — BUT a historic gig IS a valid discovery lead: spider the artist and venue from it to find their FUTURE gigs and missing records. Use the past; don't import it.
6. **Default start times (v1.7, Jason ruling) — when the source gives no explicit time:** Friday & Saturday → **21:00**; Sunday → **19:00** — unless the listing indicates an afternoon gig, then **14:00**. Other weekdays → 20:00 unless stated. Always note "defaulted time" in the run report so it's correctable.
6. Verify with get_by_id. Log in run report.
6b. **Source date conflicts — CORRECT AND FLAG (v1.10, Jason ruling 2026-07-30, BV2 finding).** When the act's or venue's OWN page contradicts the source listing's date, the act's/venue's page WINS and the event is created on the corrected date — consistent with §2A.3 (their pages carry gig corrections). This is the ONE identity-adjacent field a run may resolve unattended, because the evidence bar is the act's own words. Requirements: at least one act/venue-owned source (an FB event the act co-hosts, or a post on their page); the correction logged verbatim in the run report with both dates and the evidence; and — because date is part of the event UID — presented to Jason for confirmation in the report's open items. Two independent owned sources (e.g. the FB event AND a band post) = strong; a single third-party listing disagreeing with the sheet is NOT sufficient → stage.
7. **Two-sided snapshot diff (v1.9) — removed rows are part of every run.** The diff against the last snapshot must detect BOTH added rows (import pipeline) and **future-dated rows that have disappeared** (cancellation candidates). For each removed future-dated row: (a) confirm it is genuinely absent from the full new capture, not a formatting artifact — snapshot and capture must be the SAME format (see per-source file) precisely so this check stays mechanical; (b) look up the bndy event by this source's externalId; (c) owner-managed events are untouchable (§0.16); (d) action per §0.17 (v1.9): DELETE via the API route when the event is this source's alone — otherwise log only. Every removed-row finding and deletion goes in the run report verbatim. A row disappearing because its date passed is NOT a cancellation.

## 6. RUN DISCIPLINE (every scheduled/import run)

- Fixed caps: max 50 creates / run; hitting a cap = stop cleanly and report, not push on.
- **NAMED BASELINE LANES (v1.11, Jason ruling 2026-07-31).** A one-off, supervised, region-scoped baseline may run under a NAMED lane with a raised cap, authorised by Jason per source. **The 50-cap above is UNCHANGED and remains in force for every scheduled or unattended run**, including any future "Bndy V2 <Source> Events". Currently authorised:
  - **`lemonrock-baseline`** — 250 creates per batch · mandatory full run report AND Jason's explicit go/no-go **between every batch** · scope = ONE region at a time (pilot region: Devon/Torbay corridor) · lane CLOSES when that region passes the Phase 5 idempotency re-run. A batch that hits 250 stops cleanly and waits; it never rolls into the next.
- Run report is mandatory: created/matched/review/bounced counts, every new id, every staged item with reason, every gate bounce verbatim. Reports live outside bndy (Projects/bndy or the source's report file).
- Accept/reject filter (discovery): grassroots acts at pubs/clubs/small independents; reject DJ sets, karaoke, quiz, comedy, unnamed "live bands", arena/touring acts, anything outside region.
- Search discipline when a pre-check is needed: minConfidence 25, plus bare-core variant (strip Band/Duo/Trio), plus &↔and — and remember the 24–48h index lag: check the previous runs' own reports for records too new to be indexed.
- **STAGED ITEMS GO TO THE REVIEW QUEUE, not just a report (v1.12).** Once the review-queue MCP tools exist (PRD-COWORK-REVIEW-QUEUE.md), every staged decision is raised via `raise_review_item` and every run calls `get_learned_rules` BEFORE its first write. A decision that lives only in a chat transcript or a local .md cannot be delegated and gets asked twice — the runbook already calls a queue that re-asks a resolved question a bug (§1A.5).
- **STALE STAGED FILES — verify content, never the reported size (v1.12, 2026-07-31 incident).** `device_stage_files` does NOT overwrite a file already staged earlier in the session: it returns the DEVICE's current size and mtime while leaving the old snapshot in place at `/mnt/user-data/uploads/`. On 2026-07-31 two import agents silently read a 3-hour-old v1.10 runbook this way; one correctly refused to run, and the session initially mis-diagnosed it as a failed commit. **Before handing any rules file to a subagent: read its version header and confirm it, or copy the authoritative file to a fresh unique path and pass THAT path.** Never assume a re-stage refreshed anything.
- Anything ambiguous at any step: STAGE, don't act. Precision over throughput. A missed gig costs nothing; a polluted record costs a cleanup.

## 7. CHANGE CONTROL

This file is versioned. New rules are appended with date + incident reference by Jason's instruction only. Sessions cite the rule number when refusing to do something ("blocked by MASTER-IMPORT-RUNBOOK §0.3"). Source-specific parsing quirks (KLMA column alignment, sceniceye frameset, gigs-news Chrome rendering) stay in their per-source files, which must declare at the top: "Subordinate to MASTER-IMPORT-RUNBOOK.md".

### Changelog
- **v1.14 (2026-08-01)** — **§0.23 skip non-fixed-building venues** (Jason ruling: no correct place_id exists for a marquee or a street market, and no tool can null a wrong one). **§0.24 trust the postcode, never the town name** — five "St Ives" venues were Cambridgeshire, a "Merton" was London; substring town matching is the root cause.
- **v1.13d (2026-07-31)** — **§0.22 never collect with `get_page_text`.** It strips hrefs, so source ids are lost; 88 Plymouth events were written with synthetic externalIds and had to be repaired. Collect via `fetch()` + `DOMParser`, read `a[href]`. Never synthesise a source id.
- **v1.13c (2026-07-31)** — **§0.21 no future gigs = no entity.** Jason ruling: artists and venues are created only where the source lists an importable future gig. Creation-time only, not a retroactive sweep.
- **v1.13b (2026-07-31)** — **§1A.7**: `review` ≠ duplicate. The resolver flags shared-token near-misses; enrich, compare name + canonical region, then `confirmNew` or `resolveTo`. Recovered Double Helix, Bad Knees Blues Band, Rhythm & Shoes (Oas-is still staged — no location, no current gigs).
- **v1.13 (2026-07-31)** — **§0.20 punctuation is not identity.** Jason ruling after `Ooshka, Baby!!` and `Aquilla - The Dna of Rock` were reported as validator defects blocking 5 real gigs. Both created first time as **Ooshka Baby** and **Aquilla** once §0.6 stripping and punctuation normalisation were applied, and both had findable Facebook pages the source never declared. The failure was pattern-matching a bounce to "known defect" instead of enriching. Removes these from the defect list.
- **v1.12 (2026-07-31)** — Lemonrock Torbay baseline, three Jason rulings from live findings. **§0.19 ignore lists** — per-source venue AND artist ignore lists, checked BEFORE collection; Arena Torquay is the founding entry (not grassroots; 13 events + 11 artists had to be deleted). **§6 staged items → review queue** — staged decisions are raised through the review-queue MCP tools, not left in reports or chat; every run consults learned rules before its first write (spec: PRD-COWORK-REVIEW-QUEUE.md). **§6 stale staged files** — `device_stage_files` silently declines to overwrite an already-staged file, so subagents can read hours-old rules; verify the version header or copy to a fresh path. Also logged: "Ooshka, Baby!!" was bounced by the backend validator and reported as a NEW defect when it is in fact the ALREADY-KNOWN unimplemented §2A.5 verified-source-name exception (the act's own FB page is facebook.com/p/ooshka-baby-61574033337629) — the rule existed and the run failed to pattern-match to it. Validator fix remains an open NU call.
- **v1.11 (2026-07-31)** — Lemonrock POC onboarding (largest source bndy has taken: 2,664 venues / 2,640 artists / ~12.4k gigs, against bndy's 1,491 / 1,317 — roughly 2× the estate in one source). Two Jason rulings: **§2A.5(b) structured-source exception** — a source's own declared genre / act-format / originals-covers / home-town fields satisfy enrich-inline and defer the FB search to the nightly queue, BUT a source-supplied FB URL must still be VISITED and pass §2A.1 before attaching (it is a starting point, never a verdict), and §0.7 is not relaxed; **§6 named baseline lanes** — `lemonrock-baseline` authorised at 250 creates/batch with per-batch Jason sign-off, region-scoped, closing at the idempotency re-run, with the standing 50-cap explicitly untouched for scheduled runs. Plan of record: `LEMONROCK-BASELINE-PLAN.md`.
- **v1.10 (2026-07-30)** — First unattended local run (BV2) audited the runbook and found three genuine defects; all fixed by Jason ruling: H1 version marker was stale at v1.8 while content was v1.9 (bumped); §2A.2's `["covers"]` default conflicted with §0.18 (§0.18 now explicitly outranks — evidence beats default, empty beats wrong); §0.7 gig-town location fallback is invalid at national-act venues (new "UK wide" rule). Added §5.6b: source date conflicts are CORRECTED when the act's/venue's own page contradicts the listing, flagged verbatim + confirmed by Jason. Gate finding logged for VSCode: §2A.5 verified-source-name exception is unimplemented in the backend validator, making that class of act uncreatable (NU CALL).
- **v1.9 (2026-07-29)** — First full supervised KLMA run: §5.7 two-sided snapshot diff (removed future rows = cancellation candidates); §0.17 REVISED per Jason ruling — source-dropped events are DELETED (single-source + non-owner + confirmed absence; API route so sentinels release; re-add just re-imports), superseding the v1.4 hide rule, with §0.11 carve-out; §2A.5 verified-source-name exception (Tanky ruling: act's own FB page name = keep billing verbatim). Incident log: orphan event sentinels discovered (deleted event f40fccde still holding keys → VSCode agent sweep item).
- **v1.8 (2026-07-29)** — §1A.5 billing aliases (Danny Brab incident): known billing↔artist mappings = automatic match, never review; learned once as nameVariants (or task-file alias tables until server support), shared across all sources; unknown near-miss reviews exactly once then learns.
- **v1.7 (2026-07-29)** — §5.6 default start times (Jason ruling, from KLMA trial): Fri/Sat 21:00, Sun 19:00, afternoon 14:00, other weekdays 20:00, always flagged in run report.
- **v1.6 (2026-07-28)** — §1A.4 repair-on-contact: creating a proven-distinct same-name artist obliges topping up the existing record (location/region/FB/sentinel). Complements — never replaces — the bulk sentinel backfill.
- **v1.5 (2026-07-28)** — §0.6 broadened (Cosey Club/Cyril Blake incident): artist name = act name ONLY; promo blurb/descriptions/hype in billing lines always stripped; Cosey Club flagged as known offender; gate counterpart added to data-quality (listing-copy detector).
- **v1.4 (2026-07-28)** — Jason rulings: §0.16 owner-managed records untouchable; §0.17 source-dropped gigs = cancel/hide never delete, changes = edit never re-create; §0.18 enum-only genres/actType; §3.4 venue same-name discipline; §5.5 12-month horizon + historic-gig-as-discovery-lead rule. Backend counterparts specced in BACKEND-GATES-PHASE5-SPEC.md.
- **v1.3 (2026-07-27)** — §1A.2 Step 0 added (Jason ruling): enrichment runs BEFORE the duplicate decision on any same/near-name candidate; exact facebook_key match with an existing record = same artist, reuse immediately; facebookUrl always passed into find-or-create. Incident: same name + same FB URL + same area created twice.
- **v1.2 (2026-07-27)** — Added §2A enrichment protocol (Jason ruling): evidence-based identification bar, NEVER non-UK pages, NEVER abandoned pages without checking live alternatives, blank-beats-wrong, run-report evidence logging.
- **v1.1 (2026-07-27)** — Added §1A same-name distinguishability protocol (Jason ruling; Ant Hill Mob incident): canonical-region-only locations, mandatory footprint check before any same/near-name create. GATE FOLLOW-UP for serverless-api: align `regionBucket()` in `shared/identity` to the canonical 13-region enum (city→canonical-region mapping table; identity bucket = canonical region; free-text/unmappable location → review in enforce mode) so backend enforcement matches this rule.
- **v1.0 (2026-07-27)** — Initial. Prime directives, entity protocols, multi-artist discrete-events + parent model, run discipline.
