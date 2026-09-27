---
name: forms-and-accessibility
description: Compose accessible forms with @acmelabs/design-system native controls, Field and Fieldset. Use when adding validation, labels, native submission and reset, managed TanStack Form state, or keyboard interactions.
license: MIT
metadata:
  library: "@acmelabs/design-system"
  library_version: "0.2.0"
  type: "sub-skill"
---

# Forms and accessibility

1. Match [release facts](../references/release.json), then read the relevant control, Field and Fieldset contracts and the native or managed form recipe for the selected framework.
2. Start with one native form owner. Set control names and values, associate visible labels, and connect helper/error content through the documented Field parts. Use Fieldset and its native legend for a related group.
3. Test native `FormData`, submission, validity and reset before adding managed state. Disabled or unnamed controls and single/multiple choice groups have different submission behavior; use the actual public contract.
4. Add TanStack Form only when the application needs its managed validation or state. Use the shipped recipe's adapter and ownership model. Keep one validation and value owner; avoid a second independent mirror of the component's internal state.
5. Use the declared input/change events and payloads. Verify external form association when a control is outside its form. Preserve browser focus and invalid-control behavior rather than replacing them with a visual error alone.
6. Test keyboard access, accessible names, required and disabled states, error recovery and reset. For dialogs or popovers, also test focus return and removal while open.
7. Report browser checks separately from assistive-technology checks. Passing unit tests or visible text does not prove a screen reader announcement.

Retrieve exact properties and event flags from generated records. Do not infer them from native tag names or another design system.
