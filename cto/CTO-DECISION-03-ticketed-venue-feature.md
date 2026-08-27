# CTO DECISION 03 — Ticketed venue banner + per-gig ticketed flag (BUILD SPEC)

**Raised:** 2026-07-31, Fantastical Library supervised import · **Owner:** Jason (CTO) · **Status:** SPEC — ready to build
**Resolves part of:** `CTO-DECISION-01-ticketed-vs-grassroots.md`
**Codebases:** bndyapp frontend + backend

---

## Jason's ruling (2026-07-31)

Verbatim intent, from the Fantastical Library staged-rows review:

> "Hairy Dog and the Flowerpot we need to keep, but we need to mark it as a ticketed venue and to check prices with the venue… We need a clear banner on the venue that it's ticketed, with a link to the main ticket site https://www.thehairydogderby.co.uk/gig-guide as well as us having the option of marking individual gigs as ticketed true/false."

**What this settles from Decision 01:**

| Decision 01 question | Settled by this ruling |
|---|---|
| Q1 — two-axis model (ticketed ≠ non-grassroots)? | **CONFIRMED.** The Hairy Dog and The Flowerpot are grassroots rooms that happen to sell tickets. They stay in. |
| Q4 — ignore-list big rooms? | **REJECTED as the tool.** Ticketing is surfaced, not hidden. |
| Q2 — `venueTier` field? | **STILL OPEN.** Not needed for this build; revisit when a genuinely non-grassroots room appears. |
| Q3 — default filter definition | **STILL OPEN.** |

---

## Scope

### 1. Venue record — use what already exists

`edit_venue` already carries `standardTicketed`, `standardTicketInformation`, `standardTicketUrl`. **No new venue schema.** Populate them:

| Venue | standardTicketed | standardTicketUrl |
|---|---|---|
| The Hairy Dog, Derby (`3a5b4ca3-c4d8-4326-a0c8-c5dc585a52b7`) | `true` | `https://www.thehairydogderby.co.uk/gig-guide` |
| THE FLOWERPOT DERBY | `true` | needs confirming with the venue |

⚠ Ticket prices are **not** to be guessed. Jason's instruction is to check them with the venue. Until confirmed, `standardTicketInformation` stays empty rather than carrying an invented price (§0.18 — blank beats wrong).

### 2. Event record — per-gig override

`ticketed` already exists on the event. Required behaviour:

- Event inherits the venue's `standardTicketed` when the event's own `ticketed` is **unset**.
- An explicitly set event-level `ticketed` (true *or* false) **always wins** — a free acoustic afternoon at a ticketed room must be able to say so.
- Distinguish "unset" from "explicitly false". A nullable field, or a separate `ticketedSource: inherited | explicit`. Do not use `false` as the default, or the override is unexpressible.

### 3. Frontend — the banner

On the **venue page**, when `standardTicketed` is true:

- A clear, persistent banner: this venue's gigs are ticketed.
- A button/link to `standardTicketUrl`, opening in a new tab, labelled with the venue name (e.g. "Tickets at thehairydogderby.co.uk") — not a bare "Buy tickets", which reads like bndy is selling them. **bndy takes no payment and must not appear to.**
- Suppress the banner if `standardTicketUrl` is empty — a ticketed claim with nowhere to go is worse than nothing.

On an **event card / event page**, when the event resolves to ticketed:

- A compact ticketed marker, consistent with the venue banner's styling.
- Show `price` only when we actually hold one. Never render "£—" or "TBC".
- The ticket link falls back to the venue's `standardTicketUrl` when the event has no link of its own.

### 4. Import-side rule (runbook)

Runbook amendment to accompany this build:

- When a source states a price or a ticket marker, set event `ticketed` + `price` explicitly. Never discard it (this is the defect Decision 01 §"Immediate consequence" already records for Lemonrock).
- Never set event `ticketed` from inference about the venue — that is the venue flag's job.
- Never strip a "🎫" marker into a name field (§0.6); it sets `ticketed` instead.

---

## Why this ordering

Steps 1 and 2 are near-free: the venue fields exist, the event field exists, and the only real backend work is the inherit-with-override resolution and making "unset" representable. Step 3 is the visible half and the bit that keeps the grassroots promise honest — a user who lands on a Hairy Dog gig learns it is ticketed *before* they turn up.

`venueTier` (Decision 01, option C) stays unbuilt. Nothing in the Fantastical corpus needs it: The Hairy Dog and The Flowerpot are grassroots rooms with a box office, not touring venues. Build it when a real touring room forces the issue, and avoid the 1,491-venue backfill until then.

---

## Acceptance

- Hairy Dog venue page shows the banner and an outbound link to the gig guide.
- A Hairy Dog event with no explicit `ticketed` renders as ticketed.
- A Hairy Dog event with explicit `ticketed: false` renders as NOT ticketed, and the venue banner still shows on the venue page.
- A venue with `standardTicketed: true` and no `standardTicketUrl` shows no banner.
- No price is rendered anywhere unless a real value is stored.
- Import: a source row carrying a price results in event `ticketed: true` + `price` set.

---

## Related open items

- **Ticket prices for The Hairy Dog and The Flowerpot** — Jason to check with the venues. Blocks `standardTicketInformation` only, not the build.
- **The Flowerpot's ticket URL** — unknown, needs confirming.
- Decision 01 Q2 (`venueTier`) and Q3 (default filter definition) remain open and are deliberately out of scope here.
