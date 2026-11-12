---
id: DEC-118
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: architecture # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: true
  surprising: true
  real-trade-off: true
from: IDEA-002#18 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-027, RES-028] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-118: The whole design spec lives in Figma, and an agent pulls it into the repo

## Context

DEC-117 put the design specs in Figma. It left open whether Figma can hold the whole spec, the behaviour, accessibility and motion text included, or whether that text must live in documents written in the repo. Live reads of the trial file (RES-028) showed what each route gets out of Figma on the Professional plan.

## Decision

Peter decided that all of a design spec is in Figma. The behaviour, accessibility and motion text go in Figma Specs documents beside the component. An agent that is signed in to the Figma MCP pulls the Markdown that the repo needs, on request. The Markdown in the repo is output of that pull; nobody writes it by hand.

The reason: this is the one option that keeps one source for the whole spec. Only the MCP route reads a Specs document, rich text, annotation categories and token values.

## Considered Options

- All in Figma with an unattended CI pull through the REST API. It reads descriptions and annotations as plain text only, no text of a Specs document and no token value on this plan. Rejected.
- Behaviour text in Markdown files written in the repo, with the visual spec in Figma. It needs no pipeline for the text, but it makes two sources that people must keep in step. Rejected.

## Consequences

- No pull runs without an agent session and a person's Figma sign-in. A change in Figma reaches the repo only when someone asks for a pull.
- Figma Specs is in open beta, and the pull depends on the Figma MCP. Peter accepted that risk in DEC-117.
- `get_design_context` changes bold and italic marks. A pull that needs exact text uses a `use_figma` script.
- IDEA-002#13 decides what one spec must hold, and where each part sits in Figma: the Specs document, annotations, descriptions and properties.
