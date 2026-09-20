Decided 2026-09-19 by Peter.

# Open interactive rich help by explicit activation

Rich help containing links or buttons opens through click, tap or keyboard activation. It does not automatically open on pointer hover. Peter selected explicit activation after comparing Material's persistent rich tooltip and Chakra's Toggle Tip built from Popover.

Plain tooltips and supplementary hover previews remain separate behaviours. The later [help-component decision](overlay-help-components.md) adds a named Toggle Tip and removes Context Card. Tooltip and Hover Card retain distinct purposes; exact overlay interfaces and accessibility remain inventory work.

Material Web's inspected repository provides tooltip tokens but no Tooltip Lit component. Use the published guidance as guidance, not as evidence of a shipped Lit implementation.

Evidence: [overlay research](../analysis/floating-surface-shadows.md#phase-1-extension-toast-and-rich-help).
