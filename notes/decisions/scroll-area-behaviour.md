Decided 2026-09-19 by Peter.

# Use custom scrollbar controls over native scrolling

Scroll Area supplies design-system scrollbar controls while the browser continues to scroll the content. Peter chose this over the browser's own scrollbar appearance after reviewing Chakra and Radix. Their Scroll Area components both provide custom controls around native scrolling. Styling consistency costs us responsibility for dragging, visibility and accessibility across devices.

Use the [native Lit/TanStack port strategy](zag-behaviour-ports.md), with Zag as a behaviour reference. The earlier actual-package/adapter choice is superseded; a new or rebuilt Lit component may own the house structure. Chakra uses Zag through Ark UI; Radix maintains its own React implementation. Scrolling, keyboard access, resizing and cleanup still require verification in the port. OverlayScrollbars is not newly selected by this change.

Visibility defaults, track/handle styles and the relationship to the existing Scroller remain open. The existing Scroller hides browser bars and adds edge fades and optional navigation buttons; this choice does not itself decide whether it is renamed, replaced or composed in Phase 2. Source changes still require Phase 5 approval.

Evidence: [Chakra Scroll Area](https://chakra-ui.com/docs/components/scroll-area), [Chakra's Ark wrapper](https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/components/scroll-area/scroll-area.tsx), [Ark's Zag integration](https://github.com/chakra-ui/ark/blob/main/packages/react/src/components/scroll-area/use-scroll-area.ts), [Radix native-scrolling behaviour](https://www.radix-ui.com/primitives/docs/components/scroll-area), [Radix implementation](https://github.com/radix-ui/primitives/blob/main/packages/react/scroll-area/src/scroll-area.tsx), and [package investigation](../analysis/package-choices.md).
