---
id: RES-038
status: resolved # in-progress | resolved
outcome: answered
kind: research
from: IDEA-001#02
date: 2026-11-12
---
# RES-038: Components, parts and recipes of release 0.3.3

## Question
Which components, parts and recipes does release 0.3.3 of the ACMElabs design system ship, and which decision records chose their names?

## Answer
Answered. The sufficient-answer condition is met. The record gives facts and sources only. It gives no recommendation and no opinion on what 1.0 keeps.

Sufficient answer: (1) every component that 0.3.3 ships, with its custom element tag, its glossary or docs name, and its parts (sub-elements, named slots, CSS parts); (2) every recipe that 0.3.3 documents; (3) for each component name, the DEC record that chose or changed it, or the statement that none does; (4) the counts; (5) the 0.3.3 components with no RES-037 concept, and the RES-037 concepts held by four or more systems that 0.3.3 lacks; (6) a repeatable method.

### Counts
- 184 public component elements with the `acme-` prefix, not counting icons. Each has one source folder in `src/components/`, one entry in `src/define/` and one in `src/register/`.
- 2 internal elements: `acme-overlay-theme` and `acme-selection-indicator`. They live in `src/internal/` and have no docs page.
- 4,135 icon elements (`acme-*-icon`), one for each Material Symbols artwork (DEC-046). They are listed by count only.
- 100 component docs pages. Each page is one component name and groups its elements. A 101st page, Forms, is a guide with no element.
- 32 distinct named-slot names on 66 public elements. 103 distinct CSS-part names on 168 public elements.
- 17 recipe records on the docs site. 9 more page-level CSS recipes are bundled into `dashboard.css`; the docs describe these only as a group, in one README sentence.
- The naming table has 102 rows: 100 docs pages and 2 internal elements. 15 rows have a DEC record that renames, replaces or chooses between names. 35 more rows have a DEC record that adds or keeps the component under its name. 52 rows have no DEC record about the name. In the Avatar and Button rows, the record covers only Avatar Group and Toggle Button.

### How to read the tables
- "Component" is the docs page title in `site/pages/components/*.ts`. It matches the glossary's name where the glossary has the term.
- "Elements" are the tags that the docs page lists in its `tags` array. The first tag is the root; the other tags are its sub-elements.
- "Slots" and "CSS parts" are the `@slot` and `@csspart` annotations on the element's class and its parent classes. "(default)" is the unnamed slot. A dash means none is annotated.
- The tag of an element is its key in the source's `HTMLElementTagNameMap` declaration. `scripts/entries.ts` reads the same key to write `src/define/` and `src/register/`.

### Components: names, naming records and RES-037 match
"Naming records" lists the DEC records from DEC-001 to DEC-116 that put the component in the library under this name. "(rename)" marks a record that replaced or chose between names. "None" means no DEC record chooses or changes the name; records that only set behaviour are not listed. "RES-037 concept" gives the concept row and how many of the five reference systems have it.

| Component | Elements (root first) | Naming records | RES-037 concept (systems) |
|---|---|---|---|
| Accordion | accordion, accordion-item, accordion-trigger, accordion-content | DEC-001; DEC-029 (rename: replaces Collapse Group) | Accordion (4) |
| Alert | alert | DEC-062 (rename: Error removed; Alert for section messages) | Alert (4) |
| Alert Dialog | alert-dialog, alert-dialog-trigger, alert-dialog-action, alert-dialog-cancel | DEC-028 (replaces Destructive Modal) | Alert Dialog (3) |
| App Bar | app-bar, app-bar-start, app-bar-content, app-bar-end | DEC-005 (rename: Appbar and Topbar into App Bar) | none |
| Avatar | avatar, avatar-group | Avatar: none. Avatar Group: DEC-006 | Avatar (5); RES-037 lists Group as a part for shadcn/ui and Chakra UI |
| Badge | badge, pill | none | Badge (4); Pill has no concept of its own |
| Banner | banner | DEC-062 | Banner (1) |
| Book | book | none | Book (1) |
| Box | box | DEC-009 | Box (2) |
| Breadcrumbs | breadcrumbs, breadcrumb | none | Breadcrumb (3) |
| Browser | browser | none | Browser (1) |
| Button | button, icon-button, toggle-button | Button and Icon Button: none. Toggle Button: DEC-111 (rename: replaces Chip) | Button (4); Icon Button (2); Toggle (2) |
| Calendar | calendar | none | Calendar (3) |
| Card | card, card-header, card-body, card-footer | DEC-012 (rename: absorbs Panel and Link Card) | Card (3) |
| Chart | chart | DEC-070 (selected to return) | Chart (1) |
| Checkbox | checkbox, checkbox-group, checkbox-card | none | Checkbox (5); Checkbox Group (1); Checkbox Cards (2) |
| Code | code | none | Code (2, typography row); Geist's Code is a separate data-display row (1) |
| Code Block | code-block | none (DEC-016 and DEC-017 set composition only) | Code Block (3) |
| Collapsible | collapsible, collapsible-trigger, collapsible-content | DEC-029 (rename: replaces Collapse) | Collapsible (3) |
| ComboBox | combobox, option | none | Combobox (3) |
| Command Menu | command-menu, command-group, command-item, command-separator | none | Command (3) |
| Context Menu | context-menu | none | Context Menu (4) |
| Copy Button | copy-button | none (DEC-016 sets composition only) | Copy Button (2) |
| Data List | data-list | DEC-023 (rename: replaces Description) | Data List (2) |
| Dialog | dialog, dialog-trigger, dialog-close | DEC-028 | Dialog (5) |
| Disabled Wall | disabled-wall | none | none |
| Drawer | drawer, drawer-trigger, drawer-close | none | Drawer (2) by name; Chakra's Drawer sits in the Sheet row (3). Which row matches by purpose was not checked |
| Empty State | empty-state, empty-state-content, empty-state-indicator | DEC-032 | Empty State (3) |
| Feedback | feedback | DEC-036 | Feedback (1) |
| Field | field | DEC-037 | Field (2) |
| Fieldset | fieldset | DEC-038 | Fieldset (2) |
| Flex | flex | none | Flex (2) |
| Flow Diagram | flow-diagram, flow-node | DEC-040 | none |
| Format Byte | format-byte | DEC-042 | Format Byte (1) |
| Format Number | format-number | DEC-042 | Format Number (1) |
| Grid | grid | DEC-051 | Grid (3) |
| Group | group | DEC-045 (rename: Group instead of ButtonGroup); DEC-112 | Group (1) |
| Heading | heading | DEC-001; DEC-108 (Heading chosen over Title as the term) | Heading (2) |
| Hover Card | hover-card | DEC-001; DEC-076 (Context Card removed) | Hover Card (5) |
| Icon Tile | icon-tile | none | none |
| Input | input | none | Input (4) |
| Inset | inset | none | Bleed (2), where Radix Themes calls it Inset |
| Item | item, item-media, item-content, item-heading, item-description, item-metadata, item-actions | DEC-050 (rename: replaces Entity) | Item (2) |
| JSON View | json-view | none | JSON View (1) |
| Keyboard Input | kbd | none | Kbd (4) |
| Label | label | none | Label (3) |
| Legend | legend, legend-item | none | none |
| Link | link | none | Link (2) |
| List | list | DEC-054 | List (1) |
| Load More | load-more | none | Load More Button (1) |
| Markdown | markdown | DEC-070 (selected to return) | none by name |
| Menu | menu, menu-trigger, menu-content, menu-item, menu-section, menu-separator | DEC-031 (rename: replaces Dots Menu) | Dropdown Menu (5), where Chakra UI and Geist call it Menu |
| Meter | meter | DEC-063 (rename: Gauge to Meter) | Gauge (1) |
| Middle Truncate | middle-truncate | none | MiddleTruncate (1) |
| Multi Select | multi-select (uses option) | none | Multi Select (1) |
| Number Input | number-input, number-input-increment, number-input-decrement | DEC-071 | Number Input (1) |
| Pagination | pagination, pagination-previous, pagination-next, pagination-item, pagination-ellipsis, pagination-position, pagination-page-size | DEC-087 | Pagination (3) |
| Password Input | password-input | none | Password Input (2) |
| Pin Input | pin-input, pin-input-field | DEC-078 | Input OTP (3), where Chakra UI calls it Pin Input |
| Progress | progress | none | Progress (5) |
| Quote | quote | none | Quote (1) and Blockquote (2); the docs page covers inline and block quotations |
| Radio | radio, radio-group, radio-card | none | Radio Group (5); Radio (1); Radio Cards (2) |
| Relative Time | relative-time | DEC-083 (text only; the card becomes a recipe) | Relative Time Card (1) is the nearest name; its card part is the 0.3.3 recipe "Relative Time details" |
| Resizable | resizable, resizable-panel, resize-handle | DEC-084 | Resizable (2) |
| Scroll Area | scroll-area, scroll-viewport, scrollbar, scroll-thumb, scroll-corner, scroll-button | DEC-089 | Scroll Area (4) |
| Search | search | none | Search Input (1) |
| Segmented Control | segmented-control, segmented-control-item | DEC-090 | Segmented Control (3) |
| Select | select, option | none | Select (5) |
| Separator | separator | none | Separator (5) |
| Show | show | DEC-001 | Show (1) |
| Show More | show-more | none | Show More (1) |
| Sidebar | sidebar, sidebar-trigger, sidebar-content | DEC-085 | Sidebar (1) |
| Simple Grid | simple-grid | DEC-051 | SimpleGrid (1) |
| Skeleton | skeleton | none | Skeleton (4) |
| Slider | slider | none | Slider (5) |
| Snippet | snippet | none | Snippet (1) |
| Sparkline | sparkline | none. The rename Spark to Sparkline is in docs/design/component-vocabulary.md, not a DEC record | none |
| Spinner | spinner | none (DEC-055 removes Loading Dots) | Spinner (4) |
| Split Button | split-button, split-button-item | none | Split Button (1) |
| Stack | stack, h-stack, v-stack | DEC-098 | Stack (1) |
| Stat | stat, stat-label, stat-value, stat-unit, stat-description, stat-change, stat-footer | DEC-100 (Trend and Tile removed) | Stat (1) |
| Status | status | none | Status (2) |
| Steps | steps, step, step-trigger, step-content, steps-previous, steps-next | DEC-103 | Steps (1) |
| Strong | strong | none | Strong (1) |
| Switch | switch | No record of its own. DEC-090 and DEC-111 state that the earlier Toggle-to-Switch rename stands | Switch (5) |
| Table | table | none (DEC-107 sets TanStack Table support only) | Table (4) |
| Table of Contents | toc | DEC-106 | none |
| Tabs | tabs, tab, tab-panel | none (DEC-061 sets the indicator only) | Tabs (5) |
| Tag | tag | none | Tag (1) |
| Text | text | DEC-001 | Text (2) |
| Textarea | textarea | none | Textarea (4) |
| Theme | theme | none (DEC-022 sets theme scope only) | Theme (2) |
| Theme Switcher | theme-switcher | none | Theme Switcher (1) |
| Timeline | timeline, timeline-item | none | Timeline (1) |
| Toast | toast, toast-viewport | DEC-062 (Toast for brief action results); DEC-110 sets behaviour | Toast (4) |
| Toggle Tip | toggle-tip | DEC-076 | Toggle Tip (1) |
| Toolbar | toolbar | DEC-070 (selected to return); DEC-112 | Toolbar (1) |
| Tooltip | tooltip | DEC-076 | Tooltip (5) |
| Tree View | tree-view, tree-item | DEC-043 (rename: File Tree into Tree View) | Tree View (1); File Tree (1) is now the recipe "File tree presentation" |
| Video | video | none | Video (1) |
| (internal) Selection Indicator | selection-indicator | DEC-097 | none |
| (internal) Overlay Theme | overlay-theme | none | none |

### Comparison with RES-037
0.3.3 components with no matching concept in RES-037 (matched by name, or by the purpose that the glossary and docs lede state):
- App Bar
- Disabled Wall
- Flow Diagram
- Icon Tile
- Legend (with Legend Item)
- Markdown (no concept of that name; Chakra UI's Prose is the only rich-text concept, and the purpose match was not checked)
- Sparkline
- Table of Contents (TOC)
- Pill (on the Badge page; no concept of its own)
- The internal Overlay Theme and Selection Indicator

RES-037 concepts that four or five systems have and 0.3.3 lacks:
- Aspect Ratio (4). 0.3.3 has no element for it. Box and the other layout elements take an `aspect-ratio` input.
- Popover (4). 0.3.3 has no `acme-popover` element.

All other 26 concepts that four or five systems have match a 0.3.3 component.

### What remains open
- The parts come from source annotations. The generated manifest `dist/custom-elements.json` was absent, and the brief forbade a build. So the record does not show whether the manifest adds or drops a slot or part.
- The matches to RES-037 were made by one reader from names and docs ledes. No match went to a second checker. The Drawer, Quote, Inset, Markdown and Relative Time rows note where two readings are possible.

### Elements and their parts
One row for each element. The internal elements come last. Icon elements are left out. The source line is the class declaration.

| Docs page (component name) | Element | Class source | Slots | CSS parts |
|---|---|---|---|---|
| Accordion | `acme-accordion` | src/components/accordion/accordion.ts:17 | (default) | `root` |
| Accordion | `acme-accordion-item` | src/components/accordion-item/accordion-item.ts:14 | (default) | `item` |
| Accordion | `acme-accordion-trigger` | src/components/accordion-trigger/accordion-trigger.ts:8 | (default) | `trigger`, `label`, `indicator` |
| Accordion | `acme-accordion-content` | src/components/accordion-content/accordion-content.ts:6 | (default) | `content` |
| Alert | `acme-alert` | src/components/alert/alert.ts:19 | (default), `heading`, `start`, `end`, `actions` | `root`, `icon`, `heading`, `content`, `end`, `actions`, `close` |
| Alert Dialog | `acme-alert-dialog` | src/components/alert-dialog/alert-dialog.ts:5 | `trigger`, `heading`, `description`, `header`, (default), `footer` | `root`, `surface`, `header`, `heading`, `description`, `body`, `footer` |
| Alert Dialog | `acme-alert-dialog-trigger` | src/components/alert-dialog-trigger/alert-dialog-trigger.ts:5 | (default) | — |
| Alert Dialog | `acme-alert-dialog-action` | src/components/alert-dialog-action/alert-dialog-action.ts:3 | (default), `start`, `end` | `root`, `label`, `start`, `end`, `spinner` |
| Alert Dialog | `acme-alert-dialog-cancel` | src/components/alert-dialog-cancel/alert-dialog-cancel.ts:5 | (default) | — |
| App Bar | `acme-app-bar` | src/components/app-bar/app-bar.ts:19 | (default), `start`, `end` | `root`, `start`, `content`, `end` |
| App Bar | `acme-app-bar-start` | src/components/app-bar-start/app-bar-start.ts:8 | (default) | `root` |
| App Bar | `acme-app-bar-content` | src/components/app-bar-content/app-bar-content.ts:8 | (default) | `root` |
| App Bar | `acme-app-bar-end` | src/components/app-bar-end/app-bar-end.ts:8 | (default) | `root` |
| Avatar | `acme-avatar` | src/components/avatar/avatar.ts:24 | `fallback`, `badge` | `root`, `image`, `fallback`, `badge` |
| Avatar | `acme-avatar-group` | src/components/avatar-group/avatar-group.ts:21 | `overflow` | `root`, `member`, `overflow` |
| Badge | `acme-badge` | src/components/badge/badge.ts:16 | (default), `start`, `end` | `root` |
| Badge | `acme-pill` | src/components/pill/pill.ts:14 | (default), `start`, `end` | `root` |
| Banner | `acme-banner` | src/components/banner/banner.ts:17 | (default), `heading`, `start`, `end`, `actions` | `root`, `icon`, `heading`, `content`, `end`, `actions`, `close` |
| Book | `acme-book` | src/components/book/book.ts:43 | `illustration`, `start` | `root`, `cover`, `spine`, `content` |
| Box | `acme-box` | src/components/box/box.ts:8 | (default) | `root` |
| Breadcrumbs | `acme-breadcrumbs` | src/components/breadcrumbs/breadcrumbs.ts:16 | (default) | `root`, `list` |
| Breadcrumbs | `acme-breadcrumb` | src/components/breadcrumb/breadcrumb.ts:14 | (default), `separator` | `item`, `link`, `separator` |
| Browser | `acme-browser` | src/components/browser/browser.ts:21 | (default) | `root`, `chrome`, `address`, `content` |
| Button | `acme-button` | src/components/button/button.ts:15 | (default), `start`, `end` | `root`, `label`, `start`, `end`, `spinner` |
| Button | `acme-icon-button` | src/components/icon-button/icon-button.ts:9 | (default) | `root`, `icon`, `spinner` |
| Button | `acme-toggle-button` | src/components/toggle-button/toggle-button.ts:16 | (default), `start`, `end` | `root`, `label`, `start`, `end`, `spinner` |
| Calendar | `acme-calendar` | src/components/calendar/calendar.ts:39 | `trigger`, `footer` | `root`, `trigger`, `content`, `header`, `grid`, `day`, `time` |
| Card | `acme-card` | src/components/card/card.ts:13 | (default) | `root` |
| Card | `acme-card-header` | src/components/card-header/card-header.ts:9 | (default) | `header` |
| Card | `acme-card-body` | src/components/card-body/card-body.ts:9 | (default) | `body` |
| Card | `acme-card-footer` | src/components/card-footer/card-footer.ts:9 | (default) | `footer` |
| Chart | `acme-chart` | src/components/chart/chart.ts:29 | `header`, `legend`, `tooltip`, `empty` | `root`, `plot`, `axes`, `grid`, `tooltip`, `data` |
| Checkbox | `acme-checkbox` | src/components/checkbox/checkbox.ts:16 | (default), `description` | `root`, `control`, `indicator`, `label`, `description` |
| Checkbox | `acme-checkbox-group` | src/components/checkbox-group/checkbox-group.ts:37 | (default) | `root` |
| Checkbox | `acme-checkbox-card` | src/components/checkbox-card/checkbox-card.ts:17 | (default), `heading`, `description`, `start`, `end`, `actions` | `content`, `root`, `control`, `indicator`, `label`, `description` |
| Code | `acme-code` | src/components/code/code.ts:13 | (default) | `root` |
| Code Block | `acme-code-block` | src/components/code-block/code-block.ts:38 | `header`, `start`, `end`, `footer`, `empty` | `root`, `header`, `code`, `line`, `line-number`, `footer` |
| Collapsible | `acme-collapsible` | src/components/collapsible/collapsible.ts:13 | (default) | `root` |
| Collapsible | `acme-collapsible-trigger` | src/components/collapsible-trigger/collapsible-trigger.ts:8 | (default) | `trigger`, `label`, `indicator` |
| Collapsible | `acme-collapsible-content` | src/components/collapsible-content/collapsible-content.ts:6 | (default) | `content` |
| ComboBox | `acme-combobox` | src/components/combobox/combobox.ts:31 | (default), `start`, `end`, `empty`, `footer` | `root`, `input`, `content`, `list`, `section` |
| ComboBox | `acme-option` (also on the Select page) | src/components/option/option.ts:20 | (default), `start`, `end`, `description` | `root`, `indicator`, `content` |
| Command Menu | `acme-command-menu` | src/components/command-menu/command-menu.ts:41 | (default), `empty`, `loading`, `error`, `footer` | `root`, `dialog`, `input`, `list`, `empty`, `loading` |
| Command Menu | `acme-command-group` | src/components/command-group/command-group.ts:14 | (default), `heading` | `group`, `heading` |
| Command Menu | `acme-command-item` | src/components/command-item/command-item.ts:19 | (default), `start`, `end`, `description` | `item`, `label`, `description`, `start`, `end` |
| Command Menu | `acme-command-separator` | src/components/command-separator/command-separator.ts:6 | — | `separator` |
| Context Menu | `acme-context-menu` | src/components/context-menu/context-menu.ts:9 | (default), `content`, `trigger` | — |
| Copy Button | `acme-copy-button` | src/components/copy-button/copy-button.ts:18 | (default), `start`, `end` | `root`, `icon` |
| Data List | `acme-data-list` | src/components/data-list/data-list.ts:14 | (default) | `root` |
| Dialog | `acme-dialog` | src/components/dialog/dialog.ts:34 | `trigger`, `heading`, `description`, `header`, (default), `footer` | `root`, `surface`, `header`, `heading`, `description`, `body`, `footer` |
| Dialog | `acme-dialog-trigger` | src/components/dialog-trigger/dialog-trigger.ts:5 | (default) | — |
| Dialog | `acme-dialog-close` | src/components/dialog-close/dialog-close.ts:5 | (default) | — |
| Disabled Wall | `acme-disabled-wall` | src/components/disabled-wall/disabled-wall.ts:17 | (default), `explanation` | `root`, `content`, `explanation` |
| Drawer | `acme-drawer` | src/components/drawer/drawer.ts:35 | `trigger`, `heading`, `description`, `header`, (default), `footer` | `root`, `surface`, `header`, `heading`, `description`, `body`, `footer` |
| Drawer | `acme-drawer-trigger` | src/components/drawer-trigger/drawer-trigger.ts:5 | (default) | — |
| Drawer | `acme-drawer-close` | src/components/drawer-close/drawer-close.ts:5 | (default) | — |
| Empty State | `acme-empty-state` | src/components/empty-state/empty-state.ts:21 | (default), `indicator`, `heading`, `description`, `actions` | `root`, `indicator`, `content`, `heading`, `description`, `actions` |
| Empty State | `acme-empty-state-content` | src/components/empty-state-content/empty-state-content.ts:8 | (default) | `root` |
| Empty State | `acme-empty-state-indicator` | src/components/empty-state-indicator/empty-state-indicator.ts:8 | (default) | `root` |
| Feedback | `acme-feedback` | src/components/feedback/feedback.ts:30 | `heading`, `description`, `actions`, (default) | `root`, `form`, `rating`, `message`, `email`, `topic`, `actions` |
| Field | `acme-field` | src/components/field/field.ts:29 | (default), `label`, `help`, `error` | `root`, `label`, `control`, `help`, `error` |
| Fieldset | `acme-fieldset` | src/components/fieldset/fieldset.ts:18 | (default), `legend`, `help`, `error` | `root` |
| Flex | `acme-flex` | src/components/flex/flex.ts:11 | (default) | `root` |
| Flow Diagram | `acme-flow-diagram` | src/components/flow-diagram/flow-diagram.ts:34 | (default) | `root`, `viewport`, `background`, `node`, `edge`, `edge-label`, `controls` |
| Flow Diagram | `acme-flow-node` | src/components/flow-node/flow-node.ts:14 | (default) | `node`, `label` |
| Format Byte | `acme-format-byte` | src/components/format-byte/format-byte.ts:11 | — | `root` |
| Format Number | `acme-format-number` | src/components/format-number/format-number.ts:11 | — | `root` |
| Grid | `acme-grid` | src/components/grid/grid.ts:13 | (default) | `root` |
| Group | `acme-group` | src/components/group/group.ts:24 | (default) | `root` |
| Heading | `acme-heading` | src/components/heading/heading.ts:11 | (default) | `root` |
| Hover Card | `acme-hover-card` | src/components/hover-card/hover-card.ts:12 | (default), `content` | `root`, `content`, `arrow` |
| Icon Tile | `acme-icon-tile` | src/components/icon-tile/icon-tile.ts:15 | (default) | `root` |
| Input | `acme-input` | src/components/input/input.ts:23 | `start`, `end`, `start-addon`, `end-addon` | `root`, `input`, `start`, `end`, `start-addon`, `end-addon`, `clear` |
| Inset | `acme-inset` | src/components/inset/inset.ts:10 | (default) | `root` |
| Item | `acme-item` | src/components/item/item.ts:11 | (default) | `root` |
| Item | `acme-item-media` | src/components/item-media/item-media.ts:9 | (default) | `media` |
| Item | `acme-item-content` | src/components/item-content/item-content.ts:9 | (default) | `content` |
| Item | `acme-item-heading` | src/components/item-heading/item-heading.ts:9 | (default) | `heading` |
| Item | `acme-item-description` | src/components/item-description/item-description.ts:9 | (default) | `description` |
| Item | `acme-item-metadata` | src/components/item-metadata/item-metadata.ts:9 | (default) | `metadata` |
| Item | `acme-item-actions` | src/components/item-actions/item-actions.ts:9 | (default) | `actions` |
| JSON View | `acme-json-view` | src/components/json-view/json-view.ts:35 | — | `root`, `item`, `key`, `value`, `toggle` |
| Keyboard Input | `acme-kbd` | src/components/kbd/kbd.ts:14 | (default) | `root` |
| Label | `acme-label` | src/components/label/label.ts:15 | (default) | `root` |
| Legend | `acme-legend` | src/components/legend/legend.ts:10 | (default) | `root` |
| Legend | `acme-legend-item` | src/components/legend-item/legend-item.ts:15 | (default) | `item`, `swatch`, `label` |
| Link | `acme-link` | src/components/link/link.ts:17 | (default), `start`, `end` | `root`, `start`, `end` |
| List | `acme-list` | src/components/list/list.ts:20 | (default) | `root` |
| Load More | `acme-load-more` | src/components/load-more/load-more.ts:13 | (default), `start`, `end` | — |
| Markdown | `acme-markdown` | src/components/markdown/markdown.ts:29 | — | `root` |
| Menu | `acme-menu` | src/components/menu/menu.ts:27 | `trigger`, (default) | — |
| Menu | `acme-menu-trigger` | src/components/menu-trigger/menu-trigger.ts:9 | (default), `start`, `end` | — |
| Menu | `acme-menu-content` | src/components/menu-content/menu-content.ts:10 | (default) | `root` |
| Menu | `acme-menu-item` | src/components/menu-item/menu-item.ts:22 | (default), `start`, `end`, `description`, `submenu` | `root` |
| Menu | `acme-menu-section` | src/components/menu-section/menu-section.ts:13 | (default) | `root`, `heading` |
| Menu | `acme-menu-separator` | src/components/menu-separator/menu-separator.ts:7 | — | `root` |
| Meter | `acme-meter` | src/components/meter/meter.ts:21 | — | `root`, `track`, `range`, `value` |
| Middle Truncate | `acme-middle-truncate` | src/components/middle-truncate/middle-truncate.ts:153 | — | — |
| Multi Select | `acme-multi-select` | src/components/multi-select/multi-select.ts:18 | (default), `trigger`, `start`, `end`, `empty`, `footer` | `root`, `trigger`, `value`, `content`, `list` |
| Number Input | `acme-number-input` | src/components/number-input/number-input.ts:51 | (default), `start`, `end`, `start-addon`, `end-addon` | `root`, `input`, `control`, `increment`, `decrement`, `clear` |
| Number Input | `acme-number-input-increment` | src/components/number-input-increment/number-input-increment.ts:7 | (default) | `root` |
| Number Input | `acme-number-input-decrement` | src/components/number-input-decrement/number-input-decrement.ts:7 | (default) | `root` |
| Pagination | `acme-pagination` | src/components/pagination/pagination.ts:24 | (default) | `root`, `navigation` |
| Pagination | `acme-pagination-previous` | src/components/pagination-previous/pagination-previous.ts:5 | (default) | `item` |
| Pagination | `acme-pagination-next` | src/components/pagination-next/pagination-next.ts:5 | (default) | `item` |
| Pagination | `acme-pagination-item` | src/components/pagination-item/pagination-item.ts:7 | (default) | `item` |
| Pagination | `acme-pagination-ellipsis` | src/components/pagination-ellipsis/pagination-ellipsis.ts:7 | — | `item` |
| Pagination | `acme-pagination-position` | src/components/pagination-position/pagination-position.ts:10 | — | `position` |
| Pagination | `acme-pagination-page-size` | src/components/pagination-page-size/pagination-page-size.ts:12 | — | `page-size` |
| Password Input | `acme-password-input` | src/components/password-input/password-input.ts:18 | `start`, `end`, `start-addon`, `end-addon` | `root`, `input`, `reveal` |
| Pin Input | `acme-pin-input` | src/components/pin-input/pin-input.ts:29 | (default) | `root`, `field` |
| Pin Input | `acme-pin-input-field` | src/components/pin-input-field/pin-input-field.ts:18 | — | `root`, `input` |
| Progress | `acme-progress` | src/components/progress/progress.ts:24 | (default) | `root`, `track`, `range`, `label` |
| Quote | `acme-quote` | src/components/quote/quote.ts:11 | (default) | `root` |
| Radio | `acme-radio` | src/components/radio/radio.ts:18 | (default), `description` | `root`, `control`, `indicator`, `label`, `description` |
| Radio | `acme-radio-group` | src/components/radio-group/radio-group.ts:13 | (default) | `root` |
| Radio | `acme-radio-card` | src/components/radio-card/radio-card.ts:17 | (default), `heading`, `description`, `start`, `end`, `actions` | `content`, `root`, `control`, `indicator`, `label`, `description` |
| Relative Time | `acme-relative-time` | src/components/relative-time/relative-time.ts:11 | — | `root` |
| Resizable | `acme-resizable` | src/components/resizable/resizable.ts:90 | (default) | `root` |
| Resizable | `acme-resizable-panel` | src/components/resizable-panel/resizable-panel.ts:16 | (default) | `panel` |
| Resizable | `acme-resize-handle` | src/components/resize-handle/resize-handle.ts:15 | — | `handle`, `indicator` |
| Scroll Area | `acme-scroll-area` | src/components/scroll-area/scroll-area.ts:21 | (default), `controls` | `root`, `surface` |
| Scroll Area | `acme-scroll-viewport` | src/components/scroll-viewport/scroll-viewport.ts:12 | (default) | `viewport`, `content` |
| Scroll Area | `acme-scrollbar` | src/components/scrollbar/scrollbar.ts:17 | (default) | `scrollbar` |
| Scroll Area | `acme-scroll-thumb` | src/components/scroll-thumb/scroll-thumb.ts:13 | (default) | `thumb` |
| Scroll Area | `acme-scroll-corner` | src/components/scroll-corner/scroll-corner.ts:8 | — | `corner` |
| Scroll Area | `acme-scroll-button` | src/components/scroll-button/scroll-button.ts:15 | (default) | `button` |
| Search | `acme-search` | src/components/search/search.ts:17 | `start`, `end`, `start-addon`, `end-addon` | `root`, `input`, `clear` |
| Segmented Control | `acme-segmented-control` | src/components/segmented-control/segmented-control.ts:15 | (default) | `root`, `indicator` |
| Segmented Control | `acme-segmented-control-item` | src/components/segmented-control-item/segmented-control-item.ts:19 | (default) | `root`, `item`, `control`, `label` |
| Select | `acme-select` | src/components/select/select.ts:21 | (default), `trigger`, `start`, `end`, `start-addon`, `end-addon`, `empty`, `footer` | `root`, `trigger`, `content`, `list`, `clear` |
| Separator | `acme-separator` | src/components/separator/separator.ts:15 | — | `root` |
| Show | `acme-show` | src/components/show/show.ts:18 | (default), `fallback` | `content`, `fallback` |
| Show More | `acme-show-more` | src/components/show-more/show-more.ts:19 | (default), `start`, `end` | — |
| Sidebar | `acme-sidebar` | src/components/sidebar/sidebar.ts:27 | (default), `trigger` | `root`, `content`, `trigger`, `surface` |
| Sidebar | `acme-sidebar-trigger` | src/components/sidebar-trigger/sidebar-trigger.ts:9 | (default) | — |
| Sidebar | `acme-sidebar-content` | src/components/sidebar-content/sidebar-content.ts:12 | (default), `collapsed` | `root`, `content`, `collapsed` |
| Simple Grid | `acme-simple-grid` | src/components/simple-grid/simple-grid.ts:10 | (default) | `root` |
| Skeleton | `acme-skeleton` | src/components/skeleton/skeleton.ts:15 | (default) | `root`, `content` |
| Slider | `acme-slider` | src/components/slider/slider.ts:38 | `start`, `end` | `root`, `track`, `range`, `thumb`, `label` |
| Snippet | `acme-snippet` | src/components/snippet/snippet.ts:18 | `start`, `end` | `root`, `code`, `prompt`, `actions` |
| Sparkline | `acme-sparkline` | src/components/sparkline/sparkline.ts:17 | — | `root`, `line`, `fill` |
| Spinner | `acme-spinner` | src/components/spinner/spinner.ts:22 | — | `root` |
| Split Button | `acme-split-button` | src/components/split-button/split-button.ts:19 | (default), `start`, `end`, `items` | `root`, `primary`, `trigger`, `menu` |
| Split Button | `acme-split-button-item` | src/components/split-button-item/split-button-item.ts:3 | (default), `start`, `end`, `description`, `submenu` | `root` |
| Stack | `acme-stack` | src/components/stack/stack.ts:7 | (default) | `root`, `separator` |
| Stack | `acme-h-stack` | src/components/h-stack/h-stack.ts:4 | (default) | `root`, `separator` |
| Stack | `acme-v-stack` | src/components/v-stack/v-stack.ts:4 | (default) | `root`, `separator` |
| Stat | `acme-stat` | src/components/stat/stat.ts:15 | (default) | `root` |
| Stat | `acme-stat-label` | src/components/stat-label/stat-label.ts:8 | (default) | `label` |
| Stat | `acme-stat-value` | src/components/stat-value/stat-value.ts:9 | (default) | `value` |
| Stat | `acme-stat-unit` | src/components/stat-unit/stat-unit.ts:8 | (default) | `unit` |
| Stat | `acme-stat-description` | src/components/stat-description/stat-description.ts:8 | (default) | `description` |
| Stat | `acme-stat-change` | src/components/stat-change/stat-change.ts:17 | (default) | `root`, `change`, `indicator` |
| Stat | `acme-stat-footer` | src/components/stat-footer/stat-footer.ts:8 | (default) | `footer` |
| Status | `acme-status` | src/components/status/status.ts:19 | (default) | `root`, `indicator`, `label` |
| Steps | `acme-steps` | src/components/steps/steps.ts:30 | (default), `panels`, `completed`, `actions` | `root`, `list`, `panels`, `completed`, `actions` |
| Steps | `acme-step` | src/components/step/step.ts:13 | (default) | `item`, `separator` |
| Steps | `acme-step-trigger` | src/components/step-trigger/step-trigger.ts:17 | (default), `indicator` | `trigger`, `indicator`, `label` |
| Steps | `acme-step-content` | src/components/step-content/step-content.ts:12 | (default) | `content` |
| Steps | `acme-steps-previous` | src/components/steps-previous/steps-previous.ts:5 | (default) | — |
| Steps | `acme-steps-next` | src/components/steps-next/steps-next.ts:5 | (default) | — |
| Strong | `acme-strong` | src/components/strong/strong.ts:8 | (default) | `root` |
| Switch | `acme-switch` | src/components/switch/switch.ts:18 | (default) | `root`, `control`, `thumb`, `label` |
| Table | `acme-table` | src/components/table/table.ts:22 | (default) | `root`, `viewport` |
| Table of Contents | `acme-toc` | src/components/toc/toc.ts:25 | — | `root`, `list`, `item`, `link`, `indicator` |
| Tabs | `acme-tabs` | src/components/tabs/tabs.ts:23 | (default), `panels` | `root`, `list`, `indicator`, `panels` |
| Tabs | `acme-tab` | src/components/tab/tab.ts:19 | (default), `start`, `end` | `root`, `tab`, `label` |
| Tabs | `acme-tab-panel` | src/components/tab-panel/tab-panel.ts:14 | (default) | `panel` |
| Tag | `acme-tag` | src/components/tag/tag.ts:13 | (default), `start`, `end` | `root` |
| Text | `acme-text` | src/components/text/text.ts:10 | (default) | `root` |
| Textarea | `acme-textarea` | src/components/textarea/textarea.ts:16 | — | `root`, `textarea` |
| Theme | `acme-theme` | src/components/theme/theme.ts:19 | — | — |
| Theme Switcher | `acme-theme-switcher` | src/components/theme-switcher/theme-switcher.ts:16 | — | `root`, `control` |
| Timeline | `acme-timeline` | src/components/timeline/timeline.ts:16 | (default) | `root` |
| Timeline | `acme-timeline-item` | src/components/timeline-item/timeline-item.ts:20 | (default), `indicator`, `date`, `heading`, `description` | `item`, `indicator`, `connector`, `content`, `date`, `heading`, `description` |
| Toast | `acme-toast` | src/components/toast/toast.ts:27 | (default) | `root`, `content`, `action` |
| Toast | `acme-toast-viewport` | src/components/toast-viewport/toast-viewport.ts:24 | (default) | `root`, `viewport`, `list`, `announcer` |
| Toggle Tip | `acme-toggle-tip` | src/components/toggle-tip/toggle-tip.ts:23 | `trigger`, (default) | `trigger`, `content`, `arrow`, `close` |
| Toolbar | `acme-toolbar` | src/components/toolbar/toolbar.ts:18 | (default), `start`, `end` | `root`, `content`, `start`, `end` |
| Tooltip | `acme-tooltip` | src/components/tooltip/tooltip.ts:12 | (default), `content` | `root`, `content`, `arrow` |
| Tree View | `acme-tree-view` | src/components/tree-view/tree-view.ts:29 | (default) | `root`, `item`, `content`, `indicator`, `children` |
| Tree View | `acme-tree-item` | src/components/tree-item/tree-item.ts:19 | (default), `start`, `end`, `description` | `root`, `start`, `label`, `description`, `end` |
| Video | `acme-video` | src/components/video/video.ts:29 | `fallback` | `root`, `video` |
| (internal, no page) | `acme-overlay-theme` | src/internal/overlay-theme/overlay-theme.ts:11 | — | — |
| (internal, no page) | `acme-selection-indicator` | src/internal/selection-indicator/selection-indicator.ts:21 | — | `paint` |


### Recipes on the docs site
The recipe records in `site/recipes.ts` become docs pages through `recipeDocs()`. "Components" is the union of the `components` arrays that the record's examples declare. An empty cell means the examples declare none.

| Recipe id | Heading | Examples | Components the examples declare |
|---|---|---|---|
| managed-forms | Managed forms | 2 | — |
| settings-rows | Settings rows | 1 | button, card, card-body, card-footer, field, item, item-content, item-description, item-heading, stack, switch |
| integration-cards | Integration cards | 1 | badge, button, card, card-body, card-footer, card-header, heading, text |
| selectable-stats | Selectable statistics | 1 | group, radio-card, radio-group, stat, stat-label, stat-value |
| file-tree | File tree presentation | 1 | description-icon, folder-icon, tree-item, tree-view |
| responsive-panes | Responsive list, detail and supporting panes | 2 | grid, heading, list, data-list |
| input-addons | External input add-ons | 2 | button, input, language-icon, group |
| typed-confirmation | Typed confirmation | 2 | alert-dialog, alert-dialog-action, alert-dialog-cancel, alert-dialog-trigger, field, input |
| results-pagination | Results pagination | 2 | pagination, pagination-ellipsis, pagination-item, pagination-next, pagination-page-size, pagination-position, pagination-previous |
| virtualized-table | Virtualized Table consumers | 2 | button, h-stack |
| experimental-worker-table | Experimental Table workers | 2 | — |
| relative-time-details | Relative Time details | 1 | data-list, hover-card, relative-time |
| document-navigation | Adjacent-document navigation | 1 | stack |
| measurement-cards | Measurement cards | 1 | card, card-body, card-header, heading, simple-grid, stat, stat-label, stat-value |
| measurement-rows | Progress and measurement rows | 1 | item, item-content, item-description, item-heading, list, meter, progress |
| task-rows | Application task rows | 1 | button, item, item-actions, item-content, item-heading, list, snippet |
| checkbox-rows | Checkbox rows | 1 | checkbox, field |

### Page-level CSS recipes in dashboard.css
`scripts/build.ts` joins nine compiled style sources into `dist/styles/dashboard.css`. The README calls them "the page-level recipes the Vercel dashboard composes in light DOM". No docs page, example or consumer skill names their classes.

| Recipe source | Classes it defines (first selectors) |
|---|---|
| deploy | bar-list, deploy-list, deploy-row, project-row |
| plan | icon-row, icon-rows, plan-head, section-title |
| usage-sum | usage-sum |
| classes | classes |
| severity | issue, severity |
| option | option, options |
| info-ic | check-circle, info-ic |
| rail | rail, with-rail |
| code | code |

### Method, to repeat the list
Run every step from the repository root on branch v1. No step builds the project.

1. Confirm the release. `packages/core/package.json` gives version 0.3.3. `git diff --stat v0.3.3 HEAD -- src site/pages` is empty. Since the tag, `site/recipes.ts` changed only in its reference paths.
2. List the elements. `ls src/components` gives 184 folders. `ls src/define | grep -v -- '-icon.ts$'` gives the same 184 names. `src/internal/` holds the 2 internal elements.
3. Read each tag from the `HTMLElementTagNameMap` key in `src/components/<name>/<name>.ts`, as `scripts/entries.ts` does.
4. Read the parts. Collect the `@slot` and `@csspart` lines from the class's JSDoc. Follow the `extends` chain through `src/shared/` and `src/base.ts`, and add the parent classes' annotations.
5. Read the names. Each `site/pages/components/<page>.ts` has a `title` and a `tags` array. Every public tag is on exactly one page, except `acme-option`, which is on the ComboBox and Select pages.
6. Read the recipes. Import `site/recipes.ts` with Bun and read the exported `recipes` array. Read the `recipes` list in `scripts/build.ts` for the CSS recipes.
7. Find the naming records. Read the titles in `docs/history/decision-index-0.3.md`. Search `docs/decisions/DEC-0*.md`, `DEC-10*.md` and `DEC-11[0-6]*.md` for each component name, and read the decision paragraph of each hit.
8. Compare with RES-037. Extract the concept rows from its "names" tables. Match each docs page by name, then by the purpose in the glossary and the docs lede.

## Findings
- The core package manifest states version 0.3.3. Source: packages/core/package.json:3, checked 2026-11-12.
- The branch v1 is at tag v0.3.3 plus 52 commits. Between the tag and HEAD, `src/` and `site/pages/` are unchanged. `site/recipes.ts` changed only in its reference paths. Source: `git describe --tags`, `git diff --stat v0.3.3 HEAD -- src site scripts styles packages` and `git diff v0.3.3 HEAD -- site/recipes.ts`, checked 2026-11-12.
- `src/components/` has 184 component folders. `src/define/` has 4,319 entries: the same 184 names plus 4,135 icon entries. `src/register/` matches `src/define/`. Source: src/components/, src/define/, src/register/, checked 2026-11-12.
- The registration generator takes each tag from a `HTMLElementTagNameMap` key and marks a class in `src/internal/` as internal. Source: scripts/entries.ts:108-140, checked 2026-11-12.
- Two internal elements exist: `acme-overlay-theme` and `acme-selection-indicator`. Source: src/internal/overlay-theme/overlay-theme.ts, src/internal/selection-indicator/selection-indicator.ts, checked 2026-11-12.
- `dist/custom-elements.json` is absent in this worktree. No other generated documentation record is present. Source: `ls dist`, `ls .artifacts`, `ls packages/mcp/dist`, checked 2026-11-12.
- 100 docs pages list component tags, and the Forms page lists none. Together the pages cover all 184 public tags. Only `acme-option` appears on two pages. Source: site/pages/components/*.ts (`title` and `tags` fields), checked 2026-11-12.
- The slots and CSS parts in the element table are the `@slot` and `@csspart` annotations on each class and its parent classes. Source: src/components/*/*.ts and src/shared/*.ts, for example src/shared/layout-element.ts:18-19 and src/shared/stack-element.ts:13-15, checked 2026-11-12.
- The docs site has 17 recipe records. Source: site/recipes.ts:96, 116, 135, 154, 166, 178, 199, 211, 223, 235, 263, 302, 321, 338, 355, 372, 391, checked 2026-11-12.
- The build joins nine style sources into the `document/dashboard` style. Source: scripts/build.ts:38-47, checked 2026-11-12.
- The README calls `dashboard.css` the carrier of "the page-level recipes the Vercel dashboard composes in light DOM". Source: README.md:33-34, checked 2026-11-12.
- The glossary defines a recipe as "a documented arrangement of shared components for a particular use". Source: GLOSSARY.md:17-19, checked 2026-11-12.
- DEC-005 replaces Appbar and Topbar with App Bar. DEC-023 replaces Description with Data List. DEC-043 turns File Tree into Tree View. DEC-045 uses Group instead of ButtonGroup. DEC-063 renames Gauge to Meter. DEC-111 replaces Chip with Toggle Button. Source: docs/decisions/DEC-005-app-bar.md:9, DEC-023-data-list.md:9, DEC-043-general-tree-view.md:9, DEC-045-group-presentation.md:9, DEC-063-meter-component.md:9, DEC-111-toggle-button.md:9, checked 2026-11-12.
- DEC-012 folds Panel and Link Card into Card. DEC-029 replaces Collapse and Collapse Group with Accordion and Collapsible. DEC-031 replaces Dots Menu with Menu. DEC-050 replaces the Entity purpose with Item. DEC-062 removes Error and places messages in Toast, Alert or Banner. DEC-076 removes Context Card. DEC-028 adds Alert Dialog and removes Destructive Modal. DEC-108 chooses Heading over Title. Source: docs/decisions/DEC-012-canonical-card.md:9, DEC-029-disclosure-components.md:9, DEC-031-dots-menu-composition.md:9, DEC-050-item-content-family.md:9, DEC-062-message-context-and-errors.md:9, DEC-076-overlay-help-components.md:9, DEC-028-dialog-components.md:9 and :15, DEC-108-text-role-vocabulary.md:9, checked 2026-11-12.
- No DEC record from 001 to 116 is itself the Toggle-to-Switch rename. DEC-090 and DEC-111 state that the earlier rename stands. Source: docs/decisions/DEC-090-segmented-control.md:9, docs/decisions/DEC-111-toggle-button.md:15, search of docs/decisions for "Toggle becomes" and "Toggle-to-Switch", checked 2026-11-12.
- The rename of Spark to Sparkline is in the component vocabulary record, not in a DEC record. Source: docs/design/component-vocabulary.md:74, checked 2026-11-12.
- DEC-070 selects Toolbar, Chart and Markdown to return. Source: docs/decisions/DEC-070-non-canonical-elements.md:15, checked 2026-11-12.
- RES-037 has 13 concepts in all five systems and 15 in four. Of these 28, only Aspect Ratio and Popover have no 0.3.3 element. Source: docs/research/RES-037-component-comparison-matrix.md:44, 60-62, 100, 131, 157-163, 221-222, 238, 257-260, 283, 296-300, 324-325, 356, checked 2026-11-12.
- Layout elements take an `aspect-ratio` input. Source: src/shared/layout-element.ts:48, checked 2026-11-12.

## Follow-ups
None.

## Next action
None.
