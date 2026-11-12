---
id: DEC-117
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: true
  surprising: false
  real-trade-off: true
from: IDEA-002#02 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-023, RES-024, RES-025] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-117: Design specs are made in Figma

IDEA-002 had to choose where the design spec of each 1.0 component is made. Peter decided that the specs are made in Figma, and that Figma is the one place where they are updated; specs written only as documents in the repo are out. The live trial showed that an agent can build a component with variants, properties and token bindings through the Figma MCP, and Peter accepts the beta and price risk of that route.

## Consequences

- Peter's direction is that all of a spec goes in Figma and a pipeline pulls what the repo needs into Markdown files. DEC-118 settled that it works for the whole spec, with an agent-run pull.
- Agents may also use the browser to make updates in Figma.
