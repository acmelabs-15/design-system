# Component library

The reusable elements and documented arrangements that give artifacts a consistent design language. Related tooling terms live in the context linked from [the context map](CONTEXT-MAP.md).

## Language

### Building blocks and interfaces

**Component**:
A reusable part of the house design system with a defined purpose and a consistent interface.
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
Content attached outside a field's own box, with a separate ground and a dividing line. Start add-on and end add-on identify its place independently of its content.
_Avoid_: Using prefix / suffix to mean both inside content and an attached add-on.

### Messages and content states

**Toast**:
A brief result of a recent action, displayed in a corner overlay and normally dismissed automatically.
_Avoid_: Snackbar as a second name for the same house concept; Toast for a persistent notice that must be addressed.

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

**Card**:
A presentation container for related content and actions about one subject. It can have sections or serve as a link.
_Avoid_: Panel or Link Card as competing names for the same surface; Entity as a synonym for Card.

**Fieldset**:
A group of related form controls identified by a shared label, with group help, errors or disabled state where applicable.
_Avoid_: Fieldset for a purely visual settings card; treating the group label as a replacement for individual control labels.

**Group**:
A shared arrangement of related components with a consistent presentation.
_Avoid_: Treating visual grouping as selection or form ownership; assuming every component with Group in its name has this same purpose.

**Toolbar**:
A named set of related controls for actions within a view, with coordinated keyboard navigation.
_Avoid_: Toolbar as a name for any row of controls; treating its nested controls as one selection or form value.
