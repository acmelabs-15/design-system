---
id: RES-071
status: resolved # in-progress | resolved
outcome: answered
kind: research
from: IDEA-006#09 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-13
---
# RES-071: Devtools of design systems and the candidate capabilities

## Question
Which design systems ship devtools of their own, Material and other large systems among them, what does each tool do, and what do the tools of TanStack Devtools do for their users? The result is a full list of candidate capabilities for the devtools of a new design system.

Settled context: one devtools package for all framework versions. The first release has six capabilities (DEC-143): live prop switching with prop inspection, theming controls, a token inspector, accessibility checks, an event log and a breakpoint view. The theming controls export a custom theme as a file (DEC-145). RES-031 covers TanStack Devtools and eleven other bases; this record does not repeat it.

## Answer
Sufficient-answer condition:

1. At least twelve large design systems, each with its version or date: MUI, Material Web, Angular Material, Chakra UI, Ant Design, Mantine, Carbon, Fluent UI, Spectrum, Atlassian, Polaris, Radix Themes, shadcn/ui and others found. For each: does it ship tooling for developers who build with it, sorted by kind (in-page tool, browser extension, theme editor or playground on a website, editor extension, lint plugin, Figma tool), with capabilities, status and source.
2. A system with no such tool is listed as "none found", with what was checked.
3. TanStack Devtools: each tool and plugin, and what it does for the user.
4. One deduplicated list of candidate capabilities: which tools have it, and whether it is one of the six of DEC-143, the theme export of DEC-145, or new.

Answered on 2026-11-13 by one research agent with one web tool (Firecrawl). The facts and sources are under Findings. This section sorts them. It ranks nothing and recommends nothing.

### 1. Design systems and their tools for developers
Twenty-one systems were checked. Kinds: in-page = a tool inside the running app; extension = a browser extension; web = a theme editor, generator or viewer on a website; editor = an editor extension or CLI that serves the editor; lint = a lint plugin; Figma = a Figma plugin. "None found" means the searches named under Findings returned no first-party tool of that kind.

| System | Version or date | In-page | Extension | Web | Editor or CLI | Lint | Figma |
|---|---|---|---|---|---|---|---|
| MUI (Material UI) | 9.5.0 per docs link | none found | none found | Default theme viewer (theme object tree) | none found | none found | Material UI Sync: theme file from Figma (beta, or suspended in 2024: the docs disagree) |
| Material Web | 2.5.0, maintenance mode | none found | none found | Material Theme Builder (shared M3 tool) | none found | none found | Material Theme Builder plugin |
| Angular Material | 22.2.7 | none found | none found | Material Theme Builder (shared) | Schematics: ng add, component scaffolds, theme-color palette file | none found | Material Theme Builder plugin |
| Chakra UI | 3.38.0 | none found | none found | none found | CLI: typegen for custom tokens and recipes, snippet, blocks, eject | none found | not checked |
| Ant Design | 6.7.0 | none found | none found | Theme Editor (seed and map tokens, global and per component); antd-token-previewer package | none found | none found | not checked |
| Mantine | 9.8.0 | none found | none found | Colors generator (10 shades and theme code) | none found | none found | not checked |
| Carbon | Carbon Devtools 3.0.0 (2026-06-17) | none found | Carbon Devtools: grid overlay, specs of used tokens, component list, breakpoint and resize | none found | none found | stylelint-plugin-carbon-tokens v5 | not checked |
| Fluent UI | 9.75.2 | none found | Griffel DevTools 0.3.1: inspect generated CSS classes | Theme Designer: 16-color brand ramp with contrast checks | none found | eslint-plugin-react-components; eslint-plugin-fluentui-jsx-a11y | not checked |
| Spectrum | site read 2026-11-13 | none found | none found | S2 Tokens Viewer; S1 and S2 token dependency Visualizers; release timeline | token diff and audit tools (CLI) | none found | component-options-editor; figma-spec-plugin |
| Atlassian | site read 2026-11-13 | none found | none found | none found | none found | ESLint plugin (tokens, components, accessibility, migrations); Stylelint plugin (tokens) | not checked |
| Polaris | React archived; web components since 2025-10-01 | none found | none found | none found | Polaris for VS Code 0.9.8 (2024-04-02, archived repo); polaris-migrator | stylelint-polaris (archived repo) | not checked |
| Radix Themes | 3.3.0 | ThemePanel: accent, gray, appearance, radius, scaling, panel background, Copy Theme | none found | Playground page | none found | none found | not checked |
| shadcn/ui | CLI 4.23.0 | none found | none found | shadcn/create: preview colors, radius, fonts, icons; preset code | CLI: add components, apply a preset | none found | not checked |
| Vaadin | docs "latest", read 2026-11-13 | Copilot: properties, outline, theme editor with save to stylesheet, accessibility checker, logs, go to source, docs, feature flags, all-components gallery and more | none found | none found | IDE link through Go to Source | none found | not checked |
| SAP UI5 | SAPUI5 docs 1.154 | Support Assistant: rule checks (accessibility, performance, binding, usability) | UI5 Inspector: control tree, property edit, bindings | none found | none found | none found | not checked |
| Primer | read 2026-11-13 | none found | none found | none found | none found | eslint-plugin-primer-react; @primer/stylelint-config | not checked |
| Salesforce SLDS | Validator 2.0.12 | none found | none found | none found | SLDS Validator for VS Code | SLDS Linter (bulk fixes) | not checked |
| Web Awesome | 3.14.0 | none found | none found | Theme Builder (Pro): theme, palette, variant colors, fonts, roundness, spacing, icons, live preview | none found | none found | not checked |
| PrimeVue and PrimeNG | Designer guide read 2026-11-13 | none found | none found | Theme Designer (paid): all tokens, component tokens, autocomplete, download, cloud, migration assistant | none found | none found | Figma tokens to theme code |
| Ionic | docs read 2026-11-13 | none found | none found | Color Generator; Stepped Color Generator | none found | none found | not checked |
| Elastic EUI | read 2026-11-13 | none found | none found | none found | none found | @elastic/eslint-plugin-eui | not checked |

Patterns in the evidence:
- Three systems ship a tool inside the running app: Radix Themes (ThemePanel, theme only), Vaadin (Copilot, broad) and SAP UI5 (Support Assistant, rule checks). Vaadin's and UI5's apps are framework-bound (Vaadin Flow and Hilla; SAPUI5).
- Three ship a browser extension of their own: Carbon, Fluent (Griffel DevTools) and SAP UI5. RES-031 adds framework-neutral and Lit extensions that no design system ships.
- Theme editors on a website are the most common kind: Ant Design, Fluent, Material, Mantine, shadcn/ui, Web Awesome, PrimeTek, Ionic, Spectrum (a viewer).
- Lint plugins are common among large enterprise systems: Carbon, Atlassian, Fluent, Polaris, Primer, SLDS, EUI.
- None of the twenty-one ships a design-system devtools panel that sits on TanStack Devtools, Vite DevTools or Vue DevTools.

### 2. TanStack Devtools: what each tool does for its user
RES-031 holds the shell, the plugin API, the a11y plugin and the Table devtools. New in this run, from the main branch on 2026-11-13:
- Shell: hotkeys to open and to inspect, a floating or fixed trigger that docks at an edge, panel at top or bottom, gating by a URL flag, hidden under browser automation, a mode above modal dialogs, and a workspace where open plugins are split, stacked or tabbed, resized, shown in picture-in-picture, and restored after reload.
- Vite plugin: Go to Source (hold a hotkey, an overlay shows each element's source location, a click opens the editor at the line), console piping between browser and terminal, enhanced logs with clickable source locations, production stripping, a server event bus, and a plugin marketplace that installs a plugin from the Settings tab.
- Plugins in the marketplace registry: Query (inspect, filter and search queries, mutations and cache; edit query data), Router (inspect routes, navigation and router state), Form (form state, validation, field values), Pacer, Accessibility (axe-core, WCAG 2.1 and 2.2, live monitoring, overlays, JSON and CSV export), AI (messages, token usage, streaming chunks, tool calls, reasoning), and the third-party Prefetch Heatmap (a color overlay and a metrics panel) and Inertia 3 Devtools.
- No TanStack plugin edits component props, theme values or tokens (RES-031 and this run).

### 3. Candidate capabilities
One list, no duplicates. "DEC" says how each relates to DEC-143 (numbers 1 to 6) and DEC-145 (theme export). "RES-031" in the tools column marks a tool whose facts are in that record.

| # | Capability | Tools that have it | DEC |
|---|---|---|---|
| 1 | Pick a component on the page with a hover overlay | TanStack source inspector; Vaadin Copilot (select, parent and sibling); RES-031: Lit DevTools, Vue DevTools inspector | Part of 1 (the "selected component") |
| 2 | Show the props of the selected component and edit them live, as a temporary override | Vaadin Properties; UI5 Inspector; RES-031: Lit DevTools, Lit Prism, Web Component DevTools, Vue DevTools; Storybook Controls on a story | 1 |
| 3 | Component inventory of the page: list the system's components, search, locate on the page | Carbon Component list | New |
| 4 | Component hierarchy outline with highlight and select | Vaadin Outline; UI5 Inspector control tree; RES-031: Lit DevTools, Vue DevTools | New |
| 5 | Go to source: open the editor at the line that creates the element or component | TanStack Go to Source; Vaadin Go to Source; RES-031: Storybook openInEditor | New |
| 6 | Global theme controls with live preview: light and dark, accent and neutral colors, radius, scaling, fonts, spacing | Radix ThemePanel; Vaadin Theme Editor (Aura: color-scheme modes, palettes); Web Awesome Theme Builder; Ant Theme Editor; shadcn/create; PrimeTek Theme Designer; Material Theme Builder | 2 |
| 7 | Style overrides for one component or one component's tokens | Vaadin Theme Editor (selected component); Ant Theme Editor (Component tab); PrimeTek Designer (component tokens) | New |
| 8 | Palette generation from one brand color, with contrast-safe steps | Fluent Theme Designer; Mantine colors generator; Material Theme Builder (HCT, harmonization, from an image); Ionic Color Generator; Angular Material theme-color schematic | New |
| 9 | Copy the theme as code to the clipboard or as a shareable link | Radix Copy Theme; Mantine generated code and Copy URL; Ionic generators; shadcn preset code | Close to DEC-145 (text, not a file) |
| 10 | Export the custom theme as a file | Material Theme Builder Export; PrimeTek Designer download (paid); MUI Sync theme file from Figma | DEC-145 |
| 11 | Import a theme from JSON or tokens | Material Theme Builder JSON import; PrimeTek Designer tokens upload | New |
| 12 | Save changes back to the project's stylesheet or source | Vaadin Theme Editor ("save your browser inspector changes into application stylesheet"); RES-031: Storybook save from Controls | New |
| 13 | Token inspector: which tokens an element or component uses | Carbon Specs (color, spacing, typography); RES-031: Lit DevTools (CSS custom properties a class reads) | 3 |
| 14 | Token browser: all tokens, alias chains, derived values | Spectrum Tokens Viewer and Visualizers; Ant Theme Editor map-token view; MUI Default theme viewer | New |
| 15 | Token autocomplete and typing in the editor | Chakra typegen; PrimeTek Designer `{` autocomplete; SLDS Validator code completion | New |
| 16 | Grid overlay on the page | Carbon Grid overlay | New |
| 17 | Current breakpoint and resize to each breakpoint | Carbon Resize browser; RES-031: Storybook Viewport | Close to 6 (DEC-143 6 shows a layout component's style props per breakpoint) |
| 18 | Accessibility audit of the page or a component, with overlays and fix hints | TanStack a11y plugin; Vaadin Accessibility Checker; UI5 Support Assistant; RES-031: Storybook A11y, Astro Audit, Vercel audit, Devframe a11y | 4 (DEC-143 scopes it to the selected component) |
| 19 | Export of check results as JSON or CSV | TanStack a11y plugin | New |
| 20 | Simulate vision impairments | RES-031: Storybook A11y toolbar | New |
| 21 | Event log of component events as they happen | RES-031: Lit DevTools Timeline, Web Component DevTools, api-viewer-element, Storybook Actions | 5 |
| 22 | Application log in the panel; console piping; logs with source locations | Vaadin App Log; TanStack console piping and enhanced logs | New |
| 23 | Inspect generated CSS classes and overrides | Griffel DevTools | New |
| 24 | Rule-based health check beyond accessibility (performance, usability, binding) | UI5 Support Assistant | New |
| 25 | Gallery of all components with variants and states under the current theme | Vaadin All Components view | New |
| 26 | Documentation of the selected component in the panel | Vaadin Documentation panel | New |
| 27 | Version update notice and migration help (missing tokens, deprecated APIs) | Vaadin version notice; PrimeTek migration assistant; Atlassian migration rules; polaris-migrator; Fluent prefer-fluentui-v9 | New |
| 28 | Lint: tokens instead of raw values | Carbon Stylelint; Atlassian ESLint and Stylelint; stylelint-polaris; SLDS Validator and Linter | New (lint kind) |
| 29 | Lint: system components instead of raw HTML, and correct component use | Atlassian ESLint; EUI ESLint; Primer ESLint | New (lint kind) |
| 30 | Lint: accessibility of component use in code | Atlassian ESLint accessibility rules; Fluent jsx-a11y plugin | New (lint kind) |
| 31 | Figma to theme code | MUI Sync; Material Theme Builder plugin; PrimeTek Designer; Spectrum Figma plugins | New (Figma kind) |
| 32 | Token diff between releases | Spectrum token-diff-generator | New |
| 33 | Feature flags panel | Vaadin Features; RES-031: Vercel Flags Explorer | New |
| 34 | Annotations or comments on the page | Vaadin Annotations; RES-031: Vercel comments | New |
| 35 | Visual composition: palette, drag and drop, wrap in layout | Vaadin UI Library, Outline drag and drop, Wrap with | New |
| 36 | UI test generation or recording | Vaadin (experimental) | New |
| 37 | Data binding inspector | UI5 Inspector | New |
| 38 | Shell: open and inspect hotkeys, dockable trigger, panel position | TanStack shell; RES-031: Vue and Nuxt DevTools docks | New (shell) |
| 39 | Shell: gate by URL flag, hide under automation, strip from production | TanStack shell and Vite plugin; Vaadin (dev mode only, `vaadin.copilot.enable`) | New (shell) |
| 40 | Shell: multi-panel workspace, picture-in-picture, persisted layout | TanStack plugin workspace | New (shell) |
| 41 | Shell: plugin marketplace and third-party panels | TanStack marketplace | New (shell) |

### What could not be confirmed
- Whether the Fluent Theme Designer and the Ant Design Theme Editor export a file: the fetched text showed no export step.
- The feature list of Polaris for VS Code: its documentation page returns 404.
- The rule lists of the Primer and EUI ESLint plugins: the pages did not render them.
- Figma tools of Chakra, Ant Design, Mantine, Carbon, Fluent, Atlassian, Polaris, Radix, Vaadin, UI5, Primer, SLDS, Web Awesome, Ionic and EUI: not checked in this run.
- The owner of themes.angular-material.dev.
- "None found" rests on web searches and the docs pages read; a tool that these did not surface may exist.
- Versions for Spectrum, Atlassian, Primer, Vaadin, Ionic and EUI were not read; the dates of the checks stand in.

### Disagreements between sources
- MUI: the design-resources page calls Material UI Sync "currently in beta"; the design-kits page says its development "was suspended in 2024".
- TanStack: the registry's docs URL for the Form devtools returns 404.

## Findings
Single research agent, 2026-11-13. Web tool: Firecrawl search and scrape, proved by a real read of the Carbon Devtools repository.

Carbon (IBM):
- Carbon Devtools is a browser extension for Chrome (and other Chromium browsers) and Firefox, "a simple set of tools for teams building live Carbon pages", for designers, developers and QA. Its features: Grid overlay (lays the 2x and mini unit grid over the page to check layout alignment); Specs (switches between color, spacing and typography specs to identify which Carbon tokens a component or element on the page uses); Component list (an inventory of the Carbon components on the page, searchable, a click finds the component on the page); Resize browser (shows which Carbon breakpoint the browser uses and resizes the browser to the supported breakpoints). A `component-list` package generates the list of components and their selectors across Carbon partner libraries. License Apache-2.0. Latest release 3.0.0 of 2026-06-17, "feat(v11): add Carbon v11 support"; 34 releases. Source: https://github.com/carbon-design-system/devtools and https://github.com/carbon-design-system/devtools/blob/base/packages/web-extension/README.md, checked 2026-11-13.
- stylelint-plugin-carbon-tokens (v5) is a lint plugin that enforces Carbon tokens in CSS and SCSS. Its rules include carbon/theme-use, carbon/layout-use, carbon/type-use, carbon/motion-duration-use, carbon/motion-easing-use and carbon/theme-layer-use, with presets light-touch, recommended and strict, options for accepted values and for custom variable names, and auto-fix for some problems. Carbon's web-components tutorial installs it. Source: https://github.com/carbon-design-system/stylelint-plugin-carbon-tokens and https://www.carbondesignsystem.com/getting-started/developing/web-components-tutorial/step-5, checked 2026-11-13.

Radix Themes:
- `ThemePanel` is "a drop-in component that allows you to preview the theme in real time"; an app places it inside its root `Theme`. Source: https://www.radix-ui.com/themes/docs/overview/getting-started, checked 2026-11-13.
- The panel's source has the sections Accent color, Gray color, Appearance (light or dark), Radius, Scaling and Panel background, and a "Copy Theme" button that copies the matching `<Theme ...>` props as text to the clipboard. It is fixed at the top right of the page. Source: https://raw.githubusercontent.com/radix-ui/themes/main/packages/radix-ui-themes/src/components/theme-panel.tsx, checked 2026-11-13.
- @radix-ui/themes is at 3.3.0 on npm's latest tag, license MIT, React only (peer dependencies react and react-dom 16.8 to 19). Source: https://registry.npmjs.org/@radix-ui/themes/latest, checked 2026-11-13.

Fluent UI (Microsoft):
- @fluentui/react-components (Fluent UI React v9) is at 9.75.2 on npm's latest tag. Source: https://registry.npmjs.org/-/package/@fluentui/react-components/dist-tags, checked 2026-11-13.
- Griffel DevTools is a Chrome extension that adds "a new developer tools panel to inspect classes generated by griffel", the CSS-in-JS engine of Fluent UI v9; it sits next to the Styles tab of Chrome DevTools. Chrome Web Store version 0.3.1, updated 2025-01-23. Fluent's styling docs say it "can be used to debug style overrides". Source: https://raw.githubusercontent.com/microsoft/griffel/main/packages/devtools/README.md and https://chromewebstore.google.com/detail/griffel-devtools/bejhagjehnpgagkaaeehdpdadmffbigb and https://storybooks.fluentui.dev/react/iframe.html?path=/story/concepts-developer-styling-components--docs, checked 2026-11-13.
- The Theme Designer is a page in Fluent's documentation site: "Inputting your organization's key color value will output a 16-color ramp that passes contrast checks when used in tokens and implemented with Fluent 2 components." The full page did not render in the fetch, so its export step is not confirmed here. Source: https://react.fluentui.dev/?path=/docs/theme-theme-designer--docs, checked 2026-11-13.
- @fluentui/eslint-plugin-react-components is a lint plugin with the rules prefer-fluentui-v9 (use the v9 counterpart of a v8 component) and enforce-use-client (a missing or unneeded "use client" directive). Source: https://npmjs.com/package/@fluentui/eslint-plugin-react-components, checked 2026-11-13.
- @microsoft/eslint-plugin-fluentui-jsx-a11y is "a set of eslint rules against Fluent UI React v9 to prevent common accessibility issues", by static analysis of JSX, for example accordion-item-needs-header-and-panel. Source: https://raw.githubusercontent.com/microsoft/eslint-plugin-fluentui-jsx-a11y/main/README.md, checked 2026-11-13.

MUI (Material UI):
- The docs link createTheme.ts at tag v9.5.0, so Material UI 9.5.0 is the documented version. The "Default theme viewer" page is a tree view of the default theme object, and the docs expose the theme as a `theme` variable in the browser console on every docs page. Source: https://mui.com/material-ui/customization/default-theme/, checked 2026-11-13.
- Material UI Sync is a Figma plugin that "generates a theme file that you can add to your codebase with all the design tokens and component customizations from Figma", with a preview through an embedded Storybook panel in the plugin. Source: https://mui.com/material-ui/getting-started/design-resources/, checked 2026-11-13.
- Disagreement on its status: the design-resources page says "Sync is currently in beta", and the design-kits page says "Development on the Material UI Sync plugin was suspended in 2024. We do not recommend using it in new projects" (quoted without its final period). Source: https://mui.com/material-ui/getting-started/design-resources/ and https://mui.com/design-kits/, checked 2026-11-13.
- A site search of mui.com for codemod, devtools or "browser extension" returned no result. Source: Firecrawl web search `site:mui.com codemod OR devtools OR "browser extension" material-ui`, checked 2026-11-13.

Material Design 3 (Google), shared by Material Web and Angular Material:
- Material Theme Builder exists as a web app (https://material-foundation.github.io/material-theme-builder/) and as a Figma plugin. It builds a Material 3 color scheme from a source image (wallpaper or content) or from key colors (primary, secondary, tertiary, neutral), adds extended colors with optional harmonization, offers an HCT color picker (hue, chroma, tone), a "Color Match" option, a "Pick your Fonts" type theme, theme presets, and JSON import. "Export" writes the theme in a chosen code format. The Figma plugin creates the tokens as Figma styles and swaps themes on selected components. Source: https://raw.githubusercontent.com/material-foundation/material-theme-builder/main/README.md, checked 2026-11-13.

Material Web:
- @material/web is at 2.5.0 on npm's latest tag. The README says "MWC is in maintenance mode pending new maintainers". Source: https://registry.npmjs.org/-/package/@material/web/dist-tags and https://raw.githubusercontent.com/material-components/material-web/main/README.md, checked 2026-11-13.
- Its color docs point to the Material Theme Builder Figma plugin "to generate a color scheme", set through CSS custom properties. No other tool for developers is named. Source: https://raw.githubusercontent.com/material-components/material-web/main/docs/theming/color.md, checked 2026-11-13.

Angular Material:
- @angular/material is at 22.2.7 on npm's latest tag. Source: https://registry.npmjs.org/-/package/@angular/material/dist-tags, checked 2026-11-13.
- Angular Material ships Angular CLI schematics: `ng add` sets up a project; component schematics generate address-form, navigation, dashboard, table, tree and (CDK) drag-drop components; the theme-color schematic `ng generate @angular/material:theme-color` "will generate a file with Material 3 palettes from the specified colors that can be used in a theme file". Source: https://material.angular.dev/guide/schematics, checked 2026-11-13.
- A site "Theme Builder for Angular Material Components" at themes.angular-material.dev says "Build, preview and export themes for Angular Material". Its owner was not checked; it is not on the official material.angular.dev domain. Source: https://themes.angular-material.dev/ (search excerpt only), checked 2026-11-13.

Chakra UI:
- @chakra-ui/react is at 3.38.0 on npm's latest tag. Source: https://registry.npmjs.org/-/package/@chakra-ui/react/dist-tags, checked 2026-11-13.
- The Chakra CLI (`npx chakra`) has the commands typegen (theme and recipe typings for custom tokens, semantic tokens and recipe variants, with --watch and --strict), snippet (adds snippets to a project), blocks (adds Chakra UI Pro blocks) and eject (takes control of the default theme tokens and recipes). The docs say typegen gives token autocompletion in the editor. Source: https://chakra-ui.com/docs/get-started/cli and https://chakra-ui.com/docs/theming/tokens, checked 2026-11-13.
- A web search for a Chakra theme builder, playground, devtools or VS Code extension found no first-party tool. Source: Firecrawl web search `Chakra UI theme builder OR playground OR devtools OR "VS Code" official chakra-ui.com`, checked 2026-11-13.

Ant Design:
- antd is at 6.7.0 on npm's latest tag. Source: https://registry.npmjs.org/-/package/antd/dist-tags, checked 2026-11-13.
- The Theme Editor is a page on the Ant Design site: "We provide tools to help users debug themes: Theme Editor. You can use this tool to freely modify Design Token to meet your theme expectations." It has the tabs Global and Component, groups Color, Size and Style, seed tokens such as colorPrimary, colorSuccess, colorWarning, colorError, colorLink, colorTextBase, colorBgBase, fontSize, sizeStep, sizeUnit, borderRadius and wireframe, each with Reset, a view of the map tokens derived from each seed, and a "Group View". An export button was not seen in the fetched text; export is not confirmed here. Source: https://ant.design/docs/react/customize-theme/ and https://ant.design/theme-editor/, checked 2026-11-13.
- antd-token-previewer is the package behind such an editor: a `ThemeEditor` React component with a controlled `theme`, `onThemeChange`, a `locale`, header `actions`, an `advanced` mode and a preview area as `children`. Source: https://github.com/ant-design/antd-token-previewer (search excerpt of the README), checked 2026-11-13.

Mantine:
- @mantine/core is at 9.8.0 on npm's latest tag. Source: https://registry.npmjs.org/-/package/@mantine/core/dist-tags, checked 2026-11-13.
- The Mantine colors generator is a page on mantine.dev: enter a base color or pick a preset, get 10 shades, a variants preview, a "Copy URL" link and the code of a `createTheme` with the color. The `@mantine/colors-generator` package generates the shades at runtime. Source: https://mantine.dev/colors-generator/ and https://mantine.dev/theming/colors/, checked 2026-11-13.
- "Mantine Theme Builder" (MantineHub) is announced in a community discussion by a third party, not by Mantine. Source: https://github.com/orgs/mantinedev/discussions/7056 (search excerpt), checked 2026-11-13.

Atlassian Design System:
- @atlaskit/eslint-plugin-design-system is "the essential plugin for use with the Atlassian Design System". Its rules, many with auto-fix or suggestions, fall into groups: token use (ensure-design-token-usage, no-deprecated-design-token-usage, no-unsafe-design-token-usage, use-tokens-motion, use-tokens-shape, use-tokens-space, use-tokens-typography, expand-motion-shorthand); use of the system's components instead of raw HTML (no-html-anchor, no-html-button, no-html-checkbox, no-html-heading, no-html-select, no-html-text-input and others, prefer-primitives, use-heading, use-primitives-text, use-visually-hidden); accessibility of component use (icon-label, no-empty-icon-button-label, use-button-group-label, use-drawer-label, use-popup-label, use-menu-section-title, use-tag-group-label, use-textfield-autocomplete for WCAG 2.2 SC 1.3.5, use-heading-level-in-section-message, no-placeholder); deprecations and migrations (no-deprecated-apis, no-deprecated-imports, lozenge-badge-tag-labelling-system-migration, use-spotlight-package); styling discipline (consistent-css-prop-usage, no-margin, no-physical-properties, no-nested-styles, no-unsafe-style-overrides, no-global-z-index); and layering (no-third-party-layering, no-native-popover-or-dialog, no-third-party-focus-traps). Source: https://atlassian.design/components/eslint-plugin-design-system/usage, checked 2026-11-13.
- The Stylelint plugin @atlaskit/stylelint-design-system has the rule ensure-design-token-usage, which warns when a token is deprecated or missing, or a raw value such as `color: red` or `padding: 8px 16px` is used. Source: https://atlassian.design/components/stylelint-design-system, checked 2026-11-13.
- No in-page tool, browser extension or theme editor for Atlassian was found in the searches of this run; the searched page on tokens in code returned 404. Source: Firecrawl searches and https://atlassian.design/get-started/develop/using-tokens-in-code (404), checked 2026-11-13.

Spectrum (Adobe):
- The Spectrum Design Data site lists web tools: S2 Tokens Viewer (browse and inspect Spectrum 2 token values), S2 Visualizer (an interactive dependency graph of Spectrum 2 tokens with ancestor and descendant relationships, value filters and search), S1 Visualizer (the same for Spectrum 1) and a Release Timeline of token releases. Developer tools include @adobe/token-diff-generator (diffs between token sets: added, deleted, renamed, deprecated, updated), @adobe/spectrum-component-diff-generator (breaking-change reports for component schemas), a token-naming-audit, and two Figma plugins: component-options-editor (authoring component option schemas) and figma-spec-plugin (renders a component spec sheet and its changelog onto the canvas). MCP servers and skills are listed too and are out of scope here. Source: https://opensource.adobe.com/spectrum-design-data/tools/, checked 2026-11-13.
- No in-page devtools or browser extension for React Spectrum or Spectrum Web Components was found in this run. Source: Firecrawl search `Adobe Spectrum tokens visualizer OR "spectrum-tokens" tools React Spectrum developer tools`, checked 2026-11-13.

Polaris (Shopify):
- Polaris React is archived; "On October 1, 2025, we released our Polaris Web Components for Shopify app development." The archived monorepo held polaris-for-vscode ("VS Code extension for Polaris"), polaris-migrator, polaris-tokens and stylelint-polaris ("Rules for custom property usage and mainline coverage"). Source: https://github.com/Shopify/polaris-react-archive (search excerpt of the README), checked 2026-11-13.
- Polaris for VS Code, "Official VS Code extension for building with the Shopify Polaris Design System", is at 0.9.8 on the Visual Studio Marketplace, last updated 2024-04-02. Its feature list was not readable: the README links to a documentation page that now returns 404. Source: https://marketplace.visualstudio.com/items?itemName=Shopify.polaris-for-vscode and https://raw.githubusercontent.com/Shopify/polaris-react-archive/main/polaris-for-vscode/README.md, checked 2026-11-13.
- For the Polaris web components, no devtools was found in this run. Source: Firecrawl search `Polaris web components Shopify 2025 polaris.shopify.com archived developer tools`, checked 2026-11-13.

shadcn/ui:
- The shadcn CLI package is at 4.23.0 on npm's latest tag; the docs describe it as the way to "add components to your project". Source: https://registry.npmjs.org/-/package/shadcn/dist-tags and https://ui.shadcn.com/docs/cli, checked 2026-11-13.
- shadcn/create is a page on the site: "Use shadcn/create to preview colors, radius, fonts, and icons, then generate a preset for your project." Its controls include the component library, style (for example Nova), base color, theme, font, icon library, radius and menu accent, with Shuffle and a `--preset` code that opens the preset. Theming itself is CSS variables, with dark mode as overrides inside a `.dark` selector. Source: https://ui.shadcn.com/docs/theming and https://ui.shadcn.com/create, checked 2026-11-13.
- tweakcn and shadcnstudio are third-party theme editors for shadcn/ui, not shipped by shadcn. Source: https://tweakcn.com/ and https://shadcnstudio.com/theme-generator (search excerpts), checked 2026-11-13.

Vaadin:
- Vaadin Copilot is a toolbar in the running application in development mode; "Vaadin Copilot contains all of the functionality found previously in Development Tools". It can be disabled with `vaadin.copilot.enable=false` or hidden for a session. Its panels: Accessibility Checker (finds common issues such as a missing page title or input label, with fix recommendations); Annotations (comments on views that reference components); App Info; App Log (debug messages with a preview of service requests and responses); Backend & Data; Documentation (docs for the selected component); Features (feature flags); Internationalization (experimental: generates translation keys); Outline (component hierarchy: hover highlights, click selects, drag and drop rearranges); Properties ("Properties editor for selected component"); Theme Editor (changes the style of the selected component, modifies the theme's global properties, and "save your browser inspector changes into application stylesheet"; for the Aura theme, a color-scheme mode Light, Dark, Auto or Mixed, curated accent and background palettes, and shuffle); UI Library (a component palette to drag into the UI); UI Services; UI Test Generation (experimental, Playwright); UI Test Recorder (experimental, TestBench); Views & Routes. Further actions: Go to Source (the IDE opens the line that creates the component), select parent or sibling, copy, paste, duplicate, delete, wrap with a layout, add listener stubs, a toolbar for the selected component (alignment, padding, gap), a Vaadin version update notice, and an AI assistant. An experimental All Components view renders every component with its Default, Variants and States, "testing your global theme" across all components. AI features and license checks need an Internet connection; code manipulation does not work with an offline license. Source: https://vaadin.com/docs/latest/tools/copilot, checked 2026-11-13.

SAP UI5:
- UI5 Inspector is "an open source Chrome DevTools extension specifically created for analyzing and debugging SAPUI5 code". It lists the controls of the current view; selecting one shows its properties and values; a property value can be edited in place, and "The changes that you make in the UI5 Inspector are only temporary"; it also shows which data is bound to a control (model and path). Source: https://help.sap.com/docs/SAPUI5/b2f662dd9d7a4ec680056733050b4d34/76e789ea418a48a1a27916b63a30fb72.html (served as version 1.154), checked 2026-11-13.
- The SAPUI5 Support Assistant "uses a set of predefined rules to check all aspects of an application, for example, accessibility, performance, data binding, usability"; the user selects rules, clicks Analyze and reviews the issues; a library can ship its own rule set. Source: https://help.sap.com/docs/SAPUI5/b2f662dd9d7a4ec680056733050b4d34/57ccd7d7103640e3a187ed55e1d2c163.html (search excerpt) and https://ui5.github.io/docs/ (search excerpt), checked 2026-11-13.

Primer (GitHub):
- eslint-plugin-primer-react is "ESLint rules for Primer React", with a recommended config; @primer/stylelint-config is the shared Stylelint config "used by GitHub's CSS". The rule list was not readable in the fetch. Source: https://github.com/primer/eslint-plugin-primer-react and https://github.com/primer/stylelint-config, checked 2026-11-13.

Salesforce Lightning Design System (SLDS):
- SLDS Validator is a VS Code extension (marked Preview, version 2.0.12 in its icon path, about 2.04 million installs) that "scans your UI code, validates it against a database of guidelines, and provides recommendations"; it gives validation with recommended tokens and utility classes, syntax highlighting, code completion, context awareness and bulk report generation, for SLDS and SLDS 2. It needs Java. Source: https://marketplace.visualstudio.com/items?itemName=salesforce.salesforce-vscode-slds, checked 2026-11-13.
- SLDS Linter (`npx @salesforce-ux/slds-linter@latest lint`) runs in any terminal, checks SLDS 2, analyzes code in bulk and "applies fixes in bulk", for Lightning components and React applications; the Validator does not apply fixes in bulk. Source: https://github.com/salesforce-ux/slds-linter and https://www.lightningdesignsystem.com/2e1ef8501/p/012d73 (search excerpts), checked 2026-11-13.

Web Awesome (formerly Shoelace; Lit web components):
- The Theme Builder "is a visual editor for Pro workspace projects that lets you customize your project's theme, color palette, variant colors, fonts, roundness, spacing, and icons — with a live preview as you go. Saves apply instantly anywhere you're using your project." The docs load Web Awesome 3.14.0 from its CDN. Source: https://webawesome.com/docs/customizing/ and https://webawesome.com/, checked 2026-11-13.

PrimeVue and PrimeNG (PrimeTek):
- The Theme Designer is a web tool with "a visual editor, Figma to theme code, cloud storage, and migration assistant". The visual editor edits "the complete set of tokens": primitive and semantic sections, and component tokens per component page; color fields show a preview; a value starting with a curly brace autocompletes token references. Themes can be created, renamed, duplicated and downloaded. The migration assistant ("Check for Updates") scans a theme for tokens missing in a newer library version and adds them with placeholder values, highlighted in the editor. Figma input comes from a tokens JSON export or a CI pipeline. A paid one-year license key unlocks downloads and cloud storage; without it the editor is a trial. Source: https://primevue.dev/designer/guide/, checked 2026-11-13.

TanStack Devtools: its tools and plugins, beyond the facts already in RES-031 (main branch of TanStack/devtools, read 2026-11-13):
- The packages folder now also holds devtools-client, devtools-rspack and devtools-webmcp, beside the packages RES-031 lists. Source: https://api.github.com/repos/TanStack/devtools/contents/packages, checked 2026-11-13.
- Shell settings for the user: defaultOpen, hideUntilHover, position, triggerMode (a floating trigger that can be dragged, thrown, docked as a slim tab at a screen edge, with its spot kept in local storage; or fixed), panelLocation (top or bottom), openHotkey, inspectHotkey, requireUrlFlag with urlFlag (devtools only when a URL flag is present), hideInAutomation (no devtools under Playwright, Cypress or Selenium, via navigator.webdriver), openAsModal (the panel above an app's modal dialog), triggerImage. Source: https://raw.githubusercontent.com/TanStack/devtools/main/docs/configuration.md, checked 2026-11-13.
- Plugin workspace: open plugins are arranged as panes side by side, stacked, or grouped as tabs, by dragging tabs; panes resize; a too-small split becomes a stacked tab; a detached picture-in-picture window exists; the arrangement, the selected tabs and pane sizes persist in localStorage. Source: https://raw.githubusercontent.com/TanStack/devtools/main/docs/plugin-workspace.md, checked 2026-11-13.
- Vite plugin features (@tanstack/devtools-vite): Go to Source (an AST transform adds `data-tsd-source` attributes; holding the inspect hotkey, default Shift+Alt+Ctrl/Meta, shows an overlay with the source location of the element under the cursor, and a click opens the file at that line in the editor through launch-editor, with an `editor` hook for other editors); Console Piping (browser logs in the terminal and server logs in the browser console, per level); Enhanced Logs (each console log shows a clickable source location); Production Build Stripping; Server Event Bus (WebSocket and SSE); Plugin Marketplace (browse plugins in the Settings tab and click Install: the Vite plugin runs npm, pnpm or yarn and injects the import into the devtools setup file); Connection Injection. Source: https://raw.githubusercontent.com/TanStack/devtools/main/docs/vite-plugin.md and https://raw.githubusercontent.com/TanStack/devtools/main/docs/source-inspector.md, checked 2026-11-13.
- The marketplace registry is a file in the repository that plugin authors extend by pull request, with a title, description, logo, required package and version range, import name, docs and repository links, framework, tags, and Featured and New flags. Source: https://raw.githubusercontent.com/TanStack/devtools/main/docs/third-party-plugins.md and https://raw.githubusercontent.com/TanStack/devtools/main/packages/devtools/src/tabs/plugin-registry.ts, checked 2026-11-13.
- The registry lists these plugins: TanStack Query Devtools (React, Solid: "inspect queries, mutations, and cache"); TanStack Router Devtools (React, Solid: "Inspect routes, navigation, and router state in real-time"); TanStack Form Devtools (React, Solid: "Debug form state, validation, and field values"); Pacer Devtools (React, Solid: "Monitor and debug your Pacer animations and transitions"); Accessibility Devtools (@tanstack/devtools-a11y: "Audit accessibility issues in real-time with axe-core. Supports WCAG 2.1/2.2, live monitoring, and visual overlays"); TanStack AI Devtools (React: "inspect messages, token usage, streaming chunks, tool calls, and reasoning"); and two third-party plugins, Prefetch Heatmap ("Visualize TanStack Router prefetch intent, hits, and waste with a color overlay and a live metrics panel") and Inertia 3 Devtools. TanStack Table's devtools (RES-031) are not in the registry. Source: https://raw.githubusercontent.com/TanStack/devtools/main/packages/devtools/src/tabs/plugin-registry.ts, checked 2026-11-13.
- The Query devtools filter queries and mutations by key, by data or by both (the scope is remembered across reloads), search nested data in a Data Explorer, and let the user edit query data. Source: https://tanstack.com/query/latest/docs/framework/react/devtools, checked 2026-11-13.
- The Router devtools "help visualize all of the inner workings of TanStack Router"; they run in a floating mode (a toggle whose state is kept in localStorage) or embedded as a panel, and accept a `shadowDOMTarget` so their styles apply inside a shadow root. Source: https://tanstack.com/router/latest/docs/framework/react/devtools, checked 2026-11-13.
- The WebMCP tools package gives an agent in the browser a way to read a library's internals during development; MCP is out of scope for this record. Source: https://raw.githubusercontent.com/TanStack/devtools/main/docs/webmcp-tools.md, checked 2026-11-13.
- The docs URL that the registry gives for the Form devtools (https://tanstack.com/form/latest/docs/devtools) returned 404. Source: that URL, checked 2026-11-13.

Ionic:
- The Ionic docs hold a Color Generator ("Create custom color palettes for your app's UI": for each named color, the base, shade, tint and contrast values as CSS custom properties to copy) and a Stepped Color Generator (background and text color steps, "copy and paste the generated code directly into your Ionic project"). Source: https://ionicframework.com/docs/theming/color-generator and https://ionicframework.com/docs/theming/themes (search excerpts), checked 2026-11-13.

Elastic UI (EUI):
- @elastic/eslint-plugin-eui "enforces some default rules for using EUI"; an issue reports missing runtime dependencies that stop consumers from running it. Source: https://classic.yarnpkg.com/en/package/@elastic/eslint-plugin-eui and https://github.com/elastic/eui/issues/9780 (search excerpts), checked 2026-11-13.

## Follow-ups
- The Figma tools of the systems marked "not checked" in the table, if IDEA-006#10 needs the Figma kind.

## Next action
None.
