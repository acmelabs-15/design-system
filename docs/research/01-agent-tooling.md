# Research 01: Agent tooling

Status: historical research with dated implementation follow-ups. Converted 2026-10-21.

## Scope and current interpretation

The consumer skills, documentation/API MCP server and Intent development tooling were selected and implemented in the completed systematization pass. The authoring-only scope excludes runtime AI control. The [final evidence](../verification/systematization/m26-final/README.md) records acceptance at its tested scope; the 2026-09-19 probes below do not establish that later acceptance by themselves.

The findings below retain their original research dates, source versions, measurements and verification limits. Statements about current code describe the checkpoint in their section. A proposal or source survey is not a decision or runtime acceptance. The [current handoff](../STATUS.md) owns unfinished work; the closed pass's phase gates and delegation do not apply to new work.

## Findings and dated evidence


Checkpoint 2026-09-19, updated after the second guided review. **Selected:** [versioned consumer skills](../decisions/0019-consumer-skills.md), a [documentation/API MCP server](../decisions/0027-design-system-mcp.md), and [TanStack Intent development tooling](../decisions/0048-intent-tooling.md). [Live AI component control is outside this pass](../decisions/0003-ai-authoring-scope.md). No project tools or services have been installed.

## Existing capability at the 2026-09-19 checkpoint

docs-src/skill-reference.ts generates element guidance from the same Doc/API sources as the website. Its default destination is outside the repository in a local skill reference directory. The current npm files list does not package a versioned skill collection.

The proposed shared-fact sources were the selected CEM and documentation. Skills add choosing/composing/debugging/upgrading guidance that types alone cannot supply. The skill taxonomy and metadata/recipe retrieval interfaces remain for later review. The proposal kept consumer guidance separate from maintainers' workflow skills and the separate ask-user-question project.

## AG Grid AI Toolkit

The investigation read the functional sections of the [documentation](https://www.ag-grid.com/javascript-data-grid/ai-toolkit/) and the actual enterprise implementation files [structuredSchema.ts](https://github.com/ag-grid/ag-grid/blob/latest/packages/ag-grid-enterprise/src/aiToolkit/structuredSchema.ts), [schemaBuilder.ts](https://github.com/ag-grid/ag-grid/blob/latest/packages/ag-grid-enterprise/src/aiToolkit/schemaBuilder.ts) and [aiToolkitModule.ts](https://github.com/ag-grid/ag-grid/blob/latest/packages/ag-grid-enterprise/src/aiToolkit/aiToolkitModule.ts). The large embedded application examples and every feature builder were not read in full.

The module registers getStructuredSchema. Feature-specific builders contribute nullable state fields; the object builder produces required properties, additionalProperties:false and shared definitions. The feature map covers aggregation, filter, sort, pivot, column visibility, sizing and row grouping. Optional column descriptions add context. The application owns model calls, prompting and validation before applying state.

A source discrepancy matters when using this reference: the documentation's exclusion example names sorting, while the inspected implementation feature is sort. A structured schema is not proof of semantic correctness or authorization. The investigation did not recommend copying a second generic UI representation from this example.

Peter selected **authoring support only** after discussing a live “sort by revenue” interaction. Runtime AI control is outside this pass. No model endpoint, application-data transfer or runtime AI package is selected.

## AG Grid MCP server

The [documentation](https://www.ag-grid.com/javascript-data-grid/mcp-server/) describes version/framework-aware articles, API definitions, examples, search and migration/quick-start prompts.

Inspected the published ag-mcp 1.0.0 package: handlers/tools.js, handlers/resources.js, api/fetch.js, api/index.js and state/project.js. Its search and resources retrieve data from a separate versioned HTTP API. They do not inspect or control a running grid. Version detection saves project context; a default version/framework is used when none is set.

Specific lessons:
- The advertised tool is set_versions, while docs use set_version; the handler accepts both. The tool names must come from one tested contract rather than duplicated descriptions.
- Resources depend on current project/version context, while search allows overrides. Our installed-package and CDN-only artifact cases need explicit version resolution.
- The source falls back to React and a hard-coded grid version if detection/latest resolution is absent. That is not automatically a suitable default for our Lit-first system.
- The published client does not contain the full retrieval backend. Our indexing, storage, transport and hosting remain to design.

Peter explicitly requested the equivalent MCP alongside skills. This selects version-matched documentation/API/example assistance, not copying AG's package or its fallback/alias policies. No server was installed, configured, called or published.

## AG Grid skills

The investigation read [ag-dev](https://github.com/ag-grid/skills/blob/main/skills/ag-dev/SKILL.md), [ag-update](https://github.com/ag-grid/skills/blob/main/skills/ag-update/SKILL.md), ag-dev's full Grid recommendations and documentation index, and ag-update's determine-changes reference. The complete upgrade reference set and evaluation harness were not audited.

Useful patterns: establish the installed version/framework; consult source-matched documentation; prefer the library's actual feature over a custom imitation; capture console messages before initialization; record release changes separately from applying them.

AG's instructions were reference data. Its licensing, delegation, codemod, MCP and legacy-compatibility policies were not adopted as this project's instructions. The seven-phase process and replacement policy governed that completed pass. They are historical workflow context, not new-work instructions.

Peter selected versioned consumer skills. The exact authoring/framework/migration skill split and artifact-quality evaluations remain open. No SKILL.md or hooks were generated.

## TanStack Intent

The investigation read the [overview](https://github.com/TanStack/intent/blob/main/docs/overview.md), [maintainer guide](https://github.com/TanStack/intent/blob/main/docs/getting-started/quick-start-maintainers.md), [consumer guide](https://github.com/TanStack/intent/blob/main/docs/getting-started/quick-start-consumers.md), [trust model](https://github.com/TanStack/intent/blob/main/docs/concepts/trust-model.md), and validation/load command source.

Intent packages guidance with the release, discovers static skill files, supports explicit source permissions and validates structure/packaging. Its stale checks signal review; they do not prove that advice is wrong. Its hooks can observe a load command, not successful delivery, relevance or application by the agent. Policy behaviour differs by configuration/version; omitted permissions do not establish a universal deny-all policy.

Published 0.4.0 was tested under Bun 1.4.0 in a temporary directory:
1. An upstream fixture with top-level type failed validation.
2. Moving type under metadata passed structural validation, with three packaging warnings still reported.
3. Loading the installed fixture initially returned its installed 1.0.0 content, not the separately edited authoring copy.
4. After updating/reinstalling the fixture as 1.0.1, the loaded version and content matched.
5. An explicit empty allowlist refused loading.

[Probe evidence](../verification/systematization/intent-probe-2026-09-19.json). These are synthetic CLI tests, not a published design-system skill or a behavioural evaluation. Validation and loading are separate.

Peter selected Intent as development tooling. The recommendation included pinned/reviewed alpha upgrades, packaged-guidance validation and independent artifact tests. Intent does not replace the MCP implementation. Its optional setup/hooks are not approved for automatic modification of global or project instructions.

## Material Web comparison and remaining work

The inspected Material Web tree had no AGENTS.md/SKILL.md/MCP/agent or inspector/devtool entries matching the targeted search. This establishes the search result, not that every possible authoring aid is absent. Its metadata/docs remain implementation references; no equivalent agent platform was demonstrated.

The main adoption choices are resolved. At this checkpoint, skill taxonomy/evaluations, versioned sources, MCP transport/interfaces/hosting and release integration remained for the inventory and migration reviews. Those open implementation details did not reverse the selected skills/MCP/Intent direction.

## Complete tooling proposal

The [Phase 4 tooling contract](../../spec/SPEC-documentation-tooling.md) now proposes release-qualified documentation resources/tools, local stdio delivery, explicit version/framework resolution, shared generated API/example data and a concrete consumer-skill taxonomy. No runtime AI operations, project mutations, network model calls or global hook installation are introduced. These are reviewable proposals under selected capabilities, not shipped services or newly approved tool names.

### Whole-set approval and Phase 5 handoff

On 2026-09-20 Peter said “I approve all proposals.” The [approval record](../decisions/0049-inventory-approval.md) selects the complete set and the five stated recommendations. Earlier proposal/unselected statements above retain their historical evidence scope; current design status is approved. Peter subsequently [approved the migration plan](../decisions/0064-migration-approval.md) through “approved”. At the approval checkpoint, M00 technical prerequisites preceded dependent implementation and production implementation had not started. Later implementation and acceptance are recorded in the final evidence linked above. Approval alone was not a runtime result.

## Sources and limitations

Source provenance: notes/analysis/agent-tooling.md (the source path identifies the pre-migration record). The inline sources and saved evidence above retain their original scope. This conversion does not rerun their experiments.

- AG source naming discrepancies and bounded reads remain explicit.
- Intent fixture validation/loading does not prove behavior, statistical quality or effective hook delivery.
- Authoring support excludes live AI control, model endpoints and global hook/configuration changes.
