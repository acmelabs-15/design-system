---
id: DEC-127
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: architecture # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: true
  surprising: true
  real-trade-off: true
from: IDEA-003#04 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-127: 1.0 does not render on the server

The composition architecture of the Lit core depends on whether a component must render on a server before the browser runs its script. Peter decided, in a message of his own, that 1.0 does not: "Also, I don't care about server-side rendering, so server-side rendering is not something that needs to be a part of this at all." The architecture is therefore chosen for the browser only.

## Considered options

- Server rendering as a requirement of 1.0. Two of the four audiences of DEC-119, outside teams and marketing and content sites, often render their pages on a server. Peter saw no need for it.

## Consequences

- The architecture of IDEA-003#05 has no duty to write the inner structure of a component into the HTML on a server, or to take over such HTML in the browser.
- A component gets its own structure and style when its script has run in the browser. Until then the browser shows only the content that the page itself holds for that component.
- A later change of this decision is costly, because the architecture, the wrappers and the tests are then made without server rendering.
- The research and the tests of IDEA-004 leave server rendering out.
- Not decided here: whether a package of 1.0 must load without an error in an app that renders its pages on a server, where the components then appear only in the browser. IDEA-004 holds that point under "Not yet specified".
