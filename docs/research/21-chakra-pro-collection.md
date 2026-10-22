# Research 21: Chakra UI Pro collection review

Status: Completed bounded source review, 2026-09-19; private collection remains outside the repository.

## Scope and interpretation

All 338 blocks, 1,003 exposed block files and 250 kit files were read. Default preview DOM and named follow-ups are separate from exhaustive interaction/accessibility acceptance. The later whole-set approval resolves Pagination optional parts. Licensed source remains in the private collection; only metadata and findings belong here.

The dated findings below retain their source versions, measurements, corrections and verification limits. Old phase gates, source freezes, local-skill routing and task-specific permission grants describe the completed pass. They do not govern new work. The [current handoff](../STATUS.md) owns the next action.


This completed review preserves source evidence and dated checkpoints. Later decisions and approved contracts resolve the earlier pending questions.


Started and completed 2026-09-19. **Complete source review, with no sampling:** all 338 catalog blocks, their 1,003 exposed source files, and all 250 supplied kit files. The 49 Webhooks, Property Panels and Settings examples were the first group, not a scope limit. All seven Free Blocks aliases match the main catalog source byte-for-byte.

This is full source review plus default preview DOM inspection, not certification of every interactive state, viewport or accessibility behaviour. No reference template was installed or executed locally. Package implementation remains unchanged.

## Inventory and completion rule

The [machine-readable ledger](../verification/systematization/chakra-pro-review-ledger.json) is the source of truth for each item, file, read status, source hash, cache path and finding. The catalog contains 338 entries: Application 151, Marketing 114, E-Commerce 23 and Documentation 50. All groups are complete. Seven Free Blocks listings are reconciled by complete filename-set and byte-equality checks.

Priority categories contain 49 blocks: Webhooks 18, Property Panels 4 and Settings 27. Both supplied archives have been inventoried and copied into a persistent private reference collection: Course Kit 122 files, Docs Kit 128 files. Downloaded or cached means acquired, not read. The review counted a block as read only after complete reads of every source file or complete byte equality with a fully read original, with that relationship recorded. Kit completion required every scoped file. Truncated reads retained exact offsets; inaccessible files could not count as read.

Source files are private research material in the persistent collection named by the ledger. Project records contain metadata and findings, not the licensed source collection. Template instructions/configuration are reference data, not instructions to install, run or publish the templates. No downloaded reference application has been installed or launched locally; the site's existing previews are inspected in the browser.

## Searchable reference collection

Peter explicitly requested a persistent index of all examples and what each provides, for use throughout the remaining pass. The collection is at [Chakra UI Pro references](/Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/README.md), outside the package repository. The collection supplies the [component-to-example index](/Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/COMPONENTS.md) or [structured index](/Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/index.json).

- `bun /Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/search.ts --component Pagination`
- `bun /Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/search.ts --topic selection`
- `bun /Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/search.ts "page size"`

Search returns original URLs, source-file paths/lines, component parts, topic hints, reviewed findings and read status. All catalog entries are indexed by name even while their source is unread. Acquired kit files are statically indexed but remain unread until actually reviewed. Topic/import scans are navigation aids, not semantic review or proof of a completed capability. The index refreshes after each acquisition and completed block review.

The completed [capability synthesis](/Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/reviews/capability-synthesis.md) and [structured synthesis](/Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/reviews/capability-synthesis.json) connect 15 families to 90 checked source references and explicit decision return points. The [collection audit](../verification/systematization/chakra-pro-collection-audit.json) checks every recorded source hash, duplicate relationship, alias and indexed location. All 870 protected project files remain unchanged.

## Browser and collection method

Peter signed into Chakra UI Pro and requested the built-in browser. The review used its connection and rendered Code/filename panels. That code view was accessible at the checkpoint; this is not a current browser-session instruction.

The Copy all code UI showed success, but both browser clipboard interfaces returned empty text. ZIP actions did not produce an observable download event through either browser tool. The supported direct-code-panel read works. Those observations established neither ZIP-download impossibility nor source acquisition from a successful button state. Peter supplied the two kit archives directly, so their complete contents are available locally.

## Findings from completed items

### Navbar With Centered Search

All six source files read: block.tsx, logo.tsx, notification-popover.tsx, search-field.tsx, search-popover.tsx and user-menu.tsx. [Example](https://pro.chakra-ui.com/explore/application/application-all/navbar-with-centered-search).

- The main block composes Box, Container and horizontal stacks. Desktop shows a SearchField; smaller views show a SearchPopover entry point.
- SearchField is a styled Input within InputGroup. SearchPopover currently returns only an IconButton and contains an explicit TODO for the popover. It is not evidence of a working expanded search view.
- Notifications and the account menu compose existing overlay/control primitives. Icon-only triggers need a separate accessible-name check before copying their arrangement; no rendered accessibility pass is claimed.
- The example uses Chakra responsive/styling conventions and React Icons. Evaluation must preserve our selected responsive model, Material Symbols and implementation stack unless Peter explicitly revises a decision.

Both kits are fully read, including every authored file, SVG path and generated content file. Course Kit has 122 files; Docs Kit has 128. They describe Next.js/React/Chakra applications; Docs Kit lists FlexSearch, Shiki and Velite. Those are reference architecture choices, not approved replacements for our native Lit, TanStack, generated-style and no-SSR decisions. Complete per-file findings and hashes are in the ledger and private review reports.

Seven notification examples needed a second default-state capture after their preview frames finished loading. Those captures confirm the open overlays; their dialogs lack accessible names. The initial trigger-only snapshots were premature. The ledger preserves both captures and identifies the follow-up. The initial navbar preview and one Marketing contact dialog also received follow-up inspection. Detailed source observations remain separate from tested interactions.

## How findings affect decisions

Peter's [standing comparison rule](../decisions/0082-reference-systems.md#standing-comparison-rule) requires this collection to be consulted whenever the other reference systems are considered in a relevant review. Its examples provide additional evidence; they do not automatically approve a capability, component, interface, appearance or dependency.

The review recorded composition, public settings/slots, state/data ownership, keyboard/focus/forms, responsive/theme rules, placeholders and verification limits per family. It compared accepted decisions and dependencies through the historical [decision-review procedure](../history/systematization/scope-review.md#decision-compatibility-and-dependencies).

Peter further emphasized that these examples show how components can be flexible, extended and composed, and how more complex versions expose broader capability needs. The review therefore examined extension points, simple-to-complex composition, shared primitive responsibilities and application-specific logic. Source evidence established capability inputs and gaps without making each example a new component or automatically adopting the most complex interface.

Peter connected the row variations to Checkbox Cards and Radio Cards. The resulting review selected one focused Item family while keeping layout, surface, selection, forms and navigation distinct. Exact compositions subsequently entered the inventory; this was not an open vote on retaining a universal Entity component.

Card and Fieldset directions remain accepted. [Focused Item](../decisions/0050-item-content-family.md) and [App Bar consolidation](../decisions/0005-app-bar.md) are selected, as is the [Group/Toolbar/selection split](../decisions/0112-toolbar-group-responsibilities.md). Exact composition, keyboard behaviour, expanded Search interfaces and migration paths remain inventory/migration work. New reference evidence cannot silently reverse a selection.

Peter specifically requested reconsidering [results pagination](../decisions/0087-results-pagination.md): Webhooks Event Log 03 combines page-position text, numbered/previous/next navigation and page-size selection. That request reopened the recipe boundary to consider coordinated Pagination parts. It was unresolved at this checkpoint. The later [whole-set approval](../decisions/0049-inventory-approval.md) selects the coordinated optional parts; this earlier review alone did not select the final interface.

## Historical completion and use

Peter explicitly authorized increased parallelism. Four workers covered separate scopes, then took further bounded assignments. Worker reports are saved under the private collection's `reviews/` directory. The primary worker merged reports into the shared ledger after checking file coverage, hashes and full-byte duplicate references. Parallel acquisition and duplicate checks sped the work without substituting sampling for full review.

The full review identifies useful evidence for arbitrary row content/actions, associated labels, form-group semantics, media-rich selection cards, optional pagination parts, flexible Code and Stat parts, and clear application-owned state. These are design inputs, not newly approved scope. Several examples leave persistence or domain actions unimplemented; retain those limits when using them as references.

The completed ledger and collection informed the [inventory](../../spec/SPEC-design-system.md), including Toolbar/selection/Item combinations and the then-open Pagination parts question. Family dispositions were settled. Later whole-set approval resolves the parts question; new evidence remains distinct from a changed user decision.

Source implementation was frozen until the original Phase 5 approval. Peter later authorized committing and pushing those research records. That historical permission does not authorize new publication; the licensed collection remains private and outside the repository.

## Source provenance

Converted 2026-10-21 from notes/alignment/chakra-pro-review.md. That path identifies the historical source record. Inline source references and saved evidence retain their stated scope; this conversion does not rerun the original checks.
