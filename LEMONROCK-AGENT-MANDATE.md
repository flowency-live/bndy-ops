# LEMONROCK AGENT — CTO MANDATE (2026-08-01)

**Paste this at the TOP of the Lemonrock agent's instructions. It overrides anything it reads elsewhere.**

---

## 1. RULES ARE READ-ONLY. YOU NEVER WRITE A RULE.

You may read: `10-Projects\bndy-population\RUNBOOK.md`, `sources\*.md`, `OPEN-RULINGS.md`.

**You must NOT write, edit, amend, version-bump or "improve" any of them. Ever.**
You must NOT create a new runbook, a draft runbook, or a rule file of any kind. A held run once authored its own runbook and created a third competing rulebook — that is why this rule exists.

Hit something the rules do not cover, or that they cover wrongly? **STOP that item, keep going with the rest, and append one line to `OPEN-RULINGS.md`** under "Open — awaiting Jason", in the existing format. Appending to that register is the ONLY writing you do outside bndy records and your own run report.

## 2. ⚠ YOUR TASK FILE POINTS AT A TOMBSTONE — IGNORE IT

`LEMONROCK-TASK-v2.md` says *"SUBORDINATE TO `MASTER-IMPORT-RUNBOOK.md` (v1.13+)"*.

**That file is a TOMBSTONE. Do not read it.** The one runbook is:

```
C:\VSProjects\AllProjectsMD\bndy\10-Projects\bndy-population\RUNBOOK.md
```

Assert its H1 version is **≥ v2.4**. Lower, missing or unreadable → STOP, write nothing, report.
Everything else in `LEMONROCK-TASK-v2.md` (the `?page=gigs` collection surface, the ignore list, the parsing traps) still applies — only its runbook pointer is wrong.

## 3. ⚠ NO STUBS. THIS OVERRIDES §2A.5(b) IN THE RUNBOOK YOU WILL READ.

The runbook still carries the structured-source exception saying a live Facebook search is not required at create time, and it names **Lemonrock** as the qualifying source. **That clause is REVOKED by Jason's ruling of 2026-08-01.** It produced 176 stub artists overnight — 175 with no Facebook, **176 with no bio**, 175 with no image — and let five contaminated names through.

**Before creating ANY artist you must have EITHER:**
- **(a)** a verified Facebook page meeting the §2A.1 evidence bar — attach it, and take **bio** and **avatar** from that page; **or**
- **(b)** an evidenced "no page found" — record the search variants you actually tried in the run report.

**Neither obtainable (Chrome down, capped, rate-limited) → STAGE the artist. Do not create it.**

Lemonrock's structured fields satisfy **genre, actType and location ONLY**. They never satisfy the identity check on the **name**.

## 4. ⚠ SANITISE THE NAME (§0.6) — LEMONROCK'S BAND INDEX CONTAINS THINGS THAT ARE NOT BANDS

The artist name is the **act name only**. Gig billing, residency and event names, venue names, `& Friends`, dates and promo text belong in the **EVENT TITLE**, never the artist record.

Real examples already in bndy from this source, all now corrected or flagged:
- `Zoe Schwarz Bluez Party` → the act is **Zoe Schwarz**; "Bluez Party" was the gig billing
- `Funky Friday with Barclay` → a residency night; the act is **Barclay**
- `Exmouth Shanty - Pontneuf` → event + act
- `Jacob and Friends` → the `& Friends` pattern
- `French Folk Group` → a generic descriptor, not an act at all

**If a name looks like an event, a night or a description rather than an act: STAGE it, do not create it.** A source listing a residency as if it were a band does not make it one.

## 5. ENRICHMENT IS THE DEDUP KEY — THIS IS WHY IT IS MANDATORY

Artist identity resolves on **normalised name + location**, plus a **Facebook key**. It does **not** use `externalIds`, and it does **not currently use `nameVariants`**.

So the Facebook URL is the only thing that collapses billing variants onto one artist. `Pv Rocks` and **Poole Vigilantes** are the same band; only the shared Facebook page can prove it to the resolver. **Import without enrichment and every billing variant becomes a new artist.**

## 6. STANDING CONSTRAINTS

- **Cap 50 creates per run** unless Jason has authorised a named lane in writing (name, region scope, cap, per-batch go/no-go, closing condition).
- **Read every write back with `get_by_id`.** Never verify with `search_artist` / `search_event` — both have documented false-negative modes.
- **A 409 / `DUPLICATE_EVENT` is SUCCESS**, not an error. Never work around a bounce (§0.9).
- **Never touch owner-managed records** (§0.16).
- **Never create, modify or re-enable a scheduled task** (§0.1).
- **Ignore list first** (§0.19) — before the first fetch, not as cleanup.
- **Full UUIDs in the run report.** Two live venues share their first 8 characters.

## 7. YOUR REPORT MUST MEASURE QUALITY, NOT ERROR COUNT

State separately:
- artists created **with a verified page**
- artists created with an **evidenced blank**
- artists **staged** and why
- names **sanitised** or staged as non-acts

A report of "N creates, zero errors" is not acceptable. A run that creates 50 stubs with no errors is a **failed** run.
