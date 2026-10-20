const fixture = window as typeof window & { snippet: AcmeSnippet; copied: string[]; fail: boolean; events: { name: string; detail: unknown }[] };
import { AcmeCode } from "../../../components/code/code";
import { AcmeCheckIcon } from "../../../generated/icons/classes/check-icon";
import { AcmeContentCopyIcon } from "../../../generated/icons/classes/content-copy-icon";
import { AcmeSpinner } from "../../../components/spinner/spinner";
import { AcmeCopyButton } from "../../../components/copy-button/copy-button";
import { AcmeScrollCorner } from "../../../components/scroll-corner/scroll-corner";
import { AcmeScrollThumb } from "../../../components/scroll-thumb/scroll-thumb";
import { AcmeScrollbar } from "../../../components/scrollbar/scrollbar";
import { AcmeScrollArea } from "../../../components/scroll-area/scroll-area";
import { AcmeScrollViewport } from "../../../components/scroll-viewport/scroll-viewport";
import { AcmeSnippet } from "../../../components/snippet/snippet";
import { AcmeArrowBackIcon } from "../../../generated/icons/classes/arrow-back-icon";
import { AcmeArrowForwardIcon } from "../../../generated/icons/classes/arrow-forward-icon";
import { AcmeRefreshIcon } from "../../../generated/icons/classes/refresh-icon";
import { AcmeBrowser } from "../../../components/browser/browser";

customElements.define("acme-code", AcmeCode);
customElements.define("acme-check-icon", AcmeCheckIcon);
customElements.define("acme-content-copy-icon", AcmeContentCopyIcon);
customElements.define("acme-spinner", AcmeSpinner);
customElements.define("acme-copy-button", AcmeCopyButton);
customElements.define("acme-scroll-corner", AcmeScrollCorner);
customElements.define("acme-scroll-thumb", AcmeScrollThumb);
customElements.define("acme-scrollbar", AcmeScrollbar);
customElements.define("acme-scroll-area", AcmeScrollArea);
customElements.define("acme-scroll-viewport", AcmeScrollViewport);
customElements.define("acme-snippet", AcmeSnippet);
customElements.define("acme-arrow-back-icon", AcmeArrowBackIcon);
customElements.define("acme-arrow-forward-icon", AcmeArrowForwardIcon);
customElements.define("acme-refresh-icon", AcmeRefreshIcon);
customElements.define("acme-browser", AcmeBrowser);
document.body.innerHTML =
  '<acme-snippet id="snippet"></acme-snippet><acme-browser id="browser" label="Project preview" address="https://www.example.com/"><input id="preview" aria-label="Preview input"></acme-browser>';
fixture.snippet = document.querySelector<AcmeSnippet>("#snippet")!;
fixture.snippet.text = ["bun install", "bun run test"];
fixture.copied = [];
fixture.fail = false;
Object.defineProperty(navigator, "clipboard", {
  configurable: true,
  value: {
    writeText: async (value: string) => {
      if (fixture.fail) {
        throw new Error("denied");
      }
      fixture.copied.push(value);
    },
  },
});
fixture.events = [];
for (const name of ["acme-copy", "acme-error"]) {
  fixture.snippet.addEventListener(name, (event) => fixture.events.push({ name, detail: (event as CustomEvent<unknown>).detail }));
}
