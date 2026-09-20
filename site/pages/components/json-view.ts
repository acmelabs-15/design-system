// Docs page: JSON View — mirrors https://vercel.com/geist/json-view
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "json-view",
  title: "JSON View",
  lede: "Render JSON objects and arrays as a collapsible tree with syntax coloring, keyboard navigation, search highlighting and selectable text.",
  tags: ["acme-json-view"],
  examples: [
    {
      h: "Default",
      p: "Levels strictly below default-expand-depth start open (3 when unset). Depth 1 opens the first level, so the reader scans the object without opening every nested value.",
      html: `<acme-json-view default-expand-depth="1" data='{"deployment":{"id":"dpl_9WjH8QFQySx7","project":"docs","target":"production","state":"ready"},"request":{"method":"GET","path":"/api/search","status":200,"durationMs":42},"cached":false,"error":null}'></acme-json-view>`,
    },
    {
      h: "Single line",
      p: "An open object with one short primitive pair renders on one line. Nested and long values stay multiline.",
      html: `<acme-json-view default-expand-depth="1" data='{"foo":"bar"}'></acme-json-view>`,
    },
    {
      h: "Embedded",
      p: "The tree flows with the text before and after it.",
      html: `<div class="text-copy-13" style="white-space:pre-wrap;word-break:break-all;font-family:var(--mono)"><span>ClickHouse slow query detected queryStats: </span><acme-json-view default-expand-depth="1" data='{"read_rows":8866333,"read_bytes":1220624299,"elapsed_ms":10513774868,"result_rows":39,"chunks_queried":1,"total_chunks":1,"stopped_early":false}'></acme-json-view><span>, endpoint: 'GET /api/logs/request-logs'</span></div>`,
    },
    {
      h: "Wrapped",
      p: "A long primitive value takes the multiline layout and wraps to the width it has.",
      html: `<acme-json-view default-expand-depth="1" data='{"browserApiUrl":"https://browser-api.vercel.sh/screenshot?url=https%3A%2F%2Fprocore-com-prod-f5vem4o6u-marketing-web-dev.vercel.app&width=1440&height=900&fullPage=true"}'></acme-json-view>`,
    },
    {
      h: "Collapsed",
      p: "Depth 0 keeps the surface compact; the reader opens the object they want.",
      html: `<acme-json-view default-expand-depth="0" data='{"trace":{"spanId":"span_7Qk9b4","parentId":"span_root","service":"api"},"request":{"id":"req_00042","path":"/api/projects","method":"GET"},"flags":["enable-logs-json-rendering","observability-panel"]}'></acme-json-view>`,
    },
    {
      h: "Highlighted",
      p: "highlight-pattern is a case-insensitive regular expression that marks matching field names and primitive values; makeJsonViewHighlightPattern(terms) builds one from search terms (terms of at least two characters) for the property.",
      html: `<acme-json-view default-expand-depth="1" highlight-pattern="request|failed" data='{"level":"error","requestId":"req_00042","deploymentId":"dpl_9WjH8QFQySx7","message":"Deployment request failed","statusCode":500}'></acme-json-view>`,
    },
    {
      h: "Nested", census: true,
      p: "The default depth (3) opens the nested rows: an object and an array with their closing brackets on their own line, an empty object without a toggle, single pairs on one line, a long single pair stacked, and marks on a number, a boolean and null.",
      html: `<acme-json-view highlight-pattern="api|42|true|null" data='{"trace":{"spanId":"span_7Qk9b4","service":"api"},"apiTags":["api","edge"],"apiMeta":{},"note":{"id":42},"ok":{"flag":true},"none":{"value":null},"name":{"api":"api"},"url":{"href":"https://browser-api.vercel.sh/screenshot?url=https%3A%2F%2Fexample.vercel.app&width=1440"},"count":42,"active":true,"error":null}'></acme-json-view>`,
    },
    {
      h: "Inline kinds", census: true,
      p: "A single pair of each value kind on one line, with marks on the key and the value.",
      html: `<acme-json-view highlight-pattern="api|42|true|null" data='{"api":"api"}'></acme-json-view> <acme-json-view highlight-pattern="api|42|true|null" data='{"n":42}'></acme-json-view> <acme-json-view highlight-pattern="api|42|true|null" data='{"b":true}'></acme-json-view> <acme-json-view highlight-pattern="api|42|true|null" data='{"z":null}'></acme-json-view>`,
    },
  ],
  practices: {
    "When to use": [
      "JSON View is for objects and arrays the reader inspects, scans, collapses, expands, selects or copies.",
      "Prefer it to a raw JSON string when the nesting matters, or when log lines carry structured payloads.",
      "A code block is for static documentation, not an interactive product surface.",
    ],
    Behavior: [
      "Start with default-expand-depth 1 on log and detail surfaces, where the top-level fields help by default.",
      "Use default-expand-depth 0 in dense tables, compact previews and rows where open JSON would compete with the row content.",
      "Set highlight-pattern only during an active search; leave it empty when nothing is searched.",
      "Pass the data as an object or array. Do not stringify JSON before handing it to data.",
    ],
    Accessibility: [
      "The element is a tree. Arrow keys move between visible nodes, Enter and Space toggle an expandable node, Home and End jump to the first and last visible node, a typed character jumps to the next node whose label starts with it.",
      "Keep the element near the text or control that introduces the JSON. The tree's accessible label is JSON, so the surrounding context names the object.",
      "Keep the text selectable. Readers copy JSON from logs and traces into search, support and debugging tools; a click that ends a text selection does not toggle the node.",
    ],
  },
};
