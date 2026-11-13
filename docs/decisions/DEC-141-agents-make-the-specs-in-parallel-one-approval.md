---
id: DEC-141
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-002#12 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-025] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-141: Agents make the design specs in parallel; Peter approves once, at the end

The list holds 145 components, and each one needs a design spec in Figma (DEC-117). Peter decided who makes and who approves them: "option 1 - they can all be created in a parallel - or as much in parallel as possible - I approve when all are completed". So agents draw the specs through the Figma MCP, as many at one time as the tools allow, and Peter approves the whole set when every spec is complete.

## Considered options

- The option that he took as the base: an agent makes each spec; he approves the first three one by one and then one family of components at a time. His own words replace that order of approval.
- An agent makes each spec, and he approves each one: 145 approvals.
- A person draws each spec, and an agent assists.

## Consequences

- No approval of Peter stands between the first spec and the last one. A fault in the way that the specs are made can therefore repeat in all 145 before he sees it. Two things limit that risk, by the agent's choice: the format of one spec is exact before the first spec is drawn (IDEA-002#13), and the agent tells Peter when the first three specs are complete, so that he can look early. The work does not wait for him.
- How many agents can draw at one time is a fact to find: the workspace allows eight agents, and RES-025 left open whether `use_figma` counts against Figma's rate limit. The plan of the spec sets the number.
- The Lit core builds a component from an approved spec (IDEA-003#10). With one approval at the end, the build of the components starts after the whole set is approved.
