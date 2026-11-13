---
id: DEC-132
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-001#07 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-037] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-132: A concept is not left out because other components can compose it

For the second batch of the 1.0 list the agent proposed to leave out twelve concepts with the reason "another concept of the list covers it", such as Split Button, which a Group with a Button and a Dropdown Menu can make. Peter did not accept that reason where it means composition: "I don't agree that just becasue they can be composed doesn't mean we should't make them". A ready-made component has props that make it easy to use, and it has its state built in. So 1.0 also ships a component that a developer could compose from other components of the list.

## Peter's words

"I think most of these libs consider the group component to be visual only - so for attaching etc - also in the components that are out I don't agree that just becasue they can be composed doesn't mean we should't make them - I think most of the systems/libs include buton group, close button, load more button, split button, copy button, checkbox cards, radio cards, clearable i nput and search input, multiselect, radio, theme switcher - a lot of these have nice to have props that make them easy to use - as well as state management built it".

## Consequences

- In by this decision, in batch 2: Button Group, Close Button, Load More Button, Split Button, Text With Copy Button, Clearable Input, Search Input, Multi Select, Radio and Theme Switcher.
- The reasons for out that remain: the concept is the same as another concept of the list under another name; it is a helper for React only; it is made for the product of that system's maker; it is too narrow for 1.0; it wraps a third-party engine. Peter has not objected to these.
- Group is visual only: it attaches and arranges components and owns no behaviour. It replaces no other component.
- Peter wrote that most of the systems include these components. The matrix (RES-037) shows each of them as a component of its own in one system only; other systems offer some of them as an option of another component. His decision does not rest on the count, so it stands.
- The list grows, and each component in it needs a design spec, a Lit component and documentation.
- Peter's words are evidence for IDEA-003#06: he wants ready-made components with convenient props and built-in state inside the system.
