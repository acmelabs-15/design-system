# Complete proposal coverage

All thirteen review groups are approved as design on 2026-09-20. This register maps all 150 current source tags and selected additions; production implementation still awaits the migration plan. The [inventory index](inventory.md#complete-proposal-set) owns the contracts, and [closed decision register](proposal-questions.md) records the approved recommendations.

## Review groups

| Group | Proposal | Status |
| --- | --- | --- |
| R01 | [Shared rules and themes](inventory/foundations.md) | Design approved; verification pending |
| R02 | [Layout and attached groups](inventory/layout.md) | Design approved; verification pending |
| R03 | [Text and formatting](inventory/typography.md) | Design approved; verification pending |
| R04 | [Actions, icons and identity](inventory/actions.md) | Design approved; verification pending |
| R05 | [Selection and tabs](inventory/selection.md) | Design approved; verification pending |
| R06 | [Inputs and forms](inventory/inputs-forms.md) | Design approved; verification pending |
| R07 | [Surfaces and content composition](inventory/surfaces.md) | Design approved; verification pending |
| R08 | [Navigation and disclosure](inventory/navigation-disclosure.md) | Design approved; verification pending |
| R09 | [Messages, progress and statistics](inventory/messages-statistics.md) | Design approved; verification pending |
| R10 | [Overlays and help](inventory/overlays-help.md) | Design approved; verification pending |
| R11 | [Tables, charts and diagrams](inventory/data-displays.md) | Design approved; verification pending |
| R12 | [Rich content and media](inventory/rich-content.md) | Design approved; verification pending |
| R13 | [Documentation and public tooling](inventory/documentation-tooling.md) | Design approved; verification pending |

R02 also includes the six detailed [core layout entries](inventory.md#core-layout-proposal-for-review). Each family includes its parts and recipes; an entry count is not a final element count. R13 includes seven documentation units plus package/React/skills/MCP/inspector contracts.

## Current source-to-proposal map

These are approved final destinations, with accepted removals retained. A removed interface is not retained merely because its source appears here. Pure layout Panels maps to Grid; resizing remains an added capability. The old Pagination document links map to DocNavigation while its name is reused for results pagination under the proposed package contract. Loading Dots maps to Spinner/Progress without a dots variant. Context Card disappears; relative-time rich details are a separate Hover Card recipe.

| Current source tag | Proposed destination | Treatment |
| --- | --- | --- |
| acme-appbar | [N-01](inventory/navigation-disclosure.md#n-01-app-bar) | Retain or rebuild capability under linked proposed contract |
| acme-avatar | [A-07](inventory/actions.md#a-07-avatar) | Retain or rebuild capability under linked proposed contract |
| acme-avatar-group | [A-08](inventory/actions.md#a-08-avatar-group) | Retain or rebuild capability under linked proposed contract |
| acme-badge | [A-09](inventory/actions.md#a-09-badge-pill-and-tag) | Retain or rebuild capability under linked proposed contract |
| acme-banner | [M-01](inventory/messages-statistics.md#m-01-alert-and-banner) | Retain or rebuild capability under linked proposed contract |
| acme-bar-row | [recipes](inventory/surfaces.md#required-recipes-and-migration-mapping) | Remove old interface; use linked replacement/recipe |
| acme-bar-rows | [recipes](inventory/surfaces.md#required-recipes-and-migration-mapping) | Remove old interface; use linked replacement/recipe |
| acme-book | [RC-05](inventory/rich-content.md#rc-05-book) | Retain or rebuild capability under linked proposed contract |
| acme-breadcrumb | [N-05](inventory/navigation-disclosure.md#n-05-breadcrumbs) | Retain or rebuild capability under linked proposed contract |
| acme-breadcrumbs | [N-05](inventory/navigation-disclosure.md#n-05-breadcrumbs) | Retain or rebuild capability under linked proposed contract |
| acme-browser | [RC-06](inventory/rich-content.md#rc-06-browser) | Retain or rebuild capability under linked proposed contract |
| acme-button | [A-01](inventory/actions.md#a-01-button) | Retain or rebuild capability under linked proposed contract |
| acme-button-group | [G-01](inventory.md#g-01-group) | Retain or rebuild capability under linked proposed contract |
| acme-calendar | [F-08](inventory/inputs-forms.md#f-08-calendar) | Retain or rebuild capability under linked proposed contract |
| acme-card | [C-01](inventory/surfaces.md#c-01-card) | Retain or rebuild capability under linked proposed contract |
| acme-chart | [D-03](inventory/data-displays.md#d-03-chart) | Retain or rebuild capability under linked proposed contract |
| acme-check | [F-09](inventory/inputs-forms.md#f-09-field-fieldset-and-label) | Remove old interface; use linked replacement/recipe |
| acme-checkbox | [S-01](inventory/selection.md#s-01-checkbox-and-checkbox-group) | Retain or rebuild capability under linked proposed contract |
| acme-chip | [A-03](inventory/actions.md#a-03-toggle-button) | Retain or rebuild capability under linked proposed contract |
| acme-choicebox | [S-03](inventory/selection.md#s-03-checkbox-card-and-radio-card) | Retain or rebuild capability under linked proposed contract |
| acme-choicebox-item | [S-03](inventory/selection.md#s-03-checkbox-card-and-radio-card) | Retain or rebuild capability under linked proposed contract |
| acme-clearable-input | [F-01](inventory/inputs-forms.md#f-01-input-and-search) | Remove old interface; use linked replacement/recipe |
| acme-code | [T-04](inventory/typography.md#shared-typography-interface) | Retain or rebuild capability under linked proposed contract |
| acme-code-block | [RC-01](inventory/rich-content.md#rc-01-code-block) | Retain or rebuild capability under linked proposed contract |
| acme-collapse | [N-09](inventory/navigation-disclosure.md#n-09-accordion-and-collapsible) | Retain or rebuild capability under linked proposed contract |
| acme-collapse-group | [N-09](inventory/navigation-disclosure.md#n-09-accordion-and-collapsible) | Retain or rebuild capability under linked proposed contract |
| acme-combobox | [F-06](inventory/inputs-forms.md#f-06-select-combobox-and-multi-select) | Retain or rebuild capability under linked proposed contract |
| acme-combobox-option | [F-06](inventory/inputs-forms.md#f-06-select-combobox-and-multi-select) | Retain or rebuild capability under linked proposed contract |
| acme-command-divider | [N-08](inventory/navigation-disclosure.md#n-08-command-menu) | Retain or rebuild capability under linked proposed contract |
| acme-command-group | [N-08](inventory/navigation-disclosure.md#n-08-command-menu) | Retain or rebuild capability under linked proposed contract |
| acme-command-item | [N-08](inventory/navigation-disclosure.md#n-08-command-menu) | Retain or rebuild capability under linked proposed contract |
| acme-command-menu | [N-08](inventory/navigation-disclosure.md#n-08-command-menu) | Retain or rebuild capability under linked proposed contract |
| acme-context-card | [O-05](inventory/overlays-help.md#o-05-hover-card) | Remove old interface; use linked replacement/recipe |
| acme-context-menu | [N-07](inventory/navigation-disclosure.md#n-07-menu-and-context-menu) | Retain or rebuild capability under linked proposed contract |
| acme-copy-button | [A-05](inventory/actions.md#a-05-copy-button) | Retain or rebuild capability under linked proposed contract |
| acme-description | [C-04](inventory/surfaces.md#c-04-data-list) | Retain or rebuild capability under linked proposed contract |
| acme-destructive-modal | [O-02](inventory/overlays-help.md#o-02-alert-dialog) | Remove old interface; use linked replacement/recipe |
| acme-disabled-wall | [C-05](inventory/surfaces.md#c-05-disabled-wall) | Retain or rebuild capability under linked proposed contract |
| acme-dots-menu | [N-07](inventory/navigation-disclosure.md#n-07-menu-and-context-menu) | Remove old interface; use linked replacement/recipe |
| acme-drawer | [O-03](inventory/overlays-help.md#o-03-drawer) | Retain or rebuild capability under linked proposed contract |
| acme-empty-state | [M-04](inventory/messages-statistics.md#m-04-empty-state) | Retain or rebuild capability under linked proposed contract |
| acme-entity | [C-02](inventory/surfaces.md#c-02-item) | Remove old interface; use linked replacement/recipe |
| acme-entity-content | [C-02](inventory/surfaces.md#c-02-item) | Remove old interface; use linked replacement/recipe |
| acme-entity-list | [C-02](inventory/surfaces.md#c-02-item) | Remove old interface; use linked replacement/recipe |
| acme-error | [M-01](inventory/messages-statistics.md#m-01-alert-and-banner) | Remove old interface; use linked replacement/recipe |
| acme-error-card | [M-01](inventory/messages-statistics.md#m-01-alert-and-banner) | Remove old interface; use linked replacement/recipe |
| acme-feedback | [M-03](inventory/messages-statistics.md#m-03-feedback) | Retain or rebuild capability under linked proposed contract |
| acme-fieldset | [F-09](inventory/inputs-forms.md#f-09-field-fieldset-and-label) | Retain or rebuild capability under linked proposed contract |
| acme-file | [N-06](inventory/navigation-disclosure.md#n-06-tree-view) | Retain or rebuild capability under linked proposed contract |
| acme-file-tree | [N-06](inventory/navigation-disclosure.md#n-06-tree-view) | Retain or rebuild capability under linked proposed contract |
| acme-filter | [F-06](inventory/inputs-forms.md#f-06-select-combobox-and-multi-select) | Remove old interface; use linked replacement/recipe |
| acme-filters | [F-06](inventory/inputs-forms.md#f-06-select-combobox-and-multi-select) | Remove old interface; use linked replacement/recipe |
| acme-fold | [N-09](inventory/navigation-disclosure.md#n-09-accordion-and-collapsible) | Remove old interface; use linked replacement/recipe |
| acme-folder | [N-06](inventory/navigation-disclosure.md#n-06-tree-view) | Retain or rebuild capability under linked proposed contract |
| acme-gauge | [M-06](inventory/messages-statistics.md#m-06-meter) | Retain or rebuild capability under linked proposed contract |
| acme-grid | [L-05](inventory.md#l-05-grid) | Retain or rebuild capability under linked proposed contract |
| acme-grid-cell | [L-05](inventory.md#l-05-grid) | Remove old interface; use linked replacement/recipe |
| acme-grid-cross | [L-05](inventory.md#l-05-grid) | Remove old interface; use linked replacement/recipe |
| acme-grid-page | [L-05](inventory.md#l-05-grid) | Remove old interface; use linked replacement/recipe |
| acme-grid-system | [L-05](inventory.md#l-05-grid) | Remove old interface; use linked replacement/recipe |
| acme-icon-tile | [A-06](inventory/actions.md#a-06-per-icon-elements-and-icon-tile) | Retain or rebuild capability under linked proposed contract |
| acme-input | [F-01](inventory/inputs-forms.md#f-01-input-and-search) | Retain or rebuild capability under linked proposed contract |
| acme-item | [C-02](inventory/surfaces.md#c-02-item) | Retain or rebuild capability under linked proposed contract |
| acme-items | [C-02](inventory/surfaces.md#c-02-item) | Remove old interface; use linked replacement/recipe |
| acme-json-view | [RC-03](inventory/rich-content.md#rc-03-json-view) | Retain or rebuild capability under linked proposed contract |
| acme-kbd | [T-06](inventory/typography.md#shared-typography-interface) | Retain or rebuild capability under linked proposed contract |
| acme-kv | [C-04](inventory/surfaces.md#c-04-data-list) | Remove old interface; use linked replacement/recipe |
| acme-label | [F-09](inventory/inputs-forms.md#f-09-field-fieldset-and-label) | Retain or rebuild capability under linked proposed contract |
| acme-legend | [D-04](inventory/data-displays.md#d-04-sparkline-and-legend) | Retain or rebuild capability under linked proposed contract |
| acme-legend-item | [D-04](inventory/data-displays.md#d-04-sparkline-and-legend) | Retain or rebuild capability under linked proposed contract |
| acme-link-card | [C-01](inventory/surfaces.md#c-01-card) | Remove old interface; use linked replacement/recipe |
| acme-load-more | [N-12](inventory/navigation-disclosure.md#n-12-show-show-more-and-load-more) | Retain or rebuild capability under linked proposed contract |
| acme-loading-dots | [M-05](inventory/messages-statistics.md#m-05-spinner-progress-and-skeleton) | Remove old interface; use linked replacement/recipe |
| acme-logs | [D-01](inventory/data-displays.md#d-01-table) | Remove old interface; use linked replacement/recipe |
| acme-markdown | [RC-04](inventory/rich-content.md#rc-04-markdown) | Retain or rebuild capability under linked proposed contract |
| acme-menu | [N-07](inventory/navigation-disclosure.md#n-07-menu-and-context-menu) | Retain or rebuild capability under linked proposed contract |
| acme-menu-button | [N-07](inventory/navigation-disclosure.md#n-07-menu-and-context-menu) | Retain or rebuild capability under linked proposed contract |
| acme-menu-divider | [N-07](inventory/navigation-disclosure.md#n-07-menu-and-context-menu) | Retain or rebuild capability under linked proposed contract |
| acme-menu-item | [N-07](inventory/navigation-disclosure.md#n-07-menu-and-context-menu) | Retain or rebuild capability under linked proposed contract |
| acme-menu-section | [N-07](inventory/navigation-disclosure.md#n-07-menu-and-context-menu) | Retain or rebuild capability under linked proposed contract |
| acme-metric | [M-07](inventory/messages-statistics.md#m-07-stat) | Remove old interface; use linked replacement/recipe |
| acme-metric-list | [M-07](inventory/messages-statistics.md#m-07-stat) | Remove old interface; use linked replacement/recipe |
| acme-middle-truncate | [T-08](inventory/typography.md#shared-typography-interface) | Retain or rebuild capability under linked proposed contract |
| acme-modal | [O-01](inventory/overlays-help.md#o-01-dialog) | Retain or rebuild capability under linked proposed contract |
| acme-modal-inset | [O-01](inventory/overlays-help.md#o-01-dialog) | Remove old interface; use linked replacement/recipe |
| acme-multi-select | [F-06](inventory/inputs-forms.md#f-06-select-combobox-and-multi-select) | Retain or rebuild capability under linked proposed contract |
| acme-multi-select-row | [F-06](inventory/inputs-forms.md#f-06-select-combobox-and-multi-select) | Retain or rebuild capability under linked proposed contract |
| acme-note | [M-01](inventory/messages-statistics.md#m-01-alert-and-banner) | Retain or rebuild capability under linked proposed contract |
| acme-page-head | [N-01](inventory/navigation-disclosure.md#n-01-app-bar) | Remove old interface; use linked replacement/recipe |
| acme-pagination | [DocNavigation](inventory/documentation-tooling.md#documentation-units) | Retire old document-navigation interface; results Pagination is a separate selected capability |
| acme-panel | [C-01](inventory/surfaces.md#c-01-card) | Remove old interface; use linked replacement/recipe |
| acme-panel-foot | [C-01](inventory/surfaces.md#c-01-card) | Remove old interface; use linked replacement/recipe |
| acme-panel-head | [C-01](inventory/surfaces.md#c-01-card) | Remove old interface; use linked replacement/recipe |
| acme-panels | [L-05](inventory.md#l-05-grid) | Remove old interface; use linked replacement/recipe |
| acme-phone | [RC-06](inventory/rich-content.md#rc-06-browser) | Remove old interface; use linked replacement/recipe |
| acme-pill | [A-09](inventory/actions.md#a-09-badge-pill-and-tag) | Retain or rebuild capability under linked proposed contract |
| acme-progress | [M-05](inventory/messages-statistics.md#m-05-spinner-progress-and-skeleton) | Retain or rebuild capability under linked proposed contract |
| acme-project-banner | [M-01](inventory/messages-statistics.md#m-01-alert-and-banner) | Remove old interface; use linked replacement/recipe |
| acme-radio | [S-02](inventory/selection.md#s-02-radio-and-radio-group) | Retain or rebuild capability under linked proposed contract |
| acme-radio-group | [S-02](inventory/selection.md#s-02-radio-and-radio-group) | Retain or rebuild capability under linked proposed contract |
| acme-relative-time | [T-09](inventory/typography.md#shared-typography-interface) | Retain or rebuild capability under linked proposed contract |
| acme-ricon | [A-06](inventory/actions.md#a-06-per-icon-elements-and-icon-tile) | Remove old interface; use linked replacement/recipe |
| acme-scroller | [L-08](inventory/layout.md#l-08-scroll-area) | Retain or rebuild capability under linked proposed contract |
| acme-search | [F-01](inventory/inputs-forms.md#f-01-input-and-search) | Retain or rebuild capability under linked proposed contract |
| acme-select | [F-06](inventory/inputs-forms.md#f-06-select-combobox-and-multi-select) | Retain or rebuild capability under linked proposed contract |
| acme-separator | [L-07](inventory/layout.md#l-07-separator) | Retain or rebuild capability under linked proposed contract |
| acme-setting-row | [C-02](inventory/surfaces.md#c-02-item) | Remove old interface; use linked replacement/recipe |
| acme-setting-rows | [C-02](inventory/surfaces.md#c-02-item) | Remove old interface; use linked replacement/recipe |
| acme-sheet | [O-03](inventory/overlays-help.md#o-03-drawer) | Remove old interface; use linked replacement/recipe |
| acme-shell | [N-01](inventory/navigation-disclosure.md#n-01-app-bar) | Remove old interface; use linked replacement/recipe |
| acme-show-more | [N-12](inventory/navigation-disclosure.md#n-12-show-show-more-and-load-more) | Retain or rebuild capability under linked proposed contract |
| acme-side-nav | [N-03](inventory/navigation-disclosure.md#n-03-sidebar) | Remove old interface; use linked replacement/recipe |
| acme-skeleton | [M-05](inventory/messages-statistics.md#m-05-spinner-progress-and-skeleton) | Retain or rebuild capability under linked proposed contract |
| acme-slider | [F-07](inventory/inputs-forms.md#f-07-slider) | Retain or rebuild capability under linked proposed contract |
| acme-snippet | [RC-02](inventory/rich-content.md#rc-02-snippet) | Retain or rebuild capability under linked proposed contract |
| acme-spark | [D-04](inventory/data-displays.md#d-04-sparkline-and-legend) | Retain or rebuild capability under linked proposed contract |
| acme-spinner | [M-05](inventory/messages-statistics.md#m-05-spinner-progress-and-skeleton) | Retain or rebuild capability under linked proposed contract |
| acme-split-button | [A-04](inventory/actions.md#a-04-split-button) | Retain or rebuild capability under linked proposed contract |
| acme-split-button-item | [A-04](inventory/actions.md#a-04-split-button) | Retain or rebuild capability under linked proposed contract |
| acme-stat | [M-07](inventory/messages-statistics.md#m-07-stat) | Retain or rebuild capability under linked proposed contract |
| acme-stat-delta | [M-07](inventory/messages-statistics.md#m-07-stat) | Retain or rebuild capability under linked proposed contract |
| acme-stat-desc | [M-07](inventory/messages-statistics.md#m-07-stat) | Retain or rebuild capability under linked proposed contract |
| acme-stat-foot | [M-07](inventory/messages-statistics.md#m-07-stat) | Retain or rebuild capability under linked proposed contract |
| acme-stat-strip | [M-07](inventory/messages-statistics.md#m-07-stat) | Remove old interface; use linked replacement/recipe |
| acme-status-dot | [M-08](inventory/messages-statistics.md#m-08-status) | Retain or rebuild capability under linked proposed contract |
| acme-strip-item | [M-07](inventory/messages-statistics.md#m-07-stat) | Remove old interface; use linked replacement/recipe |
| acme-subnav | [N-03](inventory/navigation-disclosure.md#n-03-sidebar) | Remove old interface; use linked replacement/recipe |
| acme-switch | [S-05](inventory/selection.md#s-05-segmented-control) | Retain or rebuild capability under linked proposed contract |
| acme-switch-control | [S-05](inventory/selection.md#s-05-segmented-control) | Retain or rebuild capability under linked proposed contract |
| acme-tab | [S-06](inventory/selection.md#s-06-tabs) | Retain or rebuild capability under linked proposed contract |
| acme-tab-panel | [S-06](inventory/selection.md#s-06-tabs) | Retain or rebuild capability under linked proposed contract |
| acme-table | [D-01](inventory/data-displays.md#d-01-table) | Retain or rebuild capability under linked proposed contract |
| acme-tabs | [S-06](inventory/selection.md#s-06-tabs) | Retain or rebuild capability under linked proposed contract |
| acme-tag | [A-09](inventory/actions.md#a-09-badge-pill-and-tag) | Retain or rebuild capability under linked proposed contract |
| acme-tags | [A-09](inventory/actions.md#a-09-badge-pill-and-tag) | Remove old interface; use linked replacement/recipe |
| acme-task | [recipes](inventory/surfaces.md#required-recipes-and-migration-mapping) | Remove old interface; use linked replacement/recipe |
| acme-tasks | [recipes](inventory/surfaces.md#required-recipes-and-migration-mapping) | Remove old interface; use linked replacement/recipe |
| acme-text-copy | [A-05](inventory/actions.md#a-05-copy-button) | Remove old interface; use linked replacement/recipe |
| acme-textarea | [F-03](inventory/inputs-forms.md#f-03-textarea) | Retain or rebuild capability under linked proposed contract |
| acme-theme-switcher | [A-10](inventory/actions.md#a-10-theme-switcher) | Retain or rebuild capability under linked proposed contract |
| acme-tile | [recipes](inventory/surfaces.md#required-recipes-and-migration-mapping) | Remove old interface; use linked replacement/recipe |
| acme-tiles | [recipes](inventory/surfaces.md#required-recipes-and-migration-mapping) | Remove old interface; use linked replacement/recipe |
| acme-toast | [M-02](inventory/messages-statistics.md#m-02-toast-and-viewport) | Retain or rebuild capability under linked proposed contract |
| acme-toaster | [M-02](inventory/messages-statistics.md#m-02-toast-and-viewport) | Retain or rebuild capability under linked proposed contract |
| acme-toggle | [S-04](inventory/selection.md#s-04-switch) | Retain or rebuild capability under linked proposed contract |
| acme-toolbar | [N-02](inventory/navigation-disclosure.md#n-02-toolbar) | Retain or rebuild capability under linked proposed contract |
| acme-tooltip | [O-04](inventory/overlays-help.md#o-04-tooltip) | Retain or rebuild capability under linked proposed contract |
| acme-topbar | [N-01](inventory/navigation-disclosure.md#n-01-app-bar) | Remove old interface; use linked replacement/recipe |
| acme-trend | [M-07](inventory/messages-statistics.md#m-07-stat) | Remove old interface; use linked replacement/recipe |
| acme-video | [RC-07](inventory/rich-content.md#rc-07-video) | Retain or rebuild capability under linked proposed contract |

## Selected additions and exclusions

The [machine-readable ledger](evidence/full-proposal-coverage-2026-09-20.json) also carries all thirty numbered extension requirements, plus the complete family lists in the group proposals. These include Theme/Box/layout additions, formatters, Group/card selection, Field/List/Item, generalized Tree/TOC/Sidebar, Accordion/Show/Hover Card/Toggle Tip, Alert Dialog, native behavior ports, Resizable, Flow Diagram, React, consumer skills/Intent/MCP and the optional inspector.

SSR, live AI component control, a design-system TanStack Table engine, the Zag machine/runtime/adapter, Flow Diagram editing/execution and compatibility aliases remain excluded. Q14 selects core Tree scope, Q15 includes coordinated Pagination parts, and Q08 excludes inspector editing. Presence in a reference example is not automatic adoption.

## Reference ownership and census treatment

| Family area | Reference ownership |
| --- | --- |
| Core layout | Chakra/Radix concepts plus selected house semantics/tokens; no decorative Geist Grid parity claim |
| Remaining layout | Separator retains house/Geist line treatment; Inset uses Radix capability; Scroll Area and Resizable use selected native behavior ports |
| Typography | Existing Code/Kbd/Middle Truncate retain their baseline; new Text/Heading/inline primitives use house typography with Chakra/Radix semantics; formatters use verified Chakra/Ark behavior |
| Actions/identity | Existing Button/Avatar/Badge/Pill/Tag/Split/Copy treatments retain baseline except approved changes; Toggle Button follows its Radix/Chakra comparison; icons use Material Symbols |
| Selection | Checkbox/Radio/Switch retain baseline controls; Tabs primary indicator uses Material and inset uses Peter's reference; selection cards/Segmented use Chakra/composition decisions |
| Inputs/forms | Existing Input/Textarea/Search/Slider/Calendar are baseline sources; Number/Pin use Zag behavior ports; new non-native Select/Field use their recorded comparisons and native forms |
| Surfaces/content | Card consolidates approved surfaces; Item follows shadcn; List/Data List follow Chakra/Radix meaning with house native-content adaptation; Disabled Wall retains its distinct house role |
| Navigation/disclosure | Existing menu/command/breadcrumb actions retain relevant baseline behavior; App Bar/Sidebar/TOC use the full mixed reference review; Tree/Accordion/Collapsible/Show/Steps/Timeline follow their assigned decisions |
| Messages/statistics | Alert/Banner/Spinner/Progress/Skeleton use baseline treatments with selected semantic changes; Toast interaction follows Base UI; Stat follows Chakra/Pro; Meter keeps Gauge's circular display with corrected meaning |
| Overlays/help | Dialog/Drawer share native house architecture and recorded source comparisons; Alert Dialog includes Base composition; Tooltip retains baseline except selected no-shadow; Hover Card/Toggle Tip follow Chakra purposes plus house activation rules |
| Data displays | Table keeps house appearance with consumer-owned native content; Pagination follows Chakra/Pro; Chart uses mandated TanStack; Flow Diagram uses ELK and Peter's visual reference |
| Rich content | Retained source families keep assigned baseline; Markdown/JSON/native-content adaptations are explicitly house proposals |
| Documentation/tooling | House contract informed by CEM/Web Awesome/Spectrum/Material and AG Grid/Intent/Devtools research; not Geist element census targets |

For each surviving reference-derived visual, retain/migrate the relevant census fixture and name only approved differences. New house/Chakra/Radix families use their own reference/behavior acceptance rather than claim a nonexistent Geist census. Presence or absence of a similarly named source file is not the reference classification.

### Coverage verification scope

A fresh AST snapshot finds 150 registered classes in 150 source files; every tag has one destination and none is unknown. All thirty extension records are carried through. Public metadata extraction is static and may include implementation members until CEM classification; it is not browser behavior evidence. The final capture checks local links, table structure, JSON and the existing 870 protected-file hashes.
