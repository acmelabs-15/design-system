# Separate effective-theme resolution from preference storage

Peter selected separate responsibilities rather than one combined theme/persistence manager. Provide shared effective-theme resolution for pages, nested sections and their overlays, using inheritance and local overrides with CSS inheritance. Consumers should not each inspect only the document root.

Decided 2026-09-19 by Peter.

Applications, or a separate optional preference helper, own saving preferences. Importing an ordinary component must not silently change the whole page's theme. This does not select a preference helper, storage format or new runtime.

The root preference/storage logic in shared/state.ts and global data-dark mirroring in base.ts inspected on 2026-09-19 could not by themselves express the selected nested-theme contract. That was direct source evidence. The separation also reflects Peter's selected ownership preference; no performance advantage is established.

The resolver investigation required comparison with actual theme/scope implementations and real-browser checks for nested/changed/moved scopes, custom themes, system preference and overlay origin. That evidence determined CSS-inheritance and runtime-observation responsibilities. The later [foundations contract](../../spec/SPEC-foundations.md) records the authoring interface and persistence examples.

[Custom-theme capability](0022-custom-themes.md), [review](../history/systematization/architecture-review.md#evidence-audit), [answer record](../verification/systematization/phase-3-checkpoint-2026-09-19.json).

## Context transport selected, 2026-09-21

The implementation selected @lit/context 1.1.6 under Peter's [dated execution delegation](0035-execution-delegation.md) for ancestor discovery, live source delivery and late providers. Pass read-only TanStack sources through it; do not create another writable theme-state copy. The design system owns slot/move invalidation, default reset, document resources and overlay opener lifetime. The [three-engine probe](../verification/systematization/m05-theme-context-2026-09-20.json) demonstrates the package mechanisms and the explicit resets required for its two stock gaps.
