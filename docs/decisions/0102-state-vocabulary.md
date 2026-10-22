# Name states by their meaning

Peter selected “Meaning-specific names” over one selected name for all stored choice states. Use highlighted for the option being navigated, selected for a chosen collection value, checked for checkbox/radio value state, pressed for a toggle button's persistent state, current for navigation location and focused for actual focus.

Decided 2026-09-19 by Peter.

These states can coexist. Moving focus/highlight does not necessarily change a value. Native ARIA and CSS terms retain their platform meaning; transient pointer pressing is distinct from a persistent pressed state.

The 2026-09-19 review found that ComboBoxOption active/chosen and MenuItem selected confused highlight with value selection. The later [selection contract](../../spec/SPEC-selection.md) maps public properties, parts and state selectors to the selected meanings. Do not blindly rename every active or selected occurrence without its context.

Evidence: [terminology record](../design/component-vocabulary.md#interaction-and-value-states), [answer](../verification/systematization/phase-2-closure-2026-09-19.json).
