# Make blue the default accent for relevant controls

Peter requested that the default filled Button use the blue treatment from the Custom button example, with consistent use in other appropriate controls such as Checkbox, Radio and Switch.

Decided 2026-09-19 by Peter.

The inspected example uses --ds-blue-700 with white text, and #0B7BFE for the hover background. These identify the requested example, not a completed contrast audit or an approved colour value for every state. The decision required shared semantic accent roles and review of applicable components, hover/pressed/disabled/focus states and light/dark contrast.

This changes the default treatment. It does not recolour destructive or warning actions indiscriminately. Consumer overrides belong to the [custom-theme contract](0022-custom-themes.md). All shipped declarations still go through the generator.

Evidence: [foundation analysis](../research/07-design-foundations.md).

## Contrast direction selected after visual comparison

On 2026-09-19 Peter chose option A: **darker blue with white text**. The alternative kept the brighter example blue and changed its text to black. The inspected Custom example falls below 4.5:1 for its 14px text in both themes, including hover. Darker blue preserves the requested white-label appearance while allowing the normal-text contrast requirement to be met.

The comparison showed #0062D1 at rest and #0068D6 on hover, with white text in light and dark surroundings. These are preview values, not an approved complete palette. Exact colours for every control and state were not established by this preview. Verify text, control boundaries, focus indicators, disabled treatment, theme overrides and combined states, including optional ripples.

Evidence: [contrast measurements and comparison](../research/07-design-foundations.md#blue-accent-contrast-and-visual-choice), including the saved preview and the limits of the browser probe.

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../spec/SPEC-design-system.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
