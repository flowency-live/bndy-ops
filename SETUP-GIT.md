# One-time git setup (run on the Windows machine, not in the VM)

cd C:\Users\jason\Documents\Claude\Projects\bndy
git init -b main
git add -A
git commit -m "chore: initial bndy-ops import - runbooks, run reports, CTO record, specs, state"

Create the private repo (GitHub web: flowency-live/bndy-ops, private, empty)
then:

git remote add origin https://github.com/flowency-live/bndy-ops.git
git push -u origin main

Afterwards: add the RUN-CONTRACT.md step 3 lines to the end of each scheduled
task's prompt (Bndy sweep, Klma stoke daily reimport, Onthecase daily import,
Gigs news daily import, Sceniceye, Bndy spider, Bndy nightly capture
processing, Fb artist image enrichment, Discovery crawler nw, Bv2a tasks if
they write here). Then delete this file.
