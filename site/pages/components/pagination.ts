import type { Doc } from "../../site";

const apply =
  'const pager=root.querySelector("acme-pagination");pager.addEventListener("acme-request",event=>{if(event.detail.action==="page")pager.page=event.detail.page;if(event.detail.action==="page-size"){pager.pageSize=event.detail.pageSize;pager.page=1;}});';
export const doc: Doc = {
  id: "pagination",
  title: "Pagination",
  lede: "Coordinated result navigation with application-owned pages, page size and data loading.",
  tags: ["acme-pagination", "acme-pagination-previous", "acme-pagination-next", "acme-pagination-item", "acme-pagination-ellipsis", "acme-pagination-position", "acme-pagination-page-size"],
  examples: [
    { h: "Numbered", html: '<acme-pagination count="100"></acme-pagination>', script: apply },
    { h: "Compact", html: '<acme-pagination count="100" variant="compact"></acme-pagination>', script: apply },
    {
      h: "Position and page size",
      html: '<acme-pagination count="142"><acme-pagination-position></acme-pagination-position><acme-pagination-previous></acme-pagination-previous><acme-pagination-item page="1"></acme-pagination-item><acme-pagination-item page="2"></acme-pagination-item><acme-pagination-ellipsis></acme-pagination-ellipsis><acme-pagination-next></acme-pagination-next><acme-pagination-page-size></acme-pagination-page-size></acme-pagination>',
      script: apply,
    },
    { h: "Unknown total", p: "The application explicitly says whether another page is available.", html: '<acme-pagination variant="compact" has-next-page></acme-pagination>', script: apply },
    {
      h: "Attached controls",
      html: '<acme-pagination count="40"><acme-group attached><acme-pagination-previous></acme-pagination-previous><acme-pagination-item page="1"></acme-pagination-item><acme-pagination-item page="2"></acme-pagination-item><acme-pagination-item page="3"></acme-pagination-item><acme-pagination-item page="4"></acme-pagination-item><acme-pagination-next></acme-pagination-next></acme-group></acme-pagination>',
      script: apply,
    },
    {
      h: "Real links",
      p: "Links keep normal browser navigation. This example maps result pages to URL parameters.",
      html: '<acme-pagination count="100"></acme-pagination>',
      script: 'root.querySelector("acme-pagination").getPageUrl=page=>"?results-page="+page;',
    },
    { h: "Loading and empty results", html: '<acme-v-stack><acme-pagination count="100" loading></acme-pagination><acme-pagination count="0" variant="compact"></acme-pagination></acme-v-stack>' },
  ],
  practices: {
    Ownership: [
      "Handle acme-request to update page or pageSize. The component does not fetch, slice results or reset the current page.",
      "The optional Page Size part starts with [10,25,50]. Supply its options property for other choices. The current supplied size is always represented.",
      "A failed load can leave the page unchanged. Clear loading to allow retry.",
    ],
    Semantics: [
      "Previous, Next and numbered items are ordinary buttons unless href or getPageUrl supplies a destination.",
      "A known count of zero reads No results. Without count, the position reads only the current page and Next requires hasNextPage=true.",
      "An out-of-range supplied page stays unchanged. Previous requests the last valid page; application code decides whether to accept it.",
      "Numbered items announce their page and expose aria-current on the current item. Ellipses are not actions.",
    ],
    Composition: [
      "Use ordinary layout for position, actions and page-size controls. Use Group when attached action surfaces are needed.",
      "For a jump-to-page field, compose Number Input and handle its requested value in the application.",
      "Previous/next documentation links are ordinary Link and Stack composition, separate from result pagination.",
    ],
  },
};
