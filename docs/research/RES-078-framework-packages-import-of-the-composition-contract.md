---
id: RES-078
status: resolved # in-progress | resolved
outcome: answered
kind: task
from: IDEA-004#02 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-20
---
# RES-078: Import of the composition contract into the framework packages idea

## Question
Import the composition architecture from IDEA-003. The row serves IDEA-004#03, the test of the React package on Redact, and IDEA-004#05, which decides whether each wrapper is generated or written by hand.

## Answer
Answered. The planned action was to read the decision of IDEA-003#05 and to state the facts that the rows of IDEA-004 need. It is complete when each fact below names its record. The main session did it on 2026-11-20; no step has an effect outside this record.

What the rows of IDEA-004 can rest on:

- The contract of the Lit core is DEC-152: each part that a developer can compose is an element, and it works at any depth below its root. A developer can put an own element between two parts.
- So a framework wrapper adds no rule of its own on where a part sits. A component of the developer between two wrapped parts must work in each framework package, as it does in plain markup.
- A wrapper is needed for each part element, because each part is an element. The export of the convenience component and of `Steps.Root` and the other subcomponents is the requirement of the kickoff prompt. No surveyed library is a model for that export shape (RES-029).
- The prototype has a thin React 19 wrapper for candidate A, which meets the contract: the convenience form, the composed form and a custom composition all work and update React state, in Chrome only. That wrapper can serve the test of IDEA-004#03 as its React package.
- Still open in IDEA-003, and not imported: the mechanism inside the contract (deferred row 23), where the convenience component lives (row 06), and which source gives the components their behaviour (row 07). Row 06 bears on IDEA-004#05, because a convenience component that lives only in the wrappers must be made for each framework package.

## Findings
- A part works at any depth below its root; the mechanism is not decided. Source: docs/decisions/DEC-152-a-part-works-at-any-depth-below-its-root.md, checked 2026-11-20.
- Events and context pass through a wrapper element; a slot takes only the top-level children of its host. So a wrapper that adds an element breaks a slot assignment and does not break a contract of any depth. Source: docs/ideas/IDEA-003-lit-core.md, "Evidence from other ideas", RES-043, checked 2026-11-20.
- Prototype, case 8, candidate A, React 19 from a CDN: "Works: convenience, composed, and custom (developer's own `<span>` between Item and Trigger, own badge between Title and Description). `onstepchange` updates React state (1, then 2)." Candidate B fails the custom composition with no console message. Source: .artifacts/v1/prototype/IDEA-003-05/IDEA-003-05-result.md, line 39 (scratch, outside git), checked 2026-11-20.
- The wrapper of the prototype exports `Steps` and twelve subcomponents, from `Steps.Root` to `Steps.NextTrigger`. Source: the same file, line 21, checked 2026-11-20.
- None of six web component libraries exports a React component with members such as `Steps.Root`. Source: docs/research/RES-029-framework-wrapper-landscape.md, as IDEA-004, Notes, "Row 01 — resolved" states it, checked 2026-11-20.

## Follow-ups
None.

## Next action
None.
