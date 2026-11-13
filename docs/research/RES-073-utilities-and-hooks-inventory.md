---
id: RES-073
status: resolved # in-progress | resolved
kind: research
from: IDEA-001#12 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-13
outcome: answered
---
# RES-073: Utility functions and hooks of the five reference systems

## Question
Which utility functions and hooks do shadcn/ui, Radix Primitives, Radix Themes, Chakra UI and Geist export, what does each system call them, what does each one do, and where do the systems disagree?

Context: the components of the five systems are in RES-032 to RES-036, and RES-037 joins them into 182 concepts. This record is the same inventory for everything that is not a component of RES-037.

## Answer
Sufficient answer:

1. For each system, at its named current version: the complete list of its public exports that are not components of RES-037 (hooks, utility functions, providers and contexts, helper components). For each export: name, kind, what it does in one line, and source.
2. The source of completeness for each system (export file or docs index). shadcn/ui: the `lib` and `hooks` registry items. Radix Primitives: the documented utilities, and which helper packages are public and documented and which are internal. Chakra UI: hooks, utility functions, and the per-component hooks as one group with its full list.
3. One table that joins the exports into concepts: concept, name in each system, disagreements in name or behaviour.
4. Counts: exports per system, concepts in total, concepts in one system only.

The record gives facts, sources and disagreements only. It gives no recommendation.

Answered. All five systems are inventoried below. The exports per system, with their one-line purposes and sources, are in Findings. This section gives the versions, the sources of completeness, the joined table and the counts.

### Versions and sources of completeness
| System | Version | Checked against | Access |
|---|---|---|---|
| shadcn/ui | shadcn CLI 4.23.0; `@shadcn/react` 0.3.1; `@shadcn/helpers` 0.3.0; repo commit e62c943 | The registry groups `lib` and `hooks` of the three bases (`apps/v4/registry/bases/*/{lib,hooks}/_registry.ts`), the `export { }` block of every `ui` registry file, the `exports` field of `@shadcn/react` and `@shadcn/helpers`, and the docs sections "Utilities", "@shadcn/react" and "@shadcn/helpers" (`meta.json`). The public `/r/index.json` lists only `ui` items. | 2026-11-13 |
| Radix Primitives | `radix-ui` 1.8.1; repo commit eb3a2b7 | The `src/index.ts` of `radix-ui` and `radix-ui/internal`, the `src/index.ts` of every package in `packages/react` and `packages/core`, their READMEs (which mark 25 packages internal), and the docs sidebar (5 Utilities). | 2026-11-13 |
| Radix Themes | `@radix-ui/themes` 3.3.0 (npm latest); repo commit 1faff10 | The `exports` field of the npm package, `src/components/index.tsx`, `src/helpers/index.ts`, `src/props/index.ts`, and the docs sidebar (6 Utilities, no hooks). | 2026-11-13 |
| Chakra UI | `@chakra-ui/react` 3.38.0, `@chakra-ui/charts` 3.38.0; repo commit 4d3fda5 | The `exports` field of `@chakra-ui/react`, `src/index.ts` and what it re-exports (`hooks`, `collection`, `styled-system`), the `index.ts(x)` of all 118 component folders, `@chakra-ui/charts` `src/index.ts`, the snippet files in `apps/compositions/src/ui`, and the docs index `llms.txt` (no hooks set). | 2026-11-13 |
| Geist | unversioned | The import lines of the code samples in the HTML of 82 pages (75 component pages and 7 others). Geist has no public package or export file. | 2026-11-13 |

Status of helper packages in Radix Primitives:
- Public and documented: `react-accessible-icon`, `react-direction` (Provider only; `useDirection` is exported but not documented), `react-portal`, `react-slot` (`Slot.Root`, `Slottable`, `createSlot`), `react-visually-hidden` (component only; `VISUALLY_HIDDEN_STYLES` is not documented).
- Public, not documented: the 24 `create<Name>Scope` functions, `createSlottable`, `VISUALLY_HIDDEN_STYLES`, the `unstable_` part exports.
- Internal by README ("not intended for public usage"), but reachable through `radix-ui/internal`: arrow, collection, compose-refs, context, dismissable-layer, focus-guards, focus-scope, menu, popper, presence, primitive, roving-focus, use-callback-ref, use-controllable-state, use-effect-event, use-escape-keydown, use-is-hydrated, use-layout-effect, use-size, and `composeEventHandlers` from core `primitive`.
- Internal and not re-exported by `radix-ui`: use-previous, use-rect, core number, core rect, core env-check, the rest of core primitive; and `react-id` and `react-announce`, whose READMEs link to docs pages that do not exist (404) or are not in the sidebar.

### Joined table
Kinds: H hook, F function or constant, P provider or context, C helper component, S CSS class. "int." means internal (Radix: by README; reachable through `radix-ui/internal` unless noted). "snip." means a Chakra snippet that the consumer copies. "—" means no export.

| # | Concept | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist | Disagreement |
|---|---|---|---|---|---|---|---|
| 1 | Class-name merge | `cn` F | — | — | — (`cx` is internal, not exported) | `cn` F | shadcn takes `cn` from the npm package `cn` (twMerge plus clsx replacement); Geist's `cn` comes from a private package. |
| 2 | Variant style function | `buttonVariants`, `badgeVariants`, `buttonGroupVariants`, `toggleVariants`, `tabsListVariants`, `markerVariants`, `navigationMenuTriggerStyle` F | — | — | `useRecipe`, `useSlotRecipe` H | `badgeVariants` F | shadcn and Geist export one class-name function per component, named `<x>Variants`. Chakra exposes recipes through hooks that need the system context and return style objects. |
| 3 | Recipe context factory | — | — | — | `createRecipeContext`, `createSlotRecipeContext` F | — | |
| 4 | Style hook per component | — | — | — | `use<Name>Styles` H ×59 | — | |
| 5 | Element factory | — | `Primitive` (int.) | — | `chakra` F | — | Radix's `Primitive.<tag>` adds only `asChild`; Chakra's `chakra()` adds style props and recipes. |
| 6 | Slot factory | — | `createSlot`, `createSlottable` F | — | — | — | Radix documents `createSlot` for typed slots; `createSlottable` is undocumented. |
| 7 | Merge props | — (`mergeProps` in `@shadcn/react` is not exported) | — | — | `mergeProps` F | — | |
| 8 | Compose refs | — (`composeRefs` in `@shadcn/react` is not exported) | `composeRefs`, `useComposedRefs` (int.) | — | `mergeRefs` F | — | Names differ: compose versus merge. Public in Chakra, internal in Radix. |
| 9 | Compose event handlers | — | `composeEventHandlers` (int.) | — | — (`callAll` is internal) | — | |
| 10 | Context factory | — | `createContext`, `createContextScope` (int.); `create<Name>Scope` ×24 F | — | `createContext` F | — | Radix scopes contexts so the same primitive can nest; Chakra's creates one context with a hook and a named error. |
| 11 | Controllable state | — | `useControllableState`, `useControllableStateReducer` (int.) | — | `useControllableState`, `useControllableProp` H | — | Same name. Public in Chakra, internal in Radix. |
| 12 | Stable callback | — | `useCallbackRef`, `useEffectEvent` (int.) | — | `useCallbackRef` H | — | Same name. Chakra calls its hook a user-land `useEffectEvent`; Radix has both. |
| 13 | Previous value | — | `usePrevious` (int., not re-exported) | — | `usePrevious` H | — | |
| 14 | Server-safe layout effect | — | `useLayoutEffect` (int.) | — | `useSafeLayoutEffect` H | — | Radix shadows React's name; Chakra adds `Safe`. |
| 15 | Element measurement | — | `useSize` (int.); `useRect`, `observeElementRect` (int., not re-exported) | — | `useElementRect` H | — | |
| 16 | Escape key | — | `useEscapeKeydown` (int.) | — | — | — | |
| 17 | Hotkeys | — | — | — | `useHotkeys`, `useHotkeyStore`, `useFormatHotkey` H | — | |
| 18 | Hydration state | — | `useIsHydrated` (int.) | — | — | — | |
| 19 | ID hook | — | `useId` (int., not re-exported) | — | — | — | |
| 20 | Media query | `useIsMobile` H | — | — | `useMediaQuery` H | — | shadcn's hook answers one fixed query (narrower than 768 px); Chakra's takes any queries. |
| 21 | Breakpoint value | — | — | — | `useBreakpoint`, `useBreakpointValue` H | — | |
| 22 | Responsive prop helpers | — | — | `getResponsiveStyles`, `getResponsiveCustomProperties`, `getResponsiveClassNames`, `isResponsiveObject`, `mapResponsiveProp` F | — | — | |
| 23 | Prop definitions and extraction | — | — | `/props` (21 base definitions and the definitions of 50 component prop files), `extractProps`, `extractMarginProps`, `getMarginStyles`, `mergeStyles`, `mapCalloutSizeToTextSize`, `mapButtonSizeToSpinnerSize` F | — | — | |
| 24 | System configuration | — | — | — | `defineConfig`, `mergeConfigs`, 11 other `define*`, `createSystem`, `isValidSystem`, `defaultConfig`, `defaultSystem`, `defaultBaseConfig` F | — | |
| 25 | Token lookup | — | — | — | `useToken` H | — | |
| 26 | Theme or system context | — | — | `ThemeContext` P, `useThemeContext` H | `ChakraProvider` P, `useChakraContext` H | — | Radix Themes returns the theme settings (appearance, accent, gray, radius, scaling) and a setter for each. Chakra returns the styling system object. |
| 27 | Color mode | — (docs: write a `ThemeProvider` over `next-themes`) | — | — (docs: use `next-themes`) | `useColorMode`, `useColorModeValue`, `ColorModeProvider` (snip.) | — (the Theme Switcher component only) | Three systems leave color mode to `next-themes`; Chakra's snippet also wraps `next-themes`. |
| 28 | Matching gray color | — | — | `getMatchingGrayColor` F | — | — | |
| 29 | Direction and locale | `useDirection` H; `useLocale` H and `I18nProvider` P in the aria base only | `useDirection` H (undocumented) | — | `useLocaleContext` H | — | shadcn's `useDirection` comes from a different library in each base (Base UI, Radix, React Aria). Chakra reads direction from its locale context. |
| 30 | Environment context | — | — | — | `useEnvironmentContext` H | — | |
| 31 | Toast trigger | `toast`, `createToastManager` F, `useToastManager` H (base `base` only; the `sonner` item uses the third-party `toast`) | — | — | `createToaster` F; `toaster` (snip.) | `useToasts` H | Chakra and shadcn create a store at module level; Geist uses a hook. Geist's methods are `message`, `success`, `warning`, `error`. |
| 32 | Imperative overlay | — | — | — | `createOverlay` F | — | |
| 33 | Disclosure | — | — | — | `useDisclosure` H | — | |
| 34 | State hook per component (outside the tree) | — | — | — | `use<Name>` H ×44 | — | |
| 35 | Context hook per component (inside the tree) | `useSidebar`, `useCarousel`, `useMessageScroller`, `useMessageScrollerScrollable`, `useMessageScrollerVisibility` H | — | — | `use<Name>Context`, `use<Name>ItemContext` H ×60 | — | shadcn's `useCarousel` reads the carousel context; Chakra's `useCarousel` creates carousel state and `useCarouselContext` reads it. Same name, different behaviour. |
| 36 | Radio item hook | — | — | — | — | `useRadio` H | Returns `{ component }`; no other system has a hook that returns a component. |
| 37 | Data collections | — | — | — | `createListCollection`, `createGridCollection`, `createTreeCollection`, `createFileTreeCollection` F, `useListCollection`, `useCommandCollection` H | — | |
| 38 | DOM item collection | — | `createCollection` (int.) | — | — | — | Tracks rendered items in order; different purpose from row 37. |
| 39 | Async list | — | — | — | `useAsyncList` H | — | |
| 40 | Constant value | — | — | — | `useConst` H | — | |
| 41 | Force update | — | — | — | `useForceUpdate` H | — | |
| 42 | Live ref | — | — | — | `useLiveRef` H | — | |
| 43 | Update effect | — | — | — | `useUpdateEffect` H | — | |
| 44 | Code highlighting | `useHighlightedCode` H, `loadHighlighter`, `highlightCode` F | — | — | `createShikiAdapter`, `createHighlightJsAdapter`, `plainTextAdapter` F, `CodeBlockAdapterProvider` P | — | shadcn ships a Shiki loader for 13 languages; Chakra takes an adapter for Shiki, highlight.js or plain text. |
| 45 | Icon factory | — | — | — | `createIcon` F | — | |
| 46 | Color parsing | — | — | — | `parseColor`, `getColorChannels` F | — | |
| 47 | Date parsing | — | — | — | `parseDate` F | — | |
| 48 | Date range URL encoding | — | — | — | — | `encodeDateRangeValue`, `decodeDateRangeValue` F | |
| 49 | Text filter | — | — | — | `useFilter` H | — | |
| 50 | Text match highlight | — | — | — | `useHighlight` H | `makeJsonViewHighlightPattern` F | Chakra splits text into chunks; Geist builds a pattern for the JSON View prop. |
| 51 | Download | — | — | — | `useDownload` H | — | |
| 52 | URL search-param state | — | — | — | — | `useSearchParamState` H | |
| 53 | Address helpers | — | — | — | — | `getAddressErrors`, `createGoogleAddressProvider` F | |
| 54 | Visually hidden style | — | `VISUALLY_HIDDEN_STYLES` F | — | `visuallyHiddenStyle` F | — | Constant case versus camel case. |
| 55 | Combobox anchor ref | `useComboboxAnchor` H | — | — | — | — | |
| 56 | Chart data | — | — | — | `useChart` H (`@chakra-ui/charts`) | — | shadcn exports only the type `ChartConfig`. |
| 57 | Splitter layout | — | — | — | `createSplitterRegistry`, `getSplitterLayout` F | — | |
| 58 | DOM environment helpers | — | `getOwnerWindow`, `getOwnerDocument`, `getActiveElement`, `isFrame`, `canUseDOM` (int., not re-exported) | — | — | — | |
| 59 | Hide other content | — | `hideOthers`, `inertOthers`, `supportsInert`, `suppressOthers` (int., not re-exported) | — | — | — | |
| 60 | Clamp | — | `clamp` (int., not re-exported) | — | — | — | |
| 61 | Dismissable layer | — | `DismissableLayer` (int.) | — | — | — | |
| 62 | Focus trap | — | `FocusScope` (int.) | — | `FocusTrap` C (no docs page) | — | |
| 63 | Focus guards | — | `FocusGuards` (int.) | — | — | — | |
| 64 | Roving focus | — | `RovingFocus` (int.) | — | — | — | |
| 65 | Floating positioning | — | `Popper` (int.) | — | — | — | |
| 66 | Live announcer | — | `Announce` (int., not re-exported) | — | — | — | |
| 67 | Mock AI chat stream | `createChat` F (`@shadcn/helpers`) | — | — | — | — | |
| 68 | Scroll fade | `scroll-fade` S | — | — | — | — | |
| 69 | Text shimmer | `shimmer` S | — | — | — | — | |
| 70 | Theme panel | — | — | `ThemePanel`, `unstable_ThemePanelContent` C | — | — | |
| 71 | Package icons | — | — | `ChevronDownIcon`, `ThickCheckIcon`, `ThickChevronRightIcon`, `ThickDividerHorizontalIcon` C | — | — | Geist's icons come from a separate assets package (a catalog, RES-036). |
| 72 | Button as link | — | — | — | — | `ButtonLink` C | |
| 73 | Field message text | — | — | — | — | `ErrorText`, `WarningText` C | |
| 74 | Disabled wall | — | — | — | — | `DisabledWall` C | |
| 75 | Secret value | — | — | — | — | `SecretValue` C | |
| 76 | Shape boxes | — | — | — | `Circle`, `Square` C | — | |
| 77 | Spacer | — | — | — | `Spacer` C | — | |
| 78 | Span | — | — | — | `Span` C | — | |
| 79 | Sticky | — | — | — | `Sticky` C | — | |
| 80 | Loader | — | — | — | `Loader`, `LoaderOverlay` C | — | |

Exports that join a component concept of RES-037 instead of a new row: Radix's internal `Presence`, `Menu` and `Arrow`; the `Slottable` of Radix Primitives and Radix Themes (Slot); shadcn's `I18nProvider` (Locale Provider); Chakra's `Toggle` (RES-037 Toggle has no Chakra entry); Chakra's `InputAddon` and `InputElement` (Input Group parts); Geist's `Link` (RES-037 Link). Chakra also exports 173 part components per compound component (73 `PropsProvider`, 43 `RootProvider`, 57 `Context` render props); they are counted, not joined.

### Counts
- shadcn/ui: 27 exports (24 functions and hooks, 1 provider, 2 CSS utilities). Types and the docs-only `ThemeProvider` pattern are not counted.
- Radix Primitives: 65 exports. 28 public (`useDirection`, `createSlot`, `createSlottable`, `VISUALLY_HIDDEN_STYLES`, 24 `create<Name>Scope`); 22 internal through `radix-ui/internal`; 15 internal in packages that `radix-ui` does not re-export.
- Radix Themes: at least 95 exports. 9 from the root, 15 helper functions, 21 base prop definitions, and at least 50 component prop definitions.
- Chakra UI: 248 package exports (20 general hooks, 10 root utilities, 27 styling system, 179 per-component, 1 chart hook, 11 helper components) and 13 snippet exports. The 173 part components are extra.
- Geist: 16 names found in code samples (10 hooks and functions, 6 helper components).
- Concepts in the table: 80. In three systems: 3 (rows 2, 29, 31). In two systems: 16. In one system only: 61.

### Disagreements across the table
- Public versus internal. Most general React hooks (controllable state, stable callback, refs, previous value, layout effect, measurement) are public in Chakra and internal in Radix Primitives. Radix documents none of them and marks them "not intended for public usage", but ships them through `radix-ui/internal`.
- One name, two behaviours. `useCarousel` reads context in shadcn/ui and creates state in Chakra. `useDirection` comes from three different libraries in the three shadcn bases.
- Delivery. shadcn/ui copies hooks into the project as registry files, except `cn` (npm package `cn`) and the `@shadcn/react` hooks. Chakra delivers most hooks in its package, but color mode and the toaster instance as copied snippets. Geist's hooks come from a package that is not public.
- Theming. Radix Themes, shadcn/ui and Chakra's snippet all lean on `next-themes` for color mode. Only Radix Themes exports a hook for its theme settings.
- Toast API shape. A hook in Geist (`useToasts`), a store factory in Chakra (`createToaster`) and in shadcn's `base` base (`createToastManager` plus a ready `toast`).

UNVERIFIED or not confirmed:
- Geist: the list holds only names that appear in code samples. Exports that no sample imports cannot be seen. Completeness is not confirmable.
- Radix internal helpers and four Chakra helper components (`Span`, `Sticky`, `InputAddon`, `InputElement`): purposes come from names and code, not from documentation.
- Chakra snippets: only names that start in lower case, plus `ColorModeProvider`, were collected. Snippet components are out of scope.
- Radix Themes prop definitions: the 50 component prop files were counted as files; a file can export more than one definition.
- The version gap for Radix Themes: RES-034 named 3.1.3 from the docs; npm and the repository say 3.3.0. The repository's last commit is 2026-04-11.

## Findings

Capability check, 2026-11-13: loaded brain:source-driven-development. Web tool: Firecrawl scrape of https://ui.shadcn.com/r/index.json answered with the registry JSON (65 items, all `registry:ui`). Source was read from shallow clones of the GitHub repositories, with `git show` at the named commit. brain sdd-cache lookup was not used.

### shadcn/ui

Version: shadcn CLI 4.23.0, repository github.com/shadcn-ui/ui at commit e62c9435fff729a175f38983dee73b2cb4f6a069 (2026-11-13). Packages in the repository: `@shadcn/react` 0.3.1, `@shadcn/helpers` 0.3.0, `@shadcn/registry` 0.2.1. Abbreviation below: `B` = `apps/v4/registry/bases/<base>` at that commit, for the bases `base`, `radix` and `aria`.

- The public registry index `/r/index.json` lists only `registry:ui` items (65). It lists no `lib` or `hook` item. Source: https://ui.shadcn.com/r/index.json, checked 2026-11-13.
- The `hooks` registry group has two items in each base: `use-mobile` and `use-highlighted-code` (with the file `lib/highlighter.tsx` and the dependency `shiki`). The legacy style `new-york-v4` has only `use-mobile`. The three bases have identical hook and lib registries. Source: `B/hooks/_registry.ts`, `apps/v4/registry/new-york-v4/hooks/_registry.ts`, checked 2026-11-13.
- The `lib` registry group has one item, `utils`, with the dependency `cn`. Its file is the single line `export { cn } from "cn"`. Source: `B/lib/_registry.ts`, `B/lib/utils.ts`, checked 2026-11-13.
- Since September 2026, `cn` comes from the npm package `cn` (github.com/shadcn-ui/cn), "a drop-in replacement for `twMerge(clsx(...))`". The `utils` item "still exists" and re-exports `cn`. `npx shadcn migrate cn` moves older projects over. Source: `apps/v4/content/docs/changelog/2026-09-cn.mdx`; `apps/v4/package.json` (`"cn": "^0.2.2"`), checked 2026-11-13.
- `useIsMobile()` returns true when the window is narrower than 768 px; it listens to a `matchMedia` query. Source: `B/hooks/use-mobile.ts`, checked 2026-11-13.
- `useHighlightedCode(value, language)` returns one React node per line, highlighted with Shiki; while code streams, it tokenizes only new lines. `lib/highlighter.tsx` exports `loadHighlighter(language)` (loads a Shiki highlighter for one of 13 languages) and `highlightCode(code, language)` (async, returns lines or null). Source: `B/hooks/use-highlighted-code.ts`, `B/lib/highlighter.tsx`, checked 2026-11-13.
- Non-component exports of the `ui` registry files, the same in all three bases unless marked: `badgeVariants`, `buttonVariants`, `buttonGroupVariants`, `toggleVariants`, `tabsListVariants`, `markerVariants` (class-name functions per variant), `navigationMenuTriggerStyle` (base and radix only); `useCarousel` and type `CarouselApi`; `useComboboxAnchor` (returns a ref for the anchor element); `useDirection`; `useSidebar`; `useMessageScroller`, `useMessageScrollerScrollable`, `useMessageScrollerVisibility`; type `ChartConfig`. The base `base` adds `toast`, `createToastManager`, `useToastManager` (from Base UI's toast manager). The base `aria` adds `useLocale` and `I18nProvider` (re-exported from react-aria-components). Source: `export { ... }` blocks of the files in `B/ui/`, checked 2026-11-13.
- `useDirection` differs by base: `base` re-exports it from `@base-ui/react/direction-provider`; `radix` takes it from `radix-ui`'s `Direction`; `aria` derives it from `useLocale()`. Source: `B/ui/direction.tsx` for the three bases, checked 2026-11-13.
- `useSidebar()` reads the sidebar context (state, open, setOpen, openMobile, isMobile, toggleSidebar). The sidebar stores its state in a cookie and toggles on the key `b` with Cmd or Ctrl. Source: `B/ui/sidebar.tsx`, checked 2026-11-13.
- `@shadcn/react` publishes only the subpaths `./message-scroller` and `./questionnaire`. `message-scroller` exports the hooks `useMessageScroller` (returns `scrollToEnd`, `scrollToMessage`, `scrollToStart`), `useMessageScrollerScrollable` (scroll state from a store) and `useMessageScrollerVisibility`. `questionnaire` exports no hook. The file `use-render/index.ts` (`useRender`, `mergeProps`, `composeRefs`) is not in the package's `exports`, so it is internal. Source: `packages/react/package.json`, `packages/react/src/*/index.ts`, `packages/react/src/message-scroller/components.tsx:45-80`, checked 2026-11-13. Docs section "@shadcn/react" holds the pages message-scroller and questionnaire. Source: `apps/v4/content/docs/react/meta.json`, checked 2026-11-13.
- `@shadcn/helpers` ("A collection of helpers for building AI applications") publishes `./ai-sdk` and `./tanstack-ai`; each exports `createChat`, a builder that scripts a mock chat stream (`.user()`, `.assistant()`, `.sleep()`, tool calls). Source: `packages/helpers/package.json`, `packages/helpers/src/ai-sdk/index.ts`, `packages/helpers/src/tanstack-ai/index.ts`, `packages/helpers/README.md`; docs section `apps/v4/content/docs/helpers/meta.json`, checked 2026-11-13.
- The docs section "Utilities" has two pages, `scroll-fade` and `shimmer`. Both are CSS utility classes in `shadcn/tailwind.css`, not functions. `scroll-fade` masks the edges of a scroll container according to scroll position (`scroll-fade`, `-x`, `-y`, `-t`, `-b`, `-l`, `-r`, `-s`, `-e`, sizes, `-none`). `shimmer` sweeps a highlight across text (`shimmer`, `-once`, `-reverse`, `-none`, `-color-*`, `-duration-*`, `-spread-*`, `-angle-*`). Source: `apps/v4/content/docs/utils/meta.json`, `scroll-fade.mdx`, `shimmer.mdx`, checked 2026-11-13.
- The dark-mode docs have the consumer write a `ThemeProvider` component that wraps `next-themes`; shadcn/ui exports no theme provider or theme hook. Source: `apps/v4/content/docs/dark-mode/next.mdx:8-45`, checked 2026-11-13.
- The `sonner` item exports only `Toaster`; the `toast()` function there comes from the third-party `sonner` package. Source: `B/ui/sonner.tsx` (radix and base), checked 2026-11-13.

### Radix Primitives

Version: unified package `radix-ui` 1.8.1, repository github.com/radix-ui/primitives at commit eb3a2b7091293e27df8f9ba906632d8daa3d81a3 (2026-10-14). Abbreviation below: `P` = `packages/react` at that commit.

- The docs sidebar has five Utilities: Accessible Icon, Direction Provider, Portal, Slot, Visually Hidden. All five are concepts of RES-037. The docs list no hook and no helper function in the sidebar. Source: https://www.radix-ui.com/primitives/docs/overview/introduction (links), checked 2026-11-13.
- The Direction Provider page documents only `Direction.Provider` with the prop `dir`. It does not document the hook `useDirection`, although the package exports it. Source: https://www.radix-ui.com/primitives/docs/utilities/direction-provider; `P/direction/src/index.ts`, checked 2026-11-13.
- The Slot page documents `Slot.Root`, `Slot.Slottable` (with a `child` prop and a render function) and the function `Slot.createSlot` ("returns a `Slot` component scoped to the name you pass", with type arguments). The package also exports `createSlottable`. Event handlers merge so that the child handler runs first. Source: https://www.radix-ui.com/primitives/docs/utilities/slot#typed-slots; `P/slot/src/index.ts`, checked 2026-11-13.
- The root of `radix-ui` exports only component namespaces (35, two of them `unstable_`). Its `package.json` maps `./*` to `src/*.ts`, so the file `internal.ts` is reachable as `radix-ui/internal`. Source: `P/radix-ui/src/index.ts`, `P/radix-ui/package.json` (`exports`), checked 2026-11-13.
- `radix-ui/internal` exports: namespaces `Arrow`, `Collection`, `Context`, `DismissableLayer`, `FocusGuards`, `FocusScope`, `Menu`, `Popper`, `Presence`, `RovingFocus`, `Primitive` (with `Primitive.dispatchDiscreteCustomEvent`); functions `composeRefs`, `composeEventHandlers`; hooks `useComposedRefs`, `useCallbackRef`, `useControllableState`, `useControllableStateReducer`, `useEffectEvent`, `useEscapeKeydown`, `useIsHydrated`, `useLayoutEffect`, `useSize`. Source: `P/radix-ui/src/internal.ts`, checked 2026-11-13.
- The README of each of these helper packages says "This is an internal utility, not intended for public usage": arrow, collection, compose-refs, context, dismissable-layer, focus-guards, focus-scope, menu, popper, presence, primitive, roving-focus, use-callback-ref, use-controllable-state, use-effect-event, use-escape-keydown, use-is-hydrated, use-layout-effect, use-previous, use-rect, use-size, and in `packages/core` number, rect, primitive, env-check. Source: `P/<name>/README.md` and `packages/core/<name>/README.md` at the commit above, checked 2026-11-13.
- The READMEs of `react-id` and `react-announce` point to docs pages (`/primitives/docs/utilities/id-provider`, `/utilities/announce`), but the id-provider page answers 404 and neither page is in the sidebar. `react-id` exports `useId`; `react-announce` exports `Announce`. Neither is re-exported by `radix-ui`. Source: `P/id/README.md`, `P/announce/README.md`, `P/id/src/index.ts`, `P/announce/src/index.ts`; https://www.radix-ui.com/primitives/docs/utilities/id-provider (HTTP 404), checked 2026-11-13.
- What the internal helpers do, read from their code (no documentation exists): `composeRefs`/`useComposedRefs` join several refs into one; `composeEventHandlers` runs the user handler, then the internal one unless `defaultPrevented`; `createContext`/`createContextScope` (namespace `Context`) create React contexts that can be scoped for nested primitives; `createCollection` tracks ordered items; `useControllableState` supports the controlled and uncontrolled pattern (`prop`, `defaultProp`, `onChange`); `useCallbackRef` keeps a stable callback; `useEscapeKeydown` listens for Escape; `useSize` measures an element; `useIsHydrated` reports hydration; `useLayoutEffect` is an SSR-safe layout effect; `useEffectEvent` is a polyfill of React's effect event; `usePrevious` keeps the previous value; `useRect` observes an element's rectangle; `Presence` keeps an element mounted during its exit animation; `DismissableLayer` handles outside click and Escape; `FocusScope` traps and loops focus; `FocusGuards` adds focus sentinels; `RovingFocus` manages arrow-key focus in a group; `Popper` positions floating content. Core `primitive` also exports `getOwnerWindow`, `getOwnerDocument`, `getActiveElement`, `isFrame`, `canUseDOM`, `hideOthers`, `inertOthers`, `supportsInert`, `suppressOthers`; core `number` exports `clamp`; core `rect` exports `observeElementRect`. Source: `src/index.ts` of each package at the commit above, `packages/core/primitive/src/primitive.tsx`, `aria-hidden.ts`, `can-use-dom.ts`, checked 2026-11-13.
- Each public primitive also exports a scope creator, `create<Name>Scope` (24 primitives: Accordion, AlertDialog, Avatar, Checkbox, Collapsible, ContextMenu, Dialog, DropdownMenu, Form, HoverCard, Menubar, NavigationMenu, Popover, Progress, RadioGroup, ScrollArea, Select, Slider, Switch, Tabs, Toast, ToggleGroup, Toolbar, Tooltip). The documentation does not describe them. Source: `P/<primitive>/src/index.ts` at the commit above, checked 2026-11-13.
- Further public non-component exports: `VISUALLY_HIDDEN_STYLES` (the style object of Visually Hidden, reachable as `VisuallyHidden.VISUALLY_HIDDEN_STYLES`), and `unstable_` provider, trigger and bubble-input parts of Checkbox, RadioGroup, Select, Slider and Switch (component parts, as RES-037 records for Radio Group). The internal namespaces also carry `useFocusGuards`, `useFocusScopeBranch`, `useFocusScopeBranchRegistry`, `useDismissableLayerSurface` (marked `@internal`), `createPopperScope`, `SIDE_OPTIONS`, `ALIGN_OPTIONS`, `createMenuScope` and `createRovingFocusGroupScope`. Source: `P/<name>/src/index.ts` with comments removed, checked 2026-11-13.

### Radix Themes

Version: `@radix-ui/themes` 3.3.0 (npm `latest`), repository github.com/radix-ui/themes at commit 1faff10ac26ae17f09944d418c6949b93fc6b566 (2026-04-11). Abbreviation below: `T` = `packages/radix-ui-themes/src` at that commit.

- npm `latest` is 3.3.0; the repository's `package.json` also says 3.3.0. RES-034 named 3.1.3 from the documentation. Source: https://registry.npmjs.org/@radix-ui/themes/latest; `packages/radix-ui-themes/package.json`, checked 2026-11-13.
- The package publishes the subpaths `.`, `./components/*`, `./helpers`, `./props` and `./*`. Source: https://registry.npmjs.org/@radix-ui/themes/latest (`exports`), checked 2026-11-13.
- The docs sidebar Utilities section lists Accessible Icon, Portal, Reset, Slot, Theme, Visually Hidden. All six are concepts of RES-037. The sidebar has no hooks section. Source: https://www.radix-ui.com/themes/docs/theme/overview (sidebar), checked 2026-11-13.
- Non-component exports of the root: `ThemeContext` (React context), `useThemeContext()` (hook; returns `appearance`, `accentColor`, `grayColor`, `resolvedGrayColor`, `panelBackground`, `radius`, `scaling` and an `on<Name>Change` handler for each; throws outside a `Theme`); `Slottable` (beside `Slot`); `ThemePanel` and `unstable_ThemePanelContent` (helper components); the icons `ChevronDownIcon`, `ThickCheckIcon`, `ThickChevronRightIcon`, `ThickDividerHorizontalIcon`. Source: `T/components/index.tsx`, `T/components/theme.tsx:20-50`, checked 2026-11-13.
- The Theme docs page documents only the `Theme` props. It does not mention `useThemeContext` or `ThemeContext`. Source: https://www.radix-ui.com/themes/docs/components/theme, checked 2026-11-13.
- `ThemePanel` is documented on Getting started: "a drop-in component that allows you to preview the theme in real time", placed inside the root `Theme`. Source: https://www.radix-ui.com/themes/docs/overview/getting-started, checked 2026-11-13.
- For dark mode, the docs recommend the third-party `next-themes` `ThemeProvider` with `attribute="class"`, and say not to set `appearance` from `resolvedTheme`. Radix Themes has no own theme switcher hook. Source: https://www.radix-ui.com/themes/docs/theme/dark-mode#with-next-themes, checked 2026-11-13.
- `@radix-ui/themes/helpers` exports these functions: `extractProps` (turns props into `className` and `style` from prop definitions, applies defaults), `extractMarginProps`, `getMarginStyles`, `getMatchingGrayColor` (maps an accent color to its gray, for example red to mauve), `getResponsiveStyles`, `getResponsiveCustomProperties`, `getResponsiveClassNames`, `getSubtree`, `hasOwnProperty`, `isResponsiveObject`, `mapResponsiveProp`, `mapCalloutSizeToTextSize`, `mapButtonSizeToSpinnerSize`, `mergeStyles`, `requireReactElement`, plus types (`component-props`, `input-attributes`). `inert.ts` exists but is not in the index. None of these is in the docs sidebar. Source: `T/helpers/index.ts` and the files it re-exports, checked 2026-11-13.
- `@radix-ui/themes/props` exports prop definitions: `breakpoints` (deprecated alias of `breakpointsArray`), `accentColors`, `grayColors`, `radii`, `asChildPropDef`, `colorPropDef`, `accentColorPropDef`, `highContrastPropDef`, `radiusPropDef`, `textAlignPropDef`, `textWrapPropDef`, `truncatePropDef`, `weightPropDef`, `leadingTrimPropDef`, `gapPropDefs`, `heightPropDefs`, `widthPropDefs`, `layoutPropDefs`, `marginPropDefs`, `paddingPropDefs`, and the prop definitions of 50 component props files (for example `buttonPropDefs`). Source: `T/props/index.ts` and its re-exported files, checked 2026-11-13.

### Chakra UI

Version: `@chakra-ui/react` 3.38.0 and `@chakra-ui/charts` 3.38.0, repository github.com/chakra-ui/chakra-ui at commit 4d3fda5dfd956188786a641ba47ec49dbe7dce93 (2026-11-11), the same commit as RES-042. Abbreviation below: `C` = `packages/react/src` at that commit.

- The package publishes `.`, `./anatomy`, `./preset`, `./preset-base`, `./styled-system`, `./collection`, `./theme`, `./hooks` and `./*` (which maps to `components/*/index`). The root re-exports `./collection`, `./components`, `createContext`, `./hooks`, `mergeProps`, `mergeRefs`, `defaultConfig`, `defaultSystem`, `defaultBaseConfig` and `./styled-system`. The folder `C/utils` (`cx`, `callAll`, `compact`, `omit`, `splitProps`, `walkObject` and others) is not re-exported, so it is internal. Source: `packages/react/package.json` (`exports`), `C/index.ts`, `C/utils/index.ts`, checked 2026-11-13.
- The documentation has no hooks section. Its index offers the sets Components, Charts, Styling, Theming and Migration. The docs folders are charts, components, get-started, styling and theming; the only page named after a hook is `charts/use-chart.mdx`. Hooks appear inside component pages. Source: https://chakra-ui.com/llms.txt; `apps/www/content/docs` at the commit above, checked 2026-11-13.
- Code comments still link to `https://chakra-ui.com/docs/hooks/use-disclosure` and `/docs/hooks/use-controllable`; the first answers 404. Source: `C/hooks/use-disclosure.ts:17`, `C/hooks/use-controllable-state.ts:9,27`; https://chakra-ui.com/docs/hooks/use-disclosure (HTTP 404), checked 2026-11-13.
- General hooks in `C/hooks` (20 exports): `useAsyncList` (loads items for a filter text, aborts stale requests); `useBreakpoint` (current breakpoint name); `useBreakpointValue` (picks a value per breakpoint); `useCallbackRef` ("user-land implementation of the experimental `useEffectEvent`"); `useConst` (value created once); `useControllableProp` and `useControllableState` (controlled or uncontrolled state); `useDisclosure` ("handle common open, close, or toggle scenarios"); `useElementRect` (measures an element); `useForceUpdate`; `useHotkeys`, `useHotkeyStore`, `useFormatHotkey` (re-exported from `@ark-ui/react/hotkeys`); `useListCollection` (from `@ark-ui/react/collection`); `useLiveRef` (ref that holds the latest value); `useMediaQuery`; `usePrevious`; `useSafeLayoutEffect` (layout effect that is safe on the server); `useUpdateEffect` (effect that skips the first render); `createOverlay` (function that makes an imperatively opened overlay, used by the Overlay Manager). Source: `C/hooks/index.ts` and each file in `C/hooks`, checked 2026-11-13.
- Root utilities (10): `createContext` (React context with a hook and a named error), `mergeProps`, `mergeRefs`, `defaultConfig`, `defaultSystem`, `defaultBaseConfig`, `createListCollection`, `createGridCollection`, `createTreeCollection`, `createFileTreeCollection` (the four from `@ark-ui/react/collection`). Source: `C/index.ts`, `C/collection.ts`, checked 2026-11-13.
- Styling system exports (27): the config helpers `defineConfig`, `mergeConfigs`, `defineTokens`, `defineSemanticTokens`, `defineRecipe`, `defineSlotRecipe`, `defineStyle`, `defineTextStyles`, `defineLayerStyles`, `defineAnimationStyles`, `defineKeyframes`, `defineGlobalStyles`, `defineConditions`; `createSystem`, `isValidSystem`; the factory `chakra`; `createRecipeContext`, `createSlotRecipeContext`; `ChakraProvider` and `useChakraContext` (the system context); `RecipePropsProvider` and `useParentRecipeProps`; `useRecipe`, `useSlotRecipe`; `useToken(category, token)` (resolves token values from the system); `EMPTY_STYLES`, `EMPTY_SLOT_STYLES`. Source: `C/styled-system/index.ts`, `config.ts`, `provider.tsx`, `recipe-props.tsx`, `use-token.ts`, `empty.ts`, checked 2026-11-13.
- Hooks and functions re-exported for single components, as one group (179 exports: 59 style hooks, 44 state hooks, 4 utility hooks, 60 context hooks, 11 functions, 1 provider). Source: the `index.ts` or `index.tsx` of each folder in `C/components`, checked 2026-11-13.
  - Style hooks, `use<Name>Styles`, which read the slot styles of the component's recipe (59): Accordion, ActionBar, Alert, Avatar, Blockquote, Breadcrumb, Card, Carousel, CheckboxCard, Checkbox, Clipboard, Collapsible, ColorPicker, Combobox, Command, DataList, DateInput, DatePicker, Dialog, Drawer, Editable, EmptyState, Field, FileUpload, FloatingPanel, HoverCard, List, Listbox, Marquee, Menu, NativeSelect, NumberInput, Pagination, PinInput, Popover, ProgressCircle, Progress, QrCode, RadioCard, RadioGroup, RatingGroup, ScrollArea, SegmentGroup, Select, Slider, Splitter, Stat, Status, Steps, Switch, Table, Tabs, Tag, TagsInput, Timeline, Toast, Toggle, Tooltip, TreeView.
  - State hooks, `use<Name>`, from Ark UI, which create the component's state outside its tree for use with `RootProvider` (44): useAccordion, useActionBar, useAvatar, useCarousel, useCheckbox, useCheckboxCard, useCheckboxGroup, useClipboard, useCollapsible, useColorPicker, useCombobox, useCommand, useDateInput, useDatePicker, useDialog, useDrawer, useEditable, useFileUpload, useFloatingPanel, useHoverCard, useListbox, useMarquee, useMenu, useNumberInput, usePagination, usePinInput, usePopover, useProgress, useQrCode, useRadioCardGroup, useRadioGroup, useRatingGroup, useScrollArea, useSegmentGroup, useSelect, useSlider, useSplitter, useSteps, useSwitch, useTabs, useTagsInput, useToggle, useTooltip, useTreeView. Four more `use` exports in component folders are utilities, not state of a component: `useCommandCollection`, `useDownload` (download-trigger), `useHighlight` (splits text into highlighted chunks), `useFilter` (locale-aware text filter, locale folder).
  - Context hooks, `use<Name>Context` and `use<Name>ItemContext` / `NodeContext`, which read the component state inside its tree (60): useAccordionContext, useAccordionItemContext, useActionBarContext, useAvatarContext, useCarouselContext, useCheckboxCardContext, useCheckboxContext, useCheckboxGroupContext, useClipboardContext, useCollapsibleContext, useColorPickerContext, useComboboxContext, useComboboxItemContext, useCommandContext, useDateInputContext, useDatePickerContext, useDialogContext, useDrawerContext, useEditableContext, useEnvironmentContext, useFieldContext, useFieldsetContext, useFileUploadContext, useFloatingPanelContext, useHoverCardContext, useListboxContext, useListboxItemContext, useLocaleContext, useMarqueeContext, useMenuContext, useMenuItemContext, useNumberInputContext, usePaginationContext, usePinInputContext, usePopoverContext, useProgressContext, useQrCodeContext, useRadioCardContext, useRadioCardItemContext, useRadioGroupContext, useRadioGroupItemContext, useRatingGroupContext, useRatingGroupItemContext, useScrollAreaContext, useSegmentGroupContext, useSegmentGroupItemContext, useSelectContext, useSelectItemContext, useSliderContext, useSplitterContext, useStepsContext, useStepsItemContext, useSwitchContext, useTabsContext, useTagsInputContext, useTagsInputItemContext, useToggleContext, useTooltipContext, useTreeViewContext, useTreeViewNodeContext.
  - Functions (11): `createIcon` (makes an icon component from an SVG path), `createToaster` (makes a toast store with `create`, `update`, `dismiss`), `parseColor`, `getColorChannels` (color picker), `parseDate` (date picker), `createSplitterRegistry`, `getSplitterLayout` (splitter), `visuallyHiddenStyle` (style object), `createShikiAdapter`, `createHighlightJsAdapter`, `plainTextAdapter` (code block highlighting adapters). One provider: `CodeBlockAdapterProvider`.
- Each compound component also exports helper components that RES-037 records as parts or does not name: 73 `<Name>PropsProvider` (default props for a subtree), 43 `<Name>RootProvider` (root that takes an external `use<Name>()` result), and 57 `<Name>Context` render-prop components. These are counted here and not listed one by one. Source: the same index files, checked 2026-11-13.
- `@chakra-ui/charts` exports the hook `useChart` ("Provides utilities to manage and format data for charts": series aggregation, number and date formatting, token lookup) beside its chart components. Source: `packages/charts/src/index.ts`; `apps/www/content/docs/charts/use-chart.mdx`, checked 2026-11-13.
- Snippets (copied into the consumer's project, see RES-042) export these non-component names: `useColorMode`, `useColorModeValue` and `ColorModeProvider` (color-mode snippet, which wraps `next-themes`); `toaster` (the toaster snippet's `createToaster` instance); and for the rich text editor, `useRichTextEditorContext`, `useEditorMenu`, `createBooleanControl`, `createSelectControl`, `createSwatchControl`, `createMentionConfig`, `createSuggestionConfig`, `createEmojiSuggestionConfig`. Source: `apps/compositions/src/ui/color-mode.tsx:10-44`, `toaster.tsx`, `rich-text-editor*.tsx` at the commit above, checked 2026-11-13.
- The package also exports component folders that RES-037 holds as no concept and that have no docs page of their own: `Circle`, `Square` and `Spacer` (RES-035 notes them as documented together with Center and Flex), `Span`, `Sticky`, `Loader` and `LoaderOverlay` (a `Spinner` with `spinnerPlacement`, used for loading states), `FocusTrap` (`chakra()` around Ark's focus trap), `Toggle` (`ToggleRoot`, `ToggleIndicator`, `ToggleContext`, `useToggle`), `InputAddon` and `InputElement`. Source: `C/components/index.ts` (118 `export` lines) and the folders `circle`, `square`, `spacer`, `span`, `sticky`, `loader/loader.tsx`, `focus-trap/focus-trap.tsx:12`, `toggle`, `input-addon`, `input-element` at the Chakra commit above; RES-035 lines 115 and 143, checked 2026-11-13.

### Geist

Version: unversioned (the documentation states no version, as RES-036 found). Pages read: the 75 component pages of RES-036 and the pages introduction, brands, geistcn-icons, colors, typography, materials and terminal (82 pages), each as rendered HTML through Firecrawl on 2026-11-13. Geist publishes no source and no export file, so the only evidence is the code samples on its pages ("Show code"), which are in the page HTML.

- The code samples import from `@vercel/geistcn/components`, `@vercel/geistcn/components/filter-params`, `@vercel/geistcn/utils`, `@vercel/geistcn-assets/icons` and `@vercel/geistcn-assets/logos`. The npm registry has no package `@vercel/geistcn` ("Not found"), so these imports name a package that is not public. Source: code samples in the HTML of https://vercel.com/geist/* pages; https://registry.npmjs.org/@vercel%2fgeistcn, checked 2026-11-13.
- The pages have no section for hooks or utilities. The sidebar sections are Foundations, Brands and Components (RES-036). Source: https://vercel.com/geist/introduction and RES-036, checked 2026-11-13.
- Non-component names imported in the code samples (10): `useToasts` (hook; returns an object with `message`, `success`, `warning`, `error`; options include `preserve`) on the Toast and Modal pages; `useRadio({ value, disabled })` (hook; returns `{ component }`) on the Radio page; `badgeVariants({ variant, size })` (class-name function, used with `cn` to style a `Link` as a pill) on the Badge page; `cn` from `@vercel/geistcn/utils` on the Badge page; `getAddressErrors(address)` ("to check required fields") on the Address Input page; `createGoogleAddressProvider` (from `@pyra/components/address-input/google-provider`, an address lookup provider) on the Address Input page; `makeJsonViewHighlightPattern(terms)` ("to build the `highlightPattern` prop from search terms") on the JSON View page; `useSearchParamState()` (hook; returns `[searchParams, setSearchParams]` for the URL-backed filter bar), `encodeDateRangeValue` and `decodeDateRangeValue` on the Filter Params page. Source: code samples of https://vercel.com/geist/toast, /modal, /radio, /badge, /address-input, /json-view, /filter-params, checked 2026-11-13.
- Toast usage guidance: "Pick the method by how the user experienced the event, not by HTTP status"; "Default toasts auto-dismiss; pass `preserve` only when the user must read or act on the message". Source: https://vercel.com/geist/toast (text), checked 2026-11-13.
- Helper components in the code samples that are not concepts of RES-037 (6): `Link` (used inside Toast, Note, Empty State and Fieldset samples), `ButtonLink` ("for links with the same props as `Button`"), `ErrorText` and `WarningText` (Fieldset "With Error Text" and "With Warning Text"), `DisabledWall` (Fieldset "With Disabled Wall": content "not accessible to free users"), `SecretValue` (Snippet page: "for a retrievable secret that should stay masked"). Source: https://vercel.com/geist/button, /fieldset, /snippet, checked 2026-11-13.
- The scan found no theme hook, no media-query hook and no disclosure hook on any Geist page. The only React hooks in the samples besides the three above are React's own (`useState`, `useRef`, `useId`, `useMemo`, `useCallback`, `useEffect`). Source: all 82 pages above, checked 2026-11-13.

## Follow-ups
- RES-037 has no Chakra entry for the Toggle concept, although `@chakra-ui/react` 3.38.0 exports `Toggle` (no docs page). The matrix owner may want to record it.
- RES-034 names Radix Themes 3.1.3; npm `latest` is 3.3.0.

## Next action
None.
