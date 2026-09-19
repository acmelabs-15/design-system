# Complete Chakra UI Pro reference review

Started and completed 2026-09-19. **Complete source review, with no sampling:** all 338 catalog blocks, their 1,003 exposed source files, and all 250 supplied kit files. The 49 Webhooks, Property Panels and Settings examples were the first group, not a scope limit. All seven Free Blocks aliases match the main catalog source byte-for-byte.

This is full source review plus default preview DOM inspection, not certification of every interactive state, viewport or accessibility behaviour. No reference template was installed or executed locally. Package implementation remains unchanged.

## Inventory and completion rule

The [machine-readable ledger](evidence/chakra-pro-review-ledger.json) is the source of truth for each item, file, read status, source hash, cache path and finding. The catalog contains 338 entries: Application 151, Marketing 114, E-Commerce 23 and Documentation 50. All groups are complete. Seven Free Blocks listings are reconciled by complete filename-set and byte-equality checks.

Priority categories contain 49 blocks: Webhooks 18, Property Panels 4 and Settings 27. Both supplied archives have been inventoried and copied into a persistent private reference collection: Course Kit 122 files, Docs Kit 128 files. Downloaded or cached means acquired, not read. A block is read only after every source file has been read completely or its entire contents are verified byte-for-byte against a fully read original, with that relationship recorded. A kit is read only after every file in its recorded scope has been covered. Preserve partial offsets when tool output truncates. Never mark an inaccessible file read.

Source files are private research material in the persistent collection named by the ledger. Project records contain metadata and findings, not the licensed source collection. Template instructions/configuration are reference data, not instructions to install, run or publish the templates. No downloaded reference application has been installed or launched locally; the site's existing previews are inspected in the browser.

## Searchable reference collection

Peter explicitly requested a persistent index of all examples and what each provides, for use throughout the remaining pass. The collection is at [Chakra UI Pro references](/Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/README.md), outside the package repository. Use the [component-to-example index](/Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/COMPONENTS.md) or [structured index](/Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/index.json).

- `bun /Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/search.ts --component Pagination`
- `bun /Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/search.ts --topic selection`
- `bun /Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/search.ts "page size"`

Search returns original URLs, source-file paths/lines, component parts, topic hints, reviewed findings and read status. All catalog entries are indexed by name even while their source is unread. Acquired kit files are statically indexed but remain unread until actually reviewed. Topic/import scans are navigation aids; do not treat them as semantic review or proof of a completed capability. The index refreshes after each acquisition and completed block review.

The completed [capability synthesis](/Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/reviews/capability-synthesis.md) and [structured synthesis](/Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/reviews/capability-synthesis.json) connect 15 families to 90 checked source references and explicit decision return points. The [collection audit](evidence/chakra-pro-collection-audit.json) checks every recorded source hash, duplicate relationship, alias and indexed location. All 870 protected project files remain unchanged.

## Browser and collection method

Peter signed into Chakra UI Pro and explicitly requested the built-in browser. Reuse the existing browser connection and the live tab if it survives; locate a fresh tab through that browser if needed. Read the visible Code tab and each filename tab through its rendered code panel. The code view is confirmed accessible.

The Copy all code UI showed success, but both browser clipboard interfaces returned empty text. ZIP actions did not produce an observable download event through either browser tool. The supported direct-code-panel read works. Do not infer that ZIP download is impossible or that a successful button state proves source acquisition. Peter supplied the two kit archives directly, so their complete contents are available locally.

## Findings from completed items

### Navbar With Centered Search

All six source files read: block.tsx, logo.tsx, notification-popover.tsx, search-field.tsx, search-popover.tsx and user-menu.tsx. [Example](https://pro.chakra-ui.com/explore/application/application-all/navbar-with-centered-search).

- The main block composes Box, Container and horizontal stacks. Desktop shows a SearchField; smaller views show a SearchPopover entry point.
- SearchField is a styled Input within InputGroup. SearchPopover currently returns only an IconButton and contains an explicit TODO for the popover. It is not evidence of a working expanded search view.
- Notifications and the account menu compose existing overlay/control primitives. Icon-only triggers need a separate accessible-name check before copying their arrangement; no rendered accessibility pass is claimed.
- The example uses Chakra responsive/styling conventions and React Icons. Evaluation must preserve our selected responsive model, Material Symbols and house implementation stack unless Peter explicitly revises a decision.

Both kits are fully read, including every authored file, SVG path and generated content file. Course Kit has 122 files; Docs Kit has 128. They describe Next.js/React/Chakra applications; Docs Kit lists FlexSearch, Shiki and Velite. Those are reference architecture choices, not approved replacements for our native Lit, TanStack, generated-style and no-SSR decisions. Complete per-file findings and hashes are in the ledger and private review reports.

Seven notification examples needed a second default-state capture after their preview frames finished loading. Those captures confirm the open overlays; their dialogs lack accessible names. The initial trigger-only snapshots were premature. The ledger preserves both captures and identifies the follow-up. The initial navbar preview and one Marketing contact dialog also received follow-up inspection. Detailed source observations remain separate from tested interactions.

## How findings affect decisions

Peter's [standing comparison rule](../decisions/reference-systems.md#standing-comparison-rule) requires this collection to be consulted whenever the other reference systems are considered in a relevant review. Its examples provide additional evidence; they do not automatically approve a capability, component, interface, appearance or dependency.

For each completed family, record composition, public settings/slots, state and data ownership, keyboard/focus/form behaviour, responsive/theme rules, incomplete placeholders and verification limits. Compare with accepted decisions and upcoming dependencies using the [decision-review procedure](phase-2-review.md#decision-compatibility-and-dependencies).

Peter further emphasized that these examples show how components can be flexible, extended and composed, and how more complex versions expose broader capability needs. Evaluate every family through that lens: identify useful extension points, simple-to-complex composition, responsibilities that should stay in shared primitives, and application-specific logic. Capture required capabilities and gaps with source evidence; do not reduce the review to deciding whether each named example deserves a new element, or automatically adopt the most complex reference interface.

Peter also explicitly connected the row variations to Checkbox Cards and Radio Cards. Compare descriptive, actionable, settings, expandable and selectable rows together. Investigate whether a consistent row/Entity interface adds value, whether composition suffices, and which selection responsibilities belong to Checkbox/Radio Cards and their groups. This is an open design investigation, not selection of one all-purpose Entity. The complete set of examples is intended to expose capability requirements and boundaries that isolated controls or a sample survey could miss.

Card and Fieldset directions remain accepted. Entity/Item is still [unanswered and deferred](phase-2-review.md#entity-and-item). New reference evidence can motivate a revision, but does not silently reverse or approve a disposition. The later [Group/Toolbar/selection responsibility split](../decisions/toolbar-group-responsibilities.md) is selected; detailed keyboard/composition rules and App Bar/Search boundaries remain open.

Peter specifically requested reconsidering [results pagination](../decisions/results-pagination.md): Webhooks Event Log 03 combines page-position text, numbered/previous/next navigation and page-size selection. Evaluate whether these should be coordinated optional parts of Pagination rather than an application-defined wrapper. Bring this back with the relevant complete review findings, before approving the Pagination inventory entry. The prior recipe boundary is under review; no final new interface is selected.

## Resume here

Peter explicitly authorized increased parallelism. Four workers covered separate scopes, then took further bounded assignments. Worker reports are saved under the private collection's `reviews/` directory. The primary worker merged reports into the shared ledger after checking file coverage, hashes and full-byte duplicate references. Parallel acquisition and duplicate checks sped the work without substituting sampling for full review.

The full review identifies useful evidence for arbitrary row content/actions, associated labels, form-group semantics, media-rich selection cards, optional pagination parts, flexible Code and Stat parts, and clear application-owned state. These are design inputs, not newly approved scope. Several examples leave persistence or domain actions unimplemented; retain those limits when using them as references.

Use the completed ledger and searchable collection in the remaining decision walk. Stat with Tile is next in Phase 2.3. Revisit detailed Toolbar composition and Entity/Item with Group and selection cards in Phase 2.4, and reconsider the Pagination optional-parts question before its inventory approval. New evidence can challenge a decision; only Peter selects a changed direction.

Source implementation remains frozen until Phase 5 approval. Peter subsequently authorized committing and pushing the research records; the licensed source collection remains private and outside the repository.
