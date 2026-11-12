# Design-system specifications

This index routes the shared design-system contracts and the approved maintainer-workflow migration. One workflow serves all five packages. A specification describes a capability, which can cross package directories.

| Work | Status | Specification |
|---|---|---|
| MCP dependency advisory, [issue #9](https://github.com/acmelabs-15/design-system/issues/9) | Completed 2026-10-27; 0.3.3 published; issue closed | No contract change; [plan](../../specs/SPEC-004-documentation-tooling/tasks/plan.md), [tasks](../../specs/SPEC-004-documentation-tooling/tasks/todo.md), [release record](../releases/0.3.3.md) |
| Maintainer workflow | Completed and merged, 2026-10-22 | [Maintainer workflow](../../specs/SPEC-008-maintainer-workflow/spec.md), [plan](../../specs/SPEC-008-maintainer-workflow/tasks/plan.md), [tasks](../../specs/SPEC-008-maintainer-workflow/tasks/todo.md) |
| Released design system | Version 0.3.3 is the latest release; converted contracts retain whole-set approval and explicit later resolutions | [Design-system contract](../../specs/SPEC-003-design-system/spec.md), [release record](../releases/0.3.3.md) |

The [current status](../agents/workspace.md#session-state) owns activation, progress and the active task. Design approval, released implementation and present verification results are distinct.

## Product contracts

| Capability | Specification |
| --- | --- |
| Shared state, styling, themes and forms | [Foundations](../../specs/SPEC-005-foundations/spec.md) |
| Box, Flex, Stack, Grid, Group, Scroll Area and Resizable | [Core layout](../../specs/SPEC-003-design-system/spec.md#core-layout-contract) and [remaining layout](../../specs/SPEC-007-layout/spec.md) |
| Text, headings, formatting and time | [Typography](../../specs/SPEC-015-typography/spec.md) |
| Buttons, icons, identity and theme selection | [Actions](../../specs/SPEC-001-actions/spec.md) |
| Checkbox, Radio, Switch, Segmented Control and Tabs | [Selection](../../specs/SPEC-013-selection/spec.md) |
| Text and numeric controls, Calendar, Field and native forms | [Inputs and forms](../../specs/SPEC-006-inputs-forms/spec.md) |
| Card, Item, List, Data List and Disabled Wall | [Surfaces](../../specs/SPEC-014-surfaces/spec.md) |
| Navigation, menus, trees and disclosure | [Navigation and disclosure](../../specs/SPEC-010-navigation-disclosure/spec.md) |
| Notifications, progress, measurements and statistics | [Messages and statistics](../../specs/SPEC-009-messages-statistics/spec.md) |
| Dialogs, drawers and help | [Overlays and help](../../specs/SPEC-011-overlays-help/spec.md) |
| Tables, pagination, charts and flow diagrams | [Data displays](../../specs/SPEC-002-data-displays/spec.md) |
| Code, Markdown, JSON, Book and media | [Rich content](../../specs/SPEC-012-rich-content/spec.md) |
| Five-package delivery, React, documentation and consumer tooling | [Documentation and tooling](../../specs/SPEC-004-documentation-tooling/spec.md) |

The [replacement map](systematization/component-coverage.md) accounts for the original 150 tags and selected additions. Completed replacements remain final. Their history and former phase gates are supporting records, not an implementation queue.

## Scope and new work

The product targets browser-rendered HTML, Lit and React. Server rendering remains excluded. Applications own data fetching and processing; a Query/DB data layer remains deferred scope. A separate approved task is needed to change those choices.

For new work, brain owns specification, planning, implementation, verification, review and shipping. Existing accepted requirements stay intact until an explicit supported revision changes them. Current code alone does not authorize a contract change. Preserve incomplete work when a new request arrives.
