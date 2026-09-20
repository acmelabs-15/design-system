# Documentation site investigation

Phase 1.9, researched 2026-09-19. **Recommendation: establish one accurate manifest-driven page contract and reuse the existing shared renderers, then extract the interactive doc components that contract needs.** A framework change is not justified by the evidence.

Walkthrough decision, 2026-09-19: Peter selected `@custom-elements-manifest/analyzer` as the manifest generator. [Decision record](../decisions/custom-elements-manifest.md). Its output still needs a repository-specific trial; the page layout and doc-component interfaces remain proposals.

The later walkthrough reviewed the existing shared renderers, missing API data, example reset/cleanup and matching displayed/executed code. [Material Web's documentation generator](https://github.com/material-components/material-web/blob/main/scripts/analyzer/update-docs.ts) was rechecked: it replaces marked API sections while retaining authored guidance. The discussion carries these findings into Phase 4; it does not approve the final page layout or proposed doc-component names. Separately, Peter selected [workflow-built website publishing](../decisions/documentation-publishing.md) and [selective component loading](../decisions/selective-component-loading.md).

## Existing implementation

The site already has shared `section`, `showcase`, API-table, `docPage` and `censusPage` functions in `docs-src/site.ts`. Pages supply a `Doc` object and example data. Therefore the problem is not 104 entirely separate page implementations.

The build produces 104 pages covering all 150 registered tags. That tag coverage hides incomplete API coverage: `docs-src/api.ts:33` only reads declared properties and misses accessors/inherited properties. Comparing it with Lit's runtime property maps found 32 omissions and one wrong attribute name. Its event parser at line 66 stores names without payload types; parts are collected at line 67 but not rendered by `site.ts`'s API tables. CSS custom properties and public methods are absent from the current table model.

Examples use one markup/code source unless the page explicitly supplies alternate code. `docs-app.ts:107` runs example scripts using `new Function` after insertion. This is authored trusted code, but listener cleanup and example reset are not expressed by that contract. Foundations also inject custom raw body HTML. These are concrete responsibilities for shared doc components.

## Reference systems read

| System | Observed pattern | What it contributes here |
|---|---|---|
| Web Awesome | [Button page](https://github.com/shoelace-style/webawesome/blob/next/packages/webawesome/docs/docs/components/button.md) holds examples; [component layout](https://github.com/shoelace-style/webawesome/blob/next/packages/webawesome/docs/_layouts/component.njk) reads component metadata for imports, properties, slots, methods, events, CSS parts/properties/states, dependencies and SSR notes | Strong model for one reusable page fed by a manifest; start/end composition examples |
| Spectrum gen2 | [Package scripts](https://github.com/adobe/spectrum-web-components/blob/main/gen2/packages/swc/package.json) build CEM, Storybook docs and browser/a11y tests | Examples and documentation can serve verification; adopting Storybook itself is not necessary |
| Material Web | [Tabs documentation](https://github.com/material-components/material-web/blob/main/docs/components/tabs.md) combines authored usage, accessibility and theming with clearly marked generated API sections, including event bubbles/composed columns | Keep authored guidance distinct from generated contracts; state event behaviour precisely |
| Lion | [Button overview](https://github.com/ing-bank/lion/blob/master/docs/components/button/overview.md) combines setup imports, live preview-story code, features and install instructions | Executable examples should be the code readers copy; separate definition imports from class imports |

The [Custom Elements Manifest analyzer](https://custom-elements-manifest.open-wc.org/analyzer/getting-started/) supports Lit and inheritance linking. Slots, CSS parts and CSS properties still need authored JSDoc. Generating a manifest is not permission to invent undocumented information. Prefer the standard analyzer over extending the bespoke regex surface indefinitely; compare its output with runtime metadata before replacing the current docs path. Material's Lit analyzer is another real option, but our strongest cross-library precedent is the standard CEM analyzer used by Spectrum, Web Awesome and Nord.

## Proposed standard element page

1. **Identity:** title, tag, one-sentence purpose, status, direct import and source reference.
2. **Anatomy and basic example:** the important parts, a working example and its exact code.
3. **Examples:** retain the reference's example content for Geist elements; other elements use examples that cover their approved contract.
4. **States and access:** disabled, error, loading, empty and other applicable states; keyboard/focus behaviour and accessible naming. Do not add irrelevant empty sections.
5. **Composition:** what the element uses and what uses it, with slot examples and recipes.
6. **API:** manifest-derived properties/attributes/defaults, public methods, slots, typed event details with propagation flags, CSS parts/properties and supported custom states.
7. **Verification:** census link for Geist-derived elements; named deviations and source-system checks where appropriate.

Foundations use the same page identity, navigation, example and code layout, with token/scale tables in place of an element API. A generated Markdown twin carries the same factual content for agents. The element reference generated by `docs-src/skill-reference.ts` must consume the same schema.

## Proposed doc components

| Responsibility | Proposed component | Behaviour to centralize |
|---|---|---|
| Page structure | `docs-page` | Heading hierarchy, navigation, anchors and section placement |
| Runnable example | `docs-example` | Mount, reset, cleanup, show code, copy, accessible toggle state |
| API presentation | `docs-api` | Read the manifest; show real attributes, inherited members and event contracts |
| States | `docs-states` | Named state fixtures shared with browser tests |
| Composition | `docs-composition` | Dependency relationships, recipes and slot examples |
| Measurement | `docs-census` | Link a fixture to its exact measurement configuration and accepted differences |

These names and interfaces are proposals for the Phase 4 documentation inventory. Existing pure render functions can remain behind them; do not wrap every static fragment in a custom element solely to increase the component count.

## Acceptance for the later implementation

The manifest agrees with runtime property metadata, including the 32 missing entries and meterLabel's actual attribute. Every example shows the code that actually runs and has a teardown/reset contract. Keyboard and form examples assert outcomes in a browser. API and Markdown output come from one schema. Docs load only the elements needed for their route after the build work, and the generated site is rebuilt from the same package output being documented. This investigation does not approve the layout or start that migration.

## Phase 1 extension: documentation navigation

Peter requests removal of the long house-system footer and continuously available Previous/Next page links. Both originate in docs-src/app/docs-app.ts:120–121. The current frame appends them after article content. A future fixed/sticky treatment must preserve content space, focus visibility, narrow-window layout, zoom and safe areas. No layout prototype or source change was made.

The existing Pagination element (src/components/pagination/pagination.ts) is previous/next document navigation with destination titles. It has no page index, page count, page size or numbered range. Its docs explicitly distinguish a numbered data pager.

Peter selected reusable results pagination after this investigation; details are below. Published v9 types govern consumer examples, not a house Table adapter. Older guide examples can use different API names. Final names and control interfaces remain for Phases 2–4.

Material Web's inspected component tree has no pagination component to reuse. Do not infer one from Material guidance or Angular Material's separate implementation. The document-navigation and data-pagination concepts should be explained distinctly in the inventory.

The selected React package and agent-tooling research also affect documentation delivery. [Agent tooling](agent-tooling.md) tracks the existing skill-reference generator and selected versioned consumer guidance; versioned consumer skills, a documentation/API MCP and Intent tooling are selected for the later migration, with no installation performed.

## Results pagination capability

[Peter selected reusable results pagination](../decisions/results-pagination.md): numbered and compact navigation for tables and lists, including unknown totals. Page-size and jump-to-page layouts are documented compositions of existing controls. The application owns page state and data loading; no TanStack Table runtime dependency is selected. Keeping only documentation links and requiring applications to assemble all result controls was the rejected option.

Current pagination.ts:30–35 exposes only destination titles and URLs; :47–64 renders the two document links and a centre slot. It cannot represent a results page/count/range. Keep that document-navigation concept distinct from the newly selected capability; exact naming and element/recipe boundaries are still open.

Read [Chakra Pagination documentation](https://github.com/chakra-ui/chakra-ui/blob/main/apps/www/content/docs/components/pagination.mdx), pagination.tsx, compact and link examples in full. Chakra composes Ark pagination with Button/IconButton styles, selected-page items, ellipses, previous/next controls and formatted count text. Its page/page-change contract permits application control; URL examples render actual links. This supports the proposed capabilities, not automatic adoption of Ark or Zag pagination. The separate later Zag Splitter selection does not authorize Zag pagination.

Read the [TanStack Lit pagination example](https://github.com/TanStack/table/blob/main/examples/lit/pagination/src/main.ts), published 9.2.4 rowPaginationFeature.types.d.ts and utilities. They distinguish zero-based application page indexes from displayed one-based page numbers; client processing from already-paged server data; known totals from -1 unknown totals; and page-size changes from page changes. The application determines reset policy. Infinite page size represents all rows in the researched package, not a required default UI choice.

An unknown TanStack total makes getCanNextPage return true and getCanLastPage false. Thus the results controls must accept the application's navigation availability rather than invent a last page or assume a server has more records. The sample's count text and jump input assume a known total; do not copy those expressions unchanged into unknown-total examples.

Material Web's non-truncated main tree search found no pagination/paginator implementation. Data-table tokens and the testing table do not fill this gap. Chakra provides an implementation comparison; Material guidance alone is not a shipped Lit component.

Later acceptance must cover known/unknown/empty totals, start/end boundaries, external page changes, changed page size or filters, loading/failure/retry, compact layouts, URL navigation versus local actions, keyboard/focus behaviour, labels/current-page indication and localization. The final interfaces and defaults are not selected by this research. No pagination implementation or browser check ran. [Source checkpoint](../alignment/evidence/table-review-2026-09-19.json).

## Chakra Pro pagination review

On 2026-09-19 Peter identified the [Webhooks Event Log 03](https://pro.chakra-ui.com/explore/application/application-all/webhooks-event-log-03) pagination as a more complete capability example and suggested that its page-position text and page-size selection may belong in Pagination itself. The full block sources, including delivery-log-pagination.tsx and block.tsx, were read through his authorized Pro code view; coverage and hashes live in the [full-review ledger](../alignment/evidence/chakra-pro-review-ledger.json).

The example wraps Pagination.Root with count, page, pageSize and change callbacks. PageText reads shared pagination context; numbered items, previous and next controls compose Button/IconButton, while a NativeSelect chooses 10, 25 or 50 rows. Block owns the React page/page-size state and slices its own data. Changing page size calls setPageSize and resets page to 1. The three other filter selects and Export button have no filtering/export callbacks in this example; do not infer that those features are implemented.

The extension point worth evaluating is a cohesive Pagination family with optional page-position/page-size parts that reuse shared controls and coordinate with the same state. That could reduce repeated consumer wrappers while keeping layout flexible. It would revise the earlier recipe-only page-size arrangement if Peter selects it; it would not adopt a TanStack Table engine or move fetching into Pagination.

Preserve application-owned state/data/loading and unknown-total support. The reference's totalPages/pages-length/fallback-1 expression is written for its known-count demo and must not manufacture a last page in unknown-total cases. Verify page-size changes, reset policy, out-of-range pages, loading, localization, real links versus buttons and accessible select labels. The visible Show text is not explicitly associated with the select in this source.

The [decision note](../decisions/results-pagination.md#review-pending-after-the-chakra-ui-pro-example) marks this as pending review. Revisit the component/recipe boundary after the complete Pro review and before the Pagination inventory entry is approved. Jump-to-page composition was not specifically reselected by Peter's example; evaluate its relationship without silently expanding this request.

One live Pro preview check changed the page-size select to 25. The selected value became 25, the summary became Page 1 of 1, and the table contained 16 rows including its header (15 data rows). This verifies that specific composed state update in the reference preview. It is not a house implementation test, a full pagination audit, or proof of unknown-total behaviour.

## Complete Pro documentation and kit evidence

The [complete Pro review](../alignment/chakra-pro-review.md) includes all 50 Documentation blocks and every file in both kits. The private [capability synthesis](/Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/reviews/capability-synthesis.md) links exact source lines for Code, Search, prose, navigation and Timeline. Use this additional source alongside the other reference systems under the [standing comparison rule](../decisions/reference-systems.md#standing-comparison-rule); none of these examples automatically expands the planned docs or library scope.

CodeBlock examples separate title/status, language or file controls, copy, content, optional line information and collapse. Some accept arbitrary empty-state content. These are useful optional-parts proposals, while Copy, Select and selection controls should retain their own shared responsibilities. Keep the selected house highlighting/state packages. Some preview examples show different code from the rendered example, reset state by unmounting, or include unwired controls. Source/render fidelity and teardown need explicit acceptance checks.

Docs Kit provides implemented query/index handling, but its search source lacks complete input/dialog/result semantics and turns errors into empty results. Generated search content loses inline code terms. Its generated CodeGroup content also has a nested structure that differs from the text extractor's assumptions; the likely rendering defect is source evidence, not a tested result. Do not adopt its search or MDX packages merely because they appear in the kit.

Documentation pagination and lesson navigation use adjacent-document links, distinct from result-page controls. Timeline examples permit arbitrary date indicators and multiple content regions. Static instructions and scroll-linked reading progress remain separate from interactive Steps. These findings inform the Phase 4 documentation/component review; they do not approve new interfaces or automatic movement.

## Complete Phase 4 documentation proposal

The [documentation/tooling proposal](../alignment/inventory/documentation-tooling.md) now specifies the page contract, seven documentation units, cleanup/reset/source fidelity, complete manifest tables, persistent document navigation, tested recipes and version-matched HTML/Lit/React references. It keeps static rendering functions where they suffice rather than turning every section into a custom element. Results Pagination remains a separate consumer family; the Pro-inspired coordinated parts are Q15 in the [five-question register](../alignment/proposal-questions.md).

This is proposal assembly, not source implementation or final page-layout approval. CEM/private-member classification, packaged API consistency, native table/light-DOM styling delivery and example acceptance remain named engineering gates. Historical API omission/build counts above retain their dated scope; the fresh [source snapshot](../alignment/evidence/current-public-interfaces-2026-09-20.json) is static coverage, not a replacement manifest.

### Whole-set approval and Phase 5 handoff

On 2026-09-20 Peter said “I approve all proposals.” The [approval record](../decisions/inventory-approval.md) selects the complete set and the five stated recommendations. Earlier proposal/unselected statements above retain their historical evidence scope; current design status is approved. Peter subsequently [approved the migration plan](../decisions/migration-approval.md) through “approved”. M00 technical prerequisites remain active before dependent implementation. Production implementation has not started; approval is not a runtime result.

## M01/M02 source and output routing

The authored site now lives under site; local generation writes _site. It copies only document styles/maps from dist/styles and continues to build 104 pages documenting 150 current elements. The source move and compiler changes pass the existing rendering suite. [Evidence](../alignment/evidence/m02-css-pipeline-2026-09-20.json).

GitHub Pages still serves main/docs, verified through the repository API on 2026-09-20. The tracked docs tree remains an untouched published snapshot while local development uses _site. Switching the workflow and removing that snapshot remains the publishing migration. No site deployment or repository setting was changed.
