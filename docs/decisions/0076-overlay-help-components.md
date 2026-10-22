# Keep Tooltip, Hover Card and Toggle Tip; remove Context Card

Provide Tooltip for short non-interactive help, Hover Card for supplementary richer previews, and a named Toggle Tip component for help opened by click, tap or keyboard activation. Peter explicitly requested Toggle Tip and said there is no need for Context Card. Context Card is removed outright.

Decided 2026-09-19 by Peter.

Peter suggested Hover Card could replace the rich Tooltip variation. Map rich supplementary previews there; simple formatting or a keyboard-shortcut label alone does not require a Hover Card. Interactive rich help keeps the earlier [explicit-activation rule](0088-rich-help-activation.md), using Toggle Tip rather than automatically opening on hover.

Chakra's Toggle Tip composes Popover; share underlying overlay behaviour without adding a second engine. This choice does not settle the full general Popover interface, Hover Card keyboard/touch access, essential-content alternatives, delays or exact parts. Chakra's documented accessibility limits are comparison evidence, not approved component behavior. Each migrated use requires the correct content and interaction pattern. The later [overlay/help contract](../../spec/SPEC-overlays-help.md) records the detailed interfaces and acceptance criteria.

Evidence: [overlay analysis](../research/11-floating-surface-shadows.md#phase-2-overlay-dispositions), [selection record](../verification/systematization/disposition-checkpoint-2026-09-19.json).
