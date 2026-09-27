# Text and formatting — R03

**Approved 2026-09-20 by Peter as part of the full proposal set.** The stated recommendations are selected. Technical verification remains required; implementation follows the approved migration plan. [Approval](../../decisions/inventory-approval.md).

**Approved family contract.** Apply [shared conventions](foundations.md); details below are proposed where not already selected. Text/Heading inclusion, native tags and defaults are selected. Local evidence: [current declarations](../evidence/current-public-interfaces-2026-09-20.json), [typography and semantic investigation](../../analysis/design-foundations.md#primitive-semantics-and-typography-defaults), [formatter decision](../../decisions/format-components.md).

## Shared typography interface

Text, Heading, Link, Code, Quote and Strong support size?: responsive CSS font-size/theme-variable string. Kbd retains its small/medium size tier. All seven support weight?: responsive CSS font-weight number/string; color?: responsive CSS color; textAlign?: responsive CSS alignment; truncate=false; lineClamp?: positive integer. CSS styling getters remain undefined. Visual defaults come from their house typography role, not arbitrary inherited browser margins. A positive lineClamp takes precedence over single-line truncate; truncation changes visual presentation, never the full accessible text or copied value.

Each retains a real host and native semantic root, part=root and one default slot unless specified otherwise. Consumer inline content stays owned by its framework. No artificial keyboard behavior or change events. Text styling is not a control value.

| Entry | Tag / native meaning | Additional properties/defaults | Composition and verification |
| --- | --- | --- | --- |
| T-01 Text | acme-text; selected as=p\|span\|div, default p | Shared typography; default body appearance | Paragraph/inline/block content; remove default paragraph margins through generated house rules; verify inline flow and naming |
| T-02 Heading | acme-heading; selected as=h1…h6, default h2 | Shared typography; size independent of heading level | Native heading semantics; host ID is TOC target; expose getHeadingElement(): HTMLHeadingElement for TOC/verification; no invented heading level from a visual size |
| T-03 Link | acme-link; native a | href="", target="", rel="", download?: string; underline: auto\|always\|none=auto; disabled=false proposed | Real navigation; disabled suppresses activation and exposes aria-disabled; default/start/end slots; root/start/end parts; no custom navigation event |
| T-04 Code | acme-code; native code | Shared typography; syntax="" retains optional inline highlighting capability | Plain text is safe code input, never markup execution; highlighting uses selected TanStack package; language change/empty content/escaped text |
| T-05 Quote | acme-quote; native q by default, as=q\|blockquote | cite?: URL string | Inline/block quotations with correct native meaning; cite does not invent visible attribution; an attribution is authored content |
| T-06 Kbd | acme-kbd; native kbd | size: small\|medium=medium; keys?: readonly string[] | Keys are canonical named keys, formatted for platform/localized labels; default slot is used only when keys absent; output describes a shortcut and never registers it |
| T-07 Strong | acme-strong; native strong | Shared typography | Semantic importance, not forced heading or action; nested inline content and theme contrast |
| T-08 Middle Truncate | acme-middle-truncate; text span | value="" | Display full value when it fits; preserve both ends when it does not; part=root/text; accessible/copy value stays complete; resize/font/RTL update without splitting grapheme clusters |
| T-09 Relative Time | acme-relative-time; native time | date?: ISO string\|Date\|epoch milliseconds; locale?: string; numeric: always\|auto=auto; format: long\|short\|narrow=long; autoUpdate=true | Valid date required for text; absent/invalid produces no invented date and a development diagnostic; epoch 0 valid; scheduler updates only at next relevant boundary |
| T-10 FormatNumber | acme-format-number; text span | value?: finite number; locale?: string; options?: Intl.NumberFormatOptions={} | Numeric value is sole data input; default decimal formatting; currency/unit requirements follow Intl; no child text parsing or form value |
| T-11 FormatByte | acme-format-byte; text span | value?: finite number; locale?: string; unit: byte\|bit=byte; unitDisplay: long\|short\|narrow=short; unitSystem: decimal\|binary=decimal | Follow the verified Chakra/Ark decimal/binary scaling contract; three significant digits in the underlying formatter |

The shared size/weight vocabulary is a proposed component interface. Exact house visual role values remain generator/token references; do not turn typography numbers into the selected spacing/size scale. Full CSS font-size values require strings where units apply.

## Formatting and content rules

Relative Time accepts future as well as past dates and locale-sensitive plural/unit selection. Expose an absolute ISO datetime on time and provide an accessible absolute description through composition when needed. A Hover Card with UTC/local details is an optional recipe, not a built-in popup or focus behavior. Date-only strings mean UTC midnight; ISO timestamps require an explicit offset. Valid inputs normalize to an owned epoch value. The platform-name corrections and lifecycle policy are recorded in [delegated implementation decisions](../../decisions/execution-delegation.md#typography-implementation-resolutions--2026-09-21).

FormatNumber passes supported Intl options as an object property in Lit/React and a documented JSON options attribute for static HTML. Missing value renders no fabricated zero; supplied 0 renders correctly. FormatByte uses a numeric amount in the declared unit and does not guess binary/decimal meaning from a child string; negative signs are supported like the source, useful for size differences. Invalid option combinations follow the native formatter error surface with a controlled empty fallback plus development diagnostic proposed for review; this is separate from CSS-value handling.

The complete [Ark wrapper](https://github.com/chakra-ui/ark/blob/main/packages/react/src/components/format/format-byte.tsx) and [formatter source](https://github.com/chakra-ui/zag/blob/main/packages/utilities/i18n-utils/src/format-bytes.ts) were inspected. The latter defaults to decimal/byte/short and three significant digits, and preserves negative signs. It also hardcodes zero as 0 B and uses SI unit names after binary division. Do not claim localized bit-zero or IEC labels from that source; correct and verify those house outcomes rather than silently reproduce misleading output. No additional precision prop beyond the reviewed wrapper is needed. Native Intl/house implementation remains; no Ark/Zag runtime is adopted.

## Examples and acceptance

```html
<acme-heading as="h1">Delivery report</acme-heading>
<acme-text>Updated <acme-relative-time date="2026-09-20T12:00:00Z"></acme-relative-time></acme-text>
<acme-format-number value="1250" options='{"style":"currency","currency":"USD"}'></acme-format-number>
<acme-format-byte value="1048576"></acme-format-byte>
```

Lit binds .value and .options as their actual types. React passes the same numeric/options props. Neither path formats a number to text before giving it to the formatter.

Verify semantic/accessibility tree and native content validity, real inline host flow, nested slots, IDs/TOC, line clamp/truncation, selection/copy and zoom. Formatter cases include zero, negative Number/Byte values, missing/nonfinite inputs, locale/direction changes, supported precision, currency/unit errors and time boundaries. Reconnect cancels/restarts exactly one Relative Time schedule; formatting components create no interval. Source inheritance and exact approved API must appear in CEM.
