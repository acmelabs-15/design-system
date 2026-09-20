Decided 2026-09-19 by Peter.

# Add FormatNumber and FormatByte with numeric values

Provide FormatNumber and FormatByte as requested by Peter. He selected **Value property** for both: static HTML supplies a numeric attribute and Lit/React callers can bind a number. Child content is not a second source of the input.

Chakra's format components use a required numeric value; the inspected Ark wrappers return formatted text. This keeps the original number separate from currency, separators and units. It also avoids reading a displayed child string back as data.

Use the existing house stack. These references do not adopt Ark/Zag formatting dependencies or change the independent Number Input parser decision. Locale inheritance, supported number options, decimal/binary byte units, rounding, absent/invalid values and accessible full values remain for the inventory. Formatters display values; they do not own input editing, calculations or form state.

Evidence: [capability review](../analysis/codebase-systematization.md#accelerated-capability-and-disposition-checkpoint), [choice record](../alignment/evidence/capability-checkpoint-2026-09-19.json). Implementation still waits for Phase 5 approval.
