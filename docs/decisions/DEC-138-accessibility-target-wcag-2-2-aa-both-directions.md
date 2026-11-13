---
id: DEC-138
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: true
  surprising: false
  real-trade-off: true
from: IDEA-002#05 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-041] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-138: The specs target WCAG 2.2 AA, both reading directions and four input modes

Each design spec states the accessibility behaviour of its component, so the specs need one target. Peter selected "AA, both directions (Recommended)": the design specs target WCAG 2.2 at level AA, the reading directions left-to-right and right-to-left, and the input modes mouse, touch, keyboard and screen reader.

## Considered options

- Level AA with left-to-right only. It leaves less to check in each spec, and a later right-to-left version touches every component.
- The text contrast of level AAA, 7 to 1. More of Geist's colours fail it.

## Consequences

- Level AA asks for a contrast of 4.5 to 1 for text and 3 to 1 for the parts of a control, and for a target of at least 24 by 24 CSS pixels.
- The target limits DEC-136: where one of Geist's exact values fails level AA, that value changes. Geist states no ratio and no method for its colours (RES-041), so IDEA-002#26 measures them.
- Every spec says start and end, not left and right, and each one is checked in both directions. The glossary has the term Start / end.
- The reading direction of a page comes from the HTML attribute `dir`. Direction Provider is out of the list (DEC-133).
- The Lit core must reach this target inside shadow roots, where a reference by ID for ARIA does not cross the boundary (RES-043).
- Later change is costly, because the target is in every spec and every component.
