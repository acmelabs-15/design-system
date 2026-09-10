# JSON View

Render JSON objects and arrays as a collapsible tree with syntax coloring, keyboard navigation, search highlighting and selectable text.

## Default

Levels strictly below default-expand-depth start open (3 when unset). Depth 1 opens the first level, so the reader scans the object without opening every nested value.

```html
<acme-json-view default-expand-depth="1" data='{"deployment":{"id":"dpl_9WjH8QFQySx7","project":"docs","target":"production","state":"ready"},"request":{"method":"GET","path":"/api/search","status":200,"durationMs":42},"cached":false,"error":null}'></acme-json-view>
```

## Single line

An open object with one short primitive pair renders on one line. Nested and long values stay multiline.

```html
<acme-json-view default-expand-depth="1" data='{"foo":"bar"}'></acme-json-view>
```

## Embedded

The tree flows with the text before and after it.

```html
<div class="text-copy-13" style="white-space:pre-wrap;word-break:break-all;font-family:var(--mono)">
  <span>ClickHouse slow query detected queryStats:</span>
  <acme-json-view default-expand-depth="1" data='{"read_rows":8866333,"read_bytes":1220624299,"elapsed_ms":10513774868,"result_rows":39,"chunks_queried":1,"total_chunks":1,"stopped_early":false}'></acme-json-view>
  <span>, endpoint: 'GET /api/logs/request-logs'</span>
</div>
```

## Wrapped

A long primitive value takes the multiline layout and wraps to the width it has.

```html
<acme-json-view default-expand-depth="1" data='{"browserApiUrl":"https://browser-api.vercel.sh/screenshot?url=https%3A%2F%2Fprocore-com-prod-f5vem4o6u-marketing-web-dev.vercel.app&width=1440&height=900&fullPage=true"}'></acme-json-view>
```

## Collapsed

Depth 0 keeps the surface compact; the reader opens the object they want.

```html
<acme-json-view default-expand-depth="0" data='{"trace":{"spanId":"span_7Qk9b4","parentId":"span_root","service":"api"},"request":{"id":"req_00042","path":"/api/projects","method":"GET"},"flags":["enable-logs-json-rendering","observability-panel"]}'></acme-json-view>
```

## Highlighted

highlight-pattern is a case-insensitive regular expression that marks matching field names and primitive values; makeJsonViewHighlightPattern(terms) builds one from search terms (terms of at least two characters) for the property.

```html
<acme-json-view default-expand-depth="1" highlight-pattern="request|failed" data='{"level":"error","requestId":"req_00042","deploymentId":"dpl_9WjH8QFQySx7","message":"Deployment request failed","statusCode":500}'></acme-json-view>
```

## `<acme-json-view>`

JSON view: an object or array as a collapsible tree (role tree) in mono 13/20, flowing inline
with the text around it. Every node is a tree item with a roving tab index; an object or array
row has a toggle (chevron, key, bracket) over the block of its child rows, or an ellipsis when
collapsed; an open object with one short primitive pair stays on one line; a primitive row is
the key and the value, colored by kind (string, number, boolean, null). Arrow keys move through
the visible nodes and open or close them, Enter and Space toggle, Home and End jump, a typed
character jumps to the next node whose label starts with it. `highlight-pattern` marks matches in
keys and primitive values. Levels below `default-expand-depth` (3) start open.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `data` | `data` | `unknown` | `{}` | The object or array to render; JSON in the attribute. |
| `default-expand-depth` | `defaultExpandDepth` | `number` | `3` | Levels strictly below this depth start expanded: 1 opens the root only, 0 collapses it. |
| `highlight-pattern` | `highlightPattern` | `RegExp \| string \| null` | `null` | A regular expression (or its source, in the attribute; case-insensitive) that marks matching keys and primitive values; null when nothing is searched. |

## Best Practices

**When to use**

- JSON View is for objects and arrays the reader inspects, scans, collapses, expands, selects or copies.
- Prefer it to a raw JSON string when the nesting matters, or when log lines carry structured payloads.
- A code block is for static documentation, not an interactive product surface.

**Behavior**

- Start with default-expand-depth 1 on log and detail surfaces, where the top-level fields help by default.
- Use default-expand-depth 0 in dense tables, compact previews and rows where open JSON would compete with the row content.
- Set highlight-pattern only during an active search; leave it empty when nothing is searched.
- Pass the data as an object or array. Do not stringify JSON before handing it to data.

**Accessibility**

- The element is a tree. Arrow keys move between visible nodes, Enter and Space toggle an expandable node, Home and End jump to the first and last visible node, a typed character jumps to the next node whose label starts with it.
- Keep the element near the text or control that introduces the JSON. The tree's accessible label is JSON, so the surrounding context names the object.
- Keep the text selectable. Readers copy JSON from logs and traces into search, support and debugging tools; a click that ends a text selection does not toggle the node.

