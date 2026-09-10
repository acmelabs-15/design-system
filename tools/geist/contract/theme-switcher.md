# theme-switcher: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Best Practices) Don’t rebuild a theme picker with `Switch` or three icon buttons. Theme Switcher already handles the icons, the `aria-label` per option, and System detection.

## Read and judge — names an observable, but also carries guidance

- [ ] (Best Practices) The control auto-disables when `forcedTheme` is set on the provider; setting `disabled` manually is for read-only previews of the control itself.

## Guidance — read it, apply judgement, no test

- [ ] (Best Practices) Use Theme Switcher for the canonical Light / System / Dark control. Place it once per app, in the footer or settings, not duplicated across pages.
- [ ] (Best Practices) Pass `small` for dense chrome (footers, dropdowns); use the default size on a settings page where there’s room for the labels to breathe.
- [ ] (Best Practices) Theme Switcher reads from and writes to `next-themes`, so wrap the app in `GeistProvider` once at the root and don’t mirror its state into local React state.
- [ ] (Best Practices) The component composes its own labels from the theme keys (`light`, `system`, `dark`); leave them alone so they stay translatable through `next-themes`.
