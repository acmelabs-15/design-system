---
id: DEC-153
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-002#26 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-041, RES-040] # the RES files this decision rests on
decided: 2026-11-20 by Peter
---
# DEC-153: The look of 1.0 starts from new values with a stated rule for each

DEC-126 put a design direction step before the first Figma library, and a prototype page showed 15 sample components in four looks. Peter chose variant 4 as the start for the look of 1.0: Geist's colours and materials, with new values for the type scale, the sizes and spacing, the shape, the focus ring and the motion, each from a stated rule. It is the only variant with no missing value, and its text styles are made for Google Sans Flex.

## Decision

Peter, 2026-11-20, selected "Variant 4: new values (Recommended)" in the question dialog, with the page open in his browser, and with no condition, no note and no mix.

- The question: "Which look is the start for the look of 1.0? You can also type a mix." It said that the look is the start for the work in Figma, and that his review in Figma (DEC-151) can still change it at the cost of new work in Figma.
- The option: "Each value has a stated rule, no value is missing, and the text styles are made for Google Sans Flex. Controls are 32 / 36 / 40 px, as in Geist. Cost: no shipped system has proved these values."

## The values of variant 4

The prototype is in `.artifacts/v1/prototype/IDEA-002-26/`, which is scratch and outside git. This table is the copy of its values that the repo keeps, from the result file of the prototype, read on 2026-11-20.

| Part | Rule | Values |
|---|---|---|
| Colour | From Geist (DEC-136) | Geist's 10 scales of 10 steps, in light and dark. Status: error is red, warning is amber, success is blue, each as step 900 on step 100 with a border of step 400. Focus colour: blue-700 in light, blue-900 in dark. |
| Materials | From Geist (DEC-136) | The surfaces base, menu, tooltip and modal: background-100 with Geist's shadow for each. |
| Typefaces | DEC-128 | Google Sans Flex for text, Google Sans Code for code. |
| T1 sizes | 14 px times 1.25 to the power n, rounded to the nearest even px, 12 px at least. 14 px is Geist's most used size. | 12, 14, 18, 22, 28, 34, 42, 54, 66 px |
| T2 line height of text | The multiple of 4 px nearest to the size times 1.43 | 12/16, 14/20, 18/24 |
| T3 line height of headings | The multiple of 4 px nearest to the size times 1.25, the content area of Google Sans Flex | 22/28, 28/36, 34/44, 42/52, 54/68, 66/84 |
| T4 letter spacing | The typeface has an optical size axis, which the browser sets to the font size | 0 at every size |
| T5 weights | The roles of Geist | 400 text, 500 buttons, 600 headings |
| S1 unit and space scale | The unit is the line height of body text, 20 px, divided by 5 | Unit 4 px. 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 px |
| S2 control heights | The line height of the label plus two times the vertical padding. Each reaches the 24 by 24 px target of WCAG 2.5.8. | 32, 36, 40 px (16 + 2×8, 20 + 2×8, 20 + 2×10) |
| S3 inline padding | Multiples of the unit | Button 12, 16, 20 px. Input and Select 12 px. Tabs 12 px. Menu item 8 px. Badge 8 px. |
| S4 Checkbox and Switch | From the line height of the label | Checkbox 16 px. Switch track 36 by 20 px, thumb 16 px with an inset of 2 px. |
| S5 Badge and Tooltip | From the 12 px label | Badge 20 px high. Tooltip padding 4 px and 8 px. |
| S6 surfaces | Multiples of the unit | Card 16 px. Alert 16 px with a gap of 12 px. Dialog 24 px. Menu 4 px with items of 32 px. Field gap 8 px. |
| R1 radius scale | 1 to 4 units | 4, 8, 12, 16 px and full |
| R2 controls | About a quarter of the 36 px height | Button, Input and Select 8 px. Checkbox 4 px. Switch and Badge full. |
| R3 nested surfaces | The radius of a surface is the radius of its item plus its padding | Menu 8 px. Card and Alert 12 px. Dialog 16 px. Tooltip 8 px. |
| F1 focus ring | One ring for every control. An outline stays visible in forced-colours mode, and 2 px is the thickness that WCAG 2.4.13 names. | Outline 2 px solid in the focus colour, offset 2 px |
| F2 invalid | No signal by colour alone (WCAG 1.4.1) | Border red-900, with an error icon and a text |
| M1 easing | From the motion tokens of Material 3 (Material Web 2.5.0); no overshoot | Standard `cubic-bezier(0.2, 0, 0, 1)`, enter `cubic-bezier(0, 0, 0, 1)`, exit `cubic-bezier(0.3, 0, 1, 1)` |
| M2 durations | The larger the surface, the longer; on the steps of Material 3 | State change 150 ms. Menu and Tooltip enter in 200 ms and exit in 100 ms. Dialog enters in 300 ms and exits in 150 ms. |
| M3 movement | One unit for small surfaces; Geist's scale for an overlay | Menu and Tooltip move 4 px while they fade. Dialog scales from 0.96. |
| M4 reduced motion | DEC-138 | `prefers-reduced-motion: reduce` sets every duration to 0 |
| Icon | The drawing of Material Symbols for 20 px (RES-040) | 20 px |

The 18 text styles, as size/line height and weight: Heading 66/84, 54/68, 42/52, 34/44, 28/36, 22/28, 18/24 and 14/20 at 600; Button 14/20 and 12/16 at 500; Label 18/24, 14/20 and 12/16 at 400; Copy 18/24, 14/20 and 12/16 at 400; Code 14/20 and 12/16 at 400.

## Considered Options

- Variant 1, Geist as Vercel's site has it. Nine values are missing there, such as the padding of Card and Dialog, and the three largest headings are tight with Google Sans Flex.
- Variant 2, Geist's colours with the sizes, spacing, radius and focus ring of Radix Themes: smaller controls, 24 / 32 / 40 px, and two missing values.
- Variant 3, the same with those of Chakra UI: larger controls, 36 / 40 / 44 px, and two missing values.

## What this record does not decide

- The values that replace Geist's colours that fail level AA. DEC-138 says that such a value changes. The contrast list of the prototype has them: each border step where a border is the only sign of a control, the link colour blue-700, white text on blue-700 and on red-700, and five Badge fills in light. They are the same in all four variants.
- Two facts about Geist's colours that the prototype found: Geist maps success to blue, and Vercel's site serves two stylesheets with different values for the same colour names. The prototype uses the set that RES-041 read.
- The deferred row IDEA-002#32 holds these three colour points.
- The values for the 130 components that the page does not show. They follow from the same rules, in their design specs.

## Consequences

- The values that only the CSS of Vercel's site holds no longer set the spacing, the control heights, the focus ring or the motion (DEC-136). Still from that CSS and from no documentation: the status colours, the focus colour, the weights by role and the scale 0.96 of a Dialog.
- No shipped system has proved these values. The first proof is the whole in Figma, which Peter reviews (DEC-151).
- The limits of the prototype stand: Chrome only, no forced-colours mode, no reduced-motion setting, right-to-left with Latin text only, and motion judged by eye.
- IDEA-002#22, the variations of Material Symbols, is free. The look of the documentation website follows these values (IDEA-007).
