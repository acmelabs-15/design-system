Decided 2026-09-19 by Peter.

# Provide interactive Steps

Steps supports selecting a step, Previous/Next controls and the corresponding content. Peter chose this over a progress-only display that leaves navigation to each artifact author. The later [native Lit/TanStack port decision](zag-behaviour-ports.md) supersedes the original @zag-js/steps runtime/adapter choice. Use Zag's logic as a source reference for a new or rebuilt house component.

Implement step changes, completion and checks before navigation with the house state approach. The inventory still needs to define navigation rules, keyboard behaviour, and the boundary with form validation. This does not select a new form engine, a validation schema, an asynchronous-validation contract or persistence between pages.

The integration remains untested here. Per-control browser checks and the Phase 5 implementation gate still apply.

Evidence: [Chakra Steps](https://chakra-ui.com/docs/components/steps), [Ark's Zag integration](https://github.com/chakra-ui/ark/blob/main/packages/react/src/components/steps/use-steps.ts), [Zag step logic](https://github.com/chakra-ui/zag/blob/main/packages/machines/steps/src/steps.machine.ts), and [package investigation](../analysis/package-choices.md).
