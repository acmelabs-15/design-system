---
id: DEC-151
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: user # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [] # the RES files this decision rests on
decided: 2026-11-20 by Peter
---
# DEC-151: Peter reviews the whole of 1.0 in Figma before anything is built

Peter said this on 2026-11-20, in a message of his own at the start of a session and outside a row. The decision: when the ideas are finished and before anything is built, the whole of 1.0 is put together in Figma, and he reviews it there. He expects to give feedback, so the build waits for his review.

His words: "So just to be super clear, when we finish up all the ideas, before we actually build anything, I want to have the whole thing put together on Figma so I can review it. I think I'm probably going to have some feedback."

## What Peter decided

- The whole of 1.0 is put together in Figma before any build starts.
- He reviews it there, and he expects to have feedback.
- The time: after the ideas are finished, and before anything is built.

## How it meets the earlier decisions

- It agrees with DEC-117 and DEC-118 (the design specs are made in Figma) and with DEC-141 (agents make the design specs in parallel, he approves once when all are complete, and the build of the components starts after that approval). DEC-141 stands.
- It sharpens DEC-141 in two points. The review covers "the whole thing", and DEC-141 names only the design specs of the components. He expects feedback, so the one approval at the end is a review with changes after it, and the build starts when those changes are made and he approves.
- His additional scope of 2026-11-13 already puts two more things into Figma: the recipes of the Blocks section (item 2, IDEA-002#30) and the design of the documentation website (item 2, the deferred row IDEA-007#14).

## The agent's reading, told to Peter on 2026-11-20

He has not confirmed these three points.

- "The whole thing" is what the records already put into Figma: the tokens as variables, the design spec of each of the 145 components, the recipes of the Blocks section, and the design of the documentation website.
- "Build" is the build of each spec of 1.0. The work in Figma is the one exception: it is the plan of the spec of IDEA-002, and it comes first. No code of 1.0 is written before his review is complete.
- A throwaway prototype or a trial for an open row of an idea, in scratch and outside git, is evidence for a decision and no build. Such rows are IDEA-004#03, IDEA-005#14, IDEA-008#03 and IDEA-009#02.

## Open after his words

- Whether the panel of devtools is designed in Figma as part of the whole. No record puts it there. IDEA-006, "Not yet specified", holds the point.
- Whether work on the repository itself may run before the review: the removal of the old system, and the setup of the build tools and CI. IDEA-010 rows 03 and 06 ask it.
- Whether the specs and the plans of the code ideas are written before the review or after it. His feedback can change them.
- How the whole is put together for the review, how he gives feedback, and how agents work it in. The deferred row IDEA-002#31 holds it.

## Considered Options

- The build of a component starts when its own design spec is complete, while other specs are still drawn. It gives results sooner, and his feedback then changes code that exists. His words rule it out.

## Consequences

- The order of work is: the ideas; the spec and the plan of IDEA-002; the work in Figma; his review and feedback; the changes; his approval; then the build.
- Feedback that changes a decision gets a new decision record, which supersedes the earlier one.
- The trial IDEA-009#02 waits for the first Figma library, and that library is made after the ideas are finished. So IDEA-009 cannot finish before the work in Figma by its present wait. IDEA-009, Notes, holds the two ways out; it is a question for Peter when that row is next.
