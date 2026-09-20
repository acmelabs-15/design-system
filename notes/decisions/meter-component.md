Decided 2026-09-19 by Peter.

# Rename Gauge to Meter

Replace Gauge with Meter, preserving its circular measured-value display. Peter selected “Meter” over keeping the Gauge name. A bounded measurement such as storage usage or cache hit rate is distinct from task progress such as upload completion.

The current Gauge documentation recommends measurement uses while the implementation renders `role="progressbar"`. [W3C's Meter pattern](https://www.w3.org/WAI/ARIA/apg/patterns/meter/) distinguishes these meanings; Base UI and React Aria use Meter. Correct the semantics for known measurements rather than merely rename the tag.

Loading a measurement must not announce an invented value. The earlier requirement for animated loading remains; exact loading representation, missing/error/zero handling, valid ranges, value formatting, thresholds and shared circular rendering remain inventory work. This does not choose the public interface or all shapes of Progress, or retain every old Stat helper.

Evidence: [measurement source review](../analysis/codebase-systematization.md#disclosure-layout-and-smaller-component-dispositions), [selection record](../alignment/evidence/disposition-checkpoint-2026-09-19.json).
