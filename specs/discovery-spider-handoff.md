# bndy Discovery — Handoff to Next Session Agent

**Written 2026-07-02 by the CTO/discovery agent, for a fresh Cowork agent.** You are NOT the scheduled task — Jason wants a human-in-the-loop session that pushes discovery into a **new geographic area** and proves Google AI Mode is holding grass-roots gig data that bndy doesn't have yet. Then grab it.

---

## 1. YOUR MISSION (Jason's words, distilled)

> "I want to see more new venue coverage into a new area. More new artists and gigs I didn't know about. Prove that Google AI Mode has more than me right now, and grab it."

Concretely, this run:
- **Go to a NEW, under-covered area** (see §6) — the Cheshire-East-to-Stoke corridor. The Stockport/Macclesfield/Trafford core is already densely covered in bndy, so re-walking it just produces dedup hits (we proved this tonight). New venues live on the sparse edge.
- **Discover NEW venues** there (most won't be in bndy yet), **create** them (place_id geocode), **add their gigs**, **create + fully enrich the artists**.
- Everything public on the map (`isPublic:true`), zero duplicates, FB page + avatar set on every new artist AT creation.

---

## 2. WHERE WE ARE (done today — don't redo)

- **Full SK sweep COMPLETE**: 26 SK postcode venues + The Spinning Top crawled by hand. **67 gigs, 61 new artists, 0 duplicates.**
- Ticketed independent venues are IN scope (Strines Nightingale 13, Holy Diver 6, Spinning Top 13, Crystal Ballroom 2, Trackside 1) — ticket URLs stored per event.
- FB-avatar enrichment run across ~35 of the 61 (rest left blank on precision or search-threshold misses).
- **Spider proven, crosses region boundary**: XL5 → 3 Trafford gigs (Old Plough/Sale, Quarry Bank Inn/Timperley, Gardeners Arms/Timperley — all already existed in bndy, gigs new). The Select Committee → 0 new (everything already in bndy).
- **Key finding**: region-wide `place_id` + event dedup is bulletproof even out of SK. The core is covered. **The new stuff is on the edge.**

Live dashboard artifact id: **`sk-discovery-crawler`** (shows the SK sweep). State file: **`discovery-crawl-state.json`** (this folder) has the full rules + noSpider list + gotchas.

---

## 3. THE PROVEN METHOD (per venue OR per town)

1. **Pin the browser FIRST.** `mcp__claude-in-chrome__list_connected_browsers` → `select_browser` the one named **"bndy"** (Jason's Facebook-logged-in Chrome). If two browsers show generic names, `AskUserQuestion` / `switch_browser` and have Jason click Connect. NEVER write public events from the wrong/logged-out profile.
2. **Read Google AI Mode** (this is the source that "has more than bndy"):
   - `navigate` to `https://www.google.com/search?udm=50&q=<query>`
   - `computer{action:"wait", duration:4}` (it streams in)
   - `read_page(tabId, filter:"all", max_chars:30000)`. **Gotcha:** read_page ERRORS (doesn't truncate) if max_chars < the tree size — if you see "exceeds N characters", retry with max_chars just above N (they run 23k–38k). If the answer shows only "Searching", `wait 5` and re-read. `get_page_text` returns EMPTY on this SPA — don't use it.
3. **Extract** only gigs with a **concrete future date (after today) + a named act.** Undated "regulars", "books dates into 2026", open-mic/singaround = NOT events.
4. **FILTER** (see §4).
5. **DEDUP + RESOLVE** (see §5).
6. **CREATE** venue (if new) → artist (if new, enrich FB immediately) → event.
7. **SPIDER**: any new *local/regional* artist or venue → queue it and trawl it too. Touring acts are leaf nodes (no spider).

---

## 4. FILTER — accept / reject

**ACCEPT** (grass-roots live music): band / duo / solo-acoustic / covers / tribute / originals at a pub, bar, social/working-men's club, small independent venue. Free entry OR a members/on-the-door price (~£5), OR **ticketed at a SMALL INDEPENDENT venue** (store the `ticketUrl`).

**REJECT**: DJ sets, karaoke, disco, quiz, bingo, comedy nights, open-mic/singaround/jam (no named headliner), "live bands" with no named act. National/international **touring acts at large/commercial venues** (arena/academy/O2/theatre). Anything clearly outside the target region.

Borderline (new venue + ticketed + multi-act, or uncertain date) → **stage** to `discovery-review.jsonl`, don't auto-publish.

---

## 5. DEDUP + RESOLVE (the discipline that keeps bndy clean)

- **Venue**: `search_venue(name, city)` first. If not found, `create_venue(name, address, city)` — it geocodes and dedups by Google place_id (returns `isNew:false` if it already exists). **Robust:** it matches by name+city even if your street guess is wrong, so give `name` + `<town>` and it finds the right place. NEVER invent a town.
- **Artist**: `search_artist(name, minConfidence:80)`. **Also search the bare core + spelling variants** (e.g. "Soul4Soul"→"Soul 4 Soul", "Pheonix"→"Phoenix", "Blond-Age"→"Blond-age"). Reuse ≥80% incl. same/near name in the same region. The server ALSO blocks duplicate events (same artist+venue+date OR externalId) → `DUPLICATE_EVENT` = you already have it, skip.
- **Enums**: `artistType` = band | solo | duo | trio | group | dj | collective. `locationType` = city | regional. `actType` = covers | originals | tribute (array; +`acoustic:true` for acoustic duos).

---

## 6. THE TARGET AREA (go here — it's under-covered)

**Cheshire East south → North Staffordshire / Stoke corridor.** Work these towns (venue-anchored — most venues here are NOT in bndy yet, so you'll create genuinely new ones):

Congleton · Crewe · Sandbach · Alsager · Kidsgrove · Nantwich · Middlewich · Holmes Chapel · Biddulph · Leek · Newcastle-under-Lyme · Stoke-on-Trent (Hanley, Burslem, Longton, Fenton, Tunstall).

Region gate: accept venues in the corridor above; reject anything outside it (don't drift to Liverpool/Yorkshire/Birmingham).

**How to discover venues in a new town** (bndy can't seed them like it did for SK):
- AI Mode: `grass roots live music pubs gigs <town> 2026`, and `<town> pubs with live bands free entry 2026`. The answer lists venues + often dated gigs. Extract venues → crawl each with `<venue> <town> live music gigs 2026`.
- Cross-reference the **gigs-news** and **KLMA** sources bndy already ingests (KLMA = Stoke/Staffordshire) — but you're looking for what those miss.

**Also spider** (secondary) the *spiderable regional* acts we created (Grand Volume, Trilogy Rock Band, branded, Nothing Like Pressure, Pierrepoint, Gaol Bird, Chloe Chadwick Band, Mora and the Fabulous Wonderfuls, etc.) with `<artist> gigs 2026` — but expect many of their core-area venues to already exist; the value is any date they play a corridor/Stoke venue.

**noSpider (leaf nodes — list their gig, never trawl them):** D.R.I., The Dickies, S8nt Elektric, Punk Rock Factory, Spread Eagle, Dylan LeBlanc, Rachel Sermanni, Maz O'Connor, Madalitso Band, Newberry & Verch, Lavinia Blackwall, Aaron Catlow, Kit Hawes — and any national/international touring original act you meet. Spidering them would drag bndy into enriching the whole UK.

---

## 7. ENRICHMENT — NON-NEGOTIABLE, AT CREATION

Jason's #1 rule (learned the hard way today): **set the Facebook page + avatar the moment you create an artist — never defer it.** For every new artist:
1. WebSearch `"<name>" band facebook <town/genre hint>` → find the OFFICIAL **UK** page. NEVER a foreign or different same-name act. If no confident match, leave blank (precision over recall).
2. `edit_artist(id, facebookUrl:"<url>", profileImageUrl:"https://graph.facebook.com/<handle>/picture?type=large", genres:[...], actType:[...])`. Handle = the part after `facebook.com/` (or the numeric id for `profile.php?id=` / `/p/Name-NNN` pages).
Do this in the same breath as the create. Genres/actType are secondary to the FB page.

---

## 8. EVENT CREATE — required fields

`create_event(venueId, artistId, [artistIds:[a,b] for co-bills], date:"YYYY-MM-DD", startTime:"HH:MM", isPublic:true, [ticketed:true, ticketUrl:"..."] , title:"<Artist> @ <Venue>", externalIds:[{source:"cowork-discovery", id:"<slug>"}])`. **Always `isPublic:true`** or it won't hit the map. `create_venue` REQUIRES `city` (not just address) — this bit us tonight.

---

## 9. FILES & STATE

- `C:\Users\jason\Documents\Claude\Projects\bndy\discovery-crawl-state.json` — full rules, spiderRules (noSpider list, ticketInfo), stats, gotchas. Read it first.
- `C:\Users\jason\Documents\Claude\Projects\bndy\discovery-review.jsonl` — staged/borderline items (John Angus Band, Chadkirk Unplugged, festivals).
- Dashboard artifact `sk-discovery-crawler` — build a NEW artifact (e.g. `corridor-discovery`) for this run so Jason can watch new-area progress live (venues checked / new venues created / new artists / new gigs / rejected).
- Brain spec: `C:\VSProjects\florence\bndy brain\04-architecture\discovery-crawler-spec.md` and `manual-ingestion-runbook.md`.
- MCP: `mcp__bndy-events__*` (unauthenticated /mcp routes). Chrome: `mcp__claude-in-chrome__*` (load via ToolSearch if deferred). WebSearch for FB lookups.

---

## 10. DEFINITION OF DONE for this run

Jason wants to SEE, on the dashboard: **new venues created in a new area** (Congleton/Crewe/Stoke corridor), **new artists** with FB+avatar, **new gigs** he didn't know about — pulled from Google AI Mode, deduped clean. Aim for a batch of ~8–12 corridor venues with real new venues/gigs among them. Flag anything that looks like it's exploding (unbounded frontier), and keep zero duplicates. When it's working and Jason's convinced, THEN it's ready to hand to the 07:00 scheduled task with a region gate + frontier cap.

---

## 11. SESSION LOG — 2026-07-02 (what the last agent did + YOUR FIRST MOVES)

**Done (do NOT redo):**
- **SK sweep complete** — 67 gigs, 61 artists, 0 dups (§2).
- **Ticketed independent venues reinstated** (Strines 13, Holy Diver 6, Spinning Top 13, Crystal Ballroom 2, Trackside 1) with ticket URLs.
- **FB enrichment** run on the 61 (~35 set). Left to fix: a few came back "not in bndy" from a too-strict name search — re-enrich by exact id. **Dups to merge:** `Beatles For Sale` (ccedf866, Staffs) vs `The Beatles For Sale` (ad2a64fc); `Trilogy Rock Band` ×2 (KEEP `XJ2gV4N1qIe6vK2R562Q` NW / drop `a6b1adbc` N.Staffs); `the Select Committee` (6e00cc46) vs `The Select Committee` (KEEP `PNJ6TclgY1pH26h2orEa`, has FB). Also `Horsebath` is a Canadian roots band (bndy tag says Manchester — fine, it played Strines).
- **Spider proven into Trafford**: XL5 → gigs at The Old Plough (Sale), Quarry Bank Inn (Timperley), Gardeners Arms (Timperley, NYE £5). All 3 venues already existed → region-wide place_id dedup is solid.
- **Corridor started — CONGLETON**: created **3 NEW venues** — Radley & Co. Bar (`1865bfc8-a2f4-4d63-a445-ee750b6c8434`), Throstles Nest (`dbef9eca-c03f-408d-86f3-e283d5a1a7e4`), Farmers Arms (`9d5c213f-5f37-4637-adb0-95e01bdb0df4`). Already existed: The Cygnet Club (`KMWRsNUTH2daxM8zwLsR`), Prince of Wales (`Xiaxlq2K0keBgk6TU4E5`, from KLMA).

**Sharpened method (fold into the scheduled job):**
- The **dense core** (Stockport/Macclesfield/Trafford) is already covered → crawling it adds mostly dedup hits. **Spend budget on the sparse edge (Cheshire East → Stoke).**
- **Area query per town** discovers + creates venues brilliantly (3/5 new in Congleton).
- **Walk-in pubs** (e.g. Radley & Co) don't publish named lineups to AI Mode — gigs are weekly on Facebook → do an FB pass or skip. **Festivals are the gig goldmine.**

**YOUR FIRST MOVES:**
1. **Mine the Congleton Jazz & Blues Festival 2026** (congletonjazzandblues.co.uk; AI Mode "Congleton Jazz and Blues Festival 2026 lineup venues") — ~80 FREE grass-roots gigs across town pubs over August Bank Holiday. Biggest single new-gig source in the corridor. Also Congleton Unplugged (40+, spring).
2. **Crawl the Congleton publishers**: Cygnet Club (bands every Saturday), Prince of Wales (Joule's taphouse, local cover bands) — AI Mode "<venue> Congleton live music gigs 2026".
3. **Next towns** — area-query each → create venues → crawl the publishers: Sandbach, Alsager, Kidsgrove, Crewe, Nantwich, Biddulph, Leek, Newcastle-under-Lyme, Stoke-on-Trent (Hanley/Burslem/Longton).
4. **FB page + avatar on EVERY new artist AT creation** (§7). Build a fresh dashboard artifact `corridor-discovery` so Jason can watch new-area growth live.

Region gate + noSpider + frontier cap as in §4/§6. Zero duplicates. Flag anything that looks like it's exploding.
