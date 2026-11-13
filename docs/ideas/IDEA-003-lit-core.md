---
id: IDEA-003
status: define # define | specced | done | parked
result: # with status: done, the DEC-NNN or the commit SHA this idea produced
---
# IDEA-003: Lit core, composition-first

## Intent
- Outcome: Lit web components as the core implementation, on an architecture that lets every framework wrapper export a top-level convenience component and every subcomponent used to build it.
- User: Peter decides; this is his first Lit project. Developers compose custom versions from the subcomponents, and IDEA-004 wraps the core.
- Why now: Lit composes through slots, and React composes through children and context. The architecture must bridge both before any component is built.
- Success: Peter has chosen the architecture with its trade-offs explained; a prototype shows one component as `Stepper` and as `Stepper.Root`, `Stepper.Item` and `Stepper.Indicator` over the Lit core; a spec for the core build exists.
- Constraint: the architecture is settled with Peter before anything is built. Each Lit trade-off is explained in plain terms.
- Out of scope: framework packages beyond the prototype wrapper (IDEA-004), MCP and skills (IDEA-005), devtools (IDEA-006) and the documentation website (IDEA-007). The component list (IDEA-001) and the design specs (IDEA-002) are inputs.

<!-- After the user's explicit yes to this intent, add the line: Confirmed by <name> on <YYYY-MM-DD>. -->

## Destination
A spec for the Lit core build: the chosen composition architecture, with its decision records and prototype evidence. Its plan then builds the components from the IDEA-001 list and the IDEA-002 specs.

## Notes
- Program rules: [IDEA-001, Program rules for all six ideas](IDEA-001-component-inventory.md#program-rules-for-all-six-ideas).
- Standing preference: before each architecture question, explain the Lit concept and the trade-off in plain terms. Peter has not used Lit before.

### Additional scope of 2026-11-13
Source: [Peter's additional scope](../design/v1-additional-scope.md) of 2026-11-13. IDEA-001, Notes, has the table of all items.

- Item 3, settled by Peter: the logic of the utilities and hooks lives in the Lit core, and the core exports it for users of plain web components. Each framework package exposes it as hooks, plain utilities or both (IDEA-004#09). Row 16 imports the list from IDEA-001, and row 17 decides the form of the export.
- Item 3, his words on the order: "Design this from the core up, alongside the composition, props and slots model, accounting for how web components and React differ." The agent's reading, which it told him: the choice of row 05 does not wait for the inventory, because the prototype holds the logic in one module with no DOM access in all three candidates. Row 17 follows row 05 and the inventory. He can ask for the inventory first.
- Item 1, settled by Peter: Code Block is built on TanStack Markdown and TanStack Highlight, and it renders markdown as a stream and as static text. The research and the integration are the deferred rows 18 and 19. Evidence for row 07: he accepts packages of TanStack as the base of one component.
- Item 7: IDEA-010 holds the research on build tools and CI. The fog here on the build tooling of the core waits for it.

### Waits
- Rows 05 and 14 — running since 2026-11-12, in the block of agent work that Peter approved. Each agent started without a name; its log records `claude-opus-5-5` and the effort `medium`. The list is in IDEA-001, Notes, "Block of agent work".
  - Row 05: the prototype is complete since 2026-11-12, and the row waits for Peter's choice. Task agent `afbdfc01151967238`; folder `.artifacts/v1/prototype/IDEA-003-05/` (scratch, outside git), with `IDEA-003-05-progress.md` and `IDEA-003-05-result.md`.
  - Row 14: done on 2026-11-12. Researcher agent `aa4269e9b3b3956e9`, record RES-045.
- Rows 01 and 02 — done on 2026-11-12: RES-042 from the researcher agent `ae3a841db00a620a6` and RES-043 from the researcher agent `a8a44290116cb20e5`. Both started without a name when DEC-127 resolved row 04; their logs record `claude-opus-5-5` and the effort `medium` on each request.
- Row 05 — the prototype is built; next: explain the mechanisms of RES-043 and the result to Peter in plain words, and ask for his choice. Open the page from the repo root with `python3 .artifacts/v1/prototype/IDEA-003-05/serve.py & sleep 1 && open http://localhost:4731/`. It needs the network, because Lit and React load from a CDN.
  - What was built: one Steps component in three candidates over one logic module with no DOM access, and a React 19 wrapper for each. A: the parts are elements, and each part asks the root for the state through context. B: the parts are elements, and each parent reads its slot and hands the state to its parts. C: one element with all parts in its shadow DOM, styled through `::part`.
  - Observed in Chrome 157, all 24 cells (8 cases by 3 candidates), with no console error in any cell:
    - A works in all eight cases with its repair on. With the parts defined before the root and the repair off, it fails with no message: the root counts 0 steps, and 19 parts have no state.
    - B fails when an element sits between a parent part and its child part: a `<div>` of the page author (case 3) and a wrapper of a React developer (case 8, custom composition). In case 3 the step numbers and the contents no longer match. It needs no repair for the order of definition.
    - C loses a wrapped item (case 3). It cannot take an element of the developer between two parts (case 8). Its wrapper can export only `Steps.Root` and `Steps.Item`, so the composed form that the prompt asks for cannot be made.
    - The same in all three: the keys and the accessibility tree (a tab list, tabs, a tab panel), right-to-left, a Steps inside another Steps, and an item added and removed.
  - Size of each shell: A 225 lines, B 199, C 116, over a logic module of 72 lines.
  - Limits: Chrome only; no screen reader and no touch; an outside label that points into C's shadow DOM was not tried; form participation was not tried.
  - The main session checked two cells again on 2026-11-12 in the browser, and both match the result file: case 3 for B (the root counts 2 steps, 4 parts with no state) and case 2 for A with the repair off (0 steps, 19 parts with no state, no console message).
  - The prototype recommends nothing, and its result file has no question for Peter.
- Row 05 — pending question, asked on 2026-11-12 through the question dialog, after all 14 results of the block were in: which architecture does the Lit core use? The question explains part and subcomponent, the three candidates and the observed results. Options: "A: context (Recommended)"; "B: slots"; "C: one element"; "Look at the prototype first". The main session recommends A, because it alone passed all eight cases and gives every subcomponent that the prompt asks for; its stated cost is the most code in each component and a repair that must always be installed. Peter closed the dialog on 2026-11-13 without an answer and sent his additional scope. The question stays pending.
  - Asked again on 2026-11-13 in a new session, with the same four options. Peter answered "huh?" in the dialog. That is no choice: he did not follow the question. The agent explains it again in chat in plainer words, with one markup example, and asks again with plainer labels: "A: parts ask the root (Recommended)"; "B: parents tell children"; "C: one closed tag"; "Show me the prototype". The letters name the same three candidates.
  - Answered in part on 2026-11-13, to the second ask: Peter made no choice and asked for research. "Row 05 — partial" below holds his words. No question on row 05 is pending.
- Row 14 — resolved by RES-045 on 2026-11-12. Facts from it for row 15:
  - Chakra UI 3 writes the CSS of a responsive value in the browser, with Emotion, while React renders. That is CSS-in-JS, which DEC-131 rules out. So 1.0 can take Chakra's syntax and not its mechanism.
  - Radix Themes ships one static CSS file with a class for each token value at each breakpoint, 812,667 bytes. React only sets class names. A value outside the token list goes into an inline custom property.
  - Four web component libraries take a value for each breakpoint from an attribute, in four shapes: one attribute for each breakpoint with script (Ionic); one attribute for each breakpoint with static CSS (Carbon); one attribute of tokens with a breakpoint prefix and static CSS (NVIDIA Elements); one attribute with a small query language that script turns into a style element (Shopify Polaris).
  - A limit of CSS: a custom property cannot set the width in a media query or a container query. So a breakpoint token reaches a query only as text that a build step or a script writes.
  - A second limit: CSS cannot turn a token name such as `4` into `var(--space-4)`. Each token value at each breakpoint needs its own rule, or script does the mapping.
  - Typed `attr()` and `if()` are not in every browser yet: `if()` is not in Firefox.
  - A React prop that is an object reaches a custom element as a property only when the element has that property; RES-029 holds React's exact rule, from React's source. Redact 0.3.1 writes each prop as an attribute (RES-029), so an object prop does not arrive there.
- Row 09 — wait: IDEA-001 reaches `done`.
- Row 10 — wait: IDEA-002 resolves its rows 11 and 13. Row 09 is resolved by DEC-120. DEC-141: Peter approves the design specs once, when all are complete, so the build of the components starts after that approval.
- Row 12 — wait: IDEA-002#22 decides the variations of Material Symbols. DEC-123 holds Peter's decisions that each icon is a component built with the Icon component, and that the Icon component renders SVG, not an icon font.

### Row 05 — partial
- Source: Peter's reply of 2026-11-13, typed into the question dialog. His words in full:

  > I'm not totally sure what the answer to this question is. What's important here, I think, is that the core of this is built with lit web components. But I also want to later, or also make React version of the design system. React leans into composition.
  >
  > I'm not sure web components are exactly the same. I know they use slots. But I'm not sure how that would work with, for example, a common pattern in React that I like and that I'd like to see in the React version of this library is all of the subcomponents of a component are exported by the library.
  >
  > But there's also a wrapper component that composes those subcomponents. And that is used in the cases where customization doesn't need to happen. When customization needs to happen, the subcomponents are accessed so that they can be composed with something custom. I'm not sure how this works with web components and lit.
  >
  > This is something we should likely do research on. I'd like to see how the React design systems we're looking at compose their components. Let's see what lit standards are around this. It's unclear to me how much of this should be done in the idea phase versus the spec phase.

- Settled: he makes no choice among A, B and C. He states the requirement of the prompt in his own words: the library exports all subcomponents of a component; a component that composes them serves "the cases where customization doesn't need to happen"; for a custom version a developer composes the subcomponents "with something custom". Conditions: none stated.
- Asked for by him: research on how the React design systems of the reference set compose their components, and on the standards of Lit for this. Rows 20 and 21 hold it, and row 05 waits for both.
- What the records already hold, so that the two rows do not repeat it:
  - RES-042 has Chakra UI: the parts share state through a React context, over a state machine that knows no framework. The package has no convenience component for a component with parts.
  - RES-043 has the mechanisms of Lit and Lit's own guidance: properties go down and events go up; a parent reads its slot; context is the documented way from a parent to its light DOM children when the parent cannot bind in a template. Its two examples from libraries, Material Web and Shoelace, both read the slot, which is candidate B.
  - The prototype built the pattern that he describes on Lit with React 19: a convenience `Steps`, and `Steps.Root`, `Steps.Item` and the other subcomponents. It works in candidates A and B (case 8, Chrome only). The agent told him this in chat on 2026-11-13.
- His open point: "It's unclear to me how much of this should be done in the idea phase versus the spec phase." The agent's placement, by the rule of DEC-147, which it told him:
  - Idea phase: rows 20 and 21, and the choice of what a developer can do with the parts (each part an element of its own or not; a part at any depth below its root, or direct children only). Reason: the review of the parts (IDEA-001#09), the wrappers (IDEA-004) and the examples of the website (IDEA-007) build on that choice.
  - Spec phase: the mechanism inside the chosen architecture, such as how a part finds its root and which setup a page needs. Reason: it settles how to build a decided thing. It becomes a deferred row when row 05 is decided.
- Evidence for row 06: he describes the convenience component as a component "that composes those subcomponents". He does not say where it lives.
- Term: he calls the convenience component "a wrapper component". The ideas use "wrapper" for the component of a framework package over a Lit element. In a message of the same day he says that the pattern has a name and sets the rule of DEC-148: a glossary term takes the standard name, and research finds it. So the agent assumes no name. Rows 20 and 21 record the names that the sources use. One sourced name is in the records: Chakra UI writes "open, compound components" for the parts and "closed components" for the ready-made form (RES-042). Until the results are in, the ideas keep "convenience component" and "subcomponent" as working words.
- Added by him on the same day, in two messages (DEC-149): 1.0 follows the best practices of Lit, of web components, of design systems and of React as far as possible, and the core supports the best practices of web components and of React at the same time. His test: "folks using the lit version of this design system shouldn't be surprised at how the components are built and put together. Same for the React folks, solid folks, etc."
  - It is the test for row 05 and for rows 06, 07, 11, 15 and 17.
  - A fact for the next ask of row 05: the two sides differ in the records so far. The two Lit libraries of RES-043 read the slot (candidate B). Chakra UI shares state through context (candidate A, RES-042). Rows 20 and 21 show whether that holds across the reference systems and across the Lit libraries.
  - The practices beyond composition are the deferred row 22.
- Open: the choice of the architecture.
- Next: run rows 20 and 21 in the next block of agent work, after his go. Then review both results with him in plain words, and ask row 05 again against the test of DEC-149.

### Settled by the prompt
- Lit web components are the core implementation.
- Every framework wrapper exports both the convenience component (for example `Stepper`) and every subcomponent (`Stepper.Root`, `Stepper.Item`, `Stepper.Indicator`), the way Chakra does.
- RES-042 corrects the last words: the package of Chakra UI 3 exports no convenience component for a component with parts. `Steps` is only a namespace for `Steps.Root`, `Steps.Item` and the others, and it cannot be used as a component. The convenience forms are snippets: files that Chakra's CLI copies into the consumer's project, which the consumer then owns. The requirement of the prompt, both forms from each wrapper, stands; Chakra UI is a model for the subcomponents and not for the convenience component. Peter has not yet seen this correction in a question; row 06 puts it to him.

### Evidence from other ideas
- DEC-119 (IDEA-001#03): 1.0 serves ACME Labs applications, AI-written artifacts, outside teams and marketing and content sites.
- Row 04 is resolved by DEC-127: 1.0 does not render on the server. Peter gave the answer in a message of his own on 2026-11-12. The evidence that content sites and outside teams often render pages on a server is in that record.
- For row 11: artifacts are often one HTML file that loads from a CDN, so 1.0 must work with no build step. DEC-119 states that need; row 11 decides the delivery.
- DEC-118 (IDEA-002#18): each design spec reaches the repo as Markdown that an agent pulls from Figma. Row 10 imports that format.
- RES-035 and RES-037 (IDEA-001#01), evidence for rows 01 and 06: the Chakra UI inventory marks 19 of 115 components as offered both as one ready-made component and as parts, 46 as parts only and 50 as one component.
- DEC-124 (IDEA-001#06), for rows 05 and 06: Peter decides the parts and the structure of each component by review, and he expects a mix of several systems. The architecture must not assume the structure of one reference system.
- DEC-128 (IDEA-002#24), for row 13: the typefaces are Google Sans Flex for text and Google Sans Code for code. Their license facts come from search excerpts; row 13 checks the license at its source first. Row 13 waits for row 11, because the delivery of the fonts follows the delivery of the components.
- DEC-133, DEC-134 and DEC-135 (IDEA-001 rows 07 and 08), for rows 05, 07 and 09: the 1.0 list holds 145 concepts, and each has its final name. The component that the prompt calls `Stepper` has the name Steps in 1.0. Some of them need an engine of their own, such as Calendar and Date Picker, Color Picker, Carousel, QR Code and Message Scroller. Portal is in the list, although it is a helper of React in the systems that have it.
- DEC-138 (IDEA-002#05), for row 05 and for the test strategy under "Not yet specified": the target is WCAG 2.2 level AA, both reading directions, and mouse, touch, keyboard and screen reader. The architecture must reach it inside shadow roots (RES-043).
- DEC-145 (IDEA-006#06), for row 08: devtools exports a custom theme as a theme file, so the styles must take a team's values from such a file.
- DEC-137 (IDEA-002#04), for row 08: the tokens carry two colour schemes, light and dark, and a custom theme replaces the brand colour, the typeface and the corner radius. So the styles must take the token values for each scheme, and a team's own values for the brand tokens.
- DEC-131 (Peter, 2026-11-12), for rows 14 and 15: the layout components take style props that work as in Chakra UI, responsive values included, and the Lit components have this too. 1.0 uses no CSS-in-JS. The values of such a prop are token values, so row 15 touches row 08.
- DEC-132 (Peter, 2026-11-12), evidence for row 06: he wants ready-made components in the system, because "a lot of these have nice to have props that make them easy to use - as well as state management built it". It does not answer where the convenience component lives.
- Peter's leaning, same message as DEC-131, for the build tooling under "Not yet specified": the styles are written in "css or the css module rather (scss I tink)". It is no decision.
- RES-042, for rows 05 to 07: in Chakra UI the state of a component lives in three layers. A Zag.js state machine owns the logic, the keyboard and the ARIA behaviour, with no framework. Ark UI puts the machine's API into a React context at the root, and each part reads it. Chakra UI adds only style.
- RES-043, for rows 05, 06 and 11:
  - A slot takes only the top-level children of its host. A part inside a wrapper element is not assigned, and the parent sees the wrapper. Events and context pass through a wrapper.
  - Context goes from an ancestor down, through a DOM event. A part that connects before its provider gets no value unless a `ContextRoot` or a second request repairs it. On a page with no build step that order depends on which `define()` runs first.
  - A reference by ID for ARIA works only inside one tree. Reference Target, which closes the gap into a shadow root, ships in Chromium only and is behind a flag in Firefox and Safari.
  - Lit ships single-file bundles for a page with no build step. Decorators need a compiler; each one has a form in plain JavaScript.
- RES-029 (IDEA-004#01), for row 06: none of six web component libraries exports a React component with members such as `Steps.Root`; each exports one flat component for each tag. So the export shape of the prompt has no model among them.
- RES-029 (IDEA-004#01), collected for row 04 before DEC-127 resolved it: Preact's server renderer does not write complex property values into the HTML; they reach the element at hydration. React's rule for properties on the server is not confirmed yet.

### Second block of agent work
- Row 20 — running since 2026-11-13, in the second block of agent work that Peter approved (IDEA-001, Notes, "Second block of agent work"). Researcher agent `ae81d7fa184fcddfd`, started without a name; its log records `claude-fable-5-2` and the effort `medium`. Its record is found by its `from`.
- Row 21 — running since 2026-11-13, in the second block of agent work that Peter approved (IDEA-001, Notes, "Second block of agent work"). Researcher agent `a833e86824310cc58`, started without a name; its log records `claude-fable-5-2` and the effort `medium`. Its record is found by its `from`.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | How does Chakra UI export a convenience component beside its subcomponents, and how do the subcomponents share state? | research | resolved | — | [RES-042](../research/RES-042-chakra-ui-composition-exports.md) |
| 02 | Which mechanisms does Lit give for composition between a parent and its parts (slots, light DOM children, context, shadow parts), and what are the limits of each? | research | resolved | — | [RES-043](../research/RES-043-lit-composition-mechanisms.md) |
| 04 | Must 1.0 render on the server? | interview | resolved | — | [DEC-127](../decisions/DEC-127-no-server-rendering-in-1-0.md) |
| 05 | Which composition architecture does the Lit core use? | prototype | open | 01, 02, 04, 20, 21 | — |
| 06 | Where does the convenience component live: as a Lit element in the core, in the framework wrappers only, or as a snippet that the consumer copies into the project? | interview | open | 05 | — |
| 07 | Which source gives the components their behaviour: state machine packages, ports of them, or our own logic? | interview | open | 05 | — |
| 08 | How do the token files from IDEA-002 reach the styles of the components? | interview | open | 05, 10 | — |
| 09 | Import the final component list from IDEA-001. | task | open | — | — |
| 10 | Import the design spec format and the token output from IDEA-002. | task | open | — | — |
| 11 | Which delivery lets one HTML page use 1.0 from a CDN with no build step, and does it cover every component? | interview | open | 05 | — |
| 12 | How does the icon library make one component for each icon from the Icon component, and how do the variations of an icon reach it? | interview | open | 05 | — |
| 13 | How do the typefaces of 1.0 reach a page: font files in the package, a link to Google Fonts, or the consumer's own loading? | interview | open | 11 | — |
| 14 | How do Chakra UI and Radix Themes turn style props with responsive values into CSS, and how can a custom element take a value for each breakpoint from an HTML attribute with no CSS-in-JS? | research | resolved | — | [RES-045](../research/RES-045-responsive-style-props-mechanisms.md) |
| 15 | Which mechanism do the style props of the layout components use in the Lit core? | interview | open | 14 | — |
| 16 | Import the list of utilities and hooks from IDEA-001. | task | open | — | — |
| 17 | In which form does the Lit core hold the logic of the utilities and hooks, and how does it export that logic for users of plain web components? | interview | open | 05, 16 | — |
| 20 | How do shadcn/ui, Radix Primitives, Radix Themes and Geist let a developer compose a component from its parts: which parts does each export, does a component that composes the subcomponents exist beside them and where does it live, how do the parts share state, and how does a developer wrap or replace a part? Which names do these systems, React's documentation and wider React writing give to this pattern and to its two forms, and what do they state as best practice for it? RES-042 holds the same facts for Chakra UI. | research | in-progress | — | — |
| 21 | How do Lit libraries and other web component libraries in wide use build a component with parts: which mechanism links a parent and its parts (the parent reads its slot, context, events, or one closed element), what happens to a part inside a wrapper element, and does any library offer one component as a ready-made form and as a composed form? What do Lit's documentation, its maintainers and the published best practices for web components state for such components, and which names do they use? RES-043 holds the mechanisms and two examples. | research | in-progress | — | — |

## Deferred rows
Rows of the spec phase, by [the workspace rule](../agents/workspace.md#deferred-rows). They are not open and not on the frontier. Each one moves into the spec of this idea when its spec phase starts.

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 18 | Code Block: which API do other components have that render code and markdown as a stream and as static text: their props, their events, how they take a stream, and how they highlight code? Peter asks for this research before the design of ours. Source: his additional scope of 2026-11-13, item 1. | research | deferred | — | — |
| 19 | Code Block: how are TanStack Markdown and TanStack Highlight built into the component, for streaming and for static rendering, in a Lit element that also works on a page with no build step? Source: the same item. | task | deferred | — | — |
| 22 | Which published best practices for custom elements, for Lit and for a component library of each framework target apply to the core beyond composition: attributes and properties, events, forms, registration and loading, styling hooks and accessibility? Where do the practices of web components and of React conflict? The findings become a checklist for the core build. Deferred by the agent: it settles how to build the decided core, and rows 20 and 21 hold the practices for composition, which change what is built. Source: Peter, 2026-11-13, DEC-149. | research | deferred | — | — |

## Not yet specified
These sharpen after row 05.

- The package layout and build tooling of the core. IDEA-010 holds the research on build tools and the plan for CI.
- Form participation, element names and registration.
- The test strategy and the browser matrix.
- What replaces `docs/agents/verification.md` and `docs/agents/repository.md`, which describe the 0.3.3 code. Brain's place for a quality bar is `CONSTRAINTS.md`; package facts belong to the 1.0 specs.

## Out of scope
- Row 03, retired on 2026-11-12: "How does the 0.3.3 core compose its components and build its React bridge, and which limits do its records name?" DEC-125 takes release 0.3.3 out as input.
- Which components exist (IDEA-001) and how they look (IDEA-002).
- Which wrapper targets ship, and how wrappers are generated and tested. IDEA-004 owns them. The prototype wrapper in row 05 proves the export shape only.
- MCP and skills (IDEA-005) and devtools (IDEA-006).
