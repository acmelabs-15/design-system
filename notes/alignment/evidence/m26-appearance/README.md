# M26 actual-font documentation appearance

The approved fonts are Google Sans Flex and Google Sans Code, per `notes/decisions/parity-scope.md`. These checks allow the real Google Fonts stylesheet and font requests. They do not replace font files, install synthetic faces or block remote font endpoints.

The runner covers Forms, Tabs, Table and Group in light/dark appearance at 1280, 768 and 320 pixels, sequentially in Chromium, Firefox and WebKit. It captures screenshots, loaded FontFace records, font request outcomes, document/example overflow, heading/navigation bounds and bottom content clearance. Chromium's native CSS.getPlatformFontsForNode reports the actual fonts used for headings, navigation branding and native code text. Other engines expose loaded face records and computed declarations; this is not a claim of an equivalent native font-usage API in those engines.

## Initial findings

`initial-results.json` preserves the first full 72-case result. All geometry checks and example/browser-error checks pass. Google font resources return 200 and explicit font loading resolves in each engine. The first Chromium font assertion expected an exact internal family name; Chrome reports `Google Sans Flex 18pt`, so the test now accepts the actual family's optical-size suffix while still requiring custom-font glyphs. This is an oracle correction, not a font replacement.

The same native font data exposes a real defect: documentation component-name badges contain plain `<code>`, which falls through to the browser's generic monospace family and renders Courier. Computed style reports `monospace` although `--acme-font-mono` contains the approved Code family stack. The authored `site/docs.css` had only narrower code selectors. The fix applies that existing token to `.docs-main code`; no second font-family list is introduced. The same code rule now sets text-transform:none, preserving literal source names instead of inheriting Badge capitalization.

WebKit reports a successfully loaded unused Code face at explicit load completion but does not retain that loaded entry in every later viewport snapshot. The runner records FontFace objects at load completion and verifies current Sans text separately. Actual code text is checked with Chromium's native font data wherever present.

The declared monospace token first prefers the locally installed GoogleSansCode Nerd Font Mono before the web Google Sans Code face (`tools/geist/vars.ts`). On this machine Chromium correctly uses GoogleSansCode NFM Medium after the fix. `local-code-font.json` extracts the actual local TTF name records, showing the typographic family and native PostScript name. The test permits that declared local family or the downloaded Code face; it does not mistake Courier for either.

`after-css-initial-oracle.json` retains the first post-fix run, whose overly narrow mono assertion excluded this declared local family. `rebuild-interrupted-results.json` passes all 24 Chromium and WebKit cases; Firefox passes 6 cases then times out during a concurrent docs rebuild. That interrupted run is not complete acceptance.

## Run

```sh
ACME_BROWSER_RUNTIME=/absolute/path/to/playwright/runtime \
ACME_DOCS_URL=http://127.0.0.1:4180 \
ACME_CHROMIUM_PATH=/absolute/path/to/chromium \
bun notes/alignment/evidence/m26-appearance/run.ts
```

ACME_CHROMIUM_PATH is optional; Playwright selects its executable when omitted. ACME_APPEARANCE_OUTPUT overrides the evidence directory. Run after docs build completion. Final results replace `results.json`; failed checks return a nonzero exit.

## Stable-site result

The pinned Bun 1.4.2 run in results.json passes all 72 checks: 24 in Chromium 154.0.8037.57, 24 in Firefox 155.0 and 24 in WebKit 26.6. There are no JavaScript/example errors or failed font requests. Seventy-two screenshots are retained. Final screenshot inspection covers phone Table, medium dark Tabs, desktop Forms, phone dark Group, phone dark Forms, medium dark Table, desktop Tabs and desktop Group across all three engines.

Visual review then found that both new managed-form examples squeeze the Remove action at 320px. action-labels-red.json measures approximately 33px for 52px of label text in all three engines and both appearances. The corrected forms reserve the action width through Box flex longhands. [Final action-label results](action-labels.json) pass all six engine/appearance cases, each checking both Lit and React: 52px of label space for 52px of text, inside an approximately 78px action. All six refreshed 320px Forms screenshots were inspected; Remove is fully visible and the adjacent field shrinks within the preview. This closes the visual follow-up. See the [managed-form consumer checks](../m26-managed-forms/README.md). The passing font matrix remains representative font/geometry evidence, not a claim that it detects clipped text within a control.

This is not a whole-site pixel comparison, a screen-reader assessment or a real Safari test. Chromium provides native glyph-font evidence; Firefox and WebKit provide loaded FontFace records and computed declarations.
