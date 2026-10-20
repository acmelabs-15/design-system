# Component library

The reusable elements and documented arrangements that give artifacts a consistent design language. Related tooling terms live in the context linked from [the context map](CONTEXT-MAP.md).

## Language

### Building blocks and interfaces

**Component**:
A reusable part of the design system with a defined purpose and a consistent interface.
_Avoid_: Widget as a competing name for a component.

**Primitive**:
A shared building block from which other components and recipes are composed.
_Avoid_: A second name for the same building block in each consuming component.

**Recipe**:
A documented arrangement of shared components for a particular use. A recipe can contain optional content and different sizes.
_Avoid_: Treating a recipe as a separate component; confusing this meaning with another system's style configuration called a recipe.

**Variant**:
The visual treatment of a component.
_Avoid_: Type for a visual treatment.

**Type**:
The kind of thing a component represents, including a control's platform-defined kind where applicable.
_Avoid_: Variant when the distinction changes the kind rather than its appearance.

**Start / end**:
The places beside the main content, before and after it in the applicable reading direction.
_Avoid_: Prefix / suffix for these places; left / right when the position follows reading direction.

**Add-on**:
Content attached outside a control's own box, with a separate ground and a dividing line. Start add-on and end add-on identify its place independently of its content.
_Avoid_: Using prefix / suffix to mean both inside content and an attached add-on.

### Messages and content states

**Toast**:
A brief result of a recent action, displayed in a corner overlay and normally dismissed automatically.
_Avoid_: Snackbar as a second name for the same concept; Toast for a persistent notice that must be addressed.

**Alert**:
A message about a section, form or content block, displayed inside that context while relevant.
_Avoid_: Note as a competing name; Banner for a message confined to one section.

**Banner**:
A page-wide or app-wide notice at the top of the page, across the view, that persists until dismissed or resolved.
_Avoid_: Project Banner as a separate concept; Alert for a notice whose scope is the whole page or app.

**Field error text**:
A validation message associated with an individual input and describing what the user must correct.
_Avoid_: Treating all field validation messages as section Alerts; Error as a separate general-purpose message category.

**Feedback**:
A form that collects the user's opinion, comments or rating about an experience.
_Avoid_: Feedback as a competing name for Toast, Alert or Banner messages sent to the user.

**Empty State**:
Content that explains why an expected collection or view has nothing to display and may offer a useful next action.
_Avoid_: Alert as a synonym for absent content; treating missing content alone as a failure.

### Containers and form groups

**Resizable**:
A layout of adjacent panes whose relative sizes the user can change.
_Avoid_: Splitter as a competing component name.

**Resizable Panel**:
One pane of a Resizable layout, with its own content and size limits.
_Avoid_: Panel as a general content surface; Card as a synonym for a resizable pane.

**Resize Handle**:
A focusable separator that controls the sizes of two adjacent panes.
_Avoid_: Separator when referring to this interactive resize control.

**Primary pane**:
The pane whose size and name a Resize Handle represents.

**Card**:
A presentation container for related content and actions about one subject. It can have sections or serve as a link.
_Avoid_: Panel or Link Card as competing names for the same surface; Entity as a synonym for Card.

**Fieldset**:
A group of related form controls identified by a shared label, with group help, errors or disabled state where applicable.
_Avoid_: Fieldset for a purely visual settings card; treating the group label as a replacement for individual control labels.

**Field**:
A control with its associated label, help and error information.
_Avoid_: Fieldset for one field; treating field presentation as the owner of form values or validation policy.

**List**:
An ordered or unordered collection of items, with optional markers and nested lists.
_Avoid_: List as a synonym for Group, Data List metadata or a selection control.

**Data List**:
A collection of metadata labels and their corresponding values.
_Avoid_: Description as a competing component name; confusing metadata with HTML datalist suggestions or a form Field.

**Sidebar**:
A side region that presents supporting content and can change between expanded, collapsed and mobile presentations.
_Avoid_: Assuming all sidebar content is a menu, tree or selection control.

**TOC**:
Navigation to headings within the current document, with an indication of the current section.
_Avoid_: Treating current location as a checked form value or as Tree View selection.

**Stat**:
A measurement with a label and optional unit, explanation and change information.
_Avoid_: Tile as a competing name for a compact measurement; a separate Trend family for its change display.

**Item**:
A reusable structure for descriptive content, including media, a heading, supporting information and actions.
_Avoid_: Entity as a competing content-row concept; treating Item as the owner of every control's navigation, selection or form behaviour.

**Tree View**:
An interactive hierarchy of expandable branches and leaf nodes, with coordinated keyboard focus.
_Avoid_: File Tree as the general concept; treating every indented navigation list as a Tree View.

**Group**:
A shared arrangement of related components with consistent presentation and applicable shared appearance defaults.
_Avoid_: Treating visual grouping as selection or form ownership; assuming every component with Group in its name has this same purpose.

**Toolbar**:
A named set of related controls for actions within a view, with coordinated keyboard navigation.
_Avoid_: Toolbar as a name for any row of controls; treating its nested controls as one selection or form value.

### Disclosure and overlays

**Accordion**:
A set of related headings and expandable panels with coordinated expansion.
_Avoid_: Collapse Group as a competing name; Accordion for every independent disclosure.

**Collapsible**:
One independently expandable section with a disclosure control.
_Avoid_: Collapse as a competing name; Show for a user-operated disclosure.

**Tooltip**:
Short non-interactive information associated with a trigger.
_Avoid_: Tooltip for a popup containing actions.

**Hover Card**:
A supplementary content preview associated with another element.
_Avoid_: Context Card as a competing name; relying on a preview as the only access to essential content.

**Toggle Tip**:
Additional help opened by explicit activation, with optional links or actions.
_Avoid_: Hover Card for help that requires deliberate activation.

**Dialog**:
A separate interaction surface for a focused task or content.
_Avoid_: Modal as the component name; assuming every Dialog is an urgent alert.

**Alert Dialog**:
An interrupting dialog for important information that expects a response.
_Avoid_: Destructive Modal as a competing component; assuming every alert dialog requires typed confirmation.

### Layout and values

**Grid**:
A layout that arranges content in rows and columns.
_Avoid_: Grid for the removed decorative guide-line family.

**Simple Grid**:
A layout for repeated responsive columns.
_Avoid_: A second name for decorative grid lines or crosses.

**Scroll Area**:
A scrollable region with design-system scrollbar controls over normal browser scrolling.
_Avoid_: Scroller as a competing component name; treating scrolling as ownership of content layout or virtualization.

**Spinner**:
An animated indication that work is running without a measured completion value.
_Avoid_: Loading Dots as another loading component.

**Progress**:
The completion state of an ongoing task, which may be measured or not yet known.
_Avoid_: Progress for a measurement such as storage usage.

**Meter**:
A display of a measured value within a meaningful range.
_Avoid_: Gauge as a competing name; Meter for task completion or a fabricated value during loading.

**Relative Time**:
A timestamp expressed in relation to the current time, such as “three minutes ago.”
_Avoid_: Relative Time Card when referring to the reusable text alone.

**Flow Diagram**:
A view of connected nodes and their directed relationships, with content and controls inside the nodes.
_Avoid_: Treating the diagram as a workflow execution engine or an authoring editor.

### Layout and control responsibilities

**Stack**:
An arrangement of children with consistent spacing and alignment.
_Avoid_: Requiring Group for ordinary layout.

**HStack / VStack**:
A horizontal or vertical Stack.
_Avoid_: Treating direction alone as a Group-specific capability.

**App Bar**:
A page or application header containing identity, navigation and optional actions.
_Avoid_: Topbar as a competing family; treating all header content as Toolbar controls.

**Segmented Control**:
An attached set of radio choices representing one selected value.
_Avoid_: Switch for this family; Tabs when no associated panels are controlled.

**Toggle Button**:
A button with a persistent on/off pressed state.
_Avoid_: Chip as a competing name for this capability; confusing pressed state with transient pointer pressing.

**Switch**:
A control that changes a binary setting between on and off.
_Avoid_: Toggle as a competing component name; Switch for a segmented choice.

### Shared interface vocabulary

**Named size**:
A relative size tier such as tiny, small, medium or large within a component.
_Avoid_: Abbreviated aliases; equating a tier with an identical dimension everywhere.

**Shape**:
The overall outline or proportions, such as circle, pill or square.
_Avoid_: Square as a synonym for sharp corners; rounded as an ambiguous name for both corners and pill ends.

**Corner radius**:
The curvature of a shape's corners.
_Avoid_: Treating radius and overall proportions as the same concept.

**Highlighted / Selected**:
Highlighted identifies the option being navigated; selected identifies a chosen collection value.
_Avoid_: Active or chosen as competing names for these states.

**Checked / Pressed**:
Checked describes a checkbox or radio's value state; pressed describes a toggle button's persistent value state.
_Avoid_: Equating persistent pressed state with temporary pointer activity.

**Current / Focused**:
Current identifies the navigation location being shown; focused identifies the element with actual focus.
_Avoid_: Treating location, focus and selection as interchangeable.

**Heading / Label**:
A heading identifies a component's visible content; a label names a control or option.
_Avoid_: Title for the heading concept; forcing an HTML heading level from the name alone.

**Description / Metadata**:
A description is supporting prose; metadata consists of structured facts about a subject.
_Avoid_: Treating the two as synonyms because they appear in the same region.

**Header / Footer**:
Regions at the beginning or end of a content structure that can contain several kinds of content.
_Avoid_: Head and foot abbreviations; treating the region itself as its heading text.

**Open / Expanded / Visible**:
Open describes a floating surface's state; expanded describes disclosure or hierarchy; visible describes actual presentation.
_Avoid_: Competing synonymous state properties; overriding native ARIA terminology.

**Sparkline**:
A compact chart showing the pattern of a series of values.
_Avoid_: Spark as a competing name for the concept.
