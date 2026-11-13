---
id: DEC-148
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: false
from: user # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [] # the RES files this decision rests on
decided: 2026-11-13 by Peter
---
# DEC-148: Glossary terms take the standard name, and research finds it

Peter set this rule on 2026-11-13, in a message of his own during the question on IDEA-003#05. He had described a composition pattern, and the agent had answered with a word of its own choice. His words: "The composition pattern I described with providing all the subcomponents that are composed by a comedians rapper, there's a name for that pattern. We should lean into standards like that always when defining terms in the glossary. And if we're not sure what those patterns or names of those patterns are, we should never assume and always do research to look them up." The message was dictated; "a comedians rapper" stands for the component that composes the subcomponents, which his kickoff prompt calls the convenience component.

The decision: a glossary term for a pattern or a concept takes the name that its field already uses. When the name is not certain, research looks it up at its sources before the term goes into the glossary. A name from memory is a candidate to check and no source.

## Consequences
- [Domain routing](../agents/domain.md) holds the rule for every session.
- The pattern that he described gets its glossary term from the research rows IDEA-003#20 and IDEA-003#21. Until then the ideas keep the words of his kickoff prompt, "convenience component" and "subcomponent", as working words.
- The glossary terms Part, Subcomponent and Slot came from the words of the kickoff prompt on 2026-11-12. The same two rows record the names that the sources use, and the three terms are checked against them when the results are in.
