Decided 2026-09-19 by Peter.

# Share moving selection-indicator behaviour

Provide moving-indicator behaviour for suitable groups where only one option can be selected, such as Tabs and segmented controls. Use the selected Lit Motion package. Peter chose shared behaviour over keeping the capability specific to Tabs.

Each control keeps its own appearance and selection rules. This does not require every selection control to use one travelling indicator, replace each radio mark, or adopt another Zag dependency. The existing Material primary-tab indicator decision still governs Tabs.

The exact element/controller/helper form, participating controls, measurement contract, motion parameters and public interface remain for architecture/inventory review. Verify interruption, resized or reordered options, removed selections, scrolling, both directions, reduced motion and cleanup. No shared implementation was built.

Evidence: [indicator analysis](../analysis/animation-package.md#shared-selection-indicator).
