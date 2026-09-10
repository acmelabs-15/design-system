# Materials

Presets for radii, fills, strokes, and shadows.

## Surface

On the page.
Example · Class name · Usage
material-base
 · material-base · Everyday use. Radius 6px.
material-small
 · material-small · Slightly raised. Radius 6px.
material-medium
 · material-medium · Further raised. Radius 12px.
material-large
 · material-large · Further raised. Radius 12px.

## Floating

Above the page.
Example · Class name · Usage
material-tooltip
 · material-tooltip · Lightest shadow. Corner 6px. The tooltip is the only floating element with a triangular stem.
material-menu
 · material-menu · Lift from page. Radius 12px.
material-modal
 · material-modal · Further lift. Radius 12px.
material-fullscreen
 · material-fullscreen · Biggest lift. Radius 16px.

## Best Practices

**When to use**

- Use a material instead of hand-rolling radii, fills, strokes and shadows on a surface; the preset encodes the elevation role.
- Pick the preset from where the element sits in the layered hierarchy: base for resting cards, small to large for raised content, tooltip and menu for floating popovers, modal for dialogs, fullscreen for takeovers.
- Do not stack two materials on one element; when a child needs more elevation, lift it into its own material with a higher preset.

**Behavior**

- Align the elevation with the element's z-index band, so a tooltip surface never sits visually below a base card.
- Favor the lowest elevation that still reads as raised against its background; over-elevating is a common source of visual noise.
- Let the preset drive the chrome and use layout spacing for layout, instead of overriding shadows on the same element.

**Accessibility**

- A material is decorative chrome; semantics live on the role-bearing wrapper (role="dialog" on a modal, role="tooltip" on a tooltip).
- Do not rely on shadow alone to communicate elevation; pair it with the focus-visible ring on the focusable children inside.
- Test materials in both themes: shadow contrast on dark backgrounds is weaker than on light, so confirm the separation still reads.

