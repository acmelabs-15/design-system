---
id: DEC-159
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: true
  real-trade-off: true
from: IDEA-011#02 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-083, RES-084] # the RES files this decision rests on
decided: 2026-11-20 by Peter
---
# DEC-159: Figma is the source of truth for tokens, component anatomy and the structure of blocks

A block exists in Figma, for designers, and in code, for developers, and Peter's additional scope left open which side is its source of truth. He decided it with one rule for three things: Figma is the source of truth for the tokens, for the anatomy of the compound components, and for the structure of a block. An agent makes the design specs in Figma, and a rule or a skill points every agent to Figma for these things.

## Decision

Peter, 2026-11-20, in two replies in the question dialog.

- His view, typed: "that could really allow us to call figma the source of truth for tokens and the compound components parts anatomy - so we could likely create a idk rule or skill or something that always points an ai to figma for tokens and the part composition of a compound component's anatomy?"
- The question that followed stated that view and asked: "Does the same rule hold for a block: Figma is the source of truth for its structure?" He selected "Yes, the same rule for blocks (Recommended)", with no condition. The option read: "Figma is the source for tokens, for component anatomy and for the structure of a block. Behaviour and states are text in the spec in Figma. A change starts in Figma, and an agent updates the code."

The structure of a block is which components it uses and how they are arranged.

## What was decided before, and what is new

- Before: the tokens are authored in Figma (DEC-120); the design specs are made in Figma, and each reaches the repo as Markdown that an agent pulls (DEC-117, DEC-118); a design spec holds the anatomy and the parts (DEC-142); the compound components are taken from that anatomy (DEC-158).
- New: the same rule holds for the structure of a block. And the rule gets a carrier: a rule in the agent instructions of the repo and a maintainer skill, which is the deferred row IDEA-002#33.

## Considered Options

- Code is the source of truth of a block after its first build, and an agent pushes changes back into Figma. 14 of 50 surveyed design systems name code as their source for components, and maintainers of such systems say that the Figma library lags the code (RES-084).
- Figma for the structure and the look, code for the behaviour and the states. It follows what Figma can carry and gives one block two sources.
- A trial before the rule is final: three components and one block in a trial file, with one change carried in each direction. Peter chose the rule without the trial.

## Consequences

- A change to tokens, to the anatomy of a component or to the structure of a block starts in Figma. An agent then updates the code for plain HTML and for each framework target. Nobody changes these by hand in code.
- Behaviour and states do not come across from Figma as data (RES-083). They are text in the design spec in Figma (DEC-118). Figma's own spec document, which the skill `figma-spec` reads and writes, is one place for that text; it is in open beta.
- The rule goes against the larger group of the survey: of the systems that name a side, 14 name code and 7 name Figma, among them Carbon, Spectrum and Uber Base. In those 7 a person builds the code to the Figma spec. In 1.0 an agent does that work with Figma's MCP server and skills.
- The costs that Peter saw: every structural change starts in Figma, also a small one; the first real work in Figma is the proof that the tools hold, because so far one component was built through the MCP (RES-025); a live read changed some text marks and dropped some properties (RES-028); the MCP reads at most 200 calls a day on the Professional plan; writing to the canvas is in beta and becomes a paid feature.
- So the copy in the repo, the pulled design specs and the token files, is what an agent reads each day, and the Figma MCP serves a fresh pull.
- Code Connect on the Professional plan links one library to one framework (RES-083). Which framework gets the link is open; IDEA-002 and IDEA-009 hold it.
