---
id: IDEA-002
status: define # define | specced | done | parked
result: # with status: done, the DEC-NNN or the commit SHA this idea produced
---
# IDEA-002: Design specs and tokens for 1.0

## Intent
- Outcome: a design spec for every component on the final list, made before any code. With Figma, the work also gives designers a way to use the system and a token pipeline with Figma as the source of truth.
- User: Peter decides. Designers use the result in their files, and IDEA-003 builds from the specs.
- Why now: 1.0 is built from specs, so the design of each component must be fixed before the Lit core starts.
- Success: Peter has chosen the medium; each listed component has a spec with anatomy and parts, variants, named sizes, states, tokens, slots and subcomponents, accessibility behaviour and motion; with Figma, the designer route and the token pipeline are decided.
- Constraint: no implementation happens in this idea. With Figma as the source, nobody maintains tokens by hand in code.
- Out of scope: the Lit core (IDEA-003), framework packages (IDEA-004), MCP and skills (IDEA-005), devtools (IDEA-006) and the documentation website (IDEA-007). IDEA-001 owns the component list.

<!-- After the user's explicit yes to this intent, add the line: Confirmed by <name> on <YYYY-MM-DD>. -->

## Destination
A spec for the design work: the chosen medium, the format of one design spec, the designer route and the token pipeline. Its plan then produces one design spec for each component.

## Notes
- Program rules: [IDEA-001, Program rules for all six ideas](IDEA-001-component-inventory.md#program-rules-for-all-six-ideas).

### Additional scope of 2026-11-13
Source: [Peter's additional scope](../design/v1-additional-scope.md) of 2026-11-13. IDEA-001, Notes, has the table of all items.

- Item 4, settled by Peter: "Build Figma the way we build code: reusable primitives and shared parts first, reused everywhere. Run as much as possible in parallel, but follow the dependency graph. Don't build everything in parallel blindly." It sharpens DEC-141, which asks for as many specs in parallel as possible, and it agrees with the dependency graph of DEC-142. The work is the deferred row 29.
- Item 2, settled by Peter: the blocks are in Figma in any case, "as a library designers can use (for example, the AI blocks for my resume site's chatbot design)". So this idea draws the blocks too, and row 30 imports their list. Open, in IDEA-007#12: whether Figma or code is the source of truth of a block.
- Item 2, settled by Peter: the documentation website is designed in Figma first. IDEA-007 owns the website and holds that step as its deferred row 14. The medium, the format and the design direction of this idea hold for that design.
- Item 1, evidence for the design spec of Code Block: it renders markdown as a stream and as static text, so its states include a stream that is not complete yet.
- Items 8 and 11: IDEA-008 (Claude Design) and IDEA-009 (design skill for Figma) are new. Both can need the Figma library and the token output of this idea.

### Waits
- Rows 06, 20, 26 and 28 — running since 2026-11-12, in the block of agent work that Peter approved. Each agent started without a name; its log records `claude-opus-5-5` and the effort `medium`. The list is in IDEA-001, Notes, "Block of agent work".
  - Row 06: done on 2026-11-12. Researcher agent `a278b8c98ca46fab4`, record RES-046.
  - Row 28: done on 2026-11-12. Researcher agent `a51af336d2021a7fa`, record RES-049.
  - Row 20: done on 2026-11-12. Task agent `afaf8c600aefa4a34`, task record RES-048, scratch folder `.artifacts/v1/trial/IDEA-002-20/`.
  - Row 26: the prototype is complete since 2026-11-12, and the row waits for Peter's choice. Task agent `a1f8073e09f49bbcb`; folder `.artifacts/v1/prototype/IDEA-002-26/` (scratch, outside git), with `IDEA-002-26-progress.md` and `IDEA-002-26-result.md`.
- Row 14 — wait: IDEA-001 reaches `done`.
- Row 25 — done on 2026-11-12: RES-041, from the researcher agent `af48e18cec0f3b798`, started without a name; its log records `claude-opus-5-5` and the effort `medium` on each request.

### Figma account
- Peter's Figma account has the team "ACME Labs" on the Professional plan, with a Full seat and the admin role (2026-11-12). The Figma MCP is signed in for this account.
- The account stays on Peter's personal address until ACMElabs has a work email address; the email address and the team owner can change later (RES-025).
- Peter stored a Figma access token in 1Password: the item "Figma Auth Token" in the vault "Personal". The MCP does not use it. The item gives 2027-02-01 as the expiry date. The token has 16 scopes; `file_variables:read` is not one of them (RES-028).
- Peter, 2026-11-12, during row 19: "there should be a figma token you can use from 1password". The agent used it for the six REST reads of RES-028 only. Another use needs its own reason in the row that needs it.
- Direction given on 2026-11-12: no Organization or Enterprise plan before rows 07 and 09 are decided. Not checked: how files move when a Professional team upgrades to Organization.

### Typefaces
- DEC-128, Peter, 2026-11-12: Google Sans Flex for text and Google Sans Code for code. The fact check behind the question used search excerpts, not the full pages. Sources: https://fonts.google.com/specimen/Google+Sans+Flex, https://fonts.google.com/specimen/Google+Sans+Code, https://design.google/library/google-sans-flex-font and https://en.wikipedia.org/wiki/Product_Sans. Google Sans Mono is the older fixed-width typeface of 2020, and Google Sans Code replaced it.

### Design direction step
- DEC-126 puts this step before the first Figma library. Rows 25 and 26 hold it.
- RES-041 is back, so rows 04, 05 and 27 are ready to ask. Facts from it for those rows:
  - For row 27: the Geist pages carry no license and no statement on reuse. Vercel's Terms of Service forbid derivative works "based on the Services" and do not name Geist or its pages. The Brands page covers trademarks only. The record draws no legal conclusion.
  - For row 27: Geist documents its colours (10 scales of 10 steps with a stated role for each step), 29 text styles and 8 materials. Its spacing scale, control heights, motion values, focus ring and status colours exist only in the CSS of Vercel's site, which is no published package and can change without notice.
  - For row 04: Radix Themes has five theme settings (accent colour of 26, gray of 6, panel background, scaling from 90% to 110%, radius from none to full). Chakra UI has a colour palette for each component. shadcn/ui has 7 base colours and one radius value. Geist has light and dark, and no accent, density or radius setting.
  - For row 05: Radix Colors names its contrast method (APCA) and guarantees its text steps. Geist claims "accessible text and icons" for steps 9 and 10 and states no ratio and no method. Chakra UI and shadcn/ui make no contrast claim. Chakra UI says that its animations play whatever the reduced-motion setting is; Radix Themes animates only when the user has no such preference.
- RES-041 reads Radix Themes at version 3.3.0; the inventory RES-034 names 3.1.3. The difference is not explained.

### Row 27 — resolved
- DEC-136, Peter, 2026-11-12: Geist's exact values go into the first Figma library, with no legal check. He selected this option against the agent's recommendation and with its cost in the option text. Row 26 decides what happens with the values that only the CSS of Vercel's site holds, and it checks Geist's text styles with Google Sans Flex.

### Row 04 — resolved
- DEC-137, Peter, 2026-11-12: the tokens carry light and dark, and custom themes. He selected both in the dialog and did not select density or accent choice.

### Row 05 — resolved
- DEC-138, Peter, 2026-11-12: WCAG 2.2 level AA; left-to-right and right-to-left; mouse, touch, keyboard and screen reader. Where one of Geist's exact values fails level AA, that value changes.

### Row 26 — the prototype is built, next: Peter's choice
- Open the page from the repo root with `open .artifacts/v1/prototype/IDEA-002-26/index.html`. It needs no server; the fonts load from Google Fonts. The view is set by `?variant=1|2|3|4&scheme=light|dark&dir=ltr|rtl`, and a floating bar changes it.
- What was built: one static page with 15 sample components under their DEC-135 names (Button, Icon Button, Input, Field, Select, Checkbox, Switch, Tabs, Badge, Alert, Card, Dropdown Menu, Tooltip, Code, Dialog), in four variants. 1: Geist as Vercel's site has it. 2: Geist's colours and materials with the sizes, spacing, radius and focus ring of Radix Themes 3.3.0. 3: the same with those of Chakra UI 3.38.0. 4: new values with a stated rule for each. All four use Google Sans Flex, Google Sans Code and Material Symbols as SVG. Each view shows a table of its values with the source of each.
- Observed in Chrome: the 16 views (4 variants, light and dark, both directions) render with no console message; a screenshot of each is in `screenshots/`. The main session looked at one screenshot on 2026-11-12 (variant 4, light, left-to-right); no person has inspected the page yet.
- Control heights as rendered, small / medium / large: variant 1, 32 / 36 / 40 px; variant 2, 24 / 32 / 40 px; variant 3, 36 / 40 / 44 px; variant 4, 32 / 36 / 40 px, equal to Geist's by its own rule.
- Variant 1 has gaps: nine values that neither Geist's pages nor the CSS of Vercel's site give, such as the padding of Card, Dialog, Tooltip and Alert and the space between a label and its input. The page marks each gap. Variants 2 and 3 have two gaps each, and variant 4 has none.
- Geist's text styles with Google Sans Flex: at one size the x-height is 3.8% lower than in Geist's own typeface, and the cap height is nearly the same. Geist's three largest headings set the line height equal to the size, below the content area of Google Sans Flex.
- The contrast list, from a script over 194 pairs in each scheme (`contrast.py`, all pairs in `contrast-results.md`), for DEC-138:
  - Each text pair of steps 9 and 10 passes 4.5:1 in light and dark.
  - Each border step (4, 5, 6) fails 3:1 in light, and 50 of 72 fail in dark. Where a border is the only sign of a control, as on Geist's Input and on its unchecked Toggle, that is a failure of level AA.
  - Text that fails: the link colour blue-700 (4.44:1 in light), white on blue-700, white on red-700, and five Badge fills in light.
- Choices of the agent inside the brief, for Peter's review: variants 2 and 3 keep Geist's text styles and motion; variant 4 takes its motion values from Material 3's tokens and sets letter spacing to 0, because the typeface has an optical size axis.
- Two facts about the source that bear on DEC-136: Vercel's site serves two stylesheets with different values for the same colour names (for example red-700), and the difference is not explained; the prototype uses the set that RES-041 read. Geist uses blue for success.
- Limits: Chrome only; no forced-colours mode and no reduced-motion setting; right-to-left with Latin text only.
- The prototype recommends nothing, and its result file has no question for Peter.
- Pending question, asked on 2026-11-13 through the question dialog, with the page opened in his browser first: which variant is the base for the look of 1.0? Options: "Variant 4: new rules (Recommended)"; "Variant 1: Geist as it is"; "Variant 2: Radix Themes sizes"; "Variant 3: Chakra UI sizes". The question says that he can type a mix. The agent recommends variant 4 on the measured facts: no gap, a stated rule for each value, and text styles made for Google Sans Flex; its stated cost is that no shipped system has proved the values. The question says that the look is his call. The colours of Geist that fail level AA are the same in all four variants; they follow as a point of their own.
- The fixed inputs of the prototype: Geist's exact values where a part comes from Geist (DEC-136); Google Sans Flex and Google Sans Code (DEC-128); light and dark, with custom themes (DEC-137); level AA and both reading directions (DEC-138); Material Symbols (DEC-123). The open parts: spacing, control heights, motion and focus ring, which Geist does not document; the text styles with the new typeface; each colour of Geist that fails level AA.

### Row 06 — resolved
- RES-046, 2026-11-12, from Figma's documentation, with no Figma call. Facts from it for row 07:
  - A published library: a designer adds it to a file. A new version shows a badge in each file, and a person with edit access clicks Update. Nothing updates by itself on any plan.
  - A designer of an outside team needs view access to the library file, which costs no seat. Figma documents a second way for one outside team, the connected folder; the Professional plan allows three.
  - A custom plugin on the Professional plan can be published only to the Figma Community, for everyone, after one review by Figma. A private plugin needs Organization or Enterprise (RES-024).
  - Components that a plugin draws into a file are local to that file and get no updates. A plugin can also insert the components of a published library by key; those update as library instances. So a plugin that stays in sync needs the published library too.
  - A Community file gives a copy. A copy never gets an update.
  - A brand of its own for an outside team: extended collections need Enterprise. On Professional a brand is another mode, another collection or another library. This bears on custom themes (DEC-137).
  - Open, and no documentation settles it: how a designer of another team, with view access only, finds the library and adds it in a file of that team. A live test with a second Figma account settles it. It is under "Not yet specified".

### Row 12 — resolved
- DEC-141, Peter, 2026-11-12: agents make the design specs in parallel, as many at one time as possible, and he approves once, when all are complete. His words: "option 1 - they can all be created in a parallel - or as much in parallel as possible - I approve when all are completed".
- Effect on row 13: no approval comes before the last spec, so the format of one spec must be exact before the first spec is drawn.

### Row 13 — resolved
- DEC-142, 2026-11-12. Peter's words: "can also be multiple specs - specs also have a deps graph so its clear when/what can be doen in parallele". He chose none of the three options. The record keeps apart what he decided (more than one spec is allowed; the specs name what they depend on) and what the agent chose and told him (the twelve items of one design spec, and where each sits in Figma).

### Row 10 — partial
- Settled by DEC-120: a token change reaches the repo when a browser agent or a person runs "Export modes"; no CI job reads token values on the Professional plan.
- Question of 2026-11-12: one flow for the three open points. Peter asks an agent; the agent runs the export in Figma through the browser and opens a pull request; Peter merges it; the tokens take the version of the package release. Options: "Pull request, package version (Recommended)"; "Direct commit, package version"; "Pull request, own token version".
- Answer, Peter, 2026-11-12, typed into the question dialog: "I don't mind there beign like an internal skill that tells an agent how to do this for internal dev work - but i think maybe it should be a script that can be run possibly via npm script or something - how do other libs do this part with figma - should research this".
- Settled: an internal skill that tells an agent how to bring the tokens in is acceptable for the work of the maintainers. Conditions: none stated.
- His leaning, no decision: a script that a package script starts.
- A fact that limits such a script, which the agent told him: on the Professional plan no script can read the variables out of Figma, because the Variables REST API needs the Enterprise plan (RES-024). A script can do every step after the export: take the exported files, build the token output and show what changed.
- Open: the flow, who starts it, and the versions. Row 28, the research that he asked for, is resolved by RES-049.
- Facts from RES-049 for the question, from the public repositories of nine design systems that author tokens in Figma:
  - Four read Figma's REST API from a script or a CI job, and that route needs the Enterprise plan. Three use Tokens Studio. One runs a plugin of its own by hand. Three use the native "Export modes", and in each of them a person takes the files out of Figma.
  - No system states that it runs its route on the Professional plan.
  - Seven land a token change through a pull request. One commits directly.
  - All version tokens with a package: six in a token package of its own, three inside the main package. None takes a version from Figma.
  - On the Professional plan a script cannot read the variables and cannot start the export. Once the exported files exist, a script can do each later step: place the files, check the modes, build the output, show what changed, and open the pull request.
  - Four more systems author tokens in code and push them to Figma. That direction is against the constraint of this idea.
- Next: ask row 10 again with these facts.

### Row 20 — resolved
- RES-048, 2026-11-12: the trial with the 16-variable export of RES-028. Facts from it for row 11:
  - Style Dictionary 5.8.0 and Terrazzo 2.10.0 both read the files of "Export modes" with no edit and no extra plugin.
  - Neither tool reads the two files as two modes by itself. Style Dictionary needs one build for each mode file. Terrazzo needs one resolver file that names the two files.
  - An alias: Terrazzo writes `var()` by default; Style Dictionary writes the resolved value unless `outputReferences` is on.
  - A number has no unit in the CSS of both tools (`--radius-small: 4;`). Both keep Figma's scopes in memory, so a custom transform could add the unit. Row 11 owns that point.
  - A boolean becomes 1 or 0. A string is written without quotes.
  - Neither tool uses the code-syntax names from Figma for the variable names; both take the token path.
  - Not tried: an alias to a variable in another collection, and a collection with one mode. The export held neither.

### Facts that shape later rows
- RES-024: the Variables REST API needs the Enterprise plan. A private plugin needs Organization or Enterprise. A library can be published from Professional upward.
- RES-023 and RES-024 disagree on variable modes for each collection. RES-023 takes 1, 4 and 40 from the plugin files. RES-024 takes 10, 20 and unlimited from Figma's pricing and plan pages of 2026-11-12, and row 15 owns plan facts.
- Writing through the MCP is free in beta and becomes a usage-based paid feature. Figma gives no price and no date.
- RES-026: the W3C design tokens format has a stable version, 2025.10. Figma's variable import requires it. Style Dictionary 5.8.0 supports it in part; Terrazzo 2.10.0 claims full support.
- RES-027: Figma can tell a server about changes through webhooks on the Professional plan (file update, named version, library publish). A pipeline can also poll the file's version.
- RES-026 found a Figma post of 2025-10-28 that calls the MCP server "out of beta and generally available". RES-023 marks that point as unverified.
- Rows 10 and 18 shared one question: must the pipeline run unattended, or may an agent run it on demand? DEC-118 answers it for the spec: an agent pulls on request. Row 10 still asks how token changes reach the repo and how they are versioned. No source shows the Figma MCP running in CI without a person's sign-in.
- The delegated agents of 2026-11-12 ran on Opus 5.5 at `xhigh` effort, not medium; see the note in the capabilities file.
- Peter, 2026-11-12: "the agents can use the browser to make updates to Figma". This covers steps that the MCP cannot do, such as publishing a library.
- RES-025: the live trial passed with 11 calls, about 4 minutes and no error. No person has inspected the trial file yet. Open: whether `use_figma` counts against the rate limit.
- RES-028: `get_design_context` gives an agent the annotations and the component descriptions, but it changes bold and italic marks and drops pinned properties. Exact text needs a `use_figma` script.
- RES-028: `use_figma` cannot read or add dev resources. The REST endpoint for dev resources answers on Professional.
- RES-028: the trial file now also holds read fixtures: a rich-text description, three annotations, one embedded Spec and three more variables.

### Icons
- DEC-123, Peter, 2026-11-12: 1.0 has an Icon component, the icon library makes one component for each icon with it, and the icons come from Material Symbols. He named the variations of Material Symbols as a point to consider. Rows 21 and 22 hold that point. Second message, same day: "also that icon component should be rendering svgs, not a font-icon". Row 22 can therefore choose only among variations that exist as SVG.
- Row 21 is resolved by RES-040. Facts for row 22: Material Symbols has the styles Outlined, Rounded and Sharp. As SVG files each icon exists in 7 weights (100 to 700), 3 grades (-25, 0, 200), filled and unfilled, and 4 sizes (20, 24, 40, 48 px): 168 files for each style. No file exists between those steps. Google publishes no npm package for the set; the license is Apache-2.0. The count of icons is about 4,000 and differs by source.

### Evidence from other ideas
- DEC-145 (IDEA-006#06), for row 11: devtools exports a custom theme as a theme file, so the token output must define the format of that file.
- DEC-133, DEC-134 and DEC-135 (IDEA-001 rows 07 and 08): the 1.0 list holds 145 concepts, and each has its final name. Progress is one component with a linear and a circular shape. Their names and parts are still open in IDEA-001, so row 14 still waits. The number sets the size of the design work: one design spec for each.
- DEC-131 (Peter, 2026-11-12), for rows 11 and 13: the layout components take style props with responsive values, as in Chakra UI. So the breakpoints are tokens, and the design spec of a layout component lists its style props. IDEA-003 rows 14 and 15 hold the mechanism.
- DEC-119 (IDEA-001#03): 1.0 serves ACME Labs applications, AI-written artifacts, outside teams and marketing and content sites. It is evidence for rows 03, 04 and 05 and settles none of them. Outside teams bring their own brand, which bears on custom themes in row 04.

### Settled by the prompt
- A design spec covers anatomy and parts, variants, sizes, states, tokens, slots and subcomponents, accessibility behaviour and motion.
- Peter decides between Figma and spec documents in the repo after he sees the trade-offs.
- With Figma, tokens are authored in Figma and exported to the repo. Research comes first for the designer route and for the token pipeline.
- The token options to evaluate include Figma Variables through the REST API, a plugin such as Tokens Studio, and the W3C design tokens format transformed by Style Dictionary or a newer tool.
- The token research covers how changes reach the repo (manual export, CI job or pull request), how they are versioned, and how they feed the Lit core and every framework package.

### Conditions
- Row 02 selected Figma (DEC-117), so rows 06 to 11 apply as written.
- Row 18 put the whole spec in Figma with an agent-run pull (DEC-118). Row 13 now also decides where each part of a spec sits in Figma.
- Row 03 made the 0.3.3 look the start (DEC-121) on 2026-11-12. On the same day DEC-125 took release 0.3.3 out as input and replaced DEC-121. Row 23 asked for the visual start again, with no 0.3.3 option, and DEC-126 answers it: a new design with Geist as the first reference.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | What can the Figma MCP read and write today (components, variants, variables, libraries), and what are its limits? | research | resolved | — | [RES-023](../research/RES-023-figma-mcp-capabilities.md) |
| 02 | Are the design specs made in Figma through the Figma MCP, or as spec documents in the repo? | interview | resolved | 01, 15, 16 | [DEC-117](../decisions/DEC-117-design-specs-in-figma.md) |
| 03 | What is the visual starting point for 1.0: the 0.3.3 look, the look of one reference system, or a new design? | interview | superseded by 23 | — | — |
| 04 | Which theme dimensions must the tokens carry (colour scheme, density, accent, custom themes)? | interview | resolved | — | [DEC-137](../decisions/DEC-137-theme-dimensions-light-dark-and-custom-themes.md) |
| 05 | Which accessibility standard, reading directions and input modes do the specs target? | interview | resolved | — | [DEC-138](../decisions/DEC-138-accessibility-target-wcag-2-2-aa-both-directions.md) |
| 06 | How do a published Figma library and a custom Figma plugin each give components to designers, and how does each stay in sync with new versions? | research | resolved | 02 | [RES-046](../research/RES-046-figma-designer-routes.md) |
| 07 | Do designers get the system through a published library, a custom plugin, or both? | interview | open | 06 | — |
| 08 | Which routes export tokens from Figma to the repo, and how does each handle change flow and versions? | research | resolved | 02 | [RES-026](../research/RES-026-figma-token-export-routes.md) |
| 09 | Which token export route does 1.0 use? | interview | resolved | 08, 19 | [DEC-120](../decisions/DEC-120-token-export-route.md) |
| 10 | How do token changes reach the repo (manual export, CI job or pull request), and how are they versioned? | interview | open | 09, 28 | — |
| 11 | Which token files does the pipeline hand to the Lit core and the framework packages? | interview | open | 09, 20 | — |
| 12 | Who makes each design spec, and who approves it? | interview | resolved | 02 | [DEC-141](../decisions/DEC-141-agents-make-the-specs-in-parallel-one-approval.md) |
| 13 | What must one design spec hold before a component can be built from it? | interview | resolved | 02, 18 | [DEC-142](../decisions/DEC-142-design-spec-content-and-spec-dependencies.md) |
| 14 | Import the final component list from IDEA-001. | task | open | — | — |
| 15 | Which Figma plan and seat does each capability need (MCP use, variables and modes, library publishing, the Variables REST API, plugins), and what does each cost today? | research | resolved | — | [RES-024](../research/RES-024-figma-plans-and-prices.md) |
| 16 | What does a live trial of one component made through the Figma MCP show: the number of calls, the manual cleanup, the errors, whether `use_figma` counts against the rate limit, and whether a Starter account can write to its own drafts? | task | resolved | 15 | [RES-025](../research/RES-025-figma-live-trial.md) |
| 17 | Which routes can read the whole design spec of a component out of Figma into files in the repo, and what can each one read? | research | resolved | 02 | [RES-027](../research/RES-027-figma-spec-export-routes.md) |
| 18 | Does Figma hold the whole design spec, with the Markdown in the repo generated by a pipeline, or do the behaviour parts live in documents written in the repo? | interview | resolved | 17 | [DEC-118](../decisions/DEC-118-spec-source-figma-agent-pull.md) |
| 19 | What do live reads of the trial file return: the REST API with the access token, the MCP read tools, a `use_figma` read script for variables and for an embedded Spec, and the native "Export modes" file? | task | resolved | — | [RES-028](../research/RES-028-figma-live-reads.md) |
| 21 | Which variations does Material Symbols have today (styles, fill, weight, grade, optical size), in which formats and under which license? | research | resolved | — | [RES-040](../research/RES-040-material-symbols-variations.md) |
| 22 | Which variations of Material Symbols does 1.0 ship, and which of them can a consumer change on one icon? | interview | open | 21, 26 | — |
| 23 | What is the visual starting point for 1.0: the look of one reference system, or a new design? | interview | resolved | — | [DEC-126](../decisions/DEC-126-visual-start-new-design-geist-first.md) |
| 20 | Do Terrazzo and Style Dictionary read the files that "Export modes" writes, and what CSS does each write for two modes, an alias, a number with no unit, a string and a boolean? | task | resolved | 09 | [RES-048](../research/RES-048-token-tools-read-export-modes.md) |
| 24 | Which typefaces does 1.0 use for text and for code? | interview | resolved | — | [DEC-128](../decisions/DEC-128-typefaces-google-sans-flex-and-code.md) |
| 25 | What do the five reference systems define for colour, type scale, shape, spacing and sizes, elevation and motion, what does Geist leave out, and what do Vercel's terms say about the reuse of Geist's values? | research | resolved | — | [RES-041](../research/RES-041-look-of-the-reference-systems.md) |
| 26 | Which design direction does 1.0 take: for colour, type scale, shape, density and motion, what comes from Geist, what comes from another system and what is new? | prototype | open | 04, 05, 24, 25, 27 | — |
| 27 | Does 1.0 take Geist's exact values (colours, text styles, shadows), or its own values in a structure like Geist's, given that Vercel publishes no license for them? | interview | resolved | 25 | [DEC-136](../decisions/DEC-136-geist-exact-values-without-a-check.md) |
| 28 | How do other design systems bring token changes from Figma into their repo (a script, a plugin, a CI job or by hand), on which Figma plan, and how do they name token versions? | research | resolved | — | [RES-049](../research/RES-049-figma-token-change-flow-in-other-systems.md) |
| 30 | Import the list of the blocks from the idea that owns them, which is IDEA-007 on 2026-11-13. | task | open | — | — |

## Deferred rows
Rows of the spec phase, by [the workspace rule](../agents/workspace.md#deferred-rows). They are not open and not on the frontier. Each one moves into the spec of this idea when its spec phase starts.

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 29 | The build order in Figma: which reusable primitives and shared parts are made first, in which order do the components and the blocks follow from the dependency graph of DEC-142, and how many are made at one time? Peter, 2026-11-13: build Figma the way code is built, shared parts first and reused everywhere, in parallel as far as the graph allows, and not everything in parallel blindly. Source: his additional scope, item 4. | task | deferred | — | — |

## Not yet specified
- What "Export modes" writes for an alias to a variable in another collection, and whether it writes `com.figma.isOverride`. Other systems' exports hold both (RES-049, Follow-ups), and the trial export held neither (RES-048, Limits). It sharpens at row 11, when the first real collections exist.
- How a designer of another Professional team, with view access to the library file only, finds the library and adds it to a file of that team (RES-046, Follow-ups). It needs a live test with a second Figma account. It sharpens at row 07.
- How many design specs the agents draw at one time. DEC-141 asks for as many as possible; the limits of the Figma MCP are not known (RES-025). The plan settles it.
- Whether the design direction of row 26 needs one decision for each part of the look. It sharpens when the first samples are drawn.
- The dependency graph of the design specs, which DEC-142 asks for. The plan builds it when IDEA-001#09 has decided the parts.
- The layout of the pulled Markdown files in the repo, and what starts a pull. They sharpen after row 13.

## Out of scope
- The component list, names and part compositions. IDEA-001 owns them.
- How the Lit core reads the token files. IDEA-003#08 owns it.
- Framework packages (IDEA-004) and MCP and skills (IDEA-005).
- Theming controls in devtools. IDEA-006#06 owns them.
- Component code of any kind.
- Claude Design (IDEA-008) and the design skill for Figma (IDEA-009).
