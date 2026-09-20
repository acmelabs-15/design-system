Decided 2026-09-19 by Peter.

# Use radio behaviour for Segmented Control

Provide Segmented Control as one selected value, built on shared Radio Group behaviour and form participation, Group's attached presentation and the shared animated indicator. Peter selected “Radio-based choice.” Remove the existing Switch/Switch Control interfaces during migration; the existing Toggle becomes Switch as already decided.

This follows Peter's earlier Radio-plus-Group direction. Chakra uses radio-group behaviour, whereas the reviewed Radix and Material Lit implementations use toggle-button machinery. Tabs remains the component for associated content panels. Independent pressed buttons belong to [Toggle Button](toggle-button.md).

The shared indicator owns Lit Motion, including horizontal and vertical movement. Group does not acquire selection/form ownership. Exact values, initial/empty selection, orientation support, parts and nested Toolbar key rules remain inventory work. One effective owner handles each key or gesture; no duplicate selection or focus engine.

Evidence: [source and comparison](../analysis/codebase-systematization.md#phase-2-closure-review), [answers](../alignment/evidence/phase-2-closure-2026-09-19.json).
