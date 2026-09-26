const fixture = window as typeof window & { markdown: AcmeMarkdown; configureMessages: typeof configureMessages; highlighter: typeof highlighter; errors: unknown[] };
import { configureMessages } from "../../../shared/messages";

fixture.configureMessages = configureMessages;
import { AcmeScrollCorner } from "../../../components/scroll-corner/scroll-corner";
import { AcmeScrollThumb } from "../../../components/scroll-thumb/scroll-thumb";
import { AcmeScrollbar } from "../../../components/scrollbar/scrollbar";
import { AcmeScrollArea } from "../../../components/scroll-area/scroll-area";
import { AcmeScrollViewport } from "../../../components/scroll-viewport/scroll-viewport";
import { AcmeMarkdown } from "../../../components/markdown/markdown";
import { AcmeToc } from "../../../components/toc/toc";

customElements.define("acme-scroll-corner", AcmeScrollCorner);
customElements.define("acme-scroll-thumb", AcmeScrollThumb);
customElements.define("acme-scrollbar", AcmeScrollbar);
customElements.define("acme-scroll-area", AcmeScrollArea);
customElements.define("acme-scroll-viewport", AcmeScrollViewport);
customElements.define("acme-markdown", AcmeMarkdown);
customElements.define("acme-toc", AcmeToc);
import { highlighter } from "../../../shared/highlight";

document.body.innerHTML = '<acme-toc source="#article"></acme-toc><acme-markdown id="article"></acme-markdown><p id="outside">Outside prose</p>';
fixture.markdown = document.querySelector<AcmeMarkdown>("acme-markdown")!;
fixture.markdown.text =
  "## Install\n\nSome **strong** text with `inline()` code.\n\n[Details](#details)\n\n## Details\n\n| Name | Count |\n| :--- | ---: |\n| Example | 2 |\n\n```ts\nconst answer = 42;\n```\n\nA note[^a].\n\n[^a]: The note.";
fixture.highlighter = highlighter;
fixture.errors = [];
fixture.markdown.addEventListener("acme-error", (event) => fixture.errors.push((event as CustomEvent<unknown>).detail));
