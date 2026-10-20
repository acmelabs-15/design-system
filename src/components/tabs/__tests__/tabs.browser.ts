import "../../../define/tabs";
import "../../../define/tab";
import "../../../define/tab-panel";

document.body.innerHTML =
  '<main><acme-tabs aria-label="Preferences views" activation="manual" value="source"><acme-tab value="source">Source</acme-tab><acme-tab value="output">Output</acme-tab><acme-tab-panel slot="panels" value="source"><input value="Retained editor"></acme-tab-panel><acme-tab-panel slot="panels" value="output">Output preview</acme-tab-panel></acme-tabs></main>';
