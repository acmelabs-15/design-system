# Rich content and media — R12

**Status: approved contract.** Peter approved the complete proposal set on 2026-09-20. The stated recommendations are selected; explicitly recorded later resolutions are incorporated below. [Approval](../docs/decisions/0049-inventory-approval.md). Verification evidence retains its original date and scope.

**Approved family contract.** primitives, shared state, generated CSS, TanStack highlighting/Markdown and Lit Motion remain required. Inputs below define the approved interface; source evidence comes from the [complete current declaration snapshot](../docs/verification/systematization/current-public-interfaces-2026-09-20.json) and the referenced source files. No old aliases survive migration.

## RC-01 Code Block

**Tag:** acme-code-block. **Inputs:** code="", language="", filename="", lineNumbers=true, highlightedLines/addedLines/removedLines: readonly positive integer[]=[], referencedLine?: positive integer, copyable=true, wrap=false. Line numbers are one-based. Duplicate switcher/tabs state and external v0 action coupling remain removed; language/file selection is composed with Select/Tabs and application-owned code.

Default slot is not a competing code source. Slots header/start/end/footer and empty; parts root/header/code/line/line-number/footer. Public method scrollToLine(number). Events acme-request { action:"reference-line", line } on explicit line activation and acme-error { code:"highlight", message } on highlighting failure. Copy Button reuses full unstyled source text.

Render escaped code through TanStack Highlight. Preserve meaningful source lines/trailing newline; invalid line numbers do not create phantom content. On highlighter failure show safe plain text, not an empty success. Long code supports Scroll Area and optional wrapping; reading/copying must work without per-line tabindex noise.

**Acceptance:** languages supported by installed package, malformed source text, overlapping line decorations, empty content, hidden/reopened blocks, very long lines, copy correctness, dynamic code and listener cleanup. Source: src/components/code-block/code-block.ts; Pro Code Block examples in [docs review](../docs/research/09-documentation-site.md#complete-pro-documentation-and-kit-evidence).

## RC-02 Snippet

**Tag:** acme-snippet. Inputs text: string|readonly string[]="", copyText?: string, prompt=true, copyable=true, variant: default|success|error|warning=default, size: small|medium=medium. String arrays display separate lines; copy joins them with newline. copyText overrides copied data only when supplied.

Slots start/end; parts root/code/prompt/actions. Use Copy Button, inline Code and optional Scroll Area. No separate writable copied state, dark theme boolean, compact alias or notFocusable escape hatch. Theme scope controls appearance; keyboard access remains complete. No own public event beyond composed copy result; no duplicate redispatch.

Acceptance: single/multiple lines, command prompts excluded from copy, explicit copy override, clipboard failure, text escaping, themes and accessible action label. Source: src/components/snippet/snippet.ts and retained Geist examples.

## RC-03 JSON View

**Tag:** acme-json-view. Inputs value: unknown (absent undefined), expandedDepth: nonnegative integer=3, highlight?: string|RegExp, readOnly=true (fixed viewer scope). Data is a property; a documented JSON value attribute supports static valid JSON. Do not evaluate code or ordinary getters while traversing. The later [JSON View analysis](../docs/research/15-lit-practice-review.md#m21-json-view-in-progress) distinguishes this from arbitrary executable Proxy reflection traps, which are outside the no-getter guarantee.

Parts root/item/key/value/toggle; no content slots that become another value source. Method expandAll()/collapseAll() operates presentation only. Event acme-expanded-change { expanded: string[] } for user expansion; data remains application-owned. Detect cycles and show a stable circular-reference marker; objects/functions not representable as JSON are labelled rather than executed. Expansion keys use stable encoded paths and reset only for replaced subtrees.

Acceptance: arrays/objects/primitives/null, undefined/missing, circular/deep data, special key names, escaping, regex safety, keyboard disclosure and large collections. Historical data/defaultExpandDepth names remain replaced without aliases; code path src/components/json-view/json-view.ts supplies baseline, not complete hierarchy accessibility.

## RC-04 Markdown

**Tag:** acme-markdown. Inputs text="", allowHtml=false, lineNumbers=false. One text source; no default-slot HTML interpreted as Markdown. Output is component-owned native light-DOM prose with generated scoped document CSS; native root/prose hooks replace a claim of shadow-only parts. This gives its generated headings real fragment targets and makes TOC discovery possible without inspecting private roots. React/Lit supply text, not competing children inside the component-owned output. Links/images/code use styling and selected packages.

Use TanStack Markdown and Highlight. Preserve allowHtml=false and the existing explicit trusted-content-only opt-in. The installed parser documents sanitized normal link/image URLs; raw HTML mode is not a sanitizer. Do not promise safe rendering of untrusted raw HTML or add a sanitizer dependency silently. The original Q09 retained this trust boundary; verify it without expanding scope: no remote fetching, evaluation or execution of code fences.

Events acme-error { code:"parse"|"highlight", message }; safe plain-text fallback on parse failure. Mounting creates no persistent script listeners from content. Relative-link resolution must be explicit in the consuming page's context.

Acceptance: headings/lists/tables/fences, inline code in search indexing, links/images, malicious HTML/URLs, long content, locale/RTL, stable headings/TOC and highlight failures. Source: src/components/markdown/markdown.ts and selected package decisions. The trusted-only raw-HTML path must be documented separately from default escaped rendering.

## RC-05 Book

**Tag:** acme-book. Inputs heading="", variant: stripe|simple=stripe, color?: CSS color, textColor?: CSS color, width: shared responsive size input=196px (numeric size tokens or CSS lengths; common responsiveTarget/responsiveContainer apply), textured=false. Slots illustration/start; parts root/cover/spine/content. Native semantic content is decorative/product presentation, not an action unless an explicit Link composition surrounds suitable content.

Keep the established hover/tilt motion and interruption/reduced-motion behavior through Lit Motion. The [complete Book motion decision](../docs/decisions/0065-motion-on-the-book.md) owns detailed spring/transform constraints and source values; this entry does not replace it with generic CSS transitions. The final interface uses heading and start; the old visible title and icon slot remain removed.

Acceptance: both appearances, illustration replacement, pointer leave/reenter, interrupted motion, reduced motion, resize/zoom and generated textures. Preserve source/census fixtures for src/components/book/book.ts with only named deviations.

## RC-06 Browser

**Tag:** acme-browser. Inputs address="", label?: accessible frame name. Default slot supplies preview content; parts root/chrome/address/content. It is a presentation frame, not an iframe renderer, browser engine or navigation owner. Address text is escaped. No events/methods or synthetic browser control buttons without actions.

Acceptance: long addresses, arbitrary responsive content, keyboard access to descendants, contrast/zoom, screenshots without misleading focus targets. Source: src/components/browser/browser.ts and Geist frame reference. Phone is removed; mobile preview is a constrained Box/Browser recipe where useful.

## RC-07 Video

**Tag:** acme-video. Native video is the owner. Inputs src="", poster="", controls=true, playsInline=true, muted=true, loop=true, autoplay defaults to !reducedMotion as in the source, preload: none|metadata|auto=auto; loading: eager|lazy=lazy. Width defaults to the source-equivalent 600px and height to intrinsic; explicit dimensions use the shared CSS-size contract. Surrounding layout owns outside spacing. Author native source/track children directly in the stable getVideoElement() target: DOM append, Lit render or React portal. This preserves their actual video parent and framework ownership. The fallback slot remains on the host; native children are not cloned or moved from framework-owned ranges.

Methods play(): `Promise<void>`, pause(), getVideoElement(): HTMLVideoElement. Forward meaningful native play/pause/ended/error once; do not report successful play when its promise rejects. No acme-play duplicate. Parts root/video; slot fallback for unavailable media.

Retain the assigned source's preference-sensitive autoplay default; the original Q10 did not select a different default. Browser autoplay policy still applies. Lazy loading and preference changes must not override an explicit user pause or silently restart after reconnection. The external-spacing migration is evaluated against the existing margin-ownership rule rather than mechanically copying gallery spacing.

Acceptance: rejected autoplay, controls/keyboard, captions, source errors, lazy intersection, resize/aspect ratio, user pause persistence and reduced motion. Source src/components/video/video.ts. The original proposal review downloaded or played no remote media. Later [Video acceptance](../docs/verification/systematization/m21-video-2026-09-23.json) records actual native playback/autoplay checks. Its deterministic WebKit keyboard path uses native fullscreen Space; inline traversal and actual Safari/assistive technology remain distinct verification limits.
