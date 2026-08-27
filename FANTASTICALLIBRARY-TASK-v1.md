# FANTASTICAL LIBRARY DAILY IMPORT — TASK DEFINITION v1.2 (2026-07-29 late — corpus rulebook + event-page host resolution, Jason)

**SUBORDINATE TO `MASTER-IMPORT-RUNBOOK.md` (v1.9+). Runbook wins on conflict.** Source class: **Facebook events page**. Source id: `fantasticallibrary`. Region: East Midlands (DE postcodes + Long Eaton/Heanor/Langley Mill/Ilkeston).
**STATUS: schedule PAUSED (trig_01Nv5rYmxFmg355pTpw4pRFu disabled). Requalification = full-corpus supervised run on 2026-07-30, then Jason re-enables.**

## Capture
- facebook.com/fantasticallibrary/events in Chrome (logged in). **SCROLL the Upcoming list to exhaustion** — the unscrolled page shows ~6 of 130+. Snapshot `Projects/bndy/fantasticallibrary-last-page.txt`, pipe rows `date | title | venue | time | organiser-name | organiser-url`; §5.7 two-sided diff.
- Relative dates ("Tomorrow", "This Friday") resolve against run date. Strip "BST". Date-RANGE entries (e.g. "Fri 21 Aug-23 Aug") = festival → IGNORE (below).
- "and N more" on an entry = multi-date event → open the event detail page, import EVERY date.

## CLASSIFICATION RULEBOOK (mechanical, in order)
1. **REJECT (log only, never import):**
   a. Bingo/quiz/karaoke/jukebox-night formats without a performing act ("Musical Bingo! With Paul Tabor").
   b. Unnamed community/charity/park/food events ("Music on the Green", "Summer Celebration @Allestree Park", food festivals, birthday bashes) unless a named act is in title.
   c. **Unnamed tribute nights** ("ELVIS TRIBUTE NIGHT!", "Chris Stapleton Tribute", "Amy Winehouse Tribute") — §0.5, no invented names. Skip + log. BORDERLINE (a possible real act name in the title: "Oasis- Whatever", "The ABBA BAND") → STAGE for Jason, never guess.
   d. **FESTIVALS — ignore entirely (Jason ruling)**: date-range events, "-fest"/"Festival"/"Weekender" containers AND their child events (Big Rock Weekender, Off The Tracks, Rock the Peaks, Fake Festivals, Elvis Festival, Jinniefest, Bridgefest, Hoedown...). Log, don't import.
   e. **Touring/production acts — GRASSROOTS ONLY (Jason ruling, strict)**: reject national touring acts and productions EVEN at grassroots venues (JLS/Billy Ocean @ Darley Park, Jane McDonald @ Vaillant Live, By-Candlelight cathedral productions, The Courettes/Chris Helme-class touring nights). Mechanical test: nationally ticketed tour / non-local act with agent-circuit footprint → reject; UNCERTAIN → stage, never import.
2. **PRIMARY IDENTIFICATION = the EVENT DETAIL PAGE (Jason, 2026-07-29 — Good Biscuits example).** Every non-rejected entry: OPEN the event URL (facebook.com/events/<id>) and read **"Meet your hosts"** — hosts are TYPED pages. Host typed *Musician/band* = THE ACT, definitively, with its FB URL (event 1698474587842490: hosts = The Castle Inn "Bar and grill" + The Good Biscuits "Musician/band" → act thegoodbisc, venue thecastleinndonington). Host typed venue/bar/pub = the VENUE's FB URL → attach to the venue record (venue enrichment as we go). This resolves act-vs-title ambiguity mechanically AND yields both enrichment links in one visit; the detail page also gives exact times, prices/tickets, multi-dates, and cancellation notices.
3. **Fallbacks when the event page lists no Musician/band host**: (a) listing-level organiser is a Musician/band page → organiser IS the act regardless of title (venue-name titles: "Nicco's Restaurant and Bar" by Courtney May Music → act Courtney May Music @ Nicco's); (b) organiser is venue/promoter → act parsed from TITLE ("Live music with Georgia Hair"), §2A enrich-verify. Promoter/production/community organisers (Alpha Pro Creative, riffriot promotions, Mosaic Music, Mad Hatters Events1, Derby LIVE, village halls posting others' acts) are NEVER the act. Title kept as event title always (§0.6).
4. **Personal-profile organisers** (profile.php?id / name.number handles: andy.bussey.3, john.pateman.9): never linked as the act page (§2A.4); the personal name may still be the act (Andy Bussey) → create with blank socials + flag.
5. **Multi-act titles** ("SOULWEAVER + SHACKLED", "BANG featuring SKUM, Black Mould, and Justice for Lilith", "The Mechanist X Reaper X Tealdeer", "FLASH featuring Las Fokin Biches, with Aurastruck") → §4 split, one discrete event per act; separators include "+", "X", "featuring", "with", ",".
6. **Venue resolution**: venue field first; when missing/garbled, venue often lives in the TITLE ("Live @ The Shakespeare, Shardlow", "Bulls Head Hotel - Youlgreave"). §3 place_id always. The "· Town" suffix on the venue line is the town hint (beware: FB town can be wrong side of borders — Barge Inn Long Eaton shows "Nottingham").
7. **Duplicate listings of one gig** (band's event + venue's event: Good Biscuits ×2 @ Castle Inn, GSG ×2 @ Catchems): resolve aliases FIRST so the event gate catches them. Alias table below.
8. **Suspect times** (07:30 Saturday gig, 17:32) → stage the time, don't import wrong data; event detail page usually has the real time.
9. **Cross-region same-name acts**: mandatory §1A footprint check — corpus contains ANT HILL MOB @ The Castle Inn Donington (the §1A.3 canonical three-band incident) and Lee Michaels (also NW via gigs-news). Never assume.

## Alias & mapping table (learned)
- "G.S.G Trio" / "GSG Vocal Trio" / "G.S.G Vocal Trio" → one act (FB GSGVocalTrio); billing in title.
- "The Modest - 2 Grown Men Playing Mod, Soul & Ska Classics and more" (page name) → act **The Modest** (§0.6 strips the page's own promo tail — record the full string as nameVariant when server support lands).
- "MLC from Swadlincote-Re-issued" (page name) → act **MLC**.
- "The Sugar Tree" page (thesugartree.kaycorominas) organises "KAY SOLO" billings → act = Kay (The Sugar Tree)? STAGED — Jason to rule on first contact.
- FB URLs harvested for tomorrow's run: The Good Biscuits → facebook.com/thegoodbisc · The Castle Inn (Castle Donington) → facebook.com/thecastleinndonington.
- Venues already known: The Last Post 0249016e · Bell and Harp Freehouse 2e55d19d · Miners Arms Alfreton bdcccfe3 · The Vine Mickleover c8fd948a. Artists: Mod Story bb52172c · Carl North c9091b40 · Luke Wall eef8db01 · Donovylan 599796a2.

## Caps + report
Max 50 creates/scheduled run (requalification corpus run is Jason-authorised uncapped). Enrich-inline §2A.3 tightened (FB search in Chrome + page VISIT — organiser links satisfy identification instantly). Run report + snapshot every run. Never touch schedules (§0.1). Fail-closed: bridge/docs/tools/Chrome/FB-login/unscrolled-capture.
