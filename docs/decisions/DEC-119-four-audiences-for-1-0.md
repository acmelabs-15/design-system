---
id: DEC-119
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: true
  surprising: false
  real-trade-off: true
from: IDEA-001#03 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-119: 1.0 serves four audiences

No record named the products or the users of 1.0, and the component list needs that rule. Peter decided that 1.0 serves four audiences together: the applications that ACME Labs builds itself, artifacts and prototypes that an agent writes, teams outside ACME Labs who install a public design system, and marketing and content sites. He selected all four options of the question and narrowed none, so no audience rules a component concept out.

## Consequences

- IDEA-001#07 uses this rule: a component concept is a candidate for the list when one of the four audiences needs it.
- The list needs application components (app shell, navigation, data display, complex form controls), content components (page sections, typography, media, site navigation) and a broad general-purpose set.
- Artifacts are often one HTML file that loads from a CDN. The components must work there with no build step and no application state; IDEA-003#11 owns that delivery.
- The decision does not say which audience wins when two of them need different things from one component. IDEA-001#07 settles such cases one by one.
- It is evidence, not an answer, for server rendering (IDEA-003#04), custom themes (IDEA-002#04), the wrapper targets (IDEA-004#04) and the consumer skills (IDEA-005#07).
