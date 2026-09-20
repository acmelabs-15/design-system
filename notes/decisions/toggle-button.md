Decided 2026-09-19 by Peter.

# Replace Chip with a Toggle Button capability

Provide Toggle Button within the Button family, replacing the current Chip interface. Peter selected “Toggle Button” over a dedicated contextual Chip family. Preserve the native button's persistent pressed state, disabled handling and change notification. Shape is presentation, so a pill appearance does not create a second control concept.

Radix Toggle matches the current behaviour; Chakra's published Toggle composes with Button. Material FilterChip also uses a pressed button, but its broader Chip family adds removal, trailing actions and collection contracts that are not selected here.

Persistent pressed state differs from transient pointer pressing. Group arranges controls; it does not impose exclusive selection. Segmented Control uses the separately selected Radio Group behaviour. The existing Toggle-to-Switch rename stands; do not reintroduce the ambiguous Toggle name for this new capability.

Exact tags, state properties/events, controlled behaviour and form participation remain inventory work. The house Lit/TanStack Store/Lit Motion approach stands. Material Chips article bodies were read; dynamic tokens and sixteen specification figures were not visually inspected. No complete visual or browser acceptance is claimed.

Evidence: [closure comparison](../analysis/codebase-systematization.md#phase-2-closure-review), [answers and research limits](../alignment/evidence/phase-2-closure-2026-09-19.json).
