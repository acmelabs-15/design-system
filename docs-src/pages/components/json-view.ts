// Docs page: JSON View — mirrors https://vercel.com/geist/json-view
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "json-view",
  title: "JSON View",
  lede: "Render JSON objects and arrays as a collapsible tree with syntax coloring.",
  tags: ["acme-json-view"],
  examples: [
    {
      h: "Default",
      p: "Levels below expand-depth start collapsed.",
      html: `<acme-json-view data='{"deployment":{"id":"dpl_9WjH8QFQySx7","project":"docs","target":"production"},"request":{"method":"GET","status":200},"cached":false,"error":null}'></acme-json-view>`,
    },
    {
      h: "Expanded",
      html: `<acme-json-view expand-depth="3" data='{"deployment":{"id":"dpl_9WjH8QFQySx7","regions":["iad1","sfo1"]}}'></acme-json-view>`,
    },
    {
      h: "Highlighted",
      p: "Search matches in field names and values.",
      html: `<acme-json-view expand-depth="2" highlight="request" data='{"level":"error","requestId":"req_00042","message":"Deployment request failed","statusCode":500}'></acme-json-view>`,
    },
  ],
  practices: {
    "When to use": ["JSON the reader inspects, collapses, selects or copies; a code block for static documentation."],
    Behavior: ["Depth 1 for logs and detail surfaces, 0 for dense tables; highlight only during an active search; keep the text selectable."],
  },
};
