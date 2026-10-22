# One shared component owns selection-indicator motion

Provide one shared active-indicator component for suitable groups where only one option can be selected, such as Tabs and segmented controls. Peter clarified that Lit Motion belongs inside this component: it owns movement and resizing, and each participating control supplies the selected target. Controls must not duplicate the indicator animation. The shared component must support both horizontal and vertical orientations. This makes the earlier shared-behaviour decision concrete at the component boundary.

Decided 2026-09-19 by Peter.

Each control keeps its selection rules, accessible state, keyboard focus and visual treatment. Checkbox and multi-select controls are excluded from the travelling indicator. This does not replace each Radio mark. The existing Material primary-tab indicator decision continues to govern that treatment; the additional requested Tabs treatment is recorded in the [tab decision](0061-material-tab-indicator.md).

Retain `@lit-labs/motion`, TanStack Store and generated CSS. No Zag runtime or state machine is adopted. At the 2026-09-19 decision, the exact name, target/measurement interface, participating controls and motion parameters remained open. The later [selection contract](../../spec/SPEC-selection.md) and [execution resolutions](0035-execution-delegation.md) record the private indicator's integration. The choice between a shared component and duplicated per-control animation is settled.

Verify interruption, resized or reordered options, removed selections, scrolling, horizontal and vertical orientations, changes of orientation or text direction, RTL, reduced motion and cleanup. A moving visual must not change selection semantics or keyboard focus. Peter later selected [radio-based Segmented Control](0090-segmented-control.md) using Group presentation and the shared indicator. Its exact Field, form and control interfaces were left to the selection contract. Each consumer's supported orientation and treatment remains part of that consumer's contract. No shared implementation had been built at this 2026-09-19 checkpoint; later [indicator evidence](../verification/systematization/m10-selection-indicator-2026-09-21.json) records implementation and its scope.

Evidence: [indicator analysis](../research/02-animation-package.md#shared-selection-indicator), [Group review](../verification/systematization/group-review-2026-09-19.json).
