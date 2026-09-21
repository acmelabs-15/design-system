Decided 2026-09-19 by Peter.

# Use numbered spacing tokens and full layout property names

Spacing properties accept theme spacing values and explicit valid CSS lengths/expressions. Use theme values for coordinated appearance; literal values are deliberate overrides and are not automatically rescaled by density. Per-property CSS validity still applies.

Use numbered spacing token keys. A number identifies a theme entry, not a pixel count; explicit CSS lengths carry units where CSS requires them. Component sizes retain their separately selected full-word names. The unchanged source scale starts at 4px and has an 8px step 2. The subsequent choices below select rem units and Chakra's spacing steps for the planned scale.

The focused shared layout properties use full CSS names and logical inline/block directions. JavaScript properties are camelCase and HTML attributes are kebab-case: paddingInline and padding-inline, for example. Do not add duplicate p/px/py/ps/pe aliases. This does not mechanically rename semantic component properties that are not CSS shorthands.

Positive/negative spacing keys, default rem values, dimension-token inputs and declaration-order direction are selected below. Density mappings, exact CSS value grammar, cross-framework declaration-order handling and the complete property lists remain inventory work. [Initial source comparison and answers](../alignment/evidence/layout-contract-review-2026-09-19.json).

## Font-relative house spacing

Decided 2026-09-20 by Peter: express the default house spacing scale in rem, converting existing values using a 16px reference. Token 2 becomes 0.5rem: 8px at a 16px root font and 10px at a 20px root font. This deliberately makes spacing follow the document root font size without changing font sizes. The separate scale choice below supplies the additional keys.

Chakra documents rem spacing; the current house spacing values use pixels, while the house form-font tokens already use rem. Peter chose spacing that grows with the root font over retaining fixed pixel spacing. Custom themes and explicit CSS lengths remain supported. Density still changes eligible spacing without changing text size; the selected compact target floor remains in CSS pixels and must be checked independently. Rem follows the document root, not a nested section's local font size.

Apply this unit decision to the shared spacing convention and Stack's default gap. Review dependent control sizing and theme/density mappings before approving their entries; no global conversion of borders, icons, control heights or every CSS length is authorized by this choice. [Answers and evidence](../alignment/evidence/responsive-spacing-review-2026-09-20.json).

## Complete spacing scale

Decided 2026-09-20 by Peter: adopt Chakra's 34 documented positive spacing steps, plus zero. The keys are 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80 and 96.

The default value for each positive key is that key multiplied by 0.25rem, matching the inspected token table. Zero means no space. This formula defines the default table; authors still select theme entries, not arbitrary numeric pixel values. Custom themes may override the values. Existing numeric steps retain their equivalent values at a 16px root font.

Peter chose this complete scale over retaining the twelve existing numeric steps and using literal CSS lengths for missing steps. The Pro census and targeted source reads show finer steps in Segmented Control, sidebar and webhook-row compositions. The complete scale provides theme-aware values for these uses; reference examples do not otherwise expand component scope. Density remains to specify; negative tokens are now selected below. [Pinned tokens, census, exact values and answers](../alignment/evidence/spacing-stack-review-2026-09-20.json).

## Signed spacing and separate size values

Decided 2026-09-20 by Peter: accept negative forms of the selected spacing steps for margins and positioning offsets where CSS permits negatives. Derive each negative from the corresponding positive theme value; for example, margin-inline-end="-2" is the negative of spacing token 2. Padding and gap remain nonnegative. Chakra's inspected token middleware uses this derivation, and the Pro invite-link example uses a negative end margin for its copy button. The house's old hardcoded negative variables are not the new implementation contract.

Width, height and their minimum/maximum limits accept the selected numeric steps as size tokens, alongside valid CSS sizes. A number denotes a theme step, not pixels: width="8" defaults to 2rem, while a pixel width uses an explicit unit. This does not select Chakra's additional fractional/named size aliases or make ratios, flex growth and other unitless numbers into spacing tokens.

Keep size and spacing in independently adjustable theme categories, with matching numeric defaults. A spacing-token override need not resize a Box that uses the corresponding size token. Changing both categories requires overriding both. This provides a boundary for the selected spacing-only density policy; exact density mappings and eligible control adjustments remain to specify. [Answers and sources](../alignment/evidence/shared-style-values-review-2026-09-20.json).

## Declaration order for overlapping properties

Peter selected matching Chakra's declaration-order behaviour for overlapping properties under the same responsive condition. The proposed fixed all-sides → axis → side priority was not selected. In the checked example, padding:16px followed by paddingInline:8px leaves 8px on the inline sides; reversing the declarations produces 16px on every side.

This is declaration order, not automatically the most recent value-update order. The initial option blurred those concepts; the clarification and second question explicitly distinguished them. Define how declaration order is represented through HTML, Lit and React, including later updates, removal/re-addition and writes before registration. The separately selected responsive-query ordering still governs condition priority; condition-key order and style-property declaration order are different concerns.

An isolated execution of Chakra's CSS builder preserved the two input orders, and Chromium confirmed the resulting native CSS values. It did not test the complete React pipeline, the house renderer or all engines. Installed Lit source saves pre-upgrade own properties in property-metadata order and replays that Map, so callback arrival alone is not proof of authored order. Resolve that interface/mechanism gap before approving the shared contract; do not silently substitute metadata order or latest-update order. [Evidence and required follow-up](../alignment/evidence/shared-style-values-review-2026-09-20.json).

The initial [browser comparison](../alignment/evidence/declaration-order-probe-2026-09-20.json) reproduces the ordering defect through direct early writes and Lit bindings. A public-API capture candidate retaining individual properties and the unchanged TanStack helper passes fifteen focused Chromium checks; an ordered-object alternative passes eight different targeted checks. The [follow-up](../alignment/evidence/style-input-integration-review-2026-09-20.json) reproduces those results in Firefox and WebKit and verifies explicit React order synchronization, annotated manifest fields and CSS defaults in bounded fixtures. Neither comparison approves a complete implementation or API replacement. The declared-order choice stands; actual package/compiler integration and the full cross-framework contract remain open.

## Omitted styling inputs and visual defaults

Decided 2026-09-20 by Peter: an omitted CSS styling property reads undefined. CSS supplies its visual default. An omitted Stack gap therefore reads undefined while displaying spacing step 2 (0.5rem in the default theme); explicitly supplying step 4 makes the property read 4. This applies to CSS styling inputs such as gap and padding. Semantic properties such as open and checked keep their own default contracts.

This preserves the difference between an author-supplied setting and a visual default. Code that inspects or copies supplied settings can retain that distinction. Reading a property is not a measurement of final pixels; computed CSS on the correct styled element supplies the rendered value. The alternative of returning the configured default was viable, but would need separate tracking to recover whether the author supplied it.

The reference comparison does not establish a universal getter rule. Material Web's Lit Button keeps gap and padding in CSS and has no equivalent gap property; its behavioural properties can have explicit defaults. Chakra Stack resolves an omitted gap internally, while Radix's gap definition has no default. The Pro navbar uses both omitted and explicit gaps without defining a DOM getter. The house getter rule is Peter's explicit choice, not a claim that these libraries implement an identical API.

The two-property CSS-default fixture passes fourteen targeted cases per engine in Chromium, Firefox and WebKit. Constructor assignments overwrite early author values in the comparison fixture; that failure does not prove that every default-returning getter is invalid. Preserve the distinction between the selected public rule and the still-unapproved mechanism. [Answer, reference sources, fixtures and limits](../alignment/evidence/style-input-integration-review-2026-09-20.json).

The [package/compiler follow-up](../alignment/evidence/style-package-verification-2026-09-20.json) verifies the candidate's string/undefined declaration types and inherited manifest links, and retains all fifteen capture passes per engine after the installed Lit template transform. Real-source manifest path/classification defects are reproduced and corrected in scratch. The complete input-order protocol, token/responsive types, final metadata/public type surface and generated-CSS pipeline remain approval work; no new public interface choice is implied by these checks.

New [late/mixed Lit input tests](../analysis/lit-practice-review.md#lit-ordering-with-late-and-mixed-inputs) expose an additional ordering gap. Peter subsequently selected the Lit helper below. The declaration-order direction and undefined getter rule remain unchanged. Supplied-setting ownership and next-render reassertion are selected below; helper-expression removal, final types and the full shared contract remain to specify.

## Lit helper for ordered styling inputs

Decided 2026-09-20 by Peter: add a Lit authoring helper that receives overlapping styles together in one ordered object. Keep the selected declaration-order behaviour, individual component properties and static HTML attributes. The helper passes values into the existing canonical TanStack-backed properties; it does not introduce a second state owner.

Peter chose “Add Lit helper (Recommended)” over revising overlap priority to a fixed all-sides/axis/side rule. The cost is a helper import and grouped styling input in Lit templates where order must be preserved. The motivating mixed literal-attribute/property-binding failure occurs in all three engines. A complete-input directive supplies information the component cannot reliably infer from setter arrival. The tested React wrapper serves the corresponding full-prop-order purpose on that path.

The later lifecycle fixture passes 21 targeted checks in Chromium, Firefox and WebKit, before and after Lit compilation, when the intended registry is explicit at Lit's node-creation boundary. It covers late definition, stale callbacks, updates, clearing inputs, detached rendering and Lit part disconnect/reconnect. The original WebKit failure is preserved and reduced to native importNode registry behaviour; this is broader platform integration work, not styling state logic.

This selects the authoring capability, not the exact prototype spelling or method. Supplied-setting ownership and ordinary external writes are subsequently resolved below. Exported name/types, complete helper-removal/competing-writer rules, scoped registries/adopted documents and the full responsive/property set remain before entry approval. The global-registry, two-string-property fixture is not whole-library certification. [Answer, original failures, sources and passing checks](../alignment/evidence/lit-style-helper-review-2026-09-20.json).

## Settings managed by the Lit helper

Decided 2026-09-20 by Peter: the helper manages only the styling settings supplied through it. Clear a previously managed setting when it is removed from the helper input. Leave unrelated independently supplied attributes and properties intact. Keep overlapping settings together in the helper so their relative order is explicit.

Peter chose “Only supplied settings (Recommended)” over making the helper object the complete source for every styling property on the element. For example, a helper supplying padding must not clear a separately supplied background color. Removing a managed input clears its canonical value to undefined, exposing the applicable CSS default; the prototype does not restore an earlier property-value snapshot. This does not approve arbitrary concurrent writers for the same or overlapping properties. Removing keys from the object and removing the helper expression itself are separate lifecycle cases; the latter still needs a contract.

Lit's styleMap tracks supplied names and removes previously supplied names that become absent/nullish rather than clearing every possible CSS property. That informs the ownership rule, but styleMap writes inline CSS and does not itself provide house tokens or component-property handling. The three-field house fixture preserves unrelated settings, clears removed managed settings and keeps declaration order. [Source comparison, answer and browser checks](../alignment/evidence/lit-style-ownership-review-2026-09-20.json).

## External writes to helper-managed settings

Decided 2026-09-20 by Peter: each parent/template render of the helper reapplies its currently supplied values, even if those inputs have not changed. A direct property write still updates canonical state immediately and works until a later helper render. Persistent changes belong in the helper's input.

Peter selected “Restore helper value (Recommended)” over allowing an outside write to persist until the bound input changes. If the helper supplies 16px padding, another script sets 32px and the parent renders the same helper input again, the helper restores 16px. It does not continuously watch for or immediately undo outside writes. The next helper render is the boundary, not any internal component render.

This follows the inspected styleMap update pattern, the existing form bind directive's supplied-value behavior and the tested React wrapper. Ordinary Lit property bindings use a different comparison with the previous bound value; live() explicitly addresses that distinction. The [browser fixture](../alignment/evidence/lit-style-ownership-review-2026-09-20.json) checks restoration, supplied-key ownership and TanStack-batched publication in all three engines. Its nineteen assertions include an unbatched comparison exposing intermediate values; this is bounded evidence, not full helper approval or transaction rollback.

The future [inspector](design-system-devtools.md) must account for this controlled-input boundary if editing is selected. A direct edit to a managed component property can be temporary. This does not select inspector editing or an editing bridge; revisit it with the inspector's own interface.

## Explicit clearing for the style helper

Decided 2026-09-21 by Peter: keep styleInputs present and pass an empty object to clear its remaining owned settings. Peter chose option A, “Explicit clearing”, after the three-engine lifecycle comparison. Removing a key from a later helper input still clears that key. Unrelated settings remain intact, and direct writes remain effective until the next helper render.

This replaces automatic expression-removal cleanup in the approved inventory. Removing the helper expression or temporarily disconnecting its component does not itself clear canonical styling state. Lit's public lifecycle cannot reliably distinguish permanent expression removal from temporary disconnection, including removal while already disconnected. Explicit styleInputs({}) supplies that missing intent without private Lit hooks or a timer. [Reproduction and alternatives](../alignment/evidence/m05-style-helper-lifecycle-2026-09-20.json).

The cost is an explicit clearing step in author templates. Preserve supplied-key ownership and prevent an older helper from clearing values subsequently owned by another helper. Broader overlapping writers remain unsupported; this does not select a new state store, theme dependency or rendering engine.

## Shared styling across layout components

Decided 2026-09-20 by Peter: Box, Flex, Stack/HStack/VStack, Grid, Simple Grid and Group share the focused styling set: spacing, dimensions, positioning, visibility, colors, borders, corners, shadows and placement within a parent layout. Peter chose “Share the set (Recommended)” over reserving surface styling for Box or ordinary CSS.

An author can give a Grid padding and a background directly. The same properties should mean the same thing across the six layout entries, with one shared implementation rather than separate interpretations. The trade-off is a larger public interface to document and verify. The existing Chakra/Pro comparison supports direct layout styling. This scope decision does not approve every candidate property/type/default, the root part or host/native geometry, or a complete inventory entry. [Answer and scope](../alignment/evidence/layout-contract-selections-2026-09-20.json).

## Follow Chakra for comparable style inputs

Decided 2026-09-20 by Peter: when asked how invalid styling inputs should behave, Peter answered “whatever chakra does”. Follow the inspected Chakra behavior for comparable styling inputs. Do not treat that answer as selection of the proposed “keep valid settings” or “return to defaults” policy.

The complete pinned source inspection shows styles derived from current props, nullish leaves skipped, token/raw values transformed and CSS serialized into the current generated class. It does not implement a separate last-valid-value store or a universal CSS-value validator. The prior house recommendation to retain previous accepted values is withdrawn. This is source evidence, not a new browser test or a claim that every malformed input produces one universal result.

Chakra's JavaScript input path has no equivalent to our HTML JSON decoder. Malformed JSON and structurally invalid house responsive inputs therefore remain open. Do not infer whole-input rollback, automatic clearing or guaranteed diagnostics from this answer. Resolve that bounded converter contract in R01/E02–E03 before approving the dependent shared convention; keep valid scalar CSS, responsive objects and helper lifecycle behavior distinct. [Source analysis](../analysis/design-foundations.md#chakra-style-input-follow-up), [exact answer and evidence](../alignment/evidence/layout-contract-selections-2026-09-20.json).
