---
id: DEC-168
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-004#04 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-029, RES-079] # the RES files this decision rests on
decided: 2026-11-20 by Peter
---
# DEC-168: The framework targets of 1.0 are React, Redact and Preact

IDEA-004#04 asks which framework targets ship in 1.0. The candidates of Peter's kickoff prompt were React, Preact, TanStack Redact and possibly Solid. Peter decided: React, Redact and Preact. Solid is no target of 1.0.

His words, 2026-11-20, typed into the question dialog: "react, redact and preact". He chose none of the three options. The agent had recommended one React package that also runs on Redact, with no package for Preact and none for Solid; the other options were that with a Solid package, and all four candidates.

## Consequences

- Open, for IDEA-004 rows 05 and 07: three targets are not yet three packages. The test RES-079 showed that one changed wrapper serves React and Redact. Whether the same package also runs on Preact through `preact/compat` is not observed; IDEA-004#10 tests it.
- Redact is at 0.3.1, before its 1.0. A test on it can break when Redact changes.
- None of the six libraries in RES-029 ships a package for Preact, and no source has a test of a wrapper under Preact. 1.0 has no model there.
- Each block and each example of the documentation is written for plain HTML and for each target (DEC-146). How many versions that is depends on rows 05 and 07: Redact runs React code.
- A Solid user uses the custom elements. Solid sets a property with `prop:` and listens with `on:` (RES-029). DEC-149 names Solid users among those who must not be surprised; typed JSX for the custom elements is the open point for them, in IDEA-004, "Not yet specified".
