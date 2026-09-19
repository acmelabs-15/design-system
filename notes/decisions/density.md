Decided 2026-09-19 by Peter.

# Share density settings across pages and sections

Provide an optional shared density setting for a page or section. It adjusts spacing in layouts and appropriate controls without shrinking text. Normal spacing remains the default. Peter chose shared density over requiring applications to coordinate every component's size/spacing independently.

Menus, dialogs and Toasts retain normal spacing when their surrounding page is compact. Peter selected this over having those surfaces inherit compact spacing. This governs inherited density; their separate size and custom-theme options remain distinct. Tables, forms and toolbars can respond where appropriate. The complete eligibility list belongs to the inventory.

For explicitly selected compact mode, use a **24 × 24 CSS-pixel minimum clickable area** for buttons and similar controls, with larger touch-friendly sizing available. Peter selected this over requiring 48 × 48 areas in compact mode. This is a floor, not a required size for every control or a new universal default-mode target. Check actual target shapes, spacing, clipping and overlap; visual dimensions alone do not prove compliance or usability.

The public names, number of levels, exact spacing values, inheritance/override details and per-component limits remain for later design. Text size changes continue to belong to their own size/theme/responsive settings. No implementation or all-engine target audit was completed.

Evidence: [density analysis](../analysis/design-foundations.md#density-and-interaction-targets).
