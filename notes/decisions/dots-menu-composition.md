Decided 2026-09-19 by Peter.

# Replace Dots Menu with Menu and Icon Button

Remove Dots Menu as a separate component. Provide complete Menu plus Icon Button examples for row and card actions, with horizontal or vertical dots, meaningful accessible labels, disabled states and keyboard operation. Peter selected “Menu composition” over keeping the convenience wrapper.

The current Dots Menu already delegates interaction to Menu; it adds a fixed icon, trigger appearance, placement/width defaults and event forwarding. Chakra and Radix allow different controls to serve as menu triggers. Reusing that interface avoids a second menu contract tied to an icon.

Verify trigger naming, focus return, selection and dismissal through the normal Menu inventory, including actions that open Alert Dialog. The wrapper decision does not itself approve the entire Menu interface or import every reference default.

Evidence: [source and reference review](../analysis/codebase-systematization.md#disclosure-layout-and-smaller-component-dispositions), [selection record](../alignment/evidence/disposition-checkpoint-2026-09-19.json).
