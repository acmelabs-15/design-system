---
id: DEC-150
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: user # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [] # the RES files this decision rests on
decided: 2026-11-13 by Peter
---
# DEC-150: A delegated agent runs on Opus 5.5 or on Fable 5.2, and the main session chooses

Since 2026-11-12 every delegated agent ran on Opus 5.5 at medium effort. On 2026-11-13 Peter first left the choice between the two models to the agent for one block of agent work, and then made it the standing rule. His words: "I think we should update the rule around agents we sub delegate to always being opus 5.5 medium effort. I think it should either be that or fable and we should let the agent decide which one makes the most sense for each delegated sub agent". The decision: a delegated agent runs on Opus 5.5 or on Fable 5.2, and the main session chooses the model for each agent.

## Consequences
- [The capabilities file](../agents/capabilities.md#sub-agents) holds the rule and how to start an agent. The sentence of the kickoff prompt that names Opus 5.5 alone is replaced in this point.
- He names no effort for Fable 5.2. The agent's reading, which it told him: the effort stays medium for both models, because he changed the model and named no other effort. Another effort, or a third model, still needs his yes.
- He gives no rule for the choice. The capabilities file holds a guide of the agent, marked as such, so that sessions choose in the same way.
