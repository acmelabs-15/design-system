Decided 2026-09-10 by Peter; recorded 2026-09-19 from the systematization plan.

# Assign each reference system a specific role

Geist supplies the baseline. Radix Themes and Chakra UI guide capabilities Geist lacks and names where Geist differs from common practice. Material 3 supplies the tab indicator. On 2026-09-19, Peter additionally selected [Material Symbols SVGs](material-symbols-icons.md) for icon artwork; this extends the earlier tab-only reference scope without adopting Material for other components.

During the Phase 1 walkthrough on 2026-09-19, Peter asked to evaluate **Material Web (`@material/web`), Google's Lit implementation of Material 3, for this and future decisions**. Include it in relevant implementation, layout, build and component comparisons alongside the other references. Distinguish the Material 3 design guidance, the available Lit implementation, and tokens without a shipped component. A missing implementation is a limit to report, not a reason to invent its behaviour. The tooltip review used Material 3 guidance and official tokens, with Compose source explicitly identified where it supplied implementation evidence.

This expands the research reference set. It does not automatically adopt Material appearance, replace an already selected package, or reopen settled decisions without new evidence. See [shadow decisions](floating-surface-shadows.md) for the specific plain-tooltip outcome.

Where reference systems disagree on a name, choose the more widely used name and record the survey that supports it. Read current documentation or rendered output rather than inferring behaviour from a dependency name.

Each deliberate difference records the source and exact value or behaviour adopted. Verification follows [the amended goal](systematization-goal.md). These roles do not authorize importing a reference system's implementation packages; the mandated stack still governs.

Further Phase 1 extension decisions select [Material spring roles](material-motion-system.md), [needs-driven shape morphing](shape-support.md), [custom themes](custom-themes.md) and the [blue house accent](blue-accent.md). The full Material shape catalogue is not required. The [responsive-system decision](responsive-system.md) selects Material bands with font-relative thresholds and Chakra-style authoring capabilities; [Box](box-primitive.md) is a planned primitive. These decisions do not select every Material visual detail or finalize the interfaces. The [extension register](../alignment/additional-functionality-review.md) records the research closure and later design/verification obligations.

## Chakra UI Pro examples

On 2026-09-19 Peter explicitly added [Chakra UI Pro](https://pro.chakra-ui.com/explore) examples to this and future relevant decision reviews. Compare complete compositions as well as core component documentation/source. Distinguish a finished behaviour from a visual example or placeholder, and state which source/preview was actually inspected.

For the current pass, Peter requires a full review of every accessible block and all source files in the supplied Course Kit and Docs Kit, with no sampling. He specifically prioritizes Webhooks, Property Panels and Settings for Card, row and related questions. The [full-review ledger](../alignment/chakra-pro-review.md) tracks coverage. This expands research, not implementation scope or permission to adopt reference packages, visual values or backend logic. Preserve accepted decisions and investigate forward dependencies before new choices.

## Standing comparison rule

Reaffirmed 2026-09-19 by Peter after the complete source review: **whenever a review considers Radix, Chakra UI, Material Design 3 guidance, or Material Web's Lit implementation, also consult the Chakra UI Pro block and kit collection for relevant evidence.** This applies throughout the remaining work and future relevant comparisons, not only the current container review.

Use the [searchable collection](/Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/README.md), its component/part index, and its reviewed findings to locate complete examples. The collection includes all 338 catalog blocks and both supplied kits. Search by the capability being considered as well as the component name; useful composition evidence may appear in a different kind of screen. Record the examples used. If the collection has no relevant evidence, state that limit rather than force a comparison.

Chakra UI Pro and the kits are **additional sources, not an implementation checklist**. A listed feature, component, visual treatment, package or example is not automatically selected for the house design system. Compare its value, actual implementation, gaps and compatibility with the other references and existing decisions. Peter's explicit decisions determine scope; examples can inform or challenge a proposal but cannot silently approve it.

Geist remains the baseline. The assigned roles of Radix, Chakra UI, Material guidance and Material Web remain intact. Keep design guidance, shipped implementation, example source, observed browser behaviour and placeholders distinct.

## Complete Material documentation review

Decided 2026-09-19 by Peter as a standing research method: **always read a Material Design 3 component's Overview, Specs and Guidelines tabs in full**. Read every subsection, table and example; include Accessibility when available. Expand relevant specification token sets and inspect measurement diagrams rather than treating the initial collapsed widget or a text-only scrape as the whole specification. Track incomplete extraction, visual-only information and uninspected states explicitly. Continue truncated reads; a navigation shell is not a completed read.

Also review other Material components and supporting Material documentation that can inform the question. Choose them from the actual dependencies: layout, scaffold, grids/spacing, density, breakpoints, canonical examples, input methods, selection and states are examples of relevant foundation material. This applies to future questions, not only Toolbar. Compare the actual Material Web Lit implementation where it exists; distinguish experimental Labs code, stable exports, token files and design guidance.

## Reference evidence and house changes

Peter clarified that Material's spacing, density and other values must remain distinguishable from the house system. Label reference values and keep dp, CSS pixels and rem distinct. Do not silently substitute a reference rule for an approved house rule.

Existing house decisions are the baseline, not an obstacle to improvement. **A component review may provide evidence for changing a house spacing, density or other rule.** When it does, explain the benefit and cost, identify earlier decisions and components affected, and consider upcoming decisions that may change the recommendation. Bring a concrete proposed revision to Peter. Until he selects it, the existing decision stands. No particular spacing or density change was selected in this clarification.

Use the [decision compatibility and dependency procedure](../alignment/phase-2-review.md#decision-compatibility-and-dependencies). If a future dependency could change the answer, bring its research forward or record the open question, reason, dependency, return point and completion gate. Group is a direct dependency of the Toolbar review.
