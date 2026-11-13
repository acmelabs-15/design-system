---
id: DEC-131
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: architecture # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: true
  surprising: true
  real-trade-off: true
from: user # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-131: The layout components take style props as in Chakra UI, with no CSS-in-JS

Peter keeps the layout helpers in the 1.0 list (Box, Flex, Center, AbsoluteCenter, Float, Wrap and SimpleGrid, beside Stack, Grid and Container). He decided how they work: their props work as they do in Chakra UI, responsive values included, and the Lit web components have this too, not only the framework wrappers. 1.0 uses no CSS-in-JS, so the components turn the props into style through CSS inside them.

## Peter's words

"for the layout helpers I want to keep all of those - I'd like their props to actually work like they do in chakra including their ability to be responsive - the only real difference I think is we aren't using css-in-js so those props would have to be handled internally via css or the css module rather (scss I tink) - this functionality includes the lit web components".

## Considered options

- Leave the layout helpers out, because a plain HTML element with CSS does their job. The agent proposed this, and Peter did not accept it.

## Consequences

- The decision covers the layout helpers. Peter did not say that every component takes style props, as every component of Chakra UI does.
- A prop of a Lit component comes from an HTML attribute or from a property. How one attribute carries a value for each breakpoint is open; IDEA-003 rows 14 and 15 hold the mechanism.
- Peter named SCSS with "I tink". That is his leaning for the way the styles are written, not a decision; the build tooling of the core is still open in IDEA-003.
- The breakpoints become part of the design tokens, and the design spec of each layout component lists its style props (IDEA-002#13).
- A framework wrapper must pass a responsive value, which is an object or a list in React, on to the Lit component (IDEA-004#05).
