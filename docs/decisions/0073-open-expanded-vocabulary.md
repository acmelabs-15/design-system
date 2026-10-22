# Distinguish Open, Expanded and Visible

Use open for floating surfaces such as Dialog, Menu and Popover, expanded for disclosure content and hierarchy such as Accordion sections and Tree View branches, and visible for actual presentation where needed. Peter selected “Distinguish them” over using open for both overlay and disclosure state.

Decided 2026-09-19 by Peter.

These words do not require several competing state properties on each component. A closing animation can leave content visible after its open state changes. Native attributes such as aria-expanded keep their platform meaning.

Exact root/item state shapes, controlled values and transition lifetime belong to the later [overlay/help](../../spec/SPEC-overlays-help.md) and [navigation/disclosure](../../spec/SPEC-navigation-disclosure.md) contracts. This decision supersedes the old Collapse open name for Accordion/Collapsible disclosure state.

Evidence: [terminology record](../design/component-vocabulary.md#open-expanded-and-visible), [answer](../verification/systematization/phase-2-closure-2026-09-19.json).
