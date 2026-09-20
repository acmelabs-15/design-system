Decided 2026-09-19 by Peter.

# Separate effective-theme resolution from preference storage

Peter selected separate responsibilities rather than one combined theme/persistence manager. Provide shared effective-theme resolution for pages, nested sections and their overlays, using inheritance and local overrides with CSS inheritance. Consumers should not each inspect only the document root.

Applications, or a separate optional preference helper, own saving preferences. Importing an ordinary component must not silently change the whole page's theme. This does not select a preference helper, storage format or new runtime.

The current root preference/storage logic in shared/state.ts and global data-dark mirroring in base.ts cannot by themselves express the selected nested-theme contract. That is direct source evidence. The separation also reflects Peter's selected ownership preference; no performance advantage is established.

Before finalizing the resolver, compare actual theme/scope implementations and verify nested/changed/moved scopes, custom themes, system preference and overlay origin in real browsers. Decide the division between CSS inheritance and runtime observation from that evidence. Exact authoring interface and persistence examples remain inventory work.

[Custom-theme capability](custom-themes.md), [review](../alignment/phase-3-review.md#evidence-audit), [answer record](../alignment/evidence/phase-3-checkpoint-2026-09-19.json).
