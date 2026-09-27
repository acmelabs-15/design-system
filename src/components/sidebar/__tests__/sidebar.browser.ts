import { AcmeSidebar } from "../sidebar";
import { AcmeSidebarTrigger } from "../../sidebar-trigger/sidebar-trigger";
import { AcmeSidebarContent } from "../../sidebar-content/sidebar-content";
import { AcmeDrawer } from "../../drawer/drawer";
import { AcmeDrawerClose } from "../../drawer-close/drawer-close";
import { AcmeSpinner } from "../../spinner/spinner";
import { AcmeOverlayTheme } from "../../../internal/overlay-theme/overlay-theme";

for (const [name, ctor] of Object.entries({
  "acme-sidebar": AcmeSidebar,
  "acme-sidebar-trigger": AcmeSidebarTrigger,
  "acme-sidebar-content": AcmeSidebarContent,
  "acme-drawer": AcmeDrawer,
  "acme-drawer-close": AcmeDrawerClose,
  "acme-spinner": AcmeSpinner,
  "acme-overlay-theme": AcmeOverlayTheme,
})) {
  customElements.define(name, ctor);
}
document.body.innerHTML = `<style>body{margin:20px}nav{display:grid;gap:16px;padding:12px}acme-sidebar{display:block}input{max-width:100%;box-sizing:border-box}</style><button id="before">Before</button><acme-sidebar id="sidebar" aria-label="Project navigation"><acme-sidebar-trigger slot="trigger">Toggle navigation</acme-sidebar-trigger><acme-sidebar-content><nav aria-label="Projects"><a href="#overview">Overview</a><a href="#activity">Activity</a><label>Filter <input id="filter" value="Kept"></label><acme-drawer-close>Close navigation</acme-drawer-close></nav><nav slot="collapsed" aria-label="Compact projects"><a href="#overview" aria-label="Overview">O</a></nav></acme-sidebar-content></acme-sidebar><button id="after">After</button>`;
(window as typeof window & { original: HTMLInputElement }).original = document.querySelector<HTMLInputElement>("#filter")!;
