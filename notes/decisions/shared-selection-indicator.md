Decided 2026-09-19 by Peter.

# One shared component owns selection-indicator motion

Provide one shared active-indicator component for suitable groups where only one option can be selected, such as Tabs and segmented controls. Peter clarified that Lit Motion belongs inside this component: it owns movement and resizing, and each participating control supplies the selected target. Controls must not duplicate the indicator animation. The shared component must support both horizontal and vertical orientations. This makes the earlier shared-behaviour decision concrete at the component boundary.

Each control keeps its selection rules, accessible state, keyboard focus and visual treatment. Checkbox and multi-select controls are excluded from the travelling indicator. This does not replace each Radio mark. The existing Material primary-tab indicator decision continues to govern that treatment; the additional requested Tabs treatment is recorded in the [tab decision](material-tab-indicator.md).

Retain `@lit-labs/motion`, TanStack Store and generated CSS. No Zag runtime or state machine is adopted. The exact public name, target/measurement interface, participating controls and motion parameters remain for architecture/inventory review. The choice between a shared component and duplicated per-control animation is settled.

Verify interruption, resized or reordered options, removed selections, scrolling, horizontal and vertical orientations, changes of orientation or text direction, RTL, reduced motion and cleanup. A moving visual must not change selection semantics or keyboard focus. Peter later selected [radio-based Segmented Control](segmented-control.md) using Group presentation and the shared indicator. Its exact Field, form and control interfaces remain to specify. Each consumer's supported orientation and visual treatment still belong in its inventory entry. No shared implementation was built.

Evidence: [indicator analysis](../analysis/animation-package.md#shared-selection-indicator), [Group review](../alignment/evidence/group-review-2026-09-19.json).
