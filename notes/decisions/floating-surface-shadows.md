Decided 2026-09-10 by Peter; recorded 2026-09-19 from the systematization plan.

# Floating surfaces use the Radix Themes shadow scale

Use Radix Themes' shadow scale for floating surfaces so this library has a consistent source for elevation. Record this as an intentional difference wherever the Geist baseline uses another value.

## Assignments selected in Phase 1 review

The source scale was decided on 2026-09-10. On 2026-09-19 Peter selected **no shadow for plain Tooltip**, **Radix shadow 5 for Toast**, and **tiers by role for the remaining floating surfaces**: hover cards 4, menus/popovers 5, dialogs/modal drawers 6. These replace the initial house proposals of shadow 4 for both Tooltip and Toast.

The final inventory fixes the surviving set before implementation. The recommendation is to keep the census and accept only the specific shadow differences for each affected surface, preserving checks for its other properties. A composite wrapper must not add a second copy of its child's shadow.

## Selected role mapping applied to current surfaces

| Current surface | Selected role/token | Evidence or inference |
|---|---|---|
| context-card; relative-time card | `--shadow-4` | Radix Hover Card uses this token |
| plain tooltip | No shadow | Peter chose the treatment shared by Radix Tooltip and Material 3 plain tooltip; contrasting surface remains important |
| toast | `--shadow-5` | Peter chose the menu tier; the current Toast already uses the menu shadow, and Chakra/Material also elevate floating result messages |
| menu; context-menu | `--shadow-5` | Radix base-menu uses this token |
| dots-menu; split-button list | `--shadow-5` | Menu role; apply to the actual list surface, not its composing wrapper |
| combobox; multi-select; future non-native select | `--shadow-5` | Radix Select content/Popover use this token; the current native select has no house-rendered floating list |
| calendar popover; feedback popover | `--shadow-5` | Popover role; inference from Radix Popover |
| modal/dialog; destructive-modal's composed dialog | `--shadow-6` | Radix base-dialog uses this token; no duplicate shadow on destructive-modal |
| command-menu dialog; modal drawer | `--shadow-6` | Dialog role; extending this tier to modal drawers was explicit in Peter's selected option and still needs inventory verification |
| sheet, while present as a modal surface | `--shadow-6` | Dialog role; Phase 2 already schedules replacement by Drawer, so do not implement a separate lasting sheet treatment |

These are role assignments, not approval of every current element's survival or interface. The inventory resolves renamed/composed surfaces and any non-modal drawer treatment. Plain Tooltip is distinct from an interactive rich information panel; the latter's name, role, focus behaviour and composition remain for Phase 2. Material's elevation numbers do not map directly to Radix's shadow numbers.

## Evidence behind the two exceptions

Radix Tooltip's CSS supplies an inverse surface without a shadow. Material 3 distinguishes brief plain labels from rich tooltips that may contain titles and actions. Its plain-tooltip tokens use inverse surface colours; Google's Compose implementation explicitly defaults plain-tooltip shadow elevation to zero. Its rich-tooltip tokens specify Material elevation level 2. Peter chose no shadow for our plain Tooltip after this comparison.

Chakra Toast uses its `xl` shadow, and Material Snackbar uses Material elevation level 3. These are not numerical equivalents of Radix tokens. Our current Toast uses `--ds-shadow-menu`; Peter selected Radix shadow 5 to preserve that relative prominence rather than the initially proposed lighter tier 4. Check the result against varied backgrounds, themes and stacked messages.

The [shadow investigation](../analysis/floating-surface-shadows.md) records primary sources and verification limits, including the unavailable Material Web tooltip implementation. The final house token names and all generator changes remain part of the later conventions and migration work. No implementation is authorized before Phase 5 approval.

Sources read: [shadow scale and tier guidance](https://www.radix-ui.com/themes/docs/theme/shadows), [Hover Card](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/hover-card.css), [Popover](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/popover.css), [Select](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/select.css), [base menu](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/_internal/base-menu.css), [base dialog](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/_internal/base-dialog.css), and [Tooltip](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/tooltip.css).

The [token source](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/styles/tokens/shadow.css) has light, dark and color-mix branches and depends on Radix gray/black alpha values. Port the complete documented values through the generator with explicit color dependencies. Replacing a Radix gray token with a same-numbered house token is not proven equivalent. Record any such adaptation as a separate deviation. Final house token names belong to the conventions review.
