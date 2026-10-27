# Design-system specifications

This index routes the shared design-system contracts and the approved maintainer-workflow migration. One workflow serves all five packages. A specification describes a capability, which can cross package directories.

| Work | Status | Specification |
|---|---|---|
| MCP dependency advisory, [issue #9](https://github.com/acmelabs-15/design-system/issues/9) | Plan approved by Peter, 2026-10-27 | No contract change; [plan](../tasks/plan.md), [tasks](../tasks/todo.md) |
| Maintainer workflow | Completed and merged, 2026-10-22 | [Maintainer workflow](SPEC-maintainer-workflow.md), [plan](../tasks/done/maintainer-workflow/plan.md), [tasks](../tasks/done/maintainer-workflow/todo.md) |
| Released design system | Version 0.3.2 is released; converted contracts retain whole-set approval and explicit later resolutions | [Design-system contract](SPEC-design-system.md), [release record](../docs/releases/0.3.2.md) |

The [current status](../docs/STATUS.md) owns activation, progress and the active task. Design approval, released implementation and present verification results are distinct.

## Product contracts

| Capability | Specification |
| --- | --- |
| Shared state, styling, themes and forms | [Foundations](SPEC-foundations.md) |
| Box, Flex, Stack, Grid, Group, Scroll Area and Resizable | [Core layout](SPEC-design-system.md#core-layout-contract) and [remaining layout](SPEC-layout.md) |
| Text, headings, formatting and time | [Typography](SPEC-typography.md) |
| Buttons, icons, identity and theme selection | [Actions](SPEC-actions.md) |
| Checkbox, Radio, Switch, Segmented Control and Tabs | [Selection](SPEC-selection.md) |
| Text and numeric controls, Calendar, Field and native forms | [Inputs and forms](SPEC-inputs-forms.md) |
| Card, Item, List, Data List and Disabled Wall | [Surfaces](SPEC-surfaces.md) |
| Navigation, menus, trees and disclosure | [Navigation and disclosure](SPEC-navigation-disclosure.md) |
| Notifications, progress, measurements and statistics | [Messages and statistics](SPEC-messages-statistics.md) |
| Dialogs, drawers and help | [Overlays and help](SPEC-overlays-help.md) |
| Tables, pagination, charts and flow diagrams | [Data displays](SPEC-data-displays.md) |
| Code, Markdown, JSON, Book and media | [Rich content](SPEC-rich-content.md) |
| Five-package delivery, React, documentation and consumer tooling | [Documentation and tooling](SPEC-documentation-tooling.md) |

The [replacement map](component-coverage.md) accounts for the original 150 tags and selected additions. Completed replacements remain final. Their history and former phase gates are supporting records, not an implementation queue.

## Scope and new work

The product targets browser-rendered HTML, Lit and React. Server rendering remains excluded. Applications own data fetching and processing; a Query/DB data layer remains deferred scope. A separate approved task is needed to change those choices.

For new work, brain owns specification, planning, implementation, verification, review and shipping. Existing accepted requirements stay intact until an explicit supported revision changes them. Current code alone does not authorize a contract change. Preserve incomplete work when a new request arrives.
