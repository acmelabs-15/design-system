---
id: DEC-149
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: true
  surprising: false
  real-trade-off: true
from: user # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [] # the RES files this decision rests on
decided: 2026-11-13 by Peter
---
# DEC-149: The core follows the best practices of web components and of React

Peter added this on 2026-11-13 to his reply on IDEA-003#05, in two messages of his own. It does not choose the composition architecture; it sets what that choice and the rest of the core must meet. The decision: 1.0 follows the best practices of Lit, of web components, of design systems and of React as far as possible, and the core is built so that it supports the best practices of web components and of React components at the same time. The test, in his words: a person who uses the Lit version is not surprised at how the components are built and put together, and the same holds for the users of React, of Solid and of each other framework.

His words, first message: "we want to follow LIP best practices, Web Component Best Practices, Design System Best Practices, React Best Practices as much as possible, but we also do want to build this core in a way where it will support the best practices of both Web Components and then also React Components, so we're going to have to think about that." The message was dictated; "LIP" stands for Lit.

His words, second message: "Basically folks using the lit version of this design system shouldn't be surprised at how the components are built and put together. Same for the React folks, solid folks, etc."

## Considered Options
- A core shaped for one side only: an interface that React users expect, with Lit as a detail of the implementation, or an interface that web component users expect, with thin framework packages. He named neither and asked for both sides.

## Consequences
- IDEA-003#05 is decided against this test. The research rows IDEA-003#20 and IDEA-003#21 record what each side states as best practice for a component with parts, and where the two sides differ.
- The practices beyond composition, such as attributes and properties, events and forms, are the deferred row IDEA-003#22.
- He names Solid users beside Lit and React users. That is evidence for IDEA-004#04 and no decision on the targets of 1.0.
- "As far as possible" leaves open what wins where two practices conflict. A conflict that the research finds goes to him as a question.
