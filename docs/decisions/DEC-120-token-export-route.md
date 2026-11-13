---
id: DEC-120
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: true
  real-trade-off: true
from: IDEA-002#09 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-024, RES-026, RES-028] # the RES files this decision rests on
decided: 2026-11-12 by the agent, under Peter's delegation of 2026-11-12
---
# DEC-120: Tokens leave Figma through the native export of modes

## Context

Tokens are authored in Figma and must reach the repo with no hand maintenance. Peter delegated the choice of the route on 2026-11-12: "we want the Figma tokens to get pulled into the design system code base via whatever method makes the most sense." On the Professional plan no route reads variable values unattended; the Variables REST API answers 403 (RES-028). DEC-118 already accepts a pull that an agent runs on request.

## Decision

The token files in the repo are the files that Figma's "Export modes" command writes: for each variable collection, one DTCG 2025.10 file for each mode. A browser agent or a person runs the command in the Variables view, and the files go into the repo unchanged. A read of the variables through the Figma MCP checks each export against the Figma file.

The reason: Figma writes these files itself, so no agent retypes a token value. The format is the stable DTCG format with Figma's own extensions for the variable ID, the scopes and the code syntax. It holds aliases as references and descriptions as text, and Figma can import it again.

## Considered Options

- A `use_figma` read script as the only route. It uses the same MCP session as the spec pull, but it returns Figma's own JSON at 20 KB for each call. An agent would then convert the values and write them to disk, which puts a model in the path of every value. Kept as the check, rejected as the source.
- The Variables REST API in CI. It needs the Enterprise plan, which the delegation does not cover.
- Tokens Studio. Its sync features need a paid plan for each editor, and its own format adds a second model of the tokens.
- A custom plugin. A person must start it in an open file, and private publication needs the Organization plan.

## Consequences

- An export needs a browser session with a Figma sign-in, or a person. The command sits in a context menu, so a change of Figma's interface can break the agent's steps; the manual steps stay the fallback.
- The export writes a FLOAT variable as a `number` with no unit, and a BOOLEAN variable as the number 1 or 0. The step that builds CSS must add units from the scopes. IDEA-002#11 owns that, after the trial in IDEA-002#20.
- The files hold no collection name and no mode ID. The folder layout in the repo must carry the collection name.
- IDEA-002#10 still decides how an export becomes a commit or a pull request, and how token versions are named.
- If Figma later offers the same export through an API or an MCP tool, only the transport changes. The files in the repo stay the same.
