# Provide interactive Steps

Steps supports selecting a step, Previous/Next controls and the corresponding content. Peter chose this over a progress-only display that leaves navigation to each artifact author. The later [native Lit/TanStack port decision](0114-zag-behaviour-ports.md) supersedes the original @zag-js/steps runtime/adapter choice. Use Zag's logic as a source reference for a new or rebuilt Lit component.

Decided 2026-09-19 by Peter.

Implement step changes, completion and checks before navigation with the selected state approach. The later [navigation/disclosure contract](../../spec/SPEC-navigation-disclosure.md) defines navigation rules, keyboard behavior and the form-validation boundary. This does not select a new form engine, a validation schema, an asynchronous-validation contract or persistence between pages.

At the 2026-09-19 decision, this integration was untested. Per-control browser checks remained required. The historical Phase 5 gate is retired; the [release record](../releases/0.3.0.md) records later verification and its limits.

Evidence: [Chakra Steps](https://chakra-ui.com/docs/components/steps), [Ark's Zag integration](https://github.com/chakra-ui/ark/blob/main/packages/react/src/components/steps/use-steps.ts), [Zag step logic](https://github.com/chakra-ui/zag/blob/main/packages/machines/steps/src/steps.machine.ts), and [package investigation](../research/16-package-choices.md).
