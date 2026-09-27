# @acmelabs/design-system-react

Typed React 19 components backed by the same Lit elements as `@acmelabs/design-system`. Install matching versions of the two packages, plus React and React DOM.

Import components individually to load their definitions and required parts:

```tsx
import { useRef } from 'react';
import { Input } from '@acmelabs/design-system-react/components/input';
import type { AcmeInput } from '@acmelabs/design-system/components/input';
import '@acmelabs/design-system/styles/tokens.css';

function NameField() {
  const input = useRef<AcmeInput>(null);
  return <Input ref={input} name="name" aria-label="Name"
    onAcmeInput={event => console.log(event.detail.value)} />;
}
```

Refs expose the actual custom element. Declared events use camel-case callback names: `acme-change` becomes `onAcmeChange`. Native event names use names such as `onPlay`. Callbacks receive the native event, including its typed detail. Methods and read-only state are available through the ref.

JSX props use the element's property names and types. Removing a prop restores its declared default or absent value. Appearance inputs return to inherited values when their setters support omission. Complete styling prop sets retain their declaration order, including reorder-only renders. A later render reapplies supplied props after an imperative edit. `className`, `style`, native attributes and named `slot` children work through React.

Children remain owned by React. Fieldset creates its native fieldset ancestor before connection; put a native `legend` with `slot="legend"` among its children. List, Data List and Table accept their documented native `ul`/`ol`, `dl` and `table` structures.

For components with controlled content mounting, `renderContent` and `renderFallback` return React nodes:

```tsx
import { Show } from '@acmelabs/design-system-react/components/show';

<Show when={editing} preserveState
  renderContent={() => <Editor />}
  renderFallback={() => <p>Select Edit to start.</p>} />
```

The underlying element decides when content mounts and unmounts. Tabs and disclosure components retain their existing lazy-mount and exit behavior. React keeps the state and cleanup of the content it creates.

Video places unassigned children directly in its native video element. This supports real React-owned `source` and `track` nodes. Use `slot="fallback"` for unavailable-media content. The ref's `getVideoElement()` exposes the native media APIs.

Wrappers register elements in the document's global custom-element registry. Rendering into a shadow root does not select a different component implementation. The package is for browser rendering; server rendering is outside its supported contract.

The package root exports every wrapper, including the full icon catalog. Individual component imports avoid that full registration cost. Icon names that start with a number use an `Icon` prefix in JavaScript: `acme-10k-icon` is `Icon10k` from `components/10k-icon`.

The build generates props and event contracts from the core package's standard custom-elements manifest. The packages share one state, form, selection, overlay and rendering implementation.
