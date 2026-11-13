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
- The effort. A few minutes later he added: "Maybe we should let it decide the effort too. I'll let you make that decision. I just don't want there to be hurt quality." He leaves this point to the agent, with one condition: the quality must not suffer. The agent's decision, which it told him: the main session also chooses the effort for each agent, `medium` or `high`. `medium` is the lowest, because it is the effort that he set on 2026-11-12 and that the resolved records of this work come from. `high` is for a row where an error costs much, and for a record that came back incomplete at `medium`. The efforts `xhigh` and `max`, and a third model, still need his yes; on 2026-11-12 he corrected three agents that ran at `xhigh`.
- He gives no rule for the choice. The capabilities file holds a guide of the agent, marked as such, so that sessions choose in the same way.
