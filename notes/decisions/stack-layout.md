Decided 2026-09-19 by Peter.

# Give stacks shared spacing and clear directions

Stack, HStack and VStack default to house spacing token 2. The [2026-09-20 spacing decision](layout-spacing-properties.md#font-relative-house-spacing) makes its planned default 0.5rem, equivalent to 8px at a 16px root font; the unchanged source still uses 8px. Authors can override gap, including zero. The default follows root-font, theme and density settings rather than freezing a literal 8px value.

This is the visual default. Under Peter's later [omitted styling input rule](layout-spacing-properties.md#omitted-styling-inputs-and-visual-defaults), an unset gap property reads undefined; CSS supplies step 2. Explicit gap values read back as supplied. Apply the same distinction to CSS styling inputs such as alignItems; semantic capabilities retain their own contracts. The default/override probe covers two padding properties, not the final Stack/separator implementation.

HStack and VStack keep their named horizontal and vertical directions in their component interfaces. Use general Stack when direction changes responsively. This is the component property contract, not a claim that consumer CSS cannot override layout. Exact shared properties, remaining defaults and tag spellings still require the complete inventory entry.

Chakra Stack uses a 0.5rem default gap; its named wrappers explicitly supply row/column, although its broad CSS props offer another override path. Peter selected the clearer fixed-direction interface for the house named stacks. Pro source usage and the inspected implementation are recorded in the [contract checkpoint](../alignment/evidence/layout-contract-review-2026-09-19.json). Stack-family inclusion and its distinction from Group remain the [earlier decision](group-presentation.md#ordinary-layout-and-tags).

## Alignment and separators

Peter selected Chakra's alignment defaults: general Stack stretches children across its layout direction; HStack and VStack centre children across theirs. Authors can override alignItems. Chakra's general Stack defaults to a column; that remains the source-supported draft direction default for the complete house entry.

Provide optional automatic house separators in Stack, HStack and VStack, off by default. Explicit Separator composition remains available. Define separator orientation, hidden-child handling and accessible presentation before approving the entry. This capability does not select arbitrary React elements or repeated custom-template cloning as an interface.

The complete Pro sidebar-with-collapsible/sidebar.tsx and charts-00/stat-card.tsx demonstrate separators in vertical Stack and HStack. They were re-read after a census of all 938 indexed JSX/TSX files found these two direct separator attributes. Source usage is not house runtime verification. [Evidence and answers](../alignment/evidence/query-stack-grid-review-2026-09-19.json).

## Separator spacing and wrapped lines

Decided 2026-09-20 by Peter: match Chakra's separator spacing. Apply the configured gap on each side of a visible automatic separator. The distance between adjacent items is therefore two gaps plus divider thickness. At zero gap, the divider still occupies its thickness. The alternative of drawing the divider inside one unchanged total gap was not selected.

Peter separately selected separators that follow visible flex lines. Draw a divider only between neighbouring items on the same row; apply the equivalent rule when a vertical Stack wraps into columns. Avoid dividers at the outer ends of wrapped lines. Retain the selected spacing on each side of each visible divider. This deliberately differs from the reference's source-order separators and does not change Group's separately selected member-order corner rules.

A standalone Chromium reproduction of the inspected reference layout left dividers at row ends at 150px outer width and at a row start at 220px; all items/dividers fit one row at 350px. This verifies the motivating layout defect, not the selected correction, a complete Chakra component or a house implementation. The shared mechanism must preserve slotted/text content, child identity and framework ownership. Complete cross-axis spacing, RTL, reversed directions, resize/hide/reorder, accessible presentation and Chromium/Firefox/WebKit verification remain before entry closure. New CSS gap-decoration syntax alone is not cross-browser proof. [Evidence and reproduction](../alignment/evidence/spacing-stack-review-2026-09-20.json).
