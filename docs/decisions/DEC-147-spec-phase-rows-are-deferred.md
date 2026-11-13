---
id: DEC-147
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: true
  real-trade-off: true
from: user # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [] # the RES files this decision rests on
decided: 2026-11-13 by Peter
---
# DEC-147: Spec-phase rows are deferred and move into the spec

Peter's additional scope of 2026-11-13 holds research of two kinds: research that changes what 1.0 builds, and research that settles how to build a thing that is already decided. He decided that the second kind is written down at once and worked later: such an item is a row with the status `deferred` in its idea file, and it moves into the spec when the spec phase of the idea starts. He made this a standing rule of the workspace: "not a temporary addendum".

## What Peter decided

- Research that changes what is built or what is in scope belongs to the idea phase. Research that settles how to build a decided thing belongs to the spec phase.
- A spec-phase item is a row in its idea file with the status `deferred`, "with enough detail that it stands on its own". No spec folder is made ahead of time.
- "Deferred rows don't count as open: they aren't on the frontier and don't stop the idea's decision tree from finishing, so the idea can close once everything else is settled."
- "When an idea is finished and its spec phase starts, every `deferred` row moves into that spec, as open questions or tasks. The handoff isn't done until each deferred row is accounted for."
- For an unclear item the agent chooses the phase and gives a one-line reason. It asks Peter only when the placement changes scope.

## What the agent chose, and told Peter

- The rule is in [the workspace file](../agents/workspace.md#deferred-rows), in one section. That file names the folders, the files and the rules that rows follow, and it holds the procedures for resuming and finishing work, so both the status and the handoff belong there.
- The capabilities file has no part of the rule: it lists the tools, skills and servers that work needs.
- The domain file has no part of the rule: it says how skills read the glossary, and `deferred` is a status of the workflow and no term of the component library.
- Brain 0.13.0 reports a row with this status as a finding: `status "deferred" is not open, in-progress, resolved or superseded by NN`. So a deferred row is in a second table of its idea file, under the heading "Deferred rows", with the columns of the map and a number from the same series. The CLI reads only the first table of a file, so these rows are not on the frontier and do not keep an idea from finishing, as Peter asked. If a later version of brain accepts the status in a map, the rows can move into the map with no other change.

## Considered Options

- Spec folders made now, with these items as their first rows. Rejected by Peter: "Don't stub spec folders ahead of time."
- Open rows in the maps. Rejected: they would be on the frontier and would keep the ideas from finishing.

## Consequences

- The first deferred rows are IDEA-002#29, IDEA-003#18 and #19, IDEA-007#14 and IDEA-010#07.
- An idea that ends as a decision, with no spec of its own, holds no deferred row: such a row is in the idea whose spec builds the thing. IDEA-001 is such an idea, so the rows for Code Block are in IDEA-003.
- A fresh run of setup-brain can replace the workspace file. The section must be kept or written again then.
