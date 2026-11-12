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

### Figma account
- Peter's Figma account has the team "ACME Labs" on the Professional plan, with a Full seat and the admin role (2026-11-12). The Figma MCP is signed in for this account.
- The account stays on Peter's personal address until ACMElabs has a work email address; the email address and the team owner can change later (RES-025).
- Peter stored a Figma access token in 1Password: the item "Figma Auth Token" in the vault "Personal". The MCP does not use it. The item gives 2027-02-01 as the expiry date. The token has 16 scopes; `file_variables:read` is not one of them (RES-028).
- Peter, 2026-11-12, during row 19: "there should be a figma token you can use from 1password". The agent used it for the six REST reads of RES-028 only. Another use needs its own reason in the row that needs it.
- Direction given on 2026-11-12: no Organization or Enterprise plan before rows 07 and 09 are decided. Not checked: how files move when a Professional team upgrades to Organization.

### Row 18 — partial, question pending
- Settled: Peter prefers one source. All of a spec goes in Figma, and a pipeline pulls what the repo needs into Markdown files, with a conversion step where necessary. He is not worried about the beta and price risk of Figma.
- Source: Peter's reply of 2026-11-12 to the row 02 question: "all of it should go in Figma and then we should basically leverage the Figma API to create like a pipeline where those... things that are needed in the repo get pulled down into Markdown files", "that would be one way to have a single source for updating", "I'm not worried about the beta and price risk".
- Conditions: he worded it as a thought ("I'm wondering if"), and he was not sure which tools exist.
- Facts now in RES-027: his direction is workable. An agent that reads through the Figma MCP can pull every kind of spec content, also Figma Specs documents as Markdown, rich-text descriptions, motion and variable values. An unattended CI job with the access token reads less: structure, variants, properties, plain-text descriptions, one plain annotation for each node and text layers; it reads no Specs document, no rich text and no variable values. Figma ships no command-line tool for export; its `figma` command serves Code Connect only.
- Live results in RES-028, 2026-11-12: the MCP returned the Spec as Markdown, the rich-text description, the annotations with their categories and the variable values for both modes. The REST API returned the description and the annotations as plain text without categories, the variable bindings as IDs, and for the Spec only its title and empty nodes. The Variables endpoint answered 403.
- Open: Peter's confirmation of the single source, and the shape of the pipeline: run by an agent through the MCP on demand, or unattended in CI through the REST API with the limits above.
- Pending question, asked on 2026-11-12 after row 19: where does the whole design spec live? Options: all in Figma with an agent-run pull through the MCP (recommended, because it is the one option that keeps one source for the whole spec); all in Figma with a CI pull through the REST API and plain-text behaviour notes; behaviour documents written in the repo.

### Row 09 — delegated, not decided yet
- Peter delegated the token route on 2026-11-12: "we want the Figma tokens to get pulled into the design system code base via whatever method makes the most sense. I think Figma has a couple different options for doing that."
- Scope: the agent chooses the route after rows 08 and 19, records the decision, and tells Peter. It does not ask him again unless the choice needs a purchase or a higher plan.
- Facts in RES-026: on the Professional plan no route reads variable values unattended. The routes that work there: a `use_figma` read script run by an agent, Figma's own "Export modes" JSON run by a person or a browser agent, a custom plugin, and plugins such as Tokens Studio (Team plan: 39 euros a month for each editor). The Variables REST API runs unattended and has an official GitHub example, but it needs Enterprise, which is outside the delegation.
- Leaning, not a decision: an agent reads the variables through the MCP and writes files in the W3C design tokens format, version 2025.10; Terrazzo or Style Dictionary turns them into CSS custom properties and TypeScript. It costs nothing more, and the same route reads the spec content.
- Both checks are done in RES-028. "Export modes" writes one DTCG 2025.10 file for each mode, with aliases as `{group.name}` references and Figma's IDs, scopes and code syntax in `$extensions`; a browser agent ran it with two clicks. A `use_figma` script reads the values for each mode in Figma's own JSON, about 345 bytes for each variable, so a large set needs several calls and a conversion to DTCG.
- Not decided yet: both candidate routes need an agent or a person. The choice waits for Peter's answer to row 18, because that answer says whether a pull may need an agent. If he requires an unattended pull, no route on the Professional plan gives token values, and the delegation does not cover a higher plan.

### Facts that shape later rows
- RES-024: the Variables REST API needs the Enterprise plan. A private plugin needs Organization or Enterprise. A library can be published from Professional upward.
- RES-023 and RES-024 disagree on variable modes for each collection. RES-023 takes 1, 4 and 40 from the plugin files. RES-024 takes 10, 20 and unlimited from Figma's pricing and plan pages of 2026-11-12, and row 15 owns plan facts.
- Writing through the MCP is free in beta and becomes a usage-based paid feature. Figma gives no price and no date.
- RES-026: the W3C design tokens format has a stable version, 2025.10. Figma's variable import requires it. Style Dictionary 5.8.0 supports it in part; Terrazzo 2.10.0 claims full support.
- RES-027: Figma can tell a server about changes through webhooks on the Professional plan (file update, named version, library publish). A pipeline can also poll the file's version.
- RES-026 found a Figma post of 2025-10-28 that calls the MCP server "out of beta and generally available". RES-023 marks that point as unverified.
- Rows 10 and 18 share one question that only Peter can answer: must the pipeline run unattended, or may an agent run it on demand? No source shows the Figma MCP running in CI without a person's sign-in.
- The delegated agents of 2026-11-12 ran on Opus 5.5 at `xhigh` effort, not medium; see the note in the capabilities file.
- Peter, 2026-11-12: "the agents can use the browser to make updates to Figma". This covers steps that the MCP cannot do, such as publishing a library.
- RES-025: the live trial passed with 11 calls, about 4 minutes and no error. No person has inspected the trial file yet. Open: whether `use_figma` counts against the rate limit.
- RES-028: `get_design_context` gives an agent the annotations and the component descriptions, but it changes bold and italic marks and drops pinned properties. Exact text needs a `use_figma` script.
- RES-028: `use_figma` cannot read or add dev resources. The REST endpoint for dev resources answers on Professional.
- RES-028: the trial file now also holds read fixtures: a rich-text description, three annotations, one embedded Spec and three more variables.

### Settled by the prompt
- A design spec covers anatomy and parts, variants, sizes, states, tokens, slots and subcomponents, accessibility behaviour and motion.
- Peter decides between Figma and spec documents in the repo after he sees the trade-offs.
- With Figma, tokens are authored in Figma and exported to the repo. Research comes first for the designer route and for the token pipeline.
- The token options to evaluate include Figma Variables through the REST API, a plugin such as Tokens Studio, and the W3C design tokens format transformed by Style Dictionary or a newer tool.
- The token research covers how changes reach the repo (manual export, CI job or pull request), how they are versioned, and how they feed the Lit core and every framework package.

### Conditions
- Row 02 selected Figma (DEC-117), so rows 06 to 11 apply as written.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | What can the Figma MCP read and write today (components, variants, variables, libraries), and what are its limits? | research | resolved | — | [RES-023](../research/RES-023-figma-mcp-capabilities.md) |
| 02 | Are the design specs made in Figma through the Figma MCP, or as spec documents in the repo? | interview | resolved | 01, 15, 16 | [DEC-117](../decisions/DEC-117-design-specs-in-figma.md) |
| 03 | What is the visual starting point for 1.0: the 0.3.3 look, the look of one reference system, or a new design? | interview | open | — | — |
| 04 | Which theme dimensions must the tokens carry (colour scheme, density, accent, custom themes)? | interview | open | — | — |
| 05 | Which accessibility standard, reading directions and input modes do the specs target? | interview | open | — | — |
| 06 | How do a published Figma library and a custom Figma plugin each give components to designers, and how does each stay in sync with new versions? | research | open | 02 | — |
| 07 | Do designers get the system through a published library, a custom plugin, or both? | interview | open | 06 | — |
| 08 | Which routes export tokens from Figma to the repo, and how does each handle change flow and versions? | research | resolved | 02 | [RES-026](../research/RES-026-figma-token-export-routes.md) |
| 09 | Which token export route does 1.0 use? | interview | open | 08, 19 | — |
| 10 | How do token changes reach the repo (manual export, CI job or pull request), and how are they versioned? | interview | open | 09 | — |
| 11 | Which token files does the pipeline hand to the Lit core and the framework packages? | interview | open | 09 | — |
| 12 | Who makes each design spec, and who approves it? | interview | open | 02 | — |
| 13 | What must one design spec hold before a component can be built from it? | interview | open | 02, 18 | — |
| 14 | Import the final component list from IDEA-001. | task | open | — | — |
| 15 | Which Figma plan and seat does each capability need (MCP use, variables and modes, library publishing, the Variables REST API, plugins), and what does each cost today? | research | resolved | — | [RES-024](../research/RES-024-figma-plans-and-prices.md) |
| 16 | What does a live trial of one component made through the Figma MCP show: the number of calls, the manual cleanup, the errors, whether `use_figma` counts against the rate limit, and whether a Starter account can write to its own drafts? | task | resolved | 15 | [RES-025](../research/RES-025-figma-live-trial.md) |
| 17 | Which routes can read the whole design spec of a component out of Figma into files in the repo, and what can each one read? | research | resolved | 02 | [RES-027](../research/RES-027-figma-spec-export-routes.md) |
| 18 | Does Figma hold the whole design spec, with the Markdown in the repo generated by a pipeline, or do the behaviour parts live in documents written in the repo? | interview | open | 17 | — |
| 19 | What do live reads of the trial file return: the REST API with the access token, the MCP read tools, a `use_figma` read script for variables and for an embedded Spec, and the native "Export modes" file? | task | resolved | — | [RES-028](../research/RES-028-figma-live-reads.md) |

## Not yet specified
- The order and batch size of the component specs. The plan settles it.
- The icon set and the motion system. They sharpen after row 03.
- How a design spec records responsive behaviour.

## Out of scope
- The component list, names and part compositions. IDEA-001 owns them.
- How the Lit core reads the token files. IDEA-003#08 owns it.
- Framework packages (IDEA-004) and MCP and skills (IDEA-005).
- Theming controls in devtools. IDEA-006#06 owns them.
- Component code of any kind.
