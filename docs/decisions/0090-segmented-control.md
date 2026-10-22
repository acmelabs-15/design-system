# Use radio behaviour for Segmented Control

Provide Segmented Control as one selected value, built on shared Radio Group behaviour and form participation, Group's attached presentation and the shared animated indicator. Peter selected “Radio-based choice.” The migration removes the earlier Switch/Switch Control interfaces; the earlier Toggle becomes Switch as already decided.

Decided 2026-09-19 by Peter.

This follows Peter's earlier Radio-plus-Group direction. Chakra uses radio-group behaviour, whereas the reviewed Radix and Material Lit implementations use toggle-button machinery. Tabs remains the component for associated content panels. Independent pressed buttons belong to [Toggle Button](0111-toggle-button.md).

The shared indicator owns Lit Motion, including horizontal and vertical movement. Group does not acquire selection/form ownership. Exact values, initial/empty selection, orientation support, parts and nested Toolbar key rules belong to the later [selection contract](../../spec/SPEC-selection.md). One effective owner handles each key or gesture; no duplicate selection or focus engine.

Evidence: [source and comparison](../research/06-codebase-systematization.md#phase-2-closure-review), [answers](../verification/systematization/phase-2-closure-2026-09-19.json).
