Decided 2026-09-19 by Peter.

# Provide Dialog and Alert Dialog with shared behaviour

Provide Dialog and a distinct Alert Dialog component. Alert Dialog serves important prompts that expect a response. Use the [shadcn Base UI Alert Dialog](https://ui.shadcn.com/docs/components/base/alert-dialog) as a concrete composition reference, alongside Radix, Chakra, Material guidance and Material Web's Lit implementation. Share the house dialog behaviour and stack; no separate React behaviour engine is selected.

This supersedes Peter's immediately preceding “Dialog examples” choice insofar as that choice offered only one public Dialog component. Peter then explicitly requested Alert Dialog in addition to Dialog. Preserve this final direction rather than treating the earlier vote as current.

Remove Destructive Modal. Typed-phrase confirmation remains a complete tested composition of the appropriate dialog and shared form controls. The application owns the action and its result. In shadcn's inspected Base version, Action wraps an ordinary Button while Cancel wraps the Close primitive; confirmation does not itself establish successful completion or automatic closure.

Exact focus targets, Escape/outside dismissal, nested Menu/Dialog transitions, busy-state cancellation, typed-value reset and failure handling remain inventory work. Current Destructive Modal disables both buttons during loading while still accepting Escape/outside dismissal; Material guidance says not to disable dismissive actions. Resolve that policy explicitly rather than copy either. Material's general first-focus rule must be checked against the needs of each confirmation task; no focus default is selected here.

Material's four Dialog tabs were read, both token sets expanded in Default Light, and all six specification figures inspected. The full-screen measurement figure shows 64 for the header region while the table/token says 56; no house measurement is selected from that discrepancy. Visual tokens, motion and accessibility remain unverified in the house implementation.

Evidence: [overlay review](../analysis/floating-surface-shadows.md#phase-2-overlay-dispositions), [Material coverage](../alignment/evidence/material-dialog-review-2026-09-19.json), [decision and revision record](../alignment/evidence/disposition-checkpoint-2026-09-19.json).
