---
id: DEC-144
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-007#01 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-144: The documentation website holds the full set of pages

The documentation website of 1.0 (IDEA-007) needs a scope before its spec. Peter selected "The full set (Recommended)". The other option was reference only: examples, code and reference tables, with no text on when to use a component.

## The page of each component

- What the component is, and when to use it and when not.
- Live examples.
- The code of each example, in plain HTML and for each framework package.
- Its props, events, slots and parts.
- Its keyboard and screen reader behaviour.
- The tokens that it uses.

## Beside the component pages

- Get started, for each framework package and for a page with no build step.
- Theming: light and dark, and custom themes.
- Tokens, and Icons.
- Blocks, the section for recipes (DEC-140).
- A page on the MCP server and the skills, and a page for designers on the Figma library.
- The changelog.

## Consequences

- Each of the 145 components needs a text on when to use it. That text is the usage guidance of DEC-142, a spec of its own. Agents can write the texts, and Peter approves them; IDEA-007#04 decides where they are written.
- The reference tables, the behaviour text and the tokens of a page repeat items of the design spec (DEC-142), so IDEA-007#04 decides how the website takes them from one source.
- The framework packages of the code examples follow IDEA-004#04, and the page with no build step follows IDEA-003#11.
