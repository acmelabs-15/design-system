Decided 2026-09-19 by Peter.

# Shape morphing follows demonstrated component needs

Support shape changes and morphing where the design system has a concrete need. Peter clarified that we should not simply port all Material shape morphing or adopt its complete shape catalogue. Identify the required transition first, then choose the smallest suitable implementation.

The earlier “support both and create our own port where needed” discussion was recorded too broadly as a requirement for Material's abstract shape library. This clarification supersedes that catalogue requirement. The earlier accidental option selection remains withdrawn; it is not the reason for this correction.

Use ordinary properties such as corner radius, size, position and transforms when they can express the required behaviour. Add custom geometry only when a demonstrated transition needs it. Material remains a reference for behaviour and technique. Lit Motion remains the animation engine, with the rest of the house stack governing the implementation.

No geometry package or complete shape port is selected. The explored material-shapes-ts and shape-morph libraries remain background candidates. Exact transitions are defined during architecture/inventory review. Verify interruption, reduced motion, closure/interpolation where relevant, clipping, focus and usable interaction targets. Preserve provenance and license notices for any geometry later reused or ported.

Evidence and candidate limits: [animation analysis](../analysis/animation-package.md#phase-1-extension-material-motion-and-shapes).
