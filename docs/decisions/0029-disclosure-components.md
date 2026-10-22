# Provide Accordion and Collapsible

Provide Accordion for coordinated related headings and panels, and Collapsible for one independent expandable section. Peter selected “Accordion and Collapsible” rather than making Accordion cover every disclosure. Share the expansion and motion implementation. Remove the old Collapse and Collapse Group interfaces during migration.

Decided 2026-09-19 by Peter.

Show remains conditional rendering; it is not the disclosure control. Fold is separately [selected for removal](0015-component-removals.md). Preserve its compact-summary/expanded-detail use as a composition where needed.

Chakra and Radix both distinguish coordinated Accordion from independent Collapsible. The inspected Collapse supported standalone and grouped use, but its default-expanded behaviour is not automatically the new contract. Exact parts, one/multiple-open defaults, mounting, focus and shared motion were still inventory work at selection time.

Evidence: [disclosure and disposition review](../research/06-codebase-systematization.md#disclosure-layout-and-smaller-component-dispositions), [selection record](../verification/systematization/disposition-checkpoint-2026-09-19.json).

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../spec/SPEC-design-system.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
