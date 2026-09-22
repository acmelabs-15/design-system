Decided 2026-09-21 by Peter.

# Finish the approved migration without further decision questions

Peter instructed: “No more questions. Just do all the things that you would recommend doing when you have a question. I just want you to finish.” The agent now resolves remaining implementation, interface and package choices by taking its best evidence-supported recommendation, records the choice and continues. This supersedes the question/approval pauses for those choices in this pass.

The approved inventory, migration scope, evidence standard and verification requirements still govern the work. New findings require investigation and an updated record. They do not require another interview. Continue through implementation, review and final acceptance; do not treat a completed subtask or a passing prototype as completion of the migration.

The immediate application is the recommended @lit/context dependency for theme discovery and subscription transport. TanStack remains the canonical state owner. See [theme architecture](theme-resolution-architecture.md).

## Default-true property attributes — 2026-09-21

Implementation choice under Peter's delegated execution: keep approved boolean property names and defaults, and use an explicitly string-valued HTML attribute where a true default must be turned off in static HTML. Separator's boolean `decorative` property defaults to true; `decorative="false"` opts into separator semantics. Omission restores true. Ordinary boolean attributes whose property defaults to false retain native presence/absence behavior; `disabled="false"` does not enable a control.

The original blanket rule forbidding false strings conflicts with approved default-true properties and static HTML authoring. Lit documents that a default-true property cannot be set false through a native boolean attribute and recommends renaming or a string/number attribute. Preserve the selected names and use the latter approach. Reuse the existing default-true converter; no second alias or negative flag. [Lit boolean attributes](https://lit.dev/docs/components/properties/#boolean-attributes). The Separator unit/manifest and three-engine checks are recorded in the [M07 evidence](../alignment/evidence/m07-separator-2026-09-21.json).

## Typography implementation resolutions — 2026-09-21

Under this delegation, Relative Time uses `format` for long/short/narrow wording and `autoUpdate` (`auto-update`) for automatic refresh. The proposal's `style` and `update` names conflict with HTMLElement.style and LitElement.update. Preserve those platform members and replace the proposed names outright; add no aliases. ISO date-only values mean UTC midnight. ISO timestamps require an offset. Valid inputs normalize to an owned epoch value; invalid inputs produce no invented time. The installed @internationalized/date parser supplies the ISO validation.

Relative Time selects elapsed-duration units, including approximate months/years. It schedules the next rounded-value or unit transition with one owner-window timeout and releases it on disconnect. This retains the locale-sensitive Intl formatter without the removed popup. The reviewed [Shoelace implementation](https://raw.githubusercontent.com/shoelace-style/shoelace/next/src/components/relative-time/relative-time.component.ts) supplies the threshold reference; house tests cover boundaries, zero and lifecycle. No Shoelace or Moment runtime is added.

Kbd's `size` remains its approved small/medium tier; it does not also accept CSS font-size strings. The other shared typography properties still apply. Named key labels use the installed TanStack Hotkeys display formatter, with no hotkey registration. `configureMessages(locale, stringRecord)` supplies application-owned built-in labels. Catalogs are copied, frozen, replaced per locale and resolved through locale ancestry. Kbd's visible and accessible labels have separate keys; accessible text avoids relying on symbol pronunciation. This shared message catalog is the return point for later built-in control labels.

Heading exposes its native heading and registers its authored host ID through a private heading-target protocol. TOC (M16) consumes public native headings and registered house hosts; Markdown (M21) retains native content. The protocol does not crawl arbitrary private shadow roots or invent IDs. These choices implement the approved interfaces and resolve concrete platform collisions; they do not reopen the scope.

## Activity presentation — 2026-09-21

Spinner's omitted/empty label is decorative. A supplied translated label supplies the status text and accessible name through one local text node, with explicit aria-atomic semantics. The application or consuming control owns surrounding busy state. This avoids guessing ownership through ancestor inspection. Search/ComboBox and Button/Menu Button expose their own busy state when composing an unnamed Spinner. [W3C status-message guidance](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA22) supports text inside the status container.

Use the approved five size tiers with the first five source geometries and cycle periods. Lit Motion owns opacity; generated CSS owns static blade placement. Explicitly dispose replaced directive controllers through public Lit APIs, retain generation guards and honor live reduced-motion changes. Icon Tile is a presentation container and preserves its child's accessible meaning; its size is an explicit CSS length and its public part is root.

## Native action implementation — 2026-09-21

Use a persistent hidden native submitter in the author's form tree and a native shadow form to bridge the visible action's uncanceled default. Native submitter identity, form data, submit/reset, overrides, external form ownership and implicit Enter pass in all three engines. No event-method patches or synthetic submitter identity are needed. Name the action through visible content or ARIA. The autonomous host is not a native label-for target. This resolves the engineering gate under Peter's delegation; [the action evidence](../alignment/evidence/m09-actions-2026-09-21.json) preserves the limits and tests.

Copy Button's success feedback remains owned by its one action and status region. The default feedback changes from copy to check after clipboard success, then resets; no additional decorative transition is required by the approved contract. Optional press ripple uses the shared Lit Motion controller. Loading retains existing focus while suppressing activation; explicit disabled retains native unfocusable behavior. Compact action sizes use dedicated size/padding roles, not changes to global spacing, text, icon or border scale.

## Identity implementation resolutions — 2026-09-21

Avatar uses native image loading with a separate loaded/error state and source-generation checks. A missing source makes no network request. Explicit initials take priority; otherwise derive first/last word initials with Intl word and grapheme segmentation in the inherited locale. Empty labels make the avatar image decorative; badge content retains separate meaning. Tiny/small/medium/large retain 16/24/32/48px geometry and explicit CSS width preserves a square footprint.

Avatar Group shows all real members when they fit, reserves one bounded slot for overflow when needed, and renders extra-only one as +1. limit=0 shows all supplied members. Count messages use avatarGroup.more plus the locale's plural category (for example avatarGroup.more.one and avatarGroup.more.other), with {count} substitution. Keyed immutable records preserve identity. Count surfaces retain dark black/white contrast through the corresponding theme tokens without resetting every color in the subtree.

Tag's existing 20px treatment is medium; small/large use 16/24px passive-label geometry with 6/10px inline padding. Badge/Pill retain 20/24/32px tiers. These passive sizes do not set the target size for action controls; removable Tag examples compose an explicitly named Icon Button. [Implementation analysis](../analysis/codebase-systematization.md#m09-identity-implementation-review--2026-09-21).

## Selection card action region — 2026-09-21

Expose an actions slot on Checkbox Card and Radio Card for the approved independent secondary-action region. Render it as a sibling of the native label activation surface. This makes the approved behavior concrete without nesting interactive actions inside a label. Heading/description/start/end/default remain selectable card content. General Group joins the outer card surface; the control and its logical selection group still own checked state and submission. Checkbox Cards retain individual marks and never use the travelling single-selection indicator.

## Selection notification boundaries — 2026-09-21

Selection controls and collections expose their own acme-change notifications. An independent action in a card keeps its own direct handler; its notification stops at the containing selection boundary rather than reaching ordinary Card/Group change handlers with the wrong payload. Native click/input/focus events keep normal platform propagation. Capturing instrumentation can still observe descendant events. This matches the approved separation of selection and independent actions and the source hook's owner-specific onValueChange callback. A real Toggle Button in actions reproduced the payload leak in all three engines before the guard.

## Logical collection appearance defaults — 2026-09-21

For selection members, resolve size as explicit member input, then the nearest general Group input, then the owning collection's size when that collection supports it, then the component default. This gives Checkbox Group's approved size property a useful defaulting role without overwriting an authored child size or taking appearance ownership away from a nearer general Group. Variant stays with the member and general Group; Checkbox Group supplies no variant. The existing appearance helper gains an optional readonly fallback source; behavior is unchanged for components without that source.

## Private indicator delivery and spring mapping — 2026-09-21

Under Peter's execution delegation, keep acme-selection-indicator under src/internal with @internal and a generated private definition. Public owning families register it transitively. Consumer exports, manifest/API pages and standalone CDN entries expose public families only. This implements S-07's approved internal boundary.

Map the selected Standard/Expressive roles through Lit Motion's public SpringController using unit mass and physical damping derived from the source damping ratio. Standard/default spatial serves the recurring selection indicator; no global scheme is chosen. The theme catalog exposes all 24 numeric role parameters. [Source and implementation evidence](../alignment/evidence/m10-selection-indicator-2026-09-21.json) records provenance, tested behavior and remaining integration gates.
