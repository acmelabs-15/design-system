# Shared conventions and foundations — R01

**Approved 2026-09-20 by Peter as part of the full proposal set.** The stated recommendations are selected. Technical verification remains required; implementation follows the approved migration plan. [Approval](../../decisions/inventory-approval.md).

**Approved Phase 4 design. Not yet approved for implementation.** This file owns the proposed cross-family contract. The selected responsive/style rules and detailed layout property table remain in [the core inventory](../inventory.md#c-resp-shared-responsive-convention); this file does not reopen them. [The closed decision register](../proposal-questions.md) records the selected recommendations separately from engineering verification.

## Contract used by every entry

An entry lists its additions to this contract. A property absent from both places is not implicitly public. Properties, slots, events, methods, parts and examples are proposed final interfaces; the implementation snapshot is evidence, not a compatibility promise.

Unless a family specifies otherwise, a named structural part has one default slot, its same-named CSS part, no own value/state/method/event and no added keyboard behavior. It uses an ordinary native content container; a header/footer part name does not automatically create a page landmark. Stateful/focusable parts use their explicit family rules instead.

| Subject | Proposed rule |
| --- | --- |
| Tags and exports | acme- plus kebab-case concept; Acme plus PascalCase class; React removes the Acme prefix. Family parts include the family prefix. Component file/folder follows the tag suffix. |
| Definitions and classes | Side-effect-free class export and explicit definition entry per component; documented dependencies register through the supported scoped/global definition mechanism. No component import registers the entire library. |
| Properties/attributes | camelCase properties; kebab-case attributes unless the platform already defines a native spelling. Object/array/function/Element inputs are properties; only explicitly specified structured attributes get JSON conversion. Boolean attributes use presence, never boolish false strings. |
| Values | Empty string represents an empty text value; no value for single-choice collections is undefined; multiple values use a fresh readonly string array. Keys are stable strings. Native form serialization is defined per control and does not stringify arbitrary objects. |
| Style values | Selected numeric spacing/size tokens and property-valid CSS. Missing CSS input reads undefined. Semantic booleans and values retain entry defaults. No implicit all-CSS property interface on every control. |
| States | checked for Checkbox/Radio/Switch; pressed for Toggle Button; highlighted for navigated options; selected for collection value; current for navigation; focused for actual focus. open for overlays, expanded for disclosures. |
| Content | heading, description, metadata, header, footer have glossary meanings. start/end are inside reading-order affixes; start-addon/end-addon are outside attached surfaces where an entry explicitly supports them. |
| Named sizes | tiny, small, medium, large, extraLarge, extraExtraLarge as needed; each entry lists its supported subset. No short aliases. Numbers used as CSS dimensions or formatter values are not size tiers. |
| Inherited named appearance | For size/variant provider inputs, track authored presence separately in canonical state; effective value is explicit child input, then compatible nearest Group input, then component default. Getters expose the effective named value; clearing the authored value resumes inheritance. This is distinct from raw CSS-property getters, which retain the selected undefined-when-absent rule. Never mistake a constructor default for an explicit child override. |
| Shapes | circle/pill/square express the selected concepts; border radius is separate. No rounded alias for pill. Individual entries expose only supported shapes. |
| Slots/parts | Content uses slots/child parts; CSS uses explicitly listed parts and documented tokens. Private shadow selectors are not a contract. Forward a public part through internal compositions only deliberately. |
| State ownership | Canonical TanStack state backs public properties. Retain/refine existing atomState and StoreSelector/StoreEffect integration; Lit handles metadata/rendering, not another writable state copy. |
| Native meaning | Dedicated native controls keep platform behavior. Structural as is restricted to each entry's selected set. Accessible naming reaches the actual semantic/focus target, with no duplicate host role/name. |
| Lifecycle | Disconnect cleans transient listeners, timers, observers, placement and animation work; reconnect derives current inputs once. Late definition, scoped registries and adoption must work without replacing author-owned children. |
| Compatibility | New names/interfaces replace old ones completely. Migration history stays in notes/Git. No alias, deprecated attribute, legacy export or old-path fallback ships. |
| Localization | lang/dir follow the nearest scope; explicit locale where an entry formats data. Applications supply translated content. Built-in control labels use one replaceable messages object; no fixed English strings in generated artifacts when locale messages are supplied. |

**Evidence:** [terminology decisions](../terms.md), [property-name priorities](../../decisions/prop-naming-vs-reference.md), [state](../../decisions/public-state-bridge.md), [reference rule](../../decisions/reference-systems.md), [current AST snapshot](../evidence/current-public-interfaces-2026-09-20.json). The future generated manifest must replace lexical metadata gaps, not bless private queries as public methods.

Structured HTML attributes are explicitly supported for data-only values in these proposals: Avatar Group members; Checkbox Group/Pin Input/Slider array values; Tree items/expanded and multiple values if selected; Calendar range value/presets; Chart data/series without callbacks; Sparkline values; Flow Diagram nodes/edges; JSON View value; formatter options; Resizable sizes; and the already selected responsive styling fields. HTML uses validated JSON, while Lit/React pass actual values. Functions, stores, DOM references and regex objects remain property-only. Unknown fields or malformed structures cannot become executable templates. The shared converter contract distinguishes absent values, parse failures and valid scalar inputs.

## Public events

Proposed uniform event settings: bubbles=true, composed=true. Ordinary notifications are not cancelable. Event detail contains serializable values and reason strings, not DOM nodes or an original event. Native click/focus/input events keep platform behavior; do not synthesize duplicate native events.

| Name | Meaning and detail | Timing |
| --- | --- | --- |
| acme-input | Live editable value: { value }; entry adds numeric value only where specified | After canonical value and native form state update |
| acme-change | Committed user value change, such as { value }, { checked } or { pressed } | Once per effective user commit; no event for an unchanged value |
| acme-open-change | { open, reason? } for user overlay-state changes | Separate from value change so opening Select cannot look like clearing its value |
| acme-expanded-change | { expanded } for disclosure/hierarchy state | Separate from selection/value changes |
| acme-visible-change | { visible } for explicit display-state controls such as password reveal | Separate from edited text/value changes |
| acme-current-change | { current } for navigation-location observation | Does not imply form selection or application navigation ownership |
| acme-copy / acme-load / acme-complete / acme-dismiss | Entry-defined completed-operation notifications | Never mislabel an already completed result as an application action request |
| acme-request | Application-owned action: { action, ...entry fields } | Before application work; cancelable where entry allows preventing local default behavior |
| acme-after-open / acme-after-close | { reason } for completed owned overlay transitions | Once after the owned transition; canceled/replaced transitions do not report stale completion |
| acme-error | { code, message } for an entry's failed asynchronous operation | After failure; no secrets, input text or arbitrary application data in default diagnostic detail |

Programmatic assignments update canonical/native state without pretending to be a user input/commit. Store subscriptions remain the programmatic observation path. Reset/restoration synchronize without synthetic user changes. A composite stops internal coordination from becoming duplicate public notifications. Controlled application-owned components (Pagination, Table data processing, action confirmation) emit requests and render supplied state; they do not run the application's work.

These payload/timing proposals implement the selected meaning-based event direction; they still require full convention review. They do not rename native platform events or treat a changed Lit property map as an emitted DOM event. Test user, programmatic, reset and reconnect paths separately.

## Forms and focus

Native-form controls share name="", disabled=false, required=false where meaningful, form attribute/association, validity/checkValidity()/reportValidity()/setCustomValidity(message), and focus(options). Read-only applies only where platform semantics support it. Form state synchronizes immediately, independently of a render cycle. Effective disabled state incorporates disabled Fieldset without overwriting a control's own disabled setting.

Reset restores defaultValue/defaultChecked, exposed with the corresponding control value type and initial entry default. Initial HTML value/checked establishes that default; later programmatic writes to current value/checked do not silently replace it. Setting the explicit default updates the reset target; pristine/current synchronization follows native control behavior and is verified separately from controlled application writes. Restoration uses the control's serialized value shape. Checkbox-style unchecked values are absent; repeated collection values use repeated entries; empty scalar values serialize as empty strings when named/enabled. Radio/Card/Segmented composites own one successful value, not one hidden submission per visual wrapper.

Field owns label/help/error relationships; the control owns value/validity and actual focus. Roving focus belongs to the control collection/Toolbar, never general Group. One component owns a gesture or key. Enter/Space, arrows, Home/End, Escape and typeahead follow the assigned reference and native control type. Do not force application navigation links into menu/radio behavior.

**Evidence and gates:** [native-form direction](../../decisions/native-form-architecture.md), [timing probe](../evidence/native-form-mechanism-2026-09-19.json), [form/Field review](../../analysis/lit-practice-review.md). Required acceptance includes disabled first-legend exceptions, external form association, submit-before-render, reset, autofill/history restoration and actual accessible relationships in all three engines. Directly calling a callback is not autofill verification.

## Theme scope and customization

Selected: full themes, page/nested-section inheritance, scope-correct overlays, independent size/spacing categories and no automatic preference persistence. Proposed API:

- registerTheme(name, definition): registers an immutable named theme before first use; duplicate identical registration is harmless, conflicting registration fails. ThemeDefinition contains colors, fonts, fontSizes, fontWeights, lineHeights, spacing, sizes, radii, shadows and motion. Values are CSS token values under category validation; a partial theme inherits the house theme.
- acme-theme: theme?: registered name, appearance: "auto" | "light" | "dark" (auto default), density: "normal" | "compact" (normal default), locale?: string and dir: native direction. One default slot; part=root; no own focus or new change events. Nested omitted properties inherit effective scope; root omission uses house/auto/normal.
- Named theme definitions use registerTheme; local one-off overrides use ordinary documented CSS custom properties. Do not add a second .tokens object interface without a demonstrated need. This is the proposed engineering resolution of Q01, not a new question.
- Theme Switcher emits a preference request. The application decides whether/where to save it. Importing Button or another component never rewrites root theme settings.
- Overlay lifetime captures and follows the opener's effective theme; moving/changing scopes updates an open surface. Menus, Dialogs and Toasts reset inherited density to normal under the selected rule.
- Shared blue action roles use the selected darker-blue/white direction. Final token values must pass combined rest/hover/press/focus/ripple states in both appearances. Existing comparison colors are evidence, not automatic final values for every control.

Named registration plus CSS local overrides is approved. Q02 is closed in favor of role-specific compact tokens and the recorded comparison targets. The proposals above make the scope API reviewable without fabricating selected numeric density values. Theme validation reports unknown token categories and malformed registrations at startup; browser-specific CSS-variable computed validity remains native.

**Sources:** [custom themes](../../decisions/custom-themes.md), [theme ownership](../../decisions/theme-resolution-architecture.md), [blue measurements](../../analysis/design-foundations.md#blue-accent-contrast-and-visual-choice), [density](../../decisions/density.md). Source runtime: shared/state.ts and base.ts currently implement root-only behavior; they are replacement baselines, not proof of nested themes.

## Responsive layout and styles

Use [the core shared responsive contract](../inventory.md#responsive-authoring-proposal), selected names/thresholds/native font bases and the full spacing/size scale. Scalar, named object and five-position array forms remain selected. The HTML structured converter must preserve scalar bracketed CSS. Apply the source's ordering model; do not ask again about order, helper inclusion, native query font bases or default targets.

styleInputs remains the proposed Lit helper name. Its supplied-key ownership and next-render reassertion are selected. React synchronizes complete prop order through its wrapper. Helper expression removal, conflicting writers and exact range-equivalence validation remain engineering gates. For malformed structured JSON, propose the installed Lit converter's invalid-to-null behavior mapped to the selected absent-style value undefined: remove that input's override, keep unrelated inputs, and issue a development diagnostic. Do not retain a previous style snapshot. A five-case Bun probe of @lit/reactive-element 2.1.2 confirms its converter result, not the final house renderer. Valid scalar CSS is recognized before JSON so bracketed grid lines survive. Q03 is resolved as this explicit house adaptation; browser/atomic update verification remains required. Do not introduce a last-valid CSS store on the claim that Chakra has one.

## Motion, shapes and indicators

Use Lit Motion. Standard and Expressive Material roles are selected per context, not one universal scheme. Utility motion uses Standard; prominent demonstrative examples may use Expressive. Spatial/effect roles remain distinct. Reduced motion preserves state/focus outcomes with immediate or non-spatial transitions as applicable.

The internal shared indicator owns animation between single selected targets in either axis. Selection owner supplies target identity/geometry; layout supplies boxes. Checkbox/multiple-selection does not use a travelling highlight. Reversal, scroll, resize, removal and stale measurements cannot move selection.

Propose ripple?: boolean on action/selection controls, resolving absent to false. Per-control opt-in fulfills the selected capability; no additional global ripple switch is proposed. Q04 needs no preference question. It never blocks activation or owns selection. Cancellation/touch scrolling, keyboard origin, disabled state and combined contrast need checks. Shape morphing uses demonstrated house needs; do not port the complete Material shape catalogue.

## Verification and implementation boundaries

Every proposal requires meaningful native/HTML/Lit/React behavior checks, accessibility and all three engines. Visual references and house deviations are identified per entry. Reuse the reviewed Pro corpus alongside assigned reference systems. No source change, dependency installation, generated output or new SKILL.md is part of this proposal assembly.

The existing pre-Phase-5 generated-CSS gate remains: representative compilation, scope, registrations, source maps, escaping, determinism, invalid-input failures, selective delivery and rendered results. Current partial probes do not close that gate. Browser work for actual components remains Phase 6 after an approved migration.

## Convention audit and before/after examples

These measurements come from the fresh 150-class AST snapshot; they are direct declarations/literal occurrences, not inherited/runtime API coverage. They justify preserving established patterns and identify actual normalization work.

| Convention | Before → proposed after | Current measured adoption |
| --- | --- | --- |
| Element prefix | acme-button → acme-button | 150/150 registered tags already use acme- |
| JavaScript property casing | minWidth → minWidth, with explicit min-width attribute | 778/778 directly declared @property names use camelCase-compatible identifiers; attribute conversion must still be verified separately |
| Named sizes | Badge md → medium; numeric Avatar dimensions → explicit size/width separation | 15/23 size declarations have full-word small/medium initial values; four have abbreviated initials, two numbers and two empty strings; this does not certify their complete enums |
| Text regions | Chart head → header; Stat desc/foot → description/footer | Eight of 124 literal named-slot occurrences use head/foot/desc/title; native title keeps its own platform meaning |
| Inside affixes | start-icon → start where it is inside leading content | 22/124 named-slot occurrences are already start/end; other slot purposes are not automatically violations |
| Public event prefix/meaning | acme-toggle/acme-expand → acme-expanded-change; slider live acme-change → acme-input | 68 captured public event literal occurrences already have acme-; 25 distinct captured names still need meaning/timing/payload normalization |
| Exports/types | ad-hoc imports → explicit class/definition entries and separate typed React package | New complete export contract is not implemented; package-consumer checks remain required |
| CSS hooks | private selector access → documented parts/tokens/native-content hooks | Existing metadata extraction does not establish full public hook coverage; CEM/runtime comparison is the required completion check |

Keep palette/reference token values distinct from semantic component roles. Generate a documented token manifest that maps each public theme key to one CSS custom property and source role; no duplicate alias names are introduced. Existing palette variables are not renamed solely for novelty. New shared numeric spacing/size variables must reflect the selected categories and full scale, with migration mappings recorded in Phase 5. Exact emitted variable names are an engineering naming table to verify against generated output, not another preference interview.
