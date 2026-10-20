import type { Doc } from "../../site";

export const doc: Doc = {
  id: "show",
  title: "Show",
  lede: "Mount content or a fallback from an explicit template.",
  tags: ["acme-show"],
  examples: [
    {
      h: "Conditional content",
      html: '<acme-button variant="secondary">Switch content</acme-button><acme-show><template><label>Note <input value="New note"></label></template><template slot="fallback"><p>No note is open.</p></template></acme-show>',
      script: 'const show=root.querySelector("acme-show");root.querySelector("acme-button").addEventListener("click",()=>show.when=!show.when);',
    },
    {
      h: "Preserve state",
      html: '<acme-button variant="secondary">Switch content</acme-button><acme-show preserve-state><template><label>Note <input value="Retained note"></label></template><template slot="fallback"><p>Your note remains mounted.</p></template></acme-show>',
      script: 'const show=root.querySelector("acme-show");root.querySelector("acme-button").addEventListener("click",()=>show.when=!show.when);',
    },
  ],
  practices: {
    Content: [
      "when=false mounts the fallback; when=true mounts the default template. Content is removed on each switch unless preserveState is true.",
      "Use renderContent and renderFallback for Lit template functions. Do not pass markup strings or expect ordinary children to be conditionally owned.",
      "The inactive preserved branch is hidden and inert. Focus in a departing branch moves to a control in the new branch, or to the named branch itself. Focus elsewhere stays where it is.",
    ],
  },
};
