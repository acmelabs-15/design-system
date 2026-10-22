# Provide Dialog and Alert Dialog with shared behaviour

Provide Dialog and a distinct Alert Dialog component. Alert Dialog serves important prompts that expect a response. Use the [shadcn Base UI Alert Dialog](https://ui.shadcn.com/docs/components/base/alert-dialog) as a concrete composition reference, alongside Radix, Chakra, Material guidance and Material Web's Lit implementation. Share dialog behaviour and stack; no separate React behaviour engine is selected.

Decided 2026-09-19 by Peter.

This supersedes Peter's immediately preceding “Dialog examples” choice insofar as that choice offered only one public Dialog component. Peter then explicitly requested Alert Dialog in addition to Dialog. Preserve this final direction rather than treating the earlier vote as current.

Remove Destructive Modal. Typed-phrase confirmation remains a complete tested composition of the appropriate dialog and shared form controls. The application owns the action and its result. In shadcn's inspected Base version, Action wraps an ordinary Button while Cancel wraps the Close primitive; confirmation does not itself establish successful completion or automatic closure.

Exact focus targets, Escape/outside dismissal, nested Menu/Dialog transitions, busy-state cancellation, typed-value reset and failure handling were still inventory work at selection time. The inspected Destructive Modal disabled both buttons during loading while accepting Escape/outside dismissal; Material guidance says not to disable dismissive actions. The decision required an explicit policy rather than copying either behavior. Material's general first-focus rule must be checked against the needs of each confirmation task; no focus default is selected here.

Material's four Dialog tabs were read, both token sets expanded in Default Light, and all six specification figures inspected. The full-screen measurement figure shows 64 for the header region while the table/token says 56; no component measurement is selected from that discrepancy. That source review did not verify implementation visual tokens, motion or accessibility.

Evidence: [overlay review](../research/11-floating-surface-shadows.md#phase-2-overlay-dispositions), [Material coverage](../verification/systematization/material-dialog-review-2026-09-19.json), [decision and revision record](../verification/systematization/disposition-checkpoint-2026-09-19.json).

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../spec/SPEC-design-system.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
