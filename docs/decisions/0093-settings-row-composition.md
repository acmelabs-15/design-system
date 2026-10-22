# Replace settings rows with Field and Item recipes

Setting Row and Setting Rows are removed. Peter selected **Use Field and Item**.

Decided 2026-09-19 by Peter.

Input settings use horizontal Field so labels, help, errors and control associations stay together. Action rows, such as Transfer Project, use Item with a Button. Shared layout arranges several rows; Fieldset or List adds meaning where appropriate.

The Setting Row reviewed on 2026-09-19 supplied only heading/description/control placement. Chakra Pro already demonstrates horizontal Fields for settings. A dedicated wrapper would add another interface over the selected shared families. Provide complete settings recipes and preserve descriptions, alignment, actions and accessible names.

This does not turn every settings collection into a Fieldset or every action into a form field. Exact recipes belong to the later [inputs/forms](../../spec/SPEC-inputs-forms.md) and [surfaces](../../spec/SPEC-surfaces.md) contracts. The completed migration's phase gate is retired.

Evidence: [review](../research/06-codebase-systematization.md#accelerated-capability-and-disposition-checkpoint), [selection](../verification/systematization/capability-checkpoint-2026-09-19.json).
