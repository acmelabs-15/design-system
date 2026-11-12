---
id: DEC-088
migrated: 0.8
kind: architecture
decided: 2026-09-19
---
# Open interactive rich help by explicit activation

Rich help containing links or buttons opens through click, tap or keyboard activation. It does not automatically open on pointer hover. Peter selected explicit activation after comparing Material's persistent rich tooltip and Chakra's Toggle Tip built from Popover.

Decided 2026-09-19 by Peter.

Plain tooltips and supplementary hover previews remain separate behaviours. The later [help-component decision](DEC-076-overlay-help-components.md) adds a named Toggle Tip and removes Context Card. Tooltip and Hover Card retain distinct purposes; exact overlay interfaces and accessibility belong to the later [overlay/help contract](../../specs/SPEC-011-overlays-help/spec.md).

Material Web's inspected repository provides tooltip tokens but no Tooltip Lit component. Use the published guidance as guidance, not as evidence of a shipped Lit implementation.

Evidence: [overlay research](../research/RES-011-floating-surface-shadows.md#phase-1-extension-toast-and-rich-help).
