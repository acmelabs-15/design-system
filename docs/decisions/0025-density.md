# Share density settings across pages and sections

Provide an optional shared density setting for a page or section. It adjusts spacing in layouts and appropriate controls without shrinking text. Normal spacing remains the default. Peter chose shared density over requiring applications to coordinate every component's size/spacing independently.

Decided 2026-09-19 by Peter.

Menus, dialogs and Toasts retain normal spacing when their surrounding page is compact. Peter selected this over having those surfaces inherit compact spacing. This governs inherited density; their separate size and custom-theme options remain distinct. Tables, forms and toolbars can respond where appropriate. The component contracts own the complete eligibility list.

For explicitly selected compact mode, use a **24 × 24 CSS-pixel minimum clickable area** for buttons and similar controls, with larger touch-friendly sizing available. Peter selected this over requiring 48 × 48 areas in compact mode. This is a floor, not a required size for every control or a new universal default-mode target. Check actual target shapes, spacing, clipping and overlap; visual dimensions alone do not prove compliance or usability.

The approved Theme contract uses normal/compact and the role-specific mapping below. Complete per-component mapping and rendered limits require engineering verification, with the named constraints preserved. Text size changes belong to their own size/theme/responsive settings. No implementation or all-engine target audit is implied by design approval.

Evidence: [density analysis](../research/07-design-foundations.md#density-and-interaction-targets).

## Approved compact treatment

Decided 2026-09-20 by Peter through “I approve all proposals.”

Peter's whole-set approval selects role-specific compact tokens rather than one uniform multiplier. The approved comparison targets at a 16px root reference are layout gaps 8→6px and 16→12px, Table block padding 10→5px, and unchanged Table inline padding 8px. Express the token values consistently with the selected rem scale; explicit CSS overrides retain their authored values. All role mappings must preserve unchanged typography/icons/borders, normal-density overlay exceptions and the 24×24 CSS-pixel compact target floor. Verify the actual rendered mappings; approval is not a measurement.

[Complete approval record](0049-inventory-approval.md), [closed question register](../design/systematization-decisions.md).

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../spec/SPEC-design-system.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
