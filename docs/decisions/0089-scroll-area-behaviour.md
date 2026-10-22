# Use custom scrollbar controls over native scrolling

Scroll Area supplies design-system scrollbar controls while the browser continues to scroll the content. Peter chose this over the browser's own scrollbar appearance after reviewing Chakra and Radix. Their Scroll Area components both provide custom controls around native scrolling. Styling consistency costs us responsibility for dragging, visibility and accessibility across devices.

Decided 2026-09-19 by Peter.

Use the [native Lit/TanStack port strategy](0114-zag-behaviour-ports.md), with Zag as a behaviour reference. The earlier actual-package/adapter choice is superseded; a new or rebuilt Lit component may own the component structure. Chakra uses Zag through Ark UI; Radix maintains its own React implementation. The 2026-09-19 port decision still required verification of scrolling, keyboard access, resizing and cleanup. The later [release record](../releases/0.3.0.md) records acceptance and its limits. OverlayScrollbars is not newly selected by this change.

Visibility defaults and track/handle styles were open at the 2026-09-19 decision. The later choice below settles the Scroller relationship. The [layout contract](../../spec/SPEC-layout.md) records the detailed interface; the historical Phase 5 gate is retired.

Evidence: [Chakra Scroll Area](https://chakra-ui.com/docs/components/scroll-area), [Chakra's Ark wrapper](https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/components/scroll-area/scroll-area.tsx), [Ark's Zag integration](https://github.com/chakra-ui/ark/blob/main/packages/react/src/components/scroll-area/use-scroll-area.ts), [Radix native-scrolling behaviour](https://www.radix-ui.com/primitives/docs/components/scroll-area), [Radix implementation](https://github.com/radix-ui/primitives/blob/main/packages/react/scroll-area/src/scroll-area.tsx), and [package investigation](../research/16-package-choices.md).

## Replace Scroller

Decided 2026-09-19 by Peter in the later Phase 2 review: one Scroll Area replaces Scroller. Keep useful edge fades and button-driven scrolling available through optional parts or composition, rather than maintaining a separate item-strip scrolling interface. Content layout and TanStack Virtual remain separate responsibilities.

Chakra demonstrates edge shadows, programmatic scrolling and virtualization inside Scroll Area; Radix likewise uses native scrolling under custom bars. Exact optional-part interfaces, track visibility and scrolling-step rules belong to the later layout contract. Review Sidebar, TOC, Tree View, Table/virtualization, RTL, focus reveal, reduced motion and resize/cleanup together. [Research](../research/06-codebase-systematization.md#disclosure-layout-and-smaller-component-dispositions), [selection record](../verification/systematization/disposition-checkpoint-2026-09-19.json).
