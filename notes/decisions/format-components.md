Decided 2026-09-19 by Peter.

# Add FormatNumber and FormatByte with numeric values

Provide FormatNumber and FormatByte as requested by Peter. He selected **Value property** for both: static HTML supplies a numeric attribute and Lit/React callers can bind a number. Child content is not a second source of the input.

Chakra's format components use a required numeric value; the inspected Ark wrappers return formatted text. This keeps the original number separate from currency, separators and units. It also avoids reading a displayed child string back as data.

Use the existing house stack. These references do not adopt Ark/Zag formatting dependencies or change the independent Number Input parser decision. Locale inheritance, supported number options, decimal/binary byte units, rounding, absent/invalid values and accessible full values remain for the inventory. Formatters display values; they do not own input editing, calculations or form state.

Evidence: [capability review](../analysis/codebase-systematization.md#accelerated-capability-and-disposition-checkpoint), [choice record](../alignment/evidence/capability-checkpoint-2026-09-19.json). Implementation still waits for Phase 5 approval.

## Implementation and binary-unit data — 2026-09-21

The inventory and migration are approved. FormatNumber and FormatByte are now implemented; [verification and source record](../alignment/evidence/m08-formatters-2026-09-21.json).

Under Peter's execution delegation, use cldr-units-full 48.2.0 as a development-only data source for binary long-name prefixes. Native Intl rejects kibibyte as a unit identifier. A generated table deduplicates five prefixes across all 766 supplied locales into 52 pattern sets. Native Intl still supplies numbers, base-unit plural forms and spacing. Unicode's documented combineLowercasing rule joins the localized long prefix and base unit. Binary short/narrow output uses IEC symbols such as KiB/Kibit. The Unicode license ships with the package; no CLDR runtime engine or network lookup is added.

Native formatting handles zero in the declared unit/locale. Three significant digits are applied directly through Intl so small finite amounts are not discarded by a second fraction-digit default. Invalid values/options use the approved empty fallback plus a diagnostic. This is an implementation resolution, not a new precision setting or another value-input path.
