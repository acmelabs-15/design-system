# Spec: Maintainer workflow migration

Status: approved by Peter on 2026-10-21 through “approved,” in reply to the specification-approval request. The [implementation plan](../tasks/done/maintainer-workflow/plan.md) and [task list](../tasks/done/maintainer-workflow/todo.md) are approved by Peter after all three plan-review questions. Current execution state belongs in [STATUS](../docs/STATUS.md).

This is one maintenance capability: a fresh agent finds the right context, follows the selected workflow, and leaves an accurate handoff. The sections below describe its parts, not separate product projects.

## Objective

Use agent-skills and brain as Peter uses them in the CLI and D&D projects. A fresh Claude or Codex session must find the current work without requiring the previous conversation.

Complete the migration to the new directory layout, names and document formats. Preserve decisions, rationale and evidence. Retire the old workflow and its competing instructions.

### Confirmed requirements

- Peter requests the same plugin-based workflow as the CLI and D&D projects, adapted to this monorepo.
- Peter explicitly requires the final records to use the new paths, names, content and formats. Keeping the old structure behind a new index is not the end state.
- Peter permits deletion of all five local skills. The plugin workflows replace them.
- Peter explicitly rejects preserving project-specific rules that contradict, collide with or confuse the new workflow.
- The existing two-context selection stands: component library and generation/comparison tools. Package count is not a reason to create five glossaries.

### Facts established

- The CLI is already a monorepo. Its shared status, specification index and current task list serve the CLI, presets and agent-guide work.
- Both reference projects use a real CLAUDE.md that imports AGENTS.md and adds Claude-specific skill routing.
- Both enable agent-skills and brain in project settings. Brain wins when both plugins provide the same skill.
- Both use local Markdown issues. Their standing commit/push permissions differ and belong to their own repositories.
- Here, CLAUDE.md is a symlink to AGENTS.md. There is no project plugin settings file, docs/STATUS.md, or current tasks directory at the research baseline.
- At commit 1b5d08a420f7f916b0c87b166527c60985937f4d, the mandatory startup corpus includes 114 decision files and 20 analysis files: 8,715 lines, before the pass README and PLAN.
- The old evidence tree contains executable acceptance drivers. The site also references existing decision and evidence paths. A complete migration must update these consumers.
- Authored website content is in site/ and generated output is in _site/. The former tracked docs/ snapshot is removed, so docs/ can hold maintainer documentation.

Sources and exact observations: [workflow research](../docs/research/20-systematic-approach.md#maintainer-workflow-migration-2026-10-21), [migration evidence](../docs/verification/workflow-migration/initial-research.json).

## Tools and commands

The inspected plugins are brain 0.6.0 and agent-skills 0.6.13. Their versions are observations, not a new permanent pin. The repository keeps its Bun 1.4.2 build and current dependencies.

Run these repository commands with the pinned runtime:

| Purpose | Command |
|---|---|
| Working-tree state | git status --short |
| Whitespace check | git diff --check |
| Static checks | bun scripts/check.ts static |
| Types | bun scripts/check.ts types |
| A changed unit-test file | bun test path/to/__tests__/file.test.ts |
| Full repository gate | bun run check |
| Build | bun run build |
| Website | bun run docs |
| Tool packages | bun run build:tooling |

Brain's Claude commands select the phase. Codex uses the corresponding installed brain skills. Host commands are recorded in host-specific guidance; a Claude slash command is not presented as a callable Codex tool.

## Document style

Use the target projects' concise status headings, numbered research and decision records, capability/specification index and checked task lists. Keep one current owner for each fact.

Project plugin settings use the same two marketplace sources and enabled-plugin entries as the reference projects. Preserve unrelated settings and the existing launch configuration. The new CLAUDE.md starts with the import below, then contains only Claude-specific guidance:

~~~text
@AGENTS.md
~~~

Rewrite current rules in plain language. A long original record can retain detailed evidence and qualifications under clearly named sections. Shortening a record is not permission to discard information.

## Workflow ownership

Brain owns the lifecycle: specify, plan, build, test, review and ship. Agent-skills remains enabled. Use brain's version of a shared skill, as the reference projects do.

Shared agent instructions own the startup and handoff contract. Claude-specific commands belong in CLAUDE.md. Codex receives the same shared rules through AGENTS.md.

The installed plugins provide workflow skills and conventions. The reference projects' own AGENTS.md files explicitly require reading and rewriting docs/STATUS.md. No inspected plugin skill or command names that status file. The continuity therefore needs the repository instructions; enabling the plugins alone does not recreate it.

Preserve the user-started command boundaries of the reference projects. Do not invent a background status-saving service or install new global hooks.

## Rule audit

Every old instruction receives one disposition in the migration ledger:

| Disposition | Use when | Result |
|---|---|---|
| Retain | It is a compatible, current product or implementation constraint | One authoritative place in the new structure |
| Rewrite | It is useful but mixes current facts with old process, paths or wording | Express only its compatible current meaning; retain evidence and provenance |
| Retire | It competes with the selected workflow, is obsolete, or repeats a plugin procedure | Remove it from active instructions; Git preserves its history |
| Resolve | Its current meaning or authority cannot be established | Record the exact conflict; do not silently promote it into the new rules |

The new workflow is the standard for this audit. A rule does not survive merely because it was called project-specific.

Examples to retire include the mandatory reading of every old note, the completed pass's phase gates, its local skill-routing table, and its task-specific execution delegation as permission for unrelated future work.

Bun, the selected package stack, generated-style ownership and shared Lit/React behavior are candidates for compatible constraints. Check each against the actual plugin guidance. Do not copy the whole old rules section as an exception to brain.

Preserve completed product decisions as decisions. Do not turn a dated claim or an old pass's permission into an evergreen rule. Do not infer new standing permission to commit, push, merge or publish from a grant in another repository.

## Target structure

The final structure follows the reference projects. Extra records serve the existing library and its verified release process.

~~~text
AGENTS.md                         shared startup, lifecycle and task-end rules
CLAUDE.md                         @AGENTS.md plus Claude-specific commands/routing
.claude/settings.json             both project plugins and their marketplaces
CONTEXT-MAP.md                    the existing two linked contexts
CONTEXT.md                        component terminology
tools/geist/CONTEXT.md            generation/comparison terminology
spec/README.md                   capability/specification index
spec/SPEC-<id>.md                 current specifications with explicit status
tasks/plan.md                    the approved current plan
tasks/todo.md                    its tasks and acceptance checks
tasks/done/<id>/                 completed plans and tasks
docs/STATUS.md                   the sole current handoff
docs/agents/                     domain, workflow, repository and verification guidance
docs/design/                     intent and interview records
docs/decisions/NNNN-<slug>.md     numbered decision records
docs/research/NN-<slug>.md        research notes
docs/research/README.md          research index
docs/releases/                   release summaries
docs/verification/               durable verification records and raw evidence
docs/history/                   completed pass and port history
.scratch/<effort>/               local issue/wayfinder records, when needed
scripts/verification/            active cross-package acceptance drivers and fixtures
~~~

There is one current status file and one current plan/task pair. Specifications describe capabilities, which may cross package directories.

The migration removes the old notes/ tree and root PLAN.md after every item has a new home or a justified retirement. It removes .agents/skills. There are no forwarding copies or symlinks that keep the old workflow active.

Already-correct paths, such as the two glossaries, can stay. Product source and package boundaries are not reorganized merely to resemble another repository.

## Mapping the existing material

| Existing material | Destination and treatment |
|---|---|
| Current section of notes/alignment/README.md | Rewrite as the short docs/STATUS.md handoff |
| Current product contracts and conventions | Reconcile into spec/ and the relevant development guidance; preserve approval provenance |
| notes/decisions/ | Numbered docs/decisions/ records, in brain's concise format; preserve original decision dates, reasons and supersession links |
| notes/analysis/ | Numbered docs/research/ notes and an index; separate conclusions, evidence, limits and dated history |
| Completed implementation plans and checklists | tasks/done/ with explicit completed scope; unresolved items become visible issues |
| Release summaries | docs/releases/ with links to their exact evidence |
| Saved results, screenshots, signatures and other raw evidence | docs/verification/; preserve original bytes and hashes |
| Executable checks and live fixtures inside the old evidence tree | scripts/verification/, with imports, runner references and output locations updated together |
| Historical phase reviews, prompts and the closed port plan | docs/history/ as historical information, not current commands |
| Compatible project rules from local skills | The appropriate new agent/development guidance, once each |
| The five local skill implementations | Delete; map their useful functions to the plugin skills |

Brain permits a short decision record: a title and one to three sentences, with optional sections when they add value. Converting the old records must not invent rejected alternatives or erase qualifications to force every note into the same shape.

A migration ledger maps every old path and section to its destination, status and disposition. Allocate numbered names once and keep them stable. Every existing file must be accounted for.

The initial tracked inventory has 930 files. Add records created during the migration to the ledger before the final coverage check.

Raw evidence remains raw evidence. Old paths inside an immutable historical payload can remain as recorded data. All live imports, links, build references and agent instructions must use the new paths.

Include public and external references in that ledger. Mutable GitHub release-note links can be updated with authorization. Published npm archives and signatures cannot be rewritten. Historical sources can use immutable commit/tag links where needed. Identify any reference that cannot be preserved under the selected final structure before deleting its target; do not silently claim that a local link scan covers published artifacts.

## Monorepo adjustments

| Area | Authored source and relevant relationship |
|---|---|
| Shared components and behavior | src/ and styles/; changes can affect all distributions and generated metadata |
| Core package | packages/core/package.json owns public metadata; delivery links point to the shared build |
| Browser package | Its manifest and delivery scripts package the same runtime, styles, workers and notices |
| React package | Authored bridge plus generated wrappers; core classes and metadata remain shared |
| MCP and Devtools | Their authored sources consume shared component, token and documentation metadata |
| Website and consumer skills | site/ and skills/; distinct from maintainer workflow instructions |
| Generation and verification | scripts/ and tools/geist/; generated files retain their existing owners |

Each task names the authored inputs, generated outputs, affected packages, dependencies and checks. Work starts from those facts, not by assuming each package has an independent source tree.

Keep the root workflow authoritative. Add package-local instructions only for a real local difference. A session started inside a package must still reach the root handoff.

Parallel workers receive explicit owned files and a result-file path. The coordinator updates the shared handoff and task state. Shared generator/build operations stay serialized.

The root consumer README is linked into the core package. Its maintainer navigation must point to repository documents without creating a second package README or broken package-relative links.

## Session behavior

### Start

1. Read docs/STATUS.md, the context map and the glossary for the task.
2. Read the specification index, active specification, plan and task list named by status. Read each selected file in full.
3. Read the repository/verification guidance and applicable decision and research records.
4. Inspect actual Git state and the pinned runtime. Identify changes owned by other sessions and leave them intact.
5. Establish the verification baseline from the exact revision and current check results. Run missing or invalidated checks.
6. Report the phase, last completed step, next step, failed checks and decisions awaiting Peter in five lines or fewer.
7. Follow Peter's current request. A generic request to continue resumes the next approved task. A new request does not silently overwrite an incomplete plan.

The rule is selective routing followed by complete reading. It is not permission to sample a selected document.

### Task end and handoff

1. Update the task's acceptance checks and specification when its facts change.
2. Record the exact commands, outcomes, revision and limits of verification.
3. Rewrite docs/STATUS.md with the next action, including an exact command when Peter must start it.
4. Record what is committed, uncommitted, pushed or waiting for approval. Use this repository's actual authorization.
5. Leave a new session able to resume without conversation history.

The old approved migration is completed. Its delegation is historical and does not authorize arbitrary future features or publication.

## Verification policy

Keep the full repository gate and the required browser/consumer checks. Use pinned Bun 1.4.2 rather than the CLI project's different runtime.

Follow brain's incremental-implementation policy: touched tests and types for each slice, then the full suite and review to close the task. The CLI's short baseline check cannot be copied as a promise that this repository's whole release suite is cheap. Reuse an existing baseline only when its revision, inputs and scope remain applicable; report contradictory results.

This changes when context is loaded, not what a release must prove. New code or changed verification drivers must satisfy their normal checks. Path moves must not introduce skips, weaker assertions, hidden failures or broad type/lint exceptions.

### Current baseline finding

On 2026-10-21, main is 1b5d08a420f7f916b0c87b166527c60985937f4d. Quality run 39516728235 passes. Documentation run 39516728504 fails component-browser acceptance and skips deployment.

Its saved artifact identifies one failing Chromium Tooltip-suite case: “Hover Card preserves native destination activation and never focuses its preview.” The observed fragment is empty; the expected fragment is #profile. The archive digest verifies. The cause is unverified.

Carry this into the new issue/status records. Do not call the baseline wholly green, assume the failure is a timing problem, or remove its assertion during migration. Repairing component behavior is a separate task unless investigation proves a migration dependency.

## Recommended execution sequence

This approved sequence bounds the detailed implementation plan. Approval of that task breakdown remains separate.

1. Inventory and classify every rule, record, executable check and reference. Produce the migration ledger and rule-conflict matrix.
2. Convert records by type into the new formats. Separate live checks from saved evidence. Keep the old entry point authoritative during preparation.
3. Update live consumers and switch the entry points together. Enable both plugins, replace the CLAUDE symlink with an import file, and make docs/STATUS.md the sole handoff.
4. Remove the old structure and five skills. Validate references, run the affected checks, test fresh sessions, and complete independent review.

The detailed approved plan belongs in tasks/plan.md and tasks/todo.md after specification review. Mechanical moves and semantic rewrites are reviewed separately. Shared status edits and generator/build runs are serialized.

## Testing strategy and success criteria

The approved acceptance checks exercise repository structure and fresh-session behavior.

- Every original record has a ledger entry. Every retained decision, qualification and source is accounted for.
- Raw evidence hashes match. Historical signatures and release archives are not rewritten.
- Active links, imports, runner paths and documentation references resolve at their new locations.
- No active instruction routes to the old pass, old local skills or removed paths.
- Claude's import reaches the shared rules. Codex reads the same shared startup contract.
- Fresh sessions at the root and inside a package identify the correct phase, task, source owner, plugin and next action.
- A session after an interrupted task preserves existing changes and reports the unfinished work.
- A session with no approved next task does not restart the completed systematization pass.
- A new request preserves any existing incomplete plan. An unanswered decision remains unanswered.
- The current failing browser case remains visible until evidence closes it.
- All migrated live verification drivers execute with the same assertions and coverage. The full gate is completed before migration acceptance.
- All five local skills and the old workflow tree are removed. The plugin skills and new documents are the only active workflow.

Actual cold-start behavior remains unverified until these checks run. File existence or valid JSON alone does not prove it.

Use the official skill-creator workflow when editing AGENTS.md or retiring the local skill files, as Peter requires. Use brain's writing-for-agents guidance for the wording and context pointers.

### Prior-art checks

[scripts/__tests__/check.test.ts](../scripts/__tests__/check.test.ts) and [scripts/__tests__/release-workflows.test.ts](../scripts/__tests__/release-workflows.test.ts) are the existing verification-runner and workflow checks to preserve while paths move. Their behavioral scope does not prove agent startup.

The reference projects' startup/status/task files are the behavioral model for the fresh-session checks. No existing cold-start evaluation is claimed. Static checks and actual Claude/Codex session checks remain distinct.

## User stories

1. As Peter, I can start a fresh root session and get the correct current phase and next action.
2. As Peter, I can start inside a package and still get the shared project state and the correct source owner.
3. As Peter, I can change the request without silently losing another incomplete task.
4. As Peter, I can approve a specification and plan before their implementation begins.
5. As Peter, I can answer a question without an agent deadline or an inferred answer.
6. As an agent, I can select brain's workflow without competing local skill instructions.
7. As an agent, I can find the applicable glossary, decisions and research without reading all completed history.
8. As an agent, I can tell which record is current, proposed, superseded or historical.
9. As an agent, I can update task state and leave a useful handoff before a session boundary.
10. As a reviewer, I can account for every moved or retired file and every retained decision.
11. As a reviewer, I can verify raw evidence integrity and follow references at their new locations.
12. As a maintainer, I can run every existing acceptance check after its driver and fixtures move.
13. As a maintainer, I can see the known failing browser result rather than inherit a false green baseline.
14. As a package author, I keep maintainer instructions separate from the consumer skills that ship to users.

## Boundaries

- Always preserve evidence, distinguish confirmed requirements from proposals, and resolve rule collisions in favor of the selected workflow.
- Always use the actual repository state and authorization. An old task's permission is not permission for a new task.
- Put new user-owned choices through brain's question workflow. Obtain approval for the specification and detailed plan before implementation.
- Ask once for each outward-facing action that lacks authorization. This proposal supplies no standing push, merge or publication grant.
- Keep product behavior and dependencies outside this migration unless a demonstrated prerequisite requires a separately recorded change.

## Out of scope

- Changing component behavior, the selected runtime stack, package names or release versions.
- Moving the shared component source into five independent package implementations.
- Adopting the CLI project's Changesets, shared presets or release workflows as an incidental part of this migration.
- Copying permission grants from the reference projects.
- Modifying the two reference repositories, global plugin configuration, or the published consumer skills.
- Adding status-saving automation or a new question interface.

## Approval boundary

Peter approves the direction and success checks on 2026-10-21. The implementation plan and task list are subsequently approved after the three plan-review questions. Local implementation is authorized.

The host is currently in Default mode. The previous desktop evidence records a countdown on asynchronous question cards. The blocking question tool is restricted to Plan mode. While that tool is unavailable, brain's question skill permits a plain-text question. Keep the decision pending and accept a clear written answer. This is a current host constraint, not a new universal project mode rule. The permanent rule is to use a permitted question surface, wait for Peter and add no agent deadline.

The specification approval does not imply approval of an unwritten implementation plan.
