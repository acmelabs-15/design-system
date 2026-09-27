import { AcmeScrollCorner } from "../../scroll-corner/scroll-corner";

customElements.define("acme-scroll-corner", AcmeScrollCorner);
import { AcmeScrollThumb } from "../../scroll-thumb/scroll-thumb";

customElements.define("acme-scroll-thumb", AcmeScrollThumb);
import { AcmeScrollbar } from "../../scrollbar/scrollbar";

customElements.define("acme-scrollbar", AcmeScrollbar);
import { AcmeScrollViewport } from "../../scroll-viewport/scroll-viewport";

customElements.define("acme-scroll-viewport", AcmeScrollViewport);
import { AcmeScrollArea } from "../../scroll-area/scroll-area";

customElements.define("acme-scroll-area", AcmeScrollArea);
import { AcmeResizable } from "../../resizable/resizable";
import { AcmeResizablePanel } from "../../resizable-panel/resizable-panel";
import { AcmeResizeHandle } from "../../resize-handle/resize-handle";

customElements.define("acme-resizable", AcmeResizable);
customElements.define("acme-resizable-panel", AcmeResizablePanel);
customElements.define("acme-resize-handle", AcmeResizeHandle);
document.body.innerHTML =
  '<acme-resizable id="root" sizes="[30,70]" style="width:600px;height:240px"><acme-resizable-panel id="navigation" value="navigation" min-size="10" max-size="90" collapsible aria-label="Navigation"><input id="input" value="Retained"><div>Navigation content</div></acme-resizable-panel><acme-resize-handle id="handle"></acme-resize-handle><acme-resizable-panel id="content" value="content" min-size="10" aria-label="Editor"><button id="edit">Edit</button></acme-resizable-panel></acme-resizable><button id="outside">Outside</button>';
