# SPIDER RUN REPORT — 2026-08-15

**Run id:** `spider-2026-08-15T06-49-21Z`
**Started:** 2026-08-15T06:49:21Z · **Finished:** 2026-08-15T07:15:00Z
**Runbook read:** v2.27. **Floor asserted:** §6A CURRENT FLOOR v2.19. **PASS.**
**Prompt floor:** the task prompt states no number; it defers to §6A. No drift to report.
**Outcome:** completed.

---

## 1. Headline

| measure | value |
|---|---|
| Records WRITTEN to bndy and read back (§0.10) | **2** |
| Events created | 0 |
| Artists created | 0 |
| Venues created | 0 |
| Events edited (evidenced) | 2 |
| Evidenced deletions | 0 |
| Seeds worked (hops) | 7 |
| **New venues found per 100 hops (saturation)** | **0.0** |
| Rows rejected by the admission test | 5 |
| Partial captures | 7 (every Facebook surface — see §5) |
| Validator | 0 FAIL (0 records — no artist or enrichment write) |
| Target (§Caps, 25 records) | **NOT MET. 2 of 25.** See §7. |

**This run did not meet its target and does not claim saturation as the reason.** The
district is not worked out. The capture surface failed. §7 states the cause and the fix.

## 2. Gate steps

| step | result |
|---|---|
| §6A.0 heartbeat | written first — `data\state\heartbeat\spider-2026-08-15T06-49-21Z.json` |
| §6A.1 date | 2026-08-15 (shell) |
| §6A.2 runbook + spec read in full | done |
| §6A.2a floor | v2.27 >= v2.19. PASS |
| §6A.2b claim | **TAKEOVER.** See below |
| §6A.3 tools | bndy MCP reachable. Chrome connected, Facebook session live |
| §5.4 tombstone check | `cancellations.jsonl` read. 1 live tombstone (PULS @ Arden Arms 2026-08-08). No collision with this run |
| today's daily note | read before any write. klma, sceniceye, gigs-news and onthecasemusic had already run |

**Claim takeover (§6G).** `data\state\claims\spider.json` was held by
`spider-2026-08-11T23-07-01Z`, `expiresAt` 2026-08-12T00:07:30Z — three days in the past.
Its heartbeat `spider-2026-08-11T23-07-01Z.json` still reads `"outcome":"started"` with no
`finishedAt`. **The holder is dead and the claim is also expired.** Acquired on both grounds.
**Reported as a fault against the previous run: the spider died on 2026-08-11 and has not
run since. Three nights produced nothing and nothing reported it.**

## 3. Seeds picked, and why

The spec ranks seed rule 4 (a venue we hold, with a website or socials, and ZERO future
gigs) above rules 1 to 3. That queue was worked first, in ST5.

| # | seed | rule | why |
|---|---|---|---|
| 1 | The Victoria (Little Vic), `aNJvhjLrO6PhN5l7xLgL` | 2 | Named in the spec as the rule-4 founding case |
| 2 | Castle Mona, `64fd6092-c900-49a9-8f67-2fb50d3d1ea5` | 4 | FB page, 0 future gigs |
| 3 | Mitchell's, `5f1ac030-3e91-4930-bddd-b0189dc072ce` | 4 | FB page, 0 future gigs |
| 4 | Wolstanton Golf Club, `59abeabc-81af-45b6-859a-fef89cc83b7c` | 4 | FB page, 0 future gigs |
| 5 | The Albert, `4d12e4f8-84de-42c2-b79c-4972e2841f71` | 2 | FB page, 2 future gigs, never spidered |
| 6 | The Removal Men, `238970c6-394e-40a2-acf5-d467fe731c9e` | 3 | FB page, 0 future gigs. Carried from the 2026-08-08 cursor |
| 7 | The Hustle Band, `0M0cqE9jfLGbgoyWj5bT` | 3 | FB page, 0 future gigs. Carried from the 2026-08-08 cursor |

**Rule-4 queue in ST5 is not exhausted.** Two seeds remain unworked: Yates
`ad855fbb-f9e6-4ba6-8157-d912a59cb01e` and Cappello Lounge
`49b346cb-d42f-4a10-8fd6-22533c18f2df`. Both are chain rooms and both rank last.

**Correction to the spec.** `sources\spider.md` rule 4 states that bndy holds zero gigs for
The Victoria. **That is now false.** bndy holds 6 future gigs there, all written by
`klma-stoke-gig-list`. The illustration is stale, the rule it illustrates is not.

## 4. Records written

Both writes are event-title corrections under **§0.27** — the venue's own page names the
series, and §0.27 puts a festival or series name in the event title. Both verified by
`get_by_id` after the write.

| id | before | after |
|---|---|---|
| `9b3c9cf6-c3c9-4dd4-be33-767c3c8f7910` | `Tyler Kent Trio @ The Victoria` | `Tyler Kent Trio @ The Victoria — Newcastle Jazz & Blues` |
| `4514cc56-48a8-4e54-9aa8-0af58188ed31` | `Good Habits @ The Victoria` | `Good Habits @ The Victoria — Newcastle Jazz & Blues` |

**Evidence, verbatim, from the venue's own Facebook page, post dated 31 July:**

> 🎷 𝗦𝗮𝘁𝘂𝗿𝗱𝗮𝘆 𝟮𝟵𝘁𝗵 & 𝗦𝘂𝗻𝗱𝗮𝘆 𝟯𝟬𝘁𝗵
> Newcastle Jazz & Blues returns and we've booked both Tyler Kent and Good Habits!

Captured from `https://www.facebook.com/thevictoriakingstreet/` at 2026-08-15T06:52Z.

⚠ **SELF-REPORTED FAULT — §6B, `&` must never be HTML-escaped.** The first write of
`9b3c9cf6` passed the title with `&amp;`. The backend stored the literal string. **§0.10
read-back caught it and the record was corrected in the next call.** The rule is written
down, I broke it, and only the read-back gate saved the field. Final stored value is the
raw `&`, verified.

## 5. Captures — EVERY ONE WAS PARTIAL

**Not one Facebook capture in this run was complete. Every seed is named here.**

| seed | surface | what came back |
|---|---|---|
| The Victoria | page timeline | 2 posts. Pinned August listing readable in full |
| Castle Mona | `/upcoming_hosted_events` | "No events to show" |
| Castle Mona | page timeline | 1 post, 27 July, image only, no caption text |
| Mitchell's | page timeline | 2 posts |
| Wolstanton Golf Club | page timeline | 1 post |
| The Albert | page timeline | 1 post |
| The Removal Men | `/upcoming_hosted_events` | "No events to show" |
| The Removal Men | page timeline | 1 post, 13 June, past-dated |
| The Hustle Band | `/upcoming_hosted_events` | "No events to show" |
| The Hustle Band | page timeline | 2 posts |

**Two distinct faults, and they compound. Both are new and both are in CTO-INBOX.**

**(a) Facebook post text is character-scrambled and `get_page_text` returns nothing.**
`get_page_text` on a page timeline returns the error *"No text content found"*.
`document.body.innerText` returns each character followed by U+034F and in the wrong order:
`otnpdsoerSihctah0uc883a20312f30cug365am1l9lf`. **This is not a broken page and it is not
one of the three §6B `javascript_tool` guards.** Facebook renders each character in its own
`<span>`, sets the visual order with CSS `order`, and interleaves decoy characters in spans
at `position: absolute`.

**The reconstruction works and is written down in §6 below.** It recovered the venue's
August listing verbatim, which is the evidence both of this run's writes rests on.

**(b) The timeline feed still stalls at 1–2 posts in an MCP tab.** This is §6B's known
IntersectionObserver fault, and it is why a venue's month of listings is still out of reach
even once the text is readable. **A pub does not publish its gigs as Facebook events** —
none of the three pages checked had a single one. It publishes a monthly poster image with
the listing in the caption. So the two faults together mean: the one post that renders is
readable, and everything behind it is not.

## 6. The reconstruction — write this into §6B

Walk the DOM depth-first. At each element, sort the children by computed `order`, then by
document position as a tiebreak. **Skip any element at `position: absolute` whose subtree
contains U+034F — those are the decoys.** Skip `display:none` and `visibility:hidden`.
Concatenate the text nodes and strip U+034F.

```js
window.__fb = function (root) { let s = ''; const rec = function (n) {
  if (n.nodeType === 3) { s += n.nodeValue.replace(/͏/g, ''); return; }
  if (n.nodeType !== 1) return; const cs = getComputedStyle(n);
  if (cs.position === 'absolute' && n.textContent.indexOf('͏') > -1) return;
  if (cs.display === 'none' || cs.visibility === 'hidden') return;
  const kids = [...n.childNodes].map((c, i) =>
    [c.nodeType === 1 ? (parseInt(getComputedStyle(c).order) || 0) : 0, i, c]);
  kids.sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
  kids.forEach(k => rec(k[2])); };
  rec(root); return s; };
window.__fb(document.querySelector('div[role="main"]'));
```

⚠ **Scope it to `div[role="main"]`.** Run against `document.body` it also reconstructs the
signed-in user's private notifications and chat list. That is the account holder's personal
data, it is not evidence about any act, and no run has any business reading it.

⚠ Output still passes through the three §6B guards: strip or transform `=`, and page the
result in ~900-character slices.

## 7. Why the target was missed, and what would fix it

**2 records against a target of 25. The cause is the capture surface, not the district.**

Every one of the seven seeds resolved to a Facebook page, because that is the only surface
bndy holds for them. Of the seven, six have no website in bndy at all. The spec ranks
capture surfaces **venue website first, Facebook second** — and rule 4 as written selects
seeds on "a website **or** a social page", so it fills the queue with the weaker surface.

**Two things would raise the yield and neither is a new rule:**

1. **Rank the rule-4 queue by surface, not only by source-id count.** A venue with a website
   is worth several with only a Facebook page. Six of seven hops this run were spent on the
   surface the spec itself calls second-best.
2. **A poster image is the actual publication format for a pub's month of gigs.** Castle
   Mona's only post is an image with no caption. Until an image is readable, those gigs are
   not reachable by any amount of seed rotation.

**This is not saturation and must not be read as saturation.** ST5 saturation is recorded
as 0.0 on 7 hops, which is 7 hops of noise, exactly as the 2026-08-08 cursor warned.

## 8. Admission test — rejects, named (never silently dropped)

| seed | row | disposal |
|---|---|---|
| The Albert | Saturday karaoke with Grubsy, 2026-08-16, 21:00 | `REJECTED-karaoke` (§6 filter) |
| Wolstanton Golf Club | Bingo Night | `REJECTED-not-music` |
| The Victoria | Paint & Sip, every Monday 19:00–21:00, £5 | `REJECTED-not-music` |
| Mitchell's | Mexican Fiesta weekend, 28–31 August | `REJECTED-no-named-act` (§0.5) |
| The Victoria | Little Vic Fun Day, Sunday 2nd | `REJECTED-past-dated` (§0.14) |

**Noted, no action:** The Victoria's post states *"𝗨𝗣𝗗𝗔𝗧𝗘: 𝗦𝗜𝗡𝗚𝗟𝗘𝗦 𝗡𝗜𝗚𝗛𝗧 𝗛𝗔𝗦 𝗕𝗘𝗘𝗡
𝗣𝗢𝗦𝗧𝗣𝗢𝗡𝗘𝗗."* bndy holds no such event and it names no act. Nothing to cancel.

**Out of region:** none. All seven seeds are inside the coast-to-coast strip.

## 9. Deletions

**None.** No row in this run met §0.17. The one cancellation-shaped item (Singles Night) has
no bndy record and no act.

⚠ **`sources\spider.md` declares no §0.29 mode.** The run therefore treated the source as
**`append-only`** and removed nothing. Raised to CTO-INBOX. This matches how sceniceye,
gigs-news, insangel, otcm and klma runs have each handled the same gap.

## 10. Enrichment

**No artist was created, so §2A.5 enrich-inline had nothing to run against.**
Evidence file `data\state\enrichment-evidence-2026-08-15-spider.jsonl` written and empty.
Validator: `0 records · 0 clean · 0 FAIL · 0 WARN [mode=gate]`, exit 0.

**One enrichment finding, logged not written.** bndy holds artist `0M0cqE9jfLGbgoyWj5bT` as
**"Hustle"**, Stockport, with `graph.facebook.com/thehustlebanduk/picture` already attached.
**That page's own name is "The Hustle Band"**, and it describes a Cheshire / North Wales /
Shropshire / North West wedding and party band with a website at `thehustleband.co.uk`.

§0.20 makes the act's own page the naming authority, **but a rename changes the artist
identity key (§1, `normalise(name)` + region) and §0.2 forbids a run exercising judgment on
identity.** The page may also have been attached to the wrong record by an earlier run — the
stored location and the page's stated coverage do not agree. **Written to CTO-INBOX as
`DATA`, not written to bndy.**

## 11. State written

| file | change |
|---|---|
| `data\state\spider-seen.json` | 7 seeds added with `spideredAt` 2026-08-15 |
| `data\state\spider-coverage.json` | ST5 row added, 7 hops, 0 venues found, saturation 0.0 |
| `data\state\spider-state.json` | cursor written, `nextDistrict` ST5 |
| `data\state\run-summary.jsonl` | one line appended |
| `20-Daily\2026-08-15.md` | one line appended |
| `CTO-INBOX.md` | 4 items appended |

**Snapshot gate (§6A step 7).** This source has no `spider-last-page.txt` and never has: it
has no upstream feed to snapshot. Its equivalent state is the three files above and all
three are written. Stated here so the gate is visibly satisfied and not silently skipped.

**Cursor.** `nextDistrict` stays **ST5**. Two rule-4 seeds remain there (Yates, Cappello
Lounge), and the district has had 7 hops, which is noise, not coverage. The 2026-08-08
cursor pointed at SK1 and named four Stockport artists; two of those four (The Removal Men,
The Hustle Band) were worked this run and are now cleared.
