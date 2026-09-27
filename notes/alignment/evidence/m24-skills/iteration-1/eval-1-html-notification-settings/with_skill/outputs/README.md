# HTML artifact evaluation

`index.html` is the complete notification settings artifact. It uses version 0.2.0 token CSS and seven selective definition modules. Save renders the browser's actual FormData entries. The form has no network submission or separate state engine.

Run the unpublished-package verification from this directory:

```sh
bun server.ts
```

In another terminal:

```sh
bun verify.ts
```

The harness opens real Chrome and maps exact versioned jsDelivr URLs to the installed package through the local Bun server. The delivered HTML retains the versioned CDN URLs. CDN publication and screen reader announcements were not tested.

All eight final checks pass. The artifact was unchanged after its first build. The first harness run used a button selector that matched both the visible control and its documented hidden submitter. Those failures, plus the resulting keyboard-state failure, remain in `first-attempt-result.json`. The only repair narrowed that test selector to the visible root; the full rerun passed. `result.json` retains the first failures and repair record.

`accessibility-final.json` contains the native Chromium accessibility tree; `screenshot.png` shows the rendered form after reset. The screenshot was visually inspected and shows readable labels, controls, and the receipt without clipping.

Skills used: the installed package's `html-artifacts` and `forms-and-accessibility`. Sources used: `skills/references/release.json`, release 0.2.0 index, settings-rows recipe, and Input, Field, Fieldset, Radio Group, Radio, Switch, and Button records. The release index has no dedicated native-form recipe; the settings-rows recipe supplies its native-form pattern.
