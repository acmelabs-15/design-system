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
- Out of scope: the Lit core (IDEA-003), framework packages (IDEA-004), MCP and skills (IDEA-005) and devtools (IDEA-006). IDEA-001 owns the component list.

<!-- After the user's explicit yes to this intent, add the line: Confirmed by <name> on <YYYY-MM-DD>. -->

## Destination
A spec for the design work: the chosen medium, the format of one design spec, the designer route and the token pipeline. Its plan then produces one design spec for each component.

## Notes
- Program rules: [IDEA-001, Program rules for all six ideas](IDEA-001-component-inventory.md#program-rules-for-all-six-ideas).

### Waits
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
- Row 25 gives the facts: what each reference system defines for each part of the look, and what Geist leaves out.
- Row 26 is a prototype row, by the agent's choice: Peter chooses from sample components drawn in the candidate directions, because a look is judged by eye. It waits for rows 04 and 05: the direction must cover each colour scheme and density that the tokens carry, and the contrast target shapes the colours.
- Row 22 now waits for row 26, by the agent's choice: the style of the icons (Outlined, Rounded or Sharp) and their default weight are part of the look.

### Row 10 — partial
- Settled by DEC-120: a token change reaches the repo when a browser agent or a person runs "Export modes"; no CI job reads token values on the Professional plan.
- Source: DEC-120, decided by the agent on 2026-11-12 under Peter's delegation of the token route.
- Open: whether an export goes into the repo as a pull request or as a direct commit, who starts it, and how token versions are named.
- Next: ask Peter about those three points when row 10 is the most important question.

### Row 20 — next for the agent
- A trial with the two exported archives of RES-028, in `.artifacts/v1/trial/IDEA-002-19/`. It needs no Figma call. Create its task record before the first step.

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
- DEC-133 (IDEA-001#07): the 1.0 list holds 146 concepts. Their names and parts are still open in IDEA-001, so row 14 still waits. The number sets the size of the design work: one design spec for each.
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
| 04 | Which theme dimensions must the tokens carry (colour scheme, density, accent, custom themes)? | interview | open | — | — |
| 05 | Which accessibility standard, reading directions and input modes do the specs target? | interview | open | — | — |
| 06 | How do a published Figma library and a custom Figma plugin each give components to designers, and how does each stay in sync with new versions? | research | open | 02 | — |
| 07 | Do designers get the system through a published library, a custom plugin, or both? | interview | open | 06 | — |
| 08 | Which routes export tokens from Figma to the repo, and how does each handle change flow and versions? | research | resolved | 02 | [RES-026](../research/RES-026-figma-token-export-routes.md) |
| 09 | Which token export route does 1.0 use? | interview | resolved | 08, 19 | [DEC-120](../decisions/DEC-120-token-export-route.md) |
| 10 | How do token changes reach the repo (manual export, CI job or pull request), and how are they versioned? | interview | open | 09 | — |
| 11 | Which token files does the pipeline hand to the Lit core and the framework packages? | interview | open | 09, 20 | — |
| 12 | Who makes each design spec, and who approves it? | interview | open | 02 | — |
| 13 | What must one design spec hold before a component can be built from it? | interview | open | 02, 18 | — |
| 14 | Import the final component list from IDEA-001. | task | open | — | — |
| 15 | Which Figma plan and seat does each capability need (MCP use, variables and modes, library publishing, the Variables REST API, plugins), and what does each cost today? | research | resolved | — | [RES-024](../research/RES-024-figma-plans-and-prices.md) |
| 16 | What does a live trial of one component made through the Figma MCP show: the number of calls, the manual cleanup, the errors, whether `use_figma` counts against the rate limit, and whether a Starter account can write to its own drafts? | task | resolved | 15 | [RES-025](../research/RES-025-figma-live-trial.md) |
| 17 | Which routes can read the whole design spec of a component out of Figma into files in the repo, and what can each one read? | research | resolved | 02 | [RES-027](../research/RES-027-figma-spec-export-routes.md) |
| 18 | Does Figma hold the whole design spec, with the Markdown in the repo generated by a pipeline, or do the behaviour parts live in documents written in the repo? | interview | resolved | 17 | [DEC-118](../decisions/DEC-118-spec-source-figma-agent-pull.md) |
| 19 | What do live reads of the trial file return: the REST API with the access token, the MCP read tools, a `use_figma` read script for variables and for an embedded Spec, and the native "Export modes" file? | task | resolved | — | [RES-028](../research/RES-028-figma-live-reads.md) |
| 21 | Which variations does Material Symbols have today (styles, fill, weight, grade, optical size), in which formats and under which license? | research | resolved | — | [RES-040](../research/RES-040-material-symbols-variations.md) |
| 22 | Which variations of Material Symbols does 1.0 ship, and which of them can a consumer change on one icon? | interview | open | 21, 26 | — |
| 23 | What is the visual starting point for 1.0: the look of one reference system, or a new design? | interview | resolved | — | [DEC-126](../decisions/DEC-126-visual-start-new-design-geist-first.md) |
| 20 | Do Terrazzo and Style Dictionary read the files that "Export modes" writes, and what CSS does each write for two modes, an alias, a number with no unit, a string and a boolean? | task | open | 09 | — |
| 24 | Which typefaces does 1.0 use for text and for code? | interview | resolved | — | [DEC-128](../decisions/DEC-128-typefaces-google-sans-flex-and-code.md) |
| 25 | What do the five reference systems define for colour, type scale, shape, spacing and sizes, elevation and motion, what does Geist leave out, and what do Vercel's terms say about the reuse of Geist's values? | research | resolved | — | [RES-041](../research/RES-041-look-of-the-reference-systems.md) |
| 26 | Which design direction does 1.0 take: for colour, type scale, shape, density and motion, what comes from Geist, what comes from another system and what is new? | prototype | open | 04, 05, 24, 25, 27 | — |
| 27 | Does 1.0 take Geist's exact values (colours, text styles, shadows), or its own values in a structure like Geist's, given that Vercel publishes no license for them? | interview | open | 25 | — |

## Not yet specified
- The order and batch size of the component specs. The plan settles it.
- Whether the design direction of row 26 needs one decision for each part of the look. It sharpens when the first samples are drawn.
- How a design spec records responsive behaviour.
- The layout of the pulled Markdown files in the repo, and what starts a pull. They sharpen after row 13.

## Out of scope
- The component list, names and part compositions. IDEA-001 owns them.
- How the Lit core reads the token files. IDEA-003#08 owns it.
- Framework packages (IDEA-004) and MCP and skills (IDEA-005).
- Theming controls in devtools. IDEA-006#06 owns them.
- Component code of any kind.
