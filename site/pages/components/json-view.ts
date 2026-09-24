import type { Doc } from "../../site";
export const doc: Doc = {
  id: "json-view",
  title: "JSON View",
  lede: "Inspect structured values with safe property reading, expandable hierarchy and keyboard navigation.",
  tags: ["acme-json-view"],
  examples: [
    {
      h: "Structured value",
      html: '<acme-json-view expanded-depth="1" value=\'{"deployment":{"id":"dpl_42","state":"ready"},"request":{"method":"GET","status":200},"cached":false,"error":null}\'></acme-json-view>',
    },
    { h: "Single pair", html: '<acme-json-view value=\'{"status":"ready"}\'></acme-json-view>' },
    { h: "Collapsed", html: '<acme-json-view expanded-depth="0" value=\'{"request":{"id":"req_42","path":"/api/projects"},"flags":["logs","traces"]}\'></acme-json-view>' },
    {
      h: "Literal search",
      p: "String highlights match literal text, including punctuation.",
      html: '<acme-json-view highlight="request" value=\'{"requestId":"req_42","message":"The request failed","status":500}\'></acme-json-view>',
    },
    {
      h: "Configured pattern",
      html: '<acme-json-view value=\'{"service":"api","count":42,"active":true,"error":null}\'></acme-json-view>',
      script: 'root.querySelector("acme-json-view").highlight=/api|42|true|null/gi;',
    },
    {
      h: "Expansion controls",
      html: '<acme-h-stack gap="2"><acme-button data-action="expand">Expand all</acme-button><acme-button data-action="collapse" variant="secondary">Collapse all</acme-button></acme-h-stack><acme-json-view expanded-depth="1" value=\'{"deployment":{"project":{"name":"docs"}},"request":{"status":200}}\'></acme-json-view><output aria-live="polite"></output>',
      script:
        'const view=root.querySelector("acme-json-view");root.querySelector("[data-action=expand]").addEventListener("click",()=>view.expandAll());root.querySelector("[data-action=collapse]").addEventListener("click",()=>view.collapseAll());view.addEventListener("acme-expanded-change",event=>root.querySelector("output").textContent="Expanded paths: "+JSON.stringify(event.detail.expanded));',
    },
    {
      h: "Cycles and accessors",
      html: "<acme-json-view></acme-json-view>",
      script:
        'const value={status:"ready",missing:undefined};value.self=value;Object.defineProperty(value,"computed",{enumerable:true,get(){throw new Error("This getter must not run");}});root.querySelector("acme-json-view").value=value;',
    },
    {
      h: "Primitive values",
      html: '<acme-v-stack gap="2"><acme-json-view value="null"></acme-json-view><acme-json-view value="42"></acme-json-view><acme-json-view value="false"></acme-json-view><acme-json-view></acme-json-view></acme-v-stack>',
    },
  ],
  practices: {
    Data: [
      "Assign values through the value property. The value attribute accepts valid JSON for static HTML.",
      "The viewer snapshots own enumerable data properties. It labels accessors instead of reading their values and never calls toJSON or ordinary value getters.",
      "Circular references, undefined, functions, nonfinite numbers and unsupported objects have explicit markers. Sparse arrays show their present indices.",
      "Assign value again after a mutation to take a new snapshot. Unchanged object branches keep their expansion choices when their paths and identities remain the same.",
      "JavaScript Proxy reflection traps remain application code. Use ordinary records or parsed JSON when those effects are not acceptable.",
    ],
    Expansion: [
      "expandedDepth sets the initial open levels for branches without an explicit choice. Zero starts closed.",
      "expandAll and collapseAll change presentation only. User actions emit acme-expanded-change with JSON Pointer paths; the root path is an empty string.",
      "The viewer is read-only. It does not edit the supplied value.",
    ],
    Search: [
      "A string highlight is a literal case-insensitive search. Pass a RegExp property for a configured application pattern.",
      "The viewer copies regex state. The application owns the cost and trust of its configured expression.",
    ],
    Accessibility: [
      "Arrow keys move between visible nodes and open or close branches. Home and End move to the first or last visible value. Enter and Space toggle branches.",
      "Typing a prefix moves to a matching property. Focus and expansion stay separate; changing data recovers focus when a value disappears.",
      "Provide surrounding context or an aria-label for the tree. Selecting text does not toggle the selected row.",
    ],
  },
};
