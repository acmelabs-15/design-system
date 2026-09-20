Decided 2026-09-19 by Peter.

# Make Relative Time a standalone text component

Rebuild Relative Time as reusable localized timestamp text that can update as time passes. Provide the detailed UTC/local-time popup as a separate Hover Card composition. Peter selected “Text plus composition” over retaining the integrated time card or leaving all formatting to applications.

The current component requires Context Card and mixes timestamp formatting with fixed popup content and placement properties. Standalone Relative Time elements in Web Awesome and GitHub demonstrate reuse without a required popup. Removing Context Card therefore does not remove relative-time capability.

Define input dates, locale inheritance, past/future values, epoch zero, invalid/absent dates, refresh timing, time semantics, accessible absolute details and time zones in the inventory. The current implementation hardcodes English and mishandles future/zero timestamps; preserve useful behaviour, not those defects. No third-party formatter runtime is newly selected.

Evidence: [time review](../analysis/codebase-systematization.md#disclosure-layout-and-smaller-component-dispositions), [selection record](../alignment/evidence/disposition-checkpoint-2026-09-19.json).
