# Tabs indicator paint regression

Verified 2026-09-26 during the React skill evaluation.

The original empty locator did not prove that the indicator was absent: `indicator` is the exported CSS part name, while the private span uses `part="paint"`. The actual indicator target and geometry were aligned with Output. Keyboard-only selection also painted the expected blue pixel. The claim that the indicator remained under Source was not supported.

A focused and hovered selected tab did expose a real defect. Group membership raises the focused tab to stacking level 1. The primary indicator remained at level 0, so the tab's hover background covered it. The installed React artifact returned pixel `[242,242,242,255]` where the indicator should paint `[0,114,245,255]`. Raising only the primary indicator above the tab surface changed that same pixel to blue without changing its target or rectangle. See [installed-hover-red.json](installed-hover-red.json).

The fix changes the authored Tabs primary indicator stacking level to 2. The inset indicator remains at -1 because it is the selected background behind content. Only the Tabs style producer was regenerated; selection, focus, React callbacks and animation ownership did not change.

The adjacent browser regression builds actual source components. It checks selected-target identity, geometry and screenshot pixels for primary/inset variants in horizontal/vertical orientation, with the selected tab both focused and hovered. All 12 cases pass in Chromium, Firefox and WebKit. [Results](browser-results.json).

```sh
ACME_BROWSER_RUNTIME=/path/to/playwright-runtime bun src/components/tabs/__tests__/tabs.browser-check.ts
```

`ACME_CHROMIUM_PATH` optionally selects a Chrome executable. The test uses reduced motion to measure settled paint. It samples screenshot pixels through the browser's image decoder rather than treating computed style as proof of visible output.

The original installed React artifact remains unchanged at `/tmp/acme-m24-evals/react-skilled`. Rebuilding the public package is still required to deliver the source fix to that archived consumer.
