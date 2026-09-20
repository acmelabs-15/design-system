Decided 2026-09-19 by Peter.

# Give stacks shared spacing and clear directions

Stack, HStack and VStack default to house spacing token 2, currently 8px. Authors can override gap, including zero. The default follows theme and density settings rather than freezing a literal 8px value.

HStack and VStack keep their named horizontal and vertical directions in their component interfaces. Use general Stack when direction changes responsively. This is the component property contract, not a claim that consumer CSS cannot override layout. Exact shared properties, alignment, general Stack's defaults and tag spellings still require the complete inventory entry.

Chakra Stack uses a 0.5rem default gap; its named wrappers explicitly supply row/column, although its broad CSS props offer another override path. Peter selected the clearer fixed-direction interface for the house named stacks. Pro source usage and the inspected implementation are recorded in the [contract checkpoint](../alignment/evidence/layout-contract-review-2026-09-19.json). Stack-family inclusion and its distinction from Group remain the [earlier decision](group-presentation.md#ordinary-layout-and-tags).
