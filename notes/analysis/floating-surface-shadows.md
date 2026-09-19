# Floating-surface shadow review

Researched and reviewed 2026-09-19. [Peter's selected mapping](../decisions/floating-surface-shadows.md): plain Tooltip has no shadow; hover cards use Radix 4; menus, popovers and Toast use Radix 5; dialogs and modal drawers use Radix 6. Source code remains unchanged.

## Radix and current code

[Radix's scale](https://www.radix-ui.com/themes/docs/theme/shadows) distinguishes smaller overlay panels from larger dialogs. Direct source evidence: [Hover Card](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/hover-card.css) uses 4, [base menu](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/_internal/base-menu.css) uses 5, and [base dialog](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/_internal/base-dialog.css) uses 6. [Tooltip](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/tooltip.css) uses contrasting background/text colours and declares no shadow.

Our `src/components/tooltip/tooltip.ts` defaults to an inverted-theme surface; `src/components/toast/toast.styles.ts` applies `--ds-shadow-menu`. The former informed the no-shadow recommendation; the latter supplied a stronger reason for assigning Toast to Radix 5 than the initial small-message inference for Radix 4. Material and Radix shadow numbers describe different scales, so numbers alone do not prove visual equivalence.

## Material 3 plain and rich tooltips

Peter requested the [Material 3 overview](https://m3.material.io/components/tooltips/overview). The initial text fetch returned only a JavaScript requirement. A rendered Firecrawl fetch retrieved the overview, [guidelines](https://m3.material.io/components/tooltips/guidelines) and [accessibility guidance](https://m3.material.io/components/tooltips/accessibility). The interactive specs viewer did not expose useful token text; exact values below were checked in official source instead.

- **Plain:** a short label or description, commonly for an icon-only control. [Material Web's latest plain-tooltip tokens](https://github.com/material-components/material-web/blob/main/tokens/versions/latest/sass/_md-comp-plain-tooltip.scss), marked version 34.0.21, use inverse-surface colours and do not declare elevation. The absence alone is not proof of zero shadow: [Google's Compose implementation](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Tooltip.kt) explicitly defaults `PlainTooltip` shadow elevation to `0.dp`.
- **Rich:** longer explanation with optional heading, links and buttons. [Material Web's rich-tooltip tokens](https://github.com/material-components/material-web/blob/main/tokens/versions/latest/sass/_md-comp-rich-tooltip.scss) specify surface-container colour and elevation level 2. [Compose's matching token](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/RichTooltipTokens.kt) agrees; [its elevation scale](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ElevationTokens.kt) maps level 2 to 3dp. This is not Radix shadow 2 or a CSS blur radius.
- **Interaction:** Material distinguishes transient hover/focus information from persistent rich information opened by selection. Its accessibility guidance allows focus through rich-tooltip actions and back into the page without trapping it. Exact web semantics and the boundary with Hover Card/Toggle Tip remain for our domain and accessibility review; a shared name does not justify putting interactive content in the current plain-tooltip contract.

The overview lists the Web implementation as unavailable. The Material Web repository tree supplies tooltip token files but no corresponding tooltip component. Therefore this is design/token evidence plus an explicitly identified Compose implementation, not a verified Lit tooltip implementation or browser acceptance result.

## Toast and Snackbar

[Chakra's Toast recipe](https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/theme/recipes/toast.ts) uses `boxShadow: "xl"`. [Material's Snackbar tokens](https://github.com/material-components/material-web/blob/main/tokens/versions/latest/sass/_md-comp-snackbar.scss) specify elevation level 3 and a shadow colour. Radix Primitives supplies [Toast behaviour](https://www.radix-ui.com/primitives/docs/components/toast), with styling left to the consumer. These references support an elevated floating result message, but do not supply a universal cross-library shadow value. Peter selected Radix 5 using the current menu-shadow relationship as local evidence.

## Acceptance and boundaries

The mapping is selected; its rendered outcome is untested. Preserve the complete Radix light/dark/color-mix values and colour dependencies through the generator. Do not substitute similarly numbered house colours without evidence. Check plain-tooltip readability, Toast stacking and varied backgrounds, and the modal-drawer extension. Composed wrappers must not double the child's shadow. Final surviving elements, rich-information roles, token names and migration batches still require their later-phase reviews.

## Phase 1 extension: Toast and rich help

### Toast evidence and selected direction

Peter supplied the [shadcn Base UI Toast](https://ui.shadcn.com/docs/components/base/toast), not an assumed Sonner example. Its [source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/bases/base/ui/toast.tsx) uses Base UI, frontmost height, index-based scale/offset, hidden rear content, expanded offsets and swipe attributes. [Base UI documentation](https://base-ui.com/react/components/toast) describes expansion on hover/focus, keyboard access and inert limited items. Its default limit is three; that number is not yet the house default.

Our current toaster/toast already overlap cards and expand on pointer hover. The source restarts a full timer after hover, has no corresponding region focus-expansion handlers, measures heights initially, and hides extra cards through opacity/pointer-events rather than inertness. These are source observations; keyboard failure was not reproduced in a fresh browser probe.

[Chakra Toast](https://chakra-ui.com/docs/components/toast) uses Ark/Zag, supports overlap and queues new messages at its maximum. Base UI instead marks older messages limited. Peter chose newest-visible behaviour and then [the house Lit/TanStack/shared-motion implementation](../decisions/toast-behaviour.md).

Zag Toast 1.44.0 was installed only under /tmp and its published store was tested: with max:1, enqueue a loading message, update that queued ID to success, remove the front item. The exposed next item remained the old loading state. Removing that ID then left getVisibleToasts empty while getCount was one and a success event had been published. This is an API-level defect observation, not a browser claim. The inspected group source also emits visibility events with no matching handlers found, and the inspected Toast implementation has no Base UI-style swipe handling. [Probe record](../alignment/evidence/additional-probes-2026-09-19.json).

[Web Awesome's Lit Toast](https://github.com/shoelace-style/webawesome/blob/next/packages/webawesome/src/components/toast/toast.ts) and item source were read: top-layer stack, position-change animation, own icon/progress components, shared announcement container and timer restart. It is not a drop-in headless implementation of the selected overlap. Material Web's repository contains Snackbar tokens but no corresponding Toast/Snackbar Lit component.

### Naming survey

The inspected official libraries use Toast: [Spectrum](https://opensource.adobe.com/spectrum-web-components/components/toast/), [Web Awesome](https://webawesome.com/docs/components/toast), [Fluent](https://fluent2.microsoft.design/components/web/react/core/toast/usage), [Chakra](https://chakra-ui.com/docs/components/toast), [Radix Primitives](https://www.radix-ui.com/primitives/docs/components/toast), [Base UI](https://base-ui.com/react/components/toast), [Bootstrap](https://getbootstrap.com/docs/5.3/components/toasts/), [Ionic](https://ionicframework.com/docs/api/toast) and [PrimeVue](https://primevue.dev/toast/). Do not count shadcn as an additional independent implementation of Base UI.

Snackbar appears in [Material UI](https://mui.com/material-ui/react-snackbar/), [Angular Material](https://material.angular.dev/components/snack-bar/overview) and [Vuetify](https://vuetifyjs.com/en/components/snackbars/). [Vaadin](https://vaadin.com/docs/latest/components/notification) uses Notification. Material UI calls snackbars “also known as toasts”; actionable content is not a universal naming boundary. Android's native Toast distinction should not be imposed on web libraries.

Conclusion under the existing wider-use naming rule: retain Toast. This is a bounded source survey, not adoption-weighted market research. [Material 3 Snackbar guidance](https://m3.material.io/components/snackbar/guidelines) specifies one at a time, unlike Peter's selected overlapping stack. Its web guidance also calls for accessible inline feedback when messages auto-dismiss.

### Rich help

[Material tooltip guidance](https://m3.material.io/components/tooltips/guidelines) distinguishes plain text from rich help with headings/buttons/links, and persistent rich help from transient hover content. Persistent rich help opens on click/tap. [Chakra Toggle Tip](https://chakra-ui.com/docs/components/toggle-tip) is a Popover composition. Radix Hover Card is supplementary link-preview content and documents limits for keyboard/screen-reader users; do not treat it as a complete actionable-help pattern.

Our Tooltip renders role=tooltip even with slotted markup, and Context Card combines hover/focus with arbitrary content and manual placement. These need the scheduled Phase 2 disposition review. The [WAI tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) keeps focus on the trigger and directs focusable popup content to a non-modal dialog pattern; the page labels itself work in progress rather than settled task-force consensus.

Peter selected [explicit activation for interactive rich help](../decisions/rich-help-activation.md). Material Web has plain/rich tooltip tokens but no Tooltip Lit component in the inspected tree. Final tags and recipes are not selected here. Existing shadow decisions remain intact.
