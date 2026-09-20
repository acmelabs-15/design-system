Decided 2026-09-19 by Peter.

# Distinguish Open, Expanded and Visible

Use open for floating surfaces such as Dialog, Menu and Popover, expanded for disclosure content and hierarchy such as Accordion sections and Tree View branches, and visible for actual presentation where needed. Peter selected “Distinguish them” over using open for both overlay and disclosure state.

These words do not require several competing state properties on each component. A closing animation can leave content visible after its open state changes. Native attributes such as aria-expanded keep their platform meaning.

Exact root/item state shapes, controlled values and transition lifetime remain inventory work. Update the newly selected Accordion/Collapsible contracts to this later naming decision rather than copying the old Collapse open property.

Evidence: [terminology record](../alignment/terms.md#open-expanded-and-visible), [answer](../alignment/evidence/phase-2-closure-2026-09-19.json).
