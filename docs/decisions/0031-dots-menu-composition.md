# Replace Dots Menu with Menu and Icon Button

Remove Dots Menu as a separate component. Provide complete Menu plus Icon Button examples for row and card actions, with horizontal or vertical dots, meaningful accessible labels, disabled states and keyboard operation. Peter selected “Menu composition” over keeping the convenience wrapper.

Decided 2026-09-19 by Peter.

The inspected Dots Menu delegated interaction to Menu; it added a fixed icon, trigger appearance, placement/width defaults and event forwarding. Chakra and Radix allow different controls to serve as menu triggers. Reusing that interface avoids a second menu contract tied to an icon.

Verify trigger naming, focus return, selection and dismissal through the normal Menu inventory, including actions that open Alert Dialog. The wrapper decision does not itself approve the entire Menu interface or import every reference default.

Evidence: [source and reference review](../research/06-codebase-systematization.md#disclosure-layout-and-smaller-component-dispositions), [selection record](../verification/systematization/disposition-checkpoint-2026-09-19.json).

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../spec/SPEC-design-system.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
