---
id: DEC-158
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-003#24 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-081, RES-067, RES-084] # the RES files this decision rests on
decided: 2026-11-20 by Peter
---
# DEC-158: Four levels of components: primitives, compound components, composite components, blocks

The records had three working words for the ready-to-use form of a component and two for the larger arrangements, and no word for the smallest components. Peter set the terminology of 1.0 in four levels, with his own definitions, and he set the rule behind it: a term takes the word that the community uses most, "even if that means we have to make an adjustment". The rule sharpens DEC-148.

## Decision

Peter's four levels, in his words of 2026-11-20:

1. **Primitives.** "The smallest standalone components, also called atoms. Each one is used on its own and isn't made of other design system parts. Examples: Button, Input, Text, Icon."
2. **Compound components.** "The parts of one component, taken straight from the component's anatomy in Figma. They share state through their outermost part (the root, called the container in Figma anatomy) and are composed by hand when you need full control. Examples: Avatar.Root, Avatar.Image, Avatar.Fallback; Select.Root, Select.Trigger, Select.Content."
3. **Composite components.** "One ready-to-use component that assembles its own compound parts into a default structure. You pass props instead of composing the parts every time. Also called pre-composed components. Examples: Avatar (built from Avatar.Root, Avatar.Image and Avatar.Fallback), Select."
4. **Blocks.** "Larger, ready-made sections of UI built from several different components. Also called patterns or recipes. Examples: login form, search bar, user profile card, dashboard sidebar."

He confirmed them on the same day in the question dialog: "yes option 1 - I love \" Compound components: the parts of one component, from its anatomy in Figma, composed by hand for full control.\" - really aligned consistent vocabulary". Option 1 read: "Yes, lock in all four (Recommended)".

## The sources of the names

- "Compound components": 20 of the 38 records of RES-081 use the word for the granular way, among them Mantine, HeroUI and PrimeVue, and the writing of Kent C. Dodds and patterns.dev.
- "Blocks": shadcn/ui, Chakra UI Pro, Tailwind Plus, PrimeTek and Flowbite use the word (RES-067, RES-084).
- "Primitives" and "composite components": general writing on design systems uses the pair, with "primitives" for small basic components. The agent found it with two web searches on 2026-11-20 and read excerpts only: "A composite component combines multiple primitives to solve a larger UI problem" (https://learningspaces.co.in/learn/react/topic/what-is-a-design-system); "Small primitives are combined into larger components" (https://webiano.digital/knowledge-base/design/design-workflow/component-library/); and the web component library Elena sorts its components into "composite, primitive, and declarative" (https://piccalil.li/blog/framework-agnostic-design-systems-part-1/). Peter also brought an answer of Gemini with the same vocabulary; that answer names no source.
- A limit that Peter saw before he decided: the documentation of the 37 libraries of RES-081 does not use "composite" for level 3, and it uses "primitives" mostly for low-level parts, as Radix Primitives does. So the two words rest on general writing and not on the documentation of the surveyed libraries.

## Considered Options

For level 3 the agent first offered "convenience component", the word of the kickoff prompt, and then "pre-composed component", "higher-level component" and "convenience component" beside Peter's word. No surveyed library has a common word for this level. Peter kept "composite component".

## Consequences

- The glossary has the four terms since 2026-11-20. "Block" replaces "Recipe". "Composite component" replaces the working words of the records: "convenience component", "ready-made form" and "out-of-the-box component". Earlier records keep their words.
- Two notes in the glossary guard the terms. A composite component assembles its own compound components, and a block combines several different components; the general use of "composite component" does not draw that line. And "composite" in the glossary is not the composite widget of WAI-ARIA.
- A reader who knows Radix can read "primitive" as a low-level part. The glossary entry says that such a part is one of the compound components.
- The glossary keeps Part for a piece of the anatomy and Subcomponent for one of the compound components as a developer writes it.
- The names of the Figma anatomy and of the code agree: the outermost part is the root, which the Figma anatomy calls the container.
- This record resolves IDEA-003#24 and IDEA-011#06.
