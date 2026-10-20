import type { Doc } from "../../site";

export const doc: Doc = {
  id: "load-more-button",
  title: "Load More",
  lede: "Request another set of results without submitting a form.",
  tags: ["acme-load-more"],
  examples: [
    {
      h: "Load results",
      html: "<p data-results>10 results</p><acme-load-more></acme-load-more>",
      script:
        'const button=root.querySelector("acme-load-more");let count=10;button.addEventListener("acme-request",e=>{if(e.detail.action!=="load-more")return;count+=10;root.querySelector("[data-results]").textContent=count+" results";});',
    },
    { h: "Loading", html: "<acme-load-more loading></acme-load-more>" },
    { h: "Disabled", html: "<acme-load-more disabled></acme-load-more>" },
    { h: "Full width", html: "<acme-load-more full-width>Load more activity</acme-load-more>" },
  ],
  practices: {
    Behavior: [
      "Listen for acme-request with action=load-more. The application owns fetching, loading, errors, result counts and the end of the data.",
      "Set loading while a request is pending to block repeat activation. Keep the action in place so focus remains stable.",
      "Use shared button styling and ordinary layout for width and spacing. Render end-of-data or placeholder content explicitly.",
    ],
  },
};
