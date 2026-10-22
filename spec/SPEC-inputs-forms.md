# Inputs and form composition — R06

**Status: approved contract.** Peter approved the complete proposal set on 2026-09-20. The stated recommendations are selected; explicitly recorded later resolutions are incorporated below. [Approval](../docs/decisions/0049-inventory-approval.md). Verification evidence retains its original date and scope.

**Approved family contract.** Use [native forms and event conventions](SPEC-foundations.md#forms-and-focus). TanStack Store owns component state; optional TanStack Form binds that same state. Sources: [forms/Field decisions](../docs/decisions/0067-native-and-managed-forms.md), [native behavior ports](../docs/decisions/0114-zag-behaviour-ports.md), current declarations and [practice review](../docs/research/15-lit-practice-review.md). No Zag runtime or custom Zag adapter is adopted.

## Shared field-control contract

Named controls support value, name="", disabled=false, required=false and native form methods as applicable. Text editing also supports readOnly=false, placeholder="", autocomplete="", inputMode="", minLength/maxLength/pattern where native semantics apply. invalid=false is presentation of supplied validity context, not permission to bypass actual validation. size: small|medium|large=medium. Standard accessible naming reaches the actual input. A Field is optional; standalone controls can be named directly.

Inside-affix slots are start/end. External add-ons remain start-addon/end-addon and share Group's visual seam rules without a mandatory additional wrapper. Label/help/error content belongs to Field. Duplicate control-owned heading/help/error presentation remains removed, with complete replacement examples. The [affix decision](../docs/decisions/0047-input-affix-api.md) retains the inside/outside distinction. Its old one-cell precedence is superseded: all four slots remain independently available, and outside actions retain their own focus. [2026-09-22 resolution](../docs/decisions/0035-execution-delegation.md#text-control-implementation-details--2026-09-22). Component-local focus-ring ownership still applies; appearance composition never moves native submission into Group.

## F-01 Input and Search

acme-input uses native input. type: text|email|url|tel|password|search=text; value=""; clearable=false. Native input supplies browser sanitation, constraints, editing and selection. Add no custom trimming or case transformation. Preserve raw string reset defaults separately from browser-sanitized current values, including email/url whitespace, single-line breaks and textarea newline normalization. Native hard-wrap serialization remains engine-owned. Implicit Enter follows the outer form's default submitter, cancellation and disabled-default behavior. [2026-09-22 resolution](../docs/decisions/0035-execution-delegation.md#text-control-implementation-details--2026-09-22). root/input/start/end/start-addon/end-addon/clear parts. Methods focus(), select(), setSelectionRange(start,end,direction). acme-input { value } on live input and acme-change { value } on commit. Clear is an explicit action that updates value and emits the same single value event sequence; preserve focus.

acme-search composes Input type=search with clearable=true, loading=false and a decorative leading search icon. It never performs network search or local filtering. Default value=""; source/label/help contract is the same Input contract. Loading is presentation; application owns the operation and results. Search in App Bar is not a second Command Menu or route owner.

Acceptance: IME/composition, selection/caret, autofill, native validation, immediate submit, clear, external add-on actions, disabled versus readOnly, reset/restoration, RTL and long values.

## F-02 Password Input

acme-password-input composes Input with value="", visible=false, revealable=true. A labelled toggle changes native password/text presentation, retaining focus/caret where possible. Emits acme-visible-change { visible } for the reveal action and normal value events for editing. root/input/reveal parts; affix slots remain available without duplicate end controls. No password strength/network check. Never include value in diagnostics/inspector logs. Verify autofill, reveal held state, keyboard/touch, clipboard expectations and form reset.

## F-03 Textarea

acme-textarea: value="", rows=3, resize: none|vertical|horizontal|both=vertical, autoResize=false, minHeight/maxHeight?: CSS size, wrap: soft|hard=soft; other native multiline constraints apply. Parts root/textarea; no artificial one-line affix wrapper. Native input/change event meanings map to acme-input/acme-change. Auto resize, if enabled, measures content and respects limits without losing caret/scroll. The selected numeric row default replaces the historical source's rows=0; it is not a claimed reference constant.

## F-04 Number Input

Family acme-number-input with optional acme-number-input-increment/decrement parts; the root supplies both default actions when no custom control content is supplied. Custom control content supplies the actions it needs. Parts bind to the nearest Number Input through Lit context and read its TanStack state; an unowned part is disabled, and moving a part transfers ownership. Authored appearance wins over Group defaults, then numeric-control defaults. value="" is the editable string; valueAsNumber is read-only parsed number or NaN. Props min=Number.MIN_SAFE_INTEGER, max=Number.MAX_SAFE_INTEGER; step=1, or .01 for percent format when omitted; largeStep=10×step, smallStep=step/10; allowOverflow=false; clampValueOnBlur resolves to !allowOverflow; spinOnPress=true; allowMouseWheel=false; locale inherits; formatOptions: NumberInputFormatOptions={} (Intl.NumberFormatOptions with notation?: standard). Compact, scientific and engineering notation are rejected before changing state because the selected parser does not support them; the [2026-09-22 correction](../docs/decisions/0035-execution-delegation.md#number-input-format-and-action-boundaries--2026-09-22) records the evidence. These behaviors/defaults come from the inspected Zag source; locale inheritance is the scope rule.

Use @internationalized/number for parsing and native Intl formatting. Keep partial strings while editing; do not coerce empty/minus/decimal-prefix to zero. Native submission serializes the committed numeric string under the form contract; an invalid partial value participates in validity, not a fabricated number. acme-input/acme-change detail { value, valueAsNumber }; increment()/decrement()/clear()/focus() methods. Parts root/input/control/increment/decrement; start/end/add-on slots.

Press-and-hold, arrows/Home/End and modifier steps follow the source, with consistent disabled/form/reduced-motion behavior. No scrubber/pointer-lock addition is assumed merely because current Zag also contains it. Verify decimal steps, locale changes, bounds, partial input, blur/Enter commits, wheel opt-in, hold cancellation and cleanup. No floating-point drift or source-machine state store.

## F-05 Pin Input

Family acme-pin-input and acme-pin-input-field. Root count: required positive integer; value: readonly string[] defaults to count empty cells; type: numeric|alphabetic|alphanumeric=numeric; mask=false; otp=false; placeholder="○"; autoFocus=false; blurOnComplete=false; autoSubmit=false. Root owns one native submission value equal to joined characters; fields do not submit separately. Root name/form/disabled/readOnly/required apply.

Optional fields expose index and standard naming; default generated fields label position/count using localized messages. Parts root/field; default slot supports separator content without making it another input. Methods focus(index=0), clear(), setValueAt(index,value). acme-input { value, valueAsString }; acme-change on committed value; acme-complete { value, valueAsString } on completion. Completion alone does not submit unless explicitly enabled.

Port source focus movement, deletion and paste carefully; preserve the distinction between whole-code paste and replacing from the current position. Masking is display, not secure storage. Verify full-code autofill, replacement/deletion, incomplete values, selection, invalid characters, count changes, reset, disabled Fieldset and genuine browser autocomplete. Current source reference uses UTF-16 character operations; do not claim grapheme support without testing the allowed alphabets.

## F-06 Select, ComboBox and Multi Select

Shared option model: acme-option has value: required string, label?: accessible/search text (default derived text content), disabled=false. Default slot can contain rich noninteractive text/icons; start/end/description slots; parts root/indicator/content. Collection owner registers only its own options and preserves value identity during reorder. Select and Multi Select accept nested sections. Ranked ComboBox requires direct Option children; optional section text renders labelled contiguous result groups without changing ranked order. Nested wrappers around ComboBox options are diagnosed. Child selection state is derived, not an independent public source.

| Root | Props/defaults beyond shared form contract | Ownership/events |
| --- | --- | --- |
| acme-select | value?: string; open=false; placeholder=""; clearable=false | Non-editable button/listbox, one value; typeahead; acme-change { value }; acme-open-change { open } |
| acme-combobox | value?: string; inputValue=""; open=false; clearable=true; loading=false; filter: built-in match-sorter or supplied function | Editable search text separate from selected option; acme-input { value: inputValue }; acme-change { value }; application may supply async options/loading |
| acme-multi-select | value: readonly string[]=[]; open=false; placeholder=""; clearable=false | One collection owns multiple choices; repeated form values; acme-change { value }; selection need not close the list |

All roots use default/options content plus trigger, start/end, empty and footer slots where relevant; parts root/trigger/input/value/content/list/option/clear. Select/Multi Select own the native trigger button. The trigger slot customizes its noninteractive content; appearance is available through the trigger part. Native-button ownership keeps the trigger and popup in a valid accessible reference scope. No arbitrary focusable child cloning. The [2026-09-22 trigger resolution](../docs/decisions/0035-execution-delegation.md#selection-trigger-ownership--2026-09-22) replaces the external supplied-button proposal after the native accessibility-tree finding.

Placement side: top|bottom|left|right=bottom; align: start|center|end=start; sideOffset=4 selected token mapping; collision avoidance=true. Shared overlay coordinator/placement handles scroll/resize/detach/theme. Lists use Radix shadow5. Native HTML select remains usable directly with Field; it is not a second acme-select mode with browser-dependent semantics.

ComboBox preserves full names with multiline options as selected. Highlighted option differs from selected value. Escape closes without silently committing a different value; Enter commits the highlighted enabled option; Tab commits only if the assigned source explicitly requires it. Do not retain negative boolean switches such as noRawSelectedValue as unexplained public flags. Filtering function returns ordered eligible items; async fetching/cancellation stays with the application. The inspected current ComboBox commits an enabled option on Enter; without one it closes, and its raw-value flag only controls display of a programmatically supplied unmatched value. Preserve option-only user commits and display unmatched supplied values while async options arrive. Free-form creation remains outside the selected scope; the original Q06 did not add it.

Acceptance: labels/descriptions, long/multiline text, empty/loading/error results, duplicates, option removal, nested controls, keyboard/typeahead, touch/IME, outside dismissal/focus return, group disabled state and HTML/Lit/React child identity. Hidden results do not leave active-descendant IDs pointing to absent content.

## F-07 Slider

acme-slider props value: readonly number[] (default [0]); min=0, max=100, step=1, largeStep=10, minStepsBetweenValues=0; orientation=horizontal; disabled=false; name=""; thumbLabels: readonly string[]=[]; formatValue?: function. One value per thumb; one/thumb array shape, no separate Range Slider family. Slot start/end for composed numeric inputs; parts root/track/range/thumb/label.

acme-input { value } during pointer/key edits; acme-change { value } on commit. Finite ordered programmatic values remain in the canonical store and native FormData. Bounds/grid/gap violations participate in validity; native thumbs use a constrained display projection. User edits snap/clamp to legal neighboring bounds without pushing other valid thumbs. Pointer cancellation, focus transfer, disable and disconnect retain the last live edit and emit no completion. Coincident thumbs choose the movable outer thumb from initial drag direction, then retain its index. thumbLabels is the per-thumb name array; inherited labels remains the native NodeList. Validated JSON thumbLabels is supported for HTML alongside Lit/React property arrays. [2026-09-22 label](../docs/decisions/0035-execution-delegation.md#slider-native-label-contract--2026-09-22) and [value/completion resolutions](../docs/decisions/0035-execution-delegation.md#slider-value-and-completion-behavior--2026-09-22). Native form sends repeated values; individual thumbs have slider semantics and distinct names. Optional Number Inputs are a recipe, not another state copy. Verify pointer cancel, captured drag, keyboard/Home/End/Page steps, RTL/vertical direction, multiple thumbs, bounds/gaps, focus and immediate forms.

## F-08 Calendar

acme-calendar props mode: single|range=range (preserves source capability/default); value?: ISO date string|{start:string,end?:string}; minValue/maxValue?: ISO date; locale inherits; timeZone?: IANA zone; showTimeInput=true baseline; presentation: popover|inline=popover; open=false; clearable=false; size small|medium=medium; presets: readonly {label,value}[]=[].

Use @internationalized/date. Date-only values do not gain a timezone through local Date parsing. Range end may be absent during selection; only a valid complete range satisfies required. Native submission serializes scalar ISO or one JSON range value; document this composite shape and test restoration. The submission format is explicit: date-only ISO when showTimeInput=false; offset-bearing ISO date-time when true, using supplied timeZone or the browser zone when omitted. Display conversion preserves the represented instant; date-only input preserves its calendar day. Parsing, DST and serialization require verification under @internationalized/date. The original Q07 did not authorize different serialization. The [2026-09-22 runtime correction](../docs/decisions/0035-execution-delegation.md#calendar-date-runtime-correction--2026-09-22) selects one private generated date runtime with the exact upstream parser correction, types, version/hash provenance and Apache notices; consumers need no postinstall mutation, patch configuration or registry fork.

Slots trigger/footer; parts root/trigger/content/header/grid/day/time/presets. acme-input for provisional range; acme-change { value } for committed selection; acme-open-change { open }. Focus/day/month/year keyboard behavior follows the audited source/reference and native calendar pattern. No network calendars, recurrence or multiple arbitrary dates are added.

## F-09 Field, Fieldset and Label

| Entry | Props/defaults | Content/semantics |
| --- | --- | --- |
| acme-field | orientation: vertical\|horizontal=vertical; required=false; optional=false; invalid=false; disabled=false | default control plus label/help/error slots; root/label/control/help/error parts; binds one logical registered control; no value or submission owner |
| acme-fieldset | disabled=false; invalid=false | legend/help/error/default slots; native fieldset/legend semantics through the selected real light-DOM container; does not overwrite child's own disabled state |
| acme-label | for?: control ID | default text; native naming/focus relation; resolves control's actual focus/name target; no decorative heading behavior |

Required/optional labels are mutually exclusive presentation. Error text is associated when active; clearing it removes only the owned description reference. Keep multiple external descriptions. Generated IDs are stable per element lifetime and scoped appropriately. Multiple logical controls require Fieldset or distinct Fields rather than silently labelling only the first. Fieldset uses a real native light-DOM container; its legend slot contains a native legend. Complete author ranges retain identity. Renderer adapters supply the stable native root before connection, as described by x-acme-native-root metadata. Structural child reconciliation must settle before inspecting its final form associations; public disabled changes on the established group are synchronous. Label clicks focus/activate the right control; disabled/group labels must retain native rules. Native-form probes establish only their measured scope, not completed accessibility certification. [2026-09-22 Fieldset](../docs/decisions/0035-execution-delegation.md#native-container-boundary-for-fieldset--2026-09-22) and [Field resolutions](../docs/decisions/0035-execution-delegation.md#field-association-details--2026-09-22) retain native labels, explicit naming and control-owned validity. Public element references are used where scope permits; scoped text mirrors handle the remaining boundary, with registry ownership transferred before reassociation.

## F-10 Optional managed forms

The typed bindField adapter targets the installed TanStack Form version; preserve public component value/events/native validity. Lit and React examples map their controller fields to the same property/event contract, including nested/array fields. No duplicate form submission hidden inside a control and no automatic schema-validation library. Adapter disposal unsubscribes; reset/disabled/error metadata stays distinct from presentation.

```html
<form>
  <acme-field required>
    <span slot="label">Email</span>
    <acme-input name="email" type="email" required></acme-input>
    <span slot="help">We use this address for delivery reports.</span>
  </acme-field>
  <acme-button type="submit">Save</acme-button>
</form>
```

Examples must prove valid FormData, invalid focus/reporting and submission before rendering, in static HTML and each framework. The [2026-09-26 managed-form audit](../docs/verification/systematization/m26-managed-forms/README.md) records the later Lit/React nested-array examples and the Lit field-path lifetime correction; earlier adapter probes alone did not establish those complete examples. For managed forms, application loading/error/success does not become an automatic Toast or route change.
