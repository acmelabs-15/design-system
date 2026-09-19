Decided 2026-09-19 by Peter.

# Remove standalone Error and place messages by context

Remove the standalone Error element. Use Toast for brief action results, Alert for section/form messages, and Banner for page/app notices. Error describes a message's meaning and can occur in any of these contexts. Preserve validation text associated with each input and a small, plain appearance where needed.

Peter supplied the Toast/Alert/Banner diagram, then selected “Remove standalone Error.” The diagram clarifies scope, placement and lifecycle; it does not itself specify field validation behaviour. The input-to-message association must be consistent and verified. The current Input and Textarea lack the explicit description link found in Select; this is source evidence, not a screen-reader result.

This removes the extra public interface without removing failure or recovery messages. Exact field APIs, announcement policies and Alert treatments remain for the inventory. Remove the old element, associated generator inputs, tests and docs during the approved migration, with no compatibility alias. The earlier decisions to rename Note to Alert and delete Error Card and Project Banner remain.

Evidence: [message-family analysis](../analysis/codebase-systematization.md#phase-2-message-family), [review record](../alignment/phase-2-review.md), and Peter's [diagram](</Users/peterkloss/Documents/toast-vs-alert-vs-banner.png>).
