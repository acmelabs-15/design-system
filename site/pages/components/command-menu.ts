import type { Doc } from "../../site";
const items =
  '<acme-command-group heading="Projects"><acme-command-item value="create"><acme-add-icon slot="start"></acme-add-icon>Create project</acme-command-item><acme-command-item value="open">Open project<acme-kbd slot="end" keys=\'["Mod","O"]\'></acme-kbd></acme-command-item><acme-command-item value="archive" disabled>Archive project</acme-command-item></acme-command-group><acme-command-separator></acme-command-separator><acme-command-item value="settings">Open settings</acme-command-item>';
const menu = (attributes = "") =>
  `<acme-button>Open commands</acme-button><acme-command-menu heading="Project commands" placeholder="Search actions" ${attributes}>${items}<p slot="empty">No matching commands.</p></acme-command-menu><output></output>`;
const open = 'const menu=root.querySelector("acme-command-menu");root.querySelector("acme-button").addEventListener("click",()=>menu.show());';
export const doc: Doc = {
  id: "command-menu",
  title: "Command Menu",
  lede: "Search and launch application actions with shared dialog and input behavior.",
  tags: ["acme-command-menu", "acme-command-group", "acme-command-item", "acme-command-separator"],
  examples: [
    {
      h: "Search actions",
      html: menu(),
      script:
        open +
        'menu.querySelector("acme-command-item[value=open]").keywords=["workspace"];menu.addEventListener("acme-request",event=>{if(event.detail.action==="select")root.querySelector("output").textContent="Selected: "+event.detail.value;});',
    },
    {
      h: "Application-owned pages",
      html: menu(),
      script:
        open +
        'let page="root";const initial=[...menu.children];menu.addEventListener("acme-request",event=>{if(event.detail.action==="select"&&event.detail.value==="open"){event.preventDefault();page="projects";menu.query="";menu.replaceChildren();for(const [value,label] of [["design-system","Design system"],["website","Website"]]){const item=document.createElement("acme-command-item");item.value=value;item.label=label;menu.append(item);}}else if(event.detail.action==="close"&&event.detail.reason==="escape"&&page!=="root"){event.preventDefault();page="root";menu.query="";menu.replaceChildren(...initial);}});',
    },
    { h: "Loading feedback", html: menu("loading"), script: open },
    {
      h: "Explicit load-more requests",
      html: menu('has-more load-more-threshold="80"'),
      script:
        open +
        'let loaded=false;menu.addEventListener("acme-request",event=>{if(event.detail.action!=="load-more"||loaded)return;loaded=true;const item=document.createElement("acme-command-item");item.value="help";item.label="Open help";menu.append(item);menu.hasMore=false;root.querySelector("output").textContent="Additional command supplied by the application.";});',
    },
  ],
  practices: {
    Content: [
      "Give every item a unique stable value and a readable label. Default content supplies the label; label can provide plain fallback text. keywords is a property array of search aliases.",
      "Place items and groups directly under Command Menu, and items directly under their group. Use start, end and description slots for noninteractive supporting content.",
      "Ranking preserves group boundaries and author-owned node identity. Custom filter(value, query, keywords) returns a finite nonnegative score; zero excludes the item. The keywords argument includes its visible label.",
      "Use ordinary Kbd content for shortcut hints. Hints do not register shortcuts.",
    ],
    Behavior: [
      "No global shortcut is registered by default. Set hotkey explicitly, for example Mod+K, when the application wants one. Removing it or disconnecting the component releases the registration.",
      "Query typing emits acme-input. Programmatic query and open assignments remain silent. Arrows move the active result; Enter requests selection; Escape uses Dialog dismissal. Home and End keep native text-editing behavior; Control or Meta with Home/End jumps through results.",
      "Selection emits a cancelable acme-request with action=select and the stable value. Prevent it to keep the menu open for application-owned navigation or work; otherwise it closes.",
      "The application owns pages, asynchronous results and stale-response handling. It can intercept an Escape close request to return to a previous page before allowing the dialog to close.",
      "hasMore plus a positive loadMoreThreshold enables an explicit acme-request with action=load-more and the current query. loading blocks repeat requests, and unchanged data is coalesced. The component never fetches data.",
      "Use empty, loading, error and footer slots for application feedback. The results list reports its busy state and a separate polite status reports the result count.",
    ],
  },
};
