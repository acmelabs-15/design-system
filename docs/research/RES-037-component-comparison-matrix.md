---
id: RES-037
status: resolved # in-progress | resolved
outcome: answered
kind: research
from: IDEA-001#01 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-12
---
# RES-037: Comparison matrix of the components of the five reference systems

<!-- Add outcome: answered, partial or blocked to frontmatter when an answer or a block is known. Only answered work can become resolved. -->

## Question
Which component concepts do shadcn/ui, Radix Primitives, Radix Themes, Chakra UI and Geist have, what does each system call them, how does each split them into parts, and where do they disagree?

## Answer
Answered. The matrix below places all 347 components of the five reference systems into 182 component concepts. The sufficient-answer condition is met.

This record is the synthesis of five inventories: RES-032 (shadcn/ui), RES-033 (Radix Primitives), RES-034 (Radix Themes), RES-035 (Chakra UI) and RES-036 (Geist). Each inventory holds the exact part names, the purpose and the notes of every component.

Needed by: IDEA-001#05 to IDEA-001#09, and IDEA-001#04 through the catalogs that a system has beside its components.

Sufficient-answer condition:

- One row for each component concept, with a cell for each of the five systems: the name in that system, its parts, and the link to its page; or a mark that the system has no such component.
- One table for each component category, with the version of each system and the access date.
- For each row where the systems disagree on the name or on the split into parts, the disagreement in words.
- How each concept was matched across systems: by the same name, or by the same purpose under different names.

The record gives facts, sources and disagreements only. It gives no recommendation.

### The systems
| System | Components | Version, as the inventory states it | Inventory |
|---|---|---|---|
| shadcn/ui | 66 | shadcn CLI 4.23.0 (npm "latest", published 2026-10-27); the docs carry no single library version number. Latest docs release entry: "October 2026 - Trace, Code Block and AI Elements". | [RES-032](RES-032-components-of-shadcn-ui.md) |
| Radix Primitives | 35 | No single version number stated in the docs. The Releases page is organised by date; its newest entry is "July 20, 2026". The unified npm package radix-ui is at 1.8.1 (latest dist-tag, published 2026-10-12), but that comes from the npm registry, not the documentation. | [RES-033](RES-033-components-of-radix-primitives.md) |
| Radix Themes | 56 | 3.1.3 | [RES-034](RES-034-components-of-radix-themes.md) |
| Chakra UI | 115 | 3.38.0 | [RES-035](RES-035-components-of-chakra-ui.md) |
| Geist | 75 | unversioned (the documentation states no version number) | [RES-036](RES-036-components-of-geist.md) |

Access date of every page: 2026-11-12.

### Counts
- 347 components in 182 concepts. In all five systems: 13. In four: 15. In three: 17. In two: 33. In one system only: 104.
- 26 concepts join components with different names.
- Checks: 27 concepts that join different names went to skeptical agents; 5 names that the matching agent had split went to them too; the critic proposed 6 more matches, and 0 of them were joined. 6 matches were refuted or lost a member.
- Repairs by the script: 0 unknown ids, 0 double placements, 0 components that the matching agent did not place.
- Run `wf_3f80fbdc-1cd`: 86 agents on Opus 5.5 at medium effort, 5,020,496 tokens. The full result is in `.artifacts/v1/research/IDEA-001-01-matrix-wf_3f80fbdc-1cd.json` (scratch, outside git).

### How the matching works
- Two components are the same concept when their documentation gives them the same purpose, so that a developer would use one in place of the other. A different name, a different split into parts and a different look are disagreements inside one concept.
- A special form with its own purpose, a part of another component and a component whose purpose only overlaps are separate concepts.
- One agent placed every component. A match under one name needed no check. Each match across names had one skeptical vote, and two more unless the first was a confident yes; two votes of three decide.
- The reading categories below are the matching agent's, for the order of the tables only. Each system's own category is in its inventory.
- In the parts tables, the component name is cut from each part name so that the splits can be compared: `Accordion.Trigger` and `AccordionTrigger` both read "Trigger", and a part with the component's own name reads "(root)". The exact names are in the inventories.

### Layout: names
| Concept | In | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|---|
| Separator | 5 | [Separator](https://ui.shadcn.com/docs/components/base/separator) | [Separator](https://www.radix-ui.com/primitives/docs/components/separator) | [Separator](https://www.radix-ui.com/themes/docs/components/separator) | [Separator](https://chakra-ui.com/docs/components/separator) | [Separator](https://vercel.com/geist/separator) |
| Aspect Ratio | 4 | [Aspect Ratio](https://ui.shadcn.com/docs/components/base/aspect-ratio) | [Aspect Ratio](https://www.radix-ui.com/primitives/docs/components/aspect-ratio) | [Aspect Ratio](https://www.radix-ui.com/themes/docs/components/aspect-ratio) | [Aspect Ratio](https://chakra-ui.com/docs/components/aspect-ratio) | — |
| Scroll Area | 4 | [Scroll Area](https://ui.shadcn.com/docs/components/base/scroll-area) | [Scroll Area](https://www.radix-ui.com/primitives/docs/components/scroll-area) | [Scroll Area](https://www.radix-ui.com/themes/docs/components/scroll-area) | [Scroll Area](https://chakra-ui.com/docs/components/scroll-area) | — |
| Card | 3 | [Card](https://ui.shadcn.com/docs/components/base/card) | — | [Card](https://www.radix-ui.com/themes/docs/components/card) | [Card](https://chakra-ui.com/docs/components/card) | — |
| Grid | 3 | — | — | [Grid](https://www.radix-ui.com/themes/docs/components/grid) | [Grid](https://chakra-ui.com/docs/components/grid) | [Grid](https://vercel.com/geist/grid) |
| Bleed | 2 | — | — | [Inset](https://www.radix-ui.com/themes/docs/components/inset) | [Bleed](https://chakra-ui.com/docs/components/bleed) | — |
| Box | 2 | — | — | [Box](https://www.radix-ui.com/themes/docs/components/box) | [Box](https://chakra-ui.com/docs/components/box) | — |
| Container | 2 | — | — | [Container](https://www.radix-ui.com/themes/docs/components/container) | [Container](https://chakra-ui.com/docs/components/container) | — |
| Flex | 2 | — | — | [Flex](https://www.radix-ui.com/themes/docs/components/flex) | [Flex](https://chakra-ui.com/docs/components/flex) | — |
| Item | 2 | [Item](https://ui.shadcn.com/docs/components/base/item) | — | — | — | [Entity](https://vercel.com/geist/entity) |
| Resizable | 2 | [Resizable](https://ui.shadcn.com/docs/components/base/resizable) | — | — | [Splitter](https://chakra-ui.com/docs/components/splitter) | — |
| AbsoluteCenter | 1 | — | — | — | [AbsoluteCenter](https://chakra-ui.com/docs/components/absolute-center) | — |
| Center | 1 | — | — | — | [Center](https://chakra-ui.com/docs/components/center) | — |
| Float | 1 | — | — | — | [Float](https://chakra-ui.com/docs/components/float) | — |
| Group | 1 | — | — | — | [Group](https://chakra-ui.com/docs/components/group) | — |
| Scroller | 1 | — | — | — | — | [Scroller](https://vercel.com/geist/scroller) |
| Section | 1 | — | — | [Section](https://www.radix-ui.com/themes/docs/components/section) | — | — |
| Sidebar | 1 | [Sidebar](https://ui.shadcn.com/docs/components/base/sidebar) | — | — | — | — |
| SimpleGrid | 1 | — | — | — | [SimpleGrid](https://chakra-ui.com/docs/components/simple-grid) | — |
| Stack | 1 | — | — | — | [Stack](https://chakra-ui.com/docs/components/stack) | — |
| Wrap | 1 | — | — | — | [Wrap](https://chakra-ui.com/docs/components/wrap) | — |

### Layout: parts of the concepts that two systems or more have
| Concept | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|
| Separator | one piece | one piece | one piece | one piece | one piece |
| Aspect Ratio | one piece | one piece | one piece | one piece | — |
| Scroll Area | (root), ScrollBar | Root, Viewport, Scrollbar, Thumb, Corner | one piece | Root, Viewport, Content, Scrollbar, Thumb, Corner | — |
| Card | (root), Header, Title, Description, Action, Content, Footer | — | one piece | Root, Header, Body, Footer, Title, Description | — |
| Grid | — | — | one piece | (root), Item | System, (root), Cell, Cross, Page |
| Bleed | — | — | one piece | one piece | — |
| Box | — | — | one piece | one piece | — |
| Container | — | — | one piece | one piece | — |
| Flex | — | — | one piece | one piece | — |
| Item | Group, (root), Header, Media, Content, Title, Description, Actions, Footer, Separator | — | — | — | List, (root), Content |
| Resizable | PanelGroup, Panel, Handle | — | — | Root, Panel, ResizeTrigger, ResizeTriggerSeparator, ResizeTriggerIndicator | — |

### Typography: names
| Concept | In | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|---|
| Kbd | 4 | [Kbd](https://ui.shadcn.com/docs/components/base/kbd) | — | [Kbd](https://www.radix-ui.com/themes/docs/components/kbd) | [Kbd](https://chakra-ui.com/docs/components/kbd) | [Keyboard Input](https://vercel.com/geist/keyboard-input) |
| Blockquote | 2 | — | — | [Blockquote](https://www.radix-ui.com/themes/docs/components/blockquote) | [Blockquote](https://chakra-ui.com/docs/components/blockquote) | — |
| Code | 2 | — | — | [Code](https://www.radix-ui.com/themes/docs/components/code) | [Code](https://chakra-ui.com/docs/components/code) | — |
| Em | 2 | — | — | [Em](https://www.radix-ui.com/themes/docs/components/em) | [Em](https://chakra-ui.com/docs/components/em) | — |
| Heading | 2 | — | — | [Heading](https://www.radix-ui.com/themes/docs/components/heading) | [Heading](https://chakra-ui.com/docs/components/heading) | — |
| Link | 2 | — | — | [Link](https://www.radix-ui.com/themes/docs/components/link) | [Link](https://chakra-ui.com/docs/components/link) | — |
| Text | 2 | — | — | [Text](https://www.radix-ui.com/themes/docs/components/text) | [Text](https://chakra-ui.com/docs/components/text) | — |
| Description | 1 | — | — | — | — | [Description](https://vercel.com/geist/description) |
| Highlight | 1 | — | — | — | [Highlight](https://chakra-ui.com/docs/components/highlight) | — |
| Link Overlay | 1 | — | — | — | [Link Overlay](https://chakra-ui.com/docs/components/link-overlay) | — |
| List | 1 | — | — | — | [List](https://chakra-ui.com/docs/components/list) | — |
| Mark | 1 | — | — | — | [Mark](https://chakra-ui.com/docs/components/mark) | — |
| MiddleTruncate | 1 | — | — | — | — | [MiddleTruncate](https://vercel.com/geist/middle-truncate) |
| Prose | 1 | — | — | — | [Prose](https://chakra-ui.com/docs/components/prose) | — |
| Quote | 1 | — | — | [Quote](https://www.radix-ui.com/themes/docs/components/quote) | — | — |
| Strong | 1 | — | — | [Strong](https://www.radix-ui.com/themes/docs/components/strong) | — | — |

### Typography: parts of the concepts that two systems or more have
| Concept | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|
| Kbd | (root), Group | — | one piece | (root), Group | one piece |
| Blockquote | — | — | one piece | Root, Content, Caption, Icon | — |
| Code | — | — | one piece | one piece | — |
| Em | — | — | one piece | one piece | — |
| Heading | — | — | one piece | one piece | — |
| Link | — | — | one piece | one piece | — |
| Text | — | — | one piece | one piece | — |

### Buttons and actions: names
| Concept | In | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|---|
| Button | 4 | [Button](https://ui.shadcn.com/docs/components/base/button) | — | [Button](https://www.radix-ui.com/themes/docs/components/button) | [Button](https://chakra-ui.com/docs/components/button) | [Button](https://vercel.com/geist/button) |
| Copy Button | 2 | — | — | — | [Clipboard](https://chakra-ui.com/docs/components/clipboard) | [Copy Button](https://vercel.com/geist/copy-button) |
| Icon Button | 2 | — | — | [Icon Button](https://www.radix-ui.com/themes/docs/components/icon-button) | [Icon Button](https://chakra-ui.com/docs/components/icon-button) | — |
| Toggle | 2 | [Toggle](https://ui.shadcn.com/docs/components/base/toggle) | [Toggle](https://www.radix-ui.com/primitives/docs/components/toggle) | — | — | — |
| Toggle Group | 2 | [Toggle Group](https://ui.shadcn.com/docs/components/base/toggle-group) | [Toggle Group](https://www.radix-ui.com/primitives/docs/components/toggle-group) | — | — | — |
| Action Bar | 1 | — | — | — | [Action Bar](https://chakra-ui.com/docs/components/action-bar) | — |
| Button Group | 1 | [Button Group](https://ui.shadcn.com/docs/components/base/button-group) | — | — | — | — |
| Close Button | 1 | — | — | — | [Close Button](https://chakra-ui.com/docs/components/close-button) | — |
| Download Trigger | 1 | — | — | — | [Download Trigger](https://chakra-ui.com/docs/components/download-trigger) | — |
| Load More Button | 1 | — | — | — | — | [Load More Button](https://vercel.com/geist/load-more-button) |
| Split Button | 1 | — | — | — | — | [Split Button](https://vercel.com/geist/split-button) |
| Text With Copy Button | 1 | — | — | — | — | [Text With Copy Button](https://vercel.com/geist/text-with-copy-button) |
| Toolbar | 1 | — | [Toolbar](https://www.radix-ui.com/primitives/docs/components/toolbar) | — | — | — |

### Buttons and actions: parts of the concepts that two systems or more have
| Concept | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|
| Button | one piece | — | one piece | one piece | one piece |
| Copy Button | — | — | — | Root, Trigger, CopyText, Indicator, Input, Label, ValueText | one piece |
| Icon Button | — | — | one piece | one piece | — |
| Toggle | one piece | one piece | — | — | — |
| Toggle Group | (root), Item | Root, Item | — | — | — |

### Form controls: names
| Concept | In | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|---|
| Checkbox | 5 | [Checkbox](https://ui.shadcn.com/docs/components/base/checkbox) | [Checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox) | [Checkbox](https://www.radix-ui.com/themes/docs/components/checkbox) | [Checkbox](https://chakra-ui.com/docs/components/checkbox) | [Checkbox](https://vercel.com/geist/checkbox) |
| Radio Group | 5 | [Radio Group](https://ui.shadcn.com/docs/components/base/radio-group) | [Radio Group](https://www.radix-ui.com/primitives/docs/components/radio-group) | [Radio Group](https://www.radix-ui.com/themes/docs/components/radio-group) | [Radio](https://chakra-ui.com/docs/components/radio) | [Radio](https://vercel.com/geist/radio) |
| Select | 5 | [Select](https://ui.shadcn.com/docs/components/base/select) | [Select](https://www.radix-ui.com/primitives/docs/components/select) | [Select](https://www.radix-ui.com/themes/docs/components/select) | [Select](https://chakra-ui.com/docs/components/select) | [Select](https://vercel.com/geist/select) |
| Slider | 5 | [Slider](https://ui.shadcn.com/docs/components/base/slider) | [Slider](https://www.radix-ui.com/primitives/docs/components/slider) | [Slider](https://www.radix-ui.com/themes/docs/components/slider) | [Slider](https://chakra-ui.com/docs/components/slider) | [Slider](https://vercel.com/geist/slider) |
| Switch | 5 | [Switch](https://ui.shadcn.com/docs/components/base/switch) | [Switch](https://www.radix-ui.com/primitives/docs/components/switch) | [Switch](https://www.radix-ui.com/themes/docs/components/switch) | [Switch](https://chakra-ui.com/docs/components/switch) | [Toggle](https://vercel.com/geist/toggle) |
| Input | 4 | [Input](https://ui.shadcn.com/docs/components/base/input) | — | [Text Field](https://www.radix-ui.com/themes/docs/components/text-field) | [Input](https://chakra-ui.com/docs/components/input) | [Input](https://vercel.com/geist/input) |
| Textarea | 4 | [Textarea](https://ui.shadcn.com/docs/components/base/textarea) | — | [Text Area](https://www.radix-ui.com/themes/docs/components/text-area) | [Textarea](https://chakra-ui.com/docs/components/textarea) | [Textarea](https://vercel.com/geist/textarea) |
| Combobox | 3 | [Combobox](https://ui.shadcn.com/docs/components/base/combobox) | — | — | [Combobox](https://chakra-ui.com/docs/components/combobox) | [Combobox](https://vercel.com/geist/combobox) |
| Input OTP | 3 | [Input OTP](https://ui.shadcn.com/docs/components/base/input-otp) | [One-Time Password Field](https://www.radix-ui.com/primitives/docs/components/one-time-password-field) | — | [Pin Input](https://chakra-ui.com/docs/components/pin-input) | — |
| Label | 3 | [Label](https://ui.shadcn.com/docs/components/base/label) | [Label](https://www.radix-ui.com/primitives/docs/components/label) | — | — | [Label](https://vercel.com/geist/label) |
| Segmented Control | 3 | — | — | [Segmented Control](https://www.radix-ui.com/themes/docs/components/segmented-control) | [Segmented Control](https://chakra-ui.com/docs/components/segmented-control) | [Switch](https://vercel.com/geist/switch) |
| Checkbox Cards | 2 | — | — | [Checkbox Cards](https://www.radix-ui.com/themes/docs/components/checkbox-cards) | [Checkbox Card](https://chakra-ui.com/docs/components/checkbox-card) | — |
| Field | 2 | [Field](https://ui.shadcn.com/docs/components/base/field) | — | — | [Field](https://chakra-ui.com/docs/components/field) | — |
| Fieldset | 2 | — | — | — | [Fieldset](https://chakra-ui.com/docs/components/fieldset) | [Fieldset](https://vercel.com/geist/fieldset) |
| Native Select | 2 | [Native Select](https://ui.shadcn.com/docs/components/base/native-select) | — | — | [Select (Native)](https://chakra-ui.com/docs/components/native-select) | — |
| Password Input | 2 | — | [Password Toggle Field](https://www.radix-ui.com/primitives/docs/components/password-toggle-field) | — | [Password Input](https://chakra-ui.com/docs/components/password-input) | — |
| Radio Cards | 2 | — | — | [Radio Cards](https://www.radix-ui.com/themes/docs/components/radio-cards) | [Radio Card](https://chakra-ui.com/docs/components/radio-card) | — |
| Address Input | 1 | — | — | — | — | [Address Input](https://vercel.com/geist/address-input) |
| Checkbox Group | 1 | — | — | [Checkbox Group](https://www.radix-ui.com/themes/docs/components/checkbox-group) | — | — |
| Choicebox | 1 | — | — | — | — | [Choicebox](https://vercel.com/geist/choicebox) |
| Clearable Input | 1 | — | — | — | — | [Clearable Input](https://vercel.com/geist/clearable-input) |
| Color Picker | 1 | — | — | — | [Color Picker](https://chakra-ui.com/docs/components/color-picker) | — |
| Destructive Confirmation Input | 1 | — | — | — | — | [Destructive Confirmation Input](https://vercel.com/geist/destructive-confirmation-input) |
| Editable | 1 | — | — | — | [Editable](https://chakra-ui.com/docs/components/editable) | — |
| Feedback | 1 | — | — | — | — | [Feedback](https://vercel.com/geist/feedback) |
| File Upload | 1 | — | — | — | [File Upload](https://chakra-ui.com/docs/components/file-upload) | — |
| Filter Params | 1 | — | — | — | — | [Filter Params](https://vercel.com/geist/filter-params) |
| Form | 1 | — | [Form](https://www.radix-ui.com/primitives/docs/components/form) | — | — | — |
| Input Group | 1 | [Input Group](https://ui.shadcn.com/docs/components/base/input-group) | — | — | — | — |
| Listbox | 1 | — | — | — | [Listbox](https://chakra-ui.com/docs/components/listbox) | — |
| Multi Select | 1 | — | — | — | — | [Multi Select](https://vercel.com/geist/multi-select) |
| Number Input | 1 | — | — | — | [Number Input](https://chakra-ui.com/docs/components/number-input) | — |
| Questionnaire | 1 | [Questionnaire](https://ui.shadcn.com/docs/components/base/questionnaire) | — | — | — | — |
| Radio | 1 | — | — | [Radio](https://www.radix-ui.com/themes/docs/components/radio) | — | — |
| Rating | 1 | — | — | — | [Rating](https://chakra-ui.com/docs/components/rating) | — |
| Rich Text Editor | 1 | — | — | — | [Rich Text Editor](https://chakra-ui.com/docs/components/rich-text-editor) | — |
| Search Input | 1 | — | — | — | — | [Search Input](https://vercel.com/geist/search-input) |
| Tags Input | 1 | — | — | — | [Tags Input](https://chakra-ui.com/docs/components/tags-input) | — |
| Theme Switcher | 1 | — | — | — | — | [Theme Switcher](https://vercel.com/geist/theme-switcher) |

### Form controls: parts of the concepts that two systems or more have
| Concept | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|
| Checkbox | one piece | Root, Indicator | one piece | Root, HiddenInput, Control, Indicator, Label, RootProvider | one piece |
| Radio Group | (root), Item | Root, Item, Indicator, unstable_ItemProvider, unstable_ItemTrigger, unstable_ItemBubbleInput | Root, Item | Root, Item, ItemHiddenInput, ItemIndicator, ItemText | Group, GroupItem, (root), useRadio |
| Select | (root), Trigger, Value, Content, Group, Label, Item, Separator | Root, Trigger, Value, Icon, Portal, Content, ScrollUpButton, Viewport, Item, ItemText, ItemIndicator, Group, Label, Separator, ScrollDownButton, Arrow | Root, Trigger, Content, Item, Group, Label, Separator | Root, HiddenSelect, Label, Control, Trigger, ValueText, IndicatorGroup, Indicator, ClearTrigger, Positioner, Content, Item, ItemIndicator, ItemGroup, ItemGroupLabel | one piece |
| Slider | one piece | Root, Track, Range, Thumb | one piece | Root, Label, ValueText, Control, Track, Range, Thumb, DraggingIndicator, HiddenInput, MarkerGroup, Marker, MarkerIndicator, MarkerLabel, Thumbs, Marks, RootProvider | one piece |
| Switch | one piece | Root, Thumb | one piece | Root, HiddenInput, Control, Thumb, Label, Indicator, ThumbIndicator | one piece |
| Input | one piece | — | Root, Slot | (root), Group | one piece |
| Textarea | one piece | — | one piece | one piece | one piece |
| Combobox | (root), Input, Content, Empty, List, Item, Chips, Value, Chip, ChipsInput, Group, Label, Collection, Separator | — | — | Root, Label, Control, Input, IndicatorGroup, ClearTrigger, Trigger, Positioner, Content, Empty, Item, ItemGroup, ItemGroupLabel | (root), Input, List, Option |
| Input OTP | (root), Group, Slot, Separator | Root, Input, HiddenInput | — | Root, HiddenInput, Control, Input | — |
| Label | one piece | Root | — | — | one piece |
| Segmented Control | — | — | Root, Item | Root, Indicator, Item, ItemText, ItemHiddenInput, Items | (root), Control |
| Checkbox Cards | — | — | Root, Item | Root, HiddenInput, Control, Content, Label, Description, Indicator, Addon | — |
| Field | (root), Label, Description, Error, Content, Group, Set, Legend, Separator, Title | — | — | Root, Label, RequiredIndicator, HelperText, ErrorText, ErrorIcon, Item | — |
| Fieldset | — | — | — | Root, Legend, Content, HelperText, ErrorText | (root), Content, Title, Subtitle, Footer, FooterStatus, FooterActions, FooterAction |
| Native Select | (root), Option, OptGroup | — | — | Root, Field, Indicator | — |
| Password Input | — | Root, Input, Toggle, Icon, Slot | — | one piece | — |
| Radio Cards | — | — | Root, Item | Root, Label, Item, ItemHiddenInput, ItemControl, ItemContent, ItemText, ItemDescription, ItemIndicator, ItemAddon | — |

### Menus and selection: names
| Concept | In | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|---|
| Dropdown Menu | 5 | [Dropdown Menu](https://ui.shadcn.com/docs/components/base/dropdown-menu) | [Dropdown Menu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) | [Dropdown Menu](https://www.radix-ui.com/themes/docs/components/dropdown-menu) | [Menu](https://chakra-ui.com/docs/components/menu) | [Menu](https://vercel.com/geist/menu) |
| Context Menu | 4 | [Context Menu](https://ui.shadcn.com/docs/components/base/context-menu) | [Context Menu](https://www.radix-ui.com/primitives/docs/components/context-menu) | [Context Menu](https://www.radix-ui.com/themes/docs/components/context-menu) | — | [Context Menu](https://vercel.com/geist/context-menu) |
| Command | 3 | [Command](https://ui.shadcn.com/docs/components/base/command) | — | — | [Command](https://chakra-ui.com/docs/components/command) | [Command Menu](https://vercel.com/geist/command-menu) |
| Menubar | 2 | [Menubar](https://ui.shadcn.com/docs/components/base/menubar) | [Menu Bar](https://www.radix-ui.com/primitives/docs/components/menubar) | — | — | — |
| Dots Menu | 1 | — | — | — | — | [Dots Menu](https://vercel.com/geist/dots-menu) |

### Menus and selection: parts of the concepts that two systems or more have
| Concept | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|
| Dropdown Menu | (root), Trigger, Content, Group, Label, Item, Separator, CheckboxItem, RadioGroup, RadioItem, Sub, SubTrigger, SubContent, Shortcut, Portal | Root, Trigger, Portal, Content, Label, Item, Group, CheckboxItem, ItemIndicator, RadioGroup, RadioItem, Sub, SubTrigger, SubContent, Separator, Arrow | Root, Trigger, TriggerIcon, Content, Label, Item, Group, RadioGroup, RadioItem, CheckboxItem, Sub, SubTrigger, SubContent, Separator | Root, Trigger, Positioner, Content, Item, ItemGroup, Separator, Arrow, CheckboxItem, ItemIndicator, RadioItemGroup, RadioItem | (root), Button, Container, Item, ItemLocked, Link, Section, Divider |
| Context Menu | (root), Trigger, Content, Group, Label, Item, Separator, CheckboxItem, RadioGroup, RadioItem, Sub, SubTrigger, SubContent, Shortcut | Root, Trigger, Portal, Content, Label, Item, Group, CheckboxItem, ItemIndicator, RadioGroup, RadioItem, Sub, SubTrigger, SubContent, Separator, Arrow | Root, Trigger, Content, Label, Item, Group, RadioGroup, RadioItem, CheckboxItem, Sub, SubTrigger, SubContent, Separator | — | (root), Trigger, Content, Item |
| Command | (root), Input, List, Empty, Group, Item, Separator | — | — | Provider, Dialog, DialogTrigger, DialogBackdrop, DialogContent, Root, Label, Control, Indicator, Input, ClearTrigger, List, Loading, ItemGroup, ItemGroupLabel, Item, ItemText, ItemCommand, Separator, Empty, Footer | (root), Input, List, Group, Item, Divider |
| Menubar | (root), Menu, Trigger, Content, Group, Label, Item, Separator, CheckboxItem, RadioGroup, RadioItem, Sub, SubTrigger, SubContent, Shortcut | Root, Menu, Trigger, Portal, Content, Label, Item, Group, CheckboxItem, ItemIndicator, RadioGroup, RadioItem, Sub, SubTrigger, SubContent, Separator, Arrow | — | — | — |

### Navigation: names
| Concept | In | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|---|
| Tabs | 5 | [Tabs](https://ui.shadcn.com/docs/components/base/tabs) | [Tabs](https://www.radix-ui.com/primitives/docs/components/tabs) | [Tabs](https://www.radix-ui.com/themes/docs/components/tabs) | [Tabs](https://chakra-ui.com/docs/components/tabs) | [Tabs](https://vercel.com/geist/tabs) |
| Breadcrumb | 3 | [Breadcrumb](https://ui.shadcn.com/docs/components/base/breadcrumb) | — | — | [Breadcrumb](https://chakra-ui.com/docs/components/breadcrumb) | [Breadcrumbs](https://vercel.com/geist/breadcrumbs) |
| Pagination | 3 | [Pagination](https://ui.shadcn.com/docs/components/base/pagination) | — | — | [Pagination](https://chakra-ui.com/docs/components/pagination) | [Pagination](https://vercel.com/geist/pagination) |
| Navigation Menu | 2 | [Navigation Menu](https://ui.shadcn.com/docs/components/base/navigation-menu) | [Navigation Menu](https://www.radix-ui.com/primitives/docs/components/navigation-menu) | — | — | — |
| Skip Nav | 1 | — | — | — | [Skip Nav](https://chakra-ui.com/docs/components/skip-nav) | — |
| Steps | 1 | — | — | — | [Steps](https://chakra-ui.com/docs/components/steps) | — |
| Tab Nav | 1 | — | — | [Tab Nav](https://www.radix-ui.com/themes/docs/components/tab-nav) | — | — |

### Navigation: parts of the concepts that two systems or more have
| Concept | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|
| Tabs | (root), List, Trigger, Content | Root, List, Trigger, Content | Root, List, Trigger, Content | Root, List, Trigger, Indicator, Content, ContentGroup, RootProvider | one piece |
| Breadcrumb | (root), List, Item, Link, Page, Separator, Ellipsis | — | — | Root, List, Item, Link, CurrentLink, Separator, Ellipsis | Breadcrumb, BreadcrumbItem |
| Pagination | (root), Content, Item, Link, Previous, Next, Ellipsis | — | — | Root, PrevTrigger, Ellipsis, Item, PageText, NextTrigger, Items, Context | one piece |
| Navigation Menu | (root), List, Item, Trigger, Content, Link, Indicator | Root, List, Item, Trigger, Content, Link, Sub, Indicator, Viewport | — | — | — |

### Overlays: names
| Concept | In | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|---|
| Dialog | 5 | [Dialog](https://ui.shadcn.com/docs/components/base/dialog) | [Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) | [Dialog](https://www.radix-ui.com/themes/docs/components/dialog) | [Dialog](https://chakra-ui.com/docs/components/dialog) | [Modal](https://vercel.com/geist/modal) |
| Hover Card | 5 | [Hover Card](https://ui.shadcn.com/docs/components/base/hover-card) | [Hover Card](https://www.radix-ui.com/primitives/docs/components/hover-card) | [Hover Card](https://www.radix-ui.com/themes/docs/components/hover-card) | [Hover Card](https://chakra-ui.com/docs/components/hover-card) | [Context Card](https://vercel.com/geist/context-card) |
| Tooltip | 5 | [Tooltip](https://ui.shadcn.com/docs/components/base/tooltip) | [Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip) | [Tooltip](https://www.radix-ui.com/themes/docs/components/tooltip) | [Tooltip](https://chakra-ui.com/docs/components/tooltip) | [Tooltip](https://vercel.com/geist/tooltip) |
| Popover | 4 | [Popover](https://ui.shadcn.com/docs/components/base/popover) | [Popover](https://www.radix-ui.com/primitives/docs/components/popover) | [Popover](https://www.radix-ui.com/themes/docs/components/popover) | [Popover](https://chakra-ui.com/docs/components/popover) | — |
| Alert Dialog | 3 | [Alert Dialog](https://ui.shadcn.com/docs/components/base/alert-dialog) | [Alert Dialog](https://www.radix-ui.com/primitives/docs/components/alert-dialog) | [Alert Dialog](https://www.radix-ui.com/themes/docs/components/alert-dialog) | — | — |
| Sheet | 3 | [Sheet](https://ui.shadcn.com/docs/components/base/sheet) | — | — | [Drawer](https://chakra-ui.com/docs/components/drawer) | [Sheet](https://vercel.com/geist/sheet) |
| Drawer | 2 | [Drawer](https://ui.shadcn.com/docs/components/base/drawer) | — | — | — | [Drawer](https://vercel.com/geist/drawer) |
| Destructive Action Modal | 1 | — | — | — | — | [Destructive Action Modal](https://vercel.com/geist/destructive-action-modal) |
| Floating Panel | 1 | — | — | — | [Floating Panel](https://chakra-ui.com/docs/components/floating-panel) | — |
| Overlay Manager | 1 | — | — | — | [Overlay Manager](https://chakra-ui.com/docs/components/overlay-manager) | — |
| Toggle Tip | 1 | — | — | — | [Toggle Tip](https://chakra-ui.com/docs/components/toggle-tip) | — |

### Overlays: parts of the concepts that two systems or more have
| Concept | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|
| Dialog | (root), Trigger, Content, Header, Title, Description, Footer, Close | Root, Trigger, Portal, Overlay, Content, Title, Description, Close | Root, Trigger, Content, Title, Description, Close | Root, Trigger, Backdrop, Positioner, Content, CloseTrigger, Header, Title, Body, Footer | (root), Header, Title, Subtitle, Body, Inset, Actions, Action |
| Hover Card | (root), Trigger, Content | Root, Trigger, Portal, Content, Arrow | Root, Trigger, Content | Root, Trigger, Positioner, Content, Arrow, ArrowTip, Context | one piece |
| Tooltip | (root), Trigger, Content, Provider | Provider, Root, Trigger, Portal, Content, Arrow | one piece | Root, RootProvider, Trigger, Positioner, Content, Arrow, ArrowTip | one piece |
| Popover | (root), Trigger, Content, Header, Title, Description | Root, Trigger, Anchor, Portal, Content, Close, Arrow | Root, Trigger, Content, Close | Root, Trigger, Positioner, Content, CloseTrigger, Arrow, ArrowTip, Body, Title | — |
| Alert Dialog | (root), Trigger, Content, Header, Media, Title, Description, Footer, Cancel, Action | Root, Trigger, Portal, Overlay, Content, Title, Description, Cancel, Action | Root, Trigger, Content, Title, Description, Action, Cancel | — | — |
| Sheet | (root), Trigger, Content, Header, Title, Description, Footer, Close | — | — | Root, Backdrop, Trigger, Positioner, Content, CloseTrigger, Header, Title, Body, Footer, ActionTrigger, Context | (root), Trigger, Content, Header, Title, Description, Footer, Close |
| Drawer | (root), Trigger, Content, Header, Title, Description, Footer, Close, Portal, Overlay, SwipeHandle | — | — | — | one piece |

### Disclosure: names
| Concept | In | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|---|
| Accordion | 4 | [Accordion](https://ui.shadcn.com/docs/components/base/accordion) | [Accordion](https://www.radix-ui.com/primitives/docs/components/accordion) | — | [Accordion](https://chakra-ui.com/docs/components/accordion) | [Collapse](https://vercel.com/geist/collapse) |
| Collapsible | 3 | [Collapsible](https://ui.shadcn.com/docs/components/base/collapsible) | [Collapsible](https://www.radix-ui.com/primitives/docs/components/collapsible) | — | [Collapsible](https://chakra-ui.com/docs/components/collapsible) | — |
| Show More | 1 | — | — | — | — | [Show more](https://vercel.com/geist/show-more) |

### Disclosure: parts of the concepts that two systems or more have
| Concept | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|
| Accordion | (root), Item, Trigger, Content | Root, Item, Header, Trigger, Content | — | Root, Item, ItemTrigger, ItemIndicator, ItemContent, ItemBody | Group, (root) |
| Collapsible | (root), Trigger, Content | Root, Trigger, Content | — | Root, Trigger, Indicator, Content, RootProvider, Context | — |

### Feedback and status: names
| Concept | In | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|---|
| Progress | 5 | [Progress](https://ui.shadcn.com/docs/components/base/progress) | [Progress](https://www.radix-ui.com/primitives/docs/components/progress) | [Progress](https://www.radix-ui.com/themes/docs/components/progress) | [Progress](https://chakra-ui.com/docs/components/progress) | [Progress](https://vercel.com/geist/progress) |
| Alert | 4 | [Alert](https://ui.shadcn.com/docs/components/base/alert) | — | [Callout](https://www.radix-ui.com/themes/docs/components/callout) | [Alert](https://chakra-ui.com/docs/components/alert) | [Note](https://vercel.com/geist/note) |
| Skeleton | 4 | [Skeleton](https://ui.shadcn.com/docs/components/base/skeleton) | — | [Skeleton](https://www.radix-ui.com/themes/docs/components/skeleton) | [Skeleton](https://chakra-ui.com/docs/components/skeleton) | [Skeleton](https://vercel.com/geist/skeleton) |
| Spinner | 4 | [Spinner](https://ui.shadcn.com/docs/components/base/spinner) | — | [Spinner](https://www.radix-ui.com/themes/docs/components/spinner) | [Spinner](https://chakra-ui.com/docs/components/spinner) | [Spinner](https://vercel.com/geist/spinner) |
| Toast | 4 | [Toast](https://ui.shadcn.com/docs/components/base/toast); [Sonner](https://ui.shadcn.com/docs/components/radix/sonner) | [Toast](https://www.radix-ui.com/primitives/docs/components/toast) | — | [Toast](https://chakra-ui.com/docs/components/toast) | [Toast](https://vercel.com/geist/toast) |
| Empty State | 3 | [Empty](https://ui.shadcn.com/docs/components/base/empty) | — | — | [Empty State](https://chakra-ui.com/docs/components/empty-state) | [Empty State](https://vercel.com/geist/empty-state) |
| Status | 2 | — | — | — | [Status](https://chakra-ui.com/docs/components/status) | [Status Dot](https://vercel.com/geist/status-dot) |
| Banner | 1 | — | — | — | — | [Banner](https://vercel.com/geist/banner) |
| Error | 1 | — | — | — | — | [Error](https://vercel.com/geist/error) |
| Error Card | 1 | — | — | — | — | [Error Card](https://vercel.com/geist/error-card) |
| Loading Dots | 1 | — | — | — | — | [Loading Dots](https://vercel.com/geist/loading-dots) |
| Progress Circle | 1 | — | — | — | [Progress Circle](https://chakra-ui.com/docs/components/progress-circle) | — |
| Project Banner | 1 | — | — | — | — | [Project Banner](https://vercel.com/geist/project-banner) |

### Feedback and status: parts of the concepts that two systems or more have
| Concept | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|
| Progress | (root), Label, Value, Track, Indicator | Root, Indicator | one piece | Root, Track, Range, Label, ValueText | one piece |
| Alert | (root), Icon, Title, Description, Action | — | Root, Icon, Text | Root, Indicator, Content, Title, Description | (root), Content, Label, Action |
| Skeleton | one piece | — | one piece | (root), Circle, Text | one piece |
| Spinner | one piece | — | one piece | one piece | one piece |
| Toast | Toast: er, (root); Sonner: Toaster, toast | Provider, Viewport, Root, Title, Description, Action, Close | — | er, Root, Title, Description, ActionTrigger, CloseTrigger | one piece |
| Empty State | (root), Header, Media, Title, Description, Content | — | — | Root, Content, Indicator, Title, Description | (root), Icon |
| Status | — | — | — | Root, Indicator | one piece |

### Data display: names
| Concept | In | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|---|
| Badge | 4 | [Badge](https://ui.shadcn.com/docs/components/base/badge) | — | [Badge](https://www.radix-ui.com/themes/docs/components/badge) | [Badge](https://chakra-ui.com/docs/components/badge) | [Badge](https://vercel.com/geist/badge) |
| Table | 4 | [Table](https://ui.shadcn.com/docs/components/base/table) | — | [Table](https://www.radix-ui.com/themes/docs/components/table) | [Table](https://chakra-ui.com/docs/components/table) | [Table](https://vercel.com/geist/table) |
| Code Block | 3 | [Code Block](https://ui.shadcn.com/docs/components/base/code-block) | — | — | [Code Block](https://chakra-ui.com/docs/components/code-block) | [Code Block](https://vercel.com/geist/code-block) |
| Data List | 2 | — | — | [Data List](https://www.radix-ui.com/themes/docs/components/data-list) | [DataList](https://chakra-ui.com/docs/components/data-list) | — |
| Attachment | 1 | [Attachment](https://ui.shadcn.com/docs/components/base/attachment) | — | — | — | — |
| Chart | 1 | [Chart](https://ui.shadcn.com/docs/components/base/chart) | — | — | — | — |
| Code | 1 | — | — | — | — | [Code](https://vercel.com/geist/code) |
| Color Swatch | 1 | — | — | — | [Color Swatch](https://chakra-ui.com/docs/components/color-swatch) | — |
| Data Table | 1 | [Data Table](https://ui.shadcn.com/docs/components/base/data-table) | — | — | — | — |
| File Tree | 1 | — | — | — | — | [File Tree](https://vercel.com/geist/file-tree) |
| Gauge | 1 | — | — | — | — | [Gauge](https://vercel.com/geist/gauge) |
| JSON View | 1 | — | — | — | — | [JSON View](https://vercel.com/geist/json-view) |
| Marker | 1 | [Marker](https://ui.shadcn.com/docs/components/base/marker) | — | — | — | — |
| Pie Gauge | 1 | — | — | — | — | [Pie Gauge](https://vercel.com/geist/pie-gauge) |
| QR Code | 1 | — | — | — | [QR Code](https://chakra-ui.com/docs/components/qr-code) | — |
| Snippet | 1 | — | — | — | — | [Snippet](https://vercel.com/geist/snippet) |
| Stat | 1 | — | — | — | [Stat](https://chakra-ui.com/docs/components/stat) | — |
| Tag | 1 | — | — | — | [Tag](https://chakra-ui.com/docs/components/tag) | — |
| Timeline | 1 | — | — | — | [Timeline](https://chakra-ui.com/docs/components/timeline) | — |
| Tree View | 1 | — | — | — | [TreeView](https://chakra-ui.com/docs/components/tree-view) | — |

### Data display: parts of the concepts that two systems or more have
| Concept | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|
| Badge | one piece | — | one piece | one piece | one piece |
| Table | (root), Caption, Header, Row, Head, Body, Cell, Footer | — | Root, Header, Body, Row, Cell, ColumnHeaderCell, RowHeaderCell | Root, Caption, Header, Row, ColumnHeader, Body, Cell, Footer, ScrollArea, ColumnGroup, Column | Root, (root), Colgroup, Col, Header, Row, Head, Body, Cell, Footer |
| Code Block | (root), Header, Title, Actions, CopyButton, Content, Line, Footer | — | — | AdapterProvider, Root, Header, Title, Control, CopyTrigger, CollapseTrigger, Content, Code, CodeText, CopyIndicator, CollapseIndicator, CollapseText, Overlay | one piece |
| Data List | — | — | Root, Item, Label, Value | Root, Item, ItemLabel, ItemValue | — |

### Media and icons: names
| Concept | In | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|---|
| Avatar | 5 | [Avatar](https://ui.shadcn.com/docs/components/base/avatar) | [Avatar](https://www.radix-ui.com/primitives/docs/components/avatar) | [Avatar](https://www.radix-ui.com/themes/docs/components/avatar) | [Avatar](https://chakra-ui.com/docs/components/avatar) | [Avatar](https://vercel.com/geist/avatar) |
| Carousel | 2 | [Carousel](https://ui.shadcn.com/docs/components/base/carousel) | — | — | [Carousel](https://chakra-ui.com/docs/components/carousel) | — |
| Book | 1 | — | — | — | — | [Book](https://vercel.com/geist/book) |
| Browser | 1 | — | — | — | — | [Browser](https://vercel.com/geist/browser) |
| Icon | 1 | — | — | — | [Icon](https://chakra-ui.com/docs/components/icon) | — |
| Image | 1 | — | — | — | [Image](https://chakra-ui.com/docs/components/image) | — |
| Marquee | 1 | — | — | — | [Marquee](https://chakra-ui.com/docs/components/marquee) | — |
| Phone | 1 | — | — | — | — | [Phone](https://vercel.com/geist/phone) |
| Video | 1 | — | — | — | — | [Video](https://vercel.com/geist/video) |

### Media and icons: parts of the concepts that two systems or more have
| Concept | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|
| Avatar | (root), Image, Fallback, Badge, Group, GroupCount | Root, Image, Fallback | one piece | Root, Fallback, Image, Icon, RootProvider, Group | one piece |
| Carousel | (root), Content, Item, Previous, Next | — | — | Root, RootProvider, ItemGroup, Item, Control, AutoplayTrigger, AutoplayIndicator, PrevTrigger, NextTrigger, Indicators, IndicatorGroup, Indicator, ProgressText | — |

### Date and time: names
| Concept | In | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|---|
| Calendar | 3 | [Calendar](https://ui.shadcn.com/docs/components/base/calendar) | — | — | [Calendar](https://chakra-ui.com/docs/components/calendar) | [Calendar](https://vercel.com/geist/calendar) |
| Date Picker | 2 | [Date Picker](https://ui.shadcn.com/docs/components/base/date-picker) | — | — | [Date Picker](https://chakra-ui.com/docs/components/date-picker) | — |
| Date Input | 1 | — | — | — | [Date Input](https://chakra-ui.com/docs/components/date-input) | — |
| Relative Time Card | 1 | — | — | — | — | [Relative Time Card](https://vercel.com/geist/relative-time-card) |

### Date and time: parts of the concepts that two systems or more have
| Concept | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|
| Calendar | one piece | — | — | Root, Content, View, Header, DayTable, MonthTable, YearTable | one piece |
| Date Picker | Popover, PopoverTrigger, PopoverContent, Calendar | — | — | Root, Label, Control, Input, IndicatorGroup, Trigger, Positioner, Content, View, Header, DayTable, MonthTable, YearTable | — |

### Utilities: names
| Concept | In | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|---|
| Portal | 3 | — | [Portal](https://www.radix-ui.com/primitives/docs/utilities/portal) | [Portal](https://www.radix-ui.com/themes/docs/components/portal) | [Portal](https://chakra-ui.com/docs/components/portal) | — |
| Visually Hidden | 3 | — | [Visually Hidden](https://www.radix-ui.com/primitives/docs/utilities/visually-hidden) | [Visually Hidden](https://www.radix-ui.com/themes/docs/components/visually-hidden) | [Visually Hidden](https://chakra-ui.com/docs/components/visually-hidden) | — |
| Accessible Icon | 2 | — | [Accessible Icon](https://www.radix-ui.com/primitives/docs/utilities/accessible-icon) | [Accessible Icon](https://www.radix-ui.com/themes/docs/components/accessible-icon) | — | — |
| Direction Provider | 2 | [Direction](https://ui.shadcn.com/docs/components/base/direction) | [Direction Provider](https://www.radix-ui.com/primitives/docs/utilities/direction-provider) | — | — | — |
| Slot | 2 | — | [Slot](https://www.radix-ui.com/primitives/docs/utilities/slot) | [Slot](https://www.radix-ui.com/themes/docs/components/slot) | — | — |
| Theme | 2 | — | — | [Theme](https://www.radix-ui.com/themes/docs/components/theme) | [Theme](https://chakra-ui.com/docs/components/theme) | — |
| Checkmark | 1 | — | — | — | [Checkmark](https://chakra-ui.com/docs/components/checkmark) | — |
| Client Only | 1 | — | — | — | [Client Only](https://chakra-ui.com/docs/components/client-only) | — |
| Environment Provider | 1 | — | — | — | [Environment Provider](https://chakra-ui.com/docs/components/environment-provider) | — |
| For | 1 | — | — | — | [For](https://chakra-ui.com/docs/components/for) | — |
| Format Byte | 1 | — | — | — | [Format Byte](https://chakra-ui.com/docs/components/format-byte) | — |
| Format Number | 1 | — | — | — | [Format Number](https://chakra-ui.com/docs/components/format-number) | — |
| Locale Provider | 1 | — | — | — | [Locale Provider](https://chakra-ui.com/docs/components/locale-provider) | — |
| Presence | 1 | — | — | — | [Presence](https://chakra-ui.com/docs/components/presence) | — |
| Radiomark | 1 | — | — | — | [Radiomark](https://chakra-ui.com/docs/components/radiomark) | — |
| Reset | 1 | — | — | [Reset](https://www.radix-ui.com/themes/docs/components/reset) | — | — |
| Show | 1 | — | — | — | [Show](https://chakra-ui.com/docs/components/show) | — |

### Utilities: parts of the concepts that two systems or more have
| Concept | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|
| Portal | — | one piece | one piece | one piece | — |
| Visually Hidden | — | one piece | one piece | one piece | — |
| Accessible Icon | — | one piece | one piece | — | — |
| Direction Provider | one piece | one piece | — | — | — |
| Slot | — | Root, Slottable | one piece | — | — |
| Theme | — | — | one piece | one piece | — |

### Other: names
| Concept | In | shadcn/ui | Radix Primitives | Radix Themes | Chakra UI | Geist |
|---|---|---|---|---|---|---|
| Bubble | 1 | [Bubble](https://ui.shadcn.com/docs/components/base/bubble) | — | — | — | — |
| Message | 1 | [Message](https://ui.shadcn.com/docs/components/base/message) | — | — | — | — |
| Message Scroller | 1 | [Message Scroller](https://ui.shadcn.com/docs/components/base/message-scroller) | — | — | — | — |
| Trace | 1 | [Trace](https://ui.shadcn.com/docs/components/base/trace) | — | — | — | — |

### Where the systems disagree on a name
- Bleed: Radix Themes "Inset"; Chakra UI "Bleed". Check: confirmed 1-0.
- Item: shadcn/ui "Item"; Geist "Entity". Check: confirmed 3-0.
- Resizable: shadcn/ui "Resizable"; Chakra UI "Splitter". Check: confirmed 1-0.
- Kbd: shadcn/ui "Kbd"; Radix Themes "Kbd"; Chakra UI "Kbd"; Geist "Keyboard Input". Check: confirmed 1-0.
- Copy Button: Chakra UI "Clipboard"; Geist "Copy Button". Check: confirmed 3-0.
- Radio Group: shadcn/ui "Radio Group"; Radix Primitives "Radio Group"; Radix Themes "Radio Group"; Chakra UI "Radio"; Geist "Radio". Check: confirmed 1-0.
- Switch: shadcn/ui "Switch"; Radix Primitives "Switch"; Radix Themes "Switch"; Chakra UI "Switch"; Geist "Toggle". Check: confirmed 3-0.
- Input: shadcn/ui "Input"; Radix Themes "Text Field"; Chakra UI "Input"; Geist "Input". Check: confirmed 1-0.
- Input OTP: shadcn/ui "Input OTP"; Radix Primitives "One-Time Password Field"; Chakra UI "Pin Input". Check: confirmed 1-0.
- Segmented Control: Radix Themes "Segmented Control"; Chakra UI "Segmented Control"; Geist "Switch". Check: confirmed 3-0.
- Checkbox Cards: Radix Themes "Checkbox Cards"; Chakra UI "Checkbox Card". Check: confirmed 3-0.
- Native Select: shadcn/ui "Native Select"; Chakra UI "Select (Native)". Check: confirmed 1-0.
- Password Input: Radix Primitives "Password Toggle Field"; Chakra UI "Password Input". Check: confirmed 3-0.
- Radio Cards: Radix Themes "Radio Cards"; Chakra UI "Radio Card". Check: confirmed 1-0.
- Dropdown Menu: shadcn/ui "Dropdown Menu"; Radix Primitives "Dropdown Menu"; Radix Themes "Dropdown Menu"; Chakra UI "Menu"; Geist "Menu". Check: confirmed 1-0.
- Command: shadcn/ui "Command"; Chakra UI "Command"; Geist "Command Menu". Check: confirmed 3-0.
- Breadcrumb: shadcn/ui "Breadcrumb"; Chakra UI "Breadcrumb"; Geist "Breadcrumbs". Check: confirmed 1-0.
- Dialog: shadcn/ui "Dialog"; Radix Primitives "Dialog"; Radix Themes "Dialog"; Chakra UI "Dialog"; Geist "Modal". Check: confirmed 3-0.
- Hover Card: shadcn/ui "Hover Card"; Radix Primitives "Hover Card"; Radix Themes "Hover Card"; Chakra UI "Hover Card"; Geist "Context Card". Check: confirmed 3-0.
- Sheet: shadcn/ui "Sheet"; Chakra UI "Drawer"; Geist "Sheet". Check: confirmed 1-0.
- Accordion: shadcn/ui "Accordion"; Radix Primitives "Accordion"; Chakra UI "Accordion"; Geist "Collapse". Check: confirmed 1-0.
- Alert: shadcn/ui "Alert"; Radix Themes "Callout"; Chakra UI "Alert"; Geist "Note". Check: confirmed 3-0.
- Toast: shadcn/ui "Toast", "Sonner"; Radix Primitives "Toast"; Chakra UI "Toast"; Geist "Toast". Check: confirmed 1-0.
- Empty State: shadcn/ui "Empty"; Chakra UI "Empty State"; Geist "Empty State". Check: confirmed 1-0.
- Status: Chakra UI "Status"; Geist "Status Dot". Check: confirmed 3-0.
- Direction Provider: shadcn/ui "Direction"; Radix Primitives "Direction Provider". Check: confirmed 1-0.

### Where the systems disagree on the split into parts or on the use
- Scroll Area: Radix Themes document it as one piece; shadcn/ui, Radix Primitives, Chakra UI split it into parts. the systems that split it share root, scrollbar; only Chakra UI has content. use differs: both in shadcn/ui; parts in Radix Primitives, Chakra UI; single in Radix Themes.
- Card: Radix Themes document it as one piece; shadcn/ui, Chakra UI split it into parts. the systems that split it share description, footer, header, root, title; only shadcn/ui has action, content; only Chakra UI has body. use differs: parts in shadcn/ui, Chakra UI; single in Radix Themes.
- Grid: Radix Themes document it as one piece; Chakra UI, Geist split it into parts. the systems that split it share root; only Chakra UI has item; only Geist has cell, cross, page, system. use differs: single in Radix Themes; both in Chakra UI; parts in Geist.
- Item: the systems that split it share content, root; only shadcn/ui has actions, description, footer, group, header, media, separator, title; only Geist has list.
- Resizable: the systems that split it share panel; only shadcn/ui has handle, panelgroup; only Chakra UI has resizetrigger, resizetriggerindicator, resizetriggerseparator, root.
- Kbd: Radix Themes, Geist document it as one piece; shadcn/ui, Chakra UI split it into parts. use differs: both in shadcn/ui; single in Radix Themes, Chakra UI, Geist.
- Blockquote: Radix Themes document it as one piece; Chakra UI split it into parts. use differs: single in Radix Themes; parts in Chakra UI.
- Copy Button: Geist document it as one piece; Chakra UI split it into parts. use differs: parts in Chakra UI; single in Geist.
- Checkbox: shadcn/ui, Radix Themes, Geist document it as one piece; Radix Primitives, Chakra UI split it into parts. the systems that split it share indicator, root; only Chakra UI has control, hiddeninput, label, rootprovider. use differs: single in shadcn/ui, Radix Themes, Geist; parts in Radix Primitives; both in Chakra UI.
- Radio Group: the systems that split it share root; only Radix Primitives has indicator, unstable_itembubbleinput, unstable_itemprovider, unstable_itemtrigger; only Chakra UI has itemhiddeninput, itemindicator, itemtext; only Geist has group, groupitem, useradio. use differs: parts in shadcn/ui, Radix Primitives, Radix Themes; both in Chakra UI, Geist.
- Select: Geist document it as one piece; shadcn/ui, Radix Primitives, Radix Themes, Chakra UI split it into parts. the systems that split it share content, item, label, root, trigger; only Radix Primitives has arrow, icon, itemtext, portal, scrolldownbutton, scrollupbutton, viewport; only Chakra UI has cleartrigger, control, hiddenselect, indicator, indicatorgroup, itemgroup, itemgrouplabel, positioner, valuetext. use differs: parts in shadcn/ui, Radix Primitives, Radix Themes, Chakra UI; single in Geist.
- Slider: shadcn/ui, Radix Themes, Geist document it as one piece; Radix Primitives, Chakra UI split it into parts. the systems that split it share range, root, thumb, track; only Chakra UI has control, draggingindicator, hiddeninput, label, marker, markergroup, markerindicator, markerlabel, marks, rootprovider, thumbs, valuetext. use differs: single in shadcn/ui, Radix Themes, Geist; parts in Radix Primitives; both in Chakra UI.
- Switch: shadcn/ui, Radix Themes, Geist document it as one piece; Radix Primitives, Chakra UI split it into parts. the systems that split it share root, thumb; only Chakra UI has control, hiddeninput, indicator, label, thumbindicator. use differs: single in shadcn/ui, Radix Themes, Geist; parts in Radix Primitives; both in Chakra UI.
- Input: shadcn/ui, Geist document it as one piece; Radix Themes, Chakra UI split it into parts. the systems that split it share root; only Radix Themes has slot; only Chakra UI has group. use differs: single in shadcn/ui, Chakra UI, Geist; parts in Radix Themes.
- Combobox: the systems that split it share input, root; only shadcn/ui has chip, chips, chipsinput, collection, group, separator, value; only Chakra UI has cleartrigger, control, indicatorgroup, itemgroup, itemgrouplabel, positioner, trigger; only Geist has option.
- Input OTP: the systems that split it share root; only shadcn/ui has group, separator, slot; only Chakra UI has control. use differs: parts in shadcn/ui, Radix Primitives; both in Chakra UI.
- Label: shadcn/ui, Geist document it as one piece; Radix Primitives split it into parts. use differs: single in shadcn/ui; parts in Radix Primitives; unknown in Geist.
- Segmented Control: the systems that split it share root; only Chakra UI has indicator, itemhiddeninput, items, itemtext; only Geist has control.
- Checkbox Cards: the systems that split it share root; only Radix Themes has item; only Chakra UI has addon, content, control, description, hiddeninput, indicator, label. use differs: parts in Radix Themes; both in Chakra UI.
- Field: the systems that split it share label, root; only shadcn/ui has content, description, error, group, legend, separator, set, title; only Chakra UI has erroricon, errortext, helpertext, item, requiredindicator. use differs: parts in shadcn/ui; both in Chakra UI.
- Fieldset: the systems that split it share content, root; only Chakra UI has errortext, helpertext, legend; only Geist has footer, footeraction, footeractions, footerstatus, subtitle, title.
- Native Select: the systems that split it share root; only shadcn/ui has optgroup, option; only Chakra UI has field, indicator. use differs: parts in shadcn/ui; both in Chakra UI.
- Password Input: Chakra UI document it as one piece; Radix Primitives split it into parts. use differs: parts in Radix Primitives; single in Chakra UI.
- Radio Cards: the systems that split it share item, root; only Chakra UI has itemaddon, itemcontent, itemcontrol, itemdescription, itemhiddeninput, itemindicator, itemtext, label. use differs: parts in Radix Themes; both in Chakra UI.
- Dropdown Menu: the systems that split it share item, root; only shadcn/ui has shortcut; only Radix Themes has triggericon; only Chakra UI has itemgroup, positioner, radioitemgroup; only Geist has button, container, divider, itemlocked, link, section.
- Context Menu: the systems that split it share content, item, root, trigger; only shadcn/ui has shortcut; only Radix Primitives has arrow, itemindicator, portal.
- Command: the systems that split it share input, item, list, root; only Chakra UI has cleartrigger, control, dialog, dialogbackdrop, dialogcontent, dialogtrigger, footer, indicator, itemcommand, itemgroup, itemgrouplabel, itemtext, label, loading, provider; only Geist has divider.
- Menubar: the systems that split it share checkboxitem, content, group, item, label, menu, radiogroup, radioitem, root, separator, sub, subcontent, subtrigger, trigger; only shadcn/ui has shortcut; only Radix Primitives has arrow, itemindicator, portal.
- Tabs: Geist document it as one piece; shadcn/ui, Radix Primitives, Radix Themes, Chakra UI split it into parts. the systems that split it share content, list, root, trigger; only Chakra UI has contentgroup, indicator, rootprovider. use differs: parts in shadcn/ui, Radix Primitives, Radix Themes, Chakra UI; single in Geist.
- Breadcrumb: the systems that split it share no part name; only shadcn/ui has page; only Chakra UI has currentlink; only Geist has breadcrumb, breadcrumbitem.
- Pagination: Geist document it as one piece; shadcn/ui, Chakra UI split it into parts. the systems that split it share ellipsis, item, root; only shadcn/ui has content, link, next, previous; only Chakra UI has context, items, nexttrigger, pagetext, prevtrigger. use differs: parts in shadcn/ui, Chakra UI; single in Geist.
- Navigation Menu: the systems that split it share content, indicator, item, link, list, root, trigger; only Radix Primitives has sub, viewport.
- Dialog: the systems that split it share root, title; only Radix Primitives has overlay, portal; only Chakra UI has backdrop, closetrigger, positioner; only Geist has action, actions, inset, subtitle.
- Hover Card: Geist document it as one piece; shadcn/ui, Radix Primitives, Radix Themes, Chakra UI split it into parts. the systems that split it share content, root, trigger; only Radix Primitives has portal; only Chakra UI has arrowtip, context, positioner. use differs: parts in shadcn/ui, Radix Primitives, Radix Themes, Chakra UI; single in Geist.
- Tooltip: Radix Themes, Geist document it as one piece; shadcn/ui, Radix Primitives, Chakra UI split it into parts. the systems that split it share content, root, trigger; only Radix Primitives has portal; only Chakra UI has arrowtip, positioner, rootprovider. use differs: parts in shadcn/ui, Radix Primitives; single in Radix Themes, Geist; both in Chakra UI.
- Popover: the systems that split it share content, root, trigger; only shadcn/ui has description, header; only Radix Primitives has anchor, portal; only Chakra UI has arrowtip, body, closetrigger, positioner.
- Alert Dialog: the systems that split it share action, cancel, content, description, root, title, trigger; only shadcn/ui has footer, header, media; only Radix Primitives has overlay, portal.
- Sheet: the systems that split it share content, footer, header, root, title, trigger; only Chakra UI has actiontrigger, backdrop, body, closetrigger, context, positioner.
- Drawer: Geist document it as one piece; shadcn/ui split it into parts. use differs: parts in shadcn/ui; single in Geist.
- Accordion: the systems that split it share root; only Radix Primitives has header; only Chakra UI has itembody, itemcontent, itemindicator, itemtrigger; only Geist has group. use differs: parts in shadcn/ui, Radix Primitives, Chakra UI; both in Geist.
- Collapsible: the systems that split it share content, root, trigger; only Chakra UI has context, indicator, rootprovider.
- Progress: Radix Themes, Geist document it as one piece; shadcn/ui, Radix Primitives, Chakra UI split it into parts. the systems that split it share root; only shadcn/ui has value; only Chakra UI has range, valuetext. use differs: both in shadcn/ui; parts in Radix Primitives, Chakra UI; single in Radix Themes, Geist.
- Alert: the systems that split it share root; only Radix Themes has text; only Chakra UI has indicator; only Geist has label. use differs: parts in shadcn/ui, Radix Themes, Geist; both in Chakra UI.
- Skeleton: shadcn/ui, Radix Themes, Geist document it as one piece; Chakra UI split it into parts.
- Toast: Geist document it as one piece; shadcn/ui, Radix Primitives, Chakra UI split it into parts. the systems that split it share root; only shadcn/ui has toast, toaster; only Radix Primitives has action, close, provider, viewport; only Chakra UI has actiontrigger, closetrigger. use differs: single in shadcn/ui, Geist; parts in Radix Primitives; both in Chakra UI.
- Empty State: the systems that split it share root; only shadcn/ui has header, media; only Chakra UI has indicator; only Geist has icon.
- Status: Geist document it as one piece; Chakra UI split it into parts. use differs: both in Chakra UI; single in Geist.
- Table: the systems that split it share body, cell, header, root, row; only Radix Themes has columnheadercell, rowheadercell; only Chakra UI has column, columngroup, columnheader, scrollarea; only Geist has col, colgroup.
- Code Block: Geist document it as one piece; shadcn/ui, Chakra UI split it into parts. the systems that split it share content, header, root, title; only shadcn/ui has actions, copybutton, footer, line; only Chakra UI has adapterprovider, code, codetext, collapseindicator, collapsetext, collapsetrigger, control, copyindicator, copytrigger, overlay. use differs: parts in shadcn/ui, Chakra UI; single in Geist.
- Data List: the systems that split it share item, root; only Radix Themes has label, value; only Chakra UI has itemlabel, itemvalue.
- Avatar: Radix Themes, Geist document it as one piece; shadcn/ui, Radix Primitives, Chakra UI split it into parts. the systems that split it share fallback, image, root; only shadcn/ui has badge, groupcount; only Chakra UI has icon, rootprovider. use differs: parts in shadcn/ui, Radix Primitives, Chakra UI; single in Radix Themes, Geist.
- Carousel: the systems that split it share item, root; only shadcn/ui has content, next, previous; only Chakra UI has autoplayindicator, autoplaytrigger, control, indicator, indicatorgroup, indicators, itemgroup, nexttrigger, prevtrigger, progresstext, rootprovider.
- Calendar: shadcn/ui, Geist document it as one piece; Chakra UI split it into parts. use differs: single in shadcn/ui, Geist; parts in Chakra UI.
- Date Picker: the systems that split it share no part name; only shadcn/ui has calendar, popover, popovercontent, popovertrigger; only Chakra UI has content, control, daytable, header, indicatorgroup, input, label, monthtable, positioner, root, trigger, view, yeartable.
- Portal: use differs: single in Radix Primitives, Chakra UI; unknown in Radix Themes.
- Accessible Icon: use differs: single in Radix Primitives; unknown in Radix Themes.
- Slot: Radix Themes document it as one piece; Radix Primitives split it into parts. use differs: both in Radix Primitives; unknown in Radix Themes.

Concepts in two systems or more with no such difference in the records: Separator, Aspect Ratio, Bleed, Box, Container, Flex, Code, Em, Heading, Link, Text, Button, Icon Button, Toggle, Toggle Group, Textarea, Spinner, Badge, Visually Hidden, Direction Provider, Theme.

### Matches that the check refuted or changed
These are not findings.

- Code Block (member removed, votes 0-3): Geist Code. not the same (medium): sh017, ck024 and ge014 are all block code displays. sh017 'Displays code, terminal output and diffs with ... line numbers and a copy button'; ck024 'display and highlight dynamic code blocks'; ge014's page says 'Use &lt;CodeBlock> for multi-line, syntax-highlighted source' and shows line numbers, a filename header, highlighted, added and removed lines, and a language switcher. ge013 (Geist Code) does say 'Display a snippet of code with syntax highlighting', but its only example renders `&lt;Snippet text="npm init next-app" width="300px" />`. That is a one-line shell command. Geist's Code Block page separates its own purpose from the alternatives: 'For a single inline token ... use Inline Code. Pick Snippet for a copy-to-clipboard shell command or one-line key reveal.' Geist also lists Code and Code Block as two separate components side by side. Inside the system that owns ge013, its documentation does not give it the multi-line block purpose of Code Block. The purposes overlap, but a developer would not swap one for the other.
- code (same name kept apart, votes 0-3): Code, Code Block. not the same (high): Radix Themes Code "Marks text to signify a short fragment of computer code" and Chakra Code "Used to display inline code" are inline text marks with one part each. shadcn Code Block "Displays code, terminal output and diffs with an optional header, line numbers and a copy button" and Chakra Code Block "display and highlight dynamic code blocks" (parts Header, Title, CopyTrigger, CollapseTrigger, Content) are block-level code displays. Chakra lists Code and Code Block as two separate components, so it treats them as different concepts. Inline Code and Code Block have overlapping purposes, but a developer would not use one in place of the other. Geist Code Block has a vague purpose, but its name and its use across Vercel and Next.js documentation put it in the block group.
- toggle (same name kept apart, votes 0-3): Toggle, Switch. not the same (high): The shadcn/ui and Radix Primitives Toggle records say "A two-state button that can be either on or off". That describes a pressable button that is pressed or not pressed. The Switch records describe a different control. Radix Primitives and shadcn/ui say "A control that allows the user to toggle between checked and not checked", and Radix Themes says "Toggle switch alternative to the checkbox". Chakra says "Used to capture a binary state", and its parts include Thumb, Control and HiddenInput. Those are a switch's parts. Geist's "Toggle" says "Displays a boolean value", so despite its name it belongs with the switches as a boolean form control. The two groups have related purposes, but they are not interchangeable: one is a pressed-state button and the other is a checked-state form control. Same name across systems hides the split: shadcn/Radix Toggle (button) vs. Geist Toggle (switch).
- switch (same name kept apart, votes 0-3): Segmented Control, Switch. not the same (high): The records split into two concepts. The first is a single choice from several options, a segmented control. Its purposes are "switching between different values or views" (rt039), "pick one choice from a linear set of options" (ck087) and "Choose between a set of options" (ge066, Geist's "Switch"). The parts confirm this: Item, Items and Indicator, and Radix Themes builds rt039 on the Toggle Group primitive. The second is a binary on/off control. Its purposes are "toggle between checked and not checked" (sh058, rp024), "Toggle switch alternative to the checkbox" (rt047), "capture a binary state" (ck101) and "Displays a boolean value" (ge073, Geist's "Toggle"). Its parts include Thumb and Control. Picking one of N options cannot stand in for a single boolean value, so the purposes differ. The names also cross between the groups: Geist's "Switch" is a segmented control, and Geist's "Toggle" is the binary switch. The smaller group (3 of 8) is listed as outliers.
- radio (same name kept apart, votes 0-3): Radio Group, Radio. not the same (high): sh047, rp019, rt035, ck081 and ge052 share one purpose: they let a person choose one option from a set. Their purposes say "A set of checkable buttons... no more than one ... checked at a time", "Set of interactive radio buttons where only one can be selected", "select one option from several options" and "single user input from a selection of options". Each of the five also has a group root among its parts (RadioGroup / RadioGroup.Root). The names "Radio" in Chakra UI and Geist are only a naming difference. rt033 (Radix Themes "Radio") is a different concept. Its purpose is "Standalone radio button that can be used in any layout", and it is one piece with no group. It is a single radio control, a building block of a radio group. Radix Themes lists it apart from its own Radio Group (rt035), which shows that the system itself treats them as two concepts.
- drawer (same name kept apart, votes 0-3): Drawer, Sheet. not the same (medium): The records split into two groups. Three components are side panels. shadcn/ui Sheet "extends the Dialog component to display content that complements the main content of the screen" and is built on Base UI Dialog. Geist Sheet is "a side panel that slides in from the edge of the screen". Chakra Drawer "slides in from the side of the screen" and is built on Ark UI Dialog. These three share a purpose, and Chakra's version has the same part structure (Root, Trigger, Content, Header, Title, Footer, CloseTrigger) as the Sheet parts. So Chakra's "Drawer" is the same concept as Sheet under a different name. The two other drawers are separate components with their own purpose. shadcn/ui ships both Drawer and Sheet. Its Drawer is built on Base UI Drawer, not Dialog, and has a swipe-only part, DrawerSwipeHandle, which marks it as a gesture-driven, mobile-first drawer. Geist also ships both Drawer and Sheet. Its Drawer is a single piece that is said to "display content in a separate view from the existing context", with no side-panel wording. Since each of these two systems keeps Drawer and Sheet as separate entries, their Drawer is a distinct concept that only partly overlaps with the side-panel Sheet. The smaller group is sh026 and ge025.
- Proposed by the critic and refuted (votes 0-3): Progress Circle and Gauge. not the same (low): The two components share a circular shape, but their stated purposes differ. Chakra's Progress Circle is "used to display a task's progress", meaning how far an ongoing operation has got toward completion. Geist's Gauge is "a circular visual for conveying a percentage", a general measured value such as usage or a score, with no reference to a task. That is the distinction between a progress indicator and a meter or gauge (HTML separates &lt;progress> and &lt;meter> the same way). The purposes overlap without being the same. The parts do not settle it: Chakra's Track, Range and ValueText could also render a gauge. Because I was not sure, I applied the default of false.
- Proposed by the critic and refuted (votes 0-3): Code and Code. not the same (medium): Radix Themes Code "Marks text to signify a short fragment of computer code" and Chakra UI Code is "Used to display inline code". Both are inline text markers. Geist Code says "Display a snippet of code with syntax highlighting". The live page (vercel.com/geist/code) shows the same sentence. Its only example renders `&lt;Snippet text="npm init next-app" />`, the Snippet component's copyable command display. The page never says the component is inline or that it marks a fragment within running text. Syntax highlighting and a snippet display describe a block or display role, not inline marking. That Geist also has Code Block and Snippet pages does not show that its Code is the inline form. The documentation gives no such purpose, and its example is a Snippet. Because the documented purposes differ, Geist Code is treated as the outlier.
- Proposed by the critic and refuted (votes 0-3): Tree View and File Tree. not the same (medium): The two records cover the same kind of display, but their purposes differ in scope. Chakra TreeView is a general tree component: it shows "hierarchical data structures in an expandable tree format". Its parts give it the behavior of an interactive widget: TreeView.Branch, BranchControl, BranchTrigger, BranchIndentGuide, Item, NodeCheckbox and NodeProvider, built on Ark UI. Geist File Tree has a narrower purpose: it shows "a hierarchical directory structure with expandable folders and files". The record says it is "useful for illustrating project layouts", which is a documentation use. Its parts (Tree, Folder, File) are named for files and folders, not for general nodes, and nothing in them provides checkboxes or a general node structure. Read this way, File Tree is a special form of a tree view, limited to files and folders and meant for illustration, so the two purposes only overlap. The other agent's reading is still possible: if the file-and-folder focus is only an example, File Tree is simply a smaller version of the same concept. The records alone do not settle the question, so I followed the instruction to answer false when unsure. The two components form groups of one each, so I chose ge032, the narrower one, as the outlier.
- Proposed by the critic and refuted (votes 0-3): Choicebox and Radio Cards. not the same (medium): Two of the components are single-selection only. Radix Themes Radio Cards says "only one can be selected at a time" and is built on the Radix Primitives Radio Group. Chakra UI Radio Card says "select an option from list" and is built on the Ark UI Radio Group. Geist Choicebox is "a larger form of Radio or Checkbox", so it covers both single and multiple selection in one component. Radix Themes splits these purposes: it has Checkbox Cards as a separate component for multiple selection. Choicebox's purpose therefore only overlaps the other two. It matches them in its single-selection form and also covers the purpose of a checkbox card. The other agent's reason itself depends on "in its single-selection form". Under the rules, a partial overlap of purpose makes a different concept.
- Proposed by the critic and refuted (votes 0-3): Choicebox and Checkbox Cards. not the same (medium): Radix Themes Checkbox Cards ("Set of interactive cards where multiple options can be selected at a time") and Chakra UI Checkbox Card ("Used to select or deselect options displayed within cards", built on Ark UI Checkbox) are both the checkbox form only, with multiple selection. Geist Choicebox is "A larger form of Radio or Checkbox". It covers single selection (radio) and multiple selection (checkbox) in one component. Radix Themes and Chakra UI give single selection to a separate component (Radio Cards / Radio Card). So the purposes of Choicebox and the checkbox cards overlap but are not the same: Choicebox also covers what Radio Cards cover. Under the given rule, an overlap of purposes makes a different concept. rt012 and ck018 are the same concept.
- Proposed by the critic and refuted (votes 0-3): Scroll Area and Scroller. not the same (medium): Four records give the same purpose: a scrollable area with custom-styled scrollbars. sh049 and rp020 say "Augments native scroll functionality for custom, cross-browser styling". rt037 says "Custom-styled scrollable area using native functionality". ck086 says "scrollable area with custom styled scrollbars". Their parts are about the scrollbar (ScrollBar/Scrollbar, Thumb, Corner, Viewport). Geist Scroller ge054 has a different purpose: "Display an overflowing list of items." That is a container for showing a list of items that overflows. It says nothing about styling the scrollbar, and it has no scrollbar, thumb or viewport parts. The two purposes overlap (both scroll overflowing content), but they are not the same, so a developer could not count on one replacing the other. Even the other agent was unsure, because the Scroller page talks about a list of items and not about custom scrollbar styling.

## Findings
- The concept "Separator" is in 5 of the five systems: shadcn/ui as "Separator" (https://ui.shadcn.com/docs/components/base/separator); Radix Primitives as "Separator" (https://www.radix-ui.com/primitives/docs/components/separator); Radix Themes as "Separator" (https://www.radix-ui.com/themes/docs/components/separator); Chakra UI as "Separator" (https://chakra-ui.com/docs/components/separator); Geist as "Separator" (https://vercel.com/geist/separator). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Aspect Ratio" is in 4 of the five systems: shadcn/ui as "Aspect Ratio" (https://ui.shadcn.com/docs/components/base/aspect-ratio); Radix Primitives as "Aspect Ratio" (https://www.radix-ui.com/primitives/docs/components/aspect-ratio); Radix Themes as "Aspect Ratio" (https://www.radix-ui.com/themes/docs/components/aspect-ratio); Chakra UI as "Aspect Ratio" (https://chakra-ui.com/docs/components/aspect-ratio). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Scroll Area" is in 4 of the five systems: shadcn/ui as "Scroll Area" (https://ui.shadcn.com/docs/components/base/scroll-area); Radix Primitives as "Scroll Area" (https://www.radix-ui.com/primitives/docs/components/scroll-area); Radix Themes as "Scroll Area" (https://www.radix-ui.com/themes/docs/components/scroll-area); Chakra UI as "Scroll Area" (https://chakra-ui.com/docs/components/scroll-area). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Card" is in 3 of the five systems: shadcn/ui as "Card" (https://ui.shadcn.com/docs/components/base/card); Radix Themes as "Card" (https://www.radix-ui.com/themes/docs/components/card); Chakra UI as "Card" (https://chakra-ui.com/docs/components/card). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Grid" is in 3 of the five systems: Radix Themes as "Grid" (https://www.radix-ui.com/themes/docs/components/grid); Chakra UI as "Grid" (https://chakra-ui.com/docs/components/grid); Geist as "Grid" (https://vercel.com/geist/grid). Match: same name. Source: docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Bleed" is in 2 of the five systems: Radix Themes as "Inset" (https://www.radix-ui.com/themes/docs/components/inset); Chakra UI as "Bleed" (https://chakra-ui.com/docs/components/bleed). Match: confirmed 1-0. Reason of the matching agent: Inset and Bleed both let content break out of its container's padding or boundaries. Source: docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Box" is in 2 of the five systems: Radix Themes as "Box" (https://www.radix-ui.com/themes/docs/components/box); Chakra UI as "Box" (https://chakra-ui.com/docs/components/box). Match: same name. Source: docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Container" is in 2 of the five systems: Radix Themes as "Container" (https://www.radix-ui.com/themes/docs/components/container); Chakra UI as "Container" (https://chakra-ui.com/docs/components/container). Match: same name. Source: docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Flex" is in 2 of the five systems: Radix Themes as "Flex" (https://www.radix-ui.com/themes/docs/components/flex); Chakra UI as "Flex" (https://chakra-ui.com/docs/components/flex). Match: same name. Source: docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Item" is in 2 of the five systems: shadcn/ui as "Item" (https://ui.shadcn.com/docs/components/base/item); Geist as "Entity" (https://vercel.com/geist/entity). Match: confirmed 3-0. Reason of the matching agent: Item and Entity both lay out a row of content with related actions beside it. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Resizable" is in 2 of the five systems: shadcn/ui as "Resizable" (https://ui.shadcn.com/docs/components/base/resizable); Chakra UI as "Splitter" (https://chakra-ui.com/docs/components/splitter). Match: confirmed 1-0. Reason of the matching agent: Resizable and Splitter both provide panels that the user resizes by dragging a handle. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Kbd" is in 4 of the five systems: shadcn/ui as "Kbd" (https://ui.shadcn.com/docs/components/base/kbd); Radix Themes as "Kbd" (https://www.radix-ui.com/themes/docs/components/kbd); Chakra UI as "Kbd" (https://chakra-ui.com/docs/components/kbd); Geist as "Keyboard Input" (https://vercel.com/geist/keyboard-input). Match: confirmed 1-0. Reason of the matching agent: Geist's Keyboard Input displays keyboard input, the same purpose as Kbd. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Blockquote" is in 2 of the five systems: Radix Themes as "Blockquote" (https://www.radix-ui.com/themes/docs/components/blockquote); Chakra UI as "Blockquote" (https://chakra-ui.com/docs/components/blockquote). Match: same name. Source: docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Code" is in 2 of the five systems: Radix Themes as "Code" (https://www.radix-ui.com/themes/docs/components/code); Chakra UI as "Code" (https://chakra-ui.com/docs/components/code). Match: same name. Source: docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Em" is in 2 of the five systems: Radix Themes as "Em" (https://www.radix-ui.com/themes/docs/components/em); Chakra UI as "Em" (https://chakra-ui.com/docs/components/em). Match: same name. Source: docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Heading" is in 2 of the five systems: Radix Themes as "Heading" (https://www.radix-ui.com/themes/docs/components/heading); Chakra UI as "Heading" (https://chakra-ui.com/docs/components/heading). Match: same name. Source: docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Link" is in 2 of the five systems: Radix Themes as "Link" (https://www.radix-ui.com/themes/docs/components/link); Chakra UI as "Link" (https://chakra-ui.com/docs/components/link). Match: same name. Source: docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Text" is in 2 of the five systems: Radix Themes as "Text" (https://www.radix-ui.com/themes/docs/components/text); Chakra UI as "Text" (https://chakra-ui.com/docs/components/text). Match: same name. Source: docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Button" is in 4 of the five systems: shadcn/ui as "Button" (https://ui.shadcn.com/docs/components/base/button); Radix Themes as "Button" (https://www.radix-ui.com/themes/docs/components/button); Chakra UI as "Button" (https://chakra-ui.com/docs/components/button); Geist as "Button" (https://vercel.com/geist/button). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Copy Button" is in 2 of the five systems: Chakra UI as "Clipboard" (https://chakra-ui.com/docs/components/clipboard); Geist as "Copy Button" (https://vercel.com/geist/copy-button). Match: confirmed 3-0. Reason of the matching agent: Chakra's Clipboard and Geist's Copy Button both copy a given value to the clipboard and show feedback. Source: docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Icon Button" is in 2 of the five systems: Radix Themes as "Icon Button" (https://www.radix-ui.com/themes/docs/components/icon-button); Chakra UI as "Icon Button" (https://chakra-ui.com/docs/components/icon-button). Match: same name. Source: docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Toggle" is in 2 of the five systems: shadcn/ui as "Toggle" (https://ui.shadcn.com/docs/components/base/toggle); Radix Primitives as "Toggle" (https://www.radix-ui.com/primitives/docs/components/toggle). Match: same name. Reason of the matching agent: Geist's Toggle, despite the same name, is a boolean switch control and sits with Switch. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md, checked 2026-11-12.
- The concept "Toggle Group" is in 2 of the five systems: shadcn/ui as "Toggle Group" (https://ui.shadcn.com/docs/components/base/toggle-group); Radix Primitives as "Toggle Group" (https://www.radix-ui.com/primitives/docs/components/toggle-group). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md, checked 2026-11-12.
- The concept "Checkbox" is in 5 of the five systems: shadcn/ui as "Checkbox" (https://ui.shadcn.com/docs/components/base/checkbox); Radix Primitives as "Checkbox" (https://www.radix-ui.com/primitives/docs/components/checkbox); Radix Themes as "Checkbox" (https://www.radix-ui.com/themes/docs/components/checkbox); Chakra UI as "Checkbox" (https://chakra-ui.com/docs/components/checkbox); Geist as "Checkbox" (https://vercel.com/geist/checkbox). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Radio Group" is in 5 of the five systems: shadcn/ui as "Radio Group" (https://ui.shadcn.com/docs/components/base/radio-group); Radix Primitives as "Radio Group" (https://www.radix-ui.com/primitives/docs/components/radio-group); Radix Themes as "Radio Group" (https://www.radix-ui.com/themes/docs/components/radio-group); Chakra UI as "Radio" (https://chakra-ui.com/docs/components/radio); Geist as "Radio" (https://vercel.com/geist/radio). Match: confirmed 1-0. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Select" is in 5 of the five systems: shadcn/ui as "Select" (https://ui.shadcn.com/docs/components/base/select); Radix Primitives as "Select" (https://www.radix-ui.com/primitives/docs/components/select); Radix Themes as "Select" (https://www.radix-ui.com/themes/docs/components/select); Chakra UI as "Select" (https://chakra-ui.com/docs/components/select); Geist as "Select" (https://vercel.com/geist/select). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Slider" is in 5 of the five systems: shadcn/ui as "Slider" (https://ui.shadcn.com/docs/components/base/slider); Radix Primitives as "Slider" (https://www.radix-ui.com/primitives/docs/components/slider); Radix Themes as "Slider" (https://www.radix-ui.com/themes/docs/components/slider); Chakra UI as "Slider" (https://chakra-ui.com/docs/components/slider); Geist as "Slider" (https://vercel.com/geist/slider). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Switch" is in 5 of the five systems: shadcn/ui as "Switch" (https://ui.shadcn.com/docs/components/base/switch); Radix Primitives as "Switch" (https://www.radix-ui.com/primitives/docs/components/switch); Radix Themes as "Switch" (https://www.radix-ui.com/themes/docs/components/switch); Chakra UI as "Switch" (https://chakra-ui.com/docs/components/switch); Geist as "Toggle" (https://vercel.com/geist/toggle). Match: confirmed 3-0. Reason of the matching agent: Geist's Toggle displays and sets a boolean value, the purpose of Switch. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Input" is in 4 of the five systems: shadcn/ui as "Input" (https://ui.shadcn.com/docs/components/base/input); Radix Themes as "Text Field" (https://www.radix-ui.com/themes/docs/components/text-field); Chakra UI as "Input" (https://chakra-ui.com/docs/components/input); Geist as "Input" (https://vercel.com/geist/input). Match: confirmed 1-0. Reason of the matching agent: Radix Themes' Text Field is a single-line text input. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Textarea" is in 4 of the five systems: shadcn/ui as "Textarea" (https://ui.shadcn.com/docs/components/base/textarea); Radix Themes as "Text Area" (https://www.radix-ui.com/themes/docs/components/text-area); Chakra UI as "Textarea" (https://chakra-ui.com/docs/components/textarea); Geist as "Textarea" (https://vercel.com/geist/textarea). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Combobox" is in 3 of the five systems: shadcn/ui as "Combobox" (https://ui.shadcn.com/docs/components/base/combobox); Chakra UI as "Combobox" (https://chakra-ui.com/docs/components/combobox); Geist as "Combobox" (https://vercel.com/geist/combobox). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Input OTP" is in 3 of the five systems: shadcn/ui as "Input OTP" (https://ui.shadcn.com/docs/components/base/input-otp); Radix Primitives as "One-Time Password Field" (https://www.radix-ui.com/primitives/docs/components/one-time-password-field); Chakra UI as "Pin Input" (https://chakra-ui.com/docs/components/pin-input). Match: confirmed 1-0. Reason of the matching agent: One-Time Password Field and Pin Input both capture a one-time code in single-character inputs. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Label" is in 3 of the five systems: shadcn/ui as "Label" (https://ui.shadcn.com/docs/components/base/label); Radix Primitives as "Label" (https://www.radix-ui.com/primitives/docs/components/label); Geist as "Label" (https://vercel.com/geist/label). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Segmented Control" is in 3 of the five systems: Radix Themes as "Segmented Control" (https://www.radix-ui.com/themes/docs/components/segmented-control); Chakra UI as "Segmented Control" (https://chakra-ui.com/docs/components/segmented-control); Geist as "Switch" (https://vercel.com/geist/switch). Match: confirmed 3-0. Reason of the matching agent: Geist's Switch picks one of a set of options, which is the purpose of Segmented Control, not a binary switch. Source: docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Checkbox Cards" is in 2 of the five systems: Radix Themes as "Checkbox Cards" (https://www.radix-ui.com/themes/docs/components/checkbox-cards); Chakra UI as "Checkbox Card" (https://chakra-ui.com/docs/components/checkbox-card). Match: confirmed 3-0. Source: docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Field" is in 2 of the five systems: shadcn/ui as "Field" (https://ui.shadcn.com/docs/components/base/field); Chakra UI as "Field" (https://chakra-ui.com/docs/components/field). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Fieldset" is in 2 of the five systems: Chakra UI as "Fieldset" (https://chakra-ui.com/docs/components/fieldset); Geist as "Fieldset" (https://vercel.com/geist/fieldset). Match: same name. Source: docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Native Select" is in 2 of the five systems: shadcn/ui as "Native Select" (https://ui.shadcn.com/docs/components/base/native-select); Chakra UI as "Select (Native)" (https://chakra-ui.com/docs/components/native-select). Match: confirmed 1-0. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Password Input" is in 2 of the five systems: Radix Primitives as "Password Toggle Field" (https://www.radix-ui.com/primitives/docs/components/password-toggle-field); Chakra UI as "Password Input" (https://chakra-ui.com/docs/components/password-input). Match: confirmed 3-0. Reason of the matching agent: Password Toggle Field and Password Input both collect a password. Source: docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Radio Cards" is in 2 of the five systems: Radix Themes as "Radio Cards" (https://www.radix-ui.com/themes/docs/components/radio-cards); Chakra UI as "Radio Card" (https://chakra-ui.com/docs/components/radio-card). Match: confirmed 1-0. Source: docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Dropdown Menu" is in 5 of the five systems: shadcn/ui as "Dropdown Menu" (https://ui.shadcn.com/docs/components/base/dropdown-menu); Radix Primitives as "Dropdown Menu" (https://www.radix-ui.com/primitives/docs/components/dropdown-menu); Radix Themes as "Dropdown Menu" (https://www.radix-ui.com/themes/docs/components/dropdown-menu); Chakra UI as "Menu" (https://chakra-ui.com/docs/components/menu); Geist as "Menu" (https://vercel.com/geist/menu). Match: confirmed 1-0. Reason of the matching agent: Chakra's and Geist's Menu are menus opened from a button, the purpose of Dropdown Menu. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Context Menu" is in 4 of the five systems: shadcn/ui as "Context Menu" (https://ui.shadcn.com/docs/components/base/context-menu); Radix Primitives as "Context Menu" (https://www.radix-ui.com/primitives/docs/components/context-menu); Radix Themes as "Context Menu" (https://www.radix-ui.com/themes/docs/components/context-menu); Geist as "Context Menu" (https://vercel.com/geist/context-menu). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Command" is in 3 of the five systems: shadcn/ui as "Command" (https://ui.shadcn.com/docs/components/base/command); Chakra UI as "Command" (https://chakra-ui.com/docs/components/command); Geist as "Command Menu" (https://vercel.com/geist/command-menu). Match: confirmed 3-0. Reason of the matching agent: Geist's Command Menu is a searchable command palette, the purpose of Command. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Menubar" is in 2 of the five systems: shadcn/ui as "Menubar" (https://ui.shadcn.com/docs/components/base/menubar); Radix Primitives as "Menu Bar" (https://www.radix-ui.com/primitives/docs/components/menubar). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md, checked 2026-11-12.
- The concept "Tabs" is in 5 of the five systems: shadcn/ui as "Tabs" (https://ui.shadcn.com/docs/components/base/tabs); Radix Primitives as "Tabs" (https://www.radix-ui.com/primitives/docs/components/tabs); Radix Themes as "Tabs" (https://www.radix-ui.com/themes/docs/components/tabs); Chakra UI as "Tabs" (https://chakra-ui.com/docs/components/tabs); Geist as "Tabs" (https://vercel.com/geist/tabs). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Breadcrumb" is in 3 of the five systems: shadcn/ui as "Breadcrumb" (https://ui.shadcn.com/docs/components/base/breadcrumb); Chakra UI as "Breadcrumb" (https://chakra-ui.com/docs/components/breadcrumb); Geist as "Breadcrumbs" (https://vercel.com/geist/breadcrumbs). Match: confirmed 1-0. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Pagination" is in 3 of the five systems: shadcn/ui as "Pagination" (https://ui.shadcn.com/docs/components/base/pagination); Chakra UI as "Pagination" (https://chakra-ui.com/docs/components/pagination); Geist as "Pagination" (https://vercel.com/geist/pagination). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Navigation Menu" is in 2 of the five systems: shadcn/ui as "Navigation Menu" (https://ui.shadcn.com/docs/components/base/navigation-menu); Radix Primitives as "Navigation Menu" (https://www.radix-ui.com/primitives/docs/components/navigation-menu). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md, checked 2026-11-12.
- The concept "Dialog" is in 5 of the five systems: shadcn/ui as "Dialog" (https://ui.shadcn.com/docs/components/base/dialog); Radix Primitives as "Dialog" (https://www.radix-ui.com/primitives/docs/components/dialog); Radix Themes as "Dialog" (https://www.radix-ui.com/themes/docs/components/dialog); Chakra UI as "Dialog" (https://chakra-ui.com/docs/components/dialog); Geist as "Modal" (https://vercel.com/geist/modal). Match: confirmed 3-0. Reason of the matching agent: Geist's Modal is a popup window over the page, the purpose of Dialog. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Hover Card" is in 5 of the five systems: shadcn/ui as "Hover Card" (https://ui.shadcn.com/docs/components/base/hover-card); Radix Primitives as "Hover Card" (https://www.radix-ui.com/primitives/docs/components/hover-card); Radix Themes as "Hover Card" (https://www.radix-ui.com/themes/docs/components/hover-card); Chakra UI as "Hover Card" (https://chakra-ui.com/docs/components/hover-card); Geist as "Context Card" (https://vercel.com/geist/context-card). Match: confirmed 3-0. Reason of the matching agent: Geist's Context Card is a floating card shown on hover or focus, the purpose of Hover Card. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Tooltip" is in 5 of the five systems: shadcn/ui as "Tooltip" (https://ui.shadcn.com/docs/components/base/tooltip); Radix Primitives as "Tooltip" (https://www.radix-ui.com/primitives/docs/components/tooltip); Radix Themes as "Tooltip" (https://www.radix-ui.com/themes/docs/components/tooltip); Chakra UI as "Tooltip" (https://chakra-ui.com/docs/components/tooltip); Geist as "Tooltip" (https://vercel.com/geist/tooltip). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Popover" is in 4 of the five systems: shadcn/ui as "Popover" (https://ui.shadcn.com/docs/components/base/popover); Radix Primitives as "Popover" (https://www.radix-ui.com/primitives/docs/components/popover); Radix Themes as "Popover" (https://www.radix-ui.com/themes/docs/components/popover); Chakra UI as "Popover" (https://chakra-ui.com/docs/components/popover). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Alert Dialog" is in 3 of the five systems: shadcn/ui as "Alert Dialog" (https://ui.shadcn.com/docs/components/base/alert-dialog); Radix Primitives as "Alert Dialog" (https://www.radix-ui.com/primitives/docs/components/alert-dialog); Radix Themes as "Alert Dialog" (https://www.radix-ui.com/themes/docs/components/alert-dialog). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md, checked 2026-11-12.
- The concept "Sheet" is in 3 of the five systems: shadcn/ui as "Sheet" (https://ui.shadcn.com/docs/components/base/sheet); Chakra UI as "Drawer" (https://chakra-ui.com/docs/components/drawer); Geist as "Sheet" (https://vercel.com/geist/sheet). Match: confirmed 1-0. Reason of the matching agent: Chakra's Drawer slides content in from a side of the screen, the purpose of Sheet in shadcn/ui and Geist. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Drawer" is in 2 of the five systems: shadcn/ui as "Drawer" (https://ui.shadcn.com/docs/components/base/drawer); Geist as "Drawer" (https://vercel.com/geist/drawer). Match: same name. Reason of the matching agent: shadcn/ui and Geist each keep Drawer apart from their own Sheet. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Accordion" is in 4 of the five systems: shadcn/ui as "Accordion" (https://ui.shadcn.com/docs/components/base/accordion); Radix Primitives as "Accordion" (https://www.radix-ui.com/primitives/docs/components/accordion); Chakra UI as "Accordion" (https://chakra-ui.com/docs/components/accordion); Geist as "Collapse" (https://vercel.com/geist/collapse). Match: confirmed 1-0. Reason of the matching agent: Geist's Collapse is a stacked set of headings that each reveal a section, the purpose of Accordion. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Collapsible" is in 3 of the five systems: shadcn/ui as "Collapsible" (https://ui.shadcn.com/docs/components/base/collapsible); Radix Primitives as "Collapsible" (https://www.radix-ui.com/primitives/docs/components/collapsible); Chakra UI as "Collapsible" (https://chakra-ui.com/docs/components/collapsible). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Progress" is in 5 of the five systems: shadcn/ui as "Progress" (https://ui.shadcn.com/docs/components/base/progress); Radix Primitives as "Progress" (https://www.radix-ui.com/primitives/docs/components/progress); Radix Themes as "Progress" (https://www.radix-ui.com/themes/docs/components/progress); Chakra UI as "Progress" (https://chakra-ui.com/docs/components/progress); Geist as "Progress" (https://vercel.com/geist/progress). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Alert" is in 4 of the five systems: shadcn/ui as "Alert" (https://ui.shadcn.com/docs/components/base/alert); Radix Themes as "Callout" (https://www.radix-ui.com/themes/docs/components/callout); Chakra UI as "Alert" (https://chakra-ui.com/docs/components/alert); Geist as "Note" (https://vercel.com/geist/note). Match: confirmed 3-0. Reason of the matching agent: Radix Themes' Callout and Geist's Note both show an inline message that calls for attention. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Skeleton" is in 4 of the five systems: shadcn/ui as "Skeleton" (https://ui.shadcn.com/docs/components/base/skeleton); Radix Themes as "Skeleton" (https://www.radix-ui.com/themes/docs/components/skeleton); Chakra UI as "Skeleton" (https://chakra-ui.com/docs/components/skeleton); Geist as "Skeleton" (https://vercel.com/geist/skeleton). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Spinner" is in 4 of the five systems: shadcn/ui as "Spinner" (https://ui.shadcn.com/docs/components/base/spinner); Radix Themes as "Spinner" (https://www.radix-ui.com/themes/docs/components/spinner); Chakra UI as "Spinner" (https://chakra-ui.com/docs/components/spinner); Geist as "Spinner" (https://vercel.com/geist/spinner). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Toast" is in 4 of the five systems: shadcn/ui as "Toast" (https://ui.shadcn.com/docs/components/base/toast), "Sonner" (https://ui.shadcn.com/docs/components/radix/sonner); Radix Primitives as "Toast" (https://www.radix-ui.com/primitives/docs/components/toast); Chakra UI as "Toast" (https://chakra-ui.com/docs/components/toast); Geist as "Toast" (https://vercel.com/geist/toast). Match: confirmed 1-0. Reason of the matching agent: shadcn/ui's Sonner is another toast with the same purpose as its Toast. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Empty State" is in 3 of the five systems: shadcn/ui as "Empty" (https://ui.shadcn.com/docs/components/base/empty); Chakra UI as "Empty State" (https://chakra-ui.com/docs/components/empty-state); Geist as "Empty State" (https://vercel.com/geist/empty-state). Match: confirmed 1-0. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Status" is in 2 of the five systems: Chakra UI as "Status" (https://chakra-ui.com/docs/components/status); Geist as "Status Dot" (https://vercel.com/geist/status-dot). Match: confirmed 3-0. Reason of the matching agent: Status and Status Dot both show a state indicator; Geist names its use for deployments. Source: docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Badge" is in 4 of the five systems: shadcn/ui as "Badge" (https://ui.shadcn.com/docs/components/base/badge); Radix Themes as "Badge" (https://www.radix-ui.com/themes/docs/components/badge); Chakra UI as "Badge" (https://chakra-ui.com/docs/components/badge); Geist as "Badge" (https://vercel.com/geist/badge). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Table" is in 4 of the five systems: shadcn/ui as "Table" (https://ui.shadcn.com/docs/components/base/table); Radix Themes as "Table" (https://www.radix-ui.com/themes/docs/components/table); Chakra UI as "Table" (https://chakra-ui.com/docs/components/table); Geist as "Table" (https://vercel.com/geist/table). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Code Block" is in 3 of the five systems: shadcn/ui as "Code Block" (https://ui.shadcn.com/docs/components/base/code-block); Chakra UI as "Code Block" (https://chakra-ui.com/docs/components/code-block); Geist as "Code Block" (https://vercel.com/geist/code-block). Match: confirmed after 1 removed, votes 0-3. Reason of the matching agent: Geist's Code shows a syntax-highlighted snippet of code, the purpose of Code Block, not of inline Code. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Data List" is in 2 of the five systems: Radix Themes as "Data List" (https://www.radix-ui.com/themes/docs/components/data-list); Chakra UI as "DataList" (https://chakra-ui.com/docs/components/data-list). Match: same name. Source: docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Avatar" is in 5 of the five systems: shadcn/ui as "Avatar" (https://ui.shadcn.com/docs/components/base/avatar); Radix Primitives as "Avatar" (https://www.radix-ui.com/primitives/docs/components/avatar); Radix Themes as "Avatar" (https://www.radix-ui.com/themes/docs/components/avatar); Chakra UI as "Avatar" (https://chakra-ui.com/docs/components/avatar); Geist as "Avatar" (https://vercel.com/geist/avatar). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Carousel" is in 2 of the five systems: shadcn/ui as "Carousel" (https://ui.shadcn.com/docs/components/base/carousel); Chakra UI as "Carousel" (https://chakra-ui.com/docs/components/carousel). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Calendar" is in 3 of the five systems: shadcn/ui as "Calendar" (https://ui.shadcn.com/docs/components/base/calendar); Chakra UI as "Calendar" (https://chakra-ui.com/docs/components/calendar); Geist as "Calendar" (https://vercel.com/geist/calendar). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-035-components-of-chakra-ui.md and docs/research/RES-036-components-of-geist.md, checked 2026-11-12.
- The concept "Date Picker" is in 2 of the five systems: shadcn/ui as "Date Picker" (https://ui.shadcn.com/docs/components/base/date-picker); Chakra UI as "Date Picker" (https://chakra-ui.com/docs/components/date-picker). Match: same name. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Portal" is in 3 of the five systems: Radix Primitives as "Portal" (https://www.radix-ui.com/primitives/docs/utilities/portal); Radix Themes as "Portal" (https://www.radix-ui.com/themes/docs/components/portal); Chakra UI as "Portal" (https://chakra-ui.com/docs/components/portal). Match: same name. Source: docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Visually Hidden" is in 3 of the five systems: Radix Primitives as "Visually Hidden" (https://www.radix-ui.com/primitives/docs/utilities/visually-hidden); Radix Themes as "Visually Hidden" (https://www.radix-ui.com/themes/docs/components/visually-hidden); Chakra UI as "Visually Hidden" (https://chakra-ui.com/docs/components/visually-hidden). Match: same name. Source: docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- The concept "Accessible Icon" is in 2 of the five systems: Radix Primitives as "Accessible Icon" (https://www.radix-ui.com/primitives/docs/utilities/accessible-icon); Radix Themes as "Accessible Icon" (https://www.radix-ui.com/themes/docs/components/accessible-icon). Match: same name. Source: docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md, checked 2026-11-12.
- The concept "Direction Provider" is in 2 of the five systems: shadcn/ui as "Direction" (https://ui.shadcn.com/docs/components/base/direction); Radix Primitives as "Direction Provider" (https://www.radix-ui.com/primitives/docs/utilities/direction-provider). Match: confirmed 1-0. Source: docs/research/RES-032-components-of-shadcn-ui.md and docs/research/RES-033-components-of-radix-primitives.md, checked 2026-11-12.
- The concept "Slot" is in 2 of the five systems: Radix Primitives as "Slot" (https://www.radix-ui.com/primitives/docs/utilities/slot); Radix Themes as "Slot" (https://www.radix-ui.com/themes/docs/components/slot). Match: same name. Source: docs/research/RES-033-components-of-radix-primitives.md and docs/research/RES-034-components-of-radix-themes.md, checked 2026-11-12.
- The concept "Theme" is in 2 of the five systems: Radix Themes as "Theme" (https://www.radix-ui.com/themes/docs/components/theme); Chakra UI as "Theme" (https://chakra-ui.com/docs/components/theme). Match: same name. Source: docs/research/RES-034-components-of-radix-themes.md and docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- shadcn/ui has 12 concepts that no other of the five systems has: Sidebar, Button Group, Input Group, Questionnaire, Attachment, Chart, Data Table, Marker, Bubble, Message, Message Scroller, Trace. Source: docs/research/RES-032-components-of-shadcn-ui.md, checked 2026-11-12.
- Radix Primitives has 2 concepts that no other of the five systems has: Toolbar, Form. Source: docs/research/RES-033-components-of-radix-primitives.md, checked 2026-11-12.
- Radix Themes has 7 concepts that no other of the five systems has: Section, Quote, Strong, Checkbox Group, Radio, Tab Nav, Reset. Source: docs/research/RES-034-components-of-radix-themes.md, checked 2026-11-12.
- Chakra UI has 49 concepts that no other of the five systems has: AbsoluteCenter, Center, Float, Group, SimpleGrid, Stack, Wrap, Highlight, Link Overlay, List, Mark, Prose, Action Bar, Close Button, Download Trigger, Color Picker, Editable, File Upload, Listbox, Number Input, Rating, Rich Text Editor, Tags Input, Skip Nav, Steps, Floating Panel, Overlay Manager, Toggle Tip, Progress Circle, Color Swatch, QR Code, Stat, Tag, Timeline, TreeView, Icon, Image, Marquee, Date Input, Checkmark, Client Only, Environment Provider, For, Format Byte, Format Number, Locale Provider, Presence, Radiomark, Show. Source: docs/research/RES-035-components-of-chakra-ui.md, checked 2026-11-12.
- Geist has 34 concepts that no other of the five systems has: Scroller, Description, MiddleTruncate, Load More Button, Split Button, Text With Copy Button, Address Input, Choicebox, Clearable Input, Destructive Confirmation Input, Feedback, Filter Params, Multi Select, Search Input, Theme Switcher, Dots Menu, Destructive Action Modal, Show more, Banner, Error, Error Card, Loading Dots, Project Banner, Code, File Tree, Gauge, JSON View, Pie Gauge, Snippet, Book, Browser, Phone, Video, Relative Time Card. Source: docs/research/RES-036-components-of-geist.md, checked 2026-11-12.

## Follow-ups
- The React Aria variant of the shadcn/ui pages was not read. Does it change a part list?
- The catalogs beside the components (blocks, charts, AI elements, patterns) are listed in the inventories and are not in this matrix. IDEA-001#04 can use them.
- The matching is by purpose as the documentation states it. A person has not read the matches.

## Next action
None.
