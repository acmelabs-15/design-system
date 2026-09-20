Decided 2026-09-19 by Peter.

# Generalise File Tree into Tree View

Replace the file-specific family with a general Tree View for hierarchical content. File Tree becomes one composition using that hierarchy. Peter selected **General Tree View** after proposing support for files and other kinds of hierarchy.

Tree View owns hierarchy, expansion and the tree keyboard/focus contract. File-oriented names, icons, metadata and application actions sit above that shared behaviour. This does not imply filesystem access, uploads, persistence or opening files inside the library.

Chakra supplies both a general tree collection and a file-path helper returning that same collection type. MUI and APG likewise describe Tree View as a general hierarchy. The current house File Tree is principally presentation and folder expansion; implementing this direction requires a proper interaction contract, not only a rename.

Ordinary Sidebar links and TOC links retain their navigation behaviour. Visual indentation alone does not make a navigation list a Tree View. Tree View may be used inside a Sidebar or other container when its coordinated hierarchy interaction is appropriate.

Exact node inputs, stable identity, text for accessible names/type-ahead, selected versus focused state, disabled-node handling and custom content remain to specify. Multiple selection, checkbox meaning and parent/child propagation, asynchronous children, filtering, renaming, reordering and virtualization are separate scope choices. No submitted form value is implied. TanStack Virtual remains the required approach if virtualization is selected.

The established native Lit, TanStack Store, Lit Motion, generated styles and React-wrapper approach governs implementation. Chakra's Ark/Zag implementation and MUI's packages are references, not adopted dependencies.

Evidence: [joint review](../analysis/codebase-systematization.md#joint-content-selection-and-navigation-review), [source record](../alignment/evidence/joint-composition-review-2026-09-19.json). Define the File Tree/Folder/File migration in the approved inventory and Phase 5 plan before source changes.
