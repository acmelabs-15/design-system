Decided 2026-09-19 by Peter.

# Provide Accordion and Collapsible

Provide Accordion for coordinated related headings and panels, and Collapsible for one independent expandable section. Peter selected “Accordion and Collapsible” rather than making Accordion cover every disclosure. Share the expansion and motion implementation. Remove the old Collapse and Collapse Group interfaces during migration.

Show remains conditional rendering; it is not the disclosure control. Fold is separately [selected for removal](component-removals.md). Preserve its compact-summary/expanded-detail use as a composition where needed.

Chakra and Radix both distinguish coordinated Accordion from independent Collapsible. Current Collapse already supports standalone and grouped use, but its default-expanded behaviour is not automatically the new contract. Exact parts, one/multiple-open defaults, mounting, focus and shared motion remain inventory work.

Evidence: [disclosure and disposition review](../analysis/codebase-systematization.md#disclosure-layout-and-smaller-component-dispositions), [selection record](../alignment/evidence/disposition-checkpoint-2026-09-19.json).
