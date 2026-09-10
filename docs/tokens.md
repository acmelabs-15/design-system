# Tokens

The semantic layer page rules use on top of Geist's scales, the deployment and chart colors, the radii and the focus ring. A house page; Geist has no section for these. House component; Geist has no page for it.

## Semantic tokens

What page rules use. Each maps onto a scale step, so the theme switch carries every rule.

## Status and chart series

The deployment status colors and the chart series, as the Vercel dashboard draws them; the same in both themes.

## Shadow tokens

The material presets as tokens.
Example · Token · Usage
 · --ds-shadow-border · Cards, panels, pills, the kbd
 · --ds-shadow-small · A raised card without a border
 · --ds-shadow-border-small · Link cards, chart panels
 · --ds-shadow-medium · Hover on a link card
 · --ds-shadow-border-medium · Feature cards
 · --ds-shadow-large · Marketing cards
 · --ds-shadow-border-large · Marketing cards
 · --ds-shadow-tooltip · Chart tooltips
 · --ds-shadow-menu · Menus, toasts
 · --ds-shadow-modal · Modals
 · --ds-shadow-fullscreen · Sheets
 · --ds-shadow-border-inset · Pills, badges as links, swatches

## Radii

4 for kbd and chips, 6 for controls and cards, 8 for large inputs, 10 for chart panels, 12 for menus and modals, 16 for sheets, full for pills.
468101216full

## Focus

Two pixels of the ground, then four of the focus blue; on :focus-visible only. Press Tab to see it.
Tab to me

## House type styles

Styles Geist has no page for: the mono eyebrow label, the Stat value, and the analytics strip value from the dashboard.
Example · Class name · Usage
Eyebrow label · .eyebrow · 11 mono caps .09em · Cell and card labels
$62,450 · acme-stat value · 24/32 mono 600 · The one headline figure
2,847 · acme-strip-item value · 32/40 600 · The analytics strip figure

