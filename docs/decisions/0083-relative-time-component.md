# Make Relative Time a standalone text component

Rebuild Relative Time as reusable localized timestamp text that can update as time passes. Provide the detailed UTC/local-time popup as a separate Hover Card composition. Peter selected “Text plus composition” over retaining the integrated time card or leaving all formatting to applications.

Decided 2026-09-19 by Peter.

The component reviewed on 2026-09-19 required Context Card and mixed timestamp formatting with fixed popup content and placement properties. Standalone Relative Time elements in Web Awesome and GitHub demonstrate reuse without a required popup. Removing Context Card therefore does not remove relative-time capability.

The later [typography contract](../../spec/SPEC-typography.md) defines input dates, locale inheritance, past/future values, epoch zero, invalid/absent dates, refresh timing, time semantics, accessible absolute details and time zones. The 2026-09-19 implementation hardcoded English and mishandled future/zero timestamps; those defects were not selected behavior. No third-party formatter runtime is newly selected.

Evidence: [time review](../research/06-codebase-systematization.md#disclosure-layout-and-smaller-component-dispositions), [selection record](../verification/systematization/disposition-checkpoint-2026-09-19.json).
