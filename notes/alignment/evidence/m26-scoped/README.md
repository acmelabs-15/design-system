# M26 scoped registration and document adoption

Core class and explicit-registration imports are inert. React wrappers intentionally register globally.

## Reproduction and correction

`source-red.json` preserves the original current-source result:9 of10 outcomes pass per engine. Button's owned loading Spinner remains an unupgraded HTMLElement, although Spinner is defined in the same enclosing registry. AcmeElement attached a default-registry shadow root and used Lit's default document creation scope.

The corrected `source-results.json` passes17 of17 outcomes in Chrome154.0.8037.57, Playwright Firefox155.0 with scoped-registry polyfill0.0.10, and WebKit26.6. There are no browser errors.

- Class-only and explicit-registration imports leave the global registry unchanged.
- Two registries resolve identical public names to different application subclasses.
- `register(registry)` includes owned public and private dependencies. Repeated calls preserve compatible application subclasses. Unrelated constructors produce a TypeError and are not replaced.
- Button's Spinner and Tabs' private selection indicator render in the correct local scope. Clicking the second Tab updates its family value and aria-selected state.
- Input synchronously participates in native FormData inside the local scope.
- Reconnection retains the element and its canonical value.
- Box style inputs and constructed styles survive adoption into a same-origin active iframe and back.
- Markdown creates its owned Scroll Area/Viewport and JSONView creates its disclosure icons in the local registry, including after adoption. Literal factory calls remain inputs to generated dependency discovery.
- A fresh owned Spinner created after adoption keeps its original registry and uses the destination document.
- A definition supplied before adoption upgrades correctly in all three engines.

`@acmelabs/design-system/register/<name>` exports `register(registry)`. The generated module imports class constructors and calls the same operation for its dependency graph, including private parts. It performs no registration at module evaluation. Existing `define/<name>` modules invoke that graph with global `customElements`. Class-only component exports remain unchanged.

AcmeElement reads the native element registry, which stays fixed after creation, and carries it into owned shadow roots. For the scoped-registry polyfill it reads the containing root's `customElements`. Lit's public `renderOptions.creationScope.importNode` uses the current root ownerDocument and the selected native registry, or the polyfill root's public importNode. No private Lit hook or global fallback registration is used.

## Imperative creation and native platform control

`imperative-red.json` restores only the three former document.createElement calls in the source-bundle transform. Markdown and JSONView then fail in all three engines despite registration of their dependencies. `createScopedElement` now selects the component registry, with a polyfill root factory where required. Source scanning covers these literal calls, including import aliases; unbounded names fail generation. The canonical factory is a call-site analysis boundary: scanning its generic implementation would add every custom-element name as a dependency. A regression with ownerDocument.createElement in the factory body reproduces that failure before the boundary correction. The authored source scan finds no other imperative custom-element creation paths.

The first native factory used destinationDocument.createElement with the original registry. `imperative-adoption-red.json` preserves its WebKit failure after adoption. The independent bare HTMLElement comparison in `native-cross-document-control.ts` reproduces the same WebKit NotSupportedError; Chromium succeeds. Creating a new empty element in a template’s inert document and importing it with the explicit registry works in both. The factory uses that standard importNode construction, like Lit’s scoped template instantiation. It does not clone an author element or its state.

## Retained external boundary

A first definition supplied after an unknown node is adopted works in native Chrome/WebKit. It fails in Firefox's scoped-registry polyfill0.0.10 for both core Box and a bare HTMLElement control. Explicit registry.upgrade on the element and root does not repair it. Loading the same polyfill in both documents does not repair the bare control. This reproduces the earlier M05 platform boundary. Applications using this polyfill define elements before adopting them.

The polyfill is the exact saved M05 browser artifact; each result records its SHA256. This is a tested compatibility mode, not automatic installation of a global polyfill by the library.

## Run

Source diagnostic:

```sh
ACME_SCOPED_PACKAGE="$PWD" ACME_SCOPED_SOURCE=1 bun notes/alignment/evidence/m26-scoped/run.ts
```

Final package:

```sh
ACME_SCOPED_PACKAGE=/absolute/path/to/consumer/node_modules/@acmelabs/design-system bun notes/alignment/evidence/m26-scoped/run.ts
```

Add `ACME_SCOPED_CDN=1` to run the same fixture against the copied browser registration modules and their shared class/runtime graph. `ACME_SCOPED_RESULTS` selects an output file, `ACME_SCOPED_WORK` selects the scratch directory and optional `ACME_CHROMIUM_PATH` selects an installed Chromium executable. Otherwise Playwright selects its own Chromium. Failed or missing results and browser errors produce a nonzero exit.

The package directory must be a stable built install whose dependencies resolve. `results.json` holds the final-package output. Do not run while the referenced dist tree is being rebuilt. The runner uses the existing Playwright cache or ACME_BROWSER_RUNTIME. Source probes use TypeScript's legacy decorator transform; an initial Bun-decorator harness attempt failed before component execution and is not component evidence.

The local0.3.0 build passes all17 outcomes in each engine in both delivery modes: bundled compiled class/registration entries (`build-results.json`) and direct CDN modules (`build-cdn-results.json`). CDN imports include public/private dependencies and use the same class constructors as the browser class entries. These are build checks, not fresh archive checks. The final clean0.3 archive passes the same17 outcomes per engine in both module and CDN modes: [module](../m26-final/scoped-module.json), [CDN](../m26-final/scoped-cdn.json). Same-origin active-document checks do not certify inert documents, cross-origin frames or every component's lifecycle.

## Sources read

- [Lit RenderOptions](https://lit.dev/docs/api/templates/#render), plus installed lit-html.d.ts creationScope documentation.
- [Lit scoped-registry mixin source](https://raw.githubusercontent.com/lit/lit/main/packages/labs/scoped-registry-mixin/src/scoped-registry-mixin.ts), read in full. Its polyfill interface uses customElements and root.importNode.
- [Native scoped registries](https://developer.chrome.com/blog/scoped-registries).
- [Element.customElementRegistry](https://developer.mozilla.org/en-US/docs/Web/API/Element/customElementRegistry): the registry belongs to element creation and does not change after association.
- [DOM importNode](https://dom.spec.whatwg.org/#dom-document-importnode): scoped registry and selfOnly options.

Build-harness note: the first workspace run resolved direct imports through packages/core/dist symlinks while relative imports used the real dist path, creating duplicate bundled constructors. The runner now resolves entry paths through realpath. The first CDN run correctly failed before generated browser registration files existed; the build copier correction and complete rerun pass. Neither initial attempt counts as accepted evidence.
