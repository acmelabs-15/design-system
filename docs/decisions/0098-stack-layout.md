# Give stacks shared spacing and clear directions

Stack, HStack and VStack default to spacing token 2. The [2026-09-20 spacing decision](0052-layout-spacing-properties.md#font-relative-spacing) sets its default to 0.5rem, equivalent to 8px at a 16px root font. The source still used 8px at that decision checkpoint. Authors can override gap, including zero. The default follows root-font, theme and density settings rather than freezing a literal 8px value.

Decided 2026-09-19 by Peter.

This is the visual default. Under Peter's later [omitted styling input rule](0052-layout-spacing-properties.md#omitted-styling-inputs-and-visual-defaults), an unset gap property reads undefined; CSS supplies step 2. Explicit gap values read back as supplied. Apply the same distinction to CSS styling inputs such as alignItems; semantic capabilities retain their own contracts. The default/override probe covers two padding properties, not the final Stack/separator implementation.

HStack and VStack keep their named horizontal and vertical directions in their component interfaces. Use general Stack when direction changes responsively. This is the component property contract, not a claim that consumer CSS cannot override layout. Exact shared properties, remaining defaults and tag spellings belong to the later [layout contract](../../spec/SPEC-layout.md).

Chakra Stack uses a 0.5rem default gap; its named wrappers explicitly supply row/column, although its broad CSS props offer another override path. Peter selected the clearer fixed-direction interface for the named stacks. Pro source usage and the inspected implementation are recorded in the [contract checkpoint](../verification/systematization/layout-contract-review-2026-09-19.json). Stack-family inclusion and its distinction from Group remain the [earlier decision](0045-group-presentation.md#ordinary-layout-and-tags).

## Alignment and separators

Peter selected Chakra's alignment defaults: general Stack stretches children across its layout direction; HStack and VStack centre children across theirs. Authors can override alignItems. Chakra's general Stack defaults to a column; that source-supported direction is recorded in the complete layout contract.

Provide optional automatic separators in Stack, HStack and VStack, off by default. Explicit Separator composition remains available. The layout contract defines separator orientation, hidden-child handling and accessible presentation. This capability does not select arbitrary React elements or repeated custom-template cloning as an interface.

The complete Pro sidebar-with-collapsible/sidebar.tsx and charts-00/stat-card.tsx demonstrate separators in vertical Stack and HStack. They were re-read after a census of all 938 indexed JSX/TSX files found these two direct separator attributes. Source usage is not component runtime verification. [Evidence and answers](../verification/systematization/query-stack-grid-review-2026-09-19.json).

## Separator spacing and wrapped lines

Decided 2026-09-20 by Peter: match Chakra's separator spacing. Apply the configured gap on each side of a visible automatic separator. The distance between adjacent items is therefore two gaps plus divider thickness. At zero gap, the divider still occupies its thickness. The alternative of drawing the divider inside one unchanged total gap was not selected.

Peter separately selected separators that follow visible flex lines. Draw a divider only between neighbouring items on the same row; apply the equivalent rule when a vertical Stack wraps into columns. Avoid dividers at the outer ends of wrapped lines. Retain the selected spacing on each side of each visible divider. This deliberately differs from the reference's source-order separators and does not change Group's separately selected member-order corner rules.

A standalone Chromium reproduction of the inspected reference layout left dividers at row ends at 150px outer width and at a row start at 220px; all items/dividers fit one row at 350px. This verifies the motivating layout defect, not the selected correction, a complete Chakra component or a component implementation. The shared mechanism must preserve slotted/text content, child identity and framework ownership. At that checkpoint, complete cross-axis spacing, RTL, reversed directions, resize/hide/reorder, accessible presentation and Chromium/Firefox/WebKit verification remained open. The later implementation evidence below records its own scope. New CSS gap-decoration syntax alone is not cross-browser proof. [Evidence and reproduction](../verification/systematization/spacing-stack-review-2026-09-20.json).

## Implementation under delegated execution — 2026-09-21

The [implemented family and checks](../verification/systematization/m07-stack-2026-09-21.json) preserve the approved direction, gap, density and line-aware behavior. Automatic members are normal-flow assigned elements with boxes; absolute/fixed content retains native positioning outside the flex sequence. Non-wrapping separators stretch across the content box. Wrapped separators use their own visible member row/column bounds and do not extend across another line. The actual Separator primitive supplies the line and its public part.

These are implementation resolutions under Peter's [delegation](0035-execution-delegation.md), not new preference votes. Default gaps use the existing compact-eligible spacing role; explicit spacing remains authored. No Material spacing values are substituted. The exact behavior, reference-source reads and remaining limits are in the evidence above.
