# @acmelabs/design-system-devtools

An optional, read-only component inspector. Lit and React applications mount the
same tool. Install the exact version that matches `@acmelabs/design-system`.

```ts
import { createDesignSystemInspector } from '@acmelabs/design-system-devtools';

const inspector = createDesignSystemInspector({
  root: document.querySelector('#application')!,
  eventLimit: 100,
});
inspector.mount(document.querySelector('#inspector')!);

// On route or application teardown:
inspector.dispose();
```

Import it only in the application's development branch. The core and React
packages do not import this package. It adds TanStack Devtools UI and Solid to the
development build. The application supplies a real mount container; the inspector
does not install a global trigger, keyboard shortcut or settings record.

## Lifecycle

`mount(container)` starts observation and displays the panel. `unmount()` removes
the panel and releases component controllers, DOM observers and event listeners.
It also clears retained snapshots and event records. A later `mount` starts again.
`dispose()` performs that cleanup permanently. The container and inspected root
must belong to the same document. Place the container beside or inside the root;
it cannot contain the inspected root. The inspector's own surface is excluded.

## Diagnostic snapshots

The package's adapter uses Lit's public `addController`/`removeController`
interface. `hostUpdated` triggers a fresh read of properties named by the generated
public manifest. DOM observation discovers insertion/removal, attributes and open
shadow roots. Removed elements release their subscriptions. The ancestor chain
is observed only for theme/style invalidation; ancestors are not collected as
inspected components unless they are inside the chosen root.

Each component has an identity that stays stable across detach/reconnect, its
release/tag, declared public inputs/attributes, declared custom states, effective
light/dark appearance, and computed theme/custom-property values. Recent declared
public events carry the same identity. Private fields and stores are not read.
CSS values are observations of the rendered element, not a second theme model.
Closed shadow roots and changes made only by external CSSOM operations without a
component/DOM update are outside automatic observation.

The event buffer defaults to 100, supports 0 to disable event retention and has an
upper bound of 1,000. Values are copied with limits on strings, object depth,
property count and array length. Snapshots retain no application objects or DOM
nodes. Password/secret/token/file fields and password-control values are redacted
before retention. File objects are summarized, never read. An application can
explicitly set `includeSensitiveValues: true` to show sensitive primitive values;
structural bounds and file-content exclusion still apply.

## Interface and scope

The interface uses the public TanStack Devtools UI components with Solid. It does
not embed the broader Devtools shell, source inspector, SEO scanner, marketplace
or event bus. It has no edit commands, remote transport, telemetry or global
configuration writes. The UI layer uses its packaged styles and embedded fonts.

The optional runtime embeds its two font files as data URLs so downstream bundlers
can move the JavaScript without breaking font paths. Font licenses and runtime
provenance ship under dist/licenses. None of these dependencies or font data enter
normal core or React production bundles.
